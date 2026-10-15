// node helper_tick.mjs <repoOrBaseRoot> [fixture]; env HELPERS (64), N, PROF: hire helpers, then CPU ms of 1- and 12-minute advances + output hashes
import {fileURLToPath} from 'node:url';import path from 'node:path';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../..');
import fs from 'node:fs';import {createHash} from 'node:crypto';import {pathToFileURL} from 'node:url';
import inspector from 'node:inspector/promises';
const root=process.argv[2],fx=process.argv[3]||'mid';
const {advanceSimulation,validateExpansionState}=await import(pathToFileURL(root+'/src/expansion_engine.js').href);
const {commitSimulationCommand}=await import(pathToFileURL(root+'/src/simulation.js').href);
const {expeditionRegistry:registry}=await import(pathToFileURL(root+'/src/expedition_content.js').href);
const seed=JSON.parse(fs.readFileSync(REPO+`/tests/fixtures/perf/${fx}.json`,'utf8'));
const wood=JSON.stringify({id:'Rough wood log'});
let p={state:seed.expansion,external:{money:1000},gameplay:{player:{inventory:{[wood]:1000},skills:{},reputation:{}}}};
p.state.simulation.knowledge.player.workbench={stage:'understood',value:'Generated benchmark qualification',at:p.state.clock,cause:'fixture:qualification'};
const ctx=()=>({actorId:'player',external:p.external,gameplay:p.gameplay,facts:{location:'Village','village.craftsmanMet':true},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}});
const H=+process.env.HELPERS||64;
let c0=process.cpuUsage();for(let i=0;i<H;i++)p=commitSimulationCommand(p.state,registry,{id:'village.hire_helper'},ctx());const hireMs=(d=>(d.user+d.system)/1000)(process.cpuUsage(c0));
const cpu=(fn,n)=>{const t=[];let r;for(let i=0;i<n;i++){const c=process.cpuUsage();r=fn();const d=process.cpuUsage(c);t.push((d.user+d.system)/1000);}t.sort((a,b)=>a-b);return [t[n>>1],r];};
let sess;if(process.env.PROF){sess=new inspector.Session();sess.connect();await sess.post('Profiler.enable');await sess.post('Profiler.start');}
const [tick,r1]=cpu(()=>advanceSimulation(p.state,registry,1,p.external,p.gameplay),+process.env.N||5);
const [jump,r12]=cpu(()=>advanceSimulation(p.state,registry,12,p.external,p.gameplay),3);
if(sess){const {profile}=await sess.post('Profiler.stop');fs.mkdirSync(process.env.PROF,{recursive:true});fs.writeFileSync(process.env.PROF+'/'+Date.now()+'.cpuprofile',JSON.stringify(profile));}
const h=v=>createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0,12);
console.log(fx,JSON.stringify({hireTotalMs:+hireMs.toFixed(1),tick1Ms:+tick.toFixed(1),jump12Ms:+jump.toFixed(1)}),h(p),h(r1),h(r12));
