// W8-A: the route from Harry's summer to Hogwarts: arrival on day 32 (1 September), then the Sorting (canon: Gryffindor, others locked).
import test from 'node:test';
import {hpLeadExamCommands} from '../src/world_packs/book_hp_lead_exam_data.js';
const hpExamCommandIds=hpLeadExamCommands.map(c=>c.id);
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packNative} from '../src/world_pack_registry.js';
import {createContentRegistry,createExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack,registerStructuredCommandExtension} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign,adoptStructuredExtension} from '../src/structured_pack_runtime.js';
import {requireStructuredContent} from '../src/structured_pack_state.js';
import {commitSimulationCommand,advanceSimulationBoundary,previewSimulationCommand} from '../src/simulation.js';
import {hpLeadProjection,hpSchoolRoute,registerHpLeadDomain} from '../src/book_world_hp_lead_domain.js';
import {validateHpLeadCast,withHpLeadCast} from '../src/book_world_hp_lead_pack.js';
import {compileHpLeadFlight,hpLeadFlightArc,hpSchoolPassageClockRequest,HP_LEAD_FLIGHT} from '../src/book_world_hp_lead_flight.js';
import {compileHpLeadDuel,HP_LEAD_DUEL} from '../src/book_world_hp_lead_duel.js';
import {compileHpLeadHalloween,HP_LEAD_HALLOWEEN} from '../src/book_world_hp_lead_halloween.js';
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
 return {registry,d,record:begun.record,plan:begun.plan,ctxFor,opening:begun.plan.state.simulation.knowledge.player[P+'.opening'].at};
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
 assert.deepEqual(raw.simulation.commands.map(c=>c.id),[P+'.w1.one',ARRIVE,SORT,P+'.go_dormitory',P+'.leave_dormitory',P+'.lesson_charms',P+'.charms_practice',P+'.lesson_potions',P+'.tie.ron_family',P+'.tie.ron_practice',P+'.make.cure_boils.procedure.1',P+'.make.cure_boils.procedure.2',P+'.make.cure_boils',P+'.make.cure_boils.use',P+'.make.cure_boils_quills_early.procedure.1',P+'.make.cure_boils_quills_early',P+'.make.cure_boils_quills_early.use',P+'.sp.use.levitation_charm',P+'.sp.use.pass_feather',...hpExamCommandIds]);
 const f=setup(raw);atDay(f,32,10);assert.equal(preview(f,ARRIVE).eligible,true);
});
test('a private school week joins the train to placement and later work through native receipts',()=>{
 const act=(id,place,label)=>({id,place,minutes:5,label,description:'A synthetic test action.',report:label,knowledgeKey:id+'.seen',operation:'use'});
 const sequence=(id,acts)=>({acts,sequences:[{id,title:id,stages:acts.map(({id:commandId,label})=>({commandId,label}))}]});
 const home=act(P+'.w1.finish',P+'.cupboard','Finish at home');
 const welcome=act(P+'.w6.welcome',P+'.school_hall','Hear the welcome');
 const preference=act(P+'.w6.preference',P+'.school_hall','Voice a preference');
 const visit=act(P+'.w6.visit',P+'.school_hall','Keep the appointment');
 const cast={schema:'hp-cast/1',locations:[],people:[],householdActs:sequence(P+'.home', [home]),
  schoolWeek:{...sequence(P+'.w6.week',[welcome,preference,visit]),placementAfter:preference.id}};
 assert.deepEqual(validateHpLeadCast(cast),[]);
 const f=setup(withHpLeadCast(packNative(P),cast));
 const next=()=>hpLeadProjection(f.plan.state,cast.householdActs,{},cast.schoolWeek).arc.next?.id;
 atDay(f,32,10);
 assert.equal(preview(f,ARRIVE).eligible,false);
 assert.equal(next(),home.id);run(f,home.id);
 assert.equal(next(),ARRIVE);run(f,ARRIVE);
 assert.equal(next(),welcome.id);
 assert.equal(preview(f,SORT).eligible,false);
 run(f,welcome.id);assert.equal(next(),preference.id);run(f,preference.id);
 assert.equal(next(),SORT);
 assert.equal(preview(f,visit.id).eligible,false);
 assert.equal(preview(f,P+'.go_dormitory').eligible,false);
 assert.equal(f.plan.state.actors.player.facts['hp.lead.house'],undefined);
 run(f,SORT);assert.equal(next(),visit.id);run(f,visit.id);
 assert.equal(next(),undefined);
 assert.equal(preview(f,P+'.go_dormitory').eligible,true);
 const reloaded=loadExpansionState(JSON.parse(JSON.stringify(f.plan.state)),f.registry);
 assert.equal(hpLeadProjection(reloaded,cast.householdActs,{},cast.schoolWeek).arc.done,true);
 assert.equal(reloaded.actors.player.facts['hp.lead.house'],'gryffindor');
});
// IDEA_AUDIT_2026-11-06 F1: a cast whose last act leaves the lead somewhere else (the real one ends away from the opening room)
// must still reach the school. The act is committed natively, so the player's place comes from the story, not a set location.
test('arrival leaves from where the cast story ends, not from the opening room',()=>{
 const act=(n,place,effects)=>({id:`${P}.f1.${n}`,place,minutes:5,label:n,description:'d',report:'r',knowledgeKey:`${P}.f1.${n}.k`,operation:'use',effects});
 const cast={schema:'hp-cast/1',locations:[{id:P+'.f1_depot',label:'Depot',description:'d'},{id:P+'.f1_road',label:'Road',description:'d'}],people:[],
  householdActs:{acts:[act('leave',P+'.cupboard',[{type:'relocate',actor:'player',location:P+'.f1_road'}]),act('home',P+'.f1_road',[{type:'relocate',actor:'player',location:P+'.f1_depot'}])],
   sequences:[{id:P+'.f1',title:'F1',stages:[{commandId:`${P}.f1.leave`,label:'leave'},{commandId:`${P}.f1.home`,label:'home'}]}]}};
 const raw=withHpLeadCast(packNative(P),cast);
 assert.equal(raw.simulation.commands.find(c=>c.id===ARRIVE).location,P+'.f1_depot');
 assert.equal(packNative(P).simulation.commands.find(c=>c.id===ARRIVE).location,P+'.cupboard','the public stub keeps its departure');
 const f=setup(raw);run(f,`${P}.f1.leave`);run(f,`${P}.f1.home`);
 assert.equal(f.plan.state.simulation.people.player.location,P+'.f1_depot');
 atDay(f,31,1000);assert.equal(preview(f,ARRIVE).eligible,false,'still waits for 1 September');
 atDay(f,32,10);const p=preview(f,ARRIVE);assert.equal(p.eligible,true,p.reasons.join(' '));
 const s=run(f,ARRIVE);assert.equal(s.simulation.people.player.location,P+'.school_hall');assert.equal(s.actors.player.facts['hp.lead.atSchool'],true);
 const reloaded=loadExpansionState(JSON.parse(JSON.stringify(s)),f.registry);
 assert.equal(reloaded.simulation.people.player.location,P+'.school_hall');assert.equal(preview({...f,plan:{...f.plan,state:reloaded}},SORT).eligible,true);
});

