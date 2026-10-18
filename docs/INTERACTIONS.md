# 3D 图交互系统

> 2026-10-18 同步：运行环境为 Bun，搜索使用 Orama。客户端路径查找使用 TypeScript BFS；Rust `bfs-rs` 用于构建端全图统计，`force-rs` 用于空间布局。

dev 端点的正式站点数据受 Astro 的 `DEV_SAMPLE_SIZE` 配置控制；友链目标仍可生成额外节点。详见 [开发配置](DEV.md)。

## 绘制与连线

节点由实例化 `SpriteNodeMaterial` 球形替身绘制，每个节点两个三角形；`ctx.nodes` 保留 CPU `InstancedMesh` 接口。`render-scheduler.ts` 合并相机、悬停、路径、参数和尺寸变化引起的绘制请求；控制器阻尼、飞行或标签创建尚未完成时继续调度，稳定后停止申请 RAF。页面隐藏时暂停，恢复可见时重新检查标签并绘制。

| 画质             | 手动跟随画质时上限 | 普通标签预算 | 邻居标签上限 | DPR 上限 |
| ---------------- | ------------------ | ------------ | ------------ | -------- |
| 节能 `low`，默认 | 30 FPS             | 48           | 40           | 1        |
| 均衡 `balanced`  | 45 FPS             | 96           | 100          | 1.5      |
| 清晰 `high`      | 60 FPS             | 160          | 300          | 2        |

邻居标签还受连线数滑块限制，聚焦节点标签另计一个。移动速度、转动与阻尼按时间差更新，降低绘制上限后仍保持相近的飞行速度。渲染器关闭抗锯齿，实际 DPR 不高于设备 DPR。标签细节见 [标签系统](LABELS.md)。

「帧率上限」默认「无限制」，也可独立选择「跟随画质」使用表中上限。无限制模式每个浏览器 RAF 都可绘制，60 Hz 屏幕通常约 60 FPS，高刷新率设备可超过 60；静止及后台仍停绘。设置保存为 `friendlinks_unlimited_fps`，刷新和切换画质均保留，DPR 和标签预算仍由画质控制。性能探针的 `fpsLimit` 返回当前数值或 `"unlimited"`。

普通背景连线使用 `LineSegments`，默认透明度为 0 且隐藏，不预先分配全图位置和颜色缓冲。`EdgeGeometryStore` 保存关系与紧凑的曲线数据，首次显示背景连线时才按实际分段数生成缓冲；indexed geometry 共享相邻端点，颜色为 normalized RGBA8。关闭后释放位置、颜色和索引缓冲，重新开启时完整重建。

悬停或聚焦关系使用独立的高亮组。通过预建的节点关联边索引选择关系，只采样当前需要的边；光晕和核心分别由一个按需分配的 `InstancedMesh` 绘制，复用圆柱几何体、材质和实例矩阵。高亮不再在启动时预建 32,000 个独立 Mesh。

常规悬停、聚焦和背景线使用运行时曲线，不请求 `/graph-bezier.bin`。兼容 API `loadBezierLazy()` 可显式异步加载预计算数据；存在版本时间戳时使用对应带哈希的端点，失败保留运行时曲线并允许重试。

## 金色路径与步进

```text
index.astro: 选择起点/终点 → checkBothSelected()
  → api.showShortestPath(fromId, toId)
  → findShortestPath(neighborMap, from, to)
  → path = [起点, n1, n2, ..., 终点] 或 null
```

`buildPathOverlay(path)` 通过节点 ID 索引读取路径坐标，创建一条穿过各节点的 `THREE.CatmullRomCurve3`。金色核心和外层光晕分别使用一个 `TubeGeometry`，沿曲线各分为 64 段、径向 8 段。它们属于 `pathOverlayGroup`，与悬停关系的实例化圆柱组独立管理。

金色管道只负责视觉显示。步进依赖闭包中的 `pathNodeIds: string[] | null` 和 `pathStepIndex: number`；上一步或下一步更新索引、节点颜色与相机目标，不从几何体反推路径。路径模式隐藏普通背景连线，清除路径后释放金色管道几何体与材质，恢复节点颜色和保存的连线透明度。

