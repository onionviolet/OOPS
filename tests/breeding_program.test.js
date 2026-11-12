// PC96 worked example: the improvement loop, run on the village sheep with no code
// written for optimizing. A breeder policy (fixture) drives the real lifecycle and
// heredity functions for twenty generations. Nothing here draws a gene: every lamb
// comes from startCreatureBrood and settleCreatureBirth with addressed draws.
//
// The policy: a pen of six. Each generation the two best-looking adults have four
// lambs, the lambs grow up, and the four worst-looking of the ten are sold.
// Findings that the code does not support are named in skipped tests at the bottom.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
    acquireCreature, creatureDevelopment, markCreatureGenesKnown, restoreCreatureLifecycle, settleCohortStock,
    settleCreatureBirth, setCohortAlleles, startCreatureBrood, transferCreature,
} from '../src/creature_lifecycle.js';
import {
    expressGenes, expressPolygenic, foundingBreeding, foundingGenes, frequenciesFrom, genotypeView, learnFromChild,
} from '../src/heredity.js';
import {LIVING_GENOMES} from '../src/living_genomes.js';
import {kinship} from '../src/lineage_traits.js';

const genome = LIVING_GENOMES['village.sheep'];
const pen = {id: 'pen', capacity: 10, supportedSpecies: ['sheep']};
const market = {id: 'market', capacity: 1000, supportedSpecies: ['sheep']};
const KEEPER = 'breeder', FLOCK = 6, LAMBS = 4, GESTATION = 200, GROWTH = 300;
const SEEDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const FLEECE = {locus: 'fleece'}, WOOL = {polygenic: 'woolTenths'}, WINTER = {locus: 'winter'};
const mean = list => list.reduce((sum, n) => sum + n, 0) / list.length;

/**
 * judge: 'phenotype' sees only what shows; 'offspring' also keeps what a lamb's looks
 * prove about its parents (learnFromChild, free); 'tested' tests every animal at the
 * goal locus (markCreatureGenesKnown, one test each, counted).
 */
function runProgram({seed, goal, judge = 'phenotype', generations = 20, exposure = {}, environment = {},
    gestation = GESTATION, late = 0, founders = null}) {
    const root = `breeding-program:${seed}`;
    let state = settleCohortStock(restoreCreatureLifecycle(null),
        {revision: 0, id: 'pen.sheep', species: 'sheep', habitat: pen, delta: FLOCK});
    for (let i = 0; i < FLOCK; i++) {
        state = acquireCreature(state, {revision: state.revision, cohortId: 'pen.sheep', destination: pen, keeper: KEEPER,
            genome, genes: founders?.[i] ?? foundingGenes(genome, {root, at: `founder:${i}`}),
            breeding: foundingBreeding(genome, {root, at: `founder:${i}`})}).state;
    }
    let clock = 1, tests = 0, mutations = 0;
    const flock = () => Object.entries(state.individuals).filter(([, a]) => a.habitat === pen.id)
        .map(([id, animal]) => ({id, ...animal}));
    const shown = animal => expressGenes(genome, animal.genes,
        {mature: creatureDevelopment(state, animal.id, clock).mature, environment});
    const wool = animal => expressPolygenic(genome, animal.breeding, {root, id: animal.id}).woolTenths;
    const score = animal => {
        if (goal.polygenic) return wool(animal);
        const level = shown(animal)[goal.locus].level;
        if (judge === 'phenotype') return level * 10;
        const strong = genome.loci[goal.locus].strong;
        const known = genotypeView(genome, animal.genes, animal.tested, goal.locus).alleles.filter(a => a === strong).length;
        return level * 10 + known;
    };
    const ranked = () => flock().sort((a, b) => score(b) - score(a) || b.serial - a.serial);
    const inspect = () => {
        if (judge !== 'tested' || !goal.locus) return;
        for (const animal of flock()) {
            if (genotypeView(genome, animal.genes, animal.tested, goal.locus).known) continue;
            state = markCreatureGenesKnown(state, {revision: state.revision, id: animal.id, loci: [goal.locus]});
            tests++;
        }
    };
    const measure = () => {
        const animals = flock(), counts = frequenciesFrom(genome, animals.map(a => a.genes));
        return {
            shows: goal.locus ? mean(animals.map(a => Number(shown(a)[goal.locus].level === 2))) : null,
            fine: mean(animals.map(a => Number(shown(a).fleece.level === 2))),
            strong: Object.fromEntries(Object.entries(counts).map(([id, row]) => [id, row.strong / (row.strong + row.plain)])),
            wool: mean(animals.map(wool)),
            woolBreeding: mean(animals.map(a => a.breeding.woolTenths)),
        };
    };
    const history = [measure()];
    for (let generation = 0; generation < generations; generation++) {
        inspect();
        const [first, second] = ranked();
        for (let lamb = 0; lamb < LAMBS; lamb++) {
            const brood = startCreatureBrood(state, {revision: state.revision, parents: [first.id, second.id], keeper: KEEPER,
                clock, gestationMinutes: gestation, growthMinutes: GROWTH, root, genome, exposure});
            mutations += brood.mutated.length;
            clock += gestation + late;
            const born = settleCreatureBirth(brood.state, {revision: brood.state.revision, broodId: brood.id, clock, destination: pen});
            state = born.state;
            if (judge === 'offspring') {
                const child = state.individuals[born.id];
                for (const id of [first.id, second.id]) {
                    const parent = state.individuals[id];
                    const learned = learnFromChild(genome, parent.genes, parent.tested, child.genes).filter(l => !parent.tested.includes(l));
                    if (learned.length) state = markCreatureGenesKnown(state, {revision: state.revision, id, loci: learned});
                }
            }
        }
        clock += GROWTH;
        inspect();
        for (const animal of ranked().slice(FLOCK)) {
            state = transferCreature(state, {revision: state.revision, id: animal.id, fromKeeper: KEEPER, toKeeper: null, destination: market});
        }
        history.push(measure());
    }
    const members = Object.entries(state.individuals).sort(([, a], [, b]) => a.serial - b.serial)
        .map(([id, a]) => ({id, sire: a.parents?.[0] ?? null, dam: a.parents?.[1] ?? null}));
    const kept = flock();
    const pairs = kept.flatMap((a, i) => kept.slice(i + 1).map(b => kinship(members, a.id, b.id)));
    const reached = history.findIndex(row => row.shows === 1);
    return {history, end: history.at(-1), tests, mutations, kinship: mean(pairs), reached: reached < 0 ? generations + 1 : reached,
        genes: kept.map(a => JSON.stringify([a.genes, a.breeding])), clock, state};
}

