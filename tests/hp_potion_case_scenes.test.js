import assert from 'node:assert/strict';
import test from 'node:test';

import {readLedgers, runCase, runCaseData} from '../scripts/coverage_report.mjs';
import {landEffect} from '../src/effect_host.js';
import {advanceEngineWorld, createEngineWorld} from '../src/engine_world.js';
import {coverageCase, DRAUGHT_CASE_ID} from '../src/world_packs/hp_potion_case_scenes.js';
import {ageingPotionCase, alihotsyAntidoteCase, amortentiaCase, antiJinxVarnishCase, assayedBlendStrengthCase,
    blendedAntidoteCase, blendedStorageCase, bloodReplenishingCase, burdenSizedAntidoteCase,
    bubotuberCase, calmingDraughtCase, commonPoisonAntidoteCase, compoundMoodDoseCase, compoundUptakeCase, confusingConcoctionCase, dittanyCase,
    euphoriaCase, forgetfulnessPotionCase,
    identifiedBlendCase, coverageCase as sharedBrewCase, polyjuiceCase,
    cureForBoilsCase, doxycideCase, draughtOfPeaceCase, felixFelicisCase, generatedBrightening, generatedCatalystCase,
    gillyweedCase, identifiedAntidoteCase, lingeringVaporCase,
    generatedAdmissionCase, generatedAgedIngredientCase, generatedHeatCase, generatedLateFlaskCase, generatedLinedVesselCase,
    generatedLotStorageChangeCase, generatedSpentLotCase,
    gurdyrootInfusionCase, invigorationCase, livingDeathUptakeCase, maturedFelixCase,
    measuredRemedyServingCase, murtlapEssenceCase, nutrientInfusionCase, poisoningAftercareCase, scarUnctionCase, shrinkingCase, silverAndDittanyCase, spreadingVaporCase,
    sharedAntidoteServingCase, storedInfusionCase, strengtheningCase, strengthQualifiedRemedyCase,
    mandrakeCase, messRemoverCase, pepperupCase, recoveredOriginCase, retainedCatalystCase, seerDoseCase, skeleGroCase, sleepingCakeCase, swellingCase,
    driedSplashCase, swellingSplashCase, swellingSurfaceCase, veritaserumAntidoteCase, veritaserumCase, washedSplashCase,
    witSharpeningCase, wolfsbaneCase}
    from '../src/world_packs/brew_coverage_cases.js';
import {readQuantity} from '../src/world_substrate.js';
import {brewDoseQuantity} from '../src/engine_brew_stock.js';
import {brewAssayMethod} from '../src/brew_assay.js';
import {BREW_LAW} from '../src/brew_law.js';

const response = world => readQuantity(world, 'recipient', 'responsiveness');

function bottledIntermediate() {
    const data = generatedBrightening();
    const source = 'saved-extract', sap = brewDoseQuantity('brightSap');
    data.world.holders.push({id: source, kind: 'thing', as: ['flask'], place: 'bench',
        quantities: {[sap]: 7, [brewDoseQuantity('spent-leaf')]: 2}});
    const assay = data.timeline[0].working;
    assay.method = brewAssayMethod({id: 'assay-extract', part: 'brightSap', resolution: 2});
    assay.bindings.flask = {kind: 'flask', id: source};
    delete assay.bindings.lot;
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    request.goal = {part: 'bright', amount: 9};
    request.reactions = [{...request.reaction, minutes: 3}];
    delete request.reaction;
    delete request.extent;
    data.expect[0] = {holder: source, quantity: sap, direction: 'down', to: 0};
    data.expect.push({holder: 'recipient', quantity: brewDoseQuantity('spent-leaf'), direction: 'up', to: 2});
    return {data, source, sap};
}

test('invention uses a restored flask assay to consume a bottled intermediate once', async () => {
    const {data, source, sap} = bottledIntermediate();
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const stale = structuredClone(data);
    const start = stale.timeline.findIndex(step => step.id === 'brew');
    stale.timeline.splice(start, 0, {id: 'draw-from-sampled-flask', ops: [{op: 'add', holder: source, quantity: sap, amount: -1}]},
        {id: 'restore-altered-flask', restore: true});
    const refused = await runCaseData(stale);
    assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
    assert.match(refused.detail, /^brew:/);

    const twoFlasks = structuredClone(data);
    const binder = brewDoseQuantity('stabilizer');
    twoFlasks.world.holders.push({id: 'saved-binder', kind: 'thing', as: ['flask'], place: 'bench', quantities: {[binder]: 3}});
    const secondAssay = twoFlasks.timeline.find(step => step.id === 'assay-salt').working;
    secondAssay.method = brewAssayMethod({id: 'assay-binder', part: 'stabilizer', resolution: 1});
    secondAssay.bindings.flask = {kind: 'flask', id: 'saved-binder'};
    delete secondAssay.bindings.lot;
    twoFlasks.expect[1] = {holder: 'saved-binder', quantity: binder, direction: 'down', to: 0};
    const flaskOnly = await runCaseData(twoFlasks);
    assert.equal(flaskOnly.state, 'expressed-authored', flaskOnly.detail);
});

test('invention projects a restored assay through bottle ageing before admission', async () => {
    const {data, source} = bottledIntermediate();
    data.world.holders.find(holder => holder.id === source).state = {
        'b.brew_storage': {bottledAt: 0, rate: 1, life: 16, keep: ['spent-leaf']},
    };
    data.timeline[0].working.method.steps[0].options.resolution = 1;
    data.expect.push({holder: 'recipient', quantity: brewDoseQuantity('brightSap:spent'), direction: 'up', to: 1});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const later = structuredClone(data);
    const brew = later.timeline.findIndex(step => step.id === 'brew');
    later.timeline.splice(brew, 0, {id: 'wait-past-usable-yield', advanceTo: 5}, {id: 'restore-aged-bottle', restore: true});
    const refused = await runCaseData(later);
    assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
    assert.match(refused.detail, /^brew:/);
});

test('invention uses the smallest guaranteed partial flask draw and leaves the remainder after restore', async () => {
    const {data, source, sap} = bottledIntermediate();
    data.timeline[0].working.method.steps[0].options.resolution = 1;
    data.expect.find(row => row.holder === source && row.quantity === sap).to = 1;
    data.expect.push({holder: source, quantity: brewDoseQuantity('spent-leaf'), direction: 'down', to: 0});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
});

function phaseDrawCase() {
    const {data, source, sap} = bottledIntermediate();
    const leaf = brewDoseQuantity('spent-leaf');
    const bottle = data.world.holders.find(holder => holder.id === source);
    bottle.quantities[sap] = 9;
    bottle.state = {'b.brew_fraction': {volume: 3, constituents: [
        {id: 'brightSap', phase: 'dissolved', amount: 9}, {id: 'spent-leaf', phase: 'settled', amount: 2},
    ]}};
    data.timeline[0].working.method.steps[0].options.resolution = 1;
    Object.assign(data.expect.find(row => row.holder === 'recipient' && row.quantity === leaf), {direction: 'unchanged', to: 0});
    const bottled = data.timeline.find(step => step.id === 'bottled');
    bottled.expect.push({holder: source, quantity: sap, direction: 'unchanged', to: 3},
        {holder: source, quantity: leaf, direction: 'unchanged', to: 2});
    data.world.holders.push({id: 'last-cup', kind: 'thing', as: ['flask'], place: 'bench'});
    data.timeline.push({id: 'decant-restored-remainder', working: {family: 'brew',
        bindings: {flask: {kind: 'flask', id: source}, receiver: {kind: 'flask', id: 'last-cup'}},
        method: {id: 'last-volume-unit', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask', receiver: 'flask'},
            steps: [{op: 'decant-flask', minutes: 1, bindings: {flask: 'flask', receiver: 'receiver'}, options: {volume: 1}}]},
    }}, {id: 'restore-pending-remainder-decant', restore: true},
    {id: 'remainder-decanted', advanceTo: 21, expect: [
        {holder: 'last-cup', quantity: sap, direction: 'up', to: 3},
        {holder: 'last-cup', quantity: leaf, direction: 'up', to: 2},
    ]});
    return {data, source, sap, leaf, bottle};
}

test('generated volume draws leave a saved phase packet and settled solids in the source', async () => {
    const {data, leaf} = phaseDrawCase();
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const coarse = structuredClone(data);
    coarse.timeline[0].working.method.steps[0].options.resolution = 2;
    coarse.timeline.find(step => step.id === 'bottled').expect.slice(-2).forEach(row => { row.to = 0; });
    coarse.timeline = coarse.timeline.slice(0, -3);
    Object.assign(coarse.expect.find(row => row.holder === 'recipient' && row.quantity === leaf), {direction: 'up', to: 2});
    const whole = await runCaseData(coarse);
    assert.equal(whole.state, 'expressed-authored', whole.detail);
});

