// Foundation L heredity layer (GN1-GN9, PFP27, OA5). Genome numbers are dials or fixtures.
import assert from 'node:assert/strict';
import test from 'node:test';

import {acquireCreature, advanceWildHabitat, habitatOccupancy, injureCreature, markCreatureGenesKnown, openWildHabitat, practiceWithCreature, restoreCreatureLifecycle, returnPhasedCreature,
    setCohortAlleles, settleCohortStock, settleCreatureBirth, settleCreatureCare, startCreatureBrood, startCreatureCare, transferCreature} from '../src/creature_lifecycle.js';
import {crossOutcome, expressGenes, expressPolygenic, foundingBreeding, inheritBreeding, frequenciesFrom, genomeDistance, hybridGenome, individualSpread, inheritGenes,
    learnFromChild, mutationRate, pickParental, validateGenome} from '../src/heredity.js';
import {LIVING_GENOMES, MEADOW_BREEDING_GENOME} from '../src/living_genomes.js';
import {livingGenome, livingKindRegistry} from '../src/living_kinds.js';
import {readLivingBody} from '../src/living_body.js';
import {phenotype as lineagePhenotype} from '../src/lineage_traits.js';
import {address, drawU32} from '../src/gen_kit.js';
import {FINE_WOOL_KEY, planMeadowFleece} from '../src/meadow_fleece.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {CREATURE_FORM_PACK, creatureForm, defineCreatureEvolution} from '../src/creature_evolution.js';
import {beginWorking, settleWorking} from '../src/kernel_working.js';
import {beginContest, defineContestLaw, restoreContest, serializeContest} from '../src/contest.js';
import {abortLanternContest, enterLanternContest, LANTERN_CONTEST_PROPERTIES, stepLanternContest} from '../src/world_packs/meadow_lantern_contest.js';
import {readLineage} from '../src/world_substrate.js';
import {JUVENILE_GROWTH, livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {GRAZING_HOME, GRAZING_RANGE, MEADOW_FORAGE, MEADOW_GRAZING_PACK} from '../src/world_packs/meadow_grazing.js';
import {skyQuantities} from '../src/world_sky.js';
import {advancePhasedWorldHabitats, advancePhasedWorldHerds, demotePhasedWorldCreature, promotePhasedWorldCreature,
    relocateTrackedWorldCreature} from '../src/creature_herd_world.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../src/spell_law.js';
import {sharedEffect} from '../src/spell_effects.js';
import {BREW_DOSE_LAW} from '../src/brew_dose_delivery.js';
import {brewDoseQuantity} from '../src/engine_brew_stock.js';
import {BREW_BODY_STEAM} from '../src/world_substrate_packs/brew_vapor.js';
import {pepperupCase} from '../src/world_packs/brew_coverage_cases.js';
import {landEffect} from '../src/effect_host.js';
import {coverageCase as draughtCase, DRAUGHT_CASE_ID} from '../src/world_packs/hp_potion_case_scenes.js';
import {startMeadowClaspBrood, testMeadowFleece} from '../src/world_packs/meadow_breeding_bench.js';
import {gearWardShared, wearGearWard} from '../src/world_packs/gear_ward.js';
import {bindLanternWoolWard, lanternSpellWardPort, settleLanternWardImpact} from '../src/world_packs/meadow_lantern_ward.js';
import {BEACON_SHEEP_GENOME, BEACON_SHEEP_KIND, LANTERN_CLIP, LANTERN_COAT_PACK, LANTERN_FEED, LANTERN_FLEECE_GENOME, LANTERN_FLEECE_LAW, LANTERN_FLASH,
    LANTERN_EVOLUTION, LANTERN_MOONBEAM, LANTERN_MOON_CYCLE_PACK, LANTERN_SIGNAL, LANTERN_STORMFLASH, LANTERN_WISP_GLOW, awakenLanternHusk,
    MIST_LANTERN_GENOME, MIST_LANTERN_KIND, restoreMistLanternBaseForms,
    LANTERN_PRISM_COLLAR_PACK, LANTERN_PRISMFLASH, LANTERN_STEADY_SIGNAL, LANTERN_STORM_UPKEEP_PACK, LANTERN_WOOL_LAMP,
    WISP_FORAGE_RANGE, WISP_NECTAR, WISP_TIMED_FLIGHT, fastenLanternPrism,
    advanceLanternSpeciesClock, crossLanternPath, cueLanternSignal, extinguishLanternWoolLamp, finishLanternSpeciesMolt,
    offerLanternStatureMolt,
    lanternBodyReader, lanternCoatProperties, offerLanternGrowth, packLanternHusk, practiceLanternSheep, prepareLanternSpeciesMolt, runLanternSpeciesMolt,
    settleLanternGermline, settleLanternSpecies, tradeLanternHusk, tradeLanternSheep} from '../src/world_packs/meadow_lantern_fleece.js';

const registry = livingKindRegistry();
const sheep = livingGenome(registry, 'sheep');
const pen = {id: 'pen', capacity: 8, supportedSpecies: ['sheep']};
const genes = (f, d, w, v) => ({fleece: f, coat: d, winter: w, vigor: v});

const trialGenome = MEADOW_BREEDING_GENOME;
const wool = JSON.stringify({id: 'Wool'});
const roundTrip = state => restoreCreatureLifecycle(JSON.parse(JSON.stringify(state)));
const statValues = n => Object.fromEntries(trialGenome.ivs.stats.map(stat => [stat, n]));

test('a water spell reveals the inherited mist coat for light and shearing without changing its brood', () => {
    const genome = MIST_LANTERN_GENOME;
    const {id, child, lifecycle} = trialBirth({genome});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const wool = {kind: 'thing', id: 'wool'}, animal = {kind: 'body', id};
    const config = life => ({packs: ['w.sky', LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
        shared: {quantities: [WORLD_QUANTITIES.humidity]}, host: {laws: [LANTERN_FLEECE_LAW, SPELL_EFFECT_LAW],
            effects: {read: sharedEffect},
            ports: {readThing: lanternBodyReader(life, registry)}}});
    const engine = createEngineWorld({...config(lifecycle), clock: 10, holders: [
        {id: pen.id, kind: 'place', quantities: {humidity: 40, [light]: 0}},
        {id, kind: 'body', refs: {creature: id}, place: pen.id,
            properties: lanternCoatProperties(child, {mist: true}), quantities: {[charge]: 2}},
        {...wool, place: pen.id, quantities: {'stock:fine-wool': 0, 'stock:wool': 0, [charge]: 0}},
    ]});
    const restore = state => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(state))), config(roundTrip(lifecycle)));
    const advance = (state, at) => advanceEngineWorld(state, at).engine;
    const cast = spellEffectMethod([{
        sentence: {verb: 'add', object: 'water', target: 'place', time: 'instant', carrier: 'wand'},
        target: {id: pen.id}, minutes: 1, details: {target: {shape: 'holder', id: pen.id}, amount: 30},
    }]);
    const pending = startEngineWorking(engine, {...cast, id: 'wet-pen'});
    const wet = advance(restore(pending), 11);
    assert.equal(wet.records.workings['wet-pen'].landed[0]?.status, 'landed');
    assert.deepEqual(serializeEngineWorld(wet), serializeEngineWorld(advance(pending, 11)));
    assert.equal(wet.world.holders[pen.id].quantities.humidity, 70);
    const dry = advance(engine, 11);
    const work = (state, method, bindings) => advance(restore(startEngineWorking(state, {
        law: LANTERN_FLEECE_LAW, method, id: 'coat-work', bindings,
    })), state.world.clock + 1);
    const suppressed = work(dry, LANTERN_FLASH, {animal});
    assert.equal(suppressed.records.workings['coat-work'].record.receipts[0].reason, 'no-expressed-lantern-coat');
    assert.equal(suppressed.world.holders[id].quantities[charge], 2);
    const flashed = work(wet, LANTERN_FLASH, {animal});
    assert.equal(flashed.world.holders[pen.id].quantities[light], 4);
    assert.equal(flashed.world.holders[id].quantities[charge], 1);
    const yieldOf = state => work(state, LANTERN_CLIP, {animal, wool}).world.holders.wool.quantities['stock:fine-wool'];
    assert.equal(yieldOf(dry), 5);
    assert.equal(yieldOf(wet), 7);
    const dried = applyEngineOps(wet, [{op: 'set', holder: pen.id, quantity: 'humidity', amount: 40}], 'dry-pen');
    assert.equal(yieldOf(dried), 5);
    assert.equal(work(dried, LANTERN_FLASH, {animal}).records.workings['coat-work'].record.receipts[0].reason,
        'no-expressed-lantern-coat');
    const breed = world => {
        const state = roundTrip(lifecycle);
        const brood = startCreatureBrood(state, {revision: state.revision, parents: [id, child.parents[1]],
            keeper: 'player', clock: world.clock, root: 'mist-line', genome, gestationMinutes: 2, growthMinutes: 3,
            developmentEnvironment: {humidity: world.holders[pen.id].quantities.humidity}});
        return settleCreatureBirth(roundTrip(brood.state), {revision: brood.state.revision,
            broodId: brood.id, clock: world.clock + 2, destination: pen});
    };
    const born = breed(restore(wet).world), control = breed(restore(dry).world);
    assert.deepEqual(born, control);
    assert.deepEqual(born.state.individuals[id].genes, child.genes);
    const dryHarvest = ({id, state}) => planMeadowFleece(id, state.individuals[id], 5, {
        genome, clock: 16, environment: {humidity: 40},
    }).effects;
    assert.deepEqual(dryHarvest(born), dryHarvest(control));
    assert.equal(dryHarvest(born)[0].amount, 5);
});

test('a wild Mist Lantern brood carries its coat policy and phased genes into the newborn world body', () => {
    const genome = MIST_LANTERN_GENOME, species = MIST_LANTERN_KIND.id, herd = 'mist-herd';
    const habitat = {...pen, supportedSpecies: [species]};
    const lifeRegistry = livingKindRegistry({extra: [MIST_LANTERN_KIND, BEACON_SHEEP_KIND],
        genomes: {...LIVING_GENOMES, [genome.id]: genome, [BEACON_SHEEP_GENOME.id]: BEACON_SHEEP_GENOME}});
    const profile = genes(['F', 'F'], ['D', 'D'], ['w', 'w'], ['v', 'v']);
    const stock = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: herd,
        habitat, species, genome, genes: profile, delta: 2});
    const draw = state => acquireCreature(state, {revision: state.revision, cohortId: herd,
        destination: habitat, keeper: null, clock: 0, genome, root: 'mist-herd'});
    const first = draw(stock), second = draw(first.state);
    const lifecycle = openWildHabitat(second.state, {revision: second.state.revision, id: pen.id, clock: 0, interval: 2});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const config = life => ({packs: ['w.sky', LANTERN_COAT_PACK.id, CREATURE_FORM_PACK.id, LANTERN_MOON_CYCLE_PACK.id],
        ownPacks: [LANTERN_COAT_PACK, CREATURE_FORM_PACK, LANTERN_MOON_CYCLE_PACK],
        host: {laws: [LANTERN_FLEECE_LAW, LANTERN_EVOLUTION.law], ports: {readThing: lanternBodyReader(life, lifeRegistry)}}});
    const engine = createEngineWorld({...config(lifecycle), holders: [
        {id: pen.id, kind: 'place', quantities: {humidity: 40, daylight: 0, moon_phase: 4, [light]: 0}},
        {id: herd, kind: 'cohort', count: 0, place: pen.id, refs: {herd}},
        {id: 'mist-lamb-wool', kind: 'thing', place: pen.id,
            quantities: {'stock:fine-wool': 0, 'stock:wool': 0, [charge]: 0}},
        {id: 'beacon-lamp', kind: 'thing', place: pen.id, properties: {'lantern-wool-lamp': true}},
        {id: 'mist-altar', kind: 'thing', place: pen.id,
            quantities: {'stock:sun-prism': 1, 'stock:lantern-husk': 0}},
        ...[first.id, second.id].map(id => ({id, kind: 'body', place: pen.id, refs: {creature: id}})),
    ]});
    const restore = pair => {
        const lifecycle = roundTrip(pair.lifecycle);
        const engine = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pair.engine))), config(lifecycle));
        return restoreMistLanternBaseForms({engine, lifecycle});
    };
    const advance = (pair, clock, births = 1) => advancePhasedWorldHerds(pair, {revision: pair.lifecycle.revision,
        habitat, clock, populations: [{id: herd, genome, births, losses: 0,
            pedigree: {gestationMinutes: 2, growthMinutes: 2, maxKinship: 0},
            world: {birthRow: 'mist.birth', lossRow: 'mist.loss', perBirth: {[charge]: 0}, propertiesFor: lanternCoatProperties}}]});
    const start = {engine, lifecycle};
    const pending = restore(advance(start, 2));
    const born = restore(advance(pending, 4));
    assert.deepEqual(born.lifecycle, advance(start, 4).lifecycle);
    const [id, child] = Object.entries(born.lifecycle.individuals).find(([, animal]) => animal.bornAt === 4);
    assert.equal(child.species, species);
    assert.equal(child.phased, true);
    assert.deepEqual(child.genes, profile);
    assert.equal(creatureForm(born.engine.world.holders[id], 4), 'lantern-fleece');
    assert.deepEqual(readLineage(born.engine.world, id)[0].parents, [first.id, second.id]);
    const sun = humidity => applyEngineOps(born.engine, [
        {op: 'set', holder: pen.id, quantity: 'humidity', amount: humidity},
        {op: 'set', holder: pen.id, quantity: 'daylight', amount: 1},
    ], 'mist-lamb-habitat');
    const work = (humidity, method, bindings = {}) => {
        const aged = advanceEngineWorld(sun(humidity), 7).engine;
        const pending = startEngineWorking(aged, {law: LANTERN_FLEECE_LAW, method,
            id: 'first-mist-working', bindings: {animal: {kind: 'body', id}, ...bindings}});
        return advanceEngineWorld(restore({...born, engine: pending}).engine, 8).engine;
    };
    const dry = work(59, LANTERN_FLASH);
    assert.equal(dry.world.holders[id].quantities[charge], 0);
    assert.equal(dry.records.workings['first-mist-working'].record.receipts[0].reason, 'no-expressed-lantern-coat');
    const humid = work(60, LANTERN_FLASH);
    assert.equal(humid.world.holders[pen.id].quantities[light], 8);
    assert.equal(humid.world.holders[id].quantities[charge], 1);
    const wool = {kind: 'thing', id: 'mist-lamb-wool'};
    assert.equal(work(59, LANTERN_CLIP, {wool}).world.holders[wool.id].quantities['stock:fine-wool'], 5);
    assert.deepEqual(work(60, LANTERN_CLIP, {wool}).world.holders[wool.id].quantities,
        {'stock:fine-wool': 9, 'stock:wool': 0, [charge]: 2});

    const beaconHabitat = {...habitat, capacity: 12, supportedSpecies: [species, BEACON_SHEEP_KIND.id]};
    const cohortId = 'beacon-herd', keeper = 'player';
    const daylight = advance({engine: sun(60), lifecycle: born.lifecycle}, 12, 0);
    const dusk = applyEngineOps(daylight.engine, [{op: 'set', holder: pen.id, quantity: 'daylight', amount: 0}],
        'mist-lamb-moonlight');
    const animalRef = {kind: 'body', id};
    const {law, methods} = LANTERN_EVOLUTION;
    const legacy = applyEngineOps(dusk, [{op: 'property', holder: id, property: 'form', value: null}], 'old-mist-save');
    assert.equal(creatureForm(legacy.world.holders[id], 12), undefined);
    const repaired = restore({...daylight, engine: legacy});
    assert.deepEqual(repaired.engine.world.holders[id], dusk.world.holders[id]);
    assert.equal(repaired.engine.world.holders[first.id].properties.form, undefined);
    assert.equal(restoreMistLanternBaseForms(repaired).engine, repaired.engine);
    assert.deepEqual(readLineage(repaired.engine.world, id), readLineage(dusk.world, id));
    const moon = startEngineWorking(repaired.engine, {law, method: methods['moon-veil'], id: 'wild-born-moon-veil',
        bindings: {animal: animalRef, site: {kind: 'place', id: pen.id}}});
    const veiled = restore(advance(restore({...daylight, engine: moon}), 13, 0));
    assert.equal(creatureForm(veiled.engine.world.holders[id], 13), 'moon-fleece');
    const missingBase = applyEngineOps(veiled.engine, [{op: 'property', holder: id, property: 'form', value: null}],
        'old-mist-save-in-veil');
    const repairedVeil = restore({...veiled, engine: missingBase});
    assert.deepEqual(repairedVeil.engine.world.holders[id], veiled.engine.world.holders[id]);
    assert.equal(veiled.engine.world.holders[id].quantities[charge], 5);
    const beam = startEngineWorking(repairedVeil.engine, {law: LANTERN_FLEECE_LAW, method: LANTERN_MOONBEAM,
        id: 'wild-born-moonbeam', bindings: {animal: animalRef}});
    const lit = restore(advance(restore({...veiled, engine: beam}), 14, 0));
    assert.equal(lit.engine.world.holders[pen.id].quantities[light], 24);
    const ventilated = applyEngineOps(lit.engine, [
        {op: 'property', holder: id, property: 'lantern-sustain-mist-veil', value: true},
        {op: 'property', holder: pen.id, property: 'lantern-ventilation', value: 1},
    ], 'ventilate-moon-veil');
    const dryingBeam = startEngineWorking(ventilated, {law: LANTERN_FLEECE_LAW, method: LANTERN_MOONBEAM,
        id: 'moonbeam-at-drying', bindings: {animal: animalRef}});
    const drying = {...lit, engine: dryingBeam};
    const dryVeil = advance(restore(drying), 15, 0);
    assert.deepEqual(serializeEngineWorld(dryVeil.engine), serializeEngineWorld(advance(drying, 15, 0).engine));
    assert.equal(dryVeil.engine.world.holders[pen.id].quantities.humidity, 59);
    assert.equal(creatureForm(dryVeil.engine.world.holders[id], 15), 'lantern-fleece');
    assert.equal(dryVeil.engine.records.workings['moonbeam-at-drying'].record.receipts[0].reason, 'moonbeam-needs-moon-fleece');
    assert.equal(dryVeil.engine.world.holders[id].quantities[charge], 4);
    assert.equal(dryVeil.engine.world.holders[pen.id].quantities[light], 24);
    assert.equal(advance(restore(dryVeil), 16, 0).engine.world.holders[pen.id].quantities[light], 0);
    const defaultVeil = applyEngineOps(lit.engine, [
        {op: 'property', holder: pen.id, property: 'lantern-ventilation', value: 1},
    ], 'ventilate-default-veil');
    assert.equal(creatureForm(advance({...lit, engine: defaultVeil}, 15, 0).engine.world.holders[id], 15), 'moon-fleece');
    const reverted = startEngineWorking(lit.engine, {law, method: methods['revert-form'], id: 'wild-born-reversion',
        bindings: {animal: animalRef}});
    assert.equal(creatureForm(reverted.world.holders[id], 14), 'lantern-fleece');
    const afterReversion = startEngineWorking(reverted, {law: LANTERN_FLEECE_LAW, method: LANTERN_MOONBEAM,
        id: 'moonbeam-after-reversion', bindings: {animal: animalRef}});
    const base = advance(restore({...lit, engine: afterReversion}), 15, 0);
    assert.equal(base.engine.records.workings['moonbeam-after-reversion'].record.receipts[0].reason, 'moonbeam-needs-moon-fleece');
    assert.equal(base.engine.world.holders[id].quantities[charge], 4);
    const grown = advance(daylight, 14, 0);
    const candidate = grown.engine;
    const held = transferCreature(grown.lifecycle, {revision: grown.lifecycle.revision, id, fromKeeper: null,
        toKeeper: keeper, destination: beaconHabitat, clock: 14});
    const mistStock = settleCohortStock(held, {revision: held.revision, id: herd, habitat: beaconHabitat,
        species, genome, genes: profile, delta: 1});
    const mistMate = draw(mistStock);
    const withMistMate = transferCreature(mistMate.state, {revision: mistMate.state.revision, id: mistMate.id, fromKeeper: null,
        toKeeper: keeper, destination: beaconHabitat, clock: 14});
    const mistBrood = startCreatureBrood(withMistMate, {revision: withMistMate.revision, parents: [id, mistMate.id],
        keeper, clock: 14, genome, root: 'pre-molt-mist-lamb', gestationMinutes: 2, growthMinutes: 3});
    const beaconStock = settleCohortStock(mistBrood.state, {revision: mistBrood.state.revision, id: cohortId,
        habitat: beaconHabitat, species: BEACON_SHEEP_KIND.id, delta: 1});
    const mate = acquireCreature(beaconStock, {revision: beaconStock.revision, cohortId,
        destination: beaconHabitat, keeper, clock: 14, genome: BEACON_SHEEP_GENOME, genes: profile, phased: true});
    const beforeMolt = {engine: candidate, lifecycle: mate.state};
    const options = {id, keeper, habitat: beaconHabitat, cohortId, altar: 'mist-altar', working: 'mist-species-molt'};
    const prepared = prepareLanternSpeciesMolt(beforeMolt, options);
    const command = JSON.parse(JSON.stringify(prepared.pending));
    const dried = applyEngineOps(candidate, [{op: 'set', holder: pen.id, quantity: 'humidity', amount: 59}], 'dry-before-molt');
    const refused = finishLanternSpeciesMolt(restore({engine: dried, lifecycle: mate.state}), command, beaconHabitat);
    assert.equal(refused.changed, false);
    assert.equal(refused.engine.world.holders['mist-altar'].quantities['stock:sun-prism'], 1);
    assert.equal(refused.lifecycle.individuals[id].species, species);
    assert.deepEqual(refused.lifecycle.broods[mistBrood.id], mistBrood.state.broods[mistBrood.id]);
    const changed = restore(finishLanternSpeciesMolt(restore(beforeMolt), command, beaconHabitat));
    assert.equal(changed.lifecycle.individuals[id].species, BEACON_SHEEP_KIND.id);
    assert.deepEqual(changed.lifecycle.individuals[id].genes, profile);
    assert.deepEqual(readLineage(changed.engine.world, id)[0].parents, [first.id, second.id]);
    assert.equal(changed.engine.world.holders[id].properties['lantern-mist-coat'], undefined);
    assert.equal(changed.engine.world.holders['mist-altar'].quantities['stock:sun-prism'], 0);
    const dryBeacon = applyEngineOps(changed.engine, [{op: 'set', holder: pen.id, quantity: 'humidity', amount: 40}], 'dry-beacon');
    const flash = startEngineWorking(dryBeacon, {law: LANTERN_FLEECE_LAW, method: LANTERN_FLASH,
        id: 'dry-beacon-flash', bindings: {animal: {kind: 'body', id}}});
    assert.equal(advanceEngineWorld(flash, 16).engine.world.holders[pen.id].quantities[light], 16);
    const clip = startEngineWorking(dryBeacon, {law: LANTERN_FLEECE_LAW, method: LANTERN_CLIP,
        id: 'dry-beacon-clip', bindings: {animal: {kind: 'body', id}, wool}});
    assert.equal(advanceEngineWorld(clip, 16).engine.world.holders[wool.id].quantities['stock:fine-wool'], 11);
    assert.deepEqual(changed.lifecycle.broods[mistBrood.id], {...mistBrood.state.broods[mistBrood.id], origin: herd});
    const carried = settleCreatureBirth(changed.lifecycle, {revision: changed.lifecycle.revision,
        broodId: mistBrood.id, clock: 16, destination: beaconHabitat});
    const mistOffspring = roundTrip(carried.state).individuals[carried.id];
    assert.equal(mistOffspring.species, species);
    assert.deepEqual(mistOffspring.parents, [id, mistMate.id]);
    const mistClip = humidity => planMeadowFleece(carried.id, mistOffspring, 5, {
        genome, clock: 19, environment: {humidity},
    }).effects;
    assert.deepEqual(mistClip(59), [{key: FINE_WOOL_KEY, amount: 5}]);
    assert.deepEqual(mistClip(60), [{key: FINE_WOOL_KEY, amount: 9}]);
    const brood = startCreatureBrood(carried.state, {revision: carried.state.revision, parents: [id, mate.id],
        keeper, clock: 16, genome: BEACON_SHEEP_GENOME, root: 'beacon-lamb', gestationMinutes: 2, growthMinutes: 3});
    const lamb = settleCreatureBirth(roundTrip(brood.state), {revision: brood.state.revision,
        broodId: brood.id, clock: 18, destination: beaconHabitat});
    const offspring = roundTrip(lamb.state).individuals[lamb.id];
    assert.equal(offspring.species, BEACON_SHEEP_KIND.id);
    assert.deepEqual(harvest({id: lamb.id, child: offspring}, BEACON_SHEEP_GENOME, 21), {'stock:fine-wool': 11});

    // Release the two adults into the Beacon herd. The evolved sheep's
    // natal Mist cohort stays in its identity history.
    const windows = (pair, clock, births) => advancePhasedWorldHerds(pair, {
        revision: pair.lifecycle.revision, habitat: beaconHabitat, clock, populations: [{
            id: cohortId, births, losses: 0, genome: BEACON_SHEEP_GENOME, root: 'beacon-wild-lamb',
            pedigree: {gestationMinutes: 2, growthMinutes: 3, maxKinship: 0},
            world: {birthRow: 'beacon.birth', lossRow: 'beacon.loss', perBirth: {[charge]: 0},
                propertiesFor: lanternCoatProperties},
        }],
    });
    const joined = applyEngineOps(dryBeacon, [
        {op: 'set', holder: pen.id, quantity: 'daylight', amount: 1},
        {op: 'holder_add', value: {id: cohortId, kind: 'cohort', place: pen.id, count: 0, refs: {herd: cohortId}}},
        {op: 'holder_add', value: {id: mate.id, kind: 'body', place: pen.id, refs: {creature: mate.id},
            properties: lanternCoatProperties(lamb.state.individuals[mate.id]), quantities: {[charge]: 0}}},
    ], 'bind-beacon-herd');
    const ready = windows({engine: joined, lifecycle: lamb.state}, 22, 0);
    let wild = ready.lifecycle;
    for (const adult of [id, mate.id]) wild = transferCreature(wild, {
        revision: wild.revision, id: adult, fromKeeper: keeper, toKeeper: null, destination: beaconHabitat, clock: 22,
    });
    const paired = restore(windows(restore({...ready, lifecycle: wild}), 24, 1));
    assert.deepEqual(Object.values(paired.lifecycle.broods).find(brood => brood.wild === cohortId)?.parents, [id, mate.id]);
    const nextWild = restore(windows(paired, 26, 0));
    const [wildId, wildLamb] = Object.entries(nextWild.lifecycle.individuals).find(([, animal]) => animal.bornAt === 26);
    assert.equal(wildLamb.origin, cohortId);
    assert.deepEqual(readLineage(nextWild.engine.world, wildId)[0].parents, [id, mate.id]);
    const grownBeacon = restore(windows(nextWild, 30, 0));
    const workBeacon = (method, bindings = {}, engine = grownBeacon.engine, working = 'first-wild-beacon-working') => startEngineWorking(engine, {
        law: LANTERN_FLEECE_LAW, method, id: working, bindings: {animal: {kind: 'body', id: wildId}, ...bindings},
    });
    const atDeadline = pending => advanceEngineWorld(restore({...grownBeacon, engine: pending}).engine, 31).engine;
    const firstClip = atDeadline(workBeacon(LANTERN_CLIP, {wool}));
    assert.deepEqual(firstClip.world.holders[wool.id].quantities, {'stock:fine-wool': 11, 'stock:wool': 0, [charge]: 2});
    const firstFlash = atDeadline(workBeacon(LANTERN_FLASH));
    assert.equal(firstFlash.world.holders[pen.id].quantities[light], 16);
    assert.equal(firstFlash.world.holders[wildId].quantities[charge], 1);
    const retry = workBeacon(LANTERN_FLASH, {}, firstClip, 'flash-before-regrowth');
    const refusedFlash = restore(windows(restore({...grownBeacon, engine: retry}), 32, 0));
    assert.equal(refusedFlash.engine.records.workings['flash-before-regrowth'].record.receipts[0].reason, 'lantern-coat-regrowing');
    assert.equal(refusedFlash.engine.world.holders[wildId].quantities[charge], 0);
    const regrown = restore(windows(refusedFlash, 35, 0));
    assert.equal(regrown.engine.world.holders[wildId].quantities[charge], 0);
    const recharged = restore(windows(regrown, 36, 0));
    assert.equal(recharged.engine.world.holders[wildId].quantities[charge], 1);
    const uninterrupted = windows({...grownBeacon, engine: retry}, 36, 0);
    assert.deepEqual(serializeEngineWorld(recharged.engine), serializeEngineWorld(uninterrupted.engine));
    assert.deepEqual(recharged.lifecycle, uninterrupted.lifecycle);
    const beaconDusk = applyEngineOps(recharged.engine, [
        {op: 'set', holder: pen.id, quantity: 'daylight', amount: 0},
    ], 'beacon-lamb-dusk');
    const secondFlash = workBeacon(LANTERN_FLASH, {}, beaconDusk, 'flash-after-regrowth');
    const shone = restore(windows(restore({...recharged, engine: secondFlash}), 37, 0));
    assert.equal(shone.engine.world.holders[pen.id].quantities[light], 16);
    assert.equal(shone.engine.world.holders[wildId].quantities[charge], 0);
    assert.deepEqual(shone.engine.world.holders[wool.id].quantities, firstClip.world.holders[wool.id].quantities);
    assert.deepEqual(readLineage(shone.engine.world, wildId), readLineage(nextWild.engine.world, wildId));
    const pendingLamp = startEngineWorking(shone.engine, {law: LANTERN_FLEECE_LAW, method: LANTERN_WOOL_LAMP,
        id: 'wild-beacon-wool-lamp', bindings: {wool, lamp: {kind: 'thing', id: 'beacon-lamp'}, site: {kind: 'place', id: pen.id}}});
    const lampLit = restore(windows(restore({...shone, engine: pendingLamp}), 38, 0));
    assert.equal(lampLit.engine.world.holders[pen.id].quantities[light], 24);
    assert.deepEqual(lampLit.engine.world.holders[wool.id].quantities, {'stock:fine-wool': 11, 'stock:wool': 0, [charge]: 0});
    const lambFaded = restore(windows(lampLit, 39, 0));
    assert.equal(lambFaded.engine.world.holders[pen.id].quantities[light], 8);
    assert.equal(windows(lambFaded, 41, 0).engine.world.holders[pen.id].quantities[light], 0);
});

