import test from 'node:test';
import assert from 'node:assert/strict';
import {placeActSequenceView,sequenceOffers} from '../src/place_act_sequence.js';
import {definePlaceActs,seedPlaceObjects} from '../src/place_acts.js';
import {fresh,ctx,wait,registry,I} from './lotm_helpers.js';
import {createSimulationRegistry,validateSimulationState} from '../src/simulation_contracts.js';
import {applySituationEffect} from '../src/causal_situations.js';
import {previewSimulationCommand,commitSimulationCommand} from '../src/simulation.js';
const room='fixture.sequence.room';
const data={objects:[{id:'fixture.sequence.stock',resources:[{actor:'player',key:'fixture.sequence.paper',amount:1}],facts:{'fixture.sequence.present':true}}],
 acts:[{id:'fixture.sequence.read',operation:'read',place:room,minutes:2,label:'Read the page',description:'Inspect the accessible page.',report:'You remember its directions.',knowledgeKey:'fixture.sequence.memory',requires:{fact:'world.fixture.sequence.present',op:'eq',value:true}},
 {id:'fixture.sequence.use',operation:'use',place:room,minutes:1,label:'Use the directions',description:'Use the learned directions with one sheet.',report:'You have a folded paper guide.',knowledgeKey:'fixture.sequence.result',costs:[{type:'resource',actor:'player',key:'fixture.sequence.paper',amount:-1}]}],
 sequence:{id:'fixture.sequence',title:'A small task',stages:[{commandId:'fixture.sequence.read',label:'Read the page'},{commandId:'fixture.sequence.use',label:'Use the directions'}],conclusion:'The guide is ready.'}};
const commands=definePlaceActs(data,{worldId:I.world,group:'book_lotm',situationId:I.situation});
for(const [id,d] of createSimulationRegistry({commands}).commands)registry.simulation.commands.set(id,d);
function setup(){const p=fresh();applySituationEffect(p.state,{type:'situation',situationId:I.situation,operation:'begin'},registry.simulation,'fixture.begin');p.state.simulation.people.player.location=room;seedPlaceObjects(p.state,data,I.world);return p;}
const start=(p,id)=>({...p,...commitSimulationCommand(p.state,registry,{id},ctx(p))});
test('native guards refuse skipping before payment and progress follows committed knowledge, not preview',()=>{
 let p=setup();const before=JSON.stringify(p);
 assert.equal(placeActSequenceView(p.state,data).next.id,'fixture.sequence.read');
 assert.equal(previewSimulationCommand(p.state,registry,'fixture.sequence.use',ctx(p)).eligible,false);
 assert.throws(()=>start(p,'fixture.sequence.use'));assert.equal(JSON.stringify(p),before);
 p=start(p,'fixture.sequence.read');assert.equal(placeActSequenceView(p.state,data).completed,0);
 p=wait(p,2);assert.equal(placeActSequenceView(p.state,data).next.id,'fixture.sequence.use');
 p.state.worlds[I.world].facts['fixture.sequence.present']=false;
 assert.equal(p.state.simulation.knowledge.player['fixture.sequence.memory'].value,'You remember its directions.');
 p=start(p,'fixture.sequence.use');p=wait(p,1);
 assert.equal(p.state.actors.player.resources['fixture.sequence.paper'],0);
 assert.equal(placeActSequenceView(p.state,data).done,true);
 assert.throws(()=>start(p,'fixture.sequence.use'));
 const restored=JSON.parse(JSON.stringify(p));validateSimulationState(restored.state.simulation,restored.state,registry.simulation);
 assert.equal(placeActSequenceView(restored.state,data).done,true);
 assert.equal(seedPlaceObjects(restored.state,data,I.world),false);assert.equal(restored.state.actors.player.resources['fixture.sequence.paper'],0);
});
test('lost physical support aborts the first stage without granting memory or advancing the sequence',()=>{
 let p=start(setup(),'fixture.sequence.read');p.state.worlds[I.world].facts['fixture.sequence.present']=false;p=wait(p,2);
 assert.equal(placeActSequenceView(p.state,data).completed,0);assert.equal(p.state.simulation.jobs.length,0);
 assert.equal(sequenceOffers(p.state,data,commands).length,1);
});
test('malformed sequence references and duplicates fail compilation; absent sequence preserves ordinary offers',()=>{
 const bad=structuredClone(data);bad.sequence.stages[1].commandId='fixture.missing';assert.throws(()=>definePlaceActs(bad,{worldId:I.world,group:'book_lotm',situationId:I.situation}));
 bad.sequence.stages[1].commandId=bad.sequence.stages[0].commandId;assert.throws(()=>placeActSequenceView(setup().state,bad));
 assert.equal(placeActSequenceView({},{}),null);assert.equal(sequenceOffers({}, {},commands),commands);
});

