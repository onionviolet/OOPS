import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createWarmHandStartContent} from '../src/warm_hand_start_content.js';
import {createExpansionState, createContentRegistry, advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';
const hash = v => 'sha256:' + createHash('sha256').update(JSON.stringify(v)).digest('hex');
const loaf = name => JSON.stringify({id: 'warmhand.' + name});
function setup() {
    const raw = createWarmHandStartContent(), registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]}), compiled = compileStructuredPack(raw, registry);
    mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash: hash(raw), starts: raw.starts.map(b => ({...b, snapshotHash: hash(b)}))};
    const c = {registry, actorId: 'player', worldId: 'base.frontier', facts: {location: 'Village'}, external: {money: 10}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}},
        vitals: {player: {health: 10, max_health: 10, stamina: 10, max_stamina: 10}}, nativeBody: {form: 'human', lifeStage: 'adult', ownerId: 'player', controllerId: 'player'}, nativeAlive: true, nativeReady: true, busy: false};
    const selected = planStructuredSelection(createExpansionState(1), d, c), result = beginStructuredCampaign(selected.plan.state, d, c, null, selected.selection);
    return {registry, d, c, plan: result.plan, record: result.record};
}
const ctx = f => ({...f.c, worldId: 'warmhand.kitchen', structuredNative: {...f.record, bound: true}, facts: {location: f.plan.state.simulation.people.player.location}, nativeBody: f.plan.state.simulation.people.player.body,
    external: f.plan.external, gameplay: f.plan.gameplay, vitals: f.plan.vitals || f.c.vitals});
const preview = (f, id) => previewSimulationCommand(f.plan.state, f.registry, 'warmhand.' + id, ctx(f));
const act = (f, id) => {f.plan = commitSimulationCommand(f.plan.state, f.registry, {id: 'warmhand.' + id}, ctx(f), f.plan.state.sequence); return f.plan;};
const wait = (f, min) => {f.plan = advanceSimulation(f.plan.state, f.registry, min, f.plan.external, f.plan.gameplay, {player: ctx(f)}); return f.plan;};
const stock = (f, name) => f.plan.gameplay.player.inventory[loaf(name)] || 0;

test('the innate gift works from the first minute, costs the holder’s own stamina and needs a rest between warmings', () => {
    const f = setup();
    assert.equal(f.plan.state.actors.player.sources['warmhand.gift'].origin, 'inherited');
    assert.equal(preview(f, 'warm').eligible, true);
    act(f, 'warm');
    assert.equal(f.plan.vitals.player.stamina, 6, 'the warming cost four stamina');
    assert.equal(stock(f, 'cold_loaf'), 5); assert.equal(stock(f, 'warm_loaf'), 1);
    assert.equal(preview(f, 'warm').eligible, false, 'a short rest is required between warmings');
    assert.match(preview(f, 'warm').reasons.join(' '), /recovers/);
    wait(f, 20); assert.equal(preview(f, 'warm').eligible, true);
});

test('practice raises mastery, which unlocks the batch warming; it can be queued, and the choice survives reload', () => {
    const f = setup();
    assert.equal(preview(f, 'warm_batch').eligible, false, 'a batch needs steady hands first');
    for(let i = 0; i < 2; i++) {act(f, 'practice'); wait(f, 3);}
    assert.equal(f.plan.state.simulation.powers.player['warmhand.warming'].mastery, 2);
    assert.equal(preview(f, 'warm_batch').eligible, true, 'two steps of mastery unlock the batch');
    act(f, 'warm_batch');
    assert.equal(stock(f, 'warm_loaf'), 3);
    assert.equal(stock(f, 'cold_loaf'), 3);
    f.plan.state = JSON.parse(JSON.stringify(f.plan.state));
    assert.equal(f.plan.state.simulation.powers.player['warmhand.warming'].mastery, 2);
});

test('the power refuses without loaves, and nothing is warmed for free', () => {
    const f = setup();
    for(let i = 0; i < 6; i++) {act(f, 'warm'); wait(f, 20);}
    assert.equal(stock(f, 'cold_loaf'), 0);
    assert.equal(preview(f, 'warm').eligible, false);
});

test('three steps of mastery halve the stamina price of a warming', () => {
    const f = setup();
    for(let i = 0; i < 3; i++) {act(f, 'practice'); wait(f, 3);}
    wait(f, 20); act(f, 'warm');
    assert.equal(10 - f.plan.vitals.player.stamina, 2, 'full stamina 10 minus the halved price');
});
