import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { InstancedNodePicker } from "./spatial-index";
import { NodeSphereInstances } from "./node-spheres";

function makeGrid(width: number) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshBasicMaterial(), width * width);
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const size = new THREE.Vector3(40, 40, 40);
  for (let i = 0; i < mesh.count; i++) {
    matrix.compose(new THREE.Vector3((i % width) * 160, Math.floor(i / width) * 160, 0), rotation, size);
    mesh.setMatrixAt(i, matrix);
  }
  mesh.updateMatrixWorld();
  return mesh;
}

function rayTo(x: number, y: number, z = 0) {
  const origin = new THREE.Vector3(700, 700, 2000);
  return new THREE.Raycaster(origin, new THREE.Vector3(x, y, z).sub(origin).normalize());
}

function originalPick(mesh: THREE.InstancedMesh, raycaster: THREE.Raycaster) {
  return raycaster.intersectObject(mesh)[0]?.instanceId ?? null;
}

describe("spatial node picking", () => {
  test("matches exact InstancedMesh triangle hits across silhouettes, misses and nearest nodes", () => {
    const mesh = makeGrid(10);
    const picker = new InstancedNodePicker(mesh);
    for (let i = 0; i < mesh.count; i += 3) {
      for (const offset of [0, 25, 38, 55]) {
        const raycaster = rayTo((i % 10) * 160 + offset, Math.floor(i / 10) * 160 + offset / 2);
        expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
      }
    }

    // The first node occludes a node directly behind it.
    mesh.setMatrixAt(1, new THREE.Matrix4().makeScale(40, 40, 40).setPosition(0, 0, -160));
    mesh.computeBoundingSphere();
    const overlappingPicker = new InstancedNodePicker(mesh);
    const raycaster = rayTo(0, 0);
    expect(overlappingPicker.pick(raycaster)).toBe(0);
    expect(overlappingPicker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
  });

  test("uses current focus scale and honors near/far clipping", () => {
    const mesh = makeGrid(1);
    const picker = new InstancedNodePicker(mesh, 1.5);
    const raycaster = new THREE.Raycaster(new THREE.Vector3(48, 0, 500), new THREE.Vector3(0, 0, -1));
    expect(picker.pick(raycaster)).toBeNull();

    mesh.setMatrixAt(0, new THREE.Matrix4().makeScale(60, 60, 60));
    mesh.computeBoundingSphere();
    expect(picker.pick(raycaster)).toBe(0);
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));

    raycaster.far = 400;
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
    expect(picker.pick(raycaster)).toBeNull();
    raycaster.far = Infinity;
    raycaster.near = 600;
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
    expect(picker.pick(raycaster)).toBeNull();
  });

  test("supports mesh world transforms, layer masks and stable overlapping hit order", () => {
    const mesh = makeGrid(2);
    mesh.setMatrixAt(1, new THREE.Matrix4().makeScale(40, 40, 40));
    mesh.position.set(500, 200, -100);
    mesh.rotation.y = 0.4;
    mesh.scale.set(2, 1, 0.75);
    mesh.updateMatrixWorld();
    const picker = new InstancedNodePicker(mesh);
    const raycaster = rayTo(500, 200, -100);
    expect(picker.pick(raycaster)).toBe(0);
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
    mesh.layers.set(1);
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
    expect(picker.pick(raycaster)).toBeNull();
  });

  test("prunes thousands of unrelated instances before exact raycasting", () => {
    const mesh = makeGrid(100);
    const picker = new InstancedNodePicker(mesh);
    const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 1000), new THREE.Vector3(0, 0, -1));
    expect(picker.pick(raycaster)).toBe(0);
    expect(picker.lastCandidateCount).toBe(1);
    raycaster.ray.origin.x = -1000;
    expect(picker.pick(raycaster)).toBeNull();
    expect(picker.lastCandidateCount).toBe(0);
  });

  test("prunes occluded columns after the nearest exact hit and handles rays inside bounds", () => {
    const count = 2048;
    const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshBasicMaterial(), count);
    const matrix = new THREE.Matrix4();
    for (let index = 0; index < count; index++) {
      mesh.setMatrixAt(index, matrix.makeScale(20, 20, 20).setPosition(0, 0, -index * 80));
    }
    mesh.updateMatrixWorld();
    const picker = new InstancedNodePicker(mesh);
    const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 100), new THREE.Vector3(0, 0, -1));
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
    expect(picker.lastCandidateCount).toBeLessThanOrEqual(12);
    // This origin is inside the root box. Its box exit is far beyond the hit,
    // so using intersectBox's exit distance as an entry would prune incorrectly.
    raycaster.ray.origin.z = -35;
    expect(picker.pick(raycaster)).toBe(1);
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
    raycaster.near = 70;
    raycaster.far = 300;
    expect(picker.pick(raycaster)).toBe(originalPick(mesh, raycaster));
    picker.dispose();
    expect(picker.pick(raycaster)).toBeNull();
    expect(picker.lastCandidateCount).toBe(0);
  });

  test("uses analytical sphere hooks with nearest hits, stable ties, focus scale and clipping", () => {
    const mesh = new NodeSphereInstances(3);
    const matrix = new THREE.Matrix4();
    mesh.setMatrixAt(0, matrix.makeScale(40, 40, 40));
    mesh.setMatrixAt(1, matrix.makeScale(40, 40, 40));
    mesh.setMatrixAt(2, matrix.makeScale(40, 40, 40).setPosition(0, 0, -200));
    mesh.position.set(100, 0, 0);
    mesh.scale.set(2, 1, 0.75);
    mesh.updateMatrixWorld();
    const picker = new InstancedNodePicker(mesh);
    const raycaster = new THREE.Raycaster(new THREE.Vector3(178, 0, 500), new THREE.Vector3(0, 0, -1));
    expect(picker.pick(raycaster)).toBe(0);
    // A circle-edge hit absent from the old six-sided proxy is retained.
    expect(mesh.raycastInstance(0, raycaster)).not.toBeNull();
    raycaster.ray.origin.x = 190;
    expect(picker.pick(raycaster)).toBeNull();
    mesh.setMatrixAt(1, matrix.makeScale(60, 60, 60));
    mesh.instanceMatrix.needsUpdate = true;
    expect(picker.pick(raycaster)).toBe(1);
    raycaster.far = 100;
    expect(picker.pick(raycaster)).toBeNull();
    raycaster.far = Infinity;
    raycaster.near = 700;
    expect(picker.pick(raycaster)).toBeNull();
    raycaster.near = 0;
    mesh.layers.set(1);
    expect(picker.pick(raycaster)).toBeNull();
    raycaster.layers.set(1);
    expect(picker.pick(raycaster)).toBe(1);
    mesh.dispose();
  });
});
