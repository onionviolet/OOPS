// Engine execution of held-out potion rows (PC72, the stronger test beside the diagnostic in
// brew_heldout.js). For one row, the mechanism's fitted sentence and delivery route become plain
// case data for the generic runner (scripts/coverage_report.mjs runCaseData), built through the
// shared brew dose law. The recorded result is the evidence label read in world terms (`expect`),
// so a row matches only when the engine, not a lookup, changes the world as the label says.
// Outcome and route are separate runs: the outcome run delivers by mouth so the effect is tested
// alone; the route run delivers by the mechanism's route and checks the account the label's route
// needs. Quantities are fixed dials shared by every row, never read from the row.
import {brewApplyMethod, brewCoatingMethod, brewDoseMethod} from './brew_dose_delivery.js';
import {BREW_PUBLISHES} from './brew_law.js';
import {brewDoseQuantity} from './engine_brew_stock.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';
import {residueQuantity} from './world_substrate_packs/residue_flow.js';

const ACTIVE = 'held-out-extract';
const ref = (kind, id = kind) => ({kind, id});

/** What a label's carrier means to the engine: swallowed (`administer`, a body's dose account) or put
 * on a surface (`apply` on a body's named surface, `coat` on a thing; both leave residue on it). Which
 * of drunk and eaten, or topical and spray, a potion uses is a design choice the engine does not
 * decide, so each pair shares a class. */
export const ROUTE_OF_CARRIER = Object.freeze({potion: 'oral', eaten: 'oral', topical: 'surface', spray: 'surface'});

/** Where a surface-class preparation goes, read from each row's evidence (never from a title). A row
 * with no entry has no evidence naming a recipient, so its surface route is reported as missing data.
 * Soil is a thing, not a body: it takes the existing `coat` route. */
export const SURFACE_OF_ROW = Object.freeze({
    'hp.potion.swelling_solution': {recipient: 'body', surface: 'skin', evidence: 'HPPE024'},
    'hp.potion.murtlap_essence': {recipient: 'body', surface: 'skin', evidence: 'HPPE054'},
    'hp.potion.sleekeazy_s_hair_potion': {recipient: 'body', surface: 'hair', evidence: 'HPPE062'},
    'hp.potion.dr_ubbly_s_oblivious_unction': {recipient: 'body', surface: 'skin', evidence: 'HPPE121'},
    'hp.potion.dragon_dung_fertiliser': {recipient: 'thing', surface: 'soil', evidence: 'HPPE124'},
});
/** Contact minutes for the route run: one dial shared by every row. */
export const CONTACT_MINUTES = 5;

/** Dials: one authored value per object, the same for every row. */
const DIALS = Object.freeze({
    vitality: {amount: 5, start: 50},
    form: {value: 'altered', start: 'original'},
    mind: {faculty: 'mood', amount: 4, start: 10, minutes: 6},
});

/** The world term an evidence label (verb, object) says should change; null when the engine has no
 * such term for that pair, which is reported per row as a missing mechanism. */
export function labelTerm({verb, object}) {
    if (object === 'vitality' && (verb === 'add' || verb === 'remove')) return {quantity: 'vitality', direction: verb === 'add' ? 'up' : 'down'};
    if (object === 'form' && (verb === 'transform' || verb === 'release')) return {property: 'form', direction: 'changed'};
    if (object === 'mind' && verb === 'transform') return {property: 'mind_mood', direction: 'changed'};
    return null;
}

function bodyHolder(object) {
    const base = {id: 'recipient', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_mood: DIALS.mind.start, mind_confusion: 0}};
    if (object === 'vitality') base.quantities = {vitality: DIALS.vitality.start};
    if (object === 'form') base.properties = {...base.properties, form: DIALS.form.start};
    return base;
}

function responseFor(parts) {
    const {verb, object} = parts;
    if (object === 'vitality') return {sentence: {verb, object, time: 'instant'}, details: {amount: DIALS.vitality.amount}};
    if (object === 'form') return {sentence: {verb, object, time: 'lasting'}, details: {value: DIALS.form.value}};
    if (object === 'mind') return {sentence: {verb, object, time: 'sustained'},
        details: {minutes: DIALS.mind.minutes, mind: {faculty: DIALS.mind.faculty, amount: DIALS.mind.amount}}};
    return null;
}

function baseCase({object, method, expect}) {
    const packs = ['a.mind'];
    const shared = {effectKinds: BREW_PUBLISHES};
    if (object === 'vitality') shared.quantities = [...Object.values(WORLD_QUANTITIES)];
    if (object === 'form') shared.properties = [WORLD_PROPERTIES.form, WORLD_PROPERTIES.marks];
    const flask = ref('flask');
    return {basis: 'authored', engine: {packs, host: {things: {}}, shared},
        world: {holders: [{id: 'bench', kind: 'place'},
            {id: 'flask', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[brewDoseQuantity(ACTIVE)]: 4}},
            bodyHolder(object)]},
        timeline: [{id: 'serve', working: {family: 'brew-dose', method, bindings: {flask, recipient: ref('body', 'recipient')}}},
            {id: 'settle', advanceTo: 4, expect}],
        expect};
}

