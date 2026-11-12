// E1 (proposal): every cost a working publishes is debited by the owner of its quantity in the
// same settlement, and a payer who is short settles as a fault with its own price. One engine
// world, one timeline, four families. Every number below is fixture data.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {settleCosts, receiptCosts} from '../src/cost_owner.js';
import * as B from '../src/binding.js';
import {quoteActivation} from '../src/body_alteration.js';
import {PROCESS_LAW, processMethod} from '../src/process_law.js';
import {storeWorking, fireStored, rechargeStored, serializeStored, restoreStored} from '../src/stored_working.js';
import {beginWorking, settleWorking, serializeWorking, restoreWorking} from '../src/kernel_working.js';
import {landEffect} from '../src/effect_host.js';
import {createEngineWorld, advanceEngineWorld, applyEngineOps, serializeEngineWorld, restoreEngineWorld} from '../src/engine_world.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../src/world_quantities.js';
import {steelPack} from './fixtures/process_craft_packs.js';

// ---- fixture pack data ----
const END = 22;
const pack = 'l.body_alteration';
const rig = {id: 'rig', carrier: 'hardware', slot: 'spine', load: {body: 1}, upkeep: [], course: {key: 'strain', perMinute: 0, overPerMinute: 0},
    activation: {permille: 2000, ticks: 60, per: 60, perTick: 0.001, thresholds: [{at: 20, factorPermille: 3000}]}};
const own = ['coin', 'grain', 'debt', 'fuel', 'wear', 'ink'].map(id => ({id, unit: id, min: 0, max: 100000}));
const config = {packs: [pack], dials: {chainCap: 2000},
    settings: {[pack]: {rows: [rig], budgets: {body: {capacity: 3, curve: [{at: 0, slope: 1}]}}, slots: {spine: {room: 1, crowdPermille: 2000}},
        courses: {strain: {recoverPerMinute: 5, stages: []}}}},
    shared: {quantities: [...Object.values(WQ), ...own], properties: [...Object.values(WP), ...['hardness', 'toughness']
        .filter(id => !Object.values(WP).some(p => p.id === id)).map(id => ({id, type: 'level'}))]}};
const sentence = (verb, object) => ({verb, object, time: 'instant', target: 'bound', carrier: 'pattern', cost: 'stored', limits: []});
// The world's price list: what each cost is counted in, the ways around, and what being short costs.
const costs = {
    accounts: {
        coin: {quantity: 'coin', substitutes: [{quantity: 'grain', num: 3, den: 1}],
            fault: {id: 'in-arrears', cause: 'The rest is written up as debt at double.', owed: [{quantity: 'debt', num: 2, den: 1}]}},
        ink: {quantity: 'ink', fault: {id: 'thin-ink', cause: 'The pattern takes the rest from the hand that draws it.',
            effects: [{sentence: sentence('remove', 'vitality'), details: {target: {shape: 'holder', id: '$payer'}}, per: {num: 1, den: 1}}]}},
        fuel: {quantity: 'fuel', fault: {id: 'cold-forge', cause: 'Blows on cooling metal wear the tool.', owed: [{quantity: 'wear', holder: 'hammer', num: 1, den: 2}]}},
        wear: {quantity: 'wear', as: 'burden'},
    },
    backers: [{for: 'user', by: 'patron', kinds: ['coin'], owed: {quantity: 'debt', num: 3, den: 2}}],
};
const holders = [
    {id: 'room', kind: 'place', quantities: {temperature: 18}},
    {id: 'user', kind: 'body', place: 'room', quantities: {coin: 5, grain: 9, debt: 0, ink: 3, vitality: 20}},
    {id: 'patron', kind: 'body', place: 'room', quantities: {coin: 4}},
    {id: 'stranger', kind: 'body', place: 'room', quantities: {coin: 0}},
    {id: 'forge', kind: 'thing', place: 'room', quantities: {fuel: 20}},
    {id: 'hammer', kind: 'thing', place: 'room', quantities: {wear: 0}},
    {id: 'sample', kind: 'thing', place: 'room'},
    {id: 'gate', kind: 'thing', place: 'room'},
];
const pact = B.defineBinding({id: 'pact', sides: {a: 'patron', b: 'user'}, madeAt: 0, standing: {start: 5, max: 9},
    price: {costs: [{kind: 'coin', amount: 6, owes: 'b'}], effects: [], cause: 'pact-made'},
    exits: [{id: 'buyout', kind: 'buyout', by: 'b', consent: [], costs: [{kind: 'coin', amount: 5}], effects: [], cause: 'bought-out'}]});
