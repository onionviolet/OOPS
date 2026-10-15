#!/usr/bin/env node
// node scripts/replay/cli.mjs record --seed 17 --commands 1000 [--save save.json] --out run.json
// node scripts/replay/cli.mjs replay run.json [--final final.json]
// node scripts/replay/cli.mjs check --seed 17 --commands 1000 [--out-dir dir]
//   check = record twice + replay the recording twice; every final canonical
//   JSON must match byte for byte. Ambient Math.random throws during all runs.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
import './engine_adapter.mjs';
import {recordRun, replayRun, sha256} from './replay_core.mjs';

const [mode, ...rest] = process.argv.slice(2);
const opt = {};
const positional = [];
for(let i = 0; i < rest.length; i++) {
    if(rest[i].startsWith('--')) opt[rest[i].slice(2)] = rest[++i];
    else positional.push(rest[i]);
}
const adapter = opt.adapter || 'engine.expedition';
const seed = Number(opt.seed ?? 17) >>> 0, commands = Number(opt.commands ?? 1000);
const save = opt.save ? JSON.parse(readFileSync(opt.save, 'utf8')) : undefined;
if(!process.env.REPLAY_ALLOW_AMBIENT_RANDOM) Math.random = () => {throw Error('Replay run used ambient Math.random.');};
const timed = (label, run) => {const t = performance.now(), v = run(); console.error(`${label}: ${Math.round(performance.now() - t)} ms`); return v;};

if(mode === 'record') {
    const {recording, rejected} = timed('record', () => recordRun({adapter, seed, save, commands}));
    writeFileSync(opt.out || 'replay.json', JSON.stringify(recording));
    console.log(JSON.stringify({final: recording.final, rejected}));
} else if(mode === 'replay') {
    const recording = JSON.parse(readFileSync(positional[0], 'utf8'));
    const result = timed('replay', () => replayRun(recording));
    if(opt.final) writeFileSync(opt.final, result.finalJSON);
    console.log(JSON.stringify({sha256: result.sha256, matches: result.matches}));
    process.exitCode = result.matches ? 0 : 1;
} else if(mode === 'check') {
    const a = timed('record A', () => recordRun({adapter, seed, save, commands}));
    const b = timed('record B', () => recordRun({adapter, seed, save, commands}));
    const r1 = timed('replay 1', () => replayRun(JSON.parse(JSON.stringify(a.recording))));
    const r2 = timed('replay 2', () => replayRun(JSON.parse(JSON.stringify(a.recording))));
    const logA = JSON.stringify(a.recording), logB = JSON.stringify(b.recording);
    const kinds = {};
    for(const {cmd} of a.recording.commands) kinds[cmd.k] = (kinds[cmd.k] || 0) + 1;
    const report = {adapter, seed, commands, kinds, rejected: a.rejected, clock: JSON.parse(a.finalJSON).state?.clock,
        recordingsIdentical: logA === logB, finalBytes: a.finalJSON.length,
        finals: [a.finalJSON, b.finalJSON, r1.finalJSON, r2.finalJSON].map(sha256),
        byteIdentical: [b.finalJSON, r1.finalJSON, r2.finalJSON].every(x => x === a.finalJSON)};
    if(opt['out-dir']) {
        mkdirSync(opt['out-dir'], {recursive: true});
        writeFileSync(join(opt['out-dir'], `recording-${seed}.json`), logA);
        writeFileSync(join(opt['out-dir'], `final-${seed}.json`), a.finalJSON);
        writeFileSync(join(opt['out-dir'], `check-${seed}.json`), JSON.stringify(report, null, 2));
    }
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.byteIdentical && report.recordingsIdentical ? 0 : 1;
} else {
    console.error('Usage: cli.mjs record|replay|check (see header).');
    process.exitCode = 2;
}
