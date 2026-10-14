import test from 'node:test';
import assert from 'node:assert/strict';
import {createExposure,validateExposure} from '../src/absorb_p23/exposure/exposure.js';
import {validateTrancheOneEnvelope,stageExposureJoin,stageHouseholdJoin} from '../src/absorb_p23/host_joins/tranche_one.js';
const plan=clock=>({state:{clock,sequence:1},gameplay:{player:{inventory:{},skills:{Famine:{xp:0,enabled:true},'Cold resistance':{xp:0,enabled:true}},reputation:{}}}});
const context={played:true,homeWorld:true,needsFood:true,pacing:{schema:1,hungerEnabled:true,fullness:20},maxStamina:40,staminaToFull:0};
test('old optional absence is retained; clock-cursor and unsupported schema preflight reject',()=>{
 const save={expansion:{clock:7,sequence:3}};assert.equal(validateTrancheOneEnvelope(save),save);assert.equal(Object.hasOwn(save,'p23_exposure'),false);
 for(const x of [{...createExposure(7),schema:2},createExposure(6),{...createExposure(7),unknown:true}])assert.throws(()=>validateTrancheOneEnvelope({...save,p23_exposure:x}));
});
test('passive native XP stages as exact hundredths with matching saved clock and no input mutation',()=>{
 const raw=createExposure(7),before=structuredClone(raw),p=plan(10);stageExposureJoin(p,raw,7,context);
 assert.equal(p.gameplay.player.skills.Famine.xp,.03);assert.equal(p.nativePatch.p23_exposure.cursor,10);assert.deepEqual(raw,before);
 assert.doesNotThrow(()=>validateTrancheOneEnvelope({expansion:p.state,...p.nativePatch}));
});
test('inert old native clock advances do not initialize an optional exposure family',()=>{
 const p=plan(4);stageExposureJoin(p,undefined,0,{...context,pacing:{hungerEnabled:false}});assert.equal(p.nativePatch,undefined);
});
test('storm costs clamp native stamina and do not stage HP damage or action XP multipliers',()=>{
 const p=plan(6),raw={...createExposure(0),hazardousEnabled:true};stageExposureJoin(p,raw,0,{...context,pacing:{weatherEnabled:true},exposureEligible:true,outdoors:true,sheltered:false,maxStamina:1});
 assert.equal(p.native.staminaToFull,1);assert.equal(Object.hasOwn(p.native,'hpToFull'),false);assert.equal(p.gameplay.player.skills['Cold resistance'].xp,.12);
});
test('household fuel preflight rejects denied custody before any native owner publication',()=>{
 const p=plan(0),c={sequence:0,clock:0,homeId:'base.frontier:Shack',atHome:true,homeOwned:true,alive:true,controlled:true,hearthOwned:true,ownedInventory:{'{"id":"Rough wood log"}':1},assertDisposition:()=>{throw Error('borrowed');}};
 p.gameplay.player.inventory={'{"id":"Rough wood log"}':1};const before=structuredClone(p);
 assert.throws(()=>stageHouseholdJoin(p,undefined,c,'light'),/borrowed/);assert.deepEqual(p,before);
});
