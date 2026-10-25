import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {lotmCommands} from '../src/book_world_lotm_actions.js';
import {hostileAbilityCommands} from '../src/book_world_lotm_abilities.js';
// S0 golden (potion pathways lane B): every LOTM command definition that existed before brewing (ids, requires, costs, effects, durations,
// claims, visibility) is pinned by a hash of its exact JSON. A saved job must equal its definition (state.js), so an existing definition may
// stay stable for timed jobs; new commands may be added. C1 Q5 deliberately tightened only immediate broker pay/verify custody gates (2026-10-25). Regenerate only for a deliberate, recorded revision: `node tests/lotm_commands_golden.test.js --write`.
const FILE=new URL('./fixtures/lotm_commands_golden.json',import.meta.url);
const sha=d=>crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex');
const current=()=>Object.fromEntries([...lotmCommands,...hostileAbilityCommands].map(c=>[c.id,sha(c)]));
if(process.argv.includes('--write')){fs.writeFileSync(FILE,JSON.stringify(current(),null,1)+'\n');console.log('wrote',Object.keys(current()).length);}
test('every pre-brewing LOTM command definition is byte-identical; only additions are allowed',()=>{
 const golden=JSON.parse(fs.readFileSync(FILE,'utf8')),now=current();
 assert.ok(Object.keys(golden).length>=150,'golden covers the shipped set');
 for(const [id,h] of Object.entries(golden)){assert.ok(now[id],`${id} was removed`);assert.equal(now[id],h,`${id} definition changed`);}
 const ids=[...lotmCommands,...hostileAbilityCommands].map(c=>c.id);assert.equal(new Set(ids).size,ids.length,'ids are unique');
});
