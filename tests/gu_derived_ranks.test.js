import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildWorld, precursorRule, seriesRule, familyRule, scoreRules, deriveRows, heldOut, ingredientsOf, seriesKey} from '../scripts/derive_gu_ranks.mjs';

const read = name => readFileSync(new URL(`../docs/coverage/${name}`, import.meta.url), 'utf8');
const derived = JSON.parse(read('gu_derived_ranks.json'));
const rules = JSON.parse(read('ri_rules.json'));
const kinds = read('gu_kinds.jsonl').trim().split('\n').map(l => JSON.parse(l));
const labels = JSON.parse(read('gu_labels.json')).kinds;

// A small world: rank-one and rank-two ingredients, a three-step series and a path family (PWC23).
const rec = (id, name, rank, cats = []) => ({id, fandom: {name, categories: cats}, metadata: {fandom_category_ranks: rank ? [rank] : []}});
const index = {records: [rec('a', 'Alpha Gu', 1, ['Strength Path']), rec('b', 'Beta Gu', 2, ['Strength Path']), rec('c', 'Gamma Gu', null, ['Strength Path']),
    rec('s1', 'One Year Gu', 1), rec('s3', 'Three Year Gu', 3), rec('s2', 'Two Year Gu', null), rec('d', 'Delta Gu', null)]};
const world = buildWorld({index, edges: {c: {precursors: ['Beta Gu']}, d: {fusion: ['Alpha Gu', 'Beta Gu']}}});

test('a refined Gu is one rank above its highest known precursor', () => {
    assert.deepEqual(precursorRule(world, 'c'), {rule: 'gu.rank.precursor', rank: 3, inputs: ['b@2'], spread: null});
    assert.equal(precursorRule(world, 'd').rank, 3);
    assert.equal(precursorRule(world, 'a'), null);
});
test('a numbered series climbs by the step its two known members show', () => {
    assert.equal(seriesKey('Three Year Gu').key, '# year gu');
    assert.equal(seriesRule(world, 's2').rank, 2);
    assert.equal(seriesRule(world, 'a'), null);
});
test('the family median needs three ranked members and records its spread', () => {
    assert.equal(familyRule(world, 'c', ['a', 'b']), null);
    const big = buildWorld({index: {records: [...index.records, rec('e', 'Eps Gu', 4, ['Strength Path'])]}, edges: {}});
    const hit = familyRule(big, 'c', ['a', 'b', 'e']);
    assert.equal(hit.rank, 2);
    assert.deepEqual(hit.spread, {n: 3, min: 1, max: 4, q1: 1, q3: 4});
});
test('a rule that does not fold derives nothing', () => {
    const scores = {rules: {precursor: {folds: false}, series: {folds: false}, family: {folds: false}}};
    assert.deepEqual(deriveRows(world, ['c', 'd', 's2'], scores), {});
    assert.equal(heldOut('x') === heldOut('x'), true);
    assert.deepEqual(ingredientsOf('[[A Gu]] + [[B Gu]] = [[C Gu]]<br>[[A Gu]] + [[D Gu]] = [[E Gu]]', 'C Gu'), ['A Gu', 'B Gu']);
});

test('the committed scores support every rule that folded, and the baseline is recorded', () => {
    const {scores} = derived.meta;
    assert.equal(scores.cohort.n, 392);
    for (const [name, t] of Object.entries(scores.rules)) {
        const expected = t.n >= derived.meta.fold.minN && t.exact > t.baselineExact && t.within1 >= t.baselineWithin1;
        assert.equal(t.folds, expected, name);
    }
    const used = new Set(Object.values(derived.rows).map(row => row.rule));
    for (const [name, id] of [['precursor', 'gu.rank.precursor'], ['series', 'gu.rank.series'], ['family', 'gu.rank.family-median']]) {
        if (used.has(id)) assert.ok(scores.rules[name].folds, `${id} derived rows without a passing score`);
    }
});
test('derived rows carry their rule in the ledger and the rule rows list their slugs', () => {
    const rows = kinds.filter(k => labels[k.id]?.rankBasis === 'derived');
    assert.equal(rows.length, Object.keys(derived.rows).length);
    for (const row of rows) {
        assert.match(row.state, /^(runs-derived|blocked:effect-unknown)$/, row.id);
        if (row.state === 'runs-derived') assert.deepEqual(row.derived, {rule: derived.rows[row.id].rule, inputs: derived.rows[row.id].inputs}, row.id);
        assert.equal(labels[row.id].rank, derived.rows[row.id].rank, row.id);
    }
    for (const rule of rules.filter(r => r.id.startsWith('gu.rank.'))) {
        assert.deepEqual(Object.keys(rule).sort(), ['derives', 'id', 'locators', 'mechanism', 'speaker', 'statement', 'world']);
        assert.deepEqual(rule.derives.sort(), Object.entries(derived.rows).filter(([, d]) => d.rule === rule.id).map(([id]) => id).sort());
    }
});
