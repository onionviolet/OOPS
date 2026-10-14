import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {validateExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {commitRemainderCombatFitCommand} from '../src/audit_remainder_combat_fit_host.js';
import {advanceSimulationBoundary} from '../src/simulation.js';
const file=new URL('../docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture/TEST-FIXTURE-R15-G4-combat.txt',import.meta.url);
function setup(){
 const raw=JSON.parse(Buffer.from(fs.readFileSync(file,'utf8').split(':')[1],'base64')),state=raw.expansion;
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,stock])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(stock).map(([k,e])=>[k,e.count])),skills:{}}]));
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:80,max_health:80,stamina:51,max_stamina:51}]));
 const context={actorId:'player',nativeAlive:true,nativeBody:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},vitals,gameplay,external:{money:raw.character.money},equipment:{player:{}},facts:{location:'Village'}};
 const terms=commitRemainderCombatFitCommand(state,registry,{type:'audit_remainder',id:'remainder_combat_fit.terms'},context);
 const plan=commitRemainderCombatFitCommand(terms.state,registry,{type:'audit_remainder',id:'remainder_combat_fit.grip_practice'},{...context,...terms});
 return {plan,context};
}
test('a paid grip practice has reloadable completion support before accepting the reservation',()=>{
 const {plan}=setup();assert.equal(plan.vitals.player.stamina,49);assert.equal(plan.state.simulation.jobs.length,1);
 assert.doesNotThrow(()=>validateExpansionState(plan.state));
 assert.doesNotThrow(()=>validateExpansionState(plan.state,registry));
 assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(plan.state)),registry),plan.state);
});
test('restored grip practice completes once, with its source receipt and actual soreness',()=>{
 const {plan,context}=setup();plan.state=JSON.parse(JSON.stringify(plan.state));
 const job=plan.state.simulation.jobs.find(j=>j.commandId==='remainder_combat_fit.grip_practice');plan.state.clock=job.due;
 advanceSimulationBoundary(plan,registry,{player:context});
 assert.equal(plan.state.actors.player.completed[job.commandId],1);
 assert.equal(plan.state.auditRemainder.modules.combat_fit.grip.status,'ready');
 assert.equal(plan.state.auditRemainder.modules.combat_fit.grip.sourceReceiptId,plan.state.actors.player.sources['body.conditioned_grip'].receiptId);
 assert.equal(plan.state.simulation.conditions.player['body.sore_hands'].expiresAt,job.due+12);
 advanceSimulationBoundary(plan,registry,{player:context});assert.equal(plan.state.actors.player.completed[job.commandId],1);
});
test('registry-free validation still rejects an invented forfeit-completion command',()=>{
 const {plan}=setup();plan.state.simulation.jobs[0].commandId='remainder_combat_fit.invented_forfeit';
 assert.throws(()=>validateExpansionState(plan.state),/Combat-fit work lost its exact/);
});
