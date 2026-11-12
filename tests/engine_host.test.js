// E9 (proposal): one engine host. The engine world holds kernel workings in flight, stored
// workings and bindings beside its packs, advances them on its own clock in one stated order,
// debits what they publish through the cost owner, and saves them in the one engine save.
// Every number below is fixture data; the world is an original one.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {advanceEngineWorld, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking, storeEngineWorking,
    fireEngineStored, makeEngineBinding, exitEngineBinding, engineReceipts, waitingWorkings, RECORDS_SCHEMA} from '../src/engine_world.js';
import {defineWorkingLaw, quoteWorking} from '../src/kernel_working.js';
import {composeWorking, defineComposition} from '../src/kernel_compose.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../src/spell_law.js';
import {sentenceFromIntent, sharedEffect} from '../src/spell_effects.js';
import {PROCESS_LAW, processMethod} from '../src/process_law.js';
import {chargeAt} from '../src/stored_working.js';
import {bindingState, defineBinding} from '../src/binding.js';
import {lowerEffect} from '../src/effect_grammar.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../src/world_quantities.js';
import {steelPack} from './fixtures/process_craft_packs.js';

// ---- fixture world data ----
const END = 70;
const own = ['stamina', 'coin', 'debt', 'fuel', 'wear'].map(id => ({id, unit: id, min: 0, max: 100000}));
const P = (verb, object) => ({verb, object, time: 'instant', target: 'bound', carrier: 'pattern', cost: 'stored', limits: []});
const at = id => ({shape: 'holder', id});
// The world's price list: what each cost word is counted in, the ways around, and what being short costs.
const costs = {
    accounts: {
        stamina: {quantity: 'stamina', fault: {id: 'overdrawn', cause: 'The rest of the casting comes out of the body.',
            effects: [{sentence: P('remove', 'vitality'), details: {target: at('$payer')}, per: {num: 2, den: 1}}]}},
        coin: {quantity: 'coin', fault: {id: 'in-arrears', cause: 'The rest is written up as debt at double.', owed: [{quantity: 'debt', num: 2, den: 1}]}},
        fuel: {quantity: 'fuel', fault: {id: 'cold-forge', cause: 'Blows on cooling metal wear the tool.', owed: [{quantity: 'wear', holder: 'hammer', num: 1, den: 2}]}},
        wear: {quantity: 'wear', as: 'burden'},
    },
};
const holders = [
    {id: 'yard', kind: 'place', quantities: {temperature: 18}},
    {id: 'smith', kind: 'body', place: 'yard', as: ['creature'], quantities: {stamina: 12, coin: 5, debt: 0, vitality: 30}},
    {id: 'hound', kind: 'body', place: 'yard', as: ['creature'], quantities: {vitality: 10}},
    {id: 'raider', kind: 'body', place: 'yard', as: ['creature'], quantities: {vitality: 40}},
    {id: 'forge', kind: 'thing', place: 'yard', as: ['medium'], quantities: {fuel: 20}},
    {id: 'hammer', kind: 'thing', place: 'yard', as: ['tool'], quantities: {wear: 0}},
    {id: 'sample', kind: 'thing', place: 'yard', as: ['piece']},
    {id: 'gate', kind: 'thing', place: 'yard'},
];
// Things a working binds that the world keeps no numbers for: the caller's data, like pack settings.
const things = Object.fromEntries([steelPack.piece, ...Object.values(steelPack.media), ...Object.values(steelPack.tools)].map(t => [`${t.kind}:${t.id}`, t]));

// Spellcraft: a cast is a working on the spell effect law; the moment supplies the cost amount.
const spell = (intent, execution = 'instant') => sentenceFromIntent({intent, target: 'creature', execution, carrier: 'wand', cost: 'stamina'});
const cast = (id, intent, target, details, execution) => spellEffectMethod(
    [{sentence: spell(intent, execution), target: {id: target}, minutes: 1, details: {target: at(target), ...details}}], {id});
