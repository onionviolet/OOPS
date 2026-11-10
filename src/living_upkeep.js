// Living-item upkeep (new seam, 2026-10-30; proposal under AD32). A living item (Gu, a creature, a companion)
// has a holder, a diet (food key, amount per meal, interval) and a condition that falls on each missed meal.
// This module is pure: it compiles diets into the ambient event rows the simulation already runs (reset, death,
// meal, hunger), predicts when each holder is next fed and when it would starve, and answers how many living items
// a food budget sustains. It never ticks, rolls or writes a save. Feeding is a soft cap: it never blocks holding
// another item (acquisition has its own price); an item that cannot be fed starves on the schedule shown here.
// Dials (authored, with reason): maxCondition is how many missed meals a body takes (damage falls by one each missed
// meal and the next miss after condition 1 is death); a hardier `refined` variant eats less per meal.
// Hunger is read through the one needs seam (needs.js, RCL12/LVR13): `diet.body` (default 'gu') names the body whose food rate
// stretches or shrinks the authored `interval`, and a body with rate 0 (a construct) never hungers, so it compiles no rows.
// `lethal` is opt-in (BHR16, LVR15: no hunger death by default); the Gu keeper already sets it false.
import {needRate, readNeed} from './needs.js';
export const UPKEEP_FAMILY = 'upkeep@1';
const fail = message => { throw new Error(message); };
const natural = n => Number.isSafeInteger(n) && n > 0;
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);

// diet: {holder, label, food, foodLabel, perMeal, interval, maxCondition, flag, refinedFlag?, refinedPerMeal?, lethal?, alt?}
//  `food` is the exact JSON item key; `flag` is the actor fact that says the item is in your care (care pauses
//  while it is false, because a Gu in the clan vault is fed by the vault).
//  `lethal` (default false; true is the dial, needs a reason, BHR16): when false, hunger lowers condition to 1 and stops there, so a held item is starved
//  out (cannot work) but never dies of hunger; recovery is feeding. `alt` is a poorer food {food, foodLabel, perMeal}
//  eaten only when the main food is short: it ends hunger but does not heal.
export function validateDiet(d) {
    idLike(d?.holder) && idLike(d.flag) && typeof d.food === 'string' && d.food && typeof d.label === 'string' || fail('Upkeep: diet needs holder, flag, food and label.');
    needRate(d.body ?? 'gu', 'food') >= 0 || fail('Upkeep: unknown body.');
    natural(d.perMeal) && natural(d.interval) && natural(d.maxCondition) || fail('Upkeep: perMeal, interval and maxCondition must be positive whole numbers.');
    if(d.refinedFlag != null) idLike(d.refinedFlag) && natural(d.refinedPerMeal) && d.refinedPerMeal < d.perMeal || fail('Upkeep: a refined variant needs its flag and a smaller meal.');
    if(d.alt != null) typeof d.alt.food === 'string' && d.alt.food && d.alt.food !== d.food && natural(d.alt.perMeal) || fail('Upkeep: an alternate food needs its own key and meal size.');
    return d;
}

// The diet's authored interval is the meal gap at body rate 1; the body's rate sets the real gap (Infinity: never hungers).
export const dietBody = diet => diet.body ?? 'gu';
export const dietInterval = diet => { const r = needRate(dietBody(diet), 'food'); return r === 0 ? Infinity : Math.max(1, Math.round(diet.interval / r)); };
export const neverHungers = diet => needRate(dietBody(diet), 'food') === 0;
// Seam reading for a held item: minutes since its last meal and where that leaves its need (stage, work/heal multipliers).
export const dietNeed = (diet, sinceMeal) => readNeed({body: dietBody(diet), kind: 'food', sinceMeal, baseMinutes: diet.interval, starveAfter: diet.maxCondition, kills: diet.lethal === true, reason: diet.lethalReason ?? (diet.lethal === true ? 'authored lethal diet' : undefined)});

const eq = (fact, value) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const lt = (fact, value) => ({fact, op: 'lte', value: value - 1});
const all = (...rules) => ({all: rules.filter(Boolean)});
const flagEffect = (key, value) => ({type: 'fact', scope: 'actor', key, value});

