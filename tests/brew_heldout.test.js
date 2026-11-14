import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_POTION_SENTENCES, predictionHolds} from '../src/world_packs/brew_effects_pack.js';
import {potionFamily, HP_POTION_FAMILY_OVERRIDES} from '../scripts/b_coverage_ledgers.mjs';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {executeRows, outcomeCase} from '../src/brew_heldout_cases.js';
import {MECHANISMS, splitLabelled, fitMechanisms, scoreHeldOut} from '../src/brew_heldout.js';

const labelled = HP_POTION_SENTENCES.map(s => ({id: `hp.potion.${s.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`, title: s.title, family: potionFamily(s.title), parts: s.parts}));
const ruleSawTitles = Object.keys(HP_POTION_FAMILY_OVERRIDES);
const split = splitLabelled(labelled, {ruleSawTitles});

test('the split is fixed: one tuning row per labelled mechanism, nothing overlaps, override rows are not held out', () => {
    assert.deepEqual(split.tuned.map(r => r.id), ['hp.potion.blood_replenishing_potion', 'hp.potion.calming_draught', 'hp.potion.deflating_draught', 'hp.potion.doxycide']);
    const held = new Set(split.heldOut.map(r => r.id));
    for (const r of split.tuned) assert.ok(!held.has(r.id));
    assert.ok(!held.has('hp.potion.wolfsbane_potion'));
    assert.equal(split.heldOut.length, 17);
    assert.ok(!MECHANISMS.every(m => split.tuned.some(r => r.family === m)), 'conceal-or-sense has no labelled row');
});

test('the fit never reads held-out rows: changing a held-out label changes no default', () => {
    const table = fitMechanisms(split.tuned);
    const bent = labelled.map(r => split.heldOut.some(h => h.id === r.id) ? {...r, parts: {...r.parts, verb: 'release', carrier: 'bath'}} : r);
    assert.deepEqual(fitMechanisms(splitLabelled(bent, {ruleSawTitles}).tuned), table);
});

test('measured held-out score (diagnostic, floors set at the measured result)', () => {
    const score = scoreHeldOut(split.heldOut, fitMechanisms(split.tuned), {beforeObject: predictionHolds});
    assert.equal(score.n, 17);
    assert.deepEqual([score.beforeObject, score.afterObject, score.outcome, score.route, score.both], [16, 16, 11, 11, 9]);
});

const run = data => runCaseData(data, {id: 'held-out'});

test('engine execution: a wrong verb is a world mismatch, an unrunnable pair is named, never forced', async () => {
    const wrong = outcomeCase({verb: 'add', object: 'vitality'}, {verb: 'remove', object: 'vitality'});
    assert.equal((await run(wrong.data)).state, 'blocked:runner-expect-mismatch');
    const right = outcomeCase({verb: 'remove', object: 'vitality'}, {verb: 'remove', object: 'vitality'});
    assert.match((await run(right.data)).state, /^expressed-/);
    assert.match(outcomeCase({verb: 'add', object: 'vitality'}, {verb: 'alter', object: 'law'}).cannot, /no world term/);
});

test('engine execution score on the held-out rows (separate outcome and route runs)', async () => {
    const table = fitMechanisms(split.tuned);
    const res = await executeRows(split.heldOut, table, run);
    const n = key => res.filter(r => r[key] === 'match').length;
    assert.deepEqual([n('outcome'), n('route')], [15, 12]);
    const cannot = res.filter(r => r.route.startsWith('cannot')).map(r => r.id).sort();
    assert.deepEqual(cannot, ['hp.potion.dr_ubbly_s_oblivious_unction', 'hp.potion.dragon_dung_fertiliser', 'hp.potion.murtlap_essence',
        'hp.potion.sleekeazy_s_hair_potion', 'hp.potion.swelling_solution']);
    for (const r of res.filter(r => r.route.startsWith('cannot'))) assert.match(r.route, /missing mechanism/);
    const tuned = await executeRows(split.tuned, table, run);
    assert.equal(tuned.filter(r => r.outcome === 'match').length, 4);
});
