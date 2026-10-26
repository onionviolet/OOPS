import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as r} from '../src/expedition_content.js';
import {commitParadiseCommand} from '../src/book_world_paradise_host.js';
import {commitParadiseCampaignDepthCommand as commit,paradiseCampaignDepthPresentation} from '../src/book_world_paradise_campaign_host.js';
import {paradiseCampaignContext,validateParadiseCampaignDepthState} from '../src/book_world_paradise_campaign_facts.js';
import {PARADISE_IDS as P,PARADISE_LOCATIONS as L,PARADISE_KEYS as K,PARADISE_FOOTPRINTS} from '../src/book_world_paradise_ids.js';
import {PARADISE_CAMPAIGN_IDS as I} from '../src/book_world_paradise_campaign_content.js';
import {createWorldVisit} from '../src/world_instances.js';
import {previewSimulationCommand} from '../src/simulation.js';
const F=I.prefix,body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
function ctx(p){return {actorId:'player',worldId:p.state.actors.player.worldId,external:p.external,gameplay:p.gameplay,vitals:p.vitals,vitalsByActor:p.vitals,equipment:Object.fromEntries(Object.keys(p.gameplay).map(id=>[id,{}])),nativeAlive:true,nativeReady:true,busy:false,paradiseNative:{bound:true,revision:p.state.bookWorldCampaign?.nativeRevision||0,body},facts:{location:p.state.simulation?.people.player.location||'Village','village.elderMet':true,calendarMinute:1440*360000+480}};}
const act=(p,name)=>commit(p.state,r,{type:'book_paradise_campaign',id:F+name},ctx(p));
function tick(p,n){const c=paradiseCampaignContext(p.state,ctx(p));const out=advanceSimulation(p.state,r,n,p.external,p.gameplay,Object.fromEntries(Object.keys(p.state.simulation.people).map(id=>[id,{...c,actorId:id,vitals:p.vitals[id]||{health:100,max_health:100,stamina:100,max_stamina:100}}])));out.vitals=structuredClone(p.vitals);if(out.native?.staminaToFull!=null)out.vitals.player.stamina=out.vitals.player.max_stamina-out.native.staminaToFull;return out;}
function setup(){
 const state=initializeExpedition(createExpansionState(317));state.actors.player.facts['village.discovered']=true;state.campaign.facts.anchor=true;
 let p={state,external:{money:30},gameplay:{player:{inventory:{[K.log]:20,[K.rope]:10,[K.kit]:3},skills:{},reputation:{}}},vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}}};
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.chart'},ctx(p));
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.enroll'},ctx(p));
 // Named synthetic retained-hub/body binding. All learning, bench and foundation
 // below are real commands; the fixture supplies no learned method/development.
 p.state.bookWorldCampaign.nativeRevision=1;
 const f=PARADISE_FOOTPRINTS[0],instance=p.state.bookWorldCampaign.instances[0];
 const visit=createWorldVisit(instance,{id:'book.paradise.visit.method_fixture',actorId:'player',endpoint:f.endpoint,playedAt:p.state.clock},f.definition,{actorIds:Object.keys(p.state.actors),visits:[]});
 p.state.bookWorldCampaign.visits=[visit];p.state.bookWorldCampaign.activeVisitId=visit.id;p.state.actors.player.worldId=P.hub;p.state.simulation.people.player.location=L.hub;p.state.actors.player.resources['book.paradise.coin']=20;
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.hub_meet'},ctx(p));
 p=tick(commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.lesson'},ctx(p)),3);
 p=act(p,'hub.begin');p=tick(act(p,'hub.bench'),5);p=tick(act(p,'hub.learn_paid'),4);return p;
}
const preview=(p,name,c=ctx(p))=>previewSimulationCommand(p.state,r,F+name,paradiseCampaignContext(p.state,c));

