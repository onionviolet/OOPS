import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState, loadExpansionState, createContentRegistry} from '../src/expansion_engine.js';
import {createDurability} from '../src/absorb_e2/durability.js';
import {enrollSimulation} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {SALVAGE, loadSalvage, quoteSalvage, stageSalvage, wornSalvageChoices} from '../src/absorb_p23/salvage/salvage.js';
const worn = JSON.stringify({id: 'Leather vest', quality: 100, e2_instance: 'e2.1'});
const spare = JSON.stringify({id: 'Leather vest', quality: 100, e2_instance: 'e2.2'});
const tool = JSON.stringify({id: SALVAGE.tool, quality: 100});
function fixture() {
    return {state: createExpansionState(42), location: 'Village', money: 20, saved: undefined, skillLevel: 10,
        durability: createDurability({schema: 1, enabled: true, condition: {[worn]: 20, [spare]: 100}}),
        equipment: {player: {}}, getItem: k => JSON.parse(k),
        gameplay: {player: {inventory: {[worn]: 1, [spare]: 1, [tool]: 1, [SALVAGE.log]: 3},
            skills: {Crafting: {enabled: true, xp: 0}}, reputation: {}}}};
}
const req = (c, recipe = SALVAGE.salvage, itemKey = worn) => ({sequence: c.state.sequence, recipe, itemKey, toolKey: tool});
const quoted = (c, r = req(c)) => ({...r, token: quoteSalvage(c, r).token});
const advance = (c, p) => ({...c, state: p.state, gameplay: p.gameplay, saved: p.nativePatch.p23_salvage,
    durability: createDurability(p.nativePatch.equipment_durability)});

