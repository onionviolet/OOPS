// Exams against a cohort, second world (AD51/FND5): Zorian's class tests in Cyoria on the shared model (src/exam_cohort.js).
// The loop is the test: classmates reset, so their marks repeat exactly; Zorian's revision and earlier sittings are soul-bound and carry.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fixture,context} from '../docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L2/fixture.mjs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {previewMolCommand,commitMolCommand,molPresentation,validateMolCampaignState} from '../src/book_world_mol_host.js';
import {molFacts} from '../src/book_world_mol_actions.js';
import {MOL_IDS as I,MOL_LOCATIONS as L} from '../src/book_world_mol_ids.js';
import {MOL_BEGIN_ZORIAN} from '../src/book_world_mol_starts.js';
import {advanceSimulationBoundary} from '../src/simulation.js';
import {beginContinuation,planContinuation} from '../src/continuation_state.js';
import {todayFor} from '../src/mol_zorian_loop.js';
import {RESTART_SCOPES} from '../src/harm_restart_scope.js';
import * as HP from '../src/hp_exam_model.js';
import {hpLeadExamCommands} from '../src/world_packs/book_hp_lead_exam_data.js';
import * as M from '../src/mol_exam_model.js';
import {MOL_EXAM_IDS as X} from '../src/world_packs/book_mol_exam_data.js';
import {molExamView,molExamInputs} from '../src/mol_zorian_exams.js';
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('Harry’s exams are unchanged by the shared model: every number and every command row',()=>{
 // Digest of the HP model before the extraction (cohorts for three seeds, ranges and chances over an input grid, anchors, overall).
 const out=[];
 for(const seed of ['book.hp.lead.exams.cohort.v1','alt.1','alt.2']){
  const c=HP.cohortMarks(seed);out.push(c);
  for(const s of HP.SUBJECT_IDS)for(const f of [0,.5,1])for(const u of [0,.5,1])for(const n of [0,2,6,9]){const i={fluency:f,understanding:u,sessions:n};out.push([s,HP.markRange(s,i),HP.bandChances(s,i,c)]);}
  for(const w of Object.keys(HP.ANCHORS))out.push(HP.anchorBands(w,c));
  out.push(HP.overallChances(Object.fromEntries(HP.SUBJECT_IDS.map(s=>[s,{fluency:.5,understanding:.5,sessions:2}])),c));
 }
 out.push(HP.overallBand({transfiguration:'good',charms:'top',herbology:'pass',potions:'fail',astronomy:'good',defence:'high',history:'pass'}));
 assert.equal(sha(out),'21f7d43e7a553ba9452c226876172a4e248f92dd182cbe830a0994ecfcae8421');
 // The command rows feed the private cast pack's base hash, so they stay byte-identical.
 assert.equal(sha(hpLeadExamCommands),'68e831835b1630fbc9c17244f096b0dfc3e5d7865c703f941f3a119d964297ef');
});

