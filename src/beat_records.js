// PL-E3 (protagonist-life PLAN L3/R21; CANON_PROTAGONIST_INTERACTIONS PX3-PX9, PX43-PX45, PX49):
// the beat resolver. A beat is DATA: a dated canon event keyed by id + dayIndex, with a scope
// (who/where it reaches), needs (preconditions on facts) and effects (writes to facts).
// The resolver is generic: it knows no verbs and no nouns.
//
// Pure and read-only: no main.js import, no save field, no RNG, no clock read. Callers hold the
// state object this module returns; the ledger is re-derivable by replaying from dayIndex 0,
// so nothing here needs a save slice. PROPOSAL, not built: if a run must survive Export/Import
// mid-window, an additive `beatLedger` slice ({done}) would need the AR6 migration and a yes.
//
// ENGINE CARD E3-1 (not built, recorded here and in the test named for it): a beat with a
// `mechanism` the world does not offer (for example the lead's cheat space) is reported
// `blocked` with cause {mechanism}, never faked. The resolver also writes only the caller's
// fact map. Moving a body, spending a purse or the lead's daily routine are engine verbs and
// belong to the lead's NPC life (PLAN MS1, possible PL-E4), not to this module.
import {dayIndex} from './world_day_index.js';
import {check, natural, deepFreeze} from './basics.js';

// What a life can be to a beat that happened, from PX44. 'carried' is the actor; the rest are
// witness levels whose note keys come from the beat's `notes` (PX49: perception text only,
// never the beat's sealed content).
export const BEAT_EXPOSURES = Object.freeze(['heard', 'aftermath', 'affected', 'present']);
export const BEAT_STATUSES = Object.freeze(['carried', 'altered', 'deferred', 'lapsed', 'blocked']);
const SETTLED = new Set(['carried', 'altered', 'lapsed', 'blocked']);
const ATTACHED_MODES = Object.freeze(['follow', 'bystander', 'be']);
const OPS = new Set(['eq', 'ne', 'gte', 'lte', 'gt', 'lt', 'has']);

// ---- fact rules: the shape of basics.js eq/gte/all/any/not, plus an array meaning all ----
const own = (obj, key) => obj != null && Object.hasOwn(obj, key);
function test(rule, lookup) {
    if (rule == null) return true;
    if (Array.isArray(rule)) return rule.every(r => test(r, lookup));
    if (rule.all) return rule.all.every(r => test(r, lookup));
    if (rule.any) return rule.any.some(r => test(r, lookup));
    if (rule.not) return !test(rule.not, lookup);
    const op = rule.op ?? 'eq', have = lookup(rule.fact);
    check(OPS.has(op), `Unknown beat rule op: ${op}`);
    if (op === 'has') return have !== undefined;
    if (op === 'eq') return have === rule.value;
    if (op === 'ne') return have !== rule.value;
    if (typeof have !== 'number') return false;
    return op === 'gte' ? have >= rule.value : op === 'lte' ? have <= rule.value : op === 'gt' ? have > rule.value : have < rule.value;
}
function failures(rule, lookup) {
    if (rule == null || test(rule, lookup)) return [];
    if (Array.isArray(rule)) return rule.flatMap(r => failures(r, lookup));
    if (rule.all) return rule.all.flatMap(r => failures(r, lookup));
    if (rule.any || rule.not) return [{fact: null, op: rule.any ? 'any' : 'not'}];
    return [{fact: rule.fact, op: rule.op ?? 'eq', want: rule.value, have: lookup(rule.fact)}];
}
const factLookup = facts => fact => own(facts, fact) ? facts[fact] : undefined;
const lifeLookup = (life, facts) => fact => own(life.facts, fact) ? life.facts[fact] : own(facts, fact) ? facts[fact] : undefined;

