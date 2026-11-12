// Chat M v0: goods and scarcity on W, prices from stock and want, trade on K, word as knowledge (SMK1-SMK14).
// The chooser in this file is a labelled stand-in for A's scored candidates (A5) until A's v0 lands; it reads only
// beliefs and K quotes, the inputs A's contract names.
import test from 'node:test';
import assert from 'node:assert/strict';
import {composeSubstrate, createWorld, advanceWorld, applyWorldOps, serializeWorld, restoreWorld, readQuantity, readProvenance} from '../src/world_substrate.js';
import {quoteWorking, beginWorking, settleWorking} from '../src/kernel_working.js';
import {createMarketPack, shelfState, shelfQuote, marketPrice, stockOf, MARKET_PACK, DAY} from '../src/market_substrate.js';
import {TRADE_LAW, tradeDeal, marketPorts} from '../src/market_trade.js';
import {sightingKnowledge, retellKnowledge, toNativeKnowledge, applyKnowledge, marketTalk, believedPrice, priceKey} from '../src/market_word.js';
import {validateSimulationEffect} from '../src/simulation_contracts.js';
import {unitPrice, worthHere, stapleOf} from '../src/regional_prices.js';

const rules = composeSubstrate({packs: [createMarketPack({goods: ['bread'], inputs: ['grain']})]});
const body = (id, place, coin, extra = {}) => ({id, kind: 'body', place, tags: ['person'], quantities: {coin, ...extra}});
// Authored original fixture (the Village and Slums of the base game; numbers are proposals, not canon).
const holders = () => [
    {id: 'village', kind: 'place'}, {id: 'slums', kind: 'place'},
    {id: 'village.mill', kind: 'thing', place: 'village', tags: ['mill'], quantities: {grain: 100}},
    {id: 'slums.mill', kind: 'thing', place: 'slums', tags: ['mill'], quantities: {grain: 100}},
    {id: 'village.bakery', kind: 'thing', place: 'village', tags: ['market.shelf'], quantities: {coin: 0, [stockOf('bread')]: 10},
        state: {[MARKET_PACK]: shelfState({good: 'bread', base: 4, wantPerDay: 6, supply: {from: 'village.mill', input: 'grain', perUnit: 2, perDay: 6}})}},
    {id: 'slums.bakery', kind: 'thing', place: 'slums', tags: ['market.shelf'], quantities: {coin: 0, [stockOf('bread')]: 6},
        state: {[MARKET_PACK]: shelfState({good: 'bread', base: 4, wantPerDay: 3, supply: {from: 'slums.mill', input: 'grain', perUnit: 2, perDay: 3}})}},
    body('hessa', 'village', 30), body('orr', 'slums', 20), body('vale', 'village', 30),
];

test('M1 one price curve: a substrate shelf prices like the regional staple stall it generalizes (SMK5, SMK6)', () => {
    const vendorId = 'villageTrader', goodId = 'Coal', ctx = {vendorId, goodId, base: 3, day: 0, season: 'Winter', draw: () => 0.99};
    const staple = stapleOf(vendorId, goodId);
    for (let stock = 0; stock <= 30; stock++) for (const side of ['buy', 'sell']) {
        const w = worthHere({...ctx, stock});
        const factors = w.parts.filter(p => p.id !== 'shelf');
        assert.equal(marketPrice({base: 3, factors, stock, par: staple.par, side}).price, unitPrice({...ctx, stock, side}).price, `stock ${stock} ${side}`);
    }
});

