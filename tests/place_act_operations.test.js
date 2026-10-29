import test from 'node:test';
import assert from 'node:assert/strict';
import {definePlaceActs,seedPlaceObjects,quotePlaceActs} from '../src/place_acts.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
const room='fixture.room';
const eq=(key,value)=>({fact:key,op:'eq',value,reason:'The required means are missing.'});
const resource=(key,amount)=>({type:'resource',actor:'player',key,amount});
const data={objects:[{id:'fixture.stock',resources:[{actor:'player',key:'fixture.grain',amount:2},{actor:'player',key:'fixture.meal',amount:0}],
 facts:{'fixture.lamp':true,'fixture.clock':'07:15','fixture.custody':'hand','fixture.concealed':false},
 actorFacts:[{actor:'player',key:'fixture.owned',value:true},{actor:'player',key:'fixture.awake',value:false}]}],acts:[]};
const specifics={read:{requires:eq('world.fixture.lamp',true)},prepare:{costs:[resource('fixture.grain',-1)],effects:[resource('fixture.meal',1)]},
 wake:{awakeFact:'fixture.awake'},'check time':{clock:{fact:'fixture.clock',value:'07:15'}},sit:{restFact:'fixture.rested'},settle:{restFact:'fixture.settled'},
 secure:{objectId:'fixture.stock',secure:{ownedFact:'fixture.owned',custodyFact:'fixture.custody',concealedFact:'fixture.concealed',container:'fixture.drawer'}},'wait here':{requires:eq('world.fixture.lamp',true)}};
for(const [i,[operation,extra]] of Object.entries(specifics).entries())data.acts.push({id:`fixture.act.${i}`,operation,place:room,minutes:2,label:operation,description:`${operation} at the table.`,report:`You finish: ${operation}.`,knowledgeKey:`fixture.receipt.${i}`,...extra});
const binding={worldId:I.world,group:'book_lotm',situationId:I.situation};
const commands=definePlaceActs(data,binding);
for(const [id,d] of createSimulationRegistry({commands}).commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh();applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=room;seedPlaceObjects(p.state,data,I.world);return p;}
const row=op=>data.acts.find(r=>r.operation===op);
const start=(p,op)=>({...p,...commitSimulationCommand(p.state,registry,{id:row(op).id},ctx(p),p.state.sequence)});
const preview=(p,op)=>previewSimulationCommand(p.state,registry,row(op).id,ctx(p));
test('new operations quote without mutation and settle through existing time, stock, fact and knowledge owners',()=>{
 let p=setup();
 for(const op of Object.keys(specifics)){
  const before=JSON.stringify(p),q=preview(p,op);assert.equal(q.eligible,true,q.reasons.join(' '));assert.equal(q.duration,2);assert.equal(JSON.stringify(p),before);
  const offers=quotePlaceActs(p.state,commands,data,d=>previewSimulationCommand(p.state,registry,d.id,ctx(p)));
  assert.match(offers.find(o=>o.id===row(op).id).label,/2 min/);
  const clock=p.state.clock;p=start(p,op);assert.equal(p.state.simulation.knowledge.player?.[row(op).knowledgeKey],undefined);
  p=wait(p,2);assert.equal(p.state.clock,clock+2);
  const k=p.state.simulation.knowledge.player[row(op).knowledgeKey];assert.equal(k.value,row(op).report);assert.equal(k.basis.kind,'observation');
 }
 assert.equal(p.state.actors.player.resources['fixture.grain'],1);assert.equal(p.state.actors.player.resources['fixture.meal'],1);
 for(const key of ['awake','rested','settled'])assert.equal(p.state.actors.player.facts[`fixture.${key}`],true);
 assert.equal(p.state.worlds[I.world].facts['fixture.custody'],'fixture.drawer');assert.equal(p.state.worlds[I.world].facts['fixture.concealed'],true);
 assert.equal(p.state.simulation.knowledge.player[`${row('check time').knowledgeKey}.display`].value,'07:15');
 const dependent={...row('read'),id:'fixture.concealment.consumer',requires:eq('world.fixture.concealed',true)};
 registry.simulation.commands.set(dependent.id,definePlaceActs({acts:[dependent]},binding)[0]);
 assert.equal(previewSimulationCommand(p.state,registry,dependent.id,ctx(p)).eligible,true);
 const reloaded=JSON.parse(JSON.stringify(p));validateSimulationState(reloaded.state.simulation,reloaded.state,registry.simulation);
 assert.equal(seedPlaceObjects(reloaded.state,data,I.world),false);assert.equal(reloaded.state.actors.player.resources['fixture.grain'],1);
});
test('missing lamp, stale display, empty stock, unknown sleep state and missing custody refuse without mutation',()=>{
 for(const op of ['read','prepare','wake','check time','secure']){
  const p=setup();
  if(op==='read')p.state.worlds[I.world].facts['fixture.lamp']=false;
  if(op==='prepare')p.state.actors.player.resources['fixture.grain']=0;
  if(op==='wake')delete p.state.actors.player.facts['fixture.awake'];
  if(op==='check time')p.state.worlds[I.world].facts['fixture.clock']='07:16';
  if(op==='secure')p.state.actors.player.facts['fixture.owned']=false;
  const before=JSON.stringify(p),q=preview(p,op);assert.equal(q.eligible,false);assert.ok(q.reasons.length);assert.throws(()=>start(p,op));assert.equal(JSON.stringify(p),before);
 }
});
test('short waits interrupt on lost support and preparation cancellation refunds reserved stock',()=>{
 let p=start(setup(),'wait here');p.state.worlds[I.world].facts['fixture.lamp']=false;p=wait(p,2);
 assert.equal(p.state.simulation.knowledge.player?.[row('wait here').knowledgeKey],undefined);assert.equal(p.state.simulation.jobs.length,0);
 p=start(setup(),'prepare');assert.equal(p.state.actors.player.resources['fixture.grain'],1);
 const job=p.state.simulation.jobs.find(j=>j.commandId===row('prepare').id);
 const cancelled=cancelSimulationJob(p.state,registry,job.id,ctx(p));p={...p,...cancelled};
 assert.equal(p.state.actors.player.resources['fixture.grain'],2);assert.equal(p.state.actors.player.resources['fixture.meal'],0);
});
test('operation registry refuses invented preparation stock and incomplete clock or custody mechanisms',()=>{
 for(const op of ['prepare','check time','secure'])assert.throws(()=>definePlaceActs({acts:[{...row(op),costs:[],effects:[],clock:null,secure:null}]},binding));
 const missing=structuredClone(data);missing.objects[0].resources=[];assert.throws(()=>definePlaceActs(missing,binding),/seeded/);
 assert.throws(()=>definePlaceActs({acts:[{...row('read'),operation:'constructor'}]},binding),/operation/);
});
