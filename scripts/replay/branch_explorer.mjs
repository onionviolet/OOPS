// Branch explorer: from one save, run the same decision many ways and tabulate what changed.
// Built on the replay adapters (apply() is non-mutating), the keyed seeded streams and the
// scenario facade's semanticDelta. Never writes the input save; every branch works on a copy.
//
//   const report = exploreBranches({adapter:'engine.expedition', save, prefix:[...cmds],
//       branch:{kind:'choices'}, seeds:[1,2,3,4], variants:[{label:'base'}, statVariant('...', 5)],
//       follow:[{k:'advance', minutes:1440}]});
//   console.log(formatReport(report));
//
// branch: {kind:'choices', filter?}  every legal command the adapter offers (default: event and
//                                    encounter responses; pass filter to widen), one branch each
//         {kind:'choices', eventId}  only the responses of one event
//         {kind:'command', cmd}      one command
//         {kind:'list', cmds}        explicit commands
// seeds:  null (keep the save's streams) or integers. A seed replaces state.rng and resets the
//         keyed streams (createStreams), so it is "fate differs from here on".
// variants: [{label, edit(saveCopy)}]; statVariant(path, value) builds one that sets a JSON path.
import './engine_adapter.mjs';
import {replayAdapter, canonicalJSON, sha256, createChooser} from './replay_core.mjs';
import {createStreams} from '../../src/seeded_streams.js';
import {semanticDelta} from '../../src/scenario_facade.js';

export const statVariant = (path, value, label = `${path}=${value}`) => ({label, edit(save) {
    const keys = path.split('.'), last = keys.pop();
    let at = save;
    for(const k of keys) at = at[k] ??= {};
    at[last] = value;
}});

const DEFAULT_CHOICE_KINDS = ['respond', 'answer'];

// Flat, comparable facts about a run. Numbers get a distribution, everything else a tally.
export function defaultMetrics(save, before = save) {
    const out = {clock: save.state?.clock ?? null, money: save.external?.money ?? null};
    const p = save.gameplay?.player ?? {};
    for(const [k, v] of Object.entries(p.skills ?? {})) out[`skill.${k}.xp`] = v.xp;
    for(const [k, v] of Object.entries(p.reputation ?? {})) out[`rep.${k}`] = v;
    for(const [k, v] of Object.entries(p.inventory ?? {})) out[`inv.${k}`] = v;
    for(const [k, v] of Object.entries(save.vitals?.player ?? {})) if(typeof v === 'number') out[`vital.${k}`] = v;
    const sim = save.state?.simulation;
    if(sim) {
        out['events.open'] = Object.values(sim.events ?? {}).filter(e => e.status === 'open').length;
        // Only events that were open at the branch point: later arrivals are noise, not outcomes of the choice.
        for(const [id, e] of Object.entries(before.state?.simulation?.events ?? {})) if(e.status === 'open') out[`event.${id}`] = sim.events?.[id]?.status ?? 'absent';
    }
    return out;
}
// Canon beats: authored ids that mark story position. Hook: options.beats(save) -> string[].
// Default is a name match over player/campaign facts and completed ids; the full game's beat
// ledger lives in the native save, so a native adapter should pass its own reader.
export function defaultBeats(save) {
    const ids = new Set();
    const s = save.state ?? {};
    for(const dom of [s.campaign, s.journey, s.actors?.player]) {
        for(const [k, v] of Object.entries(dom?.facts ?? {})) if(/beat|\.pull\.|canon/.test(k) && v) ids.add(`fact:${k}`);
        for(const k of Object.keys(dom?.completed ?? {})) ids.add(`done:${k}`);
    }
    return [...ids].sort();
}

// Outcome identity ignores the generator's own bookkeeping (seed, stream cells, draw log), so two
// seeds that led to the same world count as one outcome.
function outcomeHash(save) {
    const copy = JSON.parse(canonicalJSON(save));
    if(copy.state) {delete copy.state.rng; delete copy.state.streams;}
    return sha256(canonicalJSON(copy)).slice(0, 12);
}
function applySeed(save, seed) {
    if(seed == null) return;
    const s = save.state;
    s.rng = seed >>> 0 || 1;
    s.streams = createStreams(s.rng);
}

function summarizeDelta(before, after, limit) {
    const rows = semanticDelta(before, after).map(d => d.path.split('/').slice(1, 5).join('/'));
    const counts = new Map();
    for(const p of rows) counts.set(p, (counts.get(p) || 0) + 1);
    return {changedPaths: rows.length, top: [...counts].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, limit).map(([path, n]) => ({path, n}))};
}