test('a restored phase assay distinguishes dissolved sap from sediment of the same constituent', async () => {
    const {data, source, sap, bottle} = phaseDrawCase();
    bottle.quantities[sap] += 2;
    bottle.state['b.brew_fraction'].constituents.push({id: 'brightSap', phase: 'settled', amount: 2});
    data.engine.shared.properties.push({id: 'assay_phases', type: 'set'});
    const instrument = data.world.holders.find(holder => holder.id === 'kit');
    instrument.properties.assay_phases = ['dissolved'];
    const measure = data.timeline[0].working.method.steps[0];
    measure.options.phase = 'dissolved';
    data.timeline.find(step => step.id === 'bottled').expect.find(row => row.holder === source && row.quantity === sap).to = 5;
    data.timeline.at(-1).expect.find(row => row.quantity === sap).to = 5;
    const partial = await runCaseData(data);
    assert.equal(partial.state, 'expressed-authored', partial.detail);

    const inconsistent = structuredClone(data);
    inconsistent.world.holders.find(holder => holder.id === source).quantities[sap]--;
    const read = inconsistent.timeline.find(step => step.id === 'read-moss');
    read.interruption = {working: 'case.assay-moss', reason: 'assay-phase-stock-changed'};
    read.expect[0] = {holder: 'kit', quantity: 'stock:brew-assay-strip', direction: 'unchanged', to: 2};
    inconsistent.timeline.find(step => step.id === 'read-salt').expect[0].to = 1;
    const stale = await runCaseData(inconsistent);
    assert.equal(stale.state, 'blocked:runner-working-inputs', stale.detail);

    instrument.properties.assay_phases = ['suspended'];
    data.timeline.find(step => step.id === 'read-moss').interruption = {working: 'case.assay-moss', reason: 'assay-phase-unavailable'};
    data.timeline.find(step => step.id === 'read-moss').expect[0] =
        {holder: 'kit', quantity: 'stock:brew-assay-strip', direction: 'unchanged', to: 2};
    data.timeline.find(step => step.id === 'read-salt').expect[0].to = 1;
    const refused = await runCaseData(data);
    assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
    assert.match(refused.detail, /^brew:/);
});

