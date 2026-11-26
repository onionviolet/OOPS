import test from 'node:test';
import assert from 'node:assert/strict';
import {TENT,TENT_COMMANDS,tentIncidentData,tentIncidentFacts,tentIncidentPeople,tentIncidentView,defineTentIncidentCommands} from '../src/lotm_tent_incident.js';
import {CIRCUS_NOTICE as N,circusNoticeData,circusNoticePaperView,CIRCUS_HANDBILL} from '../src/lotm_circus_notice.js';
import {seedPlaceObjects} from '../src/place_acts.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {fresh,ctx,registry,I} from './lotm_helpers.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {castObjectCommands} from '../src/book_world_lotm_cast_host.js';
const tent='fixture.place.tent',bakery='fixture.place.bakery',local='lotm.early_tingen.local_probationer@1';
const pack={places:[{id:tent,indexId:'lotm.place.fortune-tent'},{id:bakery,indexId:'lotm.place.sline-bakery'}],
 people:[{id:I.supervisor,indexId:'lotm.person.circus-fortune-teller'},{id:I.member,indexId:'lotm.person.animal-trainer-fortune-teller'},
 {id:I.stormOfficer,indexId:'lotm.person.wendy-sline'}],host:{profile:{id:local}},
 bindings:{schedule:[{actor:I.stormOfficer,place:bakery,day:1,until:4,from:420,to:720,recurrence:'daily',source:'fill',label:'I'}]}};
const situation='book.lotm.tingen.canon_beside',data=tentIncidentData(pack);
const commands=defineTentIncidentCommands(data,{worldId:I.world,group:'book_lotm',situationId:situation});
const defs=createSimulationRegistry({commands,situations:[{id:situation,revision:1,label:'Fixture circus',initialPhase:'present',phases:['present'],privateTruth:{role:'fixture'},context:{worldId:I.world,instanceId:'fixture.tent',continuityId:situation,eraId:'fixture.era',regionId:'fixture.region'},participants:['player']}]});
for(const [id,d]of defs.commands)registry.simulation.commands.set(id,d);
for(const [id,d]of defs.situations)registry.simulation.situations.set(id,d);
castObjectCommands.push(...commands);
const context=(p,id)=>{const c=ctx(p,id);return {...c,facts:{...c.facts,...tentIncidentFacts(p.state,data)}};};
const keep=(p,o)=>({...p,state:o.state,external:o.external??p.external,gameplay:o.gameplay??p.gameplay});
const start=(p,id)=>keep(p,commitSimulationCommand(p.state,registry,{id},context(p,registry.simulation.commands.get(id).targetId)));
function advance(p,n){for(let i=0;i<n;i++){const c=context(p);p=keep(p,advanceSimulation(p.state,registry,1,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}}));}return p;}
const finish=(p,id)=>advance(start(p,id),registry.simulation.commands.get(id).duration);
const stop=p=>keep(p,cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,context(p)));
const jump=(p,clock)=>{const c=context(p);return keep(p,advanceSimulation(p.state,registry,clock-p.state.clock,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}}));};
let baseline;
function setup(){if(!baseline){let p=fresh(10);p.state.lotm.entryProfile=local;p.state.lotm.initializedAt=0;
 p.state.simulation.people.player.location=tent;p.state.simulation.people[I.supervisor].location=tent;p.state.simulation.people[I.member].location=tent;p.state.simulation.people[I.stormOfficer].location=bakery;
 applySituationEffect(p.state,{type:'situation',situationId:situation,operation:'begin'},registry.simulation,'fixture.tent');seedPlaceObjects(p.state,data,I.world);baseline=jump(p,TENT.nextDay);}return structuredClone(baseline);}
const held=(p,actor,key=N.stock)=>p.state.actors[actor].resources[key]||0;
const round=()=>finish(finish(setup(),TENT_COMMANDS.inquire),TENT_COMMANDS.flyers);
const walk=p=>{p.state.simulation.people.player.location=bakery;return advance(p,2);}; // Setup-only relocation; normal route covered independently by host test.

