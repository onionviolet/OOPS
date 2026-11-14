// Engine execution of held-out potion rows (PC72, the stronger test beside the diagnostic in
// brew_heldout.js). For one row, the mechanism's fitted sentence and delivery route become plain
// case data for the generic runner (scripts/coverage_report.mjs runCaseData), built through the
// shared brew dose law. The recorded result is the evidence label read in world terms (`expect`),
// so a row matches only when the engine, not a lookup, changes the world as the label says.
// Outcome and route are separate runs: the outcome run delivers by mouth so the effect is tested
// alone; the route run delivers by the mechanism's route and checks the account the label's route
// needs. Quantities are fixed dials shared by every row, never read from the row.
import {brewDoseMethod} from './brew_dose_delivery.js';
import {BREW_PUBLISHES} from './brew_law.js';
import {brewDoseQuantity} from './engine_brew_stock.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';
import {residueQuantity} from './world_substrate_packs/residue_flow.js';

const ACTIVE = 'held-out-extract';
const ref = (kind, id = kind) => ({kind, id});

/** The delivery routes the engine can run for a body recipient, by label carrier. The brew dose law
 * has `administer` (a body takes a measured dose) and `coat` (a thing takes a surface residue). */
export const ROUTE_OF_CARRIER = Object.freeze({potion: 'oral', eaten: 'oral', topical: 'coat', spray: 'coat'});

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

/** Route case: the mechanism's route, expected to leave the dose in the account the label's route
 * needs (oral: the body's dose account; coat: a surface residue account). A surface route cannot run
 * on a body here, because `coat` binds a thing, so the engine's own refusal is the reason. */
export function routeCase(prediction, label) {
    if (!prediction) return {cannot: 'no mechanism default (no evidence-labelled row fitted it)'};
    const want = ROUTE_OF_CARRIER[label.carrier], offered = ROUTE_OF_CARRIER[prediction.carrier];
    if (!want) return {cannot: `no engine route for the label's carrier ${label.carrier}`};
    if (want === 'coat') return {cannot: 'missing mechanism: brew `coat` binds a thing, and no body-surface dose route exists in the brew dose law'};
    if (offered === 'coat') return {cannot: 'missing mechanism: the mechanism offers a surface route and brew `coat` binds a thing, not a body'};
    const response = {part: ACTIVE, minimum: 1, sentence: {verb: 'add', object: 'vitality', time: 'instant'}, details: {amount: DIALS.vitality.amount}};
    const method = brewDoseMethod({id: 'held-out.route', route: offered, responses: [response]});
    const account = want === 'oral' ? brewDoseQuantity(ACTIVE) : residueQuantity(ACTIVE);
    return {data: baseCase({object: 'vitality', method, expect: [{holder: 'recipient', quantity: account, direction: 'up', to: 4}]})};
}


/** Run each row's outcome and route cases through `run` (the generic case runner, passed in so src
 * imports no script). Each entry: {id, outcome, route}, each 'match', 'mismatch' or `cannot: <why>`. */
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
        results.push({id: r.id, family: r.family, outcome: await judge(outcomeCase(prediction, r.parts)), route: await judge(routeCase(prediction, r.parts))});
    }
    return results;
}