// ---- the beat table ----
// Beat: {id, dayIndex, until?, order?, kind?: 'great'|'detail'|'routine', actor?: lifeId,
//   mechanism?, deps?: [{id, kind: 'after'|'needs'}], needs?: rule, effects: [{fact, value|add}],
//   altered?: [{when: rule, effects, notes?}], scope?: {footprint?, holds?, aftermath?, ripple?, modes?},
//   notes?: {heard, aftermath, affected, present, lapsed}}
const defined = new WeakSet();
export function defineBeats(list) {
    if (defined.has(list)) return list;
    check(Array.isArray(list), 'Beats must be a list.');
    const beats = list.map((b, i) => ({order: i, ...structuredClone(b)}));
    const byId = new Map();
    for (const b of beats) {
        check(typeof b.id === 'string' && b.id && !byId.has(b.id), `Beat id missing or duplicate: ${b.id}`);
        check(natural(b.dayIndex) && b.dayIndex > 0, `Beat ${b.id}: invalid dayIndex.`);
        check(b.until == null || (natural(b.until) && b.until >= b.dayIndex), `Beat ${b.id}: invalid until.`);
        byId.set(b.id, b);
    }
    for (const b of beats) {
        for (const e of [...(b.effects ?? []), ...(b.altered ?? []).flatMap(a => a.effects ?? [])]) {
            check(typeof e.fact === 'string' && e.fact !== '__proto__' && ('value' in e) !== ('add' in e), `Beat ${b.id}: effect needs a fact and one of value or add.`);
        }
        for (const d of b.deps ?? []) {
            check(byId.has(d.id) && (d.kind === 'after' || d.kind === 'needs'), `Beat ${b.id}: bad dep ${d.id}.`);
            check(byId.get(d.id).dayIndex <= b.dayIndex && d.id !== b.id, `Beat ${b.id}: dep ${d.id} is not earlier.`);
        }
    }
    beats.sort((a, b) => a.dayIndex - b.dayIndex || a.order - b.order || (a.id < b.id ? -1 : 1));
    const out = deepFreeze(beats);
    defined.add(out);
    return out;
}

// ---- state: {facts, done: {beatId: result}, day}. The caller owns and stores it. ----
export const newBeatState = (facts = {}) => ({facts: {...facts}, done: {}, day: 0});

const lifePlace = (life, day) => typeof life.placeAt === 'function' ? life.placeAt(day) : life.places?.[day] ?? life.places?.default ?? null;

// PX44/PX45: exposure is a lookup on where the life was, what it holds and how it is attached.
function exposureOf(beat, life, day, facts) {
    if (life.leans === 'free' || life.leans === 'background') return null;
    const scope = beat.scope ?? {}, place = lifePlace(life, day);
    if (place != null && scope.footprint?.includes(place)) return 'present';
    if (scope.holds && test(scope.holds, lifeLookup(life, facts))) return 'affected';
    if (place != null && scope.aftermath?.includes(place)) return 'aftermath';
    if (place != null && scope.ripple?.includes(place)) return 'heard';
    return (scope.modes ?? ATTACHED_MODES).includes(life.mode) ? 'heard' : null;
}

function noteFor(beat, exposure, altered) {
    const text = altered?.notes?.[exposure] ?? beat.notes?.[exposure] ?? null;
    return {key: `${beat.id}/${exposure}`, text};
}

function livesFor(beat, status, alteredRule, lives, day, facts) {
    const done = status === 'carried' || status === 'altered';
    return lives.map(life => {
        if (beat.actor === life.id) {
            return done ? {life: life.id, result: 'carried', exposure: 'involved', miss: false, note: null}
                : {life: life.id, result: 'nothing', exposure: null, miss: false, note: null, status};
        }
        if (status === 'deferred' || status === 'blocked') return {life: life.id, result: 'nothing', exposure: null, miss: false, note: null};
        const seen = exposureOf(beat, life, day, facts);
        if (!seen) return {life: life.id, result: 'nothing', exposure: null, miss: false, note: null};
        const exposure = status === 'lapsed' ? (seen === 'present' ? 'present' : 'lapsed') : seen;
        // A miss note is a witness line for a life the beat reached but did not put on the spot (PX7).
        return {life: life.id, result: 'seen', exposure, miss: seen !== 'present', note: noteFor(beat, exposure, alteredRule)};
    });
}

