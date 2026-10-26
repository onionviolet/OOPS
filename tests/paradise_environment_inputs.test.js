import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as r} from '../src/expedition_content.js';
import {commitParadiseCommand} from '../src/book_world_paradise_host.js';
import {commitParadiseCampaignDepthCommand as commit,paradiseCampaignDepthPresentation} from '../src/book_world_paradise_campaign_host.js';
import {paradiseCampaignContext,validateParadiseCampaignDepthState} from '../src/book_world_paradise_campaign_facts.js';
import {PARADISE_IDS as P,PARADISE_LOCATIONS as L,PARADISE_KEYS as K,PARADISE_FOOTPRINTS} from '../src/book_world_paradise_ids.js';
import {createWorldVisit,planWorldDeparture} from '../src/world_instances.js';
import {PARADISE_DRYING as D,readDryingKey,settleParadiseDrying,validateParadiseDryingState} from '../src/book_world_paradise_drying.js';
import {PARADISE_ENVIRONMENT as E,readPreparationWater,preparationWaterAssessment} from '../src/book_world_paradise_environment_inputs.js';
import {readMaterialLineage} from '../src/material_lineage.js';
const F='book.paradise.campaign.',body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
function ctx(p){return {actorId:'player',worldId:p.state.actors.player.worldId,external:p.external,gameplay:p.gameplay,vitals:p.vitals,vitalsByActor:p.vitals,equipment:Object.fromEntries(Object.keys(p.gameplay).map(id=>[id,{}])),nativeAlive:true,nativeReady:true,busy:false,paradiseNative:{bound:true,revision:p.state.bookWorldCampaign?.nativeRevision||0,body},facts:{location:p.state.simulation?.people.player.location||'Village','village.elderMet':true,calendarMinute:1440*360000+480}};}
const act=(p,name)=>commit(p.state,r,{type:'book_paradise_campaign',id:F+name},ctx(p));
const dry=(p,operation,args={})=>commit(p.state,r,{type:'book_paradise_campaign',action:'drying',operation,...args},ctx(p));
function tick(p,n){const c=paradiseCampaignContext(p.state,ctx(p)),out=advanceSimulation(p.state,r,n,p.external,p.gameplay,Object.fromEntries(Object.keys(p.state.simulation.people).map(id=>[id,{...c,actorId:id,vitals:p.vitals[id]||{health:100,max_health:100,stamina:100,max_stamina:100}}])));out.vitals=structuredClone(p.vitals);if(out.native?.staminaToFull!=null)out.vitals.player.stamina=out.vitals.player.max_stamina-out.native.staminaToFull;return out;}
function setup(){
 const state=initializeExpedition(createExpansionState(317));state.actors.player.facts['village.discovered']=true;state.campaign.facts.anchor=true;
 let p={state,external:{money:30},gameplay:{player:{inventory:{[K.log]:20,[K.rope]:10,[K.kit]:3,[D.coal]:3,[JSON.stringify({id:'Linen cloth'})]:5},skills:{},reputation:{}}},vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}}};
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.chart'},ctx(p));p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.enroll'},ctx(p));
 p.state.bookWorldCampaign.nativeRevision=1;const f=PARADISE_FOOTPRINTS[0],instance=p.state.bookWorldCampaign.instances[0],visit=createWorldVisit(instance,{id:'book.paradise.visit.drying_fixture',actorId:'player',endpoint:f.endpoint,playedAt:p.state.clock},f.definition,{actorIds:Object.keys(p.state.actors),visits:[]});
 p.state.bookWorldCampaign.visits=[visit];p.state.bookWorldCampaign.activeVisitId=visit.id;p.state.actors.player.worldId=P.hub;p.state.simulation.people.player.location=L.hub;p.state.actors.player.resources['book.paradise.coin']=20;
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.hub_meet'},ctx(p));p=act(p,'hub.begin');p=tick(act(p,'hub.bench'),5);p=tick(act(p,'hub.drying_rack'),3);p=tick(act(p,'hub.drying_cut'),4);return p;
}

