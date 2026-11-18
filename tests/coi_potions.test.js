// CoI potions transfer test (PWC97): the LOTM law applied unchanged, a frozen split, a recorded score and pinned misses.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {score, heldOut, predict, rowId, STATED, DERIVED_ONLY, RULE_A} from '../scripts/derive_coi_potions.mjs';
import {derivedSpec} from '../src/lotm_derived_formulas.js';

const read = p => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const ledger = readFileSync(new URL('../docs/coverage/circle_of_inevitability_potions.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));

test('the freeze file matches the cohort and the hash split, and the law is the LOTM law untouched', () => {
    const f = read('docs/coverage/coi_potions_frozen.json');
    assert.deepEqual(f.cohort.map(c => c.id), STATED.map(([p, s]) => rowId(p, s)));
    for (const c of f.cohort) assert.equal(c.heldOut, heldOut(c.id), c.id);
    assert.equal(predict('Red Priest', 9).A, 'characteristic');
    assert.equal(derivedSpec('Red Priest', 3).slots.filter(s => s.role === 'main').length, 1);
});

test('the recorded score is what the labels and the law give, and every miss is a named exception', () => {
    const s = score(), saved = read('docs/coverage/coi_potions_score.json');
    assert.deepEqual(s, saved);
    assert.equal(s.all.n, 13);
    const named = new Set(s.exceptions.flatMap(e => e.rows));
    for (const m of s.misses) assert.ok(named.has(m.id), m.id);
    assert.equal(s.seq0.compositionRight, true);
});

test('the ledger has the stated rows blocked, the derived rows expressed with a rule row and a case, and no overlap', () => {
    const rules = new Map(read('docs/coverage/derivation_rules.json').rules.map(r => [r.id, r]));
    assert.ok(rules.has(RULE_A));
    const derived = ledger.filter(r => r.derived);
    assert.equal(derived.length, DERIVED_ONLY.length);
    for (const r of derived) {
        assert.equal(r.state, 'expressed-derived');
        assert.equal(r.derived.rule, RULE_A);
        assert.ok(r.case.module && r.case.id.startsWith('lotm.derived.'));
    }
    const stated = new Set(STATED.map(([p, s]) => rowId(p, s)));
    for (const r of ledger.filter(x => !x.derived)) assert.equal(r.state, 'blocked:formula-in-notes');
    for (const r of derived) assert.ok(!stated.has(r.id), r.id);
});
