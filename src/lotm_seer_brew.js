// Lord of the Mysteries, Klein's first potion: Old Neil's Seer brew resolved by the shared craft engine (slice W2a, LT7).
// Proposal (AD32); nothing here is accepted direction. Governing lines: AD38 (things work by how they work), MR6 (the world
// supplies a catalogue, a law and the batch; the shared engine resolves the product) and AR11 (a second world's law, not a
// second engine: Harry's Potions class is the first).
//
// Canon (book 1, the alchemy room): Neil brews; Klein watches and touches nothing. Seven ingredients by the formula: about
// 100 ml distilled water, 13 drops night vanilla, 7 gold mint leaves, 3 drops poison hemlock, 9 g dragon blood grass, then the
// two crucial ones, 10 ml Lavos Squid blood and Star Crystal cut slightly under the formula's 50 g. The first five barely
// matter; of the last two, slightly less is tolerated and slightly more can mean mental damage or death.
// Authored (not canon): the axes and numbers, 48 g as "slightly under", the op names and the fact keys.
//
// Default, dial and reason. Default: the crystal binds the blood's charge into the Seer's power, five parts crystal to one of
// blood; charge left unbound reads as madness. Supplements carry neither axis, so their amounts barely matter and dilution
// changes nothing (totals, not concentrations). Dial: the binding ratio and the madness unit are law rows, so a pathway with a
// harsher or gentler potion changes numbers, not code. Reason: the book states an absolute dose limit on the two main
// ingredients, not a proportion of the whole cup.
//
// Why a non-player maker and facts, not an inventory cup: the text has Neil make it and leaves the cup in the room ("nobody
// holds the cup"). The shared brew working resolves the measured allocation; the pack's own act that finishes the
// brew records the product. The drink spends the scene's cup in the same settlement that grants the source.
import {compileProcedure, procedureStepKey} from './making_procedure.js';
import {seedPlaceObjects} from './place_acts.js';
import {MAKING_TRAITS} from './making_traits.js';
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw, resolveBatch} from './craft_resolver.js';
import {LOTM_INBOX} from './book_world_lotm_harm.js';
import {BREW_LAW, MILLI} from './brew_law.js';
import {beginWorking, settleWorking} from './kernel_working.js';
import {identifiedLotmDoseReading, lotmBrewRow, lotmLots} from './world_packs/lotm_brew_pack.js';

const P = 'book.lotm.seer_brew';
export const SEER_BREW_FACTS = Object.freeze({product: `${P}.product`, madness: `${P}.madness`, seer: `${P}.seer`});

const material = (id, properties = {}, tags = []) => ({id, revision: 1, properties, tags});
export const SEER_BREW_CATALOGUE = defineCatalogue({
    id: `${P}.catalogue`, revision: 1,
    axes: [{id: 'charge', kind: 'fraction', label: 'Beyonder charge'}, {id: 'binding', kind: 'fraction', label: 'binding'},
        {id: 'seer', kind: 'fraction', label: 'the Seer’s power'}],
    tags: MAKING_TRAITS,
    materials: [material('Distilled water', {}, ['material.liquid']), material('Night vanilla liquid', {}, ['material.plant','material.liquid']), material('Gold mint leaf', {}, ['material.plant']),
        material('Poison hemlock juice', {}, ['material.plant','material.liquid']), material('Dragon blood grass powder', {}, ['material.plant','preparation.crushed']),
        material('Lavos Squid blood', {charge: 1000}, ['material.animal','material.liquid','function.spiritual_charge']), material('Star Crystal', {binding: 1000}, ['material.mineral','function.binding'])],
});

export const SEER_BREW_LAW = defineCraftLaw({
    id: `${P}.law`, revision: 1, catalogue: SEER_BREW_CATALOGUE, carrier: 'Opaque cup',
    ops: [{id: 'supplements', label: 'Add the five supplements'}, {id: 'crucial', label: 'Add the blood and the crystal'},
        {id: 'fog', label: 'Let it hiss and fog'}],
    reactions: [{id: 'bind', after: 'fog', reactants: {charge: 1, binding: 5}, products: {seer: 6}}],
    outputs: [{id: 'seer', route: 'beyonder', effect: 'seer', axis: 'seer', per: 1, mode: 'total'},
        // One unit of madness per whole millilitre of blood left unbound.
        {id: 'madness', route: 'spirit', effect: 'madness', axis: 'charge', per: 1, mode: 'total'}],
});

