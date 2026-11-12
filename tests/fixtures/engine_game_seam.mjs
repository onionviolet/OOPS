// E23 seam probe (proposal): the test-side half of the bridge between the playable game and the
// engine world. Nothing here is loaded by src/main.js. The world is the mixed valley of
// tests/engine_world.test.js with the records of tests/engine_host.test.js laid into its yard; both
// are copied because a test file cannot be imported without running it. Every number is fixture data.
import {advanceEngineWorld, applyEngineOps, createEngineWorld, makeEngineBinding, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking, storeEngineWorking} from '../../src/engine_world.js';
import {defineWorkingLaw} from '../../src/kernel_working.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../../src/spell_law.js';
import {sentenceFromIntent, sharedEffect} from '../../src/spell_effects.js';
import {PROCESS_LAW, processMethod} from '../../src/process_law.js';
import {quoteThermalBatch, THERMAL_REVISION} from '../../src/craft_process_thermal.js';
import {skyAt, skyQuantities} from '../../src/world_sky.js';
import {brewBatchState} from '../../src/world_substrate_packs/brew_steam.js';
import {shellBodyState, shellInletState} from '../../src/world_substrate_packs/shell_regulator.js';
import {livingBodyState} from '../../src/world_substrate_packs/living_body.js';
import {grazeOp} from '../../src/world_substrate_packs/living_residue.js';
import {residueQuantity} from '../../src/world_substrate_packs/residue_flow.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../../src/world_quantities.js';
import {steelPack} from './process_craft_packs.js';

export const DAY = 1440;
const energy = 'energy:primeval.rank1', star = 'light:star', forage = 'stock:clover', fireflies = 'stock:starlight-firefly';
const active = residueQuantity('active'), matrix = residueQuantity('herb:matrix');

// ---- the mixed valley (tests/engine_world.test.js) ----
const thermalLaw = {revision: THERMAL_REVISION, ambient: 20,
    extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
const settings = {
    'b.brew_steam': {thermalLaw, steamPerMinute: 4, humidityFinish: {activeAmount: 100, maxHumidity: 95, dampResiduePercent: 50}},
    'l.shell_regulator': {delay: 2, draft: 9, recharge: 7, closeBelow: 47, openAbove: 60, startleMinutes: 15, settle: 'rate'},
    'g.brew_regulator': {room: 'workshop', outside: 'yard', vent: 'vent'},
    'w.residue_flow': {drains: [{from: 'workshop', to: 'field', reason: 'Gravity carries wash water downhill.'}]},
    'l.living_residue': {plots: [{field: 'field', crop: 'clover', forage, concentration: 'uniform-per-deposit', residues: [
        {substance: 'active', quantity: active, uptakePermille: 500, intakeReason: 'Trace in an eaten portion passes into tissue.',
            dose: {threshold: 5, amount: 2, kind: 'irritation', reason: 'Five trace units in one meal irritate this grazer.'}},
    ]}]},
    'l.colony_light': {profiles: [{members: fireflies, light: star, gradePerMember: {dark: 12, daylit: 0}}]},
    'l.forage_attraction': {profiles: [{light: star, minimum: 8, interval: 10}], maxNeighbors: 2,
        connections: [{from: 'ridge', to: 'hill', open: true}]},
    'm.market': {goods: ['bread'], inputs: ['flour']},
};
const quote = quoteThermalBatch({
    law: thermalLaw,
    vessel: {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2},
    maker: {tools: ['brazier', 'paddle'], competence: 4, workCapacity: 1000, fuelStock: 10000,
        heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}},
    program: {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 1848,
        heaterTool: 'brazier', agitationTool: 'paddle', agitationPerMass: 2, requiredCompetence: 2},
    load: {mass: 4, volume: 4, specificHeat: 2, containment: 1},
});

