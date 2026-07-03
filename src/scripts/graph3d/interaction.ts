/**
 * Raycaster 交互层
 * 替代 3d-force-graph 的 hover/click 事件系统
 */
import * as THREE from "three";
import type { RenderContext } from "./renderer";
import type { GraphNode } from "../../../types/graph";

export type HoverCallback = (node: GraphNode | null) => void;
export type ClickCallback = (node: GraphNode) => void;

export interface InteractionContext {
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  onHover: HoverCallback | null;
  onClick: ClickCallback | null;
  onRightClick: ClickCallback | null;
  hoveredIndex: number | null;
}

export function createInteraction(ctx: RenderContext, nodes: GraphNode[]): InteractionContext {
  const ix: InteractionContext = {
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    onHover: null,
    onClick: null,
    onRightClick: null,
    hoveredIndex: null,
  };

  const allInstanced = [ctx.nodes];
  let lastHoveredId: string | null = null;
  let lastCheck = 0;
  const RAY_THROTTLE = 60; // ms

  let _isFlyMode = false;

  function getNodeAtMouse(event: MouseEvent): GraphNode | null {
    const rect = ctx.renderer.domElement.getBoundingClientRect();
    // 飞船模式下指针锁定，用屏幕中心代替鼠标坐标
    const mx = _isFlyMode ? rect.width / 2 : event.clientX - rect.left;
    const my = _isFlyMode ? rect.height / 2 : event.clientY - rect.top;
    ix.mouse.x = (mx / rect.width) * 2 - 1;
    ix.mouse.y = -(my / rect.height) * 2 + 1;
    ix.raycaster.setFromCamera(ix.mouse, ctx.camera);

    let closestDist = Infinity;
    let closestIndex = -1;

    for (const mesh of allInstanced) {
      const intersects = ix.raycaster.intersectObject(mesh);
      for (const hit of intersects) {
        if (hit.distance < closestDist && hit.instanceId != null) {
          closestDist = hit.distance;
          closestIndex = hit.instanceId;
        }
      }
    }

    if (closestIndex >= 0 && closestIndex < nodes.length) {
      return nodes[closestIndex];
    }
    return null;
  }

  // 供外部切换飞船模式时同步状态
  (ix as any).setFlyMode = (v: boolean) => {
    _isFlyMode = v;
  };

  // ── Mouse move → hover (throttled) ──
  ctx.renderer.domElement.addEventListener("mousemove", (event: MouseEvent) => {
    const now = performance.now();
    if (now - lastCheck < RAY_THROTTLE) return;
    lastCheck = now;

    const node = getNodeAtMouse(event);
    const newId = node ? node.id : null;

    if (lastHoveredId !== newId) {
      lastHoveredId = newId;
      ix.onHover?.(node);
    }
  });

  // ── Click ──
  ctx.renderer.domElement.addEventListener("click", (event: MouseEvent) => {
    const node = getNodeAtMouse(event);
    if (node) ix.onClick?.(node);
  });

  // ── Right-click ──
  ctx.renderer.domElement.addEventListener("contextmenu", (event: MouseEvent) => {
    event.preventDefault();
    const node = getNodeAtMouse(event);
    if (node) ix.onRightClick?.(node);
  });

  return ix;
}
