import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {aperturePool} from '../src/gu_aperture.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {ASCENSION_PACK, EARTH_QI, GREEN_GRAPE, GU_APERTURE_FORMATION_LAW, GU_ASCENSION_DISRUPTION_LAW, GU_LANDSCAPE_LAW, HEAVEN_QI,
    guApertureFormationWorking, guApertureReformationWorking, guAscensionDisruptionWorking, guPooledApertureWorking,
    guRerouteApertureWorking, guSplitApertureWorking,
    guAscensionPack, guLandscapeWorking} from '../src/world_packs/gu_ascension_working.js';
import {GU_VITAL_ADVANCEMENT_LAW, guVitalAdvancementPack, vitalAdvancementWorking,
    vitalRestorationWorking} from '../src/world_packs/gu_vital_advancement.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {GU_MOONBLADE_CONTACT_LAW, moonbladeContactWorking} from '../src/world_packs/gu_moonblade_contact.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {apertureHolder, createGuAperturePack, GU_APERTURE, MORTAL_APERTURE_RELEASE_REFUSED} from '../src/world_substrate_packs/gu_aperture.js';
import {readLineage} from '../src/world_substrate.js';

const stormForce = 'energy:calamity-force';
const threatRoles = {threat: 'creature', terrain: 'place', victim: 'operator'};
const threat = defineWorkingLaw({id: 'fixture.calamity', revision: 1, operations: {
    strike: {roles: threatRoles, minutes: 2, settle({bound: {threat, terrain, victim}}) {
        if (threat.properties.alive !== true || threat.place !== terrain.id || victim.place !== terrain.id ||
            threat.quantities[stormForce] < 1) return {ok: false, reason: 'The calamity cannot reach its victim.'};
        const harm = terrain.quantities.cover >= 40 ? 2 : 6;
        return {ok: true, costs: [{quantity: stormForce, payer: threat.id, amount: 1}],
            effects: [{op: 'add', holder: victim.id, quantity: 'vitality', amount: -harm}]};
    }},
}});
const threatMethod = {id: 'fixture.calamity.strike', revision: 1, law: threat.ref, roles: threatRoles,
    steps: [{op: 'strike', bindings: {threat: 'threat', terrain: 'terrain', victim: 'victim'}}]};
const config = {ownPacks: [guAscensionPack, guVitalAdvancementPack, createGuAperturePack()],
    packs: [ASCENSION_PACK, 'l.living_body', guVitalAdvancementPack.id, GU_APERTURE],
    host: {laws: [GU_APERTURE_FORMATION_LAW, GU_ASCENSION_DISRUPTION_LAW, GU_LANDSCAPE_LAW, GU_VITAL_ADVANCEMENT_LAW,
        GU_MOONBLADE_CONTACT_LAW, threat]},
    shared: {properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES, {id: 'gu_rank', type: 'level', min: 1},
        {id: 'injured', type: 'flag'}],
        quantities: sharedQuantities(['energy', 'cover', 'vitality'])}};

function site(id, owner, [heaven, earth]) {
    const gu = (suffix, kind) => ({...guBodyHolder({id: kind, needs: 'gu'}, {id: `${id}.${suffix}`, place: id, satiety: 30}),
        properties: {alive: true, gu_kind: kind, gu_rank: 5, gu_keeper: owner, gu_controller: owner}});
    return [
        {id, kind: 'place', detail: 'far', properties: {gu_resonant: true, gu_pre_calamity_cover: 60},
            quantities: {[HEAVEN_QI]: heaven, [EARTH_QI]: earth, cover: 20}, state: {[ASCENSION_PACK]: {
                phase: 'gathering', owner, river: `${id}.river`, mountain: `${id}.mountain`, product: `${id}.landscape`,
            }}},
        {id: owner, kind: 'body', as: ['operator'], place: id, properties: {alive: true}, quantities: {[GREEN_GRAPE]: 2, vitality: 20}},
        gu('river', 'river-as-before'), gu('mountain', 'mountain-as-before'),
    ];
}

function setup({qi = [3, 2], rival = false, mortalStage} = {}) {
    const holders = site('aperture', 'master', qi);
    if (mortalStage) {
        const master = holders[1];
        holders[1] = {...apertureHolder({id: master.id, place: master.place, aptitude: 80, rank: 5, stage: mortalStage,
            quantities: master.quantities}), as: master.as, properties: master.properties};
    }
    return createEngineWorld({...config, holders: [...holders,
        {id: 'outside', kind: 'place'},
        {id: 'calamity', kind: 'body', as: ['creature'], place: 'aperture', properties: {alive: true}, quantities: {[stormForce]: 3}},
        ...(rival ? site('rival-aperture', 'rival', [2, 2]) : []),
    ]});
}
const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
const phase = (engine, id = 'aperture') => engine.world.holders[id].state[ASCENSION_PACK].phase;
const quantity = (engine, id, key) => engine.world.holders[id].quantities[key];
function advance(engine, to) {
    const result = advanceEngineWorld(engine, to);
    assert.equal(result.pending, false);
    return result.engine;
}
function start(engine, id, law, method, ids) {
    const bindings = Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, {kind, id: ids[role]}]));
    return startEngineWorking(engine, {id, law, method, bindings});
}
const repair = (engine, id = 'repair') => start(engine, id, GU_LANDSCAPE_LAW, guLandscapeWorking,
    {operator: 'master', specimen: 'aperture.landscape', terrain: 'aperture'});

