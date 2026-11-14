type PanelVariant = "side" | "wide" | "dock";

type PanelState = {
  dialog: HTMLDialogElement;
  content: HTMLElement;
  title: string;
  trigger: HTMLElement | null;
  variant: PanelVariant;
  destroying: boolean;
};

const panels = new Map<string, PanelState>();
const titles: Record<string, string> = {
  "stats-dialog": "博客宇宙统计",
  "about-dialog": "关于博客宇宙",
  "graph-control-panel": "控制面板",
  "neighbor-panel": "邻居节点",
  "path-bar": "路径查找",
};
const variants: Record<string, PanelVariant> = {
  "stats-dialog": "wide",
  "about-dialog": "wide",
  "neighbor-panel": "side",
  "path-bar": "dock",
};
let panelSequence = 0;
let dialogSequence = 0;

function panelTitle(id: string) {
  return titles[id] || "面板";
}

function panelVariant(id: string): PanelVariant {
  return variants[id] || "side";
}

function focusTrigger(state: PanelState) {
  const trigger = state.trigger;
  if (trigger?.isConnected) trigger.focus({ preventScroll: true });
}

function restoreContent(content: HTMLElement) {
  content.removeAttribute("hidden");
  if (content.style.display === "none") content.style.removeProperty("display");
}

function createPanelShell(content: HTMLElement): PanelState {
  const id = content.id;
  const title = panelTitle(id);
  const variant = panelVariant(id);
  const titleId = `panel-title-${dialogSequence++}`;

  const dialog = document.createElement("dialog");
  dialog.className = `app-panel app-panel--${variant}`;
  dialog.id = `panel-shell-${id}`;
  dialog.dataset.panelId = id;
  dialog.setAttribute("aria-labelledby", titleId);
  dialog.tabIndex = -1;

  const header = document.createElement("header");
  header.className = "app-panel-header";

  const heading = document.createElement("div");
  heading.className = "app-panel-heading";
  const eyebrow = document.createElement("span");
  eyebrow.className = "app-panel-eyebrow";
  eyebrow.textContent = "BLOG UNIVERSE";
  const headingText = document.createElement("h2");
  headingText.className = "app-panel-title";
  headingText.id = titleId;
  headingText.textContent = title;
  heading.append(eyebrow, headingText);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "btn btn-ghost btn-sm btn-circle app-panel-close";
  close.setAttribute("aria-label", `关闭${title}`);
  close.title = "关闭";
  close.textContent = "✕";
  close.addEventListener("click", () => hidePanel(id));
  header.append(heading, close);

  const body = document.createElement("div");
  body.className = "app-panel-body";
  body.appendChild(content);
  dialog.append(header, body);
  document.body.appendChild(dialog);

  const state: PanelState = { dialog, content, title, trigger: null, variant, destroying: false };
  dialog.addEventListener("close", () => {
    if (!state.destroying) focusTrigger(state);
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    event.preventDefault();
    event.stopPropagation();
    hidePanel(id);
  });
  panels.set(id, state);
  restoreContent(content);
  return state;
}

function ensurePanel(content: HTMLElement): PanelState {
  return panels.get(content.id) || createPanelShell(content);
}

export function registerPanel(content: HTMLElement): HTMLDialogElement {
  return ensurePanel(content).dialog;
}

export function showPanel(id: string, trigger?: HTMLElement) {
  const content = document.getElementById(id);
  if (!content) return;
  const state = ensurePanel(content);
  if (trigger) state.trigger = trigger;
  if (document.pointerLockElement) void document.exitPointerLock();
  if (!state.dialog.open) state.dialog.show();
  state.dialog.style.zIndex = String(40 + panelSequence++);
  state.dialog.classList.add("is-open");
}

export function hidePanel(id: string) {
  const state = panels.get(id);
  if (!state?.dialog.open) {
    if (state) focusTrigger(state);
    return;
  }
  state.dialog.classList.remove("is-open");
  state.dialog.close();
}

export function togglePanel(id: string, trigger?: HTMLElement) {
  if (isPanelOpen(id)) hidePanel(id);
  else showPanel(id, trigger);
}

export function isPanelOpen(id: string) {
  return panels.get(id)?.dialog.open === true;
}

export function destroyPanel(id: string) {
  const state = panels.get(id);
  if (!state) return;
  state.destroying = true;
  if (state.dialog.open) state.dialog.close();
  state.dialog.remove();
  panels.delete(id);
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  if (document.pointerLockElement || document.fullscreenElement) return;
  const open = [...panels.values()]
    .filter((state) => state.dialog.open)
    .sort((a, b) => Number(b.dialog.style.zIndex || 0) - Number(a.dialog.style.zIndex || 0));
  if (!open.length) return;
  event.preventDefault();
  hidePanel(open[0].dialog.dataset.panelId!);
});
