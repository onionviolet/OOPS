import test from 'node:test';
import assert from 'node:assert/strict';
import {PROFILE,enrollGrowth,settleAward} from '../src/absorb_p23/growth_profile/profile.js';
import {observeGrowthEarned,earnedNativeSkillDelta,validateGrowthEarned,noHealGrowthVitals} from '../src/absorb_p23/host_joins/growth_profile.js';
const c={worldId:PROFILE.worldId,profileId:PROFILE.id,bodyId:'native.player.body',bodySupported:true,nativeAlive:true,ownsSave:true,saveBlocked:false,nativeEligible:true,known:true,idle:true,clock:0,conditionEligible:true,resourcesEligible:true,occupation:{kind:'reading',jobId:'native.read.1',eligible:true},conflictingAction:false,bodyConflict:false,resourceConflict:false};
test('old accumulated XP is not backfilled; actual positive native deltas retain hundredths',()=>{
 const profile=enrollGrowth(c),before={Literacy:900000},after={Literacy:900000};
 assert.equal(observeGrowthEarned(undefined,profile,c,{before,after,sequence:1}).counter,undefined);
 const r=observeGrowthEarned(undefined,profile,c,{before,after:{Literacy:900000.25},sequence:1});assert.equal(r.counter.earnedUnits,25);assert.equal(r.counter.awardedUnits,0);
 assert.equal(earnedNativeSkillDelta({Cooking:10,Alchemy:20},{Cooking:11,Alchemy:20}),100);
});
test('each further earned threshold can fund a bounded reward without a lifetime once gate',()=>{
 let profile=enrollGrowth(c),counter;
 const first=observeGrowthEarned(counter,profile,c,{before:{Literacy:0},after:{Literacy:150000},sequence:1});counter=first.counter;profile=first.profile;
 assert.equal(counter.awardedUnits,15000000);assert.equal(profile.award.remaining,150000);
 assert.equal(observeGrowthEarned(counter,profile,c,{before:{Literacy:0},after:{Literacy:150000},sequence:1}).counted,false);
 while(profile.award.remaining)profile=settleAward(profile,c,8).next;
 const second=observeGrowthEarned(counter,profile,c,{before:{Literacy:150000},after:{Literacy:300000},sequence:2});assert.equal(second.counter.awardedUnits,30000000);assert.equal(second.profile.award.remaining,150000);
});
test('unsupported contexts and schemas do not count or mutate future grant receipts',()=>{
 const profile=enrollGrowth(c),before=structuredClone(profile);
 const r=observeGrowthEarned(undefined,profile,{...c,worldId:'base.frontier'},{before:{},after:{Literacy:1},sequence:1});assert.equal(r.counter,undefined);assert.deepEqual(profile,before);
 assert.throws(()=>validateGrowthEarned({schema:2}));
});
test('growth maximum-vital source preserves absolute health and stamina, including clamping departure',()=>{
 const stats={full:{max_health:60,health:22,max_stamina:40,stamina:15},total_multiplier:{max_health:1,max_stamina:1}};
 const next=noHealGrowthVitals({}, {max_health:2},stats);assert.equal(next.hpToFull,40);assert.equal(next.staminaToFull,25);
 const departure=noHealGrowthVitals({max_health:2},{},{...stats,full:{...stats.full,max_health:62,health:61}});assert.equal(departure.hpToFull,0);
});
