import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from '../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand as workshop} from '../src/reference_gameplay_host.js';
import {REFERENCE_GAMEPLAY_IDS as R,REFERENCE_GAMEPLAY_KEYS as K} from '../src/reference_gameplay_content.js';
import {startAuditedKitReserve,controlAuditedKitReserve} from '../src/audited_kit_reserve_host.js';
import {availableOwnedNativeCount} from '../src/audited_kit_reserve_facts.js';
import {workPlanNextBoundary,startWorkPlan} from '../src/feature_expansion_work_plan.js';
import {setSimulationProgram,cancelSimulationJob,enrollSimulation,commitSimulationCommand} from '../src/simulation.js';
import {beginRepositoryAbsorption,commitRepositoryAbsorption,repositoryAbsorptionPresentation,commitRepositoryProjection} from '../src/repository_absorption_host.js';
import {REPOSITORY_ABSORPTION_ITEMS as Q} from '../src/repository_absorption_content.js';
import {beginSociety,commitSocietyAction} from '../src/feature_expansion_society_host.js';
import {SOCIETY_ITEMS as S} from '../src/feature_expansion_society.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';

// Controlled SOURCE fixtures only. Fixture money/materials/body/location are not native acquisition evidence.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
 facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'village.shackUnlocked':true,'campaign.anchor':true},nativeBody:body,nativeAlive:true,nativeReady:true,...extra});
const advance=(p,n,extra={})=>{const c=ctx(p,extra);const out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...out,vitals:out.vitals||c.vitals};};
const stock=(p,k)=>p.gameplay.player.inventory[k]||0;
const cursor=p=>p.state.simulation.workPlans.cursors.player;
const reload=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const control=(p,action,extra={})=>controlAuditedKitReserve(p.state,registry,{action,cursorId:cursor(p).id,...extra},ctx(p));
function base(){return {state:initializeExpedition(createExpansionState(17)),external:{money:100},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};}
function opened(kits=0){let p=base();p=beginBodyRecord(p.state,registry,ctx(p));p.state.simulation.people.player.body=structuredClone(body);p=beginFeatureObjects(p.state,registry,ctx(p));
 p=commitFeatureObjectCommand(p.state,registry,{id:'feature_objects.inspect'},ctx(p));p=advance(p,2);p=enrollReferenceGameplay(p.state,ctx(p));p=workshop(p.state,registry,{id:R.open},ctx(p));
 p.gameplay.player.inventory={...(kits?{[K.kit]:kits}:{}),[K.resin]:3,[K.sound]:6};return p;}
const reserve=p=>startAuditedKitReserve(p.state,registry,ctx(p));
const repo=(p,id)=>commitRepositoryAbsorption(p.state,registry,{id},ctx(p));
const view=p=>repositoryAbsorptionPresentation(p.state,registry,ctx(p));
function courier(){let p=base();p=beginRepositoryAbsorption(p.state,registry,ctx(p));p=repo(p,'repositories.decline');p=advance(p,2);p=advance(repo(p,'repositories.lesson'),3);
 p.gameplay.player.inventory={[Q.kit]:8,[Q.pellet]:8};return p;}

