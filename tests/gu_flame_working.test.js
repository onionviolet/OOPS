import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {compileGuFlameWorking, GU_FLAME_ESSENCE} from '../src/gu_flame_working.js';
import {createLayeredProtectionPack, PROTECTION_IMPACT} from '../src/world_substrate_packs/layered_protection.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';

const {moves} = JSON.parse(readFileSync(new URL('../docs/research/gu-identity-evidence.json', import.meta.url)));
const {roles: sourceRoles} = moves.find(move => move.id === 'xiao-yan-fire-set');
const recipe = {id: 'fire-assembly', roles: sourceRoles.map(({id, kind}) => ({id, kind, minutes: 1}))};
const config = {
    packs: ['w.sky'],
    shared: {quantities: [WORLD_QUANTITIES.energy, WORLD_QUANTITIES.vitality], properties: [
        {id: 'guKind', type: 'label'}, {id: 'keeper', type: 'label'},
        {id: 'fedThrough', type: 'level', min: 0, max: 100},
    ]},
};
const bindings = {
    operator: {kind: 'operator', id: 'keeper'},
    flameTarget: {kind: 'body', id: 'target'},
    ...Object.fromEntries(sourceRoles.map(({id}) => [id, {kind: 'gu', id}])),
};
const substitute = {...bindings, economy: {kind: 'gu', id: 'light'}};

function bench(essence = 10, {worldConfig = config, layers = [], innate = {}} = {}) {
    const living = worldConfig.packs.includes('l.living_body');
    return createEngineWorld({...worldConfig, holders: [
        {id: 'yard', kind: 'place'},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'yard', quantities: {[GU_FLAME_ESSENCE]: essence}},
        {id: 'target', kind: 'body', place: 'yard',
            quantities: {vitality: 20, ...(living ? {satiety: 0} : {}), ...innate},
            ...(living ? {tags: ['living.body'], state: {'l.living_body': livingBodyState({species: 'human', rate: 0})},
                properties: {protectionLayers: layers.map(layer => layer.id)}} : {})},
        ...layers,
        ...[...sourceRoles, {id: 'light', kind: 'light-source'}].map(({id, kind}) => ({
            id, kind: 'thing', as: ['gu'], place: 'yard', properties: {guKind: kind, keeper: 'keeper', fedThrough: 100},
        })),
    ]});
}

const advance = (engine, minute) => advanceEngineWorld(engine, minute).engine;
const read = engine => ({
    essence: engine.world.holders.keeper.quantities[GU_FLAME_ESSENCE],
    vitality: engine.world.holders.target.quantities.vitality,
    working: engine.records.workings.trial,
});
function begin(engine, design = recipe, refs = bindings, id = 'trial') {
    const compiled = compileGuFlameWorking(engine, design, refs);
    assert.equal(compiled.ok, true);
    return {engine: startEngineWorking(engine, {...compiled, id, payer: 'keeper'}), law: compiled.law};
}

test('chapter 275 parts derive flame count, per-flame force and fuel, and land through the shared engine', () => {
    const {engine, law} = begin(bench());
    const partway = advance(engine, 2);
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(partway))),
        {...config, host: {laws: [law]}});
    const complete = advance(engine, 4);
    assert.deepEqual(serializeEngineWorld(advance(restored, 4)), serializeEngineWorld(complete));
    const {essence, vitality, working} = read(complete);
    assert.equal(working.record.status, 'complete');
    assert.equal(essence, 4);
    assert.equal(vitality, 16);
    assert.deepEqual(working.landed.map(effect => effect.status), ['landed', 'landed']);
    assert.deepEqual(working.record.receipts.flatMap(row => row.truth.effects)
        .map(effect => effect.details.amount), [2, 2]);
});

test('one replacement fails the source recipe but can run as a different, less efficient composition', () => {
    const engine = bench();
    assert.deepEqual(compileGuFlameWorking(engine, recipe, substitute), {ok: false, requirements: [
        {role: 'economy', type: 'gu', kind: 'fire-source', reason: 'wrong-gu-kind'},
    ]});
    assert.equal(read(engine).essence, 10);

    const design = {id: 'light-supported-fire', roles: recipe.roles.map(role =>
        role.id === 'economy' ? {...role, kind: 'light-source'} : role)};
    const {essence, vitality, working} = read(advance(begin(engine, design, substitute).engine, 4));
    assert.equal(working.record.status, 'complete');
    assert.equal(vitality, 16);
    assert.equal(essence, 1);
    assert.deepEqual(working.record.receipts.map(row => row.truth.costs[0].amount), [1, 1, 1, 6]);

    const failed = read(advance(begin(bench(8), design, substitute).engine, 4));
    assert.equal(failed.working.record.status, 'interrupted');
    assert.equal(failed.working.record.receipts.at(-1).reason, 'needs more essence');
    assert.equal(failed.essence, 5);
    assert.equal(failed.vitality, 20);
    assert.deepEqual(failed.working.landed, []);
});

