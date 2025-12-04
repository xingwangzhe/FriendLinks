// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
import edgeoneAdapter from '@edgeone/astro';

export default defineConfig({
	output: 'server',
	adapter: edgeoneAdapter({
		includeFiles: ['public/**'],
	}),
});