function formationSite(mortalStage, exposedFormation = false, {startNow = true} = {}) {
    const unformed = setup({qi: [0, 0], mortalStage});
    const initial = applyEngineOps(unformed, [
        {op: 'state', pack: ASCENSION_PACK, holder: 'aperture', value: {...unformed.world.holders.aperture.state[ASCENSION_PACK],
            phase: 'forming', source: 'outside', mortalTransition: !!mortalStage, exposedFormation}},
        {op: 'property', holder: 'aperture', property: 'gu_quench_steady', value: true},
        {op: 'set', holder: 'master', quantity: GREEN_GRAPE, amount: 0},
        ...[HEAVEN_QI, EARTH_QI].flatMap(quantity => [{op: 'carry', holder: 'outside', quantity},
            {op: 'set', holder: 'outside', quantity, amount: 5}]),
        {op: 'holder_add', value: {...guBodyHolder({id: 'man-as-before', needs: 'gu'}, {id: 'vital', place: 'aperture', satiety: 30}),
            properties: {alive: true, gu_kind: 'man-as-before', gu_rank: 5, gu_keeper: 'master', gu_controller: 'master', gu_vital_master: 'master'}}},
        {op: 'holder_add', value: {id: 'patient', kind: 'body', as: ['creature'], place: 'aperture',
            quantities: {vitality: 7}, properties: {alive: true, gu_prior_vitality: 10}}},
    ], 'fixture:formation-site');
    return startNow ? start(initial, 'form', GU_APERTURE_FORMATION_LAW, guApertureFormationWorking,
        {operator: 'master', aperture: 'aperture', source: 'outside'}) : initial;
}

test('formation spends a peak mortal aperture and supplies both cocoon paths and their first casts during tribulation', () => {
    const pending = formationSite('peak');
    const dry = applyEngineOps(advance(pending, 1), [{op: 'set', holder: 'outside', quantity: EARTH_QI, amount: 4}], 'fixture:qi-short');
    const failed = advance(restore(dry), 5);
    assert.equal(failed.records.workings.form.record.status, 'interrupted');
    assert.equal(phase(failed), 'forming');
    assert.equal(quantity(failed, 'outside', HEAVEN_QI), 5);
    assert.equal(quantity(failed, 'master', GREEN_GRAPE), 0);
    assert.equal(failed.world.holders.master.state[GU_APERTURE].rank, 5);

    const immature = advance(restore(formationSite('upper')), 2);
    assert.equal(phase(immature), 'forming');
    assert.equal(quantity(immature, 'outside', EARTH_QI), 5);
    assert.equal(immature.world.holders.master.state[GU_APERTURE].stage, 2);
    assert.ok(immature.world.chain.some(row => row.kind === MORTAL_APERTURE_RELEASE_REFUSED));

    const reserved = applyEngineOps(pending, [{op: 'publish', kind: 'aperture.hold', place: 'aperture', by: 'master',
        detail: {target: 'master', id: 'other-working', motes: 3}}], 'fixture:reserved-essence');
    const held = advance(restore(reserved), 2);
    assert.equal(phase(held), 'forming');
    assert.equal(quantity(held, 'outside', HEAVEN_QI), 5);
    assert.equal(quantity(held, 'master', 'aperture_held:other-working'), 3);

    const formed = advance(restore(advance(pending, 1)), 2);
    assert.deepEqual(serializeEngineWorld(formed), serializeEngineWorld(advance(pending, 2)));
    assert.equal(formed.world.holders.aperture.state[ASCENSION_PACK].formedAt, 2);
    assert.deepEqual(formed.world.holders.aperture.state[ASCENSION_PACK].mortalOrigin, {rank: 5, aptitude: 80});
    assert.equal(formed.world.holders.master.state[GU_APERTURE], undefined);
    assert.equal(quantity(formed, 'master', aperturePool(5, 'peak')), 0);
    assert.equal(quantity(formed, 'outside', HEAVEN_QI), 0);
    assert.equal(quantity(formed, 'outside', EARTH_QI), 0);
    assert.equal(quantity(formed, 'master', GREEN_GRAPE), 2);
    assert.deepEqual([HEAVEN_QI, EARTH_QI].map(key => quantity(formed, 'aperture', key)), [3, 3]);
    const directed = start(formed, 'directed', GU_VITAL_ADVANCEMENT_LAW, vitalAdvancementWorking,
        {operator: 'master', specimen: 'vital', site: 'aperture'});
    const struck = start(directed, 'first-strike', threat, threatMethod, {threat: 'calamity', terrain: 'aperture', victim: 'master'});
    const cocooned = advance(struck, 3);
    assert.equal(phase(cocooned), 'cocooned');
    assert.equal(quantity(cocooned, 'aperture', HEAVEN_QI), 0);
    const advanced = advance(restore(cocooned), 5);
    assert.deepEqual(serializeEngineWorld(advanced), serializeEngineWorld(advance(struck, 5)));
    assert.equal(quantity(advanced, 'master', 'vitality'), 14);
    assert.equal(phase(advanced), 'fused');
    assert.equal(advanced.world.holders.vital.properties.gu_rank, 6);
    assert.equal(quantity(advanced, 'aperture', EARTH_QI), 0);
    const later = start(repair(advanced), 'heal', GU_VITAL_ADVANCEMENT_LAW, vitalRestorationWorking,
        {operator: 'master', specimen: 'vital', patient: 'patient'});
    const nextStrike = start(later, 'second-strike', threat, threatMethod, {threat: 'calamity', terrain: 'aperture', victim: 'master'});
    const settled = advance(restore(nextStrike), 7);
    assert.equal(quantity(settled, 'patient', 'vitality'), 10);
    assert.equal(quantity(settled, 'master', GREEN_GRAPE), 0);
    assert.equal(quantity(settled, 'master', 'vitality'), 12);
    assert.equal(quantity(settled, 'master', aperturePool(5, 'peak')), 0);
});

