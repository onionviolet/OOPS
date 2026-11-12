import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteThermalBatch, thermalYield, THERMAL_REVISION} from '../src/craft_process_thermal.js';
import {
    advanceWorld, applyWorldOps, composeSubstrate, createWorld,
    readProvenance, readQuantity, resolveRef, restoreWorld, serializeWorld,
} from '../src/world_substrate.js';
import {createSkyPack, skyQuantities} from '../src/world_sky.js';
import {brewBatchState, createBrewSteamPack} from '../src/world_substrate_packs/brew_steam.js';
import {createGuBrewRegulatorPack, GU_BREW_REGULATOR} from '../src/world_substrate_packs/gu_brew_regulator.js';

const thermalLaw = {revision: THERMAL_REVISION, ambient: 20,
    extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
const quote = quoteThermalBatch({
    law: thermalLaw,
    vessel: {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2},
    maker: {tools: ['brazier', 'paddle'], competence: 4, workCapacity: 1000, fuelStock: 10000,
        heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}},
    program: {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 1848,
        heaterTool: 'brazier', agitationTool: 'paddle', agitationPerMass: 2, requiredCompetence: 2},
    load: {mass: 4, volume: 4, specificHeat: 2, containment: 1},
});
const humidityFinish = {activeAmount: 100, maxHumidity: 95, dampResiduePercent: 50};
const energy = 'energy:primeval.rank1';
const batch = world => world.holders.batch.state['b.brew_steam'];
const exchange = world => world.chain.filter(row => row.kind === 'air.exchanged');
const leaveAt = 12;
const end = 1440;

function fixture({reserve = 12, open = true, outdoorHumidity = 20, specimen = {}} = {}) {
    const rules = composeSubstrate({packs: [
        createSkyPack(),
        createBrewSteamPack({thermalLaw, steamPerMinute: 4, humidityFinish}),
        createGuBrewRegulatorPack({room: 'workshop', outside: 'yard', vent: 'vent'}),
    ]});
    const sky = skyQuantities(0);
    const world = createWorld(rules, {holders: [
        {id: 'workshop', kind: 'place', tags: ['sky'], quantities: {...sky, humidity: 58}},
        {id: 'yard', kind: 'place', quantities: {humidity: outdoorHumidity}},
        {id: 'vent', kind: 'thing', place: 'workshop', properties: {vent_open: open}},
        {id: 'keeper', kind: 'body', place: 'workshop', properties: {alive: true}, quantities: {[energy]: reserve}},
        {id: 'draft-wing-one', kind: 'body', as: ['gu'], place: 'workshop', properties: {alive: true},
            state: {[GU_BREW_REGULATOR]: {specimen: {id: 'draft-wing-one', kind: 'draft-wing', rank: 1,
                holder: 'keeper', fedThrough: sky.day, ...specimen}}}},
        {id: 'batch', kind: 'thing', place: 'workshop', tags: ['brew.batch'],
            state: {'b.brew_steam': brewBatchState(thermalLaw, quote)}},
    ]});
    return {rules, world};
}

function run({rules, world}, {depart = false, mode = 'jump', until = end} = {}) {
    let segments = 0;
    function advance(to) {
        const result = advanceWorld(rules, world, to);
        assert.equal(result.pending, false);
        world = result.world;
        segments += result.segments;
    }
    function settle(to) {
        if (mode === 'minute') {
            while (world.clock < to) advance(world.clock + 1);
        } else advance(to);
    }
    function reload() {
        world = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(world))));
    }
    if (mode === 'reload') {
        for (const at of [4, 5, 11]) {
            settle(at);
            reload();
        }
    }
    if (depart || mode === 'reload') {
        settle(leaveAt);
        if (depart) world = applyWorldOps(rules, world, [{op: 'move', holder: 'draft-wing-one', to: 'yard'}], 'keeper.carries-gu');
        if (mode === 'reload') reload();
    }
    if (mode === 'reload') {
        for (const at of [13, 30, 31, 32, 73]) {
            settle(at);
            reload();
        }
    }
    settle(until);
    return {world, segments};
}