test('1. selecting on looks raises the goal trait over twenty generations', () => {
    const one = runProgram({seed: 'a', goal: WOOL});
    assert.ok(one.end.wool >= one.history[0].wool + 8, `seed a wool ${one.history[0].wool} -> ${one.end.wool}`);
    assert.ok(mean(one.history.slice(11).map(r => r.wool)) > mean(one.history.slice(0, 10).map(r => r.wool)));

    const wool = SEEDS.map(seed => runProgram({seed, goal: WOOL}));
    assert.ok(wool.every(run => run.end.wool > run.history[0].wool), 'wool rose for every seed');
    assert.ok(mean(wool.map(run => run.end.wool - run.history[0].wool)) >= 10);
    // Heritability is 350 per-mille, so what shows runs ahead of what breeds true.
    assert.ok(mean(wool.map(run => run.end.woolBreeding - run.history[0].woolBreeding)) >= 8);

    const fleece = SEEDS.map(seed => runProgram({seed, goal: FLEECE}));
    const before = mean(fleece.map(run => run.history[0].strong.fleece)), after = mean(fleece.map(run => run.end.strong.fleece));
    assert.ok(after > before + 0.2, `fine-wool allele ${before} -> ${after}`);
    assert.ok(mean(fleece.map(run => run.end.fine)) > mean(fleece.map(run => run.history[0].fine)) + 0.3);
});

test('2. a different goal ends with a different flock from the same start and seed', () => {
    const fleece = runProgram({seed: 'a', goal: FLEECE}), wool = runProgram({seed: 'a', goal: WOOL});
    assert.deepEqual(fleece.history[0], {...wool.history[0], shows: fleece.history[0].shows});
    assert.notDeepEqual(fleece.genes, wool.genes);
    assert.ok(wool.end.wool - fleece.end.wool >= 5, `wool ${wool.end.wool} against ${fleece.end.wool}`);
    assert.ok(fleece.end.fine > wool.end.fine, `fine wool ${fleece.end.fine} against ${wool.end.fine}`);
});

test('3. trade-off: what selection costs today, and what it does not', () => {
    const fleece = SEEDS.map(seed => runProgram({seed, goal: FLEECE}));
    const wool = SEEDS.map(seed => runProgram({seed, goal: WOOL}));
    // True today: the cost of choosing one goal is the gain not made on the other.
    assert.ok(mean(wool.map(r => r.end.woolBreeding)) - mean(fleece.map(r => r.end.woolBreeding)) >= 6);
    assert.ok(mean(fleece.map(r => r.end.fine)) - mean(wool.map(r => r.end.fine)) >= 0.3);
    // True today: nothing ties fleece to wool. Selecting for fleece leaves wool to drift,
    // up in some flocks and down in others, with no pull either way.
    const drift = fleece.map(r => r.end.woolBreeding - r.history[0].woolBreeding);
    assert.ok(drift.some(d => d > 0) && drift.some(d => d < 0), `wool drift under fleece selection: ${drift}`);
    assert.ok(Math.abs(mean(drift)) < 4, `mean drift ${mean(drift)}`);
    // True today: a one-pair program makes the pen close kin, and the creature path
    // charges nothing for it (lineage_traits.breed does, for people).
    assert.ok(fleece.every(r => r.kinship > 0.5), `kinship ${fleece.map(r => r.kinship.toFixed(2))}`);
    assert.ok(mean(fleece.map(r => r.end.strong.vigor)) >= mean(fleece.map(r => r.history[0].strong.vigor)) - 0.25);
});

