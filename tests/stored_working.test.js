import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceWorld, applyWorldOps} from '../src/world_substrate.js';
import {landEffect} from '../src/effect_host.js';
import {STORED_SCHEMA, storeWorking, chargeAt, fireStored, advanceStoredWorkings, rechargeStored, renewStored,
    breakStored, serializeStored, restoreStored} from '../src/stored_working.js';
import {engine, n, base, make, effect, sentence, rowRecords, expected} from './fixtures/stored_workings/rows.mjs';

const at = (engine, clock) => ({...engine, world: advanceWorld(engine.rules, engine.world, clock).world});
const fire = (record, options = {}, e = engine()) => fireStored({rules: e.rules, world: e.world, record, at: e.world.clock, ...options});
const edit = (e, ops) => ({...e, world: applyWorldOps(e.rules, e.world, ops, 'fixture')});
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const settle = (e, records, to, ports = {}) => advanceStoredWorkings({rules: e.rules, world: e.world, records, to,
    advance: (world, clock) => advanceWorld(e.rules, world, clock), ports});

test('shape: plain JSON, defaults, unknown version and malformed specs', () => {
    const record = storeWorking({carrier: 'paper', effects: base.effects, pulse: n.pulse, trigger: {kind: 'touch'}},
        {id: 'strip', by: 'person', at: n.start});
    assert.equal(record.schema, STORED_SCHEMA);
    assert.equal(record.mode, 'once');
    assert.equal(record.actsFor, 'anyone');
    assert.equal(record.strangerFactor, 1);
    assert.deepEqual(restoreStored(JSON.parse(JSON.stringify(serializeStored(record)))), record);
    assert.throws(() => restoreStored({...record, schema: 'kernel.stored@future'}), /version/);
    assert.throws(() => make({pulse: 0}), /pulse/);
    assert.throws(() => make({decay: {every: 0, amount: n.decayAmount}}), /decay/);
    assert.throws(() => make({charge: {now: -1, max: n.reservoir, per: n.per}}), /charge/);
    assert.throws(() => make({trigger: {kind: 'quantity', op: '==', value: n.threshold}}), /threshold/);
});

test('charge: absolute decay, partial firing, dormant pattern and free default', () => {
    const record = make({decay: {every: n.decayEvery, amount: n.decayAmount}});
    assert.equal(chargeAt(record, n.decayEvery - n.pulse), n.reservoir);
    assert.equal(chargeAt(record, n.decayEvery), n.reservoir - n.decayAmount);
    assert.equal(chargeAt(record, n.end), n.reservoir - Math.floor(n.end / n.decayEvery) * n.decayAmount);
    const partial = fire(make({charge: {now: n.lowCharge, max: n.reservoir, per: n.per}}));
    assert.equal(partial.receipt.scale, n.half);
    assert.equal(partial.world.holders.room.quantities.temperature, expected.scaledHeat);
    const empty = fire(partial.record, {}, {...engine(), world: partial.world});
    assert.equal(empty.record.status, 'dormant');
    assert.equal(empty.receipt.reason, 'charge');
    assert.ok(empty.receipt.ways.includes('recharge'));
    assert.equal(fire(make({charge: undefined})).receipt.cost, 0);
});

test('authority: both moments receive storer, actor, carrier, trigger and actual minute', () => {
    const calls = [];
    const ports = {authority: request => { calls.push(request); return request.moment === 'store'
        ? {ok: true, reason: 'ink permitted'} : {ok: false, reason: 'keeper objects', costs: [{quantity: 'stock:ink', amount: n.per}], ways: ['feed', 'break']}; }};
    const record = make({}, 'authorized', {ports});
    const out = fire(record, {ports});
    assert.deepEqual(calls.map(c => c.moment), ['store', 'fire']);
    assert.equal(calls[1].by, null);
    assert.equal(calls[1].storer, 'person');
    assert.equal(calls[1].carrier, 'room');
    assert.equal(out.receipt.authority.store.reason, 'ink permitted');
    assert.equal(out.receipt.authority.fire.reason, 'keeper objects');
    assert.deepEqual(out.receipt.ways, ['feed', 'break']);
    assert.deepEqual(out.world, engine().world);
    assert.equal(out.record.charge.now, record.charge.now);
    const denied = make({}, 'denied', {ports: {authority: () => ({ok: false, reason: 'wait'})}});
    assert.equal(denied.status, 'dormant');
    assert.equal(fire(denied, {ports: {authority: () => ({ok: true})}}).receipt.status, 'fired');
});

