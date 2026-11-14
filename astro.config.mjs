import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";
import { blacklistGuard } from "./src/integrations/blacklist.ts";

// https://astro.build/config

// DEV 正式站点抽样上限；0 表示全量。启动环境变量 DEV_SAMPLE_SIZE 优先。
const DEV_SAMPLE_SIZE = 100;
const rawDevSampleSize = process.env.DEV_SAMPLE_SIZE ?? DEV_SAMPLE_SIZE;
const devSampleSize = Number(rawDevSampleSize);
if (
  (typeof rawDevSampleSize === "string" && !/^\d+$/.test(rawDevSampleSize)) ||
  !Number.isSafeInteger(devSampleSize) ||
  devSampleSize < 0
) {
  throw new Error("DEV_SAMPLE_SIZE 必须是非负安全整数：0 表示全量，正整数表示正式站点抽样上限。");
}

// 构建时间戳（UTC），格式：YYYY-MM-DD-HH-mm-ss
// 用于替代内容 hash，方便直观查验构建时间
const BUILD_TS = new Date().toISOString().replace(/[T:]/g, "-").slice(0, 19);
const NATIVE_BUILD_PACKAGES = ["@xingwangzhe/bfs-rs", "@xingwangzhe/force-rs"];

export default defineConfig({
  output: "static",
  integrations: [blacklistGuard()],
  // Astro 7.2+ 实验性增量构建缓存：命中 getStaticPaths + cacheKey 的页面可跳过渲染
  // 当前无 getStaticPaths 页面（均为静态页/GET 端点），启用后构建行为不变，为后续动态路由缓存做准备
  experimental: {
    incrementalBuild: true,
  },
  vite: {
    define: { __DEV_SAMPLE_SIZE__: JSON.stringify(devSampleSize) },
    plugins: [tailwindcss()],
    // Vite 8 environment resolution also covers linked workspace packages.
    resolve: { external: NATIVE_BUILD_PACKAGES },
    environments: {
      client: {
        build: {
          rollupOptions: {
            external: ["@xingwangzhe/force-rs", "@xingwangzhe/bfs-rs"],
            output: {
              entryFileNames: `_astro/[name].${BUILD_TS}.js`,
              chunkFileNames: `_astro/[name].${BUILD_TS}.js`,
              assetFileNames: `_astro/[name].${BUILD_TS}.[ext]`,
              manualChunks(id) {
                if (id.includes("node_modules/three/")) return "vendor-three";
                if (id.includes("node_modules/flexsearch/")) return "vendor-flexsearch";
                if (id.includes("node_modules/msgpackr/")) return "vendor-msgpackr";
              },
            },
          },
        },
      },
    },
  },
});