/** Outcome case: the mechanism's predicted sentence, delivered by mouth, expected to change the
 * world as the label says. Returns {data} or {cannot: reason}. */
export function outcomeCase(prediction, label) {
    if (!prediction) return {cannot: 'no mechanism default (no evidence-labelled row fitted it)'};
    const term = labelTerm(label);
    if (!term) return {cannot: `the engine has no world term for ${label.verb} ${label.object}`};
    const response = responseFor(prediction);
    if (!response) return {cannot: `the mechanism's ${prediction.verb} ${prediction.object} has no dose response in the brew law`};
    const method = brewDoseMethod({id: 'held-out.outcome', route: 'oral', responses: [{part: ACTIVE, minimum: 1, ...response}]});
    return {data: baseCase({object: prediction.object, method, expect: [{holder: 'recipient', ...term}]}), term};
}

/** Route case: the mechanism's route, expected to leave the dose where the label's route needs it:
 * oral, in the body's dose account; surface, as residue on the recipient. The recipient and surface come
 * from SURFACE_OF_ROW (default: a body's skin). An oral label with a surface offer (or the reverse) is a
 * real mismatch the engine shows, not a lookup. */
export function routeCase(prediction, label, rowId = null) {
    if (!prediction) return {cannot: 'no mechanism default (no evidence-labelled row fitted it)'};
    const want = ROUTE_OF_CARRIER[label.carrier], offered = ROUTE_OF_CARRIER[prediction.carrier];
    if (!want || !offered) return {cannot: `no engine route for the carrier ${want ? prediction.carrier : label.carrier}`};
    const place = SURFACE_OF_ROW[rowId];
    if (want === 'surface' && !place) return {cannot: 'missing data: no evidence names what the preparation is applied to'};
    const target = place ?? {recipient: 'body', surface: 'skin'};
    const flask = ref('flask');
    const holders = [{id: 'bench', kind: 'place'},
        {id: 'flask', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[brewDoseQuantity(ACTIVE)]: 4}},
        target.recipient === 'thing' ? {id: 'recipient', kind: 'thing', place: 'bench'}
            : {id: 'recipient', kind: 'body', place: 'bench', properties: {marks: [`surface:${target.surface}`], mind_awake: true, mind_mood: DIALS.mind.start, mind_confusion: 0}}];
    const method = offered === 'surface'
        ? (target.recipient === 'thing' ? brewCoatingMethod({id: 'held-out.coat', responses: []})
            : brewApplyMethod({id: 'held-out.apply', surface: target.surface, contact: CONTACT_MINUTES, responses: []}))
        : brewDoseMethod({id: 'held-out.oral', route: 'oral', responses: []});
    const account = want === 'oral' ? brewDoseQuantity(ACTIVE) : residueQuantity(ACTIVE);
    const expect = [{holder: 'recipient', quantity: account, direction: 'up'}];
    return {data: {basis: 'authored', engine: {packs: ['a.mind'], host: {things: {}},
        shared: {effectKinds: BREW_PUBLISHES, quantities: [...Object.values(WORLD_QUANTITIES)], properties: [WORLD_PROPERTIES.marks]}},
        world: {holders},
        timeline: [{id: 'serve', working: {family: 'brew-dose', method, bindings: {flask, recipient: ref(target.recipient, 'recipient')}}},
            {id: 'settle', advanceTo: 4, expect}],
        expect}};
}

/** Run each row's outcome and route cases through `run` (the generic case runner, passed in so src
 * imports no script). Each entry: {id, outcome, route, labelRoute}, each 'match', 'mismatch' or `cannot: <why>`. */
export async function executeRows(rows, table, run) {
    const judge = async built => {
        if (built.cannot) return `cannot: ${built.cannot}`;
        try {
            const out = await run(built.data);
            if (out.state.startsWith('expressed-') || out.state.startsWith('runs-')) return 'match';
            return out.state === 'blocked:runner-expect-mismatch' ? 'mismatch' : `cannot: ${out.state} ${out.detail ?? ''}`.trim();
        } catch (error) { return `cannot: ${error.message}`; }
    };
    const results = [];
    for (const r of rows) {
        const prediction = table[r.family];
        results.push({id: r.id, family: r.family, outcome: await judge(outcomeCase(prediction, r.parts)), route: await judge(routeCase(prediction, r.parts, r.id)),
            // Can the engine deliver the labelled route at all? The label's own carrier, run through the same case.
            labelRoute: await judge(routeCase({carrier: r.parts.carrier}, r.parts, r.id))});
    }
    return results;
}
