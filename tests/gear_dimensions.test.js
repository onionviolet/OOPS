import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {mitigateCombatDamage} from '../src/combat_math.js';
import {
    DAMAGE_TAKEN_FLOOR, CRIT_RESISTANCE_CAP, shellDimensions, paddingDimensions,
    scaleReduction, effectiveDamageTaken, effectiveCritChance, isReductionStat,
    materialToughness, wearScale, WEAR_SCALE_RANGE,
} from '../src/gear_dimensions.js';
import {createDurability} from '../src/absorb_e2/durability.js';

test('defaults reproduce the original mitigation; options add the chip floor and percent layers in order', () => {
    assert.equal(mitigateCombatDamage([100, 0.2], 1000), 5.2);
    assert.equal(mitigateCombatDamage([10, .2], 3), 7.2);
    // hit 200, defense 1000: the chip floor decides (5% = 10, 3% = 6), then the percent layer
    assert.equal(mitigateCombatDamage([200], 1000), 10);
    assert.equal(mitigateCombatDamage([200], 1000, {floorShare: .03}), 6);
    assert.equal(mitigateCombatDamage([200], 1000, {floorShare: .03, taken: .9}), 5.4);
    // flat defense still comes before the percent layer
    assert.equal(mitigateCombatDamage([50], 20, {taken: .9}), 27);
});

test('dimensions come from mechanism: more material, harder material and tier reduce more', () => {
    const chest = shellDimensions({tier: 2, strength: 100, partCount: 5});
    const glove = shellDimensions({tier: 2, strength: 100, partCount: 2});
    const soft = shellDimensions({tier: 2, strength: 60, partCount: 5});
    const higher = shellDimensions({tier: 3, strength: 100, partCount: 5});
    assert.ok(chest.damage_taken.multiplier < glove.damage_taken.multiplier);
    assert.ok(chest.damage_taken.multiplier < soft.damage_taken.multiplier);
    assert.ok(higher.damage_taken.multiplier < chest.damage_taken.multiplier);
    assert.ok(chest.min_damage_share.multiplier < soft.min_damage_share.multiplier);
    const warm = paddingDimensions({tier: 2, warmth: 120, partCount: 5});
    const cool = paddingDimensions({tier: 2, warmth: 100, partCount: 5});
    assert.ok(warm.crit_resistance.flat > cool.crit_resistance.flat);
    assert.ok(paddingDimensions({tier: 1, warmth: 100, partCount: 2}).crit_resistance.flat > 0);
});

test('rarity strengthens reductions, floors and caps are defaults and never reach zero', () => {
    assert.equal(isReductionStat('damage_taken'), true);
    assert.equal(isReductionStat('agility'), false);
    for (const rarity of [1, 1.1, 1.3, 1.6, 2, 2.5]) assert.ok(scaleReduction(.95, rarity) <= .95);
    assert.equal(scaleReduction(1, 2.5), 1);
    assert.equal(effectiveDamageTaken(.2), DAMAGE_TAKEN_FLOOR);
    assert.equal(effectiveDamageTaken(.9), .9);
    assert.equal(effectiveDamageTaken(undefined), 1);
    assert.equal(effectiveCritChance(.05, 0), .05);
    assert.equal(effectiveCritChance(.05, undefined), .05);
    assert.ok(effectiveCritChance(.2, 5) > 0);
    assert.equal(effectiveCritChance(.2, 5), .2 * (1 - CRIT_RESISTANCE_CAP));
    assert.equal(effectiveCritChance(.2, 5, 1), 0);
});

test('real armor templates carry the dimensions: shells reduce, padding resists crits, nothing is on the wrong layer', async () => {
    const {item_templates} = await loadNative('export {item_templates} from "./src/items.js";');
    const part = id => item_templates[id].component_stats;
    assert.ok(part('Steel plate chestplate armor').damage_taken.multiplier < part('Iron chainmail vest').damage_taken.multiplier);
    assert.ok(part('Steel plate chestplate armor').min_damage_share.multiplier < 1);
    assert.ok(part('Wool shirt').crit_resistance.flat > part('Leather vest').crit_resistance.flat);
    assert.equal(part('Steel plate chestplate armor').crit_resistance, undefined);
    assert.equal(part('Wool shirt').damage_taken, undefined);
});

