import { defineConfig } from 'tsup';

export default defineConfig([
  // ─── Main entry: React components + hooks
  // All outputs get 'use client' banner for Next.js App Router
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.banner = { js: '"use client";' };
    },
  },
  // ─── Physics sub-entry: pure computation, no 'use client'
  // Safe for RSC, Node.js build scripts, and non-React environments
  {
    entry: { physics: 'src/lib/physics.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: [],
    // No banner — intentionally omitted
  },
]);
