# 3D 图交互系统审计

## 黄线路径信息来源

### 数据获取
```
astr: 输入起点/终点 → checkBothSelected()
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
| `find(query)` | `string` | `{id,name,url}[]` | Fuse.js 模糊搜索节点 |
| `focusNodeById(id)` | `string` | `void` | 聚焦节点：高亮+金线+面板+相机飞行 |
| `highlightNodesAndNeighbors(ids)` | `string[]` | `void` | 高亮节点及其邻居 |
| `clearHighlights()` | — | `void` | 清除高亮和聚焦 |
| `focusByDomain(domain)` | `string` | `void` | 按域名聚焦节点 |
| `toggleFlightMode()` | — | `boolean` | 切换飞船/球幕模式，返回当前状态 |
| `showShortestPath(from, to)` | `string, string` | `string[] \| null` | 计算并显示最短路径(金线+橙色节点+相机飞行) |
| `stepPathNext()` | — | `boolean` | 下一步，更新颜色+相机 |
| `stepPathPrev()` | — | `boolean` | 上一步，更新颜色+相机 |
| `clearPath()` | — | `void` | 清除路径：清金线+恢复颜色+恢复连线 |
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
| 关于 | `about-toggle` | click | 显示/隐藏关于弹窗 |
| 统计信息 | `stats-toggle` | click | 显示统计弹窗(`fetch /stats.json`) |
| 控制面板 | `opacity-toggle` | click | 显示/隐藏控制面板(连线透明度+飞船速度+标签开关) |
| 路径查找 | `path-toggle` | click | 显示/隐藏路径栏 |
| 路径上一步 | `path-prev-btn` | click | `stepPathPrev()` → `updatePathUI()` |
| 路径下一步 | `path-next-btn` | click | `stepPathNext()` → `updatePathUI()` |
| 路径清除 | `path-clear-btn` | click | `clearPathSelections()` |
| 路径关闭 | `path-bar-close` | click | 隐藏路径栏 |
| 统计关闭 | stats-modal `.close-btn` | click | `hideStatsModal()` |
| 关于关闭 | about-modal `.close-btn` | click | `hideAboutModal()` |
| 搜索输入 | `graph-search` | input | Fuse.js 搜索 → 结果列表 |
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
| 邻居面板 | `neighbor-panel` | 右侧居中 | `focusNodeById()` 被调用时 |
| 控制面板 | `graph-control-panel` | 右下 | 点击控制面板按钮 |
| 飞行控制面板 | `fly-control-panel` | 左下 | 进入飞船模式 |
| 路径栏 | `path-bar` | 底部 | 点击路径查找按钮 |
| 统计弹窗 | `stats-modal` | 居中遮罩 | 点击统计信息按钮 |
| 关于弹窗 | `about-modal` | 居中遮罩 | 点击关于按钮 |
| FPS 监控 | (动态创建) | 顶部居中 | 始终显示 |
| Tooltip | `graph-tooltip` | 鼠标旁 | hover 节点时 |
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
      buildPathOverlay(path)                     // 金线管道
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
/graph.bin  → expandCompact() → {nodes, links} → init3d(graphData)
                                                 ├→ createRenderer()     → scene/camera/renderer/controls/InstancedMesh/links
                                                 ├→ createInteraction()  → raycaster/hover/click
                                                 ├→ createLabels()       → Canvas Sprite labels
                                                 ├→ createControlPanel() → DOM panel
                                                 ├→ createNeighborPanel()→ DOM panel
                                                 ├→ buildPathOverlay()  → gold cylinders
                                                 └→ window.__graphApi   → API exposed
```
