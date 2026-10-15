// Identical generated paid helper workload before/after a scheduler correction.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import assert from 'node:assert/strict';
import {advanceSimulation,validateExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
// Committed synthetic seed (scripts/perf/gen_fixtures.mjs); never a personal save.
const seed=JSON.parse(fs.readFileSync(process.env.YAIRPG_PROFILE_SEED || new URL('../tests/fixtures/perf/mid.json',import.meta.url),'utf8'));
const wood=JSON.stringify({id:'Rough wood log'}),kit=JSON.stringify({id:'Prepared survey kit'});
let p={state:seed.expansion,external:{money:1000},gameplay:{player:{inventory:{[wood]:1000},skills:{},reputation:{}}}};
p.state.simulation.knowledge.player.workbench={stage:'understood',value:'Generated benchmark qualification',at:p.state.clock,cause:'fixture:qualification'};
const ctx=()=>({actorId:'player',external:p.external,gameplay:p.gameplay,facts:{location:'Village','village.craftsmanMet':true},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}});
for(let i=0;i<64;i++)p=commitSimulationCommand(p.state,registry,{id:'village.hire_helper'},ctx());
const summary=a=>{a.sort((a,b)=>a-b);return {n:a.length,median:a[Math.floor(a.length/2)],p95:a.at(-1)};};
const measured=(minutes,n=5)=>{let result;const times=[];for(let i=0;i<n;i++){const t=performance.now();result=advanceSimulation(p.state,registry,minutes,p.external,p.gameplay);times.push(performance.now()-t);}return {ms:summary(times),result};};
const tick=measured(1),jump=measured(12);
let split=structuredClone(p);for(let i=0;i<12;i++)split=advanceSimulation(split.state,registry,1,split.external,split.gameplay);
assert.deepEqual({state:split.state,external:split.external,gameplay:split.gameplay},{state:jump.result.state,external:jump.result.external,gameplay:jump.result.gameplay});
const helpers=Object.entries(jump.result.state.simulation.people).filter(([,v])=>v.definitionId==='village.route_helper').map(([id])=>id);
assert.equal(helpers.length,64);assert.ok(helpers.every(id=>jump.result.state.simulation.owners[id][kit]===1));validateExpansionState(jump.result.state,registry);
const t=performance.now(),budget=advanceSimulation(p.state,registry,10000,p.external,p.gameplay),budgetMs=performance.now()-t;
assert.equal(budget.remaining,9488);assert.equal(budget.budgetExhausted,true);
const output={environment:{node:process.version,platform:process.platform,arch:process.arch},actors:64,oneMinuteTickMs:tick.ms,twelveMinuteJumpMs:jump.ms,pathologicalRequestMs:budgetMs,unspentMinutes:budget.remaining,budgetBounded:budget.budgetExhausted,splitMatchesJump:true,exactOwners:true};
const exact={tick:tick.result,jump:jump.result,budget};
if(process.env.YAIRPG_SCHEDULER_COMPARE)assert.deepEqual(JSON.parse(JSON.stringify(exact)),JSON.parse(fs.readFileSync(process.env.YAIRPG_SCHEDULER_COMPARE,'utf8')));
if(process.env.YAIRPG_SCHEDULER_EXPECTED)fs.writeFileSync(process.env.YAIRPG_SCHEDULER_EXPECTED,JSON.stringify(exact));
if(process.env.YAIRPG_SCALE_OUTPUT)fs.writeFileSync(process.env.YAIRPG_SCALE_OUTPUT,JSON.stringify(output,null,2));console.log(JSON.stringify(output,null,2));
