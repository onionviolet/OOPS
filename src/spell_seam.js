// Spell seam (GM40, proposal): learned and cast spells as one typed shared feature. It is a thin layer over ability_records.js (the one owner of
// conditions, cost, limit, effects and the learn/practice/mastery lowering) and adds the four parts that record lacks:
//   origin  - where knowledge of the spell comes from (teacher, text, observed, inherited, sequence, granted);
//   prepare - an optional timed step before the cast (a memorised formula, a laid circle); the cast consumes it unless `keep` is true;
//   failure - a chance (a dial, drawn from a seeded stream by the caller's seed, never an unseeded source) plus typed outcome effects;
//   strain  - backlash weight with protections, handed to the world's own ledger through an injected `add` (harm_state stays the authority).
// A world plugs in through an adapter {worldId, prefix, origins, failure, strain}: default, dial and reason, not a list of allowed outcomes (AD38).
// A part the source does not state is listed under `unstated`, never invented. Leaf: no world imports, no DOM, no clock, no save.
import {defineAbilityRecords, abilityView, learnView} from './ability_records.js';
import {assert, record, stableId, validateSimulationEffect, validatePredicate} from './simulation_contracts.js';
import {evaluateRule} from './rules.js';
import {hashStreamSeed, xorshift32} from './hash_rng.js';

export const SPELL_ORIGINS = Object.freeze(['teacher', 'text', 'observed', 'inherited', 'sequence', 'granted']);
const LEARNED = new Set(['teacher', 'text', 'observed']);
const text = v => typeof v === 'string' && v.trim().length > 0;
const num01 = v => typeof v === 'number' && v >= 0 && v <= 1;
const rowFields = new Set(['key', 'label', 'description', 'sourceId', 'origin', 'practice', 'masteryNeeded', 'signs', 'formula', 'prepare', 'cost', 'limit', 'effects', 'price',
    'failure', 'strain', 'blockedBy', 'stated', 'unstated', 'locator', 'costBasis', 'fn', 'kind']);

// adapter: {worldId, prefix, group?, actorId?, origins: {[kind]: {reason}}, failure: {chance: number|null, perMastery?, reason}, strain: {allowed, when, reason}}.
// `origins` lists the kinds this world teaches by; `failure.chance` is the world default when a row states none (null: no failure modelled, labelled unstated).
export function defineSpellAdapter(a) {
    assert(record(a) && stableId(a.worldId) && stableId(a.prefix) && record(a.origins), 'A spell adapter needs a world, a prefix and its origin kinds.');
    for(const [kind, o] of Object.entries(a.origins)) assert(SPELL_ORIGINS.includes(kind) && record(o) && text(o.reason), `Origin "${kind}" needs a known kind and a reason.`);
    const f = a.failure ?? {chance: null, reason: 'No failure modelled.'};
    assert(f.chance == null || num01(f.chance), 'A failure chance is between 0 and 1.');
    assert(f.perMastery == null || typeof f.perMastery === 'number' && f.perMastery >= 0, 'Failure falls by a non-negative amount per mastery.');
    const s = a.strain ?? {allowed: false, reason: 'No backlash ledger.'};
    assert(typeof s.allowed === 'boolean' && (!s.allowed || ['failure', 'cast'].includes(s.when)), 'Strain says whether it applies, and when (failure or cast).');
    return Object.freeze({...a, failure: Object.freeze({...f}), strain: Object.freeze({...s}), group: a.group ?? 'spell', actorId: a.actorId ?? 'player'});
}

