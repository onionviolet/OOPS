import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';
import {mitigateCombatDamage, mitigateCombatDamageFromStats} from '../src/combat_math.js';
import {combatHitText} from '../src/ui_polish.js';
import {normalizeMix, normalizeMultipliers, attackMix, wornProtection, defenseMultipliers, typeMultiplier, typedStrike, describeDeclared, PROTECTION_CAP, WEAPON_MIX} from '../src/damage_types.js';

const player = (equipment = {}) => ({tags: {main_character: true}, getEquipment: () => equipment});
const worn = (id, slot, external) => ({id, equip_slot: slot, components: external ? {external} : undefined});
const stats = {defense: 0, min_damage_share: .05, damage_taken: 1};

test('mix normalises to weights summing to 1 and drops bad entries', () => {
    assert.deepEqual(normalizeMix({piercing: 9, bludgeoning: 1}), {piercing: .9, bludgeoning: .1});
    assert.deepEqual(normalizeMix({piercing: 1, nonsense: 5, slashing: -2, fire: NaN}), {piercing: 1});
    assert.equal(normalizeMix({}), null); assert.equal(normalizeMix(undefined), null);
    assert.deepEqual(normalizeMultipliers({piercing: 1.5, fire: -1, slashing: 'x', acid: 99}), {piercing: 1.5, acid: 3});
});

test('typed mix against per-type protection equals splitting the strike, and a scalar of 1 is the old math', () => {
    const mix = {piercing: .9, bludgeoning: .1}, mods = {piercing: 1.5};
    assert.ok(Math.abs(typeMultiplier(mix, mods) - 1.45) < 1e-12);
    const values = [20, 10];
    const split = Object.entries(mix).reduce((sum, [t, w]) => sum + mitigateCombatDamage(values.map(v => v * w), 0) * (mods[t] ?? 1), 0);
    const scalar = mitigateCombatDamageFromStats(values, stats, 0, 0, typeMultiplier(mix, mods));
    assert.ok(Math.abs(scalar - 43.5) < 1e-9, String(scalar));
    assert.ok(Math.abs(split - scalar) < 1);   // split loses only to per-part rounding and chip floors
    assert.equal(mitigateCombatDamageFromStats(values, stats, 3, 0, 1), mitigateCombatDamage(values, 3));
    assert.equal(mitigateCombatDamageFromStats(values, stats, 3, 0), mitigateCombatDamageFromStats(values, stats, 3, 0, 1));
    assert.equal(mitigateCombatDamageFromStats([20], stats, 0, 0, 0), 0);
});

test('undeclared attackers and defenders are untyped and unchanged', () => {
    assert.deepEqual(attackMix({tags: {}}), {physical: 1});
    assert.deepEqual(defenseMultipliers({tags: {}}), {});
    const s = typedStrike({fighter: {tags: {}}, target: {tags: {}}});
    assert.deepEqual(s, {multiplier: 1, kind: 'physical', note: ''});
    // A player in plain clothes against an untyped enemy, and against a typed enemy, takes the old damage.
    assert.equal(typedStrike({fighter: {attack_types: {piercing: .7, slashing: .3}, tags: {}}, target: player({})}).multiplier, 1);
    assert.equal(typedStrike({fighter: {tags: {}}, target: player({torso: worn('Iron chainmail armor', 'torso', 'Iron chainmail vest')})}).multiplier, 1);
});

test('the player attacks with the weapon family mix; unarmed is bludgeoning', () => {
    for (const [type, mix] of Object.entries(WEAPON_MIX)) {
        const p = {tags: {main_character: true}, getEquipment: () => ({weapon: {weapon_type: type}})};
        assert.deepEqual(attackMix(p), normalizeMix(mix), type);
    }
    assert.deepEqual(attackMix(player({})), {bludgeoning: 1});
    const slashers = typedStrike({fighter: {tags: {main_character: true}, getEquipment: () => ({weapon: {weapon_type: 'sword'}})}, target: {tags: {}, defense_types: {slashing: .5, piercing: 1.5}}});
    assert.ok(Math.abs(slashers.multiplier - (.7 * .5 + .3 * 1.5)) < 1e-12);
});

