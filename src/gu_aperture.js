// The Gu aperture law (Gu law, proposal under AD32 and AD56, 2026-11-12). Pure numbers and
// reads; the substrate pack `g.aperture` (world_substrate_packs/gu_aperture.js) runs them over time.
//
// The aperture is a body space of a fixed size. Aptitude says how much of it the primeval
// sea can fill. Essence is kept by rank and stage and the kinds do not mix (RIG9), so each is
// its own pool: `energy:primeval.rank<r>.<stage>`. One mote of a later stage does the work of
// two of the stage before, and one of a higher rank the work of ten (RIG5, RIG9), so a price
// is stated once, in rank-one initial-stage motes, and a pool pays it at its own worth.
//
// Each number carries its basis: `stated` (a chapter says it, relayed from the saved reader
// notes), `inferred` (a band the text implies), `calibrated` (chosen so the mechanism lands on
// a stated outcome, AD49) or `authored` (ours, no chapter number held). Every one is a dial.
import {check, natural, object} from './basics.js';

export const APERTURE_STAGES = Object.freeze(['initial', 'middle', 'upper', 'peak']);

export const APERTURE_LAW = Object.freeze({
    // Motes in a whole aperture. Authored unit: one percent of the aperture is 6,000 motes,
    // so "4% an hour" is a whole 400 motes a minute.
    room: 600_000,
    maxRank: 5,
    // RIG9: essence colour by rank (rank five inferred), wall by stage (ch33, ch90, ch273).
    essence: Object.freeze({1: 'green copper', 2: 'red steel', 3: 'white silver', 4: 'yellow gold', 5: 'purple crystal'}),
    walls: Object.freeze(['light', 'water', 'stone', 'crystal']),
    stagePotency: 2,   // stated: an action's cost halves per small realm (ch148)
    rankPotency: 10,   // stated: one portion of a higher rank equals ten of the lower (ch26)
    // Aptitude bands. hourlyPoints: points of the whole aperture recovered an hour (ch10: C 4, A 8;
    // "24% in 6 hours"). nurturePermille: how far a mote goes on the wall; with recovery it
    // reproduces "a C needs about twice a B's time, four times an A's" (calibrated).
    grades: Object.freeze([
        Object.freeze({id: 'D', from: 20, hourlyPoints: 2, nurturePermille: 1000, basis: 'inferred'}),
        Object.freeze({id: 'C', from: 40, hourlyPoints: 4, nurturePermille: 1000, basis: 'stated'}),
        Object.freeze({id: 'B', from: 60, hourlyPoints: 6, nurturePermille: 1333, basis: 'inferred'}),
        Object.freeze({id: 'A', from: 80, hourlyPoints: 8, nurturePermille: 2000, basis: 'stated'}),
        Object.freeze({id: 'extreme', from: 100, hourlyPoints: 10, nurturePermille: 2000, basis: 'authored'}),
    ]),
    // Own-stage motes a wall takes before the next stage (authored; the text says only that a
    // small realm "needs time and patience"). A C that pours all it recovers takes about 21, 31 and 42 days.
    wallNeed: Object.freeze([12_000_000, 18_000_000, 24_000_000]),
    // The rank break (RIG6). The crystal wall takes `need` net motes; it heals while struck and
    // closes fast when left alone. With these, a lone sea of 55% of the aperture is the least
    // that breaks it at full force (stated threshold, ch91), and a 44% sea fed by stones at a
    // strike of 1,073 a minute takes about three days and ends near 20% (ch92).
    break: Object.freeze({need: 294_000, strikeMax: 6_000, healStruck: 1_000, healIdle: 10_000}),
    // Primeval stones. A resting master refills to the cap in about half an hour (stated, ch10).
    // What one stone holds is authored (in rank-one initial motes); the rate while striking is calibrated to ch92.
    stone: Object.freeze({good: 'primeval_stone', motes: 240_000, fillMinutes: 30, dividedPerMinute: 640}),
    // Paying more than the sea holds strains the aperture; enough strain cracks it (ch193) and
    // more shatters it. A crack mends when the strain has eased. Thresholds and rates authored.
    strain: Object.freeze({crackAt: 60_000, shatterAt: 300_000, easePerMinute: 20,
        capacityPercent: Object.freeze({intact: 100, cracked: 50, shattered: 0})}),
    // What one workshop measure of essence is in rank-one initial motes. Calibrated: the catalogue's
    // Moonblade costs four measures, and a Moonblade is a tenth of a C sea at the initial stage (RIG15, a 44% sea).
    measure: 6_600,
    // Another master's essence stays as foreign essence and slows later nurturing until it is
    // cleansed (ch50, ch111). Authored: the slowdown is its share of the sea, up to this much.
    foreign: Object.freeze({maxStiflePermille: 800}),
});

