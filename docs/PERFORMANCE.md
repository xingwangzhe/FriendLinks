# 前端性能验证

2026-10-18：默认性能优先。保留完整图、搜索、聚焦、路径与飞行功能，减少节点几何量、显存记账、候选扫描及空闲工作。跨仓库原生算法和构建缓存另见 [构建性能报告](BUILD-PERFORMANCE.md)。

## 全量图实测

使用系统 Chrome 155、Intel Iris Xe / gen-12lp 集显，视口 1920×906、DPR=1、节能档。对照冻结在同一份 **49,064 节点、107,527 条边**的数据；新版 HTML 使用最终前端资源和旧图时间戳，避免上游新增站点改变布局后混入对比。每个场景交错测试三轮、交换先后顺序，每轮预热 4 次并测量 20 次。

计时从 `renderer.render()` 开始，到 `await renderer.backend.device.queue.onSubmittedWorkDone()` 完成。这是包含 CPU 提交、驱动和 GPU 队列完成的串行延迟；探针绕过活动 FPS 上限，不能当作实际屏幕 FPS、Core Web Vitals 或纯 GPU timestamp。

| 场景                      | 第一轮旧 → 新  | 第二轮旧 → 新  | 第三轮旧 → 新   | 每轮下降    |
| ------------------------- | -------------- | -------------- | --------------- | ----------- |
| 默认全景                  | 7.30 → 3.40 ms | 7.15 → 3.50 ms | 8.55 → 4.05 ms  | 51.0%–53.4% |
| 聚焦姓王者、41 个邻居标签 | 6.55 → 4.20 ms | 9.90 → 4.20 ms | 11.00 → 5.50 ms | 35.9%–57.6% |

| 确定性指标                  |         优化前 |                             当前 |
| --------------------------- | -------------: | -------------------------------: |
| 节点三角形                  |      1,766,304 |            98,128（减少 94.44%） |
| 全景实际三角形，含输出 pass |      1,766,305 |                           98,129 |
| 聚焦实际三角形，含输出 pass |      1,868,843 |                          149,403 |
| 节点 GPU 实例属性数组       |    3,728,864 B |         981,280 B（减少 73.68%） |
| Three 记账的全景资源        |   34,008,639 B |      14,904,336 B（减少 56.18%） |
| Three 记账的聚焦资源        |   35,795,359 B |                     16,651,016 B |
| 全量背景线属性及索引        |  151,859,664 B |      77,650,264 B（减少 48.87%） |
| 背景线隐藏后数组            | 保留已分配缓冲 |               0 B，释放 GPU 缓冲 |
| 静止时持续渲染              | 上轮优化已停绘 | 仍为 0；等待标签批次也不重复绘图 |

Three 的记账包括属性、纹理、内部 target 和程序等，不是设备总 VRAM；节点 CPU 矩阵仍保留，实例属性下降不能等同于 JS 堆下降。全景实际 draw calls 仍为 2，其中包含颜色空间输出 pass；主要收益来自减少每次绘制的工作量。

初次探索曾观察到聚焦 17–25ms 的回退，保留在 `optimized-focus.json`。随后使用冻结旧产物、同镜头和交错顺序复测，三轮新版均改善；最终表使用 `final-*-interleaved.json`，不挑选最有利的一次结果。系统负载和 GPU 时钟会影响绝对耗时，因此同时保留几何量、字节数与全部原始样本。

原始资料：[汇总](../reports/frontend-performance-2026-10-18/summary.json)、[全部浏览器与测试记录](../reports/frontend-performance-2026-10-18/README.md)。

## 渲染与内存策略

