// Hogwarts brewing pack on the shared brew law (chat B; PTD1-PTD3, PTD5).
// The classroom Draught of Living Death as data: a Sopophorous bean whose
// preparation form decides how much juice it gives, freshness by storage, one
// reaction with the prepared base, a stirring pattern and two colour cues.
// Book 6 ch. 9 anchors the bean, crushing rather than cutting, the stirring
// direction and the colour changes (HPPE012 and the potion evidence README);
// every quantity, threshold and rate below is an original game dial.
import {deepFreeze} from '../basics.js';
import {BREW_LAW, brewMethod} from '../brew_law.js';
import {beginWorking, settleWorking} from '../kernel_working.js';

export const DRAUGHT_OF_LIVING_DEATH = Object.freeze({
    id: 'hp.brew.draught_of_living_death',
    evidence: ['HPPE012', 'B6 ch. 9'],
    // PTD1: how much juice each preparation frees from the bean (crush 2/3, slice 1/4).
    preparations: Object.freeze({crush: {from: 'bean', to: 'juice', num: 2, den: 3}, slice: {from: 'bean', to: 'juice', num: 1, den: 4}}),
    // PTD2: a stored bean dries by one unit a day sealed; open storage counts double.
    ageing: Object.freeze({constituent: 'bean', perDay: 1}),
    storageRate: Object.freeze({sealed: 1, open: 2}),
    reaction: Object.freeze({id: 'juice-reacts', reactants: {juice: 1, precursor: 1}, products: {intermediate: 2}}),
    // PTD3: counterclockwise is the run; breaking a run of seven settles eight, every eighth stroke settles two.
    stir: Object.freeze({run: 'L', reversal: {after: 7, from: 'intermediate', to: 'settled', amount: 8},
        cadence: {every: 8, from: 'intermediate', to: 'settled', amount: 2}}),
    // PTD5: what the brewer sees.
    cues: Object.freeze({afterAddition: {cue: 'Lilac', constituent: 'intermediate', atLeastPermille: 90, below: 'Below the lilac cue'},
        afterStirring: {cue: 'Pale pink', constituent: 'settled', atLeastPermille: 70, below: 'Below the pale pink cue'}}),
});

/** Run one classroom attempt through the kernel working on the brew law. */
export function brewDraughtOfLivingDeath({preparation, beanUnits, precursor, carrier, strokes, storage}) {
    const d = DRAUGHT_OF_LIVING_DEATH;
    const lots = {
        bean: {kind: 'lot', id: 'lot.bean', material: 'bean', amount: beanUnits, properties: {bean: 1000},
            spent: storage.days * 1440, storageRate: d.storageRate[storage.vessel], ageing: d.ageing},
        precursor: {kind: 'lot', id: 'lot.precursor', material: 'precursor', amount: precursor, properties: {precursor: 1000}},
        carrier: {kind: 'lot', id: 'lot.carrier', material: 'carrier', amount: carrier, properties: {}},
    };
    const vessel = {kind: 'vessel', id: 'class.cauldron', place: 'class', retainPermille: 0, closure: 'open'};
    const at = {vessel: 'vessel'};
    const method = {id: d.id, revision: 1, law: BREW_LAW.ref, roles: {vessel: 'vessel', bean: 'lot', precursor: 'lot', carrier: 'lot'}, steps: [
        {op: 'prepare', bindings: {...at, lot: 'bean'}, options: {how: preparation, changes: [d.preparations[preparation]], admitOnly: ['juice']}},
        {op: 'admit', bindings: {...at, lot: 'carrier'}}, {op: 'admit', bindings: {...at, lot: 'precursor'}},
        {op: 'admit', bindings: {...at, lot: 'bean'}},
        {op: 'react', bindings: at, options: {reactions: [d.reaction], cues: [d.cues.afterAddition]}},
        {op: 'stir', bindings: at, options: {...d.stir, strokes, cues: [d.cues.afterStirring]}},
    ]};
    const things = {[vessel.id]: vessel, ...Object.fromEntries(Object.values(lots).map(l => [l.id, l]))};
    const bindings = {vessel: {kind: 'vessel', id: vessel.id}, ...Object.fromEntries(Object.entries(lots).map(([k, l]) => [k, {kind: 'lot', id: l.id}]))};
    const record = beginWorking(BREW_LAW, method, {id: `${d.id}.attempt`, bindings, at: 0});
    const {record: done} = settleWorking(BREW_LAW, record, {now: record.deadlines.at(-1), ports: {read: ref => things[ref.id] ?? null}});
    if (done.status !== 'complete') throw Error(done.receipts.at(-1).reason);
    const seen = op => done.receipts.find(r => r.op === op).observed.cues ?? [];
    return {facts: done.facts, cues: {afterAddition: seen('react'), afterStirring: seen('stir')}};
}

// Book 6 ch. 18 establishes that a blended poison requires a combined remedy.
// The classroom binder, catalyst and their reaction rates are original tuning.
const bindRemedies = {reactants: {remedyA: 1, remedyB: 1, binder: 1}, products: {joint: 3}};
const antidoteReactions = deepFreeze({
    hot: [{id: 'binder-degrades', limitPermille: 500, reactants: {binder: 1}, products: {residue: 1}}],
    bind: [{id: 'bind-remedies', ...bindRemedies}],
    'cool-bind': [
        {id: 'catalysed-cool-binding', priority: 1, catalyst: 'bond-catalyst', ...bindRemedies},
        {id: 'slow-cool-binding', limitPermille: 500, ...bindRemedies},
    ],
});

export function brewBlendedAntidote({remedyA, remedyB, binder, operations, catalyst}) {
    const lots = Object.entries({binder, carrier: 1, remedyA, remedyB}).filter(([, amount]) => amount > 0)
        .map(([material, amount]) => ({kind: 'lot', id: `lot.${material}`, material, amount,
            properties: material === 'carrier' ? {} : {[material]: 1000}}));
    const vessel = {kind: 'vessel', id: 'class.cauldron', place: 'class'};
    const things = new Map([vessel, ...lots].map(thing => [thing.id, thing]));
    const bindings = {vessel: {kind: 'vessel', id: vessel.id},
        ...Object.fromEntries(lots.map(({material, kind, id}) => [material, {kind, id}]))};
    const method = brewMethod({id: 'hp.brew.blended_antidote', slots: lots.map(({material}) => ({id: material})),
        process: operations.map(op => ({op: 'react', options: {reactions: antidoteReactions[op],
            catalysts: catalyst ? ['bond-catalyst'] : []}}))});
    const initial = beginWorking(BREW_LAW, method, {id: 'hp.brew.blended_antidote.attempt', bindings, at: 0});
    const ports = {read: ref => things.get(ref.id)};
    const admitted = settleWorking(BREW_LAW, initial, {now: 0, ports, maxSteps: lots.length});
    const trace = [];
    let record = admitted.record;
    for (let step = 0; step < operations.length && record.status === 'running'; step++) {
        const before = record.facts.reactions?.length ?? 0;
        ({record} = settleWorking(BREW_LAW, record, {now: 0, ports, maxSteps: 1}));
        for (const {reaction: id, extent} of (record.facts.reactions ?? []).slice(before)) trace.push({step, kind: 'reaction', id, extent});
    }
    if (record.status !== 'complete') throw Error(record.receipts.at(-1).reason);
    const spent = admitted.effects.map(({effect}) => ({material: things.get(effect.holder).material, qty: effect.amount}));
    return {batch: record.facts.brew.batch, spent, trace};
}
