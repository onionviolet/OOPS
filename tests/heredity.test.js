// Foundation L heredity layer (GN1-GN9, PFP27, OA5). Genome numbers are dials or fixtures.
import assert from 'node:assert/strict';
import test from 'node:test';

import {acquireCreature, advanceWildHabitat, markCreatureGenesKnown, openWildHabitat, restoreCreatureLifecycle,
    setCohortAlleles, settleCohortStock, settleCreatureBirth, startCreatureBrood} from '../src/creature_lifecycle.js';
import {crossOutcome, expressGenes, frequenciesFrom, genomeDistance, hybridGenome, individualSpread, inheritGenes,
    learnFromChild, mutationRate, pickParental, validateGenome} from '../src/heredity.js';
import {LIVING_GENOMES} from '../src/living_genomes.js';
import {livingGenome, livingKindRegistry} from '../src/living_kinds.js';
import {readLivingBody} from '../src/living_body.js';
import {phenotype as lineagePhenotype} from '../src/lineage_traits.js';
import {address, drawU32} from '../src/gen_kit.js';

const registry = livingKindRegistry();
const sheep = livingGenome(registry, 'sheep');
const pen = {id: 'pen', capacity: 8, supportedSpecies: ['sheep']};
const genes = (f, d, w, v) => ({fleece: f, coat: d, winter: w, vigor: v});

function flock() {
    let s = restoreCreatureLifecycle();
    s = settleCohortStock(s, {revision: s.revision, id: 'market', species: 'sheep', habitat: pen, delta: 2});
    const ewe = acquireCreature(s, {revision: s.revision, cohortId: 'market', destination: pen, keeper: 'player', clock: 0,
        traits: {coat: 'cream'}, genes: genes(['F', 'f'], ['D', 'd'], ['W', 'w'], ['V', 'v'])});
    const ram = acquireCreature(ewe.state, {revision: ewe.state.revision, cohortId: 'market', destination: pen, keeper: 'player', clock: 0,
        traits: {coat: 'brown'}, genes: genes(['F', 'f'], ['d', 'd'], ['w', 'w'], ['V', 'V'])});
    return {s: ram.state, ewe: ewe.id, ram: ram.id};
}

test('OA5: whole traits still copy from one parent at the old address, so existing broods settle the same', () => {
    for (const [root, brood, name] of [['meadow:3', 'brood:7', 'coat'], ['x', 'brood:1', 'fleece']]) {
        const old = drawU32(root, address('creature-inheritance', brood, name)) % 2 ? 'left' : 'right';
        assert.equal(pickParental(root, brood, name, 'left', 'right'), old);
    }
    assert.equal(pickParental('r', 'b', 'n', undefined, 'only'), 'only');
});

test('GN1: the person genome is lineage_traits’ own loci, and both models show the same phenotype', () => {
    const person = LIVING_GENOMES['person.household'];
    for (const g of [{wind: ['W', 'w'], eye: ['E', 'e'], nerve: ['N', 'n'], knack: ['K', 'K']},
        {wind: ['w', 'w'], eye: ['E', 'E'], nerve: ['N', 'N'], knack: ['k', 'K']}]) {
        const ours = Object.fromEntries(Object.entries(expressGenes(person, g)).map(([l, v]) => [l, v.level]));
        assert.deepEqual(ours, lineagePhenotype(g));
    }
    assert.throws(() => validateGenome({id: 'bad', family: 'x', loci: {a: {mode: 'odd', strong: 'A', plain: 'a'}}}), /mode/);
});

test('GN2 and GN6: a lamb’s genes come from its parents, show through growth, place and life, and stay hidden until learned', () => {
    let {s, ewe, ram} = flock();
    const brood = startCreatureBrood(s, {revision: s.revision, parents: [ewe, ram], keeper: 'player', clock: 1,
        gestationMinutes: 10, growthMinutes: 20, root: 'meadow:1', genome: sheep});
    const born = settleCreatureBirth(brood.state, {revision: brood.state.revision, broodId: brood.id, clock: 11, destination: pen});
    s = born.state;
    const lamb = s.individuals[born.id];
    for (const locus of Object.keys(sheep.loci))
        for (const [side, parent] of [[0, ewe], [1, ram]]) assert.ok(s.individuals[parent].genes[locus].includes(lamb.genes[locus][side]) ||
            brood.mutated.includes(locus), `${locus} from parent ${side}`);
    // Fixed genes isolate the four causes for one body.
    const shown = (g, ctx) => expressGenes(sheep, g, ctx);
    const fine = genes(['F', 'F'], ['D', 'd'], ['W', 'W'], ['V', 'v']);
    assert.equal(shown(fine, {mature: false}).fleece.cause, 'growth');
    assert.equal(shown(fine, {mature: true}).fleece.shows, 'full');
    assert.equal(shown(fine, {environment: {}}).winter.cause, 'place');
    assert.equal(shown(fine, {environment: {cold: 2}}).winter.shows, 'full');
    assert.equal(shown(fine, {conditions: ['starved']}).vigor.cause, 'condition');
    assert.equal(shown(fine, {}).coat.shows, 'mild');
    // The keeper sees the phenotype; a dominant that shows hides its second allele.
    const read = readLivingBody({lifecycle: s, registry, id: ewe, clock: 12, sinceMeal: 0, environment: {cold: 1}, root: 'w'});
    assert.deepEqual(read.genotype.winter.alleles, ['W', '?']);
    assert.equal(read.genotype.coat.known, true, 'incomplete loci show their alleles');
    const known = markCreatureGenesKnown(s, {revision: s.revision, id: ewe, loci: ['winter']});
    assert.deepEqual(readLivingBody({lifecycle: known, registry, id: ewe, clock: 12, sinceMeal: 0}).genotype.winter.alleles, ['W', 'w']);
    // A lamb showing fine wool (recessive) proves the ewe carries it; a lamb with no winter
    // coat or vigor gene proves the ewe, who shows both, also carries the plain allele.
    assert.deepEqual(learnFromChild(sheep, s.individuals[ewe].genes, [], genes(['F', 'F'], ['d', 'd'], ['w', 'w'], ['v', 'v'])),
        ['fleece', 'winter', 'vigor']);
    assert.deepEqual(learnFromChild(sheep, s.individuals[ewe].genes, [], genes(['F', 'f'], ['d', 'd'], ['W', 'w'], ['V', 'v'])), []);
    assert.deepEqual(restoreCreatureLifecycle(JSON.parse(JSON.stringify(s))).individuals[born.id].genes, lamb.genes);
});

