import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewSimulationCommand,cancelSimulationJob,simulationOccupiesActor} from '../src/simulation.js';
import {knownPeopleView} from '../src/people_knowledge.js';
import {createFieldFixture,joinField,fieldCommand,fieldAdvance,fieldContext,fieldReload,wood,kit} from '../scripts/field_fixtures.mjs';
const id=x=>`party.lp6.${x}`;
const run=(p,x,location='Village')=>fieldCommand(p,id(x),location,{targetId:['ask','help','decline','pack_shared'].includes(x)?'partyPartner':null});
const view=(p,x,location='Village')=>previewSimulationCommand(p.state,registry,id(x),{...fieldContext(p,location),targetId:['ask','help','decline','pack_shared'].includes(x)?'partyPartner':null});
const setup=()=>{let p=joinField(createFieldFixture());p=fieldCommand(p,'party.meet');p=fieldAdvance(fieldCommand(p,'party.prepare'),3);return run(p,'ask');};
const helped=()=>fieldAdvance(run(setup(),'help'),3);

test('LP6 absent state stays absent and no unintroduced partner is disclosed',()=>{
 const p=joinField(createFieldFixture()),before=structuredClone(p.state);
 assert.equal(view(p,'ask').visible,false);assert.throws(()=>run(p,'ask'));assert.equal(knownPeopleView(p.state).some(x=>x.id==='partyPartner'),false);
 assert.deepEqual(fieldReload(p).state,before);assert.ok(!Object.keys(p.state.actors.player.facts).some(k=>k.startsWith('party.lp6.')));
});
test('LP6 favor reserves real stock, person and site; completion earns a specific zero-XP memory',()=>{
 const p=setup(),before=structuredClone(p),pending=run(p,'help');
 assert.deepEqual(p,before);assert.equal(pending.gameplay.player.inventory[kit]||0,(p.gameplay.player.inventory[kit]||0)-1);
 assert.ok(simulationOccupiesActor(pending.state,'partyPartner'));assert.equal(view(pending,'ask').eligible,false);
 assert.deepEqual(fieldReload(pending),pending);
 const done=fieldAdvance(pending,3);assert.equal(done.state.actors.player.facts['party.lp6.history'],'helped');
 assert.equal(view(done,'pack_shared').eligible,true);assert.equal(view(done,'pack_solo').visible,false);
 assert.equal(done.state.simulation.relationships.player.partyPartner.axes.trust,0);
 assert.match(knownPeopleView(done.state).find(p=>p.id==='partyPartner').memories.at(-1).text,/real spare kit/);
});
test('LP6 helped and declined histories offer different useful paid packing, without touching ally on solo work',()=>{
 for(const history of ['helped','declined']){
  const p=history==='helped'?helped():run(setup(),'decline'),type=history==='helped'?'pack_shared':'pack_solo',duration=history==='helped'?2:3;
  const stock=p.gameplay.player.inventory[kit]||0,logs=p.gameplay.player.inventory[wood],ally=structuredClone(p.state.simulation.people.partyPartner);
  const pending=run(p,type),done=fieldAdvance(fieldReload(pending),duration);
  assert.equal(done.gameplay.player.inventory[kit],stock+1);assert.equal(done.gameplay.player.inventory[wood],logs-1);
  assert.equal(done.state.actors.player.facts['party.lp6.lastTask'],history==='helped'?'shared':'solo');
  assert.equal(done.state.simulation.people.partyPartner.vitals.stamina,ally.vitals.stamina-(history==='helped'?1:0));
  if(history==='declined')assert.deepEqual(done.state.simulation.people.partyPartner,ally);
  assert.equal(done.state.actors.player.facts['party.lp6.waiting'],false);assert.equal(view(done,type).eligible,false);
  const restored=fieldReload(done);assert.deepEqual(restored,done);assert.deepEqual(fieldAdvance(restored,0).state,done.state);
  assert.equal(view(run(done,'ask'),type).eligible,true);
 }
});
test('LP6 waits at its real Village boundary, rejects remote packing, and restores after return',()=>{
 const p=helped(),location=p.state.simulation.people.partyPartner.location;
 assert.equal(location,'Village');assert.equal(view(p,'pack_shared','Shack').eligible,false);assert.throws(()=>run(p,'pack_shared','Shack'));
 const restored=fieldReload(p);assert.equal(restored.state.simulation.people.partyPartner.location,'Village');assert.equal(view(restored,'pack_shared').eligible,true);
});
test('LP6 real re-rig reservation blocks and cancellation restores without a phantom favor',()=>{
 const p=setup(),pending=run(p,'help'),job=pending.state.simulation.jobs.find(j=>j.commandId===id('help'));
 assert.equal(view(pending,'decline').eligible,false);
 const cancelled=cancelSimulationJob(pending.state,registry,job.id,fieldContext(pending));
 assert.equal(cancelled.gameplay.player.inventory[kit],p.gameplay.player.inventory[kit]);assert.equal(cancelled.state.actors.player.facts['party.lp6.helped'],undefined);
 assert.equal(view(cancelled,'help').eligible,true);assert.equal(cancelled.state.simulation.sites['village.workbench'].reservations[job.id],undefined);
});
test('LP6 repeat inspection and decline cannot farm rewards, and a later real favor can repair a refusal',()=>{
 let p=run(setup(),'decline');const before=structuredClone(p);for(let i=0;i<3;i++)view(p,'pack_solo');assert.deepEqual(p,before);
 assert.throws(()=>run(p,'decline'));p=fieldAdvance(run(p,'help'),3);
 assert.equal(p.state.actors.player.facts['party.lp6.history'],'helped');assert.equal(view(p,'pack_shared').eligible,true);assert.equal(view(p,'pack_solo').visible,false);
 assert.equal(p.state.simulation.relationships.player.partyPartner.memories.length,2);
});
test('LP6 completion rechecks actual location and method and returns reserved inputs on support loss',()=>{
 for(const cause of ['location','method','body']){
  const p=helped(),stock=p.gameplay.player.inventory[kit]||0,logs=p.gameplay.player.inventory[wood],pending=run(p,'pack_shared');
  if(cause==='location')pending.state.simulation.people.partyPartner.location='Shack';
  if(cause==='method')pending.state.simulation.faculties.partyPartner['party.guard_control'].suppressed=true;
  if(cause==='body')pending.state.simulation.people.partyPartner.body.can_brace=false;
  const done=fieldAdvance(pending,2);assert.equal(done.gameplay.player.inventory[kit]||0,stock);assert.equal(done.gameplay.player.inventory[wood],logs);
  assert.equal(done.state.actors.player.facts['party.lp6.lastTask'],undefined);
 }
});
