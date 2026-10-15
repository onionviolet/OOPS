import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {WORLD_CALENDAR_PROFILES as profiles} from '../src/world_calendar_content.js';
import {projectCalendar, formatCalendar, calendarEnvironment, resolveWorldCalendar, createCalendarLog} from '../src/world_calendar.js';
import {worldWeatherWords} from '../src/world_weather_display.js';
import {Game_Time} from '../src/game_time.js';
import {molCalendarAt} from '../src/book_world_mol_native.js';
import {paradiseCalendarAt} from '../src/book_world_paradise_native.js';
const p = profiles['book.mol.cyoria'];
const view = (elapsed = 0, instanceId = 'test.visitor') => projectCalendar(p, {elapsed, instanceId});
const freeze = x => {if (x && typeof x === 'object') {Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const dateFields = v => Object.fromEntries(['year', 'month', 'day', 'hour', 'minute', 'day_count'].map(k => [k, v[k]]));

test('W33.T1 pure legacy projection matches native calendars and weekdays at all boundaries', () => {
    for (const elapsed of [0, 1079, 1080, 1439, 1440, 42839, 42840, 518039, 518040, 10000000]) {
        const input = freeze({elapsed, instanceId: 'test.visitor'});
        const v = projectCalendar(p, input);
        assert.deepEqual(v, projectCalendar(p, input));
        assert.deepEqual(dateFields(v), molCalendarAt(elapsed));
        assert.deepEqual(dateFields(v), paradiseCalendarAt(elapsed));
        assert.equal(v.weekday, new Game_Time(dateFields(v)).getDayOfTheWeek());
    }
    assert.equal(view(1079).minuteWithinDay, 1439);
    assert.equal(view(1080).day, 2);
    const home = projectCalendar(profiles['base.frontier'], {instanceId: 'frontier.main'});
    assert.equal(formatCalendar(home, {time: true}), new Game_Time(profiles['base.frontier'].anchor).toString());
    assert.throws(() => view(Number.MAX_SAFE_INTEGER), /overflow/);
    assert.throws(() => projectCalendar(p, {instanceId: 'test', unit: 'wall_ms'}), /coordinate/);
    assert.throws(() => projectCalendar({...p, algorithmId: 'unavailable'}, {instanceId: 'test'}), /Unavailable/);
    assert.throws(() => projectCalendar({...p, units: {minutesPerHour: 0, hoursPerDay: 24}}, {instanceId: 'test'}), /units/);
});

test('W33.T2 applicable fixed custom-day/month arithmetic keeps elapsed separate from labels', () => {
    const custom = freeze({...p, id: 'test.custom', units: {minutesPerHour: 60, hoursPerDay: 27}, months: [{id: 'a', days: 2}, {id: 'b', days: 3}]});
    const v = projectCalendar(custom, {elapsed: 1620 * 5 - 360, instanceId: 'custom'});
    assert.deepEqual([v.year, v.month, v.day, v.hour], [2, 1, 1, 0]);
    assert.notEqual(formatCalendar(v), formatCalendar(view(1620 * 5 - 360)));
    assert.equal(calendarEnvironment(v).dayFraction, 0);
});

test('W33.T3 hub unknown civil date and public projection omit undeclared hidden fields', () => {
    const v = projectCalendar({...profiles['book.paradise.hub'], hiddenEvents: [{date: 'DO_NOT_DISCLOSE'}]},
        {instanceId: 'hub', hiddenDate: 'DO_NOT_DISCLOSE'});
    assert.match(formatCalendar(v), /civil date unknown/);
    assert.doesNotMatch(JSON.stringify(v), /DO_NOT_DISCLOSE|hiddenEvents|hiddenDate/);
    assert.equal(formatCalendar(null), 'Local date unavailable');
});

function stateFor(worldId, elapsed) {
    const profile = profiles[worldId], instanceId = `${worldId}.main`;
    return {actors: {player: {worldId}},
        [worldId === 'book.mol.cyoria' ? 'motherOfLearning' : 'bookWorldCampaign']: {
            definitionRevision: 1, activeVisitId: 'visit',
            visits: [{id: 'visit', status: 'active', instanceId}],
            instances: [{id: instanceId, worldId, definitionId: profile.definitionId, definitionRevision: 1,
                clock: {elapsed, unit: 'played_minutes', absence: 'freeze'}}],
        }};
}
test('W33.T5 legacy bindings resolve without mutating any saved owner, absent and unsupported worlds stay unavailable', () => {
    for (const worldId of ['book.mol.cyoria', 'book.paradise.hub', 'book.paradise.goa']) {
        const state = freeze(stateFor(worldId, 42840)), bytes = JSON.stringify(state);
        const first = resolveWorldCalendar(state);
        assert.deepEqual(first, resolveWorldCalendar(JSON.parse(bytes)));
        assert.equal(JSON.stringify(state), bytes);
        const bad = JSON.parse(bytes), domain = bad.motherOfLearning ?? bad.bookWorldCampaign;
        domain.definitionRevision = 2;
        assert.equal(resolveWorldCalendar(bad), null);
    }
    assert.equal(resolveWorldCalendar({actors: {player: {worldId: 'book.unadopted'}}}), null);
    assert.equal(resolveWorldCalendar({actors: {player: {worldId: 'book.mol.cyoria'}}}), null);
});

test('W33.T6 transient entry/midnight/reentry headers deduplicate and bound jumps', () => {
    const lines = [], log = createCalendarLog((...args) => lines.push(args));
    assert.equal(log.commit(view(0)), true);
    log.commit(view(1079)); assert.equal(lines.length, 1);
    log.commit(view(1080)); assert.equal(lines.length, 2);
    log.commit(view(1080)); assert.equal(lines.length, 2);
    log.commit(view(1080, 'other')); log.commit(view(1080)); assert.equal(lines.length, 4);
    log.commit(view(1440 * 100)); assert.equal(lines.length, 5);
    assert.match(lines.at(-1)[0], /98 intervening local days skipped/);
    log.reset(); log.commit(view(1440 * 100)); assert.equal(lines.length, 6);
    log.commit(null); log.commit(view(1440 * 100)); assert.equal(lines.length, 7);
    assert.equal(lines[0][1], 'notification'); assert.equal(lines[0][2].safeText, true);
    let fail = true, count = 0;
    const retry = createCalendarLog(() => {if (fail) throw Error('sink failure');count++;});
    assert.throws(() => retry.commit(view())); fail = false;retry.commit(view());assert.equal(count, 1);
});

test('W33.T6 actual host publication seam emits only after storage success and before new-day messages', () => {
    const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
    const start = source.indexOf('    try {persistExpansionPlan(plan,');
    const end = source.indexOf('    if(plan.pacingNext)', start);
    const seam = source.slice(start, end);
    const lines = [], next = view(1080), log = createCalendarLog(text => lines.push(text));
    let invalidations = 0;
    log.commit(view()); lines.length = 0;
    const context = {plan: {state: {clock: 1080}}, create_save() {}, lifeSaveStorage: {}, stagedGameplay: {bindings: {}},
        ownershipBindings: {}, unlockPublication: {}, equipmentPublication: {}, nativePublication: {},
        validateSaveEnvelope() {}, game_version: 'test', is_on_dev: () => true, dev_save_key: 'dev', save_key: 'save',
        current_combat: null, expansionState: {clock: 0}, nextLocalCalendar: next, localDateLog: log,
        readFrame: {invalidate() {invalidations++;assert.equal(context.expansionState.clock, 0);}},
        persistExpansionPlan() {throw Error('storage failed');}};
    assert.throws(() => vm.runInNewContext(`(function(){${seam}})()`, context), /storage failed/);
    assert.equal(context.expansionState.clock, 0); assert.equal(lines.length, 0); assert.equal(invalidations, 0);
    context.persistExpansionPlan = () => {};
    vm.runInNewContext(`(function(){${seam}})()`, context);
    assert.equal(context.expansionState.clock, 1080); assert.equal(lines.length, 1); assert.equal(invalidations, 1);
    assert.ok(end < source.indexOf('for(const message of plan.localLifeResult.messages)', end));
    const display = readFileSync(new URL('../src/display.js', import.meta.url), 'utf8');
    assert.match(display, /if\(details.safeText\) message.textContent = message_to_add/);
    assert.match(display, /message.tabIndex = 0/);
    assert.ok(display.includes('message_events > 40') && display.includes('message_log_unread_count += 1'));
    assert.ok(!/commitLocalDateHeader|localDateLog/.test(display));
});

test('W28/W33 display-only climate uses frozen local frame, unknown hub and untouched home', () => {
    const v = freeze(view(1080)), location = freeze({id: 'outdoor'});
    const first = worldWeatherWords('book.mol.cyoria', v, location);
    assert.equal(first, worldWeatherWords('book.mol.cyoria', v, location));
    assert.match(first, /climate proposal/);
    assert.match(worldWeatherWords('book.paradise.goa', v, {is_under_roof: true}), /Sheltered/);
    assert.equal(worldWeatherWords('book.paradise.hub', v), 'Weather unknown · Paradise hub');
    assert.equal(worldWeatherWords('base.frontier', v), null);
    assert.equal(worldWeatherWords('book.mol.cyoria', null), 'Local weather unavailable');
});
