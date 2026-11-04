import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForLotmSourceJobs} from '../src/book_world_lotm_readiness.js';
const saved={expansion:{lotm:{schema:1},simulation:{jobs:[{commandId:'book.lotm.fixture.work'}]}}};
const text=JSON.stringify(saved);
test('pending native and authority snapshots wait for source without changing stored bytes',async()=>{
 for(const raw of [text,JSON.stringify({current:text,previous:null}),JSON.stringify({current:'{}',previous:text})]){
  const entries={slot:raw},before=JSON.stringify(entries);let release,finished=false,called=0;
  const blocked=new Promise(r=>release=r);
  const waiting=waitForLotmSourceJobs({storage:{getItem:k=>entries[k]??null},keys:['slot'],ready:()=>{called++;return blocked;}}).then(()=>finished=true);
  await Promise.resolve();assert.equal(called,1);assert.equal(finished,false);
  release(null);await waiting;assert.equal(finished,true);assert.equal(JSON.stringify(entries),before);
 }
});
test('fresh, settled, unrelated and malformed snapshots leave loader selection and errors to their owner',async()=>{
 for(const raw of [null,'bad','{}',JSON.stringify({expansion:{lotm:{schema:1},simulation:{jobs:[]}}}),JSON.stringify({expansion:{simulation:{jobs:[{commandId:'book.hp.work'}]}}})]){
  let called=0;await waitForLotmSourceJobs({storage:{getItem:()=>raw},keys:['slot'],ready:async()=>called++});assert.equal(called,0);
 }
 let called=0;await waitForLotmSourceJobs({storage:{getItem:()=>null},keys:[],probe:true,ready:async()=>called++});assert.equal(called,1,'probe waits before announcing readiness for an unseen candidate');
 await assert.rejects(waitForLotmSourceJobs({storage:{getItem:()=>text},keys:['slot'],ready:async()=>{throw Error('source failed');}}),/source failed/);
});
