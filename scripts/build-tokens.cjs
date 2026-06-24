const fs = require('fs');

// Read W3C format tokens
const tokens = JSON.parse(fs.readFileSync('./src/tokens/tokens.json', 'utf8'));

// Convert to Tokens Studio format
function convertToTokensStudio(w3cTokens) {
  const studioTokens = {};

  function flatten(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        if (value['$type'] && value['$value'] !== undefined) {
          const tokenPath = prefix ? `${prefix}.${key}` : key;

          switch (value['$type']) {
            case 'color':
              studioTokens[tokenPath] = { value: value['$value'], type: 'color' };
              break;
            case 'dimension':
              studioTokens[tokenPath] = { value: value['$value'], type: 'dimension' };
              break;
            case 'shadow':
              const v = value['$value'];
              studioTokens[tokenPath] = {
                value: {
                  x: v.offsetX || '0px',
                  y: v.offsetY || '0px',
                  blur: v.blur || '0px',
                  spread: v.spread || '0px',
                  color: v.color || '#000000',
                  type: 'dropShadow'
                },
                type: 'boxShadow'
              };
              break;
            case 'number':
              studioTokens[tokenPath] = { value: value['$value'], type: 'number' };
              break;
            case 'duration':
              studioTokens[tokenPath] = { value: value['$value'], type: 'duration' };
              break;
            case 'cubicBezier':
              studioTokens[tokenPath] = { value: value['$value'].join(', '), type: 'cubicBezier' };
              break;
            case 'fontFamily':
              studioTokens[tokenPath] = { value: value['$value'].join(', '), type: 'fontFamilies' };
              break;
            case 'fontWeight':
              studioTokens[tokenPath] = { value: String(value['$value']), type: 'fontWeights' };
              break;
          }
        } else {
          flatten(value, prefix ? `${prefix}.${key}` : key);
        }
      }
    }
  }

  flatten(w3cTokens.mochi || w3cTokens);
  return studioTokens;
}

// Convert to Figma Variables format
function convertToFigmaVariables(w3cTokens) {
  const variables = {
    version: '1.0',
    collections: []
  };

  const colorCollection = {
    name: 'Mochi UI - Colors',
    modes: [{ name: 'Light', variables: [] }]
  };

  function extractColors(obj, prefix = '') {
    const vars = [];
    for (const [key, value] of Object.entries(obj || {})) {
      if (value && value['$type'] === 'color') {
        vars.push({
          name: prefix ? `${prefix}/${key}` : key,
          type: 'COLOR',
          value: value['$value']
        });
      } else if (typeof value === 'object' && !Array.isArray(value) && !value['$type']) {
        vars.push(...extractColors(value, prefix ? `${prefix}/${key}` : key));
      }
    }
    return vars;
  }

  colorCollection.modes[0].variables = extractColors(w3cTokens.mochi?.color);
  variables.collections.push(colorCollection);

  return variables;
}

function generateComponentSpecs() {
  return {
    version: '1.0',
    components: {
      'Clay Button': {
        description: 'Triple-shadow button with spring physics',
        anatomy: [
          { name: 'Surface', type: 'frame', radius: '9999px', fill: 'colorway-bg' },
          { name: 'Shadow Lift', type: 'effect', shadow: '8px 8px 16px rgba(0,0,0,0.1)' },
          { name: 'Shadow Volume', type: 'effect', shadow: 'inset -4px -4px 8px rgba(0,0,0,0.05)' },
          { name: 'Shadow Reflection', type: 'effect', shadow: 'inset 4px 4px 8px rgba(255,255,255,0.8)' },
        ],
        variants: {
          colorway: ['mint', 'blue', 'pink', 'lavender', 'peach', 'neutral'],
          size: ['sm', 'md', 'lg'],
          state: ['default', 'hover', 'active', 'disabled'],
        }
      }
    }
  };
}

const studioTokens = convertToTokensStudio(tokens);
const figmaVars = convertToFigmaVariables(tokens);
const componentSpecs = generateComponentSpecs();

if (!fs.existsSync('./figma-export')) {
  fs.mkdirSync('./figma-export', { recursive: true });
}

fs.writeFileSync('./figma-export/tokens-studio.json', JSON.stringify(studioTokens, null, 2));
fs.writeFileSync('./figma-export/figma-variables.json', JSON.stringify(figmaVars, null, 2));
fs.writeFileSync('./figma-export/component-specs.json', JSON.stringify(componentSpecs, null, 2));

let cssOutput = '/* Mochi UI - Figma Styles Import */\n:root {\n';
for (const [key, token] of Object.entries(studioTokens)) {
  if (token.type === 'color') {
    cssOutput += `  --${key.replace(/\./g, '-')}: ${token.value};\n`;
  }
}
cssOutput += '}\n';
fs.writeFileSync('./figma-export/variables.css', cssOutput);

console.log('Figma export complete!');
