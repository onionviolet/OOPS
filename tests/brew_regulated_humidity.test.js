import test from 'node:test';
import assert from 'node:assert/strict';
import {
    advanceWorld, applyWorldOps, composeSubstrate, createWorld, explainEffect,
    readProvenance, readQuantity, restoreWorld, serializeWorld,
} from '../src/world_substrate.js';
import {createBrewSteamPack, brewBatchState} from '../src/world_substrate_packs/brew_steam.js';
import {createShellRegulatorPack, shellBodyState, shellInletState} from '../src/world_substrate_packs/shell_regulator.js';
import {SHELL_LAW} from '../src/meadow_shell_state.js';
import {advanceThermal, quoteThermalBatch, thermalYield, THERMAL_REVISION} from '../src/craft_process_thermal.js';

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

// Original E fixture row. A binder that sets as the burner dies absorbs enough
// water above 95% humidity to leave half the usable active in the vessel film.
const humidityFinish = {activeAmount: 100, maxHumidity: 95, dampResiduePercent: 50};
const leaveAt = 2;
const end = 1440;
const brew = world => world.holders.batch.state['b.brew_steam'];
const inlet = world => world.holders.inlet.state['l.shell_regulator'];

function workshop(finish, quantities = {humidity: 58}) {
    const rules = composeSubstrate({packs: [
        createBrewSteamPack({thermalLaw, steamPerMinute: 4, humidityFinish: finish}),
        createShellRegulatorPack({...SHELL_LAW, startleMinutes: 15}),
    ], dials: {chainCap: 1000}});
    const world = createWorld(rules, {holders: [
        {id: 'workshop', kind: 'place', quantities},
        {id: 'yard', kind: 'place'},
        {id: 'shell', kind: 'body', place: 'workshop', tags: ['shell.body'],
            state: {'l.shell_regulator': shellBodyState('closed')}},
        {id: 'inlet', kind: 'thing', place: 'workshop', tags: ['shell.inlet'],
            state: {'l.shell_regulator': shellInletState({mode: 'linked', position: 'closed', wanted: 'closed', follows: 'shell'})}},
        {id: 'batch', kind: 'thing', place: 'workshop', tags: ['brew.batch'],
            state: {'b.brew_steam': brewBatchState(thermalLaw, quote)}},
    ]});
    return {rules, world};
}

function run(rules, start, {depart, mode, burnout, until = end}) {
    let world = start;
    let segments = 0;
    const started = performance.now();
    const advance = to => {
        const result = advanceWorld(rules, world, to);
        assert.equal(result.pending, false);
        world = result.world;
        segments += result.segments;
    };
    const reload = () => { world = restoreWorld(rules, JSON.parse(JSON.stringify(serializeWorld(world)))); };
    const settle = to => {
        if (mode === 'minute') while (world.clock < to) advance(world.clock + 1);
        else advance(to);
    };
    if (depart || mode === 'reload') {
        settle(leaveAt);
        if (mode === 'reload') reload();
        if (depart) world = applyWorldOps(rules, world, [{op: 'move', holder: 'shell', to: 'yard'}], 'keeper.leaves');
    }
    if (mode === 'reload') {
        reload();
        settle(burnout + 1);
        reload();
    }
    settle(until);
    return {world, segments, ms: performance.now() - started};
}

