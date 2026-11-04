// Condition ladders (PFA5, AFW10/AFW-L4 proposal, 2026-11-04): conditions that
// worsen in rungs. A second fear on a shaken body makes it frightened; more
// fatigue on a fatigued body exhausts it. Pure: the caller owns what each rung
// does in its world. Calibration: Pathfinder 1e fear, fatigue and sickness
// (OGL) and the D&D SRD 5.2.1 exhaustion levels (CC-BY-4.0), paraphrased;
// worlds choose their own rungs (AD49).

export function defineLadder(l) {
    if (!l?.id || !Array.isArray(l.rungs) || l.rungs.length < 2) throw Error('A ladder needs an id and at least two rungs.');
    if (new Set(l.rungs).size !== l.rungs.length) throw Error(`${l.id}: rungs must be distinct.`);
    // stacks: a repeat of the same source steps up (PF1 fear); false means a repeat only refreshes it.
    return Object.freeze({stacks: true, ...l, rungs: Object.freeze([...l.rungs])});
}

// rungIndex: -1 when the body is not on the ladder at all.
export const rungIndex = (ladder, rung) => rung == null ? -1 : ladder.rungs.indexOf(rung);

// Apply one source. `to` names the rung it causes ("this effect frightens").
// A body already at or above that rung steps up one when the ladder stacks,
// never below where it was, and never past the top rung.
export function applyRung(ladder, current, {to, step = 0} = {}) {
    const at = rungIndex(ladder, current), top = ladder.rungs.length - 1;
    let next = at;
    if (to != null) {
        const target = rungIndex(ladder, to);
        if (target < 0) throw Error(`${ladder.id}: unknown rung ${to}.`);
        next = target > at ? target : ladder.stacks ? at + 1 : at;
    }
    next = Math.min(top, Math.max(-1, next + step));
    return {rung: next < 0 ? null : ladder.rungs[next], changed: next !== at, capped: next === top};
}

// Recovery steps down: rest, a calming word, a remedy. Off the bottom rung is off the ladder.
export function easeRung(ladder, current, steps = 1) {
    const next = rungIndex(ladder, current) - steps;
    return next < 0 ? null : ladder.rungs[next];
}

export const FEAR = defineLadder({id: 'fear', rungs: ['shaken', 'frightened', 'panicked', 'cowering'], source: 'Pathfinder 1e fear conditions (OGL)'});
export const FATIGUE = defineLadder({id: 'fatigue', rungs: ['fatigued', 'exhausted'], source: 'Pathfinder 1e fatigued and exhausted (OGL)'});
export const SICKNESS = defineLadder({id: 'sickness', rungs: ['sickened', 'nauseated'], stacks: false, source: 'Pathfinder 1e sickened and nauseated (OGL)'});
export const EXHAUSTION_5E = defineLadder({id: 'exhaustion_5e', rungs: ['exhaustion 1', 'exhaustion 2', 'exhaustion 3', 'exhaustion 4', 'exhaustion 5', 'exhaustion 6'],
    source: 'D&D SRD 5.2.1 exhaustion (CC-BY-4.0); the top rung is death'});
export const LADDERS = Object.freeze([FEAR, FATIGUE, SICKNESS, EXHAUSTION_5E]);
