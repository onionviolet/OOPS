import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState, createContentRegistry, loadExpansionState} from "../src/expansion_engine.js";
import {stageNativeStorageTransfer} from "../src/native_storage_transaction.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {prepareOwnershipPublication} from "../src/acquisition.js";
import {enrollSimulation, commitSimulationCommand} from "../src/simulation.js";

const wood = JSON.stringify({id: "Rough wood log"});
const quality = JSON.stringify({id: "Rat fang", quality: 123});
const fixture = () => ({state: createExpansionState(17), money: 20, equipment: {player: {}},
    gameplay: {player: {inventory: {[wood]: 7, [quality]: 2}, skills: {}, reputation: {}}},
    owners: {player: {[wood]: 7, [quality]: 2}, chest: {[wood]: 3}}});
const request = f => ({direction: "deposit", item_key: wood, count: 5, expectedCount: f.owners.player[wood], sequence: f.state.sequence});
const stage = (f, extra = {}) => stageNativeStorageTransfer({...f, request: {...request(f), ...extra}});

test("chest splits and merges exact keys, clamps native quantities and roundtrips without rewards", () => {
    const f = fixture(), before = structuredClone(f), p = stage(f);
    assert.deepEqual(f, before);
    assert.equal(p.gameplay.player.inventory[wood], 2); assert.equal(p.ownership.chest[wood], 8);
    const next = {...f, state: loadExpansionState(JSON.parse(JSON.stringify(p.state))), gameplay: p.gameplay,
        owners: {player: p.gameplay.player.inventory, chest: p.ownership.chest}};
    const out = stage(next, {direction: "withdraw", count: Infinity, expectedCount: 8});
    assert.equal(out.gameplay.player.inventory[wood], 10); assert.equal(out.ownership.chest[wood], undefined);
    const exact = stage(f, {item_key: quality, expectedCount: 2, count: 10});
    assert.equal(exact.ownership.chest[quality], 2); assert.equal(exact.gameplay.player.inventory[quality], undefined);
    assert.deepEqual(out.state.history, f.state.history); assert.deepEqual(out.gameplay.player.skills, {});
    assert.equal(out.external.money, 20); assert.equal(out.state.rng, f.state.rng);
});

test("stale, duplicate, invalid quantity and unsupported holders reject without partial ownership", () => {
    const f = fixture(), before = structuredClone(f);
    for(const extra of [{sequence: -1}, {expectedCount: 6}, {item_key: JSON.stringify({id: "missing"})},
        {direction: "discard"}, {count: 0}, {count: NaN}, {count: -1}, {count: 0.5}]) assert.throws(() => stage(f, extra));
    assert.throws(() => stage({...f, owners: {...f.owners, warehouse: {}}}), /holder/);
    const p = stage(f);
    assert.throws(() => stageNativeStorageTransfer({...f, state: p.state, request: request(f)}), /stale/);
    assert.deepEqual(f, before);
});

test("equipment and real reserved work block chest disposal", () => {
    const f = fixture();
    const equipped = {...f, equipment: {player: {weapon: wood}}};
    // Real native bag counts exclude the equipped unit; spare copies stay owned.
    assert.equal(stage(equipped).gameplay.player.inventory[wood], 2);
    delete equipped.owners.player[wood]; delete equipped.gameplay.player.inventory[wood];
    assert.throws(() => stage(equipped), /Unequip/);
    f.state.pending.push({context: {actorId: "player"}});
    assert.throws(() => stage(f), /Finish/);
});

test("loan rejection retains custody and the existing lawful return settles once before storing owned stock", () => {
    const r = createContentRegistry({worlds: [{id: "base.frontier"}], simulation: {
        people: [{id: "lender", revision: 1, label: "Lender", worldId: "base.frontier", location: "Village", inventory: "simulation"}],
        commands: [{id: "return", revision: 1, label: "Return", costs: [{type: "custody", from: "$actor", to: "$target", key: wood, count: 1, loanId: "loan.wood", returning: true}], effects: []}]}});
    const f = fixture(), ctx = {actorId: "player", facts: {location: "Village"}, external: {money: 20}, gameplay: f.gameplay};
    let p = enrollSimulation(f.state, r, ctx);
    p.state.simulation.custody["loan.wood"] = {owner: "lender", holder: "player", key: wood, count: 1, at: 0, cause: "fixture:loan"};
    const loan = {...f, state: p.state, gameplay: p.gameplay};
    const before = structuredClone(loan);
    assert.throws(() => stage(loan), /borrowed/); assert.deepEqual(loan, before);
    p = commitSimulationCommand(p.state, r, {id: "return"}, {...ctx, gameplay: p.gameplay, targetId: "lender"});
    assert.equal(p.state.simulation.custody["loan.wood"], undefined); assert.equal(p.state.simulation.owners.lender[wood], 1);
    assert.throws(() => commitSimulationCommand(p.state, r, {id: "return"}, {...ctx, gameplay: p.gameplay, targetId: "lender"}));
    const stored = stage({...f, state: p.state, gameplay: p.gameplay, owners: {...f.owners, player: p.gameplay.player.inventory}});
    assert.equal(stored.gameplay.player.inventory[wood], 1); assert.equal(stored.ownership.chest[wood], 8);
});

test("failed persistence changes neither live inventory nor committed bytes; success publishes both once", () => {
    const f = fixture(), p = stage(f);
    const bag = {[wood]: {item: {id: "wood"}, count: 7}, [quality]: {item: {id: "fang"}, count: 2}}, chest = {[wood]: {item: {id: "wood"}, count: 3}};
    const envelope = {character: {money: 20}, levels: {person: {main_character: {skill_xp: {}}}}, inventories: {person: {main_character: structuredClone(bag)}, storage: {player: structuredClone(chest)}}, expansion: f.state};
    const bytes = JSON.stringify(envelope), before = structuredClone({bag, chest}); let committed = bytes;
    const pub = prepareOwnershipPublication({player: p.gameplay.player.inventory, chest: p.ownership.chest}, {itemsByOwner: {player: bag, chest}, getItem: () => ({})});
    const options = {createSave: () => bytes, key: "fixture", bindings: {player: {category: "person", id: "main_character"}}, ownershipBindings: {chest: {category: "storage", id: "player"}}};
    assert.throws(() => persistExpansionPlan(p, {...options, storage: {setItem() {throw Error("quota");}}}), /quota/);
    assert.equal(committed, bytes); assert.deepEqual({bag, chest}, before);
    persistExpansionPlan(p, {...options, storage: {setItem(k,v) {committed=v;}}}); pub.publish();
    assert.equal(bag[wood].count, 2); assert.equal(chest[wood].count, 8);
    const saved = JSON.parse(committed); assert.equal(saved.inventories.storage.player[wood].count, 8);
    assert.equal(saved.inventories.person.main_character[wood].count, 2);
});
