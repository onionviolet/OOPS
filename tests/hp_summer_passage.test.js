import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packNative} from '../src/world_pack_registry.js';
import {createContentRegistry,createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack,registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {enrollSimulation,previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {hpSummerExtension,hpSummerClockRequest,HP_SUMMER,HP_SUMMER_ACTION,HP_TERM_OFFSET} from '../src/hp_summer_passage.js';
const P='book.hp.lead',location=P+'.cupboard',hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
const cast={householdActs:{acts:[{id:P+'.dress',knowledgeKey:P+'.dressed'}],sequences:[{id:P+'.home',title:'Household',stages:[{commandId:P+'.dress',label:'Dress'}]}]}};
function setup(elapsed=3500){
 const raw=packNative(P),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
 const compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
 const base={...compiled.definition,contentHash:hash(raw)},ext=hpSummerExtension(base,cast);
 const extension=registerStructuredCommandExtension(ext,hash(ext),base,registry,undefined,{bundledInstant:true});
 const state=createExpansionState(1);state.actors.player.worldId=P+'.world';state.worlds[P+'.world']={facts:{},resources:{},completed:{}};
 const context={actorId:'player',worldId:P+'.world',facts:{location},external:{},gameplay:{player:{inventory:{},skills:{},reputation:{}}},
  vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}}};
 let live=enrollSimulation(state,registry,context);live.state.clock=100+elapsed;
 live.state.simulation.knowledge.player||={};live.state.simulation.people.player.body={ownerId:'player',controllerId:'player',id:'fixture_body',form:'human',hands:2,mobile:true};
 live.state.simulation.knowledge.player[P+'.opening']={at:100,stage:'understood',value:'Opening',cause:'fixture'};
 live.state.actors.player.completed[P+'.dress']=1;
 const current=()=>({...context,...live,facts:{location,'hp.lead.day':Math.floor((live.state.clock-100+480)/1440),['structured.extension.'+HP_SUMMER+'.admitted']:true}});
 const record={packId:P,revision:base.revision,contentHash:base.contentHash,extensions:[extension]};
 return {get live(){return live;},registry,extension,record,current,
  preview:()=>previewSimulationCommand(live.state,registry,HP_SUMMER_ACTION,current()),
  start:()=>{live=commitSimulationCommand(live.state,registry,{id:HP_SUMMER_ACTION},current());},
  advance:minutes=>{live=advanceSimulation(live.state,registry,minutes,live.external,live.gameplay,{player:current()});},
  cancel:()=>{live=cancelSimulationJob(live.state,registry,live.state.simulation.jobs[0].id,current());}};
}
test('native anchored routine finishes exactly at term, including a late start; optional pack absence adds no routine',()=>{
 assert.equal(hpSummerExtension({...packNative(P),contentHash:'unused'},null),null);
 assert.equal(hpSummerExtension({id:P},null),null);
 for(const elapsed of [3500,HP_TERM_OFFSET-37]){
  const f=setup(elapsed);assert.equal(f.preview().eligible,true);assert.equal(f.preview().duration,HP_TERM_OFFSET-elapsed);f.start();
  assert.equal(f.live.state.simulation.jobs[0].due,100+HP_TERM_OFFSET);
  assert.equal(hpSummerClockRequest(f.live.state,f.record,f.extension),Math.min(120,HP_TERM_OFFSET-elapsed));
  f.advance(HP_TERM_OFFSET-elapsed);assert.equal(f.live.state.clock,100+HP_TERM_OFFSET);
  assert.equal(f.live.state.simulation.jobs.length,0);assert.equal(f.preview().eligible,false);
 }
});
test('unfinished household and missing opening refuse, while cancellation preserves elapsed time without rewards',()=>{
 const f=setup();delete f.live.state.actors.player.completed[P+'.dress'];assert.equal(f.preview().eligible,false);
 f.live.state.actors.player.completed[P+'.dress']=1;delete f.live.state.simulation.knowledge.player[P+'.opening'];assert.equal(f.preview().eligible,false);
 const g=setup();g.start();g.advance(120);const clock=g.live.state.clock,gameplay=structuredClone(g.live.gameplay);g.cancel();
 assert.equal(g.live.state.clock,clock);assert.equal(g.live.state.simulation.jobs.length,0);assert.deepEqual(g.live.gameplay,gameplay);
 assert.equal(g.preview().duration,HP_TERM_OFFSET-3500-120);
});
test('passage requires exact extension, body, location, job and opening binding; saved job reloads detached',()=>{
 const f=setup();f.start();const saved=JSON.stringify(f.live.state),state=loadExpansionState(JSON.parse(saved),f.registry);
 assert.equal(hpSummerClockRequest(state,f.record,f.extension),120);
 for(const mutate of [s=>s.simulation.jobs[0].due++,s=>s.simulation.people.player.location=P+'.street',s=>s.simulation.people.player.body.controllerId='other',s=>delete s.simulation.knowledge.player[P+'.opening']]){
  const changed=structuredClone(state);mutate(changed);assert.equal(hpSummerClockRequest(changed,f.record,f.extension),null);
 }
 assert.equal(hpSummerClockRequest(state,{...f.record,contentHash:'wrong'},f.extension),null);
 assert.equal(hpSummerClockRequest(state,{...f.record,extensions:[]},f.extension),null);
 assert.equal(JSON.stringify(f.live.state),saved);
});
test('the paced routine preserves a blocking choice opening inside its requested interval',()=>{
 const f=setup();f.start();const at=f.live.state.clock+30;
 f.registry.opportunities.set('fixture.choice',{id:'fixture.choice'});
 f.live.state.opportunities.waiting={definitionId:'fixture.choice',context:{actorId:'player',worldId:P+'.world'},status:'scheduled',blocking:true,due:at,expires:at+60};
 f.advance(hpSummerClockRequest(f.live.state,f.record,f.extension));
 assert.equal(f.live.state.clock,at);assert.equal(f.live.stoppedAtChoice,true);assert.equal(f.live.remaining,90);
 assert.equal(f.live.state.simulation.jobs[0].due,100+HP_TERM_OFFSET);
 f.advance(120);assert.equal(f.live.state.clock,at);
});



