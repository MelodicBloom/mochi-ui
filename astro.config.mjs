import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react({
      // Optimize React hydration for SSR safety
      jsxImportSource: 'react',
      experimentalReactChildren: true,
    }),
  ],
  output: 'static',
  build: {
    assets: '_assets'
  },
  // Increase SSR buffer size to handle large React trees
  vite: {
    ssr: {
      external: ['motion'],
    },
  },
});
