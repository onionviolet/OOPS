import test from 'node:test';
import assert from 'node:assert/strict';
import {MEMORY_LIMITS, freshMemory, episode, encodeMemory, decodeMemory, validateMemory, migrateMemory,
    remember, vividness, tellMemory, recallMemory, estimateMemoryBytes, legacyEpisodes, readMemories, createMemoryDomain} from '../src/person_memory.js';

const sample = overrides => ({kind: 'helped', about: 'person.b', fact: 'fact.a', source: 'saw', certainty: 90, feeling: 20, day: 1, ...overrides});
const drawAddress = root => ({root, worldId: 'fixture.world', lifeId: 'fixture.life', gameTime: 14400, eventId: 'fixture.recall'});
const recall = (root, overrides = {}) => recallMemory({holder: 'person.a', memory: episode(sample(), 10),
    cue: {id: 'cue.door', person: true, place: false, topic: false}, period: {day: 10}, day: 10, drawAddress: drawAddress(root), ...overrides});

test('compact records preserve opaque IDs and reject unknown kinds, future days and malformed tuples', () => {
    const e = episode(sample({source: {teller: 'person.c'}}), 10);
    const s = encodeMemory({'person.a': [e]}, 10);
    assert.deepEqual(decodeMemory(JSON.parse(JSON.stringify(s)), 10)['person.a'], [e]);
    assert.throws(() => episode(sample({kind: 'unknown'}), 10), /kind/);
    assert.throws(() => episode(sample({day: 11}), 10), /future/);
    for (const bad of [null, {...s, vividness: 1}, {...s, schema: 2}, {...s, holders: {'person.a': [[0, 999, 0, -1, 90, 20, 1]]}},
        {...s, holders: {'person.a': [[0, 0, 1, -1, 90, 20, 11]]}}, {...s, holders: {'person.a': [[0, 0, 1, -1, 90, 20, 1, 2]]}}]) {
        assert.throws(() => validateMemory(bad, 10));
    }
    assert.deepEqual(migrateMemory(undefined, 10), freshMemory());
    assert.throws(() => migrateMemory(null, 10));
    assert.equal(JSON.stringify(s).includes('vividness'), false);
});

test('fading is derived, feeling and harm slow it; telling retains the fact, date and kind with lower certainty', () => {
    const e = episode(sample(), 1000), harm = episode(sample({kind: 'harmed'}), 1000);
    assert.equal(vividness(e, 1), 1);
    assert.ok(vividness(e, 1000) > 0 && vividness(e, 1000) < vividness(e, 10));
    assert.ok(vividness(harm, 1000) > vividness(e, 1000));
    assert.ok(vividness(episode(sample({feeling: 90}), 1000), 1000) > vividness(e, 1000));
    const told = tellMemory(e, 'person.c', 10);
    assert.equal(told.fact, e.fact); assert.equal(told.day, e.day); assert.equal(told.kind, e.kind);
    assert.deepEqual(told.source, {teller: 'person.c'}); assert.equal(told.certainty, 70);
    assert.equal(tellMemory(told, 'person.d', 10).certainty, 50);
    assert.equal(tellMemory(episode(sample({certainty: 0}), 10), 'person.c', 10).certainty, 0);
    assert.throws(() => tellMemory(e, 'person.c', 10, -1));
});

test('caps retain strong and recent detail and fold discarded detail once per subject within the same cap', () => {
    let s = freshMemory();
    for (let i = 0; i < 100; i++) s = remember(s, 'person.a', sample({fact: `fact.${i}`, day: i, feeling: i === 0 ? 100 : 1}), 100);
    const rows = decodeMemory(s, 100)['person.a'], impressions = rows.filter(e => e.kind === 'impression');
    assert.equal(rows.length, MEMORY_LIMITS.episodes); assert.equal(impressions.length, 1);
    assert.ok(rows.some(e => e.fact === 'fact.0')); assert.ok(rows.some(e => e.fact === 'fact.99'));
    assert.equal(rows.reduce((n, e) => n + e.count, 0), 100);
    assert.equal(impressions[0].fact, null);
    const before = JSON.stringify(s);
    assert.throws(() => remember(s, 'person.a', sample({kind: 'bogus'}), 100)); assert.equal(JSON.stringify(s), before);
    let diverse = freshMemory();
    for (let i = 0; i < 40; i++) diverse = remember(diverse, 'person.a', sample({about: `person.${i}`}), 10);
    diverse = remember(diverse, 'person.a', sample({about: 'person.extra', feeling: 90}), 10);
    const people = decodeMemory(diverse, 10)['person.a'];
    assert.equal(people.length, MEMORY_LIMITS.episodes, 'a 41st acquaintance makes the weakest one forgotten, not a refusal');
    assert.ok(people.some(e => e.about === 'person.extra'));
    assert.equal(people.filter(e => e.kind === 'impression').length, 0, 'the others keep their detail');
    assert.throws(() => encodeMemory(Object.fromEntries(Array.from({length: 301}, (_, i) => [`person.${i}`, []])), 10), /holders/);
});

