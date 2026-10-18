import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {beginNativeCraftTransaction, nativeCraftQuestOwners} from '../src/native_craft_transaction.js';

class Item {getName() {return 'Original material';}}
class Quest {
    #availability = {is_unlocked: false, is_finished: false};
    constructor(tasks = []) {this.quest_tasks = tasks;}
    getAvailabilityComponent() {return this.#availability;}
}
function fixture() {
    const material = new Item(), stack = {item: material, count: 3};
    const inventory = {material: stack};
    const progress = {current_level: 9, total_xp: 39};
    const levelable = {skill_progress: {Smelting: progress}, stats: {flat: {skill_milestones: {}}, full: {health: 25}}, xp_bonuses: {multiplier: {skills: {}}}};
    const quest = new Quest([new Quest()]), quests = {q: quest}, active = {q: quest};
    const availability = {recipe: {springsteel: {is_unlocked: false}}};
    const itemLog = {items: {material: {count: 3}}}, stats = {total_crafting_attempts: 0};
    const favourites = {material: true}, affected = {};
    let fort = {history: []}, ledger = {sequence: 0};
    const begin = () => beginNativeCraftTransaction({owners: [inventory, levelable, availability, itemLog, stats, favourites, affected, ...nativeCraftQuestOwners(quests, active)], bindings: [
        {get: () => fort, set: value => {fort = value;}}, {get: () => ledger, set: value => {ledger = value;}}
    ]});
    function mutate() {
        delete inventory.material; inventory.output = {item: new Item(), count: 2};
        progress.current_level = 10; progress.total_xp = 45;
        levelable.stats.flat.skill_milestones.strength = 2;
        levelable.stats.full = {health: 60}; levelable.xp_bonuses.multiplier.skills.all = 1.05;
        availability.recipe.springsteel.is_unlocked = true;
        quest.getAvailabilityComponent().is_finished = true;
        quest.quest_tasks[0].getAvailabilityComponent().is_finished = true;
        delete active.q; active.new = new Quest();
        itemLog.items.output = {count: 2}; stats.total_crafting_attempts += 2;
        delete favourites.material; affected.Smelting = ['Crafting'];
        fort = {history: ['craft']}; ledger = {sequence: ledger.sequence + 1};
    }
    return {begin, mutate, inventory, stack, material, levelable, progress, quest, active, availability, itemLog, stats, favourites, affected, fort: () => fort, ledger: () => ledger};
}
test('rejected write restores output, debit, XP milestones, unlocks, quests, records and identities', () => {
    const f = fixture(), tx = f.begin(), oldFort = f.fort(), oldLedger = f.ledger();
    f.mutate();
    assert.throws(() => {throw new Error('QuotaExceededError');}, /QuotaExceeded/);
    assert.equal(tx.rollback(), true);
    assert.deepEqual(Object.keys(f.inventory), ['material']);
    assert.equal(f.inventory.material, f.stack); assert.equal(f.stack.item, f.material); assert.equal(f.material.getName(), 'Original material');
    assert.deepEqual(f.progress, {current_level: 9, total_xp: 39});
    assert.deepEqual(f.levelable.stats, {flat: {skill_milestones: {}}, full: {health: 25}});
    assert.deepEqual(f.levelable.xp_bonuses.multiplier.skills, {});
    assert.equal(f.availability.recipe.springsteel.is_unlocked, false);
    assert.equal(f.quest.getAvailabilityComponent().is_finished, false);
    assert.equal(f.quest.quest_tasks[0].getAvailabilityComponent().is_finished, false);
    assert.deepEqual(Object.keys(f.active), ['q']); assert.equal(f.active.q, f.quest);
    assert.deepEqual(f.itemLog.items, {material: {count: 3}}); assert.equal(f.stats.total_crafting_attempts, 0);
    assert.deepEqual(f.favourites, {material: true}); assert.deepEqual(f.affected, {});
    assert.equal(f.fort(), oldFort); assert.equal(f.ledger(), oldLedger);
    assert.equal(tx.rollback(), false);
});
test('AR3/MR5: rejected craft restores an active quest replaced in the registry, including private task state', () => {
    const registered = new Quest([new Quest()]), activeQuest = new Quest([new Quest()]);
    registered.getAvailabilityComponent().is_unlocked = true;
    registered.quest_tasks[0].getAvailabilityComponent().is_finished = true;
    const quests = {q: registered}, active = {q: activeQuest};
    const before = [registered, activeQuest].flatMap(q => [q, ...q.quest_tasks])
        .map(q => ({...q.getAvailabilityComponent()}));
    const tx = beginNativeCraftTransaction({owners: nativeCraftQuestOwners(quests, active)});
    for (const q of [registered, activeQuest]) {
        q.getAvailabilityComponent().is_unlocked = !q.getAvailabilityComponent().is_unlocked;
        q.quest_tasks[0].getAvailabilityComponent().is_finished = !q.quest_tasks[0].getAvailabilityComponent().is_finished;
    }
    delete quests.q; active.q = new Quest();
    assert.equal(tx.rollback(), true);
    assert.equal(quests.q, registered); assert.equal(active.q, activeQuest);
    assert.deepEqual([registered, activeQuest].flatMap(q => [q, ...q.quest_tasks])
        .map(q => ({...q.getAvailabilityComponent()})), before);
});

test('success is retained when post-durable presentation throws', () => {
    const f = fixture(), tx = f.begin(); let stored;
    assert.throws(() => {
        f.mutate(); stored = JSON.stringify({inventory: f.inventory, ledger: f.ledger()});
        tx.markDurable(); throw new Error('render failed');
    }, /render failed/);
    assert.equal(tx.rollback(), false); assert.equal(tx.status, 'durable');
    assert.equal(f.inventory.output.count, 2); assert.equal(JSON.parse(stored).ledger.sequence, 1);
});
test('later recursive batch rejection preserves prior durable batch and allows retry', () => {
    const f = fixture(), first = f.begin(); f.mutate(); first.markDurable();
    const child = f.begin(); f.inventory.output.count += 2; f.stats.total_crafting_attempts += 2;
    f.ledger().sequence++; assert.equal(child.rollback(), true);
    assert.equal(first.rollback(), false); assert.equal(f.inventory.output.count, 2);
    assert.equal(f.stats.total_crafting_attempts, 2); assert.equal(f.ledger().sequence, 1);
    const retry = f.begin(); f.inventory.output.count += 2; f.stats.total_crafting_attempts += 2; f.ledger().sequence++;
    retry.markDurable(); assert.equal(f.inventory.output.count, 4); assert.equal(f.ledger().sequence, 2);
});
test('array aliases, deleted descriptors and cycles survive rejection without replaying model setters', () => {
    const rows = [1, 2, 3], root = {rows, alias: rows}; root.self = root;
    const symbol = Symbol('record'), symbolRecord = {count: 4}; root[symbol] = symbolRecord;
    let redraw = 0; const tx = beginNativeCraftTransaction({owners: [root], onRollback: () => {assert.equal(root.rows, rows); redraw++;}});
    rows.splice(0, 3, 9); root.rows = []; symbolRecord.count = 9; delete root[symbol]; root.new = 5;
    tx.rollback(); assert.deepEqual(rows, [1, 2, 3]); assert.equal(root.alias, rows); assert.equal(root.self, root);
    assert.equal(root[symbol], symbolRecord); assert.equal(symbolRecord.count, 4); assert.equal(Object.hasOwn(root, 'new'), false); assert.equal(redraw, 1);
});
test('unsupported internal-slot owners fail before native mutation; redraw failure follows completed rollback', () => {
    assert.throws(() => beginNativeCraftTransaction({owners: [{nested: new Map()}]}), /Unsupported/);
    const owner = {count: 3}, tx = beginNativeCraftTransaction({owners: [owner], onRollback: () => {throw new Error('redraw failed');}});
    owner.count = 0; assert.throws(() => tx.rollback(), /redraw failed/);
    assert.equal(owner.count, 3); assert.equal(tx.status, 'rolled-back'); assert.equal(tx.rollback(), false);
    assert.throws(() => tx.markDurable(), /already settled/);
});
test('actual private inventory and availability components restore without inventory/reward replay', () => {
    // Native modules import the browser singleton transitively. Evaluate only
    // these unchanged component classes with their import dependencies supplied,
    // rather than creating a fake DOM or importing the whole running game.
    function component(path, className, dependencies) {
        const source = readFileSync(new URL(path, import.meta.url), 'utf8')
            .replace(/^import .*;\r?\n/gm, '')
            .replace(/^export .*;\r?\n?/gm, '');
        return vm.runInNewContext(`${source}\n${className}`, dependencies);
    }
    const item = new Item(); let created = 0;
    const Inventory = component('../src/components/inventory_component.js', 'InventoryComponent', {getItemFromKey: () => {created++; return item;}});
    const Availability = component('../src/components/availability_component.js', 'AvailabilityComponent', {process_conditions: () => true});
    const inv = new Inventory(); inv.addToInventory([{item_key: 'material', count: 3}]);
    const items = inv.getItems(), stack = items.material;
    const availability = new Availability({is_unlocked: false});
    const tx = beginNativeCraftTransaction({owners: [items, availability]});
    inv.removeFromInventory([{item_key: 'material', item_count: 3}]);
    inv.addToInventory([{item_key: 'output', count: 1}]);
    availability.setStatus({is_unlocked: true});
    availability.setStatus({is_unlocked: false});
    assert.equal(availability.is_unlocked, true); // Native setter is additive.
    tx.rollback();
    assert.equal(inv.getItems(), items); assert.equal(items.material, stack);
    assert.equal(items.material.item, item); assert.equal(items.material.count, 3);
    assert.equal(Object.hasOwn(items, 'output'), false); assert.equal(availability.is_unlocked, false);
    assert.equal(created, 2); // Rollback never called item creation again.
});
