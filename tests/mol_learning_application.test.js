import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitSimulationCommand,cancelSimulationJob,advanceSimulationBoundary,previewSimulationCommand} from '../src/simulation.js';
import {loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {MOL_IDS as I,MOL_KEYS as K} from '../src/book_world_mol_ids.js';
const command='book.mol.use_lamp_house';
const fixture=new URL('../docs/gm/dispatch/other-systems-depth-2026-10-26/learning/evidence/TEST-FIXTURE-R15-G4-learning-house.txt',import.meta.url);
// Named supplied-stock R15 G4 QA route: actual control completion, lamp test,
// survey, decline and service closure. No player save and no source-canon claim.
function setup(){
 const raw=JSON.parse(Buffer.from(fs.readFileSync(fixture,'utf8').trim().split(':')[1],'base64'));
 const state=loadExpansionState(raw.expansion,registry);
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,bag])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(bag).map(([k,e])=>[k,e.count])),skills:{},reputation:{}}]));
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:80,max_health:80,stamina:30,max_stamina:51}]));
 vitals.player={health:80,max_health:80,stamina:30,max_stamina:51};
 return {state,gameplay,vitals,external:{money:raw.character.money},equipment:{}};
}
function ctx(p){return {actorId:'player',targetId:I.imaya,nativeAlive:true,nativeBody:p.state.simulation.people.player.body,molNative:{bound:true,revision:p.state.motherOfLearning.nativeRevision,body:p.state.simulation.people.player.body},vitals:p.vitals,gameplay:p.gameplay,external:p.external,facts:{location:p.state.simulation.people.player.location}};}
const act=p=>commitSimulationCommand(p.state,registry,{id:command},ctx(p));
function finish(p,stepped=false){const due=p.state.simulation.jobs.find(j=>j.commandId===command).due;while(p.state.clock<due){p.state.clock=stepped?p.state.clock+1:due;advanceSimulationBoundary(p,registry,{player:ctx(p)});}return p;}
const fuel=p=>p.state.actors.player.resources['book.mol.deviceFuel'];
const attention=p=>p.state.actors[I.imaya].resources['book.mol.attention'];
const mastery=p=>p.state.simulation.powers.player[I.operator].mastery;

test('earned manual control has a household consumer with finite charge and retained physical lamp',()=>{
 const p=setup();assert.equal(mastery(p),1);assert.equal(p.state.actors.player.completed['book.mol.control_drill'],1);assert.ok(p.state.simulation.knowledge.player['book.mol.formula']);
 const quote=previewSimulationCommand(p.state,registry,command,ctx(p));assert.equal(quote.eligible,true);assert.equal(quote.duration,3);
 const job=act(p);assert.equal(fuel(job),fuel(p)-1);assert.equal(attention(job),attention(p)-1);assert.equal(job.gameplay.player.inventory[K.lamp]||0,0);
 const done=finish(job);assert.equal(done.gameplay.player.inventory[K.lamp],1);assert.equal(done.vitals.player.stamina,32);assert.equal(mastery(done),1);assert.equal(done.state.actors.player.completed[command],1);assert.ok(done.state.simulation.knowledge.player['book.mol.houseLamp']);assert.throws(()=>act(done));
 advanceSimulationBoundary(done,registry,{player:ctx(done)});assert.equal(done.state.actors.player.completed[command],1);assert.equal(done.vitals.player.stamina,32);assert.equal(done.gameplay.player.inventory[K.lamp],1);assert.equal(fuel(done),fuel(p)-1);
});

test('custody, faculty, current body, fuel and practiced control gate use without erasing knowledge',()=>{
 for(const change of [p=>delete p.gameplay.player.inventory[K.lamp],p=>p.state.simulation.faculties.player[I.operator].active=false,p=>p.state.simulation.people.player.body.hands=0,p=>p.state.actors.player.resources['book.mol.deviceFuel']=0,p=>p.state.simulation.powers.player[I.operator].mastery=0]){
  const p=setup();change(p);const before=structuredClone(p);assert.throws(()=>act(p));assert.deepEqual(p,before);assert.ok(p.state.simulation.knowledge.player['book.mol.formula']);
 }
});

test('cancellation and lost continuing support return exact reservations once, without household reward',()=>{
 const p=setup(),job=act(p),cancelled=cancelSimulationJob(job.state,registry,job.commitment.id,ctx(job));
 assert.equal(fuel(cancelled),fuel(p));assert.equal(attention(cancelled),attention(p));assert.equal(cancelled.gameplay.player.inventory[K.lamp],1);assert.equal(cancelled.state.simulation.knowledge.player['book.mol.houseLamp'],undefined);assert.throws(()=>cancelSimulationJob(cancelled.state,registry,job.commitment.id,ctx(cancelled)));
 const broken=act(p);broken.state.simulation.faculties.player[I.operator].suppressed=true;const failed=finish(broken);assert.equal(fuel(failed),fuel(p));assert.equal(attention(failed),attention(p));assert.equal(failed.gameplay.player.inventory[K.lamp],1);assert.equal(failed.state.simulation.knowledge.player['book.mol.houseLamp'],undefined);assert.equal(mastery(failed),1);
});

function advance(p,minutes){
 const contexts=Object.fromEntries(Object.entries(p.vitals).map(([id,v])=>[id,{...ctx(p),actorId:id,vitals:v}]));
 const out=advanceSimulation(p.state,registry,minutes,p.external,p.gameplay,contexts);
 assert.equal(out.remaining,0);out.vitals=structuredClone(p.vitals);return out;
}
test('pending reload preserves the held lamp and batch versus stepped settlement; exact source expiry refuses',()=>{
 const p=setup(),batch=act(p),pending=act(p);pending.state=loadExpansionState(JSON.parse(JSON.stringify(pending.state)),registry);
 const a=advance(batch,3);let b=pending;for(let i=0;i<3;i++)b=advance(b,1);
 assert.equal(a.state.actors.player.completed[command],1);assert.equal(b.state.actors.player.completed[command],1);assert.deepEqual(a.state.simulation.knowledge.player['book.mol.houseLamp'],b.state.simulation.knowledge.player['book.mol.houseLamp']);assert.equal(fuel(a),fuel(b));assert.equal(attention(a),attention(b));assert.equal(a.gameplay.player.inventory[K.lamp],1);assert.equal(b.gameplay.player.inventory[K.lamp],1);
 for(const stepped of [false,true]){const q=setup(),due=q.state.clock+3;q.state.actors.player.sources[I.operator].expiresAt=due;let j=act(q);j.state=loadExpansionState(JSON.parse(JSON.stringify(j.state)),registry);if(stepped){for(let i=0;i<3;i++)j=advance(j,1);}else j=advance(j,3);assert.equal(j.state.simulation.knowledge.player['book.mol.houseLamp'],undefined);assert.equal(fuel(j),fuel(q));assert.equal(j.gameplay.player.inventory[K.lamp],1);assert.equal(mastery(j),1);}
});
