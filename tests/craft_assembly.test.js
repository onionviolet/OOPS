// Fabrication law (foundation F): rows run through one shared law and the
// kernel working. Numbers are fixture data from the packs and from the paper
// cases FG4-A, FG4-B and FG4-D in the crafting considerations.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FABRICATION_LAW, carryLoad, fabricationPack, findProcess, fitJoin, loadLimit, planSalvage,
    practicedWorkingFits, wearFromUse} from '../src/craft_assembly.js';
import '../src/craft_assembly_packs.js';
import {beginWorking, defineWorkingLaw, quoteWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';

const W = 'base.frontier';
const key = id => JSON.stringify({id});
const village = fabricationPack(W);

function axe(headId, handleId) {
    const parts = {head: {id: headId, ...village.parts[headId]}, handle: {id: handleId, ...village.parts[handleId]}};
    const arrangement = village.arrangements[headId.startsWith('Steel') ? 'Steel chopping axe' : 'Iron chopping axe'];
    const elements = {head: parts.head, handle: parts.handle, 'axe.hafting': village.joins['axe.hafting']};
    return {parts, arrangement, elements};
}

test('every pack process is a row the shared law finds by route and result', () => {
    assert.equal(findProcess(W, 'component', 'Steel axe head').id, 'forge.axe_head');
    assert.equal(findProcess(W, 'component', 'Ash wood medium handle').id, 'woodworking.medium-handle');
    assert.equal(findProcess(W, 'recipe', 'Processed hickory wood').id, 'woodworking.prepare-log');
    assert.equal(findProcess(W, 'attempts', 'Low quality iron ingot').id, 'smelting.iron');
    assert.equal(findProcess('book.lotm.tingen', 'component', 'Steel axe head'), null);
    const made = village.processes.flatMap(row => Object.values(row.yields));
    assert.equal(made.length, 13, 'three heads, four handles, four prepared woods, two ingots');
});

test('a changed part fails at a different point by the rules alone (FBC4, FBC5)', () => {
    const iron = axe('Iron axe head', 'Hickory wood medium handle');
    assert.deepEqual(fitJoin(village.joins['axe.hafting'], iron.parts), {ok: true});
    assert.equal(carryLoad(iron.arrangement, iron.elements, {load: 14}).ok, true);
    // A weaker but fitting handle passes the join and gives way under load.
    const weak = axe('Iron axe head', 'Simple wooden medium handle');
    assert.equal(fitJoin(village.joins['axe.hafting'], weak.parts).ok, true);
    const strained = carryLoad(weak.arrangement, weak.elements, {load: 14});
    assert.equal(strained.ok, false);
    assert.equal(strained.failedAt, 'handle');
    // A part with the wrong interface fails at fit, before any load is read.
    const misfit = {...iron.parts, handle: {id: 'Short handle', interfaces: ['tang.short'], capacity: 99}};
    const fit = fitJoin(village.joins['axe.hafting'], misfit);
    assert.equal(fit.ok, false);
    assert.match(fit.reason, /does not fit axe\.hafting \(tang\.medium\)/);
    // Capacities come from the material table: a hickory handle outlasts an
    // iron head, so the head limits; a simple handle limits instead. The
    // arrangement's limit is its weakest element, not a sum of parts.
    assert.equal(village.parts['Hickory wood medium handle'].capacity, 30.8);
    assert.equal(village.parts['Iron axe head'].capacity, 17);
    assert.deepEqual([loadLimit(iron.arrangement, iron.elements, {}).element, loadLimit(iron.arrangement, iron.elements, {}).total], ['head', 17]);
    assert.equal(loadLimit(weak.arrangement, weak.elements, {}).element, 'handle');
    const steel = axe('Steel axe head', 'Hickory wood medium handle');
    assert.deepEqual([loadLimit(steel.arrangement, steel.elements, {}).element, loadLimit(steel.arrangement, steel.elements, {}).total], ['head', 25.5]);
});

test('FG4-A and FG4-B: load follows the beam and the first limit moves to the anchor', () => {
    const beam = {geometry: 'beam', span: 12, paths: {left: ['left.seat'], right: ['right.seat', 'right.anchor']}};
    const original = {'left.seat': {capacity: 20}, 'right.seat': {capacity: 6}, 'right.anchor': {capacity: 9}};
    const {carried} = carryLoad(beam, original, {load: 8, position: 9});
    assert.equal(carried['left.seat'], 2);
    assert.equal(carried['right.seat'], 6);
    assert.deepEqual(carryLoad(beam, original, {load: 8, position: 6}).carried['right.seat'], 4);
    const before = loadLimit(beam, original, {position: 9});
    assert.deepEqual([before.element, before.total], ['right.seat', 8]);
    const stronger = {...original, 'right.seat': {capacity: 10}};
    const after = loadLimit(beam, stronger, {position: 9});
    assert.deepEqual([after.element, after.total], ['right.anchor', 12], 'not the 13 1/3 the fastener rating alone predicts');
});

test('FG4-D: salvage splits owned units by condition and refuses borrowed parts', () => {
    assert.deepEqual(planSalvage({cutLoss: {num: 1, den: 10}}, {units: 10, condition: 70}), {reusable: 7, scrap: 2, loss: 1});
    assert.throws(() => planSalvage({cutLoss: {num: 1, den: 10}}, {units: 10, condition: 70, owned: false}), /borrowed/);
});

test('wear lands on what carried the demand (FBC6)', () => {
    const weak = axe('Iron axe head', 'Simple wooden medium handle');
    const wear = wearFromUse(weak.arrangement, weak.elements, {load: 7}, {wearPerFullLoad: 10});
    assert.ok(wear['axe.hafting'] < wear.head && wear.head < wear.handle, JSON.stringify(wear));
    assert.equal(Math.round(wear.handle * 1000), Math.round(7 / 7.7 * 10 * 1.104 * 1000));
});

// Forge, haft and test one axe as one kernel working. Each step rereads its
// bound thing at its own time (KW3), so a handle swapped before the join
// step changes where the working stops.
function axeWorking(handleId) {
    const ingot = key('Iron ingot');
    const things = {
        'lot:ingots': {kind: 'lot', id: 'ingots', allocations: [{item_key: ingot, count: 4}]},
        'part:head': {kind: 'part', id: 'head', ...village.parts['Iron axe head']},
        'part:handle': {kind: 'part', id: 'handle', ...village.parts[handleId]},
        'assembly:axe': {kind: 'assembly', id: 'axe', ...axe('Iron axe head', handleId)}
    };
    const method = {id: 'f.village.iron-axe', revision: 1, law: FABRICATION_LAW.ref,
        roles: {ingots: 'lot', head: 'part', handle: 'part', axe: 'assembly'},
        steps: [
            {op: 'partition', minutes: 30, bindings: {stock: 'ingots'},
                options: {world: W, process: 'forge.axe_head', request: {resultId: 'Iron axe head', crafted: {100: 1}}}},
            {op: 'join', minutes: 10, bindings: {a: 'head', b: 'handle'},
                options: {join: village.joins['axe.hafting'], sides: ['head', 'handle']}},
            {op: 'load', minutes: 1, bindings: {piece: 'axe'}, options: {demand: {load: 14}}}
        ]};
    const bindings = {ingots: {kind: 'lot', id: 'ingots'}, head: {kind: 'part', id: 'head'},
        handle: {kind: 'part', id: 'handle'}, axe: {kind: 'assembly', id: 'axe'}};
    const ports = {read: ref => things[`${ref.kind}:${ref.id}`] ?? null};
    return {method, bindings, ports};
}

test('a making quotes and settles as a kernel working, with the same result in one jump or many', () => {
    const {method, bindings, ports} = axeWorking('Hickory wood medium handle');
    const quote = quoteWorking(FABRICATION_LAW, method, {id: 'axe.1', bindings, at: 100, ports});
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.deadlines, [130, 140, 141]);
    const record = beginWorking(FABRICATION_LAW, method, {id: 'axe.1', bindings, at: 100});
    const once = settleWorking(FABRICATION_LAW, record, {now: 141, ports});
    let stepwise = record, effects = [];
    for (let now = 100; now <= 141; now += 7) {
        const r = settleWorking(FABRICATION_LAW, stepwise, {now, ports});
        stepwise = r.record; effects.push(...r.effects);
    }
    const last = settleWorking(FABRICATION_LAW, stepwise, {now: 141, ports});
    effects.push(...last.effects);
    assert.deepEqual(last.record, once.record);
    assert.deepEqual(effects, once.effects);
    assert.deepEqual(quote.effects, once.effects.map(row => row.effect));
    const partition = once.effects[0].effect;
    assert.equal(partition.kind, 'fabrication.partition');
    assert.equal(partition.outputs.length, 2, 'one head and one offcut');
    assert.equal(partition.losses[0].amount, 20);
    // Save after the forge step, reload, finish.
    const mid = settleWorking(FABRICATION_LAW, record, {now: 135, ports}).record;
    const restored = restoreWorking(FABRICATION_LAW, JSON.parse(JSON.stringify(serializeWorking(mid))));
    assert.deepEqual(settleWorking(FABRICATION_LAW, restored, {now: 141, ports}).record, once.record);
});

