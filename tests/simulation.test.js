import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, createContentRegistry, loadExpansionState, advanceSimulation, validateExpansionState, inspectCapabilities, commitAction} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition} from "../src/expedition_content.js";
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand, cancelSimulationJob, setSimulationProgram, pauseSimulationProgram,
    advancePowerProgression, answerSimulationEncounter, withdrawSimulationEncounter, inspectSimulationEvents, respondSimulationEvent, discoverSimulationEvent,
    previewCampaignTransition, commitCampaignTransition, chooseSimulationOrigin, simulationFacts} from "../src/simulation.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {prepareNativeUnlocks} from "../src/native_unlock_transaction.js";
import {prepareNativeEquipment, readNativeEquipment} from "../src/native_equipment_transaction.js";
import {previewPowerModel, resolveEffectAmount} from "../src/power_models.js";
import {inspectActorChoices, acceptActorProposal, resumeSimulationProgram} from "../src/simulation.js";

const wood = JSON.stringify({id: "Rough wood log"}), kit = JSON.stringify({id: "Prepared survey kit"});
const native = () => ({inventory: {[wood]: 10}, skills: {}, reputation: {Village: 0}});
const context = (p, extra = {}) => ({actorId: "player", external: p.external, gameplay: p.gameplay,
    facts: {location: "Village", "village.craftsmanMet": true, "village.shackUnlocked": true}, ...extra});
const begin = () => {const p = {state: initializeExpedition(createExpansionState(17)), external: {money: 30}, gameplay: {player: native(), oldCraftsman: {...native(), inventory: {}}}};
    return enrollSimulation(p.state, expeditionRegistry, context(p));};
