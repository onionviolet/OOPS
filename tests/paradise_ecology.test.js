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
import {PARADISE_ECOLOGY as ECO,projectParadiseEcology,validateParadiseEcology,nurseryWaterAssessment} from '../src/book_world_paradise_ecology.js';
const F='book.paradise.campaign.',body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
function ctx(p){return {actorId:'player',worldId:p.state.actors.player.worldId,external:p.external,gameplay:p.gameplay,vitals:p.vitals,vitalsByActor:p.vitals,equipment:Object.fromEntries(Object.keys(p.gameplay).map(id=>[id,{}])),nativeAlive:true,nativeReady:true,busy:false,paradiseNative:{bound:true,revision:p.state.bookWorldCampaign?.nativeRevision||0,body},facts:{location:p.state.simulation?.people.player.location||'Village','village.elderMet':true,calendarMinute:1440*360000+480}};}
const act=(p,name)=>commit(p.state,r,{type:'book_paradise_campaign',id:F+name},ctx(p));
const dry=(p,operation,args={})=>commit(p.state,r,{type:'book_paradise_campaign',action:'drying',operation,...args},ctx(p));
function singleTick(p,n){const c=paradiseCampaignContext(p.state,ctx(p)),out=advanceSimulation(p.state,r,n,p.external,p.gameplay,Object.fromEntries(Object.keys(p.state.simulation.people).map(id=>[id,{...c,actorId:id,vitals:p.vitals[id]||{health:100,max_health:100,stamina:100,max_stamina:100}}])));out.vitals=structuredClone(p.vitals);if(out.native?.staminaToFull!=null)out.vitals.player.stamina=out.vitals.player.max_stamina-out.native.staminaToFull;return out;}
function tick(p,n){while(n){const step=Math.min(100,n);p=singleTick(p,step);n-=step;}return p;}
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


const eco=(p,operation,args={})=>commit(p.state,r,{type:'book_paradise_campaign',action:'ecology',operation,...args},ctx(p));
const nursery=p=>tick(act(p,'hub.ecology_lease'),3);
test('paid standing source yields retained ordinary logs used by actual wash/dry/kit/commission',()=>{
 let p=nursery(buy(setup())),initial=p.gameplay.player.inventory[K.log],before=JSON.stringify(p);
 for(let i=0;i<3;i++)paradiseCampaignDepthPresentation(p.state,r,ctx(p));assert.equal(JSON.stringify(p),before);
 p=eco(p,'harvest');assert.equal(p.gameplay.player.inventory[K.log],initial+1);assert.equal(projectParadiseEcology(p.state).node.stock,1);
 p=tick(env(p,'soften',choose(p,'clear')),4);assert.equal(p.gameplay.player.inventory[K.log],initial);
 const wet=Object.keys(p.gameplay.player.inventory).find(k=>readDryingKey(k)?.provenanceKey);
 assert.equal(p.gameplay.player.inventory[wet],2);p=commit(p.state,r,{type:'book_paradise_campaign',action:'drying',operation:'load',key:wet},ctx(p));p=commit(p.state,r,{type:'book_paradise_campaign',action:'drying',operation:'load',key:wet},ctx(p));p=tick(p,24);
 for(const [key,count] of Object.entries(dryStock(p)))for(let i=0;i<count;i++)p=commit(p.state,r,{type:'book_paradise_campaign',action:'drying',operation:'take',key},ctx(p));
 const kits=p.gameplay.player.inventory[K.kit];p=tick(act(p,'hub.drying_bind'),3);assert.equal(p.gameplay.player.inventory[K.kit],kits+1);
 const coins=p.state.actors.player.resources['book.paradise.coin'];p=tick(act(p,'hub.commission_1'),2);assert.equal(p.state.actors.player.resources['book.paradise.coin'],coins+3);validateParadiseEcology(p.state);
});
test('finite care, exact fractional growth, no unsupported catchup and failed actions conserve actual stock',()=>{
 let p=nursery(buy(setup()));p=eco(p,'harvest');p=eco(p,'harvest');let before=JSON.stringify(p);
 assert.throws(()=>eco(p,'harvest'),/No mature wood/);assert.equal(JSON.stringify(p),before);
 p=tick(p,20);assert.equal(projectParadiseEcology(p.state).node.stock,0,'no water means no growth');
 const brack=choose(p,'brackish');assert.equal(nurseryWaterAssessment(brack).usable,false);before=JSON.stringify(p);assert.throws(()=>eco(p,'care',{key:brack}),/salt/);assert.equal(JSON.stringify(p),before);
 const view=paradiseCampaignDepthPresentation(p.state,r,ctx(p)),careAction=view.sections[0].actions.find(a=>a.command?.action==='ecology'&&a.command?.key===choose(p,'clear'));
 assert.equal(careAction.legibility.id,careAction.id);assert.match(careAction.legibility.costs.map(c=>c.text).join(' '),/1 exact Clear workshop water portion.*1 stamina/);assert.equal(careAction.legibility.duration.text,'Immediate action.');
 const key=choose(p,'clear'),water=p.gameplay.player.inventory[key],stamina=p.vitals.player.stamina;p=eco(p,'care',{key});assert.equal(p.gameplay.player.inventory[key],water-1);assert.equal(p.vitals.player.stamina,stamina-1);assert.equal(p.native.staminaToFull,p.vitals.player.max_stamina-p.vitals.player.stamina);
 before=JSON.stringify(p);assert.throws(()=>eco(p,'care',{key}),/ration/);assert.equal(JSON.stringify(p),before);
 let a=tick(structuredClone(p),721),b=structuredClone(p);for(const n of [1,37,200,483]){b=tick(b,n);b.state=loadExpansionState(JSON.parse(JSON.stringify(b.state)),r);}
 assert.deepEqual(projectParadiseEcology(a.state),projectParadiseEcology(b.state));assert.equal(projectParadiseEcology(a.state).node.stock,1);assert.equal(projectParadiseEcology(a.state).node.carry,2);
 a=eco(a,'harvest');a=tick(a,3000);assert.equal(projectParadiseEcology(a.state).node.stock,1,'one care ration supports exactly two grown cuts');a=eco(a,'harvest');assert.equal(projectParadiseEcology(a.state).node.stock,0);
 before=JSON.stringify(a);a.state.clock+=100;assert.equal(projectParadiseEcology(a.state).node.stock,0,'root clock alone cannot grow source');
 const forged=structuredClone(a.state);forged.actors[ECO.nursery].facts['ecology.node']=JSON.stringify({...projectParadiseEcology(a.state).node,stock:3});assert.throws(()=>validateParadiseEcology(forged),/node/);
});

