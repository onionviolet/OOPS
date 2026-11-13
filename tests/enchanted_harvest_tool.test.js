import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {readMaterialLineage} from '../src/material_lineage.js';
import {acquireCreature, openWildHabitat, restoreCreatureLifecycle, settleCohortStock} from '../src/creature_lifecycle.js';
import {advancePhasedWorldHerds} from '../src/creature_herd_world.js';
import {MEADOW_BREEDING_GENOME} from '../src/living_genomes.js';
import {readLineage} from '../src/world_substrate.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {recordsOf} from '../src/knowledge_record.js';
import {appraiseLining, crossHeatedLink, fireLiningConfig, forecastLiningFit, INSCRIPTION_STOCK,
    LINING_MATERIAL, PATCH_COVERAGE, REPAIR_STOCK, SALVAGE_STOCK, salvageLooseLining, settleHeatExposure,
    startFireLining, startHideLining, startLiningDetachment, startLiningOffcutJoin, startLiningReweave, startLiningSeparation, startOuterLiningPatch,
    startLiningInscription, wearBreastplate} from '../src/world_packs/fire_resistant_lining.js';
import {bindHarvestMending, CARCASS_STOCK, COATING_STOCK, HARVEST_STOCK, enchantedHarvestConfig, harvestMendingPack,
    HANDLING_LOSS, harvestableRemains, MENDING_FUEL, PRESERVATION_INK,
    startEnchantedHarvest, startHarvestCoating, startHarvestMending, startHarvestPreservation, startPeltStudy,
    startWholePeltTanning, TANNING_STOCK} from '../src/world_packs/enchanted_harvest_tool.js';

const config = {...enchantedHarvestConfig, packs: ['n.knowledge', harvestMendingPack.id]};
const place = 'yard', harvester = 'maker', tool = 'blade', carcass = 'specimen', output = 'pelt';

function setup(edge) {
    return createEngineWorld({...config, holders: [
        {id: place, kind: 'place'}, {id: harvester, kind: 'body', place},
        {id: tool, kind: 'thing', place, as: ['harvest_tool'],
            properties: {'workshop.held_by': harvester, 'workshop.harvest_edge': edge}},
        {id: carcass, kind: 'thing', place, as: ['harvest_carcass'], quantities: {[CARCASS_STOCK]: 1},
            properties: {'workshop.harvest_species': 'Wolf rat', 'workshop.harvest_born': 0}},
        {id: output, kind: 'thing', place, as: ['harvest_output'], quantities: {[HARVEST_STOCK]: 0},
            properties: {'workshop.held_by': harvester}},
    ]});
}

test('a wild loss leaves one saved specimen for the existing enchanted harvest', () => {
    const {ivs, ...linked} = MEADOW_BREEDING_GENOME;
    const genome = {...linked, id: 'test.wolf-rat'};
    const habitat = {id: place, capacity: 1, supportedSpecies: ['wolf-rat']};
    const initial = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'wild',
        habitat, species: 'wolf-rat', delta: 1});
    const {id, state} = acquireCreature(initial, {revision: initial.revision, cohortId: 'wild', destination: habitat, keeper: null});
    const lifecycle = openWildHabitat(state, {revision: state.revision, id: place, clock: 0, interval: 2});
    const rules = {...config, shared: {...config.shared, quantities: [...config.shared.quantities, WORLD_QUANTITIES.vitality]}};
    const fixtures = setup(100).world.holders;
    const engine = createEngineWorld({...rules, drawRoot: 'wild-harvest', holders: [fixtures[place], fixtures[harvester], fixtures[tool], fixtures[output],
        {id: 'wild', kind: 'cohort', place, refs: {herd: 'wild'}, count: 0},
        {id, kind: 'body', place, refs: {creature: id}, quantities: {[CARCASS_STOCK]: 1, vitality: 20}},
    ]});
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), rules);
    const remainsId = `${id}.remains`;
    const lose = engine => advancePhasedWorldHerds({engine, lifecycle}, {revision: lifecycle.revision,
        habitat: {...habitat, capacity: 0}, clock: 2, populations: [{id: 'wild', births: 0, losses: 1, genome,
            pedigree: {gestationMinutes: 1, growthMinutes: 0, maxKinship: 1},
            world: {birthRow: 'wild.birth', lossRow: 'wild.loss', remainsFor: death => harvestableRemains(death, 'Wolf rat')}}]});
    const collision = applyEngineOps(engine, [{op: 'holder_add', value: {id: remainsId, kind: 'thing', place}}], 'occupied-remains');
    assert.throws(() => lose(restore(collision)), /could not retire/);
    const lost = lose(restore(engine));
    assert.deepEqual(serializeEngineWorld(lost.engine), serializeEngineWorld(lose(engine).engine));
    const savedLifecycle = restoreCreatureLifecycle(JSON.parse(JSON.stringify(lost.lifecycle)));
    assert.equal(savedLifecycle.individuals[id].deadAt, 2);
    assert.equal(lost.engine.world.holders[id], undefined);
    assert.deepEqual(lost.engine.world.holders[remainsId].quantities, {[CARCASS_STOCK]: 1});
    assert.equal(lost.engine.world.rows['wild.loss'].vitality, 20);
    assert.deepEqual(readLineage(lost.engine.world, remainsId)[0].parents, [id]);
    const start = (engine, id, outputId = output) => startEnchantedHarvest(engine,
        {id, harvester, tool, carcass: remainsId, output: outputId});
    const pending = start(restore(lost.engine), 'cut');
    const done = advanceEngineWorld(restore(pending), 4).engine;
    assert.deepEqual(serializeEngineWorld(done), serializeEngineWorld(advanceEngineWorld(pending, 4).engine));
    assert.equal(done.world.holders[remainsId].quantities[CARCASS_STOCK], 0);
    assert.equal(done.world.holders[output].quantities[HARVEST_STOCK], 1);
    const item = JSON.parse(done.world.holders[output].properties['workshop.harvest_key']);
    assert.equal(item.id, 'Rat pelt');
    assert.match(JSON.stringify(item.lineage), new RegExp(`"specimen":"${id}"|"key":"${id}"`));
    const empty = applyEngineOps(done, [{op: 'holder_add', value: {...fixtures[output], id: 'empty-pelt'}}], 'empty-pelt');
    assert.throws(() => start(restore(empty), 'second-cut', 'empty-pelt'), /Bring the tool, carcass and empty harvest holder/);
});

