# FriendLinks 前端性能记录 · 2026-10-18

结果与取舍见 [docs/PERFORMANCE.md](../../docs/PERFORMANCE.md)。本目录保留成功、初次回退观测、微基准、最终校验和截图，不将不同数据或不同测量方法混为一项加速。

## 数据与版本边界

渲染对照固定在 8570 主站、49,064 节点、107,527 条关系。基线是进入本轮前已经完成按需停绘、BVH 和 lazy search 的版本；本轮降低的是其活动绘制、内存及重复工作，基线本来就能空闲停绘。

推送前合并了远端新站点，修复其旧 YAML Schema 并保留唯一关系。最终发布产物为 8571 主站、49,064 节点、107,528 条关系，校验结果单独记在 `output-final.json`。不能用这份新增关系后的坐标直接做前后镜头对照。

## 文件

- `summary.json`：三轮交错渲染的正确中位数、成对耗时下降、相机一致检查及最终产物数量。
- `final-overview-interleaved.json` / `final-focus-interleaved.json`：最终 8bit 输出版本，每场景三轮，每轮 4 次预热和 20 次测量，交换先后顺序。
- `baseline-*.json` / `optimized-*.json` / `focus-interleaved.json`：探索阶段记录，后者尚未包含最终 8bit target。`optimized-focus.json` 有一轮明显回退；后续固定图与交错顺序复核，没有隐藏该观测。
- `final-overview.json`：首次验证 8bit target 的数组、资源记账与原始时间。
- `environment.json`：Chrome 155、Intel gen-12lp 集显、DPR=1。WebGL driver 另见 `webgl-browser.json`。
- `background-browser.json`：相同采样的全部曲线为 77,650,264 B，隐藏后 0；包含位置、RGBA8 颜色及 Uint32 index 字节，不漏计索引。
- `webgl-browser.json` / `webgl.jpg`：用官方 `forceWebGL:true` 构造临时 renderer，复用完整 scene，确认 TSL、RGBA8、标签与全部背景曲线可渲染；`getError()=0`。正常默认后端仍为 WebGPU，临时 renderer 已销毁。
- `search-browser.json`：同一冻结图的首次并发域名/中文搜索，空查询不建库，结果相同；首次建库仍需数秒。这是一次观测，不当作重复性能基准。
- `idle-final.json`：最终合并数据的真实可见页面，镜头与标签稳定后两秒新增 frame/label query 均为 0；无待执行 RAF/label task、无背景数组、无自动 Bezier 请求。
- `dev-browser.json`：682 节点/683 边抽样开发页，真实 pointer lock、按住 W、解锁后 X 退出，多窗口、拖动及统计复用。浏览器注入 Escape 未触发原生解锁，使用显式 `document.exitPointerLock()`，不把它报告为实体 Esc 验证。
- `window-browser.json`：真实缩放手柄将窗口 340×420 缩至 310×380；390×844 窄屏下边界仍在视口内，随后恢复尺寸。
- `interaction-microbench.json`：合成遮挡列、网格和 1000 条曲线微基准，包含既有 BVH 对照和小规模排序回退。复现：`bun scripts/experiments/frontend-interaction-bench.ts`。
- `tests-final.log`、`lint-final.log`、`astro-check-final.log`、`format-final.log`、`validate-final.log`：最终源码校验。
- `build.log` / `build-final.log`：同旧图的缓存构建 6.887 / 7.245s。`build-merged.log`：新关系使布局失效，完整重算 37.613s。后续小修的缓存构建单独记录，不重复全库计算。
- `output-verification.json`：合并前与原始构建精确对照，站点/拓扑/统计与量化曲线通过；`output-final.json`：合并后独立完整产物校验。
- `audit-before.json` / `audit-after.json`、`transitive-update.log`、`transitive-smoke.json`：范围内传递依赖补丁及审计清零，保留 TS6；SVG 解码和 source-map 查询通过。
- `*-security.log` / `output-security.json`：追加修复后的最终校验，84 tests / 4840 assertions、Astro check 无错误警告、构建成功，图数据/统计/坐标与补丁前完全一致。
- `security-browser.json` / `final.jpg`：最终构建的可见页面与空闲停绘证明；飞行未锁定时首击未打开链接，该次实际锁定因文档焦点失败，未伪报成功。
- `*-unlimited.log` / `output-unlimited.json`：按用户最后要求改为默认不限帧后的源码与构建校验，88 tests / 4875 assertions 全通过，Astro check 0 errors / 0 warnings / 7 hints，缓存构建 7.908s；图、统计和坐标与补丁前完全一致。
- `unlimited-browser.json` / `unlimited.jpg`：无历史设置时默认无限制，画质独立、刷新持久化、停绘检查；另用连续 RAF 请求探针验证节能手动上限 30 帧/秒，无限制约每次浏览器 RAF 都绘制。探针是主动请求绘制的功能验证，不当作性能基准。

## 浏览器渲染探针

在同一个系统 Chrome、相同尺寸和 DPR 下保留旧 dist，并准备新版 dist。此任务旧 dist 的本地快照为 `/tmp/friendlinks-frontend-baseline-20261018`，在 `http://127.0.0.1:4394/` 提供旧页面。将新版 `_astro` 目录追加到该快照，用新版 HTML 替换其中的 `window.__BIN_TIMESTAMPS` 为旧映射，保存 `optimized.html`。这样两页分别执行新旧前端，却读取完全相同的图和统计文件。快照仅作本地实验，不参与发布。

每轮先等待相机动画、阻尼和标签稳定，核对 camera.position、quaternion、视口及 graph 节点/关系数相同，再在各自页面 Console 执行：

```js
const { renderer, scene, camera } = window.__graphApi.ctx;
renderer.info.autoReset = false;
const samples = [];
for (let index = 0; index < 24; index++) {
  renderer.info.reset();
  const start = performance.now();
  renderer.render(scene, camera);
  await renderer.backend.device.queue.onSubmittedWorkDone();
  if (index >= 4) samples.push(performance.now() - start);
}
console.log({ samples, render: renderer.info.render, memory: renderer.info.memory });
```

上述 WebGPU 探针人为串行等待队列并绕过应用 30 FPS 上限，是可比较的渲染工作延迟；不等于呈现到屏幕的 FPS，也不是单独的 GPU timestamp。三个交错轮次保留全部样本；实际产品仍按需绘制，空闲不执行该探针。

运行期间完成必要页面校验后保留 Tab。开发 HMR 和重建替换资源时应重新加载页面；不要让旧页面第一次动态 import 去请求已被本地重建移除的旧时间戳文件。

最后补充：客户端 BFS 队列和回溯已去除二次搬移；83 项测试、4827 断言通过。Astro check 检查 82 文件，0 errors、0 warnings、7 hints。`upstream-integration.json` 核实所有原站点记录逐项 JSON 等价、所有原关系经当前规范身份映射后保留，唯一新增关系为 seisamuse — 莫比乌斯。`flow-final.json` 还确认聚焦半径60切换路径后恢复40，以及前后步进成功。`bezier-explicit-final.json` 验证最终20,792,316字节预计算文件可显式加载，随后刷新恢复默认未加载状态。最后一次缓存构建与全套校验并行耗时13.688s，只作成功校验，不作为受控基准。
