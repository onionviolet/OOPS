import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildNextCity, loadNextCity, NEXT_CITY_SUPPLEMENT} from '../src/lotm_next_city.js';
import {readRegion} from '../src/region_kit.js';
import {quoteRoute, settleRoute} from '../src/travel_legs.js';

const PATH = new URL('../private_packs/lotm-next-city/region.json', import.meta.url);
const pack = fs.existsSync(PATH) ? JSON.parse(fs.readFileSync(PATH, 'utf8')) : null;
const t = pack ? test : test.skip;

test('a malformed or absent pack yields no city, and the loader needs the manifest entry', async () => {
    assert.equal(buildNextCity(null), null);
    assert.equal(buildNextCity({schema: 1, region: {}, route: {}}), null);
    assert.equal(await loadNextCity(async () => ({ok: false})), null);
    const files = {'private_packs/manifest.json': {schema: 1, supplements: []}};
    assert.equal(await loadNextCity(async p => ({ok: !!files[p], json: async () => files[p]})), null);
    assert.ok(NEXT_CITY_SUPPLEMENT.endsWith('region.json'));
});
t('the lead arrives, uses a service in its hours and reads a cited price', () => {
    const city = buildNextCity(pack);
    assert.ok(city);
    const bank = id => readRegion(city.region, {reputation: 0, hour: 11, money: 5}).institutions.find(i => i.id === id);
    assert.equal(bank('backlund.clearing-bank').open, true);
    assert.equal(readRegion(city.region, {hour: 22}).institutions.find(i => i.id === 'backlund.clearing-bank').open, false);
    const read = readRegion(city.region, {reputation: 0, hour: 11, money: 5});
    assert.equal(read.rank.id, 'stranger');
    const trip = read.institutions.find(i => i.id === 'backlund.public-carriage').services.find(s => s.id === 'cross-district-trip');
    assert.equal(trip.available, false);
    assert.match(trip.reasons.join(' '), /11 money/);
    assert.equal(readRegion(city.region, {hour: 11, money: 50}).institutions[0].services[0].available, true);
    const price = read.priceList.find(p => p.id === 'cross-district-trip');
    assert.equal(price.text, '11 pence');
    assert.equal(city.provenance['cross-district-trip'].evidence, 'S');
    assert.match(city.provenance['cross-district-trip'].locator, /^zh b\d 第\d+章 p\d+$/);
    assert.equal(read.offices[0].eligible, false);
    assert.equal(read.errands[0].eligible, true);
});
t('every pack row is cited and labelled, and the road from the home city takes days away', () => {
    const city = buildNextCity(pack);
    for(const [id, p] of Object.entries(city.provenance)) assert.ok(['S', 'T', 'I'].includes(p.evidence) && p.locator, `row ${id} lacks evidence`);
    const q = quoteRoute(city.route, {money: 0, proposedFare: 30});
    assert.equal(q.legs[0].fareBasis, 'proposed');
    assert.equal(q.eligible, false);
    const s = settleRoute(city.route, {day: 4, money: 30, proposedFare: 30, seed: 3});
    assert.equal(s.arrivedAt, 'backlund-station');
    assert.equal(s.fareCharged, 30);
    assert.ok(s.minutes >= 360);
});
t('verified rows keep their label, authored hours and fares stay marked, and the weekly circle meets by persona only', async () => {
    const city = buildNextCity(pack);
    assert.equal(city.provenance['backlund.clearing-bank'].hoursEvidence, 'I');
    assert.equal(city.provenance['steam-train'].fareEvidence, 'I');
    assert.equal(readRegion(city.region, {reputation: 12, hour: 11, money: 5}).institutions[1].services[0].priceText, 'price not recorded');
    const {meetsOn, seatsOn, trade, leave} = await import('../src/gatherings.js');
    const g = city.gathering;
    assert.deepEqual([0, 3, 7, 14].map(d => meetsOn(g, d)), [true, false, true, true]);
    assert.ok(seatsOn(g, 7).every(s => Object.keys(s).sort().join() === 'label,seatId'));
    const tr = trade(g, {}, {from: 'seat.fool', to: 'seat.justice', give: {kind: 'fact', key: 'news.one'}, take: {kind: 'item', key: 'item.one'}});
    assert.equal(tr.ok, true); assert.deepEqual(tr.exposed, []);
    assert.equal(leave(g, 'seat.fool').bodyRevealed, false);
});
