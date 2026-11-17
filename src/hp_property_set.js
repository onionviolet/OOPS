// One Hogwarts world property set (MR37, BRG1): the effect axes and level words every Hogwarts material
// row is written in, so an ingredient is a point in one shared space and not a per-recipe number. The
// vocabulary is the 2026-11-16 label-pass proposal (docs/research/advancement-aspects-2026-11-16); the
// permille a level word stands for is authored, the same for every ingredient. A material row's stated
// axes become the constituents of a lot, which the brew law dissolves, brews and doses like any other.
import {BREW_PUBLISHES, BREW_LAW} from './brew_law.js';
import {brewDoseQuantity, brewMeasureQuantity} from './engine_brew_stock.js';

export const HP_PROPERTY_MODULE = 'src/hp_property_set.js';
export const HP_AXES = Object.freeze(['mend', 'calm', 'bite', 'venom', 'ward', 'form', 'mind', 'memory', 'luck', 'heat', 'conceal-or-sense', 'vigour']);
/** Level words to permille of a measured lot (authored, one scale for all rows). A lot's shares sum to at
 * most the whole, so a row whose axes would exceed it is scaled down together (see hpMaterialRow). */
export const HP_LEVELS = Object.freeze({trace: 100, some: 250, strong: 500});

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
    const axes = id.replace(/^material:/, '').split(',').map(s => { const [axis, level] = s.split('.'); return {axis, level}; });
    const constituents = hpMaterialRow(axes);
    if (!constituents) throw new Error(`no material row in the Hogwarts property set for ${id}`);
    const lot = {id: 'ingredient', amount: 100}, take = 100;
    const bindings = {flask: ref('flask', 'flask'), lot: ref('lot', 'ingredient')};
    const method = {id: 'hp.material.dissolve', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask', lot: 'lot'},
        steps: [{op: 'dissolve-in-flask', minutes: 1, bindings: {flask: 'flask', lot: 'lot'}, options: {amount: take}}]};
    const expect = [{holder: lot.id, quantity: brewMeasureQuantity, direction: 'down', to: 0},
        ...Object.entries(constituents).map(([axis, permille]) =>
            ({holder: 'flask', quantity: brewDoseQuantity(axis), direction: 'up', to: Math.floor(take * permille / 1000)}))];
    return {basis: 'authored', engine: {packs: ['a.mind'], host: {things: {'lot:ingredient': {material: 'ingredient', properties: {constituents}}}},
        shared: {effectKinds: BREW_PUBLISHES}},
        world: {holders: [{id: 'bench', kind: 'place'}, {id: 'flask', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[brewDoseQuantity('water')]: 12}},
            {id: lot.id, kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: lot.amount}}]},
        timeline: [{id: 'dissolve', working: {family: 'brew', method, bindings}}, {id: 'dissolved', advanceTo: 1, expect}], expect};
}

export const coverageCase = materialCase;
