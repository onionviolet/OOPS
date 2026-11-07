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

import {configureInquiry,stepInquiry,freshInquiries,noteKey,noteInquiryId} from '../src/inquiry.js';
import {HP_STUDY_TOPICS,hpStudyRows,hpStudyStart,hpStudyWriteNote} from '../src/book_world_hp_inquiry.js';
import {hpLessonFacts,HP_STUDY,hpStudyBonus} from '../src/book_world_hp_lessons.js';
import {lotmLibraryQuote,lotmLibraryStudy,LOTM_LIBRARY_INQUIRY,LOTM_LIBRARY_KEY} from '../src/book_world_lotm_inquiry.js';
import {LOTM_IDS,LOTM_LOCATIONS} from '../src/book_world_lotm_ids.js';
import {validateItemKey} from '../src/inventory_key.js';
import {stageAcquisition} from '../src/acquisition.js';
import {NOTE_ITEM_ID} from '../src/inquiry_note_item.js';
const P='book.hp.lead',DAY=1440,ARRIVE=P+'.arrive_school',SORT=P+'.sorting',FIRST=P+'.lesson_charms',PRACTICE=P+'.charms_practice',POTIONS=P+'.lesson_potions';
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


const CH=HP_STUDY.charms;
const slice=()=>domainRegistry.save({}).inquiry;
const wire=f=>configureInquiry({plan:m=>{const state=structuredClone(f.plan.state);state.clock+=m;return {state,external:{money:0},gameplay:structuredClone(f.plan.gameplay)};},
 commit:p=>{f.plan.state=p.state;f.plan.gameplay=p.gameplay;},writable:()=>true});
const fresh=f=>{domainRegistry.initialize();domainRegistry.load({});wire(f);return f;};
const study=id=>domainRegistry.command('inquiry','work')({id});
const quote=id=>domainRegistry.command('inquiry','quote')({id});
const chance=f=>hpLessonFacts(f.plan.state,{gameplay:f.plan.gameplay})['hp.lead.levitateChance'];

test('Harry studies the levitation charm: minutes and class evidence both count, it completes once, and the practice chance rises',()=>{
 const f=fresh(sorted());at(f,MON,9*60+5);run(f,FIRST);
 at(f,MON,12*60);
 assert.equal(slice(),undefined,'an untouched life writes no inquiry key');
 const before=chance(f);
 for(let i=0;i<3;i++){const r=study(CH.inquiry);assert.equal(r.done,false);assert.equal(r.spent,60);}
 assert.equal(f.plan.state.clock-f.opening+480,MON*DAY+15*60,'three sessions spent three hours of the clock');
 let q=quote(CH.inquiry);assert.equal(q.eligible,true);assert.equal(q.effort.minutes,180);assert.equal(q.effort.evidence,1,'one lesson attended so far');
 assert.equal(f.plan.state.simulation.knowledge.player[CH.key],undefined,'reading alone does not finish it');
 for(const wk of [1,2]){at(f,MON+7*wk,9*60+5);run(f,PRACTICE);}
 const mid=chance(f);at(f,MON+14,12*60);
 const r=study(CH.inquiry);
 assert.equal(r.done,true);assert.deepEqual(r.wroteNow,[CH.key]);
 const entry=f.plan.state.simulation.knowledge.player[CH.key];assert.equal(entry.stage,'understood');assert.equal(entry.cause,'inquiry:'+CH.inquiry);
 assert.ok(Math.abs(chance(f)-(mid+HP_STUDY.bonus))<1e-9,'a small practice bonus to the lesson chance');assert.ok(chance(f)>before);
 assert.match(hpLessonView(f.plan.state).spells[0].line,/studied why it works/);
 assert.throws(()=>study(CH.inquiry),/already worked this out/);
 assert.equal(quote(CH.inquiry).eligible,false);
 const kept=structuredClone(f.plan.state.simulation.knowledge.player);
 assert.equal(slice().records[CH.inquiry].wrote.length,1);assert.deepEqual(f.plan.state.simulation.knowledge.player,kept);
});

