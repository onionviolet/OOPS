// Calibration targets LCT1-LCT4 as inequalities over the pure notch formulas (LCB1). Locators are the official English Webnovel's chapter numbering
// (LOTM_COMBAT_DEEP_DIVE_2026-11-03.md section 2). Every number is an authored proposal (WPR5/AD49); these tests pin ranges, not exact values.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BAND_DIALS,BAND_AXES,PATHWAY_LEANS,LOTM_PATHWAYS,LOTM_ALL_BAND_ROWS,hitsToDown,winChance,contest,bandFor} from '../src/book_world_lotm_bands.js';
const REVOLVER_FORCE=0,SEQ6_CHAINED=bandFor({pathway:'Chained',sequence:6});
test('formulas: hits-to-down is gain^(toughness-force) floored at one; revolver force is 0',()=>{
 assert.equal(hitsToDown(0,REVOLVER_FORCE),1,'the reference adult goes down in one head hit');
 assert.equal(hitsToDown(-3),1,'a frail person is floored at one hit');
 assert.ok(Math.abs(hitsToDown(2)-BAND_DIALS.gain**2)<1e-12);
});
test('LCT4 en v2 ch331 P028-P031: a Seq 6 Chained body takes about five revolver hits',()=>{
 const h=hitsToDown(SEQ6_CHAINED.values.toughness,REVOLVER_FORCE);
 assert.ok(h>=4&&h<=6.5,`hits ${h}`);
});
test('LCT2 en v2 ch270 P006-P012: a Seq 8 Clown control axis beats a trained adult at >= 0.9, k default 1.1',()=>{
 assert.equal(BAND_DIALS.logistic,1.1);
 const clown=bandFor({pathway:'Fool',sequence:8}),trainedBoxer=0;// training adds notches on strength, not on control
 const p=winChance(clown.values.control-trainedBoxer);
 assert.ok(p>=0.9,`p ${p}`);
 assert.ok(clown.values.control>clown.values.strength,'the win does not spend the strength axis');
});
test('LCT3 en v2 ch295 P037-P038: Seq 9-8 non-signature axes are at most +1 notch for all 22 pathways',()=>{
 for(const r of LOTM_ALL_BAND_ROWS.filter(r=>r.sequence>=8))for(const a of BAND_AXES)
  if(!PATHWAY_LEANS[r.pathway].signature.includes(a))assert.ok(r.values[a]<=1,`${r.pathway} ${r.sequence} ${a}=${r.values[a]}`);
});
test('LCT1 en v1 ch19 P008-P009: a revolver downs any Seq 9 in at most 3 hits (Seq 8 as well)',()=>{
 for(const r of LOTM_ALL_BAND_ROWS.filter(r=>r.sequence>=8))assert.ok(hitsToDown(r.values.toughness,REVOLVER_FORCE)<=3,`${r.pathway} ${r.sequence}`);
});
test('LCT3 sequence curve: signature axes climb one notch per Sequence from 9 to 5 and Seq 4 is open',()=>{
 for(const p of LOTM_PATHWAYS){const sig=PATHWAY_LEANS[p].signature[0];
  const got=[9,8,7,6,5].map(s=>bandFor({pathway:p,sequence:s}).values[sig]);
  // an authored L1 row may sit below the curve on its signature axis, never above
  got.forEach((v,i)=>assert.ok(v<=i+1,`${p} ${sig}`));
  if(!['Tyrant','Death','Fool','Visionary','Door'].includes(p))assert.deepEqual(got,[1,2,3,4,5],p);
  assert.equal(bandFor({pathway:p,sequence:4}),null,'Seq 4 and below are open');}
});
test('contest helper is deterministic with an injected random source',()=>{
 const p=winChance(2);
 assert.equal(contest(2,()=>p-1e-9).win,true);
 assert.equal(contest(2,()=>p+1e-9).win,false);
 assert.equal(contest(0,()=>0.49).win,true,'even odds are 0.5');
 assert.ok(Math.abs(contest(-2,()=>0.5).chance-(1-p))<1e-12,'the lower side wins with the complement');
});
