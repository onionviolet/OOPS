// E11 (proposal): saved dice. One draw root in the engine save; a working's odds step and a
// pack law draw by address, so order, jump size and a save and restore cannot move a draw.
// Every number below is fixture data; the world is an original one.
import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceEngineWorld, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking,
    engineReceipts, engineDraw, DRAWS_SCHEMA, DEFAULT_DRAW_ROOT} from '../src/engine_world.js';
import {defineWorkingLaw, quoteWorking, settleWorking, beginWorking, restoreWorking, serializeWorking} from '../src/kernel_working.js';
import {composeSubstrate, createWorld, advanceWorld, substratePort, drawKeyOf} from '../src/world_substrate.js';
import {individualSpread, expressPolygenic} from '../src/heredity.js';

// ---- fixture world data ----
const END = 84, EVERY = 10;
const shared = {quantities: ['luck', 'grit', 'wool', 'bruise'].map(id => ({id, unit: id, min: 0, max: 100000}))};
// A fixture pack with two laws that draw. `gust` is a draw of a moment: every EVERY minutes each open
// holder may take grit, keyed by its own id and the period. `fleece` is an innate draw: a sheep's wool
// weight is set once, keyed by its draw key, so a copy that keeps the key grows the same fleece.
const weather = {
    id: 'x.weather', revision: 0, quantities: [], reads: ['grit', 'wool'], writes: ['grit', 'wool'],
    laws: [{
        id: 'gust', appliesTo: h => h.tags.includes('open'),
        horizon: view => EVERY - view.clock % EVERY,
        decide(view, id) {
            const period = Math.floor(view.clock / EVERY), state = view.state(id) ?? {};
            if (view.clock % EVERY || state.period === period) return [];
            const hit = view.draw([id, period, 'gust']) % 1000 < 500;
            return [{op: 'state', holder: id, value: {...state, period, hits: [...(state.hits ?? []), ...(hit ? [period] : [])]}},
                ...(hit ? [{op: 'add', holder: id, quantity: 'grit', amount: 3}] : [])];
        },
    }, {
        id: 'fleece', appliesTo: h => h.tags.includes('sheep'),
        decide(view, id) {
            const state = view.state(id) ?? {};
            if (state.fleeced) return [];
            return [{op: 'state', holder: id, value: {...state, fleeced: true}},
                {op: 'set', holder: id, quantity: 'wool', amount: 2000 + view.draw([view.drawKey(id), 'wool']) % 3000}];
        },
    }],
};
const sheep = (id, extra = {}) => ({id, kind: 'body', place: 'fold', as: ['creature'], tags: ['open', 'sheep'],
    quantities: {luck: 0, grit: 0, wool: 0, bruise: 0}, ...extra});
const holders = [
    {id: 'fold', kind: 'place', tags: ['open'], quantities: {grit: 0}},
    sheep('ewe'),
    sheep('ewe.copy', {refs: {draws: 'ewe'}}),   // the default copy: shares the original's innate draws
    sheep('ewe.apart'),                           // the dial: a copy with its own key
];
// A working whose every step is a try at published odds. A hit lands luck; the method row says what a miss does.
const law = defineWorkingLaw({id: 'fix.chance', revision: 1, operations: {
    try: {roles: {who: 'creature'}, minutes: 7, settle: ({bound, options, step}) => ({ok: true, odds: options.odds ?? 500,
        effects: [{op: 'add', holder: bound.who.holder, quantity: 'luck', amount: 1}], facts: {[`won${step}`]: true},
        observed: {saw: 'landed'}, ...(options.miss ? {miss: options.miss} : {})})},
}});
const method = (id, steps) => ({id, revision: 1, law: law.ref, roles: {who: 'creature'},
    steps: steps.map(options => ({op: 'try', bindings: {who: 'who'}, options}))});
