import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, engineReceipts,
    restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {recordsOf} from '../src/knowledge_record.js';
import {readQuantity} from '../src/world_substrate.js';
import {sharedQuantities} from '../src/world_quantities.js';
import {beDivMethodKey} from '../src/book_world_lotm_divination_method.js';
import {BE_SEER_ENERGY} from '../src/book_world_lotm_be_seer.js';
import {LOTM_BOGDA_CONTACTS, LOTM_CONSULTATION_LAW, LOTM_CONSULTATION_PROPERTIES, LOTM_SPIRITUALITY, kleinGlacisRun, lotmBogdaFollowup,
    quoteLotmConsultation, settleLotmBogdaFollowup, startLotmConsultation} from '../src/world_packs/lotm_bogda_consultation.js';

const tarot = 'tarot', dream = 'dream-divination';
const place = 'divination-club', actor = 'klein';
const bindings = {seer: actor, deck: 'club-tarot', ...LOTM_BOGDA_CONTACTS};
const config = {packs: ['a.mind', 'n.knowledge'],
    shared: {quantities: sharedQuantities([LOTM_SPIRITUALITY]), properties: LOTM_CONSULTATION_PROPERTIES},
    host: {laws: [LOTM_CONSULTATION_LAW]}};
const object = (role, kind, by = actor) => ({id: bindings[role], kind: 'thing', place, as: [kind], properties: {lotm_held_by: by}});

// Declared-era opening, after Seer and lessons. Existing native tests exercise
// the drink and teaching; this engine route begins at the actual consultation.
function fresh({active = true, reserve = BE_SEER_ENERGY.capacity, tendency = 'adverse', learned = [tarot, dream]} = {}) {
    return createEngineWorld({...config, holders: [
        {id: place, kind: 'place'},
        {id: actor, kind: 'body', place, properties: {mind_awake: true, lotm_seer_active: active,
            mind_memory: learned.map(beDivMethodKey)}, quantities: {[LOTM_SPIRITUALITY]: reserve}},
        {id: 'bogda', kind: 'body', as: ['lotm.bogda'], place, properties: {mind_awake: true, mind_memory: []}},
        {id: bindings.event, kind: 'thing', as: ['lotm.operation'], place, properties: {lotm_operation_tendency: tendency}},
        object('deck', 'lotm.tarot-deck'), object('ring', 'lotm.bogda-ring'), object('notes', 'lotm.bogda-birth-notes'),
    ]});
}
const to = (engine, clock) => {
    const result = advanceEngineWorld(engine, clock);
    assert.equal(result.pending, false);
    return result.engine;
};
const start = (engine, name, id = name) => startLotmConsultation(engine, name, bindings, id);
const reserveOf = engine => readQuantity(engine.world, actor, LOTM_SPIRITUALITY);
const save = engine => JSON.parse(JSON.stringify(serializeEngineWorld(engine)));
const reload = engine => restoreEngineWorld(save(engine), config);
const afterTarot = () => to(start(fresh(), tarot), 3);
const records = engine => Object.values(recordsOf(engine.world, actor));
const choice = engine => lotmBogdaFollowup(engine.world, actor);
const returnRing = engine => applyEngineOps(engine, [{op: 'property', holder: bindings.ring,
    property: 'lotm_held_by', value: 'bogda'}], 'bogda.ring-returned');

test('Klein spends real Spirituality on two source readings and uses them to choose an investigation lead', () => {
    let engine = fresh();
    assert.equal(choice(engine).choice, 'gather-details');
    const quote = quoteLotmConsultation(engine, tarot, bindings);
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.cost, {quantity: LOTM_SPIRITUALITY, amount: 1});
    assert.equal(quote.locator, 'zh 第82章 p61');
    assert.doesNotMatch(JSON.stringify(quote), /Fortune|adverse/i);
    engine = to(start(engine, tarot), 2);
    assert.equal(reserveOf(engine), 2);
    assert.equal(records(engine).length, 1);
    assert.match(records(engine)[0].believed.value, /reversed Wheel of Fortune/);
    assert.equal(choice(engine).choice, 'gather-details', 'the signal alone does not stand in for an interpretation');
    engine = to(engine, 3);
    assert.equal(choice(engine).choice, 'seek-another-reading');
    assert.throws(() => settleLotmBogdaFollowup(engine, actor, 'pursue-glacis-lead'), /do not support/);

    const inFlight = start(engine, dream);
    const jump = to(inFlight, 6);
    const partitioned = to(reload(to(reload(to(inFlight, 4)), 5)), 6);
    assert.deepEqual(save(partitioned), save(jump));
    assert.equal(reserveOf(jump), 1);
    assert.deepEqual(records(jump).map(record => record.source.kind), ['observation', 'inference', 'observation', 'inference']);
    assert.match(records(jump)[2].believed.value, /white cloth/);
    assert.deepEqual(Object.keys(recordsOf(jump.world, 'bogda')), []);
    assert.deepEqual(lotmBogdaFollowup(jump.world, 'bogda'), {choice: 'gather-details', evidence: []});
    assert.equal(choice(jump).choice, 'pursue-glacis-lead');
    assert.equal(choice(jump).evidence.length, 2);
    assert.deepEqual(engineReceipts(jump).filter(row => row.truth.costs?.length).map(row => row.truth.paid.status), ['paid', 'paid']);

    const followed = settleLotmBogdaFollowup(jump, actor, choice(jump).choice);
    assert.match(records(followed).at(-1).believed.value, /Glacis/);
    assert.deepEqual(save(reload(followed)), save(followed));
    assert.deepEqual(save(settleLotmBogdaFollowup(reload(followed), actor, choice(followed).choice)), save(followed));
});

