// The body-surface dose route (wave 3 proposal): a preparation applied to a named surface of a body.
import test from 'node:test';
import assert from 'node:assert/strict';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {BREW_DOSE_LAW, SURFACE_UPTAKE, brewApplyMethod} from '../src/brew_dose_delivery.js';
import {BREW_PUBLISHES} from '../src/brew_law.js';
import {brewDoseQuantity} from '../src/engine_brew_stock.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {residueQuantity} from '../src/world_substrate_packs/residue_flow.js';

const A = 'surface-extract', ref = (kind, id = kind) => ({kind, id});
const dose = brewDoseQuantity(A), residue = residueQuantity(A);

function apply({marks = ['surface:skin'], units = 10, method, expect, responses = []}) {
    return {basis: 'authored', engine: {packs: ['a.mind'], host: {things: {}},
        shared: {effectKinds: BREW_PUBLISHES, quantities: [...Object.values(WORLD_QUANTITIES)], properties: [WORLD_PROPERTIES.marks, WORLD_PROPERTIES.form]}},
        world: {holders: [{id: 'bench', kind: 'place'},
            {id: 'flask', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[dose]: units}},
            {id: 'recipient', kind: 'body', place: 'bench', properties: {marks, form: 'plain', mind_awake: true, mind_mood: 10, mind_confusion: 0}}]},
        timeline: [{id: 'serve', working: {family: 'brew-dose', method, bindings: {flask: ref('flask'), recipient: ref('body', 'recipient')}}},
            {id: 'settle', advanceTo: 4, expect}], expect};
}
const q = (quantity, to, holder = 'recipient') => ({holder, quantity, direction: to === 0 ? 'unchanged' : 'up', to});
const run = data => runCaseData(data, {id: 'surface'});
const applyOf = (surface, contact, extra = {}) => brewApplyMethod({id: `t.${surface}`, surface, contact, ...extra});

test('the route is one more operation on the same law, so no saved shape changes', () => {
    assert.equal(BREW_DOSE_LAW.ref, 'b.dose@1');
    assert.deepEqual(Object.keys(BREW_DOSE_LAW.operations).sort(), ['administer', 'apply', 'coat']);
});

test('what reaches the body depends on the surface and the contact time; the rest stays as residue', async () => {
    // skin 40 permille a minute, 5 minutes: 200 permille of 10 units is 2 absorbed, 8 stay on the skin.
    const skin = apply({method: applyOf('skin', 5), expect: [q(dose, 2), q(residue, 8)]});
    assert.match((await run(skin)).state, /^expressed-/);
    // hair 100 permille a minute, 5 minutes: half.
    const hair = apply({marks: ['surface:hair'], method: applyOf('hair', 5), expect: [q(dose, 5), q(residue, 5)]});
    assert.match((await run(hair)).state, /^expressed-/);
    // a wound has no barrier: 250 a minute, 4 minutes reaches all of it and leaves no residue.
    const wound = apply({marks: ['surface:wound'], method: applyOf('wound', 4), expect: [q(dose, 10)]});
    assert.match((await run(wound)).state, /^expressed-/);
    assert.ok(SURFACE_UPTAKE.wound > SURFACE_UPTAKE.hair && SURFACE_UPTAKE.hair > SURFACE_UPTAKE.skin);
    // the dial: a stated uptake overrides the surface default, and a mismatch is a real world difference.
    const dialled = apply({method: applyOf('skin', 5, {uptakePermille: 100}), expect: [q(dose, 5), q(residue, 5)]});
    assert.match((await run(dialled)).state, /^expressed-/);
    const wrong = apply({method: applyOf('skin', 5), expect: [q(dose, 5), q(residue, 5)]});
    assert.equal((await run(wrong)).state, 'blocked:runner-expect-mismatch');
});

test('a dose response reads only what the surface let through (a real reader)', async () => {
    const response = {part: A, minimum: 5, sentence: {verb: 'transform', object: 'form', time: 'lasting'}, details: {value: 'sleek'}};
    const form = to => ({holder: 'recipient', property: 'form', direction: to === 'plain' ? 'unchanged' : 'changed', to});
    const long = apply({marks: ['surface:hair'], method: applyOf('hair', 5, {responses: [response]}), expect: [form('sleek')]});
    assert.match((await run(long)).state, /^expressed-/);
    const short = apply({marks: ['surface:hair'], method: applyOf('hair', 2, {responses: [response]}), expect: [q(dose, 2), form('plain')]});
    assert.match((await run(short)).state, /^expressed-/);
});

test('failure: a surface route asked of a body without that surface refuses with a reason', async () => {
    for (const [data, reason] of [
        [apply({marks: ['surface:skin'], method: applyOf('hair', 5), expect: [q(dose, 5)]}), 'recipient-lacks-surface'],
        [apply({marks: [], method: applyOf('skin', 5), expect: [q(dose, 2)]}), 'recipient-lacks-surface'],
        [apply({method: applyOf('skin', undefined), expect: [q(dose, 2)]}), 'contact-time-unset'],
        [apply({marks: ['surface:scales'], method: applyOf('scales', 5), expect: [q(dose, 2)]}), 'surface-uptake-unset'],
    ]) {
        const out = await run(data);
        assert.equal(out.state, 'blocked:runner-working-interrupted', JSON.stringify(out));
        assert.ok(out.detail.includes(reason), out.detail);
    }
});
