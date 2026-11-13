// PC96 worked example: the improvement loop, run on the village sheep with no code
// written for optimizing. A breeder policy (fixture) drives the real lifecycle and
// heredity functions for twenty generations. Nothing here draws a gene: every lamb
// comes from startCreatureBrood and settleCreatureBirth with addressed draws.
//
// The policy: a pen of six. Each generation the two best-looking adults have four
// lambs, the lambs grow up, and the four worst-looking of the ten are sold.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
    acquireCreature, advanceWildHabitat, creatureDevelopment, injureCreature, markCreatureGenesKnown, openWildHabitat,
    restoreCreatureLifecycle, settleCohortStock, settleCreatureBirth, setCohortAlleles, setPhasedHerdSelection,
    startCreatureBrood, startCreatureCare, transferCreature,
} from '../src/creature_lifecycle.js';
import {
    expressGenes, expressPolygenic, foundingBreeding, foundingGenes, frequenciesFrom, genotypeView, learnFromChild,
} from '../src/heredity.js';
import {LIVING_GENOMES, MEADOW_BREEDING_GENOME} from '../src/living_genomes.js';
import {kinship} from '../src/lineage_traits.js';
import {FINE_WOOL_KEY, planMeadowFleece} from '../src/meadow_fleece.js';
import {advancePhasedWorldHerds, hatchTrackedWorldEgg, layTrackedWorldEgg, releaseTrackedWorldCreature, settleKeptWorldBirth,
    takeTrackedWorldCreature} from '../src/creature_herd_world.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {JUVENILE_GROWTH, livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {GRAZING_HOME, MEADOW_FORAGE, MEADOW_GRAZING_PACK} from '../src/world_packs/meadow_grazing.js';
import {livingKindRegistry} from '../src/living_kinds.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {readLineage} from '../src/world_substrate.js';
import {BREW_DOSE_LAW} from '../src/brew_dose_delivery.js';
import {BREW_LAW, brewBalance} from '../src/brew_law.js';
import {brewDoseQuantity, brewMeasureQuantity} from '../src/engine_brew_stock.js';
import {SPELL_EFFECT_LAW, spellEffectMethod} from '../src/spell_law.js';
import {CREATURE_FORM_PACK, creatureForm} from '../src/creature_evolution.js';
import {GU_VITALITY_WORLD_LAW, GU_VITALITY_WORLD_PROPERTIES, GU_VITALITY_WORLD_QUANTITIES,
    guVitalityWorking} from '../src/world_packs/gu_vitality_working.js';
import {createCreatureGestationPack, EGG_EXPOSURE_LOSS, EGG_IMPRINT, EGG_IMPRINT_LEFT, EGG_IMPRINT_MINIMUM,
    EGG_IMPRINT_QUANTITY, EGG_IMPRINTS, EGG_TOLERANCE, GESTATION_BROOD,
    GESTATION_LEFT} from '../src/world_packs/creature_gestation.js';
import {LANTERN_CHARGE_HUSK, LANTERN_CLIP, LANTERN_COAT_GRAFT, LANTERN_COAT_PACK, LANTERN_COAT_WASH,
    LANTERN_FEED, LANTERN_FLASH, LANTERN_FLEECE_LAW, lanternBodyReader,
    LANTERN_EVOLUTION, LANTERN_MOONBEAM, LANTERN_MOON_CYCLE_PACK, LANTERN_WISP_GLOW, LANTERN_WOOL_LAMP,
    awakenLanternHusk, lanternCoatProperties, lanternCoatRepairBrew, packLanternHusk, tradeLanternHusk,
    lanternCoatRepairDose} from '../src/world_packs/meadow_lantern_fleece.js';

const genome = LIVING_GENOMES['village.sheep'];
const pen = {id: 'pen', capacity: 10, supportedSpecies: ['sheep']};

test('phased herd selection reads the habitat humidity at each birth boundary', () => {
    const {ivs, ...linked} = MEADOW_BREEDING_GENOME;
    const genome = {...linked, mutation: 0,
        epistasis: [{target: 'fleece', suppressor: 'coat', atLeast: 1, unless: {quantity: 'humidity', min: 60}}]};
    const id = 'mist-selection';
    const common = {winter: ['w', 'w'], vigor: ['v', 'v'], fleece: ['F', 'F']};
    const add = (state, coat) => settleCohortStock(state, {revision: state.revision, id,
        species: 'sheep', habitat: pen, delta: 2, genome, genes: {...common, coat}});
    const stock = add(add(restoreCreatureLifecycle(), ['d', 'd']), ['D', 'D']);
    const opened = openWildHabitat(stock, {revision: stock.revision, id: pen.id, clock: 0, interval: 1});
    const lifecycle = setPhasedHerdSelection(opened, {revision: opened.revision, id, genome, locus: 'fleece', clock: 0});
    const config = {packs: [LANTERN_COAT_PACK.id], ownPacks: [LANTERN_COAT_PACK], shared: {quantities: [WORLD_QUANTITIES.humidity]}};
    const start = (humidity, vent) => ({lifecycle, engine: createEngineWorld({...config, drawRoot: 'standing', holders: [
        {id: pen.id, kind: 'place', quantities: {humidity}, properties: {'lantern-ventilation': vent}},
        {id, kind: 'cohort', place: pen.id, count: 4, refs: {herd: id}},
    ]})});
    const restore = pair => ({
        lifecycle: restoreCreatureLifecycle(JSON.parse(JSON.stringify(pair.lifecycle))),
        engine: restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pair.engine))), config),
    });
    const advance = (pair, clock) => advancePhasedWorldHerds(pair, {revision: pair.lifecycle.revision, habitat: pen, clock,
        populations: [{id, births: 1, losses: 0, genome, environment: {humidity: 100},
            world: {birthRow: 'mist.birth', lossRow: 'mist.loss', expressionQuantities: ['humidity']}}]});
    const dry = restore(advance(start(60, 1), 6));
    const humid = restore(advance(start(60, 0), 6));
    assert.equal(dry.engine.world.holders[pen.id].quantities.humidity, 54);
    assert.equal(dry.engine.world.holders[id].count, 10);
    const split = advance(restore(advance(start(60, 1), 2)), 6);
    assert.deepEqual(dry.lifecycle, split.lifecycle);
    assert.deepEqual(serializeEngineWorld(dry.engine), serializeEngineWorld(split.engine));
    const fineClips = pair => {
        let state = pair.lifecycle, fine = 0;
        while (state.cohorts[id].stock > 0) {
            const animal = acquireCreature(state, {revision: state.revision, cohortId: id, destination: pen,
                keeper: KEEPER, genome, root: 'mist-selection', clock: 6});
            state = animal.state;
            const clip = planMeadowFleece(animal.id, state.individuals[animal.id], 5, {genome, clock: 6, environment: {humidity: 59}});
            if (clip.effects[0].key === FINE_WOOL_KEY) fine++;
        }
        return fine;
    };
    assert.equal(fineClips(dry), 8);
    assert.equal(fineClips(humid), 2);
});
const market = {id: 'market', capacity: 1000, supportedSpecies: ['sheep']};

