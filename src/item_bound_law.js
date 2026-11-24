// One item-bound power law (PWC55, proposal 2026-11-17). A power that lives in an object is a stored working
// (stored_working.js, SW1-SW12) laid on the object as its carrier. That owner already keeps the charge, the
// once/repeating mode, the holder attunement (`actsFor: 'holder'`, a stranger pays `strangerFactor` times), the
// lost and broken carrier and recharge or renew. This module adds only what it lacked: one set of authored
// patterns that compose a spec from an effect sentence (a power, a side effect on the holder, a transfer), and
// `carryAdmit`, the one place a carry or attunement limit is read. It saves nothing: the stored record is the
// engine's. Every amount is an authored dial shared by all rows; a row's own evidence supplies the sentence and
// the pattern. A case id is `item:<verb>.<object>.<time>.<pattern>`, so a ledger row names its case without a table.
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';
import {lowerEffect} from './effect_grammar.js';

/** The one property naming whom an item is bound to: stored_working reads it as `$holder` (a label, the holder's id). */
export const ITEM_HOLDER = Object.freeze({id: 'holder', type: 'label', askedBy: Object.freeze(['I'])});
export const ITEM_BOUND_CASE_MODULE = 'src/item_bound_law.js';

/** Authored dials (default, dial and reason in the PWC55 note). */
export const ITEM_BOUND_DIALS = Object.freeze({
    amount: 5, charges: 2, per: 1, strangerFactor: 2, strain: {amount: 5},
    start: {'light:lamp': 20, 'energy:mana': 50, vitality: 50, temperature: 20, humidity: 50, noise: 10, condition: 50, form: 'original'}, into: 'altered',
    // Carry and attunement limits by system (counts of bound items a holder can keep working).
    limits: {attunement: 3, cypher: 2},
});
const lamp = {light: 'lamp'}, mana = {essence: 'mana'};
const destination = 'destination', createdThing = 'made-thing', sight = 'sight';
const block = key => ({ward: 'block', direction: 'changed', ...(key && {key})});
const end = key => ({ward: 'end', direction: 'changed', ...(key && {key})});
/** Which (verb, object) pairs the law has a world account for, and what it must change. Other objects wait for their owner. */
export const ITEM_BOUND_TERMS = Object.freeze({
    'add.vitality': {quantity: 'vitality', direction: 'up'}, 'remove.vitality': {quantity: 'vitality', direction: 'down'},
    'add.heat': {quantity: 'temperature', direction: 'up'}, 'remove.heat': {quantity: 'temperature', direction: 'down'},
    'add.moisture': {quantity: 'humidity', direction: 'up'}, 'remove.moisture': {quantity: 'humidity', direction: 'down'},
    'add.sound': {quantity: 'noise', direction: 'up'}, 'remove.sound': {quantity: 'noise', direction: 'down'},
    'add.light': {quantity: 'light:lamp', direction: 'up', key: lamp}, 'remove.light': {quantity: 'light:lamp', direction: 'down', key: lamp},
    'add.essence': {quantity: 'energy:mana', direction: 'up', key: mana}, 'remove.essence': {quantity: 'energy:mana', direction: 'down', key: mana},
    'transform.form': {property: 'form', direction: 'changed'},
    'move.position': {position: true, direction: 'changed', details: {to: destination}},
    'alter.position': {ward: 'alter', direction: 'changed'},
    'add.thing': {creates: true, direction: 'changed', details: {create: {id: createdThing, kind: 'thing'}}},
    'remove.thing': {thing: true, quantity: 'condition', direction: 'down', details: {quantity: 'condition'}},
    'move.thing': {thing: true, position: true, direction: 'changed', details: {to: destination}},
    'conceal.thing': {thing: true, property: 'concealed', direction: 'changed', details: {channel: sight}},
    'block.vitality': block(), 'block.essence': block(mana), 'block.position': block(), 'block.thing': block(),
    'block.sound': block(), 'block.light': block(lamp), 'block.heat': block(), 'block.moisture': block(),
    'block.form': block(), 'block.relation': block(),
    'end.vitality': end(), 'end.essence': end(mana), 'end.position': end(), 'end.thing': end(),
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
export function lawEffect(sentence, target, amount, authored = {}) {
    const term = ITEM_BOUND_TERMS[`${sentence.verb}.${sentence.object}`];
    return {sentence, details: {target,
        ...(term.quantity && {amount}), ...(sentence.verb === 'transform' && {value: ITEM_BOUND_DIALS.into}),
        ...term.details, ...authored}};
}

const wardId = holder => `guard.${holder}`;
const retune = {verb: 'move', object: 'position', threshold: {quantity: 'vitality', minimum: 60}};

// Authored examples for the coverage runner. Positions, identity, condition and
// fields have different observations in W, so none is proxied by another stat.
export function lawFixture(sentence) {
    const {object} = sentence, term = ITEM_BOUND_TERMS[`${sentence.verb}.${object}`];
    const guard = term.ward && lowerEffect({verb: 'block', object}, {keys: term.key}).acts[0].params;
    const hasField = term.ward === 'alter' || term.ward === 'end';
    const field = (holder, params = guard) => ({scope: holder, kind: 'block', params});
    const seed = holder => {
        if (term.quantity) (holder.quantities ??= {})[term.quantity] = ITEM_BOUND_DIALS.start[term.quantity];
        if (term.property === 'form') (holder.properties ??= {}).form = ITEM_BOUND_DIALS.start.form;
        return holder;
    };
    const hit = (holder, direction = term.direction, {at = 0, place = destination} = {}) => {
        const changed = direction !== 'unchanged';
        if (term.ward === 'block') return {lawField: `block.${holder}.${guard.verb}.${guard.object}.${at}`, direction,
            ...(changed && {to: field(holder)})};
        if (hasField) return {lawField: wardId(holder), direction,
            ...(changed && {to: term.ward === 'end' ? null : field(holder, retune)})};
        if (term.creates) return {holder: createdThing, exists: true, direction, to: true};
        if (term.position) return {holder, position: true, direction, ...(changed && {to: place})};
        if (term.quantity) return {holder, quantity: term.quantity, direction};
        return {holder, property: term.property, direction,
            ...(changed && {to: term.property === 'concealed' ? [sight] : ITEM_BOUND_DIALS.into})};
    };
    const fields = holders => hasField ? holders.map(holder => ({id: wardId(holder), ...field(holder)})) : [];
    const details = holder => hasField ? {field: wardId(holder), ...(term.ward === 'alter' && {params: retune})} : {};
    return {seed, hit, fields, details, hasField};
}

/** The holder's side cost is paid in another account than the power's own (vitality, or moisture when the power is vitality). */
const strainObject = object => object === 'vitality' ? 'moisture' : 'vitality';

export function itemBoundSpec({verb, object, time = 'instant'}, pattern, {target, details = {}} = {}) {
    const D = ITEM_BOUND_DIALS, term = ITEM_BOUND_TERMS[`${verb}.${object}`];
    const main = lawEffect({verb, object, time}, target ?? ref(term.thing ? '$carrier' : '$holder'), D.amount, details);
    const effects = [main];
    if (pattern === 'costly') effects.push(lawEffect({verb: 'remove', object: strainObject(object), time: 'instant'}, ref('$holder'), D.strain.amount));
    const spec = {carrier: 'item', effects, trigger: {kind: 'touch'}, pulse: 1, actsFor: 'holder', strangerFactor: 1,
        mode: pattern === 'single' || term.creates ? 'once' : 'repeating'};
    if (pattern === 'charged') {
        const charges = term.creates ? 1 : D.charges;
        spec.charge = {now: charges, max: charges, per: D.per};
    }
    if (pattern === 'bound') Object.assign(spec, {mode: 'held', strangerFactor: D.strangerFactor,
        charge: {now: D.per, max: D.per, per: D.per}});
    return spec;
}

export function itemBoundCase(id) {
    const [verb, object, time, pattern] = id.replace(/^item:/, '').split('.');
    const term = ITEM_BOUND_TERMS[`${verb}.${object}`], D = ITEM_BOUND_DIALS;
    if (!term || !ITEM_BOUND_PATTERNS.includes(pattern)) throw new Error(`no item-bound case for ${id}`);
    const sentence = {verb, object, time}, fixture = lawFixture(sentence);
    const wearer = pattern === 'passed' ? 'finder' : 'wielder';
    const target = term.thing ? 'item' : wearer;
    const person = name => fixture.seed({id: name, kind: 'body', place: 'room', quantities: {}});
    const wielder = person('wielder');
    const strain = ITEM_BOUND_TERMS[`remove.${strainObject(object)}`].quantity;
    if (pattern === 'costly') wielder.quantities[strain] ??= D.start[strain];
    const holders = [{id: 'room', kind: 'place'}, {id: destination, kind: 'place'}, wielder, person('stranger'), person('finder'),
        fixture.seed({id: 'item', kind: 'thing', as: ['item'], place: 'room', properties: {holder: 'wielder'}})];
    const hit = fixture.hit(target);
    const active = term.creates ? [hit, {holder: createdThing, position: true, direction: 'changed', to: 'room'}] : [hit];
    const quiet = [fixture.hit(target, 'unchanged')];
    const use = (stepId, by, expect) => ({id: stepId, fire: 'lay', stimulus: {kind: 'touch', by}, expect});
    const steps = {
        single: [use('use', 'wielder', active), use('again', 'wielder', quiet)],
        charged: [use('first', 'wielder', active), ...(term.ward === 'block' ? [{id: 'next-minute', advanceTo: 1}] : []),
            use('second', 'wielder', term.quantity ? active : term.ward === 'block' ? [fixture.hit(target, 'changed', {at: 1})] : quiet),
            use('empty', 'wielder', term.ward === 'block' ? [fixture.hit(target, 'unchanged', {at: 1})] : quiet)],
        bound: [use('stranger', 'stranger', term.creates ? undefined : quiet), use('holder', 'wielder', active)],
        costly: [use('use', 'wielder', [...active, {holder: 'wielder', quantity: strain, direction: 'down', amount: D.strain.amount}])],
        passed: [{id: 'hand', ops: [{op: 'property', holder: 'item', property: 'holder', value: 'finder'}]},
            use('finder', 'finder', [...active, ...(!term.thing && !term.creates ? [fixture.hit('wielder', 'unchanged')] : [])])],
    }[pattern];
    const quantities = Object.values(WORLD_QUANTITIES), props = [WORLD_PROPERTIES.form, WORLD_PROPERTIES.concealed, ITEM_HOLDER];
    return {basis: 'authored', engine: {packs: ['l.living_body'], host: {things: {}, ...(term.key && {keys: term.key})}, shared: {quantities, properties: props}},
        world: {holders, lawFields: fixture.fields(['wielder', 'finder'])},
        timeline: [{id: 'lay', store: itemBoundSpec(sentence, pattern, {details: fixture.details(target)})}, ...steps],
        expect: active};
}

/** The case-module entry the coverage runner loads (scripts/coverage_report.mjs runCase). */
export const coverageCase = itemBoundCase;
