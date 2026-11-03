import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD_CALENDAR_PROFILES as profiles, WORLD_DAY_EVENTS} from '../src/world_calendar_content.js';
import {projectCalendar, validateDayEvents, dayEventsDue, worldDayNews} from '../src/world_calendar.js';
import {eventFeed} from '../src/event_feed.js';
import {carriedKnowledgeView} from '../src/people_knowledge.js';
import {validateKnowledgeBasis} from '../src/causal_situations.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {enrollSimulation} from '../src/simulation.js';

const p = profiles['book.mol.cyoria'], content = WORLD_DAY_EVENTS['book.mol.cyoria'], DAY = 1440;
// Anchor is day 1 06:00, so elapsed minutes for day d hour h are (d-1)*1440 + h*60 - 360.
const at = (d, h = 6) => (d - 1) * DAY + h * 60 - 360;
const molState = elapsed => ({clock: 500, chronicle: null, opportunities: {}, history: [], simulation: null,
    actors: {player: {worldId: 'book.mol.cyoria', facts: {}}},
    motherOfLearning: {definitionRevision: 1, activeVisitId: 'v', visits: [{id: 'v', status: 'active', instanceId: 'i'}],
        instances: [{id: 'i', worldId: 'book.mol.cyoria', definitionId: p.definitionId, definitionRevision: 1,
            clock: {elapsed, unit: 'played_minutes', absence: 'freeze'}}]}});
const ids = elapsed => worldDayNews(molState(elapsed)).map(e => e.id);

test('G6 authored day events validate; inferred and stated rows need a source locator, unknown rows carry no day', () => {
    assert.deepEqual(validateDayEvents(content, p), []);
    const row = {id: 'x', month: 1, day: 3, hour: null, label: 'x', text: 'x'};
    const bad = basis => validateDayEvents({profileId: p.id, events: [{...row, dateBasis: basis, locator: null}]}, p);
    assert.deepEqual(bad('inferred'), ['x: source locator']);
    assert.deepEqual(bad('stated'), ['x: source locator']);
    assert.deepEqual(validateDayEvents({profileId: p.id, events: [{...row, dateBasis: 'stated', locator: 'en b1 c7 p12'}]}, p), []);
    assert.deepEqual(validateDayEvents({profileId: p.id, events: [{...row, dateBasis: 'unknown', day: 3, locator: null}]}, p), ['x: unknown date carries a day']);
    assert.deepEqual(validateDayEvents({profileId: p.id, events: [{...row, dateBasis: 'fixture', day: 31}]}, p), ['x: date']);
});

test('G6 an event shows on its day and hour, not before, and unknown dates never surface', () => {
    assert.deepEqual(ids(0), ['calendar:mol.restart_lights']);
    assert.deepEqual(ids(at(15, 18)), ['calendar:mol.restart_lights']);
    assert.deepEqual(ids(at(15, 19)), ['calendar:mol.school_dance', 'calendar:mol.restart_lights']);
    assert.ok(!ids(at(30, 22)).includes('calendar:mol.month_end'));
    assert.ok(ids(at(30, 23)).includes('calendar:mol.month_end'));
    assert.ok(!ids(at(30, 23)).includes('calendar:mol.unplaced_event'));
    const news = worldDayNews(molState(at(15, 19)));
    assert.match(news[0].text, /^Day 15, 19:00: /);
    assert.equal(news[0].ageMinutes, 0);
});

test('G6 an inferred date is labelled and a restart (elapsed back to 0) hides later events again', () => {
    const inferred = {profileId: p.id, events: [{id: 'i', month: 1, day: 4, hour: null, dateBasis: 'inferred', locator: 'en b1 c6 p3', label: 'i', text: 'Seen.'}]};
    const view = projectCalendar(p, {elapsed: at(4, 12), instanceId: 'i'});
    assert.equal(dayEventsDue(p, view, inferred)[0].dateBasis, 'inferred');
    assert.ok(!ids(0).includes('calendar:mol.school_dance'));
});

