
## 构建纪律（2026-09-23 用户明确要求，硬规则）
- 未经用户明确要求，禁止本地 `bun run build`（8600+ 文件全量 BFS，太耗时）。默认只跑 lint/validate。规则已写入 AGENTS.md 顶部。
- 另：本环境跑 build 时，Astro 清理 dist/.prerender/ 会被批量删除守卫拦截（>50 文件），即使同意 build 也要注意这个假失败。
