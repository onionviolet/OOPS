import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createSlakeBenchStartContent, SLAKE_HEAT} from '../src/slake_bench_start_content.js';
import {createExpansionState, createContentRegistry, advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';
const hash = v => 'sha256:' + createHash('sha256').update(JSON.stringify(v)).digest('hex');
const loaf = name => JSON.stringify({id: 'slakebench.' + name});
function setup() {
    const raw = createSlakeBenchStartContent(), registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]}), compiled = compileStructuredPack(raw, registry);
    mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash: hash(raw), starts: raw.starts.map(b => ({...b, snapshotHash: hash(b)}))};
    const c = {registry, actorId: 'player', worldId: 'base.frontier', facts: {location: 'Village'}, external: {money: 10}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}},
        vitals: {player: {health: 10, max_health: 10, stamina: 10, max_stamina: 10}}, nativeBody: {form: 'human', lifeStage: 'adult', ownerId: 'player', controllerId: 'player'}, nativeAlive: true, nativeReady: true, busy: false};
    const selected = planStructuredSelection(createExpansionState(1), d, c), result = beginStructuredCampaign(selected.plan.state, d, c, null, selected.selection);
    return {registry, d, c, plan: result.plan, record: result.record};
}
const ctx = f => ({...f.c, worldId: 'slakebench.kitchen', structuredNative: {...f.record, bound: true}, facts: {location: f.plan.state.simulation.people.player.location}, nativeBody: f.plan.state.simulation.people.player.body,
    external: f.plan.external, gameplay: f.plan.gameplay, vitals: f.plan.vitals || f.c.vitals});
const preview = (f, id) => previewSimulationCommand(f.plan.state, f.registry, 'slakebench.' + id, ctx(f));
const act = (f, id) => {f.plan = commitSimulationCommand(f.plan.state, f.registry, {id: 'slakebench.' + id}, ctx(f), f.plan.state.sequence); return f.plan;};
const wait = (f, min) => {f.plan = advanceSimulation(f.plan.state, f.registry, min, f.plan.external, f.plan.gameplay, {player: ctx(f)}); return f.plan;};
const stock = (f, name) => f.plan.gameplay.player.inventory[loaf(name)] || 0;
const heat = f => f.plan.state.simulation.energies.player['slakebench.heat'];


test('reagents react by the craft law, bank heat, and the heat alone powers the press', () => {
    const f = setup();
    assert.equal(SLAKE_HEAT, 2, 'one measure each releases two units of heat under the law');
    assert.equal(heat(f).reserve, 0);
    assert.equal(preview(f, 'bake').eligible, false, 'a cold plate bakes nothing');
    assert.match(preview(f, 'bake').reasons.join(' '), /energy/i);
    act(f, 'slake');
    assert.equal(stock(f, 'quicklime'), 2); assert.equal(stock(f, 'water'), 2); assert.equal(stock(f, 'slaked_lime'), 1, 'mass is conserved into slaked lime');
    assert.equal(heat(f).reserve, SLAKE_HEAT);
    act(f, 'bake');
    assert.equal(stock(f, 'flatbread'), 1); assert.equal(stock(f, 'dough'), 5);
    assert.deepEqual([heat(f).reserve, heat(f).strain], [0, 1], 'baking spent the heat and strained the plate');
    assert.equal(preview(f, 'bake').eligible, false, 'the heat is spent');
});

test('strain limits back-to-back baking until the plate rests; reagents run out', () => {
    const f = setup();
    act(f, 'slake'); act(f, 'slake'); assert.equal(heat(f).reserve, 4);
    act(f, 'bake'); act(f, 'bake');
    assert.equal(heat(f).strain, 2);
    act(f, 'slake'); assert.equal(preview(f, 'bake').eligible, false, 'strain at the limit refuses a third bake');
    act(f, 'rest'); wait(f, 3); assert.equal(heat(f).strain, 0);
    assert.equal(preview(f, 'bake').eligible, true);
    assert.equal(preview(f, 'slake').eligible, false, 'three lumps are spent');
    f.plan.state = JSON.parse(JSON.stringify(f.plan.state));
    assert.equal(heat(f).reserve, 2, 'reserve survives reload');
});
