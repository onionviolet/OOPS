// G1 first slice (GAP_AUDIT_2026-10-30; LSD233-LSD245; PROPOSAL, not accepted): canon pull.
// A beat that opts in with a `pull` field has a pull from 0 to 1 when it resolves. When the rules alone
// would not carry it (a broken precondition), a keyed draw gives chance = pull + (1 - pull) * p. If the
// draw lands, an in-world agent with a finite budget acts: it restores the precondition or substitutes
// the beat. Otherwise the deviation stands and is recorded. Mechanisms, not an outcome list (AD38):
// every number below is a default with a dial and a reason, and a world may set its own.
//
// Pure over beat_records.js: it replays a day with a modified table, so the host's resolver is untouched.
// Pull is derived, never saved (LSD245). The save holds disturbance, agent spend and deviation records.
// Sealed beats appear by id only; `sign` is the one spoiler-free line an agent leaves behind.
import {defineBeats, resolveBeats} from './beat_records.js';
import {keyedUnitFor} from './keyed_generation.js';
import {registerDomain} from './domain_registry.js';
import {check, natural} from './basics.js';

// Default: the lead's seat holds canon; other seats widen (USER_VISION 2026-10-29). Dial: per world.
export const PULL_SEATS = Object.freeze({be: 0.9, beside: 0.75, follow: 0.7, bystander: 0.6, ordinary: 0.5});
// Facts nothing later needs can drift; plot-bearing ones hold (LSD235). Dial: beat.kind, or pull.weight.
export const PULL_KIND_WEIGHT = Object.freeze({great: 1, detail: 0.6, routine: 0.15});
export const PULL_OUTCOMES = Object.freeze(['restored', 'substituted', 'deviated']);
export const PULL_SLICE = 'canonPull';
const clamp01 = x => Math.max(0, Math.min(1, x));
const LIMITS = Object.freeze({records: 200, disturbance: 200, string: 200});

export const emptyPull = () => ({schema: 1, disturbance: [], spent: {}, records: []});

// One push from the player or the world: it reaches the beats it names and what hangs on them,
// halving per causal hop (LSD222), and stops where no link carries it.
export function recordPush(pull, {id, day, weight = 0.5, reaches, label = null}) {
    check(typeof id === 'string' && id && natural(day) && weight > 0 && weight <= 1 && Array.isArray(reaches) && reaches.length, 'Invalid push.');
    check(!pull.disturbance.some(d => d.id === id), `Push ${id} is already recorded.`);
    return {...pull, disturbance: [...pull.disturbance, {id, day, weight, reaches: [...reaches], label}].slice(-LIMITS.disturbance)};
}

// Disturbance that has reached `beatId`, by the beat table's own deps (lazy, LSD242).
export function disturbanceAt(book, pull, beatId, upTo = Infinity) {
    const byId = new Map(book.map(b => [b.id, b]));
    const hops = new Map([[beatId, 0]]);
    for (let queue = [beatId]; queue.length;) {
        const next = [];
        for (const id of queue) for (const dep of byId.get(id)?.deps ?? []) {
            if (!hops.has(dep.id)) { hops.set(dep.id, hops.get(id) + 1); next.push(dep.id); }
        }
        queue = next;
    }
    let total = 0;
    for (const d of pull.disturbance) {
        if (d.day > upTo) continue;
        const h = Math.min(...d.reaches.map(r => hops.get(r) ?? Infinity));
        if (h < Infinity) total += d.weight * 0.5 ** h;
    }
    return total;
}

// cfg: {seat, ceiling?, worldDial = 1, cap = 3, worldSeed, world, rulesChance?: {beatId: p}}
export function pullFor(beat, book, pull, cfg = {}) {
    const spec = beat.pull ?? {};
    const ceiling = cfg.ceiling ?? PULL_SEATS[cfg.seat ?? 'be'] ?? 0.5;
    const weight = spec.fixed ? 1 : spec.weight ?? PULL_KIND_WEIGHT[beat.kind ?? 'detail'];
    let value = ceiling * (cfg.worldDial ?? 1) * weight;
    // Redundancy: the more routes lead to a fact, the harder it is to move (LSD243).
    value += (1 - value) * Math.min(0.3, 0.1 * Math.max(0, (spec.agents?.length ?? 0) - 1));
    const disturbance = spec.fixed ? 0 : disturbanceAt(book, pull, beat.id);
    const inertia = Math.min(1, disturbance / (cfg.cap ?? 3));
    return {pull: clamp01(value * (1 - inertia)), inertia, disturbance};
}

