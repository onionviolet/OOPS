import test from 'node:test';
import {recordFieldForecast,fieldForecastStatus,createPlanarEvent,planarEmission} from '../src/planar_drying_field.js';
import {isBindableStave,dryingKey} from '../src/book_world_paradise_drying.js';
import {paradiseCampaignDefinitions} from '../src/book_world_paradise_campaign_content.js';
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

const field=(p,operation,args={})=>commit(p.state,r,{type:'book_paradise_campaign',action:'field',operation,...args},ctx(p));
const rack=p=>p.state.simulation.owners[D.rack],settings=p=>p.state.actors[D.rack].facts;
const local=p=>p.state.bookWorldCampaign.instances.find(i=>i.worldId===P.hub).clock.elapsed;
const install=p=>tick(act(p,'hub.field_install'),5);
const emission=p=>JSON.parse(settings(p)['field.event']);

test('committed pulse survives pure previews and forecasts stale by time, place, event and actual means',()=>{
 let p=install(setup());const heatAction=paradiseCampaignDepthPresentation(p.state,r,ctx(p)).sections[0].actions.find(a=>a.id==='drying.heat');assert.equal(heatAction.id,heatAction.legibility.id);assert.match(heatAction.legibility.costs.map(c=>c.text).join(' '),/1 charcoal is consumed/);const startAction=paradiseCampaignDepthPresentation(p.state,r,ctx(p)).sections[0].actions.find(a=>a.id==='field.start');assert.equal(startAction.id,startAction.legibility.id);assert.match(startAction.legibility.costs.map(c=>c.text).join(' '),/2 district credits.*1 charcoal/);p=field(p,'start');const truth=JSON.stringify(emission(p)),stock=JSON.stringify(p.gameplay),clock=p.state.clock;
 let before=JSON.stringify(p);for(let n=0;n<3;n++)paradiseCampaignDepthPresentation(p.state,r,ctx(p));assert.equal(JSON.stringify(p),before);
 assert.throws(()=>field(p,'record',{method:'instrument'}),/actual local signs/);assert.equal(JSON.stringify(p),before);
 p=field(p,'record',{method:'observation'});assert.ok(paradiseCampaignDepthPresentation(p.state,r,ctx(p)).sections[0].records.some(row=>row.id==='field.forecast'&&row.text.includes('Current conditional forecast')));assert.equal(JSON.stringify(emission(p)),truth);assert.equal(JSON.stringify(p.gameplay),stock);assert.equal(p.state.clock,clock);
 const retainedSample=settings(p)['field.sample'];p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),r)};assert.equal(settings(p)['field.sample'],retainedSample);assert.equal(JSON.stringify(emission(p)),truth);
 const sample=JSON.parse(settings(p)['field.sample']),c={worldId:P.hub,instanceId:emission(p).instanceId,location:L.hub,at:local(p)};
 assert.equal(fieldForecastStatus(sample,emission(p),c).current,true);
 assert.equal(fieldForecastStatus(sample,emission(p),{...c,location:L.training}).current,false);
 p=tick(p,2);assert.equal(fieldForecastStatus(sample,emission(p),{...c,at:local(p)}).current,false);
 before=JSON.stringify(p);paradiseCampaignDepthPresentation(p.state,r,ctx(p));assert.equal(JSON.stringify(p),before);assert.deepEqual(JSON.parse(settings(p)['field.sample']),sample);
 p=field(p,'record',{method:'observation'});assert.equal(JSON.stringify(emission(p)),truth);assert.notEqual(JSON.parse(settings(p)['field.sample']).observedAt,sample.observedAt);
 p=tick(act(p,'hub.drying_cover'),3);const oldForecast=settings(p)['field.sample'];p=dry(p,'closure',{value:'sealed'});p=field(p,'outcome');const outcome=JSON.parse(settings(p)['field.outcome']);assert.equal(outcome.assessment,'receiver_changed');assert.deepEqual(outcome.sample,JSON.parse(oldForecast));assert.equal(JSON.stringify(emission(p)),truth);p=dry(p,'closure',{value:'open'});
 p=tick(act(p,'hub.field_meter'),3);p=field(p,'record',{method:'instrument'});let measured=JSON.parse(settings(p)['field.sample']);assert.equal(measured.expiresAt-measured.observedAt,6);
 assert.equal(fieldForecastStatus(measured,emission(p),{...c,at:local(p),meter:false}).current,false);
 p=tick(act(p,'hub.field_calibrate'),4);p=field(p,'record',{method:'calibrated'});assert.equal(JSON.parse(settings(p)['field.sample']).expiresAt-local(p),12);assert.deepEqual(JSON.parse(settings(p)['field.outcome']),outcome,'refresh preserves earlier comparison');
 p=tick(p,10);p=field(p,'start');assert.equal(fieldForecastStatus(measured,emission(p),{...c,at:local(p),meter:true}).current,false);
});

