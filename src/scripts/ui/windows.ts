import WinBox from "winbox/src/js/winbox.js";
import "winbox/dist/css/winbox.min.css";

const panels = new Map<string, WinBox>();
const triggers = new Map<string, HTMLElement>();
const titles: Record<string, string> = {
  "stats-dialog": "博客宇宙统计",
  "about-dialog": "关于博客宇宙",
  "graph-control-panel": "控制面板",
  "neighbor-panel": "邻居节点",
  "fly-control-panel": "飞行控制",
  "path-bar": "路径查找",
};

import { fitBounds } from "./window-geometry";

function constrain(panel: WinBox) {
  const rect = fitBounds(
    Number(panel.x),
    Number(panel.y),
    Number(panel.width),
    Number(panel.height),
    innerWidth,
    innerHeight,
  );
  if (rect.width !== panel.width || rect.height !== panel.height) panel.resize(rect.width, rect.height);
  if (rect.x !== panel.x || rect.y !== panel.y) panel.move(rect.x, rect.y);
}

export function registerPanel(content: HTMLElement): WinBox {
  const id = content.id;
  const existing = panels.get(id);
  if (existing) return existing;
  const large = id === "stats-dialog" || id === "about-dialog" || id === "neighbor-panel";
  const bounds = fitBounds(
    large ? 24 : innerWidth - 370,
    140,
    innerWidth <= 640 ? innerWidth - 16 : large ? 760 : 340,
    id === "path-bar" ? 360 : large ? 560 : 420,
    innerWidth,
    innerHeight,
  );
  const panel = new WinBox({
    title: titles[id] || id,
    index: 10001 + panels.size,
    mount: content,
    class: ["app-window", "no-full", "no-min"],
    hidden: true,
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minwidth: Math.min(280, innerWidth - 16),
    minheight: Math.min(180, innerHeight - 16),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
    onclose(force?: boolean) {
      if (force) return false;
      hidePanel(id);
      return true;
    },
  });
  panels.set(id, panel);
  content.classList.remove("hidden");
  content.style.display = "block";
  const root = panel.dom as HTMLElement;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", titles[id] || id);
  const title = root.querySelector<HTMLElement>(".wb-title")!;
  title.tabIndex = 0;
  title.setAttribute("aria-label", `${titles[id]}，方向键移动窗口，Escape 关闭`);
  root.querySelectorAll<HTMLElement>(".wb-control span").forEach((control) => {
    control.tabIndex = 0;
    control.setAttribute("role", "button");
    control.setAttribute("aria-label", control.classList.contains("wb-close") ? "关闭面板" : "最大化或恢复面板");
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        control.click();
      }
    });
  });
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      hidePanel(id);
    }
    if (event.target === title && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      const step = event.shiftKey ? 40 : 10;
      panel.move(
        Number(panel.x) + (event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0),
        Number(panel.y) + (event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0),
      );
      constrain(panel);
    }
  });
  root.addEventListener("pointerdown", () => {
    if (document.pointerLockElement) void document.exitPointerLock();
    panel.focus();
  });
  for (const event of ["mousedown", "click", "dblclick", "wheel", "contextmenu"])
    root.addEventListener(event, (e) => e.stopPropagation());
  root.addEventListener("touchend", () => constrain(panel));
  root.addEventListener("mouseup", () => constrain(panel));
  return panel;
}

export function showPanel(id: string, trigger?: HTMLElement) {
  const content = document.getElementById(id);
  if (!content) return;
  const panel = registerPanel(content);
  if (trigger) triggers.set(id, trigger);
  if (document.pointerLockElement) void document.exitPointerLock();
  panel.show().focus();
  constrain(panel);
  (panel.dom as HTMLElement).querySelector<HTMLElement>(".wb-title")?.focus({ preventScroll: true });
}
export function hidePanel(id: string) {
  panels.get(id)?.hide();
  triggers.get(id)?.focus({ preventScroll: true });
}
export function togglePanel(id: string, trigger?: HTMLElement) {
  const panel = panels.get(id);
  if (panel && !panel.hidden) hidePanel(id);
  else showPanel(id, trigger);
}
export function isPanelOpen(id: string) {
  return panels.has(id) && !panels.get(id)!.hidden;
}
export function destroyPanel(id: string) {
  panels.get(id)?.close(true);
  panels.delete(id);
  triggers.delete(id);
}

window.addEventListener("resize", () => panels.forEach(constrain));
document.addEventListener("mouseup", () =>
  panels.forEach((panel) => {
    if (!panel.hidden && !panel.max) constrain(panel);
  }),
);
