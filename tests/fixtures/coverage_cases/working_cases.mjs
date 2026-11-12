// Working cases for the generic runner (E9, proposal). Plain data only (shape: scripts/coverage_report.mjs header).
// The spell words come from the Hogwarts spellbook rows and the blade from the original workshop pack; the
// amounts, the effort prices and the bound holders are authored fixture data.
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../../../src/spell_pack_hogwarts.js';
import {sentenceFromIntent} from '../../../src/spell_effects.js';
import {steelPack} from '../process_craft_packs.js';

const at = id => ({shape: 'holder', id});
const spoken = form => { const r = HP_SPELL_ROWS.find(row => row.forms.includes(form)); return sentenceFromIntent({intent: r.intent, target: r.target,
    execution: r.execution, carrier: HP_SPELL_WORLD.carrier, cost: HP_SPELL_WORLD.cost}); };
const hurt = sentenceFromIntent({intent: 'hurt', target: 'creature', execution: 'instant', carrier: HP_SPELL_WORLD.carrier, cost: HP_SPELL_WORLD.cost});
// Effort is counted in the world's stamina energy; a caster who is short pays the rest in vitality.
const effort = {accounts: {stamina: {quantity: 'energy:stamina', fault: {id: 'overdrawn', cause: 'The rest of the casting comes out of the body.',
    effects: [{sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'pattern', cost: 'stored', limits: []},
        details: {target: at('$payer')}, per: {num: 1, den: 1}}]}}}};
const duel = {clock: 0, holders: [
    {id: 'platform', kind: 'place'},
    {id: 'duellist', kind: 'body', place: 'platform', as: ['self', 'creature'], quantities: {vitality: 20, 'energy:stamina': 5}},
    {id: 'rival', kind: 'body', place: 'platform', as: ['creature'], quantities: {vitality: 20, 'energy:stamina': 9}}]};
const strike = (payer, target, cost) => ({family: 'spell', payer, spells: [{sentence: hurt, target: {id: target}, details: {target: at(target), amount: 6, cost}}]});

const S = steelPack.steps;
const things = Object.fromEntries([steelPack.piece, ...Object.values(steelPack.media), ...Object.values(steelPack.tools)].map(t => [`${t.kind}:${t.id}`, t]));