test('an enchanted edge changes time and the exact pelt the harvest owner produces', () => {
    const work = edge => startEnchantedHarvest(setup(edge), {id: 'cut', harvester, tool, carcass, output});
    const ordinary = work(0), enchanted = work(100);
    assert.deepEqual(ordinary.records.workings.cut.record.deadlines, [4]);
    assert.deepEqual(enchanted.records.workings.cut.record.deadlines, [2]);
    const paused = advanceEngineWorld(enchanted, 1).engine;
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(paused))), config);
    const a = advanceEngineWorld(ordinary, 4).engine, b = advanceEngineWorld(restored, 4).engine;
    assert.deepEqual(serializeEngineWorld(b), serializeEngineWorld(advanceEngineWorld(enchanted, 4).engine));
    const key = engine => engine.world.holders[output].properties['workshop.harvest_key'];
    assert.equal(JSON.parse(key(a)).quality, 70);
    assert.equal(JSON.parse(key(b)).quality, 85);
    assert.ok(readMaterialLineage(key(b)));
    assert.equal(b.world.holders[output].quantities[HARVEST_STOCK], 1);
    assert.equal(b.world.holders[carcass].quantities[CARCASS_STOCK], 0);
});

test('a paid preservation mark keeps the exact pelt intact for study after restore', () => {
    const ready = applyEngineOps(setup(100), [
        {op: 'carry', holder: harvester, quantity: PRESERVATION_INK, amount: 2},
        {op: 'property', holder: carcass, property: HANDLING_LOSS, value: 30},
        {op: 'holder_add', value: {id: 'observer', kind: 'body', place}},
    ], 'fixture:fragile-pelt');
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const mark = (engine, id) => startHarvestPreservation(engine, {id, harvester, tool});
    const pending = mark(mark(ready, 'mark'), 'mark-again');
    const taken = applyEngineOps(advance(pending, 1), [{op: 'property', holder: tool,
        property: 'workshop.held_by', value: 'observer'}], 'fixture:blade-handoff');
    assert.equal(advance(restore(taken), 2).world.holders[harvester].quantities[PRESERVATION_INK], 2);
    const marked = advance(restore(advance(pending, 1)), 2);
    assert.deepEqual(serializeEngineWorld(marked), serializeEngineWorld(advance(pending, 2)));
    assert.equal(marked.world.holders[harvester].quantities[PRESERVATION_INK], 1);
    assert.equal(marked.records.workings['mark-again'].record.status, 'interrupted');
    const study = engine => {
        const cut = startEnchantedHarvest(engine, {id: 'cut', harvester, tool, carcass, output});
        const pelt = advance(restore(advance(cut, 3)), 4);
        const working = startPeltStudy(pelt, {id: 'study', harvester, output});
        const result = advance(restore(advance(working, 5)), 6);
        assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(working, 6)));
        return result;
    };
    const ordinary = study(advance(ready, 2));
    const preserved = study(marked);
    const pelt = engine => JSON.parse(engine.world.holders[output].properties['workshop.harvest_key']);
    assert.equal(pelt(ordinary).quality, pelt(preserved).quality);
    assert.equal(pelt(ordinary).completeness, 'damaged');
    assert.equal(pelt(preserved).completeness, 'whole');
    assert.equal(ordinary.records.workings.study.record.status, 'interrupted');
    assert.equal(preserved.world.holders[output].quantities[HARVEST_STOCK], 1);
    assert.deepEqual(recordsOf(ordinary.world, harvester), {});
    assert.deepEqual(recordsOf(preserved.world, 'observer'), {});
    const learned = recordsOf(restore(preserved).world, harvester)[`workshop.coat:${carcass}`];
    assert.equal(learned.source.from, output);
    assert.deepEqual(JSON.parse(learned.believed.value), pelt(preserved));

    const burned = applyEngineOps(marked, [{op: 'property', holder: carcass, property: 'workshop.harvest_specimen',
        value: JSON.stringify({species: 'Wolf rat', key: carcass, born: 0, draw: .5, size: 'ordinary',
            condition: 'ordinary', variant: 'ordinary', damage: {hits: 1, crits: 0, overkill: 0, type: 'fire'}})}],
    'fixture:preexisting-burn');
    assert.equal(pelt(study(burned)).completeness, 'damaged');

    const tanning = engine => {
        const prepared = applyEngineOps(engine, [
            {op: 'carry', holder: harvester, quantity: TANNING_STOCK, amount: 2},
            ...['tanned', 'other-rest'].map(id => ({op: 'holder_add', value: {id, kind: 'thing', as: ['harvest_output'], place,
                properties: {'workshop.held_by': harvester}, quantities: {[HARVEST_STOCK]: 0}}})),
        ], 'fixture:tanning-rests');
        const tan = (state, id, rest) => startWholePeltTanning(state, {id, harvester, pelt: output, output: rest});
        return tan(tan(prepared, 'tan', 'tanned'), 'tan-again', 'other-rest');
    };
    const bad = advance(restore(tanning(ordinary)), 9);
    assert.equal(bad.records.workings.tan.record.status, 'interrupted');
    assert.equal(bad.world.holders[harvester].quantities[TANNING_STOCK], 2);
    assert.equal(bad.world.holders[output].quantities[HARVEST_STOCK], 1);

    const drying = advance(tanning(preserved), 7);
    const moved = applyEngineOps(drying, [{op: 'property', holder: output,
        property: 'workshop.held_by', value: 'observer'}], 'fixture:handoff-pelt');
    const interrupted = advance(restore(moved), 9);
    assert.equal(interrupted.records.workings.tan.record.status, 'interrupted');
    assert.equal(interrupted.world.holders[harvester].quantities[TANNING_STOCK], 2);
    const tanned = advance(restore(drying), 9);
    assert.deepEqual(serializeEngineWorld(tanned), serializeEngineWorld(advance(drying, 9)));
    assert.equal(tanned.records.workings['tan-again'].record.status, 'interrupted');
    assert.equal(tanned.world.holders[harvester].quantities[TANNING_STOCK], 1);
    assert.equal(tanned.world.holders[output].quantities[HARVEST_STOCK], 0);
    assert.equal(tanned.world.holders.tanned.quantities[HARVEST_STOCK], 1);
    const productKey = tanned.world.holders.tanned.properties['workshop.harvest_key'];
    assert.equal(JSON.parse(productKey).id, 'Processed rat pelt');
    assert.equal(readMaterialLineage(productKey).history.at(-1).inputs[0].item_key,
        preserved.world.holders[output].properties['workshop.harvest_key']);

    const combined = {...config, host: {laws: [...config.host.laws, ...fireLiningConfig.host.laws]}, shared: {
        quantities: [...config.shared.quantities, ...fireLiningConfig.shared.quantities, WORLD_QUANTITIES.vitality],
        properties: [...config.shared.properties, ...fireLiningConfig.shared.properties],
    }};
    const load = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), combined);
    const readyToCut = applyEngineOps(load(tanned), [
        {op: 'carry', holder: harvester, quantity: REPAIR_STOCK, amount: 2},
        {op: 'carry', holder: harvester, quantity: 'vitality', amount: 100},
        {op: 'holder_add', value: {id: 'plate', kind: 'thing', as: ['breastplate'], place,
            properties: {'workshop.held_by': harvester, marks: ['lining-seams']}}},
    ], 'fixture:hide-bench');
    const cut = (engine, id) => startHideLining(engine, {id, wearer: harvester, hide: 'tanned'});
    const cutting = advance(cut(cut(readyToCut, 'cut-hide'), 'cut-hide-again'), 10);
    const lining = 'workshop.hide-lining.cut-hide';
    const movedHide = applyEngineOps(cutting, [{op: 'property', holder: 'tanned',
        property: 'workshop.held_by', value: 'observer'}], 'fixture:hide-handoff');
    const refused = advance(load(movedHide), 12);
    assert.equal(refused.world.holders[harvester].quantities[REPAIR_STOCK], 2);
    assert.equal(refused.world.holders.tanned.quantities[HARVEST_STOCK], 1);
    assert.equal(refused.world.holders[lining], undefined);
    const cutHide = advance(load(cutting), 12);
    assert.deepEqual(serializeEngineWorld(cutHide), serializeEngineWorld(advance(cutting, 12)));
    assert.equal(cutHide.records.workings['cut-hide-again'].record.status, 'interrupted');
    assert.equal(cutHide.world.holders[harvester].quantities[REPAIR_STOCK], 1);
    assert.equal(cutHide.world.holders.tanned.quantities[HARVEST_STOCK], 0);
    assert.deepEqual(readLineage(cutHide.world, lining)[0].parents, ['tanned']);
    assert.equal(cutHide.world.holders[lining].properties['workshop.lining_hide_source'], productKey);
    const fitted = startFireLining(cutHide, {id: 'fit-hide', wearer: harvester, armor: 'plate', lining});
    const lined = wearBreastplate(advance(load(advance(fitted, 13)), 15), harvester, 'plate');
    assert.equal(settleHeatExposure(lined, {wearer: harvester, dose: 20}).damage, 16);
    assert.equal(settleHeatExposure(wearBreastplate(load(lined), harvester), {wearer: harvester, dose: 20}).damage, 20);

    const worn = applyEngineOps(lined, [{op: 'set', holder: lining, quantity: 'condition', amount: 50}], 'fixture:wear-hide');
    assert.equal(settleHeatExposure(worn, {wearer: harvester, dose: 20}).damage, 18);
    const loose = advance(load(startLiningDetachment(worn, {id: 'detach-hide', wearer: harvester, armor: 'plate', lining})), 18);
    const scrap = 'recovered-hide';
    const recovered = salvageLooseLining(load(loose), {wearer: harvester, lining, scrapId: scrap}).engine;
    assert.equal(recovered.world.holders[lining], undefined);
    assert.equal(recovered.world.holders[scrap].quantities[SALVAGE_STOCK], 1);
    assert.deepEqual(readLineage(recovered.world, scrap)[0].parents, [lining]);
    assert.equal(recovered.world.holders[scrap].properties['workshop.lining_hide_source'], productKey);
    const reweave = (engine, id) => startLiningReweave(engine, {id, wearer: harvester, scrap});
    const reweaving = advance(reweave(reweave(recovered, 'recover'), 'recover-again'), 19);
    const rebuilt = advance(load(reweaving), 21);
    assert.deepEqual(serializeEngineWorld(rebuilt), serializeEngineWorld(advance(reweaving, 21)));
    assert.equal(rebuilt.records.workings['recover-again'].record.status, 'interrupted');
    assert.equal(rebuilt.world.holders[scrap].quantities[SALVAGE_STOCK], 0);
    const replacement = 'workshop.rewoven.recover';
    assert.deepEqual(readLineage(rebuilt.world, replacement)[0].parents, [scrap]);
    assert.equal(rebuilt.world.holders[replacement].properties['workshop.lining_hide_source'], productKey);
    const refitting = startFireLining(rebuilt, {id: 'refit-hide', wearer: harvester, armor: 'plate', lining: replacement});
    const refitted = advance(load(advance(refitting, 22)), 24);
    assert.equal(settleHeatExposure(refitted, {wearer: harvester, dose: 20}).damage, 17);

    const cloth = 'recovered-cloth';
    const twoLots = applyEngineOps(recovered, [{op: 'holder_add', value: {id: cloth, kind: 'thing',
        as: ['lining_scrap'], place, quantities: {[SALVAGE_STOCK]: 3},
        properties: {'workshop.held_by': harvester, 'workshop.fiber_insulation': 60}}}], 'fixture:blend-cloth');
    const blend = startLiningReweave(twoLots, {id: 'blend-hide', wearer: harvester, scrap, second: cloth, shares: [1, 2]});
    const blended = advance(load(advance(blend, 19)), 21);
    assert.deepEqual(serializeEngineWorld(blended), serializeEngineWorld(advance(blend, 21)));
    const blendId = 'workshop.rewoven.blend-hide';
    const material = blended.world.holders[blendId].properties[LINING_MATERIAL];
    const event = readMaterialLineage(material).history.at(-1);
    assert.deepEqual(event.inputs.map(({item_key, count}) => [item_key, count]), [
        [productKey, 1], [JSON.stringify({id: 'Recovered lining cloth', lot: cloth}), 2],
    ]);
    assert.deepEqual(event.parameters, {lots: [scrap, cloth], shares: [1, 2]});
    assert.equal(blended.world.holders[cloth].quantities[SALVAGE_STOCK], 1);
    const blendFit = startFireLining(blended, {id: 'fit-blend', wearer: harvester, armor: 'plate', lining: blendId});
    const blendWorn = advance(load(blendFit), 24);
    assert.equal(settleHeatExposure(blendWorn, {wearer: harvester, dose: 20}).damage, 13);
    const blendLoose = advance(load(startLiningDetachment(blendWorn,
        {id: 'detach-blend', wearer: harvester, armor: 'plate', lining: blendId})), 27);
    const recoveredBlend = salvageLooseLining(load(blendLoose),
        {wearer: harvester, lining: blendId, scrapId: 'blend-scrap'}).engine;
    assert.equal(load(recoveredBlend).world.holders['blend-scrap'].properties[LINING_MATERIAL], material);
    assert.equal(recoveredBlend.world.holders['blend-scrap'].quantities[SALVAGE_STOCK], 3);
    const rethreaded = applyEngineOps(recoveredBlend, [{op: 'add', holder: harvester, quantity: REPAIR_STOCK, amount: 1}],
        'fixture:thread-for-recovered-blend');
    const rework = startLiningReweave(rethreaded, {id: 'reuse-blend', wearer: harvester, scrap: 'blend-scrap'});
    const reused = advance(load(rework), 30);
    const reusedKey = reused.world.holders['workshop.rewoven.reuse-blend'].properties[LINING_MATERIAL];
    assert.equal(readMaterialLineage(reusedKey).history.at(-1).inputs[0].item_key, material);
    assert.equal(reused.world.holders['blend-scrap'].quantities[SALVAGE_STOCK], 2);
    const separate = (engine, id) => startLiningSeparation(engine, {id, wearer: harvester, scrap: 'blend-scrap'});
    const refusedBlend = advance(load(separate(rethreaded, 'split-blend')), 30);
    assert.equal(refusedBlend.records.workings['split-blend'].record.status, 'interrupted');
    assert.equal(refusedBlend.world.holders['blend-scrap'].quantities[SALVAGE_STOCK], 3);

    const layeredJob = startLiningReweave(twoLots, {id: 'stitch-layers', wearer: harvester, scrap,
        second: cloth, shares: [1, 2], layered: true});
    const layered = advance(load(layeredJob), 21);
    const layeredId = 'workshop.rewoven.stitch-layers';
    const layerArgs = {wearer: harvester, armor: 'plate', lining: layeredId};
    const stitchFit = startFireLining(layered, {id: 'fit-stitched', ...layerArgs});
    const fittedLayers = advance(load(advance(stitchFit, 22)), 24);
    assert.deepEqual(serializeEngineWorld(fittedLayers), serializeEngineWorld(advance(stitchFit, 24)));
    assert.equal(settleHeatExposure(fittedLayers, {wearer: harvester, dose: 20}).damage, 9);
    const frayed = applyEngineOps(fittedLayers, [{op: 'set', holder: layeredId, quantity: 'condition', amount: 50}],
        'fixture:stitched-wear');
    assert.equal(settleHeatExposure(load(frayed), {wearer: harvester, dose: 20}).damage, 13);
    assert.equal(settleHeatExposure(wearBreastplate(load(fittedLayers), harvester), {wearer: harvester, dose: 20}).damage, 20);
    const road = applyEngineOps(fittedLayers, [
        {op: 'holder_add', value: {id: 'kiln', kind: 'place',
            properties: {'workshop.route_heat': 10, 'workshop.route_lining_wear': 50}}},
        {op: 'link_add', link: {id: 'abrasive-path', kind: 'heated-path', from: place, to: 'kiln', cost: 2}},
    ], 'fixture:abrasive-path');
    const crossed = crossHeatedLink(load(road), {wearer: harvester, link: 'abrasive-path'});
    assert.equal(crossed.damage, 9);
    assert.equal(crossed.crossed, true);
    assert.equal(crossed.engine.world.holders[layeredId].quantities.condition, 75);
    assert.equal(settleHeatExposure(load(crossed.engine), {wearer: harvester, dose: 20}).damage, 10);
    const offcut = 'hide-patch';
    const patchStock = applyEngineOps(crossed.engine, [
        {op: 'add', holder: harvester, quantity: REPAIR_STOCK, amount: 2},
        {op: 'holder_add', value: {id: offcut, kind: 'thing', as: ['lining_scrap'], place: 'kiln',
            quantities: {[SALVAGE_STOCK]: 2}, properties: {'workshop.held_by': harvester,
                'workshop.lining_hide_source': productKey, 'workshop.fiber_insulation': 21}}},
    ], 'fixture:matching-hide-offcut');
    const patch = (engine, id) => startOuterLiningPatch(engine, {id, ...layerArgs, scrap: offcut});
    const patching = advance(patch(patch(patchStock, 'patch'), 'patch-again'), 27);
    const wrongPatch = applyEngineOps(patching, [{op: 'property', holder: offcut,
        property: 'workshop.fiber_insulation', value: 11}], 'fixture:worn-patch');
    const refusedPatch = advance(load(wrongPatch), 29);
    assert.equal(refusedPatch.records.workings.patch.record.status, 'interrupted');
    assert.equal(refusedPatch.world.holders[offcut].quantities[SALVAGE_STOCK], 2);
    assert.equal(refusedPatch.world.holders[harvester].quantities[REPAIR_STOCK], 2);
    const patched = advance(load(patching), 29);
    assert.deepEqual(serializeEngineWorld(patched), serializeEngineWorld(advance(patching, 29)));
    assert.equal(patched.records.workings['patch-again'].record.status, 'interrupted');
    assert.equal(patched.world.holders[offcut].quantities[SALVAGE_STOCK], 1);
    assert.equal(patched.world.holders[harvester].quantities[REPAIR_STOCK], 1);
    assert.equal(patched.world.holders[layeredId].quantities.condition, 75);
    assert.equal(settleHeatExposure(load(patched), {wearer: harvester, dose: 20}).damage, 9);
    const different = applyEngineOps(patchStock, [{op: 'holder_add', value: {id: 'cloth-patch', kind: 'thing',
        as: ['lining_scrap'], place: 'kiln', quantities: {[SALVAGE_STOCK]: 1},
        properties: {'workshop.held_by': harvester, 'workshop.fiber_insulation': 60}}}], 'fixture:cloth-patch');
    const mixedPatch = startOuterLiningPatch(different, {id: 'different-patch', ...layerArgs, scrap: 'cloth-patch', substitute: true});
    const mixedPatched = advance(load(advance(mixedPatch, 27)), 29);
    assert.deepEqual(serializeEngineWorld(mixedPatched), serializeEngineWorld(advance(mixedPatch, 29)));
    assert.equal(mixedPatched.world.holders['cloth-patch'].quantities[SALVAGE_STOCK], 0);
    assert.equal(settleHeatExposure(mixedPatched, {wearer: harvester, dose: 20}).damage, 8);
    const patchedLoose = advance(load(startLiningDetachment(mixedPatched, {id: 'detach-mixed-patch', ...layerArgs})), 32);
    const patchedScrap = salvageLooseLining(patchedLoose,
        {wearer: harvester, lining: layeredId, scrapId: 'blend-scrap'}).engine;
    const parted = advance(load(separate(patchedScrap, 'separate-patched')), 35);
    const returnedOuter = parted.world.holders['workshop.separated.separate-patched.1'];
    assert.equal(returnedOuter.properties['workshop.fiber_insulation'], 41);
    assert.equal(returnedOuter.properties['workshop.lining_hide_source'], undefined);
    const patchLineage = readMaterialLineage(returnedOuter.properties[LINING_MATERIAL]).history.at(-1).parameters.outerPatch;
    assert.equal(readMaterialLineage(patchLineage).history.at(-1).inputs[0].item_key,
        JSON.stringify({id: 'Recovered lining cloth', lot: 'cloth-patch'}));
    const smallOffcuts = applyEngineOps(different, [
        {op: 'property', holder: 'cloth-patch', property: PATCH_COVERAGE, value: 25},
        {op: 'add', holder: 'cloth-patch', quantity: SALVAGE_STOCK, amount: 1},
    ], 'fixture:small-offcuts');
    const useOffcut = (engine, id) => startOuterLiningPatch(engine, {
        id, ...layerArgs, scrap: 'cloth-patch', substitute: true,
    });
    const firstPatch = advance(load(advance(useOffcut(smallOffcuts, 'partial-patch'), 27)), 29);
    const firstReceipt = firstPatch.records.workings['partial-patch'].record.receipts[0].observed;
    assert.deepEqual([firstReceipt.coverage, firstReceipt.after], [25, 25]);
    assert.equal(firstPatch.world.holders['cloth-patch'].quantities[SALVAGE_STOCK], 1);
    assert.equal(settleHeatExposure(load(firstPatch), {wearer: harvester, dose: 20}).damage, 9);
    const pendingLastPatch = advance(useOffcut(firstPatch, 'finish-patch'), 30);
    const lastPatch = advance(load(pendingLastPatch), 32);
    assert.deepEqual(serializeEngineWorld(lastPatch), serializeEngineWorld(advance(pendingLastPatch, 32)));
    assert.equal(lastPatch.world.holders['cloth-patch'].quantities[SALVAGE_STOCK], 0);
    assert.equal(settleHeatExposure(lastPatch, {wearer: harvester, dose: 20}).damage, 8);
    const partialLoose = advance(load(startLiningDetachment(firstPatch, {id: 'detach-partial', ...layerArgs})), 32);
    const partialScrap = salvageLooseLining(load(partialLoose),
        {wearer: harvester, lining: layeredId, scrapId: 'blend-scrap'}).engine;
    const partialParts = advance(load(separate(partialScrap, 'separate-partial')), 35);
    assert.equal(partialParts.world.holders['workshop.separated.separate-partial.1'].properties['workshop.fiber_insulation'], 26);
    const oversized = applyEngineOps(different, [
        {op: 'property', holder: 'cloth-patch', property: PATCH_COVERAGE, value: 75},
        {op: 'property', holder: place, property: 'workshop.route_lining_wear', value: 25},
    ], 'fixture:oversized-offcut');
    const savingOffcut = advance(useOffcut(useOffcut(oversized, 'save-offcut'), 'save-offcut-again'), 27);
    const withRemnant = advance(load(savingOffcut), 29);
    assert.deepEqual(serializeEngineWorld(withRemnant), serializeEngineWorld(advance(savingOffcut, 29)));
    assert.equal(withRemnant.records.workings['save-offcut-again'].record.status, 'interrupted');
    const remnant = 'workshop.patch-remnant.save-offcut';
    assert.equal(withRemnant.world.holders[remnant].properties[PATCH_COVERAGE], 25);
    assert.equal(withRemnant.world.holders[remnant].quantities[SALVAGE_STOCK], 1);
    assert.equal(withRemnant.world.holders['cloth-patch'].quantities[SALVAGE_STOCK], 0);
    assert.deepEqual(readLineage(withRemnant.world, remnant)[0].parents, ['cloth-patch']);
    const weaveRemnant = startLiningReweave(withRemnant, {id: 'weave-remnant', wearer: harvester, scrap: remnant});
    const tooSmall = advance(load(weaveRemnant), 32);
    assert.equal(tooSmall.records.workings['weave-remnant'].record.status, 'interrupted');
    assert.equal(tooSmall.world.holders[remnant].quantities[SALVAGE_STOCK], 1);
    const joinStock = applyEngineOps(withRemnant, [
        {op: 'add', holder: harvester, quantity: REPAIR_STOCK, amount: 1},
        {op: 'holder_add', value: {id: 'hide-offcut', kind: 'thing', as: ['lining_scrap'], place: 'kiln',
            quantities: {[SALVAGE_STOCK]: 4}, properties: {'workshop.held_by': harvester,
                [PATCH_COVERAGE]: 25, 'workshop.lining_hide_source': productKey, 'workshop.fiber_insulation': 21}}},
    ], 'fixture:joining-offcuts');
    const join = (engine, id, counts) => startLiningOffcutJoin(engine, {
        id, wearer: harvester, scrap: remnant, second: 'hide-offcut', counts,
    });
    const short = advance(load(join(joinStock, 'short-join', [1, 2])), 32);
    assert.equal(short.records.workings['short-join'].record.status, 'interrupted');
    assert.equal(short.world.holders[harvester].quantities[REPAIR_STOCK], 2);
    const pendingJoin = advance(join(join(joinStock, 'join-cloth', [1, 3]), 'join-cloth-again', [1, 3]), 30);
    const joined = advance(load(pendingJoin), 32);
    assert.deepEqual(serializeEngineWorld(joined), serializeEngineWorld(advance(pendingJoin, 32)));
    assert.equal(joined.records.workings['join-cloth-again'].record.status, 'interrupted');
    assert.deepEqual(joined.records.workings['join-cloth'].record.receipts[0].observed.balance,
        {unit: 'cloth area point', input: 100, output: 100, loss: 0});
    assert.equal(joined.world.holders['hide-offcut'].quantities[SALVAGE_STOCK], 1);
    const joinedCloth = 'workshop.joined-offcuts.join-cloth';
    assert.deepEqual(readMaterialLineage(joined.world.holders[joinedCloth].properties[LINING_MATERIAL])
        .history.at(-1).inputs.map(row => row.count), [25, 75]);
    const rewoven = advance(load(startLiningReweave(joined, {id: 'join-lining', wearer: harvester, scrap: joinedCloth})), 35);
    const joinedFit = startFireLining(rewoven, {id: 'fit-joined-lining', ...layerArgs,
        previous: layeredId, lining: 'workshop.rewoven.join-lining'});
    const joinedWorn = advance(load(joinedFit), 38);
    assert.equal(settleHeatExposure(joinedWorn, {wearer: harvester, dose: 20}).damage, 15);
    const threeLots = applyEngineOps(joinStock, [{op: 'holder_add', value: {id: 'trim-lot', kind: 'thing',
        as: ['lining_scrap'], place: 'kiln', quantities: {[SALVAGE_STOCK]: 1},
        properties: {'workshop.held_by': harvester, [PATCH_COVERAGE]: 35, 'workshop.fiber_insulation': 80}}}],
    'fixture:third-offcut-lot');
    const joinThree = startLiningOffcutJoin(threeLots, {id: 'join-three', wearer: harvester, scrap: remnant,
        second: 'hide-offcut', third: 'trim-lot', counts: [1, 2, 1]});
    const triple = advance(load(advance(joinThree, 30)), 32);
    assert.deepEqual(serializeEngineWorld(triple), serializeEngineWorld(advance(joinThree, 32)));
    assert.deepEqual(triple.records.workings['join-three'].record.receipts[0].observed.balance,
        {unit: 'cloth area point', input: 110, output: 110, loss: 0});
    const tripleCloth = 'workshop.joined-offcuts.join-three';
    const trimming = triple.world.holders[`${tripleCloth}.remnant`];
    assert.equal(trimming.properties[PATCH_COVERAGE], 10);
    assert.equal(trimming.properties['workshop.fiber_insulation'], 80);
    assert.deepEqual(readLineage(triple.world, trimming.id)[0].parents, ['trim-lot']);
    const tripleLining = startLiningReweave(triple, {id: 'three-lot-lining', wearer: harvester, scrap: tripleCloth});
    const tripleFit = startFireLining(advance(load(tripleLining), 35), {id: 'fit-three-lot-lining', ...layerArgs,
        previous: layeredId, lining: 'workshop.rewoven.three-lot-lining'});
    assert.equal(settleHeatExposure(advance(load(tripleFit), 38), {wearer: harvester, dose: 20}).damage, 13);
    const candidate = 'workshop.rewoven.three-lot-lining';
    const forecast = engine => forecastLiningFit(engine.world, {observer: harvester, armor: 'plate',
        lining: candidate, exposure: 'heat'});
    const blank = advance(load(tripleLining), 35);
    assert.deepEqual(forecast(blank), {known: false});
    const observed = load(appraiseLining(blank, {observer: harvester, lining: candidate}));
    assert.equal(Math.round(20 * forecast(observed).heatMultiplier), 13);
    const inked = applyEngineOps(observed, [{op: 'carry', holder: harvester, quantity: INSCRIPTION_STOCK, amount: 3}],
        'fixture:ink-for-recovered-cloth');
    const engraving = startLiningInscription(inked, {id: 'engrave-recovered', wearer: harvester, lining: candidate, pattern: 'fireproof'});
    const engraved = advance(load(advance(engraving, 36)), 38);
    assert.equal(forecast(engraved).observedAt, 35);
    const checked = load(appraiseLining(engraved, {observer: harvester, lining: candidate}));
    assert.equal(forecast(checked).observedAt, 38);
    const engravedFit = startFireLining(checked, {id: 'fit-engraved-cloth', ...layerArgs,
        previous: layeredId, lining: candidate});
    const enchanted = advance(load(advance(engravedFit, 39)), 41);
    const harm = settleHeatExposure(enchanted, {wearer: harvester, dose: 20}).damage;
    assert.equal(harm, 11);
    assert.equal(harm, Math.round(20 * forecast(checked).heatMultiplier));
    const batchStock = applyEngineOps(threeLots, [
        {op: 'property', holder: 'trim-lot', property: PATCH_COVERAGE, value: 85},
        {op: 'add', holder: harvester, quantity: REPAIR_STOCK, amount: 2},
    ], 'fixture:bulk-cloth');
    const batchJob = startLiningOffcutJoin(batchStock, {id: 'bulk-join', wearer: harvester, scrap: remnant,
        second: 'hide-offcut', third: 'trim-lot', counts: [1, 4, 1], units: 2});
    const batch = advance(load(advance(batchJob, 30)), 32);
    assert.deepEqual(serializeEngineWorld(batch), serializeEngineWorld(advance(batchJob, 32)));
    const receipt = batch.records.workings['bulk-join'].record.receipts[0].observed;
    assert.deepEqual(receipt.balance, {unit: 'cloth area point', input: 210, output: 210, loss: 0});
    assert.equal(receipt.remnantArea, 10);
    assert.equal(batch.world.holders[harvester].quantities[REPAIR_STOCK], 2);
    for (const [index, scrap] of receipt.outputs.entries()) {
        const lot = batch.world.holders[scrap];
        assert.deepEqual(readMaterialLineage(lot.properties[LINING_MATERIAL]).history.at(-1)
            .inputs.map(row => row.count), [25, 75]);
        assert.deepEqual(readLineage(batch.world, scrap)[0].parents,
            index === 0 ? [remnant, 'hide-offcut'] : ['hide-offcut', 'trim-lot']);
        const woven = advance(load(startLiningReweave(batch, {id: 'weave-batch', wearer: harvester, scrap})), 35);
        const fitting = startFireLining(woven, {id: 'fit-batch', ...layerArgs,
            previous: layeredId, lining: 'workshop.rewoven.weave-batch'});
        assert.equal(settleHeatExposure(advance(load(fitting), 38), {wearer: harvester, dose: 20}).damage,
            index === 0 ? 15 : 10);
    }
    const back = crossHeatedLink(load(withRemnant), {wearer: harvester, link: 'abrasive-path'});
    assert.equal(back.crossed, true);
    assert.equal(settleHeatExposure(back.engine, {wearer: harvester, dose: 20}).damage, 8);
    const useRemnant = startOuterLiningPatch(back.engine, {id: 'use-remnant', ...layerArgs, scrap: remnant, substitute: true});
    const reusedRemnant = advance(load(advance(useRemnant, 32)), 34);
    assert.deepEqual(serializeEngineWorld(reusedRemnant), serializeEngineWorld(advance(useRemnant, 34)));
    assert.equal(reusedRemnant.records.workings['use-remnant'].record.receipts[0].observed.coverage, 25);
    assert.equal(reusedRemnant.world.holders[remnant].quantities[SALVAGE_STOCK], 0);
    assert.equal(settleHeatExposure(load(reusedRemnant), {wearer: harvester, dose: 20}).damage, 7);
    const removedLayers = advance(load(startLiningDetachment(crossed.engine, {id: 'detach-stitched', ...layerArgs})), 29);
    const looseLayers = salvageLooseLining(removedLayers,
        {wearer: harvester, lining: layeredId, scrapId: 'blend-scrap'}).engine;
    const supplied = applyEngineOps(looseLayers, [{op: 'add', holder: harvester, quantity: REPAIR_STOCK, amount: 2}],
        'fixture:layer-thread');
    const separating = advance(separate(separate(supplied, 'separate'), 'separate-again'), 30);
    const separated = advance(load(separating), 32);
    assert.deepEqual(serializeEngineWorld(separated), serializeEngineWorld(advance(separating, 32)));
    assert.equal(separated.records.workings['separate-again'].record.status, 'interrupted');
    assert.deepEqual(separated.records.workings.separate.record.receipts[0].observed.balance,
        {unit: 'lining unit', input: 3, output: 3, loss: 0});
    const hideLayer = 'workshop.separated.separate.1', clothLayer = 'workshop.separated.separate.2';
    assert.deepEqual([hideLayer, clothLayer].map(id => separated.world.holders[id].quantities[SALVAGE_STOCK]), [1, 2]);
    assert.equal(separated.world.holders[hideLayer].properties['workshop.lining_hide_source'], productKey);
    assert.equal(separated.world.holders[hideLayer].properties['workshop.fiber_insulation'], 11);
    assert.equal(separated.world.holders[clothLayer].properties['workshop.fiber_insulation'], 60);
    const weaveLayer = startLiningReweave(separated, {id: 'reuse-cloth-layer', wearer: harvester, scrap: clothLayer});
    const layerFit = startFireLining(advance(load(weaveLayer), 35),
        {id: 'fit-cloth-layer', wearer: harvester, armor: 'plate', lining: 'workshop.rewoven.reuse-cloth-layer'});
    const layerWorn = advance(load(layerFit), 38);
    assert.equal(settleHeatExposure(layerWorn, {wearer: harvester, dose: 20}).damage, 11);
});

