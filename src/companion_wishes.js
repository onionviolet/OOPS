// W3 G29: companion wishes and leaving for the wild. Pure: bond state in, new state out.
// Grim Brood villagers carry a wish, no two neighbours share one, and they leave after bad nights
// (BATCH_COMPANIONS). Here a wish is a small predicate over the bond, an ignored wish for a while
// sends a free person back to the road, and a way back always exists. Every number is a profile
// default with an in-world reason, not a rule for all companions (AD1, AD38, AD22).
import {seeded} from './lineage_traits.js';

export const DAY = 24 * 60;
export const COMPANION_PROFILES = Object.freeze({
    free: Object.freeze({id: 'free', leaves: true, patienceDays: 14, holdLevel: 6, returnAfterDays: 3, grantGain: 2,
        reason: 'People with lives of their own: a wish ignored for two weeks sends them back to the road unless the bond is strong enough to hold them.'}),
    bound: Object.freeze({id: 'bound', leaves: false, patienceDays: 14, holdLevel: 6, returnAfterDays: 3, grantGain: 2,
        reason: 'Tied to the story and the party: he voices wishes but does not leave, because the party and its fights depend on him.'}),
});
export const profileFor = key => (key.startsWith('party:') ? 'bound' : 'free');
export const WISH_RITE_COUNT = 2, WISH_LEVEL_STEP = 3;

const signature = w => (w.kind === 'rite' ? `rite:${w.rite}` : `level:${w.target}`);
const WISH_PHRASE = {share_meal: 'share a meal', walk_together: 'walk together', quiet_company: 'sit in quiet company', trade_stories: 'trade stories', work_alongside: 'work side by side'};
export const wishText = w => (w.kind === 'rite'
    ? `wishes you would ${WISH_PHRASE[w.rite]} ${w.need - w.done} more ${w.need - w.done === 1 ? 'time' : 'times'}`
    : `hopes the bond between you reaches ${w.target}`);

// One open wish for `key`. `taken` holds the signatures of other companions' open wishes; the pick
// moves on until it is not among them (no two neighbours with an identical wish).
export function issueWish(key, bond, now, rites, taken = []) {
    const ids = Object.keys(rites), rng = seeded(`${key}:${bond?.issued ?? 0}`);
    const start = Math.floor(rng() * (ids.length + 1));
    for (let i = 0; i <= ids.length; i++) {
        const pick = (start + i) % (ids.length + 1);
        const wish = pick === ids.length
            ? {kind: 'level', target: (bond?.level || 0) + WISH_LEVEL_STEP, since: now}
            : {kind: 'rite', rite: ids[pick], need: WISH_RITE_COUNT, done: 0, since: now};
        if (!taken.includes(signature(wish))) return wish;
    }
    return {kind: 'level', target: (bond?.level || 0) + WISH_LEVEL_STEP + taken.length, since: now};
}
export const wishSignature = signature;

// After a rite: progress the wish; a granted wish raises the bond and clears itself.
export function progressWish(bond, rite, profile) {
    const w = bond.wish;
    if (!w) return bond;
    const wish = w.kind === 'rite' && w.rite === rite ? {...w, done: w.done + 1} : w;
    const granted = wish.kind === 'rite' ? wish.done >= wish.need : bond.level >= wish.target;
    if (!granted) return {...bond, wish};
    return {...bond, wish: undefined, level: bond.level + profile.grantGain, note: 'Their wish was granted.'};
}

// A free person with an old, unmet wish and a bond below the hold level leaves. Returns the `gone`
// record or null.
export function departure(bond, now, profile, name) {
    if (!profile.leaves || bond.gone || !bond.wish) return null;
    const waited = Math.floor((now - bond.wish.since) / DAY);
    if (waited < profile.patienceDays || bond.level >= profile.holdLevel) return null;
    return {since: now, reason: `${name} waited ${waited} days for a wish nobody answered and went back to the road.`.slice(0, 120)};
}
export const returnInDays = (bond, now, profile) => (bond.gone ? Math.max(0, Math.ceil((bond.gone.since + profile.returnAfterDays * DAY - now) / DAY)) : 0);
export function comeBack(key, bond, now, profile, rites, taken = []) {
    if (!bond.gone) throw new Error('They have not left.');
    if (returnInDays(bond, now, profile) > 0) throw new Error('Too soon to find them; give it a few days.');
    const next = {...bond, gone: undefined, issued: (bond.issued ?? 0) + 1, note: 'They came back when you went looking.'};
    next.wish = issueWish(key, next, now, rites, taken);
    return next;
}
