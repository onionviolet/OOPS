import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteJourney, clockAfter, journeyTitle, setJourneyPace, journeyParts, villageRoadPace} from '../src/journey_quote.js';
import {placeExits} from '../src/nearby_context_view.js';

const running = [{id: 'running', source: 'Running', mult: .8}];

test('the quote charges what the label shows, with running and without', () => {
    assert.equal(quoteJourney(20, {parts: []}).minutes, 20);
    assert.equal(quoteJourney(20, {parts: running}).minutes, 16);
    assert.equal(quoteJourney(7, {parts: running}).minutes, Math.max(1, Math.ceil(7 * .8)));
    assert.equal(quoteJourney(0, {parts: []}).minutes, 1);
    assert.equal(quoteJourney(undefined, {parts: []}), null);
});

test('arrival clock wraps midnight and names the extra day', () => {
    assert.deepEqual(clockAfter({hour: 8, minute: 50}, 16), {hour: 9, minute: 6, days: 0, text: '09:06'});
    assert.equal(clockAfter({hour: 23, minute: 30}, 45).text, '00:15 (+1d)');
    assert.equal(quoteJourney(20, {parts: running, now: {hour: 8, minute: 0}}).arriveAt.text, '08:16');
});

test('Village road pace quotes low stamina and timber from departure stock', () => {
    const fresh = {running: false, stamina: 10, maxStamina: 40, logs: 2};
    assert.equal(quoteJourney(9, {parts: villageRoadPace(fresh)}).minutes, 9);
    assert.equal(quoteJourney(9, {parts: villageRoadPace({...fresh, stamina: 9})}).minutes, 12);
    assert.equal(quoteJourney(9, {parts: villageRoadPace({...fresh, logs: 3})}).minutes, 12);
    const parts = villageRoadPace({...fresh, stamina: 9, logs: 3, running: true});
    assert.deepEqual(parts.map(part => part.id), ['running', 'low-stamina', 'timber-load']);
    assert.equal(quoteJourney(9, {parts}).minutes, 12);
});

test('the hover lists the route, each known cause, the total and the arrival', () => {
    const title = journeyTitle(quoteJourney(20, {parts: running, now: {hour: 8, minute: 0}}));
    assert.equal(title, 'Route: 20m\n×0.8 Running\nTotal: 16m\nArrive 08:16');
    assert.equal(journeyTitle(quoteJourney(20, {parts: [], now: {hour: 8, minute: 0}})), 'Route: 20m\nArrive 08:20');
});

test('a failing or malformed pace reader yields no parts instead of breaking travel', () => {
    setJourneyPace(() => { throw new Error('boom'); });
    assert.deepEqual(journeyParts(), []);
    setJourneyPace(() => [{id: 'x', mult: 0}, null, {id: 'running', source: 'Running', mult: .8}]);
    assert.deepEqual(journeyParts().map(p => p.id), ['running']);
    setJourneyPace(null);
});

test('Ways out shows the quoted minutes and arrival, not the raw route', () => {
    const to = {id: 'b', name: 'Field', tags: {safe_zone: true}, canBeStarted: () => true};
    const here = {id: 'a', connected_locations: [{location: to}]};
    const [exit] = placeExits(here, {}, {a: {b: 20}}, {parts: running, now: {hour: 8, minute: 0}});
    assert.match(exit.role, /16/);
    assert.match(exit.role, /08:16/);
    assert.doesNotMatch(exit.role, /20/);
    assert.match(exit.title, /×0.8 Running/);
});
