import {advanceWildHabitat, openWildHabitat, restoreCreatureLifecycle, settleCohortStock} from './creature_lifecycle.js';

// Ch. 467 and 474 establish the habitat. Quantities and timing are game dials.
export const starFireflyFarm = Object.freeze({
    id: 'starlight-colony', ordinary: 'ordinary-starlight-firefly', gu: 'starlight-firefly',
    minimum: 6, growth: 2, losses: 2, starterStock: 4, starterGrass: 4,
});
const MAX_WINDOWS = 64;

function habitat(colony, rule) {
    return {id: colony.habitat, capacity: colony.starGrass * 2, supportedSpecies: [rule.ordinary, rule.gu]};
}

function changeStock(colony, rule, species, delta) {
    const populations = settleCohortStock(colony.populations, {revision: colony.populations.revision,
        id: species, species, habitat: habitat(colony, rule), delta});
    return {...colony, populations};
}

const stock = (colony, species) => colony.populations.cohorts[species]?.stock ?? 0;
const nextAt = colony => colony.populations.habitats[colony.habitat].nextAt;

export function openGuColony(rule, {clock, interval, site = rule.id}) {
    const colony = {habitat: site, starGrass: rule.starterGrass, light: 'shaded', settledAt: clock,
        populations: openWildHabitat(restoreCreatureLifecycle(null), {revision: 0, id: site, clock, interval})};
    return changeStock(colony, rule, rule.ordinary, rule.starterStock);
}

export function restoreGuColony(saved, rule) {
    if (!saved || !Number.isSafeInteger(saved.starGrass) || saved.starGrass < 0 ||
        !Number.isSafeInteger(saved.starGrass * 2) || !['shaded', 'exposed'].includes(saved.light)) {
        throw Error('Invalid Gu colony habitat.');
    }
    const populations = restoreCreatureLifecycle(saved.populations);
    const cohort = populations.cohorts[rule.ordinary];
    const calendar = populations.habitats[saved.habitat];
    if (!Object.hasOwn(populations.habitats, saved.habitat) || cohort?.species !== rule.ordinary ||
        !Number.isSafeInteger(saved.settledAt) || saved.settledAt < calendar.nextAt - calendar.interval ||
        saved.settledAt >= calendar.nextAt ||
        Object.keys(populations.habitats).length !== 1 ||
        Object.entries(populations.cohorts).some(([id, row]) =>
            row.habitat !== saved.habitat || row.species !== id || ![rule.ordinary, rule.gu].includes(id))) {
        throw Error('Invalid Gu colony populations.');
    }
    return {...saved, populations};
}

export function advanceGuColony(colony, rule, clock) {
    const opening = colony.populations.habitats[colony.habitat];
    if (!Number.isSafeInteger(clock) || clock < colony.settledAt) throw Error('Invalid colony clock.');
    let current = colony;
    let windows = 0;
    while (clock >= nextAt(current) && windows < MAX_WINDOWS) {
        const starGrass = current.light === 'exposed' ? Math.max(0, current.starGrass - 1) : current.starGrass;
        current = {...current, starGrass};
        const parcel = habitat(current, rule);
        const populations = [{id: rule.ordinary, births: rule.growth, losses: rule.losses}];
        if (Object.hasOwn(current.populations.cohorts, rule.gu)) populations.push({id: rule.gu, births: 0, losses: rule.losses});
        const population = advanceWildHabitat(current.populations, {
            revision: current.populations.revision, habitat: parcel, clock: nextAt(current), populations,
        });
        current = {...current, populations: population.state};
        const ordinary = stock(current, rule.ordinary);
        if (current.light === 'shaded' && ordinary >= rule.minimum && ordinary + stock(current, rule.gu) <= parcel.capacity) {
            current = changeStock(current, rule, rule.ordinary, -1);
            current = changeStock(current, rule, rule.gu, 1);
        }
        windows++;
    }
    const pending = nextAt(current) <= clock;
    return {colony: {...current, settledAt: pending ? nextAt(current) - opening.interval : clock}, windows, pending};
}

export function changeGuColonyLight(colony, light) {
    if (!['shaded', 'exposed'].includes(light)) throw Error('Choose shaded or exposed light for a colony.');
    return {...colony, light};
}

export function plantGuColonyGrass(colony) {
    return {...colony, starGrass: colony.starGrass + 1};
}

export function collectGuColony(colony, rule) {
    if (!stock(colony, rule.gu)) throw Error('No Gu has emerged from the colony.');
    return {colony: changeStock(colony, rule, rule.gu, -1), kind: rule.gu};
}

export function guColonyView(colony, rule) {
    return {...colony, ordinary: stock(colony, rule.ordinary), emerged: stock(colony, rule.gu), nextCheck: nextAt(colony)};
}

// Prepare a complete habitat transition before the host charges or grants
// inventory. Policy changes apply only after settling earlier windows.
export function settleGuColonyAction(colony, rule, clock, action) {
    const advanced = advanceGuColony(colony, rule, clock);
    if (advanced.pending || action.kind === 'advance') return advanced;
    const settled = advanced.colony;
    switch (action.kind) {
        case 'light': return {...advanced, colony: changeGuColonyLight(settled, action.light)};
        case 'plant': return {...advanced, colony: plantGuColonyGrass(settled)};
        case 'collect': {
            const collected = collectGuColony(settled, rule);
            return {...advanced, colony: collected.colony, collected: collected.kind};
        }
        default: throw Error('Unknown Gu colony action.');
    }
}
