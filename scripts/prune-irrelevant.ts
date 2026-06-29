/**
 * 友链无关条目剔除脚本
 *
 * 遍历 links/*.yml，剔除爬虫误抓的非友链条目（备案号、社交链接、站内页面等）。
 *
 * 用法: bun scripts/prune-irrelevant.ts
 */

import { readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";

// ─── 无关名称模式（大小写不敏感） ──────────────────────────────

const JUNK_NAME_PATTERNS: RegExp[] = [
  // 备案号
  /备案/i, /beian/i, /icp/i, /公网安备/i,
  // 技术框架（独立成条目，非友链）
  /^(Astro|Hexo|Valaxy|Halo|Vue(\.js)?|React|Next\.js|Nuxt|Hugo|WordPress|Typecho)$/i,
  /^(Butterfly|Volantis|Fluid|Clarity|Pure|Waline|Twikoo|Giscus)$/i,
  /^(Theme:?\s|主题:)/i,
  /^Markdown Guide$/i,
  // 部署/云服务
  /^(Vercel|Cloudflare|Netlify|EdgeOne)$/i,
  // 社交平台（独立名称）
  /^(QQ|QQ群\s*\d+|GitHub|Github|Gitee|GitLab|GitCode|Codeberg|Coding|SourceForge|Twitter|知乎|B站|哔哩哔哩|bilibili|BiliBili|BiliBiBi|网易云音乐)$/i,
  // 搜索引擎
  /^(百度|Bing|Google|搜狗|360搜索|必应)$/i,
  // 赞助
  /^(Sponsor|赞助|Donate)/i,
  // 联盟/导航
  /^开往$/i, /^Travelling$/i,
  // 订阅/RSS/评论
  /^(订阅|RSS|Feed)/i,
  /^(订阅本文评论|订阅本站评论)$/i,
  // 萌ICP
  /^萌ICP备/i,
  // 第三方山寨备案（XXX盟）
  /盟\d{6,}号|AIA盟|KUCAT盟|ICP备.*号|备案.*号/i,
  // 项目/操作类
  /^(项目主页|Create A Pull Request|Visit)$/i,
  // 本站自指
  /本站|本网站|本博客/i,
  // 友链页面自身
  /^(友链|友情链接|申请友链|Links?|申请链接)$/i,
  // 首页/关于
  /^(首页|关于|关于我|about|home)$/i,
  // 404/错误
  /^(404|页面未找到|Redirect|Redirecting)$/i,
  // Powered by / Theme by
  /^Theme by|^Powered by|^Proudly powered/i,
  // 服务类
  /图床|网盘|CDN|短链|短网址|云盘|存储/,
  // 监控/状态
  /监控|Monitor|Status|Uptime|状态/,
  // 加速/API
  /文件加速|加速|API接口|接口/,
  // 工具类
  /工具|助手|导航/,
  // 随机/开往（变体）
  /随机|开往项目/i,
  // CMS/建站系统
  /^(Halo|WordPress|Typecho|Z-Blog|Discuz|PHPWind|DedeCMS|帝国CMS)$/i,
  /WordPress|主题|插件|模板|主题商店/i,
  // 论坛/社区（非个人博客）
  /^(站长|论坛|社区|交流|BBS)/i,
  // 游戏/试玩
  /^(游戏|试玩|娱乐|赌博|博彩|棋牌|Slot|Casino)/i,
  // 游戏商城/平台
  /^(Steam|Epic|Origin|Uplay|Battle\.net|Xbox|PlayStation|Nintendo|任天堂|索尼|微软游戏)/i,
  // 商业服务
  /^(清除|甲醛|除甲醛|保洁|装修|维修|家政|开锁)/i,
  // 支付/收款
  /^(支付|收款|码支付|POS|刷卡|收银)/i,
  // 政治/意识形态
  /^(马克思主义|列宁|毛泽东|邓小平|共产党|社会主义|资本主义|意识形态|政治)/i,
  // 新闻/资讯
  /^(新闻|资讯|热点|快讯|头条|时政|要闻)/i,
  // 热榜/排行
  /热榜|热门|热搜|排行榜|榜单/i,
  // 文库/文档
  /^(文库|文档|资料库|知识库|百科|维基)/i,
  // 相册/音乐（站内功能页）
  /^(相册|音乐|歌单|专辑|画廊|摄影|图片)/i,
  // 绘画/画图
  /^(画图|绘画|画画|涂鸦|插画|绘图)/i,
  // 学术/论文
  /^(学术|论文|期刊|文献|知网|万方|维普|文库|专利|学报)/i,
  // 教程/指南
  /^(教程|指南|指引|入门|手册|文档|帮助|FAQ|CheatSheet|速查)/i,
  /^(掘金|51CTO|infoQ|InfoQ|CSDN|博客园|开源中国|OSChina|SegmentFault|SF\.gg|V2EX|Stack Overflow)/i,
  // 命令查询/镜像站
  /命令查询|命令大全|镜像|镜像站|Mirror/i,
  // 导航站点
  /^(导航|网址导航|导航站|分类导航|收藏夹|书签)/i,
  // 资源分享/下载站
  /^(资源|资源站|下载|分享站|破解|绿色版|汉化)/i,
  /源码|原码|程序源码|网站源码|系统源码/i,
  // 评测/体验
  /^(评测|测评|体验|软件评测|APP评测)/i,
  // 图鉴/年鉴/统计
  /图鉴|年鉴|统计|数据|大全|百科|图库/i,
  // 云服务/主机
  /^(云服务器|云主机|云服务|VPS|服务器|主机|域名|CDN|云存储|对象存储)/i,
  // 商业/公司
  /^(公司|印刷|广告|设计|装修|建筑|工程|劳务|派遣)/i,
  // 社区/论坛
  /^(社区|论坛|交流群|QQ群|微信群|广场|书苑|书库|LINUX\s*DO|Linuxcat|归档站|归档)/i,
  // 字体/设计资源
  /^(字体|商用字体|免费字体|字库|字體)/i,
  // 软件全家桶
  /^(全家桶|Adobe|软件合集|软件包)/i,
  // 简历/模板
  /^(简历|个人简历|简历模板|简历网)/i,
  // 视频/剪辑/手游
  /^(视频剪辑|剪辑|手游|游戏下载|游戏网|游戏攻略)/i,
  // 法律/协议
  /^(免责|声明|免责声明|免责申明|隐私|隐私协议|隐私政策|用户协议|服务协议|服务条款|TOS|ToS|CC协议|知识共享)/i,
  // 排名/统计
  /^(排名|排行榜|编程语言排名|TIOBE)/i,
  // 技术栈官方文档
  /^(Vue|React|Angular|Node\.?js|Python|Java|Go|Rust|Docker|Kubernetes)(\s|\d|\.)/i,
  // 营销/流量卡
  /^(流量卡|神卡|大流量|号卡|套餐|宽带|物联网卡)/i,
  // 学校/学生相关（门户、邮箱、校园系统等）
  /^(学生邮箱|学校|校园|门户|信息门户|校园网|国科大|华农|SEP系统|邮箱|电子邮件)$/i,
  // 更新/日志
  /^(更新日志|更新|日志|更新记录|Changelog)$/i,
  // 文档/框架声明
  /^(文档|博客框架|框架|框架版本)/i,
  // 视频/社交平台
  /^(抖音|Youtube|YouTube)$/i,
  // 购物/营销
  /^(微信红包|红包|封面|优惠|促销|购物|淘宝|天猫|京东|拼多多|闲鱼|转转|商城|店铺|商店|下单|购买)/i,
  // 死站/过期域名
  /^(站点已过期|域名出售|域名停放|域名过期|site is for sale|domain is parked|this domain|buy this domain|备案过期|网站已关闭|网站已停止)/i,
  // 借贷/金融
  /^(借款|贷款|借贷|金融|理财|投资|信用贷|网贷)/i,
  // 迷信/测试/算卦
  /^(姓名测试|算命|占卜|八字|风水|测名|起名|塔罗|面相)/i,
  // 内容农场（中文网、小说网等）
  /中文网|小说网|小说网|作文网/i,
];

// ─── 无关 URL 模式 ─────────────────────────────────────────────

const JUNK_URL_PATTERNS: RegExp[] = [
  /beian\./i,
  /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?|$)/i,
  /\/rss|\/feed|\/atom|rss\.xml|atom\.xml|\.xml$/i,
  // 项目仓库而非个人博客
  /github\.com\/(withastro|YunYouJun|walinejs)\//i,
  // mailto 协议
  /^mailto:/i,
];