test('a real Pepperup serving makes a nearby mist coat express until the sheep leaves the humid air', () => {
    const {id, child, lifecycle} = trialBirth({genome: MIST_LANTERN_GENOME});
    const brew = pepperupCase();
    const serving = brew.timeline.find(step => step.id === 'serve').working;
    const {flask, recipient} = serving.bindings;
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const active = brewDoseQuantity('pepperup-extract');
    const animal = {kind: 'body', id};
    const config = life => ({
        ...brew.engine, packs: [...brew.engine.packs, LANTERN_COAT_PACK.id],
        ownPacks: [BREW_BODY_STEAM, LANTERN_COAT_PACK],
        host: {...brew.engine.host, laws: [BREW_DOSE_LAW, LANTERN_FLEECE_LAW, LANTERN_EVOLUTION.law],
            ports: {readThing: lanternBodyReader(life, registry)}},
    });
    const start = createEngineWorld({...config(lifecycle), holders: [
        ...brew.world.holders.map(holder => holder.id === 'bench'
            ? {...holder, id: pen.id, quantities: {humidity: 40, daylight: 0, [light]: 0}}
            : {...holder, ...(holder.place === 'bench' ? {place: pen.id} : {}),
                ...(holder.id === 'hall' ? {quantities: {humidity: 0, [light]: 0}} : {})}),
        {...animal, place: pen.id, refs: {creature: id},
            properties: {...lanternCoatProperties(child, {mist: true}), form: 'lantern-fleece'},
            quantities: {[charge]: 2}},
        {id: 'mist-wool', kind: 'thing', place: pen.id,
            quantities: {'stock:fine-wool': 0, 'stock:wool': 0, [charge]: 0}},
        {id: 'mist-lamp', kind: 'thing', place: pen.id, properties: {'lantern-wool-lamp': true}},
        {id: 'mist-altar', kind: 'thing', place: pen.id,
            quantities: {'stock:sun-prism': 1, 'stock:lantern-husk': 0, [charge]: 0}},
    ]});
    const restore = (engine, life = lifecycle) =>
        restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config(roundTrip(life)));
    const advance = (engine, clock) => advanceEngineWorld(engine, clock).engine;
    const serve = (engine, method = serving.method) => startEngineWorking(engine, {
        law: BREW_DOSE_LAW, method, id: 'serve-pepperup', bindings: {flask, recipient},
    });
    const glow = (engine, working) => startEngineWorking(engine, {
        law: LANTERN_FLEECE_LAW, method: LANTERN_FLASH, id: working, bindings: {animal},
    });
    const served = advance(restore(serve(start)), 2);
    assert.equal(served.world.holders[flask.id].quantities[active], 0);
    assert.equal(served.world.holders[recipient.id].quantities[active], 6);
    const before = advance(restore(served), 20);
    const refused = advance(restore(glow(before, 'early-glow')), 21);
    assert.equal(refused.world.holders[pen.id].quantities.humidity, 59);
    assert.equal(refused.records.workings['early-glow'].record.receipts[0].reason, 'no-expressed-lantern-coat');
    assert.equal(refused.world.holders[id].quantities[charge], 2);
    const pending = glow(refused, 'humid-glow');
    const lit = advance(restore(pending), 22);
    assert.equal(lit.world.holders[pen.id].quantities.humidity, 60);
    assert.equal(lit.world.holders[pen.id].quantities[light], 4);
    assert.equal(lit.world.holders[id].quantities[charge], 1);
    assert.deepEqual(serializeEngineWorld(lit), serializeEngineWorld(advance(pending, 22)));
    const openVent = (engine, amount) => applyEngineOps(engine, [
        {op: 'property', holder: pen.id, property: 'lantern-ventilation', value: amount},
    ], 'air-out-pen');
    const aired = openVent(lit, 2);
    const pendingAiredGlow = glow(aired, 'aired-glow');
    const airedGlow = advance(restore(pendingAiredGlow), 23);
    assert.deepEqual(serializeEngineWorld(airedGlow), serializeEngineWorld(advance(pendingAiredGlow, 23)));
    assert.equal(airedGlow.world.holders[pen.id].quantities.humidity, 59);
    assert.equal(airedGlow.records.workings['aired-glow'].record.receipts[0].reason, 'no-expressed-lantern-coat');
    assert.equal(airedGlow.world.holders[id].quantities[charge], 1);
    assert.equal(airedGlow.world.holders[pen.id].quantities[light], 4);
    assert.equal(advance(restore(airedGlow), 24).world.holders[pen.id].quantities[light], 0);

    const wool = {kind: 'thing', id: 'mist-wool'};
    const pendingClip = startEngineWorking(before, {law: LANTERN_FLEECE_LAW, method: LANTERN_CLIP,
        id: 'mist-clip', bindings: {animal, wool}});
    const clipped = advance(restore(pendingClip), 21);
    assert.equal(clipped.world.holders[wool.id].quantities['stock:fine-wool'], 5);
    const wetClip = startEngineWorking(refused, {law: LANTERN_FLEECE_LAW, method: LANTERN_CLIP,
        id: 'mist-clip', bindings: {animal, wool}});
    const harvested = advance(restore(wetClip), 22);
    assert.equal(harvested.world.holders[wool.id].quantities['stock:fine-wool'], 7);
    assert.equal(harvested.world.holders[wool.id].quantities[charge], 2);
    assert.equal(harvested.world.holders[id].quantities[charge], 0);
    const dried = advance(restore(openVent(harvested, 2)), 23);
    assert.equal(dried.world.holders[pen.id].quantities.humidity, 59);
    const pendingLamp = startEngineWorking(dried, {law: LANTERN_FLEECE_LAW, method: LANTERN_WOOL_LAMP,
        id: 'mist-wool-lamp', bindings: {wool, lamp: {kind: 'thing', id: 'mist-lamp'}, site: {kind: 'place', id: pen.id}}});
    const lamp = advance(restore(pendingLamp), 24);
    assert.equal(lamp.world.holders[wool.id].quantities[charge], 0);
    assert.equal(lamp.world.holders[wool.id].quantities['stock:fine-wool'], 7);
    assert.equal(lamp.world.holders[pen.id].quantities[light], 8);
    assert.equal(advance(restore(lamp), 27).world.holders[pen.id].quantities[light], 0);
    const balanced = advance(restore(openVent(lit, 1)), 181);
    assert.equal(balanced.world.holders[pen.id].quantities.humidity, 60);
    assert.equal(balanced.world.holders[pen.id].quantities[light], 0);
    const steamEnded = advance(restore(balanced), 182);
    assert.equal(steamEnded.world.holders[pen.id].quantities.humidity, 60);
    const afterSteam = advance(restore(glow(steamEnded, 'after-steam')), 183);
    assert.equal(afterSteam.world.holders[pen.id].quantities.humidity, 59);
    assert.equal(afterSteam.records.workings['after-steam'].record.receipts[0].reason, 'no-expressed-lantern-coat');
    assert.equal(afterSteam.world.holders[id].quantities[charge], 1);

    const lowerDose = pepperupCase({amount: 2}).timeline.find(step => step.id === 'serve').working.method;
    const control = advance(restore(serve(start, lowerDose)), 21);
    const low = advance(glow(control, 'low-dose-glow'), 22);
    assert.equal(low.world.holders[pen.id].quantities.humidity, 40);
    assert.equal(low.world.holders[flask.id].quantities[active], 4);
    assert.equal(low.records.workings['low-dose-glow'].record.receipts[0].reason, 'no-expressed-lantern-coat');

    const inSun = applyEngineOps(served, [
        {op: 'set', holder: pen.id, quantity: 'daylight', amount: 1},
        {op: 'set', holder: id, quantity: charge, amount: 0},
    ], 'mist-coat-in-sun');
    const threshold = advance(restore(inSun), 22);
    assert.equal(threshold.world.holders[pen.id].quantities.humidity, 60);
    assert.equal(threshold.world.holders[id].quantities[charge], 0);
    const firstCharge = advance(restore(threshold), 23);
    assert.equal(firstCharge.world.holders[id].quantities[charge], 1);
    const stocked = advance(restore(firstCharge), 26);
    assert.equal(stocked.world.holders[id].quantities[charge], 4);
    assert.deepEqual(stocked.world.holders[id], advance(inSun, 26).world.holders[id]);
    const drying = openVent(firstCharge, 2);
    const driedCharge = advance(restore(drying), 28);
    assert.equal(driedCharge.world.holders[pen.id].quantities.humidity, 56);
    assert.equal(driedCharge.world.holders[id].quantities[charge], 3);
    const rechargeRefused = advance(glow(restore(driedCharge), 'dry-after-charge'), 29);
    assert.equal(rechargeRefused.records.workings['dry-after-charge'].record.receipts[0].reason, 'no-expressed-lantern-coat');
    assert.equal(rechargeRefused.world.holders[id].quantities[charge], 3);
    const darkened = applyEngineOps(stocked, [{op: 'set', holder: pen.id, quantity: 'daylight', amount: 0}], 'mist-dusk');
    const chargedFlash = advance(restore(glow(darkened, 'from-mist-recharge')), 27);
    assert.equal(chargedFlash.world.holders[pen.id].quantities[light], 4);
    assert.equal(chargedFlash.world.holders[id].quantities[charge], 3);

    const pendingMolt = startEngineWorking(stocked, {law: LANTERN_EVOLUTION.law, method: LANTERN_EVOLUTION.methods['sun-molt'],
        id: 'mist-molt', bindings: {animal, site: {kind: 'place', id: pen.id}, altar: {kind: 'thing', id: 'mist-altar'}}});
    const dryingMolt = openVent(pendingMolt, 6);
    const refusedMolt = advance(restore(dryingMolt), 27);
    assert.equal(refusedMolt.world.holders[pen.id].quantities.humidity, 59);
    assert.equal(refusedMolt.records.workings['mist-molt'].record.receipts[0].reason, 'evolution-condition-changed');
    assert.deepEqual(refusedMolt.world.holders['mist-altar'].quantities, {'stock:sun-prism': 1, 'stock:lantern-husk': 0, [charge]: 0});
    assert.equal(refusedMolt.world.holders[id].quantities[charge], 4);
    assert.equal(creatureForm(refusedMolt.world.holders[id], 27), 'lantern-fleece');
    const molted = advance(restore(pendingMolt), 27);
    assert.deepEqual(serializeEngineWorld(molted), serializeEngineWorld(advance(pendingMolt, 27)));
    assert.equal(creatureForm(molted.world.holders[id], 27), 'beacon-fleece');
    assert.equal(molted.world.holders[id].refs.creature, id);
    assert.deepEqual(molted.world.holders['mist-altar'].quantities, {'stock:sun-prism': 0, 'stock:lantern-husk': 1, [charge]: 0});
    const beacon = advance(glow(restore(molted), 'mist-beacon-glow'), 28);
    assert.equal(beacon.world.holders[pen.id].quantities[light], 8);
    const chargedHusk = applyEngineOps(beacon, [
        {op: 'add', holder: id, quantity: charge, amount: -1},
        {op: 'add', holder: 'mist-altar', quantity: charge, amount: 1},
    ], 'charge-mist-husk');
    const awakened = awakenLanternHusk(restore(chargedHusk), {parent: id, huskHolder: 'mist-altar', offspring: 'mist-wisp'});
    assert.equal(awakened.ok, true);
    const afterAwakening = restore(awakened.engine);
    assert.deepEqual(readLineage(afterAwakening.world, 'mist-wisp')[0].parents, [id]);
    assert.equal(afterAwakening.world.holders['mist-wisp'].quantities[charge], 1);

    const hall = {...pen, id: 'hall'};
    const moved = transferCreature(lifecycle, {revision: lifecycle.revision, id, clock: 22,
        fromKeeper: 'player', toKeeper: 'player', destination: hall});
    const crossing = applyEngineOps(lit, [{op: 'move', holder: id, to: hall.id}], 'mist-sheep-leaves-pen');
    const outside = advance(glow(restore(crossing, moved), 'outside-glow'), 23);
    assert.equal(outside.records.workings['outside-glow'].record.receipts[0].reason, 'no-expressed-lantern-coat');
    assert.equal(outside.world.holders[id].quantities[charge], 1);
    assert.equal(outside.world.holders[hall.id].quantities[light], 0);
    assert.equal(outside.world.holders[pen.id].quantities[light], 4);
    assert.deepEqual(moved.individuals[id].genes, child.genes);
});

test('a physical assay reveals a carrier and a paid clasp changes its offspring’s clip after reload', () => {
    const genome = trialGenome, keeper = 'player', bench = 'bench';
    const reagent = 'stock:fleece-assay-reagent', clasp = 'stock:breeding-clasp';
    const empty = restoreCreatureLifecycle();
    const stock = settleCohortStock(empty, {revision: empty.revision, id: 'trial', species: 'sheep', habitat: pen, delta: 2});
    const acquire = (state, fleece, coat, ivs) => acquireCreature(state, {revision: state.revision, cohortId: 'trial',
        destination: pen, keeper, genome, genes: genes(fleece, coat, ['w', 'w'], ['v', 'v']), phased: true, ivs: statValues(ivs)});
    const first = acquire(stock, ['F', 'f'], ['D', 'd'], 31);
    const second = acquire(first.state, ['F', 'F'], ['d', 'd'], 30);
    const config = {packs: ['w.sky', 'l.living_body'], shared: {quantities: [WORLD_QUANTITIES.stock],
        properties: [{id: 'breeding-bench', type: 'flag'}, {id: 'custodian', type: 'label'}]}};
    const engine = createEngineWorld({...config, holders: [{id: pen.id, kind: 'place'},
        {id: bench, kind: 'thing', place: pen.id, properties: {'breeding-bench': true, custodian: keeper},
            quantities: {[reagent]: 1, [clasp]: 1}}]});
    const reload = ({engine, lifecycle}) => ({
        engine: restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config),
        lifecycle: roundTrip(lifecycle),
    });
    const start = {engine, lifecycle: second.state};
    const view = state => readLivingBody({lifecycle: state.lifecycle, registry, id: first.id, clock: 0}).genotype.fleece;
    assert.deepEqual(view(start).alleles, ['f', '?']);
    const assay = (state, id = first.id) => testMeadowFleece(state, {bench, id, keeper, genome});
    assert.equal(assay(start, second.id).reason, 'fleece-already-known');
    const foreign = {...start, engine: applyEngineOps(engine, [
        {op: 'property', holder: bench, property: 'custodian', value: 'other-keeper'},
    ], 'bench-custody')};
    assert.equal(assay(foreign).reason, 'fleece-assay-unavailable');
    assert.deepEqual(view(foreign).alleles, ['f', '?']);
    assert.equal(foreign.engine.world.holders[bench].quantities[reagent], 1);
    const tested = reload(assay(start));
    assert.deepEqual(view(tested).alleles, ['F', 'f']);
    assert.equal(tested.engine.world.holders[bench].quantities[reagent], 0);
    assert.equal(assay(tested).engine, tested.engine);
    assert.deepEqual(tested.lifecycle.individuals[first.id].genes, start.lifecycle.individuals[first.id].genes);

    const parents = [first.id, second.id];
    const options = {bench, parents, keeper, genome, root: 'meadow-trial-2', gestationMinutes: 2, growthMinutes: 3, parent: 0};
    assert.equal(startMeadowClaspBrood(foreign, options).engine, foreign.engine);
    assert.deepEqual(foreign.lifecycle.broods, {});
    const aided = startMeadowClaspBrood(tested, options);
    assert.equal(aided.ok, true);
    const pending = reload(aided);
    assert.equal(pending.engine.world.holders[bench].quantities[clasp], 0);
    assert.equal(startMeadowClaspBrood(pending, options).engine, pending.engine);
    const restocked = {...pending, engine: applyEngineOps(pending.engine, [
        {op: 'add', holder: bench, quantity: clasp, amount: 1},
    ], 'restock-clasp')};
    assert.throws(() => startMeadowClaspBrood(restocked, options), /pending brood/);
    assert.equal(restocked.engine.world.holders[bench].quantities[clasp], 1);
    const born = settleCreatureBirth(pending.lifecycle, {revision: pending.lifecycle.revision, broodId: aided.broodId, clock: 2, destination: pen});
    const child = roundTrip(born.state).individuals[born.id];
    assert.equal(child.ivs.woolYield, 31);
    assert.deepEqual(child.genes, trialBirth().child.genes);
    assert.deepEqual(harvest({id: born.id, child}, genome), {'stock:fine-wool': 8});
    assert.deepEqual(harvest(trialBirth(), genome), {'stock:fine-wool': 7});

    const growth = JUVENILE_GROWTH.id;
    const bound = {...tested, engine: applyEngineOps(tested.engine, [
        {op: 'holder_add', value: {id: first.id, kind: 'body', place: pen.id, refs: {creature: first.id},
            tags: ['living.body'], quantities: {satiety: 1, [growth]: 2},
            state: {'l.living_body': livingBodyState({species: 'sheep', rate: 1})}}},
        {op: 'holder_add', value: {id: second.id, kind: 'body', place: pen.id, refs: {creature: second.id}}},
    ], 'materialize-breeding-pair')};
    const after = (pair, minute) => ({...pair, engine: advanceEngineWorld(pair.engine, minute).engine});
    const hungry = reload(after(bound, 2));
    const refused = startMeadowClaspBrood(hungry, options);
    assert.deepEqual(refused, {ok: false, reason: 'breeding-parent-still-growing', ...hungry});
    assert.equal(hungry.engine.world.holders[first.id].quantities[growth], 1);
    assert.equal(hungry.engine.world.holders[bench].quantities[clasp], 1);
    const fed = {...hungry, engine: applyEngineOps(hungry.engine, [
        {op: 'add', holder: first.id, quantity: 'satiety', amount: 1},
    ], 'meadow-ration')};
    const mature = reload(after(fed, 3));
    const paired = startMeadowClaspBrood(mature, options);
    assert.equal(paired.ok, true);
    assert.equal(paired.engine.world.holders[bench].quantities[clasp], 0);
    const savedPair = reload(paired);
    const later = settleCreatureBirth(savedPair.lifecycle, {revision: savedPair.lifecycle.revision,
        broodId: paired.broodId, clock: 5, destination: pen});
    assert.deepEqual(harvest({id: later.id, child: later.state.individuals[later.id]}, genome, 8), {'stock:fine-wool': 8});
});

function trialBirth({genome = trialGenome, repulsion = false, phased = true, root = 'meadow-trial-2', ivInheritance,
    firstCoat = ['D', 'd'], firstVigor = ['v', 'v'], developmentConditions} = {}) {
    const empty = restoreCreatureLifecycle();
    const stock = settleCohortStock(empty, {revision: empty.revision, id: 'trial', species: 'sheep', habitat: pen, delta: 2});
    const acquire = (state, parentGenes, ivs) => acquireCreature(state, {revision: state.revision, cohortId: 'trial',
        destination: pen, keeper: 'player', genome, genes: parentGenes, ...(phased ? {phased: true} : {}), ...(genome.ivs ? {ivs} : {})});
    const first = acquire(stock, genes(repulsion ? ['f', 'F'] : ['F', 'f'], firstCoat, ['w', 'w'], firstVigor), statValues(31));
    const second = acquire(first.state, genes(['F', 'F'], ['d', 'd'], ['w', 'w'], ['v', 'v']), statValues(30));
    const brood = startCreatureBrood(roundTrip(second.state), {revision: second.state.revision, parents: [first.id, second.id],
        keeper: 'player', clock: 0, gestationMinutes: 2, growthMinutes: 3, genome, root, ivInheritance, developmentConditions});
    if (genome.ivs) {
        const broken = structuredClone(brood.state);
        broken.broods[brood.id].ivs.woolYield = -1;
        assert.throws(() => roundTrip(broken), /Invalid creature brood/);
    }
    const birth = state => settleCreatureBirth(state, {revision: state.revision, broodId: brood.id, clock: 2, destination: pen});
    const born = birth(roundTrip(brood.state));
    assert.deepEqual(born, birth(brood.state));
    const child = roundTrip(born.state).individuals[born.id];
    assert.deepEqual(child.parents, [first.id, second.id]);
    if (!genome.ivs) assert.equal(Object.hasOwn(child, 'ivs'), false);
    return {id: born.id, child, lifecycle: born.state};
}

test('a measured Draught interrupts the trained sheep’s pending signal until its body recovers', () => {
    const {id, child, lifecycle} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const trained = practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor: 'player',
        clock: 5, skill: 'lantern-signal', bondGain: 1, minimumGap: 1});
    const body = readLivingBody({lifecycle: roundTrip(trained), registry, id, clock: 5});
    const {engine: brewConfig, world: setup, timeline} = draughtCase(DRAUGHT_CASE_ID);
    const {sentence, details, keys} = timeline[0];
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const config = {...brewConfig, packs: ['w.sky', ...brewConfig.packs],
        shared: {quantities: [...brewConfig.shared.quantities, WORLD_QUANTITIES.light]},
        host: {laws: [LANTERN_FLEECE_LAW], things: {[`body:${id}`]: {
            keeper: body.keeper, learned: body.learned, genes: child.genes, matureAt: child.matureAt,
        }}}};
    const holders = setup.holders.map(holder => {
        if (holder.kind === 'place') return {...holder, quantities: {[light]: 0}};
        if (holder.kind === 'body') return {...holder, id, quantities: {...holder.quantities, [charge]: 1},
            state: {'l.living_body': {...holder.state['l.living_body'], species: 'sheep'}}};
        return holder;
    });
    const initial = createEngineWorld({...config, clock: 5, holders});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const signal = (engine, working) => startEngineWorking(engine, {law: LANTERN_FLEECE_LAW,
        method: LANTERN_SIGNAL, id: working, bindings: {animal: {kind: 'body', id}}});
    const pending = signal(initial, 'signal');
    const dose = landEffect(initial.rules, pending.world, {sentence, details: {...details, to: id}},
        {keys, cause: 'draught-delivery'});
    assert.equal(dose.status, 'landed');
    assert.equal(dose.world.holders[id].quantities.responsiveness, 2);
    assert.deepEqual(dose.world.holders.flask.quantities, {'energy:oral-liquid': 8, 'energy:settled-soporific': 1});
    const dosed = {...pending, world: dose.world};
    const stopped = advance(restore(dosed), 6);
    assert.deepEqual(serializeEngineWorld(stopped), serializeEngineWorld(advance(dosed, 6)));
    assert.equal(stopped.records.workings.signal.record.receipts[0].reason, 'lantern-body-too-drowsy');
    assert.equal(stopped.world.holders[id].quantities[charge], 1);
    assert.equal(stopped.world.holders.infirmary.quantities[light], 0);
    assert.equal(advance(pending, 6).world.holders.infirmary.quantities[light], 4);
    const recovering = advance(restore(stopped), 11);
    assert.equal(recovering.world.holders[id].quantities.responsiveness, 44);
    const recovered = advance(restore(signal(recovering, 'retry')), 12);
    assert.equal(recovered.world.holders[id].quantities.responsiveness, 51);
    assert.equal(recovered.world.holders[id].quantities[charge], 0);
    assert.equal(recovered.world.holders.infirmary.quantities[light], 4);
    assert.deepEqual(recovered.world.holders.flask.quantities, dose.world.holders.flask.quantities);
});

test('practice unlocks a learned signal on the same inherited coat and survives reload', () => {
    const {id, child, lifecycle} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const trained = practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor: 'player',
        clock: 5, skill: 'lantern-signal', bondGain: 1, minimumGap: 1});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const injured = injureCreature(trained, {revision: trained.revision, id, clock: 5, kind: 'coat-burn', recoveryMinutes: 2});
    const tended = startCreatureCare(injured, {revision: injured.revision, id, clock: 5, keeper: 'player', duration: 2});
    for (const [life, clock, expected, reason] of [
        [lifecycle, 5, 0, 'lantern-signal-unpracticed'], [trained, 5, 4, undefined],
        [injured, 7, 0, 'lantern-coat-needs-care'], [tended, 6, 0, 'lantern-coat-needs-care'], [tended, 7, 4, undefined],
    ]) {
        const body = readLivingBody({lifecycle: roundTrip(life), registry, id, clock});
        const config = {packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.energy, WORLD_QUANTITIES.light]},
            host: {laws: [LANTERN_FLEECE_LAW], things: {[`body:${id}`]: {
                keeper: body.keeper, learned: body.learned, injury: body.injury, genes: child.genes, matureAt: child.matureAt,
            }}}};
        const start = createEngineWorld({...config, clock, holders: [
            {id: 'pen', kind: 'place', quantities: {[light]: 0}},
            {id, kind: 'body', place: 'pen', quantities: {[charge]: 1}},
        ]});
        const pending = startEngineWorking(start, {law: LANTERN_FLEECE_LAW, method: LANTERN_SIGNAL, id: 'signal',
            bindings: {animal: {kind: 'body', id}}});
        const reloaded = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pending))), config);
        const result = advanceEngineWorld(reloaded, clock + 1).engine;
        assert.equal(result.world.holders.pen.quantities[light], expected);
        assert.equal(result.world.holders[id].quantities[charge], expected ? 0 : 1);
        assert.equal(result.records.workings.signal.record.receipts[0].reason, reason);
        assert.equal(advanceEngineWorld(result, clock + 2).engine.world.holders.pen.quantities[light], 0);
    }
});

test('a trained signal needs both inherited coat expression and keeper practice', () => {
    const genome = LANTERN_FLEECE_GENOME;
    const carrier = trialBirth({genome}), plain = trialBirth({genome, firstCoat: ['d', 'd']});
    assert.deepEqual(plain.child.genes, {...carrier.child.genes, coat: ['d', 'd']});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    for (const {id, child, lifecycle} of [carrier, plain]) {
        const trained = practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor: 'player',
            clock: 5, skill: 'lantern-signal', bondGain: 1, minimumGap: 1});
        for (const [life, practiced] of [[lifecycle, false], [trained, true]]) {
            const config = saved => ({packs: [LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
                host: {laws: [LANTERN_FLEECE_LAW], ports: {readThing: lanternBodyReader(saved, registry)}}});
            const engine = createEngineWorld({...config(life), clock: 5, holders: [
                {id: pen.id, kind: 'place', quantities: {[light]: 0}},
                {id, kind: 'body', place: pen.id, refs: {creature: id},
                    properties: lanternCoatProperties(child), quantities: {[charge]: 1}},
            ]});
            const pending = cueLanternSignal(engine, {id: 'coat-cue', animal: id, keeper: 'player'});
            const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pending))), config(roundTrip(life)));
            const result = advanceEngineWorld(restored, 6).engine;
            const succeeds = practiced && child.genes.coat.includes('D');
            const expectedReason = !practiced ? 'lantern-signal-unpracticed' :
                succeeds ? undefined : 'no-expressed-lantern-coat';
            assert.equal(result.records.workings['coat-cue'].record.receipts[0].reason, expectedReason);
            assert.equal(result.world.holders[pen.id].quantities[light], succeeds ? 4 : 0);
            assert.equal(result.world.holders[id].quantities[charge], succeeds ? 0 : 1);
            assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advanceEngineWorld(pending, 6).engine));
        }
    }
});

test('a pending Lantern signal reads current wounds and care at its saved deadline', () => {
    const {id, lifecycle} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const trained = practiceWithCreature(lifecycle, {revision: lifecycle.revision, id, actor: 'player',
        clock: 5, skill: 'lantern-signal', bondGain: 1, minimumGap: 1});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const config = life => ({packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.energy, WORLD_QUANTITIES.light]},
        host: {laws: [LANTERN_FLEECE_LAW], ports: {readThing: lanternBodyReader(life, registry)}}});
    const engine = createEngineWorld({...config(trained), clock: 5, holders: [
        {id: pen.id, kind: 'place', quantities: {[light]: 0}},
        {id, kind: 'body', place: pen.id, refs: {creature: id}, quantities: {[charge]: 1}},
    ]});
    const method = {...LANTERN_SIGNAL, steps: [{...LANTERN_SIGNAL.steps[0], minutes: 2}, LANTERN_SIGNAL.steps[1]]};
    const pending = startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method, id: 'signal',
        bindings: {animal: {kind: 'body', id}}});
    const waiting = advanceEngineWorld(pending, 6).engine;
    assert.deepEqual(waiting.records.workings.signal.record.receipts, []);
    const wound = injureCreature(trained, {revision: trained.revision, id, clock: 6, kind: 'coat-burn', recoveryMinutes: 1});
    const care = startCreatureCare(wound, {revision: wound.revision, id, clock: 6, keeper: 'player', duration: 1});
    for (const [life, expected] of [[trained, 4], [wound, 0], [care, 4]]) {
        const loaded = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(waiting))), config(roundTrip(life)));
        const done = advanceEngineWorld(loaded, 7).engine;
        assert.equal(done.world.holders.pen.quantities[light], expected);
        assert.equal(done.world.holders[id].quantities[charge], expected ? 0 : 1);
        assert.equal(done.records.workings.signal.record.receipts[0].reason, expected ? undefined : 'lantern-coat-needs-care');
    }
});

test('a saved Lantern cue follows its issuing keeper across a custody change', () => {
    const {id, lifecycle} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const transfer = (life, fromKeeper, toKeeper) => transferCreature(life, {revision: life.revision,
        id, fromKeeper, toKeeper, destination: pen, clock: 5});
    const train = (life, actor) => practiceWithCreature(life, {revision: life.revision, id, actor,
        clock: 5, skill: 'lantern-signal', bondGain: 1, minimumGap: 1});
    const former = transfer(train(transfer(lifecycle, 'player', 'neighbor'), 'neighbor'), 'neighbor', 'player');
    let live = train(former, 'player');
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const config = {packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.energy, WORLD_QUANTITIES.light]},
        host: {laws: [LANTERN_FLEECE_LAW], ports: {readThing: lanternBodyReader(() => live, registry)}}};
    const engine = createEngineWorld({...config, clock: 5, holders: [
        {id: pen.id, kind: 'place', quantities: {[light]: 0}},
        {id, kind: 'body', place: pen.id, refs: {creature: id}, quantities: {[charge]: 1}},
    ]});
    const restore = world => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(world))), config);
    const cue = (engine, working, keeper) => cueLanternSignal(engine, {id: working, animal: id, keeper});
    const pending = cue(engine, 'former-cue', 'player');
    assert.equal(advanceEngineWorld(restore(pending), 6).engine.world.holders.pen.quantities[light], 4);
    live = roundTrip(transfer(live, 'player', 'neighbor'));
    const refused = advanceEngineWorld(restore(pending), 6).engine;
    assert.equal(refused.records.workings['former-cue'].record.receipts[0].reason, 'lantern-signal-keeper-changed');
    assert.equal(refused.world.holders[id].quantities[charge], 1);
    assert.equal(refused.world.holders.pen.quantities[light], 0);
    const queued = cue(refused, 'current-cue', 'neighbor');
    const answered = advanceEngineWorld(restore(queued), 7).engine;
    assert.deepEqual(serializeEngineWorld(answered), serializeEngineWorld(advanceEngineWorld(queued, 7).engine));
    assert.equal(answered.world.holders[id].quantities[charge], 0);
    assert.equal(answered.world.holders.pen.quantities[light], 4);
});

test('an inherited lantern coat changes both shearing stock and a paid light working', () => {
    const genome = LANTERN_FLEECE_GENOME;
    const lantern = trialBirth({genome});
    const ordinary = trialBirth({genome, firstCoat: ['d', 'd']});
    const {coat, ...rest} = lantern.child.genes;
    const {coat: ordinaryCoat, ...ordinaryRest} = ordinary.child.genes;
    assert.deepEqual(coat, ['D', 'd']);
    assert.deepEqual(ordinaryCoat, ['d', 'd']);
    assert.deepEqual(rest, ordinaryRest);
    assert.deepEqual(harvest(lantern, genome), {'stock:fine-wool': 7});
    assert.deepEqual(harvest(ordinary, genome), {'stock:fine-wool': 5});

    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const flash = ({id, child}, reserve) => {
        const config = {packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.energy, WORLD_QUANTITIES.light]},
            host: {laws: [LANTERN_FLEECE_LAW], things: {[`body:${id}`]: {genes: child.genes, matureAt: child.matureAt}}}};
        const engine = createEngineWorld({...config, clock: 5, holders: [
            {id: 'pen', kind: 'place', quantities: {[light]: 0}},
            {id, kind: 'body', place: 'pen', quantities: {[charge]: reserve}},
        ]});
        const pending = startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method: LANTERN_FLASH, id: 'flash',
            bindings: {animal: {kind: 'body', id}}});
        const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pending))), config);
        const done = advanceEngineWorld(restored, 6).engine;
        assert.deepEqual(serializeEngineWorld(done), serializeEngineWorld(advanceEngineWorld(pending, 6).engine));
        const reloadedGlow = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(done))), config);
        const late = advanceEngineWorld(reloadedGlow, 8).engine;
        assert.equal(late.world.holders.pen.quantities[light], 0);
        return [done.world.holders.pen.quantities[light], done.world.holders[id].quantities[charge],
            done.records.workings.flash.record.receipts[0].reason];
    };
    assert.deepEqual(flash(lantern, 1), [4, 0, undefined]);
    assert.deepEqual(flash(ordinary, 1), [0, 1, 'no-expressed-lantern-coat']);
    assert.deepEqual(flash(lantern, 0), [0, 0, 'lantern-charge-empty']);
});