test('flying continuation keeps the exact school beginning and validates targetless pending work',()=>{
 const H=P+'.school_hall',finish=P+'.w6.return',start=HP_LEAD_FLIGHT+'.breakfast',end=HP_LEAD_FLIGHT+'.pursuit';
 const row=(id,place=H)=>({id,place,minutes:5,label:id,description:'A synthetic test action.',report:id,knowledgeKey:id+'.seen',operation:'use'});
 const sequence=(id,acts)=>({acts,sequences:[{id,title:id,stages:acts.map(({id:commandId,label})=>({commandId,label}))}]});
 const home=row(P+'.w1.finish',P+'.cupboard'),preference=row(P+'.w6.preference'),returned=row(finish);
 const cast={schema:'hp-cast/1',locations:[],people:[],householdActs:sequence(P+'.home',[home]),
  schoolWeek:{...sequence(P+'.w6.week',[preference,returned]),placementAfter:preference.id}};
 const raw=withHpLeadCast(packNative(P),cast),f=setup(raw);
 const pack={schema:1,baseHash:hash(raw),data:sequence(HP_LEAD_FLIGHT,[{...row(start),minutes:240},row(end)])};
 const definition=compileHpLeadFlight(pack,f.d);
 const extension=registerStructuredCommandExtension(definition,hash(definition),f.d,f.registry);
 const definitions=new Map([[f.d.id,f.d]]);
 const request={id:extension.id,revision:extension.revision,contentHash:extension.contentHash};
 const adopt=()=>adoptStructuredExtension(f.plan.state,f.d,f.record,request,f.ctxFor(f.plan));
 const oldContext=f.ctxFor;
 const original=structuredClone(f.record);
 assert.throws(adopt,/Friday tea/);
 atDay(f,32,10);
 for(const id of [home.id,ARRIVE,preference.id,SORT,finish])run(f,id);
 requireStructuredContent(original,definitions,f.plan.state);
 assert.equal(preview(f,start).visible,false);
 assert.equal(preview(f,start).eligible,false);
 const admitted=adopt();
 assert.deepEqual(admitted.plan.state,f.plan.state);
 assert.equal(admitted.record.contentHash,original.contentHash);
 f.ctxFor=p=>({...oldContext(p),structuredNative:{...admitted.record,bound:true}});
 assert.equal(preview(f,start).eligible,true);
 assert.equal(preview(f,end).eligible,false);
 const pending=commitSimulationCommand(f.plan.state,f.registry,{id:start},f.ctxFor(f.plan));
 const exact=JSON.parse(JSON.stringify(pending.state)),job=exact.simulation.jobs[0];
 assert.deepEqual(job.participants,['player']);
 assert.equal(job.targetId,null);
 assert.equal(hpSchoolPassageClockRequest(exact,admitted.record,extension),120);
 assert.equal(hpSchoolPassageClockRequest({...exact,clock:job.due-7},admitted.record,extension),7);
 assert.equal(hpSchoolPassageClockRequest({...exact,clock:job.due},admitted.record,extension),null);
 assert.equal(hpSchoolPassageClockRequest(exact,original,extension),null);
 const offsite=structuredClone(exact);
 offsite.simulation.people.player.location=P+'.dormitory';
 assert.equal(hpSchoolPassageClockRequest(offsite,admitted.record,extension),null);
 requireStructuredContent(admitted.record,definitions,exact);
 assert.throws(()=>requireStructuredContent(original,definitions,exact),/saved content pin/);
 const changed=structuredClone(exact);changed.simulation.jobs[0].participants.push(P+'.ron');
 assert.throws(()=>requireStructuredContent(admitted.record,definitions,changed),/pending school extension/);
 pending.state=loadExpansionState(exact,f.registry);pending.state.clock=job.due;
 advanceSimulationBoundary(pending,f.registry,{player:f.ctxFor(pending)});
 f.plan=pending;
 assert.equal(hpLeadFlightArc(f.plan.state,pack).next.id,end);
 const activeFlight=commitSimulationCommand(f.plan.state,f.registry,{id:end},f.ctxFor(f.plan));
 assert.equal(hpSchoolPassageClockRequest(activeFlight.state,admitted.record,extension),null);
 run(f,end);
 requireStructuredContent(admitted.record,definitions,f.plan.state);
 assert.equal(hpLeadFlightArc(f.plan.state,pack).done,true);
});

