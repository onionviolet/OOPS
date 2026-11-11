import test from 'node:test';
import assert from 'node:assert/strict';
import * as r from '../src/regional_prices.js';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';

// XWR17, ECR3-ECR5, ECR9, ECR15: price reads place, season, a keyed event and the real shelf; stock is conserved.
const calm = () => 0.9; // no event ever happens
const ctx = {base: 7, day: 10, season: 'Spring', draw: calm};
const buy = (vendorId, stock, extra = {}) => r.unitPrice({vendorId, goodId: 'Coal', side: 'buy', stock, ...ctx, ...extra}).price;
const bid = (vendorId, stock, extra = {}) => r.unitPrice({vendorId, goodId: 'Coal', side: 'sell', stock, ...ctx, ...extra}).price;

test('a staple costs different amounts in different places, and an ordinary day is no free lunch', () => {
    assert.ok(buy('villageTrader', 12) > buy('suspiciousTrader', 35), 'coal is dearer in the village than the slums');
    // Same-place round trip always loses (ECR8), and a carried trip at ordinary shelves does not pay.
    assert.ok(bid('villageTrader', 12) < buy('villageTrader', 12));
    assert.ok(bid('villageTrader', 12) <= buy('suspiciousTrader', 35), 'buy at the slums, sell in the village at ordinary shelves: no profit');
});

test('an empty shelf makes a route pay; a full one does not', () => {
    const cost = buy('suspiciousTrader', 35), paid = bid('villageTrader', 0), glutted = bid('villageTrader', 24);
    assert.ok(paid > cost, `village short of coal pays ${paid} for coal that cost ${cost}`);
    assert.ok(glutted < paid);
});

test('price and stock move only through the shelf: scarcity is monotone and bounded', () => {
    const par = 12;
    let last = Infinity;
    for(let s = 0; s <= 30; s++) { const f = r.scarcityFactor(s, par); assert.ok(f <= last); assert.ok(f >= r.DIALS.scarcity.floor && f <= r.DIALS.scarcity.ceiling); last = f; }
});

test('buying walks the shelf down and selling walks it up, so each unit meets its own price', () => {
    const base = {vendorId: 'villageTrader', goodId: 'Coal', ...ctx, stock: 12};
    const one = r.lineValue({...base, side: 'buy', count: 1}).total, five = r.lineValue({...base, side: 'buy', count: 5});
    assert.ok(five.total > one * 5 - 1, 'later units cost at least as much');
    assert.ok(five.last >= five.first);
    const sold = r.lineValue({...base, stock: 0, side: 'sell', count: 5});
    assert.ok(sold.last <= sold.first, 'the keeper needs each further unit less');
});

test('restock is a stated delivery, not a reset, and surplus is used up slowly', () => {
    const coal = r.stapleOf('villageTrader', 'Coal');
    assert.equal(r.stepStock(0, coal), coal.supply, 'sold out comes back by the cart, not to the usual shelf');
    assert.equal(r.stepStock(11, coal), coal.par, 'a delivery never overfills');
    assert.equal(r.stepStock(30, coal), 30 - coal.use, 'a surplus the player sold in drains by local use');
    assert.equal(r.stepStock(coal.par, coal), coal.par);
    assert.equal(r.stepStock(0, coal, 0.3), Math.round(coal.supply * 0.3), 'a failed harvest or cold snap thins the cart');
});

