// W8-A: the route from Harry's summer to Hogwarts: arrival on day 32 (1 September), then the Sorting (canon: Gryffindor, others locked).
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packNative} from '../src/world_pack_registry.js';
import {createContentRegistry,createExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand,advanceSimulationBoundary,previewSimulationCommand} from '../src/simulation.js';
import {hpLeadProjection,hpSchoolRoute,registerHpLeadDomain} from '../src/book_world_hp_lead_domain.js';
import {withHpLeadCast} from '../src/book_world_hp_lead_pack.js';
import {hpPositions,hpPositionLine} from '../src/book_world_hp_positions.js';
import {hpDutyActive} from '../src/book_world_hp_duties.js';
import {readLocalClock} from '../src/today_strip.js';
const P='book.hp.lead',DAY=1440,ARRIVE=P+'.arrive_school',SORT=P+'.sorting';
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
function setup(raw=packNative(P)){
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),compiled=compileStructuredPack(raw,registry);
 mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
 const state=createExpansionState(123),context={registry,actorId:'player',worldId:'base.frontier',external:{money:0},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},facts:{location:'Village'},busy:false};
 const sel=planStructuredSelection(state,d,context),begun=beginStructuredCampaign(sel.plan.state,d,context,null,sel.selection);
 const ctxFor=plan=>({...context,worldId:P+'.world',gameplay:plan.gameplay,external:plan.external,vitals:plan.vitals,structuredNative:{...begun.record,bound:true},facts:{location:plan.state.simulation.people.player.location}});
 return {registry,plan:begun.plan,ctxFor,opening:begun.plan.state.simulation.knowledge.player[P+'.opening'].at};
}
const atDay=(f,day,min=1)=>{f.plan.state.clock=f.opening+day*DAY-480+min;};
const preview=(f,id)=>previewSimulationCommand(f.plan.state,f.registry,id,f.ctxFor(f.plan));
function run(f,id){
 const started=commitSimulationCommand(f.plan.state,f.registry,{id},f.ctxFor(f.plan));
 const job=started.state.simulation.jobs.find(j=>j.commandId===id);started.state.clock=job.due;
 advanceSimulationBoundary(started,f.registry,{player:f.ctxFor(started)});
 f.plan=started;return started.state;
}
test('before day 32 arrival is blocked with its reason and an untouched life is unchanged',()=>{
 const f=setup(),facts=f.plan.state.actors.player.facts;
 assert.equal(facts['hp.lead.atSchool'],undefined);assert.equal(facts['hp.lead.house'],undefined);
 atDay(f,31,1000);const p=preview(f,ARRIVE);
 assert.equal(p.eligible,false);assert.match(p.reasons.join(' '),/1 September/);
 assert.throws(()=>commitSimulationCommand(f.plan.state,f.registry,{id:ARRIVE},f.ctxFor(f.plan)));
 assert.deepEqual(hpPositions(f.plan.state),[]);assert.equal(hpDutyActive(f.plan.state),false);
 const r=hpSchoolRoute(f.plan.state);assert.equal(r.atSchool,false);assert.equal(r.next.id,ARRIVE);assert.deepEqual(r.locked,[]);
});
test('on day 32 arrival sets atSchool once and the Sorting then sets the house once',()=>{
 const f=setup();atDay(f,32,10);
 assert.equal(preview(f,ARRIVE).eligible,true);
 const s1=run(f,ARRIVE);
 assert.equal(s1.actors.player.facts['hp.lead.atSchool'],true);assert.equal(s1.simulation.people.player.location,P+'.school_hall');
 assert.equal(s1.actors.player.facts['hp.lead.house'],undefined,'no house until sorted');
 assert.equal(hpPositionLine(hpPositions(s1)),'Pupil, Hogwarts (first year)');
 assert.equal(preview(f,ARRIVE).eligible,false,'arrival is once-only');
 const route=hpSchoolRoute(s1);assert.equal(route.next.id,SORT);
 assert.deepEqual(route.locked.map(o=>o.label),['Be placed in Hufflepuff','Be placed in Ravenclaw','Be placed in Slytherin']);
 assert.ok(route.locked.every(o=>o.reason.length>20));
 const s2=run(f,SORT);
 assert.equal(s2.actors.player.facts['hp.lead.house'],'gryffindor');
 assert.equal(preview(f,SORT).eligible,false,'Sorting is once-only');
 assert.equal(hpSchoolRoute(s2).next,null);assert.equal(hpSchoolRoute(s2).house,'Gryffindor');
 assert.equal(hpPositionLine(hpPositions(s2)),'Pupil, Hogwarts (first year); Gryffindor house');
});
test('locked houses have no command, and the Sorting needs arrival first',()=>{
 const f=setup();atDay(f,40);
 for(const h of ['hufflepuff','ravenclaw','slytherin'])assert.throws(()=>commitSimulationCommand(f.plan.state,f.registry,{id:`${P}.sorting.${h}`},f.ctxFor(f.plan)));
 assert.equal(preview(f,SORT).eligible,false);assert.match(preview(f,SORT).reasons.join(' '),/not at the school|Return to/);
});
test('save and reload keep both facts; the Reports Now note and the class duty follow in term',()=>{
 const f=setup();atDay(f,32,10);run(f,ARRIVE);run(f,SORT);
 const reloaded=loadExpansionState(JSON.parse(JSON.stringify(f.plan.state)),f.registry);
 assert.equal(reloaded.actors.player.facts['hp.lead.atSchool'],true);assert.equal(reloaded.actors.player.facts['hp.lead.house'],'gryffindor');
 assert.equal(hpSchoolRoute(reloaded).next,null);
 assert.equal(hpLeadProjection(reloaded).school.house,'Gryffindor');
 // the shell clock reads the life's own calendar; use a state shaped from the real one, in term time
 registerHpLeadDomain(def=>def,()=>reloaded,{read(){},command(){}});
 assert.match(readLocalClock().note,/Pupil, Hogwarts \(first year\); Gryffindor house$/);
 assert.equal(hpDutyActive(reloaded),true,'class slot active in term');
});
test('the school route survives a private cast that replaces the household acts',()=>{
 const cast={schema:'hp-cast/1',locations:[],people:[],householdActs:{acts:[{id:P+'.w1.one',place:P+'.cupboard',minutes:5,label:'One',description:'d',report:'r',knowledgeKey:P+'.w1.k',operation:'use',effects:[]}],sequences:[{id:P+'.s',title:'S',stages:[{commandId:P+'.w1.one',label:'One'}]}]}};
 const raw=withHpLeadCast(packNative(P),cast);
 assert.deepEqual(raw.simulation.commands.map(c=>c.id),[P+'.w1.one',ARRIVE,SORT,P+'.lesson_charms',P+'.charms_practice',P+'.lesson_potions']);
 const f=setup(raw);atDay(f,32,10);assert.equal(preview(f,ARRIVE).eligible,true);
});