test('actual pulse has useful drying, retained charged carrier, paid grounding and existing kit/order use',()=>{
 let p=install(setup());p=dry(p,'load',{key:D.wet});p=dry(p,'load',{key:D.wet});const money=p.state.actors.player.resources['book.paradise.coin'],coal=p.gameplay.player.inventory[D.coal];
 p=field(p,'start');assert.equal(p.state.actors.player.resources['book.paradise.coin'],money-2);assert.equal(p.gameplay.player.inventory[D.coal],coal-1);
 p=tick(p,10);assert.ok(paradiseCampaignDepthPresentation(p.state,r,ctx(p)).sections[0].actions.some(a=>/^Take one charged stave/.test(a.label)));assert.ok(Object.keys(rack(p)).every(k=>readDryingKey(k).moisture===0&&readDryingKey(k).field.charge===800));
 for(const key of Object.keys(rack(p)))while((rack(p)[key]||0)>0)p=dry(p,'take',{key});
 let keys=Object.keys(p.gameplay.player.inventory).filter(k=>readDryingKey(k)?.field?.charge>0);assert.ok(keys.every(k=>!isBindableStave(k)));
 assert.throws(()=>act(p,'hub.drying_bind'));assert.match(paradiseCampaignDepthPresentation(p.state,r,ctx(p)).sections[0].actions.find(a=>a.id===D.prefix+'bind').legibility.blockers.map(row=>row.text).join(' '),/Ground your charged staves/);const groundAction=paradiseCampaignDepthPresentation(p.state,r,ctx(p)).sections[0].actions.find(a=>a.command?.operation==='ground');assert.equal(groundAction.id,groundAction.legibility.id);assert.match(groundAction.legibility.costs.map(c=>c.text).join(' '),/1 district credit.*1 stamina/);const before=structuredClone(p),key=keys[0];
 const poor=structuredClone(p);poor.state.actors.player.resources['book.paradise.coin']=0;const poorBytes=JSON.stringify(poor);assert.throws(()=>field(poor,'ground',{key}),/credits/);assert.equal(JSON.stringify(poor),poorBytes);
 p=field(p,'ground',{key});assert.equal(p.state.actors.player.resources['book.paradise.coin'],before.state.actors.player.resources['book.paradise.coin']-1);
 assert.equal(p.vitals.player.stamina,before.vitals.player.stamina-1);assert.equal(p.native.staminaToFull,p.vitals.player.max_stamina-p.vitals.player.stamina,'native publisher receives the actual grounding debit');assert.ok(Object.keys(p.gameplay.player.inventory).some(k=>isBindableStave(k)&&readDryingKey(k)?.field?.charge===0));
 for(const charged of keys)while((p.gameplay.player.inventory[charged]||0)>0)p=field(p,'ground',{key:charged});
 p=tick(act(p,'hub.drying_bind'),3);const coins=p.state.actors.player.resources['book.paradise.coin'];p=tick(act(p,'hub.commission_1'),2);assert.equal(p.state.actors.player.resources['book.paradise.coin'],coins+3);
 validateParadiseCampaignDepthState(p.state,r);
});

