import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Preserve 'use client' directive in all output chunks
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
