import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, createContentRegistry, commitAction, advanceSimulation, evaluateAction,
    inspectCapabilities, cancelAction, loadExpansionState, validateExpansionState} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition, SURVEY_KIT_KEY, SURVEY_ROPE_KEY} from "../src/expedition_content.js";
import {applyGameplayEffect, writeGameplayToEnvelope} from "../src/gameplay_transactions.js";
import {prepareGameplayPublication, readGameplayActor} from "../src/gameplay_publication.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {prepareV06Save} from "../src/save_migration.js";

const fresh = seed => initializeExpedition(createExpansionState(seed));
const owned = () => ({player: {inventory: {}, skills: {
    Climbing: {xp: 0, enabled: true, parent: null}, Perception: {xp: 0, enabled: true, parent: null}}, reputation: {Village: -5}}});
const context = (gameplay = owned(), external = {money: 102}, facts = {}) => ({actorId: "player", worldId: "base.frontier",
    gameplay, external, facts: {location: "Village", strength: 12, climbing: 0,
        kits: gameplay.player.inventory[SURVEY_KIT_KEY] || 0, rope: gameplay.player.inventory[SURVEY_ROPE_KEY] || 0, ...facts}});
const action = changes => ({id: "test.work", worldId: "base.frontier", revision: 1, duration: 5,
    repeatable: true, completionScope: "actor", costs: [], outcomes: [{id: "done", chance: 1}], ...changes});
const registry = changes => createContentRegistry({worlds: [{id: "base.frontier"}], actions: [action()], ...changes});

test("native fuzzy availability becomes boolean without creating or mutating skill progress", () => {
    const progress = {Climbing: {total_xp: 60}}, inventory = {[SURVEY_KIT_KEY]: {count: 2}};
    const actor = {getItems: () => inventory, getLevelableComponent: () => ({skill_progress: progress}), reputation: {Village: -5}};
    const result = readGameplayActor(actor, {Climbing: {can_level: true, canGainXP: () => 0.5},
        Perception: {can_level: true, canGainXP: () => 0}}, {});
    assert.equal(result.skills.Climbing.enabled, true); assert.equal(result.skills.Perception.enabled, false);
    assert.equal(result.skills.Perception.present, false); assert.deepEqual(progress, {Climbing: {total_xp: 60}});
    assert.equal(result.inventory[SURVEY_KIT_KEY], 2); assert.equal(inventory[SURVEY_KIT_KEY].count, 2);
});

test("real inventory debit and milestone-sized XP grant survive pending and completed reloads exactly once", () => {
    const inspection = commitAction(fresh(1), expeditionRegistry, "frontier.inspect", context());
    const inspected = advanceSimulation(inspection.state, expeditionRegistry, 3, inspection.external, inspection.gameplay);
    assert.equal(inspected.gameplay.player.skills.Perception.xp, 12);
    const kit = commitAction(inspected.state, expeditionRegistry, "frontier.kit", context(inspected.gameplay, inspected.external));
    assert.equal(kit.gameplay.player.inventory[SURVEY_KIT_KEY], 1);
    const work = commitAction(kit.state, expeditionRegistry, "frontier.secure", context(kit.gameplay, kit.external));
    assert.equal(work.external.money, 94); assert.equal(work.gameplay.player.inventory[SURVEY_KIT_KEY], undefined);
    assert.equal(work.gameplay.player.skills.Climbing.xp, 0);
    const loaded = loadExpansionState(JSON.parse(JSON.stringify(work.state)), expeditionRegistry);
    const done = advanceSimulation(loaded, expeditionRegistry, 8, work.external, work.gameplay);
    assert.equal(done.gameplay.player.skills.Climbing.xp, 60);
    const again = advanceSimulation(loadExpansionState(done.state, expeditionRegistry), expeditionRegistry, 50, done.external, done.gameplay);
    assert.deepEqual(again.gameplay, done.gameplay); assert.deepEqual(again.external, done.external);
});

