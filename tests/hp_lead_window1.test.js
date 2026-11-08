import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packNative} from '../src/world_pack_registry.js';
import {createContentRegistry} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand,advanceSimulationBoundary,nextSimulationBoundary} from '../src/simulation.js';
import {withHpLeadCast,validateHpLeadCast} from '../src/book_world_hp_lead_pack.js';
import {hpLeadProjection} from '../src/book_world_hp_lead_domain.js';
const P='book.hp.lead',hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
// A name-free synthetic pack: two acts and two places, one locked option. Exercises the merge, not canon content.
const synthetic=()=>({schema:'hp-cast/1',locations:[{id:P+'.yard',label:'A yard',description:'x',underRoof:false},{id:P+'.street',label:'A street',description:'x',underRoof:false}],people:[{id:P+'.guest',label:'A guest',introductionKnowledgeKey:P+'.w1.one.seen'}],
 householdActs:{acts:[
  {id:P+'.w1.one',place:P+'.cupboard',minutes:5,label:'One',description:'d',report:'r1',knowledgeKey:P+'.w1.one.seen',operation:'use',effects:[{type:'relocate',actor:'player',location:P+'.yard'}]},
  {id:P+'.w1.two',place:P+'.yard',minutes:5,label:'Two',description:'d',report:'r2',knowledgeKey:P+'.w1.two.seen',operation:'use',effects:[]}],
  sequences:[{id:P+'.arc',title:'Day',stages:[{commandId:P+'.w1.one',label:'One'},{commandId:P+'.w1.two',label:'Two'}],conclusion:'Done.'}],visits:[]},
 lockedOptions:{[P+'.w1.one']:[{id:'u1',label:'Not taken'}]}});
function setup(pack){
 const raw=withHpLeadCast(packNative(P),pack),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),compiled=compileStructuredPack(raw,registry);
 mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
 return {raw,registry,d};
}
test('a pack is validated and absence leaves the public stub untouched',()=>{
 assert.deepEqual(validateHpLeadCast(synthetic()),[]);
 assert.ok(validateHpLeadCast({schema:'x'}).length);
 const base=packNative(P);assert.equal(withHpLeadCast(base,null),base);
 const long=synthetic();long.householdActs.acts[0].report='x'.repeat(201);assert.ok(validateHpLeadCast(long).includes('length'));
});
test('the merged definition compiles, replaces the stub command and keeps the source-only start',()=>{
 const {raw}=setup(synthetic());
 assert.deepEqual(raw.simulation.commands.map(c=>c.id),[P+'.w1.one',P+'.w1.two',P+'.arrive_school',P+'.sorting',P+'.go_dormitory',P+'.leave_dormitory',P+'.lesson_charms',P+'.charms_practice',P+'.lesson_potions',P+'.tie.ron_family',P+'.tie.ron_practice',P+'.make.cure_boils.procedure.1',P+'.make.cure_boils.procedure.2',P+'.make.cure_boils',P+'.make.cure_boils.use',P+'.make.cure_boils_quills_early.procedure.1',P+'.make.cure_boils_quills_early',P+'.make.cure_boils_quills_early.use',P+'.sp.use.levitation_charm',P+'.sp.use.pass_feather']);
 assert.ok(raw.locations.some(l=>l.id===P+'.yard'));
 assert.equal(raw.starts[0].effects.find(e=>e.type==='source').sourceId,P+'.magic');
 assert.ok(raw.items.every(i=>i.id.startsWith(P+'.item.'))); // only the W1a Potions items; the synthetic cast brings none
});
test('the projection shows the next act, locked options of the current act, and completes with the sequence',async()=>{
 const {createExpansionState}=await import('../src/expansion_engine.js');
 const {raw,registry,d}=setup(synthetic()),state=createExpansionState(123);
 const context={registry,actorId:'player',worldId:'base.frontier',external:{money:0},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},facts:{location:'Village'},busy:false};
 const sel=planStructuredSelection(state,d,context),begun=beginStructuredCampaign(sel.plan.state,d,context,null,sel.selection);
 const data=synthetic(),v=hpLeadProjection(begun.plan.state,data.householdActs,data.lockedOptions);
 assert.equal(v.arc.next.id,P+'.w1.one');assert.equal(v.arc.done,false);assert.deepEqual(v.locked.map(l=>l.label),['Not taken']);
});
