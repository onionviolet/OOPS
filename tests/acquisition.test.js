import test from "node:test";
import assert from "node:assert/strict";
import {stageAcquisition, prepareOwnershipPublication, recordAcquisitions} from "../src/acquisition.js";
import {stageNativeTrade} from "../src/native_trade_transaction.js";
import {createExpansionState, commitAction, advanceSimulation, loadExpansionState} from "../src/expansion_engine.js";
import {expeditionRegistry, initializeExpedition, SURVEY_KIT_KEY} from "../src/expedition_content.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {prepareGameplayPublication} from "../src/gameplay_publication.js";
const kit = SURVEY_KIT_KEY, quality = JSON.stringify({id: "Sword", quality: 123});
const item = key => ({id: JSON.parse(key).id, quality: JSON.parse(key).quality, saturates_market: true,
    getMarketSaturationGroup: () => ({group_key: "supplies", group_tier: 0})});
const fixture = () => {
    const owners = {player: {[quality]: 2}, vendor: {[kit]: 3}};
    const gameplay = {player: {inventory: owners.player, skills: {Haggling: {xp: 0, enabled: true}}, reputation: {Village: 0}}};
    const market = {Village: {supplies: [{sold: 10, recovered: 2}]}};
    const quote = {vendorId: "supplier", region: "Village", buy: [{item_key: kit, count: 2}],
        sell: [{item_key: quality, count: 1}], buyValue: 16, sellValue: 4};
    return {state: createExpansionState(), gameplay, owners, money: 100, market, itemLog: {}, quote, currentQuote: structuredClone(quote), xp: 2, getItem: item};
};

test("trade stages both owners, quality keys, money, market and native acquisition without mutating input", () => {
    const f = fixture(), before = structuredClone({...f, getItem: undefined});
    const p = stageNativeTrade(f);
    assert.equal(p.gameplay.player.inventory[kit], 2); assert.equal(p.gameplay.player.inventory[quality], 1);
    assert.equal(p.ownership.vendor[kit], 1); assert.equal(p.ownership.vendor[quality], 1);
    assert.equal(p.external.money, 88); assert.equal(p.gameplay.player.skills.Haggling.xp, 2);
    assert.equal(p.market.Village.supplies[0].sold, 9);
    assert.equal(p.itemLog["Prepared survey kit"].number, 2); assert.equal(p.state.sequence, 1);
    assert.deepEqual({...f, getItem: undefined}, before);
});

test("stale prices or quantity, insufficient money, over-selling and overflow reject unchanged", () => {
    for(const edit of [f => f.currentQuote.buyValue++, f => f.currentQuote.buy[0].count++,
        f => f.owners.vendor[kit] = 1, f => f.owners.player[quality] = 0, f => f.money = 0,
        f => f.owners.player[kit] = Number.MAX_SAFE_INTEGER]) {
        const f = fixture(); edit(f); const before = structuredClone({...f, getItem: undefined});
        assert.throws(() => stageNativeTrade(f)); assert.deepEqual({...f, getItem: undefined}, before);
    }
    assert.throws(() => stageAcquisition({player: {}, vendor: {[kit]: 1}}, {transfers: [
        {from: "vendor", to: "player", key: kit, count: 1}, {from: "player", to: "vendor", key: kit, count: 1}]}), /unavailable/);
});

test("a failed durable trade leaves live and durable owners, XP and acquisition unchanged; success writes once", () => {
    const f = fixture(), p = stageNativeTrade(f);
    const playerItems = {[quality]: {item: item(quality), count: 2}}, vendorItems = {[kit]: {item: item(kit), count: 3}};
    const levelable = {skill_progress: {}}, actor = {getItems: () => playerItems, getLevelableComponent: () => levelable,
        reputation: {Village: 0}, addSkillMilestoneBonus() {}};
    const player = prepareGameplayPublication(p.gameplay, {actors: {player: actor}, skills: {Haggling: {
        base_xp_cost: 100, add_xp({skillXP, xp_to_add}) {skillXP.total_xp += xp_to_add; return {};}}}, getItemFromKey: item});
    const vendor = prepareOwnershipPublication(p.ownership, {itemsByOwner: {vendor: vendorItems}, getItem: item});
    const envelope = {character: {money: 100}, inventories: {person: {main_character: {}}, trader: {supplier: {}}},
        levels: {person: {main_character: {skill_xp: {}}}}, quests: {untouched: true}};
    let durable = JSON.stringify(envelope), writes = 0;
    const options = {createSave: () => JSON.stringify(envelope), key: "fixture", bindings: {player: {category: "person", id: "main_character"}},
        ownershipBindings: {vendor: {category: "trader", id: "supplier"}}, storage: {setItem() {throw Error("quota");}}};
    assert.throws(() => persistExpansionPlan(p, options), /quota/);
    assert.equal(playerItems[quality].count, 2); assert.equal(playerItems[kit], undefined);
    assert.equal(vendorItems[kit].count, 3); assert.deepEqual(levelable.skill_progress, {}); assert.equal(durable, JSON.stringify(envelope));
    options.storage.setItem = (_, value) => {writes++; durable = value;};
    persistExpansionPlan(p, options); player.publish(); vendor.publish();
    const saved = JSON.parse(durable);
    assert.equal(writes, 1); assert.equal(saved.character.money, 88);
    assert.equal(saved.inventories.trader.supplier[kit].count, 1); assert.equal(vendorItems[kit].count, 1);
    assert.equal(saved.inventories.person.main_character[kit].count, 2); assert.equal(playerItems[kit].count, 2);
    assert.equal(saved.item_log["Prepared survey kit"].number, 2); assert.equal(saved.levels.person.main_character.skill_xp.Haggling, 2);
    assert.deepEqual(saved.quests, {untouched: true});
});

test("packing reserves its fee, resumes from save and grants its kit, XP and acquisition once", () => {
    const state = initializeExpedition(createExpansionState()); state.campaign.facts.anchor = true;
    const context = {actorId: "player", worldId: "base.frontier", external: {money: 100},
        gameplay: {player: {inventory: {}, skills: {Climbing: {xp: 0, enabled: true}}, reputation: {Village: 0}}}, facts: {location: "Village", kits: 0}};
    const p = commitAction(state, expeditionRegistry, "frontier.pack", context);
    assert.equal(p.external.money, 94); assert.deepEqual(p.acquisitions, []);
    const done = advanceSimulation(loadExpansionState(JSON.parse(JSON.stringify(p.state)), expeditionRegistry), expeditionRegistry, 4, p.external, p.gameplay);
    assert.equal(done.gameplay.player.inventory[kit], 1); assert.equal(done.gameplay.player.skills.Climbing.xp, 4);
    const log = recordAcquisitions({}, done.acquisitions, item);
    const again = advanceSimulation(loadExpansionState(done.state, expeditionRegistry), expeditionRegistry, 10, done.external, done.gameplay);
    assert.deepEqual(again.acquisitions, []); assert.deepEqual(recordAcquisitions(log, again.acquisitions, item), log);
    assert.equal(log["Prepared survey kit"].number, 1);
    assert.throws(() => commitAction(p.state, expeditionRegistry, "frontier.pack", context), /Finish/);
});
