// OB10 follow-up (lane W11-B): the police answer a wanted name with two constables; win, arrest, surrender.
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
import {constablesQuote, constablesSpec, resolveConstableFights, configureConstables, serveSentence, migrateConstables, CONSTABLES_TITLE} from '../src/book_world_lotm_constables.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove} from '../src/tempo_fight.js';

let clock = 10, purse = 0, advanced = [];
registerDutySet('strikes_rent', {defs: LOTM_RENT, state: () => ({clock}), active: () => true, minute: s => s.clock,
    purse: {balance: () => purse, pay: amount => { purse -= amount; }}});
const reset = ({host = true} = {}) => {
    clock = 10; purse = 0; advanced = []; domainRegistry.load({}); domainRegistry.tick(1);
    configureHeatPurse({balance: () => purse, pay: amount => { purse -= amount; }});
    configureConstables(host ? {plan: m => ({minutes:m,commit:()=>{ advanced.push(m); clock += m; domainRegistry.tick(m); }})} : null);
};
const record = (weight, id) => domainRegistry.command('heat', 'recordAct')({authority: 'tingen_police', weight, id, at: clock, known: true, witness: 'landlady'});
const police = () => domainRegistry.project('heat').heat.find(h => h.authority === 'tingen_police');
const strong = {stats: {attack_points: 90, agility: 9, intuition: 9, defense: 6, attack_count: 1, crit_rate: .4, crit_multiplier: 1.6, stamina_efficiency: 1}, attackPower: 30, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
const weak = {stats: {attack_points: 4, agility: 1, intuition: 1, defense: 0, attack_count: 1, crit_rate: 0, crit_multiplier: 1, stamina_efficiency: 1}, attackPower: 1, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
function fresh({me = strong, foe = weak, hp = 30} = {}) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 5;
    const vitals = {health: hp, max_health: hp, stamina: 30, max_stamina: 30};
    return {p, context: fieldContext(p, 'Village', {vitals: {player: vitals}}), helpers: {me, vitals, parts: {}, enemyProfile: () => foe}};
}
const asLotm = state => ({...state, lotm: {}, actors: {...state.actors, player: {...state.actors.player, worldId: I.world}}});
const quote = (state, opts) => constablesQuote(asLotm(state), opts);
const open = plan => plan.state.simulation.sessions.player?.nativeBattle;
function play(f, move = 'jab', cap = 120) {
    let plan = beginTempoFight(f.p.state, registry, f.context, constablesSpec(f.p.state, f.context, f.helpers));
    for(let i = 0; i < cap && open(plan); i++) plan = commitTempoMove(plan.state, registry, f.context, {moveId: move});
    return plan;
}
const withLog = (state, result, cause = 'tempo:9', at = 77) => { state.simulation.log.push({at, text: `${CONSTABLES_TITLE}: ${result}.`, cause}); return state; };
const wantedState = () => { reset(); record(4.5, 'a'); return fresh().p.state; };

test('constables appear only at wanted, only in Tingen, and the decision holds as heat cools', () => {
    reset(); const f = fresh();
    assert.equal(quote(f.p.state).visible, false, 'no heat');
    record(3, 'a'); assert.equal(police().level, 1); assert.equal(quote(f.p.state).visible, false, 'a name is not wanted');
    record(1.5, 'b'); assert.equal(police().level, 2);
    const o = fresh(); o.p.state.lotm = undefined;
    assert.equal(constablesQuote(o.p.state).visible, false, 'only in LOTM');
    const q = quote(f.p.state);
    assert.equal(q.visible, true); assert.equal(q.eligible, true); assert.match(q.reason, /two constables/); assert.match(q.reason, /90 pence/);
    assert.equal(tempoOpener('lotm.constables.door').label, 'Constables at the door');
    domainRegistry.tick(12 * 1440);
    assert.equal(police().level, 1, 'cooled below wanted');
    assert.equal(quote(f.p.state).visible, true, 'the decision was made once and stands');
    domainRegistry.tick(40 * 1440);
    assert.equal(quote(f.p.state).visible, false, 'the name is forgotten and so is the warrant');
});

test('the authority chooses by dial: a force that watches sends nobody', () => {
    reset(); record(4.5, 'a');
    assert.equal(quote(fresh().p.state, {choice: 'watches'}).visible, false);
    assert.equal(domainRegistry.project('constables').latch, null);
});

test('a win: heat rises, a bounty is posted once and shown, no money moves; a second read adds nothing', () => {
    const state = wantedState(); purse = 1000; quote(state);
    const before = police().value;
    const plan = play(fresh());
    assert.match(plan.state.simulation.log.at(-1).text, /Constables at the door: won\./);
    const lines = resolveConstableFights(plan.state);
    assert.equal(lines.length, 1); assert.match(lines[0].text, /bounty of 480 pence/);
    assert.ok(police().value > before - 0.01 && police().value >= before + 1.9 - 0.01);
    assert.deepEqual(resolveConstableFights(plan.state), []);
    assert.equal(domainRegistry.project('constables').bounty.amount, 480);
    assert.equal(purse, 1000); assert.deepEqual(advanced, []);
    assert.ok(consequenceNews(plan.state).some(n => /^bounty:/.test(n.id) && /480 pence/.test(n.text)));
    // a second win under a new session: the bounty stands, it is not posted twice
    withLog(plan.state, 'won', 'tempo:10');
    assert.match(resolveConstableFights(plan.state)[0].text, /still stands/);
    assert.equal(consequenceNews(plan.state).filter(n => /^bounty:/.test(n.id)).length, 1);
    assert.equal(domainRegistry.project('constables').hooks.nighthawks != null, true, 'two wins pass the further dial');
});

test('the Nighthawk-level step is only a hook flag, left for a later lane, and not set by one win at the floor', () => {
    reset(); record(4, 'a'); const s = fresh().p.state; quote(s);
    withLog(s, 'won'); resolveConstableFights(s);
    assert.deepEqual(domainRegistry.project('constables').hooks, {}, '4 + 2 stays under the dial of 7');
    withLog(s, 'won', 'tempo:11'); resolveConstableFights(s);
    assert.deepEqual(Object.keys(domainRegistry.project('constables').hooks), ['nighthawks']);
});

test('a loss: arrested, a night passes by the dial, a fine waits as owed, heat drops, the bounty is lifted', () => {
    const state = wantedState(); quote(state);
    withLog(state, 'won'); resolveConstableFights(state);
    const hot = police().value;
    const plan = play(fresh({me: weak, foe: strong, hp: 3}), 'guard');
    assert.match(plan.state.simulation.log.at(-1).text, /: lost\./);
    const lines = resolveConstableFights(plan.state);
    assert.match(lines[0].text, /took you in/); assert.match(lines[0].text, /fine of 90 pence/); assert.match(lines[0].text, /bounty on you is lifted/);
    serveSentence(); assert.deepEqual(advanced, [720]);
    assert.ok(police().value <= 1.5 + 1e-6 && police().value < hot, 'heat dropped');
    assert.equal(domainRegistry.project('constables').bounty, null); assert.equal(domainRegistry.project('constables').latch, null);
    const fine = readOwedLedger().rows.find(r => r.id.startsWith('fine:arrest'));
    assert.equal(fine.amount, 90); assert.equal(purse, 0, 'nothing taken');
    assert.equal(quote(plan.state).visible, false, 'the warrant is answered');
    resolveConstableFights(plan.state); assert.deepEqual(advanced, [720], 'once');
});

test('yielding at the door is giving yourself up; the surrender command does the same with no fight', () => {
    const state = wantedState(); quote(state);
    withLog(state, 'yielded');
    assert.match(resolveConstableFights(state)[0].text, /gave in to the constables/);
    serveSentence(); assert.deepEqual(advanced, [720]);
    // surrender without any fight
    const s2 = wantedState(); quote(s2);
    assert.throws(() => { reset(); domainRegistry.command('constables', 'surrender')({at: 5}); }, /No constables/);
    const s3 = wantedState(); quote(s3);
    const l = domainRegistry.command('constables', 'surrender')({at: clock});
    assert.match(l.text, /give yourself up/); serveSentence(); assert.deepEqual(advanced, [720]);
    assert.ok(police().value <= 1.5 + 1e-6); assert.equal(quote(s3).visible, false);
    assert.equal(readOwedLedger().rows.filter(r => r.id.startsWith('fine:arrest')).length, 1);
});

test('withdrawing changes nothing; nothing happens while away', () => {
    const state = wantedState(); quote(state); const hot = police().value;
    withLog(state, 'withdrawn');
    assert.deepEqual(resolveConstableFights(state), []);
    assert.equal(police().value, hot); assert.deepEqual(advanced, []);
    domainRegistry.tick(2 * 1440); assert.equal(purse, 0);
    assert.equal(readOwedLedger().rows.some(r => r.id.startsWith('fine:arrest')), false);
});

test('with no clock host the night stays owed and visible; a host that arrives serves it once', () => {
    reset({host: false}); record(4.5, 'a'); const state = fresh().p.state; quote(state);
    withLog(state, 'yielded'); const text = resolveConstableFights(state)[0].text;
    assert.match(text, /to spend a night in the cells/);
    assert.equal(domainRegistry.project('constables').sentence.minutes, 720);
    assert.equal(serveSentence(), false, 'no host yet');
    configureConstables({plan: m => ({minutes:m,commit:()=>advanced.push(m)})});
    assert.equal(serveSentence(), true); assert.deepEqual(advanced, [720]); assert.equal(domainRegistry.project('constables').sentence, null);
});

test('saves round trip and a reloaded save does not re-read the same fight; junk loads fresh', () => {
    const state = wantedState(); quote(state);
    withLog(state, 'won'); resolveConstableFights(state);
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(saved.constables.bounty.amount, 480); assert.equal(saved.constables.handled.length, 1);
    domainRegistry.load(saved); resolveConstableFights(state);
    assert.equal(domainRegistry.save({}).heat.acts.filter(a => /constable-assault/.test(a.id)).length, 1);
    reset(); assert.equal(domainRegistry.save({}).constables, undefined, 'an untouched life writes no key');
    assert.deepEqual(migrateConstables({family: 'x'}), {family: 'constables@1', handled: [], lines: [], latch: null, bounty: null, hooks: {}, sentence: null, arrests: 0});
    assert.equal(migrateConstables({family: 'constables@1', bounty: {amount: -3, at: 1, cause: 'x'}, latch: {at: 'no'}}).bounty, null);
});

test('the deferred host serves after resolution returns, saves remaining time, and never repeats on reload', async () => {
    reset({host:false}); record(4.5,'a'); const s=fresh().p.state; quote(s);withLog(s,'yielded');
    const writes=[];let returned=false;
    configureConstables({plan:m=>({minutes:Math.min(200,m),commit:()=>{assert.equal(returned,true);writes.push(JSON.parse(JSON.stringify(domainRegistry.save({}))).constables.sentence?.minutes??0);}})});
    resolveConstableFights(s);assert.deepEqual(writes,[]);returned=true;
    await new Promise(resolve=>queueMicrotask(resolve));assert.deepEqual(writes,[520,320,120,0]);
    const saved=domainRegistry.save({});domainRegistry.load(saved);quote(s);await new Promise(resolve=>queueMicrotask(resolve));assert.equal(writes.length,4);
});
test('a paused or rejected sentence publication preserves its debt for retry',()=>{
    reset({host:false});record(4.5,'a');const s=fresh().p.state;quote(s);withLog(s,'yielded');resolveConstableFights(s);
    configureConstables({plan:()=>({minutes:0,commit:()=>assert.fail('paused')})});assert.equal(serveSentence(),false);assert.equal(domainRegistry.project('constables').sentence.minutes,720);
    configureConstables({plan:()=>({minutes:300,commit:()=>{throw Error('disk full');}})});assert.throws(()=>serveSentence(),/disk full/);assert.equal(domainRegistry.project('constables').sentence.minutes,720);
    configureConstables({plan:m=>({minutes:m,commit:()=>{}})});assert.equal(serveSentence(),true);assert.equal(domainRegistry.project('constables').sentence,null);
});

test('post-publication failure cannot restore already-served time',()=>{
    reset({host:false});record(4.5,'a');const s=fresh().p.state;quote(s);withLog(s,'yielded');resolveConstableFights(s);
    configureConstables({plan:m=>({minutes:m,commit:()=>{},afterCommit:()=>{throw Error('display failed');}})});
    assert.throws(()=>serveSentence(),/display failed/);assert.equal(domainRegistry.project('constables').sentence,null);
});
