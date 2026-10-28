// beatLedger: additive save slice for a beat-resolver run. Unit round-trips run on the real
// domain registry; one HEADLESS (Node DOM, not a browser) test runs the real save, export,
// import and reload paths of the bundled game.
import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {BEAT_LEDGER_SLICE, validateBeatLedger, serializeBeatLedger, restoreBeatLedger, emptyBeatLedger} from '../src/beat_ledger.js';
import {resolveBeats, newBeatState} from '../src/beat_records.js';
import {VILLAGE_BEATS, leadStartFacts} from '../src/world_packs/village_lead_line.js';
import {leadBot} from '../scripts/headless/lead_bot.mjs';

const start = () => newBeatState(leadStartFacts());
const viaJson = v => JSON.parse(JSON.stringify(v));
// Normal form of a resolver state: what JSON keeps (undefined fields dropped).
const canon = s => viaJson({facts: s.facts, done: s.done, day: s.day});
// Mid-window: day 2 resolved, day 3 not yet.
const midWindow = () => resolveBeats(VILLAGE_BEATS, start(), 2).state;
const stored = () => domainRegistry.save({})[BEAT_LEDGER_SLICE];

test('slice absent loads to the empty ledger and writes no key', () => {
    domainRegistry.load({beatLedger: serializeBeatLedger(midWindow())});
    assert.ok(domainRegistry.project(BEAT_LEDGER_SLICE).day > 0);
    domainRegistry.load({});                                    // an old save: no slice
    assert.deepEqual(domainRegistry.project(BEAT_LEDGER_SLICE), emptyBeatLedger());
    assert.equal(stored(), undefined);
    assert.deepEqual(domainRegistry.save({gold: 3}), {gold: 3});
    domainRegistry.initialize();
    assert.deepEqual(domainRegistry.project(BEAT_LEDGER_SLICE), newBeatState());
});

test('a mid-window state round-trips through the registry and JSON, and resolves on identically', () => {
    const mid = midWindow();
    assert.ok(Object.values(mid.done).some(r => r.status === 'carried'), 'fixture has settled beats');
    domainRegistry.load({});
    domainRegistry.command(BEAT_LEDGER_SLICE, 'commit')(mid);
    const slice = viaJson(stored());
    assert.equal(slice.schema, 1);
    domainRegistry.validate({beatLedger: slice});
    domainRegistry.load({beatLedger: slice});
    const restored = domainRegistry.command(BEAT_LEDGER_SLICE, 'state')();
    assert.deepEqual(restored, canon(mid));
    // resolving the rest from the restored state equals an uninterrupted run
    const resumed = resolveBeats(VILLAGE_BEATS, restored, 5), straight = resolveBeats(VILLAGE_BEATS, start(), 5);
    assert.deepEqual(canon(resumed.state), canon(straight.state));
    assert.deepEqual(resumed.results.map(r => [r.beat, r.status]), straight.results.filter(r => r.day > 2).map(r => [r.beat, r.status]));
    assert.deepEqual(resumed.state.facts, straight.state.facts);
});

test('the projection and commands hand out copies, and commit checks before keeping', () => {
    domainRegistry.load({});
    const mid = midWindow();
    domainRegistry.command(BEAT_LEDGER_SLICE, 'commit')(mid);
    domainRegistry.project(BEAT_LEDGER_SLICE).facts.hacked = true;
    domainRegistry.command(BEAT_LEDGER_SLICE, 'state')().done.x = 1;
    assert.deepEqual(domainRegistry.project(BEAT_LEDGER_SLICE), canon(mid));
    assert.throws(() => domainRegistry.command(BEAT_LEDGER_SLICE, 'commit')({facts: {a: NaN}, done: {}, day: 1}), /finite/);
    assert.deepEqual(domainRegistry.project(BEAT_LEDGER_SLICE), canon(mid));   // the failed commit changed nothing
});

test('invalid slices are rejected by the validator and never reach the held ledger', () => {
    const good = serializeBeatLedger(midWindow()), id = Object.keys(good.done)[0];
    const bad = {
        'not an object': [], 'wrong schema': {...good, schema: 2}, 'missing schema': {facts: {}, done: {}, day: 0},
        'unknown field': {...good, extra: 1}, 'negative day': {...good, day: -1}, 'fractional day': {...good, day: 1.5},
        'facts array': {...good, facts: []}, 'proto fact key': {...good, facts: JSON.parse('{"__proto__": 1}')},
        'NaN fact': {...good, facts: {a: NaN}}, 'function fact': {...good, facts: {a: () => 1}},
        'unknown status': {...good, done: {[id]: {...good.done[id], status: 'won'}}},
        'result after the ledger day': {...good, done: {[id]: {...good.done[id], day: good.day + 1}}},
        'causes not a list': {...good, done: {[id]: {...good.done[id], causes: {}}}},
        'extra result field': {...good, done: {[id]: {...good.done[id], loot: 1}}},
    };
    domainRegistry.load({beatLedger: good});
    const held = domainRegistry.project(BEAT_LEDGER_SLICE);
    for (const [why, slice] of Object.entries(bad)) {
        assert.throws(() => validateBeatLedger(slice), Error, why);
        assert.throws(() => domainRegistry.validate({beatLedger: slice}), Error, why);   // load never runs after this throws
    }
    assert.deepEqual(domainRegistry.project(BEAT_LEDGER_SLICE), held);
    assert.throws(() => restoreBeatLedger({...good, day: -1}), Error);
    assert.doesNotThrow(() => validateBeatLedger(undefined));
    assert.doesNotThrow(() => validateBeatLedger(null));
});

test('HEADLESS: the slice survives real save, export, import and reload; absent slice is the empty ledger', async () => {
    const bot = await leadBot(null, {seed: 20261027, wallStart: Date.UTC(2026, 0, 1, 12)});
    try {
        const game = bot.game, hooks = () => globalThis.simulationTestHooks;
        // a fresh game writes no beatLedger key and projects the empty ledger
        assert.equal(Object.hasOwn(game.snapshot(), 'beatLedger'), false);
        assert.deepEqual(hooks().project(BEAT_LEDGER_SLICE), emptyBeatLedger());

        const slice = serializeBeatLedger(midWindow());
        await game.load({...game.snapshot(), beatLedger: slice});
        assert.deepEqual(hooks().project(BEAT_LEDGER_SLICE), restoreBeatLedger(slice));
        assert.deepEqual(game.snapshot().beatLedger, slice);

        const bytes = await game.exportFile();
        await game.importFile(bytes);
        await game.reload();
        assert.deepEqual(game.snapshot().beatLedger, slice);
        const restored = hooks().project(BEAT_LEDGER_SLICE);
        assert.deepEqual(canon(resolveBeats(VILLAGE_BEATS, restored, 5).state), canon(resolveBeats(VILLAGE_BEATS, start(), 5).state));
    } finally { try { bot.close(); } catch {} }
});
