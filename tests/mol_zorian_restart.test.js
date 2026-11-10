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
import {loopStartOf,todayFor,monthEnded,monthEndAt,CARRIER_CODE} from '../src/mol_zorian_loop.js';
import {loopPlan,loopRule} from '../src/harm_loops.js';
import {scopedRestart} from '../src/harm_restart_scope.js';
import {carriedKnowledgeView} from '../src/people_knowledge.js';
import {worldDayNews} from '../src/world_calendar.js';
import {knowsRows} from '../src/knowledge_view.js';
import {reconcileForeknowledge} from '../src/mol_zorian_loop.js';
import {observerView} from '../src/observer_view.js';
import {molSchoolPassageClockRequest,molSensingAppointmentAt} from '../src/mol_zorian_sensing.js';
import {molDivinationAppointmentAt} from '../src/mol_zorian_divination.js';
import {molScheduledMonthEnd,MOL_STUDY_IDS} from '../src/mol_zorian_study_months.js';
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
 // the read lens: an old save and an idle month read right through observerView before any MoL command, and the stored rows are not written
 const seen=s=>Object.fromEntries(knowsRows(observerView(s)).filter(r=>r.key.includes('foreknowledge')).map(r=>[r.key.split('.').pop(),r.certainty]));
 const old2=structuredClone(e);for(const r of Object.values(old2.simulation.knowledge.player))if(r.basis?.carried)r.stage='understood';
 assert.deepEqual(seen(old2),{school_dance:'guessed',month_end:'guessed'});
 assert.equal(old2.simulation.knowledge.player['book.mol.foreknowledge.school_dance'].stage,'understood','the lens does not write state');
 const idle=structuredClone(e);idle.clock+=16*DAY;assert.deepEqual(seen(idle),{school_dance:'known',month_end:'guessed'});
 assert.equal(observerView(e).knowledge(),e.simulation.knowledge.player,'rows that already agree come back as the same object');
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
test('the Zorian host resolves competing endings on the calendar and harm clock, including an exact tie',()=>{
 const s=pass(start(),DAYS_TO_END+10), state=s.expansion;
 const host=createZorianLoopHost({state:()=>state,continuation:()=>s.continuation,alive:()=>false});
 const at=monthEndAt(state);
 assert.equal(at,state.clock-11,'use the event time even when the host checks later');
 for(const [endedAt,action] of [[at-1,'die:harm'],[at,'loop-end:date'],[at+1,'loop-end:date']]){
  state.chronicle={life:{endedAt}};
  assert.equal(host.next(),action);
 }
 delete state.chronicle;
 assert.equal(host.next(),'loop-end:date','an un-timestamped death is observed after the date');
 state.clock=at;
 assert.equal(host.next(),'loop-end:date','an un-timestamped death observed at the boundary ties');
 state.clock=at-1;
 assert.equal(host.next(),'die:harm','death is the only ending before the boundary');
});

