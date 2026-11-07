import test from 'node:test';
import assert from 'node:assert/strict';
import {readItemKey, validateItemKey} from '../src/inventory_key.js';

test('readItemKey caches one frozen parse per key and rejects non-JSON keys', () => {
    const key = JSON.stringify({id: 'Iron ore', quality: 2, parts: {a: 1}});
    const first = readItemKey(key);
    assert.equal(readItemKey(key), first);
    assert.deepEqual(first, {id: 'Iron ore', quality: 2, parts: {a: 1}});
    assert.ok(Object.isFrozen(first) && Object.isFrozen(first.parts));
    assert.equal(readItemKey('Stick'), null);
    assert.equal(readItemKey(undefined), null);
    assert.throws(() => validateItemKey('Stick'), /Invalid inventory key/);
    assert.throws(() => validateItemKey('null'), /Invalid inventory key/);
    assert.doesNotThrow(() => validateItemKey(key));
});
