import {check, natural as nat, object as record} from '../../basics.js';
import {mistglassProfile as P} from './profile.js';
export {mistglassProfile, mistglassContent, mistglassEnergyPolicy} from './profile.js';

const fields = (o, keys) => check(record(o) && Object.keys(o).length === keys.length && keys.every(k => Object.hasOwn(o, k)), 'Invalid adaptation fields.');
const add = (a, b) => {const n = a + b; check(nat(n), 'Adaptation integer overflow.'); return n;};
const text = s => typeof s === 'string' && s.length > 0 && s.length <= 160;

// Pure optional-family validator. Call on the entire candidate envelope before
// mutating ANY native inventory, resource, RNG, skill, condition or save owner.
export function validateAdaptation(s) {
    if (s === undefined) return;
    fields(s, ['schema', 'profileId', 'bodyId', 'instanceId', 'revision', 'clock', 'exposure', 'started', 'succeeded', 'failed', 'pending', 'last']);
    check(s.schema === 1 && s.profileId === P.id, 'Unsupported adaptation schema/profile.');
    check(text(s.bodyId) && text(s.instanceId), 'Invalid adaptation body/instance.');
    for (const k of ['revision', 'clock', 'exposure', 'started', 'succeeded', 'failed']) check(nat(s[k]), `Invalid adaptation ${k}.`);
    check(s.started === add(add(s.succeeded, s.failed), s.pending === null ? 0 : 1), 'Invalid adaptation trial totals.');
    if (s.pending !== null) {
        const t = s.pending;
        fields(t, ['id', 'startedAt', 'dueAt', 'roll']);
        check(t.id === s.started && nat(t.startedAt) && t.startedAt <= s.clock && t.dueAt === add(t.startedAt, P.trialMinutes) && nat(t.roll) && t.roll < 10000, 'Invalid pending purification.');
        check(t.dueAt > s.clock, 'Unsettled overdue purification.');
    }
    if (s.last !== null) {
        const t = s.last;
        fields(t, ['id', 'at', 'outcome', 'reason']);
        check(nat(t.id) && t.id > 0 && t.id === s.succeeded + s.failed && nat(t.at) && t.at <= s.clock, 'Invalid purification receipt.');
        check(['success', 'failure'].includes(t.outcome) && ['purified', 'unstable', 'interrupted'].includes(t.reason) && (t.outcome === 'success') === (t.reason === 'purified'), 'Invalid purification outcome.');
    } else check(s.succeeded + s.failed === 0, 'Missing purification receipt.');
}

function context(c) {
    check(record(c) && nat(c.clock) && Array.isArray(c.conditionIds) && c.conditionIds.every(text), 'Invalid played-clock context.');
}
function applicable(s, c) {
    return c.worldId === P.worldId && c.instanceId === s.instanceId && c.bodyId === s.bodyId &&
        c.bodyForm === P.bodyForm && c.ownerId === 'player' && c.controllerId === 'player' && c.alive === true;
}
function stable(s, c) {return applicable(s, c) && !c.conditionIds.includes(P.blockedConditionId);}
function plan(before, next, effects) {
    validateAdaptation(next);
    return {expectedRevision: before?.revision ?? null, state: next, effects};
}
function revise(s) {const n = structuredClone(s); n.revision = add(n.revision, 1); return n;}
function balance(n) {check(nat(n) && n <= P.capacity, 'Invalid native condensate reserve.');}

export function prepareEnrollment(previous, c) {
    validateAdaptation(previous); context(c);
    check(previous === undefined, 'Already enrolled.');
    check(c.optIn === true && c.methodKnown === true && text(c.bodyId) && text(c.instanceId), 'Choose and learn this method first.');
    const s = {schema: 1, profileId: P.id, bodyId: c.bodyId, instanceId: c.instanceId,
        revision: 0, clock: c.clock, exposure: 0, started: 0, succeeded: 0, failed: 0, pending: null, last: null};
    check(stable(s, c), 'This world/body does not support the conservatory method.');
    return plan(undefined, s, [{kind: 'learn-resource', resourceId: P.resourceId, capacity: P.capacity}]);
}

