import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {makeBatchRef,splitPortion,describeBatch,validateBatch,fromHpBatch} from '../src/batch_identity.js';
import {allocatedDoseRef,lotmCommands} from '../src/book_world_lotm_actions.js';
import {fresh,run,holds,I} from './lotm_helpers.js';
import {LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
const hp=()=>({id:'b3',cohortId:'b3',custody:'carried',readyAt:100,grade:'canon',history:{revision:1,secret:'x'},doses:4,dosesLeft:3,known:{identified:false,assayed:false}});
const ref=()=>makeBatchRef({id:'t.1',kind:'dose',label:'Prepared dose',grade:'canon',source:'sup',doses:5});
const keysOf=p=>{const s=p.state;return JSON.stringify([Object.keys(s.simulation.knowledge.player||{}).sort(),Object.keys(s.actors.player.facts||{}).sort(),Object.keys(s.actors.player.resources||{}).sort()]);};

test('splitPortion conserves doses and refuses to split more than remain',()=>{
 const b=ref();
 for(let n=1;n<=5;n++){const {portion,remainder}=splitPortion(b,n);
  assert.equal(portion.dosesLeft+remainder.dosesLeft,b.dosesLeft);assert.equal(portion.id,b.id);assert.equal(portion.label,b.label);assert.equal(remainder.id,b.id);}
 assert.equal(b.dosesLeft,5,'input is not mutated');
 const {remainder}=splitPortion(b,2);assert.equal(remainder.dosesLeft,3);
 assert.throws(()=>splitPortion(remainder,4),/Only 3 doses remain/);
 assert.throws(()=>splitPortion(b,0));assert.throws(()=>splitPortion(b,1.5));
 const {remainder:none}=splitPortion(b,5);assert.throws(()=>splitPortion(none,1));
});

test('an HP brewing batch passes the validator unchanged, and the adapter yields a ref',()=>{
 const b=hp(),before=structuredClone(b);
 assert.equal(validateBatch(b),b);assert.deepEqual(b,before);
 const r=fromHpBatch(b,{label:'Cauldron batch'});
 assert.equal(r.label,'Cauldron batch');assert.equal(r.dosesLeft,3);assert.equal('history' in r,false);
 const {portion,remainder}=splitPortion(r,1);assert.equal(portion.dosesLeft+remainder.dosesLeft,3);
 assert.throws(()=>validateBatch({...b,dosesLeft:9}));assert.throws(()=>validateBatch({id:'',doses:1,dosesLeft:1}));
});

test('describeBatch hides grade for an unidentified batch',()=>{
 const b=ref();
 const d=describeBatch(b);assert.equal(d.grade,null);assert.doesNotMatch(d.text,/canon/);assert.match(d.text,/Prepared dose/);
 assert.equal(describeBatch(b,{known:{identified:true}}).grade,'canon');
 assert.equal(describeBatch({...b,known:{identified:true}}).grade,'canon');
 assert.equal(describeBatch({...b,known:{identified:true}},{known:{identified:false}}).grade,null);
});

test('a LOTM allocation is unchanged apart from the derived batch ref',()=>{
 const golden=JSON.parse(fs.readFileSync(new URL('./fixtures/lotm_commands_golden.json',import.meta.url),'utf8'));
 const c=lotmCommands.find(x=>x.id==='book.lotm.accept_allocation');
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(c)).digest('hex'),golden['book.lotm.accept_allocation']);
 let p=run(fresh(),'report_in');
 assert.equal(allocatedDoseRef(p.state),null);
 p=run(p,'accept_allocation');
 assert.equal(holds(p,K.dose),1);assert.equal(holds(p,K.dose,I.supervisor),0);
 assert.match(p.state.simulation.knowledge.player['book.lotm.terms'].value,/^One prepared dose now sits in your hands/);
 const r=allocatedDoseRef(p.state);validateBatch(r);
 assert.equal(r.doses,1);assert.equal(r.source,I.supervisor);assert.equal(r.grade,null);
 assert.deepEqual(r,allocatedDoseRef(structuredClone(p.state)));
});

test('an untouched life writes no new key, and allocation adds only its two existing keys',()=>{
 const a=fresh(),b=run(fresh(),'report_in');
 assert.equal(allocatedDoseRef(a.state),null);
 const before=keysOf(b),after=run(b,'accept_allocation');
 const all=keysOf(after);
 assert.doesNotMatch(all,/batch/i);
 const added=[...JSON.parse(all)[0],...JSON.parse(all)[1]].filter(k=>![...JSON.parse(before)[0],...JSON.parse(before)[1]].includes(k));
 assert.deepEqual(added.sort(),['book.lotm.allocated','book.lotm.terms']);
});
