import test from 'node:test';
import assert from 'node:assert/strict';
import {engineAdapter} from '../scripts/replay/engine_adapter.mjs';
import {recordRun, replayRun, canonicalJSON, createChooser, registerReplayAdapter, replayAdapter} from '../scripts/replay/replay_core.mjs';
import {ensureStreams, drawUnit, scopedStream, STREAMS} from '../src/seeded_streams.js';

// Advance dominates cost (~100 ms each, mostly fact building), so the suite runs a
// short slice. The 1,000-command gate: REPLAY_COMMANDS=1000 or `cli.mjs check`.
const COMMANDS = Number(process.env.REPLAY_COMMANDS || 40);
const clone = v => JSON.parse(JSON.stringify(v));
const noAmbient = t => t.mock.method(Math, 'random', () => {throw Error('Replay used ambient Math.random');});

test('random-legal engine run records and replays byte-identically, twice', t => {
    noAmbient(t);
    const a = recordRun({adapter: engineAdapter.id, seed: 17, commands: COMMANDS, checkpointEvery: 10});
    const b = recordRun({adapter: engineAdapter.id, seed: 17, commands: COMMANDS, checkpointEvery: 10});
    assert.equal(JSON.stringify(b.recording), JSON.stringify(a.recording), 'same seed must choose the same command log');
    assert.equal(a.recording.commands.length, COMMANDS);
    assert.ok(new Set(a.recording.commands.map(e => e.cmd.k)).size >= 2, 'the log mixes command kinds');
    for(let i = 0; i < 2; i++) {
        const r = replayRun(clone(a.recording));
        assert.equal(r.finalJSON, a.finalJSON);
        assert.equal(r.matches, true);
    }
    const other = recordRun({adapter: engineAdapter.id, seed: 18, commands: 10});
    assert.notEqual(JSON.stringify(other.recording.commands), JSON.stringify(a.recording.commands.slice(0, 10)), 'seeds stay observable');
    t.diagnostic(`commands=${COMMANDS}; sha256=${a.recording.final.sha256}`);
});

test('replay names the first divergent command and rejects foreign recordings', t => {
    noAmbient(t);
    const {recording} = recordRun({adapter: engineAdapter.id, seed: 5, commands: 8, checkpointEvery: 2});
    const late = clone(recording); late.commands[5].at += 1;
    assert.throws(() => replayRun(late), /before command 5/);
    const drift = clone(recording); drift.checkpoints[1].sha256 = '0'.repeat(64);
    assert.throws(() => replayRun(drift), /checkpoint after command 4/);
    const tampered = clone(recording); tampered.save.external.money += 1;
    assert.throws(() => replayRun(tampered), /diverged at checkpoint after command 2/, 'a different starting save cannot claim the recorded result');
    delete tampered.checkpoints;
    assert.equal(replayRun(tampered).matches, false);
    assert.throws(() => replayRun({...recording, version: 99}), /compatible/);
    assert.throws(() => replayRun({...recording, adapter: 'missing'}), /Unknown replay adapter/);
});

test('saves without seeded streams load and replay; streams appear lazily from the save seed', t => {
    noAmbient(t);
    const save = engineAdapter.newSave(23);
    delete save.state.streams; // pre-stream saves never carried the field
    const {recording, finalJSON} = recordRun({adapter: engineAdapter.id, save, seed: 23, commands: 12});
    assert.equal(recording.save.state.streams, undefined);
    assert.equal(replayRun(clone(recording)).finalJSON, finalJSON);
    // Native draws create the same stream root on any two loads of that save.
    const left = engineAdapter.load(clone(save)).state, right = engineAdapter.load(clone(save)).state;
    ensureStreams(left); ensureStreams(right);
    assert.deepEqual(left.streams, right.streams);
    const stream = scopedStream(STREAMS.loot);
    assert.equal(drawUnit(left, stream, 'first'), drawUnit(right, stream, 'first'));
    assert.equal(left.rng, save.state.rng, 'creating streams never moves the legacy engine RNG');
});

test('adapter hook accepts another runner and canonical JSON ignores key order only', () => {
    assert.equal(canonicalJSON({b: [2, 1], a: {d: 1, c: undefined}}), '{"a":{"d":1},"b":[2,1]}');
    const a = createChooser(9), b = createChooser(9);
    assert.deepEqual(Array.from({length: 5}, () => a.unit()), Array.from({length: 5}, () => b.unit()));
    assert.throws(() => registerReplayAdapter({id: 'half'}), /missing newSave/);
    // Minimal stand-in for lane C's headless full-game runner.
    const counter = registerReplayAdapter({id: 'test.counter', newSave: seed => ({clock: 0, total: seed}),
        load: s => s, save: r => r, clock: r => r.clock,
        apply: (r, cmd) => ({clock: r.clock + 1, total: r.total + cmd.n}),
        candidates: (r, choose) => [{cmd: {k: 'add', n: choose.int(1, 9)}}]});
    assert.equal(replayAdapter('test.counter'), counter);
    const run = recordRun({adapter: 'test.counter', seed: 4, commands: 50});
    assert.equal(replayRun(run.recording).finalJSON, run.finalJSON);
});
