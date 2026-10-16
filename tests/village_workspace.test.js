import test from 'node:test';
import assert from 'node:assert/strict';
import {villageFocus} from '../src/village_workspace.js';
import {projectVillageScene} from '../src/causal_story_scenes.js';
test('focus remains empty without selection and filters unmet traits, relationship and memory',()=>{
    const frame={people:[{id:'traveler_1',name:'Unmet traveler',role:'traveler',met:false,traits:['private trait'],relationship:'private relationship'}],things:[],history:{}};
    const before=structuredClone(frame);
    assert.equal(villageFocus(frame,null),null);
    const view=villageFocus(frame,'traveler_1');assert.deepEqual(view.traits,[]);assert.equal(view.relationship,null);assert.equal(view.memory,null);
    assert.doesNotMatch(JSON.stringify(view),/private/);assert.deepEqual(frame,before);
});
test('current conversation and native enemy projection take priority over an inspected thing',()=>{
    const frame={dialogue:'elder',people:[{id:'elder',name:'Village elder',role:'elder',met:true,traits:[]}],things:[{id:'mixing',name:'Village mixing counter'}],history:{}};
    assert.equal(villageFocus(frame,'mixing').name,'Village elder');
    assert.equal(villageFocus({...frame,enemy:{name:'Known opponent',hp:'5/8 hp'}},'mixing').kind,'enemy');
});
test('Village overview groups each existing action under its target without changing owners',()=>{
    const overview={title:'Village',clockText:'Summer · morning · rain',people:[{id:'elder',name:'Village elder'}],things:[{id:'mixing',name:'Village mixing counter'}],actions:[{id:'talk',target:'elder',label:'Talk'},{id:'mix',target:'mixing',label:'Open mixing'}]};
    const before=structuredClone(overview),view=projectVillageScene({overview});
    assert.deepEqual(view.groups.map(g=>g.actions.map(a=>a.id)),[['talk'],['mix']]);assert.deepEqual(overview,before);
});
