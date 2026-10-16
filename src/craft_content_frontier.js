// Example content pack for the crafting engine: original, fictional frontier
// herbalism. Everything here is data; no engine code names these materials.
// Not wired into live gameplay yet (see docs/CRAFTING_ENGINE.md).
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw} from './craft_resolver.js';
import {defineSourceTable} from './craft_sources.js';

const tag = (id, kind, parents = []) => ({id, kind, parents, revision: 1});
export const frontierCatalogue = defineCatalogue({
    id: 'frontier.herbal', revision: 1, basis: 1000,
    axes: [
        {id: 'restore', kind: 'fraction', label: 'restorative sap'},
        {id: 'vigor', kind: 'fraction', label: 'bracing oil'},
        {id: 'toxin', kind: 'fraction', label: 'bitter toxin'},
        {id: 'ash', kind: 'fraction', label: 'spent ash'},
        {id: 'hardness', kind: 'scalar', min: 0, max: 100},
        {id: 'glow', kind: 'scalar', min: 0, max: 100, hidden: true},
    ],
    tags: [
        tag('plant', 'origin'), tag('herb', 'origin', ['plant']), tag('root', 'origin', ['plant']), tag('mineral', 'origin'),
        tag('salt', 'origin', ['mineral']), tag('ore', 'origin', ['mineral']), tag('liquid', 'phase'), tag('solvent', 'use', ['liquid']),
        tag('alkaline', 'property'), tag('wet', 'property'), tag('restorative', 'derived'), tag('toxic', 'derived'), tag('bracing', 'derived'),
        tag('hearth', 'station'), tag('mortar', 'station'), tag('sickle', 'tool'), tag('pick', 'tool'), tag('spring', 'season'),
        tag('meadow', 'place'), tag('riverbank', 'place'), tag('hills', 'place'), tag('village', 'place'),
        {id: 'moonlit', kind: 'derived', parents: [], revision: 1, visible: 'hidden'},
    ],
    families: [
        {id: 'reedherb', revision: 1, tags: ['herb', 'wet'], phase: 'solid', weight: 3,
            ranges: {restore: [60, 160], toxin: [0, 40], glow: [0, 30]}, correlations: [{from: 'restore', to: 'toxin', per: 300}],
            names: {prefix: ['Grey', 'Silver', 'Marsh', 'Low'], root: ['reed', 'bellleaf', 'rushwort']}},
        {id: 'bitterroot', revision: 1, tags: ['root'], phase: 'solid', weight: 2,
            ranges: {vigor: [50, 140], toxin: [5, 60], hardness: [10, 40]},
            names: {prefix: ['Red', 'Knotted', 'Ember'], root: ['root', 'tuber', 'seed']}},
        {id: 'riversalt', revision: 1, tags: ['salt', 'alkaline'], phase: 'powder', weight: 1,
            ranges: {ash: [100, 300], hardness: [20, 60]},
            names: {prefix: ['Mellow', 'Bank', 'Chalk'], root: ['salt', 'crust']}},
        {id: 'hillore', revision: 1, tags: ['ore'], phase: 'solid', weight: 1,
            ranges: {ash: [300, 600], hardness: [50, 95], glow: [0, 80]}, correlations: [{from: 'hardness', to: 'glow', per: 400}],
            names: {prefix: ['Dull', 'Banded', 'Star'], root: ['iron', 'stone', 'nodule']}},
    ],
    materials: [
        {id: 'Spring water', revision: 1, tags: ['solvent'], phase: 'liquid', properties: {}},
        {id: 'Lime chalk', revision: 1, tags: ['mineral', 'alkaline'], phase: 'powder', properties: {ash: 250, hardness: 30}},
    ],
});