// The canon route per run: Zorian goes over each subject once a run and sits every paper, as the source's student does.
const route=(run,{perRun=1,understanding=0}={})=>Object.fromEntries(M.SUBJECT_IDS.map(s=>[s,{sessions:perRun*run,seen:run-1,understanding}]));
const P=(c,bands)=>bands.reduce((n,b)=>n+c[b],0);
test('canon sets the band (SPR20, STY33): run 1 good to high with Warding weakest, about run 8 near-perfect everywhere',()=>{
 const c1=M.cohortFor(1),r1=route(1);
 assert.ok(P(M.MODEL.overallChances(r1,c1),['good','high'])>0.999,'run 1: one of the best students, not the top (c3 p272)');
 assert.equal(M.MODEL.overallChances(r1,c1).top,0);
 const mean=s=>{const c=M.MODEL.bandChances(s,r1[s],c1);return M.BANDS.reduce((n,b,i)=>n+c[b]*(4-i),0);};
 assert.ok(mean('warding')<mean('formulas')&&mean('warding')<mean('mathematics'),'Warding goes badly in run 1 (c3 p27-50)');
 for(const run of [8,10])assert.ok(M.MODEL.overallChances(route(run),M.cohortFor(run)).top>0.99,`run ${run}: near-perfect, even warding (c6 p324)`);
 assert.ok(M.MODEL.bandChances('warding',route(8).warding,M.cohortFor(8)).top>0.95);
 // marks rise across runs where canon says they do (expected band points never fall from one run to the next)
 let prev=-1;for(let run=1;run<=8;run++){const o=M.MODEL.overallChances(route(run),M.cohortFor(run)),pts=M.BANDS.reduce((n,b,i)=>n+o[b]*(4-i),0);assert.ok(pts>=prev-1e-9,`run ${run}`);prev=pts;}
 // the rise comes from what he did, not from the run count: a run-8 Zorian who never revised or sat a paper is a run-1 Zorian
 assert.deepEqual(M.MODEL.overallChances(route(1),M.cohortFor(8)),M.MODEL.overallChances(Object.fromEntries(M.SUBJECT_IDS.map(s=>[s,{sessions:1}])),M.cohortFor(2)));
});
test('the class resets and two classmates do not: Zach aces every run, Neolu tops only the first, Akoja falls behind Zorian',()=>{
 const c1=M.cohortFor(1),c2=M.cohortFor(2),c9=M.cohortFor(9);
 for(const s of M.SUBJECT_IDS){
  assert.deepEqual(c1[s].filter(r=>r.who!=='neolu'),c2[s].filter(r=>r.who!=='neolu'),'every classmate but Neolu sits the same paper the same way');
  assert.deepEqual(c2[s],c9[s]);
 }
 for(const c of [c1,c2,c9])assert.deepEqual(Object.values(M.MODEL.anchorBands('zach',c)),['top','top','top'],'Zach remembers too (c3: acing every exam)');
 assert.deepEqual(Object.values(M.MODEL.anchorBands('neolu',c1)),['top','top','top'],'run 1: perfect scores (c3 p42)');
 assert.ok(Object.values(M.MODEL.anchorBands('neolu',c2)).every(b=>!['top','high'].includes(b)),'later runs: ordinary again (c7 p346)');
 // Akoja: near the top in run 1, below Zorian's mark once his memory builds (c6 p324)
 assert.ok(Object.values(M.MODEL.anchorBands('akoja',c1)).every(b=>['top','high','good'].includes(b)));
 for(const s of M.SUBJECT_IDS)assert.ok(M.MODEL.markRange(s,route(8)[s]).low>c9[s].find(r=>r.who==='akoja').mark);
 // slack (SPR21): the same contract over 200 other classes
 let run1=0,run8=0,zach=0,neolu=0;
 for(let k=0;k<200;k++){
  const a=M.MODEL.cohortMarks('alt.'+k,'first'),b=M.MODEL.cohortMarks('alt.'+k,null);
  const o1=M.MODEL.overallChances(route(1),a),o8=M.MODEL.overallChances(route(8),b);
  run1+=o1.top===0&&P(o1,['good','high'])>0.9;run8+=o8.top>0.95;
  zach+=Object.values(M.MODEL.anchorBands('zach',b)).every(x=>x==='top');neolu+=Object.values(M.MODEL.anchorBands('neolu',a)).every(x=>x==='top');
 }
 assert.ok(run1>=175&&run8>=190&&zach===200&&neolu>=195,JSON.stringify({run1,run8,zach,neolu}));
});
test('chances are exact and rise with every input (more revision, an earlier sitting, a study month)',()=>{
 const c=M.cohortFor(2),pts=(s,i)=>{const x=M.MODEL.bandChances(s,i,c);return M.BANDS.reduce((n,b,k)=>n+x[b]*(4-k),0);};
 for(const s of M.SUBJECT_IDS){
  assert.ok(Math.abs(Object.values(M.MODEL.bandChances(s,{},c)).reduce((a,b)=>a+b,0)-1)<1e-9);
  for(const key of ['sessions','seen'])for(let n=0;n<6;n++)assert.ok(pts(s,{[key]:n+1})>=pts(s,{[key]:n})-1e-9,`${s} ${key} ${n}`);
  assert.ok(pts(s,{understanding:1})>=pts(s,{}));
  assert.ok(M.MODEL.markRange(s,{seen:4,sessions:8}).w<M.MODEL.markRange(s,{}).w,'preparation narrows the draw');
 }
 assert.ok(M.MODEL.bandChances('formulas',{seen:4,sessions:8,understanding:1},c).top===1);
});
test('only the Zorian loop row makes counters soul-bound; the visitor, LOTM and default restarts keep no resource',()=>{
 assert.deepEqual(RESTART_SCOPES['book.mol.cyoria#zorian'].soulBound.resources.map(String),['/^book\\.mol\\.loop\\./']);
 for(const k of ['default','book.lotm.tingen','base.frontier'])assert.equal(RESTART_SCOPES[k].soulBound?.resources,undefined,k);
});

