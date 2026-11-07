// The constables' sight becomes knowledge Tingen can read: a resolved "Constables at the door" fight records what the two constables saw of
// the player, and Tingen knownness gains one witness row per constable with no hand-written fact. ACR9: what they saw, not hidden truth.
// The record lives in the constables slice, not simulation.knowledge: the save validator needs every knowledge holder to be a persistent actor.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {domainRegistry} from '../src/domain_registry.js';
import {configureHeatPurse} from '../src/heat.js';
import {knownness} from '../src/authority.js';
import '../src/authority_sources.js';
import {validateSimulationState} from '../src/simulation_contracts.js';
import {resolveConstableFights, configureConstables, constablesSpec, CONSTABLES_TITLE, CONSTABLE_IDS, migrateConstables} from '../src/book_world_lotm_constables.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove} from '../src/tempo_fight.js';

const DAY = 1440;
const weak = {stats: {attack_points: 4, agility: 1, intuition: 1, defense: 0, attack_count: 1, crit_rate: 0, crit_multiplier: 1, stamina_efficiency: 1}, attackPower: 1, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const strong = {stats: {attack_points: 90, agility: 9, intuition: 9, defense: 6, attack_count: 1, crit_rate: .4, crit_multiplier: 1.6, stamina_efficiency: 1}, attackPower: 30, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const reset = () => { domainRegistry.load({}); domainRegistry.tick(1); configureHeatPurse({balance: () => 0, pay: () => {}}); configureConstables({plan: m => ({minutes: m, commit: () => {}})}); };
const open = plan => plan.state.simulation.sessions.player?.nativeBattle;
function playReal(me, foe, hp, move) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 5;
    const vitals = {health: hp, max_health: hp, stamina: 30, max_stamina: 30}, context = fieldContext(p, 'Village', {vitals: {player: vitals}});
    const state = (() => { let plan = beginTempoFight(p.state, registry, context, constablesSpec(p.state, context, {me, vitals, parts: {}, enemyProfile: () => foe}));
        for(let i = 0; i < 120 && open(plan); i++) plan = commitTempoMove(plan.state, registry, context, {moveId: move});
        return plan.state; })();
    return state;
}
const rows = state => knownness(state, 'tingen').signals.filter(s => s.id.startsWith('witness:'));
const door = () => domainRegistry.project('constables').door;
const atFight = (state, day) => { state.simulation.log.at(-1).at = day * DAY; return state; };

test('a won fight: each constable\'s sight gives Tingen a witness row, with no hand-written fact', () => {
    reset();
    const state = atFight(playReal(strong, weak, 30, 'jab'), 10);
    assert.match(state.simulation.log.at(-1).text, new RegExp(`${CONSTABLES_TITLE}: won\\.`));
    assert.equal(rows(state).length, 0, 'nothing seen before the fight is read');
    resolveConstableFights(state);
    assert.equal(door().at, 10 * DAY); assert.match(door().value, /drove them off/);
    const got = rows(state);
    assert.deepEqual(got.map(r => r.id).sort(), CONSTABLE_IDS.map(id => `witness:${id}`));
    assert.match(got[0].text, /saw you and noted: fought two constables at the door and drove them off\./);
    assert.ok(got.every(r => r.at === 10) && knownness(state, 'tingen').value > 0);
    assert.equal(Object.keys(state.simulation.knowledge).filter(id => id.includes('constable')).length, 0, 'no note under a non-persistent id');
});

test('lost, yielded and withdrawn each write what the constables saw', () => {
    for(const [result, pattern] of [['lost', /beaten down/], ['yielded', /gave in/], ['withdrawn', /got away/]]) {
        reset();
        const state = playReal(strong, weak, 30, 'jab');
        state.simulation.log = [{at: 5 * DAY, text: `${CONSTABLES_TITLE}: ${result}.`, cause: `tempo:${result}`}];
        resolveConstableFights(state);
        assert.match(door().value, pattern, result);
        assert.equal(rows(state).length, 2, result);
    }
});

test('a real lost fight arrests the player and still records the sight', () => {
    reset();
    const state = playReal(weak, strong, 3, 'guard');
    assert.match(state.simulation.log.at(-1).text, /: lost\./);
    assert.match(resolveConstableFights(state)[0].text, /took you in/);
    assert.match(door().value, /beaten down/);
});

test('the save validates and round-trips: the slice and the witness rows return, and a re-read writes nothing', () => {
    reset();
    const state = playReal(strong, weak, 30, 'jab'); resolveConstableFights(state);
    validateSimulationState(state.simulation, state, registry.simulation);
    const before = rows(state).map(r => [r.id, r.text, r.at]), saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(saved.constables.door.cause, state.simulation.log.at(-1).cause);
    domainRegistry.load(saved);
    assert.deepEqual(rows(state).map(r => [r.id, r.text, r.at]), before);
    assert.deepEqual(resolveConstableFights(state), [], 'the same log entry twice writes nothing');
    assert.deepEqual(JSON.parse(JSON.stringify(domainRegistry.save({}))).constables, saved.constables);
    const back = JSON.parse(JSON.stringify(state)); validateSimulationState(back.simulation, back, registry.simulation);
});

test('a later fight replaces the one record, and a damaged record is dropped on load', () => {
    reset();
    const state = playReal(strong, weak, 30, 'jab'); resolveConstableFights(state);
    state.simulation.log.push({at: 12 * DAY, text: `${CONSTABLES_TITLE}: yielded.`, cause: 'tempo:later'});
    resolveConstableFights(state);
    assert.match(door().value, /gave in/); assert.equal(rows(state).length, 2);
    assert.equal(migrateConstables({...domainRegistry.save({}).constables, door: {value: 7, at: 'x'}}).door, null);
});
