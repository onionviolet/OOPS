// One body read per living thing (foundation chat L, phase 2, 2026-11-12; proposal
// under AD56). Pure: it reads the shared lifecycle (creature_lifecycle.js), the kind
// row (living_kinds.js) and the shared needs seam (needs.js), and returns what an
// actor's chooser (A), a contest (C), a path step (R) or a market want (M) needs from a
// body in one call. It stores nothing; the lifecycle stays the one authority (CR17:
// several readers, one consequence).
//
// Also the one door for harm landing on a body (C's CFC7 hit, R's backlash): a hit
// becomes owed recovery minutes on the lifecycle, so care, work and combat read the
// same wound. And the aperture as a body organ: the body records grade, rank and
// condition; a world pack's law says what that holds (PFP3, SC table).
import {check, natural, object} from './basics.js';
import {aggravateCreatureInjury, creatureDevelopment, creatureHealth, injureCreature} from './creature_lifecycle.js';
import {bodyData, needRate, readNeed} from './needs.js';
import {livingGenome, livingKind} from './living_kinds.js';
import {expressGenes, expressPolygenic, genotypeView, individualSpread} from './heredity.js';

// Dials, with reasons. Every number is a default a world may change.
export const LIVING_BODY_LAW = Object.freeze({
    // Vitality is a projection, not a stored meter: max, lowered by an open wound in
    // proportion to what is still owed, then by the hunger stage's work multiplier.
    maxVitality: 100,
    // An open wound can take at most this share of vitality (a bad cut slows, it does
    // not by itself kill; death stays with defeat_domain and the world's harm rules).
    woundShare: 0.5,
    // Elder from this share of a lifespan, when the kind has one (null lifespan: never).
    elderShare: 0.75,
    // Recovery minutes owed per point of a hit or backlash (C and R amounts are points).
    minutesPerPoint: 2,
});

const isKey = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(value);

function stageOf(kind, development, law) {
    const {stages, lifespan} = kind;
    if (lifespan && stages.includes('elder') && development.ageMinutes >= Math.floor(lifespan * law.elderShare)) return 'elder';
    if (!development.mature) return stages[0];
    const grown = stages.filter(stage => stage !== 'elder');
    return grown[grown.length - 1];
}

// Satiety on the substrate is ration-minutes at rate 1, draining at the body's rate.
// The time since the last full ration follows from it: (ration - satiety) / rate while
// any is left, then a full ration's time plus how long it has been empty.
export function sinceMealFromSatiety({satiety, emptySince = null, ration, rate, clock}) {
    check(natural(satiety) && natural(ration) && ration > 0 && natural(rate), 'Satiety needs a ration and a rate.');
    if (rate === 0) return 0;
    if (satiety > 0) return Math.max(0, ration - satiety) / rate;
    check(natural(emptySince) && natural(clock) && clock >= emptySince, 'An empty body needs the minute it ran out.');
    return ration / rate + (clock - emptySince);
}

function hungerOf(kind, sinceMeal, ration) {
    if (kind.needs === null) return {stage: 'habitat', reason: 'fed by its habitat’s supply, not a ration'};
    let body;
    try { body = bodyData(kind.needs); } catch { return {stage: 'unknown', reason: `no needs row for ${kind.needs}`}; }
    if (!body.food || body.food.rate === 0) return null;
    if (body.food.selfFed) return {stage: 'fed', level: 1, missed: 0, selfFed: true, work: 1, heal: 1};
    if (sinceMeal === undefined) return {stage: 'unknown', reason: 'nobody noted when it last ate'};
    const baseMinutes = ration ?? body.food.rationMinutes;
    if (!(baseMinutes > 0)) return {stage: 'unknown', reason: 'no ration length for this body or its diet'};
    const need = readNeed({body: kind.needs, kind: 'food', sinceMeal, baseMinutes});
    return {stage: need.stage, level: need.level, missed: need.missed, selfFed: false, work: need.effect.work, heal: need.effect.heal};
}

/** What a world's law makes of a body's aperture. `law` comes from a world pack:
 * {rankCapacity: {rank: units}, grades: {grade: {seaPercent}}, conditions: {condition: percent}}.
 * Capacity is the sea's share of the rank's room, scaled by the aperture's condition. */
export function apertureOrgan(organ, law) {
    check(object(organ) && isKey(organ.grade) && natural(organ.rank), 'An aperture needs a grade and a rank.');
    check(object(law) && object(law.rankCapacity) && object(law.grades), 'An aperture law needs rank capacity and grades.');
    const room = law.rankCapacity[organ.rank], grade = law.grades[organ.grade];
    check(natural(room) && object(grade) && natural(grade.seaPercent) && grade.seaPercent <= 100,
        `This world has no aperture rule for grade ${organ.grade} at rank ${organ.rank}.`);
    const condition = organ.condition ?? 'intact';
    const percent = condition === 'intact' ? 100 : law.conditions?.[condition];
    check(natural(percent) && percent <= 100, `This world has no aperture rule for a ${condition} aperture.`);
    return {grade: organ.grade, rank: organ.rank, condition, seaPercent: grade.seaPercent,
        capacity: Math.floor(room * grade.seaPercent * percent / 10000)};
}

/**
 * The one body read A asked for: vitality, hunger or feed level, injury, condition and
 * Gu feeding state together. `sinceMeal` is minutes since the last ration and `ration`
 * the diet's ration length at rate 1 (the host's diet owner knows both; a body row's
 * own ration length is the fallback). A body on the substrate passes `satiety`
 * ({amount, emptySince}) instead of `sinceMeal`: the pack's quantity is then the one
 * hunger source; `feeding` is a Gu record's {fedThrough, day} where the Gu
 * owner keeps feeding by day; `organLaws` maps an organ id to its world law.
 */
