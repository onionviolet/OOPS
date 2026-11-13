import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {guBodyCase} from '../src/world_packs/gu_body_cases.js';
import {firstControlMethod, GU_CONTROL_PROPERTIES, GU_FIRST_CONTROL_LAW} from '../src/world_packs/gu_first_control.js';
import {GU_MOONBLADE_CONTACT_LAW as law, angledCrescentMirrorWorking, crescentMirrorWorking,
    moonbladeContactWorking} from '../src/world_packs/gu_moonblade_contact.js';
import {GU_USE_AGREEMENT_LAW, GU_USE_AGREEMENT_PROPERTIES, guLivingHostPack,
    guUseAgreementWorking} from '../src/world_packs/gu_use_agreement.js';
import {forearmWound, GU_FOREARM_CARE_LAW, guForearmCare, guForearmCareFor, guForearmGuard, guForearmSplint, guForearmSplintFor,
    guMoonbladeHarmPack, moonbladeArmBlocked, moonbladeForearmImpact} from '../src/world_packs/gu_moonblade_harm.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const fuel = 'energy:primeval.rank1';
const middle = 'energy:primeval.rank1.middle';
const config = {ownPacks: [guMoonbladeHarmPack, guLivingHostPack],
    packs: ['l.living_body', guMoonbladeHarmPack.id, guLivingHostPack.id],
    host: {laws: [law, GU_USE_AGREEMENT_LAW, GU_FIRST_CONTROL_LAW, GU_FOREARM_CARE_LAW],
        ports: {landImpact: moonbladeForearmImpact}}, shared: {
    properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES, ...GU_USE_AGREEMENT_PROPERTIES,
        {id: 'injured', type: 'flag'}, {id: 'gu_vital_master', type: 'label'}],
    quantities: [...sharedQuantities(['energy', 'vitality', 'stock']),
        {id: 'primeval_essence', unit: 'essence', min: 0, max: 100}],
}};
const gu = (id, kind) => ({...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'bank', satiety: 20}),
    properties: {alive: true, gu_kind: kind, gu_keeper: 'caster', gu_controller: 'caster'}});

function setup(targetPlace = 'far', arm = false) {
    return createEngineWorld({...config, holders: [
        ...['bank', 'near', 'far', 'flank', 'shelter'].map(id => ({id, kind: 'place'})),
        {id: 'caster', kind: 'body', as: ['operator'], place: 'bank', properties: {alive: true}, quantities: {[fuel]: 10, [middle]: 2}},
        {id: 'lender', kind: 'body', as: ['operator'], place: 'bank', properties: {alive: true}, quantities: {[fuel]: 10}},
        {id: 'target', kind: 'body', as: ['creature', 'operator'], place: targetPlace, properties: {alive: true,
            ...(arm && {gu_forearm_interposed: true, gu_forearm_fracture_at: 2})}, quantities: {vitality: 20}},
        {id: 'healer', kind: 'body', as: ['operator'], place: 'shelter', properties: {alive: true},
            quantities: {'stock:bandages': 1, 'stock:splints': 1}},
        {id: 'bystander', kind: 'body', as: ['creature'], place: 'far', properties: {alive: true}, quantities: {vitality: 20}},
        gu('moon', 'moonlight'), gu('light', 'little-light'),
    ], links: [
        {id: 'near-shot', kind: 'sightline', from: 'bank', to: 'near', cost: 10},
        {id: 'far-shot', kind: 'sightline', from: 'near', to: 'far', cost: 10},
        {id: 'flank-shot', kind: 'sightline', from: 'bank', to: 'flank', cost: 5},
        {id: 'covered-walk', kind: 'path', from: 'bank', to: 'far', cost: 1},
    ]});
}

function cast(engine, supported = false, grade, reflectable = false, routed = false) {
    const method = moonbladeContactWorking({supported, grade, reflectable, routed});
    return startEngineWorking(engine, {id: 'shot', law, method, bindings: {
        operator: {kind: 'operator', id: 'caster'}, blade: {kind: 'gu', id: 'moon'}, target: {kind: 'creature', id: 'target'},
        ...(supported && {light: {kind: 'gu', id: 'light'}}),
    }});
}
const advance = (engine, to) => advanceEngineWorld(engine, to).engine;
const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
const funds = engine => engine.world.holders.caster.quantities[fuel];
const vitality = (engine, id = 'target') => engine.world.holders[id].quantities.vitality;
const shot = engine => engine.records.workings.shot;

test('a paid sale transfers the exact living Moonlight Gu and lets the buyer cast after restore', () => {
    const stones = 'stock:primeval_stone';
    const initial = applyEngineOps(setup('near'), [
        {op: 'carry', holder: 'caster', quantity: stones, amount: 3},
        {op: 'carry', holder: 'lender', quantity: stones, amount: 0},
        {op: 'property', holder: 'lender', property: 'alive', value: true},
        ...['gu_title', 'gu_keeper', 'gu_controller'].map(property =>
            ({op: 'property', holder: 'moon', property, value: 'lender'})),
    ], 'fixture:market');
    const sale = (engine, id) => startEngineWorking(engine, {id, law: GU_USE_AGREEMENT_LAW,
        method: guUseAgreementWorking('sell', undefined, {price: 2}), bindings: {
            lender: {kind: 'operator', id: 'lender'}, borrower: {kind: 'operator', id: 'caster'},
            specimen: {kind: 'gu', id: 'moon'},
        }});
    const pending = sale(sale(initial, 'sale-a'), 'sale-b');
    const sold = advance(restore(pending), 1);
    assert.deepEqual(serializeEngineWorld(sold), serializeEngineWorld(advance(pending, 1)));
    assert.equal(sold.records.workings['sale-a'].record.status, 'complete');
    assert.equal(sold.records.workings['sale-b'].record.status, 'interrupted');
    const {holders} = sold.world;
    assert.equal(holders.caster.quantities[stones], 1);
    assert.equal(holders.lender.quantities[stones], 2);
    for (const key of ['gu_title', 'gu_keeper', 'gu_controller']) assert.equal(holders.moon.properties[key], 'caster');
    assert.equal(holders.moon.quantities.satiety, 19);
    assert.equal(vitality(advance(cast(sold), 3)), 19);
    const short = advance(restore(applyEngineOps(pending, [
        {op: 'set', holder: 'caster', quantity: stones, amount: 1},
    ], 'fixture:short-price')), 1);
    assert.equal(short.world.holders.moon.properties.gu_title, 'lender');
    assert.equal(short.world.holders.lender.quantities[stones], 0);
    const committed = advance(restore(applyEngineOps(pending, [
        {op: 'property', holder: 'moon', property: 'gu_use_working', value: 'other-cast'},
        {op: 'property', holder: 'moon', property: 'gu_use_working_until', value: 1},
    ], 'fixture:gu-in-use')), 1);
    assert.equal(committed.records.workings['sale-a'].record.receipts[0].reason, 'The Gu is committed or bonded.');
    assert.equal(committed.world.holders.caster.quantities[stones], 3);
});

