# AGENTS - 友链管理指南

> **⚠️ 关键规则：未经明确授权，禁止执行 `git push` 或任何推送操作！**
> 所有本地修改必须先经用户确认，再由用户决定是否推送。
> 任何时候需要推送，必须 ask 用户是否要 git push。

> **🚫🚫 最高优先级硬规则：未经用户明确允许，绝对禁止在本地执行 `bun run build`！**
> 本项目构建涉及 8400+ 友链文件与全量 BFS 图计算，动辄 1 分钟以上，**太浪费时间**。
> 无论任何场景（升级依赖、改代码、排查问题）都不得擅自 build；默认只跑 `bun run lint` / `bun run validate` 等轻量校验。
> 确实需要 build 验证时，必须先问用户、得到明确同意后才能执行。违反此规则视为严重失误。

## 📁 目录结构

```
links/                       # 个人文字博客 YAML 源文件（核心数据，8400+ 文件）
└── unverified/             # 待验证候选（不进入正式图数据）
blacklist/                   # 域名 SHA-256 黑名单，按 1.json、2.json…排序
docs/
├── INTERACTIONS.md          # 3D 图交互系统（API/事件/面板）
├── LABELS.md                # 3D 节点标签系统
└── superpowers/
    ├── plans/
    └── specs/
scripts/
├── blacklist.ts             # 添加、查询、列出域名哈希黑名单
├── six-degrees.ts           # 六度分隔计算
├── update-site-names.ts     # 批量更新站点名称
└── validate-links.ts        # 友链数据校验
src/
├── integrations/
│   └── blacklist.ts         # astro:build:start 黑名单钩子
├── utils/
│   └── blacklist.ts         # 域名规范化、哈希、加载与强制执行
└── ...                      # Astro + Three.js 项目源码
```

**核心文件**: `links/**/*.yml` - 每个文件代表一个站点的友链配置，支持嵌套子目录整理（如 `links/tech/`、`links/life/`）。保留目录 `links/unverified/` 仅存放待验证候选，默认构建、数据端点和图分析都必须跳过该目录。

---

## 📝 YML 格式规范

### 完整示例

```yaml
site:
  name: 我的博客                      # 必填：站点名称
  description: 分享编程和技术相关文章  # 必填：站点描述
  url: https://example.com            # 必填：站点 URL（也是文件名）
  color: "#ff6600"                    # 可选：自定义节点颜色（6位16进制）
  links: /links                       # 可选：友链页面路由（默认 /links）
  friends:                            # 必填：友链数组
    - name: 编程小站                   # 友链名称
      url: https://codehub.example.com # 友链 URL
      description: 技术分享            # 可选：友链描述
      avatar: https://example.com/avatar.png # 可选：头像 URL
    - name: 技术前沿
      url: https://techfrontier.example.com
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `site.name` | string | ✅ | 站点名称（显示在节点上） |
| `site.description` | string | ✅ | 站点描述（鼠标悬停显示） |
| `site.url` | string | ✅ | 站点 URL（也是文件名） |
| `site.aliases` | string[] | ❌ | 已确认的同义入口，详见 docs/SITE-IDENTITY.md |
| `site.color` | string | ❌ | 节点颜色，格式 `#RRGGBB` |
| `site.links` | string | ❌ | 友链页面路由，默认 `/links` |
| `site.friends[]` | array | ✅ | 友链数组 |
| `site.friends[].name` | string | ✅ | 友链名称 |
| `site.friends[].url` | string | ✅ | 友链 URL |
| `site.friends[].description` | string | ❌ | 友链描述 |
| `site.friends[].avatar` | string | ❌ | 友链头像 URL |

---

## 🚀 快速操作指南

### 添加新站点

```bash
# 1. 创建 yml 文件（文件名 = URL 中的域名）
#    也可以放到分类子目录中，如 links/tech/example.com.yml
touch links/example.com.yml

# 2. 填写配置
vim links/example.com.yml
```

### 编辑现有站点

