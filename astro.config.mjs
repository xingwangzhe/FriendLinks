// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
import path from 'node:path';

export default defineConfig({
	output: 'static',
	vite: {
		build: {
			// 禁用小资源内联，确保 ?url 导入的模块会作为独立文件发射
			assetsInlineLimit: 0,
			rollupOptions: {
				input: {
					// 把客户端入口注册为独立的 rollup entry，使其及其依赖被打包
					indexClient: path.resolve('./src/scripts/index-client.ts'),
				},
			},
		},
	},
	// adapter: edgeoneAdapter({
	//     outDir: ".edgeone",
	//     includeFiles: ['public/**'],
	// }),
});
