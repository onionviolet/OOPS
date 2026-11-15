// PS196/PS202: the crossing is hidden by default; "Cross freely" shows it, and walks with test hooks get it on unless told off.
import test from 'node:test';
import assert from 'node:assert/strict';
import {crossFreelyFrom} from '../src/ui/cross_freely.js';

test('cross freely is off by default, on with test hooks, and a stored choice wins either way', () => {
    assert.equal(crossFreelyFrom(null, false), false);
    assert.equal(crossFreelyFrom(null, true), true);
    assert.equal(crossFreelyFrom('on', false), true);
    assert.equal(crossFreelyFrom('off', true), false);
});
