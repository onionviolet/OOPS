import test from 'node:test';
import assert from 'node:assert/strict';
import {combatHitText, vendorState, conditionText} from '../src/ui_polish.js';
import {createDurability} from '../src/absorb_e2/durability.js';
test('native burst reports one total, CRIT, partial block and no invented body part', () => {
    assert.equal(combatHitText({target:'Rat', damage:12.34, count:3, critical:true, blocked:true}),
        'Rat partially blocked, then hit [CRIT] ×3 hits for 12.4 physical damage total');
    assert.equal(combatHitText({target:'Hero',damage:2}), 'Hero was hit for 2 physical damage');
});
test('stock, basket and incremental budget have distinct visible states', () => {
    const quote={stock:2,price:20,money:25};
    assert.equal(vendorState(quote).state,'available');
    assert.equal(vendorState({...quote,buying:20}).state,'unaffordable');
    assert.equal(vendorState({...quote,buying:20,selling:20}).state,'available');
    assert.equal(vendorState({...quote,selected:2}).label,'All in basket');
    assert.equal(vendorState({...quote,stock:0}).label,'Sold out');
});
test('condition labels quote the exact owned copy without mutating coins or condition', () => {
    const key=JSON.stringify({id:'test',e2_instance:'e2.1'});
    const item={tags:{equippable:true},getInventoryKey:()=>key};
    const actor={money:50,getEquipment:()=>({weapon:item}),getItems:()=>({})};
    const durability=createDurability({schema:1,enabled:true,condition:{[key]:99.96}});
    const before=durability.serialize();
    assert.equal(conditionText(durability,actor,item),'Condition 99.96/100 · Repair 1 coin');
    assert.deepEqual(durability.serialize(),before); assert.equal(actor.money,50);
    durability.setEnabled(false);assert.equal(conditionText(durability,actor,item),'');
});
