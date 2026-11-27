import test from 'node:test';
import assert from 'node:assert/strict';
import {TENT,TENT_COMMANDS,tentIncidentData,tentIncidentFacts,tentIncidentView,defineTentIncidentCommands} from '../src/lotm_tent_incident.js';
import {seedPlaceObjects} from '../src/place_acts.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {fresh,ctx,registry,I} from './lotm_helpers.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {castObjectCommands} from '../src/book_world_lotm_cast_host.js';
const pack={places:[{id:'fixture.place.tent',indexId:'lotm.place.fortune-tent'}],
 people:[{id:I.supervisor,indexId:'lotm.person.circus-fortune-teller'},{id:I.member,indexId:'lotm.person.animal-trainer-fortune-teller'}],
 host:{profile:{id:'lotm.early_tingen.local_probationer@1'}},
 bindings:{schedule:[I.supervisor,I.member].map(actor=>({actor,place:'fixture.place.tent',day:1,from:520,to:540,source:'canon',label:'S'}))}};
const situation='book.lotm.tingen.canon_beside';
const data=tentIncidentData(pack),commands=defineTentIncidentCommands(data,{worldId:I.world,group:'book_lotm',situationId:situation});
const defs=createSimulationRegistry({commands,situations:[{id:situation,revision:1,label:'Fixture circus',initialPhase:'present',phases:['present'],privateTruth:{role:'fixture'},context:{worldId:I.world,instanceId:'fixture.tent',continuityId:situation,eraId:'fixture.era',regionId:'fixture.region'},participants:['player']}]});
for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
castObjectCommands.push(...commands);
for(const [id,d] of defs.situations)registry.simulation.situations.set(id,d);
const context=p=>{const c=ctx(p,data.reader);return {...c,facts:{...c.facts,...tentIncidentFacts(p.state,data)}};};
let baseline;
const setup=(clock=TENT.open)=>{if(!baseline){let p=fresh(10);p.state.lotm.initializedAt=0;for(const id of ['player',data.reader,data.trainer])p.state.simulation.people[id].location=data.place;applySituationEffect(p.state,{type:'situation',situationId:situation,operation:'begin'},registry.simulation,'fixture.tent');seedPlaceObjects(p.state,data,I.world);baseline=jump(p,TENT.open);}return jump(structuredClone(baseline),clock);};
const keep=(p,out)=>({...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay});
function jump(p,clock){const c=context(p);return keep(p,advanceSimulation(p.state,registry,clock-p.state.clock,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}}));}
const start=(p,id)=>keep(p,commitSimulationCommand(p.state,registry,{id:TENT_COMMANDS[id]},context(p)));
function advance(p,minutes){for(let i=0;i<minutes;i++){const c=context(p);p=keep(p,advanceSimulation(p.state,registry,1,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}}));}return p;}
const finish=(p,id)=>advance(start(p,id),registry.simulation.commands.get(TENT_COMMANDS[id]).duration);

test('both seats share the clock, while a local gains no Klein card or private thought',()=>{
 let local=finish(setup(),'watch');
 assert.equal(local.state.clock,525);assert.equal(tentIncidentFacts(local.state,data)['tent.witness'],true);
 assert.equal(local.state.simulation.knowledge.player['book.lotm.excursion.reading.seen'],undefined);
 assert.equal(Object.values(local.state.simulation.knowledge.player).some(k=>/Roselle|The Fool|transmigrat/.test(k.value)),false);
 const be=setup();be.state.lotm.entryProfile='book.lead.be@1';be.state.actors.player.completed['book.lotm.excursion.reading']=1;
 assert.equal(tentIncidentFacts(be.state,data)['tent.witness'],true);
 assert.equal(tentIncidentView(local.state,data).sharedClock.open,tentIncidentView(be.state,data).sharedClock.open);
});

