import test from 'node:test';
import assert from 'node:assert/strict';
import {meterState,normalizeMeter} from '../src/meter_bar.js';
import {lotmMeters} from '../src/book_world_lotm_host.js';
import {LOTM_ENERGY} from '../src/book_world_lotm_ids.js';
// WDI49-WDI60 first slice: a pool reads worst when empty, an accumulator when full, and the LOTM
// meters are views of the energy record (no new saved field).
test('meter state is read from the worse end for each kind',()=>{
 assert.equal(meterState('pool',3,3),'ok');assert.equal(meterState('pool',2,3),'ok');assert.equal(meterState('pool',1,3),'high');
 assert.equal(meterState('pool',0,3),'full');
 assert.equal(meterState('accumulator',0,6),'ok');assert.equal(meterState('accumulator',5,6),'high');
 assert.equal(meterState('accumulator',6,6),'full');
});
test('a bad meter spec is refused and values are clamped',()=>{
 assert.throws(()=>normalizeMeter({id:'x',label:'X',kind:'pool',value:1,max:0}));
 assert.throws(()=>normalizeMeter({id:'x',label:'X',kind:'weird',value:1,max:3}));
 assert.equal(normalizeMeter({id:'x',label:'X',kind:'pool',value:9,max:3}).value,3);
});
test('LOTM meters mirror the energy record and add no state',()=>{
 assert.deepEqual(lotmMeters(null),[]);
 const e={policy:LOTM_ENERGY,reserve:2,strain:5};
 const [pool,strain]=lotmMeters(e);
 assert.equal(pool.value,2);assert.equal(pool.max,LOTM_ENERGY.capacity);
 assert.equal(strain.value,5);assert.equal(strain.max,LOTM_ENERGY.strainLimit);
 assert.equal(normalizeMeter(strain).state,'high');
 assert.equal(normalizeMeter({...strain,value:LOTM_ENERGY.strainLimit}).state,'full');
 assert.deepEqual(e,{policy:LOTM_ENERGY,reserve:2,strain:5});
});