test('ring custody must hold when quoted and when the dream actually settles', () => {
    const baseline = afterTarot(), withoutRing = returnRing(baseline);
    assert.match(quoteLotmConsultation(withoutRing, dream, bindings).reason, /hold Bogda’s ring/);
    assert.throws(() => start(withoutRing, dream), /hold Bogda’s ring/);
    const interrupted = to(returnRing(to(start(baseline, dream), 4)), 6);
    const refused = engineReceipts(interrupted).find(row => row.op === `${dream}.attempt`);
    assert.match(refused.reason, /hold Bogda’s ring/);
    assert.equal(reserveOf(interrupted), reserveOf(baseline));
    assert.deepEqual(choice(interrupted), choice(baseline));
    assert.deepEqual(records(interrupted), records(baseline));
});

test('a different patient, ring or birth note cannot satisfy the case binding', () => {
    const original = fresh();
    for (const [name, role, as] of [[tarot, 'patient', 'lotm.bogda'], [dream, 'ring', 'lotm.bogda-ring'],
        [dream, 'notes', 'lotm.bogda-birth-notes']]) {
        const substitute = {id: `other-${role}`, kind: role === 'patient' ? 'body' : 'thing', as: [as],
            place, properties: {lotm_held_by: actor}};
        const engine = applyEngineOps(original, [{op: 'holder_add', value: substitute}], 'other-contact');
        const changed = {...bindings, [role]: substitute.id};
        assert.equal(quoteLotmConsultation(engine, name, changed).ok, false);
        assert.throws(() => startLotmConsultation(engine, name, changed, 'substitute'));
    }
});

test('an unsupported forecast stays unclear after a paid attempt, and Seer power, lesson and reserve are independent', () => {
    for (const options of [{active: false}, {learned: [dream]}, {reserve: 0}]) {
        const engine = fresh(options);
        const before = save(engine);
        assert.equal(quoteLotmConsultation(engine, tarot, bindings).ok, false);
        assert.throws(() => start(engine, tarot));
        assert.deepEqual(save(engine), before);
    }
    const unknown = fresh({tendency: 'unresolved'});
    assert.deepEqual(quoteLotmConsultation(unknown, tarot, bindings), quoteLotmConsultation(fresh(), tarot, bindings));
    const settled = to(start(unknown, tarot), 3);
    assert.equal(reserveOf(settled), 2);
    assert.equal(engineReceipts(settled).find(row => row.op === 'tarot.attempt').observed.status, 'unanswered');
    assert.deepEqual(choice(settled), {choice: 'gather-details', evidence: []});
});

test('repeating the Tarot reading leaves the follow-up at one kind of evidence', () => {
    const first = afterTarot();
    const repeated = to(start(first, tarot, 'tarot-repeat'), 6);
    assert.equal(reserveOf(repeated), reserveOf(first) - 1);
    assert.equal(records(repeated).length, 4);
    assert.deepEqual(choice(repeated), choice(first));
});

test('the playable Lawson route refers Bogda, compares the accounts and goes to the address', () => {
    const {create, restore, view, act} = kleinGlacisRun;
    let engine = create();
    assert.throws(() => act(engine, 'visit'), /cannot do that/);
    assert.doesNotMatch(JSON.stringify(view(engine)), /recovered|closed|sublet/i);
    for (const id of ['tarot', 'borrow', 'dream', 'refer', 'testimony', 'visit']) {
        assert.deepEqual(view(engine).actions.map(action => action.id), [id]);
        assert.equal(view(engine).actions[0].reason, undefined);
        engine = restore(save(act(engine, id)));
    }
    assert.equal(reserveOf(engine), 1);
    assert.equal(engine.world.holders[bindings.ring].properties.lotm_held_by, bindings.patient);
    assert.equal(engine.world.holders[actor].place, 'lawson-herb-store');
    assert.match(view(engine).history.join(' '), /Bogda says he recovered.*Glacis again speaks well/);
    assert.match(view(engine).result, /available to sublet.*without meeting Lawson/);
    assert.deepEqual(view(engine).actions, []);
    assert.throws(() => act(engine, 'visit'), /cannot do that/);
    const [lead, bogda, glacis, notice] = ['lotm.glacis.lawson-lead', 'lotm.bogda.operation.bogda-report',
        'lotm.bogda.operation.glacis-report', 'lotm.bogda.operation.shop-notice'].map(id => recordsOf(engine.world, actor)[id]);
    assert.deepEqual([lead.source.by, bogda.source.by, glacis.source.by, notice.source.by], ['glacis', 'bogda', 'glacis', actor]);
    assert.deepEqual([bogda.source.kind, glacis.source.kind, notice.source.kind], ['instruction', 'instruction', 'observation']);
});
