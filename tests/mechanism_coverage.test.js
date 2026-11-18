// MF3: the mechanism map is consistent with the canonical blocked slugs, and the coverage report is a pure function of the map and counts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readMechanismMap, checkMap, tierOf, report, blockedCounts} from '../scripts/mechanism_coverage.mjs';

test('the committed map has no problems and covers every canonical slug', () => {
    assert.deepEqual(checkMap(readMechanismMap()), []);
});

test('tiers follow the built verbs', () => {
    const subs = {a: {built: ['x']}};
    assert.equal(tierOf({substrate: 'a', verbs: ['x']}, subs), 'owned');
    assert.equal(tierOf({substrate: 'a', verbs: ['x', 'y']}, subs), 'partial');
    assert.equal(tierOf({substrate: 'a', verbs: ['y']}, subs), 'designed');
    assert.equal(tierOf({class: 'reading'}, subs), 'reading');
    assert.equal(tierOf(undefined, subs), 'unmapped');
});

test('report shares come from counts and exclude label debt from the mechanism denominator', () => {
    const map = {substrates: {s: {built: ['x'], verbs: ['x', 'y']}}, slugs: {a: {substrate: 's', verbs: ['x']}, b: {substrate: 's', verbs: ['y']}, r: {class: 'reading'}}, abilities: {}, families: {n: {narrative: true}}};
    const r = report(map, {a: 30, b: 10, r: 60, ghost: 10});
    assert.equal(r.mechanismRows, 50);
    assert.equal(r.shareOwned, 60);
    assert.equal(r.shareMapped, 80);
    assert.deepEqual(r.unmappedSlugs, ['ghost']);
    assert.deepEqual(r.abilityTiers.gaps, ['n']);
});

test('the live ledgers produce a sane report', () => {
    const r = report(readMechanismMap(), blockedCounts());
    assert.ok(r.blockedRows > 20000);
    assert.equal(r.shareMapped, 100, `unmapped: ${r.unmappedSlugs}`);
    assert.ok(r.shareOwned > 0 && r.shareOwned < 100);
});
