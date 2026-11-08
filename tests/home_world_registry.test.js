// W3a S1: a world registers homes, furniture and rooms into the home engine's own tables; native loops never see them, and a save
// holding a world home validates on load (registration runs at import, before restore).
import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHomeWorld, nativeHomeEntries, nativeFurnitureValues, nativeRoomEntries, HOME_PLACES, DOMICILE_FURNITURE, homeKey, homeWorlds} from '../src/home_content.js';
import {validateHomes, emptyHomes, homeAt, homeCapacity} from '../src/home_model.js';

const W = 'test.homeworld';
const nativeBefore = nativeHomeEntries().map(([id]) => id);
registerHomeWorld({worldId: W,
    places: {[`${W}.flat`]: {name: 'A rented flat', location: `${W}.place.flat`, tenure: 'rented', owner: `${W}.landlady`, price: 0, forms: ['human'], capacity: 6, description: 'Two rooms up a stair.'}},
    furniture: {[`${W}.cot`]: {name: 'Folding cot', slot: 'bed', price: 3, forms: ['human'], effects: {rest: 1.02}, description: 'A narrow cot.'},
        [`${W}.crate`]: {name: 'Tea crate', slot: 'box', price: 1, forms: ['human'], effects: {storage: 4}, description: 'An old crate with a lid.'}},
    rooms: {[`${W}.nook`]: {name: 'Curtain off a nook', minutes: 20, capacity: 2}}});

test('registered rows join the lookup tables but never the native loops', () => {
    assert.ok(HOME_PLACES[`${W}.flat`].registered);
    assert.equal(HOME_PLACES[`${W}.flat`].world, W);
    assert.deepEqual(nativeHomeEntries().map(([id]) => id), nativeBefore);
    assert.ok(!nativeFurnitureValues().some(f => f.world === W));
    assert.ok(!nativeRoomEntries().some(([id]) => id.startsWith(W)));
    assert.ok(homeWorlds().includes(W));
});

test('ids must be namespaced, native ids and the native world are refused', () => {
    assert.throws(() => registerHomeWorld({worldId: 'base.frontier'}), /own world id/);
    assert.throws(() => registerHomeWorld({worldId: 'test.other', places: {cottage: {}}}), /namespaced/);
    assert.throws(() => registerHomeWorld({worldId: 'test.other', furniture: {'test.other.x': {name: 'X'}}}), /furniture needs/);
});

test('failure scenario: a save holding a world home validates, finds the home by its world and location, and counts its furniture', () => {
    const flat = {id: `${W}.flat`, name: 'A rented flat', tenure: 'rented', owner: `${W}.landlady`, access: true, acquiredAt: 0, paidUntil: null,
        stock: {[homeKey('bread')]: 2}, fixtures: {bed: {key: homeKey(`${W}.cot`), owner: 'player'}, box: {key: homeKey(`${W}.crate`), owner: 'player'}}, improvements: []};
    const s = {...emptyHomes(), primary: flat.id, properties: {[flat.id]: flat}};
    const restored = JSON.parse(JSON.stringify(s));
    assert.doesNotThrow(() => validateHomes(restored, {clock: 10}));
    assert.equal(homeAt(restored, {world: W, location: `${W}.place.flat`})?.id, flat.id);
    assert.equal(homeCapacity(restored.properties[flat.id]), 10);
    // A renter may not make structural changes (the engine's own tenure rule applies to world homes too).
    restored.properties[flat.id].improvements = [`${W}.nook`];
    assert.throws(() => validateHomes(restored, {clock: 10}), /unauthorized structural improvement/);
});

test('S2: a world home is taken up at itself by its own life, with the landlord’s furniture; the world’s seller sells in its own coin', async () => {
    const {planHome} = await import('../src/home_model.js');
    registerHomeWorld({worldId: 'test.s2', furniture: {'test.s2.bed': {name: 'Iron bed', slot: 'bed', price: 0, forms: ['human'], effects: {}, description: 'The landlady’s bed.'},
        'test.s2.rug': {name: 'Rag rug', slot: 'blanket', price: 9, forms: ['human'], effects: {}, description: 'A rug.', soldAt: ['test.s2.market']}},
        places: {'test.s2.flat': {name: 'Flat', location: 'test.s2.home', tenure: 'rented', owner: 'test.s2.landlady', price: 0, forms: ['human'], capacity: 6, description: 'A flat.', startsHere: true, furnished: ['test.s2.bed']}}});
    const c = (location, money = 20) => ({world: 'test.s2', location, clock: 100, sequence: 1, alive: true, ready: true, writable: true, money, inventory: {}, body: {ownerId: 'player', controllerId: 'player', form: 'human', hands: 2, mobile: true}, nativeRights: {}});
    assert.throws(() => planHome(emptyHomes(), {type: 'settle_world_home', home: 'test.s2.flat'}, c('test.s2.market')), /not a home you can take up here/);
    const r = planHome(emptyHomes(), {type: 'settle_world_home', home: 'test.s2.flat'}, c('test.s2.home'));
    assert.equal(r.state.primary, 'test.s2.flat');
    assert.deepEqual(r.state.properties['test.s2.flat'].fixtures.bed, {key: homeKey('test.s2.bed'), owner: 'test.s2.landlady'});
    assert.throws(() => planHome(r.state, {type: 'buy', item: 'test.s2.rug'}, c('test.s2.home')), /buy this where it is sold/);
    const bought = planHome(r.state, {type: 'buy', item: 'test.s2.rug'}, c('test.s2.market'));
    assert.equal(bought.money, 11);
    assert.throws(() => planHome(r.state, {type: 'buy', item: 'test.s2.rug'}, {...c('test.s2.market'), world: 'test.homeworld'}), /buy this where it is sold/);
    assert.throws(() => planHome(r.state, {type: 'buy', item: 'Home plain bed'}, c('test.s2.market')), /Village home supplier/);
});
