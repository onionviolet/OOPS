// W9-A: the hired-guard contract (an authored ordinary-man job in Tingen): sign once, the weekly night shift as a duty held by the row, seeded trouble that
// opens a tempo fight, pay per closed week stood, resign and term end, and a save round trip. Civil-staff and Beyonder lives stay as they were.
import test from 'node:test';
import assert from 'node:assert/strict';
import {bare, run, hostOver} from './lotm_helpers.js';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/positions_domain.js';
import {registerDutySet} from '../src/duties_domain.js';
import {positionsOf} from '../src/positions.js';
import {lotmDutyHeld, lotmPositionLine, lotmPositionsFromView} from '../src/book_world_lotm_positions.js';
import {LOTM_GUARD_DUTIES, LOTM_GUARD_DUTY_ID} from '../src/book_world_lotm_duties.js';
import {GUARD_DIALS, GUARD_TITLE, GUARD_POSITION_ID, guardDraw, guardChance, guardOwed, guardSignQuote, guardOpenerQuote, guardOpenerSpec, guardSettle, migrateGuard, guardView} from '../src/book_world_lotm_guard.js';
import {tempoOpener} from '../src/tempo_starters.js';

const WEEK = 7 * 24 * 60, PAY = GUARD_DIALS.weeklyPence.value, BONUS = GUARD_DIALS.wonBonusPence.value;
const live = {box: null};
registerDutySet('guard_test', {defs: LOTM_GUARD_DUTIES, state: () => live.box.p.state, active: st => lotmDutyHeld(st, LOTM_GUARD_DUTY_ID), minute: st => st.clock});
const dutyItems = () => domainRegistry.project('duties').items.filter(i => i.id === LOTM_GUARD_DUTY_ID);
const advance = (o, minutes) => { o.box.p = {...o.box.p, state: {...o.box.p.state, clock: o.box.p.state.clock + minutes}}; domainRegistry.tick(minutes); };
const st = o => o.box.p.state;
// A civil clerk who has not signed the Nighthawk contract holds no post: the hire is open. The world seed is chosen so this week's draw does (or does not) bring trouble.
function man(seedWantsTrouble) {
    domainRegistry.load({});
    const o = hostOver(bare(50));
    o.host.enroll('civil'); live.box = o.box;
    o.host.act('book.lotm.report_in'); // the contract note lives in the day's situation, which reporting in opens
    o.box.p.state.simulation.seed = pickSeed(o, seedWantsTrouble);
    return o;
}
function pickSeed(o, wants) {
    const cycles = [0, 1, 2, 3, 4, 5, 6, 7].map(i => Math.floor((o.box.p.state.clock + i * WEEK) / WEEK));
    for(let seed = 1; seed < 500; seed++) {
        const hits = cycles.map(c => guardDraw(seed, c) < guardChance(o.box.p.state));
        if(wants === 'all' ? hits.every(Boolean) : wants === 'none' ? hits.every(h => !h) : wants ? hits[0] : !hits[0]) return seed;
    }
    throw Error('no seed');
}
const withLog = (state, result, cause = 'tempo:1', at = state.clock) => { state.simulation.log.push({at, text: `${GUARD_TITLE}: ${result}.`, cause}); };
const money = o => o.box.p.external.money;

test('sign once: the offer shows to a free man, the row reads as hired for six weeks, a second signing is refused', () => {
    const o = man(false);
    const offer = o.host.view().guard.offer;
    assert.match(offer.text, /6 weeks, 1 pound 5 soli a week, one night shift a week/);
    assert.match(offer.text, /invented job/);
    assert.equal(positionsOf(st(o)).length, 0);
    o.host.signGuard();
    const [row] = positionsOf(st(o));
    assert.equal(row.id, GUARD_POSITION_ID);
    assert.equal(row.term.type, 'hired'); assert.equal(row.term.weeks, 6);
    assert.equal(row.term.endsAt, row.term.startedAt + 6 * WEEK);
    assert.deepEqual(row.pay, {amount: PAY, unit: 'pence', period: 'week'});
    assert.equal(row.exit.kinds[0], 'resign');
    assert.equal(lotmPositionLine([row], row.term.startedAt + WEEK), 'Hired guard, a Tingen riverside warehouse: hired, 1 pound 5 soli a week, six weeks. Five weeks left.');
    assert.match(lotmPositionLine([row], row.term.startedAt + 24 * 60), /Six weeks left\.$/, 'one day in rounds up, not down');
    assert.match(lotmPositionLine([row], row.term.endsAt - 60), /Less than a week left\.$/);
    assert.deepEqual(lotmPositionsFromView(o.host.view()), positionsOf(st(o)), 'panel view and state agree');
    assert.equal(o.host.view().guard.offer, null);
    assert.throws(() => o.host.signGuard(), /already taken this hire/);
});

