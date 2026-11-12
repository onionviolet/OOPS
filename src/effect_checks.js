// New effects beyond the book (chat P, plan NV1-NV5, PFP23, PFP24). Propose
// candidates from canon sentences at a novelty dial with a cause, then run the
// five checks: it runs, it pays, the world allows it, it explains itself, and
// a kept set is worth keeping with a diverse spread. Domain-free: a world pack
// supplies its laws, words, prices and exceptions. Draws go through gen_kit.
import {address, compareCodePoints, drawU32, indexFromU32, pickWeighted} from './gen_kit.js';
import {assemble} from './procedural_grammar.js';
import {searchParts, previewValue} from './grammar_search.js';
import {EFFECT_OBJECTS, scopeOf} from './effect_grammar.js';

const CORE = ['verb', 'object', 'target', 'time', 'carrier', 'cost'];
const MUTABLE = ['verb', 'object', 'target', 'time', 'limits'];
const fail = message => { throw new Error(message); };
const lawKey = parts => `${parts.verb}|${EFFECT_OBJECTS[parts.object]}`;

// The laws a world's canon proves it has: each verb on each object kind some
// canon sentence uses. A world may declare more with a reason (AD5).
export function worldLaws(canonParts, {extra = []} = {}) {
    return new Set([...canonParts.map(lawKey), ...extra.map(e => e.law)]);
}

// One curve prices reach and time (check 2, P5). Canon rows with an amount
// fit cost = base + perPoint x scope by least squares in whole thousandths.
// With no amounts the world's default curve dial applies.
export function fitCostCurve(canon, {fallback = {base: 1, perPoint: 1, fitted: false, reason: 'default curve dial: no canon amounts'}} = {}) {
    const points = canon.filter(c => Number.isFinite(c.amount)).map(c => ({x: scopeOf(c.parts), y: c.amount}));
    if (points.length < 3 || new Set(points.map(p => p.x)).size < 2) return {...fallback, points: points.length};
    const n = points.length, mx = points.reduce((s, p) => s + p.x, 0) / n, my = points.reduce((s, p) => s + p.y, 0) / n;
    const slope = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / points.reduce((s, p) => s + (p.x - mx) ** 2, 0);
    const perPoint = Math.max(0, Math.round(slope * 1000)), base = Math.round((my - slope * mx) * 1000);
    return {base: base / 1000, perPoint: perPoint / 1000, fitted: true, points: n, reason: `least squares over ${n} canon amounts`};
}
export const priceOf = (curve, parts) => Math.max(0, Math.round((curve.base + curve.perPoint * scopeOf(parts)) * 1000) / 1000);

// Distance to the nearest canon sentence over the core parts.
export function novelty(parts, canonParts) {
    let best = Infinity;
    for (const c of canonParts) best = Math.min(best, CORE.filter(k => c[k] !== parts[k]).length);
    return best === Infinity ? CORE.length : best;
}

// Propose candidates (NV1 recombine at levels 0 and 1, NV3 transfer at 2).
// novelty: {level, cause}; who strays how far, and why (PFP24). Level 3
// (compose, NV2) is a kernel composed working (SC6) and is refused here.
export function proposeEffects(fitted, canon, {root, address: base, cause, novelty: dial, count = 12, transferFrom = []} = {}) {
    if (!cause?.kind || !cause.id) fail('Proposals need a cause (PFP19).');
    if (!dial || !Number.isInteger(dial.level) || !dial.cause) fail('The novelty dial needs a level and a cause (PFP24).');
    if (dial.level >= 3) fail('Composition (NV2) is a K composed working (SC6); request it from chat K.');
    const source = dial.level === 2 ? transferFrom : canon;
    if (!source.length) fail('No canon to start from.');
    const draw = (...parts) => drawU32(root, address(base, fitted.ref, ...parts));
    const out = [];
    for (let i = 0; i < count; i++) {
        const seed = source[indexFromU32(draw({i}, 'seed'), source.length)];
        const parts = structuredClone(seed.parts), changed = [];
        if (dial.level === 2) {
            // Transfer: keep the substance, take this world's carrier and cost (NV3).
            for (const slot of ['carrier', 'cost']) {
                const pool = Object.values(fitted.weights[slot].marginal).map(e => ({id: String(e.value), value: e.value}));
                const pick = pickWeighted(pool, p => ({weight: fitted.weights[slot].marginal[p.id].weight, reason: 'fitted'}), draw({i}, slot));
                if (pick.value) parts[slot] = pick.value.value;
            }
            changed.push('carrier', 'cost');
        }
        const n = dial.level === 2 ? 1 : dial.level + 1;
        const slots = [...MUTABLE];
        for (let j = 0; j < n && slots.length; j++) {
            const slot = slots.splice(indexFromU32(draw({i, j}, 'slot'), slots.length), 1)[0];
            const decl = fitted.slots.find(s => s.id === slot);
            if (slot === 'limits') {
                // Drop a limit if there is one, else add one the world knows.
                if (parts.limits.length) parts.limits = parts.limits.slice(1);
                else if (decl.values.length) parts.limits = [decl.values[indexFromU32(draw({i, j}, 'limit'), decl.values.length)]];
                changed.push('limits');
                continue;
            }
            const pool = decl.values.filter(v => v !== parts[slot]).map(v => ({id: String(v), value: v}));
            // Openness: every declared value keeps weight 1 above its fit, so the
            // dial can reach parts the source never used (AD56).
            const pick = pickWeighted(pool, p => ({weight: (fitted.weights[slot].marginal[p.id]?.weight ?? 0) + 1, reason: 'fit plus openness 1'}), draw({i, j}, slot));
            if (pick.value) { parts[slot] = pick.value.value; changed.push(slot); }
        }
        out.push({id: `${base}#${i}`, parts, origin: {canon: seed.id, level: dial.level, changed}, cause, noveltyCause: dial.cause});
    }
    return out;
}

