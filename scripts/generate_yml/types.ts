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
  "/peer",
  "/index.php/links.html",
  "/friend-links",
  "/friend_link",
  "/friend-links.html",
  "/page/友链",
  "/about",
  "/about-us",
  "/about.html",
  "/about-me",
  "/关于",
  "/links.html",
  "/peer",
  "/peers",
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
