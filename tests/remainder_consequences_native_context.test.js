import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState} from '../src/expansion_engine.js';
import {expeditionRegistry} from '../src/expedition_content.js';
import {enrollSimulation,simulationFacts} from '../src/simulation.js';
import {remainderConsequencesContext} from '../src/audit_remainder_consequences_host.js';
test('flat native scheduler vitals retain healthy consequence support through a second fact projection',()=>{
 const state=enrollSimulation(createExpansionState(41),expeditionRegistry,{actorId:'player',facts:{location:'Village'},gameplay:{},external:{money:20}}).state;
 const vitals={health:70,max_health:70,stamina:40,max_stamina:47};
 const context={actorId:'player',nativeAlive:true,facts:{location:'Village'},vitals,vitalsByActor:{player:vitals}};
 const before=structuredClone(context),projected=remainderConsequencesContext(state,context);
 for(const key of ['remainder.consequences.frontierSupported','remainder.consequences.playerHands']) {
  assert.equal(projected.facts[key],true);
  assert.equal(simulationFacts(state,{...projected,vitals:{player:vitals}},expeditionRegistry)[key],true);
 }
 assert.deepEqual(projected.vitals,vitals);assert.deepEqual(context,before);
 const hurt={...context,vitals:{...vitals,health:0},vitalsByActor:{player:{...vitals,health:0}}};
 assert.equal(remainderConsequencesContext(state,hurt).facts['remainder.consequences.playerHands'],false);
});
