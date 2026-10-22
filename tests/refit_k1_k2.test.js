import test from 'node:test';
import assert from 'node:assert/strict';
import {stageMixtureAction} from '../src/mixture_native.js';
import {mixtureKey,validateMixtureState} from '../src/mixture_state.js';
import {projectMixtureFeedback} from '../src/mixture_feedback.js';
import {projectMixtureDestinations} from '../src/mixture_destinations.js';
const inputs={'River bellleaf':1,'Spring water':1};
const bell='{"id":"River bellleaf"}',water='{"id":"Spring water"}';
function context(n=3){return {owner:null,seed:7,inventory:{[bell]:{count:n},[water]:{count:n}},money:100,clock:0};}
function act(c,request){const p=stageMixtureAction({...c,request});if(p){c.owner=p.state;c.inventory=p.inventory;c.money=p.money;}return p;}
const feedback=c=>projectMixtureFeedback({frame:{ready:true,clock:c.clock,money:c.money,inventory:c.inventory,expansion:c.expansion},owner:c.owner,quote:null,queue:null}).lastResult;
function learned(n){const c=context(n);act(c,{type:'mix',inputs,process:'steep'});const p=Object.values(c.owner.products)[0];act(c,{type:'use',key:mixtureKey(p)});act(c,{type:'learn',product:p.id});return {c,p};}

test('K1: a single mix records its consumed inputs and survives JSON reload',()=>{
    const c=context();act(c,{type:'mix',inputs,process:'steep'});
    const r=JSON.parse(JSON.stringify(c.owner)).lastCompletion;
    assert.deepEqual([r.kind,r.outcome,r.consumed,r.sequence],['mix','single',inputs,1]);
    validateMixtureState(JSON.parse(JSON.stringify(c.owner)));
    const view=feedback(c);assert.deepEqual(view.consumed,inputs);assert.match(view.text,/Consumed: 1 River bellleaf, 1 Spring water/);
    assert.doesNotMatch(view.text,/m1:|fractions/,'Player text never prints hidden product identity.');
});
test('K1: a timed batch records its own held inputs while the next batch is reserved',()=>{
    const {c,p}=learned(5);act(c,{type:'repeat',product:p.id,count:2});c.clock=3;act(c,{type:'advance'});
    assert.equal(c.owner.job.remaining,1);assert.deepEqual([c.owner.lastCompletion.kind,c.owner.lastCompletion.outcome,c.owner.lastCompletion.at],['batch','next reserved',3]);
    assert.deepEqual(c.owner.lastCompletion.consumed,inputs);assert.match(feedback(c).text,/Next queued batch reserved/);
});
test('K1: a stopped repeat says why; cancel and buy keep the receipt',()=>{
    const {c,p}=learned(2);act(c,{type:'repeat',product:p.id,count:3});c.clock=3;act(c,{type:'advance'});
    assert.equal(c.owner.lastCompletion.outcome,'repeat stopped');assert.match(feedback(c).text,/Queue stopped: Not enough River bellleaf/);
    const kept=structuredClone(c.owner.lastCompletion);act(c,{type:'buy',id:'River bellleaf'});act(c,{type:'buy',id:'Spring water'});assert.deepEqual(c.owner.lastCompletion,kept);
    c.clock=4;act(c,{type:'repeat',product:p.id,count:2});act(c,{type:'cancel'});assert.deepEqual(c.owner.lastCompletion,kept);
    assert.match(feedback(c).text,/, 1 game min ago\. Consumed/);
});
test('K1: a tampered receipt is refused; a missing one stays unavailable',()=>{
    const c=context();act(c,{type:'mix',inputs,process:'steep'});const bad=structuredClone(c.owner);bad.lastCompletion.consumed={'River bellleaf':9};
    assert.throws(()=>validateMixtureState(bad),/completion receipt/);delete bad.lastCompletion;validateMixtureState(bad);
});
test('K2: one stock quoted for two products; committing one makes the other quote stale',()=>{
    const c=context(2),frame={...c,ready:true};
    const view=projectMixtureDestinations({frame,owner:c.owner,request:{inputs}});
    assert.deepEqual(view.destinations.map(d=>[d.process,d.vials,d.error]),[['steep',2,null],['boil',2,null]]);
    assert.notEqual(view.destinations[0].product,view.destinations[1].product);
    const [steep,boil]=view.destinations;act(c,{type:'mix',inputs,process:'steep',quote:steep.token});
    const before=JSON.stringify(c);
    assert.throws(()=>act(c,{type:'mix',inputs,process:'boil',quote:boil.token}),/quote changed/);assert.equal(JSON.stringify(c),before);
});
test('K2: the native disposition owner blocks a borrowed key whole, matching crafting detail; other keys stay free',async()=>{
    const {createExpansionState}=await import('../src/expansion_engine.js');const {initializeExpedition}=await import('../src/expedition_content.js');
    const {assertNativeItemDisposition}=await import('../src/native_gameplay_adapter.js');
    const {c,p}=learned(4);act(c,{type:'repeat',product:p.id,count:2});
    c.expansion=initializeExpedition(createExpansionState(17));c.expansion.simulation??={custody:{}};c.expansion.simulation.custody??={};
    const free=projectMixtureDestinations({frame:{...c,ready:true},owner:c.owner,request:{inputs}});
    assert.deepEqual(free.stock.find(r=>r.id==='River bellleaf'),{id:'River bellleaf',carried:2,held:1,blocked:0,free:2});
    c.expansion.simulation.custody.loan={owner:'Eda',holder:'player',key:bell,count:1,at:0};
    assert.throws(()=>assertNativeItemDisposition(c.expansion,bell),/borrowed/);assert.doesNotThrow(()=>assertNativeItemDisposition(c.expansion,water));
    const view=projectMixtureDestinations({frame:{...c,ready:true},owner:c.owner,request:{inputs}});
    assert.deepEqual(view.stock.find(r=>r.id==='River bellleaf'),{id:'River bellleaf',carried:2,held:1,blocked:2,free:0});
    assert.equal(view.stock.find(r=>r.id==='Spring water').blocked,0);
    assert.match(view.destinations[0].error,/River bellleaf is borrowed or committed elsewhere/);
    assert.notEqual(view.destinations[0].token,free.destinations[0].token,'A new hold stales the old quote.');
    assert.throws(()=>act(c,{type:'mix',inputs,process:'boil'}),/Held elsewhere: River bellleaf/);
});
