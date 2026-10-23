import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLanternLoanStartContent} from '../src/lantern_loan_start_content.js';
import {createExpansionState, createContentRegistry, advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';
const hash = v => 'sha256:' + createHash('sha256').update(JSON.stringify(v)).digest('hex');
const loaf = name => JSON.stringify({id: 'lanternloan.' + name});
function setup() {
    const raw = createLanternLoanStartContent(), registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]}), compiled = compileStructuredPack(raw, registry);
    mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash: hash(raw), starts: raw.starts.map(b => ({...b, snapshotHash: hash(b)}))};
    const c = {registry, actorId: 'player', worldId: 'base.frontier', facts: {location: 'Village'}, external: {money: 10}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}},
        vitals: {player: {health: 10, max_health: 10, stamina: 10, max_stamina: 10}}, nativeBody: {form: 'human', lifeStage: 'adult', ownerId: 'player', controllerId: 'player'}, nativeAlive: true, nativeReady: true, busy: false};
    const selected = planStructuredSelection(createExpansionState(1), d, c), result = beginStructuredCampaign(selected.plan.state, d, c, null, selected.selection);
    return {registry, d, c, plan: result.plan, record: result.record};
}
const ctx = f => ({...f.c, worldId: 'lanternloan.cellar', structuredNative: {...f.record, bound: true}, facts: {location: f.plan.state.simulation.people.player.location}, nativeBody: f.plan.state.simulation.people.player.body,
    external: f.plan.external, gameplay: f.plan.gameplay, vitals: f.plan.vitals || f.c.vitals});
const preview = (f, id) => previewSimulationCommand(f.plan.state, f.registry, 'lanternloan.' + id, ctx(f));
const act = (f, id) => {f.plan = commitSimulationCommand(f.plan.state, f.registry, {id: 'lanternloan.' + id}, ctx(f), f.plan.state.sequence); return f.plan;};
const wait = (f, min) => {f.plan = advanceSimulation(f.plan.state, f.registry, min, f.plan.external, f.plan.gameplay, {player: ctx(f)}); return f.plan;};
const stock = (f, name) => f.plan.gameplay.player.inventory[loaf(name)] || 0;

const oil = f => f.plan.gameplay.player.inventory[loaf('oil')] || 0;
test('a borrowed power runs on two measures, burns the keeper’s oil per use and refits only while oil is held', () => {
    const f = setup();
    assert.equal(f.plan.state.actors.player.resources['lanternloan.measures.charges'], 2);
    assert.equal(preview(f, 'measures.recharge').eligible, false, 'a loan with charges left does not refit');
    act(f, 'see'); act(f, 'see');
    assert.equal(oil(f), 1, 'each look burned a measure of oil');
    assert.equal(preview(f, 'see').eligible, false, 'both measures spent');
    assert.equal(preview(f, 'measures.recharge').eligible, true, 'oil in hand allows the refit');
    act(f, 'measures.recharge');
    assert.equal(preview(f, 'see').eligible, true);
    act(f, 'see'); assert.equal(oil(f), 0);
    assert.equal(f.plan.state.actors.player.resources['lanternloan.measures.charges'], 1);
    f.plan.state = JSON.parse(JSON.stringify(f.plan.state));
    assert.equal(f.plan.state.actors.player.resources['lanternloan.measures.charges'], 1, 'charges survive reload');
});

test('a concealed borrowed gift shows in the description only when an observer could see it', async () => {
    const {characterBioView} = await import('../src/character_bio.js');
    const f = setup(), args = {state: f.plan.state, registry: f.registry, context: ctx(f)};
    assert.equal(characterBioView(args).description.find(r => r.id === 'look.bearing'), undefined, 'hidden from the unobserved view');
    const seen = characterBioView({...args, reveal: ['lanternloan.loan']}).description.find(r => r.id === 'look.bearing');
    assert.match(seen.detail, /keeper’s mark/);
});
