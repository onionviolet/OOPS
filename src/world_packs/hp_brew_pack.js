// Hogwarts brewing pack on the shared brew law (chat B; PTD1-PTD3, PTD5).
// The classroom Draught of Living Death as data: a Sopophorous bean whose
// preparation form decides how much juice it gives, freshness by storage, one
// reaction with the prepared base, a stirring pattern and two colour cues.
// Book 6 ch. 9 anchors the bean, crushing rather than cutting, the stirring
// direction and the colour changes (HPPE012 and the potion evidence README);
// every quantity, threshold and rate below is an original game dial.
import {deepFreeze} from '../basics.js';
import {BREW_LAW, brewMethod} from '../brew_law.js';
import {THERMAL_REVISION} from '../craft_process_thermal.js';
import {beginWorking, settleWorking} from '../kernel_working.js';
import bookHp from './book_hp_pack.js';
import {planPolyjuiceFinish} from '../hp_polyjuice_duration.js';

const polyjuiceFormula = bookHp.native.formula;
const lacewing = polyjuiceFormula.slots.find(slot => slot.id === 'lacewing');
const polyjuiceParts = {
    leeches: 'leeches', lacewing: 'lacewing', fluxweed: 'moon-fluxweed',
    knotgrass: 'torn-knotgrass', bicorn: 'powdered-bicorn', boomslang: 'shredded-boomslang',
};

// HPPE072 and HPPE095–097 supply the thickening cue and ingredient list.
// The concentrate, time and reaction coefficients are authored.
export function confusingConcoction({restMinutes = 3} = {}) {
    const lots = {
        scurvy: {id: 'scurvy-grass', material: 'scurvy-grass', amount: 2, properties: {'scurvy-grass': 1000}},
        sneezewort: {id: 'sneezewort', material: 'sneezewort', amount: 2, properties: {sneezewort: 1000}},
        lovage: {id: 'lovage', material: 'lovage', amount: 2, properties: {lovage: 1000}},
    };
    const method = brewMethod({id: 'hp.brew.confusing-concoction', slots: Object.keys(lots).map(id => ({id})), process: [
        {op: 'react', minutes: 1, options: {reactions: [{id: 'infuse-herbs',
            reactants: {'scurvy-grass': 1, sneezewort: 1, lovage: 1}, products: {'thin-infusion': 3}}]}},
        {op: 'react', minutes: restMinutes, options: {reactions: [{id: 'thicken-infusion', minMinutes: 3,
            reactants: {'thin-infusion': 1}, products: {'confusing-active': 1}}]}},
    ]});
    return {lots, method};
}

// HPPE126 anchors the exam. The official encyclopedia supplies the known
// ingredients. The conversion and all batch measures are authored.
export function forgetfulnessPotion() {
    const ingredients = ['lethe-water', 'valerian', 'mistletoe-berries'];
    const lots = Object.fromEntries(ingredients.map(id => [id, {id, material: id, amount: 2, properties: {[id]: 1000}}]));
    const method = brewMethod({id: 'hp.brew.forgetfulness', slots: ingredients.map(id => ({id})), process: [
        {op: 'react', minutes: 2, options: {reactions: [{id: 'bind-lethe-infusion',
            reactants: Object.fromEntries(ingredients.map(id => [id, 1])), products: {'forgetfulness-active': 3}}]}},
    ]});
    return {lots, method};
}

// Rowling's Werewolves essay supplies the pairing. The mass and binding
// reaction are authored. Keep silver preparation explicit in the method.
export function silverAndDittany({powdered = true} = {}) {
    const lots = {
        silver: {id: 'silver', material: 'silver', amount: 2, properties: {silver: 1000}},
        dittany: {id: 'dittany', material: 'dittany', amount: 2, properties: {dittany: 1000}},
    };
    const method = brewMethod({id: 'hp.brew.silver-and-dittany', slots: [{id: 'silver'}, {id: 'dittany'}], process: [
        {op: 'react', minutes: 1, options: {reactions: [{id: 'bind-bite-seal',
            reactants: {'powdered-silver': 1, dittany: 1}, products: {'bite-seal': 2}}]}},
    ]});
    if (powdered) method.steps.unshift({op: 'prepare', minutes: 1, bindings: {vessel: 'vessel', lot: 'silver'},
        options: {how: 'powder', changes: [{from: 'silver', to: 'powdered-silver', num: 1, den: 1}]}});
    return {lots, method};
}

