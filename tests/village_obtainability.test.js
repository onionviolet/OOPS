import test from 'node:test';
import assert from 'node:assert/strict';
import {buildVillageObtainability,reachBand,openingBuyPrice} from '../src/village_obtainability.js';
import {readVillageSupplyTables,readVillageObtainability} from '../scripts/village_supply_tables.mjs';
test('live starting stock, Village market and gather routes retain rate, tool and opening price',()=>{
 const t=readVillageSupplyTables(),before=structuredClone(t),index=buildVillageObtainability(t);assert.deepEqual(t,before);
 assert.equal(index['Stale bread'].earliestStage,'inventory');assert.equal(index['Stale bread'].routes.find(r=>r.kind==='inventory').count,5);
 assert.equal(index['Stale bread'].routes.find(r=>r.kind==='trader').price,80);assert.equal(index['Survey rope'].routes[0].price,16);
 assert.equal(index['Rough wood log'].effortMinutes,60);assert.equal(index['Tree sap'].effortMinutes,3000);
 assert.equal(reachBand(index['Stale bread'],{quantity:3,money:102}),'ready');assert.equal(reachBand(index['Rough wood log']),'unknown');assert.equal(reachBand(index['Rat pelt']),'unknown');assert.equal(reachBand(index['nonexistent']),null);
});
test('real rare rat parts and reachable starting recipes do not masquerade as easy supplies',()=>{
 const index=readVillageObtainability();assert.ok(index['Rat pelt'].routes.every(r=>r.kind==='drop'&&r.rate<=0.02));assert.ok(index['Rat tail'].routes.every(r=>r.rate<=0.08));
 assert.ok(index['Rat pelt'].effortMinutes>=150);assert.ok(index['Rat tail'].effortMinutes>=38);
 assert.ok(index['Processed rough wood'].routes.some(r=>r.kind==='recipe'));assert.ok(index['Processed rat pelt'].routes.some(r=>r.kind==='recipe'));
 assert.equal(index['Healing balm'],undefined); // locked recipe, no Village stock
});
test('bands react to known route, funds and stock without revealing or changing table data',()=>{
 const t=readVillageSupplyTables();t.stock=t.stock.map(r=>({...r,known:true,available:true}));const index=buildVillageObtainability(t);
 assert.equal(reachBand(index['Survey rope'],{money:16}),'ready');assert.equal(reachBand(index['Survey rope'],{money:15}),'stretch');assert.equal(reachBand(index['Survey rope'],{money:100,quantity:2}),'stretch');
 assert.equal(openingBuyPrice(51,4),210);
});