test("a real carried rope and a learned skill enable the same action, and a rope is kept", () => {
    const state = fresh(1); state.campaign.facts.anchor = true;
    assert.equal(evaluateAction(state, expeditionRegistry, "frontier.anchor_route", context()).eligible, false);
    const rope = commitAction(state, expeditionRegistry, "frontier.rope", context());
    const ctx = context(rope.gameplay, rope.external);
    const preview = evaluateAction(rope.state, expeditionRegistry, "frontier.anchor_route", ctx);
    assert.equal(preview.eligible, true);
    assert.equal(preview.capabilities["frontier.anchors"].contributions[0].kind, "equipment");
    const work = commitAction(rope.state, expeditionRegistry, "frontier.anchor_route", ctx);
    const done = advanceSimulation(work.state, expeditionRegistry, 12, work.external, work.gameplay);
    assert.equal(done.gameplay.player.inventory[SURVEY_ROPE_KEY], 1);
    assert.equal(done.gameplay.player.skills.Climbing.xp, 50);
    assert.equal(evaluateAction(state, expeditionRegistry, "frontier.anchor_route", context(owned(), {money: 0}, {climbing: 5})).eligible, true);
});

test("XP preserves native child/parent inheritance and quality-specific item identity", () => {
    const gameplay = owned();
    gameplay.player.skills = {Swords: {xp: 80, enabled: true, parent: "Weapon mastery"},
        "Weapon mastery": {xp: 100, enabled: true, parent: null}};
    applyGameplayEffect(gameplay, {type: "xp", skill: "Swords", amount: 30}, "player");
    assert.equal(gameplay.player.skills.Swords.xp, 110); assert.equal(gameplay.player.skills["Weapon mastery"].xp, 110);
    const key = JSON.stringify({components: {head: "Iron blade", handle: "Wooden handle"}, quality: 123});
    gameplay.player.inventory[key] = 2;
    applyGameplayEffect(gameplay, {type: "item", key, amount: 1}, "player", true);
    assert.equal(gameplay.player.inventory[key], 1);
    assert.throws(() => applyGameplayEffect(gameplay, {type: "item", key, amount: 2}, "player", true), /Insufficient/);
    applyGameplayEffect(gameplay, {type: "reputation", region: "Village", amount: 1}, "player");
    assert.equal(gameplay.player.reputation.Village, -4);
});

test("source provenance, stacking, world activation, duration and removal support future bloodline definitions", () => {
    const r = registry({capabilities: [{id: "test.power", label: "Power", stacking: "sum", providers: []},
        {id: "test.access", label: "Access", stacking: "max", providers: []}],
    sources: [{id: "test.lineage", label: "Test lineage", kind: "bloodline", revision: 1,
        grants: [{capability: "test.power", amount: 2}, {capability: "test.access", amount: 1}]},
    {id: "test.condition", label: "Test condition", kind: "condition", revision: 1,
        grants: [{capability: "test.power", amount: 3, when: {fact: "location", op: "eq", value: "Village"}},
            {capability: "test.access", amount: 1}]}],
    actions: [action({duration: 0, effects: [{type: "source", sourceId: "test.lineage", operation: "grant"},
        {type: "source", sourceId: "test.condition", operation: "grant", duration: 5}]}),
    action({id: "test.remove", duration: 0, effects: [{type: "source", sourceId: "test.lineage", operation: "remove"}]})]});
    const started = commitAction(fresh(1), r, "test.work", context());
    const caps = inspectCapabilities(started.state, r, context());
    assert.equal(caps["test.power"].value, 5); assert.equal(caps["test.access"].value, 1);
    assert.equal(caps["test.power"].contributions[0].receiptId, started.commitment.id);
    assert.equal(inspectCapabilities(started.state, r, context(owned(), {money: 0}, {location: "Elsewhere"}))["test.power"].value, 2);
    const repeated = commitAction(started.state, r, "test.work", context());
    assert.equal(inspectCapabilities(repeated.state, r, context())["test.power"].value, 5);
    const expired = advanceSimulation(loadExpansionState(repeated.state, r), r, 5, {money: 0});
    assert.equal(inspectCapabilities(expired.state, r, context())["test.power"].value, 2);
    const removed = commitAction(expired.state, r, "test.remove", context());
    assert.equal(inspectCapabilities(removed.state, r, context())["test.power"].value, 0);
    const bad = structuredClone(started.state); bad.actors.player.sources.unknown = {acquiredAt: 0, expiresAt: null, receiptId: "event:1"};
    assert.throws(() => loadExpansionState(bad, r), /Unsupported saved source/);
});

