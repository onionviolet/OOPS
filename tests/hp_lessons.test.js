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
import {HP_LESSON_CONSTANTS,hpLessonView,keepClassSlot,levitateChance,brewChance,HP_SPELL_ROWS} from '../src/book_world_hp_lessons.js';
import {hpLeadProjection} from '../src/book_world_hp_lead_domain.js';
import {channelsOf} from '../src/channels.js';
const P='book.hp.lead',DAY=1440,ARRIVE=P+'.arrive_school',SORT=P+'.sorting',FIRST=P+'.lesson_charms',PRACTICE=P+'.charms_practice',POTIONS=P+'.lesson_potions',LEV=P+'.levitation',CLASS=HP_DUTIES[0].id;
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

test('summer life is unchanged: no lesson is eligible, no spell is held, nothing is shown',()=>{
 const f=setup();at(f,MON,9*60+5);
 for(const id of [FIRST,PRACTICE,POTIONS])assert.equal(preview(f,id).eligible,false,id);
 assert.equal(hpLessonView(f.plan.state),null);assert.equal(hpLeadProjection(f.plan.state).lessons,null);
 assert.equal(f.plan.state.simulation.powers.player?.[LEV],undefined);
});
test('lessons open only at school, after the Sorting, in the class hour of a term Monday',()=>{
 const f=sorted();
 at(f,MON,9*60+5);assert.equal(preview(f,FIRST).eligible,true);assert.equal(preview(f,POTIONS).eligible,false,'Potions is the second hour');
 at(f,MON,10*60+5);assert.equal(preview(f,POTIONS).eligible,true);assert.equal(preview(f,FIRST).eligible,false);
 at(f,MON+1,9*60+5);assert.equal(preview(f,FIRST).eligible,false,'Tuesday has no class slot');
 at(f,MON,11*60+1);assert.equal(preview(f,POTIONS).eligible,false,'the hour is over');
 at(f,140+2,9*60+5);assert.equal(preview(f,FIRST).eligible,false,'Christmas holidays');
 const v=hpLessonView(f.plan.state);assert.match(v.lessons.find(l=>l.id==='charms').reason,/holidays/);
 const g=setup();at(g,32,10);run(g,ARRIVE);at(g,MON,9*60+5);assert.equal(preview(g,FIRST).eligible,false,'not sorted yet');
});
test('the first Charms lesson teaches the charm once; practice then rises and every try adds a step',()=>{
 const f=sorted();at(f,MON,9*60+5);
 const s1=run(f,FIRST);
 assert.equal(s1.simulation.powers.player[LEV].owned,true);assert.equal(s1.simulation.powers.player[LEV].mastery,0);
 assert.equal(s1.simulation.knowledge.player[P+'.lesson.levitation'].basis.kind,'instruction');
 assert.equal(preview(f,FIRST).eligible,false,'taught once');
 at(f,MON,9*60+45);assert.equal(preview(f,FIRST).eligible,false);
 let last=0;
 for(let week=0;week<4;week++){
  at(f,MON+7*(week+1),9*60+5);const pv=preview(f,PRACTICE);assert.equal(pv.eligible,true,pv.reasons.join(' '));
  const s=run(f,PRACTICE);assert.equal(s.simulation.powers.player[LEV].mastery,week+1,'lifted or dropped, a try adds a step');
  const c=levitateChance(week+1);assert.ok(c>last,'chance rises');last=c;
 }
 assert.deepEqual([0,1,5,20].map(levitateChance),[0.4,0.5,0.9,0.95].map(x=>x));
 const v=hpLessonView(f.plan.state);assert.equal(v.spells.length,1);assert.match(v.spells[0].line,/practised 4 times/);
 assert.equal(v.lessons.find(l=>l.id==='charms').commandId,PRACTICE);
});
test('the success chance the command draws from is the fact the view shows',()=>{
 const f=sorted();at(f,MON,9*60+5);run(f,FIRST);at(f,MON+7,9*60+5);
 const p=preview(f,PRACTICE);assert.equal(p.weights.length,2);
 assert.ok(Math.abs(p.weights[0]-0.4)<1e-9&&Math.abs(p.weights[0]+p.weights[1]-1)<1e-9);
});
test('Potions is a weekly class: a chance rising with Alchemy, Alchemy xp either way',()=>{
 const f=sorted();at(f,MON,10*60+5);
 assert.ok(Math.abs(preview(f,POTIONS).weights[0]-0.5)<1e-9);
 const before=f.plan.gameplay.player.skills?.Alchemy?.xp??0;
 run(f,POTIONS);
 assert.ok((f.plan.gameplay.player.skills?.Alchemy?.xp??0)>before,'the skill owner moved');
 assert.equal(brewChance(0),0.5);assert.equal(brewChance(10),0.7);assert.equal(brewChance(500),0.95);
 at(f,MON+7,10*60+5);assert.equal(preview(f,POTIONS).eligible,true,'repeats weekly');
});
test('attending marks the week\'s class slot through the duties API, once, and the other lesson keeps it too',()=>{
 const f=sorted();let cur=f.plan.state;
 registerDutySet('hp_lessons_test',hpDutySet(()=>cur));domainRegistry.load({});
 at(f,MON,9*60+5);cur=f.plan.state;domainRegistry.tick(1);
 const item=()=>domainRegistry.project('duties').items.find(i=>i.id===CLASS);
 assert.equal(item().open,true,'the slot is due');
 run(f,FIRST);cur=f.plan.state;assert.equal(keepClassSlot(domainRegistry),true);
 assert.equal(item(),undefined,'kept: nothing due');
 at(f,MON,10*60+5);cur=f.plan.state;
 assert.equal(keepClassSlot(domainRegistry),false,'a second lesson in the same week does not double-mark or throw');
 assert.equal(domainRegistry.save({}).duties.lastDone[CLASS]!=null,true);
 // next week, unattended, becomes a miss; a shut slot cannot be kept
 at(f,MON+7,12*60);cur=f.plan.state;assert.equal(keepClassSlot(domainRegistry),false);
});
test('the learned spell row persists through save and reload and carries a channel',()=>{
 const f=sorted();at(f,MON,9*60+5);run(f,FIRST);at(f,MON+7,9*60+5);run(f,PRACTICE);
 const reloaded=loadExpansionState(JSON.parse(JSON.stringify(f.plan.state)),f.registry);
 assert.equal(reloaded.simulation.powers.player[LEV].owned,true);assert.equal(reloaded.simulation.powers.player[LEV].mastery,1);
 assert.equal(hpLessonView(reloaded).spells[0].practice,1);
 assert.deepEqual(channelsOf({key:HP_SPELL_ROWS[0].key}),['change_situation']);
 assert.deepEqual(hpLessonView(reloaded).spells[0].channels,['change_situation']);
});

test('the copied constants match their owners and the lead minute matches the duty clock',()=>{
 const c=HP_LESSON_CONSTANTS;
 assert.equal(c.CLASS,CLASS);assert.deepEqual(c.SLOT,HP_DUTIES[0].schedule);assert.equal(c.HP_HOUSE_FACT,HP_HOUSE_FACT);assert.equal(c.AT_SCHOOL,HP_AT_SCHOOL_FACT);
 const f=sorted();at(f,MON,9*60+5);
 assert.equal(hpDutyMinute(f.plan.state),MON*DAY+9*60+5);
 assert.equal(hpLessonView(f.plan.state).lessons.find(l=>l.id==='charms').open,true);
});
