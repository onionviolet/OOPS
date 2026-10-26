import test from 'node:test';
import assert from 'node:assert/strict';
import {THERMAL_REVISION, quoteThermalBatch, createThermalState, advanceThermal, stopThermal, resumeThermal, thermalYield, validateThermalState} from '../src/craft_process_thermal.js';
const law = {revision: THERMAL_REVISION, ambient: 20, extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
const vessel = {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2};
const maker = {tools: ['brazier', 'paddle'], competence: 4, workCapacity: 1000, fuelStock: 10000,
    heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}};
const program = {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 60,
    heaterTool: 'brazier', agitationTool: 'paddle', agitationPerMass: 2, requiredCompetence: 2};
const input = (mass = 4) => ({law, vessel, maker, program, load: {mass, volume: mass, specificHeat: 2, containment: 1}});
const quote = args => quoteThermalBatch({...input(), ...args});
const settle = (q, seconds = q.durationSeconds, fuel) => advanceThermal(law, createThermalState(law, q, fuel === undefined ? {} : {fuel}), seconds);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('hot pulse and gentle hold have distinct residence, extraction and irreversible loss', () => {
    const gentle = quote({});
    const pulse = quote({program: {...program, sourceTemperature: 140, targetTemperature: 100, holdSeconds: 8}});
    const g = settle(gentle), p = settle(pulse);
    assert.ok(g.extractionSeconds > p.extractionSeconds);
    assert.equal(g.degradationSeconds, 0);
    assert.ok(p.degradationSeconds > 0);
    assert.ok(thermalYield(law, g, 1000).usable > thermalYield(law, p, 1000).usable);
    assert.equal(Object.values(thermalYield(law, p, 1000)).reduce((a,b) => a+b), 1000);
    const cooled = advanceThermal(law, stopThermal(law, p), 200);
    assert.ok(cooled.temperature < p.temperature);
    assert.ok(cooled.degradationSeconds >= p.degradationSeconds);
    assert.equal(cooled.fuelSpent, p.fuelSpent);
});

test('vessel inertia and geometry change actual temperature rather than summed op levels', () => {
    const q = quote({}), slow = quote({vessel: {...vessel, thermalMass: 40}});
    const wide = quote({vessel: {...vessel, surfaceArea: 4}});
    assert.ok(settle(slow, 10).temperature < settle(q, 10).temperature);
    assert.ok(settle(wide, 10).temperature > settle(q, 10).temperature);
    assert.ok(slow.costs.fuel > q.costs.fuel);
    const stop = stopThermal(law, settle(q, 10));
    assert.ok(advanceThermal(law, stop, 10).temperature < stop.temperature);
});

test('clock partition preserves facts across finite fuel exhaustion and JSON roundtrip', () => {
    const q = quote({});
    const initial = createThermalState(law, q, {fuel: 5});
    const long = advanceThermal(law, initial, 150);
    let short = initial;
    for (const seconds of [3, 17, 1, 29, 100]) short = advanceThermal(law, JSON.parse(JSON.stringify(short)), seconds);
    assert.deepEqual(short, long);
    assert.equal(long.fuelSpent, 5);
    assert.ok(long.temperature < 21);
    const continued = advanceThermal(law, long, 1000);
    assert.equal(continued.fuelSpent, 5, 'finite burner cannot supply unlimited late heat');
    assert.ok(continued.temperature < long.temperature);
});

test('1x/10x mass uses capacity, heat transfer, actual workload and scalable fuel', () => {
    const one = quoteThermalBatch(input(4)), ten = quoteThermalBatch(input(40));
    assert.equal(one.ok, true); assert.equal(ten.ok, true);
    assert.equal(ten.costs.agitationWork, one.costs.agitationWork * 10);
    assert.ok(ten.warmSeconds > one.warmSeconds);
    assert.ok(ten.costs.fuel > one.costs.fuel);
    // Holding a fixed-temperature source for the same time costs the same fuel,
    // but the larger load warms less: a supported fixed-burner exception.
    const smallPulse = settle(one, 5, 1.25), bigPulse = settle(ten, 5, 1.25);
    assert.equal(smallPulse.fuelSpent, bigPulse.fuelSpent);
    assert.ok(smallPulse.temperature > bigPulse.temperature);
    const y1 = thermalYield(law, settle(one), 1000), y10 = thermalYield(law, settle(ten), 10000);
    assert.ok(y10.usable >= y1.usable * 9);
    near(ten.heatCapacity, vessel.thermalMass + 40 * 2);
});