test('departing freezes nursery support and return retains the same source rather than refilling it',()=>{
 let p=nursery(buy(setup()));p=eco(p,'harvest');p=eco(p,'harvest');p=eco(p,'care',{key:choose(p,'clear')});p=tick(p,37);
 const before=projectParadiseEcology(p.state),d=p.state.bookWorldCampaign,visit=d.visits.find(v=>v.id===d.activeVisitId),instance=d.instances.find(i=>i.id===visit.instanceId),definition=PARADISE_FOOTPRINTS[0].definition;
 const departure=planWorldDeparture(instance,visit,{playedAt:p.state.clock,visits:d.visits,expectedRevision:instance.revision},definition);assert.ok(departure.allowed);d.instances=d.instances.map(i=>i.id===instance.id?departure.nextInstance:i);d.visits=d.visits.map(v=>v.id===visit.id?departure.nextVisit:v);d.activeVisitId=null;p.state.actors.player.worldId='base.frontier';p.state.simulation.people.player.location='Village';
 p=tick(p,100);assert.equal(projectParadiseEcology(p.state),null);p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),r);validateParadiseEcology(p.state);
 const retained=p.state.bookWorldCampaign,returned=createWorldVisit(retained.instances.find(i=>i.id===instance.id),{id:'book.paradise.visit.ecology_return',actorId:'player',endpoint:PARADISE_FOOTPRINTS[0].endpoint,playedAt:p.state.clock},definition,{actorIds:Object.keys(p.state.actors),visits:retained.visits});retained.visits.push(returned);retained.activeVisitId=returned.id;p.state.actors.player.worldId=P.hub;p.state.simulation.people.player.location=L.hub;
 assert.deepEqual(projectParadiseEcology(p.state),before);p=tick(p,1);assert.equal(projectParadiseEcology(p.state).node.carry,before.node.carry+2);
});
