import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {commitWorldCompletionCommand} from '../../../../../src/world_completion_host.js';
import {expeditionRegistry as registry} from '../../../../../src/expedition_content.js';
const input='/tmp/yairpg-foundation-learning-worker-neri-cancel-debug.json',raw=fs.readFileSync(input);
const save=JSON.parse(raw),state=save.expansion,neri='remainder_home.neri',job=state.simulation.jobs.find(j=>j.actorId===neri&&j.commandId==='world.completion.learning.walk_to_bench');
assert.ok(job);
// Actual saved input, but controlled caller-provided native health/body frame.
// This is source integration evidence, not a native restoration or body proof.
const context={actorId:'player',facts:{location:save['current location']},external:{money:save.character.money},
 gameplay:{player:{inventory:Object.fromEntries(Object.entries(save.inventories.person.main_character).map(([k,e])=>[k,e.count])),xp:{}}},
 nativeAlive:true,nativeBody:{id:'controlled.native.frame',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},
 nativeCareFrame:{clock:state.clock,calendarMinute:0},vitals:{player:{health:100,max_health:100,stamina:40,max_stamina:40}}};
const command={type:'world_completion',action:'cancel',id:job.id,sequence:state.sequence},before=structuredClone(state);
const out=commitWorldCompletionCommand(state,registry,command,context);
assert.equal(out.state.simulation.jobs.some(j=>j.id===job.id),false);
assert.equal(out.state.worlds['base.frontier'].facts['world.completion.learning.released'],true);
assert.equal(out.state.sequence,state.sequence+2);
assert.equal(out.external.money,save.character.money,'withdrawal remains a separate operation');
assert.deepEqual(out.state.simulation.powers[neri],state.simulation.powers[neri]);
assert.deepEqual(state,before,'no partial live mutation');
assert.throws(()=>commitWorldCompletionCommand(state,registry,command,{...context,facts:{location:'Village'}}),/Meet the actual learner/);
assert.throws(()=>commitWorldCompletionCommand(state,registry,{...command,sequence:state.sequence-1},context),/request changed/);
fs.writeFileSync(new URL('./CANCEL_RELEASE_SOURCE_RESULT.json',import.meta.url),JSON.stringify({input,sha256:crypto.createHash('sha256').update(raw).digest('hex'),scope:'actual saved-job input with controlled native caller frame; no publisher/browser',checks:['entitled co-located cancellation plus staged release','separate unchanged escrow/fee owner until withdrawal','unchanged learned ownership','pure failed location/stale checks']},null,2)+'\n');
console.log('passed exact saved-job cancellation/release source integration and two entitlement negatives');
