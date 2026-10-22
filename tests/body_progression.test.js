import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState,loadExpansionState,advanceSimulation,inspectCapabilities,evaluateAction,createContentRegistry} from "../src/expansion_engine.js";
import {initializeExpedition,expeditionRegistry,SURVEY_KIT_KEY} from "../src/expedition_content.js";
import {commitSimulationCommand,cancelSimulationJob} from "../src/simulation.js";
import {beginBodyRecord,bodyFacts,NATURAL_BALANCE,CONDITIONED_GRIP,PALM_MARK,SORE_HANDS,SCRAPED_HANDS} from "../src/body_progression.js";
import {characterBioView} from "../src/character_bio.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {knownPeopleView} from "../src/people_knowledge.js";

const wood=JSON.stringify({id:"Rough wood log"});
const actor=inventory=>({inventory,skills:{Climbing:{xp:0,enabled:true,parent:null},Perception:{xp:0,enabled:true,parent:null}},reputation:{Village:0,Town:0}});
const fresh=()=>({state:initializeExpedition(createExpansionState(17)),external:{money:20},gameplay:{player:actor({[wood]:5}),oldCraftsman:actor({})},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}});
const context=(p,extra={})=>({actorId:"player",worldId:"base.frontier",external:p.external,gameplay:p.gameplay,vitals:p.vitals,
    facts:{location:"Village","village.elderMet":true,"village.craftsmanMet":true,"village.shackUnlocked":true,agility:8,strength:0,...bodyFacts(p.state),...extra}});
const begin=()=>{const p=fresh();return beginBodyRecord(p.state,expeditionRegistry,context(p));};
const command=(p,id,facts={})=>commitSimulationCommand(p.state,expeditionRegistry,{id},context(p,facts));
const advance=(p,minutes)=>({...advanceSimulation(p.state,expeditionRegistry,minutes,p.external,p.gameplay,{player:{vitals:p.vitals.player}}),vitals:structuredClone(p.vitals)});
const finish=p=>advance(p,p.state.simulation.jobs.find(j=>j.actorId==="player").due-p.state.clock);
const reload=p=>({...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry)});
const bio=p=>characterBioView({state:p.state,registry:expeditionRegistry,context:context(p)});
const sight=(p,id)=>commitSimulationCommand(p.state,expeditionRegistry,{id,targetId:"oldCraftsman"},{...context(p),targetId:"oldCraftsman"});

test("old saves remain unenrolled with unchanged legacy origins and no body rewards",()=>{
    const p=fresh(),old=structuredClone(p.state);old.actors.player.sources["frontier.field_eye"]={acquiredAt:0,expiresAt:null,receiptId:"event:1",revision:1};
    const before=structuredClone(old),loaded=initializeExpedition(loadExpansionState(old,expeditionRegistry));
    assert.deepEqual(old,before);assert.equal(loaded.actors.player.facts["body.enrolled"],false);assert.equal(loaded.simulation,null);
    assert.deepEqual(loaded.actors.player.sources,before.actors.player.sources);assert.equal(loaded.actors.player.sources[NATURAL_BALANCE],undefined);
});

test("an innate trait stays latent until its saved discovery, without invented ancestry or NPC knowledge",()=>{
    let p=begin();assert.equal(p.state.actors.player.sources[NATURAL_BALANCE].origin,"inherited");
    assert.deepEqual(bio(p).heritage,[]);assert.equal(inspectCapabilities(p.state,expeditionRegistry,context(p))["frontier.preparation"].value,0);
    p=command(p,"body.study_balance");const due=p.state.simulation.jobs[0].due;p=reload(p);assert.equal(p.state.simulation.jobs[0].due,due);p=finish(p);
    assert.equal(bio(p).heritage[0].id,NATURAL_BALANCE);assert.match(bio(p).heritage[0].cause,/ancestry uncertain/);
    assert.equal(inspectCapabilities(p.state,expeditionRegistry,context(p))["frontier.preparation"].value,1);
    assert.equal(p.state.simulation.knowledge.oldCraftsman,undefined);assert.throws(()=>command(p,"body.study_balance"));
});

