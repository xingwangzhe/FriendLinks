# 跨仓库构建性能实验（2026-10-18）

本轮由用户明确授权全量构建、算法比较、本地 native 构建与链接，以及完成验证后的 npm 发版。日常代理操作仍遵守 AGENTS.md：未经另外授权，不运行生产构建或推送。

## 输入和测量方法

- FriendLinks：8,570 个正式站点，118,127 条原始友链引用；统一身份后图为 49,064 节点、107,527 无向边（215,054 条 CSR 弧）。`unverified` 不进入输入。
- 真实 fixture 由 `scripts/export-build-fixture.ts` 从同一套身份和拓扑代码导出，包含节点顺序、CSR、初始坐标和完整力导参数；SHA-256 为 `aa3f3db3eae6914ecb3651ecff3cdfeba7dc78fb1e4bf822e6936079b54c1e70`。大体积 fixture 不提交，可按命令重新生成。
- 本机 Intel i7-1260P，12 核 / 16 逻辑线程，约 14 GiB RAM；Bun 1.4.3，Rust 1.99.0。运行原始数据保存在 `reports/build-performance-2026-10-18/`。
- 计时串行进行，不与另一个基准、Rust 编译并行。完整构建包含 Astro 打包、全量数据端点和时间戳后处理，使用 `/usr/bin/time -v` 记录墙钟时间和 RSS。
- `--force` 同时绕过本项目新增缓存和 Astro 增量缓存，完整重新计算。这里的“冷构建”指禁用应用缓存，不代表清空操作系统文件页缓存。
- 优化前使用实际 npm 0.2.3 包；优化时在两个 native 仓库执行 `bun link`，消费仓库执行 `bun link --no-save @xingwangzhe/force-rs @xingwangzhe/bfs-rs`。原始包副本独立保存，避免本地编译覆盖基线。

## 正式 npm 包的最终验收

FriendLinks 最终使用 registry 中实际发布的两个 0.3.0 包，入口均为本项目 `node_modules` 内的普通文件，包含全部六个平台二进制；本地链接已解除。以下时间包括 Astro、数据端点与时间戳后处理，原始时间、RSS、日志和产物校验结果均保存在同名报告文件中。

| 场景                             |    墙钟时间 | 说明                                               |
| -------------------------------- | ----------: | -------------------------------------------------- |
| 原流水线 / npm 0.2.3 完整基线    |    110.97 s | 单次完整基线                                       |
| 正式 npm 0.3.0，`--force`        | **54.01 s** | 禁用 Astro 与自定义缓存，完整重算                  |
| 正式 npm 0.3.0，首次写入最终缓存 |     42.25 s | 全量 YAML 解析、342 ticks、完整 BFS 和压缩         |
| 正式 npm 0.3.0，缓存命中第 1 次  |  **6.93 s** | 8,570 份源文本内容校验；图、统计及两个压缩输出命中 |
| 正式 npm 0.3.0，缓存命中第 2 次  |  **7.07 s** | 相同输入与缓存命中范围，重新生成并校验完整产物     |
| 本地候选，仅修改一个站点描述     |     15.35 s | 1 份 YAML 重解析，复用完整布局，正确更新元数据     |

正式包强制重算相对单次原流程基线减少 **51.3%**。该轮峰值 RSS 从 2,582,252 KiB 降至 **1,468,548 KiB**，减少 **43.1%**（约 2.46 GiB → 1.40 GiB）。两次正式包缓存命中平均 **7.00 s**。完整日志中的力导阶段为 29.1 s、BFS 为 0.3 s；独立原生进程基准与完整构建的环境和内存压力不同，分开报告。

所有正式包轮次均通过 `scripts/verify-build-output.ts`：8570 站点、49064 节点、107527 边；`all.json` 与基线逐字节一致，完整统计和拓扑一致，曲线精度和 26 条资源引用校验通过。最终完整强制构建的节点坐标相对 RMS 差为 `1.34e-16`，最大绝对差 `1.02e-10`。原始汇总见 [summary.json](../reports/build-performance-2026-10-18/summary.json)。

最终轻量验证为 52 项 Bun 测试、914 次断言，lint 通过；TypeScript 保持 6.0.3，`astro check` 为 0 errors、0 warnings。`bun outdated` 仅列出用户要求保留的 TypeScript 6.0.3（registry 最新为 7.0.2）。移除了没有任何运行时引用的 d3-force-3d 及其旧 ambient 声明。

## 开发阶段首轮对照

