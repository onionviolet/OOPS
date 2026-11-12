import test from 'node:test';
import assert from 'node:assert/strict';
import {beginWorking, settleWorking, serializeWorking, restoreWorking, interruptWorking} from '../src/kernel_working.js';
import {PROCESS_LAW, processMethod, processBalance, projectProcess, unfinishedPiece} from '../src/process_law.js';
import {applyLoad} from '../src/load_law.js';
import {createEngineWorld, advanceEngineWorld, applyEngineOps, serializeEngineWorld, restoreEngineWorld} from '../src/engine_world.js';
import {substratePort} from '../src/world_substrate.js';
import {steelPack, kitchenPack, loadPack, exposureProbe} from './fixtures/process_craft_packs.js';

function setup(pack, steps, {piece = pack.piece, at = 0, id = 'process.fixture'} = {}) {
    const method = processMethod({id: pack.id, revision: pack.revision, rows: pack.rows, projection: pack.projection, steps});
    const things = {piece, ...pack.media, ...pack.tools};
    const bindings = Object.fromEntries(Object.keys(method.roles).map(role => [role, {kind: things[role].kind, id: things[role].id}]));
    const ports = {read: ref => Object.values(things).find(thing => thing.kind === ref.kind && thing.id === ref.id)};
    return {record: beginWorking(PROCESS_LAW, method, {id, bindings, at}), ports};
}

function run(pack, steps, options) {
    const {record, ports} = setup(pack, steps, options);
    const result = settleWorking(PROCESS_LAW, record, {now: record.deadlines.at(-1), ports});
    assert.equal(result.record.status, 'complete');
    assert.ok(processBalance(result.record.facts).balanced);
    return {...result, properties: projectProcess(result.record.facts, pack.projection)};
}

const S = steelPack.steps;
const blade = (last = [S.temper]) => run(steelPack, [S.heat, S.forge, S.quench, ...last]);
const rowOf = (result, index, id) => result.record.facts.piece.path[index].rows.find(row => row.id === id);
const underLoad = properties => applyLoad({properties}, loadPack.load, loadPack.thresholds);
const close = (a, b, epsilon = 1e-9) => assert.ok(Math.abs(a - b) < epsilon, `${a} differs from ${b}`);

test('1. Forge, quench, temper trades hardness for toughness under the same load', t => {
    const tempered = blade(), untempered = blade([]);
    assert.ok(untempered.properties.hardness > tempered.properties.hardness);
    assert.ok(untempered.properties.toughness < tempered.properties.toughness);
    assert.equal(underLoad(untempered.properties).broke, true);
    assert.equal(underLoad(tempered.properties).held, true);
    assert.ok(rowOf(tempered, 1, 'refine').moved < 0);
    assert.ok(rowOf(tempered, 2, 'harden').moved > 900);
    assert.ok(rowOf(tempered, 3, 'temper').moved > 800);
    assert.equal(tempered.effects.length, 2);
    assert.ok(tempered.effects.every(({effect, step}) => effect.op === 'property' && effect.holder === 'sample' && step === 3));
    const located = setup(steelPack, [S.heat, S.forge, S.quench, S.temper],
        {piece: {...structuredClone(steelPack.piece), holder: 'actual-holder'}});
    const readLocated = ref => ({...located.ports.read(ref), ...(ref.kind === 'piece' ? {holder: 'actual-holder'} : {})});
    const landed = settleWorking(PROCESS_LAW, located.record, {now: located.record.deadlines.at(-1), ports: {read: readLocated}});
    assert.ok(landed.effects.every(({effect}) => effect.holder === 'actual-holder'));
    t.diagnostic(JSON.stringify({tempered: tempered.properties, untempered: untempered.properties, load: loadPack.load}));
});