- 节点使用 Three 官方 `SpriteNodeMaterial` 和 TSL 实例属性，每节点两个三角形；中心与半径为 Float32，颜色为 normalized RGBA8。不可见的 CPU `InstancedMesh` 代理保留现有矩阵、聚焦和拾取接口，不上传原球体几何及矩阵属性。
- 画布为不透明输出，关闭 MSAA，使用 8bit 内部输出缓冲；无需 HDR、灯光、Bloom 或持续流动粒子。Three 的 WebGL backend 仍可能创建 alpha context，不将显存收益归因于关闭 context alpha。
- 默认节能：活动上限 30 FPS、DPR 上限 1；均衡和清晰分别为 45/60 FPS、DPR 上限 1.5/2。实际密度不高于设备 DPR。画质可持久化，静止时均停绘。
- 背景线保留原 16–32 段曲线和所有 Float32 坐标，indexed geometry 共享相邻端点，RGBA8 量化颜色。默认不分配全图缓冲；隐藏后释放，重新开启时完整重建。全量重建有一次性 CPU 成本，本机约 269ms，频繁开关应考虑这项代价。
- 悬停和聚焦通过关联边索引只采样当前关系；两个无光照实例批次绘制核心与光晕，移除相接圆柱的内部端盖，容量按实际段数分配。
- 全量颜色刷新合并上传范围、批末更新一次版本；路径步进只修改前后两个节点；从聚焦切换到路径时先恢复旧节点半径。

球形替身的片元深度位于 billboard 平面，极近距离、穿过节点和近裁剪轮廓与真实球体有差异。当前 UI 只使用均匀节点缩放。8bit 线性输出和 RGBA8 会量化暗色渐变及低 alpha 叠加；这些是明确的性能取舍，仍需按实际设备检查外观。

