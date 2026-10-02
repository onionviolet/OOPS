import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, loadExpansionState, validateExpansionState, createContentRegistry,
    evaluateAction, commitAction, advanceSimulation as advance, checkpointScenario, rewindScenario,
    previewScenarioRewind} from "../src/expansion_engine.js";
import {expeditionRegistry as registry, initializeExpedition, SURVEY_KIT_KEY} from "../src/expedition_content.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {encodeSaveFile, decodeSaveFile} from "../src/save_files.js";

const fresh = seed => initializeExpedition(createExpansionState(seed));
const gameplay = (kits = 0) => ({player: {inventory: kits ? {[SURVEY_KIT_KEY]: kits} : {},
    skills: {Climbing: {xp: 0, parent: null, enabled: true}, Perception: {xp: 0, parent: null, enabled: true}}, reputation: {Village: 0}}});
const advanceSimulation = (state, registry, minutes, external, owned = gameplay()) => advance(state, registry, minutes, external, owned);
const context = (money = 102, facts = {}) => ({actorId: "player", worldId: "base.frontier",
    external: {money}, gameplay: gameplay(facts.kits || 0), facts: {location: "Village", strength: 12, climbing: 0, kits: 0, rope: 0, ...facts}});
const domain = () => ({facts: {}, resources: {}, completed: {}});
const inspect = () => {
    const started = commitAction(fresh(1), registry, "frontier.inspect", context());
    return advanceSimulation(started.state, registry, 3, started.external).state;
};
const fixtureAction = changes => ({id: "test.work", worldId: "base.frontier", revision: 1, duration: 4,
    repeatable: false, completionScope: "actor", costs: [],
    outcomes: [{id: "done", chance: 1, effects: []}], ...changes});
const fixtureRegistry = (actions, opportunities = []) => createContentRegistry({worlds: [{id: "base.frontier"}], actions, opportunities});

test("preview is pure and explains knowledge, context, combined costs and actual odds", () => {
    const state = fresh(1), before = JSON.stringify(state);
    const preview = evaluateAction(state, registry, "frontier.secure", context());
    assert.equal(preview.eligible, false); assert.match(preview.reasons.join(" "), /anchor points.*kit/);
    assert.equal(JSON.stringify(state), before);
    assert.equal(evaluateAction(state, registry, "frontier.extract", context()).outcomes[0].chance, 0.8);
    const r = fixtureRegistry([fixtureAction({costs: [{scope: "external", key: "money", amount: 6},
        {scope: "external", key: "money", amount: 6}]})]);
    assert.equal(evaluateAction(state, r, "test.work", context(10)).eligible, false);
    assert.throws(() => commitAction(state, r, "test.work", context(10)), /Needs 12/);
    assert.equal(evaluateAction(state, registry, "frontier.kit", context(7)).eligible, false);
});

test("kit costs reserve once; frozen result survives reload, content revision and changed stats", () => {
    const state = inspect();
    const supplied = commitAction(state, registry, "frontier.kit", context());
    assert.equal(supplied.external.money, 94); assert.equal(supplied.gameplay.player.inventory[SURVEY_KIT_KEY], 1);
    const begun = commitAction(supplied.state, registry, "frontier.secure", context(94, {kits: 1}));
    assert.equal(begun.gameplay.player.inventory[SURVEY_KIT_KEY], undefined); assert.equal(begun.external.money, 94);
    const pending = begun.state.pending[0];
    const saved = loadExpansionState(JSON.parse(JSON.stringify(begun.state)), registry);
    assert.deepEqual(saved.pending[0], pending);
    assert.throws(() => commitAction(saved, registry, "frontier.secure", context(94)), /committed/);
    assert.throws(() => commitAction(saved, registry, "frontier.extract", context(94)), /current expedition/);
    const completed = advanceSimulation(saved, registry, 8, {money: 94});
    assert.equal(completed.state.history.at(-1).draw, pending.draw);
    assert.equal(completed.state.history.at(-1).outcome, pending.outcome);
    assert.equal(completed.external.money, 110);
    const reloaded = loadExpansionState(JSON.parse(JSON.stringify(completed.state)), registry);
    assert.equal(advanceSimulation(reloaded, registry, 0, completed.external).external.money, 110);
    assert.throws(() => commitAction(reloaded, registry, "frontier.secure", context(110)), /surveyed/);
    const altered = fixtureRegistry([fixtureAction({id: "frontier.secure", revision: 2,
        outcomes: [{id: "different", chance: 1, effects: [{type: "resource", scope: "external", key: "money", amount: 999}]}]})],
    [{id: "frontier.departure"}]);
    assert.equal(advanceSimulation(saved, altered, 8, {money: 94}).external.money, 110);
});

