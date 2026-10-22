import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteMender,MENDER_SOURCE} from '../src/material_apprentice.js';
import {quoteHideTreatment,treatmentOf,samePreparationQuote} from '../src/material_treatment.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {createSimulationState} from '../src/simulation_contracts.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {queryCapabilities} from '../src/capabilities.js';
import {loadNative} from './helpers/native_loader.mjs';
const pelt='{"id":"Rat pelt"}',log='{"id":"Rough wood log"}',oil='{"id":"Lamp oil"}';
test('W1 exact treatments feed real native tool carriers and advancement; alternatives remain useful',async()=>{
 const native=await loadNative(`import {item_templates,Tool} from './src/items.js';item_templates['Portable leatherworking kit']=new Tool({id:'Portable leatherworking kit',name:'Portable leatherworking kit',value:30,quality:100,equip_slot:'sickle'});export {getItemFromKey} from './src/items.js';`,{logLevel:'error'});
 const stock={[pelt]:9,[log]:2,[oil]:1};
 for(const treatment of ['smoked','oiled']){
  const prepared=quoteHideTreatment({treatmentId:treatment,inventory:stock,skillLevel:5,clock:1000,world:'base.frontier'}).receive[0].key;
  const state=initializeExpedition(createExpansionState(73));state.simulation={...createSimulationState(73),enrolledAt:0};state.simulation.people.player={life:'alive',inventory:'native',location:'Village',bornAt:0};
  const input={state,inventory:{[prepared]:3,[log]:1},world:'base.frontier',location:'Village',craftsmanHere:true,blocked:'',materialClock:1005,capability:0};
  assert.equal(quoteMender({...input,action:'tool'}).eligible,false);
  state.actors.player.facts['mender.methodsKnown']=true;state.actors.player.facts['mender.repairShift']=true;
  const q=quoteMender({...input,action:'tool'});assert.equal(q.eligible,true);const tool=q.receive[0].key;assert.equal(JSON.parse(tool).lineage.history.at(-1).at,1005,'Native material chronology uses its material clock, not elapsed expansion time');
  assert.equal(native.getItemFromKey(tool).getInventoryKey(),tool);assert.equal(native.getItemFromKey(tool).quality,treatment==='oiled'?80:60);
  const a=quoteMender({...input,action:'advance'});assert.equal(a.spend[0].count,treatment==='oiled'?1:2);
  const plan={state,gameplay:{player:{inventory:{},skills:{},reputation:{}}},external:{money:0},acquisitions:[],unlocks:[]};
  applySimulationEffects(plan,a.effects,{actorId:'player'},registry,'mender:1');assert.ok(state.actors.player.sources[MENDER_SOURCE]);
  const capability=queryCapabilities(state,registry,{actorId:'player'}, {})['frontier.fitted_repair'].value;
  const fine=quoteMender({...input,inventory:{[prepared]:1,[tool]:1},action:'fine',capability});assert.equal(fine.eligible,true);assert.equal(JSON.parse(fine.receive[0].key).quality,treatment==='oiled'?95:85);
  assert.equal(treatmentOf(prepared),treatment);assert.equal(quoteMender({...input,inventory:{[prepared]:1,[tool]:1},action:'fine',capability,toolCondition:()=>0}).eligible,false);
  const saved=JSON.parse(JSON.stringify(state));assert.deepEqual(saved.actors.player.sources,state.actors.player.sources);
 }
});

test('idle clock and unrelated sequence changes preserve reviewed preparation terms, while changed lots and grants require review',()=>{
 const prepared=quoteHideTreatment({treatmentId:'smoked',inventory:{[pelt]:6,[log]:2},skillLevel:5,clock:1000,world:'base.frontier'}).receive[0].key;
 const state=initializeExpedition(createExpansionState(73));
 state.actors.player.facts['mender.methodsKnown']=true;state.actors.player.facts['mender.repairShift']=true;
 const input={state,inventory:{[prepared]:3,[log]:1},world:'base.frontier',location:'Village',craftsmanHere:true,blocked:'',materialClock:1005};
 const tool=quoteMender({...input,action:'tool:smoked'}),advance=quoteMender({...input,action:'advance:smoked'});
 state.sequence++;
 const fresh=quoteMender({...input,action:'tool:smoked',materialClock:1010});
 assert.equal(samePreparationQuote(tool,fresh),true);
 assert.equal(JSON.parse(fresh.receive[0].key).lineage.history[0].at,1010);
 assert.equal(samePreparationQuote(advance,quoteMender({...input,action:'advance:smoked'})),true);
 const changed=structuredClone(fresh);changed.spend[0].key=pelt;
 assert.equal(samePreparationQuote(tool,changed),false,'another exact parent is a different offer');
 changed.spend=structuredClone(fresh.spend);changed.receive[0].count=2;
 assert.equal(samePreparationQuote(tool,changed),false,'a changed output count is a different offer');
 state.actors.player.sources[MENDER_SOURCE]={};
 assert.equal(samePreparationQuote(advance,quoteMender({...input,action:'advance:smoked'})),false,'already-earned fitting is revalidated');
});