test('worn armor changes what the native hero actually loses: percent layer after flat defense, crit chance cut', async () => {
    const {character, item_templates} = await loadNative(
        'export {character} from "./src/data/character.js"; export {item_templates} from "./src/items.js";',
        {stubs: STANCE_LOCATION_STUBS});
    const levelable = character.getLevelableComponent();
    const hit = () => {
        levelable.stats.full.health = 60;
        const {damage_taken} = character.takeDamage({damage_values: [40]});
        return damage_taken;
    };
    const bare = hit();
    assert.equal(bare, mitigateCombatDamage([40], character.getFullStats().defense));
    assert.equal(character.getFullStats().crit_resistance, 0);
    character.equipItem(item_templates['Steel chainmail armor']);
    const worn = character.getFullStats();
    assert.ok(worn.damage_taken < 1 && worn.min_damage_share < 0.05 && worn.crit_resistance > 0);
    const armored = hit();
    assert.ok(armored < bare);
    // flat defense alone would leave a higher number; the percent layer takes more off
    assert.ok(armored < mitigateCombatDamage([40], worn.defense));
    assert.ok(effectiveCritChance(0.05, worn.crit_resistance) < 0.05);
    // sources stay separate: the totals come from the Equipment category
    const stats = character.getStats();
    assert.ok(stats.multiplier.equipment.damage_taken < 1);
    assert.ok(stats.flat.equipment.crit_resistance > 0);
});

test('toughness: authored or derived from strength, and equal-strength materials wear at different rates', async () => {
    assert.deepEqual(materialToughness({strength: 100}), {value: 70, source: 'derived from strength'});
    assert.ok(materialToughness({strength: 200}).value < materialToughness({strength: 60}).value);
    assert.deepEqual(materialToughness({strength: 100, toughness: 45}), {value: 45, source: 'authored'});
    assert.equal(wearScale({strength: 100, toughness: 70}), 1);
    assert.ok(wearScale({strength: 100, toughness: 45}) > 1);
    assert.ok(wearScale({strength: 100, toughness: 200}) < 1);
    assert.equal(wearScale({strength: 1, toughness: 1}), WEAR_SCALE_RANGE.max);

    const {Weapon, item_templates} = await loadNative('export {Weapon, item_templates} from "./src/items.js";');
    const handle = 'Simple wooden short handle';
    const brittle = new Weapon({components: {head: 'Cheap iron long blade', handle}});
    const tempered = new Weapon({components: {head: 'Steel long blade', handle}});
    assert.equal(item_templates['Cheap iron long blade'].material_strength, item_templates['Steel long blade'].material_strength);
    assert.equal(item_templates['Cheap iron long blade'].material_toughness_source, 'authored');
    assert.equal(item_templates['Steel long blade'].material_toughness_source, 'derived from strength');
    assert.ok(brittle.getWearScale() > tempered.getWearScale());
    // the real wear path: same hits, the brittle instance loses more condition
    const durability = createDurability({enabled: true});
    const wear = item => {
        const instance = JSON.stringify({id: 'x', 'e2_instance': 'e2.1'});
        item.getInventoryKey = () => instance;
        durability.load({enabled: true, condition: {[instance]: 100}});
        durability.wearItem(item, 100);
        return 100 - durability.condition(instance);
    };
    assert.ok(wear(brittle) > wear(tempered));
    assert.equal(durability.wearItem({tags: {equippable: true}, getInventoryKey: () => JSON.stringify({id: 'x', 'e2_instance': 'e2.2'})}, 100), true);
});

import {mitigateCombatDamageFromStats} from '../src/combat_math.js';
test('armor penetration consumes flat armor points without bypassing guards, chip floors or percent resistance',()=>{
 const target={defense:20,min_damage_share:.03,damage_taken:.9};
 assert.equal(mitigateCombatDamageFromStats([50],target,3),24.3);
 assert.equal(mitigateCombatDamageFromStats([50],target,3,10),33.3);
 assert.equal(mitigateCombatDamageFromStats([50],target,3,100),42.3);
 assert.equal(mitigateCombatDamageFromStats([50],target,3,Infinity),24.3);
 assert.equal(mitigateCombatDamageFromStats([50],target,3,-5),24.3);
 assert.equal(mitigateCombatDamageFromStats([50],{defense:0},0,100),50);
 assert.equal(mitigateCombatDamageFromStats([50],{defense:1000,min_damage_share:.03},0,10),1.5);
});
test('actual native trophy points and both defender classes use the same penetration law',async()=>{
 const {character,item_templates,Enemy}=await loadNative('export {character} from "./src/data/character.js"; export {item_templates} from "./src/items.js"; export {Enemy} from "./src/enemies.js";',{stubs:STANCE_LOCATION_STUBS});
 character.equipItem(item_templates['Wolf trophy']);assert.equal(character.getFullStats().armor_penetration,50);
 character.equipItem(item_templates['Steel chainmail armor']);const stats=character.getFullStats();stats.health=stats.max_health;
 const actual=character.takeDamage({damage_values:[50],armor_penetration:10,give_skill_xp:false}).damage_taken;
 assert.equal(actual,mitigateCombatDamageFromStats([50],stats,0,10));
 const enemy=new Enemy({name:'Armored target',stats:{health:1000,attack:10,agility:10,dexterity:10,intuition:10,defense:20}});
 const expected=mitigateCombatDamageFromStats([50],enemy.getFullStats(),0,character.getFullStats().armor_penetration);
 assert.equal(enemy.takeDamage({damage_values:[50],armor_penetration:character.getFullStats().armor_penetration}).damage_taken,expected);
});
