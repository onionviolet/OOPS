import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePicks, applyPicksToBase, predictChanges, mergeKeepingKeys, diffPacks, FLAGGED_PLACES} from '../scripts/atlas/transfer_candidate.mjs';

// Synthetic pack only: no private files.
const DISTRICTS = ['evernight', 'storm', 'machinery'];
const pack = () => ({
    places: [
        {id: 'w.city', name: 'City', kind: 'region'},
        {id: 'w.outskirts', name: 'Outskirts', kind: 'building', parent: 'w.city'},
        {id: 'w.farm', name: 'Farm', kind: 'building', parent: 'w.outskirts', travel: {district: 'evernight', minutes: 2}},
        {id: 'w.shed', name: 'Shed', kind: 'building', parent: 'w.outskirts'},
        {id: 'w.corner', name: 'Corner', kind: 'sub-place', parent: 'w.outskirts'},
        {id: 'w.sea', name: 'Sea', kind: 'building'},
        {id: 'w.bay', name: 'Bay', kind: 'building', parent: 'w.sea'},
    ],
    placeAliases: [{id: 'Out', indexId: 'i.out', place: 'w.outskirts'}, {id: 'Sea', indexId: 'i.sea', place: 'w.sea'}],
});
const flagged = {'w.sea': 'a sea'};

test('valid picks pass', () => {
    const r = validatePicks([{place: 'w.outskirts', district: 'storm'}], pack(), DISTRICTS, {flagged});
    assert.deepEqual(r.errors, []);
    assert.deepEqual(r.flagged, []);
});

test('unknown place is refused', () => {
    const r = validatePicks([{place: 'w.nowhere', district: 'storm'}], pack(), DISTRICTS, {flagged});
    assert.equal(r.errors.length, 1);
    assert.match(r.errors[0], /unknown place w\.nowhere/);
});

test('unknown district is refused', () => {
    const r = validatePicks([{place: 'w.outskirts', district: 'sky'}], pack(), DISTRICTS, {flagged});
    assert.match(r.errors.join('\n'), /unknown district sky/);
});

test('duplicate and malformed picks are refused', () => {
    const r = validatePicks([{place: 'w.outskirts', district: 'storm'}, {place: 'w.outskirts', district: 'storm'}, {place: 'w.shed'}], pack(), DISTRICTS, {flagged});
    assert.match(r.errors.join('\n'), /picked twice/);
    assert.match(r.errors.join('\n'), /needs string place and district/);
});

test('flagged place is refused, also inside it, unless allowed', () => {
    for (const place of ['w.sea', 'w.bay']) {
        const r = validatePicks([{place, district: 'storm'}], pack(), DISTRICTS, {flagged});
        assert.equal(r.errors.length, 1, place);
        assert.match(r.errors[0], /flagged/);
        assert.equal(r.flagged.length, 1);
    }
    const ok = validatePicks([{place: 'w.sea', district: 'storm'}], pack(), DISTRICTS, {flagged, allowFlagged: true});
    assert.deepEqual(ok.errors, []);
    assert.equal(ok.flagged.length, 1);
});

test('the real flagged list names the four places from F9 and F13', () => {
    assert.equal(Object.keys(FLAGGED_PLACES).length, 4);
    const text = Object.values(FLAGGED_PLACES).join(' ');
    for (const n of ['Sunia Sea', 'West Bailang', 'Jinwutong', 'East Bailang Dockyard']) assert.match(text, new RegExp(n));
});

test('overlay promotes the pick to an authored base row and copies its aliases (F11)', () => {
    const built = pack(), base = {places: [], placeAliases: []};
    applyPicksToBase(base, built, [{place: 'w.outskirts', district: 'storm'}]);
    assert.equal(base.places.length, 1);
    assert.equal(base.places[0].travel.district, 'storm');
    assert.equal(base.places[0].travel.provenance, 'authored');
    assert.deepEqual(base.placeAliases.map(a => a.indexId), ['i.out']);
    applyPicksToBase(base, built, [{place: 'w.outskirts', district: 'machinery'}]);
    assert.equal(base.places.length, 1, 'replaces, does not duplicate');
    assert.equal(base.placeAliases.length, 1, 'aliases are not duplicated');
    assert.equal(built.places[1].travel, undefined, 'built pack is not mutated');
});

test('prediction is the pick plus unplaced descendants, skipping sub-places and placed ones', () => {
    assert.deepEqual(predictChanges(pack(), [{place: 'w.outskirts', district: 'storm'}]), ['w.outskirts', 'w.shed']);
    assert.deepEqual(predictChanges(pack(), []), []);
});

test('merge keeps every live key the compilers did not produce', () => {
    const live = {schema: 's', places: [1], bindings: {a: 1}, host: {h: 1}, journeys: {journeys: ['old']}, topicTalks: {talks: ['old']}};
    const compiled = {schema: 's', places: [2], journeys: {journeys: ['new']}, topicTalks: {talks: ['new']}};
    const m = mergeKeepingKeys(live, compiled);
    assert.deepEqual(m.lost, []);
    assert.deepEqual(m.carried.sort(), ['bindings', 'host']);
    assert.deepEqual(m.pack.bindings, {a: 1});
    assert.deepEqual(m.pack.places, [2], 'compiler output wins for keys it produces');
    assert.deepEqual(m.pack.journeys, {journeys: ['old']}, 'derived keys stay live by default');
    const r = mergeKeepingKeys(live, compiled, {recompileDerived: true});
    assert.deepEqual(r.pack.journeys, {journeys: ['new']});
    assert.deepEqual(r.lost, []);
    m.pack.bindings.a = 9;
    assert.equal(live.bindings.a, 1, 'merge copies, it does not alias live');
});

test('diff reports zero change for identical packs and flags a lost key', () => {
    const live = {...pack(), bindings: {}};
    const same = diffPacks(live, structuredClone(live));
    assert.equal(same.places.changed.length + same.places.added.length + same.places.removed.length, 0);
    assert.equal(same.everyLiveKeyPresent, true);
    const cand = structuredClone(live); delete cand.bindings;
    const lost = diffPacks(live, cand);
    assert.equal(lost.everyLiveKeyPresent, false);
    assert.deepEqual(lost.lostKeys, ['bindings']);
});

test('diff counts changed places per field and travel subfield', () => {
    const live = pack(), cand = pack();
    cand.places[3] = {...cand.places[3], district: 'storm', travel: {district: 'storm', provenance: 'authored'}};
    cand.places = cand.places.slice(0, 5);
    const d = diffPacks(live, cand);
    assert.deepEqual(d.places.changed, ['w.shed']);
    assert.equal(d.places.fieldCounts.district, 1);
    assert.equal(d.places.fieldCounts.travel, 1, 'travel appeared where it did not exist');
    assert.deepEqual(d.places.removed.sort(), ['w.bay', 'w.sea']);
});
