import {performance} from 'node:perf_hooks';
import os from 'node:os';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {createExpansionState,createContentRegistry,advanceSimulation,validateExpansionState} from '../../../../../src/expansion_engine.js';
import {enrollSimulation,commitSimulationCommand,previewSimulationCommand} from '../../../../../src/simulation.js';
import {validateSaveEnvelope} from '../../../../../src/save_files.js';
import {persistExpansionPlan} from '../../../../../src/expansion_persistence.js';
import {observeLifeSave,createLifeRecord} from '../../../../../src/life_record.js';
// Adapted from tests/simulation.test.js sandbox and tests/save_files.test.js envelope.
// Scale is synthetic; content IDs are fixture IDs, never a personal save.
const sizes=[['fresh',1,20,0,0],['mid',32,1000,200,30],['crowded',128,10000,2000,100]];
let sink;
function measure(fn){for(let i=0;i<4;i++)sink=fn();const times=[];for(let i=0;i<31;i++){const t=performance.now();sink=fn();times.push(performance.now()-t);}times.sort((a,b)=>a-b);return {median_ms:+times[15].toFixed(4),p95_ms:+times[29].toFixed(4),samples:31};}
const results={environment:{node:process.version,platform:process.platform,arch:process.arch,cpu:os.cpus()[0].model,startedAt:new Date().toISOString()},method:'4 warmups, 31 independent same-input operations, median and nearest-rank p95; fixture setup excluded; GC not forced; one process; no DOM or real localStorage',sizes:[]};
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
 const e={'game version':'v0.6','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'Synthetic Hero',money:102,xp:{total_xp:0},equipment:{}},levels:{person:{main_character:{total_xp:0,skill_xp:{Literacy:0}}}},inventories:{person:{main_character:{}}},availabilities:{person:{}},npcs:{},locations:{Village:{}},expansion:p.state,life_record:createLifeRecord()};
 for(let i=0;i<items;i++)e.inventories.person.main_character[JSON.stringify({id:'Rough wood log',quality:i+1})]={count:1};
 const serialized=JSON.stringify(e),context={actorId:'player',external:idle.external,gameplay:idle.gameplay,facts:{location:'Village'}};
 validateExpansionState(p.state,registry);validateSaveEnvelope(e,'v0.6');
 const before=JSON.stringify(p);const tick=advanceSimulation(p.state,registry,1,p.external,p.gameplay);assert.equal(tick.state.clock,1);assert.equal(tick.remaining,0);assert.equal(JSON.stringify(p),before);
 const settled=advanceSimulation(p.state,registry,60,p.external,p.gameplay);assert.equal(settled.state.simulation.jobs.length,0);assert.equal(settled.state.clock,60);assert.equal(Object.values(settled.state.actors).reduce((n,a)=>n+(a.resources.output||0),0),actors);
 const memoryStorage={setItem(key,value){sink=value.length;}};
 const row={name,shape:{actors,scheduled_jobs:actors,native_inventory_entries:items,expired_opportunities:opportunities,facts_per_actor:facts,simulation_log:p.state.simulation.log.length},bytes:{utf8:Buffer.byteLength(serialized),utf16:serialized.length*2,expansion_utf8:Buffer.byteLength(JSON.stringify(p.state)),inventory_utf8:Buffer.byteLength(JSON.stringify(e.inventories))},operations:{}};
 const ops={clone_expansion:()=>structuredClone(p.state),validate_expansion:()=>validateExpansionState(p.state,registry),advance_1_future_jobs:()=>advanceSimulation(p.state,registry,1,p.external,p.gameplay),advance_60_settle_all:()=>advanceSimulation(p.state,registry,60,p.external,p.gameplay),preview_command:()=>previewSimulationCommand(idle.state,registry,'fixture.now',context),commit_command:()=>commitSimulationCommand(idle.state,registry,{id:'fixture.now'},context),serialize_envelope:()=>JSON.stringify(e),parse_envelope:()=>JSON.parse(serialized),validate_envelope:()=>validateSaveEnvelope(e,'v0.6'),autosave_pure_stages:()=>{const first=JSON.stringify(e),save=JSON.parse(first);save.life_record=observeLifeSave(save.life_record,save);const second=JSON.stringify(save);return JSON.parse(second).saved_at;},persist_plan_mock_storage:()=>persistExpansionPlan(p,{createSave:()=>JSON.stringify(e),storage:memoryStorage,key:'synthetic',bindings:{player:{category:'person',id:'main_character'}},validateEnvelope:v=>validateSaveEnvelope(v,'v0.6')})};
 for(const [id,fn]of Object.entries(ops))row.operations[id]=measure(fn);
 results.sizes.push(row);console.log(JSON.stringify(row));
}
results.environment.finishedAt=new Date().toISOString();
writeFileSync(new URL('./benchmark-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results.environment));
