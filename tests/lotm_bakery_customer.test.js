import test from 'node:test';
import assert from 'node:assert/strict';
import {bakeryCustomerPack,bakeryCustomerFacts,bakeryCustomerHere,settleBakeryCustomer,BAKERY_CUSTOMER as C} from '../src/lotm_bakery_customer.js';
import {tentIncidentData,tentIncidentFacts,defineTentIncidentCommands,tentIncidentView} from '../src/lotm_tent_incident.js';
import {CIRCUS_NOTICE as N} from '../src/lotm_circus_notice.js';
import {compileCastSchedule} from '../src/cast_schedule.js';
import {castCalendar} from '../src/lotm_cast_calendar.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {createSimulationRegistry} from '../src/simulation_contracts.js';
import {commitSimulationCommand,previewSimulationCommand} from '../src/simulation.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {fresh,ctx,registry,I} from './lotm_helpers.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {castObjectCommands} from '../src/book_world_lotm_cast_host.js';
const bakery='fixture.place.bakery',tent='fixture.place.tent',square='fixture.place.square',local='lotm.early_tingen.local_probationer@1',situation='book.lotm.tingen.canon_beside';
const pack=bakeryCustomerPack({places:[{id:bakery,indexId:'lotm.place.sline-bakery'},{id:tent,indexId:'lotm.place.fortune-tent'},{id:square,indexId:'lotm.place.civic-square'}],
 people:[{id:I.supervisor,indexId:'lotm.person.circus-fortune-teller'},{id:I.member,indexId:'lotm.person.animal-trainer-fortune-teller'},{id:I.stormOfficer,indexId:'lotm.person.wendy-sline'}],
 host:{profile:{id:local}},bindings:{schedule:[{actor:I.stormOfficer,place:bakery,day:2,from:420,to:720,source:'fill',label:'I'}]}});
const data=tentIncidentData(pack),schedule=compileCastSchedule(data.customer.schedule);
const commands=defineTentIncidentCommands(data,{worldId:I.world,group:'book_lotm',situationId:situation});
const defs=createSimulationRegistry({commands,situations:[{id:situation,revision:1,label:'Fixture bakery',initialPhase:'present',phases:['present'],privateTruth:{role:'fixture'},context:{worldId:I.world,instanceId:'fixture.bakery',continuityId:situation,eraId:'fixture.era',regionId:'fixture.region'},participants:['player']}]});
for(const [id,d] of defs.commands)registry.simulation.commands.set(id,d);
for(const [id,d] of defs.situations)registry.simulation.situations.set(id,d);
castObjectCommands.push(...commands);
function sync(p){const place=schedule.whereabouts(C.id,castCalendar(p.state)).place;if(place)p.state.simulation.people[C.id].location=place;
 settleBakeryCustomer(p.state,data.customer,(effects,cause)=>applySimulationEffects(p,effects,{actorId:'player',worldId:I.world},null,cause));return p;}
let baseline;
function setup({posted=false,away=false,minute=C.from}={}){
 if(!baseline){let first=fresh(10);first.state.lotm.entryProfile=local;first.state.lotm.initializedAt=0;
  const c=ctx(first);baseline=keep(first,advanceSimulation(first.state,registry,1440+C.from,first.external,first.gameplay,{player:{...c,vitals:c.vitals.player}}));}
 let p=structuredClone(baseline);
 if(minute>C.from){const c=ctx(p);p=keep(p,advanceSimulation(p.state,registry,minute-C.from,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}}));}
 p.state.simulation.people[C.id]=structuredClone(p.state.simulation.people[I.member]);p.state.actors[C.id]=structuredClone(p.state.actors[I.member]);
 p.state.simulation.people.player.location=away?tent:bakery;p.state.simulation.people[I.stormOfficer].location=bakery;
 p.state.actors[I.stormOfficer].resources[N.posted]=posted?1:0;p.state.actors.player.facts['book.lotm.tent.hired']=true;
 applySituationEffect(p.state,{type:'situation',situationId:situation,operation:'begin'},registry.simulation,'fixture.bakery');return sync(p);}
