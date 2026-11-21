// Crowds in tempo fights (TF4, TF5, MS2; Weibao, 2026-11-21: "implement entirely"). A crowd is ordinary fighters plus a rank order:
// blows land on its front, Sweep reaches the first two ranks, Single out pulls a chosen member forward, and a hurt front falls back.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove, tempoView, offered, policyMove, crowdRanks, CROWD_DIALS} from '../src/tempo_fight.js';

const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: 0, crit_multiplier: 1.5, stamina_efficiency: 1};
const profile = {stats, attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const reload = state => loadExpansionState(JSON.parse(JSON.stringify(state)), registry);
function crowdFight({count = 5, seed = 7, crowd = true} = {}) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = seed;
    const context = fieldContext(p, 'Village', {vitals: {player: {health: 200, max_health: 200, stamina: 60, max_stamina: 60}}});
    const wolves = Array.from({length: count}, (_, i) => ({id: `w${i + 1}`, name: 'Wolf', side: 'b', speed: 40, hp: 30, maxHp: 30, stamina: 30, tags: ['beast'],
        profile: {...profile, attackPower: .5}, moves: ['jab'], perception: 6, stealth: 6}));
    const begun = beginTempoFight(p.state, registry, context, {id: 'crowd-fx', title: 'Wolf tide', conditions: {}, stakes: {preset: 'hunt', lethal: true}, terms: {beast: 'finish'},
        fighters: [{id: 'player', name: 'You', side: 'a', speed: 200, hp: 200, maxHp: 200, stamina: 60, maxStamina: 60, profile, perception: 6, stealth: 6}, ...wolves],
        ...(crowd ? {crowds: [{id: 'tide', name: 'The wolf pack', members: wolves.map(w => w.id)}]} : {})});
    return {begun, context};
}
const battle = plan => plan.state.simulation.sessions.player.nativeBattle;
const hurt = b => Object.keys(b.fighters).filter(id => id !== 'player' && b.fighters[id].hp < b.fighters[id].maxHp);
const move = (plan, context, command) => commitTempoMove(plan.state, registry, {...context, vitals: plan.vitals}, command);

test('a blow aimed at a member behind the front lands on the front', () => {
    const {begun, context} = crowdFight();
    const b0 = battle(begun);
    assert.deepEqual(crowdRanks(b0, 'tide'), ['w1', 'w2', 'w3', 'w4', 'w5']);
    assert.deepEqual(tempoView(b0).crowds, [{id: 'tide', name: 'The wolf pack', order: ['w1', 'w2', 'w3', 'w4', 'w5']}]);
    assert.equal(tempoView(b0).targetId, 'w1');
    const after = move(begun, context, {moveId: 'swing', targetId: 'w4'});
    const b = battle(after);
    assert.ok(hurt(b).every(id => id === 'w1'), 'only the front can be harmed: ' + hurt(b));
    assert.equal(tempoView(b).roster.find(r => r.id === 'w4').crowd.rank, 3);
    assert.equal(Object.keys(tempoView(b0).moves.find(m => m.id === 'swing').harm).join(), 'w1', 'the harm reading names the front only');
});

test('Sweep lands its own blow on each of the first two ranks and nothing carries past them', () => {
    const {begun, context} = crowdFight();
    assert.ok(tempoView(battle(begun)).moves.some(m => m.id === 'sweep'));
    const b = battle(move(begun, context, {moveId: 'sweep', targetId: 'w1'}));
    assert.ok(hurt(b).every(id => ['w1', 'w2'].includes(id)), 'sweep reached only the front two: ' + hurt(b));
    assert.ok(b.log.some(line => /sweep across the front/.test(line)));
});

test('Single out pulls the chosen member forward, saves the order, and refuses the front', () => {
    const {begun, context} = crowdFight();
    assert.throws(() => move(begun, context, {moveId: 'single_out', targetId: 'w1'}), /already at the front/);
    const singled = move(begun, context, {moveId: 'single_out', targetId: 'w4'});
    assert.equal(crowdRanks(battle(singled), 'tide')[0], 'w4');
    const restored = reload(singled.state);
    assert.deepEqual(restored.simulation.sessions.player.nativeBattle.crowds.tide.order.slice(0, 2), ['w4', 'w1'], 'the order survives save and reload');
    const struck = battle(move({...singled, state: restored}, context, {moveId: 'swing'}));
    assert.ok(hurt(struck).every(id => id === 'w4') && hurt(struck).length, 'the next blow reaches the singled-out member');
});

test('a hurt front falls back for a fresher member, and only then', () => {
    const {begun} = crowdFight();
    const b = structuredClone(battle(begun));
    assert.equal(offered(b, 'w1').includes('fall_back'), false);
    b.fighters.w1.hp = 30 * (CROWD_DIALS.fallBackAt.value - .1);
    assert.ok(offered(b, 'w1').includes('fall_back'));
    assert.equal(policyMove(b, 'w1', 'aggressive').moveId, 'fall_back');
    assert.equal(offered(b, 'w2').includes('fall_back'), false, 'a member behind the front does not fall back');
});

test('a fight without a crowd offers no crowd moves and saves no crowd field', () => {
    const {begun} = crowdFight({crowd: false});
    const b = battle(begun);
    assert.equal(b.crowds, undefined);
    assert.ok(!tempoView(b).moves.some(m => ['sweep', 'single_out', 'fall_back'].includes(m.id)));
    assert.deepEqual(tempoView(b).crowds, []);
});

test('a saved crowd naming a missing or shared member is refused on load', () => {
    const {begun} = crowdFight();
    const bad = structuredClone(begun.state);
    bad.simulation.sessions.player.nativeBattle.crowds.tide.order.push('nobody');
    assert.throws(() => reload(bad), /Invalid tempo crowd/);
});
