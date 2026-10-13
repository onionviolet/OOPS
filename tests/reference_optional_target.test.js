import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState} from '../src/expansion_engine.js';
import {expeditionRegistry} from '../src/expedition_content.js';
import {enrollSimulation} from '../src/simulation.js';
import {enrollReferenceGameplay} from '../src/reference_gameplay_state.js';
import {referenceGameplayPresentation} from '../src/reference_gameplay_host.js';
test('lawful optional feat enrollment renders without introducing an unrelated encounter target',()=>{
 const context={actorId:'player',external:{money:96},gameplay:{},facts:{location:'Village'}};
 const enrolled=enrollSimulation(createExpansionState(78),expeditionRegistry,context);
 const out=enrollReferenceGameplay(enrolled.state,context),before=structuredClone(out.state);
 assert.equal(out.state.simulation.people.featureBattleHook,undefined);
 const view=referenceGameplayPresentation(out.state,expeditionRegistry,context);
 assert.ok(!view.actions.some(a=>a.targetId==='featureBattleHook'));
 assert.deepEqual(out.state,before);
});

import {stageAuditRemainderEnrollment} from '../src/audit_remainder_state.js';
import {remainderCombatFitPresentation} from '../src/audit_remainder_combat_fit_host.js';
test('staged local-project projection does not inspect an unintroduced party member',()=>{
 const context={actorId:'player',nativeAlive:true,external:{money:96},gameplay:{},facts:{location:'Village'}};
 const local=enrollSimulation(createExpansionState(79),expeditionRegistry,context);
 const reference=enrollReferenceGameplay(local.state,context);
 const state=stageAuditRemainderEnrollment(reference.state),before=structuredClone(state);
 assert.equal(state.simulation.people.partyPartner,undefined);
 assert.doesNotThrow(()=>remainderCombatFitPresentation(state,expeditionRegistry,context));
 assert.deepEqual(state,before);
});
