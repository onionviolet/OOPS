import test from 'node:test';
import assert from 'node:assert/strict';
import {stageReadingResult,validateTrancheThreeEnvelope} from '../src/absorb_p23/host_joins/tranche_three.js';
import {planReadingCommand,observeReadingClock} from '../src/absorb_p23/reading/runtime.js';
import {ANTHOLOGY} from '../src/absorb_p23/reading/content.js';
const context=clock=>({clock,worldId:'base.frontier',nativeBody:true,alive:true,safe:true,available:true,ownedAnthology:true,readProgressPerMinute:1});
test('host settlement puts XP and finished book in one unpublished envelope and never mutates native books',()=>{
 const start=planReadingCommand(undefined,{type:'startRead',draw:0},context(0));
 const settled=observeReadingClock(start.state,context(12)),books={'ABC for kids':{accumulated_time:2}},gameplay={player:{inventory:{},reputation:{},skills:{Literacy:{enabled:true,xp:0}}}};
 const plan=stageReadingResult({state:{clock:12},gameplay},settled,{books});
 assert.equal(plan.gameplay.player.skills.Literacy.xp,8);assert.equal(plan.nativePatch.books[ANTHOLOGY].accumulated_time,12);assert.deepEqual(books,{'ABC for kids':{accumulated_time:2}});assert.equal(plan.p00ReadingNotices.length,1);
 assert.throws(()=>validateTrancheThreeEnvelope({expansion:plan.state}),/finished native book/);
 validateTrancheThreeEnvelope({expansion:plan.state,books:plan.nativePatch.books});
 const again=observeReadingClock(settled.state,context(12));assert.deepEqual(again.effects,[]);
});
test('host optional absence remains absent and unsupported reading schemas reject before publication',()=>{
 validateTrancheThreeEnvelope({});assert.throws(()=>validateTrancheThreeEnvelope({expansion:{clock:0,p23Reading:{schema:2}}}),/schema/);
 const plan={state:{clock:0},gameplay:{}};stageReadingResult(plan,{state:undefined,effects:[]},{books:{}});assert.equal(Object.hasOwn(plan.state,'p23Reading'),false);
});