test('rehearsal diverts real time/effort from mastery and opens two conserved, different combinations',()=>{
 let p=setup();const initial=p.state.simulation.powers.player[I.method].mastery;
 assert.equal(preview(p,'hub.make_measured').eligible,false);
 const before=structuredClone(p);p=tick(act(p,'hub.foundation_1'),6);
 assert.equal(p.state.simulation.powers.player[I.method].mastery,initial);
 assert.equal(p.state.simulation.faculties.player[I.method].development,1);
 assert.equal(p.gameplay.player.inventory[K.kit],before.gameplay.player.inventory[K.kit]);assert.equal(p.gameplay.player.inventory[K.rope],before.gameplay.player.inventory[K.rope]);
 assert.equal(preview(p,'hub.make_measured').duration,3);assert.equal(preview(p,'hub.make_continuous').eligible,false);
 const single=structuredClone(p);p=tick(act(p,'hub.make_measured'),3);
 assert.equal(p.gameplay.player.inventory[K.log],single.gameplay.player.inventory[K.log]-1);assert.equal(p.gameplay.player.inventory[K.kit],single.gameplay.player.inventory[K.kit]+1);
 p=tick(act(p,'hub.foundation_2'),6);assert.equal(preview(p,'hub.make_continuous').duration,4);
 const batch=structuredClone(p);p=tick(act(p,'hub.make_continuous'),4);
 assert.equal(p.gameplay.player.inventory[K.log],batch.gameplay.player.inventory[K.log]-2);assert.equal(p.gameplay.player.inventory[K.kit],batch.gameplay.player.inventory[K.kit]+2);assert.equal(p.gameplay.player.inventory[K.rope],batch.gameplay.player.inventory[K.rope]);
 assert.equal(p.state.simulation.powers.player[I.method].mastery,initial);validateParadiseCampaignDepthState(p.state,r);
 assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(p.state)),r),p.state);
});

test('cancelled and unsupported completion return actual tools, grant no development and cannot replay a tier',()=>{
 let p=setup(),before=structuredClone(p);p=act(p,'hub.foundation_1');
 assert.equal(p.gameplay.player.inventory[K.kit],before.gameplay.player.inventory[K.kit]-1);
 p=commit(p.state,r,{type:'book_paradise_campaign',action:'cancel',id:p.state.simulation.jobs.find(j=>j.actorId==='player').id},ctx(p));
 assert.deepEqual(p.gameplay.player.inventory,before.gameplay.player.inventory);assert.equal(p.state.simulation.faculties.player[I.method].development,0);
 p=act(p,'hub.foundation_1');p.state.simulation.faculties.player[I.method].active=false;p=tick(p,6);
 assert.deepEqual(p.gameplay.player.inventory,before.gameplay.player.inventory);assert.equal(p.state.simulation.faculties.player[I.method].development,0);
 p.state.simulation.faculties.player[I.method].active=true;p=tick(act(p,'hub.foundation_1'),6);
 assert.throws(()=>act(p,'hub.foundation_1'));assert.equal(p.state.simulation.faculties.player[I.method].development,1);
});

test('missing active constituent, borrowed tools and unsupported body refuse without changing foundation or stock',()=>{
 let p=tick(act(setup(),'hub.foundation_1'),6);
 for(const change of [q=>q.state.simulation.faculties.player[P.method].active=false,q=>q.state.simulation.faculties.player[I.method].suppressed=true,q=>q.gameplay.player.inventory[K.rope]=0,q=>q.state.simulation.custody.fixture_loan={holder:'player',owner:P.employee,key:K.rope,count:1}]){
  const q=structuredClone(p);change(q);const before=JSON.stringify(q);assert.equal(preview(q,'hub.make_measured').eligible,false);assert.throws(()=>act(q,'hub.make_measured'));assert.equal(JSON.stringify(q),before);
 }
 const c={...ctx(p),paradiseNative:{...ctx(p).paradiseNative,body:{...body,id:'different.body'}}};assert.equal(preview(p,'hub.make_measured',c).eligible,false);
 const bad=structuredClone(p.state);bad.simulation.faculties.player[I.method].development=2;assert.throws(()=>validateParadiseCampaignDepthState(bad,r),/development/);
});


test('two actual lessons grant zero-start methods; capped drill keeps knowledge and names its next application',()=>{
 let p=setup();assert.equal(p.state.simulation.powers.player[P.method].mastery,0);assert.equal(p.state.simulation.powers.player[I.method].mastery,0);
 p=commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.move.training'},ctx(p));
 for(let i=0;i<3;i++)p=tick(act(p,'hub.practice'),3);
 assert.equal(p.state.simulation.powers.player[I.method].mastery,3);const before=JSON.stringify(p);assert.throws(()=>act(p,'hub.practice'));assert.equal(JSON.stringify(p),before);
 const view=paradiseCampaignDepthPresentation(p.state,r,ctx(p));
 assert.ok(view.sections.flatMap(s=>s.actions).find(a=>a.id===F+'hub.practice').reasons.some(r=>/drill is complete at mastery three/.test(r)));
 assert.ok(view.sections.flatMap(s=>s.actions).find(a=>a.id===F+'hub.practice').legibility.blockers.some(r=>/drill is complete at mastery three/.test(r.text)));
 const pending=act(commitParadiseCommand(p.state,r,{type:'book_paradise',id:'book.paradise.move.desk'},ctx(p)),'hub.foundation_1');
 assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(pending.state)),r),pending.state);
});
