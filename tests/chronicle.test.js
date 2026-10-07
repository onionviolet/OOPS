import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, loadExpansionState, validateExpansionState, commitAction, advanceSimulation, inspectCapabilities} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition} from "../src/expedition_content.js";
import {commandChronicle, relationshipChange, ageYears, GAME_YEAR, chronicleFacts, automaticResponse, validateChronicleCalendar} from "../src/chronicle.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {Game_Time} from "../src/game_time.js";
import {applyTechniqueEffect} from "../src/techniques.js";
import {RAT_STEP, RAT_ENEMY} from "../src/technique_content.js";

const calendar = {year: 999, month: 4, day: 1, hour: 8, minute: 0, day_count: 1};
const gameplay = () => ({player: {inventory: {}, skills: {}, reputation: {Village: 0}}});
const ctx = extra => ({location: "Village", calendar, money: 100, stamina: 200, manualKey: JSON.stringify({id: "Old combat manual"}),
    witness: true, ratStep: false, hero: {strength: 10, agility: 8, defense: 0, attackPower: 20, maxStamina: 200, staminaMultiplier: 1, strikeMultiplier: 1}, ...extra});
const fresh = mode => commandChronicle(initializeExpedition(createExpansionState(7)), {type: "enroll", mode: mode || "open"}, ctx()).state;
const advance = (s, m, g = gameplay()) => advanceSimulation(s, expeditionRegistry, m, {money: 100}, g);
const command = (s, type, fields = {}, context = ctx()) => commandChronicle(s, {type, ...fields}, context);

test("schema3 migration preserves frozen jobs and has no retroactive age, favors or events", () => {
    const old = initializeExpedition(createExpansionState(3)); old.schema = 3; delete old.chronicle;
    const original = structuredClone(old), migrated = loadExpansionState(old, expeditionRegistry);
    assert.equal(migrated.schema, 5); assert.equal(migrated.chronicle, null);
    assert.deepEqual(migrated.pending, old.pending); assert.equal(migrated.rng, old.rng); assert.deepEqual(old, original);
    assert.throws(() => loadExpansionState({...migrated, schema: 6}, expeditionRegistry), /compatible/);
});

test("calendar crosses exact months/years and long jumps without zero dates", () => {
    const t = new Game_Time({year: 999, month: 12, day: 30, hour: 23, minute: 59, day_count: 360});
    t.goUp(1); assert.deepEqual([t.year,t.month,t.day,t.hour,t.minute], [1000,1,1,0,0]);
    t.goUp(GAME_YEAR * 3); assert.deepEqual([t.year,t.month,t.day], [1003,1,1]);
    const a = new Game_Time(calendar), b = new Game_Time(calendar);
    a.goUp(60 * 24 * 60); for(let i=0;i<60;i++) b.goUp(24 * 60);
    assert.equal(a.toString(), b.toString()); assert.equal(a.day_count,b.day_count);
    assert.equal(new Game_Time({...calendar,month:12,day:30}).getSeason(1), "Spring");
});

test("time batches and reload preserve missed events; reports grant information rather than missed rewards", () => {
    const s = fresh(), before = structuredClone(s);
    const jumped = advance(s, 200).state;
    let stepped = s; for(let i=0;i<200;i++) stepped = advance(stepped, 1).state;
    assert.deepEqual(jumped, stepped); assert.deepEqual(s,before);
    const heard = command(loadExpansionState(jumped,expeditionRegistry), "hear").state;
    assert.equal(heard.chronicle.events.inheritance.status,"missed");
    assert.ok(heard.chronicle.log.some(m=>m.text.includes("another traveler in Village")));
    assert.equal(heard.chronicle.knowledge.routeSignals, undefined);
    assert.throws(()=>command(heard,"hear"),/No new report/);
    assert.throws(()=>command(heard,"inherit"),/promise/);
});

test("one cartographer lesson changes an existing capability, without draws on inspection", () => {
    const s=advance(fresh(),10).state, rng=s.rng;
    const taught=command(s,"attend").state;
    const context={actorId:"player",worldId:"base.frontier",external:{money:100},gameplay:gameplay(),facts:{location:"Village",strength:5,climbing:0,...chronicleFacts(taught.chronicle)}};
    assert.equal(inspectCapabilities(taught,expeditionRegistry,context)["frontier.preparation"].value,1);
    assert.equal(taught.rng,rng);assert.throws(()=>command(taught,"attend"),/not currently open/);
});

