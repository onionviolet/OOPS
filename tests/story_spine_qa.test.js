import test from 'node:test';
import assert from 'node:assert/strict';
import {lintStoryContent} from '../scripts/lint_story_spine.mjs';
import {runSeededStory} from '../scripts/run_story_spine.mjs';
import {storyletEvents} from '../src/storylet_content.js';
import {setControllerWakeModeForTests} from '../src/expansion_engine.js';
test('card/request lint runs in npm test and rejects bad refs, impossible/self-locked requirements, unsupported effects and sealed text',()=>{
 assert.deepEqual(lintStoryContent(),[]);
 const base=storyletEvents[0],check=(patch,code)=>assert.ok(lintStoryContent({cards:[{...structuredClone(base),...patch}]}).some(f=>f.code===code),code);
 check({targetId:'missing.person'},'BAD_REF');check({effects:[{type:'unimplemented.magic'}]},'UNSUPPORTED_EFFECT');check({requires:{all:[{fact:'coins',op:'gte',value:9},{fact:'coins',op:'lte',value:2}]}},'UNREACHABLE_REQUIREMENT');
 check({requires:{fact:'actor.storylet.orphan',op:'eq',value:true}},'UNREACHABLE_REQUIREMENT');check({requires:{fact:'actor.storylet.own_lock',op:'eq',value:true},effects:[{type:'fact',scope:'actor',key:'storylet.own_lock',value:true}]},'SELF_LOCKED_REQUIREMENT');
 check({label:'synthetic-sealed-canary'},'SEALED_TEXT');assert.ok(!JSON.stringify(lintStoryContent({cards:[{...base,label:'synthetic-sealed-canary'}]})).includes('synthetic-sealed-canary'));
});
test('headless seeded real scheduler drains budget and preserves draws/receipts across same seed, chunking and reload',()=>{
 // At least 600 real daily deck boundaries are due in one long request, so
 // the budget is exercised by scheduled story work rather than idle polls.
 const options={minutes:7200,chunk:7200};
 const a=runSeededStory(43,options),b=runSeededStory(43,options),c=runSeededStory(43,{minutes:7200,chunk:900,reload:true});
 assert.deepEqual(a.projection,b.projection);assert.deepEqual(a.projection,c.projection);assert.ok(a.budgetReturns>0);
 assert.equal(a.projection.decks['village.daily'].ticks,600);
 const other=runSeededStory(44,{minutes:180});assert.notDeepEqual(a.projection.draws,other.projection.draws);
});
test('seeded story draws and receipts match original controller polling',()=>{
 const previous=setControllerWakeModeForTests(false);let old,queued;
 try {old=runSeededStory(43,{minutes:180});setControllerWakeModeForTests(true);queued=runSeededStory(43,{minutes:180});}
 finally {setControllerWakeModeForTests(previous);}
 assert.deepEqual(queued.projection,old.projection);
});
