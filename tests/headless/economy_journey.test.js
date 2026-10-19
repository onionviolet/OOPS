import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';

// ECX1 + ECL2 native journey (2026-10-19): a buy and a sale at the village market each change the
// purse once and appear in the debug ledger under their source with the trade label. The ledger is
// session memory, never a save slice, so saves stay as they were.
const key = id => JSON.stringify({id});
const ledger = () => globalThis.simulationTestHooks.project('economy');

test('economy: a market buy and sale each write one named ledger row', async t => {
    const game = await boot(null, {seed:7, heroName:null});
    t.after(() => game.close());
    const fresh = await game.save();
    fresh.availabilities.trader.villageTrader = 1;
    await game.load(fresh);
    assert.deepEqual(ledger().rows.map(r => [r.source, r.balance, !!r.baseline]), [['load', fresh.character.money, true]]);

    await game.click('.choice_trade');
    await game.click('[data-trader="villageTrader"]');
    await game.click(`[data-trader_item='${key('Coal')}']`);
    await game.click('#accept_trade_button');
    const bought = (await game.save()).character.money;
    await game.click(`#inventory_content_div > [data-character_item='${key('Coal')}']`);
    await game.click('#accept_trade_button');
    await game.click('#center_mode_back');
    const save = await game.save();

    const rows = ledger().rows.slice(1);
    assert.deepEqual(rows.map(r => [r.source, r.delta, r.balance]),
        [['native.trade', bought - fresh.character.money, bought], ['native.trade', save.character.money - bought, save.character.money]]);
    assert.ok(rows[0].delta < 0 && rows[1].delta > 0, 'a sink then a faucet');
    assert.match(rows[0].detail, /^Trade with villageTrader: bought \d+, sold 0 coins$/);
    assert.match(rows[1].detail, /^Trade with villageTrader: bought 0, sold \d+ coins$/);
    assert.deepEqual(ledger().sinks, {'native.trade': rows[0].delta});
    assert.equal(save.economy, undefined, 'no save slice');

    await game.load(save);
    assert.deepEqual(ledger().rows.map(r => r.source), ['load'], 'a reload starts a new session window');
    assert.deepEqual(game.errors, []);
});
