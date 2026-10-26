import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceCalendarAt, resolveWorldCalendar} from '../src/world_calendar.js';
import {WORLD_CALENDAR_PROFILES as profiles} from '../src/world_calendar_content.js';

function fixture(worldId = 'book.paradise.hub', elapsed = 1081) {
    const profile = profiles[worldId], instanceId = `${worldId}.main`;
    return {clock: 900000, actors: {player: {worldId}},
        [worldId === 'book.mol.cyoria' ? 'motherOfLearning' : 'bookWorldCampaign']: {
            definitionRevision: 1, activeVisitId: 'visit',
            visits: [{id: 'visit', instanceId, status: 'active'}],
            instances: [{id: instanceId, worldId, definitionId: profile.definitionId, definitionRevision: profile.definitionRevision,
                clock: {elapsed, unit: 'played_minutes', absence: 'freeze'}}],
        }};
}
const domain = s => s.motherOfLearning ?? s.bookWorldCampaign;
const freeze = value => {if (value && typeof value === 'object') {Object.values(value).forEach(freeze);Object.freeze(value);}return value;};

test('qualified source calendar shares actual visitor binding with display without borrowing home seasons or time', () => {
    for (const worldId of ['book.mol.cyoria', 'book.paradise.hub', 'book.paradise.goa']) {
        const state = freeze(fixture(worldId)), before = JSON.stringify(state), source = sourceCalendarAt(state), display = resolveWorldCalendar(state);
        assert.deepEqual([source.instanceId, source.profileId, source.profileRevision, source.minuteWithinDay, source.seasonId],
            [display.instanceId, display.profileId, display.profileRevision, display.minuteWithinDay, display.seasonId]);
        assert.equal(source.worldId, worldId);assert.equal(source.at, 1081);assert.equal(source.seasonId, null);
        assert.equal(source.minutesPerHour * source.hoursPerDay, 1440);
        assert.equal(JSON.stringify(state), before);
        source.at = 0;assert.equal(sourceCalendarAt(state).at, 1081, 'detached public coordinate');
    }
});

test('local history reprojects at midnight and long versus split reads leave frozen instance unchanged', () => {
    const state = fixture(), before = JSON.stringify(state);
    assert.equal(sourceCalendarAt(state, 1079).minuteWithinDay, 1439);
    assert.equal(sourceCalendarAt(state, 1080).minuteWithinDay, 0);
    const current = sourceCalendarAt(state);
    for (const at of [0, 1, 500, 1079, 1080, 1081]) sourceCalendarAt(state, at);
    state.clock += 10000;assert.deepEqual(sourceCalendarAt(state), current, 'root elapsed grants no local growth');
    state.clock -= 10000;assert.equal(JSON.stringify(state), before);
    const restored = JSON.parse(JSON.stringify(state));assert.deepEqual(sourceCalendarAt(restored), current);
    domain(restored).visits[0].status = 'exited';assert.equal(sourceCalendarAt(restored), null);
    domain(restored).visits[0].status = 'active';assert.deepEqual(sourceCalendarAt(restored), current);
    domain(restored).instances[0].id = 'another.instance';assert.equal(sourceCalendarAt(restored), null);
});

test('unavailable or mismatched visitor coordinates fail closed; future and malformed historical queries refuse', () => {
    for (const mutate of [
        s => {domain(s).activeVisitId = 'absent';},
        s => {domain(s).definitionRevision = 2;},
        s => {domain(s).instances[0].definitionRevision = 2;},
        s => {domain(s).instances[0].definitionId = 'foreign';},
        s => {domain(s).instances[0].worldId = 'book.mol.cyoria';},
        s => {domain(s).instances[0].clock.unit = 'wall_ms';},
        s => {domain(s).instances[0].clock.absence = 'advance';},
        s => {domain(s).instances[0].clock.elapsed = -1;},
    ]) {const state = fixture();mutate(state);assert.equal(sourceCalendarAt(state), null);}
    for (const worldId of ['base.frontier', 'book.unadopted', 'book.hp.school.world'])
        assert.equal(sourceCalendarAt({actors: {player: {worldId}}}), null);
    assert.equal(sourceCalendarAt(null), null);
    for (const at of [-1, 1082, 1.5, Infinity, '1', null])
        assert.throws(() => sourceCalendarAt(fixture(), at), /retained local coordinate/);
});