test('Xvim’s Friday sensing reserves local time and settles a single evidenced response',()=>{
 const wait='book.mol.zorian.s2.wait_for_xvim',open='book.mol.zorian.s2.start_sensing';
 const report='book.mol.zorian.s2.report_uncertainty',guess='book.mol.zorian.s2.guess_left';
 const critique='book.mol.zorian.s2.xvim_critique',drill=Z1+'skip_class_drill';
 let p=zorian();
 p=at(p,'court');
 const preview=(p,id)=>previewMolCommand(p.state,registry,id,zctx(p));
 assert.equal(preview(p,open).visible,false,'the stage follows the earned drill');
 assert.equal(preview(fixture(false),open).visible,false,'a guest is not Xvim’s student');
 p.state.actors.player.facts['book.mol.invocationStudied']=true;
 p=run(p,drill);
 const repeated=run(p,drill);
 assert.equal(repeated.state.actors.player.completed[drill],2);
 assert.equal(preview(repeated,open).visible,true,'more practice retains the route');
 assert.equal(preview(p,open).eligible,false);
 assert.match(preview(p,open).reasons.join(' '),/Friday/);
 const due=molSensingAppointmentAt(p.state);
 assert.equal(todayFor({...p.state,clock:due}).day,5);
 assert.equal(todayFor({...p.state,clock:due}).hour,15);
 assert.equal(preview(p,wait).duration,due-p.state.clock);
 assert.equal(molSchoolPassageClockRequest(p.state),null);
 p=act(p,wait);
 assert.equal(p.commitment.due,due);
 assert.equal(molSchoolPassageClockRequest(p.state),120);
 assert.equal(preview(p,'book.mol.move.house').eligible,false);
 const invalid=structuredClone(p.state);
 invalid.simulation.jobs[0].due++;
 assert.throws(()=>validateMolCampaignState(invalid),/Friday appointment/);
 const stopped=commitMolCommand(p.state,registry,{type:'book_mol',id:'book.mol.cancel',jobId:p.commitment.id},zctx(p));
 assert.equal(stopped.state.clock,p.state.clock);
 assert.equal(molSchoolPassageClockRequest(stopped.state),null);
 assert.equal(preview(stopped,wait).eligible,true);
 // A unit-test clock fixture skips the idle stretch and keeps controller offsets.
 for (const controller of Object.values(p.state.simulation.controllers)) controller.due+=due-1-p.state.clock;
 p.state.clock=due-1;
 assert.equal(molSchoolPassageClockRequest(p.state),1);
 finish(p);
 assert.equal(p.state.clock,due);
 assert.equal(preview(p,open).eligible,true,JSON.stringify(preview(p,open)));
 const teacher=p.state.actors[I.xvim];
 const unavailable=structuredClone(p);
 unavailable.state.simulation.people[I.xvim].location=L.academy;
 assert.equal(preview(unavailable,open).eligible,false,'Xvim must be present');
 assert.equal(preview({...p,state:{...p.state,clock:due+91}},open).eligible,false,'the whole practice must fit');
 const attention=teacher.resources['book.mol.attention'];
 p=run(p,open);
 assert.equal(p.state.actors[I.xvim].resources['book.mol.attention'],attention-1);
 assert.equal(preview(p,report).eligible,true);
 assert.equal(preview(p,guess).eligible,true);
 assert.equal(preview({...p,state:{...p.state,clock:due+106}},report).eligible,false);
 const interrupted=act(p,report);
 interrupted.state.simulation.people[I.xvim].location=L.academy;
 finish(interrupted);
 assert.equal(known({expansion:interrupted.state})[critique],undefined,'loss of Xvim stops critique');
 for (const id of [report,guess]) {
  const next=run(p,id);
  const memory=known({expansion:next.state})[critique];
  assert.equal(memory.basis.attributedTo,I.xvim);
  assert.match(memory.value,id===report?/where you lost it/:/sails overhead/);
  assert.equal(preview(next,open).visible,false);
  assert.equal(preview(next,report).visible,false);
  assert.equal(preview(next,guess).visible,false);
  assert.equal(reserve(next).reserve,7);
  assert.equal(next.state.actors.player.completed[drill],1);
  assert.equal(validateMolCampaignState(next.state),true);
 }
});