test('Gu sale offers can be declined or replaced, and acceptance settles the saved price once', () => {
    const stones = 'stock:primeval_stone';
    const initial = applyEngineOps(setup('near'), [
        {op: 'carry', holder: 'caster', quantity: stones, amount: 3},
        {op: 'carry', holder: 'lender', quantity: stones, amount: 0},
        {op: 'property', holder: 'lender', property: 'alive', value: true},
        ...['gu_title', 'gu_keeper', 'gu_controller'].map(property =>
            ({op: 'property', holder: 'moon', property, value: 'lender'})),
    ], 'fixture:offer-market');
    const order = (engine, id, action, options) => startEngineWorking(engine, {
        id, law: GU_USE_AGREEMENT_LAW, method: guUseAgreementWorking(action, 4, options), bindings: {
            lender: {kind: 'operator', id: 'lender'}, borrower: {kind: 'operator', id: 'caster'},
            specimen: {kind: 'gu', id: 'moon'},
        }});
    const offered = advance(restore(order(initial, 'opening', 'offer', {price: 3})), 1);
    const opening = {offer: 'opening/0'};
    const untouched = engine => {
        assert.equal(engine.world.holders.moon.properties.gu_title, 'lender');
        assert.equal(engine.world.holders.caster.quantities[stones], 3);
        assert.equal(engine.world.holders.lender.quantities[stones], 0);
    };
    untouched(offered);
    const declined = advance(order(offered, 'decline', 'decline', opening), 2);
    const declinedAcceptance = advance(order(declined, 'declined-accept', 'accept', opening), 3);
    assert.equal(declinedAcceptance.records.workings['declined-accept'].record.status, 'interrupted');
    untouched(declinedAcceptance);
    const expired = advance(order(advance(offered, 3), 'late-accept', 'accept', opening), 4);
    assert.equal(expired.records.workings['late-accept'].record.status, 'interrupted');
    untouched(expired);

    const revised = advance(order(offered, 'revised', 'offer', {price: 2}), 2);
    const terms = {offer: 'revised/0', price: 1};
    let pending = order(revised, 'stale-accept', 'accept', opening);
    pending = order(order(pending, 'accept-a', 'accept', terms), 'accept-b', 'accept', terms);
    const short = advance(restore(applyEngineOps(pending, [
        {op: 'set', holder: 'caster', quantity: stones, amount: 1},
    ], 'fixture:funds-lost-after-offer')), 3);
    assert.equal(short.records.workings['accept-a'].record.receipts[0].reason, 'The sale cannot settle its price.');
    assert.equal(short.world.holders.moon.properties.gu_title, 'lender');
    assert.equal(short.world.holders.lender.quantities[stones], 0);
    const sold = advance(restore(pending), 3);
    assert.deepEqual(serializeEngineWorld(sold), serializeEngineWorld(advance(pending, 3)));
    assert.equal(sold.records.workings['stale-accept'].record.status, 'interrupted');
    assert.equal(sold.records.workings['accept-a'].record.status, 'complete');
    assert.equal(sold.records.workings['accept-b'].record.status, 'interrupted');
    assert.equal(sold.world.holders.caster.quantities[stones], 1);
    assert.equal(sold.world.holders.lender.quantities[stones], 2);
    assert.equal(sold.world.holders.moon.properties.gu_title, 'caster');
    assert.equal(vitality(advance(cast(sold), 5)), 19);

    const countered = advance(restore(order(offered, 'buyer-counter', 'counter', {...opening, price: 1})), 2);
    untouched(countered);
    const counterTerms = {offer: 'buyer-counter/0'};
    const wrongSide = advance(order(countered, 'buyer-accept', 'accept', counterTerms), 3);
    assert.equal(wrongSide.records.workings['buyer-accept'].record.status, 'interrupted');
    untouched(wrongSide);
    const sellerDeclines = advance(order(countered, 'seller-decline', 'decline-counter', counterTerms), 3);
    assert.equal(sellerDeclines.world.holders.moon.properties.gu_sale_offer, undefined);
    untouched(sellerDeclines);
    const sellerAccepts = order(countered, 'seller-accept', 'accept-counter', counterTerms);
    const counterSale = advance(restore(sellerAccepts), 3);
    assert.deepEqual(serializeEngineWorld(counterSale), serializeEngineWorld(advance(sellerAccepts, 3)));
    assert.equal(counterSale.world.holders.caster.quantities[stones], 2);
    assert.equal(counterSale.world.holders.lender.quantities[stones], 1);
    assert.equal(counterSale.world.holders.moon.properties.gu_title, 'caster');
    assert.equal(vitality(advance(cast(counterSale), 5)), 19);
});

test('a named heir inherits the living Gu but needs a paid refinement to cast with it', () => {
    const initial = applyEngineOps(setup('near'), [
        {op: 'property', holder: 'lender', property: 'alive', value: true},
        ...['gu_title', 'gu_keeper', 'gu_controller', 'gu_vital_master'].map(property =>
            ({op: 'property', holder: 'moon', property, value: 'lender'})),
        ...['aperture_open', 'refinement_support'].map(property =>
            ({op: 'property', holder: 'caster', property, value: true})),
        {op: 'carry', holder: 'caster', quantity: 'primeval_essence', amount: 1},
    ], 'fixture:succession');
    const succession = (engine, id, operation, heir = 'caster') => startEngineWorking(engine, {
        id, law: GU_USE_AGREEMENT_LAW, method: guUseAgreementWorking(operation), bindings: {
            owner: {kind: 'operator', id: 'lender'}, heir: {kind: 'operator', id: heir}, specimen: {kind: 'gu', id: 'moon'},
        }});
    const named = advance(succession(initial, 'name-heir', 'bequeath'), 1);
    const premature = advance(succession(named, 'premature', 'inherit'), 2);
    assert.equal(premature.records.workings.premature.record.status, 'interrupted');
    assert.equal(premature.world.holders.moon.properties.gu_title, 'lender');
    const estate = applyEngineOps(named, [
        {op: 'property', holder: 'lender', property: 'alive', value: false},
        {op: 'holder_add', value: {id: 'other-heir', kind: 'body', as: ['operator'], place: 'bank', properties: {alive: true}}},
    ], 'fixture:owner-died');
    const pending = succession(succession(estate, 'wrong-heir', 'inherit', 'other-heir'), 'inherit', 'inherit');
    const inherited = advance(restore(pending), 2);
    assert.deepEqual(serializeEngineWorld(inherited), serializeEngineWorld(advance(pending, 2)));
    assert.equal(inherited.records.workings['wrong-heir'].record.status, 'interrupted');
    const moon = inherited.world.holders.moon;
    assert.equal(moon.properties.gu_title, 'caster');
    assert.equal(moon.properties.gu_keeper, 'caster');
    assert.equal(moon.properties.gu_controller, undefined);
    assert.equal(moon.properties.gu_vital_master, 'lender');
    assert.equal(moon.quantities.satiety, 18);
    const denied = advance(cast(inherited), 4);
    assert.equal(vitality(denied), 20);
    assert.equal(funds(denied), 10);
    const refining = startEngineWorking(inherited, {id: 'refine-inheritance', law: GU_FIRST_CONTROL_LAW,
        method: firstControlMethod(true), bindings: {operator: {kind: 'operator', id: 'caster'}, specimen: {kind: 'gu', id: 'moon'}}});
    const refined = advance(restore(refining), 7);
    assert.equal(refined.world.holders.caster.quantities.primeval_essence, 0);
    assert.equal(refined.world.holders.moon.properties.gu_controller, 'caster');
    assert.equal(refined.world.holders.moon.properties.gu_vital_master, 'lender');
    assert.equal(vitality(advance(cast(refined), 9)), 19);
});