test('daylight charges the coat, shearing moves its charge, and regrowth restores the same animal’s flash', () => {
    const {id, child} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const config = {packs: ['w.sky', 'c.contest', 'l.forage_attraction', LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
        shared: gearWardShared,
        settings: {'w.sky': {dawn: 490, dusk: 510},
            'l.forage_attraction': {profiles: [{light, minimum: 8, interval: 2}], maxNeighbors: 1}},
        host: {laws: [LANTERN_FLEECE_LAW], things: {
            [`body:${id}`]: {genes: child.genes, matureAt: child.matureAt},
        }}};
    const clipHolder = id => ({id, kind: 'thing', place: 'pen',
        quantities: {'stock:fine-wool': 0, 'stock:wool': 0, [charge]: 0}});
    const start = createEngineWorld({...config, clock: 5, links: [
        {id: 'meadow-path', kind: 'path', from: 'bank', to: 'pen', oneWay: true, state: 'open'},
        {id: 'shelter-path', kind: 'path', from: 'pen', to: 'shelter', cost: 1, state: 'open'},
    ], holders: [
        {id: 'pen', kind: 'place', tags: ['sky'], quantities: {daylight: 0, noise: 0, [light]: 0}},
        {id: 'bank', kind: 'place'},
        {id: 'shelter', kind: 'place', quantities: {daylight: 1, [light]: 0}, properties: {'lantern-shade': true}},
        {id: 'moth', kind: 'body', place: 'bank', properties: {alive: true, forage_light: light}},
        {id: 'lamp', kind: 'thing', place: 'pen', properties: {'lantern-wool-lamp': true}},
        {id, kind: 'body', place: 'pen', refs: {creature: id},
            properties: lanternCoatProperties(child), quantities: {[charge]: 0, vitality: 20}},
        clipHolder('wool'), clipHolder('second-wool'),
    ]});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, clock) => {
        const result = advanceEngineWorld(engine, clock);
        assert.equal(result.pending, false);
        return result.engine;
    };
    const quantity = (engine, holder, name = charge) => engine.world.holders[holder].quantities[name];
    const work = (engine, method, workingId, wool) => startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method, id: workingId,
        bindings: {animal: {kind: 'body', id}, ...(wool ? {wool: {kind: 'thing', id: wool}} : {})}});
    const beforeDawn = advance(start, 10);
    assert.equal(quantity(beforeDawn, id), 0);
    const charged = advance(restore(beforeDawn), 15);
    assert.equal(quantity(charged, id), 4);
    assert.deepEqual(serializeEngineWorld(charged), serializeEngineWorld(advance(start, 15)));

    const firstFlash = advance(work(advance(beforeDawn, 14), LANTERN_FLASH, 'before-clip'), 15);
    assert.equal(quantity(firstFlash, 'pen', light), 4);
    assert.equal(quantity(firstFlash, id), 3);
    const pendingClip = work(firstFlash, LANTERN_CLIP, 'clip', 'wool');
    const clipped = advance(restore(pendingClip), 16);
    assert.equal(quantity(clipped, 'wool', 'stock:fine-wool'), 7);
    assert.equal(quantity(clipped, id), 0);
    assert.equal(quantity(clipped, 'wool'), 4);
    assert.equal(quantity(clipped, id) + quantity(clipped, 'wool'), quantity(charged, id));

    const early = work(work(restore(clipped), LANTERN_FLASH, 'too-early'), LANTERN_CLIP, 'clip-again', 'second-wool');
    const recovering = advance(early, 18);
    assert.equal(quantity(recovering, id), 0);
    assert.equal(quantity(recovering, 'pen', light), 0);
    assert.equal(quantity(recovering, 'second-wool', 'stock:fine-wool'), 0);
    assert.equal(recovering.records.workings['too-early'].record.receipts[0].reason, 'lantern-coat-regrowing');
    assert.equal(recovering.records.workings['clip-again'].record.receipts[0].reason, 'lantern-coat-regrowing');
    assert.equal(advance(restore(recovering), 20).world.holders[id].quantities[charge], 0);
    const recharged = advance(restore(recovering), 21);
    assert.equal(quantity(recharged, id), 1);
    const dusk = advance(recharged, 30);
    const flashed = advance(restore(work(dusk, LANTERN_FLASH, 'after-regrowth')), 31);
    assert.equal(quantity(flashed, id), 3);
    assert.equal(quantity(flashed, 'wool'), 4);
    assert.equal(quantity(flashed, 'pen', light), 4);
    assert.equal(quantity(advance(restore(flashed), 33), 'pen', light), 0);

    const ignite = (engine, id, wool = 'wool') => startEngineWorking(engine, {law: LANTERN_FLEECE_LAW,
        method: LANTERN_WOOL_LAMP, id, bindings: {wool: {kind: 'thing', id: wool},
            lamp: {kind: 'thing', id: 'lamp'}, site: {kind: 'place', id: 'pen'}}});
    const unlit = advance(ignite(clipped, 'empty-wick', 'second-wool'), 19);
    assert.equal(unlit.records.workings['empty-wick'].record.receipts[0].reason, 'wool-lamp-needs-charged-wool');
    assert.equal(unlit.world.holders.moth.place, 'bank');
    const pending = ignite(clipped, 'ignite');
    assert.equal(extinguishLanternWoolLamp(pending, {working: 'ignite', lamp: 'lamp'}), pending);
    const crowded = applyEngineOps(pending, [{op: 'set', holder: 'pen', quantity: light, amount: 100}], 'other-light');
    const full = advance(restore(crowded), 17);
    assert.equal(full.records.workings.ignite.record.receipts[0].reason, 'wool-lamp-light-account-full');
    assert.equal(quantity(full, 'wool'), 4);
    const moved = applyEngineOps(pending, [{op: 'move', holder: 'wool', to: 'bank'}], 'take-wool');
    const refused = advance(restore(moved), 17);
    assert.equal(refused.records.workings.ignite.record.receipts[0].reason, 'wool-lamp-out-of-reach');
    assert.equal(quantity(refused, 'wool'), 4);
    const lit = advance(restore(pending), 17);
    assert.equal(quantity(lit, 'wool'), 2);
    assert.equal(quantity(lit, 'wool', 'stock:fine-wool'), 7);
    assert.equal(quantity(lit, 'pen', light), 8);
    assert.equal(lit.world.holders.moth.place, 'bank');
    const approached = advance(restore(lit), 18);
    assert.equal(approached.world.holders.moth.place, 'pen');
    const closedPath = applyEngineOps(lit, [{op: 'link_set', id: 'meadow-path', state: 'closed'}], 'close-path');
    assert.equal(advance(restore(closedPath), 20).world.holders.moth.place, 'bank');
    const faded = advance(restore(approached), 20);
    assert.equal(quantity(faded, 'pen', light), 0);
    assert.deepEqual(serializeEngineWorld(faded), serializeEngineWorld(advance(pending, 20)));
    const second = advance(ignite(faded, 'second-light'), 24);
    assert.equal(quantity(second, 'wool'), 0);
    const exhausted = advance(ignite(restore(second), 'exhausted'), 25);
    assert.equal(exhausted.records.workings.exhausted.record.receipts[0].reason, 'wool-lamp-needs-charged-wool');
    assert.equal(quantity(exhausted, 'wool', 'stock:fine-wool'), 7);

    const overlapping = advance(ignite(lit, 'overlapping'), 18);
    assert.equal(quantity(overlapping, 'pen', light), 16);
    const loaded = restore(overlapping);
    assert.equal(extinguishLanternWoolLamp(loaded, {working: 'ignite', lamp: 'spare'}), loaded);
    const stopped = extinguishLanternWoolLamp(loaded, {working: 'ignite', lamp: 'lamp'});
    assert.equal(quantity(stopped, 'pen', light), 8);
    assert.equal(quantity(stopped, 'wool'), 0);
    assert.equal(stopped.records.workings.ignite.record.status, 'interrupted');
    assert.equal(extinguishLanternWoolLamp(stopped, {working: 'ignite', lamp: 'lamp'}), stopped);
    const afterOldDeadline = advance(restore(stopped), 20);
    assert.equal(quantity(afterOldDeadline, 'pen', light), 8);
    const afterBoth = advance(restore(afterOldDeadline), 21);
    assert.equal(quantity(afterBoth, 'pen', light), 0);
    assert.deepEqual(serializeEngineWorld(afterBoth), serializeEngineWorld(advance(stopped, 21)));

    const daylightFlash = advance(work(advance(recharged, 26), LANTERN_FLASH, 'daylight-flash'), 27);
    const crossing = restore(ignite(daylightFlash, 'late-lamp'));
    const travel = engine => crossLanternPath(engine, {animal: id, link: 'shelter-path'});
    const shut = applyEngineOps(crossing, [{op: 'link_set', id: 'shelter-path', state: 'closed'}], 'shut-shelter');
    assert.deepEqual(travel(shut), {crossed: false, engine: shut});
    const {crossed, engine: shaded} = travel(crossing);
    assert.equal(crossed, true);
    assert.equal(shaded.world.clock, 28);
    assert.equal(shaded.world.holders[id].place, 'shelter');
    assert.deepEqual(shaded.world.holders[id].refs, {creature: id});
    assert.equal(quantity(shaded, 'pen', light), 8);
    assert.equal(shaded.records.workings['daylight-flash'].record.status, 'interrupted');
    assert.equal(quantity(advance(restore(shaded), 29), 'pen', light), 8);
    assert.equal(quantity(advance(restore(shaded), 31), 'pen', light), 0);
    const shelterFlash = work(shaded, LANTERN_FLASH, 'shelter-flash');
    const sheltered = advance(restore(shelterFlash), 32);
    assert.equal(quantity(sheltered, id), 3);
    assert.equal(quantity(sheltered, 'shelter', light), 0);
    const uncovered = applyEngineOps(sheltered, [
        {op: 'property', holder: 'shelter', property: 'lantern-shade', value: false},
    ], 'uncover-shelter');
    assert.equal(quantity(advance(restore(uncovered), 33), id), 4);

    const equipped = applyEngineOps(clipped, [
        {op: 'property', holder: 'wool', property: 'holder', value: id},
        {op: 'holder_add', value: {id: 'ward-collar', kind: 'thing', place: 'pen', properties: {holder: id}}},
    ], 'hold-clip-and-collar');
    const bind = engine => bindLanternWoolWard(engine, {id: 'wool-ward', bearer: id, carrier: 'ward-collar', wool: 'wool'});
    assert.equal(bind(applyEngineOps(equipped, [{op: 'move', holder: 'wool', to: 'bank'}], 'move-clip')).ok, false);
    const loadedWard = bind(restore(equipped));
    assert.equal(loadedWard.ok, true);
    assert.equal(quantity(loadedWard.engine, 'wool'), 0);
    assert.equal(quantity(loadedWard.engine, 'wool', 'stock:fine-wool'), 7);
    assert.equal(bind(loadedWard.engine).engine, loadedWard.engine);
    const worn = wearGearWard(loadedWard.engine, id, 'ward-collar');
    const fire = spellEffectMethod([{
        sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
        target: {id}, minutes: 1, details: {target: {shape: 'holder', id}, amount: 2},
    }]);
    const strike = (engine, type = 'fire') => {
        const started = beginWorking(fire.law, fire.method, {id: 'incoming-fire', at: engine.world.clock, bindings: fire.bindings});
        const {effects} = settleWorking(fire.law, started, {now: engine.world.clock + 1,
            ports: {read: ref => ({...engine.world.holders[ref.id], kind: ref.kind, holder: ref.id})}});
        const [{effect}] = effects;
        return settleLanternWardImpact(engine, {id: 'wool-ward', effect, type, phase: 'contact'});
    };
    assert.equal(strike(restore(loadedWard.engine)).damage, 2);
    const bypassed = strike(restore(worn), 'slashing');
    assert.equal(bypassed.damage, 2);
    assert.equal(bypassed.engine.records.stored['wool-ward'].charge.now, 4);
    const first = strike(restore(worn));
    assert.equal(first.damage, 0);
    assert.equal(first.engine.records.stored['wool-ward'].charge.now, 2);
    const removed = wearGearWard(first.engine, id);
    const offBody = strike(restore(removed));
    assert.equal(offBody.damage, 2);
    assert.equal(offBody.engine.records.stored['wool-ward'].charge.now, 2);
    const last = strike(restore(advance(first.engine, 17)));
    assert.equal(last.damage, 0);
    assert.equal(last.engine.records.stored['wool-ward'].charge.now, 0);
    const through = strike(restore(last.engine));
    assert.equal(through.damage, 2);
    assert.equal(quantity(through.engine, id, 'vitality'), 18);

    const spellName = 'Lantern fire test';
    const routedConfig = {...config, shared: {...config.shared,
        properties: [...config.shared.properties, WORLD_PROPERTIES.marks]}, host: {...config.host,
        laws: [...config.host.laws, SPELL_EFFECT_LAW], ports: {
            landImpact: lanternSpellWardPort({id: 'wool-ward', spell: spellName, type: 'fire'}),
        }}};
    const reloadWard = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), routedConfig);
    const battlefield = applyEngineOps(reloadWard(worn), [
        {op: 'holder_add', value: {id: 'caster', kind: 'body', place: 'bank'}},
        {op: 'holder_add', value: {id: 'wand', kind: 'thing', place: 'bank', properties: {marks: ['grip:caster']}}},
    ], 'prepare-spell');
    const shot = spellEffectMethod([{
        name: spellName, sentence: {verb: 'remove', object: 'vitality', target: 'creature', time: 'instant', carrier: 'wand'},
        target: {id}, minutes: 1, flightMinutes: 1, grip: {caster: 'caster', implement: 'wand'},
        contact: {links: 1, kinds: ['path']}, details: {amount: 2},
    }]);
    const launch = (engine, id) => advance(startEngineWorking(engine, {...shot, id}), engine.world.clock + 1);
    const airborne = launch(battlefield, 'shot-one');
    assert.deepEqual(airborne.records.workings['shot-one'].landed, []);
    const blockedPath = applyEngineOps(airborne, [{op: 'link_set', id: 'meadow-path', state: 'closed'}], 'close-during-flight');
    const miss = advance(reloadWard(blockedPath), 18);
    assert.match(miss.records.workings['shot-one'].landed[0].reason, /no clear path/);
    assert.equal(miss.records.stored['wool-ward'].charge.now, 4);
    const hit = advance(reloadWard(airborne), 18);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(airborne, 18)));
    assert.equal(quantity(hit, id, 'vitality'), 20);
    assert.equal(hit.records.stored['wool-ward'].charge.now, 2);
    assert.match(hit.records.workings['shot-one'].landed[0].reason, /ward caught/);
    const secondHit = advance(reloadWard(launch(hit, 'shot-two')), 20);
    assert.equal(secondHit.records.stored['wool-ward'].charge.now, 0);
    const thirdHit = advance(reloadWard(launch(secondHit, 'shot-three')), 22);
    assert.equal(quantity(thirdHit, id, 'vitality'), 18);
    assert.equal(thirdHit.records.workings['shot-three'].landed[0].status, 'landed');

    const response = {
        id: 'l.burst-cover', revision: 1, hears: ['effect.remove'], laws: [], reactors: [{
            id: 'cover-next', on: ['effect.remove'], appliesTo: holder => holder.id === 'z-companion',
            react(view, target, event) {
                if (event.detail?.target !== id || event.detail.object !== 'vitality') return [];
                assert.equal(event.detail.amount, -3, 'Only the damage left after the ward may reach the reactor.');
                return [{op: 'law_add', field: {id: 'burst-cover', scope: target, kind: 'block',
                    params: {verb: 'remove', object: 'vitality'}}}];
            },
        }],
    };
    const burstName = 'Lantern mixed burst';
    const burstConfig = {...routedConfig, packs: [...routedConfig.packs, response.id],
        ownPacks: [...routedConfig.ownPacks, response], host: {...routedConfig.host,
        things: {...routedConfig.host.things, [`area:${pen.id}`]: {}}, ports: {
        landImpact: lanternSpellWardPort({id: 'wool-ward', spell: burstName,
            packets: [{type: 'fire', phase: 'contact', amount: 2}, {type: 'slashing', phase: 'contact', amount: 3}]}),
    }}};
    const loadBurst = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), burstConfig);
    const burstWorld = restoreEngineWorld({...serializeEngineWorld(worn), packs: burstConfig.packs}, burstConfig);
    const scene = applyEngineOps(burstWorld, [
        {op: 'holder_add', value: {id: 'bystander', kind: 'body', place: pen.id, quantities: {vitality: 20}}},
        {op: 'holder_add', value: {id: 'sheltered', kind: 'body', place: pen.id, quantities: {vitality: 20}}},
        {op: 'law_add', field: {id: 'shelter', scope: 'sheltered', kind: 'block',
            params: {verb: 'remove', object: 'vitality'}}},
    ], 'prepare-burst');
    const burst = spellEffectMethod([{
        name: burstName, sentence: {verb: 'remove', object: 'vitality', target: 'area', time: 'instant', carrier: 'wand'},
        target: {id: pen.id}, minutes: 1, details: {target: {shape: 'present', place: pen.id}, amount: 5},
    }]);
    const spreading = startEngineWorking(scene, {...burst, id: 'burst'});
    const impacted = advance(loadBurst(spreading), 17);
    assert.equal(impacted.records.workings.burst.record.receipts[0].ok, true,
        impacted.records.workings.burst.record.receipts[0].reason);
    assert.deepEqual(serializeEngineWorld(impacted), serializeEngineWorld(advance(spreading, 17)));
    assert.equal(quantity(impacted, id, 'vitality'), 17);
    assert.equal(quantity(impacted, 'bystander', 'vitality'), 15);
    assert.equal(quantity(impacted, 'sheltered', 'vitality'), 20);
    assert.equal(impacted.records.stored['wool-ward'].charge.now, 2);
    assert.equal(impacted.records.workings.burst.landed[0].status, 'landed');
    const wardCovered = applyEngineOps(spreading, [{op: 'law_add', field: {id: 'cover-sheep',
        scope: id, kind: 'block', params: {verb: 'remove', object: 'vitality'}}}], 'cover-before-burst');
    const covered = advance(loadBurst(wardCovered), 17);
    assert.equal(quantity(covered, id, 'vitality'), 20);
    assert.equal(quantity(covered, 'bystander', 'vitality'), 15);
    assert.equal(covered.records.stored['wool-ward'].charge.now, 4);

    const reactiveScene = applyEngineOps(scene, [{op: 'holder_add', value: {
        id: 'z-companion', kind: 'body', place: pen.id, quantities: {vitality: 20},
    }}], 'add-companion');
    const pendingBurst = startEngineWorking(reactiveScene, {...burst, id: 'reactive-burst'});
    const reacted = advance(loadBurst(pendingBurst), 17);
    assert.deepEqual(serializeEngineWorld(reacted), serializeEngineWorld(advance(pendingBurst, 17)));
    assert.equal(quantity(reacted, id, 'vitality'), 17);
    assert.equal(quantity(reacted, 'z-companion', 'vitality'), 20);
    assert.equal(reacted.records.stored['wool-ward'].charge.now, 2);
    assert.ok(reacted.world.laws.some(field => field.id === 'burst-cover'));
    assert.deepEqual(reacted.world.chain.filter(row => row.kind === 'effect.remove' &&
        row.detail?.target === id && row.detail.object === 'vitality').map(row => row.detail.amount), [-3]);
});

test('growth and practiced friendship unlock the same Lantern sheep’s stronger flash', () => {
    const genome = LANTERN_FLEECE_GENOME, keeper = 'player';
    const stock = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'growth',
        species: 'sheep', habitat: pen, delta: 1});
    const {id, state: lifecycle} = acquireCreature(stock, {revision: stock.revision, cohortId: 'growth',
        destination: pen, keeper, growthMinutes: 8, genome, genes: genes(['F', 'F'], ['D', 'd'], ['w', 'w'], ['v', 'v'])});
    const child = lifecycle.individuals[id];
    const light = 'light:lantern-fleece', charge = 'energy:lantern-charge';
    const config = {packs: ['w.sky', LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {
            laws: [LANTERN_EVOLUTION.law, LANTERN_FLEECE_LAW], things: {[`body:${id}`]: {
                genes: child.genes, matureAt: child.matureAt,
            }},
        }};
    const engine = createEngineWorld({...config, clock: 5, holders: [
        {id: pen.id, kind: 'place', quantities: {[light]: 0}},
        {id: keeper, kind: 'body', place: pen.id},
        {id, kind: 'body', place: pen.id, refs: {creature: id}, quantities: {[charge]: 4},
            properties: {...lanternCoatProperties(child), form: 'lantern-fleece'}},
    ]});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const tick = (state, minute) => ({...state, engine: advanceEngineWorld(state.engine, minute).engine});
    const save = state => ({engine: reload(state.engine), lifecycle: roundTrip(state.lifecycle)});
    const practice = (state, working, skill) => practiceLanternSheep(state, {id, keeper, working, skill});
    const offer = (state, working) => offerLanternGrowth(state, {id, keeper, working});
    const first = practice({engine, lifecycle}, 'first-session', 'lantern-signal');
    const trained = practice(tick(save(first), 6), 'second-session', 'lantern-signal');
    const body = engine => engine.world.holders[id];
    assert.equal(trained.lifecycle.individuals[id].experience[keeper].bond, 6);
    assert.equal(body(trained.engine).properties.form, 'lantern-fleece');
    assert.equal(body(trained.engine).quantities[charge], 4);
    assert.equal(practice(tick(trained, 7), 'second-session', 'lantern-signal').lifecycle, trained.lifecycle);

    const mature = tick(save(trained), 8);
    const weak = offer(tick(save(first), 8), 'low-bond');
    assert.equal(weak.records.workings['low-bond'].record.receipts[0].reason, 'evolution-condition-changed');
    const untrained = practice(tick(practice({engine, lifecycle}, 'follow-first', 'follow'), 8), 'follow-second', 'follow');
    assert.equal(untrained.lifecycle.individuals[id].experience[keeper].bond, 6);
    assert.equal(untrained.engine.records.workings['follow-second'].record.receipts[0].reason, 'evolution-condition-changed');
    assert.equal(body(untrained.engine).quantities[charge], 4);
    const friendship = practice(tick(save(first), 8), 'friendship', 'lantern-signal');
    assert.equal(body(friendship.engine).properties.form, 'companion-fleece');
    const evolved = reload(offer(mature, 'mature'));
    assert.equal(body(evolved).properties.form, 'companion-fleece');
    assert.equal(body(evolved).quantities[charge], 3);
    assert.deepEqual(body(evolved).refs, {creature: id});
    assert.equal(offer({...mature, engine: evolved}, 'repeat'), evolved);
    const flash = engine => advanceEngineWorld(startEngineWorking(engine, {law: LANTERN_FLEECE_LAW,
        method: LANTERN_FLASH, id: 'flash', bindings: {animal: {kind: 'body', id}}}), 9).engine;
    assert.equal(flash(evolved).world.holders.pen.quantities[light], 8);
    assert.equal(flash(mature.engine).world.holders.pen.quantities[light], 4);
    const clock = (state, to) => advanceLanternSpeciesClock(state, to, {});
    const optedIn = {...save(trained), autoGrowth: true};
    const automatic = clock(optedIn, 12);
    assert.deepEqual(automatic.outcomes, [{working: `companion-growth:${id}:8`, at: 8, changed: true}]);
    assert.equal(body(automatic.engine).properties.form, 'companion-fleece');
    assert.equal(body(automatic.engine).quantities[charge], 3);
    const boundary = clock(optedIn, 8);
    const split = clock({...save(boundary), autoGrowth: boundary.autoGrowth}, 12);
    assert.deepEqual(serializeEngineWorld(split.engine), serializeEngineWorld(automatic.engine));
    assert.deepEqual(split.outcomes, []);
    assert.equal(body(clock(save(trained), 12).engine).properties.form, 'lantern-fleece');
    const empty = applyEngineOps(optedIn.engine, [{op: 'set', holder: id, quantity: charge, amount: 0}], 'empty-coat');
    const declined = clock({...optedIn, engine: empty}, 12);
    assert.equal(declined.outcomes[0].reason, 'evolution-stock-short');
    assert.equal(body(declined.engine).properties.form, 'lantern-fleece');
});

