# AI规范

## Ts类型定义

都要写在**types**文件夹里面，然后其它ts去引用！！！



## links里文件规范

每个友链站点使用独立的 YAML 文件，文件名建议使用站点域名（如 `example.com.yml`）。

### 必需字段

- `site.name`: 站点名称（非空字符串）
- `site.description`: 站点描述（非空字符串）
- `site.url`: 站点 URL（必须是合法的 http/https 链接）
- `site.friends`: 友链数组，每项包含：
  - `name`: 友链名称（非空字符串）
  - `url`: 友链 URL（必须是合法的 http/https 链接）

### 可选字段

- `site.favicon`: 站点图标 URL（若不填，自动使用 `https://favicon.im/{hostname}`）
# AI规范

## Ts 类型定义

- 所有 TypeScript 类型都应放在 `types/` 目录下，其他代码通过引用这些类型保持一致。
- 新增约定：`Friend` 类型包含可选字段 `favicon?: string`，用于为单个友链指定图标。

请确保在修改类型后同时更新 `types/site.ts` 和 `types/graph.ts`，并在生成脚本（例如 `utils/tojson.ts`）中保持兼容。

## links 里文件规范

每个友链站点使用独立的 YAML 文件，文件名建议使用站点域名（如 `example.com.yml`）。

### 必需字段

- `site.name`: 站点名称（非空字符串）
- `site.description`: 站点描述（非空字符串）
- `site.url`: 站点 URL（必须是合法的 `http`/`https` 链接）
- `site.friends`: 友链数组，每项包含：
  - `name`: 友链名称（非空字符串）
  - `url`: 友链 URL（必须是合法的 `http`/`https` 链接）

### 可选字段

- `site.favicon`: 站点图标 URL（可选）
- `site.friends[].favicon`: 友链的图标 URL（可选，单独为该友链指定图标）

### 示例

```yaml
site:
  name: 我的博客
  description: 分享编程和技术相关的文章
  url: https://example.com
  favicon: https://example.com/favicon.png  # 可选
  friends:
    - name: 编程小站
      url: https://codehub.example.com
      favicon: https://codehub.example.com/favicon.ico  # 可选
    - name: 技术前沿
      url: https://techfrontier.example.com
```

### favicon 回退与合并策略（重要）

- 回退策略：生成脚本将按优先级选择图标：
  1. 使用 YAML 中 `site.favicon` 或 `site.friends[].favicon`（如果存在且为合法 URL）；
  2. 否则使用 `https://favicon.im/{hostname}`（hostname 为域名的小写形式）；
  3. 如果 hostname 无法解析或以上均不可用，则回退到本地占位图标 `/StreamlinePlumpColorWebFlat.svg`。

- 节点 ID 规则：图谱使用域名（hostname，小写）作为节点 `id`，因为域名天然唯一且便于合并。

- 合并优先级：当同一域名既作为 `links/` 下的“主站”存在，又作为别的主站的 `friend` 出现时，**以主站（links 下定义）的信息优先**（名称、favicon、描述等均使用主站定义），避免重复节点。

### 注意事项

1. 所有 URL 必须以 `http://` 或 `https://` 开头
2. `name` 和 `description` 不能为空字符串
3. `friends` 必须是数组，即使为空也应写成 `friends: []`
4. 文件放置在 `links/` 目录下
5. 运行 `npm run json` 会校验所有 YAML 文件并生成 `public/all.json` 和 `public/graph.json`（生成器将使用域名作为节点 id，并按上述合并与回退策略处理 favicon）
6. 不符合规范的文件会在终端打印错误并被跳过

---

