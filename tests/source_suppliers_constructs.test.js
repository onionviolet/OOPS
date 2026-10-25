import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, createContentRegistry, loadExpansionState, advanceSimulation, inspectCapabilities} from "../src/expansion_engine.js";
import {enrollSimulation, commitSimulationCommand} from "../src/simulation.js";
import {installImplant, removeImplant, implantFitReasons, implantRecords} from "../src/implant_service.js";
import {constructRecords} from "../src/temporary_construct.js";
import {compileStructuredAbilities} from "../src/structured_ability_runtime.js";
import {bodyView} from "../src/backlog_expansion_body.js";

const wood = JSON.stringify({id: "Rough wood log"}), copyKey = JSON.stringify({id: "Prepared survey kit"}), blade = JSON.stringify({id: "Hook blade"});
const cmd = d => ({revision: 1, label: d.id, costs: [], effects: [], ...d});
const src = (operation, extra = {}, sourceId = "sense") => cmd({id: `${operation}_${extra.supplier || "all"}_${sourceId}`, effects: [{type: "source", sourceId, operation, ...(operation === "grant" ? {awakened: true, active: true} : {}), ...extra}]});
const registry = () => createContentRegistry({
    worlds: [{id: "base.frontier"}],
    capabilities: [{id: "sight", label: "Sight", stacking: "sum", providers: []}],
    sources: [
        {id: "sense", revision: 1, kind: "skill", label: "Keen sense", grants: [{capability: "sight", amount: 1}]},
        {id: "edge", revision: 1, kind: "equipment", label: "Edge", onEquip: [blade], grants: [{capability: "sight", amount: 1}]},
        {id: "lend", revision: 1, kind: "support", label: "Lent sight", grants: [{capability: "sight", amount: 1}]}
    ],
    simulation: {
        people: [{id: "peer", revision: 1, label: "peer", worldId: "base.frontier", location: "Village", inventory: "simulation", resources: {},
            vitals: {health: 20, max_health: 20, stamina: 10, max_stamina: 10}, body: {form: "human", intakePort: true}}],
        conditions: [{id: "dazzle", revision: 1, label: "Dazzle", stacking: "max"}],
        commands: [
            cmd({id: "stock", effects: [{type: "item", key: wood, amount: 2}, {type: "item", key: blade, amount: 1}]}),
            src("grant", {supplier: "a"}), src("grant", {supplier: "b"}), src("remove", {supplier: "a"}), src("remove", {supplier: "b"}), src("remove"), src("grant"),
            cmd({id: "shift_a", effects: [{type: "source", sourceId: "sense", operation: "grant", supplier: "a", awakened: true, active: true,
                shifts: [{type: "body", key: "keen", value: true}, {type: "condition", id: "dazzle", intensity: 2}]}]}),
            cmd({id: "shift_timed", effects: [{type: "source", sourceId: "sense", operation: "grant", supplier: "t", duration: 2, awakened: true, active: true,
                shifts: [{type: "body", key: "keen", value: true}]}]}),
            cmd({id: "copy", effects: [{type: "construct", operation: "create", constructId: "c.copy", key: copyKey, duration: 3, store: [{key: wood, count: 1}], sourceId: "lend"}]}),
            cmd({id: "child", effects: [{type: "construct", operation: "create", constructId: "c.child", parentId: "c.copy", duration: 10, store: [{key: wood, count: 1}], contents: "vanish"}]}),
            cmd({id: "dismiss", effects: [{type: "construct", operation: "dismiss", constructId: "c.copy"}]}),
            cmd({id: "wield", effects: [{type: "equipment", slot: "hand", key: blade}]}),
            cmd({id: "unwield", effects: [{type: "equipment", slot: "hand"}]})
        ]
    }});
