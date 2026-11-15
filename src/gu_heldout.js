// Held-out scoring for Gu kinds (RUN.md "Then" and "Wave order"; PC72), the Gu side of brew_heldout.js and
// spell_heldout.js. Diagnostic plus engine: a small rule fitted on a seeded tuning sample predicts a kind's
// function class from identity (wiki type and path labels, wiki rank, name words), and for kinds that carry an
// activation row builds a probe ability and runs it through the real `resolveGuActivation`. Outcome (which
// kind of effect) and route (which essence pool and what charge) are scored apart. Pure functions; the report
// script passes in the catalogue. Every constraint here is a default with a dial (AD56).
//
// What counts as the label. `parts.value.function` is the catalogue author's reading of the cited scenes and
// `ability.value` is built from the scene's `observed` text; both keep wiki labels apart. Magnitudes and costs
// carry an `authored` sentence, so a cost miss is sorted as the author's exception, never a rule fault.
// The prediction never reads `parts.function`, `ability` or `recipe`; `identityOf` drops them.
import {resolveGuActivation} from './gu_activation.js';

export const SEED = 'gu-heldout-1';
export const TUNED_COUNT = 8;
export const SPLIT_RULE = `Among catalogue kinds whose parts row names a function, kinds are ordered by an FNV-1a hash of "${SEED}:<id>" and the first ${TUNED_COUNT} are the tuning sample; every other such kind is held out. `
    + 'Dial: seed and sample size (a different seed is a different split, and the fixed one is the reported one).';

/** Effect kind (or modifier property) -> class the probe and the label are compared in. Rows are the
 * kinds the catalogue's activation rows carry; a new kind is `missing rule` until a row is added here. */
export const EFFECT_CLASS = Object.freeze({
    lightning: 'attack', flame: 'attack', damage: 'attack',
    'water-guard': 'guard', 'jade-guard': 'guard', 'impact-guard': 'guard', 'lightning-shield': 'guard',
    'visual-concealment': 'conceal', 'pierce-visual-concealment': 'sense', 'ground-hearing': 'sense',
    flight: 'fly', dash: 'move', travel: 'travel', 'project-demeanor': 'mind',
});
const MODIFIER_CLASS = Object.freeze({count: 'amplify', magnitude: 'amplify', range: 'amplify', cost: 'economize'});

/** Probe effect per class: the plainest effect kind of that class (a default, dial: a richer template). */
export const PROBE_EFFECT = Object.freeze({
    attack: {kind: 'damage', magnitude: 1}, guard: {kind: 'impact-guard', magnitude: 1},
    conceal: {kind: 'visual-concealment', magnitude: 1}, sense: {kind: 'ground-hearing', magnitude: 1},
    fly: {kind: 'flight', magnitude: 1}, move: {kind: 'dash', magnitude: 1}, travel: {kind: 'travel', magnitude: 1},
});
const PROBE_MODIFIER = Object.freeze({amplify: {property: 'magnitude', factor: 2}, economize: {property: 'cost', factor: 0.5}});

export const abilityClass = ability => ability.effect ? EFFECT_CLASS[ability.effect.kind] ?? null
    : MODIFIER_CLASS[(ability.modifier ?? ability.modifiers?.[0])?.property] ?? null;

const fnv = s => { let h = 0x811c9dc5; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0; return h; };

/** Fixed split. entries: Object.entries(guCatalogue). Kinds with no function reading are out of scope. */
export function splitGu(entries, seed = SEED) {
    const scoped = entries.filter(([, k]) => k.parts?.value.function).map(([id]) => id)
        .sort((a, b) => fnv(`${seed}:${a}`) - fnv(`${seed}:${b}`) || a.localeCompare(b));
    return {tuned: scoped.slice(0, TUNED_COUNT).sort(), heldOut: scoped.slice(TUNED_COUNT).sort(),
        outOfScope: entries.filter(([, k]) => !k.parts?.value.function).map(([id]) => id).sort()};
}

/** The identity projection: the only fields a prediction may read. */
export function identityOf(id, kind) {
    const wiki = kind.parts?.value.wiki ?? {};
    const features = [...(wiki.type ?? []).map(t => `type:${t}`), ...(wiki.path ?? []).map(p => `path:${p}`),
        ...id.split('-').map(w => `word:${w}`)];
    return {id, features, rank: wiki.rank?.[0] ?? kind.parts?.value.rank?.[0] ?? null};
}