// ---- the yard's records (tests/engine_host.test.js) ----
const own = ['debt', 'fuel', 'wear'].map(id => ({id, unit: id, min: 0, max: 100000}));
const P = (verb, object) => ({verb, object, time: 'instant', target: 'bound', carrier: 'pattern', cost: 'stored', limits: []});
const at = id => ({shape: 'holder', id});
const costs = {accounts: {
    stamina: {quantity: 'stamina', fault: {id: 'overdrawn', cause: 'The rest of the casting comes out of the body.',
        effects: [{sentence: P('remove', 'vitality'), details: {target: at('$payer')}, per: {num: 2, den: 1}}]}},
    coin: {quantity: 'coin', fault: {id: 'in-arrears', cause: 'The rest is written up as debt at double.', owed: [{quantity: 'debt', num: 2, den: 1}]}},
    fuel: {quantity: 'fuel', fault: {id: 'cold-forge', cause: 'Blows on cooling metal wear the tool.', owed: [{quantity: 'wear', holder: 'hammer', num: 1, den: 2}]}},
    wear: {quantity: 'wear', as: 'burden'},
}};
const things = Object.fromEntries([steelPack.piece, ...Object.values(steelPack.media), ...Object.values(steelPack.tools)].map(t => [`${t.kind}:${t.id}`, t]));
const strike = spellEffectMethod([{sentence: sentenceFromIntent({intent: 'hurt', target: 'creature', execution: 'instant', carrier: 'wand', cost: 'stamina'}),
    target: {id: 'raider'}, minutes: 1, details: {target: at('raider'), amount: 6, cost: 4}}], {id: 'strike'});
const S = steelPack.steps;
const blade = processMethod({id: steelPack.id, revision: steelPack.revision, rows: steelPack.rows, projection: steelPack.projection, steps: [
    {...S.heat, options: {costs: [{kind: 'fuel', perMinute: 2}]}},
    {...S.forge, options: {costs: [{kind: 'fuel', perMinute: 2}, {kind: 'wear', amount: 1, from: 'tool'}]}}, S.quench, S.temper]});
const bladeBindings = Object.fromEntries(Object.entries(blade.roles).map(([role, kind]) =>
    [role, {kind, id: role === 'piece' ? 'sample' : steelPack[kind === 'tool' ? 'tools' : 'media'][role].id}]));
const careLaw = defineWorkingLaw({id: 'fixture.care', revision: 1, operations: {feed: {roles: {actor: 'creature', target: 'creature'}, minutes: 2,
    settle: ({bound}) => ({ok: true, costs: [{kind: 'coin', amount: 1}],
        effects: [{sentence: P('add', 'vitality'), details: {target: at(bound.target.id), amount: 3}}]})}}});
const feed = {id: 'feed', revision: 1, law: careLaw.ref, roles: {actor: 'creature', target: 'creature'}, steps: [{op: 'feed', bindings: {actor: 'actor', target: 'target'}}]};
const bond = {id: 'bond', sides: {a: 'smith', b: 'hound'}, standing: {start: 5, max: 9, strainAt: 4, lapseAt: 0},
    price: {costs: [{kind: 'coin', amount: 2, owes: 'a'}], effects: [], cause: 'bond-made'},
    upkeep: [{id: 'meal', owes: 'a', every: 10, gain: 2, loss: 3, match: {method: 'feed', roles: {actor: 'smith', target: 'hound'}}}],
    exits: [{id: 'release', kind: 'release', by: 'a', consent: [], costs: [{kind: 'coin', amount: 3}], effects: [], cause: 'released'}]};
const ward = {carrier: 'gate', pulse: 5, mode: 'repeating', trigger: {kind: 'time', every: 15},
    effects: [{sentence: P('add', 'heat'), details: {target: at('$place'), amount: 2}}],
    charge: {now: 9, max: 10, per: 2}, decay: {every: 4, amount: 1}};
const creature = id => ({kind: 'creature', id});

/** What an engine save cannot hold and the caller passes again on restore: pack settings, shared words, the records host. */
export const engineConfig = {
    settings, dials: {chainCap: 2000},
    shared: {quantities: [...Object.values(WQ), ...own], properties: [...Object.values(WP), ...['hardness', 'toughness']
        .filter(id => !Object.values(WP).some(p => p.id === id)).map(id => ({id, type: 'level'}))]},
    host: {laws: [SPELL_EFFECT_LAW, PROCESS_LAW, careLaw], things, costs, effects: {keys: {light: 'wand', essence: 'mana'}, read: sharedEffect}},
};

/** The valley with the yard's people and tools, created at a game root minute. */
export function createSeamEngine(clock = 0, config = engineConfig) {
    const sky = skyQuantities(clock);
    return createEngineWorld({...config, clock, holders: [
        {id: 'workshop', kind: 'place', tags: ['sky'], quantities: {...sky, humidity: 58}},
        {id: 'yard', kind: 'place', quantities: {humidity: 20, temperature: 18}},
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
        {id: 'smith', kind: 'body', place: 'yard', as: ['creature'], quantities: {stamina: 12, coin: 5, debt: 0, vitality: 30}},
        {id: 'hound', kind: 'body', place: 'yard', as: ['creature'], quantities: {vitality: 10}},
        {id: 'raider', kind: 'body', place: 'yard', as: ['creature'], quantities: {vitality: 40}},
        {id: 'forge', kind: 'thing', place: 'yard', as: ['medium'], quantities: {fuel: 20}},
        {id: 'hammer', kind: 'thing', place: 'yard', as: ['tool'], quantities: {wear: 0}},
        {id: 'sample', kind: 'thing', place: 'yard', as: ['piece']},
        {id: 'gate', kind: 'thing', place: 'yard'},
    ]});
}

