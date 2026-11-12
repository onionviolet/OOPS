// AR3, AD51. Pure settlement for a host-owned lifecycle slice. The host
// supplies current habitat conditions, authority and any payment settlement.
import {check, natural, object, positive} from './basics.js';
import {address} from './gen_kit.js';
import {addBirthsToFrequencies, drawFromFrequencies, inheritBreeding, inheritGenes, pickParental, removeFromFrequencies,
    validateBreeding, validateGenes} from './heredity.js';

const family = 'creature_lifecycle@1';
const key = value => typeof value === 'string' && value !== '__proto__' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(value);
const traitsValid = traits => object(traits) &&
    Object.entries(traits).every(([name, value]) => key(name) && key(value));
const lookup = (table, id) => Object.hasOwn(table, id) ? table[id] : undefined;
// An organ is a small record of key strings and whole numbers (a Gu Master's aperture:
// grade, rank, stage, condition). What it can hold is a world law read elsewhere
// (living_body.js apertureOrgan), so the save keeps facts, not derived capacity.
// Heredity (GN, PFP27): genes are {locus: [allele, allele]}; `tested` lists loci whose
// alleles the keeper knows (GN6). A cohort may carry allele counts instead of members (GN8).
const genesValid = genes => genes === undefined || object(genes) &&
    Object.entries(genes).every(([locus, pair]) => key(locus) && Array.isArray(pair) && pair.length === 2 && pair.every(key));
const testedValid = (tested, genes) => tested === undefined || Array.isArray(tested) && tested.every(l => genes && Object.hasOwn(genes, l)) &&
    new Set(tested).size === tested.length;
// IH1: hidden breeding values, {trait: whole number}; what shows is drawn from them.
const breedingValid = breeding => breeding === undefined || object(breeding) &&
    Object.entries(breeding).every(([trait, value]) => key(trait) && Number.isSafeInteger(value));
const allelesValid = alleles => alleles === undefined || object(alleles) && Object.entries(alleles).every(([locus, row]) =>
    key(locus) && object(row) && natural(row.strong) && natural(row.plain));
const organsValid = organs => object(organs) && Object.entries(organs).every(([name, organ]) => key(name) &&
    object(organ) && Object.entries(organ).every(([field, value]) => key(field) && (key(value) || natural(value))));

