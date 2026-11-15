import { inspectBlacklist } from "../src/utils/blacklist";

function escapeAnnotationData(value: string): string {
  return value.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
}

function escapeAnnotationProperty(value: string): string {
  return escapeAnnotationData(value).replaceAll(":", "%3A").replaceAll(",", "%2C");
}

const result = await inspectBlacklist();
for (const hit of result.hits) {
  const matchedObject =
    hit.scope === "site"
      ? "主站"
      : `友链${hit.friendName ? `「${hit.friendName}」` : ""}${hit.sourceSiteName ? `（来自「${hit.sourceSiteName}」）` : ""}`;
  const message = `${hit.domain} 可能命中黑名单（${hit.entryFile}，原因：${hit.reason}）；当前匹配对象：${matchedObject}。请贡献者核实站点及原因。`;
  const path = escapeAnnotationProperty(hit.file);

  if (process.env.GITHUB_ACTIONS === "true") {
    console.log(`::warning file=${path},title=Possible blacklist match::${escapeAnnotationData(message)}`);
  } else {
    console.warn(`[warning] ${hit.file}: ${message}`);
  }
}

console.log(
  `黑名单只读检查完成：扫描 ${result.filesScanned} 份 YAML，发现 ${result.hits.length} 个可能命中；未构建、未修改或删除文件。`,
);
