// One Hogwarts world property set (MR37, BRG1): the effect axes and level words every Hogwarts material
// row is written in, so an ingredient is a point in one shared space and not a per-recipe number. The
// vocabulary is the 2026-11-16 label-pass proposal (docs/research/advancement-aspects-2026-11-16); the
// permille a level word stands for is authored, the same for every ingredient. A material row's stated
// axes become the constituents of a lot, which the brew law dissolves, brews and doses like any other.
import {BREW_PUBLISHES, BREW_LAW} from './brew_law.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';
import {brewDoseQuantity, brewMeasureQuantity} from './engine_brew_stock.js';
import {brewDoseMethod} from './brew_dose_delivery.js';
import {DOSE_TERMS, doseBody, doseResponse} from './brew_dose_response.js';

export const HP_PROPERTY_MODULE = 'src/hp_property_set.js';
export const HP_AXES = Object.freeze(['mend', 'calm', 'bite', 'venom', 'ward', 'form', 'mind', 'memory', 'luck', 'heat', 'conceal-or-sense', 'vigour']);
/** Level words to permille of a measured lot (authored, one scale for all rows). A lot's shares sum to at
 * most the whole, so a row whose axes would exceed it is scaled down together (see hpMaterialRow). */
export const HP_LEVELS = Object.freeze({trace: 100, some: 250, strong: 500});

/** The effect sentence a derived primary axis is dosed as (PWC22): the axes the dose law has a body account for (DOSE_TERMS). */
export const HP_AXIS_DOSE = Object.freeze({mend: {verb: 'add', object: 'vitality'}, venom: {verb: 'remove', object: 'vitality'},
    form: {verb: 'transform', object: 'form'}, mind: {verb: 'transform', object: 'mind'}});
export const derivedCaseId = axes => `derived:${axes.map(a => `${a.axis}.${a.level}`).join(',')}`;

export const materialCaseId = axes => `material:${axes.map(a => `${a.axis}.${a.level}`).join(',')}`;

/** A row's stated axes as lot constituents, or null when an axis or level is outside the set. */
export function hpMaterialRow(axes) {
    const constituents = {};
    for (const {axis, level} of axes) {
        if (!HP_AXES.includes(axis) || !Object.hasOwn(HP_LEVELS, level)) return null;
        constituents[axis] = HP_LEVELS[level];
    }
    const sum = Object.values(constituents).reduce((a, b) => a + b, 0);
    if (sum > 1000) for (const k of Object.keys(constituents)) constituents[k] = Math.floor(constituents[k] * 1000 / sum);
    return Object.keys(constituents).length ? constituents : null;
}

const ref = (kind, id) => ({kind, id});

/** Case data: the ingredient lot dissolved into a flask puts each stated axis into the flask's stock in
 * proportion to its level, and the lot is drawn down. The measure is the same authored dial for every row. */
export function materialCase(id) {
    const derived = id.startsWith('derived:');
    const axes = id.replace(/^(material|derived):/, '').split(',').map(s => { const [axis, level] = s.split('.'); return {axis, level}; });
    const constituents = hpMaterialRow(axes);
    if (!constituents) throw new Error(`no material row in the Hogwarts property set for ${id}`);
    const lot = {id: 'ingredient', amount: 100}, take = 100;
    const bindings = {flask: ref('flask', 'flask'), lot: ref('lot', 'ingredient')};
    const method = {id: 'hp.material.dissolve', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask', lot: 'lot'},
        steps: [{op: 'dissolve-in-flask', minutes: 1, bindings: {flask: 'flask', lot: 'lot'}, options: {amount: take}}]};
    const expect = [{holder: lot.id, quantity: brewMeasureQuantity, direction: 'down', to: 0},
        ...Object.entries(constituents).map(([axis, permille]) =>
            ({holder: 'flask', quantity: brewDoseQuantity(axis), direction: 'up', to: Math.floor(take * permille / 1000)}))];
    const timeline = [{id: 'dissolve', working: {family: 'brew', method, bindings}}, {id: 'dissolved', advanceTo: 1, expect}];
    const holders = [{id: 'bench', kind: 'place'}, {id: 'flask', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[brewDoseQuantity('water')]: 12}},
        {id: lot.id, kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: lot.amount}}];
    const shared = {effectKinds: BREW_PUBLISHES};
    // A derived set whose first axis the dose law has a body account for is also served to a body through that law (PWC22),
    // so the derived property is brewed, dosed and checked, not only dissolved.
    const sentence = derived ? HP_AXIS_DOSE[axes[0].axis] : null;
    if (sentence) {
        const term = DOSE_TERMS[`${sentence.verb}.${sentence.object}`];
        const dose = doseResponse(sentence, axes[0].axis);
        const doseMethod = brewDoseMethod({id: `hp.derived.dose.${axes[0].axis}`, route: 'oral', responses: [dose]});
        const quantity = brewDoseQuantity(axes[0].axis);
        // The flask is checked in the dissolve step (it gains the axis); the dose then moves it into the body's account.
        const settle = [{holder: 'recipient', quantity, direction: 'up'}, {holder: 'recipient', ...term}];
        holders.push(doseBody(sentence.object));
        shared.quantities = [...Object.values(WORLD_QUANTITIES)];
        if (sentence.object === 'form') shared.properties = [WORLD_PROPERTIES.form, WORLD_PROPERTIES.marks];
        timeline.push({id: 'serve', working: {family: 'brew-dose', method: doseMethod, bindings: {flask: ref('flask', 'flask'), recipient: ref('body', 'recipient')}}},
            {id: 'settle', advanceTo: 5, expect: settle});
        return {basis: 'derived', engine: {packs: ['a.mind'], host: {things: {'lot:ingredient': {material: 'ingredient', properties: {constituents}}}}, shared},
            world: {holders}, timeline, expect: settle};
    }
    return {basis: derived ? 'derived' : 'authored', engine: {packs: ['a.mind'], host: {things: {'lot:ingredient': {material: 'ingredient', properties: {constituents}}}}, shared},
        world: {holders}, timeline, expect};
}

export const coverageCase = materialCase;
