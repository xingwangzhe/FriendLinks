# 3D 图交互系统审计

> 2026-10-02 同步：运行环境为 Bun，搜索使用 Orama。客户端路径查找使用 TypeScript BFS；Rust `bfs-rs` 用于构建端全图统计，`force-rs` 用于空间布局。贝塞尔数据从 `/graph-bezier.bin` 异步加载。

dev 端点的正式站点数据受 Astro 的 `DEV_SAMPLE_SIZE` 配置控制；友链目标仍可生成额外节点。详见 [开发配置](DEV.md)。

## 黄线路径信息来源

### 数据获取
```
index.astro: 输入起点/终点 → checkBothSelected()
  → api.showShortestPath(fromId, toId)
  → findShortestPath(neighborMap, from, to)   // BFS，返回 string[] | null
  → path = [起点, n1, n2, ..., 终点]
```

### 黄线渲染
```
showShortestPath 内部:
  → buildPathOverlay(path)
  → for i in 0..path.length-2:
      a = nodes.find(n.id === path[i])    // 按 ID 查坐标
      b = nodes.find(n.id === path[i+1])
      → 在 a→b 间画金色光管 (CylinderGeometry ×2: halo + core)
      → 挂到 ctx.scene
```

### 步进为什么不能用黄线信息
黄线只负责视觉渲染（CylinderGeometry），不存储路径拓扑数据。步进需要的是 `pathNodeIds` 数组 + `pathStepIndex` 指针，这两个是独立的闭包变量：
- `pathNodeIds: string[]` — 路径节点 ID 序列
- `pathStepIndex: number` — 当前步进到的索引

## 完整 API (`window.__graphApi`)

| 方法 | 参数 | 返回 | 功能 |
|------|------|------|------|
| `find(query)` | `string` | `Promise<{id,name,url}[]>` | Orama 模糊搜索节点（异步查询） |
| `focusNodeById(id)` | `string` | `void` | 聚焦节点：高亮+本色光晕连线+邻居面板+相机飞行 |
| `highlightNodesAndNeighbors(ids)` | `string[]` | `void` | 高亮节点及其邻居 |
| `clearHighlights()` | — | `void` | 清除高亮和聚焦 |
| `focusByDomain(domain)` | `string` | `void` | 按域名聚焦节点（支持完整 URL） |
| `toggleFlightMode()` | — | `boolean` | 切换飞船/球幕模式，返回当前状态 |
| `showShortestPath(from, to)` | `string, string` | `string[] \| null` | 计算并显示最短路径（贝塞尔金色管道+橙色节点+相机飞行） |
| `stepPathNext()` | — | `boolean` | 下一步，更新颜色+相机 |
| `stepPathPrev()` | — | `boolean` | 上一步，更新颜色+相机 |
| `clearPath()` | — | `void` | 清除路径：清管道+恢复颜色+恢复连线 |
| `getPathInfo()` | — | `{path,totalSteps,currentStep,currentId} \| null` | 获取当前路径状态 |
| `getGraphData()` | — | `{nodes, links}` | 获取全量图数据 |
| `updateLinkOpacity(v)` | `number` | `void` | 更新连线透明度 |

## 鼠标事件

| 事件 | 注册位置 | 功能 |
|------|---------|------|
| `mousemove` | interaction.ts:66 | Raycaster 射线检测(60ms节流) → `onHover` 回调 |
| `click` | interaction.ts:79 | `onClick` 回调 → 打开节点URL（新标签） |
| `contextmenu` | interaction.ts:83 | `onRightClick` 回调 → 聚焦节点 / 取消聚焦 |
| `mousemove` (tooltip) | index.ts:577 | 记录 `__lastMouseX/Y` 给 tooltip 定位 |

### 飞船模式额外鼠标事件
| 事件 | 注册位置 | 功能 |
|------|---------|------|
| `mousemove` | index.ts:enterFlyMode | `movementX/Y` → `reticleVelocity` → 准星物理 → 相机旋转 |
| `click` | interaction.ts:79 | 同普通模式，但 raycasting 用屏幕中心(准星) |

## 按钮/UI 事件

| 按钮 | DOM ID | 事件 | 功能 |
|------|--------|------|------|
| 飞船模式 | `fly-toggle` | click | `toggleFlightMode()`，更新按钮文字 🚀↔🌐 |
| 关于 | `about-toggle` | click | 显示关于弹窗 |
| 统计信息 | `stats-toggle` | click | 显示统计弹窗(`fetch /stats.json`) |
| 控制面板 | `opacity-toggle` | 可拖拽浮动窗口 | 显示/隐藏控制面板（连线透明度 / 飞船速度 / 泛光强度 / 节点辉光 / 线条辉光 / 节点标签 / 自动自转） |
| 路径查找 | `path-toggle` | click | 显示/隐藏路径栏 |
| 路径上一步 | `path-prev-btn` | click | `stepPathPrev()` → `updatePathUI()` |
| 路径下一步 | `path-next-btn` | click | `stepPathNext()` → `updatePathUI()` |
| 路径清除 | `path-clear-btn` | click | `clearPathSelections()` |
| 路径关闭 | `path-bar-close` | click | 隐藏路径栏 |
| 搜索输入 | `graph-search` | input | Orama 搜索 → 结果列表 |
| 搜索清除 | `graph-search-clear` | click | 清空搜索+清除高亮 |

