// Worm PRT derivation (derive-worm lane): the committed score file equals a fresh run, the rules file is the frozen one,
// derived blocks sit only on unrated cape rows, and the fan tier is reported as a separate voice.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build as build_rules} from '../scripts/derivation_rules_backtest.mjs';
import {build} from '../scripts/derive_worm_prt.mjs';
import {classSet, primaryOf, ratingOf} from '../scripts/worm_prt_rules.mjs';

const rd = f => JSON.parse(readFileSync(new URL(`../docs/coverage/${f}`, import.meta.url), 'utf8'));

test('committed score file equals a fresh run', () => {
    assert.deepEqual(rd('worm_prt_derived.json'), JSON.parse(JSON.stringify(build())));
});

test('rules abstain on devices and Entities and never name a class outside the twelve', () => {
    const side = rd('worm_power_labels.json').rows;
    for (const [id, r] of Object.entries(side)) {
        const set = classSet(r);
        if (r.kind !== 'cape') { assert.equal(set, null, id); continue; }
        if (set) assert.ok(primaryOf(set) && [...set].every(c => /^(Mover|Shaker|Brute|Breaker|Master|Tinker|Blaster|Thinker|Striker|Changer|Trump|Stranger)$/.test(c)), id);
        const n = ratingOf(r);
        if (n != null) assert.ok(n >= 1 && n <= 12, id);
    }
});

test('derived blocks sit on cape rows with no stated class, and name a scored rule', async () => {
    const side = rd('worm_power_labels.json').rows, rules = new Set((await build_rules()).rules.map(r => r.id));
    const ledger = readFileSync(new URL('../docs/coverage/worm_powers.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
    let n = 0;
    for (const row of ledger) {
        if (!row.derived) continue;
        n++;
        assert.ok(!side[row.id].rating && side[row.id].kind === 'cape', row.id);
        assert.ok(rules.has(row.derived.rule), row.id);
    }
    assert.equal(n, Object.keys(rd('worm_prt_derived.json').derived).length);
});

test('the scored comparison beats its baseline and the fan tier is a separate, small second voice', () => {
    const s = rd('worm_prt_derived.json');
    assert.ok(s.class.whole.primaryExact > s.class.whole.baseline.primaryExact);
    assert.ok(s.class.whole.misses.length === s.class.whole.n - s.class.whole.primaryExact, 'every class miss is pinned');
    assert.ok(s.rating.whole.misses.length === s.rating.whole.n - s.rating.whole.exact, 'every rating miss is pinned');
    assert.equal(s.fanTier.numericRatingsStated, 0);
    assert.ok(s.fanTier.comparable <= s.fanTier.rowsNamingAClass);
});