// The four per-candidate checks, in order. world: {laws:Set, curve, words:{slot:{value:word}}, forbid:[{law, reason, exception?:{reason, cost}}]}.
export function checkEffect(fitted, candidate, world) {
    const checks = [];
    const built = assemble(fitted, candidate.parts);
    const law = lawKey(candidate.parts);
    const runs = built.ok && world.laws.has(law);
    checks.push({id: 'runs', pass: runs, reason: !built.ok ? built.receipt.violations.map(v => v.reason ?? v.kind).join('; ')
        : runs ? `the world's ${law} law runs it` : `no law in this world runs ${law}`});
    const price = priceOf(world.curve, candidate.parts);
    const declared = candidate.amount;
    const pays = declared === undefined || declared >= price;
    checks.push({id: 'pays', pass: pays, price, reason: declared === undefined ? `priced at ${price} by ${world.curve.reason}` : pays ? `pays ${declared} of ${price}` : `underpriced: ${declared} below ${price}`});
    const rule = (world.forbid ?? []).find(f => f.law === law);
    const allows = !rule || Boolean(rule.exception);
    checks.push({id: 'allows', pass: allows, reason: !rule ? 'no world law forbids it' : rule.exception
        ? `allowed by exception: ${rule.exception.reason} (cost: ${rule.exception.cost})` : `forbidden: ${rule.reason}`});
    const missing = [], words = [];
    for (const slot of CORE) {
        const word = world.words?.[slot]?.[candidate.parts[slot]];
        if (word) words.push(word); else missing.push(`${slot}:${candidate.parts[slot]}`);
    }
    checks.push({id: 'explains', pass: !missing.length, text: missing.length ? null : words.join(' '), reason: missing.length ? `no world words for ${missing.join(', ')}` : 'every part has a world word'});
    return {id: candidate.id, pass: checks.every(c => c.pass), checks, built: built.value};
}

// Check 5 over a set: keep the best candidate per niche (verb and object
// kind), then fill by score, so the world gets a spread of different effects,
// not one best effect copied. score weights are integer dials.
export function keepSpread(candidates, canonParts, {k = 6, weights = {useful: 1, novel: 2, fit: 1}, fit = () => 0} = {}) {
    const scored = candidates.map(c => {
        const useful = scopeOf(c.parts), novel = novelty(c.parts, canonParts), fitScore = fit(c.parts);
        return {...c, score: weights.useful * useful + weights.novel * novel + weights.fit * fitScore, parts: c.parts,
            breakdown: {useful, novel, fit: fitScore}, niche: lawKey(c.parts)};
    }).sort((a, b) => b.score - a.score || compareCodePoints(a.id, b.id));
    const kept = [], niches = new Set();
    for (const c of scored) if (kept.length < k && !niches.has(c.niche)) { kept.push(c); niches.add(c.niche); }
    for (const c of scored) if (kept.length < k && !kept.includes(c)) kept.push(c);
    return {kept, niches: niches.size, considered: candidates.length};
}

