// Native-item bridge: maps plain game items (src/items.js item_templates keys)
// to catalogue materials with physical, functional and symbolic tag layers.
// Pure data and lookups: no state, saves or DOM. Native rendering recipes read it.
// Symbolic tags are proposals (SYMBOLIC_PROPOSALS), never accepted design.
import {defineCatalogue, materialTags, matchesQuery, validateMaterialQuery, materialPropertySupport} from './craft_materials.js';
import {compareCodePoints} from './gen_kit.js';

const tag = (id, kind, parents = []) => ({id, kind, parents, revision: 1});
const physical = [['plant'], ['animal'], ['mineral'], ['pelt', 'animal'], ['wood', 'plant'], ['oil'], ['fat', 'animal', 'oil'], ['meat', 'animal'],
    ['herb', 'plant'], ['bone', 'animal'], ['fiber'], ['resin', 'plant'], ['shell', 'animal'], ['ash', 'mineral'], ['char'], ['bark', 'plant'],
    ['berry', 'plant'], ['leaf', 'plant'], ['sinew', 'animal', 'fiber']];
const functional = ['binder', 'fuel', 'solvent', 'preservative', 'padding', 'nutrient', 'tinder', 'astringent', 'abrasive', 'insulator', 'flavoring'];
// Proposal layer: obvious, low-stakes associations only.
export const SYMBOLIC_PROPOSALS = Object.freeze({
    'Oneberry': ['vital'], 'Wild garlic': ['warding'], 'Potash': ['cleansing'], 'Sulfur': ['fiery'], 'Silver thistle': ['warding'],
    'Charcoal': ['cleansing'], 'Bonemeal': ['deathly'], 'Monster bone': ['deathly'], 'Weak monster bone': ['deathly'],
});
const symbolic = ['vital', 'warding', 'cleansing', 'fiery', 'deathly'];
export const NATIVE_TAGS = Object.freeze({
    physical: physical.map(([id]) => id), functional: [...functional], symbolic: [...symbolic]});

// [item id, physical, functional, properties]
const ROWS = [
    ['Rat pelt', ['pelt'], ['padding'], {fiber: 300, protein: 500, hardness: 10}],
    ['Wolf pelt', ['pelt'], ['padding', 'insulator'], {fiber: 350, protein: 500, hardness: 20}],
    ['Boar hide', ['pelt'], ['padding'], {fiber: 400, protein: 450, hardness: 40}],
    ['Boar meat', ['meat'], ['nutrient'], {protein: 600, oil: 100}],
    ['Goat meat', ['meat'], ['nutrient'], {protein: 600, oil: 80}],
    ['Crab meat', ['meat'], ['nutrient'], {protein: 550, oil: 30}],
    ['Frog meat', ['meat'], ['nutrient'], {protein: 500, oil: 30}],
    ['Weak monster bone', ['bone'], ['abrasive'], {ash: 450, hardness: 55}],
    ['Monster bone', ['bone'], ['abrasive'], {ash: 500, hardness: 70}],
    ['Bonemeal', ['bone'], ['abrasive', 'binder'], {ash: 600, hardness: 15}],
    ['Turtle shell', ['shell'], ['abrasive'], {ash: 400, hardness: 80}],
    ['Coal', ['mineral'], ['fuel'], {ash: 150, hardness: 45}],
    ['Charcoal', ['char'], ['fuel', 'tinder'], {ash: 100, hardness: 20}],
    ['Rough wood log', ['wood'], ['fuel', 'tinder'], {fiber: 600, hardness: 35}],
    ['Wood log', ['wood'], ['fuel'], {fiber: 650, hardness: 40}],
    ['Ash wood log', ['wood'], ['fuel'], {fiber: 650, hardness: 55}],
    ['Hickory wood log', ['wood'], ['fuel'], {fiber: 700, hardness: 65}],
    ['Tree sap', ['resin'], ['binder', 'preservative'], {resin: 700}],
    ['Animal fat', ['fat'], ['fuel', 'binder', 'preservative', 'solvent'], {oil: 800}],
    ['Lamp oil', ['oil'], ['fuel', 'solvent'], {oil: 900}],
    ['Sinew', ['sinew'], ['binder'], {fiber: 500, protein: 400, hardness: 25}],
    ['Wool', ['fiber'], ['padding', 'insulator'], {fiber: 700, hardness: 5}],
    ['Flax', ['plant', 'fiber'], ['binder'], {fiber: 650, hardness: 10}],
    ['Meadow hay', ['plant', 'fiber'], ['padding', 'tinder'], {fiber: 600, hardness: 5}],
    ['Belmart leaf', ['herb', 'leaf'], [], {fiber: 200}],
    ['Golmoon leaf', ['herb', 'leaf'], [], {fiber: 200}],
    ['Oneberry', ['berry'], ['nutrient'], {fiber: 100}],
    ['Silver thistle', ['herb'], [], {fiber: 250}],
    ['Cooking herbs', ['herb'], ['flavoring', 'preservative'], {fiber: 200}],
    ['Wild garlic', ['herb'], ['flavoring', 'preservative'], {fiber: 150, oil: 20}],
    ['Willow bark', ['bark'], ['astringent'], {fiber: 400, resin: 80, hardness: 15}],
    ['Potash', ['ash'], ['solvent', 'abrasive'], {ash: 800}],
    ['Sulfur', ['mineral'], ['fuel', 'preservative'], {hardness: 15}],
];
export const NATIVE_ITEM_IDS = Object.freeze(ROWS.map(row => row[0]));