test('M2 stock moves only by stated deliveries and use; one jump, minute steps and a reload agree (SMK1-SMK4)', () => {
    const start = createWorld(rules, {holders: holders()});
    const jump = advanceWorld(rules, start, 3 * DAY).world;
    let steps = start;
    for (let t = 1; t <= 3 * DAY; t++) steps = advanceWorld(rules, steps, t).world;
    let saved = advanceWorld(rules, start, DAY + 360).world;
    saved = advanceWorld(rules, restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(saved)))), 3 * DAY).world;
    for (const w of [steps, saved]) assert.deepEqual(serializeWorld(w).holders, serializeWorld(jump).holders);
    // 10 + 3 x (6 delivered - 6 used); the mill gave 2 grain per loaf.
    assert.equal(readQuantity(jump, 'village.bakery', stockOf('bread')), 10);
    assert.equal(readQuantity(jump, 'village.mill', 'grain'), 64);
    assert.deepEqual(readProvenance(jump, 'village.bakery', stockOf('bread')), {'m.market:shelf:village.bakery': 0});
    assert.ok(advanceWorld(rules, start, 3 * DAY).segments <= 7, 'far settlement cuts only at the two daily boundaries');
});

const tradeOnce = (world, {buyer, seller, count = 1, hold = 'agreed', at = world.clock, id = `trade.${buyer}.${at}`}) => {
    const ports = marketPorts(world);
    const unit = ports.read({kind: 'trader', id: seller}).asks.bread;
    const method = tradeDeal({good: 'bread', count, unitPrice: unit, hold});
    const bindings = {buyer: {kind: 'trader', id: buyer}, seller: {kind: 'trader', id: seller}};
    const quote = quoteWorking(TRADE_LAW, method, {id, bindings, at, ports});
    const {record, effects} = settleWorking(TRADE_LAW, beginWorking(TRADE_LAW, method, {id, bindings, at}), {now: at, ports});
    assert.deepEqual(quote.effects, effects.map(r => r.effect), 'K4: the quote is the settlement run as a forecast');
    return {quote, record, world: record.status === 'complete' ? applyWorldOps(rules, world, effects.map(r => r.effect), `m.trade:${id}`) : world};
};

test('M3 any two holders trade through one kernel law; a moved price refuses under the current hold (SMK8, R1)', () => {
    let world = createWorld(rules, {holders: holders()});
    // NPC to NPC: the slums bakery sells to Orr, no player in the deal.
    const {world: after, record} = tradeOnce(world, {buyer: 'orr', seller: 'slums.bakery', count: 2});
    assert.equal(record.status, 'complete');
    assert.equal(readQuantity(after, 'orr', stockOf('bread')), 2);
    assert.equal(readQuantity(after, 'slums.bakery', stockOf('bread')), 4);
    assert.equal(readQuantity(after, 'orr', 'coin') + readQuantity(after, 'slums.bakery', 'coin'), 20, 'coin is conserved');
    // The price moves between quote and settlement: the agreed hold keeps the handshake, the current hold refuses.
    const ports0 = marketPorts(world), unit = ports0.read({kind: 'trader', id: 'village.bakery'}).asks.bread;
    const bindings = {buyer: {kind: 'trader', id: 'hessa'}, seller: {kind: 'trader', id: 'village.bakery'}};
    const drained = applyWorldOps(rules, world, [{op: 'set', holder: 'village.bakery', quantity: stockOf('bread'), amount: 1}], 'test.rush');
    for (const [hold, status] of [['agreed', 'complete'], ['current', 'interrupted']]) {
        const method = tradeDeal({good: 'bread', count: 1, unitPrice: unit, hold});
        const r = settleWorking(TRADE_LAW, beginWorking(TRADE_LAW, method, {id: `h.${hold}`, bindings, at: 0}), {now: 0, ports: marketPorts(drained)}).record;
        assert.equal(r.status, status, hold);
    }
});

// ---- the first chain (section 5 of the M checkpoint) -------------------------------------------------------------
// Stand-in for A5: score = - believed unit cost - walking cost; ties keep the listed order. Stale or missing beliefs
// fall back to the shelf's stated base worth, which is what someone who never heard would assume.
const WALK_COST = {value: 2, why: 'Half a morning across town is worth about two coins of work (dial; X owns travel).'};
function chooseBread(known, actor, at, home) {
    const options = [{id: 'buy_home', place: home, walk: 0}, {id: 'buy_slums', place: 'slums', walk: WALK_COST.value}];
    const scored = options.map(o => {
        const b = believedPrice(known, actor, o.place, 'bread', at);
        const cost = b && !b.stale ? b.price : 6;
        return {...o, score: -(cost + o.walk), because: b ? `${b.basis === 'reported' ? `${b.attributedTo} says` : 'saw'} ${o.place} bread at ${b.price}` : `guess ${cost}`};
    });
    return scored.reduce((best, o) => o.score > best.score ? o : best);
}

