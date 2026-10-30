import test from 'node:test';
import assert from 'node:assert/strict';
import {hpCharmRows, plannedFizzle} from '../src/read_models/hp_charm_bridge.js';
import {hpSpellRows} from '../src/world_packs/book_hp_life_data.js';
import {hpLifeStatus} from '../src/book_world_hp_facts.js';

const P = 'book.hp.school';
const state = powers => ({simulation: {powers: {player: powers}, knowledge: {player: {}}}, actors: {player: {worldId: P + '.world', resources: {}}}});

test('an unlearned charm names its teacher and when the lesson runs; learned and drilled charms change the next step', () => {
    const fresh = hpCharmRows(state({}), null, hpSpellRows);
    assert.equal(fresh.length, hpSpellRows.length);
    assert.match(fresh[0].value, /Not learned yet.*Mara.*09:00/);
    assert.match(hpCharmRows(state({}), {charms: true}, hpSpellRows)[0].value, /open now/);
    const taught = hpCharmRows(state({[P + '.levitation']: {owned: true, mastery: 0, executions: 0}}), null, hpSpellRows)[0].value;
    assert.match(taught, /0 of 1 drills.*Next: Practice/);
    const ready = hpCharmRows(state({[P + '.levitation']: {owned: true, mastery: 1, executions: 0}}), null, hpSpellRows)[0].value;
    assert.match(ready, /Ready to cast.*feather.*stamina.*does not fizzle yet.*40%.*not in effect/);
});

test('the planned fizzle falls with practice and is the adapter dial, never below zero', () => {
    assert.equal(plannedFizzle(1), 40);
    assert.equal(plannedFizzle(3), 20);
    assert.equal(plannedFizzle(9), 0);
});

test('hpLifeStatus shows the charm rows for the school life and keeps the trade row shape', () => {
    const rows = hpLifeStatus(state({[P + '.repair_glass']: {owned: true, mastery: 0, executions: 0}}), {gameplay: {player: {inventory: {}}}});
    assert.ok(rows.some(r => r.label === 'Reparo · practice pane' && /0 of 1 drills/.test(r.value)));
    assert.ok(!rows.some(r => /practice steps/.test(r.value)));
});
