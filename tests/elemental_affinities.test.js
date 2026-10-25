import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';
import {mitigateCombatDamage} from '../src/combat_math.js';
import {normalizeElementalOption, getAttackAffinity, getItemAffinities, getEquipmentAffinities, getElementalDefenseModifier, describeElementalPreparation} from '../src/absorb_e3/elemental_affinities.js';

const earthEnemy = {name:'Boar', tags:{beast:true}};
const waterEnemy = {name:'Seen aquatic opponent', tags:{aquatic:true}};
const armor = (id, slot, components) => ({id, equip_slot:slot, components});

test('option defaults off and never coerces old or malformed save values', () => {
    for (const value of [undefined, null, false, 'true', 1, {}, []]) assert.equal(normalizeElementalOption(value),false);
    assert.equal(normalizeElementalOption(true),true);
    const reloaded = JSON.parse(JSON.stringify({options:{elemental_affinities:true}}));
    assert.equal(normalizeElementalOption(reloaded.options.elemental_affinities),true);
});

test('gear swap changes actual native damage only against fitting attacks', () => {
    const equipment = {torso:armor('Iron chainmail armor','torso')};
    const calculate = (enabled, attacker, worn) => mitigateCombatDamage([100,80],10+getElementalDefenseModifier({enabled,attacker,equipment:worn,baseDamage:100}));
    assert.equal(calculate(false,earthEnemy,equipment),160);
    assert.equal(calculate(true,earthEnemy,equipment),152);
    assert.equal(calculate(true,waterEnemy,equipment),160);
    const waterproof = {torso:armor('Alligator armor','torso')};
    assert.equal(calculate(true,waterEnemy,waterproof),152);
    assert.equal(calculate(true,earthEnemy,waterproof),160);
    assert.equal(calculate(true,earthEnemy,{}),160);
    // Native floor, sub-one hits and full armor protection remain authoritative.
    const bonus = getElementalDefenseModifier({enabled:true,attacker:earthEnemy,equipment,baseDamage:100});
    assert.equal(mitigateCombatDamage([100,0.2],1000+bonus),5.2);
});

test('only current fitting native slots count and protection stays capped', () => {
    const equipment = Object.fromEntries(['head','torso','arms','legs','feet'].map(slot=>[slot,armor('Iron chainmail armor',slot)]));
    assert.equal(getEquipmentAffinities(equipment).earth,0.12);
    assert.equal(getEquipmentAffinities({inventory:armor('Iron chainmail armor','torso'), weapon:armor('Iron chainmail armor','weapon')}).earth,0);
    assert.equal(getEquipmentAffinities({torso:armor('Iron chainmail armor','head')}).earth,0);
    const same=armor('Boar hide cape','cape');
    assert.equal(getEquipmentAffinities({cape:same,torso:same}).earth,0.04);
    const componentGear=armor('Custom native assembly','torso',{internal:'Leather vest',external:'Alligator chestplate armor'});
    assert.deepEqual(getItemAffinities(componentGear),['water']);
    assert.equal(getElementalDefenseModifier({enabled:true,attacker:earthEnemy,equipment,baseDamage:NaN}),0);
    assert.equal(getAttackAffinity({name:'Unknown creature',tags:{beast:true}}),'physical');
    assert.equal(getAttackAffinity({name:'Boar',tags:{main_character:true}}),'physical');
});

test('preparation view reveals only provided encounters, deduplicates and changes with setting', () => {
    const equipment={torso:armor('Alligator armor','torso')};
    const view=describeElementalPreparation({enabled:true,equipment,encounteredEnemies:[waterEnemy,waterEnemy]});
    assert.equal(view.rows.length,1);
    assert.equal(view.rows[0].defenseFraction,0.04);
    assert.equal(describeElementalPreparation({enabled:false,equipment,encounteredEnemies:[waterEnemy]}).rows[0].defenseFraction,0);
    assert.deepEqual(describeElementalPreparation({enabled:true,equipment}).rows,[]);
    assert.ok(!JSON.stringify(view).includes('Boar'));
});

test('native equipped IDs and reconstructed component gear provide real preparation', async () => {
    const {item_templates,getItemFromKey,enemy_templates} = await loadNative('export {item_templates,getItemFromKey} from "./src/items.js"; export {enemy_templates} from "./src/enemies.js";', {prefix: 'e3-native-'});
    for(const [id,element] of [['Iron chainmail armor','earth'],['Alligator armor','water'],['Rat pelt cape','air'],['Turtleshell platemail armor','earth']]) {
        const item=item_templates[id];
        assert.ok(item,`native ${id} exists`);
        const restored=getItemFromKey(item.getInventoryKey());
        assert.ok(getItemAffinities(restored).includes(element),id);
        assert.equal(getEquipmentAffinities({[restored.equip_slot]:restored})[element],0.04);
    }
    assert.equal(getAttackAffinity(enemy_templates['Boar']),'earth');
    assert.equal(getAttackAffinity(enemy_templates['Huge dragonfly']),'air');
    assert.equal(getAttackAffinity(enemy_templates['River crab']),'water');
    const attacker=enemy_templates['Boar'];
    const equipment={torso:item_templates['Iron chainmail armor']};
    assert.ok(getElementalDefenseModifier({enabled:true,attacker,equipment,baseDamage:attacker.getAttackPower()||attacker.stats.attack})>0);
});
