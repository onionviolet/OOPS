// First NPC consumer of the agency contract (AGC, docs/AGENCY_CONTRACT.md):
// a household cook choosing among the manor's routine workings through the
// kernel quote. Original world content (the Village manor), not a book.
//
// Source rule it reproduces: household_fortunes_domain.routineNeed (cook when
// cooked meat in staff stock is under 2, repair when the house is below full
// integrity, dry when it is wet). That rule is module-private, so it is copied
// here as a table (ROUTINE_NEED) the default wants reproduce exactly. What the
// old rule cannot say, and this one can: buying meat when the pantry is empty,
// and passing on it when the price the cook believes is too high for the purse.
// Numbers are dials with a reason; nothing here is live yet (no host calls it).
import {defineWorkingLaw} from './kernel_working.js';
import {defineAgent} from './agency.js';

export const HOUSEHOLD_DIALS = Object.freeze({
    fedAt: {value: 2, why: 'Two cooked portions cover the next meal for the staff, as the manor routine already assumes.'},
    buyCount: {value: 2, why: 'A market trip brings back enough raw meat for one cooking.'},
    cookMinutes: {value: 60, why: 'An hour at the hearth for one batch.'},
    buyMinutes: {value: 90, why: 'The walk to the stall and back, with haggling.'},
    restMinutes: {value: 60, why: 'An hour off between chores.'},
});

const D = HOUSEHOLD_DIALS;
const qty = (thing, name) => thing?.quantities?.[name] ?? 0;

// One law for the routine workings. Each operation reads the bound things as the
// reader gives them: the actor's knowledge in a quote, the truth in settlement.
export const householdLaw = defineWorkingLaw({id: 'a.household', revision: 0, operations: {
    cook: {roles: {cook: 'person', pantry: 'store'}, minutes: D.cookMinutes.value, settle: ({bound}) => qty(bound.pantry, 'raw') < 1
        ? {ok: false, reason: 'There is no raw meat in the pantry.'}
        : {ok: true, effects: [{kind: 'stock', holder: bound.pantry.id, item: 'raw', amount: -1}, {kind: 'stock', holder: bound.pantry.id, item: 'cooked', amount: 2}]}},
    buy: {roles: {cook: 'person', stall: 'store'}, minutes: D.buyMinutes.value, settle: ({bound}) => {
        const n = D.buyCount.value, price = qty(bound.stall, 'price'), coin = qty(bound.cook, 'coin');
        if (qty(bound.stall, 'raw') < n) return {ok: false, reason: 'The stall has no meat to sell.'};
        if (coin < price * n) return {ok: false, reason: `Meat at ${price} a portion is more than the purse holds.`};
        return {ok: true, facts: {spent: price * n, coin}, effects: [{kind: 'coin', holder: bound.cook.id, amount: -price * n},
            {kind: 'stock', holder: bound.stall.id, item: 'raw', amount: -n}, {kind: 'carry', holder: bound.cook.id, item: 'raw', amount: n}]};
    }},
    repair: {roles: {cook: 'person', house: 'house'}, minutes: 120, settle: ({bound}) => qty(bound.house, 'integrity') >= 100
        ? {ok: false, reason: 'The house needs no mending.'} : {ok: true, effects: [{kind: 'mend', holder: bound.house.id, amount: 10}]}},
    dry: {roles: {cook: 'person', house: 'house'}, minutes: 60, settle: ({bound}) => qty(bound.house, 'wetness') <= 0
        ? {ok: false, reason: 'The house is dry.'} : {ok: true, effects: [{kind: 'dry', holder: bound.house.id, amount: 10}]}},
    rest: {roles: {cook: 'person'}, minutes: D.restMinutes.value, settle: () => ({ok: true})},
}});

