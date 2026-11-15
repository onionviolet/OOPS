// Live tie-in (Weibao 2026-11-14: "Tie one fight into the game"): the tempo fight host can fight on by a steady
// policy until something needs the player, says why it stopped, tells the card why the fight wants a look,
// and gives an itemised result when the fight ends (CBD38, CBD56, CBD78). Host commands only; no DOM.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight} from '../src/tempo_fight.js';
import {configureTempoFight} from '../src/tempo_fight_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {RUN_LABEL, RUN_TEXT} from '../src/ui/tempo_interaction.js';

const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .3, crit_multiplier: 1.5, stamina_efficiency: 1};
const profile = {stats, attackPower: 8, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};

// A host over a real fixture fight: the ports hold the state the way the game does, and commit swaps it.
function host({foeHp = 20, seed = 7, player = {}, facts = {}, stakes = null, foe = {}, terms = null} = {}) {
    const p = joinField(createFieldFixture());
    Object.assign(p.state.actors.player.facts, facts);
    p.state.simulation.seed = seed;
    const context = fieldContext(p, 'Village', {vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}});
    let state = beginTempoFight(p.state, registry, context, {id: 'fx-run', title: 'Yard bout', floor: 1, ...(stakes ? {stakes} : {}), ...(terms ? {terms} : {}), fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile, perception: 20, stealth: 20, ...player},
        {id: 'foe1', name: 'A yard bully', side: 'b', speed: 60, hp: foeHp, maxHp: foeHp, stamina: 30, maxStamina: 30, profile: {...profile, attackPower: 2}, perception: 20, stealth: 20, ...foe}]}).state;
    let commits = 0, atCommit = null; // the view as a redraw inside the commit would read it
    configureTempoFight({root: () => state, registry, writable: () => true, campaignContext: () => context,
        commit: plan => { state = plan.state; if (plan.vitals) context.vitals = plan.vitals; commits += 1; atCommit = domainRegistry.project('tempo_fight'); }});
    return {view: () => domainRegistry.project('tempo_fight'), run: domainRegistry.command('tempo_fight', 'run'),
        move: domainRegistry.command('tempo_fight', 'move'), commits: () => commits, atCommit: () => atCommit, state: () => state};
}

