import test from 'node:test';
import assert from 'node:assert/strict';
import {createLivingGear, LIVING_GEAR, registerLivingGearItems} from '../src/absorb_p23/living_gear/index.js';
import {createDurability} from '../src/absorb_e2/durability.js';
import {Game_Time} from '../src/game_time.js';
import {loadNative} from './helpers/native_loader.mjs';
import {stageLivingEquip, validateTrancheTwoEnvelope} from '../src/absorb_p23/host_joins/tranche_two.js';

// living_gear: original fixture scope retained.
{
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

test('native item registration and decoder preserve original living weapon components and E2 copies', async () => {
    const native = await loadNative('export {item_templates, Amulet, getItem, WeaponComponent, Weapon, getItemFromKey} from "./src/items.js";', {prefix: 'p04-items-'});
    registerLivingGearItems(native);
    const gear = createLivingGear(), wear = createDurability();
    const baseKey = native.item_templates[LIVING_GEAR.weapon].getInventoryKey();
    const first = gear.prepareEquip(native.getItemFromKey(baseKey), wear, native.getItemFromKey);
    const second = gear.prepareEquip(native.getItemFromKey(baseKey), wear, native.getItemFromKey);
    assert.notEqual(first.getInventoryKey(), second.getInventoryKey());
    assert.equal(first.components.head, LIVING_GEAR.blade);
    assert.equal(first.weapon_type, 'dagger');
    assert.ok(first.getAttack() > 0);
    assert.equal(native.getItemFromKey(first.getInventoryKey()).getInventoryKey(), first.getInventoryKey());
    for (const [id, slot] of [[LIVING_GEAR.aura, 'amulet'], [LIVING_GEAR.collector, 'ring']]) {
        const item = native.getItemFromKey(native.item_templates[id].getInventoryKey());
        assert.equal(item.equip_slot, slot); assert.equal(item.id, id);
    }
});

}

// p23-host-joins-tranche-two: original fixture scope retained.
{
const key=JSON.stringify({id:LIVING_GEAR.collector});
const decode=k=>({id:JSON.parse(k).id,equip_slot:'ring',tags:{equippable:true},getInventoryKey(){return this.inventory_key||k;}});
function fixture(){return {state:{clock:0},gameplay:{player:{inventory:{[key]:2},skills:{},reputation:{}}},money:30,gear:createLivingGear(),wear:createDurability().serialize(),item:decode(key),key,equipment:{},getItem:decode,assertDisposition:()=>{}};}
function envelope(plan){const equipped=plan.equipment.player.ring;return {character:{equipment:{ring:{inventory_key:equipped}}},inventories:{person:{main_character:Object.fromEntries(Object.entries(plan.gameplay.player.inventory).map(([k,count])=>[k,{count}]))}},equipment_durability:plan.nativePatch.equipment_durability,p23_living_gear:plan.nativePatch.p23_living_gear};}
test('living equip pays one stack copy and allocates identity with wear off, without changing source owners',()=>{
 const input=fixture(),before=JSON.stringify({gameplay:input.gameplay,wear:input.wear});
 const plan=stageLivingEquip(input);assert.equal(plan.gameplay.player.inventory[key],1);
 assert.equal(JSON.parse(plan.equipment.player.ring).e2_instance,'e2.1');assert.equal(plan.nativePatch.equipment_durability.enabled,false);
 assert.equal(JSON.stringify({gameplay:input.gameplay,wear:input.wear}),before);validateTrancheTwoEnvelope(envelope(plan));
});
test('two native copies remain distinct after swapping and imported duplicate owners reject',()=>{
 const first=stageLivingEquip(fixture()),input=fixture();input.wear=first.nativePatch.equipment_durability;input.gameplay=first.gameplay;input.equipment=first.equipment.player;
 const second=stageLivingEquip(input);assert.notEqual(first.equipment.player.ring,second.equipment.player.ring);
 const save=envelope(second);validateTrancheTwoEnvelope(save);
 save.inventories.person.main_character[second.equipment.player.ring]={count:1};assert.throws(()=>validateTrancheTwoEnvelope(save),/physical owner/);
});
test('custody refusal leaves paid-copy and allocator plans untouched',()=>{
 const input=fixture(),before=JSON.stringify(input.wear);input.assertDisposition=()=>{throw Error('Held by another owner');};
 assert.throws(()=>stageLivingEquip(input),/another owner/);assert.equal(input.gameplay.player.inventory[key],2);assert.equal(JSON.stringify(input.wear),before);
});
test('staging an already allocated copy never rebinds the live inventory item to staged wear',()=>{
 const first=stageLivingEquip(fixture()),input=fixture(),allocated=first.equipment.player.ring;
 input.key=allocated;input.item=decode(allocated);input.item.getAttack=()=>10;input.wear=first.nativePatch.equipment_durability;input.gameplay.player.inventory={[allocated]:1};
 const method=input.item.getAttack;stageLivingEquip(input);
 assert.equal(input.item.getAttack,method);assert.equal(Object.hasOwn(input.item,'inventory_key'),false);
});
test('optional absence is inert and unknown fields, missing E2 allocation or stacked instance reject',()=>{
 validateTrancheTwoEnvelope({});const plan=stageLivingEquip(fixture()),save=envelope(plan);
 save.p23_living_gear.extra=true;assert.throws(()=>validateTrancheTwoEnvelope(save));delete save.p23_living_gear.extra;
 save.equipment_durability.condition={};assert.throws(()=>validateTrancheTwoEnvelope(save),/allocation/);
 const stacked=envelope(plan);stacked.character.equipment={};stacked.inventories.person.main_character[plan.equipment.player.ring]={count:2};assert.throws(()=>validateTrancheTwoEnvelope(stacked),/physical owner/);
});
test('an equipped aura refuses a malformed native hour before projection or owner mutation',()=>{
 const save=envelope(stageLivingEquip(fixture())),aura=JSON.stringify({id:LIVING_GEAR.aura,e2_instance:'e2.2'});
 save.character.equipment.amulet={inventory_key:aura};save.equipment_durability.nextId=3;save.equipment_durability.condition[aura]=100;
 save['current time']={hour:20.5};assert.throws(()=>validateTrancheTwoEnvelope(save),/calendar hour/);
 save['current time'].hour=20;validateTrancheTwoEnvelope(save);
});

}

