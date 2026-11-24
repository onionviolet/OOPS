import test from 'node:test';
import assert from 'node:assert/strict';
import {riGuTabModel} from '../src/ri_gu_tab.js';

test('the Gu tab is only for Fang Yuan, and lists only the Gu he holds with their meals (D4)', () => {
    assert.equal(riGuTabModel({actors: {player: {worldId: 'elsewhere'}}}), null);
    assert.equal(riGuTabModel({actors: {player: {worldId: 'book.ri.lead.world'}}, simulation: {}, clock: 0}), null, 'no Gu and no sea: no tab');
    const m = riGuTabModel({actors: {player: {worldId: 'book.ri.lead.world'}}, clock: 100, simulation: {energies: {player: {'book.ri.primeval': {reserve: 3, policy: {capacity: 44}}}}}});
    assert.deepEqual(m, {rows: [], finds: [], aperture: {now: 3, max: 44}});
});

test('patrol finds are visible before identification, during refinement, and after claiming', () => {
    const state = {actors: {player: {worldId: 'book.ri.lead.world'}}, simulation: {}, clock: 10};
    const inventory = id => ({[JSON.stringify({id})]: 1});
    const model = id => riGuTabModel(state, inventory(id));
    assert.deepEqual(model('book.ri.lead.day.wild_gu').finds, ['Wild Gu × 1 · unrefined']);
    state.simulation.jobs = [{actorId: 'player', commandId: 'book.ri.lead.wild_refinement.cow', due: 15}];
    assert.deepEqual(riGuTabModel(state).finds, ['Refining a wild Gu · 5 min remaining']);
    state.simulation.jobs = [];
    assert.deepEqual(model('book.ri.lead.wild_refinement.little_light_gu').finds, ['Little Light Gu × 1 · refined from the wild']);
    const moonlight = model('book.ri.lead.wild_refinement.moonlight_gu');
    assert.equal(moonlight.rows.length, 1);
    assert.equal(moonlight.rows[0].next, 'now');
    assert.deepEqual(moonlight.finds, []);
});