```bash
# 直接编辑 yml 文件
vim links/example.com.yml

# 格式化检查
bun run fmt links/example.com.yml

# 提交更改
git add links/example.com.yml
git commit -m "feat: 更新 example.com 友链"
```

### 删除站点

```bash
# 删除 yml 文件
rm links/example.com.yml

# 提交更改
git add links/
git commit -m "refactor: 移除 example.com 友链"
```

### 查看所有站点

```bash
# 列出所有正式 yml 文件（含嵌套子目录，排除待验证候选）
find links -type f \( -name "*.yml" -o -name "*.yaml" \) -not -path "links/unverified/*" | wc -l

# 查看特定站点
cat links/example.com.yml

# 搜索包含特定关键词的站点（含嵌套子目录）
grep -rl "关键词" links/
```

---

## 📋 “博客宇宙”准入标准

本项目定位为个人文章博客的友链宇宙，只接受一种正式站点类型：

- `blog`：个人、笔名作者或小型非机构创作团队运营，以文字文章为核心，并真实提供原创发布内容的博客型站点。

站点只有在证据足以确认其满足下述定义时才进入正式图数据。页面上出现 `blog`、RSS、`<article>`、发布日期、评论区或某种博客框架，只能作为调查线索，不能单独证明它是博客。反过来，缺少 RSS、评论、自定义域名、固定更新频率或特定框架，也不能单独成为排除理由。

### `blog`：博客型站点

博客型站点必须同时满足以下条件：

1. **运营主体符合范围**：由个人、笔名作者或小型非机构创作团队负责。公司、政府、学校、产品品牌和大型媒体不作为 `blog` 收录。
2. **文字文章是主要内容**：能够发现博客、文章、日志、随笔、笔记、Writing、Posts、Archive 或含义相同的入口或索引；站点可以混合摄影、视频、播客、项目等内容，但不能只有媒体流、作品展示或个人简介。
3. **至少一篇合格原创内容**：一篇即可照顾刚建立的新博客，但必须足以验证真实的原创发布行为。
4. **内容公开且具有永久链接**：合格内容须有实质正文，并拥有独立、稳定、可直接访问的 URL。主页中的内容区块或页内锚点不算独立博文；完全登录可见或完全付费墙的站点只能进入 `unverified`。
5. **发布内容是一等功能**：博客必须是站点的主要用途，不能只是作品集、产品页、聚合目录或简历中偶然出现的一段文字。

以下内容本身**不计为合格博文**：

- About、个人简介、在线简历、联系方式、免责声明、隐私政策；
- 项目卡片、作品缩略图和没有文章结构的普通案例展示；
- README、API 文档、软件手册、知识库条目和 FAQ；
- 产品更新日志、版本发布记录、营销新闻稿和 SEO 获客文章；
- 裸链接收藏、没有作者评论或创作语境的书签；
- 自动转载、社交动态镜像、全文采集或冒充原创的内容；
- “Hello World”、主题演示文、模板示例和其他占位内容。

#### 博客型站点的边界规则

- **单页与 SPA**：纯个人主页、link-in-bio、在线简历及只有一个文档的单页站点直接排除。“单页应用（SPA）”是技术实现，不等于“单页个人主页”；SPA 只要具有独立文章路由、文章索引和永久链接，仍可成为博客。
- **作品集**：纯作品集不收录。只有 `/blog`、`/posts`、`/notes` 等独立栏目自身满足全部博客条件时，才将该站按 `blog` 收录。
- **纯媒体站**：纯照片/图库、纯视频、纯播客、纯漫画展示和无文字正文的媒体流直接排除。
- **媒体混合**：摄影、漫画、播客、视频、Newsletter、微博客、数字花园和 Linklog 可以作为文字博客的次要内容；但至少一个原创条目必须有独立永久链接、公开索引和实质文字正文。裸图库、平台跳转页和无完整条目的碎片资料库排除。
- **多人站点**：小型多人编辑出版物可以按 `blog` 收录；开放发帖论坛、问答站、Wiki 和社交社区排除。
- **停更站点**：停更时间不是排除条件；只要历史原创档案仍公开可读并满足上述条件，就可以收录。
- **托管平台**：托管在 GitHub Pages、WordPress.com 等平台上的个人博客按内容判断，可以准入；托管平台首页、账号资料页和社交主页不能准入。
- **商业化边界**：广告、赞助、打赏和非强制会员本身不构成商业站。若站点的主要目的变为销售、获客、SEO、产品宣传或机构传播，则排除。
- **聚合与导航**：博客聚合、博客导航、博客目录、博客列表、RSS 内容聚合、Webring、友链交换平台和成员名录全部排除，因为其发现功能与本站重复。即使站点同时发布原创文章，只要聚合或导航是主要功能，也不得作为 `blog` 收录。
- **普通友链页**：个人博客自己的友链页不是博客聚合站，无论其中有多少链接，都不影响该博客本身的收录资格。