export const nativeCatalogue = defineCatalogue({
    id: 'base.native', revision: 2, basis: 1000,
    axes: [
        {id: 'oil', kind: 'fraction', label: 'oil'}, {id: 'fiber', kind: 'fraction', label: 'fiber'},
        {id: 'protein', kind: 'fraction', label: 'protein'}, {id: 'resin', kind: 'fraction', label: 'resin'},
        {id: 'ash', kind: 'fraction', label: 'ash or mineral'}, {id: 'hardness', kind: 'scalar', min: 0, max: 100, unit: 'base.native:hardness-index', combination: 'unmixed'},
    ],
    tags: [...physical.map(([id, ...parents]) => tag(id, 'physical', parents)), ...functional.map(id => tag(id, 'functional')),
        ...symbolic.map(id => tag(id, 'symbolic_proposal'))],
    materials: ROWS.map(([id, p, f, properties]) => ({id, revision: id === 'Charcoal' ? 2 : 1, name: id, tags: [...p, ...f, ...(SYMBOLIC_PROPOSALS[id] ?? [])], properties})),
});

// Frozen catalogue material for a native item id, or null.
export const nativeMaterialFor = itemId => Object.hasOwn(nativeCatalogue.materials, itemId) ? nativeCatalogue.materials[itemId] : null;

// Reverse lookup: item ids whose expanded tags match `query` (null matches all)
// and whose properties meet every `min` (>=) and `max` (<=) bound. Sorted by id.
export function nativeItemsMatching(query, {min = {}, max = {}, units = {}} = {}) {
    validateMaterialQuery(nativeCatalogue, query);
    for(const [axis, value] of [...Object.entries(min), ...Object.entries(max)]) {
        if(!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid bound for ${axis}.`);
    }
    for(const axis of Object.keys(units)) {
        if(!Object.hasOwn(min, axis) && !Object.hasOwn(max, axis)) throw new Error(`Unit without bound: ${axis}.`);
    }
    for(const axis of Object.keys({...min, ...max})) {
        const def = nativeCatalogue.axes[axis];
        if(!def) throw new Error(`Unknown axis: ${axis}.`);
        if(units[axis] !== undefined && units[axis] !== def.unit) throw new Error(`Incompatible unit for ${axis}: expected ${def.unit}.`);
    }
    return Object.values(nativeCatalogue.materials)
        .filter(m => matchesQuery(query, materialTags(nativeCatalogue, m)) &&
            Object.entries(min).every(([a, v]) => materialPropertySupport(nativeCatalogue, m, a, {unit: units[a]}).value >= v) &&
            Object.entries(max).every(([a, v]) => materialPropertySupport(nativeCatalogue, m, a, {unit: units[a]}).value <= v))
        .map(m => m.id).sort(compareCodePoints);
}

// Authoring companion, not character knowledge or a cross-world equivalence.
// Current substance and origin are separate: this edge grants no wood tags.
export const NATIVE_MATERIAL_EVIDENCE = Object.freeze({
    catalogue: nativeCatalogue.ref, world: 'base.frontier', status: 'ORIGINAL',
    locator: 'src/native_material_catalogue.js:ROWS',
    properties: 'Authored game approximations; omitted axes use complete-profile defaults, not measurements.',
    symbolism: 'PROPOSED associations, no active effect or ingredient equivalence.',
    relations: Object.freeze([Object.freeze({subject: 'Charcoal', relation: 'derived-from', object: 'wood', status: 'ORIGINAL'})]),
});
