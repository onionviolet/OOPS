// inquiry@1 (cross-world foundations, slice 5, lane G G-S1): one shared record for "a character finds something out".
// A world or panel DEFINES an inquiry (question, method, sources, need, risk, output facts) in code; the save keeps only
// what play changed: who is asking, effort spent, when it opened and which output keys were written. It stores no
// truth (AD6/AD7): the answer text lives in the definition's output rows and is written, once, into the EXISTING
// knowledge store (state.simulation.knowledge[actor][key], AR3). No second knowledge store, clock or save writer.
//
// Compatibility (SAVES AR6): new optional top-level key `inquiry: {family:'inquiry@1', records:{<id>:{actor, effort:{minutes,
// evidence}, openedAt, wrote:[key]}}}. An untouched life writes no key. A save without it, with a foreign family or with an
// unreadable shape loads fresh; unknown ids and junk fields inside a readable slice are dropped, never thrown (an
// inquiry is play history, not a promise). An older build ignores the key and drops it on its next save (lossy
// downgrade, taken under the 2026-10-17 compatibility deferral). Not carried across resume/branch yet.
//
// Notes as objects (losable, copyable) are ACCOUNT FOR NOW: a source is {kind, id, coverage}, so a later note item can be
// a source of kind 'item' that names the inquiry id; no item is built here.
import {registerDomain} from './domain_registry.js';

export const INQUIRY_FAMILY = 'inquiry@1';
export const METHODS = Object.freeze(['read', 'observe', 'experiment', 'ask', 'derive', 'divine', 'translate', 'compare']);
export const STAGES = Object.freeze(['seen', 'interpreted', 'understood']);
// Plain certainty words (lane G G-S3, TK words): not a new ladder, a reading of effort against the definition's need.
export const CONFIDENCE = Object.freeze({none: 'nothing yet', hunch: 'a hunch', once: 'seen once', repeated: 'repeated', confirmed: 'confirmed'});

const bad = m => { throw Error(m); };
const check = (ok, m) => { if(!ok) bad(m); };
const idOk = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x) && !['__proto__', 'constructor', 'prototype'].includes(x);
const count = x => Number.isSafeInteger(x) && x >= 0;
const text = x => typeof x === 'string' && x.trim().length > 0;

/** Validate and freeze a definition. Definitions are code, never saved. */
export function defineInquiry(def) {
    check(def && idOk(def.id) && text(def.question) && METHODS.includes(def.method), 'Invalid inquiry.');
    check(Array.isArray(def.sources) && def.sources.every(s => s && idOk(s.kind) && idOk(s.id) && (s.coverage == null || text(s.coverage))), 'Invalid inquiry sources.');
    check(def.need && count(def.need.minutes) && count(def.need.evidence) && (def.need.minutes + def.need.evidence) > 0, 'Invalid inquiry need.');
    check(text(def.risk), 'An inquiry names what a wrong or early answer costs.');
    check(Array.isArray(def.outputs) && def.outputs.length > 0 && def.outputs.every(o => o && idOk(o.key) && STAGES.includes(o.stage) && text(o.value)), 'Invalid inquiry outputs.');
    return Object.freeze({...def, sources: Object.freeze(def.sources.map(s => Object.freeze({...s}))), need: Object.freeze({...def.need}),
        outputs: Object.freeze(def.outputs.map(o => Object.freeze({...o}))), actor: def.actor ?? 'player'});
}

export const freshInquiries = () => ({family: INQUIRY_FAMILY, records: {}});
const isEmpty = s => !Object.keys(s.records).length;

function cleanRecord(r) {
    if(!r || typeof r !== 'object' || !idOk(r.actor) || !r.effort || !count(r.effort.minutes) || !count(r.effort.evidence) || !count(r.openedAt)) return null;
    return {actor: r.actor, effort: {minutes: r.effort.minutes, evidence: r.effort.evidence}, openedAt: r.openedAt,
        wrote: Array.isArray(r.wrote) ? [...new Set(r.wrote.filter(idOk))] : []};
}
/** Total, never throws: absent, foreign or unreadable becomes fresh; junk inside a readable slice is dropped. */
export function migrateInquiries(s) {
    if(!s || typeof s !== 'object' || s.family !== INQUIRY_FAMILY || !s.records || typeof s.records !== 'object' || Array.isArray(s.records)) return freshInquiries();
    const records = {};
    for(const [id, r] of Object.entries(s.records)) { const c = idOk(id) && cleanRecord(r); if(c) records[id] = c; }
    return {family: INQUIRY_FAMILY, records};
}
// Never refuses a save: an unreadable slice is dropped by migrateInquiries (play history, not a promise).
export const validateInquiries = () => {};