### 明确排除的站点

下列站点在证据明确时直接 `exclude`，不能用空的 `friends: []` 占位：

- 没有合格博文的个人主页、单页主页、link-in-bio、在线简历和纯作品集；
- 纯照片、纯图库、纯视频、纯播客及其他没有实质文字文章正文的媒体站；
- 论坛、问答、Wiki、开放社区、社交媒体主页和聊天服务；
- 博客框架、主题、插件、工具、托管平台、域名服务商、CDN、图床和短链服务；
- 商业网站、产品页、公司或机构官网，以及以销售、获客、SEO 或宣传为主要目的的站点；
- 博客聚合、博客导航、博客目录、RSS 内容聚合、Webring、通用导航、搜索引擎、RSS 阅读器产品和付费排名目录；
- 无明确来源、冒充原创、全文采集或劫持原站访问的采集站。

### 三态审核流程

审核结果只使用以下三种落库状态：

1. `include`：证据足够，确认是个人文章博客，写入普通 `links/` 分类目录。
2. `unverified`：抓取失败、作者归属不明、原创性不明、文字内容占比不明、完全登录或付费可见，或者暂时无法确认是否为个人文章博客。候选写入 `links/unverified/`，不会进入正式图数据。
3. `exclude`：已确认属于单页主页、纯作品集、论坛、通用导航、产品、公司、平台、采集站等硬排除类型。不创建正式节点，也不为明确不合格的站点创建待验证占位文件。

固定审核顺序如下：

1. 验证 URL 安全性、公开可访问性和规范域名；跳转后应记录最终规范 URL。
2. 检查是否属于博客聚合、导航、目录、Webring 或内容平台；明确属于时直接排除。
3. 检查是否存在文字博客发布入口及至少一篇有实质正文的合格原创内容。
4. 检查运营主体与主要目的，确认文字文章是主要用途且没有触发硬排除规则。
5. 证据充足才写入正式目录；证据不足写入 `links/unverified/`；明确不符则排除。

审核原因使用下列统一原因码。原因码描述发现的事实或疑点；最终状态仍须结合证据判断：

| 原因码 | 含义 |
|--------|------|
| `homepage-only` | 只有个人介绍或主页内容，没有独立发布栏目 |
| `single-page-only` | 所有内容只有一个页面或页内锚点，没有独立条目 URL |
| `portfolio-only` | 只有作品或项目展示，没有合格博文 |
| `no-qualifying-post` | 没有找到满足定义的原创内容 |
| `no-post-index` | 没有可发现、可公开检查的文章入口或索引 |
| `non-original-content` | 主要内容是转载、镜像或自动生成，原创性不足 |
| `template-demo` | 只有模板、演示文或占位内容 |
| `knowledge-base-only` | 仅为文档、手册、FAQ 或知识库 |
| `generic-directory` | 通用网址导航或目录，不聚焦独立博客 |
| `forum-primary` | 论坛、问答、聊天或开放社区是核心功能 |
| `social-profile` | 社交平台资料页或平台跳转页 |
| `tool-or-product-primary` | 工具、产品、服务、销售或宣传是核心功能 |
| `framework-or-theme` | 博客框架、主题、插件或相关展示站 |
| `corporate-or-institutional` | 公司、政府、学校、机构或大型媒体站点 |
| `content-scraper` | 无来源采集、全文镜像、冒充原创或劫持访问 |
| `blog-aggregator-duplicate` | 博客聚合、导航、目录或 Webring 与本站定位重复 |
| `media-only` | 只有照片、视频、播客等媒体内容，缺少实质文字文章 |
| `unverifiable` | 访问失败、证据不足或暂时无法可靠判断 |

