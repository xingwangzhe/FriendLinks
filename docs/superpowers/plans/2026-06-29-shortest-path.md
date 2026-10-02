# 双节点最短路径查找 + 步进遍历 实现计划

> 历史设计文档：保留当时方案与示例，不代表当前实现。2026-10-02 起 Astro 使用 `bunx --bun astro@latest`；当前搜索、标签和数据端点说明见 README、docs/INTERACTIONS.md 与 docs/LABELS.md。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增"路径查找"按钮 → 模态面板 → 两个 Fuse 搜索框分别选中起点/终点站点 → BFS 计算最短路径 → 黄色管道高亮路径 + 箭头标注方向 → 上一步/下一步按钮沿路径步进遍历。

**Architecture:** BFS 算法放在独立的纯函数文件 `pathfinder.ts`，路径状态机和渲染管线集成进 `graph3d/index.ts` 闭包内（可直接访问 `neighborMap` 和 `links`），模态 UI 沿用现有 modal 模式放在 `index.astro` 内。

**Tech Stack:** TypeScript, Three.js (ConeGeometry 箭头, CylinderGeometry 管道), Fuse.js (复用现有搜索索引)

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/scripts/graph3d/pathfinder.ts` | 新建 | BFS 最短路径算法（纯函数，可单元测试） |
| `src/scripts/graph3d/index.ts` | 修改 | 路径状态机、路径管道/箭头渲染、新增 API 方法 |
| `src/pages/index.astro` | 修改 | "路径查找"按钮、路径模态 HTML、CSS、JS |
| `src/scripts/index-client.ts` | 修改 | 路径模态搜索框事件绑定 |
| `src/env.d.ts` | 修改 | 新 API 方法的类型声明 |

---

### Task 1: BFS 最短路径算法

**Files:**
- Create: `src/scripts/graph3d/pathfinder.ts`

**职责:** 给定 `neighborMap`（`Map<string, Set<string>>`）和起点/终点 ID，返回最短路径节点 ID 数组（含起点和终点），无路径返回 `null`。

- [ ] **Step 1: 创建 pathfinder.ts**

```typescript
/**
 * BFS 最短路径查找（无向无权图）
 * @param neighborMap 邻接表 Map<nodeId, Set<neighborId>>
 * @param from 起点节点 ID
 * @param to 终点节点 ID
 * @returns 从 from 到 to 的最短路径节点 ID 数组（包含两端），无路径返回 null
 */
export function findShortestPath(
  neighborMap: Map<string, Set<string>>,
  from: string,
  to: string,
): string[] | null {
  if (from === to) return [from];

  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: string[] = [from];
  visited.add(from);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = neighborMap.get(current);
    if (!neighbors) continue;

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      parent.set(neighbor, current);
      if (neighbor === to) {
        // 回溯构建路径
        const path: string[] = [];
        let node: string | undefined = to;
        while (node !== undefined) {
          path.unshift(node);
          node = parent.get(node);
        }
        return path;
      }
      queue.push(neighbor);
    }
  }
  return null;
}
```

- [ ] **Step 2: 验证 lint**

```bash
bun run lint
```

- [ ] **Step 3: 提交**

```bash
git add src/scripts/graph3d/pathfinder.ts
git commit -m "feat: 添加 BFS 最短路径查找算法"
```

---

### Task 2: 路径状态机 + 渲染管线（graph3d/index.ts）

**Files:**
- Modify: `src/scripts/graph3d/index.ts`

**职责:** 在 `init3d()` 闭包内新增路径相关状态变量、路径管道/箭头渲染函数、步进遍历逻辑，暴露 API 方法到 `window.__graphApi`。

#### 改动点清单

1. **导入 pathfinder** (第 10 行附近)
2. **新增路径状态变量** (第 119 行 `highlightedSet` 之后)
3. **新增路径管道/箭头几何体** (第 265 行 overlay 几何体附近)
4. **新增 `buildPathOverlay()` 函数** (第 364 行 `buildOverlay` 之后)
5. **新增 `refreshPathNodeColors()` 函数** (第 425 行 `refreshAllNodeColors` 之后)
6. **修改 `nodeColor` 访问器** (第 374 行) — 增加路径节点颜色优先级
7. **修改 `animateRipples`** (第 479 行) — 路径管道自适应缩放
8. **新增 API 方法** (第 836 行 API 对象处)
9. **修改 `clearLocalEffects`** (第 786 行) — 清理路径状态

- [ ] **Step 1: 导入 pathfinder**

```typescript
import { findShortestPath } from "./pathfinder";
```

- [ ] **Step 2: 新增路径状态变量**

在第 121 行 `_lastFocusedId` 之后插入：

```typescript
// ── 路径查找状态（独立于 focus/highlight）──────────────────
let pathNodeIds: string[] | null = null; // 当前最短路径节点 ID 序列
let pathStepIndex = -1; // 当前步进到的节点在 pathNodeIds 中的索引，-1 表示未步进
let pathOverlayGroup: THREE.Group | null = null; // 路径管道 + 箭头的叠加组
```

- [ ] **Step 3: 新增路径管道/箭头几何体**

在第 266 行 `sharedHaloGeom` 之后插入：

```typescript
// 路径管道共享几何体（黄色，比 focus 管道稍细）
const PATH_TUBE_THICKNESS = 0.25;
const sharedPathCoreGeom = new THREE.CylinderGeometry(
  PATH_TUBE_THICKNESS * 0.3,
  PATH_TUBE_THICKNESS * 0.3,
  1,
  5,
);
const sharedPathHaloGeom = new THREE.CylinderGeometry(
  PATH_TUBE_THICKNESS * 1.5,
  PATH_TUBE_THICKNESS * 1.5,
  1,
  8,
);

