import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import path from 'node:path';

export default {
  input: path.resolve('src/scripts/index-client.ts'),
  output: {
    file: path.resolve('public/scripts/index-client.js'),
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    nodeResolve({ extensions: ['.js', '.ts', '.mjs'] }),
    commonjs(),
    esbuild({
      target: 'es2020',
      tsconfig: path.resolve('tsconfig.json'),
    }),
  ],
};
