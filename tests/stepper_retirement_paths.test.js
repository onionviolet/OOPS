import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareFoundationSave,retainRetiredContent} from '../src/save_compatibility.js';
import {beginSimulationRenderBatch,endSimulationRenderBatch} from '../src/simulation_render.js';
test('batched retirement traversal preserves ordered paths, values and serialized bytes',()=>{
    const source={untouched:{a:{b:{c:3}},array:[{Dewleaf:2}]},inventories:{one:{Dewleaf:{count:2},keep:{'Meridian pellet':5}},two:{'Dewleaf tea':7}},cultivation:{x:8},'current location':'Jade Hollow',current_activity:{id:'old'},retired_content:{schema:1,entries:[{path:['inventories','one','Dewleaf'],value:{count:1}}]}};
    const before=structuredClone(source),normal=prepareFoundationSave(source);let batch;
    beginSimulationRenderBatch();try{batch=prepareFoundationSave(source);}finally{endSimulationRenderBatch();}
    assert.deepEqual(batch,normal);assert.equal(JSON.stringify(retainRetiredContent(batch.save,batch.retired)),JSON.stringify(retainRetiredContent(normal.save,normal.retired)));assert.deepEqual(source,before);
    batch.retired.entries[0].path.push('mutated');assert.equal(batch.retired.entries[1].path.includes('mutated'),false);
});
