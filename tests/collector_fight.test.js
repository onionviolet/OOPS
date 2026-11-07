// OB10 (lane W8-C): turning the landlady's collector away by force. Results return as known acts through heat.recordAct; money moves only in
// the read after a fight the player chose.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {LOTM_RENT} from '../src/book_world_lotm_duties.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';
import {configureHeatPurse} from '../src/heat.js';
import {consequenceNews} from '../src/consequences.js';
import {readOwedLedger} from '../src/owed_ledger_sources.js';
import {tempoOpener} from '../src/tempo_starters.js';
import {collectorQuote, collectorSpec, resolveCollectorFights, COLLECTOR_TITLE, migrateCollector} from '../src/book_world_lotm_collector.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove} from '../src/tempo_fight.js';

const WEEK = 10080, RENT = 60;
let clock = 10, purse = 0;
registerDutySet('collector_rent', {defs: LOTM_RENT, state: () => ({clock}), active: () => true, minute: s => s.clock,
    purse: {balance: () => purse, pay: amount => { purse -= amount; }}});
const reset = (coins = 0) => {
    clock = 10; purse = coins; domainRegistry.load({}); domainRegistry.tick(1);
    configureHeatPurse({balance: () => purse, pay: amount => { purse -= amount; }});
};
const weeks = n => { for(let i = 0; i < n; i++) { clock += WEEK; domainRegistry.tick(WEEK); } };
const heat = () => domainRegistry.project('heat');
const policeWord = () => heat().heat.find(h => h.authority === 'tingen_police');
const strong = {stats: {attack_points: 90, agility: 9, intuition: 9, defense: 6, attack_count: 1, crit_rate: .4, crit_multiplier: 1.6, stamina_efficiency: 1}, attackPower: 30, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const weak = {stats: {attack_points: 4, agility: 1, intuition: 1, defense: 0, attack_count: 1, crit_rate: 0, crit_multiplier: 1, stamina_efficiency: 1}, attackPower: 1, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
function fresh({me = strong, foe = weak, hp = 30} = {}) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 5;
    const vitals = {health: hp, max_health: hp, stamina: 30, max_stamina: 30};
    return {p, context: fieldContext(p, 'Village', {vitals: {player: vitals}}), helpers: {me, vitals, parts: {}, enemyProfile: () => foe}};
}
const asLotm = state => ({...state, lotm: {}, actors: {...state.actors, player: {...state.actors.player, worldId: I.world}}});
const quote = (state, lotm = true) => collectorQuote(lotm ? asLotm(state) : state);
const open = plan => plan.state.simulation.sessions.player?.nativeBattle;
function play(f, move = 'jab', cap = 60) {
    let plan = beginTempoFight(f.p.state, registry, f.context, collectorSpec(f.p.state, f.context, f.helpers));
    for(let i = 0; i < cap && open(plan); i++) plan = commitTempoMove(plan.state, registry, f.context, {moveId: move});
    return plan;
}
const lastLog = plan => plan.state.simulation.log.at(-1);
const withLog = (state, result, cause = 'tempo:9', at = 77) => { state.simulation.log.push({at, text: `${COLLECTOR_TITLE}: ${result}.`, cause}); return state; };

test('the opener is visible only while the collector waits (3 weeks), and shows both outcomes', () => {
    reset(0); const f = fresh();
    assert.equal(quote(f.p.state).visible, false);
    weeks(2); assert.equal(quote(f.p.state).visible, false);
    weeks(1);
    const q = quote(f.p.state);
    assert.equal(q.visible, true); assert.equal(q.eligible, true);
    assert.match(q.reason, /3 weeks behind \(180 pence\)/); assert.match(q.reason, /police/); assert.match(q.reason, /fine/);
    assert.equal(tempoOpener('lotm.collector.door').label, 'Turn the collector away');
    const o = fresh(); o.p.state.lotm = undefined;
    assert.equal(collectorQuote(o.p.state).visible, false, 'only in LOTM');
    purse = 500; assert.match(quote(f.p.state).reason, /takes the 180 pence from your purse/);
});

test('paying first removes the opener: the collector is gone once the arrears are paid', () => {
    reset(500); weeks(0); purse = 0; weeks(3); purse = 500;
    const f = fresh(); assert.equal(quote(f.p.state).visible, true);
    assert.equal(domainRegistry.command('duties', 'settleArrears')({dutyId: 'lotm.rent'}).paid, true);
    assert.equal(purse, 500 - 3 * RENT);
    assert.equal(quote(f.p.state).visible, false);
});

test('a win: one known act, police heat once, the debt remains, nothing paid; a second read adds nothing', () => {
    reset(0); weeks(3); purse = 1000;
    const f = fresh();
    const plan = play(f);
    assert.match(lastLog(plan).text, /collector at the door: won\./);
    assert.equal(policeWord(), undefined, 'not read yet: heat waits for the next projection');
    const lines = resolveCollectorFights(plan.state);
    assert.equal(lines.length, 1); assert.match(lines[0].text, /sent for the Tingen police/);
    const acts = domainRegistry.save({}).heat.acts;
    assert.equal(acts.length, 1); assert.equal(acts[0].authority, 'tingen_police'); assert.equal(acts[0].witness, 'landlady');
    assert.equal(policeWord().word, 'the Tingen police have your name');
    const v = policeWord().value;
    assert.deepEqual(resolveCollectorFights(plan.state), []); quote(plan.state); quote(plan.state);
    assert.equal(policeWord().value, v); assert.equal(domainRegistry.save({}).heat.acts.length, 1);
    assert.equal(purse, 1000, 'nothing taken on a win');
    assert.equal(domainRegistry.project('duties').items.find(i => i.id === 'lotm.rent').missed, 3, 'the debt remains');
    assert.ok(consequenceNews(plan.state).some(n => /^collectorfight:/.test(n.id) && /sent for the Tingen police/.test(n.text)));
    assert.equal(quote(plan.state).visible, true, 'the collector state still holds');
});

test('the authority chooses by dial: a landlady who lets it lie sends no police', () => {
    reset(0); weeks(3);
    const state = withLog(fresh().p.state, 'won');
    assert.match(resolveCollectorFights(state, {response: 'lets_it_lie'})[0].text, /says nothing to the police/);
    assert.deepEqual(domainRegistry.save({}).heat.acts, [], 'no act, so no police heat');
});

test('a loss with money: the arrears come out of the purse, once', () => {
    reset(0); weeks(3); purse = 400;
    const f = fresh({me: weak, foe: strong, hp: 3}), plan = play(f, 'guard');
    assert.match(lastLog(plan).text, /: lost\./);
    const lines = resolveCollectorFights(plan.state);
    assert.match(lines[0].text, /took the 180 pence/);
    assert.equal(purse, 220);
    resolveCollectorFights(plan.state); assert.equal(purse, 220);
    assert.equal(domainRegistry.project('duties').items.find(i => i.id === 'lotm.rent').missed, 0, 'arrears cleared');
    assert.equal(quote(plan.state).visible, false, 'the collector is gone');
});

test('a loss with an empty purse: the fine rises, nothing is taken', () => {
    reset(0); weeks(3);
    const state = withLog(fresh().p.state, 'lost');
    assert.match(resolveCollectorFights(state)[0].text, /fine is now 180 pence/);
    const row = readOwedLedger().rows.find(r => r.id.startsWith('fine:'));
    assert.equal(row.amount, 180); assert.equal(purse, 0);
    weeks(1); assert.equal(readOwedLedger().rows.find(r => r.id.startsWith('fine:')).amount, 180, 'the clock does not undo or double it');
    withLog(state, 'lost', 'tempo:10');
    resolveCollectorFights(state);
    assert.equal(readOwedLedger().rows.find(r => r.id.startsWith('fine:')).amount, 240, 'a second loss raises the open fine');
});

test('yielding pays the arrears; a short purse pays nothing and the debt stands', () => {
    reset(0); weeks(3); purse = 300;
    let state = withLog(fresh().p.state, 'yielded');
    assert.match(resolveCollectorFights(state)[0].text, /paid the collector 180 pence/); assert.equal(purse, 120);
    reset(0); weeks(3); purse = 50;
    state = withLog(fresh().p.state, 'yielded', 'tempo:3');
    assert.match(resolveCollectorFights(state)[0].text, /could not cover/); assert.equal(purse, 50);
    assert.equal(domainRegistry.project('duties').items.find(i => i.id === 'lotm.rent').missed, 3);
});

test('nothing happens while away: ticking weeks never reads a fight, pays or levies; withdrawing changes nothing', () => {
    reset(0); weeks(3); purse = 1000;
    const state = withLog(fresh().p.state, 'withdrawn');
    purse = 0; weeks(2);
    assert.equal(purse, 0); assert.equal(domainRegistry.save({}).collector_fight, undefined);
    purse = 1000;
    assert.deepEqual(resolveCollectorFights(state), []);
    assert.deepEqual(domainRegistry.save({}).heat.acts, []); assert.equal(domainRegistry.project('collector_fight').handled.length, 1);
});

test('a fight saved mid-way reloads and still resolves once at its end; the slice round-trips and junk loads fresh', () => {
    reset(0); weeks(3); purse = 1000;
    const f = fresh();
    let plan = beginTempoFight(f.p.state, registry, f.context, collectorSpec(f.p.state, f.context, f.helpers));
    assert.equal(quote(plan.state).eligible, false, 'busy while the fight is open');
    const saved = domainRegistry.save({}), copy = JSON.parse(JSON.stringify(plan.state));
    domainRegistry.load(JSON.parse(JSON.stringify(saved)));
    plan = {state: copy};
    for(let i = 0; i < 60 && open(plan); i++) plan = commitTempoMove(plan.state, registry, f.context, {moveId: 'jab'});
    resolveCollectorFights(plan.state);
    const after = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(after.collector_fight.handled.length, 1);
    domainRegistry.load(after); resolveCollectorFights(plan.state);
    assert.equal(domainRegistry.save({}).heat.acts.length, 1, 'a reloaded save does not re-read the same fight');
    assert.deepEqual(migrateCollector({family: 'x'}), {family: 'collector_fight@1', handled: [], lines: []});
});
