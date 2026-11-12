import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
    composeSubstrate, createWorld, advanceWorld, applyWorldOps, serializeWorld, restoreWorld, migrateWorldSave,
    readQuantity, readProvenance, explainEffect, substrateFacts, linearFlip, SUBSTRATE_SCHEMA, SUBSTRATE_REVISION,
} from '../src/world_substrate.js';
import {createShellRegulatorPack, shellBodyState, shellInletState} from '../src/world_substrate_packs/shell_regulator.js';
import {createBrewSteamPack, brewBatchState} from '../src/world_substrate_packs/brew_steam.js';
import {createSkyPack, skyAt} from '../src/world_sky.js';
import {isRainingAtMinute} from '../src/weather_calendar.js';
import {openLivingRegulator, advanceLivingRegulator} from '../src/living_regulator.js';
import {SHELL_LAW} from '../src/meadow_shell_state.js';
import {THERMAL_REVISION, quoteThermalBatch, createThermalState, advanceThermal} from '../src/craft_process_thermal.js';

// Thermal fixture from tests/craft_process_thermal.test.js, with a 30-minute hold.
const thermalLaw = {revision: THERMAL_REVISION, ambient: 20, extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
const vessel = {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2};
const maker = {tools: ['brazier', 'paddle'], competence: 4, workCapacity: 1000, fuelStock: 10000,
    heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}};
const program = {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 1800,
    heaterTool: 'brazier', agitationTool: 'paddle', agitationPerMass: 2, requiredCompetence: 2};
const quote = quoteThermalBatch({law: thermalLaw, vessel, maker, program, load: {mass: 4, volume: 4, specificHeat: 2, containment: 1}});

const shellLaw = {...SHELL_LAW, startleMinutes: 15};
const shellPack = createShellRegulatorPack(shellLaw);
const brewPack = createBrewSteamPack({thermalLaw, steamPerMinute: 4});
const packs = [shellPack, brewPack];
const rules = composeSubstrate({packs});

function workshop({humidity = 58, mode = 'linked', withShell = true, withBatch = true, detail} = {}) {
    return [
        {id: 'workshop', kind: 'place', quantities: {humidity}, ...(detail ? {detail} : {})},
        {id: 'yard', kind: 'place'},
        ...(withShell ? [{id: 'shell', kind: 'body', place: 'workshop', tags: ['shell.body'], state: {'l.shell_regulator': shellBodyState('open')}}] : []),
        {id: 'inlet', kind: 'thing', place: 'workshop', tags: ['shell.inlet'], state: {'l.shell_regulator': shellInletState({mode})}},
        ...(withBatch ? [{id: 'batch', kind: 'thing', place: 'workshop', tags: ['brew.batch'], state: {'b.brew_steam': brewBatchState(thermalLaw, quote)}}] : []),
    ];
}
const fresh = (opts, r = rules) => createWorld(r, {clock: 100, holders: workshop(opts)});
const roundTrip = (r, w) => restoreWorld(r, JSON.parse(JSON.stringify(serializeWorld(w))));
const jump = (r, w, to) => advanceWorld(r, w, to).world;
function stepped(r, w, to, cuts) {
    for (const c of [...cuts, to]) if (c > w.clock && c <= to) w = advanceWorld(r, w, c).world;
    return w;
}

test('W1 parity: the substrate shell and inlet reproduce advanceLivingRegulator minute by minute', () => {
    const {delay, draft, recharge, closeBelow, openAbove} = SHELL_LAW;
    const single = composeSubstrate({packs: [createShellRegulatorPack(SHELL_LAW)]});
    for (const mode of ['open', 'closed', 'linked']) for (const start of [58, 44, 63, 99, 2]) {
        let ref = openLivingRegulator(100, start), shell = 'open';
        let world = createWorld(single, {clock: 100, holders: workshop({humidity: start, mode, withBatch: false})});
        if (mode !== 'linked') ref = {...ref, inlet: mode};
        for (let minute = 101; minute <= 260; minute++) {
            ref = advanceLivingRegulator(ref, minute, {delay, draft, recharge, mode}, ({humidity}) => {
                if (humidity < closeBelow) shell = 'closed';
                if (humidity >= openAbove) shell = 'open';
                return shell;
            }).state;
            world = advanceWorld(single, world, minute).world;
            const inlet = world.holders.inlet.state['l.shell_regulator'];
            assert.deepEqual([readQuantity(world, 'workshop', 'humidity'), inlet.position, inlet.pending, world.holders.shell.state['l.shell_regulator'].shell],
                [ref.humidity, ref.inlet, ref.pending, shell], `${mode} from ${start} at minute ${minute}`);
        }
        // The far path lands on the same minute-160 state in one call.
        const far = advanceWorld(single, createWorld(single, {clock: 100, holders: workshop({humidity: start, mode, withBatch: false})}), 260);
        assert.deepEqual(far.world.holders, world.holders, `${mode} from ${start}: one jump`);
    }
});

