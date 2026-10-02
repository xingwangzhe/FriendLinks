# 100 份 YAML 与全部记录友链的准入复核

> 后续更新：本报告是清理前的历史快照。已完成两批删除与 132 个待定 URL 的第二轮复查；当前修改、证据与数量见 [清理与复查报告](recheck/README.md)。

检查日期：2026-10-02。工具：crawl4ai CLI `crwl`。本轮只生成报告和证据，不修改、移动或删除站点 YAML。

## 范围与结果

100 份正式普通站点 YAML，150 条原始友链引用，148 个不同目标 URL。主站、友链和 YAML 指定/默认友链页合计 323 个不同初始探测 URL，已完成 323 个；另有 130 次详情探测和 43 次人工补充探测。

| 对象 | include：证据支持 | exclude：确认不符 | unverified：尚待复核 |
| --- | ---: | ---: | ---: |
| 100个主站 | 53 | 10 | 37 |
| 148个目标URL | 15 | 38 | 95 |

主站和目标可能重叠，表格两行不能相加当作不同逻辑站点数量。目标按仓库原始 URL 字符串去重，不代表域名或同义地址合并后的数量。

## 方法与判断边界

- 普通正式站点中按0/1/2/3友链分层各25份，并非全库随机代表性样本。
- 全部记录中的目标URL均尝试crwl；抓取成功标记只表示爬虫执行情况，挑战页和HTTP错误页仍为unverified。
- 仅检查本轮抓取正文与补充发布入口，不是全站穷尽抓取，也未作全网原创性检索。
- include只代表本轮证据支持准入，不代表所有文章或所有友链有效。
- exclude判断当前收录入口；不同域名的博客地址单独复核，未自动合并别名。
- 报告不改变YAML落库状态，未运行outdated审核工具、build、布局或BFS。
- 选择方式：按 SHA256(`review100-20261002:` + 相对文件路径)稳定排序；0、1、2、3条友链各选25份。排除 `links/unverified/` 和已进行聚合站专题复核的 `links/aggregators/`。
- 标准依据：仓库 `AGENTS.md`“博客宇宙”准入标准及 `README.md`。至少一篇公开、实质、原创且有独立永久链接的个人/小型非机构团队文章；聚合型必须以多个独立博客发现为核心，清晰标来源并导向原站。
- 个人普通友链页、广泛个人站Webring、音乐目录不会因链接数量多而自动成为博客聚合站。
- 默认 `/links` 返回404不会单独否定博客；停更、使用文档框架、有广告或Hello World不会单独否定存在其他合格内容的博客。

## 明确不符合的主站

| YAML / 主入口 | 判断 | 原因 | 证据 |
| --- | --- | --- | --- |
| [links/firework.acuherb.xyz.yml](../../links/firework.acuherb.xyz.yml)<br>https://firework.acuherb.xyz/ | exclude `tool-or-product-primary` | 当前是交互烟花模拟器，仅提供烟花参数设置，没有博客发布或跨博客聚合功能。 | [证据1](evidence/0679f021a5a49b0d.md) |
| [links/www.nekro.top.yml](../../links/www.nekro.top.yml)<br>https://www.nekro.top/ | exclude `homepage-only` | 延时复抓后完整页面为个人联系/服务引导主页与音乐播放器；未发现站内文章发布索引，博客仅导航文字。 | [证据1](evidence/41dfbcd1eb451447.md) / [证据2](evidence/supplement-41dfbcd1eb451447.md) |
| [links/zh-v2.d2l.ai.yml](../../links/zh-v2.d2l.ai.yml)<br>https://zh-v2.d2l.ai/ | exclude `knowledge-base-only` | 动手学深度学习教材与课程文档，章节目录不是个人博客发布索引。 | [证据1](evidence/220f2b15cecf0286.md) / [证据2](evidence/detail-99c4d9d5f67232c1.md) |
| [links/pljzy.top.yml](../../links/pljzy.top.yml)<br>https://pljzy.top/ | exclude `homepage-only` | 明确自称个人主页/引导页，旧站不维护，仅链接独立子域 blog.pljzy.top，不是当前入口发布栏目。 | [证据1](evidence/53781ca386954c37.md) |
| [links/hugoblox.com.yml](../../links/hugoblox.com.yml)<br>https://hugoblox.com/ | exclude `framework-or-theme` | HugoBlox 建站框架/模板产品官网，模板、定价、文档与注册为核心功能。 | [证据1](evidence/e7a37b8092ade064.md) / [证据2](evidence/detail-2a8ef0b82e22b2a6.md) |
| [links/kaic.hidns.co.yml](../../links/kaic.hidns.co.yml)<br>https://kaic.hidns.co/ | exclude `tool-or-product-primary` | ProxyIP、Socks5/HTTP、DNS64/NAT64 检测工具集，无博客或博客聚合功能。 | [证据1](evidence/fb8112fec47e15a9.md) |
| [links/louiezong.com.yml](../../links/louiezong.com.yml)<br>https://www.louiezong.com/ | exclude `portfolio-only` | 插画、动画与音乐作品集，当前入口及作品分类以展示为主，未发现带创作语境的独立博客发布。 | [证据1](evidence/360c9d9f993d6da2.md) / [证据2](evidence/detail-562ffef687406f65.md) |
| [links/nuel.pw.yml](../../links/nuel.pw.yml)<br>https://nuel.pw/ | exclude `portfolio-only` | 当前域名是游戏和音乐作品展示，News 指向独立域名 nuel.news；当前入口未提供合格博客发布。 | [证据1](evidence/ae593668b0f59104.md) / [证据2](evidence/detail-486ec5d142d18502.md) |
| [links/caramiki.com.yml](../../links/caramiki.com.yml)<br>https://caramiki.com/ | exclude `portfolio-only` | 设计、插画、网页作品集与简历，未发现博客发布入口。 | [证据1](evidence/4d2ca14fa191bd43.md) / [证据2](evidence/detail-0daf1dc3cafa3bff.md) |
| [links/ikk.me.yml](../../links/ikk.me.yml)<br>https://ikk.me/ | exclude `homepage-only` | 当前是个人服务入口，Blog 按钮链接 kk.sb；另域博客合格与当前主页是否合格分别处理。 | [证据1](evidence/53fc4162bae66d0b.md) |

## 明确不符合的友链目标