export function restoreCreatureLifecycle(saved) {
    if (saved == null) return {family, revision: 0, nextIdentity: 1, cohorts: {}, individuals: {}, broods: {}, habitats: {}};

    check(object(saved) && saved.family === family && natural(saved.revision) &&
        positive(saved.nextIdentity) && object(saved.cohorts) && object(saved.individuals),
    'Invalid creature lifecycle save.');
    for (const [id, cohort] of Object.entries(saved.cohorts)) {
        check(key(id) && object(cohort) && key(cohort.species) && key(cohort.habitat) && natural(cohort.stock) &&
            allelesValid(cohort.alleles), 'Invalid creature cohort.');
    }
    for (const [id, individual] of Object.entries(saved.individuals)) {
        check(object(individual) && positive(individual.serial) && individual.serial < saved.nextIdentity &&
            id === `creature:${individual.serial}` && key(individual.origin) &&
            key(individual.species) && key(individual.habitat) &&
            (individual.keeper === null || key(individual.keeper)), 'Invalid creature identity.');
        const cohort = lookup(saved.cohorts, individual.origin);
        check(cohort?.species === individual.species, 'Invalid creature origin.');
    }
    const state = structuredClone(saved);
    state.habitats ??= {};
    check(object(state.habitats), 'Invalid creature habitat clocks.');
    for (const [id, habitat] of Object.entries(state.habitats)) {
        check(key(id) && object(habitat) && positive(habitat.interval) && natural(habitat.nextAt) &&
            habitat.nextAt >= habitat.interval && natural(habitat.births) && natural(habitat.losses),
        'Invalid creature habitat clock.');
    }
    state.broods ??= {};
    check(object(state.broods), 'Invalid creature broods.');
    for (const individual of Object.values(state.individuals)) {
        individual.traits ??= {};
        individual.experience ??= {};
        individual.bornAt ??= 0;
        individual.matureAt ??= individual.bornAt;
        check(traitsValid(individual.traits) && natural(individual.bornAt) && natural(individual.matureAt) &&
            individual.matureAt >= individual.bornAt && object(individual.experience), 'Invalid creature development.');
        individual.health ??= {lastAt: individual.bornAt, careUntil: null, injury: null};
        validateHealth(individual.health, individual.bornAt);
        individual.organs ??= {};
        check(organsValid(individual.organs), 'Invalid creature organs.');
        check(genesValid(individual.genes) && testedValid(individual.tested, individual.genes) &&
            breedingValid(individual.breeding), 'Invalid creature genes.');
        for (const [actor, experience] of Object.entries(individual.experience)) {
            check(key(actor) && object(experience) && natural(experience.lastAt) &&
                experience.lastAt >= individual.bornAt && natural(experience.bond) && experience.bond <= 100 &&
                object(experience.training) && Object.entries(experience.training).every(([skill, practice]) =>
                    key(skill) && positive(practice)), 'Invalid creature experience.');
        }
    }
    for (const individual of Object.values(state.individuals)) {
        if (individual.parents === undefined) continue;
        const parents = individual.parents;
        check(Array.isArray(parents) && parents.length === 2 && parents.every(key) &&
            parents[0] !== parents[1], 'Invalid creature birth parentage.');
        for (const id of parents) {
            const parent = lookup(state.individuals, id);
            check(parent && parent.serial < individual.serial && parent.species === individual.species &&
                parent.matureAt < individual.bornAt, 'Invalid creature birth parentage.');
        }
    }
    const occupiedParents = new Set();
    for (const [id, brood] of Object.entries(state.broods)) {
        check(key(id) && object(brood) && Array.isArray(brood.parents) && brood.parents.length === 2 &&
            brood.parents.every(key) && natural(brood.dueAt) &&
            natural(brood.growthMinutes) && natural(brood.dueAt + brood.growthMinutes) &&
            traitsValid(brood.traits) && genesValid(brood.genes) && breedingValid(brood.breeding), 'Invalid creature brood.');
        const [first, second] = brood.parents.map(parent => lookup(state.individuals, parent));
        check(first && second && first !== second && first.species === second.species &&
            first.matureAt < brood.dueAt && second.matureAt < brood.dueAt, 'Invalid creature parents.');
        for (const parent of brood.parents) {
            check(!occupiedParents.has(parent), 'Creature is committed to multiple broods.');
            occupiedParents.add(parent);
        }
    }
    return state;
}

function beginSettlement(state, revision) {
    check(revision === state.revision, 'Creature state changed since this action was prepared.');
    check(natural(revision + 1), 'Creature revision exhausted.');
    return {...state, revision: revision + 1};
}

export function habitatOccupancy(state, habitat, species = null) {
    let count = 0;
    for (const cohort of Object.values(state.cohorts)) {
        if (cohort.habitat === habitat && (species === null || cohort.species === species)) count += cohort.stock;
    }
    for (const individual of Object.values(state.individuals)) {
        if (individual.habitat === habitat && (species === null || individual.species === species)) count++;
    }
    return count;
}

function checkHabitat(state, destination, species, incoming) {
    check(object(destination) && key(destination.id) && natural(destination.capacity) &&
        Array.isArray(destination.supportedSpecies), 'Invalid creature habitat.');
    check(destination.supportedSpecies.includes(species), 'Habitat cannot support this creature.');
    check(habitatOccupancy(state, destination.id) + incoming <= destination.capacity,
        'Habitat has insufficient space.');
    check(habitatOccupancy(state, destination.id, species) + incoming <= preyCapacity(state, destination, species),
        'Habitat has insufficient prey.');
}

