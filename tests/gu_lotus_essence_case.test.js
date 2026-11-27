// Atlas pilot B3: the Heavenly Essence Treasure Monarch Lotus case, one rung of the evidence ladder per test group.
import test from 'node:test';
import assert from 'node:assert/strict';
import {runCase, runCaseData} from '../scripts/case_runner.mjs';
import {assemble} from '../src/procedural_grammar.js';
import {guEffects} from '../src/world_packs/gu_effect_pack.js';
import {LOTUS_AMOUNT, LOTUS_CASE_ID, LOTUS_CASE_MODULE, LOTUS_SENTENCE, coverageCase} from '../src/world_packs/gu_lotus_essence_case.js';
import {effectsWorkshopRun as workshop} from '../src/world_packs/effects_workshop.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {serializeEngineWorld} from '../src/engine_world.js';
import {DEFAULT_ENTRY, reachableFrom} from '../scripts/reachable.mjs';

const row = {id: LOTUS_CASE_ID, state: 'catalogued', case: {module: LOTUS_CASE_MODULE, id: LOTUS_CASE_ID}};

test('rung 1, case success: the case is plain data and the world changes as expect says', async () => {
    const data = coverageCase(LOTUS_CASE_ID);
    assert.deepEqual(JSON.parse(JSON.stringify(data)), data);
    assert.equal(data.basis, 'authored');
    const out = await runCase(row, {reachable: new Set()});
    assert.deepEqual([out.state, out.basis, out.confidence], ['expressed-authored', 'authored', null]);
    assert.throws(() => coverageCase('gu:other'), /no coverage scene/);
});

test('the Gu grammar accepts the sentence and lowers it to the primeval essence pool', () => {
    const built = assemble(guEffects, LOTUS_SENTENCE);
    assert.deepEqual(built.receipt.violations, []);
    assert.deepEqual(built.value.derived.acts, [{verb: 'add', object: 'energy:primeval'}]);
});

test('near misses: the wiki-tier heal guess does not meet the essence expectation and a missing pool key is refused', async () => {
    const heal = coverageCase(LOTUS_CASE_ID);
    heal.sentence = {...heal.sentence, object: 'vitality', target: 'touched'};
    heal.world.holders[1].quantities.vitality = 1;
    heal.engine.shared.quantities.push(WORLD_QUANTITIES.vitality);
    assert.equal((await runCaseData(heal, {id: 'heal'})).state, 'blocked:runner-expect-mismatch');
    const unkeyed = coverageCase(LOTUS_CASE_ID);
    unkeyed.keys = {};
    assert.match((await runCaseData(unkeyed, {id: 'unkeyed'})).state, /^blocked:runner-needs$/);
});

test('rung 2, module reachability: the case module is reachable from src/main.js through the effects workshop', async () => {
    const root = new URL('..', import.meta.url).pathname;
    assert.equal(reachableFrom(DEFAULT_ENTRY).has(root + LOTUS_CASE_MODULE), true);
    assert.deepEqual((await runCase(row)).state, 'runs-authored');
});

test('the workshop act lands the same sentence on the adept and survives a restore (engine only, not a game save)', () => {
    const acted = workshop.act(workshop.create(), 'lotus');
    const view = workshop.view(acted);
    assert.match(view.result, new RegExp(`own pool rose by ${LOTUS_AMOUNT} of ${LOTUS_AMOUNT} motes`));
    assert.deepEqual(serializeEngineWorld(workshop.restore(JSON.parse(JSON.stringify(serializeEngineWorld(acted))))), serializeEngineWorld(acted));
});
