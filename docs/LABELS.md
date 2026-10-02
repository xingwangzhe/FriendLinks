# 3D 节点标签系统

> 2026-10-02 按当前源码同步。运行环境使用 Bun；浏览器渲染使用 Three.js r186。

## 实现与入口

标签使用 Canvas 2D 绘制文字，再生成 `THREE.CanvasTexture` 和 `THREE.Sprite`。字体为浏览器系统 `sans-serif`，不依赖外部字体 CDN 或文字渲染包。

- `src/scripts/graph3d/utils.ts`：`createTextSprite(text, worldHeight = 5, fontSize = 48)` 创建标签。
- `src/scripts/graph3d/index.ts`：`ensureLabels()` 按相机距离创建普通标签，`pruneLabels()` 清理远处标签，动画循环更新显隐和透明度。
- `buildNeighborLabels()` 创建聚焦节点及其邻居的标签，`clearNeighborLabels()` 释放这些标签。

## 普通标签

`ensureLabels()` 读取当前节点数组的坐标。标签开关关闭或存在聚焦节点时不创建普通标签，避免与聚焦标签重叠。尚无坐标的节点跳过；名称使用 `name || id`，长度超过 40 的名称不生成普通标签。

普通标签世界高度为 12，Canvas 字号为 48px，Y 偏移为 `nodeSize + worldHeight * 0.5 + 2`。创建范围由源码中的 `LABEL_CREATE_DIST` 控制；透明度在 `LABEL_FADE_FULL` 到 `LABEL_MAX_FADE_START` 之间随距离变化，超过范围隐藏。

`labelsCreated` 保存已处理节点索引，避免重复生成。普通标签所在组为 `labels`，聚焦标签所在组为 `neighborLabels`。

## 材质与资源释放

Sprite 材质开启透明，关闭 `depthTest` 和 `depthWrite`，`renderOrder` 为 999。纹理使用线性过滤，Sprite 宽高比由 Canvas 尺寸决定；Sprite 自动面向相机。

`pruneLabels()` 每 10 秒检查一次：距离相机超过 1500 世界单位且超过 20 秒没有回到近处的标签会被移除，同时释放纹理与材质，并清除对应索引。以后回到创建范围时可以重新生成标签。

聚焦标签由独立的更新逻辑进行屏幕空间缩放和相机相对定位。清除聚焦标签时同样释放纹理和材质。

## 控制与排查

控制面板的标签开关通过 `label_show` 持久化。重新开启时立即调用 `ensureLabels()`；聚焦状态下普通标签隐藏，显示聚焦标签。

| 现象 | 检查方向 |
|------|----------|
| 普通标签不显示 | 检查开关、聚焦状态、节点坐标、创建距离及名称长度 |
| 远处标签消失 | 检查距离淡出和资源清理，属于按距离控制的正常行为 |
| 中文字形缺失 | 检查系统字体是否包含对应字符及浏览器字体回退 |
| 聚焦后普通标签隐藏 | 普通标签与聚焦标签分别管理，避免重叠 |

## 历史方案

早期尝试过 `troika-three-text` 和 `@seregpie/three.text-sprite`，分别遇到字体 CDN 依赖和异步字体加载问题。当前自实现 Canvas Sprite 已替代这些方案；历史 `Graph.graphData()`、`createLabels()` 示例不再作为当前实现指南。
