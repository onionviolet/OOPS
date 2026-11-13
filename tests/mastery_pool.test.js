import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,at,save,hostOver} from './lotm_helpers.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {LOTM_LOCATIONS as L,LOTM_IDS as I} from '../src/book_world_lotm_ids.js';
import {COPYING_HAND} from '../src/book_world_lotm_merit.js';
import {gainEffects,masteryPoolFacts,poolKey,checkpointsLost,poolDial} from '../src/mastery_pool.js';
// Per-action mastery with a world pool (MEL-PROD-C05 shape) on the Nighthawk case-file copying.
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));};
const pass=(p,minutes)=>{const to=p.state.clock+minutes;for(let i=0;p.state.clock<to&&i<40;i++)p=wait(p,to-p.state.clock);return p;};
const hand=p=>p.state.simulation.powers.player?.[COPYING_HAND];
const pool=p=>p.state.actors.player.resources[poolKey(I.world)]||0;
const copy=p=>pass(run(at(p,L.workroom),'merit_case_file_copy'),30);
const view=p=>hostOver(p).host.view().merit;
const copies=(p,n)=>{for(let i=0;i<n;i++)p=copy(p);return p;};

test('the first copy learns the hand; later copies grow it and feed the pool, nothing before completion',()=>{
 let p=run(fresh(500),'report_in');
 assert.equal(hand(p),undefined);
 ok(run(at(structuredClone(p),L.workroom),'merit_case_file_copy'));// a running learning copy is admitted work
 p=copy(p);assert.equal(hand(p).owned,true);assert.equal(hand(p).mastery,0,'learning is not practice');assert.equal(pool(p),0);
 p=run(at(p,L.workroom),'merit_case_file_copy');assert.equal(hand(p).mastery,0,'no gain before the 30 minutes end');ok(p);
 const forged=structuredClone(p.state);forged.simulation.jobs[0].effects.at(-1).amount=5;assert.throws(()=>validateLotmState(forged),/admitted definition/,'a pool share past its bound is refused');
 p=pass(p,30);assert.equal(hand(p).mastery,4);assert.equal(pool(p),1);ok(p);
 assert.equal(view(p).practice.level,4);assert.equal(view(p).practice.pool.cap,8);
});

test('checkpoints change the work: the pool opens lodging copies, mastery 20 opens cited files',()=>{
 let p=copies(run(fresh(500),'report_in'),4);// learn + 3 practice
 assert.equal(pool(p),3);assert.throws(()=>run(at(p,L.lodging),'merit_case_file_copy_home'),'below half the pool');
 p=copy(p);assert.equal(pool(p),4);assert.equal(hand(p).mastery,16);
 const homeCopy=pass(run(at(structuredClone(p),L.lodging),'merit_case_file_copy_home'),30);
 assert.equal(hand(homeCopy).mastery,20,'a lodging copy is real practice too');ok(homeCopy);
 assert.throws(()=>run(at(p,L.workroom),'merit_cited_file_copy'),'mastery 16 is short of 20');
 assert.deepEqual(view(p).practice.spend.loses,['A steady desk'],'the spend warns what it switches off');
 // Spending is exact and not harmless: +4 mastery opens cited files, -4 pool closes the lodging copy.
 const spent=run(p,'merit_spend_copying');
 assert.equal(hand(spent).mastery,20);assert.equal(pool(spent),0);ok(spent);
 assert.throws(()=>run(at(structuredClone(spent),L.lodging),'merit_case_file_copy_home'),'the steady desk is gone');
 const cited=pass(run(at(spent,L.workroom),'merit_cited_file_copy'),60);
 assert.equal(view(cited).balance,7,'5 copies at 1 merit plus a cited file at 2');assert.equal(hand(cited).mastery,24);ok(cited);
 assert.throws(()=>run(cited,'merit_spend_copying'),'one pooled practice is not enough');
});

test('a full pool clamps instead of refusing the work, and learned mastery never falls',()=>{
 let p=copies(run(fresh(500),'report_in'),12);
 assert.equal(pool(p),8,'cap is 8 for one learned action');assert.equal(hand(p).mastery,44);ok(p);
 p=copy(p);assert.equal(pool(p),8);assert.equal(hand(p).mastery,48);
});

test('pure seam: no dial means no pool; spend warnings only name checkpoints actually crossed',()=>{
 assert.equal(poolDial('base.frontier'),null);assert.throws(()=>gainEffects('base.frontier','x'));
 assert.throws(()=>gainEffects(I.world,'book.lotm.power.other'));
 const state={simulation:{powers:{player:{[COPYING_HAND]:{owned:true,mastery:8}}}},actors:{player:{resources:{[poolKey(I.world)]:6}}}};
 const f=masteryPoolFacts(state,{},{worldId:I.world});
 assert.deepEqual(checkpointsLost(f,I.world,1),[]);assert.equal(checkpointsLost(f,I.world,4).length,1);
});

test('save, reload and validate keep mastery and a partly spent pool',()=>{
 let p=copies(run(fresh(500),'report_in'),6);p=run(p,'merit_spend_copying');
 const s=structuredClone(save(p)),q={...p,state:s.expansion};ok(q);
 assert.equal(hand(q).mastery,hand(p).mastery);assert.equal(pool(q),pool(p));
 const forged=structuredClone(p.state);forged.actors.player.resources[poolKey(I.world)]=-1;assert.throws(()=>run({...p,state:forged},'merit_spend_copying'));
});
