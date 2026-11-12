import {guColonyView, openGuColony, restoreGuColony, settleGuColonyAction, starFireflyFarm} from './gu_colony.js';
import {acquireCreature, creatureHealth, injureCreature, startCreatureCare} from './creature_lifecycle.js';

export const keeperFarm = 'book.ri.keeper.firefly_farm';
export const keeperFireflyCare = 'book.ri.keeper.firefly_care';
export const keeperFarmWorld = 'book.ri.keeper.world';
export const fireflyItem = JSON.stringify({id: `${keeperFarm}.starlight_firefly`});
const farmFact = `${keeperFarm}.colony`;
const operations = new Set(['start', 'shade', 'expose', 'plant', 'collect', 'advance']);
const careOperations = new Set(['keep', 'shine', 'care']);
const enclosure = {id: `${keeperFireflyCare}.enclosure`, capacity: 1, supportedSpecies: [starFireflyFarm.gu]};

export function isKeeperColonyEffect(effect) {
    return effect.actor === 'player' && keeperColonyEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(key => ['actor', 'operation', 'type'].includes(key));
}

export function keeperColonyEffectPack(operation) {
    return operations.has(operation) ? keeperFarm : careOperations.has(operation) ? keeperFireflyCare : null;
}

function readColony(state) {
    const raw = state.worlds[keeperFarmWorld]?.facts?.[farmFact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 8192) throw Error('Invalid saved firefly colony.');
    const colony = restoreGuColony(JSON.parse(raw), starFireflyFarm);
    if (colony.habitat !== keeperFarm || colony.settledAt > state.clock ||
        colony.populations.habitats[keeperFarm].interval !== 60) throw Error('The firefly colony calendar disagrees.');
    return colony;
}

export function validateKeeperColony(state, record) {
    const colony = readColony(state);
    if (colony && !record.extensions?.some(pin => pin.id === keeperFarm)) {
        throw Error('The firefly colony needs its Gu house permission.');
    }
    const kept = Object.values(colony?.populations.individuals ?? {});
    if (kept.length && (!record.extensions?.some(pin => pin.id === keeperFireflyCare) || kept.length > enclosure.capacity ||
        kept.some(row => row.habitat !== enclosure.id || row.keeper !== 'player' || row.species !== starFireflyFarm.gu))) {
        throw Error('The kept firefly Gu and its enclosure disagree.');
    }
}

function keptFirefly(colony, clock) {
    const id = Object.keys(colony.populations.individuals)[0];
    if (!id) return null;
    const health = creatureHealth(colony.populations, id, clock);
    return {id, tired: (health.injury?.remaining ?? 0) > 0, resting: health.careUntil !== null};
}

export function keeperColonyView(state) {
    const colony = readColony(state);
    if (!colony) return null;
    const {colony: current, pending} = settleGuColonyAction(colony, starFireflyFarm, state.clock, {kind: 'advance'});
    const {ordinary, emerged, light, starGrass, nextCheck} = guColonyView(current, starFireflyFarm);
    return {ordinary, emerged, light, starGrass, nextCheck, pending, kept: keptFirefly(current, state.clock)};
}

export function keeperColonyFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperFarmWorld) return {};
    const view = keeperColonyView(state);
    return {
        [`${keeperFarm}.active`]: !!view,
        [`${keeperFarm}.ready`]: !!view && !view.pending,
        [`${keeperFarm}.pending`]: !!view?.pending,
        [`${keeperFarm}.emerged`]: view?.emerged ?? 0,
        [`${keeperFarm}.light`]: view?.light ?? '',
        [`${keeperFireflyCare}.kept`]: !!view?.kept,
        [`${keeperFireflyCare}.tired`]: !!view?.kept?.tired,
        [`${keeperFireflyCare}.resting`]: !!view?.kept?.resting,
    };
}

export function applyKeeperColonyEffect(state, effect, context) {
    if (!isKeeperColonyEffect(effect) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperFarmWorld || state.simulation.people.player.location !== 'book.ri.keeper.annex' ||
        !context.structuredNative?.extensions?.some(pin => pin.id === keeperColonyEffectPack(effect.operation))) {
        throw Error('Tend the firefly colony at the Gu house.');
    }
    const previous = readColony(state);
    let next;
    let collected;
    if (effect.operation === 'start') {
        if (previous) throw Error('The firefly colony is already open.');
        next = openGuColony(starFireflyFarm, {clock: state.clock, interval: 60, site: keeperFarm});
    } else if (careOperations.has(effect.operation)) {
        if (!previous) throw Error('Set up the firefly colony first.');
        const settled = settleGuColonyAction(previous, starFireflyFarm, state.clock, {kind: 'advance'});
        if (settled.pending) throw Error('Check the overdue colony before tending it.');
        next = careForFirefly(settled.colony, effect.operation, state.clock);
    } else {
        if (!previous) throw Error('Set up the firefly colony first.');
        const operation = effect.operation;
        const action = operation === 'shade' || operation === 'expose'
            ? {kind: 'light', light: operation === 'shade' ? 'shaded' : 'exposed'} : {kind: operation};
        const result = settleGuColonyAction(previous, starFireflyFarm, state.clock, action);
        if (result.pending && operation !== 'advance') throw Error('Check the overdue colony before tending it.');
        next = result.colony;
        collected = result.collected;
    }
    state.worlds[keeperFarmWorld].facts[farmFact] = JSON.stringify(next);
    return collected ? fireflyItem : null;
}

function careForFirefly(colony, operation, clock) {
    const {populations} = colony;
    const kept = keptFirefly(colony, clock);
    const request = {revision: populations.revision, clock};
    if (operation === 'keep') {
        if (kept) throw Error('The care enclosure is occupied.');
        const acquired = acquireCreature(populations, {...request, cohortId: starFireflyFarm.gu,
            destination: enclosure, keeper: 'player'});
        return {...colony, populations: acquired.state};
    }
    if (!kept) throw Error('Keep a firefly Gu before using the enclosure.');
    if (operation === 'shine') {
        if (kept.resting) throw Error('Let the firefly finish resting.');
        return {...colony, populations: injureCreature(populations, {...request, id: kept.id,
            kind: 'light-fatigue', recoveryMinutes: 30})};
    }
    if (!kept.tired) throw Error('The firefly is ready to shine.');
    return {...colony, populations: startCreatureCare(populations, {...request, id: kept.id, keeper: 'player', duration: 30})};
}
