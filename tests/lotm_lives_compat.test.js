import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lotmCommands} from '../src/book_world_lotm_actions.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {lotmFacts} from '../src/book_world_lotm_actions.js';
// Old-save safety for the LOTM lives slices: fixtures dumped from the Q1 code before any Q2+ edit
// (docs/gm/dispatch/lotm-lives-regions-2026-10-23/dump_pre_slice_fixtures.mjs) must still load, and every command a saved job can
// name must be byte-identical (validateLotmState compares a job's costs and effects to its definition).
const dir='docs/gm/dispatch/lotm-lives-regions-2026-10-23/fixtures/';
const read=n=>JSON.parse(fs.readFileSync(dir+n,'utf8'));
test('saves from before the slices load unchanged, with the right pathway view',()=>{
 const want={seer_taught:'Sequence 9 · Seer',seer_promoted:'Sequence 8 · Clown',cc_allocated:'Ordinary clerk',cc_acting:'Sequence 9 · Corpse Collector',cc_promoted:'Sequence 8 · Gravedigger'};
 for(const [name,stage] of Object.entries(want)){
  const save=read(name+'.json');
  const before=structuredClone(save);
  assert.ok(validateLotmState(save.expansion),name);assert.ok(validateLotmEnvelope(save),name);
  const f=lotmFacts(save.expansion,{gameplay:{player:{inventory:Object.fromEntries(Object.entries(save.inventories.person.main_character).map(([k,v])=>[k,v.count]))}}});
  assert.equal(lotmPathView(save.expansion,f).stage,stage,name);
  assert.deepEqual(save,before,`${name}: old saves gain no opening history, debt or salary`);
 }
});
test('no command a saved job can name changed; only untimed offers gained the one-pathway, Beyonder-track, church and wrong-potion gates',()=>{
 const pre=read('pre_commands.json'),now=new Map(lotmCommands.map(c=>[c.id,c]));
 const changed=pre.filter(c=>JSON.stringify(now.get(c.id))!==JSON.stringify(c));
 assert.ok(changed.length>0&&changed.every(c=>!(c.duration>0)),'changed: '+changed.map(c=>c.id).join());
 for(const c of pre.filter(c=>c.duration>0))assert.equal(JSON.stringify(now.get(c.id)),JSON.stringify(c),c.id);
});
