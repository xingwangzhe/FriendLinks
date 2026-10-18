import { expect, spyOn, test } from "bun:test";
import * as THREE from "three";
import type { GraphNode } from "../../../types/graph";
import { createInteraction } from "./interaction";
import type { RenderContext } from "./renderer";
import { InstancedNodePicker } from "./spatial-index";

test("indexed picking preserves hover, clicks, fly-center targeting and cleans up listeners", () => {
  class Canvas extends EventTarget {
    getBoundingClientRect() {
      return { left: 20, top: 30, width: 1000, height: 1000 };
    }
  }
  const canvas = new Canvas();
  const camera = new THREE.PerspectiveCamera(75, 1, 1, 500000);
  camera.position.set(0, 0, 1000);
  camera.updateMatrixWorld();
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(40, 6, 4), new THREE.MeshBasicMaterial(), 1);
  mesh.setMatrixAt(0, new THREE.Matrix4());
  mesh.updateMatrixWorld();
  const node: GraphNode = { id: "origin", name: "Origin", url: "https://example.com", x: 0, y: 0, z: 0 };
  const ctx = { renderer: { domElement: canvas }, camera, nodes: mesh } as unknown as RenderContext;
  const ix = createInteraction(ctx, [node]);
  const hovered: Array<GraphNode | null> = [];
  const clicked: GraphNode[] = [];
  const rightClicked: GraphNode[] = [];
  ix.onHover = (value) => hovered.push(value);
  ix.onClick = (value) => clicked.push(value);
  ix.onRightClick = (value) => rightClicked.push(value);

  function dispatch(type: string, clientX: number, clientY: number) {
    const event = Object.assign(new Event(type, { cancelable: true }), { clientX, clientY });
    canvas.dispatchEvent(event);
    return event;
  }

  const clock = spyOn(performance, "now");
  try {
    clock.mockReturnValue(100);
    dispatch("mousemove", 520, 530);
    clock.mockReturnValue(120);
    dispatch("mousemove", 20, 30);
    expect(hovered).toEqual([node]);
    clock.mockReturnValue(160);
    dispatch("mousemove", 520, 530);
    expect(hovered).toEqual([node]);
    clock.mockReturnValue(220);
    dispatch("mousemove", 20, 30);
    expect(hovered).toEqual([node, null]);

    dispatch("click", 520, 530);
    dispatch("click", 20, 30);
    expect(clicked).toEqual([node]);
    expect(dispatch("contextmenu", 520, 530).defaultPrevented).toBe(true);
    expect(rightClicked).toEqual([node]);

    ix.setFlyMode(true);
    dispatch("click", 20, 30);
    dispatch("contextmenu", 20, 30);
    expect(clicked).toEqual([node, node]);
    expect(rightClicked).toEqual([node, node]);
    ix.setFlyMode(false);
    dispatch("click", 20, 30);
    expect(clicked).toEqual([node, node]);

    clock.mockReturnValue(300);
    dispatch("mousemove", 520, 530);
    expect(hovered).toEqual([node, null, node]);
    clock.mockReturnValue(310);
    dispatch("pointerleave", 20, 30);
    dispatch("pointerleave", 20, 30);
    expect(hovered).toEqual([node, null, node, null]);
    clock.mockReturnValue(320);
    dispatch("mousemove", 520, 530);
    expect(hovered).toEqual([node, null, node, null, node]);

    ix.dispose();
    ix.dispose();
    expect(hovered).toEqual([node, null, node, null, node, null]);
    clock.mockReturnValue(400);
    dispatch("mousemove", 520, 530);
    dispatch("click", 520, 530);
    expect(dispatch("contextmenu", 520, 530).defaultPrevented).toBe(false);
    dispatch("pointerleave", 20, 30);
    expect(hovered).toEqual([node, null, node, null, node, null]);
    expect(clicked).toEqual([node, node]);
    expect(rightClicked).toEqual([node, node]);
  } finally {
    clock.mockRestore();
  }
});

test("unchanged hover rays reuse exact picks while camera, scale, clip and layer changes invalidate them", () => {
  class Canvas extends EventTarget {
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 1000, height: 1000 };
    }
  }
  const canvas = new Canvas();
  const camera = new THREE.PerspectiveCamera(75, 1, 1, 500000);
  camera.position.set(0, 0, 1000);
  camera.updateMatrixWorld();
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(40, 6, 4), new THREE.MeshBasicMaterial(), 1);
  mesh.updateMatrixWorld();
  const node: GraphNode = { id: "origin", name: "Origin", url: "https://example.com", x: 0, y: 0, z: 0 };
  const ctx = { renderer: { domElement: canvas }, camera, nodes: mesh } as unknown as RenderContext;
  const pickerSpy = spyOn(InstancedNodePicker.prototype, "pick");
  const clock = spyOn(performance, "now");
  const ix = createInteraction(ctx, [node]);
  let time = 0;
  function move(clientX = 500, clientY = 500) {
    clock.mockReturnValue((time += 60));
    canvas.dispatchEvent(Object.assign(new Event("mousemove"), { clientX, clientY }));
  }
  try {
    move();
    for (let index = 0; index < 100; index++) move();
    expect(pickerSpy).toHaveBeenCalledTimes(1);
    expect(ix.hoveredIndex).toBe(0);
    ix.setFlyMode(true);
    move(0, 0);
    move(1000, 1000);
    expect(pickerSpy).toHaveBeenCalledTimes(2);

    camera.position.x = 10;
    camera.updateMatrixWorld();
    move();
    expect(pickerSpy).toHaveBeenCalledTimes(3);
    mesh.setMatrixAt(0, new THREE.Matrix4().makeScale(1.5, 1.5, 1.5));
    mesh.instanceMatrix.needsUpdate = true;
    move();
    expect(pickerSpy).toHaveBeenCalledTimes(4);
    ix.raycaster.far = 10;
    move();
    expect(pickerSpy).toHaveBeenCalledTimes(5);
    expect(ix.hoveredIndex).toBeNull();
    ix.raycaster.far = Infinity;
    move();
    expect(pickerSpy).toHaveBeenCalledTimes(6);
    mesh.layers.set(1);
    move();
    expect(pickerSpy).toHaveBeenCalledTimes(7);
    expect(ix.hoveredIndex).toBeNull();
    ix.raycaster.layers.set(1);
    move();
    expect(pickerSpy).toHaveBeenCalledTimes(8);
    expect(ix.hoveredIndex).toBe(0);

    // Explicit activation performs a new exact query, even after cached hover.
    const event = Object.assign(new Event("click"), { clientX: 0, clientY: 0 });
    canvas.dispatchEvent(event);
    canvas.dispatchEvent(event);
    expect(pickerSpy).toHaveBeenCalledTimes(10);
    canvas.dispatchEvent(new Event("pointerleave"));
    move();
    expect(pickerSpy).toHaveBeenCalledTimes(11);
  } finally {
    ix.dispose();
    clock.mockRestore();
    pickerSpy.mockRestore();
  }
});
