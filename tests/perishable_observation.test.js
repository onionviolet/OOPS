import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHarvest,drawSpecimen,addCarcass,observeCarcass,validateHarvest} from '../src/harvest.js';

const specimen=drawSpecimen({species:'Wolf rat',key:'condition-lot',clock:10},()=>.5);
const context=(clock,skill)=>({clock,skill,tool:0});

test('carcass observations retain timestamped estimates and later Butchering narrows only the new estimate',()=>{
 const state=createHarvest();addCarcass(state,structuredClone(specimen),context(10,0));
 const first=observeCarcass(state,'Wolf rat',specimen.key,context(50,0));
 const second=observeCarcass(state,'Wolf rat',specimen.key,context(90,50));
 assert.deepEqual(first,{at:50,skill:0,ageEstimate:{min:0,max:100},freshness:'fresh',integrity:'intact'});
 assert.deepEqual(second,{at:90,skill:50,ageEstimate:{min:70,max:90},freshness:'aging',integrity:'intact'});
 assert.deepEqual(state.lots['Wolf rat'][0].observations,[first,second]);
 const restored=structuredClone(state);validateHarvest(restored,90);
 assert.deepEqual(restored.lots['Wolf rat'][0].observations,[first,second]);
});

test('legacy specimen lots load without invented observations; invalid or future history is rejected',()=>{
 const state=createHarvest();addCarcass(state,structuredClone(specimen),context(10,0));
 const legacy=structuredClone(state);assert.equal(validateHarvest(legacy,10).lots['Wolf rat'][0].observations,undefined);
 observeCarcass(state,'Wolf rat',specimen.key,context(20,20));
 for(const mutate of [s=>s.lots['Wolf rat'][0].observations[0].at=21,
  s=>s.lots['Wolf rat'][0].observations[0].ageEstimate.max++,
  s=>s.lots['Wolf rat'][0].observations[0].skill=50]){
  const invalid=structuredClone(state);mutate(invalid);assert.throws(()=>validateHarvest(invalid,20));
 }
});
