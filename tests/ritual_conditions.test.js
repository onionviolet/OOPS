import test from 'node:test';
import assert from 'node:assert/strict';
import {defineRitual, gradeRitual, fitScore, ritualDial} from '../src/ritual_conditions.js';
import {gradeRiteAtTransition, riteByFormula, RITE_EMOTION_MINUTES} from '../src/book_world_lotm_ritual.js';
import {fresh, run, wait, at, save, hostOver} from './lotm_helpers.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {rowById} from '../src/lotm_formula_rows.js';
import {LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';

// DWF145-DWF149: the mechanism is world-neutral; the LOTM rows prove it end to end through real commands and the bench preview.
const cond = {id: 'c', label: 'Cold', principle: {id: 'p', text: 'cold', wants: {physical: ['frozen'], functional: ['holds_cold'], symbolic: []}},
    exact: {rule: {fact: 'exact', op: 'eq', value: true}, text: 'the real thing'},
    substitutes: [{id: 's', rule: {fact: 'stand', op: 'eq', value: true}, tags: {physical: ['frozen'], functional: [], symbolic: []}, text: 'a stand-in'},
        {id: 'weak', rule: {fact: 'weak', op: 'eq', value: true}, tags: {physical: [], functional: [], symbolic: []}, text: 'a poor guess'}]};
const rite = defineRitual({id: 'r', world: 'w', formula: 'f', scale: 'solitary', label: 'R', conditions: [cond, {...cond, id: 'd', label: 'Dark', substitutes: []}]});
const dial = ritualDial('w');

test('fit counts symbolic double and an empty wish is a perfect fit', () => {
    assert.equal(fitScore({physical: ['a'], functional: [], symbolic: ['s']}, {physical: ['a'], functional: [], symbolic: []}), 0.333);
    assert.equal(fitScore({physical: [], functional: [], symbolic: []}, {physical: [], functional: [], symbolic: []}), 1);
});

test('a ritual grades met, substituted, partial and absent, never refuses, and stated odds rise with loss', () => {
    const met = gradeRitual(rite, {exact: true}, dial), sub = gradeRitual(rite, {stand: true}, dial);
    assert.equal(met.grade, 'met'); // both conditions share the same exact fact
    assert.equal(met.odds, dial.baseOdds);
    const sub2 = gradeRitual(defineRitual({id: 'r2', world: 'w', formula: 'f', scale: 'solitary', label: 'R', conditions: [cond]}), {stand: true}, dial);
    assert.equal(sub2.grade, 'substituted'); assert.equal(sub2.conditions[0].fit, 0.5);
    assert.equal(sub2.odds, Math.round(dial.baseOdds + (dial.maxOdds - dial.baseOdds) * 0.5));
    assert.equal(sub.grade, 'partial'); // stand-in cold plus no dark
    const none = gradeRitual(rite, {}, dial);
    assert.equal(none.grade, 'absent'); assert.equal(none.odds, dial.maxOdds);
    assert.ok(met.odds < sub2.odds && sub2.odds < sub.odds && sub.odds < none.odds);
});

test('a stand-in under the floor is rejected with its reason; a dial with a lower floor accepts it', () => {
    const one = defineRitual({id: 'r3', world: 'w', formula: 'f', scale: 'solitary', label: 'R', conditions: [cond]});
    const r = gradeRitual(one, {weak: true}, dial);
    assert.equal(r.grade, 'absent'); assert.match(r.conditions[0].rejected[0].reason, /below the floor/);
    assert.equal(gradeRitual(one, {weak: true}, ritualDial('w', {floor: 0})).grade, 'substituted');
});

test('malformed rituals and dials fail loudly', () => {
    assert.throws(() => defineRitual({id: 'x', world: 'w', formula: 'f', scale: 's', label: 'x', conditions: []}), /conditions/);
    assert.throws(() => defineRitual({id: 'x', world: 'w', formula: 'f', scale: 's', label: 'x', conditions: [{...cond, exact: {text: 'x'}}]}), /exact rule/);
    assert.throws(() => ritualDial('w', {baseOdds: 50, maxOdds: 10}), /odds/);
});

// LOTM rows through real commands and the bench preview. Seq 5 doses are not drinkable yet, so the grade is read from the bench preview.
const grade = (p, id) => hostOver(p).host.view(id).bench.selected.rite;
const states = r => r.conditions.map(c => c.status);
const ok = p => { assert.ok(validateLotmState(p.state)); assert.ok(validateLotmEnvelope(save(p))); };
const reported = () => run(fresh(300000), 'report_in');

test('Sun 5 grades absent, then substituted with ordinary ice in a shuttered room, then met with non-melting ice and canvas', () => {
    let p = at(reported(), L.docks);
    const none = grade(p, 'sun_5'); assert.equal(none.grade, 'absent'); assert.equal(none.odds, 90);
    p = run(p, 'rit_buy_ice'); p = at(p, L.lodging);
    const sub = grade(p, 'sun_5'); assert.equal(sub.grade, 'substituted'); assert.deepEqual(states(sub), ['substituted', 'substituted']);
    p = at(p, L.docks); p = run(p, 'rit_buy_canvas'); p = run(p, 'rit_buy_nonmelting');
    const met = grade(p, 'sun_5'); assert.equal(met.grade, 'met'); assert.equal(met.odds, 5);
    assert.ok(met.odds < sub.odds && sub.odds < none.odds); ok(p);
    assert.equal(gradeRiteAtTransition('sun_5', {}).grade, 'absent', 'empty facts grade absent at the hook');
});

test('non-melting ice needs the broker present and money; the broker route is not a lock on the rite', () => {
    let p = at(reported(), L.lodging);
    assert.throws(() => run(p, 'rit_buy_nonmelting'));
    assert.throws(() => run(at(run(fresh(10), 'report_in'), L.docks), 'rit_buy_nonmelting'));
});

test('Visionary 5 grades absent, partial with a harpy contract alone, met after a stirred feeling, substituted with the messenger pact', () => {
    let p = at(reported(), L.lodging);
    assert.equal(grade(p, 'visionary_5').grade, 'absent');
    p = run(p, 'rit_harpy_contract'); assert.equal(grade(p, 'visionary_5').grade, 'partial'); assert.throws(() => run(p, 'rit_harpy_contract'));
    p = run(p, 'rit_stir_anger'); p = wait(p, 10);
    const met = grade(p, 'visionary_5'); assert.equal(met.grade, 'met'); assert.equal(met.odds, 5); ok(p);
    p = wait(p, RITE_EMOTION_MINUTES + 5); assert.equal(grade(p, 'visionary_5').grade, 'partial', 'the feeling fades');
    let q = at(reported(), L.lodging); q = run(q, 'rit_messenger_pact'); q = run(q, 'rit_stir_joy'); q = wait(q, 10);
    const sub = grade(q, 'visionary_5'); assert.equal(sub.grade, 'substituted'); assert.ok(sub.odds > met.odds && sub.odds < 90); ok(q);
});

test('the rite data is evidence-tagged proposals and every formula it names exists', () => {
    for(const id of ['sun_5', 'visionary_5']) { const r = riteByFormula(id); assert.ok(r.evidence.length && r.proposals.length); assert.equal(rowById(id).ritual.scale, r.scale); }
});
