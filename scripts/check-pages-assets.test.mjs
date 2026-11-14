import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./check-pages-assets.mjs', import.meta.url));
function run(html, files) {
  const cwd = mkdtempSync(path.join(tmpdir(), 'mochi-assets-'));
  try {
    mkdirSync(path.join(cwd, 'dist'), { recursive: true });
    writeFileSync(path.join(cwd, 'dist/index.html'), html);
    for (const file of files) {
      const destination = path.join(cwd, 'dist', file);
      mkdirSync(path.dirname(destination), { recursive: true });
      writeFileSync(destination, '');
    }
    return spawnSync(process.execPath, [script], { cwd, encoding: 'utf8' });
  } finally { rmSync(cwd, { recursive: true, force: true }); }
}

test('checks hydration entry points as well as ordinary Pages assets', () => {
  const html = '<link href="/mochi-ui/_astro/app.css"><astro-island component-url="/mochi-ui/_astro/component.js" renderer-url="/mochi-ui/_astro/renderer.js"></astro-island>';
  const files = ['_astro/app.css', '_astro/component.js', '_astro/renderer.js'];
  assert.equal(run(html, files).status, 0);
  const missing = run(html, files.slice(0, 2));
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /Missing Pages asset.*renderer/);
  for (const bad of ['/wrong/renderer.js', 'https://example.com/renderer.js', 'renderer.js']) {
    const result = run(html.replace('/mochi-ui/_astro/renderer.js', bad), files);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unexpected Pages hydration URL/);
  }
});