test('recharge and re-ink pay prices, reset decay anchors and rearm a spent strip', () => {
    const e = at(engine(), n.renewedAt);
    const dormant = fire(make({charge: {now: 0, max: n.reservoir, per: n.per}})).record;
    assert.equal(dormant.status, 'dormant');
    const charged = rechargeStored({...e, record: dormant, at: e.world.clock, by: 'person', amount: n.recharge});
    assert.equal(charged.record.charge.now, n.recharge);
    assert.equal(charged.record.status, 'armed');
    assert.equal(charged.receipt.cost, n.recharge * n.rate);
    assert.equal(charged.world.holders.person.quantities['stock:ink'], n.ink - n.recharge * n.rate);
    assert.equal(charged.record.anchor, n.renewedAt);
    const strip = fire(rowRecords('strip')[0], {stimulus: {kind: 'touch', by: 'person'}});
    const renewed = renewStored({rules: e.rules, world: at({...e, world: strip.world}, n.renewedAt).world,
        record: strip.record, at: n.renewedAt, by: 'person'});
    assert.equal(renewed.record.status, 'armed');
    assert.equal(renewed.receipt.cost, n.renewPrice);
    assert.equal(renewed.world.holders.person.quantities['stock:ink'], n.ink - n.renewPrice);
    const again = fire(renewed.record, {stimulus: {kind: 'touch', by: 'person'}}, {...e, world: renewed.world});
    assert.equal(again.world.holders.room.quantities.temperature, expected.stripRenewedHeat);
    assert.equal(again.world.holders.room.quantities.noise, expected.stripRenewedNoise);
    const poor = edit(e, [{op: 'set', holder: 'person', quantity: 'stock:ink', amount: 0}]);
    assert.equal(renewStored({...poor, record: strip.record, at: poor.world.clock, by: 'person'}).receipt.reason, 'price');
});

test('feed and draw take actual world quantity at the quoted rate', () => {
    const record = make({charge: {now: 0, max: n.reservoir, per: n.per}});
    const fed = fire(record, {stimulus: {by: 'person'}, way: {feed: {from: 'person', quantity: 'stock:ink', rate: n.feedRate}}});
    assert.equal(fed.receipt.cost, n.per * n.feedRate);
    assert.equal(fed.world.holders.person.quantities['stock:ink'], n.ink - n.per * n.feedRate);
    assert.equal(fed.record.charge.now, 0);
    const drawn = fire(make({charge: undefined, draw: {from: 'person', quantity: 'energy:stamina', per: n.per}}));
    assert.equal(drawn.world.holders.person.quantities['energy:stamina'], n.energy - n.per);
});

test('attunement costs a stranger extra and follows the current paper holder', () => {
    const held = make({carrier: 'paper', actsFor: 'holder'});
    const ordinary = fire(held, {stimulus: {by: 'person'}});
    const stranger = fire(held, {stimulus: {by: 'visitor'}});
    assert.equal(ordinary.receipt.cost, n.per);
    assert.equal(stranger.receipt.cost, n.per * n.stranger);
    const changed = edit(engine(), [{op: 'property', holder: 'paper', property: 'holder', value: 'visitor'},
        {op: 'move', holder: 'paper', to: 'yard'}]);
    const transferred = fire({...held, effects: [effect('add', 'vitality', '$holder', n.heal)]}, {stimulus: {by: 'visitor'}}, changed);
    assert.equal(transferred.receipt.cost, n.per);
    assert.equal(transferred.world.holders.visitor.quantities.vitality, n.vitality + n.heal);
    for (const actsFor of ['storer', 'person']) assert.equal(fire(make({actsFor}), {stimulus: {by: 'visitor'}}).receipt.cost, n.per * n.stranger);
});