const ctx = p => ({actorId: "peer", external: p.external, gameplay: p.gameplay, facts: {location: "Village"}});
const start = r => {const p = {state: createExpansionState(5), external: {money: 0}, gameplay: {player: {inventory: {}, skills: {}, reputation: {Village: 0}}}}; return enrollSimulation(p.state, r, ctx(p));};
const run = (r, p, id) => commitSimulationCommand(p.state, r, {id}, ctx(p));
const wait = (r, p, n) => advanceSimulation(p.state, r, n, p.external, p.gameplay, {player: {facts: {}}});
const reload = (r, p) => ({...structuredClone(p), state: loadExpansionState(JSON.parse(JSON.stringify(p.state)), r)});
const sight = (r, p) => inspectCapabilities(p.state, r, {actorId: "peer", worldId: "base.frontier", facts: {}}).sight.value;
const peer = p => p.state.actors.peer, wood_ = p => p.state.simulation.owners.peer[wood] || 0;

test("two suppliers of one source both count and removing one keeps the other", () => {
    const r = registry(); let p = run(r, start(r), "grant_a_sense");
    p = run(r, p, "grant_b_sense"); assert.equal(sight(r, p), 2);
    p = reload(r, p); p = run(r, p, "remove_a_sense");
    assert.equal(sight(r, p), 1); assert.ok(peer(p).sources.sense && p.state.simulation.faculties.peer.sense);
    p = run(r, p, "remove_a_sense"); assert.equal(sight(r, p), 1, "removing a gone supplier again changes nothing");
    p = run(r, p, "remove_b_sense"); assert.equal(sight(r, p), 0);
    assert.equal(peer(p).sources.sense, undefined); assert.equal(p.state.simulation.faculties.peer.sense, undefined);
});
test("unnamed grants keep the old single-supplier shape and a plain remove clears every supplier", () => {
    const r = registry(); let p = run(r, start(r), "grant_all_sense"); p = run(r, p, "grant_all_sense");
    assert.equal(sight(r, p), 1, "repeated unnamed grants still collapse to one supplier");
    assert.equal(peer(p).sources.sense.suppliers, undefined);
    p = run(r, p, "grant_a_sense"); assert.ok(peer(p).sources.sense.suppliers.a && peer(p).sources.sense.suppliers.self);
    p = run(r, p, "remove_all_sense"); assert.equal(peer(p).sources.sense, undefined);
});
test("a source's shifts survive partial support loss and clear with its last supplier", () => {
    const r = registry(); let p = run(r, start(r), "shift_a"); p = run(r, p, "grant_b_sense");
    assert.equal(p.state.simulation.people.peer.body.keen, true); assert.equal(p.state.simulation.conditions.peer.dazzle.intensity, 2);
    p = run(r, p, "remove_a_sense");
    assert.equal(p.state.simulation.people.peer.body.keen, true, "b still supports the skill");
    p = run(r, p, "remove_b_sense");
    assert.equal(p.state.simulation.people.peer.body.keen, undefined); assert.equal(p.state.simulation.conditions.peer.dazzle, undefined);
    assert.equal(p.state.simulation.people.peer.body.form, "human");
});
test("a temporary copy expires with its nested child, contents handled, supply ended", () => {
    const r = registry(); let p = run(r, run(r, start(r), "stock"), "copy");
    assert.equal(peer(p).sources.lend.suppliers["construct:c.copy"].expiresAt, p.state.clock + 3);
    p = run(r, p, "child"); assert.equal(wood_(p), 0); assert.equal(p.state.simulation.constructs["c.child"].expiresAt, p.state.simulation.constructs["c.copy"].expiresAt, "a child never outlives its parent");
    assert.equal(p.state.simulation.owners.peer[copyKey], 1); assert.equal(sight(r, p), 1);
    p = wait(r, reload(r, p), 2); assert.ok(p.state.simulation.constructs["c.copy"]);
    p = wait(r, p, 1);
    assert.equal(p.state.simulation.constructs["c.copy"], undefined); assert.equal(p.state.simulation.constructs["c.child"], undefined);
    assert.equal(p.state.simulation.owners.peer[copyKey], undefined, "the copy is gone");
    assert.equal(wood_(p), 1, "parent contents returned, child's vanished by its policy");
    assert.equal(peer(p).sources.lend, undefined); assert.equal(sight(r, p), 0);
});
test("dismissing a parent expires its children first", () => {
    const r = registry(); let p = run(r, run(r, run(r, start(r), "stock"), "copy"), "child");
    p = run(r, p, "dismiss"); assert.deepEqual(p.state.simulation.constructs, {}); assert.equal(wood_(p), 1);
});
test("equipping a listed item supplies a source and unequipping revokes only that supply", () => {
    const r = registry(); let p = run(r, run(r, start(r), "stock"), "wield");
    assert.ok(peer(p).sources.edge.suppliers["equip:" + blade]); assert.equal(sight(r, p), 1);
    p = run(r, p, "unwield"); assert.equal(peer(p).sources.edge, undefined); assert.equal(sight(r, p), 0);
});
test("implant service: slot fit, shared skill support and loss of the last support", () => {
    const r = registry(); const p = run(r, start(r), "grant_a_sense"), plan = {state: structuredClone(p.state)};
    const body = plan.state.simulation.people.peer.body;
    const eye = {id: "i.eye", slot: "head", forms: ["human"], requires: ["intakePort"], sourceId: "edge", skillIds: ["sense"]};
    const ear = {id: "i.ear", slot: "ear", forms: ["human"], sourceId: "lend", skillIds: ["sense"]};
    assert.deepEqual(implantFitReasons({form: "clay_vessel"}, eye).length, 2);
    installImplant(plan, {actorId: "peer", implant: eye, body, cause: "t:1"}); installImplant(plan, {actorId: "peer", implant: ear, body, cause: "t:2"});
    assert.throws(() => installImplant(plan, {actorId: "peer", implant: eye, body, cause: "t:3"}), /already taken/);
    assert.deepEqual(Object.keys(plan.state.actors.peer.sources.sense.suppliers).sort(), ["a", "implant:i.ear", "implant:i.eye"]);
    removeImplant(plan, {actorId: "peer", implant: eye, body});
    assert.ok(plan.state.actors.peer.sources.sense, "the skill keeps the ear and the lesson");
    removeImplant(plan, {actorId: "peer", implant: ear, body});
    assert.ok(plan.state.actors.peer.sources.sense, "the trained supplier still supports it");
    assert.equal(plan.state.actors.peer.sources.edge, undefined); assert.equal(body.implants, undefined);
});

