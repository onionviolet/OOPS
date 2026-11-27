import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';

test('ordinary trade distinguishes pending picks, Cancel, Exit and native settlement', async t => {
    const game=await boot(null,{seed:87,heroName:'Trade check'});t.after(()=>game.close());
    await game.click('[data-nearby-verb="talk:villageElder"]');
    for(const id of ['hello','what happened','ask to leave 1','need to','starting gear','sword','equipment','money']) await game.click(`[data-textline="${id}"]`);
    await game.call('end_dialogue');
    const open=async()=>{if(game.hiddenReason(game.$('[data-trader="villageTrader"]')))await game.click('.choice_trade');await game.click('[data-trader="villageTrader"]');};
    await open();
    const doc=game.document,trade=doc.getElementById('trade_div'),inventory=doc.getElementById('inventory_div');
    const money=()=>game.internals.character.money,pending=()=>doc.querySelectorAll('.item_to_trade').length;
    const buy='[data-trader_item=\'{"id":"Coal"}\']',sell='#inventory_content_div > [data-character_item=\'{"id":"Coal"}\']';
    const initial=money();
    assert.equal(game.hiddenReason(doc.querySelector('.trade-carried-heading')),null);
    assert.equal(doc.querySelectorAll('#inventory_div').length,1,'one native carried stock');
    assert.equal(doc.querySelectorAll('#trader_inventory_div').length,1,'one native merchant stock');
    assert.match(doc.getElementById('trade_price_text').textContent,/Purse change/);
    for(const id of ['accept_trade_button','cancel_trade_button','exit_trade_button']) {
        const control=doc.getElementById(id);assert.equal(control.tagName,'BUTTON');assert.equal(game.hiddenReason(control),null);assert.equal(control.disabled,false);
    }
    await game.click(buy);assert.ok(pending()>0);assert.equal(money(),initial);assert.match(game.text('#trade_price_value'),/^-/);
    await game.click('#cancel_trade_button');assert.equal(pending(),0);assert.equal(money(),initial);assert.equal(game.hiddenReason(trade),null);
    await game.click(buy);await game.click('#exit_trade_button');assert.equal(pending(),0);assert.equal(money(),initial);assert.ok(game.hiddenReason(trade));assert.ok(game.hiddenReason(doc.querySelector('.trade-carried-heading')));
    assert.equal(doc.getElementById('inventory_div'),inventory,'stock is neither cloned nor replaced');
    await open();await game.click(buy);await game.click('#accept_trade_button');const bought=money();assert.ok(bought<initial);assert.equal(pending(),0);
    await game.click(sell);assert.doesNotMatch(game.text('#trade_price_value'),/^-/);await game.click('#accept_trade_button');assert.ok(money()>bought);assert.equal(pending(),0);
    const settled=money();await game.click(buy);await game.click('#center_mode_back');assert.equal(pending(),0);assert.equal(money(),settled);assert.ok(game.hiddenReason(trade));
    assert.deepEqual(game.errors,[]);
});