// ─── 清理函数 ─────────────────────────────────────────────────

function isJunkEntry(f: { name: string; url: string }, siteUrl?: string): boolean {
  const name = (f.name || "").trim();
  const url = (f.url || "").trim();

  // ── URL 格式检查（最可靠，优先） ──────────────────────────

  // URL 双重协议
  if (url.includes("https:// https://") || url.includes("http:// http://")) return true;

  // 名称以 URL 开头（图片/文件链接被解析成了名称）
  if (/^https?:\/\//i.test(name) && /^https?:\/\//i.test(url)) return true;

  // URL 匹配无关模式（图片、rss、备案等）
  for (const p of JUNK_URL_PATTERNS) {
    if (p.test(url)) return true;
  }

  // ── 域名检查（次可靠） ────────────────────────────────────
  try {
    const hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();

    // 域名以 api 开头（接口服务，非博客）
    if (/^api[.-]/i.test(hostname)) return true;
    // 知名非博客服务子域名
    if (/^(cloud|img|cdn|static|assets|media|files?|dl|download|upload|git|status|monitor|nav|wiki|docs?|help|support|m|mobile|news|cmd|mirror|镜像|store|shop|buy|mall|book|print|job|career|draw|paint|design|photo|bbs|forum|社区|club|group)[.-]/i.test(hostname)) return true;

    // 知名非博客平台域名列表
    const nonBlogDomains = [
      "github.com", "gitee.com", "gitlab.com", "bitbucket.org",
      "coding.net", "gitcode.net", "codeberg.org",
      "gitea.io", "gitea.com", "sourceforge.net", "gitlab.cn", "oschina.net",
      "travellings.cn", "www.travellings.cn", "rss.travellings.cn", "rss-source.travellings.cn",
      "beian.miit.gov.cn", "beian.mps.gov.cn", "www.beian.gov.cn",
      "icp.gov.moe", "icp.gs", "travel.moe", "moicp.cn", "icp.cab", "icp.n3v.cn",
      "vercel.com", "netlify.app", "netlify.com", "cloudflare.com",
      "hexo.io", "butterfly.js.org",
      "zhihu.com", "www.zhihu.com",
      "bilibili.com", "space.bilibili.com", "www.bilibili.com",
      // 视频/社交平台
      "douyin.com", "www.douyin.com", "v.douyin.com",
      "youtube.com", "www.youtube.com", "m.youtube.com",
      "bilibili.com", "space.bilibili.com", "www.bilibili.com",
      "twitter.com", "x.com",
      "music.163.com",
      "guides.github.com",
      // 博客聚合/导航/圈子（非个人博客）
  /^(博客集市|博客中心|博客圈|博客集|博客志|博友圈|博友)/i,
      "boyouquan.com", "www.boyouquan.com",
      "blogsclub.org", "www.blogsclub.org",
      "blogplanet.cn", "www.blogplanet.cn",
      "blogscn.fun",
      "blog114.com",
      "boke.lu",
      "bokequan.cn",
      "blogtalk.org",
      "storeweb.cn",
      "haozhan.wang",
      "zhblogs.net", "www.zhblogs.net",
      "foreverblog.cn", "www.foreverblog.cn",
      "rmbk.cc", "www.rmbk.cc",
      "jiuchan.org", "hi.jiuchan.org",
      "bloginc.cn",
      "findblog.net", "www.findblog.net",
      "morerss.com",
      "dogerolls.com",
      "boringbay.com",
      // 博客平台（非独立个人网站）
      "cnblogs.com", "www.cnblogs.com",
      "csdn.net", "blog.csdn.net",
      // 搜索引擎
      "baidu.com", "www.baidu.com",
      "bing.com", "www.bing.com",
      "google.com", "www.google.com",
      // 政务/公共服务
      "12377.cn", "www.12377.cn",
      "12306.cn", "www.12306.cn",
      "12315.cn", "www.12315.cn",
      "halo.run",
      // 统计/分析
      "51.la", "v6.51.la",
      // 视频/社交平台
      "douyin.com", "www.douyin.com", "v.douyin.com",
      "youtube.com", "www.youtube.com",
      // 云服务商
      "aliyun.com", "www.aliyun.com",
      // 评测
      "appinn.com", "www.appinn.com",
      // 资源站
      "xhuama.cn", "www.xhuama.cn",
      // 山寨备案
      "ekucat.com", "icp.ekucat.com",
      "91yl.top", "fylm.91yl.top",
      // 图鉴/年鉴
      "678.tax", "www.678.tax",
      // 博客聚合
      "cnb.cool", "www.cnb.cool",
      "bokehub.com", "www.bokehub.com",
      "cloud.tencent.com",
      "huaweicloud.com", "www.huaweicloud.com",
      "aws.amazon.com",
      "azure.microsoft.com",
      "cloud.google.com",
      "vultr.com", "www.vultr.com",
      "digitalocean.com", "www.digitalocean.com",
      "linode.com", "www.linode.com",
      "rainyun.com", "www.rainyun.com",
      "jdcloud.com", "www.jdcloud.com",
      "cloud.baidu.com",
      "ucloud.cn", "www.ucloud.cn",
      "qingcloud.com", "www.qingcloud.com",
      "upyun.com", "www.upyun.com",
      "qiniu.com", "www.qiniu.com",
      // 购物/营销
      "youshop10.com", "k.youshop10.com",
      // 借贷/迷信
      "haokouzhi.cn", "www.haokouzhi.cn",
      "84263.com", "www.84263.com",
      // 非博客内容
      "spacexcode.com", "www.spacexcode.com",
      // 游戏/娱乐
      "ibb22.com", "www.ibb22.com",
      "pgg33.com", "www.pgg33.com",
      // 游戏商城/平台
      "steampowered.com", "store.steampowered.com",
      "steamcommunity.com", "www.steamcommunity.com",
      "epicgames.com", "www.epicgames.com",
      // 网上商城
      "taobao.com", "www.taobao.com",
      "tmall.com", "www.tmall.com",
      "jd.com", "www.jd.com",
      "pinduoduo.com", "www.pinduoduo.com",
      "linkwhisper.com", "www.linkwhisper.com",
      // Apple
      "apple.com", "www.apple.com", "apps.apple.com",
      // 商业服务
      "mzswpco.com", "www.mzswpco.com",
      // 论坛
      "4414.cn", "www.4414.cn",
      // 支付
      "ug95.com", "www.ug95.com",
      // 教程/文档
      "runoob.com", "www.runoob.com",
      "marxists.org", "www.marxists.org",
      "vuejs.org", "v2.cn.vuejs.org", "cn.vuejs.org",
      // 营销/流量卡
      "lxhaoka.cn", "www.lxhaoka.cn",
      // 镜像站
      "mirrors.163.com",
      "mirrors.ustc.edu.cn",
      // 排名
      "tiobe.com", "www.tiobe.com",
      // 资源/商店
      "simplehac.cn", "store.simplehac.cn",
      // 文库
      "wk21.com", "www.wk21.com",
      // 商业/社区/字体
      "bookbs.cn", "s.bookbs.cn",
      "144g.net", "www.144g.net",
      "123ziti.cn", "www.123ziti.cn",
      "yuque.com", "www.yuque.com",
      "teelcn.com", "www.teelcn.com",
      // 简历/视频/手游
      "gerenjianli.com", "www.gerenjianli.com",
      "lwzzlf.cn", "www.lwzzlf.cn",
      "163mu.com", "www.163mu.com",
      // 技术社区
      "juejin.cn", "www.juejin.cn",
      "51cto.com", "blog.51cto.com", "www.51cto.com",
      "infoq.com", "www.infoq.com",
      // 模型/代码托管
      "huggingface.co", "www.huggingface.co",
      // 学术/论文
      "cnki.net", "www.cnki.net",
      // 指南/文档
      "iyuan.ltd", "mcdocs.iyuan.ltd",
      // 论坛/社区
      "niege.app", "bbs.niege.app",
      "nicepub.top", "www.nicepub.top", "bbs.nicepub.top",
      "nies.live", "www.nies.live",
      "moa.moe", "www.moa.moe",
      "linuxcat.top", "www.linuxcat.top",
      // 死站
      "blog.sunguoqi.com",
      "wanfangdata.com", "www.wanfangdata.com",
      "cqvip.com", "www.cqvip.com",
      "arxiv.org", "www.arxiv.org",
      "researchgate.net", "www.researchgate.net",
      "academia.edu", "www.academia.edu",
      "semanticscholar.org", "www.semanticscholar.org",
      "dblp.org", "www.dblp.org",
      // 法律/协议
      "creativecommons.org", "www.creativecommons.org",
      // 社交/分享
      "facebook.com", "www.facebook.com",
      "reddit.com",
      "linkedin.com", "www.linkedin.com",
      "pinterest.com",
      "telegram.me", "t.me",
      "whatsapp.com", "api.whatsapp.com",
      "tumblr.com", "www.tumblr.com",
      "blogger.com", "www.blogger.com",
      "douban.com", "www.douban.com",
      "weibo.com", "service.weibo.com",
      "qq.com", "connect.qq.com",
      "qzone.qq.com",
    ];
    if (nonBlogDomains.some(d => hostname === d || hostname.endsWith("." + d))) return true;
    // .edu 域名
    if (hostname.endsWith(".edu") || hostname.endsWith(".edu.cn") || hostname.endsWith(".edu.tw") || hostname.endsWith(".edu.hk")) return true;
  } catch {}

  // 子路由检查：路径深度 >= 3 的视为具体文章/页面，非首页
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const path = u.pathname.replace(/\/$/, "");
    if (path.split("/").filter(Boolean).length >= 3) return true;
  } catch {}

  // IP 地址 URL
  if (/^https?:\/\/(\d{1,3}\.){3}\d{1,3}/.test(url)) return true;

  // 自引用：友链的域名与站点自身域名相同
  if (siteUrl && isSelfReference(url, siteUrl)) return true;

  // ── 名称检查（最不可靠，放最后） ──────────────────────────

  // 名称匹配无关模式
  for (const p of JUNK_NAME_PATTERNS) {
    if (p.test(name)) return true;
  }

  // 纯数字名称
  if (/^\d+$/.test(name)) return true;

  // 单字符名称（绝大多数是爬虫解析错误）
  if ([...name].length === 1) return true;

  return false;
}

