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
const DAY=1440,Z1='book.mol.zorian.s1.';
// A native-shaped save around the expansion state; clock and the native date move together (one day = 1440 minutes).
const mk=p=>({'game version':'v0.6.0','current time':{year:999,month:4,day:1,hour:8,minute:0,day_count:1},saved_at:1,
 'current location':p.state.simulation.people.player.location,character:{name:'Zorian',money:0,xp:{total_xp:0},equipment:{},bio:{race:'human'},hp_to_full:0},
 levels:{person:{main_character:{total_xp:0,skill_xp:{}}}},inventories:{person:{main_character:{}}},npcs:{},npc_equipment:{},locations:{},
 availabilities:{location:{},person:{},trader:{},quest:{}},quests:{},options:{},expansion:p.state});
let serial=0;
const cmd=(s,command)=>planContinuation(s,command,{expectedSequence:s.continuation.sequence,token:`z-${++serial}`});
// Zorian's spell research (KNW13, KNW19, STY33-STY34, WKR13): sessions are pack commands that spend time, stamina and casts and write
// knowledge entries; progress is read from those entries, so it crosses a month restart while the world resets. The Haslush lesson is
// injected as an entry (named fixture: the lesson itself is covered by mol_zorian_restart.test.js).
import {MOL_KEYS} from '../src/book_world_mol_ids.js';
import {molResearchFacts,molResearchView,molResearchLine,molResearchRoute,MOL_RESEARCH} from '../src/mol_zorian_research.js';
const R=MOL_RESEARCH.commands,study='book.mol.zorian.s2.';
const basis={kind:'recollection',attributedTo:'player',situationId:'book.mol.visitor_branch'};
const taught=()=>{const p=zorian();p.state.simulation.knowledge.player[study+'object_analysis_method']={stage:'understood',value:'Haslush taught you to ask one narrow question.',at:p.state.clock,cause:'fixture',basis};return p;};
const vis=(p,id)=>previewMolCommand(p.state,registry,id,zctx(p));
const shown=p=>molPresentation(p.state,registry,zctx(p)).sections.flatMap(s=>s.actions.map(a=>a.id)).filter(id=>id.includes('research')||id.includes('refined'));
test('nothing shows before the method is known; then the shelf, three trials and the write-up come in order',()=>{
 let p=zorian();assert.deepEqual(molResearchFacts(p.state)['mol.research.open'],false);assert.equal(molResearchView(p.state).road.nextMissing!==undefined,true);
 assert.deepEqual(shown(p),[]);
 p=taught();assert.equal(molResearchFacts(p.state)['mol.research.showShelf'],true);
 assert.equal(vis(p,R.t1).visible,false,'a trial waits for the shelf');
 assert.match(molResearchLine(p.state),/still open/);assert.equal(molResearchRoute(p.state).id,'book.mol.move.library');
 p=at(p,'library');assert.equal(vis(p,R.shelf).eligible,true);
 p=run(p,R.shelf);assert.equal(p.state.simulation.knowledge.player['book.mol.zorian.research.ward.shelf'].stage,'interpreted');
 assert.equal(molResearchRoute(p.state).id,'book.mol.move.house');
 p=at(p,'house');const before=reserve(p).reserve;
 for(const [id,key] of [[R.t1,'trial_1'],[R.t2,'trial_2'],[R.t3,'trial_3']]){
  assert.equal(vis(p,R.refine).visible,false,'no write-up before the trials');
  p=run(p,id);assert.ok(p.state.simulation.knowledge.player['book.mol.zorian.research.ward.'+key]);
 }
 assert.equal(reserve(p).reserve,before-3,'each trial spent a real cast');
 assert.match(molResearchLine(p.state),/write-up/);
 const road=molResearchView(p.state);assert.equal(road.trials,3);assert.equal(road.solvable,true);
 p=run(p,R.refine);assert.equal(p.state.simulation.knowledge.player['book.mol.zorian.research.ward.refined'].stage,'understood');
 assert.equal(molResearchFacts(p.state)['mol.research.refined'],true);assert.equal(vis(p,R.shelf).visible,false);
 assert.match(molResearchLine(p.state),/carries across every restart/);
});
test('a trial needs the house: away from it the session cannot run',()=>{
 let p=at(run(at(taught(),'library'),R.shelf),'house');assert.equal(vis(p,R.t1).eligible,true);
 const away=at(p,'library');assert.equal(vis(away,R.t1).eligible,false);
});
test('the work crosses a month restart; the world, reserve and receipts reset (WKR13, KNW19)',()=>{
 const anchor=mk(zorian());let p=taught();
 p=run(at(p,'library'),R.shelf);p=at(p,'house');p=run(p,R.t1);p=run(p,R.t2);
 const save=scopedRestart(mk(p),anchor,I.world,`${I.world}#zorian`);save.expansion.motherOfLearning.runStartedAt=save.expansion.clock;
 const q={...zorian(),state:save.expansion},k=q.state.simulation.knowledge.player;
 assert.ok(k['book.mol.zorian.research.ward.shelf']&&k['book.mol.zorian.research.ward.trial_2'],'the entries crossed');
 assert.equal(q.state.actors.player.completed[R.shelf],undefined,'the receipt reset');
 assert.equal(reserve(q).reserve,8,'the reserve is full again');
 assert.equal(molResearchFacts(q.state)['mol.research.showShelf'],false,'no second reading of the same shelf');
 assert.equal(molResearchFacts(q.state)['mol.research.showTrial3'],true,'run two resumes at the third trial');
 q.state.simulation.people.player.location=L.house;
 assert.equal(vis(q,R.t3).eligible,true);
 const r=run(q,R.t3);assert.equal(Object.keys(r.state.simulation.knowledge.player).filter(x=>x.includes('research.ward.trial')).length,3);
});
test('the refined method gives the watch beat a second route that spends no cast (STY33)',()=>{
 const arc='book.mol.zorian.arc1.';let p=taught();
 for(const key of ['shelf','trial_1','trial_2','trial_3','refined'])p.state.simulation.knowledge.player['book.mol.zorian.research.ward.'+key]={stage:'understood',value:'x',at:p.state.clock,cause:'fixture',basis};
 p.state.simulation.knowledge.player[study+'cloud_drill_result']={stage:'understood',value:'x',at:0,cause:'f',basis};
 const c=p.state.actors.player.completed;c[study+'track_marble_by_touch']=1;
 for(const n of ['trade_forecasts','consult_temple','compare_forecasters','report_and_ask_about_training','practice_inward_sense','discuss_firing_positions','watch_fireworks','inscribe_corridor_runes','cross_mansion_grounds','carry_tinami_toward_zach','make_missile_rod','follow_a_mind_below','drill_missiles_with_taiven','receive_pocket_watch'])c[arc+n]=1;
 p=at(p,'sewer');const facts=molFacts(p.state,zctx(p));
 assert.equal(facts['mol.arc.identify'],true);assert.equal(facts['mol.research.refined'],true);
 assert.equal(previewMolCommand(p.state,registry,R.watch,zctx(p)).visible,true);
 p.gameplay.player.inventory[MOL_KEYS.watch]=1;const pre=previewMolCommand(p.state,registry,R.watch,zctx(p));
 assert.equal(pre.eligible,true,JSON.stringify(pre.reasons));assert.equal(vis(p,arc+'identify_watch_purpose').costs.length>0,true,'the original route still costs a cast');assert.equal(pre.costs.length,0);
 const used=run(p,R.watch);assert.ok(used.state.simulation.knowledge.player[arc+'ward_reader_known']);assert.equal(reserve(used).reserve,reserve(p).reserve);
 // taking the refined route stands for the original beat in the chain
 p.state.actors.player.completed[R.watch]=1;const after=molFacts(p.state,zctx(p));
 assert.equal(after['mol.arc.identify'],false);assert.equal(after['mol.arc.openWatch'],true);
});
