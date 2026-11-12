import test from 'node:test';
import assert from 'node:assert/strict';
import {composeSubstrate, createWorld, applyWorldOps} from '../src/world_substrate.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_QUANTITIES as Q, WORLD_PROPERTIES as P} from '../src/world_quantities.js';
import {assemble, fitGrammar} from '../src/procedural_grammar.js';
import {defineSpellGrammar} from '../src/spell_grammar.js';
import {spellComponents, castProfile, castOutcome, failureSentences, counterFor, counters, standingField, WORLD_COST_SOURCES} from '../src/spell_depth.js';
import {EFFECT_COSTS} from '../src/spell_effects.js';

const parts = {intent: 'raise', roots: ['lev'], target: 'object', execution: 'sustained', delivery: 'spoken', gesture: 'swish_flick',
    focus: 'wand', attention: 'full', carrier: 'wand', cost: 'stamina', access: 'taught'};

test('SPD1 components: skipping words or focus costs more and is less sure; unrecorded costs nothing', () => {
    assert.deepEqual(spellComponents(parts).skipped, []);
    const wordless = spellComponents({...parts, delivery: 'mental'}), wandless = spellComponents({...parts, delivery: 'mental', focus: 'none'});
    assert.deepEqual(wandless.skipped, ['incantation', 'focus']);
    assert.ok(wandless.costFactor > wordless.costFactor && wordless.costFactor > 1);
    assert.ok(wandless.reliabilityLoss > wordless.reliabilityLoss);
    assert.equal(spellComponents({...parts, gesture: 'unrecorded', focus: 'unrecorded'}).costFactor, 1);
    // The grammar derives components on every assembled spell.
    const built = assemble(fitGrammar(defineSpellGrammar(), [{id: 'lev', parts}]), {...parts, delivery: 'mental'});
    assert.ok(built.ok);
    assert.deepEqual(built.value.derived.components.skipped, ['incantation']);
});

test('SPD2 and SPD3 skill: axes rise on separate curves, rust after idle weeks, drills shape area and precision', () => {
    const novice = castProfile(), practised = castProfile({casts: 40, drills: {precision: 60}});
    assert.ok(practised.reliability > novice.reliability && practised.speed > novice.speed);
    assert.ok(practised.reliability - novice.reliability > practised.speed - novice.speed, 'reliability comes before speed');
    assert.ok(practised.precision > 0.7 && practised.area === 0);
    const rusty = castProfile({casts: 40, lastUsed: 0}, {at: 10 * 7 * 24 * 60});
    assert.ok(rusty.reliability < practised.reliability && rusty.rust > 0);
    assert.ok(castProfile({casts: 1e6}, {plateau: 0.8}).reliability <= 0.8, 'a per-spell plateau caps it');
});

test('SPD4 failure modes are sentences, drawn by address', () => {
    const s = {verb: 'move', object: 'position', target: 'object', time: 'sustained', direction: 'up', limits: []};
    const modes = failureSentences(s);
    assert.equal(modes.backfire.target, 'self');
    assert.equal(modes.partial.time, 'instant');
    assert.equal(modes.misfire.target, 'creature');
    const sure = castOutcome(s, {profile: {reliability: 1}, components: spellComponents(parts)});
    assert.equal(sure.mode, 'success');
    const seen = new Set();
    for (let i = 0; i < 200; i++) seen.add(castOutcome(s, {profile: {reliability: 0, precision: 0}, at: `try.${i}`}).mode);
    assert.deepEqual([...seen].sort(), ['backfire', 'fizzle', 'misfire', 'partial']);
    const a = castOutcome(s, {profile: {reliability: 0.5}, at: 'same'}), b = castOutcome(s, {profile: {reliability: 0.5}, at: 'same'});
    assert.deepEqual(a, b, 'same address, same result');
});

// A W world with a chest in a hall, for SPD5 and SPD8.
const rules = composeSubstrate({packs: [{id: 'w.vocabulary', quantities: Object.values(Q), properties: Object.values(P)}]});
const hall = () => createWorld(rules, {clock: 0, holders: [{id: 'hall', kind: 'place', quantities: {}}, {id: 'vault', kind: 'place', quantities: {}},
    {id: 'chest', kind: 'thing', place: 'hall', quantities: {}}]});
const moveChest = w => applyEffect(rules, w, {verb: 'move', object: 'position', target: {shape: 'holder', id: 'chest'}, to: 'vault'}, 'test');

test('SPD5 counterplay: a counter is a W block field on the spell verb and object', () => {
    const lift = {verb: 'move', object: 'position', target: 'object', time: 'sustained'};
    const counter = counterFor(lift);
    assert.ok(counters(counter.params, lift) && counters(counterFor(lift, {broad: true}).params, {verb: 'add', object: 'fire'}));
    assert.ok(!counters(counter.params, {verb: 'add', object: 'fire'}));
    const warded = applyEffect(rules, hall(), {...counter, target: {shape: 'holder', id: 'chest'}, field: 'counter.chest'}, 'test').world;
    assert.deepEqual(moveChest(warded).outcome.blocked, [{target: 'chest', by: 'counter.chest'}]);
});

test('SPD8 standing fields: a lasting ward is a W law field with upkeep; a timed charm lapses', () => {
    const ward = standingField({verb: 'block', object: 'position', target: 'object', time: 'lasting', direction: 'move'}, {scope: 'chest', id: 'ward.chest'});
    assert.equal(ward.field.kind, 'block');
    assert.deepEqual(ward.field.params.upkeep, {every: 1440, renew: 'recast'});
    const w = applyWorldOps(rules, hall(), [ward], 'test');
    assert.deepEqual(moveChest(w).outcome.blocked, [{target: 'chest', by: 'ward.chest'}]);
    const charm = standingField({verb: 'transform', object: 'size', target: 'object', time: 'timed'}, {scope: 'chest', at: 5, minutes: 60});
    assert.equal(charm.field.until, 65);
    assert.equal(standingField({verb: 'add', object: 'light', target: 'object', time: 'instant'}, {scope: 'chest'}), null);
});

test('SPD9 cost sources: each world names an account the cost slot accepts', () => {
    for (const [world, source] of Object.entries(WORLD_COST_SOURCES)) assert.ok(EFFECT_COSTS.includes(source.cost), world);
});
