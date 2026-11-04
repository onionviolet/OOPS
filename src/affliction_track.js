// Staged afflictions: one world-neutral seam for diseases, poisons, curses and
// festering wounds (AD51 proposal, 2026-11-03). Pure: the caller owns draws,
// clocks, body facts and what a stage's effects mean in its world.
// Shape follows the d20 affliction pattern (exposure save, onset, timed stages,
// a save at each stage's end moving the stage by degree of success). Numbers
// in content are calibration points from the named source (AD49), not law.

export const MINUTE = 1, HOUR = 60, DAY = 1440, WEEK = 7 * DAY;

// Degree of success, d20 style: beat the DC by 10 for a critical, miss by 10
// for a critical failure, and a natural 20 or 1 moves the result one step.
export function degreeOf(total, dc, natural = null) {
    let degree = total >= dc + 10 ? 3 : total >= dc ? 2 : total > dc - 10 ? 1 : 0;
    if (natural === 20) degree = Math.min(3, degree + 1);
    if (natural === 1) degree = Math.max(0, degree - 1);
    return degree; // 0 critical failure, 1 failure, 2 success, 3 critical success
}
export const DEGREE_LABEL = Object.freeze(['critical failure', 'failure', 'success', 'critical success']);

// Default stage movement per degree. A world or affliction can replace it:
// virulent afflictions need two successes to step down (PF2 virulent trait).
const DEFAULT_SHIFT = Object.freeze([2, 1, -1, -2]);

// Exposure routes (PFA1, 2026-11-04): how the agent reaches a body. Injury
// needs a wound; the other three need only the right contact. Barriers work by
// what they physically stop, so a mask stops a cloud and gloves stop a smear.
export const EXPOSURE_ROUTES = Object.freeze(['injury', 'contact', 'ingested', 'inhaled']);

// Timing (PFA2, 2026-11-04). The default 'stages' is the PF2 pattern above.
// The 'frequency' dial is the PF1 pattern: after onset the body saves once per
// `frequency` for up to `checks` checks (Infinity for a disease that never runs
// out). Each failed save applies `effects` again; `cure` consecutive successes
// end it. A world picks per affliction; both run on the same track and clock.
function defineFrequency(d) {
    if (!(d.frequency > 0)) throw Error(`${d.id}: frequency timing needs a frequency interval.`);
    if (!(d.checks > 0)) throw Error(`${d.id}: frequency timing needs checks (a count, or Infinity).`);
    if (!Array.isArray(d.effects) || !d.effects.length) throw Error(`${d.id}: frequency timing needs effects for a failed save.`);
    if (!(Number.isInteger(d.cure) && d.cure >= 1)) throw Error(`${d.id}: frequency timing needs cure, the consecutive successes that end it.`);
    return Object.freeze({kind: 'poison', onset: 0, routes: [], resists: [], ...d, timing: 'frequency', effects: Object.freeze(d.effects.map(e => Object.freeze({...e})))});
}

function checkRoutes(d) {
    for (const r of d.routes ?? []) {
        const via = r.via ?? (r.wound ? 'injury' : null);
        if (!EXPOSURE_ROUTES.includes(via)) throw Error(`${d.id}: a route needs via (${EXPOSURE_ROUTES.join(', ')}) or a wound.`);
    }
}

export function defineAffliction(d) {
    if (!d?.id) throw Error('An affliction needs an id.');
    if (!Number.isFinite(d.dc)) throw Error(`${d.id}: affliction needs a save DC.`);
    checkRoutes(d);
    if (d.timing === 'frequency') return defineFrequency(d);
    if (!Array.isArray(d.stages) || !d.stages.length) throw Error(`${d.id}: an affliction needs at least one stage.`);
    for (const [i, s] of d.stages.entries()) {
        if (!s.terminal && !(s.duration > 0)) throw Error(`${d.id}: stage ${i + 1} needs a duration or terminal: true.`);
    }
    return Object.freeze({kind: 'disease', onset: 0, routes: [], resists: [], virulent: false, shift: DEFAULT_SHIFT, maxStageOnExposure: d.stages.length, ...d,
        stages: Object.freeze(d.stages.map(s => Object.freeze({effects: [], ...s})))});
}

// Exposure: one save. Failure starts at stage 1, critical failure at stage 2,
// either after onset. Success leaves no track. Returns {track|null, degree}.
export function expose(def, {at, total, natural = null, bonus = 0}) {
    const degree = degreeOf(total + bonus, def.dc, natural);
    if (degree >= 2) return {track: null, degree};
    if (def.timing === 'frequency') return {degree, track: frequencyTrack(def, at)};
    const stage = Math.min(def.maxStageOnExposure, degree === 0 ? 2 : 1);
    return {degree, track: {id: def.id, stage: def.onset > 0 ? 0 : stage, pendingStage: stage, since: at, nextAt: at + (def.onset || def.stages[stage - 1].duration), virulentCredit: 0, treatments: []}};
}

// No exposure save: the affliction simply lands at a stage (a botched
// transformation, a curse that cannot be resisted). Onset still applies.
export function afflict(def, {at, stage = 1}) {
    if (def.timing === 'frequency') return frequencyTrack(def, at);
    const s = Math.max(1, Math.min(def.stages.length, stage));
    return {id: def.id, stage: def.onset > 0 ? 0 : s, ...(def.onset > 0 ? {pendingStage: s} : {}), since: at,
        nextAt: at + (def.onset || def.stages[s - 1].duration), virulentCredit: 0, treatments: []};
}

