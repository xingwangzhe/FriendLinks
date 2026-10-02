![Logo](https://gh-proxy.org/https://avatars.githubusercontent.com/u/219970759?v=4)
# HINS
若生活失去希望，不如来一场甜甜的恋爱
一个热爱技术、喜欢折腾的开发者。 专注于服务器运维，偶尔逗逗群友。 糖果甜甜的，喜欢~
[ ![HINS's Blog](https://gh-proxy.org/https://avatars.githubusercontent.com/u/219970759?v=4) ](https://blog.hinswu.top/ "HINS's Blog")
[ 首页 ](https://blog.hinswu.top/ "首页")
[ 归档 ](https://blog.hinswu.top/archives)[ 分类 ](https://blog.hinswu.top/categories)[ 标签 ](https://blog.hinswu.top/tags)
[ 项目集 ](https://blog.hinswu.top/projects "项目集")
[ 友链 ](https://blog.hinswu.top/links "友链")
[ 雅阁文储 ](https://www.hinswu.top)
[ ](https://blog.hinswu.top/console "登录")
搜索文章... `Ctrl K`
输入关键词开始搜索
![\[开源DNS管理\] HiDNS — 你的全能 DNS 聚合控制台](https://gcore.jsdelivr.net/gh/HINS-Files/blog.hinswu.top@master/2026/%E5%9B%BE%E7%89%87-0612212610.png)
# [开源DNS管理] HiDNS — 你的全能 DNS 聚合控制台
![](https://gcore.jsdelivr.net/gh/HINS-Files/blog.hinswu.top@master/2026/756eb951-cffd-4934-a00a-85b1c966245e-0412010127.png) HINS 2026-06-12 0 评论  49 阅读 
[ 默认分类 ](https://blog.hinswu.top/categories/default) [ 技术 ](https://blog.hinswu.top/tags/ji-shu)[ GitHub ](https://blog.hinswu.top/tags/github)[ docker ](https://blog.hinswu.top/tags/docker)
本文发布于 111 天前，请注意内容可能已过时
如果你管理着多个域名，分散在不同 DNS 服务商——阿里云、腾讯 DNSPod、Cloudflare、华为云、火山引擎、NameSilo、西部数码……每次添加解析都要登录各个后台来回切换，光是记住不同平台的 API 差异就够头疼。
![图片-0612212610.png](https://gcore.jsdelivr.net/gh/HINS-Files/blog.hinswu.top@master/2026/%E5%9B%BE%E7%89%87-0612212610.png)
**HiDNS** 正是为解决这个问题而生的开源 DNS 聚合管理平台。它将 22+ DNS 服务商统一接入到一个界面中，让你在一个地方完成所有域名的解析管理。目前已覆盖国内主流厂商（阿里云、腾讯 DNSPod、华为云、百度云、火山引擎、京东云、西部数码、青云、宝塔面板、阿里云 ESA、腾讯 EdgeOne、雨云、VPS8、DNS.LA）和国际厂商（Cloudflare、NameSilo、Spaceship、PowerDNS、DNSHE、Gcore、彩虹DNS聚合、DNSNeko），几乎一网打尽。
![图片-0612212811.png](https://gcore.jsdelivr.net/gh/HINS-Files/blog.hinswu.top@master/2026/%E5%9B%BE%E7%89%87-0612212811.png)
##  核心功能
**记录管理** — 支持 A、AAAA、CNAME、MX、TXT、SRV、CAA、NS、PTR 所有常见记录类型，一键增删改查、启用/停用。配合智能线路识别（电信/联通/移动/教育网等）、权重分配、TTL 配置，满足各种场景。Cloudflare 用户还可直接控制代理开关（橙色云）。
![图片-0612213107.png](https://gcore.jsdelivr.net/gh/HINS-Files/blog.hinswu.top@master/2026/%E5%9B%BE%E7%89%87-0612213107.png)
**WHOIS 续期监控** — 内置分层并行 WHOIS 查询引擎：RDAP → WHOIS (port 43) → HTTP API → 第三方接口，多路并发竞速，最快返回。支持子域名自动向上递归到主域名、注册商模式识别、域名到期日提取。配合自动续期调度（目前支持 DNSHE），每天 UTC 0:00 自动检查续期，到期前邮件提醒，防止域名意外过期。
**NS 监测与 DNS 污染检测** — 定时检查域名的 Nameserver 记录是否异常，并通过对比加密 DNS（DoH/DoT）与普通 DNS 的解析结果，智能判断是否遭遇 DNS 劫持/污染。发现异常时通过邮件实时告警，30 分钟冷却期避免轰炸。
**服务监控（三合一）** — 
- SSL 证书监控：检查证书链、颁发者、SAN 域名、剩余天数
- 端点监控：HTTP/HTTPS 可达性、响应时间、状态码、响应体校验
- DNS 故障转移：主记录宕机自动切换到备用 IP，支持 A/AAAA/CNAME 类型，健康检查支持 HTTP/TCP/Ping 三种模式
**Cloudflare Tunnel 集成** — 直接在 HiDNS 中列出、查看、修改、删除 Cloudflare Tunnel 配置，WebSocket 实时推送变更。
**CNAME Flattening** — 智能检测根域 CNAME 冲突（MX+CNAME、NS+CNAME），给出替代方案建议（ALIAS 记录、A/AAAA 替代）。Cloudflare、DNSHE 原生支持，DNSPod、阿里云等自动告警。
**多线路智能解析** — 内置各厂商线路数据库，自动验证线路有效性，推荐最优配置。
## 安全体系
**认证方式** — 普通密码登录（JWT 双层密钥 + 运行时轮换）、API Token（细粒度域/服务/时间权限）、WebAuthn/Passkey 无密码登录、TOTP 两步验证（支持全局强制开启）、OAuth2/OIDC 单点登录（兼容 Logto、Google、GitHub 等）。  

![图片-0612212353.png](https://gcore.jsdelivr.net/gh/HINS-Files/blog.hinswu.top@master/2026/%E5%9B%BE%E7%89%87-0612212353.png)
**安全策略** — 密码强度检测（zxcvbn）、登录失败锁定、会话超时、设备信任（免二次验证）、Force HTTPS、敏感信息脱敏。所有操作都有完整的审计日志，支持 CSV/JSON 导出。
##  集成能力
**API Token 系统** — 支持细粒度权限控制（可按域名、服务、时间范围限制），可无缝对接 DDNS-Go、acme.sh 等第三方工具。内置 `domain_match` 参数实现智能 FQDN 匹配。
**MCP 协议支持（Beta）** — 实现了 Model Context Protocol（模型上下文协议），AI 代理可以通过标准 MCP 接口直接操作 HiDNS：查询域名列表、创建/更新/删除 DNS 记录、查看 WHOIS 信息、管理故障转移规则、查询审计日志等。目前实现了 29 个 MCP 工具，支持 Streamable HTTP 和 SSE 两种传输方式，配有完整的 OAuth 授权流程。
**邮件模板系统** — 内置邮件服务商自动配置向导，生成 MX/SPF/DKIM 记录，检测记录冲突。
**通知渠道** — 支持 Email、Webhook、Telegram Bot、钉钉机器人四种通知方式，均支持重试和代理。
##  运维与部署
**数据库** — 自研四层数据库架构：驱动层（SQLite/MySQL/PostgreSQL）→ 抽象层 → 业务适配器层 → 声明式模式管理层（DSM）。DSM 可自动检测表结构差异并同步迁移，无需手动维护迁移脚本，支持运行时切换数据库。
**部署方式** — 
- Docker 一键启动`docker run -d -p 3001:3001 ghcr.io/hipm-tech/hidns:latest`
- Node.js 源码运行（pnpm dev）
- **SEA 单文件二进制** ：编译为独立 exe/可执行文件，无需 Node.js 环境，且支持安装为系统服务（Windows sc / Linux systemd / macOS launchd），自带自动更新机制（每 6 小时检查 GitHub Release）
**实时通信** — 内置 WebSocket，支持心跳保活、用户定向推送、服务监控检查结果实时推送、Tunnel 配置变更实时通知。
**代理支持** — 全链路 SOCKS5/HTTP 代理支持，DNS 查询、服务商 API 调用、通知发送均可走代理。
**多语言** — 中、英、日、西、法、德、俄、葡、韩、阿拉伯 共 11 种语言。
## 其他
- 团队协作：多用户角色（超级管理员/管理员/普通用户），团队共享域名管理
- CLI 工具：支持禁用 2FA、重置密码、重置数据库配置、列出用户等管理操作
- 完整的 Swagger API 文档`/api/docs`）
- Docker Compose + GitHub Actions 多平台 CI/CD
---
**项目信息：**
- GitHub：<https://github.com/HiPM-Tech/HiDNS> （开源 / GPL-3.0 / 免费）
- 演示截图与详细文档见仓库 README
- 一键 Docker`docker run -d -p 3001:3001 ghcr.io/hipm-tech/hidns:latest`
---
> 全文基于项目 v2.0.3 源码和文档整理。自部署平台，无需注册即可使用。无广告、无追踪、无云服务依赖，数据完全掌握在自己手中。
原创
## [开源DNS管理] HiDNS — 你的全能 DNS 聚合控制台
本文链接： [[开源DNS管理] HiDNS — 你的全能 DNS 聚合控制台](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang)
本文采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议，转载请注明出处。
C
分享：
复制成功
微信扫码分享
打开微信扫一扫，分享给好友
[技术](https://blog.hinswu.top/tags/ji-shu)[GitHub](https://blog.hinswu.top/tags/github)[docker](https://blog.hinswu.top/tags/docker)
上一篇 已经是最新文章啦~
[ 下一篇 Project N.E.K.O. Docker部署指导 ](https://blog.hinswu.top/archives/project-n.e.k.o.-dockerbu-shu-zhi-dao)
## 评论交流
欢迎留下你的想法
文章目录 0%
  1. [ 核心功能](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang#heading-0)
  2. [安全体系](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang#heading-1)
  3. [ 集成能力](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang#heading-2)
  4. [ 运维与部署](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang#heading-3)
  5. [其他](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang#heading-4)


关于作者
![HINS](https://gcore.jsdelivr.net/gh/HINS-Files/blog.hinswu.top@master/2026/756eb951-cffd-4934-a00a-85b1c966245e-0412010127.png)
#### [HINS ](https://blog.hinswu.top/about)
HINS的温馨小猫窝
2 文章
126 访问
[ 查看作者介绍 ](https://blog.hinswu.top/about "查看作者介绍")
相关推荐
  * [[开源DNS管理] HiDNS — 你的全能 DNS 聚合控制台](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang)
  * [Project N.E.K.O. Docker部署指导](https://blog.hinswu.top/archives/project-n.e.k.o.-dockerbu-shu-zhi-dao)


热门标签
[技术](https://blog.hinswu.top/tags/ji-shu)[GitHub](https://blog.hinswu.top/tags/github)[docker](https://blog.hinswu.top/tags/docker)[N.E.K.O](https://blog.hinswu.top/tags/n.e.k.o)[Halo](https://blog.hinswu.top/tags/halo)
评论
﻿ 
© 2026 [HINS's Blog](https://blog.hinswu.top) 版权所有 | 隐私协议 | 服务条款
[ ![ICP 备案图标](https://blog.hinswu.top/themes/theme-Serenity/assets/public/icpb.webp) 粤ICP备2026021063号-1 ](https://beian.miit.gov.cn/)
[ RSS 订阅 ](https://blog.hinswu.top/rss.xml) [ 本站由 ![EdgeOne](https://cloudcache.tencent-cloud.com/qcloud/app/resource/ac/favicon.ico) 提供支持 ](https://cloud.tencent.com/)
本站已运行 187天 7小时 15分钟 20秒 | 看板娘 赶来中...
×
正在加载内容... 
TOP
×
![](https://blog.hinswu.top/archives/wei-ming-ming-wen-zhang)