// The official Herbology article names mistletoe berries. This trial
// supplies a carrier and authors a response to one modeled common poison.
export function commonPoisonAntidote() {
    const lots = {
        berries: {id: 'mistletoe-berries', material: 'mistletoe-berries', amount: 2, properties: {'mistletoe-berries': 1000}},
        carrier: {id: 'water', material: 'water', amount: 2, properties: {water: 1000}},
    };
    const method = brewMethod({id: 'hp.brew.common-poison-antidote', slots: [{id: 'berries'}, {id: 'carrier'}], process: [
        {op: 'react', minutes: 2, options: {reactions: [{id: 'infuse-mistletoe',
            reactants: {'mistletoe-berries': 1, water: 1}, products: {'mistletoe-antidote': 2}}]}},
    ]});
    return {lots, method};
}

// HPPE029–034 anchor the ingredients, the leech-juice measure and the colour
// contrast. The overmeasure reaction and its dose response are authored.
export function shrinkingSolution({juice = 1} = {}) {
    const ingredients = ['daisy-root', 'shrivelfig', 'caterpillar', 'spleen', 'leech-juice'];
    const lots = Object.fromEntries(ingredients.map(id => [id, {id, material: id,
        amount: id === 'leech-juice' ? juice : 1, properties: {[id]: 1000}}]));
    const method = brewMethod({id: 'hp.brew.shrinking', slots: ingredients.map(id => ({id})), process: [
        {op: 'react', minutes: 1, options: {reactions: [{id: 'form-shrinking-solution',
            reactants: Object.fromEntries(ingredients.map(id => [id, 1])), products: {shrink: 5}}]}},
        {op: 'react', minutes: 1, options: {reactions: [{id: 'bind-excess-leech-juice',
            reactants: {shrink: 5, 'leech-juice': 1}, products: {'shrinking-irritant': 6}}],
        cues: [
            {constituent: 'shrink', atLeastPermille: 1000, cue: 'acid green'},
            {constituent: 'shrinking-irritant', atLeastPermille: 1, cue: 'orange'},
        ]}},
    ]});
    return {lots, method};
}

export const POLYJUICE_STEW = Object.freeze({ready: lacewing.minStewMinutes, near: lacewing.nearStewMinutes});
export const POLYJUICE_BASES = Object.freeze({ready: 'polyjuice-base', near: 'thin-polyjuice-base'});

// HPPE013–019. The workshop supplies the timing dials. Each two-unit
// contribution and the conserved six-way reaction are authored.
export function polyjuiceBase({stewMinutes = POLYJUICE_STEW.ready, fullMoon = true} = {}) {
    const lots = Object.fromEntries(Object.entries(polyjuiceParts).map(([id, part]) => [id, {
        id, material: id, amount: 2,
        properties: {[id === 'fluxweed' && !fullMoon ? 'ordinary-fluxweed' : part]: 1000},
    }]));
    const preparations = [['knotgrass', 'tear'], ['bicorn', 'powder'], ['boomslang', 'shred']];
    for (const [id] of preparations) lots[id].properties = {[id]: 1000};
    const reactants = Object.fromEntries(Object.values(polyjuiceParts).map(part => [part, 1]));
    const method = brewMethod({id: 'hp.brew.polyjuice', slots: Object.keys(lots).map(id => ({id})), process: [
        {op: 'react', minutes: stewMinutes, options: {reactions: Object.entries(POLYJUICE_BASES).map(([grade, part], i) => ({
            id: part, minMinutes: POLYJUICE_STEW[grade], priority: 2 - i, reactants, products: {[part]: 6},
        }))}},
        {op: 'divide', minutes: 1, options: {doses: 2}},
        {op: 'bind-sample', minutes: 1, options: {index: 1}},
        {op: 'pour', options: {index: 1}},
        {op: 'pour', flask: 'control', options: {index: 0}},
    ]});
    for (const [id, how] of preparations) {
        const i = method.steps.findIndex(step => step.bindings.lot === id);
        method.steps.splice(i, 0, {op: 'prepare', bindings: {vessel: 'vessel', lot: id},
            options: {how, changes: [{from: id, to: polyjuiceParts[id], num: 1, den: 1}]}});
    }
    return {lots, method};
}

export function polyjuiceGradeMinutes(grade) {
    if (grade === 'ready') return polyjuiceFormula.transformMinutes;
    return planPolyjuiceFinish({
        mode: 'standard', resolution: {grade: 'degraded', wear: 0, rows: [{slot: 'lacewing', grade: 'near'}]},
        inputs: [{slot: 'lacewing', lot: {truth: {stewedMinutes: POLYJUICE_STEW.near}}}],
        standardMinutes: polyjuiceFormula.transformMinutes, standardDoses: 2, brewMinutes: 0, lacewingSlot: lacewing,
    }).doseMinutes;
}

