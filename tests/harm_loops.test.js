import test from 'node:test';
import assert from 'node:assert/strict';
import {LOOP_RESETS,LOOP_CAUSES,rowCause,loopPlan,validateLoopRows} from '../src/harm_loops.js';

test('a row without cause reads as imposed; every shipped row validates unchanged',()=>{
 validateLoopRows();
 for(const [id,r] of Object.entries(LOOP_RESETS))assert.equal(rowCause(r),'imposed',id);
 assert.equal(loopPlan('book.lotm.tingen',{trigger:'death',lifeEnded:true}).cause,'imposed');
});
test('cause is one of chosen, imposed or entrapped; anything else is rejected',()=>{
 assert.deepEqual(LOOP_CAUSES,['chosen','imposed','entrapped']);
 const base=LOOP_RESETS.default;
 for(const cause of LOOP_CAUSES)validateLoopRows({x:{...base,cause}});
 assert.throws(()=>validateLoopRows({x:{...base,cause:'fate'}}),/Invalid loop row: x/);
});
test('an entrapped row still lists its exit text',()=>{
 const rows=validateLoopRows({trap:{...LOOP_RESETS['book.mol.cyoria#zorian'],cause:'entrapped'},plain:{...LOOP_RESETS.default,cause:'entrapped'}});
 assert.equal(rowCause(rows.trap),'entrapped');
 assert.ok(rows.trap.exit.length>0&&rows.trap.exit.every(e=>e.when&&e.cost));
 assert.match(rows.plain.exit,/\S/);
});