// Neil's batch by the formula. Units are each ingredient's own (ml, drops, leaves, g); the law reads only the two crucial ones.
export const SEER_BREW_FORMULA = Object.freeze([
    ['Distilled water', 100], ['Night vanilla liquid', 13], ['Gold mint leaf', 7], ['Poison hemlock juice', 3],
    ['Dragon blood grass powder', 9], ['Lavos Squid blood', 10], ['Star Crystal', 48],
].map(([m, qty]) => Object.freeze({material: m, qty})));

export function brewSeer(amounts = {}) {
    const inputs = SEER_BREW_FORMULA.map(({material: m, qty}) => ({material: SEER_BREW_CATALOGUE.materials[m], qty: amounts[m] ?? qty}));
    return resolveBatch(SEER_BREW_LAW, {inputs, process: [{op: 'supplements'}, {op: 'crucial'}, {op: 'fog'}]}).product;
}

// The native command still owns custody, ingredient payment and the source
// grant. Use its actual allocation, including the five scene measures, when
// compiling the shared working.
function resolveSeerAllocation(amounts = {}) {
    const row = lotmBrewRow('fool_9');
    const measures = Object.fromEntries(['a1', 'a2', 'a3', 'a4', 'a5', 'm1', 'm2'].map((slot, index) => {
        const {material, qty} = SEER_BREW_FORMULA[index];
        return [slot, (amounts[material] ?? qty) * MILLI];
    }));
    const lots = lotmLots(row, measures);
    const vessel = {kind: 'vessel', id: 'seer-cauldron'};
    const things = new Map([[vessel.id, vessel], ...Object.values(lots).map(lot => [lot.id, lot])]);
    const bindings = {vessel: {kind: 'vessel', id: vessel.id},
        ...Object.fromEntries(Object.entries(lots).map(([slot, lot]) => [slot, {kind: 'lot', id: lot.id}]))};
    const working = beginWorking(BREW_LAW, row.method, {id: 'seer-allocation', bindings, at: 0});
    const {record} = settleWorking(BREW_LAW, working, {now: working.deadlines.at(-1), ports: {read: ref => things.get(ref.id)}});
    if (record.status !== 'complete') throw Error('The shared Seer allocation did not settle.');
    return identifiedLotmDoseReading(row, record.facts.brew.doses[0]);
}

// The pack act that ends the brew, and the drink that consumes it. Both are pack rows; without the private pack neither exists.
export const SEER_BREW_BINDING = Object.freeze({brewAct: 'book.lotm.kj3o.cup', consumer: 'book.lotm.kj3p.drink'});
const stockKey = material => `${P}.stock.${material.toLowerCase().replaceAll(' ', '-')}`;
const BLOOD = 'Lavos Squid blood';
const EXTRA_MEASURE = 11;
const OVERMEASURE_SEED = `place.act.seed.${P}.overmeasure`;

// Neil holds the chapter's measured allocation as simulation resources, in each ingredient's own unit.
export function seedSeerStock(state, worldId, maker, {overmeasure = false} = {}) {
    const world = state.worlds[worldId];
    if(!maker || !world || !state.actors[maker]) return false;
    if(world.facts[`place.act.seed.${P}`] && (!overmeasure || world.facts[OVERMEASURE_SEED])) return false;
    const player = state.actors.player;
    const cup = SEER_BREW_BINDING.brewAct;
    const legacySpent = player?.facts[procedureStepKey(cup)] === 1 || !!player?.completed?.[cup] ||
        (state.simulation.jobs ?? []).some(job => job.commandId === `${cup}.procedure.1` && job.costs.length === 0);
    const seeded = seedPlaceObjects(state, {objects: [{id: P, resources: SEER_BREW_FORMULA.map(({material, qty}) => ({
        actor: maker, key: stockKey(material), amount: legacySpent ? 0 : qty,
    }))}]}, worldId);
    if(!overmeasure) return seeded;
    // The extra measure is an original allocation. Add it once, including to
    // an existing untouched allocation. A reserved or used allocation stays spent.
    const resources = state.actors[maker].resources;
    const blood = stockKey(BLOOD);
    if(!legacySpent && resources[blood] === EXTRA_MEASURE - 1) resources[blood] = EXTRA_MEASURE;
    world.facts[OVERMEASURE_SEED] = true;
    return true;
}

