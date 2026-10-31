// Living-item upkeep (new seam, 2026-10-30; proposal under AD32). A living item (Gu, a creature, a companion)
// has a holder, a diet (food key, amount per meal, interval) and a condition that falls on each missed meal.
// This module is pure: it compiles diets into the ambient event rows the simulation already runs (reset, death,
// meal, hunger), predicts when each holder is next fed and when it would starve, and answers how many living items
// a food budget sustains. It never ticks, rolls or writes a save. Feeding is a soft cap: it never blocks holding
// another item (acquisition has its own price); an item that cannot be fed starves on the schedule shown here.
// Dials (authored, with reason): maxCondition is how many missed meals a body takes (damage falls by one each missed
// meal and the next miss after condition 1 is death); a hardier `refined` variant eats less per meal.
export const UPKEEP_FAMILY = 'upkeep@1';
const fail = message => { throw new Error(message); };
const natural = n => Number.isSafeInteger(n) && n > 0;
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);

// diet: {holder, label, food, foodLabel, perMeal, interval, maxCondition, flag, refinedFlag?, refinedPerMeal?}
//  `food` is the exact JSON item key; `flag` is the actor fact that says the item is in your care (care pauses
//  while it is false, because a Gu in the clan vault is fed by the vault).
export function validateDiet(d) {
    idLike(d?.holder) && idLike(d.flag) && typeof d.food === 'string' && d.food && typeof d.label === 'string' || fail('Upkeep: diet needs holder, flag, food and label.');
    natural(d.perMeal) && natural(d.interval) && natural(d.maxCondition) || fail('Upkeep: perMeal, interval and maxCondition must be positive whole numbers.');
    if(d.refinedFlag != null) idLike(d.refinedFlag) && natural(d.refinedPerMeal) && d.refinedPerMeal < d.perMeal || fail('Upkeep: a refined variant needs its flag and a smaller meal.');
    return d;
}

const eq = (fact, value) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const le = (fact, value) => ({fact, op: 'lte', value});
const all = (...rules) => ({all: rules.filter(Boolean)});
const flagEffect = (key, value) => ({type: 'fact', scope: 'actor', key, value});
const unitKey = d => d.food;

// Event rows for one diet. `ids(suffix)` makes the pack-owned id; `note(text)` makes a knowledge effect or null.
// Row order inside a boundary follows the a_/b_/c_/d_ id prefixes the engine sorts by: reset, death, meal, hunger.
export function compileUpkeepEvents(diet, {worldId, ids, note = () => null}) {
    validateDiet(diet);
    const n = diet.holder.split('.').pop();
    const rows = [];
    const variant = (suffix, perMeal, refinedGate) => {
        const have = (op, v) => ({fact: `item.${unitKey(diet)}`, op, value: v});
        const kept = eq(`actor.${diet.flag}`, true);
        const gate = refinedGate == null ? null : eq(`actor.${diet.refinedFlag}`, refinedGate);
        const short = {any: [have('lte', perMeal - 1)]}, fed = have('gte', perMeal);
        const base = (id, label, requires, effects, isPublic) => ({id: ids(`care.${n}.${id}`), revision: 1, label, worldId, actorId: diet.holder, interval: diet.interval,
            automatic: true, mode: 'ambient', chance: 1, public: !!isPublic, requires, effects: effects.filter(Boolean)});
        rows.push(base(`b_death${suffix}`, `${diet.label} died after repeated missed meals`, all(kept, gate, short, le('vital.health', 1)), [
            {type: 'vital', key: 'health', amount: -1}, {type: 'life', status: 'dead', lethal: true, reason: `Repeated missed meals exhausted ${diet.label}.`},
            note(`${diet.label} has died after repeated missed meals. Food bought later cannot restore it.`)], true));
        rows.push(base(`c_meal${suffix}`, `${diet.label} ate`, all(kept, gate, fed), [
            {type: 'item', key: diet.food, amount: -perMeal}, {type: 'vital', key: 'health', amount: 1}, flagEffect(`${diet.flag}.fed`, true),
            note(`${diet.label} ate ${perMeal} ${diet.foodLabel || 'portions'}; its condition recovered by up to one point.`)], true));
        rows.push(base(`d_hunger${suffix}`, `${diet.label} missed its meal`, all(kept, gate, eq(`actor.${diet.flag}.fed`, false), short, ge('vital.health', 2)), [
            {type: 'vital', key: 'health', amount: -1}, note(`${diet.label} lacked ${perMeal} ${diet.foodLabel || 'portions'} at its meal. Its condition fell by one; feed it before another miss.`)], true));
    };
    rows.push({id: ids(`care.${n}.a_reset`), revision: 1, label: `${diet.label} meal window opens`, worldId, actorId: diet.holder, interval: diet.interval, automatic: true, mode: 'ambient',
        chance: 1, public: false, requires: null, effects: [flagEffect(`${diet.flag}.fed`, false)]});
    if(diet.refinedFlag) { variant('', diet.perMeal, false); variant('_refined', diet.refinedPerMeal, true); } else variant('', diet.perMeal, null);
    return rows;
}

export const mealSize = (diet, refined = false) => refined && diet.refinedFlag ? diet.refinedPerMeal : diet.perMeal;

// Next meal boundary strictly after `now`, for boundaries anchored at `anchor` (the pack's initializedAt).
export const nextMeal = (diet, now, anchor = 0) => anchor + (Math.floor((now - anchor) / diet.interval) + 1) * diet.interval;

// Prediction used by the house view and the tests. stock = food items held by the item, condition = current health.
// Returns the boundaries it will eat at, and the minute it dies if never fed again. Mirrors the rows above: a miss at
// condition >= 2 costs a point, the first miss at condition 1 is death.
export function starvation(diet, {stock, condition, now, anchor = 0, refined = false}) {
    const meal = mealSize(diet, refined), meals = Math.floor(stock / meal), first = nextMeal(diet, now, anchor);
    const dyingBoundary = meals + condition;
    return {meal, meals, nextMeal: first, fedUntil: meals ? first + (meals - 1) * diet.interval : null,
        firstMiss: first + meals * diet.interval, deathAt: first + (dyingBoundary - 1) * diet.interval, missesToDeath: condition};
}

// Food items per day and cost per day at a unit price (stones per food unit, may be fractional).
export const dailyFood = (diet, refined = false) => mealSize(diet, refined) * 1440 / diet.interval;
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
