import test from 'node:test';
import assert from 'node:assert/strict';
import {shopGreeting, SHOP_VOICES} from '../src/shop_greeting.js';
import * as s from '../src/economy_standing.js';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';

const first = () => 0;
const base = {visits: 1, today: 10, lastBought: null, boughtDay: -1, talked: null, soldOut: null, shortage: false};
const say = (facts, vendorId = 'villageTrader', pick = first) => shopGreeting({vendorId, facts: {...base, ...facts}, pick});

test('the opener follows what the keeper remembers about you', () => {
    assert.deepEqual(say({}).why, ['first-visit']);
    assert.deepEqual(say({visits: 2}).why, ['returning']);
    assert.deepEqual(say({visits: 5}).why, ['regular']);
    const bought = say({visits: 2, lastBought: 'Coil of rope', boughtDay: 8});
    assert.deepEqual(bought.why, ['bought-recently']);
    assert.match(bought.text, /coil of rope/);
    assert.deepEqual(say({visits: 4, lastBought: 'Coil of rope', boughtDay: 1}).why, ['regular'], 'a purchase two weeks back has blurred');
    assert.deepEqual(say({visits: 4, talked: {won: true}}).why, ['talked-today'], 'today\'s haggle outranks everything');
});

test('stock news names a sold-out staple and when it returns, else a shortage', () => {
    const out = say({visits: 3, soldOut: {item: 'Coil of rope', restockIn: 1}});
    assert.deepEqual(out.why, ['regular', 'staple-sold-out']);
    assert.match(out.text, /rope/i); assert.match(out.text, /tomorrow/);
    assert.match(say({soldOut: {item: 'Lamp oil', restockIn: 3}}).text, /in 3 days/);
    assert.deepEqual(say({shortage: true}).why, ['first-visit', 'shortage']);
    assert.deepEqual(say({shortage: true, soldOut: {item: 'Coal', restockIn: 2}}).why, ['first-visit', 'staple-sold-out']);
});

test('every keeper has a full voice, an unknown stall falls back, and the pick decides within a pool', () => {
    for(const [id, voice] of Object.entries(SHOP_VOICES))
        for(const kind of ['first', 'regular', 'bought', 'talked', 'soldOut', 'shortage']) assert.ok(voice[kind]?.length, `${id}.${kind}`);
    assert.equal(say({}, 'someone else').text, SHOP_VOICES.default.first[0]);
    const lines = new Set([0, 1].map(i => say({}, 'villageTrader', () => i).text));
    assert.equal(lines.size, 2);
    assert.equal(say({}).text, say({}).text, 'same facts and pick give the same line');
});

test('customer memory counts one visit per day, keeps the last purchase and saves cleanly', () => {
    let st = s.fresh();
    st = s.noteVisit(st, 'villageTrader', 3);
    const same = s.noteVisit(st, 'villageTrader', 3);
    assert.equal(same, st, 'reopening the same day changes nothing');
    st = s.noteVisit(st, 'villageTrader', 4);
    st = s.noteBought(st, 'villageTrader', 'Lamp oil', 4);
    assert.deepEqual(s.customerMemory(st, 'villageTrader'), {visits: 2, lastVisit: 4, lastBought: 'Lamp oil', boughtDay: 4});
    assert.equal(s.customerMemory(st, 'nobody').visits, 0);
    const round = s.migrateStanding(JSON.parse(JSON.stringify(st)));
    assert.doesNotThrow(() => s.validateStanding(round));
    assert.deepEqual(round.customers, st.customers);
    assert.doesNotThrow(() => s.validateStanding(s.migrateStanding({...s.fresh(), customers: undefined})), 'a slice from before customer memory loads');
    assert.throws(() => s.validateStanding({...round, customers: {x: {visits: -1, lastVisit: 0, lastBought: null, boughtDay: -1}}}), /customer/);
    for(let i = 0; i < s.LIMITS.customers + 5; i++) st = s.noteVisit(st, `v${i}`, 10 + i);
    assert.equal(Object.keys(st.customers).length, s.LIMITS.customers);
    assert.ok(!st.customers.villageTrader, 'the keeper seen longest ago forgets first');
});

test('a stall lists its staples under current conditions and counts days to the next delivery', async () => {
    const m = await loadNative(`
export {TraderComponent} from './src/components/trader_component.js';
export {default as templates} from './src/data/inventory_templates.js';
export {current_game_time} from './src/game_time.js';`, {stubs: STANCE_LOCATION_STUBS});
    const yes = {canBeStarted: () => true}, no = {canBeStarted: () => false};
    m.templates.staples = [
        {...yes, items: [{...yes, item_name: 'Coil of rope', chance: 1}, {...yes, item_name: 'Iron sword', chance: 0.4}, {...no, item_name: 'Coal', chance: 1}]},
        {...no, items: [{...yes, item_name: 'Lamp oil', chance: 1}]}];
    const t = new m.TraderComponent({name: 'staple test', inventory_template: 'staples', refresh_time: 4});
    assert.deepEqual(t.stapleNames({}), ['Coil of rope']);
    assert.equal(t.daysToRestock(), null, 'never stocked yet');
    t.last_refresh = m.current_game_time.day_count;
    assert.equal(t.daysToRestock(), 4);
    for(const name of ['Basic', 'Slums', 'Swamp', 'Cat cafe'])
        for(const group of m.templates[name]) assert.ok(group.items.some(spec => spec.chance >= 1), `${name}: every condition set lays out staples`);
});