依据：[Three SpriteNodeMaterial](https://threejs.org/docs/pages/SpriteNodeMaterial.html)、[Renderer 输出配置](https://threejs.org/docs/pages/Renderer.html)、[BufferGeometry 与释放](https://threejs.org/docs/pages/BufferGeometry.html)、[BufferAttribute normalized 属性](https://threejs.org/docs/pages/BufferAttribute.html)、[MDN WebGL 最佳实践](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)。

## CPU、调度与搜索

`LabelCandidateIndex` 在固定布局上建立 600 单位空间格。新标签查询附近单元，已有标签独立检查到 1500 单位，有界堆选择最近预算，同距离保持原节点顺序。普通标签预算为 48/96/160，邻居预算为 40/100/300；每批最多创建四张纹理。150ms 批次间由一个可取消任务唤醒，不靠渲染相同帧等待。页面隐藏及销毁会清理任务。

BVH 按近处优先遍历，已有命中后剪枝远处候选；球形节点使用解析相交，普通 InstancedMesh 保留三角形检测。相同 hover 射线复用结果，相机、矩阵版本、layers、near/far 改变后失效，点击强制重新检测。合成遮挡列有明显收益；10k 网格增加约 5µs，不能将微基准倍率解释为整页 FPS。[微基准数据](../reports/frontend-performance-2026-10-18/interaction-microbench.json)。

搜索索引只在首次非空查询时创建，并发查询共享 Promise，空查询不建立数据库。保留 Orama 字段、CJK bigram、插入顺序、BM25 排序和最多 12 条结果；关闭未使用的属性排序索引，同步插入不逐项 await，每 128 条通过 `scheduler.yield()` 让出主线程，不支持时回退任务定时器。14 个查询的完整 ID、排名及 BM25 分值差分测试通过。

同图首搜的一次对照为 4.059s → 3.770s，域名与中文结果一致。首次搜索仍有数秒等待，不能将延迟建库描述成消除了索引成本。主搜索和路径输入有 150ms debounce、AbortSignal 和过期结果保护；清空、选中或关闭后不会被旧请求覆盖。统计弹窗首次成功后复用数据和 DOM，不反复请求或重绘。

客户端最短路径使用带 head 下标的队列和反向回溯，移除 `shift` / `unshift` 的二次搬移，保持 BFS 的 O(V+E) 时间；随机差分与 16k 宽层、长链测试覆盖路径选择语义。

`init3d()` 在异步 renderer 初始化后检查取消信号和初始化代次，迟到实例释放自身资源。WASM 等待、渲染器等待、预先取消和两个并发初始化均有真实入口回归测试。HMR 和重复初始化清理旧图、控件、标签、曲线请求及 RAF。

普通交互不会请求全量 `graph-bezier.*.bin`，曲线在本地按需采样；兼容 API `loadBezierLazy()` 和 `init3dFromUrl(core, signal, bezierUrl)` 仍保留。

## 最终产物与浏览器验收

推送前合并远端新增的 seisamuse 记录。旧扁平 YAML 已核实博客、原创文章及当前友链页后迁移至规范 Schema 和域名文件名，保留原关系。最终产物为 **8571 站点、49,064 节点、107,528 条边**，比冻结性能对照增加一个正式站点和一条关系，节点数不变。

最终全量构建 37.613s（新关系触发布局重算）；此前同数据缓存构建 6.887 / 7.245s。最后源码校验与 lint、Astro check、tests 并行时构建为 13.688s，该轮仅验证成功，不纳入受控性能对照。输出检查通过，验证节点/边端点、有限坐标、3838 个曲线段、33 个资源引用和时间戳 fallback。构建任务此前的严格同数据全量基线与 registry 结果见 [构建性能报告](BUILD-PERFORMANCE.md)，不将两份不同关系的数据当作精确构建加速对照。

系统 Chrome 还验证了：抽样 dev 682 节点/683 边、多窗口、键盘移动和拖动、暗色主题、画质持久化、统计重开只请求一次、快速清空搜索、实际 pointer lock 和按住 W 的飞行移动，以及解锁后 X 退出。注入的 Escape 没有触发浏览器原生解锁，因此解锁步骤使用 `document.exitPointerLock()`，不声称自动化覆盖了实体 Esc 按键。

正常默认 WebGPU 与官方 `forceWebGL:true` 构造的独立 renderer 均完成全量节点、聚焦标签和 316 万曲线段绘制，WebGL `getError()=0`，无 shader 错误；测试结束销毁临时 renderer 并恢复正常页面。窗口缩放手柄与 390×844 窄屏边界检查通过，测试后恢复默认尺寸。最终完整页面预览保持打开：[正式产物](http://127.0.0.1:4392/)，[抽样 dev](http://127.0.0.1:4393/)。

## 复测

```sh
bun run lint
bun run check
bun test
bun run validate
bun scripts/experiments/frontend-interaction-bench.ts
```

未经用户授权不运行生产构建或全库 BFS。开发交互使用 `DEV_SAMPLE_SIZE=100 bun run dev`。有构建授权时，`bun scripts/verify-build-output.ts dist` 检查当前产物；只有数据完全一致才传入旧 dist 路径做精确对照。

页面 Console 的 `window.__graphApi.getPerformanceStats()` 提供：累计 `frames`、`labelScans`、`labelCandidatesVisited`、`labelCreates`、`overlayBuilds`；最后实际帧的 `drawCalls`、`triangles`、`lines`、`renderCpuMs`；`rendererTrackedBytes`、包含索引的 `backgroundBytes`、标签数、质量和 DPR，以及搜索、曲线、pointer lock、待执行 RAF 和标签任务状态。`renderCpuMs` 仅为 CPU 提交耗时，`sceneObjects` 不等于 draw calls。

静止复测时保持页面可见，不移动鼠标：

```js
const before = window.__graphApi.getPerformanceStats();
await new Promise((resolve) => setTimeout(resolve, 2000));
const after = window.__graphApi.getPerformanceStats();
console.table({
  frames: after.frames - before.frames,
  labelQueries: after.labelScans - before.labelScans,
  pendingFrame: after.pendingFrame,
  pendingLabelTask: after.pendingLabelTask,
  backgroundBytes: after.backgroundBytes,
});
```

稳定后预期新增帧、标签查询和背景缓冲均为 0，两个待执行标志为 false；交互后可恢复绘制，结束后再次停绘。按需策略参考 [Three Rendering on Demand](https://threejs.org/manual/en/rendering-on-demand.html)。