test('worn pieces add protection per type, capped, and only worn slots count', () => {
    const chain = [worn('Iron chainmail armor', 'torso', 'Iron chainmail vest'), worn('Iron chainmail helmet', 'head', 'Iron chainmail helmet armor'), worn('Iron chainmail pants', 'legs', 'Iron chainmail greaves')];
    const p = wornProtection({torso: chain[0], head: chain[1], legs: chain[2], weapon: worn('Iron chainmail armor', 'weapon')});
    assert.ok(Math.abs(p.slashing - .24) < 1e-12 && Math.abs(p.piercing - .12) < 1e-12);
    assert.equal(wornProtection({torso: {...chain[0], equip_slot: 'head'}}).slashing, undefined);   // inventory copy in the wrong slot
    const many = {}; for (const s of ['head', 'torso', 'arms', 'legs', 'feet', 'cape']) many[s] = {...worn('Hardened plate', s), protection_types: {slashing: .3}};
    assert.equal(wornProtection(many).slashing, PROTECTION_CAP);   // declared per-item protection, capped
    const hit = typedStrike({fighter: {attack_types: {slashing: 1}, tags: {}}, target: player({torso: chain[0], head: chain[1], legs: chain[2]})});
    assert.ok(Math.abs(hit.multiplier - .76) < 1e-12); assert.equal(hit.note, 'resisted');
    // A 1% effect applies but stays out of the log text.
    assert.equal(typedStrike({fighter: {attack_types: {slashing: .3, piercing: .7}, tags: {}}, target: player({cape: worn('Rat pelt cape', 'cape')})}).note, '');
});

test('hit text names the type and the effect, and reads as before when undeclared', () => {
    assert.equal(combatHitText({target: 'Hero', damage: 2}), 'Hero was hit for 2 physical damage');
    assert.equal(combatHitText({target: 'Crab', damage: 12.34, kind: 'bludgeoning', note: 'weak spot'}), 'Crab was hit for 12.4 bludgeoning damage (weak spot)');
});

test('real native content declares types that reach the fight', async () => {
    const {enemy_templates, item_templates, getItemFromKey} = await loadNative('export {item_templates,getItemFromKey} from "./src/items.js"; export {enemy_templates} from "./src/enemies.js";', {prefix: 'dt-native-'});
    const rat = enemy_templates['Wolf rat'], crab = enemy_templates['River crab'];
    assert.deepEqual(normalizeMix(rat.attack_types), {piercing: .7, slashing: .3});
    assert.equal(describeDeclared(crab).defense, 'slashing x0.8, piercing x0.7, bludgeoning x1.2');
    const hammer = {tags: {main_character: true}, getEquipment: () => ({weapon: {weapon_type: 'hammer'}})};
    const spear = {tags: {main_character: true}, getEquipment: () => ({weapon: {weapon_type: 'spear'}})};
    assert.equal(typedStrike({fighter: hammer, target: crab}).note, 'weak spot');
    assert.equal(typedStrike({fighter: spear, target: crab}).note, 'resisted');
    assert.equal(typedStrike({fighter: hammer, target: enemy_templates['Wolf rat']}).multiplier, 1);
    // Spread-copies (location.js builds fighters from templates) keep the declaration.
    const copy = Object.assign(Object.create(Object.getPrototypeOf(crab)), crab);
    assert.deepEqual(copy.defense_types, crab.defense_types);
    // Real gear restored from its inventory key still resolves protection.
    const vest = getItemFromKey(item_templates['Iron chainmail armor'].getInventoryKey());
    assert.ok(wornProtection({[vest.equip_slot]: vest}).slashing > 0);
});

test('a real enemy takes more from the weapon its shell is weak to', async () => {
    const {enemy_templates, Enemy} = await loadNative('export {item_templates} from "./src/items.js"; export {enemy_templates,Enemy} from "./src/enemies.js";', {prefix: 'dt-enemy-'});
    const fresh = () => { const e = new Enemy({...enemy_templates['River crab'], stats: {...enemy_templates['River crab'].stats}}); e.is_alive = true; e.init(); return e; };
    const weapon = type => ({tags: {main_character: true}, getEquipment: () => ({weapon: {weapon_type: type}})});
    const dealt = type => { const crab = fresh(), s = typedStrike({fighter: weapon(type), target: crab});
        return crab.takeDamage({damage_values: [400], type_multiplier: s.multiplier}).damage_taken; };
    const plain = fresh().takeDamage({damage_values: [400]}).damage_taken;
    assert.ok(dealt('hammer') > plain && plain > dealt('spear'), `${dealt('hammer')} ${plain} ${dealt('spear')}`);
    assert.ok(Math.abs(dealt('hammer') / plain - 1.2) < .01 && Math.abs(dealt('spear') / plain - .7) < .01);
});