| 项目              | npm 0.2.3 + 原流水线 | 新 native 实现 + 新流水线，无新增缓存 |
| ----------------- | -------------------: | ------------------------------------: |
| 完整构建墙钟      |             110.97 s |                               47.09 s |
| 峰值 RSS          |        2,582,252 KiB |                         1,269,904 KiB |
| 力导 342 ticks    |               55.2 s |                                22.0 s |
| BFS 原生调用      |               20.1 s |                                 0.2 s |
| Bezier 计算及量化 |                1.3 s |                                 0.5 s |

这次本地候选的墙钟减少 57.6%，RSS 减少 50.8%。后续本地强制重算为 50.71 s；完整重算并写入缓存的两轮为 44.71 / 40.47 s。正式发布包的最终验收以上节为准，所有候选与复测记录均保留。

## 算法与依赖选择

### BFS

采用 [MS-BFS 论文](https://www.vldb.org/pvldb/vol8/p449-then.pdf) 的位并行思想，64 个独立来源共享一个 `u64` 的邻接扫描。再按前沿大小选择 push / pull；验证图严格无向后，才对相同邻居集合的节点进行精确加权合并。此图缩为 19,479 个加权节点，所有来源之间的距离计数仍被完整保留。小图、长路径等形状保留独立 BFS。

真实图独立基准：已发布包单次 15,172 ms；普通 64 来源 push 中位数 1,765 ms；加权合并后 push 623 ms；加 push / pull 和运行时 POPCNT 后，两个相反测量顺序的中位数为 371 / 405 ms。所有 128 桶及最大距离 14 完全一致，结果 SHA-256 为 `726dceb63c25d5f190e0a259bc201eb18905087e45072a498a4b6a98402e7680`。

实际比较 [petgraph 0.8.3 的 Bfs](https://docs.rs/petgraph/0.8.3/petgraph/visit/struct.Bfs.html)：使用相同数据、16 线程、复用队列与位图，全源计算为 25,387 ms，结果一致，因此未将它加入生产依赖。也检查了 `graph` 和 `parallel_frontier` 的任务模型；这些通用单源接口不能直接共享全源扫描。算法代码独立编写，参考论文没有复制第三方实现。

POPCNT 通过运行时能力检测启用，旧 x86 CPU 保留通用实现，ARM 采用通用编译；没有使用 `target-cpu=native`。删除没有使用的 serde / serde_json，并升级 N-API 及兼容传递依赖。包内保留独立 JS BFS 差分测试，包括有向图、断连、重复边、自环、64 lane 边界、距离 320 和 CSR 未使用尾部。

### 力导布局

保留现有力模型、节点顺序、theta=0.8、alphaDecay=0.02 和全部 342 次冷却迭代。使用可复用的连续八叉树 arena、预计算的无栈遍历链接，以及可复用 SoA / 双状态缓冲。新增 `Simulation.run()` 在 Rust 内执行有限次数和时间上限的迭代，避免每次跨 N-API 返回约 2.4 MB 数组。

检查了 `particular`、`barnes-hut-tree`、`ferreus_bbfmm` 等 crate 的力核、边界和接受条件。直接替换会改变当前模型或近似语义，未将其作为兼容升级。保留 `legacy` 参考实现；Morton 排序的评估顺序作为显式实验选项，未凭单个有利样本自动切换默认值。

首轮独立 342 tick 基准：已发布包 42.989 s，连续 arena 默认方案 24.302 s，显式 ordered 22.903 s。相同 alpha 和布局质量指标；与原包的全部状态比较最大绝对差小于 `8e-11`。精确的 packet 遍历实验通过差分，但短基准变慢，已删除。

这是一组在本项目输入上实际胜出的实现与参数，不代表对所有图和硬件证明全局最优。PGO 训练和 holdout 采用不同规模、不同种子的合成图；真实 FriendLinks 图用于额外验证。

### 已淘汰的 YAML Worker 方案

另用 8,570 份相同源文件（11,662,776 字节 UTF-8 文本）比较串行、2 / 4 个 Bun Worker。每个方案使用独立进程，统一先按 128 个文件一批预读；解析计时包括 Worker 启动、模块导入、真实生产 Zod Schema 校验、双向 structured clone 和稳定顺序恢复。下表每项测量一次，作为淘汰候选的探索性证据，不能当作完整站点加载耗时。

| 方案             | 解析与 Schema 校验 | 相对串行变化 | 进程峰值 RSS |
| ---------------- | -----------------: | -----------: | -----------: |
| 串行             |            6.114 s |         基线 |    273.7 MiB |
| 2 个 smol Worker |            5.401 s |     快 11.7% |    408.3 MiB |
| 4 个 smol Worker |            6.789 s |     慢 11.0% |    464.0 MiB |
| 2 个普通 Worker  |            8.696 s |     慢 42.2% |    434.2 MiB |

所有方案的记录顺序和内容 SHA-256 均为 `b90a6d2505cd3f8d8230593e41b061c2ba81f87ca4312df067245e039a2903e0`，错误列表均为空。两份合法、两份非法的 fixture 还核实了串行与 Worker 的错误文字、记录和顺序一致。最快方案只改善 11.7%，未达到预设的 20% 收益门槛且增加内存，因此没有引入生产 Worker 池，保留按文件内容哈希复用的串行方案。

实验脚本位于 `scripts/experiments/yaml-worker-bench.ts`；[原始记录](../reports/build-performance-2026-10-18/yaml-worker-experiment.json)保留每次时长、峰值 RSS、输入大小与输出哈希。该实验不包含完整身份解析，不能把 6.114 s 的解析计时与完整构建中的站点加载阶段直接比较。

## 流水线与缓存

- 生产构建使用 Bun 启动本地锁定 Astro，开启 `--timings`，不再在每次构建时解析 `astro@latest`。
- 服务端压缩从 WASM 改为 Bun 原生 Zstandard，仍为 level 10。浏览器继续使用现有 WASM 解压器，跨实现兼容测试覆盖空数据、UTF-8、全字节和大二进制。
- 修复 Bezier 每轴多分配三倍空间，以及 msgpackr 默认编码 `Int16Array` 时未保留原始字节的问题；现在显式写入字节视图。浏览器解码兼容非对齐的二进制切片。
- parsed YAML 按实际源文本哈希逐文件复用；新增、改动、重命名、删除和无效 YAML 均已测试。身份映射仍先在完整数据上建立，再采样。
- 图和统计缓存包含完整逻辑输入、实现源码、包 manifest、loader 和 `.node` 哈希，以及 Bun、平台、libc、线程配置。本地同版本重新编译会失效。统计还包含原始记录数量，避免元数据不变时返回旧文件数。
- 压缩输出缓存使用输入内容哈希、Bun 版本和压缩级别。所有缓存有 payload SHA-256 校验、原子写入和损坏回退；超过时间上限的未完成布局不落缓存。
- CI 复用 `node_modules/.cache/friendlinks-build`；恢复旧快照后仍逐项校验输入。没有启用会让多个进程重复布局的 Astro prerender workers。

### Astro 官方缓存键与本项目落点

Astro 官方的 [incremental static builds](https://docs.astro.build/en/reference/experimental-flags/incremental-build/) 只允许跳过 `getStaticPaths()` 返回的页面，并且必须同时满足：

- 该路径返回 `cacheKey`，值随页面数据变化；
- 页面模块依赖图哈希未变化；
- Astro 配置和项目依赖未变化；
- `node_modules/.astro/`（或配置的 `cacheDir`）被保留并在 CI 中恢复。

内容集合的 [loader digest](https://docs.astro.build/en/reference/content-loader-reference/#dataentrydigest) 可作为逐条目的稳定缓存键；它不是静态端点的 `cacheKey`，也不会自动跳过未声明 `getStaticPaths()` 的路由。

本项目当前没有 Astro Content Collections，也没有动态 `getStaticPaths()` 路由：5 个产物是静态首页和 4 个固定端点，`node_modules/.astro/incremental-build.json` 的 `routes` 为空。因此 Astro 增量缓存目前不会跳过任何页面，构建速度来自下面的自定义内容摘要与产物缓存，而不是 `experimental.incrementalBuild`。

当前缓存键标准：

1. **内容集合源摘要**：对每个正式 YAML 的相对路径与实际 UTF-8 内容分别取 SHA-256，按路径稳定排序后再取一个总 SHA-256。新增、删除、重命名、同长度编辑和黑名单删除都会改变摘要。
2. **合并站点快照**：键由源摘要、解析/身份实现指纹、采样实现哈希、采样规模和快照 schema 组成。命中时直接恢复合并后的 `Site[]` 与来源计数，省去重新做别名归并和友链去重。
3. **跨端点快照键**：`snapshotArtifactKey(sites)` 对一个进程内不可变站点数组只计算一次，图和统计端点复用同一个摘要，避免重复序列化约 8 MB 站点对象。
4. **图和统计产物**：键包含站点快照摘要、实现源码/native 指纹；统计额外包含原始记录计数。
5. **布局与压缩**：布局键只包含拓扑、初始状态、力参数和实现/native 指纹；Zstd 键只包含输入内容哈希、级别和 Bun 版本。
6. 所有缓存 payload 都有 SHA-256 校验、原子写入和损坏回退；时间上限截断的布局不得落缓存。

未来增加逐站点动态页时，`getStaticPaths()` 的 `cacheKey` 应使用内容集合的 `entry.digest`（或等价的稳定内容摘要），禁止使用当前时间、PID、随机数或仅文件 mtime。CI 只恢复 `node_modules/.astro/` 和 `node_modules/.cache/friendlinks-build`，不要恢复整个工作区。

2026-11-14 本机验证（Bun 1.4.4 / Astro 7.4.12）：

| 场景 | 墙钟时间 | 关键命中 |
| --- | ---: | --- |
| 实现变更后的首轮构建 | 15.36 s | YAML 0 复用；图/布局 miss；Zstd hit；写入站点合并快照 |
| 相同输入再构建 | **2.51 s** | YAML 8572 复用；站点快照 hit；图/布局/统计/Zstd 全部 hit |
| 加速前相同输入构建 | 3.79 s | 有 YAML/图/布局/统计缓存，但每次重做身份合并 |

热构建端点耗时：`/all.json` 328 ms、`/graph-bezier.bin` 336 ms、`/graph-core.bin` 91 ms、`/stats.json` 24 ms。合并站点快照缓存为 3.64 MB；`all.json` SHA-256 为 `df7070bbd927fe8dfe007460aeb4dabda306bda0cee9ed39e3c99259ce88a706`，统计 SHA-256 为 `62113432dcd1d0e0f04ccd542c65da18a6d7cb94ee61e35130fe3df4894e9233`，产物校验通过。

### 元数据变化与拓扑布局缓存

布局单独以节点 ID 顺序、原始边索引字节、完整初始状态字节、力参数、最大 tick 数与 alpha 停止条件作为 key，并包含相同的实现、运行时和 native 指纹。标题、描述与图标变化仍使外层图数据缓存失效、更新输出元数据；只要拓扑及全部力输入不变，就能复用完整布局。缓存状态须为正确长度的有限 Float64Array，tick 数在范围内，且不能是时间上限截断的结果。

实际集成验证只改动一份 YAML 的站点元数据：**8,569 份记录复用、1 份重新解析**，外层 graph miss、内层 layout hit，恢复 **342 ticks** 的完整坐标耗时 **0.1 s**。全流程墙钟 **15.35 s**，峰值 RSS **1,333,828 KiB**；输出元数据更新，坐标、拓扑与精确统计保持不变。该结果是一次元数据变动构建，不能充当强制重算力导的冷构建。

验证后恢复了源 YAML，恢复内容 SHA-256 为 `550e15169d00eeda5acba9e33f52de83e1827ae91338061817ce8411bec826aa`。坐标与拓扑联合哈希为 `db38df090bb192302ccd5757e4e7ddc91271b532c224454e79a2f37fb2c4db44`，统计哈希为 `dbe44c23695d444d11e19e114218cebb495d8e371e2a8a16ecc39187e92318d4`。证据见 [校验记录](../reports/build-performance-2026-10-18/metadata-invalidation.json)、[构建日志](../reports/build-performance-2026-10-18/metadata-invalidation.log)和 [time 记录](../reports/build-performance-2026-10-18/metadata-invalidation.time.txt)。

## 可重复命令

以下完整计算命令须有用户授权后执行：

```sh
# 原生仓库各自执行一次
bun install --frozen-lockfile
bun run build
bun link

# FriendLinks
bun link --no-save @xingwangzhe/force-rs @xingwangzhe/bfs-rs
bun scripts/export-build-fixture.ts /tmp/friendlinks-fixture.json
bun run build --force          # 完全重算且不读写自定义缓存
bun run build --refresh-cache  # 完全重算并写入新缓存
bun run build                  # 校验输入并复用缓存
bun scripts/verify-build-output.ts dist /path/to/baseline-dist

# 轻量校验
bun run lint
bun test
bun run check
```

缓存目录可以直接删除；缓存读写失败不会使正确计算失败。源码、内容或 native 文件发生变化后，首次构建会执行所需重算。

## 正确性与发版边界

### 系统 Chrome 全量页面验收

实际载入正式构建的全量图，默认节能档 DPR=1、场景 6 个对象、背景缓冲 0 字节，静止后停止绘制。真实鼠标悬停、搜索聚焦、两节点路径及步进、显示和隐藏全部背景线均通过，过程中没有请求 `graph-bezier.*.bin`。显式调用兼容 API 则成功请求 20,717,188 字节曲线文件并设置 `bezierLoaded=true`，确认新字节编码与浏览器 WASM 解压兼容。

全量浏览器验收发现原来在创建场景前建立 Orama 索引；已改为首次非空搜索才建立，空搜索没有建库开销，并发首次查询共用一个 Promise。分词、插入顺序、查询结果及 12 条上限保持不变。两个并发查询 `xingwangzhe.fun` / `博客宇宙` 在约 4.79 s 后正确返回，过程中不唤醒图绘制。首次使用搜索仍承担建库成本；无后台预热。

首屏观察为修改前 14.344 s，修改后 2.491 / 4.136 s。浏览器缓存和 GC 状态没有重置，以上属于功能验收中的观察值，不能作为严格控制条件下的加载性能基准。原始记录见 [browser-verification.json](../reports/build-performance-2026-10-18/browser-verification.json)。

首轮完整产物检查通过：`all.json` 与基线逐字节一致，统计与图拓扑一致，节点坐标相对 RMS 差 `9.82e-17`，最大绝对差 `6.55e-11`。新曲线数组共 6,327,486 个顶点，检查 3,856 个分段端点在量化误差内；26 条资源引用全部存在。

Bezier 原始字节修复改变了旧端点的错误输出，因此不把旧、新曲线二进制宣称为完全相同。验证以正确曲线公式与量化精度为准。

两个 native 包现均已正式发布 **0.3.0**，保留六平台单主包分发：

| 包                      | 发布提交                                   | 成功的发布 CI                                                                      | npm                                                                  |
| ----------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `@xingwangzhe/bfs-rs`   | `9850873147698727e44aca21ce1a8ae99e192279` | [CI 39093153778](https://github.com/xingwangzhe/bfs-rs/actions/runs/39093153778)   | [0.3.0](https://www.npmjs.com/package/@xingwangzhe/bfs-rs/v/0.3.0)   |
| `@xingwangzhe/force-rs` | `dca2c89d43e3959c9df53cc011f37b845459e9a6` | [CI 39093226604](https://github.com/xingwangzhe/force-rs/actions/runs/39093226604) | [0.3.0](https://www.npmjs.com/package/@xingwangzhe/force-rs/v/0.3.0) |

发布 CI 完成六个平台构建、每个平台 Node 24 / 26 的 12 个 binding 测试矩阵行，以及 lint、PGO 比较。publish 只允许 main 的 push，通过精确版本提交标题选择 stable / next；工作流内普通修复提交不发包。

registry tarball 已确认包含六个目标的 `.node`、CommonJS loader 与声明文件，实际下载包和隔离消费也已检查。FriendLinks 当前安装的是 registry 的两个 **0.3.0**，`node_modules` 入口均不是本地符号链接；包内六份 native 文件的 SHA-256 记录见 [registry 安装记录](../reports/build-performance-2026-10-18/registry-install.json)。force 包的 tarball 完整性、各 native 文件与 CI artifact 的对应关系、provenance 及隔离真实图调用见 [发布验收记录](../reports/build-performance-2026-10-18/force-release-verification.json)。本地链接只用于迭代阶段，最终消费已经切回发出的真实版本。

### 0.3.0 各平台 PGO 选择

下表直接读取上述两个成功 CI 的 `pgo-<target>/build.json`。候选加速比为普通 release 耗时 / PGO 耗时的 holdout 工作负载几何平均值；大于 1 表示候选更快。只有加速比至少 1.03，且所有非微小工作负载均没有超过 15% 回退时，才发布 PGO 版本。

| 平台             | force PGO 候选加速比 | force 最终发布 | bfs PGO 候选加速比 | bfs 最终发布 |
| ---------------- | -------------------: | -------------- | -----------------: | ------------ |
| macOS x64        |               0.848× | 普通 release   |             1.215× | PGO          |
| macOS arm64      |               1.020× | 普通 release   |             0.824× | 普通 release |
| Windows x64 MSVC |               1.012× | 普通 release   |             1.017× | 普通 release |
| Linux GNU x64    |               1.036× | PGO            |             0.982× | 普通 release |
| Linux GNU arm64  |               0.999× | 普通 release   |             1.005× | 普通 release |
| Linux musl x64   |               1.057× | PGO            |             0.978× | 普通 release |

训练、比较和选型在每个目标自己的 runner 上完成，instrumented 版本不会发布。本机 force PGO 的收益约 1.1%，未达到门槛，因此本地算法基准保留普通 release；CI 的 Linux GNU / musl x64 达到门槛，最终 registry 文件选择 PGO。这是各自硬件和工作负载上的测量结果，不能把表中几何平均值直接当成 FriendLinks 全量图的加速比。
