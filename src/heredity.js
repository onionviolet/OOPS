// One heredity layer (foundation chat L, GN1-GN9, PFP27, 2026-11-12; proposal under AD56).
// The allele model of lineage_traits.js (two alleles per locus; dominant, recessive,
// incomplete; fickle strong alleles; genotype hidden until tested or deduced), made
// genome-agnostic: loci are world-pack rows (GN1), not code. The lifecycle's old
// per-trait coin flip is the `parental` draw here, at its original address (OA5).
// Pure: no clock, no storage. Every draw is addressed (GR1-GR17, PR1): the same root
// and address give the same child after any reload. Rates are whole per-mille.
//
// Genome row: {id, family, mutation, fickle, mutagens, loci, spread}
//   family    kinds that can cross (GN5); distance between genomes decides how well.
//   mutation  per-mille chance an inherited allele flips (a world and kind dial).
//   fickle    per-mille chance a fickle strong allele passes on (lineage_traits: 500).
//   mutagens  {exposure: percent added per unit}: what raises mutation (GN4), read from
//             W conditions by the caller (lightning, an essence surge, potion residue).
//   loci      {id: {mode, strong, plain, fickle?, mutation?, affects, shows?}}
//             shows: {mature?: true, needs?: {quantity, min}, suppressedBy?: [condition]}
//             says what the gene needs to show (GN2: growth, place, life).
//   spread    {measure: [min, max]}: each individual's own draw in the kind's range (GN3).
//   polygenic {trait: {mean, sd, heritability, min, max}}: IH1, below.
import {check, natural, object} from './basics.js';
import {address, drawU32} from './gen_kit.js';

export const HEREDITY_MODES = Object.freeze(['dominant', 'recessive', 'incomplete']);
const isKey = value => typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(value);
const perMille = n => natural(n) && n <= 1000;
const roll = (root, ...parts) => drawU32(root, address(...parts)) % 1000;

export function validateGenome(genome) {
    check(object(genome) && isKey(genome.id) && isKey(genome.family) && object(genome.loci) &&
        Object.keys(genome.loci).length > 0, 'A genome needs an id, a family and loci.');
    check(perMille(genome.mutation ?? 0) && perMille(genome.fickle ?? 500), `${genome.id}: rates are per-mille.`);
    for (const [cause, percent] of Object.entries(genome.mutagens ?? {}))
        check(isKey(cause) && natural(percent), `${genome.id}: mutagen ${cause} needs a whole percent.`);
    for (const [id, locus] of Object.entries(genome.loci)) {
        check(isKey(id) && object(locus) && HEREDITY_MODES.includes(locus.mode) && isKey(locus.strong) &&
            isKey(locus.plain) && locus.strong !== locus.plain, `${genome.id}: locus ${id} needs a mode and two alleles.`);
        check(locus.mutation === undefined || perMille(locus.mutation), `${genome.id}: locus ${id} mutation.`);
        const shows = locus.shows ?? {};
        check(object(shows) && (shows.needs === undefined || isKey(shows.needs.quantity) && Number.isSafeInteger(shows.needs.min)) &&
            (shows.suppressedBy === undefined || Array.isArray(shows.suppressedBy) && shows.suppressedBy.every(isKey)),
        `${genome.id}: locus ${id} shows.`);
    }
    polygenicRows(genome);
    for (const [measure, range] of Object.entries(genome.spread ?? {}))
        check(isKey(measure) && Array.isArray(range) && range.length === 2 && range.every(Number.isSafeInteger) &&
            range[0] <= range[1], `${genome.id}: spread ${measure} is [min, max].`);
    return genome;
}

export function validateGenes(genome, genes) {
    check(object(genes), 'Genes are an object.');
    for (const [id, locus] of Object.entries(genome.loci))
        check(Array.isArray(genes[id]) && genes[id].length === 2 && genes[id].every(a => a === locus.strong || a === locus.plain),
            `Genes for ${genome.id} need two alleles at ${id}.`);
    check(Object.keys(genes).every(id => Object.hasOwn(genome.loci, id)), `Genes name a locus ${genome.id} lacks.`);
    return genes;
}

/** The old lifecycle draw, kept bit-for-bit so existing broods settle the same (OA5). */
export function pickParental(root, broodId, name, left, right) {
    if (left === undefined || right === undefined) return left ?? right;
    return drawU32(root, address('creature-inheritance', broodId, name)) % 2 ? left : right;
}

