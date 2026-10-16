import test from 'node:test';
import assert from 'node:assert/strict';
import {createDurableSaveWriter, serializeDurableSave} from '../src/save_files.js';

function memoryStorage() {
    const map = new Map(), writes = [];
    return {writes, getItem: k => map.has(k) ? map.get(k) : null, setItem(k, v) {writes.push(k); map.set(k, String(v));},
        removeItem: k => map.delete(k), key: i => [...map.keys()][i] ?? null, get length() {return map.size;}};
}
const life = (minute, at = 'Mon 10:00', playtime = minute) => ({'game version': 'v0.6', saved_at: at, total_playtime: playtime, 'current time': {minute}, nested: {saved_at: 'kept'}});

test('the serialized bytes equal a plain JSON.stringify, including replacement-pattern text', () => {
    for(const save of [life(1), {...life(2), saved_at: 'a$&b$1'}, {saved_at: 3, total_playtime: 0.5, x: '\u0000'}]) {
        assert.equal(serializeDurableSave(save).serialized, JSON.stringify(save));
    }
    const original = life(1);
    serializeDurableSave(original);
    assert.deepEqual(original, life(1), 'the save object is restored');
    assert.equal(serializeDurableSave({x: 1}).body, null, 'no counters, no skip');
});

test('only a write that changes nothing but the two counters is skipped', () => {
    const storage = memoryStorage(), writer = createDurableSaveWriter(storage);
    assert.equal(writer.write('save data', life(1)), true);
    assert.equal(writer.write('save data', life(1, 'Mon 10:01', 9)), false);
    assert.equal(JSON.parse(storage.getItem('save data')).saved_at, 'Mon 10:00', 'storage keeps the last real write');
    assert.equal(writer.write('save data', life(2, 'Mon 10:02', 10)), true, 'any state difference writes');
    assert.equal(writer.write('save data', {...life(2), nested: {saved_at: 'changed'}}), true, 'nested fields with counter names still count');
    assert.deepEqual(storage.writes, ['save data', 'save data', 'save data']);
});

test('forced writes and flush store the latest counters', () => {
    const storage = memoryStorage(), writer = createDurableSaveWriter(storage);
    writer.write('save data', life(1));
    assert.equal(writer.write('save data', life(1, 'later', 5), {force: true}), true);
    assert.equal(JSON.parse(storage.getItem('save data')).saved_at, 'later');
    writer.write('save data', life(1, 'latest', 7));
    writer.flush();
    assert.equal(JSON.parse(storage.getItem('save data')).total_playtime, 7);
    const count = storage.writes.length; writer.flush();
    assert.equal(storage.writes.length, count, 'nothing pending, nothing written');
});

test('another writer of the key disables the skip and the flush', () => {
    const storage = memoryStorage(), writer = createDurableSaveWriter(storage);
    writer.write('save data', life(1));
    storage.setItem('save data', JSON.stringify(life(40, 'imported')));
    assert.equal(writer.write('save data', life(1, 'x', 2)), true, 'the stored bytes changed, so this writes');
    writer.write('save data', life(1, 'y', 3));
    storage.setItem('save data', JSON.stringify(life(50, 'imported')));
    writer.flush();
    assert.equal(JSON.parse(storage.getItem('save data')).saved_at, 'imported', 'an import before reload is never overwritten');
});

test('a storage getter is read at each write', () => {
    let storage = memoryStorage();
    const writer = createDurableSaveWriter(() => storage), first = storage;
    writer.write('save data', life(1));
    storage = memoryStorage();
    assert.equal(writer.write('save data', life(1, 'z', 4)), true, 'a new storage object has no matching bytes');
    assert.equal(first.writes.length, 1);
    assert.equal(JSON.parse(storage.getItem('save data')).saved_at, 'z');
});

test('a failed write throws, leaves no skip state and no flush', () => {
    const storage = memoryStorage();
    let fail = false;
    const writer = createDurableSaveWriter(storage, (s, k, v) => {if(fail) throw new Error('full'); s.setItem(k, v);});
    writer.write('save data', life(1));
    writer.write('save data', life(1, 'b', 2));
    fail = true;
    assert.throws(() => writer.write('save data', life(2)), /full/);
    fail = false;
    assert.equal(writer.write('save data', life(1, 'c', 3)), true, 'after a failure the next write is real');
    writer.flush();
    assert.equal(JSON.parse(storage.getItem('save data')).saved_at, 'c');
});
