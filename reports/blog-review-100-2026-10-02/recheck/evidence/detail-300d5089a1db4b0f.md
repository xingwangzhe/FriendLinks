### 韩小韩博客
[ 朋友 ](https://www.vvhan.com/links)[ 圈子 ](https://www.vvhan.com/friends)[ 动态 ](https://www.vvhan.com/talking)[ 昔日 ](https://www.vvhan.com/archives)[ 留言 ](https://www.vvhan.com/message)[ 关于 ](https://www.vvhan.com/about)[ API](https://api.vvhan.com/)
[ Home](https://www.vvhan.com/)[朋友 ](https://www.vvhan.com/links)[圈子 ](https://www.vvhan.com/friends)[动态 ](https://www.vvhan.com/talking)[昔日 ](https://www.vvhan.com/archives)[留言 ](https://www.vvhan.com/message)[关于 ](https://www.vvhan.com/about)[API ](https://api.vvhan.com/) 搜索
![avatar](https://q1.qlogo.cn/g?b=qq&nk=1655466387&s=640)
### .𝙃𝙖𝙣
不曾与你分
深入探索
商务软件和生产力软件
开放源代码
计算机科学
# Astro主题-优雅的vhAstro-Theme【使用文档】
2025-03-02 晚上 **3260** 字 **16.3** 分钟 [ Code](https://www.vvhan.com/categories/Code)
🍊 我以 Astro 为基础开发的 vhAstro-Theme 主题模版，是一款优雅的响应式博客主题，它具有简洁的设计、流畅的动画和页面过渡。
🍇 Astro 活跃的社区支持、广泛的现代框架兼容性、高效的性能优化、优秀的开发体验以及原生 SEO 优化，支持 Markdown/MDX 编写内容，且允许开发者混合使用 React、Vue、Svelte 等主流框架的组件，是我心目中最适合构建博客这样的以内容驱动的网站的 Web 框架。
🥝 从 Z-Blog 到 Emlog，从 Typecho 到 Hexo，从动态博客到静态博客，作为一个前端，我深入了解了多种 SSG 工具，如 Hexo、Vitepress、Hugo 等，并最终锁定了 Astro 作为重构博客的选择。
## 🚀 vhAstro-Theme：一款基于 Astro 构建的优雅的响应式博客主题
**「当极简主义遇上工程之美」**
深入探索
data
脚本语言
编程
![Astro主题 vhAstro-Theme](https://www.vvhan.com/assets/images/lazy-loading.webp)
## 项目地址
> 1、QQ 群下载：116975361  
> 2、GitHub 下载（推荐）：[https://github.com/uxiaohan/vhAstro-Theme](https://github.com/uxiaohan/vhAstro-Theme) （谢谢你的star）
## ✨ 功能特性
  * 简洁的响应式设计
  * 流畅的动画和页面过渡
  * 丝滑的阻尼滚动效果
  * 顶部Banner
  * 两列布局
  * 阅读时间
  * 字数统计
  * 代码块
  * 语法高亮
  * 图片懒加载
  * 图片灯箱
  * LivePhoto
  * LaTex 数学公式
  * 赞赏功能
  * 评论 - 内置【Twikoo、Waline】
  * 本地搜索
  * 公告
  * 标签
  * 分类
  * 归档
  * 动态
  * 圈子
  * 关于
  * 留言板
  * 友情链接
  * 推荐文章
  * 置顶文章
  * 谷歌广告
  * 侧边栏选择性展示
  * 内置 404 页面
  * Sitemap 支持
  * RSS 支持
  * 活跃的社区支持
  * 广泛的现代框架兼容性
  * 高效的性能优化
  * 优秀的开发体验


## 🚀 使用方法
### 使用 Github 模板
  * 使用此模板 [生成新仓库或 Fork 此仓库](https://github.com/new?template_name=vhAstro-Theme&template_owner=uxiaohan)
  * 进行本地开发，Clone 新的仓库，执行 `pnpm install` 以安装依赖
  * 若未安装 [pnpm](https://pnpm.io)，执行 `npm install -g pnpm`
  * 通过配置文件 `src/config.ts` 自定义博客
  * 执行 pnpm newpost ‘文章标题’ 创建新文章，并在 src/content/posts/ 目录中编辑
  * 参考官方指南将博客部署至 Vercel, Netlify,Cloudflare Pages, GitHub Pages 等


### Vercel 自动部署
[Vercel 一键部署](https://vercel.com/new/clone?repository-url=https://github.com/uxiaohan/vhAstro-Theme)
### Cloudflare Pages 自动部署
[Cloudflare Pages 一键部署](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/deploy-to-workers&repository=https://github.com/uxiaohan/vhAstro-Theme)
其他更多部署方式（简简单单闭眼部署），请参考 [Astro 官方文档](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)。
### 使用命令拉取模板

```

# 使用 pnpm
pnpm create astro@latest --template uxiaohan/vhAstro-Theme astro-blog
# 或者 yarn
yarn create astro --template uxiaohan/vhAstro-Theme astro-blog
# 或者 npm
npm create astro@latest -- --template uxiaohan/vhAstro-Theme astro-blog
# 进入项目目录
cd astro-blog

```

### 本地开发

```

# 安装依赖
pnpm install
# 本地开发
pnpm dev
# 构建静态文件
pnpm build
# 创建新文章
pnpm newpost '文章标题'

```

### ⚠️ Hexo 迁移 Astro 方法
将 `Hexo` 博客的 `src/_posts/` 目录下的文章文件，复制到 `Astro` 的 `src/content/blog/` 目录下即可，然后自定义 `src/config.ts` 配置文件去自定义博客。
⚠️ `Hexo` 的部署、使用、自动化部署等方法 完全适用于 `Astro` 博客！
🎉 此时，你已成功迁移 Hexo 博客至 Astro 博客！
## 🍬 特色页面
### 友情链接

```

// 配置文件 src/page_data/Link.ts
export default {
	// API 接口请求优先，数据格式保持和 data 一致
	api: "",
	// api 为空则使用 data 静态数据
	data: [
		{
			name: "韩小韩博客",
			link: "https://www.vvhan.com",
			avatar: "https://q1.qlogo.cn/g?b=qq&nk=1655466387&s=640",
			descr: "运气是计划之外的东西."
		},
		{
			name: "韩小韩API",
			link: "https://api.vvhan.com",
			avatar: "https://api.vvhan.com/static/images/logo.webp",
			descr: "免费Web API数据接口调用服务平台."
		}
	]
};

```

### 说说动态

```

// 配置文件 src/page_data/Talking.ts
export default {
	// API 接口请求优先，数据格式保持和 data 一致
	api: "",
	// api 为空则使用 data 静态数据
	// 注意：图片请用 vh-img-flex 类包裹
	data: [
		{
			date: "2025-02-12 19:36:16",
			tags: ["树", "夕阳"],
			content: '好美🌲<p class="vh-img-flex"><img src="https://i0.wp.com/shp.qpic.cn/collector/1655466387/937ec070-8448-4c7b-9c8b-abd41ce892cb/0"></p>'
		},
		{
			date: "2024-10-05 16:16:06",
			tags: ["日常"],
			content: "记录第一条说说"
		}
	]
};

```

### 圈子（需部署FreshRSS）

```

// 配置文件 src/page_data/Friends.ts
export default {
  // API 接口请求优先，数据格式保持和 data 一致
  api: '',
  // api 为空则使用 data 静态数据
  data: [
    {
      "title": "Astro 中使用 Lenis 增加鼠标滚动阻尼感",
      "auther": "韩小韩博客",
      "date": "2025-03-06",
      "link": "https://www.vvhan.com/article/Lenis-in-Astro",
      "content": "在移动端触控交互中，惯性滚动带来的丝滑体验已成为标配，但鼠标滚轮受限于机械结构，滚动时难免产生生硬的段落感。如何让传统滚轮操作也能获得如触控板般的阻尼反馈？Lenis库通过JavaScript模拟惯性算法，成功将”物理惯性”引入网页滚动，本文将解析其实现原理与实战应用。"
    },
    {
      "title": "Astro 添加 Twikoo 评论组件",
      "auther": "韩小韩博客",
      "date": "2025-03-03",
      "link": "https://www.vvhan.com/article/astro-twikoo",
      "content": "Astro在使用视图过渡路由时，在跳转路由时，会导致JS文件只有在第一次进入页面时生效，所以Astro在使用视图过渡路由下Twikoo时无法正常使用的，我是单独写了一个评论组件，对Twikoo进行动态加载，然后在需要评论的页面引入的。"
    },
    {
      "title": "Astro主题-优雅的vhAstro-Theme【使用文档】",
      "auther": "韩小韩博客",
      "date": "2025-03-02",
      "link": "https://www.vvhan.com/article/astro-theme-vhastro-theme",
      "content": "🥝从Z-Blog到Emlog，从Typecho到Hexo，从动态博客到静态博客，作为一个前端，我深入了解了多种SSG工具，如Hexo、Vitepress、Hugo等，并最终锁定了Astro作为重构博客的选择。🍇Astro活跃的社区支持、广泛的现代框架兼容性、高效的性能优化、优秀的开发体验。"
    }
  ]
}

```

## 📄 文章格式

```

---
title: 标题
categories: 分类
tags:
  - 标签1
  - 标签2
id: 文章ID
date: 文章创建日期
updated: 文章更新日期
cover: "封面图URL (为空默认随机内置封面 /public/assets/images/banner)"
recommend: false # 是否推荐文章
top: false # 是否置顶文章
hide: false # 是否隐藏文章
<!-- 页面独有 -->
type: "links" # 页面类型
comment: false # 关闭页面评论（默认开启）
---

```

## ✅ Lighthouse
![vhAstro-Theme-Lighthouse](https://www.vvhan.com/assets/images/lazy-loading.webp)
## 🌈 项目结构

```

.
├── public              => 静态资源
├── script              => 命令
├── src
│   ├── components      => 组件
│   ├── content
│   │   └── blog        => 博客文章数据
│   ├── layouts         => Layout 布局
│   ├── page_data       => 页面数据
│   ├── pages
│   │   ├── about                        => 关于页面
│   │   ├── archives                     => 归档页面
│   │   ├── article                      => 文章页面
│   │   ├── categories                   => 分类页面
│   │   ├── friends                      => 圈子页面
│   │   ├── links                        => 友链页面
│   │   ├── message                      => 留言页面
│   │   ├── tag                          => 标签页面
│   │   ├── talking                      => 动态页面
│   │   ├── [...page].astro              => 首页分页
│   │   ├── 404.astro                    => 404页面
│   │   ├── robots.txt.ts                => 爬虫文件
│   │   └── rss.xml.ts                   => RSS文件
│   ├── plugins             => 插件
│   ├── scripts             => 脚本
│   ├── styles              => 样式
│   ├── type                => 类型
│   ├── utils               => 工具
│   ├── content.config.ts   => 内容配置
│   ├── config.ts           => 配置
├── tsconfig.json       => Typescript 配置
├── astro.config.mjs    => Astro 配置
├── package.json        => 依赖管理
└── pnpm-lock.yaml      => 依赖锁定文件

```

## ⚙️ 项目配置

```

export default {
  // 网站标题
  Title: '韩小韩博客',
  // 网站地址
  Site: 'https://www.vvhan.com',
  // 网站副标题
  Subtitle: '不曾与你分享的时间,我在进步.',
  // 网站描述
  Description: '韩小韩博客 专注于前开发与相关技术的实战分享，涵盖Vue框架、Node.js、Serverless等，并涉及Node、Python、Linux、Docker等领域。同时，博客也分享作者的生活、音乐和旅行的热爱。',
  // 网站作者
  Author: '.𝙃𝙖𝙣',
  // 作者头像
  Avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1655466387&s=640',
  // 网站座右铭
  Motto: '运气是计划之外的东西.',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  // 网站侧边栏公告 (不填写即不开启)
  Tips: '<p>欢迎光临我的博客 🎉</p><p>这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖</p>',
  // 首页打字机文案列表
  TypeWriteList: [
    '不曾与你分享的时间,我在进步.',
    "I am making progress in the time I haven't shared with you.",
  ],
  // 网站创建时间
  CreateTime: '2021-09-01',
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
    // 首页高度
    HomeHeight: '38.88rem',
    // 其他页面高度
    PageHeight: '28.88rem',
    // 背景
    background: "url('/assets/images/home-banner.webp') no-repeat center 60%/cover",
  },
  // 博客主题配置
  Theme: {
    // 颜色请用 16 进制颜色码
    // 主题颜色
    "--vh-main-color": "#01C4B6",
    // 字体颜色
    "--vh-font-color": "#34495e",
    // 侧边栏宽度
    "--vh-aside-width": "318px",
    // 全局圆角
    "--vh-main-radius": "0.88rem",
    // 主体内容宽度
    "--vh-main-max-width": "1458px",
  },
  // 导航栏 (新窗口打开 newWindow: true)
  Navs: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: '朋友', link: '/links', icon: 'Nav_friends' },
    { text: '圈子', link: '/friends', icon: 'Nav_rss' },
    { text: '动态', link: '/talking', icon: 'Nav_talking' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
    { text: 'API', link: 'https://api.vvhan.com/', target: true, icon: 'Nav_link' },
  ],
  // 侧边栏个人网站
  WebSites: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: 'Github', link: 'https://github.com/uxiaohan', icon: 'WebSite_github' },
    { text: '韩小韩API', link: 'https://api.vvhan.com', icon: 'WebSite_api' },
    { text: '每日热榜', link: 'https://hot.vvhan.com', icon: 'WebSite_hot' },
    { text: '骤雨重山图床', link: 'https://wp-cdn.4ce.cn', icon: 'WebSite_img' },
    { text: 'HanAnalytics', link: 'https://analytics.vvhan.com', icon: 'WebSite_analytics' },
  ],
  // 侧边栏展示
  AsideShow: {
    // 是否展示个人网站
    WebSitesShow: true,
    // 是否展示分类
    CategoriesShow: true,
    // 是否展示标签
    TagsShow: true,
    // 是否展示推荐文章
    recommendArticleShow: true
  },
  // DNS预解析地址
  DNSOptimization: [
    'https://i0.wp.com',
    'https://cn.cravatar.com',
    'https://analytics.vvhan.com',
    'https://vh-api.4ce.cn',
    'https://registry.npmmirror.com',
    'https://pagead2.googlesyndication.com'
  ],
  // 博客音乐组件解析接口
  vhMusicApi: 'https://vh-api.4ce.cn/blog/meting',
  // 评论组件（只允许同时开启一个）
  Comment: {
    // Twikoo 评论
    Twikoo: {
      enable: false,
      envId: ''
    },
    // Waline 评论
    Waline: {
      enable: false,
      serverURL: ''
    }
  },
  // Han Analytics 统计（https://github.com/uxiaohan/HanAnalytics）
  HanAnalytics: { enable: true, server: 'https://analytics.vvhan.com', siteId: 'Hello-HanHexoBlog' },
  // Google 广告
  GoogleAds: {
    ad_Client: '', //ca-pub-xxxxxx
    // 侧边栏广告(不填不开启)
    asideAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`,
    // 文章页广告(不填不开启)
    articleAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`
  },
  // 文章内赞赏码
  Reward: {
    // 支付宝收款码
    AliPay: '/assets/images/alipay.webp',
    // 微信收款码
    WeChat: '/assets/images/wechat.webp'
  },
  // 页面阻尼滚动速度
  ScrollSpeed: 666
}

```

## 🌈 组件
### 文本加粗

```

那个女孩子 **气喘吁吁** 的打电话和你说：我在跑步

```

那个女孩子 **气喘吁吁** 的打电话和你说：我在跑步
### 文本倾斜

```

你问她为什么有 _啪啪啪_ 的声音，她和你说：我是穿拖鞋跑步的

```

你问她为什么有 _啪啪啪_ 的声音，她和你说：我是穿拖鞋跑步的
### 文本删除

```

你说，好的那你继续 ~~跑步~~ 吧

```

你说，好的那你继续 ~~跑步~~ 吧
### 行内代码

```

`Vscode` 是全宇宙最好的编辑器

```

`Vscode` 是全宇宙最好的编辑器
### 引用

```

> 这是一个引用

```

> 这是一个引用
### 有序列表

```

牛肉的的营养如下：

1. 能量 (kcal)
2. 脂类 (fat)
3. 蛋白质 (protein)
4. 碳水化合物 (carbohydrate)

```

牛肉的的营养如下：
  1. 能量 (kcal)
  2. 脂类 (fat)
  3. 蛋白质 (protein)
  4. 碳水化合物 (carbohydrate)


### 无序列表

```

- 一个女朋友
- 二个女朋友
- 三个女朋友
- ...
- N 个女朋友

```

  * 一个女朋友
  * 二个女朋友
  * 三个女朋友
  * …
  * N 个女朋友


### 超链接

```

[百度一下，你就懂了](https://www.baidu.com)

```

[百度一下，你就懂了](https://www.baidu.com)
### 3 行 3 列的表格

```

| 表头 | 表头 | 表头 |
| :--: | :--: | :--: |
| 鸡头 | 鸭头 | 狗头 |
| 鸡头 | 鸭头 | 狗头 |
| 鸡头 | 鸭头 | 狗头 |

```
  
| 表头  | 表头  | 表头  |  
| --- | --- | --- |  
| 鸡头  | 鸭头  | 狗头  |  
| 鸡头  | 鸭头  | 狗头  |  
| 鸡头  | 鸭头  | 狗头  |  
### 代码块

```

const obj = {
	name: "hi",
	age: 18
};
// 判断某个属性是否在对象里
console.log("name" in obj);
// 删除对象某个属性
console.log(delete obj.name);
// 将对象的属性名提取成数组
console.log(Object.keys(obj));

```

### H 标签

```

<!-- H标签，页面标题即h1，不建议文章内使用h1标签 -->
## H2
### H3
#### H4
##### H5

```

## H2
### H3
#### H4
##### H5
### 数学公式

```

% 函数式
${f(x)=a_nx^n+a_{n-1}x^{n-1}+a_{n-2}x^{n-2}}+\cdots$
% 四则运算
$2x - 5y =  8$
$3x + 9y =  -12$
$7x \times 2y \neq 3z$
% 希腊字母
$\Gamma$、$\iota$、$\sigma$、$\phi$、$\upsilon$、$\Pi$、$\Bbbk$、$\heartsuit$、$\int$、$\oint$
% 三角函数、对数、指数
$\tan$、$\sin$、$\cos$、$\lg$、$\arcsin$、$\arctan$、$\min$、$\max$、$\exp$、$\log$
% 运算符
$+$、$-$、$=$、$>$、$<$、$\times$、$\div$、$\equiv$、$\leq$、$\geq$、$\neq$
% 集合符号
$\cup$、$\cap$、$\in$、$\notin$、$\ni$、$\subset$、$\subseteq$、$\supset$、$\supseteq$、$\N$、$\Z$、$\R$、$\R$、$\infty$

```

> 函数式
f(x)=anxn+an−1xn−1+an−2xn−2+⋯{f(x)=a_nx^n+a_{n-1}x^{n-1}+a_{n-2}x^{n-2}}+\cdots
> 四则运算
2x−5y=82x - 5y = 8
3x+9y=−123x + 9y = -12
7x×2y≠3z7x \times 2y \neq 3z
> 希腊字母
Γ\Gamma、ι\iota、σ\sigma、ϕ\phi、υ\upsilon、Π\Pi、k\Bbbk、♡\heartsuit、∫\int、∮\oint
> 三角函数、对数、指数
tan⁡\tan、sin⁡\sin、cos⁡\cos、lg⁡\lg、arcsin⁡\arcsin、arctan⁡\arctan、min⁡\min、max⁡\max、exp⁡\exp、log⁡\log
> 运算符
++、−-、==、>>、<<、×\times、÷\div、≡\equiv、≤\leq、≥\geq、≠\neq
> 集合符号
∪\cup、∩\cap、∈\in、∉\notin、∋\ni、⊂\subset、⊆\subseteq、⊃\supset、⊇\supseteq、N\N、Z\Z、R\R、R\R、∞\infty
### 按钮组件

```

<!-- 按钮组件 -->
::btn[标题]{link="URL 链接"}
<!-- 支持类型：info、success、warning、error、import -->
::btn[按钮]{link="链接" type="info"}

```
[按钮](https://www.baidu.com) [按钮](https://www.baidu.com) [按钮](https://www.baidu.com) [按钮](https://www.baidu.com) [按钮](https://www.baidu.com) [按钮](https://www.baidu.com)
### Note 组件

```

<!-- note组件 -->
:::note
这是 note 组件 默认主题
:::
<!-- 支持类型：info、success、warning、error、import -->
:::note{type="info"}
这是 note 组件 success 主题
:::

```

这是 note 组件 默认主题
这是 note 组件 info 主题
这是 note 组件 success 主题
这是 note 组件 warning 主题
这是 note 组件 error 主题
这是 note 组件 import 主题
### Picture 组件

```

:::picture
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
![Astro主题-vhAstro-Theme](https://i0.wp.com/uxiaohan.github.io/v2/2023/03/42944511.png)
:::

```
![Astro主题-vhAstro-Theme](https://www.vvhan.com/assets/images/lazy-loading.webp) ![Astro主题-vhAstro-Theme](https://www.vvhan.com/assets/images/lazy-loading.webp) ![Astro主题-vhAstro-Theme](https://www.vvhan.com/assets/images/lazy-loading.webp)
### LivePhoto 组件

```

<!-- 纵向图片 -->
::vhLivePhoto{photo="https://static.vvhan.com/img/1.webp" video="https://static.vvhan.com/img/1.mp4" type="y"}
<!-- 横向图片 -->
::vhLivePhoto{photo="https://static.vvhan.com/img/2.webp" video="https://static.vvhan.com/img/2.mp4"}

```

### Music 组件

```

<!-- id 支持：歌曲 id / 歌单 id / 专辑 id / 搜索关键词
type 支持：song, playlist, album, search（默认值：song）
server 支持：netease, tencent, kugou, xiami, baidu（默认值：netease） -->
<!-- 单曲 -->
::vhMusic{id="1474697967"}
<!-- 列表 -->
::vhMusic{id="173901981" type="playlist"}

```

不错（prod.ZS Beatz） - 寄风
Loading
00:00 / 00:00
  1. 1 不错（prod.ZS Beatz） 寄风


### Video 组件

```

::vhVideo{url="https://originfastly.jsdelivr.net/gh/uxiaohan/uxiaohan.github.io@master/v2/2022/08/index.m3u8"}

```

![](https://www.vvhan.com/assets/images/logo.png)
设置弹幕颜色
设置弹幕类型
顶部 滚动 底部
0:00 / 0:00
速度
洗脑循环
显示弹幕
海量弹幕
弹幕透明度
0.5
0.75
正常
1.25
1.5
2
00:00
[x]
Player version
Player FPS
Video type
Video url
Video resolution
Video duration
[ 视频统计信息](javascript:void\(0\);)
[ 关于作者](https://diygod.me)
[ DPlayer v1.27.1](https://github.com/MoePlayer/DPlayer)
[ Astro ](https://www.vvhan.com/tag/Astro)[ 主题 ](https://www.vvhan.com/tag/%E4%B8%BB%E9%A2%98)[ 博客 ](https://www.vvhan.com/tag/%E5%8D%9A%E5%AE%A2)[ vhAstro ](https://www.vvhan.com/tag/vhAstro)[ vhAstro-Theme](https://www.vvhan.com/tag/vhAstro-Theme)[Astro 添加 Twikoo 评论组件](https://www.vvhan.com/article/astro-twikoo) [Fetch的GET、POST简单HTTP请求封装](https://www.vvhan.com/article/fetch-get-post)
喜欢这篇文章嘛，觉得文章不错的话，奖励奖励我！
![支付宝打赏](https://www.vvhan.com/assets/images/lazy-loading.webp) 支付宝 ![微信打赏](https://www.vvhan.com/assets/images/lazy-loading.webp) 微信
本文由 .𝙃𝙖𝙣 于 2025-03-02 晚上 发布
文章地址：[Astro主题-优雅的vhAstro-Theme【使用文档】](https://www.vvhan.com/article/astro-theme-vhastro-theme)
本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0) 许可协议。完整转载请注明来自 [韩小韩博客](https://www.vvhan.com)！
你认为这篇文章怎么样？
  * ![](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_agree.png)
20
  * ![](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_look_down.png)
1
  * ![](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_sunglasses.png)
5
  * ![](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_pick_nose.png)
5
  * ![](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_awkward.png)
0
  * ![](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_sleep.png)
2


昵称
邮箱
网址(可选)
* * *
#### 预览:
[](https://guides.github.com/features/mastering-markdown/ "Markdown Guide")
0  字
登录提交
![alus](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/alus/alus_happy.png)![BiliBili](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/bilibili/bb_cute.png)![B站小黄脸](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/bmoji/bmoji_unavailble_doge.png)![qq](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/qq/qq_grin.gif)![Tieba](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/tieba/tieba_antic.png)![Weibo](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/weibo/weibo_doge.png)![soul emoji](https://registry.npmmirror.com/@waline/emojis/1.3.0/files/soul-emoji/soul_squint_smile.png)
评论
  * 按正序
  * 按倒序
  * 按热度


![.𝙃𝙖𝙣](https://www.vvhan.com/assets/images/lazy-loading.webp) .𝙃𝙖𝙣
运气是计划之外的东西.
[ ](https://github.com/uxiaohan "Github")[ ](https://api.vvhan.com "韩小韩API")[ ](https://hot.vvhan.com "每日热榜")[ ](https://wp-cdn.4ce.cn "骤雨重山图床")[](https://analytics.vvhan.com "HanAnalytics")
258
文章数
4
分类数
404
标签数
公告
欢迎光临我的[ 博客](https://www.vvhan.com/article/astro-theme-vhastro-theme) 🎉
博客资源与服务
这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖
![](https://www.vvhan.com/assets/images/tips.gif)
### 分类
[Code _152_ ](https://www.vvhan.com/categories/Code)[Daily _84_ ](https://www.vvhan.com/categories/Daily)[Software _16_ ](https://www.vvhan.com/categories/Software)[Share _6_](https://www.vvhan.com/categories/Share)
### 热门标签
[PHP _17_ ](https://www.vvhan.com/tag/PHP)[HTML _12_ ](https://www.vvhan.com/tag/HTML)[JS _9_ ](https://www.vvhan.com/tag/JS)[Vue _9_ ](https://www.vvhan.com/tag/Vue)[Mac _9_ ](https://www.vvhan.com/tag/Mac)[Javascript _8_ ](https://www.vvhan.com/tag/Javascript)[Typecho _7_ ](https://www.vvhan.com/tag/Typecho)[树莓派 _7_ ](https://www.vvhan.com/tag/%E6%A0%91%E8%8E%93%E6%B4%BE)[CDN _7_ ](https://www.vvhan.com/tag/CDN)[开源 _6_ ](https://www.vvhan.com/tag/%E5%BC%80%E6%BA%90)[Github _6_ ](https://www.vvhan.com/tag/Github)[CloudFlare _6_ ](https://www.vvhan.com/tag/CloudFlare)[2022 _5_ ](https://www.vvhan.com/tag/2022)[图床 _5_ ](https://www.vvhan.com/tag/%E5%9B%BE%E5%BA%8A)[Hexo _5_ ](https://www.vvhan.com/tag/Hexo)[Astro _5_](https://www.vvhan.com/tag/Astro)
### 精品流量卡
[![精品大流量卡](https://www.vvhan.com/assets/images/phone-card.webp)](https://h5.lot-ml.com/ProductEn/Index/548465d7349b6599)
### 推荐文章
[_1_ 最新二合一收款码 - 物理合并版 2025-05-06 下午 ](https://www.vvhan.com/article/new-pay-qrcode)[_2_ Astro主题-优雅的vhAstro-Theme【使用文档】 2025-03-02 晚上 ](https://www.vvhan.com/article/astro-theme-vhastro-theme)[_3_ HanAnalytics访问分析Web统计托管于（Cloudflare Pages） 2024-09-22 晚上 ](https://www.vvhan.com/article/han-analytics)[_4._ Cloudflare优选IP➕DnsPod的DDNS自动切换 2024-08-27 下午 ](https://www.vvhan.com/article/cloudflare-ip-dnspod-ddns)[_5._ 骤雨重山无限存储图床托管于（Cloudflare Pages） 2024-07-22 晚上 ](https://www.vvhan.com/article/zycs-img-cloud-from-cloudflare-pages)[_6._ 今日热榜HotList-Web前端开源Vue - （聚合热榜） 2022-12-06 晚上](https://www.vvhan.com/article/hotlist-web-vue)
### 广而告之
![韩小韩](https://www.vvhan.com/assets/images/footer/ing.svg)稳定运行 _5年1月1天_[![HanAnalytics](https://www.vvhan.com/assets/images/footer/hananalytics.svg)](https://analytics.vvhan.com)
[![Astro](https://www.vvhan.com/assets/images/footer/astro.svg)](https://astro.build/)[![vhAstro-Theme](https://www.vvhan.com/assets/images/footer/theme.svg)](https://github.com/uxiaohan/vhAstro-Theme)[![sitemap](https://www.vvhan.com/assets/images/footer/sitemap.svg)](https://www.vvhan.com/sitemap-index.xml)[![rss](https://www.vvhan.com/assets/images/footer/rss.svg)](https://www.vvhan.com/rss.xml)[![icp](https://www.vvhan.com/assets/images/footer/icp.svg)](https://beian.miit.gov.cn/)