test('G6 the event feed carries the dated news; other worlds and the frontier are unchanged', () => {
    const feed = eventFeed(molState(at(15, 19)), registry);
    assert.ok(feed.news.some(m => m.id === 'calendar:mol.school_dance'));
    assert.ok(!eventFeed(molState(at(10)), registry).news.some(m => m.id === 'calendar:mol.school_dance'));
    for (const worldId of ['base.frontier', 'book.lotm.tingen', 'book.hp.hogwarts', 'book.paradise.goa']) {
        const state = {...molState(at(20)), actors: {player: {worldId, facts: {}}}};
        assert.deepEqual(worldDayNews(state), [], worldId);
        assert.ok(!eventFeed(state, registry).news.some(m => m.id.startsWith('calendar:')), worldId);
    }
    assert.deepEqual(eventFeed(initializeExpedition(createExpansionState(7)), registry), {leads: [], news: [], life: [], heard: []});
});

const carried = (extra = {}) => ({value: 'The lamp fails on the day the dance opens.', at: 12, stage: 'understood',
    basis: {kind: 'recollection', attributedTo: 'player', situationId: 'fixture.run', carried: {stampDay: 15, carrier: 'self',
        sourceKind: 'lived', decaysAfterDays: 3, prediction: {day: 15, hour: 19, text: 'The lamp fails at the dance.'}, ...extra}}});
const withCarried = () => {
    const state = enrollSimulation(initializeExpedition(createExpansionState(23)), registry,
        {actorId: 'player', worldId: 'base.frontier', facts: {location: 'Village'}, external: {money: 30}}).state;
    (state.simulation.knowledge.player ||= {})['book.mol.foreknowledge.dance'] = carried();
    return state;
};

test('G8 carried knowledge shows its day stamp, goes stale after divergence, and grants nothing', () => {
    const state = withCarried(), before = JSON.stringify(state);
    const view = today => carriedKnowledgeView(state, today)[0];
    assert.equal(view({day: 2, divergedOnDay: null}).status, 'reliable');
    assert.equal(view({day: 2, divergedOnDay: null}).stampDay, 15);
    assert.equal(view({day: 2, divergedOnDay: null}).prediction.check, 'upcoming');
    assert.equal(view({day: 15, divergedOnDay: null}).prediction.check, 'due');
    assert.equal(view({day: 5, divergedOnDay: 4}).status, 'fading');
    assert.equal(view({day: 7, divergedOnDay: 4}).status, 'stale');
    assert.equal(JSON.stringify(state), before, 'read only');
    assert.deepEqual(Object.keys(view({day: 7, divergedOnDay: 4})).sort(), ['carrier', 'daysSinceDivergence', 'decaysAfterDays', 'id', 'note', 'prediction', 'sourceKind', 'stampDay', 'status', 'text']);
    state.simulation.knowledge.player['book.mol.other'] = {value: 'plain', at: 1, stage: 'seen'};
    assert.equal(carriedKnowledgeView(state, {day: 1, divergedOnDay: null}).length, 1);
});

test('G8 the day-stamped basis passes the knowledge-basis validator and survives a JSON round trip', () => {
    const state = withCarried(), record = state.simulation.knowledge.player['book.mol.foreknowledge.dance'];
    assert.doesNotThrow(() => validateKnowledgeBasis(record.basis));
    const reloaded = JSON.parse(JSON.stringify(state));
    assert.deepEqual(carriedKnowledgeView(reloaded, {day: 20, divergedOnDay: 16}), carriedKnowledgeView(state, {day: 20, divergedOnDay: 16}));
    assert.equal(carriedKnowledgeView(reloaded, {day: 20, divergedOnDay: 16})[0].status, 'stale');
    delete reloaded.simulation.knowledge.player['book.mol.foreknowledge.dance'];
    assert.deepEqual(carriedKnowledgeView(reloaded, {day: 1, divergedOnDay: null}), []);
});
