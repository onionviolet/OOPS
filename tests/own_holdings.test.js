import test from 'node:test';
import assert from 'node:assert/strict';
import {registerOwnHoldings, ownHoldingsView, lifeHoldings} from '../src/own_holdings.js';
import {applyWorldLook} from '../src/world_look.js';
import {configureUiPorts} from '../src/ui_ports.js';

const W = 'test.own_holdings.world', TEXT = {purse: 'nothing of yours', items: 'You carry nothing.', body: 'Not the hero sheet.'};
const stateWith = (units, items = {}) => ({actors: {player: {resources: {'test.units': units}}}, simulation: {people: {player: {inventory: 'simulation'}}, owners: {player: items}}});
// A throwaway page: just the two hosts the notices sit in.
const fakeRoot = () => {
    const hosts = Object.fromEntries(['inventory_div', 'basic_character_info_div'].map(id => [id, {kids: [], getElementById: null}]));
    const mk = host => ({querySelector: () => host.kids[0] ?? null, prepend: n => host.kids.unshift(n)});
    const doc = {getElementById: id => hosts[id] ? mk(hosts[id]) : null, createElement: () => ({dataset: {}, remove() {}, textContent: ''})};
    return {root: {dataset: {}, ownerDocument: doc}, hosts};
};

test('a live reader shows the life\'s own units, follows a spend, and falls back to the static text', () => {
    const off = registerOwnHoldings(W, TEXT, {
        purse: s => `${lifeHoldings(s).resources['test.units']} units`,
        items: s => Object.entries(lifeHoldings(s).items).map(([k, n]) => `${k} x${n}`),
    });
    try {
        assert.equal(ownHoldingsView(W, stateWith(3)).purse, '3 units');
        assert.equal(ownHoldingsView(W, stateWith(2)).purse, '2 units', 'after a spend');
        assert.equal(ownHoldingsView(W, stateWith(2, {wand: 1, paper: 4})).items, 'wand x1, paper x4');
        assert.equal(ownHoldingsView(W, stateWith(2)).items, TEXT.items, 'an empty list falls back');
    } finally { off(); }
    const bad = registerOwnHoldings(W, TEXT, {purse: () => { throw new Error('boom'); }, items: () => 42});
    try { assert.deepEqual(ownHoldingsView(W, stateWith(3)), {...TEXT}, 'throwing and unusable readers fall back'); } finally { bad(); }
    const plain = registerOwnHoldings(W, TEXT);
    try { assert.deepEqual(ownHoldingsView(W, stateWith(3)), {...TEXT}, 'no reader is the static entry'); } finally { plain(); }
});

test('the root hook shows live holdings only for a registered world and writes nothing new elsewhere', () => {
    const state = stateWith(3);
    configureUiPorts({expansion: () => state});
    const off = registerOwnHoldings(W, TEXT, {purse: s => `${s.actors.player.resources['test.units']} units`});
    try {
        const a = fakeRoot();
        applyWorldLook(a.root, W);
        assert.equal(a.root.dataset.ownHoldings, 'on');
        const other = fakeRoot();
        applyWorldLook(other.root, 'base.frontier');
        assert.equal(other.root.dataset.ownHoldings, undefined, 'the native Village gets nothing new');
        assert.equal(other.hosts.inventory_div.kids.length, 0);
        assert.equal(ownHoldingsView('base.frontier', state), null);
    } finally { off(); configureUiPorts(null); }
    assert.equal(ownHoldingsView(W, stateWith(3)), null, 'unregistered after cleanup');
});

test('HP school and trade show their own units, debt and stock live, and the native Village shows nothing new', async () => {
    const {registerHpLifeHoldings} = await import('../src/hp_life_holdings.js');
    const res = (world, units, debt) => ({actors: {player: {worldId: world, resources: world.startsWith('book.hp.school') ? {'book.hp.school.allowance': units, 'book.hp.school.debt': debt} : {'book.hp.trade.coins': units, 'book.hp.trade.debt': debt}}}, simulation: {people: {player: {inventory: 'native'}}}});
    const row = count => ({item: {}, count});
    let rows = {};
    configureUiPorts({character: () => ({getItems: () => rows})});
    const off = registerHpLifeHoldings();
    try {
        rows = {'{"id":"book.hp.school.wand"}': row(1), '{"id":"book.hp.school.paper"}': row(6), '{"id":"book.hp.trade.wand"}': row(1), 'bread': row(3)};
        const school = ownHoldingsView('book.hp.school.world', res('book.hp.school.world', 8, 4));
        assert.equal(school.purse, '8 allowance units, 4 owed to the supply fund');
        assert.equal(school.items, 'wand, paper x6', 'only the life\'s own stock, not the Village bread or the trade wand');
        rows['{"id":"book.hp.school.paper"}'] = row(5);
        assert.equal(ownHoldingsView('book.hp.school.world', res('book.hp.school.world', 4, 0)).purse, '4 allowance units, no debt');
        assert.equal(ownHoldingsView('book.hp.school.world', res('book.hp.school.world', 4, 0)).items, 'wand, paper x5', 'paper follows the spend');
        const trade = ownHoldingsView('book.hp.trade.world', res('book.hp.trade.world', 12, 6));
        assert.equal(trade.purse, '12 trade units, 6 rent owed');
        assert.equal(trade.items, 'wand');
        assert.equal(ownHoldingsView('book.hp.trade.world', res('book.hp.trade.world', 16, 6)).purse, '16 trade units, 6 rent owed');
        assert.equal(ownHoldingsView('book.hp.school.world', {actors: {player: {resources: {}}}}).purse, '8 allowance units, 4 owed to the supply fund', 'no resource falls back to the static text');
        assert.equal(ownHoldingsView('base.frontier', res('base.frontier', 1, 1)), null);
    } finally { off(); configureUiPorts(null); }
    assert.equal(ownHoldingsView('book.hp.school.world', null), null);
});