function applyEffects(effects, facts, beat, day) {
    const diffs = [];
    for (const e of effects ?? []) {
        const was = facts[e.fact], now = 'add' in e ? (typeof was === 'number' ? was : 0) + e.add : e.value;
        if (was !== now) diffs.push({beat: beat.id, fact: e.fact, was, now, day});
        facts[e.fact] = now;
    }
    return diffs;
}

function resolveOne(beat, state, day, facts, lives, mechanisms) {
    const causes = [];
    if (beat.mechanism && !mechanisms.includes(beat.mechanism)) causes.push({mechanism: beat.mechanism});
    for (const d of beat.deps ?? []) {
        if (d.kind !== 'needs') continue;
        const dep = state.done[d.id]?.status;
        if (dep !== 'carried' && dep !== 'altered') causes.push({beat: d.id, status: dep ?? 'unresolved'});
    }
    causes.push(...failures(beat.needs, factLookup(facts)));
    let status, alteredRule = null, diffs = [];
    if (!causes.length) {
        status = 'carried';
        diffs = applyEffects(beat.effects, facts, beat, day);
    } else {
        alteredRule = causes.some(c => c.mechanism) ? null : (beat.altered ?? []).find(a => test(a.when, factLookup(facts))) ?? null;
        if (alteredRule) { status = 'altered'; diffs = applyEffects(alteredRule.effects, facts, beat, day); }
        else if (day < (beat.until ?? beat.dayIndex)) status = 'deferred';
        else status = causes.some(c => c.mechanism || c.beat) ? 'blocked' : 'lapsed';
    }
    return {beat: beat.id, kind: beat.kind ?? null, day, canonDay: beat.dayIndex, status,
        causes: status === 'carried' || status === 'altered' ? [] : causes,
        altered: alteredRule ? beat.altered.indexOf(alteredRule) : null, diffs,
        lives: livesFor(beat, status, alteredRule, lives, day, state.facts)};
}

// Resolve every day after state.day up to `through` (a dayIndex number or a world clock object
// for PL-E0's dayIndex). Beats resolve lazily on their dates, in table order, each seeing the
// facts the earlier ones wrote. ctx: {lives: [{id, mode?, leans?, facts?, places?|placeAt?}],
// mechanisms: [names the world offers]}. Returns a new state and the day's results in order;
// the inputs are not modified.
export function resolveBeats(beats, state, through, ctx = {}) {
    const book = defineBeats(beats), last = typeof through === 'number' ? through : dayIndex(through);
    check(natural(last) && last - state.day <= 100000, 'Invalid resolve horizon.');
    const lives = ctx.lives ?? [], mechanisms = ctx.mechanisms ?? [];
    const next = {facts: {...state.facts}, done: {...state.done}, day: Math.max(state.day, last)};
    const results = [];
    for (let day = state.day + 1; day <= last; day++) {
        for (const beat of book) {
            if (beat.dayIndex > day || day > (beat.until ?? beat.dayIndex) || SETTLED.has(next.done[beat.id]?.status)) continue;
            const facts = {...next.facts};
            const result = resolveOne(beat, next, day, facts, lives, mechanisms);
            next.facts = facts;
            next.done = {...next.done, [beat.id]: {status: result.status, day, causes: result.causes}};
            results.push(result);
        }
    }
    return {state: next, results};
}

// "k of n reached, with causes" (PX59): the report the scripted and null-player runs file.
export function beatReport(beats, state) {
    const book = defineBeats(beats), counts = Object.fromEntries(BEAT_STATUSES.map(s => [s, 0]));
    const unreached = [];
    for (const beat of book) {
        const done = state.done[beat.id], status = done?.status ?? 'pending';
        if (status in counts) counts[status]++;
        if (status !== 'carried') unreached.push({beat: beat.id, status, causes: done?.causes ?? []});
    }
    return {n: book.length, reached: counts.carried + counts.altered, counts, unreached};
}