test('old saves grant no recipe; unknown schemas and malformed receipts reject without mutation', () => {
    assert.deepEqual(loadSalvage(), {schema: 1, learned: false, receipts: {}});
    for (const bad of [null, {schema: 2}, {schema: 1, learned: true, receipts: {'p23.salvage:1': {}}}]) {
        const before = structuredClone(bad); assert.throws(() => loadSalvage(bad)); assert.deepEqual(bad, before);
    }
});
test('missing tool blocks preview and commit without output, receipt, XP or sequence', () => {
    const c = fixture(), r = quoted(c); delete c.gameplay.player.inventory[tool];
    const before = JSON.stringify({state: c.state, gameplay: c.gameplay, saved: c.saved});
    assert.throws(() => quoteSalvage(c, r), /Carry/); assert.throws(() => stageSalvage(c, r), /Carry/);
    assert.equal(JSON.stringify({state: c.state, gameplay: c.gameplay, saved: c.saved}), before);
});
test('quality gate applies again at commit and permits threshold exactly', () => {
    const c = fixture(), r = quoted(c); c.getItem = k => ({...JSON.parse(k), ...(k === tool ? {quality: 59} : {})});
    assert.throws(() => quoteSalvage(c, r), /quality 60/); assert.throws(() => stageSalvage(c, r), /quality 60/);
    c.getItem = k => ({...JSON.parse(k), ...(k === tool ? {quality: 60} : {})});
    assert.equal(quoteSalvage(c, r).toolQuality, 60);
});
test('salvage consumes precisely the selected copy, matches displayed yield and teaches recipe', () => {
    const c = fixture(), before = JSON.stringify(c.gameplay), r = quoted(c), q = quoteSalvage(c, r), p = stageSalvage(c, r);
    assert.equal(JSON.stringify(c.gameplay), before); assert.equal(c.state.sequence, 0);
    assert.equal(p.gameplay.player.inventory[worn], undefined); assert.equal(p.gameplay.player.inventory[spare], 1);
    assert.equal(p.gameplay.player.inventory[SALVAGE.material], q.outputCount); assert.equal(q.outputCount, 2);
    assert.equal(p.gameplay.player.inventory[tool], 1); assert.equal(p.gameplay.player.skills.Crafting.xp, 2);
    assert.equal(p.receipt.consumedKey, worn); assert.equal(p.learnedRecipe, SALVAGE.craft);
    assert.equal(p.nativePatch.p23_salvage.learned, true); assert.equal(p.nativePatch.equipment_durability.condition[spare], 100);
    assert.equal(p.nativePatch.equipment_durability.condition[worn], undefined);
});
test('condition and native skill change yield; preview drift is rejected', () => {
    const c = fixture(), r = quoted(c); c.skillLevel = 0;
    assert.equal(quoteSalvage(c, req(c)).outputCount, 1); assert.throws(() => stageSalvage(c, r), /preview changed/);
    assert.equal(quoteSalvage(c, req(c, SALVAGE.salvage, spare)).outputCount, 3);
    c.skillLevel = 10; assert.equal(quoteSalvage(c, req(c, SALVAGE.salvage, spare)).outputCount, 4);
});
test('worn-first choices exclude equipped controls and permit explicit pristine override', () => {
    const c = fixture(); assert.deepEqual(wornSalvageChoices(c).map(r => r.key), [worn, spare]);
    const p = stageSalvage(c, quoted(c, req(c, SALVAGE.salvage, spare)));
    assert.equal(p.gameplay.player.inventory[worn], 1); assert.equal(p.gameplay.player.inventory[spare], undefined);
    c.equipment.player.torso = worn;
    assert.deepEqual(wornSalvageChoices(c).map(r => r.key), [spare]); assert.throws(() => stageSalvage(c, req(c)), /unequipped/);
});
test('unidentified stacks and invalid selected-copy counts are not silently split', () => {
    const c = fixture(); c.gameplay.player.inventory[worn] = 2; assert.throws(() => quoteSalvage(c, req(c)), /one carried/);
    const canonical = JSON.stringify({id: 'Leather vest', quality: 100}); c.gameplay.player.inventory[canonical] = 1;
    assert.throws(() => quoteSalvage(c, req(c, SALVAGE.salvage, canonical)), /identified/);
});
test('custody of selected instance, canonical family or held tool blocks preview and commit', () => {
    for (const key of [worn, JSON.stringify({id: 'Leather vest', quality: 100}), tool]) {
        const c = fixture(), r = quoted(c);
        const registry = createContentRegistry({worlds: [{id: 'base.frontier'}], simulation: {
            people: [{id: 'lender', revision: 1, label: 'Lender', worldId: 'base.frontier', location: 'Village', inventory: 'simulation'}]}});
        const plan = enrollSimulation(c.state, registry, {actorId: 'player', facts: {location: 'Village'},
            external: {money: c.money}, gameplay: c.gameplay});
        c.state = plan.state; c.gameplay = plan.gameplay;
        c.state.simulation.custody.loan = {owner: 'lender', holder: 'player', key, count: 1, at: 0, cause: 'fixture:loan'};
        const current = {...r, sequence: c.state.sequence};
        assert.throws(() => quoteSalvage(c, current), /borrowed/);
        assert.throws(() => stageSalvage(c, current), /borrowed/);
    }
});
test('worn-copy portable craft preserves spare, spends one log and returns native kit', () => {
    const c = fixture(); c.saved = {schema: 1, learned: true, receipts: {}};
    const p = stageSalvage(c, quoted(c, req(c, SALVAGE.craft)));
    assert.equal(p.gameplay.player.inventory[worn], undefined); assert.equal(p.gameplay.player.inventory[spare], 1);
    assert.equal(p.gameplay.player.inventory[SALVAGE.log], 2); assert.equal(p.gameplay.player.inventory[SALVAGE.output], 1);
    assert.equal(p.gameplay.player.skills.Crafting.xp, 3); assert.equal(p.receipt.outputCount, 1);
});
test('acquisition gate blocks direct craft bypass; successful salvage opens craft', () => {
    const c = fixture(); assert.throws(() => quoteSalvage(c, req(c, SALVAGE.craft)), /learn/);
    const learned = advance(c, stageSalvage(c, quoted(c)));
    assert.equal(quoteSalvage(learned, req(learned, SALVAGE.craft, spare)).outputKey, SALVAGE.output);
});
test('stale event replay cannot duplicate output; a fresh physical copy allows another craft', () => {
    const c = fixture(), r = quoted(c), p = stageSalvage(c, r), next = advance(c, p);
    assert.throws(() => stageSalvage(next, r), /Stale/);
    const second = stageSalvage(next, quoted(next, req(next, SALVAGE.salvage, spare)));
    assert.equal(second.gameplay.player.inventory[SALVAGE.material], 6);
    assert.equal(Object.keys(second.nativePatch.p23_salvage.receipts).length, 2);
});
test('native location, available skill and material guards reject before settlement', () => {
    const c = fixture(); c.location = 'Forest'; assert.throws(() => quoteSalvage(c, req(c)), /Village/);
    c.location = 'Village'; c.gameplay.player.skills.Crafting.enabled = false; assert.throws(() => quoteSalvage(c, req(c)), /Crafting/);
    c.gameplay.player.skills.Crafting.enabled = true; c.saved = {schema: 1, learned: true, receipts: {}};
    delete c.gameplay.player.inventory[SALVAGE.log]; assert.throws(() => quoteSalvage(c, req(c, SALVAGE.craft)), /log/);
});
test('native staged envelope keeps exact identities and receipts through JSON import, failed write preserves bytes', () => {
    const c = fixture(), p = stageSalvage(c, quoted(c));
    const envelope = {character: {money: c.money}, expansion: c.state, untouched: {x: 7},
        inventories: {person: {main_character: Object.fromEntries(Object.entries(c.gameplay.player.inventory).map(([k, count]) => [k, {count}]))}},
        levels: {person: {main_character: {skill_xp: {}}}}};
    const bytes = JSON.stringify(envelope); let stored = bytes;
    const options = {createSave: () => bytes, key: 'fixture', bindings: {player: {category: 'person', id: 'main_character'}},
        validateEnvelope: e => loadSalvage(e.p23_salvage)};
    assert.throws(() => persistExpansionPlan(p, {...options, storage: {setItem() {throw Error('quota');}}}), /quota/);
    assert.equal(stored, bytes); assert.equal(c.gameplay.player.inventory[worn], 1);
    persistExpansionPlan(p, {...options, storage: {setItem(k, v) {stored = v;}}});
    const imported = JSON.parse(stored); assert.deepEqual(imported.untouched, {x: 7});
    assert.deepEqual(loadSalvage(imported.p23_salvage), p.nativePatch.p23_salvage);
    assert.deepEqual(loadExpansionState(imported.expansion), p.state);
    assert.equal(imported.inventories.person.main_character[spare].count, 1);
    assert.equal(imported.inventories.person.main_character[worn], undefined);
    const bad = structuredClone(imported.p23_salvage); bad.receipts[p.receipt.id].outputCount = -1;
    assert.throws(() => loadSalvage(bad), /Invalid salvage receipt/);
});