test('a funded outside attack can break exposed formation while an independent calamity strikes inside', () => {
    const pending = applyEngineOps(formationSite('peak', true), [
        {op: 'holder_add', value: {id: 'outside-attacker', kind: 'body', as: ['creature'], place: 'outside',
            properties: {alive: true}, quantities: {[GREEN_GRAPE]: 1}}},
    ], 'fixture:outside-attacker');
    const exposed = advance(pending, 2);
    assert.equal(phase(exposed), 'exposed');
    assert.equal(exposed.world.holders.master.state[GU_APERTURE], undefined);
    assert.equal(quantity(exposed, 'outside', EARTH_QI), 5);
    const internal = start(exposed, 'internal', threat, threatMethod, {threat: 'calamity', terrain: 'aperture', victim: 'master'});
    const attacked = start(internal, 'external', GU_ASCENSION_DISRUPTION_LAW, guAscensionDisruptionWorking,
        {attacker: 'outside-attacker', source: 'outside'});
    const scattered = advance(attacked, 3);
    assert.equal(phase(scattered), 'exposed');
    assert.equal(quantity(scattered, 'outside', EARTH_QI), 4);
    assert.equal(quantity(scattered, 'outside-attacker', GREEN_GRAPE), 0);
    assert.equal(quantity(scattered, 'calamity', stormForce), 3);
    const failed = advance(restore(scattered), 6);
    assert.deepEqual(serializeEngineWorld(failed), serializeEngineWorld(advance(attacked, 6)));
    assert.equal(phase(failed), 'failed');
    assert.equal(failed.world.holders.aperture.state[ASCENSION_PACK].reason, 'formation-disrupted-after-release');
    assert.equal(failed.world.holders.master.state[GU_APERTURE], undefined);
    assert.equal(quantity(failed, 'master', GREEN_GRAPE), 0);
    assert.equal(quantity(failed, 'outside', HEAVEN_QI), 5);
    assert.equal(quantity(failed, 'aperture', EARTH_QI), 0);
    assert.equal(quantity(failed, 'master', 'vitality'), 14);
    assert.equal(quantity(failed, 'calamity', stormForce), 2);

    const reform = (engine, id) => start(engine, id, GU_APERTURE_FORMATION_LAW, guApertureReformationWorking,
        {operator: 'master', aperture: 'aperture', source: 'outside'});
    const short = advance(reform(failed, 'short-reform'), 8);
    assert.equal(short.records.workings['short-reform'].record.status, 'interrupted');
    assert.equal(phase(short), 'failed');
    assert.equal(quantity(short, 'outside', EARTH_QI), 4);
    const supplied = applyEngineOps(short, [{op: 'add', holder: 'outside', quantity: EARTH_QI, amount: 2}], 'fixture:replenished-qi');
    const reforming = advance(reform(supplied, 'reform'), 10);
    assert.equal(phase(reforming), 'exposed');
    assert.equal(quantity(reforming, 'master', GREEN_GRAPE), 0);
    const rearmed = applyEngineOps(reforming, [
        {op: 'set', holder: 'outside-attacker', quantity: GREEN_GRAPE, amount: 1},
    ], 'fixture:attacker-refueled');
    const secondAttack = start(rearmed, 'second-attack', GU_ASCENSION_DISRUPTION_LAW, guAscensionDisruptionWorking,
        {attacker: 'outside-attacker', source: 'outside'});
    const brokenAgain = advance(restore(secondAttack), 12);
    assert.equal(phase(brokenAgain), 'failed');
    assert.equal(quantity(brokenAgain, 'outside', EARTH_QI), 5);
    assert.equal(quantity(brokenAgain, 'master', GREEN_GRAPE), 0);
    const recovered = advance(restore(reforming), 15);
    assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(reforming, 15)));
    assert.equal(phase(recovered), 'fused');
    assert.equal(quantity(recovered, 'outside', EARTH_QI), 0);
    assert.equal(quantity(recovered, 'outside', HEAVEN_QI), 0);
    assert.equal(recovered.world.holders.master.state[GU_APERTURE], undefined);
    const repaired = advance(repair(recovered, 'recovered-repair'), 16);
    assert.equal(quantity(repaired, 'aperture', 'cover'), 50);
    assert.equal(quantity(repaired, 'master', GREEN_GRAPE), 1);

    const withdrawn = applyEngineOps(attacked, [{op: 'move', holder: 'outside-attacker', to: 'aperture'}], 'fixture:attacker-withdrawn');
    const sealed = advance(restore(withdrawn), 4);
    assert.equal(sealed.records.workings.external.record.status, 'interrupted');
    assert.equal(quantity(sealed, 'outside-attacker', GREEN_GRAPE), 1);
    assert.equal(sealed.world.holders.aperture.state[ASCENSION_PACK].formedAt, 4);
    assert.equal(quantity(sealed, 'master', GREEN_GRAPE), 2);
    assert.equal(quantity(sealed, 'master', 'vitality'), 14);
    assert.equal(phase(advance(sealed, 7)), 'fused');
});

