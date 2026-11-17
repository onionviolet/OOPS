// One dose-response law for a living body (BRC12). Input: an effect sentence (verb, object, time), a route
// (oral or surface) and a dose; output: plain case data for the generic runner that checks the body account
// change (the dose account takes the part, the flask loses it), the effect the sentence names and, for a
// timed effect, its recovery. Every amount here is an authored dial shared by all rows, never read from a
// row; a row's own evidence supplies only the sentence and the route. A case id is
// `dose:<verb>.<object>.<time>.<route>` so a ledger row can name its case without a per-row table.
import {brewApplyMethod, brewDoseMethod} from './brew_dose_delivery.js';
import {BREW_PUBLISHES} from './brew_law.js';
import {brewDoseQuantity} from './engine_brew_stock.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';

export const DOSE_CASE_MODULE = 'src/brew_dose_response.js';
const ACTIVE = 'dose-law-extract';
const ref = (kind, id = kind) => ({kind, id});

/** Authored dials (labelled authored in the ledger): amounts, starting values, the timed-effect length. */
export const DOSE_DIALS = Object.freeze({
    vitality: {amount: 5, start: 50}, form: {value: 'altered', start: 'original'},
    mind: {faculty: 'mood', amount: 4, start: 10}, minutes: 6, contact: 5, surface: 'skin', units: 4, surfaceUnits: 20,
});
/** Carrier words (the wiki-tier `routes`, the sentence `carrier`) to the two routes the law runs. */
export const DOSE_ROUTE = Object.freeze({drunk: 'oral', eaten: 'oral', potion: 'oral', topical: 'surface', spray: 'surface'});
/** Which (verb, object) pairs the law has a body account for. Others (force, lifespan, working...) have none. */
export const DOSE_TERMS = Object.freeze({
    'add.vitality': {quantity: 'vitality', direction: 'up'}, 'remove.vitality': {quantity: 'vitality', direction: 'down'},
    'transform.form': {property: 'form', direction: 'changed'}, 'transform.mind': {property: 'mind_mood', direction: 'changed'},
});

export const doseCaseId = ({verb, object, time = 'instant'}, route) => `dose:${verb}.${object}.${time}.${route}`;

/** Which route a row runs: its first labelled route the law knows, else the sentence carrier, flagged as a default. */
export function doseRouteOf(routes = [], carrier) {
    for (const r of routes) if (DOSE_ROUTE[r]) return {route: DOSE_ROUTE[r], defaulted: false};
    return DOSE_ROUTE[carrier] ? {route: DOSE_ROUTE[carrier], defaulted: true} : null;
}

export function canRunDose(sentence) { return Boolean(sentence && DOSE_TERMS[`${sentence.verb}.${sentence.object}`]); }

/** The recipient body a dose of (object) is checked on, and the response a labelled (verb, object, time) sentence names for a part. */
export function doseBody(object, route = 'oral') {
    const D = DOSE_DIALS;
    const body = {id: 'recipient', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_mood: D.mind.start, mind_confusion: 0}};
    if (route === 'surface') body.properties.marks = [`surface:${D.surface}`];
    if (object === 'vitality') body.quantities = {vitality: D.vitality.start};
    if (object === 'form') body.properties.form = D.form.start;
    return body;
}
export function doseResponse({verb, object, time = 'instant'}, part = ACTIVE) {
    const D = DOSE_DIALS;
    const sentence = {verb, object, time: object === 'mind' ? 'sustained' : time};
    const response = object === 'vitality' ? {sentence, details: {amount: D.vitality.amount}}
        : object === 'form' ? {sentence, details: {value: D.form.value}}
            : {sentence, details: {minutes: D.minutes, mind: {faculty: D.mind.faculty, amount: D.mind.amount}}};
    return {part, minimum: 1, ...response};
}

export function doseResponseCase(id) {
    const [verb, object, time, route] = id.replace(/^dose:/, '').split('.');
    const term = DOSE_TERMS[`${verb}.${object}`];
    if (!term || !['oral', 'surface'].includes(route)) throw new Error(`no dose response for ${id}`);
    const D = DOSE_DIALS;
    const body = doseBody(object, route);
    const responses = [doseResponse({verb, object, time}, ACTIVE)];
    const method = route === 'oral' ? brewDoseMethod({id: `dose-law.${id}`, route: 'oral', responses})
        : brewApplyMethod({id: `dose-law.${id}`, surface: D.surface, contact: D.contact, responses});
    // A surface dose reaches the body in part (uptake), so the account check is "took some", not the full amount.
    const account = {holder: 'recipient', quantity: brewDoseQuantity(ACTIVE), direction: 'up'};
    const flask = {holder: 'flask', quantity: brewDoseQuantity(ACTIVE), direction: 'down'};
    const effect = {holder: 'recipient', ...term};
    const settle = [account, flask, effect];
    const timeline = [
        {id: 'serve', working: {family: 'brew-dose', method, bindings: {flask: ref('flask'), recipient: ref('body', 'recipient')}}},
        {id: 'settle', advanceTo: route === 'surface' ? D.contact + 1 : 4, expect: settle},
        ...(object === 'mind' ? [{id: 'recovered', advanceTo: 4 + D.minutes + D.contact + 2,
            expect: [{holder: 'recipient', property: 'mind_mood', direction: 'changed', to: D.mind.start}]}] : []),
    ];
    const packs = ['a.mind'];
    const shared = {effectKinds: BREW_PUBLISHES, quantities: [...Object.values(WORLD_QUANTITIES)]};
    if (object === 'form') shared.properties = [WORLD_PROPERTIES.form, WORLD_PROPERTIES.marks];
    else if (route === 'surface') shared.properties = [WORLD_PROPERTIES.marks];
    return {basis: 'authored', engine: {packs, host: {things: {}}, shared},
        world: {holders: [{id: 'bench', kind: 'place'},
            {id: 'flask', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[brewDoseQuantity(ACTIVE)]: route === 'surface' ? D.surfaceUnits : D.units}}, body]},
        timeline, expect: object === 'mind' ? [account, flask] : settle};
}

/** The case-module entry the coverage runner loads (scripts/coverage_report.mjs runCase). */
export const coverageCase = doseResponseCase;