test('a paid trade changes custody and the same Lantern sheep’s flash after reload', () => {
    const {id, child, lifecycle} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const barter = 'stock:lantern-barter', light = 'light:lantern-fleece', charge = 'energy:lantern-charge';
    const config = {packs: ['w.sky', LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {
            laws: [LANTERN_EVOLUTION.law, LANTERN_FLEECE_LAW],
            things: {[`body:${id}`]: {genes: child.genes, matureAt: child.matureAt}},
        }};
    const start = (tokens, market = true) => createEngineWorld({...config, clock: 10, holders: [
        {id: pen.id, kind: 'place', properties: {'lantern-market': market}, quantities: {[light]: 0}},
        {id: 'outside', kind: 'place'},
        {id, kind: 'body', place: pen.id, refs: {creature: id}, quantities: {[charge]: 4},
            properties: {...lanternCoatProperties(child), form: 'lantern-fleece'}},
        {id: 'player', kind: 'body', place: pen.id, quantities: {[barter]: 0}},
        {id: 'buyer', kind: 'body', place: pen.id, quantities: {[barter]: tokens}},
    ]});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const trade = (engine, current = lifecycle, seller = 'player') => tradeLanternSheep({engine, lifecycle: current},
        {id, seller, buyer: 'buyer', habitat: pen, working: 'trade'});
    const poor = start(0);
    const refused = trade(poor);
    assert.equal(refused.reason, 'evolution-stock-short');
    assert.equal(refused.lifecycle, lifecycle);
    assert.equal(refused.engine, poor);
    assert.equal(trade(start(1, false)).reason, 'evolution-condition-changed');
    const before = start(1);
    assert.equal(trade(before, lifecycle, 'other').engine, before);
    const away = applyEngineOps(before, [{op: 'move', holder: 'buyer', to: 'outside'}], 'buyer-leaves');
    const absent = trade(away);
    assert.equal(absent.reason, 'evolution-input-out-of-reach');
    assert.equal(absent.engine, away);
    assert.equal(absent.lifecycle, lifecycle);
    const sold = trade(reload(before), roundTrip(lifecycle));
    assert.equal(sold.changed, true);
    const saved = reload(sold.engine), herd = roundTrip(sold.lifecycle);
    assert.deepEqual(herd.individuals[id], {...child, keeper: 'buyer', health: {...child.health, lastAt: 10}});
    assert.deepEqual(saved.world.holders[id].refs, {creature: id});
    assert.equal(saved.world.holders.buyer.quantities[barter], 0);
    assert.equal(saved.world.holders.player.quantities[barter], 1);
    assert.equal(trade(saved, herd).engine, saved);
    const flash = engine => advanceEngineWorld(reload(startEngineWorking(engine, {law: LANTERN_FLEECE_LAW,
        method: LANTERN_FLASH, id: 'flash', bindings: {animal: {kind: 'body', id}}})), 11).engine;
    assert.equal(flash(saved).world.holders.pen.quantities[light], 8);
    assert.equal(flash(before).world.holders.pen.quantities[light], 4);
});

test('sun molt preserves the bred creature and changes its actual flash through save and reload', () => {
    const {id, child} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const prism = 'stock:sun-prism', husk = 'stock:lantern-husk';
    const {law, methods} = LANTERN_EVOLUTION;
    const ownPacks = [LANTERN_COAT_PACK, CREATURE_FORM_PACK];
    const config = {packs: ['w.sky', 'l.forage_attraction', ...ownPacks.map(pack => pack.id)], ownPacks,
        settings: {'l.forage_attraction': {profiles: [{light, minimum: 6, interval: 2}], maxNeighbors: 1}},
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {
            laws: [law, LANTERN_FLEECE_LAW, SPELL_EFFECT_LAW], things: {[`body:${id}`]: {genes: child.genes, matureAt: child.matureAt}},
        }};
    const start = (daylight = 1, husks = 0) => createEngineWorld({...config, clock: 10, holders: [
        {id: 'pen', kind: 'place', quantities: {daylight, [light]: 0}},
        {id, kind: 'body', place: 'pen', refs: {creature: id},
            properties: {...lanternCoatProperties(child), form: 'lantern-fleece'}, quantities: {[charge]: 4}},
        {id: 'altar', kind: 'thing', place: 'pen', quantities: {[prism]: 1, [husk]: husks, [charge]: 0}},
        {id: 'salt', kind: 'thing', place: 'pen', quantities: {'stock:storm-salt': 1}},
    ]});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
    const evolve = (engine, working = 'evolve') => startEngineWorking(engine, {law, method: methods['sun-molt'], id: working,
        bindings: {animal: {kind: 'body', id}, site: {kind: 'place', id: 'pen'}, altar: {kind: 'thing', id: 'altar'}}});
    const flash = engine => {
        const pending = startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method: LANTERN_FLASH, id: 'flash',
            bindings: {animal: {kind: 'body', id}}});
        return advance(restore(pending), pending.world.clock + 1);
    };
    const before = start();
    assert.equal(flash(before).world.holders.pen.quantities[light], 4);
    const pending = evolve(before);
    const spentBeforeSettlement = applyEngineOps(pending, [{op: 'add', holder: 'altar', quantity: prism, amount: -1}], 'take-prism');
    const short = advance(restore(spentBeforeSettlement), 11);
    assert.equal(short.records.workings.evolve.record.receipts[0].reason, 'evolution-stock-short');
    assert.equal(short.world.holders[id].properties.form, 'lantern-fleece');
    assert.equal(short.world.holders.altar.quantities[husk], 0);
    const after = restore(advance(restore(pending), 11));
    assert.deepEqual(serializeEngineWorld(after), serializeEngineWorld(advance(pending, 11)));
    assert.deepEqual(after.world.holders[id], {...before.world.holders[id],
        properties: {...before.world.holders[id].properties, form: 'beacon-fleece'}});
    assert.deepEqual(after.world.holders.altar.quantities, {[prism]: 0, [husk]: 1, [charge]: 0});
    const awaken = (engine, offspring = 'wisp') => awakenLanternHusk(engine, {parent: id, huskHolder: 'altar', offspring});
    assert.equal(awaken(after).ok, false);
    const chargedHusk = applyEngineOps(after, [
        {op: 'set', holder: 'pen', quantity: 'daylight', amount: 0},
        {op: 'add', holder: id, quantity: charge, amount: -1},
        {op: 'add', holder: 'altar', quantity: charge, amount: 1},
    ], 'transfer-to-husk');
    assert.equal(awaken(chargedHusk, id).engine, chargedHusk);
    const occupiedParcel = packLanternHusk(restore(chargedHusk), {parent: id, altar: 'altar', parcel: 'salt'});
    assert.equal(occupiedParcel.reason, 'lantern-husk-identity-unavailable');
    assert.deepEqual(occupiedParcel.engine.world.holders.altar.quantities, chargedHusk.world.holders.altar.quantities);
    const barter = 'stock:lantern-barter';
    const staffed = applyEngineOps(chargedHusk, [
        {op: 'holder_add', value: {id: 'seller', kind: 'body', place: 'pen', quantities: {[barter]: 0}}},
        {op: 'holder_add', value: {id: 'buyer', kind: 'body', place: 'pen', quantities: {[barter]: 2}}},
        {op: 'property', holder: 'altar', property: 'custodian', value: 'seller'},
    ], 'staffed-altar');
    assert.equal(packLanternHusk(staffed, {parent: id, altar: 'altar', parcel: 'parcel', keeper: 'buyer'}).reason, 'lantern-husk-custody');
    const pack = engine => packLanternHusk(engine, {parent: id, altar: 'altar', parcel: 'parcel', keeper: 'seller'});
    const packed = pack(restore(staffed));
    assert.equal(packed.ok, true);
    assert.deepEqual(packed.engine.world.holders.parcel.quantities, {[husk]: 1, [charge]: 1});
    assert.deepEqual(packed.engine.world.holders.altar.quantities, {[prism]: 0, [husk]: 0, [charge]: 0});
    const refilled = applyEngineOps(packed.engine, [
        {op: 'add', holder: 'altar', quantity: husk, amount: 1},
        {op: 'add', holder: 'altar', quantity: charge, amount: 1},
    ], 'different-altar-stock');
    assert.equal(pack(restore(refilled)).ok, false);
    assert.equal(awaken(restore(refilled)).ok, false);
    const trade = (engine, price) => tradeLanternHusk(engine, {parcel: 'parcel', seller: 'seller', buyer: 'buyer', price});
    const shortTrade = restore(packed.engine);
    assert.deepEqual(trade(shortTrade, 3), {ok: false, reason: 'lantern-husk-trade-stock', engine: shortTrade});
    const sold = trade(restore(packed.engine), 2);
    assert.equal(sold.ok, true);
    assert.deepEqual(serializeEngineWorld(sold.engine), serializeEngineWorld(trade(packed.engine, 2).engine));
    assert.equal(sold.engine.world.holders.buyer.quantities[barter], 0);
    assert.equal(sold.engine.world.holders.seller.quantities[barter], 2);
    assert.deepEqual(readLineage(sold.engine.world, 'parcel'), readLineage(packed.engine.world, 'parcel'));
    const traveled = applyEngineOps(sold.engine, [
        {op: 'holder_add', value: {id: 'grove', kind: 'place', quantities: {[light]: 0}}},
        {op: 'move', holder: 'parcel', to: 'grove'},
    ], 'carry-husk');
    const hatchParcel = (engine, keeper = 'buyer') =>
        awakenLanternHusk(engine, {parent: id, huskHolder: 'parcel', offspring: 'grove-wisp', keeper});
    assert.equal(hatchParcel(restore(traveled)).ok, false);
    const reunited = applyEngineOps(traveled, [id, 'buyer'].map(holder => ({op: 'move', holder, to: 'grove'})), 'reunite-with-husk');
    assert.equal(hatchParcel(restore(reunited), 'seller').reason, 'lantern-husk-custody');
    const hatched = hatchParcel(restore(reunited));
    assert.equal(hatched.ok, true);
    assert.deepEqual(serializeEngineWorld(hatched.engine), serializeEngineWorld(hatchParcel(reunited).engine));
    assert.deepEqual(readLineage(hatched.engine.world, 'grove-wisp')[0].parents, [id, 'parcel']);
    const refillParcel = applyEngineOps(hatched.engine, [
        {op: 'add', holder: 'parcel', quantity: husk, amount: 1},
        {op: 'add', holder: 'parcel', quantity: charge, amount: 1},
    ], 'different-parcel-stock');
    assert.equal(awakenLanternHusk(restore(refillParcel), {parent: id, huskHolder: 'parcel', offspring: 'duplicate', keeper: 'buyer'}).ok, false);
    const full = applyEngineOps(chargedHusk, [
        {op: 'property', holder: 'pen', property: 'husk-wisp-capacity', value: 1},
        {op: 'holder_add', value: {id: 'grove', kind: 'place'}},
        {op: 'holder_add', value: {id: 'resident', kind: 'body', place: 'pen', properties: {form: 'husk-wisp'}}},
    ], 'wisp-habitat');
    const savedFull = restore(full);
    assert.deepEqual(awaken(savedFull), {ok: false, reason: 'lantern-wisp-habitat-full', engine: savedFull});
    assert.deepEqual(savedFull.world.holders.altar.quantities, {[prism]: 0, [husk]: 1, [charge]: 1});
    const vacated = applyEngineOps(savedFull, [{op: 'move', holder: 'resident', to: 'grove'}], 'resident-departs');
    const retried = awaken(restore(vacated));
    assert.equal(retried.ok, true);
    assert.deepEqual(serializeEngineWorld(retried.engine), serializeEngineWorld(awaken(vacated).engine));
    assert.equal(retried.engine.world.holders.resident.place, 'grove');
    const travelers = applyEngineOps(retried.engine, [
        {op: 'holder_add', value: {id: 'incoming', kind: 'body', as: ['creature'], place: 'grove', properties: {form: 'husk-wisp'}}},
        {op: 'link_add', link: {id: 'grove-path', kind: 'path', from: 'grove', to: 'pen', cost: 2}},
    ], 'wisp-travel');
    const cross = engine => crossLanternPath(engine, {animal: 'resident', link: 'grove-path'});
    const fullAgain = restore(travelers);
    assert.deepEqual(cross(fullAgain), {crossed: false, reason: 'lantern-wisp-habitat-full', engine: fullAgain});
    const vacancy = applyEngineOps(fullAgain, [{op: 'move', holder: 'wisp', to: 'grove'}], 'wisp-departs');
    const incoming = spellEffectMethod([{
        sentence: {verb: 'move', object: 'position', target: 'creature', time: 'instant', carrier: 'wand'},
        target: {id: 'incoming'}, minutes: 1, details: {target: {shape: 'holder', id: 'incoming'}, to: 'pen'},
    }]);
    const inFlight = startEngineWorking(vacancy, {...incoming, id: 'wisp-arrival'});
    const diverted = applyEngineOps(inFlight, [{op: 'move', holder: 'wisp', to: 'pen'}], 'wisp-returns');
    const blockedArrival = advance(restore(diverted), vacancy.world.clock + 1);
    assert.deepEqual(serializeEngineWorld(blockedArrival), serializeEngineWorld(advance(diverted, vacancy.world.clock + 1)));
    assert.equal(blockedArrival.world.holders.incoming.place, 'grove');
    assert.deepEqual(blockedArrival.records.workings['wisp-arrival'].landed.map(row => [row.status, row.reason]),
        [['idle', 'There is no room for another wisp there.']]);
    const group = landEffect(vacancy.rules, vacancy.world, {
        sentence: {verb: 'move', object: 'position', target: 'area', time: 'instant', carrier: 'wand'},
        details: {target: {shape: 'holders', ids: ['resident', 'incoming']}, to: 'pen'},
    }, {cause: 'group-relocation'});
    assert.equal(group.world.holders.incoming.place, 'pen');
    assert.equal(group.world.holders.resident.place, 'grove');
    assert.deepEqual(group.outcomes[0].blocked, [{target: 'resident', by: 'pen', reason: 'There is no room for another wisp there.'}]);
    const late = cross(restore(inFlight));
    assert.equal(late.reason, 'lantern-wisp-habitat-full');
    assert.equal(late.engine.world.clock, vacancy.world.clock + 2);
    assert.equal(late.engine.world.holders.incoming.place, 'pen');
    assert.equal(late.engine.world.holders.resident.place, 'grove');
    const crossed = cross(restore(vacancy));
    assert.equal(crossed.crossed, true);
    assert.equal(restore(crossed.engine).world.holders.resident.place, 'pen');
    assert.deepEqual(serializeEngineWorld(crossed.engine), serializeEngineWorld(cross(vacancy).engine));
    const birth = awaken(restore(chargedHusk));
    assert.equal(birth.ok, true);
    const withWisp = restore(birth.engine);
    assert.deepEqual(withWisp.world.holders[id], chargedHusk.world.holders[id]);
    assert.deepEqual(withWisp.world.holders.wisp.quantities, {[husk]: 1, [charge]: 1});
    assert.deepEqual(withWisp.world.holders.altar.quantities, {[prism]: 0, [husk]: 0, [charge]: 0});
    assert.deepEqual(readLineage(withWisp.world, 'wisp')[0].parents, [id]);
    assert.equal(awaken(withWisp, 'other-wisp').ok, false);
    const glow = (engine, animal, working) => startEngineWorking(engine, {law: LANTERN_FLEECE_LAW,
        method: LANTERN_WISP_GLOW, id: working, bindings: {animal: {kind: 'body', id: animal}}});
    assert.equal(advance(restore(glow(hatched.engine, 'grove-wisp', 'grove-glow')), 12).world.holders.grove.quantities[light], 6);
    const mistaken = advance(glow(withWisp, id, 'parent-glow'), 12);
    assert.equal(mistaken.records.workings['parent-glow'].record.receipts[0].reason, 'glow-needs-husk-wisp');
    assert.deepEqual(mistaken.world.holders[id], withWisp.world.holders[id]);
    const wispGlow = glow(withWisp, 'wisp', 'first-glow');
    const shining = advance(restore(wispGlow), 12);
    assert.deepEqual(serializeEngineWorld(shining), serializeEngineWorld(advance(wispGlow, 12)));
    assert.equal(shining.world.holders.pen.quantities[light], 6);
    const retriedGlow = advance(restore(glow(retried.engine, 'wisp', 'vacancy-glow')), 12);
    assert.equal(retriedGlow.world.holders.pen.quantities[light], 6);
    assert.equal(retriedGlow.world.holders.wisp.quantities[charge], 0);
    assert.equal(shining.world.holders.wisp.quantities[charge], 0);
    assert.equal(shining.world.holders.wisp.quantities[husk], 1);
    const spent = advance(glow(restore(shining), 'wisp', 'spent-glow'), 14);
    assert.equal(spent.records.workings['spent-glow'].record.receipts[0].reason, 'lantern-charge-empty');
    assert.equal(spent.world.holders.pen.quantities[light], 0);
    assert.deepEqual(readLineage(spent.world, 'wisp'), readLineage(withWisp.world, 'wisp'));
    const flowers = applyEngineOps(spent, [
        {op: 'holder_add', value: {id: 'flower-patch', kind: 'place', quantities: {[WISP_NECTAR]: 1, [light]: 0, daylight: 0},
            properties: {'husk-wisp-nectar-capacity': 2}}},
        {op: 'move', holder: 'wisp', to: 'flower-patch'},
        {op: 'holder_add', value: {id: 'z-wisp', kind: 'body', place: 'flower-patch', properties: {form: 'husk-wisp'},
            quantities: {[charge]: 0}}},
    ], 'wisp-nectar');
    const fed = advance(restore(flowers), 15);
    assert.equal(fed.world.holders['flower-patch'].quantities[WISP_NECTAR], 0);
    assert.equal(fed.world.holders.wisp.quantities[charge], 1);
    assert.equal(fed.world.holders['z-wisp'].quantities[charge], 0);
    const fedGlow = glow(fed, 'wisp', 'nectar-glow');
    assert.equal(advance(restore(fedGlow), 16).world.holders['flower-patch'].quantities[light], 6);
    assert.deepEqual(serializeEngineWorld(advance(restore(fedGlow), 18)), serializeEngineWorld(advance(fedGlow, 18)));
    const empty = advance(fedGlow, 18);
    assert.equal(empty.world.holders['flower-patch'].quantities[WISP_NECTAR], 0);
    assert.equal(empty.world.holders.wisp.quantities[charge], 0);
    const morning = applyEngineOps(empty, [
        {op: 'set', holder: 'flower-patch', quantity: 'daylight', amount: 1},
    ], 'wisp-flowers-in-daylight');
    const coveredFlowers = applyEngineOps(morning, [
        {op: 'property', holder: 'flower-patch', property: 'lantern-shade', value: true},
    ], 'cover-wisp-flowers');
    assert.equal(advance(restore(coveredFlowers), 24).world.holders.wisp.quantities[charge], 0);
    const atFirstBloom = advance(restore(morning), 19);
    assert.equal(atFirstBloom.world.holders.wisp.quantities[charge], 1);
    assert.equal(atFirstBloom.world.holders['z-wisp'].quantities[charge], 0);
    assert.equal(atFirstBloom.world.holders['flower-patch'].quantities[WISP_NECTAR], 0);
    const grown = advance(morning, 24);
    assert.equal(grown.world.holders['z-wisp'].quantities[charge], 1);
    assert.equal(grown.world.holders['flower-patch'].quantities[WISP_NECTAR], 2);
    const grownInSteps = [20, 21, 22, 23, 24].reduce((state, at) => advance(restore(state), at), atFirstBloom);
    for (const id of ['wisp', 'z-wisp', 'flower-patch'])
        assert.deepEqual(grown.world.holders[id].quantities, grownInSteps.world.holders[id].quantities);
    const rebloomGlow = advance(restore(glow(atFirstBloom, 'wisp', 'rebloom-glow')), 20);
    assert.equal(rebloomGlow.world.holders['flower-patch'].quantities[light], 6);
    assert.deepEqual(readLineage(rebloomGlow.world, 'wisp'), readLineage(withWisp.world, 'wisp'));
    const withTrail = applyEngineOps(empty, [
        {op: 'move', holder: 'wisp', to: 'pen'},
        {op: 'property', holder: 'flower-patch', property: 'husk-wisp-capacity', value: 1},
        {op: 'add', holder: 'flower-patch', quantity: WISP_NECTAR, amount: 2},
        {op: 'link_add', link: {id: 'nectar-trail', kind: 'wisp-path', from: 'pen', to: 'flower-patch'}},
    ], 'open-nectar-trail');
    const atCapacity = advance(restore(withTrail), 19);
    assert.equal(atCapacity.world.holders.wisp.place, 'pen');
    assert.equal(atCapacity.world.holders['flower-patch'].quantities[WISP_NECTAR], 1);
    const vacant = applyEngineOps(atCapacity, [{op: 'move', holder: 'z-wisp', to: 'pen'}], 'wisp-vacancy');
    const closedTrail = applyEngineOps(vacant, [
        {op: 'link_set', id: 'nectar-trail', state: 'closed'},
    ], 'close-nectar-trail');
    assert.equal(advance(restore(closedTrail), 21).world.holders.wisp.place, 'pen');
    const arrived = advance(restore(vacant), 20);
    assert.equal(arrived.world.holders.wisp.place, 'flower-patch');
    assert.equal(arrived.world.holders.wisp.quantities[charge], 0);
    const foraged = advance(restore(arrived), 21);
    assert.equal(foraged.world.holders['flower-patch'].quantities[WISP_NECTAR], 0);
    assert.deepEqual(serializeEngineWorld(foraged), serializeEngineWorld(advance(vacant, 21)));
    const foundGlow = advance(restore(glow(foraged, 'wisp', 'foraged-glow')), 22);
    assert.equal(foundGlow.world.holders['flower-patch'].quantities[light], 6);
    assert.deepEqual(readLineage(foundGlow.world, 'wisp'), readLineage(withWisp.world, 'wisp'));
    const longTrail = applyEngineOps(spent, [
        {op: 'holder_add', value: {id: 'resting-stone', kind: 'place'}},
        {op: 'holder_add', value: {id: 'night-bloom', kind: 'place', quantities: {[WISP_NECTAR]: 1, [light]: 0}}},
        {op: 'link_add', link: {id: 'stone-flight', kind: 'wisp-path', from: 'pen', to: 'resting-stone', cost: 3}},
        {op: 'link_add', link: {id: 'bloom-flight', kind: 'wisp-path', from: 'resting-stone', to: 'night-bloom', cost: 2}},
    ], 'wisp-long-trail');
    const at = (engine, place, at) => {
        const next = advance(restore(engine), at);
        assert.equal(next.world.holders.wisp.place, place);
        return next;
    };
    at(longTrail, 'pen', 24);
    const timed = applyEngineOps(longTrail, [
        {op: 'property', holder: 'wisp', property: WISP_FORAGE_RANGE, value: 2},
        {op: 'property', holder: 'wisp', property: WISP_TIMED_FLIGHT, value: true},
    ], 'wisp-long-flight');
    const inFlightToStone = at(timed, 'pen', 16);
    at(inFlightToStone, 'pen', 17);
    const stopped = at(inFlightToStone, 'resting-stone', 18);
    const inFlightToBloom = at(stopped, 'resting-stone', 19);
    const closedInFlight = applyEngineOps(inFlightToBloom, [
        {op: 'link_set', id: 'bloom-flight', state: 'closed'},
    ], 'close-bloom-flight');
    const stranded = at(closedInFlight, 'resting-stone', 22);
    assert.equal(stranded.world.holders.wisp.quantities[charge], 0);
    assert.equal(stranded.world.holders['night-bloom'].quantities[WISP_NECTAR], 1);
    const reopened = applyEngineOps(stranded, [
        {op: 'link_set', id: 'bloom-flight', state: 'open'},
    ], 'reopen-bloom-flight');
    const landed = at(inFlightToBloom, 'night-bloom', 21);
    assert.equal(landed.world.holders.wisp.quantities[charge], 0);
    const nectarMeal = at(landed, 'night-bloom', 22);
    assert.deepEqual(serializeEngineWorld(nectarMeal), serializeEngineWorld(advance(timed, 22)));
    assert.equal(nectarMeal.world.holders['night-bloom'].quantities[WISP_NECTAR], 0);
    assert.equal(nectarMeal.world.holders.wisp.quantities[charge], 1);
    const retryMeal = at(reopened, 'night-bloom', 26);
    assert.equal(retryMeal.world.holders.wisp.quantities[charge], 1);
    const flightGlow = advance(restore(glow(nectarMeal, 'wisp', 'flight-glow')), 23);
    assert.equal(flightGlow.world.holders['night-bloom'].quantities[light], 6);
    assert.deepEqual(readLineage(flightGlow.world, 'wisp'), readLineage(withWisp.world, 'wisp'));
    const shaded = applyEngineOps(spent, [
        {op: 'set', holder: 'pen', quantity: 'daylight', amount: 1},
        {op: 'property', holder: 'pen', property: 'husk-wisp-basking', value: true},
        {op: 'property', holder: 'pen', property: 'lantern-shade', value: true},
        {op: 'holder_add', value: {id: 'verge', kind: 'place'}},
        {op: 'holder_add', value: {id: 'forager', kind: 'body', place: 'verge', properties: {alive: true, forage_light: light}}},
        {op: 'link_add', link: {id: 'verge-path', kind: 'path', from: 'verge', to: 'pen'}},
    ], 'wisp-basking-site');
    const noSun = advance(restore(shaded), 16);
    assert.equal(noSun.world.holders.wisp.quantities[charge], 0);
    const sunny = applyEngineOps(noSun, [{op: 'property', holder: 'pen', property: 'lantern-shade', value: null}], 'uncover');
    const recharged = advance(restore(sunny), 19);
    assert.deepEqual(serializeEngineWorld(recharged), serializeEngineWorld(advance(restore(advance(sunny, 17)), 19)));
    assert.equal(recharged.world.holders.wisp.quantities[charge], 1);
    const dusk = applyEngineOps(recharged, [{op: 'set', holder: 'pen', quantity: 'daylight', amount: 0}], 'wisp-dusk');
    const pulse = glow(dusk, 'wisp', 'recharged-glow');
    const repeated = advance(restore(pulse), 21);
    assert.equal(repeated.world.holders.pen.quantities[light], 6);
    assert.equal(repeated.world.holders.forager.place, 'verge');
    assert.equal(repeated.world.holders.wisp.quantities[charge], 0);
    const faded = advance(restore(repeated), 22);
    assert.equal(faded.world.holders.forager.place, 'pen');
    assert.equal(faded.world.holders.pen.quantities[light], 0);
    assert.equal(advance(dusk, 22).world.holders.forager.place, 'verge');
    assert.deepEqual(readLineage(faded.world, 'wisp'), readLineage(withWisp.world, 'wisp'));
    const night = applyEngineOps(after, [{op: 'set', holder: 'pen', quantity: 'daylight', amount: 0}], 'night');
    const flashed = flash(night);
    assert.equal(flashed.world.holders.pen.quantities[light], 8);
    assert.equal(flashed.world.holders[id].quantities[charge], 3);
    assert.equal(advance(restore(flashed), 14).world.holders.pen.quantities[light], 0);
    for (const [engine, reason, altar] of [[start(0), 'evolution-condition-changed', {[prism]: 1, [husk]: 0}],
        [start(1, 1), 'evolution-output-full', {[prism]: 1, [husk]: 1}],
        [after, 'evolution-form-changed', {[prism]: 0, [husk]: 1}]]) {
        const blocked = advance(evolve(engine, 'blocked'), engine.world.clock + 1);
        assert.equal(blocked.records.workings.blocked.record.receipts[0].reason, reason);
        assert.deepEqual(blocked.world.holders.altar.quantities, {...altar, [charge]: 0});
        assert.equal(blocked.world.holders[id].properties.form, engine.world.holders[id].properties.form);
    }

    const mantle = startEngineWorking(before, {law, method: methods['storm-mantle'], id: 'mantle',
        bindings: {animal: {kind: 'body', id}, catalyst: {kind: 'thing', id: 'salt'}}});
    const masked = advance(restore(mantle), 11);
    const maskedMolt = evolve(masked, 'masked-molt');
    const noPrism = applyEngineOps(maskedMolt, [{op: 'add', holder: 'altar', quantity: prism, amount: -1}], 'take-prism');
    const refused = advance(restore(noPrism), 12);
    assert.equal(refused.records.workings['masked-molt'].record.receipts[0].reason, 'evolution-stock-short');
    assert.deepEqual(refused.world.holders[id], masked.world.holders[id]);
    assert.equal(refused.world.holders.altar.quantities[husk], 0);
    const molted = restore(advance(restore(maskedMolt), 12));
    assert.deepEqual(serializeEngineWorld(molted), serializeEngineWorld(advance(maskedMolt, 12)));
    assert.deepEqual(molted.world.holders[id], {...masked.world.holders[id],
        properties: {...masked.world.holders[id].properties, form: 'beacon-fleece'}});
    assert.deepEqual(molted.world.holders.altar.quantities, {[prism]: 0, [husk]: 1, [charge]: 0});
    assert.equal(creatureForm(molted.world.holders[id], 12), 'storm-fleece');
    const released = startEngineWorking(restore(molted), {law, method: methods['revert-form'], id: 'shed-mantle',
        bindings: {animal: {kind: 'body', id}}});
    assert.deepEqual(released.world.holders[id].properties, after.world.holders[id].properties);
    assert.deepEqual(released.world.holders[id].quantities, molted.world.holders[id].quantities);
    const dark = applyEngineOps(molted, [{op: 'set', holder: 'pen', quantity: 'daylight', amount: 0}], 'night');
    const storm = startEngineWorking(dark, {law: LANTERN_FLEECE_LAW, method: LANTERN_STORMFLASH, id: 'storm',
        bindings: {animal: {kind: 'body', id}}});
    const surge = advance(restore(storm), 13);
    assert.equal(surge.world.holders.pen.quantities[light], 16);
    const reverted = flash(surge);
    assert.equal(reverted.world.clock, 14);
    assert.equal(creatureForm(reverted.world.holders[id], 14), 'beacon-fleece');
    assert.deepEqual(reverted.world.holders[id].properties, after.world.holders[id].properties);
    assert.deepEqual(reverted.world.holders[id].refs, before.world.holders[id].refs);
    assert.equal(reverted.records.workings.flash.record.receipts[0].truth.facts.glow.amount, 8);
    assert.equal(reverted.world.holders[id].quantities[charge], 2);
});

test('the saved individual height draw selects a permanent molt and changes the actual flash', () => {
    const genome = LANTERN_FLEECE_GENOME;
    const initial = restoreCreatureLifecycle();
    const stock = settleCohortStock(initial, {revision: initial.revision, id: 'stature-trial',
        species: 'sheep', habitat: pen, delta: 2});
    const take = state => acquireCreature(state, {revision: state.revision, cohortId: 'stature-trial',
        destination: pen, keeper: 'player', genome, genes: genes(['F', 'F'], ['D', 'd'], ['w', 'w'], ['v', 'v'])});
    const tall = take(stock), short = take(tall.state);
    const lifecycle = short.state;
    const {law, methods} = LANTERN_EVOLUTION;
    const ownPacks = [LANTERN_COAT_PACK];
    const charge = 'energy:lantern-charge';
    const config = life => ({packs: ['w.sky', LANTERN_COAT_PACK.id], ownPacks,
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {laws: [law, LANTERN_FLEECE_LAW],
            ports: {readThing: lanternBodyReader(life, registry, {statureMolt: true})}}});
    const engine = createEngineWorld({...config(lifecycle), drawRoot: 'lantern-branch', clock: 10,
        holders: [{id: pen.id, kind: 'place', quantities: {daylight: 0, 'light:lantern-fleece': 0}},
            ...[tall.id, short.id].map(id => ({id, kind: 'body', place: pen.id, refs: {creature: id},
                properties: {...lanternCoatProperties(lifecycle.individuals[id]), form: 'lantern-fleece'},
                quantities: {[charge]: 3}}))]});
    const save = engine => JSON.parse(JSON.stringify(serializeEngineWorld(engine)));
    const restore = engine => restoreEngineWorld(save(engine), config(roundTrip(lifecycle)));
    const step = (engine, clock) => advanceEngineWorld(engine, clock).engine;
    const queue = (engine, id, method, working, workingLaw = law) => startEngineWorking(engine, {
        law: workingLaw, method, id: working, bindings: {animal: {kind: 'body', id}},
    });
    const wrong = step(restore(queue(engine, tall.id, methods['hearth-stature-molt'], 'wrong')), 11);
    assert.equal(wrong.records.workings.wrong.record.receipts[0].reason, 'evolution-condition-changed');
    assert.equal(wrong.world.holders[tall.id].quantities[charge], 3);
    const offer = (engine, {id}) => offerLanternStatureMolt(engine, {id, working: `molt-${id}`});
    const pending = [tall, short].reduce(offer, engine);
    const evolved = restore(step(restore(pending), 11));
    assert.deepEqual(save(evolved), save(step([short, tall].reduce(offer, engine), 11)));
    for (const [animal, form, expected] of [[tall, 'beacon-fleece', 8], [short, 'hearth-fleece', 12]]) {
        assert.equal(creatureForm(evolved.world.holders[animal.id], 11), form);
        assert.equal(evolved.world.holders[animal.id].refs.creature, animal.id);
        assert.equal(evolved.world.holders[animal.id].quantities[charge], 2);
        const flashed = step(restore(queue(evolved, animal.id, LANTERN_FLASH, 'flash', LANTERN_FLEECE_LAW)), 12);
        assert.equal(flashed.world.holders[pen.id].quantities['light:lantern-fleece'], expected);
        assert.equal(flashed.world.holders[animal.id].quantities[charge], 1);
    }
});

test('a moon-form breeding rule changes the first harvest after the parent reverts', () => {
    const genome = {...LANTERN_FLEECE_GENOME, ivs: trialGenome.ivs};
    const {child, lifecycle} = trialBirth({genome});
    const parents = child.parents;
    const [carrier] = parents;
    const {law, methods} = LANTERN_EVOLUTION;
    const ownPacks = [LANTERN_COAT_PACK, CREATURE_FORM_PACK];
    const clasp = 'stock:breeding-clasp';
    const config = {packs: ['w.sky', ...ownPacks.map(pack => pack.id)], ownPacks, host: {laws: [law]},
        shared: {properties: [WORLD_PROPERTIES.form, {id: 'breeding-bench', type: 'flag'}, {id: 'custodian', type: 'label'}]}};
    const engine = createEngineWorld({...config, clock: 10, holders: [
        {id: pen.id, kind: 'place', quantities: {daylight: 0, moon_phase: 4}},
        {id: 'bench', kind: 'thing', place: pen.id, properties: {'breeding-bench': true, custodian: 'player'},
            quantities: {[clasp]: 1}},
        {id: carrier, kind: 'body', place: pen.id, refs: {creature: carrier},
            properties: {...lanternCoatProperties(lifecycle.individuals[carrier]), form: 'lantern-fleece'},
            quantities: {'energy:lantern-charge': 4}},
    ]});
    const reload = ({engine, lifecycle}) => ({
        engine: restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config),
        lifecycle: roundTrip(lifecycle),
    });
    const options = {bench: 'bench', parents, keeper: 'player', parent: 0, genome, root: 'moon-brood',
        gestationMinutes: 10, growthMinutes: 3};
    const formRule = {parent: 0, form: 'moon-fleece', gestationMinutes: 7};
    const attempt = pair => startMeadowClaspBrood(pair, {...options, formRule});
    const working = startEngineWorking(engine, {law, method: methods['moon-veil'], id: 'breeding-veil',
        bindings: {animal: {kind: 'body', id: carrier}, site: {kind: 'place', id: pen.id}}});
    const at = clock => ({engine: advanceEngineWorld(working, clock).engine, lifecycle});
    const base = {...at(11), engine: advanceEngineWorld(engine, 11).engine};
    assert.equal(attempt(base).reason, 'breeding-parent-form-unavailable');
    const moon = reload(at(11));
    const aided = attempt(moon);
    const ordinary = startMeadowClaspBrood(base, options);
    assert.equal(aided.ok, true);
    assert.equal(aided.engine.world.holders.bench.quantities[clasp], 0);
    assert.equal(aided.engine.world.holders[carrier].quantities['energy:lantern-charge'], 3);
    const expired = reload(at(17));
    const refused = attempt(expired);
    assert.equal(refused.reason, 'breeding-parent-form-unavailable');
    assert.equal(refused.engine.world.holders.bench.quantities[clasp], 1);
    assert.deepEqual(refused.lifecycle.broods, {});
    const birth = (pair, broodId, clock) => settleCreatureBirth(pair.lifecycle, {
        revision: pair.lifecycle.revision, broodId, clock, destination: pen,
    });
    const resumed = reload({...aided, engine: advanceEngineWorld(aided.engine, 18).engine});
    assert.equal(creatureForm(resumed.engine.world.holders[carrier], 18), 'lantern-fleece');
    assert.throws(() => birth(resumed, aided.broodId, 17), /No creature birth is due/);
    const born = birth(resumed, aided.broodId, 18);
    assert.deepEqual(born, birth(aided, aided.broodId, 18));
    const lamb = roundTrip(born.state).individuals[born.id];
    const later = birth(ordinary, ordinary.broodId, 21);
    const ordinaryLamb = later.state.individuals[later.id];
    assert.deepEqual(lamb.parents, parents);
    assert.deepEqual(lamb.genes, ordinaryLamb.genes);
    assert.deepEqual(lamb.ivs, ordinaryLamb.ivs);
    assert.equal(planMeadowFleece(later.id, ordinaryLamb, 5, {genome, clock: 21}).ok, false);
    assert.deepEqual(harvest({id: born.id, child: lamb}, genome, 21),
        harvest({id: later.id, child: ordinaryLamb}, genome, 24));
});

test('moon veil grants the same creature a stronger flash and reverts on the saved clock or by release', () => {
    const {id, child, lifecycle} = trialBirth({genome: LANTERN_FLEECE_GENOME, repulsion: true});
    const {law, methods} = LANTERN_EVOLUTION;
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const ownPacks = [LANTERN_COAT_PACK, CREATURE_FORM_PACK];
    const config = {packs: ['w.sky', ...ownPacks.map(pack => pack.id)], ownPacks,
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {
            laws: [law, LANTERN_FLEECE_LAW], things: {[`body:${id}`]: {genes: child.genes, matureAt: child.matureAt}},
        }};
    const start = createEngineWorld({...config, clock: 10, holders: [
        {id: 'pen', kind: 'place', quantities: {daylight: 0, moon_phase: 4, [light]: 0}},
        {id, kind: 'body', place: 'pen', refs: {creature: id},
            properties: {...lanternCoatProperties(child), form: 'lantern-fleece'}, quantities: {[charge]: 4}},
        {id: 'salt', kind: 'thing', place: 'pen', quantities: {'stock:storm-salt': 2}},
    ]});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const step = (engine, at) => advanceEngineWorld(engine, at).engine;
    const startWork = (engine, law, method, working, withSite = false) =>
        startEngineWorking(engine, {law, method, id: working, bindings: {animal: {kind: 'body', id},
            ...(withSite ? {site: {kind: 'place', id: 'pen'}} : {})}});
    const pending = startWork(start, law, methods['moon-veil'], 'veil', true);
    const turned = restore(step(restore(pending), 11));
    assert.deepEqual(serializeEngineWorld(turned), serializeEngineWorld(step(pending, 11)));
    assert.equal(creatureForm(turned.world.holders[id], 11), 'moon-fleece');
    assert.ok(child.genes.fleece.includes('f'));
    assert.equal(settleLanternGermline({engine: turned, lifecycle}, {id, working: 'veil', keeper: 'player'}).lifecycle, lifecycle);
    assert.equal(turned.world.holders[id].properties.form, 'lantern-fleece');
    assert.equal(turned.world.holders[id].quantities[charge], 3);
    const repeat = step(startWork(turned, law, methods['moon-veil'], 'repeat', true), 12);
    assert.equal(repeat.records.workings.repeat.record.receipts[0].reason, 'evolution-temporary-form-active');
    assert.equal(repeat.world.holders[id].quantities[charge], 3);
    const blockedBeam = step(startWork(start, LANTERN_FLEECE_LAW, LANTERN_MOONBEAM, 'base-beam'), 11);
    assert.equal(blockedBeam.records.workings['base-beam'].record.receipts[0].reason, 'moonbeam-needs-moon-fleece');
    assert.equal(blockedBeam.world.holders[id].quantities[charge], 4);
    const flashed = step(startWork(turned, LANTERN_FLEECE_LAW, LANTERN_MOONBEAM, 'moon-flash'), 12);
    assert.equal(flashed.world.holders.pen.quantities[light], 12);
    const lateFlash = startWork(step(flashed, 16), LANTERN_FLEECE_LAW, LANTERN_FLASH, 'last-minute-flash');
    const expired = step(restore(lateFlash), 17);
    assert.equal(expired.world.holders.pen.quantities[light], 4, 'a flash settling at expiry uses the base form');
    assert.equal(creatureForm(expired.world.holders[id], 17), 'lantern-fleece');
    assert.deepEqual(expired.world.holders[id].properties, start.world.holders[id].properties);
    assert.deepEqual(expired.world.holders[id].refs, start.world.holders[id].refs);
    assert.equal(expired.world.holders[id].quantities[charge], 1);
    const afterBeam = step(startWork(expired, LANTERN_FLEECE_LAW, LANTERN_MOONBEAM, 'after-beam'), 18);
    assert.equal(afterBeam.records.workings['after-beam'].record.receipts[0].reason, 'moonbeam-needs-moon-fleece');
    assert.equal(afterBeam.world.holders[id].quantities[charge], 1);
    const released = restore(startWork(turned, law, methods['revert-form'], 'release'));
    assert.equal(creatureForm(released.world.holders[id], 11), 'lantern-fleece');
    assert.equal(released.world.holders[id].quantities[charge], 3);
    assert.deepEqual(step(released, 17).world.holders[id], released.world.holders[id]);

    const mantle = (engine, working) => startEngineWorking(engine, {law, method: methods['storm-mantle'], id: working,
        bindings: {animal: {kind: 'body', id}, catalyst: {kind: 'thing', id: 'salt'}}});
    const held = mantle(turned, 'storm');
    const emptied = applyEngineOps(held, [{op: 'add', holder: 'salt', quantity: 'stock:storm-salt', amount: -2}], 'remove-salt');
    const failed = step(restore(emptied), 12);
    assert.equal(failed.records.workings.storm.record.receipts[0].reason, 'evolution-stock-short');
    assert.equal(creatureForm(failed.world.holders[id], 12), 'moon-fleece');
    const stacked = restore(step(restore(held), 12));
    assert.equal(creatureForm(stacked.world.holders[id], 12), 'storm-fleece');
    assert.equal(stacked.world.holders.salt.quantities['stock:storm-salt'], 1);
    const duplicate = step(mantle(stacked, 'duplicate-storm'), 13);
    assert.equal(duplicate.records.workings['duplicate-storm'].record.receipts[0].reason, 'evolution-temporary-form-active');
    assert.equal(duplicate.world.holders.salt.quantities['stock:storm-salt'], 1);
    const earlyRelease = startWork(stacked, law, methods['revert-form'], 'release-storm');
    assert.equal(creatureForm(earlyRelease.world.holders[id], 12), 'moon-fleece');
    const suppressed = step(startWork(stacked, LANTERN_FLEECE_LAW, LANTERN_MOONBEAM, 'suppressed'), 13);
    assert.equal(suppressed.records.workings.suppressed.record.receipts[0].reason, 'moonbeam-needs-moon-fleece');
    assert.equal(suppressed.world.holders[id].quantities[charge], 3);
    const surge = step(startWork(suppressed, LANTERN_FLEECE_LAW, LANTERN_STORMFLASH, 'storm-flash'), 14);
    assert.equal(surge.world.holders.pen.quantities[light], 16);
    const boundary = startWork(surge, LANTERN_FLEECE_LAW, LANTERN_MOONBEAM, 'moon-restored');
    const moonAgain = step(restore(boundary), 15);
    assert.equal(creatureForm(moonAgain.world.holders[id], 15), 'moon-fleece');
    assert.equal(moonAgain.records.workings['moon-restored'].record.receipts[0].truth.facts.glow.amount, 12);
    const baseAgain = step(restore(moonAgain), 17);
    assert.deepEqual(baseAgain.world.holders[id].properties, start.world.holders[id].properties);
    assert.deepEqual(baseAgain.world.holders[id].refs, start.world.holders[id].refs);
    assert.equal(baseAgain.world.holders[id].quantities[charge], 1);
    assert.equal(baseAgain.world.holders.pen.quantities[light], 0);
});

test('opt-in Storm Mantle upkeep and Stormflash share the saved coat charge', () => {
    const {id, child} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const {law, methods} = LANTERN_EVOLUTION;
    const charge = 'energy:lantern-charge', salt = 'stock:storm-salt', light = 'light:lantern-fleece';
    const ownPacks = [LANTERN_COAT_PACK, CREATURE_FORM_PACK, LANTERN_STORM_UPKEEP_PACK];
    const config = {packs: ['w.sky', ...ownPacks.map(pack => pack.id)], ownPacks,
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {
            laws: [law, LANTERN_FLEECE_LAW], things: {[`body:${id}`]: {genes: child.genes, matureAt: child.matureAt}},
        }};
    const start = (initialCharge, daylight) => createEngineWorld({...config, clock: 10, holders: [
        {id: 'pen', kind: 'place', quantities: {daylight, [light]: 0}},
        {id: 'salt', kind: 'thing', place: 'pen', quantities: {[salt]: 1}},
        {id, kind: 'body', place: 'pen', refs: {creature: id}, quantities: {[charge]: initialCharge},
            properties: {...lanternCoatProperties(child), form: 'lantern-fleece'}},
    ]});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const step = (engine, to) => advanceEngineWorld(engine, to).engine;
    const mantle = engine => startEngineWorking(engine, {law, method: methods['storm-mantle'], id: 'mantle',
        bindings: {animal: {kind: 'body', id}, catalyst: {kind: 'thing', id: 'salt'}}});
    const flash = engine => startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method: LANTERN_STORMFLASH, id: 'flash',
        bindings: {animal: {kind: 'body', id}}});
    const failed = step(mantle(start(0, 0)), 11);
    assert.equal(failed.records.workings.mantle.record.receipts[0].reason, 'evolution-condition-changed');
    assert.equal(failed.world.holders.salt.quantities[salt], 1);

    const active = step(reload(mantle(start(2, 0))), 11);
    assert.equal(active.world.holders.salt.quantities[salt], 0);
    assert.equal(creatureForm(active.world.holders[id], 11), 'storm-fleece');
    const cast = flash(active);
    const lit = step(reload(cast), 12);
    assert.equal(lit.world.holders.pen.quantities[light], 16);
    assert.equal(lit.world.holders[id].quantities[charge], 0);
    const drained = step(reload(lit), 13);
    assert.equal(creatureForm(drained.world.holders[id], 13), 'lantern-fleece');
    assert.deepEqual(drained.world.holders[id].refs, active.world.holders[id].refs);
    assert.equal(step(reload(drained), 14).world.holders.pen.quantities[light], 0);
    assert.deepEqual(serializeEngineWorld(step(cast, 14)), serializeEngineWorld(step(reload(drained), 14)));

    const lastCharge = step(mantle(start(1, 0)), 11);
    const missed = step(reload(flash(lastCharge)), 12);
    assert.equal(missed.records.workings.flash.record.receipts[0].reason, 'stormflash-needs-storm-fleece');
    assert.equal(missed.world.holders[id].quantities[charge], 0);
    assert.equal(missed.world.holders.pen.quantities[light], 0);

    const sunny = step(mantle(start(4, 1)), 11);
    const sunnyEnd = step(sunny, 14);
    assert.deepEqual(serializeEngineWorld(sunnyEnd), serializeEngineWorld(step(reload(step(sunny, 12)), 14)));
    assert.equal(sunnyEnd.world.holders[id].quantities[charge], 3);
    assert.equal(creatureForm(sunnyEnd.world.holders[id], 14), 'lantern-fleece');
    assert.equal(step(sunnyEnd, 15).world.holders[id].quantities[charge], 4);
});