/** GN4: the mutation rate after exposure. `exposure` is {cause: units}, read by the
 * caller from W quantities or law fields; each unit adds the genome's percent. */
export function mutationRate(genome, base, exposure = {}) {
    let percent = 100;
    for (const [cause, units] of Object.entries(exposure)) {
        check(natural(units), 'Exposure is whole units.');
        percent += (genome.mutagens?.[cause] ?? 0) * units;
    }
    return Math.min(1000, Math.floor(base * percent / 100));
}

/** Founding genes for an individual with no recorded parents, by address. */
export function foundingGenes(genome, {root, at, strongPerMille = 400}) {
    validateGenome(genome);
    return Object.fromEntries(Object.entries(genome.loci).map(([id, locus]) =>
        [id, [0, 1].map(i => roll(root, at, id, i, 'found') < strongPerMille ? locus.strong : locus.plain)]));
}

/** One child's genes from two parents (lineage_traits.breed's rules, addressed draws).
 * `exposure` raises mutation (GN4). Returns genes and which loci mutated, for the cause chain. */
export function inheritGenes(genome, sire, dam, {root, at, exposure = {}}) {
    validateGenome(genome); validateGenes(genome, sire); validateGenes(genome, dam);
    const genes = {}, mutated = [];
    for (const [id, locus] of Object.entries(genome.loci)) {
        const rate = mutationRate(genome, locus.mutation ?? genome.mutation ?? 0, exposure);
        genes[id] = [sire, dam].map((parent, side) => {
            let allele = parent[id][roll(root, at, id, side, 'pick') < 500 ? 0 : 1];
            if (allele === locus.strong && locus.fickle && roll(root, at, id, side, 'fickle') >= (genome.fickle ?? 500)) allele = locus.plain;
            if (roll(root, at, id, side, 'mutate') < rate) {
                allele = allele === locus.strong ? locus.plain : locus.strong;
                mutated.push(id);
            }
            return allele;
        });
    }
    return {genes, mutated};
}

// 0 absent, 1 mild, 2 full; dominant and recessive show only 0 or 2 (lineage_traits.level).
function geneLevel(locus, alleles) {
    const n = alleles.filter(a => a === locus.strong).length;
    return locus.mode === 'dominant' ? (n ? 2 : 0) : locus.mode === 'recessive' ? (n === 2 ? 2 : 0) : n;
}

/**
 * GN2: what shows, from genes through growth, place and life. Each locus reports its
 * level and the cause that set it: `genes`, or `growth` (not mature yet), `place` (the
 * environment lacks what it needs), `condition` (a body state suppresses it).
 */
export function expressGenes(genome, genes, {mature = true, environment = {}, conditions = []} = {}) {
    validateGenes(genome, genes);
    return Object.fromEntries(Object.entries(genome.loci).map(([id, locus]) => {
        const carried = geneLevel(locus, genes[id]), shows = locus.shows ?? {};
        let level = carried, cause = 'genes';
        if (carried && shows.mature && !mature) { level = 0; cause = 'growth'; }
        else if (carried && shows.needs && !((environment[shows.needs.quantity] ?? -Infinity) >= shows.needs.min)) { level = 0; cause = 'place'; }
        else if (carried && shows.suppressedBy?.some(c => conditions.includes(c))) { level = 0; cause = 'condition'; }
        return [id, {level, carried, shows: level === 0 ? 'absent' : level === 1 ? 'mild' : 'full', cause, affects: locus.affects ?? null}];
    }));
}

/** GN6: what a keeper may see of one locus; a hidden allele is '?' (lineage_traits.locusView). */
export function genotypeView(genome, genes, tested, id) {
    const locus = genome.loci[id], alleles = genes[id], n = geneLevel(locus, alleles);
    let view;
    if (tested.includes(id) || locus.mode === 'incomplete') view = [...alleles].sort();
    else if (locus.mode === 'recessive') view = n === 2 ? [locus.strong, locus.strong] : [locus.plain, '?'];
    else view = n === 0 ? [locus.plain, locus.plain] : [locus.strong, '?'];
    return {locus: id, alleles: view, known: !view.includes('?')};
}

/** GN6: a child's phenotype teaches about a parent (a showing recessive means both carry
 * it; an absent dominant means neither does). Returns the parent's new tested list. */
