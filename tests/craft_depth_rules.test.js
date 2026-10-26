import test from 'node:test';
import assert from 'node:assert/strict';
import {frontierCatalogue as cat, frontierBrewLaw as law} from '../src/craft_content_frontier.js';
import {resolveBatch} from '../src/craft_resolver.js';
import {generateMaterial} from '../src/craft_materials.js';
import {defineDoseRules, cancelOutputs, deriveProductName, createDoseState, applyDose, validateDoseState} from '../src/craft_dose_rules.js';
import {createExperimentLog, recordTrial, deduce, propertyView, validateExperimentLog, compareTrials, compareTrialSetups} from '../src/craft_experiment_log.js';

const rules = defineDoseRules({id: 'frontier.dose', revision: 1,
    pairs: [{a: 'health', b: 'poison', permille: 800, reason: 'Sap soothes what the bitter toxin burns, but not all of it.'}],
    tolerance: [{effect: 'stamina', perDose: 40, decayPerDay: 25, overdoseAt: 100, harm: {effect: 'poison', per: 2}, reason: 'The body stops answering oil and starts shaking.'}],
    names: {health: 'restorative', stamina: 'bracing', poison: 'bitter'}});
const water = cat.materials['Spring water'], chalk = cat.materials['Lime chalk'];

test('effect cancel: opposite pair cancels by its dial and names follow what remains', () => {
    const r = cancelOutputs(rules, {oral: {health: 100, poison: 40}});
    assert.deepEqual(r.outputs, {oral: {health: 68, poison: 8}});
    assert.deepEqual(r.cancelled, [{route: 'oral', a: 'health', b: 'poison', amount: 32}]);
    assert.equal(deriveProductName(rules, {carrier: 'Herbal vial', outputs: {oral: {health: 100, poison: 40}}}), 'Tempered restorative bitter herbal vial');
    assert.equal(deriveProductName(rules, {carrier: 'Herbal vial', outputs: {oral: {stamina: 5}}}), 'Bracing herbal vial');
    const full = defineDoseRules({id: 'x', revision: 1, pairs: [{a: 'health', b: 'poison', reason: 'r'}]});
    assert.deepEqual(cancelOutputs(full, {oral: {health: 10, poison: 10}}).outputs, {});
});

test('names show only what the observer has seen', () => {
    const p = {carrier: 'Herbal vial', outputs: {oral: {health: 100, poison: 40}}};
    assert.equal(deriveProductName(rules, p, {known: new Set()}), 'Unidentified herbal vial');
    assert.equal(deriveProductName(rules, p, {known: new Set(['oral.health'])}), 'Restorative herbal vial');
});

test('tolerance dulls repeat doses, decays by day, and overdose is a cost not a refusal', () => {
    let s = createDoseState();
    const a = applyDose(rules, s, 'stamina', 1, 0); s = a.state;
    assert.equal(a.effective, 1);
    const big = applyDose(rules, s, 'stamina', 3, 10);
    assert.equal(big.effective, Math.floor(3 * 1000 / 1040));
    assert.deepEqual(big.overdose && [big.overdose.effect, big.overdose.amount], ['poison', (40 + 120 - 100) * 2]);
    const later = applyDose(rules, big.state, 'stamina', 1, 10 + 1440 * 10);
    assert.equal(later.effective, 1); assert.equal(later.overdose, null);
    assert.equal(applyDose(rules, s, 'health', 5, 0).effective, 5);
    assert.deepEqual(validateDoseState(rules, JSON.parse(JSON.stringify(big.state))), big.state);
    assert.throws(() => applyDose(rules, big.state, 'stamina', 1, 5), /back in time/);
});

test('experiment log: deduction names likely sources, labels masking, survives reload', () => {
    let log = createExperimentLog();
    log = recordTrial(log, {materials: ['reed', 'water'], seen: ['oral.health'], at: 1});
    assert.deepEqual(deduce(log).filter(r => r.material === 'reed').map(r => r.status), ['possible']);
    log = recordTrial(log, {materials: ['water'], seen: [], at: 2});
    const d = deduce(log);
    assert.equal(d.find(r => r.material === 'reed' && r.effect === 'oral.health').status, 'likely');
    log = recordTrial(log, {materials: ['reed', 'root'], seen: [], at: 3});
    assert.equal(deduce(log).find(r => r.material === 'reed').status, 'unlikely');
    const back = validateExperimentLog(JSON.parse(JSON.stringify(log)));
    assert.deepEqual(deduce(back), deduce(log));
    assert.equal(log.entries.length, 3);
});