test('2. Order matters with a cause when tempering comes first', t => {
    const ordinary = blade();
    const reversed = run(steelPack, [S.temper, S.heat, S.forge, S.quench]);
    assert.ok(reversed.properties.hardness > ordinary.properties.hardness);
    assert.ok(reversed.properties.toughness < ordinary.properties.toughness);
    const early = rowOf(reversed, 0, 'temper');
    assert.equal(early.moved, 0);
    assert.ok(early.minutesInBand > 0);
    assert.ok(early.segments.some(segment => segment.reasons.includes('nothing of hard present')));
    assert.ok(reversed.record.facts.piece.shares.hard > 900);
    assert.equal(underLoad(reversed.properties).broke, true);
    // Another order that works: straight from the forge into the low oven. The
    // piece hardens as it drops through the low band and tempers in the same hold.
    const direct = run(steelPack, [S.heat, S.forge, S.temper]);
    assert.ok(rowOf(direct, 2, 'harden').moved > 800);
    assert.ok(rowOf(direct, 2, 'temper').moved > 700);
    assert.deepEqual(rowOf(direct, 2, 'temper').segments.at(-1).reasons, []);
    assert.equal(underLoad(direct.properties).held, true);
    t.diagnostic(JSON.stringify({ordinary: ordinary.properties, reversed: reversed.properties, direct: direct.properties, earlyTemper: early}));
});

test('3. A way around uses slower media and longer weak-tool work', t => {
    const fast = blade([]);
    const oil = run(steelPack, [S.heat, S.forge, S.oil]);
    const air = run(steelPack, [S.heat, S.forge, S.air]);
    const residence = result => rowOf(result, 2, 'soften').minutesInBand;
    assert.ok(residence(fast) < residence(oil) && residence(oil) < residence(air));
    assert.ok(fast.properties.hardness > oil.properties.hardness && oil.properties.hardness > air.properties.hardness);
    assert.ok(rowOf(oil, 2, 'soften').moved > rowOf(fast, 2, 'soften').moved);
    // Keep the same hot starting state to isolate delivered work from warming time.
    const piece = {...structuredClone(steelPack.piece), temperature: 900};
    const hammer = run(steelPack, [S.forge], {piece});
    const weak = run(steelPack, [{...S.forge, tool: 'stone'}], {piece});
    const longer = run(steelPack, [{...S.forge, tool: 'stone', minutes: S.forge.minutes * 4}], {piece});
    assert.ok(weak.record.facts.piece.scalars.grain > hammer.record.facts.piece.scalars.grain);
    close(longer.record.facts.piece.scalars.grain, hammer.record.facts.piece.scalars.grain);
    t.diagnostic(JSON.stringify({hardness: [fast, oil, air].map(result => result.properties.hardness),
        middleBandMinutes: [fast, oil, air].map(residence),
        grain: [hammer, weak, longer].map(result => result.record.facts.piece.scalars.grain)}));
});

test('4. A cooking pack uses the same law and excessive heat worsens its result', t => {
    const cooked = run(kitchenPack, [kitchenPack.steps.bake]);
    const scorched = run(kitchenPack, [kitchenPack.steps.bake, kitchenPack.steps.scorch]);
    assert.equal(cooked.record.law, PROCESS_LAW.ref);
    assert.ok(cooked.record.facts.piece.shares.cooked > 950);
    assert.ok(scorched.record.facts.piece.shares.charred > 950);
    assert.ok(cooked.properties.nourishment > scorched.properties.nourishment);
    assert.ok(cooked.properties.juiciness > scorched.properties.juiciness);
    assert.match(rowOf(scorched, 1, 'char').cause, /Excess heat/);
    t.diagnostic(JSON.stringify({cooked: cooked.properties, scorched: scorched.properties,
        charred: scorched.record.facts.piece.shares.charred}));
});

test('5. An independent property load law reads processed and unprocessed things', t => {
    const variants = [blade(), blade([]), run(steelPack, [S.heat, S.forge, S.oil]), run(steelPack, [S.heat, S.forge, S.air])];
    const responses = variants.map(result => underLoad(result.properties));
    assert.equal(responses[0].held, true);
    assert.equal(responses[1].broke, true);
    assert.equal(responses[2].broke, true);
    assert.equal(responses[3].bent, true);
    assert.equal(applyLoad(loadPack.plainThing, loadPack.load, loadPack.thresholds).held, true);
    assert.match(responses[1].cause, /Shock 50 against toughness capacity/);
    t.diagnostic(JSON.stringify(responses));
});

