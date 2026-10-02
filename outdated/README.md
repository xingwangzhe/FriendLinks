# 已弃用的过滤与审核工具

2026-10-02：以下工具及其规则暂时过时，已弃用。此目录只保留历史实现，不作为当前可用脚本、自动审核依据或可调用技能。旧命令、相对路径和配置引用作为历史记录保留，不保证可以直接运行。重新启用前需要重新审查规则、路径和行为。

- `scripts/audit-links.ts`、对应测试及 `scripts/lib/`：准入审核、关键词和域名排除、网页信号与信誉查询。
- `scripts/frontier-rank.ts`：带域名黑名单过滤的扩网候选排序。
- `scripts/update-links.sh`：旧批量抓取、过滤和覆盖友链 YAML 工具。
- `config/audit-rules.yml`、`config/deny-hosts.txt`：上述工具的关键词规则与域名黑名单。
- `skills/friend-link-finder/`：旧友链发现技能、提取脚本和过滤规范。

`package.json` 已移除 `audit` 和 `frontier` 入口；TypeScript 检查排除此目录。历史测试以 `.test.ts.disabled` 保存，避免被 Bun 默认测试发现执行。

构建、运行时与创建图所需的 `src/utils/`、图端点和图算法保留。YAML 结构校验、`unverified` 目录隔离、开发采样、六度分析、站名更新和构建产物哈希脚本也保留。仓库当前人工准入标准仍以根目录 `AGENTS.md` 为准。
