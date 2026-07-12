import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
import path from "node:path";

// 构建时间戳（UTC），格式：YYYY-MM-DD-HH-mm-ss
// 用于替代内容 hash，方便直观查验构建时间
const BUILD_TS = new Date()
  .toISOString()
  .replace(/[T:]/g, "-")
  .slice(0, 19);

export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@xingwangzhe/bfs-rs", "@xingwangzhe/force-rs"],
    },
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
