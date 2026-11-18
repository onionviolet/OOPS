// One form-transformation law (PSA28 dry run, proposal 2026-11-17). A form change is the shared sentence `transform.form`
// (effect_grammar.js; the `form` property of world_quantities.js) laid as a stored working on its carrier, plus the one
// thing a form change adds that a plain transform lacks: how it comes undone. The engine keeps the rest (stored_working.js:
// holder attunement, stranger price, time triggers). Fields that change play: who changes (the holder, another body, an
// object) and the reversal (at-will, timeout, counter, none). Duration is not a field: a timeout is a reversal with a
// clock, and the clock length is a dial. Abilities that come with the form belong to the packs that read `form`; the law
// sets the label and does not model them. The restored shape carries its own label (`restored`) so a round trip shows as a change. A case id is `form:<reversal>.<target>.<property>`.
import {WORLD_PROPERTIES} from './world_quantities.js';
import {ITEM_HOLDER} from './item_bound_law.js';

export const FORM_CASE_MODULE = 'src/form_transformation_law.js';
export const FORM_DIALS = Object.freeze({into: 'altered', from: 'restored', timeout: 600, strangerFactor: 2, properties: {form: 'altered', material: 'stone'}, start: {form: 'original', material: 'flesh'}});
/** at-will: the holder undoes it, a stranger cannot. timeout: it undoes itself after a clock. counter: anyone with the counter-effect undoes it. none: nothing undoes it. */
export const FORM_REVERSALS = Object.freeze(['at-will', 'timeout', 'counter', 'none']);
export const FORM_TARGETS = Object.freeze(['holder', 'other', 'object']);
/** form: the body or species wears another shape (also looks, size, an abilities-only change: the label is the same). material: flesh to stone. */
export const FORM_PROPERTIES = Object.freeze(['form', 'material']);
/** Verbs the law reads as the one transform: labels say alter.form for the same change. */
export const FORM_VERBS = Object.freeze(['transform', 'alter']);

export const formCaseId = (reversal, target = 'holder', property = 'form') => `form:${reversal}.${target}.${property}`;
export const canRunForm = s => Boolean(s && FORM_VERBS.includes(s.verb) && s.object === 'form');

function spec(carrier, target, property, value, {trigger = {kind: 'touch'}, actsFor = 'anyone', mode = 'once', strangerFactor = 1, charge} = {}) {
    const effect = {sentence: {verb: 'transform', object: 'form', time: 'lasting'}, details: {target, value}};
    return {carrier, effects: [effect], trigger, pulse: 1, actsFor, strangerFactor, mode, ...(charge ? {charge} : {})};
}

export function formCase(id) {
    const [reversal, target, property] = id.replace(/^form:/, '').split('.');
    const D = FORM_DIALS;
    if (!FORM_REVERSALS.includes(reversal) || !FORM_TARGETS.includes(target) || property !== 'form') throw new Error(`no form case for ${id}`);
    const who = target === 'holder' ? 'wielder' : target === 'other' ? 'other' : 'statue';
    const body = name => ({id: name, kind: 'body', place: 'room', properties: {form: D.start.form}, quantities: {}});
    const holders = [{id: 'room', kind: 'place'}, body('wielder'), body('other'), body('dispeller'),
        {id: 'statue', kind: 'thing', as: ['item'], place: 'room', properties: {form: D.start.form, holder: 'wielder'}}];
    const hit = (holder, to, direction = 'changed') => ({holder, property: 'form', direction, ...(to ? {to} : {})});
    const aim = {shape: 'holder', id: who};
    const use = (stepId, fire, by, expect) => ({id: stepId, fire, stimulus: {kind: 'touch', by}, expect});
    const timeline = [{id: 'lay', store: spec('wielder', aim, property, D.into)}, use('change', 'lay', 'wielder', [hit(who, D.into)])];
    // Every reversal but `none` lays a second working whose effect sets the original shape back; they differ in who may fire it and when.
    if (reversal === 'at-will') timeline.push({id: 'undo', store: spec('wielder', aim, property, D.from, {actsFor: 'holder', strangerFactor: D.strangerFactor, mode: 'held', charge: {now: 1, max: 1, per: 1}})},
        use('stranger', 'undo', 'dispeller', [hit(who, null, 'unchanged')]), use('revert', 'undo', 'wielder', [hit(who, D.from)]));
    if (reversal === 'counter') timeline.push({id: 'undo', store: spec('dispeller', aim, property, D.from)}, use('counter', 'undo', 'dispeller', [hit(who, D.from)]));
    if (reversal === 'timeout') timeline.push({id: 'undo', store: spec('wielder', aim, property, D.from, {trigger: {kind: 'time', at: D.timeout}})}, {id: 'later', advanceTo: D.timeout, expect: [hit(who, D.from)]});
    if (reversal === 'none') timeline.push({id: 'later', advanceTo: D.timeout, expect: [hit(who, null, 'unchanged')]});
    return {basis: 'authored', engine: {packs: ['l.living_body'], host: {things: {}}, shared: {quantities: [], properties: [WORLD_PROPERTIES.form, ITEM_HOLDER]}},
        world: {holders}, timeline, expect: [hit(who, reversal === 'none' ? D.into : D.from)]};
}

/** The case-module entry the coverage runner loads (scripts/coverage_report.mjs runCase). */
export const coverageCase = formCase;
