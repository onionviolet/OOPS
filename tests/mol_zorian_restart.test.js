import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture,context,envelope} from '../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L2/fixture.mjs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewMolCommand,commitMolCommand,molPresentation,validateMolCampaignState} from '../src/book_world_mol_host.js';
import {molCommands,molFacts} from '../src/book_world_mol_actions.js';
import {validateMolEnvelope,molCalendarAt,molQuestProjection} from '../src/book_world_mol_native.js';
import {MOL_IDS as I,MOL_LOCATIONS as L} from '../src/book_world_mol_ids.js';
import {MOL_START_ZORIAN,MOL_BEGIN_ZORIAN,resolveSeatActor,molSupplier} from '../src/book_world_mol_starts.js';
import {installedWorldPack} from '../src/world_pack_registry.js';
import {advanceSimulationBoundary} from '../src/simulation.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {energyView} from '../src/energy_resources.js';
import {MOL_ZORIAN_RESERVE} from '../src/book_world_mol_starts.js';
import {MOL_LOCATIONS as LOC} from '../src/book_world_mol_ids.js';
const Z='book.mol.zorian.s0.';
const finish=p=>{let n=0;while(p.state.simulation.jobs.some(j=>j.actorId==='player')&&n++<2000){p.state.clock++;advanceSimulationBoundary(p,registry,{player:zctx(p)});}return p;};
const run=(p,id)=>finish(act(p,id));
const reserve=p=>energyView(p.state,'player').find(r=>r.id===MOL_ZORIAN_RESERVE);
const at=(p,where)=>{const out=commitMolCommand(p.state,registry,{type:'book_mol',id:'book.mol.move.'+where},zctx(p));return {...p,...out};};
const act=(p,id)=>({...p,...commitMolCommand(p.state,registry,{type:'book_mol',id},zctx(p))});
// G1/G3/G15 (Zorian stage record). Boots the pack against the current registry with the new start (KJ3P lesson),
// proves the visitor start is unchanged, and runs the first Zorian command as the seat.
const ids=(p,c=context)=>molPresentation(p.state,registry,c(p)).sections.flatMap(s=>s.actions.map(a=>a.id));
// A pre-entry state: the visitor fixture with every Cyoria owner removed, standing in the Village.
function village(){
 const p=fixture(false),s=p.state;
 delete s.motherOfLearning;delete s.worlds[I.world];
 for(const id of Object.keys(s.actors))if(id.startsWith('book.mol.')&&id!=='player'){delete s.actors[id];delete s.simulation.people[id];delete p.gameplay[id];delete p.vitals[id];}
 for(const v of Object.values(s.simulation))if(v&&typeof v==='object'&&!Array.isArray(v))for(const id of Object.keys(v))if(id.startsWith('book.mol.')&&id!=='book.mol.visitor_branch'&&!id.includes('.lore.')&&(id.split('.').length===3))delete v[id];
 for(const bag of [s.simulation.claims,s.simulation.controllers])for(const [k,v] of Object.entries(bag))if(k.startsWith('book.mol.')||JSON.stringify(v).includes('book.mol.'))delete bag[k];
 s.simulation.log=[];
 s.actors.player.worldId='base.frontier';s.simulation.people.player.location='Village';
 for(const k of Object.keys(s.actors.player.resources))if(k.startsWith('book.mol.'))delete s.actors.player.resources[k];
 delete s.simulation.situations['book.mol.visitor_branch'];s.actors.player.facts={};s.actors.player.completed={};s.simulation.jobs=[];
 for(const k of Object.keys(s.simulation.knowledge.player||{}))if(k.startsWith('book.mol.'))delete s.simulation.knowledge.player[k];
 s.schema=10;return p;
}
const begin=p=>({...p,...commitMolCommand(p.state,registry,{type:'book_mol',id:MOL_BEGIN_ZORIAN},context0(p))});
const context0=p=>({actorId:'player',nativeAlive:true,nativeBody:p.state.simulation.people.player.body,molNative:{bound:true,revision:0,body:p.state.simulation.people.player.body},vitals:p.vitals,gameplay:p.gameplay,external:p.external,equipment:p.equipment,facts:{location:p.state.simulation.people.player.location}});
function zorian(){const p=begin(village());const d=p.state.motherOfLearning;d.nativeRevision=1;return p;}
const zctx=p=>({...context0(p),molNative:{bound:true,revision:1,body:p.state.simulation.people.player.body},facts:{location:p.state.simulation.people.player.location}});
import {beginContinuation,planContinuation,continuationEligibility,nativeMoment} from '../src/continuation_state.js';
import {loopStartOf,todayFor,monthEnded,CARRIER_CODE} from '../src/mol_zorian_loop.js';
import {loopPlan,loopRule} from '../src/harm_loops.js';
import {carriedKnowledgeView} from '../src/people_knowledge.js';
import {worldDayNews} from '../src/world_calendar.js';
import {knowsRows} from '../src/knowledge_view.js';
import {reconcileForeknowledge} from '../src/mol_zorian_loop.js';
const certainty=e=>Object.fromEntries(knowsRows({knowledge:()=>e.simulation.knowledge.player,facts:()=>({})}).filter(r=>r.key.includes('foreknowledge')).map(r=>[r.key.split('.').pop(),r.certainty]));
// G7/G8/G11/G13 (Zorian stage record): the month-end and death restarts through the existing continuation route.
const DAY=1440,Z1='book.mol.zorian.s1.';
// A native-shaped save around the expansion state; clock and the native date move together (one day = 1440 minutes).
const mk=p=>({'game version':'v0.6.0','current time':{year:999,month:4,day:1,hour:8,minute:0,day_count:1},saved_at:1,
 'current location':p.state.simulation.people.player.location,character:{name:'Zorian',money:0,xp:{total_xp:0},equipment:{},bio:{race:'human'},hp_to_full:0},
 levels:{person:{main_character:{total_xp:0,skill_xp:{}}}},inventories:{person:{main_character:{}}},npcs:{},npc_equipment:{},locations:{},
 availabilities:{location:{},person:{},trader:{},quest:{}},quests:{},options:{},expansion:p.state});