test('the card is told why a first meeting wants a look, and the run control has player words', () => {
    const h = host();
    const fight = h.view().fight;
    assert.equal(fight.yourTurn, true);
    assert.deepEqual(fight.ask, ['A yard bully: not fought before.']);
    assert.match(RUN_LABEL, /^Fight on/);
    assert.doesNotMatch(`${RUN_LABEL} ${RUN_TEXT}`, /policyMove|tempo|steady'|undefined/);
});

test('fighting on takes several turns in one go, ends the fight and says so', () => {
    const h = host({foeHp: 20});
    const said = h.run();
    assert.match(said, /^\d+ turns? taken\. The fight is over\.$/, said);
    assert.ok(h.commits() >= 1);
    const view = h.view();
    assert.equal(view.fight, undefined, 'no fight is open afterwards');
    assert.equal(view.last, 'won');
});

test('a finished fight leaves an itemised result that counts the decisions the player made', () => {
    const h = host({foeHp: 20});
    h.move({moveId: 'jab'}); // one decision by hand
    if (h.view().fight) h.run();
    const account = h.view().account;
    assert.equal(account.head, 'Yard bout. You: standing.');
    const items = Object.fromEntries(account.items);
    assert.equal(items.Asked, '1 decision.');
    assert.ok(items.Hurt === 'Unhurt.' || /^Health [\d.]+ of 30\.$/.test(items.Hurt), items.Hurt);
    for (const [, text] of account.items) assert.doesNotMatch(text, /undefined|null|NaN|player|foe1/);
});

test('fighting on hands back before the end when it has run as far as one go-ahead allows, and says why', () => {
    const h = host({foeHp: 4000});
    const said = h.run();
    assert.ok(h.view().fight, 'the fight is still open');
    assert.match(said, /^\d+ turns? taken\. (Your health is under half\.|You have taken a new injury\.|That is as far as one go-ahead runs\.|.+: no longer possible, .+\.)$/, said);
    const turns = Number(said.match(/^(\d+)/)[1]);
    assert.ok(turns >= 1 && turns <= 12);
});

test('fighting on refuses when there is no fight, with a reason', () => {
    const h = host({foeHp: 20});
    h.run();
    assert.throws(() => h.run(), /Nothing to fight on with\./);
});

// Found by play (the boar hunt, 2026-11-14): a policy that alternates firing and reloading made every turn look
// like "your last move is gone", so one go-ahead took one turn. The run compares against the player's own pick.
test('a policy that alternates two moves keeps going: firing then reloading is not a reason to stop', () => {
    const h = host({foeHp: 400, player: {moves: ['jab', 'guard', 'withdraw', 'shoot', 'reload'],
        stock: {kind: 'ordinary', loaded: 1, carried: 12, capacity: 1, batch: 1, vs: {foe1: {chance: 0.01, downIn: 100}}}}});
    const said = h.run();
    assert.ok(Number(said.match(/^(\d+) turns?/)[1]) >= 3, said);
    assert.doesNotMatch(said, /Fire|Reload/);
});

test('the result is already there when the commit redraws the card', () => {
    const h = host({foeHp: 4});
    for (let n = 0; n < 6 && h.view().fight; n += 1) h.run();
    assert.equal(h.view().fight, undefined);
    assert.match(h.atCommit().account.head, /^Yard bout\. You: /);
});

test('the result is kept with the life, so a later sitting that never watched the fight still reads it', () => {
    const h = host({foeHp: 4});
    for (let n = 0; n < 6 && h.view().fight; n += 1) h.run();
    const kept = JSON.parse(h.state().actors.player.facts['tempo.lastAccount']);
    assert.deepEqual(kept, {head: h.view().account.head, items: h.view().account.items});
    assert.equal(JSON.parse(JSON.stringify(h.state())).actors.player.facts['tempo.lastAccount'], h.state().actors.player.facts['tempo.lastAccount']);
});

test('a foe fought to an end is remembered with the life, so the next meeting does not ask again', () => {
    const first = host({foeHp: 4});
    for (let n = 0; n < 6 && first.view().fight; n += 1) first.run();
    const kept = first.state().actors.player.facts['tempo.metFoes'];
    assert.deepEqual(JSON.parse(kept), ['A yard bully']);
    assert.deepEqual(host({facts: {'tempo.metFoes': kept}}).view().fight.ask, []);
    assert.deepEqual(host().view().fight.ask, ['A yard bully: not fought before.']);
});

test('the result names how the other side ended', () => {
    const h = host({foeHp: 4});
    for (let n = 0; n < 6 && h.view().fight; n += 1) h.run();
    assert.equal(Object.fromEntries(h.view().account.items).Them, 'A yard bully: down.');
});

// PS21-PS27 (play surface round 3): what the decision band and its standing answer read.
test('your terms settle a downed beast as you meant to, by Fight on or a hand-played blow; Ask me opens the window', () => {
    const beast = {name: 'A lightning wolf', tags: ['beast'], hp: 4, maxHp: 30};
    const fin = host({stakes: {preset: 'hunt'}, terms: {beast: 'finish'}, foe: beast});
    fin.run();
    assert.equal(fin.view().fight, undefined, 'Fight on did not stop: the terms carried it');
    const them = Object.fromEntries(fin.view().account.items).Them;
    assert.match(them, /killed, as you meant to\.$/, them);
    // A blow played by hand follows the same terms: no window opens.
    const hand = host({stakes: {preset: 'hunt'}, terms: {beast: 'spare'}, foe: beast});
    for(let n = 0; n < 12 && hand.view().fight; n++) hand.move({moveId: 'jab'});
    assert.equal(hand.view().fight, undefined);
    assert.match(Object.fromEntries(hand.view().account.items).Them, /out cold, as you meant to/);
    const ask = host({stakes: {preset: 'hunt'}, terms: {beast: 'ask'}, foe: beast});
    assert.match(ask.run(), /A lightning wolf is down\. Finish or spare\?/);
    const fates = ask.view().fight.fateMoves;
    assert.deepEqual(fates.map(m => m.label), ['Finish', 'Spare']);
    assert.equal(fates[0].text, 'It dies.', 'a beast gets beast words, not a person\'s');
    const plead = ask.view().fight.moves.find(m => m.id === 'plead');
    assert.ok(!plead || plead.usable === false, 'nothing to ask of a wolf');
});

test('terms are kept per kind of foe and change a live fight; take alive needs a means; losing terms stop the loop', () => {
    const h = host({stakes: {preset: 'hunt'}, terms: {beast: 'ask'}, foe: {name: 'A lightning wolf', tags: ['beast'], hp: 4, maxHp: 30}});
    const terms = domainRegistry.command('tempo_fight', 'terms');
    assert.match(terms({kind: 'beast', value: 'finish'}), /killed/);
    assert.equal(h.state().actors.player.facts['fight.terms.beast'], 'finish');
    assert.equal(h.state().simulation.sessions.player.nativeBattle.terms.beast, 'finish', 'the open fight takes the change at once');
    assert.throws(() => terms({kind: 'beast', value: 'take_alive'}), /Nothing to bind them with/);
    assert.throws(() => terms({kind: 'dragon', value: 'finish'}), /which kind/);
    const strip = h.view().fight.strip;
    assert.deepEqual(strip.terms.map(t => [t.kind, t.terms, t.set]), [['beast', 'finish', true]]);
    // Losing terms: at about a third of your health, yield instead of the next blow.
    const low = host({player: {hp: 8, maxHp: 30}, foe: {hp: 40, maxHp: 40}, facts: {'fight.losing': 'yield'}});
    assert.match(low.run(), /You yield, as you meant to\./);
});

test('a person who is down always asks, whatever the standing answer for beasts', () => {
    const h = host({stakes: {preset: 'hunt'}, foe: {hp: 4, maxHp: 30, tags: ['person']}, facts: {'tempo.downPolicy': 'finish'}});
    assert.match(h.run(), /is down\. Finish or spare\?/);
    assert.equal(h.view().fight.fateMoves[0].text, 'They die here, by your hand.');
});

test('the card can say the fight turned deadly and why, and how likely holding back is to slip', () => {
    const h = host({stakes: {preset: 'brawl'}, foe: {hp: 30, maxHp: 30}});
    assert.equal(h.view().fight.stakes.cue, undefined, 'no shift yet');
    assert.equal(h.view().fight.holdRisk, 0, 'nothing to slip while it cannot kill');
    h.move({moveId: 'escalate'});
    const f = h.view().fight;
    assert.equal(f.stakes.lethal, true);
    assert.ok(f.stakes.cue && f.stakes.cue.length <= 300, 'the reason it changed rides with the stakes');
    const heavy = host({stakes: {preset: 'hunt'}, player: {profile: {...profile, attackPower: 400}}, foe: {hp: 30, maxHp: 30}});
    assert.ok(heavy.view().fight.holdRisk > .15, `a blow far too strong for this body may slip: ${heavy.view().fight.holdRisk}`);
});

// PS41, PS48: the other side has terms too. A hurt person offers to yield; a person always asks, and Accept or Finish answers it.
test('a hurt person yields; the fight asks, Accept ends it with them on their feet, Finish is a killing that shifts the stakes', () => {
    const person = {name: 'The knifeman', tags: ['person'], hp: 9, maxHp: 30, goals: {survive: .7, aim: .3}};
    const h = host({stakes: {preset: 'brawl'}, terms: {person: 'finish'}, foe: person});
    let said = '';
    for(let n = 0; n < 6 && h.view().fight && !h.view().fight.fateMoves?.length; n++) said = h.run();
    const f = h.view().fight;
    assert.ok(f?.fateMoves?.length, `the yield waits on you: ${said}`);
    assert.match(said, /The knifeman yields\. Accept or finish\?/);
    assert.deepEqual(f.fateMoves.map(m => m.label), ['Finish', 'Accept']);
    assert.ok(f.lines.some(l => /yields, hands open/.test(l)));
    const accept = f.fateMoves.find(m => m.label === 'Accept');
    h.move({moveId: 'spare', targetId: accept.targetId});
    assert.equal(h.view().fight, undefined);
    assert.equal(h.view().last, 'won');
    assert.match(Object.fromEntries(h.view().account.items).Them, /yielded/);
    const k = host({stakes: {preset: 'brawl'}, foe: person});
    for(let n = 0; n < 6 && k.view().fight && !k.view().fight.fateMoves?.length; n++) k.run();
    k.move({moveId: 'finish', targetId: k.view().fight.fateMoves[0].targetId});
    assert.match(Object.fromEntries(k.view().account.items).Them, /killed/);
});