test('an heir can take title while a borrower keeps custody until return', () => {
    const initial = applyEngineOps(setup('near'), [
        {op: 'property', holder: 'lender', property: 'alive', value: true},
        ...['gu_title', 'gu_keeper', 'gu_controller'].map(property =>
            ({op: 'property', holder: 'moon', property, value: 'lender'})),
        {op: 'holder_add', value: {id: 'heir', kind: 'body', as: ['operator'], place: 'shelter', properties: {alive: true}}},
    ], 'fixture:loan-estate');
    const ref = (kind, id) => ({kind, id});
    const specimen = ref('gu', 'moon'), owner = ref('operator', 'lender');
    const heir = ref('operator', 'heir'), borrower = ref('operator', 'caster');
    const agree = (engine, id, action, bindings) => startEngineWorking(engine, {
        id, law: GU_USE_AGREEMENT_LAW, method: guUseAgreementWorking(action, 5, {recallable: true}), bindings,
    });
    const named = agree(initial, 'name-heir', 'bequeath', {owner, heir, specimen});
    const loan = advance(agree(named, 'loan', 'grant', {lender: owner, borrower, specimen}), 1);
    const estate = applyEngineOps(loan, [{op: 'property', holder: 'lender', property: 'alive', value: false}], 'fixture:owner-died');
    const pending = agree(estate, 'inherit-loan', 'inherit-loan', {owner, heir, borrower, specimen});
    const inherited = advance(restore(pending), 2);
    assert.deepEqual(serializeEngineWorld(inherited), serializeEngineWorld(advance(pending, 2)));
    const props = engine => engine.world.holders.moon.properties;
    assert.equal(props(inherited).gu_title, 'heir');
    assert.equal(props(inherited).gu_keeper, 'caster');
    assert.equal(props(inherited).gu_controller, undefined);
    assert.equal(props(inherited).gu_use_until, 5);
    assert.equal(props(inherited).gu_recall_anchor, undefined);
    const fired = advance(cast(inherited), 4);
    assert.equal(vitality(fired), 19);
    const local = applyEngineOps(fired, [{op: 'move', holder: 'heir', to: 'bank'}], 'fixture:heir-arrives');
    const returned = advance(restore(agree(local, 'return', 'return', {lender: heir, borrower, specimen})), 5);
    assert.equal(props(returned).gu_keeper, 'heir');
    assert.equal(props(returned).gu_use_grantee, undefined);
    assert.equal(props(returned).gu_controller, undefined);
    assert.equal(returned.world.holders.moon.quantities.satiety, 15);

    const overdue = advance(inherited, 5);
    const denied = advance(cast(overdue), 7);
    assert.equal(shot(denied).record.receipts[0].reason, 'gu-use-grant-expired');
    assert.equal(funds(denied), 10);
    assert.equal(props(denied).gu_keeper, 'caster');
});

test('paid plunder changes custody without granting control and a committed specimen resists', () => {
    const essence = 'energy:primeval.rank2';
    const initial = applyEngineOps(setup('near'), [
        {op: 'carry', holder: 'caster', quantity: essence, amount: 2},
        {op: 'holder_add', value: gu('plunder', 'plunder')},
        ...['gu_title', 'gu_keeper', 'gu_controller'].map(property =>
            ({op: 'property', holder: 'moon', property, value: 'lender'})),
    ], 'fixture:plunder');
    const pending = startEngineWorking(initial, {id: 'plunder', law: GU_USE_AGREEMENT_LAW,
        method: guUseAgreementWorking('plunder'), bindings: {
            keeper: {kind: 'operator', id: 'lender'}, taker: {kind: 'operator', id: 'caster'},
            specimen: {kind: 'gu', id: 'moon'}, tool: {kind: 'gu', id: 'plunder'},
        }});
    const midway = advance(pending, 1);
    const taken = advance(restore(midway), 2);
    assert.deepEqual(serializeEngineWorld(taken), serializeEngineWorld(advance(pending, 2)));
    assert.equal(taken.world.holders.moon.properties.gu_keeper, 'caster');
    assert.equal(taken.world.holders.moon.properties.gu_title, 'lender');
    assert.equal(taken.world.holders.moon.properties.gu_controller, 'lender');
    assert.equal(taken.world.holders.moon.quantities.satiety, 18);
    assert.equal(taken.world.holders.caster.quantities[essence], 0);
    const denied = advance(cast(taken), 4);
    assert.equal(vitality(denied), 20);
    assert.equal(funds(denied), 10);
    assert.equal(shot(denied).record.receipts[0].reason, 'gu-not-controlled-here');
    const fastened = applyEngineOps(midway, [
        {op: 'property', holder: 'moon', property: 'gu_use_working', value: 'other-cast'},
        {op: 'property', holder: 'moon', property: 'gu_use_working_until', value: 2},
    ], 'fixture:gu-committed');
    const resisted = advance(restore(fastened), 2);
    assert.equal(resisted.world.holders.moon.properties.gu_keeper, 'lender');
    assert.equal(resisted.world.holders.caster.quantities[essence], 0);
    assert.equal(resisted.records.workings.plunder.record.receipts[0].observed.result, 'specimen-held-fast');
    const outOfReach = advance(restore(applyEngineOps(midway, [
        {op: 'move', holder: 'moon', to: 'shelter'},
    ], 'fixture:removed-from-reach')), 2);
    assert.equal(outOfReach.records.workings.plunder.record.status, 'interrupted');
    assert.equal(outOfReach.world.holders.caster.quantities[essence], 2);
});