test("a kept promise qualifies for a real manual bequest without requiring a combat path", () => {
    let s=command(fresh(),"pledge").state;
    const context={actorId:"player",worldId:"base.frontier",external:{money:100},gameplay:gameplay(),facts:{location:"Village",...chronicleFacts(s.chronicle)}};
    const job=commitAction(s,expeditionRegistry,"chronicle.archive_duty",context);
    assert.equal(job.external.money,99);
    const done=advanceSimulation(job.state,expeditionRegistry,5,job.external,job.gameplay);
    assert.equal(done.state.chronicle.relationships.villageElder.ties.dutyKept,true);
    s=advance(done.state,55).state;
    const inherited=command(s,"inherit");
    assert.deepEqual(inherited.effects,[{type:"item",key:ctx().manualKey,amount:1}]);
    assert.equal(inherited.state.chronicle.relationships.villageElder.ties.successor,true);
    assert.throws(()=>command(inherited.state,"inherit"),/not currently open/);
    relationshipChange(inherited.state.chronicle,"villageElder",{id:"future.kinship",axes:{loyalty:2},ties:{kinship:"adopted",patron:"old-house"},text:"Future relation types remain independent."},inherited.state.clock);
    assert.equal(loadExpansionState(inherited.state,expeditionRegistry).chronicle.relationships.villageElder.ties.kinship,"adopted");
});

test("fixed elder can restrain a novice or yield to a stronger native-input build; intent changes aftermath", () => {
    let s=command(fresh(),"start",{intent:"assault"}).state;
    const a=command(s,"respond",{action:"strike"}); assert.equal(a.staminaSpent,6);
    s=command(a.state,"respond",{action:"strike"}).state;
    assert.equal(s.chronicle.session,null);assert.equal(s.chronicle.relationships.villageElder.ties.grievance,true);
    assert.ok(s.chronicle.log.some(m=>m.text.includes("without spilling")));
    assert.throws(()=>command(s,"start",{intent:"spar"}),/Settle/);
    const settled=command(s,"settle");assert.equal(settled.moneyDelta,-3);assert.equal(settled.state.chronicle.relationships.villageElder.ties.grievance,false);
    const strong=ctx({hero:{...ctx().hero,strength:50,agility:40,attackPower:160}});
    let champion=command(fresh(),"start",{intent:"spar"},strong).state;
    champion=command(champion,"respond",{action:"strike"},strong).state;
    assert.equal(champion.chronicle.session,null);
    assert.equal(champion.chronicle.elder.profile.posture,s.chronicle.elder.profile.posture);
    assert.ok(champion.chronicle.log.some(m=>m.text.includes("concession")));
    assert.equal(champion.chronicle.events.debrief.status,"open");
});

test("prepared and manual responses share accounting; partial scenes survive reload and stale commands fail", () => {
    const s=command(fresh(),"start",{intent:"spar"}).state;
    const policy=command(s,"policy",{policy:"guard"}).state;
    assert.equal(automaticResponse(policy.chronicle),"guard");
    const manual=command(policy,"respond",{action:"guard"});
    assert.equal(manual.staminaSpent,4); assert.equal(automaticResponse(manual.state.chronicle),"strike");
    assert.deepEqual(loadExpansionState(manual.state,expeditionRegistry),manual.state);
    assert.throws(()=>commandChronicle(manual.state,{type:"withdraw"},ctx(),s.sequence),/stale/);
    assert.throws(()=>command(manual.state,"respond",{action:"strike"},ctx({stamina:1})),/stamina/);
    assert.throws(()=>command(manual.state,"respond",{action:"rat-step"}),/requirements/);
});

test("debrief and timed lesson use evidence/trust, not a universal favor score", () => {
    let s=command(fresh(),"start",{intent:"spar"}).state;
    s=command(s,"respond",{action:"strike"}).state;
    s=command(s,"withdraw").state;
    s=command(s,"debrief").state;
    assert.equal(s.chronicle.knowledge.controlPattern,true);
    assert.throws(()=>command(s,"lesson"),/not currently open/);
    s=advance(s,5).state;s=command(s,"lesson").state;
    assert.equal(s.chronicle.knowledge.guardLesson,true);
    s=command(s,"start",{intent:"spar"}).state;
    assert.equal(command(s,"respond",{action:"guard"}).staminaSpent,3);
});

