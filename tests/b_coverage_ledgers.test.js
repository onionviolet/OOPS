// Chat B coverage ledgers (CV1-CV4, MS1): committed rows match a fresh build,
// every row has a valid state, the denominators hold and every running row
// names a test that exists.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {buildLedgers, summarize, toLedgerRow} from '../scripts/b_coverage_ledgers.mjs';
import {parseLedger} from '../scripts/coverage_report.mjs';
import {LOTM_BREW_ROWS} from '../src/world_packs/lotm_brew_pack.js';

const read = name => readFileSync(new URL(`../docs/coverage/${name}.jsonl`, import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const STATE = /^(runs-canon|runs-authored|expressed-authored|blocked:[a-z-]+|not-a-thing:[a-z-]+)$/;

test('committed B ledgers equal a fresh build', async () => {
    const built = await buildLedgers();
    for (const [name, rows] of Object.entries(built)) assert.deepEqual(read(name), JSON.parse(JSON.stringify(rows.map(toLedgerRow))), name);
});

test('every row is classified with a valid state and unique id, and passes the shared validator', () => {
    for (const name of ['hp_potions', 'hp_ingredients', 'lotm_potions']) {
        const text = readFileSync(new URL(`../docs/coverage/${name}.jsonl`, import.meta.url), 'utf8');
        assert.deepEqual(parseLedger(text, {name}).problems, [], name);
        const rows = read(name);
        assert.equal(new Set(rows.map(r => r.id)).size, rows.length, `${name} ids`);
        for (const r of rows) {
            assert.match(r.state, STATE, `${name} ${r.id}`);
            if (r.state.startsWith('runs-')) assert.ok(r.test && existsSync(new URL(`../${r.test}`, import.meta.url)), `${r.id} names a real test`);
            if (r.state.startsWith('blocked:')) assert.ok(r.note.length > 0, `${r.id} names what is missing`);
        }
        assert.equal(summarize(rows).unclassified, 0);
    }
});

test('denominators: 316 potion and 409 ingredient entries; 220 pathway Sequences plus named preparations', () => {
    assert.equal(read('hp_potions').length, 316);
    assert.equal(read('hp_ingredients').length, 409);
    const lotm = read('lotm_potions');
    assert.equal(lotm.filter(r => /Sequence \d/.test(r.note)).length, 220);
    const ids = new Set(lotm.map(r => r.id));
    for (const row of LOTM_BREW_ROWS) assert.ok(ids.has(`lotm.potion.${row.id}`), `${row.id} is in the inventory`);
    assert.equal(lotm.filter(r => r.state.startsWith('runs-')).length, LOTM_BREW_ROWS.length);
});
