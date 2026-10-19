import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative as loadNativeModule} from './helpers/native_loader.mjs';
import {createDurability, equipmentDurability} from '../src/absorb_e2/durability.js';
import {instrumentProfile, gatherRates, verbNumbers, improvisedRates} from '../src/tool_profiles.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureToolsDomain, setToolsState, toolsState, quoteRepair, executeRepair, cancelRepair, maxCondition, validateTools} from '../src/tools_domain.js';
const quoteHandRepair = key => quoteRepair({kind: 'hand', key}), executeHandRepair = executeRepair, cancelHandRepair = cancelRepair;

// Native item, location and activity tables, bundled with presentation stubbed (as absorb_e2 does).
let native;
async function loadNative() {
    return native ??= await loadNativeModule('export {item_templates} from "./src/items.js"; export {locations} from "./src/data/locations.js"; export {character} from "./src/data/character.js"; export {activities} from "./src/activities.js";', {logLevel: 'error', prefix: 'tools-native-'});
}
function toolActivities(n) {
    const rows = [];
    for (const [location, loc] of Object.entries(n.locations)) for (const [id, activity] of Object.entries(loc.activities || {})) {
        const type = n.activities[activity.activity_name];
        if (type?.type === 'GATHERING' && type.required_tool_type && activity.gained_resources) rows.push({location, id, activity, slot: type.required_tool_type, skills: type.base_skills_names});
    }
    return rows;
}
// Native efficiency at a fixed total skill level per base skill; restores the hero afterwards.
function nativeRates(n, activity, levels) {
    const original = n.character.getTotalSkillLevel;
    n.character.getTotalSkillLevel = skill => levels[skill] ?? 0;
    try { const {gathering_time_needed, gained_resources} = activity.getActivityEfficiency(); return {gathering_time_needed, gained_resources}; }
    finally { n.character.getTotalSkillLevel = original; }
}

test('IP1 golden: profiles derive from native templates and rates match the native method', async () => {
    const n = await loadNative();
    const tools = Object.values(n.item_templates).filter(item => item.tags?.tool);
    assert.equal(tools.length, 17);
    for (const tool of tools) {
        const profile = instrumentProfile(tool);
        assert.deepEqual(profile.bonus, tool.base_bonus_skill_levels || {}, tool.id);
        assert.equal(profile.slot, tool.equip_slot);
    }
    const rows = toolActivities(n);
    assert.ok(rows.length >= 8);
    for (const row of rows) for (const tool of tools.filter(t => t.equip_slot === row.slot)) for (const base of [0, 4, 12, 30]) {
        const profile = instrumentProfile(tool), levels = Object.fromEntries(row.skills.map(s => [s, base + (tool.base_bonus_skill_levels?.[s] || 0)]));
        const expected = nativeRates(n, row.activity, levels);
        assert.deepEqual(gatherRates(row.activity.gained_resources, row.activity.working_period, row.skills.map(s => levels[s])), expected, `${row.location}/${row.id}/${tool.id}/${base}`);
        assert.ok(verbNumbers(profile, row.activity.gained_resources, row.activity.working_period, row.skills.map(s => levels[s])).speed >= 1);
    }
    // Frozen numbers: the tooltip's verb figures for one mining spot at base Mining 4.
    const mining = rows.find(r => r.slot === 'pickaxe');
    const golden = Object.fromEntries(tools.filter(t => t.equip_slot === 'pickaxe').map(t => [t.id, verbNumbers(instrumentProfile(t), mining.activity.gained_resources, mining.activity.working_period, [4 + (t.base_bonus_skill_levels?.Mining || 0)])]));
    assert.deepEqual(golden, GOLDEN_PICKAXE);
});

