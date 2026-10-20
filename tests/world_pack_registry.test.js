import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {BUNDLED_WORLD_PACKS, loadBundledWorldPacks, installedWorldPack, worldPackRegistry} from '../src/world_pack_registry.js';
import {domainRegistry} from '../src/domain_registry.js';
import {authorReport} from '../src/world_pack_loader.js';
import {lintWorldPack} from '../src/world_pack.js';
import {buildMolWorldPack} from '../src/world_pack_mol.js';
import * as content from '../src/book_world_mol_content.js';
import {MOL_SOURCE_HASH, MOL_SOURCE_SNAPSHOT} from '../src/book_world_mol_ids.js';

// WAC28: every bundled pack loads without errors. This is the same list the runtime installs.
test('every bundled world pack loads with no errors and none dormant', () => {
    const registry = loadBundledWorldPacks();
    assert.equal(registry.dormantPacks.size, 0, authorReport(registry));
    assert.deepEqual(registry.diagnostics.filter(d => d.severity === 'error'), []);
    assert.deepEqual([...registry.packs.keys()].sort(), BUNDLED_WORLD_PACKS.map(p => p.id).sort());
    for (const pack of BUNDLED_WORLD_PACKS) assert.deepEqual(JSON.parse(JSON.stringify(pack)), pack, `${pack.id} is plain data (WA21)`);
});

test('a broken pack added to the list fails the suite check, and a dormant pack never installs', () => {
    const broken = {...structuredClone(BUNDLED_WORLD_PACKS[0]), id: 'book.mol_broken', content: {people: [{id: 'elsewhere.x', name: 'X'}]}};
    const registry = loadBundledWorldPacks([...BUNDLED_WORLD_PACKS, broken]);
    assert.ok(registry.diagnostics.some(d => d.severity === 'error' && d.packId === 'book.mol_broken'));
    const bad = loadBundledWorldPacks([{...structuredClone(BUNDLED_WORLD_PACKS[0]), formatVersion: 99}]);
    assert.throws(() => installedWorldPack('book.mol', bad), /did not load/);
});

test('Cyoria installs from the pack: exports match the pre-conversion hash and the pack matches its ID owners', () => {
    const out = {};
    for (const k of Object.keys(content).sort()) if (typeof content[k] !== 'function') out[k] = content[k];
    const sha = createHash('sha256').update(JSON.stringify(out, null, 1) + '\n').digest('hex');
    assert.equal(sha, '5196c95ca7a7849e684f19d71035edb2d6e8aa7f2ca04d3890deb8156892ebe4', 'book_world_mol_content exports changed from the hand-coded baseline (WA17)');
    const loaded = installedWorldPack('book.mol');
    assert.equal(loaded.pack.sourceSnapshot.hash, MOL_SOURCE_HASH);
    assert.equal(loaded.pack.sourceSnapshot.locator, MOL_SOURCE_SNAPSHOT);
    assert.deepEqual(loaded.pack.content.people.map(p => [p.id, p.name]), content.molDefinitions.people.map(p => [p.id, p.label]));
    assert.ok(Object.isFrozen(content.molDefinitions.commands) && !Object.isFrozen(content.molDefinitions.people));
});

test('the world_packs domain projects pack identity and adds no save slice', () => {
    const projection = domainRegistry.project('world_packs');
    assert.deepEqual(projection.map(p => p.id), ['book.mol']);
    assert.equal(projection[0].fingerprint, worldPackRegistry.packs.get('book.mol').fingerprint);
    assert.equal(domainRegistry.list().find(d => d.id === 'world_packs').save, undefined);
});

test('the Cyoria coverage pack lints clean against the commands it cites (WAC9, WAC10)', () => {
    const mol = buildMolWorldPack();
    const facts = new Set(JSON.stringify(content.molDefinitions).match(/"fact":"[^"]+"/g).map(s => s.slice(8, -1)));
    assert.deepEqual(lintWorldPack(mol, {engineFacts: facts}).issues, []);
    const commandIds = new Set(content.molDefinitions.commands.map(c => c.id));
    for (const r of mol.records.filter(r => ['job', 'food', 'price'].includes(r.kind))) assert.ok(commandIds.has(r.engine), r.id);
});
