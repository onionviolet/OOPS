// F1/F3/F4/F8 (LARGER_FOUNDATIONS): Tingen wage and divination knownness, fading by half-life, identity, and dues on unclaimed ground.
import test from 'node:test';
import assert from 'node:assert/strict';
import {knownness, registerKnownness, registerAuthoritySource, setKnownnessHalfLife, authorityOver} from '../src/authority.js';
import '../src/authority_sources.js';
import {registerPositionSource} from '../src/positions.js';
import {registerDutySet} from '../src/duties_domain.js';
import {domainRegistry} from '../src/domain_registry.js';

const DAY = 1440;
const post = (rank, startedAt = 0, ended) => ({id: `t.${rank}`, institution: 'the Nighthawks', role: 'Civil staff', rank, term: {type: 'hired', startedAt}, ...(ended ? {ended} : {}), source: 't'});
let rows = [];
registerPositionSource('t', () => rows);
const st = (clock, facts = {}, knowledge = {}) => ({clock, actors: {player: {facts}}, simulation: {knowledge: {player: knowledge}}});

test('wages read through positions@1 by how public the post is; a hermit trade or unlisted post adds nothing', () => {
    const at = st(100 * DAY);
    rows = [post('clerk')]; assert.equal(knownness(at, 'tingen').value, 2);
    rows = [post('night watchman')]; assert.equal(knownness(at, 'tingen').value, 1);
    rows = [post('probationer'), post('hermit')]; assert.equal(knownness(at, 'tingen').value, 0);
    rows = [];
});
test('a paid divination is a signal, dated by its session note, and an unpaid one is not', () => {
    const P = 'book.lotm.be.client.';
    const s = st(100 * DAY, {[`${P}anna`]: 'paid', [`${P}glacis`]: 'served_unpaid'}, {[`${P}anna.session`]: {at: 100 * DAY}});
    const k = knownness(s, 'tingen');
    assert.deepEqual(k.signals.map(x => x.id), ['divination:anna']); assert.equal(k.value, 1);
});
test('knownness from a 60-day-old sale is lower than from today, by the authority half-life', () => {
    registerAuthoritySource('t.fade', () => null);
    setKnownnessHalfLife('t.fade-town', 30, 'a market town forgets fast');
    setKnownnessHalfLife('t.fade-sect', 600, 'a sect keeps records');
    let sale = 100;
    for(const a of ['t.fade-town', 't.fade-sect']) registerKnownness(a, () => [{id: 'sale', weight: 1, at: sale, text: 'sold'}]);
    const now = st(100 * DAY);
    assert.equal(knownness(now, 't.fade-town').value, 1);
    sale = 40; // 60 days old
    assert.equal(knownness(now, 't.fade-town').value, 0.25);
    assert.equal(knownness(now, 't.fade-town').level, 'unknown');
    assert.ok(knownness(now, 't.fade-sect').value > 0.9);
    // no half-life, or no `at`: unchanged
    registerKnownness('t.plain', () => [{id: 'a', weight: 1, at: 0}, {id: 'b', weight: 1}]);
    assert.equal(knownness(now, 't.plain').value, 2);
    assert.throws(() => setKnownnessHalfLife('x', 10, ''));
});
test('a ended post fades from the day it ended', () => {
    rows = [post('clerk', 0, {kind: 'resign', at: 40 * DAY, reason: 'r'})];
    assert.equal(knownness(st(100 * DAY), 'tingen').value, 1); // 60 days at half-life 60
    rows = [];
});
test('an unknown ctx.identity reads zero; the default is the player', () => {
    rows = [post('clerk')];
    const s = st(10 * DAY, {'book.lotm.be.client.anna': 'paid'});
    assert.equal(knownness(s, 'tingen', {identity: 'nobody'}).value, 0);
    assert.equal(knownness(s, 'tingen', {identity: 'player'}).value, knownness(s, 'tingen').value);
    assert.equal(knownness(s, 'village', {identity: 'nobody', }).value, 0);
    assert.equal(knownness({...s, actors: {player: {facts: {'mg.plotRight': true}}}}, 'village', {identity: 'nobody'}).value, 0);
    rows = [];
});
test('Tingen knownness reaches authorityOver for the city, and unclaimed ground still has no claimant', () => {
    rows = [post('clerk')];
    const s = st(10 * DAY);
    assert.equal(authorityOver(s, {world: 'book.lotm.tingen', place: 'Tingen Docks'}).knows, true);
    rows = [];
    assert.equal(authorityOver(s, {world: 'book.lotm.tingen', place: 'Tingen Docks'}).knows, false);
    assert.equal(authorityOver(s, {world: 'book.lotm.tingen', place: 'Backwoods'}).claimant, null);
});
test('a dues week on unclaimed ground owes nothing; on claimed ground it is owed', () => {
    registerAuthoritySource('t.dues', (_s, {place}) => place === 'town' ? {claimant: 'council', inBounds: true} : null);
    registerKnownness('council', () => [{id: 'k', weight: 1}]);
    let place = 'wild', clock = 10;
    const WEEK = 7 * DAY;
    const def = {id: 't.fade.dues', schedule: {period: WEEK, opens: 0, closes: WEEK}, debtor: 'player', creditor: 'council', source: 't', why: 'w', authority: 't.dues',
        policy: {default: 'skip'}, dues: {amount: 60, basis: 'assumed', lateCycles: 1, steps: []}};
    registerDutySet('t.fade', {defs: [def], state: () => ({clock}), active: () => true, minute: s => s.clock, place: () => place, purse: {balance: () => 0, pay: () => {}}});
    const missed = () => domainRegistry.save({}).duties?.missed?.['t.fade.dues'] ?? 0;
    const weeks = n => { for(let i = 0; i < n; i++) { clock += WEEK; domainRegistry.tick(1); } };
    domainRegistry.load({}); domainRegistry.tick(1);
    weeks(3); assert.equal(missed(), 0);
    place = 'town'; weeks(2); assert.ok(missed() > 0, 'only the weeks back on claimed ground count');
});