test('Haslush’s Monday lesson separates an appointment, diagnostic, instruction, and applied result',()=>{
 const id=name=>'book.mol.zorian.s2.'+name;
 const intro=id('meet_haslush'),notice=id('tell_imaya_about_lesson'),wait=id('wait_for_haslush');
 const entry=id('check_tavern'),trace=id('trace_haslush'),ask=id('ask_after_haslush');
 const lesson=id('study_object_analysis'),practice=id('read_practice_envelope');
 const method=id('object_analysis_method'),result=id('object_analysis_result'),tavern='book.mol.move.divinationTavern';
 const compass=JSON.stringify({id:'Cyorian divination compass'});
 const preview=(p,id)=>previewMolCommand(p.state,registry,id,zctx(p));
 const notes=p=>p.state.simulation.knowledge.player;
 let p=at(zorian(),'library');
 assert.equal(preview(p,intro).visible,false);
 assert.equal(preview(p,tavern).visible,false);
 // Separate browser evidence plays this exact predecessor through Xvim.
 p.state.actors.player.completed[id('report_uncertainty')]=1;
 p=run(p,intro);
 assert.equal(notes(p)[method],undefined);
 assert.equal(p.gameplay.player.inventory[compass],1);
 p=at(p,'house');
 p=run(p,notice);
 const early=at(p,'divinationTavern');
 assert.equal(preview(early,entry).eligible,false);
 const before=reserve(p).reserve;
 p=act(p,wait);
 const atTime=molDivinationAppointmentAt(p.state);
 assert.equal(p.commitment.due,atTime);
 assert.equal(todayFor({...p.state,clock:atTime}).day,8);
 assert.equal(todayFor({...p.state,clock:atTime}).hour,15);
 assert.equal(molSchoolPassageClockRequest(p.state),120);
 const invalid=structuredClone(p.state);
 invalid.simulation.jobs[0].due++;
 assert.throws(()=>validateMolCampaignState(invalid),/Monday lesson/);
 for(const controller of Object.values(p.state.simulation.controllers))controller.due+=atTime-1-p.state.clock;
 p.state.clock=atTime-1;
 assert.equal(molSchoolPassageClockRequest(p.state),1);
 finish(p);
 p=at(p,'divinationTavern');
 p=run(p,entry);
 const withoutCompass=structuredClone(p);
 delete withoutCompass.gameplay.player.inventory[compass];
 assert.equal(preview(withoutCompass,trace).eligible,false);
 const social=run(withoutCompass,ask);
 assert.equal(reserve(social).reserve,before);
 assert.equal(preview(social,lesson).eligible,true);
 assert.equal(preview(social,trace).visible,false);
 p=run(p,trace);
 assert.equal(reserve(p).reserve,before-1);
 assert.equal(preview(p,practice).visible,false);
 assert.equal(preview({...p,state:{...p.state,clock:atTime+91}},lesson).eligible,false);
 p=run(p,lesson);
 assert.equal(notes(p)[method].stage,'understood');
 assert.equal(notes(p)[result],undefined);
 const interrupted=act(p,practice);
 interrupted.state.simulation.people.player.location=L.house;
 finish(interrupted);
 assert.equal(notes(interrupted)[result],undefined);
 assert.equal(reserve(interrupted).reserve,before-1,'loss of the practice table refunds the uncast spell');
 const attempted=run(p,practice);
 assert.equal(reserve(attempted).reserve,before-2);
 assert.match(notes(attempted)[result].value,/ward laid across the seal/);
 assert.equal(preview(attempted,practice).visible,false);
 assert.equal(validateMolCampaignState(attempted.state),true);
});

