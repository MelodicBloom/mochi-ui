/**
 * Concatenates all src/styles/*.css files in order and writes to dist/styles.css.
 * Replaces the broken `postcss src/styles/*.css -o dist/styles.css` glob invocation
 * which postcss-cli does not support with a single -o output.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stylesDir = path.join(__dirname, '..', 'src', 'styles');
const distDir = path.join(__dirname, '..', 'dist');
const tmpFile = path.join(stylesDir, '_bundle_tmp.css');

// Order matters: tokens first, then clay core, then animations
const order = ['tokens.css', 'clay.css', 'animations.css'];

const contents = order
  .map((f) => {
    const full = path.join(stylesDir, f);
    if (!fs.existsSync(full)) {
      console.warn(`[build-css] Warning: ${f} not found, skipping.`);
      return '';
    }
    return fs.readFileSync(full, 'utf8');
  })
  .join('\n\n');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

fs.writeFileSync(tmpFile, contents);

try {
  execSync(`npx postcss ${tmpFile} -o ${path.join(distDir, 'styles.css')}`, { stdio: 'inherit' });
} finally {
  fs.unlinkSync(tmpFile);
}

console.log('[build-css] dist/styles.css written successfully.');