// Event rows for one diet. `ids(suffix)` makes the pack-owned id; `note(text)` makes a knowledge effect or null.
// Row order inside a boundary follows the a_/b_/c_/d_ id prefixes the engine sorts by: reset, death, meal, hunger.
export function compileUpkeepEvents(diet, {worldId, ids, note = () => null}) {
    validateDiet(diet);
    if(neverHungers(diet)) return [];
    const n = diet.holder.split('.').pop(), lethal = diet.lethal === true, rows = [], interval = dietInterval(diet);
    const variant = (suffix, perMeal, refinedGate) => {
        const have = (food, op, v) => ({fact: `item.${food}`, op, value: v});
        const kept = eq(`actor.${diet.flag}`, true);
        const gate = refinedGate == null ? null : eq(`actor.${diet.refinedFlag}`, refinedGate);
        const mainShort = lt(`item.${diet.food}`, perMeal), altOk = diet.alt && ge(`item.${diet.alt.food}`, diet.alt.perMeal);
        const short = diet.alt ? all(mainShort, lt(`item.${diet.alt.food}`, diet.alt.perMeal)) : mainShort;
        const base = (id, label, requires, effects, isPublic) => ({id: ids(`care.${n}.${id}`), revision: 1, label, worldId, actorId: diet.holder, interval,
            automatic: true, mode: 'ambient', chance: 1, public: !!isPublic, requires, effects: effects.filter(Boolean)});
        if(lethal) rows.push(base(`b_death${suffix}`, `${diet.label} died after repeated missed meals`, all(kept, gate, short, lt('vital.health', 2)), [
            {type: 'vital', key: 'health', amount: -1}, {type: 'life', status: 'dead', lethal: true, reason: `Repeated missed meals exhausted ${diet.label}.`},
            note(`${diet.label} has died after repeated missed meals. Food bought later cannot restore it.`)], true));
        rows.push(base(`c_meal${suffix}`, `${diet.label} ate`, all(kept, gate, have(diet.food, 'gte', perMeal)), [
            {type: 'item', key: diet.food, amount: -perMeal}, {type: 'vital', key: 'health', amount: 1}, flagEffect(`${diet.flag}.fed`, true),
            note(`${diet.label} ate ${perMeal} ${diet.foodLabel || 'portions'}; its condition recovered by up to one point.`)], true));
        if(diet.alt) rows.push(base(`c_meal_alt${suffix}`, `${diet.label} ate poorer food`, all(kept, gate, mainShort, altOk), [
            {type: 'item', key: diet.alt.food, amount: -diet.alt.perMeal}, flagEffect(`${diet.flag}.fed`, true),
            note(`${diet.label} made do with ${diet.alt.perMeal} ${diet.alt.foodLabel || 'portions'}: it is not hungrier, but it does not heal on poor food.`)], true));
        rows.push(base(`d_hunger${suffix}`, `${diet.label} missed its meal`, all(kept, gate, eq(`actor.${diet.flag}.fed`, false), short, ge('vital.health', 2)), [
            {type: 'vital', key: 'health', amount: -1}, note(`${diet.label} lacked ${perMeal} ${diet.foodLabel || 'portions'} at its meal. Its condition fell by one; ${lethal ? 'feed it before another miss' : 'at condition 1 it is starved out and cannot work until fed'}.`)], true));
    };
    rows.push({id: ids(`care.${n}.a_reset`), revision: 1, label: `${diet.label} meal window opens`, worldId, actorId: diet.holder, interval, automatic: true, mode: 'ambient',
        chance: 1, public: false, requires: null, effects: [flagEffect(`${diet.flag}.fed`, false), ...(diet.resetFlags || []).map(k => flagEffect(k, false))]});
    if(diet.refinedFlag) { variant('', diet.perMeal, false); variant('_refined', diet.refinedPerMeal, true); } else variant('', diet.perMeal, null);
    return rows;
}

