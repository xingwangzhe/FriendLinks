/**
 * Raycaster 交互层
 * 替代 3d-force-graph 的 hover/click 事件系统
 */
import * as THREE from "three";
import type { RenderContext } from "./renderer";
import type { GraphNode } from "../../../types/graph";
import { InstancedNodePicker } from "./spatial-index";

export type HoverCallback = (node: GraphNode | null) => void;
export type ClickCallback = (node: GraphNode) => void;

export interface InteractionContext {
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  onHover: HoverCallback | null;
  onClick: ClickCallback | null;
  onRightClick: ClickCallback | null;
  hoveredIndex: number | null;
  setFlyMode: (enabled: boolean) => void;
  dispose: () => void;
}

export function createInteraction(ctx: RenderContext, nodes: GraphNode[], maxNodeScale = 1.5): InteractionContext {
  let _isFlyMode = false;
  let disposed = false;
  const canvas = ctx.renderer.domElement;
  const ix: InteractionContext = {
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    onHover: null,
    onClick: null,
    onRightClick: null,
    hoveredIndex: null,
    setFlyMode: (enabled) => {
      _isFlyMode = enabled;
      hasCachedPick = false;
    },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("pointerleave", clearHover);
      clearHover();
      picker.dispose();
    },
  };

  const picker = new InstancedNodePicker(ctx.nodes, maxNodeScale);
  const cachedRay = new THREE.Ray();
  const cachedWorld = new THREE.Matrix4();
  let hasCachedPick = false;
  let cachedNear = 0;
  let cachedFar = 0;
  let cachedMatrixVersion = -1;
  let cachedCount = -1;
  let cachedLayerMask = -1;
  let cachedRayLayerMask = -1;
  let cachedNode: GraphNode | null = null;
  let cachedIndex: number | null = null;
  let lastHoveredId: string | null = null;
  let lastCheck = -Infinity;
  const RAY_THROTTLE = 60; // ms

  function getNodeAtMouse(event: MouseEvent, reuseHover = false): GraphNode | null {
    const rect = ctx.renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    // 飞船模式下指针锁定，用屏幕中心代替鼠标坐标
    const mx = _isFlyMode ? rect.width / 2 : event.clientX - rect.left;
    const my = _isFlyMode ? rect.height / 2 : event.clientY - rect.top;
    ix.mouse.x = (mx / rect.width) * 2 - 1;
    ix.mouse.y = -(my / rect.height) * 2 + 1;
    ix.raycaster.setFromCamera(ix.mouse, ctx.camera);

    if (
      reuseHover &&
      hasCachedPick &&
      cachedRay.equals(ix.raycaster.ray) &&
      cachedWorld.equals(ctx.nodes.matrixWorld) &&
      cachedNear === ix.raycaster.near &&
      cachedFar === ix.raycaster.far &&
      cachedMatrixVersion === ctx.nodes.instanceMatrix.version &&
      cachedCount === ctx.nodes.count &&
      cachedLayerMask === ctx.nodes.layers.mask &&
      cachedRayLayerMask === ix.raycaster.layers.mask
    ) {
      ix.hoveredIndex = cachedIndex;
      return cachedNode;
    }
    const closestIndex = picker.pick(ix.raycaster);
    const node = closestIndex !== null && closestIndex < nodes.length ? nodes[closestIndex] : null;
    if (reuseHover) {
      cachedRay.copy(ix.raycaster.ray);
      cachedWorld.copy(ctx.nodes.matrixWorld);
      cachedNear = ix.raycaster.near;
      cachedFar = ix.raycaster.far;
      cachedMatrixVersion = ctx.nodes.instanceMatrix.version;
      cachedCount = ctx.nodes.count;
      cachedLayerMask = ctx.nodes.layers.mask;
      cachedRayLayerMask = ix.raycaster.layers.mask;
      cachedNode = node;
      cachedIndex = closestIndex;
      ix.hoveredIndex = closestIndex;
      hasCachedPick = true;
    }
    return node;
  }

  // ── Mouse move → hover (throttled) ──
  function handleMouseMove(event: MouseEvent) {
    const now = performance.now();
    if (now - lastCheck < RAY_THROTTLE) return;
    lastCheck = now;

    const node = getNodeAtMouse(event, true);
    const newId = node ? node.id : null;

    if (lastHoveredId !== newId) {
      lastHoveredId = newId;
      ix.onHover?.(node);
    }
  }

  // ── Click ──
  function handleClick(event: MouseEvent) {
    // An unlocked flight click belongs to the pointer-lock handler, rather than
    // the node at the retained center reticle.
    if (_isFlyMode && document.pointerLockElement !== canvas) return;
    const node = getNodeAtMouse(event);
    if (node) ix.onClick?.(node);
  }

  // ── Right-click ──
  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (_isFlyMode && document.pointerLockElement !== canvas) return;
    const node = getNodeAtMouse(event);
    if (node) ix.onRightClick?.(node);
  }

  function clearHover() {
    // Let re-entry pick immediately, even if the last check was under 60 ms ago.
    lastCheck = -Infinity;
    hasCachedPick = false;
    ix.hoveredIndex = null;
    if (lastHoveredId === null) return;
    lastHoveredId = null;
    ix.onHover?.(null);
  }

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("contextmenu", handleContextMenu);
  canvas.addEventListener("pointerleave", clearHover);

  return ix;
}
