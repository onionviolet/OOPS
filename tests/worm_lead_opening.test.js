import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {requireStructuredContent, requireStructuredSelection} from '../src/structured_pack_state.js';
import {createStructuredNativeRegistration} from '../src/structured_native_registration.js';
import {createHash} from 'node:crypto';
import {wormLeadLife, wormLeadId as id} from '../src/world_packs/book_worm_lead_life.js';
import {createContentRegistry, createExpansionState, advanceSimulation, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand, commitSimulationCommand, cancelSimulationJob} from '../src/simulation.js';
const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
function begin(raw = wormLeadLife, admitted = null) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(raw, registry);
    mergeStructuredPack(compiled, registry);
    const definition = admitted || {...compiled.definition, contentHash: hash(raw),
        starts: raw.starts.map(s => ({...s, snapshotHash: hash(s)}))};
    const initial = {registry, actorId: 'player', worldId: 'base.frontier', nativeAlive: true, nativeReady: true, busy: false,
        nativeBody: {id: 'native.body', ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult'},
        facts: {location: 'Village'}, external: {money: 0},
        gameplay: {player: {inventory: {}, skills: {}, reputation: {}}},
        vitals: {player: {health: 60, max_health: 60, stamina: 40, max_stamina: 40}}, equipment: {player: {}}};
    const selection = planStructuredSelection(createExpansionState(717), definition, initial);
    const begun = beginStructuredCampaign(selection.plan.state, definition, initial, null, selection.selection);
    let plan = begun.plan;
    const context = name => {
        const player = plan.state.simulation.people.player;
        return {...initial, worldId: definition.world.id, nativeBody: player.body, facts: {location: player.location},
            external: plan.external, gameplay: plan.gameplay, vitals: plan.vitals || initial.vitals,
            targetId: registry.simulation.commands.get(id(name))?.targetId,
            structuredNative: {...begun.record, bound: true, bodyId: player.body.id}};
    };
    return {
        get state() {return plan.state;},
        get record() {return begun.record;},
        get location() {return plan.state.simulation.people.player.location;},
        get swarm() {return plan.state.simulation.people[id('insects')].location;},
        quote: name => previewSimulationCommand(plan.state, registry, id(name), context(name)),
        act(name) {plan = commitSimulationCommand(plan.state, registry, {id: id(name)}, context(name));},
        step(minutes = 1) {plan = advanceSimulation(plan.state, registry, minutes, plan.external, plan.gameplay,
            {player: {...context(), vitals: (plan.vitals || initial.vitals).player}});},
        cancel() {plan = cancelSimulationJob(plan.state, registry, plan.state.simulation.jobs[0].id, context());},
        reload() {plan.state = loadExpansionState(JSON.parse(JSON.stringify(plan.state)), registry);}
    };
}
test('Taylor chooses whether to clear the room; leaving cannot imply dispersal', () => {
    const run = begin();
    assert.equal(run.swarm, id('washroom'));
    run.act('leave'); run.step();
    assert.equal(run.location, id('corridor'));
    assert.equal(run.swarm, id('washroom'));
    assert.equal(run.state.simulation.completed?.[id('disperse')], undefined);
    run.reload();
    assert.equal(run.swarm, id('washroom'));
    run.act('return'); run.step();
    run.act('disperse'); run.step();
    assert.equal(run.swarm, id('outside'));
    run.act('leave'); run.step();
    assert.equal(run.location, id('corridor'));
    assert.equal(run.swarm, id('outside'));
});
test('cancelled direction has no physical effect and completed dispersal cannot duplicate', () => {
    const run = begin();
    run.act('disperse'); run.cancel();
    assert.equal(run.swarm, id('washroom'));
    run.act('disperse'); run.step(); run.reload();
    assert.equal(run.swarm, id('outside'));
    assert.equal(run.quote('disperse').eligible, false);
});

