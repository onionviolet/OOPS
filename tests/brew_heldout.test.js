import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_POTION_SENTENCES, predictionHolds} from '../src/world_packs/brew_effects_pack.js';
import {potionFamily} from '../scripts/b_coverage_ledgers.mjs';
import {MECHANISMS, splitLabelled, fitMechanisms, scoreHeldOut} from '../src/brew_heldout.js';

const labelled = HP_POTION_SENTENCES.map(s => ({id: `hp.potion.${s.subject}`, title: s.title, family: potionFamily(s.title), parts: s.parts}));
const split = splitLabelled(labelled);

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
    assert.deepEqual(fitMechanisms(splitLabelled(bent).tuned), table);
});

test('measured held-out score (diagnostic, floors set at the measured result)', () => {
    const score = scoreHeldOut(split.heldOut, fitMechanisms(split.tuned), {beforeObject: predictionHolds});
    assert.equal(score.n, 17);
    assert.deepEqual([score.beforeObject, score.afterObject, score.outcome, score.route, score.both], [14, 14, 10, 10, 8]);
});
