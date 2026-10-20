// L3 gear affixes (ESD3, ESD4, ESD10, ESD12-ESD14; GR1-GR17 injected random; AD36 focused checks).
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {
    AFFIXES, AFFIX_COUNT_BY_RARITY, affixRange, rollAffixes, createAffixes, mechanismAffixes,
    normalizeAffixes, affixedCraftEntries, getAffix,
} from '../src/gear_affixes.js';

const sequence = (...values) => { let i = 0; return () => values[i++ % values.length]; };
const lcg = seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 0x100000000;

test('records are plain data with stable unique ids, valid ranges and exclusive sets', () => {
    assert.ok(AFFIXES.length >= 5 && AFFIXES.length <= 10);
    assert.equal(new Set(AFFIXES.map(a => a.id)).size, AFFIXES.length);
    for (const a of AFFIXES) {
        assert.match(a.id, /^armor\.[a-z_]+$/);
        assert.ok(['flat', 'percent'].includes(a.operation) && a.range[0] > 0 && a.range[1] >= a.range[0] && a.weight > 0);
        for (const v of Object.values(a)) assert.notEqual(typeof v, 'function');
    }
    assert.equal(getAffix('armor.padded').exclusive, getAffix('armor.hardened').exclusive);
});

test('rolls are deterministic for one random sequence, differ for another, and follow the rarity ladder', () => {
    const roll = (rarity, seed) => rollAffixes({rarity, random: lcg(seed)});
    assert.deepEqual(roll('epic', 7), roll('epic', 7));
    assert.notDeepEqual(roll('epic', 7), roll('epic', 8));
    for (const [rarity, count] of Object.entries(AFFIX_COUNT_BY_RARITY)) assert.equal(roll(rarity, 3).length, count, rarity);
    // the count is a dial: a world can override it, and turn random rolls off
    assert.equal(rollAffixes({rarity: 'common', random: lcg(1), counts: {common: 2}}).length, 2);
    assert.deepEqual(rollAffixes({rarity: 'mythical', random: lcg(1), dial: {randomRolls: false}}), []);
});

test('exclusive sets never roll together, over many seeds at the highest count', () => {
    for (let seed = 1; seed <= 200; seed++) {
        const got = rollAffixes({rarity: 'mythical', random: lcg(seed)});
        const sets = got.map(g => getAffix(g.id).exclusive).filter(Boolean);
        assert.equal(new Set(sets).size, sets.length);
        assert.equal(new Set(got.map(g => g.id)).size, got.length);
    }
});

test('values stay inside the rarity range and higher rarity is never worse, including reductions', () => {
    for (const a of AFFIXES) {
        const [lo, hi] = affixRange(a, 'rare'), [lo2, hi2] = affixRange(a, 'mythical');
        assert.ok(lo2 >= lo && hi2 >= hi);
    }
    const effect = (id, rarity, u) => {
        const a = getAffix(id), [lo, hi] = affixRange(a, rarity);
        return normalizeAffixes([{id, v: lo + (hi - lo) * u}])[0];
    };
    // worst mythical roll still reduces damage taken at least as much as the best rare roll's low end
    assert.ok(affixRange(getAffix('armor.padded'), 'mythical')[0] >= affixRange(getAffix('armor.padded'), 'rare')[0]);
    assert.ok(effect('armor.padded', 'mythical', 0).v >= effect('armor.padded', 'rare', 0).v);
});

test('mechanism is the default cause: part tier decides the affix and value, no dice', () => {
    assert.deepEqual(mechanismAffixes({internal: {component_tier: 2}, external: {component_tier: 2}}, 'common'), []);
    const high = mechanismAffixes({internal: {component_tier: 6}, external: {component_tier: 3}}, 'common');
    assert.deepEqual(high.map(h => h.id).sort(), ['armor.hardened', 'armor.padded']);
    const mid = mechanismAffixes({internal: {component_tier: 4.5}, external: {component_tier: 0}}, 'common');
    assert.equal(mid.length, 1);
    assert.ok(mid[0].v > getAffix('armor.padded').range[0] && mid[0].v < getAffix('armor.padded').range[1]);
    // both are in one exclusive set, so createAffixes keeps the stronger and still fills by rarity
    const made = createAffixes({parts: {internal: {component_tier: 6}, external: {component_tier: 3}}, rarity: 'rare', random: lcg(5)});
    assert.equal(made.length, 2);
    assert.equal(made.filter(m => getAffix(m.id).exclusive === 'mitigation').length, 1);
    assert.equal(made.find(m => m.id === 'armor.padded').s, 'mechanism');
});

