// R15 rerun of the R8 source probe, bound to this worktree.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,loadExpansionState,advanceSimulation} from '../../../../../../../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../../../../../../../src/expedition_content.js';
import {beginBodyRecord} from '../../../../../../../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from '../../../../../../../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../../../../../../../src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand as workshop} from '../../../../../../../src/reference_gameplay_host.js';
import {REFERENCE_GAMEPLAY_IDS as R} from '../../../../../../../src/reference_gameplay_content.js';
import {FACTORIO_RETORT_IDS as I,FACTORIO_RETORT_KEYS as K} from '../../../../../../../src/factorio_retort_content.js';
import {commitFactorioRetortCommand as commit,cancelFactorioRetortJob,startFactorioRetortPlan,controlFactorioRetortPlan,factorioRetortPresentation} from '../../../../../../../src/factorio_retort_host.js';
import {validateFactorioRetortNativeEnvelope} from '../../../../../../../src/factorio_retort_native.js';
import {persistExpansionPlan} from '../../../../../../../src/expansion_persistence.js';
import {workPlanNextBoundary} from '../../../../../../../src/feature_expansion_work_plan.js';

// Controlled SOURCE fixtures only. Supplied body, stock, money, clock steps and envelopes do not establish native acquisition or import.
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},equipment:p.equipment||{player:{}},
 facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'village.shackUnlocked':true,'campaign.anchor':true},nativeBody:body,nativeAlive:true,nativeReady:true,
 nativeCareFrame:{clock:p.state.clock,calendarMinute:600+p.state.clock,battleRunning:false},...extra});
const command=(p,id,extra={},sequence=p.state.sequence)=>commit(p.state,registry,{id},ctx(p,extra),sequence);
const advance=(p,n,extra={})=>{
 const c=ctx(p,extra),out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});
 // advanceSimulation publishes native offsets rather than a returned vital map.
 // Apply those offsets just as the browser does before checking a later refund.
 const vitals=structuredClone(out.vitals||c.vitals);
 for(const [key,offset] of [['health','hpToFull'],['stamina','staminaToFull']])
  if(out.native?.[offset]!=null)vitals.player[key]=vitals.player['max_'+key]-out.native[offset];
 return {...out,vitals};
};
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