### 待验证候选目录

`links/unverified/` 是保留目录，详细约定见 `links/unverified/README.md`：

- 候选使用与正式站点完全相同的 YAML Schema 和域名文件名；不要增加 `review`、`type` 等 Schema 外字段。
- 审核状态、原因码、证据 URL 和检查日期写在 YAML 顶部注释中。
- 默认构建、`/all.json`、统计、图二进制端点、`validate`、`six` 和站点名称更新都必须跳过该目录。
- 显式运行 `bun run validate links/unverified` 可以只校验候选结构。
- 验证通过后，将文件移动到普通正式分类；明确不合格后删除候选或移交审核报告。
- 已确认合格的博客即使没有公开友链页，也可以使用 `friends: []`；空数组不能让非博客获得正式节点。
- 格式化工具可以处理该目录；格式化不会改变候选状态，也不会令其进入图数据。

---

## 🚫 域名哈希黑名单

`blacklist/` 是独立于博客准入审核的硬排除层。黑名单只保存规范化域名的 SHA-256，不保存域名明文。主站和友链都按完整 hostname 精确匹配；`www.example.com`、`blog.example.com`、`example.com` 是三个不同域名。

### 常见硬排除类别

- 商业、产品或服务：官网、云服务、CDN、在线工具、软件发布页、课程销售、付费资源、建站获客、SEO 服务及作品集获客页。
- 搜索引擎：Google、Bing、百度、Yandex、DuckDuckGo、Yahoo Search、搜狗、360、神马、Naver、Daum 等搜索入口。
- 社交媒体：Facebook、Instagram、X、LinkedIn、Reddit、微博、豆瓣、知乎、Bilibili、小红书、Mastodon、Threads、Telegram、Discord、YouTube、微信及 QQ 社交入口等。
- 社区、平台与内容站：论坛、问答、开放社区、个人社区、网址导航、网站收录、书签收藏夹、文档站、知识库、百科、RSS/资源聚合、内容农场、模板演示、纯作品集和个人主页。
- 博客聚合、博客导航、博客目录、博客列表、RSS 内容聚合、Webring、友链交换平台和成员名录，因其发现功能与本站重复，统一入黑。
- 只按已确认的完整 hostname 入黑；不得据根域字符串批量误伤内容站。`developers.google.com`、`engineering.fb.com` 等是内容页，不是搜索或社交主页。
- `github.io`、`gitlab.io`、`gitee.io`、`codeberg.page`、`substack.com` 等是托管平台，不因平台域名本身入黑；平台上的个人博客仍按博客准入标准判断。

### 目录与 JSON 格式

```text
blacklist/
├── README.md
├── 1.json
├── 2.json
└── 3.json
```

- 文件名必须是从 `1` 开始的纯数字序号加 `.json`；禁止 `01.json`、零、负数、小数和非数字名称。
- 文件按数值升序表示加入顺序，`1.json` 是第一条。新增时使用当前最大序号加一。
- 读取时严格校验 JSON、`domainLength`、64 位小写或大写十六进制 SHA-256、非空 `reason`。
- 同一 hash 在多个文件中重复时直接报错，构建失败。
- `reason` 只写原因码或简短原因，不要回填域名明文、协议或完整 URL；加载和添加时都会拒绝 URL、域名样式文本及 IPv4 明文。

