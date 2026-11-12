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
import {liquorWormState} from '../src/agency_wild.js';
import {grazeOp} from '../src/world_substrate_packs/living_residue.js';
import {residueQuantity} from '../src/world_substrate_packs/residue_flow.js';

const DAY = 1440;
const energy = 'energy:primeval.rank1', star = 'light:star', forage = 'stock:clover', fireflies = 'stock:starlight-firefly';
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
    // The light fixture's 12 a head (gu_light_attraction.test.js); none by day is this run's calibration.
    'l.colony_light': {profiles: [{members: fireflies, light: star, gradePerMember: {dark: 12, daylit: 0}}]},
    'l.forage_attraction': {profiles: [{light: star, minimum: 8, interval: 10}], maxNeighbors: 2,
        connections: [{from: 'ridge', to: 'hill', open: true}]},
    'm.market': {goods: ['bread'], inputs: ['flour']},
};
const dials = {chainCap: 2000};
const all = ENGINE_PACKS.map(p => p.id);
const config = {settings, dials};

test('the registry holds thirteen packs and all of them compose into one rule set', () => {
    assert.equal(ENGINE_PACKS.length, 13);
    const engine = createEngineWorld(config);
    assert.deepEqual(engine.rules.packs, all);
    // One declarer per fact: satiety is l.living_body's, vitality is the shared vocabulary's.
    assert.equal(engine.rules.quantities.get('satiety').owner, 'l.living_body');
    assert.equal(engine.rules.quantities.get('vitality').unit, 'vitality');
    // The substrate still refuses a second, different declaration of either.
    assert.throws(() => createEngineWorld({...config, shared: {quantities: [{id: 'satiety', unit: 'minute', min: 0, max: 1440}]}}),
        /quantity satiety declared twice with different unit, bounds or keying \(world, l\.living_body\)/);
    assert.throws(() => createEngineWorld({...config, shared: {quantities: [{id: 'vitality', unit: 'point', min: 0, max: 1_000_000}]}}),
        /quantity vitality declared twice/);
    // The wild pack declares no satiety of its own: alone, it has nothing to read.
    assert.throws(() => createEngineWorld({...config, packs: ['a.wild_agency']}), /a\.wild_agency names undeclared quantity or property satiety/);
    assert.throws(() => createEngineWorld({...config, packs: ['x.unknown']}), /not a registered pack/);
});

test('one satiety serves a grazer and a wild worm: each turns hungry at its own threshold', () => {
    const worm = liquorWormState('border');
    worm.beliefs = {cellar: {liquor: 1}};
    const engine = createEngineWorld({...config, holders: [
        {id: 'border', kind: 'place'}, {id: 'cellar', kind: 'place', quantities: {liquor: 300}},
        {id: 'worm', kind: 'body', place: 'border', tags: ['a.wild.liquor_worm'], quantities: {satiety: 400}, state: {'a.wild_agency': worm}},
        {id: 'ewe', kind: 'body', place: 'border', tags: ['living.body'], quantities: {satiety: 8},
            state: {'l.living_body': livingBodyState({species: 'sheep', rate: 1})}},
    ]});
    const {world} = advanceEngineWorld(engine, 200).engine;
    // The worm's row says hungry below 360: from 400 at one a minute that is minute 41, as before the fix.
    assert.deepEqual(world.holders.worm.state['a.wild_agency'].ring.map(({at, chose}) => ({at, chose})),
        [{at: 41, chose: 'drink:cellar'}, {at: 149, chose: 'home'}]);
    assert.equal(readQuantity(world, 'worm', 'satiety'), 1440 - (200 - 149), 'a full worm holds one meal, not the quantity bound');
    assert.deepEqual(world.chain.filter(row => row.kind === 'living.hungry').map(({at, place}) => ({at, place})), [{at: 8, place: 'border'}]);
});

const PACK_FILES = ['agency_wild.js', 'contest_bodies.js', 'market_substrate.js', 'world_sky.js',
    ...['body_alteration', 'brew_steam', 'colony_light', 'forage_attraction', 'gu_brew_regulator', 'living_body', 'living_residue', 'residue_flow', 'shell_regulator']
        .map(name => `world_substrate_packs/${name}.js`)];
// Shared vocabulary and plain helpers; any other import is a domain's own module.
const NEUTRAL = ['world_quantities.js', 'basics.js'];

