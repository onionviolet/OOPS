import assert from 'node:assert/strict';
import test from 'node:test';
import {liquorWormTrailWindow, liquorWormWineArrival} from '../src/gu_liquor_worm.js';

test('temperament and keeper familiarity change departure independently of recent wine', () => {
    const wary = {traits: {temperament: 'wary'}, experience: {keeper: {bond: 60}}};
    assert.equal(liquorWormTrailWindow(wary, 'stranger'), 6);
    assert.equal(liquorWormTrailWindow(wary, 'keeper'), 10);
    assert.equal(liquorWormTrailWindow({...wary, traits: {temperament: 'bold'}}, 'keeper'), 16);
    assert.equal(liquorWormWineArrival(20, null), 25);
    assert.equal(liquorWormWineArrival(20, 15), 35);
    assert.equal(liquorWormWineArrival(40, 15), 45);
});
