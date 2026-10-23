// Dose rules for crafted products (gaps G32, G34): tolerance and overdose as a
// plain-JSON ledger, an opposite-pair effect-cancel table, and derived product
// names. Every number is a dial in the rules spec with an in-world reason; an
// overdose is a cost the player may choose, never a refusal (AD38, MR rules).
// All functions are pure. Not wired into live gameplay yet: the Village trial
// (crafting_frontier_runtime.js) owns the live path and may call these.
import {natural as nat, positive as pos} from './basics.js';
import {compareCodePoints} from './gen_kit.js';

export const DOSE_FAMILY = 'craft.dose@1';
export const MINUTES_PER_DAY = 1440;
const fail = message => { throw new Error(message); };
const text = (v, label) => typeof v === 'string' && v.length ? v : fail(`${label} must be non-empty text.`);
const freeze = v => { if(v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; };

// spec: {id, revision,
//   pairs:[{a, b, permille?, reason}]            opposite effects: the smaller side cancels permille/1000 of itself from both
//   tolerance:[{effect, perDose, decayPerDay, overdoseAt, harm:{effect, per}, reason}]
//   names:{effect: adjective}, tempered?: word}
export function defineDoseRules(spec) {
    const pairs = (spec.pairs ?? []).map(p => {
        const permille = p.permille ?? 1000;
        if(p.a === p.b || !nat(permille) || permille > 1000) fail(`Invalid cancel pair ${p.a}/${p.b}.`);
        return {a: text(p.a, 'Pair a'), b: text(p.b, 'Pair b'), permille, reason: text(p.reason, 'Pair reason')};
    });
    const keys = pairs.map(p => [p.a, p.b].sort(compareCodePoints).join('|'));
    if(new Set(keys).size !== keys.length) fail('Duplicate cancel pair.');
    const tolerance = {};
    for(const t of spec.tolerance ?? []) {
        if(tolerance[text(t.effect, 'Tolerance effect')]) fail(`Duplicate tolerance for ${t.effect}.`);
        if(!pos(t.perDose) || !nat(t.decayPerDay) || !pos(t.overdoseAt) || !pos(t.harm?.per)) fail(`Invalid tolerance for ${t.effect}.`);
        tolerance[t.effect] = {perDose: t.perDose, decayPerDay: t.decayPerDay, overdoseAt: t.overdoseAt,
            harm: {effect: text(t.harm.effect, 'Harm effect'), per: t.harm.per}, reason: text(t.reason, 'Tolerance reason')};
    }
    return freeze({id: text(spec.id, 'Rules ID'), revision: pos(spec.revision) ? spec.revision : fail('Revision must be positive.'),
        pairs, tolerance, names: {...(spec.names ?? {})}, tempered: spec.tempered ?? 'Tempered'});
}

// outputs: {route:{effect:value}} from a resolved product. Returns a new object plus what cancelled.
export function cancelOutputs(rules, outputs) {
    const next = JSON.parse(JSON.stringify(outputs)), cancelled = [];
    for(const [route, effects] of Object.entries(next)) for(const p of rules.pairs) {
        const a = effects[p.a] ?? 0, b = effects[p.b] ?? 0;
        if(!a || !b) continue;
        const amount = Math.floor(Math.min(a, b) * p.permille / 1000);
        if(!amount) continue;
        for(const id of [p.a, p.b]) { effects[id] -= amount; if(!effects[id]) delete effects[id]; }
        cancelled.push({route, a: p.a, b: p.b, amount});
    }
    for(const [route, effects] of Object.entries(next)) if(!Object.keys(effects).length) delete next[route];
    return {outputs: next, cancelled};
}

// Names come from what the product does after cancelling, loudest effect first.
// `known` (a Set of 'route.effect') limits the name to what the observer has seen.
export function deriveProductName(rules, product, {known = null} = {}) {
    const {outputs, cancelled} = cancelOutputs(rules, product.outputs);
    const rows = Object.entries(outputs).flatMap(([route, e]) => Object.entries(e).map(([effect, value]) => ({route, effect, value})))
        .filter(r => !known || known.has(`${r.route}.${r.effect}`))
        .sort((x, y) => y.value - x.value || compareCodePoints(x.effect, y.effect));
    if(!rows.length) return known ? `Unidentified ${product.carrier.toLowerCase()}` : `Inert ${product.carrier.toLowerCase()}`;
    const words = [...new Set(rows.slice(0, 2).map(r => rules.names[r.effect] ?? r.effect))];
    const tempered = cancelled.length && (!known || cancelled.every(c => known.has(`${c.route}.${c.a}`) && known.has(`${c.route}.${c.b}`)));
    return [tempered ? rules.tempered : null, ...words].filter(Boolean).map((w, i) => i ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1)).join(' ') + ` ${product.carrier.toLowerCase()}`;
}

export const createDoseState = () => ({family: DOSE_FAMILY, levels: {}});

const levelNow = (rules, entry, at) => {
    if(!entry) return 0;
    const days = Math.floor((at - entry.at) / MINUTES_PER_DAY);
    return Math.max(0, entry.level - days * (rules.tolerance[entry.effect]?.decayPerDay ?? 0));
};

// One dose of `amount`. Tolerance dulls the effect (effective <= amount); past
// the overdose line the extra level becomes harm the caller applies as a condition.
export function applyDose(rules, state, effect, amount, at) {
    if(!pos(amount) || !nat(at)) fail('A dose is a positive amount at a game minute.');
    const rule = rules.tolerance[effect];
    if(!rule) return {state, effective: amount, overdose: null, level: 0};
    const prior = state.levels[effect];
    if(prior && at < prior.at) fail('Doses cannot go back in time.');
    const before = levelNow(rules, prior && {...prior, effect}, at);
    const effective = Math.floor(amount * 1000 / (1000 + before));
    const level = before + rule.perDose * amount;
    const over = Math.max(0, level - rule.overdoseAt);
    return {state: {...state, levels: {...state.levels, [effect]: {level, at}}}, effective, level,
        overdose: over ? {effect: rule.harm.effect, amount: over * rule.harm.per, reason: rule.reason} : null};
}

export function validateDoseState(rules, state) {
    if(state?.family !== DOSE_FAMILY) fail('Unsupported dose state.');
    for(const [effect, e] of Object.entries(state.levels)) if(!rules.tolerance[effect] || !nat(e.level) || !nat(e.at)) fail(`Invalid tolerance entry ${effect}.`);
    return state;
}
