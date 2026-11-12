// Procedural grammar contract v0 (chat P, docs/PROCEDURAL_GRAMMAR_CONTRACT.md).
// A domain declares typed part slots, combination rules and fit weights; a thing
// is assembled from parts and checked by the same rules whether it came from
// canon or a draw. The grammar decides what; gen_kit (GR1-GR17) decides how.
// Pure: no world names, no saves, no unseeded randomness. World packs supply grammars.
import {address, compareCodePoints, drawU32, indexFromU32, pickWeighted, withRetries} from './gen_kit.js';

export const GRAMMAR_CONTRACT = 'grammar@0';
const SLOT_TYPES = new Set(['one', 'set', 'tokens', 'parts']);
const CAUSES = new Set(['place', 'history', 'pressure', 'inventor', 'flavor', 'canon-test']);
const fail = message => { throw new Error(message); };
const natural = n => Number.isSafeInteger(n) && n >= 0;
const key = v => typeof v === 'string' ? v : JSON.stringify(v);
const asList = (slot, v) => slot.type === 'one' ? (v === undefined || v === null ? [] : [v]) : (Array.isArray(v) ? v : []);
const sortKeys = list => [...list].sort((a, b) => compareCodePoints(key(a), key(b)));
const givensOf = slot => !slot.given ? [] : Array.isArray(slot.given) ? slot.given : [slot.given];
// Joint conditioning keys (GL5): one key per combination of the given slots'
// values. A single given keeps its plain value key, so v0 grammars fit as before.
function jointKeys(grammar, slot, parts) {
    const lists = givensOf(slot).map(id => asList(grammar.slots.find(s => s.id === id), parts[id]).map(key));
    if (!lists.length || lists.some(l => !l.length)) return [];
    if (lists.length === 1) return lists[0];
    return lists.reduce((acc, list) => acc.flatMap(prefix => list.map(v => [...prefix, v])), [[]]).map(t => JSON.stringify(t));
}

// spec: {id, revision, slots:[{id, type, values?:[...]|'corpus', open?, min?, max?, given?}],
//        rules:[{id, kind:'derive'|'check', severity?:'reject'|'flag', reads?, run, default, dial?, reason}],
//        fallback:{id, parts}, budget?:{maxDraws}}
export function defineGrammar(spec) {
    if (!spec || typeof spec.id !== 'string' || !spec.id) fail('A grammar needs an id.');
    if (!natural(spec.revision) || spec.revision < 1) fail(`Grammar ${spec.id} needs a positive integer revision.`);
    const ids = new Set();
    const slots = (spec.slots ?? []).map(s => {
        if (!s?.id || ids.has(s.id)) fail(`Slot ${s?.id} is missing or repeated.`);
        if (!SLOT_TYPES.has(s.type)) fail(`Slot ${s.id} has unknown type ${s.type}.`);
        for (const g of givensOf(s)) if (!ids.has(g)) fail(`Slot ${s.id} is conditioned on ${g}, which must be declared earlier.`);
        // GL6 · Nested parts: a `parts` slot holds an ordered list of child things,
        // each assembled by its own child grammar (a step, a role in a move).
        if (s.type === 'parts' && s.grammar?.contract !== GRAMMAR_CONTRACT) fail(`Slot ${s.id} of type parts needs a child grammar.`);
        if (s.type === 'parts' && s.given) fail(`Slot ${s.id}: a parts slot is not conditioned; condition the child grammar's slots instead.`);
        if (s.type !== 'parts' && !(Array.isArray(s.values) || s.values === 'corpus' || s.open)) fail(`Slot ${s.id} needs values, 'corpus' or open.`);
        ids.add(s.id);
        return Object.freeze({min: s.type === 'one' ? 1 : 0, max: s.type === 'one' ? 1 : Infinity, ...s,
            values: Array.isArray(s.values) ? Object.freeze(sortKeys(s.values)) : s.values});
    });
    if (!slots.length) fail(`Grammar ${spec.id} declares no slots.`);
    const rules = (spec.rules ?? []).map(r => {
        if (!r?.id || !['derive', 'check'].includes(r.kind) || typeof r.run !== 'function') fail(`Rule ${r?.id} needs an id, kind and run.`);
        if (typeof r.reason !== 'string' || typeof r.default !== 'string') fail(`Rule ${r.id} needs a default and a reason (AD5 constraint form).`);
        return Object.freeze({severity: 'reject', reads: [], ...r});
    });
    if (!spec.fallback?.id || !spec.fallback.parts) fail(`Grammar ${spec.id} needs a named authored fallback (GR6).`);
    return Object.freeze({contract: GRAMMAR_CONTRACT, id: spec.id, revision: spec.revision, ref: `${spec.id}@${spec.revision}`,
        slots: Object.freeze(slots), rules: Object.freeze(rules), fallback: spec.fallback, budget: spec.budget ?? {maxDraws: 256},
        weights: spec.weights ?? null, support: spec.support ?? null, overlays: Object.freeze(spec.overlays ?? []),
        dials: Object.freeze({...(spec.dials ?? {})}), spec});
}

