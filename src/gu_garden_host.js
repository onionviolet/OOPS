// A native garden row selects the producer, detached product, custody, daylight and clocks.
// Growth and treatment settle catalogue methods on gu.working; inventory and health remain native owners.
import {guCatalogue} from './gu_catalogue.js';
import {runGuStep} from './gu_working_host.js';

export function guGarden(config) {
    const {id, world, place: annex, custodian: steward, plantId, key, item,
        growthMinutes, ops} = config;
    const growth = guCatalogue[config.producerKind].growth.value;
    const treatment = guCatalogue[config.productKind].treatment.value;
    const done = (state, operation) => state.actors.player.completed[`${id}.${operation}`] ?? 0;
    const pinned = record => record?.extensions?.some(pin => pin.id === id);
    function readGarden(state) {
        const raw = state.worlds[world]?.facts?.[key];
        if (raw === undefined) return null;
        if (typeof raw !== 'string' || raw.length > config.maxRecordLength) throw Error('Invalid garden record.');
        const row = JSON.parse(raw);
        const {plant, grownAt, treatedAt} = row;
        const valid = at => at === null || Number.isSafeInteger(at) && at >= 0 && at <= state.clock;
        if (plant?.id !== plantId || plant.kind !== config.producerKind || ![steward, 'player'].includes(plant.holder) ||
            plant.alive !== true || !Number.isSafeInteger(plant.leaves) || plant.leaves < 0 ||
            plant.leaves > growth.capacity || !valid(grownAt) || !valid(treatedAt)) {
            throw Error('The garden needs its living plant and treatment record.');
        }
        return row;
    }

    function daylight(state, context) {
        const frame = context?.nativeWeatherClock;
        if (!Number.isSafeInteger(frame?.minute) || !Number.isSafeInteger(frame.clock)) return false;
        const minute = frame.minute + state.clock - frame.clock;
        const hour = ((minute % config.dayMinutes) + config.dayMinutes) % config.dayMinutes;
        return hour >= config.daylight.start && hour < config.daylight.end;
    }

    function remaining(now, since, minutes) {
        return since == null ? 0 : Math.max(0, since + minutes - now);
    }

    function options(state, row, context) {
        const stewardHere = state.simulation.people[steward]?.life === 'alive' && state.simulation.people[steward].location === annex;
        const held = row?.plant.holder === 'player';
        const health = context?.vitals?.player;
        return {[ops.borrow]: stewardHere && !held, [ops.return]: stewardHere && held,
            [ops.grow]: held && row.plant.leaves < growth.capacity && daylight(state, context) &&
                !remaining(state.clock, row.grownAt, growthMinutes),
            [ops.harvest]: held && row.plant.leaves > 0,
            [ops.treat]: !!row && health?.health < health?.max_health && !remaining(state.clock, row.treatedAt, treatment.restMinutes)};
    }

    function facts(state, context) {
        return Object.fromEntries(Object.entries(options(state, readGarden(state), context))
            .map(([operation, ready]) => [`${id}.can_${operation}`, !!ready]));
    }

    function view(state, record) {
        if (!pinned(record)) return null;
        const row = readGarden(state);
        return row && {held: row.plant.holder === 'player', leaves: row.plant.leaves, capacity: growth.capacity,
            growthWait: remaining(state.clock, row.grownAt, growthMinutes),
            treatmentWait: remaining(state.clock, row.treatedAt, treatment.restMinutes),
            detached: done(state, ops.harvest) - done(state, ops.sell) - done(state, ops.treat)};
    }

    function validate(state, record, inventory) {
        const row = readGarden(state);
        const borrows = done(state, ops.borrow), returns = done(state, ops.return);
        const grown = done(state, ops.grow), harvested = done(state, ops.harvest);
        const used = done(state, ops.treat), sold = done(state, ops.sell);
        const heldItem = inventory?.[item];
        if (Boolean(row) !== (borrows > 0) || (heldItem?.count ?? heldItem ?? 0) !== harvested - used - sold ||
            (!row && (returns || grown || harvested || used || sold)) ||
            (row && (!pinned(record) || borrows - returns !== Number(row.plant.holder === 'player') ||
                row.plant.leaves !== grown - harvested || (row.grownAt !== null) !== (grown > 0) ||
                (row.treatedAt !== null) !== (used > 0)))) {
            throw Error('The garden plant, harvested leaves and use receipts disagree.');
        }
    }

    function apply(state, {operation}, context) {
        if (context.actorId !== 'player' || !pinned(context.structuredNative) || state.actors.player?.worldId !== world ||
            state.simulation.people.player.location !== annex) throw Error('Work at the garden.');
        const row = readGarden(state);
        if (!options(state, row, context)[operation]) throw Error('The garden is not ready for that action.');
        const next = row ?? {plant: {id: plantId, kind: config.producerKind, alive: true, holder: steward, leaves: 0},
            grownAt: null, treatedAt: null};
        if (operation === ops.borrow || operation === ops.return) {
            next.plant.holder = operation === ops.borrow ? 'player' : steward;
        } else if (operation === ops.grow) {
            if (next.plant.injured) throw Error('Grow a leaf on a healthy plant.');
            const result = runGuStep(config.producerKind, 'grow', {at: state.clock, specimen: next.plant,
                facts: {water: growth.waterCost, reserves: {player: {[config.pool]: growth.essenceCost}}},
                options: {daylight: daylight(state, context), pool: config.pool}});
            next.plant = {...next.plant, leaves: result.facts.leaves};
            next.grownAt = state.clock;
        } else if (operation === ops.harvest) {
            next.plant = {...next.plant, leaves: next.plant.leaves - 1};
        } else {
            const result = runGuStep(config.productKind, 'treat', {at: state.clock,
                specimen: {id: config.productId, kind: config.productKind},
                facts: {treatedAt: next.treatedAt === null ? {} : {player: next.treatedAt}}});
            next.treatedAt = result.facts.treatedAt.player;
        }
        state.worlds[world].facts[key] = JSON.stringify(next);
        return operation === ops.harvest ? {key: item, count: 1} : null;
    }

    return {facts, view, validate, apply};
}
