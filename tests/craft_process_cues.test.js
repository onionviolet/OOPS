import test from 'node:test';
import assert from 'node:assert/strict';
import {
    projectProcessCues, projectOriginalProcessCues, diagnoseProcess, quoteProcessRescue, applyProcessRescue,
    createProcessRecord, recordProcessStep, demonstrateProcessMethod, planProcessRepeat,
    processShouldStop, PROCESS_RECEIPT_LIMIT, PROCESS_METHOD_LIMIT,
} from '../src/craft_process_cues.js';
import {THERMAL_REVISION, quoteThermalBatch, createThermalState, advanceThermal, stopThermal} from '../src/craft_process_thermal.js';
import {defineSeparationLaw, quoteSeparation, separateProcessBatch, processConstituentMass} from '../src/craft_process_separation.js';

const source = {status: 'ORIGINAL', locator: 'synthetic cue law v1'};
const means = {senses: ['sight', 'smell'], instruments: ['pressure'], skills: {observation: 10}};
test('all six channels require real means; projection excludes causes and unmeasured absence', () => {
    const readings = {smell: 'sharp', color: 'amber', bubbling: 'gentle', texture: 'cloudy', pressure: 'rising', powerFlow: 'pulsing', secret: 'synthetic-private'};
    const before = structuredClone(readings);
    assert.deepEqual(projectProcessCues({readings}), []);
    const plain = projectProcessCues({readings, means});
    assert.equal(plain.length, 5);
    assert.equal(projectProcessCues({readings, means: {...means, senses: [...means.senses, 'power']}}).length, 6);
    assert.ok(!JSON.stringify(plain).includes('synthetic-private'));
    assert.deepEqual(readings, before);
    assert.deepEqual(projectProcessCues({readings: {color: 'unknown', pressure: null}, means}), []);
    assert.equal(projectProcessCues({readings, means, reference: plain})[0].comparison, 'matches the demonstration');
});
test('one observation supports multiple known diagnoses without determining truth or granting knowledge', () => {
    const cues = projectProcessCues({readings: {texture: 'cloudy'}, means});
    const rules = ['suspended grains', 'a new precipitate'].map((explanation, index) => ({id: String(index), explanation, source, when: [{id: 'texture', impression: 'cloudy'}]}));
    const before = structuredClone(rules);
    assert.equal(diagnoseProcess(cues, rules).length, 2);
    assert.deepEqual(diagnoseProcess(cues, []), []);
    assert.ok(diagnoseProcess(cues, rules).every(row => row.certainty === 'possible cause'));
    assert.deepEqual(rules, before);
    assert.deepEqual(diagnoseProcess(cues, [{...rules[0], source: null}]), []);
});
test('original pilot observes actual thermal residence and particle phases without exposing identity', () => {
    const base = {thermal: {temperature: 60, extractionSeconds: 70, degradationSeconds: 0},
        batch: {constituents: [{id: 'synthetic-private', phase: 'suspended', amount: 2}]}, means};
    const cues = projectOriginalProcessCues(base);
    assert.deepEqual(cues.map(cue => cue.impression), ['herbal', 'amber', 'gentle', 'cloudy']);
    assert.ok(!JSON.stringify(cues).includes('synthetic-private'));
    const changed = projectOriginalProcessCues({...base, thermal: {...base.thermal, temperature: 90, degradationSeconds: 2}});
    assert.deepEqual(changed.slice(0, 3).map(cue => cue.impression), ['scorched', 'dark', 'vigorous']);
    assert.deepEqual(projectOriginalProcessCues({...base, means: {}}), []);
    assert.equal(cues.some(cue => ['pressure', 'powerFlow'].includes(cue.id)), false);
});