test('the library is shut in the holidays and before Hogwarts, and the panel rows say why (failure scenario)',()=>{
 const g=fresh(setup());at(g,MON,12*60);
 assert.match(quote(CH.inquiry).reason,/Hogwarts/);assert.throws(()=>study(CH.inquiry),/Hogwarts/);
 const f=fresh(sorted());at(f,140+2,12*60);assert.match(quote(CH.inquiry).reason,/holidays/);
 const rows=hpStudyRows(domainRegistry);assert.equal(rows.length,2);assert.ok(rows.every(r=>!r.eligible&&r.reason&&/^Study .* · 60 min$/.test(r.label)));
 at(f,MON,12*60);assert.ok(hpStudyRows(domainRegistry).every(r=>r.eligible));
 assert.throws(()=>hpStudyStart(domainRegistry,'study.frontier.lever'),/not a library topic/);
 assert.equal(slice(),undefined,'refused sessions write nothing');
 assert.deepEqual(HP_STUDY_TOPICS.map(t=>t.topic).sort(),['charms','potions']);
});

test('Potions study counts Alchemy xp as classes and gives the Potions chance bonus',()=>{
 const f=fresh(sorted());at(f,MON,10*60+5);run(f,POTIONS);run(f,POTIONS);
 const PT=HP_STUDY.potions;at(f,MON,13*60);
 const xp=f.plan.gameplay.player.skills.Alchemy.xp;assert.ok(xp>=4);
 study(PT.inquiry);study(PT.inquiry);const r=study(PT.inquiry);
 assert.equal(r.done,true,'180 minutes and two classes');assert.equal(hpStudyBonus(f.plan.state,'potions'),HP_STUDY.bonus);
 const base=hpLessonFacts({...f.plan.state,simulation:{...f.plan.state.simulation,knowledge:{player:{}}}},{gameplay:f.plan.gameplay})['hp.lead.brewChance'];
 const now=hpLessonFacts(f.plan.state,{gameplay:f.plan.gameplay})['hp.lead.brewChance'];assert.ok(now>base||now===0.95);
});

test('a finished study can be written as a note object; a note someone else wrote grants the fact second hand; losing it loses the read',()=>{
 const f=fresh(sorted());at(f,MON,9*60+5);run(f,FIRST);for(const wk of [1,2]){at(f,MON+7*wk,9*60+5);run(f,PRACTICE);}
 at(f,MON+14,12*60);
 assert.throws(()=>domainRegistry.command('inquiry','writeNote')({id:CH.inquiry}),/Work it out/);
 for(let i=0;i<3;i++)study(CH.inquiry);
 const w=hpStudyWriteNote(domainRegistry,CH.inquiry);
 assert.equal(w.key,noteKey(CH.inquiry,'player'));validateItemKey(w.key);assert.equal(noteInquiryId(w.key),CH.inquiry);assert.equal(JSON.parse(w.key).id,NOTE_ITEM_ID);
 assert.equal(f.plan.gameplay.player.inventory[w.key],1,'a held object in the ordinary inventory');
 // Someone else's note: same inquiry, another writer; this reader has done no study of their own.
 const theirs=noteKey(CH.inquiry,'oldCraftsman');
 domainRegistry.load({});delete f.plan.state.simulation.knowledge.player[CH.key];
 assert.throws(()=>domainRegistry.command('inquiry','readNote')({key:theirs}),/do not hold/);
 f.plan.gameplay.player.inventory[theirs]=1;
 const r=domainRegistry.command('inquiry','readNote')({key:theirs});
 assert.deepEqual(r.wroteNow,[CH.key]);
 const e=f.plan.state.simulation.knowledge.player[CH.key];assert.equal(e.stage,'interpreted');assert.equal(e.cause,'note:'+CH.inquiry);
 assert.equal(hpStudyBonus(f.plan.state,'charms'),0,'reading is not the practice: no bonus');
 assert.equal(slice(),undefined,'reading changes no inquiry record');
 assert.deepEqual(domainRegistry.command('inquiry','readNote')({key:theirs}).wroteNow,[],'read again: nothing new');
 // Existing item rules: the note moves like any item, and a reader who no longer holds it cannot read it.
 const moved=stageAcquisition({from:f.plan.gameplay.player.inventory,to:{}},{transfers:[{from:'from',to:'to',key:theirs,count:1}]});
 assert.equal(moved.to[theirs],1);f.plan.gameplay.player.inventory=moved.from;delete f.plan.state.simulation.knowledge.player[CH.key];
 assert.throws(()=>domainRegistry.command('inquiry','readNote')({key:theirs}),/do not hold/);
 assert.throws(()=>domainRegistry.command('inquiry','readNote')({key:JSON.stringify({id:'Stick'})}),/make anything/);
});