const method = (op, roles, bindings) => ({id: `a.household.${op}`, revision: 0, law: householdLaw.ref, roles, steps: [{op, bindings}]});
export const householdMethods = Object.freeze({
    cook: method('cook', {cook: 'person', pantry: 'store'}, {cook: 'cook', pantry: 'pantry'}),
    buy: method('buy', {cook: 'person', stall: 'store'}, {cook: 'cook', stall: 'stall'}),
    repair: method('repair', {cook: 'person', house: 'house'}, {cook: 'cook', house: 'house'}),
    dry: method('dry', {cook: 'person', house: 'house'}, {cook: 'cook', house: 'house'}),
    rest: method('rest', {cook: 'person'}, {cook: 'cook'}),
});

// The copied source rule, for the reproduction test and the later live swap.
export const ROUTINE_NEED = Object.freeze({
    cook: s => s.pantry.cooked < D.fedAt.value,
    repair: s => s.house.integrity < 100,
    dry: s => s.house.wetness > 0,
});

export const householdCook = defineAgent({id: 'a.household.cook', revision: 0, label: 'The cook',
    wants: {feed: {weight: 1, label: 'keep the house fed'}, mend: {weight: 0.6, label: 'keep the house sound'},
        dry: {weight: 0.5, label: 'keep the house dry'}, rest: {weight: 0.2, label: 'rest'}},
    thrift: 0.5});

// Needs from what the cook knows of the household. The cook keeps the pantry
// and lives in the house, so those are seen; the stall is known by report.
export function householdNeeds(s) {
    const cooked = s.pantry.cooked;
    return {
        feed: ROUTINE_NEED.cook(s) ? {urgency: 1, why: `only ${cooked} cooked ${cooked === 1 ? 'portion is' : 'portions are'} left`} : {urgency: 0},
        mend: ROUTINE_NEED.repair(s) ? {urgency: Math.max(0.3, (100 - s.house.integrity) / 100), why: 'the roof is letting in weather'} : {urgency: 0},
        dry: ROUTINE_NEED.dry(s) ? {urgency: Math.min(1, Math.max(0.3, s.house.wetness / 50)), why: 'the floors are wet'} : {urgency: 0},
        rest: {urgency: 1, why: 'there is time to sit down'},
    };
}

const ref = (kind, refId) => ({kind, id: refId});
// Candidates. serves() reads the quote, so what the cook believes about stock
// and price (through the quote) is what moves the choice.
export function householdCandidates() {
    const b = {cook: ref('person', 'cook'), pantry: ref('store', 'pantry'), stall: ref('store', 'stall'), house: ref('house', 'house')};
    const pick = (...roles) => Object.fromEntries(roles.map(r => [r, b[r]]));
    return [
        {id: 'cook', label: 'cooks a batch', law: householdLaw, method: householdMethods.cook, bindings: pick('cook', 'pantry'), serves: () => ({feed: 1})},
        {id: 'buy', label: 'goes to buy meat', law: householdLaw, method: householdMethods.buy, bindings: pick('cook', 'stall'),
            serves: () => ({feed: 0.8}), cost: q => q.facts.spent / Math.max(1, q.facts.coin), costWhy: q => `${q.facts.spent} coins is a lot of the purse`},
        {id: 'repair', label: 'mends the roof', law: householdLaw, method: householdMethods.repair, bindings: pick('cook', 'house'), serves: () => ({mend: 1})},
        {id: 'dry', label: 'mops and airs the house', law: householdLaw, method: householdMethods.dry, bindings: pick('cook', 'house'), serves: () => ({dry: 1})},
        {id: 'rest', label: 'rests', law: householdLaw, method: householdMethods.rest, bindings: pick('cook'), serves: () => ({rest: 1})},
    ];
}

// A knowledge reader over a household snapshot: {cook:{coin}, pantry:{raw,
// cooked}, stall:{raw, price}, house:{integrity, wetness}}. The player's quote
// and the cook's quote both take a reader of this shape.
export function householdReader(s) {
    const things = {person: {cook: s.cook}, store: {pantry: s.pantry, stall: s.stall}, house: {house: s.house}};
    return r => things[r.kind]?.[r.id] ? {kind: r.kind, id: r.id, quantities: {...things[r.kind][r.id]}} : null;
}