// Phases happen at fixed minutes; `advance` is how time is cut between them (one jump, minute steps, or a reload).
function runChain({harvestFails, advance}) {
    let world = createWorld(rules, {holders: holders()}), known = {};
    const day4 = 4 * DAY;
    world = advance(world, 2 * DAY + 60);
    // L stand-in: the harvest fails, so the village mill has little grain (a W quantity another domain wrote).
    if (harvestFails) world = applyWorldOps(rules, world, [{op: 'set', holder: 'village.mill', quantity: 'grain', amount: 4}], 'l.harvest.failed');
    world = advance(world, day4 + 540);
    known = applyKnowledge(known, [sightingKnowledge({observer: 'orr', quote: shelfQuote(world, 'slums.bakery'), at: world.clock})], world.clock);
    world = advance(world, day4 + 570);
    world = applyWorldOps(rules, world, [{op: 'move', holder: 'orr', to: 'village'}], 'x.walk.orr');
    known = applyKnowledge(known, marketTalk(known, ['hessa', 'orr']), world.clock);
    world = advance(world, day4 + 600);
    known = applyKnowledge(known, [sightingKnowledge({observer: 'hessa', quote: shelfQuote(world, 'village.bakery'), at: world.clock})], world.clock);
    const hessa = chooseBread(known, 'hessa', world.clock, 'village');
    if (hessa.place === 'slums') world = applyWorldOps(rules, world, [{op: 'move', holder: 'hessa', to: 'slums'}], 'x.walk.hessa');
    world = tradeOnce(world, {buyer: 'hessa', seller: `${hessa.place}.bakery`, count: 1}).world;
    world = advance(world, day4 + 720);
    if (hessa.place === 'slums') world = applyWorldOps(rules, world, [{op: 'move', holder: 'hessa', to: 'village'}], 'x.walk.hessa.home');
    // Vale was at none of the shelves; what he knows comes through Hessa.
    known = applyKnowledge(known, marketTalk(known, ['hessa', 'vale']), world.clock);
    const vale = chooseBread(known, 'vale', world.clock, 'village');
    return {world, known, hessa, vale, villagePrice: shelfQuote(world, 'village.bakery').price};
}

const jump = (w, t) => advanceWorld(rules, w, t).world;
const minutes = (w, t) => { while (w.clock < t) w = advanceWorld(rules, w, w.clock + 1).world; return w; };
const reload = (w, t) => { const mid = advanceWorld(rules, w, Math.floor((w.clock + t) / 2)).world;
    return advanceWorld(rules, restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(mid)))), t).world; };

test('M4 the first chain: a failed harvest moves the bread price, which changes two choices, and word travels as knowledge', () => {
    const calm = runChain({harvestFails: false, advance: jump});
    const short = runChain({harvestFails: true, advance: jump});
    assert.equal(calm.hessa.id, 'buy_home');
    assert.equal(short.hessa.id, 'buy_slums', `Hessa: ${short.hessa.because}`);
    assert.ok(short.villagePrice > calm.villagePrice, 'the shortage raised the village price');
    // Vale saw no shelf; his belief is Hessa's sighting, reported and attributed, and his choice moves too.
    const valeVillage = believedPrice(short.known, 'vale', 'village', 'bread', short.world.clock);
    assert.equal(valeVillage.basis, 'reported');
    assert.equal(valeVillage.attributedTo, 'hessa');
    assert.equal(short.vale.id, 'buy_slums');
    assert.equal(calm.vale.id, 'buy_home');
    // The slums price Vale holds came from Orr through Hessa: the route names the last teller, the sighting keeps its time.
    const valeSlums = short.known.vale[priceKey('slums', 'bread')];
    assert.equal(valeSlums.basis.attributedTo, 'hessa');
    assert.equal(valeSlums.value.seenAt, 4 * DAY + 540);
    // The cause is readable down to the mill: the village shelf got 0 loaves on day 3 because the mill had no grain.
    assert.equal(short.world.holders['village.bakery'].state[MARKET_PACK].delivered, 0);
    assert.equal(readProvenance(short.world, 'village.mill', 'grain')['l.harvest.failed'] < 0, true);
});