test('a measured serving by volume leaves a phase-assayable remainder after restore', async () => {
    const {data, source, sap, leaf} = phaseDrawCase();
    data.engine.shared.properties.push({id: 'assay_phases', type: 'set'});
    data.world.holders.find(holder => holder.id === 'kit').properties.assay_phases = ['dissolved'];
    data.timeline[0].working.method.steps[0].options.phase = 'dissolved';
    const first = structuredClone(data.timeline.find(step => step.id === 'serve'));
    first.id = 'serve-one-volume';
    first.working.bindings.flask.id = source;
    Object.assign(first.working.method.steps[0].options, {volume: 1, responses: []});
    data.timeline.unshift(first, {id: 'restore-pending-volume-dose', restore: true},
        {id: 'volume-dose-settled', advanceTo: 2, expect: [
            {holder: 'recipient', quantity: sap, direction: 'up', to: 3},
            {holder: 'recipient', quantity: leaf, direction: 'unchanged', to: 0},
        ]}, {id: 'restore-volume-remainder', restore: true});
    for (const step of data.timeline.slice(4)) if (step.advanceTo !== undefined) step.advanceTo += 2;
    const decant = data.timeline.findIndex(step => step.id === 'decant-restored-remainder');
    data.timeline.splice(decant);
    const bottled = data.timeline.find(step => step.id === 'bottled');
    bottled.expect.find(row => row.holder === source && row.quantity === sap).to = 0;
    bottled.expect.find(row => row.holder === source && row.quantity === leaf).to = 0;
    Object.assign(data.expect.find(row => row.holder === 'recipient' && row.quantity === leaf), {direction: 'up', to: 2});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('a generated partial draw ages the drawn stock and preserves the source ageing clock', async () => {
    const {data, source, sap} = bottledIntermediate();
    const sourceFlask = data.world.holders.find(holder => holder.id === source);
    const leaf = brewDoseQuantity('spent-leaf');
    sourceFlask.quantities[sap] = 10;
    sourceFlask.state = {'b.brew_storage': {bottledAt: 0, rate: 1, life: 16, keep: ['spent-leaf']}};
    data.timeline[0].working.method.steps[0].options.resolution = 1;
    const brewed = data.timeline.find(step => step.id === 'bottled');
    brewed.expect.push({holder: source, quantity: sap, direction: 'unchanged', to: 2},
        {holder: source, quantity: leaf, direction: 'unchanged', to: 1});
    const followUp = structuredClone(data.timeline.find(step => step.id === 'serve'));
    followUp.id = 'serve-remainder';
    followUp.working.bindings.flask.id = source;
    followUp.working.method.steps[0].options.responses = [];
    data.timeline.splice(data.timeline.findIndex(step => step.id === 'recover'), 0,
        {id: 'wait-for-original-expiry', advanceTo: 14},
        followUp, {id: 'restore-pending-remainder', restore: true},
        {id: 'remainder-served', advanceTo: 16, expect: [
            {holder: source, quantity: sap, direction: 'down', to: 0},
            {holder: 'recipient', quantity: brewDoseQuantity('brightSap:spent'), direction: 'up', to: 4},
        ]}, {id: 'restore-served-remainder', restore: true});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('invention carries excess reactants through restored fractional conversion stages', async () => {
    const data = generatedBrightening({staged: true});
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    request.reactions = [{id: 'bind-at-half-rate', minutes: 2, limitPermille: 500,
        reactants: {brightSap: 2, stabilizer: 1}, products: {bright: 3}}];
    data.timeline.find(step => step.id === 'mid-brew').advanceTo = 6;
    const bottled = data.timeline.findIndex(step => step.id === 'bottled');
    for (const step of data.timeline.slice(bottled)) if (step.advanceTo !== undefined) step.advanceTo--;
    data.expect.find(row => row.holder === 'moss').to = 2;
    data.expect.find(row => row.holder === 'salt').to = 6;
    data.expect.push({holder: 'recipient', quantity: brewDoseQuantity('brightSap'), direction: 'up', to: 4},
        {holder: 'recipient', quantity: brewDoseQuantity('stabilizer'), direction: 'up', to: 2});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    for (const constraints of [{maxStages: 1}, {reactions: [{...request.reactions[0], limitPermille: 0}]}]) {
        const control = structuredClone(data);
        Object.assign(control.timeline.find(step => step.id === 'brew').working.request, constraints);
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
    }
});

test('assay-driven invention carries a required origin through an intermediate and restore', async () => {
    const data = generatedBrightening({staged: true});
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    request.reactions.shift();
    request.reactions[0].requiresOrigins = {brightSap: 'garden'};
    request.reactions[0].productOrigins = {primed: 'garden'};
    request.reactions[1].requiresOrigins = {primed: 'garden'};
    for (const id of ['moss', 'salt']) data.engine.host.things[`lot:${id}`].origin = 'garden';
    const generated = await runCaseData(data);
    assert.equal(generated.state, 'expressed-authored', generated.detail);

    const mixed = structuredClone(data);
    mixed.engine.host.things['lot:salt'].origin = 'market';
    const wrongOrigin = await runCaseData(mixed);
    assert.equal(wrongOrigin.state, 'blocked:runner-working-inputs', wrongOrigin.detail);

    const unlabelledProduct = structuredClone(data);
    delete unlabelledProduct.timeline.find(step => step.id === 'brew').working.request.reactions[0].productOrigins;
    const unknownOrigin = await runCaseData(unlabelledProduct);
    assert.equal(unknownOrigin.state, 'blocked:runner-working-inputs', unknownOrigin.detail);

    const residue = structuredClone(data);
    residue.world.holders.find(holder => holder.id === 'cauldron').quantities = {'stock:brew-film.primed': 1};
    const contaminated = await runCaseData(residue);
    assert.equal(contaminated.state, 'blocked:runner-working-inputs', contaminated.detail);
});

test('an updated lot revision invalidates a restored assay until it is measured again', async () => {
    const data = generatedBrightening();
    const revision = 'brew-lot-revision';
    data.engine.shared.properties.push({id: revision, type: 'label'});
    const kit = data.world.holders.find(holder => holder.id === 'kit');
    const strip = 'stock:brew-assay-strip';
    kit.quantities[strip] = 3;
    data.timeline.find(step => step.id === 'read-moss').expect[0].to = 2;
    data.timeline.find(step => step.id === 'read-salt').expect[0].to = 1;
    const brew = data.timeline.findIndex(step => step.id === 'brew');
    data.timeline.splice(brew, 0, {id: 'replace-lot-composition', ops: [
        {op: 'property', holder: 'moss', property: revision, value: 'replacement'},
    ]}, {id: 'restore-replaced-lot', restore: true});
    const stale = await runCaseData(data);
    assert.equal(stale.state, 'blocked:runner-working-inputs', stale.detail);
    assert.match(stale.detail, /^brew:/);

    const remeasure = structuredClone(data.timeline.find(step => step.id === 'assay-moss'));
    remeasure.id = 'remeasure-moss';
    data.timeline.splice(brew + 2, 0, remeasure, {id: 'restore-pending-remeasurement', restore: true},
        {id: 'read-new-revision', advanceTo: 6}, {id: 'restore-new-revision', restore: true});
    for (const step of data.timeline.slice(brew + 6)) if (step.advanceTo !== undefined) step.advanceTo += 2;
    const refreshed = await runCaseData(data);
    assert.equal(refreshed.state, 'expressed-authored', refreshed.detail);
});

test('a measured varnish coating protects only the treated broom through restore and expiry', async () => {
    for (const data of [sharedBrewCase('anti_jinx_varnish'), antiJinxVarnishCase({amount: 1}),
        antiJinxVarnishCase({wash: true}), antiJinxVarnishCase({wash: true, washPart: 'water'}),
        antiJinxVarnishCase({wash: true, amount: 3}), antiJinxVarnishCase({recoat: true, amount: 1}),
        antiJinxVarnishCase({recoat: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored Invigoration stirring reads the operator’s focus and reach before spending effort', async () => {
    for (const data of [sharedBrewCase('invigoration_draught'), invigorationCase({distraction: 2}),
        invigorationCase({distraction: 3}), invigorationCase({leave: true}), invigorationCase({stamina: 1})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('an interrupted stir can be restored and retried without readmitting ingredients or double spending', async () => {
    for (const options of [{distraction: 5}, {leave: true}, {stamina: 1}]) {
        const result = await runCaseData(invigorationCase({...options, resume: true}));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const duplicate = invigorationCase({leave: true, resume: true});
    duplicate.timeline.push({id: 'duplicate-stir', resumeBrewStir: {from: 'case.brew'}});
    await assert.rejects(runCaseData(duplicate), /already has a continuation/);
});

test('a restored stir retry uses the two already paid strokes to complete the reversal', async () => {
    for (const options of [{}, {leave: true, resume: true}, {distraction: 2, resume: true}, {stamina: 2, resume: true}]) {
        const result = await runCaseData(invigorationCase({...options, segmented: true}));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const brokenPattern = invigorationCase({leave: true, segmented: true, resume: true});
    brokenPattern.timeline[0].working.method.steps[3].options.pattern = 'new-pattern';
    const result = await runCaseData(brokenPattern);
    assert.equal(result.state, 'blocked:runner-expect-mismatch', result.detail);
    assert.match(result.detail, /^retry-bottled:/);
});

test('Gurdyroot infusion keeps the plain share separate through restored sweetening and drinking', async () => {
    const ledger = readLedgers().find(({name}) => name === 'hp_ingredients');
    const row = ledger.rows.find(({id}) => id === 'hp.ingredient.gurdyroot');
    const canonicalCase = await runCase(row);
    assert.equal(canonicalCase.state, 'expressed-authored', canonicalCase.detail);
    for (const options of [{sweeten: false}, {removeSugar: true}, {measured: true}, {measured: true, removeSugar: true}]) {
        const result = await runCaseData(gurdyrootInfusionCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const overlap = gurdyrootInfusionCase({measured: true, removeSugar: true});
    overlap.timeline = overlap.timeline.filter(step => !['take-sugar', 'restore-away-sugar'].includes(step.id));
    overlap.engine.host.things['lot:sugar'].properties.constituents = {'gurdyroot-extract': 1000};
    const settlement = overlap.timeline.find(step => step.id === 'sweetening-settled');
    settlement.interruption = {working: 'case.sweeten', reason: 'additive-overlaps-ageing-constituent'};
    const result = await runCaseData(overlap);
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('peppermint changes the restored Euphoria Elixir side effect while preserving the mood response', async () => {
    for (const data of [sharedBrewCase('elixir_to_induce_euphoria'), euphoriaCase({mintUnits: 1}),
        euphoriaCase({mintUnits: 0}), euphoriaCase({mintUnits: 0, route: 'topical'})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('Dittany stops an ongoing bleed without replenishing lost blood, with dose and route controls', async () => {
    const ledger = readLedgers().find(({name}) => name === 'hp_ingredients');
    const row = ledger.rows.find(({id}) => id === 'hp.ingredient.essence_of_dittany');
    assert.equal((await runCase(row)).state, 'expressed-authored');
    for (const data of [dittanyCase({amount: 1}), dittanyCase({amount: 2}), dittanyCase({route: 'oral'})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('the authored Calming Draught response expires after a saved oral dose', async () => {
    for (const data of [sharedBrewCase('calming_draught'), calmingDraughtCase({route: 'topical'})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a retained catalyst gates both staged and cascading reactions at settlement', async () => {
    for (const data of [sharedBrewCase('retained_catalyst'), retainedCatalystCase({remove: true}), retainedCatalystCase({spent: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const absent = retainedCatalystCase();
    absent.timeline.splice(2, 0, {id: 'remove-before-priming', ops: [{op: 'move', holder: 'mesh', to: 'hall'}]});
    const result = await runCaseData(absent);
    assert.equal(result.state, 'blocked:runner-expect-mismatch');
    assert.match(result.detail, /^bottled:/);
});

test('Mandrake restoration requires the mature extract and the authored route', async () => {
    for (const options of [{mature: false}, {route: 'topical'}]) {
        const result = await runCaseData(mandrakeCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('Seer charge determines the restored oral hazard independently of potency', async () => {
    for (const options of [{blood: 9000}, {blood: 13000}, {blood: 13000, halfServing: true}, {blood: 13000, route: 'topical'}]) {
        const result = await runCaseData(seerDoseCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('equal recovered fractions react differently by saved source after restore', async () => {
    for (const data of [sharedBrewCase('recovered_origin'), recoveredOriginCase({origin: 'store'}), recoveredOriginCase({mixed: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('the generic runner restores an interrupted Draught of Peace, then pours and serves it', async () => {
    const data = sharedBrewCase('resumed_draught_of_peace');
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const noFailure = sharedBrewCase('resumed_draught_of_peace');
    noFailure.timeline = noFailure.timeline.filter(step => step.id !== 'move-flask');
    const mismatch = await runCaseData(noFailure);
    assert.equal(mismatch.state, 'blocked:runner-expect-mismatch');
    assert.match(mismatch.detail, /^failed-pour:/);
});

test('a restored Swelling Solution spill reallocates the same pool when a target leaves', async () => {
    const result = await runCaseData(swellingSplashCase({withdraw: true}));
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('saved surface residue can swell a second exposed target and stays on the source when covered', async () => {
    for (const covered of [false, true]) {
        const result = await runCaseData(swellingSurfaceCase({covered}));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a saved paid wash sends residue and solvent to runoff and prevents secondary swelling', async () => {
    const washed = await runCaseData(washedSplashCase());
    assert.equal(washed.state, 'expressed-authored', washed.detail);
    const short = await runCaseData(washedSplashCase({short: true}));
    assert.equal(short.state, 'blocked:runner-working-interrupted');
    assert.match(short.detail, /rinse-solvent-unavailable/);
});

test('a coating dries across restore, conserving residue and preventing further exposure', async () => {
    const restored = await runCaseData(driedSplashCase());
    assert.equal(restored.state, 'expressed-authored', restored.detail);
    const direct = driedSplashCase();
    direct.timeline = direct.timeline.filter(step => !['contact-time', 'restore-wet-surface', 'restore-dry-coating'].includes(step.id));
    const result = await runCaseData(direct);
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('Deflating Draught clears a saved swelling layer by the oral route', async () => {
    const wrongRoute = await runCaseData(swellingCase({remedyRoute: 'topical'}));
    assert.equal(wrongRoute.state, 'expressed-authored', wrongRoute.detail);

    const wrongLayer = swellingCase();
    wrongLayer.timeline.find(step => step.id === 'administer-deflating')
        .working.method.steps[0].options.responses[0].clearTemporaryForm = 'other-form';
    const result = await runCaseData(wrongLayer);
    assert.equal(result.state, 'blocked:runner-expect-mismatch');
    assert.match(result.detail, /^deflate:/);
});

test('a loaded Sleeping Draught cake needs both its carrier and ingestion after restore', async () => {
    const topical = await runCaseData(sleepingCakeCase({route: 'topical'}));
    assert.equal(topical.state, 'expressed-authored', topical.detail);

    const missingCarrier = sleepingCakeCase();
    missingCarrier.timeline.find(step => step.id === 'serve').working.method.steps[0].options.responses[0]
        .requires[0].minimum = 7;
    const result = await runCaseData(missingCarrier);
    assert.equal(result.state, 'blocked:runner-expect-mismatch');
    assert.match(result.detail, /^settle-serving:/);

    const removedBottle = sleepingCakeCase();
    removedBottle.world.holders.push({id: 'pantry', kind: 'place'});
    removedBottle.timeline.splice(2, 0, {id: 'move-source', ops: [
        {op: 'move', holder: 'draught-bottle', to: 'pantry'},
    ]});
    const interrupted = await runCaseData(removedBottle);
    assert.equal(interrupted.state, 'blocked:runner-working-interrupted');
    assert.match(interrupted.detail, /flask-out-of-reach/);
});

test('the stock-backed Draught of Living Death needs oral delivery and the real uptake reader', async () => {
    for (const options of [{route: 'topical'}, {halfServing: true}]) {
        const result = await runCaseData(livingDeathUptakeCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }

    const wrongAccount = livingDeathUptakeCase();
    wrongAccount.engine.settings['l.living_body'].dose.active = 'energy:other-active';
    const result = await runCaseData(wrongAccount);
    assert.equal(result.state, 'blocked:runner-expect-mismatch');
    assert.match(result.detail, /^settle-serving:/);

    const occupied = livingDeathUptakeCase();
    const liquid = occupied.engine.settings['l.living_body'].dose.liquid;
    occupied.world.holders.find(holder => holder.id === 'recipient').quantities[liquid] = 1;
    const refused = await runCaseData(occupied);
    assert.equal(refused.state, 'blocked:runner-working-interrupted');
    assert.match(refused.detail, /liquid-uptake-account-unavailable/);
});

test('short thickening, undersized serving and an inert counteragent survive restore with their distinct outcomes', async () => {
    for (const data of [confusingConcoctionCase({restMinutes: 2}), forgetfulnessPotionCase({amount: 3}), shrinkingCase({reverse: false})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('the shared treatment proofs distinguish preparation and administration route through restore', async () => {
    for (const data of [silverAndDittanyCase({powdered: false}), silverAndDittanyCase({route: 'oral'}),
        commonPoisonAntidoteCase({route: 'topical'})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('an overmeasured shrinking brew restores its orange cue and harms the recipient', async () => {
    const data = shrinkingCase({juice: 2});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const wrongCue = structuredClone(data);
    const restored = wrongCue.timeline.find(step => step.id === 'restore-colour');
    restored.expectObserved = {...restored.expectObserved, to: {cues: ['acid green']}};
    assert.deepEqual(await runCaseData(wrongCue), {
        state: 'blocked:runner-expect-mismatch', detail: 'restore-colour: working observation did not match',
    });
});

test('a restored Draught of Peace spends fuel but gives no silver vapour or relief without syrup', async () => {
    const result = await runCaseData(draughtOfPeaceCase({syrup: false}));
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('the stock-backed Hogwarts potion cases earn authored expression through the common runner', async () => {
    const ledger = readLedgers().find(({name}) => name === 'hp_potions');
    assert.deepEqual(ledger.problems, []);
    const cases = ledger.rows.filter(row => row.case);
    assert.equal(cases.length, 34);
    const row = cases.find(row => row.id === 'hp.potion.draught_of_living_death');
    assert.equal(row.state, 'expressed-authored');
    assert.match(row.source, /oldid=1992923; HPPE006; HPPE007; HPPE008; HPPE009; HPPE010; HPPE011; HPPE012; HPPE088$/);
    for (const candidate of cases) assert.equal((await runCase(candidate)).state, 'expressed-authored');

    const data = coverageCase(DRAUGHT_CASE_ID);
    const noUptake = structuredClone(data);
    noUptake.engine.settings['l.living_body'].dose.liquid = 'energy:other-liquid';
    const uptakeResult = await runCaseData(noUptake);
    assert.equal(uptakeResult.state, 'blocked:runner-expect-mismatch');
    assert.match(uptakeResult.detail, /^dose:/);

    const slowerRecovery = structuredClone(data);
    slowerRecovery.engine.settings['l.living_body'].dose.recoveryPerMinute = 6;
    const recoveryResult = await runCaseData(slowerRecovery);
    assert.equal(recoveryResult.state, 'blocked:runner-expect-mismatch');
    assert.match(recoveryResult.detail, /^before-recovery:/);
});

test('Polyjuice binds only the selected serving to the actual donor after restore', async () => {
    for (const donor of ['goyle', 'crabbe', 'cat']) {
        const result = await runCaseData(polyjuiceCase({donor}));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const unavailable = polyjuiceCase();
    unavailable.world.holders.push({id: 'hall', kind: 'place'});
    const afterDivide = unavailable.timeline.findIndex(step => step.id === 'restore-separated-base') + 1;
    unavailable.timeline.splice(afterDivide, 0, {id: 'remove-sample', ops: [{op: 'move', holder: 'hair', to: 'hall'}]});
    const refused = await runCaseData(unavailable);
    assert.equal(refused.state, 'blocked:runner-working-interrupted');
    assert.match(refused.detail, /sample-out-of-reach/);
});

test('Polyjuice maturation and fluxweed grade affect the base before the same donor sample is served', async () => {
    for (const options of [{stewMinutes: 20160}, {stewMinutes: 20159}, {fullMoon: false}]) {
        const result = await runCaseData(polyjuiceCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const unmatured = polyjuiceCase();
    const {steps} = unmatured.timeline[0].working.method;
    const reaction = steps.find(step => step.op === 'react');
    // Keep the finish time and every input the same, but settle the reaction before the wait.
    steps.splice(steps.indexOf(reaction) + 1, 0, {op: 'cool', bindings: {vessel: 'vessel'}, minutes: reaction.minutes});
    reaction.minutes = 0;
    const result = await runCaseData(unmatured);
    assert.equal(result.state, 'blocked:runner-expect-mismatch');
    assert.match(result.detail, /^settle-serving:/);
});

test('treacle treatment after restore respects dose, route and the identity of the active symptom', async () => {
    for (const options of [{}, {smallDose: true}, {route: 'topical'}, {hold: 'another.effect'}]) {
        const data = alihotsyAntidoteCase(options);
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a saved potion identification binds a live remedy for its observer', async () => {
    for (const options of [{observer: 'witness'}, {concealed: true}, {removeRemedy: true}]) {
        const result = await runCaseData(identifiedAntidoteCase(options));
        assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
        assert.match(result.detail, /^administer-remedy:/);
    }
    const mismatchedRemedy = identifiedAntidoteCase();
    const remedy = mismatchedRemedy.world.holders.find(holder => holder.id === 'remedy');
    remedy.properties.antidote_for = 'absent-part';
    const result = await runCaseData(mismatchedRemedy);
    assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
});

test('a partial assay can bind a targeted remedy after restore when it confirms presence', async () => {
    const data = sharedBrewCase('assayed_alihotsy_remedy');
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const stale = structuredClone(data);
    const index = stale.timeline.findIndex(step => step.id === 'administer-remedy');
    stale.timeline.splice(index, 0, {id: 'alter-assayed-dose', ops: [
        {op: 'add', holder: 'flask', quantity: brewDoseQuantity('alihotsy'), amount: -1},
    ]}, {id: 'restore-altered-assay-dose', restore: true});
    for (const control of [stale, identifiedAntidoteCase({panelResolution: 5}),
        identifiedAntidoteCase({panelResolution: 3, observer: 'witness'})]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^administer-remedy:/);
    }
});

test('a restored remedy selector checks the whole strength band before preferring a tailored dose', async () => {
    const valid = await runCaseData(sharedBrewCase('strength_qualified_remedy'));
    assert.equal(valid.state, 'expressed-authored', valid.detail);
    const tooNarrow = strengthQualifiedRemedyCase({min: 500});
    const generic = tooNarrow.world.holders.find(holder => holder.id === 'other-remedy');
    generic.properties.antidote_for = 'mint';
    for (const control of [tooNarrow, strengthQualifiedRemedyCase({competing: true})]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^administer-remedy:/);
    }
    const exact = strengthQualifiedRemedyCase({panelResolution: 1, min: 500, max: 500});
    const precise = await runCaseData(exact);
    assert.equal(precise.state, 'expressed-authored', precise.detail);
});

test('a restored remedy draw follows the measured exposure bracket and preserves unused stock', async () => {
    for (const data of [sharedBrewCase('measured_remedy_serving'), measuredRemedyServingCase({per: 4, panelResolution: 1})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    for (const control of [measuredRemedyServingCase({per: 4}), measuredRemedyServingCase({serving: 8})]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^administer-remedy:/);
    }
    const changed = measuredRemedyServingCase();
    const treatment = changed.timeline.findIndex(step => step.id === 'treatment');
    const quantity = brewDoseQuantity('treacle');
    changed.timeline.splice(treatment, changed.timeline.length - treatment,
        {id: 'draw-from-pending-remedy', ops: [{op: 'add', holder: 'remedy', quantity, amount: -1}]},
        {id: 'restore-changed-remedy', restore: true},
        {id: 'refused-remedy', advanceTo: 8, interruption: {working: 'case.administer-remedy', reason: 'remedy-stock-changed'},
            expect: [{holder: 'remedy', quantity, direction: 'unchanged', to: 5}]});
    changed.expect = changed.expect.filter(row => row.quantity !== quantity);
    const rejected = await runCaseData(changed);
    assert.equal(rejected.state, 'expressed-authored', rejected.detail);
});

test('a restored antidote sizes its draw for the live burden and preserves stock if treatment cannot proceed', async () => {
    for (const data of [sharedBrewCase('burden_sized_antidote'), burdenSizedAntidoteCase({remainingBurden: 0}),
        burdenSizedAntidoteCase({remainingBurden: 5}), burdenSizedAntidoteCase({aged: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a restored blend sizes its serving using the treatment priority for a shared active', async () => {
    for (const data of [sharedBrewCase('shared_antidote_serving'), sharedAntidoteServingCase({allTargets: false}),
        sharedAntidoteServingCase({short: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a saved empty reassay stops the brew delivery from using an older ingredient reading', async () => {
    const data = identifiedAntidoteCase();
    const first = data.timeline.find(step => step.id === 'inspect-exposure');
    const index = data.timeline.findIndex(step => step.id === 'administer-remedy');
    data.timeline.splice(index, 0, {id: 'drain-exposure', ops: ['alihotsy', 'alihotsy:matrix'].map(part => ({
        op: 'add', holder: 'flask', quantity: brewDoseQuantity(part), amount: -4,
    }))}, {id: 'inspect-empty', working: structuredClone(first.working)},
    {id: 'settle-empty', advanceTo: 6}, {id: 'restore-empty', restore: true});
    const result = await runCaseData(data);
    assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
    assert.match(result.detail, /^administer-remedy:/);
});

test('a restored blend reading survives as knowledge and needs a fresh assay after stock changes', async () => {
    const data = identifiedBlendCase();
    const index = data.timeline.findIndex(step => step.id === 'brew');
    const quantity = brewDoseQuantity('b');
    data.timeline.splice(index, 0, {id: 'draw-from-sample', ops: [
        {op: 'add', holder: 'poison-sample', quantity, amount: -1},
    ]}, {id: 'restore-drawn-sample', restore: true, expect: [
        {holder: 'healer', belief: `assay:poison-sample:1:${quantity}`, direction: 'unchanged', to: 2},
    ]});
    const stale = await runCaseData(data);
    assert.equal(stale.state, 'blocked:runner-working-inputs', stale.detail);
    assert.match(stale.detail, /^brew:/);

    data.timeline.splice(index + 2, 0, {id: 'reassay-drawn-sample', working: structuredClone(data.timeline[0].working)},
        {id: 'read-drawn-sample', advanceTo: 2, expect: [
            {holder: 'healer', belief: `assay:poison-sample:2:${quantity}`, direction: 'changed', to: 1},
            {holder: 'healer', quantity: 'stamina', direction: 'down', to: 3},
        ]}, {id: 'restore-fresh-reading', restore: true});
    for (const step of data.timeline.slice(index + 5))
        if (step.advanceTo !== undefined) step.advanceTo++;
    const paid = data.expect.findIndex(row => row.holder === 'healer' && row.quantity === 'stamina');
    data.expect[paid] = {...data.expect[paid], to: 3};
    Object.assign(data.expect.find(row => row.holder === 'poison-sample' && row.quantity === quantity),
        {direction: 'down', to: 1});
    const refreshed = await runCaseData(data);
    assert.equal(refreshed.state, 'expressed-authored', refreshed.detail);
});

test('a saved remedy identification expires when ageing changes the sample reading', async () => {
    const data = identifiedAntidoteCase();
    const sample = data.world.holders.find(holder => holder.id === 'flask');
    const inspect = data.timeline.findIndex(step => step.id === 'inspect-exposure');
    data.timeline.splice(inspect, 0, {id: 'store-sample', ops: [{op: 'state', holder: sample.id,
        pack: 'b.brew_storage', value: {bottledAt: 4, life: 5}}]});
    const administer = data.timeline.findIndex(step => step.id === 'administer-remedy');
    data.timeline.splice(administer, 0, {id: 'wait-for-ageing', advanceTo: 6}, {id: 'restore-aged-sample', restore: true});
    const result = await runCaseData(data);
    assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
    assert.match(result.detail, /^administer-remedy:/);
});

test('the brew delivery selector cannot bind an antidote to an ingredient that spoiled before inspection', async () => {
    const data = identifiedAntidoteCase();
    const index = data.timeline.findIndex(step => step.id === 'inspect-exposure');
    const inspection = data.timeline[index].working.spells[0];
    inspection.target.kind = 'flask';
    data.timeline.splice(index, 0, {id: 'store-retained-sample', ops: [{op: 'state', holder: 'flask',
        pack: 'b.brew_storage', value: {bottledAt: 4, life: 1}}]});
    delete data.timeline.find(step => step.id === 'identify-exposure').expect;
    const result = await runCaseData(data);
    assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
    assert.match(result.detail, /^administer-remedy:/);
});

test('the Wit-Sharpening brew requires the prepared scarab fraction', async () => {
    const data = witSharpeningCase();
    const {steps} = data.timeline[0].working.method;
    steps.splice(steps.findIndex(step => step.op === 'prepare' && step.bindings.lot === 'scarab'), 1);
    const result = await runCaseData(data);
    assert.equal(result.state, 'blocked:runner-expect-mismatch');
    assert.match(result.detail, /^bottled:/);
});

test('restored Wit-Sharpening needs enough oral dose to restore the ability to focus', async () => {
    for (const options of [{amount: 3}, {route: 'topical'}]) {
        const result = await runCaseData(witSharpeningCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('the same measured Doxycide serving leaves the target free to flee by the oral route', async () => {
    const result = await runCaseData(doxycideCase({route: 'oral'}));
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('restored Amortentia checks both scent access and the conditions for pursuit', async () => {
    for (const options of [{route: 'topical'}, {closed: true}, {sealed: true}, {secondCanSmell: false}]) {
        const result = await runCaseData(amortentiaCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const moved = amortentiaCase();
    const read = moved.timeline.findIndex(step => step.id === 'read-aromas');
    moved.timeline.splice(read, 0, {id: 'remove-sample', ops: [{op: 'move', holder: 'flask', to: 'study'}]});
    const interrupted = await runCaseData(moved);
    assert.equal(interrupted.state, 'blocked:runner-working-interrupted');
    assert.match(interrupted.detail, /aroma-out-of-reach/);
});

test('object cleaning distinguishes diluted solvent from a deposit the cleaner cannot remove after restore', async () => {
    const diluted = await runCaseData(messRemoverCase({diluted: true}));
    assert.equal(diluted.state, 'expressed-authored', diluted.detail);
    const moved = messRemoverCase();
    moved.world.holders.push({id: 'hall', kind: 'place'});
    moved.timeline.splice(2, 0, {id: 'remove-cleaner', ops: [{op: 'move', holder: 'bottle', to: 'hall'}]});
    const interrupted = await runCaseData(moved);
    assert.equal(interrupted.state, 'blocked:runner-working-interrupted');
    assert.match(interrupted.detail, /rinse-solvent-out-of-reach/);
});

test('Murtlap straining respects mesh and work, and a repaired bowl cannot spill twice', async () => {
    const coarse = await runCaseData(murtlapEssenceCase({meshSize: 20}));
    assert.equal(coarse.state, 'expressed-authored', coarse.detail);
    const short = await runCaseData(murtlapEssenceCase({workStock: 3}));
    assert.equal(short.state, 'blocked:runner-working-interrupted');
    assert.match(short.detail, /filter-cost-unavailable/);

    const repeat = murtlapEssenceCase();
    const drop = structuredClone(repeat.timeline.find(step => step.id === 'drop'));
    repeat.timeline.push({...drop, id: 'drop-again'}, {id: 'settle-repeat', advanceTo: 5});
    const empty = await runCaseData(repeat);
    assert.equal(empty.state, 'blocked:runner-working-interrupted');
    assert.match(empty.detail, /drop-again.*serving-unavailable/);
});

test('restored Felix changes eligible odds without guaranteeing disclosure', async () => {
    for (const options of [{route: 'topical'}, {expired: true}, {unrelated: true}, {odds: 0}, {drawRoot: 3, succeeds: false}]) {
        const result = await runCaseData(felixFelicisCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('Felix bottled one minute short of the maturation threshold gives no luck after restore', async () => {
    const result = await runCaseData(maturedFelixCase({early: true}));
    assert.equal(result.state, 'expressed-authored', result.detail);
});

test('excess oral Felix preserves the luck effect and causes lasting vitality loss after restore', async () => {
    for (const options of [{amount: 6}, {amount: 6, expired: true}, {amount: 6, route: 'topical'}, {amount: 2}]) {
        const result = await runCaseData(felixFelicisCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored Veritaserum disclosure requires active oral compulsion, speech and recall', async () => {
    for (const options of [{route: 'topical'}, {delay: 3}, {awake: false}, {remembered: false},
        {silenced: true}, {recalledCode: 'birch'}]) {
        const result = await runCaseData(veritaserumCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('Veritaserum protection works in either order and expires independently after restore', async () => {
    for (const options of [{before: true}, {route: 'topical'}, {waitForExpiry: true},
        {before: true, waitForExpiry: true}, {willing: true}]) {
        const result = await runCaseData(veritaserumAntidoteCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored bone growth requires oral delivery and caps regrowth at the missing amount', async () => {
    for (const options of [{route: 'topical'}, {amount: 2}, {existingBone: 420}, {existingBone: 480}]) {
        const result = await runCaseData(skeleGroCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('Strengthening Solution needs a mature oral dose that stays active through the haul', async () => {
    for (const options of [{early: true}, {substituted: true}, {route: 'topical'}, {expired: true}]) {
        const result = await runCaseData(strengtheningCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored Cure for Boils distinguishes the contact injury, dose size, and treatment route', async () => {
    for (const options of [{withdraw: true}, {halfDose: true}, {route: 'oral'}]) {
        const result = await runCaseData(cureForBoilsCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored poisoning care stabilizes breathing before two measured aftercare doses', async () => {
    for (const data of [sharedBrewCase('poisoning_aftercare'), poisoningAftercareCase({acuteRoute: 'topical'})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored scar care improves only as far as the applied topical doses fund it', async () => {
    for (const options of [{route: 'oral'}, {repeated: false}]) {
        const result = await runCaseData(scarUnctionCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('Bubotuber collection and dilution preserve stock and distinguish skin effects after restore', async () => {
    const ledger = readLedgers().find(({name}) => name === 'hp_ingredients');
    const row = ledger.rows.find(({id}) => id === 'hp.ingredient.bubotuber_pus');
    assert.equal((await runCase(row)).state, 'expressed-authored');
    for (const options of [{gloves: false}, {dilute: false}]) {
        const result = await runCaseData(bubotuberCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('eating held Gillyweed preserves breath on a restored underwater task', async () => {
    const ledger = readLedgers().find(({name}) => name === 'hp_ingredients');
    const row = ledger.rows.find(({id}) => id === 'hp.ingredient.gillyweed');
    assert.equal((await runCase(row)).state, 'expressed-authored');
    const control = await runCaseData(gillyweedCase({available: false}));
    assert.equal(control.state, 'expressed-authored', control.detail);
});

test('a restored air link moves vapor only while open and leaves transferred vapor in the next room', async () => {
    for (const data of [sharedBrewCase('spreading_vapor'), spreadingVaporCase({closeBeforeSpread: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a restored vapor cloud exposes late entrants and conserves the release', async () => {
    const stepped = lingeringVaporCase();
    const end = stepped.timeline.findIndex(step => step.id === 'cloud-clears');
    stepped.timeline.splice(end, 0, {id: 'one-minute-in-cloud', advanceTo: 3}, {id: 'restore-mid-cloud', restore: true});
    for (const data of [sharedBrewCase('lingering_vapor'), lingeringVaporCase({enterLate: false}), stepped]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a restored nutrient infusion produces forage the existing grazing action can consume', async () => {
    const direct = nutrientInfusionCase();
    direct.timeline = direct.timeline.filter(step => !['mid-growth', 'restore-mid-growth'].includes(step.id));
    for (const data of [sharedBrewCase('nutrient_infusion'), nutrientInfusionCase({uptake: false}), direct]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('the restored Age Line reads lived age and checks reach again when the crossing settles', async () => {
    for (const options of [{years: 17}, {route: 'topical'}]) {
        const result = await runCaseData(ageingPotionCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const result = await runCaseData(ageingPotionCase({removeLine: true}));
    assert.equal(result.state, 'blocked:runner-working-interrupted');
    assert.match(result.detail, /age-line-out-of-reach/);
});

test('early or sweetened Wolfsbane still allows the wolf change and leaves instinct in control', async () => {
    for (const options of [{early: true}, {sweetened: true}]) {
        const result = await runCaseData(wolfsbaneCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('Pepperup relief and steam have separate dose thresholds after restore', async () => {
    for (const options of [{route: 'topical'}, {amount: 2}, {amount: 3}]) {
        const result = await runCaseData(pepperupCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored blood replacement checks oral uptake and caps circulating volume', async () => {
    for (const options of [{route: 'topical'}, {blood: 98}]) {
        const result = await runCaseData(bloodReplenishingCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('restored Murtlap relief requires topical delivery and enough strained essence', async () => {
    for (const options of [{reliefRoute: 'oral'}, {reliefRoute: 'topical', doseAmount: 4}]) {
        const result = await runCaseData(murtlapEssenceCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('the classroom blended antidote reduces the joint burden only when the brew forms a combined remedy', async () => {
    for (const data of [sharedBrewCase('blended_antidote_trial'), blendedAntidoteCase({withBinder: false})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a restored whole-blend identification selects the brew that treats the combined burden', async () => {
    for (const options of [{}, {withBinder: false}]) {
        const result = await runCaseData(identifiedBlendCase(options));
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    for (const options of [{observer: 'witness'}, {extraIngredient: true}]) {
        const result = await runCaseData(identifiedBlendCase(options));
        assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
        assert.match(result.detail, /^brew:/);
    }
});

test('restored identification uses measured proportions to distinguish recipes with the same ingredients', async () => {
    const strong = sharedBrewCase('identified_blend_strength');
    const weak = identifiedBlendCase({withBinder: false, sampleAmounts: {a: 3, b: 2}});
    for (const data of [strong, weak, identifiedBlendCase({sampleAmounts: {a: 20, b: 29}})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const between = identifiedBlendCase({sampleAmounts: {a: 6, b: 5}});
    const above = identifiedBlendCase({sampleAmounts: {a: 2, b: 4}});
    const ambiguous = structuredClone(strong);
    ambiguous.timeline.find(step => step.id === 'brew').working.request.recipes[0].shares.b.max = 500;
    for (const data of [between, above, ambiguous]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
        assert.match(result.detail, /^brew:/);
    }
});

test('a restored bench assay selects a recipe only when its complete measured range fits', async () => {
    const data = sharedBrewCase('assayed_blend_strength');
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
    const changed = assayedBlendStrengthCase();
    const brew = changed.timeline.findIndex(step => step.id === 'brew');
    changed.timeline.splice(brew, 0, {id: 'draw-after-panel', ops: [
        {op: 'add', holder: 'poison-sample', quantity: brewDoseQuantity('b'), amount: -1},
    ]}, {id: 'restore-after-panel-draw', restore: true});
    for (const control of [assayedBlendStrengthCase({resolution: 8}), assayedBlendStrengthCase({parts: ['b']}), changed]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
    const short = await runCaseData(assayedBlendStrengthCase({strips: 1}));
    assert.equal(short.state, 'blocked:runner-working-interrupted', short.detail);
    assert.match(short.detail, /assay-strip-unavailable/);
});

test('restored partial panels combine only while both readings belong to the current sample and observer', async () => {
    const data = assayedBlendStrengthCase({sessions: [['a'], ['b']]});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
    const refined = await runCaseData(assayedBlendStrengthCase({strips: 3, resolution: 8,
        sessions: [['a', 'b'], {parts: ['b'], resolution: 4}]}));
    assert.equal(refined.state, 'expressed-authored', refined.detail);
    const altered = structuredClone(data);
    const nextPanel = altered.timeline.findIndex(step => step.id === 'blend-panel-2');
    altered.timeline.splice(nextPanel, 0, {id: 'alter-between-panels', ops: [
        {op: 'add', holder: 'poison-sample', quantity: brewDoseQuantity('a'), amount: -1},
    ]}, {id: 'restore-altered-panel-sample', restore: true});
    const forgotten = structuredClone(data);
    const brew = forgotten.timeline.findIndex(step => step.id === 'brew');
    forgotten.timeline.splice(brew, 0, {id: 'forget-first-panel', ops: [
        {op: 'property', holder: 'healer', property: 'mind_memory', value: [`blend-panel-2:${brewDoseQuantity('b')}`]},
    ]}, {id: 'restore-forgotten-panel', restore: true});
    for (const control of [altered, forgotten]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
});

test('a quantitative-only assay can prove completeness by mass through restore', async () => {
    const setup = {quantitativeOnly: true};
    const complete = assayedBlendStrengthCase({...setup, sampleAmounts: {a: 20, b: 20}});
    const result = await runCaseData(complete);
    assert.equal(result.state, 'expressed-authored', result.detail);
    const unknownTrace = assayedBlendStrengthCase({...setup, sampleAmounts: {a: 20, b: 20, c: 1}});
    for (const control of [assayedBlendStrengthCase(setup), unknownTrace]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
    const exactFollowup = assayedBlendStrengthCase({...setup, strips: 4,
        sessions: [['a', 'b'], {parts: ['a', 'b'], resolution: 1}]});
    const refined = await runCaseData(exactFollowup);
    assert.equal(refined.state, 'expressed-authored', refined.detail);
});

test('the generic runner restores a generated working and requires the actual dose effect', async () => {
    const data = sharedBrewCase('generated_brightening');
    assert.equal((await runCaseData(data)).state, 'expressed-authored');

    const unassayed = structuredClone(data);
    unassayed.timeline = unassayed.timeline.filter(step => !['assay-salt', 'restore-pending-salt-assay', 'read-salt'].includes(step.id));
    const noPlan = await runCaseData(unassayed);
    assert.equal(noPlan.state, 'blocked:runner-working-inputs');
    assert.match(noPlan.detail, /^brew:/);

    const broken = structuredClone(data);
    broken.timeline.find(step => step.id === 'serve').working.method.steps[0].options.responses = [];
    const outcome = await runCaseData(broken);
    assert.equal(outcome.state, 'blocked:runner-expect-mismatch');
    assert.match(outcome.detail, /^settle-serving:/);
});

test('assay-driven invention selects a material-saving route and restores its intermediate', async () => {
    const staged = sharedBrewCase('generated_staged_brightening');
    const direct = generatedBrightening({staged: true, directOnly: true});
    for (const data of [staged, direct]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const reversed = structuredClone(staged);
    reversed.timeline.find(step => step.id === 'brew').working.request.reactions.reverse();
    const result = await runCaseData(reversed);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const noIntermediate = structuredClone(staged);
    const {request} = noIntermediate.timeline.find(step => step.id === 'brew').working;
    request.reactions = request.reactions.filter(row => row.id === 'finish');
    const missing = await runCaseData(noIntermediate);
    assert.equal(missing.state, 'blocked:runner-working-inputs');
});

test('invention can pool two observed lots and restore between capped reaction stages', async () => {
    const data = generatedBrightening({split: true});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const capped = structuredClone(data);
    capped.timeline.find(step => step.id === 'brew').working.request.maxStages = 1;
    assert.equal((await runCaseData(capped)).state, 'blocked:runner-working-inputs');

    const unassayed = structuredClone(data);
    unassayed.timeline = unassayed.timeline.filter(step => !['assay-reed', 'restore-pending-reed-assay', 'read-reed'].includes(step.id));
    assert.equal((await runCaseData(unassayed)).state, 'blocked:runner-working-inputs');
});

test('invention can combine two partially supplied reactions into one restored serving', async () => {
    const data = generatedBrightening({split: true, blendRoutes: true});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    for (const reactionIndex of [0, 1]) {
        const alone = structuredClone(data);
        const {request} = alone.timeline.find(step => step.id === 'brew').working;
        request.reactions.splice(reactionIndex, 1);
        const refused = await runCaseData(alone);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
    }
});

test('invention binds a measured catalyst across restore and rechecks it at each stage', async () => {
    for (const data of [sharedBrewCase('generated_catalyst'), generatedCatalystCase({remove: true}),
        generatedCatalystCase({sharedStock: 15})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }

    const tooLittle = generatedCatalystCase();
    const {request} = tooLittle.timeline.find(step => step.id === 'brew').working;
    request.reactions[1].catalystMinimum = 3;
    const result = await runCaseData(tooLittle);
    assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
    assert.match(result.detail, /^brew:/);

    const spentByAdmission = await runCaseData(generatedCatalystCase({sharedStock: 10}));
    assert.equal(spentByAdmission.state, 'blocked:runner-working-inputs', spentByAdmission.detail);
    assert.match(spentByAdmission.detail, /^brew:/);

    const changed = generatedCatalystCase();
    changed.engine.shared.properties.push({id: 'brew-lot-revision', type: 'label'});
    const bottled = changed.timeline.findIndex(step => step.id === 'bottled');
    changed.timeline.splice(bottled, 0, {id: 'replace-catalyst-composition', ops: [
        {op: 'property', holder: 'mesh', property: 'brew-lot-revision', value: 'replacement'},
    ]}, {id: 'restore-replaced-catalyst', restore: true});
    changed.timeline[bottled + 2].interruption = {working: 'case.brew', reason: 'ingredient-composition-changed'};
    for (const expectation of changed.expect.filter(row => row.holder === 'flask')) {
        expectation.direction = 'unchanged';
        expectation.to = 0;
    }
    const refused = await runCaseData(changed);
    assert.equal(refused.state, 'expressed-authored', refused.detail);
});

test('invention checks paid reaction temperatures and the cooled finish through restore', async () => {
    const data = generatedHeatCase();
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    Object.assign(request.reactions[0], {minTemperature: 74, maxTemperature: 76});
    Object.assign(request.reactions[1], {minTemperature: 20, maxTemperature: 21});
    const settled = await runCaseData(data);
    assert.equal(settled.state, 'expressed-authored', settled.detail);

    for (const [index, bounds] of [[0, {minTemperature: 76, maxTemperature: 79}], [1, {minTemperature: 22, maxTemperature: 30}]]) {
        const control = structuredClone(data);
        Object.assign(control.timeline.find(step => step.id === 'brew').working.request.reactions[index], bounds);
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
});

test('paid reaction residence distinguishes identical final temperatures across restore', async () => {
    const data = generatedHeatCase();
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    const prime = request.reactions[0];
    Object.assign(prime, {minTemperature: 74, maxTemperature: 76, minTemperatureSeconds: 175});
    const enough = await runCaseData(data);
    assert.equal(enough.state, 'expressed-authored', enough.detail);

    // Slower heat transfer still reaches the same rounded endpoint at 180s.
    data.engine.host.things['vessel:cauldron'].thermal.heatTransfer = 0.25;
    const short = await runCaseData(data);
    assert.equal(short.state, 'blocked:runner-working-inputs', short.detail);
    delete prime.minTemperatureSeconds;
    const endpointOnly = await runCaseData(data);
    assert.equal(endpointOnly.state, 'expressed-authored', endpointOnly.detail);
});

test('a restored finish counts both paid heat windows when it requires batch exposure', async () => {
    const data = generatedHeatCase({fuelStock: 75, finishHot: true});
    const finish = data.timeline.find(step => step.id === 'brew').working.request.reactions[1];
    Object.assign(finish, {minTemperature: 74, maxTemperature: 76, minTemperatureSeconds: 290, temperatureResidence: 'batch'});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    delete finish.temperatureResidence;
    const stageOnly = await runCaseData(data);
    assert.equal(stageOnly.state, 'blocked:runner-working-inputs', stageOnly.detail);
    assert.match(stageOnly.detail, /^brew:/);

    finish.temperatureResidence = 'reactants';
    const newIntermediate = await runCaseData(data);
    assert.equal(newIntermediate.state, 'blocked:runner-working-inputs', newIntermediate.detail);
    finish.minTemperatureSeconds = 120;
    const enoughAfterFormation = await runCaseData(data);
    assert.equal(enoughAfterFormation.state, 'expressed-authored', enoughAfterFormation.detail);

    finish.temperatureResidence = 'batch';
    finish.minTemperatureSeconds = 300;
    const insufficient = await runCaseData(data);
    assert.equal(insufficient.state, 'blocked:runner-working-inputs', insufficient.detail);
});

test('generated routes admit a measured lot after the paid prime and restore before its debit', async () => {
    const data = generatedHeatCase();
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    request.reactions[0].reactants = {brightSap: 3};
    request.reactions[0].products = {primed: 3};
    request.reactions[1].reactants = {primed: 2, stabilizer: 1};
    request.admitAfter = {salt: 'prime'};
    data.expect.find(row => row.holder === 'moss').to = 6;
    data.expect.find(row => row.holder === 'salt').to = 8;
    const saltStock = (direction, to) => ({holder: 'salt', quantity: 'stock:brew-measure', direction, to});
    data.timeline.find(step => step.id === 'mid-brew').advanceTo = 6;
    data.timeline.find(step => step.id === 'mid-brew').expect.push(saltStock('unchanged', 16));
    const bottled = data.timeline.findIndex(step => step.id === 'bottled');
    data.timeline.splice(bottled, 0, {id: 'late-lot-admitted', advanceTo: 7, expect: [saltStock('down', 8)]},
        {id: 'restore-late-admission', restore: true});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const unavailable = structuredClone(data);
    unavailable.world.holders.push({id: 'shelf', kind: 'place'});
    unavailable.timeline.splice(bottled, 0, {id: 'remove-late-lot', ops: [{op: 'move', holder: 'salt', to: 'shelf'}]},
        {id: 'restore-moved-lot', restore: true});
    unavailable.timeline[bottled + 2].interruption = {working: 'case.brew', reason: 'ingredient-out-of-reach'};
    unavailable.timeline[bottled + 2].expect = [saltStock('unchanged', 16)];
    unavailable.timeline.splice(bottled + 4);
    unavailable.expect = unavailable.expect.filter(row => row.holder !== 'recipient' && row.holder !== 'salt');
    unavailable.expect.push(saltStock('unchanged', 16));
    const interrupted = await runCaseData(unavailable);
    assert.equal(interrupted.state, 'expressed-authored', interrupted.detail);
});

test('a generated delayed flask draw uses its admission age and rechecks reach after restore', async () => {
    for (const data of [sharedBrewCase('generated_late_flask'), generatedLateFlaskCase({move: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const shorterLife = generatedLateFlaskCase({life: 10});
    const refused = await runCaseData(shorterLife);
    assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
    assert.match(refused.detail, /^brew:/);

    const {request} = shorterLife.timeline.find(step => step.id === 'brew').working;
    delete request.admitAfter;
    request.searchAdmissionFor = ['saved-binder'];
    const sourceStock = shorterLife.expect.find(row => row.holder === 'saved-binder');
    sourceStock.to = 2;
    shorterLife.timeline.find(step => step.id === 'mid-brew').expect.pop();
    shorterLife.timeline.splice(shorterLife.timeline.findIndex(step => step.id === 'admit-binder'), 2);
    shorterLife.expect.find(row => row.quantity === brewDoseQuantity('stabilizer:spent')).to = 1;
    const early = await runCaseData(shorterLife);
    assert.equal(early.state, 'expressed-authored', early.detail);
});

test('invention forecasts a storage byproduct from a saved parent assay and uses only a partial draw', async () => {
    const data = sharedBrewCase('generated_aged_byproduct');
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const {request} = data.timeline.find(step => step.id === 'brew').working;
    delete request.searchAdmissionFor;
    const early = await runCaseData(data);
    assert.equal(early.state, 'blocked:runner-working-inputs', early.detail);
    assert.match(early.detail, /^brew:/);

    const slower = await runCaseData(generatedLateFlaskCase({life: 16, useSpent: true}));
    assert.equal(slower.state, 'blocked:runner-working-inputs', slower.detail);
    assert.match(slower.detail, /^brew:/);
});

test('admission search preserves a held catalyst through the prime and debits it after restore', async () => {
    const data = sharedBrewCase('generated_admission');
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    const {request} = data.timeline.find(step => step.id === 'brew').working;
    delete request.searchAdmissionFor;
    const early = await runCaseData(data);
    assert.equal(early.state, 'blocked:runner-working-inputs', early.detail);
    assert.match(early.detail, /^brew:/);

    const undersupplied = await runCaseData(generatedAdmissionCase({binderStock: 7}));
    assert.equal(undersupplied.state, 'blocked:runner-working-inputs', undersupplied.detail);
    assert.match(undersupplied.detail, /^brew:/);
});

test('generated portion reactions use aged stock even when an earlier stage makes fresh stock of the same part', async () => {
    const data = generatedHeatCase({fuelStock: 75, finishHot: true});
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    request.reactions = [
        {id: 'prime', minutes: 3, activeHeat: true, reactants: {stabilizer: 4},
            products: {brightSap: 1, cofactor: 3}},
        {id: 'bind', minutes: 2, activeHeat: true, reactants: {brightSap: 6}, products: {boundSap: 6},
            minTemperature: 74, maxTemperature: 76, minTemperatureSeconds: 290, temperatureResidence: 'portions'},
        {id: 'finish', minutes: 1, reactants: {boundSap: 6, cofactor: 3}, products: {bright: 9}},
    ];
    const bottled = data.timeline.findIndex(step => step.id === 'bottled');
    for (const step of data.timeline.slice(bottled)) if (step.advanceTo !== undefined) step.advanceTo++;
    data.expect.find(row => row.holder === 'moss').to = 6;
    data.expect.find(row => row.holder === 'salt').to = 6;
    data.expect.push({holder: 'recipient', quantity: brewDoseQuantity('brightSap'), direction: 'up', to: 2});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
    data.world.holders.find(holder => holder.id === 'moss').quantities['stock:brew-measure'] = 9;
    const tooLittleAged = await runCaseData(data);
    assert.equal(tooLittleAged.state, 'blocked:runner-working-inputs', tooLittleAged.detail);
    assert.match(tooLittleAged.detail, /^brew:/);
});

test('a late addition cannot borrow earlier exposure and only qualified portions react after restore', async () => {
    for (const [early, scope, active] of [[8, 'reactants', 9], [0, 'reactants', 0],
        [4, 'reactants', 0], [4, 'portions', 6]]) {
        const data = generatedHeatCase();
        const heating = data.timeline.find(step => step.id === 'brew').working.request.heating;
        const vessel = 'vessel';
        const admit = (lot, amount) => ({op: 'admit', bindings: {vessel, lot}, options: {amount}});
        const timed = (op, minutes, options) => ({op, minutes, options, bindings: {vessel}});
        data.timeline = [{id: 'brew', working: {family: 'brew', bindings: {
            vessel: {kind: vessel, id: 'cauldron'}, flask: {kind: 'flask', id: 'flask'},
            moss: {kind: 'lot', id: 'moss'}, salt: {kind: 'lot', id: 'salt'},
        }, method: {id: 'trial.late-reagent', revision: 1, law: BREW_LAW.ref,
            roles: {vessel, flask: 'flask', moss: 'lot', salt: 'lot'}, steps: [
                admit('moss', 12), ...(early ? [admit('salt', early)] : []), timed('heat', 3, heating),
                ...(early < 8 ? [admit('salt', 8 - early)] : []),
                timed('react', 0, {reactions: [{id: 'bind', reactants: {brightSap: 2, stabilizer: 1},
                    products: {bright: 3}, limit: 3, minTemperature: 74, maxTemperature: 76,
                    minTemperatureSeconds: 175, temperatureResidence: scope}]}),
                timed('divide', 0, {doses: 1}), {op: 'pour', minutes: 1, options: {index: 0}, bindings: {vessel, flask: 'flask'}},
            ]}}},
            {id: 'heat-pending', advanceTo: 2}, {id: 'restore-heat', restore: true},
            {id: 'reacted', advanceTo: 3}, {id: 'restore-reacted', restore: true}, {id: 'poured', advanceTo: 4}];
        data.expect = [
            {holder: 'flask', quantity: brewDoseQuantity('bright'), direction: active ? 'up' : 'unchanged', to: active},
            {holder: 'flask', quantity: brewDoseQuantity('stabilizer'), direction: 'up', to: 4 - active / 3},
            {holder: 'cauldron', quantity: 'stock:burner-fuel', direction: 'down', to: 0},
        ];
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('invention plans paid flame windows and settles them with live fuel after restore', async () => {
    for (const data of [sharedBrewCase('generated_heat'), generatedHeatCase({withdraw: true}),
        generatedHeatCase({fuelStock: 75, finishHot: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    for (const options of [{fuelStock: 44}, {fuelStock: 74, finishHot: true}]) {
        const result = await runCaseData(generatedHeatCase(options));
        assert.equal(result.state, 'blocked:runner-working-inputs', result.detail);
        assert.match(result.detail, /^brew:/);
    }
});

test('invention targets bottled yield after film retention and needs an empty receiver', async () => {
    const result = await runCaseData(sharedBrewCase('generated_lined_vessel'));
    assert.equal(result.state, 'expressed-authored', result.detail);

    for (const options of [{mossStock: 16}, {occupied: true}]) {
        const refused = await runCaseData(generatedLinedVesselCase(options));
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
});

test('invention uses assay floors and discounts ingredient losses before admission', async () => {
    for (const data of [sharedBrewCase('generated_aged_ingredient'), generatedAgedIngredientCase({perishable: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    for (const options of [{mossStock: 14}, {mossStock: 21, perishable: true}]) {
        const refused = await runCaseData(generatedAgedIngredientCase(options));
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
});

test('a generated brew can recover the spent fraction of an aged lot after restore', async () => {
    const data = sharedBrewCase('generated_spent_lot');
    const settled = await runCaseData(data);
    assert.equal(settled.state, 'expressed-authored', settled.detail);

    delete data.timeline.find(step => step.id === 'brew').working.request.recoverSpentFrom;
    for (const control of [data, generatedSpentLotCase({spent: 960})]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
});

test('a restored generated route can wait for a raw lot to form enough spent binder', async () => {
    const data = sharedBrewCase('generated_lot_storage_clock');
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);

    delete data.timeline.find(step => step.id === 'brew').working.request.searchAdmissionFor;
    const cooler = generatedSpentLotCase({spent: 1433, storageSince: 0, storageRate: 0.5});
    for (const control of [data, cooler]) {
        const refused = await runCaseData(control);
        assert.equal(refused.state, 'blocked:runner-working-inputs', refused.detail);
        assert.match(refused.detail, /^brew:/);
    }
});

test('restored raw-lot storage changes preserve accrued age and can invalidate a pending draw', async () => {
    for (const data of [sharedBrewCase('generated_lot_storage_change'), generatedLotStorageChangeCase({duringPrime: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const unreachable = sharedBrewCase('generated_lot_storage_change');
    unreachable.world.holders.unshift({id: 'cellar', kind: 'place'});
    unreachable.world.holders.find(holder => holder.id === 'cold-box').place = 'cellar';
    const refused = await runCaseData(unreachable);
    assert.equal(refused.state, 'blocked:runner-working-interrupted', refused.detail);
    assert.match(refused.detail, /brew-storage-out-of-reach/);
});

test('one restored liquid transfer settles both body responses and refuses occupied staging accounts', async () => {
    for (const data of [sharedBrewCase('compound_uptake'), compoundUptakeCase({half: true}), compoundUptakeCase({occupied: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('a measured compound dose preserves independent response expiry and ordered dose tiers through restore', async () => {
    for (const data of [sharedBrewCase('compound_mood_dose'), compoundMoodDoseCase({half: true})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('the generic runner restores a bottle at different storage ages before the same measured serving', async () => {
    for (const data of [storedInfusionCase({wait: 0}), storedInfusionCase({rate: 0.25}), sharedBrewCase('stored_infusion')]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
});

test('changing storage after restore preserves the age already accrued and reads live reach', async () => {
    const warmed = await runCaseData(storedInfusionCase({rate: 0.25, warmAt: 5}));
    assert.equal(warmed.state, 'expressed-authored', warmed.detail);
    const unavailable = storedInfusionCase({rate: 0.25, warmAt: 5});
    unavailable.world.holders.push({id: 'hall', kind: 'place'});
    const change = unavailable.timeline.findIndex(step => step.id === 'changed-storage');
    unavailable.timeline.splice(change, 0, {id: 'remove-shelf', ops: [{op: 'move', holder: 'warm-shelf', to: 'hall'}]});
    const refused = await runCaseData(unavailable);
    assert.equal(refused.state, 'blocked:runner-working-interrupted');
    assert.match(refused.detail, /brew-storage-out-of-reach/);
});

test('decanting after restore preserves accumulated bottle age and refuses an occupied receiver', async () => {
    const data = storedInfusionCase({rate: 0.25, warmAt: 5, decant: true});
    const result = await runCaseData(data);
    assert.equal(result.state, 'expressed-authored', result.detail);
    const partial = await runCaseData(storedInfusionCase({rate: 0.25, warmAt: 5, decant: true, decantAmount: 6}));
    assert.equal(partial.state, 'expressed-authored', partial.detail);
    const occupied = structuredClone(data);
    occupied.world.holders.find(holder => holder.id === 'receiver').quantities = {[brewDoseQuantity('other')]: 1};
    const refused = await runCaseData(occupied);
    assert.equal(refused.state, 'blocked:runner-working-interrupted');
    assert.match(refused.detail, /empty-flask-unavailable/);
});

test('a restored blend settles each source age and only retains a shared provenance claim', async () => {
    for (const data of [sharedBrewCase('blended_storage'), blendedStorageCase({warmRate: 0}), blendedStorageCase({warmRate: 2}),
        blendedStorageCase({secondOrigin: 'garden'})]) {
        const result = await runCaseData(data);
        assert.equal(result.state, 'expressed-authored', result.detail);
    }
    const moved = blendedStorageCase();
    moved.world.holders.push({id: 'hall', kind: 'place'});
    const settle = moved.timeline.findIndex(step => step.id === 'blend-bottled');
    moved.timeline.splice(settle, 0, {id: 'move-warm-flask', ops: [{op: 'move', holder: 'warm-flask', to: 'hall'}]});
    const result = await runCaseData(moved);
    assert.equal(result.state, 'blocked:runner-working-interrupted');
    assert.match(result.detail, /flask-out-of-reach/);
});

test('equal volumes of different brews and unequal volumes of the same brew change responsiveness and recovery', async () => {
    for (const [input, dose, remaining, activeLeft, expected, minutes] of [
        [{}, 100, 8, 1, 2, 14],
        [{preparation: 'slice'}, 100, 3, 1, 30, 10],
        [{amount: 50}, 50, 58, 5, 58, 6],
    ]) {
        const data = coverageCase(DRAUGHT_CASE_ID, input);
        assert.equal((await runCaseData(data)).state, 'expressed-authored');
        const engine = createEngineWorld({...data.world, ...data.engine});
        assert.equal(response(engine.world), 100);
        const [step] = data.timeline;
        const run = landEffect(engine.rules, engine.world, step, {keys: step.keys, cause: 'measured-dose'});
        assert.equal(run.outcomes[0].applied[0].amount, dose);
        assert.equal(readQuantity(run.world, 'flask', 'energy:oral-liquid'), remaining);
        assert.equal(readQuantity(run.world, 'flask', 'energy:settled-soporific'), activeLeft);
        assert.equal(readQuantity(run.world, 'recipient', 'energy:oral-liquid'), 0);
        assert.equal(response(run.world), expected);

        const dosed = {...engine, world: run.world};
        const beforeRecovery = advanceEngineWorld(dosed, minutes - 1).engine;
        assert.equal(response(beforeRecovery.world), 93);
        const recovered = advanceEngineWorld(dosed, minutes).engine;
        assert.equal(response(recovered.world), 100);
        assert.deepEqual(advanceEngineWorld(beforeRecovery, minutes).engine.world, recovered.world);
        assert.equal(response(advanceEngineWorld(engine, minutes).engine.world), 100);
    }
});