/** Effort against need as one plain word. Done (all output keys written) is 'confirmed'. */
export function confidenceWord(def, rec, done = false) {
    if(done) return CONFIDENCE.confirmed;
    const e = rec?.effort ?? {minutes: 0, evidence: 0};
    if(!e.minutes && !e.evidence) return CONFIDENCE.none;
    if(e.evidence <= 0) return CONFIDENCE.hunch;
    return e.evidence === 1 || def.need.evidence <= 1 ? CONFIDENCE.once : CONFIDENCE.repeated;
}
/** Effort is complete when both budgets are met. */
export const effortMet = (def, rec) => !!rec && rec.effort.minutes >= def.need.minutes && rec.effort.evidence >= def.need.evidence;

/**
 * Pure step: raise recorded effort to at least `effort` (monotone, so a projection can pass its running totals again
 * without double counting), open the record if needed, and when the need is met write each unwritten output fact into
 * `knowledge` ({[key]: entry}) exactly once. Returns {slice, effects}; `knowledge` is mutated only for newly written keys
 * (a key already present counts as written, so a dropped slice cannot rewrite it).
 */
export function stepInquiry(slice, def, {effort = {}, at, knowledge}) {
    check(count(at), 'An inquiry needs the clock minute.');
    const prev = slice.records[def.id] ?? {actor: def.actor, effort: {minutes: 0, evidence: 0}, openedAt: at, wrote: []};
    const rec = {...prev, effort: {minutes: Math.max(prev.effort.minutes, count(effort.minutes) ? effort.minutes : 0), evidence: Math.max(prev.effort.evidence, count(effort.evidence) ? effort.evidence : 0)}, wrote: [...prev.wrote]};
    const effects = [];
    if(effortMet(def, rec)) for(const o of def.outputs) {
        if(rec.wrote.includes(o.key)) continue;
        if(!knowledge[o.key]) { knowledge[o.key] = {stage: o.stage, value: o.value, at, cause: `inquiry:${def.id}`}; effects.push(o.key); }
        rec.wrote.push(o.key);
    }
    return {slice: {...slice, records: {...slice.records, [def.id]: rec}}, effects};
}

/** Observer-safe read of one inquiry: the question, the partial result with its confidence word and what a wrong answer costs. */
export function inquiryView(slice, def) {
    const rec = slice.records[def.id] ?? null, done = !!rec && def.outputs.every(o => rec.wrote.includes(o.key));
    const word = confidenceWord(def, rec, done), e = rec?.effort ?? {minutes: 0, evidence: 0};
    return {id: def.id, question: def.question, method: def.method, sources: def.sources.map(s => ({...s})), risk: def.risk, opened: !!rec, done, confidence: word,
        effort: {...e, needMinutes: def.need.minutes, needEvidence: def.need.evidence},
        partial: done ? def.outputs.map(o => o.value).join(' ') : `${word}: ${e.minutes} of ${def.need.minutes} minutes worked, ${e.evidence} of ${def.need.evidence} pieces of evidence.`,
        outputs: def.outputs.map(o => ({key: o.key, stage: o.stage, written: !!rec?.wrote.includes(o.key)}))};
}

// ---- the registered domain ----------------------------------------------------------------------------------------
const defs = new Map();
let slice = freshInquiries(), ports = null;
/** A consumer registers its definition; the same id again replaces it (definitions are code). */
export function registerInquiry(def) { const d = defineInquiry(def); defs.set(d.id, d); return d; }
export const configureInquiry = operations => { ports = operations; };
const known = id => defs.get(id) ?? bad('That is not something you are looking into.');

/** Command: record observed effort (running totals from the consumer's own projection). Quote, then revalidate (AR7). */
function record({id, effort} = {}) {
    const def = known(id);
    check(ports?.plan && ports.commit, 'The game is not ready to record that yet.');
    check(!ports.writable || ports.writable(), 'Use the writable game tab to write this up.');
    const plan = ports.plan(0), knowledge = ((plan.state.simulation.knowledge[def.actor] ||= {}));
    const before = slice, {slice: next, effects} = stepInquiry(slice, def, {effort, at: plan.state.clock, knowledge});
    slice = next;
    try { ports.commit(plan); } catch(e) { slice = before; throw e; }
    return {...inquiryView(slice, def), wroteNow: effects};
}
const view = ({id} = {}) => inquiryView(slice, known(id));

registerDomain({id: 'inquiry', deps: [], initialState: freshInquiries,
    save: () => isEmpty(slice) ? undefined : structuredClone(slice), // an untouched life writes no key
    validate: validateInquiries, migrate: migrateInquiries, load: s => { slice = migrateInquiries(s); },
    projection: () => ({inquiries: [...defs.values()].map(d => inquiryView(slice, d))}),
    commands: {record, view}});
