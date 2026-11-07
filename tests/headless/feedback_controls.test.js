// Outside the ordinary unit glob (boots the whole game). Run explicitly:
//   node --test tests/headless/feedback_controls.test.js
// FBK3: controls that used to answer with nothing now answer in the place the player is looking.
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from '../../scripts/headless/runner.mjs';

const text = el => (el?.textContent || '').replace(/\s+/g, ' ').trim();
const find = (g, sel, start) => g.$$(sel).find(e => text(e).startsWith(start));

test('equipment slots, the Tools group and the item preview answer', async () => {
    const g = await boot(null, {seed: 1});
    try {
        await g.step(1);
        // The closed hover preview is not a control the player can reach (its "Full item" footer used to look pressable).
        assert.equal(g.$('#shell_item_preview')?.checkVisibility?.(), false, 'closed preview is out of the tree');
        await g.click(find(g, 'summary', 'Gear')); await g.settle(300);
        // Tool slots live outside the main equipment grid; the Tools group lists them.
        const tools = g.$$('summary').find(e => text(e) === 'Tools');
        await g.click(tools); await g.settle(100);
        const labels = [...tools.parentElement.querySelectorAll('button')].map(text);
        assert.ok(labels.includes('axe · Empty') && labels.includes('fishing · Empty'), labels.join(', '));
        // A slot press shows its detail in the dock...
        await g.click(find(g, 'button', 'head')); await g.settle(300);
        assert.match(text(g.$('#proto23_item_detail')), /head slot · empty/);
        // ...and, with a center view covering the dock (mixing counter), opens the detail as a center view.
        await g.click('#village_mixing_open'); await g.settle(300);
        await g.click(find(g, 'button', 'torso')); await g.settle(300);
        const detail = g.$('#proto23_item_detail');
        assert.equal(detail.checkVisibility?.(), true, 'detail is on screen after a slot press in a center view');
        assert.match(text(detail), /torso slot · empty/);
    } finally {g.close();}
});

test('trade: a sold-out press and an unaffordable accept say why', async () => {
    const g = await boot(null, {seed: 7, heroName: null});
    try {
        const fresh = await g.save(); fresh.availabilities.trader.villageTrader = 1; await g.load(fresh);
        await g.click('.choice_trade'); await g.click('[data-trader="villageTrader"]');
        const notice = () => g.$('#trade_stock_notice'), row = '[data-trader_item=\'{"id":"Bread kwas"}\']';
        for (let i = 0; i < 4; i++) { g.$(row).click(); await g.settle(10); }
        assert.equal(g.$(row).getAttribute('aria-disabled'), 'true');
        g.$(row).click(); await g.settle(10);
        assert.match(text(notice()), /^Your basket already holds all .+ has of bread kwas\.$/);
        await g.click('#accept_trade_button');
        assert.match(text(notice()), /^You are .+ short\./);
    } finally {g.close();}
});

test('re-pressing the shown tab names itself', async () => {
    const g = await boot(null, {seed: 1});
    try {
        await g.step(1);
        const said = () => text(g.$('#ui_locked_reason'));
        const tab = g.$('#notebook_tab_here');
        if (tab) { tab.click(); await g.settle(10); assert.equal(said(), 'Already showing Here.'); }
        const actions = g.$$('button[data-place-tab="actions"]')[0];
        if (actions) { actions.click(); await g.settle(10); assert.equal(said(), 'Already showing Actions.'); }
        assert.ok(tab || actions, 'at least one tab was exercised');
    } finally {g.close();}
});
