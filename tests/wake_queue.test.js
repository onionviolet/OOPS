import test from 'node:test';
import assert from 'node:assert/strict';
import {createWakeQueue} from '../src/wake_queue.js';

test('empty, future and overdue wakes use caller time without consuming reads', () => {
    const q = createWakeQueue();
    assert.equal(q.nextWake(0), null);
    q.register('actor', 30);
    assert.equal(q.nextWake(10), 30);
    assert.equal(q.nextWake(40), 40);
    assert.deepEqual(q.due(29), []);
    assert.deepEqual(q.due(40), [{id:'actor', at:30}]);
    assert.equal(q.size, 0);
});

test('replacement, cancellation and rescheduling cannot leave stale wakes', () => {
    const q = createWakeQueue();
    q.register('a', 1); q.register('b', 2); q.register('c', 3);
    q.register('a', 10); q.register('c', 0);
    assert.equal(q.size, 3);
    assert.equal(q.cancel('b'), true);
    assert.equal(q.cancel('missing'), false);
    assert.deepEqual(q.due(5), [{id:'c', at:0}]);
    q.register('c', 6);
    assert.deepEqual(q.due(10), [{id:'c', at:6}, {id:'a', at:10}]);
});

test('identical actor simulations give identical order and state in reversed registration order', () => {
    const actors = Array.from({length:270}, (_, i) => `actor.${String(i).padStart(3, '0')}`);
    const run = order => {
        const q = createWakeQueue(), state = {}, orderOfWakes = [];
        for (const id of order) q.register(id, 10);
        while (q.size) {
            const at = q.nextWake(0);
            for (const wake of q.due(at)) {
                orderOfWakes.push(wake); state[wake.id] = (state[wake.id] || 0) + 1;
                if (state[wake.id] < 3) q.register(wake.id, at + 20);
            }
        }
        return {orderOfWakes, state};
    };
    const first = run(actors), second = run([...actors].reverse());
    assert.deepEqual(first, second);
    assert.equal(first.orderOfWakes.length, 810);
    assert.deepEqual(first.orderOfWakes.slice(0, 270).map(w => w.id), actors);
});

test('indexed heap agrees with a sorted model after mixed replacements and removals', () => {
    const q = createWakeQueue(), model = new Map();
    for (let i = 0; i < 10000; i++) {
        const id = `actor.${(i * 37) % 311}`, at = (i * 19) % 997;
        q.register(id, at); model.set(id, at);
        if (i % 7 === 0) { const remove = `actor.${(i * 13) % 311}`; q.cancel(remove); model.delete(remove); }
    }
    const expected = [...model].map(([id, at]) => ({id, at})).sort((a,b) => a.at-b.at || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    assert.equal(q.size, model.size);
    assert.deepEqual(q.due(1000), expected);
});

test('invalid registrations do not remove an existing wake', () => {
    const q = createWakeQueue(); q.register('actor', 4);
    for (const at of [-1, NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
        assert.throws(() => q.register('actor', at), TypeError);
        assert.throws(() => q.nextWake(at), TypeError);
        assert.throws(() => q.due(at), TypeError);
    }
    assert.throws(() => q.register('', 1), TypeError);
    assert.deepEqual(q.due(4), [{id:'actor', at:4}]);
});