test('hosted Plunder separates the same living Gu or injures its tool when release loses funding', () => {
    const essence = 'energy:primeval.rank2';
    const initial = applyEngineOps(setup('bank'), [
        {op: 'carry', holder: 'caster', quantity: essence, amount: 2},
        {op: 'holder_add', value: gu('plunder', 'plunder')},
        ...['gu_keeper', 'gu_living_host'].map(property => ({op: 'property', holder: 'moon', property, value: 'target'})),
        {op: 'property', holder: 'moon', property: 'gu_controller', value: null},
    ], 'fixture:hosted-gu');
    const cast = (engine, id = 'extract') => startEngineWorking(engine, {id, law: GU_USE_AGREEMENT_LAW,
        method: guUseAgreementWorking('extract'), bindings: {
            host: {kind: 'creature', id: 'target'}, taker: {kind: 'operator', id: 'caster'},
            specimen: {kind: 'gu', id: 'moon'}, tool: {kind: 'gu', id: 'plunder'},
        }});
    const pending = cast(initial);
    const grip = advance(pending, 1);
    assert.equal(grip.world.holders.caster.quantities[essence], 1);
    assert.equal(grip.world.holders.moon.properties.gu_living_host, 'target');
    const freed = advance(restore(grip), 2);
    assert.deepEqual(serializeEngineWorld(freed), serializeEngineWorld(advance(pending, 2)));
    assert.equal(freed.world.holders.moon.properties.gu_living_host, undefined);
    assert.equal(freed.world.holders.moon.properties.gu_keeper, 'caster');
    assert.equal(freed.world.holders.moon.properties.gu_controller, undefined);
    assert.equal(freed.world.holders.moon.quantities.satiety, 18);
    assert.equal(freed.world.holders.caster.quantities[essence], 0);

    const drained = applyEngineOps(grip, [{op: 'set', holder: 'caster', quantity: essence, amount: 0}], 'fixture:drain');
    const backlash = advance(restore(drained), 2);
    assert.equal(backlash.world.holders.moon.properties.gu_living_host, 'target');
    assert.equal(backlash.world.holders.plunder.properties.injured, true);
    assert.equal(backlash.records.workings.extract.record.receipts.at(-1).observed.result, 'backlash');

    const retreat = engine => applyEngineOps(engine, [{op: 'move', holder: 'target', to: 'shelter'}], 'fixture:host-retreat');
    const escaped = retreat(restore(grip));
    assert.equal(escaped.world.holders.moon.place, 'shelter');
    assert.equal(escaped.world.holders.moon.properties.gu_living_host, 'target');
    const missed = advance(restore(escaped), 2);
    assert.deepEqual(serializeEngineWorld(missed), serializeEngineWorld(advance(retreat(grip), 2)));
    assert.equal(missed.records.workings.extract.record.status, 'interrupted');
    assert.equal(missed.world.holders.caster.quantities[essence], 1);
    assert.equal(missed.world.holders.moon.quantities.satiety, 18);
    assert.equal(retreat(restore(freed)).world.holders.moon.place, 'bank');

    const skittish = applyEngineOps(initial, [
        {op: 'property', holder: 'target', property: 'gu_host_refuge', value: 'shelter'},
        {op: 'carry', holder: 'target', quantity: 'energy:stamina', amount: 1},
        {op: 'link_add', link: {id: 'host-escape', kind: 'path', from: 'bank', to: 'shelter'}},
    ], 'fixture:host-can-flee');
    const escaping = cast(skittish);
    const fled = advance(restore(advance(escaping, 1)), 2);
    assert.deepEqual(serializeEngineWorld(fled), serializeEngineWorld(advance(escaping, 2)));
    assert.equal(fled.world.holders.target.place, 'shelter');
    assert.equal(fled.world.holders.target.quantities['energy:stamina'], 0);
    assert.equal(fled.world.holders.moon.place, 'shelter');
    assert.equal(fled.world.holders.moon.properties.gu_living_host, 'target');
    assert.equal(fled.world.holders.caster.quantities[essence], 1);
    assert.equal(fled.records.workings.extract.record.status, 'interrupted');

    const closed = applyEngineOps(escaping, [{op: 'link_set', id: 'host-escape', state: 'closed'}], 'fixture:escape-closed');
    const captured = advance(restore(closed), 2);
    assert.equal(captured.world.holders.target.place, 'bank');
    assert.equal(captured.world.holders.target.quantities['energy:stamina'], 1);
    assert.equal(captured.world.holders.moon.properties.gu_keeper, 'caster');
    assert.equal(captured.world.holders.caster.quantities[essence], 0);
    const pinned = applyEngineOps(escaping, [{op: 'law_add', field: {id: 'host-pin', kind: 'block', scope: 'target',
        params: {verb: 'move', object: 'position'}}}], 'fixture:host-pinned');
    const stayed = advance(restore(pinned), 2);
    assert.equal(stayed.world.holders.target.place, 'bank');
    assert.equal(stayed.world.holders.target.quantities['energy:stamina'], 1);
    assert.equal(stayed.world.holders.moon.properties.gu_keeper, 'caster');

    const stubborn = applyEngineOps(closed, [
        {op: 'property', holder: 'target', property: 'gu_host_braces', value: true},
    ], 'fixture:host-braces');
    const braced = advance(stubborn, 1);
    assert.equal(braced.world.holders.target.quantities['energy:stamina'], 0);
    const resisted = advance(restore(braced), 2);
    assert.deepEqual(serializeEngineWorld(resisted), serializeEngineWorld(advance(stubborn, 2)));
    assert.equal(resisted.world.holders.target.place, 'bank');
    assert.equal(resisted.world.holders.moon.properties.gu_living_host, 'target');
    assert.equal(resisted.world.holders.caster.quantities[essence], 0);
    assert.equal(resisted.records.workings.extract.record.receipts.at(-1).observed.result, 'host-braced');
    const refueled = applyEngineOps(resisted, [
        {op: 'set', holder: 'caster', quantity: essence, amount: 2},
    ], 'fixture:second-attempt');
    const retried = advance(restore(cast(refueled, 'retry-extraction')), 4);
    assert.equal(retried.world.holders.target.quantities['energy:stamina'], 0);
    assert.equal(retried.world.holders.moon.properties.gu_keeper, 'caster');
});

test('Little Light doubles reach and damage using the same Moonlight Gu', () => {
    const near = advance(cast(setup('near')), 2);
    const far = advance(cast(setup()), 2);
    const extended = advance(cast(setup(), true), 3);
    assert.equal(vitality(near), 19);
    assert.equal(vitality(far), 20);
    assert.equal(funds(far), 6);
    assert.equal(shot(far).landed[0].status, 'idle');
    assert.equal(vitality(extended), 18);
    assert.equal(vitality(extended, 'bystander'), 20);
    assert.equal(funds(extended), 5);
    assert.deepEqual(shot(extended).record.receipts[1].observed.released, {from: 'bank', aim: 'far', cost: 20, amount: 2});
});