test('a life that already holds a post cannot also take the hire (probationer)', () => {
    domainRegistry.load({});
    const o = hostOver(bare(50)); o.host.enroll('probationer');
    const q = guardSignQuote(st(o));
    assert.equal(q.eligible, false); assert.match(q.reason, /already hold a post \(probationer\)/);
    assert.throws(() => o.host.signGuard(), /already hold a post/);
    assert.equal(o.host.view().guard, null, 'nothing about guard work shows in a Beyonder-track panel');
});

test('the night shift is a duty only during the contract: absent before, present while hired, gone after the term and after resigning', () => {
    const o = man(false);
    assert.equal(dutyItems().length, 0);
    o.host.signGuard();
    assert.equal(dutyItems().length, 1);
    assert.equal(lotmDutyHeld(st(o), LOTM_GUARD_DUTY_ID), true);
    advance(o, 6 * WEEK + 5);
    assert.equal(lotmDutyHeld(st(o), LOTM_GUARD_DUTY_ID), false, 'term over');
    assert.equal(dutyItems().length, 0);
    const [row] = positionsOf(st(o));
    assert.equal(row.ended.kind, 'term_end');
    assert.match(lotmPositionLine([row], st(o).clock), /Ended: the hire ran its term after 6 weeks\.$/);
    assert.throws(() => o.host.resign(GUARD_POSITION_ID), /already run its term/);
    const p = man(false); p.host.signGuard(); advance(p, 2 * WEEK); p.host.resign(GUARD_POSITION_ID);
    assert.equal(dutyItems().length, 0, 'resigned');
    assert.throws(() => p.host.standWatch(), /no watch to stand/);
});

test('trouble on a shift is drawn by seed and week; a quiet seed gives none and one stood shift per week', () => {
    const q = man(false);
    q.host.signGuard();
    assert.match(q.host.standWatch(), /quiet night/);
    assert.equal(guardOpenerQuote(st(q)).visible, false, 'no trouble, no opener');
    assert.throws(() => q.host.standWatch(), /stood this week|Not open|stood/);
    const t = man(true);
    t.host.signGuard();
    assert.match(t.host.standWatch(), /Thieves are at the warehouse door/);
    const opener = guardOpenerQuote(st(t));
    assert.equal(opener.visible, true); assert.equal(opener.eligible, true);
    assert.match(opener.reason, /Win and the foreman adds a bonus/);
    assert.match(t.host.view().guard.trouble, /Thieves are at the warehouse door/);
    assert.equal(tempoOpener('lotm.guard.trouble').label, 'Face the thieves at the warehouse door');
    // the draw is a pure function of the world seed and the week
    assert.equal(guardDraw(7, 3), guardDraw(7, 3)); assert.notEqual(guardDraw(7, 3), guardDraw(8, 3));
});