// HPPE063 supplies the six-month stew. The pre-mixed base and its
// conversion are authored. The other preparation stages are unknown.
export const FELIX_STEW_MINUTES = 6 * 30 * 24 * 60;
export function felixMaturation({stewMinutes = FELIX_STEW_MINUTES} = {}) {
    const lots = {base: {id: 'felix-base-lot', material: 'felix-base', amount: 6,
        properties: {'felix-base': 1000}}};
    const method = brewMethod({id: 'hp.brew.felix-maturation', slots: [{id: 'base'}], process: [
        {op: 'react', minutes: stewMinutes, options: {reactions: [{id: 'felix-matured',
            minMinutes: FELIX_STEW_MINUTES, reactants: {'felix-base': 1}, products: {'felix-active': 1}}]}},
        {op: 'divide', options: {doses: 1}}, {op: 'pour', options: {index: 0}},
    ]});
    return {lots, method};
}

// HPPE041/042 and HPPE109. The weekend is modeled as two days.
export const STRENGTHENING_REST = 2 * 24 * 60;
export function strengtheningSolution({early = false, substituted = false} = {}) {
    const liquid = substituted ? 'pomegranate' : 'salamander-blood';
    const lots = {
        liquid: {id: 'liquid', material: liquid, amount: 3, properties: {[liquid]: 1000}},
        claw: {id: 'claw', material: 'griffin-claw', amount: 3, properties: {'griffin-claw': 1000}},
    };
    const method = brewMethod({id: 'hp.brew.strengthening', slots: [{id: 'liquid'}, {id: 'claw'}], process: [
        {op: 'react', minutes: STRENGTHENING_REST - Number(early), options: {reactions: [{
            id: 'strengthening-matures', minMinutes: STRENGTHENING_REST,
            reactants: {'salamander-blood': 1, 'powdered-griffin-claw': 1}, products: {'strengthening-active': 2},
        }]}},
        {op: 'divide', options: {doses: 1}}, {op: 'pour', options: {index: 0}},
    ]});
    method.steps.splice(1, 0, {op: 'prepare', bindings: {vessel: 'vessel', lot: 'claw'},
        options: {how: 'powder', changes: [{from: 'griffin-claw', to: 'powdered-griffin-claw', num: 1, den: 1}]}});
    return {lots, method, liquid};
}

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

/** Shared recipe definition for the classroom and headless stock routes. */
export function draughtOfLivingDeathRecipe({preparation, beanUnits, precursor, carrier, strokes, storage}) {
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
    return {lots, vessel, method};
}

