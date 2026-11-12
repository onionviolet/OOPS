import {acquireCreature, practiceWithCreature, settleCohortStock, transferCreature} from './creature_lifecycle.js';
import {drawGuTraits, wildWormTraits} from './gu_traits.js';
import {guCatalogue} from './gu_catalogue.js';

export const liquorWormSpecies = 'liquor-worm';
const fourFlavors = guCatalogue['four-flavors-liquor-worm'];
export const liquorWormConversion = guCatalogue[liquorWormSpecies].conversion.value;
export const fourFlavorsConversion = fourFlavors.conversion.value;
export const fourFlavorsRecipe = fourFlavors.recipe.value;
export const fourFlavorsWines = Object.freeze([
    {flavor: 'sour', label: 'Redberry wine'}, {flavor: 'sweet', label: 'Golden honey wine'},
    {flavor: 'bitter', label: 'Bitter shell wine'}, {flavor: 'spicy', label: 'White grains liquor'},
]);
const habitat = id => ({id, capacity: 10, supportedSpecies: [liquorWormSpecies]});

export function discoverLiquorWorm(lifecycle, {site, seed, source, identity, clock}) {
    const destination = habitat(site);
    const cohortId = 'liquor-worms';
    const stocked = settleCohortStock(lifecycle, {revision: lifecycle.revision, id: cohortId,
        species: liquorWormSpecies, habitat: destination, delta: 1});
    const traits = drawGuTraits({seed, source, identity, table: wildWormTraits});
    return acquireCreature(stocked, {revision: stocked.revision, cohortId,
        destination, keeper: null, traits, clock});
}

export function moveLiquorWorm(lifecycle, id, {keeper, site, clock}) {
    return transferCreature(lifecycle, {revision: lifecycle.revision, id, fromKeeper: lifecycle.individuals[id].keeper,
        toKeeper: keeper, destination: habitat(site), clock});
}

export function lureLiquorWorm(lifecycle, id, actor, clock, minimumGap) {
    return practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor, clock, minimumGap, bondGain: 30});
}

export function liquorWormFamiliarity(creature, actor) {
    return creature?.experience[actor]?.bond ?? 0;
}

export function liquorWormApproachable(creature, actor) {
    return liquorWormFamiliarity(creature, actor) >= (creature.traits.temperament === 'bold' ? 30 : 60);
}

export function liquorWormTrailWindow(creature, actor) {
    const base = creature.traits.temperament === 'wary' ? 6 : 12;
    return base + Math.floor(liquorWormFamiliarity(creature, actor) / 15);
}

export function liquorWormWineArrival(clock, lastDrink) {
    return Math.max(clock + 5, lastDrink === null ? 0 : lastDrink + 20);
}
