import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/expedition_content.js';
import {beginBodyRecord} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand as workshop} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/reference_gameplay_host.js';
import {REFERENCE_GAMEPLAY_IDS as R} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/reference_gameplay_content.js';
import {FACTORIO_RETORT_IDS as I,FACTORIO_RETORT_KEYS as K} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/factorio_retort_content.js';
import {commitFactorioRetortCommand as commit,cancelFactorioRetortJob,startFactorioRetortPlan,controlFactorioRetortPlan,factorioRetortPresentation} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/factorio_retort_host.js';
import {validateFactorioRetortNativeEnvelope} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/factorio_retort_native.js';
import {persistExpansionPlan} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/expansion_persistence.js';
import {workPlanNextBoundary} from 'file:///Users/weiwei/code/yet-another-idle-rpg/src/feature_expansion_work_plan.js';

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


const results=[];
const view=p=>factorioRetortPresentation(p.state,registry,ctx(p)).sections[0];
const row=(p,id)=>view(p).actions.find(a=>a.id===id);
const check=(name,f)=>{f();results.push({name,status:'PASS',evidenceClass:'SOURCE'});};
check('Residue blocker is distinguishable by live receiver counts; rendering is read-only',()=>{const p=command(filled(),I.collectResin),before=structuredClone(p),v=view(p);assert.equal(row(p,I.batch).eligible,false);assert.match(v.records[0].text,/Residue receiver: 0 empty \/ 1 filled/);assert.match(v.records[2].text,/Clearing resin alone leaves/);assert.deepEqual(p,before);});
check('Two actual legal choices disclose immediate collection versus paid one-minute disposal',()=>{const p=command(filled(),I.collectResin),a=row(p,I.collectResidue),b=row(p,I.disposeFilled);assert(a.eligible&&b.eligible);assert.equal(a.legibility.duration.minutes,0);assert.equal(b.legibility.duration.minutes,1);assert.equal(a.legibility.costs.length,1);assert.match(b.legibility.costs.map(c=>c.text).join(' '),/1 stamina/);assert.match(a.label,/keep its empty receiver/);const out=command(p,I.collectResidue);assert.equal(stock(out,K.residue),1);assert.equal(stock(out,K.residueEmpty),1);const disposed=advance(command(p,I.disposeFilled),1);assert.equal(stock(disposed,K.residue),0);assert.equal(stock(disposed,K.residueEmpty),1);});
check('Supported collection recomputes live controls without presentation mutation',()=>{const p=command(filled(),I.collectResin),old=row(p,I.collectResidue),out=command(p,I.collectResidue),before=structuredClone(out);assert.equal(row(out,I.batch).eligible,true);assert.equal(row(out,I.collectResidue),undefined);assert.equal(row(out,I.disposeFilled),undefined);assert.deepEqual(out,before);assert.throws(()=>command(out,old.command.id,{},p.state.sequence),/stale/);});
check('Pending current reservation differs from unreserved future-plan inputs',()=>{const p=plan(installed()),v=view(p),before=structuredClone(p);assert.match(v.work,/3 played minutes remaining/);assert.match(v.work,/1 Tree sap/);assert.match(v.records[0].text,/resin receiver: 0 empty \/ 0 filled/);assert.equal(stock(p,K.sap),2);assert.equal(p.state.simulation.jobs.length,1);assert.match(row(p,I.batch).description,/Reserve only this batch/);assert.match(v.actions.find(a=>a.id==='factorio_retort.plan_cancel').label,/accepted work keeps its terms/);assert.deepEqual(p,before);});
check('Unusable custody and equipment are excluded from explicit available receiver counts',()=>{for(const kind of ['custody','equipped']){const p=installed();if(kind==='custody')p.state.simulation.custody.loan={holder:'player',owner:I.teacher,key:K.residueEmpty,count:1};else p.equipment={player:{hand:K.residueEmpty}};const before=structuredClone(p);assert.equal(row(p,I.batch).eligible,false);assert.match(view(p).records[0].text,/Residue receiver: 0 empty \/ 0 filled/);assert.deepEqual(p,before);}});
check('Depleted sap blocks current batch and refreshed stock changes eligibility',()=>{const p=installed();p.gameplay.player.inventory[K.sap]=0;const before=structuredClone(p);assert.equal(row(p,I.batch).eligible,false);assert.match(view(p).records[1].text,/0 sap/);assert.match(row(p,I.batch).legibility.costs[0].text,/You have 0 available/);assert.deepEqual(p,before);p.gameplay.player.inventory[K.sap]=1;assert.equal(row(p,I.batch).eligible,true);});
console.log(JSON.stringify({fixture:'Controlled SOURCE only; fixture material/state changes are not native acquisition',results},null,2));