test('ordinary bakery visit needs no circus history and grants no work, trust or money',()=>{
 let p=walk(setup()),before=structuredClone(p.state.simulation.relationships);p=finish(p,N.visit);
 assert.equal(p.external.money,10);assert.equal(held(p,'player'),0);assert.deepEqual(p.state.simulation.relationships,before);
 assert.equal(tentIncidentFacts(p.state,data)['notice.visible.visit'],true);assert.equal(tentIncidentFacts(p.state,data)['notice.visible.post'],false);
 assert.doesNotMatch(tentIncidentView(p.state,data).status,/still beside/);
 assert.throws(()=>start(p,N.post));assert.deepEqual(tentIncidentPeople(p.state,data),[I.stormOfficer]);
});
test('paid round funds no new reward: one employer paper transfers to one consented shop notice and survives reload',()=>{
 let p=setup();assert.throws(()=>start(p,N.spare));p=round();assert.equal(p.external.money,12);
 p=finish(p,N.spare);assert.equal(held(p,I.supervisor),0);assert.equal(held(p,'player'),1);assert.throws(()=>start(p,N.spare));
 p=JSON.parse(JSON.stringify(p));seedPlaceObjects(p.state,data,I.world);assert.equal(held(p,I.supervisor),0);
 p=walk(p);p=finish(p,N.post);assert.equal(held(p,'player'),0);assert.equal(held(p,I.stormOfficer,N.posted),1);assert.equal(p.external.money,12);
 p=JSON.parse(JSON.stringify(p));assert.equal(tentIncidentFacts(p.state,data)['notice.posted'],true);assert.throws(()=>start(p,N.post));
 p.state.simulation.people.player.location=tent;assert.doesNotMatch(tentIncidentView(p.state,data).status,/still beside/);p=walk(p);
 assert.match(tentIncidentView(p.state,data).status,/notice you brought is still beside the window/);
 assert.equal(p.state.simulation.knowledge.player[N.post+'.seen'].value.includes('she puts it by the window'),true);
 assert.equal(p.state.simulation.relationships[I.stormOfficer]?.player,undefined);p=finish(p,N.visit);assert.equal(held(p,I.stormOfficer,N.posted),1);
});
test('stopping or losing the present participant refunds paper without posting or duplicate custody',()=>{
 let p=start(round(),N.spare);assert.equal(held(p,I.supervisor),0);p=stop(p);assert.equal(held(p,I.supervisor),1);assert.equal(held(p,'player'),0);
 p=finish(p,N.spare);p=walk(p);p=start(p,N.post);assert.equal(held(p,'player'),0);p=JSON.parse(JSON.stringify(p));p=stop(p);
 assert.equal(held(p,'player'),1);assert.equal(held(p,I.stormOfficer,N.posted),0);
 p=start(p,N.post);p.state.simulation.people[I.stormOfficer].location='fixture.place.away';p=advance(p,3);
 assert.equal(held(p,'player'),1);assert.equal(held(p,I.stormOfficer,N.posted),0);assert.equal(tentIncidentFacts(p.state,data)['notice.posted'],false);
 p.state.simulation.people[I.stormOfficer].location=bakery;p=finish(p,N.post);assert.equal(held(p,I.stormOfficer,N.posted),1);
});
test('stale bodies after service hours fail, and the protagonist gains no new local commands',()=>{
 let p=walk(finish(round(),N.spare));const early=structuredClone(p);p=jump(p,1440+720);
 assert.equal(tentIncidentFacts(p.state,data)['notice.bakerHere'],false);assert.deepEqual(tentIncidentPeople(p.state,data),[]);assert.throws(()=>start(p,N.visit));assert.throws(()=>start(p,N.post));assert.equal(held(p,'player'),1);
 p=jump(early,1440+717);assert.throws(()=>start(p,N.post),'do not reserve a notice for work finishing after service closes');
 p=jump(early,1440+716);p=finish(p,N.post);assert.equal(held(p,I.stormOfficer,N.posted),1,'the last on-time start finishes before service closes');
 p=walk(setup());p.state.lotm.entryProfile='book.lead.be@1';assert.equal(tentIncidentFacts(p.state,data)['notice.visible.visit'],false);assert.throws(()=>start(p,N.visit));
 assert.equal(circusNoticeData({places:[],people:[]},data),null);
});

test('handbill inspection follows actual custody and the posted window, without spending time or changing state',()=>{
 let p=setup();assert.equal(circusNoticePaperView(p.state,data.notice),null);
 p=finish(round(),N.spare);const carried=JSON.stringify(p);
 assert.equal(circusNoticePaperView(p.state,data.notice).copy,'carried');assert.deepEqual(tentIncidentView(p.state,data).paper.lines,CIRCUS_HANDBILL.lines);assert.equal(JSON.stringify(p),carried);
 p=walk(p);p=start(p,N.post);assert.equal(circusNoticePaperView(p.state,data.notice),null,'reserved paper is not a carried or posted copy');p=stop(p);assert.equal(circusNoticePaperView(p.state,data.notice).copy,'carried');
 p=finish(p,N.post);assert.equal(circusNoticePaperView(p.state,data.notice).copy,'posted');
 p=JSON.parse(JSON.stringify(p));p.state.simulation.people.player.location=tent;assert.equal(circusNoticePaperView(p.state,data.notice),null,'a posting flag grants no remote copy');assert.equal(tentIncidentView(p.state,data).paper,null);
 p.state.clock=3*1440+900;p.state.simulation.people.player.location=bakery;p.state.simulation.people[I.stormOfficer].location='fixture.place.away';const later=JSON.stringify(p);
 assert.equal(circusNoticePaperView(p.state,data.notice).copy,'posted','the window copy remains readable after Wendy stops serving');assert.equal(JSON.stringify(p),later);
 p.state.actors[I.stormOfficer].resources[N.posted]=0;assert.equal(circusNoticePaperView(p.state,data.notice),null,'actual posted custody matters, not the old player flag');
 p.state.actors.player.resources[N.stock]=1;p.state.lotm.entryProfile='book.lead.be@1';assert.equal(circusNoticePaperView(p.state,data.notice),null);assert.equal(circusNoticePaperView(p.state,null),null);
});
