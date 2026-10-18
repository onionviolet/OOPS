// READ-ONLY gate. Contract: src/rarity_palette.js exports rarityColor(rarity, scheme).
// Standard returns the original colors; Vivid returns colors readable on every Vivid surface.
import {pathToFileURL} from 'node:url';
const ROOT = new URL('../../../../../', import.meta.url);
const ORIGINAL = {trash: '#d3d3d3', common: '#ffffff', uncommon: '#90ee90', rare: '#0000ff', epic: '#ffc0cb', legendary: '#800080', mythical: '#ffa500'};
const SURFACES = ['#090d26', '#15204c', '#0f3438', '#241a44', '#2a1436', '#17302a'];
const hex = h => { const v = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(v.slice(i, i + 2), 16)); };
const lum = c => c.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }).reduce((a, x, i) => a + x * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const A = lum(hex(a)), B = lum(hex(b)); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); };
let mod;
try { mod = await import(pathToFileURL(new URL('src/rarity_palette.js', ROOT).pathname)); }
catch (e) { console.log('FAIL I3_rarity_unit src/rarity_palette.js not importable: ' + e.message.split('\n')[0]); process.exit(1); }
const bad = [];
for (const [r, orig] of Object.entries(ORIGINAL)) {
  if (String(mod.rarityColor(r, 'standard')).toLowerCase() !== orig) bad.push(`standard ${r} changed`);
  const v = String(mod.rarityColor(r, 'vivid'));
  if (!/^#[0-9a-f]{6}$/i.test(v)) { bad.push(`vivid ${r} not #rrggbb`); continue; }
  for (const s of SURFACES) if (ratio(v, s) < 4.5) bad.push(`vivid ${r} ${v} on ${s} ${ratio(v, s).toFixed(2)}:1`);
}
const vivid = Object.keys(ORIGINAL).map(r => String(mod.rarityColor(r, 'vivid')).toLowerCase());
if (new Set(vivid).size !== vivid.length) bad.push('vivid rarities not distinct');
console.log(`${bad.length ? 'FAIL' : 'PASS'} I3_rarity_unit ${bad.length ? JSON.stringify(bad) : 'standard unchanged, vivid >=4.5:1 on 6 surfaces, distinct'}`);
process.exit(bad.length ? 1 : 0);
