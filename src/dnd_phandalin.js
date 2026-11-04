// D&D first-slice consumer (FIRST_SLICE PS03-PS05, E02/E03). Proposal: SRD 5.2.1 rulings and numbers are provisional, see SRD521_START and RULINGS_LEDGER.
// Pure leaf: no DOM, clock, save or world import. Each function proposes; the caller installs atomically (as check_resolver does), so a refusal or a
// failed save cannot spend, roll or reward. The authoritative bag stays the existing item record: this reads and patches its condition, never a second inventory.
import {resolveCheck, replayCheck} from './check_resolver.js';
import {address} from './gen_kit.js';

export const MENDING = Object.freeze({
    minutes: 1, maxInches: 12, slot: 0,
    locator: 'D&D SRD 5.2.1, Mending (L03 p78, L08 pp105-106); size limit to verify against the source before shipping',
});
export const DND_WORLD_ID = 'dnd.branch';
const fail = (...reasons) => ({ok: false, reasons});
const REPAIRED = 'repaired';

// Eligibility, checked from the caster's seat. means: {knowsMending, voice, freeHand, focusHeld, reachesTarget}. item: {id, revision, accessible, magic, damage}.
// damage: {id, kind: 'tear'|'break', inches: [n, ...], missingMaterial, state}. Missing material is a refusal: the fixture cannot create fabric (RL08-RL11).
export function mendingEligibility(means, item) {
    const why = [];
    if (!means.knowsMending) why.push('Mending is not a known spell.');
    if (!means.voice) why.push('Mending needs speech in a normal voice.');
    if (!means.freeHand) why.push('Mending needs a free hand for the gesture.');
    if (!means.focusHeld) why.push('Mending needs the focus or the lodestones in reach.');
    if (!means.reachesTarget || !item.accessible) why.push('The target is not within touch.');
    const d = item.damage;
    if (!d || d.state === REPAIRED) why.push('Nothing is damaged on this object.');
    else {
        if (d.missingMaterial) why.push('Material is missing; Mending cannot create it.');
        if (d.inches.some(n => n > MENDING.maxInches)) why.push(`The ${d.kind} is larger than ${MENDING.maxInches} inches in a dimension.`);
    }
    return why.length ? fail(...why) : {ok: true, reasons: []};
}

// A cast is a minute of concentration. An unfinished cast keeps its start so save/reload resumes it; interruption ends it with no repair and no slot.
export function beginMending(means, item, gameTime) {
    const e = mendingEligibility(means, item);
    if (!e.ok) return e;
    return {ok: true, cast: {kind: 'mending', itemId: item.id, itemRevision: item.revision, damageId: item.damage.id, startedAt: gameTime, doneAt: gameTime + MENDING.minutes}};
}
export function interruptMending(cast) {
    return {ok: true, repaired: false, slotSpent: MENDING.slot, cast: null, reason: `Interrupted at the unfinished cast of ${cast.itemId}; a fresh attempt takes a new full minute.`};
}
// Completion rechecks the item's revision and damage: if either moved, the cast fizzles rather than patching a different object.
export function finishMending(cast, item, gameTime) {
    if (gameTime < cast.doneAt) return fail(`The cast needs until minute ${cast.doneAt}.`);
    if (item.id !== cast.itemId || item.revision !== cast.itemRevision || item.damage?.id !== cast.damageId || item.damage.state === REPAIRED)
        return fail('The object changed while casting; nothing is repaired.');
    return {ok: true, slotSpent: MENDING.slot, itemPatch: {id: item.id, revision: item.revision + 1, damage: {...item.damage, state: REPAIRED}}};
}

// Carry rule (FLR4 consumer for PS04): a torn sack cannot hold loose cargo; a repaired one holds its intact capacity. Other bags use their own capacity.
export function carryCapacityLb(item) {
    const torn = item.damage && item.damage.state !== REPAIRED && item.damage.kind === 'tear';
    return torn ? 0 : item.capacityLb;
}
export function canCarry(item, cargoLb) {
    const cap = carryCapacityLb(item);
    return cap >= cargoLb ? {ok: true, reasons: []} : fail(cap === 0 ? `The ${item.name ?? 'bag'} is torn and cannot hold loose cargo.` : `It holds ${cap} lb, not ${cargoLb}.`);
}

// PS05 stepping stones: the DC and consequences are declared before any roll. A retry needs a changed approach; re-rolling the same approach replays the saved receipt.
export const STEPPING_STONES = Object.freeze({id: 'dnd.ps05.stepping-stones', dc: 12, ability: 'dex', failure: 'You slip into the shallows: wet gear and a lost half hour, no lasting harm.', provisional: true});
export function steppingStonesAttempt(profile, rootSeed, actor, tried, approach, gameTime) {
    const prior = tried.find(t => t.approach === approach);
    if (prior) return {ok: true, replay: true, receipt: replayCheck(prior.receipt).receipt, reasons: ['Same approach: the earlier roll stands.']};
    const check = {id: `${STEPPING_STONES.id}:${approach}`, target: STEPPING_STONES.dc,
        modifiers: (actor.stepBonus ? [{id: 'dex', kind: 'bonus', value: actor.stepBonus, reason: 'Dexterity modifier'}] : [])
            .concat(actor.careful ? [{id: 'careful', kind: 'advantage', reason: 'Testing each stone first'}] : [])};
    const drawAddress = {root: rootSeed, worldId: DND_WORLD_ID, lifeId: actor.lifeId, gameTime, eventId: `${STEPPING_STONES.id}:${tried.length}:${approach}`};
    address(drawAddress);
    const out = resolveCheck(profile, check, drawAddress);
    return {ok: true, replay: false, receipt: out.receipt, success: out.result.success, saved: {approach, receipt: out.receipt}, reasons: out.result.success ? [] : [STEPPING_STONES.failure]};
}