test('a lost core interrupts the live working and preserves earlier support costs', () => {
    const {engine} = begin(bench());
    const partway = advance(engine, 3);
    const transferred = applyEngineOps(partway, [
        {op: 'property', holder: 'attack', property: 'keeper', value: 'rival'},
    ], 'trial:transfer');
    const {essence, vitality, working} = read(advance(transferred, 4));
    assert.equal(working.record.status, 'interrupted');
    assert.equal(working.record.receipts.at(-1).reason, 'gu-not-held');
    assert.equal(essence, 7);
    assert.equal(vitality, 20);
    assert.deepEqual(working.landed, []);
});

const protectionPack = createLayeredProtectionPack();
const protectedWorld = {...config, packs: [...config.packs, 'l.living_body', protectionPack.id], ownPacks: [protectionPack]};
const garment = {id: 'coat', kind: 'thing', place: 'yard', properties: {protectionOrder: 1},
    quantities: {'protection-capacity': 4, 'protection-rating:fire': 1, 'protection-rating:physical': 1}};
const ward = {id: 'ward', kind: 'thing', place: 'yard', properties: {protectionOrder: 0},
    quantities: {'protection-capacity': 2, 'protection-rating:fire': 2}};
const capacity = (engine, layer) => engine.world.holders[layer].quantities['protection-capacity'];
const contacts = engine => engine.world.chain.filter(event => event.kind === 'protection.resolved').map(event => event.detail);
const harm = engine => engine.world.holders.target.state['l.living_body'].inbox;

test('Red Fire consumes the outer fire ward, then reaches the coat and body on the next flame', () => {
    const clothed = advance(begin(bench(10, {worldConfig: protectedWorld, layers: [garment]})).engine, 4);
    assert.equal(read(clothed).vitality, 18);
    assert.equal(capacity(clothed, 'coat'), 2);

    const {engine, law} = begin(bench(16, {worldConfig: protectedWorld, layers: [garment, ward]}));
    const first = advance(engine, 4);
    assert.deepEqual(contacts(first), [
        {target: 'target', type: 'fire', amount: 2, layers: [{id: 'ward', absorbed: 2, remaining: 0}], resisted: 0, damage: 0},
        {target: 'target', type: 'fire', amount: 2, layers: [{id: 'coat', absorbed: 1, remaining: 3}], resisted: 0, damage: 1},
    ]);
    assert.equal(read(first).essence, 10);
    assert.equal(read(first).vitality, 19);
    assert.deepEqual(harm(first).map(({kind, amount}) => ({kind, amount})), [{kind: 'fire', amount: 1}]);

    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(first))),
        {...protectedWorld, host: {laws: [law]}});
    const secondCast = state => advance(begin(state, recipe, bindings, 'second').engine, 8);
    const after = secondCast(restored);
    assert.deepEqual(serializeEngineWorld(after), serializeEngineWorld(secondCast(first)));
    assert.equal(read(after).vitality, 17);
    assert.equal(capacity(after, 'ward'), 0);
    assert.equal(capacity(after, 'coat'), 1);
    assert.equal(harm(after).length, 3);
});

test('physical contact bypasses a charged fire ward and reads any remaining innate resistance', () => {
    const hit = engine => applyEngineOps(engine, [{op: 'publish', kind: PROTECTION_IMPACT, place: 'yard', by: 'keeper',
        detail: {target: 'target', type: 'physical', amount: 4}}], 'trial:strike');
    const lower = hit(bench(10, {worldConfig: protectedWorld, layers: [garment, ward]}));
    // Authored example of a rank benefit mapped to a body stat by a world.
    const higher = hit(bench(10, {worldConfig: protectedWorld, layers: [garment, ward], innate: {'innate-resistance:physical': 2}}));
    for (const state of [lower, higher]) {
        assert.equal(capacity(state, 'ward'), 2);
        assert.equal(capacity(state, 'coat'), 3);
    }
    assert.equal(read(lower).vitality, 17);
    assert.equal(read(higher).vitality, 19);
    assert.equal(contacts(higher)[0].resisted, 2);
    assert.equal(harm(higher)[0].amount, 1);
});