test('SOURCE reserve 4 and held 3 reserve nothing and add no polling; released 2 starts one frozen batch',()=>{
 let p=reserve(opened(4));assert.equal(cursor(p).stockHold,true);assert.equal(workPlanNextBoundary(p.state),Infinity);assert.equal(p.state.simulation.jobs.length,0);
 p.gameplay.player.inventory[K.kit]=3;p=advance(p,1);assert.equal(cursor(p).stockHold,true);assert.equal(p.state.simulation.jobs.length,0);
 p.gameplay.player.inventory[K.kit]=2;const before=structuredClone(p);p=advance(p,1);
 assert.equal(cursor(p).stockHold,false);assert.equal(cursor(p).stockAcceptedBatches,1);assert.equal(p.state.simulation.jobs.filter(j=>j.actorId==='player').length,1);
 assert.equal(stock(p,K.resin),stock(before,K.resin)-1);assert.equal(stock(p,K.sound),stock(before,K.sound)-2);assert.equal(p.native.staminaToFull,100-before.vitals.player.stamina+1);
 assert.equal(cursor(p).accepted.due-cursor(p).accepted.startedAt,3);p=advance(reload(p),3);assert.equal(stock(p,K.kit),4);assert.equal(cursor(p).stockHold,true);
});
test('SOURCE previously released 3 completes full two-kit output at 5',()=>{let p=reserve(opened(3));assert.equal(cursor(p).stockHold,false);p=advance(p,3);assert.equal(stock(p,K.kit),5);assert.equal(cursor(p).stockHold,true);assert.equal(cursor(p).stockAcceptedBatches,1);});
test('SOURCE accepted support failure refunds, uses slot, pauses without silent restart; explicit resume consumes remainder',()=>{
 let p=reserve(opened());const stamina=p.vitals.player.stamina;p=advance(p,3,{facts:{location:'Shack'}});
 assert.equal(cursor(p).status,'paused');assert.equal(cursor(p).stockAcceptedBatches,1);assert.equal(stock(p,K.kit),0);assert.equal(stock(p,K.resin),3);assert.equal(stock(p,K.sound),6);assert.equal(p.native.staminaToFull,100-stamina-1);
 p=advance(p,1);assert.equal(cursor(p).status,'paused');assert.equal(p.state.simulation.jobs.filter(j=>j.actorId==='player').length,0);
 p=control(reload(p),'resume');assert.equal(cursor(p).stockAcceptedBatches,2);p=advance(p,3,{facts:{location:'Shack'}});p=control(p,'resume');assert.equal(cursor(p).stockAcceptedBatches,3);
 p=advance(p,3,{facts:{location:'Shack'}});p=control(p,'resume');assert.equal(cursor(p).status,'complete');assert.equal(cursor(p).stockAcceptedBatches,3);assert.equal(stock(p,K.kit),0);
});
test('SOURCE future cancellation retains accepted job; current cancellation refunds it once',()=>{
 const p=reserve(opened());let future=control(p,'cancel');assert.equal(cursor(future).status,'cancelled');assert.equal(future.state.simulation.jobs.length,1);assert.equal(stock(future,K.resin),2);
 future=advance(reload(future),3);assert.equal(stock(future,K.kit),2);assert.equal(cursor(future).stockAcceptedBatches,1);
 const current=control(p,'cancel',{cancelCurrent:true});assert.equal(current.state.simulation.jobs.length,0);assert.equal(stock(current,K.resin),3);assert.equal(stock(current,K.sound),6);assert.equal(cursor(current).stockAcceptedBatches,1);
 assert.equal(stock(advance(current,6),K.kit),0);
});
test('SOURCE depleted inputs and manual pause do not silently restart; forged control rejected',()=>{
 let p=opened();delete p.gameplay.player.inventory[K.resin];p=reserve(p);assert.equal(cursor(p).status,'paused');p.gameplay.player.inventory[K.resin]=3;p=advance(p,1);assert.equal(cursor(p).stockAcceptedBatches,0);
 assert.throws(()=>controlAuditedKitReserve(p.state,registry,{action:'resume',cursorId:'forged'},ctx(p)),/changed/);p=control(p,'resume');p=control(p,'pause');p=advance(p,3);assert.equal(cursor(p).status,'paused');assert.equal(stock(p,K.kit),2);
});
test('SOURCE carried reserve excludes custody, equipped, foreign and invalid stock',()=>{
 const p=opened(4);assert.equal(availableOwnedNativeCount(p.state,ctx(p),K.kit),4);
 p.state.simulation.custody.loan={holder:'player',key:K.kit};assert.equal(availableOwnedNativeCount(p.state,ctx(p),K.kit),0);delete p.state.simulation.custody.loan;
 assert.equal(availableOwnedNativeCount(p.state,{...ctx(p),equipment:{player:{hand:K.kit}}},K.kit),0);
 p.state.simulation.people.player.inventory='simulation';assert.equal(availableOwnedNativeCount(p.state,ctx(p),K.kit),0);p.state.simulation.people.player.inventory='native';p.gameplay.player.inventory[K.kit]=NaN;assert.equal(availableOwnedNativeCount(p.state,ctx(p),K.kit),0);
});
test('SOURCE body, realm, location, clock and occupied bench block reserve admission or pause without charge',()=>{
 for(const alter of [p=>{p.state.simulation.people.player.life='dead';},p=>{p.state.simulation.people.player.body.hands=0;},p=>{p.state.actors.player.worldId='foreign';},p=>{p.state.realmPrototype={activeVisitId:'foreign'};},p=>{delete p.state.simulation.sites[R.site];}]){
 const p=opened();alter(p);assert.throws(()=>reserve(p));}
 const p=opened();p.state.simulation.sites[R.site].reservations.foreign=1;const next=reserve(p);assert.equal(cursor(next).status,'paused');assert.equal(stock(next,K.resin),3);
});
test('SOURCE root2 policy/receipt corruption rejects while exact held and pending clones restore',()=>{
 for(const p of [reserve(opened(4)),reserve(opened())]){assert.deepEqual(reload(p).state,p.state);
 for(const alter of [c=>{c.stockPolicy.lower=3;},c=>{c.stockAcceptedBatches=4;},c=>{if(c.accepted)c.accepted.due++;else c.stockHold='forged';}]){const bad=structuredClone(p);alter(cursor(bad));assert.throws(()=>reload(bad));}}
});
test('SOURCE selected existing old measured-pack program spends each batch, completes, depletes and refunds current work',()=>{
 let p=base();p.gameplay.player.inventory[JSON.stringify({id:'Rough wood log'})]=10;p.gameplay.oldCraftsman={inventory:{},skills:{},reputation:{}};p=enrollSimulation(p.state,registry,ctx(p));
 p=commitSimulationCommand(p.state,registry,{id:'village.commission'},ctx(p,{targetId:'oldCraftsman'}));p=commitSimulationCommand(p.state,registry,{id:'village.study_method'},ctx(p));
 const place={facts:{location:'Shack','village.shackUnlocked':true}};p=setSimulationProgram(p.state,registry,'village.measured_pack',3,ctx(p,place));
 const cancelled=cancelSimulationJob(p.state,registry,p.state.simulation.jobs.find(j=>j.actorId==='player').id,ctx(p,place));assert.equal(cancelled.state.simulation.programs.player.status,'paused');
 p=advance(reload(p),9,place);assert.equal(p.state.simulation.programs.player.status,'complete');assert.equal(stock(p,K.kit),3);
 p.gameplay.player.inventory={[JSON.stringify({id:'Rough wood log'})]:1};p.external.money=2;p=setSimulationProgram(p.state,registry,'village.measured_pack',3,ctx(p,place));p=advance(p,3,place);assert.equal(p.state.simulation.programs.player.status,'paused');
});
test('SOURCE actual legacy household mixed plan waits for resident and manual travel then produces useful kit',()=>{
 let p=base();p.gameplay.player.inventory[S.wood]=6;p.gameplay.player.skills.Perception={xp:0,enabled:true,parent:null};p=beginSociety(p.state,registry,ctx(p));p=commitSocietyAction(p.state,registry,{type:'command',id:'feature_society.terms'},ctx(p));
 p=startWorkPlan(p.state,registry,registry.workPlans,'feature_society.household_itinerary',ctx(p));assert.equal(p.state.simulation.workPlans.schema,1);
 p=advance(reload(p),14);assert.equal(cursor(p).status,'paused',cursor(p).reason);assert.equal(cursor(p).steps[cursor(p).index].kind,'travel',cursor(p).reason);
 const place={facts:{location:'Shack','village.shackUnlocked':true}};p=(awaitlessResume(p,place));p=advance(p,4,place);assert.equal(cursor(p).status,'complete');assert.equal(stock(p,K.kit),1);
});
function awaitlessResume(p,extra){return controlWorkPlan(p.state,registry,{action:'resume',cursorId:cursor(p).id},ctx(p,extra));}
import {controlWorkPlan} from '../src/feature_expansion_work_plan.js';
test('SOURCE repository previews reserve nothing, selected next job only reserves current inputs and stale request rejects',()=>{
 const p=courier(),before=structuredClone(p),v=view(p),a=v.actions.find(a=>a.projectionKind==='itinerary');assert(a?.eligible);assert.deepEqual(p,before);assert.equal(p.state.simulation.jobs.length,0);assert.deepEqual(v.itinerary.rows.map(r=>r.text.split(';')[0]),['0/3 completed','0/1 completed']);
 const request={projectionKind:'itinerary',request:a.request};const next=commitRepositoryProjection(p.state,registry,request,ctx(p));assert.equal(stock(next,Q.kit),7);assert.equal(stock(next,Q.pellet),7);assert.equal(next.state.simulation.jobs.length,1);assert.equal(stock(next,Q.protectedKit),0);
 assert.throws(()=>commitRepositoryProjection(next.state,registry,request,ctx(next),p.state.sequence),/stale/);
 for(const key of ['id','stepId','targetId','projectionIdentity']){const forged=structuredClone(request);forged.request[key]='forged';assert.throws(()=>commitRepositoryProjection(p.state,registry,forged,ctx(p)));}
 const done=advance(reload(next),2);assert.equal(stock(done,Q.protectedKit),1);assert.equal(done.state.simulation.jobs.length,0);assert.equal(stock(done,Q.kit),7);
});
test('SOURCE repository exact 3 singles then pair remain manual proposals; current means lost rejects old suggestion',()=>{
 let p=courier();const old=view(p).actions.find(a=>a.projectionKind==='itinerary');delete p.gameplay.player.inventory[Q.pellet];assert.throws(()=>commitRepositoryProjection(p.state,registry,{projectionKind:'itinerary',request:old.request},ctx(p)));p.gameplay.player.inventory[Q.pellet]=8;
 for(let n=0;n<3;n++){const a=view(p).actions.find(a=>a.projectionKind==='itinerary');assert.equal(a.request.id,'repositories.seal_kit');p=commitRepositoryProjection(p.state,registry,{projectionKind:'itinerary',request:a.request},ctx(p));p=advance(p,2);assert.equal(p.state.simulation.jobs.length,0);}
 const a=view(p).actions.find(a=>a.projectionKind==='itinerary');assert.equal(a.request.id,'repositories.seal_pair');p=commitRepositoryProjection(p.state,registry,{projectionKind:'itinerary',request:a.request},ctx(p));p=advance(p,3);assert.equal(stock(p,Q.protectedKit),5);assert.equal(view(p).actions.find(a=>a.projectionKind==='itinerary').eligible,false);
});
test('SOURCE durable reserve staging publishes nothing on quota rejection; one retry preserves exact staged stock',()=>{
 const p=opened(),before=structuredClone(p),next=reserve(p);let calls=0,saved;const storage={setItem(_key,value){calls++;if(calls===1)throw Error('quota');saved=value;}};
 assert.throws(()=>persistExpansionPlan(next,{storage,key:'source',createSave:()=>JSON.stringify({character:{money:p.external.money},inventories:{person:{main_character:{}}},levels:{person:{main_character:{skill_xp:{}}}},expansion:p.state}),bindings:{player:{category:'person',id:'main_character'}}}),/quota/);assert.deepEqual(p,before);
 persistExpansionPlan(next,{storage,key:'source',createSave:()=>JSON.stringify({character:{money:p.external.money},inventories:{person:{main_character:{}}},levels:{person:{main_character:{skill_xp:{}}}},expansion:p.state}),bindings:{player:{category:'person',id:'main_character'}}});assert.equal(calls,2);assert(saved);assert.equal(stock(next,K.resin),2);assert.equal(cursor(next).stockAcceptedBatches,1);
});