export function readLivingBody({lifecycle, registry, id, clock, sinceMeal, ration, satiety, feeding, environment = {}, root, organLaws = {}, law = LIVING_BODY_LAW}) {
    const animal = lifecycle?.individuals && Object.hasOwn(lifecycle.individuals, id) ? lifecycle.individuals[id] : undefined;
    check(animal, `Unknown living body ${id}.`);
    const kind = livingKind(registry, animal.species);
    const development = creatureDevelopment(lifecycle, id, clock);
    const health = creatureHealth(lifecycle, id, clock);
    let since = sinceMeal;
    if (satiety !== undefined && kind.needs !== null) {
        check(sinceMeal === undefined, 'Pass satiety or sinceMeal, not both.');
        const base = ration ?? bodyData(kind.needs).food?.rationMinutes;
        if (base > 0) since = sinceMealFromSatiety({satiety: satiety.amount, emptySince: satiety.emptySince,
            ration: base, rate: needRate(kind.needs, 'food'), clock});
    }
    const hunger = hungerOf(kind, since, ration);
    const wound = health.injury?.remaining > 0 ? health.injury : null;
    const woundFactor = wound ? 1 - law.woundShare * wound.remaining / wound.required : 1;
    const work = hunger?.work ?? 1, heal = hunger?.heal ?? 1;
    const conditions = [];
    if (wound) conditions.push(health.careUntil !== null ? 'recovering' : 'injured');
    if (hunger?.stage === 'hungry' || hunger?.stage === 'starved') conditions.push(hunger.stage);
    if (!development.mature) conditions.push('immature');
    const gu = kind.class === 'gu' && feeding ? {fedThrough: feeding.fedThrough, day: feeding.day,
        fed: natural(feeding.fedThrough) && feeding.fedThrough >= feeding.day} : null;
    if (gu && !gu.fed) conditions.push('unfed');
    const organs = {};
    for (const [name, organ] of Object.entries(animal.organs ?? {}))
        organs[name] = name === 'aperture' && organLaws.aperture ? apertureOrgan(organ, organLaws.aperture) : {...organ};
    return {
        id, species: kind.id, class: kind.class, keeper: animal.keeper, habitat: animal.habitat,
        stage: stageOf(kind, development, law), ageMinutes: development.ageMinutes, mature: development.mature,
        vitality: {value: Math.floor(law.maxVitality * woundFactor * work), max: law.maxVitality},
        hunger, injury: wound ? {kind: wound.kind, remaining: wound.remaining, required: wound.required} : null,
        inCare: health.careUntil !== null, conditions, work, heal, gu, organs,
        traits: {...animal.traits}, ...heredityOf(registry, animal, {mature: development.mature, environment, conditions, root, id}),
        learned: Object.fromEntries(Object.entries(animal.experience).map(([actor, e]) =>
            [actor, {bond: e.bond, skills: {...e.training}}])),
    };
}

// GN2, GN3, GN6: what shows (with its cause), the keeper's view of the genotype, and
// the individual's own spread. Only for kinds whose genome runs on alleles.
function heredityOf(registry, animal, {mature, environment, conditions, root, id}) {
    const genome = livingGenome(registry, animal.species);
    if (!genome) return {};
    const tested = animal.tested ?? [];
    const seeded = typeof root === 'string';
    // IH1: the measured value shows; the breeding value behind it stays hidden (SB7).
    return {...(animal.genes ? {phenotype: expressGenes(genome, animal.genes, {mature, environment, conditions}),
        genotype: Object.fromEntries(Object.keys(genome.loci).map(l => [l, genotypeView(genome, animal.genes, tested, l)]))} : {}),
        ...(seeded ? {spread: individualSpread(genome, {root, id})} : {}),
        ...(seeded && animal.breeding ? {measured: expressPolygenic(genome, animal.breeding, {root, id})} : {})};
}

/** The body read as flat facts in the substrate's `self.<name>` shape (W's
 * substrateFacts), so A's wants and K's `meets` rules read a body like a quantity. */
export function livingBodyFacts(body) {
    const facts = {'self.vitality': body.vitality.value, 'self.vitality.max': body.vitality.max,
        'self.stage': body.stage, 'self.age': body.ageMinutes, 'self.injured': body.injury !== null,
        'self.hunger': body.hunger?.stage ?? 'none', 'self.condition': body.conditions[0] ?? 'well'};
    if (body.gu) facts['self.gu.fed'] = body.gu.fed;
    for (const [name, organ] of Object.entries(body.organs))
        for (const [field, value] of Object.entries(organ)) facts[`self.${name}.${field}`] = value;
    return facts;
}

/**
 * Harm landing on a body: C's hit `{kind, amount}` or R's backlash. One wound slot
 * per body today, so a second hurt worsens the open wound (its kind stays the first).
 * Returns the new lifecycle; the caller saves it with the rest of its settlement.
 */
export function applyBodyHarm(lifecycle, {id, clock, hit, law = LIVING_BODY_LAW}) {
    check(object(hit) && isKey(hit.kind) && natural(hit.amount) && hit.amount > 0, 'A hit needs a kind and an amount.');
    const recoveryMinutes = hit.amount * law.minutesPerPoint;
    const open = creatureHealth(lifecycle, id, clock).injury?.remaining > 0;
    return open
        ? aggravateCreatureInjury(lifecycle, {revision: lifecycle.revision, id, clock, recoveryMinutes})
        : injureCreature(lifecycle, {revision: lifecycle.revision, id, clock, kind: hit.kind, recoveryMinutes});
}