/** Run one classroom attempt through the kernel working on the brew law. */
export function brewDraughtOfLivingDeath(input) {
    const {lots, vessel, method} = draughtOfLivingDeathRecipe(input);
    const things = {[vessel.id]: vessel, ...Object.fromEntries(Object.values(lots).map(l => [l.id, l]))};
    const bindings = {vessel: {kind: 'vessel', id: vessel.id}, ...Object.fromEntries(Object.entries(lots).map(([k, l]) => [k, {kind: 'lot', id: l.id}]))};
    const record = beginWorking(BREW_LAW, method, {id: `${method.id}.attempt`, bindings, at: 0});
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

export function blendedAntidoteRecipe({remedyA, remedyB, binder, operations, catalyst}) {
    const lots = Object.entries({binder, carrier: 1, remedyA, remedyB}).filter(([, amount]) => amount > 0)
        .map(([material, amount]) => ({kind: 'lot', id: `lot.${material}`, material, amount,
            properties: material === 'carrier' ? {} : {[material]: 1000}}));
    const vessel = {kind: 'vessel', id: 'class.cauldron', place: 'class'};
    const method = brewMethod({id: 'hp.brew.blended_antidote', slots: lots.map(({material}) => ({id: material})),
        process: operations.map(op => ({op: 'react', options: {reactions: antidoteReactions[op],
            catalysts: catalyst ? ['bond-catalyst'] : []}}))});
    return {lots, vessel, method};
}

export function brewBlendedAntidote(input) {
    const {lots, vessel, method} = blendedAntidoteRecipe(input);
    const things = new Map([vessel, ...lots].map(thing => [thing.id, thing]));
    const bindings = {vessel: {kind: 'vessel', id: vessel.id},
        ...Object.fromEntries(lots.map(({material, kind, id}) => [material, {kind, id}]))};
    const initial = beginWorking(BREW_LAW, method, {id: 'hp.brew.blended_antidote.attempt', bindings, at: 0});
    const ports = {read: ref => things.get(ref.id)};
    const admitted = settleWorking(BREW_LAW, initial, {now: 0, ports, maxSteps: lots.length});
    const trace = [];
    let record = admitted.record;
    for (let step = 0; step < input.operations.length && record.status === 'running'; step++) {
        const before = record.facts.reactions?.length ?? 0;
        ({record} = settleWorking(BREW_LAW, record, {now: 0, ports, maxSteps: 1}));
        for (const {reaction: id, extent} of (record.facts.reactions ?? []).slice(before)) trace.push({step, kind: 'reaction', id, extent});
    }
    if (record.status !== 'complete') throw Error(record.receipts.at(-1).reason);
    const spent = admitted.effects.map(({effect}) => ({material: things.get(effect.holder).material, qty: effect.amount}));
    return {batch: record.facts.brew.batch, spent, trace};
}

// B5 ch. 12, HPPE037–040. One recorded classroom stage, starting with an
// already prepared base. Three left strokes, seven minutes of simmer and
// two drops after the simmer are sourced. All other quantities and kinetics,
// the silver cue's assay, and the finite sleep response are fixture dials.
const peaceActive = 'peace-active';
const peaceSimmer = deepFreeze({
    law: {revision: THERMAL_REVISION, ambient: 20,
        extraction: {min: 50, max: 85, seconds: 60}, degradation: {above: 85, seconds: 60}},
    load: {mass: 1, volume: 1, specificHeat: 1},
    maker: {tools: ['brazier'], competence: 4, workCapacity: 1000, fuelStock: 10000,
        heater: {maxTemperature: 80, maxConductance: 20, fuelPerSecond: 0.25}},
    program: {startTemperature: 59, sourceTemperature: 75, targetTemperature: 60,
        holdSeconds: 420, heaterTool: 'brazier'},
    active: 'powdered-moonstone', extract: 'peace-extracted', degraded: 'peace-degraded',
});

// PC95 headless method. The engine binds and fills the flask on the pour step.
export function draughtOfPeaceMethod({moonstone, syrupDrops}) {
    const method = brewMethod({id: 'hp.brew.draught_of_peace',
        slots: [{id: 'base'}, {id: 'moonstone', amount: moonstone}], process: [
            {op: 'stir', minutes: 1, options: {strokes: 'LLL',
                cadence: {every: 3, from: 'peace-base', to: 'peace-stirred', amount: 4}}},
            {op: 'heat', minutes: 7, options: peaceSimmer},
            {op: 'react', options: {
                reactions: [{id: 'finish-peace', reactants: {'peace-extracted': 1, 'hellebore-syrup': 1, 'peace-stirred': 1}, products: {[peaceActive]: 3}}],
                cues: [{cue: 'Light silver vapour', constituent: peaceActive, atLeastPermille: 30}],
            }},
            {op: 'divide', minutes: 1, options: {doses: 1}},
            {op: 'pour', options: {index: 0}},
        ]});
    if (syrupDrops > 0) {
        method.roles.syrup = 'lot';
        const finish = method.steps.findIndex(step => step.op === 'react');
        method.steps.splice(finish, 0, {op: 'admit', bindings: {vessel: 'vessel', lot: 'syrup'}, options: {amount: syrupDrops}});
    }
    return method;
}

// The delivered composition selects the mind effect. The mood delta, sleep
// threshold and recovery times are authored, including the zero-active case.
export function draughtOfPeaceDose(contents) {
    const active = contents[peaceActive] ?? 0;
    if (active === 0) return null;
    return active >= 12
        ? {verb: 'bind', mind: {faculty: 'awareness'}, minutes: 12}
        : {verb: 'transform', mind: {faculty: 'mood', amount: active}, minutes: 4};
}

// B1 ch. 8, pp. 111–112. Snape's diagnosis motivates the active-flame
// condition. The amounts, thermal profile and breach threshold are authored.
export function cureForBoilsTrial({lift, splash = false}) {
    const materials = [
        ['nettles', 'cure', 300], ['fangs', 'cure', 250], ['slugs', 'cure', 200], ['quills', 'sting', 500],
    ];
    const lots = Object.fromEntries(materials.map(([id, part, fraction]) => [id,
        {id, material: id, amount: 1000, properties: {[part]: fraction}}]));
    const method = brewMethod({id: 'hp.brew.cure_for_boils', slots: materials.map(([id]) => ({id})), process: [
        {op: 'heat', minutes: 2, options: {...peaceSimmer, active: null,
            program: {...peaceSimmer.program, holdSeconds: 180}}},
        ...(lift ? [{op: 'cool'}] : []),
        {op: 'react', options: {reactions: [{id: 'quills-burn', activeHeat: true,
            reactants: {sting: 1, cure: 1}, products: {acid: 2}}], cues: [
            {constituent: 'acid', atLeastPermille: 250, cue: 'Green fumes'},
        ]}},
        {op: splash ? 'breach-contact' : 'breach', options: {constituent: 'acid', minimum: 1000,
            ...(splash ? {contact: {permille: 100, harm: 'corrosive-spill'}} : {})}},
    ]});
    const [quills] = method.steps.splice(3, 1);
    method.steps.splice(method.steps.findIndex(step => step.op === 'react'), 0, quills);
    return {lots, method};
}