test('a paid coating takes one harvest’s wear and preserves the edge for the next specimen', () => {
    const ready = applyEngineOps(setup(100), [
        {op: 'carry', holder: tool, quantity: 'condition', amount: 100},
        {op: 'carry', holder: harvester, quantity: COATING_STOCK, amount: 1},
    ], 'fixture:coating');
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const coat = startHarvestCoating(ready, {id: 'coat', harvester, tool});
    const abandoned = applyEngineOps(coat, [{op: 'property', holder: tool, property: 'workshop.held_by', value: null}], 'fixture:loss-of-custody');
    const stopped = advance(restore(abandoned), 2);
    assert.equal(stopped.records.workings.coat.record.status, 'interrupted');
    assert.equal(stopped.world.holders[harvester].quantities[COATING_STOCK], 1);

    const coated = advance(restore(advance(coat, 1)), 2);
    assert.equal(coated.world.holders[harvester].quantities[COATING_STOCK], 0);
    const start = (engine, id, input = carcass, destination = output) =>
        startEnchantedHarvest(engine, {id, harvester, tool, carcass: input, output: destination});
    const harvest = start(coated, 'first');
    const protectedEdge = advance(restore(harvest), 4);
    assert.deepEqual(serializeEngineWorld(protectedEdge), serializeEngineWorld(advance(harvest, 4)));
    const bareEdge = advance(start(advance(ready, 2), 'first'), 4);
    assert.equal(protectedEdge.world.holders[tool].quantities.condition, 100);
    assert.equal(bareEdge.world.holders[tool].quantities.condition, 75);

    const second = engine => {
        const next = applyEngineOps(engine, [carcass, output].map(holder => {
            const item = ready.world.holders[holder];
            return {op: 'holder_add', value: {id: `${holder}-two`, kind: item.kind, place, as: item.as,
                quantities: item.quantities, properties: item.properties}};
        }), 'fixture:second-specimen');
        return start(restore(next), 'second', `${carcass}-two`, `${output}-two`);
    };
    const protectedNext = second(protectedEdge), bareNext = second(bareEdge);
    const protectedSecond = advance(protectedNext, 8), bareSecond = advance(bareNext, 8);
    const quality = engine => JSON.parse(engine.world.holders[`${output}-two`].properties['workshop.harvest_key']).quality;
    assert.equal(quality(protectedSecond), 85);
    assert.equal(quality(bareSecond), 80);
    assert.equal(protectedSecond.world.holders[tool].quantities.condition, 75);
});

