import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {architectureEdges,checkBaseline,hostImportViolation} from '../scripts/check_architecture.mjs';
test('shared runtime rejects desktop dependencies while allowing ordinary browser modules',()=>{
 for(const spec of ['electron','electron/main','node:fs/promises','fs','fs/promises','../desktop/main.cjs'])assert.match(hostImportViolation('src/feature.js',spec),/Host dependency/);
 assert.match(hostImportViolation('src/ui/feature.js','../../desktop/preload.cjs'),/Host dependency/);
 for(const spec of ['./domain_registry.js','../src/ui/feature.js','inkjs','./desktop_theme.js'])assert.equal(hostImportViolation('src/feature.js',spec),null);
});
test('the import scan reports real host imports and ignores matching prose',async()=>{
 const dir=await mkdtemp('tests/.architecture-host-');
 try {
  await writeFile(`${dir}/feature.js`, `import fs from 'node:fs';\nimport('electron');\nconst file = require('fs/promises');\n// import 'node:crypto';\nconst prose = "import 'node:path'";\n`);
  const {importGraph}=await import('../scripts/check_architecture.mjs');
  const errors=[];
  await importGraph(dir,{onImport:(from,spec)=>{const error=hostImportViolation(from,spec);if(error)errors.push(error);}});
  assert.equal(errors.length,3);
  assert.ok(errors.some(error=>error.endsWith(' -> node:fs')));
  assert.ok(errors.some(error=>error.endsWith(' -> electron')));
  assert.ok(errors.some(error=>error.endsWith(' -> fs/promises')));
 } finally {await rm(dir,{recursive:true,force:true});}
});
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
test('every relative import under src resolves to a file in the graph',async()=>{
 const {importGraph}=await import('../scripts/check_architecture.mjs');
 const graph=await importGraph();
 const missing=[];
 for(const [from,targets] of graph)for(const to of targets)if(!graph.has(to))missing.push(`${from} -> ${to}`);
 assert.deepEqual(missing,[]);
});
test('architecture check fails when a ratcheted file grows past its line baseline',()=>{
 const edges={mainImports:[],cycleEdges:[]},baseline={...edges,lineCounts:{'src/main.js':10}};
 assert.deepEqual(checkBaseline(edges,baseline,undefined,{'src/main.js':10}),[]);
 assert.deepEqual(checkBaseline(edges,baseline,undefined,{'src/main.js':9}),[]);
 assert.ok(checkBaseline(edges,baseline,undefined,{'src/main.js':11}).some(x=>x.includes('grew past its baseline')));
});