const fact = (key, value) => ({type: 'fact', scope: 'actor', actor: 'player', key, value});
function bindMeasuredCup(commands, brew, amounts, variant = false) {
    // Retain the old product fingerprint for compatibility with saved scene
    // receipts. The shared allocation supplies the two values the drink uses.
    const product = brewSeer(amounts);
    const reading = resolveSeerAllocation(amounts);
    if(brew.targetId) brew.costs = [...(brew.costs ?? []), ...product.inputs.map(([, material, , qty]) => ({
        type: 'resource', actor: brew.targetId, key: stockKey(material), amount: -qty,
    }))];
    brew.effects = [...brew.effects, fact(SEER_BREW_FACTS.product, product.id),
        fact(SEER_BREW_FACTS.seer, reading?.power ?? 0), fact(SEER_BREW_FACTS.madness, reading?.hazard ?? 0)];
    // The source already supplies Neil as the target participant. Retain that
    // actual actor rather than spawning a second maker. Klein remains the viewer.
    if(brew.duration >= 2) {
        const maker = brew.targetId ? [{id:brew.targetId,role:'maker'}] : [];
        const steps = compileProcedure(brew,{steps:[
            {id:'crucial',minutes:Math.floor(brew.duration/2),label: variant ? 'Ask Neil to use 11 ml of squid blood' : 'Watch Neil measure the blood and crystal',
                description: variant ? 'Use the extra millilitre from the alchemy stock. Neil warns that too much blood can leave the potion dangerous.'
                    : 'Neil sets aside the measured ingredients from his alchemy stock for this cup.',agents:maker},
            {id:'fog',minutes:Math.ceil(brew.duration/2),label:variant ? 'Let the stronger mixture settle' : 'Watch the fog settle into the cup',agents:maker},
        ]});
        // Both procedures complete the same story stage. Their job and
        // prerequisite identities stay distinct so the measured path cannot switch.
        if(variant) for(const step of steps) step.procedure.parentId = SEER_BREW_BINDING.brewAct;
        if(brew.targetId) steps[0].procedure.costLabel = `Neil's stock, including ${amounts[BLOOD] ?? EXTRA_MEASURE - 1} ml squid blood`;
        Object.assign(brew,steps.at(-1));
        commands.push(...steps.slice(0,-1));
    }
}

// The same measured allocation determines the reservation and the resolved cup.
export function bindSeerBrew(commands, amounts = {}, {overmeasure = false} = {}) {
    const brew = commands.find(d => d.id === SEER_BREW_BINDING.brewAct), drink = commands.find(d => d.id === SEER_BREW_BINDING.consumer);
    if(!brew || !drink) return 0;
    const alternate = overmeasure && brew.targetId && brew.duration >= 2
        ? {...structuredClone(brew), id: `${brew.id}.overmeasure`}
        : null;
    bindMeasuredCup(commands, brew, amounts);
    if(alternate) {
        bindMeasuredCup(commands, alternate, {...amounts, [BLOOD]: EXTRA_MEASURE}, true);
        commands.push(alternate);
    }
    const brewed = {fact: `actor.${SEER_BREW_FACTS.seer}`, op: 'gte', value: 1, reason: 'The potion has to be brewed first.'};
    for(const k of ['requires', 'completionRequires']) drink[k] = {all: [drink[k], brewed].filter(Boolean)};
    // The power fact represents the available contents. Keep the product and hazard facts as brew history.
    drink.effects = [...drink.effects, fact(SEER_BREW_FACTS.seer, 0),
        {type: 'resource', actor: 'player', key: LOTM_INBOX.loss, amount: {fact: `actor.${SEER_BREW_FACTS.madness}`}}];
    return 2;
}