test('sky dusk triggers Moon Veil and spell-driven arrival in daylight releases it after restore', () => {
    const {id, child} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const ownPacks = [LANTERN_COAT_PACK, CREATURE_FORM_PACK, LANTERN_MOON_CYCLE_PACK];
    const config = {packs: ['w.sky', 'l.forage_attraction', ...ownPacks.map(pack => pack.id)], ownPacks,
        settings: {'w.sky': {dawn: 490, dusk: 510, moonCycleDays: 2},
            'l.forage_attraction': {profiles: [{light, minimum: 8, interval: 2}], maxNeighbors: 1}},
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {
            laws: [LANTERN_FLEECE_LAW, SPELL_EFFECT_LAW, LANTERN_EVOLUTION.law], things: {[`body:${id}`]: {genes: child.genes, matureAt: child.matureAt}},
        }};
    const mist = {kind: 'body', id: 'mist-ewe'};
    const start = createEngineWorld({...config, clock: 29,
        links: [{id: 'moth-path', kind: 'path', from: 'lit-barn', to: 'pen', oneWay: true, state: 'open'}], holders: [
        {id: 'pen', kind: 'place', tags: ['sky'], quantities: {daylight: 1, moon_phase: 4, humidity: 59, [light]: 0}},
        {id: 'lit-barn', kind: 'place', quantities: {daylight: 1, [light]: 0}},
        {id: 'salt', kind: 'thing', place: 'pen', quantities: {'stock:storm-salt': 1}},
        {id, kind: 'body', as: ['creature'], place: 'pen', properties: {...lanternCoatProperties(child), form: 'lantern-fleece'}, quantities: {[charge]: 4}},
        {...mist, place: 'pen', properties: {...lanternCoatProperties(child, {mist: true}), form: 'lantern-fleece'},
            quantities: {[charge]: 4}},
        {id: 'light-feeder', kind: 'body', place: 'lit-barn', properties: {alive: true, forage_light: light}},
    ]});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const step = (engine, at) => advanceEngineWorld(engine, at).engine;
    const dusk = step(restore(start), 30);
    assert.equal(creatureForm(dusk.world.holders[id], 30), 'moon-fleece');
    assert.equal(dusk.world.holders[id].quantities[charge], 3);
    assert.equal(creatureForm(dusk.world.holders[mist.id], 30), 'lantern-fleece');
    assert.equal(dusk.world.holders[mist.id].quantities[charge], 4);
    const humid = applyEngineOps(start, [{op: 'set', holder: 'pen', quantity: 'humidity', amount: 60}], 'mist-before-dusk');
    const humidDusk = step(restore(humid), 30);
    assert.equal(creatureForm(humidDusk.world.holders[mist.id], 30), 'moon-fleece');
    assert.equal(humidDusk.world.holders[mist.id].quantities[charge], 3);
    assert.deepEqual(serializeEngineWorld(humidDusk), serializeEngineWorld(step(humid, 30)));
    const offered = startEngineWorking(dusk, {law: LANTERN_EVOLUTION.law, method: LANTERN_EVOLUTION.methods['moon-veil'],
        id: 'manual-dry-veil', bindings: {animal: mist, site: {kind: 'place', id: 'pen'}}});
    const refused = step(restore(offered), 31);
    assert.equal(refused.records.workings['manual-dry-veil'].record.receipts[0].reason, 'evolution-condition-changed');
    assert.equal(refused.world.holders[mist.id].quantities[charge], 4);
    const beam = startEngineWorking(restore(dusk), {law: LANTERN_FLEECE_LAW, method: LANTERN_MOONBEAM, id: 'beam',
        bindings: {animal: {kind: 'body', id}}});
    const lit = step(beam, 31);
    assert.equal(lit.world.holders.pen.quantities[light], 12);
    const moveSpell = spellEffectMethod([{
        sentence: {verb: 'move', object: 'position', target: 'creature', time: 'instant', carrier: 'wand'},
        target: {id}, minutes: 1, details: {target: {shape: 'holder', id}, to: 'lit-barn'},
    }]);
    const cast = startEngineWorking(restore(lit), {...moveSpell, id: 'bring-into-daylight'});
    const moved = step(restore(cast), 32);
    assert.equal(moved.world.holders[id].place, 'lit-barn');
    assert.equal(creatureForm(moved.world.holders[id], 32), 'lantern-fleece');
    assert.equal(moved.world.holders[id].quantities[charge], 2);
    assert.equal(moved.world.holders['light-feeder'].place, 'pen');
    assert.equal(step(restore(moved), 33).world.holders.pen.quantities[light], 0);
    assert.equal(step(start, 32).world.holders['light-feeder'].place, 'lit-barn');

    const mantle = startEngineWorking(restore(lit), {law: LANTERN_EVOLUTION.law,
        method: LANTERN_EVOLUTION.methods['storm-mantle'], id: 'storm', bindings: {
            animal: {kind: 'body', id}, catalyst: {kind: 'thing', id: 'salt'},
        }});
    const layered = step(mantle, 32);
    const crossing = startEngineWorking(restore(layered), {...moveSpell, id: 'cross-with-storm'});
    const crossed = step(restore(crossing), 33);
    assert.equal(creatureForm(crossed.world.holders[id], 33), 'storm-fleece');
    assert.equal(creatureForm(step(restore(crossed), 35).world.holders[id], 35), 'lantern-fleece');
});

test('a saved contest reads the Lantern form for moves and armor and releases it at settlement', () => {
    const law = defineContestLaw({id: 'test.lantern-bout', revision: 1, lethal: false, moves: {
        'lantern-ram': {resolver: 'strike', steps: [5], power: 12},
        bump: {resolver: 'strike', steps: [5], power: 2},
        charge: {resolver: 'strike', steps: [2], power: 7},
    }});
    const ownPacks = [LANTERN_COAT_PACK, CREATURE_FORM_PACK];
    const config = {packs: ['c.contest', ...ownPacks.map(pack => pack.id)], ownPacks,
        shared: {properties: [WORLD_PROPERTIES.form, ...LANTERN_CONTEST_PROPERTIES]}, host: {laws: [LANTERN_EVOLUTION.law]}};
    const charge = 'energy:lantern-charge';
    const seed = (energy, detail, defending = false) => {
        const engine = createEngineWorld({...config, clock: 10, holders: [
            {id: 'pen', kind: 'place'},
            {id: 'sheep', kind: 'body', place: 'pen', refs: {creature: 'sheep'},
                properties: {form: 'lantern-fleece', 'lantern-fleece-capacity': 4, 'lantern-fleece-ready-at': 0},
                quantities: {[charge]: energy, vitality: 20}},
            {id: 'rival', kind: 'body', place: 'pen', quantities: {vitality: 10}},
            {id: 'spectator', kind: 'body', place: 'pen', properties: {form: 'guard-fleece'}},
        ]});
        const record = beginContest(law, {id: 'bout', seed: 3, place: 'pen', detail, limits: {landed: 1}, entrants: [
            {id: 'a', side: 'red', body: 'sheep', moves: ['lantern-ram', 'bump'], profile: {attack: 100, armor: 1}},
            {id: 'b', side: 'blue', body: 'rival', moves: defending ? ['charge'] : ['bump'],
                speed: defending ? 200 : 1, profile: {attack: 100}},
        ]}, engine.world);
        return {record, engine};
    };
    const step = ({record, engine}) => stepLanternContest(law, record, engine);
    const run = state => {
        for (let i = 0; i < 40 && !state.record.result; i++) state = step(state);
        assert.ok(state.record.result);
        return state;
    };
    const reload = ({record, engine}) => ({
        record: restoreContest(law, serializeContest(record)),
        engine: restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config),
    });
    const enter = ({record, engine}) => ({record, engine: enterLanternContest(engine, record, 'a')});
    const abort = ({record, engine}) => abortLanternContest(law, record, engine);
    for (const detail of ['near', 'far']) {
        const initial = seed(1, detail);
        const active = enter(initial);
        assert.equal(creatureForm(active.engine.world.holders.sheep, 10), 'guard-fleece');
        assert.equal(active.engine.world.holders.sheep.quantities[charge], 0);
        assert.equal(enter(active).engine, active.engine);
        const started = step(active);
        const done = run(reload(started));
        assert.deepEqual(done.record, run(active).record);
        assert.deepEqual(serializeEngineWorld(done.engine), serializeEngineWorld(run(active).engine));
        assert.equal(done.engine.world.holders.rival.quantities.vitality, 0);
        assert.equal(run(initial).engine.world.holders.rival.quantities.vitality, 8);
        assert.equal(creatureForm(done.engine.world.holders.sheep, 10), 'lantern-fleece');
        assert.deepEqual(done.engine.world.holders.sheep.properties, initial.engine.world.holders.sheep.properties);
        assert.deepEqual(done.engine.world.holders.sheep.refs, initial.engine.world.holders.sheep.refs);
        assert.equal(done.engine.world.holders.sheep.quantities[charge], 0);
        assert.equal(creatureForm(done.engine.world.holders.spectator, 10), 'guard-fleece');
        assert.equal(step(done).engine, done.engine);
        assert.equal(enter(done).engine, done.engine);
    }
    const empty = enter(seed(0, 'near'));
    assert.equal(creatureForm(empty.engine.world.holders.sheep, 10), 'lantern-fleece');
    assert.equal(run(empty).engine.world.holders.rival.quantities.vitality, 8);

    const active = enter(seed(2, 'near'));
    const other = {...active.record, id: 'other-bout'};
    const unchanged = run({record: other, engine: active.engine});
    assert.equal(unchanged.engine.world.holders.rival.quantities.vitality, 8);
    assert.equal(creatureForm(unchanged.engine.world.holders.sheep, 10), 'guard-fleece');
    assert.equal(abort({record: other, engine: active.engine}).engine, active.engine);

    const firstBout = seed(2, 'far', true);
    let pendingAbort = enter({...firstBout, record: {...firstBout.record, limits: {}}});
    for (let i = 0; i < 12 && !Object.keys(pendingAbort.record.pending).length; i++) pendingAbort = step(pendingAbort);
    assert.equal(pendingAbort.record.pending.sheep.vitality, -4);
    assert.equal(pendingAbort.record.entrants.a.working.status, 'running');
    const aborted = reload(abort(reload(pendingAbort)));
    assert.deepEqual(aborted.record, abort(pendingAbort).record);
    assert.deepEqual(serializeEngineWorld(aborted.engine), serializeEngineWorld(abort(pendingAbort).engine));
    assert.equal(aborted.record.result.reason, 'aborted');
    assert.equal(aborted.record.result.winner, null);
    assert.equal(aborted.record.entrants.a.working.status, 'interrupted');
    assert.deepEqual(aborted.record.pending, {});
    assert.equal(aborted.engine.world.holders.sheep.quantities.vitality, 16);
    assert.equal(aborted.engine.world.holders.rival.quantities.vitality, 10);
    assert.equal(aborted.engine.world.holders.sheep.quantities[charge], 1);
    assert.deepEqual(aborted.engine.world.holders.sheep.properties, firstBout.engine.world.holders.sheep.properties);
    assert.equal(abort(aborted).engine, aborted.engine);
    assert.equal(step(aborted).engine, aborted.engine);

    for (const detail of ['near', 'far']) {
        const initial = seed(1, detail, true);
        const baseline = run(initial).engine.world.holders.sheep.quantities.vitality;
        const pending = step(step(enter(initial)));
        assert.equal(pending.record.entrants.b.working.status, 'running');
        assert.equal(pending.record.entrants.a.profile.armor, 1);
        const protectedHit = run(reload(pending));
        assert.equal(protectedHit.engine.world.holders.sheep.quantities.vitality, baseline + 3);
        assert.equal(protectedHit.record.entrants.a.profile.armor, 1);
        const early = startEngineWorking(pending.engine, {law: LANTERN_EVOLUTION.law,
            method: LANTERN_EVOLUTION.methods['revert-form'], id: 'release-before-hit',
            bindings: {animal: {kind: 'body', id: 'sheep'}}});
        const unprotectedHit = run(reload({...pending, engine: early}));
        assert.equal(unprotectedHit.engine.world.holders.sheep.quantities.vitality, baseline);
        assert.equal(unprotectedHit.engine.world.holders.sheep.quantities[charge], 0);
        assert.deepEqual(unprotectedHit.engine.world.holders.sheep.properties, initial.engine.world.holders.sheep.properties);
    }
});

test('removing the bound prism collar releases its form before a saved flash can land', () => {
    const {id, child} = trialBirth({genome: LANTERN_FLEECE_GENOME});
    const {law} = LANTERN_EVOLUTION;
    const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
    const ownPacks = [LANTERN_COAT_PACK, CREATURE_FORM_PACK, LANTERN_PRISM_COLLAR_PACK];
    const config = {packs: ['w.sky', ...ownPacks.map(pack => pack.id)], ownPacks,
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {
            laws: [law, LANTERN_FLEECE_LAW], things: {[`body:${id}`]: {genes: child.genes, matureAt: child.matureAt}},
        }};
    const initial = createEngineWorld({...config, clock: 10, holders: [
        {id: 'pen', kind: 'place', quantities: {daylight: 0, moon_phase: 4, [light]: 0}},
        {id: 'shed', kind: 'place'},
        {id, kind: 'body', place: 'pen', refs: {creature: id}, quantities: {[charge]: 3},
            properties: {...lanternCoatProperties(child), form: 'lantern-fleece'}},
        {id: 'collar', kind: 'thing', place: 'pen', properties: {'lantern-prism-collar': true}},
        {id: 'spare', kind: 'thing', place: 'pen', properties: {'lantern-prism-collar': true}},
    ]});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const step = (engine, to) => advanceEngineWorld(engine, to).engine;
    const move = (engine, holder, to) => applyEngineOps(engine, [{op: 'move', holder, to}], 'move-equipment');
    const fasten = (engine, working) => fastenLanternPrism(engine, {id, collar: 'collar', working});
    const active = reload(fasten(initial, 'fasten'));
    assert.equal(creatureForm(active.world.holders[id], 10), 'prism-fleece');
    assert.equal(active.world.holders[id].quantities[charge], 2);
    assert.equal(fasten(active, 'duplicate'), active);
    const flash = startEngineWorking(active, {law: LANTERN_FLEECE_LAW, method: LANTERN_PRISMFLASH, id: 'prism-flash',
        bindings: {animal: {kind: 'body', id}}});
    const success = step(reload(move(flash, 'spare', 'shed')), 11);
    assert.equal(success.world.holders.pen.quantities[light], 20);
    assert.equal(success.world.holders[id].quantities[charge], 1);

    const taken = move(reload(flash), 'collar', 'shed');
    assert.deepEqual(taken.world.holders[id].properties, initial.world.holders[id].properties);
    assert.ok(taken.world.chain.some(row => row.kind === 'departed' &&
        row.reactions.includes(`${LANTERN_PRISM_COLLAR_PACK.id}:separate@${id}`)));
    const blocked = step(reload(taken), 11);
    assert.equal(blocked.records.workings['prism-flash'].record.receipts[0].reason, 'prismflash-needs-prism-fleece');
    assert.equal(blocked.world.holders.pen.quantities[light], 0);
    assert.equal(blocked.world.holders[id].quantities[charge], 2);
    assert.deepEqual(blocked.world.holders[id].refs, initial.world.holders[id].refs);
    const outOfReach = fasten(blocked, 'too-far');
    assert.equal(outOfReach.records.workings['too-far'].record.receipts[0].reason, 'evolution-input-out-of-reach');
    const returned = move(outOfReach, 'collar', 'pen');
    assert.equal(creatureForm(returned.world.holders[id], 11), 'lantern-fleece');
    assert.equal(creatureForm(fasten(returned, 'refasten').world.holders[id], 11), 'prism-fleece');

    const broken = applyEngineOps(flash, [{op: 'holder_remove', holder: 'collar'}], 'break-collar');
    const checked = step(reload(broken), 11);
    assert.equal(checked.records.workings['prism-flash'].record.receipts[0].reason, 'prismflash-needs-prism-fleece');
    assert.deepEqual(checked.world.holders[id].properties, initial.world.holders[id].properties);

    const pendingVeil = startEngineWorking(initial, {law, method: LANTERN_EVOLUTION.methods['moon-veil'], id: 'veil',
        bindings: {animal: {kind: 'body', id}, site: {kind: 'place', id: 'pen'}}});
    const layered = fasten(step(pendingVeil, 11), 'fasten-over-veil');
    assert.equal(creatureForm(layered.world.holders[id], 11), 'prism-fleece');
    const uncovered = move(reload(layered), 'collar', 'shed');
    assert.equal(creatureForm(uncovered.world.holders[id], 11), 'moon-fleece');
    assert.equal(creatureForm(step(uncovered, 17).world.holders[id], 17), 'lantern-fleece');
});

test('an event-bound temporary form persists until the owning event releases it', () => {
    const roles = {animal: 'body'};
    const {law, methods} = defineCreatureEvolution({id: 'test.event-form', revision: 1, routes: [
        {id: 'battle-form', trigger: 'battle', roles, from: 'base', to: 'battle', temporary: {}, alternatives: [
            [{role: 'animal', field: 'properties', key: 'held', op: 'is', value: 'stone'}],
            [{role: 'animal', field: 'properties', key: 'moves', op: 'has', value: 'signal'}],
        ]},
        {id: 'permanent', trigger: 'growth', roles, from: 'base', to: 'grown'},
    ]});
    const config = {packs: ['w.sky', CREATURE_FORM_PACK.id], ownPacks: [CREATURE_FORM_PACK],
        shared: {properties: [WORLD_PROPERTIES.form, {id: 'held', type: 'label'}, {id: 'moves', type: 'set'}]}, host: {laws: [law]}};
    const engine = createEngineWorld({...config, holders: [
        {id: 'pen', kind: 'place'}, {id: 'animal', kind: 'body', place: 'pen', properties: {form: 'base'}},
    ]});
    const start = (engine, id) => startEngineWorking(engine, {law, method: methods[id], id, bindings: {animal: {kind: 'body', id: 'animal'}}});
    const condition = (property, value) => applyEngineOps(engine, [{op: 'property', holder: 'animal', property, value}], 'evolution-means');
    assert.equal(start(engine, 'battle-form').records.workings['battle-form'].record.receipts[0].reason, 'evolution-condition-changed');
    assert.equal(creatureForm(start(condition('held', 'stone'), 'battle-form').world.holders.animal, 0), 'battle');
    const changed = start(condition('moves', ['signal']), 'battle-form');
    const saved = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(changed))), config);
    const late = advanceEngineWorld(saved, 100).engine;
    const blocked = start(late, 'permanent');
    assert.equal(blocked.records.workings.permanent.record.receipts[0].reason, 'evolution-temporary-form-active');
    assert.equal(creatureForm(blocked.world.holders.animal, 100), 'battle');
    const released = start(blocked, 'revert-form');
    assert.deepEqual(released.world.holders.animal.properties, {form: 'base', moves: ['signal']});
});

test('world routes compose growth, friendship, trade, battle and event conditions without new operations', () => {
    const roles = {animal: 'body'};
    const fact = (key, op, value) => ({role: 'animal', field: 'properties', key, op, value});
    const routes = [
        {trigger: 'growth', needs: [fact('rank', 'atLeast', 3), fact('bond', 'atLeast', 4), fact('moves', 'has', 'signal')]},
        {trigger: 'item', needs: [fact('held', 'is', 'prism')]},
        {trigger: 'trade', needs: [fact('trade-partner-kind', 'is', 'moth')]},
        {trigger: 'battle', needs: [{...fact('hits', 'greater'), other: {role: 'animal', field: 'properties', key: 'misses'}}]},
        {trigger: 'event', needs: [fact('place-event', 'is', 'moonrise')]},
    ].map(row => ({...row, id: row.trigger, from: 'young', to: `adult-${row.trigger}`, roles}));
    const {law, byTrigger} = defineCreatureEvolution({id: 'test.evolution', revision: 1, routes});
    const facts = {form: 'young', rank: 3, bond: 4, moves: ['signal'], held: 'prism', hits: 3, misses: 2,
        'trade-partner-kind': 'moth', 'place-event': 'moonrise'};
    for (const {trigger, to, needs} of routes) {
        assert.deepEqual(byTrigger[trigger], [trigger]);
        const settle = properties => law.operations[trigger].settle({bound: {animal: {id: 'animal', holder: 'animal',
            place: 'pen', properties}}, at: 0});
        assert.deepEqual(settle(facts).effects, [{op: 'property', holder: 'animal', property: 'form', value: to}]);
        assert.equal(settle({...facts, [needs[0].key]: undefined}).ok, false);
    }
});

function harvest({id, child}, genome, clock = 5, environment) {
    assert.equal(planMeadowFleece(id, child, 5, {genome, clock: clock - 1, environment}).ok, false);
    const plan = planMeadowFleece(id, child, 5, {genome, clock, environment});
    assert.equal(plan.ok, true);
    const config = {packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.stock]}};
    const engine = createEngineWorld({...config, holders: [{id: 'pen', kind: 'place'},
        {id: 'clip', kind: 'thing', place: 'pen', quantities: {'stock:fine-wool': 0, 'stock:wool': 0}}]});
    const quantity = key => key === FINE_WOOL_KEY ? 'stock:fine-wool' : 'stock:wool';
    const settled = applyEngineOps(engine, plan.effects.map(({key, amount}) =>
        ({op: 'add', holder: 'clip', quantity: quantity(key), amount})), `shear:${id}`);
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(settled))), config);
    assert.deepEqual(restored.world.holders.clip.quantities, settled.world.holders.clip.quantities);
    return Object.fromEntries(Object.entries(restored.world.holders.clip.quantities).filter(([, amount]) => amount > 0));
}

test('an optional permanent molt changes what the same sheep passes to later offspring', () => {
    const genome = LANTERN_FLEECE_GENOME, keeper = 'player';
    const empty = restoreCreatureLifecycle();
    const stock = settleCohortStock(empty, {revision: empty.revision, id: 'trial', species: 'sheep', habitat: pen, delta: 2});
    const acquire = (state, fleece, coat) => acquireCreature(state, {revision: state.revision, cohortId: 'trial',
        destination: pen, keeper, genome, phased: true, genes: genes(fleece, coat, ['w', 'w'], ['v', 'v'])});
    const parent = acquire(stock, ['f', 'f'], ['D', 'd']);
    const mate = acquire(parent.state, ['F', 'F'], ['d', 'd']);
    const tested = markCreatureGenesKnown(mate.state, {revision: mate.state.revision, id: parent.id, loci: ['fleece', 'coat']});
    const brood = (state, clock) => startCreatureBrood(state, {revision: state.revision, parents: [parent.id, mate.id],
        keeper, clock, gestationMinutes: 2, growthMinutes: 3, genome, root: 'molt-trial'});
    const birth = (pending, clock, state = pending.state) => settleCreatureBirth(roundTrip(state), {
        revision: state.revision, broodId: pending.id, clock, destination: pen});
    const before = brood(tested, 10);
    const {law, methods} = LANTERN_EVOLUTION;
    const config = {packs: ['w.sky', LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {laws: [law]}};
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const engine = createEngineWorld({...config, clock: 10, holders: [
        {id: pen.id, kind: 'place', quantities: {daylight: 1}},
        {id: parent.id, kind: 'body', place: pen.id, refs: {creature: parent.id},
            properties: {...lanternCoatProperties(tested.individuals[parent.id]), form: 'lantern-fleece'},
            quantities: {'energy:lantern-charge': 4}},
        {id: 'altar', kind: 'thing', place: pen.id, quantities: {'stock:sun-prism': 1, 'stock:lantern-husk': 0}},
    ]});
    const pending = startEngineWorking(engine, {law, method: methods['sun-molt'], id: 'molt',
        bindings: {animal: {kind: 'body', id: parent.id}, site: {kind: 'place', id: pen.id}, altar: {kind: 'thing', id: 'altar'}}});
    const settle = (engine, lifecycle, by = keeper) => settleLanternGermline({engine, lifecycle},
        {id: parent.id, working: 'molt', keeper: by});
    assert.equal(settle(pending, before.state).lifecycle, before.state);
    const imitation = applyEngineOps(engine, [{op: 'property', holder: parent.id, property: 'form', value: 'beacon-fleece'}], 'imitation');
    assert.equal(settle(imitation, before.state).changed, false);
    const evolved = reload(advanceEngineWorld(reload(pending), 11).engine);
    assert.equal(evolved.records.workings.molt.record.receipts[0].ok, true,
        JSON.stringify(evolved.records.workings.molt.record.receipts[0]));
    assert.equal(evolved.world.holders.altar.quantities['stock:sun-prism'], 0);
    assert.equal(settle(evolved, before.state, 'other').changed, false);
    const changed = settle(evolved, roundTrip(before.state));
    assert.equal(changed.changed, true);
    const restored = roundTrip(changed.lifecycle);
    const original = before.state.individuals[parent.id];
    assert.deepEqual(restored.individuals[parent.id], {...original,
        genes: {...original.genes, fleece: ['F', 'F']}, tested: ['coat']});
    assert.equal(settle(reload(changed.engine), restored).lifecycle, restored);
    const older = birth(before, 12, restored);
    const control = birth(before, 12);
    assert.deepEqual(older.state.individuals[older.id], control.state.individuals[control.id]);
    const children = [older.state, control.state].map(state => {
        const later = birth(brood(state, 12), 14);
        const child = roundTrip(later.state).individuals[later.id];
        assert.deepEqual(child.parents, [parent.id, mate.id]);
        return {id: later.id, child};
    });
    assert.deepEqual(children[0].child.genes, {...children[1].child.genes, fleece: ['F', 'F']});
    const bundles = children[0].child.genes.coat[0] === 'D' ? 7 : 5;
    assert.deepEqual(harvest(children[0], genome, 17), {'stock:fine-wool': bundles});
    assert.deepEqual(harvest(children[1], genome, 17), {'stock:wool': bundles});
});

test('a permanent species change preserves old offspring and changes a later offspring kind and clip', () => {
    const species = BEACON_SHEEP_KIND.id;
    const habitat = {...pen, supportedSpecies: ['sheep', species]};
    const cohortId = 'beacons', keeper = 'player';
    const genome = LANTERN_FLEECE_GENOME;
    const empty = restoreCreatureLifecycle();
    const stock = settleCohortStock(empty, {revision: 0, id: 'trial', species: 'sheep', habitat, delta: 2});
    const seeded = settleCohortStock(stock, {revision: stock.revision, id: cohortId, species, habitat, delta: 1});
    const acquire = state => acquireCreature(state, {revision: state.revision, cohortId: 'trial', destination: habitat,
        keeper, genome, phased: true, genes: genes(['F', 'F'], ['D', 'd'], ['w', 'w'], ['v', 'v'])});
    const first = acquire(seeded), second = acquire(first.state);
    const ids = [first.id, second.id];
    const trained = ['lantern-signal', 'lantern-steady-signal', 'follow', 'lantern-steady-signal'].reduce(
        (state, skill, index) => practiceWithCreature(state, {revision: state.revision, id: first.id, actor: keeper,
            clock: index + 1, minimumGap: 1, bondGain: 2, skill}), second.state);
    const conceive = (state, clock, genome) => startCreatureBrood(state, {revision: state.revision, parents: ids,
        keeper, clock, gestationMinutes: 2, growthMinutes: 3, genome, root: 'species-trial'});
    const birth = (state, broodId, clock, destination = habitat) =>
        settleCreatureBirth(roundTrip(state), {revision: state.revision, broodId, clock, destination});
    const conceived = conceive(trained, 10, genome);
    const {law, methods} = LANTERN_EVOLUTION;
    const config = {packs: ['w.sky', LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
        shared: {properties: [WORLD_PROPERTIES.form]}, host: {laws: [law, LANTERN_FLEECE_LAW]}};
    const engine = createEngineWorld({...config, clock: 10, holders: [
        {id: pen.id, kind: 'place', quantities: {daylight: 1, 'light:lantern-fleece': 0}},
        ...ids.map(id => ({id, kind: 'body', place: pen.id, refs: {creature: id},
            properties: {...lanternCoatProperties(conceived.state.individuals[id]), form: 'lantern-fleece'},
            quantities: {'energy:lantern-charge': 4}})),
        ...ids.map((_, index) => ({id: `altar-${index}`, kind: 'thing', place: pen.id,
            quantities: {'stock:sun-prism': 1, 'stock:lantern-husk': 0}})),
    ]});
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const evolve = (engine, index) => startEngineWorking(engine, {law, method: methods['sun-molt'], id: `molt-${index}`,
        bindings: {animal: {kind: 'body', id: ids[index]}, site: {kind: 'place', id: pen.id},
            altar: {kind: 'thing', id: `altar-${index}`}}});
    const together = (engine, lifecycle, destination = habitat, retainSignal) =>
        runLanternSpeciesMolt({engine, lifecycle}, {id: first.id, keeper, habitat: destination, cohortId,
            altar: 'altar-0', working: 'atomic-molt', retainSignal});
    assert.throws(() => together(engine, conceived.state, pen), /Habitat cannot support/);
    assert.equal(engine.world.holders['altar-0'].quantities['stock:sun-prism'], 1);
    assert.equal(engine.world.holders[first.id].properties.form, 'lantern-fleece');
    assert.deepEqual(engine.records.workings, {});
    const untrained = together(engine, conceived.state, habitat, 'untrained');
    assert.equal(untrained.reason, 'lantern-signal-unpracticed');
    assert.equal(untrained.engine, engine);
    const noPrism = applyEngineOps(engine, [
        {op: 'set', holder: 'altar-0', quantity: 'stock:sun-prism', amount: 0},
    ], 'remove-prism');
    const declined = together(noPrism, conceived.state);
    assert.equal(declined.reason, 'evolution-stock-short');
    assert.equal(declined.engine, noPrism);
    assert.equal(declined.lifecycle, conceived.state);
    const fullAltar = applyEngineOps(engine, [
        {op: 'set', holder: 'altar-0', quantity: 'stock:lantern-husk', amount: 1},
    ], 'fill-husk-account');
    const blocked = together(fullAltar, conceived.state);
    assert.equal(blocked.reason, 'evolution-output-full');
    assert.equal(blocked.engine, fullAltar);
    assert.equal(blocked.lifecycle, conceived.state);
    const atomic = together(reload(engine), roundTrip(conceived.state), habitat, 'lantern-steady-signal');
    assert.equal(atomic.changed, true);
    const savedEngine = reload(atomic.engine), savedLifecycle = roundTrip(atomic.lifecycle);
    const direct = together(engine, conceived.state, habitat, 'lantern-steady-signal');
    assert.deepEqual(serializeEngineWorld(savedEngine), serializeEngineWorld(direct.engine));
    assert.deepEqual(savedLifecycle, direct.lifecycle);
    const prepared = prepareLanternSpeciesMolt({engine, lifecycle: conceived.state}, {id: first.id, keeper, habitat, cohortId,
        altar: 'altar-0', working: 'atomic-molt', retainSignal: 'lantern-steady-signal'});
    const command = JSON.parse(JSON.stringify(prepared.pending));
    assert.equal(prepared.engine, engine);
    assert.equal(prepared.lifecycle, conceived.state);
    const elapsed = advanceEngineWorld(reload(prepared.engine), 11).engine;
    assert.equal(elapsed.world.holders['altar-0'].quantities['stock:sun-prism'], 1);
    assert.equal(elapsed.world.holders[first.id].properties.form, 'lantern-fleece');
    const resumed = finishLanternSpeciesMolt({engine: reload(elapsed), lifecycle: roundTrip(prepared.lifecycle)}, command, habitat);
    assert.deepEqual(serializeEngineWorld(resumed.engine), serializeEngineWorld(direct.engine));
    assert.deepEqual(resumed.lifecycle, direct.lifecycle);
    const transferred = transferCreature(prepared.lifecycle, {revision: prepared.lifecycle.revision, id: first.id,
        fromKeeper: keeper, toKeeper: 'other', destination: habitat, clock: 11});
    assert.equal(finishLanternSpeciesMolt({engine: elapsed, lifecycle: transferred}, command, habitat).engine, elapsed);
    assert.throws(() => finishLanternSpeciesMolt({engine: elapsed, lifecycle: prepared.lifecycle}, command, pen), /Habitat cannot support/);
    assert.equal(finishLanternSpeciesMolt({engine: elapsed, lifecycle: prepared.lifecycle},
        {...command, id: second.id}, habitat).reason, 'invalid-pending-sun-molt');
    const late = advanceEngineWorld(elapsed, 12).engine;
    assert.equal(finishLanternSpeciesMolt({engine: late, lifecycle: prepared.lifecycle}, command, habitat).engine, late);
    const dark = applyEngineOps(elapsed, [{op: 'set', holder: pen.id, quantity: 'daylight', amount: 0}], 'darken-before-molt');
    const stopped = finishLanternSpeciesMolt({engine: dark, lifecycle: prepared.lifecycle}, command, habitat);
    assert.equal(stopped.reason, 'evolution-condition-changed');
    assert.equal(stopped.engine, dark);
    assert.equal(stopped.lifecycle, prepared.lifecycle);
    const secondCommand = prepareLanternSpeciesMolt({engine, lifecycle: conceived.state}, {
        id: second.id, keeper, habitat, cohortId, altar: 'altar-1', working: 'second-atomic-molt',
        learnSignal: 'lantern-steady-signal',
    }).pending;
    const queue = {engine, lifecycle: conceived.state, pendingMolts: [secondCommand, command]};
    const saveQueue = state => ({engine: reload(state.engine), lifecycle: roundTrip(state.lifecycle),
        pendingMolts: JSON.parse(JSON.stringify(state.pendingMolts))});
    const tick = (state, to, destination = habitat) => advanceLanternSpeciesClock(state, to, {[pen.id]: destination});
    const paused = tick(queue, 10);
    assert.equal(paused.pendingMolts.length, 2);
    assert.deepEqual(paused.outcomes, []);
    const long = tick(saveQueue(paused), 15);
    assert.equal(long.engine.world.clock, 15);
    assert.deepEqual(long.pendingMolts, []);
    assert.deepEqual(long.outcomes, [
        {working: 'atomic-molt', at: 11, changed: true},
        {working: 'second-atomic-molt', at: 11, changed: true},
    ]);
    const split = tick(saveQueue(tick(queue, 11)), 15);
    assert.deepEqual(serializeEngineWorld(long.engine), serializeEngineWorld(split.engine));
    assert.deepEqual(long.lifecycle, split.lifecycle);
    for (const id of ids) assert.equal(long.lifecycle.individuals[id].species, species);
    assert.deepEqual(long.lifecycle.individuals[second.id].experience[keeper],
        {bond: 0, lastAt: 11, training: {'lantern-steady-signal': 1}});
    assert.deepEqual(conceived.state.individuals[second.id].experience, {});
    const declinedLesson = prepareLanternSpeciesMolt({engine, lifecycle: conceived.state}, {
        id: second.id, working: 'invalid-lesson', keeper, habitat, cohortId, altar: 'altar-1', learnSignal: 'follow',
    });
    assert.equal(declinedLesson.reason, 'lantern-signal-lesson-unavailable');
    assert.equal(declinedLesson.engine.world.holders['altar-1'].quantities['stock:sun-prism'], 1);
    const beaconRegistry = livingKindRegistry({extra: [BEACON_SHEEP_KIND], genomes: {
        ...LIVING_GENOMES, [BEACON_SHEEP_GENOME.id]: BEACON_SHEEP_GENOME,
    }});
    const signal = (pair, steady) => {
        const loaded = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pair.engine))), {
            ...config, host: {...config.host, ports: {readThing: lanternBodyReader(roundTrip(pair.lifecycle), beaconRegistry)}},
        });
        const queued = cueLanternSignal(loaded, {animal: second.id, keeper, id: 'lesson-cue', steady});
        return advanceEngineWorld(queued, loaded.world.clock + 1).engine;
    };
    const learned = signal(long, true), unlearned = signal(long, false);
    assert.equal(learned.world.holders[pen.id].quantities['light:lantern-fleece'], 8);
    assert.equal(learned.world.holders[second.id].quantities['energy:lantern-charge'], 3);
    assert.equal(unlearned.records.workings['lesson-cue'].record.receipts[0].reason, 'lantern-signal-unpracticed');
    assert.equal(unlearned.world.holders[second.id].quantities['energy:lantern-charge'], 4);
    const alternate = prepareLanternSpeciesMolt({engine, lifecycle: conceived.state}, {
        id: second.id, keeper, habitat, cohortId, altar: 'altar-1', working: 'second-atomic-molt',
        learnSignal: 'lantern-signal',
    }).pending;
    const alternateMolt = tick(saveQueue({...queue, pendingMolts: [alternate, command]}), 15);
    assert.equal(signal(alternateMolt, false).world.holders[pen.id].quantities['light:lantern-fleece'], 8);
    assert.equal(signal(alternateMolt, true).records.workings['lesson-cue'].record.receipts[0].reason,
        'lantern-steady-signal-unpracticed');
    const rejected = tick(saveQueue(queue), 15, pen);
    assert.equal(rejected.engine.world.clock, 15);
    assert.deepEqual(rejected.pendingMolts, []);
    assert.ok(rejected.outcomes.every(row => !row.changed && /Habitat cannot support/.test(row.reason)));
    assert.equal(rejected.engine.world.holders['altar-0'].quantities['stock:sun-prism'], 1);
    assert.equal(rejected.lifecycle.individuals[first.id].species, 'sheep');
    const competing = prepareLanternSpeciesMolt({engine, lifecycle: conceived.state}, {
        id: second.id, keeper, habitat, cohortId, altar: 'altar-0', working: 'second-atomic-molt',
        learnSignal: 'lantern-steady-signal',
    }).pending;
    const raced = tick(saveQueue({...queue, pendingMolts: [competing, command]}), 15);
    assert.deepEqual(raced.outcomes, [
        {working: 'atomic-molt', at: 11, changed: true},
        {working: 'second-atomic-molt', at: 11, changed: false, reason: 'evolution-stock-short'},
    ]);
    assert.equal(raced.lifecycle.individuals[second.id].species, 'sheep');
    assert.deepEqual(raced.lifecycle.individuals[second.id].experience, {});
    assert.equal(raced.engine.world.holders[second.id].properties.form, 'lantern-fleece');
    assert.equal(savedEngine.world.clock, 11);
    assert.equal(savedEngine.world.holders[first.id].properties.form, 'beacon-fleece');
    assert.deepEqual(savedEngine.world.holders[first.id].refs, {creature: first.id});
    assert.deepEqual(savedEngine.world.holders['altar-0'].quantities, {'stock:sun-prism': 0, 'stock:lantern-husk': 1});
    assert.equal(savedLifecycle.individuals[first.id].species, species);
    assert.deepEqual(savedLifecycle.individuals[first.id].experience[keeper].training, {'lantern-steady-signal': 2, follow: 1});
    assert.equal(together(savedEngine, savedLifecycle).engine, savedEngine);
    const savedLamb = birth(savedLifecycle, conceived.id, 12);
    assert.equal(savedLamb.state.individuals[savedLamb.id].species, 'sheep');

    const pending = evolve(evolve(engine, 0), 1);
    const change = (engine, lifecycle, index, destination = habitat, retainSignal) => settleLanternSpecies({engine, lifecycle},
        {id: ids[index], working: `molt-${index}`, keeper, habitat: destination, cohortId, retainSignal});
    assert.equal(change(pending, conceived.state, 0).lifecycle, conceived.state);
    const molted = reload(advanceEngineWorld(reload(pending), 11).engine);
    assert.throws(() => change(molted, conceived.state, 0, pen), /Habitat cannot support/);
    const one = change(molted, conceived.state, 0);
    assert.throws(() => conceive(roundTrip(one.lifecycle), 12, genome), /compatible adult stock/);
    const corrupt = structuredClone(one.lifecycle);
    corrupt.individuals[first.id].breedingOrigin = 'trial';
    assert.throws(() => roundTrip(corrupt), /species history/);
    const both = change(molted, roundTrip(one.lifecycle), 1);
    assert.equal(change(molted, both.lifecycle, 0).lifecycle, both.lifecycle);
    assert.equal(both.lifecycle.individuals[first.id].origin, 'trial');
    assert.deepEqual(both.lifecycle.individuals[first.id].genes, conceived.state.individuals[first.id].genes);
    assert.deepEqual(molted.world.holders[first.id].refs, engine.world.holders[first.id].refs);
    assert.equal(habitatOccupancy(both.lifecycle, pen.id), habitatOccupancy(conceived.state, pen.id));
    assert.equal(molted.world.holders['altar-0'].quantities['stock:sun-prism'], 0);

    const prior = birth(both.lifecycle, conceived.id, 12);
    const ordinary = birth(conceived.state, conceived.id, 12);
    assert.deepEqual(prior.state.individuals[prior.id], ordinary.state.individuals[ordinary.id]);
    const changedAfterBirth = change(molted, ordinary.state, 0);
    assert.deepEqual(roundTrip(changedAfterBirth.lifecycle).individuals[ordinary.id], ordinary.state.individuals[ordinary.id]);
    const later = conceive(roundTrip(prior.state), 12, BEACON_SHEEP_GENOME);
    assert.throws(() => birth(later.state, later.id, 14, pen), /Habitat cannot support/);
    const newborn = birth(later.state, later.id, 14);
    const unchanged = conceive(ordinary.state, 12, genome);
    const control = birth(unchanged.state, unchanged.id, 14);
    const trainedBefore = conceived.state.individuals[first.id].experience;
    assert.deepEqual(one.lifecycle.individuals[first.id].experience, trainedBefore);
    const invalid = change(molted, conceived.state, 0, habitat, 'untrained');
    assert.equal(invalid.reason, 'lantern-signal-unpracticed');
    assert.equal(invalid.lifecycle, conceived.state);
    // Queue both signals before the keeper settles a species change.
    let live = conceived.state;
    const liveConfig = {...config, host: {...config.host, ports: {readThing: lanternBodyReader(() => live, beaconRegistry)}}};
    const reloadLive = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), liveConfig);
    const night = reloadLive(applyEngineOps(molted, [{op: 'set', holder: pen.id, quantity: 'daylight', amount: 0}], 'live-signal-night'));
    const queueSignal = (engine, id, method) => startEngineWorking(engine, {law: LANTERN_FLEECE_LAW, method, id,
        bindings: {animal: {kind: 'body', id: first.id}}});
    const queued = queueSignal(queueSignal(night, 'ordinary', LANTERN_SIGNAL), 'steady', LANTERN_STEADY_SIGNAL);
    const withoutChoice = advanceEngineWorld(reloadLive(queued), 12).engine;
    assert.equal(withoutChoice.records.workings.ordinary.record.receipts[0].ok, true);
    assert.equal(withoutChoice.world.holders[first.id].quantities['energy:lantern-charge'], 2);
    const settledChoice = change(queued, live, 0, habitat, 'lantern-steady-signal');
    assert.equal(settledChoice.changed, true);
    live = roundTrip(settledChoice.lifecycle);
    const actual = advanceEngineWorld(reloadLive(settledChoice.engine), 12).engine;
    assert.deepEqual(serializeEngineWorld(actual), serializeEngineWorld(advanceEngineWorld(settledChoice.engine, 12).engine));
    assert.equal(actual.records.workings.ordinary.record.receipts[0].reason, 'lantern-signal-unpracticed');
    assert.equal(actual.records.workings.steady.record.receipts[0].ok, true);
    assert.equal(actual.world.holders[first.id].quantities['energy:lantern-charge'], 3);
    assert.equal(actual.world.holders.pen.quantities['light:lantern-fleece'], 8);
    assert.equal(advanceEngineWorld(reloadLive(actual), 14).engine.world.holders.pen.quantities['light:lantern-fleece'], 8);
    assert.equal(advanceEngineWorld(reloadLive(actual), 15).engine.world.holders.pen.quantities['light:lantern-fleece'], 0);
    for (const [retained, allowed, blocked, duration] of [
        ['lantern-signal', LANTERN_SIGNAL, LANTERN_STEADY_SIGNAL, 1],
        ['lantern-steady-signal', LANTERN_STEADY_SIGNAL, LANTERN_SIGNAL, 3],
    ]) {
        const chosen = change(molted, conceived.state, 0, habitat, retained);
        const saved = roundTrip(chosen.lifecycle);
        const view = readLivingBody({lifecycle: saved, registry: beaconRegistry, id: first.id, clock: 11});
        const former = trainedBefore[keeper];
        assert.deepEqual(saved.individuals[first.id].experience[keeper], {...former,
            training: {follow: 1, [retained]: former.training[retained]}});
        const actionConfig = {...config, host: {...config.host, things: {[`body:${first.id}`]: {
            ...view, genes: saved.individuals[first.id].genes,
        }}}};
        const restoreAction = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), actionConfig);
        const ready = restoreAction(applyEngineOps(chosen.engine, [
            {op: 'set', holder: pen.id, quantity: 'daylight', amount: 0},
        ], 'night-for-signal'));
        const signal = method => startEngineWorking(ready, {law: LANTERN_FLEECE_LAW, method, id: 'signal',
            bindings: {animal: {kind: 'body', id: first.id}}});
        const refused = advanceEngineWorld(restoreAction(signal(blocked)), 12).engine;
        assert.equal(refused.records.workings.signal.record.receipts[0].ok, false);
        assert.equal(refused.world.holders[first.id].quantities['energy:lantern-charge'], 4);
        const lit = advanceEngineWorld(restoreAction(signal(allowed)), 12).engine;
        assert.equal(lit.world.holders[first.id].quantities['energy:lantern-charge'], 3);
        assert.equal(lit.world.holders.pen.quantities['light:lantern-fleece'], 8);
        assert.equal(advanceEngineWorld(restoreAction(lit), 12 + duration - 1).engine.world.holders.pen.quantities['light:lantern-fleece'], 8);
        assert.equal(advanceEngineWorld(restoreAction(lit), 12 + duration).engine.world.holders.pen.quantities['light:lantern-fleece'], 0);
    }
    const lifecycle = roundTrip(newborn.state);
    const body = readLivingBody({lifecycle, registry: beaconRegistry, id: newborn.id, clock: 17});
    assert.equal(body.species, species);
    assert.deepEqual(lifecycle.individuals[newborn.id].parents, ids);
    assert.deepEqual(lifecycle.individuals[newborn.id].genes, control.state.individuals[control.id].genes);
    const level = body.phenotype.coat.level;
    assert.ok(level > 0);
    assert.deepEqual(harvest({id: newborn.id, child: lifecycle.individuals[newborn.id]}, BEACON_SHEEP_GENOME, 17),
        {'stock:fine-wool': 5 + 3 * level});
    assert.deepEqual(harvest({id: control.id, child: control.state.individuals[control.id]}, genome, 17),
        {'stock:fine-wool': 5 + 2 * level});
});

