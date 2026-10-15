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