const twelve = method('twelve', Array.from({length: 12}, () => ({})));
const config = {packs: ['x.weather'], ownPacks: [weather], shared, host: {laws: [law]}};
const NO_ROOT = Symbol('no root chosen');
const fresh = (drawRoot = 'vale-1') => createEngineWorld({...config, holders, ...(drawRoot === NO_ROOT ? {} : {drawRoot})});
const begin = (engine, id, who, m = twelve) => startEngineWorking(engine, {law, method: m, id, bindings: {who: {kind: 'creature', id: who}}});
const start = (root, order = ['alpha', 'beta']) => order.reduce((e, id) => begin(e, id, {alpha: 'ewe', beta: 'ewe.apart'}[id]), fresh(root));
const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
function play(engine, stops, reloadAt = []) {
    for (const to of stops) {
        engine = advanceEngineWorld(engine, to).engine;
        if (reloadAt.includes(to)) engine = reload(engine);
    }
    return engine;
}
const draws = (engine, id) => engineReceipts(engine).filter(r => r.working === id).map(r => r.truth.draw);
const minutes = Array.from({length: END}, (_, i) => i + 1);

test('an odds step and a pack law replay the same by one jump, by the minute, by uneven jumps and across restores', () => {
    const jump = serializeEngineWorld(play(start(), [END]));
    assert.deepEqual(serializeEngineWorld(play(start(), minutes)), jump, 'minute by minute');
    assert.deepEqual(serializeEngineWorld(play(start(), [3, 10, 11, 40, 41, 69, END])), jump, 'uneven jumps');
    assert.deepEqual(serializeEngineWorld(play(start(), [3, 10, 11, 40, 41, 69, END], [3, 10, 40, 69])), jump, 'restored at four points');
    assert.deepEqual(serializeEngineWorld(play(start(), minutes, minutes)), jump, 'restored at every minute');

    // The run is a real mix: some tries hit and some miss, some gusts land and some pass.
    const done = play(start(), [END]), rolls = draws(done, 'alpha');
    assert.equal(rolls.length, 12);
    assert.ok(rolls.some(d => d.hit) && rolls.some(d => !d.hit), 'alpha both hits and misses');
    assert.ok(rolls.every(d => d.hit === d.roll < 500 && typeof d.address === 'string'));
    // What landed is what the receipts say was drawn: a miss lands nothing, by default.
    assert.equal(done.world.holders.ewe.quantities.luck, rolls.filter(d => d.hit).length);
    const hits = done.world.holders.fold.state['x.weather'].hits;
    assert.ok(hits.length > 0 && hits.length < 8, 'the fold took some of the eight gusts');
    assert.equal(done.world.holders.fold.quantities.grit, 3 * hits.length);
    // A missed try keeps none of the hit branch's facts and still shows the maker what the operation showed.
    const missed = engineReceipts(done).find(r => r.working === 'alpha' && !r.truth.draw.hit);
    assert.deepEqual([missed.ok, missed.truth.facts, missed.truth.effects], [true, {}, []]);
});

test('the root is data: saved in the engine save, and two roots give two different runs', () => {
    const a = play(start('vale-1'), [END]), b = play(start('vale-2'), [END]);
    assert.deepEqual(serializeEngineWorld(a).draws, {schema: DRAWS_SCHEMA, root: 'vale-1'});
    assert.notDeepEqual(draws(a, 'alpha').map(d => d.roll), draws(b, 'alpha').map(d => d.roll));
    assert.notDeepEqual(a.world.holders.fold.state['x.weather'].hits, b.world.holders.fold.state['x.weather'].hits);
    assert.notEqual(a.world.holders.ewe.quantities.wool, b.world.holders.ewe.quantities.wool);
    assert.notEqual(engineDraw(a, 'any', 1), engineDraw(b, 'any', 1));
    // A whole-number root works the same way.
    const n = play(start(77), [END]);
    assert.equal(serializeEngineWorld(n).draws.root, 77);
    assert.deepEqual(serializeEngineWorld(play(start(77), minutes, [20, 50])), serializeEngineWorld(n));
});

