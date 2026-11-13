// Gifts, tastes and daily talk as sources of dated thoughts (proposal under AD32; docs/research/stardew-valley/DIALOGUE_AND_EVENTS.md,
// rune-factory-5/DIALOGUE_AND_HELPERS_DIGEST.md, crush-crush/REPORT.md). Pure and world-neutral (AR3): a world supplies the people, their
// tastes and the day; this module turns one act into one thought row for mood_thoughts.addThought. It stores nothing.
// Shape taken from Stardew: five taste tiers, a gift and a daily talk each move how a person feels, birthdays count for more.
// Changed to fit OOPS: there is no friendship number. Each act is a dated row attributed to the giver that runs out by itself, so
// fading is real absence (AD38): no contact, no new rows. The standing tie (person_ties) is untouched; canon moments still own it.
// No daily cap on gifts (RF5's per-channel limits come from the core instead: the same cause about the same person keeps its newest
// three rows, THOUGHT_LIMITS.stack), so a fourth gift in a row only replaces the oldest. Talk counts once a day (the key names the day);
// a second talk the same day is pleasant and writes nothing. Missing a day costs nothing beyond rows running out on schedule (TIE15).

// Calibration hints (SKR21 order: borrowed from a named sibling source, then assumed). Magnitudes are Stardew's receiveGift points
// divided by ten (loved 80, liked 45, neutral 20, disliked -20, hated -40; talk 20): borrowed. Run lengths in days are assumed.
// Birthday: Stardew multiplies by 8; here by 3 (assumed). Rejected 8 because a loved birthday gift would pass the core's cap of 50
// and drown every other row for a week.
export const CONTACT_TIERS = Object.freeze({
    love: Object.freeze({magnitude: 8, days: 6}),
    like: Object.freeze({magnitude: 4, days: 4}),
    neutral: Object.freeze({magnitude: 2, days: 2}),
    dislike: Object.freeze({magnitude: -2, days: 3}),
    hate: Object.freeze({magnitude: -4, days: 4})});
export const CONTACT_LIMITS = Object.freeze({talk: Object.freeze({magnitude: 2, days: 3, minutes: 10}), giftMinutes: 5,
    birthdayFactor: 3, magnitudeCap: 50, dayMinutes: 1440});
export const CONTACT_SOURCES = Object.freeze({gift: 'social.gift', birthday: 'social.birthday', talk: 'social.talk'});
const TIERS = Object.keys(CONTACT_TIERS);
const idOk = v => typeof v === 'string' && /^[a-z0-9][a-z0-9._-]{0,119}$/i.test(v);

// tastes: {items: {itemId: tier}, tags: [{tag, tier}]}. Most specific first: the person's row for the item, then the first tag rule the
// item carries, then neutral. `basis` says which matched, so a test or an inspector can see why.
export function tasteOf(tastes, itemId, tags = []) {
    const direct = tastes?.items?.[itemId];
    if(TIERS.includes(direct)) return {tier: direct, basis: 'item'};
    const rule = (tastes?.tags || []).find(r => TIERS.includes(r.tier) && tags.includes(r.tag));
    return rule ? {tier: rule.tier, basis: `tag:${rule.tag}`} : {tier: 'neutral', basis: 'default'};
}

// The words of a row. Lowercase, second person, no final period: the mood reader puts them after "They are in good humour with you:".
// `phrase` is how the item reads mid-sentence ("a treacle tart"); `pronoun` is {him, he, his}.
const giftLines = Object.freeze({
    love: (p, x) => `you gave ${p.him} ${x}, just the thing ${p.he} likes best`,
    like: (p, x) => `you gave ${p.him} ${x}, and ${p.he} was glad of it`,
    neutral: (p, x) => `you gave ${p.him} ${x}; ${p.he} said thanks`,
    dislike: (p, x) => `you gave ${p.him} ${x}, which ${p.he} could have done without`,
    hate: (p, x) => `you gave ${p.him} ${x}, and ${p.he} has not forgotten it`});
const clampMag = n => Math.max(-CONTACT_LIMITS.magnitudeCap, Math.min(CONTACT_LIMITS.magnitudeCap, n));

// One gift as a thought row for addThought. `now` is the played minute after the act; the key names the minute, so replaying the same
// act writes nothing twice while a later gift still counts. `tempo(minutes, magnitude)` lets the world scale a run by the holder's
// temperament (as the LOTM Dunn rows do); identity by default.
export function giftThought({holder, giver = 'player', tier, phrase, pronoun, birthday = false, now, tempo = m => m}) {
    const t = CONTACT_TIERS[tier];
    if(!t || !idOk(holder) || !idOk(giver) || typeof phrase !== 'string' || !phrase || !Number.isSafeInteger(now)) throw TypeError('Invalid gift.');
    const magnitude = clampMag(birthday ? t.magnitude * CONTACT_LIMITS.birthdayFactor : t.magnitude);
    const days = birthday ? t.days * 2 : t.days;
    const line = `${birthday ? `on ${pronoun.his} birthday, ` : ''}${giftLines[tier](pronoun, phrase)}`;
    return {holder, subject: giver, source: birthday ? CONTACT_SOURCES.birthday : CONTACT_SOURCES.gift, magnitude,
        minutes: Math.max(1, Math.round(tempo(days * CONTACT_LIMITS.dayMinutes, magnitude))), line, key: `social.gift.${holder}.${giver}.m${now}`};
}
// One talk as a row. Keyed by the day, so a second talk that day is a no-op for the mood.
export function talkThought({holder, giver = 'player', pronoun, day, tempo = m => m}) {
    if(!idOk(holder) || !idOk(giver) || !Number.isSafeInteger(day) || day < 0) throw TypeError('Invalid talk.');
    const {magnitude, days} = CONTACT_LIMITS.talk;
    return {holder, subject: giver, source: CONTACT_SOURCES.talk, magnitude, minutes: Math.max(1, Math.round(tempo(days * CONTACT_LIMITS.dayMinutes, magnitude))),
        line: `you sat and talked with ${pronoun.him} for a while`, key: `social.talk.${holder}.${giver}.d${day}`};
}
