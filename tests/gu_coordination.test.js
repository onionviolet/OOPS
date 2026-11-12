import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {guCoordinationTrial as raw} from '../src/world_packs/book_gu_coordination.js';
import {coordinationActors, coordinationEnergy, coordinationId, coordinationHall} from '../src/gu_coordination_trial.js';
import {createContentRegistry, createExpansionState, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {beginStructuredCampaign, planStructuredSelection} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {requireStructuredContent, validateStructuredEnvelope} from '../src/structured_pack_state.js';

const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
const id = name => `${coordinationId}.${name}`;

test('the native synchronized formation leaves three real reserves unchanged on a short draw', () => {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(raw, registry);
    mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash: hash(raw), starts: raw.starts.map(row => ({...row, snapshotHash: hash(row)}))};
    const base = createExpansionState(717);
    const context = {registry, actorId: 'player', worldId: 'base.frontier', nativeAlive: true, nativeReady: true,
        busy: false, facts: {location: 'Village'}, external: {money: 0}, gameplay: {player: {inventory: {}}},
        nativeBody: {id: 'native.body', ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult'},
        vitals: {player: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}}, equipment: {player: {}}};
    const chosen = planStructuredSelection(base, d, context);
    const start = beginStructuredCampaign(chosen.plan.state, d, context, null, chosen.selection);
    let plan = start.plan;
    const act = name => {
        plan = commitSimulationCommand(plan.state, registry, {id: id(name)}, {...context, worldId: d.world.id,
            facts: {location: plan.state.simulation.people.player.location}, gameplay: plan.gameplay, external: plan.external,
            nativeBody: plan.state.simulation.people.player.body, structuredNative: {...start.record, bound: true}});
    };
    const reserves = () => coordinationActors.map(({id}) => plan.state.simulation.energies[id][coordinationEnergy].reserve);
    const latest = () => plan.state.simulation.knowledge.player[id('result')].value;
    assert.deepEqual(reserves(), [13, 12, 11]);
    act('cue');
    const pending = JSON.parse(JSON.stringify(plan.state));
    plan.state = loadExpansionState(pending, registry);
    act('merge');
    assert.deepEqual(reserves(), [12, 12, 11]);
    assert.match(latest(), /missed the shared beat/);
    assert.throws(() => act('lift'));

    act('recover_0'); act('recover_2');
    act('cue');
    act('merge');
    assert.deepEqual(reserves(), [0, 0, 1]);
    assert.match(latest(), /three heads and six arms/);
    act('lift');
    assert.equal(plan.nativePatch['current location'], id('yard'));
    const saved = {character: {bio: {race: 'human'}}, expansion: plan.state, 'current location': id('yard'),
        content_packs: {structured: start.record}};
    validateStructuredEnvelope(saved);
    requireStructuredContent(start.record, new Map([[d.id, d]]), plan.state);
    act('return');
    assert.equal(plan.state.simulation.people.player.location, coordinationHall);
});
