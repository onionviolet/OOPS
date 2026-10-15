import test from 'node:test';
import assert from 'node:assert/strict';
import {beginSimulationRenderBatch,deferSimulationRender,endSimulationRenderBatch,framedSimulationRead,withSimulationFrame} from '../src/simulation_render.js';

const copy=value=>({...value});
function counter(){let builds=0;return {build:()=>({n:++builds}),get builds(){return builds;}};}

test('a frame builds each read once per unchanged world and copies it per caller',()=>{
    const world={},c=counter();
    const [a,b]=withSimulationFrame(world,()=>[framedSimulationRead(world,'ctx',c.build,copy),framedSimulationRead(world,'ctx',c.build,copy)]);
    assert.equal(c.builds,1);
    assert.deepEqual(a,b);assert.notEqual(a,b);
    a.n=99;assert.equal(b.n,1);
});
test('no frame or a changed world builds fresh every time',()=>{
    const world={},next={},c=counter();
    framedSimulationRead(world,'ctx',c.build,copy);framedSimulationRead(world,'ctx',c.build,copy);
    assert.equal(c.builds,2);
    withSimulationFrame(world,()=>{framedSimulationRead(next,'ctx',c.build,copy);framedSimulationRead(next,'ctx',c.build,copy);});
    assert.equal(c.builds,4);
});
test('a nested frame restores the outer frame and its cached reads',()=>{
    const world={},inner={},c=counter();
    withSimulationFrame(world,()=>{
        framedSimulationRead(world,'ctx',c.build,copy);
        withSimulationFrame(inner,()=>framedSimulationRead(inner,'ctx',c.build,copy));
        framedSimulationRead(world,'ctx',c.build,copy);
    });
    assert.equal(c.builds,2);
});
test('a dev-stepping batch flushes coalesced renders inside one frame',()=>{
    const world={},c=counter();let renders=0;
    beginSimulationRenderBatch();
    for(let i=0;i<3;i++)assert.equal(deferSimulationRender('panel',()=>{renders++;framedSimulationRead(world,'ctx',c.build,copy);}),true);
    assert.equal(deferSimulationRender('other',()=>framedSimulationRead(world,'ctx',c.build,copy)),true);
    endSimulationRenderBatch(world);
    assert.equal(renders,1);assert.equal(c.builds,1);
    assert.equal(deferSimulationRender('panel',()=>{}),false);
});

// D1: simulationFacts reuse inside a frame keys on content, never context identity.
import {framedSimulationFacts} from '../src/simulation_render.js';
import {createContentRegistry, createExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation} from '../src/simulation.js';
import {simulationFacts} from '../src/simulation_effects.js';
function factsCounter(){let builds=0;return {build:()=>({n:++builds,'actor.location':'Village'}),get builds(){return builds;}};}
test('framed facts build once for matching fresh contexts and copy per caller',()=>{
    const world={sequence:1,clock:5},registry={},gameplay={player:{inventory:{}}},c=factsCounter();
    const ctx=()=>({actorId:'player',targetId:null,gameplay,facts:{location:'Village',strength:3}});
    const [a,b]=withSimulationFrame(world,()=>[framedSimulationFacts(world,ctx(),registry,c.build),framedSimulationFacts(world,ctx(),registry,c.build)]);
    assert.equal(c.builds,1);assert.deepEqual(a,b);assert.notEqual(a,b);
    a.n=99;assert.equal(b.n,1);
});
test('framed facts rebuild when any read input differs or the frame does not match',()=>{
    const world={sequence:1,clock:5},registry={},c=factsCounter();
    const ctx={actorId:'player',targetId:null,facts:{location:'Village'}};
    withSimulationFrame(world,()=>{
        framedSimulationFacts(world,ctx,registry,c.build);
        ctx.facts.location='Shack';framedSimulationFacts(world,ctx,registry,c.build);
        framedSimulationFacts(world,{...ctx,targetId:'oldCraftsman'},registry,c.build);
        framedSimulationFacts(world,{...ctx,extra:{}},registry,c.build);
        framedSimulationFacts(world,ctx,{},c.build);
        framedSimulationFacts({...world},ctx,registry,c.build);
        world.clock=6;framedSimulationFacts(world,ctx,registry,c.build);
    });
    assert.equal(c.builds,7);
    framedSimulationFacts(world,ctx,registry,c.build);framedSimulationFacts(world,ctx,registry,c.build);
    assert.equal(c.builds,9);
});
test('real simulationFacts inside a frame equals a fresh build and stays isolated',()=>{
    const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{commands:[{id:'test.noop',revision:1,label:'Wait',effects:[]}]}});
    const base={actorId:'player',facts:{location:'Village'},gameplay:{player:{inventory:{[JSON.stringify({id:'Bread'})]:2},skills:{},reputation:{}}},equipment:{player:{}},external:{money:0}};
    const state=enrollSimulation(createExpansionState(12),registry,base).state,ctx=()=>({...base,targetId:null});
    const outside=simulationFacts(state,ctx(),registry);
    withSimulationFrame(state,()=>{
        const first=simulationFacts(state,ctx(),registry);for(const k of Object.keys(first))first[k]=null;
        assert.deepEqual(simulationFacts(state,ctx(),registry),outside);
    });
});

import {shownOrDeferred} from '../src/panel_reveal.js';
test('a skipped panel renders once in the observer pass that reveals it',()=>{
    let callback=null,disconnected=0;const saved={MutationObserver:globalThis.MutationObserver,document:globalThis.document};
    globalThis.MutationObserver=class {constructor(cb){callback=cb;} observe(){} disconnect(){disconnected++;}};
    globalThis.document={documentElement:{}};
    try {
        let open=false,renders=0;const render=()=>{renders++;};
        assert.equal(shownOrDeferred(render,()=>open),false);
        callback();assert.equal(renders,0);
        open=true;callback();assert.equal(renders,1);assert.equal(disconnected,1);
        assert.equal(shownOrDeferred(render,()=>open),true);
    } finally {Object.assign(globalThis,saved);}
});
