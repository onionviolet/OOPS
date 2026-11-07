import test from 'node:test';
import assert from 'node:assert/strict';
import {bare, run, wait, hostOver} from './lotm_helpers.js';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/positions_domain.js';
import {registerDutySet} from '../src/duties_domain.js';
import {positionsOf, migratePositions, freshPositions, POSITIONS_FAMILY} from '../src/positions.js';
import {lotmPositions, lotmPositionLine, lotmPositionsFromView, lotmDutyHeld, termLeftWords, LOTM_YEAR_MINUTES, lotmResignPlan} from '../src/book_world_lotm_positions.js';
import {LOTM_CIVIL_DUTIES, LOTM_CIVIL_DUTY_ID} from '../src/book_world_lotm_duties.js';
import {weeksOwed, CIVIL_POSITION_ID} from '../src/book_world_lotm_lives.js';
import {groupsOf, groupLines} from '../src/organizations.js';
import '../src/book_world_lotm_organizations.js';

const WEEK = 7 * 24 * 60, DAY = 24 * 60;
const live = {box: null};
registerDutySet('civil_test', {defs: LOTM_CIVIL_DUTIES, state: () => live.box.p.state, active: st => lotmDutyHeld(st, LOTM_CIVIL_DUTY_ID), minute: st => st.clock});
const slice = () => domainRegistry.save({}).positions;
// A civil clerk who has signed. The host persist port stores the plan, so resign() runs for real over the fake ports.
function clerk() {
    domainRegistry.load({});
    const o = hostOver(bare(50));
    o.host.enroll('civil');
    let p = run(o.box.p, 'report_in');
    p = run(p, 'sign_contract');
    o.box.p = p; live.box = o.box;
    return o;
}
const rows = o => positionsOf(o.box.p.state);
const advance = (o, minutes) => { o.box.p = {...o.box.p, state: {...o.box.p.state, clock: o.box.p.state.clock + minutes}}; };

test('term remaining reads in plain words: four years and 11 months left a week after signing', () => {
    const o = clerk(), start = rows(o)[0].term.startedAt;
    assert.equal(rows(o)[0].term.endsAt, start + 5 * LOTM_YEAR_MINUTES);
    assert.equal(termLeftWords(start + 5 * LOTM_YEAR_MINUTES, start + WEEK), 'four years and 11 months left');
    assert.equal(lotmPositionLine(rows(o), start + WEEK), 'Civil staff, Nighthawks: contract, 3 pounds a week, five years. Four years and 11 months left.');
    assert.equal(lotmPositionLine(rows(o)), 'Civil staff, Nighthawks: contract, 3 pounds a week, five years', 'without a clock the base line is unchanged');
    assert.equal(termLeftWords(1010 * DAY, 1000 * DAY), 'less than a month left');
    assert.equal(termLeftWords(10 * LOTM_YEAR_MINUTES, 10 * LOTM_YEAR_MINUTES - 390 * DAY).replace(/ left/, ''), 'one year and 1 month');
    assert.equal(termLeftWords(100, 200), 'the term has run out');
    assert.equal(o.host.view().termDay, Math.floor(o.box.p.state.clock / DAY), 'the panel view carries the day for the term line');
});

test('resign once: the row reads as ended, the record is saved, a second resign is refused with its reason', () => {
    const o = clerk(), startedAt = rows(o)[0].term.startedAt;
    assert.equal(slice(), undefined, 'a signed but unresigned clerk writes no positions key');
    advance(o, 3 * WEEK + 5);
    o.host.resign();
    const [row] = rows(o);
    assert.equal(row.ended.kind, 'resign');
    assert.equal(row.ended.at, o.box.p.state.clock);
    assert.match(row.ended.reason, /Resigned/);
    assert.deepEqual(lotmPositionsFromView(o.host.view()), rows(o), 'panel view and state agree');
    assert.match(lotmPositionLine(rows(o), o.box.p.state.clock), /Ended: you resigned after 3 weeks\.$/);
    assert.equal(slice().records[CIVIL_POSITION_ID].startedAt, startedAt);
    assert.match(o.host.view().records.find(r => r.id === 'book.lotm.resigned').text, /You resigned/);
    assert.throws(() => o.host.resign(), /already resigned/);
    assert.throws(() => lotmResignPlan(o.box.p.state), /already resigned/);
    assert.equal(Object.keys(slice().records).length, 1, 'recorded once');
});

test('resign with no post to leave is refused (probationer, unsigned clerk)', () => {
    domainRegistry.load({});
    const o = hostOver(bare(50)); o.host.enroll('probationer');
    assert.throws(() => o.host.resign(), /no post to resign/);
    const c = hostOver(bare(50)); c.host.enroll('civil');
    assert.throws(() => c.host.resign(), /no post to resign/, 'a civil clerk who has not signed holds no post');
    assert.equal(slice(), undefined);
});

