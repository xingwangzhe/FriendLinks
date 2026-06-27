# 3D 友链网络图高亮效果改进实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 3D 友链网络图的灰度淡化高亮改为发光 + 放大高亮效果

**Architecture:** 使用 Three.js MeshStandardMaterial 的 emissive 属性实现自发光，通过 3d-force-graph 的 nodeThreeObject 自定义节点材质，动态调整尺寸和透明度

**Tech Stack:** TypeScript, Three.js, 3d-force-graph

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `src/scripts/graph3d/utils.ts` | 颜色工具函数（添加 emissive 颜色生成） |
| `src/scripts/graph3d/index.ts` | 3D 图渲染主逻辑（自定义节点材质、动态更新） |

---

## Task 1: 添加 emissive 颜色生成工具函数

**Files:**
- Modify: `src/scripts/graph3d/utils.ts`

- [ ] **Step 1: 添加 `getEmissiveColor` 函数**

在 `src/scripts/graph3d/utils.ts` 末尾添加：

```typescript
/**
 * 根据基础色生成 emissive 发光色
 * 将颜色调亮并增加饱和度，用于 Three.js MeshStandardMaterial.emissive
 */
export function getEmissiveColor(baseHex: string, intensity: number): string {
  // intensity: 0-1，越高越亮
  const [r, g, b] = hexToRgb(baseHex);
  // 调亮：向白色混合
  const blend = Math.min(1, intensity * 0.8);
  const er = Math.round(r + (255 - r) * blend);
  const eg = Math.round(g + (255 - g) * blend);
  const eb = Math.round(b + (255 - b) * blend);
  return rgbToHex(er, eg, eb);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scripts/graph3d/utils.ts
git commit -m "feat(utils): add getEmissiveColor for 3D node glow effect"
```

---

## Task 2: 重构节点材质系统

**Files:**
- Modify: `src/scripts/graph3d/index.ts`

- [ ] **Step 1: 导入新增工具函数和 Three.js**

在文件顶部导入区域修改：

```typescript
import ForceGraph3D from "3d-force-graph";
import Fuse from "fuse.js";
import * as THREE from "three";
import { PALETTE, hashToIndex, degreeToSize, adjustHex, getEmissiveColor } from "./utils";
import type { GraphData } from "../../../types/graph";
```

- [ ] **Step 2: 添加节点状态类型和材质缓存**

在 `Color state` 部分（第53行附近）添加：

```typescript
// 节点视觉状态
type NodeVisualState = {
  scale: number;        // 尺寸放大倍数
  emissiveIntensity: number;  // 发光强度
  opacity: number;       // 透明度
};

// 材质缓存，避免重复创建
const materialCache = new Map<string, THREE.MeshStandardMaterial>();

function getNodeMaterial(
  baseColor: string,
  state: NodeVisualState,
  isDark: boolean
): THREE.MeshStandardMaterial {
  const cacheKey = `${baseColor}-${state.scale}-${state.emissiveIntensity}-${state.opacity}-${isDark}`;
  if (materialCache.has(cacheKey)) {
    return materialCache.get(cacheKey)!;
  }

  const emissiveColor = state.emissiveIntensity > 0
    ? getEmissiveColor(baseColor, state.emissiveIntensity)
    : "#000000";

  const material = new THREE.MeshStandardMaterial({
    color: baseColor,
    emissive: emissiveColor,
    emissiveIntensity: state.emissiveIntensity,
    transparent: state.opacity < 1,
    opacity: state.opacity,
    roughness: 0.4,
    metalness: 0.1,
  });

  materialCache.set(cacheKey, material);
  return material;
}

// 计算节点视觉状态
function getNodeVisualState(
  nodeId: string,
  hoveredId: string | null,
  focusedId: string | null,
  highlightedSet: Set<string>
): NodeVisualState {
  // 聚焦节点：最强发光 + 最大尺寸
  if (focusedId === nodeId) {
    return { scale: 2.0, emissiveIntensity: 1.2, opacity: 1 };
  }
  // 悬停节点：轻微发光 + 轻微放大
  if (hoveredId === nodeId) {
    return { scale: 1.3, emissiveIntensity: 0.5, opacity: 1 };
  }
  // 高亮组内节点：中等发光 + 中等放大
  if (highlightedSet.size > 0 && highlightedSet.has(nodeId)) {
    return { scale: 1.5, emissiveIntensity: 0.8, opacity: 1 };
  }
  // 高亮组外节点：保持原色但降低透明度
  if (highlightedSet.size > 0) {
    return { scale: 1.0, emissiveIntensity: 0, opacity: 0.4 };
  }
  // 默认状态
  return { scale: 1.0, emissiveIntensity: 0, opacity: 1 };
}
```