test('the same method stops at the join for a misfit and at the load for a weak handle', () => {
    const weak = axeWorking('Simple wooden medium handle');
    const weakQuote = quoteWorking(FABRICATION_LAW, weak.method, {id: 'axe.2', bindings: weak.bindings, at: 0, ports: weak.ports});
    assert.equal(weakQuote.failedStep, 2);
    assert.equal(weakQuote.reason, 'handle gave way.');
    const misfit = axeWorking('Hickory wood medium handle');
    const read = misfit.ports.read;
    const ports = {read: (ref, at) => ref.id === 'handle' ? {kind: 'part', id: 'handle', interfaces: ['tang.short'], capacity: 99} : read(ref, at)};
    const quote = quoteWorking(FABRICATION_LAW, misfit.method, {id: 'axe.3', bindings: misfit.bindings, at: 0, ports});
    assert.equal(quote.failedStep, 1);
    assert.match(quote.reason, /does not fit/);
    assert.equal(quote.effects.length, 1, 'the forged head and offcut stand');
});

test('SC8: a making takes a practiced working as input', () => {
    const practice = defineWorkingLaw({id: 'f.test.move', revision: 1, operations: {
        rehearse: {roles: {self: 'actor'}, settle: ({facts}) => ({ok: true, facts: {practice: (facts.practice ?? 0) + 1}})}
    }});
    const move = n => ({id: 'f.test.moonblade-drill', revision: 1, law: practice.ref, roles: {self: 'actor'},
        steps: Array.from({length: n}, () => ({op: 'rehearse', minutes: 60, bindings: {self: 'self'}}))});
    const practised = n => settleWorking(practice, beginWorking(practice, move(n), {id: `drill.${n}`,
        bindings: {self: {kind: 'actor', id: 'player'}}, at: 0}), {now: 60 * n}).record;
    const row = {id: 'refine.drill-gu', method: 'f.test.moonblade-drill', minPractice: 3, product: 'test.drill-gu', practice: {from: 'fact', name: 'practice'}};
    assert.equal(practicedWorkingFits(row, practised(2)).ok, false);
    assert.equal(practicedWorkingFits(row, practised(3)).ok, true);
    const method = {id: 'f.test.refine', revision: 1, law: FABRICATION_LAW.ref, roles: {move: 'working'},
        steps: [{op: 'refine', minutes: 120, bindings: {method: 'move'}, options: {row}}]};
    const bindings = {move: {kind: 'working', id: 'drill'}};
    const portsFor = n => ({read: ref => ({kind: 'working', id: ref.id, record: practised(n)})});
    const short = quoteWorking(FABRICATION_LAW, method, {id: 'refine.1', bindings, at: 0, ports: portsFor(2)});
    assert.match(short.reason, /more practice \(2 of 3\)/);
    const done = quoteWorking(FABRICATION_LAW, method, {id: 'refine.1', bindings, at: 0, ports: portsFor(3)});
    assert.deepEqual(done.effects, [{kind: 'fabrication.refined', product: 'test.drill-gu', from: 'drill'}]);
    // Default reading: count completed performances, each its own record.
    const byRuns = {...row, practice: undefined};
    assert.equal(practicedWorkingFits(byRuns, [practised(1), practised(1)]).ok, false);
    assert.deepEqual(practicedWorkingFits(byRuns, [practised(1), practised(1), practised(1)]), {ok: true, runs: 3});
    const other = {...practised(1), method: {id: 'f.test.other'}};
    assert.match(practicedWorkingFits(byRuns, [other]).reason, /needs f\.test\.moonblade-drill/);
});