// Standing feed order: the keeper's bag tops up the larder one meal at each boundary (an event on the keeper, run before
// the meal rows by its a0_ id). `orderFlag` is an actor fact on the keeper that the player switches.
export function compileStandingOrder(diet, {worldId, actorId, orderFlag, ids}) {
    validateDiet(diet);
    if(neverHungers(diet)) return null;
    const n = diet.holder.split('.').pop();
    return {id: ids(`care.${n}.a0_standing_order`), revision: 1, label: `Standing feed order for ${diet.label}`, worldId, actorId, interval: dietInterval(diet), automatic: true, mode: 'ambient', chance: 1, public: false,
        requires: all(eq(`actor.${orderFlag}`, true), ge(`item.${diet.food}`, diet.perMeal)), effects: [{type: 'transfer', from: actorId, to: diet.holder, key: diet.food, count: diet.perMeal}]};
}

export const mealSize = (diet, refined = false) => refined && diet.refinedFlag ? diet.refinedPerMeal : diet.perMeal;

// Next meal boundary strictly after `now`, for boundaries anchored at `anchor` (the pack's initializedAt).
export const nextMeal = (diet, now, anchor = 0) => { const i = dietInterval(diet); return i === Infinity ? Infinity : anchor + (Math.floor((now - anchor) / i) + 1) * i; };

// Prediction used by the house view and the tests. stock = main food held by the item, altStock = poorer food, condition =
// current health. Mirrors the rows above: meals on main food heal one point (to maxCondition), a miss at condition >= 2 costs
// a point; a lethal diet dies at the first miss at condition 1, a non-lethal one is starved out (condition 1, cannot work).
export function starvation(diet, {stock, altStock = 0, condition, now, anchor = 0, refined = false}) {
    if(neverHungers(diet)) return {meal: 0, meals: Infinity, mainMeals: Infinity, altMeals: 0, nextMeal: Infinity, fedUntil: null, firstMiss: Infinity, starvedOutAt: Infinity, deathAt: null, lethal: false, missesToDeath: Infinity, never: true};
    const interval = dietInterval(diet), meal = mealSize(diet, refined), mainMeals = Math.floor(stock / meal), altMeals = diet.alt ? Math.floor(altStock / diet.alt.perMeal) : 0;
    const meals = mainMeals + altMeals, first = nextMeal(diet, now, anchor);
    const atMiss = Math.min(diet.maxCondition, condition + mainMeals);
    const lethal = diet.lethal === true, drops = atMiss - 1;
    return {meal, meals, mainMeals, altMeals, nextMeal: first, fedUntil: meals ? first + (meals - 1) * interval : null, firstMiss: first + meals * interval,
        starvedOutAt: drops > 0 ? first + (meals + drops - 1) * interval : (condition <= 1 ? now : first + meals * interval),
        deathAt: lethal ? first + (meals + atMiss - 1) * interval : null, lethal, missesToDeath: atMiss};
}

// Food items per day and cost per day at a unit price (stones per food unit, may be fractional).
export const dailyFood = (diet, refined = false) => neverHungers(diet) ? 0 : mealSize(diet, refined) * 1440 / dietInterval(diet);
export const dailyCost = (diet, price, refined = false) => dailyFood(diet, refined) * price;

// The cap set by feeding: how many of the held items (in the order you took them in) a daily budget sustains.
// `held` = [{id, perDay}], budgetPerDay in the same unit. The first that does not fit, and all after it, are the ones
// that would starve first (last taken in, first to go hungry), so the order is shown, not hidden.
export function sustainable(held, budgetPerDay) {
    let spent = 0; const fed = [], starving = [];
    for(const h of held) {
        if(starving.length === 0 && spent + h.perDay <= budgetPerDay + 1e-9) { spent += h.perDay; fed.push(h.id); } else starving.push(h.id);
    }
    return {fed, starving, spent, budgetPerDay};
}

// Stipend as a continuing agreement: an obligations@1-shaped coin row (clan owes the player). The schedule stays with
// the caller; the ledger record has no period field.
export function stipendAgreement({amount, intervalDays, paid, remaining}) {
    return {id: 'stipend:clan', kind: 'coin', debtor: 'clan', creditor: 'player', amount, why: `Clan academy stipend, ${amount} stones every ${intervalDays} days (${paid} paid, ${remaining} to come)`,
        source: 'gu_keeper', since: 0, eases: 0, carries: false};
}
