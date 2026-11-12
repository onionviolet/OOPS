import test from 'node:test';
import assert from 'node:assert/strict';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {caseSentence, HP_KEYS} from '../src/world_packs/hp_effect_pack.js';
import {HP_SPELL_ROWS} from '../src/spell_pack_hogwarts.js';
import {HP_MIND_SCENES} from '../src/world_packs/hp_mind_case_scenes.js';
import {advanceEngineWorld, createEngineWorld} from '../src/engine_world.js';
import {landEffect} from '../src/effect_host.js';
import {WORLD_PROPERTIES} from '../src/world_quantities.js';

const rows = new Map(HP_SPELL_ROWS.map(row => [row.id, row]));
const sceneCase = id => {
    const {holders, details, by, expect, engine} = structuredClone(HP_MIND_SCENES[id]);
    return {engine, world: {holders}, sentence: caseSentence(rows.get(id)),
        details, by, expect, keys: HP_KEYS};
};
const create = data => createEngineWorld({...data.world, ...data.engine,
    shared: {properties: Object.values(WORLD_PROPERTIES)}});
const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
const read = (engine, holder, property) => engine.world.holders[holder].properties[property];

function contact(data, engine = create(data)) {
    const result = landEffect(engine.rules, engine.world, data, {cause: 'fixture:contact', by: data.by});
    return {...engine, world: result.world};
}

for (const id of ['blind', 'stun', 'pain', 'control', 'memory', 'confuse', 'cheer', 'legilimency']) {
    test(`${id}: common runner observes the changed world after contact`, async () => {
        const result = await runCaseData(sceneCase(id), {id});
        assert.equal(result.state, 'expressed-authored', result.detail);
    });
}

test('legilimency grants no access when the target cannot be sensed', async () => {
    for (const obstacle of ['concealed', 'no-sense', 'blocked']) {
        const data = sceneCase('legilimency');
        if (obstacle === 'concealed') data.world.holders.find(h => h.id === 'subject').properties.concealed = ['mind'];
        if (obstacle === 'no-sense') data.world.holders.find(h => h.id === 'caster').properties.senses = ['sight'];
        if (obstacle === 'blocked') data.world.lawFields = [
            {id: 'sense-ward', scope: 'subject', kind: 'block', params: {verb: 'sense', object: '*'}},
        ];
        assert.equal((await runCaseData(data)).state, 'blocked:runner-expect-mismatch', obstacle);
        assert.equal(read(contact(data), 'caster', 'mind_access'), undefined, obstacle);
    }
});

test('a portrait loses sight while it retains hearing, as read by the W sense act', () => {
    const engine = contact(sceneCase('blind'));
    const sense = channel => landEffect(engine.rules, engine.world, {
        sentence: {verb: 'sense', object: 'form'},
        details: {target: {shape: 'holder', id: 'caster'}, channel},
    }, {by: 'subject', cause: 'fixture:sense'}).outcomes[0];
    assert.equal(sense('sight').skipped[0].reason, 'no-sense');
    assert.equal(sense('hearing').observed[0].target, 'caster');
});

test('fixed timers expire without refreshing and a lasting memory edit survives', () => {
    for (const [id, property, altered, baseline] of [
        ['stun', 'mind_awake', false, true],
        ['confuse', 'mind_confusion', 6, 1],
        ['cheer', 'mind_mood', 5, 2],
    ]) {
        const data = sceneCase(id);
        const engine = contact(data);
        assert.equal(read(advance(engine, data.details.minutes - 1), 'subject', property), altered);
        assert.equal(read(advance(engine, data.details.minutes), 'subject', property), baseline);
    }
    assert.deepEqual(read(advance(contact(sceneCase('memory')), 25), 'subject', 'mind_memory'), ['home']);
});

test('upkeep refreshes pain without stacking it, then pain and memory access lapse', () => {
    const data = sceneCase('pain');
    const refreshed = contact(data, advance(contact(data), 1));
    assert.equal(read(advance(refreshed, 2), 'subject', 'mind_pain'), 9);
    assert.equal(read(advance(refreshed, 3), 'subject', 'mind_pain'), 1);
    const reader = contact(sceneCase('legilimency'));
    assert.deepEqual(read(advance(reader, 1), 'caster', 'mind_access'), ['["subject","last-meeting"]']);
    assert.equal(read(advance(reader, 2), 'caster', 'mind_access'), undefined);
    assert.deepEqual(read(advance(reader, 2), 'subject', 'mind_memory'), ['last-meeting']);
});

test('a controlled subject takes a real route and resumes its own destination on lapse', () => {
    const engine = contact(sceneCase('control'));
    assert.equal(advance(engine, 1).world.holders.subject.place, 'doorway');
    const released = advance(engine, 3);
    assert.equal(read(released, 'subject', 'mind_controller'), undefined);
    assert.equal(released.world.holders.subject.place, 'hall');
});

for (const id of ['bird', 'serpent']) {
    test(`${id}: common runner creates a body that can move on its own`, async () => {
        const data = sceneCase(id);
        const result = await runCaseData(data, {id});
        assert.equal(result.state, 'expressed-authored', result.detail);
        assert.equal(advance(contact(data), 1).world.holders[id].place, 'doorway');
    });
}

test('animation computes through the common runner, moves the same statue, then loses its motion', async () => {
    const data = sceneCase('animate');
    const result = await runCaseData(data, {id: 'animate'});
    assert.equal(result.state, 'expressed-authored', result.detail);
    const {rules, world} = create(data);
    const landed = landEffect(rules, world, data, {cause: 'fixture:animation'});
    const moved = advance({rules, world: landed.world}, 1);
    assert.equal(moved.world.holders.statue.place, 'doorway');
    const refreshed = landEffect(rules, moved.world, {
        ...data, details: {...data.details, properties: {agency_goal: 'hall', agency_until: 4}},
    }, {cause: 'fixture:animation-upkeep'});
    const active = advance({rules, world: refreshed.world}, 3);
    assert.equal(active.world.holders.statue.place, 'hall');
    assert.equal(read(active, 'statue', 'agency_goal'), 'hall');
    const stopped = advance(active, 4);
    assert.equal(read(stopped, 'statue', 'agency_goal'), undefined);
    assert.equal(stopped.world.holders.statue.place, 'hall');
});