// Synthetic delegated law only. Real thermal/separation equations stay in their
// owning modules; integration supplies adapters. This law preserves active mass.
const current = {revision: 2, active: 8, volume: 4, completed: ['extracted'], lost: 2};
const handlers = {
    dilute: {
        quote: (state, action, maker) => maker.stock.water >= action.water && action.water > 0
            ? {ok: true, costs: {items: {water: action.water}, seconds: 1}} : {ok: false, reason: 'Not enough measured water.'},
        apply: (state, action) => ({ok: true, state: {...state, revision: state.revision + 1, volume: state.volume + action.water},
            destinations: [{kind: 'remaining', active: state.active, volume: state.volume + action.water}]}),
    },
};
test('rescue revalidates means, costs actual additions and changes remaining concentration without restoring losses', () => {
    const action = {kind: 'dilute', expectedRevision: 2, water: 4};
    const options = {handlers, means: {stock: {water: 4}}};
    const before = structuredClone(current);
    assert.equal(quoteProcessRescue(current, action, options).costs.items.water, 4);
    const result = applyProcessRescue(current, action, options);
    assert.equal(result.state.active / result.state.volume, 1);
    assert.equal(result.state.lost, 2);
    assert.deepEqual(result.state.completed, ['extracted']);
    assert.equal(result.destinations[0].active, 8);
    assert.deepEqual(current, before);
    assert.equal(applyProcessRescue(result.state, action, options).ok, false);
    assert.equal(applyProcessRescue(current, action, {...options, means: {stock: {water: 0}}}).ok, false);
});
test('supported verbs dispatch to their own laws; unsupported, costless and malformed results reject', () => {
    for(const kind of ['cool', 'settle', 'neutralize', 'split']) {
        let called = 0;
        const adapter = {quote: () => ({ok: true, costs: {seconds: 2}}), apply: state => {
            called++;
            return {ok: true, state: {...state, revision: state.revision + 1}, destinations: [{kind: 'remaining'}]};
        }};
        assert.equal(applyProcessRescue(current, {kind, expectedRevision: 2}, {handlers: {[kind]: adapter}}).ok, true);
        assert.equal(called, 1);
        assert.equal(quoteProcessRescue(current, {kind, expectedRevision: 2}).ok, false);
    }
    assert.equal(quoteProcessRescue(current, {kind: 'dilute', expectedRevision: 1}, {handlers}).ok, false);
    const handler = {quote: () => ({ok: true, costs: {seconds: 0}}), apply: () => assert.fail('must not apply')};
    assert.equal(applyProcessRescue(current, {kind: 'cool', expectedRevision: 2}, {handlers: {cool: handler}}).ok, false);
    assert.throws(() => applyProcessRescue(current, {kind: 'cool', expectedRevision: 2}, {handlers: {cool: {...handler, quote: () => ({ok: true, costs: {seconds: 1}}), apply: () => ({ok: true, state: current, destinations: []})}}}), /declare material destinations/);
});
test('even a mutating quote adapter cannot modify current truth or means', () => {
    const maker = {stock: {water: 3}};
    const state = structuredClone(current);
    const handler = {quote: (batch, action, actor) => {batch.active = 900; actor.stock.water = 0; return {ok: false};}, apply: () => {}};
    quoteProcessRescue(state, {kind: 'cool', expectedRevision: 2}, {handlers: {cool: handler}, means: maker});
    assert.deepEqual(state, current);
    assert.equal(maker.stock.water, 3);
});
test('cooling policy delegates real thermal law and retains irreversible history', () => {
    const law = {revision: THERMAL_REVISION, ambient: 20, extraction: {min: 45, max: 80, seconds: 30}, degradation: {above: 85, seconds: 20}};
    const quote = quoteThermalBatch({law, vessel: {capacity: 10, surfaceArea: 2, heatTransfer: 1, thermalMass: 4, containment: 0},
        load: {mass: 4, volume: 4, specificHeat: 2}, maker: {tools: ['brazier'], competence: 4, workCapacity: 10, fuelStock: 100,
            heater: {maxTemperature: 150, maxConductance: 10, fuelPerSecond: 0.1}},
        program: {targetTemperature: 100, sourceTemperature: 140, holdSeconds: 5, heaterTool: 'brazier'}});
    const hot = {revision: 5, thermal: advanceThermal(law, createThermalState(law, quote), 20)};
    const handler = {quote: () => ({ok: true, costs: {seconds: 10, work: 1}}), apply: state => ({ok: true,
        state: {...state, revision: state.revision + 1, thermal: advanceThermal(law, stopThermal(law, state.thermal), 10)},
        destinations: [{kind: 'remaining', volume: 4}]})};
    const cooled = applyProcessRescue(hot, {kind: 'cool', expectedRevision: 5}, {handlers: {cool: handler}}).state;
    assert.ok(cooled.thermal.temperature < hot.thermal.temperature);
    assert.ok(cooled.thermal.degradationSeconds >= hot.thermal.degradationSeconds);
    assert.equal(cooled.thermal.fuelSpent, hot.thermal.fuelSpent);
});
test('split policy delegates separation conservation and accounts every dose exactly once', () => {
    const law = defineSeparationLaw({id: 'original.test', revision: 1, constituents: {active: {}, grit: {particleSize: 10}},
        costs: Object.fromEntries(['strain', 'decant', 'skim', 'distill', 'divide'].map(op => [op, {secondsPerVolume: 1, workPerVolume: 1}])),
        filmRetainPermille: 0, filmReleasePerVolume: 1, cleanWaterPerAmount: 1, cleanWorkPerAmount: 1});
    const state = {revision: 1, batch: {volume: 7, constituents: [{id: 'active', phase: 'dissolved', amount: 17}, {id: 'grit', phase: 'settled', amount: 3}]},
        vessel: {id: 'pot', material: 'glass', capacity: 10, closure: 'open', meshSize: 5, thermalMass: 4, heatTransfer: 1, condenserPermille: 0, films: []}};
    const action = {kind: 'split', expectedRevision: 1, doses: 3};
    const handler = {quote: state => ({ok: true, costs: quoteSeparation(law, state.batch, {op: 'divide', doses: 3}, state.vessel).costs}),
        apply: state => {
            const split = separateProcessBatch(law, state.batch, {op: 'divide', doses: 3}, state.vessel);
            return {ok: true, state: {...state, revision: state.revision + 1, batch: split.residue, vessel: split.vessel},
                destinations: split.doses.map(batch => ({kind: 'dose', ...batch}))};
        }};
    const result = applyProcessRescue(state, action, {handlers: {split: handler}});
    assert.equal(result.destinations.reduce((sum, batch) => sum + processConstituentMass(batch), 0), processConstituentMass(state.batch));
    assert.equal(processConstituentMass(result.state.batch), 0);
    assert.equal(applyProcessRescue(result.state, action, {handlers: {split: handler}}).ok, false);
});

