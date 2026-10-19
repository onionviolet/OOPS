import test from 'node:test';
import assert from 'node:assert/strict';
import {loadWorldPacks} from '../src/world_pack_loader.js';
import {createPopulation, slotKey, createDrawLedger} from '../src/world_pack_population.js';
import {makeSchoolPack, makeRulebookPack, fakeRuleAdapter, FEATURES, cohortId} from './world_pack_school_fixture.js';

const DAY = 1440;
const school = (options = {}) => loadWorldPacks([makeSchoolPack(options), makeRulebookPack()], {features: FEATURES, ruleAdapter: fakeRuleAdapter}).packs.get('test.school');
const population = (options = {}, instanceId = 'test.school.main', root = 42) => createPopulation(school(options), {root, instanceId});
const ADA = 'test.school.person.ada', BRAM = 'test.school.person.bram', CORA = 'test.school.person.cora';

test('cohorts hold named records first, then generated addresses', () => {
    const pop = population();
    const y3 = pop.members(cohortId(3, 'ash'));
    assert.equal(y3.length, 13);
    assert.equal(y3[0], ADA);
    assert.equal(y3[1], `${cohortId(3, 'ash')}.m0`);
    assert.equal(pop.everyone().length, 28 * 12 + 5);
    assert.equal(pop.stats().materialized, 0, 'nothing is generated until asked (CX4)');
    const m = pop.person(`${cohortId(3, 'ash')}.m4`);
    assert.equal(m.layer, 'generated');
    assert.equal(m.house, 'test.school.house.ash');
    assert.match(m.name, /^[A-Z][a-z]+ [A-Z][a-z]+$/);
    assert.equal(pop.person(`${cohortId(3, 'ash')}.m12`), null, 'beyond the cohort count is no one');
    assert.equal(pop.person('test.school.person.nobody'), null);
});

test('generated members are pure in root, pack, instance, scope and slot', () => {
    const a = population(), b = population();
    const id = `${cohortId(5, 'cedar')}.m7`;
    assert.deepEqual(a.person(id), b.person(id));
    // P9P2f: another instance draws independently; equal names never merge records.
    const sameEverywhere = Array.from({length: 12}, (_, n) => `${cohortId(2, 'ash')}.m${n}`).every(x => population({}, 'test.school.other').person(x).name === a.person(x).name);
    assert.equal(sameEverywhere, false);
    assert.notEqual(slotKey('test.school', 'i1', 's', 'x'), slotKey('test.school', 'i2', 's', 'x'));
    assert.notEqual(slotKey('test.school', 'i1', 's', 'x'), slotKey('test.other', 'i1', 's', 'x'));
});

test('adding cohorts or students never reshuffles existing students (WP10)', () => {
    const small = population({years: 3, perCohort: 12}), big = population({years: 7, perCohort: 20});
    for (const cohort of [cohortId(1, 'ash'), cohortId(3, 'damson')])
        for (let n = 0; n < 12; n++) assert.deepEqual(big.person(`${cohort}.m${n}`), small.person(`${cohort}.m${n}`));
});

test('presence follows the calendar, timetable and house defaults', () => {
    const pop = population(), m = `${cohortId(2, 'birch')}.m3`;
    const day = 3, row = makeSchoolPack().content.cohorts.find(c => c.id === cohortId(2, 'birch')).timetable[day];
    assert.deepEqual(pop.presenceAt(m, day * DAY + 545), {placeId: row.b1, source: 'timetable', ruleId: 'b1'});
    assert.deepEqual(pop.presenceAt(m, day * DAY + 120), {placeId: 'test.school.area.dorm_birch', source: 'dorm', ruleId: 'test.school.house.birch'});
    assert.deepEqual(pop.presenceAt(m, day * DAY + 700), {placeId: 'test.school.area.hall', source: 'commons', ruleId: 'test.school.inst.academy'});
    assert.equal(pop.presenceAt(m, 5 * DAY + 545).source, 'commons', 'weekends have no lessons');
    assert.deepEqual(pop.presenceAt(m, 95 * DAY + 545), {placeId: null, source: 'off_term', ruleId: null});
    assert.equal(pop.presenceAt(m, -1), null);
});