import {NETHACK_FIELDCRAFT_IDS as N,NETHACK_FIELDCRAFT_KEYS as NK} from '../../../../../../../src/nethack_fieldcraft_content.js';
import {commitNethackFieldcraftCommand as field,nethackFieldcraftPresentation as fieldView} from '../../../../../../../src/nethack_fieldcraft_host.js';
import {GAME_ABSORPTION_ASSAY_IDS as A,GAME_ABSORPTION_ASSAY_KEYS as AK} from '../../../../../../../src/game_absorption_assay_content.js';
import {commitGameAbsorptionAssayCommand as assay,cancelGameAbsorptionAssayJob as assayCancel,gameAbsorptionAssayPresentation as assayView} from '../../../../../../../src/game_absorption_assay_host.js';
import {fieldcraftFeatEvidence} from '../../../../../../../src/nethack_fieldcraft_feats.js';
const F=(p,id,extra={},seq=p.state.sequence)=>field(p.state,registry,{id},ctx(p,extra),seq);
const Ado=(p,id,extra={},seq=p.state.sequence)=>assay(p.state,registry,{id},ctx(p,extra),seq);
const base=()=>{let p=opened();p.gameplay.player.inventory={[NK.dull]:2,[NK.resin]:1,[NK.sound]:1};return p;};
const meet=()=>Ado(F(base(),N.open),A.open);
const buy=(p,kind)=>Ado(p,A.prefix+'buy_'+kind);
const negative=()=>advance(Ado(buy(meet(),'full'),A.prefix+'trial_dull'),2);
const oilControl=p=>advance(F(F(p,'nethack_fieldcraft.buy_vial'),'nethack_fieldcraft.trial_dull'),3);
const known=()=>advance(Ado(oilControl(negative()),A.compare),1);
const k=(p,key)=>p.state.simulation.knowledge.player[key];
const results=[];const check=(name,f)=>{f();results.push({name,status:'PASS',evidenceClass:'SOURCE'});};
check('Absent optional load/render inert; explicit meeting finite NPC stock only',()=>{const p=base(),before=structuredClone(p);fieldView(p.state,registry,ctx(p));assayView(p.state,registry,ctx(p));reload(p);assert.deepEqual(p,before);assert(!p.state.referenceGameplay.fieldcraft);const out=meet();assert.equal(stock(out,NK.vial),0);assert.equal(out.state.simulation.owners[N.eda][NK.vial],3);assert.equal(out.state.simulation.owners[N.eda][AK.full],2);assert.throws(()=>F(out,N.open));});
check('Finite actual purchase debits purse and seller, without identity',()=>{let p=meet(),coins=p.state.actors[N.eda].resources.coins,m=p.external.money;for(let i=0;i<2;i++)p=buy(p,'full');assert.equal(p.external.money,m-4);assert.equal(p.state.actors[N.eda].resources.coins,coins+4);assert.equal(stock(p,AK.full),2);assert(!k(p,A.identity));assert.throws(()=>buy(p,'full'));const before=structuredClone(p);assayView(p.state,registry,ctx(p));assert.deepEqual(p,before);});
check('Paid negative spends charge and stamina, returns exact dull tool/container; no identity',()=>{const p=negative();assert.equal(stock(p,AK.full),0);assert.equal(stock(p,NK.empty),1);assert.equal(stock(p,NK.dull),2);assert(!k(p,A.identity));assert.equal(k(p,A.prefix+'negative').basis.kind,'observation');assert.throws(()=>Ado(p,A.compare));assert.throws(()=>Ado(p,A.prefix+'trial_dull'));});
check('Separate real control then comparison retains frozen provenance and inference',()=>{const p=oilControl(negative()),before=structuredClone(k(p,N.oil));assert.equal(stock(p,NK.sharp),1);assert.equal(stock(p,NK.dull),1);assert.equal(stock(p,NK.empty),2);const pending=Ado(p,A.compare);assert.equal(pending.state.simulation.jobs[0].commandId,A.compare);const out=advance(reload(pending),1);assert.equal(k(out,A.identity).basis.kind,'inference');assert.deepEqual(JSON.parse(k(out,A.prefix+'control').value),{id:N.oil,...before});assert.equal(stock(out,NK.empty),2);assert.throws(()=>Ado(out,A.compare));assert.deepEqual(reload(out).state,out.state);});
check('Distinct washing observation consumes actual pin/charge and yields existing useful kit',()=>{let p=known();p=buy(buy(p,'full'),'dirty');p=advance(Ado(p,A.rinse),2);assert.equal(stock(p,AK.full),0);assert.equal(stock(p,AK.dirty),0);assert.equal(stock(p,NK.empty),3);assert.equal(stock(p,NK.pin),1);assert.equal(k(p,A.identity).basis.kind,'observation');p=advance(F(p,'nethack_fieldcraft.pin_kit'),3);assert.equal(stock(p,NK.kit),1);assert.equal(stock(p,NK.pin),0);assert.equal(stock(p,NK.resin),0);});
check('Ordinary scrape needs no vial or identity and returns unchanged tool',()=>{let p=buy(meet(),'dirty');p=advance(Ado(p,A.prefix+'scrape_dull'),5);assert.equal(stock(p,NK.pin),1);assert.equal(stock(p,NK.dull),2);assert.equal(stock(p,NK.empty),0);assert(!k(p,A.identity));});
check('Custody/equipment/body/site gates; cancel refunds exact paid inputs no discovery',()=>{const p=buy(meet(),'full');assert.throws(()=>Ado(p,A.prefix+'trial_dull',{equipment:{player:{hand:NK.dull}}}));let q=structuredClone(p);q.state.simulation.people.player.body.hands=0;assert.throws(()=>Ado(q,A.prefix+'trial_dull'));q=structuredClone(p);q.state.simulation.custody.loan={holder:'player',owner:N.eda,key:NK.dull,count:1};assert.throws(()=>Ado(q,A.prefix+'trial_dull'));q=structuredClone(p);q.state.simulation.sites[N.site].owner='player';assert.throws(()=>Ado(q,A.prefix+'trial_dull'));const accepted=Ado(p,A.prefix+'trial_dull'),out=assayCancel(accepted.state,registry,accepted.state.simulation.jobs[0].id,ctx(accepted));assert.equal(stock(out,NK.dull),2);assert.equal(stock(out,AK.full),1);assert(!k(out,A.prefix+'negative'));assert.throws(()=>Ado(p,A.prefix+'trial_dull',{},p.state.sequence-1),/stale/);});
check('Two actual lessons, care, live scent and finite dog/manual pin transfers',()=>{let p=F(base(),N.open);assert.throws(()=>F(p,N.train));p=F(F(p,'nethack_fieldcraft.buy_ration'),'nethack_fieldcraft.feed');for(let i=0;i<2;i++)p=advance(F(p,N.train),2);assert.equal(p.state.actors[N.dog].resources.lessons,2);assert.throws(()=>F(p,N.train));p=oilControl(p);p=F(F(p,'nethack_fieldcraft.buy_vial'),'nethack_fieldcraft.scent');p=F(F(p,'nethack_fieldcraft.buy_ration'),'nethack_fieldcraft.feed');p=advance(F(p,'nethack_fieldcraft.recover_dog'),1);p=advance(F(p,'nethack_fieldcraft.recover_manual'),4);assert.equal(stock(p,NK.pin),2);assert.equal(p.state.simulation.owners[N.eda][NK.pin]||0,0);assert.throws(()=>F(p,'nethack_fieldcraft.recover_manual'));assert.equal(p.state.simulation.people[N.dog].location,'Village');});
check('Feat attributed distinct committed discovery; no render/reload replay or conduct enrollment',()=>{const p=F(F(meet(),'nethack_fieldcraft.buy_vial'),'nethack_fieldcraft.trial_dull'),out=advance(p,3);out.state.sequence++;const e=fieldcraftFeatEvidence(p.state,out,ctx(p));assert(e.some(e=>e.id==='bench_liquid_discovery'));assert.deepEqual(fieldcraftFeatEvidence(out.state,reload(out),ctx(out)),[]);assert.deepEqual(out.state.referenceGameplay.conduct,p.state.referenceGameplay.conduct);});
check('Forged pending effects rejected and failed durable publisher leaves original untouched',()=>{const pending=Ado(buy(meet(),'full'),A.prefix+'trial_dull'),before=structuredClone(pending);const forged=structuredClone(pending);forged.state.simulation.jobs[0].effects.push({type:'item',actor:'player',key:NK.pin,amount:1});assert.throws(()=>reload(forged));assert.throws(()=>persistExpansionPlan(pending,{createSave:()=>JSON.stringify({...envelope(pending),levels:{person:{main_character:{skill_xp:{}}}}}),storage:{setItem(){throw Error('source quota failure');}},key:'source',bindings:{player:{category:'person',id:'main_character'}}}),/source quota failure/);assert.deepEqual(pending,before);});
check('Lost body/location support returns the exact assay reservation and stamina without knowledge',()=>{
 for(const kind of ['location','health']) {
  const p=buy(meet(),'full'),pending=Ado(p,A.prefix+'trial_dull');
  const extra=kind==='location'?{facts:{location:'Shack'}}:{vitals:{player:{...pending.vitals.player,health:1}}};
  const out=advance(pending,2,extra);
  assert.deepEqual(out.gameplay,p.gameplay);assert.deepEqual(out.external,p.external);
  assert.equal(out.vitals.player.stamina,p.vitals.player.stamina);
  assert.equal(out.state.simulation.jobs.length,0);assert(!k(out,A.prefix+'negative'));
  assert.equal(out.state.actors.player.completed[A.prefix+'trial_dull'],undefined);
 }
});
check('Clouded negative trial debits actual player vital and native save offset exactly once',()=>{
 const p=buy(meet(),'full'),pending=Ado(p,A.prefix+'trial_dull');
 assert.equal(pending.vitals.player.stamina,p.vitals.player.stamina-1);
 assert.equal(pending.native.staminaToFull,p.vitals.player.max_stamina-p.vitals.player.stamina+1);
 const out=advance(pending,2);
 assert.equal(out.vitals.player.stamina,pending.vitals.player.stamina);
 assert.equal(out.state.actors.player.completed[A.prefix+'trial_dull'],1);
});
check('Lost dog willingness refunds reserved care and pins without retrieval or a feat',()=>{
 let p=F(base(),N.open);p=F(F(p,'nethack_fieldcraft.buy_ration'),'nethack_fieldcraft.feed');
 for(let i=0;i<2;i++)p=advance(F(p,N.train),2);
 p=oilControl(p);p=F(F(p,'nethack_fieldcraft.buy_vial'),'nethack_fieldcraft.scent');
 p=F(F(p,'nethack_fieldcraft.buy_ration'),'nethack_fieldcraft.feed');
 const pending=F(p,N.recoverDog);pending.state.actors[N.dog].facts['nethack_fieldcraft.willing']=false;
 const out=advance(pending,1);
 assert.deepEqual(out.gameplay,p.gameplay);assert.deepEqual(out.external,p.external);
 assert.equal(out.vitals.player.stamina,p.vitals.player.stamina);
 assert.equal(out.state.actors[N.dog].resources.satiety,p.state.actors[N.dog].resources.satiety);
 assert.equal(out.state.simulation.people[N.dog].vitals.stamina,p.state.simulation.people[N.dog].vitals.stamina);
 assert.equal(out.state.simulation.owners[N.eda][NK.pin],p.state.simulation.owners[N.eda][NK.pin]);
 assert.equal(out.state.actors.player.completed[N.recoverDog],undefined);
 assert.deepEqual(fieldcraftFeatEvidence(p.state,out,ctx(p)),[]);
});
console.log(JSON.stringify({fixture:'Controlled SOURCE only. Supplied means and advanced time are not native gameplay.',results},null,2));
