import test from 'node:test';
import assert from 'node:assert/strict';
import {mistglassProfile as P, mistglassContent, mistglassEnergyPolicy, validateAdaptation, prepareEnrollment, prepareAdvance, previewTrial, prepareTrial, adaptationView} from '../src/absorb_p23/world_adaptation/index.js';

import {validateEnergyPolicy, energyCharge} from '../src/energy_resources.js';

const ctx = (clock = 0, extra = {}) => ({clock, optIn: true, methodKnown: true, worldId: P.worldId,
    instanceId: 'test.mistglass.instance', bodyId: 'native.player.body', bodyForm: 'human',
    ownerId: 'player', controllerId: 'player', alive: true, conditionIds: [P.exposureConditionId], ...extra});
const enrolled = () => prepareEnrollment(undefined, ctx()).state;
const clone = s => JSON.parse(JSON.stringify(s));
function charged() {return prepareAdvance(enrolled(), ctx(16), 0).state;}
function trial(roll = 0) {return prepareTrial(charged(), ctx(16), {reserve: 2000, doseKey: 'owned-lot-1', doseAvailable: true, roll}).state;}

test('absent family and unsupported worlds preserve old profiles', () => {
    assert.equal(validateAdaptation(undefined), undefined);
    assert.deepEqual(prepareAdvance(undefined, ctx(50), undefined), {expectedRevision: null, state: undefined, effects: []});
    assert.equal(adaptationView(undefined, ctx(), undefined), null);
    for (const worldId of ['frontier', 'fated-villain', 'mother-of-learning']) {
        assert.throws(() => prepareEnrollment(undefined, ctx(0, {worldId})), /world\/body/);
    }
});
test('enrollment is explicit, learned, body and instance bound', () => {
    assert.equal(mistglassContent.defaultEnabled, false);
    for (const extra of [{optIn: false}, {methodKnown: false}, {bodyForm: 'tree'}, {ownerId: 'other'}, {controllerId: 'other'}, {alive: false}]) {
        assert.throws(() => prepareEnrollment(undefined, ctx(0, extra)));
    }
    const p = prepareEnrollment(undefined, ctx());
    assert.equal(p.expectedRevision, null);
    assert.equal(p.effects[0].resourceId, P.resourceId);
    assert.throws(() => prepareEnrollment(p.state, ctx()), /Already enrolled/);
});
test('fractional idle exposure has no active-action requirement', () => {
    const s = enrolled(), before = clone(s);
    const p = prepareAdvance(s, ctx(1), 0);
    assert.equal(p.state.exposure, 125);
    assert.deepEqual(p.effects, [{kind: 'resource-credit', resourceId: P.resourceId, amount: 125}]);
    assert.equal(adaptationView(p.state, ctx(1), 125).reserve, 0.125);
    assert.deepEqual(s, before);
});
test('chunking exposure agrees and full pool cannot bank hidden overflow', () => {
    let s = enrolled(), reserve = 0;
    for (let t = 1; t <= 16; t++) {
        const p = prepareAdvance(s, ctx(t), reserve); s = p.state;
        reserve += p.effects[0]?.amount ?? 0;
    }
    assert.deepEqual(s.exposure, charged().exposure);
    const capped = prepareAdvance(s, ctx(200), 9900);
    assert.equal(capped.effects[0].amount, 100);
    assert.equal(prepareAdvance(capped.state, ctx(201), 10000).effects.length, 0);
});
test('world, instance, body, life, controller and condition controls discard ineligible time', () => {
    for (const extra of [{worldId: 'frontier'}, {instanceId: 'other'}, {bodyId: 'other'}, {bodyForm: 'tree'}, {alive: false}, {controllerId: 'other'}, {ownerId: 'other'}, {conditionIds: []}, {conditionIds: [P.exposureConditionId, P.blockedConditionId]}]) {
        const p = prepareAdvance(enrolled(), ctx(16, extra), 0);
        assert.equal(p.state.exposure, 0);
        assert.equal(p.effects.length, 0);
        assert.equal(prepareAdvance(p.state, ctx(17), 0).state.exposure, 125);
    }
});
test('clock replay pays nothing and backwards clock rejects without mutation', () => {
    const s = charged(), before = clone(s);
    assert.deepEqual(prepareAdvance(s, ctx(16), 2000).effects, []);
    assert.throws(() => prepareAdvance(s, ctx(15), 2000), /backwards/);
    assert.deepEqual(s, before);
});
test('preview spells out payment, reward, timed risk and no hidden draw', () => {
    const p = previewTrial(charged(), ctx(16), 2000, true);
    assert.equal(p.eligible, true); assert.equal(p.successPercent, 75);
    assert.equal(p.cost.amount, 2000); assert.equal(p.reward.skillId, 'Meditation');
    assert.match(p.risk, /25% failure/); assert.match(p.risk, /six played minutes/);
    assert.equal('roll' in p, false);
});
test('start needs actual custody, resource, stable body, clock and valid native RNG', () => {
    const s = charged(), before = clone(s);
    for (const extra of [{reserve: 1999}, {doseAvailable: false}, {doseKey: ''}, {roll: -1}, {roll: 10000}, {roll: NaN}]) {
        assert.throws(() => prepareTrial(s, ctx(16), {reserve: 2000, doseAvailable: true, doseKey: 'lot', roll: 0, ...extra}));
    }
    assert.throws(() => prepareTrial(s, ctx(17), {reserve: 2000, doseAvailable: true, doseKey: 'lot', roll: 0}), /Advance/);
    assert.deepEqual(s, before);
});
test('start plans one exact-copy consumption and resource debit without mutating input', () => {
    const s = charged(), before = clone(s);
    const p = prepareTrial(s, ctx(16), {reserve: 2000, doseKey: 'lot-2', doseAvailable: true, roll: 7499});
    assert.deepEqual(p.effects, [{kind: 'native-consume-item', itemId: P.doseItemId, copyOrLotKey: 'lot-2', count: 1}, {kind: 'resource-debit', resourceId: P.resourceId, amount: 2000}]);
    assert.equal(p.expectedReserve, 2000); assert.equal(p.expectedRevision, s.revision);
    assert.equal(p.state.pending.dueAt, 28); assert.equal(p.state.pending.roll, 7499);
    assert.deepEqual(s, before);
    assert.equal(previewTrial(p.state, ctx(16), 5000, true).eligible, false);
});
test('pending trial survives exact JSON export/import and settles once at saved deadline', () => {
    let s = clone(trial(7499));
    validateAdaptation(s);
    const pending = prepareAdvance(s, ctx(27), 0);
    assert.ok(pending.state.pending); assert.equal(pending.effects.some(e => e.kind === 'native-skill-xp'), false);
    s = clone(pending.state);
    const p = prepareAdvance(s, ctx(28), 1375);
    assert.equal(p.state.last.outcome, 'success');
    assert.deepEqual(p.effects.find(e => e.kind === 'native-skill-xp'), {kind: 'native-skill-xp', eventId: 'p23.mistglass.trial.1', skillId: 'Meditation', amount: 30});
    const restored = clone(p.state); validateAdaptation(restored);
    assert.deepEqual(restored, p.state);
    assert.equal(prepareAdvance(restored, ctx(29), 1500).effects.some(e => e.kind === 'native-skill-xp'), false);
});
test('failure boundary pays no XP and emits a native temporary condition', () => {
    const p = prepareAdvance(trial(7500), ctx(28), 0);
    assert.equal(p.state.last.outcome, 'failure'); assert.equal(p.state.failed, 1);
    assert.deepEqual(p.effects.find(e => e.kind === 'native-condition'), {kind: 'native-condition', eventId: 'p23.mistglass.trial.1', conditionId: P.blockedConditionId, startsAt: 28, expiresAt: 34});
    assert.equal(p.effects.some(e => e.kind === 'native-skill-xp'), false);
    const blocked = prepareAdvance(p.state, ctx(34, {conditionIds: [P.exposureConditionId, P.blockedConditionId]}), 1500);
    assert.equal(blocked.effects.length, 0);
    assert.equal(previewTrial(blocked.state, ctx(34), 2000, true).eligible, true);
    assert.deepEqual(clone(p.state), p.state);
});
test('boundary splitting prevents large ticks from bypassing failure rawness', () => {
    assert.throws(() => prepareAdvance(trial(9999), ctx(40), 0), /Split/);
});
test('leaving original world or body interrupts at the boundary with no refund', () => {
    for (const extra of [{worldId: 'frontier'}, {bodyId: 'replacement'}, {alive: false}]) {
        const s = trial(), p = prepareAdvance(s, ctx(16, extra), 0);
        assert.equal(p.state.last.reason, 'interrupted'); assert.equal(p.state.last.at, 16);
        assert.equal(p.state.pending, null); assert.equal(p.state.failed, 1);
        assert.equal(p.effects.some(e => e.kind === 'resource-credit'), false);
        assert.equal(prepareAdvance(p.state, ctx(17, extra), 0).effects.length, 0);
    }
});
test('repeat paid trials use real occurrence IDs without lifetime once flags', () => {
    let s = prepareAdvance(trial(), ctx(28), 0).state;
    const p = prepareTrial(s, ctx(28), {reserve: 2000, doseAvailable: true, doseKey: 'second-lot', roll: 0});
    assert.equal(p.state.pending.id, 2); assert.equal(p.effects.length, 2);
    s = prepareAdvance(p.state, ctx(40), 0).state;
    assert.equal(s.last.id, 2); assert.equal(s.succeeded, 2); validateAdaptation(clone(s));
});
test('projection obeys known-only and Effects-off without changing progression', () => {
    const s = trial(1234), before = clone(s);
    assert.equal(adaptationView(s, ctx(16, {methodKnown: false}), 0), null);
    assert.equal(JSON.stringify(adaptationView(s, ctx(16), 0)).includes('1234'), false);
    const done = prepareAdvance(s, ctx(28), 0).state;
    assert.equal(adaptationView(done, ctx(28, {effectsEnabled: false}), 1500).cue, null);
    assert.equal(adaptationView(done, ctx(28, {effectsEnabled: true}), 1500).cue, 'success');
    assert.deepEqual(s, before);
});
test('strict optional-family validation rejects malformed imports before mutations', () => {
    const valid = trial();
    const bad = [null, [], {...valid, schema: 2}, {...valid, profileId: 'canon-name'}, {...valid, surprise: true}, {...valid, clock: Infinity}, {...valid, exposure: -1}, {...valid, started: 9}, {...valid, bodyId: ''}, {...valid, pending: {...valid.pending, dueAt: 99}}, {...valid, pending: {...valid.pending, roll: 10000}}, {...valid, clock: 28}];
    for (const s of bad) assert.throws(() => validateAdaptation(s));
    const settled = prepareAdvance(valid, ctx(28), 0).state;
    assert.throws(() => validateAdaptation({...settled, last: null}));
    assert.throws(() => validateAdaptation({...settled, last: {...settled.last, outcome: 'failure'}}));
    assert.deepEqual(valid, clone(valid));
});
test('resource bounds and finite clocks reject unsafe numeric state', () => {
    for (const reserve of [-1, 0.5, 10001, Infinity]) assert.throws(() => prepareAdvance(enrolled(), ctx(1), reserve));
    for (const clock of [-1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => prepareAdvance(enrolled(), ctx(clock), 0));
    assert.equal(prepareAdvance(enrolled(), ctx(Number.MAX_SAFE_INTEGER), 0).state.exposure, P.capacity);
});

test('authored subunit policy fits native integer energy validation and charge', () => {
    validateEnergyPolicy(mistglassEnergyPolicy);
    assert.equal(energyCharge(mistglassEnergyPolicy, {output: P.trialCost}), 2000);
    assert.equal(adaptationView(enrolled(), ctx(), 0).ratePerMinute, 0.125);
});