test('exceptions resolve by priority: canon event over illness over detention over club', () => {
    const pop = population();
    // Day 10 block 1: Ada's cohort assembly (canon event) beats her own detention.
    assert.equal(pop.presenceAt(ADA, 10 * DAY + 545).ruleId, 'test.school.exc.assembly');
    // Bram is ill all of days 12-14, through lessons.
    assert.deepEqual(pop.presenceAt(BRAM, 13 * DAY + 600), {placeId: 'test.school.area.dorm_birch', source: 'illness', ruleId: 'test.school.exc.bram_ill'});
    assert.equal(pop.presenceAt(BRAM, 15 * DAY + 600).source, 'timetable', 'routine resumes when the exception ends');
    // Ada's chess club meets weekday 2, block 4, in the library.
    assert.deepEqual(pop.presenceAt(ADA, 2 * DAY + 850), {placeId: 'test.school.area.library', source: 'club', ruleId: 'test.school.club.chess'});
    // A higher-priority save exception (quest) wins over club.
    const extra = pop.indexExceptions([{id: 'test.school.save.q1', kind: 'quest', personId: ADA, placeId: 'test.school.area.gate', start: 2 * DAY + 800, end: 2 * DAY + 900}]);
    assert.equal(pop.presenceAt(ADA, 2 * DAY + 850, {extra}).source, 'quest');
});

test('presence is deterministic for a minute regardless of exception order (P9Q43)', () => {
    const pop = population();
    const list = [
        {id: 'test.school.x.b', kind: 'detention', personId: CORA, placeId: 'test.school.area.library', start: 0, end: 10 * DAY},
        {id: 'test.school.x.a', kind: 'detention', personId: CORA, placeId: 'test.school.area.gate', start: 0, end: 10 * DAY},
        {id: 'test.school.x.c', kind: 'club', personId: CORA, placeId: 'test.school.area.hall', start: 0, end: 10 * DAY},
    ];
    const forward = pop.presenceAt(CORA, 3 * DAY + 545, {extra: pop.indexExceptions(list)});
    const backward = pop.presenceAt(CORA, 3 * DAY + 545, {extra: pop.indexExceptions([...list].reverse())});
    assert.deepEqual(forward, backward);
    assert.equal(forward.ruleId, 'test.school.x.a', 'equal priority ties break by ID');
});

test('relationships are sparse: explicit canon edges, then derived ones', () => {
    const pop = population();
    assert.deepEqual(pop.relation(ADA, BRAM), {kind: 'rival', source: 'canon'});
    assert.deepEqual(pop.relation(BRAM, ADA), {kind: 'rival', source: 'canon'});
    assert.deepEqual(pop.relation(ADA, `${cohortId(3, 'ash')}.m0`), {kind: 'classmate', source: 'derived'});
    assert.deepEqual(pop.relation(ADA, `${cohortId(6, 'ash')}.m0`)?.source, 'derived');
    assert.equal(pop.relation(ADA, 'test.school.person.porter'), null);
    assert.equal(pop.relation(ADA, ADA), null);
    assert.deepEqual(pop.relation(ADA, 'test.school.person.dev', {'test.school.person.ada|test.school.person.dev': {kind: 'friend', source: 'play'}}), {kind: 'friend', source: 'play'});
});

test('the draw ledger enforces declared budgets (CX5)', () => {
    const ledger = createDrawLedger({maxDrawsPerEntity: 2, maxEntities: 1});
    ledger.draw(1, 'a', 'k1'); ledger.draw(1, 'a', 'k2');
    assert.throws(() => ledger.draw(1, 'a', 'k3'), /Draw budget exceeded/);
    assert.throws(() => ledger.draw(1, 'b', 'k1'), /Entity budget exceeded/);
    assert.deepEqual(ledger.stats(), {entities: 1, draws: 2, maxPerEntity: 2});
    const tight = makeSchoolPack(); tight.budgets.drawsPerEntity = 3;
    const pop = createPopulation(loadWorldPacks([tight, makeRulebookPack()], {features: FEATURES}).packs.get('test.school'), {root: 1, instanceId: 'test.school.main'});
    assert.throws(() => pop.person(`${cohortId(1, 'ash')}.m0`), /Draw budget exceeded/);
    assert.throws(() => createPopulation(school(), {root: 1}), /scoped to one instance/);
});