test('events are keyed projections: same inputs, same answer, any order', () => {
    const draw = key => { let h = 7; for(const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
    const days = [3, 40, 90, 200, 370], a = days.map(d => r.eventFor('Village', 'grain', d, draw)?.id ?? null);
    const b = [...days].reverse().map(d => r.eventFor('Village', 'grain', d, draw)?.id ?? null).reverse();
    assert.deepEqual(a, b);
    assert.deepEqual(r.eventFor('Village', 'grain', 5, draw), r.eventFor('Village', 'grain', 27, draw), 'one event per 28-day epoch');
    let hit = 0; for(let e = 0; e < 200; e++) if(r.eventFor('Slums', 'fuel', e * 28, draw)) hit++;
    assert.ok(hit > 15 && hit < 70, `about one epoch in five has an event, got ${hit}/200`);
});

test('a quote says why from what the keeper could tell, and an event shows in price and cart', () => {
    const cold = () => 0.0; // every epoch has an event; first row of the kind
    const ev = r.eventFor('Village', 'fuel', 5, cold);
    assert.equal(ev.id, 'cold_snap');
    const calmQ = r.explainQuote({vendorId: 'villageTrader', goodId: 'Coal', stock: 12, day: 5, season: 'Spring', draw: calm});
    const coldQ = r.explainQuote({vendorId: 'villageTrader', goodId: 'Coal', stock: 2, day: 5, season: 'Spring', draw: cold});
    assert.equal(calmQ.mood, 'dear', 'village coal is dear by place');
    assert.equal(coldQ.mood, 'dear');
    assert.ok(coldQ.factor > calmQ.factor);
    assert.match(coldQ.reasons.join(' '), /cold snap/);
    assert.match(coldQ.reasons.join(' '), /Only 2 left/);
    assert.equal(coldQ.nextCart, Math.round(r.stapleOf('villageTrader', 'Coal').supply * 0.6));
    assert.equal(r.explainQuote({vendorId: 'villageTrader', goodId: 'Rope', stock: 1, day: 1, season: 'Spring', draw: calm}), null, 'not a staple here: no regional claim');
});

test('a price that moved is not stock that moved: quotes never change the shelf, and unknown goods are untouched', () => {
    assert.equal(r.unitPrice({vendorId: 'villageTrader', goodId: 'Rope', side: 'buy', stock: 3, ...ctx}), null);
    assert.equal(r.isStaple('swampTrader', 'Coal'), false);
    assert.equal(r.unitPrice({vendorId: 'villageTrader', goodId: 'Coal', side: 'buy', stock: 3, ...ctx, season: 'Winter'}).price >= buy('villageTrader', 3), true);
});

test('what you remember of the other place is labelled as old', () => {
    assert.match(r.memoryNote({place: 'Slums', goodId: 'Coal', price: 8, ageDays: 3}), /3 days ago/);
    assert.match(r.memoryNote({place: 'Slums', goodId: 'Coal', price: 8, ageDays: 30}), /a guess by now/);
    assert.equal(r.memoryNote({place: 'Slums', goodId: 'Coal', price: NaN, ageDays: 1}), null);
});

const native = () => loadNative(`
export {TraderComponent} from './src/components/trader_component.js';
export {default as templates} from './src/data/inventory_templates.js';
export {current_game_time} from './src/game_time.js';
export {bindGameStreams,createStreams} from './src/seeded_streams.js';`, {stubs: STANCE_LOCATION_STUBS});

test('a refreshing stall carries its stock: what the player sold stays, what was bought is delivered back by the cart', async () => {
    const m = await native(), state = {streams: m.createStreams(5), actors: {player: {worldId: 'base.frontier'}}};
    m.bindGameStreams(() => state);
    const coal = JSON.stringify({id: 'Coal'});
    m.templates.carry = [{canBeStarted: () => true, items: [{canBeStarted: () => true, item_name: 'Coal', chance: 1, count: [5, 20]}]}];
    const t = new m.TraderComponent({name: 'carry test', inventory_template: 'carry', refresh_time: 4}); t.stockOwnerId = 'villageTrader';
    m.current_game_time.day_count = 8;
    t.refresh({}); const opening = t.getTradeInventory()[coal].count;
    assert.ok(opening >= 5 && opening <= 20, 'the first fill is the template draw');
    // The player sells 40 coal in: it lands on the shelf, and the next restock does not delete it.
    t.getTradeInventory()[coal].count += 40;
    m.current_game_time.day_count = 13;
    assert.ok(t.can_refresh()); t.refresh({});
    assert.equal(t.getTradeInventory()[coal].count, opening + 40 - 3, 'surplus is used by the village slowly, not wiped');
    // Buy the shelf out: the cart brings its stated supply, not the usual shelf.
    delete t.getTradeInventory()[coal];
    m.current_game_time.day_count = 18; t.refresh({});
    const supply = [0.3, 0.6, 1, 1.5, 1.6].map(mult => r.stepStock(0, r.stapleOf('villageTrader', 'Coal'), mult));
    const cart = t.getTradeInventory()[coal].count;
    assert.ok(supply.includes(cart) && cart < 12, `one cart (${cart}) is a stated supply under the day's keyed event, not the usual shelf`);
    for(let day = 23; day < 80; day += 5) { m.current_game_time.day_count = day; t.refresh({}); }
    assert.equal(t.getTradeInventory()[coal].count, 12, 'carts fill the shelf and it never overfills');
});
