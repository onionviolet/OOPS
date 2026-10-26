// ORIGINAL local abrasion law. HP/native inventories and the existing HP
// transaction/history own matter; these plans never spend, settle or teach.
import {defineCatalogue, deepFreeze} from './craft_materials.js';
import {defineRecipe, recognizeRecipe} from './craft_recipes.js';
import {gradeMaterialFit} from './craft_material_fit.js';
import {nativeCatalogue, nativeMaterialFor} from './native_material_catalogue.js';
import {readMaterialLineage} from './material_lineage.js';
import {assessIngredientWorldFit} from './ingredient_world_fit.js';
import {compareIngredientChoices} from './craft_ingredient_selection.js';

export const HP_ABRASIVE_PROCESS = deepFreeze({
    id: 'book.hp.abrasive-suspension', revision: 1, ref: 'book.hp.abrasive-suspension@1', status: 'ORIGINAL',
    minutes: 20, coins: 1, producedDoses: 3, maxSolids: 3, station: 'cauldron',
    steps: [{op: 'suspend', level: 1}, {op: 'settle', level: 1}],
    source: 'ORIGINAL mechanical suspension and cauldron-abrasion game tuning; no canonical potion equivalence.',
});
const P = HP_ABRASIVE_PROCESS;
const need = (ok, why) => {if(!ok) throw Error(why);};
const positive = n => Number.isSafeInteger(n) && n > 0;
const horn = 'book.hp.ing.bicorn_horn';
const fine = 'book.hp.prep.powder_fine', coarse = 'book.hp.prep.powder_coarse';
const localKey = id => `hp:${id}`;
// Work is an authored per-portion contribution, not mass, hardness or volume.
const catalogue = defineCatalogue({id: 'book.hp.abrasion', revision: 1,
    axes: [{id: 'work', kind: 'scalar', min: 0, max: 2, unit: 'book.hp:work-credit-per-portion', combination: 'unmixed'}],
    tags: [{id: 'solid', kind: 'physical', revision: 1}, {id: 'abrasive', kind: 'functional', revision: 1}],
    materials: [
        {id: 'fine-horn', revision: 1, tags: ['solid', 'abrasive'], properties: {work: 2}},
        {id: 'coarse-horn', revision: 1, tags: ['solid', 'abrasive'], properties: {work: 1}},
        {id: 'native-bonemeal', revision: 1, tags: ['solid', 'abrasive'], properties: {work: 1}},
        {id: 'side-solid', revision: 1, tags: ['solid'], properties: {work: 0}},
    ]});
const profileForLot = lot => catalogue.materials[lot.ingredient === horn && lot.form === 'powdered'
    ? lot.variant === fine ? 'fine-horn' : lot.variant === coarse ? 'coarse-horn' : 'side-solid' : 'side-solid'];
export const hpAbrasiveHostWorld = world => ['book.hp.school.world', 'book.hp.trade.world'].includes(world) ? 'book.hp' : null;

// Call with actual current native stock. A request is a choice, not a profile
// or a transport history. The catalogue's world is not the lot's birthplace.
export function planNativeHpMaterials({inputs = [], inventory, world, assertSpend = () => {}}) {
    need(Array.isArray(inputs), 'Choose exact native material amounts.');
    if(!inputs.length) return [];
    const hostWorld = hpAbrasiveHostWorld(world);
    need(hostWorld, 'Carry the selected native material into an HP school or trade life before using it at this bench.');
    const seen = new Set();
    return inputs.map(({key, qty}) => {
        need(typeof key === 'string' && positive(qty) && !seen.has(key), 'Select each exact native material key once, with a positive whole amount.');
        seen.add(key);
        const held = inventory?.[key];
        need(held && held.count >= qty, 'The exact selected native material amount is no longer carried. Review it again.');
        assertSpend(key);
        let identity; try {identity = JSON.parse(key);} catch {throw Error('Malformed native material key.');}
        const material = nativeMaterialFor(identity.id);
        const fit = assessIngredientWorldFit({definitionWorld: 'base.frontier', hostWorld, use: 'cauldron-abrasion',
            material, form: identity.id === 'Bonemeal' ? 'powdered' : null, carrier: 'water-suspension', application: 'manual-scour'});
        need(fit.eligible, 'No supported physical import law for this selected native material and use. It remains carried.');
        const originWorld = readMaterialLineage(key)?.facts?.origin_world ?? null;
        return {key, qty, material: structuredClone(material), catalogue: nativeCatalogue.ref,
            definitionWorld: 'base.frontier', hostWorld, originWorld,
            transport: {route: 'carried-native-inventory', departureWorld: null},
            form: 'powdered', carrier: 'water-suspension', application: 'manual-scour', lawRevision: fit.law.revision};
    });
}