test("brass-lung proof still installs through the service, trains, presses and removes", async () => {
    const {stageBodyCommand, BODY_IDS, BODY_ITEM_KEYS, validateBodyRecord} = await import("../src/backlog_expansion_body.js");
    const r = registry(), p = start(r), bag = {[BODY_ITEM_KEYS.wood]: 5, [BODY_ITEM_KEYS.soundBlank]: 1};
    p.state.simulation.people.player.inventory = "native";
    const plan = {state: structuredClone(p.state), acquisitions: [], unlocks: [], gameplay: {player: {inventory: bag, skills: {}, reputation: {}}}};
    const context = () => ({actorId: "player", nativeAlive: true, vitals: {player: {health: 10, max_health: 10, stamina: 5, max_stamina: 5}}, facts: {location: "Village"},
        nativeBody: {schema: 1, sequence: plan.state.sequence, actorId: "player", bodyId: BODY_IDS.nativeBody, nativeRace: "human", location: "Village", mobile: true, hands: 2, intakePort: true}});
    const step = id => {stageBodyCommand(plan, {id: `backlog.body.${id}`}, context()); plan.state.sequence++;};
    for(const id of ["meet_brasswright", "buy_brass_lung", "install_brass_lung"]) step(id);
    const body = plan.state.simulation.people.player.body, source = plan.state.actors.player.sources[BODY_IDS.brassSource];
    assert.equal(body.brassLungId, BODY_IDS.specimen); assert.equal(body.implants.intake, BODY_IDS.specimen);
    assert.deepEqual(Object.keys(source.suppliers), ["implant:" + BODY_IDS.specimen]);
    assert.equal(plan.state.simulation.faculties.player[BODY_IDS.brassSource].active, false, "installation alone grants no control");
    for(const id of ["train_brass_lung", "fuel_brass_lung", "press_brass_seal", "suppress_brass_lung", "activate_brass_lung"]) step(id);
    validateBodyRecord(plan.state.backlog, plan.state);
    step("remove_brass_lung");
    assert.equal(plan.state.actors.player.sources[BODY_IDS.brassSource], undefined); assert.equal(body.brassLungId, undefined);
    assert.equal(plan.state.simulation.faculties.player[BODY_IDS.brassSource], undefined); assert.equal(plan.gameplay.player.inventory[BODY_ITEM_KEYS.specimen], 1);
    validateBodyRecord(plan.state.backlog, plan.state);
    step("install_brass_lung"); assert.equal(plan.state.simulation.faculties.player[BODY_IDS.brassSource].development, 1, "learned control returns on reinstall");
    // Panel-reachable copy: a construct is a second supplier of the same source, and it holds one log until it ends.
    const held = () => plan.gameplay.player.inventory[BODY_ITEM_KEYS.wood] || 0, logs = held();
    step("copy_brass_lung");
    assert.equal(held(), logs - 1);
    assert.deepEqual(Object.keys(plan.state.actors.player.sources[BODY_IDS.brassSource].suppliers).sort(), ["construct:backlog.brass_copy", "implant:" + BODY_IDS.specimen]);
    assert.throws(() => step("copy_brass_lung"), /already exists/);
    assert.throws(() => step("remove_brass_lung"), /Let the lung copy go/);
    step("dismiss_brass_copy");
    assert.deepEqual(Object.keys(plan.state.actors.player.sources[BODY_IDS.brassSource].suppliers), ["implant:" + BODY_IDS.specimen]); assert.equal(held(), logs);
    validateBodyRecord(plan.state.backlog, plan.state);
    step("remove_brass_lung"); assert.equal(plan.state.actors.player.sources[BODY_IDS.brassSource], undefined);
});