相机导航共用一个可取消的动画链。新导航替换旧导航，画布 `pointerdown` 取消当前导航，图实例销毁时取消待执行的动画；动画每次改变相机后请求绘制。

## 公开 API：`window.__graphApi`

| 方法                              | 参数             | 返回                                              | 功能                                                              |
| --------------------------------- | ---------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| `find(query, signal?)`            | `string`         | `Promise<{id,name,url}[]>`                        | Orama 模糊搜索节点                                                |
| `focusNode(id)`                   | `string`         | `void`                                            | 先清除旧高亮，再进入统一聚焦流程                                  |
| `focusNodeById(id)`               | `string`         | `void`                                            | 聚焦节点、高亮关系、打开邻居面板并移动相机                        |
| `highlightNodesAndNeighbors(ids)` | `string[]`       | `void`                                            | 高亮节点及其邻居                                                  |
| `clearHighlights()`               | —                | `void`                                            | 清除高亮和聚焦                                                    |
| `focusByDomain(domain)`           | `string`         | `void`                                            | 按域名聚焦，支持完整 URL                                          |
| `toggleFlightMode()`              | —                | `boolean`                                         | 切换飞船/球幕模式，返回当前状态                                   |
| `showShortestPath(from, to)`      | `string, string` | `string[] \| null`                                | 计算路径，显示金色曲线管道并移动相机                              |
| `stepPathNext()`                  | —                | `boolean`                                         | 下一步，更新颜色与相机                                            |
| `stepPathPrev()`                  | —                | `boolean`                                         | 上一步，更新颜色与相机                                            |
| `clearPath()`                     | —                | `void`                                            | 清除路径并恢复背景连线                                            |
| `getPathInfo()`                   | —                | `{path,totalSteps,currentStep,currentId} \| null` | 获取当前路径状态                                                  |
| `getGraphData()`                  | —                | `{nodes, links}`                                  | 获取当前图实例的数据；dev 使用抽样数据                            |
| `updateLinkOpacity(v)`            | `number`         | `void`                                            | 更新并保存背景连线透明度，请求绘制                                |
| `loadBezierLazy()`                | —                | `Promise<void>`                                   | 提前触发曲线数据加载                                              |
| `getPerformanceStats()`           | —                | 计数对象                                          | 查询绘制、标签、场景对象和缓冲占用，见 [性能验证](PERFORMANCE.md) |
| `dispose()`                       | —                | `void`                                            | 停止实例的异步工作、事件与调度，释放图资源和面板                  |
| `ctx`                             | —                | `RenderContext`                                   | 调试用渲染上下文；手动修改场景后调用 `ctx.requestRender()`        |

## 鼠标与飞船交互

节点拾取先通过静态 BVH 包围盒/包围球筛选候选，按近处优先遍历并剪枝更远的候选，对球形替身执行解析球体相交；普通 `InstancedMesh` 仍执行原生三角形检测。精确检测读取当前实例矩阵，保留聚焦放大、最近交点与 `near` / `far` 裁剪行为。索引适用于当前固定位置的图；若引入节点位置动画，需要同步重建空间索引。

| 事件                   | 实现位置         | 功能                                               |
| ---------------------- | ---------------- | -------------------------------------------------- |
| `mousemove`            | `interaction.ts` | 节点拾取，60ms 节流；目标变化时回调 `onHover`      |
| `pointerleave`         | `interaction.ts` | 清除悬停和高亮，重置进入后的拾取节流               |
| `click`                | `interaction.ts` | 打开节点 URL；飞船模式使用屏幕中心射线             |
| `contextmenu`          | `interaction.ts` | 聚焦节点或取消聚焦                                 |
| 邻居标签点击/右键      | `index.ts`       | 独立 Sprite 射线检测，优先打开网址或聚焦该邻居     |
| `mousemove` 捕获阶段   | `index.ts`       | 记录鼠标坐标，供 Tooltip 定位                      |
| 指针锁定时 `mousemove` | `enterFlyMode()` | `movementX/Y` 更新准星速度，再按时间差更新相机旋转 |