test('GN3: each individual draws its own spread inside the kind’s range, the same on every read', () => {
    const a = individualSpread(sheep, {root: 'w', id: 'creature:1'}), b = individualSpread(sheep, {root: 'w', id: 'creature:2'});
    assert.deepEqual(a, individualSpread(sheep, {root: 'w', id: 'creature:1'}));
    assert.notDeepEqual(a, b);
    for (const v of [a, b]) assert.ok(v.heightCm >= 60 && v.heightCm <= 75 && v.woolPerBatch >= 4 && v.woolPerBatch <= 6);
});

test('GN4: a storm during the brood raises mutation by the genome’s mutagen', () => {
    assert.equal(mutationRate(sheep, 8, {lightning: 2}), 56);
    const parent = genes(['f', 'f'], ['d', 'd'], ['w', 'w'], ['v', 'v']);
    const count = exposure => Array.from({length: 400}, (_, i) =>
        inheritGenes(sheep, parent, parent, {root: 'storm', at: `b${i}`, exposure}).mutated.length).reduce((a, b) => a + b, 0);
    const calm = count({}), storm = count({lightning: 3});
    assert.ok(storm > calm * 4, `calm ${calm}, storm ${storm}`);
});

test('GN5: crosses breed true, make a mule or fail by genome distance', () => {
    const base = {family: 'ovine', mutation: 0, loci: {a: {mode: 'dominant', strong: 'A', plain: 'a'}, b: {mode: 'dominant', strong: 'B', plain: 'b'},
        c: {mode: 'dominant', strong: 'C', plain: 'c'}, d: {mode: 'dominant', strong: 'D', plain: 'd'}}};
    const near = {...base, id: 'near'}, far = {...base, id: 'far', loci: {...base.loci, c: {mode: 'dominant', strong: 'X', plain: 'x'},
        e: {mode: 'dominant', strong: 'E', plain: 'e'}}};
    const goat = {...base, id: 'goat', family: 'caprine'};
    assert.deepEqual(crossOutcome(near, {...near, id: 'near2'}), {viable: true, fertile: true, distance: 0, reason: 'close enough to breed true'});
    assert.equal(genomeDistance(near, far), 400);
    assert.deepEqual([crossOutcome(near, far).viable, crossOutcome(near, far).fertile], [true, false]);
    assert.equal(crossOutcome(sheep, goat).reason, 'different families');
    assert.deepEqual(Object.keys(hybridGenome(near, far).loci).sort(), ['a', 'b', 'c', 'd', 'e']);
});

test('GN8: a wild warren keeps allele counts, not individuals; one caught rabbit is drawn from them', () => {
    const rabbit = livingGenome(registry, 'rabbit');
    const warren = {id: 'warren', capacity: 40, supportedSpecies: ['rabbit']};
    let s = restoreCreatureLifecycle();
    s = settleCohortStock(s, {revision: s.revision, id: 'rabbit', species: 'rabbit', habitat: warren, delta: 10});
    s = setCohortAlleles(s, {revision: s.revision, id: 'rabbit', alleles: frequenciesFrom(rabbit,
        Array.from({length: 10}, (_, i) => ({agouti: i < 7 ? ['A', 'a'] : ['a', 'a'], lop: ['l', i < 2 ? 'L' : 'l']})))});
    const pair = row => row.strong + row.plain;
    s = openWildHabitat(s, {revision: s.revision, id: 'warren', clock: 0, interval: 10});
    const run = state => advanceWildHabitat(state, {revision: state.revision, habitat: warren, clock: 50,
        populations: [{id: 'rabbit', births: 3, losses: 0}]}).state;
    const jump = run(s);
    for (const row of Object.values(jump.cohorts.rabbit.alleles)) assert.equal(pair(row), 2 * jump.cohorts.rabbit.stock);
    let steps = s;
    for (const t of [10, 20, 30, 40, 50]) steps = advanceWildHabitat(restoreCreatureLifecycle(JSON.parse(JSON.stringify(steps))),
        {revision: steps.revision, habitat: warren, clock: t, populations: [{id: 'rabbit', births: 3, losses: 0}]}).state;
    assert.deepEqual(steps.cohorts.rabbit, jump.cohorts.rabbit);
    assert.throws(() => acquireCreature(jump, {revision: jump.revision, cohortId: 'rabbit', destination: warren, keeper: 'player', clock: 50}),
        /allele counts/);
    const caught = acquireCreature(jump, {revision: jump.revision, cohortId: 'rabbit', destination: warren, keeper: 'player', clock: 50,
        genome: rabbit, root: 'hunt'});
    const left = caught.state.cohorts.rabbit;
    for (const row of Object.values(left.alleles)) assert.equal(pair(row), 2 * left.stock);
    assert.equal(caught.state.individuals[caught.id].genes.agouti.length, 2);
});
