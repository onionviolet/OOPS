import {performance} from 'node:perf_hooks';
import os from 'node:os';
import assert from 'node:assert/strict';
import {writeFileSync,readFileSync,mkdirSync,renameSync} from 'node:fs';
import {make,startJobs} from './adapter.mjs';
const root=process.env.ER14_REPO||'/Users/weiwei/code/yet-another-idle-rpg';
const {createExpansionState,createContentRegistry,advanceSimulation}=await import(root+'/src/expansion_engine.js');
const {enrollSimulation,commitSimulationCommand}=await import(root+'/src/simulation.js');
const old=JSON.parse(readFileSync(root+'/docs/gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark-results.json'));
const shapes=[{name:'fresh',actors:1,items:20,opportunities:0,facts:0},{name:'crowded',actors:128,items:10000,opportunities:2000,facts:100}];
const round=n=>+n.toFixed(6);
function stats(times){times.sort((a,b)=>a-b);return {median_ms:round(times[15]),p95_ms:round(times[29]),samples:31};}
function measure(setup,fn){let sink;for(let i=0;i<4;i++)sink=fn(setup());const times=[];for(let i=0;i<31;i++){const input=setup(),t=performance.now();sink=fn(input);times.push(performance.now()-t);}assert.ok(sink!==undefined);return stats(times);}
function mem(){const data=new Map();return {write:(k,v)=>{data.set(k,v);return {};},read:k=>data.get(k)};}
function disk(dir){mkdirSync(dir,{recursive:true});return {write:(key,value)=>{const t=performance.now();if(key==='manifest'){writeFileSync(dir+'/manifest.next',value);renameSync(dir+'/manifest.next',dir+'/manifest');}else writeFileSync(dir+'/'+key,value);return {write_ms:performance.now()-t};},read:key=>readFileSync(dir+'/'+key,'utf8')};}
function baseline(s){
 const people=Array.from({length:s.actors-1},(_,i)=>({id:`peer.${i}`,revision:1,label:`Peer ${i}`,worldId:'base.frontier',location:'Village',inventory:'simulation',resources:{fuel:20}}));
 const registry=createContentRegistry({worlds:[{id:'base.frontier'}],opportunities:[{id:'fixture.offer'}],simulation:{people,commands:[{id:'fixture.work',revision:1,label:'Fixture work',duration:60,cancellation:'refund',costs:[],effects:[{type:'resource',key:'output',amount:1}]}]}});
 const gameplay={player:{inventory:{},skills:{Literacy:{xp:0,parent:null,enabled:true,present:true}},reputation:{Village:0}}};
 for(let i=0;i<s.items;i++)gameplay.player.inventory[JSON.stringify({id:'Rough wood log',quality:i+1})]=1;
 let p=enrollSimulation(createExpansionState(42),registry,{actorId:'player',external:{money:102},gameplay,facts:{location:'Village'}});
 for(const actorId of Object.keys(p.state.actors))for(let i=0;i<s.facts;i++)p.state.actors[actorId].facts[`fixture.fact.${i}`]=`synthetic observation ${i}`;
 for(let i=0;i<s.opportunities;i++)p.state.opportunities[`fixture.offer.${i}`]={definitionId:'fixture.offer',due:0,expires:1,blocking:false,status:'expired',context:{actorId:'player',worldId:'base.frontier'}};
 for(const actorId of Object.keys(p.state.actors))p=commitSimulationCommand(p.state,registry,{id:'fixture.work'},{actorId,external:p.external,gameplay:p.gameplay,facts:{location:'Village'}});
 return {p,registry};
}
const results={environment:{node:process.version,cpu:os.cpus()[0].model,platform:process.platform,startedAt:new Date().toISOString()},method:'4 warmups, 31 samples; fixture/load setup excluded; median and nearest-rank p95; no forced GC; shared contended host; fs writes include OS cache, no fsync; kernel surrogate and full expansion have different semantics',sizes:[]};
for(const s of shapes){
 const k=make(s);startJobs(k,s.actors);const db=mem();k.save(db);
 const setup=()=>{const x=make(s);x.load(db);return x;};
 const base=baseline(s);
 const row={shape:s,kernel:{advance_1_future_jobs:measure(setup,x=>{x.advance(1);return x.clock;}),advance_60_settle_all:measure(setup,x=>{x.advance(60);assert.equal(Object.values(x.view('actors')).filter(a=>a.output>0).length,s.actors);return x.clock;})},baseline_rerun:{},ER1_historical:old.sizes.find(x=>x.name===s.name).operations,chunks:[]};
 for(const [name,minutes]of [['advance_1_future_jobs',1],['advance_60_settle_all',60]])row.baseline_rerun[name]=measure(()=>base,({p,registry})=>advanceSimulation(p.state,registry,minutes,p.external,p.gameplay));
 const storage=disk('/tmp/yairpg-er14/writes/'+s.name);
 const fresh=make(s);startJobs(fresh,s.actors);const first=fresh.save(storage);
 row.totalSaveBytes=first.totalBytes;
 for(const chunk of first.writes){const times=[];for(let i=0;i<35;i++){const m=JSON.parse(storage.read('manifest'));const text=chunk.id==='manifest'?storage.read('manifest'):storage.read(m.refs[chunk.id].key);const r=storage.write(chunk.id==='manifest'?'manifest':m.refs[chunk.id].key,text);if(i>=4)times.push(r.write_ms);}row.chunks.push({...chunk,write:stats(times)});}
 fresh.advance(1);row.incremental=fresh.save(storage);row.serialize_validate_write=measure(()=>{const x=make(s);startJobs(x,s.actors);return x;},x=>x.save(storage));
 results.sizes.push(row);console.log(JSON.stringify({size:s.name,kernel:row.kernel,baseline:row.baseline_rerun,totalSaveBytes:row.totalSaveBytes,chunks:row.chunks.map(x=>({id:x.id,bytes:x.bytes,write:x.write})),incremental:row.incremental.writes.map(x=>x.id)}));
}
results.environment.finishedAt=new Date().toISOString();writeFileSync(new URL('./benchmark-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