test('property view separates unknown from known-none and keeps hidden axes out', () => {
    const view = propertyView(cat, chalk, ['axis:ash', 'none:restore']);
    const by = Object.fromEntries(view.map(v => [v.axis, v.state]));
    assert.deepEqual(by, {restore: 'known-none', vigor: 'unknown', toxin: 'unknown', ash: 'known', hardness: 'unknown'});
    assert.equal(view.find(v => v.axis === 'ash').value, 250);
    assert.ok(!('glow' in by));
});

test('cancel table acts on a real resolved batch', () => {
    const r = resolveBatch(law, {inputs: [{material: water, qty: 1}], process: [{op: 'steep', level: 1}], stations: []});
    assert.deepEqual(cancelOutputs(rules, r.product.outputs).outputs, r.product.outputs);
});

test('live runtime: repeat drink overdoses and is validated, a solo drink teaches the ingredient, saves round-trip', async () => {
    const R = await import('../src/crafting_frontier_runtime.js');
    await import('../src/crafting_domain.js');
    const D = await import('../src/craft_depth_domain.js');
    const {domainRegistry} = await import('../src/domain_registry.js');
    const ctx = {blocked: '', world: 'base.frontier', location: 'Village', clock: 51000000, root: 123};
    const apply = (inv, plan) => { const n = {...inv}; for(const i of plan.items) { n[i.key] = (n[i.key] || 0) + i.amount; if(!n[i.key]) delete n[i.key]; } return n; };
    let owner = null, inv = {};
    for(let i = 0; i < 12; i++) { const p = R.stageCrafting(owner, inv, R.quoteCrafting(owner, inv, {type: 'harvest'}, {...ctx, clock: ctx.clock + i * 2000}), {...ctx, clock: ctx.clock + i * 2000}); owner = p.state; inv = apply(inv, p); }
    const reed = Object.keys(inv).find(k => (R.materialFromKey(k, owner).material.properties.restore ?? 0) > 0);
    assert.ok(reed, 'gathered a restorative herb');
    const brew = (clock) => { const c = {...ctx, clock}; const p = R.stageCrafting(owner, inv, R.quoteCrafting(owner, inv, {type: 'craft', inputs: [{key: reed, qty: 1}]}, c), c); owner = p.state; inv = apply(inv, p); return p.items.find(i => i.amount > 0).key; };
    const drink = (key, clock, depth) => { const c = {...ctx, clock}; const p = R.stageCrafting(owner, inv, R.quoteCrafting(owner, inv, {type: 'use', key}, c), c, depth); owner = p.state; inv = apply(inv, p); return p; };
    const k1 = brew(ctx.clock + 30000), k2 = brew(ctx.clock + 30001);
    const first = drink(k1, ctx.clock + 30010, R.freshDepth());
    const subject = R.materialFromKey(reed, owner).material.id;
    assert.ok(owner.knowledge.player[subject].facts.includes('axis:restore'), 'solo drink taught the axis');
    const second = drink(k2, ctx.clock + 30020, first.depth);
    assert.ok(second.depth.log.entries.length === 2 && second.effect.craftExposure.scales?.health < 1000, 'tolerance dulled the second dose');
    assert.ok(second.overdose && second.overdose.craftExposure.overdose > (first.overdose?.craftExposure.overdose ?? 0), 'second dose inside a day overdoses harder');
    R.validateCraftedExposure(second.overdose, owner.products[second.overdose.craftExposure.product], R.OVERDOSE_ID);
    R.validateCraftedExposure(second.effect, owner.products[second.effect.craftExposure.product]);
    R.validateCraftedExposure(craftedLegacy(R, owner, second), owner.products[second.effect.craftExposure.product]);
    D.setDepthOwner(second.depth);
    const saved = domainRegistry.save({});
    assert.equal(saved.craftDepth.family, 'craft.depth@1');
    D.setDepthOwner(null); domainRegistry.validate(saved); domainRegistry.load(saved);
    assert.deepEqual(D.depthOwner(), second.depth);
    assert.equal(D.depthView(ctx.clock + 30020, owner).deductions.length > 0, true);
    domainRegistry.load({}); assert.equal(domainRegistry.save({}).craftDepth, undefined);
});
function craftedLegacy(R, owner, plan) { return R.craftedExposure(owner.products[plan.effect.craftExposure.product], plan.effect.craftExposure.appliedAt, null, 1); }