- [ ] **Step 3: 替换 nodeColor 为 nodeThreeObject**

找到创建 3D 图的部分（第156行附近），将：

```typescript
.nodeColor(currentColorAccessor)
.nodeVal((n: any) => {
  const deg = degreeMap[n.id] || 0;
  return degreeToSize(deg, maxDegree);
})
```

替换为：

```typescript
// 基础尺寸映射
const baseSizeMap = new Map<string, number>();
for (const n of nodes) {
  const deg = degreeMap[n.id] || 0;
  baseSizeMap.set(n.id, degreeToSize(deg, maxDegree));
}

// 自定义节点 3D 对象
Graph.nodeThreeObject((n: any) => {
  const id = n.id;
  const baseColor = getBaseColor(n);
  const state = getNodeVisualState(id, hoveredId, focusedId, highlightedSet);
  const baseSize = baseSizeMap.get(id) || 1;
  const size = baseSize * state.scale;

  const geometry = new THREE.SphereGeometry(size, 16, 16);
  const material = getNodeMaterial(baseColor, state, isDarkRef.value);

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
})
```

注意：使用 `nodeThreeObject` 后，需要移除 `.nodeColor()` 和 `.nodeVal()` 的调用，因为自定义对象会覆盖它们。

- [ ] **Step 4: 修改 refreshColors 函数**

找到 `refreshColors` 函数（第146-150行），替换为：

```typescript
function refreshColors() {
  // 清除材质缓存，强制重新生成材质
  materialCache.clear();
  // 触发重绘
  Graph.refresh();
}
```

- [ ] **Step 5: 移除旧的 color accessor 相关代码**

删除 `makeColorAccessor` 函数（第123-143行）和 `currentColorAccessor` 变量（第145行）。

- [ ] **Step 6: Commit**

```bash
git add src/scripts/graph3d/index.ts
git commit -m "feat(graph3d): replace grayscale highlight with glow + scale effect"
```

---

## Task 3: 验证构建和运行

**Files:**
- None (verification only)

- [ ] **Step 1: 运行类型检查**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 2: 运行构建**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 3: 启动开发服务器验证效果**

```bash
npm run dev
```

手动验证：
1. 打开页面，3D 图正常显示
2. 搜索一个节点，高亮节点应该发光并放大
3. 非高亮节点应该保持原色但变淡（不是灰色）
4. 悬停节点应该有轻微发光效果
5. 主题切换后效果正常

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: glow + scale highlight for 3D friend link graph"
```

---

## Spec 覆盖检查

| 需求 | 实现任务 |
|------|---------|
| 发光效果（emissive） | Task 2, Step 3 |
| 尺寸放大 | Task 2, Step 3 |
| 非高亮节点透明度 | Task 2, Step 2 (`getNodeVisualState`) |
| 多级发光强度 | Task 2, Step 2 |
| 多级尺寸放大 | Task 2, Step 2 |
| 材质缓存优化 | Task 2, Step 2 (`getNodeMaterial`) |
| 保持现有 API | Task 2 (只修改内部渲染逻辑) |

---

## 回滚计划

如果出现问题，回滚到上一个 commit：

```bash
git reset --hard HEAD~1
```

或恢复到原始状态：

```bash
git checkout main -- src/scripts/graph3d/index.ts src/scripts/graph3d/utils.ts
```