test('the cost: the week in progress is forfeited, earned weeks stay collectible, rent is untouched', () => {
    const o = clerk();
    advance(o, 2 * WEEK + 10);
    assert.equal(weeksOwed(o.box.p.state), 3, 'before resigning: weeks 1 to 3 are owed');
    o.host.resign();
    assert.equal(weeksOwed(o.box.p.state), 2, 'after: only the two whole weeks served');
    advance(o, 10 * WEEK);
    assert.equal(weeksOwed(o.box.p.state), 2, 'pay does not keep running after the exit');
    assert.match(rows(o)[0].exit.cost, /lodging rent still falls due/);
});

test('the post\'s weekly duty stops after resigning, through the duties seam', () => {
    const o = clerk();
    const open = () => domainRegistry.project('duties').rows.some(r => r.id === `duty:${LOTM_CIVIL_DUTY_ID}`);
    domainRegistry.tick(1);
    assert.equal(lotmPositions(o.box.p.state)[0].duties[0], LOTM_CIVIL_DUTY_ID);
    assert.equal(domainRegistry.project('duties').enrolled, true);
    assert.equal(open(), true, 'held post: the duty is on the ledger');
    advance(o, 2 * WEEK + 3); domainRegistry.tick(1);
    const missed = () => domainRegistry.save({}).duties?.missed?.[LOTM_CIVIL_DUTY_ID] ?? 0;
    assert.ok(missed() >= 1, 'an unattended week counts while the post is held');
    o.host.resign();
    assert.equal(domainRegistry.project('duties').enrolled, false);
    assert.equal(open(), false);
    const before = missed();
    advance(o, 6 * WEEK); domainRegistry.tick(1);
    assert.equal(missed(), before, 'weeks after the exit are not charged as misses');
});

test('save, reload and import: positions@1 round-trips and keeps the exit', () => {
    const o = clerk(); advance(o, WEEK + 1);
    o.host.resign();
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    assert.equal(saved.positions.family, POSITIONS_FAMILY);
    domainRegistry.load({});
    assert.equal(rows(o)[0].ended, undefined, 'a fresh load has no exit');
    domainRegistry.load(saved);
    assert.equal(rows(o)[0].ended.kind, 'resign');
    assert.deepEqual(JSON.parse(JSON.stringify(domainRegistry.save({}).positions)), saved.positions);
    domainRegistry.validate(saved);
});

test('an earlier life\'s record does not end a later post (record is tied to its start)', () => {
    const o = clerk(); advance(o, WEEK); o.host.resign();
    const saved = JSON.parse(JSON.stringify(domainRegistry.save({})));
    const next = hostOver(bare(50)); next.host.enroll('civil');
    let p = run(next.box.p, 'report_in');
    p = wait(p, 40 * WEEK);
    next.box.p = run(p, 'sign_contract'); live.box = next.box;
    domainRegistry.load(saved);
    const row = rows(next)[0];
    assert.notEqual(row.term.startedAt, saved.positions.records[CIVIL_POSITION_ID].startedAt);
    assert.equal(row.ended, undefined, 'a new signing is a new post');
    assert.equal(weeksOwed(next.box.p.state), 1);
});

test('failure scenario: an untouched save gets no positions key and loads identically; junk loads fresh', () => {
    domainRegistry.load({});
    const o = hostOver(bare(50)); o.host.enroll('probationer');
    const env = domainRegistry.save({});
    assert.equal('positions' in env, false);
    const before = JSON.stringify(env);
    domainRegistry.load(JSON.parse(before));
    assert.equal(JSON.stringify(domainRegistry.save({})), before);
    assert.deepEqual(migratePositions(undefined), freshPositions());
    assert.deepEqual(migratePositions({family: 'other@9', records: {x: 1}}), freshPositions());
    assert.deepEqual(migratePositions({family: POSITIONS_FAMILY, records: {a: {startedAt: 1, exit: {kind: 'nope', at: 2, reason: 'x'}}, b: {startedAt: 5, exit: {kind: 'resign', at: 9, reason: 'ok'}}}}).records,
        {b: {startedAt: 5, exit: {kind: 'resign', at: 9, reason: 'ok'}}});
    assert.doesNotThrow(() => domainRegistry.validate({positions: {family: 'other@9'}}));
});

test('a failed save puts the exit back: the post is still held and the slice stays empty', () => {
    const o = clerk(); advance(o, WEEK);
    const o2 = hostOver(o.box.p, {persist: () => { throw Error('Saving is paused.'); }});
    live.box = o2.box;
    assert.throws(() => o2.host.resign(), /Saving is paused/);
    assert.equal(rows(o2)[0].ended, undefined);
    assert.equal(slice(), undefined);
});

test('groups line: the player\'s team shows; the hidden gathering stays out; a resigned clerk is no longer in the team', () => {
    const o = clerk();
    assert.deepEqual(o.host.view().groups, ['Nighthawks, a church team (active). Members: clerk.']);
    assert.equal(groupsOf(o.box.p.state, {includeHidden: true}).every(g => g.kind !== 'secret_society' || g.hidden), true);
    assert.ok(!groupLines(groupsOf(o.box.p.state)).join(' ').includes('hidden gathering'));
    o.host.resign();
    assert.deepEqual(o.host.view().groups, []);
    const p = hostOver(bare(50)); p.host.enroll('probationer');
    assert.deepEqual(p.host.view().groups, ['Nighthawks, a church team (active). Members: probationer.']);
});
