import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareFoundationSave} from '../src/save_compatibility.js';
import {beginSimulationRenderBatch,endSimulationRenderBatch} from '../src/simulation_render.js';

function countParses(run) {
    const parse=JSON.parse;let calls=0;
    JSON.parse=function(...args){calls++;return parse(...args);};
    try {run();return calls;} finally {JSON.parse=parse;}
}
const input=amount=>({name:'Hero',inventory:{'{"id":"Dewleaf"}':{count:amount},'{"id":"Wood"}':{count:amount}},nested:{value:amount}});
test('render:false caches key classification while keeping each new save value and retirement',()=>{
    const expected=Array.from({length:20},(_,i)=>prepareFoundationSave(input(i+1)));
    const normal=countParses(()=>{for(let i=0;i<20;i++)assert.deepEqual(prepareFoundationSave(input(i+1)),expected[i]);});
    const batched=countParses(()=>{
        beginSimulationRenderBatch();
        try {for(let i=0;i<20;i++)assert.deepEqual(prepareFoundationSave(input(i+1)),expected[i]);}
        finally {endSimulationRenderBatch();}
    });
    assert.ok(batched<normal/10,{normal,batched});
});
test('classification cache ends at the advance boundary and is disabled in normal play',()=>{
    const once=countParses(()=>prepareFoundationSave(input(1)));
    const twoAdvances=countParses(()=>{for(let i=0;i<2;i++){beginSimulationRenderBatch();try{prepareFoundationSave(input(1));}finally{endSimulationRenderBatch();}}});
    assert.equal(twoAdvances,once*2);
    assert.equal(countParses(()=>{prepareFoundationSave(input(1));prepareFoundationSave(input(1));}),once*2);
});
test('cached keys do not bypass malformed retirement data or new key discovery',()=>{
    beginSimulationRenderBatch();
    try {
        prepareFoundationSave(input(1));
        assert.throws(()=>prepareFoundationSave({...input(1),retired_content:{schema:999,entries:[]}}),/Unsupported retired/);
        const changed=input(2);changed.inventory[' {"id":"Meridian pellet"} ']={count:7};
        const result=prepareFoundationSave(changed);
        assert.equal(result.save.inventory[' {"id":"Meridian pellet"} '],undefined);
        assert.equal(result.retired.entries.find(e=>e.path.at(-1)===' {"id":"Meridian pellet"} ').value.count,7);
    } finally {endSimulationRenderBatch();}
});
