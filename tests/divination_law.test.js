import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceEngineWorld, createEngineWorld, engineReceipts, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {recordsOf} from '../src/knowledge_record.js';
import {runCase} from '../scripts/coverage_report.mjs';
import {DIVINATION_CASE_MODULE, DIVINATION_DIALS, DIVINATION_LAW, canRunDivination,
    divinationBlocker, divinationCaseId, divinationMethod} from '../src/divination_law.js';

const config = {packs: ['n.knowledge'], shared: {quantities: [{id: 'energy', unit: 'unit', min: 0,
    max: 100, keyed: true, askedBy: ['test']}], properties: [{id: 'reading_signal', type: 'label', askedBy: ['test']}]},
    host: {laws: [DIVINATION_LAW]}};
const fresh = (signal = 'warning') => createEngineWorld({...config, holders: [
    {id: 'room', kind: 'place'},
    {id: 'reader', kind: 'body', place: 'room', quantities: {[DIVINATION_DIALS.quantity]: 2}},
    {id: 'subject', kind: 'thing', place: 'room', properties: signal == null ? {} : {reading_signal: signal}},
]});
const start = (engine, opts = {}) => startEngineWorking(engine, {law: DIVINATION_LAW, id: 'reading',
    method: divinationMethod({id: 'reading.warning', ...opts}),
    bindings: {reader: {kind: 'body', id: 'reader'}, subject: {kind: 'thing', id: 'subject'}}});
const advance = engine => {
    const run = advanceEngineWorld(engine, 1);
    assert.equal(run.pending, false);
    return run.engine;
};
const save = engine => JSON.parse(JSON.stringify(serializeEngineWorld(engine)));

test('a paid reading produces observer knowledge with a stated reliability', () => {
    const engine = advance(start(fresh()));
    const record = recordsOf(engine.world, 'reader')['reading.warning'];
    assert.equal(record.believed.value, 'warning');
    assert.equal(record.source.kind, 'observation');
    assert.deepEqual(record.doubts, []);
    assert.equal(engine.world.holders.reader.quantities[DIVINATION_DIALS.quantity], 1);
    assert.deepEqual(engineReceipts(engine).at(-1).observed, {status: 'signal', reliability: 'supported', record: 'reading.warning'});
});

test('uncertain and unanswered readings keep their reliability and cost; save restores the in-flight working', () => {
    const pending = start(fresh('omen'), {reliability: 'uncertain'});
    const restored = restoreEngineWorld(save(pending), config);
    assert.deepEqual(save(advance(restored)), save(advance(pending)));
    assert.deepEqual(recordsOf(advance(pending).world, 'reader')['reading.warning'].doubts, ['uncertain']);
    const unanswered = advance(start(fresh(null)));
    assert.equal(recordsOf(unanswered.world, 'reader')['reading.warning'], undefined);
    assert.equal(unanswered.world.holders.reader.quantities[DIVINATION_DIALS.quantity], 1);
    assert.equal(engineReceipts(unanswered).at(-1).observed.status, 'unanswered');
});

test('only stated information readings enter this law', async () => {
    const sentence = {verb: 'sense', object: 'information', target: 'self', time: 'instant'};
    assert.equal(canRunDivination(sentence), true);
    assert.equal(canRunDivination({...sentence, verb: 'conceal'}), false);
    assert.match(divinationBlocker({...sentence, object: 'mind'}), /not a reading/);
    assert.throws(() => divinationMethod({id: 'bad', reliability: 'certain'}), /reliability/);
    const id = divinationCaseId(sentence);
    const row = {id, case: {module: DIVINATION_CASE_MODULE, id}};
    const result = await runCase(row, {reachable: new Set()});
    // Wave 23 fold: the runner knows the divination family (scripts/case_runner.mjs), so a stated reading expresses.
    assert.equal(result.state, 'expressed-authored');
});