const command = (p, id, extra = {}, registry = expeditionRegistry) => commitSimulationCommand(p.state, registry, {id}, context(p, extra));
const advance = (p, n, registry = expeditionRegistry, facts = {}) => advanceSimulation(p.state, registry, n, p.external, p.gameplay, {player: {facts: {"village.shackUnlocked": true, ...facts}}});
const reload = (p, registry = expeditionRegistry) => ({...structuredClone(p), state: loadExpansionState(JSON.parse(JSON.stringify(p.state)), registry)});
const req = (fact, value) => ({fact, op: "eq", value});
const cmd = d => ({revision: 1, label: d.id, costs: [], effects: [], ...d});
function sandbox(overrides = {}) {
    return createContentRegistry({worlds: [{id: "base.frontier"}, {id: "other.world"}], capabilities: [{id: "sight", label: "Sight", stacking: "max", providers: []}],
        sources: [{id: "eye", revision: 1, kind: "bloodline", label: "Eye faculty", grants: [{capability: "sight", amount: 1}]}],
        simulation: {
            people: ["peer", "rival"].map(id => ({id, revision: 1, label: id, worldId: "base.frontier", location: "Village", inventory: "simulation", resources: {fuel: 20},
                vitals: {health: 20, max_health: 20, stamina: 10, max_stamina: 10}, body: {eye: true}})),
            sites: [{id: "bench", revision: 1, label: "Bench", capacity: 1}],
            powers: [{id: "step", revision: 1, label: "Step", model: "practice", capacity: 2, cooldown: 2},
                {id: "copy", revision: 1, label: "Copy", model: "design", capacity: 2, execution: req("faculty.eye.active", true)},
                {id: "hybrid", revision: 1, label: "Hybrid", model: "hybrid", capacity: 3, constituents: ["step", "copy"], combination: "fusion"}],
            conditions: [{id: "toxin", revision: 1, label: "Fictional toxin", stacking: "sum", immunity: req("body.immune", true)}],
            commands: [
                cmd({id: "learn", effects: [{type: "power", powerId: "step", operation: "learn"}]}),
                cmd({id: "work", duration: 2, siteId: "bench", automatable: true, cancellation: "refund", costs: [{type: "resource", key: "fuel", amount: -2}], effects: [{type: "resource", key: "output", amount: 1}]}),
                cmd({id: "unique", claim: "one.relic", duration: 2, effects: [{type: "resource", key: "relic", amount: 1}]}),
                cmd({id: "grant", effects: [{type: "item", key: wood, amount: 2}]}),
                cmd({id: "loan", costs: [{type: "custody", from: "$actor", to: "$target", key: wood, count: 1, loanId: "loan.wood"}]}),
                cmd({id: "return", costs: [{type: "custody", from: "$actor", to: "$target", key: wood, count: 1, loanId: "loan.wood", returning: true}]}),
                cmd({id: "eat", costs: [{type: "item", key: wood, amount: -1}]}),
                cmd({id: "equip", effects: [{type: "equipment", slot: "hand", key: wood}]}),
                cmd({id: "eye_get", effects: [{type: "faculty", sourceId: "eye", operation: "grant"}]}),
                cmd({id: "eye_wake", effects: [{type: "faculty", sourceId: "eye", operation: "awaken"}, {type: "faculty", sourceId: "eye", operation: "activate"}]}),
                cmd({id: "suppress", effects: [{type: "faculty", sourceId: "eye", operation: "suppress"}]}),
                cmd({id: "copy", effects: [{type: "power", powerId: "step", operation: "copy", target: "$target"}]}),
                cmd({id: "take", effects: [{type: "power", powerId: "step", operation: "transfer", target: "$target"}]}),
                cmd({id: "cast", powerId: "step", output: 2, effects: [{type: "vital", key: "health", actor: "$target", amount: -2}]}),
                cmd({id: "die", effects: [{type: "life", status: "dead", lethal: true, reason: "Authored lethal fixture"}]}),
                cmd({id: "remember", effects: [{type: "knowledge", key: "cue", stage: "seen", value: "A narrow sweep."}, {type: "relationship", target: "$target", axis: "trust", amount: 2}]}),
                cmd({id: "toxin", effects: [{type: "condition", id: "toxin", operation: "apply", duration: 3}]}),
                cmd({id: "remedy", effects: [{type: "condition", id: "toxin", operation: "remove"}]}),
                cmd({id: "native_strain", costs: [{type: "vital", key: "stamina", amount: -2}], effects: [{type: "vital", key: "health", amount: -1}]}),
                cmd({id: "lesson", effects: [{type: "power", powerId: "copy", operation: "learn"}]}),
                cmd({id: "fuse", effects: [{type: "power", powerId: "hybrid", operation: "learn"}]}),
                cmd({id: "fight", encounterId: "spar"})
            ],
            advancements: [{id: "tier", revision: 1, label: "Tier", track: "method", branch: "control", exclusiveGroup: "first", costs: [{type: "resource", key: "fuel", amount: -2}], effects: [{type: "progress", track: "method", field: "control", amount: 1}]}],
            origins: [{id: "vessel", revision: 1, label: "Vessel", effects: [{type: "resource", key: "capacity", amount: 5}]}],
            transitions: [{id: "travel", revision: 1, label: "Travel", kind: "travel", worldId: "other.world", reset: [], retain: ["knowledge", "claims"], party: "carry"},
                {id: "rebirth", revision: 1, label: "Rebirth", kind: "rebirth", worldId: "base.frontier", reset: ["resources", "powers", "journey", "native"], retain: ["knowledge", "claims"], chroniclePolicy: "end", nativePatch: {"character/money": 7}}],
            encounters: [{id: "spar", revision: 1, label: "Spar", lethal: false, turns: [{cue: "Narrow sweep", responses: [{id: "guard", costs: [{type: "resource", key: "fuel", amount: -1}], effects: []}]},
                {cue: "Recovery", responses: [{id: "wait", effects: [{type: "knowledge", key: "recovery", stage: "understood", value: "Strike requires its own paid action."}]}]}], settlement: [{type: "resource", key: "proof", amount: 1}]}],
            ...overrides
        }});
}
const start = registry => {const p = {state: createExpansionState(42), external: {money: 30}, gameplay: {player: native()}}; return enrollSimulation(p.state, registry, context(p));};