// --- Played route on a continuing save (helpers as in mol_zorian_restart.test.js) ---
const DAY=1440;
const finish=p=>{let n=0;while(p.state.simulation.jobs.some(j=>j.actorId==='player')&&n++<2000){p.state.clock++;advanceSimulationBoundary(p,registry,{player:zctx(p)});}return p;};
const at=(p,where)=>({...p,...commitMolCommand(p.state,registry,{type:'book_mol',id:'book.mol.move.'+where},zctx(p))});
const act=(p,id)=>({...p,...commitMolCommand(p.state,registry,{type:'book_mol',id},zctx(p))});
const run=(p,id)=>finish(act(p,id));
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
const context0=p=>({actorId:'player',nativeAlive:true,nativeBody:p.state.simulation.people.player.body,molNative:{bound:true,revision:0,body:p.state.simulation.people.player.body},vitals:p.vitals,gameplay:p.gameplay,external:p.external,equipment:p.equipment,facts:{location:p.state.simulation.people.player.location}});
const zctx=p=>({...context0(p),molNative:{bound:true,revision:1,body:p.state.simulation.people.player.body},facts:{location:p.state.simulation.people.player.location}});
function zorian(){const p={...village()};const b={...p,...commitMolCommand(p.state,registry,{type:'book_mol',id:MOL_BEGIN_ZORIAN},context0(p))};b.state.motherOfLearning.nativeRevision=1;return b;}
const mk=p=>({'game version':'v0.6.0','current time':{year:999,month:4,day:1,hour:8,minute:0,day_count:1},saved_at:1,
 'current location':p.state.simulation.people.player.location,character:{name:'Zorian',money:0,xp:{total_xp:0},equipment:{},bio:{race:'human'},hp_to_full:0},
 levels:{person:{main_character:{total_xp:0,skill_xp:{}}}},inventories:{person:{main_character:{}}},npcs:{},npc_equipment:{},locations:{},
 availabilities:{location:{},person:{},trader:{},quest:{}},quests:{},options:{},expansion:p.state});
let serial=0;
const cmd=(s,command)=>planContinuation(s,command,{expectedSequence:s.continuation.sequence,token:`x-${++serial}`});
function pass(save,minutes){const s=structuredClone(save),t=s['current time'],total=t.day*DAY+t.hour*60+t.minute+minutes;s.expansion.clock+=minutes;t.day=Math.floor(total/DAY);t.hour=Math.floor(total%DAY/60);t.minute=total%60;return s;}
const start=()=>{const p=zorian();delete p.state.simulation.controllers['village.craftsman_controller'];return beginContinuation(mk(p),'zorian-exams');};
const P0=zorian(),wrap=state=>({...P0,state});
const play=(s,steps)=>{let p=wrap(s.expansion);for(const st of steps)p=st.includes('.')?run(p,st):at(p,st);const out=structuredClone(s);out.expansion=p.state;return out;};
const why=(s,id,where)=>{const q=wrap(s.expansion),p=where&&q.state.simulation.people.player.location!==L[where]?at(q,where):q,r=previewMolCommand(p.state,registry,id,zctx(p));return r.eligible||r.reasons.join(' | ');};
const facts=s=>s.expansion.actors.player.facts,res=s=>s.expansion.actors.player.resources;
// Real stepping for time inside a run (a clock jump would skip the simulation's controllers), as in mol_zorian_restart.test.js.
function idle(save,minutes){
 const p=wrap(structuredClone(save.expansion));for(let i=0;i<minutes;i+=60){p.state.clock+=Math.min(60,minutes-i);advanceSimulationBoundary(p,registry,{player:zctx(p)});}
 for(const c of Object.values(p.state.simulation.controllers))if(c.due<p.state.clock)c.due=p.state.clock+c.interval;
 const out=pass(save,minutes);out.expansion=p.state;return out;
}
const sitAll=s=>{
 s=play(s,['library',X.revise('formulas'),X.revise('mathematics'),X.revise('warding'),'workshop',X.placement]);
 s=idle(s,(4-todayFor(s.expansion).day)*DAY);
 s=play(s,[X.paper('formulas'),X.paper('mathematics')]);
 s=idle(s,(18-todayFor(s.expansion).day)*DAY);
 return play(s,['academy',X.paper('warding')]);
};
const DAYS_TO_END=29*DAY+17*60+1;