// Integer weights from a labelled corpus (PFP18). rows: [{id, parts}].
// smoothing (dial, default 0): weight added to every declared value, so a world
// can open combinations its source never shows without a code change.
export function fitGrammar(grammar, rows, {smoothing = 0} = {}) {
    if (!natural(smoothing)) fail('Smoothing is a nonnegative integer.');
    const n = rows.length, weights = {}, support = {};
    for (const slot of grammar.slots) {
        if (slot.type === 'parts') {
            const sizes = new Map(), children = [];
            for (const row of rows) {
                const list = asList(slot, row.parts[slot.id]);
                sizes.set(list.length, (sizes.get(list.length) ?? 0) + 1);
                list.forEach((child, i) => children.push({id: `${row.id}#${slot.id}${i}`, parts: child}));
            }
            const child = fitGrammar(slot.grammar, children, {smoothing});
            weights[slot.id] = {marginal: {}, sizes: Object.fromEntries(sizes), given: null, byGiven: null, child};
            const sizeKeys = [...sizes.keys()];
            support[slot.id] = {values: [], minSize: sizeKeys.length ? Math.min(...sizeKeys) : 0, maxSize: sizeKeys.length ? Math.max(...sizeKeys) : 0,
                children: children.length};
            continue;
        }
        const marginal = new Map(), sizes = new Map(), cond = new Map(), parts = new Map(givensOf(slot).map(g => [g, new Map()]));
        const bump = (table, k, v) => { const t = table.get(k) ?? new Map(); t.set(key(v), (t.get(key(v)) ?? 0) + 1); table.set(k, t); };
        for (const row of rows) {
            const values = asList(slot, row.parts[slot.id]);
            sizes.set(values.length, (sizes.get(values.length) ?? 0) + 1);
            const joint = jointKeys(grammar, slot, row.parts);
            for (const v of values) {
                marginal.set(key(v), {value: v, count: (marginal.get(key(v))?.count ?? 0) + 1});
                for (const k of joint) bump(cond, k, v);
                for (const [g, table] of parts) for (const gv of asList(grammar.slots.find(s => s.id === g), row.parts[g])) bump(table, key(gv), v);
            }
        }
        const declared = Array.isArray(slot.values) ? slot.values : [];
        for (const v of declared) if (!marginal.has(key(v))) marginal.set(key(v), {value: v, count: 0});
        const values = sortKeys([...marginal.values()].map(e => e.value));
        weights[slot.id] = {
            marginal: Object.fromEntries(values.map(v => [key(v), {value: v, weight: marginal.get(key(v)).count + smoothing,
                reason: `corpus ${marginal.get(key(v)).count}/${n}${smoothing ? ` + smoothing ${smoothing}` : ''}`}])),
            sizes: Object.fromEntries([...sizes].map(([size, count]) => [size, count])),
            given: slot.given ? Object.fromEntries([...cond].map(([g, table]) => [g, Object.fromEntries(table)])) : null,
            byGiven: slot.given ? Object.fromEntries([...parts].map(([g, table]) => [g, Object.fromEntries([...table].map(([k, t]) => [k, Object.fromEntries(t)]))])) : null,
        };
        const sizeKeys = [...sizes.keys()];
        support[slot.id] = {values: values.filter(v => marginal.get(key(v)).count > 0).map(key),
            minSize: sizeKeys.length ? Math.min(...sizeKeys) : 0, maxSize: sizeKeys.length ? Math.max(...sizeKeys) : 0};
    }
    const slots = grammar.slots.map(s => s.values === 'corpus' ? {...s, values: support[s.id].values.map(v => weights[s.id].marginal[v].value)} : s);
    return defineGrammar({...grammar.spec, slots, weights, support, fittedOn: n, dials: {...grammar.dials, smoothing}});
}

