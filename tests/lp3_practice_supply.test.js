import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {createFieldFixture,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginFeatureObjects,commitFeatureObjectCommand,previewFeatureObjectCommand,fittingChoiceRecords} from '../src/feature_expansion_objects_host.js';
import {FEATURE_OBJECT_KEYS as K,FEATURE_OBJECT_IDS as I} from '../src/feature_expansion_objects.js';
import {LEVER_PRACTICE_BRACE as brace} from '../src/lever_practice_supply.js';
const batch='feature_objects.lever_practice_brace';
const ctx=p=>fieldContext(p);
const tick=(p,n,extra={})=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{facts:ctx(p).facts,vitals:ctx(p).vitals.player,...extra}});
const reload=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const supply=p=>commitFeatureObjectCommand(p.state,registry,{id:batch},ctx(p));
const lesson=(p,id,r=registry)=>commitSimulationCommand(p.state,r,{id:`field.lp1.${id}`,targetId:'oldCraftsman'},{...ctx(p),targetId:'oldCraftsman'});
function opened(){let p=beginFeatureObjects(createFieldFixture().state,registry,ctx(createFieldFixture()));p.gameplay.player.inventory[K.sound]=2;p.gameplay.player.inventory[K.sap]=2;return p;}
const count=(p,k)=>p.gameplay.player.inventory[k]||0;
// LP3 isolates supply/refunds after earning LP2's real evidence and return.
const ready=p=>lesson(lesson(tick(lesson(lesson(p,'demonstrate'),'hand'),6),'return'),'explain');
test('LP3 real batch reserves materials, effort and the existing single slot; completion collects exactly one',()=>{
 const p=opened(),pending=supply(p),job=pending.state.simulation.jobs[0];
 assert.equal(count(pending,K.sound),1);assert.equal(count(pending,K.sap),1);assert.equal(count(pending,brace),0);assert.equal(pending.native.staminaToFull,1);
 assert.equal(pending.state.simulation.sites[I.site].reservations[job.id],'player');
 const done=tick(reload(pending),2);assert.equal(count(done,brace),1);assert.equal(done.state.actors.player.completed[batch],1);assert.deepEqual(done.state.simulation.sites[I.site].reservations,{});
 assert.equal(count(tick(reload(done),20),brace),1);assert.deepEqual(reload(done),done);
 const twice=tick(supply(done),2);assert.equal(count(twice,brace),2);assert.equal(count(twice,K.sound),0);assert.equal(count(twice,K.sap),0);assert.throws(()=>supply(twice),/Insufficient/);
});
test('LP3 missing or borrowed inputs and occupied slot refuse atomically',()=>{
 for(const alter of [p=>delete p.gameplay.player.inventory[K.sound],p=>delete p.gameplay.player.inventory[K.sap],p=>{p.state.simulation.sites[I.site].reservations.other='other';},p=>{p.state.simulation.custody.foreign={owner:I.miri,holder:'player',key:K.sound,count:1};}]){
  const p=opened();alter(p);const before=structuredClone(p);assert.equal(previewFeatureObjectCommand(p.state,registry,batch,ctx(p)).eligible,false);assert.throws(()=>supply(p));assert.deepEqual(p,before);
 }
});
test('LP3 cancellation and lost support refund exact pending inputs with no collection',()=>{
 const p=opened(),pending=reload(supply(p));
 const cancelled=cancelSimulationJob(pending.state,registry,pending.state.simulation.jobs[0].id,ctx(pending));assert.deepEqual(cancelled.gameplay,p.gameplay);assert.equal(count(cancelled,brace),0);
 pending.state.simulation.people.player.body={hands:0,mobile:false};const failed=tick(pending,2);assert.deepEqual(failed.gameplay,p.gameplay);assert.equal(failed.state.actors.player.completed[batch],undefined);assert.equal(count(failed,brace),0);
});
test('LP3 one collected brace is consumed by real LP1 practice and never by watching',()=>{
 let p=ready(opened());assert.equal(previewSimulationCommand(p.state,registry,'field.lp1.practice',{...ctx(p),targetId:'oldCraftsman'}).eligible,false);
 p=tick(supply(p),2);assert.equal(count(p,brace),1);assert.equal(p.state.simulation.knowledge.player['field.lp1.method'],undefined);
 p=lesson(p,'practice');assert.equal(count(p,brace),0);assert.equal(p.external.money,99);p=tick(reload(p),3);
 assert.equal(p.state.simulation.knowledge.player['field.lp1.method'].stage,'understood');assert.equal(p.state.actors.player.completed['field.lp1.practice'],1);
 const restored=tick(reload(p),10);assert.equal(count(restored,brace),0);assert.equal(restored.external.money,99);assert.equal(restored.state.actors.player.completed[batch],1);
});
test('LP3 failed or cancelled practice returns its actual brace and teaches nothing',()=>{
 const p=tick(supply(ready(opened())),2),pending=lesson(p,'practice');
 const cancelled=cancelSimulationJob(pending.state,registry,pending.state.simulation.jobs[0].id,ctx(pending));assert.equal(count(cancelled,brace),1);assert.equal(cancelled.external.money,100);
 pending.state.simulation.people.oldCraftsman.location='Shack';const failed=tick(reload(pending),3);assert.equal(count(failed,brace),1);assert.equal(failed.external.money,100);assert.equal(failed.state.simulation.knowledge.player['field.lp1.method'],undefined);
});
test('LP3 old absent state and frozen pre-LP3 pending practice stay unchanged; presentation is pure',()=>{
 const p=createFieldFixture();assert.deepEqual(reload(p),p);assert.equal(count(p,brace),0);
 const commands=new Map(registry.simulation.commands),old=commands.get('field.lp1.practice');commands.set(old.id,{...old,costs:old.costs.filter(c=>c.key!==brace)});
 const legacy={...registry,simulation:{...registry.simulation,commands}},pending=lesson(ready(p),'practice',legacy);assert.deepEqual(reload(pending),pending);
 const done=tick(reload(pending),3);assert.equal(done.state.actors.player.completed['field.lp1.practice'],1);assert.equal(count(done,brace),0);assert.equal(done.external.money,99);
 const current=opened(),before=structuredClone(current);assert.match(fittingChoiceRecords(current.state,ctx(current)).map(r=>r.text).join(' '),/Automatically collected on completion/);assert.deepEqual(current,before);
});
