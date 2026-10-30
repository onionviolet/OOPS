import test from 'node:test';
import assert from 'node:assert/strict';
import {defineHoldings, startHoldings, advanceHeld, intake, transitionView, applyTransition, heldView} from '../src/ladder_holdings.js';

// Shape samples only: invented neutral ladders, not any book's data.
const rung = (id, label, fact) => ({id, label, crossings: [{id: `${id}_x`, type: 'quota', label: `${label} quota`, fact, need: 2}], grants: [`${label} grant`]});
const catalog = {
    ladders: [
        {id: 'sample.river', world: 'sample.world', label: 'River ladder', default: true, rungs: [rung('r1', 'River 1', 'riverActs'), rung('r2', 'River 2', 'riverActs')]},
        {id: 'sample.ridge', world: 'sample.world', label: 'Ridge ladder', rungs: [rung('g1', 'Ridge 1', 'ridgeActs'), rung('g2', 'Ridge 2', 'ridgeActs')]},
    ],
    transitions: [
        {id: 'swap_ridge', kind: 'swap', label: 'Cross to the ridge', from: {ladder: 'sample.river', min: 1}, to: {ladder: 'sample.ridge', position: 1},
            requires: [{fact: 'teacher', need: true, label: 'A ridge teacher'}], costs: [{key: 'standing', amount: -2}],
            failure: {hook: 'sample.swap_fail', signs: 'Two sources pull', outcome: 'The old rung is lost'}, onFail: 'demote:1', unstated: ['cost amount']},
        {id: 'branch_ridge', kind: 'branch', label: 'Study the ridge beside the river', from: {ladder: 'sample.river', min: 2}, to: {ladder: 'sample.ridge', position: 1}},
        {id: 'fall', kind: 'demote', label: 'Fall back a rung', from: {ladder: 'sample.river', min: 1}, drop: 1, costs: [{key: 'mastery', amount: -3}]},
        {id: 'wrong_river', kind: 'wrong', label: 'Skipped a river rung', from: {ladder: 'sample.river'}, failure: {hook: 'sample.skip', signs: 'It will not settle', outcome: 'Loss of control'}},
    ],
};

test('the lead ladder is chosen from data, the default only when none is asked', () => {
    const def = defineHoldings(catalog);
    assert.equal(startHoldings(def).active, 'sample.river');
    assert.equal(startHoldings(def, 'sample.ridge').active, 'sample.ridge');
    assert.throws(() => startHoldings(def, 'sample.nope'), /Unknown ladder/);
});

test('swap, branch and demotion are rows with costs; a swap can fail by its hook', () => {
    const def = defineHoldings(catalog);
    let h = startHoldings(def);
    assert.equal(transitionView(def, h, 'swap_ridge').refusedBy.length > 0, true);
    h = advanceHeld(def, h, 'sample.river');
    const refused = transitionView(def, h, 'swap_ridge', {});
    assert.deepEqual(refused.refusedBy, ['A ridge teacher']);
    assert.equal(refused.eligible, false);
    assert.deepEqual(refused.costs, [{key: 'standing', amount: -2}]);
    assert.throws(() => applyTransition(def, h, 'swap_ridge', {}), /not available/);
    const failed = applyTransition(def, h, 'swap_ridge', {teacher: true}, {outcome: 'fail'});
    assert.equal(failed.failure.hook, 'sample.swap_fail');
    assert.equal(failed.holdings.held[0].position, 0);
    const swapped = applyTransition(def, h, 'swap_ridge', {teacher: true});
    assert.deepEqual(heldView(def, swapped.holdings).map(x => x.ladder), ['sample.ridge']);
    assert.equal(swapped.holdings.active, 'sample.ridge');
    const down = applyTransition(def, h, 'fall', {});
    assert.equal(down.holdings.held[0].position, 0);
    h = advanceHeld(def, h, 'sample.river');
    const both = applyTransition(def, h, 'branch_ridge', {});
    assert.deepEqual(both.holdings.held.map(x => x.ladder), ['sample.river', 'sample.ridge']);
    assert.equal(transitionView(def, both.holdings, 'branch_ridge').refusedBy.includes('already held'), true);
});

test('wrong-order intake fails with the row hook, in-order intake advances', () => {
    const def = defineHoldings(catalog);
    const h = startHoldings(def);
    assert.equal(intake(def, h, 'sample.river', 1).ok, true);
    const skip = intake(def, h, 'sample.river', 2);
    assert.equal(skip.ok, false);
    assert.equal(skip.failure.hook, 'sample.skip');
    const unheld = intake(def, h, 'sample.ridge', 1);
    assert.equal(unheld.ok, false);
    assert.match(unheld.failure.hook, /^sample\.ridge/);
});

test('authoring rejects bad rows', () => {
    const bad = t => defineHoldings({...catalog, transitions: [t]});
    assert.throws(() => bad({id: 'x', kind: 'swap', label: 'x', from: {ladder: 'sample.river'}, to: {ladder: 'sample.river', position: 1}}), /different target/);
    assert.throws(() => bad({id: 'x', kind: 'wrong', label: 'x', from: {ladder: 'sample.river'}}), /needs a failure/);
    assert.throws(() => bad({id: 'x', kind: 'demote', label: 'x', from: {ladder: 'sample.river'}, drop: 0}), /positive drop/);
    assert.throws(() => bad({id: 'x', kind: 'swap', label: 'x', from: {ladder: 'sample.nope'}}), /unknown source/);
});