test('own finished work upgrades a fact that arrived from a note',()=>{
 const k={k:{stage:'interpreted',value:'v',at:0,cause:'note:x'}};
 const def={id:'t.up',question:'q',method:'read',sources:[],need:{minutes:1,evidence:0},risk:'r',outputs:[{key:'k',stage:'understood',value:'mine'}]};
 const out=stepInquiry(freshInquiries(),{...def,actor:'player',need:def.need,outputs:def.outputs},{effort:{minutes:1,evidence:0},at:5,knowledge:k});
 assert.deepEqual(out.effects,['k']);assert.equal(k.k.stage,'understood');assert.equal(k.k.cause,'inquiry:t.up');
});

test('Klein\'s papers inquiry starts and completes at domain level, only at the reading room, with public authored text',()=>{
 const state={clock:0,actors:{player:{worldId:LOTM_IDS.world}},simulation:{people:{player:{location:LOTM_LOCATIONS.workroom}},knowledge:{},jobs:[]}};
 const f={plan:{state,gameplay:{player:{inventory:{}}}}};domainRegistry.initialize();domainRegistry.load({});wire(f);
 let q=lotmLibraryQuote();assert.equal(q.eligible,false);assert.match(q.reason,/university area/);assert.throws(lotmLibraryStudy,/university area/);
 state.simulation.people.player.location=LOTM_LOCATIONS.university;
 q=lotmLibraryQuote();assert.equal(q.eligible,true);assert.equal(q.minutes,60);assert.equal(q.done,false);
 let r=lotmLibraryStudy();assert.equal(r.done,false);assert.match(r.partial,/60 of 120 minutes worked, 1 of 2/);
 r=lotmLibraryStudy();assert.equal(r.done,true);assert.deepEqual(r.wroteNow,[LOTM_LIBRARY_KEY]);
 assert.equal(f.plan.state.clock,120);assert.equal(f.plan.state.simulation.knowledge.player[LOTM_LIBRARY_KEY].cause,'inquiry:'+LOTM_LIBRARY_INQUIRY);
 assert.match(r.partial,/Tingen papers/);assert.equal(lotmLibraryQuote().eligible,false);assert.throws(lotmLibraryStudy,/already worked this out/);
 assert.equal(slice().records[LOTM_LIBRARY_INQUIRY].wrote.length,1);
 f.plan.state.simulation.jobs=[{commandId:'x'}];domainRegistry.load({});
 assert.match(lotmLibraryQuote().reason,/Finish what you are doing/);
});

test('saves: an untouched life writes no key, a junk slice loads fresh, and a finished study persists',()=>{
 const f=fresh(sorted());at(f,MON,12*60);
 assert.equal(slice(),undefined);study(CH.inquiry);
 const env=JSON.parse(JSON.stringify(domainRegistry.save({})));assert.equal(env.inquiry.records[CH.inquiry].effort.minutes,60);
 domainRegistry.load({inquiry:'junk'});assert.equal(slice(),undefined);
 domainRegistry.validate(env);domainRegistry.load(env);assert.equal(slice().records[CH.inquiry].effort.minutes,60);
});
