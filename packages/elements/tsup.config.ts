import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'dx-elements': 'src/index.ts' },
  format: ['iife', 'esm'],
  globalName: 'DxElements',
  dts: true,
  clean: true,
  minify: true,
  outDir: 'dist',
  outExtension({ format }) {
    if (format === 'esm') return { js: '.mjs' };
    if (format === 'iife') return { js: '.global.js' };
    return { js: '.js' };
  },
});
