import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
copyFileSync('../../src/styles/clay.css', 'dist/styles.css');
copyFileSync('../../src/styles/tokens.css', 'dist/tokens.css');
