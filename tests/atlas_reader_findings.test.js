import test from 'node:test';
import assert from 'node:assert/strict';
import {digestWorld, findingsMatrix, itemRef} from '../prototypes/world-atlas/reader-findings.mjs';
import {extractRecipes} from '../prototypes/world-atlas/game-recipes.mjs';

const sheet = {id: 'w.item.silver-sheet', label: 'Silver sheet', kind: 'item'};
const charm = {id: 'w.item.slumber-charm', label: 'Slumber charm', kind: 'item', touchedByLead: true};
const rule = {id: 'w.rule.charm', name: 'Charm crafting', kind: 'craft', inputs: [{item: 'w.item.silver-sheet', role: 'main'}, {item: 'herb powder'}, {item: ''}],
    products: [{item: 'w.item.slumber-charm'}], costs: [{amount: 15, unit: 'soli'}], steps: [{}, {}]};

test('an entity seen in three shards counts once, with three slices', () => {
    const d = digestWorld({world: 'w', shards: ['a', 'b', 'c'].map(prefix => ({prefix, census: [sheet, charm], rules: [rule]}))});
    assert.equal(d.counts.items.rows, 6);
    assert.equal(d.counts.items.distinct, 2);
    assert.equal(d.entities.find(e => e.id === sheet.id).seen, 3);
    assert.equal(d.counts.making.distinct, 1);
    assert.equal(d.rules[0].seen, 3);
});

test('rule items join to census entries; plain words without a census row stay, unmatched; empty refs drop', () => {
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [sheet, charm, {id: 'w.item.herb-powder', label: 'Herb powder', kind: 'item'}], rules: [{...rule, inputs: [...rule.inputs, {item: 'natural mineral'}]}]}]});
    const r = d.rules[0];
    assert.deepEqual(r.inputs.map(x => [x.id, x.matched]), [['w.item.silver-sheet', true], ['w.item.herb-powder', true], ['w.item~natural-mineral', false]]);
    assert.equal(r.products[0].label, 'Slumber charm');
    assert.deepEqual(itemRef('w', 'w.item.x'), {id: 'w.item.x', label: null});
});

test('texture rows dedupe by kind and wording; the matrix keeps counts only', () => {
    const t = {services: [{what: 'Carriage hire'}, {what: 'carriage  hire'}], news: [{what: 'Carriage hire'}]};
    const d = digestWorld({world: 'w', shards: [{prefix: 'a', census: [], rules: [], texture: t}]});
    assert.equal(d.counts.life.rows, 3);
    assert.equal(d.counts.life.distinct, 2);
    const m = findingsMatrix([{...d, keys: ['w1'], planned: 4, extraSlices: 0}]);
    assert.equal(m.worlds[0].read, 1);
    assert.equal(m.worlds[0].entities, undefined);
});

test('game recipes: item, component variants and equipment become workings', () => {
    const src = `
    smelting_recipes.items["Iron ingot"] = new ItemRecipe({name: "Iron ingot", materials: [{material_id: "Iron ore", count: 5}], result: {result_id: "Iron ingot", count: 1}, recipe_skill: "Smelting"});
    forging_recipes.components["Short blade"] = new ComponentRecipe({name: "Short blade", materials: [
        {material_id: "Iron ingot", count: 2, result_id: "Iron short blade"}, {material_id: "Steel ingot", count: 2, result_id: "Steel short blade"}], recipe_skill: "Forging"});
    crafting_recipes.equipment["Dagger"] = new EquipmentRecipe({name: "Dagger", components: ["short blade", "short handle"], item_type: "Weapon"});`;
    const {recipes, notes} = extractRecipes(src);
    assert.deepEqual(notes, []);
    assert.deepEqual(recipes.map(r => r.name), ['Iron ingot', 'Iron short blade', 'Steel short blade', 'Dagger']);
    assert.deepEqual(recipes[0].inputs.map(x => [x.id, x.qty]), [['game.iron-ore', 5]]);
    assert.deepEqual(recipes[1].products.map(x => x.id), ['game.iron-short-blade', 'game.short-blade']);
    assert.deepEqual(recipes[3].inputs.map(x => x.id), ['game.short-blade', 'game.short-handle']);
});
