import {habitatOccupancy, settleCohortStock} from './creature_lifecycle.js';
import {resolveGuActivation} from './gu_activation.js';

export const antNestKind = 'ant-nest';
export const antNestRank = 8;
export const antNestCost = 1;
export const antNestMaterial = 1;
export const antBroodRations = 1;
export const armyAntCastes = ['queen', 'worker', 'soldier'];
const species = caste => `army-ant-${caste}`;
export const armyAntHabitat = Object.freeze({id: 'army-ant-tray', capacity: 12, supportedSpecies: armyAntCastes.map(species)});

export function armyAntCounts(lifecycle, habitat = armyAntHabitat) {
    return Object.fromEntries(armyAntCastes.map(caste => [caste, habitatOccupancy(lifecycle, habitat.id, species(caste))]));
}

function changeCaste(lifecycle, habitat, caste, delta) {
    return settleCohortStock(lifecycle, {revision: lifecycle.revision, id: `${habitat.id}.${caste}`,
        species: species(caste), habitat, delta});
}

export function produceArmyAnts(lifecycle, {gu, operator, reserve, material, now, habitat = armyAntHabitat}) {
    if (gu?.kind !== antNestKind || gu.rank !== antNestRank || gu.holder !== operator ||
        gu.wildWill || !Number.isSafeInteger(material) || material < antNestMaterial) {
        throw Error('Ant Nest needs its living Gu and suitable immortal material.');
    }
    if (!Number.isSafeInteger(reserve) || reserve < antNestCost) throw Error('Ant Nest needs enough stored immortal essence.');
    const activation = resolveGuActivation({
        stages: [{gu, operator, ability: {fuel: 'immortal', cost: antNestCost},
            supply: {pool: 'rank-eight-dose', family: 'immortal', rank: antNestRank, source: 'stored'}}],
        reserves: {[operator]: {'rank-eight-dose': reserve}}, day: now,
    });
    if (activation.outcome !== 'complete') throw Error('Ant Nest needs enough stored immortal essence.');
    const withQueen = changeCaste(lifecycle, habitat, 'queen', 1);
    return {lifecycle: changeCaste(withQueen, habitat, 'worker', 2), activation, materialUsed: antNestMaterial};
}

export function armyAntBroodReady(lifecycle, habitat = armyAntHabitat) {
    const {queen, worker} = armyAntCounts(lifecycle, habitat);
    return queen > 0 && worker >= 2 && habitatOccupancy(lifecycle, habitat.id) + 2 <= habitat.capacity;
}

export function hatchArmyAntBrood(lifecycle, {ration, habitat = armyAntHabitat}) {
    if (!Number.isSafeInteger(ration) || ration < antBroodRations || !armyAntBroodReady(lifecycle, habitat)) {
        throw Error('The queen needs a worker brood, food and room to raise it.');
    }
    return changeCaste(changeCaste(lifecycle, habitat, 'worker', 1), habitat, 'soldier', 1);
}

export function sendArmyAntSoldiers(lifecycle, habitat = armyAntHabitat) {
    if (armyAntCounts(lifecycle, habitat).soldier < 2) throw Error('At least two soldier ants are needed for the beetles.');
    return changeCaste(lifecycle, habitat, 'soldier', -1);
}
