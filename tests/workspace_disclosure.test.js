import test from 'node:test';
import assert from 'node:assert/strict';
import {createReferenceDiscovery} from '../src/workspace_disclosure.js';

test('empty references disclose no navigation and do not mutate native facts', () => {
    const discover = createReferenceDiscovery(), facts = Object.freeze({bestiary:false, books:false, magic:false});
    assert.deepEqual([...discover(facts)], []);
});

test('earned records stay known during native list refresh and are derived again on restore', () => {
    const discover = createReferenceDiscovery();
    assert.deepEqual([...discover({books:true})], ['books']);
    assert.deepEqual([...discover({books:false})], ['books']);
    const restored = createReferenceDiscovery();
    assert.deepEqual([...restored({bestiary:true, books:true, magic:false})], ['bestiary','books']);
    assert.deepEqual([...createReferenceDiscovery()({books:false})], [], 'another character does not inherit the previous session');
});
