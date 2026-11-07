import test from 'node:test';
import assert from 'node:assert/strict';
import {positionsOf, POSITION_TERM_TYPES} from '../src/positions.js';
import {hpPositions, hpPositionLine, HP_HOUSE_FACT} from '../src/book_world_hp_positions.js';
import {HP_AT_SCHOOL_FACT} from '../src/book_world_hp_duties.js';
import {HP_DUTIES, hpDutyActive} from '../src/book_world_hp_duties.js';
import {registerHpLeadDomain} from '../src/book_world_hp_lead_domain.js';
import {readLocalClock} from '../src/today_strip.js';
import {SHEETS, sheetCoverage} from '../src/world_society_sheet.js';

const P = 'book.hp.lead', DAY = 1440;
const mk = (day, facts, world = `${P}.world`) => ({clock: day * DAY,
    actors: {player: {worldId: world, ...(facts ? {facts} : {})}},
    simulation: {knowledge: {player: {[`${P}.opening`]: {at: 0}}}}, worlds: {[`${P}.world`]: {facts: {[`${P}.instance`]: 'i1'}}}});

test('no position until the life is at school, and none in another world', () => {
    assert.deepEqual(hpPositions(mk(40)), []);
    assert.deepEqual(hpPositions(mk(40, {[HP_AT_SCHOOL_FACT]: false})), []);
    assert.deepEqual(hpPositions(mk(40, {[HP_AT_SCHOOL_FACT]: true}, 'book.lotm.tingen')), []);
    assert.deepEqual(positionsOf(mk(40)), []);
});
test('at school: one enrolled pupil row bound to the class slot; the house row waits for a house fact', () => {
    const st = mk(40, {[HP_AT_SCHOOL_FACT]: true});
    const rows = positionsOf(st);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].role, 'Pupil'); assert.equal(rows[0].institution, 'Hogwarts'); assert.equal(rows[0].rank, 'first year');
    assert.ok(POSITION_TERM_TYPES.includes(rows[0].term.type)); assert.equal(rows[0].term.type, 'enrolled');
    assert.deepEqual(rows[0].duties, [HP_DUTIES[0].id]);
    assert.equal(hpPositionLine(rows), 'Pupil, Hogwarts (first year)');
});
test('a house fact adds a member row; an unknown house adds none', () => {
    const st = mk(40, {[HP_AT_SCHOOL_FACT]: true, [HP_HOUSE_FACT]: 'ravenclaw'});
    const rows = positionsOf(st);
    assert.deepEqual(rows.map(r => r.id), ['hp.position.pupil', 'hp.position.house']);
    assert.equal(rows[1].term.type, 'member');
    assert.equal(hpPositionLine(rows), 'Pupil, Hogwarts (first year); Ravenclaw house');
    assert.equal(hpPositions(mk(40, {[HP_AT_SCHOOL_FACT]: true, [HP_HOUSE_FACT]: 'nowhere'})).length, 1);
});
test('the Reports Now note carries the position beside the school-year note, and is absent before school', () => {
    let state = mk(40, {[HP_AT_SCHOOL_FACT]: true, [HP_HOUSE_FACT]: 'ravenclaw'});
    registerHpLeadDomain(def => def, () => state, {read() {}, command() {}});
    const now = readLocalClock();
    assert.match(now.note, /Term time\..*Pupil, Hogwarts \(first year\); Ravenclaw house$/);
    state = mk(9);
    assert.doesNotMatch(readLocalClock().note, /Pupil/);
    assert.equal(hpDutyActive(mk(40, {[HP_AT_SCHOOL_FACT]: true})), true);
});
test('the society sheet counts Hogwarts positions as authored', () => {
    const c = sheetCoverage(SHEETS.find(s => s.id === 'little_whinging_hogwarts'));
    assert.equal(c.lines.find(l => l.field === 'positions').status, 'authored');
    assert.equal(c.lines.find(l => l.field === 'law').status, 'palette');
});
