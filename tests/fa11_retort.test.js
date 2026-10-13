import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from '../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand as workshop} from '../src/reference_gameplay_host.js';
import {REFERENCE_GAMEPLAY_IDS as R} from '../src/reference_gameplay_content.js';
import {FACTORIO_RETORT_IDS as I,FACTORIO_RETORT_KEYS as K} from '../src/factorio_retort_content.js';
import {commitFactorioRetortCommand as commit,cancelFactorioRetortJob,startFactorioRetortPlan,controlFactorioRetortPlan,factorioRetortPresentation} from '../src/factorio_retort_host.js';
import {validateFactorioRetortNativeEnvelope} from '../src/factorio_retort_native.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {workPlanNextBoundary} from '../src/feature_expansion_work_plan.js';

// Controlled SOURCE fixtures only. Supplied body, stock, money, clock steps and envelopes do not establish native acquisition or import.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:p.equipment||{player:{}},
 facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'village.shackUnlocked':true,'campaign.anchor':true},nativeBody:body,nativeAlive:true,nativeReady:true,
 nativeCareFrame:{clock:p.state.clock,calendarMinute:600+p.state.clock,battleRunning:false},...extra});
const command=(p,id,extra={},sequence=p.state.sequence)=>commit(p.state,registry,{id},ctx(p,extra),sequence);
const advance=(p,n,extra={})=>{const c=ctx(p,extra),out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...out,vitals:out.vitals||c.vitals};};
const stock=(p,k)=>p.gameplay.player.inventory[k]||0;
const job=p=>p.state.simulation.jobs.find(j=>j.commandId.startsWith(I.prefix));
const cursor=p=>p.state.simulation.workPlans.cursors.player;
const reload=p=>({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const plan=p=>startFactorioRetortPlan(p.state,registry,ctx(p));
const control=(p,action,extra={})=>controlFactorioRetortPlan(p.state,registry,{action,cursorId:cursor(p).id,...extra},ctx(p));
const cancel=p=>cancelFactorioRetortJob(p.state,registry,job(p).id,ctx(p));
const envelope=p=>({character:{money:p.external.money},inventories:{person:{main_character:Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,count])=>[k,{count}]))}},expansion:structuredClone(p.state)});
function opened(){let p={state:initializeExpedition(createExpansionState(17)),external:{money:30},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=beginBodyRecord(p.state,registry,ctx(p));p.state.simulation.people.player.body=structuredClone(body);p=beginFeatureObjects(p.state,registry,ctx(p));
 p=commitFeatureObjectCommand(p.state,registry,{id:'feature_objects.inspect'},ctx(p));p=advance(p,2);p=enrollReferenceGameplay(p.state,ctx(p));p=workshop(p.state,registry,{id:R.open},ctx(p));
 p.gameplay.player.inventory={[K.log]:8,[K.sap]:3,[K.sound]:2};return p;}
const installed=()=>command(opened(),I.install);
const filled=()=>advance(command(installed(),I.batch),3);
const cleared=p=>command(command(p,I.collectResin),I.collectResidue);

test('SOURCE funded once-only install pays exact costs and creates two distinct receivers, no render replay',()=>{
 const p=opened(),eda=p.state.actors[I.teacher].resources.coins,out=command(p,I.install);assert.equal(out.external.money,p.external.money-2);assert.equal(stock(out,K.log),6);assert.equal(out.vitals.player.stamina,p.vitals.player.stamina-1);
 assert.equal(out.state.actors[I.teacher].resources.coins,eda+2);assert.equal(stock(out,K.resinEmpty),1);assert.equal(stock(out,K.residueEmpty),1);assert.equal(out.state.simulation.sites[I.site].owner,'player');assert.equal(out.state.simulation.sites[I.site].capacity,1);
 const before=structuredClone(out);factorioRetortPresentation(out.state,registry,ctx(out));assert.deepEqual(out,before);assert.throws(()=>command(out,I.install));assert.deepEqual(reload(out).state,out.state);assert(validateFactorioRetortNativeEnvelope(envelope(out)));
});
test('SOURCE real pending batch reserves only current inputs and both receivers; exact completion fills both once',()=>{
 const p=installed(),pending=command(p,I.batch);assert.equal(stock(pending,K.log),stock(p,K.log)-1);assert.equal(stock(pending,K.sap),2);assert.equal(stock(pending,K.resinEmpty),0);assert.equal(stock(pending,K.residueEmpty),0);assert.equal(stock(pending,K.resinFull),0);assert.equal(pending.vitals.player.stamina,p.vitals.player.stamina-1);assert.equal(job(pending).due-p.state.clock,3);
 assert(validateFactorioRetortNativeEnvelope(envelope(pending)));const done=advance(reload(pending),3);assert.equal(stock(done,K.resinFull),1);assert.equal(stock(done,K.residueFull),1);assert.equal(stock(done,K.resin),0);assert.equal(stock(done,K.sap),2);assert.equal(done.state.actors.player.completed[I.batch],1);assert(validateFactorioRetortNativeEnvelope(envelope(done)));assert.equal(stock(advance(done,3),K.resinFull),1);
});
test('SOURCE resin alone stalls next batch without spending; collected residue frees tray, loose disposal pays once',()=>{
 let p=filled();p=command(p,I.collectResin);assert.equal(stock(p,K.resin),1);assert.equal(stock(p,K.resinEmpty),1);assert.equal(stock(p,K.residueFull),1);const before=structuredClone(p);assert.throws(()=>command(p,I.batch));assert.deepEqual(p,before);assert(validateFactorioRetortNativeEnvelope(envelope(p)));
 p=command(p,I.collectResidue);assert.equal(stock(p,K.residueEmpty),1);assert.equal(stock(p,K.residue),1);assert.equal(stock(p,K.resin),1);const stamina=p.vitals.player.stamina,clock=p.state.clock,logs=stock(p,K.log);p=advance(command(p,I.disposeLoose),1);assert.equal(p.state.clock,clock+1);assert.equal(p.vitals.player.stamina,stamina-1);assert.equal(stock(p,K.residue),0);assert.equal(stock(p,K.log),logs);assert.equal(stock(p,K.resin),1);assert(validateFactorioRetortNativeEnvelope(envelope(p)));assert.throws(()=>command(p,I.disposeLoose));
});
test('SOURCE cold filled disposal separately pays effort/minute, preserves resin and returns only residue receiver',()=>{
 const p=filled(),pending=command(p,I.disposeFilled);assert.equal(stock(pending,K.residueFull),0);assert.equal(stock(pending,K.residueEmpty),0);assert.equal(stock(pending,K.resinFull),1);assert.equal(job(pending).due-p.state.clock,1);assert(validateFactorioRetortNativeEnvelope(envelope(pending)));
 const out=advance(reload(pending),1);assert.equal(out.vitals.player.stamina,p.vitals.player.stamina-1);assert.equal(stock(out,K.residueEmpty),1);assert.equal(stock(out,K.residue),0);assert.equal(stock(out,K.resinFull),1);assert.equal(stock(out,K.log),stock(p,K.log));assert(validateFactorioRetortNativeEnvelope(envelope(out)));
});
test('SOURCE cancel batch and both disposal jobs refunds stock/effort once without receipts',()=>{
 for(const [p,id] of [[installed(),I.batch],[filled(),I.disposeFilled],[command(filled(),I.collectResidue),I.disposeLoose]]){const out=cancel(reload(command(p,id)));assert.deepEqual(out.gameplay,p.gameplay);assert.deepEqual(out.external,p.external);assert.deepEqual(out.vitals,p.vitals);assert.deepEqual(out.state.actors.player.completed,p.state.actors.player.completed);assert.equal(out.state.simulation.jobs.length,0);assert.throws(()=>cancel(out));assert(validateFactorioRetortNativeEnvelope(envelope(out)));}
});
test('SOURCE common scheduler completion support loss refunds unchanged fuel, material, receivers and effort',()=>{
 for(const extra of [{facts:{location:'Shack'}},{nativeAlive:false}]){const p=installed(),out=advance(command(p,I.batch),3,extra);assert.deepEqual(out.gameplay,p.gameplay);assert.equal(out.state.actors.player.completed[I.batch],undefined);assert.equal(out.native.staminaToFull,100-p.vitals.player.stamina);assert(validateFactorioRetortNativeEnvelope(envelope(out)));}
 for(const alter of [p=>{p.state.simulation.people.player.body.hands=0;},p=>{p.vitals.player.health=1;}]){const p=installed(),pending=command(p,I.batch);alter(pending);const out=advance(pending,3);assert.deepEqual(out.gameplay,p.gameplay);assert.equal(out.state.actors.player.completed[I.batch],undefined);assert.equal(out.native.staminaToFull,100-p.vitals.player.stamina);}
});
test('SOURCE finite three-batch plan pauses for separate receiver clearing and explicit resume, never reserves future stock',()=>{
 let p=plan(installed());assert.equal(cursor(p).steps.length,3);assert.equal(stock(p,K.sap),2);assert.equal(p.state.simulation.jobs.length,1);p=advance(reload(p),3);assert.equal(cursor(p).status,'paused');assert.equal(cursor(p).index,1);assert.equal(p.state.simulation.jobs.length,0);assert.equal(stock(p,K.sap),2);assert.equal(workPlanNextBoundary(p.state),Infinity);
 p=cleared(p);p=advance(p,1);assert.equal(cursor(p).status,'paused');assert.equal(stock(p,K.sap),2);p=control(p,'resume');assert.equal(stock(p,K.sap),1);p=advance(p,3);assert.equal(cursor(p).status,'paused');p=control(cleared(p),'resume');p=advance(p,3);assert.equal(cursor(p).status,'complete');assert.equal(cursor(p).index,3);assert.equal(stock(p,K.sap),0);assert.equal(p.state.actors.player.completed[I.batch],3);assert(validateFactorioRetortNativeEnvelope(envelope(p)));
});
test('SOURCE depleted inputs pause before debit and restoring means cannot silently restart; forged resume rejects',()=>{
 let p=installed();delete p.gameplay.player.inventory[K.sap];p=plan(p);assert.equal(cursor(p).status,'paused');assert.equal(cursor(p).index,0);assert.equal(stock(p,K.log),6);assert.equal(stock(p,K.resinEmpty),1);p.gameplay.player.inventory[K.sap]=1;p=advance(p,1);assert.equal(cursor(p).status,'paused');assert.equal(p.state.simulation.jobs.length,0);
 assert.throws(()=>controlFactorioRetortPlan(p.state,registry,{action:'resume',cursorId:'forged'},ctx(p)));p=control(p,'resume');p=advance(p,3);p=cleared(p);p=control(p,'resume');assert.equal(cursor(p).status,'paused');assert.equal(cursor(p).index,1);assert.equal(stock(p,K.resinEmpty),1);
});
test('SOURCE future plan cancel preserves current paid batch; explicit current cancel refunds once',()=>{
 const p=plan(installed());let future=control(p,'cancel');assert.equal(cursor(future).status,'cancelled');assert.equal(future.state.simulation.jobs.length,1);future=advance(reload(future),3);assert.equal(stock(future,K.resinFull),1);assert.equal(future.state.actors.player.completed[I.batch],1);
 const current=control(p,'cancel',{cancelCurrent:true});assert.equal(current.state.simulation.jobs.length,0);assert.equal(stock(current,K.sap),3);assert.equal(stock(current,K.resinEmpty),1);assert.equal(stock(current,K.residueEmpty),1);assert.equal(stock(advance(current,6),K.resinFull),0);
});
test('SOURCE admission rejects borrowed/equipped/missing receiver, foreign owner/body and stale sequence',()=>{
 for(const alter of [p=>{delete p.gameplay.player.inventory[K.resinEmpty];},p=>{p.state.simulation.custody.loan={holder:'player',owner:I.teacher,key:K.resinEmpty,count:1};},p=>{p.equipment={player:{hand:K.residueEmpty}};},p=>{p.state.actors.player.worldId='foreign';},p=>{p.state.simulation.people.player.body.ownerId='foreign';},p=>{p.state.simulation.people.player.body.hands=0;}]){const p=installed();alter(p);assert.throws(()=>command(p,I.batch));}
 const p=installed(),pending=command(p,I.batch);assert.throws(()=>command(pending,I.batch,{},p.state.sequence),/stale/);
});
test('SOURCE exact full envelope conserves stored trays and rejects duplicate, forged, custody/equipment and frozen job corruption',()=>{
 const p=installed(),saved=envelope(p);saved.inventories.storage={player:{[K.resinEmpty]:{count:1}}};delete saved.inventories.person.main_character[K.resinEmpty];assert(validateFactorioRetortNativeEnvelope(saved));
 for(const alter of [e=>{e.inventories.person.main_character[K.resinEmpty]={count:2};},e=>{e.character.equipment={hand:K.resinEmpty};},e=>{e.expansion.simulation.custody.loan={key:K.resinEmpty};},e=>{e.inventories.person.main_character[JSON.stringify({id:'Empty retort resin tray',quality:2})]={count:1};},e=>{e.character.inventory={[K.resinEmpty]:{count:2}};}]){const bad=envelope(p);alter(bad);assert.throws(()=>validateFactorioRetortNativeEnvelope(bad));}
 const pending=command(p,I.batch);for(const alter of [j=>{j.due++;},j=>{j.costs[0].amount=-2;},j=>{j.effects.shift();},j=>{j.context.facts={};},j=>{j.participants.push('foreign');},j=>{j.reservationReturns=0;}]){const bad=structuredClone(pending);alter(job(bad));assert.throws(()=>reload(bad));}
});
test('SOURCE old absence inert and exact optional pending retains WorkPlans 1/2 compatibility',()=>{
 const absent=initializeExpedition(createExpansionState(17)),before=structuredClone(absent);assert(validateFactorioRetortNativeEnvelope({expansion:absent}));assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(absent)),registry),absent);assert.deepEqual(absent,before);
 const p=plan(installed());assert.equal(p.state.simulation.workPlans.schema,1);for(const schema of [1,2]){const copy=structuredClone(p);copy.state.simulation.workPlans.schema=schema;assert.deepEqual(reload(copy).state,copy.state);assert(validateFactorioRetortNativeEnvelope(envelope(copy)));}
});
test('SOURCE earned resin current consumer reserves one resin/two staves then yields two kit keys once',()=>{
 let p=cleared(filled());const before=structuredClone(p);p=workshop(p.state,registry,{id:'reference_gameplay.resin_kits'},ctx(p));assert.equal(stock(p,K.resin),0);assert.equal(stock(p,K.sound),0);assert.equal(p.vitals.player.stamina,before.vitals.player.stamina-1);p=advance(reload(p),3);assert.equal(stock(p,K.kit),2);assert.equal(stock(advance(p,3),K.kit),2);assert(validateFactorioRetortNativeEnvelope(envelope(p)));
});
test('SOURCE durable quota failure leaves live pending untouched; explicit retry persists exact completed receipts',()=>{
 const pending=command(installed(),I.batch),before=structuredClone(pending),done=advance(pending,3);let calls=0,saved;const storage={setItem(_k,v){calls++;if(calls===1)throw Error('quota');saved=v;}};
 const options={storage,key:'source',createSave:()=>JSON.stringify({...envelope(pending),levels:{person:{main_character:{skill_xp:{}}}}}),bindings:{player:{category:'person',id:'main_character'}},validateEnvelope:validateFactorioRetortNativeEnvelope};
 assert.throws(()=>persistExpansionPlan(done,options),/quota/);assert.deepEqual(pending,before);persistExpansionPlan(done,options);assert.equal(calls,2);assert(validateFactorioRetortNativeEnvelope(JSON.parse(saved)));assert.equal(JSON.parse(saved).inventories.person.main_character[K.resinFull].count,1);assert.deepEqual(loadExpansionState(JSON.parse(saved).expansion,registry),done.state);
});
