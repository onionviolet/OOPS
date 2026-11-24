import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DURATION_TO_TIME, ENDS_OF_TIME, FLOOR, REVERSAL_OF_DURATION, SPECS, compose, factsOf, fitDials, isTest, leaning, load, scoringFacts, scores, take, verdictOf} from '../scripts/law_defaults.mjs';

const rd = f => JSON.parse(readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'));

test('the fields a law requires are the ones that change play; every other field has a role, a reason and, for a dial, a source', () => {
    assert.deepEqual(SPECS['area-field'].required, ['sentence', 'time', 'anchor', 'who']);
    assert.deepEqual(SPECS['form-transformation'].required, ['sentence', 'target', 'reversal']);
    for (const spec of Object.values(SPECS)) for (const [k, f] of Object.entries(spec.fields)) {
        assert.ok(['read', 'derive', 'dial', 'drop'].includes(f.role), k);
        assert.ok(f.reason, `${k} has a reason`);
        if (f.role === 'dial' || f.default) assert.match(f.source, /^(tabletop|rows|design)/, `${k} names where its default came from`);
        if (f.role === 'read') assert.equal(f.default, undefined, `${k}: what a power is has no default`);
    }
});

test('the held-out split is frozen and the verdict rule is the backtest\'s', () => {
    assert.equal(FLOOR, 10);
    assert.equal(isTest('pf1.spell.fireball'), isTest('pf1.spell.fireball'));
    const share = load('form-transformation').filter(x => isTest(x.id)).length / load('form-transformation').length;
    assert.ok(share > 0.15 && share < 0.25, `held-out share ${share}`);
    assert.equal(verdictOf(9, 9, 1), 'insufficient-held-out');
    assert.equal(verdictOf(20, 10, 10), 'fails-baseline');
    assert.equal(verdictOf(20, 11, 10), 'passes');
});

test('a default is only a rule if it beats the majority baseline; the score rows live in derivation_rules.json', () => {
    const file = new Map(rd('docs/coverage/derivation_rules.json').rules.map(r => [r.id, r]));
    for (const slug of Object.keys(SPECS)) {
        const facts = scoringFacts(slug);
        for (const s of scores(slug, facts, fitDials(slug, facts))) {
            const w = file.get(s.id);
            assert.ok(w, `${s.id} has a score row`);
            assert.deepEqual(w.confidence, s.confidence, s.id);
            assert.equal(w.verdict, verdictOf(w.heldOutN, w.exact, w.baseline.exact), s.id);
        }
    }
    assert.equal(file.get('law.area-field.time-default').verdict, 'fails-baseline', 'the area time default is the baseline, not a rule');
    assert.equal(file.get('law.area-field.sentence-from-inside').verdict, 'fails-baseline', 'inside is not a sentence source');
});

test('composition reads the label first, never defaults the sentence, and names where each field came from', () => {
    const dials = {time: {all: 'sustained', byKind: {}}, reversal: {all: 'at-will'}};
    const row = text => factsOf('area-field', {id: 'x', ledger: 'pf1_spells', text}, {f: {}});
    assert.equal(compose('area-field', row('Effect remove.vitality/area/instant (x)'), dials).case, 'area:remove.vitality.instant.place.everyone');
    assert.equal(compose('area-field', row('Effect remove.vitality/self/sustained'), dials).case, 'area:remove.vitality.sustained.holder.everyone');
    assert.equal(compose('area-field', row('Effect move.position/area/delayed'), dials).prov.delay, 'default');
    assert.equal(compose('area-field', row('Effect block.essence/area/triggered'), dials).prov.trigger, 'default');
    assert.match(compose('area-field', row('Effect add.thing/area/sustained'), dials).blocked, /distinct identity/);
    assert.match(compose('area-field', row('[verb transform]'), dials).blocked, /no stated sentence/);
    assert.match(compose('area-field', row('Effect add.force/area/instant'), dials).blocked, /no world account/);
    const form = (text, f = {}) => compose('form-transformation', factsOf('form-transformation', {id: 'y', ledger: 'x', text}, {f}), dials);
    assert.equal(form('Effect transform.form/self/lasting').case, 'form:at-will.holder.form');
    assert.equal(form('Effect transform.form/touched/lasting', {duration: 'hours-days'}).case, 'form:timeout.other.form');
    assert.equal(form('Effect transform.form/self/instant', {reversal: 'counter'}).case, 'form:counter.holder.form');
    assert.equal(form('Effect transform.form/self/lasting').prov.reversal, 'default');
    assert.match(form('Effect transform.form/area/lasting').blocked, /area law/);
    assert.match(form('Effect add.force/self/instant').blocked, /another law/);
});

test('the dry-run take through the real cases: form change clears a quarter of its slug, area does not and goes back to design', async () => {
    const f = load('form-transformation'), a = load('area-field');
    const ft = await take('form-transformation', f, fitDials('form-transformation', f)), at = await take('area-field', a, fitDials('area-field', a));
    assert.ok(ft.rows.filter(r => r.take).length / f.length > 0.25);
    assert.ok(at.rows.filter(r => r.take).length / a.length < 0.25);
    assert.equal(at.rows.filter(r => r.test).length, a.filter(r => isTest(r.id)).length);
    assert.ok(ft.rows.every(r => !r.take || /^(expressed|runs)-/.test(r.state)));
    const l = leaning('form-transformation', ft.rows);
    assert.ok(l.noDefault > 0 && l.noDefault + l.oneDefault + l.twoPlus === l.taken);
});
