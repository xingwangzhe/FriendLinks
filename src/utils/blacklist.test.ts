import { expect, test } from "bun:test";
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { blacklistGuard, formatBlacklistHit } from "../integrations/blacklist";
import {
  addBlacklistDomain,
  blacklistDomainHash,
  enforceBlacklist,
  loadBlacklist,
  normalizeBlacklistDomain,
  normalizeBlacklistReason,
} from "./blacklist";

async function temporaryProject() {
  const root = await mkdtemp(path.join(tmpdir(), "friendlinks-blacklist-"));
  await mkdir(path.join(root, "blacklist"), { recursive: true });
  await mkdir(path.join(root, "links"), { recursive: true });
  return root;
}

async function writeEntry(root: string, sequence: number, value: string, reason: string) {
  const { domain, hash } = blacklistDomainHash(value);
  await writeFile(
    path.join(root, "blacklist", `${sequence}.json`),
    `${JSON.stringify({ domainLength: domain.length, hash, reason }, null, 2)}\n`,
  );
  return { domain, hash };
}

test("blacklist hashes only the normalized hostname", () => {
  expect(normalizeBlacklistDomain("HTTPS://Blog.Example.com/path?q=1#part")).toBe("blog.example.com");
  expect(normalizeBlacklistDomain("blog.example.com:8443/friends")).toBe("blog.example.com");
  expect(normalizeBlacklistDomain("https://www.Example.com./")).toBe("www.example.com");
  expect(blacklistDomainHash("https://blog.example.com")).toEqual({
    domain: "blog.example.com",
    hash: "bd0054cb250b2bb60508c69cc475c5015b1627de407ce0ea50acaa9a00a16c94",
  });
});

test("blacklist reasons reject URL, domain, and IP plaintext", () => {
  expect(normalizeBlacklistReason("内容农场（非原创）")).toBe("内容农场（非原创）");
  for (const reason of ["https://blog.example.com", "来源 blog.example.com", "来源 ip 192.0.2.1", "例子.中国"]) {
    expect(() => normalizeBlacklistReason(reason)).toThrow("不能包含 URL、域名或 IP 明文");
  }
});

