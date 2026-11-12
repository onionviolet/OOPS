// Progression path contract v0 (docs/PROGRESSION_PATH_CONTRACT.md, PRG1-PRG12). Chat R.
// A path row is an ascension path (ascension_paths.js, ASC) plus the tracks that accrue
// toward its crossings, the dials its numbers come from and, per stage, how the step
// opens: by itself when its crossings and gate are met (a skill level), or as a K working
// (kernel_working.js) whose settle reads the holder at the step's time (a sequence drink,
// a rank breakthrough). Gates are GTR descriptors (progression_gates.js). Pure: no world
// names, no save slice of its own; the holder's owner stores the position record (PRG3).
import {check, deepFreeze, natural, object} from './basics.js';
import {definePath, crossingMet} from './ascension_paths.js';
import {defineGate, evaluateGate} from './progression_gates.js';
import {defineWorkingLaw} from './kernel_working.js';
import {attemptBreakthrough} from './breakthrough_trial.js';

export const PROGRESSION_CONTRACT_VERSION = '0.1';
export const POSITION_SCHEMA = 'progression.position@1';
export const THRESHOLD_KINDS = Object.freeze(['count', 'table', 'geometric']);
// Effect kinds R publishes (KW11). Hosts and W reactors match these constants, never free strings.
export const PROGRESSION_EFFECTS = Object.freeze({crossed: 'progression.crossed', spent: 'progression.spent',
    pressure: 'progression.pressure', released: 'progression.released'});

const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.-]*$/.test(v);
const key = v => typeof v === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(v);
const text = v => typeof v === 'string' && v.length > 0;
const amount = v => Number.isFinite(v) && v >= 0;
const cents = v => Math.round(100 * v) / 100;

// PRG4. A threshold is how much of a track reaches level n (n >= 1).
//   count:     one level at `need` (a digestion count)
//   table:     `values[n-1]`, ascending (a hand-tabled ladder)
//   geometric: cumulative `base * (1 - scale^n) / (1 - scale)`, rounded to cents (the upstream skill curve)
export function trackThreshold(track, level) {
    check(natural(level) && level >= 1, 'A threshold is for level 1 or higher.');
    if (level > trackMax(track)) return Infinity;
    if (track.kind === 'count') return track.need;
    if (track.kind === 'table') return track.values[level - 1];
    return cents(track.base * (1 - track.scale ** level) / (1 - track.scale));
}
export const trackMax = track => track.kind === 'count' ? 1 : track.kind === 'table' ? track.values.length : track.max;
// The level a track value has reached. Never reads time: the same value gives the same level (PRG5).
export function trackLevel(track, value) {
    check(amount(value), 'A track value is a non-negative number.');
    let level = 0;
    while (level < trackMax(track) && value >= trackThreshold(track, level + 1)) level++;
    return level;
}
function validateTrack(name, t) {
    check(key(name) && object(t) && THRESHOLD_KINDS.includes(t.kind), `Track ${name} needs a kind of ${THRESHOLD_KINDS.join(', ')}.`);
    if (t.kind === 'count') check(natural(t.need) && t.need > 0, `Track ${name} needs a positive count.`);
    if (t.kind === 'table') check(Array.isArray(t.values) && t.values.length > 0 && t.values.every((v, i) => amount(v) && (i === 0 || v > t.values[i - 1])),
        `Track ${name} needs ascending values.`);
    if (t.kind === 'geometric') check(amount(t.base) && t.base > 0 && Number.isFinite(t.scale) && t.scale > 1 && natural(t.max) && t.max > 0,
        `Track ${name} needs base, scale above 1 and max.`);
    check(t.felt === undefined || (Array.isArray(t.felt) && t.felt.length === 3 && t.felt.every(text)),
        `Track ${name} felt words are [none, some, reached].`);
}