test('live fleece expression breaks kinship ties for tracked wild mating', () => {
    const {ivs, ...linked} = MEADOW_BREEDING_GENOME;
    const genome = {...linked, mutation: 0, loci: {...linked.loci,
        vigor: {...linked.loci.vigor, shows: {needs: {quantity: 'humidity', min: 60}}}},
        development: {expressed: {locus: 'vigor', minutesPerLevel: 1}, pauseWhileInjured: true},
        epistasis: [{target: 'fleece', suppressor: 'coat', atLeast: 1, unless: {quantity: 'humidity', min: 60}}]};
    const id = 'tracked-mist', parents = [];
    let state = restoreCreatureLifecycle();
    for (const allele of ['D', 'D', 'd', 'd']) {
        state = settleCohortStock(state, {revision: state.revision, id, species: 'sheep', habitat: pen, delta: 1, genome,
            genes: {fleece: ['F', 'F'], coat: [allele, allele], winter: ['w', 'w'], vigor: ['V', 'V']}});
        const draw = acquireCreature(state, {revision: state.revision, cohortId: id, destination: pen,
            keeper: null, genome, root: id});
        state = draw.state;
        parents.push(draw.id);
    }
    const opened = openWildHabitat(state, {revision: state.revision, id: pen.id, clock: 0, interval: 1});
    const lifecycle = setPhasedHerdSelection(opened, {revision: opened.revision, id, genome, locus: 'fleece', clock: 0});
    const registry = livingKindRegistry();
    const gestationPack = createCreatureGestationPack([WORLD_QUANTITIES.humidity, WORLD_QUANTITIES.temperature]);
    const config = life => ({packs: ['w.sky', 'l.living_body', LANTERN_COAT_PACK.id, MEADOW_GRAZING_PACK.id,
        gestationPack.id, CREATURE_FORM_PACK.id, LANTERN_MOON_CYCLE_PACK.id],
        ownPacks: [LANTERN_COAT_PACK, MEADOW_GRAZING_PACK, gestationPack, CREATURE_FORM_PACK, LANTERN_MOON_CYCLE_PACK],
        settings: {'w.sky': {dawn: 490, dusk: 505, moonCycleDays: 2}},
        shared: {quantities: [WORLD_QUANTITIES.vitality, WORLD_QUANTITIES.moon_phase, ...GU_VITALITY_WORLD_QUANTITIES],
            properties: [WORLD_PROPERTIES.marks, WORLD_PROPERTIES.alive, ...GU_VITALITY_WORLD_PROPERTIES,
                ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'}))]},
        host: {laws: [LANTERN_FLEECE_LAW, BREW_DOSE_LAW, BREW_LAW, SPELL_EFFECT_LAW, GU_VITALITY_WORLD_LAW, LANTERN_EVOLUTION.law],
            costs: {accounts: {stamina: {quantity: 'energy:stamina'}}},
            ports: {readThing: lanternBodyReader(life, registry)},
            things: Object.fromEntries(['moss', 'binder'].map(part =>
                [`lot:repair-${part}`, {material: part, properties: {constituents: {[`lantern-repair-${part}`]: 1000}}}]))}});
    const charge = 'energy:lantern-charge', hay = 'stock:meadow-hay';
    const start = humidity => ({lifecycle, engine: createEngineWorld({...config(lifecycle), drawRoot: id, holders: [
        {id: pen.id, kind: 'place', quantities: {humidity, [MEADOW_FORAGE]: 0}},
        {id, kind: 'cohort', place: pen.id, count: 0, refs: {herd: id}},
        {id: 'clip', kind: 'thing', place: pen.id, quantities: {'stock:fine-wool': 0, 'stock:wool': 0}},
        {id: 'lantern-clip', kind: 'thing', place: pen.id, quantities: {'stock:fine-wool': 0, 'stock:wool': 0, [charge]: 0}},
        {id: KEEPER, kind: 'body', as: ['operator'], place: pen.id, quantities: {[hay]: 1}},
        ...parents.map(id => ({id, kind: 'body', place: pen.id, refs: {creature: id}})),
    ]})});
    const restore = pair => {
        const lifecycle = restoreCreatureLifecycle(JSON.parse(JSON.stringify(pair.lifecycle)));
        return {lifecycle, engine: restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(pair.engine))), config(lifecycle))};
    };
    const birthPolicy = {birthRow: 'mist.birth', lossRow: 'mist.loss', expressionQuantities: ['humidity'],
        perBirth: {satiety: 3, [charge]: 0}, fedGrowth: {foodRate: 1},
        birthTags: ['meadow-grazer'], propertiesFor: lanternCoatProperties};
    const advance = (pair, clock, births, world = birthPolicy, gestationMinutes = 1) => advancePhasedWorldHerds(pair, {
        revision: pair.lifecycle.revision, habitat: pen, clock,
        populations: [{id, births, losses: 0, genome, pedigree: {maxKinship: 0, gestationMinutes, growthMinutes: 3}, world}],
    });
    const conditional = {...birthPolicy, gestation: {quantity: 'humidity', min: 60}};
    const conditionAdvance = (pair, clock, births = 0) => advance(pair, clock, births, conditional, 2);
    const humidBrood = conditionAdvance(start(60), 1, 1);
    const [[humidBroodId, conceived]] = Object.entries(humidBrood.lifecycle.broods);
    const carrier = conceived.parents[0];
    assert.equal(humidBrood.engine.world.holders[carrier].quantities[GESTATION_LEFT], 2);
    const changeHumidity = (pair, humidity, ventilation = 0) => ({...pair, engine: applyEngineOps(pair.engine, [
        {op: 'set', holder: pen.id, quantity: 'humidity', amount: humidity},
        {op: 'property', holder: pen.id, property: 'lantern-ventilation', value: ventilation},
    ], 'change-gestation-habitat')});
    const delayedGestation = conditionAdvance(restore(changeHumidity(humidBrood, 60, 1)), 4);
    assert.equal(delayedGestation.engine.world.holders[carrier].quantities[GESTATION_LEFT], 1);
    assert.deepEqual(delayedGestation.lifecycle.broods[humidBroodId], conceived);
    assert.equal(delayedGestation.lifecycle.habitats[pen.id].births, 0);
    const keptCarrier = takeTrackedWorldCreature(delayedGestation, {revision: delayedGestation.lifecycle.revision,
        id: carrier, keeper: KEEPER, destination: pen});
    assert.throws(() => settleKeptWorldBirth(restore(keptCarrier), {revision: keptCarrier.lifecycle.revision,
        broodId: humidBroodId, destination: pen, world: birthPolicy}), /still gestating/);
    const keptReady = conditionAdvance(restore(changeHumidity(keptCarrier, 60)), 5);
    const delivered = settleKeptWorldBirth(keptReady, {revision: keptReady.lifecycle.revision,
        broodId: humidBroodId, destination: pen, world: birthPolicy});
    assert.equal(delivered.lifecycle.individuals[delivered.id].keeper, KEEPER);
    assert.equal(delivered.engine.world.holders[carrier].properties[GESTATION_BROOD], undefined);
    const humidAgain = changeHumidity(delayedGestation, 60);
    const recoveredGestation = conditionAdvance(restore(humidAgain), 5);
    const directGestation = conditionAdvance(humidAgain, 5);
    assert.deepEqual(recoveredGestation.lifecycle, directGestation.lifecycle);
    assert.deepEqual(serializeEngineWorld(recoveredGestation.engine), serializeEngineWorld(directGestation.engine));
    assert.equal(recoveredGestation.engine.world.holders[carrier].properties[GESTATION_BROOD], undefined);
    const [lateChild] = Object.values(recoveredGestation.lifecycle.individuals).filter(animal => animal.bornAt === 5);
    const normal = conditionAdvance(humidBrood, 3);
    const [earlyChild] = Object.values(normal.lifecycle.individuals).filter(animal => animal.bornAt === 3);
    assert.deepEqual(lateChild, {...earlyChild, bornAt: 5, matureAt: earlyChild.matureAt + 2,
        health: {...earlyChild.health, lastAt: 5}});
    assert.deepEqual(delivered.lifecycle.individuals[delivered.id], {...lateChild, keeper: KEEPER});
    const readyLate = conditionAdvance(restore(recoveredGestation), lateChild.matureAt - 1);
    const clippedLate = conditionAdvance(restore({...readyLate, engine: startEngineWorking(readyLate.engine, {
        law: LANTERN_FLEECE_LAW, method: LANTERN_CLIP, id: 'gestation-clip',
        bindings: {animal: {kind: 'body', id: `creature:${lateChild.serial}`}, wool: {kind: 'thing', id: 'lantern-clip'}},
    })}), lateChild.matureAt);
    assert.equal(clippedLate.engine.world.holders['lantern-clip'].quantities['stock:fine-wool'], 9);

    const nursery = {...pen, id: 'nursery'};
    const laid = layTrackedWorldEgg(restore(delayedGestation), {revision: delayedGestation.lifecycle.revision,
        broodId: humidBroodId, egg: 'mist-egg', condition: conditional.gestation, sourceRow: 'mist.laid'});
    assert.equal(laid.engine.world.holders['mist-egg'].quantities[GESTATION_LEFT], 1);
    assert.equal(laid.engine.world.holders[carrier].quantities[GESTATION_LEFT], 0);
    assert.deepEqual(readLineage(laid.engine.world, 'mist-egg')[0].parents, conceived.parents);
    const hatch = (pair, destination = nursery, keeper = null) => hatchTrackedWorldEgg(pair, {
        revision: pair.lifecycle.revision, broodId: humidBroodId, destination, keeper, world: birthPolicy,
    });
    assert.throws(() => hatch(laid, pen), /still incubating/);
    const relocatedEgg = {...laid, engine: applyEngineOps(laid.engine, [
        {op: 'holder_add', value: {id: nursery.id, kind: 'place', quantities: {humidity: 60}}},
        {op: 'move', holder: 'mist-egg', to: nursery.id},
        {op: 'move', holder: 'lantern-clip', to: nursery.id},
    ], 'move-egg-to-nursery')};
    const afterLoss = advancePhasedWorldHerds(restore(relocatedEgg), {revision: relocatedEgg.lifecycle.revision,
        habitat: {...pen, capacity: 0}, clock: 5,
        populations: [{id, births: 0, losses: 4, genome, pedigree: {maxKinship: 0, gestationMinutes: 2, growthMinutes: 3},
            world: conditional}],
    });
    assert.ok(conceived.parents.every(id => afterLoss.lifecycle.individuals[id].deadAt === 5));
    assert.equal(afterLoss.lifecycle.habitats[pen.id].births, 0);
    assert.throws(() => hatch(afterLoss, pen), /receiving habitat/);
    assert.throws(() => hatch(afterLoss, nursery, KEEPER), /keeper needs to be present/);
    assert.throws(() => hatch(afterLoss, {...nursery, capacity: 0}), /insufficient space/);
    const hatched = hatch(restore(afterLoss));
    const directHatch = hatch(afterLoss);
    assert.deepEqual(hatched.lifecycle, directHatch.lifecycle);
    assert.deepEqual(serializeEngineWorld(hatched.engine), serializeEngineWorld(directHatch.engine));
    const hatchling = hatched.lifecycle.individuals[hatched.id];
    assert.deepEqual(hatchling, {...lateChild, habitat: nursery.id});
    assert.deepEqual(readLineage(hatched.engine.world, hatched.id)[0].parents, ['mist-egg', ...conceived.parents]);
    assert.equal(hatched.engine.world.holders['mist-egg'], undefined);
    assert.throws(() => hatch(restore(hatched)), /tracked egg/);
    const hatchReady = conditionAdvance(restore(hatched), hatchling.matureAt - 1);
    const eggClip = conditionAdvance(restore({...hatchReady, engine: startEngineWorking(hatchReady.engine, {
        law: LANTERN_FLEECE_LAW, method: LANTERN_CLIP, id: 'hatched-clip',
        bindings: {animal: {kind: 'body', id: hatched.id}, wool: {kind: 'thing', id: 'lantern-clip'}},
    })}), hatchling.matureAt);
    assert.equal(eggClip.engine.world.holders['lantern-clip'].quantities['stock:fine-wool'], 9);

    const vulnerable = layTrackedWorldEgg(restore(delayedGestation), {revision: delayedGestation.lifecycle.revision,
        broodId: humidBroodId, egg: 'exposed-egg', condition: conditional.gestation, sourceRow: 'mist.laid', exposureMinutes: 2});
    const oneDryMinute = conditionAdvance(vulnerable, 5, 1);
    assert.equal(oneDryMinute.engine.world.holders['exposed-egg'].quantities[EGG_TOLERANCE], 1);
    assert.equal(oneDryMinute.engine.world.holders['exposed-egg'].quantities[GESTATION_LEFT], 1);
    assert.deepEqual(oneDryMinute.lifecycle.broods[humidBroodId].parents, conceived.parents);
    const rescued = conditionAdvance(changeHumidity(restore(oneDryMinute), 60), 6);
    assert.equal(rescued.engine.world.holders['exposed-egg'].quantities[EGG_TOLERANCE], 1);
    assert.equal(hatch(restore(rescued), pen).lifecycle.individuals[hatched.id].bornAt, 6);
    const lost = conditionAdvance(restore(oneDryMinute), 6);
    const uninterruptedLoss = conditionAdvance(oneDryMinute, 6);
    assert.deepEqual(lost.lifecycle, uninterruptedLoss.lifecycle);
    assert.deepEqual(serializeEngineWorld(lost.engine), serializeEngineWorld(uninterruptedLoss.engine));
    assert.equal(lost.engine.world.holders['exposed-egg'], undefined);
    assert.equal(lost.engine.world.rows[EGG_EXPOSURE_LOSS][GESTATION_LEFT], 1);
    assert.equal(lost.lifecycle.broods[humidBroodId], undefined);
    assert.throws(() => hatch(restore(lost), pen), /tracked egg/);
    const breedingAgain = conditionAdvance(restore(changeHumidity(lost, 60)), 7, 1);
    assert.deepEqual(breedingAgain.lifecycle.broods[humidBroodId].parents, conceived.parents);
    assert.equal(breedingAgain.engine.world.holders[carrier].quantities[GESTATION_LEFT], 2);
    const usedAsIngredient = {...vulnerable, engine: applyEngineOps(vulnerable.engine, [
        {op: 'lifecycle', act: 'end', holder: 'exposed-egg', to: ['row:ingredient.used']},
    ], 'use-egg-as-ingredient')};
    const closed = conditionAdvance(restore(usedAsIngredient), 4);
    assert.equal(closed.lifecycle.broods[humidBroodId], undefined);
    assert.equal(closed.engine.world.rows['ingredient.used'][GESTATION_LEFT], 1);
    const missingWithoutIdentity = {...vulnerable, engine: delayedGestation.engine};
    assert.deepEqual(conditionAdvance(restore(missingWithoutIdentity), 4).lifecycle.broods[humidBroodId],
        vulnerable.lifecycle.broods[humidBroodId]);

    const light = 'light:lantern-fleece';
    const imprint = {condition: 'nursery-humidity-mark', quantity: 'humidity', min: 70, minutes: 1};
    const warmth = {condition: 'nursery-warmth-mark', quantity: 'temperature', min: 30, minutes: 1};
    const imprintEgg = layTrackedWorldEgg(restore(delayedGestation), {revision: delayedGestation.lifecycle.revision,
        broodId: humidBroodId, egg: 'imprint-egg', condition: conditional.gestation, sourceRow: 'mist.laid',
        imprints: [imprint, warmth]});
    assert.throws(() => layTrackedWorldEgg(delayedGestation, {revision: delayedGestation.lifecycle.revision,
        broodId: humidBroodId, egg: 'duplicate-mark-egg', condition: conditional.gestation, sourceRow: 'mist.laid',
        imprints: [imprint, imprint]}), /incubation imprint/);
    const legacyEgg = {...laid, engine: applyEngineOps(laid.engine, [
        {op: 'carry', holder: 'mist-egg', quantity: EGG_IMPRINT_LEFT, amount: 1},
        {op: 'property', holder: 'mist-egg', property: EGG_IMPRINT, value: imprint.condition},
        {op: 'property', holder: 'mist-egg', property: EGG_IMPRINT_QUANTITY, value: imprint.quantity},
        {op: 'property', holder: 'mist-egg', property: EGG_IMPRINT_MINIMUM, value: imprint.min},
    ], 'legacy-single-egg-imprint')};
    const legacyReady = conditionAdvance(restore(changeHumidity(legacyEgg, 70)), 5);
    assert.equal(hatch(legacyReady, pen).lifecycle.individuals[hatched.id].incubationCondition, imprint.condition);
    const imprintBirth = {...birthPolicy, perBirth: {...birthPolicy.perBirth, [charge]: 1},
        propertiesFor: animal => ({...lanternCoatProperties(animal, {mist: true}), form: 'lantern-fleece'})};
    const imprintTrial = (humidity, temperature, expectedFine, expectedPlain, expectedLight) => {
        const wet = changeHumidity(imprintEgg, humidity);
        const prepared = {...wet, engine: applyEngineOps(wet.engine, [
            {op: 'carry', holder: pen.id, quantity: 'temperature', amount: temperature},
        ], 'set-incubation-temperature')};
        const developed = conditionAdvance(restore(prepared), 5);
        const accounts = developed.engine.world.holders['imprint-egg'].quantities;
        assert.equal(accounts[`${EGG_IMPRINTS}:${imprint.condition}`], humidity === 70 ? 0 : 1);
        assert.equal(accounts[`${EGG_IMPRINTS}:${warmth.condition}`], temperature === 30 ? 0 : 1);
        // Both eggs spend the hatch minute at the same humidity, after development finishes.
        const ready = conditionAdvance(restore(changeHumidity(developed, 70)), 6);
        const baby = hatchTrackedWorldEgg(ready, {revision: ready.lifecycle.revision, broodId: humidBroodId,
            destination: pen, world: imprintBirth});
        const adult = conditionAdvance(restore(changeHumidity(baby, 60)), 7);
        const lit = {...adult, engine: applyEngineOps(adult.engine, [{op: 'carry', holder: pen.id, quantity: light}], 'read-flash')};
        const subject = {kind: 'body', id: baby.id};
        const work = (method, name, bindings) => conditionAdvance(restore({...lit, engine: startEngineWorking(lit.engine, {
            law: LANTERN_FLEECE_LAW, method, id: name, bindings: {animal: subject, ...bindings},
        })}), 8);
        const flash = work(LANTERN_FLASH, 'imprint-flash', {});
        assert.equal(flash.engine.world.holders[pen.id].quantities[light], expectedLight);
        assert.equal(flash.engine.world.holders[baby.id].quantities[charge], expectedLight ? 0 : 1);
        if (!expectedLight) assert.equal(flash.engine.records.workings['imprint-flash'].record.receipts[0].reason, 'no-expressed-lantern-coat');
        const clip = work(LANTERN_CLIP, 'imprint-clip', {wool: {kind: 'thing', id: 'lantern-clip'}});
        assert.equal(clip.engine.world.holders['lantern-clip'].quantities['stock:fine-wool'], expectedFine);
        assert.equal(clip.engine.world.holders['lantern-clip'].quantities['stock:wool'], expectedPlain);
        if (humidity === 70 && temperature === 30) {
            const owned = takeTrackedWorldCreature(lit, {revision: lit.lifecycle.revision, id: baby.id, keeper: KEEPER, destination: pen});
            const wash = 'stock:lantern-coat-wash';
            const supplied = restore({...owned, engine: applyEngineOps(owned.engine, [
                {op: 'carry', holder: KEEPER, quantity: wash, amount: 2},
            ], 'supply-coat-wash')});
            const queue = (pair, method, name, bindings = {}) => ({...pair, engine: startEngineWorking(pair.engine, {
                law: LANTERN_FLEECE_LAW, method, id: name, bindings: {animal: subject, ...bindings},
            })});
            const keeper = {kind: 'body', id: KEEPER};
            const pending = queue(supplied, LANTERN_COAT_WASH, 'coat-wash', {keeper});
            const treated = conditionAdvance(restore(pending), 8);
            assert.deepEqual(serializeEngineWorld(treated.engine), serializeEngineWorld(conditionAdvance(pending, 8).engine));
            assert.deepEqual(treated.lifecycle.individuals, supplied.lifecycle.individuals);
            assert.equal(treated.engine.world.holders[KEEPER].quantities[wash], 1);
            const empty = {...pending, engine: applyEngineOps(pending.engine, [
                {op: 'set', holder: KEEPER, quantity: wash, amount: 0},
            ], 'use-wash-elsewhere')};
            assert.equal(conditionAdvance(restore(empty), 8).engine.records.workings['coat-wash'].record.receipts[0].reason,
                'lantern-coat-wash-empty');
            const repeat = conditionAdvance(restore(queue(treated, LANTERN_COAT_WASH, 'wash-repeat', {keeper})), 9);
            assert.equal(repeat.engine.records.workings['wash-repeat'].record.receipts[0].reason, 'lantern-coat-wash-active');
            assert.equal(repeat.engine.world.holders[KEEPER].quantities[wash], 1);
            const afterFlash = conditionAdvance(restore(queue(treated, LANTERN_FLASH, 'washed-flash')), 9);
            assert.equal(afterFlash.engine.world.holders[pen.id].quantities[light], 8);
            assert.equal(afterFlash.engine.world.holders[baby.id].quantities[charge], 0);
            const washClip = conditionAdvance(restore(queue(treated, LANTERN_CLIP, 'washed-clip',
                {wool: {kind: 'thing', id: 'lantern-clip'}})), 9);
            assert.equal(washClip.engine.world.holders['lantern-clip'].quantities['stock:wool'], 9);
            assert.equal(washClip.engine.world.holders['lantern-clip'].quantities['stock:fine-wool'], 0);
            const aboutToExpire = conditionAdvance(restore(treated), 11);
            const expired = conditionAdvance(restore(queue(aboutToExpire, LANTERN_FLASH, 'expired-wash-flash')), 12);
            assert.equal(expired.engine.records.workings['expired-wash-flash'].record.receipts[0].reason, 'no-expressed-lantern-coat');
            assert.equal(expired.engine.world.holders[baby.id].quantities[charge], 1);
            assert.deepEqual(expired.lifecycle.individuals[baby.id], supplied.lifecycle.individuals[baby.id]);

            const graft = 'stock:lantern-coat-graft', repair = 'lantern-coat-repair-left';
            const graftStock = {...expired, engine: applyEngineOps(expired.engine, [
                {op: 'carry', holder: KEEPER, quantity: graft, amount: 2},
            ], 'supply-coat-graft')};
            const graftPending = queue(graftStock, LANTERN_COAT_GRAFT, 'coat-graft', {keeper});
            const missing = {...graftPending, engine: applyEngineOps(graftPending.engine, [
                {op: 'set', holder: KEEPER, quantity: graft, amount: 0},
            ], 'use-graft-elsewhere')};
            const refused = conditionAdvance(restore(missing), 13);
            assert.equal(refused.engine.records.workings['coat-graft'].record.receipts[0].reason, 'lantern-coat-graft-empty');
            assert.equal(refused.engine.world.holders[baby.id].quantities[repair], undefined);
            const grafted = conditionAdvance(restore(graftPending), 13);
            assert.equal(grafted.engine.world.holders[KEEPER].quantities[graft], 1);
            assert.equal(grafted.engine.world.holders[baby.id].quantities[repair], 3);
            const dry = conditionAdvance(restore(changeHumidity(grafted, 59)), 17);
            assert.equal(dry.engine.world.holders[baby.id].quantities[repair], 3);
            const damp = changeHumidity(dry, 60);
            const early = conditionAdvance(restore(queue(damp, LANTERN_FLASH, 'graft-early-flash')), 18);
            assert.equal(early.engine.records.workings['graft-early-flash'].record.receipts[0].reason, 'no-expressed-lantern-coat');
            const repaired = conditionAdvance(restore(conditionAdvance(damp, 18)), 20);
            assert.deepEqual(serializeEngineWorld(repaired.engine), serializeEngineWorld(conditionAdvance(damp, 20).engine));
            assert.equal(repaired.engine.world.holders[baby.id].quantities[repair], 0);
            const later = conditionAdvance(restore(repaired), 25);
            const repairFlash = conditionAdvance(restore(queue(later, LANTERN_FLASH, 'graft-flash')), 26);
            assert.equal(repairFlash.engine.world.holders[pen.id].quantities[light], 8);
            assert.equal(repairFlash.engine.world.holders[baby.id].quantities[charge], 0);
            const repairClip = conditionAdvance(restore(queue(later, LANTERN_CLIP, 'graft-clip',
                {wool: {kind: 'thing', id: 'lantern-clip'}})), 26);
            assert.equal(repairClip.engine.world.holders['lantern-clip'].quantities['stock:wool'], 9);
            assert.equal(repairClip.engine.world.holders['lantern-clip'].quantities['stock:fine-wool'], 0);
            assert.deepEqual(repairClip.lifecycle.individuals[baby.id], supplied.lifecycle.individuals[baby.id]);
            const duplicate = conditionAdvance(restore(queue(later, LANTERN_COAT_GRAFT, 'repeat-graft', {keeper})), 26);
            assert.equal(duplicate.engine.records.workings['repeat-graft'].record.receipts[0].reason,
                'lantern-coat-graft-already-applied');
            assert.equal(duplicate.engine.world.holders[KEEPER].quantities[graft], 1);

            const extract = brewDoseQuantity('lantern-coat-repair-extract');
            const liquid = 'energy:lantern-coat-repair-liquid';
            const kitchen = {...expired, engine: applyEngineOps(expired.engine, [
                ...[['repair-flask', 'flask'], ['repair-pot', 'vessel'], ['repair-moss', 'lot'], ['repair-binder', 'lot']]
                    .map(([id, role]) => ({op: 'holder_add', value: {id, kind: 'thing', as: [role], place: pen.id,
                        quantities: role === 'lot' ? {[brewMeasureQuantity]: 3} : {}}})),
                {op: 'carry', holder: baby.id, quantity: liquid},
            ], 'prepare-repair-brew')};
            const brew = (options = {}) => ({...kitchen, engine: startEngineWorking(kitchen.engine, {
                law: BREW_LAW, method: lanternCoatRepairBrew(options), id: 'repair-brew',
                bindings: {vessel: {kind: 'vessel', id: 'repair-pot'}, flask: {kind: 'flask', id: 'repair-flask'},
                    moss: {kind: 'lot', id: 'repair-moss'}, binder: {kind: 'lot', id: 'repair-binder'}},
            })});
            const pendingBrew = brew();
            const bottled = conditionAdvance(restore(conditionAdvance(pendingBrew, 13)), 14);
            assert.deepEqual(serializeEngineWorld(bottled.engine), serializeEngineWorld(conditionAdvance(pendingBrew, 14).engine));
            assert.equal(bottled.engine.world.holders['repair-moss'].quantities[brewMeasureQuantity], 1);
            assert.equal(bottled.engine.world.holders['repair-binder'].quantities[brewMeasureQuantity], 1);
            assert.equal(bottled.engine.world.holders['repair-flask'].quantities[extract], 4);
            assert.deepEqual(brewBalance(bottled.engine.records.workings['repair-brew'].record.facts),
                {admitted: 4, held: 0, released: 4, balanced: true});
            const serving = (pair, options) => ({...pair, engine: startEngineWorking(pair.engine, {
                law: BREW_DOSE_LAW, method: lanternCoatRepairDose(options), id: 'repair-serving',
                bindings: {recipient: subject, flask: {kind: 'flask', id: 'repair-flask'}},
            })});
            const understeeped = conditionAdvance(restore(brew({steepMinutes: 1})), 14);
            const inert = conditionAdvance(restore(serving(understeeped)), 16);
            assert.equal(understeeped.engine.world.holders['repair-flask'].quantities[extract], undefined);
            assert.equal(inert.engine.world.holders[baby.id].quantities[repair], undefined);
            const applied = conditionAdvance(restore(serving(bottled)), 16);
            assert.equal(applied.engine.world.holders['repair-flask'].quantities[extract], 2);
            assert.equal(applied.engine.world.holders[baby.id].quantities[extract], 2);
            assert.equal(applied.engine.world.holders[baby.id].quantities[liquid], 0);
            assert.equal(applied.engine.world.holders[baby.id].quantities[repair], 3);
            for (const options of [{route: 'oral'}, {amount: 1}]) {
                const control = conditionAdvance(restore(serving(bottled, options)), 16);
                assert.equal(control.engine.world.holders[baby.id].quantities[repair], undefined);
            }
            const rebuilt = conditionAdvance(restore(conditionAdvance(applied, 17)), 19);
            assert.equal(rebuilt.engine.world.holders[baby.id].quantities[repair], 0);
            const brewedFlash = conditionAdvance(restore(queue(rebuilt, LANTERN_FLASH, 'brew-repair-flash')), 20);
            assert.equal(brewedFlash.engine.world.holders[pen.id].quantities[light], 8);
            assert.equal(brewedFlash.engine.world.holders[baby.id].quantities[charge], 0);

            const stamina = 'energy:stamina';
            const spellScene = {...expired, engine: applyEngineOps(expired.engine, [
                {op: 'carry', holder: baby.id, quantity: 'vitality', amount: 10},
                {op: 'carry', holder: KEEPER, quantity: stamina, amount: 5},
                {op: 'holder_add', value: {id: 'repair-wand', kind: 'thing', place: pen.id,
                    properties: {marks: [`grip:${KEEPER}`]}}},
            ], 'prepare-coat-repair-contact')};
            const cast = (pair, delta = 2) => ({...pair, engine: startEngineWorking(pair.engine, {
                ...spellEffectMethod([{
                    sentence: {verb: 'transform', object: 'vitality', target: 'body', time: 'instant', carrier: 'wand', cost: 'stamina'},
                    target: {id: baby.id}, minutes: 1, grip: {caster: KEEPER, implement: 'repair-wand'},
                    contact: {links: 0}, details: {delta, cost: 2},
                }]), id: 'coat-repair-spell', payer: KEEPER,
            })});
            const pendingCast = cast(spellScene);
            const landed = conditionAdvance(restore(pendingCast), 13);
            assert.deepEqual(serializeEngineWorld(landed.engine), serializeEngineWorld(conditionAdvance(pendingCast, 13).engine));
            assert.equal(landed.engine.world.holders[KEEPER].quantities[stamina], 3);
            assert.equal(landed.engine.world.holders[baby.id].quantities.vitality, 12);
            assert.equal(landed.engine.world.holders[baby.id].quantities[repair], 3);
            const weakCast = conditionAdvance(restore(cast(spellScene, 1)), 13);
            assert.equal(weakCast.engine.world.holders[baby.id].quantities.vitality, 11);
            assert.equal(weakCast.engine.world.holders[baby.id].quantities[repair], undefined);
            const warded = {...pendingCast, engine: applyEngineOps(pendingCast.engine, [{op: 'law_add', field: {
                id: 'repair-ward', scope: baby.id, kind: 'block', params: {verb: 'transform', object: 'vitality'},
            }}], 'ward-coat-repair')};
            const blockedCast = conditionAdvance(restore(warded), 13);
            assert.equal(blockedCast.engine.world.holders[baby.id].quantities.vitality, 10);
            assert.equal(blockedCast.engine.world.holders[baby.id].quantities[repair], undefined);
            const spellRepaired = conditionAdvance(restore(conditionAdvance(landed, 14)), 16);
            const spellFlash = conditionAdvance(restore(queue(spellRepaired, LANTERN_FLASH, 'spell-repair-flash')), 17);
            assert.equal(spellFlash.engine.world.holders[pen.id].quantities[light], 8);
            assert.equal(spellFlash.engine.world.holders[baby.id].quantities[charge], 0);
            assert.deepEqual(spellFlash.lifecycle.individuals[baby.id], supplied.lifecycle.individuals[baby.id]);

            const leaves = 'stock:vitality-leaf', stem = 'gu_rooted_leaves';
            const water = 'stock:water', essence = 'energy:primeval.rank2';
            const guScene = {...expired, engine: applyEngineOps(expired.engine, [
                {op: 'carry', holder: baby.id, quantity: 'vitality', amount: 10},
                {op: 'property', holder: baby.id, property: 'alive', value: true},
                {op: 'property', holder: baby.id, property: 'gu_vitality_limit', value: 12},
                {op: 'carry', holder: KEEPER, quantity: essence, amount: 2},
                {op: 'holder_add', value: {id: 'leaf-garden', kind: 'place', quantities: {daylight: 1}}},
                {op: 'move', holder: KEEPER, to: 'leaf-garden'},
                {op: 'holder_add', value: {id: 'leaf-water', kind: 'thing', place: 'leaf-garden', as: ['supply'],
                    quantities: {[water]: 2}}},
                {op: 'holder_add', value: {id: 'leaf-grass', kind: 'body', place: 'leaf-garden', as: ['gu'],
                    tags: ['living.body'], quantities: {satiety: 0, [stem]: 0},
                    properties: {alive: true, gu_kind: 'vitality-grass', gu_keeper: KEEPER, gu_controller: KEEPER},
                    state: {'l.living_body': livingBodyState({species: 'vitality-grass', rate: 1})}}},
            ], 'prepare-vitality-leaf-treatment')};
            const gu = (pair, op, name = op) => {
                const method = guVitalityWorking(op);
                const ids = {operator: KEEPER, producer: 'leaf-grass', plot: 'leaf-garden', cistern: 'leaf-water', patient: baby.id};
                const bindings = Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, {kind, id: ids[role]}]));
                return {...pair, engine: startEngineWorking(pair.engine, {law: GU_VITALITY_WORLD_LAW, method, id: name, bindings})};
            };
            const thirsty = conditionAdvance(restore(gu(guScene, 'grow', 'untended-leaf')), 15);
            assert.equal(thirsty.engine.records.workings['untended-leaf'].record.receipts[0].reason, 'The plant needs tending.');
            assert.equal(thirsty.engine.world.holders[KEEPER].quantities[essence], 2);
            assert.equal(thirsty.engine.world.holders['leaf-water'].quantities[water], 2);
            const tendedLeaf = conditionAdvance(restore(gu(guScene, 'tend')), 13);
            const growingLeaf = gu(tendedLeaf, 'grow');
            const grown = conditionAdvance(restore(conditionAdvance(growingLeaf, 14)), 16);
            assert.deepEqual(serializeEngineWorld(grown.engine), serializeEngineWorld(conditionAdvance(growingLeaf, 16).engine));
            assert.equal(grown.engine.world.holders['leaf-grass'].quantities[stem], 1);
            assert.equal(grown.engine.world.holders['leaf-water'].quantities[water], 0);
            assert.equal(grown.engine.world.holders[KEEPER].quantities[essence], 0);
            const plucked = conditionAdvance(restore(gu(grown, 'pluck')), 17);
            assert.equal(plucked.engine.world.holders['leaf-grass'].quantities[stem], 0);
            assert.equal(plucked.engine.world.holders[KEEPER].quantities[leaves], 1);
            const back = {...plucked, engine: applyEngineOps(plucked.engine, [
                {op: 'move', holder: KEEPER, to: pen.id},
            ], 'bring-leaf-to-patient')};
            const pendingLeaf = gu(back, 'treat', 'leaf-repair');
            const leaf = conditionAdvance(restore(pendingLeaf), 18);
            assert.deepEqual(serializeEngineWorld(leaf.engine), serializeEngineWorld(conditionAdvance(pendingLeaf, 18).engine));
            assert.equal(leaf.engine.world.holders[KEEPER].quantities[leaves], 0);
            assert.equal(leaf.engine.world.holders[baby.id].quantities.vitality, 12);
            assert.equal(leaf.engine.world.holders[baby.id].quantities[repair], 3);
            const smallRoom = {...back, engine: applyEngineOps(back.engine, [
                {op: 'add', holder: baby.id, quantity: 'vitality', amount: 1},
            ], 'leave-room-for-one-point')};
            const weakLeaf = conditionAdvance(restore(gu(smallRoom, 'treat', 'weak-leaf')), 18);
            assert.equal(weakLeaf.engine.world.holders[baby.id].quantities.vitality, 12);
            assert.equal(weakLeaf.engine.world.holders[baby.id].quantities[repair], undefined);
            const unstocked = {...pendingLeaf, engine: applyEngineOps(pendingLeaf.engine, [
                {op: 'set', holder: KEEPER, quantity: leaves, amount: 0},
            ], 'use-leaf-elsewhere')};
            const noLeaf = conditionAdvance(restore(unstocked), 18);
            assert.equal(noLeaf.engine.records.workings['leaf-repair'].record.receipts[0].reason, 'No detached leaf is available.');
            assert.equal(noLeaf.engine.world.holders[baby.id].quantities[repair], undefined);
            const leafRepaired = conditionAdvance(restore(conditionAdvance(leaf, 19)), 21);
            const leafFlash = conditionAdvance(restore(queue(leafRepaired, LANTERN_FLASH, 'leaf-repair-flash')), 22);
            assert.equal(leafFlash.engine.world.holders[pen.id].quantities[light], 8);
            assert.equal(leafFlash.engine.world.holders[baby.id].quantities[charge], 0);
            assert.deepEqual(leafFlash.lifecycle.individuals[baby.id], supplied.lifecycle.individuals[baby.id]);

            const sunny = {...leafFlash, engine: applyEngineOps(leafFlash.engine, [
                {op: 'carry', holder: pen.id, quantity: 'daylight', amount: 1},
                {op: 'holder_add', value: {id: 'repair-wool-lamp', kind: 'thing', place: pen.id,
                    properties: {'lantern-wool-lamp': true}}},
            ], 'daylight-after-leaf-repair')};
            const charged = conditionAdvance(restore(sunny), 24);
            assert.equal(charged.engine.world.holders[baby.id].quantities[charge], 2);
            const wool = {kind: 'thing', id: 'lantern-clip'};
            const clipPending = queue(charged, LANTERN_CLIP, 'leaf-repair-clip', {wool});
            const sheared = conditionAdvance(restore(clipPending), 25);
            assert.deepEqual(serializeEngineWorld(sheared.engine), serializeEngineWorld(conditionAdvance(clipPending, 25).engine));
            assert.equal(sheared.engine.world.holders[baby.id].quantities[charge], 0);
            assert.equal(sheared.engine.world.holders[wool.id].quantities[charge], 3);
            assert.equal(sheared.engine.world.holders[wool.id].quantities['stock:wool'], 9);
            assert.equal(sheared.engine.world.holders[wool.id].quantities['stock:fine-wool'], 0);
            const lamp = {...sheared, engine: startEngineWorking(sheared.engine, {
                law: LANTERN_FLEECE_LAW, method: LANTERN_WOOL_LAMP, id: 'leaf-repair-lamp',
                bindings: {wool, lamp: {kind: 'thing', id: 'repair-wool-lamp'}, site: {kind: 'place', id: pen.id}},
            })};
            const illuminated = conditionAdvance(restore(queue(lamp, LANTERN_FLASH, 'leaf-regrowth-flash')), 26);
            assert.equal(illuminated.engine.records.workings['leaf-regrowth-flash'].record.receipts[0].reason, 'lantern-coat-regrowing');
            assert.equal(illuminated.engine.world.holders[pen.id].quantities[light], 8);
            assert.equal(illuminated.engine.world.holders[wool.id].quantities[charge], 1);
            const regrown = conditionAdvance(restore(illuminated), 29);
            assert.equal(regrown.engine.world.holders[pen.id].quantities[light], 0);
            assert.equal(regrown.engine.world.holders[baby.id].quantities[charge], 0);
            const flashedAgain = conditionAdvance(restore(queue(regrown, LANTERN_FLASH, 'leaf-regrown-flash')), 30);
            assert.equal(flashedAgain.engine.world.holders[pen.id].quantities[light], 8);
            assert.equal(flashedAgain.engine.world.holders[baby.id].quantities[charge], 0);
            assert.equal(flashedAgain.engine.world.holders[baby.id].quantities[repair], 0);
            assert.deepEqual(flashedAgain.lifecycle.individuals[baby.id], supplied.lifecycle.individuals[baby.id]);

            const moonTrial = (pair, daylightOp) => ({...pair, engine: applyEngineOps(pair.engine, [
                {op: daylightOp, holder: pen.id, quantity: 'daylight', amount: 0},
                {op: 'carry', holder: pen.id, quantity: 'moon_phase', amount: 4},
            ], 'full-moon-coat-trial')});
            const veil = pair => ({...pair, engine: startEngineWorking(pair.engine, {
                law: LANTERN_EVOLUTION.law, method: LANTERN_EVOLUTION.methods['moon-veil'], id: 'repair-moon-veil',
                bindings: {animal: subject, site: {kind: 'place', id: pen.id}},
            })});
            const unrepaired = conditionAdvance(restore(veil(moonTrial(expired, 'carry'))), 13);
            assert.equal(unrepaired.engine.records.workings['repair-moon-veil'].record.receipts[0].reason, 'evolution-condition-changed');
            assert.equal(unrepaired.engine.world.holders[baby.id].quantities[charge], 1);
            const sustained = {...treated, engine: applyEngineOps(treated.engine, [
                {op: 'property', holder: baby.id, property: 'lantern-sustain-mist-veil', value: true},
                {op: 'set', holder: baby.id, quantity: charge, amount: 3},
            ], 'prepare-wash-sustained-veil')};
            const washedVeil = conditionAdvance(restore(veil(moonTrial(sustained, 'carry'))), 9);
            assert.equal(creatureForm(washedVeil.engine.world.holders[baby.id], 9), 'moon-fleece');
            const washedBeam = conditionAdvance(restore(queue(washedVeil, LANTERN_MOONBEAM, 'washed-moonbeam')), 10);
            assert.equal(washedBeam.engine.world.holders[pen.id].quantities[light], 24);
            const lastWashMinute = conditionAdvance(washedBeam, 11);
            const expiry = conditionAdvance(restore(queue(lastWashMinute, LANTERN_MOONBEAM, 'expiry-moonbeam')), 12);
            assert.equal(creatureForm(expiry.engine.world.holders[baby.id], 12), 'lantern-fleece');
            assert.equal(expiry.engine.records.workings['expiry-moonbeam'].record.receipts[0].reason, 'moonbeam-needs-moon-fleece');
            assert.equal(expiry.engine.world.holders[baby.id].quantities[charge], 1);
            const jump = advanceEngineWorld(washedVeil.engine, 14).engine;
            const split = advanceEngineWorld(restore({...washedVeil,
                engine: advanceEngineWorld(washedVeil.engine, 12).engine}).engine, 14).engine;
            assert.deepEqual(serializeEngineWorld(jump), serializeEngineWorld(split));
            assert.equal(creatureForm(jump.world.holders[baby.id], 14), 'lantern-fleece');
            const graftSupply = {...sustained, engine: applyEngineOps(sustained.engine, [
                {op: 'carry', holder: KEEPER, quantity: graft, amount: 1},
            ], 'prepare-graft-during-wash')};
            const graftStarted = conditionAdvance(restore(queue(graftSupply, LANTERN_COAT_GRAFT, 'wash-to-graft', {keeper})), 9);
            assert.equal(graftStarted.engine.world.holders[KEEPER].quantities[graft], 0);
            const graftVeil = conditionAdvance(restore(veil(moonTrial(graftStarted, 'carry'))), 10);
            const graftTakesOver = conditionAdvance(restore(graftVeil), 12);
            assert.equal(graftTakesOver.engine.world.holders[baby.id].quantities[repair], 0);
            assert.equal(creatureForm(graftTakesOver.engine.world.holders[baby.id], 12), 'moon-fleece');
            const pendingVeil = veil(moonTrial(charged, 'set'));
            const veiled = conditionAdvance(restore(pendingVeil), 25);
            assert.deepEqual(serializeEngineWorld(veiled.engine), serializeEngineWorld(conditionAdvance(pendingVeil, 25).engine));
            assert.equal(creatureForm(veiled.engine.world.holders[baby.id], 25), 'moon-fleece');
            assert.equal(veiled.engine.world.holders[baby.id].quantities[charge], 1);
            const moonbeam = conditionAdvance(restore(queue(veiled, LANTERN_MOONBEAM, 'repaired-moonbeam')), 26);
            assert.equal(moonbeam.engine.world.holders[pen.id].quantities[light], 24);
            const reverted = conditionAdvance(restore(moonbeam), 31);
            assert.equal(creatureForm(reverted.engine.world.holders[baby.id], 31), 'lantern-fleece');
            assert.equal(reverted.engine.world.holders[baby.id].quantities[repair], 0);
            assert.equal(reverted.engine.world.holders[baby.id].quantities[charge], 0);
            assert.deepEqual(reverted.lifecycle.individuals[baby.id], supplied.lifecycle.individuals[baby.id]);

            const moonPasture = {...pen, id: 'moon-pasture'};
            const underSky = {...charged, engine: applyEngineOps(charged.engine, [
                {op: 'holder_add', value: {id: moonPasture.id, kind: 'place', tags: ['sky'],
                    quantities: {humidity: 60, daylight: 1, moon_phase: 4, [light]: 0}}},
                {op: 'move', holder: baby.id, to: moonPasture.id},
            ], 'take-repaired-coat-under-sky')};
            underSky.lifecycle = transferCreature(underSky.lifecycle, {revision: underSky.lifecycle.revision,
                id: baby.id, fromKeeper: KEEPER, toKeeper: KEEPER, destination: moonPasture, clock: 24});
            const dusk = conditionAdvance(restore(underSky), 25);
            assert.deepEqual(serializeEngineWorld(dusk.engine), serializeEngineWorld(conditionAdvance(underSky, 25).engine));
            assert.equal(dusk.engine.world.holders[moonPasture.id].quantities.daylight, 0);
            assert.equal(creatureForm(dusk.engine.world.holders[baby.id], 25), 'moon-fleece');
            assert.equal(dusk.engine.world.holders[baby.id].quantities[charge], 2);
            const noRepair = {...underSky, engine: applyEngineOps(underSky.engine, [
                {op: 'set', holder: baby.id, quantity: repair, amount: 3},
            ], 'compare-unfinished-repair')};
            const unfinished = conditionAdvance(restore(noRepair), 25);
            assert.equal(creatureForm(unfinished.engine.world.holders[baby.id], 25), 'lantern-fleece');
            assert.equal(unfinished.engine.world.holders[baby.id].quantities[charge], 3);
            const skyBeam = conditionAdvance(restore(queue(dusk, LANTERN_MOONBEAM, 'dusk-moonbeam')), 26);
            assert.equal(skyBeam.engine.world.holders[moonPasture.id].quantities[light], 24);
            const arrival = {...skyBeam, engine: startEngineWorking(skyBeam.engine, {
                ...spellEffectMethod([{
                    sentence: {verb: 'move', object: 'position', target: 'body', time: 'instant', carrier: 'wand'},
                    target: {id: baby.id}, minutes: 1, details: {target: {shape: 'holder', id: baby.id}, to: pen.id},
                }]), id: 'daylight-coat-return',
            })};
            const daylit = conditionAdvance(restore(arrival), 27);
            const returnedBody = daylit.engine.world.holders[baby.id];
            assert.equal(returnedBody.place, pen.id);
            assert.equal(creatureForm(returnedBody, 27), 'lantern-fleece');
            assert.equal(returnedBody.properties['temporary-form'], undefined);
            assert.equal(returnedBody.quantities[repair], 0);
            assert.equal(returnedBody.quantities[charge], 1);
            assert.equal(returnedBody.refs.creature, baby.id);
            assert.equal(daylit.engine.world.holders[moonPasture.id].quantities[light], 24);
            const home = {...daylit, lifecycle: transferCreature(daylit.lifecycle, {revision: daylit.lifecycle.revision,
                id: baby.id, fromKeeper: KEEPER, toKeeper: KEEPER, destination: pen, clock: 27})};
            const baseFlash = conditionAdvance(restore(queue(home, LANTERN_FLASH, 'daylight-base-flash')), 28);
            assert.equal(baseFlash.engine.world.holders[moonPasture.id].quantities[light], 0);
            assert.equal(baseFlash.engine.world.holders[pen.id].quantities[light], 8);
            assert.deepEqual(baseFlash.lifecycle.individuals[baby.id], {
                ...supplied.lifecycle.individuals[baby.id], health: {lastAt: 27, careUntil: null, injury: null},
            });

            const prism = 'stock:sun-prism', husk = 'stock:lantern-husk', altar = 'repaired-molt-altar';
            const withAltar = pair => ({...pair, engine: applyEngineOps(pair.engine, [
                {op: 'holder_add', value: {id: altar, kind: 'thing', place: pen.id,
                    quantities: {[prism]: 1, [husk]: 0, [charge]: 0}}},
            ], 'prepare-repaired-sun-molt')});
            const molt = pair => ({...pair, engine: startEngineWorking(pair.engine, {
                law: LANTERN_EVOLUTION.law, method: LANTERN_EVOLUTION.methods['sun-molt'], id: 'repaired-sun-molt',
                bindings: {animal: subject, site: {kind: 'place', id: pen.id}, altar: {kind: 'thing', id: altar}},
            })});
            const washedInSun = withAltar({...aboutToExpire, engine: applyEngineOps(aboutToExpire.engine, [
                {op: 'carry', holder: pen.id, quantity: 'daylight', amount: 1},
                {op: 'set', holder: baby.id, quantity: charge, amount: 8},
            ], 'offer-molt-before-wash-expires')});
            const expiredMolt = conditionAdvance(restore(molt(washedInSun)), 12);
            assert.equal(expiredMolt.engine.records.workings['repaired-sun-molt'].record.receipts[0].reason,
                'evolution-condition-changed');
            assert.deepEqual(expiredMolt.engine.world.holders[altar].quantities, {[prism]: 1, [husk]: 0, [charge]: 0});
            assert.equal(expiredMolt.engine.world.holders[baby.id].quantities[charge], 8);
            const fullCoat = conditionAdvance(restore(withAltar(sunny)), 30);
            assert.equal(fullCoat.engine.world.holders[baby.id].quantities[charge], 8);
            const pendingMolt = molt(fullCoat);
            const molted = conditionAdvance(restore(pendingMolt), 31);
            assert.deepEqual(serializeEngineWorld(molted.engine), serializeEngineWorld(conditionAdvance(pendingMolt, 31).engine));
            assert.equal(creatureForm(molted.engine.world.holders[baby.id], 31), 'beacon-fleece');
            assert.equal(molted.engine.world.holders[baby.id].refs.creature, baby.id);
            assert.equal(molted.engine.world.holders[baby.id].quantities[repair], 0);
            assert.deepEqual(molted.engine.world.holders[altar].quantities, {[prism]: 0, [husk]: 1, [charge]: 0});
            const dark = {...molted, engine: applyEngineOps(molted.engine, [
                {op: 'set', holder: pen.id, quantity: 'daylight', amount: 0},
            ], 'night-after-repaired-molt')};
            const beacon = conditionAdvance(restore(queue(dark, LANTERN_FLASH, 'repaired-beacon-flash')), 32);
            assert.equal(beacon.engine.world.holders[pen.id].quantities[light], 16);
            assert.deepEqual(beacon.lifecycle.individuals[baby.id], supplied.lifecycle.individuals[baby.id]);
            const wisp = 'repaired-husk-wisp';
            const chargeHusk = (pair, shell = altar) => queue(pair, LANTERN_CHARGE_HUSK, 'charge-repaired-husk',
                {keeper, shell: {kind: 'thing', id: shell}});
            const chargingHusk = chargeHusk(beacon);
            const movedKeeper = {...chargingHusk, engine: applyEngineOps(chargingHusk.engine, [
                {op: 'move', holder: KEEPER, to: 'leaf-garden'},
            ], 'keeper-leaves-before-husk-charge')};
            const absent = conditionAdvance(restore(movedKeeper), 33);
            assert.equal(absent.engine.records.workings['charge-repaired-husk'].record.receipts[0].reason,
                'lantern-husk-charge-unavailable');
            assert.equal(absent.engine.world.holders[baby.id].quantities[charge], 7);
            const spareShell = {...beacon, engine: applyEngineOps(beacon.engine, [
                {op: 'holder_add', value: {id: 'unrelated-husk', kind: 'thing', place: pen.id,
                    quantities: {[husk]: 1, [charge]: 0}}},
            ], 'compare-unrelated-husk')};
            const unrelated = conditionAdvance(restore(chargeHusk(spareShell, 'unrelated-husk')), 33);
            assert.equal(unrelated.engine.records.workings['charge-repaired-husk'].record.receipts[0].reason,
                'lantern-husk-charge-unavailable');
            assert.equal(unrelated.engine.world.holders['unrelated-husk'].quantities[charge], 0);
            const chargedHusk = conditionAdvance(restore(chargingHusk), 33);
            assert.deepEqual(serializeEngineWorld(chargedHusk.engine), serializeEngineWorld(conditionAdvance(chargingHusk, 33).engine));
            assert.equal(chargedHusk.engine.world.holders[altar].quantities[charge], 1);
            const awakening = awakenLanternHusk(restore(chargedHusk).engine,
                {parent: baby.id, huskHolder: altar, offspring: wisp});
            assert.equal(awakening.ok, true);
            assert.equal(awakening.engine.world.holders[baby.id].quantities[charge], 6);
            assert.deepEqual(readLineage(awakening.engine.world, wisp)[0].parents, [baby.id]);
            assert.deepEqual(awakening.engine.world.holders[altar].quantities, {[prism]: 0, [husk]: 0, [charge]: 0});
            const settledBeacon = conditionAdvance(restore({...chargedHusk, engine: awakening.engine}), 34);
            assert.equal(awakenLanternHusk(settledBeacon.engine,
                {parent: baby.id, huskHolder: altar, offspring: 'second-repaired-wisp'}).ok, false);
            const pendingGlow = startEngineWorking(settledBeacon.engine, {
                law: LANTERN_FLEECE_LAW, method: LANTERN_WISP_GLOW, id: 'repaired-husk-glow',
                bindings: {animal: {kind: 'body', id: wisp}},
            });
            const wispGlow = conditionAdvance(restore({...settledBeacon, engine: pendingGlow}), 35);
            assert.equal(wispGlow.engine.world.holders[pen.id].quantities[light], 6);
            assert.equal(wispGlow.engine.world.holders[wisp].quantities[charge], 0);

            const parcel = 'uncharged-molt-parcel';
            const packed = packLanternHusk(restore(beacon).engine, {parent: baby.id, altar, parcel, keeper: KEEPER});
            assert.equal(packed.ok, true);
            assert.deepEqual(packed.engine.world.holders[parcel].quantities, {[husk]: 1, [charge]: 0});
            assert.equal(packed.engine.world.holders[altar].quantities[husk], 0);
            const parcelScene = {...beacon, engine: packed.engine};
            const pendingParcel = chargeHusk(parcelScene, parcel);
            const buyer = 'husk-buyer';
            const buyerPresent = applyEngineOps(pendingParcel.engine, [
                {op: 'holder_add', value: {id: buyer, kind: 'body', place: pen.id}},
            ], 'bring-husk-buyer');
            const traded = tradeLanternHusk(buyerPresent, {parcel, seller: KEEPER, buyer, price: 0});
            assert.equal(traded.ok, true);
            const lostCustody = conditionAdvance(restore({...pendingParcel, engine: traded.engine}), 33);
            assert.equal(lostCustody.engine.records.workings['charge-repaired-husk'].record.receipts[0].reason,
                'lantern-husk-charge-unavailable');
            assert.equal(lostCustody.engine.world.holders[parcel].quantities[charge], 0);
            assert.equal(lostCustody.engine.world.holders[baby.id].quantities[charge], 7);
            const chargedParcel = conditionAdvance(restore(pendingParcel), 33);
            assert.equal(chargedParcel.engine.world.holders[parcel].quantities[charge], 1);
            assert.equal(chargedParcel.engine.world.holders[baby.id].quantities[charge], 6);
            const parcelWisp = awakenLanternHusk(restore(chargedParcel).engine,
                {parent: baby.id, huskHolder: parcel, offspring: 'packed-repair-wisp', keeper: KEEPER});
            assert.equal(parcelWisp.ok, true);
            assert.deepEqual(readLineage(parcelWisp.engine.world, 'packed-repair-wisp')[0].parents, [baby.id, parcel]);
            assert.deepEqual(parcelWisp.engine.world.holders[parcel].quantities, {[husk]: 0, [charge]: 0});
        }
        return clip.lifecycle.individuals[baby.id];
    };
    const ordinary = imprintTrial(60, 20, 9, 0, 8), imprinted = imprintTrial(70, 20, 5, 0, 0);
    assert.deepEqual(imprinted, {...ordinary, incubationCondition: imprint.condition});
    const warm = imprintTrial(60, 30, 0, 9, 8);
    assert.deepEqual(warm, {...ordinary, incubationCondition: warmth.condition});
    const both = imprintTrial(70, 30, 0, 5, 0);
    assert.deepEqual(both, {...ordinary, incubationConditions: [imprint.condition, warmth.condition]});
    const born = (humidity, expected) => {
        const paired = advance(start(humidity), 1, 1);
        const [[broodId, brood]] = Object.entries(paired.lifecycle.broods);
        assert.deepEqual(brood.parents, expected);
        const maturity = humidity >= 60 ? 3 : 5;
        assert.equal(brood.growthMinutes, maturity - 2);
        const drying = {...paired, engine: applyEngineOps(paired.engine, [
            {op: 'set', holder: pen.id, quantity: 'humidity', amount: 59},
        ], 'dry-after-conception')};
        const direct = advance(drying, 2, 0), saved = restore(advance(restore(drying), 2, 0));
        assert.deepEqual(saved.lifecycle, direct.lifecycle);
        assert.deepEqual(serializeEngineWorld(saved.engine), serializeEngineWorld(direct.engine));
        const [childId, lamb] = Object.entries(saved.lifecycle.individuals).find(([, animal]) => animal.bornAt === 2);
        assert.equal(saved.engine.world.holders[childId].refs.creature, childId);
        assert.equal(saved.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], brood.growthMinutes);
        assert.equal(lamb.matureAt, maturity);
        assert.equal(planMeadowFleece(childId, lamb, 5, {genome, clock: maturity - 1}).ok, false);
        const unfed = applyEngineOps(saved.engine, [{op: 'set', holder: childId, quantity: 'satiety', amount: 0}], 'empty-ration');
        const delayed = advance(restore({...saved, engine: unfed}), maturity, 0);
        assert.equal(delayed.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], brood.growthMinutes);
        const adopt = (pair, destination) => takeTrackedWorldCreature(pair, {revision: pair.lifecycle.revision,
            id: childId, keeper: KEEPER, destination});
        const adopted = adopt(delayed, pen);
        const animal = {kind: 'body', id: childId}, wool = {kind: 'thing', id: 'lantern-clip'};
        const work = (pair, method, id, bindings) => {
            const engine = startEngineWorking(pair.engine, {law: LANTERN_FLEECE_LAW, method, id,
                bindings: {animal, ...bindings}});
            return advance(restore({...pair, engine}), pair.engine.world.clock + 1, 0);
        };
        const blocked = work(restore(adopted), LANTERN_CLIP, 'hungry-clip', {wool});
        assert.equal(blocked.engine.records.workings['hungry-clip'].record.receipts[0].reason, 'lantern-coat-regrowing');
        assert.equal(blocked.engine.world.holders[wool.id].quantities['stock:fine-wool'], 0);
        const stocked = applyEngineOps(delayed.engine, [
            {op: 'add', holder: pen.id, quantity: MEADOW_FORAGE, amount: 1},
        ], 'stock-wild-pasture');
        const grazed = advance(restore({...delayed, engine: stocked}), maturity + 1, 0);
        assert.equal(grazed.engine.world.holders[pen.id].quantities[MEADOW_FORAGE], 0);
        assert.equal(grazed.engine.world.holders[childId].quantities.satiety, 4);
        assert.equal(grazed.lifecycle.individuals[childId].keeper, null);
        const grazedMature = advance(restore(grazed), maturity + 1 + brood.growthMinutes, 0);
        assert.equal(grazedMature.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], 0);
        const wildClip = work(grazedMature, LANTERN_CLIP, 'wild-fed-clip', {wool});
        assert.equal(wildClip.engine.world.holders[wool.id].quantities['stock:fine-wool'], humidity >= 60 ? 9 : 5);
        assert.equal(wildClip.engine.world.holders[KEEPER].quantities[hay], 1);
        const fed = work(blocked, LANTERN_FEED, 'paid-ration', {keeper: {kind: 'body', id: KEEPER}});
        assert.equal(fed.engine.world.holders[KEEPER].quantities[hay], 0);
        const recovered = advance(restore(fed), fed.engine.world.clock + brood.growthMinutes, 0);
        assert.equal(recovered.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], 0);
        const clipped = work(recovered, LANTERN_CLIP, 'fed-clip', {wool});
        assert.equal(clipped.engine.world.holders[wool.id].quantities['stock:fine-wool'], humidity >= 60 ? 9 : 5);

        const pasture = {...pen, id: 'pasture'};
        const excursion = {...delayed, engine: applyEngineOps(delayed.engine, [
            {op: 'holder_add', value: {id: pasture.id, kind: 'place', quantities: {[MEADOW_FORAGE]: 1}}},
            {op: 'link_add', link: {id: 'pasture-path', kind: 'grazing-path', from: pen.id, to: pasture.id}},
            {op: 'property', holder: childId, property: GRAZING_HOME, value: pen.id},
        ], 'open-nearby-pasture')};
        const away = restore(advance(excursion, maturity + 1, 0));
        assert.equal(away.engine.world.holders[childId].place, pasture.id);
        assert.throws(() => adopt(away, pasture), /needs to meet/);
        const meeting = {...away, engine: applyEngineOps(away.engine, [
            {op: 'move', holder: KEEPER, to: pasture.id}, {op: 'move', holder: wool.id, to: pasture.id},
        ], 'meet-grazing-lamb')};
        assert.throws(() => adopt(meeting, {...pasture, capacity: 0}), /insufficient space/);
        const received = restore(adopt(meeting, pasture));
        const {keeper, habitat, health, ...inheritance} = received.lifecycle.individuals[childId];
        const original = away.lifecycle.individuals[childId];
        assert.deepEqual({...inheritance, keeper: original.keeper, habitat: original.habitat, health: original.health}, original);
        assert.equal(keeper, KEEPER);
        assert.equal(habitat, pasture.id);
        assert.equal(received.engine.world.holders[childId].refs.creature, childId);
        assert.equal(received.engine.world.holders[childId].properties[GRAZING_HOME], pasture.id);
        assert.throws(() => adopt(received, pasture), /custody/);
        const pastureMature = advance(received, maturity + 2 + brood.growthMinutes, 0);
        assert.equal(pastureMature.engine.world.holders[childId].place, pasture.id);
        assert.equal(pastureMature.engine.world.holders[pasture.id].quantities[MEADOW_FORAGE], 0);
        const pastureClip = work(pastureMature, LANTERN_CLIP, 'pasture-clip', {wool});
        assert.equal(pastureClip.engine.world.holders[wool.id].quantities['stock:fine-wool'], humidity >= 60 ? 9 : 5);

        const wounded = {...away, lifecycle: injureCreature(away.lifecycle, {revision: away.lifecycle.revision,
            id: childId, clock: maturity + 1, kind: 'sprain', recoveryMinutes: 2})};
        const hurtGrazer = advance(restore(wounded), maturity + 2, 0);
        assert.equal(hurtGrazer.engine.world.holders[childId].place, pasture.id);
        assert.equal(hurtGrazer.engine.world.holders[childId].quantities.satiety, 4);
        assert.equal(hurtGrazer.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], brood.growthMinutes);
        const tended = adopt({...hurtGrazer, engine: applyEngineOps(hurtGrazer.engine, [
            {op: 'move', holder: KEEPER, to: pasture.id}, {op: 'move', holder: wool.id, to: pasture.id},
        ], 'meet-wounded-grazer')}, pasture);
        const care = {...tended, lifecycle: startCreatureCare(tended.lifecycle, {revision: tended.lifecycle.revision,
            id: childId, keeper: KEEPER, clock: maturity + 2, duration: 2})};
        const healed = advance(restore(advance(care, maturity + 3, 0)), maturity + 4, 0);
        assert.deepEqual(serializeEngineWorld(healed.engine), serializeEngineWorld(advance(care, maturity + 4, 0).engine));
        assert.equal(healed.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], brood.growthMinutes);
        const beforeMaturity = work(advance(care, maturity + 3, 0), LANTERN_CLIP, 'clip-at-healing', {wool});
        assert.equal(beforeMaturity.engine.records.workings['clip-at-healing'].record.receipts[0].reason, 'lantern-coat-regrowing');
        const rationed = work(healed, LANTERN_FEED, 'care-ration', {keeper: {kind: 'body', id: KEEPER}});
        assert.equal(rationed.engine.world.holders[KEEPER].quantities[hay], 0);
        const afterCare = advance(restore(rationed), maturity + 4 + brood.growthMinutes, 0);
        assert.equal(afterCare.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], 0);
        const careClip = work(afterCare, LANTERN_CLIP, 'recovered-grazer-clip', {wool});
        assert.equal(careClip.engine.world.holders[wool.id].quantities['stock:fine-wool'], humidity >= 60 ? 9 : 5);

        const kept = takeTrackedWorldCreature(paired, {revision: paired.lifecycle.revision,
            id: brood.parents[0], keeper: KEEPER, destination: pen});
        const deliver = pair => settleKeptWorldBirth(pair, {revision: pair.lifecycle.revision, broodId,
            destination: pen, world: birthPolicy});
        assert.throws(() => deliver(paired), /carrier in custody/);
        assert.throws(() => deliver(kept), /birth is due/);
        const due = advance(restore(kept), 2, 0);
        assert.deepEqual(due.lifecycle.broods[broodId], brood);
        assert.equal(due.lifecycle.habitats[pen.id].births, 0);
        assert.throws(() => settleKeptWorldBirth(due, {revision: due.lifecycle.revision, broodId,
            destination: {...pen, capacity: parents.length}, world: birthPolicy}), /insufficient space/);
        const delivery = deliver(due);
        const keptLamb = restore(delivery);
        assert.equal(delivery.id, childId);
        assert.deepEqual(delivery.lifecycle, deliver(restore(due)).lifecycle);
        assert.deepEqual(serializeEngineWorld(delivery.engine), serializeEngineWorld(deliver(restore(due)).engine));
        assert.deepEqual(keptLamb.lifecycle.individuals[childId], {...lamb, keeper: KEEPER});
        assert.deepEqual(readLineage(keptLamb.engine.world, childId).at(-1).parents, brood.parents);
        assert.throws(() => deliver(keptLamb), /birth is due/);
        const keptClip = work(advance(keptLamb, maturity, 0), LANTERN_CLIP, 'kept-birth-clip', {wool});
        assert.equal(keptClip.engine.world.holders[wool.id].quantities['stock:fine-wool'], humidity >= 60 ? 9 : 5);

        const unpaired = advance(start(humidity), 1, 0);
        const held = brood.parents.reduce((pair, id) => takeTrackedWorldCreature(pair, {
            revision: pair.lifecycle.revision, id, keeper: KEEPER, destination: pen,
        }), unpaired);
        const conception = startCreatureBrood(held.lifecycle, {revision: held.lifecycle.revision, parents: brood.parents,
            keeper: KEEPER, clock: 1, gestationMinutes: 1, growthMinutes: 3, root: id, genome,
            developmentEnvironment: {humidity}});
        const pregnancy = {...held, lifecycle: conception.state};
        const release = (pair, birthGenome = genome, keeper = KEEPER) => releaseTrackedWorldCreature(pair, {
            revision: pair.lifecycle.revision, id: brood.parents[0], keeper, destination: pen, cohortId: id, birthGenome,
        });
        const wrongKeeper = {...pregnancy, engine: applyEngineOps(pregnancy.engine, [
            {op: 'holder_add', value: {id: 'stranger', kind: 'body', place: pen.id}},
        ], 'add-nearby-stranger')};
        assert.throws(() => release(wrongKeeper, genome, 'stranger'), /custody/);
        assert.throws(() => release(pregnancy, {...genome, id: 'other-genome'}), /carried brood’s genome/);
        const dueBeforeRelease = advance(restore(pregnancy), 2, 0);
        const releasedLate = release(dueBeforeRelease);
        assert.equal(releasedLate.lifecycle.habitats[pen.id].births, 0);
        const lateBirth = advance(restore(releasedLate), 3, 0);
        assert.deepEqual(lateBirth.lifecycle.individuals[childId], {...lamb, bornAt: 3, matureAt: maturity + 1,
            health: {...lamb.health, lastAt: 3}});
        const legacyLifecycle = JSON.parse(JSON.stringify(pregnancy.lifecycle));
        delete legacyLifecycle.broods[conception.id].genomeId;
        const legacy = {...pregnancy, lifecycle: restoreCreatureLifecycle(legacyLifecycle)};
        assert.equal(release(legacy).lifecycle.broods[conception.id].wildGenome, genome.id);
        const released = release(restore(pregnancy));
        const scheduled = released.lifecycle.broods[conception.id];
        assert.equal(scheduled.wild, id);
        assert.equal(scheduled.wildGenome, genome.id);
        assert.equal(scheduled.dueAt, brood.dueAt);
        assert.equal(released.lifecycle.individuals[brood.parents[0]].keeper, null);
        assert.equal(released.lifecycle.individuals[brood.parents[1]].keeper, KEEPER);
        const returned = advance(restore(released), 2, 0), directReturn = advance(released, 2, 0);
        assert.deepEqual(returned.lifecycle, directReturn.lifecycle);
        assert.deepEqual(serializeEngineWorld(returned.engine), serializeEngineWorld(directReturn.engine));
        assert.equal(returned.lifecycle.habitats[pen.id].births, 1);
        assert.deepEqual(returned.lifecycle.broods, {});
        assert.deepEqual(returned.lifecycle.individuals[childId], lamb);
        assert.deepEqual(readLineage(returned.engine.world, childId).at(-1).parents, brood.parents);
        const returnedClip = work(advance(returned, maturity, 0), LANTERN_CLIP, 'released-birth-clip', {wool});
        assert.equal(returnedClip.engine.world.holders[wool.id].quantities['stock:fine-wool'], humidity >= 60 ? 9 : 5);

        const ready = advance(saved, maturity, 0);
        assert.equal(ready.engine.world.holders[childId].quantities[JUVENILE_GROWTH.id], 0);
        const clip = planMeadowFleece(childId, lamb, 5, {
            genome, clock: ready.engine.world.clock, environment: {humidity: 59},
        });
        assert.equal(clip.ok, true);
        const engine = applyEngineOps(ready.engine, clip.effects.map(({key, amount}) => ({
            op: 'add', holder: 'clip', quantity: key === FINE_WOOL_KEY ? 'stock:fine-wool' : 'stock:wool', amount,
        })), 'tracked-mist-clip');
        return restore({...ready, engine}).engine.world.holders.clip.quantities;
    };
    assert.deepEqual(born(59, parents.slice(2)), {'stock:fine-wool': 5, 'stock:wool': 0});
    assert.deepEqual(born(60, parents.slice(0, 2)), {'stock:fine-wool': 0, 'stock:wool': 5});
});
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
    gestation = GESTATION, late = 0, founders = null, bystander = false}) {
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
            let carrying = brood.state;
            if (bystander) {
                // An unrelated settlement between conception and birth: a gene test on another animal.
                const other = flock().find(animal => animal.id !== first.id && animal.id !== second.id);
                carrying = markCreatureGenesKnown(carrying, {revision: carrying.revision, id: other.id, loci: ['coat']});
            }
            const born = settleCreatureBirth(carrying, {revision: carrying.revision, broodId: brood.id, clock, destination: pen});
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
    // Eight pens are too few to tell no pull from luck (their mean is 5.7 tenths on
    // these draws), so the mean is taken over forty.
    const many = [...SEEDS, ...Array.from({length: 32}, (_, i) => `s${i}`)].map(seed => runProgram({seed, goal: FLEECE}));
    const drift = many.map(r => r.end.woolBreeding - r.history[0].woolBreeding);
    assert.ok(drift.some(d => d > 0) && drift.some(d => d < 0), `wool drift under fleece selection: ${drift}`);
    assert.ok(Math.abs(mean(drift)) < 2, `mean drift ${mean(drift)}`);
    // A one-pair program makes the pen close kin. This genome leaves the
    // optional pedigree effect off.
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

test('6. time: the flock does not depend on when births are settled or what settles in between', () => {
    const prompt = runProgram({seed: 'a', goal: WOOL});
    const late = runProgram({seed: 'a', goal: WOOL, late: 5000});
    const slow = runProgram({seed: 'a', goal: WOOL, gestation: 9000});
    assert.ok(late.clock > prompt.clock * 5);
    assert.deepEqual(late.genes, prompt.genes);
    assert.deepEqual(slow.genes, prompt.genes);
    // A brood is addressed by its pair and litter number, so a gene test on another
    // animal between conception and birth changes no lamb.
    assert.deepEqual(runProgram({seed: 'a', goal: WOOL, bystander: true}).genes, prompt.genes);
    // The far-time form is the cohort's allele counts. Births are computed from the
    // proportion held when the run began, so any partition of twenty births agrees.
    const herd = delta => {
        let state = settleCohortStock(restoreCreatureLifecycle(null), {revision: 0, id: 'hill', species: 'sheep', habitat: market, delta: 10});
        state = setCohortAlleles(state, {revision: state.revision, id: 'hill',
            alleles: Object.fromEntries(Object.keys(genome.loci).map(id => [id, {strong: 8, plain: 12}]))});
        for (let born = 0; born < 20; born += delta)
            state = settleCohortStock(state, {revision: state.revision, id: 'hill', species: 'sheep', habitat: market, delta});
        return state.cohorts.hill;
    };
    assert.deepEqual(herd(20).alleles.fleece, {strong: 24, plain: 36});
    for (const step of [1, 2, 4, 5, 10]) assert.deepEqual(herd(step).alleles, herd(20).alleles, `births settled ${step} at a time`);
});

test('standing phased selection changes twenty windows of offspring and survives reload', () => {
    const {ivs, ...linked} = MEADOW_BREEDING_GENOME;
    const habitat = {...pen, capacity: 24};
    const id = 'standing';
    const restore = state => restoreCreatureLifecycle(JSON.parse(JSON.stringify(state)));
    const add = (state, genes, delta) => settleCohortStock(state, {revision: state.revision, id,
        species: 'sheep', habitat, delta, genome: linked, genes});
    const common = {winter: ['w', 'w'], vigor: ['v', 'v']};
    const fine = {...common, coat: ['d', 'd'], fleece: ['F', 'F']};
    const dark = {...common, coat: ['D', 'D'], fleece: ['f', 'f']};
    const stock = add(add(restoreCreatureLifecycle(), fine, 2), dark, 2);
    const start = openWildHabitat(stock, {revision: stock.revision, id: habitat.id, clock: 0, interval: 10});
    const select = (state, locus, clock = 0) => setPhasedHerdSelection(state,
        {revision: state.revision, id, genome: linked, locus, clock});
    const advance = (state, clock, environment) => advanceWildHabitat(state, {revision: state.revision, habitat, clock,
        populations: [{id, births: 1, losses: 0, root: 'standing', genome: linked, environment}]});
    const selected = select(start, 'fleece');
    const full = advance(restore(selected), 200);
    assert.equal(full.windows, 20);
    assert.equal(full.pending, false);
    const firstHalf = advance(selected, 100).state;
    assert.deepEqual(advance(restore(firstHalf), 200), {...full, windows: 10});
    const catchUp = advance(selected, 700);
    assert.equal(catchUp.pending, true);
    assert.equal(catchUp.state.cohorts[id].stock, habitat.capacity);
    const resumed = advance(restore(catchUp.state), 700);
    assert.equal(resumed.pending, false);
    assert.deepEqual(resumed.state.cohorts, full.state.cohorts);
    assert.throws(() => select(selected, 'coat', 10), /settling the current habitat clock/);
    assert.throws(() => select(start, 'missing'), /locus from its linked genome/);
    const broken = structuredClone(selected);
    broken.habitats[habitat.id].selection.missing = 'fleece';
    assert.throws(() => restore(broken), /Invalid herd selection policy/);

    // A trait that shows equally on all the candidates preserves the neutral draws.
    const neutral = advance(start, 200).state;
    assert.deepEqual(advance(select(start, 'winter'), 200).state.cohorts, neutral.cohorts);
    assert.deepEqual(advance(select(selected, null), 200).state.cohorts, neutral.cohorts);
    const changed = advance(restore(select(firstHalf, 'coat', 100)), 200).state;
    const countFineClips = original => {
        let state = restore(original), clips = 0;
        while (state.cohorts[id].stock > 0) {
            const animal = acquireCreature(state, {revision: state.revision, cohortId: id, destination: habitat, keeper: KEEPER,
                genome: linked, root: 'draw', clock: 200});
            state = animal.state;
            const clip = planMeadowFleece(animal.id, state.individuals[animal.id], 5, {genome: linked, clock: 200});
            if (clip.effects[0].key === FINE_WOOL_KEY) clips++;
        }
        return clips;
    };
    assert.equal(countFineClips(full.state), 22);
    assert.equal(countFineClips(changed), 12);
    assert.equal(countFineClips(advance(select(start, 'coat'), 200).state), 2);
    assert.ok(countFineClips(neutral) < 22);

    const winterFine = {...fine, winter: ['W', 'W']};
    const winterStock = add(add(start, fine, -2), winterFine, 2);
    const winterProgram = select(winterStock, 'winter');
    assert.deepEqual(advance(winterProgram, 200, {cold: 0}).state.cohorts, advance(winterStock, 200).state.cohorts);
    assert.equal(countFineClips(advance(winterProgram, 200, {cold: 1}).state), 22);

    const oneFine = add(add(start, fine, -1), dark, -1);
    const firstCross = advance(select(oneFine, 'fleece'), 10).state.cohorts[id];
    const cross = firstCross.phase.profiles.find(row => row.genes.fleece.includes('F') && row.genes.fleece.includes('f'));
    assert.equal(cross.count, 1);
    for (const [side, coat] of cross.genes.coat.entries())
        assert.equal(cross.genes.fleece[side], coat === 'D' ? 'f' : 'F');
});
