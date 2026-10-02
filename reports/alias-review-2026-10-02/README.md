# 相似地址复核与合并结果（2026-10-02）

扫描全部 8710 份正式 YAML 的主入口、别名及 130499 条原始友链引用，发现 49413 个 host、60637 个不同入口 URL。未扫描 unverified；两个含用户信息的原有 URL 没有写入公开证据文件。

候选：613 组至少一侧有正式记录的 www 变体（其中 91 组两侧均有正式记录）、920 组仅作为外部友链目标的 www 变体、246 组同名跨域候选、88 组同域名主体不同后缀候选。类别可能重叠，名称和域名相似度本身不是合并证据。

本轮优先挑选 141 组候选，以 crwl 抓取 288 个不同入口；另外检查 AcoFork 博客索引和原创文章、Dracoum 关于页、Frytea 博客子域等。本轮不声称已复核全部相似候选。共确认 102 项入口关系（部分重叠），最终修改 97 个站点组，整理 108 个 aliases，删除 88 份重复记录。其余保留原数据并记录待复核原因，不重新启用旧审核脚本。Dracoum 关于页描述了多个子服务，未据共同品牌推断同义；blog.frytea.com 本轮抓取失败，未补为别名。

| 项目 | 本轮合并前 | 合并后 | 变化 |
| --- | ---: | ---: | ---: |
| 正式 YAML | 8710 | 8622 | -88 |
| 逻辑站点 | 8677 | 8589 | -88 |
| 图节点（含外部目标） | 49428 | 49322 | -106 |
| 去重图边（互指计一条） | 109539 | 108348 | -1191 |
| 自环 | 0 | 0 | 0 |

关系保留：将本轮修改前每条引用的源、目标按最终身份解析，排除内部自引用并去重后应有 119152 条有向关系；实际为 119152 条。缺失 0 条、额外 0 条。减少的关系是重复关系与合并产生的内部自引用，不表示重新审查过每条历史友链的有效性。

代表性合并：

- 虹墨空间站：imaegoo.com → www.imaegoo.com，301 跳转及相同文章索引。
- 子夜松声：www.xyzbz.cn → xyzbz.cn，共同 canonical 与文章内容。
- 路明笔记：i.riseforever.cn、riseforever.cn、www.riseforever.cn、luming.cool → www.luming.cool。
- Fomal：fomal.cc、netlify.fomal.cc、www.fomal.cn → www.fomal.cc。
- MBRjun：blog.mbrjun.cn、mbrjun.cn → www.libmbr.com。
- AcoFork：2x.nz、www.2x.nz、www.afo.im → www.acofork.com；另检查公开博客索引及“迁移Linux到新硬盘”正文。
- Haofei Ma：mahaofei.com、www.mahaofei.com → haofei.ma/zh/blog/，保留栏目入口身份。
- Log4D：只合并中文旧地址 blog.log4d.com → blog.alswl.com，保留 en.blog.alswl.com。

新规范地址的友链路由依据实际导航同步更新：AcoFork /links/、Haofei Ma /zh/links/、Qubik /friends、Makito /links/index.html。迁往新规范地址的 AcoFork、Haofei Ma 名称同步为当前站名；其余主记录元数据、颜色及友链并集保留；合并来源说明写入 YAML 注释。

未合并的典型情况：ygz.ink 为个人博客，而 www.ygz.ink 为聚合服务；轻淡时光的 blog.lybblog.cn 与主站是不同发布入口；机器人验证页或抓取失败不作为相同站点证据；博客录品牌的域名展示页不直接并入 boke.lu 目录。仅存在外部友链目标的候选也没有创建新的正式站点记录。

临时扫描和合并脚本已从 scripts 中删除。证据及决定保存在本目录；清单见 inventory.md，逐项决定见 decisions.md/decisions.json，逐组文件及计数见 merge-results.json。

验证：bun run lint、Bun 全部 15 项测试、bun run validate、git diff --check 通过。97 个修改后的 YAML 已单独通过 oxfmt；格式化前后解析结果完全相同。纯拓扑检查没有运行布局或全量 BFS；没有执行 build、git commit 或 git push。其他工作区修改保留。