test('broken identified tool blocks both operations without spending its copy', () => {
    const c = fixture(), broken = JSON.stringify({id: SALVAGE.tool, quality: 100, e2_instance: 'e2.3'});
    delete c.gameplay.player.inventory[tool]; c.gameplay.player.inventory[broken] = 1;
    c.durability = createDurability({schema: 1, enabled: true, condition: {[worn]: 20, [spare]: 100, [broken]: 0}});
    const r = {...req(c), toolKey: broken};
    assert.throws(() => quoteSalvage(c, r), /usable/); assert.throws(() => stageSalvage(c, r), /usable/);
    assert.equal(c.gameplay.player.inventory[broken], 1); assert.equal(c.gameplay.player.inventory[worn], 1);
});
test('real graded keys enforce portable tool threshold and remain exact in durable receipt', () => {
    const c = fixture(); delete c.gameplay.player.inventory[tool];
    for (const quality of [59, 60]) {
        const k = JSON.stringify({id: SALVAGE.tool, quality}); c.gameplay.player.inventory[k] = 1;
        const r = {...req(c), toolKey: k};
        if (quality === 59) assert.throws(() => quoteSalvage(c, r), /quality 60/);
        else {
            const p = stageSalvage(c, quoted(c, r)); assert.equal(p.receipt.toolKey, k);
            assert.equal(p.gameplay.player.inventory[k], 1);
            assert.deepEqual(loadSalvage(JSON.parse(JSON.stringify(p.nativePatch.p23_salvage))), p.nativePatch.p23_salvage);
        }
    }
});
