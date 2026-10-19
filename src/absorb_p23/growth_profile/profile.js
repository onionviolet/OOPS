// Original proposal inspired by Proto23 R21/N04 and mod-reader N30.
// No foreign code/assets. No native registry mutation, timer, or save writes.
import {check, natural} from '../../basics.js';
export const GROWTH_DOMAIN = 'p23_growth_profile';
export const PROFILE = Object.freeze({id: 'p23.visitor.study_body', revision: 1,
    worldId: 'reference.proto23.village', skillId: 'p23.study_conditioning',
    label: 'Study conditioning', baseCost: 100, tonicId: 'Visitor fortifying tonic',
    tonicHealth: 2, tonicPrice: 25});
const milestones = Object.freeze({2: {max_health: 1}, 5: {max_stamina: 1}, 10: {max_health: 2}});
const object = x => x && typeof x === 'object' && !Array.isArray(x);
const exact = (x, keys) => check(object(x) && Object.keys(x).every(k => keys.includes(k)) && keys.every(k => Object.hasOwn(x, k)), 'Invalid growth record fields.');
const identity = x => typeof x === 'string' && x.length > 0 && x.length <= 160;
const sum = (a, b) => { const n = a + b; check(natural(n), 'Growth arithmetic exceeds finite safe storage.'); return n; };
const threshold = level => 100n * ((1n << BigInt(level)) - 1n);
function levelAt(xp) {
    let level = 0;
    while (threshold(level + 1) <= BigInt(xp)) level++;
    return level;
}
export function validateGrowthState(state) {
    if (state === undefined) return undefined; // old envelopes remain absent
    exact(state, ['schema', 'profileId', 'bodyId', 'xp', 'level', 'tonics', 'award', 'tonicEvent', 'background']);
    check(state.schema === 1 && state.profileId === PROFILE.id && identity(state.bodyId), 'Unsupported growth schema/profile/body.');
    for (const k of ['xp', 'level', 'tonics']) check(natural(state[k]), 'Invalid growth numeric value.');
    check(state.level === levelAt(state.xp), 'Growth level disagrees with settled XP.');
    check(natural(state.tonics * PROFILE.tonicHealth + 3), 'Invalid permanent growth total.');
    if (state.award !== null) {
        exact(state.award, ['sequence', 'amount', 'remaining']);
        check(natural(state.award.sequence) && state.award.sequence > 0 && natural(state.award.amount) && state.award.amount > 0 && natural(state.award.remaining) && state.award.remaining <= state.award.amount, 'Invalid pending growth award.');
        sum(state.xp, state.award.remaining);
    }
    if (state.tonicEvent !== null) {
        exact(state.tonicEvent, ['sequence']);
        check(natural(state.tonicEvent.sequence) && state.tonicEvent.sequence > 0, 'Invalid tonic receipt.');
    }
    exact(state.background, ['enabled', 'lastClock']);
    check(typeof state.background.enabled === 'boolean' && natural(state.background.lastClock), 'Invalid played-clock background state.');
    return state;
}
function matches(state, context) {
    return context?.worldId === PROFILE.worldId && context?.profileId === PROFILE.id &&
        context?.bodyId === state.bodyId && context?.bodySupported === true;
}
function requireContext(state, context) {
    validateGrowthState(state);
    check(state && matches(state, context), 'This body/profile does not support study growth.');
    check(context.nativeAlive === true && context.ownsSave === true && context.saveBlocked === false,
        'Growth requires a living body and writable native save custody.');
}
export function enrollGrowth(context) {
    check(context?.worldId === PROFILE.worldId && context?.profileId === PROFILE.id && identity(context.bodyId) && context.bodySupported === true,
        'This body/profile does not support study growth.');
    check(context.nativeAlive === true && context.ownsSave === true && context.saveBlocked === false && context.nativeEligible === true && context.known === true && natural(context.clock), 'Native growth enrollment is unavailable.');
    return {schema: 1, profileId: PROFILE.id, bodyId: context.bodyId, xp: 0, level: 0, tonics: 0,
        award: null, tonicEvent: null, background: {enabled: false, lastClock: context.clock}};
}
// Absolute native stat-source projection. Rebuild/replace this source on restore,
// never add it to already-restored milestone stats. Unmatched bodies get nothing.
export function growthBonuses(state, context) {
    validateGrowthState(state);
    if (!state || !matches(state, context)) return {stats: {}, xp_multipliers: {}};
    const flats = {max_health: state.tonics * PROFILE.tonicHealth, max_stamina: 0};
    for (const [at, stats] of Object.entries(milestones)) if (state.level >= Number(at)) {
        for (const [key, value] of Object.entries(stats)) flats[key] = sum(flats[key], value);
    }
    return {stats: Object.fromEntries(Object.entries(flats).filter(([, n]) => n).map(([key, flat]) => [key, {flat}])), xp_multipliers: {}};
}
function plan(before, next, context, extra = {}) {
    validateGrowthState(next);
    const old = growthBonuses(before, context), after = growthBonuses(next, context), stats = {};
    for (const key of new Set([...Object.keys(old.stats), ...Object.keys(after.stats)])) {
        const flat = (after.stats[key]?.flat || 0) - (old.stats[key]?.flat || 0);
        if (flat) stats[key] = {flat};
    }
    return {next, nativeDelta: {stats, xp_multipliers: {}}, nativeProjection: after, ...extra};
}
export function beginAward(state, context, {sequence, amount}) {
    requireContext(state, context);
    check(context.nativeEligible === true, 'Native XP eligibility blocks this award.');
    check(natural(sequence) && sequence > 0 && natural(amount) && amount > 0, 'Award must have a real sequence and finite integer XP.');
    if (state.award && sequence <= state.award.sequence) {
        check(sequence !== state.award.sequence || amount === state.award.amount, 'Award receipt differs from original event.');
        return plan(state, structuredClone(state), context, {duplicate: true});
    }
    check(!state.award?.remaining, 'Settle the pending award before accepting another.');
    sum(state.xp, amount);
    const next = structuredClone(state);
    next.award = {sequence, amount, remaining: amount};
    return plan(state, next, context);
}
// Bounded iterative settlement. Each continuation uses the newly committed state.
// BigInt thresholds are calculation-only; all serialized values stay finite.
export function settleAward(state, context, maxSteps = 8) {
    requireContext(state, context);
    check(natural(maxSteps) && maxSteps > 0 && maxSteps <= 64, 'Invalid settlement budget.');
    const next = structuredClone(state), crossed = [];
    for (let step = 0; next.award?.remaining && step < maxSteps; step++) {
        const toNext = threshold(next.level + 1) - BigInt(next.xp);
        const amount = Number(toNext > BigInt(next.award.remaining) ? BigInt(next.award.remaining) : toNext);
        next.xp = sum(next.xp, amount);
        next.award.remaining -= amount;
        if (BigInt(next.xp) === threshold(next.level + 1)) {
            next.level++;
            if (milestones[next.level]) crossed.push(next.level);
        }
    }
    return plan(state, next, context, {crossed, complete: !next.award?.remaining});
}
export function consumeTonic(state, context, {sequence, inventoryCount}) {
    requireContext(state, context);
    check(natural(sequence) && sequence > 0, 'Invalid native consumption sequence.');
    if (state.tonicEvent && sequence <= state.tonicEvent.sequence) return plan(state, structuredClone(state), context, {duplicate: true, itemCost: 0});
    check(context.nativeEligible === true && context.known === true && context.idle === true && natural(inventoryCount) && inventoryCount >= 1,
        'A known owned tonic and eligible unoccupied body are required.');
    const next = structuredClone(state);
    next.tonics = sum(next.tonics, 1);
    next.tonicEvent = {sequence};
    return plan(state, next, context, {itemCost: 1, itemId: PROFILE.tonicId});
}
export function setBackground(state, context, enabled) {
    requireContext(state, context);
    check(typeof enabled === 'boolean' && natural(context.clock) && context.clock >= state.background.lastClock, 'Invalid background clock/setting.');
    check(!enabled || context.nativeEligible === true && context.known === true, 'Learn the supported condition first.');
    const next = structuredClone(state);
    next.background = {enabled, lastClock: context.clock};
    return plan(state, next, context);
}
export function backgroundEligibility(state, context) {
    validateGrowthState(state);
    if (!state || !matches(state, context) || !state.background.enabled) return {eligible: false, reason: 'Study conditioning is inactive for this body/profile.'};
    if (context.nativeAlive !== true || context.ownsSave !== true || context.saveBlocked !== false) return {eligible: false, reason: 'Native body or save custody is unavailable.'};
    if (state.award?.remaining) return {eligible: false, reason: 'Finish settling the pending growth award.'};
    if (context.nativeEligible !== true || context.conditionEligible !== true || context.resourcesEligible !== true) return {eligible: false, reason: 'Current body, preparation or resources do not support conditioning.'};
    if (context.occupation?.kind !== 'reading' || context.occupation.eligible !== true || !identity(context.occupation.jobId)) return {eligible: false, reason: 'Conditioning requires a legitimate native reading job.'};
    if (context.conflictingAction !== false || context.bodyConflict !== false || context.resourceConflict !== false) return {eligible: false, reason: 'The current action occupies the body or resources needed by conditioning.'};
    return {eligible: true, reason: 'Quiet study conditioning can progress alongside this reading job.'};
}
// Call once per native minute, with eligibility for the elapsed interval. Paused
// intervals still move the anchor: no offline/blocked-time catch-up is invented.
export function advanceBackground(state, context, sequence) {
    validateGrowthState(state);
    check(state && natural(context.clock) && context.clock >= state.background.lastClock, 'Invalid played-clock advancement.');
    const minutes = context.clock - state.background.lastClock;
    const eligibility = backgroundEligibility(state, context);
    const next = structuredClone(state);
    next.background.lastClock = context.clock;
    if (!minutes || !eligibility.eligible) return plan(state, next, context, {...eligibility, minutes: 0});
    check(minutes === 1, 'Supply eligibility per native minute; do not credit an unchecked interval.');
    const queued = beginAward(next, context, {sequence, amount: 1});
    check(!queued.duplicate, 'Background minute requires a fresh native event sequence.');
    const settled = settleAward(queued.next, context);
    return plan(state, settled.next, context, {...eligibility, minutes, crossed: settled.crossed});
}
export function growthView(state, context) {
    validateGrowthState(state);
    if (!state || !matches(state, context) || context.known !== true) return null;
    const next = threshold(state.level + 1);
    return {label: PROFILE.label, level: state.level, totalXP: state.xp,
        nextTotalXP: next <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(next) : null,
        pendingXP: state.award?.remaining || 0, tonics: state.tonics,
        background: backgroundEligibility(state, context), bonuses: growthBonuses(state, context)};
}
// P00 must derive this quote from the current native shop and funded stock,
// then commit money, stock, item delivery and the native trade receipt together.
export function quoteTonicAcquisition(state, context, {money, stockCount}) {
    requireContext(state, context);
    check(context.known === true && context.nativeEligible === true && context.idle === true && context.shopEligible === true,
        'Reach the known native shop before buying a tonic.');
    check(natural(money) && money >= PROFILE.tonicPrice && natural(stockCount) && stockCount >= 1,
        'The native shop needs funded tonic stock and sufficient coins.');
    return {itemId: PROFILE.tonicId, itemKey: JSON.stringify({id: PROFILE.tonicId}), count: 1,
        moneyCost: PROFILE.tonicPrice, stockCost: 1};
}
