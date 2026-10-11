import test from 'node:test';
import assert from 'node:assert/strict';
import {title_catalog, normalizeTitles, newlyEarnedTitles, grantEarnedTitles, titleBonuses, titleView, yearsSince, describeTitleBonus} from '../src/titles.js';

test('catalog ids are unique and every title has a counter and threshold', () => {
    assert.equal(new Set(title_catalog.map(t => t.id)).size, title_catalog.length);
    for(const t of title_catalog) assert.ok(t.counter && t.at > 0 && t.name && t.text, t.id);
});

test('a title is granted exactly at its threshold and never twice', () => {
    const titles = {};
    assert.deepEqual(grantEarnedTitles(titles, {kills: 99}, 5), ['first_blood']);
    assert.deepEqual(newlyEarnedTitles(titles, {kills: 99}), []);
    assert.deepEqual(grantEarnedTitles(titles, {kills: 100}, 9), ['hunter']);
    assert.deepEqual(titles.first_blood, {at: 5});
    assert.deepEqual(grantEarnedTitles(titles, {kills: 100}, 10), []);
});

test('old saves ({}) and corrupt records normalize; unknown ids survive but grant nothing', () => {
    assert.deepEqual(normalizeTitles(undefined), {});
    assert.deepEqual(normalizeTitles([]), {});
    const t = normalizeTitles({hunter: {at: 3}, from_future: {at: 7}, broken: 5, bad_at: {at: -1}});
    assert.deepEqual(t, {hunter: {at: 3}, from_future: {at: 7}, bad_at: {at: 0}});
    assert.deepEqual(titleBonuses(t).xp_multipliers, {Combat: 1.02});
});

test('bonuses are derived from held titles, so recomputing after a reload gives the same values', () => {
    const titles = {};
    grantEarnedTitles(titles, {kills: 1000, hits_taken: 5000}, 1);
    const first = titleBonuses(titles);
    const reloaded = titleBonuses(normalizeTitles(JSON.parse(JSON.stringify(titles))));
    assert.deepEqual(reloaded, first);
    assert.equal(first.xp_multipliers.Combat, 1.02 * 1.03);
    assert.equal(first.multipliers.max_health, 1.02);
});

test('years lived use 30-day months from the start date', () => {
    assert.equal(yearsSince({year: 999, month: 4, day: 1}), 0);
    assert.equal(yearsSince({year: 1000, month: 3, day: 30}), 0);
    assert.equal(yearsSince({year: 1000, month: 4, day: 1}), 1);
    assert.equal(yearsSince({year: 1009, month: 4, day: 1}), 10);
});

test('view lists every title with capped progress and readable bonus text', () => {
    const view = titleView({first_blood: {at: 0}}, {kills: 50000});
    assert.equal(view.length, title_catalog.length);
    assert.equal(view.find(r => r.id === 'first_blood').held, true);
    assert.equal(view.find(r => r.id === 'hunter').progress, 100);
    assert.equal(describeTitleBonus({flats: {crit_rate: 0.005}}), '+0.5% crit chance');
    assert.equal(describeTitleBonus({xp_multipliers: {Combat: 1.02}}), '+2% Combat xp');
});