test('sealed/frozen paths and long/split/reload intervals conserve charge, wetness and exact native custody',()=>{
 let p=install(setup());p=tick(act(p,'hub.drying_cover'),3);p=dry(p,'load',{key:D.wet});p=field(p,'start');p=dry(p,'closure',{value:'sealed'});p=tick(p,10);
 assert.equal(readDryingKey(Object.keys(rack(p))[0]).moisture,6000);assert.equal(readDryingKey(Object.keys(rack(p))[0]).revision,1);
 p=dry(p,'closure',{value:'open'});p=field(p,'start');let a=structuredClone(p),b=structuredClone(p);a=tick(a,10);for(const n of [1,2,3,4]){b={...b,state:loadExpansionState(JSON.parse(JSON.stringify(b.state)),r)};b=tick(b,n);}assert.deepEqual(rack(a),rack(b));
 let key=Object.keys(rack(a))[0];a=dry(a,'take',{key});const carried=Object.keys(a.gameplay.player.inventory).find(k=>readDryingKey(k)?.field?.charge>0),original=readDryingKey(carried);a=tick(a,20);assert.deepEqual(readDryingKey(carried),original);
 const domain=a.state.bookWorldCampaign,visit=domain.visits.find(v=>v.id===domain.activeVisitId),instance=domain.instances.find(i=>i.id===visit.instanceId),definition=PARADISE_FOOTPRINTS[0].definition;
 const departure=planWorldDeparture(instance,visit,{playedAt:a.state.clock,visits:domain.visits,expectedRevision:instance.revision},definition);domain.instances=domain.instances.map(i=>i.id===instance.id?departure.nextInstance:i);domain.visits=domain.visits.map(v=>v.id===visit.id?departure.nextVisit:v);domain.activeVisitId=null;a.state.actors.player.worldId='base.frontier';a.state.simulation.people.player.location='Village';const truth=JSON.stringify(emission(a));a=tick(a,100);assert.equal(JSON.stringify(emission(a)),truth);assert.deepEqual(readDryingKey(carried),original);
 const retained=a.state.bookWorldCampaign;const returned=createWorldVisit(retained.instances.find(i=>i.id===instance.id),{id:'book.paradise.visit.field_return',actorId:'player',endpoint:PARADISE_FOOTPRINTS[0].endpoint,playedAt:a.state.clock},definition,{actorIds:Object.keys(a.state.actors),visits:retained.visits});retained.visits.push(returned);retained.activeVisitId=returned.id;a.state.actors.player.worldId=P.hub;a.state.simulation.people.player.location=L.hub;
 a={...a,state:loadExpansionState(JSON.parse(JSON.stringify(a.state)),r)};assert.deepEqual(readDryingKey(carried),original);a=field(a,'ground',{key:carried});assert.ok(Object.keys(a.gameplay.player.inventory).some(k=>readDryingKey(k)?.field?.charge===0));
});

test('forged fields, stale stock, unsupported paid actions and inspection cannot create truth or weaken prior commands',()=>{
 let p=install(setup()),before=JSON.stringify(p);assert.throws(()=>field(p,'ground',{key:D.wet}),/charged stave/);assert.equal(JSON.stringify(p),before);
 p=field(p,'start');before=JSON.stringify(p);assert.throws(()=>field(p,'start'),/still committed/);assert.equal(JSON.stringify(p),before);
 const bad={...createDryingLotFixture(),revision:2,field:{lawId:'wrong',revision:1,eventId:'x',worldId:P.hub,instanceId:'x',charge:1}};assert.throws(()=>dryingKey(bad),/field carrier/);

});
function createDryingLotFixture(){return {revision:1,cohort:'field.test',worldId:P.hub,instanceId:'test',at:0,sourceKey:D.wet,provenanceKey:null,moisture:6000,remainder:0,rainDose:0,dryDose:0};}
