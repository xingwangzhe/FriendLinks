# 项目协作提示（AI规范 & 文件规则）

这个项目使用 Astro + TypeScript 管线，数据以 `links/` 目录下的独立 YAML 文件维护，图谱数据由 `utils/tojson.ts` 生成到 `public/all.json` / `public/graph.json`。请在修改数据或代码时遵循下列约定。

**类型约定（TypeScript）**:
- **所有类型定义放在** `types/` 目录（例如 `types/site.ts`、`types/graph.ts`）。
- 新增约定：`Friend` 类型允许可选 `favicon?: string`（可为外部 URL 或本地路径，如 `/links/icons/xxx.png` 或 `/StreamlinePlumpColorWebFlat.svg`）。

**links 目录下的 YAML 规范**:
- 每个站点使用独立 YAML 文件，建议以域名命名（`example.com.yml`）。
- 必需字段：
  - `site.name`（非空字符串）
  - `site.description`（非空字符串）
  - `site.url`（以 `http://` 或 `https://` 开头）
  - `site.friends`（数组，即使为空也写成 `friends: []`）
  - `site.friends[].name`（非空字符串）
  - `site.friends[].url`（以 `http://` 或 `https://` 开头）
- 可选字段：
  - `site.favicon`（可为外部 URL 或本地相对路径）
  - `site.friends[].favicon`（可为外部 URL 或本地相对路径）

**示例**:
```yaml
site:
  name: 我的博客
  description: 分享编程和技术相关的文章
  url: https://example.com
  favicon: /StreamlinePlumpColorWebFlat.svg  # 可为本地文件
  friends:
    - name: 编程小站
      url: https://codehub.example.com
      favicon: /links/icons/codehub.png
    - name: 技术前沿
      url: https://techfrontier.example.com
```

**favicon 回退与合并策略（重要）**:
- 回退优先级（生成器 `utils/tojson.ts` 会按此规则处理）：
  1. 使用 YAML 中 `site.favicon` 或 `site.friends[].favicon`（如果存在且为字符串）
  2. 否则使用 `https://favicon.im/{hostname}`（hostname 为域名的小写形式）
  3. 如果以上均不可用或目标站存在证书/跨域问题，则回退到本地占位图标 `/StreamlinePlumpColorWebFlat.svg`

注意：项目已决定在前端图谱中放弃显示网站 favicon（出于隐私、跨域和稳定性考虑）。客户端渲染现在使用一个色盲友好的 12 色调色板来表示节点，`src/scripts/graph.ts` 中已移除图标加载逻辑。YAML 中仍可保留 `favicon` 字段供其它用途，但图谱渲染不会使用它们。
- 节点 ID 规则：使用域名（hostname，小写）作为 `id`，以保证唯一性与合并便利
- 合并优先级：当同一域名既作为 `links/` 下的主站，又出现在其他站的 `friends` 中，以 `links/` 下主站定义为准（名称、favicon、description 等）

**注意事项**:
1. 所有 URL 请尽量使用 `https://`；若站点证书过期或无法访问，生成器会回退为本地占位图标
2. `name` 和 `description` 不应为空
3. `friends` 必须是数组
4. 在添加/修改 YAML 后请运行 `npm run json` 校验并生成 `public/all.json` 与 `public/graph.json`
5. 不符合规范的文件会在终端打印错误并被跳过

---

**维护规则（新增）**:
- 每次对项目结构或生成逻辑（例如修改 `utils/tojson.ts`、`src/scripts/graph.ts`、类型定义或 `public/` 路径）进行更新时，必须检查并评估本文件（提示词/协作规范）是否需要同步更新；若需要，请立刻更新并提交本 `AGENTS.md`。

---

