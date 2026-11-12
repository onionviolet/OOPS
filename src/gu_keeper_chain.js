import {moonlightBlade} from './gu_ability_profiles.js';
import {heldMoonlightStockStage, moonlightStockMoveIds} from './gu_moonlight_stock.js';
import {runGuEffectChain, searchGuEffectChains} from './gu_effect_chains.js';
import {applyEnergyEffect} from './energy_resources.js';

const prefix = 'book.ri.keeper';
export const keeperChain = `${prefix}.chain_research`;
export const keeperChainBay = `${keeperChain}.passage`;
export const keeperChainSlots = 2;
const world = `${prefix}.world`;
const energyId = `${prefix}.primeval`;
const key = `${keeperChain}.notes`;
const carrier = 'moonblade-light';
const target = {accepts: ['forked-blade', 'sweeping-blade'], minForce: 0.5, contacts: 2};
const links = {
    fork: {label: 'Fork Light Gu', accepts: carrier, produces: 'forked-blade', factor: 0.5, contacts: 2},
    bend: {label: 'Bend Light Gu', accepts: carrier, produces: 'bent-blade'},
    sweep: {label: 'Sweep Light Gu', accepts: 'bent-blade', produces: 'sweeping-blade', contacts: 2},
};
export const keeperChainLoans = Object.entries(links).map(([id, {label}]) => ({id, label}));
const pinned = record => record?.extensions?.some(pin => pin.id === keeperChain);
const done = (state, operation) => state.actors.player.completed[`${keeperChain}.${operation}`] ?? 0;
const holds = (state, id) => state.actors.player.facts[`${keeperChain}.${id}`] === true;
const reserveFor = state => state.simulation.energies.player[energyId].reserve;

function available(state) {
    const core = heldMoonlightStockStage(state);
    const sources = moonlightStockMoveIds.map(id => core?.gu.id === id ? {...core, emits: carrier} : {
        gu: {id, alive: false, fedThrough: state.clock}, operator: 'player', ability: moonlightBlade,
        emits: carrier,
    });
    return [...sources, ...Object.entries(links).map(([id, chain]) => ({chain, operator: 'player',
        gu: {id, kind: id, rank: 1, alive: holds(state, id), fedThrough: state.clock},
        ability: {fuel: 'primeval', cost: 1},
    }))];
}

function validBinding(binding) {
    if (!Array.isArray(binding) || binding.length < 2 || binding.length > keeperChainSlots + 1 ||
        binding.some(pick => pick?.operator !== 'player') || !moonlightStockMoveIds.includes(binding[0].id) ||
        new Set(binding.map(pick => pick.id)).size !== binding.length) return false;
    let kind = carrier;
    for (const {id} of binding.slice(1)) {
        if (!Object.hasOwn(links, id) || links[id].accepts !== kind) return false;
        kind = links[id].produces;
    }
    return target.accepts.includes(kind);
}

function notesFor(state) {
    const raw = state.worlds[world]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 2048) throw Error('Invalid blade chain notes.');
    const {plans, last} = JSON.parse(raw);
    if (!Array.isArray(plans) || plans.length > keeperChainSlots || new Set(plans.map(row => JSON.stringify(row.binding))).size !== plans.length ||
        plans.some(({binding, cost, force}) => !validBinding(binding) || cost !== moonlightBlade.cost + binding.length - 1 ||
            !Number.isFinite(force) || force < target.minForce || force > 2) ||
        (last !== null && (!last || !Number.isSafeInteger(last.slot) || !plans[last.slot - 1] ||
            !Number.isSafeInteger(last.spent) || last.spent < 0 || last.spent > plans[last.slot - 1].cost ||
            typeof last.open !== 'boolean' || last.open && last.spent !== plans[last.slot - 1].cost ||
            last.stopped !== null && !plans[last.slot - 1].binding.some(pick => pick.id === last.stopped)))) {
        throw Error('The blade chain and its trial disagree.');
    }
    return {plans, last};
}

export function validateKeeperChain(state, record) {
    const notes = notesFor(state);
    if (!!notes !== (done(state, 'research') > 0) ||
        (notes || Object.keys(links).some(id => state.actors.player.facts[`${keeperChain}.${id}`] !== undefined)) && !pinned(record) ||
        notes?.last && !done(state, `try_${notes.last.slot}`) ||
        state.simulation.people.player.location === keeperChainBay && !notes?.last?.open) {
        throw Error('The blade chain needs its research and cast receipts.');
    }
}

export function keeperChainFacts(state, record) {
    if (!pinned(record)) return {};
    const notes = notesFor(state);
    const open = !!notes?.last?.open;
    const values = {research: !open, enter: open,
        ...Object.fromEntries(Object.keys(links).map(id => [`holds_${id}`, holds(state, id)])),
        ...Object.fromEntries(Array.from({length: keeperChainSlots}, (_, index) =>
            [`try_${index + 1}`, !open && !!notes?.plans[index]]))};
    return Object.fromEntries(Object.entries(values).map(([name, value]) => [`${keeperChain}.${name}`, value]));
}

export function keeperChainView(state, record) {
    if (!pinned(record)) return null;
    const notes = notesFor(state);
    if (!notes) return null;
    const name = id => links[id]?.label ?? (id === moonlightStockMoveIds[0] ? 'First tray Gu' : 'Second tray Gu');
    return {last: notes.last && {...notes.last, stopped: notes.last.stopped && name(notes.last.stopped)},
        plans: notes.plans.map(({binding, cost, force}) => ({cost, force, names: binding.map(({id}) => name(id))}))};
}

export function applyKeeperChain(state, effect, context, registry) {
    if (!pinned(context.structuredNative) || context.actorId !== 'player' || state.actors.player.worldId !== world ||
        state.simulation.people.player.location !== `${prefix}.annex`) throw Error('Research the blade chains at the Gu house.');
    const facts = state.worlds[world].facts;
    const notes = notesFor(state);
    if (notes?.last?.open) throw Error('The two catches are already cut.');
    const reserve = reserveFor(state);
    const request = {available: available(state), reserves: {player: {primeval: reserve}}, day: state.clock, target};
    if (effect.operation === 'research_chain') {
        const {options} = searchGuEffectChains({...request, available: request.available.filter(stage => stage.gu.alive !== false)});
        facts[key] = JSON.stringify({plans: options.map(({plan, result}) => ({binding: plan,
            cost: reserve - result.remaining.player.primeval, force: result.signal.magnitude})), last: null});
        return;
    }
    const plan = notes?.plans[effect.slot - 1];
    if (!plan) throw Error('Write down a blade chain first.');
    const result = runGuEffectChain({...request, plan: plan.binding});
    const spent = reserve - result.remaining.player.primeval;
    for (let unit = 0; unit < spent; unit++) {
        applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
    }
    facts[key] = JSON.stringify({...notes, last: {slot: effect.slot, spent, open: result.reached, stopped: result.id ?? null}});
}