test("drills spend actual stamina and teach native XP; recovery keeps two drills and one trained grip",()=>{
    let p=begin();const before=structuredClone(p);p=command(p,"body.grip_drill");assert.equal(p.vitals.player.stamina,38);
    const cancelled=cancelSimulationJob(p.state,expeditionRegistry,p.state.simulation.jobs[0].id,context(p));
    assert.equal(cancelled.vitals.player.stamina,38);assert.equal(cancelled.state.actors.player.resources.grip_practice,undefined);
    assert.equal(cancelled.gameplay.player.skills.Climbing.xp,0);assert.equal(before.vitals.player.stamina,40);
    p=finish(command(cancelled,"body.grip_drill"));assert.equal(p.gameplay.player.skills.Climbing.xp,6);
    assert.ok(p.state.simulation.conditions.player[SORE_HANDS]);assert.throws(()=>command(p,"body.grip_drill"));
    p=finish(command(reload(p),"body.recover"));assert.equal(bodyFacts(p.state)["body.handsTender"],false);
    p=finish(command(p,"body.grip_drill"));p=advance(reload(p),12);assert.equal(bodyFacts(p.state)["body.handsTender"],false);
    p=command(p,"body.condition_grip");assert.equal(p.gameplay.player.skills.Climbing.xp,12);
    assert.equal(p.state.actors.player.resources.grip_practice,2);assert.equal(p.state.actors.player.sources[CONDITIONED_GRIP].origin,"trained");
    assert.equal(p.state.simulation.people.player.body["palms.callused"],true);
    assert.equal(inspectCapabilities(p.state,expeditionRegistry,context(p))["frontier.carry"].value,1);
    assert.equal(inspectCapabilities(p.state,expeditionRegistry,context(p))["body.hand_control"].value,1);
    p.state.actors.player.facts["town.joined"]=true;p.state.actors.player.facts["town.briefed"]=true;
    assert.equal(evaluateAction(p.state,expeditionRegistry,"town.timber",context(p,{strength:20})).duration,2);
    assert.throws(()=>command(p,"body.condition_grip"));assert.throws(()=>command(p,"body.grip_drill"));
});

test("rough kit cancellation refunds real inputs; completion leaves a temporary scrape and acquired mark",()=>{
    let p=command(begin(),"body.rough_kit");assert.equal(p.external.money,19);assert.equal(p.gameplay.player.inventory[wood],4);
    p=cancelSimulationJob(p.state,expeditionRegistry,p.state.simulation.jobs[0].id,context(p));assert.equal(p.external.money,20);assert.equal(p.gameplay.player.inventory[wood],5);
    assert.equal(p.state.actors.player.sources[PALM_MARK],undefined);
    p=finish(command(p,"body.rough_kit"));assert.equal(p.gameplay.player.inventory[SURVEY_KIT_KEY],1);assert.equal(p.vitals.player.health,60);
    assert.equal(p.state.actors.player.sources[PALM_MARK].origin,"acquired");assert.equal(bio(p).learned.find(r=>r.id===PALM_MARK).label,"Palm scrape");
    assert.equal(bio(p).conditions.find(r=>r.id===SCRAPED_HANDS).cause,"20 game min remaining");
    p=advance(reload(p),20);assert.equal(bio(p).conditions.length,0);assert.equal(bio(p).learned.find(r=>r.id===PALM_MARK).label,"Faint palm scar");
    assert.equal(p.gameplay.player.inventory[SURVEY_KIT_KEY],1);assert.throws(()=>command(p,"body.rough_kit"));
});

