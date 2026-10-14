import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {molFacts} from '../src/book_world_mol_actions.js';
import {simulationFacts,advanceSimulationBoundary} from '../src/simulation.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
// A real importer/commands/serializer-generated pending control drill. No fake
// research receipts: this fixture retains the independently held lamp and fuel.
const fixture=new URL('../docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture/TEST-FIXTURE-R15-G4-control-pending.txt',import.meta.url);
function pending(){
 const raw=JSON.parse(Buffer.from(fs.readFileSync(fixture,'utf8').split(':')[1],'base64')),state=raw.expansion;
 const job=state.simulation.jobs.find(j=>j.commandId==='book.mol.control_drill');state.clock=job.due;
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:80,max_health:80,stamina:51,max_stamina:51}]));
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,stock])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(stock).map(([k,e])=>[k,e.count])),skills:{}}]));
 const context={actorId:'player',targetId:job.targetId,nativeAlive:true,nativeBody:state.simulation.people.player.body,molNative:{bound:true,revision:state.motherOfLearning.nativeRevision,body:state.simulation.people.player.body},vitals,gameplay,molAcceptedJob:job,facts:{location:state.simulation.people.player.location,'mol.deviceSupported':false}};
 return {state,job,vitals,gameplay,context};
}
test('held Cyoria lamp support at completion overrides the cached absent-inventory projection',()=>{
 const p=pending();assert.equal(molFacts(p.state,p.context)['mol.deviceSupported'],true);
 assert.equal(simulationFacts(p.state,p.context,registry)['mol.deviceSupported'],true);
 // The exact accepted return is required, and losing the real faculty still refuses.
 assert.equal(simulationFacts(p.state,{...p.context,molAcceptedJob:null},registry)['mol.deviceSupported'],false);
 p.state.simulation.faculties.player['book.mol.formula_operator'].active=false;
 assert.equal(simulationFacts(p.state,p.context,registry)['mol.deviceSupported'],false);
});
test('the scheduler returns the one held lamp and settles real control mastery once',()=>{
 const p=pending(),out={state:p.state,external:{money:1000},gameplay:p.gameplay,vitals:p.vitals,equipment:{}};
 advanceSimulationBoundary(out,registry,{player:p.context});
 assert.equal(out.state.actors.player.completed['book.mol.control_drill'],1);
 assert.equal(out.state.simulation.powers.player['book.mol.formula_operator'].mastery,1);
 assert.equal(out.gameplay.player.inventory['{"id":"Cyorian keyed formula lamp"}'],1);
 advanceSimulationBoundary(out,registry,{player:p.context});
 assert.equal(out.state.simulation.powers.player['book.mol.formula_operator'].mastery,1);
 assert.equal(out.gameplay.player.inventory['{"id":"Cyorian keyed formula lamp"}'],1);
});