let serial=0;
const cmd=(s,command)=>planContinuation(s,command,{expectedSequence:s.continuation.sequence,token:`z-${++serial}`});
function pass(save,minutes){ // time passes in the seat's world and on the native date together
 const s=structuredClone(save),t=s['current time'],total=t.day*DAY+t.hour*60+t.minute+minutes;
 s.expansion.clock+=minutes;t.day=Math.floor(total/DAY);t.hour=Math.floor(total%DAY/60);t.minute=total%60;
 return s;
}
// The Frontier fixture leaves a Village craftsman controller that this stepping (seat context only) never advances; it is not under test.
const start=()=>{const p=zorian();delete p.state.simulation.controllers['village.craftsman_controller'];return beginContinuation(mk(p),'zorian-journey');};
const facts=s=>s.expansion.actors.player.facts,known=s=>s.expansion.simulation.knowledge.player;

test('the Zorian start may rewind through the scoped restart; the visitor start and other worlds may not',()=>{
 const s=start();assert.equal(loopStartOf(s),'zorian');assert.equal(continuationEligibility(s,{travelOnly:true}),'');
 const v=mk(fixture(false));assert.equal(loopStartOf(v),null);assert.notEqual(continuationEligibility(v,{travelOnly:true}),'');
 assert.equal(loopPlan('book.mol.cyoria',{trigger:'death',lifeEnded:true}),null);
 assert.equal(loopPlan('book.mol.cyoria',{trigger:'date'}),null);
 assert.equal(loopPlan('book.mol.cyoria',{trigger:'date',startId:'zorian'}).command,'restart:initial');
 assert.throws(()=>planContinuation(v,'loop-end:date',{expectedSequence:0,token:'v1'}),/./);
});
test('the run clock is the calendar: day 1 at the start, events by their day, month end only on its night',()=>{
 let s=start();assert.deepEqual(worldDayNews(s.expansion).map(e=>e.id),['calendar:mol.restart_lights']);
 assert.equal(todayFor(s.expansion).day,1);
 s=pass(s,14*DAY+13*60);assert.equal(todayFor(s.expansion).day,15);
 s=pass(s,15*DAY+3*60);assert.equal(todayFor(s.expansion).day,30);assert.equal(monthEnded(s.expansion),false);
 s=pass(s,2*60);assert.equal(monthEnded(s.expansion),true);
});
// Plays the seat's commands on a continuing save: the save's expansion is the live state, the continuation anchor stays what begin made.
const P0=zorian(),wrap=state=>({...P0,state});
const play=(s,steps)=>{let p=wrap(s.expansion);for(const st of steps)p=typeof st==='string'?at(p,st):run(p,st.id);const out=structuredClone(s);out.expansion=p.state;return out;};
// Real stepping for time that passes after a restart (a clock jump would skip the simulation's controllers).
const STEP=60;
function idle(save,minutes){
 const p=wrap(structuredClone(save.expansion));for(let i=0;i<minutes;i+=STEP){p.state.clock+=Math.min(STEP,minutes-i);advanceSimulationBoundary(p,registry,{player:zctx(p)});}
 // The host ticks every resident's controller; this stepping gives the seat's context only, so the others are brought to the clock here.
 for(const c of Object.values(p.state.simulation.controllers))if(c.due<p.state.clock)c.due=p.state.clock+c.interval;
 const out=pass(save,0);out.expansion=p.state;const t=out['current time'],total=t.day*DAY+t.hour*60+t.minute+minutes;
 t.day=Math.floor(total/DAY);t.hour=Math.floor(total%DAY/60);t.minute=total%60;return out;
}
const DAYS_TO_END=29*DAY+17*60+1;
test('G7 month end: the date restart returns the day, keeps the soul-bound memory and resets the world',()=>{
 let s=start();
 s=play(s,['court',{id:Z+'missile_practice'},'academy',{id:Z+'invocations_class'}]);
 assert.equal(reserve({state:s.expansion}).reserve,7);
 s.expansion.actors.player.resources['book.mol.crowns']=40; // money of the run: resets
 assert.throws(()=>cmd(pass(s,5*DAY),'loop-end:date'),/month has not ended/);
 s=pass(s,DAYS_TO_END);
 const before=structuredClone(s),next=cmd(s,'loop-end:date');
 assert.deepEqual(s,before,'planning is pure');
 const e=next.expansion;
 assert.equal(todayFor(e).day,1);assert.equal(next['current time'].day,1);assert.equal(e.motherOfLearning.runs,2);
 assert.deepEqual(worldDayNews(e).map(x=>x.id),['calendar:mol.restart_lights']);
 assert.equal(e.actors.player.resources['book.mol.crowns'],0,'money resets');
 assert.equal(facts(next)['book.mol.loop.s0.invocations_class'],true,'memory of the beat crosses');
 assert.equal(facts(next)['book.mol.invocationStudied'],true,'the skill key crosses');
 assert.equal(facts(next)['book.mol.loop.s0.missile_cast'],true);
 assert.equal(facts(next)['book.mol.studentStatus'],'enrolled');
 assert.ok(known(next)['book.mol.invocation']&&known(next)['book.mol.zorian.missile'],'knowledge crosses');
 assert.equal(next.continuation.deaths.at(-1).trigger,'date');assert.equal(next.continuation.deaths.at(-1).kind,'restart');
 // the body returns to the iteration start: the reserve is full again, the seat is where run 1 began
 assert.equal(reserve({state:e}).reserve,8);assert.equal(e.simulation.people.player.location,L.house);
 // dated events that fell due become day-stamped foreknowledge; day 1 is every run's start and is not foreseen
 assert.deepEqual(Object.keys(known(next)).filter(k=>k.includes('foreknowledge')).sort(),['book.mol.foreknowledge.month_end','book.mol.foreknowledge.school_dance']);
 const view=carriedKnowledgeView(e,todayFor(e));
 assert.deepEqual(view.map(r=>[r.id.split('.').pop(),r.stampDay,r.status]),[['school_dance',15,'reliable'],['month_end',30,'reliable']]);
 assert.equal(view[0].prediction.check,'upcoming');assert.equal(view[0].carrier,'self');
 assert.equal(next.continuation.lives['life-1'].ended,undefined);
 // foreknowledge reads as guessed until this run reaches the date, on the shared view's own mapping
 assert.deepEqual(certainty(e),{school_dance:'guessed',month_end:'guessed'});
 // an older save wrote these 'understood' (known); the next reconcile reads them by the run clock, current-loop facts are untouched
 const old=structuredClone(e);for(const r of Object.values(old.simulation.knowledge.player))if(r.basis?.carried)r.stage='understood';
 assert.equal(certainty(old).school_dance,'known');reconcileForeknowledge(old);assert.deepEqual(certainty(old),{school_dance:'guessed',month_end:'guessed'});
 assert.equal(old.simulation.knowledge.player['book.mol.invocation'].stage,e.simulation.knowledge.player['book.mol.invocation'].stage);
 // confirmed: this run reaches day 15, the dance date falls due and the prediction reads as known; month_end stays guessed
 const later=structuredClone(e);later.clock+=16*DAY;reconcileForeknowledge(later);
 assert.deepEqual(certainty(later),{school_dance:'known',month_end:'guessed'});
 // diverged past the row's reliable days and still unconfirmed: still guessed, with the existing stale note
 later.motherOfLearning.divergence={day:2,cause:'x'};reconcileForeknowledge(later);
 assert.equal(later.simulation.knowledge.player['book.mol.foreknowledge.month_end'].basis.uncertainty,'The world has moved on; check before relying on this.');
 assert.equal(later.simulation.knowledge.player['book.mol.foreknowledge.school_dance'].basis.uncertainty,undefined,'a confirmed one is not stale');
});
// G11: the two replayed beats are lr.mol.main.00203 (Essential Invocations, Monday; next 00204 same Monday) and 00205 (training hall, Tuesday;
// next 00206 same Tuesday at the spell formula classroom). Each next beat states place and day, so the canon pull is place and presence:
// after the beat the seat can still walk to where the next one is and do it.
test('G11 the seat replays two beats in the new run at their places, then reaches the next beat\'s place',()=>{
 let s=start();s=play(s,['academy',{id:Z+'invocations_class'},'court',{id:Z+'missile_practice'}]);
 s=cmd(idle(s,DAYS_TO_END),'loop-end:date');
 const day2=s.expansion.simulation.people.player.location;assert.equal(day2,L.house);
 const p=x=>wrap(x.expansion);
 // beat 00203: Essential Invocations room is the academy desk; the class is open again in the new run (receipts reset) and writes the pinned fact
 assert.equal((q=>{const r=previewMolCommand(q.state,registry,Z+'invocations_class',zctx(q));return r.eligible||r.reasons.join('|');})(at(p(s),'academy')),true);
 s=play(s,['academy',{id:Z+'invocations_class'}]);
 assert.equal(facts(s)['book.mol.loop.s0.invocations_class'],true);
 // beat 00205 at the court, then the pull to 00206: the formula workshop and its placement test
 s=play(s,['court',{id:Z+'missile_practice'}]);assert.equal(reserve({state:s.expansion}).reserve,7);
 s=play(s,['workshop',{id:Z+'placement_test'}]);
 assert.equal(facts(s)['book.mol.loop.s0.placement_test'],true);
 assert.equal(s.expansion.motherOfLearning.divergence,undefined,'a faithful replay does not diverge');
 assert.deepEqual(carriedKnowledgeView(s.expansion,todayFor(s.expansion)).map(r=>r.status),['reliable','reliable']);
});
test('G7 death restart: another trigger, same row; a second ended run does not re-stamp older foreknowledge',()=>{
 let s=pass(start(),20*DAY);
 const dead=cmd(s,'die:harm');assert.ok(dead.continuation.lives['life-1'].ended);
 let next=cmd(dead,'restart:initial');
 assert.equal(todayFor(next.expansion).day,1);assert.equal(next.continuation.deaths.at(-1).trigger,undefined);
 assert.deepEqual(Object.keys(known(next)).filter(k=>k.includes('foreknowledge')),['book.mol.foreknowledge.school_dance']);
 const first=structuredClone(known(next)['book.mol.foreknowledge.school_dance']);
 next=pass(next,31*DAY);next=cmd(next,'loop-end:date');
 assert.deepEqual(known(next)['book.mol.foreknowledge.school_dance'],first);
 assert.ok(known(next)['book.mol.foreknowledge.month_end']);
 assert.equal(next.expansion.motherOfLearning.runs,3);
 assert.throws(()=>cmd(start(),'restart:initial'),/has not ended/);
});
test('G7 the row and the knowledge view agree on carriers and decay days',()=>{
 const row=loopRule('book.mol.cyoria','zorian');
 for(const c of row.carry.filter(x=>typeof x==='object'&&x.carrier))assert.ok(CARRIER_CODE[c.carrier],c.carrier);
 let s=pass(start(),31*DAY);s=cmd(s,'loop-end:date');
 for(const r of carriedKnowledgeView(s.expansion,todayFor(s.expansion)))assert.equal(r.decaysAfterDays,row.staleness.reliableDays);
});
test('G13 off-canon beat: skipping a lecture already known sets the divergence day; foreknowledge fades then goes stale by the row',()=>{
 let s=start();
 const first=at(wrap(s.expansion),'court');
 assert.equal(previewMolCommand(first.state,registry,Z1+'skip_class_drill',zctx(first)).eligible,false,'run 1: the lecture is not known yet');
 s=play(s,['academy',{id:Z+'invocations_class'}]);
 s=cmd(idle(s,DAYS_TO_END),'loop-end:date');
 s=idle(s,2*DAY);assert.equal(todayFor(s.expansion).day,3);
 s=play(s,['court',{id:Z1+'skip_class_drill'}]);
 const e=s.expansion;
 assert.deepEqual(e.motherOfLearning.divergence,{day:3,cause:Z1+'skip_class_drill'});
 assert.equal(facts(s)['book.mol.loop.s1.skipped_invocations'],true);
 assert.equal(facts(s)['book.mol.loop.s0.invocations_class'],true,'the earlier memory is untouched');
 assert.equal(reserve({state:e}).reserve,7,'a different purse: the drill spends the reserve the lecture slot would not have');
 const status=day=>carriedKnowledgeView(e,{day,divergedOnDay:3}).map(r=>r.status);
 assert.deepEqual(status(3),['fading','fading']);assert.deepEqual(status(5),['fading','fading']);assert.deepEqual(status(6),['stale','stale']);
 // the divergence is set once; a second off-canon choice later in the run does not move it
 const again=structuredClone(s);again.expansion.motherOfLearning.divergence={day:3,cause:'x'};
 // and the next restart clears it: every run starts on the timeline the seat remembers
 const next=cmd(idle(s,28*DAY),'loop-end:date');assert.equal(next.expansion.motherOfLearning.divergence,undefined);
 assert.deepEqual(carriedKnowledgeView(next.expansion,todayFor(next.expansion)).map(r=>r.status),['reliable','reliable']);
});