const cases = {
    // The Shield Charm as a working: it costs effort, holds for its minutes, and the same strike lands once it has run out.
    'shield-then-strike': {
        world: duel, engine: {host: {costs: effort}},
        timeline: [
            {id: 'shield', working: {family: 'spell', payer: 'duellist', spells: [{sentence: spoken('Protego'), target: {id: 'duellist'}, details: {target: at('duellist'), minutes: 10, cost: 3}}]},
                expect: [{holder: 'duellist', quantity: 'energy:stamina', direction: 'down', amount: 3}]},
            {id: 'struck-under-shield', working: strike('rival', 'duellist', 2),
                expect: [{holder: 'duellist', quantity: 'vitality', direction: 'unchanged'}, {holder: 'rival', quantity: 'energy:stamina', direction: 'down', amount: 2}]},
            {id: 'shield-runs-out', advanceTo: 11},
            {id: 'struck-open', working: strike('rival', 'duellist', 2), expect: [{holder: 'duellist', quantity: 'vitality', direction: 'down', amount: 6}]},
        ],
        expect: [{holder: 'duellist', quantity: 'vitality', direction: 'down', to: 14}, {holder: 'rival', quantity: 'energy:stamina', direction: 'down', to: 5}],
    },
    // A caster with too little effort is not refused: the spell lands and the shortfall is taken from the body.
    'overdrawn-strike': {
        world: duel, engine: {host: {costs: effort}},
        working: strike('duellist', 'rival', 8),
        expect: [{holder: 'rival', quantity: 'vitality', direction: 'down', amount: 6}, {holder: 'duellist', quantity: 'energy:stamina', direction: 'down', to: 0},
            {holder: 'duellist', quantity: 'vitality', direction: 'down', amount: 3}],
    },
    // The tempered blade: four exposure steps that take 56 minutes, settled by the engine clock, with fuel debited by the minute.
    'tempered-blade': {
        world: {clock: 0, holders: [{id: 'smithy', kind: 'place'}, {id: 'sample', kind: 'thing', place: 'smithy', as: ['piece']},
            {id: 'forge', kind: 'thing', place: 'smithy', as: ['medium'], quantities: {fuel: 40}}]},
        engine: {shared: {quantities: [{id: 'fuel', unit: 'measure', min: 0, max: 1000}], properties: [{id: 'hardness', type: 'level'}, {id: 'toughness', type: 'level'}]},
            host: {things, costs: {accounts: {fuel: {quantity: 'fuel'}}}}},
        timeline: [
            {id: 'begin', working: {family: 'process', id: 'blade', bindings: {piece: {kind: 'piece', id: 'sample'}, forge: {kind: 'medium', id: 'forge'},
                hammer: {kind: 'tool', id: 'hammer'}, water: {kind: 'medium', id: 'water'}, oven: {kind: 'medium', id: 'oven'}},
            method: {id: steelPack.id, revision: steelPack.revision, rows: steelPack.rows, projection: steelPack.projection, steps: [
                {...S.heat, options: {costs: [{kind: 'fuel', perMinute: 2}]}}, {...S.forge, options: {costs: [{kind: 'fuel', perMinute: 2}]}}, S.quench, S.temper]}},
            expect: [{holder: 'sample', property: 'hardness', direction: 'unchanged'}]},
            {id: 'forged', advanceTo: 13, expect: [{holder: 'forge', quantity: 'fuel', direction: 'down', amount: 26}, {holder: 'sample', property: 'hardness', direction: 'unchanged'}]},
            {id: 'tempered', advanceTo: 56, expect: [{holder: 'sample', property: 'hardness', direction: 'changed', to: 77}]},
        ],
        expect: [{holder: 'sample', property: 'hardness', direction: 'changed', to: 77}, {holder: 'sample', property: 'toughness', direction: 'changed', to: 77},
            {holder: 'forge', quantity: 'fuel', direction: 'down', to: 14}],
    },
    // A stored ward laid on a door fires by its own clock once the engine reaches the minute.
    'ward-fires': {
        world: {clock: 0, holders: [{id: 'cellar', kind: 'place', quantities: {temperature: 8}}, {id: 'door', kind: 'thing', place: 'cellar'}]},
        timeline: [
            {id: 'cellar.ward', by: 'warder', store: {carrier: 'door', pulse: 5, mode: 'repeating', trigger: {kind: 'time', every: 10}, charge: {now: 4, max: 4, per: 2},
                effects: [{sentence: {verb: 'add', object: 'heat', target: 'bound', time: 'instant', carrier: 'pattern', cost: 'stored', limits: []}, details: {target: at('$place'), amount: 3}}]},
            expect: [{holder: 'cellar', quantity: 'temperature', direction: 'unchanged'}]},
            {id: 'first-pulse', advanceTo: 10, expect: [{holder: 'cellar', quantity: 'temperature', direction: 'up', amount: 3}]},
            {id: 'spent', advanceTo: 35, expect: [{holder: 'cellar', quantity: 'temperature', direction: 'up', amount: 3}]},
        ],
        expect: [{holder: 'cellar', quantity: 'temperature', direction: 'up', to: 14}],
    },
    // A step that fails is reported with its reason; a family the runner does not know is named.
    'blocked-strike': {world: {...duel, holders: duel.holders.filter(h => h.id !== 'rival')},
        working: {family: 'spell', spells: [{sentence: hurt, target: {id: 'rival'}}]}, expect: [{holder: 'duellist', quantity: 'vitality', direction: 'down'}]},
    'unknown-family': {world: duel, working: {family: 'alchemy'}, expect: [{holder: 'duellist', quantity: 'vitality', direction: 'down'}]},
};

export function coverageCase(id) {
    if (!cases[id]) throw new Error(`no case ${id}`);
    return structuredClone(cases[id]);
}
