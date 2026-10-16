import test from 'node:test';
import assert from 'node:assert/strict';
import {architectureEdges,checkBaseline} from '../scripts/check_architecture.mjs';
test('architecture detects cycles and main edges, including a new cycle through old vertices',()=>{
 const graph=new Map([['src/main.js',['src/a.js']],['src/a.js',['src/b.js']],['src/b.js',[]]]);
 const baseline={...architectureEdges(graph),lineCounts:{}};
 graph.get('src/b.js').push('src/main.js');
 const current=architectureEdges(graph);
 assert.equal(current.cycleEdges.length,3);
 assert.equal(current.mainImports.length,1);
 assert.equal(checkBaseline(current,baseline).length,4);
});
test('architecture baseline can shrink but cannot grant new exemptions or erase line history',()=>{
 const old={mainImports:['a'],cycleEdges:['b'],lineCounts:{main:10}};
 assert.deepEqual(checkBaseline({mainImports:[],cycleEdges:[]},{mainImports:[],cycleEdges:[],lineCounts:{main:10}},old),[]);
 assert.ok(checkBaseline({mainImports:['a','c'],cycleEdges:['b']},{mainImports:['a','c'],cycleEdges:['b'],lineCounts:{main:11}},old).some(x=>x.includes('only shrink')));
 assert.ok(checkBaseline({mainImports:[],cycleEdges:[]},old).some(x=>x.includes('Remove resolved')));
});
