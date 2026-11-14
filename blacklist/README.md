# 黑名单

每个 `N.json` 是一个黑名单条目，`N` 从 1 开始递增，按数值升序表示加入顺序。文件名必须是 `1.json`、`2.json` 这类纯数字序号；禁止 `01.json`。文件只保存域名哈希，不保存明文域名。

```json
{
  "domainLength": 16,
  "hash": "64 位小写 SHA-256 十六进制",
  "reason": "排除原因"
}
```

- 哈希输入：URL 去掉协议、路径、查询参数、端口和片段后的小写 hostname。
- 哈希算法：SHA-256，输出 64 位十六进制。
- `domainLength`：规范化域名的字符串长度。
- `reason`：人工排除原因，不要重复填写域名或完整 URL；含 URL、域名样式文本或 IPv4 明文会被拒绝。
- 同一 hash 不允许出现在多个文件中。
- 推荐用 `bun run blacklist add <URL或域名> <排除原因>` 添加，避免序号或哈希写错。
- 可用 `bun run blacklist check <URL或域名>` 查询，`bun run blacklist list` 查看全部条目。
- 构建前的 `astro:build:start` 会检查主站、`aliases` 和全部友链；命中主站删除对应 YAML，命中友链直接移除。
- JSON 不保存域名明文；`astro.log` 必须写明是删除主站，还是从哪个来源主站抹去哪条友链。
- 主站日志示例：`[links/main.yml] main.example.com 命中黑名单hash [64位hash] 原因 [排除原因]（黑名单条目 [1.json]）；域名属于主站，已删除主站 YAML`。
- 友链日志示例：`[links/friends.yml] friend.example.com 命中黑名单hash [64位hash] 原因 [排除原因]（黑名单条目 [2.json]）；域名属于友链 [FriendName]，来源主站 [SiteName] (site.example.com)，已从 YAML 中抹去`。
