// Dumps pre-change Seer saves (state + envelope) at the taught and promoted phases.
// Run on the code BEFORE the Q1 edits: node docs/gm/dispatch/lotm-q1-2026-10-23/dump_seer_fixtures.mjs
import fs from 'node:fs';
import {createExpansionState,advanceSimulation} from '../../../../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../../../../src/expedition_content.js';
import {enrollSimulation,commitSimulationCommand} from '../../../../src/simulation.js';
import {lotmContext} from '../../../../src/book_world_lotm_actions.js';
import {enrollLotmBranch,LOTM_NATIVE_STOCK} from '../../../../src/book_world_lotm_content.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from '../../../../src/book_world_lotm_ids.js';
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
const sleep=p=>{p.state.simulation.people.player.location=L.lodging;p=run(p,'sleep');p=wait(p,120);p.state.simulation.people.player.location=L.workroom;return p;};
const read=p=>wait(run(p,'act_reading'),10);
p=run(p,'report_in');p=run(p,'accept_allocation');p=run(p,'ingest');p=run(p,'lesson');p=wait(p,5);
fs.writeFileSync(new URL('./fixtures/seer_taught.json',import.meta.url),JSON.stringify(save(p)));
p=read(read(p));p=sleep(p);p=read(read(read(p)));p=run(p,'act_refusal');p=run(p,'request_assessment');p=run(p,'ingest_clown');
fs.writeFileSync(new URL('./fixtures/seer_promoted.json',import.meta.url),JSON.stringify(save(p)));
console.log('ok');