test("blacklist files load in numeric sequence and reject invalid schemas", async () => {
  const root = await temporaryProject();
  try {
    const second = await writeEntry(root, 2, "second.example.com", "第二条");
    const tenth = await writeEntry(root, 10, "tenth.example.com", "第十条");
    const index = await loadBlacklist(path.join(root, "blacklist"));
    expect(index.records.map((entry) => entry.sequence)).toEqual([2, 10]);
    expect(index.byHash.get(second.hash)?.reason).toBe("第二条");
    expect(index.byHash.get(tenth.hash)?.reason).toBe("第十条");

    const invalidDirectory = path.join(root, "blacklist-invalid");
    await mkdir(invalidDirectory);
    await writeFile(path.join(invalidDirectory, "01.json"), "{}\n");
    await expect(loadBlacklist(invalidDirectory)).rejects.toThrow("纯数字序号");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("adding a domain creates the next numeric file without storing plaintext", async () => {
  const root = await temporaryProject();
  try {
    await writeEntry(root, 3, "existing.example.com", "已存在");
    const added = await addBlacklistDomain({
      value: "https://new.example.com/path",
      reason: "手动排除",
      directory: path.join(root, "blacklist"),
    });
    expect(added.existing).toBe(false);
    expect(added.record.file).toBe("4.json");
    const raw = JSON.parse(await readFile(path.join(root, "blacklist", "4.json"), "utf8"));
    expect(raw).toEqual({
      domainLength: "new.example.com".length,
      hash: blacklistDomainHash("new.example.com").hash,
      reason: "手动排除",
    });
    expect(JSON.stringify(raw)).not.toContain("new.example.com");

    const duplicate = await addBlacklistDomain({
      value: "new.example.com",
      reason: "重复",
      directory: path.join(root, "blacklist"),
    });
    expect(duplicate.existing).toBe(true);
    expect(duplicate.record.file).toBe("4.json");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("build enforcement deletes blacklisted sites and removes blacklisted friends", async () => {
  const root = await temporaryProject();
  try {
    const main = await writeEntry(root, 1, "main.example.com", "主站违规");
    const friend = await writeEntry(root, 2, "friend.example.com", "友链违规");
    await writeFile(
      path.join(root, "links", "main.yml"),
      [
        "site:",
        '  name: "Main"',
        '  url: "https://main.example.com/"',
        "  description: test",
        "  links: /links",
        "  friends: []",
        "",
      ].join("\n"),
    );
    await writeFile(
      path.join(root, "links", "good.yml"),
      [
        "# 保留这条注释",
        "site:",
        "  name: Good",
        "  url: https://good.example.com/",
        "  description: test",
        "  links: /links",
        "  friends:",
        "    - name: Blocked",
        "      url: https://friend.example.com/path",
        "    - name: Kept",
        "      url: https://kept.example.com/",
        "",
      ].join("\n"),
    );

    const logged: string[] = [];
    const result = await enforceBlacklist({
      rootDir: root,
      onHit: (hit) => logged.push(formatBlacklistHit(hit)),
    });
    expect(result.mainSitesDeleted).toBe(1);
    expect(result.childLinksRemoved).toBe(1);
    const siteHit = result.hits.find((hit) => hit.scope === "site");
    const friendHit = result.hits.find((hit) => hit.scope === "friend");
    expect(siteHit?.entryFile).toBe("1.json");
    expect(friendHit?.entryFile).toBe("2.json");
    expect(friendHit).toMatchObject({
      sourceSiteDomain: "good.example.com",
      sourceSiteName: "Good",
      friendName: "Blocked",
    });
    const expectedLogs = [
      `[links/main.yml] main.example.com 命中黑名单hash [${main.hash}] 原因 [主站违规]（黑名单条目 [1.json]）；域名属于主站，已删除主站 YAML`,
      `[links/good.yml] friend.example.com 命中黑名单hash [${friend.hash}] 原因 [友链违规]（黑名单条目 [2.json]）；域名属于友链 [Blocked]，来源主站 [Good] (good.example.com)，已从 YAML 中抹去`,
    ];
    expect(logged.sort()).toEqual(expectedLogs.sort());
    await expect(access(path.join(root, "links", "main.yml"))).rejects.toThrow();

    const good = await readFile(path.join(root, "links", "good.yml"), "utf8");
    expect(good).toContain("# 保留这条注释");
    expect(good).not.toContain("friend.example.com");
    expect(good).toContain("kept.example.com");
    expect(main.hash).toHaveLength(64);
    expect(friend.hash).toHaveLength(64);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("an aliased main-site domain is treated as the main site", async () => {
  const root = await temporaryProject();
  try {
    await writeEntry(root, 1, "old.example.com", "旧域名违规");
    await writeFile(
      path.join(root, "links", "alias.yml"),
      [
        "site:",
        "  name: Alias",
        "  url: https://current.example.com/",
        "  aliases:",
        "    - https://old.example.com/",
        "  description: test",
        "  links: /links",
        "  friends: []",
        "",
      ].join("\n"),
    );
    const result = await enforceBlacklist({ rootDir: root });
    expect(result.mainSitesDeleted).toBe(1);
    await expect(access(path.join(root, "links", "alias.yml"))).rejects.toThrow();
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("blacklistGuard emits detailed Astro build logs", async () => {
  const root = await temporaryProject();
  try {
    await writeEntry(root, 1, "main.example.com", "主站违规");
    await writeEntry(root, 2, "friend.example.com", "友链违规");
    await writeFile(
      path.join(root, "links", "main.yml"),
      [
        "site:",
        "  name: Main",
        "  url: https://main.example.com/",
        "  description: test",
        "  links: /links",
        "  friends: []",
        "",
      ].join("\n"),
    );
    await writeFile(
      path.join(root, "links", "good.yml"),
      [
        "site:",
        "  name: Good",
        "  url: https://good.example.com/",
        "  description: test",
        "  links: /links",
        "  friends:",
        "    - name: Blocked",
        "      url: https://friend.example.com/",
        "",
      ].join("\n"),
    );

    const warnings: string[] = [];
    const infos: string[] = [];
    const integration = blacklistGuard({ rootDir: root });
    const hook = integration.hooks["astro:build:start"];
    if (typeof hook !== "function") throw new Error("缺少 astro:build:start 钩子");
    await (hook as (options: unknown) => Promise<void>)({
      logger: {
        warn: (message: string) => warnings.push(message),
        info: (message: string) => infos.push(message),
      },
    });

    expect(warnings.some((message) => message.includes("域名属于主站，已删除主站 YAML"))).toBe(true);
    expect(
      warnings.some(
        (message) =>
          message.includes("域名属于友链 [Blocked]") &&
          message.includes("来源主站 [Good] (good.example.com)") &&
          message.includes("已从 YAML 中抹去"),
      ),
    ).toBe(true);
    expect(infos[0]).toContain("删除 1 个主站，移除 1 条友链");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