test("schema4 migrates without enrollment, rewards or reinterpreting a frozen commitment", () => {
    const old = initializeExpedition(createExpansionState(4)); old.schema = 4; delete old.simulation;
    const snapshot = structuredClone(old), next = loadExpansionState(old, expeditionRegistry);
    assert.equal(next.schema, 5); assert.equal(next.simulation, null); assert.deepEqual(old, snapshot);
    assert.throws(() => loadExpansionState({...next, schema: 6}, expeditionRegistry), /compatible/);
});
test("inspection is pure, definitions are frozen and wrong actor, location or hidden means reject", () => {
    const p = begin(), before = structuredClone(p);
    for(let i = 0; i < 4; i++) previewSimulationCommand(p.state, expeditionRegistry, "village.commission", context(p, {targetId: "oldCraftsman"}));
    assert.deepEqual(p, before); assert.ok(Object.isFrozen(expeditionRegistry.simulation.commands.get("village.commission")));
    assert.throws(() => command(p, "village.commission", {targetId: "oldCraftsman", facts: {location: "Shack"}}), /Return/);
    assert.throws(() => command(p, "village.craftsman_work"), /another actor/);
});
test("real native materials enter the NPC inventory; independent work, reload and collection settle once", () => {
    let p = command(begin(), "village.commission", {targetId: "oldCraftsman"});
    assert.equal(p.gameplay.player.inventory[wood], 8); assert.equal(p.gameplay.oldCraftsman.inventory[wood], 2);
    p = advance(p, 2); assert.equal(p.state.simulation.jobs[0].actorId, "oldCraftsman"); assert.equal(p.gameplay.oldCraftsman.inventory[wood], undefined);
    p = advance(reload(p), 4); assert.equal(p.gameplay.oldCraftsman.inventory[kit], 1);
    p = command(p, "village.collect", {targetId: "oldCraftsman"}); assert.equal(p.gameplay.player.inventory[kit], 1); assert.equal(p.gameplay.oldCraftsman.inventory[kit], undefined);
    assert.throws(() => command(reload(p), "village.collect", {targetId: "oldCraftsman"}), /completed/);
    assert.equal(p.state.simulation.relationships.oldCraftsman.player.axes.trust, 1);
});
test("one long advance and split/reloaded advances have equal actors, ownership, RNG and events", () => {
    const p = command(begin(), "village.commission", {targetId: "oldCraftsman"});
    const long = advance(p, 25); let short = p;
    for(let i = 0; i < 25; i++) short = advance(i === 8 ? reload(short) : short, 1);
    assert.deepEqual(long.state, short.state); assert.deepEqual(long.gameplay, short.gameplay); assert.deepEqual(long.external, short.external);
});
test("finite automation reserves each batch, returns cancellation inputs and pauses on shortage", () => {
    let p = command(begin(), "village.commission", {targetId: "oldCraftsman"}); p = command(p, "village.study_method");
    p = setSimulationProgram(p.state, expeditionRegistry, "village.measured_pack", 3, context(p, {facts: {location: "Shack", "village.shackUnlocked": true}}));
    assert.equal(p.gameplay.player.inventory[wood], 7);
    let cancelled = cancelSimulationJob(p.state, expeditionRegistry, p.state.simulation.jobs.find(j => j.actorId === "player").id, context(p));
    assert.equal(cancelled.gameplay.player.inventory[wood], 8); assert.equal(cancelled.state.simulation.programs.player.status, "paused");
    p = advance(reload(p), 9, expeditionRegistry, {location: "Shack"}); assert.equal(p.gameplay.player.inventory[kit], 3); assert.equal(p.state.actors.player.resources.practice, 3);
    assert.equal(p.state.simulation.programs.player.status, "complete");
    p.gameplay.player.inventory = {[wood]: 1}; p.external.money = 2;
    p = setSimulationProgram(p.state, expeditionRegistry, "village.measured_pack", 4, context(p, {facts: {location: "Shack", "village.shackUnlocked": true}}));
    p = advance(p, 3, expeditionRegistry, {location: "Shack"}); assert.equal(p.state.simulation.programs.player.status, "paused");
});
test("shared site capacity and unique claims arbitrate across actors before costs or rewards", () => {
    const r = sandbox(); let p = command(start(r), "work", {actorId: "peer"}, r);
    const before = structuredClone(p);
    assert.throws(() => command(p, "work", {actorId: "rival"}, r), /capacity/); assert.deepEqual(p, before);
    p = advance(p, 2, r); p = command(p, "unique", {actorId: "peer"}, r);
    assert.throws(() => command(p, "unique", {actorId: "rival"}, r), /claim/);
    p = advance(p, 2, r); assert.equal(p.state.simulation.claims["one.relic"].status, "settled");
    assert.throws(() => command(reload(p,r), "unique", {actorId: "rival"}, r), /claim/);
});
test("pending definitions freeze effects and reservations across content revisions", () => {
    const r = sandbox(), p = command(start(r), "work", {actorId: "peer"}, r);
    const changed = sandbox({commands: [cmd({id: "work", duration: 99, revision: 2, siteId: "bench", costs: [], effects: [{type: "resource", key: "output", amount: 50}]})]});
    const done = advance(reload(p,changed), 2, changed); assert.equal(done.state.actors.peer.resources.output, 1); assert.equal(done.state.simulation.sites.bench.reservations[p.state.simulation.jobs[0].id], undefined);
});
test("life/conditions are durable; immunity, remedy and nonlethal encounters use explicit rules", () => {
    const r = sandbox(); let p = command(start(r), "toxin", {actorId: "peer"}, r);
    assert.equal(p.state.simulation.conditions.peer.toxin.intensity, 1); p = advance(reload(p,r), 3, r); assert.equal(p.state.simulation.conditions.peer.toxin, undefined);
    p.state.simulation.people.peer.body.immune = true; p = command(p, "toxin", {actorId: "peer"}, r); assert.equal(p.state.simulation.conditions.peer.toxin, undefined);
    p = command(p, "die", {actorId: "peer"}, r); assert.equal(reload(p,r).state.simulation.people.peer.life, "dead");
    assert.throws(() => command(p, "work", {actorId: "peer"}, r), /activity/);
});
test("faculty possession, awakening, activation and suppression differ from remembered copies", () => {
    const r = sandbox(); let p = command(start(r), "eye_get", {actorId: "peer"}, r);
    const cap = p => inspectCapabilities(p.state, r, {actorId: "peer", worldId: "base.frontier", facts: {}}).sight.value;
    assert.equal(cap(p), 0); p = command(p, "eye_wake", {actorId: "peer"}, r); assert.equal(cap(p), 1);
    p = command(p, "learn", {actorId: "rival"}, r); p = command(p, "copy", {actorId: "peer", targetId: "rival"}, r);
    assert.equal(p.state.simulation.powers.rival.step.owned, true); assert.equal(p.state.simulation.powers.peer.step.owned, true);
    p = command(p, "suppress", {actorId: "peer"}, r); assert.equal(cap(p), 0); assert.equal(p.state.simulation.powers.peer.step.owned, true);
    p = command(p, "take", {targetId: "rival"}, r); assert.equal(p.state.simulation.powers.rival.step.owned, false); assert.equal(p.state.simulation.powers.player.step.owned, true);
});
test("execution uses actual target vitals, capacity, cooldown and native stamina/health projection", () => {
    const r = sandbox(); let p = command(start(r), "learn", {}, r);
    p = command(p, "cast", {targetId: "peer"}, r); assert.equal(p.state.simulation.people.peer.vitals.health, 18);
    assert.throws(() => command(p, "cast", {targetId: "peer"}, r), /recovers/);
    const strained = command(p, "native_strain", {vitals: {player: {health: 10, max_health: 10, stamina: 5, max_stamina: 5}}}, r);
    assert.deepEqual(strained.native, {staminaToFull: 2, hpToFull: 1});
    assert.throws(() => command(p, "native_strain", {vitals: {player: {health: 10, max_health: 10, stamina: 1, max_stamina: 5}}}, r), /stamina/);
});
test("a saved encounter blocks ordinary time, resumes its frozen turn and settles once", () => {
    const r = sandbox(); let p = command(start(r), "fight", {actorId: "peer", targetId: "rival"}, r);
    p = answerSimulationEncounter(p.state,r,"guard",context(p,{actorId:"peer"})); assert.equal(p.state.simulation.sessions.peer.turn,1);
    p = answerSimulationEncounter(reload(p,r).state,r,"wait",context(p,{actorId:"peer"})); assert.equal(p.state.actors.peer.resources.proof,1);
    assert.throws(() => answerSimulationEncounter(p.state,r,"wait",context(p,{actorId:"peer"})), /No active/);
    p = command(p,"fight",{},r); const jump = advance(p,20,r); assert.equal(jump.remaining,20); assert.equal(jump.stoppedAtChoice,true);
    p = withdrawSimulationEncounter(p.state,context(p)); assert.equal(p.state.simulation.sessions.player,undefined);
});
test("tiers, origins and fusion have durable receipts, branches and constituent lineage", () => {
    const r = sandbox(); let p = start(r);
    p = advancePowerProgression(p.state,r,"tier",context(p,{actorId:"peer"})); assert.equal(p.state.actors.peer.resources.fuel,18);
    assert.throws(() => advancePowerProgression(reload(p,r).state,r,"tier",context(p,{actorId:"peer"})), /already/);
    p = chooseSimulationOrigin(p.state,r,"vessel",context(p)); assert.equal(p.state.actors.player.resources.capacity,5);
    assert.throws(() => chooseSimulationOrigin(p.state,r,"vessel",context(p)), /already/);
    p = command(p,"learn",{},r); p = command(p,"lesson",{},r); p = command(p,"fuse",{},r);
    assert.equal(p.state.simulation.powers.player.step.owned,false); assert.deepEqual(p.state.simulation.powers.player.hybrid.lineage,["step","copy"]);
    assert.throws(() => sandbox({commands:[],powers:[{id:"cycle",revision:1,label:"Cycle",model:"hybrid",constituents:["cycle"]}]}), /Cyclic/);
});
test("loans preserve owner/custody, block consumption and return the exact material", () => {
    const r = sandbox(); let p = command(start(r),"grant",{actorId:"peer"},r);
    p = command(p,"loan",{actorId:"peer",targetId:"rival"},r);
    assert.equal(p.state.simulation.custody["loan.wood"].owner,"peer");
    assert.throws(() => command(p,"eat",{actorId:"rival"},r), /Borrowed/);
    p = command(reload(p,r),"return",{actorId:"rival",targetId:"peer"},r); assert.equal(p.state.simulation.custody["loan.wood"],undefined);
    p = command(p,"equip",{actorId:"peer"},r); assert.throws(() => command(p,"eat",{actorId:"peer"},r), /Unequip/);
});
test("world transitions preview explicit reset domains, preserve campaign knowledge/claims and stale previews reject", () => {
    const r = sandbox(); let p = command(start(r),"remember",{targetId:"peer"},r);
    const preview = previewCampaignTransition(p.state,r,"travel",context(p)); assert.deepEqual(preview.lost,[]);
    p = commitCampaignTransition(p.state,r,"travel",context(p),preview.sequence); assert.equal(p.state.actors.player.worldId,"other.world");
    assert.ok(p.state.simulation.knowledge.player.cue); assert.throws(() => commitCampaignTransition(p.state,r,"travel",context(p),preview.sequence), /stale/);
    const envelope = {character:{money:30},retired_content:{opaque:"keep"}, expansion:p.state};
    p = commitCampaignTransition(p.state,r,"rebirth",context(p,{nativeEnvelope:envelope})); assert.equal(p.reloadRequired,true); assert.equal(p.replacementEnvelope.character.money,7); assert.ok(p.state.simulation.knowledge.player.cue);
});
test("decisions retain unspent time; hidden occurrences require discovery and quiet checks award nothing", () => {
    const event = {id:"incident",revision:1,label:"A hidden change",interval:2,lifetime:4,mode:"decision",automatic:true,public:false,chance:1,maxOccurrences:1,effects:[],responses:[{id:"continue",label:"Continue",effects:[]}]};
    const r = sandbox({events:[event]}); let p = advance(start(r),3,r);
    assert.equal(p.state.clock,3); assert.equal(p.remaining,0); assert.equal(inspectSimulationEvents(p.state).length,0);
    const id = Object.keys(p.state.simulation.events)[0]; assert.throws(() => respondSimulationEvent(p.state,r,id,"continue",context(p)), /unknown/);
    p = discoverSimulationEvent(p.state,id,context(p)); const paused=advance(p,7,r);assert.equal(paused.remaining,7);
    p = respondSimulationEvent(p.state,r,id,"continue",context(p)); p = advance(p,7,r); assert.equal(p.state.clock,10);
    const quiet = sandbox({events:[{...event,mode:"ambient",chance:0}]}); const no = advance(start(quiet),10,quiet); assert.deepEqual(no.state.simulation.events,{});
});
test("bounded catch-up returns remaining work rather than skipping controller/event boundaries", () => {
    const p = advance(begin(),1000); assert.equal(p.budgetExhausted,true); assert.ok(p.remaining > 0);
    const rest = advance(p,p.remaining); let ticks=begin(); for(let i=0;i<1000;i++) ticks=advance(ticks,1);
    assert.deepEqual(rest.state,ticks.state);
});
test("failed durable write publishes no actors, claims, native transfers, resources or unlocks", () => {
    const old = begin(), p = command(old,"village.commission",{targetId:"oldCraftsman"}), before=structuredClone(old);
    const envelope = {character:{money:30},inventories:{person:{main_character:{},oldCraftsman:{}}},levels:{person:{main_character:{},oldCraftsman:{}}},retired_content:{opaque:"keep"}};
    const bindings={player:{category:"person",id:"main_character"},oldCraftsman:{category:"person",id:"oldCraftsman"}};
    assert.throws(() => persistExpansionPlan(p,{createSave:()=>JSON.stringify(envelope),storage:{setItem(){throw Error("quota");}},key:"test",bindings}), /quota/); assert.deepEqual(old,before);
    let written; persistExpansionPlan(p,{createSave:()=>JSON.stringify(envelope),storage:{setItem(k,v){written=JSON.parse(v);}},key:"test",bindings});
    assert.equal(written.inventories.person.oldCraftsman[wood].count,2); assert.deepEqual(written.retired_content,envelope.retired_content);
    assert.equal(loadExpansionState(written.expansion,expeditionRegistry).simulation.claims["village.first_commission"].status,"settled");
});
test("native unlocks stage access independently of publication and include recipe, skill, flag and quest", () => {
    let live=false, quest=false; const component={setStatus(v){live=v.is_unlocked;}};
    const e={character:{money:0},availabilities:{skill:{Climbing:0},recipe:{kit:0}},global_flags:{craft:false},quests:{scene:{is_active:false,is_finished:false}}};
    const pub=prepareNativeUnlocks([{kind:"skill",id:"Climbing"},{kind:"recipe",id:"kit"},{kind:"flag",id:"craft"},{kind:"quest",id:"scene"}],
        {availabilities:{skill:{Climbing:component},recipe:{kit:component}},flags:{craft:false},quests:{scene:{}},questManager:{isQuestActive:()=>false,isQuestFinished:()=>false,startQuest(){quest=true;}}});
    pub.write(e); assert.equal(live,false); assert.equal(quest,false); assert.equal(e.availabilities.recipe.kit,1); assert.equal(e.quests.scene.is_active,true);
    pub.publish(); assert.equal(live,true); assert.equal(quest,true);
    assert.throws(()=>prepareNativeUnlocks([{kind:"recipe",id:"absent"}],{availabilities:{},flags:{}}),/Unsupported/);
});
test("malformed actor bindings, reservations, unknown definitions and future runtime schemas reject", () => {
    const p=begin();
    for(const mutation of [s=>s.simulation.schema=3,s=>s.simulation.owners.player={},s=>s.simulation.people.oldCraftsman.life="maybe",s=>s.simulation.sites["village.workbench"].reservations.ghost="player",s=>s.simulation.powers.player={absent:{revision:1,owned:true,mastery:0,fragments:[],executions:0}}]) {
        const bad=structuredClone(p.state); mutation(bad); assert.throws(()=>validateExpansionState(bad,expeditionRegistry));
    }
});