| 目标 / 来源YAML | 判断 | 原因 | 证据 |
| --- | --- | --- | --- |
| https://www.52share.online/<br>[links/542869246.github.io.yml](../../links/542869246.github.io.yml) | exclude `non-original-content` | 主页为课程/电子书下载集合；所查详情明确网络收集资源并导向网盘，未提供作者原创正文，独立个人博客另在 me.obey.fun。 | [证据1](evidence/fb56272bd3e45dd2.md) / [证据2](evidence/detail-bd4e446373657be9.md) |
| https://techaro.lol<br>[links/blog.closure.cc.yml](../../links/blog.closure.cc.yml) | exclude `corporate-or-institutional` | 企业安全软件、AI 咨询与定制开发服务官网，主营产品/服务销售。 | [证据1](evidence/0cff05b7cdd575c6.md) / [证据2](evidence/detail-fc170540210c742f.md) |
| https://matrix.to/#/@prince213:matrix.org<br>[links/prince213.top.yml](../../links/prince213.top.yml) | exclude `social-profile` | URL 明确为 Matrix 用户联系方式/聊天跳转链接；本轮抓取失败，排除依据是入口功能而非访问失败。 | [证据1](evidence/df95ec4077051ed0.md) |
| http://dokan-dev.github.io/<br>[links/greyhathacker.net.yml](../../links/greyhathacker.net.yml) | exclude `tool-or-product-primary` | Dokan 文件系统开发库项目官网，下载、API 文档及支持为主要功能。 | [证据1](evidence/607325b163f14386.md) / [证据2](evidence/detail-e8f0f2a20a3c4d20.md) |
| https://forkinganddividing.com<br>[links/jiewei.xyz.yml](../../links/jiewei.xyz.yml) | exclude `knowledge-base-only` | 数学理论关系图、性质定义与参考文献，属学术知识工具，非博客或跨博客发现机制。 | [证据1](evidence/fccbf42b17356fbf.md) / [证据2](evidence/detail-fa8e0de8f20a3e1d.md) |
| https://vueds.com<br>[links/arielsalminen.com.yml](../../links/arielsalminen.com.yml) | exclude `framework-or-theme` | Vue Design System 开发工具/设计系统项目介绍及文档，非博客。 | [证据1](evidence/78497e36b19d9e84.md) / [证据2](evidence/detail-fe2b5ab76edfacff.md) |
| https://www.igt.com/<br>[links/theparanoidtimes.org.yml](../../links/theparanoidtimes.org.yml) | exclude `corporate-or-institutional` | IGT 企业官网，游戏和金融技术产品、投资者、招聘为核心入口。 | [证据1](evidence/78028036bc54c4ef.md) / [证据2](evidence/detail-e031bc041ea7477b.md) |
| https://ownable.dev<br>[links/hugoblox.com.yml](../../links/hugoblox.com.yml) | exclude `tool-or-product-primary` | AI 建站产品，注册、订阅定价、生成网站为核心功能。 | [证据1](evidence/93121d59f1ced03b.md) / [证据2](evidence/detail-da00da64791c2db0.md) |
| https://theme-next.org/<br>[links/blog.skykey.fun.yml](../../links/blog.skykey.fun.yml) | exclude `framework-or-theme` | NexT 主题官网及版本发布日志，非个人原创博客。 | [证据1](evidence/5eccc84826bf6fd3.md) / [证据2](evidence/detail-b3e1859c32bd0da3.md) |
| https://shinnku.com/<br>[links/galgamer.moe.yml](../../links/galgamer.moe.yml) | exclude `generic-directory` | 明确为 Galgame 资源下载站，核心是游戏文件目录，非博客或跨博客聚合。 | [证据1](evidence/3521848b34859220.md) |
| http://LouisHan.com/<br>[links/399s.com.yml](../../links/399s.com.yml) | exclude `tool-or-product-primary` | 域名出售落地页，明确标价与购买入口，当前地址已不是博客。 | [证据1](evidence/96b9df12dc76283f.md) |
| https://sivers.com/<br>[links/dereksivers.org.yml](../../links/dereksivers.org.yml) | exclude `tool-or-product-primary` | Derek Sivers 图书商店，购买和订单入口为核心功能；作者身份不使商店成为博客。 | [证据1](evidence/2bb2a52ccbb19d28.md) |
| https://musicthoughts.com/<br>[links/dereksivers.org.yml](../../links/dereksivers.org.yml) | exclude `non-original-content` | 音乐相关名人语录收藏/随机展示，非作者原创发布或独立博客发现。 | [证据1](evidence/ed4680563f050980.md) / [证据2](evidence/detail-4ae5fea59a52291f.md) |
| https://coseroom.com/<br>[links/rutua.cn.yml](../../links/rutua.cn.yml) | exclude `forum-primary` | 注册制图片分享社区，圈子、图集、市集为核心功能，非小型作者博客或博客聚合。 | [证据1](evidence/bd6d6cc7f8a46b67.md) / [证据2](evidence/detail-248e652ea78256d0.md) |
| https://wenpai.org/<br>[links/milu.ink.yml](../../links/milu.ink.yml) | exclude `framework-or-theme` | 开源发布平台的主题、插件、托管、文档与支持服务官网。 | [证据1](evidence/c7beae9391851ae6.md) / [证据2](evidence/detail-ab03202f1469cd22.md) |
| https://sndtst.com/<br>[links/faehnri.ch.yml](../../links/faehnri.ch.yml) | exclude `tool-or-product-primary` | 当前为楼层探索互动游戏，非博客发布或跨博客聚合。 | [证据1](evidence/47bb3ddc797b2ff8.md) |
| https://jurassicsystems.com/<br>[links/faehnri.ch.yml](../../links/faehnri.ch.yml) | exclude `tool-or-product-primary` | 侏罗纪公园系统界面互动复刻/游戏，非博客。 | [证据1](evidence/e3aa31021db67e48.md) |
| https://furdevs.cn/<br>[links/blog.lin-fun.com.yml](../../links/blog.lin-fun.com.yml) | exclude `homepage-only` | 开发团体介绍与招募单页，无公开原创文章索引或独立发布内容。 | [证据1](evidence/104063eb26ea60f1.md) |
| https://furcw.net/<br>[links/blog.lin-fun.com.yml](../../links/blog.lin-fun.com.yml) | exclude `generic-directory` | 建设中的社群/画师/工作室信息目录及名片服务，不聚焦独立博客。 | [证据1](evidence/b19f85b29e273a06.md) |
| https://ys.mihoyo.com/<br>[links/amirokd.dpdns.org.yml](../../links/amirokd.dpdns.org.yml) | exclude `tool-or-product-primary` | 原神游戏产品官方网站，非个人博客或独立博客聚合。 | [证据1](evidence/a05c544f932c4003.md) |
| https://everydaylouie.itch.io<br>[links/louiezong.com.yml](../../links/louiezong.com.yml) | exclude `portfolio-only` | 游戏平台作者资料与游戏作品卡片，未取得博客发布栏目。 | [证据1](evidence/06e14952e813d0a1.md) / [证据2](evidence/detail-6aed52fdd277ea37.md) |
| https://louiezong.bandcamp.com/<br>[links/louiezong.com.yml](../../links/louiezong.com.yml) | exclude `tool-or-product-primary` | 音乐专辑销售/播放与作者账号页面，非博客或博客聚合入口。 | [证据1](evidence/5d02e23a24bcdca8.md) / [证据2](evidence/detail-b4151ac005419085.md) |
| https://h4ck.org.cn/<br>[links/acevs.com.yml](../../links/acevs.com.yml) | exclude `homepage-only` | 个人项目服务引导，博客位于另外域名。 | [证据1](evidence/1c852744044e5de7.md) / [证据2](evidence/detail-0042ba6c6e860f6a.md) |
| https://www.unabridgedsoftware.com/<br>[links/caramiki.com.yml](../../links/caramiki.com.yml) | exclude `corporate-or-institutional` | 软件开发公司服务、案例与获客官网。 | [证据1](evidence/76e00d19d9127826.md) / [证据2](evidence/detail-53a816ecb00eb8ad.md) |
| http://waterbeargames.com/<br>[links/caramiki.com.yml](../../links/caramiki.com.yml) | exclude `corporate-or-institutional` | 桌游公司产品与商店；公司 Blog 不属于个人或小型非机构博客。 | [证据1](evidence/7017356688d7d590.md) / [证据2](evidence/detail-5a8851b2d1664bb4.md) |
| https://figureitout.group<br>[links/dcutting.com.yml](../../links/dcutting.com.yml) | exclude `tool-or-product-primary` | 线下绘画活动、RSVP、收费参与和资源为主，未提供博客发布或博客聚合。 | [证据1](evidence/aea10e1ddbfef2f6.md) / [证据2](evidence/detail-2e2ae813d42724cf.md) |
| https://spal.club/<br>[links/dcutting.com.yml](../../links/dcutting.com.yml) | exclude `homepage-only` | 表演艺术爱好者社团介绍、FAQ、加入页，无独立原创发布索引。 | [证据1](evidence/d305d013806a8313.md) / [证据2](evidence/detail-84fff8d40a1eeae8.md) |
| https://fediring.net/<br>[links/pdp8.info.yml](../../links/pdp8.info.yml) | exclude `aggregator-not-blog-focused` | Fediverse 用户个人站 Webring，明确接受广泛个人站，未聚焦独立博客。 | [证据1](evidence/39a62bc5d0dfffdf.md) / [证据2](evidence/detail-2d5100f37291668a.md) |
| https://faircamp.webr.ing/<br>[links/pdp8.info.yml](../../links/pdp8.info.yml) | exclude `aggregator-not-blog-focused` | 独立音乐人/唱片展示站 Webring，以音乐作品发现为核心，非博客聚合。 | [证据1](evidence/50d112e50c8626d5.md) / [证据2](evidence/detail-6ece202bfebe54ea.md) |
| https://heike.github.io<br>[links/yihui.org.yml](../../links/yihui.org.yml) | exclude `homepage-only` | 学术个人简介、论文、教学、学生及软件页，无独立博客发布栏目。 | [证据1](evidence/5ac85eb9d18928ff.md) / [证据2](evidence/supplement-c9e47eea0c4fcfc5.md) |
| https://pettw.online<br>[links/小蔡.tw.yml](../../links/小蔡.tw.yml) | exclude `tool-or-product-primary` | Minecraft 服务器服务官网，规则、赞助、下载与问题回报为核心。 | [证据1](evidence/8413b7b3bc9fd063.md) |
| https://maao.cc<br>[links/yuan1182.org.yml](../../links/yuan1182.org.yml) | exclude `homepage-only` | 个人联系卡与服务/相册入口，无原创发布栏目。 | [证据1](evidence/6347a93c29cf3765.md) |
| https://dropwww.com<br>[links/mcenahle.cn.yml](../../links/mcenahle.cn.yml) | exclude `knowledge-base-only` | 去除 www 的说明、配置教程与SEO说明专题站，非博客发布或博客聚合。 | [证据1](evidence/49d6899cd3d3317d.md) |
| https://www.natfrp.com/<br>[links/lo-li.cn.yml](../../links/lo-li.cn.yml) | exclude `tool-or-product-primary` | 内网穿透服务定价、注册与管理面板。 | [证据1](evidence/01cbd04e2753ff0f.md) |
| https://www.zerodream.net/<br>[links/lo-li.cn.yml](../../links/lo-li.cn.yml) | exclude `corporate-or-institutional` | 深圳市灵梦计算机技术有限公司官网，网站开发定制与技术服务。 | [证据1](evidence/333704e46e381cea.md) |
| https://feng.pub/<br>[links/www.91biu.work.yml](../../links/www.91biu.work.yml) | exclude `homepage-only` | 个人引导页，日志与小站均链接独立子域 blog.feng.pub。 | [证据1](evidence/a522c016c1d0339a.md) |
| https://furryfandomclub.cn/<br>[links/www.wolfhime.com.yml](../../links/www.wolfhime.com.yml) | exclude `forum-primary` | 群聊/开放社群、活动、群记录和社区服务为核心，无独立博客发现机制。 | [证据1](evidence/4bfdc8f84f4ac823.md) |
| https://not-hentai.com/<br>[links/www.wolfhime.com.yml](../../links/www.wolfhime.com.yml) | exclude `portfolio-only` | 图片收集图库，无作者创作语境、实质评论和独立博客条目。 | [证据1](evidence/5674e43e882be351.md) |

## 关系来源异常

以下记录更像页面抓取时混入的引用或署名，不能直接当作作者博客间友链：

- `blog.closure.cc.yml` 的 Techaro 来自 Anubis 防爬服务署名；挑战页面本身不能证明博客正文。
- `greyhathacker.net.yml` 的 Dokan 链接名称为 `here`，属于技术文章中的项目引用。
- `jiewei.xyz.yml` 的 `map of theories` 为数学参考图，而非博客聚合关系图。
- `arielsalminen.com.yml` 的 Vue Design System 为项目产品；`theparanoidtimes.org.yml` 的 IGT 为公司；`hugoblox.com.yml` 的 Ownable 为建站产品。

## 全部100个主站判定

