import chokidar from "chokidar";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const watcher = chokidar.watch("./links", {
  ignored: /(^|[\/\\])\../, // 忽略隐藏文件
  persistent: true,
});

console.log("开始监听 links/ 目录的变化...");

watcher.on("change", async (path) => {
  console.log(`文件 ${path} 已更改，正在重新生成 JSON...`);
  try {
    await execAsync("node ./utils/tojson.ts");
    console.log("JSON 生成完成");
    // 触发页面重载
    await execAsync("touch src/pages/index.astro");
  } catch (error) {
    console.error("生成 JSON 时出错:", error);
  }
});

watcher.on("add", async (path) => {
  console.log(`新文件 ${path} 已添加，正在重新生成 JSON...`);
  try {
    await execAsync("node ./utils/tojson.ts");
    console.log("JSON 生成完成");
    // 触发页面重载
    await execAsync("touch src/pages/index.astro");
  } catch (error) {
    console.error("生成 JSON 时出错:", error);
  }
});

watcher.on("unlink", async (path) => {
  console.log(`文件 ${path} 已删除，正在重新生成 JSON...`);
  try {
    await execAsync("node ./utils/tojson.ts");
    console.log("JSON 生成完成");
    // 触发页面重载
    await execAsync("touch src/pages/index.astro");
  } catch (error) {
    console.error("生成 JSON 时出错:", error);
  }
});
