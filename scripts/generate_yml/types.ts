// Shared types and configuration constants
export type SeedEntry = {
  site: {
    name?: string;
    url: string;
    description?: string;
    friends?: { name: string; url: string }[];
  };
};

export type Anchor = { href: string; text: string };

export type PageMeta = { title?: string; description?: string };

export const IGNORED_HOSTS = new Set([
  "google.com",
  "gstatic.com",
  "cdn.jsdelivr.net",
  "unpkg.com",
  "raw.githubusercontent.com",
  "github.com",
  "twitter.com",
  // Telegram-related domains
  "telegram.org",
  "t.me",
  "telegram.me",
  "web.telegram.org",
  "telegram.com",
  "astro.build",
  "vercel.com",
  "netlify.com",
  "facebook.com",
  "x.com",
  "linkedin.com",
  "qq.com",
  "gov.cn",
  "bilibili.com",
  "xiaohongshu.com",
  "douyin.com",
  "csdn.net",
  "gitlab.com",
  "gitcode.cn",
  "gitee.com",
  "juejin.cn",
  "weibo.com",
  "travellings.cn",
  "baidu.com",
  "typecho.org",
  "dogecloud.com",
  // Cloud / CDN providers
  "amazonaws.com",
  "s3.amazonaws.com",
  "cloudfront.net",
  "cloudflare.com",
  "cloudflareworkers.com",
  "workers.dev",
  "azure.com",
  "blob.core.windows.net",
  "digitalocean.com",
  "digitaloceanspaces.com",
  "linode.com",
  "herokuapp.com",
  "googleusercontent.com",
  "storage.googleapis.com",
  "aliyuncs.com",
  "qiniu.com",
  "qiniucdn.com",
  "upyun.com",
  "qcloud.com",
  "fastly.net",
  "bloginn.vip",
  "travel.moe",
  "bloginc.cn",
  "bloginc.kamyang.com",
  "gov.moe",
  "wordpress.org",
  "blogsclub.org",
  "douban.com",
  "hexo.io",
  "boringbay.com",
  "paypal.me",
  "alipay.com", // 支付宝
  "wechat.com", // 微信支付
  "unionpay.com", // 银联
  "paypal.com", // PayPal
  "mastercard.com", // 万事达卡
  "visa.com", // 维萨卡
  "americanexpress.com", // 美国运通
  "discover.com", // 发现卡
  "jd.com", // 京东
  "taobao.com", // 淘宝
  "tmall.com", // 天猫
  "pinduoduo.com", // 拼多多
  "amazon.com", // 亚马逊
  "ebay.com", // 易贝
  "etsy.com", // Etsy
  "walmart.com", // 沃尔玛
  "bestbuy.com", // 百思买
  "costco.com", // 好市多
  "target.com", // 塔吉特
  "groupon.com", // 团购网
  "meituan.com", // 美团
  "dianping.com", // 大众点评
  "vip.com", // 唯品会
  "suning.com", // 苏宁易购
  "gome.com.cn", // 国美在线
  "yhd.com", // 1号店
  "vipin.com", // 唯品国际
  "xiaomi.com", // 小米商城
  "huawei.com", // 华为商城
  "apple.com", // 苹果官网
  "mi.com", // 小米国际
  "xiaomiyoupin.com", // 小米有品
  "jd.hk", // 京东香港
  "taobao.tw", // 淘宝台湾
  "tmall.hk", // 天猫香港
  "tmall.tw", // 天猫台湾
  "amazon.cn", // 亚马逊中国
  "amazon.jp", // 亚马逊日本
  "amazon.uk", // 亚马逊英国
  "amazon.de", // 亚马逊德国
  "amazon.fr", // 亚马逊法国
  "amazon.it", // 亚马逊意大利
  "amazon.es", // 亚马逊西班牙
  "amazon.ca", // 亚马逊加拿大
  "amazon.au", // 亚马逊澳大利亚
  "amazon.in", // 亚马逊印度
  "halo.run",
]);

export const AGGREGATORS = new Set([
  "joyb.cc",
  "blogscn.fun",
  "mp.weixin.qq.com",
  "sspai.com",
]);

export const FRIEND_PAGE_CANDIDATES = [
  "/links",
  "/links.html",
  "/friend",
  "/friends",
  "/friends.html",
  "/link",
  "/flink",
  "/friendLink.html",
  "/peer",
  "/index.php/links.html",
  "/friend-links",
  "/friend_link",
  "/friend-links.html",
  "/page/友链",
  "/links.html",
  "/peer",
  "/peers",
  "/about",
  "/about-us",
  "/about.html",
  "/about-me",
  "/关于",
];

export const RESOURCE_EXT_REGEX =
  /\.(png|jpg|jpeg|gif|svg|pdf|zip|rar|7z|iso|dmg|rar|mp4|webm|mp3|ogg)$/i;

export const NON_BLOG_TEXT_INDICATORS = [
  "下载",
  "镜像",
  "工具",
  "cdn",
  "样式",
  "assets",
  "静态",
];