// PRG1, PRG2. A path row. `dials` hold every world number a step reads, each with a reason (AD5).
// steps[stageId] = {open: 'auto' | 'working', gate?: GTR descriptor, supply?: {fact, need: dialName},
//                   attempt?: breakthrough rules (defineTrialRules), gateDials?: {name: value},
//                   rush?: {track, pressure: dialName, residual?: dialName}, conserves?: identity id,
//                   minutes?: dialName | natural, fail?: {reason, felt?}, felt?: text}
export function definePathRow(row) {
    check(object(row) && object(row.path), 'A path row needs a path.');
    const path = definePath(row.path);
    const tracks = row.tracks ?? {};
    check(object(tracks), 'Tracks are a table.');
    for (const [name, t] of Object.entries(tracks)) validateTrack(name, t);
    const dials = row.dials ?? {};
    for (const [name, d] of Object.entries(dials)) check(key(name) && object(d) && amount(d.default) && text(d.reason), `Dial ${name} needs a default and a reason.`);
    const steps = {};
    for (const [stageId, step] of Object.entries(row.steps ?? {})) {
        const index = path.stages.findIndex(s => s.id === stageId);
        check(index > 0, `Step ${stageId} names no stage after the entry of ${path.id}.`);
        check(object(step) && ['auto', 'working'].includes(step.open), `Step ${stageId} opens auto or by a working.`);
        const dialed = v => v === undefined || natural(v) || Object.hasOwn(dials, v);
        check(dialed(step.minutes), `Step ${stageId} minutes must be whole or a dial.`);
        if (step.supply) check(text(step.supply.fact) && Object.hasOwn(dials, step.supply.need), `Step ${stageId} supply needs a fact and a dial.`);
        if (step.supply || step.gate || step.attempt) check(step.fail && text(step.fail.reason), `Step ${stageId} states what failing looks like.`);
        if (step.attempt) check(object(step.attempt) && object(step.attempt.baseRisk) && Object.hasOwn(step.attempt.baseRisk, index), `Step ${stageId} attempt rules need a risk for tier ${index}.`);
        check(step.gateDials === undefined || (object(step.gateDials) && Object.values(step.gateDials).every(amount)), `Step ${stageId} gate dials are numbers.`);
        if (step.rush) check(object(step.rush) && row.tracks?.[step.rush.track]?.kind === 'count' && Object.hasOwn(dials, step.rush.pressure) &&
            (step.rush.residual === undefined || Object.hasOwn(dials, step.rush.residual)), `Step ${stageId} rush needs a count track and pressure dials.`);
        check(step.conserves === undefined || id(step.conserves), `Step ${stageId} conserves an identity id.`);
        steps[stageId] = {...step, gate: step.gate ? defineGate(step.gate) : undefined};
    }
    for (const [i, stage] of path.stages.entries()) if (i > 0) check(Object.hasOwn(steps, stage.id) || stage.crossings.length > 0, `Stage ${stage.id} has no way in.`);
    return deepFreeze({ref: `${path.id}@${row.revision ?? 1}`, revision: row.revision ?? 1, path, tracks: structuredClone(tracks),
        dials: structuredClone(dials), steps, ceiling: row.ceiling ?? path.stages.length - 1});
}
const dialValue = (row, v, dials = {}) => typeof v === 'string' ? (dials[v] ?? row.dials[v].default) : (v ?? 0);

// PRG3. The position record the holder's owner keeps in its own slice.
export function createPosition(row, {position = 0, tracks = {}, since = 0} = {}) {
    return validatePosition(row, {schema: POSITION_SCHEMA, path: row.path.id, revision: row.revision, position, since,
        tracks: Object.fromEntries(Object.keys(row.tracks).map(k => [k, tracks[k] ?? 0]))});
}
export function validatePosition(row, rec) {
    check(object(rec) && rec.schema === POSITION_SCHEMA && rec.path === row.path.id && rec.revision === row.revision, `Not a position on ${row.ref}.`);
    check(natural(rec.position) && rec.position < row.path.stages.length && natural(rec.since), `Invalid position on ${row.ref}.`);
    check(object(rec.tracks) && Object.keys(rec.tracks).every(k => Object.hasOwn(row.tracks, k) && amount(rec.tracks[k])), `Invalid tracks on ${row.ref}.`);
    return rec;
}

// PRG5. Accrual adds to a track. Whole amounts stay whole; fractional ones keep cents, as the
// upstream skill total does, so any split of the same cent-valued gains gives the same total.
// A per-gain cap is the host's policy (levelable_component); its rejected part goes to skill_overflow_domain.
export function accrue(row, rec, track, gain) {
    validatePosition(row, rec);
    check(Object.hasOwn(row.tracks, track) && amount(gain), `Accrue a known track by a non-negative amount.`);
    return {...rec, tracks: {...rec.tracks, [track]: cents(rec.tracks[track] + gain)}};
}

