import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {VILLAGE_GROWTH_POINTS as village} from '../src/data/growth_points.js';
import {emptyGrowthPoints,growthPointBalance,growthPointModifiers,quoteGrowthPoints,quotePointRespec,
    readGrowthPoints,settlePointCrossing,settlePointRecovery} from '../src/growth_points.js';

const fixture=name=>JSON.parse(readFileSync(new URL('./fixtures/'+name,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const {azarinth,dragoneye}=fixture('growth-points-canon.json');
const cross=(rule,track,before,after,state=emptyGrowthPoints())=>settlePointCrossing(rule,state,{track,before,after});

test(azarinth.source,()=>{
    const bank=cross(azarinth,'class',4,6);
    assert.deepEqual(bank,cross(azarinth,'class',5,6,cross(azarinth,'class',4,5)));
    assert.equal(growthPointBalance(azarinth,bank,'free'),10);
    const allocation=quoteGrowthPoints(azarinth,bank,'wisdom',5).next;
    assert.equal(growthPointBalance(azarinth,allocation,'free'),5);
    assert.deepEqual(growthPointModifiers(azarinth,allocation),{wisdom:5});
    assert.match(quotePointRespec(azarinth,allocation,{}).reason,/no respec/);
    assert.equal(cross(azarinth,'class',6,6,bank),undefined);
});

test(dragoneye.source,()=>{
    const bank=cross(dragoneye,'earth',1,3);
    assert.deepEqual(bank.earned,{free:6,human:2});
    const unbalanced=quoteGrowthPoints(dragoneye,bank,'strength',2);
    assert.match(unbalanced.warning,/can be fatal/);
    const paired=quoteGrowthPoints(dragoneye,unbalanced.next,'dexterity',2);
    assert.equal(paired.warning,undefined);
    assert.deepEqual(growthPointModifiers(dragoneye,paired.next),{strength:2,dexterity:2,manaRegeneration:-96});
    assert.equal(growthPointBalance(dragoneye,paired.next,'human'),2);
    assert.match(quoteGrowthPoints(dragoneye,paired.next,'speed',3).reason,/Bank more/);
});

test('Legacy Village sleep skill and EV ledger are accepted with an empty point bank',()=>{
    const old=fixture('skill-evolution-a2c.json');
    const original=structuredClone(old);
    assert.deepEqual(readGrowthPoints(village,old.growth_points),emptyGrowthPoints());
    assert.deepEqual(old,original);
    const bank=cross(village,'Sleeping',0,3);
    const next=quoteGrowthPoints(village,bank,'deep-rest',2).next;
    assert.deepEqual(readGrowthPoints(village,JSON.parse(JSON.stringify(next))),next);
    assert.throws(()=>readGrowthPoints(village,{...next,earned:{recovery:1}}),/exceeds/);
    const modifiers=growthPointModifiers(village,next);
    assert.deepEqual(settlePointRecovery(modifiers,3,5),{health:3,upkeep:0.75});
    assert.deepEqual(settlePointRecovery(modifiers,10,1),{health:8,upkeep:1});
    assert.deepEqual(settlePointRecovery(modifiers,0,5),{health:0,upkeep:0});
    assert.ok(quotePointRespec(village,next,{}).reason);
    assert.deepEqual(quotePointRespec(village,next,{atBed:true}).next,bank);
});