test('the midnight appointment requires the pinned flight and actual prior work',()=>{
 const hall=P+'.school_hall',finish=P+'.w6.return',flightId=HP_LEAD_FLIGHT+'.decision';
 const entry=HP_LEAD_DUEL+'.entry',door=HP_LEAD_DUEL+'.door';
 const wandKey=JSON.stringify({id:P+'.test_wand'});
 const row=(id,place=hall)=>({id,place,venue:'The school',minutes:1,label:id,description:'A test action.',report:id,knowledgeKey:id+'.seen',operation:'use'});
 const sequence=(id,acts)=>({acts,sequences:[{id,title:id,stages:acts.map(({id:commandId,label})=>({commandId,label}))}]});
 const home=row(P+'.w1.finish',P+'.cupboard'),preference=row(P+'.w6.preference');
 const cast={schema:'hp-cast/1',locations:[],people:[],items:[{id:P+'.test_wand',label:'A test wand'}],
  householdActs:sequence(P+'.home',[home]),
  schoolWeek:{...sequence(P+'.w6.week',[preference,row(finish)]),placementAfter:preference.id}};
 const f=setup(withHpLeadCast(packNative(P),cast));
 const install=definition=>registerStructuredCommandExtension(definition,hash(definition),f.d,f.registry);
 const flight=install(compileHpLeadFlight({schema:1,baseHash:f.d.contentHash,data:sequence(HP_LEAD_FLIGHT,[row(flightId)])},f.d));
 const pack={schema:1,baseHash:f.d.contentHash,data:sequence(HP_LEAD_DUEL,[row(entry),{...row(door),requires:{fact:'item.'+wandKey,op:'gte',value:1,reason:'Bring your wand.'}}])};
 const duel=install(compileHpLeadDuel(pack,f.d));
 const oldContext=f.ctxFor;
 let record=f.record;
 f.ctxFor=plan=>({...oldContext(plan),structuredNative:{...record,bound:true}});
 const adopt=extension=>adoptStructuredExtension(f.plan.state,f.d,record,{id:extension.id,revision:extension.revision,contentHash:extension.contentHash},f.ctxFor(f.plan));
 atDay(f,32,10);
 for(const id of [home.id,ARRIVE,preference.id,SORT,finish])run(f,id);
 assert.throws(()=>adopt(duel),/Finish the flying lesson/);
 record=adopt(flight).record;
 assert.throws(()=>adopt(duel),/Finish the flying lesson/);
 run(f,flightId);
 const before=structuredClone(f.plan.state),flightRecord=record;
 const admitted=adopt(duel);
 record=admitted.record;
 assert.deepEqual(admitted.plan.state,before);
 assert.deepEqual(record.extensions[0],flightRecord.extensions[0]);
 assert.equal(record.contentHash,flightRecord.contentHash);
 f.plan.state.simulation.knowledge.player[entry+'.seen']=structuredClone(f.plan.state.simulation.knowledge.player[flightId+'.seen']);
 assert.equal(preview(f,door).eligible,false);
 delete f.plan.state.simulation.knowledge.player[entry+'.seen'];
 run(f,entry);
 assert.equal(preview(f,door).eligible,false,'the borrowed wand must be on hand');
 f.plan.gameplay.player.inventory[wandKey]=1;
 assert.equal(preview(f,door).eligible,true);
 const pending=commitSimulationCommand(f.plan.state,f.registry,{id:door},f.ctxFor(f.plan));
 const definitions=new Map([[f.d.id,f.d]]);
 requireStructuredContent(record,definitions,pending.state);
 assert.throws(()=>requireStructuredContent(flightRecord,definitions,pending.state),/saved content pin/);
 run(f,door);
 assert.equal(f.plan.state.actors.player.completed[door],1);
 assert.equal(f.plan.gameplay.player.inventory[wandKey],1,'the borrower gives the same wand back');
});