const copper = 'energy:primeval.rank1';
function outsideThreatSite() {
    return applyEngineOps(formationSite('peak', true), [
        {op: 'holder_add', value: {id: 'outside-calamity', kind: 'body', as: ['creature'], place: 'outside',
            properties: {alive: true}, quantities: {[GREEN_GRAPE]: 2, vitality: 1}}},
        {op: 'holder_add', value: {id: 'defender', kind: 'body', as: ['operator'], place: 'outside',
            properties: {alive: true}, quantities: {[copper]: 4}}},
        {op: 'holder_add', value: {...guBodyHolder({id: 'moonlight', needs: 'gu'}, {id: 'moon', place: 'outside', satiety: 10}),
            properties: {alive: true, gu_kind: 'moonlight', gu_keeper: 'defender', gu_controller: 'defender'}}},
        {op: 'property', holder: 'outside', property: 'gu_outside_calamity', value: 'outside-calamity'},
    ], 'fixture:autonomous-calamity');
}

test('a paid Moonblade can disable the outside calamity before it scatters qi', () => {
    const pending = outsideThreatSite();
    const exposed = advance(pending, 2);
    assert.equal(phase(exposed), 'exposed');
    assert.equal(quantity(exposed, 'outside-calamity', GREEN_GRAPE), 2);
    const failed = advance(restore(exposed), 7);
    assert.deepEqual(serializeEngineWorld(failed), serializeEngineWorld(advance(pending, 7)));
    assert.equal(phase(failed), 'failed');
    assert.equal(quantity(failed, 'outside', EARTH_QI), 4);
    assert.equal(quantity(failed, 'outside-calamity', GREEN_GRAPE), 1);

    const cast = start(pending, 'moonblade', GU_MOONBLADE_CONTACT_LAW, moonbladeContactWorking(),
        {operator: 'defender', blade: 'moon', target: 'outside-calamity'});
    const launched = advance(cast, 1);
    assert.equal(quantity(launched, 'defender', copper), 0);
    assert.equal(quantity(launched, 'outside-calamity', 'vitality'), 1);
    const impact = advance(restore(launched), 2);
    assert.equal(phase(impact), 'exposed');
    assert.equal(quantity(impact, 'outside-calamity', 'vitality'), 0);
    const safe = advance(impact, 7);
    assert.deepEqual(serializeEngineWorld(safe), serializeEngineWorld(advance(cast, 7)));
    assert.equal(phase(safe), 'fused');
    assert.equal(quantity(safe, 'outside-calamity', GREEN_GRAPE), 2);
    assert.equal(quantity(safe, 'outside', EARTH_QI), 0);

    const warded = applyEngineOps(launched, [{op: 'law_add', field: {id: 'calamity-ward', kind: 'block',
        scope: 'outside-calamity', params: {verb: 'remove', object: 'vitality'}}}], 'fixture:calamity-ward');
    const blocked = advance(restore(warded), 7);
    assert.equal(phase(blocked), 'failed');
    assert.equal(quantity(blocked, 'defender', copper), 0);
    assert.equal(quantity(blocked, 'outside-calamity', 'vitality'), 1);
    assert.equal(quantity(blocked, 'outside-calamity', GREEN_GRAPE), 1);
});

