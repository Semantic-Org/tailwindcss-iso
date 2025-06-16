import { defineConfig } from 'tsup';

export default defineConfig({
  // Specifies the entry point for our browser bundle.
  entry: {
    'browser': 'src/browser/index.js',
  },
  // The output directory for the bundled files.
  outDir: 'dist',
  // **Focus on ESM format for modern browser usage with import maps.**
  format: ['esm'],
  // Specifies the target platform.
  platform: 'browser',
  // Target modern browsers that support ES modules
  target: 'es2020',
  // Handle CSS files as text strings instead of processed CSS
  loader: {
    '.css': 'text',
  },
  // Bundle tailwindcss (override peerDependency exclusion) to include CSS files
  noExternal: ['tailwindcss'],
  // We want a single file for the bundle.
  splitting: false,
  // Generate sourcemaps for debugging.
  sourcemap: true,
  // Clean the output directory before each build.
  clean: true,
  // Minify the output for production.
  minify: true,
  // We'll use the existing `types/index.d.ts` so no need to generate new ones.
  dts: false,
  // **Crucially**, this copies the WASM assets to the output directory,
  // so the dynamic import within the bundled code can find them.
  publicDir: 'src/browser/oxide',
});