test('the finished object lesson leads to a private tip and consent-based inquiry at home',()=>{
 const id=name=>'book.mol.zorian.s2.'+name;
 const practice=id('read_practice_envelope'), tip=id('warn_haslush_privately'), keep=id('keep_festival_warning_private');
 const shaping=id('steady_the_snail'), tutor=id('tutor_kael'), paper=id('read_taivens_paper');
 const disclose=id('confide_in_kael_and_kirielle'), wait=id('wait_for_kael_research'), theory=id('hear_kaels_theory');
 const accept=id('accept_kaels_examination'), defer=id('defer_kaels_examination'), result=id('kael_examination_result');
 const preview=(p,key)=>previewMolCommand(p.state,registry,key,zctx(p));
 let p=zorian();
 p.state.actors.player.completed[id('tell_imaya_about_lesson')]=1;
 p=at(p,'divinationTavern');
 assert.equal(preview(p,tip).visible,false);
 p.state.actors.player.completed[practice]=1;
 const lessonAt=molDivinationAppointmentAt(p.state);
 for(const controller of Object.values(p.state.simulation.controllers))controller.due+=lessonAt+40-p.state.clock;
 p.state.clock=lessonAt+40;
 const closed=run(structuredClone(p),keep);
 assert.equal(preview(closed,tip).visible,false);
 assert.equal(closed.state.simulation.knowledge.player[id('haslush_festival_tip')],undefined);
 p=run(p,tip);
 assert.equal(preview(p,keep).visible,false);
 assert.match(p.state.simulation.knowledge.player[id('haslush_festival_tip')].value,/quiet inquiries/);
 p=at(p,'house');
 const anchor=mk(p);
 const before=reserve(p).reserve;
 const interruptedShaping=act(structuredClone(p),shaping);
 interruptedShaping.state.simulation.people.player.location=L.library;
 finish(interruptedShaping);
 assert.equal(reserve(interruptedShaping).reserve,before);
 assert.equal(interruptedShaping.state.simulation.knowledge.player[id('snail_shaping_practice')],undefined);
 p=run(p,shaping);
 assert.equal(reserve(p).reserve,before-1);
 p=act(p,tutor);
 assert.equal(validateMolCampaignState(p.state),true,'accepted tutoring reserves both people in a valid save');
 p=run(finish(p),paper);
 assert.equal(preview(p,theory).visible,false);
 p=run(p,disclose);
 assert.equal(p.state.actors[I.kael].facts[id('heard_zorian_loop')],true);
 assert.equal(p.state.simulation.knowledge.player[id('heard_zorian_loop')],undefined);
 assert.equal(preview(p,theory).visible,false);
 p=act(p,wait);
 const due=p.commitment.due;
 assert.equal(due,p.state.clock+3*DAY);
 assert.equal(molSchoolPassageClockRequest(p.state),120);
 const invalid=structuredClone(p.state);
 invalid.simulation.jobs[0].due++;
 assert.throws(()=>validateMolCampaignState(invalid),/Kael research time/);
 for(const controller of Object.values(p.state.simulation.controllers))controller.due+=due-1-p.state.clock;
 p.state.clock=due-1;
 finish(p);
 assert.equal(p.state.actors.player.completed[wait],1);
 p=run(p,theory);
 const deferred=run(structuredClone(p),defer);
 assert.equal(preview(deferred,accept).visible,false);
 assert.equal(deferred.state.simulation.knowledge.player[result],undefined);
 const interrupted=act(structuredClone(p),accept);
 interrupted.state.simulation.people[I.kael].location=L.library;
 finish(interrupted);
 assert.equal(interrupted.state.simulation.knowledge.player[result],undefined);
 p=run(p,accept);
 assert.match(p.state.simulation.knowledge.player[result].value,/kind of soul bond he knows how to detect/);
 assert.equal(preview(p,defer).visible,false);
 assert.equal(validateMolCampaignState(p.state),true);
 const rewound=scopedRestart(mk(p),anchor,I.world,`${I.world}#zorian`).expansion;
 assert.equal(rewound.actors[I.kael].facts[id('heard_zorian_loop')],undefined);
 assert.deepEqual(rewound.simulation.knowledge.player[result],p.state.simulation.knowledge.player[result]);
});

test('the next tunnel meeting uses a prepared exit and an explicit packet choice',()=>{
 const id=name=>'book.mol.zorian.s2.'+name;
 const cube=JSON.stringify({id:'Cyorian prepared barrier cubes'});
 const preview=(p,key)=>previewMolCommand(p.state,registry,id(key),zctx(p));
 let p=zorian();
 p.state.actors.player.completed[id('accept_kaels_examination')]=1;
 assert.equal(preview(p,'read_about_aranea').visible,false);
 p=run(p,id('answer_unseen_visitor'));
 p=at(p,'library');
 p=run(p,id('read_about_aranea'));
 p=at(p,'house');
 p=run(p,id('ask_imaya_about_crowds'));
 const before=reserve(p).reserve;
 p=run(p,id('make_barrier_cubes'));
 assert.equal(p.gameplay.player.inventory[cube],1);
 assert.equal(reserve(p).reserve,before-1);
 p=run(p,id('ask_kael_to_go_ahead'));
 assert.equal(p.state.simulation.people[I.kael].location,L.sewer);
 p=at(p,'sewer');
 const missing=structuredClone(p);
 delete missing.gameplay.player.inventory[cube];
 assert.equal(preview(missing,'hear_matriarchs_terms').eligible,false);
 p=act(p,id('hear_matriarchs_terms'));
 assert.equal(validateMolCampaignState(p.state),true);
 p=finish(p);
 assert.equal(p.gameplay.player.inventory[cube],1);
 p=run(p,id('trigger_barrier_cubes'));
 assert.equal(reserve(p).reserve,before-2);
 assert.equal(p.gameplay.player.inventory[cube],undefined);
 const declined=run(structuredClone(p),id('decline_memory_packet'));
 assert.equal(declined.state.simulation.people[I.kael].location,L.house);
 assert.equal(declined.state.simulation.knowledge.player[id('aranea_memory_packet')],undefined);
 assert.equal(preview(declined,'accept_memory_packet').visible,false);
 const anchor=mk(zorian());
 p=run(p,id('accept_memory_packet'));
 assert.equal(p.state.simulation.people[I.kael].location,L.house);
 assert.match(p.state.simulation.knowledge.player[id('aranea_memory_packet')].value,/cannot read it yourself/);
 assert.equal(preview(p,'decline_memory_packet').visible,false);
 const rewound=scopedRestart(mk(p),anchor,I.world,`${I.world}#zorian`).expansion;
 assert.deepEqual(rewound.simulation.knowledge.player[id('aranea_memory_packet')],
  p.state.simulation.knowledge.player[id('aranea_memory_packet')]);
 assert.equal(rewound.actors.player.completed[id('accept_memory_packet')],undefined);
 assert.equal(validateMolCampaignState(p.state),true);
});

