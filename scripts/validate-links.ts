import { loadSiteCollection, clearCollectionCache } from "../src/utils/site-collection";
import { getCollectionInfo } from "../src/utils/site-identity";

try {
  clearCollectionCache();
  const sites = await loadSiteCollection(process.argv[2] ?? "links");
  if (!sites.length) throw new Error("没有有效站点");
  const { counts } = getCollectionInfo(sites);
  console.log(`✅ ${counts.rawRecords} 份 YAML，${sites.length} 个逻辑站点验证通过（合并 ${counts.mergedRecords} 份）`);
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
