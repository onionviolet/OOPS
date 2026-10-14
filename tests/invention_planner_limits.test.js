import test from 'node:test';
import assert from 'node:assert/strict';
import {runPlanner,validateGraph} from '../src/invention_qa.js';
import {expandTarget} from '../src/invention_planner.js';
import {adversarialCase,runIsolated} from './helpers/invention_qa.mjs';
for(const kind of ['long-chain','wide-and','unused-catalog','huge-text'])test(`Z6 ${kind} structured isolated oversize refusal`,async()=>{const r=await runIsolated(adversarialCase(kind,{overLimit:true}));assert.equal(r.status,'budget-exceeded');assert.equal(r.graph,undefined);assert.equal(r.witness,undefined);});
test('Z6 independent parent deadline terminates nonterminating worker',async()=>{const start=performance.now();const r=await runIsolated({},100,'hang');assert.equal(r.status,'timeout');assert.ok(performance.now()-start<2000);});
for(const kind of ['long-chain','wide-and','many-or','diamond','scc-exit','hostile-chain'])test(`Z6 admitted ${kind} terminates`,async()=>{const c=adversarialCase(kind,{size:64});const r=await runIsolated(c);assert.equal(r.status,'supported-solvable');assert.ok(r.counters.total<1000000);});
test('Z6 every phase checks external graphs and operation budget',()=>{const c=adversarialCase('wide-and'),graph=expandTarget(c.pack,c.world,c.target);
    for(const phase of ['expand','compose','feasibility','view','estimate','bundle']){const input=['expand','compose'].includes(phase)?{...c,phase}:{graph,world:c.world,knowledge:{},phase};assert.equal(runPlanner(input,{operations:1}).status,'budget-exceeded');}
    const bad=structuredClone(graph);bad.nodes[0].kind='unknown';for(const phase of ['feasibility','view','estimate'])assert.equal(runPlanner({graph:bad,world:c.world,phase}).status,'invalid-input');});
test('Z6 dangling operators choices and depth fail before publication',()=>{const c=adversarialCase('long-chain',{size:64}),g=expandTarget(c.pack,c.world,c.target);assert.throws(()=>validateGraph(g,{depth:4}));
    assert.equal(runPlanner({graph:g,world:c.world,phase:'estimate',choice:{g:'absent'}}).status,'invalid-input');g.nodes.find(n=>n.kind==='method').requires=['absent'];assert.equal(runPlanner({graph:g,world:c.world}).status,'invalid-input');});
test('Z6 sparse huge arrays refused without iteration or clone',()=>{const c=adversarialCase('wide-and');c.pack.primitives=new Array(1000000000);assert.equal(runPlanner(c).status,'budget-exceeded');});
test('Z6 cyclic SCC plus long path uses conservative condensation bound',()=>{const c=adversarialCase('long-chain',{size:256});c.pack.methods.push({id:'loop',label:'Synthetic cycle',produces:'g',requires:['g']});assert.equal(runPlanner(c).status,'supported-solvable');c.pack.methods.push({id:'back',label:'Synthetic back edge',produces:c.pack.functions.at(-1).id,requires:['g']});assert.equal(runPlanner(c).status,'supported-solvable');});