// Validated once per defineBeats table: opt-in beats must name agents with a reason code and a sign.
function checkPullSpec(beat) {
    const spec = beat.pull;
    check(spec && typeof spec === 'object' && !Array.isArray(spec), `Beat ${beat.id}: pull must be an object.`);
    for (const a of spec.agents ?? []) {
        check(typeof a.id === 'string' && a.id && typeof a.kind === 'string' && typeof a.reason === 'string' && a.reason && typeof a.sign === 'string' && a.sign, `Beat ${beat.id}: agent needs id, kind, reason and sign.`);
        check(a.restore || a.substitute, `Beat ${beat.id}: agent ${a.id} needs a restore or a substitute.`);
        for (const e of [...(a.restore ?? []), ...(a.substitute ?? [])]) check(typeof e.fact === 'string' && ('value' in e) !== ('add' in e), `Beat ${beat.id}: agent effect needs a fact and one of value or add.`);
    }
}

const spendOf = (pull, agent) => pull.spent[agent.id] ?? 0;
const canAct = (pull, agent) => spendOf(pull, agent) + (agent.cost ?? 1) <= (agent.budget ?? 1);

function decide(beat, result, book, pull, cfg) {
    const {pull: strength, inertia, disturbance} = pullFor(beat, book, pull, cfg);
    const p = cfg.rulesChance?.[beat.id] ?? 0, chance = strength + (1 - strength) * p;
    const draw = keyedUnitFor(cfg.worldSeed ?? 0, 'fate',['canon.pull', cfg.world ?? 'world', beat.id]);
    const base = {beat: beat.id, day: result.day, status: result.status, pull: Math.round(strength * 100) / 100, chance: Math.round(chance * 100) / 100,
        inertia: Math.round(inertia * 100) / 100, disturbance: Math.round(disturbance * 100) / 100};
    if (!(draw < chance)) return {record: {...base, outcome: 'deviated', reason: 'draw'}};
    const needsOnly = result.causes.every(c => c.fact !== undefined && !c.mechanism && !c.beat);
    const live = (beat.pull.agents ?? []).filter(a => canAct(pull, a));
    const agent = live.find(a => needsOnly && a.restore) ?? live.find(a => a.substitute);
    if (!agent) return {record: {...base, outcome: 'deviated', reason: (beat.pull.agents ?? []).length ? 'spent' : 'no_hand'}};
    const restore = needsOnly && agent.restore;
    const mark = {fact: `pull.${beat.id}`, value: restore ? 'restored' : 'substituted'};
    const modified = restore
        ? {...beat, needs: null, effects: [...agent.restore, ...beat.effects, mark]}
        : {...beat, needs: null, mechanism: null, deps: [], altered: [], effects: [...agent.substitute, mark]};
    return {modified, agent, record: {...base, outcome: mark.value, agent: agent.id, kind: agent.kind, reason: agent.reason, sign: agent.sign, cost: agent.cost ?? 1}};
}

// Like resolveBeats(beats, state, through, ctx), plus: ctx.pull = {state: pullState, ...cfg}.
// Returns {state, results, pull, records}. Inputs are not modified.
export function resolveWithPull(beats, state, through, ctx = {}) {
    const book = defineBeats(beats);
    book.filter(b => b.pull).forEach(checkPullSpec);
    const {state: pull0 = emptyPull(), ...cfg} = ctx.pull ?? {};
    check(typeof through === 'number', 'resolveWithPull needs a dayIndex number.');
    let cur = state, pull = {...pull0, spent: {...pull0.spent}, records: [...pull0.records]};
    const results = [], records = [], byId = new Map(book.map(b => [b.id, b]));
    for (let day = cur.day + 1; day <= through; day++) {
        let table = book;
        const decided = new Set();
        for (;;) {
            const run = resolveBeats(table, cur, day, ctx);
            const hit = run.results.find(r => !['carried', 'deferred'].includes(r.status) && !decided.has(r.beat) && byId.get(r.beat).pull);
            if (!hit) { cur = run.state; results.push(...run.results); break; }
            decided.add(hit.beat);
            const d = decide(byId.get(hit.beat), hit, book, pull, cfg);
            records.push(d.record);
            if (d.agent) pull.spent[d.agent.id] = spendOf(pull, d.agent) + (d.agent.cost ?? 1);
            if (d.modified) table = defineBeats(table.map(b => b.id === hit.beat ? d.modified : b));
        }
    }
    pull.records = [...pull.records, ...records].slice(-LIMITS.records);
    return {state: cur, results, pull, records};
}