// ---- the real-game anchor: every game already holds a continuation whose first life starts in the Village ----
import {createZorianLoopHost,ZORIAN_LIFE_LABEL} from '../src/mol_zorian_loop_host.js';
import {WORLD_DAY_EVENTS} from '../src/world_calendar_content.js';
test('anchor: a Village-anchored game branches at the Zorian start, and the date restart returns to day 1 in Cyoria, not the Village',()=>{
 const v=village();v.state.simulation.controllers={};
 let s=beginContinuation(mk(v),'real-game');
 assert.equal(s.continuation.lives['life-1'].initial['current location'],'Village');
 const begun=begin(v);const d=begun.state.motherOfLearning;d.nativeRevision=1;
 s={...s,expansion:begun.state,'current location':begun.state.simulation.people.player.location};
 assert.equal(loopStartOf(s),'zorian');assert.equal(loopStartOf(s.continuation.lives['life-1'].initial),null);
 // without the branch a restart would go back to the Village; the host's first step is the branch
 s=cmd(s,'branch:'+encodeURIComponent(ZORIAN_LIFE_LABEL));
 assert.equal(s.continuation.active,'life-2');assert.equal(loopStartOf(s.continuation.lives['life-2'].initial),'zorian');
 s=pass(s,DAYS_TO_END);
 const next=cmd(s,'loop-end:date');
 assert.equal(next.expansion.actors.player.worldId,'book.mol.cyoria');assert.equal(next.expansion.simulation.people.player.location,L.house);
 assert.equal(next.continuation.active,'life-2');assert.equal(todayFor(next.expansion).day,1);
 // the Village life stays paused, and the visitor start never branches
 assert.ok(next.continuation.lives['life-1'].paused);
});
test('host tick is state-driven: branch, then die and restart across a reload, then the month end; a non-Zorian game does nothing',()=>{
 const calls=[];let s=start(),c=structuredClone(s.continuation),alive=true,month=false,reloads=0;
 const village={...structuredClone(s),expansion:structuredClone(s.expansion)};
 const host=()=>createZorianLoopHost({state:()=>s.expansion,continuation:()=>c,command:async a=>{calls.push(a);},alive:()=>alive,writable:()=>true,busy:()=>false});
 let h=host();
 assert.equal(h.next(),null,'anchored at the start, alive, month running: nothing to do');
 c.lives['life-1'].initial['current location']='Village';c.lives['life-1'].initial.expansion.actors.player.worldId='base.frontier';
 assert.equal(h.next(),'branch:'+encodeURIComponent(ZORIAN_LIFE_LABEL));
 c.lives['life-1'].initial=structuredClone(s.continuation.lives['life-1'].initial);
 alive=false;assert.equal(h.next(),'die:harm');
 c.lives['life-1'].ended={cause:'harm',outcome:'final',at:1};reloads++;h=host();
 assert.equal(h.next(),'restart:initial','after a reload between die and restart the next tick still restarts');
 delete c.lives['life-1'].ended;alive=true;assert.equal(h.next(),null);
 s=pass(s,DAYS_TO_END);assert.equal(h.next(),'loop-end:date');
 const other=createZorianLoopHost({state:()=>mk(fixture(false)).expansion,continuation:()=>c,command:async()=>{},alive:()=>true,writable:()=>true,busy:()=>false});
 assert.equal(other.next(),null);
 const dead=createZorianLoopHost({state:()=>s.expansion,continuation:()=>c,command:async()=>{},alive:()=>false,writable:()=>false,busy:()=>false});
 dead.tick();assert.equal(calls.length,0,'a read-only tab never writes');
 h.tick();assert.deepEqual(calls,['loop-end:date']);
});
test('the date end rests on the calendar month_end row: the row must exist (fixture scaffolding until the reader pass)',()=>{
 assert.ok(WORLD_DAY_EVENTS['book.mol.cyoria'].events.some(e=>e.id==='mol.month_end'&&e.day===30));
});
