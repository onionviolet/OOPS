// Recipe truth (GKM247-GKM250; proposal, engine fixtures; design note
// docs/gm/dispatch/foundation-run-2026-11-12/W15_RECIPE_TRUTH.md).
// A recipe record is what one holder believes a composition is: which filler
// goes in which slot and which activation conditions it has. The truth is the
// book: the compositions, the fillers' real laws and the fillers' real
// conditions. Activation binds the holder's record through composeWorking and
// settles under the real laws, so a false record fails (or underperforms) the
// way any working with that filler does. Nothing here decides an outcome.
// Checking a record is a priced act with a miss rate. A condition is a data row
// another holder can deny at a cost; the kernel's authority port carries it.
// Names no world or domain. Saves nothing itself: records and denials are JSON.
import {check, natural, object, copy, deepFreeze} from './basics.js';
import {beginWorking, quoteWorking, settleWorking} from './kernel_working.js';
import {composeWorking, composedPart, defineComposition} from './kernel_compose.js';

export const RECIPE_SCHEMA = 'recipe.truth@1';
export const CHECK_ROUTES = Object.freeze(['deduce', 'trial', 'compare']);
const id = x => typeof x === 'string' && /^[a-z][a-z0-9_.:/-]*$/i.test(x);
const costs = rows => Array.isArray(rows) && rows.every(object);
const owed = (rows, holder) => rows.map(row => ({holder, ...copy(row)}));

// A holder's record. `fillers` may leave a slot out (an incomplete manual, a
// withheld step). `conditions` lists the condition ids the record discloses.
export function defineRecipe(data) {
    check(object(data) && (data.schema === undefined || data.schema === RECIPE_SCHEMA) && id(data.id) && id(data.composition) &&
        object(data.fillers) && Object.entries(data.fillers).every(([slot, key]) => id(slot) && id(key)) &&
        Object.keys(data.fillers).length > 0, 'A recipe names a composition and a filler for at least one slot.');
    check(Object.keys(data).every(k => ['schema', 'id', 'composition', 'fillers', 'conditions', 'holder', 'source', 'checks'].includes(k)), 'Unknown recipe field.');
    check((data.conditions ?? []).every(id) && (data.holder === undefined || id(data.holder)) &&
        (data.source === undefined || id(data.source)) && (data.checks ?? []).every(object), 'Invalid recipe.');
    return deepFreeze({...copy(data), schema: RECIPE_SCHEMA, conditions: copy(data.conditions ?? []), checks: copy(data.checks ?? [])});
}

// A condition row on a filler: {id, kind, role, deny: {costs, minutes}, lapse?: {costs}, forgo?: {costs}}.
// deny: what closing it costs the denier and how long that lasts (a dial).
// lapse: what the user pays when a step is refused because of it.
// forgo: the price of working without it, when the world has such a way.
function conditionRow(row, filler) {
    check(object(row) && id(row.id) && id(row.kind) && filler.method.roles[row.role] !== undefined &&
        object(row.deny) && costs(row.deny.costs) && natural(row.deny.minutes) && row.deny.minutes > 0 &&
        ['lapse', 'forgo'].every(k => row[k] === undefined || (object(row[k]) && costs(row[k].costs))), `Invalid condition ${row?.id}.`);
    return row;
}

// The working this record makes: the slots it fills, composed by the kernel.
// conditions are the fillers' true rows, bound to the composite's roles;
// `listed` says whether the record discloses each one.
export function bindRecipe(book, recipe) {
    const whole = book.compositions[recipe.composition];
    check(object(whole), `No composition ${recipe.composition}.`);
    const slots = whole.slots.filter(slot => recipe.fillers[slot.name] !== undefined);
    check(slots.length === Object.keys(recipe.fillers).length, 'The recipe fills a slot the composition does not have.');
    const missing = whole.slots.filter(slot => !slots.includes(slot)).map(slot => slot.name);
    const composition = missing.length ? defineComposition({...copy(whole), slots: copy(slots)}) : whole;
    const fillers = {}, conditions = [];
    for (const slot of slots) {
        const filler = book.fillers[recipe.fillers[slot.name]];
        check(object(filler), `No filler ${recipe.fillers[slot.name]}.`);
        fillers[slot.name] = filler;
        for (const row of filler.conditions ?? []) conditions.push({...copy(conditionRow(row, filler)), slot: slot.name,
            role: slot.bindings[row.role], listed: recipe.conditions.includes(row.id)});
    }
    const {law, method} = composeWorking(composition, fillers);
    return {law, method, conditions, missing};
}

// GKM250. Close a condition for one holder. The price lands on the denier.
export function denyCondition(condition, {target, by, at}) {
    check(object(condition?.deny) && id(target) && id(by) && natural(at), 'A denial names a condition, a target, a denier and a minute.');
    return {denial: {condition: condition.id, target, by, from: at, until: at + condition.deny.minutes},
        costs: owed(condition.deny.costs, by)};
}

// The kernel authority (KW35) for a bound recipe's conditions. A step of a slot
// whose condition is closed for the bound holder is refused, with the lapse
// price if the row has one; `forgo` lists conditions the user pays to skip.
export function conditionAuthority(conditions, denials = [], {forgo = [], inner} = {}) {
    return request => {
        let answer = inner ? inner(request) : {ok: true};
        if (!answer.ok) return answer;
        const slot = composedPart(request.op);
        for (const row of conditions) {
            const who = request.bindings[row.role]?.id;
            if (row.slot !== slot || !denials.some(d => d.condition === row.id && d.target === who && d.from <= request.at && request.at < d.until)) continue;
            if (row.forgo && forgo.includes(row.id)) {
                answer = {...answer, costs: [...(answer.costs ?? []), ...owed(row.forgo.costs, who)], cause: 'condition-forgone'};
                continue;
            }
            return {ok: false, reason: 'condition-denied', cause: row.id, observed: {condition: row.id},
                ...(row.lapse ? {costs: owed(row.lapse.costs, who)} : {})};
        }
        return answer;
    };
}

