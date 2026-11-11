// W9-D: Harry's first lessons through the shared lesson seam (HG3 spell row from a lesson, HG7 Potions class).
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packNative} from '../src/world_pack_registry.js';
import {createContentRegistry,createExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand,advanceSimulationBoundary,previewSimulationCommand} from '../src/simulation.js';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {hpDutySet,HP_DUTIES} from '../src/book_world_hp_duties.js';
import {HP_HOUSE_FACT} from '../src/book_world_hp_positions.js';
import {HP_AT_SCHOOL_FACT,hpDutyMinute} from '../src/book_world_hp_duties.js';
import {hpLessonView} from '../src/book_world_hp_lessons.js';
import {hpExamView,hpExamFacts} from '../src/book_world_hp_exams.js';
import {HP_EXAM_IDS} from '../src/world_packs/book_hp_lead_exam_data.js';
import * as M from '../src/hp_exam_model.js';
import {schoolYearPosition,SCHOOL_YEAR} from '../src/book_world_hp_school_calendar.js';
import {hpLeadProjection} from '../src/book_world_hp_lead_domain.js';
import {channelsOf} from '../src/channels.js';
const P='book.hp.lead',DAY=1440,REV=s=>HP_EXAM_IDS.revise(s),PAPER=s=>HP_EXAM_IDS.paper(s),ARRIVE=P+'.arrive_school',SORT=P+'.sorting',FIRST=P+'.lesson_charms',PRACTICE=P+'.charms_practice',POTIONS=P+'.lesson_potions',LEV=P+'.levitation',CLASS=HP_DUTIES[0].id;
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
function setup(){
 const raw=packNative(P),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),compiled=compileStructuredPack(raw,registry);
 mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
 const state=createExpansionState(123),context={registry,actorId:'player',worldId:'base.frontier',external:{money:0},gameplay:{player:{inventory:{},skills:{Alchemy:{enabled:true,xp:0}},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},facts:{location:'Village'},busy:false};
 const sel=planStructuredSelection(state,d,context),begun=beginStructuredCampaign(sel.plan.state,d,context,null,sel.selection);
 const ctxFor=plan=>({...context,worldId:P+'.world',gameplay:plan.gameplay,external:plan.external,vitals:plan.vitals,structuredNative:{...begun.record,bound:true},facts:{location:plan.state.simulation.people.player.location}});
 return {registry,plan:begun.plan,ctxFor,opening:begun.plan.state.simulation.knowledge.player[P+'.opening'].at};
}
const at=(f,day,min)=>{f.plan.state.clock=f.opening+day*DAY-480+min;};
const preview=(f,id)=>previewSimulationCommand(f.plan.state,f.registry,id,f.ctxFor(f.plan));
function run(f,id){
 const started=commitSimulationCommand(f.plan.state,f.registry,{id},f.ctxFor(f.plan));
 const job=started.state.simulation.jobs.find(j=>j.commandId===id);started.state.clock=job.due;
 advanceSimulationBoundary(started,f.registry,{player:f.ctxFor(started)});
 f.plan=started;return started.state;
}
// A sorted first year; day 37 is Monday 6 September (day 0 is a Saturday).
const MON=37;
function sorted(){const f=setup();at(f,32,10);run(f,ARRIVE);run(f,SORT);return f;}


