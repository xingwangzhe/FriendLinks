export interface Site {
  name: string;
  description: string;
  url: string;
  /** 已确认的同义入口：旧域名、镜像或栏目地址 */
  aliases?: string[];
  favicon?: string;
  /** 自定义颜色，16 进制，如 #ff6600（可选，默认从调色板随机分配） */
  color?: string;
  /** 友链页面路由，如 /links /link /friends /friend 等，不含末尾斜杠（必填） */
  links: string;
  friends: Array<{
    name: string;
    url: string;
    favicon?: string;
    description?: string;
    avatar?: string;
  }>;
}
