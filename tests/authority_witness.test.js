// F2 (LARGER_FOUNDATIONS): witnesses are knownness rows from observers that belong to an authority.
import test from 'node:test';
import assert from 'node:assert/strict';
import {knownness, setKnownnessHalfLife} from '../src/authority.js';
import {registerWitnessBelonging} from '../src/authority_witness.js';
import '../src/authority_sources.js';

const DAY = 1440, T = 'person.player.';
const see = (value, at) => ({value, stage: 'seen', at, cause: 't'});
const state = (clock, knowledge) => ({clock, actors: {player: {facts: {}}}, simulation: {knowledge}});
registerWitnessBelonging('t.town', (s, id) => id === 'constable' ? {weight: 1, label: 'The constable', reason: 'He files the watch book the town reads.'} : null);
registerWitnessBelonging('t.sect', (s, id) => id === 'elder' ? {weight: 1, label: 'The elder', reason: 'He keeps the sect register.'} : null);
setKnownnessHalfLife('t.town', 30, 'a town forgets quickly');

test('a constable who saw the player adds a row to his own authority only', () => {
    const s = state(10 * DAY, {constable: {[`${T}fight`]: see('brawled in the square', 10 * DAY)}});
    const k = knownness(s, 't.town');
    assert.deepEqual(k.signals.map(x => x.id), ['witness:constable']);
    assert.equal(k.value, 1);
    assert.equal(knownness(s, 't.sect').value, 0);
    assert.equal(knownness(s, 'village').value, 0);
});
test('an observer with a false belief adds what he believes, not the truth', () => {
    const s = state(10 * DAY, {constable: {[`${T}fight`]: see('started the fight', 10 * DAY)}});
    s.actors.player.facts.truth = 'was only defending';
    const row = knownness(s, 't.town').signals[0];
    assert.match(row.text, /started the fight/);
    assert.doesNotMatch(row.text, /defending/);
});
test('an observer with no belonging adds nothing, and neither does the player\'s own sight', () => {
    const s = state(10 * DAY, {stranger: {[`${T}fight`]: see('x', 10 * DAY)}, player: {[`${T}fight`]: see('x', 10 * DAY)}, constable: {'person.someoneElse.k': see('y', 10 * DAY)}});
    assert.equal(knownness(s, 't.town').value, 0);
    assert.equal(knownness(s, 't.sect').value, 0);
});
test('old observations fade by the authority half-life', () => {
    const mk = at => state(100 * DAY, {constable: {[`${T}fight`]: see('a brawl', at)}, elder: {[`${T}fight`]: see('a brawl', at)}});
    assert.equal(knownness(mk(100 * DAY), 't.town').value, 1);
    assert.equal(knownness(mk(40 * DAY), 't.town').value, 0.25); // 60 days at half-life 30
    assert.equal(knownness(mk(40 * DAY), 't.sect').value, 1);   // no half-life: unchanged
});
test('a belonging without a reason, or a thrown reader, counts for nothing; a bad registration is refused', () => {
    registerWitnessBelonging('t.bad', () => ({weight: 1}));
    registerWitnessBelonging('t.throw', () => { throw Error('x'); });
    const s = state(1, {constable: {[`${T}k`]: see('v', 1)}});
    assert.equal(knownness(s, 't.bad').value, 0);
    assert.equal(knownness(s, 't.throw').value, 0);
    assert.throws(() => registerWitnessBelonging('', () => null));
});