test('reach names far holders or marks at extra charge, and moving the carrier works locally', () => {
    const spec = {effects: [effect('add', 'heat', 'yard', n.distantAmount)]};
    assert.equal(fire(make(spec)).receipt.reason, 'reach');
    const far = fire(make({...spec, reach: {holders: ['yard'], extra: n.reachCost}}));
    assert.equal(far.receipt.cost, n.per + n.reachCost);
    assert.equal(far.world.holders.yard.quantities.temperature, expected.distantHeat);
    const marked = edit(engine(), [{op: 'property', holder: 'yard', property: 'marks', value: ['beacon']}]);
    assert.equal(fire(make({...spec, reach: {mark: 'beacon', extra: n.reachCost}}), {}, marked).receipt.cost, n.per + n.reachCost);
    const moved = edit(engine(), [{op: 'move', holder: 'paper', to: 'yard'}]);
    assert.equal(fire(make({...spec, carrier: 'paper'}), {}, moved).receipt.cost, n.per);
});

test('key bypass can be bound and released through ordinary world mechanisms', () => {
    const ward = make({keys: ['pass']});
    assert.equal(fire(ward, {stimulus: {by: 'visitor'}}).receipt.status, 'bypassed');
    const bind = {sentence: sentence('bind', 'relation'), details: {target: {shape: 'holder', id: 'person'}, mark: 'pass'}};
    const bound = landEffect(engine().rules, engine().world, bind, {cause: 'forge-key'});
    const bypass = fire(ward, {stimulus: {by: 'person'}}, {...engine(), world: bound.world});
    assert.equal(bypass.receipt.cost ?? 0, 0);
    assert.equal(bypass.record.charge.now, n.reservoir);
    const released = landEffect(engine().rules, bound.world, {...bind, sentence: sentence('release', 'relation')}, {cause: 'release-key'});
    const unkeyed = fire(ward, {stimulus: {by: 'person'}}, {...engine(), world: released.world});
    assert.equal(unkeyed.receipt.status, 'fired');
    assert.equal(unkeyed.receipt.cost, n.per);
});

test('force pays a world price: a weak break wears and fires, a strong break spills on the breaker', () => {
    const e = engine(), record = make({effects: [effect('remove', 'vitality', '$trigger', n.per)]});
    const args = {...e, record, at: n.start, by: 'person', payment: {quantity: 'stock:ink', rate: n.forceRate}};
    const weak = breakStored({...args, force: n.weakForce});
    assert.equal(weak.record.charge.now, n.reservoir - n.weakForce - n.per);
    assert.equal(weak.world.holders.person.quantities['stock:ink'], n.ink - n.weakForce * n.forceRate);
    assert.equal(weak.receipt.broken, false);
    const strong = breakStored({...args, force: n.strongForce});
    assert.equal(strong.record.status, 'broken');
    assert.equal(strong.world.holders.person.quantities.vitality, expected.strongVitality);
    assert.equal(strong.world.holders.person.quantities['stock:ink'], n.ink - n.strongForce * n.forceRate);
    assert.equal(strong.record.charge.now, 0);
    assert.deepEqual(strong.record.effects, record.effects);
});