function validateSpell(row, ad) {
    assert(record(row) && Object.keys(row).every(k => rowFields.has(k)), 'Unsupported spell field; it needs its owning mechanism.');
    const o = row.origin;
    assert(record(o) && SPELL_ORIGINS.includes(o.kind), 'A spell says where knowledge of it comes from.');
    assert(ad.origins[o.kind], `${ad.worldId} does not teach by "${o.kind}" (adapter dial).`);
    if(o.gate != null) assert(record(o.gate) && text(o.gate.label) && text(o.gate.reason) && record(o.gate.requires), 'An origin gate needs a label, a reason and a typed predicate.');
    if(o.gate) validatePredicate(o.gate.requires);
    assert(LEARNED.has(o.kind) || !row.practice && row.masteryNeeded == null, 'Only a learned spell has practice and mastery.');
    assert(row.formula == null || Array.isArray(row.formula) && row.formula.every(c => record(c) && text(c.label) && record(c.requires)), 'A formula part needs a label and a typed predicate.');
    const p = row.prepare;
    assert(p == null || record(p) && Number.isSafeInteger(p.minutes) && p.minutes > 0, 'Preparation needs positive minutes.');
    const f = row.failure;
    assert(f == null || record(f) && (f.chance == null || num01(f.chance)) && (f.outcome ?? []).every(e => (validateSimulationEffect(e), true)), 'Invalid failure.');
    const s = row.strain;
    if(s != null) {
        assert(ad.strain.allowed, `${ad.worldId} has no backlash ledger; strain is not available here (adapter dial: ${ad.strain.reason}).`);
        assert(record(s) && stableId(s.carrier) && stableId(s.source) && s.weight > 0, 'Strain needs a carrier, a source and a positive weight.');
        for(const q of s.protections ?? []) assert(record(q) && record(q.rule) && q.reduces > 0, 'A protection needs a rule and a positive reduction.');
    }
}

// rows: spell rows. Returns the ability-record set plus `spells` (per-spell origin, prepare, failure, strain) and the prepare commands (already in `commands`).
export function defineSpells(rows, adapter) {
    const ad = defineSpellAdapter(adapter), {prefix, worldId, actorId} = ad;
    const preparedKey = k => `${prefix}.prepared.${k}`, prepareId = k => `${prefix}.prepare.${k}`, powerId = k => `${prefix}.power.${k}`;
    const prepared = k => ({fact: `actor.${preparedKey(k)}`, op: 'eq', value: true});
    const abilityRows = [], spells = {}, extra = [];
    for(const row of rows) {
        validateSpell(row, ad);
        const k = row.key, o = row.origin, learned = LEARNED.has(o.kind), unstated = [...(row.unstated ?? [])];
        const note = part => { if(!unstated.includes(part)) unstated.push(part); };
        const conditions = [...(row.formula ?? [])];
        if(!learned && o.gate) conditions.push({label: o.gate.label, requires: o.gate.requires, ...(o.gate.locator ? {locator: o.gate.locator} : {})});
        if(!row.formula?.length) note('formula (words, gesture, focus)');
        if(row.prepare) conditions.push({label: 'Prepared', requires: prepared(k)});
        const effects = structuredClone(row.effects);
        if(row.prepare && !row.prepare.keep) effects.push({type: 'fact', scope: 'actor', actor: actorId, key: preparedKey(k), value: false});
        const failure = {chance: row.failure?.chance ?? ad.failure.chance, perMastery: row.failure?.perMastery ?? ad.failure.perMastery ?? 0, outcome: structuredClone(row.failure?.outcome ?? []),
            hook: `${prefix}.failure.${k}`, basis: row.failure?.chance != null ? 'stated' : ad.failure.chance != null ? 'world default' : 'none'};
        if(failure.basis !== 'stated') note('failure chance');
        if(!(row.cost ?? []).length && !(row.unstated ?? []).includes('cost amount')) note('cost amount');
        const ab = {key: k, label: row.label, ...(row.description ? {description: row.description} : {}), sourceId: row.sourceId, conditions, cost: row.cost ?? [], limit: row.limit ?? {kind: 'none'},
            effects, failure: {hook: failure.hook}, unstated, ...(row.price ? {price: row.price} : {}), ...(row.blockedBy ? {blockedBy: row.blockedBy} : {}), ...(row.stated ? {stated: row.stated} : {}),
            ...(row.locator ? {locator: row.locator} : {}), ...(row.costBasis ? {costBasis: row.costBasis} : {}), ...(row.fn ? {fn: row.fn} : {}), ...(row.kind ? {kind: row.kind} : {})};
        if(learned) ab.learn = {...(o.gate ? {teacher: o.gate} : {}), ...(o.prerequisites ? {prerequisites: o.prerequisites} : {}), ...(o.lessonCost ? {lessonCost: o.lessonCost} : {}),
            ...(row.practice ? {practice: row.practice} : {}), ...(row.masteryNeeded != null ? {masteryNeeded: row.masteryNeeded} : {}), ...(row.signs ? {signs: row.signs} : {})};
        else ab.acquisition = o.kind === 'inherited' ? 'innate' : 'acquired';
        abilityRows.push(ab);
        spells[k] = {key: k, origin: {kind: o.kind, gate: o.gate ? {label: o.gate.label, reason: o.gate.reason} : null}, prepare: row.prepare ? {minutes: row.prepare.minutes, keep: !!row.prepare.keep, label: row.prepare.label ?? `Prepare ${row.label}`} : null,
            failure, strain: row.strain ? structuredClone(row.strain) : null, learned};
        if(row.prepare) extra.push({id: prepareId(k), revision: 1, label: row.prepare.label ?? `Prepare ${row.label}`, group: ad.group, worldId, actorId, audience: ['$actor'], duration: row.prepare.minutes,
            cancellation: 'refund', costs: structuredClone(row.prepare.cost ?? []),
            requires: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, ...(learned ? [{fact: `power.${powerId(k)}.owned`, op: 'eq', value: true, reason: 'Learn it first.'}] : []),
                ...(row.prepare.requires ? [row.prepare.requires] : [])]},
            effects: [{type: 'fact', scope: 'actor', actor: actorId, key: preparedKey(k), value: true}]});
    }
    const set = defineAbilityRecords(abilityRows, {prefix, world: {id: worldId}, group: ad.group, actorId});
    for(const k of Object.keys(spells)) set.ids[k].prepare = prepareId(k);
    return {...set, commands: [...set.commands, ...extra], spells, adapter: ad};
}

