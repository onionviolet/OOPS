import test from 'node:test';
import assert from 'node:assert/strict';
import {createConstraintStore,conditionedDraw,reservationDecision,contradictedFills} from '../src/constraint_store.js';
import {constraintsFromPack} from '../src/constraint_pack.js';
import {createStreams} from '../src/seeded_streams.js';
const record=(id,extra={})=>({id,actor:'fixture.person',what:'beat',window:{from:10,to:20},where:'fixture.room',locator:'fixture p1',produces:[],...extra});
test('one actor/window/need index supports a name-free second world',()=>{
 const pack={revision:'2',people:[{id:'fixture.person',tier:'recurring'}],bindings:{days:[{scene:'s',day:2,from:20,to:40}],beats:[{id:'b',actor:'fixture.person',scene:'s',place:'fixture.room',effects:[{fact:'lesson',value:true}],locator:'fixture p1'}],schedule:[]},anchors:[]};
 const {store}=constraintsFromPack(pack);
 assert.equal(store.byActor.get('fixture.person')[0].tier,'recurring');
 assert.equal(store.select({actor:'fixture.person',from:1460,to:1480}).length,1);
 assert.equal(store.select({from:0,to:100}).length,0);
 const draw=conditionedDraw(createStreams(10),{world:'fixture.second',actor:'fixture.person',date:2,subject:'lesson',revision:'2',outcomes:[{value:true,weight:.01},{value:false,weight:.99}],consistent:r=>r.value});
 assert.equal(draw.outcome.value,true);assert.equal(draw.strain.probability,.01);
});
test('a reserved amount refuses spending, names its safe purpose, and aggregates in the adapter',()=>{
 const store=createConstraintStore([record('rent',{what:'contract',reason:'You need this for your rent.',needs:{actor:'fixture.person',type:'resource',key:'coins',op:'gte',value:8}})]);
 const decide=amount=>reservationDecision(store,{at:0,changes:[{actor:'fixture.person',type:'resource',key:'coins',amount}],read:()=>10});
 assert.deepEqual(decide(-3),{allowed:false,reason:'You need this for your rent.'});assert.equal(decide(-2).allowed,true);
 assert.equal(reservationDecision(store,{at:21,changes:[{actor:'fixture.person',type:'resource',key:'coins',amount:-9}],read:()=>10}).allowed,true);
 assert.equal(reservationDecision(store,{at:0,settled:()=>true,changes:[{actor:'fixture.person',type:'resource',key:'coins',amount:-9}],read:()=>10}).allowed,true);
});
test('1,000 conditioned keys remain consistent, stable under order and unmutating',()=>{
 const streams=createStreams(31),before=JSON.stringify(streams),outcomes=[{value:'permitted',weight:1e-12},{value:'inconsistent',weight:1}];
 const draw=subject=>conditionedDraw(streams,{world:'fixture.second',actor:'fixture.person',date:3,subject,revision:'r1',outcomes,consistent:r=>r.value==='permitted'});
 const keys=Array.from({length:1000},(_,i)=>String(i)),a=keys.map(draw),b=[...keys].reverse().map(draw).reverse();
 assert.deepEqual(a,b);assert.ok(a.every(x=>x.outcome.value==='permitted'&&x.strain.probability<1e-10));assert.equal(JSON.stringify(streams),before);
 assert.notEqual(draw('0').receipt.id,conditionedDraw(streams,{world:'fixture.second',actor:'fixture.person',date:3,subject:'0',revision:'r2',outcomes}).receipt.id);
 assert.throws(()=>conditionedDraw(streams,{world:'fixture.second',actor:'p',date:3,subject:'x',revision:'1',outcomes,consistent:()=>false}),/no model-consistent/);
});
test('null-player canon projection reproduces every synthetic fact byte-identically',()=>{
 const facts=Array.from({length:180},(_,i)=>record(`c${i}`,{actor:`fixture.actor.${i%3}`,window:{from:i,to:i+1},produces:[{key:`fact.${i}`,value:i}]}));
 const run=()=>{const store=createConstraintStore(facts),state={};for(const row of store.byWindow){const result=conditionedDraw(createStreams(3),{world:'fixture.second',actor:row.actor,date:row.window.from,subject:row.id,revision:'1',outcomes:[{value:row.produces,weight:1}]});for(const e of result.outcome.value)state[e.key]=e.value;}return JSON.stringify(state);};
 assert.equal(run(),run());assert.equal(Object.keys(JSON.parse(run())).length,180);facts.forEach(r=>assert.equal(JSON.parse(run())[r.produces[0].key],r.produces[0].value));
});
test('revised constraints flag fills and preserve the input',()=>{
 const store=createConstraintStore([record('c',{produces:[{key:'weather',value:'wet'}]})]);
 const fills=[{actor:'fixture.person',at:15,key:'weather',value:'dry',provenance:'fill'}],before=JSON.stringify(fills);
 assert.equal(contradictedFills(store,fills)[0].kind,'contradicted-fill');assert.equal(JSON.stringify(fills),before);
});
test('same-place forward anchors retain distinct locators and stable IDs after reorder',()=>{
 const anchor={actor:'fixture.person',place:'fixture.room',dayWindow:[1,2],label:'S'},a={...anchor,locator:'fixture p1'},b={...anchor,locator:'fixture p2'};
 const first=constraintsFromPack({anchors:[a,b]}).store.rows,second=constraintsFromPack({anchors:[b,a]}).store.rows;
 assert.equal(first.length,2);assert.deepEqual(first.map(r=>r.id).sort(),second.map(r=>r.id).sort());
 assert.equal(constraintsFromPack({anchors:[a,a]}).store.rows.length,1);
});
