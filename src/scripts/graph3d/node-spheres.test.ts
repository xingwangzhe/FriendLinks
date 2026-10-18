import { describe, expect, test } from "bun:test";
import * as THREE from "three/webgpu";
import { NodeSphereInstances } from "./node-spheres";

function matrix(x = 0, radius = 40) {
  return new THREE.Matrix4().makeScale(radius, radius, radius).setPosition(x, 0, 0);
}

describe("compact GPU sphere impostors", () => {
  test("reduces actual instance GPU attributes and triangle topology for the real node count", () => {
    const count = 49064;
    const nodes = new NodeSphereInstances(count);
    expect(nodes.geometry.index!.count / 3).toBe(36);
    expect(nodes.visual.geometry.index!.count / 3).toBe(2);
    expect(nodes.visual.count).toBe(count);
    expect((nodes.material as THREE.Material).visible).toBe(false);
    expect(nodes.visual.material).toBeInstanceOf(THREE.SpriteNodeMaterial);
    expect(nodes.visual.geometry.getAttribute("nodeCenterRadius")).toBe(nodes.centerRadius);
    expect(nodes.visual.geometry.getAttribute("nodeColor")).toBe(nodes.instanceColor);
    expect(nodes.visual.geometry.hasAttribute("instanceMatrix")).toBe(false);
    expect(nodes.centerRadius.array.byteLength + nodes.instanceColor.array.byteLength).toBe(981280);
    expect(count * (16 + 3) * 4).toBe(3728864);
    expect(36 * count).toBe(1766304);
    expect(2 * count).toBe(98128);
    nodes.dispose();
  });

  test("keeps exact CPU matrices, live focus radius and bounded sparse upload ranges", () => {
    const nodes = new NodeSphereInstances(500);
    nodes.setMatrixAt(20, matrix(100, 40));
    const value = new THREE.Matrix4();
    nodes.getMatrixAt(20, value);
    expect(value.elements).toEqual(matrix(100, 40).elements);
    expect(nodes.centerRadius.getX(20)).toBe(100);
    expect(nodes.centerRadius.getW(20)).toBe(40);
    nodes.setMatrixAt(20, matrix(100, 60));
    expect(nodes.centerRadius.getW(20)).toBe(60);
    expect(nodes.centerRadius.updateRanges).toEqual([{ start: 80, count: 4 }]);
    for (let i = 0; i < nodes.count; i++) nodes.setColorAt(i, new THREE.Color(0.2, 0.5, 0.9));
    expect(nodes.instanceColor.updateRanges).toEqual([{ start: 0, count: 2000 }]);
    nodes.instanceColor.clearUpdateRanges();
    for (const i of [1, 99, 207, 35, 17, 443, 67, 81, 411, 72, 33]) nodes.setColorAt(i, new THREE.Color());
    expect(nodes.instanceColor.updateRanges.length).toBeLessThanOrEqual(8);
    const color = new THREE.Color();
    nodes.getColorAt(300, color);
    expect(Math.abs(color.r - 0.2)).toBeLessThanOrEqual(1 / 255);
    expect(Math.abs(color.g - 0.5)).toBeLessThanOrEqual(1 / 255);
    expect(Math.abs(color.b - 0.9)).toBeLessThanOrEqual(1 / 255);
    expect(nodes.instanceColor.normalized).toBe(true);
    expect(nodes.instanceColor.itemSize).toBe(4);
    nodes.dispose();
  });

  test("analytical ray hits respect current matrices, sphere edges, world transform and near/far", () => {
    const nodes = new NodeSphereInstances(1);
    nodes.setMatrixAt(0, matrix(0, 40));
    nodes.updateMatrixWorld();
    const ray = new THREE.Raycaster(new THREE.Vector3(39, 0, 100), new THREE.Vector3(0, 0, -1));
    const distance = nodes.raycastInstance(0, ray)!;
    expect(distance).toBeCloseTo(100 - Math.sqrt(1600 - 39 * 39), 8);
    ray.ray.origin.x = 41;
    expect(nodes.raycastInstance(0, ray)).toBeNull();
    nodes.setMatrixAt(0, matrix(0, 60));
    expect(nodes.raycastInstance(0, ray)).not.toBeNull();
    ray.far = 20;
    expect(nodes.raycastInstance(0, ray)).toBeNull();
    ray.far = Infinity;
    ray.near = 100;
    expect(nodes.raycastInstance(0, ray)).toBeNull();
    ray.near = 0;
    nodes.position.set(100, 0, 0);
    nodes.scale.setScalar(2);
    nodes.updateMatrixWorld();
    ray.ray.origin.set(100, 0, 200);
    expect(nodes.raycastInstance(0, ray)).toBeCloseTo(80, 8);
    nodes.dispose();
  });

  test("disposes owned visual and proxy resources once", () => {
    const nodes = new NodeSphereInstances(1);
    const disposals = [nodes.geometry, nodes.material, nodes.visual.geometry, nodes.visual.material].map((resource) => {
      let count = 0;
      (resource as THREE.BufferGeometry).addEventListener("dispose", () => count++);
      return () => count;
    });
    nodes.dispose();
    nodes.dispose();
    expect(disposals.map((count) => count())).toEqual([1, 1, 1, 1]);
  });
});
