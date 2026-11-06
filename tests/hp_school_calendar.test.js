import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {schoolYearPosition, schoolYearText, SCHOOL_YEAR} from '../src/book_world_hp_school_calendar.js';
import {HP_DUTIES, HP_AT_SCHOOL_FACT, hpDutySet} from '../src/book_world_hp_duties.js';
import {registerHpLeadDomain} from '../src/book_world_hp_lead_domain.js';
import {readLocalClock} from '../src/today_strip.js';
const P = 'book.hp.lead', DAY = 1440, ID = 'hp.lead.class_slot';
// Lead clock: opening at minute 0 (day 0 08:00 per the calendar anchor); elapsed play minutes = state.clock.
const mk = (day, hour = 8, atSchool) => ({clock: day * DAY + (hour - 8) * 60,
    actors: {player: {worldId: `${P}.world`, ...(atSchool === undefined ? {} : {facts: {[HP_AT_SCHOOL_FACT]: atSchool}})}},
    simulation: {knowledge: {player: {[`${P}.opening`]: {at: 0}}}}, worlds: {[`${P}.world`]: {facts: {[`${P}.instance`]: 'i1'}}}});
let state = mk(0);
registerHpLeadDomain(def => def, () => state, {read() {}, command() {}});

test('mapping: day 0 is 31 July, day 32 is 1 September (the book), Christmas is day 147', () => {
    assert.equal(SCHOOL_YEAR[0].day, 32); assert.match(SCHOOL_YEAR[0].source, /1 September/);
    assert.deepEqual(schoolYearPosition(0), {phase: 'summer_before', next: {id: 'term_start', label: 'Term starts', date: '1 September', inDays: 32}});
    assert.equal(schoolYearPosition(31).next.inDays, 1);
    assert.equal(schoolYearPosition(32).phase, 'term');
    assert.equal(schoolYearPosition(147).phase, 'christmas_break'); // 25 December = 31 Aug days + 30 + 31 + 30 + 25 after 31 July
    assert.equal(schoolYearPosition(158).phase, 'term');
    assert.equal(schoolYearPosition(329).phase, 'summer_after'); assert.equal(schoolYearPosition(329).next, null);
    assert.equal(schoolYearPosition(-1), null);
    for(const e of SCHOOL_YEAR) assert.ok(/^(Philosopher|Authored proposal)/.test(e.source) && e.date);
});

test('Now line at a W4-time clock reads the school-year position and writes nothing', () => {
    state = mk(9);
    const now = readLocalClock();
    assert.match(now.note, /Term starts in 23 days \(1 September\)\./);
    assert.equal(schoolYearText(31), 'Term starts tomorrow (1 September).');
    assert.equal(schoolYearText(32), 'Term time. Christmas holidays begin in 108 days (18 December).');
    domainRegistry.initialize(); domainRegistry.tick(1);
    assert.equal(domainRegistry.save({}).duties, undefined, 'an untouched life writes no duty record');
});

test('class duty: inactive without the fact (also in holidays), active with it in term; attend clears, a missed week counts', () => {
    state = mk(40, 10);
    assert.equal(hpDutySet(() => state).active(state), false, 'no fact, no duty');
    assert.deepEqual(domainRegistry.project('duties'), {rows: [], items: [], enrolled: false});
    state = mk(40, 10, true); assert.equal(hpDutySet(() => state).active(state), true);
    state = mk(147, 10, true); assert.equal(hpDutySet(() => state).active(state), false, 'holiday');
    // Week 6 starts day 35 (Saturday); Monday is day 37. Open 09:00-11:00.
    state = mk(37, 10, true); domainRegistry.load({}); domainRegistry.tick(1);
    assert.equal(domainRegistry.project('duties').items[0].status, 'due');
    domainRegistry.command('duties', 'attend')({dutyId: ID});
    assert.equal(domainRegistry.save({}).duties.lastDone[ID], 5);
    assert.throws(() => domainRegistry.command('duties', 'attend')({dutyId: ID}), /Already attended/);
    state = mk(49, 12, true); domainRegistry.tick(1); // Monday of day 44 passed unattended
    assert.equal(domainRegistry.save({}).duties.missed[ID], 1, 'a missed week counts');
    state = mk(51, 10, true); domainRegistry.command('duties', 'attend')({dutyId: ID});
    assert.equal(domainRegistry.save({}).duties.missed[ID], 0, 'attending clears it');
    assert.equal(HP_DUTIES[0].id, ID);
});

test('the digest passes a local clock note through and omits it when absent', async () => {
    const {todayDigestView} = await import('../src/today_strip.js');
    const base = {clock: 'Sat 09:00', place: 'Room', rows: [], usesLocalClock: true, work: []};
    assert.equal(todayDigestView({...base, note: 'Term starts in 23 days (1 September).'}).note, 'Term starts in 23 days (1 September).');
    assert.equal('note' in todayDigestView(base), false);
});
