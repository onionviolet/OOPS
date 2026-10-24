// Dumps saves and the command table from the PRIMARY checkout's uncommitted Q2/B2 code, run in a scratch overlay
// (this branch's src with the primary's src/book_world_lotm_*.js laid over it; see CHECKPOINT "Reconciliation"):
//   cd <overlay> && NODE_OPTIONS="--preserve-symlinks --preserve-symlinks-main" node dump_primary_q2_fixtures.mjs <outdir>
// Outputs primary_*.json saves (mid-walk, arrived, mid-act at the docks and the university) and primary_commands.json.
import fs from 'node:fs';
import {createExpansionState,advanceSimulation} from './src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from './src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand} from './src/simulation.js';
import {lotmContext,lotmCommands} from './src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from './src/book_world_lotm_content.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from './src/book_world_lotm_ids.js';
import {lotmWalkMinutes} from './src/book_world_lotm_districts.js';
const out=process.argv[2],vit={health:24,max_health:24,stamina:18,max_stamina:18};
const fresh=()=>{let p={state:initializeExpedition(createExpansionState(41)),external:{money:50},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=enrollSimulation(p.state,registry,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village'}});
 enrollLotmBranch(p.state);p.gameplay[I.supervisor]={inventory:structuredClone(LOTM_NATIVE_STOCK[I.supervisor]),skills:{},reputation:{}};return p;};
const ctx=(p,t)=>lotmContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit,[I.supervisor]:vit},vitalsByActor:{player:vit,[I.supervisor]:vit},nativeAlive:true,...(t?{targetId:t}:{}),facts:{location:p.state.simulation.people.player.location}});
const run=(p,id)=>{const d=registry.simulation.commands.get(`book.lotm.${id}`);const o=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p,d.targetId));return {...p,state:o.state,external:o.external??p.external,gameplay:o.gameplay??p.gameplay};};
const wait=(p,m)=>{const c=ctx(p);const o=advanceSimulation(p.state,registry,m,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...p,state:o.state,external:o.external??p.external,gameplay:o.gameplay??p.gameplay};};
const startWalk=(p,a,b)=>{const q=run(p,`walk_${a}_${b}`);q.state.simulation.people.player.location=L[b];return q;};
const save=p=>({expansion:p.state,'current location':p.state.simulation.people.player.location,inventories:{person:{
 main_character:Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,n])=>[k,{count:n}])),
 [I.supervisor]:Object.fromEntries(Object.entries(p.gameplay[I.supervisor].inventory).map(([k,n])=>[k,{count:n}]))}}});
const put=(n,p)=>fs.writeFileSync(`${out}/${n}.json`,JSON.stringify(save(p)));
let cc=run(run(run(fresh(),'report_in'),'accept_allocation_cc'),'ingest_cc');
put('primary_walk_midjob_docks',startWalk(cc,'workroom','docks'));
let at=wait(startWalk(cc,'workroom','docks'),lotmWalkMinutes(L.workroom,L.docks));put('primary_arrived_docks',at);
put('primary_docks_laying_midjob',run(at,'act_laying_out_docks'));
put('primary_docks_laid',wait(run(at,'act_laying_out_docks'),25));
let seer=wait(run(run(run(run(fresh(),'report_in'),'accept_allocation'),'ingest'),'lesson'),5);
let uni=wait(startWalk(seer,'workroom','university'),lotmWalkMinutes(L.workroom,L.university));
put('primary_university_reading_midjob',run(uni,'act_reading_university'));
fs.writeFileSync(`${out}/primary_commands.json`,JSON.stringify(lotmCommands));
console.log('ok',lotmCommands.length);
