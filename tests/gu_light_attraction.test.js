import assert from 'node:assert/strict';
import test from 'node:test';
import {guColonyView, openGuColony, restoreGuColony, settleGuColonyAction, starFireflyFarm} from '../src/gu_colony.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_PROPERTIES, effectKind} from '../src/world_quantities.js';
import {
    advanceWorld, applyWorldOps, createWorld, composeSubstrate, readProvenance, readQuantity, restoreWorld, serializeWorld,
} from '../src/world_substrate.js';
import {FORAGE_ATTRACTION, createForageAttractionPack} from '../src/world_substrate_packs/forage_attraction.js';

const day = 1440;
// Authored fixture calibration. The catalogue supports Gu giving light. It
// does not set a grade per Gu, a detectable threshold or a movement cadence.
const hillProfile = {light: 'light:star', gradePerEmerged: 12, minimum: 8, interval: 10};
const given = effectKind('light_given');
const colonyId = 'hill-colony';
const guId = 'wild-light-feeder';
const keeper = 'rival-keeper';
const json = value => JSON.parse(JSON.stringify(value));

function fixture({exposed = false, open = true, conceal = false} = {}) {
    const {light} = hillProfile;
    const rules = composeSubstrate({
        packs: [createForageAttractionPack({
            profiles: [hillProfile], maxNeighbors: 2,
            connections: [{from: 'ridge', to: 'hill', open}, {from: 'ridge', to: 'lantern', open: true}],
        })],
        properties: [WORLD_PROPERTIES.senses, WORLD_PROPERTIES.concealed],
        effectKinds: [given],
    });
    const place = (id, star, extra = {}) => ({id, kind: 'place', detail: 'far', quantities: {[light]: star, ...extra}});
    const body = (id, place, properties) => ({id, place, kind: 'body', properties});
    const world = createWorld(rules, {holders: [
        place('ridge', 0), place('hill', 0), place('lantern', 0, {'light:lamp': 70}), place('unlinked', 100),
        {id: colonyId, kind: 'thing', place: 'hill'},
        body(guId, 'ridge', {alive: true, forage_light: light, ...(conceal ? {concealed: ['sight']} : {})}),
        body('other-diet', 'ridge', {alive: true, forage_light: 'light:moon'}),
        body('dead-feeder', 'ridge', {alive: false, forage_light: light}),
        body(keeper, 'hill', {alive: true, senses: ['sight']}),
        body('distant-keeper', 'ridge', {alive: true, senses: ['sight']}),
    ]});
    let colony = openGuColony(starFireflyFarm, {clock: 0, interval: 15, site: colonyId});
    if (exposed) colony = settleGuColonyAction(colony, starFireflyFarm, 0, {kind: 'light', light: 'exposed'}).colony;
    return {rules, world, colony, segments: 0};
}

function tick(run, to) {
    const advanced = advanceWorld(run.rules, run.world, to);
    assert.equal(advanced.pending, false);
    return {...run, world: advanced.world, segments: run.segments + advanced.segments};
}

// The fixture supplies a host schedule. G owns population and its calendar,
// while W owns the light account. Publish only the change in this source's
// contribution, even when caller partitions land between habitat windows.
function advance(run, to) {
    let current = run;
    let prior = guColonyView(current.colony, starFireflyFarm);
    while (prior.nextCheck <= to) {
        current = tick(current, prior.nextCheck);
        const settled = settleGuColonyAction(current.colony, starFireflyFarm, prior.nextCheck, {kind: 'advance'});
        assert.equal(settled.pending, false);
        const next = guColonyView(settled.colony, starFireflyFarm);
        const amount = (next.emerged - prior.emerged) * hillProfile.gradePerEmerged;
        const world = amount === 0 ? current.world : applyWorldOps(current.rules, current.world, [{
            op: 'publish', kind: given, place: 'hill', quantity: hillProfile.light, amount, by: colonyId,
        }], `colony.window:${colonyId}:${prior.nextCheck}`);
        current = {...current, world, colony: settled.colony};
        prior = next;
    }
    return tick(current, to);
}

function reload(run) {
    return {...run, world: restoreWorld(run.rules, json(serializeWorld(run.world))),
        colony: restoreGuColony(json(run.colony), starFireflyFarm)};
}

function look(run, by) {
    return applyEffect(run.rules, run.world, {
        verb: 'sense', channel: 'sight', by, target: {shape: 'present', place: run.world.holders[by].place},
    }, 'keeper.look').outcome.observed.map(reading => reading.target);
}

