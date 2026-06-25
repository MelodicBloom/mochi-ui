import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  build: {
    assets: '_assets'
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['@splinetool/react-spline'],
      },
    },
    optimizeDeps: {
      exclude: ['@splinetool/react-spline'],
    },
  },
});