## 键盘事件

| 按键 | 上下文 | 功能 |
|------|--------|------|
| `WASD` | 飞船模式 | 飞行(前后左右) |
| `R/F` | 飞船模式 | 上升/下降 |
| `Q/E` | 飞船模式 | 横滚 |
| `Shift` | 飞船模式 | 加速 3× |
| `Space` | 飞船模式 | 切换自动驾驶 |
| `ESC` | 全局 | 关闭弹窗(stats/about)；飞船模式退出指针锁定 |

## DOM 面板清单

| 面板 | DOM ID | 定位 | 显示条件 |
|------|--------|------|---------|
| 邻居面板 | `neighbor-panel` | 可拖拽浮动窗口 | `focusNodeById()` 被调用时 |
| 控制面板 | `graph-control-panel` | 可拖拽浮动窗口 | 点击控制面板按钮 |
| 飞行控制面板 | `fly-control-panel` | 可拖拽浮动窗口 | 进入飞船模式 |
| 路径栏 | `path-bar` | 可拖拽浮动窗口 | 点击路径查找按钮 |
| 统计弹窗 | `stats-dialog` | 可拖拽浮动窗口 | 点击统计信息按钮 |
| 关于弹窗 | `about-dialog` | 可拖拽浮动窗口 | 点击关于按钮 |
| FPS 监控 | (动态创建) | 左下（移动端右下） | 始终显示 |
| Tooltip | `graph-tooltip` | 鼠标旁（自动避让视口边界） | hover 节点时 |
| 加载蒙版 | `loading-overlay` | 全屏 | init3d 完成前 |
| 准星 | `fly-crosshair` | 屏幕中心 | 飞船模式 |

## 路径系统数据流

```
	用户选择起点/终点
	  → checkBothSelected()
	  → api.showShortestPath(fromId, toId)
	  → findShortestPath(neighborMap, from, to)     // BFS in pathfinder.ts
	  → if path found:
	      clearOldPathState()                        // 清旧路径
	      pathNodeIds = path; pathStepIndex = 0      // 设新路径状态 ★
	      refreshPathNodeColors()                    // 节点上色(橙色/最亮)
	      buildPathOverlay(path)                     // 贝塞尔金色管道（沿曲线分段圆柱）
	      return path
	    else: return null

步进按钮:
  → api.stepPathNext() / api.stepPathPrev()
  → pathStepIndex++ 或 --                       // 移动指针
  → refreshPathNodeColors()                     // 更新节点颜色
  → animateCamera()                             // 飞向当前步节点

UI 更新:
  → updatePathUI()
  → api.getPathInfo()
  → 读取 pathNodeIds / pathStepIndex 闭包变量
  → 更新指示器文本: "${step+1}/${total} 步"
  → 更新按钮 disabled 状态
```

### 路径状态闭包变量
```typescript
let pathNodeIds: string[] | null = null;   // 路径节点ID序列
let pathStepIndex = -1;                     // 当前步进索引
let pathOverlayGroup: THREE.Group | null;   // 金线管道组
```

## 数据流关键路径

```
/graph-core.bin → zstd 解压 → msgpackr 解码 → expandCompact() → {nodes, links} → init3d(graphData)
                                                 ├→ createRenderer()     → scene/camera/renderer/controls/InstancedMesh/links
                                                 ├→ createInteraction()  → raycaster/hover/click
                                                 ├→ ensureLabels()       → 按距离创建 Canvas Sprite labels
                                                 ├→ createControlPanel() → DOM panel
                                                 ├→ createNeighborPanel()→ DOM panel
                                                 ├→ buildPathOverlay()  → gold cylinders
                                                 └→ window.__graphApi   → API exposed
```


## 前端控件与浮动面板

界面统一使用 Tailwind CSS v4 与 daisyUI 免费组件。按钮、输入框、滑块、开关、加载状态和统计卡片均采用原生 HTML，可叠加 Tailwind 工具类。

统计、关于、控制、邻居、飞行控制和路径查找面板由 WinBox 管理。拖动标题栏移动，拖动边缘调整尺寸，最大化按钮切换大小；关闭后重开保留本次页面会话的位置、尺寸和状态。刷新恢复默认布局。标题栏获得焦点后方向键移动，Shift 加速，Escape 关闭并返回入口焦点。窄屏窗口限制在视口内，内容内部滚动。

开发验证使用 `bun run dev` 的抽样数据，运行 `bun run lint`、`bun test` 与改动文件格式检查；在系统浏览器检查拖拽、缩放、多窗口、固定暗色主题、搜索、参数持久化和飞行指针锁定。开发模式会清理本项目旧 Service Worker 缓存，避免加载过期控件代码。不得以生产构建替代 dev 检查。

界面固定使用 daisyUI 暗色主题，与宇宙背景一致，不提供亮色模式或主题切换入口；系统浅色偏好及历史 `colorTheme` 本地设置均不影响页面。

### 星球悬停卡片

星球悬停提示与飞船瞄准提示统一采用暗色 daisyUI `card`，显示站名、描述和网址。长网址换行，描述最多显示四行；卡片自动限制在视口内。提示不拦截鼠标，保留星球点击和场景交互。
