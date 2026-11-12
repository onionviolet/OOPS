// Living-kind catalogue (foundation chat L, phase 2, 2026-11-12; proposal under AD56).
// One row per kind of living thing: the lineage and body parts of L's grammar
// (docs/gm/dispatch/foundation-l-2026-11-12/CHECKPOINT.md, G1-G5). A kind row is
// data that the shared lifecycle (creature_lifecycle.js), the body read
// (living_body.js) and the substrate pack (world_substrate_packs/living_body.js)
// run. A new canon creature costs a row here, not a host module (PFP1).
//
// Fields, each a default with a dial:
//   class        animal | plant | gu | person | construct. What the body is made of.
//   needs        a needs.js BODIES key, or null when the kind lives off its habitat's
//                supply (a wild cohort) and no ration is counted for it.
//   inheritance  coin (per-trait draw between two parents, the lifecycle default),
//                alleles (lineage_traits.js genetics), none (traits drawn from a source).
//   reproduction pair, cohort (births settled by habitat windows), seed, cutting,
//                emergence (born from a place's conditions), refinement (made, G and F).
//   stages       ordered stage ids. The lifecycle supplies juvenile before matureAt and
//                adult after; elder needs a lifespan.
//   lifespan     minutes, or null: no death by age unless a world sets it (BHR16 spirit).
//   organs       organ ids this kind can carry (aperture for a Gu Master's body). The
//                numbers for an organ come from a world pack, never from this file (PFP3).
//   diet         what supplies it: {prey} for a predator, {food} for a ration.
//   source       {kind: original | book, locator}. Book rows name the chapter that shows it.
//   genome       id of a genome row (living_genomes.js, GN1) when the kind's heredity runs on
//                alleles; a kind without one copies whole traits from one parent.
//   hosts        the modules that use this kind today (for PFP2 counting, not authority).
//   placeholder  true for a row L holds until its owner's catalogue supplies it.
// World numbers (rations, gestation minutes, prices) stay with the host or world pack.
import {check, object} from './basics.js';
import {LIVING_GENOMES} from './living_genomes.js';

export const LIVING_KINDS_REVISION = 1;
export const LIVING_CLASSES = Object.freeze(['animal', 'plant', 'gu', 'person', 'construct']);
export const LIVING_INHERITANCE = Object.freeze(['coin', 'alleles', 'none']);
export const LIVING_REPRODUCTION = Object.freeze(['pair', 'cohort', 'seed', 'cutting', 'emergence', 'refinement']);
export const LIVING_ORGANS = Object.freeze(['aperture']);

const idLike = value => typeof value === 'string' && /^[a-z][a-z0-9_-]*$/.test(value);
const original = host => ({kind: 'original', locator: host});

const row = (id, label, klass, fields = {}) => ({id, label, class: klass, needs: null, inheritance: 'coin',
    reproduction: [], stages: ['juvenile', 'adult'], lifespan: null, organs: [], diet: {}, ...fields});

