// Proposal (AD32): carrier labels are data; pressure prices excess, without admission gates.
const whole = n => Number.isSafeInteger(n) && n >= 0;
const requireData = ok => { if (!ok) throw Error('Body alteration: malformed data.'); };
export function validateAlterationRow(row) {
    requireData(row && typeof row.id === 'string' && row.id && typeof row.carrier === 'string' && row.carrier &&
        typeof row.slot === 'string' && row.load && row.course && typeof row.course.key === 'string');
    requireData(Object.values(row.load).every(whole));
    requireData([row.course.perMinute, row.course.overPerMinute, row.unmetPerMinute ?? 0].every(whole));
    requireData((row.upkeep ?? []).every(x => typeof x.quantity === 'string' && whole(x.perMinute)));
    requireData((row.grants?.quantities ?? []).every(x => typeof x.quantity === 'string' && whole(x.amount)));
    requireData(row.lasts === undefined || whole(row.lasts));
    requireData(!row.settles || [row.settles.perMinute, row.settles.floor].every(whole));
    return row;
}

// Curve knots: {at, slope}, in overshoot permille. Slopes price each band.
export function pressurePermille(load, capacity, curve = []) {
    requireData(whole(load) && whole(capacity) && Array.isArray(curve));
    let excess = Math.max(0, (load - capacity) * 1000 / Math.max(1, capacity)), price = 1000;
    for (let i = 0; i < curve.length; i++) {
        const knot = curve[i], end = curve[i + 1]?.at ?? Infinity;
        requireData(whole(knot.at) && whole(knot.slope) && end > knot.at);
        price += Math.max(0, Math.min(excess, end) - knot.at) * knot.slope;
    }
    return Math.floor(price);
}
export function crowdedLoad(row, occupants, slot) {
    const factor = slot && occupants >= slot.room ? slot.crowdPermille ** (occupants - slot.room + 1) /
        1000 ** (occupants - slot.room + 1) : 1;
    return Object.fromEntries(Object.entries(row.load).map(([key, amount]) => [key, Math.floor(amount * factor)]));
}
export function quoteActivation(row, {target, tick, clock, strain = 0, mindPressure = 1000}) {
    const a = row.activation;
    requireData(a && typeof target === 'string' && [tick, clock, strain, mindPressure, a.permille, a.ticks, a.per].every(whole) &&
        a.per > 0 && Number.isFinite(a.perTick) && a.perTick >= 0);
    requireData((a.thresholds ?? []).every((x, i, xs) => whole(x.at) && whole(x.factorPermille) && (!i || xs[i - 1].at < x.at)));
    const factor = (a.thresholds ?? []).filter(x => strain >= x.at).at(-1)?.factorPermille ?? 1000;
    const cost = Math.floor(a.perTick * Math.max(0, a.permille - 1000) * a.ticks * factor / 1000 * mindPressure / 1000);
    return {effect: {sentence: {verb: 'alter', object: 'time', target: 'self', time: 'sustained'},
        details: {target: {shape: 'holder', id: target}, field: `${row.id}:${target}:${tick}`, kind: 'time',
            params: {permille: a.permille, from: tick, to: tick + a.ticks, per: a.per},
            minutes: Math.max(0, Math.ceil((tick + a.ticks) / a.per) - clock)}}, strain: cost,
        // E1 (proposal): the same price as a cost row, a burden on the row's own course, for the cost owner to land.
        costs: [{kind: a.cost ?? `alteration_course:${row.course.key}`, quantity: `alteration_course:${row.course.key}`, amount: cost, payer: target, as: 'burden'}]};
}
