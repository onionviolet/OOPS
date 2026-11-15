import test from 'node:test';
import assert from 'node:assert/strict';
import {riGuTabModel} from '../src/ri_gu_tab.js';

test('the Gu tab is only for Fang Yuan, and lists only the Gu he holds with their meals (D4)', () => {
    assert.equal(riGuTabModel({actors: {player: {worldId: 'elsewhere'}}}), null);
    assert.equal(riGuTabModel({actors: {player: {worldId: 'book.ri.lead.world'}}, simulation: {}, clock: 0}), null, 'no Gu and no sea: no tab');
    const m = riGuTabModel({actors: {player: {worldId: 'book.ri.lead.world'}}, clock: 100, simulation: {energies: {player: {'book.ri.primeval': {reserve: 3, policy: {capacity: 44}}}}}});
    assert.deepEqual(m, {rows: [], aperture: {now: 3, max: 44}});
});