const policy = {kind: 'atCue', id: 'bubbling', impression: 'vigorous'};
const event = revision => ({revision, at: revision * 2, verb: 'stir', stage: 'extract', quantities: {work: 3},
    costs: {seconds: 2, work: 3}, conditions: {motion: 'clockwise'}, outcome: 'Mixed remaining liquid', decision: revision === 2,
    debugTrace: 'synthetic-private'});
const newRecord = () => createProcessRecord({law: 'original/pilot@1', apparatus: 'pot:small', stopPolicy: policy});
const requirements = {tools: ['paddle'], skills: {control: 2}, stock: {herb: 2}};
const result = {label: 'weaker usable extract', consumer: 'existing oral preparation'};
const maker = {apparatus: 'pot:small', tools: ['paddle'], skills: {control: 2}, stock: {herb: 2}, senses: ['sight']};
test('demonstrated method records actual order, quantities, apparatus, uncertainty and useful weaker result', () => {
    let record = newRecord();
    record = recordProcessStep(record, event(1));
    record = recordProcessStep(record, event(2));
    const method = demonstrateProcessMethod(record, {id: 'trial1', requirements, result});
    assert.deepEqual(method.steps.map(step => step.revision), [1, 2]);
    assert.equal(method.steps[0].quantities.work, 3);
    assert.equal(method.steps[0].uncertainty, 'untested tolerances');
    assert.equal(method.result.label, 'weaker usable extract');
    assert.ok(!JSON.stringify(method).includes('synthetic-private'));
    assert.throws(() => recordProcessStep(record, event(1)), /rewind/);
    assert.deepEqual(JSON.parse(JSON.stringify(method)), method);
});
test('modes execute identical work; guided/deep expose choices and actual helpers revalidate', () => {
    const record = recordProcessStep(recordProcessStep(newRecord(), event(1)), event(2));
    const method = demonstrateProcessMethod(record, {id: 'trial1', requirements, result});
    const plans = ['quick', 'guided', 'deep'].map(mode => planProcessRepeat(method, {mode, means: maker}));
    assert.deepEqual(plans[0].actions, plans[1].actions);
    assert.deepEqual(plans[1].actions, plans[2].actions);
    assert.deepEqual(plans.map(plan => plan.decisions), [[], [2], [1, 2]]);
    for(const bad of [{...maker, tools: []}, {...maker, stock: {herb: 1}}, {...maker, skills: {control: 1}}, {...maker, senses: []}])
        assert.equal(planProcessRepeat(method, {means: bad}).ok, false);
    assert.deepEqual(planProcessRepeat(method, {means: maker}), planProcessRepeat(method, {means: {...maker, actorId: 'helper'}}));
});
test('bounded receipt does not turn a truncated sequence into universal quick knowledge', () => {
    let record = newRecord();
    for(let index = 1; index <= PROCESS_METHOD_LIMIT + 2; index++) record = recordProcessStep(record, event(index));
    assert.equal(record.receipt.length, PROCESS_RECEIPT_LIMIT);
    assert.equal(record.steps.length, PROCESS_METHOD_LIMIT);
    assert.equal(record.omitted, PROCESS_METHOD_LIMIT + 2 - PROCESS_RECEIPT_LIMIT);
    assert.equal(record.overflow, true);
    assert.throws(() => demonstrateProcessMethod(record, {id: 'long', requirements, result}), /complete demonstrated sequence/);
});
test('stop policy uses known cue or absolute clock without draws, hidden causes or chunk count', () => {
    assert.equal(processShouldStop(policy, {at: 30, cues: []}), false);
    assert.equal(processShouldStop(policy, {at: 30, cues: [{id: 'bubbling', impression: 'vigorous'}]}), true);
    const deadline = {kind: 'atTime', at: 30};
    assert.equal(processShouldStop(deadline, {at: 29}), false);
    assert.equal(processShouldStop(deadline, {at: 30}), true);
    assert.equal(processShouldStop(deadline, {at: [10, 10, 10].reduce((a, b) => a + b)}), processShouldStop(deadline, {at: 30}));
    assert.throws(() => processShouldStop({kind: 'atCue', id: 'hiddenCause', impression: 'poison'}, {at: 0}), /observable cue/);
});
test('repeat shifts demonstrated steps and deadline to the new game clock without changing durations', () => {
    const record = recordProcessStep(createProcessRecord({law: 'original/pilot@1', apparatus: 'pot:small', at: 100, stopPolicy: {kind: 'atTime', at: 120}}), {...event(1), at: 105});
    const method = demonstrateProcessMethod(record, {id: 'timed', requirements, result});
    const plan = planProcessRepeat(method, {at: 1000, means: maker});
    assert.equal(plan.actions[0].at, 1005);
    assert.equal(plan.stopPolicy.at, 1020);
    assert.equal(method.steps[0].at, 105);
    assert.equal(planProcessRepeat(method, {at: 1000, means: maker, stopPolicy: {kind: 'atTime', at: 1010}}).stopPolicy.at, 1010);
});
test('demonstrated apparatus capabilities admit a fitting replacement and refuse inadequate scale', () => {
    const record = recordProcessStep(newRecord(), event(1));
    const method = demonstrateProcessMethod(record, {id: 'capability', requirements: {...requirements, apparatus: {capacity: 4, containment: 2}}, result});
    assert.equal(planProcessRepeat(method, {means: {...maker, apparatus: 'different-pot', apparatusCapabilities: {capacity: 10, containment: 2}}}).ok, true);
    assert.equal(planProcessRepeat(method, {means: {...maker, apparatusCapabilities: {capacity: 3, containment: 2}}}).ok, false);
    assert.equal(planProcessRepeat(method, {means: maker}).ok, false, 'apparatus name alone cannot establish its capabilities');
    assert.throws(() => demonstrateProcessMethod(record, {id: 'invalid', requirements: {...requirements, stock: {herb: -1}}, result}), /nonnegative/);
});