const strike = cast('strike', 'hurt', 'raider', {amount: 6, cost: 4});
// Composition: a move of two parts, a guard on the caster and then the strike, chosen at binding time.
const move = defineComposition({id: 'guarded.strike', revision: 1, roles: {self: 'creature', foe: 'creature'}, slots: [
    {name: 'guard', needs: {t0: 'creature'}, bindings: {t0: 'self'}, facts: 'shared'},
    {name: 'blow', needs: {t0: 'creature'}, bindings: {t0: 'foe'}, facts: 'shared'}]});
const composed = composeWorking(move, {guard: cast('guard', 'shield', 'smith', {minutes: 20, cost: 3}, 'sustained'), blow: strike});
// Process craft: the tempered blade, with fuel by the minute and wear by the step.
const S = steelPack.steps;
const blade = processMethod({id: steelPack.id, revision: steelPack.revision, rows: steelPack.rows, projection: steelPack.projection, steps: [
    {...S.heat, options: {costs: [{kind: 'fuel', perMinute: 2}]}},
    {...S.forge, options: {costs: [{kind: 'fuel', perMinute: 2}, {kind: 'wear', amount: 1, from: 'tool'}]}}, S.quench, S.temper]});
const bladeBindings = Object.fromEntries(Object.entries(blade.roles).map(([role, kind]) => [role, {kind, id: role === 'piece' ? 'sample' : steelPack[kind === 'tool' ? 'tools' : 'media'][role].id}]));
// The keeper's duty to the hound is a working like any other: bindings read its receipt.
const careLaw = defineWorkingLaw({id: 'fixture.care', revision: 1, operations: {feed: {roles: {actor: 'creature', target: 'creature'}, minutes: 2,
    settle: ({bound}) => ({ok: true, costs: [{kind: 'coin', amount: 1}],
        effects: [{sentence: P('add', 'vitality'), details: {target: at(bound.target.id), amount: 3}}]})}}});
const feed = {id: 'feed', revision: 1, law: careLaw.ref, roles: {actor: 'creature', target: 'creature'}, steps: [{op: 'feed', bindings: {actor: 'actor', target: 'target'}}]};
const bond = {id: 'bond', sides: {a: 'smith', b: 'hound'}, standing: {start: 5, max: 9, strainAt: 4, lapseAt: 0},
    price: {costs: [{kind: 'coin', amount: 2, owes: 'a'}], effects: [], cause: 'bond-made'},
    upkeep: [{id: 'meal', owes: 'a', every: 10, gain: 2, loss: 3, match: {method: 'feed', roles: {actor: 'smith', target: 'hound'}}}],
    exits: [{id: 'release', kind: 'release', by: 'a', consent: [], costs: [{kind: 'coin', amount: 3}], effects: [], cause: 'released'}]};
// A stored working: a warming ward on the gate, firing by its own clock while its charge leaks.
const ward = {carrier: 'gate', pulse: 5, mode: 'repeating', trigger: {kind: 'time', every: 15},
    effects: [{sentence: P('add', 'heat'), details: {target: at('$place'), amount: 2}}],
    charge: {now: 9, max: 10, per: 2}, decay: {every: 4, amount: 1}};

const config = {packs: ['w.sky'], dials: {chainCap: 2000},
    shared: {quantities: [...Object.values(WQ), ...own], properties: [...Object.values(WP), ...['hardness', 'toughness']
        .filter(id => !Object.values(WP).some(p => p.id === id)).map(id => ({id, type: 'level'}))]},
    host: {laws: [SPELL_EFFECT_LAW, composed.law, PROCESS_LAW, careLaw], things, costs, effects: {keys: {light: 'wand', essence: 'mana'}, read: sharedEffect}}};
const creature = id => ({kind: 'creature', id});

