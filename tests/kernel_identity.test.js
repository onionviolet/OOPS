// One identity, several kinds (SC7, KW22-KW26). A Gu is read as a body from a
// real W world holder and as an item from an individual inventory key, under
// one id, inside kernel workings. W's files are unchanged.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, defineWorkingLaw, settleWorking} from '../src/kernel_working.js';
import {
    IDENTITY_SCHEMA, addIdentity, changeFacets, createIdentities, facetsOf, identityFor, identityHistory, identityReader,
    restoreIdentities, serializeIdentities,
} from '../src/kernel_identity.js';
import {applyWorldOps, composeSubstrate, createWorld} from '../src/world_substrate.js';

const rules = composeSubstrate({packs: [{id: 'k.identity_probe', revision: 0, reads: [], writes: [], laws: [], reactors: []}]});
const world = () => createWorld(rules, {clock: 0, holders: [
    {id: 'den', kind: 'place', place: null, tags: [], quantities: {}},
    {id: 'gu:moon-1', kind: 'body', place: 'den', tags: ['gu'], quantities: {}},
]});
const moonKey = JSON.stringify({id: 'Moonlight Gu', individual: 'gu:moon-1'});
const registry = () => addIdentity(createIdentities(), {id: 'gu:moon-1', at: 0, cause: 'refined',
    facets: {body: {owner: 'w.holder', key: 'gu:moon-1'}, item: {owner: 'inventory', key: moonKey}}});

const law = defineWorkingLaw({id: 'kernel.test.identity', revision: 1, operations: {
    feed: {roles: {keeper: 'actor', gu: 'body'}, minutes: 10, settle: ({bound}) => ({ok: true,
        effects: [{kind: 'fed', id: bound.gu.id, place: bound.gu.place}]})},
    lend: {roles: {from: 'actor', thing: 'item'}, minutes: 5, settle: ({bound}) => ({ok: true,
        effects: [{kind: 'lent', id: bound.thing.id, key: bound.thing.facet.key}]})},
}});
const method = {id: 'feed-then-lend', revision: 1, law: law.ref, roles: {keeper: 'actor', gu: 'body', thing: 'item'}, steps: [
    {op: 'feed', bindings: {keeper: 'keeper', gu: 'gu'}},
    {op: 'lend', bindings: {from: 'keeper', thing: 'thing'}},
]};
const bindings = {keeper: {kind: 'actor', id: 'player'}, gu: {kind: 'body', id: 'gu:moon-1'}, thing: {kind: 'item', id: 'gu:moon-1'}};
const owners = (w, inventory) => ({
    'w.holder': key => w.holders[key] ?? null,
    inventory: key => inventory[key] ? {count: inventory[key]} : null,
    actors: key => ({key}),
});
const readAll = (reg, w, inventory) => {
    const read = identityReader(reg, owners(w, inventory));
    return (ref, at) => ref.kind === 'actor' ? {kind: 'actor', id: ref.id} : read(ref, at);
};

test('one id is a W body and an individual item, and both bind in one working', () => {
    const reg = registry();
    const {record, effects} = settleWorking(law, beginWorking(law, method, {id: 'moon.care', bindings, at: 0}),
        {now: 99, ports: {read: readAll(reg, world(), {[moonKey]: 1})}});
    assert.equal(record.status, 'complete');
    assert.deepEqual(effects.map(row => row.effect), [{kind: 'fed', id: 'gu:moon-1', place: 'den'}, {kind: 'lent', id: 'gu:moon-1', key: moonKey}]);
    assert.deepEqual(Object.keys(facetsOf(reg, 'gu:moon-1')).sort(), ['body', 'item']);
    assert.deepEqual(identityFor(reg, 'inventory', moonKey), {id: 'gu:moon-1', kind: 'item'});
    assert.deepEqual(identityFor(reg, 'w.holder', 'gu:moon-1'), {id: 'gu:moon-1', kind: 'body'});
});

