// Terms for a fight (PS34-PS44, proposals): defaults by world frame and foe kind, the clash with binding stakes, losing terms, and
// Pulled Blows' skill making a slip rarer in the live fight.
import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultTerms, termsFor, termsClash, foeKind, asksNow, losingMove, wantsText, canTakeAlive, TERMS_FACT, theirTerms, robbedAmount} from '../src/fight_terms.js';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, driveTempoFight} from '../src/tempo_fight.js';

test('defaults come from the frame and the foe: a hunt finishes, a duel spares, a person asks, the old wilds fight to the end', () => {
    assert.equal(defaultTerms({preset: 'hunt', lethal: true}, 'beast').terms, 'finish');
    assert.equal(defaultTerms({preset: 'duel'}, 'person').terms, 'spare');
    assert.equal(defaultTerms({preset: 'mugging'}, 'person').terms, 'ask');
    assert.equal(defaultTerms({frame: 'original'}, 'person').terms, 'finish', 'the grind keeps today\'s play');
    for(const t of [defaultTerms({preset: 'hunt'}, 'beast'), defaultTerms({}, 'other')]) assert.ok(t.reason.length > 10);
    assert.equal(termsFor({[TERMS_FACT('beast')]: 'spare'}, {preset: 'hunt'}, 'beast').terms, 'spare');
    const noNet = termsFor({[TERMS_FACT('beast')]: 'take_alive'}, {preset: 'hunt'}, 'beast', {player: {means: {}}});
    assert.equal(noNet.terms, 'finish'); assert.match(noNet.why, /Nothing to bind/);
    assert.ok(canTakeAlive({means: {net: 1}}));
});

test('kinds, the clash with binding stakes, when a body asks, losing terms and what the other side wants', () => {
    assert.equal(foeKind({tags: {living: true, human: true}}), 'person', 'the original game tags humans');
    assert.equal(foeKind({tags: ['living', 'beast']}), 'beast');
    assert.match(termsClash({preset: 'duel'}, 'finish'), /breaks the duel/);
    assert.equal(termsClash({preset: 'duel'}, 'spare'), '');
    assert.ok(asksNow({terms: 'finish', kind: 'person'}), 'a person asks whatever the setting');
    assert.ok(asksNow({terms: 'finish', kind: 'beast', shifted: true}), 'a shift asks');
    assert.ok(!asksNow({terms: 'spare', kind: 'beast'}));
    assert.equal(losingMove({losing: 'breakoff', hp: 9, maxHp: 30}), 'withdraw');
    assert.equal(losingMove({losing: 'breakoff', hp: 20, maxHp: 30}), null);
    assert.equal(losingMove({losing: 'fight_on', hp: 1, maxHp: 30}), null);
    assert.match(wantsText({tags: ['beast']}), /fights to eat/);
    assert.match(wantsText({tags: ['person']}, {preset: 'mugging'}), /purse, not your life/);
});

test('Pulled Blows: a practised hand slips less often than a new one', () => {
    const base = joinField(createFieldFixture());
    const context = fieldContext(base, 'Village', {vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}});
    const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: .3, crit_multiplier: 1.5, stamina_efficiency: 1};
    const big = {stats, attackPower: 400, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5};
    const kills = holdSkill => Array.from({length: 24}, (_, i) => {
        const state = structuredClone(base.state); state.simulation.seed = 300 + i;
        const p = beginTempoFight(state, registry, context, {id: 'fx-pull', title: 'Pull', floor: 1, stakes: {preset: 'hunt'}, terms: {beast: 'spare'}, fighters: [
            {id: 'player', name: 'You', side: 'a', speed: 100, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile: big, perception: 20, stealth: 20, holdBack: true, ...(holdSkill ? {holdSkill} : {})},
            {id: 'foe1', name: 'A wolf', side: 'b', tags: ['beast'], speed: 60, hp: 6, maxHp: 30, stamina: 30, maxStamina: 30, profile: {...big, attackPower: 2}, perception: 20, stealth: 20}]});
        return driveTempoFight(p.state, registry, context, 'aggressive').fightEnd[0].end === 'killed';
    }).filter(Boolean).length;
    const raw = kills(0), practised = kills(1);
    assert.ok(raw > 0, `an untrained hold slips with a blow this heavy: ${raw}`);
    assert.ok(practised < raw, `a practised hold slips less: ${practised} < ${raw}`);
});

test('their terms when you go down come from the stakes: a robber robs, a duel spares, a killing fight leaves you for dead', () => {
    assert.equal(theirTerms({preset: 'mugging'}, 'person').terms, 'rob');
    assert.equal(theirTerms({preset: 'duel'}, 'person').terms, 'spare');
    assert.equal(theirTerms({preset: 'hunt', lethal: true}, 'beast').terms, 'leave_for_dead');
    assert.equal(theirTerms({arrest: true}, 'person').terms, 'capture');
    assert.equal(theirTerms({frame: 'original'}, 'beast').terms, 'leave_for_dead');
    assert.equal(theirTerms({preset: 'brawl', theirs: {terms: 'capture', text: 'They drag you to the cellar.'}}).text, 'They drag you to the cellar.');
    assert.deepEqual([robbedAmount(0), robbedAmount(1), robbedAmount(9), robbedAmount(100)], [0, 1, 5, 50]);
});

test('a robbery you lose takes from your purse in the same commit and says so', () => {
    const base = joinField(createFieldFixture());
    const context = fieldContext(base, 'Village', {vitals: {player: {health: 30, max_health: 30, stamina: 30, max_stamina: 30}}});
    const stats = {attack_points: 45, agility: 5, intuition: 5, defense: 1, attack_count: 1, crit_rate: 0, crit_multiplier: 1.5, stamina_efficiency: 1};
    const state = structuredClone(base.state); state.simulation.seed = 11;
    const p = beginTempoFight(state, registry, context, {id: 'fx-rob', title: 'Rob', floor: 1, stakes: {preset: 'mugging'}, fighters: [
        {id: 'player', name: 'You', side: 'a', speed: 40, hp: 2, maxHp: 30, stamina: 30, maxStamina: 30, profile: {stats, attackPower: 1, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5}, perception: 20, stealth: 20},
        {id: 'foe1', name: 'The robber', side: 'b', tags: ['person'], speed: 120, hp: 30, maxHp: 30, stamina: 30, maxStamina: 30, profile: {stats, attackPower: 40, shield: 0, shieldSkill: 0, emptyStaminaMultiplier: .5}, perception: 20, stealth: 20}]});
    const end = p.state.simulation.sessions.player ? driveTempoFight(p.state, registry, context, 'aggressive') : p; // a fast robber may finish it in the opening
    assert.equal(end.state.actors.player.facts['tempo.lastResult'], 'lost');
    assert.equal(end.theirTerms, 'rob');
    assert.equal(end.external.money, context.external.money - robbedAmount(context.external.money));
    assert.match(end.fightTaken, /The robber took about half of what you carried/);
});
