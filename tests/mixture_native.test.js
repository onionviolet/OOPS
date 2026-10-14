import test from 'node:test';import assert from 'node:assert/strict';
import {stageMixtureAction,commitMixturePlan} from '../src/mixture_native.js';
import {mixtureKey,validateMixtureEnvelope} from '../src/mixture_state.js';
const inputs={'River bellleaf':1,'Spring water':1};
function context(){return {owner:null,seed:7,inventory:{'{"id":"River bellleaf"}':{count:3},'{"id":"Spring water"}':{count:3}},money:100,clock:0};}
function advance(ctx,request){const p=stageMixtureAction({...ctx,request});if(p){ctx.owner=p.state;ctx.inventory=p.inventory;ctx.money=p.money;}return p;}
test('identical products stack and different products separate without result templates',()=>{const c=context();advance(c,{type:'mix',inputs,process:'steep'});advance(c,{type:'mix',inputs,process:'steep'});advance(c,{type:'mix',inputs,process:'boil'});const ps=Object.values(c.owner.products);assert.equal(ps.length,2);assert.equal(c.inventory[mixtureKey(ps[0])].count,2);assert.equal(c.inventory[mixtureKey(ps[1])].count,1);});
test('paid acquisition spends real purse; shortage/cancellation/failed write leave draws and stock intact',()=>{
    const c=context();const original=JSON.stringify(c);assert.throws(()=>stageMixtureAction({...c,request:{type:'buy',id:'River bellleaf',count:99}}),/coins/);assert.equal(JSON.stringify(c),original);
    const p=stageMixtureAction({...c,request:{type:'buy',id:'River bellleaf'}});assert.equal(p.money,92);assert.equal(p.inventory['{"id":"River bellleaf"}'].count,4);
    let published=false;assert.throws(()=>commitMixturePlan(p,{createSave:()=>JSON.stringify({inventories:{person:{main_character:{}}},character:{money:100}}),validateEnvelope:validateMixtureEnvelope,write:()=>{throw new Error('quota');},publish:()=>{published=true;}}),/quota/);assert.equal(published,false);assert.equal(JSON.stringify(c),original);
});
test('experiment learns only after use and repeat reserves/refunds actual exact inputs',()=>{
    const c=context();advance(c,{type:'mix',inputs,process:'steep'});const p=Object.values(c.owner.products)[0],key=mixtureKey(p);assert.throws(()=>advance(c,{type:'learn',product:p.id}),/Observe/);
    const use=advance(c,{type:'use',key});assert.ok(use.effect.effects.stats.health_regeneration_flat.flat>0);assert.equal(c.inventory[key],undefined);assert.equal(c.owner.knowledge[p.id].source,'oral experiment');
    advance(c,{type:'learn',product:p.id});const before=structuredClone(c.inventory);advance(c,{type:'repeat',product:p.id,count:4});assert.equal(c.owner.job.due,3);advance(c,{type:'cancel'});assert.deepEqual(c.inventory,before);
});
test('timed method survives reload, completes once and stops on shortage',()=>{
    let c=context();advance(c,{type:'mix',inputs,process:'steep'});const p=Object.values(c.owner.products)[0];advance(c,{type:'use',key:mixtureKey(p)});advance(c,{type:'learn',product:p.id});advance(c,{type:'repeat',product:p.id,count:4});
    c=JSON.parse(JSON.stringify(c));c.clock=2;assert.equal(advance(c,{type:'advance'}),null);c.clock=3;advance(c,{type:'advance'});assert.equal(c.inventory[mixtureKey(p)].count,1);assert.equal(c.owner.job.remaining,3);
    assert.equal(advance(c,{type:'advance'}),null);c.clock=6;const done=advance(c,{type:'advance'});assert.match(done.message,/Shortage/);assert.equal(c.owner.job,null);assert.equal(c.inventory[mixtureKey(p)].count,2);assert.equal(advance(c,{type:'advance'}),null);
});
test('latest dose replaces one family and durable publication retains consumed-product effect',()=>{
    const c=context();advance(c,{type:'mix',inputs,process:'steep'});advance(c,{type:'mix',inputs,process:'boil'});const products=Object.values(c.owner.products);advance(c,{type:'use',key:mixtureKey(products[0])});c.clock=1;const p=stageMixtureAction({...c,request:{type:'use',key:mixtureKey(products[1])}});let saved,published;
    commitMixturePlan(p,{createSave:()=>JSON.stringify({character:{money:100},inventories:{person:{main_character:c.inventory}},active_effects:{}}),validateEnvelope:validateMixtureEnvelope,write:text=>{saved=JSON.parse(text);},publish:plan=>{published=plan;}});
    assert.equal(published,p);assert.equal(saved.active_effects['Village mixture exposure'].mixtureExposure.product,products[1].id);assert.equal(saved.inventories.person.main_character[mixtureKey(products[1])],undefined);validateMixtureEnvelope(JSON.parse(JSON.stringify(saved)));
});

