import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, loadExpansionState, commitAction, evaluateAction, advanceSimulation, cancelAction, inspectCapabilities} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition, SURVEY_KIT_KEY} from "../src/expedition_content.js";
import {townUnlocks, usesTownClock, townQuestView} from "../src/town_content.js";
import {prepareNativeUnlocks} from "../src/native_unlock_transaction.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";

const wood = JSON.stringify({id: "Rough wood log"});
const fresh = () => initializeExpedition(createExpansionState(17));
const game = () => ({player: {inventory: {[wood]: 3}, reputation: {Village: 0, Town: 0}, skills: {Perception: {xp: 0, parent: null, enabled: true}}}});
const ctx = (plan, location = "Town outskirts") => ({actorId: "player", worldId: "base.frontier", external: plan.external || {money: 30},
    gameplay: plan.gameplay || game(), facts: {location, "village.elderMet": true}});
const begin = () => commitAction(fresh(), expeditionRegistry, "town.begin", ctx({}));
const step = (plan, id, location) => commitAction(plan.state, expeditionRegistry, id, ctx(plan, location));
const finish = plan => advanceSimulation(plan.state, expeditionRegistry, plan.commitment.due - plan.state.clock, plan.external, plan.gameplay);

test("old adventures acquire no town access, job, reward, age policy or simulation enrollment", () => {
    const old = createExpansionState(5), copy = structuredClone(old);
    const loaded = initializeExpedition(loadExpansionState(old, expeditionRegistry));
    assert.deepEqual(old, copy); assert.equal(usesTownClock(loaded), false); assert.deepEqual(townUnlocks(old, loaded), []);
    assert.equal(loaded.simulation, null); assert.equal(loaded.chronicle, null); assert.deepEqual(loaded.pending, []);
    assert.deepEqual(loaded.actors.player.sources, {}); assert.deepEqual(loaded.actors.player.completed, {});
    assert.equal(evaluateAction(loaded, expeditionRegistry, "town.begin", ctx({}, "Village")).visible, false);
    assert.equal(evaluateAction(loaded, expeditionRegistry, "town.brief", ctx({}, "Town square")).eligible, false);
    assert.throws(() => commitAction(loaded, expeditionRegistry, "town.begin", ctx({}, "Village")), /Town outskirts/);
});

test("opt-in native town access is saved atomically without changing unrelated quests, locations or dialogue", () => {
    const before = fresh(), plan = commitAction(before, expeditionRegistry, "town.begin", ctx({})), staged = [];
    const access = {getStatus: () => ({is_unlocked: false}), setStatus: value => staged.push(value)};
    const publication = prepareNativeUnlocks(townUnlocks(before, plan.state), {availabilities: {location: {"Town square": access}}, flags: {}});
    const envelope = {character: {money: 30}, availabilities: {location: {"Town square": 0, Village: 1}, textline: {"gateGuard:enter": 1}},
        quests: {"Lost memory": {is_active: true, tasks: [true, true, false]}}, expansion: before,
        inventories: {person: {main_character: {[wood]: {count: 3}}}}, levels: {person: {main_character: {skill_xp: {Perception: 0}}}}};
    let stored = JSON.stringify(envelope); const original = stored;
    const opts = {createSave: () => original, key: "fixture", bindings: {player: {category: "person", id: "main_character"}}, unlockPublication: publication};
    assert.throws(() => persistExpansionPlan(plan, {...opts, storage: {setItem() {throw new Error("quota");}}}), /quota/);
    assert.equal(stored, original); assert.deepEqual(staged, []); assert.equal(before.actors.player.facts["town.joined"], false);
    persistExpansionPlan(plan, {...opts, storage: {setItem(key, value) {stored = value;}}});
    const saved = JSON.parse(stored); assert.equal(saved.availabilities.location["Town square"], 1);
    assert.deepEqual(saved.quests, envelope.quests); assert.deepEqual(saved.availabilities.textline, envelope.availabilities.textline);
    assert.equal(saved.availabilities.location.Village, 1); assert.equal(saved.character.money, 30);
    assert.deepEqual(staged, []); publication.publish(); assert.deepEqual(staged, [{is_unlocked: true}]);
    const restored = initializeExpedition(loadExpansionState(saved.expansion, expeditionRegistry));
    assert.deepEqual(townUnlocks(plan.state, restored), []); assert.equal(restored.chronicle, null); assert.equal(restored.simulation, null);
});

