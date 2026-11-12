import test from 'node:test';
import assert from 'node:assert/strict';
import {composeSubstrate, createWorld, applyWorldOps} from '../src/world_substrate.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_QUANTITIES as Q, WORLD_PROPERTIES as P} from '../src/world_quantities.js';
import {assemble, fitGrammar} from '../src/procedural_grammar.js';
import {defineSpellGrammar} from '../src/spell_grammar.js';
import {spellComponents, castProfile, castOutcome, failureSentences, counterFor, counters, standingField} from '../src/spell_depth.js';
import {EFFECT_OBJECTS, sharedEffect} from '../src/spell_effects.js';
import {EFFECT_OBJECTS as P_OBJECTS} from '../src/effect_grammar.js';
import {CARRIER_COST} from '../src/spell_grammar.js';
import {DND_SPELL_WORLD} from '../src/spell_pack_dnd.js';
import {MOL_SPELL_WORLD} from '../src/spell_pack_mol.js';
import {LOTM_SPELL_WORLD} from '../src/spell_pack_lotm.js';

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
    {id: 'chest', kind: 'thing', place: 'hall', quantities: {temperature: 20}}]});
const moveChest = w => applyEffect(rules, w, {verb: 'move', object: 'position', target: {shape: 'holder', id: 'chest'}, to: 'vault'}, 'test');

test('SPD5 counterplay: a counter lowers through P onto a W block field in W names', () => {
    // Every S object reads as a P object (S2R5, S side).
    for (const o of EFFECT_OBJECTS) assert.ok(P_OBJECTS[sharedEffect({verb: 'add', object: o}).object], o);
    const lift = {verb: 'move', object: 'position', target: 'object', time: 'sustained'};
    const counter = counterFor(lift);
    assert.deepEqual(counter.params, {verb: 'move', object: 'position'});
    const warded = applyEffect(rules, hall(), {...counter, target: {shape: 'holder', id: 'chest'}, field: 'counter.chest'}, 'test').world;
    assert.deepEqual(moveChest(warded).outcome.blocked, [{target: 'chest', by: 'counter.chest'}]);
    // A counter to a fire spell blocks W's add temperature, and nothing else.
    const fire = counterFor({verb: 'add', object: 'fire', target: 'object', time: 'instant'});
    assert.deepEqual(fire.params, {verb: 'add', object: 'temperature'});
    const shielded = applyEffect(rules, hall(), {...fire, target: {shape: 'holder', id: 'chest'}, field: 'fireguard'}, 'test').world;
    const heat = w => applyEffect(rules, w, {verb: 'add', object: 'temperature', amount: 30, target: {shape: 'holder', id: 'chest'}}, 'test');
    assert.deepEqual(heat(shielded).outcome.blocked, [{target: 'chest', by: 'fireguard'}]);
    assert.equal(heat(hall()).outcome.blocked.length, 0);
    assert.ok(counters(fire.params, {verb: 'add', object: 'temperature'}) && !counters(fire.params, {verb: 'move', object: 'position'}));
    // Cold is heat taken away; a mind object belongs to another owner and says so.
    assert.deepEqual(counterFor({verb: 'add', object: 'cold'}).params, {verb: 'remove', object: 'temperature'});
    assert.equal(counterFor({verb: 'remove', object: 'mood'}).owner, 'A');
    assert.ok(counterFor({verb: 'add', object: 'light'}).gap, 'light needs the world key');
    assert.deepEqual(counterFor({verb: 'add', object: 'light'}, {keys: {light: 'lamp'}}).params, {verb: 'add', object: 'light:lamp'});
});

test('SPD8 standing fields: a lasting ward is a W law field with upkeep; a timed charm lapses', () => {
    const ward = standingField({verb: 'block', object: 'position', target: 'object', time: 'lasting'}, {scope: 'chest', id: 'ward.chest'});
    assert.equal(ward.field.kind, 'block');
    assert.deepEqual(ward.field.params.upkeep, {every: 1440, renew: 'recast'});
    const w = applyWorldOps(rules, hall(), [ward], 'test');
    assert.deepEqual(moveChest(w).outcome.blocked, [{target: 'chest', by: 'ward.chest'}]);
    const charm = standingField({verb: 'transform', object: 'size', target: 'object', time: 'timed'}, {scope: 'chest', at: 5, minutes: 60});
    assert.equal(charm.field.until, 65);
    assert.equal(standingField({verb: 'add', object: 'light', target: 'object', time: 'instant'}, {scope: 'chest'}), null);
    assert.throws(() => standingField({verb: 'transform', object: 'size', target: 'object', time: 'sustained'}, {scope: 'chest'}), /needs the minutes/);
    assert.equal(standingField({verb: 'transform', object: 'size', target: 'object', time: 'lasting'}, {scope: 'chest'}).field.until, undefined);
});

test('SPD9 cost sources: each pack world names its account, and its cost slot agrees with its carrier', () => {
    for (const world of [DND_SPELL_WORLD, MOL_SPELL_WORLD, LOTM_SPELL_WORLD]) {
        assert.ok(world.costSource?.account && world.costSource.recovers, world.world);
        assert.ok([CARRIER_COST[world.carrier]].flat().includes(world.cost), world.world);
    }
});
