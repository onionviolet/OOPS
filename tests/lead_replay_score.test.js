// Synthetic only: no source text, names or private ledger data.
import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreReplay,stateHashWithoutNaturalClock,executeRows} from '../scripts/headless/lead_runs/lotm_ui_replay.mjs';

test('fidelity counts reached events in order inside their windows and keeps typed misses',()=>{
    const rows=['a','b','c','d'].map(id=>({id}));
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

test('null-player state hashes ignore natural clock fields but retain other state',()=>{
    assert.equal(stateHashWithoutNaturalClock({clock:10,life:{clock:11,cash:5}}),stateHashWithoutNaturalClock({clock:99,life:{clock:42,cash:5}}));
    assert.notEqual(stateHashWithoutNaturalClock({clock:10,cash:5}),stateHashWithoutNaturalClock({clock:10,cash:6}));
});

test('canon-only execution skips setup input and uses only the recorded step route',async()=>{
    const row={id:'a',status:'mapped',time:{day:1,from:0,to:60},setup:[{actionId:'support'}],route:[{actionId:'canon'}],anchors:{place:'target',purseDelta:0}};
    const calls=[];
    const io={read:async()=>({place:'target',cash:10,knowledge:{}}),waitBand:async()=>{},screenshot:async()=>{},move:async(_,leg)=>calls.push(leg.actionId)};
    await executeRows({},[row],io,{canonOnly:true});
    assert.deepEqual(calls,['canon']);
});