test('compatibility: a save with no draws key restores with the default root, and the default root is not written', () => {
    const plainWorld = play(start(NO_ROOT), [30]);
    const saved = serializeEngineWorld(plainWorld);
    assert.equal('draws' in saved, false, 'a world that never chose a root saves as it did before');
    const back = restoreEngineWorld(saved, config);
    assert.equal(back.draws.root, DEFAULT_DRAW_ROOT);
    assert.deepEqual(serializeEngineWorld(play(back, [END])), serializeEngineWorld(play(start(NO_ROOT), [END])));
    // Giving an old save a root of its own is an edit to data.
    const rerooted = restoreEngineWorld({...saved, draws: {schema: DRAWS_SCHEMA, root: 'vale-9'}}, config);
    assert.equal(rerooted.draws.root, 'vale-9');
    assert.throws(() => restoreEngineWorld({...saved, draws: {schema: 'engine.draws@9', root: 1}}, config), /draws save version/);
    assert.throws(() => createEngineWorld({...config, holders, drawRoot: -1}), /draw root/);
});

test('a working draws by its own address: another working, or the order they began in, does not move it', () => {
    const both = play(start('vale-1', ['alpha', 'beta']), [END]);
    const swapped = play(start('vale-1', ['beta', 'alpha']), [END]);
    const alone = play(begin(fresh(), 'alpha', 'ewe'), [END]);
    assert.deepEqual(draws(swapped, 'alpha'), draws(both, 'alpha'));
    assert.deepEqual(draws(swapped, 'beta'), draws(both, 'beta'));
    assert.deepEqual(draws(alone, 'alpha'), draws(both, 'alpha'));
    assert.notDeepEqual(draws(both, 'alpha').map(d => d.roll), draws(both, 'beta').map(d => d.roll), 'two workings, two fates');
    // The same holds for the pack law: the fold's gusts do not depend on who else stands in it.
    const empty = play(createEngineWorld({...config, holders: holders.slice(0, 1), drawRoot: 'vale-1'}), [END]);
    assert.deepEqual(empty.world.holders.fold.state['x.weather'].hits, both.world.holders.fold.state['x.weather'].hits);
    // The minute is part of the address: the same working begun later is a new attempt.
    const later = play(begin(play(fresh(), [5]), 'alpha', 'ewe'), [END + 5]);
    assert.notDeepEqual(draws(later, 'alpha').map(d => d.roll), draws(both, 'alpha').map(d => d.roll));
});

test('a quote shows the odds and the hit branch; it does not ask for the draw', () => {
    const engine = fresh();
    const today = world => ref => substratePort(world)(ref); // a forecast reads today's world for every step
    const ports = {read: today(engine.world), draw: () => assert.fail('a quote asked for a draw')};
    const quote = quoteWorking(law, method('one', [{}]), {id: 'alpha', bindings: {who: {kind: 'creature', id: 'ewe'}}, at: 0, ports});
    assert.deepEqual(quote.odds, [500]);
    assert.equal(quote.effects.length, 1, 'what a hit would land');
    assert.equal(JSON.stringify(quote).includes('roll'), false);
    // The quote is the same under any root, so its fingerprint cannot leak the outcome.
    const other = quoteWorking(law, method('one', [{}]), {id: 'alpha', bindings: {who: {kind: 'creature', id: 'ewe'}}, at: 0,
        ports: {read: today(fresh('vale-2').world), draw: () => ({value: 0})}});
    assert.equal(other.fingerprint, quote.fingerprint);
    // Quoting changes nothing: the engine after a quote saves as it did before it.
    assert.deepEqual(serializeEngineWorld(engine), serializeEngineWorld(fresh()));
});

