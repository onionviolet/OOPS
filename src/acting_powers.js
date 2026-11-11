// AGT1 (proposal, built 2026-11-10 at Weibao's go-ahead, answering LLR26): one record and readers for every power that acts.
// A power wants something (goals, sealed by id, AGT6), can detect and touch some facts (reach, AGT3), may spend a budget (AGT4, or is
// unbudgeted), and declares the acts it can do (AGT5). Gods, churches, fate actors, patrons and authorities each keep their own writer;
// this module is the shared shape they are read through. Pure: definitions are code, nothing here is saved or ticks.
//
// Spend stays with its one owner. A power that acts through a canon pull spends in the canonPull slice (`spent`, plus `spentAt` when the
// budget refills); `budgetLeft` reads that, so a refill is derived from the day and never a timer (AR1). A power with no budget kind
// never spends. An answer is an ordinary effect list with a window (the bank's blessing shape: typed effects, severity, probability,
// window; FRC47), returned for the owner to write through the simulation effects seam.
// Left room, not built: fear as a resource and contracts (FRC35), belief as a resource where a method draws on it (AGT10).
import {check, natural} from './basics.js';

export const POWER_KINDS = Object.freeze(['god', 'spirit', 'fate', 'patron', 'authority', 'admin', 'audience', 'regressor', 'institution', 'storyteller']);
export const POWER_STATUS = Object.freeze(['exists', 'dormant', 'dead', 'unknown']);
export const FATE_LEVELS = Object.freeze(['F0', 'F1', 'F2', 'F3', 'F4']);       // STY24 ladder
export const FATE_MODIFIERS = Object.freeze(['F5', 'F6']);                        // exemption, contention
export const BUDGET_KINDS = Object.freeze(['unbudgeted', 'acts']);               // AGT4; favour, belief and fear join when a method exists
export const ACT_KINDS = Object.freeze(['restore', 'substitute', 'grant', 'demand', 'withhold', 'nudge']);

const text = v => typeof v === 'string' && v.length > 0;
const list = (v, ok) => Array.isArray(v) && v.every(ok);
const powers = new Map();

// Detect rules are small and data: {fact, gte|eq: value}, or {any: [rule]} / {all: [rule]}. `null` means "unknown reach", which the world holds (AGT3).
function checkRule(r, id) {
    check(r && typeof r === 'object', `Power ${id}: a detect rule must be an object.`);
    if (r.any || r.all) return (r.any ?? r.all).forEach(x => checkRule(x, id));
    check(text(r.fact) && ('gte' in r || 'eq' in r), `Power ${id}: a detect rule needs a fact and gte or eq.`);
}
const meets = (r, facts) => r.any ? r.any.some(x => meets(x, facts)) : r.all ? r.all.every(x => meets(x, facts))
    : 'gte' in r ? Number(facts[r.fact]) >= r.gte : facts[r.fact] === r.eq;

