import test from 'node:test';
import assert from 'node:assert/strict';
import {hpSpellPower, spellMastery, duelHit, duelLandChance, duelHitWhy, duelReadiness, practisedKitRow, practiseDuelKit, HP_DUEL_PRACTICE} from '../src/hp_duel_mastery.js';
import {validateTempoKitRow} from '../src/tempo_kit.js';
import {HP_LEVITATION} from '../src/world_packs/book_hp_lead_life_data.js';

const withMastery = (powers) => ({simulation: {powers: {player: Object.fromEntries(Object.entries(powers).map(([id, mastery]) => [id, {owned: true, mastery}]))}}});
const legLock = {label: 'Locomotor Mortis', text: 'The Leg-Locker Curse: the legs snap together.', cost: 4, power: 0, hit: 1.2, needs: {wand: 1}, stun: 8, why: 'The Leg-Locker Curse.'};
const me = {stats: {attack_points: 5, agility: 5, intuition: 5}}, draco = {stats: {agility: 6, intuition: 5}};

test('power ids follow the spell pack row and the levitation row maps to the existing charm', () => {
    assert.equal(hpSpellPower('leg-lock'), 'book.hp.lead.spell.leg_lock');
    assert.equal(hpSpellPower('body-bind'), 'book.hp.lead.spell.body_bind');
    assert.equal(hpSpellPower('levitation'), HP_LEVITATION);
    assert.throws(() => hpSpellPower('no-such-spell'));
});

test('no practice keeps the base hit exactly; practice raises it, bounded by the kit cap', () => {
    for(const base of [.8, 1.2, 3, 1.23456]) assert.equal(duelHit(base, 0), base);
    assert.ok(duelHit(1.2, 3) > 1.2);
    assert.equal(duelHit(1.2, 50), duelHit(1.2, HP_DUEL_PRACTICE.steps.value));
    for(const base of [.8, 1.2, 2.5, 3]) for(const m of [0, 1, 10, 1e9]) assert.ok(duelHit(base, m) <= 3);
    assert.equal(duelHit(1.2, -4), 1.2);
});

test('practice is per spell: levitation practice does not steady the leg-lock', () => {
    const state = withMastery({[HP_LEVITATION]: 9, [hpSpellPower('body-bind')]: 2});
    assert.equal(spellMastery(state, 'leg-lock'), 0);
    assert.equal(spellMastery(state, 'body-bind'), 2);
    assert.equal(practisedKitRow(legLock, state, 'leg-lock').hit, 1.2);
});

test('the practised row still validates, keeps its why and shows the landing odds', () => {
    const state = withMastery({[hpSpellPower('leg-lock')]: 3});
    const row = practisedKitRow(legLock, state, 'leg-lock', me, draco);
    assert.ok(validateTempoKitRow(row));
    assert.deepEqual(Object.keys(row).sort(), Object.keys(legLock).sort());
    assert.match(row.why, /^The Leg-Locker Curse\. Locomotor Mortis practised 3 times: lands about \d+ in 10\.$/);
    const ready = duelReadiness(state, 'leg-lock', 1.2, me, draco);
    assert.ok(ready.chance > duelLandChance(1.2, me, draco));
    assert.equal(duelReadiness(withMastery({}), 'leg-lock', 1.2).chance, null);
    assert.match(duelHitWhy('body-bind', 0), /never practised/);
});

test('the fight wrapper changes only the player kit rows it names and reads the foe as target', () => {
    const state = withMastery({[hpSpellPower('leg-lock')]: 4});
    const fighters = [{id: 'player', side: 'a', profile: me, kit: {leg_lock: legLock, snatch: {label: 'Snatch', text: 'Grab it.', cost: 4, hit: .9}}},
        {id: 'hp.corridor.draco', side: 'b', profile: draco, kit: {leg_lock: legLock}}];
    const out = practiseDuelKit(state, fighters, {leg_lock: 'leg-lock', body_bind: 'body-bind'});
    assert.equal(out[0].kit.leg_lock.hit, duelHit(1.2, 4));
    assert.match(out[0].kit.leg_lock.why, /lands about \d+ in 10/);
    assert.equal(out[0].kit.snatch, fighters[0].kit.snatch);
    assert.equal(out[1], fighters[1]);
    assert.equal(legLock.hit, 1.2);
    assert.equal(duelLandChance(1.2, {stats: {}}, draco), null);
});