test('IP2 regression: durability off keeps native gathering identical', async () => {
    const n = await loadNative();
    for (const row of toolActivities(n)) for (const base of [0, 7, 20]) {
        const levels = Object.fromEntries(row.skills.map(s => [s, base]));
        const copy = Object.assign({}, row.activity);
        assert.equal(copy.tool_rates, undefined);
        assert.deepEqual(nativeRates(n, copy, levels), nativeRates(n, row.activity, levels));
        assert.deepEqual(nativeRates(n, copy, levels), gatherRates(row.activity.gained_resources, row.activity.working_period, row.skills.map(() => base)));
    }
    const tool = n.item_templates['Iron pickaxe'];
    equipmentDurability.load({enabled: false});
    const gate = domainRegistry.command('tools', 'gate'), work = domainRegistry.command('tools', 'workCycle');
    const item = equipmentDurability.prepareEquip(tool, k => n.item_templates['Iron pickaxe'], {requireIdentity: true});
    for (let i = 0; i < 500; i++) assert.deepEqual(work({item, rates: null}), {worn: false});
    assert.equal(equipmentDurability.condition(item), 100);
    assert.deepEqual(gate({item}), {ok: true, rates: null});
    // Durability on: wear per cycle, break at zero, improvised rates are worse.
    equipmentDurability.setEnabled(true);
    assert.deepEqual(work({item, rates: null}), {worn: true});
    assert.equal(equipmentDurability.condition(item), 99);
    let result; for (let i = 0; i < 99; i++) result = work({item, rates: null});
    assert.equal(result.broken, true);
    const broken = gate({item});
    assert.deepEqual(broken.rates, improvisedRates(instrumentProfile(tool)));
    const row = toolActivities(n).find(r => r.slot === 'pickaxe'), levels = {Mining: 10};
    const improvised = Object.assign({}, row.activity, {tool_rates: broken.rates});
    assert.ok(nativeRates(n, improvised, levels).gathering_time_needed > nativeRates(n, row.activity, levels).gathering_time_needed);
    assert.deepEqual(work({item, rates: broken.rates}), {worn: false});
    equipmentDurability.load(undefined);
});

function repairFixture({level = 5, ingots = 2, station = 1} = {}) {
    const durability = equipmentDurability;
    durability.load({enabled: true});
    const make = key => durability.bindFromKey(key, {id: 'Iron pickaxe', name: 'Iron pickaxe', tags: {equippable: true, tool: true}, equip_slot: 'pickaxe', base_bonus_skill_levels: {Mining: 3}, inventory_key: key, getInventoryKey() { return this.inventory_key; }, getName() { return 'Iron pickaxe'; }});
    const tool = durability.prepareEquip(make(JSON.stringify({id: 'Iron pickaxe'})), make);
    const inventory = {'Iron ingot': ingots}, log = [], draws = [];
    const actor = {money: 0, items: {}, equipment: {pickaxe: tool}, getItems() { return this.items; }, getEquipment() { return this.equipment; }};
    let saved = 0, roll = 0.1;
    configureToolsDomain({actor: () => actor, skillLevel: () => level, stationTier: () => station, location: () => 'Village', count: id => inventory[id] || 0,
        itemOwners: () => [inventory], assertSpend: () => {}, addItem: (id, c) => { inventory[id] = (inventory[id] || 0) + c; }, removeItem: (id, c) => { inventory[id] -= c; },
        persist: done => { saved++; done(); }, refresh: () => {}, blocked: () => '', writable: () => true, idle: () => true,
        random: key => { draws.push(key); return roll; }, logMessage: text => log.push(text)});
    setToolsState(null);
    return {durability, tool, inventory, log, draws, saves: () => saved, setRoll: value => { roll = value; }};
}