test('4. hidden genes: testing reaches an all-fine-wool pen sooner than judging by looks', () => {
    const by = judge => SEEDS.map(seed => runProgram({seed, goal: FLEECE, judge}));
    const looks = by('phenotype'), offspring = by('offspring'), tested = by('tested');
    const reach = runs => mean(runs.map(r => r.reached));
    assert.ok(reach(tested) < reach(looks), `tested ${reach(tested)} against looks ${reach(looks)}`);
    assert.ok(reach(offspring) <= reach(looks), `offspring ${reach(offspring)} against looks ${reach(looks)}`);
    assert.ok(tested.every(r => r.tests > 0) && looks.every(r => r.tests === 0));
    // The view the breeder ranks by never leaks a hidden allele.
    const carrier = {fleece: ['F', 'f'], coat: ['d', 'd'], winter: ['w', 'w'], vigor: ['v', 'v']};
    assert.deepEqual(genotypeView(genome, carrier, [], 'fleece').alleles, ['f', '?']);
    assert.deepEqual(genotypeView(genome, carrier, ['fleece'], 'fleece').alleles, ['F', 'f']);
});

test('5. a changed world changes the outcome through rows the genome already declares', () => {
    // Lightning over the pen (mutagens.lightning) raises changed lambs.
    const calm = SEEDS.map(seed => runProgram({seed, goal: FLEECE}));
    const storm = SEEDS.map(seed => runProgram({seed, goal: FLEECE, exposure: {lightning: 3}}));
    assert.ok(mean(storm.map(r => r.mutations)) >= 5 * mean(calm.map(r => r.mutations)),
        `changed loci ${mean(calm.map(r => r.mutations))} calm, ${mean(storm.map(r => r.mutations))} storm`);
    assert.notDeepEqual(storm.map(r => r.genes), calm.map(r => r.genes));
    // A pen with no fine-wool allele at all can only get one from a changed lamb.
    const plain = Array.from({length: FLOCK}, () => ({fleece: ['f', 'f'], coat: ['d', 'd'], winter: ['w', 'w'], vigor: ['v', 'v']}));
    const got = exposure => SEEDS.filter(seed => runProgram({seed, goal: FLEECE, founders: plain, exposure}).end.fine > 0).length;
    const stormy = got({lightning: 3}), quiet = got({});
    assert.ok(stormy > quiet, `pens that gained fine wool: ${quiet} calm, ${stormy} storm`);
    // The winter coat shows only in the cold (shows.needs), so a warm valley gives the
    // breeder nothing to choose by and a cold one does.
    const warm = SEEDS.map(seed => runProgram({seed, goal: WINTER, environment: {cold: 0}}));
    const cold = SEEDS.map(seed => runProgram({seed, goal: WINTER, environment: {cold: 1}}));
    assert.ok(warm.every(r => r.history.every(row => row.shows === 0)));
    assert.ok(mean(cold.map(r => r.end.strong.winter)) > mean(warm.map(r => r.end.strong.winter)) + 0.15,
        `winter allele ${mean(warm.map(r => r.end.strong.winter))} warm, ${mean(cold.map(r => r.end.strong.winter))} cold`);
});

test('6. time: the flock does not depend on when births are settled', () => {
    const prompt = runProgram({seed: 'a', goal: WOOL});
    const late = runProgram({seed: 'a', goal: WOOL, late: 5000});
    const slow = runProgram({seed: 'a', goal: WOOL, gestation: 9000});
    assert.ok(late.clock > prompt.clock * 5);
    assert.deepEqual(late.genes, prompt.genes);
    assert.deepEqual(slow.genes, prompt.genes);
    // The far-time form that exists is the cohort's allele counts, and there the step
    // size does change the herd: each single birth rounds 0.8 of a strong allele up to
    // one, so twenty settlements of one birth drift from 40% to 47% strong while one
    // settlement of twenty keeps 40%. Asserted as it stands today; see GAP 6.
    const herd = delta => {
        let state = settleCohortStock(restoreCreatureLifecycle(null), {revision: 0, id: 'hill', species: 'sheep', habitat: market, delta: 10});
        state = setCohortAlleles(state, {revision: state.revision, id: 'hill',
            alleles: Object.fromEntries(Object.keys(genome.loci).map(id => [id, {strong: 8, plain: 12}]))});
        for (let born = 0; born < 20; born += delta)
            state = settleCohortStock(state, {revision: state.revision, id: 'hill', species: 'sheep', habitat: market, delta});
        return state.cohorts.hill;
    };
    assert.deepEqual(herd(20).alleles.fleece, {strong: 24, plain: 36});
    assert.deepEqual(herd(1).alleles.fleece, {strong: 28, plain: 32});
});

// ---- gaps: what an improvement loop still lacks (findings for the coordinator) ----
test.skip('GAP 3: no gene of the sheep costs another trait (no linkage, no pleiotropy, no inbreeding cost on the creature path)', () => {});
test.skip('GAP 4: a creature gene test has no price or instrument; markCreatureGenesKnown is free and exact', () => {});
test.skip('GAP 6: no standing program; twenty generations cannot settle in one call, cohort births cannot select, and cohort births round differently by step size', () => {});
