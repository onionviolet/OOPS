import test from 'node:test';
import assert from 'node:assert/strict';
import {runShows, RUN_WORLDS} from '../src/capability_runs_domain.js';

test('Capability runs lists every run for the home hero and only a lead\'s own run in that lead\'s life (G6)', () => {
    const ids = Object.keys(RUN_WORLDS), shown = world => ids.filter(id => runShows(id, world));
    assert.deepEqual(shown('base.frontier'), ids);
    assert.deepEqual(shown(undefined), ids, 'before a world is known nothing is hidden');
    assert.deepEqual(shown('book.ri.lead.world'), ['fang']);
    assert.deepEqual(shown('book.lotm.tingen'), ['klein']);
    assert.deepEqual(shown('book.hp.lead.world'), [], 'a life with no run of its own does not list other lives');
});
