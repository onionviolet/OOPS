import {planProcessedMaterial} from '../src/material_lineage.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,validateExpansionState} from '../src/expansion_engine.js';
import {expeditionRegistry as registry,initializeExpedition} from '../src/expedition_content.js';
import {createSimulationState} from '../src/simulation_contracts.js';
import {registerMistglassNative,stageMistglassTravel,stageMistglassTeaching,mistglassContext,stageMistglassMethod,stageMistglassAdvance,mistglassReserve,validateMistglassEnvelope} from '../src/absorb_p23/host_joins/world_adaptation.js';
import {quotePathWork} from '../src/mistglass_path_work.js';
registerMistglassNative(registry);
const native={body:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player'},alive:true,location:'p23.mistglass.conservatory'};
const dose='{"id":"p23.mistglass.dose"}',pelt='{"id":"Rat pelt"}';
function setup(method){const state=initializeExpedition(createExpansionState(17));state.simulation={...createSimulationState(17),enrolledAt:0};state.simulation.people.player={life:'alive',inventory:'native',location:'Village',bornAt:0};state.sequence++;
 const p={state,external:{money:20},gameplay:{player:{inventory:{[pelt]:4,[dose]:3},skills:{},reputation:{Village:0}}}};stageMistglassTravel(p,'enter');stageMistglassTeaching(p,mistglassContext(state,native),registry);stageMistglassMethod(p,mistglassContext(state,native),registry,method);return p;}
const ctx=p=>mistglassContext(p.state,native),act=(p,id)=>stageMistglassMethod(p,ctx(p),registry,'path:'+id);
function advance(p,n){const c=ctx(p);p.state.clock+=n;stageMistglassAdvance(p,c,registry);}
test('W4 distinct conversion inputs, compatible expenditure and practiced quality use native energy and exact material lots',()=>{
 for(const [method,technique,quality]of [['breath','cut',65],['settling','set',70]]){
  const p=setup(method);advance(p,14);assert.equal(quotePathWork(p.state.worldAdaptation,ctx(p),mistglassReserve(p.state),{[pelt]:4},'prepare').eligible,method==='breath');
  const before=mistglassReserve(p.state);act(p,'prepare');assert.equal(mistglassReserve(p.state),before-1000);assert.equal(p.gameplay.player.inventory[dose],method==='breath'?3:2);
  assert.throws(()=>act(p,method==='breath'?'set':'cut'),/own technique/);assert.throws(()=>stageMistglassMethod(p,ctx(p),registry,'mist'),/preparation/);
  advance(p,2);act(p,technique);assert.equal(p.state.worldAdaptation.pathWork.last.quality,quality,'control frozen at preparation, not later practice');
  advance(p,12);act(p,'prepare');act(p,technique);assert.equal(p.state.worldAdaptation.pathWork.last.quality,quality+20,'practice changes actual material quality');
  assert.equal(p.state.worldAdaptation.pathWork.completed,2);assert.equal(p.gameplay.player.inventory[pelt],2);validateExpansionState(p.state,registry);validateMistglassEnvelope({expansion:p.state,'current location':native.location});
  const saved=JSON.parse(JSON.stringify(p));assert.deepEqual(saved.state.worldAdaptation,p.state.worldAdaptation);
 }
});
test('W4 prepared work and native reserve stay bound and inert across foreign world or actual body replacement',()=>{
 const p=setup('breath');advance(p,16);act(p,'prepare');const frozen=structuredClone(p.state.worldAdaptation.pathWork),reserve=mistglassReserve(p.state);
 stageMistglassTravel(p,'exit');const outside=mistglassContext(p.state,{...native,location:'Village'});p.state.clock+=8;stageMistglassAdvance(p,outside,registry);assert.equal(mistglassReserve(p.state),reserve);assert.deepEqual(p.state.worldAdaptation.pathWork,frozen);
 assert.throws(()=>stageMistglassMethod(p,outside,registry,'path:cut'),/enrolled body/);
 p.state.simulation.people.player.body={...native.body,id:'native.player.replacement'};validateMistglassEnvelope({expansion:p.state,'current location':'Village'});
 const changed=mistglassContext(p.state,{...native,body:p.state.simulation.people.player.body,location:'Village'});assert.equal(quotePathWork(p.state.worldAdaptation,changed,reserve,p.gameplay.player.inventory,'cut').eligible,false);
});

test('W4 precision preserves dated source chronology through the native material clock',()=>{
 const p=setup('breath');advance(p,14);
 const lot=planProcessedMaterial({stock:{[pelt]:1},inputs:[{item_key:pelt,count:1}],sourceFacts:{[pelt]:{born:1000}},output:{id:'Rat pelt',family:'animal-hide',count:1},process:{id:'dated.source',revision:1,at:1000,world_id:'base.frontier',parameters:{}}}).item_key;
 act(p,'prepare');const context={...ctx(p),materialClock:1014},q=quotePathWork(p.state.worldAdaptation,context,mistglassReserve(p.state),{[lot]:1},'cut');assert.equal(q.eligible,true);assert.equal(JSON.parse(q.receive[0].key).lineage.history.at(-1).at,1014);
});