test('saved form is canonical: sorted, rounded, clamped; unknown ids and clashes are dropped without throwing', () => {
    const out = normalizeAffixes([{id: 'armor.vital', v: 0.04}, {id: 'armor.nope', v: 1}, {id: 'armor.hardened', v: 9},
        {id: 'armor.padded', v: 0.02}, {id: 'armor.reinforced', v: 2.00049}, {id: 'armor.vital', v: 0.01}, {id: 'armor.cushioned', v: NaN}, null]);
    assert.deepEqual(out.map(o => o.id), ['armor.hardened', 'armor.reinforced', 'armor.vital']);
    assert.equal(out[0].v, affixRange(getAffix('armor.hardened'), 'mythical')[1]);
    assert.equal(out[1].v, 2);
    assert.deepEqual(normalizeAffixes(out), out);
    assert.deepEqual(normalizeAffixes('junk'), []);
});

test('crafting commit groups by quality and affixes; plain items keep their original key', () => {
    const parsedKey = {components: {internal: 'in', external: 'ex'}, quality: 100};
    const entries = affixedCraftEntries({parsedKey, crafted: {120: 3}, rarityOf: () => 'rare', partsOf: () => ({}), random: lcg(11)});
    assert.equal(entries.reduce((n, e) => n + e.count, 0), 3);
    for (const e of entries) {
        const key = JSON.parse(e.item_key);
        assert.equal(key.quality, 120);
        assert.equal(key.affixes.length, 2);
    }
    const plain = affixedCraftEntries({parsedKey, crafted: {100: 2}, rarityOf: () => 'common', partsOf: () => ({}), random: lcg(1)});
    assert.deepEqual(plain, [{item_key: JSON.stringify({...parsedKey, quality: 100}), count: 2}]);
    const weapon = affixedCraftEntries({parsedKey: {components: {head: 'h', handle: 'd'}, quality: 1}, crafted: {200: 1}, rarityOf: () => 'legendary', partsOf: () => ({}), random: lcg(1)});
    assert.equal(JSON.parse(weapon[0].item_key).affixes, undefined);
});

test('affixes on real armor: key round trip, pipeline totals and a source row per affix', async () => {
    const {character, item_templates, getItemFromKey} = await loadNative(
        'export {character} from "./src/data/character.js"; export {item_templates, getItemFromKey} from "./src/items.js";',
        {stubs: STANCE_LOCATION_STUBS});
    const affixes = [{id: 'armor.cushioned', v: 0.02, s: 'roll'}, {id: 'armor.padded', v: 0.04, s: 'mechanism'},
        {id: 'armor.reinforced', v: 3, s: 'roll'}, {id: 'armor.vital', v: 0.05, s: 'roll'}];
    const base = JSON.parse(getItemFromKey(JSON.stringify({components: {internal: item_templates['Steel chainmail armor'].components.internal,
        external: item_templates['Steel chainmail armor'].components.external}, quality: 100})).getInventoryKey());
    const key = JSON.stringify({...base, affixes});
    const item = getItemFromKey(key);
    assert.deepEqual(item.affixes, affixes);
    assert.equal(item.getInventoryKey(), key);                      // saved key equals the key built after load
    assert.equal(getItemFromKey(item.getInventoryKey()).getInventoryKey(), key);
    assert.equal(getItemFromKey(JSON.stringify(base)).affixes.length, 0);

    const before = {...character.getFullStats()};
    character.equipItem(item);
    const after = character.getFullStats(), stats = character.getStats();
    assert.equal(stats.multiplier.affixes.damage_taken, 0.96);
    assert.equal(stats.flat.affixes.defense, 3);
    assert.equal(stats.flat.affixes.crit_resistance, 0.02);
    assert.ok(after.damage_taken < before.damage_taken && after.max_health > before.max_health);
    // re-equipping without affixes clears the category (recomputed on every change)
    character.equipItem(getItemFromKey(JSON.stringify(base)));
    assert.deepEqual(character.getStats().flat.affixes, {});
    assert.deepEqual(character.getStats().multiplier.affixes, {});
});