test('no pack file imports another pack file, and every domain import is a listed one', () => {
    const imports = {};
    const packUrls = new Set(PACK_FILES.map(file => new URL(`../src/${file}`, import.meta.url).href));
    for (const file of PACK_FILES) {
        const url = new URL(`../src/${file}`, import.meta.url);
        const text = readFileSync(url, 'utf8');
        const paths = [...text.matchAll(/^import\s[^'"]*['"]([^'"]+)['"]/gm)].map(m => m[1]);
        assert.deepEqual(paths.filter(path => packUrls.has(new URL(path, url).href)), [], `${file} imports another pack`);
        const names = paths.map(path => path.split('/').pop());
        const rest = names.filter(name => !NEUTRAL.includes(name)).sort();
        if (rest.length) imports[file] = rest;
    }
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
        'world_substrate_packs/body_alteration.js': ['body_alteration.js'],
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
        {id: 'hill', kind: 'place', tags: ['sky'], quantities: {...sky, [star]: 0}},
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
        {id: 'colony', kind: 'thing', place: 'hill', tags: ['colony.light'], quantities: {[fireflies]: 0}},
        {id: 'feeder', kind: 'body', place: 'ridge', properties: {alive: true, forage_light: star}},
    ]});
}

// Outside ops: the keeper rinses the cauldron, the ewe is put to graze, and one
// firefly emerges in the hill colony at each of three windows after dusk (720).
// The colony's head count is its keeper's; no op here writes light or knows which pack answers.
const schedule = [
    {at: 3, cause: 'keeper.rinses', ops: [{op: 'publish', kind: 'water.poured', place: 'workshop', by: 'cauldron',
        detail: {contents: {active: 30, 'herb:matrix': 20}}}]},
    {at: 5, cause: 'shepherd.grazes', ops: [grazeOp({place: 'field', crop: 'clover', body: 'ewe', portions: 2})]},
    ...[735, 750, 765].map(at => ({at, cause: `colony.window:${at}`, ops: [{op: 'add', holder: 'colony', quantity: fireflies, amount: 1}]})),
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
    // Colony light to the wild feeder: three fireflies glow 36 through the night, and dawn (1320) puts it out.
    assert.equal(readQuantity(run({}, 1319).engine.world, 'hill', star), 36);
    assert.equal(readQuantity(world, 'hill', star), 0);
    assert.deepEqual(readProvenance(world, 'hill', star), {'l.colony_light:glow:colony': 36, 'l.colony_light:sky-turn:colony': -36});
    assert.deepEqual(world.chain.find(row => row.kind === 'sky.daylight' && row.place === 'hill' && row.at === 1320).reactions,
        ['l.colony_light:sky-turn@colony']);
    assert.equal(world.holders.feeder.place, 'hill');
    assert.deepEqual(world.holders.feeder.state['l.forage_attraction'].lastMove,
        {at: 740, from: 'ridge', to: 'hill', light: star, here: 0, there: 12, minimum: 8});
    assert.ok(world.chain.length < dials.chainCap, 'no cause row was trimmed');

    // One jump, ten-minute steps, single minutes, and save then restore midway.
    assert.deepEqual(serializeEngineWorld(run({step: 10}).engine), saved, 'ten-minute steps');
    assert.deepEqual(serializeEngineWorld(run({step: 1}).engine), saved, 'minute steps');
    assert.deepEqual(serializeEngineWorld(run({reloadAt: [4, 5, 17, 20, 720, 735, 736, 740, 751, 1320]}).engine), saved, 'reloads');
    assert.deepEqual(serializeEngineWorld(reload(jump.engine)), saved);
    // A second day from a restored save matches a second day played straight through.
    const twoDays = serializeEngineWorld(run({}, 2 * DAY).engine);
    assert.deepEqual(serializeEngineWorld(run({reloadAt: [DAY]}, 2 * DAY).engine), twoDays, 'restore at the day boundary');

    // What the world's own records show crossed between packs.
    const couplings = exercisedCouplings(jump.engine);
    assert.deepEqual(couplings.filter(c => c.crossDomain).map(c => c.text), [
        'effect effect.add: w.residue_flow -> l.living_residue',
        'effect sky.daylight: w.sky -> l.colony_light',
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
