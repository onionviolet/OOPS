// Typed bonus stacking: one world-neutral seam (PFA3 proposal, 2026-11-04).
// Pure: the caller owns where bonuses come from and what a stat means.
// Default: bonuses of the same named type on the same stat do not stack, only
// the strongest applies; untyped bonuses always add. Dial: the caller passes a
// `stacking` table ({type: 'highest'|'add'}) that replaces the default for any
// type it names. Reason: many buffs then combine sensibly without a pairwise
// exclusion list, and a world with looser rules just flips a type to 'add'.
// Calibration: d20/PF1 bonus types (OGL), paraphrased; dodge and circumstance
// stack in that system. Bonuses and penalties of one type are judged apart, so
// a typed penalty never cancels a typed bonus by being "the highest".

export const DEFAULT_STACKING = Object.freeze({untyped: 'add', dodge: 'add', circumstance: 'add'});

// bonuses: [{stat, value, type = 'untyped', source}]. Returns
// {[stat]: {total, applied: [bonus], suppressed: [{bonus, by}]}}.
export function stackBonuses(bonuses, {stacking = {}} = {}) {
    const table = {...DEFAULT_STACKING, ...stacking};
    const out = {};
    const groups = new Map(); // "stat|type|sign" -> winner bonus
    for (const b of bonuses) {
        if (!b || typeof b.stat !== 'string' || !Number.isFinite(b.value)) throw Error('A bonus needs a stat and a numeric value.');
        const bonus = {type: 'untyped', ...b};
        const mode = table[bonus.type] ?? 'highest';
        if (mode !== 'highest' && mode !== 'add') throw Error(`${bonus.type}: stacking must be 'highest' or 'add'.`);
        const entry = out[bonus.stat] ??= {total: 0, applied: [], suppressed: []};
        if (mode === 'add') { entry.applied.push(bonus); continue; }
        const key = `${bonus.stat}|${bonus.type}|${Math.sign(bonus.value)}`;
        const held = groups.get(key);
        if (!held) { groups.set(key, bonus); entry.applied.push(bonus); continue; }
        if (Math.abs(bonus.value) > Math.abs(held.value)) { // strictly stronger replaces; ties keep the first
            entry.applied.splice(entry.applied.indexOf(held), 1, bonus);
            entry.suppressed.push({bonus: held, by: bonus});
            groups.set(key, bonus);
        } else entry.suppressed.push({bonus, by: held});
    }
    for (const entry of Object.values(out)) {
        entry.total = entry.applied.reduce((n, b) => n + b.value, 0);
        // A displaced winner may have suppressed others earlier; point them at the final winner.
        for (const s of entry.suppressed) {
            const key = `${s.bonus.stat}|${s.bonus.type}|${Math.sign(s.bonus.value)}`;
            s.by = groups.get(key) ?? s.by;
        }
    }
    return out;
}
