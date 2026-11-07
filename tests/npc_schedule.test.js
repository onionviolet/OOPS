import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, advanceSimulation} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition} from "../src/expedition_content.js";
import {enrollSimulation, commitSimulationCommand} from "../src/simulation.js";
import {scheduleFacts, validateSchedule} from "../src/npc_schedule.js";

const wood = JSON.stringify({id: "Rough wood log"});
const native = () => ({inventory: {[wood]: 10}, skills: {}, reputation: {Village: 0}});
const context = (p, extra = {}) => ({actorId: "player", external: p.external, gameplay: p.gameplay,
    facts: {location: "Village", "village.craftsmanMet": true, "village.shackUnlocked": true}, ...extra});
const begin = () => {const p = {state: initializeExpedition(createExpansionState(17)), external: {money: 30}, gameplay: {player: native(), oldCraftsman: {...native(), inventory: {}}}};
    return enrollSimulation(p.state, expeditionRegistry, context(p));};
const commission = p => commitSimulationCommand(p.state, expeditionRegistry, {id: "village.commission"}, context(p, {targetId: "oldCraftsman"}));
const advance = (p, n, calendarMinute) => advanceSimulation(p.state, expeditionRegistry, n, p.external, p.gameplay,
    {player: {facts: {"village.shackUnlocked": true}}, ...(calendarMinute == null ? {} : {oldCraftsman: {facts: {calendarMinute}}})});
const night = {actor: "n", slots: [{from: 1320, to: 360, place: "home", activity: "rest"}, {from: 360, to: 1320, place: "bench", activity: "work"}]};

test("slot lookup wraps past midnight (22:00-06:00) and reduces calendar minutes to the day", () => {
    const at = m => scheduleFacts([night], "n", m);
    for(const m of [1320, 1439, 0, 359]) assert.deepEqual(at(m), {"schedule.n.place": "home", "schedule.n.activity": "rest", "schedule.n.slot": "1320-360"});
    for(const m of [360, 1319]) assert.equal(at(m)["schedule.n.place"], "bench");
    assert.equal(at(1440 * 400 + 23 * 60)["schedule.n.place"], "home");
    assert.deepEqual(at(null), {"schedule.n.slot": "untimed"});
    const gappy = validateSchedule({actor: "g", slots: [{from: 60, to: 120, place: "a", activity: "b"}]});
    assert.deepEqual(scheduleFacts([gappy], "g", 5), {"schedule.g.slot": "none"});
});

test("an unscheduled actor yields no schedule facts, and bad rows are refused", () => {
    assert.deepEqual(scheduleFacts([night], "someoneElse", 600), {});
    assert.deepEqual(scheduleFacts([], "n", 600), {});
    assert.throws(() => validateSchedule({actor: "x", slots: [{from: 0, to: 600, place: "a", activity: "b"}, {from: 500, to: 700, place: "a", activity: "b"}]}), /overlap/);
    assert.throws(() => validateSchedule({actor: "x", slots: [{from: 5, to: 5, place: "a", activity: "b"}]}), /bad minutes/);
});

test("the guarded craftsman acts in-slot and holds out-of-slot even though the order guard passes", () => {
    const base = commission(begin());
    assert.equal(base.state.actors.oldCraftsman.facts["work.order"], true);
    const held = advance(base, 4, 23 * 60);
    assert.equal(held.state.simulation.jobs.length, 0);
    assert.equal(held.state.simulation.controllers["village.craftsman_controller"].lastAction, undefined);
    assert.equal(held.gameplay.oldCraftsman.inventory[wood], 2);
    const acted = advance(base, 4, 10 * 60);
    assert.equal(acted.state.simulation.jobs[0].actorId, "oldCraftsman");
    assert.equal(acted.state.simulation.controllers["village.craftsman_controller"].lastAction.subject, "village.craftsman_work");
});

test("without a calendar the craftsman behaves as before, and the schedule adds no save key", () => {
    const base = commission(begin());
    const untimed = advance(base, 4);
    assert.equal(untimed.state.simulation.jobs[0].actorId, "oldCraftsman");
    assert.ok(!JSON.stringify(untimed.state).includes("schedule"));
    assert.ok(!JSON.stringify(begin().state).includes("schedule"));
});

test("controller actions reach state only through the command path", () => {
    // 1. Structure: a controller and its actions can name a command, encounter or
    //    event response and a guard; there is no field that could carry an effect.
    const allowedController = new Set(["id", "revision", "label", "actorId", "interval", "actions", "schedule"]);
    const allowedAction = new Set(["commandId", "encounterId", "eventId", "responseId", "kind", "priority", "when", "targetId"]);
    for(const d of expeditionRegistry.simulation.controllers.values()) {
        for(const k of Object.keys(d)) assert.ok(allowedController.has(k), `${d.id} has field ${k}`);
        for(const a of d.actions) for(const k of Object.keys(a)) assert.ok(allowedAction.has(k), `${d.id} action has field ${k}`);
    }
    // 2. Equivalence: the controller's work equals the same command committed by
    //    hand for the craftsman at the same minute, with the controller deleted.
    const base = commission(begin());
    const viaController = advance(base, 1, 10 * 60);
    const stripped = structuredClone(base);
    delete stripped.state.simulation.controllers["village.craftsman_controller"];
    const manual = advance(stripped, 1, 10 * 60);
    const byHand = commitSimulationCommand(manual.state, expeditionRegistry, {id: "village.craftsman_work"},
        {actorId: "oldCraftsman", external: manual.external, gameplay: manual.gameplay, facts: {location: "Village"}});
    assert.deepEqual(viaController.state.simulation.jobs, byHand.state.simulation.jobs);
    assert.deepEqual(viaController.gameplay, byHand.gameplay);
    assert.deepEqual(viaController.state.actors.oldCraftsman, byHand.state.actors.oldCraftsman);
});