const stageIndex = stage => {
    const i = typeof stage === 'number' ? stage : APERTURE_STAGES.indexOf(stage);
    check(Number.isInteger(i) && i >= 0 && i < APERTURE_STAGES.length, `Unknown aperture stage ${stage}.`);
    return i;
};

export const aperturePool = (rank, stage) => `energy:primeval.rank${rank}.${APERTURE_STAGES[stageIndex(stage)]}`;

/** Every pool key a law's ranks allow, strongest essence first. */
export function aperturePools(law = APERTURE_LAW) {
    const out = [];
    for (let rank = law.maxRank; rank >= 1; rank--) for (let s = APERTURE_STAGES.length - 1; s >= 0; s--)
        out.push({key: aperturePool(rank, s), rank, stage: s, potency: essencePotency(law, rank, s)});
    return out;
}

/** What one mote is worth in rank-one initial motes. */
export function essencePotency(law, rank, stage) {
    check(natural(rank) && rank >= 1 && rank <= law.maxRank, `No essence of rank ${rank} in this world.`);
    return law.rankPotency ** (rank - 1) * law.stagePotency ** stageIndex(stage);
}

/** The band an aptitude percent falls in, or null below the lowest (no aperture opens). */
export function apertureGrade(law, aptitude) {
    check(natural(aptitude) && aptitude <= 100, 'Aptitude is a whole percent of the aperture.');
    return law.grades.filter(g => aptitude >= g.from).at(-1) ?? null;
}

/** A new aperture record. This is the saved slice; everything else is read from it and the law. */
export function openAperture({aptitude, rank = 1, stage = 0, condition = 'intact'}, law = APERTURE_LAW) {
    check(apertureGrade(law, aptitude), `An aptitude of ${aptitude}% opens no aperture in this world.`);
    check(natural(rank) && rank >= 1 && rank <= law.maxRank, 'An aperture needs a rank this world has.');
    check(condition in law.strain.capacityPercent, `This world has no rule for a ${condition} aperture.`);
    return {aptitude, rank, stage: stageIndex(stage), condition, nurture: null, strike: null, absorb: false, holds: {}};
}

export function checkAperture(s, law = APERTURE_LAW) {
    check(object(s) && object(s.holds), 'An aperture record needs its fields.');
    openAperture(s, law);
    for (const flow of [s.nurture, s.strike]) check(flow === null || (object(flow) && natural(flow.perMinute) && flow.perMinute > 0),
        'A nurture or a strike is a whole number of motes a minute.');
    check(typeof s.absorb === 'boolean', 'Absorbing is on or off.');
    for (const hold of Object.values(s.holds)) check(object(hold) && typeof hold.pool === 'string', 'A hold names its pool.');
    return s;
}

/** Motes the sea can hold: the aptitude's share of the aperture, less what a crack costs. */
export function apertureCapacity(law, s) {
    return Math.floor(law.room * s.aptitude * law.strain.capacityPercent[s.condition] / 10_000);
}

