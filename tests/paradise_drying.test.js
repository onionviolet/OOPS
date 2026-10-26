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
const F='book.paradise.campaign.',body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
function ctx(p){return {actorId:'player',worldId:p.state.actors.player.worldId,external:p.external,gameplay:p.gameplay,vitals:p.vitals,vitalsByActor:p.vitals,equipment:Object.fromEntries(Object.keys(p.gameplay).map(id=>[id,{}])),nativeAlive:true,nativeReady:true,busy:false,paradiseNative:{bound:true,revision:p.state.bookWorldCampaign?.nativeRevision||0,body},facts:{location:p.state.simulation?.people.player.location||'Village','village.elderMet':true,calendarMinute:1440*360000+480}};}
const act=(p,name)=>commit(p.state,r,{type:'book_paradise_campaign',id:F+name},ctx(p));
const dry=(p,operation,args={})=>commit(p.state,r,{type:'book_paradise_campaign',action:'drying',operation,...args},ctx(p));
function tick(p,n){const c=paradiseCampaignContext(p.state,ctx(p)),out=advanceSimulation(p.state,r,n,p.external,p.gameplay,Object.fromEntries(Object.keys(p.state.simulation.people).map(id=>[id,{...c,actorId:id,vitals:p.vitals[id]||{health:100,max_health:100,stamina:100,max_stamina:100}}])));out.vitals=structuredClone(p.vitals);if(out.native?.staminaToFull!=null)out.vitals.player.stamina=out.vitals.player.max_stamina-out.native.staminaToFull;return out;}
function setup(){
 const state=initializeExpedition(createExpansionState(317));state.actors.player.facts['village.discovered']=true;state.campaign.facts.anchor=true;
 let p={state,external:{money:30},gameplay:{player:{inventory:{[K.log]:20,[K.rope]:10,[K.kit]:3,[D.coal]:3},skills:{},reputation:{}}},vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}}};
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.chart'},ctx(p));p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.enroll'},ctx(p));
 p.state.bookWorldCampaign.nativeRevision=1;const f=PARADISE_FOOTPRINTS[0],instance=p.state.bookWorldCampaign.instances[0],visit=createWorldVisit(instance,{id:'book.paradise.visit.drying_fixture',actorId:'player',endpoint:f.endpoint,playedAt:p.state.clock},f.definition,{actorIds:Object.keys(p.state.actors),visits:[]});
 p.state.bookWorldCampaign.visits=[visit];p.state.bookWorldCampaign.activeVisitId=visit.id;p.state.actors.player.worldId=P.hub;p.state.simulation.people.player.location=L.hub;p.state.actors.player.resources['book.paradise.coin']=20;
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.hub_meet'},ctx(p));p=act(p,'hub.begin');p=tick(act(p,'hub.bench'),5);p=tick(act(p,'hub.drying_rack'),3);p=tick(act(p,'hub.drying_cut'),4);return p;
}
const held=p=>p.state.simulation.owners[D.rack],one=p=>Object.keys(held(p))[0];
test('counted wet material dries on the paid rack, binds with exact refund custody and supplies existing commission',()=>{
 let p=setup();assert.equal(p.gameplay.player.inventory[D.wet],2);assert.match(paradiseCampaignDepthPresentation(p.state,r,ctx(p)).sections[0].actions.find(a=>a.id===D.prefix+'bind').reasons.join(' '),/Dry and collect two staves/);p=dry(p,'load',{key:D.wet});p=dry(p,'load',{key:D.wet});assert.equal(Object.values(held(p)).reduce((a,b)=>a+b),2);
 assert.throws(()=>act(p,'hub.drying_bind'));
 p=tick(p,24);assert.ok(Object.keys(held(p)).every(k=>readDryingKey(k).moisture===0));
 for(const key of Object.keys(held(p)))p=dry(p,'take',{key});
 const before=structuredClone(p);p=act(p,'hub.drying_bind');assert.equal(p.state.simulation.jobs.find(j=>j.actorId==='player').costs.filter(c=>c.key&&readDryingKey(c.key)).reduce((n,c)=>n-c.amount,0),2);
 p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),r)};p=commit(p.state,r,{type:'book_paradise_campaign',action:'cancel',id:p.state.simulation.jobs.find(j=>j.actorId==='player').id},ctx(p));assert.deepEqual(p.gameplay.player.inventory,before.gameplay.player.inventory);
 p=tick(act(p,'hub.drying_bind'),3);assert.equal(p.gameplay.player.inventory[K.kit],before.gameplay.player.inventory[K.kit]+1);
 const money=p.state.actors.player.resources['book.paradise.coin'],owned=p.gameplay[P.employee].inventory[K.kit]||0;p=tick(act(p,'hub.commission_1'),2);assert.equal(p.state.actors.player.resources['book.paradise.coin'],money+3);assert.equal(p.gameplay[P.employee].inventory[K.kit],owned+1);validateParadiseCampaignDepthState(p.state,r);
});
test('sealed storage stalls, paid vents/heat recover, active pause retains passive airflow and previews stay pure',()=>{
 let p=setup();p=tick(act(p,'hub.drying_cover'),3);p=tick(act(p,'hub.drying_vents'),2);p=dry(p,'load',{key:D.wet});p=dry(p,'closure',{value:'sealed'});p=tick(p,12);assert.equal(readDryingKey(one(p)).moisture,6000);
 const snapshot=JSON.stringify(p);for(let i=0;i<3;i++)paradiseCampaignDepthPresentation(p.state,r,ctx(p));assert.equal(JSON.stringify(p),snapshot);
 assert.throws(()=>dry(p,'heat'),/Open/);p=dry(p,'closure',{value:'open'});const fuel=p.gameplay.player.inventory[D.coal];p=dry(p,'heat');assert.equal(p.gameplay.player.inventory[D.coal],fuel-1);
 p=tick(p,2);assert.equal(readDryingKey(one(p)).moisture,4000);p=dry(p,'pause');p=tick(p,2);assert.equal(readDryingKey(one(p)).moisture,3000);p=dry(p,'resume');p=tick(p,2);assert.equal(readDryingKey(one(p)).moisture,1000);p=tick(p,2);assert.equal(readDryingKey(one(p)).moisture,0);
});
test('partial removal preserves prior wetness, unequal cohorts remain distinct, long/reloaded partitions and duplicate settlement agree',()=>{
 let p=setup();p=dry(p,'load',{key:D.wet});p=dry(p,'load',{key:D.wet});p=tick(p,4);let key=one(p);const first=readDryingKey(key).moisture;p=dry(p,'take',{key});
 p=tick(p,4);const carried=Object.keys(p.gameplay.player.inventory).find(k=>readDryingKey(k));assert.equal(readDryingKey(carried).moisture,first);
 p=dry(p,'load',{key:carried});assert.equal(Object.keys(held(p)).length,2);assert.equal(Object.values(held(p)).reduce((a,b)=>a+b),2);
 let a=structuredClone(p),b=structuredClone(p);a=tick(a,17);for(const n of [1,3,6,7]){b={...b,state:loadExpansionState(JSON.parse(JSON.stringify(b.state)),r)};b=tick(b,n);}assert.deepEqual(held(a),held(b));
 const settled=JSON.stringify(a);settleParadiseDrying(a);assert.equal(JSON.stringify(a),settled);validateParadiseDryingState(a.state);
});
test('leaving the world freezes stationary material; carried unfinished stock keeps history and does not catch up',()=>{
 let p=setup();p=dry(p,'load',{key:D.wet});p=tick(p,4);const stockBefore=structuredClone(held(p));
 const d=p.state.bookWorldCampaign,visit=d.visits.find(v=>v.id===d.activeVisitId),instance=d.instances.find(i=>i.id===visit.instanceId),definition=PARADISE_FOOTPRINTS[0].definition;
 const departure=planWorldDeparture(instance,visit,{playedAt:p.state.clock,visits:d.visits,expectedRevision:instance.revision},definition);assert.ok(departure.allowed);d.instances=d.instances.map(i=>i.id===instance.id?departure.nextInstance:i);d.visits=d.visits.map(v=>v.id===visit.id?departure.nextVisit:v);d.activeVisitId=null;p.state.actors.player.worldId='base.frontier';p.state.simulation.people.player.location='Village';
 p=tick(p,100);assert.deepEqual(held(p),stockBefore);
 const retained=p.state.bookWorldCampaign,returned=createWorldVisit(retained.instances.find(i=>i.id===instance.id),{id:'book.paradise.visit.drying_return',actorId:'player',endpoint:PARADISE_FOOTPRINTS[0].endpoint,playedAt:p.state.clock},definition,{actorIds:Object.keys(p.state.actors),visits:retained.visits});retained.visits.push(returned);retained.activeVisitId=returned.id;p.state.actors.player.worldId=P.hub;p.state.simulation.people.player.location=L.hub;
 settleParadiseDrying(p);assert.deepEqual(held(p),stockBefore);p=tick(p,4);assert.equal(readDryingKey(one(p)).moisture,4000);
});

test('unsupported hands, busy work, stale quantities and forged progress refuse without changing inputs',()=>{
 let p=setup(),before=JSON.stringify(p);assert.throws(()=>dry(p,'load',{key:D.wet,count:3}),/batch changed/);assert.equal(JSON.stringify(p),before);
 const c=ctx(p);c.busy=true;assert.throws(()=>commit(p.state,r,{type:'book_paradise_campaign',action:'drying',operation:'load',key:D.wet},c));assert.equal(JSON.stringify(p),before);
 p=act(p,'hub.drying_vents');before=JSON.stringify(p);assert.throws(()=>dry(p,'load',{key:D.wet}),/free hands/);assert.equal(JSON.stringify(p),before);
 const corrupted={id:'Wet repair stave',drying:{revision:1,moisture:-1}};assert.throws(()=>readDryingKey(JSON.stringify(corrupted)),/lot fields/);
});
