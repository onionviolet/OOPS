// FD14 first runtime reader: authority dials (half-life, post publicity) come from the society sheet row, code defaults otherwise.
import test from 'node:test';
import assert from 'node:assert/strict';
import {knownness, halfLifeOf} from '../src/authority.js';
import '../src/authority_sources.js';
import {applyAuthorityDials, TINGEN_HALF_LIFE_DAYS} from '../src/authority_sources_lotm.js';
import {registerPositionSource} from '../src/positions.js';
import {SHEETS, authorityDials, authorityDialProblem} from '../src/world_society_sheet.js';

const DAY = 1440;
let rows = [];
registerPositionSource('sheetdial', () => rows);
const post = (rank, endedDay) => ({id: `sd.${rank}`, institution: 'the Nighthawks', role: 'Civil staff', rank, term: {type: 'hired', startedAt: 0}, ...(endedDay === undefined ? {} : {ended: {at: endedDay * DAY}}), source: 'sheetdial'});
const st = clock => ({clock, actors: {player: {facts: {}}}, simulation: {knowledge: {player: {}}}});
const tingen = SHEETS.find(s => s.id === 'tingen');
const withDials = d => [{...tingen, authority: {tingen: d}}];
const dial = (value, reason = 'test reason') => ({value, reason});
test.afterEach(() => { applyAuthorityDials(); rows = []; });

test('the Tingen sheet row holds the current numbers, each with its reason', () => {
    const d = authorityDials('tingen');
    assert.equal(d.halfLife.days, 60); assert.match(d.halfLife.reason, /ledgers/);
    assert.deepEqual(d.postPublicity, {clerk: 2, 'night watchman': 1, probationer: 0});
    assert.equal(halfLifeOf('tingen').days, 60);
    assert.equal(halfLifeOf('village').days, 30);
});
test('changing Tingen half-life in the sheet changes the knownness fade', () => {
    rows = [post('clerk', 40)]; // ended on day 40, read on day 100: 60 days old
    assert.equal(knownness(st(100 * DAY), 'tingen').value, 1); // one half-life of 60 days
    applyAuthorityDials(withDials({halfLifeDays: dial(30)}));
    assert.equal(halfLifeOf('tingen').days, 30);
    assert.equal(knownness(st(100 * DAY), 'tingen').value, 0.5);
    applyAuthorityDials(withDials({postPublicity: {clerk: dial(4)}}));
    assert.equal(halfLifeOf('tingen').days, TINGEN_HALF_LIFE_DAYS);
    rows = [post('clerk')]; assert.equal(knownness(st(100 * DAY), 'tingen').value, 4);
});
test('a world with no sheet row keeps the code defaults', () => {
    assert.deepEqual(authorityDials('no.such.authority'), {halfLife: null, postPublicity: {}});
    applyAuthorityDials([]);
    assert.equal(halfLifeOf('tingen').days, 60);
    rows = [post('clerk')]; assert.equal(knownness(st(100 * DAY), 'tingen').value, 2);
    rows = [post('night watchman')]; assert.equal(knownness(st(100 * DAY), 'tingen').value, 1);
});
test('a malformed dial is rejected and its default used, without dropping the good dials beside it', () => {
    const bad = {halfLifeDays: {value: -5, reason: 'x'}, postPublicity: {clerk: {value: 'lots', reason: 'x'}, 'night watchman': dial(3), probationer: {value: 1}}};
    assert.match(authorityDialProblem(bad), /halfLifeDays/);
    assert.match(authorityDialProblem({postPublicity: bad.postPublicity}), /postPublicity/);
    assert.equal(authorityDialProblem({halfLifeDays: dial(60), postPublicity: {clerk: dial(2)}}), null);
    assert.equal(authorityDialProblem(tingen.authority.tingen), null);
    applyAuthorityDials(withDials(bad));
    assert.equal(halfLifeOf('tingen').days, 60);
    rows = [post('clerk')]; assert.equal(knownness(st(100 * DAY), 'tingen').value, 2);
    rows = [post('night watchman')]; assert.equal(knownness(st(100 * DAY), 'tingen').value, 3);
    rows = [post('probationer')]; assert.equal(knownness(st(100 * DAY), 'tingen').value, 0);
});