```json
{
  "domainLength": 16,
  "hash": "bd0054cb250b2bb60508c69cc475c5015b1627de407ce0ea50acaa9a00a16c94",
  "reason": "示例排除原因"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `domainLength` | number | 规范化 hostname 的字符长度 |
| `hash` | string | `SHA-256(normalizedHostname)`，64 位十六进制 |
| `reason` | string | 人工排除原因；不得包含 URL、域名或 IP 明文 |

### 域名规范化与哈希

唯一哈希输入是去掉协议、用户信息、端口、路径、查询参数、片段和末尾根点后的小写 hostname。

```text
https://Blog.Example.com:8443/path?q=1#part
→ blog.example.com
→ SHA-256("blog.example.com")
```

- 可以传完整 HTTP(S) URL、带路径的域名或裸域名；裸值先按 `https://` 解析。
- 非 HTTP(S) 协议报错。
- 不在哈希输入中包含协议、端口、路径、查询参数、片段、末尾 `.` 或大小写差异。
- 不要把哈希当作加密或秘密；它只是避免仓库直接出现域名明文。
- 需要添加时优先使用 CLI，禁止手算 hash 后随意创建文件。

```bash
bun run blacklist add "https://blog.example.com/path" "内容农场，非原创"
bun run blacklist check blog.example.com
bun run blacklist list
```

`add` 自动完成规范化、SHA-256、去重、顺序编号和 JSON 写入。`check` 只查询是否命中。`list` 输出序号、文件名、长度、hash 和原因，不反推域名。

### 构建前自动排除

`astro.config.mjs` 注册 `blacklistGuard()`。构建触发 `astro:build:start` 时，`enforceBlacklist()` 会在 Astro 读取正式图数据前递归扫描 `links/**/*.yml` 和 `links/**/*.yaml`，包括 `links/unverified/`。

命中日志必须同时说明命中对象、排除动作和友链来源。格式示例：

```text
[links/main.yml] main.example.com 命中黑名单hash [64位hash] 原因 [排除原因]（黑名单条目 [1.json]）；域名属于主站，已删除主站 YAML
[links/friends.yml] friend.example.com 命中黑名单hash [64位hash] 原因 [排除原因]（黑名单条目 [2.json]）；域名属于友链 [FriendName]，来源主站 [SiteName] (site.example.com)，已从 YAML 中抹去
```

- 主站命中：检查 `site.url` 与 `site.aliases[]`；任一命中则输出日志并删除整个 YAML。
- 友链命中：检查 `site.friends[].url`；日志必须写明友链名称、来源主站名称和域名，命中项从数组中移除，其他友链、字段、顺序和 YAML 注释保留，然后写回文件。
- 一个 YAML 可同时移除多个友链；重复构建应保持幂等，已删除的主站或友链不会再次出现。
- 黑名单目录缺失、JSON 损坏、字段非法、编号非法或 hash 重复时构建直接失败，不静默跳过。
- 该钩子只在构建生命周期执行，不修改开发服务器中的源文件。未经明确授权仍禁止运行 `bun run build`；用单元测试验证钩子逻辑。
- JSON 与 git 中不得出现黑名单域名明文；`astro.log` 构建日志按上述格式输出域名、hash、原因和排除动作，便于定位主站或来源友链。

### 自动与手动排除流程

1. 审核确认站点必须硬排除后，先运行 `bun run blacklist add <URL或域名> "<原因>"`。
2. 运行 `bun run blacklist check <URL或域名>` 确认命中。
3. 提交 `blacklist/N.json` 和本次代码改动；下次获授权构建会自动删除主站 YAML 或抹去所有 YAML 中的该友链。
4. 若只是普通准入审核的 `exclude`，按三态审核流程不创建节点即可；若历史数据中已有该站点，必须加入黑名单，避免只在单个文件中手工删除后再次回流。
5. 需要解除黑名单时，删除对应数字 JSON，并从 git 恢复此前被自动删除的 YAML 或友链；不要复用旧序号。

禁止用黑名单代替博客准入证据。黑名单是已知硬排除域的传播阻断层；`include`、`unverified`、`exclude` 的判定仍以人工审核证据为准。

---

## 🎨 自定义节点颜色

在 `site` 层级添加 `color` 字段：

```yaml
site:
  name: 我的博客
  description: 分享编程相关文章
  url: https://example.com
  color: "#ff6600"  # 完整 6 位 16 进制色
```

