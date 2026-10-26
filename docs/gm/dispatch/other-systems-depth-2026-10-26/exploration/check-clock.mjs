import fs from 'node:fs';
import assert from 'node:assert/strict';
import {syncMolClock,nextMolBoundary} from '../../../../../src/book_world_mol_state.js';
import {molFacts} from '../../../../../src/book_world_mol_actions.js';
const dir=new URL('./evidence/',import.meta.url);
const earned=JSON.parse(fs.readFileSync(new URL('natural-route.json',dir))).result.expansion;
// Named timing fixture: clone earned withdrawn research state and reopen only
// the commission timestamp/status for boundary checks. This is source evidence,
// not a second earned commission or a supported player reset.
function fresh(){const s=structuredClone(earned);s.worlds['book.mol.cyoria'].facts['book.mol.retrieval']='offered';s.motherOfLearning.retrievalOpenedAt=s.motherOfLearning.instances[0].clock.elapsed;return s;}
const batched=fresh(),stepped=fresh();const start=batched.clock;
assert.equal(nextMolBoundary(batched),start+90);
batched.clock+=89;syncMolClock(batched);
assert.equal(batched.worlds['book.mol.cyoria'].facts['book.mol.retrieval'],'offered');
assert.equal(molFacts(batched)['mol.retrievalWindowOpen'],true);
assert.equal(nextMolBoundary(batched),start+90);
batched.clock++;syncMolClock(batched);
assert.equal(batched.worlds['book.mol.cyoria'].facts['book.mol.retrieval'],'late');
assert.equal(molFacts(batched)['mol.retrievalWindowOpen'],false);
for(let i=0;i<90;i++){stepped.clock++;syncMolClock(stepped);if(i===44){const restored=JSON.parse(JSON.stringify(stepped));Object.assign(stepped,restored);}}
assert.equal(stepped.motherOfLearning.instances[0].clock.elapsed,batched.motherOfLearning.instances[0].clock.elapsed);
assert.equal(stepped.worlds['book.mol.cyoria'].facts['book.mol.retrieval'],'late');
assert.equal(nextMolBoundary(stepped),Infinity);
const result={fixture:'timing clone of earned Cyoria withdrawal/research, reopened commission in source only',beforeEquality:'offered/open at 89',atEquality:'late/closed at 90',batchVsSteppedReloaded:true};
fs.writeFileSync(new URL('clock.json',dir),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
