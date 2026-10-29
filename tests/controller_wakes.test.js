import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry,createExpansionState,advanceSimulation,setControllerWakeModeForTests,loadExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation,commitSimulationCommand,controllerWakeTimes,nextSimulationBoundary} from '../src/simulation.js';
const eq=(fact,value)=>({fact,op:'eq',value});
const stored=(key,value)=>({type:'fact',scope:'actor',key,value});
const command=d=>({revision:1,label:d.id,costs:[],effects:[],...d});
function fixture(when=eq('actor.order',true)) {
 const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{
  people:[{id:'fixture.worker',revision:1,label:'Local worker',worldId:'base.frontier',location:'Village',inventory:'simulation'}],
  commands:[command({id:'fixture.order',actorId:'player',duration:7,effects:[{...stored('order',true),actor:'fixture.worker'}]}),
   command({id:'fixture.work',actorId:'fixture.worker',duration:3,effects:[stored('order',false),stored('finished',true)]})],
  controllers:[{id:'fixture.controller',revision:1,label:'Work plan',actorId:'fixture.worker',interval:1,actions:[{commandId:'fixture.work',priority:1,when}]}]
 }});
 const state=createExpansionState(37),context={actorId:'player',facts:{location:'Village'},external:{},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 const plan=enrollSimulation(state,registry,context);plan.state.simulation.constructs={};
 return {registry,context,plan};
}
function advance(f,minutes,enabled,plan=f.plan,contexts={}) {
 const previous=setControllerWakeModeForTests(enabled);
 try{return advanceSimulation(plan.state,f.registry,minutes,plan.external,plan.gameplay,contexts);}
 finally{setControllerWakeModeForTests(previous);}
}
test('idle stored guards omit minute wakes and preserve exact state bytes, including due and reload',()=>{
 const f=fixture(),wakes=controllerWakeTimes(f.plan.state,f.registry);
 assert.equal(wakes.get('fixture.controller'),Infinity);
 assert.equal(nextSimulationBoundary(f.plan.state,{controllerWakes:wakes}),Infinity);
 delete f.plan.state.simulation.constructs;
 assert.equal(nextSimulationBoundary(f.plan.state,{controllerWakes:controllerWakeTimes(f.plan.state,f.registry)}),1);
 const before=JSON.stringify(f.plan),queued=advance(f,349,true),polled=advance(f,349,false);
 assert.equal(JSON.stringify(queued),JSON.stringify(polled));assert.equal(JSON.stringify(f.plan),before);
 assert.equal(queued.state.simulation.controllers['fixture.controller'].due,350);
 const loaded={...queued,state:loadExpansionState(JSON.parse(JSON.stringify(queued.state)),f.registry)};
 assert.equal(JSON.stringify(advance(f,20,true,loaded)),JSON.stringify(advance(f,20,false,queued)));
});
test('a completing job enables the due controller in the same boundary and keeps completion time',()=>{
 const f=fixture(),ordered=commitSimulationCommand(f.plan.state,f.registry,{id:'fixture.order'},{...f.context,external:f.plan.external,gameplay:f.plan.gameplay});
 const queued=advance(f,30,true,ordered),polled=advance(f,30,false,ordered);
 assert.equal(JSON.stringify(queued),JSON.stringify(polled));
 assert.equal(queued.state.actors['fixture.worker'].facts.finished,true);
 assert.equal(queued.state.simulation.controllers['fixture.controller'].lastAction.at,7);
});
test('explicit clock threshold wakes at the original minute and handles conjunctions',()=>{
 const f=fixture({all:[{fact:'clock',op:'gte',value:19},eq('actor.order',false)]});
 f.plan.state.actors['fixture.worker'].facts.order=false;
 assert.equal(controllerWakeTimes(f.plan.state,f.registry).get('fixture.controller'),19);
 const queued=advance(f,30,true),polled=advance(f,30,false);
 assert.equal(JSON.stringify(queued),JSON.stringify(polled));
 assert.equal(queued.state.simulation.controllers['fixture.controller'].lastAction.at,28);
});
test('derived, unowned, negated and supplied actor facts retain polling; one unknown candidate retains polling',()=>{
 for(const rule of [eq('need.hunger',true),eq('actor.unowned',true),{not:eq('actor.order',true)}]) {
  const f=fixture(rule);assert.equal(controllerWakeTimes(f.plan.state,f.registry).get('fixture.controller'),1);
 }
 const f=fixture();assert.equal(controllerWakeTimes(f.plan.state,f.registry,{'fixture.worker':{facts:{'actor.order':true}}}).get('fixture.controller'),1);
 assert.equal(JSON.stringify(advance(f,20,true,f.plan,{'fixture.worker':{facts:{'actor.order':true}}})),JSON.stringify(advance(f,20,false,f.plan,{'fixture.worker':{facts:{'actor.order':true}}})));
});
test('clock equality, passed windows and disjunction preserve every threshold edge',()=>{
 for(const rule of [eq('clock',9),{fact:'clock',op:'lte',value:8},{any:[eq('clock',13),eq('actor.order',true)]}]) {
  const f=fixture(rule);assert.equal(JSON.stringify(advance(f,30,true)),JSON.stringify(advance(f,30,false)));
 }
});
