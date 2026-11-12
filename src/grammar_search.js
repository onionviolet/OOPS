// Grammars run both ways (chat P, PFP28, RV1-RV4, PM2, PM3). Forward is
// `assemble`/`generate`; this module is backward: given a wanted thing (some
// parts fixed, some derived fields wanted, any other acceptance test), search
// the part combinations that assemble to it, under a trial budget (PR3), from
// the parts an actor knows and owns. Canon is one answer among those the rules
// allow (AD38). Deterministic: a beam over the fitted weights, no draws.
// Previews show what the actor knows and mark the rest unknown (PM2, GR5).
import {compareCodePoints} from './gen_kit.js';
import {assemble, predictSlot} from './procedural_grammar.js';

const fail = message => { throw new Error(message); };
const key = v => typeof v === 'string' ? v : JSON.stringify(v);
const listOf = (slot, v) => slot.type === 'one' ? (v === undefined || v === null ? [] : [v]) : (Array.isArray(v) ? v : []);

// Ranked options for one slot given the parts chosen so far. pool[slot] narrows
// to what the actor knows or owns; the fit orders them (best first).
function options(grammar, slot, chosen, pool, {setSizes = [1, 2], top = 6} = {}) {
    const ranked = slot.given || grammar.weights?.[slot.id]
        ? predictSlot(grammar, chosen, slot.id).ranked.map(r => ({value: r.value, weight: r.weight}))
        : [];
    const declared = Array.isArray(slot.values) ? slot.values : [];
    const allowed = pool[slot.id] ? new Set(pool[slot.id].map(key)) : null;
    const seen = new Set(ranked.map(r => key(r.value)));
    const all = [...ranked, ...declared.filter(v => !seen.has(key(v))).map(v => ({value: v, weight: 0})),
        ...(slot.open && pool[slot.id] ? pool[slot.id].filter(v => !seen.has(key(v)) && !declared.some(d => key(d) === key(v))).map(v => ({value: v, weight: 0})) : [])]
        .filter(o => !allowed || allowed.has(key(o.value)))
        .sort((a, b) => b.weight - a.weight || compareCodePoints(key(a.value), key(b.value)));
    // Scores are smoothed log probabilities, so a short list can beat a long one
    // and a likely value beats a rare one by the same measure.
    const total = all.reduce((n, o) => n + o.weight, 0), lp = w => Math.log((w + 1) / (total + all.length + 1));
    if (slot.type === 'one') return all.slice(0, top).map(o => ({value: o.value, score: lp(o.weight)}));
    const sizes = grammar.weights?.[slot.id]?.sizes ?? {}, sizeTotal = Object.values(sizes).reduce((n, c) => n + c, 0);
    const lsize = k => Math.log(((sizes[k] ?? 0) + 1) / (sizeTotal + 4));
    const out = slot.min === 0 ? [{value: [], score: lsize(0)}] : [];
    const best = all.slice(0, top);
    for (const size of setSizes) {
        if (size < slot.min || size > slot.max) continue;
        if (size === 1) out.push(...best.map(o => ({value: [o.value], score: lsize(1) + lp(o.weight)})));
        if (size === 2) for (let i = 0; i < best.length; i++) for (let j = i + 1; j < best.length; j++)
            out.push({value: [best[i].value, best[j].value], score: lsize(2) + lp(best[i].weight) + lp(best[j].weight)});
    }
    return out;
}

// Nested slots (GL3): ordered lists of child things drawn from the pool the
// actor holds (a Gu per role, an ingredient per step), sized by the fit, each
// child used once. Scored by how often the source uses that many children.
function childLists(grammar, slot, pool, {maxSize = 3} = {}) {
    const sizes = grammar.weights?.[slot.id]?.sizes ?? {}, total = Object.values(sizes).reduce((n, c) => n + c, 0);
    const lsize = k => Math.log(((sizes[k] ?? 0) + 1) / (total + maxSize + 1));
    const out = [];
    const grow = (list, used) => {
        if (list.length >= Math.max(1, slot.min) && list.length <= Math.min(slot.max, maxSize)) out.push({value: list, score: lsize(list.length)});
        if (list.length >= Math.min(slot.max, maxSize)) return;
        pool.forEach((child, i) => { if (!used.has(i)) grow([...list, child], new Set([...used, i])); });
    };
    grow([], new Set());
    return out;
}