test('recall rides unchanged checks, scopes keys to holder, memory, cue and period, and uses no mutable draw stream', () => {
    assert.deepEqual(recall(37), recall(37));
    const first = recall(37);
    for (const override of [{holder: 'person.c'}, {cue: {id: 'cue.window', person: true, place: false, topic: false}},
        {period: {day: 11}}, {memory: episode(sample({feeling: 21}), 10)}]) {
        assert.notEqual(recall(37, override).receipt.inputFingerprint, first.receipt.inputFingerprint);
    }
    assert.ok(Array.from({length: 20}, (_, seed) => recall(seed).result.raw !== recall(seed, {period: {day: 11}}).result.raw).some(Boolean));
    const outcomes = Array.from({length: 500}, (_, seed) => recall(seed).result.success);
    const successes = outcomes.filter(Boolean).length;
    assert.ok(successes > 180 && successes < 280, `seed sweep successes ${successes}`);
    assert.equal(recall(37, {cue: {id: 'cue.none', person: false, place: false, topic: false}}).result.success, false);
    // These three fixed roots pin the resolver-backed memory reader, not a second RNG.
    assert.deepEqual([1, 37, 99].map(seed => recall(seed).result.raw), [93, 49, 91]);
});

test('legacy rows remain literal detached reads; canon baseline is empty and all readers leave owners untouched', () => {
    for (const store of ['simulation', 'chronicle', 'household']) {
        const rows = [{id: 'old.a', cause: 'old.cause', at: 1440, text: 'Original literal.'}], before = structuredClone(rows);
        const legacy = legacyEpisodes(rows, {holder: 'person.a', about: 'person.b', store, toDay: at => at / 1440});
        assert.equal(legacy[0].kind, 'legacy-literal'); assert.equal(legacy[0].text, rows[0].text);
        const s = remember(freshMemory(), 'person.a', sample(), 10);
        const read = readMemories(s, 'person.a', 10, {legacy}); assert.equal(read.length, 2);
        read[1].text = 'Changed read'; assert.deepEqual(rows, before); assert.equal(legacy[0].text, rows[0].text);
    }
    assert.deepEqual(readMemories(freshMemory(), 'person.a', 10), []);
});

test('300 holders at the 40 episode cap stay under 500 KB with distinct fact pointers; byte ceiling rejects oversized IDs', t => {
    const holders = Object.create(null);
    for (let h = 0; h < 300; h++) holders[`p${h}`] = Array.from({length: 40}, (_, i) => episode(sample({
        about: `p${(h + i) % 300}`, fact: `f${h * 40 + i}`, source: {teller: `p${(h + 1) % 300}`},
        feeling: -100, certainty: 100, day: 99999}), 99999));
    const s = encodeMemory(holders, 99999), bytes = estimateMemoryBytes(s);
    t.diagnostic(`300 x 40: ${bytes} UTF-8 JSON bytes including dictionary and envelope`);
    assert.ok(bytes < 500000); validateMemory(s, 99999);
    for (const rows of Object.values(holders)) for (const e of rows) e.fact = e.fact.padEnd(96, 'x');
    assert.throws(() => encodeMemory(holders, 99999), /byte budget/);
});

test('domain migration and command failures leave owner state unchanged', () => {
    const domain = createMemoryDomain({day: envelope => envelope.day});
    domain.load(domain.migrate(undefined, {day: 10}));
    domain.commands.remember('person.a', sample(), {day: 10});
    const before = domain.save();
    assert.throws(() => domain.commands.remember('person.a', sample({day: 11}), {day: 10}));
    assert.deepEqual(domain.save(), before); const read = domain.save(); read.ids.push('detached');
    assert.deepEqual(domain.save(), before);
});