test('mending spends fuel at each pulse and preserves paid repairs when a later pulse fails', () => {
    const worn = applyEngineOps(setup(100), [
        {op: 'carry', holder: tool, quantity: 'condition', amount: 50},
        {op: 'carry', holder: tool, quantity: MENDING_FUEL, amount: 2},
    ], 'fixture:mending');
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const pending = startHarvestMending(worn, {id: 'mend', harvester, tool, pulses: 3});
    const halfway = advance(pending, 2);
    assert.equal(halfway.world.holders[tool].quantities.condition, 75);
    assert.equal(halfway.world.holders[tool].quantities[MENDING_FUEL], 1);
    const moved = applyEngineOps(halfway, [{op: 'property', holder: tool, property: 'workshop.held_by', value: null}], 'fixture:leave');
    const stopped = advance(restore(moved), 6);
    assert.equal(stopped.records.workings.mend.record.status, 'interrupted');
    assert.equal(stopped.world.holders[tool].quantities.condition, 75);
    assert.equal(stopped.world.holders[tool].quantities[MENDING_FUEL], 1);

    const fixed = advance(restore(halfway), 6);
    assert.deepEqual(serializeEngineWorld(fixed), serializeEngineWorld(advance(pending, 6)));
    assert.equal(fixed.world.holders[tool].quantities.condition, 100);
    assert.equal(fixed.world.holders[tool].quantities[MENDING_FUEL], 0);
    assert.equal(fixed.records.workings.mend.record.receipts.at(-1).observed.restored, 0);
    const cut = engine => advance(startEnchantedHarvest(engine, {id: 'cut', harvester, tool, carcass, output}), 12);
    const quality = engine => JSON.parse(engine.world.holders[output].properties['workshop.harvest_key']).quality;
    assert.equal(quality(cut(restore(fixed))), 85);
    assert.ok(quality(cut(advance(worn, 6))) < 85);

    const low = applyEngineOps(worn, [{op: 'add', holder: tool, quantity: MENDING_FUEL, amount: -1}], 'fixture:low-fuel');
    const exhausted = advance(restore(startHarvestMending(low, {id: 'low', harvester, tool, pulses: 2})), 4);
    assert.equal(exhausted.records.workings.low.record.status, 'interrupted');
    assert.equal(exhausted.world.holders[tool].quantities.condition, 75);
    assert.equal(exhausted.world.holders[tool].quantities[MENDING_FUEL], 0);
});