test("weighted rolls preview without RNG use and freeze acquired sources through changed definitions", () => {
    const r = registry({capabilities: [{id: "test.luck", label: "Luck", stacking: "sum", providers: []}],
        sources: [{id: "test.lineage", label: "Test lineage", kind: "bloodline", revision: 1, grants: [{capability: "test.luck", amount: 1}]}],
        rollTables: [{id: "test.discovery", label: "Discovery", revision: 1, outcomes: [
            {id: "lineage", weight: 1, effects: [{type: "source", sourceId: "test.lineage", operation: "grant"}]},
            {id: "none", weight: 3, effects: []}], modifiers: [{when: {fact: "capability.test.luck", op: "gte", value: 1},
                label: "Lineage luck", transfers: [{from: "none", to: "lineage", amount: 0.25}]}]}],
        actions: [action({rolls: [{id: "discovery", tableId: "test.discovery"}]})]});
    const state = fresh(1), before = structuredClone(state);
    assert.equal(evaluateAction(state, r, "test.work", context()).rolls[0].outcomes[0].chance, 0.25);
    assert.deepEqual(state, before);
    const begun = commitAction(state, r, "test.work", context());
    const roll = begun.commitment.rolls[0]; assert.equal(roll.outcome, "lineage");
    const changed = registry({capabilities: [...r.capabilities.values()], sources: [...r.sources.values()],
        actions: [action({revision: 2})]});
    const done = advanceSimulation(loadExpansionState(begun.state, changed), changed, 5, begun.external, begun.gameplay);
    assert.deepEqual(done.state.history[0].rolls[0], roll);
    assert.equal(inspectCapabilities(done.state, changed, context())["test.luck"].value, 1);
    assert.equal(evaluateAction(done.state, r, "test.work", context()).rolls[0].outcomes[0].chance, 0.5);
    assert.equal(advanceSimulation(done.state, changed, 0).state.rng, done.state.rng);
    const bad = registry({actions: [action({requires: {fact: "location", op: "eq", value: "Elsewhere"}})]});
    assert.throws(() => commitAction(state, bad, "test.work", context())); assert.deepEqual(state, before);
});

test("declared cancellation refunds or forfeits once and never rewinds RNG or awards pending rewards", () => {
    for(const policy of ["refund", "forfeit"]) {
        const r = registry({actions: [action({cancellation: policy, costs: [{type: "item", key: SURVEY_KIT_KEY, amount: 1}],
            effects: [{type: "xp", skill: "Climbing", amount: 60}]})]});
        const gameplay = owned(); gameplay.player.inventory[SURVEY_KIT_KEY] = 1;
        const started = commitAction(fresh(1), r, "test.work", context(gameplay));
        const cancelled = cancelAction(started.state, r, started.commitment.id, context(started.gameplay, started.external));
        assert.equal(cancelled.gameplay.player.inventory[SURVEY_KIT_KEY] || 0, policy === "refund" ? 1 : 0);
        assert.equal(cancelled.gameplay.player.skills.Climbing.xp, 0);
        assert.equal(cancelled.state.rng, started.state.rng);
        assert.throws(() => cancelAction(cancelled.state, r, started.commitment.id, context(cancelled.gameplay)), /cannot be cancelled/);
    }
});

test("schema1 migration keeps frozen legacy jobs and converts kit stock once without touching the input", () => {
    const state = fresh(1); state.schema = 1; delete state.actors.player.sources;
    state.actors.player.resources.kits = 2;
    const save = {"game version": "v0.6", character: {}, expansion: state,
        inventories: {person: {main_character: {[SURVEY_KIT_KEY]: {count: 1}}}}};
    const original = structuredClone(save), migrated = prepareV06Save(save);
    assert.equal(migrated.inventories.person.main_character[SURVEY_KIT_KEY].count, 3);
    assert.equal(migrated.expansion.actors.player.resources.kits, 0);
    assert.deepEqual(prepareV06Save(migrated), migrated); assert.deepEqual(save, original);
    assert.equal(loadExpansionState(migrated.expansion, expeditionRegistry).schema, 5);
    assert.equal(validateExpansionState(state).schema, 5);
    assert.deepEqual(state, original.expansion);
    const oldRegistry = registry({actions: [action({effects: [{type: "resource", scope: "external", key: "money", amount: 5}]})]});
    const old = commitAction(fresh(1), oldRegistry, "test.work", context());
    old.state.schema = 1; delete old.state.actors.player.sources;
    delete old.state.pending[0].rolls; delete old.state.pending[0].costs; delete old.state.pending[0].cancellation;
    const resumed = advanceSimulation(loadExpansionState(old.state, oldRegistry), oldRegistry, 5, old.external, old.gameplay);
    assert.equal(resumed.external.money, 107);
    assert.equal(advanceSimulation(resumed.state, oldRegistry, 0, resumed.external, resumed.gameplay).external.money, 107);
});