const mode = counts => Object.entries(counts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? null;

/** Fit on the tuning kinds only: feature -> class votes, and the cost seen per rank band. */
export function fitGu(tunedIds, catalogue) {
    const votes = {}, costs = {}, rankCosts = {};
    for (const id of tunedIds) {
        const kind = catalogue[id], fn = kind.parts.value.function, ident = identityOf(id, kind);
        for (const f of ident.features) { votes[f] ??= {}; votes[f][fn] = (votes[f][fn] ?? 0) + 1; }
        if (kind.ability) {
            const cost = String(kind.ability.value.cost ?? 1);
            costs[cost] = (costs[cost] ?? 0) + 1;
            if (ident.rank !== null) { rankCosts[ident.rank] ??= {}; rankCosts[ident.rank][cost] = (rankCosts[ident.rank][cost] ?? 0) + 1; }
        }
    }
    return {votes, defaultCost: Number(mode(costs) ?? 1), rankCosts: Object.fromEntries(Object.entries(rankCosts).map(([r, c]) => [r, Number(mode(c))]))};
}

/** Predict one kind: class by feature votes (ties alphabetical), fuel by wiki rank, cost by tuned rank band. */
export function predictGu(id, kind, fit) {
    const ident = identityOf(id, kind), tally = {};
    for (const f of ident.features) for (const [fn, n] of Object.entries(fit.votes[f] ?? {})) tally[fn] = (tally[fn] ?? 0) + n;
    const ranked = Object.entries(tally).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
    const fuel = ident.rank !== null && ident.rank >= 6 ? 'immortal' : 'primeval';
    return {class: ranked[0]?.[0] ?? null, voted: ranked.map(r => r[0]), fuel, cost: fit.rankCosts[ident.rank] ?? fit.defaultCost};
}

/** Run the probe ability through the real activation engine. Returns {ran, effectClass, fuel, cost} or {ran: false, why}. */
export function runProbe(id, kind, pred) {
    const probe = PROBE_EFFECT[pred.class] ? {fuel: pred.fuel, cost: pred.cost, effect: structuredClone(PROBE_EFFECT[pred.class])}
        : PROBE_MODIFIER[pred.class] ? {fuel: pred.fuel, cost: pred.cost, modifier: structuredClone(PROBE_MODIFIER[pred.class])} : null;
    if (!probe) return {ran: false, why: pred.class ? `no probe effect for class ${pred.class}` : 'no class predicted'};
    const gu = {id: `probe-${id}`, kind: id, rank: identityOf(id, kind).rank ?? 1, alive: true, injured: false, fedThrough: 0};
    const result = resolveGuActivation({stages: [{gu, operator: 'op', ability: probe}], reserves: {op: {primeval: 99, immortal: 99, mental: 99}}, day: 0});
    if (result.outcome !== 'complete') return {ran: false, why: result.reason ?? result.outcome};
    const [a] = result.activations;
    return {ran: true, effectClass: abilityClass(result.effects[0] ? {effect: result.effects[0]} : probe), fuel: a.fuel, cost: a.cost};
}

/** Sort one miss. Categories: wrong rule, missing rule, missing data, author's exception, undecidable default. */
function sortOutcomeMiss(trueClass, pred) {
    if (!pred.class) return {category: 'missing data', why: 'no wiki label, rank-free name word or tuning row names a class for this identity'};
    if (pred.voted.includes(trueClass)) return {category: 'wrong rule', why: `class ${pred.class} outranked the true class ${trueClass}`};
    return {category: 'missing rule', why: `identity votes ${pred.voted.join('/')}; no feature in the fit votes the true class ${trueClass}`};
}

/** Score held-out kinds. Diagnostic outcome: predicted function class = the parts row's function. Engine outcome
 * and route: only kinds with an activation row; outcome = the probe's effect class = the ability's class, route =
 * pool and charge both equal the ability's. Every held-out kind counts in the diagnostic. */
export function scoreGu(heldIds, fit, catalogue) {
    const rows = heldIds.map(id => {
        const kind = catalogue[id], truth = kind.parts.value.function, pred = predictGu(id, kind, fit);
        const diagOutcome = pred.class === truth;
        const row = {id, truth, predicted: pred.class ?? 'none', diagOutcome, engine: null, miss: null, misses: []};
        if (!diagOutcome) row.misses.push({field: 'outcome', ...sortOutcomeMiss(truth, pred)});
        if (kind.ability) {
            const a = kind.ability.value, trueClass = abilityClass(a), probe = runProbe(id, kind, pred);
            row.trueClass = trueClass;
            if (!probe.ran) {
                row.engine = {ran: false, why: probe.why};
                row.misses.push({field: 'engine', category: 'missing rule', why: probe.why});
            } else {
                const outcome = probe.effectClass === trueClass, fuel = probe.fuel === a.fuel, cost = probe.cost === a.cost;
                row.engine = {ran: true, outcome, route: fuel && cost, fuel, cost, probeFuel: probe.fuel, probeCost: probe.cost, actualFuel: a.fuel, actualCost: a.cost};
                if (!outcome && diagOutcome) row.misses.push({field: 'engine outcome', category: 'wrong rule', why: `the probe for ${pred.class} yields ${probe.effectClass}, the ability is ${trueClass} (${a.effect?.kind ?? 'modifier'})`});
                if (!fuel) row.misses.push({field: 'route', category: 'missing rule', why: `pool ${probe.fuel} from wiki rank, the ability uses ${a.fuel}`});
                if (fuel && !cost) row.misses.push({field: 'route', category: "author's exception", why: `charge ${probe.cost} from the tuned rank band, the ability's ${a.cost} is authored ("${kind.ability.authored}")`});
            }
        }
        row.miss = row.misses[0] ?? null;
        return row;
    });
    const count = f => rows.filter(f).length;
    const runnable = rows.filter(r => r.engine?.ran);
    return {n: rows.length, diagOutcome: count(r => r.diagOutcome),
        withAbility: count(r => r.engine), ran: runnable.length, cannotRun: rows.length - runnable.length,
        engineOutcome: runnable.filter(r => r.engine.outcome).length, engineRoute: runnable.filter(r => r.engine.route).length,
        rows, misses: rows.filter(r => r.misses.length).sort((a, b) => a.id.localeCompare(b.id))};
}