test('capacity refusal, missing means, stock and unsupported revisions precede custody spending', () => {
    const cases = [
        {load: {...input().load, volume: 101}},
        {load: {...input().load, containment: 3}},
        {maker: {...maker, fuelStock: 0}}, {maker: {...maker, tools: []}},
        {maker: {...maker, competence: 0}}, {maker: {...maker, workCapacity: 0}},
        {maker: {...maker, heater: {...maker.heater, maxTemperature: 50}}},
        {maker: {...maker, heater: {...maker.heater, maxConductance: 1}}},
    ];
    for (const change of cases) {
        const args = {...input(), ...change}, before = structuredClone(args), q = quoteThermalBatch(args);
        assert.equal(q.ok, false); assert.ok(q.reasons.length);
        assert.throws(() => createThermalState(law, q), /refused/);
        assert.deepEqual(args, before);
    }
    assert.throws(() => quote({law: {...law, revision: 'old'}}), /Unsupported/);
    assert.throws(() => quote({load: {...input().load, mass: NaN}}), /mass/);
    assert.throws(() => quote({program: {...program, holdSeconds: -1}}), /duration/);
});

test('same maker means resolve equally across comfort modes and helper identity, with no draws', () => {
    const baseline = input(), before = structuredClone(baseline);
    const expected = quoteThermalBatch(baseline);
    for (const mode of ['quick', 'guided', 'deep']) {
        assert.deepEqual(quoteThermalBatch({...baseline, mode, actor: 'helper'}), expected);
        assert.deepEqual(settle(expected), settle(quoteThermalBatch({...baseline, mode, actor: 'player'})));
    }
    assert.deepEqual(baseline, before);
    const s = settle(expected);
    validateThermalState(JSON.parse(JSON.stringify(s)));
    assert.throws(() => validateThermalState({...s, temperature: NaN}), /temperature/);
    assert.throws(() => advanceThermal(law, s, -1), /elapsed/);
    assert.throws(() => thermalYield(law, s, 1.2), /active amount/);
});


test('shared separation vessel view, default geometry and paid reheat preserve history', () => {
    const shared = {id:'pot', material:'ceramic', capacity:100, closure:'open', condenserPermille:0,
        meshSize:1, thermalMass:4, heatTransfer:1, films:[]};
    const q = quote({vessel:shared, load:{...input().load,containment:0}, maker:{...maker, heater:{...maker.heater,maxConductance:100}}});
    assert.equal(q.ok,true);
    near(q.surfaceArea, Math.cbrt(100) ** 2);
    const incompatible = quote({vessel:shared, load:{...input().load,requiredClosure:'sealed'}});
    assert.equal(incompatible.ok,false);
    const stopped = advanceThermal(law,stopThermal(law,settle(quote({}),20)),20);
    const restartQuote = quote({program:{...program,startTemperature:stopped.temperature}});
    const resumed = resumeThermal(law,stopped,restartQuote);
    assert.equal(resumed.extractionSeconds,stopped.extractionSeconds);
    assert.equal(resumed.degradationSeconds,stopped.degradationSeconds);
    const next = advanceThermal(law,resumed,10);
    assert.ok(next.fuelSpent > stopped.fuelSpent);
    assert.ok(next.temperature > stopped.temperature);
    assert.throws(() => resumeThermal(law,stopped,quote({})),/Stale/);
});


test('late admitted portions receive only subsequent extraction and degradation', () => {
    const q = quote({}), first = settle(q,20);
    const baseline = {extractionSeconds:first.extractionSeconds,degradationSeconds:first.degradationSeconds};
    assert.deepEqual(thermalYield(law,first,1000,baseline),{usable:0,degraded:0,unextracted:1000});
    const next = advanceThermal(law,first,10);
    const early = thermalYield(law,next,1000), late = thermalYield(law,next,1000,baseline);
    assert.ok(early.usable > late.usable);
    assert.equal(Object.values(late).reduce((a,b)=>a+b),1000);
    assert.throws(()=>thermalYield(law,next,1000,{...baseline,extractionSeconds:999}),/ahead/);
});
