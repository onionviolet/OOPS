import {creatureHealth, matchesCreatureRoster, openCreatureRoster, restoreCreatureLifecycle, transferCreature} from './creature_lifecycle.js';
import {clanMoonlightTraits, drawGuTraits} from './gu_traits.js';
import {runGuStep} from './gu_working_host.js';
import {moonlightBlade, moonbladeSheets, moonlightFocusSpecimen} from './gu_ability_profiles.js';

const prefix = 'book.ri.keeper';
export const moonlightStock = `${prefix}.moonlight_stock`;
const steward = `${prefix}.steward`;
const world = `${prefix}.world`;
const fact = `${moonlightStock}.roster`;
const stock = {
    source: `${moonlightStock}.v1`, cohortId: `${moonlightStock}.cohort`, species: 'moonlight', traits: clanMoonlightTraits,
    specimens: [
        {id: 'creature:1', label: 'First Gu', loan: 'borrow_first'},
        {id: 'creature:2', label: 'Second Gu', loan: 'borrow_second'},
    ],
    habitats: {
        [steward]: {id: `${moonlightStock}.steward`, capacity: 2, supportedSpecies: ['moonlight']},
        player: {id: `${moonlightStock}.desk`, capacity: 1, supportedSpecies: ['moonlight']},
    },
};
const {source, cohortId, species, specimens, habitats} = stock;
const ids = specimens.map(row => row.id);
const loans = new Map(specimens.map(row => [row.loan, row.id]));
const operations = ['survey', ...loans.keys(), 'return_stock', 'tune_stock', 'cast_stock'];
const done = (state, operation) => state.actors.player.completed[`${moonlightStock}.${operation}`] ?? 0;
const held = roster => roster && ids.find(id => roster.lifecycle.individuals[id].keeper === 'player');
export const isMoonlightStockOperation = operation => operations.includes(operation);
export const moonlightStockMoveIds = ids.map(id => `${moonlightStock}.${id}`);

function readRoster(state) {
    const raw = state.worlds[world]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid clan Moonlight roster.');
    const {source: savedSource, lifecycle: saved, adjustments, marks} = JSON.parse(raw);
    const lifecycle = restoreCreatureLifecycle(saved);
    if (savedSource !== source || !matchesCreatureRoster(lifecycle, {ids, cohortId, species, habitats, clock: state.clock}) ||
        Object.keys(adjustments ?? {}).length !== ids.length || Object.keys(marks ?? {}).length !== ids.length ||
        ids.some(id => {
            const gu = lifecycle.individuals[id];
            if (!stock.traits.focus.some(row => row.id === gu.traits.focus) || typeof adjustments[id] !== 'boolean') return true;
            const original = gu.traits.focus === 'tight' ? 5 : 4;
            return marks[id] !== null && marks[id] !== original && !(adjustments[id] && marks[id] === original + 1);
        })) {
        throw Error('The clan Moonlight Gu and their test records disagree.');
    }
    return {source, lifecycle, adjustments, marks};
}

function availability(state, roster) {
    const id = held(roster);
    const p = state.simulation.people[steward];
    const here = p?.life === 'alive' && p.location === `${prefix}.annex`;
    const ready = !!id && !creatureHealth(roster.lifecycle, id, state.clock).injury;
    return {survey: here && !roster, ...Object.fromEntries(specimens.map(row => [row.loan, here && !!roster && !id])),
        return_stock: here && !!id, tune_stock: here && ready && !roster.adjustments[id], cast_stock: ready};
}

function survey(state) {
    const lifecycle = openCreatureRoster({cohortId, species, destination: habitats[steward], keeper: steward,
        count: ids.length, clock: state.clock,
        traitsFor: identity => drawGuTraits({seed: state.simulation.seed, source, identity, table: stock.traits})});
    if (ids.some(id => !Object.hasOwn(lifecycle.individuals, id))) throw Error('The Moonlight Gu identity changed during acquisition.');
    return {source, lifecycle, adjustments: Object.fromEntries(ids.map(id => [id, false])),
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
            specimens.reduce((count, row) => count + done(state, row.loan), 0) - done(state, 'return_stock') !== Number(!!held(roster)) ||
            Object.values(roster.adjustments).filter(Boolean).length !== done(state, 'tune_stock') ||
            Object.values(roster.marks).filter(value => value !== null).length > done(state, 'cast_stock')))) {
        throw Error('The clan Moonlight roster needs its custody, refinement and casting receipts.');
    }
}

export function moonlightStockView(state) {
    const roster = readRoster(state);
    return roster && specimens.map(({id, label}) => ({id, label,
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
        next.marks[id] = moonbladeSheets(runGuStep(species, 'activate', {specimen: gu, at: state.clock,
            facts: {reserves: {player: {primeval: moonlightBlade.cost}}}}));
    } else if (operation !== 'survey') {
        const returning = operation === 'return_stock';
        const moving = returning ? id : loans.get(operation);
        const keeper = returning ? steward : 'player';
        next.lifecycle = transferCreature(next.lifecycle, {revision: next.lifecycle.revision, id: moving,
            fromKeeper: returning ? 'player' : steward, toKeeper: keeper, destination: habitats[keeper], clock: state.clock});
    }
    state.worlds[world].facts[fact] = JSON.stringify(next);
}
