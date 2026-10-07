import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, loadExpansionState, createContentRegistry, commitAction, advanceSimulation,
    evaluateAction, cancelAction, inspectCapabilities} from "../src/expansion_engine.js";
import {initializeExpedition, expeditionRegistry, SURVEY_KIT_KEY} from "../src/expedition_content.js";
import {NOTES_KEY, TOKEN_KEY, LOG_KEY, villageScene, usesVillageClock} from "../src/village_content.js";
import {calendarMinutes, recurringWindow} from "../src/world_rhythm.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";

const fresh = () => initializeExpedition(createExpansionState(17));
const game = () => ({player: {inventory: {}, reputation: {Village: 0}, skills: {
    Perception: {xp: 0, parent: null, enabled: true}, Climbing: {xp: 0, parent: null, enabled: true}}}});
const minute = calendarMinutes({year: 999, month: 4, day: 1, hour: 8, minute: 0});
const context = (gameplay = game(), facts = {}, money = 100) => ({actorId: "player", worldId: "base.frontier", gameplay,
    external: {money}, facts: {location: "Village", calendarMinute: minute, perception: 0,
        "village.elderMet": true, "village.craftsmanMet": true, "village.shackUnlocked": true,
        "village.notesRead": false, kits: gameplay.player.inventory[SURVEY_KIT_KEY] || 0, ...facts}});
const complete = plan => advanceSimulation(plan.state, expeditionRegistry, plan.commitment.due - plan.state.clock, plan.external, plan.gameplay);
const discovery = () => complete(commitAction(fresh(), expeditionRegistry, "village.waypost", context()));

test("finite discovery survives a pending reload, honors ordinary Perception, and grants native objects exactly once", () => {
    const old = fresh(); old.schema = 3; delete old.chronicle;
    const original = structuredClone(old), migrated = loadExpansionState(old, expeditionRegistry);
    assert.deepEqual(old, original); assert.equal(migrated.chronicle, null); assert.equal(usesVillageClock(migrated), false);
    const ctx = context(), snapshot = structuredClone(migrated);
    assert.equal(evaluateAction(migrated, expeditionRegistry, "village.waypost", ctx).duration, 3);
    assert.equal(evaluateAction(migrated, expeditionRegistry, "village.waypost", context(game(), {perception: 3})).duration, 2);
    assert.deepEqual(migrated, snapshot);
    const plan = commitAction(migrated, expeditionRegistry, "village.waypost", ctx);
    assert.equal(usesVillageClock(plan.state), true); assert.deepEqual(plan.gameplay.player.inventory, {});
    const done = complete({...plan, state: loadExpansionState(JSON.parse(JSON.stringify(plan.state)), expeditionRegistry)});
    assert.equal(done.gameplay.player.inventory[NOTES_KEY], 1); assert.equal(done.gameplay.player.inventory[TOKEN_KEY], 1);
    assert.equal(done.gameplay.player.skills.Perception.xp, 6); assert.equal(usesVillageClock(done.state), true);
    assert.equal(evaluateAction(done.state, expeditionRegistry, "village.waypost", context(done.gameplay)).visible, false);
    assert.throws(() => commitAction(done.state, expeditionRegistry, "village.waypost", context(done.gameplay)));
    const replay = advanceSimulation(loadExpansionState(done.state, expeditionRegistry), expeditionRegistry, 1440, done.external, done.gameplay);
    assert.deepEqual(replay.gameplay, done.gameplay); assert.equal(replay.state.history.length, 1);
});

test("token recognition respects native NPC access and atomically trades the real token for retained learning", () => {
    const found = discovery(), before = structuredClone(found);
    assert.throws(() => commitAction(found.state, expeditionRegistry, "village.return_token", context(found.gameplay, {"village.craftsmanMet": false})), /craftsman/);
    assert.deepEqual(found, before);
    const given = commitAction(found.state, expeditionRegistry, "village.return_token", context(found.gameplay));
    assert.equal(given.gameplay.player.inventory[TOKEN_KEY], undefined); assert.equal(given.gameplay.player.inventory[NOTES_KEY], 1);
    assert.equal(given.gameplay.player.reputation.Village, 1); assert.equal(given.state.chronicle, null);
    const loaded = loadExpansionState(given.state, expeditionRegistry); loaded.campaign.facts.anchor = true;
    assert.equal(evaluateAction(loaded, expeditionRegistry, "frontier.pack", context(given.gameplay)).duration, 2);
    assert.match(villageScene(loaded, {"village.notesRead": false}), /recognizes you/);
    assert.throws(() => commitAction(loaded, expeditionRegistry, "village.return_token", context(given.gameplay)));
});