// Facts the path's crossings read: each track's value, `<track>.level`, `<track>.met` (count tracks), plus the caller's.
export function pathFacts(row, rec, facts = {}) {
    const out = {...facts};
    for (const [name, t] of Object.entries(row.tracks)) {
        const value = rec.tracks[name] ?? 0;
        out[name] = value;
        out[`${name}.level`] = trackLevel(t, value);
        if (t.kind === 'count') out[`${name}.met`] = value >= t.need;
    }
    return out;
}
// PRG10. What the holder feels of a track: [none, some, reached] words when the track has them, else null.
export function trackFelt(row, rec, name) {
    const t = row.tracks[name];
    if (!t?.felt) return null;
    const value = rec.tracks[name] ?? 0;
    return t.felt[trackLevel(t, value) >= 1 ? 2 : value > 0 ? 1 : 0];
}

// PRG6. A pure read of the next step: crossings (ASC), gate (GTR10 knowledge filter), supply and the ceiling.
export function stepQuote(row, rec, facts = {}, {dials = {}, knows = () => false} = {}) {
    validatePosition(row, rec);
    const next = rec.position + 1;
    if (next >= row.path.stages.length || next > row.ceiling) return {ready: false, capped: true, from: rec.position, to: null};
    const stage = row.path.stages[next], step = row.steps[stage.id], all = pathFacts(row, rec, facts);
    // PRG14. A rush step does not require its track: crossings that read it stay listed but do not block admission.
    const rushFacts = step?.rush ? new Set([step.rush.track, `${step.rush.track}.met`, `${step.rush.track}.level`]) : new Set();
    const crossings = stage.crossings.map(c => ({id: c.id, type: c.type, met: crossingMet(c, all), ...(rushFacts.has(c.fact) ? {rushable: true} : {})}));
    const gate = step?.gate ? evaluateGate(step.gate, all, {dials: {...(step.gateDials ?? {}), ...dials}, knows}) : null;
    const supply = step?.supply ? {fact: step.supply.fact, have: all[step.supply.fact] ?? 0, need: dialValue(row, step.supply.need, dials)} : null;
    if (supply) supply.met = amount(supply.have) && supply.have >= supply.need;
    const admitted = crossings.every(c => c.met || c.rushable) && (!gate || gate.met);
    const pressure = step?.rush ? rushPressure(row, rec, step.rush, dials) : null;
    return {from: rec.position, to: next, stage: stage.id, open: step?.open ?? 'auto', crossings, gate, supply, admitted, attempt: !!step?.attempt, pressure,
        ready: admitted && (!supply || supply.met), minutes: dialValue(row, step?.minutes, dials), capped: false};
}

// PRG14. Undigested power: crossing with a count track short of its need leaves pressure in proportion to what
// was missing (ceil of the pressure dial times the missing share); a fully worked track leaves the residual dial.
// The amount is published for A's madness read and L's body; R never applies it.
function rushPressure(row, rec, rush, dials) {
    const t = row.tracks[rush.track], have = Math.min(rec.tracks[rush.track] ?? 0, t.need), missing = t.need - have;
    const amount = missing > 0 ? Math.ceil(dialValue(row, rush.pressure, dials) * missing / t.need) : dialValue(row, rush.residual, dials);
    return {track: rush.track, missing, amount, cause: missing > 0 ? 'undigested' : 'residual'};
}

// PRG7. Crossing one step. Admission is crossings plus gate; a supply step then needs its supply.
// A failed supply spends what was pressed and keeps the position (the attempt happened); a refused admission spends nothing.
// PRG13. An `attempt` step rolls through breakthrough_trial with the stage index as its tier. The caller passes
// `attempt: {roll, units, state, stability, scar}`: the roll comes from the caller's draw (a K step
// address under GR1-GR17, or the host's own RNG) and `state` is the holder's trial state, which the result returns
// updated for the holder's owner to keep. A failed roll keeps the position; what it cost is in `trial`.
export function crossStep(row, rec, facts = {}, {dials = {}, holder = null, at = rec.since, attempt} = {}) {
    const q = stepQuote(row, rec, facts, {dials});
    if (q.capped) return {ok: false, reason: 'Nothing further is offered on this path here.', record: rec, effects: []};
    const stage = row.path.stages[q.to], step = row.steps[stage.id] ?? {};
    if (!q.admitted) return {ok: false, reason: step.fail?.reason || 'Something is still missing.', record: rec, effects: [], refused: true};
    const spend = (fact, n) => n > 0 ? [{kind: PROGRESSION_EFFECTS.spent, holder, path: row.path.id, stage: stage.id, fact, amount: n}] : [];
    if (q.supply && !q.supply.met) return {ok: false, reason: step.fail.reason, record: rec,
        effects: spend(q.supply.fact, q.supply.have), observed: {felt: step.fail.felt ?? null}};
    let trial = null;
    if (step.attempt) {
        check(object(attempt) && object(attempt.state), `Step ${stage.id} needs an attempt with a roll and the holder's trial state.`);
        const {roll, units = 0, state, stability = 0, scar = 0} = attempt;
        trial = attemptBreakthrough(step.attempt, state, {tier: q.to, roll, progress: 0, units, stability, scar});
        if (!trial.passed) return {ok: false, reason: step.fail.reason, record: rec, effects: [], trial, observed: {felt: step.fail.felt ?? null}};
    }
    const record = {...rec, position: q.to, since: at};
    const pressed = q.pressure && q.pressure.amount > 0 ? [{kind: PROGRESSION_EFFECTS.pressure, holder, path: row.path.id, stage: stage.id, ...q.pressure}] : [];
    return {ok: true, record, trial, observed: {felt: q.pressure?.missing > 0 ? (step.rush.felt ?? step.felt ?? null) : step.felt ?? null, stage: stage.label},
        effects: [...(q.supply ? spend(q.supply.fact, q.supply.need) : []),
            {kind: PROGRESSION_EFFECTS.crossed, holder, path: row.path.id, from: rec.position, to: q.to, stage: stage.id,
                grants: [...stage.grants], position: record, ...(step.conserves ? {conserves: step.conserves} : {})}, ...pressed]};
}