// searchParts(fitted, {want, pool, accept, budget, beam, answers, canon, identity})
//   want:   {parts: {slot: value}, derived: {field: value}} the wanted thing (RV2, RV4)
//   pool:   {slot: [values]} what the actor knows and owns (PM3); a slot without an entry is open
//   accept: (value, built) -> boolean, any further test (a law, a check, a cost)
//   canon:  assembled canon values; an answer equal to one by identity is marked canon
// Returns answers best first, what it tried, whether the budget cut it short,
// and when nothing answers, the gaps: wanted parts the actor lacks and the
// rules that refused the near candidates.
export function searchParts(fitted, {want = {}, pool = {}, accept = () => true, budget = {trials: 200}, beam = 12, answers: maxAnswers = 5,
    canon = [], identity = null} = {}) {
    if (!fitted.weights) fail('Search a fitted grammar.');
    if (!Number.isSafeInteger(budget.trials) || budget.trials < 1) fail('A search needs a trial budget (PR3).');
    const wantParts = want.parts ?? {}, wantDerived = want.derived ?? {};
    const gaps = [];
    for (const [slot, value] of Object.entries(wantParts)) {
        const decl = fitted.slots.find(s => s.id === slot) ?? fail(`Unknown slot ${slot}.`);
        const allowed = pool[slot] ? new Set(pool[slot].map(key)) : null;
        const missing = listOf(decl, value).filter(v => allowed && !allowed.has(key(v)));
        if (missing.length) gaps.push({kind: 'lacks-part', slot, values: missing, reason: 'not known or owned'});
    }
    if (gaps.length) return {answers: [], tried: 0, truncated: false, gaps};
    let states = [{parts: {}, score: 0}];
    for (const slot of fitted.slots) {
        if (slot.type === 'parts' && wantParts[slot.id] === undefined && !pool[slot.id]) fail(`Backward search over nested slot ${slot.id} needs its children wanted or a pool of child things (GL3).`);
        const next = [];
        for (const st of states) {
            const opts = wantParts[slot.id] !== undefined ? [{value: wantParts[slot.id], score: 0}]
                : slot.type === 'parts' ? childLists(fitted, slot, pool[slot.id]) : options(fitted, slot, st.parts, pool);
            for (const o of opts) next.push({parts: {...st.parts, [slot.id]: o.value}, score: st.score + o.score});
        }
        states = next.sort((a, b) => b.score - a.score || compareCodePoints(JSON.stringify(a.parts), JSON.stringify(b.parts))).slice(0, beam);
    }
    const canonIds = identity ? new Set(canon.map(identity)) : null;
    const found = [], refused = new Map();
    let tried = 0, truncated = false;
    for (const st of states) {
        if (tried >= budget.trials || budget.stop?.()) { truncated = true; break; }
        tried++;
        const built = assemble(fitted, st.parts);
        if (!built.ok) { for (const v of built.receipt.violations) refused.set(v.rule ?? v.kind, (refused.get(v.rule ?? v.kind) ?? 0) + 1); continue; }
        const derivedOk = Object.entries(wantDerived).every(([k, v]) => key(built.value.derived[k]) === key(v));
        if (!derivedOk) { refused.set('wanted-derived', (refused.get('wanted-derived') ?? 0) + 1); continue; }
        if (!accept(built.value, built)) { refused.set('accept', (refused.get('accept') ?? 0) + 1); continue; }
        found.push({parts: built.value.parts, value: built.value, score: st.score, canon: canonIds ? canonIds.has(identity(built.value)) : null,
            flags: built.receipt.flags});
        if (found.length >= maxAnswers) break;
    }
    if (!found.length) for (const [rule, count] of refused) gaps.push({kind: 'refused', rule, count});
    return {answers: found, tried, truncated, gaps};
}

// PM2 · Honest preview. knowledge: {slot: true | [known values]}. A part the
// actor does not know shows as unknown; a derived field reading an unknown part
// (by the rule's `reads`) is marked uncertain rather than shown as fact.
export function previewValue(grammar, value, knowledge = {}) {
    const known = (slot, v) => knowledge[slot] === true || (Array.isArray(knowledge[slot]) && knowledge[slot].map(key).includes(key(v)));
    const parts = {}, unknownSlots = new Set();
    for (const slot of grammar.slots) {
        const v = value.parts[slot.id];
        if (slot.type === 'one') {
            if (v === undefined) continue;
            parts[slot.id] = known(slot.id, v) ? {value: v} : {unknown: true};
            if (!known(slot.id, v)) unknownSlots.add(slot.id);
        } else {
            const items = listOf(slot, v).map(x => known(slot.id, x) ? {value: x} : {unknown: true});
            parts[slot.id] = items;
            if (items.some(i => i.unknown)) unknownSlots.add(slot.id);
        }
    }
    const derived = {};
    for (const rule of grammar.rules.filter(r => r.kind === 'derive')) {
        // A rule that declares no reads is treated as reading everything.
        const uncertain = rule.reads.length ? rule.reads.some(r => unknownSlots.has(r)) : unknownSlots.size > 0;
        const out = rule.run({parts: value.parts, derived: {...value.derived}, dials: grammar.dials, support: grammar.support}) ?? {};
        for (const [k, v] of Object.entries(out)) if (!(k in derived)) derived[k] = uncertain ? {uncertain: true, expected: null} : {value: v};
    }
    return {grammar: value.grammar, parts, derived, unknown: [...unknownSlots]};
}

// RV2 canon test, backward: give the search only the wanted slots of each canon
// thing and see whether the canon combination comes back among its answers,
// and how many other routes the rules allow. identity(value) names a thing.
export function backwardCanonTest(fitted, canonParts, {fix, identity, answers = 5, beam = 24, budget = {trials: 60}} = {}) {
    if (!Array.isArray(fix) || !fix.length || typeof identity !== 'function') fail('Name the wanted slots and an identity.');
    let found = 0, alternatives = 0, truncated = 0;
    const misses = [];
    for (const [i, parts] of canonParts.entries()) {
        const want = {parts: Object.fromEntries(fix.map(s => [s, parts[s]]))};
        const target = identity({parts});
        const out = searchParts(fitted, {want, budget, beam, answers});
        if (out.truncated) truncated++;
        const ids = out.answers.map(a => identity(a.value));
        if (ids.includes(target)) found++; else if (misses.length < 8) misses.push({i, want: want.parts, got: ids.slice(0, 2)});
        alternatives += ids.filter(id => id !== target).length;
    }
    const n = canonParts.length;
    return {tested: n, canonFound: found, rate: n ? Math.round(found / n * 1000) / 1000 : 0,
        alternativesPerTarget: n ? Math.round(alternatives / n * 100) / 100 : 0, truncated, misses};
}