test('independent outside calamities draw from the same finite earth qi during formation', () => {
    const earth = engine => quantity(engine, 'outside', EARTH_QI);
    const essence = (engine, id) => quantity(engine, id, GREEN_GRAPE);
    const pending = applyEngineOps(outsideThreatSite(), [
        {op: 'property', holder: 'outside-calamity', property: 'gu_scatters_outside_qi', value: true},
        {op: 'holder_add', value: {id: 'second-calamity', kind: 'body', as: ['creature'], place: 'outside',
            properties: {alive: true, gu_scatters_outside_qi: true}, quantities: {[GREEN_GRAPE]: 2, vitality: 1}}},
        {op: 'set', holder: 'outside', quantity: EARTH_QI, amount: 6},
    ], 'fixture:overlapping-calamities');
    const exposed = advance(pending, 2);
    const struck = advance(restore(exposed), 3);
    const failed = advance(struck, 7);
    assert.deepEqual(serializeEngineWorld(failed), serializeEngineWorld(advance(pending, 7)));
    assert.equal(phase(failed), 'failed');
    assert.equal(earth(failed), 4);
    assert.equal(essence(failed, 'outside-calamity'), 1);
    assert.equal(essence(failed, 'second-calamity'), 1);

    const cast = start(pending, 'moonblade', GU_MOONBLADE_CONTACT_LAW, moonbladeContactWorking(),
        {operator: 'defender', blade: 'moon', target: 'outside-calamity'});
    const saved = advance(restore(advance(cast, 1)), 7);
    assert.deepEqual(serializeEngineWorld(saved), serializeEngineWorld(advance(cast, 7)));
    assert.equal(phase(saved), 'fused');
    assert.equal(earth(saved), 0);
    assert.equal(quantity(saved, 'defender', copper), 0);
    assert.equal(essence(saved, 'outside-calamity'), 2);
    assert.equal(essence(saved, 'second-calamity'), 1);

    const lastQi = applyEngineOps(exposed, [{op: 'set', holder: 'outside', quantity: EARTH_QI, amount: 1}], 'fixture:last-qi');
    const exhausted = advance(restore(lastQi), 3);
    assert.equal(earth(exhausted), 0);
    assert.equal(essence(exhausted, 'outside-calamity'), 1);
    assert.equal(essence(exhausted, 'second-calamity'), 2);
});

test('an intervention between staggered calamities can save an exposed aperture', () => {
    const initial = outsideThreatSite();
    const pending = applyEngineOps(initial, [
        {op: 'state', holder: 'aperture', pack: ASCENSION_PACK, value: {
            ...initial.world.holders.aperture.state[ASCENSION_PACK], exposureMinutes: 5}},
        {op: 'property', holder: 'outside-calamity', property: 'gu_outside_strike_lead', value: 4},
        {op: 'holder_add', value: {id: 'late-calamity', kind: 'body', as: ['creature'], place: 'outside',
            properties: {alive: true, gu_scatters_outside_qi: true}, quantities: {[GREEN_GRAPE]: 2, vitality: 1}}},
        {op: 'set', holder: 'outside', quantity: EARTH_QI, amount: 6},
    ], 'fixture:staggered-calamities');
    const first = advance(pending, 3);
    assert.equal(phase(first), 'exposed');
    assert.equal(quantity(first, 'outside', EARTH_QI), 5);
    assert.equal(quantity(first, 'outside-calamity', GREEN_GRAPE), 1);
    assert.equal(quantity(first, 'late-calamity', GREEN_GRAPE), 2);
    const failed = advance(restore(first), 10);
    assert.deepEqual(serializeEngineWorld(failed), serializeEngineWorld(advance(pending, 10)));
    assert.equal(phase(failed), 'failed');
    assert.deepEqual(failed.world.chain.filter(row => row.kind === 'gu.outside-qi-scattered')
        .map(row => [row.at, row.by]), [[3, 'outside-calamity'], [6, 'late-calamity']]);

    const cast = start(first, 'intercept-late', GU_MOONBLADE_CONTACT_LAW, moonbladeContactWorking(),
        {operator: 'defender', blade: 'moon', target: 'late-calamity'});
    const saved = advance(restore(advance(cast, 4)), 10);
    assert.deepEqual(serializeEngineWorld(saved), serializeEngineWorld(advance(cast, 10)));
    assert.equal(phase(saved), 'fused');
    assert.equal(quantity(saved, 'defender', copper), 0);
    assert.equal(quantity(saved, 'late-calamity', GREEN_GRAPE), 2);
    assert.equal(quantity(saved, 'outside-calamity', GREEN_GRAPE), 1);
});

