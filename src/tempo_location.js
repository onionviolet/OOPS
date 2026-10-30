import {harmOdds} from './harm_engine.js';
import {HARM_RUNGS, harmRules} from './harm_state.js';

// Hit location for tempo fights (G6): where a blow lands, what the armour on that slot stops, and what the
// injury does to the next action. Weights and scales are defaults with a dial and a reason; the injury ladder
// itself belongs to harm_state.js (L9) and is read here through its public door. Pure: draws arrive as a function.
export const SLOTS = {
    head: {label: 'head', part: 'eyes', weight: .12, scale: 1.4, why: 'A blow to the head is hard to land and does more harm when it does.'},
    torso: {label: 'body', part: null, weight: .46, scale: 1, why: 'The widest target and the one most blows are meant for.'},
    arms: {label: 'arm', part: 'hands', weight: .2, scale: .75, why: 'Arms are often raised and take glancing blows.'},
    legs: {label: 'leg', part: 'legs', weight: .22, scale: .75, why: 'Legs are low and quick to move; blows there lose some force.'}
};
export const SLOT_IDS = Object.keys(SLOTS);
export const LOCATION_DIALS = {
    guardHead: {value: .5, why: 'A braced fighter keeps the head covered.'},
    swingWide: {value: 1.2, why: 'A heavy swing travels wide and reaches arms and head more often.'},
    jabCentre: {value: 1.2, why: 'A quick strike goes for the middle of the body.'},
    reachLong: {value: 1.25, why: 'Long reach lifts head and arm hits; short reach lifts body and leg hits.'},
    aimShare: {value: .35, why: 'Aiming gives a good chance at the chosen spot, never a sure one.'},
    aimCost: {value: 1, why: 'Taking aim costs a little time.'},
    aimHitPenalty: {value: .9, why: 'Aiming at a small mark makes the blow easier to avoid.'},
    pierceGap: {value: .4, why: 'A piercing point finds the gaps between plates: it ignores up to this share of the slot armour.'},
    injuryAt: {value: [.08, .18, .3], why: 'Share of maximum health one blow takes before it bruises, wounds, or badly wounds a part.'}
};
const RUNG_CAP = HARM_RUNGS.indexOf('maimed');

export function weights(attacker, target, move, aim, precision = 1) {
    const d = LOCATION_DIALS, w = Object.fromEntries(SLOT_IDS.map(id => [id, SLOTS[id].weight]));
    if(target.guard) w.head *= d.guardHead.value;
    if(move.id === 'swing') {w.arms *= d.swingWide.value; w.head *= d.swingWide.value;} else {w.torso *= d.jabCentre.value;}
    const reach = attacker.profile.reach ?? 1;
    if(reach > 1) {w.head *= d.reachLong.value; w.arms *= d.reachLong.value;} else if(reach < 1) {w.torso *= d.reachLong.value; w.legs *= d.reachLong.value;}
    const total = SLOT_IDS.reduce((a, id) => a + w[id], 0);
    for(const id of SLOT_IDS) w[id] /= total;
    if(aim && w[aim] !== undefined) {
        const share = Math.min(.9, d.aimShare.value * precision);
        for(const id of SLOT_IDS) w[id] = id === aim ? w[id] * (1 - share) + share : w[id] * (1 - share);
    }
    return w;
}
// One keyed draw picks the slot from the cumulative weights.
export function pickSlot(w, roll) {
    let acc = 0;
    for(const id of SLOT_IDS) {acc += w[id]; if(roll < acc) return id;}
    return SLOT_IDS[SLOT_IDS.length - 1];
}

// Armour per slot is the wearer's own worn defence in that slot over a base that covers everything.
export function defenceAt(profile, slot, typed = null) {
    const total = profile.stats.defense ?? 0, by = profile.armorBySlot;
    if(!by) return {total, base: total, worn: 0};
    const worn = SLOT_IDS.reduce((a, id) => a + (by[id] || 0), 0), base = Math.max(0, total - worn);
    return {total: base + (by[slot] || 0) * (1 - LOCATION_DIALS.pierceGap.value * (typed?.split?.piercing || 0)), base, worn: by[slot] || 0};
}

// Parts are the L9 ladder rows; the fight keeps each fighter's own so odds shift by degree on later actions.
const harmSave = parts => ({harm: {schema: 1, backlash: {}, ...(Object.keys(parts || {}).length ? {parts: Object.fromEntries(Object.entries(parts).map(([id, rung]) => [id, {rung}]))} : {})},
    expansion: {actors: {player: {worldId: 'default'}}}});
export function oddsOf(f) {
    const r = harmOdds(harmSave(f.parts), 'fight'), mult = axis => r['odds.shift'].filter(m => m.axis === axis && m.kind === 'mult').reduce((a, m) => a * (1 + m.delta), 1);
    return {accuracy: mult('accuracy'), evasion: mult('evasion'), speed: mult('speed'), precision: mult('precision'), allowed: r.allowed, blockedBy: r.blockedBy,
        causes: r['versus.you.mods'].map(m => m.cause), shift: r['odds.shift'].filter(m => m.kind === 'mult').map(m => ({axis: m.axis, delta: m.delta}))};
}
export const partLabel = id => harmRules(harmSave({})).parts?.[id]?.label || id;

// A blow that takes enough health hurts the part it landed on; repeated blows on one part deepen it, one rung at a time.
export function injuryFor(current, dmg, maxHp, critted) {
    const [a, b, c] = LOCATION_DIALS.injuryAt.value, frac = dmg / Math.max(1, maxHp);
    let idx = frac >= c ? 2 : frac >= b ? 1 : frac >= a ? 0 : -1;
    if(idx < 0) return null;
    if(critted) idx = Math.min(2, idx + 1);
    const had = current ? HARM_RUNGS.indexOf(current) : -1;
    const next = Math.min(RUNG_CAP, idx >= had ? Math.max(idx, had + 1) : had);
    return next > had ? HARM_RUNGS[next] : null;
}
export function validateParts(parts) {
    return parts === undefined || (parts && typeof parts === 'object' && Object.entries(parts).every(([id, rung]) => ['eyes', 'hands', 'legs', 'voice'].includes(id) && HARM_RUNGS.includes(rung)));
}
