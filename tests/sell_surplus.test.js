import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState, advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitManagement} from '../src/management/host.js';
import {I, K} from '../src/management/shared.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHiredHands, handDigestRows, WEEK} from '../src/hired_hands.js';
import {PLOT_JOB, SELL_DIALS} from '../src/hired_hands_plot.js';
import {loot_sold_count} from '../src/market_saturation.js';
import '../src/livelihood_sources.js';

// OB12: a standing order on the hired-hand plot sells grain above N to the Village market on the clock. Fixture money and stock are test values.
const body = {id: 'native.player.body', form: 'human', ownerId: 'player', controllerId: 'player', hands: 2, mobile: true};
const ctx = (p, extra = {}) => ({actorId: 'player', external: p.external, gameplay: p.gameplay, vitals: p.vitals || {player: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}},
    facts: {location: 'Village'}, nativeBody: body, nativeAlive: true, nativeReady: true, managementPlayerLocation: 'Village', managementPlayerAlive: true, managementHost: true, ...extra});
const keep = (p, out) => ({...out, vitals: out.vitals || p.vitals});
const run = (p, id) => keep(p, commitManagement(p.state, registry, {id}, ctx(p), p.state.sequence));
const base = money => ({state: initializeExpedition(createExpansionState(17)), external: {money}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}}});
const box = {p: null};
const advance = minutes => {
    const p = box.p, c = ctx(p);
    const others = Object.fromEntries(Object.keys(p.state.simulation?.people || {}).filter(id => id !== 'player').map(id => [id, {...c, actorId: id, vitals: p.state.simulation.people[id].vitals, facts: {...c.facts, location: undefined}}]));
    const out = advanceSimulation(p.state, registry, minutes, p.external, p.gameplay, {player: {...c, vitals: c.vitals.player}, ...others});
    box.p = {...p, state: out.state, external: out.external ?? p.external, gameplay: out.gameplay ?? p.gameplay};
    domainRegistry.tick(minutes);
};
function setup(money = 300, seeds = 0) {
    let p = run(run(base(money), I.begin), 'mg.farm.rent_plot');
    for (let i = 0; i < seeds; i++) p = run(p, 'mg.supply.seed');
    box.p = p;
    configureHiredHands({plan: () => structuredClone(box.p), commit: plan => { box.p = plan; }, writable: () => true, logMessage: () => {}});
    domainRegistry.load({});
}
const cmd = (name, args) => domainRegistry.command('hired_hands', name)(args);
const hire = () => cmd('hire', {jobId: PLOT_JOB, hand: I.sela, crop: 'grain'});
const order = sellAbove => cmd('order', {jobId: PLOT_JOB, sellAbove});
const stock = k => box.p.gameplay.player.inventory[k] || 0;
const giveGrain = n => { box.p.gameplay.player.inventory[K.grain] = n; };
const sold = () => box.p.market?.Village?.['Courtyard grain']?.[0]?.sold || 0;
const lines = () => handDigestRows(0).filter(r => /sold \d+ grain/.test(r.text));

test('the order sells only the surplus above N, at market prices, coins to the purse, one digest line', () => {
    setup(100);
    hire(); giveGrain(25); order(10);
    const money = box.p.external.money;
    advance(60);
    assert.equal(stock(K.grain), 10, 'only the 15 above the keep-count sold');
    const gain = box.p.external.money - money;
    assert.equal(gain >= 2 * 15 && gain <= 3 * 15, true, `15 grain at 2 to 3 coins each, got ${gain}`);
    assert.equal(sold(), 15, 'the Village sold count carries the sale');
    assert.equal(lines().length, 1);
    assert.match(lines()[0].text, new RegExp(`sold 15 grain above your 10 at the Village market for ${gain} coins`));
    advance(60);
    assert.equal(lines().length, 1, 'no second line when nothing more is above N');
    assert.equal(sold(), 15);
});

test('saturation is respected: the same pile fetches less once the market has taken grain, and a flood stops at the dial\'s floor', () => {
    setup(100);
    hire(); order(0);
    giveGrain(8); const m0 = box.p.external.money; advance(30); const first = box.p.external.money - m0;
    giveGrain(8); const m1 = box.p.external.money; advance(30); const second = box.p.external.money - m1;
    assert.equal(first, 24, 'a fresh market pays the base 3 each');
    assert.equal(second <= first, true);
    giveGrain(200); const before = stock(K.grain); advance(30);
    const left = stock(K.grain);
    assert.equal(left > 0 && left < before, true, 'the order held the rest rather than dump it at any price');
    assert.equal(box.p.external.money > m1 + second, true);
    assert.equal(sold() < 200, true);
    const held = box.p.external.money; advance(30);
    assert.equal(box.p.external.money, held, 'at the floor the market takes no more until it recovers');
    assert.equal(stock(K.grain), left);
    assert.equal(SELL_DIALS.minPriceShare.value > 0 && SELL_DIALS.minPriceShare.value < 1, true);
});

test('nothing sells while the market cannot buy: away from the Frontier, or with no order, or nothing above N', () => {
    setup(100);
    hire(); giveGrain(30); order(10);
    const live = (world) => configureHiredHands({plan: () => { const c = structuredClone(box.p); c.state.actors.player.worldId = world; return c; }, commit: plan => { plan.state.actors.player.worldId = 'base.frontier'; box.p = plan; }, writable: () => true, logMessage: () => {}});
    live('book.elsewhere'); // the hand's settle pass sees the player in another world
    const m = box.p.external.money; advance(60);
    assert.equal(stock(K.grain), 30); assert.equal(box.p.external.money, m); assert.equal(box.p.market, undefined, 'no market write');
    live('base.frontier');
    order(null); advance(60);
    assert.equal(stock(K.grain), 30, 'cleared order sells nothing');
    order(40); advance(60);
    assert.equal(stock(K.grain), 30, 'nothing above 40');
    assert.equal(box.p.market, undefined);
});

test('the shared market singleton is never mutated by the hand; the plan carries the clone', () => {
    setup(100);
    const snapshot = JSON.stringify(loot_sold_count);
    hire(); giveGrain(30); order(5); advance(60);
    assert.equal(JSON.stringify(loot_sold_count), snapshot);
    assert.equal(sold() > 0, true);
});

test('wages can be paid from sales: the sale runs before the week\'s wage at the boundary', () => {
    setup(100);
    hire(); box.p.external.money = 1; // the first week is paid ahead; 1 coin left
    giveGrain(40); order(0);
    advance(WEEK + 5);
    assert.equal(projection().hires[0].status, 'active', 'sale proceeds covered the next week');
});
const projection = () => domainRegistry.project('hired_hands');

test('save surface: no sellAbove until an order is given; round trip keeps it; bad values and no hire are refused', () => {
    setup(100);
    assert.throws(() => order(5), /No one is hired/);
    hire();
    const plain = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(Object.hasOwn(plain.hired_hands.hires[PLOT_JOB], 'sellAbove'), false, 'an old hire record is unchanged');
    assert.throws(() => order(-1), /Keep between/); assert.throws(() => order(1.5), /Keep between/); assert.throws(() => order(1000), /Keep between/);
    order(12);
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(saved.hired_hands.hires[PLOT_JOB].sellAbove, 12);
    domainRegistry.load({}); assert.equal(projection().hires.length, 0);
    domainRegistry.load(saved); assert.equal(projection().hires[0].sellAbove, 12);
    order(null);
    assert.equal(Object.hasOwn(JSON.parse(JSON.stringify(domainRegistry.save({}))).hired_hands.hires[PLOT_JOB], 'sellAbove'), false);
});