| YAML / 主入口 | 判断 | 原因 | 证据 |
| --- | --- | --- | --- |
| [links/oldblog.kfdzcoffee.cn.yml](../../links/oldblog.kfdzcoffee.cn.yml)<br>https://oldblog.kfdzcoffee.cn/ | include `` | 个人博客；已检查动漫产业观点正文与永久链接。 | [证据1](evidence/b380267576a60a03.md) / [证据2](evidence/detail-123815f5b6c06129.md) |
| [links/hnpvo.com.yml](../../links/hnpvo.com.yml)<br>https://www.hnpvo.com/ | unverified `unverifiable` | 主站抓取失败，不能仅凭旧标题中的 Discuz 判定当前网站。 | [证据1](evidence/1be572c8c5a9f9e2.md) |
| [links/blog.rvalue.moe.yml](../../links/blog.rvalue.moe.yml)<br>https://blog.rvalue.moe/ | include `` | 个人文章索引、博客搭建经验正文及作者署名。 | [证据1](evidence/03c40207113587bd.md) / [证据2](evidence/detail-a0479eb2f6f16b72.md) |
| [links/redcha.cn.yml](../../links/redcha.cn.yml)<br>https://redcha.cn/ | unverified `homepage-only` | 当前入口为个人项目/多站入口；博客日记在其他子域，需确认当前入口的发布栏目。 | [证据1](evidence/39295c72bc3b8d02.md) / [证据2](evidence/detail-7111d34c49f1e320.md) / [证据3](evidence/supplement-dc4568ceb0dc3c16.md) |
| [links/blog.fifcom.cn.yml](../../links/blog.fifcom.cn.yml)<br>https://blog.fifcom.cn/ | include `` | 补抓 Posts 索引及 FIFCOM 署名 Flume 配置实践正文；非仅首页介绍。 | [证据1](evidence/32ac73e653a44d54.md) / [证据2](evidence/supplement-071781a1b5600708.md) / [证据3](evidence/supplement-fc61c4c3a2f3aee6.md) |
| [links/blog.imwcr.cn.yml](../../links/blog.imwcr.cn.yml)<br>https://blog.imwcr.cn/ | include `` | Yuan_Tuo 的个人文章索引与独立技术/年度总结文章。 | [证据1](evidence/12b49db25ce9a2fa.md) / [证据2](evidence/detail-b3ab4407c8763a89.md) |
| [links/feisky.xyz.yml](../../links/feisky.xyz.yml)<br>https://feisky.xyz/ | include `` | Feisky 个人文章索引，包含使用工具的实践与观点。 | [证据1](evidence/b09d5fc035ce5bfd.md) / [证据2](evidence/detail-f4820b7fcb30c597.md) |
| [links/firework.acuherb.xyz.yml](../../links/firework.acuherb.xyz.yml)<br>https://firework.acuherb.xyz/ | exclude `tool-or-product-primary` | 当前是交互烟花模拟器，仅提供烟花参数设置，没有博客发布或跨博客聚合功能。 | [证据1](evidence/0679f021a5a49b0d.md) |
| [links/note-of-me.top.yml](../../links/note-of-me.top.yml)<br>https://note-of-me.top/ | include `` | VitePress 外观下有独立个人文章目录与 Nuxt/Vue 使用报告正文，不能按框架误排除。 | [证据1](evidence/c18b321cad22a3ef.md) / [证据2](evidence/detail-5f43ae9476fd9a19.md) / [证据3](evidence/supplement-5f43ae9476fd9a19.md) |
| [links/jiushill.github.io.yml](../../links/jiushill.github.io.yml)<br>https://jiushill.github.io/ | include `` | 九世署名的技术研究/学习记录，有独立文章链接。 | [证据1](evidence/9dcdad549a465ef6.md) / [证据2](evidence/detail-da55ce302b445c0e.md) |
| [links/www.nekro.top.yml](../../links/www.nekro.top.yml)<br>https://www.nekro.top/ | exclude `homepage-only` | 延时复抓后完整页面为个人联系/服务引导主页与音乐播放器；未发现站内文章发布索引，博客仅导航文字。 | [证据1](evidence/41dfbcd1eb451447.md) / [证据2](evidence/supplement-41dfbcd1eb451447.md) |
| [links/zh-v2.d2l.ai.yml](../../links/zh-v2.d2l.ai.yml)<br>https://zh-v2.d2l.ai/ | exclude `knowledge-base-only` | 动手学深度学习教材与课程文档，章节目录不是个人博客发布索引。 | [证据1](evidence/220f2b15cecf0286.md) / [证据2](evidence/detail-99c4d9d5f67232c1.md) |
| [links/www.yunyoujun.cn.yml](../../links/www.yunyoujun.cn.yml)<br>https://www.yunyoujun.cn/ | include `` | 云游君个人经验与观点文章，已补抓开源项目维护长文。 | [证据1](evidence/89d28fee99fb4994.md) / [证据2](evidence/detail-707b64669a4fb3b0.md) / [证据3](evidence/supplement-d2c0bccab7982a22.md) |
| [links/blog.qqdsw8.cn.yml](../../links/blog.qqdsw8.cn.yml)<br>https://blog.qqdsw8.cn/ | unverified `non-original-content` | 首页以源码、资源下载和网络技巧分享为主；补抓尚未证明至少一篇作者原创文章。 | [证据1](evidence/0b6ea1f346916282.md) / [证据2](evidence/detail-f77b61dc7c763725.md) |
| [links/flwfdd.xyz.yml](../../links/flwfdd.xyz.yml)<br>https://flwfdd.xyz/ | unverified `knowledge-base-only` | 补抓笔记为配置备忘录/课程材料；尚未证明当前主域有合格原创发布。博客链接位于另一子域。 | [证据1](evidence/985ec8b2377272f2.md) / [证据2](evidence/supplement-86426e11a58ba0d7.md) / [证据3](evidence/supplement-c99a74c8535b0b1d.md) |
| [links/sgfox.cc.yml](../../links/sgfox.cc.yml)<br>https://sgfox.cc/ | unverified `unverifiable` | HTTP 522，未获得可审核正文。 | [证据1](evidence/815e4a0166f7bb4d.md) |
| [links/lorexxar.cn.yml](../../links/lorexxar.cn.yml)<br>https://lorexxar.cn/ | include `` | LoRexxar 署名技术实践/观点，独立正文已抓取。 | [证据1](evidence/718d6dac7646025c.md) / [证据2](evidence/detail-3ecf6d68d0bda2e8.md) |
| [links/jk.sb.yml](../../links/jk.sb.yml)<br>https://jk.sb/ | include `` | 业余玩家个人介绍与独立主题修改教程正文。 | [证据1](evidence/50d283f65428f1a8.md) / [证据2](evidence/detail-78ff6b84f67238a2.md) |
| [links/lsy22.com.yml](../../links/lsy22.com.yml)<br>https://lsy22.com/ | unverified `no-qualifying-post` | 跳转 blog.lsy22.com，存在文章栏目，首页主要项目介绍；需补抓文章索引与正文。 | [证据1](evidence/2cb0e5c0c968145e.md) / [证据2](evidence/supplement-a6691411aa02a0b2.md) / [证据3](evidence/supplement-319513a979327c7d.md) |
| [links/blog.zhsher.cn.yml](../../links/blog.zhsher.cn.yml)<br>https://blog.zhsher.cn/ | include `` | 两名作者的小型生活日志，首页有实质原创日记及独立永久链接。 | [证据1](evidence/79caa08fb9ca4b9d.md) / [证据2](evidence/detail-a074d2ff9b45d54f.md) / [证据3](evidence/supplement-ec3cdeeb4c7f797c.md) |
| [links/www.emohe.cn.yml](../../links/www.emohe.cn.yml)<br>https://www.emohe.cn/ | include `` | 阿涛个人技术实践文章，已抓取 WebView2 优化正文。 | [证据1](evidence/9f7348271a014f0d.md) / [证据2](evidence/detail-85cb3749620dd48b.md) |
| [links/antfu.me.yml](../../links/antfu.me.yml)<br>https://antfu.me/ | include `` | 个人站存在独立 Blog 栏目，已抓取开源赞助观点长文。 | [证据1](evidence/652c652bc0bf0184.md) / [证据2](evidence/detail-c7f32d454ed1c9af.md) |
| [links/wzq02.top.yml](../../links/wzq02.top.yml)<br>https://wzq02.top/ | unverified `no-qualifying-post` | 首页显示博客功能文字但未抽取到文章或可跟随博客入口，需复抓。 | [证据1](evidence/a5a525f3ff5423af.md) / [证据2](evidence/supplement-a5a525f3ff5423af.md) |
| [links/blog.slanterns.net.yml](../../links/blog.slanterns.net.yml)<br>https://blog.slanterns.net/ | include `` | Slanterns 个人 NGINX/QUIC 实践正文与独立发布索引。 | [证据1](evidence/cfe870ee4b3179f5.md) / [证据2](evidence/detail-e79c09e3374bf3f3.md) |
| [links/pljzy.top.yml](../../links/pljzy.top.yml)<br>https://pljzy.top/ | exclude `homepage-only` | 明确自称个人主页/引导页，旧站不维护，仅链接独立子域 blog.pljzy.top，不是当前入口发布栏目。 | [证据1](evidence/53781ca386954c37.md) |
| [links/en.blog.alswl.com.yml](../../links/en.blog.alswl.com.yml)<br>https://en.blog.alswl.com/ | include `` | alswl 英文个人博客，已补抓年度生活回顾独立正文。 | [证据1](evidence/be682bdee3b081fe.md) / [证据2](evidence/detail-b1eea5df186e9544.md) / [证据3](evidence/supplement-8c4a136f268c360f.md) |
| [links/542869246.github.io.yml](../../links/542869246.github.io.yml)<br>https://542869246.github.io/ | include `` | Felix 个人博客，有面试经历及技术笔记，已抓取独立文章。 | [证据1](evidence/6e331e52c52e754c.md) / [证据2](evidence/detail-5d746fa4663cef7a.md) |
| [links/blog.diudiudevil.cn.yml](../../links/blog.diudiudevil.cn.yml)<br>https://blog.diudiudevil.cn/ | include `` | 个人读书、笔记与复盘索引，已抓取书架统计文章；AI 辅助声明不单独作为排除依据。 | [证据1](evidence/e1affeb606fd7740.md) / [证据2](evidence/detail-47ff4f433463b6df.md) |
| [links/blog.closure.cc.yml](../../links/blog.closure.cc.yml)<br>https://blog.closure.cc/ | unverified `unverifiable` | 返回 Anubis 反爬挑战页，HTTP 200 并不代表获得博客正文。 | [证据1](evidence/c175ec92c270e844.md) |
| [links/blog.hyosakura.com.yml](../../links/blog.hyosakura.com.yml)<br>https://blog.hyosakura.com/ | include `` | LovesAsuna 个人博客，有独立 Cloudflare 实践正文。 | [证据1](evidence/7dfadd9f33dac95f.md) / [证据2](evidence/detail-653e5c1d985d98f8.md) |
| [links/iquegui.com.yml](../../links/iquegui.com.yml)<br>https://www.iquegui.com/ | include `` | 纪伯伦M4X 个人文章索引，补抓自编拨号工具的过程与使用说明。 | [证据1](evidence/2f4ed82a6fb58533.md) / [证据2](evidence/detail-cf431716f3ed159c.md) / [证据3](evidence/supplement-ec0481fd04f4a031.md) |
| [links/xiaofuc.github.io.yml](../../links/xiaofuc.github.io.yml)<br>https://xiaofuc.github.io/ | include `` | 个人安全学习记录，已抓取含环境配置及本人踩坑过程的文章。 | [证据1](evidence/e211eee4cc7a2137.md) / [证据2](evidence/detail-f420c12bdde8f4db.md) |
| [links/fenguoerbian.netlify.app.yml](../../links/fenguoerbian.netlify.app.yml)<br>https://fenguoerbian.netlify.app/ | include `` | 独立 Blog 索引与作者给开源项目捐赠的个人记录正文已补抓；首页建设提示和演示模板不代表全站没有博客。 | [证据1](evidence/a16960ec5e4bd8f8.md) / [证据2](evidence/detail-1cd1a8b812d7e53f.md) / [证据3](evidence/supplement-6c7a8faf3f80b86a.md) / [证据4](evidence/supplement-5b5e7416d677e3a4.md) |
| [links/prince213.top.yml](../../links/prince213.top.yml)<br>https://prince213.top/ | include `` | 个人首页下有独立 Blog 栏目，补抓透明代理配置的作者实践正文。 | [证据1](evidence/b534a8f92eab4b4e.md) / [证据2](evidence/detail-04cd7e4dffaf3d6e.md) / [证据3](evidence/supplement-b2140f98bad5dd71.md) |
| [links/blog.zuoye.win.yml](../../links/blog.zuoye.win.yml)<br>https://blog.zuoye.win/ | include `` | 个人 Linux/Proton 实践，已抓取游戏修改器使用过程正文。 | [证据1](evidence/20da1083f221ee04.md) / [证据2](evidence/detail-346dcae90c6108e7.md) |
| [links/greyhathacker.net.yml](../../links/greyhathacker.net.yml)<br>https://greyhathacker.net/ | include `` | 作者独立漏洞研究与协调披露叙述，已抓取带 ?p=1041 的永久链接。 | [证据1](evidence/9fb2e0cc5a351602.md) / [证据2](evidence/supplement-e926ac7f5322875f.md) |
| [links/www.takagisan.top.yml](../../links/www.takagisan.top.yml)<br>https://www.takagisan.top/ | include `` | 个人博客保留历史原创文章，迁移/停更提示本身不构成排除。 | [证据1](evidence/02a94ec2c402c54f.md) / [证据2](evidence/detail-b0dbdfcb8108e490.md) |
| [links/jiewei.xyz.yml](../../links/jiewei.xyz.yml)<br>https://jiewei.xyz/ | include `` | Besides maths 独立索引下有 Dashes and hyphens 原创说明及作者观点，具有独立永久链接。 | [证据1](evidence/7705effbfd27a0d4.md) / [证据2](evidence/detail-4f9f1a60efb826ac.md) / [证据3](evidence/supplement-98da2404b4790efb.md) / [证据4](evidence/supplement-25fd36c9647fef6a.md) |
| [links/seaeye.cn.yml](../../links/seaeye.cn.yml)<br>https://www.seaeye.cn/ | include `` | B1ue1nWh1te 署名比赛题目分析，已抓取独立 Writeup 正文。 | [证据1](evidence/1bc4734c6af34237.md) / [证据2](evidence/detail-96d34fca9586da15.md) |
| [links/tntxz.starsfire.top.yml](../../links/tntxz.starsfire.top.yml)<br>https://tntxz.starsfire.top/ | include `` | 个人 NAS、MC 服务器实践发布，有独立文章路由。 | [证据1](evidence/f9e5a8f4b618e720.md) / [证据2](evidence/detail-7ecc3416702ffa94.md) |
| [links/blog.timepas.cn.yml](../../links/blog.timepas.cn.yml)<br>https://blog.timepas.cn/ | include `` | 时流个人博客，存在自主建站及路由器实践记录。 | [证据1](evidence/9952321777015746.md) / [证据2](evidence/detail-9deec923def24abc.md) |
| [links/cwcu.com.cn.yml](../../links/cwcu.com.cn.yml)<br>https://cwcu.com.cn/ | unverified `unverifiable` | 主站抓取失败。 | [证据1](evidence/d89c3d15903fa719.md) |
| [links/arielsalminen.com.yml](../../links/arielsalminen.com.yml)<br>https://arielsalminen.com/ | include `` | 独立 Blog 栏目；补抓 On Freedom, Curiosity & Happiness 作者个人经历和价值观长文。 | [证据1](evidence/aedde74b6423773e.md) / [证据2](evidence/detail-66e544cb54a63d7e.md) / [证据3](evidence/supplement-ec4ffb6884c70e05.md) |
| [links/theparanoidtimes.org.yml](../../links/theparanoidtimes.org.yml)<br>https://theparanoidtimes.org/ | include `` | 独立博客索引及本人通过业余无线电执照考试的微日志永久链接，具有具体个人创作语境。 | [证据1](evidence/f80b63c54e4534d6.md) / [证据2](evidence/detail-fb2677982bce1425.md) / [证据3](evidence/supplement-d3a536ebda2326e5.md) / [证据4](evidence/supplement-363045e2e8280cb8.md) |
| [links/blog.imgb.space.yml](../../links/blog.imgb.space.yml)<br>https://blog.imgb.space/ | unverified `no-qualifying-post` | 当前主入口仅显示仿蓝屏玩笑/错误页面，没有博客索引或正文，暂无法确认是否临时状态。 | [证据1](evidence/2b84848420f56c08.md) |
| [links/blog.qsuu.cn.yml](../../links/blog.qsuu.cn.yml)<br>https://blog.qsuu.cn/ | include `` | 补抓飞牛OS安装PHP故障处理的作者署名正文；资源/广告不单独否定个人实践文章。 | [证据1](evidence/0cd2a02faf97b872.md) / [证据2](evidence/detail-fb85f853ddf7db26.md) / [证据3](evidence/supplement-5b5d009883d07973.md) |
| [links/fairysen.com.yml](../../links/fairysen.com.yml)<br>https://fairysen.com/ | include `` | 个人折腾、技术与日常索引，存在独立实践文章。 | [证据1](evidence/3f8c5293c205d912.md) / [证据2](evidence/detail-dbae47929fb5eb0d.md) |
| [links/b.storyo.cn.yml](../../links/b.storyo.cn.yml)<br>https://b.storyo.cn/ | unverified `unverifiable` | 主站访问失败，不能据此认定非博客。 | [证据1](evidence/bfde9c48a6dd923d.md) |
| [links/hugoblox.com.yml](../../links/hugoblox.com.yml)<br>https://hugoblox.com/ | exclude `framework-or-theme` | HugoBlox 建站框架/模板产品官网，模板、定价、文档与注册为核心功能。 | [证据1](evidence/e7a37b8092ade064.md) / [证据2](evidence/detail-2a8ef0b82e22b2a6.md) |
| [links/kaic.hidns.co.yml](../../links/kaic.hidns.co.yml)<br>https://kaic.hidns.co/ | exclude `tool-or-product-primary` | ProxyIP、Socks5/HTTP、DNS64/NAT64 检测工具集，无博客或博客聚合功能。 | [证据1](evidence/fb8112fec47e15a9.md) |
| [links/blog.kway.site.yml](../../links/blog.kway.site.yml)<br>https://blog.kway.site/ | include `` | 作者讲述自建博客系统重写经历，有独立永久链接与实质摘要。 | [证据1](evidence/5cfa11eb704979a4.md) / [证据2](evidence/detail-77035a6b12494142.md) |
| [links/auiou.com.yml](../../links/auiou.com.yml)<br>http://www.auiou.com/ | include `` | 王志勇署名个人博客，首页有实质开发经历及独立固定链接。 | [证据1](evidence/2871deb9b3404e26.md) / [证据2](evidence/detail-4e405e0eeb453af8.md) |
| [links/blog.imz.me.yml](../../links/blog.imz.me.yml)<br>https://blog.imz.me/ | include `` | Imz 个人文章索引中存在生活活动记录和自编工具实践。 | [证据1](evidence/d5941552909f2cb7.md) / [证据2](evidence/detail-c5d4fc026d9caae5.md) / [证据3](evidence/supplement-2b8b9c15b5eaabdf.md) |
| [links/blog.skykey.fun.yml](../../links/blog.skykey.fun.yml)<br>https://blog.skykey.fun/ | include `` | 个人 C++/Qt 面试经历及技术文章，About 和 Hello World 不作为准入正文。 | [证据1](evidence/f91f8ef5f9942e25.md) / [证据2](evidence/detail-ece7a8795353dedd.md) |
| [links/galgamer.moe.yml](../../links/galgamer.moe.yml)<br>https://galgamer.moe/ | include `` | 具名小型作者团队发布游戏评论与分析，非开放论坛；有独立正文路由。 | [证据1](evidence/59c567f106bf0f87.md) / [证据2](evidence/detail-1fec9b80f8bc0d6a.md) |
| [links/399s.com.yml](../../links/399s.com.yml)<br>https://399s.com/ | include `` | 个人生活日志与技术折腾索引，既有原创年度回顾也有独立文章 URL。 | [证据1](evidence/eceac5cc3f451a73.md) / [证据2](evidence/detail-e2dd8a024938172a.md) |
| [links/gmero.com.yml](../../links/gmero.com.yml)<br>https://www.gmero.com/ | include `` | Gmero 个人实践与观点索引，包含修复编译错误、账号遭遇等独立文章。 | [证据1](evidence/675739490280c86d.md) / [证据2](evidence/detail-64d257e0d7e7e98b.md) |
| [links/032.im.yml](../../links/032.im.yml)<br>https://032.im/ | include `` | 有 Hello World 占位，但同时存在原创旅行、手办和听音记录；不因占位文章误排整个博客。 | [证据1](evidence/c62c803f0d0efa19.md) / [证据2](evidence/detail-1c225c8dca33d144.md) / [证据3](evidence/supplement-82e29b9692a3c235.md) |
| [links/dereksivers.org.yml](../../links/dereksivers.org.yml)<br>https://www.dereksivers.org/ | unverified `no-qualifying-post` | 当前抓取只返回 Substack 订阅提示与作者介绍，未取得公开文章正文。 | [证据1](evidence/4ae6e66352b7a766.md) |
| [links/rutua.cn.yml](../../links/rutua.cn.yml)<br>https://www.rutua.cn/ | unverified `unverifiable` | 主站抓取失败。 | [证据1](evidence/617669d82237ce54.md) |
| [links/milu.ink.yml](../../links/milu.ink.yml)<br>https://milu.ink/ | include `` | 米露个人硬件/Linux 实践，具有作者经历、正文及独立文章 URL。 | [证据1](evidence/8b574f47a993455c.md) / [证据2](evidence/detail-e6fc5cecb3b30693.md) |
| [links/blog.gobyte.cn.yml](../../links/blog.gobyte.cn.yml)<br>https://blog.gobyte.cn/ | include `` | 山岚个人博客，主页有本人刷机故障与主题修改实践叙述及独立永久链接。 | [证据1](evidence/9ecbe0348ba1f779.md) / [证据2](evidence/detail-ec2f6e122935d1e5.md) |
| [links/faehnri.ch.yml](../../links/faehnri.ch.yml)<br>https://faehnri.ch/ | unverified `no-qualifying-post` | 存在个人文章索引，补查一个历史条目返回 Not Found；尚未取得合格实质正文。 | [证据1](evidence/8881dd5c216836cc.md) / [证据2](evidence/detail-2d53003d61aad585.md) / [证据3](evidence/supplement-b40f52afe23b438f.md) |
| [links/blog.lin-fun.com.yml](../../links/blog.lin-fun.com.yml)<br>https://blog.lin-fun.com/ | unverified `no-qualifying-post` | 当前入口为个人互动/寻人设定页面，博客链接指向 seiion.com；历史栏目尚需核实。 | [证据1](evidence/739c4ddba8469e46.md) |
| [links/amirokd.dpdns.org.yml](../../links/amirokd.dpdns.org.yml)<br>https://www.amirokd.dpdns.org/ | unverified `unverifiable` | Cloudflare HTTP 403 封锁页，无法审核内容。 | [证据1](evidence/1529dd7bcf006e03.md) |
| [links/www.xreak.top.yml](../../links/www.xreak.top.yml)<br>https://www.xreak.top/ | include `` | 补抓作者说说栏目及网站建设总结的长篇个人经历，首页ROM版本日志不代表全部内容。 | [证据1](evidence/677a37cdf4fab15a.md) / [证据2](evidence/detail-888bc436278f4bd3.md) / [证据3](evidence/supplement-b6798b2f2a285812.md) / [证据4](evidence/supplement-ccf93d7d13f49aae.md) |
| [links/thk.kanzae.net.yml](../../links/thk.kanzae.net.yml)<br>https://thk.kanzae.net/ | include `` | 主题发布之外仍有独立个人技术实践；补抓 .htaccess 优化正文，描述本人网站测试与改动。 | [证据1](evidence/63b50d5f93484713.md) / [证据2](evidence/detail-816cd03d658ac1ea.md) / [证据3](evidence/supplement-e178f9cca03ccaf6.md) / [证据4](evidence/supplement-6b61b35e398eabee.md) |
| [links/xun-cmd.github.io.yml](../../links/xun-cmd.github.io.yml)<br>https://xun-cmd.github.io/ | unverified `no-qualifying-post` | 有个人学习文章索引，待正文确认原创实践，不能仅以博客标题准入。 | [证据1](evidence/fb8e7aca502e7076.md) / [证据2](evidence/detail-3c210a13afeb26bc.md) |
| [links/louiezong.com.yml](../../links/louiezong.com.yml)<br>https://www.louiezong.com/ | exclude `portfolio-only` | 插画、动画与音乐作品集，当前入口及作品分类以展示为主，未发现带创作语境的独立博客发布。 | [证据1](evidence/360c9d9f993d6da2.md) / [证据2](evidence/detail-562ffef687406f65.md) |
| [links/acevs.com.yml](../../links/acevs.com.yml)<br>https://acevs.com/ | include `` | 个人生活文章索引，已抓取走路体验与本人生活叙述的独立正文。 | [证据1](evidence/efb4b3824b12f3ea.md) / [证据2](evidence/detail-cc5118708d2fbd95.md) |
| [links/blog.noah0932.top.yml](../../links/blog.noah0932.top.yml)<br>https://blog.noah0932.top/ | unverified `no-qualifying-post` | 存在个人博客文章和生活栏目，补抓为归档页，尚未确认合格正文。 | [证据1](evidence/e3cb61be3ca2c94a.md) / [证据2](evidence/detail-edfe60a81687d3e9.md) |
| [links/nuel.pw.yml](../../links/nuel.pw.yml)<br>https://nuel.pw/ | exclude `portfolio-only` | 当前域名是游戏和音乐作品展示，News 指向独立域名 nuel.news；当前入口未提供合格博客发布。 | [证据1](evidence/ae593668b0f59104.md) / [证据2](evidence/detail-486ec5d142d18502.md) |
| [links/caramiki.com.yml](../../links/caramiki.com.yml)<br>https://caramiki.com/ | exclude `portfolio-only` | 设计、插画、网页作品集与简历，未发现博客发布入口。 | [证据1](evidence/4d2ca14fa191bd43.md) / [证据2](evidence/detail-0daf1dc3cafa3bff.md) |
| [links/dcutting.com.yml](../../links/dcutting.com.yml)<br>https://dcutting.com/ | include `` | 独立 Writing 栏目与作者本地AI处理个人日记的实践、隐私观点长文。 | [证据1](evidence/4b56f8c619d183e9.md) / [证据2](evidence/detail-582955affb30699b.md) / [证据3](evidence/supplement-89ab8b06065eb945.md) |
| [links/pdp8.info.yml](../../links/pdp8.info.yml)<br>https://pdp8.info/ | unverified `no-qualifying-post` | 摄影/音乐/攀岩个人站，需验证媒体条目的独立永久链接与作者创作语境。 | [证据1](evidence/5269a76f4f198bc7.md) / [证据2](evidence/detail-bc05cb4c82797995.md) / [证据3](evidence/supplement-c8bd48f0a4b2c097.md) |
| [links/blog.zhipro.com.yml](../../links/blog.zhipro.com.yml)<br>https://blog.zhipro.com/ | unverified `non-original-content` | 工具和消费技巧文章索引存在；作者归属及原创发布证据尚不充分，不能凭通用教程标题判定。 | [证据1](evidence/87a6f92b10bfb97e.md) |
| [links/www.the5fire.com.yml](../../links/www.the5fire.com.yml)<br>https://www.the5fire.com/ | unverified `no-qualifying-post` | 个人文章索引及实践摘要清晰；本轮详情为图书勘误，不用它替代合格个人博文证据。 | [证据1](evidence/ecd4eab3535a079f.md) / [证据2](evidence/detail-56cefc63e3b1bbbd.md) |
| [links/blog.nepakina.cn.yml](../../links/blog.nepakina.cn.yml)<br>https://blog.nepakina.cn/ | unverified `no-qualifying-post` | 个人算法学习栏目及完整正文可读，作者原创贡献与课程材料边界仍需复核。 | [证据1](evidence/efbc8668a14f2478.md) / [证据2](evidence/detail-f280ec5c91f6c4d5.md) |
| [links/coderxi.com.yml](../../links/coderxi.com.yml)<br>https://coderxi.com/ | unverified `non-original-content` | 本轮详情明确称转载教程；首页另有自建博客实践线索，尚需补验其原文，不据单篇转载排整个站。 | [证据1](evidence/6fd5b8a7d307cc1a.md) / [证据2](evidence/detail-dc7a6db84ad78e59.md) |
| [links/ikk.me.yml](../../links/ikk.me.yml)<br>https://ikk.me/ | exclude `homepage-only` | 当前是个人服务入口，Blog 按钮链接 kk.sb；另域博客合格与当前主页是否合格分别处理。 | [证据1](evidence/53fc4162bae66d0b.md) |
| [links/yihui.org.yml](../../links/yihui.org.yml)<br>https://yihui.org/ | include `` | 独立中英文博客栏目；补抓作者虚构书信/录歌经历实质长文，非仅学术主页。 | [证据1](evidence/2b9ddbed294d5f8f.md) / [证据2](evidence/detail-807bf28493512ed5.md) / [证据3](evidence/supplement-119c07553a06e096.md) / [证据4](evidence/supplement-0433a1c816ab3d1f.md) |
| [links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml](../../links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml)<br>https://diyibailingyici.chuangdangjianghudewumingyouxia.cn/ | unverified `no-qualifying-post` | 个人站首页主要工具版本发布，版本日志本身不算合格博文；需确认其他栏目正文。 | [证据1](evidence/d4c43fd64bbc3d60.md) / [证据2](evidence/detail-d8f71234bd3a039c.md) |
| [links/blog.hinswu.top.yml](../../links/blog.hinswu.top.yml)<br>https://blog.hinswu.top/ | unverified `no-qualifying-post` | 两篇软件介绍/部署文有独立路由，尚需确认实质原创实践与内容主要用途。 | [证据1](evidence/3f36dcb7dad87653.md) / [证据2](evidence/detail-a3b17dcd2ca8300e.md) |
| [links/gxroast.com.yml](../../links/gxroast.com.yml)<br>https://gxroast.com/ | unverified `no-qualifying-post` | 存在博客菜单与随笔入口，当前抓取主要是页面控件，尚未取得合格正文。 | [证据1](evidence/f04bcb04fa788fb0.md) / [证据2](evidence/detail-482e843352e1edd3.md) / [证据3](evidence/supplement-0205a96ecffd7ba3.md) |
| [links/blog.xlrt.top.yml](../../links/blog.xlrt.top.yml)<br>https://blog.xlrt.top/ | include `` | 作者原创小说独立条目及正文已抓取，创作上下文和公开索引明确。 | [证据1](evidence/aeb3480330ed4a78.md) / [证据2](evidence/detail-5946951f6cf25668.md) |
| [links/gahing.top.yml](../../links/gahing.top.yml)<br>https://www.gahing.top/ | include `` | 独立年度总结，具体叙述本人工作、育儿与生活经历；文档框架不构成排除。 | [证据1](evidence/06986a93331f09f6.md) / [证据2](evidence/detail-5c8b35f04b7c376c.md) |
| [links/小蔡.tw.yml](../../links/小蔡.tw.yml)<br>https://小蔡.tw/ | unverified `no-qualifying-post` | 个人经历主页具有文章列表与赛事记录入口；自动详情选中证书图片，尚未确认公开博文正文。 | [证据1](evidence/521d920b2e3a2064.md) / [证据2](evidence/detail-a7f2ed8623eadb1d.md) |
| [links/yuan1182.org.yml](../../links/yuan1182.org.yml)<br>https://yuan1182.org/ | unverified `unverifiable` | Cloudflare Tunnel 1033 错误，未取得站点正文。 | [证据1](evidence/face8b24746a0b2b.md) |
| [links/pcp.moe.yml](../../links/pcp.moe.yml)<br>https://pcp.moe/ | unverified `no-qualifying-post` | Blog 栏目存在，详情为 About 个人简介，不作为合格博文证据。 | [证据1](evidence/6057cd9a8f1cebe2.md) / [证据2](evidence/detail-bdacdc29d81bf580.md) |
| [links/blog.moyanjdc.top.yml](../../links/blog.moyanjdc.top.yml)<br>https://blog.moyanjdc.top/ | unverified `no-qualifying-post` | 个人技术与梦境文章索引；详情选中友链页，尚未取得原文确认。 | [证据1](evidence/9fc954654c27384f.md) / [证据2](evidence/detail-43e50180e2299b3a.md) |
| [links/pirogue.org.yml](../../links/pirogue.org.yml)<br>https://pirogue.org/ | include `` | 个人安全研发博客，已抓取越权扫描器设计选择、研发过程和经验长文。 | [证据1](evidence/638d250b3cb0f690.md) / [证据2](evidence/detail-8702b06d3ba02a82.md) |
| [links/mcenahle.cn.yml](../../links/mcenahle.cn.yml)<br>https://mcenahle.cn/ | unverified `no-qualifying-post` | 个人成长/工具/规范与迁移公告页面，博客另在 blog.mcenahle.org.cn；当前入口尚无合格博文证据。 | [证据1](evidence/0a5002c0004cdbdc.md) / [证据2](evidence/detail-e25ee18847ffdd10.md) |
| [links/everains.com.yml](../../links/everains.com.yml)<br>https://www.everains.com/ | include `` | 本人用AI自制主题的过程、取舍和体验，非模板说明或自动生成材料。 | [证据1](evidence/54a754a3cbb1639f.md) / [证据2](evidence/detail-17a883a2597c7c84.md) |
| [links/lo-li.cn.yml](../../links/lo-li.cn.yml)<br>https://lo-li.cn/ | unverified `no-qualifying-post` | 个人索引可见近况与技术文章，本轮详情是软件项目改动说明，仍需核实合格生活/实践博文。 | [证据1](evidence/c06c52eb9a7523ba.md) / [证据2](evidence/detail-f30939bb0a4675d9.md) |
| [links/blog.dreeam.me.yml](../../links/blog.dreeam.me.yml)<br>https://blog.dreeam.me/ | include `` | Dreeam 署名个人比赛/靶场分析，有公开索引与实质独立正文。 | [证据1](evidence/11923b37aa56111f.md) / [证据2](evidence/detail-f02c13abe64ce19b.md) |
| [links/www.91biu.work.yml](../../links/www.91biu.work.yml)<br>https://www.91biu.work/ | unverified `non-original-content` | 本轮详情为影视资源站介绍；大量索引不证明原创，需查至少一篇个人原创内容。 | [证据1](evidence/85fcfd15c9ba98ed.md) / [证据2](evidence/detail-c512739d690f6a3b.md) |
| [links/blog.tuep.cn.yml](../../links/blog.tuep.cn.yml)<br>https://blog.tuep.cn/ | unverified `no-qualifying-post` | 作者个人实践摘要可见，详情为月份归档；不将 Q&A 或mod链接清单直接计为原创博文。 | [证据1](evidence/b64663c615b38c7f.md) / [证据2](evidence/detail-583248cf8780a2f1.md) |
| [links/blog.zoomquiet.io.yml](../../links/blog.zoomquiet.io.yml)<br>https://blog.zoomquiet.io/ | unverified `no-qualifying-post` | 个人文章索引存在，本轮详情为归档，部分条目为翻译，需确认独立原创正文。 | [证据1](evidence/322ca83f0e8b60fe.md) / [证据2](evidence/detail-eaf8e8625259f7fc.md) |
| [links/www.wolfhime.com.yml](../../links/www.wolfhime.com.yml)<br>https://www.wolfhime.com/ | unverified `no-qualifying-post` | 原创世界观/角色设定创作站，有独立链接；尚需核实是否符合媒体博客条目及创作语境要求，不能因题材排除。 | [证据1](evidence/1638306bf45b8c2f.md) |
| [links/imcxx.com.yml](../../links/imcxx.com.yml)<br>https://www.imcxx.com/ | unverified `no-qualifying-post` | 公开配置笔记和实质正文可读，但作者原创发布与手册/知识库边界尚需核实。 | [证据1](evidence/d2400a4339feac63.md) / [证据2](evidence/detail-031ef9eb9f9cb94b.md) |

