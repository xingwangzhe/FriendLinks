#!/usr/bin/env node
import { build as esbuild } from 'esbuild';
import path from 'node:path';

async function build() {
  try {
    const entry = path.resolve('src/scripts/index-client.ts');
    const out = path.resolve('public/scripts/index-client.js');
    await esbuild({
      entryPoints: [entry],
      bundle: true,
      outfile: out,
      format: 'esm',
      target: ['es2020'],
      sourcemap: false,
      platform: 'browser',
      logLevel: 'info',
    });
    console.log('✅ Client bundle written to public/scripts/index-client.js');
  } catch (e) {
    console.error('❌ esbuild failed:', e);
    process.exit(1);
  }
}

build();
