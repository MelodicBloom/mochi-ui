import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('dist/index.html', 'utf8');
const attributes = [...html.matchAll(/(?:^|\s)(src|href|component-url|renderer-url)\s*=\s*["']([^"']*)["']/gi)];
const refs = [];
for (const [, attribute, value] of attributes) {
  const hydration = /^(?:component-url|renderer-url)$/i.test(attribute);
  if (hydration && !value.startsWith('/mochi-ui/')) {
    throw new Error(`Unexpected Pages hydration URL: ${value}`);
  }
  if (value.startsWith('/') && !value.startsWith('//')) refs.push(value.split(/[?#]/, 1)[0]);
}
if (!refs.length) throw new Error('No root-relative asset references found');
for (const ref of refs) {
  if (!ref.startsWith('/mochi-ui/')) throw new Error(`Unexpected Pages base: ${ref}`);
  const file = path.join('dist', ref.slice('/mochi-ui/'.length));
  if (!fs.existsSync(file)) throw new Error(`Missing Pages asset: ${ref}`);
}
console.log(`Validated ${refs.length} root-relative Pages asset references.`);