test('a local dawn guard remains available to native completion contexts without UI hour facts',()=>{
 const rows=structuredClone(data);rows.acts[0].id='fixture.sequence.dawn';rows.acts[0].knowledgeKey='fixture.sequence.dawn.seen';rows.acts[0].requires={fact:'lotm.elapsed',op:'gte',value:360};delete rows.sequence;
 const command=definePlaceActs({acts:[rows.acts[0]]},{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(command.id,command);
 let p=setup();p.state.lotm.initializedAt=p.state.clock;assert.equal(previewSimulationCommand(p.state,registry,command.id,ctx(p)).eligible,false);
 p=wait(p,360);p=start(p,command.id);p=wait(p,2);assert.ok(p.state.simulation.knowledge.player['fixture.sequence.dawn.seen']);
});

test('an in-flight stage resumes from saved native work without granting its receipt early',()=>{
 let p=start(setup(),'fixture.sequence.read');
 p=JSON.parse(JSON.stringify(p));validateSimulationState(p.state.simulation,p.state,registry.simulation);
 assert.equal(placeActSequenceView(p.state,data).completed,0);assert.equal(p.state.simulation.jobs.length,1);
 p=wait(p,2);assert.equal(placeActSequenceView(p.state,data).completed,1);assert.equal(p.state.simulation.jobs.length,0);
 assert.throws(()=>start(p,'fixture.sequence.read'));
});

test('loss of recalled evidence does not undo a completed physical stage or expose its erased report',()=>{
 let p=start(setup(),'fixture.sequence.read');p=wait(p,2);delete p.state.simulation.knowledge.player['fixture.sequence.memory'];
 const view=placeActSequenceView(p.state,data);assert.equal(view.completed,1);assert.equal(view.aftermath,null);assert.equal(view.next.id,'fixture.sequence.use');
 assert.equal(sequenceOffers(p.state,data,commands)[0].id,'fixture.sequence.use');
 assert.equal(previewSimulationCommand(p.state,registry,'fixture.sequence.use',ctx(p)).eligible,true);
 assert.throws(()=>start(p,'fixture.sequence.read'));
});

test('an authored interaction uses the actual participant and loses support if that body leaves',()=>{
 const row={...data.acts[0],id:'fixture.sequence.participant',knowledgeKey:'fixture.sequence.participant.seen',targetId:I.supervisor};
 const command=definePlaceActs({acts:[row]},{worldId:I.world,group:'book_lotm',situationId:I.situation})[0];registry.simulation.commands.set(command.id,command);
 let p=setup();assert.equal(previewSimulationCommand(p.state,registry,row.id,ctx(p,I.supervisor)).eligible,false);
 p.state.simulation.people[I.supervisor].location=room;assert.equal(previewSimulationCommand(p.state,registry,row.id,ctx(p,I.supervisor)).eligible,true);
 p={...p,...commitSimulationCommand(p.state,registry,{id:row.id},ctx(p,I.supervisor))};p.state.simulation.people[I.supervisor].location='fixture.sequence.away';p=wait(p,2);
 assert.equal(p.state.simulation.knowledge.player?.[row.knowledgeKey],undefined);assert.equal(p.state.simulation.jobs.length,0);
});

test('the opening in another world does not receive the Village shower event',()=>{
 let p=setup();p=wait(p,20);
 assert.equal(Object.values(p.state.simulation.events).some(e=>e.definitionId==='village.shower'),false);
});