const knownSetup = () => ({revision: 1, law: law.ref, product: 'observed-product',
    inputs: [{key: 'herb-lot', material: 'herb', qty: 1}, {key: 'salt-lot', material: 'salt', qty: 1}],
    process: [['steep', 1]], conditions: {world: 'base.frontier', apparatus: 'bench', control: 10}});
const oralContext = level => ({route: 'oral', recipient: 'player-body', baseline: {tolerance: {health: level}}, confounders: level ? ['Known recipient tolerance'] : []});

test('retained trials preserve ordered amounts and observed conditions without filling historical gaps', () => {
    const setup = knownSetup(), observation = oralContext(0);
    const log = recordTrial(createExperimentLog(), {materials: ['herb', 'salt'], process: setup.process, seen: ['oral.health'], at: 1, setup, observation});
    setup.inputs[0].qty = 3; observation.baseline.tolerance.health = 100;
    assert.equal(log.entries[0].setup.inputs[0].qty, 1, 'committed evidence is copied');
    assert.equal(log.entries[0].observation.baseline.tolerance.health, 0);
    const reversed = structuredClone(log.entries[0]); reversed.setup.inputs.reverse();
    assert.ok(compareTrials(log.entries[0], reversed).changed.some(c => c.field === 'inputs'));
    assert.ok(compareTrialSetups(log.entries[0].setup, setup).changed.some(c => c.field === 'inputs'));
    const apparatus = knownSetup(); apparatus.conditions.apparatus = 'borrowed-cauldron';
    assert.ok(compareTrialSetups(knownSetup(), apparatus).changed.some(c => c.field === 'conditions.apparatus'));
    const legacy = recordTrial(createExperimentLog(), {materials: ['herb'], seen: [], at: 0}).entries[0];
    const before = structuredClone(legacy), comparison = compareTrials(legacy, log.entries[0]);
    assert.equal(comparison.sameKnownSetup, false);
    assert.ok(comparison.unknown.includes('inputs'));
    assert.deepEqual(legacy, before, 'comparison does not fabricate old quantities');
    assert.deepEqual(validateExperimentLog(JSON.parse(JSON.stringify(log))), log);
});

test('comparison preserves recipient and assay confounders instead of diagnosing ingredient absence', () => {
    let log = createExperimentLog();
    for(const [at, level, seen] of [[1, 0, ['oral.health']], [2, 100, []]]) log = recordTrial(log, {
        materials: ['herb', 'salt'], process: [['steep', 1]], seen, at, setup: knownSetup(), observation: oralContext(level)});
    const c = compareTrials(...log.entries);
    assert.equal(c.sameKnownSetup, true, 'production setup is unchanged');
    assert.ok(c.changed.some(row => row.field === 'observation.baseline'));
    assert.ok(c.confounders.includes('Recipient baseline changed'));
    assert.deepEqual(c.observed.notSeenAgain, ['oral.health']);
    assert.equal(deduce(log).find(row => row.material === 'herb').status, 'possible');
    const assay = recordTrial(log, {materials: ['salt'], seen: [], at: 3, setup: knownSetup(), observation: {route: 'assay', confounders: []}});
    const measured = compareTrials(log.entries[0], assay.entries[2]);
    assert.ok(measured.confounders.includes('Different observation routes'));
    assert.ok(measured.unknown.includes('observation.baseline'));
    assert.equal(deduce(assay).find(row => row.material === 'herb').status, 'possible', 'assay omission cannot strengthen an oral attribution');
});

test('new trial setup rejects unsupported revisions, invalid amounts and non-JSON observations', () => {
    const trial = {materials: ['herb'], seen: [], at: 0, setup: knownSetup()};
    trial.setup.inputs[0].qty = 0;
    assert.throws(() => recordTrial(createExperimentLog(), trial), /setup/);
    trial.setup = knownSetup(); trial.setup.revision = 2;
    assert.throws(() => recordTrial(createExperimentLog(), trial), /setup/);
    trial.setup = knownSetup(); trial.observation = {route: 'oral', baseline: {tolerance: NaN}};
    assert.throws(() => recordTrial(createExperimentLog(), trial), /observation/);
});
