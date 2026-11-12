// Proposal (AD32), KW5: holder-local duration mapped onto a whole-tick clock.
const valid = ok => { if (!ok) throw Error('Pace: malformed course or duration.'); };
const natural = n => Number.isSafeInteger(n) && n >= 0;
export function paceCourse(world, holderId) {
    return world.laws.filter(f => f.kind === 'time' && f.scope === holderId).map(f => {
        const {permille, from, to, per} = f.params;
        valid([permille, from, to, per].every(natural) && per > 0 && to >= from);
        return {permille, from, to, per};
    });
}
const boundaries = (from, to, course) => [...new Set([from, to,
    ...course.flatMap(w => [w.from, w.to]).filter(t => t > from && t < to)])].sort((a, b) => a - b);
// Rational integrals avoid a floating-point boundary moving a whole-tick deadline.
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function fraction(n, d) { const g = gcd(n, d); return [n / g, d / g]; }
function integral(from, to, course) {
    const cuts = boundaries(from, to, course);
    let sum = [0n, 1n];
    for (let i = 1; i < cuts.length; i++) {
        let rate = [1000n, 1n];
        for (const w of course.filter(w => w.from <= cuts[i - 1] && cuts[i - 1] < w.to))
            rate = fraction(rate[0] * BigInt(w.permille), rate[1] * 1000n);
        sum = fraction(sum[0] * rate[1] + BigInt(cuts[i] - cuts[i - 1]) * rate[0] * sum[1], sum[1] * rate[1]);
    }
    return sum;
}
export function pacedDeadlines(durations, startedAt, course) {
    valid(natural(startedAt) && durations.every(natural));
    let cumulative = 0;
    const last = Math.max(startedAt, ...course.map(w => w.to));
    return durations.map(duration => {
        cumulative += duration;
        let lo = startedAt, hi = last + cumulative;
        while (lo < hi) {
            const mid = lo + Math.floor((hi - lo) / 2);
            const [n, d] = integral(startedAt, mid, course);
            if (n >= BigInt(cumulative) * 1000n * d) hi = mid; else lo = mid + 1;
        }
        return lo;
    });
}
const durations = (law, method) => method.steps.map(s => s.paceDuration ?? s.minutes ?? law.operations[s.op].minutes ?? 0);
export function pacedMethod(law, method, startedAt, course) {
    const local = durations(law, method), deadlines = pacedDeadlines(local, startedAt, course);
    return {...structuredClone(method), steps: method.steps.map((s, i) => ({...structuredClone(s), paceDuration: local[i],
        minutes: deadlines[i] - (i ? deadlines[i - 1] : startedAt)}))};
}
export function retimeWorking(law, record, course) {
    const next = structuredClone(record);
    if (next.status !== 'running') return next;
    const local = durations(law, record.method), deadlines = pacedDeadlines(local, record.startedAt, course);
    for (let i = next.cursor; i < deadlines.length; i++) {
        const before = i ? next.deadlines[i - 1] : next.startedAt;
        next.deadlines[i] = Math.max(before, deadlines[i]);
        next.method.steps[i] = {...next.method.steps[i], paceDuration: local[i], minutes: next.deadlines[i] - before};
    }
    return next;
}
export function paceContest(entrants, {from, to, stepTicks}) {
    valid(natural(from) && natural(to) && to >= from && natural(stepTicks) && stepTicks > 0);
    const results = Object.fromEntries(entrants.map(({id, course}) => {
        const [n, d] = integral(from, to, course);
        const actions = Number(n / (d * BigInt(stepTicks) * 1000n));
        return [id, {actions, firstAt: actions ? pacedDeadlines([stepTicks], from, course)[0] : null}];
    }));
    const order = Object.keys(results).sort((a, b) => (results[a].firstAt ?? Infinity) - (results[b].firstAt ?? Infinity) ||
        (a < b ? -1 : a > b ? 1 : 0));
    return {entrants: results, order};
}