// 箭头共享几何体（所有路径段共用）
const sharedArrowGeom = new THREE.ConeGeometry(0.4, 1.0, 6, 8);
```

箭头几何体 `ConeGeometry(radius, height, radialSegments, heightSegments)`：底面半径 0.4，高 1.0，6 段圆周 + 8 段高，视觉上足够锐利。

- [ ] **Step 4: 新增 `buildPathOverlay()` 函数**

在 `buildOverlay` 函数之后（约第 364 行）插入。此函数渲染路径的黄色管道 + 箭头。箭头在每段链接的中点偏目标侧，锥尖指向目标节点。

```typescript
/** 渲染路径叠加线网：黄色管道 + 方向箭头 */
function buildPathOverlay(pathIds: string[]) {
  // 清除旧路径叠加
  if (pathOverlayGroup) {
    while (pathOverlayGroup.children.length > 0) {
      const child = pathOverlayGroup.children[0] as THREE.Mesh;
      if (child.material) (child.material as THREE.Material).dispose();
      pathOverlayGroup.remove(child);
    }
    overlayGroup.remove(pathOverlayGroup);
    pathOverlayGroup = null;
  }

  if (!pathIds || pathIds.length < 2) return;

  pathOverlayGroup = new THREE.Group();

  const pathColor = new THREE.Color("#FFD700"); // 金黄色

  // 管道材质
  const coreMat = new THREE.MeshStandardMaterial({
    color: pathColor,
    emissive: pathColor,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const haloMat = new THREE.MeshStandardMaterial({
    color: pathColor,
    emissive: pathColor,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });

  // 箭头材质
  const arrowMat = new THREE.MeshStandardMaterial({
    color: pathColor,
    emissive: pathColor,
    emissiveIntensity: 0.5,
    depthWrite: false,
  });

  const up = new THREE.Vector3(0, 1, 0);
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  // 查找节点的 3D 坐标
  const gd = Graph.graphData() as any;
  const nodePosMap = new Map<string, THREE.Vector3>();
  if (gd.nodes) {
    for (const nd of gd.nodes) {
      if (nd.x != null) {
        nodePosMap.set(nd.id, new THREE.Vector3(nd.x, nd.y, nd.z));
      }
    }
  }

  for (let i = 0; i < pathIds.length - 1; i++) {
    const srcPos = nodePosMap.get(pathIds[i]);
    const tgtPos = nodePosMap.get(pathIds[i + 1]);
    if (!srcPos || !tgtPos) continue;

    start.copy(srcPos);
    end.copy(tgtPos);

    dir.subVectors(end, start);
    const length = dir.length();
    if (length < 0.01) continue;
    dir.normalize();

    mid.addVectors(start, end).multiplyScalar(0.5);
    quat.setFromUnitVectors(up, dir);

    // 光晕管道
    const haloMesh = new THREE.Mesh(sharedPathHaloGeom, haloMat);
    haloMesh.position.copy(mid);
    haloMesh.quaternion.copy(quat);
    haloMesh.scale.set(1, length, 1);
    pathOverlayGroup.add(haloMesh);

    // 核心管道
    const coreMesh = new THREE.Mesh(sharedPathCoreGeom, coreMat);
    coreMesh.position.copy(mid);
    coreMesh.quaternion.copy(quat);
    coreMesh.scale.set(1, length, 1);
    pathOverlayGroup.add(coreMesh);

    // 箭头（圆锥）：放在中点偏目标 20% 处，锥尖指向目标
    const arrowPos = new THREE.Vector3().copy(start).addScaledVector(dir, length * 0.6);
    const arrowMesh = new THREE.Mesh(sharedArrowGeom, arrowMat);
    arrowMesh.position.copy(arrowPos);
    // ConeGeometry 默认锥尖朝上(Y)，需要旋转到链接方向
    arrowMesh.quaternion.copy(quat);
    pathOverlayGroup.add(arrowMesh);
  }

  overlayGroup.add(pathOverlayGroup);
  overlayGroup.visible = true;
}
```

注意：箭头用的是 `ConeGeometry`，默认锥底在 y=-0.5、锥尖在 y=+0.5。经 `quat.setFromUnitVectors(up, dir)` 旋转后锥尖指向 `dir`（即朝向目标节点）。

- [ ] **Step 5: 新增 `refreshPathNodeColors()` 函数**

在 `refreshAllNodeColors` 之后插入。路径节点使用独立的橙色系，步进中的节点额外加亮。

```typescript
/** 刷新路径节点颜色（优先级高于 focus/highlight，低于一切时回退到 refreshAllNodeColors） */
function refreshPathNodeColors() {
  const gd = Graph.graphData() as any;
  if (!gd.nodes || !pathNodeIds) return;
  const pathSet = new Set(pathNodeIds);
  for (const nd of gd.nodes) {
    if (pathSet.has(nd.id)) {
      // 步进当前节点：最亮
      if (pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
        setNodeColor(nd, adjustHex(nd.palColor, 70));
      } else {
        // 路径上的其他节点：橙色系
        setNodeColor(nd, "#FF8C00");
      }
    } else {
      // 非路径节点：恢复默认（由 refreshAllNodeColors 处理）
    }
  }
}
```

- [ ] **Step 6: 修改 `nodeColor` 访问器**

将第 374 行的 `nodeColor` 访问器改为在 `focusedId` 之前插入路径优先级检查：

```typescript
.nodeColor((n: any) => {
  const id = n.id;
  // 路径步进节点最高优先级
  if (pathNodeIds && pathStepIndex >= 0 && id === pathNodeIds[pathStepIndex]) {
    return adjustHex(n.palColor, 70);
  }
  // 路径节点次优先级
  if (pathNodeIds && pathNodeIds.includes(id)) return "#FF8C00";
  // 原有优先级
  if (focusedId === id) return n._cFocus;
  if (highlightedSet.size > 0 && highlightedSet.has(id)) return n._cHighlight;
  return n._cDefault;
})
```

注意：`pathNodeIds.includes()` 是 O(n) 但 path 长度通常很短（< 20 节点），性能无影响。

- [ ] **Step 7: 修改 `animateRipples`**

在第 503 行 `overlayGroup.visible` 的缩放逻辑中，追加路径管道的自适应缩放。在 `for (const child of overlayGroup.children)` 循环内部`pathOverlayGroup` 是 `overlayGroup` 的子节点，所以会被自动遍历到。但我们需要给路径管道一个不同的缩放策略：

在现有的 overlay 缩放循环之后插入：

```typescript
// 路径叠加线使用独立的缩放因子（比 hover/focus 管道稍细）
if (pathOverlayGroup && pathOverlayGroup.children.length > 0) {
  try {
    const cam = Graph.cameraPosition();
    const dist = Math.sqrt(cam.x * cam.x + cam.y * cam.y + cam.z * cam.z);
    const pathScale = dist / 700;
    const pathClamped = Math.max(0.4, Math.min(pathScale, 4));
    for (const child of pathOverlayGroup.children) {
      const mesh = child as THREE.Mesh;
      const curScale = mesh.scale;
      mesh.scale.set(pathClamped, curScale.y, pathClamped);
    }
  } catch {}
}
```

- [ ] **Step 8: 新增 API 方法**

在 API 对象（约第 836 行）中添加三个方法。由于 `neighborMap` 是闭包内变量，路径查找逻辑直接写在 API 方法中：

```typescript
/** 查找并高亮两个节点之间的最短路径 */
function showShortestPath(fromId: string, toId: string): string[] | null {
  const path = findShortestPath(neighborMap, fromId, toId);
  if (!path) return null;

  // 清理旧状态
  clearOldPathState();

  pathNodeIds = path;
  pathStepIndex = 0; // 默认步进到起点

  // 高亮路径节点
  refreshPathNodeColors();
  // 清除原有的 hover/focus 叠加线
  buildOverlay(null, 0xffffff);
  // 渲染路径管道 + 箭头
  buildPathOverlay(path);

  // 相机飞到起点
  const gd = Graph.graphData() as any;
  const firstNode = gd.nodes?.find((n: any) => n.id === path[0]);
  if (firstNode && firstNode.x != null) {
    const padding = 120;
    Graph.cameraPosition(
      { x: firstNode.x + padding, y: firstNode.y + padding * 0.5, z: firstNode.z + padding },
      { x: firstNode.x, y: firstNode.y, z: firstNode.z },
      600,
    );
  }

  return path;
}

function clearOldPathState() {
  pathNodeIds = null;
  pathStepIndex = -1;
  if (pathOverlayGroup) {
    while (pathOverlayGroup.children.length > 0) {
      const child = pathOverlayGroup.children[0] as THREE.Mesh;
      if (child.material) (child.material as THREE.Material).dispose();
      pathOverlayGroup.remove(child);
    }
    overlayGroup.remove(pathOverlayGroup);
    pathOverlayGroup = null;
  }
}

/** 步进到路径上的下一个节点 */
function stepPathNext(): boolean {
  if (!pathNodeIds || pathStepIndex >= pathNodeIds.length - 1) return false;
  pathStepIndex++;
  refreshPathNodeColors();
  focusPathStepNode(pathNodeIds[pathStepIndex]);
  return true;
}

/** 步进到路径上的上一个节点 */
function stepPathPrev(): boolean {
  if (!pathNodeIds || pathStepIndex <= 0) return false;
  pathStepIndex--;
  refreshPathNodeColors();
  focusPathStepNode(pathNodeIds[pathStepIndex]);
  return true;
}

/** 将相机移动到当前步进节点 */
function focusPathStepNode(id: string) {
  const gd = Graph.graphData() as any;
  const node = gd.nodes?.find((n: any) => n.id === id);
  if (!node || node.x == null) return;
  const padding = 120;
  Graph.cameraPosition(
    { x: node.x + padding, y: node.y + padding * 0.5, z: node.z + padding },
    { x: node.x, y: node.y, z: node.z },
    500,
  );
}

/** 清除路径状态 */
function clearPath() {
  clearOldPathState();
  refreshAllNodeColors();
  if (hoveredId) {
    buildOverlay(hoveredId, isDarkRef.value ? 0xeeeeee : 0x888888);
  } else {
    buildOverlay(null, 0xffffff);
  }
}

/** 获取当前路径信息 */
function getPathInfo() {
  if (!pathNodeIds) return null;
  return {
    path: pathNodeIds,
    totalSteps: pathNodeIds.length,
    currentStep: pathStepIndex,
    currentId: pathStepIndex >= 0 ? pathNodeIds[pathStepIndex] : null,
  };
}
```

然后在 API 对象 `const api = { ... }` 中添加：

```typescript
showShortestPath,
stepPathNext,
stepPathPrev,
clearPath,
getPathInfo,
```

- [ ] **Step 9: 修改 `clearLocalEffects`**

在第 786 行函数体首行添加路径清理：

```typescript
function clearLocalEffects() {
  clearOldPathState(); // 新增：清理路径状态
  highlightedSet.clear();
  // ... 其余不变
}
```

- [ ] **Step 10: 验证 lint + TypeScript**

```bash
bun run lint
bunx --bun -p typescript tsc --noEmit --pretty 2>&1 | grep -E "(index\.ts|pathfinder\.ts)" | head -10
```

- [ ] **Step 11: 更新 env.d.ts 类型声明**

在 `Window.__graphApi` 接口中添加新方法：

```typescript
showShortestPath?: (fromId: string, toId: string) => string[] | null;
stepPathNext?: () => boolean;
stepPathPrev?: () => boolean;
clearPath?: () => void;
getPathInfo?: () => { path: string[]; totalSteps: number; currentStep: number; currentId: string | null } | null;
```

- [ ] **Step 12: 提交**

```bash
git add src/scripts/graph3d/index.ts src/scripts/graph3d/pathfinder.ts src/env.d.ts
git commit -m "feat: 最短路径查找 + 黄色管道高亮 + 步进遍历 API"
```

---

### Task 3: 路径模态 UI（index.astro）

**Files:**
- Modify: `src/pages/index.astro`

**职责:** 新增"路径查找"按钮、模态面板（两个搜索框 + 结果下拉 + 路径信息 + 上一步/下一步按钮）、内联 CSS + JS。

#### 3a. 添加按钮

- [ ] **Step 1: 在 `.top-buttons` 中添加按钮**

在第 84 行"连线设置"按钮之后添加：

```html
<button id="path-toggle" class="top-button" aria-label="路径查找"
  >🔗 路径查找</button
>
```

#### 3b. 添加模态 HTML

- [ ] **Step 2: 在 `#about-modal` 之后添加路径模态 HTML**

```html
<!-- 路径查找弹窗 -->
<div id="path-modal" role="dialog" aria-modal="true">
  <div class="modal-content path-modal-content">
    <div class="modal-header">
      <h2>🔗 最短路径查找</h2>
      <button class="close-btn" aria-label="关闭">&times;</button>
    </div>
    <div class="path-body">
      <div class="path-search-row">
        <label>起点站点</label>
        <div class="path-search-wrap">
          <input
            id="path-search-from"
            type="text"
            placeholder="搜索起点站点…"
            autocomplete="off"
          />
          <div id="path-results-from" class="path-results" role="listbox"></div>
        </div>
      </div>
      <div class="path-search-row">
        <label>终点站点</label>
        <div class="path-search-wrap">
          <input
            id="path-search-to"
            type="text"
            placeholder="搜索终点站点…"
            autocomplete="off"
          />
          <div id="path-results-to" class="path-results" role="listbox"></div>
        </div>
      </div>
      <div id="path-info" class="path-info" style="display:none;">
        <div class="path-stats">
          <span id="path-length"></span>
          <span id="path-step-indicator"></span>
        </div>
        <div class="path-controls">
          <button id="path-prev-btn" class="path-nav-btn" disabled>◀ 上一步</button>
          <button id="path-next-btn" class="path-nav-btn" disabled>下一步 ▶</button>
        </div>
        <button id="path-clear-btn" class="path-clear-btn">清除路径</button>
      </div>
      <div id="path-error" class="path-error" style="display:none;"></div>
    </div>
  </div>
</div>
```

#### 3c. 添加 CSS

- [ ] **Step 3: 在 `<style>` 块末尾添加路径模态样式**

```css
/* 路径模态 */
.path-modal-content {
  max-width: 560px;
}
.path-body {
  padding: 12px 0;
}
.path-search-row {
  margin-bottom: 12px;
}
.path-search-row label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}
.path-search-wrap {
  position: relative;
}
.path-search-wrap input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 14px;
  box-sizing: border-box;
}
.path-search-wrap input:focus {
  outline: 2px solid color-mix(in srgb, var(--text-color) 20%, transparent);
}
.path-results {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  display: none;
  z-index: 10;
}
.path-results .path-result-item {
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-color);
}
.path-results .path-result-item:hover {
  background: color-mix(in srgb, var(--card-bg) 92%, black 8%);
}
.path-result-item .path-result-name {
  font-weight: 600;
}
.path-result-item .path-result-url {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}
.path-info {
  border-top: 1px solid var(--border);
  padding-top: 12px;
  margin-top: 8px;
}
.path-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--text-color);
}
.path-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.path-nav-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 14px;
}
.path-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.path-nav-btn:not(:disabled):hover {
  background: color-mix(in srgb, var(--card-bg) 92%, black 8%);
}
.path-clear-btn {
  width: 100%;
  padding: 6px;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  background: transparent;
  color: #e74c3c;
  cursor: pointer;
  font-size: 13px;
}
.path-clear-btn:hover {
  background: rgba(231, 76, 60, 0.1);
}
.path-error {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  padding: 8px;
}
.selected-tag {
  display: inline-block;
  padding: 2px 8px;
  background: color-mix(in srgb, var(--card-bg) 90%, #FFD700 10%);
  border-radius: 4px;
  font-size: 12px;
  margin-top: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

#### 3d. 添加 JS 逻辑

- [ ] **Step 4: 在 index.astro 的内联 `<script>` 中添加路径模态逻辑**

在现有 `opacityBtn` 事件监听之后（约第 650 行）添加：

```javascript
// ── 路径查找模态 ──────────────────────────────────────────
var pathModal = document.getElementById("path-modal");
var pathToggle = document.getElementById("path-toggle");
var pathFromInput = document.getElementById("path-search-from");
var pathToInput = document.getElementById("path-search-to");
var pathFromResults = document.getElementById("path-results-from");
var pathToResults = document.getElementById("path-results-to");
var pathInfo = document.getElementById("path-info");
var pathLength = document.getElementById("path-length");
var pathStepIndicator = document.getElementById("path-step-indicator");
var pathPrevBtn = document.getElementById("path-prev-btn");
var pathNextBtn = document.getElementById("path-next-btn");
var pathClearBtn = document.getElementById("path-clear-btn");
var pathError = document.getElementById("path-error");

var selectedFrom = null; // { id, name, url }
var selectedTo = null;

function getApi() {
  return window.__graphApi || {};
}

function showPathModal() {
  pathModal.classList.add("show");
  pathFromInput.focus();
}
function hidePathModal() {
  pathModal.classList.remove("show");
  clearPathSelections();
}
function clearPathSelections() {
  selectedFrom = null;
  selectedTo = null;
  pathFromInput.value = "";
  pathToInput.value = "";
  pathFromResults.style.display = "none";
  pathToResults.style.display = "none";
  pathFromResults.innerHTML = "";
  pathToResults.innerHTML = "";
  pathInfo.style.display = "none";
  pathError.style.display = "none";
  var api = getApi();
  if (api.clearPath) api.clearPath();
}

// 打开/关闭
pathToggle.addEventListener("click", showPathModal);
pathModal.querySelector(".close-btn").addEventListener("click", hidePathModal);
pathModal.addEventListener("click", function(e) {
  if (e.target === pathModal) hidePathModal();
});

// 搜索结果渲染
function renderPathResults(container, list, onSelect) {
  container.innerHTML = "";
  if (!list || !list.length) {
    container.style.display = "none";
    return;
  }
  for (var i = 0; i < Math.min(list.length, 8); i++) {
    var it = list[i];
    var el = document.createElement("div");
    el.className = "path-result-item";
    el.innerHTML = '<div class="path-result-name">' + it.name + '</div>' +
      '<div class="path-result-url">' + (it.url || '') + '</div>';
    el.onclick = (function(item) {
      return function() {
        onSelect(item);
        container.style.display = "none";
      };
    })(it);
    container.appendChild(el);
  }
  container.style.display = "block";
}

// 起点搜索
pathFromInput.addEventListener("input", function() {
  var v = pathFromInput.value.trim();
  if (!v) {
    pathFromResults.style.display = "none";
    return;
  }
  var api = getApi();
  var list = api.find ? api.find(v) : [];
  renderPathResults(pathFromResults, list, function(item) {
    selectedFrom = item;
    pathFromInput.value = item.name;
    pathFromResults.style.display = "none";
    checkBothSelected();
  });
});

// 终点搜索
pathToInput.addEventListener("input", function() {
  var v = pathToInput.value.trim();
  if (!v) {
    pathToResults.style.display = "none";
    return;
  }
  var api = getApi();
  var list = api.find ? api.find(v) : [];
  renderPathResults(pathToResults, list, function(item) {
    selectedTo = item;
    pathToInput.value = item.name;
    pathToResults.style.display = "none";
    checkBothSelected();
  });
});

// 两个站点都选定后自动计算路径
function checkBothSelected() {
  if (!selectedFrom || !selectedTo) return;
  var api = getApi();
  if (!api.showShortestPath) return;

  var path = api.showShortestPath(selectedFrom.id, selectedTo.id);
  if (!path || !path.length) {
    pathError.textContent = "未找到从 " + selectedFrom.name + " 到 " + selectedTo.name + " 的路径";
    pathError.style.display = "block";
    pathInfo.style.display = "none";
    return;
  }

  pathError.style.display = "none";
  pathInfo.style.display = "block";
  updatePathUI();
}

function updatePathUI() {
  var api = getApi();
  var info = api.getPathInfo ? api.getPathInfo() : null;
  if (!info) return;

  pathLength.textContent = info.totalSteps + " 个节点";
  pathStepIndicator.textContent = "当前: 第 " + (info.currentStep + 1) + " / " + info.totalSteps + " 步";
  pathPrevBtn.disabled = info.currentStep <= 0;
  pathNextBtn.disabled = info.currentStep >= info.totalSteps - 1;
}

// 步进按钮
pathPrevBtn.addEventListener("click", function() {
  var api = getApi();
  if (api.stepPathPrev) {
    api.stepPathPrev();
    updatePathUI();
  }
});
pathNextBtn.addEventListener("click", function() {
  var api = getApi();
  if (api.stepPathNext) {
    api.stepPathNext();
    updatePathUI();
  }
});

// 清除路径
pathClearBtn.addEventListener("click", function() {
  clearPathSelections();
  pathInfo.style.display = "none";
  pathError.style.display = "none";
});

// 点击模态外部关闭搜索结果
document.addEventListener("click", function(e) {
  if (!pathFromInput.contains(e.target) && !pathFromResults.contains(e.target)) {
    pathFromResults.style.display = "none";
  }
  if (!pathToInput.contains(e.target) && !pathToResults.contains(e.target)) {
    pathToResults.style.display = "none";
  }
});

// ESC 关闭（添加到现有的 ESC 处理器）
var existingEscHandler = document.addEventListener ? null : null;
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && pathModal.classList.contains("show")) {
    hidePathModal();
  }
});
```

- [ ] **Step 5: 验证 lint + TypeScript**

```bash
bun run lint
bunx --bun -p typescript tsc --noEmit --pretty 2>&1 | grep -E "(index\.astro)" | head -10
```

- [ ] **Step 6: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat: 路径查找模态 UI — 双搜索框 + 步进控制"
```

---

### Task 4: index-client.ts 改动（如需）

**Files:**
- Modify: `src/scripts/index-client.ts`（可能不需要改动）

当前 `index-client.ts` 只处理主搜索框。路径模态的搜索逻辑在 `index.astro` 的内联脚本中直接调用 `window.__graphApi.find()`，不需要修改 `index-client.ts`。

但如果发现需要处理 `?local=` 参数或其他交互，可能补充少量修改。

---

### 验证清单

- [ ] BFS 返回正确的最短路径（包括直接邻居和远距离路径）
- [ ] 同一节点作为起终点时返回 `[id]`
- [ ] 无路径时返回 `null`（不连通的图）
- [ ] 路径黄色管道 + 箭头在 3D 中正确渲染
- [ ] 上一步 / 下一步按钮正确步进，相机跟随
- [ ] 边界检查：第一步禁用"上一步"，最后一步禁用"下一步"
- [ ] 清除路径后恢复为普通 highlight/focus 状态
- [ ] 路径模式与原有 focus/highlight 不冲突
- [ ] 深色/浅色主题切换时路径颜色正确