test('Halloween uses the exact duel, actual Ron and his own wand',()=>{
 const f=setup(),hall=P+'.school_hall',ron=P+'.ron',root=HP_LEAD_HALLOWEEN,account=HP_LEAD_DUEL+'.account';
 const predecessorHash=hash(account),base={id:f.d.id,revision:f.d.revision,contentHash:f.d.contentHash};
 const duel={id:HP_LEAD_DUEL,revision:1,contentHash:predecessorHash,base,commands:[{id:account,effects:[]}]};
 f.d.extensions=[duel];
 const key=JSON.stringify({id:root+'.wand'}),lift=root+'.lift';
 const awards=['first','second','third'].map(label=>({key:root+'.'+label,label}));
 const act={id:lift,place:hall,venue:'Bathroom',minutes:1,label:'Lift the club',description:'Give Ron room.',report:'Ron lifted the club.',
  knowledgeKey:lift+'.seen',operation:'use',targetId:ron,requires:{fact:'target.item.'+key,op:'gte',value:1},
  effects:awards.map((a,i)=>({type:'fact',actor:'player',scope:'world',key:a.key,value:i?-5:5}))};
 const pack={schema:1,baseHash:f.d.contentHash,predecessorHash,items:[{id:root+'.wand',label:'Wand',description:'Ron’s wand.',value:1}],
  status:[{id:root+'.result',label:'Rescue',knowledgeKey:act.knowledgeKey}],awards,data:{acts:[act],
   sequences:[{id:root,title:'Halloween',stages:[{commandId:lift,label:act.label}]}]}};
 assert.throws(()=>compileHpLeadHalloween({...pack,predecessorHash:hash('other duel')},f.d),/Invalid Halloween account/);
 const def=compileHpLeadHalloween(pack,f.d);
 const extension=registerStructuredCommandExtension(def,hash(def),f.d,f.registry);
 const original=f.ctxFor;
 let record={...f.record,extensions:[{id:duel.id,revision:duel.revision,contentHash:duel.contentHash}]};
 f.ctxFor=plan=>({...original(plan),structuredNative:{...record,bound:true}});
 atDay(f,32,10);run(f,ARRIVE);run(f,SORT);
 const adopt=()=>adoptStructuredExtension(f.plan.state,f.d,record,{id:extension.id,revision:extension.revision,contentHash:extension.contentHash},f.ctxFor(f.plan));
 assert.throws(adopt,/Finish the midnight outing/);
 f.plan.state.actors.player.completed[account]=1;
 record=adopt().record;
 assert.deepEqual(record.extensions[0],{id:duel.id,revision:1,contentHash:predecessorHash});
 const ctx=plan=>({...f.ctxFor(plan),targetId:ron});
 const quote=()=>previewSimulationCommand(f.plan.state,f.registry,lift,ctx(f.plan));
 assert.equal(quote().eligible,false);
 f.plan.gameplay.player.inventory[key]=1;
 assert.equal(quote().eligible,false,'Harry’s stock cannot provide Ron’s instrument');
 f.plan.state.simulation.owners[ron][key]=1;
 assert.equal(quote().eligible,true);
 const start=()=>commitSimulationCommand(f.plan.state,f.registry,{id:lift},ctx(f.plan));
 const separated=start();
 const pending=separated.state.simulation.jobs[0];
 assert.deepEqual(pending.participants,['player',ron]);
 const definitions=new Map([[f.d.id,f.d]]);
 requireStructuredContent(record,definitions,separated.state);
 assert.throws(()=>requireStructuredContent({...record,extensions:record.extensions.slice(0,1)},definitions,separated.state),/saved content pin/);
 separated.state.simulation.people[ron].location=P+'.dormitory';
 separated.state.clock=pending.due;
 advanceSimulationBoundary(separated,f.registry,{player:ctx(separated)});
 assert.equal(separated.state.actors.player.completed[lift],undefined);
 const finished=start();
 finished.state.clock=pending.due;
 advanceSimulationBoundary(finished,f.registry,{player:ctx(finished)});
 assert.equal(finished.state.actors.player.completed[lift],1);
 assert.equal(finished.state.simulation.owners[ron][key],1);
 assert.deepEqual(awards.map(({key})=>finished.state.worlds[P+'.world'].facts[key]),[5,-5,-5]);
});
