// PWC128 / PWC131: the observer counts what lands, and each played entry point lands through landEffect once per completion.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LAND_TAP, landEffect, withLandingEntry} from '../src/effect_host.js';
import {ENTRY_POINTS, playedEffectsTick, resetPlayedEffects} from '../src/played_effects_domain.js';
import {landPlayed, sentence} from '../src/played_landing.js';
import {renderReadme, landingsHeadline} from '../scripts/coverage_report.mjs';

const tap = () => { const rows = []; globalThis[LAND_TAP] = row => rows.push(row); return rows; };
const done = () => { delete globalThis[LAND_TAP]; resetPlayedEffects(); };

test('with no observer set, landEffect behaves as before and reports nothing', () => {
    delete globalThis[LAND_TAP];
    const run = landPlayed({entry: 'e', law: 'l', body: {id: 'b', quantities: {vitality: 10}},
        steps: [{sentence: sentence('remove', 'vitality', 'line', 'instant', 'x'), details: {amount: 3}}]});
    assert.equal(run.after.quantities.vitality, 7);
});

test('the observer reports changed landings by law and entry; labels from withLandingEntry apply', () => {
    const rows = tap();
    try {
        landPlayed({entry: 'ordinary', law: 'gu-working', body: {id: 'b', quantities: {vitality: 10}},
            steps: [{sentence: sentence('remove', 'vitality', 'line', 'instant', 'x'), details: {amount: 3}}]});
        assert.deepEqual(rows.map(r => [r.entry, r.law, r.changed]), [['ordinary', 'gu-working', true]]);
        assert.equal(typeof landEffect, 'function');
        withLandingEntry({entry: 'capability-run'}, () => landPlayed({entry: undefined, law: 'l', body: {id: 'b', quantities: {vitality: 10}},
            steps: [{sentence: sentence('remove', 'vitality', 'line', 'instant', 'x'), details: {amount: 1}}]}));
        assert.equal(rows.at(-1).entry, 'capability-run');
    } finally { done(); }
});

test('each played entry point lands once per completion and never on the first (baseline) tick', () => {
    const rows = tap(), lines = [];
    try {
        const counts = Object.fromEntries(ENTRY_POINTS.map(row => [row.key, 1]));
        playedEffectsTick(counts, line => lines.push(line));                 // baseline after a load: nothing lands
        assert.equal(rows.length, 0);
        const next = Object.fromEntries(ENTRY_POINTS.map(row => [row.key, 2]));
        playedEffectsTick(next, line => lines.push(line));
        playedEffectsTick(next, line => lines.push(line));                   // the same counters again: nothing more
        assert.equal(lines.length, 3);
        const fired = rows.filter(r => r.changed);
        assert.deepEqual([...new Set(fired.map(r => `${r.law}/${r.entry}`))].sort(),
            ['brew-dose/tingen-supervised-dose', 'gu-working/keeper-moonblade-hunt', 'layered-ward/gu-house-ward']);
        assert.equal(fired.length, 3 + 0, 'ward raise, hunt strike and dose each count once; the blocked pest strike is idle');
    } finally { done(); }
});

test('the ward blocks the pest strike and the hunt takes the boar down', () => {
    const lines = [];
    try {
        const counts = Object.fromEntries(ENTRY_POINTS.map(row => [row.key, 0]));
        playedEffectsTick(counts, () => {});
        playedEffectsTick(Object.fromEntries(ENTRY_POINTS.map(row => [row.key, 1])), line => lines.push(line));
        assert.match(lines.find(l => /ward/.test(l)), /turned away/);
        assert.match(lines.find(l => /Moonblade/.test(l)), /lost 12 of 12/);
        assert.match(lines.find(l => /dose/.test(l)), /mood 10 to 14/);
    } finally { done(); }
});

test('the coverage headline is rendered from the receipt, by law and entry point, with excluded shown', () => {
    const receipt = {schema: 1, season: {minutes: 2880, actions: 300, seed: 1}, landed: 3, starts: [
        {start: 'village', landed: 0, excluded: 0, byLaw: {}, byEntry: {}},
        {start: 'book.ri.keeper', landed: 3, excluded: 0, byLaw: {'gu-working': 2, 'layered-ward': 1}, byEntry: {'keeper-moonblade-hunt': 2, 'gu-house-ward': 1}}]};
    const text = landingsHeadline(receipt).join('\n');
    assert.match(text, /3 effects landed in ordinary play/);
    assert.match(text, /gu-working 2/);
    assert.match(text, /keeper-moonblade-hunt 2/);
    assert.match(renderReadme([], {landings: receipt}), /^## Headline: effects that fire in ordinary play/m);
    assert.match(landingsHeadline(null).join('\n'), /No receipt yet/);
});
