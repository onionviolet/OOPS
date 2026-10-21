import test from 'node:test';
import assert from 'node:assert/strict';
import {boot,canonicalSave,diffSaves} from '../../scripts/headless/runner.mjs';
import {firewoodFixture,WOOD_KEY,QUALITY_WOOD_KEY,carriedWood} from '../helpers/household_firewood_fixture.mjs';
import {stockFirewoodAction} from '../../src/absorb_p23/household/model.js';

async function openHome(g) {
    await g.step(1);await g.click('button[data-place-tab="options"]');g.$('#p23_household_panel').open=true;
}
async function action(g,id) {
    await g.click('button[data-place-tab="options"]');g.$('#p23_household_panel').open=true;
    const button=g.$$('[data-household-action]').find(el=>el.dataset.householdAction===id);
    assert.ok(button,`native action ${id} exists`);await g.click(button);
}
async function persist(g) {
    const before=await g.save();await g.reload();
    assert.deepEqual(diffSaves(canonicalSave(await g.save()),canonicalSave(before)),[]);
    const literal=await g.exportFile(),exported=await g.save();await g.importFile(literal);
    assert.deepEqual(diffSaves(canonicalSave(await g.save()),canonicalSave(exported)),[]);
    await g.click('button[data-place-tab="options"]');g.$('#p23_household_panel').open=true;
}

test('native finite firewood: exact stock, rejected write, expiry boundary, away policy and current persistence',async t=>{
    const g=await boot(null,{seed:19,heroName:null});t.after(()=>g.close());
    const seed=firewoodFixture(await g.save());await g.load(seed);await openHome(g);
    const stock=stockFirewoodAction();
    const before=await g.save(),stored=g.storage.getItem('save data'),oldWrite=g.storage.setItem;
    g.storage.setItem=function(k,v){if(k==='save data')throw Error('FF3 synthetic rejected write');return oldWrite.call(this,k,v);};
    await action(g,stock);g.storage.setItem=oldWrite;
    assert.equal(g.internals.character.getItems()[WOOD_KEY].count,carriedWood(before));
    assert.equal(g.storage.getItem('save data'),stored);assert.equal(g.internals.foundationSaveBlocked,true);
    await g.reload();await g.click('button[data-place-tab="options"]');g.$('#p23_household_panel').open=true;
    await action(g,stock);await action(g,stock);await action(g,stockFirewoodAction(QUALITY_WOOD_KEY));
    assert.equal(carriedWood(g.snapshot()),6);assert.equal(carriedWood(g.snapshot(),QUALITY_WOOD_KEY),1);
    await action(g,'withdraw_firewood');assert.equal(carriedWood(g.snapshot()),7,'oldest stored exact key returns');
    await action(g,'supply_on');await action(g,'light');
    assert.equal(carriedWood(g.snapshot()),6);assert.deepEqual(g.snapshot().household.hearth.firewood.logs,[WOOD_KEY,QUALITY_WOOD_KEY]);
    await g.step(19);assert.equal(g.snapshot().household.hearth.fuelMinutes,1);await persist(g);
    await g.step(1);assert.equal(g.snapshot().household.hearth.fuelMinutes,20);assert.deepEqual(g.snapshot().household.hearth.firewood.logs,[QUALITY_WOOD_KEY]);
    await g.step(19);assert.equal(g.snapshot().household.hearth.fuelMinutes,1);
    const pack=carriedWood(g.snapshot());
    await g.call('change_location',{location_id:'Village'});
    const away=g.snapshot();assert.equal(away['current location'],'Village');assert.deepEqual(away.household.hearth.firewood.logs,[QUALITY_WOOD_KEY]);
    await g.step(40);assert.equal(g.snapshot().household.hearth.fuelMinutes,0);assert.deepEqual(g.snapshot().household.hearth.firewood.logs,[QUALITY_WOOD_KEY]);assert.equal(carriedWood(g.snapshot()),pack);
    await g.call('change_location',{location_id:'Shack'});await g.click('button[data-place-tab="options"]');g.$('#p23_household_panel').open=true;
    await g.step(5);assert.equal(g.snapshot().household.hearth.fuelMinutes,0,'return does not ignite cold stock');
    await action(g,'light');await action(g,'extinguish');await g.step(21);assert.equal(g.snapshot().household.hearth.firewood.logs.length,1);
    await action(g,'light');await g.step(41);assert.equal(g.snapshot().household.hearth.fuelMinutes,0);assert.equal(g.snapshot().household.hearth.firewood.logs.length,0);
    await persist(g);const final=await g.save();await g.step(2);assert.deepEqual(g.snapshot().household.hearth,final.household.hearth);
    assert.deepEqual(g.errors,[]);
});