export function settleCohortStock(state, {revision, id, species, habitat, delta}) {
    const next = beginSettlement(state, revision);
    check(key(id) && key(species) && key(habitat?.id) && Number.isSafeInteger(delta) && delta !== 0,
        'Invalid cohort change.');
    const cohort = lookup(state.cohorts, id);
    check(!cohort || (cohort.habitat === habitat.id && cohort.species === species),
        'Cohort already belongs to another habitat or species.');
    const stock = (cohort?.stock ?? 0) + delta;
    check(natural(stock), 'Insufficient cohort stock.');
    if (delta > 0) checkHabitat(state, habitat, species, delta);
    // A cohort with allele counts keeps two per member: arrivals join in the herd's
    // proportion, departures leave in it (GN8).
    const alleles = cohort?.alleles && (delta > 0 ? addBirthsToFrequencies(cohort.alleles, delta) :
        removeFromFrequencies(cohort.alleles, -delta));
    return {...next, cohorts: {...state.cohorts, [id]: {...cohort, species, habitat: habitat.id, stock, ...(alleles ? {alleles} : {})}}};
}

// Open a host-owned roster from a finite cohort. The host supplies trait draws
// by acquisition serial, before the lifecycle assigns the individual ID.
export function openCreatureRoster({cohortId, species, destination, keeper, count, clock, traitsFor}) {
    const empty = restoreCreatureLifecycle(null);
    let state = settleCohortStock(empty, {revision: empty.revision, id: cohortId, species, habitat: destination, delta: count});
    for (let index = 0; index < count; index++) {
        state = acquireCreature(state, {revision: state.revision, cohortId, destination, keeper, clock,
            traits: traitsFor(state.nextIdentity)}).state;
    }
    return state;
}

// A roster owns its members and allowed custody habitats. Check the saved
// individuals against those bindings without interpreting host-specific traits.
export function matchesCreatureRoster(state, {ids, cohortId, species, habitats, clock}) {
    if (Object.keys(state.individuals).length !== ids.length || new Set(ids).size !== ids.length) return false;
    const occupancy = new Map();
    return ids.every(id => {
        const individual = lookup(state.individuals, id);
        if (!individual || individual.origin !== cohortId || individual.species !== species ||
            individual.bornAt > clock || individual.health.lastAt > clock) return false;
        const habitat = lookup(habitats, individual.keeper);
        const count = (occupancy.get(individual.keeper) ?? 0) + 1;
        occupancy.set(individual.keeper, count);
        return habitat?.id === individual.habitat && count <= habitat.capacity;
    });
}

export function acquireCreature(state, {
    revision, cohortId, destination, keeper, traits = {}, clock = 0, ageMinutes = 0, growthMinutes = 0,
    genes, breeding, genome, root,
}) {
    const next = beginSettlement(state, revision);
    const cohort = lookup(state.cohorts, cohortId);
    check(cohort?.stock > 0, 'No creature is available in this cohort.');
    check((keeper === null || key(keeper)) && natural(state.nextIdentity + 1), 'Invalid creature acquisition.');
    check(traitsValid(traits) && natural(clock) && natural(ageMinutes) && ageMinutes <= clock &&
        natural(growthMinutes) && natural(clock - ageMinutes + growthMinutes), 'Invalid creature development.');
    checkHabitat(state, destination, cohort.species, Number(cohort.habitat !== destination?.id));

    const bornAt = clock - ageMinutes;
    // GN8: a cohort that keeps allele counts gives the newcomer genes drawn from them
    // and loses those two alleles; otherwise the host may supply genes (a bought animal).
    let left = cohort;
    let carried = genes;
    check(!cohort.alleles || genome, 'This herd keeps allele counts; name its genome to draw from it.');
    if (cohort.alleles && genome) {
        check(carried === undefined && typeof root === 'string', 'Drawing from a herd needs a root and no supplied genes.');
        const drawn = drawFromFrequencies(genome, cohort.alleles, {root, at: address('creature-acquire', cohortId, state.nextIdentity)});
        carried = drawn.genes;
        left = {...cohort, alleles: drawn.alleles};
    }
    check(genesValid(carried) && (carried === undefined || !genome || validateGenes(genome, carried)), 'Invalid creature genes.');
    check(breedingValid(breeding) && (breeding === undefined || !genome || validateBreeding(genome, breeding)), 'Invalid breeding values.');
    return addIndividual({
        ...next, cohorts: {...state.cohorts, [cohortId]: {...left, stock: cohort.stock - 1}},
    }, {origin: cohortId, species: cohort.species, habitat: destination.id, keeper,
        bornAt, matureAt: bornAt + growthMinutes, traits: {...traits},
        ...(carried ? {genes: structuredClone(carried), tested: []} : {}),
        ...(breeding ? {breeding: {...breeding}} : {})}, clock);
}

