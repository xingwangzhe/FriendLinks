import * as THREE from "three";

/** Return a world-space hit distance, or null; ordinary meshes keep triangle tests. */
export type InstanceRaycast = (instanceId: number, raycaster: THREE.Raycaster) => number | null;
export type PickableInstancedMesh = THREE.InstancedMesh & { raycastInstance?: InstanceRaycast };

interface Entry {
  index: number;
  sphere: THREE.Sphere;
}

interface Branch {
  bounds: THREE.Box3;
  entries?: Entry[];
  left?: Branch;
  right?: Branch;
}

const LEAF_SIZE = 12;
const AXES = ["x", "y", "z"] as const;

/** A lower bound, including zero when the ray starts inside the box. */
function boxEntry(ray: THREE.Ray, box: THREE.Box3): number {
  let near = 0;
  let far = Infinity;
  for (const axis of AXES) {
    const direction = ray.direction[axis];
    const origin = ray.origin[axis];
    if (direction === 0) {
      if (origin < box.min[axis] || origin > box.max[axis]) return Infinity;
      continue;
    }
    const a = (box.min[axis] - origin) / direction;
    const b = (box.max[axis] - origin) / direction;
    near = Math.max(near, Math.min(a, b));
    far = Math.min(far, Math.max(a, b));
    if (near > far) return Infinity;
  }
  return near;
}

function buildBranch(entries: Entry[]): Branch | null {
  if (!entries.length) return null;

  const bounds = new THREE.Box3();
  const sphereBounds = new THREE.Box3();
  for (const entry of entries) {
    entry.sphere.getBoundingBox(sphereBounds);
    bounds.union(sphereBounds);
  }
  if (entries.length <= LEAF_SIZE) return { bounds, entries };

  const size = bounds.getSize(new THREE.Vector3());
  const axis = size.x >= size.y && size.x >= size.z ? "x" : size.y >= size.z ? "y" : "z";
  entries.sort((a, b) => a.sphere.center[axis] - b.sphere.center[axis]);
  const middle = Math.floor(entries.length / 2);
  return {
    bounds,
    left: buildBranch(entries.slice(0, middle))!,
    right: buildBranch(entries.slice(middle))!,
  };
}

/**
 * Static positions, with a conservative allowance for focus scaling. Only the
 * broad phase uses cached bounds; triangle tests always use the current matrices.
 */
export class InstancedNodePicker {
  private root: Branch | null;
  private readonly localRay = new THREE.Ray();
  private readonly inverseWorld = new THREE.Matrix4();
  private readonly instanceMatrix = new THREE.Matrix4();
  private readonly candidateMesh: THREE.Mesh;
  private readonly branches: Branch[] = [];
  private readonly branchDistances: number[] = [];
  private readonly sphereHit = new THREE.Vector3();
  private readonly hits: THREE.Intersection[] = [];
  /** Useful for profiling how many instances reached the exact triangle test. */
  lastCandidateCount = 0;

  constructor(
    private readonly mesh: PickableInstancedMesh,
    maxScale = 1.5,
  ) {
    this.candidateMesh = new THREE.Mesh(mesh.geometry, mesh.material);
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
    const geometrySphere = mesh.geometry.boundingSphere!;
    // Center the bound on the instance origin so future scale/rotation changes
    // remain safe even for geometry whose bounding sphere is not origin-centered.
    const baseRadius = geometrySphere.center.length() + geometrySphere.radius;
    const entries: Entry[] = [];
    for (let index = 0; index < mesh.count; index++) {
      mesh.getMatrixAt(index, this.instanceMatrix);
      entries.push({
        index,
        sphere: new THREE.Sphere(
          new THREE.Vector3().setFromMatrixPosition(this.instanceMatrix),
          baseRadius * this.instanceMatrix.getMaxScaleOnAxis() * Math.max(1, maxScale),
        ),
      });
    }
    this.root = buildBranch(entries);
  }

  dispose() {
    this.root = null;
    this.branches.length = 0;
    this.branchDistances.length = 0;
    this.hits.length = 0;
    this.lastCandidateCount = 0;
  }