test('native chest split/merge and vendor sale preserve exact generated identities and draws',async()=>{
    const {createExpansionState}=await import('../src/expansion_engine.js');const {stageNativeStorageTransfer}=await import('../src/native_storage_transaction.js');const {stageNativeTrade}=await import('../src/native_trade_transaction.js');
    const c=context();advance(c,{type:'mix',inputs,process:'steep'});advance(c,{type:'mix',inputs,process:'boil'});const [a,b]=Object.values(c.owner.products),ak=mixtureKey(a),bk=mixtureKey(b),state=createExpansionState(8),gameplay={player:{inventory:{[ak]:3,[bk]:1},skills:{},reputation:{}}};
    const chest=stageNativeStorageTransfer({state,gameplay,owners:{player:gameplay.player.inventory,chest:{[ak]:1}},money:20,equipment:{player:{}},request:{direction:'deposit',item_key:ak,count:2,expectedCount:3,sequence:0}});
    assert.equal(chest.ownership.chest[ak],3);assert.equal(chest.gameplay.player.inventory[ak],1);assert.equal(chest.gameplay.player.inventory[bk],1);assert.equal(chest.state.rng,state.rng);
    const back=stageNativeStorageTransfer({state:chest.state,gameplay:chest.gameplay,owners:{player:chest.gameplay.player.inventory,chest:chest.ownership.chest},money:20,equipment:{player:{}},request:{direction:'withdraw',item_key:ak,count:3,expectedCount:3,sequence:chest.state.sequence}});
    assert.equal(back.gameplay.player.inventory[ak],4);
    const quote={buy:[],sell:[{item_key:bk,count:1}],buyValue:0,sellValue:12,vendorId:'counter',region:'Village'};
    const sale=stageNativeTrade({state:back.state,gameplay:back.gameplay,owners:{player:back.gameplay.player.inventory,vendor:{}},money:20,market:{},itemLog:{},quote,currentQuote:quote,getItem:key=>({id:'Village mixture',saturates_market:false})});
    assert.equal(sale.external.money,32);assert.equal(sale.ownership.vendor[bk],1);assert.equal(sale.gameplay.player.inventory[bk],undefined);assert.equal(sale.gameplay.player.inventory[ak],4);assert.equal(sale.state.rng,state.rng);
    validateMixtureEnvelope({mixtures:c.owner,inventories:{person:sale.gameplay.player.inventory,trader:sale.ownership.vendor,storage:back.ownership.chest}});
});

test('failed durable experiment publishes no consumed vial, learning, effect or draw changes',()=>{
    const c=context();advance(c,{type:'mix',inputs,process:'steep'});const product=Object.values(c.owner.products)[0],before=JSON.stringify(c),p=stageMixtureAction({...c,request:{type:'use',key:mixtureKey(product)}});let published=false;
    assert.throws(()=>commitMixturePlan(p,{createSave:()=>JSON.stringify({character:{money:c.money},inventories:{person:{main_character:c.inventory}},mixtures:c.owner,active_effects:{}}),validateEnvelope:validateMixtureEnvelope,write:()=>{throw new Error('storage rejected');},publish:()=>{published=true;}}),/rejected/);
    assert.equal(published,false);assert.equal(JSON.stringify(c),before);assert.equal(c.owner.knowledge[product.id],undefined);
});