test('a paid mirror redirects a released blade through the return sightline after restore', () => {
    const scene = applyEngineOps(setup(), [
        {op: 'carry', holder: 'caster', quantity: 'vitality', amount: 20},
        {op: 'carry', holder: 'target', quantity: fuel, amount: 2},
        {op: 'holder_add', value: {...gu('mirror', 'crescent-mirror'), place: 'far',
            properties: {alive: true, gu_kind: 'crescent-mirror', gu_keeper: 'target', gu_controller: 'target'}}},
    ], 'fixture:mirror');
    const mirror = (engine, aim) => startEngineWorking(engine, {id: 'mirror', law,
        method: aim ? angledCrescentMirrorWorking : crescentMirrorWorking, bindings: {
        operator: {kind: 'operator', id: 'target'}, specimen: {kind: 'gu', id: 'mirror'},
        ...(aim && {redirect: {kind: 'creature', id: aim}}),
    }});
    const launched = advance(cast(scene, true, undefined, true), 2);
    const pending = mirror(launched);
    const reflected = advance(restore(pending), 3);
    assert.deepEqual(serializeEngineWorld(reflected), serializeEngineWorld(advance(pending, 3)));
    assert.equal(vitality(reflected), 20);
    assert.equal(vitality(reflected, 'caster'), 18);
    assert.equal(vitality(reflected, 'bystander'), 20);
    assert.equal(funds(reflected), 5);
    assert.equal(reflected.world.holders.target.quantities[fuel], 0);
    const hidden = applyEngineOps(pending, [{op: 'move', holder: 'caster', to: 'shelter'}], 'fixture:withdraw');
    const missed = advance(restore(hidden), 3);
    assert.equal(vitality(missed), 20);
    assert.equal(vitality(missed, 'caster'), 20);
    assert.equal(missed.world.holders.target.quantities[fuel], 0);
    assert.match(shot(missed).landed[0].reason, /reflected.*no clear path/);
    const empty = applyEngineOps(pending, [{op: 'set', holder: 'target', quantity: fuel, amount: 0}], 'fixture:spent');
    const hit = advance(restore(empty), 3);
    assert.equal(hit.records.workings.mirror.record.status, 'interrupted');
    assert.equal(vitality(hit), 18);
    assert.equal(vitality(hit, 'caster'), 20);

    const angled = mirror(launched, 'bystander');
    const deflected = advance(restore(angled), 3);
    assert.deepEqual(serializeEngineWorld(deflected), serializeEngineWorld(advance(angled, 3)));
    assert.equal(vitality(deflected, 'bystander'), 18);
    assert.equal(vitality(deflected, 'caster'), 20);
    assert.equal(vitality(deflected), 20);
    assert.equal(deflected.world.holders.target.quantities[fuel], 0);

    const evaded = advance(restore(applyEngineOps(angled, [
        {op: 'move', holder: 'bystander', to: 'shelter'},
    ], 'fixture:redirect-evades')), 3);
    assert.equal(vitality(evaded, 'bystander'), 20);
    assert.equal(vitality(evaded, 'caster'), 20);
    assert.equal(vitality(evaded), 20);
    assert.equal(evaded.world.holders.target.quantities[fuel], 0);
    assert.match(shot(evaded).landed[0].reason, /deflected.*no clear path/);
});

test('two paid mirrors can turn a Moonblade across three places within its remaining reach', () => {
    const mirrorHolder = (id, keeper, place) => ({...gu(id, 'crescent-mirror'), place,
        properties: {alive: true, gu_kind: 'crescent-mirror', gu_keeper: keeper, gu_controller: keeper}});
    const scene = applyEngineOps(setup('near'), [
        {op: 'link_set', id: 'far-shot', cost: 5},
        {op: 'link_add', link: {id: 'last-shot', kind: 'sightline', from: 'far', to: 'shelter', cost: 5}},
        {op: 'move', holder: 'bystander', to: 'shelter'},
        {op: 'carry', holder: 'target', quantity: fuel, amount: 2},
        {op: 'holder_add', value: {id: 'relay', kind: 'body', as: ['operator', 'creature'], place: 'far',
            properties: {alive: true}, quantities: {vitality: 20, [fuel]: 2}}},
        {op: 'holder_add', value: mirrorHolder('first-mirror', 'target', 'near')},
        {op: 'holder_add', value: mirrorHolder('second-mirror', 'relay', 'far')},
    ], 'fixture:mirror-route');
    const mirror = (engine, id, operator, specimen, redirect) => startEngineWorking(engine, {id, law,
        method: angledCrescentMirrorWorking, bindings: {operator: {kind: 'operator', id: operator},
            specimen: {kind: 'gu', id: specimen}, redirect: {kind: 'creature', id: redirect}}});
    const launch = advance(cast(scene, true, undefined, false, true), 2);
    const pending = mirror(mirror(launch, 'first-mirror', 'target', 'first-mirror', 'relay'),
        'second-mirror', 'relay', 'second-mirror', 'bystander');
    const hit = advance(restore(pending), 3);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(pending, 3)));
    assert.equal(vitality(hit, 'bystander'), 18);
    assert.equal(vitality(hit), 20);
    assert.equal(vitality(hit, 'relay'), 20);
    assert.equal(funds(hit), 5);
    assert.equal(hit.world.holders.target.quantities[fuel], 0);
    assert.equal(hit.world.holders.relay.quantities[fuel], 0);
    assert.match(shot(hit).landed[0].reason, /first-mirror.*second-mirror/);
    const tooFar = applyEngineOps(pending, [{op: 'link_set', id: 'last-shot', cost: 6}], 'fixture:longer-leg');
    const missed = advance(restore(tooFar), 3);
    assert.equal(vitality(missed, 'bystander'), 20);
    assert.equal(missed.world.holders.relay.quantities[fuel], 0);
    assert.match(shot(missed).landed[0].reason, /second-mirror.*no clear path/);

    const loop = mirror(mirror(launch, 'first-mirror', 'target', 'first-mirror', 'relay'),
        'second-mirror', 'relay', 'second-mirror', 'target');
    const stopped = advance(restore(loop), 3);
    assert.equal(vitality(stopped), 20);
    assert.match(shot(stopped).landed[0].reason, /returned to .*first-mirror.*intercepted/);
});

test('after release the target can sidestep or a sightline can close, while the caster can leave', () => {
    const launched = advance(cast(setup(), true), 2);
    assert.equal(funds(launched), 5);
    const left = applyEngineOps(launched, [{op: 'move', holder: 'caster', to: 'shelter'}], 'fixture:withdraw');
    const hit = advance(restore(left), 3);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(left, 3)));
    assert.equal(vitality(hit), 18);
    for (const change of [
        {op: 'move', holder: 'target', to: 'flank'},
        {op: 'link_set', id: 'far-shot', state: 'closed'},
        {op: 'law_add', field: {id: 'guard', kind: 'block', scope: 'target', params: {verb: 'remove', object: 'vitality'}}},
    ]) {
        const missed = advance(restore(applyEngineOps(launched, [change], 'fixture:response')), 3);
        assert.equal(vitality(missed), 20);
        assert.equal(funds(missed), 5);
        if (change.op === 'move') assert.equal(shot(missed).record.receipts[2].observed.contact, 'evaded');
        else assert.equal(shot(missed).landed[0].status, 'idle');
    }
});

test('losing Moonlight before release retains the support price and produces no shot', () => {
    const prepared = advance(cast(setup(), true), 1);
    const lost = applyEngineOps(prepared, [{op: 'property', holder: 'moon', property: 'gu_controller', value: 'rival'}], 'fixture:loss');
    const result = advance(restore(lost), 3);
    assert.equal(shot(result).record.status, 'interrupted');
    assert.equal(shot(result).record.facts.shot, undefined);
    assert.equal(funds(result), 9);
    assert.equal(vitality(result), 20);
});