test('what a miss does is the method row\'s to say: nothing, another outcome, or a stop', () => {
    const who = {who: {kind: 'creature', id: 'ewe'}};
    const run = steps => play(startEngineWorking(fresh(), {law, method: method('m', steps), id: 'm', bindings: who}), [30]);
    // Sure odds either way are drawn too, and written down.
    const sure = run([{odds: 1000}, {odds: 0}]);
    assert.deepEqual(draws(sure, 'm').map(d => d.hit), [true, false]);
    assert.equal(sure.world.holders.ewe.quantities.luck, 1);
    // Another outcome: the fumble lands a bruise and tells the maker.
    const fumble = run([{odds: 0, miss: {effects: [{op: 'add', holder: 'ewe', quantity: 'bruise', amount: 2}], facts: {fumbled: true}, observed: {saw: 'slipped'}}}]);
    assert.deepEqual([fumble.world.holders.ewe.quantities.luck, fumble.world.holders.ewe.quantities.bruise], [0, 2]);
    const row = engineReceipts(fumble)[0];
    assert.deepEqual([row.ok, row.truth.facts, row.observed], [true, {fumbled: true}, {saw: 'slipped'}]);
    assert.equal(fumble.records.workings.m.record.status, 'complete');
    // A stop: the working is interrupted at the missed step, the later step never runs, and it restores.
    const stop = run([{odds: 0, miss: {ok: false, reason: 'lost-the-thread'}}, {}]);
    const record = stop.records.workings.m.record;
    assert.deepEqual([record.status, record.receipts.length, record.receipts[0].cause, record.receipts[0].reason], ['interrupted', 1, 'draw', 'lost-the-thread']);
    assert.equal(record.receipts[0].truth.draw.hit, false);
    assert.deepEqual(serializeEngineWorld(reload(stop)), serializeEngineWorld(stop));
});

test('the kernel alone: with no draw port a receipt is as it was, and a port answer is checked', () => {
    const m = method('k', [{}]), bindings = {who: {kind: 'creature', id: 'ewe'}};
    const read = ref => ({...ref, holder: ref.id});
    const record = beginWorking(law, m, {id: 'k', bindings, at: 0});
    const bare = settleWorking(law, record, {now: 7, ports: {read}});
    assert.equal('draw' in bare.record.receipts[0].truth, false);
    assert.equal(bare.effects.length, 1, 'no port: the odds stay a label, as before');
    const asked = [];
    const drawn = settleWorking(law, record, {now: 7, ports: {read, draw: q => { asked.push(q); return {value: 2748779070}; }}});
    assert.deepEqual(asked, [{working: 'k', step: 0, op: 'try', at: 7, address: 'k/0', odds: 500}]);
    assert.deepEqual(drawn.record.receipts[0].truth.draw, {address: 'k/0', roll: 640, hit: false});
    assert.deepEqual(restoreWorking(law, serializeWorking(drawn.record)), drawn.record);
    assert.throws(() => settleWorking(law, record, {now: 7, ports: {read, draw: () => ({value: 2 ** 32})}}), /below 2\^32/);
});

test('lineage: a copy that keeps the draw key shares innate draws; its draws of a moment are its own', () => {
    const done = play(fresh(), [END]), h = done.world.holders;
    assert.deepEqual([drawKeyOf(h.ewe), drawKeyOf(h['ewe.copy']), drawKeyOf(h['ewe.apart'])], ['ewe', 'ewe', 'ewe.apart']);
    assert.equal(h['ewe.copy'].quantities.wool, h.ewe.quantities.wool, 'same fleece under a new id');
    assert.notEqual(h['ewe.apart'].quantities.wool, h.ewe.quantities.wool, 'the dial: its own key, its own fleece');
    assert.notDeepEqual(h['ewe.copy'].state['x.weather'].hits, h.ewe.state['x.weather'].hits, 'the weather treats the two apart');
    assert.deepEqual(reload(done).world.holders['ewe.copy'].refs, {draws: 'ewe'}, 'the key is saved with the holder');

    // Design record G3, with the creature owner's own functions and no change to them: pass the draw key
    // where they take the individual's id, and the saved root as their root.
    const genome = {id: 'fix.sheep', spread: {height: [600, 900]}, polygenic: {fleece: {mean: 4000, sd: 600, heritability: 400, min: 1000, max: 9000}}};
    const shown = id => ({...individualSpread(genome, {root: done.draws.root, id: drawKeyOf(h[id])}),
        ...expressPolygenic(genome, {fleece: 4200}, {root: done.draws.root, id: drawKeyOf(h[id])})});
    assert.deepEqual(shown('ewe.copy'), shown('ewe'));
    assert.notDeepEqual(shown('ewe.apart'), shown('ewe'));
});

test('a substrate composed with no draw says so when a law asks', () => {
    const rules = composeSubstrate({packs: [weather], quantities: shared.quantities});
    const world = createWorld(rules, {holders: holders.slice(0, 1)});
    assert.throws(() => advanceWorld(rules, world, 20), /composed without a draw root/);
});
