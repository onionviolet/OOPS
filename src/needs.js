// One needs seam (RCL12, LVR13, BHR16; proposal under AD55). A need is a kind (food), a level that drains per played minute
// at the body's own rate, what satisfies it, and what a low level does. Pure: it never ticks, rolls or writes a save.
// The shape follows two decompiled games: RimWorld's food need drains on an interval and its malnutrition only rises
// while starving (FRC43); Kenshi gives each body its own hunger rate, heal and strength multipliers, and a skeleton never
// hungers (FRC44, BODIES B4). Default: a low need slows and weakens, it does not kill (BHR16, LVR15). Dial: a world sets
// `kills` with Weibao's direction, an in-world reason and forewarning. Callers: living_upkeep.js (Gu keeper),
// habitat_care.js (meadow pen), absorb_p23/household/model.js (Moss). Each adapts its own state to this reading.
// Rest (FRC52) is the second kind on the same interval shape (RimWorld's rest need falls while awake and refills in bed;
// its exhausted stage slows, it does not kill): `since` is the body's sleep debt in awake-minute equivalents, which
// `settleRest` raises while awake and lowers while asleep. The Tingen lead's harm slice carries it (harm_state.js).
const fail = message => { throw new Error(message); };
const positive = n => Number.isFinite(n) && n > 0;

// What a kind is, what meets it, and the default consequences by stage. Multipliers are on work/strength and on healing.
// `order` names the four stages from full to empty; the reader picks by position, so each kind keeps its own words.
export const NEED_KINDS = Object.freeze({
    food: Object.freeze({label: 'Food', satisfiedBy: 'a meal of the body\'s own food', order: Object.freeze(['fed', 'peckish', 'hungry', 'starved']),
        labels: Object.freeze({fed: 'Fed', peckish: 'Peckish', hungry: 'Hungry', starved: 'Starved'}),
        stages: Object.freeze({fed: {work: 1, heal: 1}, peckish: {work: 1, heal: 1}, hungry: {work: 0.75, heal: 0.5}, starved: {work: 0.5, heal: 0}})}),
    // Proposed dials: tired works at 0.85 and heals at 0.75, exhausted at 0.6 and 0.5 (a worn body still mends, slower).
    rest: Object.freeze({label: 'Rest', satisfiedBy: 'sleep', order: Object.freeze(['rested', 'drowsy', 'tired', 'exhausted']),
        labels: Object.freeze({rested: 'Rested', drowsy: 'Drowsy', tired: 'Tired', exhausted: 'Exhausted'}),
        stages: Object.freeze({rested: {work: 1, heal: 1}, drowsy: {work: 1, heal: 1}, tired: {work: 0.85, heal: 0.75}, exhausted: {work: 0.6, heal: 0.5}})})
});

// Per-body data. `rate` multiplies drain (1 = the body's ordinary meal schedule, 0 = never needs it). `rationMinutes` is how
// long one ration holds at rate 1, when the body has one fixed ration (a diet may carry its own). `selfFed` means the body
// meets the need itself (a cat that hunts outside) so it costs the player nothing. `heal` and `strength` are body multipliers:
// `heal` scales recovery time through harm_state (restBacklash, healPart), `strength` scales the work multiplier a need reports.
// Rest rows: `rationMinutes` is how long a full night holds awake (16 hours), `refill` how many awake-minutes one minute of
// sleep repays (2: eight hours repays sixteen). A body without a rest row never tires.
const HUMAN_REST = Object.freeze({rate: 1, rationMinutes: 960, refill: 2});
export const BODIES = Object.freeze({
    human: Object.freeze({label: 'Human', heal: 1, strength: 1, food: Object.freeze({rate: 1}), rest: HUMAN_REST}),
    // No rest row: a Gu has no sleep path in the keeper's care (it is fed, not bedded); a world that lets Gu go dormant adds one.
    gu: Object.freeze({label: 'Gu', heal: 1, strength: 1, food: Object.freeze({rate: 1})}),
    // The sheep and the cat sleep on their own schedule in their pen or by the hearth: self-met, no cost to the player.
    sheep: Object.freeze({label: 'Fleece sheep', heal: 1, strength: 1, food: Object.freeze({rate: 1, rationMinutes: 12}), rest: Object.freeze({...HUMAN_REST, selfMet: true})}),
    house_cat: Object.freeze({label: 'House cat', heal: 1, strength: 1, food: Object.freeze({rate: 1, selfFed: true}), rest: Object.freeze({...HUMAN_REST, selfMet: true})}),
    // Kenshi B4: the skeleton has hunger rate 0 and its rebirth patch sets heal rate 2 (repair, not flesh, mends it).
    // A construct never tires (rest rate 0). Dial: a world whose constructs run down adds a rest row with its own refill.
    construct: Object.freeze({label: 'Construct', heal: 2, strength: 1, food: Object.freeze({rate: 0}), rest: Object.freeze({rate: 0})})
});