test("condition recovery in batches or reloaded ticks agrees and never erases acquired body evidence",()=>{
    const p=finish(command(begin(),"body.rough_kit")),batch=advance(p,20);let ticks=reload(p);
    for(let i=0;i<20;i++)ticks=advance(reload(ticks),1);
    assert.deepEqual(ticks.state,batch.state);assert.deepEqual(ticks.gameplay,batch.gameplay);
    const rested=finish(command(reload(p),"body.recover"));assert.equal(bodyFacts(rested.state)["body.handsTender"],false);
    assert.equal(rested.state.simulation.people.player.body["palms.marked"],true);assert.equal(rested.state.actors.player.sources[PALM_MARK].origin,"acquired");
});

test("craftsman recognition records only demonstrated visible evidence and cannot farm familiarity",()=>{
    let p=finish(command(begin(),"body.study_balance"));assert.equal(p.state.simulation.knowledge.oldCraftsman,undefined);
    p=sight(p,"body.show_footing");const observed=p.state.simulation.knowledge.oldCraftsman;
    assert.deepEqual(Object.keys(observed),["person.player.steady_footing"]);assert.doesNotMatch(JSON.stringify(observed),/Natural balance|inherited|body.natural_balance/);
    const record=knownPeopleView(p.state,context(p).facts).find(r=>r.id === "oldCraftsman");
    assert.ok(record.memories.some(m=>m.text.includes("steady steps")));assert.doesNotMatch(JSON.stringify(record),/Natural balance|inherited/);
    assert.equal(p.state.simulation.relationships.oldCraftsman.player.axes.familiarity,1);
    assert.throws(()=>sight(reload(p),"body.show_footing"));assert.throws(()=>sight(p,"body.show_mark"));
    p=finish(command(p,"body.rough_kit"));const remote=()=>commitSimulationCommand(p.state,expeditionRegistry,{id:"body.show_mark",targetId:"oldCraftsman"},{...context(p,{location:"Shack"}),targetId:"oldCraftsman"});assert.throws(remote,/Village|location/);
    p=sight(p,"body.show_mark");assert.ok(p.state.simulation.knowledge.oldCraftsman["person.player.palm_mark"]);
    assert.equal(p.gameplay.player.reputation.Village,0);assert.equal(p.state.simulation.relationships.oldCraftsman.player.axes.familiarity,2);
    assert.throws(()=>sight(reload(p),"body.show_mark"));
});

test("tender hands add actual work time while legacy packing reduction and vanilla timing remain intact",()=>{
    let p=begin();p.state.campaign.facts.anchor=true;
    assert.equal(evaluateAction(p.state,expeditionRegistry,"frontier.pack",context(p,{kits:0})).duration,4);
    p=finish(command(p,"body.grip_drill"));assert.equal(evaluateAction(p.state,expeditionRegistry,"frontier.pack",context(p,{kits:0})).duration,6);
    p.state.actors.player.sources["village.packing_lesson"]={acquiredAt:0,expiresAt:null,receiptId:"lesson:1",revision:1};
    assert.equal(evaluateAction(p.state,expeditionRegistry,"frontier.pack",context(p,{kits:0})).duration,4);
    p.state.actors.player.facts["town.joined"]=true;p.state.actors.player.facts["town.briefed"]=true;
    assert.equal(evaluateAction(p.state,expeditionRegistry,"town.timber",context(p)).duration,5);
    p=finish(command(p,"body.recover"));assert.equal(evaluateAction(p.state,expeditionRegistry,"frontier.pack",context(p,{kits:0})).duration,2);
    assert.equal(evaluateAction(p.state,expeditionRegistry,"town.timber",context(p)).duration,3);
});