test('IP3: a hand repair quote consumes nothing (MR4)', () => {
    const f = repairFixture(), key = f.tool.getInventoryKey();
    f.durability.setCondition(key, 10);
    const before = JSON.stringify([f.inventory, f.durability.serialize(), toolsState()]);
    let q; for (let i = 0; i < 5; i++) q = quoteHandRepair(key);
    assert.equal(q.eligible, true, q.reason);
    assert.equal(JSON.stringify([f.inventory, f.durability.serialize(), toolsState()]), before);
    assert.deepEqual(f.draws, []); assert.equal(f.saves(), 0);
    assert.deepEqual(q.spent, [{id: 'Iron ingot', count: 1}]); assert.equal(q.skill, 'Forging');
    assert.ok(q.inputs.every(input => input.met));
    assert.equal(quoteHandRepair(key).minutes, 56);
    // Short inputs guide rather than refuse: still eligible, with a worse band, and still read-only.
    const full = quoteHandRepair(key);
    const empty = repairFixture({ingots: 0}), emptyKey = empty.tool.getInventoryKey();
    empty.durability.setCondition(emptyKey, 10);
    const noMaterial = quoteHandRepair(emptyKey);
    assert.equal(noMaterial.eligible, true, noMaterial.reason);
    assert.deepEqual(noMaterial.inputs.filter(i => !i.met).map(i => i.input), ['material']);
    assert.ok(noMaterial.restore < full.restore && noMaterial.chance < full.chance); assert.deepEqual(noMaterial.spent, []);
    const noStation = repairFixture({station: 0}); noStation.durability.setCondition(noStation.tool.getInventoryKey(), 10);
    const bench = quoteHandRepair(noStation.tool.getInventoryKey());
    assert.equal(bench.eligible, true); assert.equal(bench.failureLoss, 6); assert.ok(bench.restore < full.restore);
    const novice = repairFixture({level: 0}); novice.durability.setCondition(novice.tool.getInventoryKey(), 10);
    const unskilled = quoteHandRepair(novice.tool.getInventoryKey());
    assert.equal(unskilled.eligible, true); assert.deepEqual(unskilled.inputs.filter(i => !i.met).map(i => i.input), ['skill']);
    assert.match(quoteRepair({kind: 'spell', key: novice.tool.getInventoryKey()}).reason, /Nobody here knows/);
    assert.deepEqual(novice.draws, []);
    f.durability.load(undefined);
});

test('IP3: hand repair spends material, takes bench time, restores partly or costs max condition', () => {
    const f = repairFixture(), key = f.tool.getInventoryKey(), tick = minutes => domainRegistry.list().find(d => d.id === 'tools').tick(minutes);
    f.durability.setCondition(key, 0);
    const q = quoteHandRepair(key);
    assert.equal(q.restore, 70); assert.equal(q.chance, 0.75);
    executeHandRepair(q);
    assert.equal(f.inventory['Iron ingot'], 1); assert.equal(f.saves(), 1);
    assert.match(domainRegistry.project('tools', 'occupation'), /Iron pickaxe repair/);
    assert.equal(quoteHandRepair(key).eligible, false);
    tick(q.minutes - 1); assert.equal(f.durability.condition(key), 0);
    tick(1); assert.equal(f.durability.condition(key), 70); assert.equal(toolsState().job, null);
    // Failure: condition kept, best condition lowered, and coin repair respects the lower cap.
    f.setRoll(0.99); executeHandRepair(quoteHandRepair(key)); tick(999);
    assert.equal(f.durability.condition(key), 70); assert.equal(maxCondition(key), 97);
    assert.equal(f.inventory['Iron ingot'], 0);
    const actor = {money: 10, getItems: () => ({}), getEquipment: () => ({pickaxe: f.tool})};
    f.durability.repair(actor, key, () => {}); assert.equal(f.durability.condition(key), 97);
    // Cancel returns the material.
    f.inventory['Iron ingot'] = 1; f.durability.setCondition(key, 50);
    executeHandRepair(quoteHandRepair(key)); cancelHandRepair();
    assert.equal(f.inventory['Iron ingot'], 1); assert.equal(toolsState().job, null);
    // The slice round-trips through the registry's save, validate and load.
    const envelope = domainRegistry.save({});
    validateTools(envelope.tools);
    const json = JSON.parse(JSON.stringify(envelope));
    setToolsState(null); domainRegistry.validate(json); domainRegistry.load(json);
    assert.equal(maxCondition(key), 97); assert.deepEqual(toolsState().instances[key], {max: 97, repairs: 1, failures: 1});
    assert.throws(() => validateTools({schema: 1, instances: {'{"id":"x"}': {max: 1, repairs: 0, failures: 0}}, job: null}), /Invalid tool/);
    assert.equal(createDurability({enabled: true}).serialize().enabled, true);
    f.durability.load(undefined); setToolsState(null);
});

const GOLDEN_PICKAXE = {
    'Old pickaxe': {verb: 'mine', levels: 0, speed: 1, yield: 1, precision: 0.8, hardness: 1},
    'Iron pickaxe': {verb: 'mine', levels: 3, speed: 1.25, yield: 1.35, precision: 1, hardness: 2},
    'Steel pickaxe': {verb: 'mine', levels: 5, speed: 1.56, yield: 1.65, precision: 1.1, hardness: 3},
};