// A world overlay reweights by part (GR8) and records each departure from the
// source fit with its reason (PFP18). reweight: {slotId: {value: integer weight}}.
export function overlayGrammar(grammar, {id, reason, reweight = {}}) {
    if (!grammar.weights) fail('Overlay a fitted grammar.');
    if (!id || typeof reason !== 'string' || !reason) fail('An overlay needs an id and an in-world reason.');
    // Per-slot copies, so a nested child grammar (GL6) is shared, not cloned.
    const weights = Object.fromEntries(Object.entries(grammar.weights).map(([k, v]) => [k, {...v, marginal: structuredClone(v.marginal)}])), departures = [];
    for (const [slotId, table] of Object.entries(reweight)) {
        const slot = weights[slotId] ?? fail(`Overlay names unknown slot ${slotId}.`);
        for (const [value, weight] of Object.entries(table)) {
            if (!natural(weight)) fail('Overlay weights are nonnegative integers.');
            const from = slot.marginal[value]?.weight ?? 0;
            slot.marginal[value] = {value: slot.marginal[value]?.value ?? value, weight, reason: `overlay ${id}: ${reason}`};
            departures.push({slot: slotId, value, from, to: weight});
        }
    }
    return defineGrammar({...grammar.spec, weights, support: grammar.support, overlays: [...grammar.overlays, {id, reason, departures}]});
}

// Assemble a thing from parts and run every rule. Canon and generated parts take
// this same path (PFP16, PFP17). Returns {ok, value, receipt}.
export function assemble(grammar, parts) {
    const violations = [], flags = [], normalized = {};
    for (const slot of grammar.slots) {
        const raw = parts?.[slot.id];
        if (slot.type !== 'one' && raw !== undefined && !Array.isArray(raw)) { violations.push({kind: 'bad-shape', slot: slot.id}); continue; }
        const values = slot.type === 'set' ? sortKeys(new Set(asList(slot, raw))) : asList(slot, raw);
        if (values.length < slot.min) violations.push({kind: 'missing-part', slot: slot.id, reason: `needs at least ${slot.min}`});
        if (values.length > slot.max) violations.push({kind: 'too-many-parts', slot: slot.id, count: values.length, max: slot.max});
        else if (values.length > (grammar.support?.[slot.id]?.maxSize ?? Infinity))
            flags.push({kind: 'outside-range', slot: slot.id, count: values.length, max: grammar.support[slot.id].maxSize});
        if (slot.type === 'parts') {
            const child = grammar.weights?.[slot.id]?.child ?? slot.grammar;
            normalized[slot.id] = values.map((childParts, i) => {
                const built = assemble(child, childParts);
                for (const v of built.receipt.violations) violations.push({...v, slot: `${slot.id}[${i}].${v.slot ?? v.rule}`, child: child.ref});
                for (const f of built.receipt.flags) flags.push({...f, slot: `${slot.id}[${i}].${f.slot ?? f.rule}`, child: child.ref});
                return {...built.value.parts, ...(Object.keys(built.value.derived).length ? {derived: built.value.derived} : {})};
            });
            continue;
        }
        const known = Array.isArray(slot.values) ? new Set(slot.values.map(key)) : null;
        const seen = grammar.support ? new Set(grammar.support[slot.id].values) : null;
        for (const v of values) {
            if (known && !known.has(key(v)) && !slot.open) violations.push({kind: 'unknown-part', slot: slot.id, value: v});
            else if (seen && !seen.has(key(v))) flags.push({kind: 'novel-part', slot: slot.id, value: v});
        }
        normalized[slot.id] = slot.type === 'one' ? values[0] : values;
    }
    const derived = {};
    for (const rule of grammar.rules) {
        const out = rule.run({parts: normalized, derived, dials: grammar.dials, support: grammar.support});
        if (rule.kind === 'derive') { Object.assign(derived, out ?? {}); continue; }
        if (out) (rule.severity === 'flag' ? flags : violations).push({kind: rule.severity === 'flag' ? 'rule-flag' : 'rule-reject', rule: rule.id, ...(typeof out === 'object' ? out : {})});
    }
    return {ok: violations.length === 0, value: {grammar: grammar.ref, parts: normalized, derived},
        receipt: {grammar: grammar.ref, violations, flags, overlays: grammar.overlays.map(o => o.id)}};
}

