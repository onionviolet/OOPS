// Experiment log and property display (gaps G36, G37). The log is the player's
// own record of trials: which materials, which process, which effects showed.
// `deduce` only elims from that record, so it can never say more than the
// player has seen (audit R3); results are labelled by strength, not truth,
// because a cancel pair or a dose can hide an effect that is really there.
// Pure and plain-JSON. Not wired into live gameplay yet.
import {natural as nat} from './basics.js';
import {compareCodePoints} from './gen_kit.js';
import {MATRIX} from './craft_materials.js';

export const LOG_FAMILY = 'craft.experiments@1';
export const MAX_ENTRIES = 100;
const fail = message => { throw new Error(message); };
const uniq = list => [...new Set(list)].sort(compareCodePoints);

export const createExperimentLog = () => ({family: LOG_FAMILY, entries: []});

// seen: ['route.effect'] the player could observe. Oldest entries drop past the cap.
export function recordTrial(log, {materials, process = [], seen, at}) {
    if(!Array.isArray(materials) || !materials.length || !nat(at)) fail('A trial needs materials and a game minute.');
    const entry = {materials: uniq(materials), process: process.map(([op, level]) => [op, level]), seen: uniq(seen ?? []), at};
    return {...log, entries: [...log.entries, entry].slice(-MAX_ENTRIES)};
}

// status: 'likely' (every trial with it showed the effect and a trial without it did not),
// 'possible' (always seen, but never contrasted), 'unlikely' (a trial with it lacked the effect; masking is still possible).
export function deduce(log) {
    const mats = uniq(log.entries.flatMap(e => e.materials)), effects = uniq(log.entries.flatMap(e => e.seen));
    const rows = [];
    for(const material of mats) for(const effect of effects) {
        const withM = log.entries.filter(e => e.materials.includes(material)), without = log.entries.filter(e => !e.materials.includes(material));
        const hits = withM.filter(e => e.seen.includes(effect)).length;
        if(!hits) continue;
        const contrasted = without.some(e => !e.seen.includes(effect));
        const status = hits < withM.length ? 'unlikely' : contrasted ? 'likely' : 'possible';
        rows.push({material, effect, status, withCount: withM.length, hits, withoutCount: without.length});
    }
    const rank = {likely: 0, possible: 1, unlikely: 2};
    return rows.sort((a, b) => rank[a.status] - rank[b.status] || compareCodePoints(a.material, b.material) || compareCodePoints(a.effect, b.effect));
}

// Per visible axis: 'known' with value, 'known-none' (tested, nothing there) or 'unknown'.
// Hidden axes are not listed at all. facts: ['axis:x'] value seen, ['none:x'] seen absent.
export function propertyView(catalogue, material, facts) {
    const known = new Set(facts);
    return Object.values(catalogue.axes).filter(a => !a.hidden && a.id !== MATRIX)
        .map(axis => {
            const value = material.properties[axis.id] ?? 0;
            if(known.has(`axis:${axis.id}`)) return value ? {axis: axis.id, label: axis.label, state: 'known', value} : {axis: axis.id, label: axis.label, state: 'known-none'};
            if(known.has(`none:${axis.id}`)) return {axis: axis.id, label: axis.label, state: 'known-none'};
            return {axis: axis.id, label: axis.label, state: 'unknown'};
        });
}

export function validateExperimentLog(log) {
    if(log?.family !== LOG_FAMILY || !Array.isArray(log.entries) || log.entries.length > MAX_ENTRIES) fail('Unsupported experiment log.');
    for(const e of log.entries) if(!Array.isArray(e.materials) || !e.materials.length || !Array.isArray(e.seen) || !nat(e.at)) fail('Invalid experiment entry.');
    return log;
}