test("unsupported native XP unlocks and unknown reconstructed items reject before publication", () => {
    const live = {getItems: () => ({}), getLevelableComponent: () => ({skill_progress: {}})};
    const snapshot = owned(); delete snapshot.player.skills.Perception; snapshot.player.skills.Climbing.xp = 60;
    const skills = {Climbing: {base_xp_cost: 50, add_xp({skillXP, xp_to_add}) {skillXP.total_xp += xp_to_add;
        return {unlocks: {quests: ["test.chapter"]}};}}};
    assert.throws(() => prepareGameplayPublication(snapshot, {actors: {player: live}, skills, getItemFromKey() {}}), /unlock transaction adapter/);
    snapshot.player.skills.Climbing.xp = 0; snapshot.player.inventory[SURVEY_KIT_KEY] = 1;
    assert.throws(() => prepareGameplayPublication(snapshot, {actors: {player: live}, skills, getItemFromKey() {throw new Error("Unknown item");}}), /Unknown item/);
});

test("native publication is staged until a successful single envelope write; unrelated data and signed reputation survive", () => {
    const liveInventory = {}, levelable = {skill_progress: {}}, live = {reputation: {Village: -5},
        getItems: () => liveInventory, getLevelableComponent: () => levelable, addSkillMilestoneBonus() {}};
    const skills = {Climbing: {base_xp_cost: 50, add_xp({skillXP, xp_to_add}) {
        skillXP.total_xp += xp_to_add; skillXP.current_level = 1; return {};}}};
    const target = owned(); delete target.player.skills.Perception;
    target.player.inventory[SURVEY_KIT_KEY] = 1; target.player.skills.Climbing.xp = 60;
    const staged = prepareGameplayPublication(target, {actors: {player: live}, skills, getItemFromKey: key => ({key})});
    assert.deepEqual(liveInventory, {}); assert.deepEqual(levelable.skill_progress, {});
    const envelope = {character: {money: 102}, inventories: {person: {main_character: {}}, storage: {player: {kept: {count: 2}}}},
        levels: {person: {main_character: {total_xp: 0, skill_xp: {}}}}, quests: {kept: true}, retired_content: {schema: 1, entries: []}};
    const original = JSON.stringify(envelope), bindings = {player: {category: "person", id: "main_character"}};
    const plan = {state: fresh(1), external: {money: 94}, gameplay: target};
    assert.throws(() => persistExpansionPlan(plan, {createSave: () => original, bindings, key: "test", storage: {
        setItem() {throw new Error("quota");}}}), /quota/);
    assert.deepEqual(liveInventory, {}); assert.deepEqual(levelable.skill_progress, {});
    let disk;
    persistExpansionPlan(plan, {createSave: () => original, bindings, key: "test", storage: {setItem(key, value) {disk = value;}}});
    staged.publish();
    assert.equal(levelable.skill_progress.Climbing.total_xp, 60); assert.equal(liveInventory[SURVEY_KIT_KEY].count, 1);
    const saved = JSON.parse(disk);
    assert.equal(saved.levels.person.main_character.skill_xp.Climbing, 60);
    assert.equal(saved.character.reputation.Village, -5); assert.deepEqual(saved.quests, envelope.quests);
    assert.deepEqual(saved.inventories.storage, envelope.inventories.storage);
    assert.throws(() => writeGameplayToEnvelope(envelope, target, {}), /No persistence binding/);
});

test("invalid source graphs, unknown references, disabled XP and malformed items reject before commitment", () => {
    assert.throws(() => registry({rollTables: [{id: "test.roll", revision: 1, label: "Bad", outcomes: [{id: "zero", weight: 0}]}]}), /positive total/);
    assert.throws(() => registry({sources: [{id: "test.bad", label: "Bad", kind: "bloodline", revision: 1,
        grants: [{capability: "missing", amount: 1}]}]}), /Invalid source/);
    const state = fresh(1), original = structuredClone(state), gameplay = owned(); gameplay.player.skills.Climbing.enabled = false;
    const r = registry({actions: [action({effects: [{type: "xp", skill: "Climbing", amount: 5}]})]});
    assert.throws(() => commitAction(state, r, "test.work", context(gameplay)), /cannot receive/);
    assert.deepEqual(state, original);
    assert.throws(() => registry({actions: [action({effects: [{type: "item", key: "missing", amount: 1}]})]}), /inventory key/);
});
