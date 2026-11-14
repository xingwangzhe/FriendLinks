import type { AstroIntegration } from "astro";
import { enforceBlacklist } from "../utils/blacklist";
import type { BlacklistHit } from "../utils/blacklist";

export type BlacklistGuardOptions = {
  rootDir?: string;
};

export function formatBlacklistHit(hit: BlacklistHit): string {
  const base = `[${hit.file}] ${hit.domain} 命中黑名单hash [${hit.hash}] 原因 [${hit.reason}]（黑名单条目 [${hit.entryFile}]）`;
  if (hit.scope === "site") {
    return `${base}；域名属于主站，已删除主站 YAML`;
  }
  const friend = hit.friendName ? `友链 [${hit.friendName}]` : "友链";
  const source = hit.sourceSiteName
    ? `[${hit.sourceSiteName}] (${hit.sourceSiteDomain ?? "未知域名"})`
    : hit.sourceSiteDomain
      ? `[${hit.sourceSiteDomain}]`
      : "[未知主站]";
  return `${base}；域名属于${friend}，来源主站 ${source}，已从 YAML 中抹去`;
}

export function blacklistGuard(options: BlacklistGuardOptions = {}): AstroIntegration {
  return {
    name: "friendlinks-blacklist",
    hooks: {
      "astro:build:start": async ({ logger }) => {
        const result = await enforceBlacklist({
          rootDir: options.rootDir,
          onHit: (hit) => {
            logger.warn(formatBlacklistHit(hit));
          },
        });
        if (result.hits.length > 0) {
          logger.info(
            `黑名单检查完成：扫描 ${result.filesScanned} 份 YAML，删除 ${result.mainSitesDeleted} 个主站，移除 ${result.childLinksRemoved} 条友链`,
          );
        }
      },
    },
  };
}
