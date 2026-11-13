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
//             contributions: {capability: whole units per expressed level}.
//   spread    {measure: [min, max]}: each individual's own draw in the kind's range (GN3).
//   polygenic {trait: {mean, sd, heritability, min, max}}: IH1, below.
//   linkage   [{loci: [in chromosome order], crossovers: [per-mille per interval]}].
//   ivs       {stats, max, inheritCount}: optional discrete individual values.
//   epistasis [{target, suppressor, atLeast, unless?: {quantity, min}}]:
//             a carried suppressor masks expression unless the environment meets its condition.
import {check, natural, object, positive} from './basics.js';
import {address, drawU32, indexFromU32} from './gen_kit.js';

export const HEREDITY_MODES = Object.freeze(['dominant', 'recessive', 'incomplete']);
const isKey = value => typeof value === 'string' && value !== '__proto__' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(value);
const perMille = n => natural(n) && n <= 1000;
const roll = (root, ...parts) => drawU32(root, address(...parts)) % 1000;

function validateLinkage(genome) {
    const groups = genome.linkage ?? [];
    check(Array.isArray(groups), 'Linkage needs an array of ordered groups.');
    const used = new Set();
    for (const group of groups) {
        check(object(group) && Array.isArray(group.loci) && group.loci.length >= 2 &&
            Array.isArray(group.crossovers) && group.crossovers.length === group.loci.length - 1 &&
            group.crossovers.every(rate => perMille(rate) && rate <= 500), 'Invalid linkage group or crossover rate.');
        for (const locus of group.loci) {
            check(isKey(locus) && Object.hasOwn(genome.loci, locus) && !used.has(locus), 'A linked locus must belong to one group.');
            used.add(locus);
        }
    }
}

