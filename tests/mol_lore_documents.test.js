import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fixture,context,prefix as P,note} from '../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L1/fixture.mjs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitMolCommand,previewMolCommand,molPresentation} from '../src/book_world_mol_host.js';
import {advanceSimulationBoundary,cancelSimulationJob} from '../src/simulation.js';
import {molLoreEvidence,readMolLore} from '../src/book_world_mol_lore.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {MOL_LOCATIONS as L} from '../src/book_world_mol_ids.js';
import {molCommands} from '../src/book_world_mol_actions.js';
const ink='{"id":"Cyorian formula ink"}',oil='{"id":"Cyorian lamp oil"}',paper='{"id":"Cyorian research paper"}';
function at(p,location){p.state.simulation.people.player.location=location;return p;}
function act(p,id){return commitMolCommand(p.state,registry,{type:'book_mol',id:P+id},context(p));}
function finish(p){const j=p.state.simulation.jobs.find(j=>j.commandId.startsWith(P));if(!j)return p;while(p.state.clock<j.due){p.state.clock++;advanceSimulationBoundary(p,registry,{player:context(p)});}return p;}
function read(){let p=at(fixture(),L.library);p=act(p,'borrow');p=finish(act(p,'read'));return p;}
function workshop(p){at(p,L.workshop);p.gameplay.player.inventory[ink]=1;p.gameplay.player.inventory[oil]=1;p.gameplay.player.inventory[paper]=3;return p;}

test('existing commands and pending-job definitions remain byte-equivalent',()=>{
 const before=JSON.parse(fs.readFileSync(new URL('../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L1/commands-before.json',import.meta.url)));
 for(const c of before)assert.deepEqual(molCommands.find(x=>x.id===c.id),c);
});
test('loan, repeated read, returned access and durable reading remain separate',()=>{
 let p=read();assert.equal(p.state.simulation.custody[P+'packet'].owner,'book.mol.ibery');assert.equal(p.gameplay.player.inventory[note],1);
 const observed=structuredClone(p.state.simulation.knowledge.player),clock=p.state.clock;
 assert.equal(previewMolCommand(p.state,registry,P+'read',context(p)).eligible,false);assert.throws(()=>act(p,'read'));assert.equal(p.state.clock,clock);
 p=act(p,'return');assert.equal(p.gameplay.player.inventory[note]||0,0);assert.equal(p.gameplay['book.mol.ibery'].inventory[note],1);assert.deepEqual(p.state.simulation.knowledge.player,observed);
 assert.equal(previewMolCommand(p.state,registry,P+'reverse',context(p)).eligible,false);
 p=act(p,'borrow');p=finish(act(p,'reverse'));assert.ok(p.state.simulation.knowledge.player[P+'reverse.r1']);
 assert.equal(p.state.simulation.knowledge.player[P+'margin.r1'].value,observed[P+'margin.r1'].value);
});
test('observer projection, aliases, copies and lower-stage revised accounts cannot alter stock or prior understanding',()=>{
 let p=read();const before=JSON.stringify(p);assert.deepEqual(molLoreEvidence(p.state,'book.mol.nora').accounts,[]);readMolLore(p.state);molPresentation(p.state,registry,context(p));assert.equal(JSON.stringify(p),before);
 let e=molLoreEvidence(p.state);assert.equal(e.accounts.length,3);assert.equal(e.documentRoots.length,2);assert.deepEqual(e.accounts[0].referents,[ink,oil]);assert.notEqual(ink,oil);
 const print=p.state.simulation.knowledge.player[P+'print.r1'];p=at(p,L.workshop);p=finish(act(p,'revision'));assert.equal(p.state.simulation.knowledge.player[P+'revision.r2'].stage,'interpreted');assert.deepEqual(p.state.simulation.knowledge.player[P+'print.r1'],print);
 p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);assert.equal(molLoreEvidence(p.state).accounts.length,4);assert.ok(readMolLore(p.state).some(r=>r.text.includes('earlier account is retained')));
});
test('different actual liquids retain separate outcomes and ink returns for the incumbent making consumer',()=>{
 let p=workshop(read());const mastery=structuredClone(p.state.simulation.powers.player),stock=structuredClone(p.gameplay.player.inventory);
 p=finish(act(p,'trial_ink'));assert.equal(p.gameplay.player.inventory[ink],stock[ink]);assert.equal(p.gameplay.player.inventory[paper],stock[paper]-1);assert.equal(p.gameplay.player.inventory[oil],stock[oil]);
 p=finish(act(p,'trial_oil'));p=act(p,'compare');assert.equal(p.gameplay.player.inventory[paper],stock[paper]-2);assert.deepEqual(p.state.simulation.powers.player,mastery);
 const e=molLoreEvidence(p.state);assert.equal(e.accounts.filter(a=>a.kind==='observation').length,2);assert.equal(e.accounts.find(a=>a.id===P+'trial.oil').referents[0],oil);assert.equal(e.accounts.find(a=>a.id===P+'trial.ink').referents[0],ink);
 assert.ok(molCommands.find(c=>c.id==='book.mol.assemble_lamp').costs.some(c=>c.key===ink&&c.amount===-1));
 assert.throws(()=>act(p,'trial_ink'));assert.ok(p.state.simulation.knowledge.player[P+'copy.r1']);
});
test('trial cancellation and due-time support loss return inputs once with no invented outcome',()=>{
 for(const fail of [false,true]){let p=workshop(read());const stock=structuredClone(p.gameplay.player.inventory);p=act(p,'trial_ink');const job=p.state.simulation.jobs.find(j=>j.commandId===P+'trial_ink');
 assert.equal(p.gameplay.player.inventory[ink]||0,0);p.state=loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry);
 if(fail){p.state.simulation.people.player.body.mobile=false;p=finish(p);}else p=cancelSimulationJob(p.state,registry,job.id,context(p));
 assert.deepEqual(p.gameplay.player.inventory,stock);assert.equal(p.state.simulation.knowledge.player[P+'trial.ink'],undefined);assert.equal(p.state.simulation.jobs.some(j=>j.id===job.id),false);
 }
});
test('malformed account saves fail explicitly rather than silently reinterpret provenance',()=>{
 const p=read();const r=p.state.simulation.knowledge.player[P+'print.r1'];r.value=JSON.stringify({...JSON.parse(r.value),id:P+'other'});assert.throws(()=>loadExpansionState(p.state,registry),/Cyoria account/);
});