// ---- the timeline: every entry is one engine action; nothing here advances a record by hand ----
const events = [
    {at: 0, run: e => makeEngineBinding(e, bond)},
    {at: 0, run: e => storeEngineWorking(e, ward, {id: 'gate.ward', by: 'smith'})},
    {at: 1, run: e => startEngineWorking(e, {law: PROCESS_LAW, method: blade, id: 'blade', bindings: bladeBindings})},
    {at: 3, run: e => startEngineWorking(e, {...strike, id: 'cast.1', payer: 'smith'})},
    {at: 6, run: e => startEngineWorking(e, {law: careLaw, method: feed, id: 'feed.1', payer: 'smith', bindings: {actor: creature('smith'), target: creature('hound')}})},
    {at: 12, run: e => startEngineWorking(e, {...composed, id: 'move.1', payer: 'smith', bindings: {self: creature('smith'), foe: creature('raider')}})},
    {at: 33, run: e => startEngineWorking(e, {...strike, id: 'cast.2', payer: 'smith'})},
];
const save = engine => JSON.stringify(serializeEngineWorld(engine));
function play(stops, reload = false, timeline = events) {
    let engine = createEngineWorld({...config, holders}), next = 0;
    const advance = to => { const out = advanceEngineWorld(engine, to); assert.equal(out.pending, false); engine = out.engine; };
    for (const to of [0, ...stops]) {
        while (next < timeline.length && timeline[next].at <= to) {
            if (timeline[next].at > engine.world.clock) advance(timeline[next].at);
            engine = timeline[next++].run(engine);
        }
        advance(to);
        if (reload) engine = restoreEngineWorld(JSON.parse(save(engine)), config);
    }
    return engine;
}
const minutes = Array.from({length: END}, (_, i) => i + 1);
const jump = play([END]);
const q = (id, name, engine = jump) => engine.world.holders[id].quantities[name];
const working = (id, engine = jump) => engine.records.workings[id];
const paid = (id, step = 0, engine = jump) => working(id, engine).record.receipts[step].truth.paid;
const ways = settled => settled.lines.flatMap(l => l.paid.map(p => `${p.way}:${p.holder}:${p.quantity}:${p.taken}`));

test('E9: one engine save holding a running working, a stored working and a binding agrees across jump, minute and restore', () => {
    // Midway the save holds all three kinds at once: the blade in flight, the ward leaking charge, the bond with a meal due.
    const mid = play([18]);
    assert.equal(working('blade', mid).record.status, 'running');
    assert.deepEqual([mid.records.stored['gate.ward'].status, chargeAt(mid.records.stored['gate.ward'], 18)], ['armed', 3]);
    assert.equal(bindingState(defineBinding(mid.records.bindings[0]), {now: 18, receipts: engineReceipts(mid), log: mid.records.log}).status, 'held');
    assert.equal(JSON.parse(save(mid)).records.schema, RECORDS_SCHEMA);
    const whole = save(jump);
    assert.equal(save(play(minutes)), whole, 'minute by minute');
    assert.equal(save(play(minutes, true)), whole, 'save and restore at every minute');
    assert.equal(save(play([4, 9, 15, 18, 33, 41, END], true)), whole, 'save and restore at several points');
    assert.equal(save(play([7, 20, 50, END])), whole, 'uneven jumps');
    assert.deepEqual(waitingWorkings(jump), []);
});