test("failed body enrollment publication retains exact old bytes with no partial services or hidden gift",()=>{
    const p=fresh(),before=structuredClone(p),out=beginBodyRecord(p.state,expeditionRegistry,context(p));
    const envelope={character:{money:20,bio:{race:"human",age:"adult"},reputation:{Village:0,Town:0}},expansion:p.state,
        quests:{"Lost memory":{is_active:true}},inventories:{person:{main_character:{[wood]:{count:5}},oldCraftsman:{}}},
        levels:{person:{main_character:{skill_xp:{Climbing:0,Perception:0}},oldCraftsman:{skill_xp:{Climbing:0,Perception:0}}}}};
    const bytes=JSON.stringify(envelope);let saved=bytes;
    const opts={key:"generated",createSave:()=>bytes,bindings:{player:{category:"person",id:"main_character"},oldCraftsman:{category:"person",id:"oldCraftsman"}}};
    assert.throws(()=>persistExpansionPlan(out,{...opts,storage:{setItem(){throw new Error("quota");}}}),/quota/);
    assert.equal(saved,bytes);assert.deepEqual(p,before);
    persistExpansionPlan(out,{...opts,storage:{setItem(key,value){saved=value;}}});
    const loaded=JSON.parse(saved);assert.deepEqual(loaded.character.bio,envelope.character.bio);assert.deepEqual(loaded.quests,envelope.quests);
    assert.equal(loaded.expansion.actors.player.sources[NATURAL_BALANCE].origin,"inherited");assert.equal(loaded.expansion.chronicle,null);
});

test("unsupported trait origins fail definition validation rather than being guessed",()=>{
    assert.throws(()=>createContentRegistry({worlds:[{id:"base.frontier",label:"Base"}],sources:[{id:"gift",label:"Gift",revision:1,kind:"trait",origin:"guessed",grants:[]}]}),/source origin/);
});

// E4: a trained faculty acts through the current body; the lesson stays with the person.
import {COLD_HARDENED,bodyFacultyActive} from "../src/body_progression.js";
import {exposureEffects,stageExposure,createExposure} from "../src/absorb_p23/exposure/exposure.js";
test("weathered skin changes a storm gust only on the body that earned it; knowledge survives a body change",()=>{
    let p=begin();p.gameplay.player.skills["Cold resistance"]={xp:0,enabled:true,parent:null};
    for(let i=0;i<3;i++){p=command(p,"body.cold_soak");p=reload(p);p=finish(p);}
    assert.equal(p.state.actors.player.resources.cold_practice,3);assert.equal(p.gameplay.player.skills["Cold resistance"].xp,6);
    p=command(p,"body.harden_cold");p=reload(p);
    const own={id:p.state.simulation.people.player.body?.id||"native.player.body",form:"human",ownerId:"player",controllerId:"player"};
    assert.ok(own.id,"enrolled body record exists");assert.equal(bodyFacultyActive(p.state,COLD_HARDENED,own),true);
    assert.equal(p.state.simulation.knowledge.player["body.cold"].stage,"understood");assert.throws(()=>command(p,"body.harden_cold"));
    const gust={...createExposure(),hazardousEnabled:true,phase:"gust",remaining:6};
    const ctx=c=>({played:true,homeWorld:true,exposureEligible:true,outdoors:true,sheltered:false,pacing:{weatherEnabled:true,hungerEnabled:false},coldHardened:c});
    assert.equal(exposureEffects(gust,ctx(false)).temperatureOffset,-3);assert.equal(exposureEffects(gust,ctx(true)).temperatureOffset,-1);
    assert.equal(stageExposure(gust,{start:0,end:6},ctx(true)).staminaCost*2,stageExposure(gust,{start:0,end:6},ctx(false)).staminaCost);
    const other={...own,id:"native.borrowed.body"};
    assert.equal(bodyFacultyActive(p.state,COLD_HARDENED,other),false,"another body lacks the faculty");
    assert.equal(p.state.simulation.knowledge.player["body.cold"].stage,"understood","the lesson is unchanged");
    assert.equal(bodyFacultyActive(p.state,COLD_HARDENED,own),true,"returning to the earning body restores it");
    assert.equal(bodyFacultyActive(begin().state,COLD_HARDENED,own),false,"untrained bodies are unaffected");
});