export function exploreBranches({adapter: adapterId = 'engine.expedition', save, prefix = [], branch = {kind: 'choices'}, seeds = [null],
    variants = [{label: 'base'}], follow = [], metrics = defaultMetrics, beats = defaultBeats, topPaths = 8, maxBranches = 5000} = {}) {
    if(!save) throw Error('exploreBranches needs a save.');
    const adapter = replayAdapter(adapterId);
    const inputHash = sha256(canonicalJSON(save));
    const fresh = (variant, seed) => {
        const copy = JSON.parse(canonicalJSON(save));
        applySeed(copy, seed);
        variant.edit?.(copy);
        return adapter.load(copy);
    };
    const rows = [];
    let skipped = 0;
    for(const variant of variants) for(const seed of seeds) {
        // Prefix first, then enumerate choices at the branch point so they match this variant and seed.
        let base;
        try {base = prefix.reduce((run, cmd) => adapter.apply(run, cmd), fresh(variant, seed));}
        catch(error) {rows.push({variant: variant.label, seed, choice: '(prefix)', status: 'prefix-rejected', error: error.message}); continue;}
        let cmds;
        if(branch.kind === 'command') cmds = [branch.cmd];
        else if(branch.kind === 'list') cmds = branch.cmds;
        else if(branch.kind === 'choices') {
            const filter = branch.filter ?? (c => DEFAULT_CHOICE_KINDS.includes(c.cmd.k) && (!branch.eventId || c.cmd.eventId === branch.eventId));
            cmds = adapter.candidates(base, createChooser(1)).filter(filter).map(c => c.cmd);
        } else throw Error(`Unknown branch kind ${branch.kind}.`);
        const beforeSave = adapter.save(base);
        for(const cmd of cmds) {
            if(rows.length >= maxBranches) throw Error(`More than ${maxBranches} branches; narrow the seeds, variants or choices.`);
            const row = {variant: variant.label, seed, choice: canonicalJSON(cmd)};
            try {
                const run = [cmd, ...follow].reduce((r, c) => adapter.apply(r, c), base);
                const afterSave = adapter.save(run);
                const b0 = new Set(beats(beforeSave)), b1 = beats(afterSave);
                Object.assign(row, {status: 'applied', metrics: metrics(afterSave, beforeSave), delta: summarizeDelta(beforeSave, afterSave, topPaths),
                    beatsAdded: b1.filter(b => !b0.has(b)), beatsRemoved: [...b0].filter(b => !b1.includes(b)), finalHash: outcomeHash(afterSave)});
            } catch(error) {row.status = 'rejected'; row.error = error.message; skipped++;}
            rows.push(row);
        }
    }
    const applied = rows.filter(r => r.status === 'applied');
    return {adapter: adapterId, branches: rows.length, applied: applied.length, rejected: skipped,
        inputUnchanged: sha256(canonicalJSON(save)) === inputHash, inputHash: inputHash.slice(0, 12),
        distribution: distribution(applied), drivers: drivers(applied), beats: beatTable(applied),
        distinctOutcomes: new Set(applied.map(r => r.finalHash)).size, rows};
}

const num = v => typeof v === 'number' && Number.isFinite(v);
function distribution(rows) {
    const keys = [...new Set(rows.flatMap(r => Object.keys(r.metrics)))].sort();
    const out = {};
    for(const k of keys) {
        const vals = rows.map(r => r.metrics[k]);
        if(vals.every(v => v === undefined || num(v))) {
            const xs = vals.map(v => v ?? 0).sort((a, b) => a - b);
            if(xs[0] === xs.at(-1)) continue; // constant across branches: not an outcome
            out[k] = {kind: 'number', min: xs[0], median: xs[Math.floor(xs.length / 2)], max: xs.at(-1), mean: +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(3), n: xs.length};
        } else {
            const tally = {};
            for(const v of vals) tally[String(v)] = (tally[String(v)] || 0) + 1;
            if(Object.keys(tally).length > 1) out[k] = {kind: 'tally', tally};
        }
    }
    return out;
}
// For each varying metric: does it change when only that axis changes? (all else held equal)
function drivers(rows) {
    const axes = {choice: r => r.choice, seed: r => String(r.seed), variant: r => r.variant};
    const out = {};
    for(const k of Object.keys(distribution(rows))) {
        out[k] = Object.fromEntries(Object.entries(axes).map(([axis, key]) => {
            const others = Object.keys(axes).filter(a => a !== axis);
            const groups = new Map();
            for(const r of rows) {
                const g = others.map(a => axes[a](r)).join('|');
                if(!groups.has(g)) groups.set(g, new Set());
                groups.get(g).add(JSON.stringify(r.metrics[k]));
            }
            return [axis, [...groups.values()].some(s => s.size > 1)];
        }));
    }
    return out;
}
function beatTable(rows) {
    const t = {};
    for(const r of rows) {
        for(const b of r.beatsAdded) (t[b] ??= {added: 0, removed: 0}).added++;
        for(const b of r.beatsRemoved) (t[b] ??= {added: 0, removed: 0}).removed++;
    }
    return t;
}

export function formatReport(report) {
    const L = [`branches ${report.branches} (applied ${report.applied}, rejected ${report.rejected}), distinct outcomes ${report.distinctOutcomes}, input save unchanged: ${report.inputUnchanged}`];
    L.push('', 'metric | outcome spread | driven by');
    for(const [k, d] of Object.entries(report.distribution)) {
        const spread = d.kind === 'number' ? `${d.min}..${d.max} (median ${d.median}, mean ${d.mean})`
            : Object.entries(d.tally).map(([v, n]) => `${v}×${n}`).join(', ');
        L.push(`${k} | ${spread} | ${Object.entries(report.drivers[k]).filter(([, v]) => v).map(([a]) => a).join('+') || 'none'}`);
    }
    const beats = Object.entries(report.beats);
    L.push('', beats.length ? 'beats moved: ' + beats.map(([b, c]) => `${b} (+${c.added}/-${c.removed})`).join('; ') : 'beats moved: none');
    return L.join('\n');
}
