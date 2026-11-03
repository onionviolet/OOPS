import test from 'node:test';
import assert from 'node:assert/strict';
import {fightWindow,bandFor,LOTM_BAND_ROWS,LOTM_ALL_BAND_ROWS,LOTM_PATHWAYS,PATHWAY_FORMULA_KEY,BAND_AXES,BAND_SCALE,BAND_DIALS,PATHWAY_LEANS} from '../src/book_world_lotm_bands.js';
import {LOTM_HOSTILES} from '../src/book_world_lotm_abilities.js';
import {LOTM_FORMULA_ROWS} from '../src/lotm_formula_rows.js';
test('a sailor hostile and Old Neil both read a band; shapes differ by pathway',()=>{
 const sa=fightWindow('book.lotm.rogue.sa');assert.equal(sa.ok,true);assert.equal(sa.band.shape,'notch');assert.equal(sa.band.sequence,8,'the hostile holds the Sequence 8 source');
 const neil=fightWindow('lotm.person.old-neil');assert.equal(neil.ok,true);assert.equal(neil.band.open,true,'Neil\'s sequence is carried open, not guessed');
 assert.ok(bandFor({pathway:'Visionary',sequence:9}).values.spirituality>=bandFor({pathway:'Visionary',sequence:9}).values.strength,'Visionary leans on spirit, not body');
});
test('a fight window with no band is refused',()=>{
 for(const id of ['lotm.person.nobody','lotm.person.crowd-passer']){const w=fightWindow(id);assert.equal(w.ok,false,id);assert.equal(w.reason,'no_band');}
 assert.equal(bandFor({pathway:'Nonesuch',sequence:9}),null,'a pathway with no row has no band');
 assert.equal(bandFor({pathway:'Sun',sequence:9}).pathway,'Sun','Sun now has curve rows');
});
test('every row is a proposal with an evidence label and locator, keyed to a real pathway and shape',()=>{
 const names=new Set(LOTM_FORMULA_ROWS.map(r=>r.pathway));
 for(const r of LOTM_BAND_ROWS){assert.equal(r.proposal,true);assert.ok(['S','T','I'].includes(r.evidence.label));assert.ok(r.evidence.locator);
  assert.deepEqual(Object.keys(r.values),[...BAND_AXES]);}
 for(const h of LOTM_HOSTILES)assert.equal(fightWindow(h.id).ok,true);
 for(const r of LOTM_ALL_BAND_ROWS){assert.equal(r.proposal,true);assert.ok(r.evidence.locator);assert.ok(PATHWAY_LEANS[r.pathway]);}
 for(const p of LOTM_PATHWAYS){const k=PATHWAY_FORMULA_KEY[p];assert.ok(k===null||names.has(k),p);}
 for(const n of names)assert.ok(LOTM_PATHWAYS.includes(n),`formula pathway ${n} is a band key`);
 assert.equal(fightWindow('book.lotm.rogue.sv').band.open,true,'a hostile with no pathway row reads the open Beyonder floor');
});
test('22 pathways read a band at Seq 9 to 5; the scale is signed, zero-referenced and has no ceiling',()=>{
 assert.equal(LOTM_PATHWAYS.length,22);
 for(const p of LOTM_PATHWAYS)for(const s of [9,8,7,6,5])assert.ok(bandFor({pathway:p,sequence:s}),`${p} ${s}`);
 assert.equal(BAND_SCALE.referenceAdult,0);assert.deepEqual(Object.keys(BAND_DIALS),['gain','logistic']);
 assert.ok(LOTM_BAND_ROWS.length===10&&LOTM_BAND_ROWS.every(r=>r.evidence.label==='I'&&r.proposal));
});
test('dated cast subjects replace the open floors; unknown people stay no_band',()=>{
 const dunn=fightWindow('lotm.person.dunn-smith'),leo=fightWindow('lotm.person.leonard-mitchell'),neil=fightWindow('lotm.person.old-neil');
 assert.deepEqual([dunn.band.pathway,dunn.band.sequence,dunn.asOf],['Darkness',7,'v1 ch101-210']);
 assert.deepEqual([leo.band.pathway,leo.band.sequence],['Darkness',8]);
 assert.deepEqual([neil.band.pathway,neil.band.sequence,neil.band.open],['Hermit','open',true]);
 assert.ok(dunn.band.values.spirituality>leo.band.values.spirituality,'Seq 7 sits above Seq 8');
 assert.equal(fightWindow('lotm.person.someone-else').reason,'no_band');
});