const beforeCopy = JSON.parse(readFileSync(new URL('./fixtures/worm_opening_before_copy.json', import.meta.url), 'utf8'));
async function nativeDefinition(raw) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const definitions = new Map();
    const register = createStructuredNativeRegistration({registry, definitions, locations: {}, items: {}, inventories: {},
        availabilities: {}, makeLocation: l => ({...l, connected_locations: []}), makeItem: i => ({...i}), makeInventory: () => ({})});
    return register(raw);
}
test('exact reviewed before-copy Taylor save resumes and can finish its already chosen physical route', async () => {
    assert.equal(hash(beforeCopy), 'sha256:a6f920b8f1f3d77345e4ac73dbc44bce0ab126e4b10f154dfafacc84b5bcc338');
    const oldDefinition = await nativeDefinition(beforeCopy);
    const run = begin(beforeCopy, oldDefinition);
    run.act('leave');run.step();run.reload();
    const before = JSON.stringify({state: run.state, record: run.record});
    const current = await nativeDefinition(wormLeadLife);
    assert.equal(current.contentHash, oldDefinition.contentHash);
    assert.equal(current.starts[0].snapshotHash, oldDefinition.starts[0].snapshotHash);
    assert.deepEqual(current.simulation.commands.map(({description, ...mechanics}) => mechanics),
        oldDefinition.simulation.commands.map(({description, ...mechanics}) => mechanics));
    const definitions = new Map([[current.id, current]]);
    requireStructuredContent(run.record, definitions, run.state);
    requireStructuredSelection(run.record, definitions);
    const wrongSnapshot = {...current, starts: current.starts.map(start => ({...start, snapshotHash: 'sha256:' + 'f'.repeat(64)}))};
    assert.throws(() => requireStructuredSelection(run.record, new Map([[current.id, wrongSnapshot]])), /exact beginning content/);
    assert.equal(JSON.stringify({state: run.state, record: run.record}), before, 'validation does not rewrite saved stock or receipts');
    run.act('return');run.step();run.act('disperse');run.step();
    assert.equal(run.swarm, id('outside'));
});
test('reviewed alias cannot admit later mechanical or starting-body drift', async () => {
    const run = begin(beforeCopy, await nativeDefinition(beforeCopy));
    for (const change of [raw => {raw.simulation.commands[0].duration = 2;}, raw => {raw.starts[0].body.hands = 1;}]) {
        const changed = structuredClone(wormLeadLife);change(changed);
        const definition = await nativeDefinition(changed);
        const before = JSON.stringify(run.record);
        assert.throws(() => requireStructuredContent(run.record, new Map([[definition.id, definition]]), run.state), /exact beginning content/);
        assert.equal(JSON.stringify(run.record), before);
    }
});

test('both issued Taylor identity pairs resume; crossed pairs and unreviewed aliases do not', async () => {
    const canonical = await nativeDefinition(wormLeadLife);
    const postCopy = structuredClone(wormLeadLife);delete postCopy.compatibility.identityAliases;
    const postDefinition = await nativeDefinition(postCopy);
    const definitions = new Map([[canonical.id, canonical]]);
    for (const [raw, definition] of [[beforeCopy, await nativeDefinition(beforeCopy)], [postCopy, postDefinition]]) {
        const run = begin(raw, definition);
        const before = JSON.stringify({state: run.state, record: run.record});
        requireStructuredContent(run.record, definitions, run.state);
        assert.equal(JSON.stringify({state: run.state, record: run.record}), before);
        run.act('leave');run.step();run.reload();
        requireStructuredContent(run.record, definitions, run.state);
        assert.equal(run.location, id('corridor'));
        for (const crossed of [
            {...run.record, contentHash: canonical.contentHash, snapshotHash: postDefinition.starts[0].snapshotHash},
            {...run.record, contentHash: postDefinition.contentHash, snapshotHash: canonical.starts[0].snapshotHash}
        ]) assert.throws(() => requireStructuredContent(crossed, definitions, run.state), /exact beginning content/);
    }
    const unreviewed = structuredClone(wormLeadLife);
    delete unreviewed.compatibility.identityAliases[0].preserveCurrent;
    const oldOnly = await nativeDefinition(unreviewed);
    assert.equal(oldOnly.identityAlternatives, undefined, 'other unmarked aliases keep their prior admission behavior');
    const postRun = begin(postCopy, postDefinition);
    assert.throws(() => requireStructuredContent(postRun.record, new Map([[oldOnly.id, oldOnly]]), postRun.state), /exact beginning content/);
});