function slotWeight(grammar, slot, value, chosen) {
    const w = grammar.weights[slot.id], base = w.marginal[key(value)]?.weight ?? 0;
    if (!slot.given || !w.given) return {weight: base, reason: w.marginal[key(value)]?.reason ?? 'unweighted'};
    const names = givensOf(slot).join('+');
    const keys = jointKeys(grammar, slot, chosen);
    const conditional = keys.reduce((sum, k) => sum + (w.given[k]?.[key(value)] ?? 0), 0);
    if (conditional > 0) return {weight: conditional, reason: `given ${names} ${keys.join(' ')}: ${conditional}`};
    if (keys.some(k => w.given[k])) return {weight: grammar.dials.smoothing ?? 0, reason: `unseen with ${names}; smoothing`};
    // Joint combination never seen: back off to each given alone (chained), then the marginal.
    if (givensOf(slot).length > 1 && w.byGiven) {
        let backoff = 0, history = false;
        for (const g of givensOf(slot)) for (const gv of asList(grammar.slots.find(s => s.id === g), chosen[g])) {
            const t = w.byGiven[g]?.[key(gv)];
            if (t) { history = true; backoff += t[key(value)] ?? 0; }
        }
        if (backoff > 0) return {weight: backoff, reason: `combination unseen; backed off to ${names} singly: ${backoff}`};
        if (history) return {weight: grammar.dials.smoothing ?? 0, reason: `unseen with any of ${names}; smoothing`};
    }
    return {weight: base, reason: w.marginal[key(value)]?.reason};
}

// One draw of parts in slot order, every draw addressed (GR2). draw(slot) -> uint32.
function drawParts(grammar, draw) {
    const chosen = {}, picks = [];
    for (const slot of grammar.slots) {
        const sizes = Object.entries(grammar.weights[slot.id].sizes).map(([size, count]) => ({id: `size:${size}`, size: Number(size), count}))
            .filter(s => s.size >= slot.min && s.size <= slot.max);
        const size = slot.type === 'one' ? {value: {size: 1}} : pickWeighted(sizes, s => ({weight: s.count, reason: `corpus size ${s.size}`}), draw(address(slot.id, 'size')));
        const k = size.value?.size ?? slot.min;
        if (slot.type === 'parts') {
            const child = grammar.weights[slot.id].child;
            chosen[slot.id] = Array.from({length: k}, (_, i) => {
                const drawn = drawParts(child, sub => draw(address(slot.id, {i}, sub)));
                picks.push(...drawn.picks.map(p => ({...p, slot: `${slot.id}[${i}].${p.slot}`})));
                return drawn.parts;
            });
            continue;
        }
        const values = [], pool = Object.values(grammar.weights[slot.id].marginal).map(e => ({id: key(e.value), value: e.value}));
        for (let i = 0; i < k; i++) {
            const remaining = slot.type === 'tokens' ? pool : pool.filter(p => !values.some(v => key(v) === p.id));
            const pick = pickWeighted(remaining, p => slotWeight(grammar, slot, p.value, chosen), draw(address(slot.id, {i})));
            if (!pick.value) break;
            values.push(pick.value.value);
            picks.push({slot: slot.id, i, ...pick.receipt, top: pick.receipt.top.slice(0, 3)});
        }
        chosen[slot.id] = slot.type === 'one' ? values[0] : values;
    }
    return {parts: chosen, picks};
}