test("both survey routes are viable and recorded guide condition changes departure rewards", () => {
    for(const [seed, expected] of [[1, "ready"], [999999, "tired"]]) {
        const state = inspect(); state.rng = seed;
        const begun = commitAction(state, registry, "frontier.extract", context());
        const done = advanceSimulation(begun.state, registry, 4, begun.external);
        assert.equal(done.state.worlds["base.frontier"].facts.crossing, "unrepaired");
        assert.equal(done.state.worlds["base.frontier"].facts["guide.condition"], expected);
        const available = advanceSimulation(done.state, registry, 12, done.external);
        const preview = evaluateAction(available.state, registry, "frontier.depart", context(available.external.money));
        assert.equal(preview.outcomes.find(o => o.chance === 1).id, expected === "ready" ? "guided" : "escort");
        const depart = commitAction(available.state, registry, "frontier.depart", context(available.external.money));
        assert.equal(preview.duration, expected === "ready" ? 3 : 6);
        const after = advanceSimulation(depart.state, registry, preview.duration, depart.external);
        assert.equal(after.external.money - available.external.money, expected === "ready" ? 12 : 6);
        assert.equal(advanceSimulation(after.state, registry, 3, after.external).external.money, after.external.money);
    }
});

test("equal simulation duration in ticks or a travel jump crosses the same deadlines and expiry", () => {
    const start = commitAction(inspect(), registry, "frontier.extract", context());
    const jumped = advanceSimulation(start.state, registry, 150, start.external);
    let ticks = {state: start.state, external: start.external, gameplay: start.gameplay};
    for(let i = 0; i < 150; i++) ticks = advanceSimulation(ticks.state, registry, 1, ticks.external, ticks.gameplay);
    assert.deepEqual(jumped.state, ticks.state); assert.deepEqual(jumped.external, ticks.external);
    assert.equal(Object.values(jumped.state.opportunities)[0].status, "expired");
    assert.equal(evaluateAction(jumped.state, registry, "frontier.depart", context()).eligible, false);
});

test("repairing the crossing enables a more valuable delivery even if the guide needs rest", () => {
    const state = inspect(); state.actors.player.resources.kits = 1; state.rng = 999999;
    const begun = commitAction(state, registry, "frontier.secure", context(102, {kits: 1}));
    const done = advanceSimulation(begun.state, registry, 20, begun.external);
    assert.equal(done.state.worlds["base.frontier"].facts["guide.condition"], "tired");
    const preview = evaluateAction(done.state, registry, "frontier.depart", context(done.external.money));
    assert.equal(preview.outcomes.find(o => o.chance === 1).id, "delivery");
    assert.equal(preview.duration, 6);
    const delivery = commitAction(done.state, registry, "frontier.depart", context(done.external.money));
    assert.equal(advanceSimulation(delivery.state, registry, 6, delivery.external).external.money - done.external.money, 18);
});

test("blocking scheduled choices stop exactly at their boundary and return unspent catch-up", () => {
    const r = fixtureRegistry([fixtureAction({duration: 0,
        outcomes: [{id: "done", chance: 1, effects: [{type: "opportunity", id: "test.choice", delay: 5, lifetime: 10, blocking: true}]}]}),
    fixtureAction({id: "test.choose", duration: 0, opportunityId: "test.choice"}),
    fixtureAction({id: "test.long", duration: 10})], [{id: "test.choice"}]);
    const start = commitAction(fresh(1), r, "test.work", context());
    assert.throws(() => commitAction(start.state, r, "test.long", context()), /cross a waiting choice/);
    const stopped = advanceSimulation(start.state, r, 100, start.external);
    assert.equal(stopped.state.clock, 5); assert.equal(stopped.remaining, 95); assert.equal(stopped.stoppedAtChoice, true);
    const restored = loadExpansionState(JSON.parse(JSON.stringify(stopped.state)), r);
    assert.equal(evaluateAction(restored, r, "test.work", context()).eligible, false);
    const chosen = commitAction(restored, r, "test.choose", context());
    assert.equal(advanceSimulation(chosen.state, r, stopped.remaining, chosen.external).state.clock, 100);
});

test("actors have independent budgets and one assignment each, with stable same-time ordering", () => {
    const r = fixtureRegistry([fixtureAction({costs: [{scope: "actor", key: "supplies", amount: 1}],
        outcomes: [{id: "done", chance: 1, effects: [{type: "resource", scope: "actor", key: "reports", amount: 1}]}]})]);
    const state = fresh(1); state.actors.player.resources.supplies = 1;
    state.actors.peer = {...domain(), worldId: "base.frontier"};
    assert.throws(() => commitAction(state, r, "test.work", {...context(), actorId: "peer"}), /supplies/);
    state.actors.peer.resources.supplies = 1;
    const player = commitAction(state, r, "test.work", context());
    const peer = commitAction(player.state, r, "test.work", {...context(), actorId: "peer"});
    const done = advanceSimulation(peer.state, r, 4, peer.external).state;
    assert.equal(done.actors.player.resources.reports, 1); assert.equal(done.actors.peer.resources.reports, 1);
    assert.deepEqual(done.history.map(h => h.actorId), ["player", "peer"]);
});

