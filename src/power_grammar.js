// Authoring leaf, XP2/XP3: compose concrete typed effects, price parts, then use the
// existing spell -> ability_records -> structured descriptor path. No executor or save.
import {assert, record, validateSimulationEffect} from './simulation_contracts.js';
import {defineSpells} from './spell_seam.js';

export const POWER_AXES = Object.freeze(['magnitude', 'range', 'duration', 'targets']);
export function powerFeatures(parts) {
    assert(record(parts) && Array.isArray(parts.functions) && parts.functions.length > 0 && new Set(parts.functions).size === parts.functions.length, 'Power parts need distinct functions.');
    const result = {base: 1};
    for(const axis of POWER_AXES) {
        const n = parts[axis];
        assert(Number.isFinite(n) && n >= 0 && (axis !== 'targets' || Number.isSafeInteger(n) && n > 0), `Invalid power ${axis}.`);
        result[axis] = n;
    }
    result.additionalTargets = parts.targets - 1;
    assert(Number.isSafeInteger(parts.tier) && parts.tier >= 0, 'Power parts need a local tier.');
    for(const fn of parts.functions) {assert(typeof fn === 'string' && /^[a-z][a-z0-9_]*$/.test(fn), 'Invalid power function.'); result[`function.${fn}`] = 1;}
    return result;
}
function matrixRank(rows, tolerance = 1e-10) {
    const a = rows.map(r => [...r]); let rank = 0;
    for(let col = 0; col < (a[0]?.length ?? 0) && rank < a.length; col++) {
        const pivot = a.findIndex((r, i) => i >= rank && Math.abs(r[col]) > tolerance);
        if(pivot < 0) continue;
        [a[rank], a[pivot]] = [a[pivot], a[rank]];
        const n = a[rank][col]; a[rank] = a[rank].map(v => v / n);
        for(let i = rank + 1; i < a.length; i++) {const f = a[i][col]; a[i] = a[i].map((v, j) => v - f * a[rank][j]);}
        rank++;
    }
    return rank;
}
const dot = (features, prices) => Object.entries(features).reduce((sum, [key, n]) => sum + n * (prices[key] ?? 0), 0);
// A null channel means canon leaves it unknown and this world does not model it.
export function pricePower(parts, law) {
    const features = powerFeatures(parts);
    for(const fn of parts.functions) assert(law.functions[fn], `No effect implementation for ${fn}.`);
    const values = {};
    for(const [channel, prices] of Object.entries(law.prices)) {
        assert(prices === null || record(prices) && Object.values(prices).every(n => Number.isFinite(n) && n >= 0), 'Part prices must be finite and non-negative.');
        values[channel] = prices === null ? null : dot(features, prices);
    }
    assert(values.failure == null || values.failure <= 1, 'Composed failure exceeds one; add a local difficulty band or an exception.');
    assert(values.perMastery == null || values.perMastery <= 1, 'Invalid mastery reduction.');
    return {features, values, basis: law.basis, tier: parts.tier};
}
// World handlers implement verbs with existing typed owners. A magnitude/duration
// that changes only a label is not a handler. Rows cannot override the derived cost.
export function composePower(row, law) {
    const {parts, failureOutcome = [], ...base} = row;
    assert(!['cost', 'effects', 'failure', 'strain'].some(k => Object.hasOwn(base, k)), 'A composed power derives effects and prices from its parts.');
    const quote = pricePower(parts, law), effects = parts.functions.flatMap(fn => law.functions[fn](structuredClone(parts)));
    assert(effects.length > 0, 'A power needs a functional effect.');
    for(const effect of [...effects, ...failureOutcome]) validateSimulationEffect(effect);
    const cost = law.cost(quote.values, parts);
    return {...base, effects, cost, costBasis: {kind: 'parts', law: law.id, parts: structuredClone(parts), values: quote.values, basis: law.basis},
        failure: {chance: quote.values.failure, perMastery: quote.values.perMastery ?? 0, outcome: failureOutcome},
        unstated: [...(base.unstated ?? []), ...(law.unknown ?? [])]};
}
export const definePowerGrammar = (rows, law, adapter) => defineSpells(rows.map(row => composePower(row, law)), adapter);

// Non-negative coordinate descent. Unidentifiable dimensions retain their prior;
// each fit reports unanchored tiers and unknown observations rather than claiming canon numbers.
export function fitPowerPrices(law, anchors, {iterations = 500, tolerance = 1e-6, tiers = []} = {}) {
    const prices = structuredClone(law.prices), channels = Object.keys(prices), fits = {};
    for(const channel of channels) {
        if(prices[channel] === null) {fits[channel] = {status: 'unmodelled'}; continue;}
        const rows = anchors.filter(a => Number.isFinite(a.observed?.[channel])).map(a => ({a, x: powerFeatures(a.parts), y: a.observed[channel]}));
        const keys = Object.keys(prices[channel]);
        for(let i = 0; i < iterations; i++) for(const key of keys) {
            const denom = rows.reduce((s, r) => s + (r.x[key] ?? 0) ** 2, 0);
            if(!denom) continue;
            const update = rows.reduce((s, r) => s + (r.x[key] ?? 0) * (r.y - dot(r.x, prices[channel]) + (r.x[key] ?? 0) * prices[channel][key]), 0) / denom;
            prices[channel][key] = Math.max(0, update);
        }
        const rank = matrixRank(rows.map(r => keys.map(k => r.x[k] ?? 0)));
        fits[channel] = {status: rows.length ? 'fitted' : 'assumed', anchors: rows.length, rank, dimensions: keys.length, underdetermined: rank < keys.length,
            unobservedFeatures: keys.filter(k => !rows.some(r => r.x[k]))};
    }
    const rows = anchors.map(a => {
        const values = Object.fromEntries(channels.map(c => [c, prices[c] == null ? null : dot(powerFeatures(a.parts), prices[c])]));
        const errors = Object.fromEntries(channels.filter(c => Number.isFinite(a.observed?.[c]) && values[c] != null).map(c => [c, values[c] - a.observed[c]]));
        return {id: a.id, tier: a.parts.tier, basis: a.basis, locator: a.locator, values, errors, unknown: channels.filter(c => !Number.isFinite(a.observed?.[c])),
            outlier: Object.values(errors).some(e => Math.abs(e) > tolerance), interpretation: a.exception ?? 'Outliers need a missing part or an explicit canon exception.'};
    });
    const byTier = [...new Set([...tiers, ...anchors.map(a => a.parts.tier)])].sort((a, b) => a - b).map(tier => {
        const found = rows.filter(r => r.tier === tier), errors = found.flatMap(r => Object.values(r.errors));
        return {tier, status: !errors.length ? 'assumed' : found.some(r => r.basis !== 'canon') ? 'dial-anchored' : 'canon-anchored', anchors: found.length,
            maxError: errors.length ? Math.max(...errors.map(Math.abs)) : null, outliers: found.filter(r => r.outlier).map(r => r.id)};
    });
    return {world: law.id, prices, fits, rows, byTier};
}