// PRG15. Conserved power (a world law, LR3 in Lord of the Mysteries): what a holder took in at `conserves` steps is a
// thing with an identity, never destroyed. The highest one holds the lower ones (folding). At the holder's death R
// publishes it for W to place, as one identity that contains the rest; W's conservation law and M's claims take over.
export function heldConserved(row, rec) {
    validatePosition(row, rec);
    return row.path.stages.slice(1, rec.position + 1).map(s => row.steps[s.id]?.conserves).filter(Boolean);
}
export function releaseConserved(row, rec, {holder = null, at = rec.since, place = null} = {}) {
    const held = heldConserved(row, rec);
    if (!held.length) return [];
    return [{kind: PROGRESSION_EFFECTS.released, holder, path: row.path.id, at, place, identity: held.at(-1), contains: held.slice(0, -1)}];
}
// Auto steps open as soon as they are met (a skill level); stops at the first working step or unmet one.
export function openAutoSteps(row, rec, facts = {}, options = {}) {
    let current = rec, effects = [];
    for (;;) {
        const q = stepQuote(row, current, facts, options);
        if (!q.ready || q.open !== 'auto') return {record: current, effects};
        const r = crossStep(row, current, facts, options);
        current = r.record; effects = [...effects, ...r.effects];
    }
}

// PRG8. A crossing as a K working. K fixes one kind per role, so there is one law per holder kind;
// rows are looked up by path id. The settle rereads the holder at the step time (KW3):
// holder = {kind, id, positions: {[pathId]: record}, facts: {...}} from the host's reader.
export function progressionLaw({kind, rows, dials = {}}) {
    check(id(kind) && Array.isArray(rows) && rows.length > 0, 'A progression law needs a holder kind and rows.');
    const byPath = new Map(rows.map(r => [r.path.id, r]));
    return defineWorkingLaw({id: `r.progression.${kind}`, revision: 1, operations: {cross: {roles: {holder: kind}, settle({bound, options, at}) {
        const row = byPath.get(options.path);
        if (!row) return {ok: false, reason: 'This path is not known here.'};
        const holder = bound.holder, rec = holder.positions?.[row.path.id];
        if (!rec) return {ok: false, reason: 'There is no footing on this path yet.'};
        if (options.to !== undefined && rec.position + 1 !== options.to) return {ok: false, reason: 'The step this was begun for is no longer the next one.'};
        const r = crossStep(row, rec, holder.facts ?? {}, {dials: dials[row.path.id] ?? {}, holder: holder.id, at});
        return r.ok ? {ok: true, effects: r.effects, observed: r.observed}
            : r.refused ? {ok: false, reason: r.reason} : {ok: true, effects: r.effects, facts: {failed: r.reason}, observed: r.observed};
    }}}});
}
export function crossingMethod(law, row, {kind, to, minutes = 0}) {
    return {id: `r.cross.${row.path.id}.${row.path.stages[to].id}`, revision: 1, law: law.ref, roles: {holder: kind},
        steps: [{op: 'cross', bindings: {holder: 'holder'}, minutes, options: {path: row.path.id, to}}]};
}