  pick(raycaster: THREE.Raycaster): number | null {
    this.branches.length = 0;
    this.branchDistances.length = 0;
    this.lastCandidateCount = 0;
    if (!this.root || !raycaster.layers.test(this.mesh.layers)) return null;

    this.inverseWorld.copy(this.mesh.matrixWorld).invert();
    this.localRay.copy(raycaster.ray).applyMatrix4(this.inverseWorld);
    // Ray.applyMatrix4 normalizes the transformed direction. This factor maps
    // exact world hit distances back into BVH-local units, including nonuniform
    // mesh transforms, without transforming or allocating a point per branch.
    const e = this.inverseWorld.elements;
    const direction = raycaster.ray.direction;
    const localDistanceScale = Math.hypot(
      e[0] * direction.x + e[4] * direction.y + e[8] * direction.z,
      e[1] * direction.x + e[5] * direction.y + e[9] * direction.z,
      e[2] * direction.x + e[6] * direction.y + e[10] * direction.z,
    );
    this.branches.push(this.root);
    this.branchDistances.push(boxEntry(this.localRay, this.root.bounds));
    this.candidateMesh.geometry = this.mesh.geometry;
    this.candidateMesh.material = this.mesh.material;
    let closestDistance = Infinity;
    let closestIndex: number | null = null;
    const raycastInstance = this.mesh.raycastInstance;
    const acceptHit = (index: number, distance: number) => {
      if (!Number.isFinite(distance) || distance < 0 || distance < raycaster.near || distance > raycaster.far) return;
      if (
        distance < closestDistance ||
        (distance === closestDistance && (closestIndex === null || index < closestIndex))
      ) {
        closestDistance = distance;
        closestIndex = index;
      }
    };
    const limit = () => {
      const distance = Math.min(closestDistance, raycaster.far) * localDistanceScale;
      // Conservative tolerance avoids pruning a tangent/identical-distance hit
      // solely due to coordinate-transform rounding.
      return distance + Math.max(1, distance) * 1e-9;
    };
    while (this.branches.length) {
      const branch = this.branches.pop()!;
      const entryDistance = this.branchDistances.pop()!;
      if (!Number.isFinite(entryDistance) || entryDistance > limit()) continue;
      if (branch.entries) {
        for (const entry of branch.entries) {
          if (entry.index >= this.mesh.count) continue;
          let sphereDistance = 0;
          if (!entry.sphere.containsPoint(this.localRay.origin)) {
            if (!this.localRay.intersectSphere(entry.sphere, this.sphereHit)) continue;
            sphereDistance = this.sphereHit.distanceTo(this.localRay.origin);
          }
          if (sphereDistance > limit()) continue;
          this.lastCandidateCount++;
          if (raycastInstance) {
            const distance = raycastInstance.call(this.mesh, entry.index, raycaster);
            if (distance !== null) acceptHit(entry.index, distance);
          } else {
            this.mesh.getMatrixAt(entry.index, this.instanceMatrix);
            this.candidateMesh.matrixWorld.multiplyMatrices(this.mesh.matrixWorld, this.instanceMatrix);
            this.hits.length = 0;
            this.candidateMesh.raycast(raycaster, this.hits);
            for (const hit of this.hits) acceptHit(entry.index, hit.distance);
          }
        }
      } else {
        const left = branch.left!;
        const right = branch.right!;
        const leftDistance = boxEntry(this.localRay, left.bounds);
        const rightDistance = boxEntry(this.localRay, right.bounds);
        // Visit the nearer branch first; once it hits, farther branches can be
        // rejected before testing every occluded instance along the same ray.
        if (leftDistance <= rightDistance) {
          this.branches.push(right, left);
          this.branchDistances.push(rightDistance, leftDistance);
        } else {
          this.branches.push(left, right);
          this.branchDistances.push(leftDistance, rightDistance);
        }
      }
    }
    this.hits.length = 0;
    return closestIndex;
  }
}