// generate(grammar, {root, address, cause}) -> {value, receipt}. GR1 shape; a
// cause is required for anything that matters (PFP19); retries then the named
// fallback (GR6). The generator writes truth only; knowledge is a projection (GR5).
export function generate(grammar, {root, address: base, cause, maxAttempts = 8, validate = () => true}) {
    if (!grammar.weights) fail('Generate from a fitted grammar.');
    if (!cause || !CAUSES.has(cause.kind) || typeof cause.id !== 'string') fail('A generated thing needs a cause {kind, id} (PFP19).');
    if (typeof base !== 'string' || !base) fail('Generation needs an address (GR2).');
    let draws = 0, picks = [];
    const tracked = attemptKey => slot => {
        if (++draws > grammar.budget.maxDraws) fail(`Grammar ${grammar.ref} exceeded its draw budget (GR11).`);
        return drawU32(root, address(attemptKey, grammar.ref, slot));
    };
    const result = withRetries(attemptKey => {
        const drawn = drawParts(grammar, tracked(attemptKey));
        picks = drawn.picks;
        return assemble(grammar, drawn.parts);
    }, built => built.ok && validate(built.value), {max: maxAttempts, address: base,
        fallback: {id: grammar.fallback.id, value: assemble(grammar, grammar.fallback.parts)}});
    return {value: {...result.value.value, cause}, receipt: {...result.receipt, grammar: grammar.ref, cause, draws, picks,
        flags: result.value.receipt.flags, overlays: result.value.receipt.overlays}};
}

// Infer a hidden part from the parts that are conditioned on it (the slots
// whose given is slotId), using the fitted conditional counts. Ranked
// candidates with reasons; ties fall to the marginal, then code point order.
// Inference is a reading, not a draw, so fractions are fine here.
export function inferSlot(grammar, parts, slotId) {
    if (!grammar.weights) fail('Infer from a fitted grammar.');
    const slot = grammar.slots.find(s => s.id === slotId) ?? fail(`Unknown slot ${slotId}.`);
    const children = grammar.slots.filter(s => givensOf(s).includes(slotId));
    const marginal = grammar.weights[slotId].marginal;
    const total = Object.values(marginal).reduce((n, e) => n + e.weight, 0);
    const ranked = Object.values(marginal).filter(e => e.weight > 0).map(e => {
        // A jointly conditioned child is read through its table for this slot alone.
        const table = children.map(c => (givensOf(c).length > 1 ? grammar.weights[c.id].byGiven?.[slotId] : grammar.weights[c.id].given)?.[key(e.value)] ?? {});
        // Naive Bayes with add-one smoothing over each observed child part; the
        // log prior is a dial (inferPrior), off by default because it pulls sparse
        // name evidence toward the majority value.
        let score = grammar.dials.inferPrior ? Math.log(e.weight / total) : 0;
        children.forEach((c, i) => {
            const n = Object.values(table[i]).reduce((a, x) => a + x, 0), vocab = (grammar.support?.[c.id]?.values.length ?? 0) + 1;
            for (const v of asList(c, parts[c.id])) score += Math.log(((table[i][key(v)] ?? 0) + 1) / (n + vocab));
        });
        return {value: e.value, score: Math.round(score * 1000) / 1000, marginal: e.weight, reason: children.map(c => c.id).join('+') || 'marginal only'};
    }).sort((a, b) => b.score - a.score || b.marginal - a.marginal || compareCodePoints(key(a.value), key(b.value)));
    return {slot: slot.id, ranked: ranked.slice(0, 5), best: ranked[0]?.value ?? null};
}