// ---- model: results are the contract (SPR20), held-out cases (SPR22), canon-run rate (SPR9) ----
test('anchor bands hold across many cohorts, not only the shipped one (SPR20/SPR22 slack)',()=>{
 let ronOk=0;
 for(let i=0;i<200;i++){
  const c=M.cohortMarks('seed'+i);
  assert.equal(M.overallBand(M.anchorBands('hermione',c)),'top','Hermione leads the year');
  if(['good','high'].includes(M.overallBand(M.anchorBands('ron',c))))ronOk++;
  const nev=M.anchorBands('neville',c);
  assert.notEqual(M.overallBand(nev),'fail','Neville passes');
  assert.ok(['top','high'].includes(nev.herbology),'held out: Neville is helped by Herbology (seed '+i+')');
 }
 assert.ok(ronOk>=194,'slack: Ron lands in the good band in '+ronOk+' of 200 cohorts');
 const c=M.cohortMarks();assert.equal(Object.values(c)[0].length,M.COHORT_SIZE-1);
 assert.ok(['good','high'].includes(M.overallBand(M.anchorBands('ron',c))),'the shipped cohort holds Ron in band');
});
const canon=(sessions,f=.5)=>Object.fromEntries(M.SUBJECT_IDS.map(s=>[s,{fluency:['charms','potions'].includes(s)?f:0,understanding:0,sessions}]));
test('a lead who follows the canon choices (lessons attended, the story\'s revision) lands in the canon band at a stated rate, many cohorts (SPR9)',()=>{
 let hits=0,n=0;
 for(let i=0;i<100;i++){const c=M.cohortMarks('rate'+i),o=M.overallChances(canon(2),c);hits+=o.good+o.high+o.top;n++;}
 const rate=hits/n;assert.ok(rate>=0.9,`canon-run reach rate ${rate}`);
 const none=M.overallChances(canon(0,0)),skip=M.overallChances(canon(0)),max=M.overallChances(Object.fromEntries(M.SUBJECT_IDS.map(s=>[s,{fluency:1,understanding:1,sessions:6}])));
 assert.ok(none.good+none.high+none.top<0.4,'no practice and no revision is mostly a plain pass');
 assert.ok(skip.good+skip.high+skip.top<0.9,'skipping the revision costs the canon band some of the time');
 assert.ok(max.top<0.05,'full effort does not out-top Hermione');assert.ok(max.high>0.9);
});
test('preparation narrows the spread and every chance set sums to one; failing needs a mark under the pass line',()=>{
 for(const s of M.SUBJECT_IDS)for(const r of [0,3,6]){const c=M.bandChances(s,{fluency:.3,sessions:r});assert.ok(Math.abs(Object.values(c).reduce((a,b)=>a+b,0)-1)<1e-9);}
 assert.ok(M.markRange('charms',{sessions:6}).w<M.markRange('charms',{sessions:0}).w);
 assert.ok(M.markRange('charms',{sessions:99}).centre===M.markRange('charms',{sessions:6}).centre,'past the cap adds nothing (GTR21)');
 assert.equal(M.bandOf('charms',M.DIALS.passMark-1),'fail');
 assert.equal(M.overallBand(Object.fromEntries(M.SUBJECT_IDS.map((s,i)=>[s,i<2?'fail':'good']))),'fail');
});
test('the exam day sits on the school calendar and stops lessons',()=>{
 const e=SCHOOL_YEAR.find(x=>x.id==='exams');assert.equal(e.day,M.EXAM_DAY);assert.equal(e.date,'17 June');
 assert.equal(schoolYearPosition(M.EXAM_DAY-1).phase,'term');assert.equal(schoolYearPosition(M.EXAM_DAY).phase,'exams');
 assert.equal(schoolYearPosition(M.EXAM_DAY-1).next.id,'exams');
});

