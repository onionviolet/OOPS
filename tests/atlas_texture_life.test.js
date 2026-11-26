import test from 'node:test';
import assert from 'node:assert/strict';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';
import {lifePage, lifePrice} from '../prototypes/world-atlas/texture-life.mjs';

test('daily life preserves typed prices, zero, unknown, sources and public news context', () => {
    const service = {what: 'Cart fare', kind: 'transport', place: 'lotm.place.market', amount: 0, unit: 'soli', per: 'per ride', priceStated: 'stated', label: 'S', locator: 'en b2 c1 p5'};
    const news = {what: 'Cart leaves at dusk', date: 'Monday', scope: 'public', carriedBy: 'lotm.person.guide', label: 'T', locator: 'en b2 c1 p6'};
    const d = digestWorld({world: 'lotm', shards: [{prefix: 'a', texture: {services: [service, {...service, what: 'Unknown fare', amount: undefined, priceStated: 'not-mentioned'}],
        news: [news, {...news, what: 'PRIVATE_NEWS_PROSE', scope: 'private'}, {...news, what: 'SEALED_NEWS_PROSE', sealed: ['hold']}]}},
    {prefix: 'b', texture: {services: [{...service, locator: 'en b2 c2 p7'}], news: [news]}}]});
    assert.equal(d.life.length, 3);
    assert.equal(d.life[0].serviceKind, 'transport');
    assert.equal(lifePrice(d.life[0]), '0 soli per ride');
    assert.equal(lifePrice(d.life[1]), 'Price not recorded');
    assert.equal(lifePrice({priceStated: 'stated-free'}), 'No charge stated by source');
    assert.deepEqual(d.life[0].sources.map(s => [s.shard, s.locator]), [['a', service.locator], ['b', 'en b2 c2 p7']]);
    assert.equal(d.life[2].date, 'Monday');assert.equal(d.life[2].carriedBy, news.carriedBy);
    assert.doesNotMatch(JSON.stringify(d), /PRIVATE_NEWS_PROSE|SEALED_NEWS_PROSE/);
});

test('every admitted record is reachable by paging or search without duplicating repeated collection', () => {
    const rows = Array.from({length: 181}, (_, i) => ({what: 'Visit stall ' + String(i).padStart(3, '0'), applies: 'lotm.place.market', label: 'T', locator: `en b2 c1 p${i + 1}`}));
    const long = 'A public custom with enough context '.repeat(12) + 'END_MARKER';
    const d = digestWorld({world: 'lotm', shards: [{prefix: 'a', texture: {customs: [...rows, {what: long}]}}, {prefix: 'b', texture: {customs: rows}}]});
    assert.equal(d.life.length, 182);
    assert.equal(d.life.at(-1).what, long);
    const pages = [];
    for (let offset = 0; offset < d.life.length; offset += 30) pages.push(...lifePage(d.life, {offset}).rows);
    assert.equal(pages.length, 182);assert.equal(new Set(pages.map(r => r.what)).size, 182);
    assert.equal(lifePage(d.life, {query: 'stall 180'}).rows[0].what, 'Visit stall 180');
    assert.equal(lifePage(d.life, {query: 'END_MARKER'}).total, 1);
    assert.equal(lifePage(d.life, {kind: 'services'}).total, 0);
});

test('old digests keep scalar evidence and prices while old private news stays hidden', () => {
    const old = [{kind: 'services', what: 'Lodging', at: 'lotm.place.inn', price: 'Eight coins', label: 'T', locator: 'en b2 c1 p3'},
        {kind: 'news', what: 'OLD_PRIVATE_PROSE', at: 'private'}, {kind: 'customs', what: 'Greet the keeper', at: 'lotm.place.inn'}];
    const page = lifePage(old, {query: 'Silver Inn', names: new Map([['lotm.place.inn', 'Silver Inn']])});
    assert.equal(page.total, 2);
    assert.equal(page.rows[0].locator, 'en b2 c1 p3');
    assert.equal(lifePrice(page.rows[0]), 'Eight coins');
    assert.doesNotMatch(JSON.stringify(lifePage(old)), /OLD_PRIVATE_PROSE/);
});