test('carrier loss, breaking spill and quiet dial are watched without a trigger actor', () => {
    const record = make({carrier: 'paper'});
    const lost = edit(engine(), [{op: 'holder_remove', holder: 'paper'}]);
    assert.equal(settle(lost, [record], n.end).records[0].status, 'lost');
    const broken = edit(engine(), [{op: 'property', holder: 'paper', property: 'broken', value: true}]);
    const spilled = settle(broken, [record], n.end);
    assert.equal(spilled.records[0].status, 'broken');
    assert.equal(spilled.world.holders.room.quantities.temperature, n.initialHeat + n.wardHeat * n.reservoir / n.per);
    const quiet = settle(broken, [{...record, whenCarrierBreaks: 'quiet'}], n.end);
    assert.equal(quiet.world.holders.room.quantities.temperature, n.initialHeat);
    assert.equal(quiet.records[0].status, 'broken');
});

test('quantity edges, pulse dial, absolute time and word stimuli use saved cursors', () => {
    const threshold = {kind: 'quantity', holder: '$carrier', quantity: 'temperature', op: '>=', value: n.initialHeat};
    const edge = settle(engine(), [make({trigger: threshold})], n.end);
    assert.equal(edge.receipts.length, 1);
    const repeated = settle(engine(), [make({trigger: {...threshold, again: 'pulse'}})], n.heldPulse);
    assert.equal(repeated.receipts.length, n.heldPulse / n.pulse);
    const timed = settle(engine(), [make({trigger: {kind: 'time', at: n.reload}})], n.end);
    assert.equal(timed.receipts[0].at, n.reload);
    assert.equal(timed.receipts.length, 1);
    const word = make({trigger: {kind: 'word', word: 'wake'}, mode: 'once'});
    const spoken = settle(engine(), [word], n.end, {stimuli: (_w, _r, clock) => [{kind: 'word', by: 'person', word: clock === n.reload ? 'wake' : 'sleep'}]});
    assert.equal(spoken.receipts[0].at, n.reload);
});

test('immutable inputs and deterministic id order survive duplicate-time settlement', () => {
    const e = engine(), records = [make({}, 'z'), make({}, 'a')];
    freeze(e.world); freeze(records);
    const baseline = JSON.stringify({world: e.world, records});
    const out = settle(e, records, n.pulse);
    assert.deepEqual(out.receipts.map(r => r.authority.fire.ok), [true, true]);
    assert.deepEqual(out.records.map(r => r.id), ['a', 'z']);
    assert.equal(JSON.stringify({world: e.world, records}), baseline);
    const repeat = settle({...e, world: out.world}, out.records, n.pulse);
    assert.deepEqual(repeat.records, out.records);
    assert.deepEqual(repeat.world, out.world);
    assert.deepEqual(repeat.receipts, []);
    assert.throws(() => settle(e, [records[0], records[0]], n.pulse), /duplicate/);
    assert.throws(() => settle(e, records, n.pulse, {authority: () => ({})}), /authority/);
});

test('a resisted effect keeps its world reason and ways, and a wrong spoken stimulus spends nothing', () => {
    const e = engine();
    const shield = landEffect(e.rules, e.world, {sentence: sentence('block', 'heat', 'sustained'),
        details: {target: {shape: 'holder', id: 'room'}, minutes: n.end, params: {verb: 'add', object: 'temperature'}}}, {cause: 'shield'});
    const blocked = fire(make(), {}, {...e, world: shield.world});
    assert.equal(blocked.receipt.status, 'resisted');
    assert.equal(blocked.receipt.reason, 'world-resisted');
    assert.ok(blocked.receipt.ways.includes('reach'));
    assert.ok(blocked.receipt.outcomes[0].outcomes[0].blocked.length);
    assert.equal(blocked.world.holders.room.quantities.temperature, n.initialHeat);
    const word = make({trigger: {kind: 'word', word: 'wake'}});
    const wrong = fire(word, {stimulus: {kind: 'word', word: 'sleep', by: 'person'}});
    assert.equal(wrong.receipt.reason, 'stimulus');
    assert.equal(wrong.record.charge.now, n.reservoir);
});

