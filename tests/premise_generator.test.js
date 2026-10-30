import test from 'node:test';
import assert from 'node:assert/strict';
import {offerPremises, premiseWorld, resolveWithPremise, TONE_DIAL} from '../src/premise_generator.js';
import {frontierPremises as premises} from '../src/data/premises_frontier.js';
import {frontierStartWorld as world} from '../src/data/start_layers_frontier.js';
import {resolveStart} from '../src/start_records.js';

test('an offer is seeded, repeatable, distinct by tone and always keeps a plain start', () => {
    const a = offerPremises({world, premises, seed: 'abc'}), b = offerPremises({world, premises, seed: 'abc'});
    assert.deepEqual(a, b);
    assert.equal(new Set(a.map(x => x.tone)).size, a.length);
    assert.ok(a.some(x => x.tone === 'ordinary'));
});

test('the tone dial turns villain and funny off for a world', () => {
    const dial = {...TONE_DIAL, villain: 0, funny: 0};
    for(const seed of ['1', '2', '3', '4', '5', '6']) assert.ok(offerPremises({world, premises, seed, dial, count: 4}).every(x => ['ordinary', 'odd'].includes(x.tone)));
});

test('a locked premise lands in the resolved start and leaves the other axes alone', () => {
    const plain = resolveStart(world, {entry: {mode: 'lock', layerId: 'vanilla'}}, 's1');
    const r = resolveWithPremise(world, premises, 's1', 'wrong-cart', {entry: {mode: 'lock', layerId: 'vanilla'}});
    assert.ok(r.snapshot.text.some(t => t.includes('turnips')));
    assert.deepEqual(r.layers.filter(l => l.axis !== 'premise').map(l => l.id), plain.layers.map(l => l.id));
    assert.equal(r.snapshot.location, 'Village');
    assert.throws(() => resolveWithPremise(world, premises, 's1', 'nope'), /Unknown start layer/);
    assert.ok(premiseWorld(world, premises).axes.at(-1) === 'premise' && !world.axes.includes('premise'));
});

test('a rolled premise is repeatable per seed and draws every tone across seeds', () => {
    const tones = new Set();
    for(let i = 0; i < 80; i++) {
        const r = resolveWithPremise(world, premises, `seed${i}`, null), again = resolveWithPremise(world, premises, `seed${i}`, null);
        assert.deepEqual(r.provenance, again.provenance);
        tones.add(premises.find(p => p.id === r.layers.find(l => l.axis === 'premise').id).tone);
    }
    assert.deepEqual([...tones].sort(), ['funny', 'odd', 'ordinary', 'villain']);
});