test("invalid content and effects fail before mutation or spending", () => {
    assert.throws(() => fixtureRegistry([fixtureAction(), fixtureAction()]), /unique/);
    assert.throws(() => fixtureRegistry([fixtureAction({outcomes: [{id: "bad", chance: 0.9}]})]), /sum/);
    assert.throws(() => fixtureRegistry([fixtureAction({effects: [{type: "magic_global"}]})]), /Unsupported/);
    const state = fresh(1), before = structuredClone(state);
    const r = fixtureRegistry([fixtureAction({costs: [{scope: "external", key: "money", amount: 8}],
        outcomes: [{id: "done", chance: 1, effects: [{type: "resource", scope: "scenario", key: "missing", amount: 1}]}]})]);
    assert.throws(() => commitAction(state, r, "test.work", context()), /Missing scenario/);
    assert.deepEqual(state, before);
    assert.throws(() => commitAction(state, registry, "frontier.kit", context(), 9), /stale/);
});

test("isolated rewind previews losses, retains memory and cannot export temporary rewards", () => {
    const r = fixtureRegistry([fixtureAction({completionScope: "scenario", duration: 0,
        costs: [{scope: "scenario", key: "supplies", amount: 1}],
        outcomes: [{id: "done", chance: 1, effects: [{type: "resource", scope: "scenario", key: "relic", amount: 1},
            {type: "fact", scope: "campaign", key: "learned", value: true}]}]})]);
    const state = fresh(1); state.scenarios.trial = domain(); state.scenarios.trial.resources.supplies = 1;
    const checkpoint = checkpointScenario(state, "trial", "trial.start");
    const begun = commitAction(checkpoint, r, "test.work", {...context(), scenarioId: "trial"});
    assert.equal(previewScenarioRewind(begun.state, "trial.start").lost.resources.relic, 1);
    const rewound = rewindScenario(begun.state, "trial.start");
    assert.equal(rewound.scenarios.trial.resources.supplies, 1); assert.equal(rewound.scenarios.trial.resources.relic, undefined);
    assert.equal(rewound.campaign.facts.learned, true); assert.equal(rewound.rng, begun.state.rng);
    assert.ok(rewound.sequence > begun.state.sequence);
    const unsafe = fixtureRegistry([fixtureAction({completionScope: "scenario", effects: [{type: "resource", scope: "external", key: "money", amount: 1}]})]);
    assert.throws(() => commitAction(checkpoint, unsafe, "test.work", {...context(), scenarioId: "trial"}), /cannot export/);
});

test("legacy migration, dormant payload and Unicode file roundtrip retain new commitments", () => {
    assert.equal(loadExpansionState(undefined, registry).schema, 2);
    const begun = commitAction(fresh(1), registry, "frontier.inspect", context());
    const envelope = {"game version": "v0.5.5.30", "current time": {year: 999, month: 4, day: 1, hour: 8, minute: 0},
        "current location": "Village", character: {name: "魏宝", money: 102, xp: {total_xp: 0}, inventory: {}, equipment: {}},
        skills: {Literacy: {total_xp: 0}}, locations: {}, activities: {}, dialogues: {}, traders: {},
        expansion: begun.state, retired_content: {schema: 1, entries: [{path: ["cultivation"], value: {qi: 78}}]}};
    const decoded = decodeSaveFile(encodeSaveFile(JSON.stringify(envelope)), "v0.5.5.30");
    assert.deepEqual(decoded.expansion, begun.state); assert.deepEqual(decoded.retired_content, envelope.retired_content);
    for(const mutate of [s => s.schema = 3, s => s.rng = 0, s => s.actors.player.resources.kits = -1,
        s => s.pending[0].draw = 1, s => s.pending[0].effects = [{type: "bad"}], s => s.pending[0].actionId = "missing.action"]) {
        const bad = structuredClone(begun.state); mutate(bad);
        assert.throws(() => loadExpansionState(bad, registry));
    }
});

test("durable envelope write is atomic on failure, includes costs, and preserves unrelated fields", () => {
    const original = {character: {money: 102}, inventories: {person: {main_character: {}}},
        levels: {person: {main_character: {total_xp: 0, skill_xp: {}}}}, quests: {kept: true}, retired_content: {schema: 1, entries: []}};
    const bindings = {player: {category: "person", id: "main_character"}};
    const plan = commitAction(fresh(1), registry, "frontier.kit", context());
    let disk = JSON.stringify(original), writes = 0;
    assert.throws(() => persistExpansionPlan(plan, {createSave: () => disk, key: "test", bindings,
        storage: {setItem() {throw new Error("quota");}}}), /quota/);
    assert.equal(disk, JSON.stringify(original)); assert.equal(original.character.money, 102);
    persistExpansionPlan(plan, {createSave: () => disk, key: "test", bindings, storage: {setItem(key, value) {disk = value; writes++;}}});
    const saved = JSON.parse(disk);
    assert.equal(writes, 1); assert.equal(saved.character.money, 94); assert.equal(saved.inventories.person.main_character[SURVEY_KIT_KEY].count, 1);
    assert.deepEqual(saved.quests, original.quests); assert.deepEqual(saved.retired_content, original.retired_content);
    assert.throws(() => persistExpansionPlan(plan, {createSave: () => undefined, storage: {}, key: "test"}), /No valid save/);
});
