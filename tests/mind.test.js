import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {liquorWormState} from '../src/agency_wild.js';

const here = {id: 'grove', kind: 'place'};
const den = {id: 'den', kind: 'place'};
const by = 'keeper';
const holder = {id: by, kind: 'body', place: here.id, properties: {mind_awake: true}};
const worm = {id: 'worm', kind: 'body', place: here.id, tags: ['a.wild.liquor_worm'],
    properties: {mind_awake: true, mind_confusion: 1}, quantities: {satiety: 1000},
    state: {'a.wild_agency': {...liquorWormState(here.id), doing: null}}};
const config = {packs: ['l.living_body', 'a.mind', 'a.wild_agency'],
    settings: {'a.mind': {routes: [{from: here.id, to: den.id}]}}};
const create = () => createEngineWorld({...config, holders: [here, den, holder, worm]});
const advance = (engine, to) => {
    const out = advanceEngineWorld(engine, to);
    assert.equal(out.pending, false);
    return out.engine;
};
const read = (engine, property) => engine.world.holders.worm.properties[property];

function cast(engine, verb, mind, {working, minutes, targets = ['worm'], caster = by} = {}) {
    return applyEngineOps(engine, [{op: 'publish', kind: `effect.${verb}.mind`, by: caster, place: here.id,
        detail: {parts: {time: 'sustained'}, application: {targets, mind, working, minutes}}}], 'fixture:mind');
}

test('an authored Wood Path Mind Confusion Gu fixture exercises the same owner and scoped lapse', () => {
    // Catalogue lead only. This contact starts after Gu activation and uses
    // authored magnitude and duration without assigning rank or canon credit.
    const engine = cast(create(), 'transform', {faculty: 'confusion', amount: 4}, {working: 'gu.wood-confusion', minutes: 3});
    assert.equal(read(engine, 'mind_confusion'), 5);
    assert.equal(engine.world.holders.keeper.properties.mind_confusion, undefined);
    assert.equal(read(advance(engine, 2), 'mind_confusion'), 5);
    assert.equal(read(advance(engine, 3), 'mind_confusion'), 1);
});

test('overlapping leases expire independently across a restored engine and partitioned clock', () => {
    const first = cast(create(), 'add', {faculty: 'pain', amount: 2}, {working: 'first', minutes: 2});
    const second = cast(first, 'add', {faculty: 'pain', amount: 3}, {working: 'second', minutes: 4});
    assert.equal(read(second, 'mind_pain'), 5);
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(second))), config);
    const midway = advance(restored, 2);
    assert.equal(read(midway, 'mind_pain'), 3);
    assert.equal(read(advance(midway, 4), 'mind_pain'), undefined);
    assert.deepEqual(serializeEngineWorld(advance(midway, 4)), serializeEngineWorld(advance(second, 4)));
});

test('a commanded wild agent moves under the lease and its own agency brings it home afterward', () => {
    const directed = cast(create(), 'bind', {faculty: 'will', to: den.id}, {working: 'command', minutes: 3});
    const moved = advance(directed, 1);
    assert.equal(moved.world.holders.worm.place, den.id);
    const released = advance(moved, 3);
    assert.equal(read(released, 'mind_controller'), undefined);
    const home = advance(released, 61);
    assert.equal(home.world.holders.worm.place, here.id);
    assert.ok(home.world.chain.some(row => row.kind === 'arrived' && row.place === here.id && row.cause === 'a.wild_agency:choose'));
});

test('a mismatched target or a lease without a duration changes no faculty', () => {
    const wrong = cast(create(), 'add', {faculty: 'pain', amount: 2}, {working: 'wrong', minutes: 2, targets: ['missing']});
    const untimed = cast(create(), 'add', {faculty: 'pain', amount: 2}, {working: 'untimed'});
    assert.equal(read(wrong, 'mind_pain'), undefined);
    assert.equal(read(untimed, 'mind_pain'), undefined);
});