function addIndividual(state, fields, settledAt = fields.bornAt) {
    const serial = state.nextIdentity;
    check(natural(serial + 1), 'Creature identity exhausted.');
    const id = `creature:${serial}`;
    return {id, state: {...state, nextIdentity: serial + 1,
        individuals: {...state.individuals, [id]: {...fields, serial, experience: {}, organs: {},
            health: {lastAt: settledAt, careUntil: null, injury: null}}}}};
}

export function transferCreature(state, {revision, id, fromKeeper, toKeeper, destination, clock}) {
    const next = beginSettlement(state, revision);
    const individual = lookup(state.individuals, id);
    check(individual && individual.keeper === fromKeeper, 'Creature custody has changed.');
    check(toKeeper === null || key(toKeeper), 'Invalid creature keeper.');
    checkHabitat(state, destination, individual.species, Number(individual.habitat !== destination?.id));
    const moving = individual.habitat !== destination.id || fromKeeper !== toKeeper;
    check(!moving || individual.health.careUntil === null || clock !== undefined,
        'Transfer needs a time to settle active care.');
    const health = clock === undefined ? individual.health : projectHealth(individual, clock);
    return {...next, individuals: {...state.individuals, [id]: {
        ...individual, keeper: toKeeper, habitat: destination.id,
        health: moving ? {...health, careUntil: null} : health,
    }}};
}

// L phase 2 (SC table: aperture as a body organ with capacity, for R and G). The
// world's law sets what the organ is worth; this records what the body has. A null
// organ removes it (a destroyed aperture is a condition, not a deletion, by default).
export function setCreatureOrgan(state, {revision, id, organ, value}) {
    const next = beginSettlement(state, revision);
    const animal = lookup(state.individuals, id);
    check(animal && key(organ), 'Unknown creature or organ.');
    const organs = {...animal.organs};
    if (value === null) delete organs[organ];
    else organs[organ] = {...value};
    check(organsValid(organs), 'Invalid creature organ.');
    return {...next, individuals: {...state.individuals, [id]: {...animal, organs}}};
}

// GN6: a test (or a deduction from a child) makes one locus known to the keeper.
export function markCreatureGenesKnown(state, {revision, id, loci}) {
    const next = beginSettlement(state, revision);
    const animal = lookup(state.individuals, id);
    check(animal?.genes && Array.isArray(loci) && loci.every(l => Object.hasOwn(animal.genes, l)), 'Nothing to test.');
    const tested = [...new Set([...(animal.tested ?? []), ...loci])];
    return {...next, individuals: {...state.individuals, [id]: {...animal, tested}}};
}

// GN8: a herd or wild population away from the player keeps allele counts, two per member.
export function setCohortAlleles(state, {revision, id, alleles}) {
    const next = beginSettlement(state, revision);
    const cohort = lookup(state.cohorts, id);
    check(cohort && allelesValid(alleles) && Object.values(alleles).every(row => row.strong + row.plain === 2 * cohort.stock),
        'Allele counts must be two per member of the cohort.');
    return {...next, cohorts: {...state.cohorts, [id]: {...cohort, alleles: structuredClone(alleles)}}};
}

export function creatureDevelopment(state, id, clock) {
    const animal = lookup(state.individuals, id);
    check(animal && natural(clock) && clock >= animal.bornAt, 'Invalid creature age query.');
    return {ageMinutes: clock - animal.bornAt, mature: clock >= animal.matureAt};
}