// Forward prediction (GL2): the most weighted value of a slot given the parts
// already known, read through the same conditional weights a draw uses.
export function predictSlot(grammar, parts, slotId) {
    if (!grammar.weights) fail('Predict from a fitted grammar.');
    const slot = grammar.slots.find(s => s.id === slotId) ?? fail(`Unknown slot ${slotId}.`);
    const ranked = Object.values(grammar.weights[slotId].marginal)
        .map(e => ({value: e.value, ...slotWeight(grammar, slot, e.value, parts), marginal: e.weight}))
        .filter(e => e.weight > 0)
        .sort((a, b) => b.weight - a.weight || b.marginal - a.marginal || compareCodePoints(key(a.value), key(b.value)));
    return {slot: slotId, best: ranked[0]?.value ?? null, ranked: ranked.slice(0, 5)};
}
// Predict several slots in order, each from the known parts plus earlier predictions.
export function predictParts(grammar, known, slotIds) {
    const parts = {...known}, out = {};
    for (const id of slotIds) { out[id] = predictSlot(grammar, parts, id).best; parts[id] = out[id]; }
    return out;
}

const foldOf = (id, folds) => indexFromU32(drawU32('canon-test', address('fold', id)), folds);
function group(failures) {
    const byKey = new Map();
    for (const f of failures) {
        const k = [f.kind, f.rule ?? f.slot ?? f.field, f.cause ?? '', f.kind === 'unknown-part' ? key(f.value) : ''].join('|');
        const entry = byKey.get(k) ?? {kind: f.kind, rule: f.rule, slot: f.slot, field: f.field, cause: f.cause, value: f.value, count: 0, examples: []};
        entry.count++;
        if (entry.examples.length < 5) entry.examples.push(f.id);
        byKey.set(k, entry);
    }
    return [...byKey.values()].sort((a, b) => b.count - a.count || compareCodePoints(a.kind + (a.rule ?? a.slot ?? a.field), b.kind + (b.rule ?? b.slot ?? b.field)));
}