test('pc1: a paid Gu air exchange changes the existing brew finish when the Gu leaves', t => {
    const stays = fixture();
    const burnout = Math.ceil(batch(stays.world).thermal.segment.burnSeconds / 60);
    assert.equal(burnout, 31);
    const before = run(stays, {until: leaveAt}).world;
    assert.equal(resolveRef(before, {kind: 'gu', id: 'draft-wing-one'}), 'draft-wing-one');
    assert.equal(resolveRef(before, {kind: 'body', id: 'draft-wing-one'}), 'draft-wing-one');
    assert.equal(batch(before).lit, true);
    assert.equal(readQuantity(before, 'keeper', energy), 8);

    let referenceThermal;
    for (const [label, initial, depart, times, reserve, expectedHumidity, usable, film] of [
        ['stays', stays, false, [5, 10, 15, 20, 25, 30], 0, 62, 100, 0],
        ['leaves', stays, true, [5, 10], 8, 100, 50, 50],
        ['short of essence', fixture({reserve: 3}), false, [5], 1, 100, 50, 50],
    ]) {
        const started = performance.now();
        const jump = run(initial, {depart});
        const elapsed = performance.now() - started;
        const {world} = jump;
        assert.deepEqual(run(initial, {depart, mode: 'minute'}).world, world, label);
        assert.deepEqual(run(initial, {depart, mode: 'reload'}).world, world, label);
        assert.ok(jump.segments < 800, label);
        assert.ok(elapsed < 2000, label);
        assert.equal(readQuantity(world, 'keeper', energy), reserve);
        assert.deepEqual(readProvenance(world, 'keeper', energy), {
            [GU_BREW_REGULATOR + ':exchange:draft-wing-one']: -2 * times.length,
        });
        assert.deepEqual(exchange(world).map(({at, place, by, landed, cause}) => [at, place, by, landed, cause]),
            times.flatMap(at => [['workshop', -20], ['yard', 2]].map(([place, amount]) =>
                [at, place, 'draft-wing-one', amount, GU_BREW_REGULATOR + ':exchange'])));
        assert.equal(readQuantity(world, 'yard', 'humidity'), 20 + 2 * times.length);
        assert.equal(readQuantity(world, 'workshop', 'humidity'), expectedHumidity);
        const ledger = readProvenance(world, 'workshop', 'humidity');
        assert.equal(ledger['b.brew_steam:batch:batch'], burnout * 4);
        assert.equal(ledger['effect:air.exchanged:draft-wing-one'], -20 * times.length);
        assert.equal(58 + Object.values(ledger).reduce((sum, amount) => sum + amount, 0), expectedHumidity);

        const atBurnout = run(initial, {depart, until: burnout}).world;
        const finish = batch(world).finish;
        assert.deepEqual(finish, batch(atBurnout).finish);
        assert.equal(finish.at, burnout);
        assert.equal(finish.humidity, readQuantity(atBurnout, 'workshop', 'humidity'));
        assert.equal(finish.usable, usable);
        assert.equal(finish.film, film);
        assert.deepEqual(thermalYield(thermalLaw, batch(atBurnout).thermal, 100),
            {usable: usable + film, degraded: finish.degraded, unextracted: finish.unextracted});
        referenceThermal ??= batch(world).thermal;
        assert.deepEqual(batch(world).thermal, referenceThermal);
        if (depart) {
            assert.equal(world.holders['draft-wing-one'].place, 'yard');
            assert.ok(world.chain.some(row => row.kind === 'departed' && row.at === leaveAt &&
                row.place === 'workshop' && row.by === 'draft-wing-one'));
        }
        t.diagnostic(`${label}: ${finish.humidity}% humidity, ${usable} usable, ${film} film, ${reserve} essence left; ${jump.segments} segments / ${elapsed.toFixed(1)} ms`);
    }
});

test('a closed vent, humid intake or unavailable specimen prevents the paid exchange', () => {
    for (const options of [
        {open: false}, {outdoorHumidity: 100}, {specimen: {injured: true}},
        {specimen: {fedThrough: skyQuantities(0).day - 1}}, {specimen: {kind: 'moonlight'}},
    ]) {
        const {world} = run(fixture(options), {until: 31});
        assert.deepEqual(exchange(world), []);
        assert.equal(readQuantity(world, 'keeper', energy), 12);
        assert.equal(batch(world).finish.usable, 50);
    }
});

test('a narrow humidity gradient limits the pulse without reversing the gradient', () => {
    const {world} = run(fixture({outdoorHumidity: 62}), {until: 5});
    assert.deepEqual(exchange(world).map(row => row.landed), [-10, 1]);
    assert.equal(readQuantity(world, 'workshop', 'humidity'), 68);
    assert.equal(readQuantity(world, 'yard', 'humidity'), 63);
    assert.equal(readQuantity(world, 'keeper', energy), 10);
});
