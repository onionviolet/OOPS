// P1.7 engine world (PC95): every registered pack in one world on one clock.
// The mixed run below is holders, settings and scheduled outside ops only.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
    ENGINE_PACKS, advanceEngineWorld, applyEngineOps, createEngineWorld, exercisedCouplings,
    restoreEngineWorld, serializeEngineWorld,
} from '../src/engine_world.js';
import {quoteThermalBatch, THERMAL_REVISION} from '../src/craft_process_thermal.js';
import {readProvenance, readQuantity} from '../src/world_substrate.js';
import {skyQuantities} from '../src/world_sky.js';
import {brewBatchState} from '../src/world_substrate_packs/brew_steam.js';
import {shellBodyState, shellInletState} from '../src/world_substrate_packs/shell_regulator.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {grazeOp} from '../src/world_substrate_packs/living_residue.js';
import {residueQuantity} from '../src/world_substrate_packs/residue_flow.js';

const DAY = 1440;
const energy = 'energy:primeval.rank1', star = 'light:star', forage = 'stock:clover';
const active = residueQuantity('active'), matrix = residueQuantity('herb:matrix');

// World numbers, keyed by pack id (PFP3). They are the existing fixtures' rows.
const thermalLaw = {revision: THERMAL_REVISION, ambient: 20,
    extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
const settings = {
    'b.brew_steam': {thermalLaw, steamPerMinute: 4, humidityFinish: {activeAmount: 100, maxHumidity: 95, dampResiduePercent: 50}},
    'l.shell_regulator': {delay: 2, draft: 9, recharge: 7, closeBelow: 47, openAbove: 60, startleMinutes: 15},
    'g.brew_regulator': {room: 'workshop', outside: 'yard', vent: 'vent'},
    'w.residue_flow': {drains: [{from: 'workshop', to: 'field', reason: 'Gravity carries wash water downhill.'}]},
    'l.living_residue': {plots: [{field: 'field', crop: 'clover', forage, concentration: 'uniform-per-deposit', residues: [
        {substance: 'active', quantity: active, uptakePermille: 500, intakeReason: 'Trace in an eaten portion passes into tissue.',
            dose: {threshold: 5, amount: 2, kind: 'irritation', reason: 'Five trace units in one meal irritate this grazer.'}},
    ]}]},
    'l.forage_attraction': {profiles: [{light: star, minimum: 8, interval: 10}], maxNeighbors: 2,
        connections: [{from: 'ridge', to: 'hill', open: true}]},
    'm.market': {goods: ['bread'], inputs: ['flour']},
};
const shared = {effectKinds: ['light.given']};
const dials = {chainCap: 2000};
const all = ENGINE_PACKS.map(p => p.id);
// a.wild_agency cannot share a world with l.living_body today (see the first test).
const composable = all.filter(id => id !== 'a.wild_agency');
const config = {settings, shared, dials, packs: composable};

test('the registry holds twelve packs; eleven compose into one rule set and the twelfth is named with its reason', () => {
    assert.equal(ENGINE_PACKS.length, 12);
    assert.throws(() => createEngineWorld({settings, shared, dials}),
        /quantity satiety declared twice with different unit, bounds or keying \(l\.living_body, a\.wild_agency\)/);
    const engine = createEngineWorld(config);
    assert.deepEqual(engine.rules.packs, composable);
    assert.equal(engine.rules.packs.length, 11);
    // The other way round also composes: the clash is that one pair, on that one quantity.
    assert.equal(createEngineWorld({...config, packs: all.filter(id => id !== 'l.living_body')}).rules.packs.length, 11);
    assert.throws(() => createEngineWorld({...config, packs: ['x.unknown']}), /not a registered pack/);
});

const PACK_FILES = ['agency_wild.js', 'contest_bodies.js', 'market_substrate.js', 'world_sky.js',
    ...['brew_steam', 'forage_attraction', 'gu_brew_regulator', 'living_body', 'living_residue', 'residue_flow', 'shell_regulator']
        .map(name => `world_substrate_packs/${name}.js`)];
// Shared vocabulary and plain helpers; any other import is a domain's own module.
const NEUTRAL = ['world_quantities.js', 'basics.js'];

test('no pack file imports another pack file, and every domain import is a listed one', () => {
    const imports = {};
    for (const file of PACK_FILES) {
        const text = readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');
        const names = [...text.matchAll(/^import\s[^'"]*['"]([^'"]+)['"]/gm)].map(m => m[1].split('/').pop());
        const rest = names.filter(name => !NEUTRAL.includes(name)).sort();
        if (rest.length) imports[file] = rest;
    }
    const packNames = PACK_FILES.map(file => file.split('/').pop());
    for (const [file, names] of Object.entries(imports))
        assert.deepEqual(names.filter(name => packNames.includes(name)), [], `${file} imports another pack`);
    // Findings, kept explicit so a new one fails here:
    //   contest_bodies.js reaches L's creature_lifecycle.js from domain C (its own PFP10 note);
    //   gu_brew_regulator.js calls G's resolveGuActivation directly;
    //   world_sky.js imports calendar content (world numbers) rather than taking it as settings.
    // The rest are a pack's own domain law or the kernel.
    assert.deepEqual(imports, {
        'agency_wild.js': ['agency.js', 'kernel_working.js'],
        'contest_bodies.js': ['creature_lifecycle.js'],
        'market_substrate.js': ['regional_prices.js'],
        'world_sky.js': ['weather_calendar.js', 'world_calendar.js', 'world_calendar_content.js'],
        'world_substrate_packs/brew_steam.js': ['craft_process_thermal.js'],
        'world_substrate_packs/gu_brew_regulator.js': ['gu_activation.js'],
    });
});

// ---------- the mixed run ----------

const quote = quoteThermalBatch({
    law: thermalLaw,
    vessel: {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2},
    maker: {tools: ['brazier', 'paddle'], competence: 4, workCapacity: 1000, fuelStock: 10000,
        heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}},
    program: {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 1848,
        heaterTool: 'brazier', agitationTool: 'paddle', agitationPerMass: 2, requiredCompetence: 2},
    load: {mass: 4, volume: 4, specificHeat: 2, containment: 1},
});

// One valley: a workshop that brews (shell, inlet and a vent Gu all on its air),
// whose wash water drains to a grazed field, beside a ridge and a lit hill.
function mixedWorld() {
    const sky = skyQuantities(0);
    return createEngineWorld({...config, holders: [
        {id: 'workshop', kind: 'place', tags: ['sky'], quantities: {...sky, humidity: 58}},
        {id: 'yard', kind: 'place', quantities: {humidity: 20}},
        {id: 'field', kind: 'place', quantities: {[active]: 7, [matrix]: 0}},
        {id: 'ridge', kind: 'place', quantities: {[star]: 0}},
        {id: 'hill', kind: 'place', quantities: {[star]: 0}},
        {id: 'shell', kind: 'body', place: 'workshop', tags: ['shell.body'], state: {'l.shell_regulator': shellBodyState('closed')}},
        {id: 'inlet', kind: 'thing', place: 'workshop', tags: ['shell.inlet'],
            state: {'l.shell_regulator': shellInletState({mode: 'linked', position: 'closed', wanted: 'closed', follows: 'shell'})}},
        {id: 'batch', kind: 'thing', place: 'workshop', tags: ['brew.batch'], state: {'b.brew_steam': brewBatchState(thermalLaw, quote)}},
        {id: 'cauldron', kind: 'thing', place: 'workshop'},
        {id: 'vent', kind: 'thing', place: 'workshop', properties: {vent_open: true}},
        {id: 'keeper', kind: 'body', place: 'workshop', properties: {alive: true}, quantities: {[energy]: 12}},
        {id: 'draft-wing-one', kind: 'body', as: ['gu'], place: 'workshop', properties: {alive: true},
            state: {'g.brew_regulator': {specimen: {id: 'draft-wing-one', kind: 'draft-wing', rank: 1, holder: 'keeper', fedThrough: sky.day}}}},
        {id: 'clover', kind: 'thing', place: 'field', quantities: {[forage]: 4, [active]: 0, [matrix]: 1}},
        {id: 'ewe', kind: 'body', place: 'field', tags: ['living.body'], quantities: {[active]: 0, [matrix]: 2, satiety: 8},
            state: {'l.living_body': livingBodyState({species: 'sheep', rate: 1})}},
        {id: 'colony', kind: 'thing', place: 'hill'},
        {id: 'feeder', kind: 'body', place: 'ridge', properties: {alive: true, forage_light: star}},
    ]});
}

// Outside ops: the keeper rinses the cauldron, the ewe is put to graze, and the
// hill colony's emergence windows give light. Nothing here knows which pack answers.
const schedule = [
    {at: 3, cause: 'keeper.rinses', ops: [{op: 'publish', kind: 'water.poured', place: 'workshop', by: 'cauldron',
        detail: {contents: {active: 30, 'herb:matrix': 20}}}]},
    {at: 5, cause: 'shepherd.grazes', ops: [grazeOp({place: 'field', crop: 'clover', body: 'ewe', portions: 2})]},
    ...[15, 30, 45].map(at => ({at, cause: `colony.window:${at}`,
        ops: [{op: 'publish', kind: 'light.given', place: 'hill', quantity: star, amount: 12, by: 'colony'}]})),
];

const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);

function run({step = Infinity, reloadAt = []} = {}, until = DAY) {
    let engine = mixedWorld(), segments = 0;
    const cuts = [...new Set([...schedule.map(e => e.at), ...reloadAt, until])].filter(at => at <= until).sort((a, b) => a - b);
    for (const cut of cuts) {
        while (engine.world.clock < cut) {
            const result = advanceEngineWorld(engine, Math.min(cut, engine.world.clock + step));
            assert.equal(result.pending, false);
            engine = result.engine;
            segments += result.segments;
        }
        for (const event of schedule.filter(e => e.at === cut)) engine = applyEngineOps(engine, event.ops, event.cause);
        if (reloadAt.includes(cut)) engine = reload(engine);
    }
    return {engine, segments};
}

test('a mixed day runs three chains in one world and settles the same in one jump, in steps and across reloads', t => {
    const started = performance.now();
    const jump = run();
    const ms = performance.now() - started;
    const saved = serializeEngineWorld(jump.engine);
    const {world} = jump.engine;

    // Brew steam, shell and vent Gu on one room's air: three writers of one quantity.
    const air = readProvenance(world, 'workshop', 'humidity');
    for (const source of ['b.brew_steam:batch:batch', 'l.shell_regulator:inlet:inlet', 'effect:air.exchanged:draft-wing-one'])
        assert.ok(air[source], `${source} moved the workshop humidity`);
    assert.equal(58 + Object.values(air).reduce((sum, n) => sum + n, 0), readQuantity(world, 'workshop', 'humidity'));
    const smoke = world.chain.find(row => row.kind === 'smoke');
    assert.deepEqual(smoke.reactions, ['l.shell_regulator:startle@shell']);
    assert.equal(world.holders.batch.state['b.brew_steam'].finish.at, smoke.at);
    assert.ok(readQuantity(world, 'keeper', energy) < 12);
    // Rinse water to the field, the crop and the ewe.
    assert.deepEqual(['field', 'clover', 'ewe'].map(id => readQuantity(world, id, active)), [22, 8, 7]);
    assert.deepEqual(world.holders.ewe.state['l.living_body'].inbox, [{at: 5, kind: 'irritation', amount: 2, by: 'clover'}]);
    // Colony light to the wild feeder.
    assert.equal(readQuantity(world, 'hill', star), 36);
    assert.equal(world.holders.feeder.place, 'hill');
    assert.deepEqual(world.holders.feeder.state['l.forage_attraction'].lastMove,
        {at: 20, from: 'ridge', to: 'hill', light: star, here: 0, there: 12, minimum: 8});
    assert.ok(world.chain.length < dials.chainCap, 'no cause row was trimmed');

    // One jump, ten-minute steps, single minutes, and save then restore midway.
    assert.deepEqual(serializeEngineWorld(run({step: 10}).engine), saved, 'ten-minute steps');
    assert.deepEqual(serializeEngineWorld(run({step: 1}).engine), saved, 'minute steps');
    assert.deepEqual(serializeEngineWorld(run({reloadAt: [4, 5, 17, 20, 31, 33, 720]}).engine), saved, 'reloads');
    assert.deepEqual(serializeEngineWorld(reload(jump.engine)), saved);
    // A second day from a restored save matches a second day played straight through.
    const twoDays = serializeEngineWorld(run({}, 2 * DAY).engine);
    assert.deepEqual(serializeEngineWorld(run({reloadAt: [DAY]}, 2 * DAY).engine), twoDays, 'restore at the day boundary');

    // What the world's own records show crossed between packs.
    const couplings = exercisedCouplings(jump.engine);
    assert.deepEqual(couplings.filter(c => c.crossDomain).map(c => c.text), [
        'effect effect.add: w.residue_flow -> l.living_residue',
        'effect smoke: b.brew_steam -> l.shell_regulator',
        'quantity humidity: b.brew_steam + g.brew_regulator + l.shell_regulator',
        `quantity ${active}: l.living_residue + w.residue_flow`,
    ]);
    assert.deepEqual(couplings.filter(c => !c.crossDomain).map(c => c.text), [
        'effect living.harm: l.living_residue -> l.living_body',
    ]);
    t.diagnostic(`mixed day: ${jump.segments} segments, ${ms.toFixed(1)} ms per world day, ${world.chain.length} cause rows`);
    assert.ok(jump.segments < 800 && ms < 2000, 'far settlement stays inside the per-day budget');
});