// The canon test (PFP17). rows: raw corpus rows with an id. label(row) ->
// {parts, truth} or {missing:[...]} (labelling is the domain's, MC14).
// compare(value, truth) -> [{field, expected, got}] mismatches. identity(value)
// names a thing for collision checks (NMR2). Deterministic folds by row id.
export function canonTest(grammar, rows, {label, compare = () => [], identity = null, folds = 5, smoothing = 0,
    generated = 200, root = 'canon-test', tolerance = 0.25, infer = [], pairs = [], predict = []} = {}) {
    const labelled = [], unlabelled = [];
    for (const row of rows) {
        const out = label(row);
        if (out?.parts) labelled.push({id: row.id, parts: out.parts, truth: out.truth ?? {}});
        else unlabelled.push({id: row.id, missing: out?.missing ?? ['unknown']});
    }
    const failures = [], openCoverage = {tested: 0, covered: 0};
    const inference = Object.fromEntries(infer.map(id => [id, {tested: 0, hits: 0, baselineHits: 0}]));
    // predict: hide these slots (one-valued) and predict them in order from the rest.
    const prediction = {tested: 0, all: 0, baselineAll: 0, misses: new Map(), slots: Object.fromEntries(predict.map(id => [id, {hits: 0, baselineHits: 0}]))};
    let passed = 0;
    for (let fold = 0; fold < folds; fold++) {
        const test = labelled.filter(r => foldOf(r.id, folds) === fold);
        if (!test.length) continue;
        const fitted = fitGrammar(grammar, labelled.filter(r => foldOf(r.id, folds) !== fold), {smoothing});
        for (const row of test) {
            for (const slotId of infer) {
                const truth = asList(grammar.slots.find(s => s.id === slotId), row.parts[slotId]).map(key);
                const hidden = {...row.parts, [slotId]: undefined};
                const best = inferSlot(fitted, hidden, slotId).best;
                const majority = Object.values(fitted.weights[slotId].marginal).sort((a, b) => b.weight - a.weight || compareCodePoints(key(a.value), key(b.value)))[0]?.value;
                inference[slotId].tested++;
                if (best !== null && truth.includes(key(best))) inference[slotId].hits++;
                if (majority !== undefined && truth.includes(key(majority))) inference[slotId].baselineHits++;
            }
            if (predict.length) {
                const known = Object.fromEntries(Object.entries(row.parts).filter(([k]) => !predict.includes(k)));
                const got = predictParts(fitted, known, predict);
                const majority = Object.fromEntries(predict.map(id => [id, Object.values(fitted.weights[id].marginal)
                    .sort((a, b) => b.weight - a.weight || compareCodePoints(key(a.value), key(b.value)))[0]?.value]));
                prediction.tested++;
                let all = true, baseAll = true;
                for (const id of predict) {
                    const hit = key(got[id]) === key(row.parts[id]), base = key(majority[id]) === key(row.parts[id]);
                    if (hit) prediction.slots[id].hits++; else {
                        all = false;
                        const k = `${id}: ${key(row.parts[id])} read as ${key(got[id])}`;
                        const m = prediction.misses.get(k) ?? {miss: k, count: 0, examples: []};
                        m.count++; if (m.examples.length < 4) m.examples.push(row.id);
                        prediction.misses.set(k, m);
                    }
                    if (base) prediction.slots[id].baselineHits++; else baseAll = false;
                }
                if (all) prediction.all++;
                if (baseAll) prediction.baselineAll++;
            }
            const built = assemble(fitted, row.parts);
            const mismatches = built.ok ? compare(built.value, row.truth) : [];
            openCoverage.tested++;
            if (!built.receipt.flags.some(f => f.kind === 'novel-part')) openCoverage.covered++;
            if (built.ok && !mismatches.length) { passed++; continue; }
            for (const v of built.receipt.violations) failures.push({id: row.id, ...v});
            for (const m of mismatches) failures.push({id: row.id, kind: 'derive-mismatch', ...m});
        }
    }
    const full = fitGrammar(grammar, labelled, {smoothing});
    // Joint support: which value pairs across two slots the corpus shows. Slots
    // are drawn separately, so this is the range check that can actually miss.
    const pairSlots = pairs.map(([a, b]) => [a, b].map(id => full.slots.find(s => s.id === id) ?? fail(`Unknown pair slot ${id}.`)));
    const combos = (parts, [a, b]) => asList(a, parts[a.id]).flatMap(x => asList(b, parts[b.id]).map(y => `${key(x)}|${key(y)}`));
    const seenPairs = pairSlots.map(ps => new Set(labelled.flatMap(r => combos(r.parts, ps))));
    const pairStats = pairSlots.map(() => ({items: 0, unseenItems: 0, examples: []}));
    const corpusIds = identity ? new Set(labelled.map(r => identity(assemble(full, r.parts).value))) : null;
    const counts = Object.fromEntries(full.slots.map(s => [s.id, new Map()]));
    let inside = 0, fallbacks = 0, collisions = 0, flagged = 0;
    const outside = [];
    for (let i = 0; i < generated; i++) {
        const out = generate(full, {root, address: address('canon-test', grammar.ref, {i}), cause: {kind: 'canon-test', id: `range:${i}`}});
        if (out.receipt.fallbackUsed) fallbacks++;
        for (const s of full.slots) if (s.type !== 'parts') for (const v of asList(s, out.value.parts[s.id])) counts[s.id].set(key(v), (counts[s.id].get(key(v)) ?? 0) + 1);
        const novel = out.receipt.flags.filter(f => f.kind === 'novel-part' || f.kind === 'outside-range');
        if (out.receipt.flags.some(f => f.kind === 'rule-flag')) flagged++;
        pairSlots.forEach((ps, j) => {
            const unseen = combos(out.value.parts, ps).filter(c => !seenPairs[j].has(c));
            pairStats[j].items++;
            if (unseen.length) { pairStats[j].unseenItems++; if (pairStats[j].examples.length < 5) pairStats[j].examples.push(unseen[0]); }
        });
        if (corpusIds?.has(identity(out.value))) collisions++;
        if (!out.receipt.fallbackUsed && !novel.length) inside++; else if (outside.length < 5) outside.push({i, novel, fallback: out.receipt.fallbackUsed});
    }
    const shares = {};
    for (const s of full.slots) {
        if (s.type === 'parts') { shares[s.id] = {distance: null, nested: true}; continue; }
        const corpus = full.weights[s.id].marginal, total = Object.values(corpus).reduce((n, e) => n + e.weight, 0);
        const gen = counts[s.id], genTotal = [...gen.values()].reduce((n, c) => n + c, 0);
        if (!total || !genTotal) { shares[s.id] = {distance: null}; continue; }
        const values = new Set([...Object.keys(corpus), ...gen.keys()]);
        const distance = [...values].reduce((sum, v) => sum + Math.abs((corpus[v]?.weight ?? 0) / total - (gen.get(v) ?? 0) / genTotal), 0) / 2;
        shares[s.id] = {distance: Math.round(distance * 1000) / 1000, withinTolerance: distance <= tolerance};
    }
    const rate = labelled.length ? passed / labelled.length : 0;
    return {grammar: grammar.ref, contract: GRAMMAR_CONTRACT, folds, smoothing,
        corpus: {rows: rows.length, labelled: labelled.length, unlabelled: unlabelled.length,
            unlabelledReasons: group(unlabelled.flatMap(u => u.missing.map(m => ({id: u.id, kind: 'unlabelled', field: m}))))},
        rebuild: {tested: labelled.length, passed, rate: Math.round(rate * 1000) / 1000},
        openPartCoverage: {...openCoverage, rate: openCoverage.tested ? Math.round(openCoverage.covered / openCoverage.tested * 1000) / 1000 : 0},
        missingRules: group(failures),
        prediction: predict.length ? {tested: prediction.tested,
            misses: [...prediction.misses.values()].sort((a, b) => b.count - a.count || compareCodePoints(a.miss, b.miss)).slice(0, 12),
            all: {hits: prediction.all, rate: prediction.tested ? Math.round(prediction.all / prediction.tested * 1000) / 1000 : 0,
                baseline: prediction.tested ? Math.round(prediction.baselineAll / prediction.tested * 1000) / 1000 : 0},
            slots: Object.fromEntries(Object.entries(prediction.slots).map(([id, r]) => [id, {hits: r.hits,
                rate: prediction.tested ? Math.round(r.hits / prediction.tested * 1000) / 1000 : 0,
                baseline: prediction.tested ? Math.round(r.baselineHits / prediction.tested * 1000) / 1000 : 0}]))} : null,
        inference: Object.fromEntries(Object.entries(inference).map(([id, r]) => [id, {...r,
            rate: r.tested ? Math.round(r.hits / r.tested * 1000) / 1000 : 0,
            baseline: r.tested ? Math.round(r.baselineHits / r.tested * 1000) / 1000 : 0}])),
        range: {generated, inside, rate: Math.round(inside / generated * 1000) / 1000, fallbacks, ruleFlagged: flagged, canonCollisions: collisions,
            tolerance, shares, outside,
            pairs: Object.fromEntries(pairSlots.map(([a, b], j) => [`${a.id}+${b.id}`, {...pairStats[j], seenInCorpus: seenPairs[j].size,
                supportedRate: pairStats[j].items ? Math.round((1 - pairStats[j].unseenItems / pairStats[j].items) * 1000) / 1000 : 0}]))}};
}