test("survey and timber are alternatives; unfinished timber refunds and saved survey settles once", () => {
    const briefing = step(begin(), "town.brief", "Town square");
    const timber = step(briefing, "town.timber", "Village"); assert.equal(timber.gameplay.player.inventory[wood], 1);
    const cancelled = cancelAction(timber.state, expeditionRegistry, timber.commitment.id, ctx(timber, "Village"));
    assert.equal(cancelled.gameplay.player.inventory[wood], 3); assert.equal(cancelled.state.actors.player.facts["town.worked"], false);
    const survey = step(cancelled, "town.scout", "Forest road");
    survey.state = initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(survey.state)), expeditionRegistry));
    const worked = finish(survey); assert.equal(worked.gameplay.player.skills.Perception.xp, 6);
    assert.equal(worked.gameplay.player.inventory[wood], 3); assert.equal(worked.state.actors.player.facts["town.approach"], "survey");
    assert.throws(() => step(worked, "town.timber", "Village"));
    const paid = step(worked, "town.settle", "Town square");
    assert.equal(paid.external.money, 36); assert.equal(paid.gameplay.player.inventory[SURVEY_KIT_KEY], 1); assert.equal(paid.gameplay.player.reputation.Town, 1);
    assert.throws(() => step(paid, "town.settle", "Town square"));
    const returned = step(paid, "town.return", "Village");
    assert.equal(returned.gameplay.player.reputation.Village, 1); assert.equal(returned.state.chronicle, null); assert.equal(returned.state.simulation, null);
    assert.equal(inspectCapabilities(returned.state, expeditionRegistry, ctx(returned, "Village"))["frontier.preparation"].value, 1);
    const reloaded = {...returned, state: initializeExpedition(loadExpansionState(returned.state, expeditionRegistry))};
    assert.throws(() => step(reloaded, "town.return", "Village"));
    const later = advanceSimulation(reloaded.state, expeditionRegistry, 100, reloaded.external, reloaded.gameplay);
    assert.deepEqual(later.gameplay, returned.gameplay); assert.equal(later.external.money, 36);
});

test("completed timber really consumes gathered inputs and leaves its own retained aftermath", () => {
    const briefing = step(begin(), "town.brief", "Town square"), timber = step(briefing, "town.timber", "Village");
    const worked = finish(timber); assert.equal(worked.gameplay.player.inventory[wood], 1); assert.equal(worked.gameplay.player.skills.Perception.xp, 0);
    assert.throws(() => step(worked, "town.scout", "Forest road"));
    const returned = step(step(worked, "town.settle", "Town square"), "town.return", "Village");
    assert.equal(returned.state.actors.player.facts["town.approach"], "timber"); assert.equal(returned.gameplay.player.inventory[SURVEY_KIT_KEY], 1);
});

test("quest tracking reveals only accepted work, not future outcomes or frozen results", () => {
    assert.equal(townQuestView(fresh()), null);
    const permit = begin(), joined = townQuestView(permit.state);
    assert.match(joined.objective, /Town square/); assert.doesNotMatch(joined.description, /timber|kit|coins/i);
    const briefing = step(permit, "town.brief", "Town square"), accepted = townQuestView(briefing.state);
    assert.match(accepted.description, /six wooden coins/); assert.match(accepted.objective, /Forest road/);
    assert.doesNotMatch(accepted.objective, /ledger|drainage/);
    const survey = step(briefing, "town.scout", "Forest road"), pending = townQuestView(survey.state);
    assert.match(pending.objective, /4 min remaining/);
    assert.doesNotMatch(pending.objective, /correct|mud|sound/);
    const worked = finish(survey);
    assert.match(townQuestView(worked.state).objective, /Deliver/);
    const paid = step(worked, "town.settle", "Town square");
    assert.match(townQuestView(paid.state).objective, /Share/);
    const returned = step(paid, "town.return", "Village");
    assert.equal(townQuestView(returned.state).completed, true);
});

test("repeated quest projections and reload neither reward nor mutate the campaign", () => {
    const paid = step(finish(step(step(begin(), "town.brief", "Town square"), "town.scout", "Forest road")), "town.settle", "Town square");
    const before = structuredClone(paid);
    for(let i=0; i<10; i++) townQuestView(paid.state);
    assert.deepEqual(paid, before);
    const restored = initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(paid.state)), expeditionRegistry));
    assert.deepEqual(townQuestView(restored), townQuestView(paid.state));
    assert.throws(() => step({...paid, state: restored}, "town.settle", "Town square"));
});