test('split formation intakes settle their own qi, and a shortfall in either blocks sealing', () => {
    const initial = applyEngineOps(formationSite('peak', true, {startNow: false}), [
        {op: 'holder_add', value: {id: 'ridge', kind: 'place', quantities: {[HEAVEN_QI]: 5}}},
        {op: 'set', holder: 'outside', quantity: EARTH_QI, amount: 6},
        {op: 'holder_add', value: {id: 'ridge-threat', kind: 'body', place: 'ridge',
            properties: {alive: true, gu_scatters_outside_qi: true}, quantities: {[GREEN_GRAPE]: 1}}},
        {op: 'holder_add', value: {id: 'earth-threat', kind: 'body', place: 'outside',
            properties: {alive: true, gu_scatters_outside_qi: true}, quantities: {[GREEN_GRAPE]: 1}}},
    ], 'fixture:split-intakes');
    const pending = start(initial, 'split', GU_APERTURE_FORMATION_LAW, guSplitApertureWorking(),
        {operator: 'master', aperture: 'aperture', source: 'outside', heavenSource: 'ridge'});
    const exposed = advance(pending, 2);
    assert.equal(phase(exposed), 'exposed');
    const failed = advance(restore(exposed), 7);
    assert.deepEqual(serializeEngineWorld(failed), serializeEngineWorld(advance(pending, 7)));
    assert.equal(phase(failed), 'failed');
    assert.equal(quantity(failed, 'ridge', HEAVEN_QI), 4);
    assert.equal(quantity(failed, 'outside', EARTH_QI), 5);
    assert.equal(quantity(failed, 'outside', HEAVEN_QI), 5);
    assert.equal(quantity(failed, 'master', GREEN_GRAPE), 0);
    assert.equal(quantity(failed, 'earth-threat', GREEN_GRAPE), 0);
    assert.equal(quantity(failed, 'ridge-threat', GREEN_GRAPE), 0);

    const defended = applyEngineOps(exposed, [
        {op: 'move', holder: 'ridge-threat', to: 'aperture'},
    ], 'fixture:ridge-threat-driven-off');
    const fused = advance(restore(defended), 7);
    assert.deepEqual(serializeEngineWorld(fused), serializeEngineWorld(advance(defended, 7)));
    assert.equal(phase(fused), 'fused');
    assert.equal(quantity(fused, 'ridge', HEAVEN_QI), 0);
    assert.equal(quantity(fused, 'outside', EARTH_QI), 0);
    assert.equal(quantity(fused, 'outside', HEAVEN_QI), 5);
    assert.equal(quantity(fused, 'ridge-threat', GREEN_GRAPE), 1);

    const replenished = applyEngineOps(failed, [
        {op: 'set', holder: 'ridge', quantity: HEAVEN_QI, amount: 5},
        {op: 'set', holder: 'outside', quantity: EARTH_QI, amount: 6},
    ], 'fixture:replenish-intakes');
    const reformation = start(replenished, 'reform-split', GU_APERTURE_FORMATION_LAW, guSplitApertureWorking({recovering: true}),
        {operator: 'master', aperture: 'aperture', source: 'outside', heavenSource: 'ridge'});
    const reformed = advance(restore(reformation), 15);
    assert.deepEqual(serializeEngineWorld(reformed), serializeEngineWorld(advance(reformation, 15)));
    assert.equal(phase(reformed), 'fused');
    assert.equal(quantity(reformed, 'ridge', HEAVEN_QI), 0);
    assert.equal(quantity(reformed, 'outside', EARTH_QI), 0);
});