export function learnFromChild(genome, parentGenes, parentTested, childGenes) {
    const learned = Object.entries(genome.loci).filter(([id, locus]) => {
        if (parentTested.includes(id) || genotypeView(genome, parentGenes, parentTested, id).known) return false;
        const shown = geneLevel(locus, childGenes[id]);
        return locus.mode === 'recessive' && shown === 2 || locus.mode === 'dominant' && shown === 0;
    }).map(([id]) => id);
    return [...parentTested, ...learned];
}

/** GN3: an individual's own spread inside the kind's ranges, by address, never stored
 * (regenerable from root and id; GR3 keeps only what has been observed). */
export function individualSpread(genome, {root, id}) {
    return Object.fromEntries(Object.entries(genome.spread ?? {}).map(([measure, [min, max]]) =>
        [measure, min + drawU32(root, address('spread', id, measure)) % (max - min + 1)]));
}

/** GN5: genome distance in per-mille. Different families cannot meet (1000); within a
 * family, the share of loci the two genomes do not both declare with the same alleles. */
export function genomeDistance(a, b) {
    if (a.family !== b.family) return 1000;
    const ids = new Set([...Object.keys(a.loci), ...Object.keys(b.loci)]);
    let differ = 0;
    for (const id of ids) {
        const x = a.loci[id], y = b.loci[id];
        if (!x || !y || x.strong !== y.strong || x.plain !== y.plain) differ++;
    }
    return Math.round(differ * 1000 / ids.size);
}

/** GN5: whether a cross takes and breeds on. Thresholds are dials with a reason:
 * near kin cross freely; a wider cross can live but not breed (a mule); past that, none. */
export function crossOutcome(a, b, {fertileBelow = 250, viableBelow = 600} = {}) {
    const distance = genomeDistance(a, b);
    if (distance >= viableBelow) return {viable: false, fertile: false, distance, reason: a.family !== b.family ? 'different families' : 'too far apart to take'};
    if (distance >= fertileBelow) return {viable: true, fertile: false, distance, reason: 'the cross lives but cannot breed'};
    return {viable: true, fertile: true, distance, reason: 'close enough to breed true'};
}

/** The hybrid's genome: loci both parents share keep their alleles; a locus only one
 * parent has is carried as declared by that parent. Family is the shared family. */
export function hybridGenome(a, b, id = `${a.id}x${b.id}`) {
    check(a.family === b.family, 'Only kinds of one family make a hybrid genome.');
    return validateGenome({id, family: a.family, mutation: Math.max(a.mutation ?? 0, b.mutation ?? 0),
        fickle: a.fickle ?? 500, mutagens: {...b.mutagens, ...a.mutagens}, loci: {...b.loci, ...a.loci},
        spread: {...b.spread, ...a.spread}});
}

// ---- GN8: trait frequencies for herds and wild populations away from the player ----
// A cohort keeps allele counts per locus, {locus: {strong, plain}}, not individuals.

export function frequenciesFrom(genome, members) {
    const out = Object.fromEntries(Object.keys(genome.loci).map(id => [id, {strong: 0, plain: 0}]));
    for (const genes of members) for (const [id, locus] of Object.entries(genome.loci))
        for (const allele of genes[id]) out[id][allele === locus.strong ? 'strong' : 'plain']++;
    return out;
}

/** Draw one individual's genes from a cohort's frequencies and take its two alleles out. */
export function drawFromFrequencies(genome, alleles, {root, at}) {
    const left = structuredClone(alleles), genes = {};
    for (const [id, locus] of Object.entries(genome.loci)) {
        genes[id] = [0, 1].map(i => {
            const row = left[id], total = row.strong + row.plain;
            check(total > 0, `No alleles left at ${id}.`);
            const strong = drawU32(root, address(at, id, i, 'draw')) % total < row.strong;
            row[strong ? 'strong' : 'plain']--;
            delete row.held;
            return strong ? locus.strong : locus.plain;
        });
    }
    return {genes, alleles: left};
}

/** Births add alleles in the cohort's proportion (random mating, Hardy-Weinberg). The
 * proportion is the one held when the run of births began (`held: [strong, total]`),
 * and the count is computed from totals, so one settlement of twenty and twenty of one
 * agree (KW5). The row drops `held` once the counts sit exactly on that proportion. */
