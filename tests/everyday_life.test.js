import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, commitAction, cancelAction, advanceSimulation, evaluateAction, loadExpansionState, inspectCapabilities} from "../src/expansion_engine.js";
import {initializeExpedition, expeditionRegistry} from "../src/expedition_content.js";
import {enrollSimulation, commitSimulationCommand} from "../src/simulation.js";
import {everydayFacts, everydayScene, routeUnderstanding, recordRouteReading, activeMood, IRRITATED, UNSETTLED, REASSURED} from "../src/everyday_life.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {LOG_KEY} from "../src/village_content.js";

const owned = inventory => ({inventory, skills: {Perception: {xp: 0, parent: null, enabled: true},
    Literacy: {xp: 0, parent: null, enabled: true}, Climbing: {xp: 0, parent: null, enabled: true}}, reputation: {Village: 0}});
const fresh = () => {
    const state = initializeExpedition(createExpansionState(17)); state.actors.player.facts["village.discovered"] = true; state.campaign.facts.anchor = true;
    return {state, external: {money: 20}, gameplay: {player: owned({[LOG_KEY]: 5}), oldCraftsman: owned({})}};
};
const context = (p, facts = {}) => ({actorId: "player", worldId: "base.frontier", targetId: "oldCraftsman", external: p.external, gameplay: p.gameplay,
    facts: {location: "Village", calendarMinute: 1440 * 360000 + 480, "village.notesRead": false, "village.elderMet": true,
        "village.craftsmanMet": true, "village.shackUnlocked": true, "village.circleOpen": true,
        "village.briefingActive": false, perception: 3, kits: 0, ...everydayFacts(p.state), ...facts}});
const action = (p, id, facts = {}) => commitAction(p.state, expeditionRegistry, id, context(p, facts));
const advance = (p, minutes) => advanceSimulation(p.state, expeditionRegistry, minutes, p.external, p.gameplay);
const social = (p, id, facts = {}) => commitSimulationCommand(p.state, expeditionRegistry, {id}, context(p, facts));
const enroll = () => {const p = fresh(); return enrollSimulation(p.state, expeditionRegistry, context(p));};
const interrupted = () => social(social(enroll(), "village.commission"), "village.interrupt_work");
const reload = p => ({...p, state: loadExpansionState(JSON.parse(JSON.stringify(p.state)), expeditionRegistry)});

test("book, explanation and field evidence reach one route with distinct provenance and no invented reading XP", () => {
    const initial = fresh(), old = structuredClone(initial.state);
    const book = recordRouteReading(initial.state, true);
    assert.deepEqual(initial.state, old); assert.deepEqual(routeUnderstanding(book), {known: true, origin: "book"});
    assert.deepEqual(recordRouteReading(book, true), book);
    const teacher = action(initial, "village.route_lesson"); assert.equal(teacher.external.money, 18);
    const taught = advance(reload(teacher), 3); assert.deepEqual(routeUnderstanding(taught.state), {known: true, origin: "teacher"});
    const field = advance(action(fresh(), "village.route_deduction"), 5);
    assert.deepEqual(routeUnderstanding(field.state), {known: true, origin: "field"}); assert.equal(field.external.money, 20);
    for(const p of [taught, field]) {
        assert.equal(p.gameplay.player.skills.Literacy.xp, 0); assert.equal(p.gameplay.player.skills.Perception.xp, 0);
        assert.equal(evaluateAction(p.state, expeditionRegistry, "village.dry_bank", context(p)).eligible, true);
        assert.equal(evaluateAction(p.state, expeditionRegistry, "village.route_board", context(p, {location: "Shack"})).eligible, true);
        assert.throws(() => action(p, "village.route_lesson")); assert.throws(() => action(p, "village.route_deduction"));
        assert.equal(recordRouteReading(p.state, true).actors.player.facts["village.routeOrigin"], routeUnderstanding(p.state).origin);
    }
    assert.equal(routeUnderstanding(initial.state, false).known, false); assert.equal(routeUnderstanding(initial.state, true).known, true);
});

test("refunded tuition, closed teaching hours and field prerequisites keep alternate learning paths available", () => {
    const p = fresh();
    const paid = action(p, "village.route_lesson"), cancelled = cancelAction(paid.state, expeditionRegistry, paid.commitment.id, context(paid));
    assert.equal(cancelled.external.money, 20); assert.equal(routeUnderstanding(cancelled.state).known, false);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "village.route_lesson", context(p, {"village.teacherHours": false})).eligible, false);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "village.route_deduction", context(p, {perception: 0})).eligible, false);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "village.route_deduction", context(p, {"village.teacherHours": false})).eligible, true);
    assert.equal(routeUnderstanding(p.state, true).known, true);
});

