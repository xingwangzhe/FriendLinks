import { defineCollection, z } from "astro:content";
import { sitesLoader } from "../src/utils/sites-loader";

/**
 * 友链数据 Schema
 * 对应 links/*.yml 中 site.friends[] 的结构
 */
const FriendSchema = z.object({
  name: z.string(),
  url: z.string(),
  favicon: z.string().optional(),
});

/**
 * 站点数据 Schema
 * 对应 links/*.yml 中 site 的结构
 *
 * 注意：YAML 中某些字段可能以空值（null）形式存在，
 * 因此使用 .catch() 兜底，与旧版手动解析行为保持一致。
 */
const SiteSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  favicon: z.string().optional().catch(undefined),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .catch(undefined),
  links: z.string().catch("/links"),
  friends: z.array(FriendSchema).catch([]),
});

/**
 * YAML 顶层结构
 * links/*.yml 的根节点为 { site: { ... } }
 */
const YamlSchema = z.object({
  site: SiteSchema,
});

/**
 * sites 内容合集
 * 使用自定义加载器（带详细诊断日志）
 */
const sites = defineCollection({
  loader: sitesLoader(),
  schema: YamlSchema,
});

export const collections = { sites };

// 导出 schema 类型供外部使用
export type Friend = z.infer<typeof FriendSchema>;
export type SiteData = z.infer<typeof SiteSchema>;
export type YamlData = z.infer<typeof YamlSchema>;