test('the six study months settle on separate resets before the coached cloud drill',()=>{
 const id=name=>'book.mol.zorian.s2.'+name;
 const preview=(p,key)=>previewMolCommand(p.state,registry,key,zctx(p));
 const researchNote=(p,key)=>p.state.simulation.knowledge.player[key];
 const anchor=mk(zorian());
 const atDue=(p)=>{
  const delta=p.commitment.due-1-p.state.clock;
  assert(delta>=0);
  for(const controller of Object.values(p.state.simulation.controllers))controller.due+=delta;
  p.state.clock+=delta;
  return finish(p);
 };
 const rewind=p=>{
  const save=scopedRestart(mk(p),anchor,I.world,`${I.world}#zorian`);
  save.expansion.motherOfLearning.runStartedAt=save.expansion.clock;
  return {...zorian(),state:save.expansion};
 };
 let p=zorian();
 p.state.actors.player.completed[id('accept_memory_packet')]=1;
 p=run(p,id('plan_festival_departure'));
 p=at(p,'station');
 const train=id('take_festival_train');
 p=act(p,train);
 assert.equal(p.commitment.due,molScheduledMonthEnd(p.state));
 assert.equal(molSchoolPassageClockRequest(p.state),DAY);
 p=atDue(p);
 assert(researchNote(p,id('festival_train_departure')));
 p=rewind(p);
 const missed=at(structuredClone(p),'divinationTavern');
 const elapsed=18*60; // The new run starts at 6 a.m.; the first local day ends at midnight.
 for(const controller of Object.values(missed.state.simulation.controllers))controller.due+=elapsed;
 missed.state.clock+=elapsed;
 assert.equal(preview(missed,MOL_STUDY_IDS[0]).eligible,false);
 const idleMonth=id('let_missed_study_month_end');
 const afterIdle=atDue(act(at(missed,'house'),idleMonth));
 assert.equal(researchNote(afterIdle,MOL_STUDY_IDS[0]),undefined);
 assert.equal(preview(rewind(afterIdle),idleMonth).visible,false);
 for(const [i,lesson] of MOL_STUDY_IDS.entries()){
  p=at(p,i%2?'workshop':'divinationTavern');
  const next=MOL_STUDY_IDS[i+1];
  if(next)assert.equal(preview(p,next).eligible,false);
  p=act(p,lesson);
  const stopped=commitMolCommand(p.state,registry,{type:'book_mol',id:'book.mol.cancel',jobId:p.commitment.id},zctx(p));
  assert.equal(stopped.state.simulation.knowledge.player[lesson],undefined);
  assert.equal(validateMolCampaignState(p.state),true);
  p=atDue(p);
  assert(researchNote(p,lesson));
  assert.equal(preview(p,id('ask_ilsa_for_combat_instruction')).visible,false);
  p=rewind(p);
 }
 p=at(p,'academy');
 p=run(p,id('ask_ilsa_for_combat_instruction'));
 p=at(p,'sewer');
 p=run(p,id('meet_taiven_for_tunnels'));
 assert.equal(preview(p,id('ask_the_matriarch_to_check_the_packet')).eligible,false);
 p=run(p,id('ask_the_matriarch_to_check_the_packet_without_it'));
 p=run(p,id('agree_to_practice_with_taiven'));
 assert.equal(p.state.simulation.people[I.taiven].location,L.court);
 p=at(p,'court');
 p=run(p,id('trade_practice_casts_with_taiven'));
 p=run(p,id('ask_taiven_how_she_located_the_cast'));
 assert.match(researchNote(p,id('taiven_cloud_method')).value,/much smaller cloud/);
 p=run(p,id('shape_a_small_mana_cloud'));
 const drill=id('track_marble_by_touch');
 assert.equal(preview(p,drill).eligible,false);
 p=atDue(act(p,id('wait_for_xvim_cloud_drill')));
 const before=reserve(p).reserve;
 const interrupted=act(structuredClone(p),drill);
 interrupted.state.simulation.people[I.xvim].location=L.library;
 finish(interrupted);
 assert.equal(reserve(interrupted).reserve,before);
 assert.equal(researchNote(interrupted,id('cloud_drill_result')),undefined);
 p=run(p,drill);
 assert.equal(reserve(p).reserve,before-1);
 assert.match(researchNote(p,id('cloud_drill_result')).value,/cannot rank them by charge yet/);
 assert.equal(validateMolCampaignState(p.state),true);
});

