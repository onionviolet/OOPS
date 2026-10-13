import test from 'node:test';
import assert from 'node:assert/strict';
import {realmSimulationContexts,GLASSHOUSE_CONTENT} from '../src/realm_state.js';
import {FOLDED_GLASSHOUSE_IDS as ids} from '../src/pocket_realm_content.js';

const caretaker=GLASSHOUSE_CONTENT.caretakerId;
const opened=()=>({clock:0,actors:{player:{worldId:'base.frontier'}},simulation:{people:{player:{}}},
 realmPrototype:{instances:{[ids.instanceId]:{clock:{observedAt:0},actorIds:[]}},visits:[],activeVisitId:null}});
test('an opened doorway does not create a context for its unintroduced resident',()=>{
 const state=opened(),before=structuredClone(state),contexts={player:{facts:{location:'Village'}}};
 assert.equal(realmSimulationContexts(state,contexts),contexts);
 assert.deepEqual(state,before);
 for(const id of Object.keys(realmSimulationContexts(state,contexts)))assert.doesNotThrow(()=>state.actors[id].worldId);
 state.actors[caretaker]={worldId:ids.worldId};
 assert.equal(realmSimulationContexts(state,contexts),contexts,'actor alone is not a simulation person');
});
test('an introduced resident still receives its existing dormant clock context',()=>{
 const state=opened();state.actors[caretaker]={worldId:'base.frontier'};state.simulation.people[caretaker]={};
 const contexts={player:{facts:{}},[caretaker]:{facts:{retained:true},vitals:{stamina:4}}};
 const result=realmSimulationContexts(state,contexts);
 assert.equal(result[caretaker].busy,true);
 assert.equal(result[caretaker].facts.retained,true);
 assert.equal(result[caretaker].facts['glasshouse.instanceClockActive'],false);
 assert.deepEqual(result[caretaker].vitals,{stamina:4});
});