// spec: {id, world, kind, label, status?, aliases?, goals?: [{id, sealed?}], fate?: {level, modifiers?},
//   reach: {detects: rule | null, touches: [fact prefix], channels?: []},
//   budget: {kind: 'unbudgeted'} | {kind: 'acts', amount, refillDays?},
//   acts: [{id, kind, touches: [prefix], effects?: [{fact, value|add}], windowDays?, severity?, probability?}],
//   terms?: null (CHT5/CHT14 gift terms, empty until a card names the patron), faith?: null, institution?: id, reason?, sign?}
export function definePower(spec) {
    const p = spec, id = p?.id;
    check(text(id) && text(p.world) && POWER_KINDS.includes(p.kind) && text(p.label), 'A power needs an id, a world, a kind and a label.');
    const status = p.status ?? 'exists';
    check(POWER_STATUS.includes(status), `Power ${id}: unknown status.`);
    check(list(p.aliases ?? [], text), `Power ${id}: aliases are ids.`);
    check(list(p.goals ?? [], g => text(g?.id)), `Power ${id}: goals are named by id only (AGT6).`);
    if (p.fate) check(FATE_LEVELS.includes(p.fate.level) && list(p.fate.modifiers ?? [], m => FATE_MODIFIERS.includes(m)), `Power ${id}: invalid fate level.`);
    check(p.reach && (p.reach.detects === null || (checkRule(p.reach.detects, id), true)) && list(p.reach.touches, text), `Power ${id}: reach needs detects (a rule or null) and touches.`);
    const b = p.budget;
    check(b && BUDGET_KINDS.includes(b.kind) && (b.kind === 'unbudgeted' || (natural(b.amount) && b.amount > 0 && (b.refillDays == null || (natural(b.refillDays) && b.refillDays > 0)))), `Power ${id}: state a budget or unbudgeted (AGT4).`);
    const acts = p.acts ?? [];
    for (const a of acts) {
        check(text(a.id) && ACT_KINDS.includes(a.kind) && list(a.touches, text), `Power ${id}: act needs an id, a kind and the facts it touches (AGT5).`);
        for (const e of a.effects ?? []) check(text(e.fact) && ('value' in e) !== ('add' in e) && a.touches.some(t => e.fact.startsWith(t)) && p.reach.touches.some(t => e.fact.startsWith(t)),
            `Power ${id}: act ${a.id} effect ${e.fact} is outside its declared reach.`);
    }
    return Object.freeze({...p, status, aliases: p.aliases ?? [], goals: p.goals ?? [], acts, terms: p.terms ?? null, faith: p.faith ?? null, institution: p.institution ?? null});
}
export function registerPower(spec) {
    const p = definePower(spec);
    powers.set(p.id, p);
    return p;
}
// RCL16: a bare id resolves. An alias (an id a saved spend or an older table used) resolves to the same record.
export const powerById = id => powers.get(id) ?? [...powers.values()].find(p => p.aliases.includes(id)) ?? null;
export const powersFor = world => [...powers.values()].filter(p => p.world === world);

export const canTouch = (power, fact) => power.reach.touches.some(t => fact.startsWith(t));
// Detection: true, false, or null when the world holds the reach as unknown. A dead power detects nothing.
export function detects(power, facts = {}) {
    if (power.status === 'dead') return false;
    if (power.reach.detects === null) return null;
    return meets(power.reach.detects, facts);
}
// An act outside the reach is not drawn (AGT3). `effects` are {fact, ...}; any fact outside the touch list rules the whole act out.
export const withinReach = (power, effects) => power.status === 'exists' && effects.every(e => canTouch(power, e.fact));

// Budget (AGT4). `spent`: units used in total; `spentAt`: days of each use, kept by the owner only where the budget refills.
export function budgetLeft(power, {spent = 0, spentAt = []} = {}, day = 0) {
    const b = power.budget;
    if (b.kind === 'unbudgeted') return Infinity;
    const used = b.refillDays ? spentAt.filter(d => d > day - b.refillDays).length : spent;
    return Math.max(0, b.amount - used);
}

// The answer a power gives is an ordinary effect list with a window; the owner writes it (AGT5, FRC47).
export function answer(power, actId, day) {
    const act = power.acts.find(a => a.id === actId);
    check(act, `Power ${power.id} has no act ${actId}.`);
    check(withinReach(power, act.effects ?? []), `Power ${power.id} cannot reach what act ${actId} touches.`);
    const w = act.windowDays ?? null;
    return {power: power.id, act: act.id, kind: act.kind, effects: (act.effects ?? []).map(e => ({...e})), from: day, until: w == null ? null : day + w,
        severity: act.severity ?? null, probability: act.probability ?? 1};
}
export const answerActive = (a, day) => a.from <= day && (a.until == null || day < a.until);

// What a player can be shown (AGT20): label, kind, whether it can see them, never the goals. Sealed truths stay by id (AGT6).
export function powerView(power, facts = {}) {
    return {id: power.id, label: power.label, kind: power.kind, status: power.status, sees: detects(power, facts), sealed: power.goals.filter(g => g.sealed !== false).map(g => g.id)};
}