const toll = {authority: ({moment, by}) => moment !== 'fire' ? {ok: true}
    : by === 'stranger' ? {ok: false, reason: 'toll', costs: [{kind: 'coin', amount: 2}]} : {ok: true, costs: [{kind: 'coin', amount: 3}]}};
const gateSpec = {carrier: 'gate', pulse: 1, mode: 'repeating', trigger: {kind: 'touch'},
    effects: [{sentence: sentence('add', 'heat'), details: {target: {shape: 'holder', id: '$place'}, amount: 1}}],
    charge: {now: 2, max: 10, per: 1}, recharge: {quantity: 'ink', rate: 2}};
const S = steelPack.steps;
const method = processMethod({id: steelPack.id, revision: steelPack.revision, rows: steelPack.rows, projection: steelPack.projection, steps: [
    {...S.heat, options: {costs: [{kind: 'fuel', perMinute: 2}]}},
    {...S.forge, options: {costs: [{kind: 'fuel', perMinute: 2}, {kind: 'wear', amount: 1, from: 'tool'}]}}]});
const things = {piece: steelPack.piece, forge: steelPack.media.forge, hammer: steelPack.tools.hammer};
const readThing = ref => Object.values(things).find(t => t.kind === ref.kind && t.id === ref.id);
const forging = () => beginWorking(PROCESS_LAW, method, {id: 'forging', at: 7,
    bindings: Object.fromEntries(Object.keys(method.roles).map(role => [role, {kind: things[role].kind, id: things[role].id}]))});

// ---- the timeline: each event settles its working and its costs in one step ----
const pay = (s, what, rows, payer) => {
    const out = settleCosts({rules: s.engine.rules, world: s.engine.world, costs: rows, payer, cause: what, ...costs});
    s.engine = {...s.engine, world: out.world};
    const {world, ...settled} = out;
    s.settled.push({at: s.engine.world.clock, what, ...settled});
};
const touch = (s, by) => {
    const run = fireStored({rules: s.engine.rules, world: s.engine.world, record: s.gate, at: s.engine.world.clock, stimulus: {kind: 'touch', by}, ports: toll, costs});
    s.engine = {...s.engine, world: run.world}; s.gate = run.record;
    s.settled.push({at: run.receipt.at, what: `gate:${by}`, fired: run.receipt.status, ...run.receipt.settled});
};
const activate = s => {
    const {clock, holders: h} = s.engine.world;
    const quote = quoteActivation(rig, {target: 'user', tick: clock * rig.activation.per, clock, strain: h.user.quantities['alteration_course:strain']});
    const landed = landEffect(s.engine.rules, s.engine.world, quote.effect, {cause: `activate:${clock}`, by: 'user'});
    s.engine = {...s.engine, world: landed.world};
    pay(s, 'activation', quote.costs);
};
const forgeStep = s => {
    const before = s.working.receipts.length;
    const run = settleWorking(PROCESS_LAW, s.working, {now: s.engine.world.clock, ports: {read: readThing}});
    s.working = run.record;
    s.engine = applyEngineOps(s.engine, run.effects.map(row => row.effect), 'forging');
    pay(s, `forging:${before}`, receiptCosts(run.record, before));
};
const events = [
    {at: 0, run: s => { s.engine = applyEngineOps(s.engine, [{op: 'publish', kind: 'alteration.install', place: 'room', detail: {target: 'user', row: rig.id}}], 'fit'); }},
    {at: 0, run: s => pay(s, 'pact:made', B.bindingDues(pact))},
    {at: 2, run: activate},
    {at: 3, run: s => touch(s, 'stranger')},
    {at: 4, run: s => touch(s, 'user')},
    {at: 5, run: s => {
        const at = s.engine.world.clock, state = B.bindingState(pact, {now: at, receipts: [], log: s.log});
        const exit = B.takeExit(pact, state, {exit: 'buyout', by: 'user', at});
        assert.equal(exit.ok, true);
        s.log.push(exit.event);
        pay(s, 'pact:buyout', B.bindingDues(pact, {log: s.log, at, by: 'user', price: exit}));
    }},
    {at: 6, run: s => {
        const run = rechargeStored({rules: s.engine.rules, world: s.engine.world, record: s.gate, at: s.engine.world.clock, by: 'user', amount: 4, costs});
        s.engine = {...s.engine, world: run.world}; s.gate = run.record;
        s.settled.push({at: run.receipt.at, what: 'gate:recharge', added: run.receipt.added, ...run.receipt.settled});
    }},
    {at: 8, run: activate},
    ...forging().deadlines.map(at => ({at, run: forgeStep})),
];
const advance = (s, to) => { const out = advanceEngineWorld(s.engine, to); assert.equal(out.pending, false); s.engine = out.engine; };
const save = s => JSON.parse(JSON.stringify({next: s.next, engine: serializeEngineWorld(s.engine), gate: serializeStored(s.gate),
    working: serializeWorking(s.working), bindings: B.serializeBindings({bindings: [pact], log: s.log}), settled: s.settled}));
