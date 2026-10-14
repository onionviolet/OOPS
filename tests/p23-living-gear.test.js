import test from 'node:test';
import assert from 'node:assert/strict';
import {createLivingGear, LIVING_GEAR, registerLivingGearItems} from '../src/absorb_p23/living_gear/index.js';
import {createDurability} from '../src/absorb_e2/durability.js';
import {Game_Time} from '../src/game_time.js';
// Native items.js imports the browser host. These contract fixtures test isolated
// state/identity behavior; native constructor/registration acceptance stays OPEN.
const item_templates = {};
class Equipment {
    constructor(data) { Object.assign(this, data); this.tags = {equippable: true}; }
    getInventoryKey() { return this.inventory_key ||= JSON.stringify(this.components ? {components: this.components, quality: this.quality} : {id: this.id}); }
    getName() { return this.name || this.id; }
}
class Amulet extends Equipment { constructor(d) {super(d); this.equip_slot = 'amulet';} }
class Weapon extends Equipment { constructor(d) {super(d); this.equip_slot = 'weapon';} }
class WeaponComponent { constructor(d) {Object.assign(this, d);} }
const getItem = d => Object.assign(new Equipment(d), {equip_slot: d.equip_slot});
const getItemFromKey = key => {
    const data = JSON.parse(key);
    const item = data.components ? new Weapon(data) : getItem(item_templates[data.id]);
    if (data.e2_instance) item.inventory_key = key;
    return item;
};
const custody = () => {};
registerLivingGearItems({item_templates, Amulet, getItem, Weapon, WeaponComponent});
function setup() {
    const gear = createLivingGear(), wear = createDurability();
    const make = id => gear.prepareEquip(getItemFromKey(item_templates[id].getInventoryKey()), wear, getItemFromKey);
    const weapon = make(LIVING_GEAR.weapon), spare = make(LIVING_GEAR.weapon);
    const ring = make(LIVING_GEAR.collector), spareRing = make(LIVING_GEAR.collector), aura = make(LIVING_GEAR.aura);
    const equipment = {weapon, ring, amulet: aura};
    const stats = {stamina: 1, max_stamina: 20};
    const actor = {getEquipment: () => equipment, getLevelableComponent: () => ({stats: {full: stats}})};
    const kill = (sequence, extra = {}) => gear.stageKill({sequence, killerId: 'player', defeated: {tags: {beast: true}}, equipment, assertDisposition: custody, ...extra});
    return {gear, wear, weapon, spare, ring, spareRing, aura, equipment, stats, actor, kill};
}
test('E2 identity contract preserves independent copies with wear disabled', () => {
    const s = setup();
    assert.equal(s.wear.enabled, false);
    assert.notEqual(s.weapon.getInventoryKey(), s.spare.getInventoryKey());
    assert.notEqual(s.ring.getInventoryKey(), s.spareRing.getInventoryKey());
    assert.equal(getItemFromKey(s.weapon.getInventoryKey()).getInventoryKey(), s.weapon.getInventoryKey());
    const ordinary = new Amulet({id: 'Ordinary charm'});
    assert.equal(s.gear.prepareEquip(ordinary, s.wear, getItemFromKey), ordinary);
});
test('native played clock flips aura at 20:00 and 04:00, removal stops it', () => {
    const s = setup(), time = new Game_Time({year: 999, month: 4, day: 1, hour: 19, minute: 59});
    const project = () => s.gear.project({equipment: s.equipment, time, assertDisposition: custody});
    assert.deepEqual(project(), {attackMultiplier: 1.05, lightBonus: 0});
    time.goUp(1); assert.deepEqual(project(), {attackMultiplier: 1, lightBonus: 25});
    time.goUp(480); assert.deepEqual(project(), {attackMultiplier: 1.05, lightBonus: 0});
    delete s.equipment.amulet; assert.deepEqual(project(), {attackMultiplier: 1, lightBonus: 0});
});
test('kill staging is inert until publication and a real event settles once', () => {
    const s = setup(), before = s.gear.serialize(), plan = s.kill(1);
    assert.deepEqual(s.gear.serialize(), before);
    plan.preflight(); plan.publish(); plan.publish();
    assert.equal(s.gear.serialize().copies[s.weapon.getInventoryKey()].kills, 1);
    assert.equal(s.gear.serialize().copies[s.ring.getInventoryKey()].reserve, 1);
    assert.deepEqual(s.kill(1), {duplicate: true});
    assert.throws(() => s.kill(3), /sequence gap/);
});
test('identical weapon and collector copies grow independently through swap and re-equip', () => {
    const s = setup(); s.kill(1).publish();
    s.equipment.weapon = s.spare; s.equipment.ring = s.spareRing; s.kill(2).publish();
    delete s.equipment.weapon; delete s.equipment.ring; s.kill(3).publish();
    s.equipment.weapon = s.weapon; s.equipment.ring = s.ring; s.kill(4).publish();
    const copies = s.gear.serialize().copies;
    assert.equal(copies[s.weapon.getInventoryKey()].kills, 2);
    assert.equal(copies[s.spare.getInventoryKey()].kills, 1);
    assert.equal(copies[s.ring.getInventoryKey()].reserve, 2);
    assert.equal(copies[s.spareRing.getInventoryKey()].reserve, 1);
    assert.ok(s.gear.project({equipment: {weapon: s.weapon}, assertDisposition: custody}).attackMultiplier > 1);
    assert.equal(s.gear.project({equipment: {}, assertDisposition: custody}).attackMultiplier, 1);
});
test('training, summoned and other actor kills do not award; non-beast kills only grow weapon', () => {
    const s = setup();
    s.kill(1, {killerId: 'npc'}).publish(); s.kill(2, {defeated: {tags: {beast: true, training: true}}}).publish();
    s.kill(3, {defeated: {tags: {monster: true, summoned: true}}}).publish();
    assert.deepEqual(s.gear.serialize().copies, {});
    s.kill(4, {defeated: {tags: {}}}).publish();
    assert.equal(s.gear.serialize().copies[s.weapon.getInventoryKey()].kills, 1);
    assert.equal(s.gear.serialize().copies[s.ring.getInventoryKey()].reserve, 0);
});
test('collector spend consumes real saved reserve and supplies native stamina publication patch', () => {
    const s = setup(); for (let i = 1; i <= 3; i++) s.kill(i).publish();
    const plan = s.gear.stageSpend({actor: s.actor, key: s.ring.getInventoryKey(), assertDisposition: custody});
    assert.equal(plan.spent, 3); assert.equal(plan.recovered, 5); assert.equal(plan.native.staminaToFull, 14);
    assert.equal(s.stats.stamina, 1); assert.equal(s.gear.serialize().copies[s.ring.getInventoryKey()].reserve, 3);
    plan.publish(); s.stats.stamina = s.stats.max_stamina - plan.native.staminaToFull;
    assert.equal(s.stats.stamina, 6); assert.equal(s.gear.serialize().copies[s.ring.getInventoryKey()].reserve, 0);
    assert.throws(() => s.gear.stageSpend({actor: s.actor, key: s.ring.getInventoryKey(), assertDisposition: custody}), /3 cinders/);
});
test('failed persistence, custody and stale plans leave live resource unchanged', () => {
    const s = setup(), plan = s.kill(1), competing = s.kill(1);
    plan.publish(); assert.throws(() => competing.preflight(), /Stale/); assert.throws(() => competing.publish(), /Stale/);
    const before = s.gear.serialize();
    assert.throws(() => s.kill(2, {assertDisposition: () => {throw new Error('reserved');}}), /reserved/);
    assert.deepEqual(s.gear.serialize(), before);
    s.kill(2); assert.deepEqual(s.gear.serialize(), before); // simulated rejected save, no publish
});
test('collector reserve has capacity but spending allows unlimited future refill', () => {
    const s = setup(); for (let i = 1; i <= 35; i++) s.kill(i).publish();
    assert.equal(s.gear.serialize().copies[s.ring.getInventoryKey()].reserve, 30);
    s.gear.stageSpend({actor: s.actor, key: s.ring.getInventoryKey(), assertDisposition: custody}).publish();
    s.kill(36).publish(); assert.equal(s.gear.serialize().copies[s.ring.getInventoryKey()].reserve, 28);
    assert.equal(s.gear.serialize().copies[s.weapon.getInventoryKey()].kills, 36);
});
test('full old/new copy JSON import controls and schema rejection before mutation', () => {
    const s = setup(); s.kill(1).publish(); s.equipment.weapon = s.spare; s.equipment.ring = s.spareRing; s.kill(2).publish();
    const envelope = JSON.parse(JSON.stringify({p23_living_gear: s.gear.serialize(), equipment_durability: s.wear.serialize(),
        character: {equipment: Object.fromEntries(Object.entries(s.equipment).map(([slot, item]) => [slot, item.getInventoryKey()]))}}));
    const imported = createLivingGear(envelope.p23_living_gear);
    assert.deepEqual(imported.serialize(), s.gear.serialize());
    assert.deepEqual(createLivingGear().serialize(), {schema: 1, lastKill: 0, copies: {}});
    const before = imported.serialize();
    for (const invalid of [null, {}, {...before, schema: 2}, {...before, lastKill: -1},
        {...before, copies: {[s.ring.getInventoryKey()]: {kind: 'collector', kills: 0, reserve: 31}}}]) {
        assert.throws(() => imported.load(invalid)); assert.deepEqual(imported.serialize(), before);
    }
    imported.load(undefined); assert.deepEqual(imported.serialize().copies, {});
});
test('known-only rows and native custody failures cannot expose unknown gear', () => {
    const s = setup(); s.kill(1).publish();
    assert.deepEqual(s.gear.rows({equipment: s.equipment, isKnown: () => false, assertDisposition: custody}), []);
    assert.equal(s.gear.rows({equipment: s.equipment, isKnown: () => true, assertDisposition: custody}).length, 3);
    assert.throws(() => s.gear.project({equipment: s.equipment, time: {hour: 21}, assertDisposition: () => {throw new Error('custody');}}), /custody/);
});
