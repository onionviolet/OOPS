import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteWorldDuty,settleWorldDuty} from '../src/world_enforcement.js';
import {enforcementCases} from '../src/data/world_enforcement.js';
import {createVillageCareer,beginVillageShift,finishVillageShift,resolveVillageKit,quoteVillageKit,migrateVillageCareer} from '../src/village_career.js';
test('three authorities attach only their own observed consequence and costs to the kernel receipt',()=>{
 for(const row of enforcementCases){
    const clear=quoteWorldDuty(row,{}),observed={[row.detection]:true},q=quoteWorldDuty(row,observed);
    assert.deepEqual(clear.effects,[]);assert.throws(()=>settleWorldDuty(row,observed,clear.fingerprint),/changed/);
    const event=settleWorldDuty(row,observed,q.fingerprint);
    assert.equal(event.truth.breach.enforcer,row.enforcer);assert.deepEqual(event.truth.effects,q.effects);assert.deepEqual(event.truth.costs,row.costs);
 }
});
test('old kit due state quotes once and retained custody creates one durable debt',()=>{
 const due=finishVillageShift(beginVillageShift(createVillageCareer()),false),q=quoteVillageKit(due);
 const kept=resolveVillageKit(due,'keep',q.fingerprint);assert.equal(kept.debt,50);
 assert.equal(migrateVillageCareer({village_career:kept}).lastShift.enforcement.amount,50);
 assert.throws(()=>resolveVillageKit(kept,'keep',q.fingerprint));
 assert.equal(resolveVillageKit(kept,'return').debt,0);
});
test('ordinary action terms still settle when no local duty was broken',()=>{
 const row={...enforcementCases[0],actionCosts:[{resource:'time',amount:1}],actionConsequences:[{kind:'visitedDoor'}]};
 const quote=quoteWorldDuty(row,{}),event=settleWorldDuty(row,{},quote.fingerprint);
 assert.deepEqual(event.truth.costs,row.actionCosts);
 assert.deepEqual(event.truth.effects,row.actionConsequences);
});
