// Adaptation: one world-neutral seam for anything that gets better at surviving
// what keeps hitting it (AD51 proposal, 2026-11-03; design in docs/emergent/E8E_ADAPTATION.md).
// A summoned adaptive general, a poison-tolerant body, a rival who learns your
// footwork and a guard post that learns your raids are one ledger with different
// dials. Pure: the caller owns clocks, draws, what a phenomenon key means, what
// healing or a sighted attack does, and why a wheel is paused (AD38).
// Save family `adaptation.ledger@1` is plain JSON; nothing registers it yet.
import {natural as nat, positive as pos} from './basics.js';

export const ADAPTATION_FAMILY = 'adaptation.ledger@1';
export const TURN = 1000; // progress is kept in thousandths of one turn of the wheel
const RECEIPTS = 8; // budget: receipts kept per phenomenon (CX5)
const TRIGGERS = new Set(['clock', 'hit', 'rest']);
const fail = message => { throw new Error(message); };
const text = (v, label) => typeof v === 'string' && v.length ? v : fail(`${label} must be non-empty text.`);
const permille = (v, label) => nat(v) && v <= TURN ? v : fail(`${label} must be 0 to ${TURN}.`);
const keyText = k => /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(k ?? '') ? k : fail(`Invalid phenomenon key ${k}.`);

// spec: {id, revision, trigger, depth, spill, turnTime, speedup, slots, needed, defaultNeeded,
//  ceiling, heal, sees, answerTurns, indiscriminate, decay:{every, amount}|null, source, unstated, reason}
// trigger: clock = a turn after turnTime of analysis; hit = a turn per exposure; rest = a turn per rest
// after exposure. depth: how many key segments the adapter reads (the granularity dial).
// spill: thousandths of each turn credited to the parent key (related phenomena).
export function defineAdapter(spec) {
    const trigger = TRIGGERS.has(spec.trigger) ? spec.trigger : fail(`Unknown adaptation trigger ${spec.trigger}.`);
    const needed = {};
    for(const [k, n] of Object.entries(spec.needed ?? {})) needed[keyText(k)] = pos(n) ? n : fail(`Turns needed for ${k} must be positive.`);
    if(trigger === 'clock' && !pos(spec.turnTime)) fail('A clock adapter needs a positive turnTime.');
    if(spec.answerTurns != null && !pos(spec.answerTurns)) fail('answerTurns must be positive or null.');
    if(spec.decay != null && !(pos(spec.decay.every) && pos(spec.decay.amount))) fail('Decay needs a positive interval and amount.');
    return Object.freeze({id: text(spec.id, 'Adapter ID'), revision: pos(spec.revision) ? spec.revision : fail('Revision must be positive.'), trigger,
        depth: pos(spec.depth) ? spec.depth : fail('Depth must be positive.'), spill: permille(spec.spill ?? 0, 'Spill'),
        turnTime: spec.turnTime ?? null, speedup: permille(spec.speedup ?? 0, 'Speedup'), slots: pos(spec.slots ?? 1) ? spec.slots ?? 1 : fail('Slots must be positive.'),
        needed: Object.freeze(needed), defaultNeeded: pos(spec.defaultNeeded ?? 1) ? spec.defaultNeeded ?? 1 : fail('defaultNeeded must be positive.'),
        ceiling: permille(spec.ceiling ?? TURN, 'Ceiling'), heal: !!spec.heal, sees: !!spec.sees, answerTurns: spec.answerTurns ?? null,
        indiscriminate: !!spec.indiscriminate, decay: spec.decay ? Object.freeze({...spec.decay}) : null,
        source: text(spec.source, 'Calibration source'), unstated: Object.freeze([...(spec.unstated ?? [])]), reason: text(spec.reason, 'Adapter reason')});
}

// The holder owns the results (the wheel); the bearer takes the exposure for it (a tamer wearing the wheel).
export const createLedger = (profile, {holder, bearer = holder, at = 0}) =>
    ({family: ADAPTATION_FAMILY, adapter: profile.id, holder: text(holder, 'Holder'), bearer: text(bearer, 'Bearer'), at: nat(at) ? at : fail('Ledger time must be a natural number.'), entries: {}});

export const keyAt = (profile, raw) => keyText(raw).split('.').slice(0, profile.depth).join('.');
const parentOf = key => key.includes('.') ? key.slice(0, key.lastIndexOf('.')) : null;
const neededFor = (profile, key) => profile.needed[key] ?? profile.defaultNeeded;
const target = (profile, e) => (e.needed + (profile.answerTurns ?? 0)) * TURN;
const fresh = (profile, key, at) => ({progress: 0, needed: neededFor(profile, key), analyzing: false, continuing: false, remaining: 0, exposed: false, hits: 0, lastAt: at, receipts: []});

export function stageOf(profile, e) {
    if(!e || e.progress === 0) return e?.analyzing ? 'analyzing' : 'none';
    if(e.progress < e.needed * TURN) return 'partial';
    return profile.answerTurns != null && e.progress >= target(profile, e) ? 'answered' : 'adapted';
}

// One turn: progress, a share to the parent key, and the events a caller may act on.
function turn(profile, L, key, at, events) {
    const e = L.entries[key], before = stageOf(profile, e);
    e.progress = Math.min(target(profile, e), e.progress + TURN); e.lastAt = at;
    events.push({type: 'turn', key, at, turn: Math.floor(e.progress / TURN), heal: profile.heal});
    const after = stageOf(profile, e);
    if(after !== before && (after === 'adapted' || after === 'answered')) events.push({type: after, key, at, holder: L.holder});
    const parent = profile.spill && parentOf(key);
    if(parent) {
        // A family is at least as hard to cover as the hardest member it was learned from.
        const p = L.entries[parent] ??= fresh(profile, parent, at);
        p.needed = Math.max(p.needed, e.needed);
        p.progress = Math.min(target(profile, p), p.progress + profile.spill); p.lastAt = at;
    }
    if(e.progress >= e.needed * TURN && (profile.answerTurns == null || e.progress >= target(profile, e) || !e.continuing)) e.analyzing = false;
}