// ---- the read: "the story leans this way". No beat content, ids only, no figure. ----
const LEAN_WORDS = [[0.75, 'holds firm'], [0.45, 'leans'], [0.2, 'loosening'], [0, 'drifting']];
const wordFor = strength => LEAN_WORDS.find(([min]) => strength >= min)[1];
const beatLabel = id => `Beat ${id.split('.').slice(-1)[0]}`;
export function pullRead(beats, state, pull, cfg = {}) {
    const book = defineBeats(beats);
    const upcoming = book.filter(b => b.pull && !['carried', 'altered', 'lapsed', 'blocked'].includes(state.done[b.id]?.status))
        .map(b => { const f = pullFor(b, book, pull, cfg); return {id: b.id, label: beatLabel(b.id), lean: wordFor(f.pull), pressed: f.inertia > 0}; });
    const strongest = upcoming.length ? Math.min(...upcoming.map(u => ['holds firm', 'leans', 'loosening', 'drifting'].indexOf(u.lean))) : null;
    const headline = !upcoming.length ? null : upcoming.some(u => u.lean === 'drifting') ? 'The story is slipping its course.'
        : upcoming.some(u => u.pressed) ? 'The story strains against you.' : 'The story leans this way.';
    return {headline, upcoming, strongest, deviations: deviationChronicle(pull)};
}

// Chronicle lines for recorded outcomes: what happened and the sign, never what the beat was.
export function deviationChronicle(pull) {
    return pull.records.map(r => ({beat: r.beat, day: r.day, outcome: r.outcome,
        text: r.outcome === 'deviated'
            ? `${beatLabel(r.beat)} went another way${r.reason === 'spent' || r.reason === 'no_hand' ? ' and nothing reached in to mend it' : ''}.`
            : `${beatLabel(r.beat)} was ${r.outcome === 'restored' ? 'set right' : 'carried by other means'}: ${r.sign}.`}));
}

// ---- save slice: additive; absent loads empty and an empty slice writes no key (AR6) ----
const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
export function validateCanonPull(slice) {
    if (slice == null) return;
    check(plain(slice) && slice.schema === 1 && Object.keys(slice).every(k => ['schema', 'disturbance', 'spent', 'records'].includes(k)), 'Invalid canon pull slice.');
    check(Array.isArray(slice.disturbance) && slice.disturbance.length <= LIMITS.disturbance, 'Invalid canon pull disturbance.');
    for (const d of slice.disturbance) check(plain(d) && typeof d.id === 'string' && d.id.length <= LIMITS.string && natural(d.day) && d.weight > 0 && d.weight <= 1 && Array.isArray(d.reaches) && d.reaches.every(r => typeof r === 'string') && (d.label == null || typeof d.label === 'string'), 'Invalid canon pull push.');
    check(plain(slice.spent) && Object.entries(slice.spent).every(([k, v]) => k && k !== '__proto__' && natural(v)), 'Invalid canon pull spend.');
    check(Array.isArray(slice.records) && slice.records.length <= LIMITS.records, 'Invalid canon pull records.');
    for (const r of slice.records) check(plain(r) && typeof r.beat === 'string' && natural(r.day) && PULL_OUTCOMES.includes(r.outcome), 'Invalid canon pull record.');
}
export const isEmptyPull = s => !s.disturbance.length && !s.records.length && !Object.keys(s.spent).length;
const restore = slice => slice == null ? emptyPull() : (validateCanonPull(slice), structuredClone(slice));

let held = emptyPull();
registerDomain({id: PULL_SLICE, initialState: () => null,
    save: () => isEmptyPull(held) ? undefined : JSON.parse(JSON.stringify(held)),
    validate: validateCanonPull,
    migrate: slice => slice == null ? null : structuredClone(slice),
    load: slice => { held = restore(slice); },
    commands: {state: () => structuredClone(held),
        commit: next => { validateCanonPull(next); held = restore(JSON.parse(JSON.stringify(next))); return structuredClone(held); },
        push: spec => { held = recordPush(held, spec); return structuredClone(held); }},
    projection: () => structuredClone(held)});
