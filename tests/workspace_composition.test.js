import test from 'node:test';
import assert from 'node:assert/strict';
import {presetLayout,normalizeLayout} from '../src/workspace_state.js';
test('fresh Workspace keeps summary/inventory/actions/log and parks detail shells without deleting IDs',()=>{
    const ids=['vitals','combat-controls','preparation','belongings','focus','village-scene','current-work','local-actions','messages','records','skills','projects'];
    const layout=presetLayout('Workspace',ids),byId=Object.fromEntries(layout.modules.map(v=>[v.id,v]));
    assert.equal(layout.version,1);assert.deepEqual(layout.modules.map(v=>v.id),ids);
    for(const id of ['vitals','belongings','focus','village-scene','current-work','local-actions','messages'])assert.equal(byId[id].hidden,false,id);
    for(const id of ['preparation','records','skills','projects'])assert.equal(byId[id].hidden,true,id);
    assert.equal(byId.belongings.dock,'left');assert.equal(byId.focus.dock,'center');assert.equal(byId.messages.dock,'right');
});
test('normalizing an existing layout preserves explicit detail visibility, pins, collapse and dimensions',()=>{
    const raw={version:1,mode:'dock',columns:[.3,.4,.3],density:'comfortable',modules:[{id:'preparation',dock:'left',height:280,width:400,order:0,pinned:true,collapsed:false,hidden:false},{id:'skills',dock:'right',height:200,width:400,order:1,pinned:true,collapsed:true,hidden:false}]};
    const before=structuredClone(raw),layout=normalizeLayout(raw,['preparation','skills']);
    assert.deepEqual(raw,before);for(const old of raw.modules){const next=layout.modules.find(v=>v.id===old.id);for(const key of ['dock','height','width','order','pinned','collapsed','hidden'])assert.equal(next[key],old[key],key);}
});
