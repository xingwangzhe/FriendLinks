# 3D 节点标签系统

## 概述

在 3D 力导向图中为每个节点渲染名称标签。标签自动面向相机（billboarding），根据相机距离淡入淡出。

## 方案演进

### 1. troika-three-text（已废弃）

- 使用 SDF（Signed Distance Field）GPU 渲染文字
- 问题：内部通过 `@unicode-font-resolver/client` 从 `cdn.jsdelivr.net` 下载字体 `.woff` 文件
- 结论：有 CDN 依赖，已彻底移除

### 2. @seregpie/three.text-sprite（已废弃）

- Canvas 渲染的 Three.js Sprite 封装
- 问题：`onBeforeRender` 中字体异步加载（`document.fonts.load()`），CJK 字体未加载完时标签不渲染，Linux 上表现不稳定
- 结论：异步字体加载机制不可靠，已移除

### 3. Canvas Sprite 自实现（当前方案）

纯 Canvas 2D → THREE.Sprite，零外部依赖，系统字体渲染。

## 架构

```
createTextSprite(text)          → Canvas 2D 离屏渲染 → CanvasTexture → Sprite
createLabels()                  → 首帧从 Graph.graphData() 取节点坐标 → 批量创建 Sprite
animateRipples() 每帧 LOD 更新  → 距离计算 → 显隐 + 透明度淡入
控制面板                        → 连线设置按钮 → 标签显隐 checkbox
```

## 核心实现

### createTextSprite（`src/scripts/graph3d/utils.ts`）

```
Canvas fontSize: 48px
系统字体: sans-serif（浏览器自动 fallback 中日韩字体）
World-unit height: h = 10
材质:
  - transparent: true      → 透明背景
  - depthTest: false       → 不受 3D 遮挡
  - depthWrite: false      → 不写入深度缓冲
  - renderOrder: 999       → 渲染在最上层（高于高亮连线）
缩放: scale.set(h * aspect, h, 1)
```

### createLabels（`src/scripts/graph3d/index.ts`）

**创建时机**：`animateRipples()` 首帧调用，此时力仿真已完成、节点有坐标。

**关键点**：
- 使用 `Graph.graphData().nodes` 获取带坐标的节点（非本地 `nodes` 数组，后者可能尚未定位）
- 跳过名称长度 > 40 的节点
- 遍历**所有**节点（无 degree 过滤），每个节点一个标签
- Y 偏移 = `nodeSize / 2 + 10`（节点球体半径 + 10 单位间距）

```typescript
function createLabels() {
  if (labelsCreated) return;                    // 只创建一次
  const gd = Graph.graphData() as any;
  if (!gd.nodes || gd.nodes.length === 0) return;
  if (gd.nodes[0].x == null) return;            // 等力仿真定位完成

  labelsCreated = true;
  for (const node of gd.nodes) {
    const deg = degreeMap[node.id] || 0;
    const name = node.name || node.id;
    if (name.length > 40) continue;

    const sprite = createTextSprite(name);
    const nodeSize = degreeToSize(deg, maxDegree);
    sprite.position.set(node.x, node.y + nodeSize / 2 + 10, node.z);
    (sprite as any)._nodePos = { x: node.x, y: node.y, z: node.z };
    labelGroup.add(sprite);
  }
}
```

### 每帧 LOD 更新

在 `animateRipples()` 中，每帧根据相机到节点的距离动态调整标签：

| 距离 | 行为 |
|------|------|
| > 5000 | `visible = false`（隐藏，不渲染） |
| 5000 → 2000 | `visible = true`，`opacity` 从 0 线性增长到 1 |
| < 2000 | `visible = true`，`opacity = 1`（完全清晰） |

```typescript
if (dist > 5000) {
  sprite.visible = false;
} else if (dist < 2000) {
  sprite.visible = true;
  sprite.material.opacity = 1;
} else {
  sprite.visible = true;
  sprite.material.opacity = (5000 - dist) / 3000;
}
```

**参数选取依据**：`zoomToFit` 后相机距离约 4000 单位，标签约 0.33 透明度隐约可见，滚轮放大靠近后逐渐清晰。

### 控制面板开关

设置面板（点击"连线设置"按钮）中的「节点标签」checkbox 对应 `labelShow.value`，LOD 更新循环中检查此标志决定是否显示。

## 踩坑记录

| 问题 | 原因 | 解决 |
|------|------|------|
| 标签完全不显示 | 同步创建标签时节点 `x==null`，全部被 `continue` 跳过 | 改为 `animateRipples` 首帧创建，用 `Graph.graphData().nodes` |
| 标签创建了但仍不显示 | `zoomToFit` 后相机距离 ~4000，`LABEL_MAX_DIST=700` 硬隐藏了所有标签 | 移除硬隐藏，改为距离渐隐 |
| 标签浮在节点前面 | `depthTest: false` + Y 偏移仅 1.2，标签与节点重叠 | Y 偏移 = `nodeSize/2 + 10`，标签在球体上方 |
| 标签被高亮连线遮挡 | 高亮连线 renderOrder 更高 | 标签 `renderOrder = 999` |
| `MOVE_SPEED` TDZ 报错 | `let` 声明在 `createControlPanel` 之后 | 声明移到控制面板创建之前 |
| npm 包字体异步加载失败 | `@seregpie/three.text-sprite` 的 `document.fonts.load()` 是异步的，CJK 字体未就绪时标签不渲染 | 回退到自研 Canvas Sprite，无需字体加载 |
| troika CDN 字体加载 504 | `unicode-font-resolver` 从 jsdelivr CDN 下载字体 `.woff` | 彻底移除 troika，换 Canvas Sprite |

## 性能优化

- **相机静止跳过**：标签 LOD 纳入 `camMoved` 检查（阈值 1 单位），相机不动时完全跳过 31k Sprite 遍历
- **平方距离比较**：多数节点（>5000² 或 <2000²）用 `sqDist` 判断，避免 `Math.sqrt()`。仅中间淡入段才计算实际距离
- **冗余跳过**：先检查 `sprite.visible` 再赋值，避免无效的属性写入

## 文件索引

| 文件 | 职责 |
|------|------|
| `src/scripts/graph3d/utils.ts` | `createTextSprite()` — Canvas → Sprite 工厂 |
| `src/scripts/graph3d/index.ts` | `createLabels()` — 首帧批量创建；`animateRipples()` LOD 循环 — 距离淡入 |
| `src/pages/index.astro` | 连线设置按钮 → `__toggleOpacityPanel` |