test('Arc 1 carries the forecast, narrow magic and paid equipment through separate run boundaries',()=>{
 const id=name=>'book.mol.zorian.arc1.'+name;
 const memo=(p,name)=>p.state.simulation.knowledge.player[id(name)];
 const preview=(p,name)=>previewMolCommand(p.state,registry,id(name),zctx(p));
 const go=(p,name)=>at(p,name);
 const actArc=(p,name)=>act(p,id(name));
 const runArc=(p,name)=>run(p,id(name));
 const reachDue=p=>{
  const jump=p.commitment.due-1-p.state.clock;
  assert(jump>=0);
  for(const controller of Object.values(p.state.simulation.controllers))controller.due+=jump;
  p.state.clock+=jump;
  return finish(p);
 };
 const anchor=mk(zorian());
 const continuation=beginContinuation(anchor,'arc-one-reset-fixture').continuation;
 const loop=state=>createZorianLoopHost({state:()=>state,continuation:()=>continuation,alive:()=>true});
 const rewind=p=>{
  const save=scopedRestart(mk(p),anchor,I.world,`${I.world}#zorian`);
  save.expansion.motherOfLearning.runStartedAt=save.expansion.clock;
  return {...zorian(),state:save.expansion};
 };
 const basis={kind:'recollection',attributedTo:'player',situationId:'book.mol.visitor_branch'};
 const placeNote=(p,key,value)=>p.state.simulation.knowledge.player[key]={
  stage:'understood',value,at:p.state.clock,cause:'fixture.arc1',basis
 };
 const itemId=name=>JSON.stringify({id:name});
 let p=zorian();
 const study='book.mol.zorian.s2.';
 p.state.actors.player.completed[study+'track_marble_by_touch']=1;
 placeNote(p,study+'cloud_drill_result','Tracked a marble through a cloud.');
 placeNote(p,study+'object_analysis_method','Haslush taught you to ask one narrow question.');
 assert.equal(preview(p,'trade_forecasts').visible,false);
 p=go(p,'sewer');
 assert.equal(preview(p,'trade_forecasts').eligible,false);
 p=reachDue(actArc(p,'return_to_scout'));
 p=runArc(p,'trade_forecasts');
 p=runArc(go(p,'academy'),'consult_temple');
 p=runArc(go(p,'library'),'compare_forecasters');
 p=reachDue(actArc(go(p,'sewer'),'wait_to_report'));
 p=runArc(p,'report_and_ask_about_training');
 p=reachDue(actArc(p,'wait_for_mind_lesson'));
 p=runArc(p,'practice_inward_sense');
 p=runArc(p,'discuss_firing_positions');
 p=reachDue(actArc(go(p,'house'),'wait_for_festival_party'));
 p=runArc(go(p,'mansion'),'watch_fireworks');
 p=runArc(p,'inscribe_corridor_runes');
 p=runArc(p,'cross_mansion_grounds');
 p=runArc(p,'carry_tinami_toward_zach');
 assert.equal(p.state.simulation.people.player.life,'dead');
 assert.equal(loop(p.state).next(),'die:harm');
 assert(memo(p,'garden_fall'));
 p=rewind(p);
 assert.equal(p.state.simulation.people.player.life,'alive');
 p=runArc(p,'make_missile_rod');
 p=runArc(go(p,'sewer'),'follow_a_mind_below');
 p=runArc(go(p,'court'),'drill_missiles_with_taiven');
 p=runArc(go(p,'sewer'),'receive_pocket_watch');
 const withoutWatch=structuredClone(p);
 delete withoutWatch.gameplay.player.inventory[itemId('Cyorian retrieved watch')];
 assert.equal(preview(withoutWatch,'identify_watch_purpose').eligible,false);
 p=runArc(p,'identify_watch_purpose');
 assert.match(memo(p,'ward_reader_known').value,/ward scanner/);
 p=runArc(p,'feel_watch_casing');
 p=runArc(go(p,'station'),'return_watch_to_client');
 assert.equal(p.gameplay.player.inventory[itemId('Cyorian retrieved watch')],undefined);
 p=runArc(go(p,'sewer'),'bring_back_ward_reader_news');
 assert(memo(p,'ward_reader_report'));
 p=runArc(go(p,'academy'),'earn_ilsa_apprenticeship');
 for(let n=1;n<=5;n++){
  if(n>1)p=go(p,'academy');
  if(n<5)assert.equal(preview(p,'apprentice_month_'+(n+1)).eligible,false);
  p=actArc(p,'apprentice_month_'+n);
  assert.equal(validateMolCampaignState(p.state),true);
  p=reachDue(p);
  assert(memo(p,'apprentice_month_'+n));
  p=rewind(p);
 }
 p=runArc(p,'make_stone_relays');
 p=runArc(go(p,'sewer'),'leave_relays_with_the_web');
 assert.equal(p.gameplay.player.inventory[itemId('Cyorian stone relay')],1);
 p=runArc(go(p,'house'),'ask_kael_in_confidence');
 p=runArc(go(p,'sewer'),'prepare_capture_trap');
 p=runArc(go(p,'house'),'prepare_silver_disc');
 p=reachDue(actArc(p,'wait_for_second_festival'));
 p=runArc(go(p,'festivalHall'),'stop_the_attack_on_akoja');
 p=runArc(p,'offer_the_silver_disc');
 assert.equal(p.gameplay.player.inventory[itemId('Cyorian silver disc')],undefined);
 p=runArc(p,'watch_the_relay');
 p=runArc(go(p,'sewer'),'recover_fragmented_route');
 assert(memo(p,'fragmented_tunnel_map'));
 assert(memo(p,'broken_settlement_message'));
 p=reachDue(actArc(go(p,'house'),'let_the_month_reset'));
 p=rewind(p);
 assert.equal(p.gameplay.player.inventory[itemId('Cyorian stone relay')],undefined);
 assert(memo(p,'fragmented_tunnel_map'));
 p=runArc(p,'jump_to_cyoria_beacon');
 assert.equal(p.state.simulation.people.player.location,L.station);
 assert.equal(reserve(p).reserve,6);
 p=runArc(p,'buy_beacon_supplies');
 assert.equal(p.state.actors.player.resources['book.mol.shopTab'],1);
 assert.equal(p.gameplay.player.inventory[itemId('Cyorian revolver cartridge')],6);
 p=runArc(p,'prepare_pocket_charges');
 p=runArc(go(p,'sewer'),'search_the_silent_settlement');
 p=runArc(p,'buy_time_with_concealment');
 p=runArc(p,'break_the_mind_link');
 p=runArc(p,'fire_and_pull_free');
 assert.equal(p.gameplay.player.inventory[itemId('Cyorian revolver cartridge')],undefined);
 p=runArc(p,'take_the_shaft_from_the_map');
 p=runArc(p,'detonate_before_impact');
 assert.equal(p.gameplay.player.inventory[itemId('Cyorian pocket charges')],undefined);
 assert.equal(p.state.simulation.people.player.life,'dead');
 assert(memo(p,'arc_one_finished'));
 assert.equal(loop(p.state).next(),null,'the final scene keeps its terminal save at the printed boundary');
 assert.equal(validateMolCampaignState(p.state),true);
});