test('a meal during paid preparation determines whether the same Moonlight Gu releases a blade', () => {
    const moonlight = guBodyCase('moonlight');
    const [food] = moonlight.knownStock;
    const ready = applyEngineOps(setup(), [
        {op: 'set', holder: 'moon', quantity: 'satiety', amount: 2},
        {op: 'holder_add', value: {id: 'pouch', kind: 'thing', place: 'bank', quantities: {[food]: moonlight.mealAmount}}},
    ], 'fixture:last-ration');
    const prepared = advance(cast(ready, true), 1);
    assert.equal(funds(prepared), 9);
    assert.equal(prepared.world.holders.moon.quantities.satiety, 1);
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const hungry = advance(reload(prepared), 3);
    assert.equal(shot(hungry).record.receipts.at(-1).reason, 'needs feeding');
    assert.equal(hungry.world.holders.moon.state['l.living_body'].emptySince, 2);
    assert.equal(hungry.world.holders.pouch.quantities[food], moonlight.mealAmount);
    assert.equal(funds(hungry), 9);
    assert.equal(vitality(hungry), 20);

    const feed = engine => applyEngineOps(engine, moonlight.mealOps(engine.world, 'moon', 'pouch'), 'fixture:meal');
    const fed = advance(reload(feed(reload(prepared))), 3);
    assert.deepEqual(serializeEngineWorld(fed), serializeEngineWorld(advance(feed(prepared), 3)));
    assert.equal(fed.world.holders.pouch.quantities[food], 0);
    assert.equal(fed.world.holders.moon.properties.gu_controller, 'caster');
    assert.equal(funds(fed), 5);
    assert.equal(vitality(fed), 18);
    assert.ok(shot(fed).record.receipts.every(row => row.ok));
});

function borrowedMoonlight(until) {
    const titled = applyEngineOps(setup('near'), ['gu_title', 'gu_keeper', 'gu_controller'].map(property => ({
        op: 'property', holder: 'moon', property, value: 'lender',
    })), 'fixture:title');
    return advance(startEngineWorking(titled, {id: 'loan', law: GU_USE_AGREEMENT_LAW,
        method: guUseAgreementWorking('grant', until), bindings: {
            lender: {kind: 'operator', id: 'lender'}, borrower: {kind: 'operator', id: 'caster'},
            specimen: {kind: 'gu', id: 'moon'},
        }}), 1);
}

test('expiry before release stops the paid preparation, while expiry in flight leaves the released blade', () => {
    const expiring = advance(cast(borrowedMoonlight(3), true), 2);
    const refused = advance(restore(expiring), 4);
    assert.equal(shot(refused).record.receipts.at(-1).reason, 'gu-use-grant-expired');
    assert.equal(funds(refused), 9);
    assert.equal(vitality(refused), 20);

    const launched = advance(cast(borrowedMoonlight(4), true), 3);
    const hit = advance(restore(launched), 4);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(launched, 4)));
    assert.equal(funds(hit), 5);
    assert.equal(vitality(hit), 18);
    assert.equal(hit.world.holders.lender.quantities[fuel], 10);
    assert.equal(hit.world.holders.moon.properties.gu_keeper, 'caster');
    assert.equal(hit.world.holders.moon.properties.gu_controller, 'lender');
});

test('two local users can release the same Gu, then one term can expire independently', () => {
    const initial = applyEngineOps(setup('near'), [
        {op: 'holder_add', value: {id: 'guest', kind: 'body', as: ['operator'], place: 'bank',
            properties: {alive: true}, quantities: {[fuel]: 10}}},
        ...['gu_title', 'gu_keeper', 'gu_controller'].map(property => ({op: 'property', holder: 'moon', property, value: 'lender'})),
    ], 'fixture:shared-keepers');
    const agree = (engine, id, borrower, action, until) => startEngineWorking(engine, {id, law: GU_USE_AGREEMENT_LAW,
        method: guUseAgreementWorking(action, until), bindings: {lender: {kind: 'operator', id: 'lender'},
            borrower: {kind: 'operator', id: borrower}, specimen: {kind: 'gu', id: 'moon'}}});
    const pending = agree(agree(initial, 'share-first', 'caster', 'share', 3), 'share-second', 'guest', 'share', 7);
    const shared = advance(restore(pending), 1);
    assert.deepEqual(shared.world.holders.moon.properties.gu_shared_use, ['caster:3', 'guest:7']);
    assert.equal(shared.world.holders.moon.properties.gu_keeper, 'lender');
    const exclusive = agree(shared, 'exclusive', 'caster', 'grant', 9);
    const fire = (engine, id, operator, charged = false) => startEngineWorking(engine, {id, law, method: moonbladeContactWorking({charged}),
        bindings: {operator: {kind: 'operator', id: operator}, blade: {kind: 'gu', id: 'moon'}, target: {kind: 'creature', id: 'target'}}});
    const firing = fire(fire(exclusive, 'first', 'caster'), 'second', 'guest');
    const released = advance(firing, 2);
    assert.equal(released.records.workings.exclusive.record.status, 'interrupted');
    const hit = advance(restore(released), 3);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(firing, 3)));
    assert.equal(vitality(hit), 18);
    const later = fire(fire(fire(hit, 'expired', 'caster'), 'still-shared', 'guest'), 'owner-cast', 'lender');
    const resolved = advance(later, 5);
    assert.equal(resolved.records.workings.expired.record.receipts[0].reason, 'gu-use-grant-expired');
    assert.equal(funds(resolved), 6);
    assert.equal(resolved.world.holders.guest.quantities[fuel], 2);
    assert.equal(resolved.world.holders.lender.quantities[fuel], 6);
    assert.equal(vitality(resolved), 16);
    assert.equal(resolved.world.holders.moon.properties.gu_controller, 'lender');
    const distant = applyEngineOps(hit, [{op: 'move', holder: 'guest', to: 'near'}], 'fixture:guest-left');
    const refused = advance(fire(distant, 'distant', 'guest'), 5);
    assert.equal(refused.records.workings.distant.record.receipts[0].reason, 'gu-not-controlled-here');
    assert.equal(refused.world.holders.guest.quantities[fuel], 6);
    const transferred = applyEngineOps(hit, ['gu_title', 'gu_keeper', 'gu_controller'].map(property => ({
        op: 'property', holder: 'moon', property, value: 'caster',
    })), 'fixture:new-title');
    const afterTransfer = advance(fire(transferred, 'old-permission', 'guest'), 5);
    assert.equal(afterTransfer.records.workings['old-permission'].record.receipts[0].reason, 'gu-not-held');

    const charging = fire(shared, 'guest-charging', 'guest', true);
    const held = advance(charging, 2);
    assert.equal(held.world.holders.moon.properties.gu_use_working, 'guest-charging');
    const contested = fire(held, 'caster-contest', 'caster');
    const chargedHit = advance(restore(contested), 4);
    assert.deepEqual(serializeEngineWorld(chargedHit), serializeEngineWorld(advance(contested, 4)));
    assert.equal(chargedHit.records.workings['caster-contest'].record.receipts[0].reason, 'gu-already-committed');
    assert.equal(funds(chargedHit), 10);
    assert.equal(chargedHit.world.holders.guest.quantities[fuel], 5);
    assert.equal(chargedHit.world.holders.moon.properties.gu_use_working, undefined);
    assert.equal(vitality(chargedHit), 19);

    const expiringCharge = advance(fire(shared, 'expiring-charge', 'caster', true), 2);
    const expired = advance(restore(expiringCharge), 3);
    assert.equal(expired.records.workings['expiring-charge'].record.receipts.at(-1).reason, 'gu-use-grant-expired');
    assert.equal(funds(expired), 9);
    assert.equal(vitality(expired), 20);
    const recovered = advance(fire(expired, 'guest-after-expiry', 'guest'), 5);
    assert.equal(vitality(recovered), 19);
});

