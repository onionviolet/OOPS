// AT17 PROTOTYPE (proposal under AD32, not an accepted rule): recurring roles are registered without provisioning and promoted at the first durable
// reference. First consumer: the two Tingen constables, promoted when the door fight opens (docs/audits/RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHeatPurse} from '../src/heat.js';
import {knownness} from '../src/authority.js';
import '../src/authority_sources.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {validateSimulationState} from '../src/simulation_contracts.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove} from '../src/tempo_fight.js';
import {recordFightSight, FIGHT_SIGHT_KEY} from '../src/tempo_fight_domain.js';
import {resolveConstableFights, configureConstables, constablesSpec, promoteConstables, CONSTABLE_IDS, CONSTABLES_TITLE} from '../src/book_world_lotm_constables.js';
import {defineRole, installRoleDefinitions, promoteRole, roleDefinitions} from '../src/recurring_people.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';

const weak = {stats: {attack_points: 4, agility: 1, intuition: 1, defense: 0, attack_count: 1, crit_rate: 0, crit_multiplier: 1, stamina_efficiency: 1}, attackPower: 1, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const strong = {stats: {attack_points: 90, agility: 9, intuition: 9, defense: 6, attack_count: 1, crit_rate: .4, crit_multiplier: 1.6, stamina_efficiency: 1}, attackPower: 30, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const vitals = {health: 30, max_health: 30, stamina: 30, max_stamina: 30}, DAY = 1440;
const reset = () => { domainRegistry.load({}); domainRegistry.tick(1); configureHeatPurse({balance: () => 0, pay: () => {}}); configureConstables({plan: m => ({minutes: m, commit: () => {}})}); };
const open = plan => plan.state.simulation.sessions.player?.nativeBattle;
const fresh = () => { const p = joinField(createFieldFixture()); p.state.simulation.seed = 5; return p; };
const bytes = state => JSON.stringify(state);
const rows = state => knownness(state, 'tingen').signals.filter(s => s.id.startsWith('witness:'));
// A world-neutral stand-in role, so the whole engine (commit, validate, load) runs without a Tingen life: a guard of the frontier village.
const GUARD = 'test.recurring.guard';
defineRole({id: GUARD, label: 'A village guard', worldId: 'base.frontier', location: 'Village', body: {form: 'human', hands: 2, mobile: true}, vitals: {health: 30, max_health: 30, stamina: 10, max_stamina: 10}});
const guardSpec = () => ({id: 'guard-fight', title: 'Guard at the gate', floor: 1, fighters: [
    {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile: strong, perception: 9, stealth: 9, moves: ['jab', 'guard', 'yield']},
    {id: GUARD, name: 'A village guard', side: 'b', speed: 100, hp: 30, maxHp: 30, stamina: 10, maxStamina: 10, profile: weak, perception: 6, stealth: 5}]});
// The host's order: open the fight, promote on the new plan, commit; then each move records sight before it commits.
function fight(state, {promote = true} = {}) {
    const context = fieldContext(fresh(), 'Village', {vitals: {player: vitals}});
    let plan = beginTempoFight(state, registry, context, guardSpec()), created = false;
    if(promote) created = promoteRole(plan, registry, {definitionId: GUARD, cause: `test-promote:${plan.state.sequence}`});
    for(let i = 0; i < 120 && open(plan); i++) {
        const before = {sessionId: plan.state.simulation.sessions.player.id, battle: structuredClone(open(plan))};
        plan = commitTempoMove(plan.state, registry, context, {moveId: 'jab'}); recordFightSight(plan, registry, before);
    }
    assert.equal(open(plan), undefined, 'the fight ended'); return {plan, created};
}
// The Tingen state the constables need (a world entry), at simulation level: the full Tingen owner is out of scope for this slice's checks.
const tingen = state => { state.worlds[I.world] = structuredClone(state.worlds['base.frontier']); return state; };
const FOES = Object.fromEntries(CONSTABLE_IDS.map(id => [id, {side: 'b'}]));
const sight = (state, result = 'won') => { const plan = {state}; state.actors.player.facts['tempo.lastResult'] = result; return {plan, written: recordFightSight(plan, registry, {sessionId: 'tempo:9', battle: {fighters: FOES}})}; };

test('an untouched life is byte-identical: roles are registered, never provisioned', () => {
    const before = bytes(fresh().state);
    installRoleDefinitions(registry); installRoleDefinitions(registry); // idempotent
    assert.ok(roleDefinitions().length >= 3 && [...CONSTABLE_IDS, GUARD].every(id => registry.simulation.people.has(id)));
    assert.equal(bytes(fresh().state), before);
    assert.ok(!before.includes('constable') && !before.includes(GUARD));
    reset(); assert.equal(domainRegistry.save({}).constables, undefined, 'the constables slice stays out of an untouched save');
    assert.equal(bytes(loadExpansionState(JSON.parse(before), registry)), bytes(loadExpansionState(JSON.parse(before), registry)));
    assert.ok(!bytes(loadExpansionState(JSON.parse(before), registry)).includes(GUARD));
});

test('after the fight the person exists with his knowledge; encode, import and reload round-trip', () => {
    reset(); installRoleDefinitions(registry);
    const {plan, created} = fight(fresh().state), s = plan.state.simulation;
    assert.equal(created, true);
    assert.equal(s.people[GUARD].life, 'alive'); assert.equal(s.people[GUARD].definitionId, GUARD); assert.equal(s.people[GUARD].createdBy, 'player');
    assert.ok(plan.state.actors[GUARD] && s.owners[GUARD]);
    assert.equal(s.knowledge[GUARD][FIGHT_SIGHT_KEY].value, 'fought you and lost'); assert.equal(s.knowledge[GUARD][FIGHT_SIGHT_KEY].stage, 'seen');
    validateSimulationState(s, plan.state, registry.simulation);
    const loaded = loadExpansionState(JSON.parse(bytes(plan.state)), registry);
    assert.deepEqual(loaded.simulation.people[GUARD], s.people[GUARD]); assert.deepEqual(loaded.simulation.knowledge[GUARD], s.knowledge[GUARD]);
    assert.equal(bytes(loadExpansionState(JSON.parse(bytes(loaded)), registry)), bytes(loaded), 'a second encode and import changes nothing');
    // Control: without promotion the same fight writes nothing for him (the order matters, F2) and the state is unchanged by his absence.
    const none = fight(fresh().state, {promote: false}).plan.state;
    assert.equal(none.simulation.people[GUARD], undefined); assert.equal(none.simulation.knowledge[GUARD], undefined);
});

test('no double spawn and no re-promotion: a replayed plan, a clock rewind and a second fight leave him alone', () => {
    reset(); installRoleDefinitions(registry);
    const {plan} = fight(fresh().state), person = structuredClone(plan.state.simulation.people[GUARD]), after = plan.state;
    const replay = {state: structuredClone(after)};
    assert.equal(promoteRole(replay, registry, {definitionId: GUARD, cause: 'test-promote:again'}), false);
    const rewound = {state: structuredClone(after)}; rewound.state.clock = Math.max(0, rewound.state.clock - 5000);
    assert.equal(promoteRole(rewound, registry, {definitionId: GUARD, cause: 'test-promote:rewound'}), false);
    assert.deepEqual(rewound.state.simulation.people[GUARD], person);
    const second = structuredClone(after); second.simulation.sessions = {};
    const again = fight(second);
    assert.equal(again.created, false, 'the second fight creates nobody');
    assert.equal(again.plan.state.simulation.people[GUARD].bornAt, person.bornAt); assert.equal(again.plan.state.simulation.people[GUARD].createdBy, 'player');
    assert.ok(again.plan.state.simulation.knowledge[GUARD][FIGHT_SIGHT_KEY].cause !== plan.state.simulation.knowledge[GUARD][FIGHT_SIGHT_KEY].cause, 'the newer sight replaces the older');
    validateSimulationState(again.plan.state.simulation, again.plan.state, registry.simulation);
});

test('the constables: promoted at fight open with the right shape, one witness row each, no door record written', () => {
    reset(); installRoleDefinitions(registry);
    const state = tingen(fresh().state), plan = {state};
    assert.deepEqual(promoteConstables(plan, registry), CONSTABLE_IDS);
    assert.deepEqual(promoteConstables(plan, registry), [], 'a second call creates nobody');
    for(const id of CONSTABLE_IDS) {
        assert.deepEqual([state.simulation.people[id].life, state.simulation.people[id].definitionId, state.simulation.people[id].createdBy], ['alive', id, 'player']);
        assert.equal(state.actors[id].worldId, I.world);
    }
    assert.deepEqual(sight(state).written, CONSTABLE_IDS);
    state.simulation.log.push({at: 10 * DAY, text: `${CONSTABLES_TITLE}: won.`, cause: 'tempo:9'}); resolveConstableFights(state);
    assert.equal(domainRegistry.project('constables').door, null, 'a promoted fight writes no door record');
    assert.deepEqual(rows(state).map(r => r.id).sort(), CONSTABLE_IDS.map(id => `witness:${id}`), 'one row per constable (F5)');
    validateSimulationState(state.simulation, state, registry.simulation);
    // An older door record plus the newer knowledge: still one row each, and the knowledge wording is the one shown.
    domainRegistry.load({constables: {family: 'constables@1', door: {value: 'gave in at the door', at: 3 * DAY, cause: 'tempo:old'}}});
    assert.equal(rows(state).length, 2); assert.ok(rows(state).every(r => /fought you and lost/.test(r.text) && !/gave in/.test(r.text)));
});

test('a save from before the change loads clean: no unsupported person, and the door record still reads', () => {
    reset(); installRoleDefinitions(registry);
    const state = fresh().state; state.simulation.log.push({at: 5 * DAY, text: `${CONSTABLES_TITLE}: lost.`, cause: 'tempo:7'});
    const old = JSON.parse(bytes(state)); assert.ok(!old.simulation.people[CONSTABLE_IDS[0]] && !old.simulation.knowledge[CONSTABLE_IDS[0]]);
    resolveConstableFights(state); assert.match(domainRegistry.project('constables').door.value, /beaten down/);
    assert.equal(rows(state).length, 2, 'the fallback serves both constables');
    const without = {...registry, simulation: {...registry.simulation, people: new Map([...registry.simulation.people].filter(([id]) => !CONSTABLE_IDS.includes(id)))}};
    for(const reg of [registry, without]) {
        const loaded = loadExpansionState(structuredClone(old), reg);
        assert.doesNotThrow(() => validateSimulationState(loaded.simulation, loaded, reg.simulation));
    }
    // A registry that was never given the definitions promotes nobody and writes nothing no save could validate (F1, F2).
    const bare = {simulation: {people: new Map()}}, bp = {state: structuredClone(state)};
    assert.deepEqual(promoteConstables(bp, bare), []); assert.deepEqual(bp.state.simulation.people, state.simulation.people);
    assert.throws(() => promoteRole(bp, bare, {definitionId: CONSTABLE_IDS[0], cause: 'x.bare'}), /not registered/);
});
