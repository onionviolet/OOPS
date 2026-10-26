// Experiment log and property display (gaps G36, G37). The log is the player's
// own record of trials: which materials, which process, which effects showed.
// `deduce` only elims from that record, so it can never say more than the
// player has seen (audit R3); results are labelled by strength, not truth,
// because a cancel pair or a dose can hide an effect that is really there.
// Pure and plain-JSON; the existing crafting depth owner retains this log.
import {natural as nat} from './basics.js';
import {compareCodePoints} from './gen_kit.js';
import {MATRIX} from './craft_materials.js';

export const LOG_FAMILY = 'craft.experiments@1';
export const MAX_ENTRIES = 100;
const fail = message => { throw new Error(message); };
const uniq = list => [...new Set(list)].sort(compareCodePoints);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.length > 0;
const strings = value => Array.isArray(value) && value.every(text);
const canonical = value => JSON.stringify(value, function(key, entry) {
    return object(entry) ? Object.fromEntries(Object.keys(entry).sort(compareCodePoints).map(k => [k, entry[k]])) : entry;
});
const same = (a, b) => canonical(a) === canonical(b);
function plain(value) {
    if(value === null || typeof value === 'string' || typeof value === 'boolean') return true;
    if(typeof value === 'number') return Number.isFinite(value);
    return Array.isArray(value) ? value.every(plain) : object(value) && Object.values(value).every(plain);
}
const processValid = value => Array.isArray(value) && value.every(row => Array.isArray(row) && row.length === 2 && text(row[0]) && nat(row[1]));

// The host supplies witnessed facts, not the resolver's hidden trace. Native
// keys/lot IDs are references to the existing stock owner, never extra stock.
export function validateTrialSetup(setup) {
    if(!object(setup) || setup.revision !== 1 || !text(setup.law) || !Array.isArray(setup.inputs) || !setup.inputs.length ||
        !setup.inputs.every(i => object(i) && text(i.material) && text(i.key) && nat(i.qty) && i.qty > 0) ||
        !processValid(setup.process) || !object(setup.conditions) || !plain(setup)) fail('Invalid demonstrated setup.');
    return setup;
}
function validateObservation(observation) {
    if(!object(observation) || !text(observation.route) || !strings(observation.confounders ?? []) || !plain(observation) ||
        (observation.recipient !== undefined && observation.recipient !== null && !text(observation.recipient)) ||
        (observation.baseline !== undefined && observation.baseline !== null && !object(observation.baseline))) fail('Invalid trial observation.');
    return observation;
}

// Missing is unknown, including a dimension recorded on just one side. This
// compares observations; an omitted effect is not a measured absence.
export function compareTrialSetups(before, after) {
    if(before !== undefined) validateTrialSetup(before);
    if(after !== undefined) validateTrialSetup(after);
    const changed = [], unknown = [];
    const compare = (field, a, b) => {
        if(a == null || b == null) unknown.push(field);
        else if(!same(a, b)) changed.push({field, before: structuredClone(a), after: structuredClone(b)});
    };
    for(const field of ['law', 'inputs', 'process']) compare(field, before?.[field], after?.[field]);
    for(const field of ['conditions', 'preparation', 'stages']) {
        const a = before?.[field], b = after?.[field];
        if(field !== 'conditions' && a === undefined && b === undefined) continue;
        if(object(a) && object(b)) for(const key of uniq([...Object.keys(a), ...Object.keys(b)])) compare(`${field}.${key}`, a[key], b[key]);
        else compare(field, a, b);
    }
    return {sameKnownSetup: !changed.length && !unknown.length, changed, unknown};
}

export function compareTrials(before, after) {
    const comparison = compareTrialSetups(before.setup, after.setup);
    const changed = [...comparison.changed], unknown = [...comparison.unknown];
    const a = before.observation, b = after.observation;
    if(a !== undefined) validateObservation(a);
    if(b !== undefined) validateObservation(b);
    for(const field of ['route', ...((a?.route === 'oral' || b?.route === 'oral') ? ['recipient', 'baseline'] : [])]) {
        if(a?.[field] == null || b?.[field] == null) unknown.push(`observation.${field}`);
        else if(!same(a[field], b[field])) changed.push({field: `observation.${field}`, before: structuredClone(a[field]), after: structuredClone(b[field])});
    }
    const confounders = uniq([...(a?.confounders ?? []), ...(b?.confounders ?? []),
        ...(a?.route && b?.route && a.route !== b.route ? ['Different observation routes'] : []),
        ...(changed.some(c => ['observation.recipient', 'observation.baseline'].includes(c.field)) ? ['Recipient baseline changed'] : [])]);
    return {...comparison, changed, unknown, confounders,
        observed: {added: (after.seen ?? []).filter(e => !(before.seen ?? []).includes(e)),
            notSeenAgain: (before.seen ?? []).filter(e => !(after.seen ?? []).includes(e))},
        uncertainty: 'Observed differences do not by themselves identify a cause; unmeasured properties and masking may still matter.'};
}

export const createExperimentLog = () => ({family: LOG_FAMILY, entries: []});

// seen: ['route.effect'] the player could observe. Oldest entries drop past the cap.
export function recordTrial(log, {materials, process = [], seen, at, setup, observation}) {
    if(!Array.isArray(materials) || !materials.length || !nat(at)) fail('A trial needs materials and a game minute.');
    const entry = {materials: uniq(materials), process: process.map(([op, level]) => [op, level]), seen: uniq(seen ?? []), at};
    if(setup !== undefined) entry.setup = structuredClone(validateTrialSetup(setup));
    if(observation !== undefined) entry.observation = structuredClone(validateObservation(observation));
    validateEntry(entry);
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
        // Rich records are associations, not a causal estimate across differing
        // doses, instruments or recipient baselines. Keep the historical heuristic
        // readable while explicitly labelling its incomplete setup.
        const rich = [...withM, ...without].some(e => e.setup || e.observation);
        const status = rich ? 'possible' : hits < withM.length ? 'unlikely' : contrasted ? 'likely' : 'possible';
        const limitations = rich ? ['Association only; compare setup and recipient context before attributing an ingredient effect.'] : ['Historical setup and recipient context were not recorded.'];
        rows.push({material, effect, status, withCount: withM.length, hits, withoutCount: without.length, limitations});
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
    for(const e of log.entries) validateEntry(e);
    return log;
}
function validateEntry(e) {
    if(!strings(e?.materials) || !e.materials.length || !strings(e.seen) || !nat(e.at) || !processValid(e.process)) fail('Invalid experiment entry.');
    if(e.setup !== undefined) validateTrialSetup(e.setup);
    if(e.observation !== undefined) validateObservation(e.observation);
}
