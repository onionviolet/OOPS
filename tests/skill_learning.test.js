import test from 'node:test';
import assert from 'node:assert/strict';
import {practiceLearning,quoteLearning} from '../src/skill_learning.js';
import {watchcraftLesson,learningCases} from '../src/data/skill_learning.js';
import {beginTessaInstruction,advanceTessaInstruction,migrateVillageCareer} from '../src/village_career.js';
test('an old promoted career resumes native Watchcraft progress without adding XP or a new save field',()=>{
    const career=migrateVillageCareer({village_career:{schema:1,rank:1,shifts:2,completed:2,returned:2,loan:null,debt:0,lastShift:null}});
    let state=beginTessaInstruction(career);
    for(let i=0;i<3;i++)state=advanceTessaInstruction(state,{inVillage:true,alive:true,meditating:true});
    state=migrateVillageCareer({village_career:JSON.parse(JSON.stringify(state))});
    assert.equal(advanceTessaInstruction(state,{alive:true}).watchcraft.tutorMinutes,3);
    assert.equal(quoteLearning(watchcraftLesson,3,{promoted:true}).timeLeft,3);
    for(let i=0;i<3;i++)state=advanceTessaInstruction(state,{inVillage:true,alive:true,meditating:true});
    assert.equal(state.watchcraft.tutoring,false);
});
test('the same learning law admits supervised drills, a deadline trial and a qualitative perception sign',()=>{
    const [run,fire,aura]=learningCases;
    assert.equal(practiceLearning(run,0,{running:true,monthEnded:true},1).failed,true);
    assert.equal(quoteLearning(run,0,{twoLaps:true}).complete,true);
    assert.deepEqual(quoteLearning(fire,0,{}).missing,['fireClass']);
    assert.equal(practiceLearning(fire,0,{fireClass:true,controllingFire:true,heatBeyondControl:true},4).progress,4);
    assert.equal(quoteLearning(aura,0,{holdsPerception:true}).complete,true);
    for(const row of learningCases)assert.match(row.locator,/en b\d+ c\d+ p\d+/);
});
