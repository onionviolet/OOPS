import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState} from '../src/expansion_engine.js';
import {createSimulationState,validateSimulationState} from '../src/simulation_contracts.js';
const fixture=()=>{const state=createExpansionState(7),s=createSimulationState(9);s.enrolledAt=0;s.people.player={life:'alive',inventory:'native',location:'Village',bornAt:0};state.simulation=s;return {state,s}};
test('reservation and later learning schemas can be entered before the first caused situation',()=>{for(const schema of [4,5]){const {state,s}=fixture();s.schema=schema;assert.doesNotThrow(()=>validateSimulationState(s,state));s.situations={};assert.doesNotThrow(()=>validateSimulationState(s,state));}});
test('caused-situation schema and malformed later situation records keep causal validation',()=>{const {state,s}=fixture();s.schema=3;assert.throws(()=>validateSimulationState(s,state),/caused situation/);s.schema=4;s.situations={bad:{}};assert.throws(()=>validateSimulationState(s,state),/situation/);s.situations=[];assert.throws(()=>validateSimulationState(s,state),/Situations/);});
