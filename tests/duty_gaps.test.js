// Duties count misses only for cycles in which the duty's set was active: a holiday or a stretch before school is not owed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {HP_DUTIES, hpDutyActive, hpDutyMinute} from '../src/book_world_hp_duties.js';
import {LOTM_DUTIES} from '../src/book_world_lotm_duties.js';
import {freshDuties, skipInactive, settleMisses} from '../src/recurring_duties.js';
const WEEK = 10080, CLASS = HP_DUTIES[0].id;
let clock = 10, hpOn = true, lotmOn = true;
registerDutySet('gap_hp', {defs: HP_DUTIES, state: () => ({clock}), active: () => hpOn, minute: s => s.clock});
registerDutySet('gap_lotm', {defs: LOTM_DUTIES, state: () => ({clock}), active: () => lotmOn, minute: s => s.clock});
const slice = () => domainRegistry.save({}).duties ?? freshDuties();
const reset = () => { clock = 10; hpOn = lotmOn = true; domainRegistry.load({}); domainRegistry.tick(1); };
const weeks = n => { clock += n * WEEK; domainRegistry.tick(1); };

test('weeks skipped while the class slot is inactive are not misses when it becomes active again', () => {
    reset();
    weeks(1);
    assert.equal(slice().missed[CLASS], 1, 'an active week unattended is still a miss');
    hpOn = false;
    weeks(1); weeks(3); // a holiday gap, ticked in two steps
    hpOn = true;
    weeks(1);
    assert.equal(slice().missed[CLASS], 2, 'one more miss for the one active week, none for the four-week gap');
});
test('one long jump while inactive is also free, and a first activation owes nothing for the past', () => {
    reset();
    hpOn = false; weeks(6); // never tracked yet: nothing to skip, nothing to owe
    hpOn = true; weeks(0);
    assert.equal(slice().missed[CLASS] ?? 0, 0);
    weeks(1);
    assert.equal(slice().missed[CLASS], 1);
});
test('a LOTM weekly duty that stays active keeps counting while the other set is idle', () => {
    reset();
    const id = LOTM_DUTIES[0].id;
    hpOn = false;
    weeks(3);
    assert.equal(slice().missed[id], 3);
});
test('the pure helper only moves defs already tracked and never counts', () => {
    const s = {...freshDuties(), closed: {[CLASS]: 1}};
    const t = skipInactive(s, HP_DUTIES, 5 * WEEK);
    assert.ok(t.closed[CLASS] > 1); assert.deepEqual(t.missed, {});
    assert.equal(skipInactive(freshDuties(), HP_DUTIES, 5 * WEEK).closed[CLASS], undefined);
    assert.equal(settleMisses(t, HP_DUTIES, 5 * WEEK).newMisses[CLASS] ?? 0, 0);
    assert.equal(typeof hpDutyActive, 'function'); assert.equal(typeof hpDutyMinute, 'function');
});
