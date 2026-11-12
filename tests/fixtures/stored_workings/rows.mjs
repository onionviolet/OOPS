// Proposal pack rows for SW1-SW12. All calibration, clocks and prices live here.
import {WORLD_QUANTITIES as Q, WORLD_PROPERTIES as P} from '../../../src/world_quantities.js';
import {createEngineWorld} from '../../../src/engine_world.js';
import {THERMAL_REVISION, quoteThermalBatch} from '../../../src/craft_process_thermal.js';
import {brewBatchState} from '../../../src/world_substrate_packs/brew_steam.js';
import {defineRuneGrammar, readTalisman} from '../../../src/rune_grammar.js';
import {defineWorkingLaw, beginWorking} from '../../../src/kernel_working.js';
import {storeWorking} from '../../../src/stored_working.js';

export const n = {start: 0, pulse: 1, heldPulse: 2, end: 8, parts: [1, 3, 5, 8], reload: 4,
    vitality: 20, ink: 40, energy: 4, harm: 6, heal: 3, wardHeat: 2, initialHeat: 18,
    reservoir: 12, per: 2, decayEvery: 3, decayAmount: 1, strength: 5, stranger: 2,
    rate: 2, renewPrice: 3, recharge: 4, feedRate: 2, reachCost: 2,
    weakForce: 1, strongForce: 5, forceRate: 1, lowCharge: 1, half: 0.5,
    distantAmount: 4, max: 100, threshold: 52, startHumidity: 40, strikeTimes: [3, 7],
    bodyThreshold: 14, renewedAt: 2, secondTouch: 3};
