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

export function defineAffliction(d) {
    if (!d?.id || !Array.isArray(d.stages) || !d.stages.length) throw Error('An affliction needs an id and at least one stage.');
    if (!Number.isFinite(d.dc)) throw Error(`${d.id}: affliction needs a save DC.`);
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
    const stage = Math.min(def.maxStageOnExposure, degree === 0 ? 2 : 1);
    return {degree, track: {id: def.id, stage: def.onset > 0 ? 0 : stage, pendingStage: stage, since: at, nextAt: at + (def.onset || def.stages[stage - 1].duration), virulentCredit: 0, treatments: []}};
}

// No exposure save: the affliction simply lands at a stage (a botched
// transformation, a curse that cannot be resisted). Onset still applies.
export function afflict(def, {at, stage = 1}) {
    const s = Math.max(1, Math.min(def.stages.length, stage));
    return {id: def.id, stage: def.onset > 0 ? 0 : s, ...(def.onset > 0 ? {pendingStage: s} : {}), since: at,
        nextAt: at + (def.onset || def.stages[s - 1].duration), virulentCredit: 0, treatments: []};
}

// The save at the end of the current stage (or onset). `draw` returns
// {total, natural} for the body's save; `treatment` adds a bonus unless the
// affliction resists that treatment's kind. Returns {track, events}.
export function advance(def, track, {at, draw, treatment = null}) {
    if (!track) return {track: null, events: []};
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
