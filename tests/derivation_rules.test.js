// Derivation rule scores (PWC80, PWC86, PWC100): every derived row cites a scored rule and carries that rule's confidence; the verdict rule; the axiom gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verdictOf, FLOOR} from '../scripts/derivation_rules_backtest.mjs';

const rd = f => JSON.parse(readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'));
const lines = f => readFileSync(new URL(`../docs/coverage/${f}.jsonl`, import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));

test('the verdict rule: below the floor is not judged, above it needs exact over baseline and within-band not below', () => {
    assert.equal(FLOOR, 10);
    assert.equal(verdictOf(9, 9, 9, 3, 8), 'insufficient-held-out');
    assert.equal(verdictOf(68, 19, 44, 11, 29), 'passes');
    assert.equal(verdictOf(140, 73, null, 82, null), 'fails-baseline');
    assert.equal(verdictOf(20, 10, 12, 5, 15), 'fails-baseline');
});

test('every derived row carries the confidence its rule scored, and every rule it cites has a score row', () => {
    const rules = new Map(rd('docs/coverage/derivation_rules.json').rules.map(r => [r.id, r]));
    let derived = 0;
    for (const f of ['gu_kinds', 'gu_generated', 'hp_ingredients', 'lotm_potions']) {
        for (const row of lines(f).filter(r => r.derived)) {
            derived++;
            const rule = rules.get(row.derived.rule);
            assert.ok(rule, `${row.id}: no score row for ${row.derived.rule}`);
            assert.deepEqual(row.derived.confidence, {...rule.confidence, version: rule.version}, `${row.id}: confidence differs from the rule's score row`);
        }
    }
    assert.ok(derived > 1400);
});

test('the six cited rules each have a score row with a verdict; a low-n rule is scored, not flagged', () => {
    const byId = Object.fromEntries(rd('docs/coverage/derivation_rules.json').rules.map(r => [r.id, r]));
    for (const id of ['gu.generated.concept', 'gu.rank.family-median', 'lotm.rule.characteristic-replaces-main', 'hp.rule.recipe-carries-effect', 'lotm.rule.seq0-uniqueness-and-seq1-characteristics', 'gu.rank.precursor']) {
        assert.ok(byId[id]?.verdict, id);
        assert.equal(byId[id].confidence.verdict, byId[id].verdict);
    }
    assert.equal(byId['lotm.rule.seq0-uniqueness-and-seq1-characteristics'].verdict, 'insufficient-held-out');
});

test('an axiom is core-eligible only with a score in two worlds; every axiom stays a proposal', () => {
    const core = rd('docs/coverage/core_rules.json');
    assert.match(core.meta.status, /proposal/);
    for (const a of core.axioms) {
        assert.ok(a.verdict, a.id);
        if (a.verdict === 'passes-two-worlds') assert.ok(Object.values(a.worlds).filter(w => w.all?.verdict === 'passes').length >= 2, a.id);
    }
});

test('the Gu rank search scored its frozen fold once and beat the family median there', () => {
    const r = rd('docs/coverage/gu_rank_search.json'), folds = rd('docs/coverage/gu_rank_folds.json');
    assert.equal(folds.folds['5'].length, r.final.n);
    assert.ok(r.final.exact > r.familyMedian.exact && r.final.within1 >= r.familyMedian.within1);
});