test('6. One settlement or several and save/restore keep identical workings and engine properties', t => {
    const {record, ports} = setup(steelPack, [S.heat, S.forge, S.quench, S.temper]);
    const once = settleWorking(PROCESS_LAW, record, {now: record.deadlines.at(-1), ports});
    let partitioned = record;
    const effects = [];
    for (let now = 0; now <= record.deadlines.at(-1); now += 1) {
        const settled = settleWorking(PROCESS_LAW, partitioned, {now, ports});
        partitioned = settled.record;
        effects.push(...settled.effects);
    }
    assert.deepEqual(partitioned, once.record);
    assert.deepEqual(effects, once.effects);
    const mid = settleWorking(PROCESS_LAW, record, {now: record.deadlines[2], ports}).record;
    const restored = restoreWorking(PROCESS_LAW, JSON.parse(JSON.stringify(serializeWorking(mid))));
    assert.deepEqual(settleWorking(PROCESS_LAW, restored, {now: record.deadlines.at(-1), ports}),
        settleWorking(PROCESS_LAW, mid, {now: record.deadlines.at(-1), ports}));
    assert.deepEqual(settleWorking(PROCESS_LAW, restored, {now: record.deadlines.at(-1), ports}).record, once.record);

    // The finished blade lands on its holder in the engine world as whole levels.
    const engineFixture = setup(steelPack, [S.heat, S.forge, S.quench, S.temper]);
    const names = Object.keys(steelPack.projection);
    const shared = {properties: [...names, 'thermalMass'].map(id => ({id, type: 'level', min: 0, max: 1000}))};
    let engine = createEngineWorld({packs: ['c.contest'], shared, holders: [
        {id: 'workshop', kind: 'place'},
        {id: 'sample', kind: 'thing', as: ['piece'], place: 'workshop', properties: {thermalMass: 1}},
    ]});
    // The world and the working share one clock: each step settles when the world reaches its deadline.
    let finished = {record: engineFixture.record, effects: []};
    for (const deadline of engineFixture.record.deadlines) {
        engine = advanceEngineWorld(engine, deadline).engine;
        const read = substratePort(engine.world);
        const worldPorts = {read: (ref, at) => ref.kind === 'piece'
            ? {...engineFixture.ports.read(ref, at), ...read(ref, at)} : engineFixture.ports.read(ref, at)};
        finished = settleWorking(PROCESS_LAW, finished.record, {now: engine.world.clock, ports: worldPorts});
    }
    assert.deepEqual(finished.record.facts.piece.shares, once.record.facts.piece.shares);
    assert.equal(finished.record.status, 'complete');
    engine = applyEngineOps(engine, finished.effects.map(row => row.effect), 'process-finished');
    const saved = JSON.parse(JSON.stringify(serializeEngineWorld(engine)));
    const reloaded = restoreEngineWorld(saved, {shared});
    const expected = projectProcess(finished.record.facts, steelPack.projection);
    for (const name of names) assert.equal(substratePort(reloaded.world)({id: 'sample', kind: 'piece'}, reloaded.world.clock).properties[name], Math.round(expected[name]));
    assert.deepEqual(serializeEngineWorld(reloaded), saved);
    t.diagnostic(JSON.stringify({workingMinutes: record.deadlines.at(-1), engineProperties: expected}));
});

test('An interrupted quench keeps its piece and a fresh method rescues it by tempering', () => {
    const {record, ports} = setup(steelPack, [S.heat, S.forge, S.quench, S.temper]);
    const afterQuench = settleWorking(PROCESS_LAW, record, {now: record.deadlines[2], ports}).record;
    const stopped = interruptWorking(afterQuench, {at: afterQuench.deadlines[2], reason: 'The maker leaves the bench.'});
    const piece = unfinishedPiece(stopped);
    assert.deepEqual(piece.shares, afterQuench.facts.piece.shares);
    assert.deepEqual(piece.path, afterQuench.facts.piece.path);
    const rescued = run(steelPack, [S.temper], {piece, at: piece.clock, id: 'process.rescue'});
    assert.deepEqual(rescued.record.facts.piece, blade().record.facts.piece);
    assert.equal(underLoad(rescued.properties).held, true);
});