## 全部148个目标判定

| 目标 / 来源YAML | 判断 | 原因 | 证据 |
| --- | --- | --- | --- |
| https://blog.alswl.com/<br>[links/en.blog.alswl.com.yml](../../links/en.blog.alswl.com.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/63e54880a1ff6db3.md) / [证据2](evidence/detail-be0d67bd1374e6e8.md) |
| https://www.52share.online/<br>[links/542869246.github.io.yml](../../links/542869246.github.io.yml) | exclude `non-original-content` | 主页为课程/电子书下载集合；所查详情明确网络收集资源并导向网盘，未提供作者原创正文，独立个人博客另在 me.obey.fun。 | [证据1](evidence/fb56272bd3e45dd2.md) / [证据2](evidence/detail-bd4e446373657be9.md) |
| https://blog.cuteleaf.cn<br>[links/blog.diudiudevil.cn.yml](../../links/blog.diudiudevil.cn.yml)、[links/blog.hyosakura.com.yml](../../links/blog.hyosakura.com.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/f006b20de0168384.md) / [证据2](evidence/detail-574132f3c6586d8b.md) |
| https://techaro.lol<br>[links/blog.closure.cc.yml](../../links/blog.closure.cc.yml) | exclude `corporate-or-institutional` | 企业安全软件、AI 咨询与定制开发服务官网，主营产品/服务销售。 | [证据1](evidence/0cff05b7cdd575c6.md) / [证据2](evidence/detail-fc170540210c742f.md) |
| https://asain.icu<br>[links/iquegui.com.yml](../../links/iquegui.com.yml) | unverified `unverifiable` | 跳转 channelpl.com 重定向加载页，未获得可审核内容。 | [证据1](evidence/0e52f47195e5a45e.md) |
| https://infernity.top/<br>[links/xiaofuc.github.io.yml](../../links/xiaofuc.github.io.yml) | unverified `non-original-content` | 最新文章标注部分 AI 生成，存在其他技术笔记，须补查作者自己的实践正文后决定。 | [证据1](evidence/b8fc673d8173b4a7.md) / [证据2](evidence/detail-6a1a14398f82bc0f.md) |
| https://masalmon.eu/<br>[links/fenguoerbian.netlify.app.yml](../../links/fenguoerbian.netlify.app.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/7fc379f41a545f10.md) / [证据2](evidence/detail-dae5ec2dafdcddab.md) |
| https://matrix.to/#/@prince213:matrix.org<br>[links/prince213.top.yml](../../links/prince213.top.yml) | exclude `social-profile` | URL 明确为 Matrix 用户联系方式/聊天跳转链接；本轮抓取失败，排除依据是入口功能而非访问失败。 | [证据1](evidence/df95ec4077051ed0.md) |
| https://mocong.dev/<br>[links/blog.zuoye.win.yml](../../links/blog.zuoye.win.yml) | unverified `non-original-content` | 存在文章索引，但部分文章明确标注模型生成，需核实至少一篇作者原创内容。 | [证据1](evidence/e6fb2c9a01d915da.md) / [证据2](evidence/detail-d8fa404496d7668a.md) |
| http://dokan-dev.github.io/<br>[links/greyhathacker.net.yml](../../links/greyhathacker.net.yml) | exclude `tool-or-product-primary` | Dokan 文件系统开发库项目官网，下载、API 文档及支持为主要功能。 | [证据1](evidence/607325b163f14386.md) / [证据2](evidence/detail-e8f0f2a20a3c4d20.md) |
| https://misakishiki.site/<br>[links/www.takagisan.top.yml](../../links/www.takagisan.top.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/8332b323196d9b89.md) / [证据2](evidence/detail-470a46c03b02a4ad.md) |
| https://forkinganddividing.com<br>[links/jiewei.xyz.yml](../../links/jiewei.xyz.yml) | exclude `knowledge-base-only` | 数学理论关系图、性质定义与参考文献，属学术知识工具，非博客或跨博客发现机制。 | [证据1](evidence/fccbf42b17356fbf.md) / [证据2](evidence/detail-fa8e0de8f20a3e1d.md) |
| https://hitcxy.com/<br>[links/seaeye.cn.yml](../../links/seaeye.cn.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/b5b1573f815e04e3.md) / [证据2](evidence/detail-08c352f631fe1f7b.md) |
| https://hexo.anheyu.com/<br>[links/tntxz.starsfire.top.yml](../../links/tntxz.starsfire.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/6ab65d2148af5fb3.md) / [证据2](evidence/detail-197f0f3482738944.md) / [证据3](evidence/supplement-456c5b376a8f192a.md) |
| https://dyedd.cn/<br>[links/blog.timepas.cn.yml](../../links/blog.timepas.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/084b2b5ffb63dc93.md) / [证据2](evidence/detail-b8451785c2d9f6bd.md) |
| https://cwcu.cn<br>[links/cwcu.com.cn.yml](../../links/cwcu.com.cn.yml) | unverified `unverifiable` | 抓取失败。 | [证据1](evidence/f2736ea8ac14e151.md) |
| https://vueds.com<br>[links/arielsalminen.com.yml](../../links/arielsalminen.com.yml) | exclude `framework-or-theme` | Vue Design System 开发工具/设计系统项目介绍及文档，非博客。 | [证据1](evidence/78497e36b19d9e84.md) / [证据2](evidence/detail-fe2b5ab76edfacff.md) |
| https://www.igt.com/<br>[links/theparanoidtimes.org.yml](../../links/theparanoidtimes.org.yml) | exclude `corporate-or-institutional` | IGT 企业官网，游戏和金融技术产品、投资者、招聘为核心入口。 | [证据1](evidence/78028036bc54c4ef.md) / [证据2](evidence/detail-e031bc041ea7477b.md) |
| https://gb0.dev/<br>[links/blog.imgb.space.yml](../../links/blog.imgb.space.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/66e8374993f08d6a.md) / [证据2](evidence/detail-5316f5ff50f72f3c.md) |
| https://blog.zwying.com/<br>[links/blog.qsuu.cn.yml](../../links/blog.qsuu.cn.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/b708abd62e377ea5.md) / [证据2](evidence/detail-d0f3822d99abad37.md) |
| https://blog.zwying.com<br>[links/fairysen.com.yml](../../links/fairysen.com.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/d20e4d0d636e90cc.md) / [证据2](evidence/detail-d0f3822d99abad37.md) |
| https://ayakasuki.com/<br>[links/b.storyo.cn.yml](../../links/b.storyo.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/4fa5cc9fe340a5a7.md) / [证据2](evidence/detail-aa6e52a1b4461aa9.md) |
| https://ownable.dev<br>[links/hugoblox.com.yml](../../links/hugoblox.com.yml) | exclude `tool-or-product-primary` | AI 建站产品，注册、订阅定价、生成网站为核心功能。 | [证据1](evidence/93121d59f1ced03b.md) / [证据2](evidence/detail-da00da64791c2db0.md) |
| https://blog.811520.xyz<br>[links/kaic.hidns.co.yml](../../links/kaic.hidns.co.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/c3629694d1f47574.md) / [证据2](evidence/detail-f18aa15aef9c983b.md) |
| https://www.vergessen.top/<br>[links/blog.kway.site.yml](../../links/blog.kway.site.yml) | unverified `unverifiable` | 返回 nginx 404，无法审查原内容。 | [证据1](evidence/75ef70cbe8421587.md) |
| https://xiaoyou66.com<br>[links/blog.kway.site.yml](../../links/blog.kway.site.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/1054aed2a0448f76.md) / [证据2](evidence/detail-345c0e948a5a0a3e.md) |
| https://www.huhexian.com<br>[links/auiou.com.yml](../../links/auiou.com.yml) | unverified `unverifiable` | 抓取失败。 | [证据1](evidence/ca85b698b335b741.md) |
| http://0375.me<br>[links/auiou.com.yml](../../links/auiou.com.yml) | unverified `unverifiable` | 抓取失败。 | [证据1](evidence/623df283ec17623e.md) |
| https://blog.starsharbor.com/<br>[links/blog.imz.me.yml](../../links/blog.imz.me.yml)、[links/blog.moyanjdc.top.yml](../../links/blog.moyanjdc.top.yml) | unverified `unverifiable` | 页面含大量导航/加载界面，本轮尚未得到独立正文。 | [证据1](evidence/daa58d117d47eb9c.md) / [证据2](evidence/detail-8e739a5d1c4bcee2.md) |
| https://lisui.top/<br>[links/blog.imz.me.yml](../../links/blog.imz.me.yml) | unverified `unverifiable` | 抓取失败。 | [证据1](evidence/833d8e6fba403b60.md) |
| https://www.cryfeifei.cn<br>[links/blog.skykey.fun.yml](../../links/blog.skykey.fun.yml) | unverified `unverifiable` | 抓取失败。 | [证据1](evidence/61606b35926e3413.md) |
| https://theme-next.org/<br>[links/blog.skykey.fun.yml](../../links/blog.skykey.fun.yml) | exclude `framework-or-theme` | NexT 主题官网及版本发布日志，非个人原创博客。 | [证据1](evidence/5eccc84826bf6fd3.md) / [证据2](evidence/detail-b3e1859c32bd0da3.md) |
| https://blog.moeworld.tech/<br>[links/galgamer.moe.yml](../../links/galgamer.moe.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/195bf90e5ac1e95b.md) / [证据2](evidence/detail-6c059abba89a63c2.md) |
| https://shinnku.com/<br>[links/galgamer.moe.yml](../../links/galgamer.moe.yml) | exclude `generic-directory` | 明确为 Galgame 资源下载站，核心是游戏文件目录，非博客或跨博客聚合。 | [证据1](evidence/3521848b34859220.md) |
| http://LouisHan.com/<br>[links/399s.com.yml](../../links/399s.com.yml) | exclude `tool-or-product-primary` | 域名出售落地页，明确标价与购买入口，当前地址已不是博客。 | [证据1](evidence/96b9df12dc76283f.md) |
| http://www.ithmz.com<br>[links/399s.com.yml](../../links/399s.com.yml) | unverified `unverifiable` | 抓取失败。 | [证据1](evidence/92dcd84ec5a1b8ed.md) |
| https://oyiso.cn<br>[links/gmero.com.yml](../../links/gmero.com.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/e462e96099948a4b.md) / [证据2](evidence/detail-6c0bcd3c59c0544d.md) |
| https://roozen.top<br>[links/gmero.com.yml](../../links/gmero.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/5b71b6affc7aba09.md) / [证据2](evidence/detail-d7722d3c8c2cf8a8.md) |
| https://www.himiku.com/<br>[links/032.im.yml](../../links/032.im.yml) | unverified `unverifiable` | 返回 Anubis 反爬挑战页。 | [证据1](evidence/b0ebb00524ee5966.md) |
| https://blog.stardream.online/<br>[links/032.im.yml](../../links/032.im.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/2253df293af21d2e.md) / [证据2](evidence/detail-09b999a810641ca1.md) |
| https://sivers.com/<br>[links/dereksivers.org.yml](../../links/dereksivers.org.yml) | exclude `tool-or-product-primary` | Derek Sivers 图书商店，购买和订单入口为核心功能；作者身份不使商店成为博客。 | [证据1](evidence/2bb2a52ccbb19d28.md) |
| https://musicthoughts.com/<br>[links/dereksivers.org.yml](../../links/dereksivers.org.yml) | exclude `non-original-content` | 音乐相关名人语录收藏/随机展示，非作者原创发布或独立博客发现。 | [证据1](evidence/ed4680563f050980.md) / [证据2](evidence/detail-4ae5fea59a52291f.md) |
| https://coseroom.com/<br>[links/rutua.cn.yml](../../links/rutua.cn.yml) | exclude `forum-primary` | 注册制图片分享社区，圈子、图集、市集为核心功能，非小型作者博客或博客聚合。 | [证据1](evidence/bd6d6cc7f8a46b67.md) / [证据2](evidence/detail-248e652ea78256d0.md) |
| https://www.imydl.com/<br>[links/rutua.cn.yml](../../links/rutua.cn.yml) | unverified `unverifiable` | 返回 Cloudflare 526 源站证书错误。 | [证据1](evidence/fddf47171eb81de3.md) |
| https://wenpai.org/<br>[links/milu.ink.yml](../../links/milu.ink.yml) | exclude `framework-or-theme` | 开源发布平台的主题、插件、托管、文档与支持服务官网。 | [证据1](evidence/c7beae9391851ae6.md) / [证据2](evidence/detail-ab03202f1469cd22.md) |
| https://flyhigher.top/<br>[links/milu.ink.yml](../../links/milu.ink.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/145d539c9ce22a61.md) / [证据2](evidence/detail-a6e4dee7f5cd0d6c.md) |
| https://mrbird.cc<br>[links/blog.gobyte.cn.yml](../../links/blog.gobyte.cn.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/57e79a0ca050ef91.md) / [证据2](evidence/detail-32bfbdaa9e331f0e.md) |
| https://www.mmzsblog.cn/<br>[links/blog.gobyte.cn.yml](../../links/blog.gobyte.cn.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/0a92b111c980f0a2.md) / [证据2](evidence/detail-0b96d29263eec331.md) |
| https://sndtst.com/<br>[links/faehnri.ch.yml](../../links/faehnri.ch.yml) | exclude `tool-or-product-primary` | 当前为楼层探索互动游戏，非博客发布或跨博客聚合。 | [证据1](evidence/47bb3ddc797b2ff8.md) |
| https://jurassicsystems.com/<br>[links/faehnri.ch.yml](../../links/faehnri.ch.yml) | exclude `tool-or-product-primary` | 侏罗纪公园系统界面互动复刻/游戏，非博客。 | [证据1](evidence/e3aa31021db67e48.md) |
| https://furdevs.cn/<br>[links/blog.lin-fun.com.yml](../../links/blog.lin-fun.com.yml) | exclude `homepage-only` | 开发团体介绍与招募单页，无公开原创文章索引或独立发布内容。 | [证据1](evidence/104063eb26ea60f1.md) |
| https://furcw.net/<br>[links/blog.lin-fun.com.yml](../../links/blog.lin-fun.com.yml) | exclude `generic-directory` | 建设中的社群/画师/工作室信息目录及名片服务，不聚焦独立博客。 | [证据1](evidence/b19f85b29e273a06.md) |
| https://tiansoft.kodview.com/<br>[links/amirokd.dpdns.org.yml](../../links/amirokd.dpdns.org.yml) | unverified `unverifiable` | 返回页面不存在/网盘故障提示。 | [证据1](evidence/d59919a818fba7d9.md) |
| https://ys.mihoyo.com/<br>[links/amirokd.dpdns.org.yml](../../links/amirokd.dpdns.org.yml) | exclude `tool-or-product-primary` | 原神游戏产品官方网站，非个人博客或独立博客聚合。 | [证据1](evidence/a05c544f932c4003.md) |
| https://blog.imysen.com/<br>[links/www.xreak.top.yml](../../links/www.xreak.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/179cd03e37ad3cfb.md) / [证据2](evidence/detail-22b2fe9945804fde.md) |
| https://blog.crrashh.com/<br>[links/www.xreak.top.yml](../../links/www.xreak.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/bc16bc7d2c84b679.md) / [证据2](evidence/detail-aba0e8d4064e49b4.md) |
| https://again.lunaclear.com/<br>[links/thk.kanzae.net.yml](../../links/thk.kanzae.net.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/219934c83e7bb56f.md) / [证据2](evidence/detail-ee3de4d991bc5294.md) |
| https://www.cheshirex.com<br>[links/thk.kanzae.net.yml](../../links/thk.kanzae.net.yml) | unverified `tool-or-product-primary` | 存在大量 VPS 优惠、活动与推广入口，需进一步核实原创性和主要用途，暂不直接排除。 | [证据1](evidence/fea20e179910ef43.md) / [证据2](evidence/detail-e37a62d06297de4e.md) |
| https://iyheart.github.io/<br>[links/xun-cmd.github.io.yml](../../links/xun-cmd.github.io.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/4f6525307be1f19e.md) |
| https://czxsblog.netlify.app/<br>[links/xun-cmd.github.io.yml](../../links/xun-cmd.github.io.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/2fc9dabb5770b7be.md) / [证据2](evidence/detail-6d32b3c1512af124.md) |
| https://everydaylouie.itch.io<br>[links/louiezong.com.yml](../../links/louiezong.com.yml) | exclude `portfolio-only` | 游戏平台作者资料与游戏作品卡片，未取得博客发布栏目。 | [证据1](evidence/06e14952e813d0a1.md) / [证据2](evidence/detail-6aed52fdd277ea37.md) |
| https://louiezong.bandcamp.com/<br>[links/louiezong.com.yml](../../links/louiezong.com.yml) | exclude `tool-or-product-primary` | 音乐专辑销售/播放与作者账号页面，非博客或博客聚合入口。 | [证据1](evidence/5d02e23a24bcdca8.md) / [证据2](evidence/detail-b4151ac005419085.md) |
| https://h4ck.org.cn/<br>[links/acevs.com.yml](../../links/acevs.com.yml) | exclude `homepage-only` | 个人项目服务引导，博客位于另外域名。 | [证据1](evidence/1c852744044e5de7.md) / [证据2](evidence/detail-0042ba6c6e860f6a.md) |
| https://www.wordpace.com/<br>[links/acevs.com.yml](../../links/acevs.com.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/eb1d31eebe0d5d03.md) |
| https://blog.opennw.cn<br>[links/blog.noah0932.top.yml](../../links/blog.noah0932.top.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/1119420135818ab8.md) |
| https://blog.liushen.fun/<br>[links/blog.noah0932.top.yml](../../links/blog.noah0932.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/8442d38ef789e90e.md) / [证据2](evidence/detail-1e12f54cfd42477c.md) |
| http://nuel.news<br>[links/nuel.pw.yml](../../links/nuel.pw.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/87021939205a6c6c.md) / [证据2](evidence/supplement-d330feb38dc8be0d.md) |
| https://globoform.com<br>[links/nuel.pw.yml](../../links/nuel.pw.yml) | unverified `no-qualifying-post` | 浏览器互动游戏/漫画入口；尚需核实是否存在带创作语境的独立媒体博客条目。 | [证据1](evidence/2c46c2888377319a.md) / [证据2](evidence/detail-90a2bf21933ad7cc.md) |
| https://www.unabridgedsoftware.com/<br>[links/caramiki.com.yml](../../links/caramiki.com.yml) | exclude `corporate-or-institutional` | 软件开发公司服务、案例与获客官网。 | [证据1](evidence/76e00d19d9127826.md) / [证据2](evidence/detail-53a816ecb00eb8ad.md) |
| http://waterbeargames.com/<br>[links/caramiki.com.yml](../../links/caramiki.com.yml) | exclude `corporate-or-institutional` | 桌游公司产品与商店；公司 Blog 不属于个人或小型非机构博客。 | [证据1](evidence/7017356688d7d590.md) / [证据2](evidence/detail-5a8851b2d1664bb4.md) |
| https://figureitout.group<br>[links/dcutting.com.yml](../../links/dcutting.com.yml) | exclude `tool-or-product-primary` | 线下绘画活动、RSVP、收费参与和资源为主，未提供博客发布或博客聚合。 | [证据1](evidence/aea10e1ddbfef2f6.md) / [证据2](evidence/detail-2e2ae813d42724cf.md) |
| https://spal.club/<br>[links/dcutting.com.yml](../../links/dcutting.com.yml) | exclude `homepage-only` | 表演艺术爱好者社团介绍、FAQ、加入页，无独立原创发布索引。 | [证据1](evidence/d305d013806a8313.md) / [证据2](evidence/detail-84fff8d40a1eeae8.md) |
| https://fediring.net/<br>[links/pdp8.info.yml](../../links/pdp8.info.yml) | exclude `aggregator-not-blog-focused` | Fediverse 用户个人站 Webring，明确接受广泛个人站，未聚焦独立博客。 | [证据1](evidence/39a62bc5d0dfffdf.md) / [证据2](evidence/detail-2d5100f37291668a.md) |
| https://faircamp.webr.ing/<br>[links/pdp8.info.yml](../../links/pdp8.info.yml) | exclude `aggregator-not-blog-focused` | 独立音乐人/唱片展示站 Webring，以音乐作品发现为核心，非博客聚合。 | [证据1](evidence/50d112e50c8626d5.md) / [证据2](evidence/detail-6ece202bfebe54ea.md) |
| https://hejunjie.life<br>[links/blog.zhipro.com.yml](../../links/blog.zhipro.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/6b55cc18b359902d.md) / [证据2](evidence/detail-7b387583cf00a397.md) |
| https://blog.lusyoe.com<br>[links/blog.zhipro.com.yml](../../links/blog.zhipro.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/21735b3f8683cf8d.md) / [证据2](evidence/detail-471a8ff2eabe735c.md) |
| https://wcowin.work/<br>[links/blog.zhipro.com.yml](../../links/blog.zhipro.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/7cc1f30b06c88b72.md) |
| https://coolshell.cn/<br>[links/www.the5fire.com.yml](../../links/www.the5fire.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/35b9736327e69fc3.md) |
| https://www.xiaohui.com/<br>[links/www.the5fire.com.yml](../../links/www.the5fire.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/422a47e42f5ff34b.md) |
| https://v3u.cn/<br>[links/www.the5fire.com.yml](../../links/www.the5fire.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/8417f42a7acbfa08.md) |
| https://bruisesl.github.io/<br>[links/blog.nepakina.cn.yml](../../links/blog.nepakina.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/4a4b3d0d10148ba6.md) |
| https://3322898.cn<br>[links/blog.nepakina.cn.yml](../../links/blog.nepakina.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/1fe36c9c9da6ad1e.md) |
| https://www.vlo.cc/<br>[links/blog.nepakina.cn.yml](../../links/blog.nepakina.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/9d211618ec2e7030.md) |
| https://maxchang.me<br>[links/coderxi.com.yml](../../links/coderxi.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/b1c7c9d887e0b84e.md) |
| https://mocusez.site<br>[links/coderxi.com.yml](../../links/coderxi.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/4cd79d380801bb38.md) |
| https://blog.guole.fun/<br>[links/coderxi.com.yml](../../links/coderxi.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/f83163d07270d716.md) |
| https://kk.sb<br>[links/ikk.me.yml](../../links/ikk.me.yml) | include `` | 具名个人发布索引；已抓取独立文章正文，包含作者观点、实践或创作过程。 | [证据1](evidence/04bdd03022e54eef.md) |
| https://bangumi.fun<br>[links/ikk.me.yml](../../links/ikk.me.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/9f6b3f568523a731.md) |
| https://apps.kookxiang.cloud<br>[links/ikk.me.yml](../../links/ikk.me.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/83a9822ecaf7ddf1.md) |
| https://www.dicook.org<br>[links/yihui.org.yml](../../links/yihui.org.yml) | include `` | 学者个人站拥有独立 Blog 栏目；补抓 Di Cook 署名学术侵权亲历长文，不能因职业为教授就当学校官网。 | [证据1](evidence/99435925e65aab47.md) / [证据2](evidence/supplement-463506a05e15c23a.md) / [证据3](evidence/supplement-7b6847cf485df31c.md) |
| https://heike.github.io<br>[links/yihui.org.yml](../../links/yihui.org.yml) | exclude `homepage-only` | 学术个人简介、论文、教学、学生及软件页，无独立博客发布栏目。 | [证据1](evidence/5ac85eb9d18928ff.md) / [证据2](evidence/supplement-c9e47eea0c4fcfc5.md) |
| https://cosx.org<br>[links/yihui.org.yml](../../links/yihui.org.yml) | unverified `unverifiable` | 统计编辑出版与大型社区并存，原创署名文章可见；是否符合小型非机构团队主体范围尚需核实，不能仅因附属论坛排除。 | [证据1](evidence/b4e44f1f1d2abaa1.md) |
| https://kpi.xlog.app/<br>[links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml](../../links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/f243e09e6dbb7499.md) |
| https://sumiler.com/<br>[links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml](../../links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/182aa87365ab0d2b.md) |
| https://moshanghua.net<br>[links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml](../../links/diyibailingyici.chuangdangjianghudewumingyouxia.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/69ca3731a33de4a4.md) |
| https://www.aobp.cn<br>[links/blog.hinswu.top.yml](../../links/blog.hinswu.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/f82fd96bc2f3cfc8.md) |
| https://chuzoux.top/<br>[links/blog.hinswu.top.yml](../../links/blog.hinswu.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/3d98753cd42e34f7.md) |
| https://blog.07210700.xyz<br>[links/blog.hinswu.top.yml](../../links/blog.hinswu.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/cf4fb49963f506a3.md) |
| https://blog.xiaoxiao520.com/<br>[links/gxroast.com.yml](../../links/gxroast.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/fb199a37dbca3353.md) |
| https://1995.yun/<br>[links/gxroast.com.yml](../../links/gxroast.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/ccfcd868cf260fad.md) |
| https://ysc1997.top/<br>[links/gxroast.com.yml](../../links/gxroast.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/0318366efb3457f6.md) |
| https://blog.ltya.top/<br>[links/blog.xlrt.top.yml](../../links/blog.xlrt.top.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/c461210839c75ed0.md) |
| http://blog.xcnya.cn/<br>[links/blog.xlrt.top.yml](../../links/blog.xlrt.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/0da03cd9a64047c6.md) |
| https://jiuliu.top/<br>[links/blog.xlrt.top.yml](../../links/blog.xlrt.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/91b54c29399488ac.md) |
| https://schaepher.github.io/<br>[links/gahing.top.yml](../../links/gahing.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/edac9a6f596e839b.md) |
| https://chuchencheng.com/<br>[links/gahing.top.yml](../../links/gahing.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/c69d23d03dd6d77f.md) |
| https://xugaoyi.com/<br>[links/gahing.top.yml](../../links/gahing.top.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/5681d331fc6e2add.md) |
| https://stust.org<br>[links/小蔡.tw.yml](../../links/小蔡.tw.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/6a2dad523f97070a.md) |
| http://pettw.lionfree.net/#<br>[links/小蔡.tw.yml](../../links/小蔡.tw.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/188da8f58a14a79d.md) |
| https://pettw.online<br>[links/小蔡.tw.yml](../../links/小蔡.tw.yml) | exclude `tool-or-product-primary` | Minecraft 服务器服务官网，规则、赞助、下载与问题回报为核心。 | [证据1](evidence/8413b7b3bc9fd063.md) |
| https://kuriyona.com<br>[links/yuan1182.org.yml](../../links/yuan1182.org.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/141e03d472eebf98.md) |
| https://maao.cc<br>[links/yuan1182.org.yml](../../links/yuan1182.org.yml) | exclude `homepage-only` | 个人联系卡与服务/相册入口，无原创发布栏目。 | [证据1](evidence/6347a93c29cf3765.md) |
| https://launchpadx.top<br>[links/yuan1182.org.yml](../../links/yuan1182.org.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/31409d026a57bead.md) |
| https://pyonpyon.today/<br>[links/pcp.moe.yml](../../links/pcp.moe.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/af260736d33af59c.md) |
| https://www.tcdw.net/<br>[links/pcp.moe.yml](../../links/pcp.moe.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/968d6b93a034f5b8.md) |
| https://travel.moe/<br>[links/pcp.moe.yml](../../links/pcp.moe.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/011fc3d8f6d5a387.md) |
| https://www.woku.link/<br>[links/blog.moyanjdc.top.yml](../../links/blog.moyanjdc.top.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/a83ec64486de2a9b.md) |
| https://www.meowhead.cn/<br>[links/blog.moyanjdc.top.yml](../../links/blog.moyanjdc.top.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/a8bfe3d689eef3e4.md) |
| https://www.lshack.cn/<br>[links/pirogue.org.yml](../../links/pirogue.org.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/c55353b339e036cb.md) |
| https://www.0x002.com/<br>[links/pirogue.org.yml](../../links/pirogue.org.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/f2fd08d76a8d0d4c.md) |
| https://zgao.top/<br>[links/pirogue.org.yml](../../links/pirogue.org.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/5d126094643775f4.md) |
| https://dropwww.com<br>[links/mcenahle.cn.yml](../../links/mcenahle.cn.yml) | exclude `knowledge-base-only` | 去除 www 的说明、配置教程与SEO说明专题站，非博客发布或博客聚合。 | [证据1](evidence/49d6899cd3d3317d.md) |
| https://blog.mcenahle.org.cn<br>[links/mcenahle.cn.yml](../../links/mcenahle.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/f540e29b07c1e336.md) |
| https://www.david03.top/<br>[links/mcenahle.cn.yml](../../links/mcenahle.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/71a641bb19159ef9.md) |
| https://iwalyou.com/<br>[links/everains.com.yml](../../links/everains.com.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/4501465a50743499.md) |
| https://5ime.cn/<br>[links/everains.com.yml](../../links/everains.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/a40e9d4f8c7ccaad.md) |
| https://qing.su/<br>[links/everains.com.yml](../../links/everains.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/5dec992476d88b55.md) |
| https://www.natfrp.com/<br>[links/lo-li.cn.yml](../../links/lo-li.cn.yml) | exclude `tool-or-product-primary` | 内网穿透服务定价、注册与管理面板。 | [证据1](evidence/01cbd04e2753ff0f.md) |
| https://www.kasuganosora.cn/<br>[links/lo-li.cn.yml](../../links/lo-li.cn.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/02f3f3b53b5fdb56.md) |
| https://www.zerodream.net/<br>[links/lo-li.cn.yml](../../links/lo-li.cn.yml) | exclude `corporate-or-institutional` | 深圳市灵梦计算机技术有限公司官网，网站开发定制与技术服务。 | [证据1](evidence/333704e46e381cea.md) |
| https://ling.crashvibe.cn/<br>[links/blog.dreeam.me.yml](../../links/blog.dreeam.me.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/cb8283c2e80b1a3d.md) |
| https://blog.dsnb.cc/<br>[links/blog.dreeam.me.yml](../../links/blog.dreeam.me.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/46663752dc0032f4.md) |
| https://blog.na3alf6.cn/<br>[links/blog.dreeam.me.yml](../../links/blog.dreeam.me.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/7674f556a2c472f2.md) |
| https://feng.pub/<br>[links/www.91biu.work.yml](../../links/www.91biu.work.yml) | exclude `homepage-only` | 个人引导页，日志与小站均链接独立子域 blog.feng.pub。 | [证据1](evidence/a522c016c1d0339a.md) |
| https://hux6.com/<br>[links/www.91biu.work.yml](../../links/www.91biu.work.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/ca759c91d5e1cfad.md) |
| https://www.vvhan.com/<br>[links/www.91biu.work.yml](../../links/www.91biu.work.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/bf4be3ffe0b91945.md) |
| https://blog.6uu.us/<br>[links/blog.tuep.cn.yml](../../links/blog.tuep.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/d2cacca2812e69d6.md) |
| https://iy.ink/<br>[links/blog.tuep.cn.yml](../../links/blog.tuep.cn.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/7af013df4823503b.md) |
| https://dwd.moe/<br>[links/blog.tuep.cn.yml](../../links/blog.tuep.cn.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/5ab35e6268516e21.md) |
| https://weekly.rs.101.so/<br>[links/blog.zoomquiet.io.yml](../../links/blog.zoomquiet.io.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/0d913d09e2fd1422.md) |
| https://xhh.club/<br>[links/blog.zoomquiet.io.yml](../../links/blog.zoomquiet.io.yml) | unverified `aggregator-not-blog-focused` | FAQ明确传播群友独立博客、播客等，但当前流混合公司新闻与泛技术来源；核心范围及导向原文机制仍需专项复核。 | [证据1](evidence/2835f8c4ba782290.md) / [证据2](evidence/supplement-71ded7fefc750496.md) |
| http://www.inkscape.org/<br>[links/blog.zoomquiet.io.yml](../../links/blog.zoomquiet.io.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/3f88f70b4c7dfe33.md) |
| https://furryfandomclub.cn/<br>[links/www.wolfhime.com.yml](../../links/www.wolfhime.com.yml) | exclude `forum-primary` | 群聊/开放社群、活动、群记录和社区服务为核心，无独立博客发现机制。 | [证据1](evidence/4bfdc8f84f4ac823.md) |
| https://www.idove.games/<br>[links/www.wolfhime.com.yml](../../links/www.wolfhime.com.yml) | unverified `unverifiable` | 抓取未获得可审核正文。 | [证据1](evidence/fd8724108d9487d1.md) |
| https://not-hentai.com/<br>[links/www.wolfhime.com.yml](../../links/www.wolfhime.com.yml) | exclude `portfolio-only` | 图片收集图库，无作者创作语境、实质评论和独立博客条目。 | [证据1](evidence/5674e43e882be351.md) |
| https://www.onyi.net/<br>[links/imcxx.com.yml](../../links/imcxx.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/f44f857c15a4c549.md) |
| https://www.wnark.com<br>[links/imcxx.com.yml](../../links/imcxx.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/aa1b3bc469c87c53.md) |
| https://www.moerats.com/<br>[links/imcxx.com.yml](../../links/imcxx.com.yml) | unverified `no-qualifying-post` | 已检查入口；发布栏目/文章线索存在或页面用途未明，但本轮证据尚不足以确认至少一篇合格原创正文及主体范围。 | [证据1](evidence/632d1bbfdb534c64.md) |

## 文件说明

- `selected.json`：选择方法、100份原记录与所有待探测URL/来源角色。
- `results.json`：最终三态判断、原因码、来源和证据索引。
- `crawl-results.json`：初始探测元数据；`detail-results.json`、`supplement-results.json`：文章和复抓元数据。
- `evidence/`：每次探测的Markdown正文、JSON元数据与CLI日志。
- 临时执行脚本保留在 `/tmp/friendlinks-review100-*.py`，未恢复或调用已弃用审核脚本。