export const frontierBrewLaw = defineCraftLaw({
    id: 'frontier.brew', revision: 1, catalogue: frontierCatalogue, carrier: 'Herbal vial',
    ops: [
        {id: 'steep', label: 'Steep', levels: [1, 3], availability: {restore: 700, vigor: 1000, toxin: 500}},
        {id: 'boil', label: 'Boil', station: 'hearth', levels: [1, 3], availability: {restore: 1000, vigor: 600, toxin: 1500},
            converts: [{from: 'restore', to: 'ash', permille: 100, perLevel: 150}]},
        {id: 'grind', label: 'Grind', station: 'mortar', levels: [1, 2], availability: {vigor: 1300, restore: 1100}},
    ],
    reactions: [
        // A specific neutralizer: alkaline catalyst binds most, not all, toxin (audit P4).
        {id: 'bind-toxin', catalyst: 'alkaline', limit: 700, reactants: {toxin: 1}, products: {ash: 1}},
        {id: 'scorch', after: 'boil', limit: 200, reactants: {vigor: 1}, products: {ash: 1}},
    ],
    outputs: [
        {id: 'heal', route: 'oral', effect: 'health', axis: 'restore', per: 200},
        {id: 'stamina', route: 'oral', effect: 'stamina', axis: 'vigor', per: 150},
        {id: 'sicken', route: 'oral', effect: 'poison', axis: 'toxin', per: 300},
        {id: 'coat', route: 'coat', effect: 'poison', axis: 'toxin', per: 600},
        {id: 'shine', route: 'carry', effect: 'light', axis: 'glow', mode: 'scalar', per: 1000},
    ],
    tagLaws: [{tag: 'restorative', axis: 'restore', min: 30}, {tag: 'toxic', axis: 'toxin', min: 15},
        {tag: 'bracing', axis: 'vigor', min: 30}, {tag: 'moonlit', axis: 'glow', min: 10}],
});

export const frontierSources = defineSourceTable(frontierCatalogue, {
    id: 'frontier.sources', revision: 1,
    sources: [
        {id: 'reed-patch', name: 'Reed patch', kind: 'gather', at: {any: ['meadow', 'riverbank']}, capacity: 12, regenPerDay: 6,
            variants: {reedherb: 2}, quality: [30, 70],
            yields: [{family: 'reedherb', weight: 6, qty: [1, 3]}, {id: 'cut-reeds', family: 'reedherb', weight: 3, qty: [2, 4], tool: 'sickle'},
                {id: 'dawn-dew', material: 'Spring water', weight: 2, hours: [4, 8]}],
            rare: {permille: 40, every: 25, yields: [{family: 'reedherb', qty: [1, 1], season: 'spring'}, {material: 'Lime chalk', qty: [1, 1]}]}},
        {id: 'root-bed', name: 'Root bed', kind: 'gather', at: 'meadow', capacity: 6, regenPerDay: 2, variants: {bitterroot: 2},
            yields: [{family: 'bitterroot', qty: [1, 2], skill: 1}]},
        {id: 'salt-crust', name: 'Salt crust', kind: 'gather', at: 'riverbank', capacity: 20, regenPerDay: 10, variants: {riversalt: 1},
            yields: [{family: 'riversalt', qty: [1, 4]}]},
        {id: 'ore-seam', name: 'Ore seam', kind: 'mine', at: 'hills', capacity: 30, regenPerDay: 0, variants: {hillore: 3}, quality: [20, 50],
            yields: [{family: 'hillore', qty: [1, 2], tool: 'pick'}]},
    ],
});

export const tonicGrammar = Object.freeze({
    id: 'frontier.tonic', revision: 1, name: 'Frontier tonic', route: 'oral',
    slots: [
        {id: 'herb', role: 'base', pool: 'herb', select: 'property', qty: [1, 3]},
        {id: 'root', role: 'active', pool: 'root', select: 'tags', qty: [1, 2]},
        {id: 'water', role: 'solvent', pool: 'solvent', select: 'material', qty: [1, 2]},
    ],
    process: {choices: [{op: 'steep', levels: [1, 3]}, {op: 'boil', levels: [1, 2]}], steps: [1, 2]},
    station: 'hearth',
    fallback: {
        spec: {id: 'frontier.tonic.fallback', revision: 1, name: 'Plain tonic', law: 'frontier.brew@1',
            slots: [{id: 'water', role: 'solvent', select: {material: 'Spring water'}, qty: [1, 1]},
                {id: 'chalk', role: 'catalyst', select: {material: 'Lime chalk'}, qty: [1, 1]}],
            process: [{op: 'steep', levels: [1, 1]}]},
        witness: {inputs: [], process: [{op: 'steep', level: 1}]},
    },
});