test('the same Moonlight Gu cuts or fractures an interposed forearm, and treatment stops bleeding after retreat', () => {
    const initial = setup('near', true);
    const plain = advance(cast(initial), 2);
    assert.equal(vitality(plain), 19);
    assert.equal(forearmWound(plain.world.holders.target).rung, 'wounded');
    assert.equal(vitality(advance(plain, 4)), 19);
    const pending = advance(cast(initial, false, 'middle'), 1);
    const fractured = advance(restore(pending), 2);
    assert.deepEqual(serializeEngineWorld(fractured), serializeEngineWorld(advance(pending, 2)));
    assert.equal(fractured.world.holders.caster.quantities[middle], 1);
    assert.equal(funds(fractured), 10);
    assert.equal(vitality(fractured), 18);
    assert.equal(forearmWound(fractured.world.holders.target).rung, 'maimed');
    const retreated = applyEngineOps(fractured, [{op: 'move', holder: 'target', to: 'shelter'}], 'fixture:retreat');
    assert.equal(vitality(advance(retreated, 4)), 16);
    const treatment = startEngineWorking(retreated, {id: 'bind', law: GU_FOREARM_CARE_LAW, method: guForearmCare,
        bindings: {healer: {kind: 'operator', id: 'healer'}, patient: {kind: 'creature', id: 'target'}}});
    const treated = advance(restore(treatment), 5);
    assert.equal(vitality(treated), 17);
    assert.equal(treated.world.holders.healer.quantities['stock:bandages'], 0);
    assert.equal(forearmWound(treated.world.holders.target).rung, 'maimed');
    const legacy = applyEngineOps(retreated, [
        {op: 'property', holder: 'target', property: 'gu_right_forearm_bleeding', value: null},
        {op: 'property', holder: 'target', property: 'gu_forearm_bleeding', value: true},
    ], 'fixture:legacy-bleeding');
    const oldMethod = {...guForearmCare, steps: [{op: 'bindWound', bindings: {healer: 'healer', patient: 'patient'}}]};
    const legacyPending = startEngineWorking(legacy, {id: 'legacy-bind', law: GU_FOREARM_CARE_LAW, method: oldMethod,
        bindings: {healer: {kind: 'operator', id: 'healer'}, patient: {kind: 'creature', id: 'target'}}});
    const legacyTreated = advance(restore(legacyPending), 5);
    assert.equal(vitality(legacyTreated), vitality(treated));
    assert.equal(legacyTreated.world.holders.healer.quantities['stock:bandages'], 0);
});

test('a blocked paid middle-stage blade never reaches the arm', () => {
    const guarded = applyEngineOps(setup('near', true), [{op: 'law_add', field: {id: 'guard', scope: 'target',
        kind: 'block', params: {verb: 'remove', object: 'vitality'}}}], 'fixture:guard');
    const result = advance(cast(guarded, false, 'middle'), 4);
    assert.equal(result.world.holders.caster.quantities[middle], 1);
    assert.equal(vitality(result), 20);
    assert.equal(forearmWound(result.world.holders.target), null);
});

test('a defender can interpose the other arm before contact and restore function on that side', () => {
    const guard = (engine, id, side) => startEngineWorking(engine, {id, law: GU_FOREARM_CARE_LAW,
        method: guForearmGuard(side), bindings: {defender: {kind: 'creature', id: 'target'}}});
    const waiting = cast(setup('near', true), true);
    const late = advance(guard(advance(waiting, 3), 'late-guard', 'left'), 4);
    assert.equal(forearmWound(late.world.holders.target).rung, 'maimed');
    assert.equal(forearmWound(late.world.holders.target, 'left'), null);
    const pending = guard(advance(waiting, 1), 'left-guard', 'left');
    const caught = advance(restore(pending), 3);
    assert.deepEqual(serializeEngineWorld(caught), serializeEngineWorld(advance(pending, 3)));
    assert.equal(vitality(caught), 18);
    assert.equal(funds(caught), 5);
    assert.equal(forearmWound(caught.world.holders.target), null);
    assert.equal(forearmWound(caught.world.holders.target, 'left').rung, 'maimed');
    assert.equal(moonbladeArmBlocked(caught.world.holders.target, 'left'), true);
    assert.equal(moonbladeArmBlocked(caught.world.holders.target, 'right'), false);
    const refused = advance(guard(caught, 'refused-guard', 'left'), 4);
    assert.equal(refused.records.workings['refused-guard'].record.status, 'interrupted');
    const retreated = applyEngineOps(refused, [{op: 'move', holder: 'target', to: 'shelter'}], 'fixture:retreat');
    const care = (engine, id, method) => startEngineWorking(engine, {id, law: GU_FOREARM_CARE_LAW, method,
        bindings: {healer: {kind: 'operator', id: 'healer'}, patient: {kind: 'creature', id: 'target'}}});
    const stabilized = advance(care(retreated, 'bind', guForearmCareFor('left')), 5);
    const splinting = care(stabilized, 'left-splint', guForearmSplintFor('left'));
    const healed = advance(restore(splinting), 65);
    assert.equal(forearmWound(healed.world.holders.target, 'left').rung, 'wounded');
    assert.equal(moonbladeArmBlocked(healed.world.holders.target, 'left'), false);
    assert.equal(healed.world.holders.healer.quantities['stock:splints'], 0);

    const switched = advance(guard(caught, 'right-guard', 'right'), 4);
    const second = startEngineWorking(switched, {id: 'second-shot', law, method: moonbladeContactWorking({grade: 'middle'}),
        bindings: {operator: {kind: 'operator', id: 'caster'}, blade: {kind: 'gu', id: 'moon'},
            target: {kind: 'creature', id: 'target'}}});
    const both = advance(second, 6);
    assert.equal(moonbladeArmBlocked(both.world.holders.target, 'left'), true);
    assert.equal(moonbladeArmBlocked(both.world.holders.target, 'right'), true);
    const sheltered = applyEngineOps(both, [{op: 'move', holder: 'target', to: 'shelter'},
        {op: 'set', holder: 'healer', quantity: 'stock:bandages', amount: 2}], 'fixture:retreat');
    const bindingRight = care(sheltered, 'bind-right', guForearmCare);
    const boundRight = advance(restore(bindingRight), 7);
    assert.deepEqual(serializeEngineWorld(boundRight), serializeEngineWorld(advance(bindingRight, 7)));
    assert.equal(vitality(boundRight), vitality(sheltered) - 2);
    assert.equal(vitality(advance(boundRight, 8)), vitality(boundRight) - 1);
    const duplicate = advance(care(boundRight, 'duplicate-right', guForearmCare), 8);
    assert.equal(duplicate.records.workings['duplicate-right'].record.status, 'interrupted');
    assert.equal(duplicate.world.holders.healer.quantities['stock:bandages'], 1);
    const stabilizedBoth = advance(care(duplicate, 'bind-left', guForearmCareFor('left')), 9);
    assert.equal(vitality(stabilizedBoth), vitality(duplicate) - 1);
    assert.equal(vitality(advance(stabilizedBoth, 10)), vitality(stabilizedBoth));
    assert.equal(stabilizedBoth.world.holders.healer.quantities['stock:bandages'], 0);
    const oneRepaired = advance(care(stabilizedBoth, 'right-splint', guForearmSplint), 69);
    assert.equal(moonbladeArmBlocked(oneRepaired.world.holders.target, 'left'), true);
    assert.equal(moonbladeArmBlocked(oneRepaired.world.holders.target, 'right'), false);
});