test('Competing rows conserve shares, and unmet needs and zero drive explain unchanged rows', () => {
    const pack = exposureProbe;
    const result = run(pack, [pack.step]);
    const piece = result.record.facts.piece;
    const moved = pack.piece.shares.a * -Math.expm1(-(1 + 1 / 2) * pack.step.minutes);
    close(piece.shares.a, pack.piece.shares.a - moved);
    close(piece.shares.b, moved * 2 / 3);
    close(piece.shares.c, moved / 3);
    assert.equal(piece.scalars.x, pack.piece.scalars.x);
    assert.deepEqual(projectProcess(result.record.facts, pack.projection), {total: 100});
    for (const [id, reason] of [['needs-contact', 'medium.helper below 1'],
        ['needs-structure', 'shares.b below 1000'], ['needs-scalar', 'scalars.gate below 1'], ['driven', 'no drive']]) {
        const trace = rowOf(result, 0, id);
        assert.equal(trace.moved, 0);
        assert.equal(trace.minutesInBand, pack.step.minutes);
        assert.ok(trace.segments[0].reasons.includes(reason));
    }
    const reversed = run({...pack, rows: [...pack.rows].reverse()}, [pack.step]);
    for (const key of Object.keys(piece.shares)) close(reversed.record.facts.piece.shares[key], piece.shares[key]);
    const assisted = structuredClone(pack);
    assisted.media.contact.properties.helper = 1;
    assisted.piece.scalars.gate = 1;
    const withMeans = run(assisted, [assisted.step]);
    assert.ok(rowOf(withMeans, 0, 'needs-contact').moved > 0);
    assert.ok(rowOf(withMeans, 0, 'needs-scalar').moved < 0);
});

test('Band crossings are analytic, a cold or isolated exposure completes, and method rows are copied', () => {
    const pack = {...exposureProbe, rows: [exposureProbe.bandRow]};
    const result = run(pack, [pack.step]);
    close(result.record.facts.piece.temperature, 100 * (1 - Math.exp(-2)));
    close(rowOf(result, 0, 'band').minutesInBand, Math.log(2));
    close(rowOf(result, 0, 'band').moved, 50);
    const isolated = structuredClone(pack);
    isolated.media.contact.properties.exchange = 0;
    assert.equal(run(isolated, [isolated.step]).record.facts.piece.temperature, 0);
    const cold = structuredClone(pack);
    cold.media.contact.properties.temperature = -10;
    assert.equal(rowOf(run(cold, [cold.step]), 0, 'band').minutesInBand, 0);
    const input = structuredClone(pack.rows);
    const method = processMethod({id: pack.id, steps: [pack.step], rows: input, projection: pack.projection});
    input[0].tauMinutes = 99;
    assert.equal(method.steps[0].options.rows[0].tauMinutes, 1);
    const held = run(exposureProbe, [{op: 'hold', medium: 'contact', minutes: 2}]);
    assert.ok(rowOf(held, 0, 'driven').segments[0].reasons.includes('no drive'));
    const hot = run(steelPack, [{op: 'hold', medium: 'veryHot', minutes: 20}]);
    assert.ok(rowOf(hot, 0, 'coarsen').moved > 0);
    assert.ok(hot.record.facts.piece.scalars.grain > steelPack.piece.scalars.grain);
});

test('Malformed process rows and corrupted share totals fail checks', () => {
    for (const change of [{band: undefined}, {tauMinutes: -1}, {tauMinutes: 0}, {scalar: 'x'}]) {
        assert.throws(() => processMethod({id: 'invalid', steps: [exposureProbe.step],
            rows: [{...exposureProbe.bandRow, ...change}]}));
    }
    const {record, ports} = setup(exposureProbe, [exposureProbe.step]);
    record.method.steps[0].options.rows[0].tauMinutes = -1;
    assert.throws(() => settleWorking(PROCESS_LAW, record, {now: record.deadlines[0], ports}), /positive tauMinutes/);
    const facts = blade().record.facts;
    facts.piece.shares.extra = 10;
    assert.equal(processBalance(facts).balanced, false);
    const piece = {...structuredClone(exposureProbe.piece), startingTotal: 200};
    assert.throws(() => run(exposureProbe, [exposureProbe.step], {piece}), /does not balance/);
});