const thermalLaw = {revision: THERMAL_REVISION, ambient: 20,
    extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
export const config = {packs: ['w.sky', 'b.brew_steam'], settings: {
    'b.brew_steam': {thermalLaw, steamPerMinute: 4,
        humidityFinish: {activeAmount: 100, maxHumidity: 95, dampResiduePercent: 50}},
}, shared: {quantities: Object.values(Q), properties: [...Object.values(P),
    {id: 'holder', type: 'label'}, {id: 'broken', type: 'flag'}, {id: 'lost', type: 'flag'}]}, dials: {chainCap: 2000}};
const quote = quoteThermalBatch({law: thermalLaw,
    vessel: {capacity: 100, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 2},
    maker: {tools: ['brazier', 'paddle'], competence: 4, workCapacity: 1000, fuelStock: 10000,
        heater: {maxTemperature: 150, maxConductance: 20, fuelPerSecond: 0.25}},
    program: {startTemperature: 20, sourceTemperature: 75, targetTemperature: 65, holdSeconds: 1848,
        heaterTool: 'brazier', agitationTool: 'paddle', agitationPerMass: 2, requiredCompetence: 2},
    load: {mass: 4, volume: 4, specificHeat: 2, containment: 1}});
export const sentence = (verb, object, time = 'instant') => ({verb, object, time, target: 'bound', carrier: 'pattern', cost: 'stored', limits: []});
export const effect = (verb, object, id, amount) => ({sentence: sentence(verb, object), details: {target: {shape: 'holder', id}, amount}});
export const harm = effect('remove', 'vitality', 'person', n.harm);
export const grammar = defineRuneGrammar({id: 'strip', revision: 1, runes: ['ember', 'breath', 'veil'],
    pairs: [{a: 'ember', b: 'breath', effect: 'warm', power: 4}],
    discord: {effect: 'rattle', power: 2, reason: 'The unmatched strokes shake the paper.'}, maxLength: 4, perRuneCost: 1});
export const runeWords = {warm: sentence('add', 'heat'), rattle: sentence('add', 'sound')};
export const stripReading = readTalisman(grammar, ['ember', 'breath', 'veil']);
export const stripEffects = Object.entries(stripReading.effects).map(([word, power]) => ({sentence: runeWords[word],
    details: {target: {shape: 'holder', id: '$place'}, amount: power}}));
export function engine() {
    return createEngineWorld({...config, clock: n.start, holders: [
        {id: 'room', kind: 'place', quantities: {temperature: n.initialHeat, noise: 0}},
        {id: 'yard', kind: 'place', quantities: {temperature: n.initialHeat}},
        {id: 'empty', kind: 'place', quantities: {humidity: n.startHumidity, temperature: n.initialHeat}},
        {id: 'person', kind: 'body', place: 'room', quantities: {vitality: n.vitality, 'energy:stamina': n.energy, 'stock:ink': n.ink}},
        {id: 'visitor', kind: 'body', place: 'yard', quantities: {vitality: n.vitality}, properties: {marks: ['pass']}},
        {id: 'paper', kind: 'thing', place: 'room', properties: {holder: 'person', material: 'paper'}},
        {id: 'batch', kind: 'thing', place: 'empty', tags: ['brew.batch'], state: {'b.brew_steam': brewBatchState(thermalLaw, quote)}},
    ]});
}
export const base = {carrier: 'room', pulse: n.pulse, mode: 'repeating', trigger: {kind: 'time', every: n.pulse},
    effects: [effect('add', 'heat', '$place', n.wardHeat)],
    charge: {now: n.reservoir, max: n.reservoir, per: n.per},
    recharge: {quantity: 'stock:ink', rate: n.rate}, renew: {quantity: 'stock:ink', price: n.renewPrice},
    strength: n.strength, strangerFactor: n.stranger};
export const make = (spec = {}, id = 'pattern', options = {}) => storeWorking({...base, ...spec}, {id, by: 'person', at: n.start, ...options});
export const rowSpecs = {
    strip: [{...base, carrier: 'paper', mode: 'once', actsFor: 'holder', trigger: {kind: 'touch'}, effects: stripEffects}],
    ward: [{...base, keys: ['pass'], decay: {every: n.decayEvery, amount: n.decayAmount},
        trigger: {kind: 'event', event: 'arrived', where: {place: '$place'}}},
    {...base, carrier: 'empty', decay: {every: n.decayEvery, amount: n.decayAmount},
        trigger: {kind: 'quantity', holder: '$place', quantity: 'humidity', op: '>=', value: n.threshold}}],
    draught: [{...base, carrier: 'person', mode: 'once',
        trigger: {kind: 'event', event: 'effect.remove', where: {'detail.target': '$carrier', 'detail.object': 'vitality'}},
        effects: [effect('add', 'vitality', '$carrier', n.heal)]},
    {...base, carrier: 'person', mode: 'once', trigger: {kind: 'quantity', holder: '$carrier', quantity: 'vitality', op: '<=', value: n.bodyThreshold},
        effects: [effect('add', 'vitality', '$carrier', n.heal)]}],
    held: [{...base, carrier: 'person', mode: 'held', pulse: n.heldPulse, trigger: {kind: 'time', every: n.heldPulse},
        charge: undefined, draw: {from: '$holder', quantity: 'energy:stamina', per: n.per},
        effects: [{sentence: sentence('block', 'vitality', 'sustained'), details: {target: {shape: 'holder', id: '$carrier'}, minutes: n.heldPulse}}]}],
};
export const rowRecords = row => rowSpecs[row].map((spec, i) => make(spec, `${row}.${i}`));
export const moveSchedule = [
    {at: 1, ops: [{op: 'move', holder: 'visitor', to: 'room'}]},
    {at: 2, ops: [{op: 'move', holder: 'visitor', to: 'yard'}, {op: 'property', holder: 'visitor', property: 'marks', value: []}]},
    {at: 3, ops: [{op: 'move', holder: 'visitor', to: 'room'}]},
    {at: 5, ops: [{op: 'move', holder: 'visitor', to: 'yard'}]},
    {at: 7, ops: [{op: 'move', holder: 'visitor', to: 'room'}]},
];
export const strikeLaw = defineWorkingLaw({id: 'strike', revision: 1,
    operations: {hit: {roles: {target: 'body'}, settle: () => ({ok: true, effects: [harm]})}}});
export const strikeMethod = {id: 'double', revision: 1, law: strikeLaw.ref, roles: {target: 'body'}, steps: n.strikeTimes.map((at, i) =>
    ({op: 'hit', bindings: {target: 'target'}, minutes: at - (n.strikeTimes[i - 1] ?? n.start)}))};
export const strikeWorking = () => beginWorking(strikeLaw, strikeMethod,
    {id: 'strikes', bindings: {target: {kind: 'body', id: 'person'}}, at: n.start});
export const expected = {stripHeat: 22, stripNoise: 2, wardHeat: 20, wardRepeatedHeat: 22, draughtVitality: 14,
    heldVitality: 14, heldPaid: 4, heldLapse: 6, stripRenewedHeat: 26, stripRenewedNoise: 4,
    scaledHeat: 19, weakHeat: 20, strongVitality: 8, distantHeat: 22};