test('a fractured caster can switch arms, then regain the original cast after treatment and restore', () => {
    const initial = applyEngineOps(setup('near', true), [
        {op: 'holder_add', value: {...gu('return-moon', 'moonlight'), place: 'near',
            properties: {alive: true, gu_kind: 'moonlight', gu_keeper: 'defender', gu_controller: 'defender'}}},
        {op: 'holder_add', value: {...gu('return-light', 'little-light'), place: 'near',
            properties: {alive: true, gu_kind: 'little-light', gu_keeper: 'defender', gu_controller: 'defender'}}},
        {op: 'holder_add', value: {id: 'defender', kind: 'body', as: ['creature', 'operator'], place: 'near',
            properties: {alive: true, gu_forearm_interposed: true, gu_forearm_fracture_at: 2}, quantities: {vitality: 20, [fuel]: 10}}},
    ], 'fixture:returning-caster');
    const opening = startEngineWorking(initial, {id: 'opening', law, method: moonbladeContactWorking({grade: 'middle'}),
        bindings: {operator: {kind: 'operator', id: 'caster'}, blade: {kind: 'gu', id: 'moon'},
            target: {kind: 'creature', id: 'defender'}}});
    const fractured = advance(opening, 2);
    assert.equal(forearmWound(fractured.world.holders.defender).rung, 'maimed');
    const retaliate = (engine, arm) => startEngineWorking(engine, {id: 'retaliate', law,
        method: moonbladeContactWorking({supported: true, arm}), bindings: {
            operator: {kind: 'operator', id: 'defender'}, blade: {kind: 'gu', id: 'return-moon'},
            light: {kind: 'gu', id: 'return-light'}, target: {kind: 'creature', id: 'target'},
        }});
    const right = advance(restore(advance(retaliate(fractured, 'right'), 3)), 5);
    assert.equal(right.records.workings.retaliate.record.receipts.at(-1).reason, 'The injured arm cannot guide the Moonblade.');
    assert.equal(right.world.holders.defender.quantities[fuel], 9);
    assert.equal(vitality(right), 20);
    const leftPending = advance(retaliate(fractured, 'left'), 3);
    const left = advance(restore(leftPending), 5);
    assert.deepEqual(serializeEngineWorld(left), serializeEngineWorld(advance(leftPending, 5)));
    assert.equal(left.world.holders.defender.quantities[fuel], 5);
    assert.equal(vitality(left), 18);
    assert.equal(forearmWound(left.world.holders.defender).rung, 'maimed');

    const sheltered = applyEngineOps(fractured, [{op: 'move', holder: 'healer', to: 'near'}], 'fixture:healer-arrives');
    const treat = (engine, id, method) => startEngineWorking(engine, {id, law: GU_FOREARM_CARE_LAW, method,
        bindings: {healer: {kind: 'operator', id: 'healer'}, patient: {kind: 'creature', id: 'defender'}}});
    const stabilized = advance(treat(sheltered, 'bind', guForearmCare), 3);
    const interruptedCast = advance(retaliate(stabilized, 'right'), 6);
    assert.equal(interruptedCast.records.workings.retaliate.record.status, 'interrupted');
    const splinting = treat(stabilized, 'splint', guForearmSplint);
    const halfway = advance(splinting, 33);
    assert.equal(forearmWound(halfway.world.holders.defender).rung, 'maimed');
    const noSplint = applyEngineOps(halfway, [{op: 'set', holder: 'healer', quantity: 'stock:splints', amount: 0}], 'fixture:no-splint');
    const failedCare = advance(restore(noSplint), 63);
    assert.equal(failedCare.records.workings.splint.record.status, 'interrupted');
    assert.equal(forearmWound(failedCare.world.holders.defender).rung, 'maimed');
    const repaired = advance(restore(halfway), 63);
    assert.deepEqual(serializeEngineWorld(repaired), serializeEngineWorld(advance(splinting, 63)));
    assert.equal(repaired.world.holders.healer.quantities['stock:splints'], 0);
    assert.equal(forearmWound(repaired.world.holders.defender).rung, 'wounded');
    assert.equal(repaired.world.holders.defender.quantities.vitality, stabilized.world.holders.defender.quantities.vitality);
    const fed = applyEngineOps(repaired, ['return-moon', 'return-light'].map(holder =>
        ({op: 'set', holder, quantity: 'satiety', amount: 20})), 'fixture:fed');
    const returning = advance(retaliate(fed, 'right'), 64);
    const returned = advance(restore(returning), 66);
    assert.deepEqual(serializeEngineWorld(returned), serializeEngineWorld(advance(returning, 66)));
    assert.equal(returned.records.workings.retaliate.record.status, 'complete');
    assert.equal(returned.world.holders.defender.quantities[fuel], 5);
    assert.equal(vitality(returned), 18);
    assert.equal(forearmWound(returned.world.holders.defender).rung, 'maimed');
    assert.equal(moonbladeArmBlocked(returned.world.holders.defender, 'right'), true);
    assert.equal(returned.world.holders.defender.quantities.vitality, repaired.world.holders.defender.quantities.vitality - 1);

    const rested = advance(restore(fed), 303);
    assert.deepEqual(serializeEngineWorld(rested), serializeEngineWorld(advance(fed, 303)));
    assert.equal(forearmWound(rested.world.holders.defender).rung, 'bruised');
    const refreshed = applyEngineOps(rested, ['return-moon', 'return-light'].map(holder =>
        ({op: 'set', holder, quantity: 'satiety', amount: 20})), 'fixture:fed-after-rest');
    const safeReturn = advance(retaliate(refreshed, 'right'), 306);
    assert.equal(safeReturn.world.holders.defender.quantities[fuel], 5);
    assert.equal(vitality(safeReturn), 18);
    assert.equal(forearmWound(safeReturn.world.holders.defender).rung, 'bruised');
    assert.equal(safeReturn.world.holders.defender.quantities.vitality, repaired.world.holders.defender.quantities.vitality);
});