const load = saved => ({next: saved.next, engine: restoreEngineWorld(saved.engine, config), gate: restoreStored(saved.gate),
    working: restoreWorking(PROCESS_LAW, saved.working), log: B.restoreBindings(saved.bindings).log, settled: saved.settled});
function play(stops, reload = false) {
    let s = {next: 0, engine: createEngineWorld({...config, holders}), gate: storeWorking(gateSpec, {id: 'gate.toll', by: 'patron', at: 0, ports: toll}),
        working: forging(), log: [], settled: []};
    for (const to of [0, ...stops]) {
        while (s.next < events.length && events[s.next].at <= to) {
            if (events[s.next].at > s.engine.world.clock) advance(s, events[s.next].at);
            events[s.next++].run(s);
        }
        if (to > s.engine.world.clock) advance(s, to);
        if (reload) s = load(save(s));
    }
    return save(s);
}
const jump = play([END]);
const q = (id, name) => jump.engine.world.holders[id].quantities[name];
const at = what => jump.settled.find(row => row.what === what);
const ways = row => row.lines.flatMap(l => l.paid.map(p => `${p.way}:${p.holder}:${p.quantity}:${p.taken}`));

test('one jump, minute by minute, and a save and restore at every minute settle the same costs', () => {
    const minutes = Array.from({length: END}, (_, i) => i + 1);
    assert.deepEqual(play(minutes), jump);
    assert.deepEqual(play(minutes, true), jump);
    assert.deepEqual(play([4, 9, 15, END], true), jump);
});

test('bindings: the making price and an exit price are debited; a substitute, a backer and a fault each show their price', () => {
    const made = at('pact:made');
    assert.equal(made.status, 'paid');
    assert.deepEqual(ways(made), ['own:user:coin:5', 'substitute:user:grain:3']);
    assert.equal(made.lines[0].owner, 'world');
    const out = at('pact:buyout');
    assert.equal(out.status, 'fault');
    assert.deepEqual(ways(out), ['backer:patron:coin:3']);
    assert.deepEqual(out.lines[0].paid[0].owed, {holder: 'user', quantity: 'debt', amount: 5});
    assert.deepEqual(out.faults.map(f => [f.id, f.short, f.of, f.owed[0].amount]), [['in-arrears', 2, 5, 4]]);
    assert.equal(B.bindingState(pact, {now: END, receipts: [], log: jump.bindings.log}).status, 'ended', 'short of the price, the exit still happened');
    assert.deepEqual([q('user', 'coin'), q('user', 'grain'), q('patron', 'coin'), q('user', 'debt')], [0, 0, 0, 11]);
});