export const bodyData = body => BODIES[body] ?? fail(`Needs: unknown body "${body}".`);
export const needRate = (body, kind = 'food') => {
    NEED_KINDS[kind] ?? fail(`Needs: unknown need "${kind}".`);
    const n = bodyData(body)[kind];
    return n ? n.rate : 0;
};
export const needsAny = (body, kind = 'food') => needRate(body, kind) > 0;
export const isSelfFed = (body, kind = 'food') => !!(bodyData(body)[kind]?.selfFed || bodyData(body)[kind]?.selfMet);

// How long a ration of `baseMinutes` (at rate 1) lasts this body. A zero rate never runs out.
export function rationMinutes(body, kind = 'food', baseMinutes = bodyData(body)[kind]?.rationMinutes) {
    const rate = needRate(body, kind);
    if(rate === 0) return Infinity;
    positive(baseMinutes) || fail('Needs: a ration length must be positive.');
    return Math.max(1, Math.round(baseMinutes / rate));
}
// Fraction of a full level lost per played minute.
export const drainPerMinute = (body, kind = 'food', baseMinutes) => { const r = rationMinutes(body, kind, baseMinutes); return r === Infinity ? 0 : 1 / r; };

// Read a need. `sinceMeal` (or `since`) = played minutes since the last meal (null/undefined = never fed, treated as a full
// missed ration); for rest it is the sleep debt. Level falls from 1 to 0 across one ration; every further ration missed is one
// more missed meal. Stage by position in the kind's `order`: full (>0.5), low (>0), short (1 missed), out (`starveAfter` or
// more): fed/peckish/hungry/starved for food, rested/drowsy/tired/exhausted for rest. `kills` is only true when the dial says so.
export function readNeed({body, kind = 'food', since, sinceMeal = since ?? 0, baseMinutes, starveAfter = 3, kills = false, reason} = {}) {
    const rate = needRate(body, kind), traits = bodyData(body), k = NEED_KINDS[kind];
    const none = {body, kind, rate, level: 1, drain: 0, missed: 0, stage: k.order[0], stageLabel: k.labels[k.order[0]], needed: false, selfFed: isSelfFed(body, kind), satisfiedBy: k.satisfiedBy,
        effect: {work: traits.strength, heal: traits.heal, kills: false}};
    if(rate === 0) return none;
    const ration = rationMinutes(body, kind, baseMinutes), t = sinceMeal == null ? ration : Math.max(0, sinceMeal);
    const level = Math.max(0, 1 - t / ration), missed = level > 0 ? 0 : Math.max(1, Math.floor(t / ration));
    const stage = k.order[level > 0.5 ? 0 : level > 0 ? 1 : missed >= starveAfter ? 3 : 2], s = k.stages[stage];
    if(kills && !(typeof reason === 'string' && reason)) fail('Needs: a lethal need needs an in-world reason (BHR16).');
    return {...none, needed: true, level, drain: 1 / ration, missed, stage, stageLabel: k.labels[stage],
        effect: {work: s.work * traits.strength, heal: s.heal * traits.heal, kills: !!kills && stage === k.order[3]}};
}

// Sleep debt after `awake` and then `asleep` played minutes. Awake adds minutes at the body's rest rate; sleep repays `refill`
// awake-minutes per minute, down to 0. The debt stops growing at `starveAfter`+1 rations (an integrity bound, past exhausted).
export function settleRest({body, debt = 0, awake = 0, asleep = 0, starveAfter = 3}) {
    [debt, awake, asleep].every(n => Number.isFinite(n) && n >= 0) || fail('Needs: rest minutes must be non-negative.');
    const row = bodyData(body).rest, rate = needRate(body, 'rest');
    if(rate === 0) return 0;
    const cap = rationMinutes(body, 'rest') * (starveAfter + 1);
    return Math.max(0, Math.min(cap, debt + awake * rate) - asleep * (row.refill ?? 1));
}