test('linked phase changes the stock credited by the existing meadow shearing method', () => {
    const noIVs = {...trialGenome};
    delete noIVs.ivs;
    const independent = {...noIVs, linkage: []};
    const linked = trialBirth({genome: noIVs});
    assert.deepEqual(linked.child.genes.fleece, ['F', 'F']);
    assert.equal(linked.child.phased, true);
    assert.deepEqual(harvest(linked, noIVs), {'stock:fine-wool': 5});
    for (const [genome, options] of [[independent, {}], [noIVs, {repulsion: true}], [noIVs, {phased: false}]]) {
        const ordinary = trialBirth({genome, ...options});
        assert.deepEqual(ordinary.child.genes.fleece, ['f', 'F']);
        assert.deepEqual(harvest(ordinary, genome), {'stock:wool': 5});
    }
    const recombining = {...noIVs, linkage: [{loci: ['coat', 'fleece'], crossovers: [500]}]};
    assert.deepEqual(harvest(trialBirth({genome: noIVs, root: 'meadow-trial-9'}), noIVs), {'stock:fine-wool': 5});
    assert.deepEqual(harvest(trialBirth({genome: recombining, root: 'meadow-trial-9'}), recombining), {'stock:wool': 5});
    assert.throws(() => validateGenome({...noIVs, linkage: [...noIVs.linkage, ...noIVs.linkage]}), /one group/);
});

test('phased herd draws and returns a complete diploid profile with headcount conserved', () => {
    const coupling = genes(['F', 'f'], ['D', 'd'], ['w', 'w'], ['v', 'v']);
    const repulsion = {...coupling, fleece: ['f', 'F']};
    const reversedCoupling = Object.fromEntries(Object.entries(coupling).map(([locus, pair]) => [locus, [...pair].reverse()]));
    const add = (state, genes, delta = 1) => settleCohortStock(state, {revision: state.revision, id: 'phased',
        species: 'sheep', habitat: pen, genome: trialGenome, genes, delta});
    let state = add(add(restoreCreatureLifecycle(), coupling), reversedCoupling);
    assert.equal(state.cohorts.phased.phase.profiles.length, 1);
    state = add(state, repulsion);
    const initial = roundTrip(state);
    assert.equal(initial.cohorts.phased.phase.profiles.length, 2);
    assert.deepEqual(frequenciesFrom(trialGenome, [coupling]), frequenciesFrom(trialGenome, [repulsion]));
    const draw = (state, root = 'phased-herd') => acquireCreature(state, {revision: state.revision, cohortId: 'phased',
        destination: pen, keeper: null, genome: trialGenome, root});
    const acquired = draw(initial);
    assert.deepEqual(acquired, draw(state));
    state = acquired.state;
    const drawn = [acquired.id];
    for (let i = 0; i < 2; i++) {
        const next = draw(state);
        state = next.state;
        drawn.push(next.id);
    }
    assert.equal(state.cohorts.phased.stock, 0);
    assert.deepEqual(state.cohorts.phased.phase.profiles, []);
    assert.equal(habitatOccupancy(state, pen.id), 3);
    const observations = drawn.map(id => {
        const {genes, phased} = state.individuals[id];
        assert.equal(phased, true);
        return genes;
    });
    for (const {genes, count} of initial.cohorts.phased.phase.profiles)
        assert.equal(observations.filter(g => JSON.stringify(g) === JSON.stringify(genes)).length, count);

    const tested = markCreatureGenesKnown(state, {revision: state.revision, id: drawn[0], loci: ['fleece']});
    const fold = (state, id) => returnPhasedCreature(state, {revision: state.revision, id, genome: trialGenome, clock: 0});
    assert.throws(() => fold(tested, drawn[0]), /individual facts/);
    for (const id of drawn) state = fold(roundTrip(state), id);
    assert.equal(habitatOccupancy(state, pen.id), 3);
    assert.deepEqual(roundTrip(state).cohorts, initial.cohorts);
    assert.notEqual(draw(state).id, drawn[0]);

    const bad = structuredClone(state);
    bad.cohorts.phased.phase.profiles[0].count += 1;
    assert.throws(() => roundTrip(bad), /account for every herd member/);
    assert.throws(() => setCohortAlleles(state, {revision: state.revision, id: 'phased',
        alleles: frequenciesFrom(trialGenome, observations)}), /Allele counts/);
    assert.throws(() => add(state, genes(['F', 'F'], ['D', 'D'], ['w', 'w'], ['v', 'v']), -1), /Insufficient stock/);
    const afterLoss = add(state, repulsion, -1);
    assert.equal(afterLoss.cohorts.phased.stock, 2);
    assert.deepEqual(roundTrip(afterLoss).cohorts.phased.phase.profiles,
        initial.cohorts.phased.phase.profiles.filter(row => row.count === 2));
});

test('E12 promotion and demotion preserve linked phase through a saved brood and real shearing', () => {
    const genome = {...trialGenome};
    delete genome.ivs;
    const run = fleece => {
        const seed = restoreCreatureLifecycle();
        const add = (state, genes) => settleCohortStock(state, {revision: state.revision, id: 'phased',
            species: 'sheep', habitat: pen, genome, genes, delta: 1});
        const ewe = genes(fleece, ['D', 'd'], ['w', 'w'], ['v', 'v']);
        const firstHerd = add(seed, ewe);
        const founder = settleCohortStock(firstHerd, {revision: firstHerd.revision, id: 'mates', species: 'sheep',
            habitat: pen, genome, genes: genes(['F', 'F'], ['d', 'd'], ['w', 'w'], ['v', 'v']), delta: 1});
        const config = {packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.vitality]}};
        const engine = createEngineWorld({...config, drawRoot: 42, holders: [{id: pen.id, kind: 'place'},
            ...['phased', 'mates'].map(id => ({id, kind: 'cohort', place: pen.id, count: 1, refs: {herd: id}, quantities: {vitality: 20}}))]});
        const reload = ({engine, lifecycle}) => ({lifecycle: roundTrip(lifecycle),
            engine: restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config)});
        const draw = (pair, keeper = null, cohortId = 'phased') => promotePhasedWorldCreature(pair, {revision: pair.lifecycle.revision,
            cohortId, destination: pen, keeper, genome});
        const fold = (pair, id) => demotePhasedWorldCreature(pair, {revision: pair.lifecycle.revision, id, genome});
        const original = draw(reload({engine, lifecycle: founder}));
        assert.deepEqual(serializeEngineWorld(original.engine), serializeEngineWorld(draw({engine, lifecycle: founder}).engine));
        assert.equal(original.engine.world.holders.phased.count, 0);
        assert.equal(original.engine.world.holders[original.id].quantities.vitality, 20);
        const damaged = {...original, engine: applyEngineOps(original.engine,
            [{op: 'add', holder: original.id, quantity: 'vitality', amount: -1}], 'test-harm')};
        assert.throws(() => fold(reload(damaged), original.id), /individual world facts/);
        const returned = fold(reload(original), original.id);
        assert.deepEqual(serializeEngineWorld(returned.engine), serializeEngineWorld(fold(original, original.id).engine));
        assert.equal(returned.engine.world.holders[original.id], undefined);
        assert.equal(returned.engine.world.holders.phased.count, 1);
        assert.equal(returned.engine.world.holders.phased.quantities.vitality, 20);
        assert.deepEqual(returned.lifecycle.cohorts, founder.cohorts);
        assert.deepEqual(readLineage(returned.engine.world, original.id).map(row => row.act), ['promote', 'demote']);
        const first = draw(reload(returned), 'player');
        assert.notEqual(first.id, original.id);
        assert.deepEqual(first.lifecycle.individuals[first.id].genes, original.lifecycle.individuals[original.id].genes);
        assert.throws(() => draw({...first, lifecycle: founder}), /must agree/);
        const second = draw(reload(first), 'player', 'mates');
        const brood = startCreatureBrood(second.lifecycle, {revision: second.lifecycle.revision, parents: [first.id, second.id],
            keeper: 'player', clock: 0, gestationMinutes: 2, growthMinutes: 3, genome, root: 'meadow-trial-2'});
        const birth = settleCreatureBirth(roundTrip(brood.state), {revision: brood.state.revision, broodId: brood.id, clock: 2, destination: pen});
        return harvest({id: birth.id, child: birth.state.individuals[birth.id]}, genome);
    };
    assert.deepEqual(run(['F', 'f']), {'stock:fine-wool': 5});
    assert.deepEqual(run(['f', 'F']), {'stock:wool': 5});
});

test('wild phased births and losses preserve linked chromosomes through clock partitions, reload and acquisition', () => {
    const genome = {...trialGenome};
    delete genome.ivs;
    const root = 42;
    const seed = repulsion => {
        const a = genes(repulsion ? ['f', 'F'] : ['F', 'f'], ['D', 'd'], ['w', 'w'], ['v', 'v']);
        const b = genes(repulsion ? ['f', 'f'] : ['F', 'F'], ['D', 'D'], ['w', 'w'], ['v', 'v']);
        let state = restoreCreatureLifecycle();
        for (const [genes, delta] of [[a, 3], [b, 1]]) {
            state = settleCohortStock(state, {revision: state.revision, id: 'wild', species: 'sheep',
                habitat: pen, genome, genes, delta});
        }
        return openWildHabitat(state, {revision: state.revision, id: pen.id, clock: 0, interval: 10});
    };
    const advance = (state, clock, capacity, births, losses) => advanceWildHabitat(state, {
        revision: state.revision, habitat: {...pen, capacity}, clock,
        populations: [{id: 'wild', births, losses, genome, root}],
    }).state;
    const config = {packs: ['w.sky'], shared: {quantities: [WORLD_QUANTITIES.vitality]}};
    const save = pair => JSON.parse(JSON.stringify({world: serializeEngineWorld(pair.engine), lifecycle: pair.lifecycle}));
    const reload = pair => {
        const saved = save(pair);
        return {engine: restoreEngineWorld(saved.world, config), lifecycle: restoreCreatureLifecycle(saved.lifecycle)};
    };
    const advanceBound = (pair, clock, capacity, births, losses, perBirth = 8) => advancePhasedWorldHerds(pair, {
        revision: pair.lifecycle.revision, habitat: {...pen, capacity}, clock,
        populations: [{id: 'wild', births, losses, genome,
            world: {birthRow: 'wild.birth', lossRow: 'wild.loss', perBirth: {vitality: perBirth}}}],
    });
    for (const repulsion of [false, true]) {
        const start = seed(repulsion);
        const initial = {lifecycle: start, engine: createEngineWorld({...config, drawRoot: root, holders: [
            {id: pen.id, kind: 'place'},
            {id: 'wild', kind: 'cohort', place: pen.id, refs: {herd: 'wild'}, count: 4, quantities: {vitality: 80}},
        ]})};
        const reduced = advance(start, 20, 2, 0, 1);
        const lossSteps = advance(roundTrip(advance(start, 10, 2, 0, 1)), 20, 2, 0, 1);
        assert.deepEqual(reduced, lossSteps);
        assert.equal(reduced.cohorts.wild.stock, 2);
        const grown = advance(roundTrip(reduced), 40, 8, 2, 0);
        const birthSteps = advance(roundTrip(advance(reduced, 30, 8, 2, 0)), 40, 8, 2, 0);
        assert.deepEqual(grown, birthSteps);
        assert.deepEqual(grown.habitats[pen.id], {interval: 10, nextAt: 50, births: 4, losses: 2});
        assert.equal(grown.cohorts.wild.stock, 6);
        assert.notDeepEqual(grown.cohorts.wild.phase.profiles, reduced.cohorts.wild.phase.profiles);
        const reducedBound = advanceBound(initial, 20, 2, 0, 1);
        assert.deepEqual(save(reducedBound), save(advanceBound(reload(advanceBound(initial, 10, 2, 0, 1)), 20, 2, 0, 1)));
        assert.deepEqual(reducedBound.lifecycle, reduced);
        assert.equal(reducedBound.engine.world.holders.wild.quantities.vitality, 40);
        assert.equal(reducedBound.engine.world.rows['wild.loss'].vitality, 40);
        assert.throws(() => advanceBound(reducedBound, 30, 8, 2, 0, WORLD_QUANTITIES.vitality.max), /could not settle/);
        const grownBound = advanceBound(reload(reducedBound), 40, 8, 2, 0);
        assert.deepEqual(save(grownBound), save(advanceBound(reload(advanceBound(reducedBound, 30, 8, 2, 0)), 40, 8, 2, 0)));
        assert.deepEqual(grownBound.lifecycle, grown);
        assert.equal(grownBound.engine.world.holders.wild.count, 6);
        assert.equal(grownBound.engine.world.holders.wild.quantities.vitality, 72);
        assert.equal(grownBound.engine.world.rows['wild.birth'].vitality, -32);
        const catchup = advanceBound(grownBound, 700, 8, 0, 0);
        assert.equal(catchup.pending, true);
        assert.equal(catchup.engine.world.clock, catchup.lifecycle.habitats[pen.id].nextAt - 10);
        const resumed = advanceBound(reload(catchup), 700, 8, 0, 0);
        assert.equal(resumed.pending, false);
        assert.deepEqual(save(resumed), save(advanceBound(advanceBound(grownBound, 400, 8, 0, 0), 700, 8, 0, 0)));
        assert.deepEqual(grownBound.engine.world.chain.filter(row => row.kind === 'lifecycle.cohort-change')
            .map(row => [row.at, row.detail.delta, row.detail.count]), [[10, -1, 3], [20, -1, 2], [30, 2, 4], [40, 2, 6]]);
        let herd = reload(grownBound);
        const acquire = pair => promotePhasedWorldCreature(pair, {revision: pair.lifecycle.revision, cohortId: 'wild', destination: pen,
            keeper: 'player', genome, growthMinutes: 1});
        assert.deepEqual(save(acquire(herd)), save(acquire(grownBound)));
        const harvested = [];
        while (herd.lifecycle.cohorts.wild.stock > 0) {
            const result = acquire(herd);
            const child = result.lifecycle.individuals[result.id];
            assert.equal(child.phased, true);
            const fleeceWithDarkCoat = repulsion ? 'f' : 'F';
            const fleeceWithLightCoat = repulsion ? 'F' : 'f';
            for (const [side, coat] of child.genes.coat.entries())
                assert.equal(child.genes.fleece[side], coat === 'D' ? fleeceWithDarkCoat : fleeceWithLightCoat);
            harvested.push(harvest({id: result.id, child}, genome, 41));
            herd = result;
        }
        assert.equal(habitatOccupancy(herd.lifecycle, pen.id), 6);
        assert.deepEqual(herd.lifecycle.cohorts.wild.phase.profiles, []);
        assert.equal(herd.engine.world.holders.wild.count, 0);
        assert.equal(harvested.filter(clip => clip['stock:fine-wool'] > 0).length, repulsion ? 0 : 3);
    }
    const soleSurvivor = advance(seed(false), 30, 1, 0, 1);
    assert.equal(advance(soleSurvivor, 40, 8, 2, 0).cohorts.wild.stock, 1);
    assert.equal(advance(seed(false), 20, 0, 2, 2).cohorts.wild.stock, 0);
});

test('an optional second locus masks fine fleece while the recessive alleles stay inherited', () => {
    const genome = {...trialGenome, epistasis: [{target: 'fleece', suppressor: 'coat', atLeast: 1}]};
    validateGenome(genome);
    const animal = trialBirth({genome});
    const expressed = expressGenes(genome, animal.child.genes);
    assert.deepEqual(animal.child.genes.fleece, ['F', 'F']);
    assert.equal(expressed.fleece.carried, 2);
    assert.equal(expressed.fleece.level, 0);
    assert.equal(expressed.fleece.cause, 'epistasis');
    assert.deepEqual(harvest(animal, genome), {'stock:wool': 7});
    assert.deepEqual(harvest(animal, trialGenome), {'stock:fine-wool': 7});
    assert.throws(() => validateGenome({...genome, epistasis: [{target: 'fleece', suppressor: 'missing', atLeast: 1}]}),
        /Epistasis needs/);
});

test('a phased hybrid inherits a coat modifier that suppresses fine wool only in dry air', () => {
    const {ivs, ...base} = trialGenome;
    const dryParent = {...base, id: 'dry-parent', mutation: 0, loci: {...base.loci,
        coat: {...base.loci.coat, contributions: {'fleece.yield': 2}}}};
    const mistParent = {...dryParent, id: 'mist-parent'};
    const hybrid = validateGenome({...hybridGenome(dryParent, mistParent, 'mist-cross'), linkage: base.linkage,
        epistasis: [{target: 'fleece', suppressor: 'coat', atLeast: 1, unless: {quantity: 'humidity', min: 60}}]});
    const habitat = {...pen, supportedSpecies: ['sheep', 'mist-lantern-sheep', 'mist-hybrid']};
    let state = restoreCreatureLifecycle();
    for (const [id, species] of [['dry', 'sheep'], ['mist', 'mist-lantern-sheep'], ['cross', 'mist-hybrid']])
        state = settleCohortStock(state, {revision: state.revision, id, species, habitat, delta: 1});
    const take = (state, cohortId, genome, coat) => acquireCreature(state, {revision: state.revision,
        cohortId, destination: habitat, keeper: 'player', clock: 0, genome,
        genes: genes(['F', 'F'], coat, ['w', 'w'], ['v', 'v']), phased: true});
    const sire = take(state, 'dry', dryParent, ['d', 'd']);
    const breed = coat => {
        const dam = take(sire.state, 'mist', mistParent, coat);
        const brood = startCreatureBrood(dam.state, {revision: dam.state.revision, parents: [sire.id, dam.id],
            keeper: 'player', clock: 0, genome: hybrid, root: 'mist-cross', gestationMinutes: 2, growthMinutes: 3,
            cross: {origin: 'cross', parentGenomes: [dryParent, mistParent]}});
        const birth = state => settleCreatureBirth(state, {revision: state.revision, broodId: brood.id, clock: 2, destination: habitat});
        const saved = birth(roundTrip(brood.state));
        assert.deepEqual(saved, birth(brood.state));
        return {id: saved.id, child: roundTrip(saved.state).individuals[saved.id]};
    };
    const carrier = breed(['D', 'D']), control = breed(['d', 'd']);
    assert.deepEqual(carrier.child.genes.coat, ['d', 'D']);
    assert.deepEqual(carrier.child.genes.fleece, control.child.genes.fleece);
    assert.equal(carrier.child.phased, true);
    const clip = (animal, humidity) => harvest(animal, hybrid, 5, {humidity});
    assert.deepEqual(clip(carrier, 59), {'stock:wool': 7});
    assert.deepEqual(clip(carrier, 60), {'stock:fine-wool': 7});
    assert.deepEqual(clip(control, 59), {'stock:fine-wool': 5});
    assert.throws(() => validateGenome({...hybrid,
        epistasis: [{...hybrid.epistasis[0], unless: {quantity: 'humidity', min: 59.5}}]}), /Epistasis needs/);
});

test('optional pedigree effect changes when offspring can be sheared and survives a saved brood', () => {
    const base = {...trialGenome};
    delete base.ivs;
    const enabled = {...base, inbreeding: {growthMinutesAtFull: 40}};
    const farm = {...pen, capacity: 10};
    const empty = restoreCreatureLifecycle();
    const stock = settleCohortStock(empty, {revision: empty.revision, id: 'pedigree', species: 'sheep', habitat: farm, delta: 3});
    const alleles = genes(['F', 'F'], ['D', 'D'], ['w', 'w'], ['v', 'v']);
    const founder = state => acquireCreature(state, {revision: state.revision, cohortId: 'pedigree',
        destination: farm, keeper: 'player', genes: alleles, phased: true});
    const ewe = founder(stock);
    const ram = founder(ewe.state);
    const outsider = founder(ram.state);
    const pair = (state, parents, genome, clock) => startCreatureBrood(state, {revision: state.revision, parents,
        keeper: 'player', clock, gestationMinutes: 2, growthMinutes: 3, genome, root: 'pedigree'});
    const deliver = (brood, clock) => {
        const restored = roundTrip(brood.state);
        const settle = state => settleCreatureBirth(state, {revision: state.revision, broodId: brood.id, clock, destination: farm});
        const born = settle(restored);
        assert.deepEqual(born, settle(brood.state));
        return {...born, child: roundTrip(born.state).individuals[born.id]};
    };
    const first = deliver(pair(outsider.state, [ewe.id, ram.id], base, 0), 2);
    const second = deliver(pair(first.state, [ewe.id, ram.id], base, 2), 4);
    const saved = roundTrip(second.state);
    const siblings = [first.id, second.id];
    const close = pair(saved, siblings, enabled, 7);
    const outcross = pair(saved, [first.id, outsider.id], enabled, 7);
    const disabled = pair(saved, siblings, base, 7);
    assert.equal(close.inbreedingCoefficient, 0.25);
    assert.equal(outcross.inbreedingCoefficient, 0);
    assert.equal(disabled.inbreedingCoefficient, undefined);
    const related = deliver(close, 9);
    const unrelated = deliver(outcross, 9);
    const control = deliver(disabled, 9);
    assert.deepEqual(related.child.genes, unrelated.child.genes);
    assert.deepEqual(related.child.genes, control.child.genes);
    const shear = ({id, child}, clock) => planMeadowFleece(id, child, 5, {genome: enabled, clock});
    assert.equal(shear(related, 12).ok, false);
    const clip = [{key: FINE_WOOL_KEY, amount: 5}];
    assert.deepEqual(shear(unrelated, 12).effects, clip);
    assert.deepEqual(shear(control, 12).effects, clip);
    assert.deepEqual(shear(related, 22).effects, clip);
});