function isSelfReference(url: string, siteUrl: string): boolean {
  try {
    const friendHost = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    const siteHost = new URL(siteUrl).hostname;
    // 去掉 www. 前缀
    const f = friendHost.replace(/^www\./, "");
    const s = siteHost.replace(/^www\./, "");

    // 完全相同
    if (f === s) return true;

    // 已知托管平台（github.io 等），完整 hostname 即为唯一标识
    const platforms = ["github.io", "pages.dev", "vercel.app", "netlify.app", "r2.dev"];
    const onPlatform = (h: string) => platforms.some(p => h === p || h.endsWith("." + p));

    // 提取注册域名（去掉第一级子域名）
    const regDomain = (h: string) => {
      if (onPlatform(h)) return h; // 托管平台用完整 hostname
      const parts = h.split(".");
      return parts.length > 2 ? parts.slice(1).join(".") : h;
    };

    // 如果注册域名相同 → 同属一个站点的不同子域名 → 自引用
    if (regDomain(f) === regDomain(s)) return true;

    return false;
  } catch {
    return false;
  }
}

function isHealthyEntry(f: { name: string; url: string }): boolean {
  const name = (f.name || "").trim();
  const url = (f.url || "").trim();
  if (!name || !url) return false;
  return true;
}

function deduplicateByHost(friends: any[]): { deduped: any[]; removed: number } {
  // 同一 hostname 只保留路径最短的那条（剔除子路由）
  const best = new Map<string, { entry: any; pathLen: number }>();
  const removed: any[] = [];
  for (const f of friends) {
    const url = (f.url || "").trim();
    try {
      const u = new URL(url.startsWith("http") ? url : `https://${url}`);
      const host = u.hostname.toLowerCase();
      const pathLen = u.pathname.replace(/\/$/, "").split("/").filter(Boolean).length;
      const existing = best.get(host);
      if (!existing || pathLen < existing.pathLen) {
        if (existing) removed.push(existing.entry);
        best.set(host, { entry: f, pathLen });
      } else {
        removed.push(f);
      }
    } catch {
      // URL 解析失败，保留原条目
    }
  }
  return { deduped: Array.from(best.values()).map(v => v.entry), removed: removed.length };
}

