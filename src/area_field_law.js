// One area-field law (PSA28 dry run, proposal 2026-11-17). An area power is an effect sentence (verb.object, the shared
// grammar of effect_grammar.js) laid on a place or on a holder who carries the place with them, and read at the places
// the stored working reaches. The engine already keeps what the law needs (stored_working.js: `$place`, the carrier,
// repeating charge, pulse; world_effects.js: `place` and `marked` target shapes); this module adds only the one
// composition: which carrier, which targets, how long. Size is not a field: a world decides how big a place is, so
// "short" and "wide" differ by the place the world names, not by a number here. Every amount is an authored dial.
// A case id is `area:<verb>.<object>.<time>.<anchor>.<who>`, so a ledger row names its case without a table.
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';
import {ITEM_BOUND_DIALS, ITEM_BOUND_TERMS, ITEM_HOLDER} from './item_bound_law.js';

export const AREA_CASE_MODULE = 'src/area_field_law.js';
/** Authored dials (default, dial and reason in the PSA28 note). Shared with the item-bound law where the world account is shared. */
export const AREA_DIALS = Object.freeze({amount: 5, pulses: 2, start: ITEM_BOUND_DIALS.start, into: ITEM_BOUND_DIALS.into, mark: 'chosen', later: 600});
/** Which (verb, object) pairs have a world account: the item-bound law's table, because the account is the same whoever carries the working. */
export const AREA_TERMS = ITEM_BOUND_TERMS;
/** instant: one pulse, then spent. sustained: the carrier keeps it up for a few pulses, then it falls (dismissed or timed out). lasting: one pulse whose change stays. */
export const AREA_TIMES = Object.freeze(['instant', 'sustained', 'lasting']);
/** place: the field is fixed to a place. holder: it moves with the carrier (an aura). */
export const AREA_ANCHORS = Object.freeze(['place', 'holder']);
/** everyone: whoever is in the place. marked: only those the carrier has marked (allies, enemies, chosen targets). */
export const AREA_WHO = Object.freeze(['everyone', 'marked']);

export const areaCaseId = ({verb, object, time = 'instant'}, anchor = 'place', who = 'everyone') => `area:${verb}.${object}.${time}.${anchor}.${who}`;
export const canRunArea = s => Boolean(s && AREA_TERMS[`${s.verb}.${s.object}`] && AREA_TIMES.includes(s.time ?? 'instant'));

export function areaSpec({verb, object, time = 'instant'}, anchor, who) {
    const D = AREA_DIALS, effect = {sentence: {verb, object, time}, details: {target: who === 'marked' ? {shape: 'marked', place: '$place', mark: D.mark} : {shape: 'place', place: '$place'}}};
    if (object === 'form') effect.details.value = D.into; else effect.details.amount = D.amount;
    const spec = {carrier: anchor === 'holder' ? 'caster' : 'room', effects: [effect], trigger: {kind: 'touch'}, pulse: 1, actsFor: 'storer', strangerFactor: 1,
        mode: time === 'instant' || time === 'lasting' ? 'once' : 'repeating'};
    if (time === 'sustained') spec.charge = {now: D.pulses, max: D.pulses, per: 1};
    return spec;
}

export function areaCase(id) {
    const [verb, object, time, anchor, who] = id.replace(/^area:/, '').split('.');
    const term = AREA_TERMS[`${verb}.${object}`], D = AREA_DIALS;
    if (!term || !AREA_TIMES.includes(time) || !AREA_ANCHORS.includes(anchor) || !AREA_WHO.includes(who)) throw new Error(`no area case for ${id}`);
    const seed = (holder) => {
        if (term.quantity) holder.quantities = {...holder.quantities, [term.quantity]: D.start[term.quantity]};
        else holder.properties = {...holder.properties, form: D.start.form};
        return holder;
    };
    const marked = who === 'marked' ? {marks: [D.mark]} : {};
    // A field on a place acts where it was laid; a holder's field goes where the holder goes, so that caster walks to the yard first.
    const zone = anchor === 'holder' ? 'yard' : 'room', other = zone === 'room' ? 'yard' : 'room';
    const body = (name, place, properties = {}) => seed({id: name, kind: 'body', place, properties: {...properties}, quantities: {}});
    const holders = [seed({id: 'room', kind: 'place', properties: {}, quantities: {}}), seed({id: 'yard', kind: 'place', properties: {}, quantities: {}}),
        body('caster', 'room'), body('inside', zone, marked), body('bystander', zone), body('outside', other, marked)];
    holders.push({id: 'field', kind: 'thing', as: ['item'], place: 'room', properties: {holder: 'caster'}});
    const hit = (holder, direction = term.direction) => term.quantity ? {holder, quantity: term.quantity, direction} : {holder, property: term.property, direction};
    const use = (stepId, expect) => ({id: stepId, fire: 'lay', stimulus: {kind: 'touch', by: 'caster'}, expect});
    const inside = [hit('inside')], quiet = [hit('inside', 'unchanged')];
    const stay = who === 'marked' ? [hit('bystander', 'unchanged')] : [];
    const first = use('cast', [...inside, hit('outside', 'unchanged'), ...stay]);
    // A property (a form) is set, not added: a held pulse leaves it as it was.
    const held = term.property ? quiet : inside;
    const steps = {
        instant: [first, use('again', quiet)],
        lasting: [first, {id: 'later', advanceTo: D.later, expect: quiet}],
        sustained: [first, use('held', held), use('fallen', quiet)],
    }[time];
    if (anchor === 'holder') steps.unshift({id: 'walk', ops: [{op: 'move', holder: 'caster', to: 'yard'}]});
    const quantities = Object.values(WORLD_QUANTITIES), props = [WORLD_PROPERTIES.form, WORLD_PROPERTIES.marks, ITEM_HOLDER];
    return {basis: 'authored', engine: {packs: ['l.living_body'], host: {things: {}, ...(term.key && {keys: term.key})}, shared: {quantities, properties: props}},
        world: {holders},
        timeline: [{id: 'lay', store: areaSpec({verb, object, time}, anchor, who)}, ...steps],
        expect: [hit('inside'), hit('outside', 'unchanged')]};
}

/** The case-module entry the coverage runner loads (scripts/coverage_report.mjs runCase). */
export const coverageCase = areaCase;