// c describes the whole interval [state.clock, c.clock]. The native host MUST
// split at world/body/condition boundaries and advance before changing context.
// No active-action check; played idle minutes qualify. No wall-clock catch-up.
export function prepareAdvance(s, c, reserve) {
    validateAdaptation(s); context(c);
    if (s === undefined) return plan(undefined, undefined, []);
    balance(reserve); check(c.clock >= s.clock, 'Played clock moved backwards.');
    check(!s.pending || c.clock <= s.pending.dueAt, 'Split the native clock at the purification deadline.');
    if (c.clock === s.clock && (!s.pending || stable(s, c))) return plan(s, structuredClone(s), []);
    const n = revise(s), effects = [], minutes = c.clock - s.clock;
    if (stable(s, c) && c.conditionIds.includes(P.exposureConditionId)) {
        // BigInt avoids intermediate multiplication overflow on large intervals.
        const earned = BigInt(minutes) * BigInt(P.subunitsPerMinute);
        const credited = Number(earned < BigInt(P.capacity - reserve) ? earned : BigInt(P.capacity - reserve));
        n.exposure = add(n.exposure, credited);
        if (credited) effects.push({kind: 'resource-credit', resourceId: P.resourceId, amount: credited});
    }
    if (n.pending && (!stable(s, c) || c.clock >= n.pending.dueAt)) {
        const interrupted = !stable(s, c), success = !interrupted && n.pending.roll < P.successThreshold;
        const at = interrupted ? s.clock : n.pending.dueAt;
        n.last = {id: n.pending.id, at, outcome: success ? 'success' : 'failure', reason: interrupted ? 'interrupted' : success ? 'purified' : 'unstable'};
        n[success ? 'succeeded' : 'failed'] = add(n[success ? 'succeeded' : 'failed'], 1);
        const eventId = `p23.mistglass.trial.${n.pending.id}`;
        if (success) effects.push({kind: 'native-skill-xp', eventId, skillId: P.successSkillId, amount: P.successXp});
        else if (at + P.failureMinutes > c.clock) effects.push({kind: 'native-condition', eventId,
            conditionId: P.blockedConditionId, startsAt: at, expiresAt: add(at, P.failureMinutes)});
        n.pending = null;
    }
    n.clock = c.clock;
    return {...plan(s, n, effects), expectedReserve: reserve};
}

export function previewTrial(s, c, reserve, doseAvailable) {
    validateAdaptation(s); context(c); balance(reserve);
    const reasons = [];
    if (!s || !stable(s, c)) reasons.push('Requires your enrolled conservatory body in its original world instance, without rawness.');
    if (s && s.clock !== c.clock) reasons.push('Advance the native played clock before starting.');
    if (s?.pending) reasons.push('A purification trial is already pending.');
    if (doseAvailable !== true) reasons.push('Acquire one owned Cloudseed dose from the conservatory keeper.');
    if (reserve < P.trialCost) reasons.push('Absorb at least 2 condensate by remaining in the conservatory mist.');
    return {eligible: !reasons.length, reasons, minutes: P.trialMinutes, cost: {itemId: P.doseItemId, count: 1, resourceId: P.resourceId, amount: P.trialCost},
        successPercent: 75, reward: {skillId: P.successSkillId, xp: P.successXp},
        risk: '25% failure: dose and 2 condensate spent, no XP, six played minutes of rawness blocking absorption and another trial. Leaving this world/body interrupts the trial.'};
}

// roll is a 0..9999 draw from the native SAVED RNG in the same transaction.
// doseKey identifies the exact native owned copy/lot, not a template grant.
export function prepareTrial(s, c, {reserve, doseKey, doseAvailable, roll}) {
    const preview = previewTrial(s, c, reserve, doseAvailable);
    check(preview.eligible, preview.reasons.join(' '));
    check(text(doseKey) && nat(roll) && roll < 10000, 'Invalid dose custody/RNG proof.');
    const n = revise(s); n.started = add(n.started, 1);
    n.pending = {id: n.started, startedAt: c.clock, dueAt: add(c.clock, P.trialMinutes), roll};
    return {...plan(s, n, [
        {kind: 'native-consume-item', itemId: P.doseItemId, copyOrLotKey: doseKey, count: 1},
        {kind: 'resource-debit', resourceId: P.resourceId, amount: P.trialCost},
    ]), expectedReserve: reserve};
}

// Public projection never includes the frozen draw or unknown world content.
// Effects-off disables optional presentation cues, not simulation progression.
export function adaptationView(s, c, reserve) {
    validateAdaptation(s); context(c);
    if (!s || c.methodKnown !== true) return null;
    balance(reserve);
    return {id: P.id, label: P.label, reserve: reserve / P.subunitsPerUnit, capacity: P.capacity / P.subunitsPerUnit, ratePerMinute: P.subunitsPerMinute / P.subunitsPerUnit,
        exposureEarned: s.exposure / P.subunitsPerUnit, supported: stable(s, c),
        pending: s.pending ? {id: s.pending.id, dueAt: s.pending.dueAt, remainingMinutes: Math.max(0, s.pending.dueAt - c.clock)} : null,
        last: s.last ? {...s.last} : null, trials: {started: s.started, succeeded: s.succeeded, failed: s.failed},
        cue: c.effectsEnabled === true && s.last ? s.last.outcome : null};
}