飞船模式使用 WASD / R / F 移动、Q / E 横滚，Shift 加速 3 倍，Space 切换自动驾驶。准星自动目标扫描最多每 120ms 执行一次，停止运动时再更新一次。没有按键、自动驾驶或惯性时，飞船模式也可以停绘。只有本画布持有 pointer lock 才更新飞行；释放后暂停运动并清理惯性，X 仍可退出。锁定失败会显示可重试原因，不伪造锁定状态。

进入飞船模式时打开飞行控制面板并保留鼠标指针，点击画布重新锁定。Escape 只释放指针锁定并清空飞行按键；X 或飞船模式按钮退出飞船模式。

## 按钮与面板

| 控件              | DOM ID                                | 功能                                                 |
| ----------------- | ------------------------------------- | ---------------------------------------------------- |
| 飞船模式          | `fly-toggle`                          | 切换飞船/球幕模式                                    |
| 关于              | `about-toggle`                        | 显示关于面板                                         |
| 统计信息          | `stats-toggle`                        | 显示统计面板，读取 `/stats.json`                     |
| 控制面板          | `opacity-toggle`                      | 显示画质、连线透明度、飞船速度、节点标签及连线数上限 |
| 路径查找          | `path-toggle`                         | 显示/隐藏路径面板                                    |
| 路径上一步/下一步 | `path-prev-btn` / `path-next-btn`     | 移动路径步进并更新 UI                                |
| 路径清除          | `path-clear-btn`                      | 清除路径选择和路径效果                               |
| 路径关闭          | `path-bar-close`                      | 隐藏路径面板                                         |
| 搜索输入/清除     | `graph-search` / `graph-search-clear` | 搜索节点，或清空搜索与高亮                           |

| 面板/元素     | DOM ID                          | 显示条件                                            |
| ------------- | ------------------------------- | --------------------------------------------------- |
| 邻居面板      | `neighbor-panel`                | 聚焦节点时                                          |
| 控制面板      | `graph-control-panel`           | 点击控制面板按钮                                    |
| 飞行控制面板  | `fly-control-panel`             | 进入飞船模式                                        |
| 路径面板      | `path-bar`                      | 点击路径查找按钮                                    |
| 统计/关于面板 | `stats-dialog` / `about-dialog` | 点击对应按钮                                        |
| 绘制状态      | 动态创建                        | 画布顶部中央；活动期间显示 FPS，静止显示 `空闲停绘` |
| Tooltip       | `graph-tooltip`                 | 鼠标悬停或飞船瞄准节点时，自动避让视口边界          |
| 加载蒙版      | `loading-overlay`               | 图实例完成初始化和首帧前                            |
| 准星          | `fly-crosshair`                 | 飞船模式                                            |

## 生命周期与界面约定

`init3d()` 初始化新图前清理已完成的旧实例，开发热更新也会调用实例清理。异步渲染器初始化用代次守卫淘汰迟到实例，下载、WASM 等待和渲染器初始化的取消边界均检查 AbortSignal。`dispose()` 中止曲线请求，停止绘制与相机动画，移除可见性和交互事件，断开尺寸观察，清理控制器、面板、标签纹理、实例网格和渲染器。已销毁实例不再用于交互。

界面统一使用 Tailwind CSS v4 与 daisyUI 免费组件。按钮、输入框、滑块、开关、加载状态和统计卡片采用原生 HTML；页面固定使用暗色主题，系统浅色偏好和历史 `colorTheme` 设置不影响页面。

统计、关于、控制、邻居、飞行控制和路径查找面板由 WinBox 管理。标题栏可拖动，边缘可缩放，最大化按钮切换大小；关闭重开保留当前会话的位置、尺寸和状态，刷新恢复默认布局。标题栏获得焦点后方向键移动，Shift 加速，Escape 关闭并返回入口焦点。窄屏窗口限制在视口内，内容内部滚动。

悬停与飞船瞄准提示统一使用暗色 daisyUI `card`，显示站名、描述和网址。长网址换行，描述最多四行；提示不拦截鼠标，保留场景点击和拖动。

开发验证使用 `bun run dev` 的抽样数据，在系统浏览器检查交互并保留标签页；运行 `bun run lint`、`bun test`、`bun run check` 与改动文件格式检查。开发模式会清理旧 Service Worker 缓存。未经用户明确授权，不执行生产构建、全库 BFS、提交或推送。
