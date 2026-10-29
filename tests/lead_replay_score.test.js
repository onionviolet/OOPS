// Synthetic only: no source text, names or private ledger data.
import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreReplay,stateHashWithoutNaturalClock,executeRows,compareRunSnapshots,compareAtGameMinute,scoreReproducibleReplay,CLOCK_COMPARISON_OMISSIONS,performReplayControl} from '../scripts/headless/lead_runs/lotm_ui_replay.mjs';

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
        skillRecords:{tracked:{Breathing:{seen:wall,other:wall},Other:{seen:wall}},revision:1},
        'current time':{minute},expansion:{clock:20,rng,streams:{root:44}}});
    const first=snapshot(10,30,55),second=snapshot(99,30,55);
    assert.equal(stateHashWithoutNaturalClock(first),stateHashWithoutNaturalClock(second));
    assert.equal(compareRunSnapshots(first,second).identical,true);
    assert.deepEqual(compareRunSnapshots(first,snapshot(99,31,56)).differingPaths,['current time.minute','expansion.rng']);
    const changed=snapshot(99,30,55);changed.expansion.clock=21;
    assert.deepEqual(compareRunSnapshots(first,changed).differingPaths,['expansion.clock']);
    changed.expansion.clock=20;changed.skillRecords.revision=2;
    assert.deepEqual(compareRunSnapshots(first,changed).differingPaths,['skillRecords.revision']);
});

test('paused runs align at the later minute and credit only steps reached in both',async()=>{
    const state=(clock,cash=5)=>({'current time':{minute:clock},expansion:{clock,simulation:{controllers:{village:{craftsman_controller:{due:clock+2}}}}},cash});
    const aligned=await compareAtGameMinute([state(10),state(11)],async (index,target)=>{assert.equal(index,0);return state(target);});
    assert.equal(aligned.target,11);assert.equal(aligned.mode,'exact');assert.equal(aligned.comparison.identical,true);
    const score=scoreReplay([{id:'a'},{id:'b'}],[{id:'a',kind:'control'},{id:'b',kind:'gap'}]);
    assert.deepEqual(scoreReproducibleReplay(score,score,aligned.comparison.identical),{steps:2,reproduced:1,fidelity:0.5});
    const controls=scoreReplay([{id:'a'},{id:'b'}],[{id:'a',kind:'control'},{id:'b',kind:'control'}]);
    assert.deepEqual(scoreReproducibleReplay(controls,controls,aligned.comparison.identical),{steps:2,reproduced:2,fidelity:1});
    const different=await compareAtGameMinute([state(10),state(11,6)],async (_,target)=>state(target));
    assert.deepEqual(different.comparison.differingPaths,['cash']);
    assert.equal(scoreReproducibleReplay(score,score,different.comparison.identical).reproduced,0);
});

test('a control that cannot be reached records a typed gap instead of reproducibility credit',async()=>{
    const rows=['a','b'].map(id=>({id,status:'mapped',route:[{actionId:id,place:'target'}],anchors:{place:'target',purseDelta:0}}));
    const io={read:async()=>({place:'target',cash:10,knowledge:{}}),screenshot:async()=>{},move:async(_,leg)=>leg.actionId==='b'?{gap:'Control unavailable'}:null};
    const first=await executeRows({},rows,io),second=await executeRows({},rows,io);
    assert.equal(first.receipts[1].gapKind,'missing UI path');
    assert.equal(second.receipts[1].gapKind,'missing UI path');
    assert.deepEqual(scoreReproducibleReplay(first.replayScore,second.replayScore,true),{steps:2,reproduced:1,fidelity:0.5});
});

test('an inexact step uses the documented clock exclusions and retains other mismatches',async()=>{
    const state=(clock,cash)=>({'current time':{minute:clock},expansion:{clock,simulation:{controllers:{village:{craftsman_controller:{due:clock+3}}}}},cash});
    const fallback=await compareAtGameMinute([state(10,5),state(11,5)],async ()=>state(12,5));
    assert.equal(fallback.mode,'clock-excluded');assert.deepEqual(fallback.exclusions,[...CLOCK_COMPARISON_OMISSIONS]);
    assert.deepEqual(fallback.clocks,[10,11]);assert.equal(fallback.comparison.identical,true);
    const different=await compareAtGameMinute([state(10,5),state(11,6)],async ()=>{throw Error('step unavailable');});
    assert.deepEqual(different.comparison.differingPaths,['cash']);
});

test('canon-only execution skips setup input and uses only the recorded step route',async()=>{
    const row={id:'a',status:'mapped',time:{day:1,from:0,to:60},setup:[{actionId:'support'}],route:[{actionId:'canon'}],anchors:{place:'target',purseDelta:0}};
    const calls=[];
    const io={read:async()=>({place:'target',cash:10,knowledge:{}}),waitBand:async()=>{},screenshot:async()=>{},move:async(_,leg)=>calls.push(leg.actionId)};
    await executeRows({},[row],io,{canonOnly:true});
    assert.deepEqual(calls,['canon']);
});

test('paused replay steps each quoted job, reproduces act times and detects a one-minute delay',async()=>{
    async function replay(delaySecond=0) {
        const state={expansion:{clock:10,simulation:{people:{player:{location:'room'}},jobs:[],knowledge:{player:{}},log:[]}}};
        const snapshot=async()=>structuredClone(state);
        const port={snapshot,click:async id=>{
            assert.equal(state.expansion.simulation.jobs.length,0,'previous job must finish first');
            if (id==='b') state.expansion.clock+=delaySecond;
            const now=state.expansion.clock;
            state.expansion.simulation.knowledge.player[id]={at:now};
            state.expansion.simulation.log.push({at:now});
            state.expansion.simulation.jobs.push({id,actorId:'player',due:now+2});
            return {quotedMinutes:2};
        },advanceTo:async target=>{
            state.expansion.clock=target;
            for(const job of state.expansion.simulation.jobs) state.expansion.simulation.knowledge.player[job.id].result={at:target};
            state.expansion.simulation.jobs=[];
            return snapshot();
        }};
        const rows=['a','b'].map(id=>({id,status:'mapped',route:[{actionId:id,place:'room'}],anchors:{place:'room',purseDelta:0}}));
        const io={read:async()=>({place:'room',cash:0,knowledge:{}}),screenshot:async()=>{},move:async(_,leg)=>performReplayControl(port,leg)};
        const run=await executeRows({},rows,io);return {run,state:await snapshot()};
    }
    const first=await replay(),second=await replay(),late=await replay(1);
    assert.equal(compareRunSnapshots(first.state,second.state).identical,true);
    assert.equal(scoreReproducibleReplay(first.run.replayScore,second.run.replayScore,true).reproduced,2);
    const mismatch=compareRunSnapshots(first.state,late.state);
    assert.equal(mismatch.identical,false);
    assert.ok(mismatch.differingPaths.includes('expansion.simulation.knowledge.player.b.at'));
    assert.equal(scoreReproducibleReplay(first.run.replayScore,late.run.replayScore,mismatch.identical).reproduced,0);
});

test('synchronous timed controls are not advanced a second time',async()=>{
    const state={expansion:{clock:7,simulation:{jobs:[],people:{player:{location:'room'}}}}};let steps=0;
    const io={snapshot:async()=>structuredClone(state),click:async()=>{state.expansion.clock+=3;return {quotedMinutes:3};},advanceTo:async()=>{steps++;}};
    assert.equal(await performReplayControl(io,{actionId:'wait',place:'room'}),null);
    assert.equal(state.expansion.clock,10);assert.equal(steps,0);
});
