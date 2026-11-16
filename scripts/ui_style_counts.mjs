// PS245: count raw style in UI modules (src/ui/*.js and src/*_ui.js): raw colours (#hex, rgb(), hsl()), pixel sizes in
// strings, border declarations, toFixed and (PS292) own markup: createElement, innerHTML and insertAdjacentHTML. Tokens, the kit (src/ui/kit.js) and number_format are where these belong.
// `node scripts/ui_style_counts.mjs --write` rewrites the baseline after a file's count went down.
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
const ROOT = new URL('../', import.meta.url);
export const BASELINE = new URL('tests/fixtures/ui_style_ratchet.json', ROOT);
const PATTERNS = {
    colour: /#[0-9a-fA-F]{3,8}\b(?=[^\n]*['"`])|\b(?:rgba?|hsla?)\(/g,
    px: /\b\d+(?:\.\d+)?px\b/g,
    border: /\bborder(?:-[a-z]+)?\s*[:=]|\.style\.border/g,
    toFixed: /\.toFixed\(/g,
    // PS292: a box drawing its own markup instead of the kit's forms. Counts only go down as boxes move to src/ui/kit.js.
    ownMarkup: /\.createElement\(|\binsertAdjacentHTML\(|\.innerHTML\s*=/g,
};
export function uiModules() {
    const ui = readdirSync(new URL('src/ui/', ROOT)).filter(f => f.endsWith('.js')).map(f => `src/ui/${f}`);
    const top = readdirSync(new URL('src/', ROOT)).filter(f => f.endsWith('_ui.js')).map(f => `src/${f}`);
    return [...ui, ...top].filter(f => f !== 'src/ui/kit.js').sort();
}
export function countStyle(text) {
    const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    return Object.fromEntries(Object.entries(PATTERNS).map(([k, re]) => [k, (code.match(re) || []).length]));
}
export function currentCounts() {
    const out = {};
    for (const f of uiModules()) { const c = countStyle(readFileSync(new URL(f, ROOT), 'utf8')); if (Object.values(c).some(Boolean)) out[f] = c; }
    return out;
}
if (process.argv.includes('--write')) { writeFileSync(BASELINE, JSON.stringify(currentCounts(), null, 1) + '\n'); console.log('baseline written'); }