test('a prepared intake can take over before sealing, spending one qi to switch', () => {
    const initial = outsideThreatSite();
    const pending = applyEngineOps(initial, [
        {op: 'state', holder: 'aperture', pack: ASCENSION_PACK, value: {
            ...initial.world.holders.aperture.state[ASCENSION_PACK], exposureMinutes: 5}},
        {op: 'property', holder: 'outside-calamity', property: 'gu_outside_strike_lead', value: 4},
        {op: 'holder_add', value: {id: 'backup', kind: 'place', quantities: {[EARTH_QI]: 6}}},
        {op: 'link_add', link: {id: 'backup-intake', kind: 'qi-intake', from: 'aperture', to: 'backup'}},
    ], 'fixture:prepared-intake');
    const damaged = advance(pending, 3);
    assert.equal(quantity(damaged, 'outside', EARTH_QI), 4);
    const reroute = engine => start(engine, 'reroute', GU_APERTURE_FORMATION_LAW, guRerouteApertureWorking(EARTH_QI),
        {operator: 'master', aperture: 'aperture', backup: 'backup'});
    const switching = reroute(damaged);
    const switched = advance(restore(switching), 4);
    assert.equal(quantity(switched, 'backup', EARTH_QI), 5);
    const fused = advance(switched, 10);
    assert.deepEqual(serializeEngineWorld(fused), serializeEngineWorld(advance(switching, 10)));
    assert.equal(phase(fused), 'fused');
    assert.equal(quantity(fused, 'backup', EARTH_QI), 0);
    assert.equal(quantity(fused, 'outside', EARTH_QI), 4);
    assert.equal(quantity(fused, 'outside', HEAVEN_QI), 0);

    const closed = applyEngineOps(switching, [{op: 'link_set', id: 'backup-intake', state: 'closed'}], 'fixture:cut-intake');
    const late = reroute(advance(damaged, 6));
    for (const attempt of [closed, late]) {
        const failed = advance(restore(attempt), 10);
        assert.equal(phase(failed), 'failed');
        assert.equal(quantity(failed, 'backup', EARTH_QI), 6);
        assert.equal(quantity(failed, 'outside', HEAVEN_QI), 5);
        assert.equal(failed.world.chain.find(row => row.kind === 'gu.aperture-intake-result').detail.result, 'refused');
    }
    const severed = applyEngineOps(switched, [{op: 'link_set', id: 'backup-intake', state: 'closed'}], 'fixture:cut-after-switch');
    const failed = advance(restore(severed), 10);
    assert.equal(phase(failed), 'failed');
    assert.equal(quantity(failed, 'backup', EARTH_QI), 5);
    assert.equal(quantity(failed, 'outside', HEAVEN_QI), 5);
});

test('a pooled formation draws from open intakes and can finish after one channel is cut', () => {
    const initial = applyEngineOps(formationSite('peak', true, {startNow: false}), [
        {op: 'set', holder: 'outside', quantity: EARTH_QI, amount: 2},
        ...['first-intake', 'second-intake'].flatMap(id => [
            {op: 'holder_add', value: {id, kind: 'place', quantities: {[EARTH_QI]: 4}}},
            {op: 'link_add', link: {id, kind: 'qi-intake', from: 'aperture', to: id}},
        ]),
        {op: 'holder_add', value: {id: 'calamity-at-backup', kind: 'body', place: 'second-intake',
            properties: {alive: true, gu_scatters_outside_qi: true}, quantities: {[GREEN_GRAPE]: 1}}},
    ], 'fixture:pooled-intakes');
    const pending = start(initial, 'pool', GU_APERTURE_FORMATION_LAW, guPooledApertureWorking,
        {operator: 'master', aperture: 'aperture', source: 'outside'});
    const exposed = advance(restore(pending), 2);
    assert.equal(phase(exposed), 'exposed');
    const cut = (engine, id) => applyEngineOps(engine, [{op: 'link_set', id, state: 'closed'}], 'fixture:cut-intake');
    const damaged = cut(exposed, 'first-intake');
    const fused = advance(restore(damaged), 7);
    assert.deepEqual(serializeEngineWorld(fused), serializeEngineWorld(advance(damaged, 7)));
    assert.equal(phase(fused), 'fused');
    assert.equal(quantity(fused, 'outside', EARTH_QI), 0);
    assert.equal(quantity(fused, 'first-intake', EARTH_QI), 4);
    assert.equal(quantity(fused, 'second-intake', EARTH_QI), 0);
    assert.equal(quantity(fused, 'calamity-at-backup', GREEN_GRAPE), 0);
    const failed = advance(restore(cut(damaged, 'second-intake')), 7);
    assert.equal(phase(failed), 'failed');
    assert.equal(quantity(failed, 'outside', HEAVEN_QI), 5);
    assert.equal(quantity(failed, 'outside', EARTH_QI), 2);
    assert.equal(quantity(failed, 'second-intake', EARTH_QI), 4);
    assert.equal(quantity(failed, 'calamity-at-backup', GREEN_GRAPE), 1);
});