// Moves the ledger clock. A paused wheel (the caller says why) neither analyzes nor fades.
export function advance(profile, ledger, {at, paused = false}) {
    if(!nat(at) || at < ledger.at) fail('Adaptation time only moves forward.');
    const L = structuredClone(ledger), events = [];
    if(paused) { L.at = at; return {ledger: L, events}; }
    for(const [key, e] of Object.entries(L.entries)) {
        if(e.analyzing && profile.trigger === 'clock') {
            let now = L.at;
            while(e.analyzing && now + e.remaining <= at) { now += e.remaining; turn(profile, L, key, now, events); e.remaining = e.analyzing ? profile.turnTime : 0; }
            if(e.analyzing) e.remaining -= at - now;
        } else if(!e.analyzing && profile.decay && e.progress > 0) {
            const steps = Math.floor((at - e.lastAt) / profile.decay.every);
            if(steps > 0) {
                e.progress = Math.max(0, e.progress - steps * profile.decay.amount); e.lastAt += steps * profile.decay.every;
                events.push({type: 'faded', key, at, progress: e.progress});
                if(e.progress === 0) delete L.entries[key];
            }
        }
    }
    L.at = at;
    return {ledger: L, events};
}

// One exposure: who was hit, by what, from whom. Only the holder or its bearer can feed the wheel.
export function expose(profile, ledger, {key, at, on, from = null}) {
    if(on !== ledger.holder && on !== ledger.bearer) fail(`${on} does not bear this adaptation.`);
    const moved = advance(profile, ledger, {at}), L = moved.ledger, events = moved.events, k = keyAt(profile, key);
    const e = L.entries[k] ??= fresh(profile, k, at);
    e.hits++; e.lastAt = at; e.receipts = [...e.receipts, {at, from, raw: key}].slice(-RECEIPTS);
    const done = e.progress >= target(profile, e);
    if(profile.trigger === 'hit') { if(!done) turn(profile, L, k, at, events); }
    else if(profile.trigger === 'rest') e.exposed = !done;
    else if(e.analyzing) e.remaining -= Math.floor(e.remaining * profile.speedup / TURN);
    else if(!done) {
        const busy = Object.values(L.entries).filter(x => x.analyzing).length;
        // Adapted already: analysis continues toward an answer only when this adapter answers at all.
        if(busy >= profile.slots) events.push({type: 'unanalyzed', key: k, at});
        else { e.analyzing = true; e.continuing = e.progress >= e.needed * TURN; e.remaining = profile.turnTime; events.push({type: 'analyzing', key: k, at}); }
    }
    return {ledger: L, events};
}

// Rest-triggered adapters (bodies) take one turn per rest for each phenomenon met since the last rest.
export function rest(profile, ledger, {at}) {
    if(profile.trigger !== 'rest') fail(`${profile.id} does not adapt on rest.`);
    const moved = advance(profile, ledger, {at}), L = moved.ledger, events = moved.events;
    for(const [key, e] of Object.entries(L.entries)) if(e.exposed) { e.exposed = false; turn(profile, L, key, at, events); }
    return {ledger: L, events};
}

// What the adaptation does for `actor` against a raw key. The bearer gains nothing itself.
// defense: thousandths of harm removed; sees: hidden forms of it are visible; answers: own attacks
// bypass defenses built on it; blocksBenefit: helpful uses of it no longer work (over-adaptation).
export function response(profile, ledger, raw, actor = ledger.holder) {
    const k = keyAt(profile, raw), e = ledger.entries[k], p = parentOf(k) && ledger.entries[parentOf(k)];
    const none = {key: k, stage: 'none', defense: 0, sees: false, answers: false, blocksBenefit: false};
    if(actor !== ledger.holder) return none;
    const def = x => x ? Math.min(profile.ceiling, Math.floor(profile.ceiling * x.progress / (x.needed * TURN))) : 0;
    const stage = stageOf(profile, e), adapted = stage === 'adapted' || stage === 'answered';
    return {key: k, stage, defense: Math.max(def(e), def(p)), sees: profile.sees && adapted, answers: stage === 'answered', blocksBenefit: profile.indiscriminate && adapted};
}
export const mitigate = (profile, ledger, raw, amount, actor) => Math.round(amount * (TURN - response(profile, ledger, raw, actor).defense) / TURN);
export const setBearer = (ledger, bearer) => ({...structuredClone(ledger), bearer: text(bearer, 'Bearer')});

export function validateLedger(profile, ledger) {
    if(ledger?.family !== ADAPTATION_FAMILY || ledger.adapter !== profile.id) fail('Unsupported adaptation ledger.');
    text(ledger.holder, 'Holder'); text(ledger.bearer, 'Bearer'); if(!nat(ledger.at)) fail('Invalid ledger time.');
    for(const [k, e] of Object.entries(ledger.entries)) {
        keyText(k);
        if(!nat(e.progress) || e.progress > target(profile, e) || !pos(e.needed) || !nat(e.remaining) || !nat(e.hits) || !nat(e.lastAt)) fail(`Invalid adaptation record ${k}.`);
        if(!Array.isArray(e.receipts) || e.receipts.length > RECEIPTS) fail(`Invalid adaptation receipts for ${k}.`);
    }
    if(Object.values(ledger.entries).filter(e => e.analyzing).length > profile.slots) fail('More phenomena analyzed than the adapter has slots.');
    return ledger;
}