test('played: revise, sit three papers, the month restarts, the class forgets the marks and Zorian keeps what he learnt',()=>{
 let s=start();
 assert.equal(molFacts(s.expansion,zctx(wrap(s.expansion)))['mol.exam.shown'],true);
 assert.match(String(why(s,X.paper('formulas'),'workshop')),/placement test first/);
 assert.match(String(why(s,X.paper('warding'),'academy')),/day 18/);
 const before=molExamInputs(s.expansion);assert.deepEqual(before.warding,{sessions:0,seen:0,understanding:0});
 s=sitAll(s);
 for(const subj of M.SUBJECT_IDS){
  assert.ok(M.BANDS.includes(facts(s)[X.band(subj)]),subj);assert.equal(facts(s)[X.last(subj)],facts(s)[X.band(subj)]);
  assert.equal(res(s)[X.sat(subj)],1);assert.equal(res(s)[X.sessions(subj)],1);
 }
 assert.notEqual(why(s,X.paper('warding'),'academy'),true,'once a run');
 assert.match(String(why(s,X.revise('warding'),'library')),/until this run’s paper is sat/,'revision for a sat paper is closed this run');
 const view1=molExamView(s.expansion);assert.ok(view1.overall,'all three marked: an overall line');
 assert.ok(view1.papers[2].others.some(t=>t.startsWith('Zach aced')),view1.papers[2].text);
 // the month ends
 s=pass(s,DAYS_TO_END-17*DAY);const next=cmd(s,'loop-end:date');
 assert.equal(next.expansion.motherOfLearning.runs,2);
 for(const subj of M.SUBJECT_IDS){
  assert.equal(facts(next)[X.band(subj)],undefined,'the world forgets the mark');
  assert.equal(facts(next)[X.last(subj)],facts(s)[X.last(subj)],'he remembers it');
  assert.equal(res(next)[X.sat(subj)],1,'and the questions');assert.equal(res(next)[X.sessions(subj)],1,'and his notes');
 }
 assert.equal(next.expansion.actors.player.completed[X.paper('warding')],undefined,'the paper can be sat again');
 assert.equal(res(next)['book.mol.crowns']??0,0);
 const inputs=molExamInputs(next.expansion);assert.deepEqual(inputs.warding,{sessions:1,seen:1,understanding:0});
 const f=molFacts(next.expansion,zctx(wrap(next.expansion)));
 const pts=subj=>M.BANDS.reduce((n,b,i)=>n+f[`mol.exam.p.${subj}.${b}`]*(4-i),0);
 const first=Object.fromEntries(M.SUBJECT_IDS.map(subj=>[subj,M.MODEL.bandChances(subj,before[subj],M.cohortFor(1))]));
 for(const subj of M.SUBJECT_IDS)assert.ok(pts(subj)>M.BANDS.reduce((n,b,i)=>n+first[subj][b]*(4-i),0),`${subj} rises in run 2`);
 assert.match(molExamView(next.expansion).papers[2].text,/sat this paper 1 time before, last time/);
 // and the papers can be sat again in run 2
 const again=sitAll(next);assert.equal(res(again)[X.sat('warding')],2);assert.equal(res(again)[X.sessions('warding')],2);
});
test('a paper in progress saves: the frozen job carries the drawn outcome and the validator accepts only that one',()=>{
 let s=start();s=play(s,['library',X.revise('formulas'),'workshop',X.placement]);s=idle(s,3*DAY);
 const p=act(wrap(s.expansion),X.paper('formulas')),job=p.state.simulation.jobs.find(j=>j.commandId===X.paper('formulas'));
 assert.ok(M.BANDS.includes(job.outcomeId));validateMolCampaignState(p.state);
 const forged=structuredClone(p.state),j=forged.simulation.jobs.find(j=>j.commandId===X.paper('formulas'));j.outcomeId=j.outcomeId==='top'?'fail':'top';
 assert.throws(()=>validateMolCampaignState(forged),/differs from its exact admitted owner/);
});
test('the panel shows the tests as their own section and takes them out of the campaign list',()=>{
 const s=start(),p=at(wrap(s.expansion),'library'),view=molPresentation(p.state,registry,zctx(p));
 const exams=view.sections.find(x=>x.id==='book.mol.exams'),campaign=view.sections.find(x=>x.id==='book.mol.campaign');
 assert.ok(exams&&campaign);assert.deepEqual(exams.actions.map(a=>a.id),M.SUBJECT_IDS.map(X.revise));
 assert.ok(!campaign.actions.some(a=>a.id.startsWith('book.mol.zorian.exam.')));
 assert.equal(exams.records.length,3);assert.match(exams.description,/^Run 1, day 1\. Spell Formulas is next \(day 3\)/);
 const visitor=molPresentation(fixture(false).state,registry,context(fixture(false)));
 assert.ok(!visitor.sections.some(x=>x.id==='book.mol.exams'),'the visitor start has no class');
});
