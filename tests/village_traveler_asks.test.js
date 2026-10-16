import test from 'node:test';
import assert from 'node:assert/strict';
import {readVillageSupplyTables,readVillageObtainability} from '../scripts/village_supply_tables.mjs';
import {buildVillageObtainability} from '../src/village_obtainability.js';
import {VILLAGE_ASKS,askPool,askFee,feeFromBasis,drawVillageAsk} from '../src/village_traveler_asks.js';
test('every authored template ask and quantity has a real priced route and reserved grade field',()=>{
 const index=readVillageObtainability();
 for(const [template,entries] of Object.entries(VILLAGE_ASKS)) {assert.equal(askPool(template,index).length,entries.length);for(const a of entries){assert.equal(a.grade,null);assert.ok(a.tags.length&&a.fiction&&a.clue);for(let q=a.quantity[0];q<=a.quantity[1];q++)for(const b of ['ready','stretch','unknown'])assert.ok(Number.isSafeInteger(askFee(index[a.item],q,b).reward));}}
 assert.throws(()=>askFee(null,1,'ready'),/route/);
});
test('fees cover actual opening trader price and scale with count, work and discovery',()=>{
 const index=readVillageObtainability();assert.deepEqual(askFee(index['Survey rope'],1,'ready'),{reward:22,feeBasis:{base:16,band:'ready'}});
 assert.equal(askFee(index['Stale bread'],3,'ready').reward,302); // replace all three, not a free starting-stock fee
 assert.equal(askFee(index.Coal,3,'ready').reward,107);
 assert.ok(askFee(index['Rat pelt'],1,'unknown').reward>100);
 for(const a of Object.values(VILLAGE_ASKS).flat()) {const fees=['ready','stretch','unknown'].map(b=>askFee(index[a.item],1,b).reward);assert.ok(fees[0]<fees[1]&&fees[1]<fees[2]);}
 assert.equal(feeFromBasis(60,'stretch'),95);assert.throws(()=>feeFromBasis(1,'invented'));
});
test('draws mix reach bands with a ready majority when affordable known sources exist',()=>{
 const tables=readVillageSupplyTables();tables.stock=tables.stock.map(r=>({...r,known:true,available:true}));tables.gathers=tables.gathers.map(r=>({...r,known:true}));const index=buildVillageObtainability(tables),counts={ready:0,stretch:0,unknown:0};let rng=12345;
 const draw=n=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return Math.floor((rng>>>0)/0x100000000*n);};
 for(let i=0;i<1000;i++){const ask=drawVillageAsk('hill_carrier',index,{money:102},draw);counts[ask.band]++;assert.equal(ask.reward,askFee(index[ask.item],ask.quantity,ask.band).reward);}
 assert.ok(counts.ready>650&&counts.stretch>100&&counts.unknown>50,JSON.stringify(counts));
 const a=drawVillageAsk('river_walker',index,{money:102},()=>0);assert.equal(a.band,'ready');
});