test('E pc1: the shell-driven inlet changes the retained brew at burner burnout', t => {
    const {rules, world} = workshop(humidityFinish);
    const initialThermal = brew(world).thermal;
    const burnout = Math.ceil(initialThermal.segment.burnSeconds / 60);
    const before = advanceWorld(rules, world, leaveAt).world;
    assert.deepEqual(inlet(before).pending, {position: 'open', at: 3});
    assert.equal(inlet(before).position, 'closed');
    assert.equal(brew(before).lit, true);

    const results = [];
    for (const depart of [false, true]) {
        const label = depart ? 'leaves' : 'stays';
        const jump = run(rules, world, {depart, mode: 'jump', burnout});
        const minute = run(rules, world, {depart, mode: 'minute', burnout});
        const reload = run(rules, world, {depart, mode: 'reload', burnout});
        assert.deepEqual(minute.world, jump.world, label + ' minute steps');
        assert.deepEqual(reload.world, jump.world, label + ' JSON reload');
        assert.ok(jump.segments <= 800, label + ' far segments per simulated day');
        assert.ok(jump.ms <= 2000, label + ' far milliseconds per simulated day');

        const checkpoint = run(rules, world, {depart, mode: 'jump', until: burnout}).world;
        const finish = brew(jump.world).finish;
        assert.equal(finish.at, burnout);
        assert.equal(finish.place, 'workshop');
        assert.equal(finish.humidity, readQuantity(checkpoint, 'workshop', 'humidity'));
        assert.deepEqual(brew(checkpoint).finish, finish, 'later cooling leaves the finish intact');
        assert.equal(brew(checkpoint).lit, false);
        assert.equal(brew(jump.world).thermal.temperature, thermalLaw.ambient);
        assert.ok(brew(checkpoint).thermal.temperature > thermalLaw.ambient, 'stored heat remains after burnout');
        assert.ok(brew(jump.world).thermal.extractionSeconds > brew(checkpoint).thermal.extractionSeconds,
            'stored heat continues extraction during cooling');
        assert.deepEqual(brew(jump.world).thermal, advanceThermal(thermalLaw, initialThermal, end * 60));
        const base = thermalYield(thermalLaw, brew(checkpoint).thermal, humidityFinish.activeAmount);
        assert.deepEqual({usable: finish.usable + finish.film, unextracted: finish.unextracted, degraded: finish.degraded}, base);
        assert.equal(finish.usable + finish.film + finish.degraded + finish.unextracted, finish.activeAmount);
        const ledger = readProvenance(checkpoint, 'workshop', 'humidity');
        assert.equal(ledger['b.brew_steam:batch:batch'], burnout * 4);
        assert.notEqual(ledger['l.shell_regulator:inlet:inlet'], undefined);
        assert.equal(58 + Object.values(ledger).reduce((sum, amount) => sum + amount, 0), finish.humidity);

        const smoke = jump.world.chain.find(e => e.kind === 'smoke');
        assert.equal(smoke.at, burnout);
        assert.equal(smoke.cause, 'b.brew_steam:batch');
        assert.equal(smoke.by, 'batch');
        if (depart) {
            const left = jump.world.chain.find(e => e.kind === 'departed');
            assert.equal(left.at, leaveAt);
            assert.equal(left.place, 'workshop');
            assert.equal(left.by, 'shell');
            assert.equal(left.cause, 'keeper.leaves');
            assert.deepEqual(left.reactions, ['l.shell_regulator:inlet-leave@inlet']);
            assert.equal(jump.world.holders.shell.place, 'yard');
            assert.deepEqual(inlet(jump.world), {mode: 'linked', position: 'closed', wanted: 'closed', pending: null, follows: null});
            assert.deepEqual(smoke.reactions, []);
        } else {
            assert.ok(jump.world.chain.some(e => e.kind === 'draft.opened' && e.at === 3));
            assert.deepEqual(smoke.reactions, ['l.shell_regulator:startle@shell']);
            const startled = jump.world.chain.find(e => e.kind === 'shell.pull' && e.cause === smoke.seq);
            if (startled) assert.equal(explainEffect(jump.world, startled.seq)[0].seq, smoke.seq);
        }

        t.diagnostic(`${label}: ${JSON.stringify(finish)}, fuel ${brew(checkpoint).thermal.fuelSpent}, temperature ${brew(checkpoint).thermal.temperature}, extraction ${brew(checkpoint).thermal.extractionSeconds} -> ${brew(jump.world).thermal.extractionSeconds}; ` +
            [jump, minute, reload].map(r => `${r.segments} segments / ${r.ms.toFixed(1)} ms`).join(', '));
        results.push(finish);
    }

    const [stays, leaves] = results;
    assert.equal(stays.humidity, 47);
    assert.ok(stays.humidity <= humidityFinish.maxHumidity);
    assert.equal(stays.film, 0);
    assert.equal(leaves.humidity, 100);
    assert.equal(leaves.film, Math.floor((stays.usable * humidityFinish.dampResiduePercent) / 100));
    assert.ok(leaves.usable > 0 && leaves.usable < stays.usable);
});

test('B humidity finish is opt-in and records when the place has no humidity reading', () => {
    const legacy = workshop();
    const unmetered = workshop(humidityFinish, {});
    const dry = advanceWorld(legacy.rules, legacy.world, 90).world;
    const unknown = advanceWorld(unmetered.rules, unmetered.world, 90).world;
    assert.equal('finish' in brew(dry), false);
    assert.equal(brew(unknown).finish.humidity, null);
    assert.equal(brew(unknown).finish.film, 0);
    assert.deepEqual(brew(unknown).thermal, brew(dry).thermal);
});