test('spare qi fuses the two living Gu and restoration gives cover while the calamity keeps attacking', () => {
    const initial = setup();
    const cocooned = advance(initial, 1);
    assert.equal(phase(cocooned), 'cocooned');
    assert.equal(quantity(cocooned, 'aperture', HEAVEN_QI), 1);
    assert.equal(quantity(cocooned, 'aperture', EARTH_QI), 0);
    const fused = advance(restore(cocooned), 3);
    assert.deepEqual(serializeEngineWorld(fused), serializeEngineWorld(advance(initial, 3)));
    assert.equal(phase(fused), 'fused');
    assert.deepEqual(readLineage(fused.world, 'aperture.landscape').at(-1).parents, ['aperture.river', 'aperture.mountain']);
    assert.equal(fused.world.holders['aperture.river'], undefined);
    assert.equal(fused.world.holders['aperture.mountain'], undefined);
    assert.equal(fused.world.holders['aperture.landscape'].properties.gu_controller, 'master');

    const ongoing = start(fused, 'calamity', threat, threatMethod, {threat: 'calamity', terrain: 'aperture', victim: 'master'});
    const pending = repair(ongoing);
    const result = advance(restore(pending), 5);
    assert.deepEqual(serializeEngineWorld(result), serializeEngineWorld(advance(pending, 5)));
    assert.equal(quantity(result, 'aperture', 'cover'), 50);
    assert.equal(quantity(result, 'master', GREEN_GRAPE), 1);
    assert.equal(quantity(result, 'master', 'vitality'), 18);
    assert.equal(quantity(advance(ongoing, 5), 'master', 'vitality'), 14);
    assert.equal(quantity(result, 'calamity', stormForce), 2);
    assert.equal(result.world.holders.calamity.properties.alive, true);
    const full = advance(repair(result, 'finish'), 6);
    assert.equal(quantity(full, 'aperture', 'cover'), 60);
    assert.equal(quantity(full, 'master', GREEN_GRAPE), 0);
    const later = start(full, 'second-strike', threat, threatMethod, {threat: 'calamity', terrain: 'aperture', victim: 'master'});
    const after = advance(restore(later), 8);
    assert.equal(quantity(after, 'master', 'vitality'), 16);
    assert.equal(quantity(after, 'calamity', stormForce), 1);
});

test('missing qi leaves precursors waiting, and losing a cocooned precursor stops fusion after qi is spent', () => {
    const dry = advance(setup({qi: [3, 1]}), 10);
    assert.equal(phase(dry), 'gathering');
    assert.equal(quantity(dry, 'aperture', HEAVEN_QI), 3);
    const supplied = applyEngineOps(dry, [{op: 'add', holder: 'aperture', quantity: EARTH_QI, amount: 1}], 'fixture:qi-arrived');
    assert.equal(phase(advance(supplied, 13)), 'fused');

    const cocooned = advance(setup(), 1);
    for (const change of [{op: 'move', holder: 'aperture.mountain', to: 'outside'},
        {op: 'property', holder: 'aperture', property: 'gu_resonant', value: false}]) {
        const failed = advance(restore(applyEngineOps(cocooned, [change], 'fixture:disrupted')), 3);
        assert.equal(phase(failed), 'failed');
        assert.equal(quantity(failed, 'aperture', EARTH_QI), 0);
        assert.ok(failed.world.holders['aperture.river']);
        assert.equal(failed.world.holders['aperture.landscape'], undefined);
    }
});

test('simultaneous resonance settles one living world claim', () => {
    const result = advance(restore(advance(setup({rival: true}), 1)), 3);
    assert.equal(phase(result), 'fused');
    assert.equal(phase(result, 'rival-aperture'), 'failed');
    assert.equal(result.world.holders['rival-aperture'].state[ASCENSION_PACK].reason, 'living-claim');
    assert.ok(result.world.holders['rival-aperture.river']);
    assert.equal(result.world.holders['rival-aperture.landscape'], undefined);
});

test('a retired Landscape frees its claim for a later cocoon', () => {
    const setupWorld = applyEngineOps(setup({rival: true}), [
        {op: 'set', holder: 'rival-aperture', quantity: EARTH_QI, amount: 0},
    ], 'fixture:delayed-qi');
    const fused = advance(setupWorld, 3);
    const pending = applyEngineOps(fused, [
        {op: 'lifecycle', act: 'end', holder: 'aperture.landscape'},
        {op: 'add', holder: 'rival-aperture', quantity: EARTH_QI, amount: 2},
    ], 'fixture:new-window');
    const successor = advance(restore(pending), 6);
    assert.equal(phase(successor, 'rival-aperture'), 'fused');
    assert.equal(successor.world.holders['aperture.landscape'], undefined);
    assert.equal(successor.world.holders['rival-aperture.landscape'].properties.gu_controller, 'rival');
    assert.equal(successor.world.laws.find(field => field.scope === 'world').params.specimen, 'rival-aperture.landscape');
});

test('repair fails when the Gu changes hands or the green grape reserve runs dry', () => {
    const pending = repair(advance(setup(), 3));
    for (const change of [{op: 'property', holder: 'aperture.landscape', property: 'gu_keeper', value: 'another'},
        {op: 'set', holder: 'master', quantity: GREEN_GRAPE, amount: 0}]) {
        const disrupted = applyEngineOps(pending, [change], 'fixture:lost-means');
        const failed = advance(restore(disrupted), 4);
        assert.equal(failed.records.workings.repair.record.status, 'interrupted');
        assert.equal(quantity(failed, 'aperture', 'cover'), 20);
        assert.equal(quantity(failed, 'master', GREEN_GRAPE), quantity(disrupted, 'master', GREEN_GRAPE));
    }
});
