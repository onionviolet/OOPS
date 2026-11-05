import test from 'node:test';
import assert from 'node:assert/strict';
import {registerPeopleSource,peopleSources} from '../src/people_sources.js';
import '../src/book_world_mol_content.js';
import '../src/book_world_lotm_cast_host.js';

test('worlds register people sources in stable order and can unregister', () => {
    const before = peopleSources().length;
    assert.ok(before >= 2);
    const off = registerPeopleSource('t', 45, () => []);
    assert.equal(peopleSources().length, before + 1);
    off();
    assert.equal(peopleSources().length, before);
    assert.throws(() => registerPeopleSource('', 1, () => []), TypeError);
});
