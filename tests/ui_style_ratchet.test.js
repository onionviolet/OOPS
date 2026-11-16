// PS245: raw style in UI modules only goes down. A new raw colour, pixel size, border or toFixed belongs in the tokens,
// the kit (src/ui/kit.js) or number_format; after removing some, run `node scripts/ui_style_counts.mjs --write`.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BASELINE, currentCounts, countStyle} from '../scripts/ui_style_counts.mjs';

test('the style counter sees raw colours, pixel sizes, borders and toFixed, and skips comments', () => {
    assert.deepEqual(countStyle("n.style.border = '1px solid #fff';\n// a note: #000 2px\nv.toFixed(1); c = 'rgb(1,2,3)';"), {colour: 2, px: 1, border: 1, toFixed: 1});
});

test('no UI module adds raw style; counts only go down (PS245)', () => {
    const base = JSON.parse(readFileSync(BASELINE, 'utf8')), now = currentCounts(), rises = [];
    for (const [file, counts] of Object.entries(now)) for (const [kind, n] of Object.entries(counts)) {
        const was = base[file]?.[kind] ?? 0;
        if (n > was) rises.push(`${file}: ${kind} ${was} -> ${n}`);
    }
    assert.deepEqual(rises, [], 'Use tokens, the kit or number_format instead of raw style in UI modules.');
});