test('spending preserves the partial decay interval, and recharge resets it at its paid minute', () => {
    const record = make({decay: {every: n.decayEvery, amount: n.decayAmount}});
    const beforeBoundary = at(engine(), n.decayEvery - n.pulse);
    const fired = fire(record, {}, beforeBoundary);
    assert.equal(chargeAt(fired.record, n.decayEvery), n.reservoir - n.per - n.decayAmount);
    const charged = rechargeStored({...beforeBoundary, world: fired.world, record: fired.record,
        at: beforeBoundary.world.clock, by: 'person', amount: n.recharge});
    assert.equal(chargeAt(charged.record, n.decayEvery), n.reservoir);
    assert.equal(chargeAt(charged.record, beforeBoundary.world.clock + n.decayEvery), n.reservoir - n.decayAmount);
});

test('force bypasses a bearer key physically and insufficient payment leaves the pattern intact', () => {
    let e = engine();
    e = edit(e, [{op: 'property', holder: 'person', property: 'marks', value: ['pass']}]);
    const record = make({keys: ['pass'], effects: [effect('remove', 'vitality', '$trigger', n.per)]});
    const args = {...e, record, at: n.start, by: 'person', force: n.strongForce,
        payment: {quantity: 'stock:ink', rate: n.forceRate}};
    const broken = breakStored(args);
    assert.equal(broken.receipt.status, 'fired');
    assert.equal(broken.world.holders.person.quantities.vitality, expected.strongVitality);
    const poor = edit(e, [{op: 'set', holder: 'person', quantity: 'stock:ink', amount: 0}]);
    const resisted = breakStored({...args, world: poor.world});
    assert.equal(resisted.receipt.reason, 'price');
    assert.equal(resisted.record.charge.now, record.charge.now);
    assert.deepEqual(resisted.world, poor.world);
});


test('a target that leaves the world resists with a reason and ways while keeping charge', () => {
    const e = edit(engine(), [{op: 'holder_remove', holder: 'visitor'}]);
    const record = make({effects: [effect('add', 'vitality', 'visitor', n.heal)]});
    const out = fire(record, {}, e);
    assert.equal(out.receipt.status, 'resisted');
    assert.match(out.receipt.reason, /no holder visitor/);
    assert.ok(out.receipt.ways.includes('renew'));
    assert.equal(out.record.charge.now, n.reservoir);
    assert.deepEqual(out.world, e.world);
});

test('a broken pattern is laid again at the renewal price, and a lost carrier names storing again as the way', () => {
    const e = engine();
    const record = make({effects: [effect('remove', 'vitality', '$trigger', n.per)]});
    const broken = breakStored({...e, record, at: n.start, by: 'person', force: n.strongForce,
        payment: {quantity: 'stock:ink', rate: n.forceRate}});
    assert.equal(broken.record.status, 'broken');
    const recharge = rechargeStored({rules: e.rules, world: broken.world, record: broken.record, at: n.start, by: 'person', amount: n.recharge});
    assert.deepEqual([recharge.receipt.status, recharge.receipt.reason, recharge.receipt.ways], ['resisted', 'broken', ['renew']]);
    const inkBefore = broken.world.holders.person.quantities['stock:ink'];
    const relaid = renewStored({rules: e.rules, world: broken.world, record: broken.record, at: n.start, by: 'person'});
    assert.deepEqual([relaid.record.status, relaid.record.charge.now], ['armed', n.reservoir]);
    assert.equal(relaid.world.holders.person.quantities['stock:ink'], inkBefore - n.renewPrice);
    const gone = edit(e, [{op: 'holder_remove', holder: 'paper'}]);
    const strip = make({carrier: 'paper'});
    const lost = renewStored({rules: gone.rules, world: gone.world, record: strip, at: n.start, by: 'person'});
    assert.deepEqual([lost.receipt.reason, lost.receipt.ways], ['lost', ['store-again']]);
});