test('the colony emergence lights the hill before a living light feeder crosses the declared edge', () => {
    const dark = advance(fixture(), 14);
    assert.equal(guColonyView(dark.colony, starFireflyFarm).emerged, 0);
    assert.equal(readQuantity(dark.world, 'hill', hillProfile.light), 0);
    assert.equal(dark.world.holders[guId].place, 'ridge');
    assert.ok(!look(dark, keeper).includes(guId));

    const lit = advance(dark, 15);
    assert.equal(guColonyView(lit.colony, starFireflyFarm).emerged, 1);
    assert.equal(readQuantity(lit.world, 'hill', hillProfile.light), 12);
    assert.deepEqual(readProvenance(lit.world, 'hill', hillProfile.light), {[`effect:${given}:${colonyId}`]: 12});
    assert.deepEqual(lit.world.chain.map(({kind, by, at, cause, landed}) => ({kind, by, at, cause, landed})), [
        {kind: given, by: colonyId, at: 15, cause: `colony.window:${colonyId}:15`, landed: 12},
    ]);
    assert.equal(advance(lit, 19).world.holders[guId].place, 'ridge');

    const arrived = advance(reload(lit), 20);
    assert.equal(arrived.world.holders[guId].place, 'hill');
    assert.equal(arrived.world.holders['other-diet'].place, 'ridge');
    assert.equal(arrived.world.holders['dead-feeder'].place, 'ridge');
    assert.deepEqual(arrived.world.holders[guId].state[FORAGE_ATTRACTION].lastMove,
        {at: 20, from: 'ridge', to: 'hill', light: hillProfile.light, here: 0, there: 12, minimum: 8});
    assert.deepEqual(arrived.world.chain.slice(1).map(({kind, at, place, by, cause}) => ({kind, at, place, by, cause})), [
        {kind: 'departed', at: 20, place: 'ridge', by: guId, cause: `${FORAGE_ATTRACTION}:follow-light`},
        {kind: 'arrived', at: 20, place: 'hill', by: guId, cause: `${FORAGE_ATTRACTION}:follow-light`},
    ]);
    assert.ok(look(arrived, keeper).includes(guId));
    assert.ok(!look(arrived, 'distant-keeper').includes(guId));
    assert.ok(!look(advance(fixture({conceal: true}), 20), keeper).includes(guId));
});

test('exposure suppresses emergence and a closed connection keeps the feeder out even when the hill lights', () => {
    for (const [options, emerged, light] of [[{exposed: true}, 0, 0], [{open: false}, 3, 36]]) {
        const run = advance(fixture(options), 45);
        assert.equal(guColonyView(run.colony, starFireflyFarm).emerged, emerged);
        assert.equal(readQuantity(run.world, 'hill', hillProfile.light), light);
        assert.equal(run.world.holders[guId].place, 'ridge');
        assert.ok(!run.world.chain.some(row => row.kind === 'arrived'));
        assert.ok(!look(run, keeper).includes(guId));
    }
});

test('a far day agrees across host-window jumps, minute steps and JSON reloads with the causal receipts intact', t => {
    const initial = fixture();
    const start = performance.now();
    const jump = advance(initial, day);
    const elapsed = performance.now() - start;
    t.diagnostic(`far day: ${jump.segments} segments, ${elapsed.toFixed(1)} ms`);
    assert.ok(elapsed < 2000, 'far fixture must settle a day within the MC16 time budget');
    assert.ok(jump.segments < 800, `far day took ${jump.segments} segments`);
    let minutes = initial;
    for (let at = 1; at <= day; at++) minutes = advance(minutes, at);
    let split = initial;
    for (const at of [14, 15, 19, 20, 21, 73, day]) split = reload(advance(split, at));

    for (const run of [minutes, split]) {
        assert.deepEqual(run.world, jump.world);
        assert.deepEqual(run.colony, jump.colony);
    }
    assert.deepEqual(jump.world.chain.map(({kind, at, landed}) => [kind, at, landed]), [
        [given, 15, 12], ['departed', 20, 0], ['arrived', 20, 0], [given, 30, 12], [given, 45, 12],
    ]);
    assert.equal(readQuantity(jump.world, 'hill', hillProfile.light), 36);
    assert.equal(jump.world.holders[guId].place, 'hill');
});

test('another diet uses its own key and cadence, taking one improving hop at a time', () => {
    const light = 'light:moon';
    const connections = [
        {from: 'start', to: 'bank-b', open: true},
        {from: 'start', to: 'bank-a', open: true},
        {from: 'bank-a', to: 'crest', open: true},
        {from: 'crest', to: 'bank-b', open: true},
        {from: 'peak', to: 'crest', open: true},
    ];
    const options = {profiles: [{light, minimum: 10, interval: 5}], connections, maxNeighbors: 2};
    assert.throws(() => createForageAttractionPack({...options, maxNeighbors: 1}), /neighbor budget exceeded/);
    const rules = composeSubstrate({packs: [createForageAttractionPack(options)]});
    const places = [['start', 2], ['bank-a', 12], ['bank-b', 12], ['crest', 18], ['peak', 100]];
    const body = (id, place) => ({id, kind: 'body', place, properties: {alive: true, forage_light: light}});
    const initial = createWorld(rules, {holders: [
        ...places.map(([id, grade]) => ({id, kind: 'place', quantities: {[light]: grade}})),
        body('seeker', 'start'), body('crest-dweller', 'crest'),
    ]});
    const dim = applyWorldOps(rules, initial, ['bank-a', 'bank-b'].map(holder =>
        ({op: 'set', holder, quantity: light, amount: 9})), 'moon.dims');
    assert.equal(advanceWorld(rules, dim, 5).world.holders.seeker.place, 'start');
    assert.equal(advanceWorld(rules, initial, 5).world.holders.seeker.place, 'bank-a');
    const later = advanceWorld(rules, initial, 20).world;
    assert.equal(later.holders.seeker.place, 'crest');
    assert.equal(later.holders['crest-dweller'].place, 'crest');
    assert.deepEqual(later.chain.filter(row => row.kind === 'arrived').map(row => [row.at, row.place]),
        [[5, 'bank-a'], [10, 'crest']]);
});