export function practiceWithCreature(state, {
    revision, id, actor, clock, minimumGap, bondGain, skill = null,
}) {
    const next = beginSettlement(state, revision);
    const animal = lookup(state.individuals, id);
    check(animal && key(actor) && (animal.keeper === actor || animal.keeper === null),
        'Creature is in another keeper’s custody.');
    check(natural(clock) && clock >= animal.bornAt && positive(minimumGap) &&
        natural(bondGain) && bondGain <= 100 && (skill === null || key(skill)) &&
        (bondGain > 0 || skill !== null), 'Invalid creature practice.');
    const previous = lookup(animal.experience, actor);
    check(!previous || clock - previous.lastAt >= minimumGap, 'Creature needs time between sessions.');
    const training = {...previous?.training};
    if (skill !== null) {
        const count = (lookup(training, skill) ?? 0) + 1;
        check(positive(count), 'Creature training limit reached.');
        training[skill] = count;
    }
    const experience = {...animal.experience, [actor]: {
        lastAt: clock, bond: Math.min(100, (previous?.bond ?? 0) + bondGain), training,
    }};
    return {...next, individuals: {...state.individuals, [id]: {...animal, experience}}};
}

// Local rules supply compatible reproductive roles and gestation timing. Once
// started, a brood keeps its parent IDs, due time and addressed trait draws.
export function startCreatureBrood(state, {
    revision, parents, keeper, clock, gestationMinutes, growthMinutes, root, genome, exposure = {},
}) {
    const next = beginSettlement(state, revision);
    check(Array.isArray(parents) && parents.length === 2 && parents.every(key) &&
        parents[0] !== parents[1] && key(keeper), 'Invalid creature parents.');
    check(natural(clock) && positive(gestationMinutes) && natural(growthMinutes) &&
        natural(clock + gestationMinutes + growthMinutes), 'Invalid creature growth interval.');
    const [first, second] = parents.map(id => lookup(state.individuals, id));
    check(first && second && first.keeper === keeper && second.keeper === keeper &&
        first.habitat === second.habitat && first.species === second.species &&
        first.matureAt <= clock && second.matureAt <= clock, 'Parents need compatible adult stock in the same habitat.');
    check(!Object.values(state.broods).some(brood => brood.parents.some(id => parents.includes(id))),
        'A parent already has a pending brood.');
    const id = `brood:${next.revision}`;
    // Whole traits copy from one parent (the parental draw, OA5); loci with alleles follow
    // the genome's rules when the kind has one (GN1), with exposure raising mutation (GN4).
    const traits = {};
    for (const name of new Set([...Object.keys(first.traits), ...Object.keys(second.traits)]))
        traits[name] = pickParental(root, id, name, lookup(first.traits, name), lookup(second.traits, name));
    let genes;
    let mutated = [];
    if (genome) {
        check(first.genes && second.genes, 'Both parents need genes for this kind.');
        ({genes, mutated} = inheritGenes(genome, first.genes, second.genes, {root, at: address('creature-genes', id), exposure}));
    }
    const breeding = genome && first.breeding && second.breeding && Object.keys(genome.polygenic ?? {}).length ?
        inheritBreeding(genome, first.breeding, second.breeding, {root, at: address('creature-breeding', id)}) : undefined;
    return {id, mutated, state: {...next, broods: {...state.broods, [id]: {
        parents: [...parents], dueAt: clock + gestationMinutes, growthMinutes, traits, ...(genes ? {genes} : {}),
        ...(breeding ? {breeding} : {}),
    }}}};
}

export function settleCreatureBirth(state, {revision, broodId, clock, destination}) {
    const next = beginSettlement(state, revision);
    const brood = lookup(state.broods, broodId);
    check(brood && natural(clock) && clock >= brood.dueAt, 'No creature birth is due.');
    const carrier = lookup(state.individuals, brood.parents[0]);
    check(carrier.habitat === destination?.id, 'Birth must settle where the carrying parent is.');
    check(natural(clock + brood.growthMinutes), 'Invalid creature growth interval.');
    checkHabitat(state, destination, carrier.species, 1);
    const broods = {...state.broods};
    delete broods[broodId];
    return addIndividual({...next, broods}, {origin: carrier.origin, species: carrier.species,
        habitat: carrier.habitat, keeper: carrier.keeper, bornAt: clock,
        matureAt: clock + brood.growthMinutes, traits: {...brood.traits}, parents: [...brood.parents],
        ...(brood.genes ? {genes: structuredClone(brood.genes), tested: []} : {}),
        ...(brood.breeding ? {breeding: {...brood.breeding}} : {})});
}

