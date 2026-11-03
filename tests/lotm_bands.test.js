import test from 'node:test';
import assert from 'node:assert/strict';
import {fightWindow,bandFor,LOTM_BAND_ROWS,BAND_SHAPES} from '../src/book_world_lotm_bands.js';
import {LOTM_HOSTILES} from '../src/book_world_lotm_abilities.js';
import {LOTM_FORMULA_ROWS} from '../src/lotm_formula_rows.js';
test('a sailor hostile and Old Neil both read a band; shapes differ by pathway',()=>{
 const sa=fightWindow('book.lotm.rogue.sa');assert.equal(sa.ok,true);assert.equal(sa.band.shape,'physical');assert.equal(sa.band.sequence,8,'the hostile holds the Sequence 8 source');
 const neil=fightWindow('lotm.person.old-neil');assert.equal(neil.ok,true);assert.equal(neil.band.open,true,'Neil\'s sequence is carried open, not guessed');
 assert.equal(bandFor({pathway:'Visionary',sequence:9}).shape,'perceptual');
});
test('a fight window with no band is refused',()=>{
 for(const id of ['lotm.person.nobody','lotm.person.crowd-passer']){const w=fightWindow(id);assert.equal(w.ok,false,id);assert.equal(w.reason,'no_band');}
 assert.equal(bandFor({pathway:'Sun',sequence:9}),null,'a pathway with no row has no band');
});
test('every row is a proposal with an evidence label and locator, keyed to a real pathway and shape',()=>{
 const names=new Set(LOTM_FORMULA_ROWS.map(r=>r.pathway));
 for(const r of LOTM_BAND_ROWS){assert.equal(r.proposal,true);assert.ok(['S','T','I'].includes(r.evidence.label));assert.ok(r.evidence.locator);
  assert.deepEqual(Object.keys(r.values),BAND_SHAPES[r.shape]);}
 for(const h of LOTM_HOSTILES)assert.equal(fightWindow(h.id).ok,true);
 for(const r of LOTM_BAND_ROWS)assert.ok(names.has(r.pathway),r.pathway);
 assert.equal(fightWindow('book.lotm.rogue.sv').band.open,true,'a hostile with no pathway row reads the open Beyonder floor');
});
