import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {shadowSlaveApprentice as raw} from '../src/world_packs/book_shadow_slave_life.js';
import {createExpansionState, createContentRegistry, loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection, beginStructuredCampaign, structuredCampaignView} from '../src/structured_pack_runtime.js';
import {validateStructuredEnvelope, requireStructuredContent} from '../src/structured_pack_state.js';
import {commitSimulationCommand, cancelSimulationJob, advanceSimulationBoundary, previewSimulationCommand} from '../src/simulation.js';
import {projectStructuredEquipment} from '../src/structured_equipment_runtime.js';
import {readWornEquipment} from '../src/worn_equipment_comparison.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';
const P = raw.id, id = n => `${P}.${n}`, key = n => JSON.stringify({id: id(n)});
const hash = o => 'sha256:' + createHash('sha256').update(JSON.stringify(o)).digest('hex');
function setup() {
    const registry = createContentRegistry({worlds: [{id: 'base.frontier', label: 'Home'}]});
    const compiled = compileStructuredPack(raw, registry); mergeStructuredPack(compiled, registry);
    const d = {...compiled.definition, contentHash: hash(raw), starts: raw.starts.map(b => ({...b, snapshotHash: hash(b)}))};
    const state = createExpansionState(712);
    const context = {registry, actorId: 'player', worldId: 'base.frontier', external: {money: 0}, gameplay: {player: {inventory: {}, skills: {}, reputation: {}}},
        vitals: {player: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}}, equipment: {player: {}},
        nativeAlive: true, nativeReady: true, nativeBody: {id: 'native.player.body', ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult'}, facts: {location: 'Village'}, busy: false};
    const selection = planStructuredSelection(state, d, context);
    const start = beginStructuredCampaign(selection.plan.state, d, context, null, selection.selection);
    let p = {...start.plan, equipment: {player: {}}};
    const ctx = () => ({...context, worldId: d.world.id, nativeBody: p.state.simulation.people.player.body, facts: {location: id('workroom')},
        external: p.external, gameplay: p.gameplay, vitals: p.vitals, equipment: p.equipment});
    const api = {registry, d, record: start.record, get p() {return p;}, ctx,
        start(n) {p = commitSimulationCommand(p.state, registry, {id: id(n)}, ctx()); return p;},
        step(n = 5) {const out = structuredClone(p); out.state.clock += n; advanceSimulationBoundary(out, registry, {player: ctx()}); p = out; return p;},
        cancel() {p = cancelSimulationJob(p.state, registry, p.state.simulation.jobs[0].id, ctx()); return p;},
        quote(n) {return previewSimulationCommand(p.state, registry, id(n), ctx());},
        envelope() {const save = {character: {money: 0, equipment: {}}, expansion: p.state, content_packs: {schema: 1, packs: {}, structured: start.record},
            'current location': id('workroom'), inventories: {person: {main_character: {}}}, levels: {person: {main_character: {}}}};
            writeGameplayToEnvelope(save, p.gameplay, {player: {category: 'person', id: 'main_character'}}); return save;}
    };
    return api;
}
const reserve = f => f.p.state.simulation.energies.player[id('essence')].reserve;
const protection = (f, n) => readWornEquipment({definitions: raw.items, equipment: {[n === 'coat' ? 'torso' : 'arms']: key(n)},
    state: f.p.state, body: f.p.state.simulation.people.player.body, actorFacts: f.p.state.actors.player.facts}).defenseByKey[key(n)];

test('held specimen study learns once; two independent same-key carriers feed actual worn defense', () => {
    const f = setup(); validateStructuredEnvelope(f.envelope());
    assert.equal(f.quote('fit_coat').eligible, false);
    assert.equal(f.p.state.simulation.knowledge.player[id('pattern')], undefined);
    assert.equal(protection(f, 'coat'), 4); assert.equal(protection(f, 'gloves'), 2);
    const beforeKey = Object.keys(f.p.gameplay.player.inventory).find(k => k === key('coat'));
    f.start('study'); assert.equal(reserve(f), 10); assert.equal(f.p.gameplay.player.inventory[key('donor')], undefined);
    validateStructuredEnvelope(f.envelope());
    assert.equal(f.p.state.simulation.knowledge.player[id('pattern')], undefined);
    f.step(4); assert.equal(f.p.state.simulation.knowledge.player[id('pattern')], undefined); f.step(1);
    assert.equal(f.p.gameplay.player.inventory[key('donor')], 1);
    assert.equal(f.p.state.simulation.knowledge.player[id('pattern')].stage, 'understood');
    assert.equal(f.quote('study').eligible, false);
    f.start('fit_coat'); validateStructuredEnvelope(f.envelope());
    assert.equal(f.p.gameplay.player.inventory[beforeKey], 1); assert.equal(reserve(f), 7); f.step();
    assert.equal(protection(f, 'coat'), 8); assert.equal(protection(f, 'gloves'), 2);
    assert.equal(f.p.gameplay.player.inventory[beforeKey], 1); assert.equal(f.quote('fit_coat').eligible, false);
    f.start('fit_gloves'); f.step(); assert.equal(protection(f, 'gloves'), 4); assert.equal(reserve(f), 4);
    assert.equal(f.p.gameplay.player.inventory[key('shard')], undefined); validateStructuredEnvelope(f.envelope());
    const loose = projectStructuredEquipment({definitions: raw.items, equipment: {}, state: f.p.state, body: f.ctx().nativeBody, facts: f.p.state.actors.player.facts});
    assert.deepEqual(loose.effects, {});
});

test('cancellation and lost support refund reserved specimen, shard and energy without granting knowledge or fitting', () => {
    const f = setup(); f.start('study'); f.cancel();
    assert.equal(reserve(f), 12); assert.equal(f.p.gameplay.player.inventory[key('donor')], 1); validateStructuredEnvelope(f.envelope());
    f.start('study'); f.step(); f.start('fit_coat');
    f.p.state.simulation.faculties.player[id('weave_sight')].suppressed = true;
    f.step(); assert.equal(reserve(f), 10); assert.equal(f.p.gameplay.player.inventory[key('shard')], 2);
    assert.equal(protection(f, 'coat'), 4); assert.equal(f.p.state.actors.player.facts[id('coat_fitted')], false); validateStructuredEnvelope(f.envelope());
});

test('wrong title, equipped carrier and duplicate active work refuse without spending; missing carrier at completion refunds', () => {
    const f = setup(); f.start('study'); f.step();
    const claim = f.p.state.simulation.claims[id('coat_title')]; claim.owner = 'other';
    const before = structuredClone(f.p); assert.throws(() => f.start('fit_coat')); assert.deepEqual(f.p, before); claim.owner = 'player';
    delete f.p.gameplay.player.inventory[key('coat')]; f.p.equipment.player.torso = key('coat');
    assert.equal(f.quote('fit_coat').eligible, false);
    delete f.p.equipment.player.torso; f.p.gameplay.player.inventory[key('coat')] = 1;
    f.start('fit_coat'); assert.throws(() => f.start('fit_gloves'));
    delete f.p.gameplay.player.inventory[key('coat')]; f.p.equipment.player.torso = key('coat'); f.step();
    assert.equal(f.p.state.actors.player.facts[id('coat_fitted')], false); assert.equal(reserve(f), 10); assert.equal(f.p.gameplay.player.inventory[key('shard')], 2);
});

test('pending work reload retains exact remaining time, frozen command costs and title conservation', () => {
    const f = setup(); f.start('study'); f.step(2);
    const save = JSON.parse(JSON.stringify(f.envelope())); validateStructuredEnvelope(save);
    requireStructuredContent(save.content_packs.structured, new Map([[f.d.id, f.d]]), save.expansion);
    assert.deepEqual(loadExpansionState(save.expansion, f.registry), f.p.state);
    assert.equal(save.expansion.simulation.jobs[0].due - save.expansion.clock, 3);
    const duplicated = structuredClone(save); duplicated.inventories.person.main_character[key('donor')] = {count: 1};
    assert.throws(() => validateStructuredEnvelope(duplicated), /unit/);
    const view = structuredCampaignView(f.p.state, f.d, f.record, f.ctx());
    assert.equal(JSON.stringify(view.status).includes('spread impact'), false);
    f.step(3); const after = JSON.stringify(f.p); f.step(0); assert.equal(JSON.stringify(f.p), after);
});