const knows=(p,id,key)=>p.state.simulation.knowledge[id]?.[key];
const context=(p)=>{const c=ctx(p,C.id);return {...c,facts:{...c.facts,...tentIncidentFacts(p.state,data)}};};
const keep=(p,out)=>({...p,state:out.state,external:out.external??p.external,gameplay:out.gameplay??p.gameplay});
const start=(p,id=C.answer)=>keep(p,commitSimulationCommand(p.state,registry,{id},context(p)));
function step(p){p=keep(p,advanceSimulation(p.state,registry,1,p.external,p.gameplay,{player:{...context(p),vitals:context(p).vitals.player}}));return sync(p);}
test('bread errand happens without any posted notice, without circus knowledge or rewards',()=>{
 const p=setup();assert.equal(bakeryCustomerHere(p.state,data.customer),true);assert.ok(knows(p,C.id,C.visit));assert.equal(knows(p,C.id,C.read),undefined);
 assert.equal(bakeryCustomerFacts(p.state,data.customer)['bakery.customer.interested'],false);assert.match(tentIncidentView(p.state,data).status,/wraps his bread/);assert.equal(p.external.money,10);
});
test('a reserved walking destination does not grant a witness before arrival',()=>{
 const p=setup();
 p.state.actors[I.stormOfficer].resources[N.posted]=1;
 p.state.simulation.jobs.push({actorId:'player',commandId:'book.lotm.cast_walk_tent_bakery',due:p.state.clock+1});
 sync(p);
 assert.ok(knows(p,C.id,C.read));
 assert.equal(knows(p,'player',C.read+'.witness'),undefined);
 assert.doesNotMatch(tentIncidentView(p.state,data).status,/Edwin/);
 assert.equal(bakeryCustomerFacts(p.state,data.customer)['bakery.customer.interested'],false);
 p.state.simulation.jobs.pop();
 sync(p);
 assert.equal(knows(p,'player',C.read+'.witness'),undefined);
 assert.equal(bakeryCustomerFacts(p.state,data.customer)['bakery.customer.interested'],true);
});
test('physical notice teaches Edwin and the optional answer gives the actual enquiry route',()=>{
 let p=setup({posted:true});assert.ok(knows(p,C.id,C.read));assert.ok(knows(p,'player',C.read+'.witness'));
 assert.match(tentIncidentView(p.state,data).status,/Perhaps I should ask/);
 assert.equal(previewSimulationCommand(p.state,registry,C.answer,context(p)).visible,true);
 p=step(start(p));assert.match(knows(p,C.id,C.directions).value,/asked the reader at the circus tent/);assert.equal(p.state.simulation.relationships[C.id]?.player,undefined);
 assert.match(tentIncidentView(p.state,data).status,/already told him/);assert.doesNotMatch(tentIncidentView(p.state,data).status,/Perhaps I should ask/);
 assert.equal(previewSimulationCommand(p.state,registry,C.answer,context(p)).visible,false,'spent directions action retires');
 const again=JSON.stringify(p);sync(p);assert.equal(JSON.stringify(p),again);p=JSON.parse(JSON.stringify(p));assert.ok(knows(p,C.id,C.directions));
});
test('Edwin reads while player is away; later arrival discovers his question without gaining a past witness',()=>{
 const p=setup({posted:true,away:true});assert.ok(knows(p,C.id,C.read));assert.equal(knows(p,'player',C.read+'.witness'),undefined);
 p.state.clock+=3;p.state.simulation.people.player.location=bakery;sync(p);assert.equal(knows(p,'player',C.read+'.witness'),undefined);
 assert.match(tentIncidentView(p.state,data).status,/Perhaps I should ask/);assert.equal(bakeryCustomerFacts(p.state,data.customer)['bakery.customer.interested'],true);
});
test('late visit grants no invented past reading and a posting flag without paper teaches nothing',()=>{
 let p=setup({posted:true,minute:C.to+10});assert.equal(knows(p,C.id,C.read),undefined);assert.equal(bakeryCustomerHere(p.state,data.customer),false);assert.throws(()=>start(p));
 p=setup();p.state.actors.player.facts[N.posted]=true;sync(p);assert.equal(knows(p,C.id,C.read),undefined);
 p.state.actors[I.stormOfficer].resources[N.posted]=1;sync(p);assert.ok(knows(p,C.id,C.read),'a real paper posted during the stop is read');
});
test('early departure and too-late answers give Edwin no directions; uninformed worker cannot answer',()=>{
 let p=setup({posted:true});p=start(p);p.state.simulation.people[C.id].location=tent;p=step(p);assert.equal(knows(p,C.id,C.directions),undefined);
 p=setup({posted:true,minute:C.to-1});assert.throws(()=>start(p));
 p=setup({posted:true});delete p.state.actors.player.facts['book.lotm.tent.hired'];assert.throws(()=>start(p));
});
test('away reader can be met at his next stop without giving the player a past witness',()=>{
 let p=setup({posted:true,away:true});for(let i=0;i<15;i++)p=step(p);
 assert.equal(p.state.simulation.people[C.id].location,square);p.state.simulation.people.player.location=square;
 const scene=tentIncidentView(p.state,data);assert.equal(scene.title,'At Municipal Square');assert.match(scene.status,/leave the square at 10:00/);assert.match(scene.status,/notice at the bakery/);
 assert.equal(knows(p,'player',C.read+'.witness'),undefined);assert.throws(()=>start(p),'bakery action remains physically bound');
 p=step(start(p,C.answerSquare));assert.ok(knows(p,C.id,C.directions));assert.equal(knows(p,'player',C.read+'.witness'),undefined);
 assert.match(tentIncidentView(p.state,data).status,/already told him/);assert.doesNotMatch(tentIncidentView(p.state,data).status,/Perhaps I should ask/);
 assert.equal(previewSimulationCommand(p.state,registry,C.answerSquare,context(p)).visible,false);
 assert.equal(bakeryCustomerFacts(p.state,data.customer)['bakery.customer.answered'],true,'both places read one answer record');
});
test('late square body cannot imply indefinite presence or answer after departure',()=>{
 let p=setup({posted:true,away:true});for(let i=0;i<C.squareUntil-C.from-1;i++)p=step(p);
 p.state.simulation.people.player.location=square;assert.throws(()=>start(p,C.answerSquare),'last-minute answer cannot finish before departure');
 p=step(p);assert.equal(p.state.simulation.people[C.id].location,square,'fixture retains stale saved body');
 assert.equal(tentIncidentView(p.state,data),null);assert.equal(bakeryCustomerFacts(p.state,data.customer)['bakery.customer.here'],false);assert.throws(()=>start(p,C.answerSquare));
 assert.equal(knows(p,C.id,C.directions),undefined);
});