test('costs are debited inside the host: a cast spell, a composed move, a duty and the blade; a shortfall is a fault with its price', () => {
    // Spellcraft (H1): the sentence's cost word and the moment's amount become one cost row, debited before the effect lands.
    assert.deepEqual([paid('cast.1').status, ...ways(paid('cast.1'))], ['paid', 'own:smith:stamina:4']);
    assert.deepEqual(working('cast.1').landed, [{step: 0, at: 4, status: 'landed'}]);
    assert.ok(Object.keys(jump.world.holders.smith.ledger.stamina).includes('world:cost:working:cast.1:0'), 'the ledger names the owner and the working');
    // Composition: each part pays at its own step, on one receipt trail.
    assert.deepEqual([0, 1].map(step => ways(paid('move.1', step))[0]), ['own:smith:stamina:3', 'own:smith:stamina:4']);
    assert.deepEqual(working('move.1').record.receipts.map(r => r.op), ['guard/block.creature', 'blow/remove.creature']);
    // A plain kernel law's own cost row (KW15).
    assert.deepEqual(ways(paid('feed.1')), ['own:smith:coin:1']);
    // The second cast finds 1 stamina for a price of 4: it is not refused, the spell lands, and the rest comes out of the body at two for one.
    const short = paid('cast.2');
    assert.deepEqual([short.status, short.paidPermille, ...ways(short)], ['fault', 250, 'own:smith:stamina:1']);
    assert.deepEqual(short.faults.map(f => [f.id, f.short, f.of, f.priced, f.effects[0].status, f.effects[0].amount]), [['overdrawn', 3, 4, true, 'landed', 6]]);
    assert.deepEqual([q('smith', 'stamina'), q('smith', 'vitality'), q('raider', 'vitality')], [0, 24, 22]);
    // Process craft: fuel by the minute at each step; the forge runs dry in the second and the fault wears the hammer.
    assert.deepEqual([paid('blade', 0).status, ...ways(paid('blade', 0))], ['paid', 'own:forge:fuel:10']);
    assert.deepEqual(paid('blade', 1).faults.map(f => [f.id, f.short, f.owed[0].holder, f.owed[0].amount]), [['cold-forge', 6, 'hammer', 3]]);
    assert.deepEqual([q('forge', 'fuel'), q('hammer', 'wear'), working('blade').record.status], [0, 4, 'complete']);
    assert.deepEqual(jump.world.holders.sample.properties, {hardness: 77, toughness: 77}, 'the tempered blade landed on its holder');
    assert.equal(paid('blade', 2), undefined, 'a step that publishes no cost carries no settlement');
    // Bindings: the making price, and upkeep read from a receipt the host itself settled.
    assert.deepEqual(jump.records.dues.map(d => [d.at, d.what, d.paid.status, ...ways(d.paid)]), [[0, 'bond/made', 'paid', 'own:smith:coin:2']]);
    assert.deepEqual(jump.records.published, ['bond/meal/2', 'bond/meal/3', 'bond/lapsed', 'bond/meal/4'], 'the first meal was kept; the bond lapsed at the fourth');
    const state = bindingState(defineBinding(jump.records.bindings[0]), {now: END, receipts: engineReceipts(jump), log: jump.records.log});
    assert.deepEqual([state.status, state.standing, state.since], ['lapsed', 0, 40]);
    assert.equal(q('hound', 'vitality'), 13);
    // Stored working: it fired once at full charge, then the leak left too little and it went dormant with ways back.
    const stored = jump.records.stored['gate.ward'];
    assert.deepEqual(stored.receipts.map(r => [r.at, r.status]), [[15, 'fired'], [30, 'dormant'], [45, 'dormant'], [60, 'dormant']]);
    assert.deepEqual([q('yard', 'temperature'), stored.receipts[1].ways.includes('recharge')], [20, true]);
});

test('engine actions by hand: a touch fires a stored working, an exit is priced, and a refused exit is written down', () => {
    const touchGate = {...ward, trigger: {kind: 'touch'}, decay: undefined};
    const timeline = [
        {at: 0, run: e => makeEngineBinding(e, bond)},
        {at: 0, run: e => storeEngineWorking(e, touchGate, {id: 'gate.touch', by: 'smith'})},
        {at: 2, run: e => fireEngineStored(e, 'gate.touch', {stimulus: {kind: 'touch', by: 'hound'}})},
        {at: 4, run: e => exitEngineBinding(e, {binding: 'bond', exit: 'release', by: 'hound'})},
        {at: 5, run: e => exitEngineBinding(e, {binding: 'bond', exit: 'release', by: 'smith'})},
        {at: 5, run: e => exitEngineBinding(e, {binding: 'bond', exit: 'release', by: 'smith'})},
    ];
    const end = play([30], false, timeline);
    assert.equal(save(play(minutes.slice(0, 30), true, timeline)), save(end));
    assert.deepEqual(end.records.stored['gate.touch'].receipts.map(r => [r.at, r.by, r.status]), [[2, 'hound', 'fired']]);
    assert.equal(q('yard', 'temperature', end), 20);
    assert.deepEqual(end.records.dues.map(d => [d.at, d.kind, d.paid?.status ?? d.reason]),
        [[0, 'made', 'paid'], [4, 'exit-refused', 'binding-exit-unavailable'], [5, 'exit', 'paid'], [5, 'exit-refused', 'binding-exit-unavailable']]);
    assert.deepEqual([q('smith', 'coin', end), end.records.published], [0, []], 'an ended bond asks for no more meals');
    assert.throws(() => startEngineWorking(startEngineWorking(end, {...strike, id: 'twice'}), {...strike, id: 'twice'}), /already held/);
});

