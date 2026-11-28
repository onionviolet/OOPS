import test from 'node:test';
import assert from 'node:assert/strict';
import {worldStanding} from '../src/world_standing.js';

test('the same native rating places differently in two modeled populations', () => {
    assert.equal(worldStanding('base.frontier', 12).topPercent, 50);
    assert.equal(worldStanding('book.lotm.tingen', 12).topPercent, 44);
});
test('population estimates handle both tails and unknown worlds', () => {
    assert.equal(worldStanding('base.frontier', -1).topPercent, 100);
    assert.equal(worldStanding('base.frontier', 999).topPercent, 1);
    assert.equal(worldStanding('unmodeled', 12), null);
});
