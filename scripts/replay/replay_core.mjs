// Whole-run record/replay. A recording is (starting durable save, generator
// seed, ordered command log stamped with the game clock). Replaying it from the
// same save must reproduce the same canonical durable JSON byte for byte.
//
// Runners plug in through adapters, so the expansion engine (engine_adapter.mjs)
// and lane C's headless full-game runner share one recording format:
//   {id, newSave(seed) -> save, load(save) -> run, save(run) -> durable JSON value,
//    clock(run) -> integer game minute, apply(run, cmd) -> run (throws if illegal),
//    candidates(run, choose) -> [{cmd, weight?}] (only needed to record random runs)}
// `run` is opaque to this module. `apply` must not mutate its input run.
import {createHash} from 'node:crypto';
import {hashStreamSeed, xorshift32} from '../../src/seeded_streams.js';

export const REPLAY_FORMAT = 'yairpg.replay';
export const REPLAY_VERSION = 1;
const adapters = new Map();

export function registerReplayAdapter(adapter) {
    for(const key of ['id', 'newSave', 'load', 'save', 'clock', 'apply'])
        if(adapter?.[key] == null) throw Error(`Replay adapter is missing ${key}.`);
    adapters.set(adapter.id, adapter);
    return adapter;
}
export function replayAdapter(id) {
    const adapter = adapters.get(id);
    if(!adapter) throw Error(`Unknown replay adapter: ${id}. Registered: ${[...adapters.keys()].join(', ') || 'none'}.`);
    return adapter;
}

// Sorted keys, arrays kept in order. Undefined members drop exactly as JSON does.
export function canonical(v) {
    if(Array.isArray(v)) return v.map(canonical);
    if(v !== null && typeof v === 'object')
        return Object.fromEntries(Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => [k, canonical(v[k])]));
    return v;
}
export const canonicalJSON = v => JSON.stringify(canonical(v));
export const sha256 = text => createHash('sha256').update(text).digest('hex');

// The recorder's own chooser. It never touches the save's streams, so picking
// commands cannot shift a gameplay draw; only the chosen commands are logged.
export function createChooser(seed) {
    let n = hashStreamSeed(seed >>> 0, 'replay.chooser');
    const unit = () => (n = xorshift32(n)) / 0x100000000;
    return {
        unit,
        int: (lo, hi) => lo + Math.floor(unit() * (hi - lo + 1)),
        pick: list => list[Math.floor(unit() * list.length)],
        weighted(list) {
            const total = list.reduce((a, c) => a + (c.weight ?? 1), 0);
            let r = unit() * total;
            for(const c of list) if((r -= c.weight ?? 1) < 0) return c;
            return list.at(-1);
        },
        sample(list, count) {
            const copy = [...list];
            for(let i = 0; i < Math.min(count, copy.length); i++) {
                const j = i + Math.floor(unit() * (copy.length - i));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy.slice(0, count);
        },
    };
}

const snapshot = (adapter, run) => canonicalJSON(adapter.save(run));

// Record `commands` random-legal commands. A candidate that throws on apply is
// skipped (counted, never logged), so every logged command applied cleanly.
export function recordRun({adapter: id, seed, save, commands = 1000, checkpointEvery = 100, maxRejects = commands * 20}) {
    const adapter = replayAdapter(id);
    if(!adapter.candidates) throw Error(`Adapter ${id} cannot generate commands.`);
    const start = save ?? adapter.newSave(seed);
    const startJSON = canonicalJSON(start);
    let run = adapter.load(JSON.parse(startJSON));
    const choose = createChooser(seed), log = [], checkpoints = [], rejected = {};
    let rejects = 0;
    while(log.length < commands) {
        const options = adapter.candidates(run, choose);
        if(!options.length) throw Error(`No legal command at step ${log.length}.`);
        const {cmd} = choose.weighted(options), at = adapter.clock(run);
        try {
            run = adapter.apply(run, cmd);
        } catch(error) {
            rejected[cmd.k] = (rejected[cmd.k] || 0) + 1;
            if(++rejects > maxRejects) throw Error(`Too many rejected candidates (${rejects}); last: ${error.message}`);
            continue;
        }
        log.push({at, cmd});
        if(checkpointEvery && log.length % checkpointEvery === 0) checkpoints.push({after: log.length, sha256: sha256(snapshot(adapter, run))});
    }
    const finalJSON = snapshot(adapter, run);
    return {
        recording: {format: REPLAY_FORMAT, version: REPLAY_VERSION, adapter: id, seed, save: JSON.parse(startJSON),
            commands: log, checkpoints, final: {sha256: sha256(finalJSON), bytes: finalJSON.length}},
        finalJSON, rejected,
    };
}

export function validateRecording(r) {
    if(r?.format !== REPLAY_FORMAT || r.version !== REPLAY_VERSION) throw Error('Not a compatible replay recording.');
    if(!Array.isArray(r.commands) || r.commands.some(e => !Number.isSafeInteger(e?.at) || typeof e.cmd?.k !== 'string'))
        throw Error('Replay command log is malformed.');
    return r;
}

// Replays a recording. Throws at the first clock-stamp or checkpoint divergence,
// naming the command index, so a failing seed localizes to one step.
export function replayRun(recording) {
    const r = validateRecording(recording), adapter = replayAdapter(r.adapter);
    let run = adapter.load(JSON.parse(canonicalJSON(r.save)));
    const checkpoints = new Map((r.checkpoints || []).map(c => [c.after, c.sha256]));
    r.commands.forEach((entry, i) => {
        const at = adapter.clock(run);
        if(at !== entry.at) throw Error(`Replay diverged before command ${i}: clock ${at}, recorded ${entry.at}.`);
        run = adapter.apply(run, entry.cmd);
        const expected = checkpoints.get(i + 1);
        if(expected && sha256(snapshot(adapter, run)) !== expected) throw Error(`Replay diverged at checkpoint after command ${i + 1}.`);
    });
    const finalJSON = snapshot(adapter, run);
    const matches = sha256(finalJSON) === r.final?.sha256;
    return {finalJSON, sha256: sha256(finalJSON), matches};
}
