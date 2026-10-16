// Exact integer convolution over fair dice. No sampling or runtime owner reads.
import {CHECK_ENGINE, prepareCheck, chooseScore, applyCheckPolicy} from './check_contract.js';

export function exactRatio(n, d) {
    let a = n < 0n ? -n : n, b = d;
    while (b) [a, b] = [b, a % b];
    return {numerator: String(n / (a || 1n)), denominator: String(d / (a || 1n))};
}
const add = (map, k, n) => map.set(k, (map.get(k) || 0n) + n);
export function scoreDistribution(plan) {
    const {profile, mode} = plan, {count, sides} = profile.dice;
    let values = new Map([[0, 1n]]);
    const faces = new Map();
    for (let face = 1; face <= sides; face++) add(faces, profile.family === 'success_pool' ? Number(face >= profile.successAt) : face, 1n);
    for (let die = 0; die < count; die++) {
        const next = new Map();
        for (const [sum, weight] of values) for (const [face, n] of faces) add(next, sum + face, weight * n);
        values = next;
    }
    if (mode !== 'normal') {
        // CDF differences implement keep-high/low in O(support), not pairs.
        const ordered = [...values].sort((a, b) => a[0] - b[0]);
        const total = [...values.values()].reduce((a, b) => a + b, 0n);
        const keepHigh = chooseScore(profile, mode, [0, 1]) === 1;
        let below = 0n;
        values = new Map(ordered.map(([score, weight]) => {
            const above = total - below - weight;
            const n = keepHigh ? (below + weight) ** 2n - below ** 2n : (above + weight) ** 2n - above ** 2n;
            below += weight;
            return [score, n];
        }));
    }
    return values;
}
// For a selected spend policy, not an optimizer choosing the best policy.
// when:'failure' branches after observing the current result in both paths.
export function checkOdds(profile, check) {
    const plan = prepareCheck(profile, check);
    if (!plan.gate.met) return {engine: CHECK_ENGINE, profileRef: `${profile.id}@${profile.revision}`,
        success: exactRatio(0n, 1n), degrees: {blocked: exactRatio(1n, 1n)}, totalWeight: '1', reasons: plan.gate.reasons};
    const values = scoreDistribution(plan), base = [...values.values()].reduce((a, b) => a + b, 0n);
    const hasReroll = plan.check.spends.some(s => s.modifier.kind === 'reroll');
    const degrees = new Map();
    let total = 0n, success = 0n;
    const record = (result, weight) => {
        add(degrees, result.degree, weight);
        total += weight;
        if (result.success) success += weight;
    };
    for (const [first, weight] of values) {
        let requested = false;
        const probe = applyCheckPolicy(plan, first, () => { requested = true; return first; });
        if (!hasReroll) record(probe.result, weight);
        else if (!requested) record(probe.result, weight * base);
        else for (const [second, n] of values) record(applyCheckPolicy(plan, first, () => second).result, weight * n);
    }
    return {engine: CHECK_ENGINE, profileRef: `${profile.id}@${profile.revision}`, success: exactRatio(success, total),
        degrees: Object.fromEntries([...degrees].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([id, n]) => [id, exactRatio(n, total)])),
        totalWeight: String(total), reasons: []};
}
