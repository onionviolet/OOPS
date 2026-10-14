import test from 'node:test';
import assert from 'node:assert/strict';
import {projectChains} from '../src/chain_inspector.js';
import {createHarvest, drawSpecimen, addCarcass, beginHarvest, finishHarvest, planHarvest, gradedKey} from '../src/harvest.js';
import {createMixtureState, resolveMixture, mixtureKey} from '../src/mixture_state.js';
import {createStreams, drawUnit, STREAMS} from '../src/seeded_streams.js';
import {FEATURE_OBJECT_KEYS as K} from '../src/feature_expansion_objects.js';
const freeze = o => {if(o && typeof o === 'object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
function fixture(){
    const harvest=createHarvest(), context={clock:12,skill:25,tool:100};
    const specimen=drawSpecimen({species:'Wolf rat',key:'fixture:1',clock:0},()=>.98);
    addCarcass(harvest,specimen,context);beginHarvest(harvest,'Wolf rat','whole',context);
    finishHarvest(harvest,{...specimen,key:'fixture:previous'},'tail',context);
    const mixtures=createMixtureState(123), p=resolveMixture(mixtures,{'River bellleaf':1,'Spring water':1},'steep');
    mixtures.products[p.id]=p;mixtures.knowledge[p.id]={observed:true,at:12,source:'oral experiment'};
    mixtures.methods[p.id]={revision:1,inputs:p.inputs,process:p.process};mixtures.job={product:p.id,held:p.inputs,due:15,remaining:3};
    return {harvest,mixtures,clock:12,inventory:{[gradedKey('Rat tail',100,'whole')]:{count:1},[mixtureKey(p)]:{count:2},[K.kit]:{count:2}},
        handling:{context,ready:false,automaticReady:true},expansion:{rng:123,streams:createStreams(123),simulation:{jobs:[{id:'job1',commandId:'feature_objects.kit_sharp_own',due:16}],knowledge:{player:{'feature_objects.kits':{value:'Paid kits made.',at:12}}}}}};
}
test('deterministic projections leave deep-frozen live owners byte-identical',()=>{
    const f=freeze(fixture()), before=JSON.stringify(f), a=projectChains(f,{developer:true});
    assert.deepEqual(projectChains(f,{developer:true}),a);assert.equal(JSON.stringify(f),before);
    assert.deepEqual(new Set(a.flatMap(c=>c.rows.map(r=>r.role))),new Set(['source','part template','operation','output batch','observation']));
});
test('quotes, stream cells/logs and next draws are identical before/after inspection',()=>{
    const f=fixture(), control=structuredClone(f), specimen=f.harvest.job.specimen;
    const quote=planHarvest(specimen,'whole',f.handling.context), brew=resolveMixture(f.mixtures,{'River bellleaf':1,'Spring water':1},'steep');
    for(let i=0;i<10;i++)projectChains(f,{developer:true});
    assert.deepEqual(f,control);assert.deepEqual(planHarvest(specimen,'whole',f.handling.context),quote);
    assert.deepEqual(resolveMixture(f.mixtures,brew.inputs,brew.process),brew);
    for(const stream of [STREAMS.loot,STREAMS.craft,STREAMS.gather])assert.equal(drawUnit(f.expansion,stream,'next'),drawUnit(control.expansion,stream,'next'));
});
test('non-developer views fail closed without even reading hidden or unknown properties',()=>{
    const f=new Proxy({}, {get(){throw Error('Hidden truth was read');}});
    for(const developer of [false,undefined,null,1,'true'])assert.deepEqual(projectChains(f,{developer}),[]);
    assert.deepEqual(projectChains(f),[]);
});
test('legacy absence does not initialize owners or streams',()=>{
    const f=freeze({});const rows=projectChains(f,{developer:true});
    assert.equal(rows.length,4);assert.deepEqual(f,{});assert.match(rows[0].rows[0].detail,/No retained/);
});
test('actual scheduling, latest-only receipt, held inputs and kit branch are explicit',()=>{
    const rows=projectChains(fixture(),{developer:true}), text=JSON.stringify(rows);
    for(const pattern of [/Fixed priority/,/immediate whole|left behind/,/alongside|accompany combat/,/Latest-only/,/held/,/not a kit prerequisite/,/Paid kits made/])assert.match(text,pattern);
    assert.ok(rows[0].rows.some(r=>r.role==='output batch'&&r.detail.includes('owned')));
});
test('trace slot copies only a supplied trace and never evaluates it',()=>{
    const f=freeze({...fixture(),ruleTrace:{revision:1,rule:'opaque-rule-id',result:'retained'}});
    const text=projectChains(f,{developer:true})[3].rows[0].detail;
    assert.deepEqual(JSON.parse(text),f.ruleTrace);assert.deepEqual(projectChains(f),[]);
});
test('completed harvest still maps consumed source and template without inventing live stock',()=>{
    const f=fixture();f.harvest.job=null;f.harvest.lots={};f.inventory={};
    const rows=projectChains(f,{developer:true})[0].rows;
    assert.ok(rows.some(r=>r.role==='source'&&r.detail.startsWith('Consumed specimen snapshot')));
    assert.ok(rows.some(r=>r.role==='part template'&&r.ref==='Wolf rat'));
    assert.ok(rows.some(r=>r.role==='output batch'&&r.why.includes('receipt output count')));
});
