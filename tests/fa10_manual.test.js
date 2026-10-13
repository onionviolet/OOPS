import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects} from '../src/feature_expansion_objects_host.js';
import {commitSteamBOHCommand as commit,steamBOHPresentation} from '../src/steam_boh_host.js';
import {steamBOHFacts,validateSteamBOHState} from '../src/steam_boh_facts.js';
import {STEAM_BOH_IDS as I,STEAM_BOH_KEYS as K} from '../src/steam_boh_content.js';
import {featureObjectDefinitions} from '../src/feature_expansion_objects.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';

// SOURCE fixtures only: supplied stock/body/money and deterministic scheduler steps are not native play.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:p.equipment||{player:{}},
 facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'campaign.anchor':true},nativeBody:body,nativeAlive:true,nativeReady:true,
 nativeCareFrame:{clock:p.state.clock,calendarMinute:600+p.state.clock,battleRunning:false},...extra});
const command=(p,id,extra={},seq=p.state.sequence)=>commit(p.state,registry,{type:I.group,id,sequence:seq},ctx(p,extra),seq);
const advance=(p,n,extra={})=>{const c=ctx(p,extra);const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...out,vitals:out.vitals||c.vitals};};
const reload=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const stock=(p,k)=>p.gameplay.player.inventory[k]||0;
const job=p=>p.state.simulation.jobs.find(j=>j.commandId.startsWith(I.prefix));
const cancel=p=>commit(p.state,registry,{type:I.group,action:'cancel',id:job(p).id,sequence:p.state.sequence},ctx(p));
function opened(){
 let p={state:initializeExpedition(createExpansionState(17)),external:{money:20},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=beginBodyRecord(p.state,registry,ctx(p));p.state.simulation.people.player.body=structuredClone(body);p=beginFeatureObjects(p.state,registry,ctx(p));p=command(p,I.begin);
 p.gameplay.player.inventory={[K.manual]:1,[K.sound]:4,[K.sharp]:1,[K.fine]:1,[K.sap]:2,[K.paper]:2,[K.ink]:2};return p;
}
const learned=()=>advance(command(advance(command(opened(),I.guided),3),I.read),3);
const learnFacts=p=>steamBOHFacts(p.state,ctx(p),registry);

test('SOURCE real copy scheduler reserves exact costs, returns paid physical stock once and restores pending',()=>{
 const p=opened(),money=p.external.money,effort=p.state.simulation.people[I.owner].vitals.stamina,coins=p.state.actors[I.owner].resources.coins;
 const pending=command(p,I.copy);assert.equal(job(pending).due-p.state.clock,3);assert.equal(stock(pending,K.paper),1);assert.equal(stock(pending,K.ink),1);assert.equal(pending.external.money,money-2);
 assert.equal(pending.state.simulation.people[I.owner].vitals.stamina,effort-1);assert.deepEqual(reload(pending).state,pending.state);
 const done=advance(reload(pending),3);assert.equal(stock(done,K.manual),2);assert.equal(done.state.actors[I.owner].resources.coins,coins+2);assert.equal(done.state.simulation.jobs.length,0);
 const later=advance(done,3);assert.equal(stock(later,K.manual),2);assert.equal(later.state.actors.player.completed[I.copy],1);
});
test('SOURCE trial diagnostic/four-minute fatigue, exact rest and comparison remain separate from learned read',()=>{
 let p=opened(),pending=command(p,I.trial);assert.equal(stock(pending,K.manual),0);assert.equal(stock(pending,K.sound),3);assert.equal(pending.vitals.player.stamina,98);
 p=advance(reload(pending),3);assert.equal(stock(p,K.manual),1);assert.equal(stock(p,K.sound),4);assert.equal(p.state.simulation.conditions.player[I.fatigue].expiresAt,p.state.clock+4);
 assert.match(p.state.simulation.knowledge.player[I.prefix+'diagnostic'].value,/missing edge-clearance comparison/);assert.equal(learnFacts(p)['steamBOH.learned'],false);
 assert.throws(()=>command(p,I.compare));assert.throws(()=>command(p,I.guided));assert.throws(()=>command(p,I.read));assert.deepEqual(reload(p).state,p.state);
 const before=p.vitals.player.stamina;p=advance(command(p,I.rest),2);assert.equal(p.vitals.player.stamina,before);assert.equal(p.state.simulation.conditions.player[I.fatigue],undefined);
 p=advance(command(p,I.compare),2);assert.equal(p.state.actors.player.facts[I.diagnostic],false);assert.equal(learnFacts(p)['steamBOH.prepared'],true);assert.equal(learnFacts(p)['steamBOH.learned'],false);assert.deepEqual(reload(p).state,p.state);
 p=advance(command(p,I.read),3);assert.equal(learnFacts(p)['steamBOH.learned'],true);assert.equal(stock(p,K.manual),1);assert.deepEqual(reload(p).state,p.state);
});
test('SOURCE natural expiry and rest crossing expiry retain legal diagnostic history',()=>{
 for(const rest of [false,true]){let p=advance(command(opened(),I.trial),3);p=advance(p,3);p=rest?advance(command(p,I.rest),2):advance(p,1);
 assert.equal(p.state.simulation.conditions.player[I.fatigue],undefined);p=advance(command(p,I.compare),2);assert.equal(learnFacts(p)['steamBOH.prepared'],true);assert.deepEqual(reload(p).state,p.state);}
});
test('SOURCE paid guided comparison prepares only; separate read preserves actual procedure despite losing copy',()=>{
 let p=opened(),coins=p.state.actors[I.owner].resources.coins,effort=p.state.simulation.people[I.owner].vitals.stamina;
 p=advance(command(p,I.guided),3);assert.equal(p.external.money,17);assert.equal(p.state.actors[I.owner].resources.coins,coins+3);assert.equal(p.state.simulation.people[I.owner].vitals.stamina,effort-1);
 assert.equal(p.state.actors.player.completed[I.trial],undefined);assert.equal(learnFacts(p)['steamBOH.learned'],false);assert.throws(()=>command(p,I.trial));assert.deepEqual(reload(p).state,p.state);
 p=advance(command(p,I.read),3);assert.equal(p.state.actors.player.facts[I.procedure],1);delete p.gameplay.player.inventory[K.manual];assert.equal(learnFacts(p)['steamBOH.learned'],true);assert.throws(()=>command(p,I.prefix+'kits_sharp'));
});
test('SOURCE both learned knife variants conserve held copy, dull held sharp key, produce two real kit keys once',()=>{
 for(const [variant,worn] of [['sharp','dull'],['fine','fineDull']]){const p=learned(),pending=command(p,I.prefix+'kits_'+variant);
 assert.equal(stock(pending,K.manual),0);assert.equal(stock(pending,K[variant]),0);assert.equal(stock(pending,K.sound),2);assert.equal(stock(pending,K.sap),1);assert.equal(pending.vitals.player.stamina,p.vitals.player.stamina-1);assert.equal(job(pending).due-p.state.clock,3);
 const done=advance(reload(pending),3);assert.equal(stock(done,K.manual),1);assert.equal(stock(done,K[worn]),1);assert.equal(stock(done,K[variant]),0);assert.equal(stock(done,K.kit),2);assert.deepEqual(reload(done).state,done.state);assert.equal(stock(advance(done,3),K.kit),2);
 assert.equal(done.acquisitions.filter(a=>[K.manual,K[worn]].includes(a.key)).length,0);}
 const d=featureObjectDefinitions.commands.find(d=>d.id==='feature_objects.kit_sharp_own');assert.equal(d.duration,4);assert.equal(d.costs.find(c=>c.type==='vital').amount,-2);
});
test('SOURCE cancel copy/trial/rest/comparison/guidance/read/both kits refunds exact inputs and effort without result',()=>{
 for(const id of [I.copy,I.trial,I.guided,I.rest,I.compare,I.read,I.prefix+'kits_sharp',I.prefix+'kits_fine']){const p=id===I.read?advance(command(opened(),I.guided),3):id===I.rest?advance(command(opened(),I.trial),3):id===I.compare?advance(advance(command(opened(),I.trial),3),4):id.includes('kits_')?learned():opened();const pending=command(p,id),out=cancel(reload(pending));
 assert.deepEqual(out.gameplay,p.gameplay);assert.deepEqual(out.external,p.external);assert.deepEqual(out.vitals,p.vitals||ctx(p).vitals);assert.equal(out.state.simulation.people[I.owner].vitals.stamina,p.state.simulation.people[I.owner].vitals.stamina);assert.deepEqual(out.state.actors.player.completed,p.state.actors.player.completed);assert.equal(out.state.simulation.jobs.length,0);assert.throws(()=>cancel(out));}
});
test('SOURCE real scheduler support loss refunds body/site/clock/author/hands/battle failures without outcome',()=>{
 for(const extra of [{nativeAlive:false},{facts:{location:'Shack'}},{nativeCareFrame:{clock:999999,calendarMinute:600,battleRunning:false}},{nativeCareFrame:{clock:0,calendarMinute:600,battleRunning:true}}]){const p=opened(),pending=command(p,I.guided),out=advance(pending,3,extra);assert.deepEqual(out.gameplay,p.gameplay);assert.deepEqual(out.external,p.external);assert.equal(out.state.actors.player.completed[I.guided],undefined);}
 for(const alter of [p=>{p.state.actors[I.owner].facts['feature_objects.willing']=false;},p=>{p.state.actors[I.owner].sources[I.authorMethod].expiresAt=p.state.clock+1;},p=>{p.state.simulation.sites[I.site].capacity=2;},p=>{p.state.simulation.people.player.body.hands=1;},p=>{p.state.simulation.conditions.player={'body.sore_hands':{intensity:1,expiresAt:p.state.clock+10,cause:'source:fixture'}};}]){const p=opened(),pending=command(p,I.guided);alter(pending);const out=advance(pending,3);assert.deepEqual(out.gameplay,p.gameplay);assert.equal(out.external.money,p.external.money);assert.equal(out.state.actors.player.completed[I.guided],undefined);}
});
test('SOURCE admission excludes borrowed/equipped/missing references, alien actor/body/realm and occupied bench',()=>{
 for(const alter of [p=>{delete p.gameplay.player.inventory[K.manual];},p=>{p.state.simulation.custody.loan={holder:'player',owner:I.owner,key:K.manual,count:1};},p=>{p.equipment={player:{hand:K.manual}};},p=>{p.state.actors.player.worldId='foreign';},p=>{p.state.simulation.sites[I.site].reservations.foreign='foreign';},p=>{p.state.simulation.people.player.body.ownerId='foreign';},p=>{p.state.simulation.people.player.body.hands=1;}]){const p=opened();alter(p);assert.throws(()=>command(p,I.guided));}
 for(const extra of [{actorId:'foreign'},{busy:true}])assert.throws(()=>command(opened(),I.guided,extra));
 for(const alter of [p=>{p.state.simulation.custody.loan={holder:'player',owner:I.owner,key:K.sharp,count:1};},p=>{p.equipment={player:{hand:K.sharp}};}]){const p=learned();alter(p);assert.throws(()=>command(p,I.prefix+'kits_sharp'));}
});
test('SOURCE stale host quotes and frozen save mutation reject while exact old absence stays inert',()=>{
 const p=opened(),pending=command(p,I.copy);assert.throws(()=>command(pending,I.copy,{},p.state.sequence));
 for(const alter of [j=>{j.costs[0].amount=-9;},j=>{j.effects.shift();},j=>{j.due++;},j=>{j.steamBOHWork.manualVersion=2;},j=>{j.participants.push('foreign');},j=>{j.completionSupport.requires=null;},j=>{j.reservationReturns=0;}]){const bad=structuredClone(pending);alter(job(bad));assert.throws(()=>reload(bad));}
 const absent=initializeExpedition(createExpansionState(17)),before=structuredClone(absent);validateSteamBOHState(absent,registry);steamBOHFacts(absent);assert.deepEqual(absent,before);assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(absent)),registry),absent);
 const learnedState=learned();for(const alter of [s=>{s.actors.player.facts[I.procedure]=2;},s=>{delete s.simulation.knowledge.player[I.prefix+'procedure'];},s=>{s.simulation.knowledge.player[I.prefix+'procedure'].basis.attributedTo='foreign';}]){const bad=structuredClone(learnedState);alter(bad.state);assert.throws(()=>reload(bad));}
 const beforeView=structuredClone(p);steamBOHPresentation(p.state,registry,ctx(p));assert.deepEqual(p,beforeView);
});
test('SOURCE FA10 durable quota failure leaves live original untouched; explicit retry stores exact caused result',()=>{
 const p=learned(),pending=command(p,I.prefix+'kits_sharp'),done=advance(pending,3),original=structuredClone(pending);let calls=0,saved;
 const storage={setItem(_key,value){calls++;if(calls===1)throw Error('quota');saved=value;}};
 const options={storage,key:'source',createSave:()=>JSON.stringify({character:{money:pending.external.money},inventories:{person:{main_character:{}}},levels:{person:{main_character:{skill_xp:{}}}},expansion:pending.state}),bindings:{player:{category:'person',id:'main_character'}}};
 assert.throws(()=>persistExpansionPlan(done,options),/quota/);assert.deepEqual(pending,original);assert.equal(stock(pending,K.kit),0);
 persistExpansionPlan(done,options);assert.equal(calls,2);assert.deepEqual(loadExpansionState(JSON.parse(saved).expansion,registry),done.state);assert.equal(JSON.parse(saved).inventories.person.main_character[K.kit].count,2);assert.equal(stock(done,K.kit),2);assert.equal(done.state.actors.player.completed[I.prefix+'kits_sharp'],1);
});
