import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';

// Description clauses and named identity through the real item builder, for a weapon, an armor and a
// processed material with lineage history.
const N = await loadNative('export {getItemFromKey, item_templates} from "./src/items.js"; export {setNamingState, emptyNaming, executeNaming, quoteNaming} from "./src/naming_act.js"; export {planProcessedMaterial} from "./src/material_lineage.js"; export {gradedKey} from "./src/harvest.js";');

test('named identity applies to armor and weapons, and history clauses join the base text', () => {
    const armor = JSON.stringify({components: {internal: 'Goat leather vest', external: 'Steel chainmail vest'}, quality: 100, e2_instance: 'e2.7'});
    const weapon = JSON.stringify({components: {head: 'Cheap iron short blade', handle: 'Simple wooden short handle'}, quality: 100, e2_instance: 'e2.8'});
    const s = N.emptyNaming(), counters = {kills: 2000};
    for (const [instance, name, armorFlag] of [['e2.7', 'Ashen Keeper', true], ['e2.8', 'Wren Point', false]]) {
        const req = () => N.quoteNaming(s, {instance, name, uses: 300, armor: armorFlag, seed: 4, counters});
        N.executeNaming(s, req(), req);
    }
    N.setNamingState(s);
    const a = N.getItemFromKey(armor), w = N.getItemFromKey(weapon);
    assert.match(a.getName(), /^Ashen Keeper \(/); assert.equal(a.affixes.length, 2);
    assert.match(a.description, /Ashen Keeper: Relic\./);
    assert.match(w.getName(), /^Wren Point \(/); assert.equal(w.affixes?.length || 0, 0);
    assert.match(w.description, /Wren Point: Relic\./);
    const plain = N.getItemFromKey(JSON.stringify({components: {internal: 'Goat leather vest', external: 'Steel chainmail vest'}, quality: 100, e2_instance: 'e2.9'}));
    assert.doesNotMatch(plain.getName(), /Ashen/);
    N.setNamingState(N.emptyNaming());
    assert.doesNotMatch(N.getItemFromKey(armor).getName(), /Ashen/);
});

test('processed material keeps its base text and adds a history clause once', () => {
    const harvested = N.gradedKey('Rat pelt', 85, 'damaged');
    const out = N.planProcessedMaterial({stock: {[harvested]: 4}, inputs: [{item_key: harvested, count: 3}], output: {id: 'Processed rat pelt', family: 'animal-hide', count: 2},
        process: {id: 'drying', revision: 1, at: 40, world_id: 'base.frontier', parameters: {method: 'rack'}}, sourceFacts: {[harvested]: {born: 12, origin_world: 'base.frontier'}}});
    const item = N.getItemFromKey(out.item_key);
    assert.equal(item.descriptionClauses[0].kind, 'base');
    assert.equal(item.descriptionClauses.filter(c => c.kind === 'history').length, 1);
    assert.match(item.description, /Processed by drying at game minute 40/);
});