test("work interruption creates saved temporary moods and directed memory without changing regional reputation", () => {
    let p = enroll(); p = social(p, "village.working_habits");
    assert.match(everydayScene(p.state, context(p).facts), /prefers practical help/);
    assert.throws(() => social(p, "village.working_habits"));
    p = social(p, "village.commission");
    assert.equal(everydayFacts(p.state)["village.craftsmanBusy"], true); // Includes the order before its controller tick.
    p = social(p, "village.interrupt_work");
    assert.ok(activeMood(p.state, "oldCraftsman", IRRITATED)); assert.ok(activeMood(p.state, "player", UNSETTLED));
    assert.equal(p.state.simulation.relationships.oldCraftsman.player.axes.respect, -1);
    assert.equal(p.gameplay.player.reputation.Village, 0); assert.throws(() => social(p, "village.interrupt_work"));
    p = advance(reload(p), 6); // Work ends; irritation still blocks only the teacher path.
    assert.equal(everydayFacts(p.state)["village.craftsmanBusy"], false);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "village.route_lesson", context(p)).eligible, false);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "village.route_deduction", context(p)).duration, 6);
    const before = structuredClone(p.state), jump = advance(p, 14);
    let ticks = p; for(let i = 0; i < 14; i++) ticks = advance(ticks, 1);
    assert.deepEqual(ticks.state, jump.state); assert.deepEqual(p.state, before);
    assert.equal(activeMood(jump.state, "oldCraftsman", IRRITATED), null);
    assert.equal(activeMood(jump.state, "player", UNSETTLED), null);
    assert.equal(jump.state.simulation.relationships.oldCraftsman.player.axes.respect, -1);
    assert.ok(jump.state.simulation.relationships.oldCraftsman.player.memories.some(m => m.text.includes("Interrupted")));
    assert.equal(evaluateAction(jump.state, expeditionRegistry, "village.route_lesson", context(jump)).eligible, true);
});

test("waiting and a real material apology settle the same mood without deleting earlier memories or farming respect", () => {
    const p = interrupted();
    const waited = advance(reload(social(p, "village.give_space")), 6);
    const apology = advance(social(p, "village.practical_apology"), 6);
    for(const repaired of [waited, apology]) {
        assert.equal(activeMood(repaired.state, "oldCraftsman", IRRITATED), null);
        assert.equal(activeMood(repaired.state, "player", UNSETTLED), null);
        assert.ok(activeMood(repaired.state, "player", REASSURED));
        assert.equal(repaired.state.simulation.relationships.oldCraftsman.player.axes.respect, 0);
        assert.ok(repaired.state.simulation.relationships.oldCraftsman.player.memories.some(m => m.text.includes("Interrupted")));
        assert.throws(() => social(repaired, "village.practical_apology")); assert.throws(() => social(repaired, "village.give_space"));
        assert.equal(evaluateAction(repaired.state, expeditionRegistry, "village.route_deduction", context(repaired)).duration, 4);
        assert.equal(evaluateAction(repaired.state, expeditionRegistry, "village.route_lesson", context(repaired)).eligible, true);
    }
    assert.equal(waited.gameplay.player.inventory[LOG_KEY], 3); assert.equal(apology.gameplay.player.inventory[LOG_KEY], 2);
    assert.equal(apology.gameplay.oldCraftsman.inventory[LOG_KEY], 1); assert.equal(waited.gameplay.oldCraftsman.inventory[LOG_KEY], undefined);
});

test("a quiet home break eases the player's state independently of the craftsman's lasting memory", () => {
    const p = interrupted(), breakPlan = social(p, "village.quiet_break", {location: "Shack"});
    const calm = advance(reload(breakPlan), 3);
    assert.equal(activeMood(calm.state, "player", UNSETTLED), null); assert.ok(activeMood(calm.state, "player", REASSURED));
    assert.ok(activeMood(calm.state, "oldCraftsman", IRRITATED));
    assert.equal(calm.state.simulation.relationships.oldCraftsman.player.axes.respect, -1);
    assert.deepEqual(calm.gameplay.player.skills, p.gameplay.player.skills);
    assert.match(everydayScene(calm.state, {...context(calm).facts, location: "Shack", "day.hour": 22}), /window is dark/);
    assert.match(everydayScene(calm.state, {...context(calm).facts, location: "Shack", "weather.damp": true}), /Damp footprints/);
});

test("missed morning directions have a paid finite fallback with the same temporary preparation and no backpay", () => {
    const p = fresh(), facts = {"village.circleOpen": false, calendarMinute: 1440 * 360000 + 600};
    const copy = action(p, "village.chalk_copy", facts); assert.equal(copy.external.money, 19);
    const learned = advance(reload(copy), 2);
    assert.equal(inspectCapabilities(learned.state, expeditionRegistry, context(learned))["frontier.preparation"].value, 1);
    assert.equal(learned.state.actors.player.facts["village.chalkRead"], true);
    assert.throws(() => action(learned, "village.chalk_copy", facts));
    assert.deepEqual(learned.gameplay.player.skills, p.gameplay.player.skills);
    assert.equal(inspectCapabilities(advance(learned, 60).state, expeditionRegistry, context(learned))["frontier.preparation"].value, 0);
    assert.equal(evaluateAction(p.state, expeditionRegistry, "village.chalk_copy", context(p)).eligible, false);
});

test("failed publication leaves tuition, moods, provenance and transferred possessions uncommitted", () => {
    const p = interrupted(), before = structuredClone(p);
    const plans = [social(p, "village.practical_apology"), action(fresh(), "village.route_lesson")];
    const saved = {character: {money: 20}, inventories: {person: {main_character: {}, oldCraftsman: {}}},
        levels: {person: {main_character: {skill_xp: {}}, oldCraftsman: {skill_xp: {}}}}};
    const bytes = JSON.stringify(saved);
    for(const plan of plans) assert.throws(() => persistExpansionPlan(plan, {createSave: () => bytes, key: "generated",
        bindings: {player: {category: "person", id: "main_character"}, oldCraftsman: {category: "person", id: "oldCraftsman"}},
        storage: {setItem() {throw new Error("quota");}}}), /quota/);
    assert.deepEqual(p, before); assert.equal(JSON.stringify(saved), bytes);
});
