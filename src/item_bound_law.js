// One item-bound power law (PWC55, proposal 2026-11-17). A power that lives in an object is a stored working
// (stored_working.js, SW1-SW12) laid on the object as its carrier. That owner already keeps the charge, the
// once/repeating mode, the holder attunement (`actsFor: 'holder'`, a stranger pays `strangerFactor` times), the
// lost and broken carrier and recharge or renew. This module adds only what it lacked: one set of authored
// patterns that compose a spec from an effect sentence (a power, a side effect on the holder, a transfer), and
// `carryAdmit`, the one place a carry or attunement limit is read. It saves nothing: the stored record is the
// engine's. Every amount is an authored dial shared by all rows; a row's own evidence supplies the sentence and
// the pattern. A case id is `item:<verb>.<object>.<time>.<pattern>`, so a ledger row names its case without a table.
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';

/** The one property naming whom an item is bound to: stored_working reads it as `$holder` (a label, the holder's id). */
export const ITEM_HOLDER = Object.freeze({id: 'holder', type: 'label', askedBy: Object.freeze(['I'])});
export const ITEM_BOUND_CASE_MODULE = 'src/item_bound_law.js';

/** Authored dials (default, dial and reason in the PWC55 note). */
export const ITEM_BOUND_DIALS = Object.freeze({
    amount: 5, charges: 2, per: 1, strangerFactor: 2, strain: {amount: 5},
    start: {'light:lamp': 20, 'energy:mana': 50, vitality: 50, temperature: 20, humidity: 50, noise: 10, form: 'original'}, into: 'altered',
    // Carry and attunement limits by system (counts of bound items a holder can keep working).
    limits: {attunement: 3, cypher: 2},
});
/** Which (verb, object) pairs the law has a world account for, and what it must change. Other objects wait for their owner. */
export const ITEM_BOUND_TERMS = Object.freeze({
    'add.vitality': {quantity: 'vitality', direction: 'up'}, 'remove.vitality': {quantity: 'vitality', direction: 'down'},
    'add.heat': {quantity: 'temperature', direction: 'up'}, 'remove.heat': {quantity: 'temperature', direction: 'down'},
    'add.moisture': {quantity: 'humidity', direction: 'up'}, 'remove.moisture': {quantity: 'humidity', direction: 'down'},
    'add.sound': {quantity: 'noise', direction: 'up'}, 'remove.sound': {quantity: 'noise', direction: 'down'},
    'add.light': {quantity: 'light:lamp', direction: 'up', key: {light: 'lamp'}}, 'remove.light': {quantity: 'light:lamp', direction: 'down', key: {light: 'lamp'}},
    'add.essence': {quantity: 'energy:mana', direction: 'up', key: {essence: 'mana'}}, 'remove.essence': {quantity: 'energy:mana', direction: 'down', key: {essence: 'mana'}},
    'transform.form': {property: 'form', direction: 'changed'},
});
/**
 * single: one use, then spent (a cypher, a potion item, a scroll). charged: n charges, then dormant until
 * recharged (a wand, an Ars charged item). bound: works only for its holder; anyone else cannot meet the
 * stranger price (attunement, a talisman). costly: each use also costs the holder (a Sealed Artifact's
 * negative effect, an Ars curse). passed: the holder changes (loss, gift, death) and the power follows the
 * new holder.
 */
export const ITEM_BOUND_PATTERNS = Object.freeze(['single', 'charged', 'bound', 'costly', 'passed']);

export const itemBoundCaseId = ({verb, object, time = 'instant'}, pattern) => `item:${verb}.${object}.${time}.${pattern}`;
export const canRunItemBound = s => Boolean(s && ITEM_BOUND_TERMS[`${s.verb}.${s.object}`]);

/** The pattern a row's own words name (default: charged, the reusable item). */
export function itemBoundPatternOf(text = '') {
    if (/cypher|potion|one[- ]use|single[- ]use|depleted on use|scroll|consum/i.test(text)) return 'single';
    if (/curse|backlash|drawback|negative effect|cost to (the )?(holder|wielder|user)|side effect/i.test(text)) return 'costly';
    if (/attun|bound to|soulbound|talisman|only (its|the) (holder|wielder|owner)|sealed artifact/i.test(text)) return 'bound';
    if (/lost|stolen|passes|inherit|transfer|gift/i.test(text)) return 'passed';
    return 'charged';
}

/** The one carry or attunement limit read: can a holder take another bound item? `held` counts those already working. */
export function carryAdmit(held, limit) {
    if (!Number.isSafeInteger(held) || held < 0 || !Number.isSafeInteger(limit) || limit < 0) throw new Error('carryAdmit needs whole counts.');
    return held < limit ? {ok: true, left: limit - held - 1} : {ok: false, reason: 'limit', displace: held - limit + 1};
}