test('SOURCE repository stock band is 1/2 one-job proposal bounded at six and useful protected-kit consumer spends actual output',()=>{
 let p=courier();const before=structuredClone(p),a=view(p).actions.find(a=>a.projectionKind==='stock');assert(a.eligible);assert.deepEqual(p,before);
 p=commitRepositoryProjection(p.state,registry,{projectionKind:'stock',request:a.request},ctx(p));p=advance(p,2);assert.equal(stock(p,Q.protectedKit),1);
 assert.equal(view(p).actions.some(a=>a.projectionKind==='stock'),false);assert.equal(p.state.simulation.jobs.length,0);
 p=repo(p,'repositories.inspect_pump');p=repo(p,'repositories.protected_work');assert.equal(stock(p,Q.protectedKit),0);p=advance(reload(p),4);
 assert.equal(p.state.simulation.situations['repositories.pump'].phase,'restored');assert.equal(p.state.actors.player.completed['repositories.protected_work'],1);
 const ceiling=courier();ceiling.state.actors.player.completed['repositories.seal_kit']=6;const band=view(ceiling).actions.find(a=>a.projectionKind==='stock');assert.equal(band.eligible,false);assert.match(view(ceiling).stock.text,/six-batch/);
});
test('SOURCE reserve attention/native activity and stamina loss pause without debit; restoring means needs explicit resume',()=>{
 for(const extra of [{busy:true},{facts:{location:'Shack'}}]){
 const p=opened();const before=structuredClone(p);assert.throws(()=>startAuditedKitReserve(p.state,registry,ctx(p,extra)));assert.deepEqual(p,before);}
 let p=opened();p.vitals.player.stamina=0;p=reserve(p);assert.equal(cursor(p).status,'paused');assert.equal(cursor(p).stockAcceptedBatches,0);
 p.vitals.player.stamina=100;p=advance(p,1);assert.equal(cursor(p).status,'paused');p=control(p,'resume');assert.equal(cursor(p).stockAcceptedBatches,1);
});

test('SOURCE actual mixed plan depletion and colleague attention pause; restoring stock never silently resumes',()=>{
 let p=base();p=beginSociety(p.state,registry,ctx(p));p=commitSocietyAction(p.state,registry,{type:'command',id:'feature_society.terms'},ctx(p));
 p=startWorkPlan(p.state,registry,registry.workPlans,'feature_society.household_itinerary',ctx(p));assert.equal(cursor(p).status,'paused');assert.equal(cursor(p).index,0);
 p.gameplay.player.inventory[S.wood]=6;p=advance(p,1);assert.equal(cursor(p).status,'paused');assert.equal(cursor(p).index,0);
 p=controlWorkPlan(p.state,registry,{action:'resume',cursorId:cursor(p).id},ctx(p));p.state.actors['feature_society.orr'].resources.attention=0;
 p=advance(p,14);assert.equal(cursor(p).status,'paused');assert.match(cursor(p).reason,/resident has not accepted/);assert.equal(p.state.simulation.jobs.some(j=>j.actorId==='feature_society.orr'),false);
});
