import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewPocketRealmAction} from '../src/pocket_realm_host.js';
import {cancelSimulationJob} from '../src/simulation.js';
import {createSupplyFixture,supplyAct,supplyTick,supplyReload,supplyContext,WOOD,KIT,TEMPLATE,CARETAKER,PREFIX} from '../scripts/playtest/pocket-realm-supply.mjs';
const stock=p=>p.state.simulation.owners[CARETAKER];
const count=p=>p.gameplay.player.inventory[KIT]||0;
test('commission reserves finite resident stock and effort, produces two useful native kits and pays once',()=>{
 const p=createSupplyFixture(),before=structuredClone(p),pending=supplyAct(p,'commission_kits');
 assert.equal(stock(pending)[WOOD],stock(p)[WOOD]-2);assert.equal(pending.external.money,p.external.money-2);
 assert.equal(pending.state.simulation.people[CARETAKER].vitals.stamina,p.state.simulation.people[CARETAKER].vitals.stamina-1);
 assert.equal(count(pending),count(p));assert.equal(stock(pending)[TEMPLATE],1);
 assert.equal(pending.state.simulation.jobs[0].participants.includes(CARETAKER),true);
 const done=supplyTick(supplyReload(pending),3);
 assert.equal(count(done),count(p)+2);assert.equal(done.state.actors[CARETAKER].resources.coins,p.state.actors[CARETAKER].resources.coins+2);
 assert.equal(stock(done)[TEMPLATE],1);assert.equal(done.state.actors.player.completed[`${PREFIX}.commission_kits`],1);
 assert.equal(count(supplyTick(supplyReload(done),5)),count(done));assert.deepEqual(p,before);
});
test('supply transfers exact real wood; it survives reload and funds another batch',()=>{
 let p=createSupplyFixture();delete stock(p)[WOOD];
 const before=p.gameplay.player.inventory[WOOD];p=supplyAct(p,'supply_logs');
 assert.equal(stock(p)[WOOD],2);assert.equal(p.gameplay.player.inventory[WOOD],before-2);
 p=supplyTick(supplyAct(supplyReload(p),'commission_kits'),3);assert.equal(stock(p)[WOOD],undefined);assert.equal(count(p),5);
 assert.equal(stock(supplyReload(p))[TEMPLATE],1);
});
test('absent stock, money, template, covered bench, foreign custody and stale quote refuse atomically',()=>{
 for(const alter of [p=>stock(p)[WOOD]=1,p=>p.external.money=1,p=>delete stock(p)[TEMPLATE],
  p=>p.state.realmPrototype.instances['glasshouse.main'].facts['bench.open']=false,
  p=>p.state.simulation.custody.loan={owner:'player',holder:CARETAKER,key:TEMPLATE,count:1},
  p=>p.state.simulation.people[CARETAKER].vitals.stamina=0]){
  const p=createSupplyFixture();alter(p);const before=structuredClone(p);
  assert.equal(previewPocketRealmAction(p.state,registry,`${PREFIX}.commission_kits`,supplyContext(p)).eligible,false);
  assert.throws(()=>supplyAct(p,'commission_kits'));assert.deepEqual(p,before);
 }
 const blocked=createSupplyFixture();blocked.state.realmPrototype.instances['glasshouse.main'].facts['bench.open']=false;assert.match(previewPocketRealmAction(blocked.state,registry,`${PREFIX}.commission_kits`,supplyContext(blocked)).reasons.join(' '),/Uncover the repaired bench/);
 const p=createSupplyFixture(),seq=p.state.sequence,next=supplyAct(p,'supply_logs'),before=structuredClone(next);
 assert.throws(()=>supplyAct(next,'commission_kits',seq),/stale/);assert.deepEqual(next,before);
});
test('cancelled or unsupported pending commission refunds the actual owners and grants no output/payment',()=>{
 for(const lostSupport of [false,true]){
  const p=createSupplyFixture(),pending=supplyReload(supplyAct(p,'commission_kits'));
  let cancelled;
  if(lostSupport){pending.state.simulation.people[CARETAKER].location='Village';cancelled=supplyTick(pending,3);}
  else cancelled=cancelSimulationJob(pending.state,registry,pending.state.simulation.jobs[0].id,supplyContext(pending));
  assert.deepEqual(stock(cancelled),stock(p));assert.equal(cancelled.external.money,p.external.money);
  assert.equal(count(cancelled),count(p));assert.equal(cancelled.state.actors[CARETAKER].resources.coins,p.state.actors[CARETAKER].resources.coins);
  assert.equal(cancelled.state.simulation.people[CARETAKER].vitals.stamina,p.state.simulation.people[CARETAKER].vitals.stamina);
  assert.equal(cancelled.state.actors.player.completed[`${PREFIX}.commission_kits`],undefined);
 }
});
test('commissioned kits return through the actual doorway and fund the existing survey consumer',async()=>{
 const {commitPocketRealmAction}=await import('../src/pocket_realm_host.js');
 const {commitAction,advanceSimulation}=await import('../src/expansion_engine.js');
 let p=createSupplyFixture();delete p.gameplay.player.inventory[KIT];p=supplyTick(supplyAct(p,'commission_kits'),3);assert.equal(count(p),2);
 p=commitPocketRealmAction(p.state,registry,'pocket.exit',{...supplyContext(p),equipment:{player:{}}});
 assert.equal(p.state.actors.player.worldId,'base.frontier');assert.equal(count(p),2);
 p.gameplay.player.skills.Perception={xp:0,enabled:true};p.gameplay.player.skills.Climbing={xp:0,enabled:true};
 const context=()=>({actorId:'player',worldId:'base.frontier',external:p.external,gameplay:p.gameplay,facts:{location:'Village',strength:10,climbing:0}});
 p=commitAction(p.state,registry,'frontier.inspect',context());p=advanceSimulation(p.state,registry,3,p.external,p.gameplay);
 p=commitAction(p.state,registry,'frontier.secure',context());assert.equal(count(p),1);
 p=advanceSimulation(p.state,registry,8,p.external,p.gameplay);
 assert.equal(p.state.actors.player.facts.surveyed,true);assert.equal(p.state.worlds['base.frontier'].facts.crossing,'repaired');
});
