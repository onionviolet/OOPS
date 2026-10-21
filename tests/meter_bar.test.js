import test from 'node:test';
import assert from 'node:assert/strict';
import {meterState,normalizeMeter} from '../src/meter_bar.js';
import {lotmMeters} from '../src/book_world_lotm_host.js';
import {LOTM_ENERGY} from '../src/book_world_lotm_ids.js';
// WDI49-WDI60 first slice: a pool reads worst when empty, an accumulator when full, and the LOTM
// meters are views of the energy record (no new saved field).
test('meter state is read from the worse end for each kind',()=>{
 assert.equal(meterState('pool',3,3),'ok');assert.equal(meterState('pool',2,3),'ok');assert.equal(meterState('pool',1,3),'low');
 assert.equal(meterState('pool',0,3),'empty');
 assert.equal(meterState('accumulator',0,6),'ok');assert.equal(meterState('accumulator',5,6),'high');
 assert.equal(meterState('accumulator',6,6),'full');
});
test('a bad meter spec is refused and values are clamped',()=>{
 assert.throws(()=>normalizeMeter({id:'x',label:'X',kind:'pool',value:1,max:0}));
 assert.throws(()=>normalizeMeter({id:'x',label:'X',kind:'weird',value:1,max:3}));
 assert.equal(normalizeMeter({id:'x',label:'X',kind:'pool',value:9,max:3}).value,3);
});
test('fractional endpoints and completed tracks have truthful states',()=>{
 assert.equal(normalizeMeter({id:'p',label:'Pool',kind:'pool',value:.5,max:.5}).state,'ok');
 assert.equal(normalizeMeter({id:'p',label:'Pool',kind:'pool',value:0,max:.5}).state,'empty');
 assert.equal(normalizeMeter({id:'t',label:'Track',kind:'track',value:0,max:1}).state,'ok');
 assert.equal(normalizeMeter({id:'t',label:'Track',kind:'track',value:1,max:1}).state,'complete');
 assert.equal(meterState('accumulator',0,1),'ok');
 assert.equal(meterState('accumulator',.8,1,0.25),'high');
});
test('rates, separately named stock, observations and deltas retain their units and subject lifetime',()=>{
 const value=normalizeMeter({id:'flow',label:'Warmth',kind:'accumulator',value:4,max:8,rate:{value:-2,unit:'°/h'},band:{min:2,max:6,unit:'°'},stock:{free:3,held:1,proposed:2,unit:'flasks'},observation:{text:'Last checked 10 min ago'},subject:'tool:e2.4',change:{subject:'tool:e2.4',previous:6,current:4,lifetime:'last check'}});
 assert.deepEqual(value.annotations,['Useful range 2–6 °','-2 °/h','3 free · 1 held · 2 proposed flasks','Last checked 10 min ago','-2 since previous last check']);
 assert.deepEqual(normalizeMeter({id:'x',label:'X',kind:'pool',value:1,max:2,subject:'a',change:{subject:'b',previous:0,current:1,lifetime:'last check'}}).annotations,[]);
 assert.deepEqual(normalizeMeter({id:'unknown',label:'Warmth',kind:'pool',value:2,max:5}).annotations,[],'no useful endpoints are implied without owner-supplied knowledge');
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

test('prior segment is subject-bound and capacity changes do not look like recovery',()=>{
 const spec={id:'tool',subject:'copy1',label:'condition',kind:'pool',value:6,max:10,change:{subject:'copy1',previous:9,current:6,lifetime:'observation'}};
 assert.deepEqual(normalizeMeter(spec).change,{from:60,width:30,direction:'loss'});
 assert.equal(normalizeMeter({...spec,subject:'copy2'}).change,null);
 const resized=normalizeMeter({...spec,max:12,change:{...spec.change,previousMax:10}});assert.equal(resized.change,null);assert.match(resized.annotations.join(' '),/Capacity 10 → 12/);
});
