import fs from 'node:fs';
import {requireStructuredContent,requireStructuredSelection} from '../src/structured_pack_state.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {paradiseLeadLife,paradiseLeadId as id,paradiseLeadTrialStatus,paradiseLeadOpeningStatus} from '../src/world_packs/book_paradise_lead_life.js';
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {jsonData} from '../src/simulation_contracts.js';
import {createStructuredNativeRegistration} from '../src/structured_native_registration.js';
const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
function begin(raw = paradiseLeadLife, admitted = null) {
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

        quote: name => previewSimulationCommand(plan.state, registry, id(name), context(name)),
        act(name) {plan = commitSimulationCommand(plan.state, registry, {id: id(name)}, context(name));},
        step(minutes = 1) {plan = advanceSimulation(plan.state, registry, minutes, plan.external, plan.gameplay,
            {player: {...context(), vitals: (plan.vitals || initial.vitals).player}});},
        cancel() {plan = cancelSimulationJob(plan.state, registry, plan.state.simulation.jobs[0].id, context());},
        reload() {plan.state = loadExpansionState(JSON.parse(JSON.stringify(plan.state)), registry);}
    };
}

const known = (r, key) => r.state.simulation.knowledge.player[id(key)];
function arrive(run, informed = true) {
    if (informed) {run.act('ask_terms');run.act('sign');} else run.act('sign_now');
    run.act('treatment');run.act('awakening');run.act('transfer');
}
function panels(run) {run.act('read_arrival');run.act('open_brand');}

test('coerced signing treats the same injured body, then awakens and transfers without a mission reward', () => {
    assert.doesNotThrow(() => jsonData(paradiseLeadLife));
    const r = begin(), bodyId = r.state.simulation.people.player.body.id;
    assert.equal(r.state.simulation.people.player.body.chestWounded, true);
    r.act('ask_knife');assert.match(known(r, 'knife_answer').value, /not been returned/);
    r.act('ask_terms');r.act('sign');
    assert.equal(r.state.simulation.people.player.body.chestWounded, true);
    assert.equal(r.quote('transfer').eligible, false);
    r.act('treatment');r.reload();
    assert.equal(r.state.simulation.people.player.body.id, bodyId);
    assert.equal(r.state.simulation.people.player.body.chestWounded, false);
    assert.equal(r.location, id('recruitment'));
    r.act('awakening');r.act('transfer');
    assert.equal(r.location, id('house'));
    assert.equal(r.state.simulation.people.player.body.id, bodyId);
    assert.equal(r.state.bookWorldCampaign, undefined);
    assert.deepEqual(r.state.actors.player.resources, {});
    assert.equal(known(r, 'trial'), undefined);
    assert.match(paradiseLeadTrialStatus(r.state)[0].value, /72 h 0 min left/);
});

test('signing early preserves missing explanations and refuses later recruitment questions', () => {
    const r = begin();arrive(r, false);r.reload();
    assert.equal(known(r, 'terms'), undefined);
    assert.equal(known(r, 'knife_answer'), undefined);
    assert.equal(r.quote('ask_terms').eligible, false);
    assert.equal(r.state.actors.player.facts[id('signed_without_terms')], true);
});

test('trial starts at arrival, either panel order spends real time and restore never resets its deadline', () => {
    for (const order of [['read_personal','read_trial'],['read_trial','read_personal']]) {
        const r = begin();arrive(r);const issued = r.state.simulation.situations[id('trial_time')].openedAt;
        r.step(3);r.reload();panels(r);
        assert.match(paradiseLeadTrialStatus(r.state)[0].value, /71 h 57 min left/);
        for(const action of order) {r.act(action);r.step();r.reload();}
        const timer = r.state.simulation.situations[id('trial_time')];
        assert.equal(timer.openedAt, issued);assert.equal(timer.deadline, issued + 4320);
        assert.match(paradiseLeadTrialStatus(r.state)[0].value, /71 h 55 min left/);
        assert.match(known(r, 'trial').value, /Philip Herbert/);
        assert.equal(r.quote(order[0]).eligible, false);
        assert.deepEqual(r.state.actors.player.resources, {});
    }
});