test('local IV policy copies distinct stats and a guaranteed parent value changes clip size', () => {
    const ordinary = trialBirth();
    const aided = trialBirth({ivInheritance: {count: 5, guaranteed: {stat: 'woolYield', parent: 0}}});
    assert.deepEqual(ordinary.child.genes, aided.child.genes);
    assert.equal(ordinary.child.ivs.woolYield, 28);
    assert.equal(aided.child.ivs.woolYield, 31);
    assert.deepEqual(harvest(ordinary, trialGenome), {'stock:fine-wool': 7});
    assert.deepEqual(harvest(aided, trialGenome), {'stock:fine-wool': 8});
    // This second seed's fresh rolls are below both parents' values.
    const root = 'meadow-trial-23';
    const fresh = trialBirth({root, ivInheritance: {count: 0}}).child.ivs;
    assert.ok(Object.values(fresh).every(value => value < 30));
    const copied = child => Object.values(child.ivs).filter(value => value >= 30);
    assert.equal(copied(trialBirth({root}).child).length, 3);
    assert.equal(copied(trialBirth({root, ivInheritance: {count: 5}}).child).length, 5);
    assert.throws(() => trialBirth({ivInheritance: {count: 0, guaranteed: {stat: 'woolYield', parent: 0}}}), /Invalid individual-value inheritance/);
});

test('juvenile expression and an inherited IV change when a saved lamb can be clipped', () => {
    const genome = {...trialGenome, development: {expressed: {locus: 'vigor', minutesPerLevel: 1},
        iv: {stat: 'recovery', perMinute: 30}}};
    const birth = (count, developmentConditions = []) => trialBirth({genome, firstVigor: ['V', 'V'],
        root: 'meadow-trial-23', developmentConditions, ivInheritance: count
            ? {count, guaranteed: {stat: 'recovery', parent: 0}} : {count}});
    const plain = birth(0, ['starved']), expressed = birth(0), aided = birth(1, ['starved']), both = birth(1);
    assert.deepEqual(plain.child.genes, both.child.genes);
    assert.equal(aided.child.ivs.recovery, 31);
    assert.deepEqual([plain, expressed, aided, both].map(({child}) => child.matureAt), [5, 3, 4, 2]);
    assert.equal(planMeadowFleece(plain.id, plain.child, 5, {genome, clock: 3}).ok, false);
    assert.equal(planMeadowFleece(aided.id, aided.child, 5, {genome, clock: 3}).ok, false);
    assert.equal(planMeadowFleece(plain.id, plain.child, 5, {genome, clock: 4}).ok, false);
    assert.ok(Object.values(harvest(aided, genome, 4))[0] >= 5);
    assert.ok(Object.values(harvest(expressed, genome, 3))[0] >= 5);
    assert.ok(Object.values(harvest(both, genome, 2))[0] >= 5);
    assert.throws(() => validateGenome({...genome, development: {iv: {stat: 'unlisted', perMinute: 30}}}), /Development needs/);
});

test('interrupted juvenile care delays the first clip until growth resumes after healing', () => {
    const genome = {...trialGenome, development: {pauseWhileInjured: true}};
    const {id, lifecycle} = trialBirth({genome});
    const wounded = injureCreature(lifecycle, {revision: lifecycle.revision, id, clock: 3, kind: 'sprain', recoveryMinutes: 2});
    const care = (life, clock) => startCreatureCare(life, {revision: life.revision, id, clock, keeper: 'player', duration: 2});
    const settle = (life, clock, interrupted = false) =>
        settleCreatureCare(life, {revision: life.revision, id, clock, interrupted});
    const first = care(wounded, 3);
    const interrupted = settle(roundTrip(first), 4, true);
    const resumed = care(roundTrip(interrupted), 6);
    const saved = roundTrip(resumed);
    const finish = life => settle(life, 9).individuals[id];
    assert.deepEqual(finish(saved), finish(resumed));
    assert.equal(finish(saved).health.injury.healedAt, 7);
    assert.equal(finish(saved).matureAt, 9);
    assert.equal(planMeadowFleece(id, wounded.individuals[id], 5, {genome, clock: 9}).ok, false);
    assert.equal(planMeadowFleece(id, saved.individuals[id], 5, {genome, clock: 8}).ok, false);
    assert.deepEqual(harvest({id, child: saved.individuals[id]}, genome, 9),
        harvest({id, child: finish(saved)}, genome, 9));
    assert.ok(Object.values(harvest({id, child: roundTrip(first).individuals[id]}, genome, 7))[0] >= 5);
    assert.ok(Object.values(harvest({id, child: lifecycle.individuals[id]}, genome, 5))[0] >= 5);
    const adultWound = injureCreature(lifecycle, {revision: lifecycle.revision, id, clock: 5, kind: 'sprain', recoveryMinutes: 2});
    assert.equal(settle(adultWound, 7).individuals[id].matureAt, 5);
});

test('paid feeding advances a saved juvenile body toward its first Lantern clip', () => {
    const genome = {...LANTERN_FLEECE_GENOME, development: {pauseWhileInjured: true}};
    const {id, child, lifecycle} = trialBirth({genome});
    const growth = JUVENILE_GROWTH.id, hay = 'stock:meadow-hay', charge = 'energy:lantern-charge';
    const wool = 'stock:fine-wool';
    const config = {packs: ['l.living_body', LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK],
        host: {laws: [LANTERN_FLEECE_LAW], ports: {readThing: lanternBodyReader(lifecycle, registry)}}};
    const start = createEngineWorld({...config, clock: 2, holders: [
        {id: 'pen', kind: 'place'},
        {id, kind: 'body', place: 'pen', tags: ['living.body'], refs: {creature: id},
            state: {'l.living_body': livingBodyState({species: 'sheep', rate: 1})},
            properties: lanternCoatProperties(child), quantities: {satiety: 1, [growth]: child.matureAt - child.bornAt, [charge]: 0}},
        {id: 'player', kind: 'body', place: 'pen', quantities: {[hay]: 1}},
        {id: 'basket', kind: 'thing', place: 'pen', quantities: {[wool]: 0, 'stock:wool': 0, [charge]: 0}},
    ]});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const at = (engine, minute) => advanceEngineWorld(engine, minute).engine;
    const work = (engine, idWork, method, role, holder) => startEngineWorking(engine, {id: idWork, law: LANTERN_FLEECE_LAW, method,
        bindings: {animal: {kind: 'body', id}, [role]: holder}});
    const feed = engine => work(engine, 'feed', LANTERN_FEED, 'keeper', {kind: 'body', id: 'player'});
    const clip = (engine, idWork) => work(engine, idWork, LANTERN_CLIP, 'wool', {kind: 'thing', id: 'basket'});
    const continuouslyFed = at(clip(at(feed(start), 4), 'first-clip'), 5);
    assert.equal(continuouslyFed.world.holders.basket.quantities[wool], 7);
    const hungry = at(start, 5);
    assert.equal(hungry.world.holders[id].quantities[growth], 2);
    const noHay = applyEngineOps(hungry, [{op: 'add', holder: 'player', quantity: hay, amount: -1}], 'hay-used-elsewhere');
    assert.equal(at(feed(noHay), 6).records.workings.feed.record.receipts[0].reason, 'lantern-feed-unavailable');
    const pending = feed(restore(hungry));
    const fed = at(restore(pending), 6);
    assert.equal(fed.world.holders.player.quantities[hay], 0);
    const early = at(clip(fed, 'early-clip'), 7);
    assert.equal(early.records.workings['early-clip'].record.receipts[0].reason, 'lantern-coat-regrowing');
    assert.equal(early.world.holders.basket.quantities[wool], 0);
    const due = clip(early, 'late-clip');
    const settled = at(restore(due), 8);
    assert.deepEqual(serializeEngineWorld(settled), serializeEngineWorld(at(due, 8)));
    assert.equal(settled.world.holders[id].quantities[growth], 0);
    assert.equal(settled.world.holders.basket.quantities[wool], 7);

    const wound = injureCreature(lifecycle, {revision: lifecycle.revision, id, clock: 2, kind: 'sprain', recoveryMinutes: 2});
    const care = startCreatureCare(wound, {revision: wound.revision, id, clock: 2, keeper: 'player', duration: 2});
    const advancePaired = (engine, lifecycle, minute) => advanceLanternSpeciesClock({engine, lifecycle}, minute, {});
    // The first meal expires during treatment. Neither the overlap nor the
    // subsequent healed but unfed interval pays any of the growth requirement.
    const midway = advancePaired(start, care, 3);
    const delayed = advancePaired(restore(midway.engine), roundTrip(care), 5);
    assert.deepEqual(serializeEngineWorld(delayed.engine), serializeEngineWorld(advancePaired(start, care, 5).engine));
    const healedBoundary = advancePaired(start, care, 4);
    assert.deepEqual(serializeEngineWorld(delayed.engine),
        serializeEngineWorld(advancePaired(restore(healedBoundary.engine), roundTrip(care), 5).engine));
    assert.equal(delayed.engine.world.holders[id].quantities[growth], 3);
    assert.equal(delayed.engine.world.holders[id].quantities.satiety, 0);
    const treated = advancePaired(restore(feed(delayed.engine)), roundTrip(care), 6);
    const refused = advancePaired(clip(treated.engine, 'wounded-early'), treated.lifecycle, 8);
    assert.equal(refused.engine.records.workings['wounded-early'].record.receipts[0].reason, 'lantern-coat-regrowing');
    const ready = advancePaired(restore(clip(refused.engine, 'wounded-ready')), roundTrip(refused.lifecycle), 9);
    assert.equal(ready.engine.world.holders.basket.quantities[wool], 7);
});

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
    for (const v of [a, b]) assert.ok(v.heightCm >= 60 && v.heightCm <= 75);
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

test('mixed linkage maps produce a saved hybrid with a different clip and enforce fertility', () => {
    const {ivs, ...left} = trialGenome;
    const right = validateGenome({...left, id: 'ridge-sheep', linkage: [{loci: ['coat', 'fleece'], crossovers: [500]}],
        loci: {...left.loci,
            crimp: {mode: 'dominant', strong: 'C', plain: 'c', contributions: {'fleece.yield': 2}},
            curl: {mode: 'dominant', strong: 'R', plain: 'r'},
        }});
    const hybrid = validateGenome({...hybridGenome(left, right, 'meadow-ridge-cross'), linkage: left.linkage});
    const habitat = {...pen, supportedSpecies: ['sheep', 'ridge-sheep', 'cross-sheep']};
    const stock = (state, id, species, delta = 1) => settleCohortStock(state, {revision: state.revision, id, species, habitat, delta});
    const seeded = stock(stock(stock(restoreCreatureLifecycle(), 'left', 'sheep'), 'right', 'ridge-sheep'), 'cross', 'cross-sheep');
    const acquire = (state, cohortId, genome, genes) => acquireCreature(state, {revision: state.revision, cohortId,
        destination: habitat, keeper: 'keeper', genome, genes, phased: true});
    const base = genes(['F', 'f'], ['D', 'd'], ['w', 'w'], ['v', 'v']);
    const first = acquire(seeded, 'left', left, base);
    const second = acquire(first.state, 'right', right, {...base, crimp: ['C', 'C'], curl: ['R', 'R']});
    const start = (state, parents, clock, genome, cross) => startCreatureBrood(state, {revision: state.revision,
        parents, clock, genome, cross, keeper: 'keeper', gestationMinutes: 2, growthMinutes: 3, root: 'mixed-maps-1'});
    const pair = [first.id, second.id];
    assert.throws(() => start(second.state, pair, 0, hybrid), /compatible adult stock/);
    assert.throws(() => start(second.state, pair, 0, hybrid,
        {origin: 'cross', parentGenomes: [left, {...right, family: 'other'}]}), /not viable/);
    const brood = start(second.state, pair, 0, hybrid, {origin: 'cross', parentGenomes: [left, right]});
    const saved = roundTrip(brood.state);
    const birth = state => settleCreatureBirth(state, {revision: state.revision, broodId: brood.id, clock: 2, destination: habitat});
    const born = birth(saved);
    assert.deepEqual(born, birth(brood.state));
    const lifecycle = roundTrip(born.state);
    const child = lifecycle.individuals[born.id];
    assert.equal(child.species, 'cross-sheep');
    assert.equal(child.sterile, true);
    assert.deepEqual(child.parents, pair);
    assert.deepEqual(child.genes.crimp, ['c', 'C']);
    assert.equal(child.genes.coat[0] === 'D', child.genes.fleece[0] === 'F');
    assert.notEqual(child.genes.coat[1] === 'D', child.genes.fleece[1] === 'F');
    assert.equal(child.phased, true);
    assert.deepEqual(harvest({id: born.id, child}, hybrid), {'stock:wool': 9});
    const noCrossover = start(second.state, pair, 0, hybrid,
        {origin: 'cross', parentGenomes: [left, {...right, linkage: left.linkage}]});
    const control = birth(roundTrip(noCrossover.state));
    assert.notDeepEqual(control.state.individuals[control.id].genes.fleece, child.genes.fleece);
    const plainParent = acquire(first.state, 'right', right, {...base, crimp: ['c', 'c'], curl: ['R', 'R']});
    const plainBrood = start(plainParent.state, pair, 0, hybrid, {origin: 'cross', parentGenomes: [left, right]});
    const plainBirth = birth(roundTrip(plainBrood.state));
    assert.deepEqual(harvest({id: plainBirth.id, child: plainBirth.state.individuals[plainBirth.id]}, hybrid), {'stock:wool': 5});
    const kind = {...BEACON_SHEEP_KIND, id: child.species, genome: hybrid.id};
    const kinds = livingKindRegistry({extra: [kind], genomes: {...LIVING_GENOMES, [hybrid.id]: hybrid}});
    assert.equal(readLivingBody({lifecycle, registry: kinds, id: born.id, clock: 5}).sterile, true);
    const mate = acquire(lifecycle, 'cross', hybrid, child.genes);
    assert.throws(() => start(roundTrip(mate.state), [born.id, mate.id], 5, hybrid), /sterile/);

    const fertileMap = {...right, loci: Object.fromEntries(Object.entries(right.loci).filter(([id]) => id !== 'curl'))};
    const fertileGenome = hybridGenome(left, fertileMap, 'fertile-cross');
    const fertileParent = acquire(first.state, 'right', fertileMap, {...base, crimp: ['C', 'C']});
    const fertile = start(fertileParent.state, pair, 0, fertileGenome, {origin: 'cross', parentGenomes: [left, fertileMap]});
    const young = birth(roundTrip(fertile.state));
    assert.equal(young.state.individuals[young.id].sterile, undefined);
    const peer = acquire(young.state, 'cross', fertileGenome, young.state.individuals[young.id].genes);
    assert.ok(start(roundTrip(peer.state), [young.id, peer.id], 5, fertileGenome).id);
});

test('tracked wild mating avoids close kin when a mature unrelated mate is available', () => {
    const {ivs, ...linked} = trialGenome;
    const genome = {...linked, inbreeding: {growthMinutesAtFull: 40}};
    const id = 'tracked', habitat = {...pen, capacity: 12};
    const fine = genes(['F', 'F'], ['d', 'd'], ['w', 'w'], ['v', 'v']);
    const seed = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id, species: 'sheep', habitat,
        genome, genes: fine, delta: 3});
    const take = (state, keeper, clock = 0) => acquireCreature(state, {revision: state.revision,
        cohortId: id, destination: habitat, keeper, clock, genome, root: 'tracked'});
    const sire = take(seed, 'keeper'), dam = take(sire.state, 'keeper');
    const sibling = (state, clock) => {
        const brood = startCreatureBrood(state, {revision: state.revision, parents: [sire.id, dam.id], keeper: 'keeper',
            clock, genome, root: 'siblings', gestationMinutes: 1, growthMinutes: 0});
        const born = settleCreatureBirth(brood.state, {revision: brood.state.revision,
            broodId: brood.id, clock: clock + 1, destination: habitat});
        return {...born, state: transferCreature(born.state, {revision: born.state.revision,
            id: born.id, fromKeeper: 'keeper', toKeeper: null, destination: habitat, clock: clock + 1})};
    };
    const first = sibling(dam.state, 0), second = sibling(first.state, 1);
    const stranger = take(second.state, null, 2);
    const open = state => openWildHabitat(state, {revision: state.revision, id: habitat.id, clock: 2, interval: 2});
    const advance = (state, clock, maxKinship = 1, capacity = habitat.capacity, losses = 0, root = 'wild-pair') => advanceWildHabitat(state, {
        revision: state.revision, habitat: {...habitat, capacity}, clock,
        populations: [{id, births: 1, losses, genome, root,
            pedigree: {gestationMinutes: 2, growthMinutes: 3, maxKinship}}],
    }).state;
    const loneFamily = open(second.state);
    assert.deepEqual(advance(loneFamily, 4, 0.125).broods, {});
    const withStranger = open(stranger.state);
    const pending = roundTrip(advance(withStranger, 4));
    assert.deepEqual(Object.values(pending.broods)[0].parents, [first.id, stranger.id]);
    assert.equal(Object.values(pending.broods)[0].growthMinutes, 3);
    assert.equal(advance(pending, 6, 1, 5).habitats[habitat.id].births, 0);
    const mixed = advance(pending, 6);
    assert.deepEqual(mixed, advance(withStranger, 6));
    assert.equal(mixed.habitats[habitat.id].births, 1);
    const related = advance(roundTrip(advance(loneFamily, 4)), 6);
    const child = state => Object.entries(roundTrip(state).individuals)
        .filter(([, animal]) => animal.bornAt === 6).map(([id, child]) => ({id, child}))[0];
    assert.deepEqual(child(related).child.parents, [first.id, second.id]);
    assert.equal(child(related).child.matureAt, 19);
    assert.equal(planMeadowFleece(child(related).id, child(related).child, 5, {genome, clock: 9}).ok, false);
    assert.deepEqual(harvest(child(mixed), genome, 9), {'stock:fine-wool': 5});
    assert.deepEqual(harvest(child(related), genome, 19), {'stock:fine-wool': 5});

    const carrierLost = roundTrip(advance(pending, 6, 0.125, 4, 1, 'loss-1'));
    assert.equal(carrierLost.individuals[first.id].deadAt, 6);
    assert.deepEqual(carrierLost.individuals[first.id].parents, [sire.id, dam.id]);
    assert.equal(habitatOccupancy(carrierLost, habitat.id), 4);
    assert.equal(carrierLost.habitats[habitat.id].losses, 1);
    assert.equal(carrierLost.habitats[habitat.id].births, 0);
    assert.deepEqual(carrierLost.broods, {});
    assert.equal(planMeadowFleece(first.id, carrierLost.individuals[first.id], 5, {genome, clock: 6}).ok, false);
    assert.equal(readLivingBody({lifecycle: carrierLost, registry, id: first.id, clock: 6}).vitality.value, 0);
    assert.throws(() => transferCreature(carrierLost, {revision: carrierLost.revision, id: first.id,
        fromKeeper: null, toKeeper: 'keeper', destination: habitat, clock: 6}), /custody/);

    const sireLost = roundTrip(advance(pending, 6, 1, 4, 1, 'loss-0'));
    assert.equal(sireLost.individuals[stranger.id].deadAt, 6);
    const resumed = advance(sireLost, 8);
    assert.equal(resumed.habitats[habitat.id].births, 1);
    const newborn = Object.values(roundTrip(resumed).individuals).find(animal => animal.bornAt === 8);
    assert.deepEqual(newborn.parents, [first.id, stranger.id]);
    assert.equal(habitatOccupancy(resumed, habitat.id), 5);
    assert.equal(advance(roundTrip(sireLost), 8, 1, 4, 1, 'loss-0').habitats[habitat.id].losses, 1);

    const config = {packs: ['w.sky', 'l.living_body', MEADOW_GRAZING_PACK.id], ownPacks: [MEADOW_GRAZING_PACK],
        shared: {quantities: [WORLD_QUANTITIES.vitality]}};
    const engine = createEngineWorld({...config, drawRoot: 'loss-0', clock: 2, holders: [
        {id: habitat.id, kind: 'place', quantities: {[MEADOW_FORAGE]: 0}},
        {id, kind: 'cohort', place: habitat.id, refs: {herd: id}, count: 0},
        ...Object.keys(withStranger.individuals).map(id => ({id, kind: 'body', place: habitat.id,
            refs: {creature: id}, quantities: {vitality: 20}})),
    ]});
    const save = ({engine, lifecycle}) => JSON.parse(JSON.stringify({engine: serializeEngineWorld(engine), lifecycle}));
    const restore = pair => {
        const saved = save(pair);
        return {engine: restoreEngineWorld(saved.engine, config), lifecycle: restoreCreatureLifecycle(saved.lifecycle)};
    };
    const bound = (pair, clock, capacity = habitat.capacity, losses = 0, maxKinship = 1) => advancePhasedWorldHerds(pair, {
        revision: pair.lifecycle.revision, habitat: {...habitat, capacity}, clock,
        populations: [{id, births: 1, losses, genome, pedigree: {gestationMinutes: 2, growthMinutes: 3, maxKinship},
            world: {birthRow: 'wild.birth', lossRow: 'wild.loss', perBirth: {vitality: 12}}}],
    });
    const paired = bound({engine, lifecycle: withStranger}, 4);
    const growth = JUVENILE_GROWTH.id;
    const hungryMate = applyEngineOps(engine, [
        {op: 'holder_remove', holder: stranger.id},
        {op: 'holder_add', value: {id: stranger.id, kind: 'body', place: habitat.id, refs: {creature: stranger.id},
            tags: ['living.body', 'meadow-grazer'], quantities: {vitality: 20, satiety: 0, [growth]: 1},
            state: {'l.living_body': livingBodyState({species: 'sheep', rate: 1})}}},
    ], 'wild-juvenile-body');
    const waiting = bound(restore({engine: hungryMate, lifecycle: withStranger}), 4);
    assert.equal(waiting.engine.world.holders[stranger.id].quantities[growth], 1);
    assert.deepEqual(Object.values(waiting.lifecycle.broods).map(brood => brood.parents), [[first.id, second.id]]);
    const delayed = bound(restore({engine: hungryMate, lifecycle: withStranger}), 4, habitat.capacity, 0, 0.125);
    assert.deepEqual(delayed.lifecycle.broods, {});
    const patch = {...delayed, engine: applyEngineOps(delayed.engine, [
        {op: 'holder_add', value: {id: 'forage-patch', kind: 'place', quantities: {[MEADOW_FORAGE]: 1}}},
        {op: 'property', holder: stranger.id, property: GRAZING_HOME, value: habitat.id},
        {op: 'link_add', link: {id: 'grazing-trail', kind: 'grazing-path', from: habitat.id, to: 'forage-patch'}},
    ], 'neighboring-forage')};
    const closed = {...patch, engine: applyEngineOps(patch.engine,
        [{op: 'link_set', id: 'grazing-trail', state: 'closed'}], 'closed-trail')};
    const stayed = bound(restore(closed), 8, habitat.capacity, 0, 0.125);
    assert.equal(stayed.engine.world.holders[stranger.id].place, habitat.id);
    assert.equal(stayed.engine.world.holders['forage-patch'].quantities[MEADOW_FORAGE], 1);
    assert.deepEqual(stayed.lifecycle.broods, {});
    const away = bound(patch, 6, habitat.capacity, 0, 0.125);
    assert.equal(away.engine.world.holders[stranger.id].place, 'forage-patch');
    assert.equal(away.engine.world.holders['forage-patch'].quantities[MEADOW_FORAGE], 0);
    assert.deepEqual(away.lifecycle.broods, {});
    const home = bound(restore(away), 8, habitat.capacity, 0, 0.125);
    assert.deepEqual(save(home), save(bound(patch, 8, habitat.capacity, 0, 0.125)));
    assert.equal(home.engine.world.holders[stranger.id].place, habitat.id);
    assert.deepEqual(Object.values(home.lifecycle.broods).map(brood => brood.parents), [[first.id, stranger.id]]);
    const returnedYoung = bound(restore(home), 10, habitat.capacity, 0, 0.125);
    const [returnedId, returnedLamb] = Object.entries(returnedYoung.lifecycle.individuals)
        .find(([, animal]) => animal.bornAt === 10);
    assert.deepEqual(harvest({id: returnedId, child: returnedLamb}, genome, 13), {'stock:fine-wool': 5});
    const farther = {...patch, engine: applyEngineOps(patch.engine, [
        {op: 'holder_add', value: {id: 'ridge', kind: 'place'}},
        {op: 'link_set', id: 'grazing-trail', to: 'ridge'},
        {op: 'link_add', link: {id: 'ridge-trail', kind: 'grazing-path', from: 'ridge', to: 'forage-patch'}},
    ], 'farther-forage')};
    const strict = (pair, minute) => bound(pair, minute, habitat.capacity, 0, 0.125);
    assert.equal(strict(farther, 6).engine.world.holders[stranger.id].place, habitat.id);
    const ranged = {...farther, engine: applyEngineOps(farther.engine,
        [{op: 'property', holder: stranger.id, property: GRAZING_RANGE, value: 2}], 'longer-grazing-range')};
    const ridge = strict(ranged, 5);
    assert.equal(ridge.engine.world.holders[stranger.id].place, 'ridge');
    const blockedRidge = {...ridge, engine: applyEngineOps(ridge.engine,
        [{op: 'link_set', id: 'ridge-trail', state: 'closed'}], 'ridge-trail-closed')};
    const backEmpty = strict(restore(blockedRidge), 6);
    assert.equal(backEmpty.engine.world.holders[stranger.id].place, habitat.id);
    assert.equal(backEmpty.engine.world.holders['forage-patch'].quantities[MEADOW_FORAGE], 1);
    assert.deepEqual(backEmpty.lifecycle.broods, {});
    const onPatch = strict(restore(ridge), 8);
    assert.equal(onPatch.engine.world.holders[stranger.id].place, 'ridge');
    assert.equal(onPatch.engine.world.holders['forage-patch'].quantities[MEADOW_FORAGE], 0);
    assert.deepEqual(onPatch.lifecycle.broods, {});
    const afterTrip = strict(restore(onPatch), 10);
    assert.deepEqual(save(afterTrip), save(strict(ranged, 10)));
    assert.equal(afterTrip.engine.world.holders[stranger.id].place, habitat.id);
    assert.deepEqual(Object.values(afterTrip.lifecycle.broods)[0].parents, [first.id, stranger.id]);
    const afterBirth = strict(restore(afterTrip), 12);
    const [tripId, tripLamb] = Object.entries(afterBirth.lifecycle.individuals).find(([, animal]) => animal.bornAt === 12);
    assert.deepEqual(harvest({id: tripId, child: tripLamb}, genome, 15), {'stock:fine-wool': 5});
    const dueTrip = {...paired, engine: applyEngineOps(paired.engine, [
        {op: 'holder_add', value: {id: 'forage-patch', kind: 'place', quantities: {[MEADOW_FORAGE]: 1}}},
        {op: 'link_add', link: {id: 'grazing-trail', kind: 'grazing-path', from: habitat.id, to: 'forage-patch'}},
        {op: 'move', holder: first.id, to: 'forage-patch'},
        {op: 'property', holder: first.id, property: GRAZING_HOME, value: habitat.id},
    ], 'carrier-visits-patch')};
    const postponed = bound(restore(dueTrip), 6);
    assert.equal(postponed.lifecycle.habitats[habitat.id].births, 0);
    assert.equal(Object.values(postponed.lifecycle.broods)[0].dueAt, 6);
    const carrierHome = {...postponed, engine: applyEngineOps(postponed.engine,
        [{op: 'move', holder: first.id, to: habitat.id}], 'carrier-returns')};
    assert.equal(bound(restore(carrierHome), 8).lifecycle.habitats[habitat.id].births, 1);
    const provision = pair => ({...pair, engine: applyEngineOps(pair.engine,
        [{op: 'add', holder: habitat.id, quantity: MEADOW_FORAGE, amount: 1}], 'meadow-forage')});
    const supplied = provision(delayed);
    const grazing = bound(restore(supplied), 5, habitat.capacity, 0, 0.125);
    assert.equal(grazing.engine.world.holders[habitat.id].quantities[MEADOW_FORAGE], 0);
    assert.equal(grazing.engine.world.holders[stranger.id].quantities.satiety, 4);
    assert.equal(grazing.engine.world.holders[stranger.id].quantities[growth], 1);
    const contested = {...supplied, engine: applyEngineOps(supplied.engine, [{
        op: 'holder_add', value: {id: 'another-grazer', kind: 'body', place: habitat.id,
            tags: ['living.body', 'meadow-grazer'], quantities: {satiety: 0},
            state: {'l.living_body': livingBodyState({species: 'sheep', rate: 1})}},
    }], 'second-grazer')};
    const competed = bound(restore(contested), 6, habitat.capacity, 0, 0.125);
    assert.equal(competed.engine.world.holders[habitat.id].quantities[MEADOW_FORAGE], 0);
    assert.equal(competed.engine.world.holders['another-grazer'].quantities.satiety, 3);
    assert.equal(competed.engine.world.holders[stranger.id].quantities[growth], 1);
    assert.deepEqual(competed.lifecycle.broods, {});
    const laterPair = bound(restore(grazing), 6, habitat.capacity, 0, 0.125);
    assert.deepEqual(save(laterPair), save(bound(supplied, 6, habitat.capacity, 0, 0.125)));
    assert.deepEqual(Object.values(laterPair.lifecycle.broods).map(brood => brood.parents), [[first.id, stranger.id]]);
    assert.equal(Object.values(laterPair.lifecycle.broods)[0].dueAt, 8);
    const fedPair = provision({engine: hungryMate, lifecycle: withStranger});
    const maturePair = bound(restore(fedPair), 4);
    assert.deepEqual(save(maturePair), save(bound(fedPair, 4)));
    assert.equal(maturePair.engine.world.holders[stranger.id].quantities[growth], 0);
    assert.deepEqual(Object.values(maturePair.lifecycle.broods).map(brood => brood.parents), [[first.id, stranger.id]]);
    const young = bound(restore(maturePair), 6);
    const [youngId, lamb] = Object.entries(young.lifecycle.individuals).find(([, animal]) => animal.bornAt === 6);
    assert.deepEqual(readLineage(young.engine.world, youngId)[0].parents, [first.id, stranger.id]);
    assert.deepEqual(harvest({id: youngId, child: lamb}, genome, 9), {'stock:fine-wool': 5});
    const autumn = (90 * 24 - 8) * 60;
    const seasonalHerd = clock => {
        const holders = Object.values(hungryMate.world.holders).map(holder => holder.id === habitat.id ? {
            ...holder, tags: ['sky'], quantities: {...skyQuantities(clock), [MEADOW_FORAGE]: 0},
            properties: {'meadow-forage-capacity': 1},
        } : holder);
        return {engine: createEngineWorld({...config, clock, holders, drawRoot: 'loss-0'}),
            lifecycle: openWildHabitat(stranger.state, {revision: stranger.state.revision, id: habitat.id, clock, interval: 2})};
    };
    const summer = seasonalHerd(autumn - 2);
    const beforeAutumn = bound(summer, autumn - 1, habitat.capacity, 0, 0.125);
    assert.equal(beforeAutumn.engine.world.holders[stranger.id].quantities.satiety, 4);
    const autumnPair = bound(restore(beforeAutumn), autumn, habitat.capacity, 0, 0.125);
    assert.deepEqual(save(autumnPair), save(bound(summer, autumn, habitat.capacity, 0, 0.125)));
    assert.equal(autumnPair.engine.world.holders[habitat.id].quantities.season, 2);
    assert.equal(autumnPair.engine.world.holders[habitat.id].quantities[MEADOW_FORAGE], 1);
    assert.deepEqual(Object.values(autumnPair.lifecycle.broods).map(brood => brood.parents), [[first.id, stranger.id]]);
    const dry = bound(restore(seasonalHerd(autumn)), autumn + 2, habitat.capacity, 0, 0.125);
    assert.equal(dry.engine.world.holders[stranger.id].quantities[growth], 1);
    assert.equal(dry.engine.world.holders[habitat.id].quantities[MEADOW_FORAGE], 0);
    assert.deepEqual(dry.lifecycle.broods, {});
    const seasonalYoung = bound(restore(autumnPair), autumn + 2);
    const [seasonalId, seasonalLamb] = Object.entries(seasonalYoung.lifecycle.individuals)
        .find(([, animal]) => animal.bornAt === autumn + 2);
    assert.deepEqual(readLineage(seasonalYoung.engine.world, seasonalId)[0].parents, [first.id, stranger.id]);
    assert.deepEqual(harvest({id: seasonalId, child: seasonalLamb}, genome, autumn + 5), {'stock:fine-wool': 5});
    const missingBody = {...paired, engine: applyEngineOps(paired.engine, [{op: 'holder_remove', holder: stranger.id}], 'missing-body')};
    assert.throws(() => bound(restore(missingBody), 6, 4, 1), /must agree before retirement/);
    const lost = bound(restore(paired), 6, 4, 1);
    assert.equal(lost.lifecycle.individuals[stranger.id].deadAt, 6);
    assert.equal(lost.engine.world.holders[stranger.id], undefined);
    assert.equal(lost.engine.world.rows['wild.loss'].vitality, 20);
    assert.equal(lost.engine.world.holders[id].count, 0);
    const arrived = bound(restore(lost), 8);
    assert.deepEqual(save(arrived), save(bound(lost, 8)));
    const actual = Object.entries(arrived.lifecycle.individuals).find(([, animal]) => animal.bornAt === 8);
    const [childId, wildChild] = actual;
    assert.deepEqual(readLineage(arrived.engine.world, childId)[0].parents, [first.id, stranger.id]);
    assert.deepEqual(readLineage(arrived.engine.world, stranger.id).map(row => row.act), ['end', 'create']);
    assert.equal(arrived.engine.world.holders[childId].refs.creature, childId);
    assert.equal(arrived.engine.world.holders[childId].quantities.vitality, 12);
    assert.equal(arrived.engine.world.rows['wild.birth'].vitality, -12);
    assert.deepEqual(harvest({id: childId, child: wildChild}, genome, 11), {'stock:fine-wool': 5});
    const duplicate = {...lost, engine: applyEngineOps(lost.engine, [{op: 'holder_add',
        value: {id: childId, kind: 'thing', place: habitat.id}}], 'occupied-id')};
    assert.throws(() => bound(duplicate, 8), /could not create/);
    assert.equal(duplicate.lifecycle.individuals[childId], undefined);
});

