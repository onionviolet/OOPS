import test from 'node:test';
import assert from 'node:assert/strict';
import hpPack from '../src/world_packs/book_hp_pack.js';
import {BUNDLED_WORLD_PACKS, installedWorldPack, loadBundledWorldPacks} from '../src/world_pack_registry.js';
import {authorReport, loadWorldPacks} from '../src/world_pack_loader.js';

const native = hpPack.native, STATUS = ['shown', 'stated', 'inferred'];
const evidence = new Map(native.evidence.map(e => [e.id, e]));

test('the Harry Potter pack is bundled, loads clean and is plain integer data (WA21, IS2)', () => {
    assert.ok(BUNDLED_WORLD_PACKS.includes(hpPack));
    const registry = loadBundledWorldPacks();
    assert.equal(registry.dormantPacks.size, 0, authorReport(registry));
    assert.deepEqual(registry.diagnostics.filter(d => d.packId === 'book.hp'), []);
    assert.deepEqual(JSON.parse(JSON.stringify(hpPack)), hpPack);
    assert.equal(installedWorldPack('book.hp').pack.attribution.source.includes('J.K. Rowling'), true);
});

test('every evidence row has a label, a page locator and a short paraphrase, never source text (MR13)', () => {
    assert.equal(evidence.size, native.evidence.length, 'unique evidence IDs');
    for(const e of native.evidence) {
        assert.ok(STATUS.includes(e.status), e.id);
        assert.match(e.locator, /^B[12]:PDF-p\d+/, e.id);
        assert.ok(e.speaker && e.note.length > 0 && e.note.length <= 200, `${e.id} paraphrase is short`);
        assert.ok(!/["“”]/.test(e.note), `${e.id} has no quotation marks`);
    }
});

test('the pinned formula cites evidence for every slot, and canon ingredients keep their canon labels', () => {
    const ids = new Map(native.ingredients.map(i => [i.id, i]));
    for(const slot of native.formula.slots) {
        assert.ok(ids.has(slot.ingredient), slot.id);
        assert.ok(slot.evidence.length > 0, slot.id);
        for(const id of slot.evidence) assert.ok(evidence.has(id), `${slot.id} cites ${id}`);
    }
    assert.deepEqual(native.formula.slots.map(s => s.id), ['lacewing', 'leeches', 'fluxweed', 'knotgrass', 'bicorn', 'boomslang']);
    assert.equal(native.formula.sample.added, 'last');
    assert.equal(evidence.get('book.hp.ev.fluxweed_moon').status, 'stated');
    assert.equal(native.formula.slots[0].minStewMinutes, 21 * 1440, 'twenty-one days is the stated requirement');
    assert.equal(native.formula.transformMinutes, 60);
    // Each ingredient route names its owner and access rule; bicorn and skin are never in the student store (stated).
    const student = native.routes.find(r => r.kind === 'store');
    assert.ok(!('book.hp.ing.bicorn_horn' in student.cost) && !('book.hp.ing.boomslang_skin' in student.cost));
});

test('every rule not stated by the novel is labelled original, and no sealed secret is authored here (HP-SEAL-1)', () => {
    assert.ok(native.originals.length >= 8 && native.originals.every(o => o.status === 'original' && o.reason));
    assert.equal(native.outcomes.canon.status, 'stated');
    assert.equal(native.outcomes.degraded.status, 'original');
    assert.equal(native.outcomes.original.status, 'original');
    assert.equal(hpPack.content.secrets, undefined);
    for(const u of native.unknowns) assert.match(u.id, /^book\.hp\.unknown\./);
});

test('catalog index matches the formula ingredients and all IDs sit in the pack namespace', () => {
    const cat = new Set(hpPack.content.catalog.map(c => c.id));
    for(const i of native.ingredients.filter(i => native.formula.slots.some(s => s.ingredient === i.id) || i.id.endsWith('bicorn_horn')))
        assert.ok(cat.has(i.id.replace('.ing.', '.cat.')), i.id);
    for(const family of [native.evidence, native.ingredients, native.variants, native.routes, hpPack.content.catalog])
        for(const r of family) assert.ok(r.id.startsWith('book.hp.'), r.id);
});

test('a duplicate of the pack does not load twice and an HP pack edit changes the fingerprint (WA10)', () => {
    const twice = loadWorldPacks([hpPack, structuredClone(hpPack)]);
    assert.equal(twice.packs.has('book.hp'), false);
    const edited = structuredClone(hpPack); edited.native.rules.brewMinutes += 1;
    const a = loadWorldPacks([hpPack]).packs.get('book.hp').fingerprint, b = loadWorldPacks([edited]).packs.get('book.hp').fingerprint;
    assert.notEqual(a, b);
});

// Playable life goes through the same compiler and durable selection as other native starts.
import {createHash} from 'node:crypto';
import {createHpLifeContent} from '../src/book_world_hp_content.js';
import {createContentRegistry,createExpansionState,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {requireStructuredContent} from '../src/structured_pack_state.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
function hpSetup(profile='school'){
 const raw=createHpLifeContent(profile),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),compiled=compileStructuredPack(raw,registry);
 mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
 const state=createExpansionState(123),context={registry,actorId:'player',worldId:'base.frontier',external:{money:42},gameplay:{player:{inventory:{},skills:{Literacy:{enabled:true,xp:0}},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult'},facts:{location:'Village'},busy:false};
 const selection=planStructuredSelection(state,d,context),begun=beginStructuredCampaign(selection.plan.state,d,context,null,selection.selection);
 const ctx=plan=>({...context,worldId:d.world.id,gameplay:plan.gameplay,external:plan.external,vitals:plan.vitals,structuredNative:{...begun.record,bound:true},facts:{location:plan.state.simulation.people.player.location}});
 return {d,registry,state,context,selection,...begun,ctx};
}
test('HP admission is inert until durable opt-in, supplies a real local body and preserves old saves',()=>{
 const f=hpSetup(),P=f.d.id;
 assert.equal(f.state.actors.player.worldId,'base.frontier');assert.equal(f.selection.plan.state.actors.player.worldId,'base.frontier');
 assert.equal(f.plan.state.simulation.people.player.body.lifeStage,'child');
 assert.equal(f.plan.gameplay.player.inventory[JSON.stringify({id:P+'.wand'})],1);
 assert.equal(f.plan.state.actors.player.resources[P+'.debt'],4);
 assert.equal(f.plan.external.money,42,'no mint or conversion of native money');
 assert.throws(()=>beginStructuredCampaign(f.plan.state,f.d,f.context,f.record),/selection|initialized|unoccupied/);
 const old=JSON.parse(JSON.stringify(f.state));assert.deepEqual(loadExpansionState(old,f.registry),f.state);
 const saved=JSON.parse(JSON.stringify(f.plan.state));assert.deepEqual(loadExpansionState(saved,f.registry),f.plan.state);
 requireStructuredContent(JSON.parse(JSON.stringify(f.record)),new Map([[P,f.d]]));
});
import {hpSchoolCalendar} from '../src/book_world_hp_facts.js';
const hpAct=(f,plan,name)=>commitSimulationCommand(plan.state,f.registry,{id:f.d.id+'.'+name},{...f.ctx(plan),targetId:f.registry.simulation.commands.get(f.d.id+'.'+name)?.targetId});
const hpAdvance=(f,plan,n)=>{const context=f.ctx(plan),out=advanceSimulation(plan.state,f.registry,n,plan.external,plan.gameplay,{player:{...context,vitals:context.vitals.player}});out.vitals=structuredClone(plan.vitals);if(out.native?.staminaToFull!=null)out.vitals.player.stamina=out.vitals.player.max_stamina-out.native.staminaToFull;return out;};
test('school timetable admits actual teaching, refuses closed windows, cancellation refunds and native Literacy settles once',()=>{
 const f=hpSetup(),P=f.d.id;
 const started=hpAct(f,f.plan,'lesson_charms');assert.equal(started.state.simulation.jobs.length,1);
 assert.equal(started.gameplay.player.inventory[JSON.stringify({id:P+'.paper'})],5);
 const cancelled=cancelSimulationJob(started.state,f.registry,started.commitment.id,f.ctx(started));
 assert.equal(cancelled.gameplay.player.inventory[JSON.stringify({id:P+'.paper'})],6);
 assert.equal(cancelled.state.simulation.powers.player?.[P+'.levitation'],undefined);
 const done=hpAdvance(f,hpAct(f,cancelled,'lesson_charms'),30);
 assert.equal(done.state.simulation.powers.player[P+'.levitation'].owned,true);
 assert.equal(done.gameplay.player.skills.Literacy.xp,5);
 assert.throws(()=>hpAct(f,done,'lesson_charms'));
 assert.throws(()=>hpAct(f,done,'lesson_plants'));
 const afternoon=hpAdvance(f,done,210);assert.equal(hpSchoolCalendar(afternoon.state).plants,true);
 const plantDone=hpAdvance(f,hpAct(f,afternoon,'lesson_plants'),30);assert.equal(plantDone.gameplay.player.skills.Literacy.xp,10);
 for(const minute of [100,5*1440,70*1440]){const plan=structuredClone(f.plan);plan.state.clock=minute;assert.throws(()=>hpAct(f,plan,'lesson_charms'));}
 const changed=structuredClone(started);changed.state.simulation.people[P+'.tutor'].location=P+'.elsewhere';
 const refused=hpAdvance(f,changed,30);assert.equal(refused.state.simulation.powers.player?.[P+'.levitation'],undefined);assert.equal(refused.gameplay.player.inventory[JSON.stringify({id:P+'.paper'})],6);
});
test('descriptor methods require faculty, taught mastery, actual tool and target; borrowed tool has conserved custody',()=>{
 const f=hpSetup(),P=f.d.id,K=n=>JSON.stringify({id:P+'.'+n});
 let plan=hpAdvance(f,hpAct(f,f.plan,'lesson_charms'),30);
 assert.throws(()=>hpAct(f,plan,'cast_levitation'),/Practice|mastery|support/);
 plan=hpAdvance(f,hpAct(f,plan,'practice_levitation'),3);
 const noWand=structuredClone(plan);delete noWand.gameplay.player.inventory[K('wand')];assert.throws(()=>hpAct(f,noWand,'cast_levitation'));
 const noFaculty=structuredClone(plan);noFaculty.state.simulation.faculties.player[P+'.magic'].suppressed=true;assert.throws(()=>hpAct(f,noFaculty,'cast_levitation'));
 const noHand=structuredClone(plan);noHand.state.simulation.people.player.body.hands=0;assert.throws(()=>hpAct(f,noHand,'cast_levitation'));
 plan=hpAct(f,plan,'borrow_wand');assert.equal(plan.gameplay.player.inventory[K('wand')]||0,0);assert.equal(plan.gameplay.player.inventory[K('practice_wand')],1);
 assert.throws(()=>hpAct(f,plan,'borrow_wand'));
 plan=hpAct(f,plan,'cast_levitation');assert.equal(plan.gameplay.player.inventory[K('feather')],2);assert.equal(plan.gameplay.player.inventory[K('raised_feather')],1);
 plan=hpAct(f,plan,'retrieve_feather');assert.equal(plan.gameplay.player.inventory[K('feather')],3);
 plan=hpAct(f,plan,'return_wand');assert.equal(plan.gameplay.player.inventory[K('wand')],1);assert.equal(plan.gameplay.player.inventory[K('practice_wand')]||0,0);
 plan=hpAdvance(f,hpAct(f,plan,'lesson_repair'),30);plan=hpAdvance(f,hpAct(f,plan,'practice_repair_glass'),3);plan=hpAct(f,plan,'cast_repair_glass');assert.equal(plan.gameplay.player.inventory[K('glass_shards')],2);assert.equal(plan.gameplay.player.inventory[K('glass_pane')],1);
 const saved=JSON.parse(JSON.stringify(plan.state));assert.deepEqual(loadExpansionState(saved,f.registry),plan.state);
});

test('adult trade owns distinct means and access, conserves material and cash through repair, travel, sales and debt',()=>{
 const f=hpSetup('trade'),P=f.d.id,K=n=>JSON.stringify({id:P+'.'+n});let plan=f.plan;
 assert.equal(plan.state.simulation.people.player.body.lifeStage,'adult');assert.equal(plan.state.actors.player.resources[P+'.debt'],6);
 assert.equal(plan.state.actors.player.facts['book.hp.school.student'],undefined);
 assert.equal(f.registry.simulation.commands.has(P+'.lesson_charms'),false);
 const totals=p=>{const inv=p.gameplay.player.inventory,stock=p.state.simulation.owners[P+'.merchant'];return {coins:p.state.actors.player.resources[P+'.coins']+p.state.actors[P+'.merchant'].resources[P+'.coins'],glass:[inv,stock].reduce((n,v)=>n+(v[K('glass_shards')]||0)+(v[K('glass_pane')]||0),0)};};
 const before=totals(plan);assert.deepEqual(before,{coins:32,glass:8});
 assert.throws(()=>hpAct(f,plan,'deliver'));
 const job=hpAct(f,plan,'repair');assert.equal(totals(job).glass,7,'one fragment set is reserved in the job');
 const cancelled=cancelSimulationJob(job.state,f.registry,job.commitment.id,f.ctx(job));assert.deepEqual(totals(cancelled),before);
 plan=hpAdvance(f,hpAct(f,cancelled,'repair'),10);assert.deepEqual(totals(plan),before);
 const walk=hpAct(f,plan,'walk_shop');assert.equal(walk.state.simulation.people.player.location,P+'.workshop');
 plan=hpAdvance(f,walk,5);assert.equal(plan.nativeLocation,P+'.shop');
 plan=hpAct(f,plan,'deliver');plan=hpAct(f,plan,'buy_fragments');plan=hpAct(f,plan,'repay');assert.deepEqual(totals(plan),before);
 assert.equal(plan.state.actors.player.resources[P+'.debt'],0);assert.equal(plan.state.actors.player.resources[P+'.coins'],8);
 assert.throws(()=>hpAct(f,plan,'repay'));
 assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(plan.state)),f.registry),plan.state);
 const broke=structuredClone(plan);broke.state.actors[P+'.merchant'].resources[P+'.coins']=0;
 // No actual pane and no till means a new sale cannot fabricate either.
 assert.throws(()=>hpAct(f,broke,'deliver'));
});
import {resolveWorldCalendar} from '../src/world_calendar.js';
test('school and trade expose an elapsed local calendar without the Frontier civil year',()=>{
 for(const profile of ['school','trade']){const f=hpSetup(profile),clock=resolveWorldCalendar(f.plan.state,{year:999,month:4,day:1,hour:8,minute:0,day_count:1});assert.equal(clock.year,1);assert.equal(clock.hour,9);assert.equal(clock.format,'elapsed');assert.equal(clock.seasonId,null);assert.equal(clock.instanceId,f.record.instanceId);}
 const f=hpSetup(),state=structuredClone(f.plan.state);state.clock=15*60;const c=hpSchoolCalendar(state);assert.equal(c.day,2);assert.equal(c.hour,0);assert.equal(c.charms,false);
});
