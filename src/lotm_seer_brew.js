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
// holds the cup"). The engine is pure (resolveBatch), so an NPC maker calls it directly; the pack's own act that finishes the
// brew records the product, and the drink requires it. The cup itself stays scene text (no holder, no item).
import {compileProcedure} from './making_procedure.js';
import {MAKING_TRAITS} from './making_traits.js';
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw, resolveBatch} from './craft_resolver.js';

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

const NEIL_BREW = brewSeer();
// The pack act that ends the brew, and the drink that consumes it. Both are pack rows; without the private pack neither exists.
export const SEER_BREW_BINDING = Object.freeze({brewAct: 'book.lotm.kj3o.cup', consumer: 'book.lotm.kj3p.drink'});

// Adds the engine's product to the brew act and the brewed-batch gate to the drink. Returns how many commands it bound.
export function bindSeerBrew(commands, product = NEIL_BREW) {
    const brew = commands.find(d => d.id === SEER_BREW_BINDING.brewAct), drink = commands.find(d => d.id === SEER_BREW_BINDING.consumer);
    if(!brew || !drink) return 0;
    const fact = (key, value) => ({type: 'fact', scope: 'actor', actor: 'player', key, value});
    brew.effects = [...brew.effects, fact(SEER_BREW_FACTS.product, product.id),
        fact(SEER_BREW_FACTS.seer, product.outputs.beyonder?.seer ?? 0), fact(SEER_BREW_FACTS.madness, product.outputs.spirit?.madness ?? 0)];
    // The drink needs a batch the engine resolved with the Seer's power in it; a missing fact reads as not brewed.
    const gate = {fact: `actor.${SEER_BREW_FACTS.seer}`, op: 'gte', value: 1, reason: 'The potion has to be brewed first.'};
    for(const k of ['requires', 'completionRequires']) drink[k] = {all: [...(drink[k] ? [drink[k]] : []), gate]};
    // The source already supplies Neil as the target participant. Retain that
    // actual actor rather than spawning a second maker. Klein remains the viewer.
    if(brew.duration >= 2) {
        const maker = brew.targetId ? [{id:brew.targetId,role:'maker'}] : [];
        const steps = compileProcedure(brew,{steps:[
            {id:'crucial',minutes:Math.floor(brew.duration/2),label:'Watch Neil measure the blood and crystal',agents:maker},
            {id:'fog',minutes:Math.ceil(brew.duration/2),label:'Watch the fog settle into the cup',agents:maker},
        ]});
        Object.assign(brew,steps.at(-1));
        commands.push(...steps.slice(0,-1));
    }
    return 2;
}