test("possessing a booklet is not understanding it; reading opens a distinct unrepaired but safe route", () => {
    const found = discovery(); found.state.campaign.facts.anchor = true;
    assert.equal(evaluateAction(found.state, expeditionRegistry, "village.dry_bank", context(found.gameplay)).eligible, false);
    const plan = commitAction(found.state, expeditionRegistry, "village.dry_bank", context(found.gameplay, {"village.notesRead": true}));
    const done = complete(plan);
    assert.equal(done.state.actors.player.facts.surveyed, true);
    assert.equal(done.state.worlds["base.frontier"].facts.crossing, "unrepaired");
    assert.equal(done.state.worlds["base.frontier"].facts["guide.condition"], "ready");
    assert.equal(done.gameplay.player.skills.Climbing.xp, 25); assert.equal(done.gameplay.player.inventory[TOKEN_KEY], 1);
    assert.equal(done.gameplay.player.inventory[NOTES_KEY], 1);
    assert.equal(Object.values(done.state.opportunities)[0].status, "scheduled");
});

test("home board consumes gathered materials, refunds cancelled work and packs an actual kit after reload", () => {
    const found = discovery(); found.gameplay.player.inventory[LOG_KEY] = 3; found.state.campaign.facts.anchor = true;
    const facts = {location: "Shack", "village.notesRead": true};
    const build = commitAction(found.state, expeditionRegistry, "village.route_board", context(found.gameplay, facts));
    assert.equal(build.external.money, 98); assert.equal(build.gameplay.player.inventory[LOG_KEY], 1);
    const cancelled = cancelAction(build.state, expeditionRegistry, build.commitment.id, context(build.gameplay, facts, build.external.money));
    assert.equal(cancelled.external.money, 100); assert.equal(cancelled.gameplay.player.inventory[LOG_KEY], 3);
    assert.equal(cancelled.state.actors.player.facts["village.board"], false);
    const built = complete(commitAction(cancelled.state, expeditionRegistry, "village.route_board", context(cancelled.gameplay, facts)));
    const packed = complete(commitAction(loadExpansionState(built.state, expeditionRegistry), expeditionRegistry,
        "village.board_pack", context(built.gameplay, facts, built.external.money)));
    assert.equal(packed.external.money, 96); assert.equal(packed.gameplay.player.inventory[LOG_KEY], undefined);
    assert.equal(packed.gameplay.player.inventory[SURVEY_KIT_KEY], 1);
    assert.match(villageScene(packed.state, {"village.notesRead": true}), /route board/);
    assert.equal(evaluateAction(packed.state, expeditionRegistry, "village.board_pack", context(packed.gameplay, facts)).eligible, false);
});

test("recurring windows use exact native dates, inclusive opening, exclusive closure and bounded next occurrence", () => {
    const s = {period: 1440, opens: 480, closes: 600};
    assert.equal(recurringWindow(s, minute - 1).nextIn, 1); assert.equal(recurringWindow(s, minute).open, true);
    assert.equal(recurringWindow(s, minute + 119).open, true); assert.equal(recurringWindow(s, minute + 120).open, false);
    assert.equal(recurringWindow(s, minute + 120).nextIn, 1320);
    assert.equal(recurringWindow(s, minute + 1440 * 100000).open, true);
    assert.equal(calendarMinutes({year: 1000, month: 1, day: 1, hour: 0, minute: 0}) -
        calendarMinutes({year: 999, month: 12, day: 30, hour: 23, minute: 59}), 1);
    assert.throws(() => calendarMinutes({year: 999, month: 12, day: 0, hour: 0, minute: 0}), /calendar/);
    assert.throws(() => recurringWindow(s, minute, "4"), /claim/);
    assert.throws(() => recurringWindow({...s, closes: 1441}, minute), /schedule/);
});