const ref = id => ({shape: 'holder', id});
function effect(verb, object, time, amount, holder) {
    const details = {target: ref(holder)};
    if (object === 'form') details.value = ITEM_BOUND_DIALS.into; else details.amount = amount;
    return {sentence: {verb, object, time}, details};
}

/** The holder's side cost is paid in another account than the power's own (vitality, or moisture when the power is vitality). */
const strainObject = object => object === 'vitality' ? 'moisture' : 'vitality';

export function itemBoundSpec({verb, object, time = 'instant'}, pattern) {
    const D = ITEM_BOUND_DIALS, main = effect(verb, object, time, D.amount, '$holder');
    const effects = [main];
    if (pattern === 'costly') effects.push(effect('remove', strainObject(object), 'instant', D.strain.amount, '$holder'));
    const spec = {carrier: 'item', effects, trigger: {kind: 'touch'}, pulse: 1, actsFor: 'holder', strangerFactor: 1,
        mode: pattern === 'single' ? 'once' : 'repeating'};
    if (pattern === 'charged') spec.charge = {now: D.charges, max: D.charges, per: D.per};
    if (pattern === 'bound') Object.assign(spec, {mode: 'held', strangerFactor: D.strangerFactor, charge: {now: D.per, max: D.per, per: D.per}});
    return spec;
}

export function itemBoundCase(id) {
    const [verb, object, time, pattern] = id.replace(/^item:/, '').split('.');
    const term = ITEM_BOUND_TERMS[`${verb}.${object}`], D = ITEM_BOUND_DIALS;
    if (!term || !ITEM_BOUND_PATTERNS.includes(pattern)) throw new Error(`no item-bound case for ${id}`);
    const bodyOf = (name, extra = {}) => {
        const body = {id: name, kind: 'body', place: 'room', properties: {}, quantities: {...extra}};
        if (term.quantity) body.quantities[term.quantity] = D.start[term.quantity];
        else body.properties.form = D.start.form;
        return body;
    };
    const wielder = bodyOf('wielder');
    if (pattern === 'costly') wielder.quantities[ITEM_BOUND_TERMS[`remove.${strainObject(object)}`].quantity] ??= D.start[ITEM_BOUND_TERMS[`remove.${strainObject(object)}`].quantity];
    const holders = [{id: 'room', kind: 'place'}, wielder, bodyOf('stranger'), bodyOf('finder'),
        {id: 'item', kind: 'thing', as: ['item'], place: 'room', properties: {holder: 'wielder'}}];
    const hit = (who, direction = term.direction) => term.quantity ? {holder: who, quantity: term.quantity, direction} : {holder: who, property: term.property, direction};
    const use = (stepId, by, expect) => ({id: stepId, fire: 'lay', stimulus: {kind: 'touch', by}, expect});
    const steps = {
        single: [use('use', 'wielder', [hit('wielder')]), use('again', 'wielder', [hit('wielder', 'unchanged')])],
        charged: term.property // a form is set, not added: a second use leaves it as it was, so only the first is checked
            ? [use('first', 'wielder', [hit('wielder')]), use('second', 'wielder', [hit('wielder', 'unchanged')])]
            : [use('first', 'wielder', [hit('wielder')]), use('second', 'wielder', [hit('wielder')]), use('empty', 'wielder', [hit('wielder', 'unchanged')])],
        bound: [use('stranger', 'stranger', [hit('wielder', 'unchanged')]), use('holder', 'wielder', [hit('wielder')])],
        costly: [use('use', 'wielder', [hit('wielder'), {holder: 'wielder', quantity: ITEM_BOUND_TERMS[`remove.${strainObject(object)}`].quantity, direction: 'down', amount: D.strain.amount}])],
        passed: [{id: 'hand', ops: [{op: 'property', holder: 'item', property: 'holder', value: 'finder'}]},
            use('finder', 'finder', [hit('finder'), hit('wielder', 'unchanged')])],
    }[pattern];
    const total = {wielder: hit('wielder'), finder: hit('finder')};
    const quantities = Object.values(WORLD_QUANTITIES), props = [WORLD_PROPERTIES.form, ITEM_HOLDER];
    return {basis: 'authored', engine: {packs: ['l.living_body'], host: {things: {}, ...(term.key && {keys: term.key})}, shared: {quantities, properties: props}},
        world: {holders},
        timeline: [{id: 'lay', store: itemBoundSpec({verb, object, time}, pattern)}, ...steps],
        expect: pattern === 'passed' ? [total.finder] : [total.wielder]};
}

/** The case-module entry the coverage runner loads (scripts/coverage_report.mjs runCase). */
export const coverageCase = itemBoundCase;