test("each power model enforces its own scope, cost and termination without a global rank", () => {
    const r=sandbox(), p=start(r), state=p.state, context={actorId:"peer",targetId:"rival"}, owned={mastery:5,lineage:["step"]};
    const practice=previewPowerModel({model:"practice",capacity:1,masteryBands:[{at:4,capacity:3,costScale:0.5}]},owned,{output:2},{state,context,facts:{}});
    assert.equal(practice.capacity,3); assert.equal(practice.costScale,0.5); assert.deepEqual(practice.reasons,[]);
    const design=previewPowerModel({model:"design",capacity:2,functions:{move:{capacity:2},ward:{capacity:1}}},owned,{parameters:{functions:["move","ward"]}},{state,context,facts:{}}); assert.ok(design.reasons.length);
    state.simulation.progression.peer={aura:{values:{investment:4},branches:{},receipts:{}}};
    const aura=previewPowerModel({model:"investment",track:"aura",capacityPerPoint:2,upkeepPerUnit:1},owned,{parameters:{area:2,intensity:3}},{state,context,facts:{}}); assert.equal(aura.capacity,8); assert.equal(aura.costScale,6);
    const authority=previewPowerModel({model:"authority",custodyId:"absent"},owned,{}, {state,context,facts:{}}); assert.ok(authority.reasons.length);
    const hybrid=previewPowerModel({model:"hybrid",capacity:2,constituents:["step"]},owned,{}, {state,context,facts:{}}); assert.ok(hybrid.reasons.length);
    assert.equal(resolveEffectAmount({fact:"power.costScale",scale:-2}, {},practice),-1);
    assert.throws(()=>resolveEffectAmount({fact:"hidden.stat"},{},{}),/Unknown/);
});
test("formula-derived reservations remain negative and freeze the paid amount before later mastery", () => {
    const r=sandbox({powers:[{id:"step",revision:1,label:"Step",model:"practice",capacity:2,masteryBands:[{at:0,costScale:0.5}]}],commands:[cmd({id:"learn",effects:[{type:"power",powerId:"step",operation:"learn"}]}),
        cmd({id:"cast",powerId:"step",duration:2,cancellation:"refund",costs:[{type:"resource",key:"fuel",amount:{fact:"power.costScale",scale:-2}}],effects:[{type:"resource",key:"output",amount:{fact:"power.capacity"}}]})]});
    let p=command(start(r),"learn",{actorId:"peer"},r);p=command(p,"cast",{actorId:"peer"},r);assert.equal(p.state.actors.peer.resources.fuel,19);
    p.state.simulation.powers.peer.step.mastery=100;p=advance(reload(p,r),2,r);assert.equal(p.state.actors.peer.resources.output,2);
    const bad=sandbox({commands:[cmd({id:"free_cost",costs:[{type:"resource",key:"fuel",amount:{fact:"resource.fuel",scale:1}}]})]});
    assert.throws(()=>command(start(bad),"free_cost",{actorId:"peer"},bad),/Reservations/);
});
test("fictional condition ticks and old-age endings preserve work/refund rules across reload", () => {
    const people=[{id:"peer",revision:1,label:"Peer",worldId:"base.frontier",location:"Village",inventory:"simulation",resources:{fuel:20},
        vitals:{health:10,max_health:10,stamina:5,max_stamina:5},lifePolicy:{lifespan:3,ending:"departed",work:"refund"}}];
    const r=sandbox({people,conditions:[{id:"toxin",revision:1,label:"Fictional toxin",interval:1,onTick:[{type:"vital",key:"health",amount:-1}]}]});
    let p=command(start(r),"toxin",{actorId:"peer"},r);p=advance(p,1,r);assert.equal(p.state.simulation.people.peer.vitals.health,9);
    p=command(p,"work",{actorId:"peer"},r);p=advance(reload(p,r),1,r);assert.equal(p.state.simulation.people.peer.vitals.health,8);
    p=advance(p,1,r);assert.equal(p.state.simulation.people.peer.life,"departed");assert.equal(p.state.simulation.sites.bench.reservations["simulation:3"],undefined);
    const rr=sandbox({people:[{...people[0],lifePolicy:{lifespan:1,ending:"departed",work:"refund"}}]});
    let reserved=command(start(rr),"work",{actorId:"peer"},rr);reserved=advance(reserved,1,rr);assert.equal(reserved.state.actors.peer.resources.fuel,20);assert.equal(reserved.state.simulation.jobs.length,0);
});
test("new actors are created once with stable identity, independent inventory and no invented past", () => {
    const r=sandbox({people:[{id:"child.template",revision:1,label:"Child template",provision:false,worldId:"base.frontier",location:"Village",inventory:"simulation",resources:{fuel:1}}],
        commands:[cmd({id:"birth",effects:[{type:"spawn",definitionId:"child.template",personId:"child.one"}]})]});
    let p=start(r);assert.equal(p.state.actors["child.one"],undefined);p=command(p,"birth",{},r);
    assert.equal(p.state.simulation.people["child.one"].bornAt,p.state.clock);assert.deepEqual(p.state.simulation.owners["child.one"],{});
    assert.throws(()=>command(reload(p,r),"birth",{},r),/duplicate/);
});
test("external actor proposals are restricted to visible legal registered commands and stale proposals reject", () => {
    const r=sandbox(),p=start(r),ctx=context(p,{actorId:"peer"});const choices=inspectActorChoices(p.state,r,"peer",ctx);assert.equal(choices.sequence,p.state.sequence);
    const proposed={actorId:"peer",commandId:"work",sequence:p.state.sequence};const out=acceptActorProposal(p.state,r,proposed,ctx);assert.equal(out.state.simulation.jobs.length,1);
    assert.throws(()=>acceptActorProposal(out.state,r,proposed,ctx),/stale/);
    assert.throws(()=>acceptActorProposal(p.state,r,{...proposed,effects:[]},ctx),/authoritative/);
});
test("native equipment stages an owned quality-key swap, saves NPC gear and rebuilds without extra items", () => {
    const r=sandbox({commands:[cmd({id:"native_equip",effects:[{type:"equipment",slot:"legs",key:wood}]})]});let p=start(r);
    p=command(p,"native_equip",{equipment:{player:{legs:kit}}},r);assert.equal(p.gameplay.player.inventory[wood],9);assert.equal(p.gameplay.player.inventory[kit],1);assert.equal(p.equipment.player.legs,wood);
    let rebuilt=0;const actor={getEquipment:()=>gear,_equipItem(){rebuilt++;}},gear={};const getItem=key=>({equip_slot:"legs",getInventoryKey:()=>key});
    const pub=prepareNativeEquipment({peer:{legs:wood}},{actors:{peer:actor},getItem});const envelope={character:{equipment:{}}};pub.write(envelope);assert.equal(rebuilt,0);assert.equal(envelope.npc_equipment.peer.legs,wood);
    pub.publish();assert.equal(rebuilt,1);assert.equal(readNativeEquipment({peer:actor}).peer.legs,wood);
    assert.throws(()=>prepareNativeEquipment({peer:{weapon:wood}},{actors:{peer:actor},getItem}),/does not fit/);
});
test("authored native reset values survive serialization after ordinary domain patches", () => {
    const r=sandbox(),old=start(r);const envelope={character:{money:30},inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}},retired_content:{opaque:"keep"}};
    const p=commitCampaignTransition(old.state,r,"rebirth",context(old,{nativeEnvelope:envelope}));let stored;
    persistExpansionPlan(p,{createSave:()=>JSON.stringify(envelope),storage:{setItem(k,v){stored=JSON.parse(v);}},key:"test",bindings:{player:{category:"person",id:"main_character"}}});
    assert.equal(stored.character.money,7);assert.deepEqual(stored.retired_content,{opaque:"keep"});assert.equal(stored.expansion.schema,5);
});
test("a party encounter freezes its participants and pays all member costs atomically", () => {
    const r=sandbox({commands:[cmd({id:"join",effects:[{type:"party",target:"$target",operation:"join"}]}),cmd({id:"fight",encounterId:"team"})],
        encounters:[{id:"team",revision:1,label:"Team proof",lethal:false,turns:[{cue:"Hold the line",responses:[{id:"hold",costs:[{type:"resource",actor:"$party",key:"fuel",amount:-2}],effects:[{type:"vital",actor:"$party",key:"health",amount:-1,maxTargets:2}]}]}],settlement:[{type:"knowledge",actor:"$party",key:"teamwork",stage:"understood",value:"Each member paid for their own response."}]}]});
    let p=start(r);p=command(p,"join",{targetId:"peer"},r);p=command(p,"join",{targetId:"rival"},r);p=command(p,"fight",{},r);
    p=answerSimulationEncounter(reload(p,r).state,r,"hold",context(p));assert.equal(p.state.actors.peer.resources.fuel,18);assert.equal(p.state.actors.rival.resources.fuel,18);
    assert.equal(p.state.simulation.people.peer.vitals.health,19);assert.equal(p.state.simulation.knowledge.rival.teamwork.stage,"understood");
    let no=start(r);no=command(no,"join",{targetId:"peer"},r);no=command(no,"join",{targetId:"rival"},r);no=command(no,"fight",{},r);no.state.actors.rival.resources.fuel=1;
    const before=structuredClone(no);assert.throws(()=>answerSimulationEncounter(no.state,r,"hold",context(no)),/fuel/);assert.deepEqual(no,before);
});
test("delayed native equipment/vital effects require real bindings and preserve NPC body state", () => {
    const r=sandbox({people:[{id:"peer",revision:1,label:"Native peer",worldId:"base.frontier",location:"Village",inventory:"native"}],commands:[cmd({id:"strain",duration:1,effects:[{type:"vital",actor:"$target",key:"health",amount:-2},{type:"equipment",actor:"$target",slot:"legs",key:wood}]})]});
    let p=start(r);p.gameplay.peer=native();
    p=command(p,"strain",{targetId:"peer",equipment:{peer:{}},vitals:{peer:{health:5,max_health:5,stamina:2,max_stamina:2}}},r);
    p=advanceSimulation(p.state,r,1,p.external,p.gameplay,{peer:{equipment:{},vitals:{health:5,max_health:5,stamina:2,max_stamina:2}}});
    assert.equal(p.state.simulation.people.peer.vitals.health,3);assert.equal(p.equipment.peer.legs,wood);assert.equal(p.gameplay.peer.inventory[wood],9);
});