// The save at the end of the current stage (or onset). `draw` returns
// {total, natural} for the body's save; `treatment` adds a bonus unless the
// affliction resists that treatment's kind. Returns {track, events}.
// A failed exposure on the frequency dial: the effects land when onset ends,
// then each check follows. `checksLeft` counts the saves still to come.
function frequencyTrack(def, at) {
    return {id: def.id, timing: 'frequency', onsetPending: def.onset > 0, since: at, nextAt: at + (def.onset || 0),
        checksLeft: def.checks, streak: 0, failures: 0, treatments: []};
}

function advanceFrequency(def, track, {at, draw, treatment}) {
    const t = structuredClone(track), events = [];
    if (t.checksLeft === null) t.checksLeft = Infinity; // structuredClone keeps Infinity; JSON saves turn it into null
    while (t.nextAt <= at) {
        if (t.onsetPending) { // the first dose of effects needs no save
            delete t.onsetPending; t.failures += 1;
            events.push({type: 'onset', effects: def.effects, at: t.nextAt});
            t.nextAt += def.frequency; continue;
        }
        const resisted = treatment && def.resists.includes(treatment.kind);
        const bonus = treatment && !resisted ? treatment.bonus ?? 0 : 0;
        const roll = draw(t), saveAt = t.nextAt;
        const degree = degreeOf(roll.total + bonus, def.dc, roll.natural ?? null);
        if (treatment) t.treatments.push({kind: treatment.kind, resisted: !!resisted, at: saveAt});
        t.checksLeft -= 1;
        if (degree >= 2) {
            t.streak += 1;
            events.push({type: 'save', degree, streak: t.streak, at: saveAt, ...(resisted ? {resisted: treatment.kind} : {})});
            if (t.streak >= def.cure) { events.push({type: 'recovered', at: saveAt}); return {track: null, events}; }
        } else {
            t.streak = 0; t.failures += 1;
            events.push({type: 'save', degree, effects: def.effects, at: saveAt, ...(resisted ? {resisted: treatment.kind} : {})});
        }
        if (t.checksLeft <= 0) { events.push({type: 'expired', at: saveAt}); return {track: null, events}; }
        t.nextAt = saveAt + def.frequency;
    }
    return {track: t, events};
}

export function advance(def, track, {at, draw, treatment = null}) {
    if (!track) return {track: null, events: []};
    if (def.timing === 'frequency') return advanceFrequency(def, track, {at, draw, treatment});
    const t = structuredClone(track), events = [];
    while (t && t.nextAt <= at && !isTerminal(def, t)) {
        if (t.stage === 0) { // onset ends: symptoms begin without a save
            t.stage = t.pendingStage; delete t.pendingStage;
            t.nextAt += def.stages[t.stage - 1].duration;
            events.push({type: 'onset', stage: t.stage, at: t.nextAt - def.stages[t.stage - 1].duration});
            continue;
        }
        const resisted = treatment && def.resists.includes(treatment.kind);
        const bonus = treatment && !resisted ? treatment.bonus ?? 0 : 0;
        const roll = draw(t);
        const degree = degreeOf(roll.total + bonus, def.dc, roll.natural ?? null);
        let shift = def.shift[degree];
        if (def.virulent && shift < 0) { // two successes per step down
            const credit = t.virulentCredit + (degree === 3 ? 2 : 1);
            shift = -Math.floor(credit / 2); t.virulentCredit = credit % 2;
        }
        const from = t.stage, saveAt = t.nextAt;
        t.stage = Math.max(0, Math.min(def.stages.length, from + shift));
        if (treatment) t.treatments.push({kind: treatment.kind, resisted: !!resisted, at: saveAt});
        events.push({type: 'save', degree, from, to: t.stage, at: saveAt, ...(resisted ? {resisted: treatment.kind} : {})});
        if (t.stage === 0) { events.push({type: 'recovered', at: saveAt}); return {track: null, events}; }
        if (isTerminal(def, t)) { events.push({type: 'terminal', stage: t.stage, at: saveAt}); break; }
        t.nextAt = saveAt + def.stages[t.stage - 1].duration;
    }
    return {track: t, events};
}

export const isTerminal = (def, track) => !!track && track.stage > 0 && def.stages[track.stage - 1]?.terminal === true;
export const currentStage = (def, track) => track && track.stage > 0 ? def.stages[track.stage - 1] : null;

// Contamination: a wound plus a dirty source decides which afflictions a hit
// can expose, by how the wound and the source actually work (AD38), not by a
// weapon label. A rusty blade is a dirty puncture; rust itself is incidental.
export function exposuresFor(wound, source, catalogue) {
    if (!wound || !(wound.depth > 0)) return [];
    const carried = new Set(source?.carries ?? []);
    return catalogue.filter(def => def.routes.some(r =>
        r.wound && (r.wound.kinds?.includes(wound.kind) ?? true) && wound.depth >= (r.wound.minDepth ?? 0)
        && (r.carriedBy ? carried.has(r.carriedBy) : true)));
}

// Exposure without a wound (PFA1): a meal, a cloud, a smeared handle. `contact`
// is {via, carries, barriers}; a barrier stops the routes it physically
// blocks ({blocks: ['inhaled']} for a sealed mask). Injury still goes through
// exposuresFor, because it needs the wound's kind and depth.
export function exposuresVia(contact, catalogue) {
    if (!contact || !EXPOSURE_ROUTES.includes(contact.via) || contact.via === 'injury') return [];
    if ((contact.barriers ?? []).some(b => b.blocks?.includes(contact.via))) return [];
    const carried = new Set(contact.carries ?? []);
    return catalogue.filter(def => def.routes.some(r => r.via === contact.via && (r.carriedBy ? carried.has(r.carriedBy) : true)));
}