// Kinds the hosts in src name today, with the host that names them.
export const LIVING_KIND_ROWS = Object.freeze([
    row('sheep', 'Fleece sheep', 'animal', {needs: 'sheep', reproduction: ['pair'], diet: {food: 'Meadow hay'},
        inheritance: 'alleles', genome: 'village.sheep',
        source: original('habitat_care.js'), hosts: ['habitat_care.js']}),
    row('house_cat', 'House cat', 'animal', {needs: 'house_cat', reproduction: ['pair'],
        source: original('absorb_p23/household/model.js'), hosts: ['absorb_p23/household/model.js']}),
    row('rabbit', 'Rabbit', 'animal', {reproduction: ['cohort'], inheritance: 'alleles', genome: 'village.rabbit',
        source: original('meadow_wildlife.js'), hosts: ['meadow_wildlife.js']}),
    row('fox', 'Fox', 'animal', {reproduction: ['cohort'], diet: {prey: 'rabbit'},
        source: original('meadow_wildlife.js'), hosts: ['meadow_wildlife.js']}),
    row('reed-terrapin', 'Reed terrapin', 'animal', {reproduction: ['pair'],
        source: original('meadow_shell_state.js'), hosts: ['meadow_shell_state.js']}),
    row('reed-construct', 'Reed construct', 'construct', {needs: 'construct', inheritance: 'none', stages: ['adult'],
        reproduction: ['refinement'], source: original('meadow_courier.js'), hosts: ['meadow_courier.js']}),
    row('cloudseed-beetle', 'Cloudseed beetle', 'animal', {inheritance: 'alleles', reproduction: ['pair'],
        source: original('household_brood.js'), hosts: ['household_brood.js']}),
    row('lightning-wolf', 'Lightning wolf', 'animal', {reproduction: ['cohort'], diet: {prey: 'ridge-hare'},
        source: {kind: 'book', locator: 'Reverend Insanity ch. 150 (frenzy wolves carrying Thunderclap Gu)'},
        hosts: ['gu_hosted_wolf.js', 'gu_wolf_scouting.js', 'gu_wolf_ridge.js']}),
    row('ridge-hare', 'Ridge hare', 'animal', {reproduction: ['cohort'],
        source: original('gu_wolf_ridge.js (prey for the wolf ridge)'), hosts: ['gu_wolf_ridge.js', 'gu_wolf_scouting.js']}),
    ...['queen', 'worker', 'soldier'].map(caste => row(`army-ant-${caste}`, `Army ant ${caste}`, 'animal', {
        inheritance: 'none', reproduction: ['emergence'], stages: ['adult'],
        source: {kind: 'book', locator: 'Reverend Insanity, ants produced by the Ant Nest Gu (gu_catalogue ant-nest)'},
        hosts: ['gu_army_ants.js', 'gu_keeper_ant_nest.js']})),
    row('ordinary-starlight-firefly', 'Starlight firefly (ordinary)', 'animal', {reproduction: ['cohort'],
        source: {kind: 'book', locator: 'Reverend Insanity ch. 467 and 474 (gu_colony.js)'}, hosts: ['gu_colony.js']}),
    row('human', 'Person', 'person', {needs: 'human', inheritance: 'alleles', reproduction: ['pair'], genome: 'person.household',
        stages: ['juvenile', 'adult', 'elder'], organs: ['aperture'],
        source: original('simulation.js people, chronicle.js life, npc_lives.js'),
        hosts: ['simulation.js', 'chronicle.js', 'npc_lives.js']}),
    row('fluxweed', 'Fluxweed', 'plant', {inheritance: 'none', reproduction: ['cutting'], stages: ['growing', 'ready'],
        source: {kind: 'book', locator: 'Harry Potter brewing pack (hp_brewing_state.js fluxweed bed)'}, hosts: ['hp_brewing_state.js']}),
    row('courtyard-greens', 'Courtyard greens', 'plant', {inheritance: 'none', reproduction: ['seed'],
        stages: ['planted', 'tended', 'ready'], source: original('management/shipping_farming.js'),
        hosts: ['management/shipping_farming.js', 'hired_hands_plot.js']}),
    row('courtyard-grain', 'Courtyard grain', 'plant', {inheritance: 'none', reproduction: ['seed'],
        stages: ['planted', 'tended', 'ready'], source: original('management/shipping_farming.js'),
        hosts: ['management/shipping_farming.js', 'hired_hands_plot.js']}),
    // Gu-shaped kind a host names that chat G's catalogue does not list yet (request to G).
    // A placeholder gives way to a world-pack row with the same id, so G adding it is not a clash.
    row('insight-moth', 'Insight moth', 'gu', {needs: 'gu', inheritance: 'none', stages: ['adult'], reproduction: ['refinement'],
        placeholder: true,
        source: original('gu_keeper_cooperation.js (not yet in gu_catalogue)'), hosts: ['gu_keeper_cooperation.js']}),
].map(Object.freeze));

// Gu as living kinds, from chat G's catalogue rows (SC4: a Gu is rows on every
// mechanism it uses; L runs the body, G owns the Gu). The catalogue is passed in,
// not imported, so L and G stay separate files (PFP10). Every Gu eats and can die,
// so every catalogue kind becomes a gu-class body; the parts roles say how it lives.
const GU_LIVING_ROLES = Object.freeze({producer: 'producer', hosted: 'hosted', wild: 'wild', emergent: 'emergent',
    vital: 'vital', loaned: 'loaned'});