test('stored workings: what the authority charges is debited on a refused and on an allowed firing; a short recharge restores its share', () => {
    const refused = at('gate:stranger');
    assert.deepEqual([refused.fired, refused.status, refused.faults[0].id, q('stranger', 'debt')], ['resisted', 'fault', 'in-arrears', 4]);
    const fired = at('gate:user');
    assert.deepEqual([fired.fired, fired.status], ['fired', 'paid']);
    assert.deepEqual(ways(fired), ['substitute:user:grain:6', 'backer:patron:coin:1']);
    const recharge = at('gate:recharge');
    assert.deepEqual([recharge.status, recharge.added, recharge.faults[0].id, recharge.faults[0].short], ['fault', 1, 'thin-ink', 5]);
    assert.deepEqual(recharge.faults[0].effects.map(e => [e.status, e.amount]), [['landed', 5]]);
    assert.deepEqual([q('user', 'ink'), q('user', 'vitality'), jump.gate.charge.now], [0, 15, 2]);
    assert.equal(q('room', 'temperature'), 19, 'the gate fired once');
});

test('body alteration: the activation price lands on the body as strain, and the second one reads the first', () => {
    const [first, second] = jump.settled.filter(row => row.what === 'activation');
    assert.deepEqual([first.status, first.lines[0].paid[0].taken, first.lines[0].owner], ['paid', 60, pack]);
    assert.equal(second.lines[0].paid[0].taken, 180, 'strain left over from the first crosses the row threshold');
    assert.equal(first.lines[0].quantity, 'alteration_course:strain');
    assert.ok(Object.keys(jump.engine.world.holders.user.ledger['alteration_course:strain']).includes(`${pack}:cost:activation`));
});

test('process crafts: fuel by the minute and tool wear are debited at each step, and a forge that runs dry has its price', () => {
    const [heat, work] = [at('forging:0'), at('forging:1')];
    assert.deepEqual([heat.status, ...ways(heat)], ['paid', 'own:forge:fuel:10']);
    assert.equal(work.status, 'fault');
    assert.deepEqual(ways(work), ['own:forge:fuel:10', 'own:hammer:wear:1']);
    assert.deepEqual(work.faults.map(f => [f.id, f.short, f.owed[0].holder, f.owed[0].amount]), [['cold-forge', 6, 'hammer', 3]]);
    assert.deepEqual([q('forge', 'fuel'), q('hammer', 'wear'), jump.working.status], [0, 4, 'complete']);
    assert.equal(work.paidPermille, Math.floor(11000 / 17));
});

test('a cost with no declared quantity is named as unowned, a fault with no price data says so, and the input world is untouched', () => {
    const engine = createEngineWorld({...config, holders});
    const run = rows => settleCosts({rules: engine.rules, world: engine.world, costs: rows, payer: 'stranger', cause: 'probe', accounts: {coin: {quantity: 'coin'}}});
    const unowned = run([{kind: 'favour', amount: 1}]);
    assert.deepEqual([unowned.status, unowned.lines[0].reason], ['unowned', 'no declared quantity for this cost']);
    const unpriced = run([{kind: 'coin', amount: 1}]);
    assert.deepEqual([unpriced.status, unpriced.faults[0].priced, unpriced.faults[0].short], ['fault', false, 1]);
    assert.equal(run([]).status, 'none');
    assert.deepEqual(serializeEngineWorld(engine), serializeEngineWorld(createEngineWorld({...config, holders})));
});

test('the shared module names no world and holds no world number', () => {
    const source = readFileSync(new URL('../src/cost_owner.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /coin|grain|debt|fuel|hogwarts|gu\b|potter|—/i);
    assert.deepEqual(source.match(/\b\d{2,}\b/g) ?? [], ['1000', '1000'], 'permille is the one constant');
});
