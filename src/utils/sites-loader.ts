/**
 * 自定义 Content Loader — 站点数据加载器
 *
 * 以 links/*.yml 为数据源，逐文件读取并解析 YAML，
 * 对每个字段做详细的诊断日志，确保构建时任何错误都能快速定位。
 *
 * 日志级别说明：
 *   logger.info()  — 进度与统计
 *   logger.warn()  — 可恢复的异常（缺失可选字段、空数组等）
 *   logger.error() — 无法处理的严重错误（文件读取失败、字段缺失等）
 *
 * 日志策略：成功文件仅输出进度行；有问题的文件输出详细诊断日志。
 */

import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import type { Loader, LoaderContext } from "astro/loaders";

// ── 辅助函数 ──

function isValidUrl(u: unknown): u is string {
  if (typeof u !== "string") return false;
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidHexColor(c: unknown): c is string {
  if (typeof c !== "string") return false;
  return /^#[0-9a-fA-F]{6}$/.test(c);
}

/** 递归扫描目录下的所有 YAML 文件 */
async function listYamlFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await listYamlFiles(full)));
    } else if (e.isFile() && (e.name.endsWith(".yml") || e.name.endsWith(".yaml"))) {
      files.push(full);
    }
  }
  return files.sort();
}

// ── 字段级别诊断 ──

interface DiagnosticReport {
  file: string;
  id: string;
  ok: boolean;
  issues: string[];
}

/**
 * 对单个 YAML 文件进行字段级诊断，并生成报告。
 * 返回的报告包含所有发现的问题，但并不阻止后续处理。
 */
