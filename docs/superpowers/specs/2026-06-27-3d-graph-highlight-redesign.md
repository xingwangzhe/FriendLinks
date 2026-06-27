# 3D 友链网络图高亮效果改进设计文档

> 日期：2026-06-27
> 主题：将灰度淡化高亮改为发光 + 放大高亮

---

## 背景

当前 3D 友链网络图（`src/scripts/graph3d/index.ts`）在搜索/悬停高亮时，将非相关节点变为灰色（dark: `#2a2a2a`, light: `#e0e0e0`），相关节点仅轻微调亮。用户反馈"灰度不太好"，希望改为更醒目的高亮效果。

## 目标

将"灰度淡化"高亮方式改为"发光 + 放大"高亮方式，提升视觉突出度。

## 设计决策

### 高亮状态定义

| 状态 | 新行为 |
|------|--------|
| 默认 | 主题色，正常尺寸 |
| 悬停 | 轻微发光（emissiveIntensity: 0.5）+ 尺寸放大 1.3x |
| 高亮组内节点 | 中等发光（emissiveIntensity: 0.8）+ 尺寸放大 1.5x |
| 聚焦节点 | 强发光（emissiveIntensity: 1.2）+ 尺寸放大 2.0x |
| 高亮组外节点 | 保持原色但透明度降至 40% |

### 技术方案

使用 Three.js `MeshStandardMaterial` 的 `emissive` 属性实现自发光效果，通过 `3d-force-graph` 的 `nodeThreeObject` 自定义节点材质。

**发光强度分级：**
- 默认：emissiveIntensity = 0
- 悬停：emissiveIntensity = 0.5
- 高亮组：emissiveIntensity = 0.8
- 聚焦：emissiveIntensity = 1.2

**尺寸动态调整：**
- 默认：`degreeToSize(deg, maxDegree)`
- 悬停：`defaultSize * 1.3`
- 高亮组内：`defaultSize * 1.5`
- 聚焦节点：`defaultSize * 2.0`

**非高亮节点处理：**
- 不再变灰，而是保持原色但降低透明度
- `transparent: true`, `opacity: 0.4`

### 需要修改的文件

- `src/scripts/graph3d/index.ts` — 主要修改：材质/尺寸动态更新逻辑
- `src/scripts/graph3d/utils.ts` — 添加：emissive 颜色生成函数

## 交互细节

- 搜索高亮时：匹配节点 + 邻居节点都进入高亮组
- 鼠标悬停：单独节点高亮，不影响高亮组状态
- 清除高亮：所有节点恢复默认状态
- 主题切换：发光颜色自动适配

## 兼容性

- 保持现有 API 不变（`find`, `focusNodeById`, `highlightNodesAndNeighbors`, `clearHighlights` 等）
- 保持现有数据结构不变