/** Own-stage motes made a minute while there is room. A shattered aperture makes none. */
export function apertureRecovery(law, s) {
    if (s.condition === 'shattered') return 0;
    return Math.floor(law.room * apertureGrade(law, s.aptitude).hourlyPoints / 6_000);
}

/** Motes a resting master draws from a stone each minute, or the slower rate while striking. */
export function apertureAbsorbRate(law, s) {
    return s.strike ? law.stone.dividedPerMinute : Math.ceil(apertureCapacity(law, s) / law.stone.fillMinutes);
}

/** Wall progress per thousand motes nurtured: the grade's pace, slowed by foreign essence. */
export function nurturePermille(law, s, foreign = 0) {
    const cap = apertureCapacity(law, s);
    const stifle = cap > 0 ? Math.min(law.foreign.maxStiflePermille, Math.floor(foreign * 1000 / cap)) : 0;
    return Math.floor(apertureGrade(law, s.aptitude).nurturePermille * (1000 - stifle) / 1000);
}

export function conditionFor(law, s, strain) {
    if (s.condition === 'shattered' || strain >= law.strain.shatterAt) return 'shattered';
    if (strain >= law.strain.crackAt) return 'cracked';
    return s.condition === 'cracked' && strain > 0 ? 'cracked' : 'intact';
}

/** Motes of `pool` that pay a price stated in rank-one initial motes (rounded up: essence is not split finer). */
export const motesFor = (price, potency) => Math.ceil(price / potency);

/**
 * How a price falls on the sea. `pools` is [{key, potency, free}] in paying order. Returns what
 * each pool gives and what is still owed when all are dry (the caller prices that as strain).
 */
export function payFromSea(price, pools) {
    check(natural(price), 'A price is a whole number of rank-one initial motes.');
    const taken = [];
    let owed = price;
    for (const pool of pools) {
        if (owed <= 0) break;
        const take = Math.min(pool.free, motesFor(owed, pool.potency));
        if (take <= 0) continue;
        taken.push({key: pool.key, amount: take});
        owed = Math.max(0, owed - take * pool.potency);
    }
    return {taken, owed};
}

/**
 * The aperture as a master reads their own (GP1): essence by rank and stage, capacity,
 * recovery, what in-flight workings hold, the wall and any break under way. `holder` is a
 * substrate holder (its quantities and this pack's state slice).
 */
export function readAperture(holder, law = APERTURE_LAW) {
    const s = checkAperture(holder?.state?.['g.aperture'], law);
    const q = name => holder.quantities[name] ?? 0;
    const holds = Object.entries(s.holds).map(([id, h]) => ({id, pool: h.pool, amount: q(`aperture_held:${id}`)}));
    const held = key => holds.reduce((n, h) => n + (h.pool === key ? h.amount : 0), 0);
    const pools = aperturePools(law).filter(p => p.key in holder.quantities).map(p => ({key: p.key, rank: p.rank,
        stage: APERTURE_STAGES[p.stage], essence: law.essence[p.rank], potency: p.potency,
        amount: q(p.key) + held(p.key), held: held(p.key), free: q(p.key)}));
    const capacity = apertureCapacity(law, s), total = pools.reduce((n, p) => n + p.amount, 0);
    const recovery = apertureRecovery(law, s);
    const peak = s.stage === APERTURE_STAGES.length - 1;
    return {
        rank: s.rank, stage: APERTURE_STAGES[s.stage], essence: law.essence[s.rank], wall: law.walls[s.stage],
        aptitude: s.aptitude, grade: apertureGrade(law, s.aptitude).id, condition: s.condition,
        capacity, total, free: pools.reduce((n, p) => n + p.free, 0), pools,
        holds,
        worth: pools.reduce((n, p) => n + p.free * p.potency, 0),
        recoveryPerMinute: recovery,
        minutesToFull: total >= capacity ? 0 : recovery > 0 ? Math.ceil((capacity - total) / recovery) : null,
        nurturing: s.nurture, striking: s.strike, absorbing: s.absorb,
        wallProgress: peak ? null : {done: q('aperture_wall'), need: law.wallNeed[s.stage], permille: nurturePermille(law, s, q('aperture_foreign'))},
        breakProgress: peak && s.rank < law.maxRank ? {done: q('aperture_break'), need: law.break.need} : null,
        strain: q('aperture_strain'), foreign: q('aperture_foreign'),
        stones: q(`stock:${law.stone.good}`), stoneLeft: q('aperture_draw'),
    };
}