function validateHealth(health, bornAt) {
    check(object(health) && natural(health.lastAt) && health.lastAt >= bornAt &&
        (health.careUntil === null || natural(health.careUntil) && health.careUntil > health.lastAt),
    'Invalid creature care interval.');
    const wound = health.injury;
    if (wound === null) return;
    check(object(wound) && key(wound.kind) && natural(wound.at) && wound.at >= bornAt &&
        wound.at <= health.lastAt && positive(wound.required) && natural(wound.remaining) &&
        wound.remaining <= wound.required && (wound.remaining === 0 ?
            natural(wound.healedAt) && wound.healedAt >= wound.at && wound.healedAt <= health.lastAt :
            wound.healedAt === null), 'Invalid creature injury.');
}

function projectHealth(animal, clock) {
    const health = animal.health;
    check(natural(clock) && clock >= health.lastAt, 'Creature care cannot run backward.');
    const activeMinutes = health.careUntil === null ? 0 : Math.min(health.careUntil, clock) - health.lastAt;
    let injury = health.injury;
    if (injury?.remaining > 0 && activeMinutes > 0) {
        const remaining = Math.max(0, injury.remaining - activeMinutes);
        injury = {...injury, remaining,
            healedAt: remaining === 0 ? health.lastAt + injury.remaining : null};
    }
    return {lastAt: clock, careUntil: health.careUntil > clock ? health.careUntil : null, injury};
}

export function creatureHealth(state, id, clock) {
    const animal = lookup(state.individuals, id);
    check(animal, 'Unknown creature.');
    return structuredClone(projectHealth(animal, clock));
}

function settleHealth(state, revision, id, clock, apply) {
    const next = beginSettlement(state, revision);
    const animal = lookup(state.individuals, id);
    check(animal, 'Unknown creature.');
    const health = apply(projectHealth(animal, clock), animal);
    return {...next, individuals: {...state.individuals, [id]: {...animal, health}}};
}

export function injureCreature(state, {revision, id, clock, kind, recoveryMinutes}) {
    check(key(kind) && positive(recoveryMinutes), 'Invalid creature injury.');
    return settleHealth(state, revision, id, clock, health => {
        check(!health.injury?.remaining, 'Creature already has an active injury.');
        return {...health, injury: {kind, at: clock, required: recoveryMinutes,
            remaining: recoveryMinutes, healedAt: null}};
    });
}

// A second hurt while a wound is open worsens it instead of being refused (L phase 2,
// one door for hits from C and backlash from R). The first kind stays the wound's
// kind; the extra recovery adds to both what is owed and what was required.
export function aggravateCreatureInjury(state, {revision, id, clock, recoveryMinutes}) {
    check(positive(recoveryMinutes), 'Invalid creature injury.');
    return settleHealth(state, revision, id, clock, health => {
        check(health.injury?.remaining > 0, 'Creature has no open wound to worsen.');
        const {injury} = health;
        check(natural(injury.required + recoveryMinutes), 'Creature injury exhausted.');
        return {...health, injury: {...injury, required: injury.required + recoveryMinutes,
            remaining: injury.remaining + recoveryMinutes}};
    });
}

// The host checks actual supplies, shelter and access and settles the payment
// with this result. The supplied duration can come from the shared needs reader.
export function startCreatureCare(state, {revision, id, clock, keeper, duration}) {
    check(natural(clock) && positive(duration) && natural(clock + duration), 'Invalid creature care duration.');
    return settleHealth(state, revision, id, clock, (health, animal) => {
        check(key(keeper) && animal.keeper === keeper, 'Creature needs its current keeper.');
        check(health.careUntil === null, 'Creature already has active care.');
        return {...health, careUntil: clock + duration};
    });
}

export function settleCreatureCare(state, {revision, id, clock, interrupted = false}) {
    return settleHealth(state, revision, id, clock, health =>
        interrupted ? {...health, careUntil: null} : health);
}

