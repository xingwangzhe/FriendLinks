# 100 份 YAML 审核后的清理与第二轮复查

检查日期：2026-10-02。根据已确认不合格的结果先清理，再对首轮的 132 个待定 URL 复查，最后全库反查主地址、别名及友链。首轮报告是清理前快照；本报告记录后续实际修改。

## 已完成的清理

| 项目 | 结果 |
| --- | ---: |
| 删除正式 YAML | 19 |
| 更新保留的 YAML | 471 |
| 从保留文件移除的友链引用 | 517 |
| 删除文件原先自带的友链引用 | 512 |
| 合计减少原始友链引用 | 1,029 |
| 正式 YAML / 逻辑站点 | 8,589 → 8,570 |
| 确认排除范围的剩余主地址、别名及友链 | 0 |

两批操作分别删除 14 / 5 份 YAML，并执行 460 / 60 次友链移除。首批的 3 条移除发生在第二批最终删除的文件内，因此最终保留文件中的移除数是 517，不能将两批操作数 520 当作最终保留文件的减少数。删除文件原始关系数 512 与保留文件减少数 517 分开计算，避免重复计数。

## 第二轮结论

对全部 132 个首轮待定 URL 重新使用 `crwl` 抓取入口，并检查 88 个详情 URL 和 30 个补充 URL。结果为 **34 个 include、8 个 exclude、90 个 unverified**。补充抓取覆盖发布栏目、原创正文、媒体条目和全库反查发现的 www 变体。成功标记仅表示爬虫执行结果；防爬、维护和 HTTP 错误页面仍按证据不足处理。

以下是新增确认不合格的 8 个原待定入口：

