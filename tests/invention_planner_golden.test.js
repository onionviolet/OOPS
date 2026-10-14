import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inventionPackHome,homeWorld,magicWorld} from '../src/data/invention_pack_home.js';
import {goldenBundle,hashFile,canonicalJSON,replayWitness,assertKnownOnly} from './helpers/invention_qa.mjs';
import {expandTarget,checkFeasibility,roadmapView,estimate} from '../src/invention_planner.js';
const base=new URL('./fixtures/invention_qa/v1/',import.meta.url),read=name=>JSON.parse(readFileSync(new URL(name,base),'utf8'));
const input=read('input.json'),expected=read('golden.json'),manifest=read('manifest.json');
test('Z3 immutable v1 fixture and reviewed golden digests',()=>{assert.equal(hashFile(new URL('input.json',base)),manifest.inputDigest);assert.equal(hashFile(new URL('golden.json',base)),manifest.goldenDigest);assert.equal(hashFile('src/data/invention_pack_home.js'),manifest.packDigest);assert.equal(manifest.reviewStatus,'reviewed');assert.equal(manifest.consumerDisposition,'unbound-demo');});
const actual=goldenBundle(input);
for(const name of Object.keys(expected))test(`Z3 exact pinned ${name} truth/view bundle`,()=>assert.equal(canonicalJSON(actual[name]),canonicalJSON(expected[name])));
test('Z3 hand-derived adjacency and scalars independently match current pack',()=>{
    for(const [id,count,width,kinds,scales,layers]of [['soap',15,7,{goal:2,method:4,primitive:9},[15,0],[1,2,7,2,3]],['lamp',10,4,{goal:2,method:2,primitive:6},[5,5],[1,1,4,1,3]],['thermometer',10,4,{goal:2,method:2,primitive:6},[3,7],[1,1,4,1,3]]]){
        const g=expandTarget(inventionPackHome,homeWorld,id),r=checkFeasibility(g,homeWorld),e=estimate(g);assert.equal(e.depth,4);assert.equal(e.nodeCount,count);assert.equal(e.width,width);assert.deepEqual(e.byKind,kinds);assert.deepEqual([e.byScale.person,e.byScale.workshop],scales);assert.deepEqual(e.layers,layers);replayWitness(g,homeWorld,r.witness);
        const expectedMethods={soap:['alkali.ash','soap.fat'],lamp:['glasswork.make','lamp.oil'],thermometer:['glasswork.make','thermometer.build']};assert.deepEqual(r.witness.steps.map(s=>s.method),expectedMethods[id]);
        for(const node of g.nodes){if(node.kind==='method')assert.deepEqual(node.requires,[...new Set([...inventionPackHome.methods,...(homeWorld.methods??[])].find(m=>m.id===node.id).requires)].sort());}
        assert.equal(estimate(g,Object.fromEntries(r.witness.steps.map(s=>[s.id,s.method]))).nodeCount,10);
    }
    assert.equal(estimate(expandTarget(inventionPackHome,magicWorld,'lamp')).nodeCount,4);
});
test('Z3 unknown truth labels and reasons never leak into slots/beliefs',()=>{for(const id of ['soap','lamp','thermometer'])for(const k of Object.values(input.knowledge[id]))assertKnownOnly(actual[id].graph,k);
    assert.deepEqual(actual.soap.views.TK0.nodes,[{id:'$slot:1',kind:'slot',label:'Unknown requirement',fidelity:0}]);assert.ok(actual.lamp.views.wrong.nodes.some(n=>n.state==='believed'&&n.label==='Remembered synthetic lamp'));});
test('Z3 stock shortage differs from reference knowledge gap',()=>{assert.deepEqual(actual.noWater.feasibility.missingPrimitives.map(n=>n.id),['cleansing-plant','traded-alkali','water']);assert.equal(actual.noReference.feasibility.missingPrimitives[0].id,'reference');assert.equal(actual.thermometer.views.referenceTK3.nextMissing.id,'reference');assert.equal(actual.composed.estimate.nodeCount,15);});