test('a life item key with an extra field or other serialization still reads its name; unparsable keys are skipped', async () => {
    const {hpLifeHoldingsReaders} = await import('../src/hp_life_holdings.js');
    const rows = {'{"id":"book.hp.school.wand","q":2}': {count: 1}, '{"q":1,"id":"book.hp.school.paper"}': {count: 3}, 'not json': {count: 1}, '{"id":"book.hp.trade.wand"}': {count: 1}, '{"id":"book.hp.school."}': {count: 1}};
    configureUiPorts({character: () => ({getItems: () => rows})});
    try { assert.deepEqual(hpLifeHoldingsReaders({id: 'book.hp.school', labels: {wand: 'wand', paper: 'paper'}}).items(), ['wand', 'paper x3']); }
    finally { configureUiPorts(null); }
});

test('Gu and Shadow Slave lives show their own essence, stones and stock live, with static fallbacks', async () => {
    const {registerBookLifeHoldings} = await import('../src/book_life_holdings.js');
    const st = (life, energy, reserve, capacity) => ({actors: {player: {resources: {}}}, simulation: {people: {player: {inventory: 'native'}}, energies: energy ? {player: {[`${life}.${energy}`]: {reserve, policy: {capacity}}}} : {}}});
    const row = count => ({item: {}, count});
    let rows = {};
    configureUiPorts({character: () => ({getItems: () => rows})});
    const off = registerBookLifeHoldings();
    const view = (life, state) => ownHoldingsView(`${life}.world`, state);
    try {
        rows = {'{"id":"book.ss.apprentice.shard"}': row(2), '{"id":"book.ss.apprentice.coat"}': row(1), '{"id":"book.ss.trial.supplies"}': row(4), bread: row(3)};
        let v = view('book.ss.apprentice', st('book.ss.apprentice', 'essence', 12, 12));
        assert.equal(v.purse, '12/12 essence, no coin');
        assert.equal(v.items, 'soul shard x2, coat', 'only the life\'s own stock, no Village bread');
        assert.equal(view('book.ss.apprentice', st('book.ss.apprentice', 'essence', 9, 12)).purse, '9/12 essence, no coin', 'follows a spend');
        assert.equal(view('book.ss.apprentice', st('x')).purse, '12 essence, no coin', 'no energy falls back');

        assert.equal(view('book.ss.trial', st('book.ss.trial')).items, 'trial supplies x4', 'trial has no other-life items');
        assert.equal(view('book.ss.trial', st('book.ss.trial')).purse, 'no coin; trial supplies only');

        rows = {'{"id":"book.ss.company.badge"}': row(1), '{"id":"book.ss.company.ration"}': row(8), '{"id":"book.ss.company.gem"}': row(2)};
        v = view('book.ss.company', st('book.ss.company'));
        assert.equal(v.purse, '1 stipend badge, no coin');
        assert.equal(v.items, 'ration x8, soul gem x2', 'the badge is the purse, not an item');

        rows = {'{"id":"book.ri.academy.petals"}': row(12), '{"id":"book.ri.academy.gu"}': row(1)};
        v = view('book.ri.academy', st('book.ri.academy', 'primeval', 5, 6));
        assert.equal(v.purse, '5/6 primeval essence, no coin');
        assert.equal(v.items, 'petals x12, Moonlight Gu');

        rows = {'{"id":"book.ri.keeper.stone"}': row(3), '{"id":"book.ri.keeper.petals"}': row(8)};
        v = view('book.ri.keeper', st('book.ri.keeper', 'primeval', 8, 12));
        assert.equal(v.purse, '3 primeval stones, 8/12 primeval essence');
        assert.equal(v.items, 'petals x8');
        rows = {'{"id":"book.ri.keeper.stone"}': row(1)};
        assert.equal(view('book.ri.keeper', st('book.ri.keeper', 'primeval', 8, 12)).purse, '1 primeval stone, 8/12 primeval essence');
        rows = {};
        assert.equal(view('book.ri.keeper', st('book.ri.keeper', 'primeval', 8, 12)).purse, '0 primeval stones, 8/12 primeval essence', 'spent to zero shows zero');
        assert.equal(view('book.ri.keeper', null).items, 'petals and a few Gu carriers', 'empty stock falls back');
        assert.equal(ownHoldingsView('base.frontier', st('x')), null, 'the native Village shows nothing new');
    } finally { off(); configureUiPorts(null); }
    assert.equal(ownHoldingsView('book.ri.keeper.world', null), null);
});

test('purseEffect: one effect shape for native and actor purses', async () => {
    const {purseEffect, NATIVE_PURSE, purseBalance} = await import('../src/own_holdings.js');
    assert.deepEqual(purseEffect(480), {type: 'resource', actor: 'player', key: 'money', native: true, amount: 480});
    assert.deepEqual(purseEffect(-5, {actor: 'player', key: 'hp.knuts'}), {type: 'resource', actor: 'player', key: 'hp.knuts', amount: -5});
    assert.equal(purseBalance({actors: {player: {resources: {'hp.knuts': 7}}}}, {actor: 'player', key: 'hp.knuts'}), 7);
    assert.equal(purseBalance({}, NATIVE_PURSE), undefined);
    assert.throws(() => purseEffect(NaN), TypeError);
});