// The backlash of a failed working is what its failed step charged (KW15
// costs on the receipt). Read the same way for every law and every cause.
export function backlashOf(working) {
    const last = working.receipts.at(-1);
    return working.status === 'interrupted' && last && !last.ok ? copy(last.truth.costs ?? []) : [];
}

// Truth-side reading: what is wrong with this record in this scene. Not for the
// holder's eyes; a check returns the part of it the holder found.
export function recipeFaults(book, recipe, scene) {
    const bound = bindRecipe(book, recipe);
    const faults = bound.missing.map(slot => ({slot, kind: 'missing'}));
    for (const row of bound.conditions) if (!row.listed) faults.push({slot: row.slot, kind: 'unlisted-condition', condition: row.id});
    const quote = quoteWorking(bound.law, bound.method, scene);
    if (!quote.ok) faults.push({slot: composedPart(quote.steps.at(-1).op), kind: 'fails', reason: quote.reason});
    return faults;
}

// Where two records of one composition disagree. It does not say which is right.
export function recipeDifferences(a, b) {
    check(a.composition === b.composition, 'Compare records of the same composition.');
    const rows = [...new Set([...Object.keys(a.fillers), ...Object.keys(b.fillers)])].sort()
        .filter(slot => a.fillers[slot] !== b.fillers[slot]).map(slot => ({slot, kind: 'differs', other: b.id}));
    for (const c of [...new Set([...a.conditions, ...b.conditions])].sort())
        if (a.conditions.includes(c) !== b.conditions.includes(c)) rows.push({kind: 'condition-differs', condition: c, other: b.id});
    return rows;
}

// A second record fills what the first leaves out; the first keeps its own steps.
export function mergeRecipes(a, b, {id: merged = a.id} = {}) {
    check(a.composition === b.composition, 'Merge records of the same composition.');
    return defineRecipe({...copy(a), id: merged, fillers: {...b.fillers, ...a.fillers},
        conditions: [...new Set([...a.conditions, ...b.conditions])]});
}

// GKM248. One check by one route: {id, kind, costs, minutes, missPermille}.
//   deduce  reads the method against the scene without doing it (time, effort).
//   trial   does it for real in `scene` (the caller picks a small, safe one), so
//           it costs the trial's own backlash and sees only what happened there.
//   compare reads a second record; a shared forger or a shared error hides.
// `draw(address)` is whole permille; each fault is missed on its own draw.
// Returns the holder's side (check, costs, backlash, recipe with the check
// added) and the truth side (`missed`), which a host keeps off the page.
export function checkRecipe(book, recipe, route, {id: checkId, by, at, draw, scene, second}) {
    check(object(route) && id(route.id) && CHECK_ROUTES.includes(route.kind) && costs(route.costs) && natural(route.minutes) &&
        natural(route.missPermille) && route.missPermille <= 1000, 'A check route needs a kind, a price, minutes and a miss rate.');
    check(id(checkId) && id(by) && natural(at) && typeof draw === 'function', 'A check needs an id, a checker, a minute and a draw.');
    let seen, run = {}, done = at + route.minutes;
    if (route.kind === 'compare') seen = recipeDifferences(recipe, second);
    else if (route.kind === 'deduce') seen = recipeFaults(book, recipe, {...scene, id: `${checkId}/dry`, at});
    else {
        const bound = bindRecipe(book, recipe);
        const begun = beginWorking(bound.law, bound.method, {id: `${checkId}/trial`, bindings: scene.bindings, facts: scene.facts, at});
        done = Math.max(done, begun.deadlines.at(-1));
        const settled = settleWorking(bound.law, begun, {now: done, ports: scene.ports});
        const last = settled.record.receipts.at(-1);
        seen = settled.record.status === 'interrupted' ? [{slot: composedPart(last.op), kind: 'fails', reason: last.reason}] : [];
        run = {working: settled.record, effects: settled.effects.map(row => row.effect)};
    }
    const found = [], missed = [];
    for (const fault of seen) {
        const roll = draw(`${checkId}/${fault.slot ?? fault.condition}/${fault.kind}`);
        check(natural(roll) && roll < 1000, 'A draw is whole permille.');
        (roll < route.missPermille ? missed : found).push(fault);
    }
    const row = {id: checkId, route: route.id, kind: route.kind, by, at, done, found};
    return {check: row, costs: owed(route.costs, by), backlash: run.working ? backlashOf(run.working) : [], missed, ...run,
        recipe: defineRecipe({...copy(recipe), checks: [...copy(recipe.checks), row]})};
}

export function restoreRecipes(raw) {
    check(object(raw) && raw.schema === RECIPE_SCHEMA && Array.isArray(raw.recipes) && Array.isArray(raw.denials), 'Unsupported recipe save.');
    const recipes = raw.recipes.map(defineRecipe);
    check(new Set(recipes.map(r => r.id)).size === recipes.length, 'Duplicate recipe.');
    check(raw.denials.every(d => object(d) && id(d.condition) && id(d.target) && id(d.by) && natural(d.from) && natural(d.until) && d.until >= d.from), 'Invalid denial.');
    return {recipes, denials: copy(raw.denials)};
}
export const serializeRecipes = value => ({schema: RECIPE_SCHEMA, ...copy(restoreRecipes({schema: RECIPE_SCHEMA, ...value}))});
