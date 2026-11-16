// Klein's streets (PS143 for Tingen): street records in the Tingen event book show on their place's description on their days and hours.
import test from 'node:test';
import assert from 'node:assert/strict';
import {lotmStreetLine, lotmEventBook, lotmRestrictions} from '../src/book_world_lotm_events.js';
import {LOTM_STREET_EVENTS, LOTM_STREET_LINES, LOTM_STREET_PLACES} from '../src/lotm_street_events.js';
import {createCastLocationRestore} from '../src/cast_location_restore.js';
import {describePlace, registerPlaceDescription} from '../src/place_descriptions.js';

const MARKET = LOTM_STREET_EVENTS.find(e => e.id === 'lotm.street.market_day');
// Tingen day N at hour H (day 1 = arrival, minute 0 = the opening small hours; lotmDay and castCalendar).
const at = (day, hour) => ({clock: 1000 + (day - 1) * 1440 + hour * 60, lotm: {initializedAt: 1000}});

test('market day shows at the street market on its day and hours only', () => {
    assert.equal(lotmStreetLine(at(64, 9), MARKET.place, {pack: null}), LOTM_STREET_LINES['street.market_day'], 'day 64 is a market day (every 7 from day 1)');
    assert.equal(lotmStreetLine(at(64, 15), MARKET.place, {pack: null}), '', 'the barrows are gone by mid-afternoon');
    assert.equal(lotmStreetLine(at(65, 9), MARKET.place, {pack: null}), '', 'not the next day');
    assert.equal(lotmStreetLine({clock: 5}, MARKET.place, {pack: null}), '', 'nothing outside a Tingen life');
});

test('the street records live in the one Tingen book and close nothing', () => {
    const book = lotmEventBook({state: at(64, 9), days: [], pack: null});
    for(const e of LOTM_STREET_EVENTS) assert.ok(book.byId.has(e.id));
    const pack = {schema: 1, world: 'book.lotm.tingen', events: [], lines: {}};
    assert.deepEqual(lotmRestrictions({state: at(64, 9), days: [], pack}), [], 'a market or a soup kettle is not a closure');
    for(const t of Object.values(LOTM_STREET_LINES)) assert.doesNotMatch(t, /\b(fact|event|record|proposal|stated|authored)\b/i, t);
    assert.equal(LOTM_STREET_PLACES.length, LOTM_STREET_EVENTS.length);
});

test('a restored cast place reads its description through the place hook', () => {
    const locations = {}, make = d => ({...d});
    const r = createCastLocationRestore({locations, createLocation: make, describe: (id, base) => () => describePlace(id, base, at(64, 9))});
    const off = registerPlaceDescription(MARKET.place, s => lotmStreetLine(s, MARKET.place, {pack: null}));
    try {
        const place = r.ensure({id: MARKET.place, name: 'Tingen street market'});
        assert.equal(place.getDescription(), `A place in Tingen. ${LOTM_STREET_LINES['street.market_day']}`);
        const late = r.retain('lotm.place.other'); r.ensure({id: 'lotm.place.other', name: 'Other'});
        assert.equal(late.getDescription(), 'A place in Tingen.', 'a place with no street record keeps its base text');
    } finally { off(); }
});