test("daily claims survive reload without backpay; knowledge expires equally for a time jump or ticks", () => {
    const found = discovery(); found.state.campaign.facts.anchor = true;
    const attended = commitAction(found.state, expeditionRegistry, "village.morning_circle", context(found.gameplay));
    const loaded = loadExpansionState(attended.state, expeditionRegistry);
    assert.equal(inspectCapabilities(loaded, expeditionRegistry, context(attended.gameplay))["frontier.preparation"].value, 1);
    assert.equal(evaluateAction(loaded, expeditionRegistry, "village.morning_circle", context(attended.gameplay)).schedule.claimed, true);
    assert.throws(() => commitAction(loaded, expeditionRegistry, "village.morning_circle", context(attended.gameplay)), /Already attended/);
    const jump = advanceSimulation(loaded, expeditionRegistry, 60, attended.external, attended.gameplay);
    let tick = {...attended, state: loaded};
    for(let i = 0; i < 60; i++) tick = advanceSimulation(tick.state, expeditionRegistry, 1, tick.external, tick.gameplay);
    assert.deepEqual(tick.state, jump.state);
    assert.equal(inspectCapabilities(jump.state, expeditionRegistry, context(jump.gameplay))["frontier.preparation"].value, 0);
    const next = commitAction(jump.state, expeditionRegistry, "village.morning_circle", context(jump.gameplay, {calendarMinute: minute + 1440 * 9}));
    assert.equal(next.state.history.filter(r => r.actionId === "village.morning_circle").length, 2);
    const bad = structuredClone(next.state); bad.actors.player.facts["cycle.village.morning_circle"] = 0.25;
    assert.throws(() => loadExpansionState(bad, expeditionRegistry), /claim/);
});

test("a failed durable write publishes neither a discovery nor a daily claim", () => {
    for(const id of ["village.waypost", "village.morning_circle"]) {
        const before = id === "village.waypost" ? {state: fresh(), gameplay: game()} : discovery();
        before.state.campaign.facts.anchor = true;
        const old = structuredClone(before), plan = commitAction(before.state, expeditionRegistry, id, context(before.gameplay));
        const envelope = {character: {money: 100}, inventories: {person: {main_character: {}}}, levels: {person: {main_character: {skill_xp: {}}}}};
        let stored = JSON.stringify(envelope);
        assert.throws(() => persistExpansionPlan(plan, {createSave: () => stored, key: "fixture",
            bindings: {player: {category: "person", id: "main_character"}}, storage: {setItem() {throw new Error("quota");}}}), /quota/);
        assert.equal(stored, JSON.stringify(envelope)); assert.deepEqual(before, old);
    }
});

test("recurring reservations are frozen at commitment and cancellation cannot reopen that occurrence", () => {
    const definition = {...expeditionRegistry.actions.get("village.morning_circle"), duration: 1, cancellation: "refund"};
    const registry = createContentRegistry({...Object.fromEntries(Object.entries(expeditionRegistry).filter(([, map]) => map instanceof Map).map(([key,map]) => [key, [...map.values()]])),
        actions: [...expeditionRegistry.actions.values()].map(a => a.id === definition.id ? definition : a)});
    const found = discovery(); found.state.campaign.facts.anchor = true;
    const plan = commitAction(found.state, registry, definition.id, context(found.gameplay));
    const cancelled = cancelAction(plan.state, registry, plan.commitment.id, context(plan.gameplay));
    assert.equal(evaluateAction(cancelled.state, registry, definition.id, context(cancelled.gameplay)).eligible, false);
    assert.equal(cancelled.state.actors.player.sources["village.morning_signs"], undefined);
    assert.equal(evaluateAction(cancelled.state, registry, definition.id, context(cancelled.gameplay, {calendarMinute: minute + 1440})).eligible, true);
});