function validateIVRule(rule) {
    check(object(rule) && Array.isArray(rule.stats) && rule.stats.length > 0 && rule.stats.every(isKey) &&
        new Set(rule.stats).size === rule.stats.length && natural(rule.max) && rule.max < 4294967296 &&
        natural(rule.inheritCount) && rule.inheritCount <= rule.stats.length, 'Invalid individual-value rule.');
    return rule;
}

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
        check(locus.contributions === undefined || object(locus.contributions) &&
            Object.entries(locus.contributions).every(([capability, units]) => isKey(capability) && natural(units) &&
                Number.isSafeInteger(units * 2)), `${genome.id}: locus ${id} capability contributions.`);
        const shows = locus.shows ?? {};
        check(object(shows) && (shows.needs === undefined || isKey(shows.needs.quantity) && Number.isSafeInteger(shows.needs.min)) &&
            (shows.suppressedBy === undefined || Array.isArray(shows.suppressedBy) && shows.suppressedBy.every(isKey)),
        `${genome.id}: locus ${id} shows.`);
    }
    validateLinkage(genome);
    if (genome.epistasis !== undefined) {
        check(Array.isArray(genome.epistasis) && genome.epistasis.every(rule =>
            object(rule) && rule.target !== rule.suppressor && Object.hasOwn(genome.loci, rule.target) &&
            Object.hasOwn(genome.loci, rule.suppressor) && [1, 2].includes(rule.atLeast) &&
            (rule.unless === undefined || object(rule.unless) && isKey(rule.unless.quantity) && Number.isSafeInteger(rule.unless.min))),
        'Epistasis needs distinct target and suppressor loci and an expression threshold.');
    }
    if (genome.ivs !== undefined) validateIVRule(genome.ivs);
    if (genome.development !== undefined) {
        check(object(genome.development), 'Development needs a valid growth policy.');
        const {iv, expressed, pauseWhileInjured} = genome.development;
        check((iv !== undefined || expressed !== undefined || pauseWhileInjured === true) &&
            (pauseWhileInjured === undefined || typeof pauseWhileInjured === 'boolean') &&
            (iv === undefined || object(iv) && genome.ivs?.stats.includes(iv.stat) && positive(iv.perMinute)) &&
            (expressed === undefined || object(expressed) && Object.hasOwn(genome.loci, expressed.locus) &&
                natural(expressed.minutesPerLevel) && Number.isSafeInteger(expressed.minutesPerLevel * 2)),
        'Development needs a valid growth policy.');
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

/** Transmit one copy per parent. Phased pairs use a consistent chromosome order
 * across loci. With unknown phase, a parent's existing per-locus draw still applies.
 * `exposure` raises mutation (GN4); mutations are reported after transmission. */
export function inheritGenes(genome, sire, dam, {root, at, exposure = {}, phased = [],
    parentGenomes = [genome, genome], alleleMaps}) {
    validateGenome(genome);
    const parents = [sire, dam];
    check(Array.isArray(parentGenomes) && parentGenomes.length === 2, 'Inheritance needs two parent genomes.');
    for (const [side, parent] of parents.entries()) {
        if (parentGenomes[side] !== genome) validateGenome(parentGenomes[side]);
        validateGenes(parentGenomes[side], parent);
    }
    validateCrossAlleleMaps(genome, parentGenomes, alleleMaps);
    const genes = {}, mutated = [];
    const copies = [new Map(), new Map()];
    for (const [side, picks] of copies.entries()) {
        if (phased[side] !== true) continue;
        for (const {loci, crossovers} of parentGenomes[side].linkage ?? []) {
            let copy = roll(root, at, loci[0], side, 'pick') < 500 ? 0 : 1;
            picks.set(loci[0], copy);
            for (let i = 1; i < loci.length; i++) {
                if (roll(root, at, loci[i - 1], loci[i], side, 'crossover') < crossovers[i - 1]) copy = 1 - copy;
                picks.set(loci[i], copy);
            }
        }
    }
    for (const [id, locus] of Object.entries(genome.loci)) {
        const rate = mutationRate(genome, locus.mutation ?? genome.mutation ?? 0, exposure);
        genes[id] = parents.map((parent, side) => {
            const map = alleleMaps?.[side];
            const translation = map && Object.hasOwn(map, id) ? map[id] : undefined;
            const sourceId = translation?.locus ?? id;
            const copy = copies[side].get(sourceId) ?? (roll(root, at, sourceId, side, 'pick') < 500 ? 0 : 1);
            const source = Object.hasOwn(parentGenomes[side].loci, sourceId) && parentGenomes[side].loci[sourceId];
            // A locus missing from this parent's map contributes the plain
            // copy in this diploid model. Incompatible symbols do likewise.
            let allele = source && source.strong === locus.strong && source.plain === locus.plain
                ? parent[sourceId][copy] : locus.plain;
            if (translation) allele = parent[sourceId][copy] === source.strong ? translation.strong : translation.plain;
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

// Maps are indexed by parent, then offspring locus. Each row names the
// parental locus and the offspring symbols for its strong and plain copies.
export function validateCrossAlleleMaps(genome, parentGenomes, maps) {
    if (maps === undefined) return;
    check(Array.isArray(maps) && maps.length === 2, 'A cross needs one allele map per parent.');
    for (const [side, map] of maps.entries()) {
        check(object(map), 'Invalid cross allele map.');
        for (const [id, row] of Object.entries(map)) {
            const target = Object.hasOwn(genome.loci, id) && genome.loci[id];
            check(target && object(row) && isKey(row.locus) && Object.hasOwn(parentGenomes[side].loci, row.locus) &&
                [row.strong, row.plain].every(allele => allele === target.strong || allele === target.plain),
            'Cross allele mapping needs a parent locus and two valid offspring symbols.');
        }
    }
}

export function validateIVs(rule, values) {
    validateIVRule(rule);
    check(object(values) && Object.keys(values).length === rule.stats.length &&
        rule.stats.every(stat => Object.hasOwn(values, stat) && natural(values[stat]) && values[stat] <= rule.max),
    'Individual values must match the genome stat range.');
    return values;
}

// Fresh values for every stat, then copy distinct stats from the two parents.
// The reproduction method may supply an adjusted count or one guaranteed copy.
export function inheritIVs(rule, parents, {root, at, count = rule.inheritCount, guaranteed} = {}) {
    check(Array.isArray(parents) && parents.length === 2, 'Individual values need two parents.');
    parents.forEach(parent => validateIVs(rule, parent));
    check(natural(count) && count <= rule.stats.length &&
        (guaranteed === undefined || object(guaranteed) && count > 0 && rule.stats.includes(guaranteed.stat) &&
            [0, 1].includes(guaranteed.parent)), 'Invalid individual-value inheritance.');
    const draw = (size, ...key) => indexFromU32(drawU32(root, address('individual-value', at, ...key)), size);
    const stats = [...rule.stats].sort();
    const values = Object.fromEntries(stats.map(stat => [stat, draw(rule.max + 1, stat, 'fresh')]));
    const pool = stats.filter(stat => stat !== guaranteed?.stat);
    if (guaranteed) values[guaranteed.stat] = parents[guaranteed.parent][guaranteed.stat];
    for (let i = guaranteed ? 1 : 0; i < count; i++) {
        const [stat] = pool.splice(draw(pool.length, i, 'stat'), 1);
        values[stat] = parents[draw(2, stat, 'parent')][stat];
    }
    return values;
}

// 0 absent, 1 mild, 2 full; dominant and recessive show only 0 or 2 (lineage_traits.level).
function geneLevel(locus, alleles) {
    const n = alleles.filter(a => a === locus.strong).length;
    return locus.mode === 'dominant' ? (n ? 2 : 0) : locus.mode === 'recessive' ? (n === 2 ? 2 : 0) : n;
}

/**
 * GN2: what shows, from genes through growth, place and life. Each locus reports its
 * level and its cause: genes, another carried locus, growth, place or condition.
 */
export function expressGenes(genome, genes, {mature = true, environment = {}, conditions = []} = {}) {
    validateGenes(genome, genes);
    const suppressed = new Set();
    for (const {target, suppressor, atLeast, unless} of genome.epistasis ?? []) {
        if (unless && (environment[unless.quantity] ?? -Infinity) >= unless.min) continue;
        if (geneLevel(genome.loci[suppressor], genes[suppressor]) >= atLeast) suppressed.add(target);
    }
    return Object.fromEntries(Object.entries(genome.loci).map(([id, locus]) => {
        const carried = geneLevel(locus, genes[id]), shows = locus.shows ?? {};
        let level = carried, cause = 'genes';
        if (carried && suppressed.has(id)) { level = 0; cause = 'epistasis'; }
        else if (carried && shows.mature && !mature) { level = 0; cause = 'growth'; }
        else if (carried && shows.needs && !((environment[shows.needs.quantity] ?? -Infinity) >= shows.needs.min)) { level = 0; cause = 'place'; }
        else if (carried && shows.suppressedBy?.some(c => conditions.includes(c))) { level = 0; cause = 'condition'; }
        return [id, {level, carried, shows: level === 0 ? 'absent' : level === 1 ? 'mild' : 'full', cause, affects: locus.affects ?? null}];
    }));
}

/** Project only the contribution a local consumer asks for, in its own unit. */
export function geneContributions(genome, expression, {id, unit}) {
    return Object.entries(genome.loci).flatMap(([locus, definition]) => {
        const units = Object.hasOwn(definition.contributions ?? {}, id) ? definition.contributions[id] : 0;
        const value = units * expression[locus].level;
        return value ? [{source: `gene.${locus}`, unit, value}] : [];
    });
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

// GN8: count whole diploid profiles for a phased herd. Ordering the two
// chromosome copies together preserves phase and pairing. Sorting each
// locus separately, or drawing two independent haplotypes, would lose facts.
function phasedProfile(genes) {
    const loci = Object.keys(genes).sort();
    const copies = [0, 1].map(side => loci.map(locus => genes[locus][side]));
    const swap = JSON.stringify(copies[0]) > JSON.stringify(copies[1]);
    return Object.fromEntries(loci.map(locus => [locus, swap ? [...genes[locus]].reverse() : [...genes[locus]]]));
}

const phasedProfileId = (genes, sterile) => JSON.stringify(genes) + (sterile ? ':sterile' : '');

export function validatePhasedCohort(phase, stock) {
    check(object(phase) && isKey(phase.genome) && Array.isArray(phase.profiles), 'Invalid phased herd.');
    let total = 0, last = '', loci;
    for (const row of phase.profiles) {
        check(object(row), 'Invalid phased herd profile.');
        const {genes, count, sterile} = row;
        check(object(genes) && Object.keys(genes).length > 0 &&
            Object.entries(genes).every(([locus, pair]) => isKey(locus) && Array.isArray(pair) &&
                pair.length === 2 && pair.every(isKey)), 'Invalid phased herd alleles.');
        const keys = JSON.stringify(Object.keys(genes));
        loci ??= keys;
        check(keys === loci, 'Phased herd profiles must carry the same loci.');
        const id = phasedProfileId(genes, sterile);
        check((sterile === undefined || sterile === true) &&
            JSON.stringify(genes) === JSON.stringify(phasedProfile(genes)) && id > last && natural(count) && count > 0,
            'Invalid or duplicate phased herd profile.');
        last = id;
        total += count;
    }
    check(Number.isSafeInteger(total) && total === stock, 'Phased profiles must account for every herd member.');
    return phase;
}

export function changePhasedStock(phase, genome, genes, delta, sterile = false) {
    check(phase.genome === genome.id, 'The herd needs its original genome.');
    validateGenes(genome, genes);
    const profile = phasedProfile(genes);
    check(typeof sterile === 'boolean', 'Invalid phased stock fertility.');
    const id = phasedProfileId(profile, sterile);
    const counts = new Map(phase.profiles.map(row => [phasedProfileId(row.genes, row.sterile), row]));
    const count = (counts.get(id)?.count ?? 0) + delta;
    check(natural(count), 'Insufficient stock of the specified phased profile.');
    if (count === 0) counts.delete(id);
    else counts.set(id, {genes: profile, count, ...(sterile ? {sterile: true} : {})});
    const profiles = [...counts.keys()].sort().map(key => counts.get(key));
    return {...phase, profiles};
}

function phasedIndex(stock, root, at) {
    // Two addressed 32-bit draws give an exact 64-bit numerator for large herds.
    const high = BigInt(drawU32(root, address(at, 'phased-herd', 0)));
    const low = BigInt(drawU32(root, address(at, 'phased-herd', 1)));
    return Number((((high << 32n) | low) * BigInt(stock)) >> 64n);
}

function phasedProfileAt(phase, index) {
    for (const row of phase.profiles) {
        if (index < row.count) return row;
        index -= row.count;
    }
    throw Error('Phased herd counts do not match its stock.');
}

export function drawPhasedMember(phase, stock, genome, {root, at}) {
    const {genes, sterile} = phasedProfileAt(phase, phasedIndex(stock, root, at));
    return {genes, ...(sterile ? {sterile} : {}), phase: changePhasedStock(phase, genome, genes, -1, sterile)};
}

export function breedPhasedMembers(phase, stock, genome, {root, at, exposure}) {
    // Draw two different members. Identical profiles can still be two parents.
    const first = phasedIndex(stock, root, address(at, 0));
    const other = phasedIndex(stock - 1, root, address(at, 1));
    const second = other >= first ? other + 1 : other;
    return inheritGenes(genome, phasedProfileAt(phase, first).genes, phasedProfileAt(phase, second).genes,
        {root, at, exposure, phased: [true, true]}).genes;
}

export function crossPhasedMembers(sources, genome, {root, at, exposure, alleleMaps}) {
    const parents = sources.map(({phase, stock}, side) =>
        phasedProfileAt(phase, phasedIndex(stock, root, address(at, side))).genes);
    return inheritGenes(genome, ...parents, {root, at, exposure, phased: [true, true],
        parentGenomes: sources.map(source => source.genome), alleleMaps}).genes;
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
