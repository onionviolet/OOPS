// Dumps saves and the command table from the code BEFORE the Q2+ edits (run once, on the Q1 code):
//   node docs/gm/dispatch/lotm-lives-regions-2026-10-23/dump_pre_slice_fixtures.mjs
// Outputs: fixtures/cc_allocated.json, cc_acting.json, cc_promoted.json (Corpse Collector phases) and
// fixtures/pre_commands.json (the exact lotmCommands table), used by tests/lotm_lives_compat.test.js.
import fs from 'node:fs';
import {createExpansionState,advanceSimulation} from '../../../../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../../../../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand} from '../../../../src/simulation.js';
import {lotmContext,lotmCommands} from '../../../../src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../../../../src/book_world_lotm_content.js';
import {LOTM_IDS as I} from '../../../../src/book_world_lotm_ids.js';
const vit={health:24,max_health:24,stamina:18,max_stamina:18};
let p={state:initializeExpedition(createExpansionState(41)),external:{money:50},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
p=enrollSimulation(p.state,registry,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit},facts:{location:'Village'}});
enrollLotmBranch(p.state);p.gameplay[I.supervisor]={inventory:structuredClone(LOTM_NATIVE_STOCK[I.supervisor]),skills:{},reputation:{}};
const ctx=(p,t)=>lotmContext(p.state,{actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:vit,[I.supervisor]:vit},vitalsByActor:{player:vit,[I.supervisor]:vit},nativeAlive:true,...(t?{targetId:t}:{}),facts:{location:p.state.simulation.people.player.location}});
const run=(p,id)=>{const d=registry.simulation.commands.get(`book.lotm.${id}`);const o=commitSimulationCommand(p.state,registry,{id:d.id},ctx(p,d.targetId));return {...p,state:o.state,external:o.external??p.external,gameplay:o.gameplay??p.gameplay};};
const wait=(p,m)=>{const c=ctx(p);const o=advanceSimulation(p.state,registry,m,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});return {...p,state:o.state,external:o.external??p.external,gameplay:o.gameplay??p.gameplay};};
const save=p=>({expansion:p.state,'current location':p.state.simulation.people.player.location,inventories:{person:{
 main_character:Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,n])=>[k,{count:n}])),
 [I.supervisor]:Object.fromEntries(Object.entries(p.gameplay[I.supervisor].inventory).map(([k,n])=>[k,{count:n}]))}}});
const out=(name,p)=>fs.writeFileSync(new URL(`./fixtures/${name}.json`,import.meta.url),JSON.stringify(save(p)));
p=run(p,'report_in');p=run(p,'accept_allocation_cc');out('cc_allocated',p);
p=run(p,'ingest_cc');p=wait(run(p,'act_laying_out'),25);out('cc_acting',p);
p=wait(run(p,'act_laying_out'),25);p=wait(run(p,'act_laying_out'),25);p=wait(run(p,'act_vigil'),60);
p=run(p,'request_assessment_cc');p=run(p,'ingest_gravedigger');out('cc_promoted',p);
fs.writeFileSync(new URL('./fixtures/pre_commands.json',import.meta.url),JSON.stringify(lotmCommands));
console.log('ok');