test("a timed supplier that runs out clears the shifts its source owned", () => {
    const r = registry(); let p = run(r, start(r), "shift_timed");
    assert.equal(p.state.simulation.people.peer.body.keen, true);
    p = wait(r, p, 2);
    assert.equal(peer(p).sources.sense, undefined); assert.equal(p.state.simulation.people.peer.body.keen, undefined);
});
test("player-facing lines list live copies with remaining time and installed implants with their supports", () => {
    const r = registry(); let p = run(r, run(r, run(r, start(r), "stock"), "copy"), "child");
    assert.match(constructRecords(p.state)[0], /c\.child.*inside c\.copy|c\.copy.*3 min remaining.*holds 1 x Rough wood log \(returned/s);
    assert.ok(constructRecords(p.state).some(line => /c\.child.*lost when it ends/.test(line)));
    const plan = {state: structuredClone(p.state)}, body = plan.state.simulation.people.peer.body;
    installImplant(plan, {actorId: "peer", implant: {id: "i.eye", slot: "head", forms: ["human"], sourceId: "edge", skillIds: ["sense"]}, body, cause: "t:9"});
    plan.state.simulation.people.player = {...plan.state.simulation.people.player, body};
    plan.state.actors.player.sources = plan.state.actors.peer.sources;
    assert.match(implantRecords(plan.state)[0], /Implant i\.eye in your head: supports edge, sense/);
    assert.ok(bodyView(plan.state, {}).records.some(line => /Temporary copy c\.copy/.test(line)));
});
test("the temporary-construct ability kind needs a construct effect with a finite duration", () => {
    const def = withEffect => ({id: "w", world: {id: "w.world"}, sources: [{id: "w.m", revision: 1, kind: "technique", label: "m", grants: []}],
        abilities: [{id: "w.a", commandId: "w.use", sourceId: "w.m", function: "craft", acquisition: "learned", executionKind: "temporary-construct", control: {fact: "actor.c", op: "eq", value: true}, target: null, counters: [], carriers: []}],
        simulation: {powers: [], commands: [{id: "w.use", revision: 1, label: "Copy", worldId: "w.world", duration: 0, costs: [], effects: withEffect
            ? [{type: "construct", operation: "create", constructId: "w.c", duration: 5}] : [{type: "item", key: wood, amount: 1}]}]}});
    assert.throws(() => compileStructuredAbilities(def(false)), /construct effect/);
    assert.equal(compileStructuredAbilities(def(true)).commands.length, 1);
});