test('calm response changes actual regard and next-day inquiry cost; work pays from finite custody',()=>{
 let p=finish(finish(setup(),'watch'),'clarify');
 assert.equal(p.state.simulation.relationships[data.reader].player.axes.trust,1);
 assert.equal(tentIncidentFacts(p.state,data)['tent.trusted'],true);
 p=jump(p,TENT.nextDay);
 p=finish(p,'referral');assert.equal(p.state.clock,TENT.nextDay+TENT.referralMinutes);
 assert.throws(()=>start(p,'inquire'));
 p=start(p,'flyers');assert.equal(p.state.actors[data.reader].resources['book.lotm.tent.purse'],0);
 const stopped=keep(p,cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,context(p)));
 assert.equal(stopped.state.actors[data.reader].resources['book.lotm.tent.purse'],2);assert.equal(stopped.external.money,10);
 p=finish(stopped,'flyers');assert.equal(p.external.money,12);assert.equal(p.state.actors[data.reader].resources['book.lotm.tent.purse'],0);
 assert.throws(()=>start(p,'flyers'));assert.throws(()=>start(p,'referral'));
 const reloaded=JSON.parse(JSON.stringify(p));assert.equal(tentIncidentFacts(reloaded.state,data)['tent.paid'],true);
});

test('an hour elsewhere grants nothing; ordinary next-day inquiry remains independently reachable',()=>{
 let p=setup();p.state.simulation.people.player.location='fixture.place.away';p=advance(p,60);
 assert.equal(p.state.simulation.people.player.location,'fixture.place.away');assert.equal(tentIncidentView(p.state,data),null);
 p.state.simulation.people.player.location=data.place;
 assert.equal(tentIncidentFacts(p.state,data)['tent.witness'],false);assert.match(tentIncidentView(p.state,data).status,/without your involvement/);
 assert.throws(()=>start(p,'watch'));assert.throws(()=>start(p,'clarify'));
 p=jump(p,TENT.nextDay);p=finish(p,'inquire');assert.equal(p.state.clock,TENT.nextDay+TENT.inquiryMinutes);
 p=finish(p,'flyers');assert.equal(p.external.money,12);
 assert.equal(p.state.simulation.relationships[data.reader]?.player,undefined);
});

test('closing boundaries reject late starts, retain an on-time finish, and stop advertising yesterday',()=>{
 let p=finish(setup(),'watch');p=jump(p,TENT.close-1-TENT.clarifyMinutes);p=finish(p,'clarify');
 assert.equal(p.state.clock,TENT.close-1);assert.equal(tentIncidentFacts(p.state,data)['tent.trusted'],true);
 assert.throws(()=>start(setup(TENT.close),'watch'));
 p=setup(TENT.workClose+1);assert.match(tentIncidentView(p.state,data).status,/work day has ended/);
 assert.throws(()=>start(p,'inquire'));
});

test('reader absence blocks the same displayed contact and returns pending pay without remote work',()=>{
 let p=setup(TENT.nextDay);p.state.simulation.people[data.reader].location='fixture.place.away';
 assert.equal(tentIncidentView(p.state,data).readerPresent,false);assert.throws(()=>start(p,'inquire'));
 p.state.simulation.people[data.reader].location=data.place;p=finish(p,'inquire');p=start(p,'flyers');
 p.state.simulation.people[data.reader].location='fixture.place.away';p=advance(p,TENT.workMinutes);
 assert.equal(p.external.money,10);assert.equal(p.state.actors[data.reader].resources['book.lotm.tent.purse'],2);
 assert.equal(tentIncidentFacts(p.state,data)['tent.paid'],false);
 const absent=setup(TENT.close);assert.equal(tentIncidentView(absent.state,data).readerPresent,false,'a stale body at the tent is not scheduled presence');
 assert.match(tentIncidentView(absent.state,data).status,/exchange has ended without your involvement/);
});

test('stopping the first encounter leaves no observation or regard and no pack fabricates an incident',()=>{
 let p=start(setup(),'watch');p=advance(p,2);p=keep(p,cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,context(p)));
 assert.equal(tentIncidentFacts(p.state,data)['tent.witness'],false);assert.equal(p.state.simulation.relationships[data.reader]?.player,undefined);
 assert.equal(tentIncidentData(null),null);assert.equal(tentIncidentData({places:[],people:[]}),null);
});
