// Bridge: ritual_conditions.js gradeRitual() result -> the bench detail rite_figure.js riteCircleSpec/riskLedger read (`d.rite`).
// Pure and world-neutral: labels, the rite's name and the set of conditions the seat knows come from the caller. A rite whose conditions the seat
// has not all learned yields no rite (the odds would reveal what the missing conditions weigh); `principle` and `rejected` substitutes never leave,
// and `wanted` (the exact thing a missing condition asks for) leaves only for a condition the seat knows.
/**
 * base: the bench detail without a rite ({id, name, slots, ...}). graded: gradeRitual() result. opts: label (the rite's name), known: Set of condition
 * ids the seat has learned (default none), recoveryDays defaults to graded's.
 */
export function benchWithRite(base, graded, {label, known = new Set()} = {}) {
    if(!graded || !label || !graded.conditions.length || !graded.conditions.every(c => known.has(c.id))) return {...base, rite: null};
    return {...base, rite: {label, grade: graded.grade, odds: graded.odds, recoveryDays: graded.recoveryDays,
        conditions: graded.conditions.map(c => ({id: c.id, label: c.label, status: c.status, fit: c.fit, loss: c.loss,
            ...(c.via ? {via: c.via} : {}), ...(c.status === 'absent' && c.wanted ? {wanted: c.wanted} : {})}))}};
}