// Shared habitat windows run in local played minutes. The caller advances to
// the boundary of changes in habitat policy or stock before applying them.
export function openWildHabitat(state, {revision, id, clock, interval}) {
    const next = beginSettlement(state, revision);
    check(key(id) && natural(clock) && positive(interval) && natural(clock + interval) &&
        !lookup(state.habitats, id), 'Invalid or already active wild habitat clock.');
    return {...next, habitats: {...state.habitats, [id]: {interval, nextAt: clock + interval, births: 0, losses: 0}}};
}

const WILD_WINDOW_BUDGET = 64;

export function advanceWildHabitat(state, {revision, habitat, clock, populations}) {
    check(revision === state.revision, 'Creature state changed since this action was prepared.');
    const ledger = object(habitat) && lookup(state.habitats, habitat.id);
    check(ledger && natural(clock) && clock >= ledger.nextAt - ledger.interval &&
        natural(habitat.capacity) && Array.isArray(habitat.supportedSpecies) &&
        Array.isArray(populations) && populations.length <= 32, 'Invalid wild habitat advance.');
    const ids = new Set();
    for (const population of populations) {
        const cohort = object(population) && lookup(state.cohorts, population.id);
        check(cohort && cohort.habitat === habitat.id && !ids.has(population.id) &&
            natural(population.births) && natural(population.losses), 'Invalid wild population policy.');
        ids.add(population.id);
    }

    let current = state;
    let windows = 0;
    while (clock >= current.habitats[habitat.id].nextAt && windows < WILD_WINDOW_BUDGET) {
        current = settleWildWindow(current, habitat, populations);
        windows++;
    }
    const nextAt = current.habitats[habitat.id].nextAt;
    return {state: current, windows, settledThrough: nextAt > clock ? clock : nextAt - ledger.interval,
        pending: nextAt <= clock};
}

function settleWildWindow(state, habitat, populations) {
    const previous = state.habitats[habitat.id];
    const next = beginSettlement(state, state.revision);
    const ledger = {...previous, nextAt: previous.nextAt + previous.interval};
    const cohorts = {...state.cohorts};
    const working = {...next, cohorts, habitats: {...state.habitats, [habitat.id]: ledger}};
    // Species compete for space in authored order. Loss decisions use the
    // opening window's stock, so a newborn cannot retroactively supply prey.
    let free = habitat.capacity - habitatOccupancy(state, habitat.id);
    for (const {id, losses} of populations) {
        const cohort = cohorts[id];
        const species = cohort.species;
        const supported = habitat.supportedSpecies.includes(species) ? preyCapacity(state, habitat, species) : 0;
        const deficit = Math.max(0, -free, habitatOccupancy(working, habitat.id, species) - supported);
        const removed = Math.min(cohort.stock, losses, deficit);
        cohorts[id] = {...cohort, stock: cohort.stock - removed,
            ...(cohort.alleles ? {alleles: removeFromFrequencies(cohort.alleles, removed)} : {})};
        free += removed;
        ledger.losses += removed;
    }
    for (const {id, births} of populations) {
        const cohort = cohorts[id];
        if (habitatOccupancy(working, habitat.id, cohort.species) === 0 || free <= 0 || births === 0 ||
            !habitat.supportedSpecies.includes(cohort.species)) continue;
        const prey = preyCapacity(state, habitat, cohort.species);
        const space = prey - habitatOccupancy(working, habitat.id, cohort.species);
        const added = Math.max(0, Math.min(births, free, space));
        cohorts[id] = {...cohort, stock: cohort.stock + added,
            ...(cohort.alleles ? {alleles: addBirthsToFrequencies(cohort.alleles, added)} : {})};
        free -= added;
        ledger.births += added;
    }
    check(natural(ledger.nextAt) && natural(ledger.births) && natural(ledger.losses), 'Wild habitat ledger exhausted.');
    return working;
}

function preyCapacity(state, habitat, species) {
    const prey = habitat.preyRequirements && lookup(habitat.preyRequirements, species);
    if (!prey) return Infinity;
    check(key(prey.species) && prey.species !== species && positive(prey.perPredator),
        'Invalid habitat prey requirement.');
    return Math.floor(habitatOccupancy(state, habitat.id, prey.species) / prey.perPredator);
}
