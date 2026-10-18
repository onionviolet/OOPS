import test from 'node:test';
import assert from 'node:assert/strict';
import {createChangeSignal, TOPICS} from '../src/ui_change_signal.js';
import {createChangeProbes} from '../src/ui_change_probes.js';

// UIL2 regression. Reproduced 2026-10-18 on the populated fixture: after "Look around" opened
// three option groups, the Options tab still read "4 (2 ready)" while the list held 5 ready
// groups, until the next 250 ms scene poll. A published change must reach its readers before the
// next task, and a burst of publishes costs each reader one refresh.
test('a burst of publishes refreshes each subscribed reader once, before the next task', async () => {
    const signal = createChangeSignal();
    const seen = {options: 0, nav: 0, chip: 0};
    signal.subscribe({id: 'options', surface: 'village-scene', refresh: () => seen.options++});
    signal.subscribe({id: 'nav', pending: ['place', 'inventory', 'work'], refresh: () => seen.nav++});
    signal.subscribe({id: 'chip', surface: 'current-work', refresh: () => seen.chip++});
    const nextTask = new Promise(resolve => setTimeout(() => resolve({...seen}), 0));
    for (let i = 0; i < 5; i++) signal.publish('place', 'legacy:list');
    signal.publish(['inventory', 'time'], 'inventory');
    assert.deepEqual(seen, {options: 0, nav: 0, chip: 0}, 'nothing refreshes inside the publishing task');
    assert.deepEqual(await nextTask, {options: 1, nav: 1, chip: 0});
    const view = signal.inspect();
    assert.equal(view.batches, 1);
    assert.deepEqual(view.readers.find(r => r.id === 'options').last.topic, 'place');
    assert.equal(view.topics.place.publishes, 5);
});

test('readers take their topics from the surface reads; extras are listed as pending', () => {
    const signal = createChangeSignal({schedule: () => {}});
    signal.subscribe({id: 'options', surface: 'village-scene', refresh() {}});
    signal.subscribe({id: 'nav', surface: 'pane-navigation', pending: ['place', 'knowledge'], refresh() {}});
    const [options, nav] = signal.inspect().readers;
    assert.deepEqual([options.declared, options.pending], [['place'], []]);
    assert.deepEqual([nav.declared, nav.pending, nav.topics], [[], ['place', 'knowledge'], ['place', 'knowledge']]);
    assert.throws(() => signal.publish('weather'), /Unknown change topic/);
    assert.throws(() => signal.subscribe({id: 'x', surface: 'pane-navigation', refresh() {}}), /reads no topics/);
    assert.deepEqual(TOPICS, ['inventory', 'place', 'time', 'body', 'knowledge', 'combat', 'world', 'work']);
});

test('a refresh that publishes again runs in a later batch, and a loop yields to a later task', () => {
    const queue = [], later = [];
    const signal = createChangeSignal({schedule: run => queue.push(run), later: run => later.push(run)});
    let refreshes = 0;
    signal.subscribe({id: 'echo', pending: ['place'], refresh: () => { refreshes++; signal.publish('place', 'echo'); }});
    signal.publish('place', 'start');
    while (queue.length) queue.shift()();
    assert.equal(refreshes, 9, 'eight chained batches, then the ninth yields');
    assert.equal(later.length, 1);
});

test('the inspector is a copy: changing it changes no reader', () => {
    const signal = createChangeSignal({schedule: () => {}});
    signal.subscribe({id: 'chip', surface: 'current-work', refresh() {}});
    const view = signal.inspect(); view.readers[0].topics.push('combat');
    assert.deepEqual(signal.inspect().readers[0].topics, ['work']);
});

test('owner probes publish only when a value moves, never for the first read', () => {
    const published = [];
    let place = 'Village', time = '08:00';
    const compare = createChangeProbes({place: () => place, time: () => time, combat: () => { throw new Error('no combat'); }},
        {publish: (topic, source) => published.push([topic, source])});
    compare(); compare();
    assert.deepEqual(published, []);
    time = '08:01'; compare();
    place = 'Infested field'; compare(); compare();
    assert.deepEqual(published, [['time', 'probe:time'], ['place', 'probe:place']]);
});