/**
 * Things done to the engine at a minute counted from `base` (a game root minute): outside ops on the
 * valley and engine actions in the yard. A real tie-in would issue these from player input and the
 * game's own schedule; here they stand in for it.
 */
export function seamTimeline(base = 0, {days = 1} = {}) {
    const op = (at, cause, ops) => ({at: base + at, run: e => applyEngineOps(e, ops, cause)});
    const act = (at, run) => ({at: base + at, run});
    const rows = [
        act(0, e => makeEngineBinding(e, bond)),
        act(0, e => storeEngineWorking(e, ward, {id: 'gate.ward', by: 'smith'})),
        act(1, e => startEngineWorking(e, {law: PROCESS_LAW, method: blade, id: 'blade', bindings: bladeBindings})),
        op(3, 'keeper.rinses', [{op: 'publish', kind: 'water.poured', place: 'workshop', by: 'cauldron', detail: {contents: {active: 30, 'herb:matrix': 20}}}]),
        act(3, e => startEngineWorking(e, {...strike, id: 'cast.1', payer: 'smith'})),
        op(5, 'shepherd.grazes', [grazeOp({place: 'field', crop: 'clover', body: 'ewe', portions: 2})]),
        act(6, e => startEngineWorking(e, {law: careLaw, method: feed, id: 'feed.1', payer: 'smith', bindings: {actor: creature('smith'), target: creature('hound')}})),
    ];
    // Each evening three fireflies emerge on the hill and the smith casts once more, short of effort after the first day.
    for (let d = 0; d < days; d++) {
        for (const minute of [735, 750, 765]) rows.push(op(d * DAY + minute, `colony.window:${d}:${minute}`, [{op: 'add', holder: 'colony', quantity: fireflies, amount: 1}]));
        rows.push(act(d * DAY + 800, e => startEngineWorking(e, {...strike, id: `cast.evening.${d}`, payer: 'smith'})));
    }
    return rows.sort((a, b) => a.at - b.at);
}

/**
 * The clock bridge (proposal): the engine minute IS the game's root minute (`expansion.clock`), one to
 * one, with no rounding. `sync(rootMinute)` is all a game tick has to call, whatever span the tick covered:
 * timeline rows that fall inside the span are applied at their own minute on the way.
 */
export function createClockBridge({engine, timeline = [], next = 0}) {
    const stats = {syncs: 0, advances: 0, segments: 0, pendingReturns: 0, ms: 0, spans: {}};
    const advance = to => {
        for (let guard = 0; engine.world.clock < to; guard++) {
            if (guard > 10000) throw new Error('Seam bridge: the engine did not reach the minute.');
            const result = advanceEngineWorld(engine, to);
            engine = result.engine; stats.advances += 1; stats.segments += result.segments ?? 0;
            if (result.pending) stats.pendingReturns += 1;
        }
    };
    return {
        get engine() { return engine; },
        get next() { return next; },
        stats,
        sync(rootMinute) {
            if (!Number.isSafeInteger(rootMinute)) throw new Error('Seam bridge: the game clock is not a whole minute.');
            const span = rootMinute - engine.world.clock;
            if (span < 0) throw new Error(`Seam bridge: the game clock went back from ${engine.world.clock} to ${rootMinute}.`);
            stats.syncs += 1; stats.spans[span] = (stats.spans[span] ?? 0) + 1;
            const started = performance.now();
            while (next < timeline.length && timeline[next].at <= rootMinute) {
                advance(timeline[next].at);
                engine = timeline[next++].run(engine);
            }
            advance(rootMinute);
            stats.ms += performance.now() - started;
            return span;
        },
        save: () => serializeEngineWorld(engine),
    };
}

export const saveText = engine => JSON.stringify(serializeEngineWorld(engine));
export const restoreSeamEngine = (saved, config = engineConfig) => restoreEngineWorld(typeof saved === 'string' ? JSON.parse(saved) : saved, config);
/** Minute-of-day and daylight the sky pack reads at a root minute, for comparing with the game's calendar. */
export const engineSkyAt = (minute, dials) => skyAt(minute, dials);