test('W2 contact: brew steam and the living regulator exchange humidity and smoke with no join code', () => {
    const w = jump(rules, fresh(), 160);
    const steam = readProvenance(w, 'workshop', 'humidity');
    assert.ok(steam['b.brew_steam:batch:batch'] > 0, 'the brew wrote humidity');
    assert.ok(steam['l.shell_regulator:inlet:inlet'] !== 0, 'the regulator wrote humidity');
    assert.equal(Object.values(steam).reduce((a, b) => a + b, 0), readQuantity(w, 'workshop', 'humidity') - 58, 'ledger sums to the change');
    const smoke = w.chain.find(r => r.kind === 'smoke');
    assert.ok(smoke, 'the burner went out and smoked');
    assert.ok(smoke.reactions.includes('l.shell_regulator:startle@shell'), 'the shell reacted to the brew\'s smoke');
    // Same run with no brew: the regulator alone settles differently.
    const alone = jump(rules, fresh({withBatch: false}), 160);
    assert.notDeepEqual(alone.holders.workshop.quantities, w.holders.workshop.quantities);
    // The source of each pack imports neither the other pack nor anything but its own leaf and W.
    const imports = f => [...readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8').matchAll(/from '([^']+)'/g)].map(m => m[1]);
    assert.deepEqual(imports('world_substrate_packs/shell_regulator.js'), ['../world_quantities.js']);
    assert.deepEqual(imports('world_substrate_packs/brew_steam.js'), ['../craft_process_thermal.js', '../world_quantities.js']);
    assert.deepEqual(imports('world_substrate.js'), []);
});

test('W3 one jump, many steps, near detail and reloads give the same world', () => {
    const end = 190, base = jump(rules, fresh(), end);
    const decisionMinute = base.chain.find(r => r.kind === 'smoke').at;
    const cuts = [101, 102, 107, 113, decisionMinute - 1, decisionMinute, decisionMinute + 1, 150, 151, 177];
    assert.deepEqual(stepped(rules, fresh(), end, cuts), base, 'stepped');
    let minute = fresh();
    for (let t = 101; t <= end; t++) minute = jump(rules, minute, t);
    assert.deepEqual(minute, base, 'minute by minute');
    // Reload mid-segment and exactly at the minute the smoke is published.
    for (const at of [123, decisionMinute]) {
        const reloaded = jump(rules, roundTrip(rules, jump(rules, fresh(), at)), end);
        assert.deepEqual(reloaded, base, `reload at ${at}`);
        assert.equal(reloaded.chain.filter(r => r.kind === 'smoke').length, 1, 'smoke published once');
    }
    // Near the player each minute is its own segment; the totals do not move.
    const nearRun = advanceWorld(rules, fresh({detail: 'near'}), end), farRun = advanceWorld(rules, fresh({detail: 'far'}), end);
    assert.equal(nearRun.segments, end - 100);
    assert.ok(farRun.segments * 2 < nearRun.segments, `far settles in fewer segments (${farRun.segments} of ${nearRun.segments})`);
    for (const k of ['quantities', 'ledger']) assert.deepEqual(nearRun.world.holders.workshop[k], farRun.world.holders.workshop[k]);
    assert.deepEqual(nearRun.world.chain, farRun.world.chain);
    assert.deepEqual(nearRun.world.holders.batch.state, base.holders.batch.state);
    // The thermal leaf itself agrees with the pack's settlement.
    const direct = advanceThermal(thermalLaw, createThermalState(thermalLaw, quote), (end - 100) * 60);
    assert.deepEqual(base.holders.batch.state['b.brew_steam'].thermal, direct);
});

test('W4 the keeper takes the shell away mid-brew: the latch holds, the heat keeps working (PFP7, LT31)', () => {
    const leaveAt = 112;
    const before = jump(rules, fresh(), leaveAt);
    const latched = before.holders.inlet.state['l.shell_regulator'];
    const gone = applyWorldOps(rules, before, [{op: 'move', holder: 'shell', to: 'yard'}], 'keeper.leaves');
    assert.deepEqual(gone.chain.slice(-2).map(r => [r.kind, r.place]), [['departed', 'workshop'], ['arrived', 'yard']]);
    const after = jump(rules, gone, 190), stayed = jump(rules, before, 190);
    const inlet = after.holders.inlet.state['l.shell_regulator'];
    const pendingLanded = latched.pending ? latched.pending.position : latched.position;
    assert.equal(inlet.position, pendingLanded, 'a correction already under way finishes; then the inlet stays where it is');
    assert.equal(inlet.pending, null);
    const smoke = after.chain.find(r => r.kind === 'smoke');
    assert.deepEqual(smoke.reactions, [], 'nobody in the workshop answers the smoke');
    assert.ok(stayed.chain.find(r => r.kind === 'smoke').reactions.length > 0);
    assert.notDeepEqual(after.holders.workshop.quantities, stayed.holders.workshop.quantities);
    assert.deepEqual(after.holders.batch.state, stayed.holders.batch.state, 'the batch\'s heat history does not depend on the shell');
    assert.deepEqual(jump(rules, roundTrip(rules, gone), 190), after, 'reload after the departure');
});

test('W5 cascade depth is a dial; damped effects still land and are recorded', () => {
    const shallow = composeSubstrate({packs, dials: {cascadeDepth: 1}});
    const deep = jump(rules, fresh(), 190), cut = jump(shallow, fresh({}, shallow), 190);
    const pull = cut.chain.find(r => r.kind === 'shell.pull' && r.depth === 1);
    assert.ok(pull?.damped, 'the shell\'s answer to smoke is past the depth dial');
    assert.deepEqual(pull.reactions, []);
    const deepPull = deep.chain.find(r => r.kind === 'shell.pull' && r.depth === 1);
    assert.ok(deepPull.reactions.includes('l.shell_regulator:inlet-link@inlet'), 'at the default depth the inlet hears the startled shell');
    assert.deepEqual(explainEffect(deep, deepPull.seq).map(r => [r.kind, r.by]), [['smoke', 'batch'], ['shell.pull', 'shell']]);
    const closed = deep.chain.find(r => r.kind === 'draft.closed' && r.at > deepPull.at);
    // Fixed order: the brew pack decides after the regulator pack, so the smoke reaches
    // the inlet after its turn this minute; it starts its delay from the next minute.
    assert.equal(closed.at, deepPull.at + 1 + SHELL_LAW.delay, 'the linked inlet closes one turn plus its delay later');
    assert.ok(!cut.chain.some(r => r.kind === 'draft.closed' && r.at === closed.at), 'with the dial at 1 that closure never happens');
});

test('W6 a scoped law field changes how a quantity moves, and can be removed', () => {
    const ward = {id: 'still-air', scope: 'workshop', kind: 'airflow.scale', params: {numerator: 0, denominator: 1}, source: 'ward.still_air'};
    const open = () => createWorld(rules, {clock: 0, holders: workshop({mode: 'open', withShell: false, withBatch: false})});
    const plain = jump(rules, open(), 3);
    assert.equal(readQuantity(plain, 'workshop', 'humidity'), 58 - 3 * SHELL_LAW.draft);
    const warded = applyWorldOps(rules, open(), [{op: 'law_add', field: ward}], 'ward.cast');
    assert.equal(readQuantity(jump(rules, warded, 3), 'workshop', 'humidity'), 58);
    const elsewhere = applyWorldOps(rules, open(), [{op: 'law_add', field: {...ward, scope: 'yard'}}], 'ward.cast');
    assert.equal(readQuantity(jump(rules, elsewhere, 3), 'workshop', 'humidity'), 58 - 3 * SHELL_LAW.draft, 'scope is the place, not the world');
    const lifted = applyWorldOps(rules, jump(rules, warded, 3), [{op: 'law_remove', id: 'still-air'}], 'ward.lifted');
    assert.equal(readQuantity(jump(rules, lifted, 5), 'workshop', 'humidity'), 58 - 2 * SHELL_LAW.draft);
});

test('W7 bounds clamp the same way in one jump or many, and the ledger records the refusal', () => {
    const r = composeSubstrate({packs: [shellPack]});
    const start = () => createWorld(r, {clock: 0, holders: workshop({humidity: 30, mode: 'open', withShell: false, withBatch: false})});
    const one = jump(r, start(), 600);
    let many = start();
    for (let t = 1; t <= 600; t++) many = jump(r, many, t);
    assert.deepEqual(one, many);
    assert.equal(readQuantity(one, 'workshop', 'humidity'), 0);
    const led = readProvenance(one, 'workshop', 'humidity');
    assert.equal(led['l.shell_regulator:inlet:inlet'], -600 * SHELL_LAW.draft);
    assert.equal(led.bound, 600 * SHELL_LAW.draft - 30);
    assert.ok(advanceWorld(r, start(), 600).segments <= 3);
});

test('W8 sky: weather, day length and moon are W quantities settled by the root clock (OS6)', () => {
    const sky = createSkyPack({moonCycleDays: 16});
    const r = composeSubstrate({packs: [sky]});
    const start = 0, init = skyAt(start, {moonCycleDays: 16});
    const make = () => createWorld(r, {clock: start, holders: [{id: 'valley', kind: 'place', tags: ['sky'], quantities: init}]});
    const end = 20 * 1440 + 77;
    const far = advanceWorld(r, make(), end);
    let steps = make();
    for (let t = 0; t <= end; t += 97) steps = jump(r, steps, t);
    steps = jump(r, steps, end);
    assert.deepEqual(far.world, steps);
    assert.deepEqual(readQuantity(far.world, 'valley', 'day'), 20);
    assert.equal(readQuantity(far.world, 'valley', 'rain'), isRainingAtMinute(end) ? 1 : 0);
    assert.equal(readQuantity(far.world, 'valley', 'daylight'), 0);
    assert.equal(readQuantity(far.world, 'valley', 'moon_phase'), Math.floor((20 % 16) * 8 / 16));
    assert.ok(far.segments <= 3 * 21, `about three boundaries a day (${far.segments})`);
    assert.ok(far.world.chain.some(e => e.kind === 'sky.daylight'), 'dawn and dusk are effects any pack can answer');
    // A pack that never imports the sky can watch the moon through the same quantity.
    let howls = 0;
    const listener = {id: 'test.listener', quantities: [], reads: ['moon_phase'], writes: [],
        reactors: [{id: 'night', on: ['sky.daylight'], appliesTo: h => h.kind === 'place', react: (view, id) => {
            if (view.amount(id, 'daylight') === 0 && view.amount(id, 'moon_phase') === 0) howls++;
            return [];
        }}]};
    const r2 = composeSubstrate({packs: [sky, listener]});
    advanceWorld(r2, createWorld(r2, {clock: start, holders: [{id: 'valley', kind: 'place', tags: ['sky'], quantities: init}]}), end);
    assert.ok(howls >= 2, 'new-moon nights reach a pack that only reads quantities');
});

test('W9 save shape: versioned, validated, foreign pack slices kept, newer saves refused (OS8)', () => {
    const w = jump(rules, fresh(), 130);
    const saved = serializeWorld(w);
    assert.equal(saved.schema, SUBSTRATE_SCHEMA);
    assert.equal(saved.revision, SUBSTRATE_REVISION);
    assert.deepEqual(roundTrip(rules, w), w);
    assert.throws(() => migrateWorldSave({...saved, revision: SUBSTRATE_REVISION + 1}), /newer than this build/);
    assert.throws(() => restoreWorld(rules, {...saved, holders: {...saved.holders, workshop: {...saved.holders.workshop, quantities: {humidity: 140}}}}), /out of bounds/);
    const foreign = structuredClone(saved);
    foreign.holders.batch.state['g.gu_future'] = {essence: 3};
    assert.deepEqual(restoreWorld(rules, foreign).holders.batch.state['g.gu_future'], {essence: 3});
    assert.deepEqual(substrateFacts(w, 'shell'), {'world.clock': 130, 'here.humidity': readQuantity(w, 'workshop', 'humidity')});
});

test('W10 contract guards: undeclared writes, unit clashes, bounded chain and ledger', () => {
    assert.throws(() => composeSubstrate({packs: [shellPack, {id: 'x', quantities: [{id: 'humidity', unit: 'grams', min: 0, max: 100}]}]}), /different unit/);
    const sneaky = {id: 'x', quantities: [], reads: ['humidity'], writes: [], laws: [{id: 'leak', appliesTo: h => h.kind === 'place',
        rates: (view, id) => view.has(id, 'humidity') ? [{holder: id, quantity: 'humidity', perMinute: 1}] : []}]};
    const r = composeSubstrate({packs: [shellPack, sneaky]});
    assert.throws(() => advanceWorld(r, createWorld(r, {holders: [{id: 'p', kind: 'place', quantities: {humidity: 1}}]}), 5), /does not declare writing/);
    const tight = composeSubstrate({packs, dials: {chainCap: 3, ledgerCap: 2}});
    let w = createWorld(tight, {clock: 0, holders: workshop({withShell: false, withBatch: false})});
    for (let i = 0; i < 6; i++) w = applyWorldOps(tight, w, [{op: 'add', holder: 'workshop', quantity: 'humidity', amount: 1, source: `pour.${i}`},
        {op: 'publish', kind: 'splash', place: 'workshop'}], `pour.${i}`);
    assert.equal(w.chain.length, 3);
    assert.deepEqual(Object.keys(readProvenance(w, 'workshop', 'humidity')).sort(), ['earlier', 'pour.4', 'pour.5'], 'cap sources plus one merged row');
    assert.equal(Object.values(readProvenance(w, 'workshop', 'humidity')).reduce((a, b) => a + b, 0), 6);
    assert.equal(linearFlip(10, 3, 'gte', 20, 100), 4);
    assert.equal(linearFlip(10, -3, 'lt', 5, 100), 2);
    assert.equal(linearFlip(10, 0, 'lt', 5, 100), Infinity);
});
