// OB8/OB9 (LARGER_FOUNDATIONS): an obligation needs an authority with a claim, knowledge and reach; being unknown is a state you hold.
// A world-neutral read seam. Nothing here stores, saves or imports a world: each world registers a bounds source (who claims this place, does the claim
// reach it) and, for OB9, knownness readers (what the player has done that an authority could hear about). Every answer is derived on read from facts
// other owners already keep, so an untouched save gains no key.
//  authorityOver(state, {world, place, registered, holder, ctx}) -> {claimant, knows, reach, why, short, knownBy}
//    claimant  id of the authority whose claim covers the place, or null (no one claims it).
//    reach     true when that claim extends to the place (inside the settlement's bounds, or the world's reach rule says so).
//    knows     true when the claimant (or, for unclaimed ground, the nearest authority `near`) has been told: `registered` by the caller, or knownness >= 1.
//    A world with no source, or a place no source claims, answers {claimant: null, reach: false, knows: false}: dues are owed to no one.
//  knownness(state, authorityId, ctx) -> {authority, value, level, signals[]}  level: unknown (0), noticed (< 3), known. Signals are your own acts
//    (trading at its market, a rumour, a position); an event outside your acts (a surveyor, hunters) would be one more reader, not a new rule.
export const KNOWN_AT = 1, WELL_KNOWN_AT = 3;
const text = v => typeof v === 'string' && v.length > 0;
const sources = new Map(), readers = new Map();
// fn(state, {place, ctx}) -> null | {claimant, label?, inBounds?, near?, nearLabel?}. A thrown error means "no claim".
export function registerAuthoritySource(worldId, fn) {
    if(!text(worldId) || typeof fn !== 'function') throw Error('An authority source needs a world id and a reader.');
    sources.set(worldId, fn);
}
// OB11: claims that other owners hold (a founded group's staked ground). A claim reader is checked BEFORE the world's source, so it never replaces it.
// fn(state, {world, place}) -> null | {claimant, label, holder?, short?, why?}. The claimant is the claim's holder and knows its own ground.
const claimReaders = new Map();
export function registerClaimSource(id, fn) {
    if(!text(id) || typeof fn !== 'function') throw Error('A claim source needs an id and a reader.');
    claimReaders.set(id, fn);
}
// fn(state, ctx) -> [{id, weight, text}] for one authority id. Several readers may serve one authority.
export function registerKnownness(authorityId, fn) {
    if(!text(authorityId) || typeof fn !== 'function') throw Error('A knownness reader needs an authority id and a reader.');
    readers.set(authorityId, [...(readers.get(authorityId) ?? []), fn]);
}
export function knownness(state, authorityId, ctx = {}) {
    const signals = [];
    for(const read of readers.get(authorityId) ?? []) {
        let rows; try { rows = read(state, ctx) || []; } catch { continue; }
        for(const r of rows) if(r && text(r.id) && Number.isFinite(r.weight) && r.weight > 0) signals.push({id: r.id, weight: r.weight, text: String(r.text ?? '')});
    }
    const value = signals.reduce((n, s) => n + s.weight, 0);
    return {authority: authorityId, value, level: value >= WELL_KNOWN_AT ? 'known' : value >= KNOWN_AT ? 'noticed' : 'unknown', signals};
}
const NO_ONE = Object.freeze({claimant: null, knows: false, reach: false, knownBy: null, short: 'no one claims this land', why: 'No one claims this land.'});
export function authorityOver(state, {world, place, registered = false, holder = null, ctx = {}} = {}) {
    for(const read of claimReaders.values()) {
        let held = null; try { held = read(state, {world, place}); } catch { held = null; }
        if(held && text(held.claimant)) {
            const label = text(held.label) ? held.label : held.claimant;
            return {claimant: held.claimant, knows: true, reach: true, knownBy: held.claimant, holder: text(held.holder) ? held.holder : label, claimedBy: 'claim',
                short: text(held.short) ? held.short : `${label} claims it`, why: text(held.why) ? held.why : `${cap(label)} claims this ground.`};
        }
    }
    const read = sources.get(world);
    let claim = null;
    if(read) { try { claim = read(state, {place, ctx}); } catch { claim = null; } }
    if(!claim || (!text(claim.claimant) && !text(claim.near))) return {...NO_ONE};
    const label = text(claim.label) ? claim.label : claim.claimant;
    if(!text(claim.claimant)) { // unclaimed ground beside an authority that may hear of you: nobody to owe, but somebody may know
        const heard = knownness(state, claim.near, ctx).value >= KNOWN_AT;
        const near = text(claim.nearLabel) ? claim.nearLabel : claim.near;
        return {claimant: null, knows: heard, reach: false, knownBy: heard ? claim.near : null,
            short: heard ? `no one claims this land, though ${near} has heard of it` : NO_ONE.short,
            why: heard ? `No one claims this land. ${cap(near)} has heard of it, but it is not theirs.` : NO_ONE.why};
    }
    const reach = claim.inBounds !== false;
    if(!reach) return {claimant: claim.claimant, knows: false, reach: false, knownBy: null, short: `${label} claims it but cannot reach it`, why: `${cap(label)} claims this ground on paper but cannot reach it.`};
    const knows = registered === true || knownness(state, claim.claimant, ctx).value >= KNOWN_AT;
    return {claimant: claim.claimant, knows, reach: true, knownBy: knows ? claim.claimant : null, holder: text(holder) ? holder : label,
        short: knows ? `${label} knows of it` : `${label} claims the ground but does not know of it`,
        why: knows ? `${cap(label)} claims this ground and knows of it.` : `${cap(label)} claims this ground but does not know of it yet.`};
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