// ---- native commands: revision, papers, marks, save/reload ----
const EASTER=250,EXAMS=M.EXAM_DAY;
test('revision opens with the Easter holidays, counts per subject up to the cap, costs stamina, and closes when the exams begin',()=>{
 const f=sorted();
 at(f,100,9*60);assert.equal(preview(f,REV('charms')).eligible,false,'too early');
 at(f,EASTER,9*60);const p=preview(f,REV('charms'));assert.equal(p.eligible,true,p.reasons.join(' '));
 for(let i=0;i<6;i++)run(f,REV('charms'));
 assert.equal(f.plan.state.actors.player.resources[HP_EXAM_IDS.resource('charms')],6);
 assert.equal(preview(f,REV('charms')).eligible,false,'the notes add nothing past six');assert.match(preview(f,REV('charms')).reasons.join(' '),/practice or a teacher/);
 assert.equal(preview(f,REV('history')).eligible,true,'another subject is still open');
 assert.ok(f.plan.vitals.player.stamina<100,'revision tires');
 at(f,EXAMS,9*60);assert.equal(preview(f,REV('history')).eligible,false,'exam week has begun');
 const v=hpExamView(f.plan.state);assert.equal(v.revision.find(r=>r.id==='charms').sessions,6);
});
test('a paper rolls the exact band chances, saves its band, and cannot be sat twice or out of order; practice after changes nothing',()=>{
 const f=sorted();at(f,EXAMS-1,9*60);assert.equal(preview(f,PAPER('transfiguration')).eligible,false,'before the exam day');
 at(f,EXAMS,8*60);
 const first=M.SUBJECT_IDS[0],second=M.SUBJECT_IDS[1];
 assert.equal(preview(f,PAPER(second)).eligible,false,'timetable order');
 const pv=preview(f,PAPER(first));assert.equal(pv.eligible,true,pv.reasons.join(' '));
 const chances=M.bandChances(first,{});M.BANDS.forEach((b,i)=>assert.ok(Math.abs(pv.weights[i]-chances[b])<1e-9,'weight '+b));
 const s=run(f,PAPER(first));const band=s.actors.player.facts['hp.lead.exam.band.'+first];assert.ok(M.BANDS.includes(band));
 assert.equal(preview(f,PAPER(first)).eligible,false,'once');
 assert.match(s.simulation.knowledge.player[P+'.exam.'+first+'.sat'].value,/quill/,'the paper says nothing about the mark');
 assert.doesNotMatch(JSON.stringify(s.simulation.knowledge.player[P+'.exam.'+first+'.sat']),new RegExp(band==='top'?'among the best':'high marks'));
 // the saved band survives a reload of the same state and later weights do not touch it
 const clone=structuredClone(s);assert.equal(clone.actors.player.facts['hp.lead.exam.band.'+first],band);
});
test('all seven papers then the marks board: the overall verdict is the saved bands, read once, on the last day of term',()=>{
 const f=sorted();at(f,EXAMS,8*60);
 for(const s of M.SUBJECT_IDS){const st=run(f,PAPER(s));f.plan.state.clock+=0;}
 assert.equal(hpExamView(f.plan.state).phase,'marks_pending');
 assert.equal(preview(f,HP_EXAM_IDS.marks).eligible,false,'not before the last day of term');
 at(f,329,9*60);const pv=preview(f,HP_EXAM_IDS.marks);assert.equal(pv.eligible,true,pv.reasons.join(' '));
 const bands=Object.fromEntries(M.SUBJECT_IDS.map(s=>[s,f.plan.state.actors.player.facts['hp.lead.exam.band.'+s]]));
 const want=M.overallBand(bands);M.BANDS.forEach((b,i)=>assert.equal(pv.weights[i],b===want?1:0,'the verdict is deterministic from the bands'));
 const st=run(f,HP_EXAM_IDS.marks);assert.equal(st.actors.player.facts['hp.lead.exam.overall'],want);
 assert.match(st.simulation.knowledge.player[HP_EXAM_IDS.resultKey].value,/Your marks:/);
 const v=hpExamView(st);assert.equal(v.phase,'results');assert.equal(v.results.rows.length,7);assert.equal(v.results.overall,want);
 assert.match(v.results.rows[0].remark,/^The transformation mistress /);
 assert.deepEqual(v.results.others,['Ron passed with good marks.'],'only Ron is known at this point (AD6); Hermione and Neville stay unnamed');
 st.simulation.knowledge.player[P+'.met_names']={value:'You sat beside Hermione and Ron in the hall.',stage:'seen',at:1};
 assert.deepEqual(hpExamView(st).results.others.map(l=>l.split(' ')[0]),['Hermione','Ron']);
 assert.equal(preview(f,HP_EXAM_IDS.marks).eligible,false,'once');
});
test('the story\'s revision credits two sessions to every subject and the facts show it; the next-year regard needs a high Charms paper',()=>{
 const f=sorted();at(f,EASTER,9*60);
 const base=hpExamFacts(f.plan.state,f.ctxFor(f.plan));assert.equal(base['hp.lead.exam.rev.charms'],0);assert.equal(base['hp.lead.exam.revisionOpen'],true);
 f.plan.state.actors.player.completed[P+'.w11_finale.revision']=1;
 const after=hpExamFacts(f.plan.state,f.ctxFor(f.plan));assert.equal(after['hp.lead.exam.rev.charms'],2);
 assert.ok(after['hp.lead.exam.p.charms.good']>base['hp.lead.exam.p.charms.good'],'revision moves the odds');
});
test('practice and study raise the odds: Charms by levitation steps and a library write-up, Potions by Alchemy and a correct flask',()=>{
 const f=sorted(),ctx=f.ctxFor(f.plan);at(f,EXAMS,8*60);
 const lo=hpExamFacts(f.plan.state,ctx);
 f.plan.state.simulation.powers.player={[P+'.levitation']:{owned:true,mastery:8,executions:8}};
 f.plan.state.simulation.knowledge.player['study.hp.charms.writeup']={stage:'understood',value:'x',at:1};
 const ctx2={...ctx,gameplay:{...ctx.gameplay,player:{...ctx.gameplay.player,skills:{Alchemy:{enabled:true,xp:40}}}}};
 f.plan.state.actors.player.facts['hp.lead.potions.flask']='cure';
 const hi=hpExamFacts(f.plan.state,ctx2);
 const top=r=>r['hp.lead.exam.p.charms.top']+r['hp.lead.exam.p.charms.high'];
 assert.ok(top(hi)>top(lo)+0.5,'Charms');
 assert.ok(hi['hp.lead.exam.p.potions.good']+hi['hp.lead.exam.p.potions.high']+hi['hp.lead.exam.p.potions.top']>lo['hp.lead.exam.p.potions.good']+lo['hp.lead.exam.p.potions.high']+lo['hp.lead.exam.p.potions.top'],'Potions');
 assert.equal(hi['hp.lead.exam.p.history.top'],lo['hp.lead.exam.p.history.top'],'no play behind History: baseline only (stated gap)');
});