**不指定**：从默认 24 色调色板按域名哈希分配

**常用色值**：
- `#ff6600` - 橙色
- `#00ccff` - 蓝色
- `#33cc33` - 绿色
- `#ff3366` - 粉红
- `#cc33ff` - 紫色
- `#ffcc00` - 黄色

---

## 🔧 开发规范

### 包管理器

**本项目强制使用 Bun**

Astro 的 `dev`、`build`、`preview` 脚本使用 `bunx --bun astro@latest`，强制以 Bun 运行；`@latest` 可能高于锁文件版本。CI 使用最新版 Bun，不再单独安装 Node.js。`@types/bun` 已作为开发依赖安装，`@types/node` 保留用于兼容 API。

2026-10-02 更新记录：Astro 7.3.5、Three.js 0.186.1、oxlint 1.86.0、oxfmt 0.71.0、`@types/node` 26.6.4、`@types/bun` 1.4.2。`@xingwangzhe/bfs-rs` 和 `@xingwangzhe/force-rs` 均为 0.2.2。实际版本以 `package.json` 与 `bun.lock` 为准。

```bash
bun install          # 安装依赖
bun run <script>     # 运行脚本
bun run lint         # 代码检查
bun run fmt          # 代码格式化
```

**禁止**：npm、yarn、pnpm

### dev 数据数量

在 `astro.config.mjs` 顶部配置 `DEV_SAMPLE_SIZE`，默认 100；启动环境变量同名覆盖（如 `DEV_SAMPLE_SIZE=500 bun run dev`）。0 表示全量，仅接受非负安全整数，修改后重启。它限制正式站点抽样数，友链目标可能增加实际星球数；生产构建仍为全量。详见 `docs/DEV.md`。

### 构建缓存键

- Astro 官方 `cacheKey` 只对 `getStaticPaths()` 返回的页面生效；当前 5 个产物均为静态首页或固定端点，`node_modules/.astro/incremental-build.json` 的 `routes` 为空，不能把热构建速度归因于 Astro 增量缓存。
- 本项目已因性能移除 Astro Content Collections。不要直接加回 `glob()`/自定义 loader；若确需恢复，必须先证明内容集合的数据存储、digest 与类型生成成本低于当前 `links/**/*.yml` 自定义集合缓存。
- 当前内容集合键由相对路径 + 原始 UTF-8 内容的逐文件 SHA-256、稳定路径排序、解析/身份实现指纹、采样实现哈希和采样规模组成；合并后的 `Site[]` 与来源计数存入 `sites` 快照缓存。
- 图和统计键复用 `snapshotArtifactKey(sites)`，布局键只含拓扑、初始状态、力参数和实现/native 指纹，Zstd 键只含输入哈希、级别和 Bun 版本。
- 缓存键禁止使用当前时间、PID、随机数、仅文件 mtime 或与输出无关的绝对路径。修改关键实现或 native 文件后允许重建缓存，但必须校验产物。
- 详细规则和实测数据见 `docs/BUILD-PERFORMANCE.md` 的“Astro 官方缓存键与本项目落点”。

### 代码风格

```bash
bun run lint         # oxlint + tsc 类型检查
bun run fmt          # oxfmt 格式化
bun run lint && bun run fmt  # 提交前检查
```

过滤、准入审核和扩网筛选工具已移至 `outdated/`，暂时过时并已弃用；不作为当前可用命令或技能。详见 `outdated/README.md`。人工准入标准仍保留。

### 可用脚本

| 命令 | 用途 |
|------|------|
| `bun run dev` | 通过 Bun 启动最新 Astro 开发服务器 |
| `bun run preview` | 通过 Bun 预览已有构建产物 |
| `bun run build` | 构建生产版本 ⚠️ **未经用户明确允许禁止执行**（见顶部硬规则） |
| `bun run validate` | 校验 `scripts/validate-links.ts` — 检查 YAML 格式和必填字段 |
| `bun run six` | 运行 `scripts/six-degrees.ts` — 六度分隔分析 |
| `bun run blacklist add/check/list` | 添加、查询或列出域名 SHA-256 黑名单 |
| `bun run lint` | oxlint 代码检查 + TypeScript 类型检查 |
| `bun run fmt` | oxfmt 格式化 `src/` 和 `links/` |
| `bun run fmt-check` | 只检查格式，不写入文件 |
| `bun run test` | 运行 Bun 测试 |