function diagnoseSite(file: string, raw: unknown): DiagnosticReport {
  const report: DiagnosticReport = { file, id: "", ok: true, issues: [] };

  // ── 根节点检查 ──
  if (raw === null || raw === undefined) {
    report.issues.push("文件内容为空");
    report.ok = false;
    return report;
  }
  if (typeof raw !== "object") {
    report.issues.push(`根节点类型错误: 期望 object, 收到 ${typeof raw}`);
    report.ok = false;
    return report;
  }

  const root = raw as Record<string, unknown>;

  // ── site 字段检查 ──
  if (!("site" in root)) {
    report.issues.push("缺少顶层字段 `site`");
    report.ok = false;
    return report;
  }
  const site = root.site;
  if (site === null || site === undefined) {
    report.issues.push("`site` 字段值为 null/undefined");
    report.ok = false;
    return report;
  }
  if (typeof site !== "object") {
    report.issues.push("`site` 类型错误: 期望 object, 收到 " + `${typeof site}`);
    report.ok = false;
    return report;
  }

  const s = site as Record<string, unknown>;

  // ── name ──
  if (!("name" in s)) {
    report.issues.push("`site.name` 字段缺失");
    report.ok = false;
  } else if (typeof s.name !== "string") {
    report.issues.push("`site.name` 类型错误: 期望 string, 收到 " + `${typeof s.name}`);
    report.ok = false;
  } else if (s.name.trim() === "") {
    report.issues.push("`site.name` 为空字符串");
  }

  // ── description ──
  if (!("description" in s)) {
    report.issues.push("`site.description` 字段缺失");
    report.ok = false;
  } else if (typeof s.description !== "string") {
    report.issues.push("`site.description` 类型错误: 期望 string, 收到 " + `${typeof s.description}`);
    report.ok = false;
  } else if (s.description.trim() === "") {
    report.issues.push("`site.description` 为空字符串");
  }

  // ── url ──
  if (!("url" in s)) {
    report.issues.push("`site.url` 字段缺失");
    report.ok = false;
  } else if (typeof s.url !== "string") {
    report.issues.push("`site.url` 类型错误: 期望 string, 收到 " + `${typeof s.url}`);
    report.ok = false;
  } else if (!isValidUrl(s.url)) {
    report.issues.push("`site.url` 不是有效的 http/https URL: " + `${s.url}`);
    report.ok = false;
  }

  // ── links ──
  if (!("links" in s)) {
    report.issues.push("`site.links` 字段缺失，将使用默认值 /links");
  } else if (typeof s.links !== "string") {
    report.issues.push("`site.links` 类型错误: 期望 string, 收到 " + `${typeof s.links}`);
    report.ok = false;
  } else if (s.links.trim() === "") {
    report.issues.push("`site.links` 为空字符串，将使用默认值 /links");
  }

  // ── favicon（可选） ──
  if ("favicon" in s) {
    if (s.favicon === null || s.favicon === undefined) {
      report.issues.push("`site.favicon` 值为 null，将被忽略");
    } else if (typeof s.favicon !== "string") {
      report.issues.push("`site.favicon` 类型错误: 期望 string, 收到 " + `${typeof s.favicon}，将被忽略`);
    } else if (!isValidUrl(s.favicon)) {
      report.issues.push("`site.favicon` 不是有效的 URL: " + `${s.favicon}，将被忽略`);
    }
  }

  // ── color（可选） ──
  if ("color" in s) {
    if (s.color === null || s.color === undefined) {
      report.issues.push("`site.color` 值为 null，将被忽略");
    } else if (typeof s.color !== "string") {
      report.issues.push("`site.color` 类型错误: 期望 string, 收到 " + `${typeof s.color}，将被忽略`);
    } else if (!isValidHexColor(s.color)) {
      report.issues.push("`site.color` 格式错误: " + `${s.color}（期望 #RRGGBB），将被忽略`);
    }
  }

  // ── friends ──
  if (!("friends" in s)) {
    report.issues.push("`site.friends` 字段缺失");
    report.ok = false;
  } else {
    const friends = s.friends;
    if (friends === null || friends === undefined) {
      report.issues.push("`site.friends` 值为 null，将视为空数组");
    } else if (!Array.isArray(friends)) {
      report.issues.push("`site.friends` 类型错误: 期望 array, 收到 " + `${typeof friends}`);
      report.ok = false;
    } else if (friends.length === 0) {
      report.issues.push("`site.friends` 为空数组（该站点没有友链）");
    } else {
      // 逐个检查 friend 条目
      for (let i = 0; i < friends.length; i++) {
        const f = (friends as unknown[])[i];
        if (!f || typeof f !== "object") {
          report.issues.push(`site.friends[${i}] 不是对象: 收到 ${typeof f}`);
          continue;
        }
        const fo = f as Record<string, unknown>;
        if (typeof fo.name !== "string" || fo.name.trim() === "") {
          report.issues.push(`site.friends[${i}].name 缺失或无效`);
        }
        if (typeof fo.url !== "string" || !isValidUrl(fo.url)) {
          report.issues.push(`site.friends[${i}].url 无效: ${fo.url}`);
        }
        if ("favicon" in fo && fo.favicon !== undefined && fo.favicon !== null) {
          if (typeof fo.favicon !== "string" || !isValidUrl(fo.favicon)) {
            report.issues.push(`site.friends[${i}].favicon 无效: ${fo.favicon}`);
          }
        }
      }
    }
  }

  return report;
}

// ── 主加载器 ──