test('an engine save from before the records slice restores, a world with no records saves as before, and an unknown version is refused', () => {
    const bare = createEngineWorld({...config, holders});
    const old = serializeEngineWorld(advanceEngineWorld(bare, 5).engine);
    assert.deepEqual(Object.keys(old), ['schema', 'packs', 'world'], 'no records, no new key');
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(old)), config);
    assert.deepEqual(serializeEngineWorld(restored), old);
    // The restored old save can take records at once.
    const used = advanceEngineWorld(startEngineWorking(restored, {...strike, id: 'cast.old', payer: 'smith'}), 9).engine;
    assert.deepEqual([working('cast.old', used).record.status, q('raider', 'vitality', used)], ['complete', 34]);
    assert.throws(() => restoreEngineWorld({...old, records: {schema: 'engine.records@9'}}, config), /unsupported records save version/);
    // A working whose law the caller did not pass is kept as saved and waits; the rest of the save advances.
    const saved = JSON.parse(save(play([18])));
    const partial = restoreEngineWorld(saved, {...config, host: {...config.host, laws: [SPELL_EFFECT_LAW, composed.law, careLaw]}});
    assert.deepEqual(waitingWorkings(partial), ['blade']);
    const later = advanceEngineWorld(partial, END).engine;
    assert.deepEqual(serializeEngineWorld(later).records.workings.blade, saved.records.workings.blade);
    assert.equal(later.records.published.at(-1), 'bond/meal/4');
});

test('the kernel port and the grammar row are optional: a quote keeps nothing, and a sentence with no amount publishes no cost', () => {
    const engine = createEngineWorld({...config, holders});
    const before = save(engine);
    let asked = 0;
    const quote = quoteWorking(strike.law, strike.method, {id: 'q', bindings: strike.bindings, at: 0,
        ports: {settleCosts: ({forecast, costs, effects}) => { asked += 1; assert.equal(forecast, true); assert.deepEqual([costs, effects.length], [[], 1]); return {status: 'paid'}; }}});
    assert.deepEqual([quote.ok, asked, save(engine)], [true, 1, before]);
    assert.deepEqual(quote.fingerprint, quoteWorking(strike.law, strike.method, {id: 'q', bindings: strike.bindings, at: 0}).fingerprint, 'the port does not change what was quoted');
    const hurt = {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'pattern', cost: 'stamina', limits: []};
    assert.deepEqual(Object.keys(lowerEffect(hurt)), ['acts', 'publish', 'needs']);
    assert.deepEqual(lowerEffect(hurt, {cost: 4, payer: 'smith'}).costs, [{kind: 'stamina', amount: 4, payer: 'smith'}]);
    // No price list at all: the cost is named as unowned on the receipt and the working still settles.
    const unpriced = advanceEngineWorld(startEngineWorking(createEngineWorld({...config, host: {...config.host, costs: null}, holders}), {...strike, id: 'c', payer: 'smith'}), 2).engine;
    assert.deepEqual([paid('c', 0, unpriced).status, paid('c', 0, unpriced).lines[0].reason, q('raider', 'vitality', unpriced)], ['unowned', 'no declared quantity for this cost', 34]);
});

test('the records module names no world and holds no world number', () => {
    const source = readFileSync(new URL('../src/engine_records.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /coin|stamina|forge|hogwarts|\bgu\b|potter|—/i);
    assert.deepEqual(source.replace(/@1/g, '').match(/\b\d{2,}\b/g) ?? [], []);
});