export function addBirthsToFrequencies(alleles, count) {
    return Object.fromEntries(Object.entries(alleles).map(([id, row]) => {
        const [strong0, total0] = row.held ?? [row.strong, row.strong + row.plain];
        const total = row.strong + row.plain + 2 * count;
        if (!total0) return [id, {strong: row.strong, plain: total - row.strong}];
        const strong = strong0 + Math.round((total - total0) * strong0 / total0);
        return [id, {strong, plain: total - strong, ...(strong * total0 === strong0 * total ? {} : {held: [strong0, total0]})}];
    }));
}

/** Losses take alleles in proportion; a share that rounds to more than what is left takes
 * all of it. A loss ends a run of births, so the row's held proportion is dropped. */
export function removeFromFrequencies(alleles, count) {
    if (count === 0) return alleles;
    return Object.fromEntries(Object.entries(alleles).map(([id, row]) => {
        const total = row.strong + row.plain, take = Math.min(total, 2 * count);
        const strong = total ? Math.min(row.strong, Math.round(take * row.strong / total)) : 0;
        return [id, {strong: row.strong - strong, plain: Math.max(0, row.plain - (take - strong))}];
    }));
}

// ---- IH1: polygenic values (size, yield, speed, essence capacity) ----
// A polygenic trait is a sum of many small effects, so it is modelled as one number, not
// loci: each individual carries a hidden breeding value (its genetic worth for the trait)
// and shows breeding value plus a non-genetic share. Offspring land at the parents' mean
// plus Mendelian noise. Heritability (per-mille) is the dial: at 1000 what shows is the
// breeding value; at 0 selection on what shows changes nothing. Genome rows declare
//   polygenic: {trait: {mean, sd, heritability, min, max}}  (whole units of the trait)
// GN3's spread stays for non-heritable measures; a heritable measure belongs here.

// Addressed standard normal: the sum of twelve addressed uniforms minus six.
function normal(root, ...parts) {
    let sum = 0;
    for (let i = 0; i < 12; i++) sum += drawU32(root, address(...parts, i)) / 4294967296;
    return sum - 6;
}

function polygenicRows(genome) {
    const rows = genome.polygenic ?? {};
    for (const [trait, t] of Object.entries(rows))
        check(isKey(trait) && object(t) && [t.mean, t.sd, t.min, t.max].every(Number.isSafeInteger) && t.sd >= 0 &&
            t.min <= t.mean && t.mean <= t.max && perMille(t.heritability), `${genome.id}: polygenic ${trait}.`);
    return rows;
}

export function validateBreeding(genome, breeding) {
    const rows = polygenicRows(genome);
    check(object(breeding) && Object.keys(rows).every(t => Number.isSafeInteger(breeding[t])) &&
        Object.keys(breeding).every(t => Object.hasOwn(rows, t)), `Breeding values for ${genome.id} need every polygenic trait.`);
    return breeding;
}

/** Breeding values for a founder: the kind's mean plus the genetic share of its spread. */
export function foundingBreeding(genome, {root, at}) {
    return Object.fromEntries(Object.entries(polygenicRows(genome)).map(([trait, t]) =>
        [trait, Math.round(t.mean + normal(root, at, trait, 'found') * t.sd * Math.sqrt(t.heritability / 1000))]));
}

/** A child's breeding values: the parents' mean plus Mendelian sampling, whose variance
 * is half the genetic variance (h^2 * sd^2 / 2). */
export function inheritBreeding(genome, sire, dam, {root, at}) {
    validateBreeding(genome, sire); validateBreeding(genome, dam);
    return Object.fromEntries(Object.entries(polygenicRows(genome)).map(([trait, t]) =>
        [trait, Math.round((sire[trait] + dam[trait]) / 2 + normal(root, at, trait, 'mendel') * t.sd * Math.sqrt(t.heritability / 2000))]));
}

/** What shows: breeding value plus the non-genetic share ((1 - h^2) * sd^2), drawn per
 * individual by address, clamped to the kind's biological range (SB10's ceiling). */
export function expressPolygenic(genome, breeding, {root, id}) {
    validateBreeding(genome, breeding);
    return Object.fromEntries(Object.entries(polygenicRows(genome)).map(([trait, t]) => {
        const shown = breeding[trait] + normal(root, 'polygenic-env', id, trait) * t.sd * Math.sqrt(1 - t.heritability / 1000);
        return [trait, Math.min(t.max, Math.max(t.min, Math.round(shown)))];
    }));
}