export function sitesLoader(): Loader {
  return {
    name: "sites-loader",

    load: async ({ store, logger, parseData }: LoaderContext) => {
      const linksDir = path.resolve("links");
      const projectRoot = path.resolve(".");
      const allStart = performance.now();

      // ── 阶段 1: 扫描文件 ──
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info("🚀 开始扫描站点数据");
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      let files: string[];
      try {
        files = await listYamlFiles(linksDir);
      } catch (e) {
        logger.error(`❌ 扫描目录失败 ${linksDir}: ${e}`);
        return;
      }

      logger.info(`📂 数据目录: ${linksDir}`);
      logger.info(`📄 发现 YAML 文件: ${files.length}`);
      if (files.length === 0) {
        logger.warn("⚠️  未找到任何 YAML 文件，跳过加载");
        return;
      }

      // ── 阶段 2: 逐文件加载 ──
      logger.info("");
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info("🔍 开始逐文件验证与加载");
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      let loaded = 0;
      let skipped = 0;
      let warnings = 0;
      let errors = 0;
      const logBatchSize = 500;

      for (let i = 0; i < files.length; i++) {
        const filePath = files[i];
        const fileName = path.relative(linksDir, filePath); // e.g. "007.al.yml"

        // ID: 去除 ".yml" 扩展名，得到 "007.al"
        const id = fileName.replace(/\.(yml|yaml)$/, "");
        // parseData/filePath 要求相对于项目根目录
        const relativePath = path.relative(projectRoot, filePath); // e.g. "links/007.al.yml"

        // ── 批量进度日志 ──
        if (i > 0 && i % logBatchSize === 0) {
          const pct = Math.round((i / files.length) * 100);
          logger.info(
            `📊 进度: ${i}/${files.length} (${pct}%) · ` +
            `✅ ${loaded} · ⏭️  ${skipped} · ⚠️ ${warnings} · ❌ ${errors}`
          );
        }

        // ── 读取文件 ──
        let text: string;
        try {
          text = await fs.readFile(filePath, "utf8");
        } catch (e) {
          logger.error(`❌ [links/${fileName}] 文件读取失败: ${e}`);
          skipped++;
          errors++;
          continue;
        }

        // ── 解析 YAML ──
        let raw: unknown;
        try {
          raw = YAML.parse(text);
        } catch (e) {
          logger.error(`❌ [links/${fileName}] YAML 解析失败: ${e}`);
          skipped++;
          errors++;
          continue;
        }

        // ── 字段级诊断 ──
        const report = diagnoseSite(relativePath, raw);

        // ── 输出诊断日志 ──
        if (!report.ok) {
          // 严重问题
          logger.error(`❌ [links/${fileName}] 数据校验失败，共 ${report.issues.length} 个问题:`);
          for (const issue of report.issues) {
            logger.error(`   · ${issue}`);
          }
          skipped++;
          errors++;
          continue;
        }

        if (report.issues.length > 0) {
          // 可恢复问题
          logger.warn(`⚠️  [links/${fileName}] 存在 ${report.issues.length} 个可恢复问题:`);
          for (const issue of report.issues) {
            logger.warn(`   · ${issue}`);
          }
          warnings += report.issues.length;
        }

        // ── 提取数据并规范化为 Zod schema 期望的格式 ──
        const siteData = (raw as Record<string, unknown>).site as Record<string, unknown>;
        const normalizedData = {
          site: {
            name: siteData.name ?? "",
            description: siteData.description ?? "",
            url: siteData.url ?? "",
            favicon: siteData.favicon ?? undefined,
            color: siteData.color ?? undefined,
            links: siteData.links ?? "/links",
            friends: Array.isArray(siteData.friends) ? siteData.friends : [],
          },
        };

        // ── 调用 Zod 校验 ──
        try {
          const parsed = await parseData({
            id,
            data: normalizedData,
            filePath: relativePath,
          });

          const digest = hashString(filePath + JSON.stringify(parsed));
          store.set({
            id,
            data: parsed,
            filePath: relativePath,
            digest,
          });
          loaded++;
        } catch (parseError) {
          // parseData 失败 — 输出 Zod 详细错误
          logger.error(`❌ [links/${fileName}] Zod Schema 校验失败:`);
          if (parseError instanceof Error) {
            logger.error(`   错误信息: ${parseError.message}`);

            // 尝试提取 Zod 的 issues 数组
            const zodErr = (parseError as any)?.zodError;
            if (zodErr?.issues) {
              for (const issue of zodErr.issues) {
                const fieldPath = issue.path?.join(".") ?? "?";
                logger.error(`   ├─ 字段: ${fieldPath}`);
                logger.error(`   ├─ 原因: ${issue.message}`);
                logger.error(`   ├─ code: ${issue.code}`);
                if (issue.expected) logger.error(`   ├─ 期望: ${issue.expected}`);
                if (issue.received) logger.error(`   └─ 实际: ${issue.received}`);
              }
            }
          }
          skipped++;
          errors++;
        }
      }

      // ── 阶段 3: 汇总报告 ──
      const elapsed = ((performance.now() - allStart) / 1000).toFixed(1);
      logger.info("");
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info("📊 加载完成总结");
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info(`📂 数据目录: ${linksDir}`);
      logger.info(`📄 文件总数: ${files.length}`);
      logger.info(`✅ 成功加载: ${loaded}`);
      logger.info(`⏭️  跳过文件: ${skipped}`);
      logger.info(`⚠️  警告数: ${warnings}`);
      logger.info(`❌ 错误数: ${errors}`);
      if (loaded > 0) {
        const rate = (loaded / files.length * 100).toFixed(1);
        logger.info(`📈 成功率: ${rate}%`);
      }
      logger.info(`⏱️  耗时: ${elapsed}s`);
      logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    },
  };
}

/** 简易哈希用于内容摘要 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
