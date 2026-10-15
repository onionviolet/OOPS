// node state_bench.mjs <repoOrBaseRoot> [sizes] [ops]; env N, PROF: ER1 synthetic fixtures (benchmark.mjs), CPU-time medians + output hashes
import {fileURLToPath} from 'node:url';import path from 'node:path';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../..');
import {performance} from 'node:perf_hooks';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import inspector from 'node:inspector/promises';import {writeFileSync,mkdirSync} from 'node:fs';
const PROF=process.env.PROF;let sess;if(PROF){sess=new inspector.Session();sess.connect();await sess.post('Profiler.enable');}
const root=process.argv[2];const want=(process.argv[3]||'mid,crowded').split(',');const opsWant=process.argv[4]?.split(',');
const imp=p=>import(pathToFileURL(root+'/src/'+p).href);
const {createExpansionState,createContentRegistry,advanceSimulation,validateExpansionState}=await imp('expansion_engine.js');
const {enrollSimulation,commitSimulationCommand,previewSimulationCommand}=await imp('simulation.js');
const {validateSaveEnvelope}=await imp('save_files.js');
const sizes=[['fresh',1,20,0,0],['mid',32,1000,200,30],['crowded',128,10000,2000,100]].filter(s=>want.includes(s[0]));
let sink;const N=+process.env.N||15;
function measure(fn){for(let i=0;i<3;i++)sink=fn();const times=[];for(let i=0;i<N;i++){const c=process.cpuUsage();sink=fn();const d=process.cpuUsage(c);times.push((d.user+d.system)/1000);}times.sort((a,b)=>a-b);return +times[N>>1].toFixed(2);}
const h=v=>createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0,12);
for(const [name,actors,items,opportunities,facts] of sizes){
 const people=Array.from({length:actors-1},(_,i)=>({id:`peer.${i}`,revision:1,label:`Peer ${i}`,worldId:'base.frontier',location:'Village',inventory:'simulation',resources:{fuel:20}}));
 const registry=createContentRegistry({worlds:[{id:'base.frontier'}],opportunities:[{id:'fixture.offer'}],simulation:{people,commands:[{id:'fixture.work',revision:1,label:'Fixture work',duration:60,cancellation:'refund',costs:[],effects:[{type:'resource',key:'output',amount:1}]},{id:'fixture.now',revision:1,label:'Fixture instant',duration:0,costs:[],effects:[]}]}});
 const gameplay={player:{inventory:{},skills:{Literacy:{xp:0,parent:null,enabled:true,present:true}},reputation:{Village:0}}};
 for(let i=0;i<items;i++)gameplay.player.inventory[JSON.stringify({id:'Rough wood log',quality:i+1})]=1;
 let p=enrollSimulation(createExpansionState(42),registry,{actorId:'player',external:{money:102},gameplay,facts:{location:'Village'}});
 for(const actorId of Object.keys(p.state.actors))for(let i=0;i<facts;i++)p.state.actors[actorId].facts[`fixture.fact.${i}`]=`synthetic observation ${i}`;
 for(let i=0;i<opportunities;i++)p.state.opportunities[`fixture.offer.${i}`]={definitionId:'fixture.offer',due:0,expires:1,blocking:false,status:'expired',context:{actorId:'player',worldId:'base.frontier'}};
 const idle=structuredClone(p);
 for(const actorId of Object.keys(p.state.actors))p=commitSimulationCommand(p.state,registry,{id:'fixture.work'},{actorId,external:p.external,gameplay:p.gameplay,facts:{location:'Village'}});
 const e={'game version':'v0.6','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'Synthetic Hero',money:102,xp:{total_xp:0},equipment:{}},levels:{person:{main_character:{total_xp:0,skill_xp:{Literacy:0}}}},inventories:{person:{main_character:{}}},availabilities:{person:{}},npcs:{},locations:{Village:{}},expansion:p.state};
 const context={actorId:'player',external:idle.external,gameplay:idle.gameplay,facts:{location:'Village'}};
 const before=JSON.stringify(p);
 const r1=advanceSimulation(p.state,registry,1,p.external,p.gameplay),r60=advanceSimulation(p.state,registry,60,p.external,p.gameplay);
 const pv=previewSimulationCommand(idle.state,registry,'fixture.now',context),cm=commitSimulationCommand(idle.state,registry,{id:'fixture.now'},context);
 assert.equal(JSON.stringify(p),before);
 const hashes={setup:h(p),a1:h(r1),a60:h(r60),preview:h(pv),commit:h(cm)};
 const ops={validate_expansion:()=>validateExpansionState(p.state,registry),advance_1:()=>advanceSimulation(p.state,registry,1,p.external,p.gameplay),advance_60:()=>advanceSimulation(p.state,registry,60,p.external,p.gameplay),preview:()=>previewSimulationCommand(idle.state,registry,'fixture.now',context),commit:()=>commitSimulationCommand(idle.state,registry,{id:'fixture.now'},context),validate_envelope:()=>validateSaveEnvelope(e,'v0.6')};
 if(PROF)await sess.post('Profiler.start');
 const row={};for(const [id,fn] of Object.entries(ops))if(!opsWant||opsWant.includes(id))row[id]=measure(fn);
 if(PROF){const {profile}=await sess.post('Profiler.stop');mkdirSync(PROF,{recursive:true});writeFileSync(PROF+'/'+Date.now()+'.cpuprofile',JSON.stringify(profile));}
 console.log(name,JSON.stringify(row),JSON.stringify(hashes));
}
