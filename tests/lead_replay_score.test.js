// Synthetic only: no source text, names or private ledger data.
import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreReplay,stateHashWithoutNaturalClock,executeRows,compareRunSnapshots} from '../scripts/headless/lead_runs/lotm_ui_replay.mjs';

test('fidelity counts reached events in order inside their windows and keeps typed misses',()=>{
    const rows=['a','b','c','d'].map((id,i)=>({id,locator:`zh 第${i<2?1:2}章 p1`}));
    const score=scoreReplay(rows,[
        {id:'a',kind:'control',orderIndex:0},
        {id:'b',kind:'wait',orderIndex:1},
        {id:'c',kind:'blocked',reason:'The visible control explains the condition.'},
        {id:'d',kind:'gap',reason:'No existing route.'}
    ]);
    assert.deepEqual(score.counts,{control:1,wait:1,blocked:1,gap:1});
    assert.equal(score.reachedInOrder,2);
    assert.equal(score.fidelity,0.5);
    assert.equal(score.rows[2].reason,'The visible control explains the condition.');
    assert.deepEqual(score.byChapter,{1:{steps:2,reachedInOrder:2,fidelity:1},2:{steps:2,reachedInOrder:0,fidelity:0}});
});
test('snapshot mismatch is recorded as paths without throwing or exposing values',()=>{
    const result=compareRunSnapshots({clock:2,life:{cash:4}},{clock:9,life:{cash:5}});
    assert.equal(result.identical,false);
    assert.deepEqual(result.differingPaths,['clock','life.cash']);
    assert.deepEqual(result.mismatch.run1.differingPaths,['clock','life.cash']);
    assert.equal(JSON.stringify(result.mismatch).includes('cash":4'),false);
});

test('out-of-order or out-of-window events do not earn fidelity; blocked outcomes need shown reasons',()=>{
    const rows=[{id:'a'},{id:'b'}];
    const score=scoreReplay(rows,[
        {id:'a',kind:'control',orderIndex:4},
        {id:'b',kind:'wait',orderIndex:3,inWindow:false}
    ]);
    assert.equal(score.reachedInOrder,1);
    assert.equal(score.rows[1].inWindow,false);
    assert.throws(()=>scoreReplay(rows,[{id:'a',kind:'blocked'},{id:'b',kind:'gap'}]),/displayed reason/);
});

test('comparison removes only named wall and tracking fields while keeping game time and random state',()=>{
    const snapshot=(wall,minute,rng)=>({saved_at:wall,total_playtime:wall,last_rewarded_export:wall,
        absorb_local_life:{lastClock:wall,lastHubAttempt:wall,other:7},
        levels:{person:{main_character:{skill_xp:{Breathing:wall,Other:5}}}},
        skillRecords:{tracked:{Breathing:{seen:wall,other:3}}},
        'current time':{minute},expansion:{clock:20,rng,streams:{root:44}}});
    const first=snapshot(10,30,55),second=snapshot(99,30,55);
    assert.equal(stateHashWithoutNaturalClock(first),stateHashWithoutNaturalClock(second));
    assert.equal(compareRunSnapshots(first,second).identical,true);
    assert.deepEqual(compareRunSnapshots(first,snapshot(99,31,56)).differingPaths,['current time.minute','expansion.rng']);
    const changed=snapshot(99,30,55);changed.expansion.clock=21;
    assert.deepEqual(compareRunSnapshots(first,changed).differingPaths,['expansion.clock']);
});

test('canon-only execution skips setup input and uses only the recorded step route',async()=>{
    const row={id:'a',status:'mapped',time:{day:1,from:0,to:60},setup:[{actionId:'support'}],route:[{actionId:'canon'}],anchors:{place:'target',purseDelta:0}};
    const calls=[];
    const io={read:async()=>({place:'target',cash:10,knowledge:{}}),waitBand:async()=>{},screenshot:async()=>{},move:async(_,leg)=>calls.push(leg.actionId)};
    await executeRows({},[row],io,{canonOnly:true});
    assert.deepEqual(calls,['canon']);
});