---

## 📊 数据端点

| 端点 | 格式 | 用途 |
|------|------|------|
| `/graph-core.bin` | msgpack+zstd 二进制 | 核心图数据（客户端优先加载） |
| `/graph-bezier.bin` | msgpack+zstd 二进制 | 贝塞尔曲线数据（异步加载） |
| `/all.json` | JSON | 完整站点数据（外部使用） |

---

## 🛠️ 实用工具

### 爬虫工具（crawl4ai / crwl）

**首选工具**：使用 `crawl4ai` 的 CLI 工具 `crwl` 抓取网页数据。

```bash
# 基本爬取 + markdown 输出
crwl <url> -o markdown

# BFS 深度爬取（限制页数）
crwl <url> --deep-crawl bfs --max-pages 10

# LLM 提取特定信息
crwl <url> -q "提取内容"

# 指定输出文件
crwl <url> -o markdown > output.md
```

### 统计信息

```bash
# 统计正式站点数量（含嵌套子目录，排除待验证候选）
find links -type f \( -name "*.yml" -o -name "*.yaml" \) -not -path "links/unverified/*" | wc -l

# 统计正式站点的友链总数
find links -type f \( -name "*.yml" -o -name "*.yaml" \) -not -path "links/unverified/*" -print0 | xargs -0 grep -h "^    - name:" | wc -l

# 统计每个正式站点的友链数
find links -type f \( -name "*.yml" -o -name "*.yaml" \) -not -path "links/unverified/*" | sort | while read -r f; do
  echo "$(basename "$f"): $(grep -c "^    - name:" "$f") 友链"
done
```

### 格式化

```bash
# 格式化所有 YAML
bun run fmt

# 仅格式化某个文件
bun run fmt links/example.com.yml
```

### 校验

```bash
# 校验所有 YAML 格式和必填字段
bun run validate
```

---

## 📖 常见问题

### Q: 文件名和 URL 不一致怎么办？

**A**: 确保文件名与 URL 中的域名一致。例如：
- URL: `https://example.com` → 文件名: `example.com.yml`
- URL: `https://blog.example.com` → 文件名: `blog.example.com.yml`

### Q: 如何确认友链是否符合标准？

**A**: 不凭站名、框架或 RSS 猜测，按“URL 与安全性 → 是否属于聚合、导航或纯媒体 → 文字博客入口与至少一篇合格原创内容 → 运营主体与主要目的”的顺序核实。证据足够才 `include`；无法访问或证据不足时写入 `links/unverified/`；确认是单页主页、纯作品集、纯照片、论坛、通用导航、博客聚合、产品、机构或采集站时 `exclude`。完整定义见“博客宇宙”准入标准。

### Q: 个人主页或作品集可以收录吗？

**A**: 仅有个人介绍、简历、项目卡片或作品展示的不收录。若站点存在清晰独立的博客栏目，并且至少一篇原创内容拥有公开索引、实质正文和独立永久链接，则可以作为 `blog` 收录。SPA 是实现方式，不是排除理由；是否存在独立文章路由才是关键。

### Q: 博客聚合站是否可以收录？

**A**: 不收录。博客聚合、导航、目录、列表、RSS 聚合和 Webring 的发现功能与本站重复，即使同时发布原创文章，只要聚合是主要用途也排除。个人博客自己的普通友链页不属于聚合站，不影响博客本身收录。

### Q: 访问失败或无法确认原创性怎么办？

**A**: 不要猜测，也不要直接混入正式图数据。按 `links/unverified/README.md` 的注释模板保存候选和证据，使用 `unverifiable` 或更具体的原因码，待复核后再晋升或排除。

### Q: 友链被移除后如何恢复？

