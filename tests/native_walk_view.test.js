import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeWalkView, readWalkMove} from '../src/native_walk_view.js';
import {walkMapSpec} from '../src/ui/walk_map.js';

const distances = {Village: 0, Shack: 10, 'Eastern mill': 30, 'Infested field': 15, 'Forest road': 120, 'Secret grove': 40, 'Far city': 900};
const exits = [{id: 'Shack', minutes: 10}, {id: 'Eastern mill', minutes: 30}, {id: 'Infested field', minutes: 15}];
const known = id => id !== 'Secret grove';

test('PS164: known places within reach, nearest first; exits go, further places travel', () => {
    const v = nativeWalkView({hereId: 'Village', distances, exits, known});
    assert.deepEqual(v.places.map(p => [p.place, p.minutes]), [['Village', 0], ['Shack', 10], ['Infested field', 15], ['Eastern mill', 30], ['Forest road', 120]]);
    assert.ok(!v.places.some(p => p.place === 'Secret grove'), 'an unknown place never reaches the view');
    assert.ok(!v.places.some(p => p.place === 'Far city'), 'beyond the dial');
    assert.deepEqual(v.legs.map(l => l.moveId), ['go:Shack', 'go:Infested field', 'go:Eastern mill', 'travel:Forest road']);
    assert.deepEqual(readWalkMove('travel:Forest road'), {kind: 'travel', id: 'Forest road'});
    assert.equal(readWalkMove('nope'), null);
});

test('PS164: the walk map draws it with a control per place', () => {
    const {spec, controls} = walkMapSpec(nativeWalkView({hereId: 'Village', distances, exits, known}));
    assert.equal(spec.title, 'Walks from Village');
    assert.equal(Object.keys(controls).length, 4);
    assert.ok(Object.values(controls).includes('travel:Forest road'));
    assert.deepEqual(spec.rings.map(r => r.label), ['10 min walk', '15 min walk', '30 min walk', '120 min walk']);
});
