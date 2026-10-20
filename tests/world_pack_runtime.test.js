import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {domainRegistry} from '../src/domain_registry.js';
import {installWorldPack, installedPackIds, installedPack, packDefinitions, worldPackProjection} from '../src/world_pack_runtime.js';
import {lintWorldPack} from '../src/world_pack.js';
import {MOL_ITEM_SPECIFICATIONS, MOL_PACK_ID, molDefinitions, molSources} from '../src/book_world_mol_content.js';
import {molFacts} from '../src/book_world_mol_actions.js';
import {buildMolWorldPack} from '../src/world_pack_mol.js';

const sha = v => createHash('sha256').update(JSON.stringify(v)).digest('hex');

// WA17: SHA-256 of the canonical JSON of the hand-coded definitions, taken from the tree
// before the conversion. The pack must install exactly the same data, key order included.
test('Cyoria definitions installed from the pack are identical to the hand-coded ones', () => {
    assert.deepEqual({people: sha(molDefinitions.people), items: sha(MOL_ITEM_SPECIFICATIONS),
        sources: sha(molSources), powers: sha(molDefinitions.powers)}, {
        people: 'e7b5e02942cf8c2125dedee1c73d12b92afa30c452963f07aa94a2f6c7ab4a73',
        items: '3464f0560e29c38f47f90899b647f5ef64a8644f584702e75ef055bfc1b68065',
        sources: 'da6c1c7fc2dac4779ce3132e7763258df53049a457cb4abcfa827f77e4e2c699',
        powers: '23b5a4e8de38357c69f9c5978856a4d23f7ff1e0debc323de52c79a617b6065b'});
});

// WAC28: every pack in the install registry lints inside npm test.
test('every installed pack lints clean; a broken pack fails here and cannot install', () => {
    assert.ok(installedPackIds().includes(MOL_PACK_ID));
    // Laws must name facts molFacts actually produces (not only facts commands read).
    const engineFacts = new Set(Object.keys(molFacts({})));
    for(const fact of ['mol.nativeBound', 'mol.playerSupported', 'mol.deviceSupported']) assert.ok(engineFacts.has(fact), fact);
    for(const id of installedPackIds()) {
        const {issues} = lintWorldPack(installedPack(id), id === MOL_PACK_ID ? {engineFacts} : {});
        assert.deepEqual(issues, [], id);
    }
    const broken = buildMolWorldPack();
    broken.records.push({id: 'other.x', kind: 'item', status: 'authored'});
    assert.throws(() => installWorldPack(broken), /failed lint[\s\S]*WA9/);
    assert.throws(() => installWorldPack(buildMolWorldPack()), /already installed/);
});

test('installed packs are frozen; definitions come out as independent copies', () => {
    assert.throws(() => { installedPack(MOL_PACK_ID).records[0].id = 'x'; }, TypeError);
    const a = packDefinitions(MOL_PACK_ID, 'person'), b = packDefinitions(MOL_PACK_ID, 'person');
    a[0].label = 'changed';
    assert.notEqual(a[0].label, b[0].label);
    assert.throws(() => packDefinitions('book.mol.pack.none', 'person'), /not installed/);
});

test('the world_packs domain reports installed packs through the registry and owns no save slice', () => {
    const projected = domainRegistry.project('world_packs');
    assert.deepEqual(projected.map(p => p.id), installedPackIds());
    assert.match(projected[0].fingerprint, /^book\.mol\.pack\.cyoria_visitor@2#[0-9a-f]{16}$/);
    const envelope = domainRegistry.save({});
    assert.equal(Object.hasOwn(envelope, 'world_packs'), false);
    assert.deepEqual(worldPackProjection().map(p => p.coverage.coreFloorMet), [true]);
});

test('K8 records name real Cyoria commands', () => {
    const ids = new Set(molDefinitions.commands.map(c => c.id));
    const k8 = installedPack(MOL_PACK_ID).records.filter(r => r.part === 'K8');
    assert.ok(k8.length >= 10);
    for(const r of k8) assert.ok(ids.has(r.summary.match(/command (book\.mol\.\w+):/)[1]), r.id);
});