test('the registry copies no state: the owners answer, so a death shows through the body facet only', () => {
    const reg = registry();
    const dead = applyWorldOps(rules, world(), [{op: 'holder_remove', holder: 'gu:moon-1'}], 'test:death');
    const read = readAll(reg, dead, {[moonKey]: 1});
    assert.equal(read({kind: 'body', id: 'gu:moon-1'}, 0), null);
    assert.equal(read({kind: 'item', id: 'gu:moon-1'}, 0).count, 1);
    const {record} = settleWorking(law, beginWorking(law, method, {id: 'moon.care', bindings, at: 0}), {now: 99, ports: {read}});
    assert.equal(record.status, 'interrupted');
    assert.deepEqual([record.receipts[0].cause, record.receipts[0].role], ['binding', 'gu']);
    assert.equal(JSON.stringify(reg).includes('quantities'), false);
});

test('a stack is not one thing: an item facet must point at an individual key', () => {
    const read = readAll(registry(), world(), {[moonKey]: 3});
    assert.equal(read({kind: 'item', id: 'gu:moon-1'}, 0), null);
    assert.throws(() => addIdentity(registry(), {id: 'gu:moon-2', at: 1, cause: 'copy',
        facets: {item: {owner: 'inventory', key: moonKey}}}), /another identity/);
    assert.throws(() => addIdentity(registry(), {id: 'gu:moon-1', at: 1, cause: 'again', facets: {item: {owner: 'x', key: 'y'}}}), /new identity/);
    assert.throws(() => addIdentity(createIdentities(), {id: 'empty', at: 0, cause: 'none', facets: {}}), /at least one facet/);
});

test('a characteristic stays one individual from remnant to item to potion input (MR41)', () => {
    let reg = addIdentity(createIdentities(), {id: 'char:seer-9', at: 100, cause: 'death of the Beyonder',
        facets: {remnant: {owner: 'people', key: 'npc.seer'}}});
    reg = changeFacets(reg, 'char:seer-9', {remove: ['remnant'], add: {item: {owner: 'inventory', key: '{"id":"Seer characteristic","n":9}'}},
        at: 160, cause: 'recovered from the body'});
    reg = changeFacets(reg, 'char:seer-9', {remove: ['item'], add: {ingredient: {owner: 'batch', key: 'brew:41/main'}},
        at: 300, cause: 'added to the brew'});
    assert.deepEqual(Object.keys(facetsOf(reg, 'char:seer-9')), ['ingredient']);
    assert.deepEqual(identityHistory(reg, 'char:seer-9').map(({at, change, kind}) => [at, change, kind]),
        [[100, 'add', 'remnant'], [160, 'remove', 'remnant'], [160, 'add', 'item'], [300, 'remove', 'item'], [300, 'add', 'ingredient']]);
    assert.deepEqual(identityFor(reg, 'batch', 'brew:41/main'), {id: 'char:seer-9', kind: 'ingredient'});
    assert.equal(identityFor(reg, 'people', 'npc.seer'), null);
    assert.throws(() => changeFacets(reg, 'char:seer-9', {remove: ['item'], at: 301, cause: 'x'}), /no item facet/);
});

test('the registry saves as one versioned record; unknown versions and double claims are refused', () => {
    const reg = registry();
    const restored = restoreIdentities(JSON.parse(JSON.stringify(serializeIdentities(reg))));
    assert.deepEqual(restored, reg);
    assert.equal(restored.schema, IDENTITY_SCHEMA);
    assert.throws(() => restoreIdentities({...reg, schema: 'kernel.identity@9'}), /Unsupported/);
    const doubled = structuredClone(reg);
    doubled.entries['gu:copy'] = {facets: {item: {owner: 'inventory', key: moonKey}}, history: []};
    assert.throws(() => restoreIdentities(doubled), /Two identities/);
});
