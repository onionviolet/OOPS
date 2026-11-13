// UR161 / UIC134: the raw-duration lint in check_player_text.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {scanDurations, scanTreeDurations} from '../scripts/check_player_text.mjs';
import {readFileSync} from 'node:fs';

test('a hand-written minute or hour count is flagged; the formatter, a pair and an allow pass', () => {
    const hit = src => scanDurations('src/x.js', src).length;
    assert.equal(hit('el.textContent = `${r.minutes} minutes passed`;'), 1);
    assert.equal(hit('const t = `Wait ${n} hours`;'), 1);
    assert.equal(hit('el.textContent = `Away ${formatDuration(m)}`;'), 0);
    assert.equal(hit('el.textContent = `${formatDuration(m)} (${formatCount(m)} minutes)`;'), 0, 'the exact count may ride beside the human unit');
    assert.equal(hit('const t = `${n} minutes`; // player-text: allow a recipe card quotes the book'), 0);
    assert.equal(hit('// `${n} minutes` in a comment'), 0);
});

test('the tree has no raw duration beyond the baseline, and the return note is not in it', () => {
    const known = new Set(JSON.parse(readFileSync(new URL('../scripts/player_text_baseline.json', import.meta.url), 'utf8')).durations);
    const hits = scanTreeDurations();
    assert.deepEqual(hits.filter(h => !known.has(h.key)).map(h => `${h.file}:${h.line}`), []);
    assert.equal(hits.some(h => h.file === 'src/return_digest_ui.js' || h.file === 'src/away_bank_domain.js'), false);
});