export function planHpAbrasiveMixture({localInputs = [], externalMaterials = [], process, apparatus} = {}) {
    need(Array.isArray(localInputs) && Array.isArray(externalMaterials), 'Suspension inputs must be actual selected portions.');
    need(apparatus?.station === P.station && apparatus.carrier === 'water-suspension' && apparatus.application === 'manual-scour',
        'This suspension needs the cauldron, paid water service and manual scouring route.');
    const rows = localInputs.map(({slot, lot}) => {
        need(typeof slot === 'string' && typeof lot?.id === 'string' && !lot.stew, 'Choose a current, non-stewing HP lot.');
        return {kind: 'local', key: localKey(lot.id), lotId: lot.id, slot, qty: 1, material: profileForLot(lot)};
    });
    for(const receipt of externalMaterials) {
        need(typeof receipt.key === 'string' && positive(receipt.qty) && JSON.parse(receipt.key).id === receipt.material?.id &&
            receipt.catalogue === nativeCatalogue.ref && receipt.lawRevision === 1, 'Unsupported retained external material receipt.');
        const fit = assessIngredientWorldFit({...receipt, use: 'cauldron-abrasion'});
        need(fit.eligible, 'This foreign material has no supported abrasion contribution under the retained law.');
        rows.push({kind: 'native', key: receipt.key, qty: receipt.qty, material: catalogue.materials['native-bonemeal']});
    }
    const bulk = rows.reduce((n, row) => n + row.qty, 0);
    need(bulk > 0 && bulk <= P.maxSolids, `Select one to ${P.maxSolids} solid portions for this cauldron suspension.`);
    const abrasive = rows.filter(row => row.material.properties.work > 0).reduce((n, row) => n + row.qty, 0);
    const side = bulk - abrasive, slots = [];
    if(abrasive) slots.push(
        {id: 'abrasion', role: 'active', share: 'same-grit', select: {tags: 'abrasive'}, qty: [abrasive, abrasive]},
        {id: 'solid-load', role: 'base', share: 'same-grit', select: {tags: 'abrasive'}, qty: [abrasive, abrasive]});
    if(side) slots.push({id: 'side-load', role: 'base', select: {tags: {all: ['solid', {not: 'abrasive'}]}}, qty: [side, side]});
    const recipe = defineRecipe(catalogue, {id: `${P.id}.grit-${abrasive}.bulk-${bulk}`, revision: 1, law: P.ref, station: P.station,
        slots, process: P.steps.map(step => ({op: step.op, levels: [step.level, step.level]}))});
    const allocation = recognizeRecipe(catalogue, recipe, rows, {process, law: P.ref, stations: [apparatus.station]});
    need(allocation.recognized, 'The actual suspension procedure or selected physical amounts differ. Review the method.');
    // Essentials precede grading; side solids consume real bulk without
    // pretending to supply the abrasive function. Work is summed by this law.
    let work = 0;
    for(const row of rows) {
        const fit = gradeMaterialFit(catalogue, row.material, {essential: {tags: 'abrasive'}, targets: [{axis: 'work', value: 1}], floor: 1});
        if(fit.status === 'accepted') work += row.qty * row.material.properties.work;
    }
    const strength = Math.floor(200 * Math.min(work, 2) / 2 * 2 / Math.max(2, bulk));
    return {law: P.ref, revision: 1, status: 'ORIGINAL', process: structuredClone(P),
        cost: {coins: P.coins}, bulk, work, strength, essentialMet: work > 0,
        recognized: work > 0, identity: 'original-suspension', allocation,
        localDebits: allocation.debits.filter(row => rows[row.input].kind === 'local').map(row => ({lotId: rows[row.input].lotId, qty: row.qty})),
        nativeDebits: allocation.debits.filter(row => rows[row.input].kind === 'native').map(({key, qty}) => ({key, qty})),
        externalMaterials: structuredClone(externalMaterials)};
}

// Caller supplies projected HP lots and visible native holdings. No truth fit,
// strength, hidden provenance or automatic substitute choice reaches this view.
export function projectHpIngredientChoices({lots = [], nativeHoldings = [], selected = null} = {}) {
    const holdings = lots.map(lot => ({key: localKey(lot.id), name: `${lot.name} (${lot.id})`, count: 1,
        custody: lot.custody, available: !lot.stewing, reason: lot.stewing ? 'This lot is still stewing.' : '',
        evidence: {lot: {id: lot.id, form: lot.form, custody: lot.custody}}}));
    holdings.push(...nativeHoldings);
    const candidates = [], requests = {};
    const evidence = {conditions: [{id: 'treatment-result', status: 'unknown', reason: 'A proposed physical arrangement is not a demonstrated result.'}],
        consumer: {id: 'hp-cauldron-abrasion', description: 'A trial uses one dose against actual cauldron residue; no canonical transformation is predicted.', source: P.source}};
    const add = (id, label, kind, local, native) => {
        const request = {type: 'brew', method: P.ref, slots: Object.fromEntries(local.map((lot, i) => [['bicorn', 'knotgrass'][i], lot.id])),
            materialInputs: native.map(({key, qty}) => ({key, qty}))};
        requests[id] = request;
        candidates.push({id, label, kind, inputs: [...local.map(lot => ({key: localKey(lot.id), qty: 1})), ...native], evidence});
    };
    for(const lot of lots) if(lot.ingredient === horn && lot.form === 'powdered') {
        if(lot.variant === 'Fine powder') add(`reference:${lot.id}`, `Fine horn reference · ${lot.id}`, 'reference', [lot], []);
        if(lot.variant === 'Coarse powder') for(const stock of nativeHoldings)
            add(`blend:${lot.id}:${stock.key}`, `Coarse horn and Bonemeal blend · ${lot.id}`, 'blend', [lot], [{key: stock.key, qty: 1}]);
    }
    for(const stock of nativeHoldings) {
        add(`alternative:${stock.key}`, 'Bonemeal alternative · 2 carried portions', 'alternative', [], [{key: stock.key, qty: 2}]);
        add(`alternative-small:${stock.key}`, 'Small Bonemeal trial · 1 carried portion', 'alternative', [], [{key: stock.key, qty: 1}]);
        add(`alternative-bulk:${stock.key}`, 'Larger Bonemeal trial · 3 carried portions', 'alternative', [], [{key: stock.key, qty: 3}]);
    }
    const comparison = compareIngredientChoices({holdings, candidates, selected});
    return {...comparison, requests, method: P.ref, cost: 'Each trial pays 1 HP coin for water service, consumes the exact selected solids, and settles for 20 played minutes to yield 3 doses. Treatment spends one dose.',
        source: P.source};
}
