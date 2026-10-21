import test from 'node:test';
import assert from 'node:assert/strict';
import {temperatureBand} from '../src/temperature_band.js';

test('native cold boundary is inclusive and changes with actual tolerance', () => {
    const reading={temperature: 2, tolerance: 3, threshold: 5};
    assert.equal(temperatureBand(reading).cold,true);
    assert.equal(temperatureBand(reading).position,'at');
    assert.equal(temperatureBand({...reading,tolerance:4}).cold,false);
    assert.equal(temperatureBand({...reading,temperature:-2}).position,'below');
});
test('unavailable or proposal weather cannot invent a native temperature band', () => {
    assert.equal(temperatureBand(null),null);
    assert.equal(temperatureBand({temperature:20}),null);
    assert.equal(temperatureBand({temperature:NaN,tolerance:0,threshold:5}),null);
});