test('M5 the chain gives the same world, beliefs and choices after one jump, minute steps or a reload (PFP12)', () => {
    const base = runChain({harvestFails: true, advance: jump});
    for (const advance of [minutes, reload]) {
        const other = runChain({harvestFails: true, advance});
        assert.deepEqual(serializeWorld(other.world).holders, serializeWorld(base.world).holders);
        assert.deepEqual(other.known, base.known);
        assert.deepEqual([other.hessa, other.vale], [base.hessa, base.vale]);
    }
});

test('M6 a stale belief is a guess, and talk passes only newer sightings (SMK13, SMK14)', () => {
    const quote = {place: 'village', good: 'bread', price: 9};
    let known = applyKnowledge({}, [sightingKnowledge({observer: 'orr', quote, at: 0})], 0);
    assert.equal(believedPrice(known, 'orr', 'village', 'bread', 25 * DAY).stale, true);
    known = applyKnowledge(known, [sightingKnowledge({observer: 'vale', quote: {...quote, price: 5}, at: 10})], 10);
    const rows = marketTalk(known, ['orr', 'vale']);
    assert.deepEqual(rows.map(r => [r.basis.attributedTo, r.actor]), [['vale', 'orr']], 'only the newer sighting is told');
});

test('M8 market rows reach the native knowledge writer only through the adapter (MB8)', () => {
    const seen = sightingKnowledge({observer: 'hessa', quote: {place: 'village', good: 'bread', price: 9}, at: 6360});
    const told = retellKnowledge(seen, {from: 'hessa', to: 'vale'});
    // The structured row is refused by the native contract: value must be text and 'reported' is not a native basis kind.
    assert.throws(() => validateSimulationEffect(seen));
    assert.throws(() => validateSimulationEffect(told));
    const text = 'Bread at the village bakery was nine coins this morning.';
    for (const row of [seen, told]) {
        const native = toNativeKnowledge(row, {text, situationId: 'market.talk.day4'});
        assert.doesNotThrow(() => validateSimulationEffect(native));
        assert.equal(native.value, text);
    }
    assert.deepEqual(toNativeKnowledge(told, {text, situationId: 'market.talk.day4'}).basis, {kind: 'recollection', attributedTo: 'hessa', situationId: 'market.talk.day4'});
});

test('M7 second world consumer: a short nest yield raises a clan storehouse price by the same rule (MC9)', () => {
    // Authored proposal numbers on a Gu-shaped case; the canon feed list and prices are G's to calibrate (AD49).
    const gu = composeSubstrate({packs: [createMarketPack({goods: ['moon_orchid'], inputs: ['nest_yield']})]});
    const make = nest => createWorld(gu, {holders: [{id: 'clan', kind: 'place'},
        {id: 'clan.nest', kind: 'thing', place: 'clan', quantities: {nest_yield: nest}},
        {id: 'clan.store', kind: 'thing', place: 'clan', tags: ['market.shelf'], quantities: {coin: 0, [stockOf('moon_orchid')]: 8},
            state: {[MARKET_PACK]: shelfState({good: 'moon_orchid', base: 10, wantPerDay: 4, supply: {from: 'clan.nest', input: 'nest_yield', perUnit: 1, perDay: 4}})}}]});
    const price = nest => shelfQuote(advanceWorld(gu, make(nest), 3 * DAY + 600).world, 'clan.store').price;
    assert.ok(price(2) > price(40), 'a lean nest season lifts the price');
});