test('cancelled reading costs elapsed time without supplying knowledge; no new contract after the offered time', () => {
    const r = begin();arrive(r);panels(r);r.act('read_trial');r.cancel();
    assert.equal(known(r, 'trial'), undefined);
    r.step(2);r.act('read_trial');r.step();
    assert.ok(known(r, 'trial'));
    assert.match(paradiseLeadTrialStatus(r.state)[0].value, /71 h 57 min left/);
    const late = begin();late.step(95);late.reload();
    assert.equal(late.quote('sign_now').eligible, false);
    assert.equal(late.quote('ask_terms').eligible, false);
});

test('actual native registration accepts this separate protagonist definition', async () => {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const register = createStructuredNativeRegistration({registry, definitions: new Map(), locations: {}, items: {}, inventories: {},
        availabilities: {}, makeLocation: l => ({...l, connected_locations: []}), makeItem: i => ({...i}), makeInventory: () => ({})});
    const definition = await register(paradiseLeadLife);
    assert.equal(definition.id, 'book.su.lead');
    assert.equal(definition.starts[0].body.id, id('body'));
    assert.ok(definition.contentHash.startsWith('sha256:'));
});

const original = JSON.parse(fs.readFileSync(new URL('./fixtures/paradise_opening_before_retrospective.json', import.meta.url), 'utf8'));
async function definition(raw) {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    return createStructuredNativeRegistration({registry, definitions: new Map(), locations: {}, items: {}, inventories: {},
        availabilities: {}, makeLocation: l => ({...l, connected_locations: []}), makeItem: i => ({...i}), makeInventory: () => ({})})(raw);
}
test('copy candidate resumes both original signature histories without rewriting observations or clock', async () => {
    const old = await definition(original), current = await definition(paradiseLeadLife);
    assert.equal(current.contentHash, old.contentHash);
    assert.equal(current.starts[0].snapshotHash, old.starts[0].snapshotHash);
    for (const informed of [true, false]) {
        const run = begin(original, old);
        if (informed) {run.act('ask_terms');run.act('sign');} else run.act('sign_now');
        run.act('treatment');run.reload();
        const before = JSON.stringify({state: run.state, record: run.record});
        requireStructuredContent(run.record, new Map([[current.id,current]]), run.state);
        requireStructuredSelection(run.record, new Map([[current.id,current]]));
        const rows = [{label:'Your situation',value:known(run,'opening').value},{label:'Contract',value:known(run,'agreement').value}];
        const projected = paradiseLeadOpeningStatus(run.state, rows);
        assert.match(projected[0].value,/When you arrived/);
        assert.match(projected[1].value,/At that moment/);
        assert.equal(projected[0].value.includes('Your wounds remain'),false);
        assert.equal(JSON.stringify({state:run.state,record:run.record}),before);
        assert.equal(rows[0].value,known(run,'opening').value,'view input is not mutated');
        run.act('awakening');run.act('transfer');panels(run);run.act('read_trial');run.step();run.reload();
        assert.ok(known(run,'trial'));
        requireStructuredContent(run.record,new Map([[current.id,current]]),run.state);
    }
});
test('the reviewed copy aliases do not admit later duration or body changes', async () => {
    const old = await definition(original), run = begin(original,old);
    for (const mutate of [raw=>raw.simulation.commands.find(c=>c.id===id('read_trial')).duration=2, raw=>raw.starts[0].body.hands=1]) {
        const drift=structuredClone(paradiseLeadLife);mutate(drift);
        const changed=await definition(drift);
        assert.throws(()=>requireStructuredContent(run.record,new Map([[changed.id,changed]]),run.state),/exact beginning content/);
    }
});
