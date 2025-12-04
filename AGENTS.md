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
    - name: 技术前沿
      url: https://techfrontier.example.com
```

### 注意事项

1. 所有 URL 必须以 `http://` 或 `https://` 开头
2. `name` 和 `description` 不能为空字符串
3. `friends` 必须是数组，即使为空也应写成 `friends: []`
4. 文件放置在 `links/` 目录下
5. 运行 `npm run json` 会校验所有 YAML 文件并生成 `public/all.json` 和 `public/graph.json`
6. 不符合规范的文件会在终端打印错误并被跳过

