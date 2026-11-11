// One needs seam (RCL12, LVR13, BHR16; proposal under AD55). A need is a kind (food), a level that drains per played minute
// at the body's own rate, what satisfies it, and what a low level does. Pure: it never ticks, rolls or writes a save.
// The shape follows two decompiled games: RimWorld's food need drains on an interval and its malnutrition only rises
// while starving (FRC43); Kenshi gives each body its own hunger rate, heal and strength multipliers, and a skeleton never
// hungers (FRC44, BODIES B4). Default: a low need slows and weakens, it does not kill (BHR16, LVR15). Dial: a world sets
// `kills` with Weibao's direction, an in-world reason and forewarning. Callers: living_upkeep.js (Gu keeper),
// habitat_care.js (meadow pen), absorb_p23/household/model.js (Moss). Each adapts its own state to this reading.
const fail = message => { throw new Error(message); };
const positive = n => Number.isFinite(n) && n > 0;

// What a kind is, what meets it, and the default consequences by stage. Multipliers are on work/strength and on healing.
export const NEED_KINDS = Object.freeze({
    food: Object.freeze({label: 'Food', satisfiedBy: 'a meal of the body\'s own food',
        stages: Object.freeze({fed: {work: 1, heal: 1}, peckish: {work: 1, heal: 1}, hungry: {work: 0.75, heal: 0.5}, starved: {work: 0.5, heal: 0}})})
});

// Per-body data. `rate` multiplies drain (1 = the body's ordinary meal schedule, 0 = never needs it). `rationMinutes` is how
// long one ration holds at rate 1, when the body has one fixed ration (a diet may carry its own). `selfFed` means the body
// meets the need itself (a cat that hunts outside) so it costs the player nothing. `heal` and `strength` are body multipliers.
export const BODIES = Object.freeze({
    human: Object.freeze({label: 'Human', heal: 1, strength: 1, food: Object.freeze({rate: 1})}),
    gu: Object.freeze({label: 'Gu', heal: 1, strength: 1, food: Object.freeze({rate: 1})}),
    sheep: Object.freeze({label: 'Fleece sheep', heal: 1, strength: 1, food: Object.freeze({rate: 1, rationMinutes: 12})}),
    house_cat: Object.freeze({label: 'House cat', heal: 1, strength: 1, food: Object.freeze({rate: 1, selfFed: true})}),
    construct: Object.freeze({label: 'Construct', heal: 1, strength: 1, food: Object.freeze({rate: 0})})
});

export const bodyData = body => BODIES[body] ?? fail(`Needs: unknown body "${body}".`);
export const needRate = (body, kind = 'food') => {
    NEED_KINDS[kind] ?? fail(`Needs: unknown need "${kind}".`);
    const n = bodyData(body)[kind];
    return n ? n.rate : 0;
};
export const needsAny = (body, kind = 'food') => needRate(body, kind) > 0;
export const isSelfFed = (body, kind = 'food') => !!bodyData(body)[kind]?.selfFed;

// How long a ration of `baseMinutes` (at rate 1) lasts this body. A zero rate never runs out.
export function rationMinutes(body, kind = 'food', baseMinutes = bodyData(body)[kind]?.rationMinutes) {
    const rate = needRate(body, kind);
    if(rate === 0) return Infinity;
    positive(baseMinutes) || fail('Needs: a ration length must be positive.');
    return Math.max(1, Math.round(baseMinutes / rate));
}
// Fraction of a full level lost per played minute.
export const drainPerMinute = (body, kind = 'food', baseMinutes) => { const r = rationMinutes(body, kind, baseMinutes); return r === Infinity ? 0 : 1 / r; };

// Read a need. `sinceMeal` = played minutes since the last meal (null/undefined = never fed, treated as a full missed ration).
// Level falls from 1 to 0 across one ration; every further ration missed is one more missed meal. Stage: fed (>0.5),
// peckish (>0), hungry (1 missed), starved (`starveAfter` or more). `kills` is only true when the dial says so.
export function readNeed({body, kind = 'food', sinceMeal = 0, baseMinutes, starveAfter = 3, kills = false, reason} = {}) {
    const rate = needRate(body, kind), traits = bodyData(body);
    const none = {body, kind, rate, level: 1, drain: 0, missed: 0, stage: 'fed', needed: false, selfFed: isSelfFed(body, kind), satisfiedBy: NEED_KINDS[kind].satisfiedBy,
        effect: {work: traits.strength, heal: traits.heal, kills: false}};
    if(rate === 0) return none;
    const ration = rationMinutes(body, kind, baseMinutes), t = sinceMeal == null ? ration : Math.max(0, sinceMeal);
    const level = Math.max(0, 1 - t / ration), missed = level > 0 ? 0 : Math.max(1, Math.floor(t / ration));
    const stage = level > 0.5 ? 'fed' : level > 0 ? 'peckish' : missed >= starveAfter ? 'starved' : 'hungry', s = NEED_KINDS[kind].stages[stage];
    if(kills && !(typeof reason === 'string' && reason)) fail('Needs: a lethal need needs an in-world reason (BHR16).');
    return {...none, needed: true, level, drain: 1 / ration, missed, stage,
        effect: {work: s.work * traits.strength, heal: s.heal * traits.heal, kills: !!kills && stage === 'starved'}};
}
