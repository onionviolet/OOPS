// Potion vocabulary supplied by each world. Numbers and fully composed
// methods below are original game rules. Source pointers qualify fields.
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw} from './craft_resolver.js';
import {definePotionLining} from './potion_vessel_history.js';
import {MOL_LOCATIONS} from './book_world_mol_ids.js';

const material = (id, name, properties = {}) => ({id, name, revision: 1, properties});
const op = (id, label) => ({id, label, levels: [1, 1]});
const conversion = (id, after, from, to, limit = 1000) => ({
    id, after, limit, reactants: {[from]: 1}, products: {[to]: 1},
});
const effect = (id, route, axis, per) => ({id, route, effect: id, axis, per});
const fractions = (...ids) => ids.map(id => ({id, kind: 'fraction'}));

const hogwartsCatalogue = defineCatalogue({
    id: 'book.hp.potioneer.materials', revision: 1, tags: [],
    axes: fractions('sealed_egg', 'egg_extract', 'rose_oil', 'fixative', 'thickener', 'treacle', 'alihotsy'),
    materials: [
        material('water', 'Water'),
        material('frozen_egg', 'Frozen Ashwinder egg', {sealed_egg: 600}),
        material('rose', 'Rose petals', {rose_oil: 400}),
        material('blue_tracer', 'Blue tracer'),
        material('mucus', 'Flobberworm mucus', {thickener: 700}),
        material('treacle', 'Glumbumble treacle', {treacle: 800}),
        material('alihotsy', 'Alihotsy leaves', {alihotsy: 500}),
    ],
});
const hogwartsLaw = defineCraftLaw({
    id: 'book.hp.potioneer', revision: 1, catalogue: hogwartsCatalogue, carrier: 'Hogwarts draught',
    ops: [op('extract', 'Crush and extract'), op('steep', 'Steep over low heat'), op('stir', 'Stir until dispersed')],
    reactions: [
        conversion('expose-egg', 'extract', 'sealed_egg', 'egg_extract'),
        {id: 'bind-fixative', after: 'steep', reactants: {egg_extract: 1, rose_oil: 1}, products: {fixative: 2}},
    ],
    outputs: [
        effect('fixation', 'oral', 'fixative', 120),
        effect('treacle', 'oral', 'treacle', 100),
        effect('hysteria', 'oral', 'alihotsy', 100),
        effect('viscosity', 'assay', 'thickener', 100),
    ],
});

const cyoriaCatalogue = defineCatalogue({
    id: 'book.mol.apothecary.materials', revision: 1, tags: [],
    axes: fractions('unbroken_leaf', 'leaf_extract', 'oil', 'soothing', 'waste'),
    materials: [
        material('water', 'Water'),
        material('leaf', 'Cyorian balm leaf', {unbroken_leaf: 600}),
        material('pressed_extract', 'Pressed balm extract', {leaf_extract: 600}),
        material('fine_extract', 'Fine-mesh balm extract', {leaf_extract: 190}),
        material('oil', 'Apothecary oil', {oil: 500}),
    ],
});
const cyoriaLaw = defineCraftLaw({
    id: 'book.mol.apothecary', revision: 1, catalogue: cyoriaCatalogue, carrier: 'Cyorian preparation',
    ops: [op('extract', 'Grind and press'), op('steep', 'Warm in a bath'), op('stir', 'Stir the salve')],
    reactions: [
        conversion('press-leaf', 'extract', 'unbroken_leaf', 'leaf_extract'),
        conversion('raw-leaf-degrades', 'steep', 'unbroken_leaf', 'waste'),
        {id: 'suspend-in-oil', after: 'stir', reactants: {leaf_extract: 1, oil: 1}, products: {soothing: 2}},
    ],
    outputs: [effect('soothing', 'topical', 'soothing', 100)],
});

const hogwartsRoom = {
    title: 'Hogwarts potioneering',
    ashwinder: true,
    law: hogwartsLaw,
    lining: definePotionLining({id: 'book.hp.practice-lining', tracer: 'blue_tracer', label: 'Blue tracer',
        partsPerMeasure: 12, retainPermille: 500, releasePerVolume: 1, capacity: 99990,
        volumePerMeasure: 10, washMinutes: 3}),
    sources: [
        {material: 'water', label: 'Draw water', minutes: 1},
        {material: 'rose', label: 'Gather rose petals from the garden supplier', minutes: 6},
        {material: 'blue_tracer', label: 'Measure blue tracer from the practice cupboard', minutes: 2},
        {material: 'mucus', label: 'Collect mucus from the Flobberworm keeper', minutes: 8},
        {material: 'treacle', label: 'Collect treacle from the apothecary', minutes: 8},
        {material: 'alihotsy', label: 'Collect an Alihotsy leaf from the apothecary', minutes: 8},
    ],
    operationMinutes: {extract: 4, steep: 8, stir: 2},
    outcomes: {
        fixation: {route: 'oral', label: 'Love Potion fixation', subjects: ['The greenhouse', 'The library'],
            onset: 'The Love Potion takes hold. Your thoughts keep returning to'},
        treacle: {route: 'oral', label: 'Alihotsy relief', clears: 'hysteria'},
        hysteria: {route: 'oral', label: 'Alihotsy hysteria'},
        viscosity: {route: 'assay', label: 'Thickening'},
    },
    evidence: {
        frozen_egg: ['HPPE171', 'HPPE172', 'HPPE173'],
        rose: ['https://www.hp-lexicon.org/magic/love-potion/'],
        mucus: ['HPPE183'],
        treacle: ['HPPE184'],
        alihotsy: ['HPPE184'],
        fixation: ['B6:3067', 'https://www.hp-lexicon.org/magic/love-potion/'],
    },
};

export const potionWorkingWorlds = Object.freeze({
    'book.hp.school.world': {...hogwartsRoom, location: 'book.hp.school.commons'},
    'book.hp.lead.world': {...hogwartsRoom, location: 'book.hp.lead.school_hall'},
    'book.mol.cyoria': {
        title: 'Cyoria apothecary',
        location: MOL_LOCATIONS.workshop,
        law: cyoriaLaw,
        skinTrial: {strength: 20, minutes: 90},
        separation: {
            input: 'leaf', sourceAxis: 'unbroken_leaf', axis: 'leaf_extract', fee: 1, residue: 400,
            retainedLiquidPerCapacity: 2,
            defaultMesh: 'coarse',
            meshes: {
                coarse: {label: 'Coarse mesh', liquid: 'pressed_extract'},
                fine: {label: 'Fine mesh', liquid: 'fine_extract'},
            },
            cloth: {capacity: 400, fee: 1},
            drainMinutes: 4,
        },
        sources: [
            {material: 'water', label: 'Draw water', minutes: 1},
            {material: 'leaf', label: 'Pick up balm leaves from the supplier', minutes: 5},
            {material: 'oil', label: 'Collect apothecary oil', minutes: 5},
        ],
        operationMinutes: {extract: 5, steep: 6, stir: 3},
        outcomes: {soothing: {route: 'topical', label: 'Soothing salve', clears: 'sore_skin'}},
        evidence: {alchemy: ['MoL ch7 ¶160', 'MoL ch9 ¶80', 'MoL ch84 ¶78']},
    },
});
