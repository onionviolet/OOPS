import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {cancelSimulationJob,simulationOccupiesActor,commitSimulationCommand} from '../src/simulation.js';
import {beginExchange,commitExchangeCommand,exchangeContext,exchangeView,exchangeQuestView} from '../src/exchange.js';
import {EXCHANGE_CLERK as clerk,EXCHANGE_SITUATION as sid,EXCHANGE_ITEMS as keys} from '../src/exchange_content.js';
import {joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginPromiseVisitor} from '../src/promise_content.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
const context=(p,targetId=null)=>({...fieldContext(p),targetId,facts:{...fieldContext(p).facts,strength:12}});
const advance=(p,n)=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{facts:context(p).facts,vitals:context(p).vitals.player}});
const command=(p,id)=>commitExchangeCommand(p.state,registry,{id},context(p,registry.simulation.commands.get(id).targetId||null));
const setup=()=>{const p=joinField();p.gameplay.player.inventory[keys['Prepared survey kit']]=3;return beginExchange(p.state,registry,context(p));};
const accept=()=>command(setup(),'exchange.accept');
const cancel=p=>cancelSimulationJob(p.state,registry,p.state.simulation.jobs.find(j=>j.actorId==='player').id,context(p));
const taught=()=>{
 let p=joinField(),ctx=()=>context(p,'promiseVisitor');p.gameplay.player.inventory[keys['Prepared survey kit']]=3;
 p=beginPromiseVisitor(p.state,registry,context(p));p=commitSimulationCommand(p.state,registry,{id:'promise.help'},ctx());p=advance(p,7);
 p=commitSimulationCommand(p.state,registry,{id:'promise.meet_help'},ctx());p=commitSimulationCommand(p.state,registry,{id:'promise.lesson'},ctx());p=advance(p,2);
 return beginExchange(p.state,registry,context(p));
};
test('opt-in meeting owns finite stock and creates neither a contract nor a player grant',()=>{
 const old=joinField();assert.equal(old.state.actors[clerk],undefined);const p=beginExchange(old.state,registry,context(old));
 assert.equal(old.state.actors[clerk],undefined);assert.equal(p.state.simulation.owners[clerk][keys['Sound seal blank']],2);assert.equal(p.state.actors[clerk].resources.coins,8);
 assert.equal(p.gameplay.player.inventory[keys['Sealing template']],undefined);assert.equal(exchangeQuestView(p.state),null);assert.ok(exchangeView(p.state).introduced);
 assert.throws(()=>beginExchange(p.state,registry,context(p)));assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry),p.state);
});
test('ordinary paid fitting, later gift and two further paid batches retain their actual owners',()=>{
 let p=accept();assert.equal(p.state.actors[clerk].resources.coins,6);assert.equal(p.state.simulation.claims['exchange.parcel_payment'].status,'held');assert.ok(exchangeQuestView(p.state));
 p=command(p,'exchange.buy_sound');assert.equal(p.external.money,97);assert.equal(p.state.actors[clerk].resources.coins,9);assert.equal(p.state.simulation.owners[clerk][keys['Sound seal blank']],1);
 p=advance(command(p,'exchange.fit_kit'),5);assert.equal(p.gameplay.player.inventory[keys['Prepared survey kit']],2);assert.equal(p.gameplay.player.inventory[keys['Fitted parcel seal']],1);
 p=command(p,'exchange.deliver');assert.equal(p.external.money,99);assert.equal(p.gameplay.player.inventory[keys['Fitted parcel seal']],undefined);assert.equal(p.state.simulation.owners[clerk][keys['Fitted parcel seal']],1);assert.throws(()=>command(p,'exchange.deliver'));
 p=advance(p,3);p=command(p,'exchange.return');assert.equal(p.gameplay.player.inventory[keys['Sealing template']],1);assert.equal(p.state.simulation.owners[clerk][keys['Sealing template']],undefined);assert.throws(()=>command(p,'exchange.return'));
 const wood=p.gameplay.player.inventory[keys['Rough wood log']];p=advance(command(p,'exchange.pack_pair'),3);p=advance(command(p,'exchange.pack_pair'),3);
 assert.equal(p.gameplay.player.inventory[keys['Rough wood log']],wood-4);assert.equal(p.gameplay.player.inventory[keys['Prepared survey kit']],6);assert.equal(p.gameplay.player.inventory[keys['Sealing template']],1);
});
test('damp material really converts once, with refund and mid-job reload',()=>{
 const bought=command(accept(),'exchange.buy_wet'),before=structuredClone(bought);let p=command(bought,'exchange.dry');assert.equal(p.gameplay.player.inventory[keys['Wet seal blank']],undefined);
 p=cancel(p);assert.deepEqual(p.gameplay.player.inventory,before.gameplay.player.inventory);assert.equal(p.native.staminaToFull,before.native?.staminaToFull||0);
 p=command(p,'exchange.dry');p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)};p=advance(p,4);
 assert.equal(p.gameplay.player.inventory[keys['Sound seal blank']],1);assert.equal(p.gameplay.player.inventory[keys['Wet seal blank']],undefined);assert.equal(p.state.simulation.owners[clerk][keys['Wet seal blank']],1);
});
test('an earned control uses the borrowed gauge without a kit, then actual return precedes settlement',()=>{
 let p=command(taught(),'exchange.accept');p=command(p,'exchange.buy_sound');p=command(p,'exchange.borrow');assert.equal(p.state.simulation.custody['exchange.gauge'].owner,clerk);
 const kits=p.gameplay.player.inventory[keys['Prepared survey kit']];p=advance(command(p,'exchange.fit_taught'),2);assert.equal(p.gameplay.player.inventory[keys['Prepared survey kit']],kits);assert.equal(p.gameplay.player.inventory[keys['Parcel gauge']],1);
 assert.throws(()=>command(p,'exchange.deliver'));assert.throws(()=>command(p,'exchange.withdraw'));
 p=command(p,'exchange.return_gauge');assert.equal(p.state.simulation.custody['exchange.gauge'],undefined);assert.equal(p.gameplay.player.inventory[keys['Parcel gauge']],undefined);assert.equal(p.state.simulation.owners[clerk][keys['Parcel gauge']],1);
 p=command(p,'exchange.deliver');assert.equal(p.state.simulation.claims['exchange.parcel_payment'].status,'settled');
});
test('description, suppression, missing hands/tool and busy participants cannot spend fitting inputs',()=>{
 const legal=command(command(command(taught(),'exchange.accept'),'exchange.buy_sound'),'exchange.borrow');
 for(const variant of ['recollection','suppressed','hands','gauge']){
  const p=structuredClone(legal);if(variant==='recollection')p.state.simulation.knowledge.player['promise.bracing'].basis.kind='recollection';
  if(variant==='suppressed')p.state.simulation.faculties.player['promise.bracing_control'].suppressed=true;
  if(variant==='hands')p.state.simulation.people.player.body={hands:0};if(variant==='gauge')delete p.gameplay.player.inventory[keys['Parcel gauge']];
  const before=structuredClone(p);assert.throws(()=>command(p,'exchange.fit_taught'));assert.deepEqual(p,before);
 }
 let p=command(command(accept(),'exchange.buy_sound'),'exchange.fit_kit');assert.equal(simulationOccupiesActor(p.state),true);assert.throws(()=>command(p,'exchange.borrow'));assert.equal(p.state.simulation.owners[clerk][keys['Parcel gauge']],1);
});
test('decline and silence fund NPC work rather than player debt or omniscient aftermath',()=>{
 for(const route of ['declined','unanswered']){
  let p=setup(),money=p.external.money;p=route==='declined'?command(p,'exchange.decline'):p;p=advance(p,route==='declined'?4:14);
  assert.equal(p.state.simulation.situations[sid].phase,route+'_ready');assert.equal(p.state.actors[clerk].resources.coins,5);assert.equal(p.state.simulation.owners[clerk][keys['Sound seal blank']],1);assert.equal(p.state.simulation.owners[clerk][keys['Fitted parcel seal']],1);
  assert.equal(p.external.money,money);assert.equal(p.state.simulation.knowledge.player['exchange.return'],undefined);assert.equal(exchangeQuestView(p.state),null);
  p=command(p,'exchange.hear_'+route);p=command(p,'exchange.buy_template');assert.equal(p.external.money,money-5);assert.equal(p.gameplay.player.inventory[keys['Sealing template']],1);assert.equal(p.state.actors.player.sources['promise.bracing_control'],undefined);
 }
});
test('withdrawal settles the issuer reservation while preserving purchased stock',()=>{
 let p=command(accept(),'exchange.buy_sound');p=command(p,'exchange.withdraw');assert.equal(p.external.money,97);assert.equal(p.state.actors[clerk].resources.coins,11);assert.equal(p.gameplay.player.inventory[keys['Sound seal blank']],1);
 assert.equal(p.state.simulation.claims['exchange.parcel_payment'].status,'settled');assert.throws(()=>command(p,'exchange.withdraw'));
});
test('stale/replayed purchase and failed publication cannot duplicate stock or money',()=>{
 const p=accept(),before=structuredClone(p),packet={id:'exchange.buy_sound'},ctx=context(p,clerk),seq=p.state.sequence;
 const bought=commitExchangeCommand(p.state,registry,packet,ctx,seq);assert.throws(()=>commitExchangeCommand(bought.state,registry,packet,context(bought,clerk),seq),/stale/);
 const data={character:{money:p.external.money},levels:{person:{main_character:{},oldCraftsman:{}}},inventories:{person:{main_character:{},oldCraftsman:{}}},expansion:p.state};
 assert.throws(()=>persistExpansionPlan(bought,{createSave:()=>JSON.stringify(data),key:'fixture',storage:{setItem(){throw Error('quota');}},bindings:{player:{category:'person',id:'main_character'},oldCraftsman:{category:'person',id:'oldCraftsman'}}}),/quota/);
 assert.deepEqual(p,before);assert.equal(bought.state.simulation.owners[clerk][keys['Sound seal blank']],1);
});