**A**:
```bash
# 检查 git 历史
git log --oneline --all -- links/example.com.yml

# 恢复特定版本
git checkout <commit-hash> -- links/example.com.yml
```

---

## 📝 提交规范

```bash
# 添加新友链
git add links/example.com.yml
git commit -m "feat: 添加 example.com 友链 (X个友链)"

# 更新现有友链
git add links/example.com.yml
git commit -m "fix: 更新 example.com 友链描述"

# 移除友链
git add links/
git commit -m "refactor: 移除 example.com 友链"

# 修改格式
git add links/
git commit -m "style: 格式化 example.com.yml"
```

**注意**：参见顶部规则——未经明确授权，禁止 git push：
```bash
git push origin main
```

---

## 🔍 文档索引

| 文件 | 内容 |
|------|------|
| `AGENTS.md` | **本文** — 友链管理操作指南 |
| `README.md` | 项目总览、3D 渲染特性、本地开发 |
| `docs/DEV.md` | dev 采样配置与全量模式 |
| `docs/SITE-IDENTITY.md` | 相似站点筛选、别名证据、重复 YAML 合并及统一图口径 |
| `docs/INTERACTIONS.md` | 3D 图交互系统 API、事件、面板 |
| `docs/LABELS.md` | 3D 节点标签系统实现 |


### 前端组件约定

界面统一使用 Tailwind CSS v4 与 daisyUI 免费组件。按钮、输入框、滑块、开关、加载状态和统计卡片均采用原生 HTML，可叠加 Tailwind 工具类。

统计、关于、控制、邻居和路径查找使用原生 `<dialog>` 非模态面板，不依赖第三方窗口库。控制、邻居靠右，统计/关于为宽面板，路径查找为底部 dock；移动端统一为底部 sheet。关闭按钮或 Escape 关闭并返回入口焦点，内容在面板内部滚动，背景宇宙仍可交互。

飞船模式只使用底部 HUD：半透明淡文字、`pointer-events: none`、不获取焦点；`X` 使用高亮提示退出。

开发验证使用 `bun run dev` 的抽样数据，运行 `bun run lint`、`bun test`、`bun run verify:controls` 与改动文件格式检查；浏览器验收覆盖面板开关、鼠标只转向、WASD/RF 位移、Shift 加速、Q/E 横滚、X 退出、速度滑块和静止停绘。开发模式会清理本项目旧 Service Worker 缓存，避免加载过期控件代码。不得以生产构建替代 dev 检查。

界面固定使用 daisyUI 暗色主题，与宇宙背景一致，不提供亮色模式或主题切换入口；系统浅色偏好及历史 `colorTheme` 本地设置均不影响页面。

### 相似站点、同义地址与重复 YAML

`site.url` 为规范入口，`site.aliases: string[]` 只记录有证据确认的旧地址与镜像。相似站名、域名、同作者或品牌仅作调查线索；优先用 `crwl` 检查真实跳转、canonical、文章内容及发布入口。验证页、停放页、抓取失败不能作为同义证据；独立栏目、语言站及子服务保留独立身份。身份合并不替代博客准入判断。

已经指向同一规范入口的重复 YAML 可以直接实体合并，不需要再根据文件名推断域名关系。按稳定路径顺序保留主记录，补齐缺失的可选字段，合并 aliases 与友链并集，保存来源注释、原元数据和证据后删除重复文件。不能因为某文件友链较少而丢弃它的独有关系；同域多个栏目不能因文件名冲突强行合并。

先建立完整身份映射再采样；图、统计、六度与 `/all.json` 共享逻辑集合。格式错误、别名冲突和迁移环使 `bun run validate` 非零退出。实体合并后检查逻辑记录和纯拓扑不变；新增别名则按最终身份检查关系保留。报告原始文件、逻辑站点与拓扑数量的区别，不把删文件直接等同于构建加速。

临时脚本完成后清理，复核清单和证据保留为报告。不重新启用 `outdated/` 审核脚本，不擅自 build、运行全库 BFS、提交或推送。详细规则见 [站点身份与重复站点策略](docs/SITE-IDENTITY.md)。