| 当前收录入口 | 原因码 | 确认事实 | 本轮证据 |
| --- | --- | --- | --- |
| [https://www.hnpvo.com/](https://www.hnpvo.com/) | `forum-primary` | 主站及 thread-12251-1-1.html 均显示志愿者社区、论坛分区、会员和回帖；Blog 是社区附属模块。 | [抓取正文](evidence/1be572c8c5a9f9e2.md) |
| [https://sgfox.cc/](https://sgfox.cc/) | `homepage-only` | 当前入口是社交账号和工具导航页；/china 是地图工具。www.sgfox.cc 另有博客，单独保留，不推断别名。 | [抓取正文](evidence/815e4a0166f7bb4d.md) |
| [https://blog.lin-fun.com/](https://blog.lin-fun.com/) | `homepage-only` | 当前为个人介绍/联系/友链入口；历史记录路由重定向回相同主页，正文指向另一个 seiion.com 博客入口，无本站独立博文。 | [抓取正文](evidence/739c4ddba8469e46.md) |
| [https://mcenahle.cn/](https://mcenahle.cn/) | `single-page-only` | 个人主页内的原创短文为弹窗正文，没有独立条目 URL；其他可见入口为简介、技能、代码规范与工具。独立 blog.mcenahle.org.cn 的原创文章另行保留。 | [抓取正文](evidence/0a5002c0004cdbdc.md) |
| [https://asain.icu](https://asain.icu) | `tool-or-product-primary` | 旧地址跳转到 FoundAI 浏览器搜索扩展安装推广页，核心为产品功能和 Add to Chrome。 | [抓取正文](evidence/0e52f47195e5a45e.md) |
| [http://0375.me](http://0375.me) | `tool-or-product-primary` | 跳转至 www.0375.me 的 8090 影视播放目录；已检查电影条目播放页，不是作者博客或独立博客目录。 | [抓取正文](evidence/623df283ec17623e.md) |
| [http://pettw.lionfree.net/#](http://pettw.lionfree.net/#) | `tool-or-product-primary` | Minecraft 服务器介绍、分流玩法、管理团队和联系表单；内容均为单页区块及模板演示，没有发布栏目。 | [抓取正文](evidence/188da8f58a14a79d.md) |
| [https://travel.moe/](https://travel.moe/) | `aggregator-not-blog-focused` | 核心为萌ICP备案成员站随机跳转；成员准入是一般网站质量与备案对接，未限定独立博客，属于泛站点导航。 | [抓取正文](evidence/011fc3d8f6d5a387.md) |

全库反查另发现并实际核实了 4 个不合格的 `www` 变体：`www.mcenahle.cn`、`www.h4ck.org.cn`、`www.pljzy.top`、`www.ikk.me`。其中 `www.pljzy.top` 还对应样本之外的一份正式 YAML，已一并删除。不同 hostname 并非自动视为同一站点。

**保留边界**：`sgfox.cc` 是个人导航，而 `www.sgfox.cc` 有独立博客内容；只清理前者。`mcenahle.cn` 的短文只有主页弹窗，另一个 `blog.mcenahle.org.cn` 的原创随笔已核实并保留。Redcha 入口迁移、PDP8 媒体发布形式、统计之都团队范围、小红花聚合定位等证据仍不足，保留待定；无法访问、防爬或迁移维护也没有直接当作排除依据。

34 个 include 只表示本轮取得了支持准入的证据，不保证其所有文章均原创，也不保证它记录的所有友链仍有效。90 个 unverified 保留现有文件或关系，未在本次删除任务中批量迁移；完整疑点逐项见 decisions.json。

## 反查与修改验证

1. 删除前读取 `links/` 的全部正式 YAML 和 `links/unverified/` 候选 YAML，检查每份记录的主地址、已声明别名及 `friends[]`。
2. 使用仓库现有身份解析模块确认已声明身份关系；URL 入口匹配忽略协议与片段，区分 hostname、端口，按路径段和查询范围处理。没有根据站名或相似域名推断同义。
3. 补查反查出现的 www 地址，逐个抓取后才扩大排除范围；`www.sgfox.cc` 保留。抓取详情链接不作为排除入口，避免把导航出去的其他站点误删。
4. 每批先生成文件与关系清单再执行删除；删除后再次扫描主地址、别名及友链，确认排除范围残留为 0。反查限于站点身份字段与友链字段，历史报告、描述和注释中的文字不算图关系残留。
5. 对全部 490 份 YAML 变更与 HEAD 做结构比对：19 份文件删除均在计划内；其余 471 份文件仅减少既定友链。名称、描述、颜色、入口、路由、别名及其他字段未改变，保留友链顺序与内容一致。

没有恢复 `outdated/` 审核工具。没有运行生产构建、力导布局或全量 BFS，没有提交或推送。

## 完整删除文件清单

| 文件 | 删除前主地址 | 原因来源 |
| --- | --- | --- |
| `links/caramiki.com.yml` | https://caramiki.com/ | 首轮已确认 |
| `links/fediring.net.yml` | https://fediring.net/ | 首轮已确认 |
| `links/firework.acuherb.xyz.yml` | https://firework.acuherb.xyz/ | 首轮已确认 |
| `links/furryfandomclub.cn.yml` | https://furryfandomclub.cn/ | 首轮已确认 |
| `links/h4ck.org.cn.yml` | https://h4ck.org.cn/ | 首轮已确认 |
| `links/hugoblox.com.yml` | https://hugoblox.com/ | 首轮已确认 |
| `links/ikk.me.yml` | https://ikk.me/ | 首轮已确认 |
| `links/kaic.hidns.co.yml` | https://kaic.hidns.co/ | 首轮已确认 |
| `links/louiezong.com.yml` | https://www.louiezong.com/ | 首轮已确认 |
| `links/musicthoughts.com.yml` | https://musicthoughts.com/ | 首轮已确认 |
| `links/nuel.pw.yml` | https://nuel.pw/ | 首轮已确认 |
| `links/pljzy.top.yml` | https://pljzy.top/ | 首轮已确认 |
| `links/www.nekro.top.yml` | https://www.nekro.top/ | 首轮已确认 |
| `links/zh-v2.d2l.ai.yml` | https://zh-v2.d2l.ai/ | 首轮已确认 |
| `links/blog.lin-fun.com.yml` | https://blog.lin-fun.com/ | 第二轮确认及反查 |
| `links/hnpvo.com.yml` | https://www.hnpvo.com/ | 第二轮确认及反查 |
| `links/mcenahle.cn.yml` | https://mcenahle.cn/ | 第二轮确认及反查 |
| `links/sgfox.cc.yml` | https://sgfox.cc/ | 第二轮确认及反查 |
| `links/www.pljzy.top.yml` | https://www.pljzy.top/ | 第二轮确认及反查 |

## 校验

- `bun run lint`：通过（oxlint + TypeScript）。
- `bun run validate`：通过，8,570 份 YAML、8,570 个逻辑站点，合并 0 份。
- [结构与关系比对](semantic-verification.json)：非友链字段变化 0、新增或改写友链 0、错误 0。
- [最终全库反查](reverse-verification.json)：剩余匹配引用 0。

## 明细与证据

- [第二轮全部 132 个结论](decisions.json)
- [反查补充地址结论](additional-decisions.json)
- [首批实际修改](first-cleanup.json)
- [第二批实际修改](second-cleanup.json)
- [数量汇总](summary.json)
- [第二轮入口抓取](crawl-results.json)、[详情抓取](detail-results.json)、[补充抓取](supplement-results.json)
- [首轮清理前审核报告](../README.md)

原始抓取正文在 evidence/。本轮是有界审核，不是全站穷尽爬取或全网原创性检索。