const water=p=>Object.keys(p.gameplay.player.inventory).filter(k=>readPreparationWater(k));
const choose=(p,kind)=>water(p).find(k=>readPreparationWater(k).kind===kind);
const env=(p,operation,inputKey)=>commit(p.state,r,{type:'book_paradise_campaign',id:E.prefix+operation,...(inputKey?{inputKey}:{})},ctx(p));
const buy=p=>tick(env(p,'buy'),2);
const dryStock=p=>p.state.simulation.owners[D.rack];

test('finite paid water source reserves exact price, survives pending reload and cannot duplicate the offer',()=>{
 let p=setup(),start=structuredClone(p),credits=p.state.actors.player.resources['book.paradise.coin'];
 p=env(p,'buy');assert.equal(p.state.actors.player.resources['book.paradise.coin'],credits-3);assert.equal(water(p).length,0);
 p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),r)};validateParadiseCampaignDepthState(p.state,r);
 const pending=structuredClone(p);p=commit(p.state,r,{type:'book_paradise_campaign',action:'cancel',id:p.state.simulation.jobs.find(j=>j.actorId==='player').id},ctx(p));assert.deepEqual(p.gameplay.player.inventory,start.gameplay.player.inventory);assert.equal(p.state.actors.player.resources['book.paradise.coin'],credits);
 p=tick(pending,2);assert.equal(water(p).reduce((n,k)=>n+p.gameplay.player.inventory[k],0),5);assert.equal(p.state.actors.player.resources['book.paradise.coin'],credits-3);
 const before=JSON.stringify(p);assert.throws(()=>env(p,'buy'));assert.equal(JSON.stringify(p),before);
 const forged=structuredClone(pending.state);forged.simulation.jobs.find(j=>j.actorId==='player').effects.at(-1).amount++;assert.throws(()=>loadExpansionState(forged,r),/reserved work|preparation|authored/);
});
test('filtering conserves water and suspended grit, leaves dissolved salt/contamination and spends real cloth/time',()=>{
 let p=buy(setup()),cloud=choose(p,'cloudy'),brack=choose(p,'brackish'),before=JSON.stringify(p);
 assert.equal(preparationWaterAssessment(cloud).usable,false);assert.throws(()=>env(p,'soften',cloud),/grit/);assert.equal(JSON.stringify(p),before);
 const cloth=p.gameplay.player.inventory[E.cloth];p=env(p,'filter',cloud);p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),r)};p=tick(p,2);
 assert.equal(p.gameplay.player.inventory[E.cloth],cloth-1);const filtered=choose(p,'filteredCloudy'),cake=choose(p,'cake');assert.equal(preparationWaterAssessment(filtered).usable,true);
 assert.equal(readPreparationWater(filtered).batch.volume+readPreparationWater(cake).batch.volume,1);assert.equal(readPreparationWater(cake).batch.constituents[0].amount,40);assert.equal(p.gameplay.player.inventory[cloud],1);
 p=tick(env(p,'filter',brack),2);assert.ok(choose(p,'emptyCake'));const salty=choose(p,'filteredBrackish'),a=preparationWaterAssessment(salty);assert.equal(a.amounts.salt,30);assert.equal(a.amounts.contaminant,5);assert.equal(a.usable,false);before=JSON.stringify(p);assert.throws(()=>env(p,'soften',salty),/Dissolved/);assert.equal(JSON.stringify(p),before);
});
test('useful damp preparation keeps exact wood/water/tool receipt through partial carry, drying, kit and paid commission',()=>{
 let p=buy(setup()),clear=choose(p,'clear'),inv=structuredClone(p.gameplay.player.inventory),stamina=p.vitals.player.stamina;
 p=env(p,'soften',clear);const j=p.state.simulation.jobs.find(j=>j.actorId==='player');assert.equal(j.due-p.state.clock,4);assert.equal(j.costs.find(c=>c.type==='vital').amount,-1);
 const reserved=structuredClone(p);p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),r)};p=commit(p.state,r,{type:'book_paradise_campaign',action:'cancel',id:j.id},ctx(p));assert.deepEqual(p.gameplay.player.inventory,inv);
 p=tick(reserved,4);const prepared=Object.keys(p.gameplay.player.inventory).find(k=>readDryingKey(k)?.provenanceKey);assert.ok(prepared);assert.equal(p.gameplay.player.inventory[prepared],2);assert.equal(p.gameplay.player.inventory[K.log],inv[K.log]-1);assert.equal(p.gameplay.player.inventory[K.kit],inv[K.kit]);assert.equal(p.gameplay.player.inventory[clear],inv[clear]-1);
 const source=readDryingKey(prepared).provenanceKey,receipt=readMaterialLineage(source).history.at(-1);assert.deepEqual(receipt.inputs.map(i=>[i.item_key,i.count,i.role||'primary',i.disposition||'consumed']),[[K.log,1,'primary','consumed'],[clear,1,'support','consumed'],[K.kit,1,'support','retained']]);
 p=dry(p,'load',{key:prepared});p=tick(p,4);let key=Object.keys(dryStock(p))[0];p=dry(p,'take',{key});const partial=Object.keys(p.gameplay.player.inventory).find(k=>readDryingKey(k)?.provenanceKey===source&&k!==prepared);assert.equal(readDryingKey(partial).moisture,5000);p=dry(p,'load',{key:partial});p=dry(p,'load',{key:prepared});
 p=tick(p,24);for(const k of Object.keys(dryStock(p)))assert.equal(readDryingKey(k).provenanceKey,source);
 for(const k of Object.keys(dryStock(p)))for(let n=dryStock(p)[k];n>0;n--)p=dry(p,'take',{key:k});
 p=tick(act(p,'hub.drying_bind'),3);assert.equal(p.gameplay.player.inventory[K.kit],inv[K.kit]+1);const money=p.state.actors.player.resources['book.paradise.coin'];p=tick(act(p,'hub.commission_1'),2);assert.equal(p.state.actors.player.resources['book.paradise.coin'],money+3);validateParadiseCampaignDepthState(p.state,r);
});
test('projection is pure and exact stale water, borrowed support and forged measured facts cannot silently substitute',()=>{
 let p=buy(setup()),key=choose(p,'clear'),before=JSON.stringify(p);const view=paradiseCampaignDepthPresentation(p.state,r,ctx(p));assert.equal(JSON.stringify(p),before);assert.ok(view.sections.flatMap(s=>s.actions).some(a=>a.command.inputKey===key));for(const a of view.sections.flatMap(s=>s.actions).filter(a=>a.command.inputKey&&a.legibility)){assert.equal(a.legibility.id,a.id);assert.equal(a.legibility.label,a.label);}const blocked=view.sections.flatMap(s=>s.actions).find(a=>a.command.id===E.prefix+'soften'&&a.command.inputKey===choose(p,'cloudy'));assert.equal(blocked.legibility.duration.minutes,4);assert.equal(blocked.legibility.control.enabled,false);
 const command={type:'book_paradise_campaign',id:E.prefix+'soften',inputKey:key};delete p.gameplay.player.inventory[key];before=JSON.stringify(p);assert.throws(()=>commit(p.state,r,command,ctx(p)),/exact owned water/);assert.equal(JSON.stringify(p),before);
 const fake=JSON.parse(choose(p,'cloudy'));fake.environmentWater.batch.constituents[0].amount=0;assert.throws(()=>readPreparationWater(JSON.stringify(fake)),/measured/);
 const current=choose(p,'cloudy');p.state.simulation.custody.loan={holder:'player',owner:P.employee,key:E.cloth,count:1};before=JSON.stringify(p);assert.throws(()=>env(p,'filter',current),/Borrowed goods/);assert.equal(JSON.stringify(p),before);
});