// Failure chance at a mastery: the stated or world-default chance, less `perMastery` for each mastery point above the one needed (never below 0).
export function failureChance(spell, mastery = 0, masteryNeeded = 0) {
    const f = spell.failure;
    return f.chance == null ? 0 : Math.min(1, Math.max(0, f.chance - f.perMastery * Math.max(0, mastery - masteryNeeded)));
}
// The seeded draw: the same seed, spell and cast index always give the same roll. The caller owns the seed and the cast counter (a save slice).
export function spellRoll(seed, spellId, castIndex) {
    return xorshift32(hashStreamSeed(seed, `${spellId}#${castIndex}`)) / 0x100000000;
}
export function strainDue(spell, facts) {
    const s = spell.strain;
    if(!s) return null;
    const cut = (s.protections ?? []).reduce((n, p) => n + (evaluateRule(p.rule, facts).met ? p.reduces : 0), 0);
    return {carrier: s.carrier, source: s.source, weight: Math.max(0, s.weight - cut)};
}
// Settle one cast. ctx: {seed, castIndex, mastery, masteryNeeded, facts, add}. `add(carrier, {source, weight})` is the world's ledger (harm_state's adapter).
// Returns {failed, chance, roll, outcome: [typed effects for the host to commit], strain: due|null}. Pure apart from the injected `add`.
export function settleSpellCast(spell, spellId, {seed, castIndex, mastery = 0, masteryNeeded = 0, facts = {}, add = null}) {
    const chance = failureChance(spell, mastery, masteryNeeded), roll = spellRoll(seed, spellId, castIndex), failed = roll < chance;
    const strain = spell.strain && (failed || spell.strain.when === 'cast') ? strainDue(spell, facts) : null;
    if(strain?.weight > 0 && add) add(strain.carrier, {source: strain.source, weight: strain.weight});
    return {failed, chance, roll, outcome: failed ? structuredClone(spell.failure.outcome) : [], strain: strain?.weight > 0 ? strain : null};
}

// Read model: ability and learning views plus origin, preparation and the failure line, shown by label and never by predicate or secret.
export function spellView(set, key, {facts = {}, quote = null, mastery = null} = {}) {
    const card = set.cards[key], spell = set.spells[key];
    const m = mastery ?? Number(facts[`power.${card.learn?.power}.mastery`] ?? 0), need = card.learn?.masteryNeeded ?? 0, chance = failureChance(spell, m, need);
    return {...abilityView(card, {facts, quote}), origin: spell.origin, learning: learnView(card, {facts}),
        prepared: spell.prepare ? facts[`actor.${set.adapter.prefix}.prepared.${key}`] === true : null,
        failure: spell.failure.basis === 'none' ? 'not modelled' : `${Math.round(chance * 100)}% (${spell.failure.basis})`, strain: spell.strain ? 'strains the caster on failure or cast' : null};
}