test('relocating a wild parent preserves its identity and linked harvest in the receiving herd', () => {
    const {ivs, ...genome} = trialGenome;
    const firstHome = {...pen, capacity: 8};
    const secondHome = {...firstHome, id: 'east-meadow'};
    const homes = [[firstHome, 'west-herd'], [secondHome, 'east-herd']];
    const fine = genes(['F', 'F'], ['d', 'd'], ['w', 'w'], ['v', 'v']);
    let lifecycle = restoreCreatureLifecycle();
    const parents = [];
    for (const [habitat, cohortId] of homes) {
        lifecycle = settleCohortStock(lifecycle, {revision: lifecycle.revision, id: cohortId,
            species: 'sheep', habitat, genome, genes: fine, delta: 1});
        const adult = acquireCreature(lifecycle, {revision: lifecycle.revision, cohortId, destination: habitat,
            keeper: null, clock: 0, genome, root: 'wild-relocation'});
        parents.push(adult.id);
        lifecycle = openWildHabitat(adult.state, {revision: adult.state.revision, id: habitat.id, clock: 0, interval: 2});
    }
    const [moving, resident] = parents;
    const config = {packs: [MEADOW_GRAZING_PACK.id], ownPacks: [MEADOW_GRAZING_PACK]};
    const engine = createEngineWorld({...config, drawRoot: 'wild-relocation', holders: homes.flatMap(([habitat, herd], i) => [
        {id: habitat.id, kind: 'place'}, {id: herd, kind: 'cohort', place: habitat.id, count: 0, refs: {herd}},
        {id: parents[i], kind: 'body', place: habitat.id, refs: {creature: parents[i]},
            properties: {[GRAZING_HOME]: habitat.id}},
    ]), links: [{id: 'east-trail', kind: 'grazing-path', from: firstHome.id, to: secondHome.id}]});
    const relocate = (pair, destination = secondHome) => relocateTrackedWorldCreature(pair, {
        revision: pair.lifecycle.revision, id: moving, cohortId: 'east-herd', destination,
    });
    const closed = applyEngineOps(engine, [{op: 'link_set', id: 'east-trail', state: 'closed'}], 'close-east-trail');
    assert.throws(() => relocate({engine: closed, lifecycle}), /open grazing path/);
    assert.throws(() => relocate({engine, lifecycle}, {...secondHome, capacity: 1}), /insufficient space/);

    const saved = ({engine, lifecycle}) => JSON.parse(JSON.stringify({engine: serializeEngineWorld(engine), lifecycle}));
    const restore = pair => {
        const data = saved(pair);
        return {engine: restoreEngineWorld(data.engine, config), lifecycle: restoreCreatureLifecycle(data.lifecycle)};
    };
    const moved = restore(relocate({engine, lifecycle}));
    const adult = moved.lifecycle.individuals[moving];
    assert.equal(adult.origin, 'west-herd');
    assert.equal(adult.wildHerd, 'east-herd');
    assert.deepEqual(adult.genes, lifecycle.individuals[moving].genes);
    assert.equal(moved.engine.world.holders[moving].place, secondHome.id);
    assert.equal(moved.engine.world.holders[moving].properties[GRAZING_HOME], secondHome.id);
    assert.equal(moved.engine.world.holders[moving].refs.creature, moving);

    const advance = (pair, clock, [habitat, herd] = homes[1]) => advancePhasedWorldHerds(pair, {
        revision: pair.lifecycle.revision, habitat, clock,
        populations: [{id: herd, births: 1, losses: 0, genome,
            pedigree: {gestationMinutes: 2, growthMinutes: 3, maxKinship: 0},
            world: {birthRow: `${herd}.birth`, lossRow: `${herd}.loss`}}],
    });
    assert.deepEqual(advance({engine, lifecycle}, 2).lifecycle.broods, {});
    const paired = restore(advance(moved, 2));
    assert.deepEqual(Object.values(paired.lifecycle.broods)[0].parents, [moving, resident]);
    const headWest = (pair, id) => relocateTrackedWorldCreature(pair, {revision: pair.lifecycle.revision,
        id, destination: firstHome, cohortId: 'west-herd'});
    assert.throws(() => headWest(paired, moving), /both wild habitat clocks/);
    const born = restore(advance(paired, 4));
    assert.deepEqual(saved(born), saved(advance(moved, 4)));
    const [id, lamb] = Object.entries(born.lifecycle.individuals).find(([, animal]) => animal.bornAt === 4);
    assert.equal(lamb.origin, 'east-herd');
    assert.deepEqual(lamb.parents, [moving, resident]);
    assert.equal(born.engine.world.holders[id].place, secondHome.id);
    assert.deepEqual(harvest({id, child: lamb}, genome, 7), {'stock:fine-wool': 5});

    const synchronized = advance(paired, 2, homes[0]);
    assert.throws(() => relocateTrackedWorldCreature(synchronized, {revision: synchronized.lifecycle.revision,
        id: moving, destination: firstHome, cohortId: 'west-herd', birthCohortId: 'east-herd'}),
    /compatible offspring cohort/);
    const carrying = restore(headWest(synchronized, moving));
    const [broodId, before] = Object.entries(paired.lifecycle.broods)[0];
    assert.deepEqual(carrying.lifecycle.broods[broodId], {...before, wild: 'west-herd', origin: 'west-herd'});
    const eastWindow = advance(carrying, 4);
    assert.equal(eastWindow.lifecycle.habitats[secondHome.id].births, 0);
    const westBirth = restore(advance(restore(eastWindow), 4, homes[0]));
    const relocatedLamb = westBirth.lifecycle.individuals[id];
    assert.equal(westBirth.lifecycle.habitats[firstHome.id].births, 1);
    assert.equal(westBirth.engine.world.holders[id].place, firstHome.id);
    assert.deepEqual(relocatedLamb, {...lamb, origin: 'west-herd', habitat: firstHome.id});
    assert.deepEqual(harvest({id, child: relocatedLamb}, genome, 7), {'stock:fine-wool': 5});
    const westFirst = advance(advance(carrying, 4, homes[0]), 4);
    assert.deepEqual(saved(westBirth), saved(westFirst));

    const otherParentLeft = restore(headWest(synchronized, resident));
    assert.deepEqual(otherParentLeft.lifecycle.broods[broodId], before);
    assert.deepEqual(advance(otherParentLeft, 4).lifecycle.individuals[id], lamb);

    const legacy = saved(synchronized);
    delete legacy.lifecycle.broods[broodId].origin;
    const legacyPair = {engine: synchronized.engine, lifecycle: restoreCreatureLifecycle(legacy.lifecycle)};
    const legacyOtherParentLeft = restore(headWest(legacyPair, resident));
    assert.deepEqual(advance(legacyOtherParentLeft, 4).lifecycle.individuals[id], lamb);
});

test('tracked wild crosses select an unrelated parent across herds and save the hybrid brood', () => {
    const {ivs, ...left} = trialGenome;
    const right = {...left, id: 'tracked-ridge', linkage: [{loci: ['coat', 'fleece'], crossovers: [500]}],
        loci: {...left.loci, fleece: {...left.loci.fleece, strong: 'Y', plain: 'y',
            shows: {needs: {quantity: 'humidity', min: 60}}},
            crimp: {mode: 'dominant', strong: 'C', plain: 'c', contributions: {'fleece.yield': 2}}}};
    const hybrid = {...hybridGenome(left, right, 'tracked-hybrid'), linkage: left.linkage};
    const habitat = {...pen, capacity: 12, supportedSpecies: ['sheep', 'ridge-sheep', 'cross-sheep']};
    const fine = genes(['F', 'F'], ['d', 'd'], ['w', 'w'], ['v', 'v']);
    const stock = (state, id, species, delta) => settleCohortStock(state, {
        revision: state.revision, id, species, habitat, delta});
    const seed = stock(stock(stock(restoreCreatureLifecycle(), 'left', 'sheep', 2),
        'right', 'ridge-sheep', 1), 'cross', 'cross-sheep', 1);
    const take = (state, cohortId, genome, keeper, ridgeFleece = ['Y', 'Y']) => acquireCreature(state, {revision: state.revision,
        cohortId, destination: habitat, keeper, genome, genes: cohortId === 'right' ?
            {...fine, fleece: ridgeFleece, crimp: ['C', 'C']} : fine,
        phased: true});
    const ridge = take(seed, 'right', right, 'keeper');
    const meadow = take(ridge.state, 'left', left, 'keeper');
    const related = startCreatureBrood(meadow.state, {revision: meadow.state.revision, parents: [ridge.id, meadow.id],
        keeper: 'keeper', clock: 0, gestationMinutes: 1, growthMinutes: 0, root: 'known-cross', genome: left,
        cross: {origin: 'left', parentGenomes: [right, left]}});
    const born = settleCreatureBirth(related.state, {revision: related.state.revision,
        broodId: related.id, clock: 1, destination: habitat});
    const release = (state, id) => transferCreature(state, {revision: state.revision, id, fromKeeper: 'keeper',
        toKeeper: null, destination: habitat, clock: 1});
    const family = release(release(born.state, born.id), ridge.id);
    const stranger = take(family, 'left', left, null);
    const open = state => openWildHabitat(state, {revision: state.revision, id: habitat.id, clock: 1, interval: 2});
    const sources = [{id: 'left', genome: left}, {id: 'right', genome: right,
        alleleMap: {fleece: {locus: 'fleece', strong: 'F', plain: 'f'}}}];
    const policy = {id: 'cross', births: 1, losses: 0, genome: hybrid, root: 'tracked-cross',
        pedigree: {sources, maxKinship: 0.125, gestationMinutes: 2, growthMinutes: 3}};
    const advance = (state, clock, population = policy) => advanceWildHabitat(state,
        {revision: state.revision, habitat, clock, populations: [population]}).state;
    assert.deepEqual(advance(open(family), 3).broods, {});
    const start = open(stranger.state);
    assert.throws(() => advance(start, 3, {...policy, pedigree: {...policy.pedigree, sources: [sources[0], sources[0]]}}),
        /distinct local source herds/);
    const variant = alleleMap => ({...policy, pedigree: {...policy.pedigree,
        sources: [sources[0], {...sources[1], alleleMap}]}});
    assert.throws(() => advance(start, 3, variant({fleece: {locus: 'fleece', strong: 'X', plain: 'f'}})),
        /valid offspring symbols/);
    const pending = roundTrip(advance(start, 3));
    const [brood] = Object.values(pending.broods);
    assert.deepEqual(brood.parents, [stranger.id, ridge.id]);
    const after = advance(pending, 5);
    assert.deepEqual(after, advance(start, 5));
    const [id, child] = Object.entries(roundTrip(after).individuals).find(([, animal]) => animal.bornAt === 5);
    assert.deepEqual(child.parents, brood.parents);
    assert.deepEqual(child.parentSpecies, ['sheep', 'ridge-sheep']);
    assert.equal(child.species, 'cross-sheep');
    assert.equal(child.phased, true);
    assert.deepEqual(child.genes.crimp, ['c', 'C']);
    assert.deepEqual(harvest({id, child}, hybrid, 8), {'stock:fine-wool': 9});
    const fallback = advance(start, 5, variant(undefined));
    const [ordinaryId, ordinary] = Object.entries(roundTrip(fallback).individuals).find(([, animal]) => animal.bornAt === 5);
    assert.deepEqual(ordinary.genes.fleece, ['F', 'f']);
    assert.deepEqual(harvest({id: ordinaryId, child: ordinary}, hybrid, 8), {'stock:wool': 9});

    // The first unrelated ridge candidate carries ordinary fleece. The next
    // only outranks it when its own genome expresses fine fleece.
    const originalHeld = transferCreature(family, {revision: family.revision, id: ridge.id, fromKeeper: null,
        toKeeper: 'keeper', destination: habitat, clock: 1});
    const ordinaryRidge = take(stock(originalHeld, 'right', 'ridge-sheep', 1), 'right', right, null, ['y', 'y']);
    const fineRidge = take(stock(ordinaryRidge.state, 'right', 'ridge-sheep', 1), 'right', right, null);
    const unrelated = take(fineRidge.state, 'left', left, null);
    const crossStart = open(unrelated.state);
    const selectedPolicy = (humidity, selectionLocus = 'fleece') => ({...policy, environment: {humidity},
        pedigree: {...policy.pedigree, sources: [sources[0], {...sources[1], selectionLocus}]}});
    assert.throws(() => advance(crossStart, 3, selectedPolicy(60, 'unknown')), /locus in the source genome/);
    for (const [humidity, partner, wool] of [[59, ordinaryRidge.id, 'stock:wool'], [60, fineRidge.id, 'stock:fine-wool']]) {
        const rules = selectedPolicy(humidity);
        const paired = roundTrip(advance(crossStart, 3, rules));
        assert.deepEqual(Object.values(paired.broods)[0].parents, [unrelated.id, partner]);
        const settled = roundTrip(advance(paired, 5, rules));
        assert.deepEqual(settled, advance(crossStart, 5, rules));
        const [lambId, lamb] = Object.entries(settled.individuals).find(([, animal]) => animal.bornAt === 5);
        assert.deepEqual(harvest({id: lambId, child: lamb}, hybrid, 8), {[wool]: 9});
    }

    const destination = {...habitat, id: 'hybrid-refuge'};
    const emptyPhased = (state, id, genome) => {
        for (const delta of [1, -1]) state = settleCohortStock(state, {revision: state.revision,
            id, species: 'cross-sheep', habitat: destination, delta, genome, genes: child.genes});
        return state;
    };
    let lifecycle = settleCohortStock(pending, {revision: pending.revision, id: 'refuge-sheep',
        species: 'sheep', habitat: destination, delta: 1});
    lifecycle = emptyPhased(lifecycle, 'refuge-hybrids', hybrid);
    lifecycle = emptyPhased(lifecycle, 'other-hybrids', {...hybrid, id: 'other-hybrid-genome'});
    lifecycle = openWildHabitat(lifecycle, {revision: lifecycle.revision, id: destination.id, clock: 3, interval: 3});
    const config = {packs: ['l.living_body'], shared: {quantities: [WORLD_QUANTITIES.vitality]}};
    const engine = createEngineWorld({...config, clock: 3, drawRoot: policy.root, holders: [
        ...[habitat, destination].map(({id}) => ({id, kind: 'place'})),
        ...Object.entries(lifecycle.cohorts).map(([id, herd]) => ({id, kind: 'cohort',
            place: herd.habitat, count: herd.stock, refs: {herd: id}})),
        ...Object.entries(lifecycle.individuals).map(([id, animal]) => ({id, kind: 'body',
            place: animal.habitat, refs: {creature: id}})),
    ], links: [{id: 'refuge-trail', kind: 'grazing-path', from: habitat.id, to: destination.id}]});
    const relocate = birthCohortId => relocateTrackedWorldCreature({engine, lifecycle}, {revision: lifecycle.revision,
        id: stranger.id, destination, cohortId: 'refuge-sheep', birthCohortId});
    assert.throws(() => relocate(), /compatible offspring cohort/);
    assert.throws(() => relocate('other-hybrids'), /carried brood’s genome/);
    const moved = relocate('refuge-hybrids');
    const save = ({engine, lifecycle}) => JSON.parse(JSON.stringify({engine: serializeEngineWorld(engine), lifecycle}));
    const restore = pair => {
        const saved = save(pair);
        return {engine: restoreEngineWorld(saved.engine, config), lifecycle: restoreCreatureLifecycle(saved.lifecycle)};
    };
    const worldPolicy = {birthRow: 'refuge.birth', lossRow: 'refuge.loss', perBirth: {vitality: 12}};
    const refugePolicy = {id: 'refuge-hybrids', births: 0, losses: 0, genome: hybrid,
        pedigree: {maxKinship: 0, gestationMinutes: 2, growthMinutes: 3}};
    const routes = [[habitat, policy], [destination, refugePolicy]].map(([habitat, population]) =>
        ({habitat, populations: [{...population, world: worldPolicy}]}));
    const settle = (pair, clock, habitats = routes) => advancePhasedWorldHabitats(pair, {
        revision: pair.lifecycle.revision, habitats, clock,
    });
    assert.throws(() => settle(moved, 6, routes.slice(1)), /due wild habitat needs a population policy/);
    const homeSettled = settle(restore(moved), 5);
    assert.equal(homeSettled.lifecycle.habitats[habitat.id].births, 0);
    assert.equal(homeSettled.lifecycle.habitats[destination.id].births, 0);
    assert.equal(Object.values(homeSettled.lifecycle.broods)[0].dueAt, 5);
    const refugeSettled = restore(settle(restore(homeSettled), 6));
    assert.deepEqual(save(refugeSettled), save(settle(moved, 6, routes.toReversed())));
    const refugeChild = refugeSettled.lifecycle.individuals[id];
    assert.deepEqual(refugeChild, {...child, origin: 'refuge-hybrids', habitat: destination.id,
        bornAt: 6, matureAt: 9, health: {...child.health, lastAt: 6}});
    assert.deepEqual(readLineage(refugeSettled.engine.world, id)[0].parents, brood.parents);
    assert.equal(refugeSettled.engine.world.holders[id].quantities.vitality, 12);
    assert.deepEqual(harvest({id, child: refugeChild}, hybrid, 9), {'stock:fine-wool': 9});

    const batch = settle(refugeSettled, 120);
    assert.equal(batch.windows, 64);
    assert.equal(batch.pending, true);
    const finished = settle(restore(batch), 120, routes.toReversed());
    assert.equal(finished.pending, false);
    assert.equal(finished.engine.world.clock, 120);
    assert.ok(Object.values(finished.lifecycle.habitats).every(ledger => ledger.nextAt > 120));
    assert.deepEqual(save(finished), save(settle(settle(refugeSettled, 60), 120)));
});

test('wild cross windows establish a phased hybrid herd from two surviving source herds', () => {
    const {ivs, ...left} = trialGenome;
    const right = validateGenome({...left, id: 'ridge-map', linkage: [{loci: ['coat', 'fleece'], crossovers: [500]}],
        loci: {...left.loci, crimp: {mode: 'dominant', strong: 'C', plain: 'c', contributions: {'fleece.yield': 2}}}});
    const hybrid = validateGenome({...hybridGenome(left, right, 'wild-hybrid'), linkage: left.linkage});
    const habitat = {...pen, supportedSpecies: ['sheep', 'ridge-sheep', 'cross-sheep']};
    const base = genes(['F', 'f'], ['D', 'd'], ['w', 'w'], ['v', 'v']);
    const seed = (crimp, ridge = right) => {
        let state = restoreCreatureLifecycle();
        for (const [id, species, genome, genes, delta] of [
            ['left', 'sheep', left, base, 1],
            ['right', 'ridge-sheep', ridge, {...base, crimp, ...(ridge.loci.curl ? {curl: ['R', 'R']} : {})}, 1],
            ['hybrids', 'cross-sheep', hybrid, {...base, crimp: ['c', 'c']}, 1],
            ['hybrids', 'cross-sheep', hybrid, {...base, crimp: ['c', 'c']}, -1],
        ]) state = settleCohortStock(state, {revision: state.revision, id, species, habitat, genome, genes, delta});
        return openWildHabitat(state, {revision: state.revision, id: habitat.id, clock: 0, interval: 10});
    };
    const cross = [{id: 'left', genome: left}, {id: 'right', genome: right}];
    const population = {id: 'hybrids', genome: hybrid, root: 'cross-window-0', births: 1, losses: 0, cross};
    const advance = (state, clock, populations = [population], destination = habitat) => advanceWildHabitat(state,
        {revision: state.revision, habitat: destination, clock, populations}).state;
    const start = seed(['C', 'C']);
    assert.equal(advance(start, 10, [{...population, cross: undefined}]).cohorts.hybrids.stock, 0);
    assert.throws(() => advance(start, 10, [{...population, cross: [cross[0], cross[0]]}]), /distinct local phased/);
    const unrelated = {...right, family: 'other'};
    assert.throws(() => advance(seed(['C', 'C'], unrelated), 10,
        [{...population, cross: [cross[0], {id: 'right', genome: unrelated}]}]), /needs a viable cross/);
    const lost = advance(start, 10, [population, {id: 'right', genome: right, root: 'loss', births: 0, losses: 1}],
        {...habitat, supportedSpecies: ['sheep', 'cross-sheep']});
    assert.equal(lost.cohorts.right.stock, 0);
    assert.equal(lost.cohorts.hybrids.stock, 0);
    assert.equal(advance(start, 10, [population], {...habitat, capacity: 2}).cohorts.hybrids.stock, 0);

    const grown = advance(roundTrip(start), 20);
    assert.deepEqual(advance(roundTrip(advance(start, 10)), 20), grown);
    assert.equal(grown.cohorts.hybrids.stock, 2);
    assert.equal(grown.habitats[habitat.id].births, 2);
    assert.equal(grown.cohorts.left.stock, 1);
    assert.equal(grown.cohorts.right.stock, 1);
    assert.equal(advance(roundTrip(grown), 30, [{...population, cross: undefined}]).cohorts.hybrids.stock, 3);
    const draw = (state, keeper = 'keeper') => {
        const result = acquireCreature(roundTrip(state), {revision: state.revision, cohortId: 'hybrids',
            destination: habitat, keeper, genome: hybrid, root: 'draw', clock: 25, ageMinutes: 5, growthMinutes: 5});
        return {...result, child: roundTrip(result.state).individuals[result.id]};
    };
    const drawn = draw(grown);
    assert.equal(drawn.child.species, 'cross-sheep');
    assert.equal(drawn.child.phased, true);
    assert.deepEqual([...drawn.child.genes.crimp].sort(), ['C', 'c']);
    for (const [side, allele] of drawn.child.genes.crimp.entries()) {
        const coupled = (drawn.child.genes.coat[side] === 'D') === (drawn.child.genes.fleece[side] === 'F');
        assert.equal(coupled, allele === 'c');
    }
    const totalClip = animal => Object.values(harvest(animal, hybrid, 25)).reduce((sum, n) => sum + n, 0);
    assert.equal(totalClip(drawn), 9);
    assert.equal(totalClip(draw(advance(seed(['c', 'c']), 20))), 5);
    const alternate = {...right, id: 'alternate-crimp', loci: {...right.loci,
        crimp: {...right.loci.crimp, strong: 'T', plain: 't'}}};
    const mapped = {...population, cross: [cross[0], {id: 'right', genome: alternate,
        alleleMap: {crimp: {locus: 'crimp', strong: 'C', plain: 'c'}}}]};
    const alternateStart = seed(['T', 'T'], alternate);
    const translated = advance(roundTrip(advance(alternateStart, 10, [mapped])), 20, [mapped]);
    assert.deepEqual(translated.cohorts.hybrids, grown.cohorts.hybrids);
    assert.equal(totalClip(draw(translated)), 9);

    const humidRidge = {...alternate, id: 'humid-crimp', loci: {...alternate.loci,
        crimp: {...alternate.loci.crimp, shows: {needs: {quantity: 'humidity', min: 60}}}}};
    const dryFounders = seed(['t', 't'], humidRidge);
    const mixedRidge = settleCohortStock(dryFounders, {
        revision: dryFounders.revision, id: 'right', species: 'ridge-sheep', habitat, genome: humidRidge,
        genes: {...base, crimp: ['T', 'T']}, delta: 1,
    });
    const selected = (humidity, selectionLocus = 'crimp') => ({...mapped, root: 'humidity-cross', environment: {humidity},
        cross: [cross[0], {...mapped.cross[1], genome: humidRidge, selectionLocus}]});
    assert.throws(() => advance(mixedRidge, 10, [selected(60, 'missing')]), /locus in the source genome/);
    const dryRules = selected(59), wetRules = selected(60);
    const dryHybrid = advance(roundTrip(advance(mixedRidge, 10, [dryRules])), 20, [dryRules]);
    const wetHybrid = advance(roundTrip(advance(mixedRidge, 10, [wetRules])), 20, [wetRules]);
    assert.deepEqual(dryHybrid, advance(mixedRidge, 20, [dryRules]));
    assert.deepEqual(wetHybrid, advance(mixedRidge, 20, [wetRules]));
    const firstWetDraw = draw(wetHybrid);
    assert.deepEqual([totalClip(firstWetDraw), totalClip(draw(firstWetDraw.state))], [9, 9]);
    const firstDryDraw = draw(dryHybrid);
    assert.deepEqual([totalClip(firstDryDraw), totalClip(draw(firstDryDraw.state))].sort(), [5, 9]);

    const reserve = 'stock:hybrid-coat';
    const config = {packs: [LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK]};
    const worldStart = humidity => ({lifecycle: mixedRidge, engine: createEngineWorld({
        ...config, drawRoot: wetRules.root, holders: [
            {id: habitat.id, kind: 'place', quantities: {humidity}, properties: {'lantern-ventilation': 1}},
            {id: 'hybrids', kind: 'cohort', place: habitat.id, count: 0, refs: {herd: 'hybrids'}, quantities: {[reserve]: 0}},
            {id: 'cross-clip', kind: 'thing', place: habitat.id, quantities: {'stock:fine-wool': 0, 'stock:wool': 0}},
        ],
    })});
    const save = pair => JSON.parse(JSON.stringify({engine: serializeEngineWorld(pair.engine), lifecycle: pair.lifecycle}));
    const restore = pair => {
        const data = save(pair);
        return {engine: restoreEngineWorld(data.engine, config), lifecycle: restoreCreatureLifecycle(data.lifecycle)};
    };
    const grow = (pair, clock) => advancePhasedWorldHerds(pair, {revision: pair.lifecycle.revision,
        habitat, clock, populations: [{...wetRules, world: {birthRow: 'cross.birth', lossRow: 'cross.loss',
            expressionQuantities: ['humidity'], perBirth: {[reserve]: 2}}}]});
    const cooling = worldStart(70);
    const firstWindow = restore(grow(cooling, 10));
    assert.equal(firstWindow.engine.world.holders[habitat.id].quantities.humidity, 60);
    assert.equal(firstWindow.engine.world.holders.hybrids.quantities[reserve], 2);
    assert.equal(totalClip(draw(firstWindow.lifecycle)), 9);
    const secondWindow = restore(grow(firstWindow, 20));
    assert.equal(secondWindow.engine.world.holders[habitat.id].quantities.humidity, 50);
    assert.deepEqual(save(secondWindow), save(grow(cooling, 20)));
    const promote = pair => promotePhasedWorldCreature(pair, {revision: pair.lifecycle.revision,
        cohortId: 'hybrids', destination: habitat, genome: hybrid});
    const clips = pair => {
        const a = restore(promote(pair));
        const first = Object.keys(a.lifecycle.individuals)[0];
        const b = restore(promote(a));
        const second = Object.keys(b.lifecycle.individuals).find(id => id !== first);
        assert.equal(b.engine.world.holders.hybrids.count, 0);
        return [first, second].map(id => {
            assert.equal(b.engine.world.holders[id].refs.creature, id);
            assert.equal(b.engine.world.holders[id].quantities[reserve], 2);
            const clip = planMeadowFleece(id, b.lifecycle.individuals[id], 5, {genome: hybrid, clock: 20});
            assert.equal(clip.ok, true);
            const engine = applyEngineOps(b.engine, clip.effects.map(({key, amount}) => ({
                op: 'add', holder: 'cross-clip', quantity: key === FINE_WOOL_KEY ? 'stock:fine-wool' : 'stock:wool', amount,
            })), `clip:${id}`);
            const stock = restore({...b, engine}).engine.world.holders['cross-clip'].quantities;
            return stock['stock:fine-wool'] + stock['stock:wool'];
        }).sort();
    };
    assert.deepEqual(clips(secondWindow), [5, 9]);
    assert.deepEqual(clips(grow(worldStart(80), 20)), [9, 9]);

    const wider = {...right, id: 'wider-ridge-map', loci: {...right.loci, curl: {mode: 'dominant', strong: 'R', plain: 'r'}}};
    const sterilePolicy = {...population, cross: [cross[0], {id: 'right', genome: wider}]};
    const sterileStart = seed(['C', 'C'], wider);
    const rightStock = (state, delta, sterile) => settleCohortStock(state, {revision: state.revision,
        id: 'right', species: 'ridge-sheep', habitat, genome: wider,
        genes: {...base, crimp: ['C', 'C'], curl: ['R', 'R']}, delta, sterile});
    const sterileSource = rightStock(rightStock(sterileStart, -1), 1, true);
    assert.equal(advance(roundTrip(sterileSource), 10, [sterilePolicy]).cohorts.hybrids.stock, 0);
    const sterileHerd = advance(sterileStart, 20, [sterilePolicy]);
    assert.deepEqual(advance(roundTrip(advance(sterileStart, 10, [sterilePolicy])), 20, [sterilePolicy]), sterileHerd);
    const localBirth = {...population, cross: undefined};
    assert.equal(advance(roundTrip(sterileHerd), 30, [localBirth]).cohorts.hybrids.stock, 2);
    const sterileAnimal = draw(sterileHerd, null);
    assert.equal(sterileAnimal.child.sterile, true);
    assert.equal(totalClip(sterileAnimal), 9);
    const folded = returnPhasedCreature(roundTrip(sterileAnimal.state), {revision: sterileAnimal.state.revision,
        id: sterileAnimal.id, genome: hybrid, clock: 25});
    assert.deepEqual(folded.cohorts.hybrids, sterileHerd.cohorts.hybrids);

    const addFertile = (state, delta) => settleCohortStock(state, {revision: state.revision, id: 'hybrids',
        species: 'cross-sheep', habitat, genome: hybrid, genes: sterileAnimal.child.genes, delta});
    const mixed = roundTrip(addFertile(folded, 1));
    const matching = mixed.cohorts.hybrids.phase.profiles.filter(row => JSON.stringify(row.genes) === JSON.stringify(sterileAnimal.child.genes));
    assert.equal(matching.length, 2);
    assert.equal(advance(mixed, 30, [localBirth]).cohorts.hybrids.stock, 3);
    assert.equal(advance(addFertile(mixed, 1), 30, [localBirth]).cohorts.hybrids.stock, 5);
    let remaining = mixed;
    const drawnIds = [];
    while (remaining.cohorts.hybrids.stock > 0) {
        const animal = draw(remaining);
        drawnIds.push(animal.id);
        remaining = animal.state;
    }
    assert.equal(drawnIds.filter(id => remaining.individuals[id].sterile).length, 2);
    const sterileId = drawnIds.find(id => remaining.individuals[id].sterile);
    const fertileId = drawnIds.find(id => !remaining.individuals[id].sterile);
    assert.throws(() => startCreatureBrood(roundTrip(remaining), {revision: remaining.revision,
        parents: [sterileId, fertileId], keeper: 'keeper', clock: 25, genome: hybrid,
        root: 'fertility', gestationMinutes: 2, growthMinutes: 3}), /sterile/);
    const loss = advance(mixed, 30, [{...localBirth, births: 0, losses: 3}], {...habitat, capacity: 2});
    assert.equal(loss.cohorts.hybrids.stock, 0);
    assert.deepEqual(roundTrip(loss).cohorts.hybrids.phase.profiles, []);
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

test('IH1: selecting on measured wool raises the flock by heritability; with none it does not move', () => {
    // Truncation selection over generations (the breeder's equation R = h^2 * S as the expectation).
    const run = heritability => {
        const genome = {...sheep, polygenic: {woolTenths: {...sheep.polygenic.woolTenths, heritability}}};
        let herd = Array.from({length: 40}, (_, i) => ({id: `g0.${i}`, breeding: foundingBreeding(genome, {root: 'flock', at: `f${i}`})}));
        const mean = h => h.reduce((n, x) => n + expressPolygenic(genome, x.breeding, {root: 'flock', id: x.id}).woolTenths, 0) / h.length;
        const start = mean(herd);
        for (let g = 1; g <= 6; g++) {
            const best = [...herd].sort((x, y) => expressPolygenic(genome, y.breeding, {root: 'flock', id: y.id}).woolTenths -
                expressPolygenic(genome, x.breeding, {root: 'flock', id: x.id}).woolTenths).slice(0, 10);
            herd = Array.from({length: 40}, (_, i) => ({id: `g${g}.${i}`,
                breeding: inheritBreeding(genome, best[i % 10].breeding, best[(i + 3) % 10].breeding, {root: 'flock', at: `g${g}.${i}`})}));
        }
        return mean(herd) - start;
    };
    const none = run(0), some = run(350), full = run(1000);
    assert.ok(Math.abs(none) < 3, `h2 0 moved ${none}`);
    assert.ok(some > 3 && full > some, `h2 .35 gained ${some}, h2 1 gained ${full}`);
});

test('IH1: a lamb’s breeding value lands near its parents’ mean, is saved, and only the measured value shows', () => {
    let s = restoreCreatureLifecycle();
    s = settleCohortStock(s, {revision: s.revision, id: 'market', species: 'sheep', habitat: pen, delta: 2});
    const g = genes(['F', 'f'], ['D', 'd'], ['W', 'w'], ['V', 'v']);
    const ewe = acquireCreature(s, {revision: s.revision, cohortId: 'market', destination: pen, keeper: 'player', clock: 0, genes: g, breeding: {woolTenths: 62}, genome: sheep});
    const ram = acquireCreature(ewe.state, {revision: ewe.state.revision, cohortId: 'market', destination: pen, keeper: 'player', clock: 0, genes: g, breeding: {woolTenths: 58}, genome: sheep});
    const brood = startCreatureBrood(ram.state, {revision: ram.state.revision, parents: [ewe.id, ram.id], keeper: 'player', clock: 1,
        gestationMinutes: 5, growthMinutes: 5, root: 'meadow:9', genome: sheep});
    const born = settleCreatureBirth(brood.state, {revision: brood.state.revision, broodId: brood.id, clock: 6, destination: pen});
    const lamb = restoreCreatureLifecycle(JSON.parse(JSON.stringify(born.state))).individuals[born.id];
    assert.ok(Math.abs(lamb.breeding.woolTenths - 60) <= 12, `lamb ${lamb.breeding.woolTenths}`);
    const read = readLivingBody({lifecycle: born.state, registry, id: born.id, clock: 12, sinceMeal: 0, root: 'meadow:9'});
    assert.ok(Number.isSafeInteger(read.measured.woolTenths) && !('breeding' in read));
    const more = settleCohortStock(born.state, {revision: born.state.revision, id: 'market', species: 'sheep', habitat: pen, delta: 1});
    assert.throws(() => acquireCreature(more, {revision: more.revision, cohortId: 'market', destination: pen, keeper: 'player',
        clock: 6, genes: g, breeding: {woolTenths: 1.5}, genome: sheep}), /breeding values/i);
});
