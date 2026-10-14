import assert from 'node:assert/strict';
import sqliteInit from '@sqlite.org/sqlite-wasm';
import {clock,stats,save,environment,WARM,SAMPLES} from './common.mjs';
import {developedSave} from './fixtures.mjs';
const result={environment:environment(),rows:[]};
const start=clock(),sqlite=await sqliteInit();result.sqliteInitMs=clock()-start;result.sqliteVersion=sqlite.version.libVersion;
const encoder=new TextEncoder(),decoder=new TextDecoder();
async function gzip(text){return new Uint8Array(await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());}
async function gunzip(bytes){return await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();}
function stmtRun(stmt,values){stmt.bind(values);stmt.step();stmt.reset();}
function makeHybrid(db){
  db.exec('CREATE TABLE domains(id TEXT PRIMARY KEY,payload TEXT); CREATE TABLE actors(id TEXT PRIMARY KEY,payload TEXT); CREATE TABLE people(id TEXT PRIMARY KEY,payload TEXT); CREATE TABLE history(seq INTEGER PRIMARY KEY,payload TEXT);');
  const prepared=Object.fromEntries(['domains','actors','people','history'].map(table=>[table,db.prepare(`INSERT OR REPLACE INTO ${table} VALUES (?,?)`)]));
  function put(table,key,value){stmtRun(prepared[table],[key,JSON.stringify(value)]);}
  function split(s){const {expansion,...native}=s;const {actors,simulation,...header}=expansion;const {people,log,...simHeader}=simulation;return {native,header,actors,people,log,simHeader};}
  function write(s){const d=split(s);db.exec('BEGIN');try{
    for(const t of Object.keys(prepared))db.exec(`DELETE FROM ${t}`);
    for(const [k,v] of Object.entries(d.native))put('domains',k,v);
    put('domains','$expansion',d.header);put('domains','$simulation',d.simHeader);
    for(const [k,v] of Object.entries(d.actors))put('actors',k,v);
    for(const [k,v] of Object.entries(d.people))put('people',k,v);
    d.log.forEach((v,i)=>put('history',i,v));db.exec('COMMIT');
  }catch(e){db.exec('ROLLBACK');throw e;}}
  function read(){const domains=Object.fromEntries(db.exec({sql:'SELECT id,payload FROM domains ORDER BY rowid',returnValue:'resultRows'}).map(([k,v])=>[k,JSON.parse(v)]));
    const header=domains.$expansion,simHeader=domains.$simulation;delete domains.$expansion;delete domains.$simulation;
    const records=t=>Object.fromEntries(db.exec({sql:`SELECT id,payload FROM ${t} ORDER BY rowid`,returnValue:'resultRows'}).map(([k,v])=>[k,JSON.parse(v)]));
    return {...domains,expansion:{...header,actors:records('actors'),simulation:{...simHeader,people:records('people'),log:db.exec({sql:'SELECT payload FROM history ORDER BY seq',returnValue:'resultRows'}).map(([v])=>JSON.parse(v))}}};
  }
  function patch(s){const d=split(s);db.exec('BEGIN');try{put('domains','$expansion',d.header);for(const [k,v] of Object.entries(d.actors).slice(0,10))put('actors',k,v);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}}
  return {write,read,patch,close:()=>Object.values(prepared).forEach(s=>s.finalize())};
}
for(const n of [1000,5000]){
  const original=developedSave(n),text=JSON.stringify(original),bytes=encoder.encode(text),compressed=await gzip(text);
  assert.equal(await gunzip(compressed),text);
  const base64=Buffer.from(compressed).toString('base64');
  const single=new sqlite.oo1.DB(':memory:','c'),db=new sqlite.oo1.DB(':memory:','c');
  single.exec('CREATE TABLE snapshot(id INTEGER PRIMARY KEY,payload TEXT);');
  const statement=single.prepare('INSERT OR REPLACE INTO snapshot VALUES (1,?)');
  function snapshotWrite(s){const data=JSON.stringify(s);single.exec('BEGIN');try{stmtRun(statement,[data]);single.exec('COMMIT');}catch(e){single.exec('ROLLBACK');throw e;}}
  const hybrid=makeHybrid(db);hybrid.write(original);snapshotWrite(original);
  const dimensions={n,historyRows:n*2,jsonUTF8Bytes:bytes.length,jsonUTF16StorageBytes:text.length*2,gzipBytes:compressed.length,gzipBase64StorageBytes:base64.length*2,sqliteSnapshotBytes:sqlite.capi.sqlite3_js_db_export(single.pointer).length,sqliteHybridBytes:sqlite.capi.sqlite3_js_db_export(db.pointer).length};
  // This is an in-memory string sink, never labelled a localStorage write benchmark.
  const stringSink=new Map();
  const changed=structuredClone(original);changed.expansion.clock++;changed.expansion.sequence++;
  for(const a of Object.values(changed.expansion.actors).slice(0,10)){a.needs.food-=1;a.action=1;}
  const cases=[
    {name:'json-stringify-plus-string-sink',fn:()=>{const s=JSON.stringify(original);stringSink.set('save',s);return s;},check:v=>assert.equal(v,text)},
    {name:'json-parse',fn:()=>JSON.parse(text),check:v=>assert.deepEqual(v,original)},
    {name:'gzip-preencoded-text',fn:()=>gzip(text),check:async v=>assert.equal(await gunzip(v),text)},
    {name:'json-stringify-plus-gzip',fn:()=>gzip(JSON.stringify(original)),check:async v=>assert.equal(await gunzip(v),text)},
    {name:'gunzip-plus-json-parse',fn:async()=>JSON.parse(await gunzip(compressed)),check:v=>assert.deepEqual(v,original)},
    {name:'sqlite-snapshot-stringify-plus-transaction',fn:()=>snapshotWrite(original),check:()=>assert.equal(single.selectValue('SELECT payload FROM snapshot WHERE id=1'),text)},
    {name:'sqlite-snapshot-read-plus-parse',fn:()=>JSON.parse(single.selectValue('SELECT payload FROM snapshot WHERE id=1')),check:v=>assert.deepEqual(v,original)},
    {name:'sqlite-hybrid-full-write',fn:()=>hybrid.write(original),check:()=>assert.deepEqual(hybrid.read(),original)},
    {name:'sqlite-hybrid-full-read',fn:()=>hybrid.read(),check:v=>assert.deepEqual(v,original)},
    // Reset is outside timing. Patch timed from full save, including split and 10-row selection.
    {name:'sqlite-hybrid-10-actor-patch',before:()=>hybrid.write(original),fn:()=>hybrid.patch(changed),check:()=>assert.deepEqual(hybrid.read(),changed)}
  ].map(c=>({...c,raw:[]}));
  for(let r=-WARM;r<SAMPLES;r++)for(let j=0;j<cases.length;j++){
    const c=cases[(r+WARM+j)%cases.length];
    // Patch and write cases must start with original state, while reads must never see a prior patch.
    if(c.name.startsWith('sqlite-hybrid'))hybrid.write(original);
    c.before?.();const t=clock();const output=await c.fn();const ms=clock()-t;
    await c.check(output);if(r>=0)c.raw.push(ms);
  }
  for(const c of cases)result.rows.push({...dimensions,case:c.name,...stats(c.raw)});
  // Transaction atomicity in the in-memory engine only, no process or durable recovery claim.
  hybrid.write(original);db.exec('BEGIN');db.exec("UPDATE actors SET payload='broken' WHERE id='actor.0'");db.exec('ROLLBACK');assert.deepEqual(hybrid.read(),original);
  dimensions.wasmAssetBytes=(await import('node:fs')).statSync(new URL('./node_modules/@sqlite.org/sqlite-wasm/dist/sqlite3.wasm',import.meta.url)).size;
  result.fixtures??=[];result.fixtures.push(dimensions);
  hybrid.close();statement.finalize();db.close();single.close();
  console.log(`Verified synthetic save n=${n}, UTF8=${bytes.length}, gzip=${compressed.length}: all codec and DB roundtrips, patch and SQL rollback.`);
}
result.correctness='Every timed result checked outside timing; Unicode gzip exact, SQLite snapshot/hybrid exact, ten-actor patch exact, SQL rollback exact';
result.endEnvironment=environment();save('saves-results.json',result);
