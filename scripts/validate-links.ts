import { loadSites, clearSiteCache } from "../src/utils/load-sites";

const dir = process.argv[2] ?? "links";
clearSiteCache();
const sites = await loadSites(dir);
const ok = sites.length > 0;
console.log(ok ? `✅ ${sites.length} 个站点验证通过` : "❌ 没有有效站点");
process.exit(ok ? 0 : 1);
