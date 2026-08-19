# AGENTS - 友链管理指南

> **⚠️ 关键规则：未经明确授权，禁止执行 `git push` 或任何推送操作！**
> 所有本地修改必须先经用户确认，再由用户决定是否推送。
> 任何时候需要推送，必须 ask 用户是否要 git push。

## 📁 目录结构

```
links/                       # 友链 YAML 源文件（核心数据，8600+ 文件）
├── aggregators/            # 已确认的博客聚合型站点
└── unverified/             # 待验证候选（不进入正式图数据）
docs/
├── INTERACTIONS.md          # 3D 图交互系统（API/事件/面板）
├── LABELS.md                # 3D 节点标签系统
└── superpowers/
    ├── plans/
    └── specs/
scripts/
├── six-degrees.ts           # 六度分隔计算
├── update-site-names.ts     # 批量更新站点名称
└── validate-links.ts        # 友链数据校验
src/                         # Astro + Three.js 项目源码
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

本项目只接受两种正式站点类型：

- `blog`：个人、笔名作者或小型非机构创作团队运营，并真实提供原创发布内容的博客型站点。
- `blog-aggregator`：以发现、索引、连接或聚合多个独立博客及其文章为核心公共功能的博客聚合型站点。

站点只有在证据足以确认其满足下述定义时才进入正式图数据。页面上出现 `blog`、RSS、`<article>`、发布日期、评论区或某种博客框架，只能作为调查线索，不能单独证明它是博客。反过来，缺少 RSS、评论、自定义域名、固定更新频率或特定框架，也不能单独成为排除理由。

### `blog`：博客型站点

博客型站点必须同时满足以下条件：

1. **运营主体符合范围**：由个人、笔名作者或小型非机构创作团队负责。公司、政府、学校、产品品牌和大型媒体不作为 `blog` 收录。
2. **存在明确发布入口**：能够发现博客、文章、日志、随笔、笔记、Writing、Posts、Archive 或含义相同的入口或索引。
3. **至少一篇合格原创内容**：一篇即可照顾刚建立的新博客，但必须足以验证真实的原创发布行为。
4. **内容公开且具有永久链接**：合格内容须有实质正文，并拥有独立、稳定、可直接访问的 URL。主页中的内容区块或页内锚点不算独立博文；完全登录可见或完全付费墙的站点只能进入 `unverified`。
5. **发布内容是一等功能**：博客必须是站点的主要用途之一或清晰独立的栏目，不能只是作品集、产品页或简历中偶然出现的一段文字。

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
- **媒体型博客**：摄影、漫画、播客、视频、Newsletter、微博客、数字花园和 Linklog 可以准入，但至少一个原创条目必须有独立永久链接、公开索引，并包含作者说明、创作语境、节目笔记或实质评论。裸图库、平台跳转页和无完整条目的碎片资料库排除。
- **多人站点**：小型多人编辑出版物可以按 `blog` 收录；开放发帖论坛、问答站、Wiki 和社交社区排除。
- **停更站点**：停更时间不是排除条件；只要历史原创档案仍公开可读并满足上述条件，就可以收录。
- **托管平台**：托管在 GitHub Pages、WordPress.com 等平台上的个人博客按内容判断，可以准入；托管平台首页、账号资料页和社交主页不能准入。
- **商业化边界**：广告、赞助、打赏和非强制会员本身不构成商业站。若站点的主要目的变为销售、获客、SEO、产品宣传或机构传播，则排除。

### `blog-aggregator`：博客聚合型站点

博客聚合型站点与博客型站点并列判断，不要求聚合站自身发布原创文章。它必须同时满足：

1. **核心功能聚焦独立博客**：公共核心功能是发现、索引、分类、搜索、随机跳转、订阅或聚合多个独立博客或其文章。
2. **确实覆盖多个独立来源**：不设置固定数量门槛，数量本身不是判断依据；但不能只是单一站点、个人博客的一页普通友链，或通用网址收藏。
3. **存在稳定的发现机制**：公开提供可持续使用的目录、文章流、成员名录、OPML、Webring、搜索、关系图或等效入口。
4. **来源清楚且导向原站**：标明来源博客或作者，并提供指向规范原站或原文的链接。
5. **聚合行为不劫持内容**：自动 RSS 聚合可以准入，但不得隐藏来源、冒充原创、通过站内全文镜像劫持访问或形成内容农场。

补充规则：

- 聚合站的价值可以来自选择、整理、索引、归属标注和跨博客发现，不因自身没有原创博文而排除。
- `friends[]` 中的每个来源仍须单独应用本章准入规则；“被某聚合站收录”不能自动证明目标是合格博客。
- 普通博客自己的友链页不是博客聚合站，无论其中有多少链接。
- 论坛、问答、即时聊天或站内社交是核心功能时排除；若博客目录或跨博客文章流是独立的一等功能，而讨论仅为附属功能，可以按聚合型复核。
- 通用网址导航、泛新闻聚合、搜索引擎、RSS 阅读器产品、建站平台、付费排名目录、SEO 外链农场和无来源采集站排除。
- 综合站只有在博客栏目拥有独立稳定入口、明确的博客发现定位，且该入口本身满足全部聚合标准时，才以该栏目的规范 URL 收录。
- 正式博客聚合型站点统一放入 `links/aggregators/`。

### 明确排除的站点

下列站点在证据明确时直接 `exclude`，不能用空的 `friends: []` 占位：

- 没有合格博文的个人主页、单页主页、link-in-bio、在线简历和纯作品集；
- 论坛、问答、Wiki、开放社区、社交媒体主页和聊天服务；
- 博客框架、主题、插件、工具、托管平台、域名服务商、CDN、图床和短链服务；
- 商业网站、产品页、公司或机构官网，以及以销售、获客、SEO 或宣传为主要目的的站点；
- 通用导航、泛内容聚合、搜索引擎、RSS 阅读器产品和付费排名目录；
- 无明确来源、冒充原创、全文采集或劫持原站访问的采集站。

### 三态审核流程

审核结果只使用以下三种落库状态：

1. `include`：证据足够。博客写入普通 `links/` 分类目录，博客聚合站写入 `links/aggregators/`。
2. `unverified`：抓取失败、作者归属不明、原创性不明、混合用途、完全登录或付费可见，或者无法确认站点类型。候选写入 `links/unverified/`，不会进入正式图数据。
3. `exclude`：已确认属于单页主页、纯作品集、论坛、通用导航、产品、公司、平台、采集站等硬排除类型。不创建正式节点，也不为明确不合格的站点创建待验证占位文件。

固定审核顺序如下：

1. 验证 URL 安全性、公开可访问性和规范域名；跳转后应记录最终规范 URL。
2. 优先判断是否满足 `blog-aggregator` 定义。
3. 若不是聚合型，检查是否存在博客发布入口及至少一篇合格原创内容。
4. 检查运营主体与站点主要目的，确认没有触发硬排除规则。
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
| `aggregator-no-attribution` | 聚合内容没有清晰标明原博客或作者 |
| `aggregator-not-blog-focused` | 聚合或目录存在，但不以独立博客发现为核心 |
| `unverifiable` | 访问失败、证据不足或暂时无法可靠判断 |

### 待验证候选目录

`links/unverified/` 是保留目录，详细约定见 `links/unverified/README.md`：

- 候选使用与正式站点完全相同的 YAML Schema 和域名文件名；不要增加 `review`、`type` 等 Schema 外字段。
- 审核状态、原因码、证据 URL 和检查日期写在 YAML 顶部注释中。
- 默认构建、`/all.json`、统计、图二进制端点、`validate`、`six`、`frontier`、站点名称更新和默认 `audit` 都必须跳过该目录。
- 显式运行 `bun run validate links/unverified` 可以只校验候选结构；`bun run audit --dir links/unverified` 可以只审核候选。
- 验证通过后，将文件移动到普通正式分类或 `links/aggregators/`；明确不合格后删除候选或移交审核报告。
- 已确认合格的博客即使没有公开友链页，也可以使用 `friends: []`；空数组不能让非博客获得正式节点。
- 格式化工具可以处理该目录；格式化不会改变候选状态，也不会令其进入图数据。

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

```bash
bun install          # 安装依赖
bun run <script>     # 运行脚本
bun run lint         # 代码检查
bun run fmt          # 代码格式化
```

**禁止**：npm、yarn、pnpm

### 代码风格

```bash
bun run lint         # oxlint + tsc 类型检查
bun run fmt          # oxfmt 格式化
bun run lint && bun run fmt  # 提交前检查
```

### 可用脚本

| 命令 | 用途 |
|------|------|
| `bun run dev` | 启动 Astro 开发服务器 |
| `bun run build` | 构建生产版本 |
| `bun run validate` | 校验 `scripts/validate-links.ts` — 检查 YAML 格式和必填字段 |
| `bun run six` | 运行 `scripts/six-degrees.ts` — 六度分隔分析 |
| `bun run frontier` | 运行 `scripts/frontier-rank.ts` — 按入度排序待扩网域名 |
| `bun run audit` | 运行 `scripts/audit-links.ts` — 生成准入审核报告 |
| `bun run lint` | oxlint 代码检查 + TypeScript 类型检查 |
| `bun run fmt` | oxfmt 格式化 `src/` 和 `links/` |

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

**A**: 不凭站名、框架或 RSS 猜测，按“URL 与安全性 → 聚合型判断 → 博客入口与至少一篇合格原创内容 → 运营主体与主要目的”的顺序核实。证据足够才 `include`；无法访问或证据不足时写入 `links/unverified/`；确认是单页主页、纯作品集、论坛、通用导航、产品、机构或采集站时 `exclude`。完整定义见“博客宇宙”准入标准。

### Q: 个人主页或作品集可以收录吗？

**A**: 仅有个人介绍、简历、项目卡片或作品展示的不收录。若站点存在清晰独立的博客栏目，并且至少一篇原创内容拥有公开索引、实质正文和独立永久链接，则可以作为 `blog` 收录。SPA 是实现方式，不是排除理由；是否存在独立文章路由才是关键。

### Q: 聚合站自己没有原创文章，是否应该排除？

**A**: 不应该仅因此排除。`blog-aggregator` 的核心价值是跨博客发现、整理、索引和归属标注；只要它聚焦多个独立博客、提供稳定公开的发现机制、清楚标明来源并导向规范原站或原文，就可以收录。普通友链页、通用导航和无来源采集站不属于博客聚合站。

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
| `docs/INTERACTIONS.md` | 3D 图交互系统 API、事件、面板 |
| `docs/LABELS.md` | 3D 节点标签系统实现 |
