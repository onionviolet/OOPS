// Village (base.frontier) fabrication pack: rows only, read by the shared
// law in craft_assembly.js. Original YAIR accounting choices, not source
// measurements (procedural-crafting checkpoint, 2026-11-11): 100 forge units
// per ingot, 360 in an axe head, 20 per offcut, 20 lost as scale; 25 units
// per ore, 100 per ingot, 25 per slag; 3 cut units per log; 2 wood units per
// medium handle. Arrangement capacities are fixture numbers for the paper
// cases FG4-A and FG4-B in the crafting considerations.
export const FORGE_OFFCUT = 'Mixed forge offcuts';
export const IRON_SLAG = 'Iron smelting slag';

const heads = {'Low quality iron ingot': 'Cheap iron axe head', 'Iron ingot': 'Iron axe head', 'Steel ingot': 'Steel axe head'};
const logs = {'Rough wood log': 'Processed rough wood', 'Wood log': 'Processed wood',
    'Ash wood log': 'Processed ash wood', 'Hickory wood log': 'Processed hickory wood'};
const handles = {'Processed rough wood': 'Simple wooden medium handle', 'Processed wood': 'Wooden medium handle',
    'Processed ash wood': 'Ash wood medium handle', 'Processed hickory wood': 'Hickory wood medium handle'};
const ores = {'Iron ore': 'Iron ingot', 'Low quality iron ore': 'Low quality iron ingot'};
const family = (ids, name) => Object.fromEntries(ids.map(id => [id, name]));

export const VILLAGE_FABRICATION = {
    id: 'f.village', revision: 1, world: 'base.frontier',
    families: {
        'Portable leatherworking kit': 'workshop-tool', 'Rat pelt': 'animal-hide', 'Rat tail': 'animal-tail',
        'Rat fang': 'animal-bone', 'Piece of wolf rat leather': 'animal-hide', 'Processed rat pelt': 'animal-hide',
        'Rat meat chunks': 'animal-food',
        ...family(Object.values(heads), 'axe-head'),
        ...family(Object.values(logs), 'handle-wood'),
        ...family(Object.values(handles), 'wooden-handle'),
        ...family(['Iron chopping axe', 'Steel chopping axe'], 'assembled-axe'),
        [FORGE_OFFCUT]: 'forge-offcut', 'Low quality iron ingot': 'reclaimed-iron', 'Iron ingot': 'smelted-iron',
        ...family(Object.keys(ores), 'iron-ore'), [IRON_SLAG]: 'iron-slag'
    },
    // Gathered lots carry their source vein, place and activity.
    gathered: [{ids: Object.keys(ores), process: 'mining.iron', revision: 1, source: 'iron-vein', family: 'iron-ore'}],
    processes: [
        {id: 'forge.axe_head', revision: 1, route: 'component', pool: true, unit: 'forge material unit',
            yields: heads, unitsPerInput: 100, product: {family: 'axe-head', unitsPerItem: 360},
            remainders: [{id: FORGE_OFFCUT, family: 'forge-offcut', unitsPerItem: 20, per: 'batches'}],
            loss: {reason: 'forge scale', per: 'batches', amount: 20},
            parameters: {headUnits: 360, offcutUnits: 20, scaleUnits: 20},
            mismatch: 'Axe-head stock must share the selected metal grade.'},
        {id: 'woodworking.medium-handle', revision: 1, route: 'component', pool: true, unit: 'wood stock unit',
            yields: handles, unitsPerInput: 1, product: {family: 'wooden-handle', unitsPerItem: 2},
            mismatch: 'Medium handle stock must share the selected wood grade.'},
        {id: 'woodworking.prepare-log', revision: 1, route: 'recipe', unit: 'wood stock unit',
            yields: logs, unitsPerInput: 3, product: {family: 'handle-wood', unitsPerItem: 1},
            loss: {reason: 'unrecovered cut stock', per: 'balance'},
            parameters: {yield: 'count', unrecovered: 'loss'},
            mismatch: 'Processed wood needs its selected log grade.'},
        {id: 'smelting.iron', revision: 1, route: 'attempts', supports: 'consumed', unit: 'forge material unit',
            yields: ores, unitsPerInput: 25, product: {family: 'smelted-iron', unitsPerItem: 100},
            remainders: [{id: IRON_SLAG, family: 'iron-slag', unitsPerItem: 25, per: 'attempts'}],
            loss: {reason: 'metal trapped in failed reduction', per: 'failed', amount: 100},
            parameters: {attempts: 'attempts', ingots: 'count', slag: 'attempts', lostMetalUnits: 'loss'},
            invalid: 'Invalid iron smelting yield.'}
    ],
    // FBG4-FBG6. Parts offer interface tags, joins name what each side needs,
    // and an arrangement says which elements carry demand to which support.
    parts: {
        'Iron axe head': {interfaces: ['eye.medium', 'edge'], capacity: 40},
        'Steel axe head': {interfaces: ['eye.medium', 'edge'], capacity: 55},
        'Cheap iron axe head': {interfaces: ['eye.medium', 'edge'], capacity: 25},
        'Simple wooden medium handle': {interfaces: ['tang.medium'], capacity: 18},
        'Wooden medium handle': {interfaces: ['tang.medium'], capacity: 24},
        'Ash wood medium handle': {interfaces: ['tang.medium'], capacity: 32},
        'Hickory wood medium handle': {interfaces: ['tang.medium'], capacity: 36}
    },
    joins: {
        'axe.hafting': {method: 'wedged socket', needs: {head: ['eye.medium'], handle: ['tang.medium']}, capacity: 30}
    },
    arrangements: {
        'Iron chopping axe': {geometry: 'direct', joins: ['axe.hafting'], paths: {strike: ['head', 'axe.hafting', 'handle']},
            parts: {head: 'Iron axe head', handle: 'medium handle'}},
        'Steel chopping axe': {geometry: 'direct', joins: ['axe.hafting'], paths: {strike: ['head', 'axe.hafting', 'handle']},
            parts: {head: 'Steel axe head', handle: 'medium handle'}}
    }
};
