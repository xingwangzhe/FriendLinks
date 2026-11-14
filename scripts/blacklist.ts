import {
  addBlacklistDomain,
  BLACKLIST_DIR,
  blacklistDomainHash,
  findBlacklistHit,
  loadBlacklist,
} from "../src/utils/blacklist";

function usage() {
  console.log(`用法:
  bun run blacklist add <URL或域名> <排除原因>
  bun run blacklist check <URL或域名>
  bun run blacklist list`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "add") {
    const [value, ...reasonParts] = args;
    if (!value || reasonParts.length === 0) {
      usage();
      process.exitCode = 1;
      return;
    }
    const result = await addBlacklistDomain({ value, reason: reasonParts.join(" "), directory: BLACKLIST_DIR });
    console.log(
      result.existing
        ? `已存在: ${result.record.file} hash=${result.record.hash}`
        : `已加入: ${result.record.file} hash=${result.record.hash}`,
    );
    return;
  }
  if (command === "check") {
    const [value] = args;
    if (!value) {
      usage();
      process.exitCode = 1;
      return;
    }
    const { domain, hash } = blacklistDomainHash(value);
    const hit = findBlacklistHit(value, await loadBlacklist(BLACKLIST_DIR));
    console.log(
      hit ? `${domain} 命中黑名单hash [${hash}] 原因 [${hit.reason}]` : `${domain} 未命中黑名单hash [${hash}]`,
    );
    return;
  }
  if (command === "list") {
    const index = await loadBlacklist(BLACKLIST_DIR);
    console.log(
      JSON.stringify(
        index.records.map(({ file, sequence, domainLength, hash, reason }) => ({
          file,
          sequence,
          domainLength,
          hash,
          reason,
        })),
        null,
        2,
      ),
    );
    return;
  }
  usage();
  process.exitCode = command ? 1 : 0;
}

try {
  await main();
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
