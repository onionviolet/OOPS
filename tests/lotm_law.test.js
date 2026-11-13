// STN18/STN19 + KNW5/KNW6/KNW11: Tingen's law by observation, the first caller of law_case.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import {authorityOver} from '../src/authority.js';
import '../src/authority_sources.js';
import {witnessesFor} from '../src/authority_witness.js';
import {caseFor} from '../src/law_case.js';
import {lookOf, armedOpenly, LOOK_KEY, SIGHT_KEY} from '../src/observed_look.js';
import {openCases, lawView, takeRoute, TINGEN_LAW, migrateLaw, lawRestore, lawSnapshot, LAW_DIALS} from '../src/book_world_lotm_law.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';

const C1 = 'book.lotm.constable.1', C2 = 'book.lotm.constable.2', DAY = 1440;
const note = (value, cause) => ({value, stage: 'seen', at: 5 * DAY, cause});
const coat = lookOf({body: '{"id":"grey coat"}'});
const state = (over = {}) => ({clock: 6 * DAY, actors: {player: {facts: {}}}, simulation: {people: {player: {location: 'Tingen docks'}},
    knowledge: {[C1]: {[SIGHT_KEY]: note('fought you and lost', 'tempo-sight:a'), [LOOK_KEY]: note(coat, 'tempo-sight:a')}}, ...over}});
test.beforeEach(() => lawRestore(migrateLaw(null)));

test('the witness reader feeds detect: a constable who noted you and your look gives a proven case (STN19)', () => {
    const w = witnessesFor('tingen', state());
    assert.deepEqual(w.map(x => x.id), [C1]);
    assert.equal(w[0].believed.look, coat);
    const [c] = openCases(state(), {look: coat});
    assert.equal(c.proven, true);
    assert.deepEqual(c.found, ['seen', 'described']);
    assert.equal(c.penalty.amount, 90);
});
test('the jurisdiction level is the one authority.js answers (STN18: one answer to who rules here)', () => {
    const s = state(), claim = authorityOver(s, {world: I.world, place: 'Tingen docks'});
    const [c] = openCases(s, {look: coat});
    assert.equal(c.level, claim.claimant);
    assert.equal(c.claimant, 'tingen');
});
test('outside the city nobody can act on a note (reach comes from authority.js)', () => {
    const s = state(); s.simulation.people.player.location = 'Village';
    assert.deepEqual(openCases(s, {look: coat}), []);
});
test('a changed outfit leaves the case unproven and it does not show; changing back reopens it (AD38, KNW6)', () => {
    const other = lookOf({body: '{"id":"dock coat"}'});
    const [c] = openCases(state(), {look: other});
    assert.equal(c.proven, false);
    assert.deepEqual(c.found, ['seen']);
    assert.equal(lawView(state(), {look: other, coins: 500}), null);
    assert.equal(openCases(state(), {look: coat})[0].proven, true);
});
test('a hidden pack and the player\'s own facts are not seen; only worn slots make a look and an open weapon (KNW22)', () => {
    assert.equal(lookOf({}), 'plain clothes');
    assert.equal(armedOpenly({weapon: 'x'}), true);
    assert.equal(armedOpenly({body: 'x'}), false);
    const s = state(); s.actors.player.facts = {'tempo.lastResult': 'won', carries_revolver: true};
    assert.equal(openCases(s, {look: coat}).length, 1); // facts and pack change nothing; only the note and the look do
});
test('a false belief is used as believed: the note decides, not the truth (KNW11)', () => {
    const s = state(); s.simulation.knowledge[C1][LOOK_KEY] = note(lookOf({body: 'a stranger'}), 'tempo-sight:a');
    assert.equal(openCases(s, {look: coat})[0].proven, false);
});
test('a person with no belonging to the city is no witness', () => {
    const s = state(); s.simulation.knowledge = {'someone.else': s.simulation.knowledge[C1]};
    assert.deepEqual(openCases(s, {look: coat}), []);
});
test('papers: a post the city keeps lets the constable pass the case to your office (exemption flag)', () => {
    const [c] = openCases(state(), {look: coat, papers: true});
    assert.equal(c.vouched, true);
    assert.equal(openCases(state(), {look: coat, papers: false})[0].vouched, false);
    const line = takeRoute(state(), c.id, 'papers', {look: coat, papers: true, at: 1});
    assert.match(line, /your office/);
    assert.deepEqual(openCases(state(), {look: coat, papers: true}), []);
    assert.throws(() => takeRoute(state(), c.id, 'papers', {look: coat}), /not open/);
});
test('papers you do not hold do not work', () => {
    const [c] = openCases(state(), {look: coat});
    assert.throws(() => takeRoute(state(), c.id, 'papers', {look: coat, papers: false}), /no papers/);
});
test('talk closes the case below the pleading level and is refused above it', () => {
    const [c] = openCases(state(), {look: coat});
    // no heat domain row in this isolated run: level 0, below the dial
    assert.match(takeRoute(state(), c.id, 'talk', {look: coat, at: 2}), /warning/);
    assert.equal(lawSnapshot().closed.length, 1);
    assert.equal(LAW_DIALS.pleaBelowLevel.value, 2);
});
test('the view lists the four routes with reasons when one is closed', () => {
    const v = lawView(state(), {look: coat, coins: 10});
    const routes = Object.fromEntries(v.cases[0].routes.map(r => [r.id, r.blocked]));
    assert.match(routes.pay, /short of the fine/);
    assert.match(routes.papers, /no papers/);
    assert.equal(routes.flee, null);
    assert.equal(lawView(state(), {look: coat, coins: null}).cases[0].routes.find(r => r.id === 'pay').blocked, 'You cannot pay from here yet.');
});
test('two constables who saw the same fight make one case; a second fight makes a second', () => {
    const s = state(); s.simulation.knowledge[C2] = structuredClone(s.simulation.knowledge[C1]);
    assert.equal(openCases(s, {look: coat}).length, 1);
    s.simulation.knowledge[C1][SIGHT_KEY] = note('fought you and lost', 'tempo-sight:b'); s.simulation.knowledge[C1][LOOK_KEY] = note(coat, 'tempo-sight:b');
    assert.equal(openCases(s, {look: coat}).length, 2);
});
test('case state saves only closures, loads back, and an untouched life holds no key', () => {
    const [c] = openCases(state(), {look: coat});
    takeRoute(state(), c.id, 'talk', {look: coat, at: 3});
    const saved = structuredClone(lawSnapshot());
    lawRestore(migrateLaw(saved));
    assert.deepEqual(openCases(state(), {look: coat}), []);
    assert.deepEqual(migrateLaw({family: 'x'}).closed, []);
    assert.deepEqual(migrateLaw({family: 'lotm_law@1', closed: [{id: 'a', how: 'bogus', at: 1, line: 'x'}]}).closed, []);
});
test('no dice and no omniscience: the same notes give the same case every time, and law_case has this caller', () => {
    assert.deepEqual(openCases(state(), {look: coat}), openCases(state(), {look: coat}));
    assert.equal(caseFor(TINGEN_LAW, 'strike-officer', 'tingen', {}, {scene: {witnesses: [], traces: []}}).primary, null);
});