// PR4 · Niche archive (quality-diversity). One best entry per niche, keyed by
// verb, object and carrier by default; plain JSON so a world can save it. A new
// entry replaces the holder only with a strictly higher score; ties keep the
// older entry, so the archive is stable under replay.
export const ARCHIVE_SCHEMA = 'effects.archive@1';
export function createNicheArchive({keys = ['verb', 'object', 'carrier']} = {}) {
    return {schema: ARCHIVE_SCHEMA, keys: [...keys], niches: {}};
}
export function archiveOffer(archive, entry) {
    if (archive?.schema !== ARCHIVE_SCHEMA) fail('Not a niche archive.');
    if (!entry?.id || !entry.parts || !Number.isSafeInteger(entry.score)) fail('An archive entry needs an id, parts and an integer score.');
    const niche = archive.keys.map(k => entry.parts[k]).join('|');
    const held = archive.niches[niche];
    const accepted = !held || entry.score > held.score;
    const next = accepted ? {...archive, niches: {...archive.niches, [niche]: structuredClone(entry)}} : archive;
    return {archive: next, receipt: {niche, accepted, replaced: accepted && held ? held.id : null, reason: !held ? 'new niche' : accepted ? `beats ${held.score}` : `holder scores ${held.score}`}};
}

// Whole pipeline: propose, check, keep. Returns every candidate's checks so a
// failure reads as the missing law, price, exception or word.
// PR3 · Bounded search: budget.trials caps proposals plus checks (each counts
// one trial); budget.stop() is an optional caller-owned clock test (the caller
// owns time, so the search stays pure). A truncated search says so.
export function exploreEffects(fitted, canon, world, options) {
    const budget = options.budget ?? {trials: 400};
    if (!Number.isSafeInteger(budget.trials) || budget.trials < 2) fail('A search budget needs at least two trials (PR3).');
    const count = Math.min(options.count ?? 12, Math.floor(budget.trials / 2));
    const candidates = proposeEffects(fitted, canon, {...options, count});
    const results = [];
    let used = count, stopped = false;
    for (const c of candidates) {
        if (used >= budget.trials || budget.stop?.()) { stopped = true; break; }
        results.push({candidate: c, ...checkEffect(fitted, c, world)});
        used++;
    }
    const passing = results.filter(r => r.pass).map(r => r.candidate);
    const spread = keepSpread(passing, canon.map(c => c.parts), options.keep);
    const failures = {};
    for (const r of results) for (const c of r.checks) if (!c.pass) failures[c.id] = (failures[c.id] ?? 0) + 1;
    let archive = options.archive ?? createNicheArchive();
    for (const c of spread.kept) archive = archiveOffer(archive, {id: c.id, parts: c.parts, score: c.score, cause: c.cause, grammar: fitted.ref}).archive;
    return {proposed: candidates.length, checked: results.length, passed: passing.length, failures, kept: spread.kept, niches: spread.niches, archive,
        budget: {trials: budget.trials, used, truncated: stopped || count < (options.count ?? 12)}, results};
}

// PM3 · Say what you want, get candidates. goal: a partial sentence ("hide the
// camp" = conceal information around). actor.knows bounds the verbs and objects
// the actor understands; actor.owns bounds carriers and costs. Target, time and
// limits stay open, so a preview can show them as unknown to the actor (PM2).
// Every candidate passes the same four checks as any new effect (PM1).
export function searchEffectsForGoal(fitted, goal, {actor, world, budget = {trials: 120}, beam = 24, answers = 4}) {
    if (!actor?.knows || !actor.owns) fail('A goal search reads what the actor knows and owns.');
    const pool = {verb: actor.knows.verb, object: actor.knows.object, carrier: actor.owns.carrier, cost: actor.owns.cost};
    for (const k of Object.keys(pool)) if (!pool[k]) delete pool[k];
    const out = searchParts(fitted, {want: {parts: goal}, pool, budget, beam, answers,
        accept: value => checkEffect(fitted, {id: 'goal', parts: value.parts}, world).pass});
    // What the actor asked for is known to them; the rest of the preview is as they know it.
    const knows = {...actor.knows};
    for (const [slot, v] of Object.entries(goal)) knows[slot] = [...new Set([...(Array.isArray(knows[slot]) ? knows[slot] : []), ...(Array.isArray(v) ? v : [v])])];
    return {...out, answers: out.answers.map(a => ({parts: a.parts, checks: checkEffect(fitted, {id: 'goal', parts: a.parts}, world).checks,
        preview: previewValue(fitted, a.value, knows)}))};
}
// What an actor knows, read from the canon sentences they have seen.
export function knowledgeFrom(sentences) {
    const knows = {};
    for (const s of sentences) for (const [slot, v] of Object.entries(s)) {
        knows[slot] ??= [];
        for (const x of Array.isArray(v) ? v : [v]) if (!knows[slot].includes(x)) knows[slot].push(x);
    }
    return knows;
}
