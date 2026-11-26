import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForLotmSourceJobs} from '../src/book_world_lotm_readiness.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {LOTM_LOCATIONS} from '../src/book_world_lotm_ids.js';
const saved={expansion:{lotm:{schema:1},simulation:{jobs:[{commandId:'book.lotm.fixture.work'}]}}};
const text=JSON.stringify(saved);
test('pending and settled native/authority saves wait for source without changing stored bytes',async()=>{
 const settled=JSON.stringify({expansion:{lotm:{schema:1},simulation:{jobs:[],people:{player:{location:'lotm.place.kj3ba.cargo-deck'}}}},'current location':'lotm.place.kj3ba.cargo-deck'});
 for(const raw of [text,settled,JSON.stringify({current:text,previous:null}),JSON.stringify({current:'{}',previous:text}),JSON.stringify({current:settled,previous:null})]){
  const entries={slot:raw},before=JSON.stringify(entries);let release,finished=false,called=0;
  const blocked=new Promise(r=>release=r);
  const waiting=waitForLotmSourceJobs({storage:{getItem:k=>entries[k]??null},keys:['slot'],ready:()=>{called++;return blocked;}}).then(()=>finished=true);
  await Promise.resolve();assert.equal(called,1);assert.equal(finished,false);
  release(null);await waiting;assert.equal(finished,true);assert.equal(JSON.stringify(entries),before);
 }
});

test('readiness does not admit contradictory or absent cast places',async()=>{
 const place=Object.values(LOTM_LOCATIONS)[0];
 const base={'current location':place,expansion:{lotm:{entryProfile:'book.lead.be@1'},simulation:{people:{player:{location:place}},jobs:[]}}};
 for(const invalid of [
  {...base,'current location':'lotm.place.unregistered'},
  {...base,expansion:{...base.expansion,simulation:{people:{player:{location:'lotm.place.unregistered'}},jobs:[]}}}
 ]){
  let ready=0;await waitForLotmSourceJobs({storage:{getItem:()=>JSON.stringify(invalid)},keys:['slot'],ready:async()=>ready++});
  assert.equal(ready,1);assert.throws(()=>validateLotmEnvelope(invalid),/saved place and the Tingen branch body disagree/);
 }
});
test('fresh, unrelated and malformed snapshots leave loader selection and errors to their owner',async()=>{
 for(const raw of [null,'bad','{}',JSON.stringify({expansion:{simulation:{jobs:[{commandId:'book.hp.work'}]}}})]){
  let called=0;await waitForLotmSourceJobs({storage:{getItem:()=>raw},keys:['slot'],ready:async()=>called++});assert.equal(called,0);
 }
 let called=0;await waitForLotmSourceJobs({storage:{getItem:()=>null},keys:[],probe:true,ready:async()=>called++});assert.equal(called,1,'probe waits before announcing readiness for an unseen candidate');
 await assert.rejects(waitForLotmSourceJobs({storage:{getItem:()=>text},keys:['slot'],ready:async()=>{throw Error('source failed');}}),/source failed/);
});