test('the opener spec reuses the street robber foe at the warehouse door, with no gun unless a loaded revolver is held', () => {
    const o = man(true); o.host.signGuard();
    const helpers = {me: {stats: {}}, vitals: {health: 24, max_health: 24, stamina: 18, max_stamina: 18}, parts: {}, enemyProfile: (body, name, id) => ({body, name, id})};
    const spec = guardOpenerSpec(st(o), {}, helpers);
    assert.equal(spec.title, GUARD_TITLE); assert.equal(spec.id, 'lotm-guard-thief');
    const [me, foe] = spec.fighters;
    assert.equal(foe.name, 'A thief at the warehouse door'); assert.equal(foe.id, 'book.lotm.proof.robber');
    assert.deepEqual(me.moves, ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield']); assert.equal(me.stock, undefined);
});

test('fight results: won pays a bonus, lost and yielded dock the week, withdrawn leaves the thieves, an unfaced week docks itself', () => {
    const run1 = (result) => { const o = man(true); o.host.signGuard(); o.host.standWatch(); withLog(st(o), result); return o; };
    let o = run1('won'); guardSettle(st(o));
    assert.equal(guardView(st(o)).trouble, ''); assert.equal(guardOwed(st(o)).bonus, BONUS);
    assert.match(guardView(st(o)).lines.at(-1), /drove the thieves off/);
    guardSettle(st(o)); assert.equal(guardOwed(st(o)).bonus, BONUS, 'a fight is applied once');
    advance(o, WEEK); assert.equal(guardOwed(st(o)).weeks, 1); assert.equal(guardOwed(st(o)).pence, PAY + BONUS);
    for(const result of ['lost', 'yielded']) {
        o = run1(result); guardSettle(st(o));
        advance(o, WEEK);
        assert.equal(guardOwed(st(o)).weeks, 0, `${result}: that week is docked`);
        assert.equal(guardOpenerQuote(st(o)).visible, false);
    }
    o = run1('withdrawn'); guardSettle(st(o));
    assert.equal(guardOpenerQuote(st(o)).visible, true, 'withdrawn leaves the thieves at the door');
    advance(o, WEEK);
    assert.equal(guardOpenerQuote(st(o)).visible, false);
    assert.equal(guardOwed(st(o)).weeks, 0, 'the week closed with them at the door: docked');
    assert.match(guardView(st(o)).lines.at(-1), /got clear with the goods/);
});

test('pay accrues per closed week stood: unstood weeks pay nothing, the week in progress is not yet paid, collecting adds the purse once', () => {
    const o = man('none'); o.host.signGuard();
    o.host.standWatch();
    assert.equal(guardOwed(st(o)).weeks, 0, 'this week has not closed');
    advance(o, WEEK);                                 // week 1 closed, stood
    advance(o, WEEK);                                 // week 2 closed, not stood
    o.host.standWatch();                              // week 3 stood, still open
    advance(o, WEEK);                                 // week 3 closed
    assert.equal(guardOwed(st(o)).weeks, 2);
    const before = money(o);
    o.host.collectGuardPay();
    assert.equal(money(o) - before, 2 * PAY);
    assert.equal(guardOwed(st(o)).pence, 0);
    assert.throws(() => o.host.collectGuardPay(), /Nothing to collect/);
});

test('resign forfeits the week in progress; weeks already closed stay collectible; the term end closes its last week', () => {
    const o = man('none'); o.host.signGuard();
    o.host.standWatch(); advance(o, WEEK);
    o.host.standWatch();                              // second week, in progress
    o.host.resign(GUARD_POSITION_ID);
    assert.equal(positionsOf(st(o))[0].ended.kind, 'resign');
    assert.equal(guardOwed(st(o)).weeks, 1);
    advance(o, 10 * WEEK); assert.equal(guardOwed(st(o)).weeks, 1, 'pay does not keep running after the exit');
    const before = money(o); o.host.collectGuardPay(); assert.equal(money(o) - before, PAY);
    // a full term: stand every week, the last week closes with the contract
    const f = man('none'); f.host.signGuard();
    for(let i = 0; i < 6; i++) { f.host.standWatch(); advance(f, WEEK); }
    advance(f, 2 * WEEK);
    assert.equal(positionsOf(st(f))[0].ended.kind, 'term_end');
    assert.equal(guardOwed(st(f)).weeks, 6);
});

test('save and reload keep the stood weeks, the docked week, the bonus, the waiting trouble and the resign record', () => {
    const o = man(true); o.host.signGuard();
    o.host.standWatch();                              // trouble waiting
    const env = domainRegistry.save({});
    assert.equal(env.lotm_guard.family, 'lotm_guard@1');
    assert.equal(env.lotm_guard.trouble.cycle, Math.floor(st(o).clock / WEEK));
    const before = {owed: guardOwed(st(o)), rows: positionsOf(st(o)), quote: guardOpenerQuote(st(o))};
    domainRegistry.load(JSON.parse(JSON.stringify(env)));
    assert.deepEqual(guardOwed(st(o)), before.owed); assert.deepEqual(positionsOf(st(o)), before.rows); assert.deepEqual(guardOpenerQuote(st(o)), before.quote);
    advance(o, WEEK);
    o.host.resign(GUARD_POSITION_ID);
    const env2 = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(env2.positions.records[GUARD_POSITION_ID].exit.kind, 'resign');
    domainRegistry.load(env2);
    assert.equal(positionsOf(st(o))[0].ended.kind, 'resign');
    assert.deepEqual(migrateGuard({family: 'x'}).stood, []); assert.equal(migrateGuard({family: 'lotm_guard@1', stood: [1, 'a', -1, 2]}).stood.length, 2);
    domainRegistry.load({});
    assert.equal(domainRegistry.save({}).lotm_guard, undefined, 'an untouched life writes no key');
});

test('civil staff and Beyonder lives are unchanged: no guard rows, the civil post still signs, rows and view carry no guard block', () => {
    domainRegistry.load({});
    const o = hostOver(bare(50)); o.host.enroll('civil'); live.box = o.box;
    let p = run(o.box.p, 'report_in'); p = run(p, 'sign_contract'); o.box.p = p;
    const rows = positionsOf(st(o));
    assert.equal(rows.length, 1); assert.equal(rows[0].role, 'Civil staff');
    assert.equal(o.host.view().guard, null, 'a signed clerk holds a post, so the hire is not offered');
    assert.equal(lotmPositionLine(rows), 'Civil staff, Nighthawks: contract, 3 pounds a week, five years');
});

test('the hire waits for the day to begin: before reporting in the offer is closed, so the contract note never lacks its situation', () => {
    domainRegistry.load({});
    const o = hostOver(bare(50)); o.host.enroll('civil'); live.box = o.box;
    const q = guardSignQuote(st(o));
    assert.equal(q.eligible, false); assert.match(q.reason, /Report in at the workroom first/);
    assert.throws(() => o.host.signGuard(), /Report in at the workroom first/);
    o.host.act('book.lotm.report_in');
    assert.equal(guardSignQuote(st(o)).eligible, true);
});