test("mortal old-age boundary stops advancement once and an open life does not silently end", () => {
    const mortal=fresh("mortal");const end=(80-18)*GAME_YEAR;
    const ended=advance(mortal,end+1000);
    assert.equal(ended.state.clock,end);assert.equal(ended.remaining,1000);assert.equal(ageYears(ended.state.chronicle),80);
    assert.equal(ended.state.chronicle.life.endedAt,end);
    assert.deepEqual(advance(ended.state,99).state,ended.state);
    assert.throws(()=>command(ended.state,"inspect"),/life has ended/);
    assert.equal(advance(fresh(),end+1000).state.chronicle.life.endedAt,null);
});

test("calendar, stamina and chronicle are written together; failed storage leaves original bytes untouched", () => {
    const s=fresh(), original={character:{money:100,stamina_to_full:0},"current time":calendar,expansion:s,active_effects:{Recovering:{duration:6}}};
    const progressed=advance(s,1).state;
    const plan={state:progressed,external:{money:100},gameplay:{},calendar:{...calendar,minute:1},native:{staminaToFull:6},effectDurations:{Recovering:5}};
    let disk=JSON.stringify(original);
    assert.throws(()=>persistExpansionPlan(plan,{createSave:()=>disk,key:"test",bindings:{},storage:{setItem(){throw Error("quota");}}}),/quota/);
    assert.equal(disk,JSON.stringify(original));
    persistExpansionPlan(plan,{createSave:()=>disk,key:"test",bindings:{},storage:{setItem(k,v){disk=v;}}});
    const saved=JSON.parse(disk);assert.equal(saved["current time"].minute,1);assert.equal(saved.character.stamina_to_full,6);assert.deepEqual(saved.expansion,progressed);
    assert.equal(saved.active_effects.Recovering.duration,5);
    validateChronicleCalendar(progressed.chronicle,progressed.clock,saved["current time"]);
    assert.throws(()=>validateChronicleCalendar(progressed.chronicle,progressed.clock,calendar),/disagree/);
    const bad=structuredClone(s);bad.chronicle.events.cartographer.closesAt=0;
    assert.throws(()=>validateExpansionState(bad),/event instance/);
});

test("repeat withdrawals cannot farm trust and first achievements survive memory pruning",()=>{
    let s=fresh();
    for(let i=0;i<3;i++){s=command(s,"start",{intent:"spar"}).state;s=command(s,"withdraw").state;}
    assert.equal(s.chronicle.relationships.villageElder.axes.trust,0);
    s=command(s,"start",{intent:"spar"}).state;s=command(s,"respond",{action:"guard"}).state;s=command(s,"withdraw").state;
    assert.equal(s.chronicle.relationships.villageElder.axes.trust,1);
    for(let i=0;i<40;i++)relationshipChange(s.chronicle,"villageElder",{id:`routine:${i}`,text:"An unrelated memory."},s.clock);
    s=command(s,"start",{intent:"spar"}).state;s=command(s,"respond",{action:"guard"}).state;s=command(s,"withdraw").state;
    assert.equal(s.chronicle.relationships.villageElder.axes.trust,1);
});

test("earned Rat-step pays less than ordinary movement and shields provide an actual guard benefit",()=>{
    let s=fresh();s.rng=2;
    const options={registry:expeditionRegistry,clock:0,worldId:"base.frontier",receiptId:"fixture.earned"};
    for(const effect of [{operation:"observe",enemyId:RAT_ENEMY,route:"field-observation"},{operation:"understand"},{operation:"practice",amount:6},{operation:"own"}])applyTechniqueEffect(s.actors.player,{...effect,techniqueId:RAT_STEP},options);
    const earned=ctx({ratStep:true,ratStepId:RAT_STEP});
    s=command(s,"start",{intent:"spar"},earned).state;
    assert.equal(s.chronicle.session.cue,"sweep");
    const ordinary=command(s,"respond",{action:"step"},earned), trained=command(s,"respond",{action:"rat-step"},earned);
    assert.ok(trained.staminaSpent<ordinary.staminaSpent);assert.equal(trained.state.chronicle.session.phase,"recovery");
    assert.equal(loadExpansionState(trained.state,expeditionRegistry).actors.player.techniques[RAT_STEP].executions,1);
    const guarded=command(command(fresh(),"start",{intent:"spar"}).state,"respond",{action:"guard"}).state;
    const shield=ctx({hero:{...ctx().hero,blockStrength:20}});
    const equipped=command(command(fresh(),"start",{intent:"spar"},shield).state,"respond",{action:"guard"},shield).state;
    assert.ok(equipped.chronicle.session.heroPosture<guarded.chronicle.session.heroPosture);
});