test('a bound mending pattern spends fuel only when its blade actually wears', () => {
    const initial = setup(100);
    const ready = applyEngineOps(initial, [
        {op: 'carry', holder: tool, quantity: 'condition', amount: 100},
        {op: 'carry', holder: tool, quantity: MENDING_FUEL, amount: 1},
        {op: 'carry', holder: harvester, quantity: COATING_STOCK, amount: 1},
        ...[carcass, output].map(holder => {
            const item = initial.world.holders[holder];
            return {op: 'holder_add', value: {id: `${holder}-two`, kind: item.kind, place,
                as: item.as, properties: item.properties, quantities: item.quantities}};
        }),
    ], 'fixture:self-mending');
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
    const blade = engine => engine.world.holders[tool].quantities;
    const start = (engine, id = 'cut', suffix = '') => startEnchantedHarvest(engine,
        {id, harvester, tool, carcass: `${carcass}${suffix}`, output: `${output}${suffix}`});
    const bound = bindHarvestMending(ready, {harvester, tool});
    const pending = start(bound);
    const halfway = restore(advance(pending, 1));
    assert.equal(blade(halfway)[MENDING_FUEL], 1);
    const mended = advance(halfway, 2);
    assert.deepEqual(serializeEngineWorld(mended), serializeEngineWorld(advance(pending, 2)));
    assert.equal(blade(mended).condition, 100);
    assert.equal(blade(mended)[MENDING_FUEL], 0);
    assert.equal(blade(advance(restore(mended), 3)).condition, 100);

    const finishSecond = engine => advance(start(restore(engine), 'second', '-two'), 6);
    const next = finishSecond(mended), control = finishSecond(advance(start(ready), 2));
    assert.equal(blade(next).condition, 75);
    const quality = engine => JSON.parse(engine.world.holders[`${output}-two`].properties['workshop.harvest_key']).quality;
    assert.deepEqual([quality(next), quality(control)], [85, 80]);

    const coated = advance(startHarvestCoating(bound, {id: 'coat', harvester, tool}), 2);
    const protectedCut = advance(start(coated), 4);
    assert.equal(blade(protectedCut)[MENDING_FUEL], 1);
    assert.equal(blade(protectedCut).condition, 100);
});