// PR2 · Freeze on reveal, grammar version pinned. A frozen value keeps its
// parts, derived fields, cause and the grammar ref that made it. Thawing never
// re-derives under a newer revision: a revision changes only unseen things.
export const FROZEN_SCHEMA = 'grammar.frozen@1';
export function freezeValue(value) {
    if (!value?.grammar || !value.parts) fail('Freeze an assembled or generated value.');
    return structuredClone({schema: FROZEN_SCHEMA, grammar: value.grammar, parts: value.parts, derived: value.derived ?? {}, cause: value.cause ?? null});
}
// grammars: {ref: grammar}. Returns the stored value as it was seen, plus
// whether the pinned revision is still loaded and still accepts it.
export function thawValue(frozen, grammars = {}) {
    if (frozen?.schema !== FROZEN_SCHEMA || typeof frozen.grammar !== 'string') fail('Not a frozen grammar value.');
    const pinned = grammars[frozen.grammar];
    const check = pinned ? assemble(pinned, frozen.parts) : null;
    return {value: structuredClone({grammar: frozen.grammar, parts: frozen.parts, derived: frozen.derived, cause: frozen.cause}),
        receipt: {pinnedLoaded: Boolean(pinned), stillValid: check ? check.ok : null, violations: check?.receipt.violations ?? []}};
}
