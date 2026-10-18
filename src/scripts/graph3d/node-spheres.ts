import * as THREE from "three/webgpu";
import { instancedBufferAttribute, uv } from "three/tsl";

/** Keep upload ranges bounded: sequential initialization merges into one range. */
function markRange(attribute: THREE.BufferAttribute, start: number, count: number) {
  const ranges = attribute.updateRanges;
  const last = ranges[ranges.length - 1];
  if (last && start <= last.start + last.count && start + count >= last.start) {
    const end = Math.max(last.start + last.count, start + count);
    last.start = Math.min(last.start, start);
    last.count = end - last.start;
  } else if (ranges.length < 8) {
    attribute.addUpdateRange(start, count);
  } else {
    let low = start;
    let high = start + count;
    for (const range of ranges) {
      low = Math.min(low, range.start);
      high = Math.max(high, range.start + range.count);
    }
    attribute.clearUpdateRanges();
    attribute.addUpdateRange(low, high - low);
  }
}

/**
 * Keep full CPU instance matrices and the original sphere geometry for picking,
 * while only center/radius + RGBA8 reach the GPU. The invisible proxy material
 * prevents the sphere triangles/matrix attributes from entering a render list.
 */
export class NodeSphereInstances extends THREE.InstancedMesh {
  readonly centerRadius: THREE.InstancedBufferAttribute;
  override instanceColor: THREE.InstancedBufferAttribute;
  readonly visual: THREE.Sprite;
  private disposed = false;
  private readonly pickMatrix = new THREE.Matrix4();
  private readonly pickInverse = new THREE.Matrix4();
  private readonly pickRay = new THREE.Ray();
  private readonly pickSphere = new THREE.Sphere(new THREE.Vector3(), 1);
  private readonly pickPoint = new THREE.Vector3();

  constructor(count: number) {
    const proxyMaterial = new THREE.MeshBasicMaterial({ visible: false });
    super(new THREE.SphereGeometry(1, 6, 4), proxyMaterial, count);
    this.frustumCulled = false;
    this.centerRadius = new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4);
    this.centerRadius.setUsage(THREE.DynamicDrawUsage);
    this.instanceColor = new THREE.InstancedBufferAttribute(new Uint8Array(count * 4), 4, true);
    this.instanceColor.setUsage(THREE.DynamicDrawUsage);
    const colorArray = this.instanceColor.array as Uint8Array;
    colorArray.fill(255);

    const center = instancedBufferAttribute<"vec4">(this.centerRadius, "vec4");
    const color = instancedBufferAttribute<"vec4">(this.instanceColor, "vec4");
    const circle = uv().mul(2).sub(1);
    const distanceSquared = circle.dot(circle);
    const surface = distanceSquared.oneMinus().max(0).sqrt();
    const material = new THREE.SpriteNodeMaterial({
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
      toneMapped: false,
    });
    material.positionNode = center.xyz;
    material.scaleNode = center.w.mul(2);
    material.maskNode = distanceSquared.lessThanEqual(1);
    material.colorNode = color.rgb.mul(surface.mul(0.25).add(0.75));

    this.visual = new THREE.Sprite(material);
    // Own the quad rather than disposing Sprite's globally shared geometry.
    this.visual.geometry = new THREE.PlaneGeometry(1, 1);
    this.visual.geometry.setAttribute("nodeCenterRadius", this.centerRadius);
    this.visual.geometry.setAttribute("nodeColor", this.instanceColor);
    this.visual.count = count;
    this.visual.frustumCulled = false;
    this.add(this.visual);
  }

  override setMatrixAt(index: number, matrix: THREE.Matrix4): this {
    super.setMatrixAt(index, matrix);
    // InstancedMesh initializes matrices through this override during super().
    if (!this.centerRadius) return this;
    const matrixOffset = index * 16;
    const values = this.instanceMatrix.array;
    const radius = Math.max(
      Math.hypot(values[matrixOffset], values[matrixOffset + 1], values[matrixOffset + 2]),
      Math.hypot(values[matrixOffset + 4], values[matrixOffset + 5], values[matrixOffset + 6]),
      Math.hypot(values[matrixOffset + 8], values[matrixOffset + 9], values[matrixOffset + 10]),
    );
    this.centerRadius.setXYZW(
      index,
      values[matrixOffset + 12],
      values[matrixOffset + 13],
      values[matrixOffset + 14],
      radius,
    );
    markRange(this.centerRadius, index * 4, 4);
    this.centerRadius.needsUpdate = true;
    return this;
  }

  override setColorAt(index: number, color: THREE.Color): this {
    this.instanceColor.setXYZW(index, color.r, color.g, color.b, 1);
    markRange(this.instanceColor, index * 4, 4);
    return this;
  }

  override getColorAt(index: number, color: THREE.Color): THREE.Color {
    return color.setRGB(this.instanceColor.getX(index), this.instanceColor.getY(index), this.instanceColor.getZ(index));
  }

  /** Exact ray/sphere intersection, used after the picker's BVH broad phase. */
  raycastInstance(index: number, raycaster: THREE.Raycaster): number | null {
    this.getMatrixAt(index, this.pickMatrix);
    this.pickMatrix.premultiply(this.matrixWorld);
    this.pickInverse.copy(this.pickMatrix).invert();
    this.pickRay.copy(raycaster.ray).applyMatrix4(this.pickInverse);
    if (!this.pickRay.intersectSphere(this.pickSphere, this.pickPoint)) return null;
    this.pickPoint.applyMatrix4(this.pickMatrix);
    const distance = raycaster.ray.origin.distanceTo(this.pickPoint);
    return distance >= raycaster.near && distance <= raycaster.far ? distance : null;
  }

  override dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.visual.geometry.dispose();
    (this.visual.material as THREE.Material).dispose();
    this.geometry.dispose();
    (this.material as THREE.Material).dispose();
    super.dispose();
  }
}
