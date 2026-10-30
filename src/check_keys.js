// World-neutral check-key and projection helpers. Callers own what each factor means.
import {address, compareCodePoints, drawFraction} from './gen_kit.js';

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && value.length > 0;
const natural = value => Number.isSafeInteger(value) && value >= 0;

// Factors are explicit and caller-owned. attemptState carries real retry changes
// such as cumulative effort, fatigue, or target suspicion, never a draw ordinal.
export function checkKey({subject, method, tool = null, helpers = [], period = null,
    targetState = {}, attemptState = {}}) {
    if (!nonempty(subject) || !nonempty(method) || (tool !== null && !nonempty(tool)) ||
        !Array.isArray(helpers) || helpers.some(id => !nonempty(id)) ||
        (period !== null && !record(period)) || !record(targetState) || !record(attemptState)) {
        throw TypeError('Invalid check key factors.');
    }
    return address('check', {subject, method, tool, helpers: [...helpers].sort(compareCodePoints),
        period, targetState, attemptState});
}

// Repeated passive checks reuse the same world-authored value and current
// circumstances. Active searches should call the resolver with checkKey instead.
export function passiveValue(base, circumstance = 0) {
    if (!Number.isSafeInteger(base) || !Number.isSafeInteger(circumstance)) {
        throw TypeError('Passive values need integer inputs.');
    }
    return base + circumstance;
}

// Stratify only explicitly batched, repeated actions. Exceeding the declared
// work budget refuses the batch instead of silently truncating or biasing it.
export function stratifiedChance(root, key, probability, count, {maxDraws = 512} = {}) {
    if (typeof key !== 'string' || !key.length || !Number.isFinite(probability) ||
        probability < 0 || probability > 1 || !natural(count) || !natural(maxDraws) ||
        count > maxDraws) throw RangeError('Invalid or over-budget stratified batch.');
    // A keyed shuffle assigns slots to strata, so successes are spread through
    // the batch instead of always landing on its first slots.
    const order = Array.from({length: count}, (_, slot) => [drawFraction(root, address(key, 'order', slot)), slot])
        .sort((a, b) => a[0] - b[0] || a[1] - b[1]), stratum = new Array(count);
    order.forEach(([, slot], rank) => { stratum[slot] = rank; });
    return Array.from({length: count}, (_, slot) =>
        (stratum[slot] + drawFraction(root, address(key, 'stratum', slot))) / count < probability);
}

// Do not distinguish a failed read from an absent hidden fact in player output.
// Author inspection remains a separate, access-controlled read path.
export function playerCheckView({success, factPresent}) {
    if (typeof success !== 'boolean' || typeof factPresent !== 'boolean') {
        throw TypeError('Check projection needs boolean outcomes.');
    }
    return success && factPresent ? {status: 'found'} : {status: 'unrevealed'};
}