export function guLivingRows(catalogue) {
    check(object(catalogue), 'Gu living rows need the Gu catalogue.');
    return Object.entries(catalogue).map(([id, entry]) => {
        const parts = entry?.parts?.value ?? {};
        const roles = (parts.roles ?? []).filter(role => Object.hasOwn(GU_LIVING_ROLES, role));
        const chapters = entry?.parts?.chapters ?? [];
        return Object.freeze(row(id, id, 'gu', {needs: 'gu', inheritance: 'none', stages: ['adult'],
            reproduction: roles.includes('emergent') ? ['emergence', 'refinement'] : ['refinement'],
            living: Object.freeze(roles), rank: parts.rank ?? [],
            source: {kind: 'book', locator: `Reverend Insanity ch. ${chapters.join(', ') || 'unknown'} (gu_catalogue ${id})`},
            hosts: ['gu_catalogue.js']}));
    });
}

function validateKind(kind) {
    check(object(kind) && idLike(kind.id) && typeof kind.label === 'string' && kind.label &&
        LIVING_CLASSES.includes(kind.class), `Invalid living kind ${kind?.id}.`);
    check(kind.needs === null || idLike(kind.needs), `${kind.id}: needs is a body key or null.`);
    check(LIVING_INHERITANCE.includes(kind.inheritance), `${kind.id}: unknown inheritance.`);
    check(Array.isArray(kind.reproduction) && kind.reproduction.every(r => LIVING_REPRODUCTION.includes(r)),
        `${kind.id}: unknown reproduction.`);
    check(Array.isArray(kind.stages) && kind.stages.length > 0 && kind.stages.every(idLike), `${kind.id}: stages.`);
    check(kind.lifespan === null || Number.isSafeInteger(kind.lifespan) && kind.lifespan > 0, `${kind.id}: lifespan.`);
    check(Array.isArray(kind.organs) && kind.organs.every(o => LIVING_ORGANS.includes(o)), `${kind.id}: organs.`);
    check(object(kind.diet) && (kind.diet.prey === undefined || idLike(kind.diet.prey)), `${kind.id}: diet.`);
    check(kind.genome === undefined || typeof kind.genome === 'string' && kind.genome.length > 0, `${kind.id}: genome id.`);
    check(kind.placeholder === undefined || typeof kind.placeholder === 'boolean', `${kind.id}: placeholder.`);
    check(object(kind.source) && ['original', 'book'].includes(kind.source.kind) &&
        typeof kind.source.locator === 'string' && kind.source.locator, `${kind.id}: a kind names its source.`);
    return kind;
}

/** One registry for a world: L's rows plus world-pack rows (Gu from G, later others).
 * A later row for the same id is refused, so two packs cannot both define a kind,
 * except that a row replaces an L placeholder for the same id. */
export function livingKindRegistry({rows = LIVING_KIND_ROWS, extra = [], genomes = LIVING_GENOMES} = {}) {
    const kinds = {};
    for (const kind of [...rows, ...extra]) {
        validateKind(kind);
        check(!Object.hasOwn(kinds, kind.id) || kinds[kind.id].placeholder === true,
            `Living kind ${kind.id} is defined twice.`);
        kinds[kind.id] = kind;
    }
    for (const kind of Object.values(kinds))
        if (kind.diet.prey) check(Object.hasOwn(kinds, kind.diet.prey), `${kind.id}: prey ${kind.diet.prey} has no row.`);
    for (const kind of Object.values(kinds))
        if (kind.genome) check(Object.hasOwn(genomes, kind.genome), `${kind.id}: genome ${kind.genome} has no row.`);
    return Object.freeze({revision: LIVING_KINDS_REVISION, kinds: Object.freeze(kinds), genomes});
}

/** The genome row for a kind, or null when its heredity copies whole traits. */
export function livingGenome(registry, id) {
    const kind = livingKind(registry, id);
    return kind.genome ? registry.genomes[kind.genome] : null;
}

export function livingKind(registry, id) {
    const kind = Object.hasOwn(registry.kinds, id) ? registry.kinds[id] : undefined;
    check(kind, `No living kind ${id}.`);
    return kind;
}

/** A habitat whose prey needs come from kind rows: the place supplies capacity and
 * how many prey one predator needs (a world number), the kinds supply who eats whom. */
export function habitatFromKinds(registry, {id, capacity, species, perPredator = {}}) {
    const preyRequirements = {};
    for (const name of species) {
        const prey = livingKind(registry, name).diet.prey;
        if (prey && species.includes(prey))
            preyRequirements[name] = {species: prey, perPredator: perPredator[name] ?? 1};
    }
    return {id, capacity, supportedSpecies: [...species],
        ...(Object.keys(preyRequirements).length ? {preyRequirements} : {})};
}