/** The sea as the reserves and supply `resolveGuActivation` takes: free motes of the master's own essence. */
export function apertureFuel(holder, operator, law = APERTURE_LAW) {
    const view = readAperture(holder, law), key = aperturePool(view.rank, view.stage);
    return {reserves: {[operator]: {[key]: view.pools.find(p => p.key === key)?.free ?? 0}},
        supply: {pool: key, family: 'primeval', rank: view.rank, source: 'aperture', stage: view.stage}};
}

/**
 * The sea as the cost owner's price list (cost_owner.js `accounts`), so a working that publishes an
 * essence cost row is paid from this aperture with no code of its own. `kinds` are the cost words or
 * quantities the world's workings publish; `unit` is rank-one initial motes per unit of those rows.
 * The row is paid from the working's hold if one is named, then the master's own essence, then the
 * rest of the sea strongest first, each at its worth. What is still short is strain on the aperture.
 * The list is for one master at one rank and stage: build it again when the stage changes.
 */
export function apertureAccounts(s, law = APERTURE_LAW, {kinds = ['essence'], unit = 1, hold} = {}) {
    checkAperture(s, law);
    check(natural(unit) && unit > 0, 'A cost unit is a whole number of rank-one initial motes.');
    const own = aperturePool(s.rank, s.stage), potency = essencePotency(law, s.rank, s.stage), all = aperturePools(law);
    const from = (quantity, worth) => ({quantity, num: unit, den: worth});
    const account = {quantity: own, order: ['substitute', 'backer'],
        substitutes: [...(hold && s.holds[hold] ? [from(`aperture_held:${hold}`, all.find(p => p.key === s.holds[hold].pool).potency)] : []),
            from(own, potency), ...all.filter(p => p.key !== own).map(p => from(p.key, p.potency))],
        fault: {id: 'aperture.overdrawn', cause: 'The rest comes out of the aperture itself.',
            owed: [{quantity: 'aperture_strain', num: unit, den: potency}]}};
    return Object.fromEntries(kinds.map(kind => [kind, account]));
}

/** What the lifecycle's organ record keeps for this aperture (living_body.js reads it with a world law). */
export const apertureOrganRecord = (s, law = APERTURE_LAW) =>
    ({grade: apertureGrade(law, s.aptitude).id, rank: s.rank, ...(s.condition === 'intact' ? {} : {condition: s.condition})});

/**
 * A quote before a refill (RIG38): what `stones` would add and how much the sea has no room for
 * (it stays in the open stone). A stone is worth `law.stone.motes` rank-one initial motes whatever the master's rank.
 */
export function quoteStoneRefill(holder, stones, law = APERTURE_LAW) {
    check(natural(stones), 'Stones are counted whole.');
    const view = readAperture(holder, law), potency = essencePotency(law, view.rank, view.stage);
    const offered = Math.floor(stones * law.stone.motes / potency);
    const weaker = view.pools.filter(p => p.potency < potency).reduce((n, p) => n + p.free, 0);
    const room = Math.max(0, view.capacity - view.total) + weaker;
    const gained = Math.min(offered, room), rate = apertureAbsorbRate(law, holder.state['g.aperture']);
    return {stones, gained, unused: offered - gained, minutes: rate > 0 ? Math.ceil(gained / rate) : null,
        stonesNeeded: Math.ceil(Math.max(0, room - Math.floor(view.stoneLeft / potency)) * potency / law.stone.motes)};
}
