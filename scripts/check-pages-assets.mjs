import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('dist/index.html', 'utf8');
const refs = [...html.matchAll(/(?:src|href)="(\/[^"#?]*)/g)].map(m => m[1]).filter(x => !x.startsWith('//'));
if (!refs.length) throw new Error('No root-relative asset references found');
for (const ref of refs) {
  if (!ref.startsWith('/mochi-ui/')) throw new Error(`Unexpected Pages base: ${ref}`);
  const file = path.join('dist', ref.slice('/mochi-ui/'.length));
  if (!fs.existsSync(file)) throw new Error(`Missing Pages asset: ${ref}`);
}
console.log(`Validated ${refs.length} root-relative Pages asset references.`);
