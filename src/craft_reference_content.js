// ORIGINAL Village method objects (G1). Content only: engine behavior lives in
// craft_reference.js. A reference is an ordinary carried item keyed by id; its
// recipe is frozen into the crafting owner the first time one is taken (MR3).
import {frontierCatalogue as catalogue, frontierBrewLaw as law} from './craft_content_frontier.js';
import {defineRecipe} from './craft_recipes.js';

export const REFERENCE_CARRIER = 'Craft reference';
export const referenceKey = id => JSON.stringify({id: REFERENCE_CARRIER, ref: id});
export const referenceIdOf = key => { try { const k = JSON.parse(key); return k.id === REFERENCE_CARRIER ? k.ref : null; } catch { return null; } };

export const SALT_STEEP = defineRecipe(catalogue, {
    id: 'village.salt-steep', revision: 1, name: 'Salt-and-herb steep', law: law.ref, station: null,
    slots: [{id: 'salt', role: 'base', select: {tags: {all: ['salt']}}, qty: [1, 3]}, {id: 'herb', role: 'active', select: {tags: {all: ['herb']}}, qty: [1, 3]}],
    process: [{op: 'steep', levels: [1, 3]}],
    origin: {label: 'ORIGINAL', note: 'Village shelf method'}});

// default (AD5 dial): shelf copies are free and unlimited in the prototype; a
// world or shop may price or ration them. Training grants Literacy XP, which the
// native skill owner already consumes.
export const REFERENCES = Object.freeze({
    'village.method-book': {id: 'village.method-book', kind: 'book', mode: 'access', recipe: SALT_STEEP.id, name: 'Village method book',
        blurb: 'Lets you follow the salt-and-herb steep while you carry it. Lose it and the method goes with it.'},
    'village.method-disk': {id: 'village.method-disk', kind: 'disk', mode: 'learn', recipe: SALT_STEEP.id, name: 'Village method slate',
        blurb: 'Study it to learn the salt-and-herb steep for good. The slate is used up.'},
    'village.primer': {id: 'village.primer', kind: 'book', mode: 'training', grant: {kind: 'skill', id: 'Literacy', points: 30}, name: 'Village reading primer',
        blurb: 'Reading it once teaches you a little. Reading it again teaches nothing new.'},
});
export const REFERENCE_SPECS = Object.values(REFERENCES).map(({name, blurb, ...spec}) => spec);