function deduplicate(friends: any[]): { deduped: any[]; removed: number } {
  const seen = new Set<string>();
  const deduped: any[] = [];
  let removed = 0;
  for (const f of friends) {
    const url = (f.url || "").trim().toLowerCase();
    if (url && seen.has(url)) {
      removed++;
      continue;
    }
    seen.add(url);
    deduped.push(f);
  }
  return { deduped, removed };
}

function cleanupFriends(friends: any[], siteUrl?: string): { cleaned: any[]; removed: number } {
  // 第一步：剔除无关条目
  const filtered = friends.filter((f) => {
    if (!f || typeof f !== "object") return false;
    if (!isHealthyEntry(f)) return false;
    if (isJunkEntry(f, siteUrl)) return false;
    return true;
  });

  const removedCount = friends.length - filtered.length;

  // 第二步：子路由去重（同一 hostname 只保留首页）
  const { deduped: hostDeduped, removed: hostRemoved } = deduplicateByHost(filtered);

  // 第三步：精确 URL 去重
  const { deduped, removed: dupRemoved } = deduplicate(hostDeduped);

  return { cleaned: deduped, removed: removedCount + hostRemoved + dupRemoved };
}

// ─── 主流程 ────────────────────────────────────────────────────

function main() {
  const dir = resolve("links");
  const files = readdirSync(dir).filter((f) => f.endsWith(".yml"));

  let totalRemoved = 0;
  let totalFiles = 0;
  let totalFilesChanged = 0;

  for (const file of files) {
    const filePath = resolve(dir, file);
    const text = readFileSync(filePath, "utf8");
    const obj = YAML.parse(text);
    if (!obj?.site) continue;

    const site = obj.site;
    if (!Array.isArray(site.friends)) continue;

    const before = site.friends.map((f: any) => `${f.name || ""}  ${f.url || ""}`);
    const { cleaned, removed } = cleanupFriends(site.friends, site.url);
    totalRemoved += removed;

    if (removed > 0) {
      const after = new Set(cleaned.map((f: any) => `${f.name || ""}  ${f.url || ""}`));
      const removedEntries = before.filter((e: string) => !after.has(e));
      console.log(`\n📄 ${file} 剔除 ${removed} 条:`);
      for (const e of removedEntries) {
        const [name, url] = [e.slice(0, e.lastIndexOf("  ")), e.slice(e.lastIndexOf("  ") + 2)];
        console.log(`   ❌ ${name.padEnd(30)} ${url}`);
      }
    }

    if (cleaned.length === 0) {
      // 友链全空 → 删除整个文件（无论是一开始就空还是刚被清空）
      try { unlinkSync(filePath); } catch {}
      if (removed > 0 || site.friends.length > 0) totalFilesChanged++;
    } else if (removed > 0) {
      site.friends = cleaned;
      const output = YAML.stringify(obj, {
        indent: 2,
        lineWidth: 0,
        defaultStringType: "QUOTE_SINGLE",
      });
      writeFileSync(filePath, output, "utf8");
      totalFilesChanged++;
    }

    totalFiles++;
  }

  console.log(`\n扫描文件: ${totalFiles}`);
  console.log(`修改文件: ${totalFilesChanged}`);
  console.log(`剔除条目: ${totalRemoved}`);
}

main();
