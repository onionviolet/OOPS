import {acquireCreature, creatureHealth, restoreCreatureLifecycle, settleCohortStock, transferCreature} from './creature_lifecycle.js';
import {clanMoonlightTraits, drawGuTraits} from './gu_traits.js';
import {resolveGuActivation} from './gu_activation.js';
import {moonlightBlade, moonbladeSheets, moonlightFocusSpecimen} from './gu_ability_profiles.js';

const prefix = 'book.ri.keeper';
export const moonlightStock = `${prefix}.moonlight_stock`;
const table = `${moonlightStock}.v1`;
const steward = `${prefix}.steward`;
const world = `${prefix}.world`;
const fact = `${moonlightStock}.roster`;
const cohort = `${moonlightStock}.cohort`;
const kind = 'moonlight';
const operations = ['survey', 'borrow_first', 'borrow_second', 'return_stock', 'tune_stock', 'cast_stock'];
const ids = ['creature:1', 'creature:2'];
const habitat = keeper => ({id: `${moonlightStock}.${keeper === 'player' ? 'desk' : 'steward'}`,
    capacity: keeper === 'player' ? 1 : 2, supportedSpecies: [kind]});
const done = (state, operation) => state.actors.player.completed[`${moonlightStock}.${operation}`] ?? 0;
const held = roster => roster && ids.find(id => roster.lifecycle.individuals[id].keeper === 'player');
export const isMoonlightStockOperation = operation => operations.includes(operation);
export const moonlightStockMoveIds = ids.map(id => `${moonlightStock}.${id}`);

function readRoster(state) {
    const raw = state.worlds[world]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid clan Moonlight roster.');
    const {source, lifecycle: saved, adjustments, marks} = JSON.parse(raw);
    const lifecycle = restoreCreatureLifecycle(saved);
    if (source !== table || Object.keys(lifecycle.individuals).length !== ids.length ||
        Object.keys(adjustments ?? {}).length !== ids.length || Object.keys(marks ?? {}).length !== ids.length ||
        ids.some(id => {
            const gu = lifecycle.individuals[id];
            if (!gu || gu.species !== kind || gu.origin !== cohort || ![steward, 'player'].includes(gu.keeper) ||
                gu.habitat !== habitat(gu.keeper).id || gu.bornAt > state.clock || gu.health.lastAt > state.clock ||
                !clanMoonlightTraits.focus.some(row => row.id === gu.traits.focus) || typeof adjustments[id] !== 'boolean') return true;
            const original = gu.traits.focus === 'tight' ? 5 : 4;
            return marks[id] !== null && marks[id] !== original && !(adjustments[id] && marks[id] === original + 1);
        }) || ids.filter(id => lifecycle.individuals[id].keeper === 'player').length > 1) {
        throw Error('The clan Moonlight Gu and their test records disagree.');
    }
    return {source, lifecycle, adjustments, marks};
}

function availability(state, roster) {
    const id = held(roster);
    const p = state.simulation.people[steward];
    const here = p?.life === 'alive' && p.location === `${prefix}.annex`;
    const ready = !!id && !creatureHealth(roster.lifecycle, id, state.clock).injury;
    return {survey: here && !roster, borrow_first: here && !!roster && !id, borrow_second: here && !!roster && !id,
        return_stock: here && !!id, tune_stock: here && ready && !roster.adjustments[id], cast_stock: ready};
}

function survey(state) {
    let lifecycle = restoreCreatureLifecycle(null);
    const destination = habitat(steward);
    lifecycle = settleCohortStock(lifecycle, {revision: lifecycle.revision, id: cohort, species: kind, habitat: destination, delta: 2});
    for (const id of ids) {
        const traits = drawGuTraits({seed: state.simulation.seed, source: table, identity: lifecycle.nextIdentity, table: clanMoonlightTraits});
        const acquired = acquireCreature(lifecycle, {revision: lifecycle.revision, cohortId: cohort, destination,
            keeper: steward, clock: state.clock, traits});
        if (acquired.id !== id) throw Error('The Moonlight Gu identity changed during acquisition.');
        lifecycle = acquired.state;
    }
    return {source: table, lifecycle, adjustments: Object.fromEntries(ids.map(id => [id, false])),
        marks: Object.fromEntries(ids.map(id => [id, null]))};
}

export function moonlightStockFacts(state) {
    return Object.fromEntries(Object.entries(availability(state, readRoster(state)))
        .map(([operation, allowed]) => [`${moonlightStock}.can_${operation}`, allowed]));
}

export function validateMoonlightStock(state, record) {
    const roster = readRoster(state);
    if (Number(!!roster) !== done(state, 'survey') ||
        (!roster && operations.some(operation => done(state, operation))) ||
        (roster && (!record?.extensions?.some(pin => pin.id === moonlightStock) ||
            done(state, 'borrow_first') + done(state, 'borrow_second') - done(state, 'return_stock') !== Number(!!held(roster)) ||
            Object.values(roster.adjustments).filter(Boolean).length !== done(state, 'tune_stock') ||
            Object.values(roster.marks).filter(value => value !== null).length > done(state, 'cast_stock')))) {
        throw Error('The clan Moonlight roster needs its custody, refinement and casting receipts.');
    }
}

export function moonlightStockView(state) {
    const roster = readRoster(state);
    return roster && ids.map((id, index) => ({id, label: index === 0 ? 'First Gu' : 'Second Gu',
        held: roster.lifecycle.individuals[id].keeper === 'player', refined: roster.adjustments[id], cut: roster.marks[id]}));
}

export function heldMoonlightStockStage(state) {
    const roster = readRoster(state), id = held(roster);
    if (!id || creatureHealth(roster.lifecycle, id, state.clock).injury) return null;
    const gu = moonlightFocusSpecimen(`${moonlightStock}.${id}`, roster.lifecycle.individuals[id].traits.focus,
        roster.adjustments[id], state.clock);
    return {gu, operator: 'player', ability: moonlightBlade};
}

export function settleMoonlightStock(state, operation) {
    const roster = readRoster(state);
    if (!availability(state, roster)[operation]) throw Error('The clan Moonlight Gu is unavailable for that trial.');
    const next = roster ?? survey(state);
    const id = held(next);
    if (operation === 'tune_stock') next.adjustments[id] = true;
    else if (operation === 'cast_stock') {
        const gu = moonlightFocusSpecimen(id, next.lifecycle.individuals[id].traits.focus, next.adjustments[id], state.clock);
        next.marks[id] = moonbladeSheets(resolveGuActivation({stages: [{gu, operator: 'player', ability: moonlightBlade}],
            reserves: {player: {primeval: moonlightBlade.cost}}, day: state.clock}));
    } else if (operation !== 'survey') {
        const returning = operation === 'return_stock';
        const moving = returning ? id : ids[operation === 'borrow_first' ? 0 : 1];
        const keeper = returning ? steward : 'player';
        next.lifecycle = transferCreature(next.lifecycle, {revision: next.lifecycle.revision, id: moving,
            fromKeeper: returning ? 'player' : steward, toKeeper: keeper, destination: habitat(keeper), clock: state.clock});
    }
    state.worlds[world].facts[fact] = JSON.stringify(next);
}
