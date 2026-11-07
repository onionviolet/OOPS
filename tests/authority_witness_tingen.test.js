// F2 first live consumer: Tingen constables are witness belongings; village people and passers-by are not.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {knownness} from '../src/authority.js';
import '../src/authority_sources.js';
import {CONSTABLE_PREFIX} from '../src/authority_sources_lotm.js';
import {constablesSpec} from '../src/book_world_lotm_constables.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight} from '../src/tempo_fight.js';

const DAY = 1440, see = (value, at) => ({value, stage: 'seen', at, cause: 'test'});
const T = 'person.player.';
const foe = {stats: {attack_points: 4, agility: 1, intuition: 1, defense: 0, attack_count: 1, crit_rate: 0, crit_multiplier: 1, stamina_efficiency: 1}, attackPower: 1, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
function realFight() {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 5;
    const vitals = {health: 30, max_health: 30, stamina: 30, max_stamina: 30}, context = fieldContext(p, 'Village', {vitals: {player: vitals}});
    const plan = beginTempoFight(p.state, registry, context, constablesSpec(p.state, context, {me: foe, vitals, parts: {}, enemyProfile: () => foe}));
    return plan.state;
}
const withKnowledge = (state, knowledge) => { state.simulation.knowledge = {...state.simulation.knowledge, ...knowledge}; state.clock = 10 * DAY; return state; };

test('a constable who saw the player adds a Tingen row; the fight record names who they are', () => {
    const state = realFight(), fight = state.simulation.sessions.player.nativeBattle;
    const watch = Object.keys(fight.fighters).filter(id => fight.fighters[id].side === 'b');
    assert.equal(watch.length, 2);
    assert.ok(watch.every(id => id.startsWith(CONSTABLE_PREFIX)), 'belonging follows the id the fight carries');
    // Missing writer: the fight itself records no observer fact, so there is no row until something writes one.
    assert.equal(knownness(state, 'tingen').signals.filter(s => s.id.startsWith('witness:')).length, 0);
    withKnowledge(state, {[watch[0]]: {[`${T}fight`]: see('fought two constables at the door', 10 * DAY)}});
    const k = knownness(state, 'tingen'), rows = k.signals.filter(s => s.id.startsWith('witness:'));
    assert.deepEqual(rows.map(r => r.id), [`witness:${watch[0]}`]);
    assert.match(rows[0].text, /saw you and noted: fought two constables/);
    assert.ok(k.value >= 1);
});
test('an unaffiliated bystander adds none, and a village observer does not count toward Tingen', () => {
    const state = withKnowledge(realFight(), {passerby: {[`${T}fight`]: see('a brawl', 10 * DAY)}, oldCraftsman: {[`${T}fight`]: see('a brawl', 10 * DAY)}});
    assert.equal(knownness(state, 'tingen').signals.filter(s => s.id.startsWith('witness:')).length, 0);
    const first = 'book.lotm.constable.1';
    withKnowledge(state, {[first]: {[`${T}fight`]: see('a brawl', 10 * DAY)}});
    assert.equal(knownness(state, 'village').signals.filter(s => s.id.startsWith('witness:')).length, 0);
});
