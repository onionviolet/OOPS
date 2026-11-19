import test from 'node:test';
import assert from 'node:assert/strict';
import {noticedFromPlace} from '../src/place_noticed.js';
import {loadPrivateNoticed} from '../src/book_world_lotm_noticed.js';

const records = [{noun: 'Desk', acts: [{id: 'a', verb: 'Look over'}]}, {noun: 'Wall lamp', acts: [{id: 'b', verb: 'Light'}]}, {noun: 'Mirror'}];

test('PS305: a place record is a noun; an offered act of it is its verb, an unoffered one leaves a plain noun', () => {
    const opened = [];
    const rows = noticedFromPlace(records, [{id: 'a', label: 'Look over the desk · 1 min', eligible: true}], {open: id => opened.push(id)});
    assert.deepEqual(rows.map(r => [r.name, r.verbs.map(v => v.short)]), [['Desk', ['Look over']], ['Wall lamp', []], ['Mirror', []]]);
    rows[0].verbs[0].run();
    assert.deepEqual(opened, ['a']);
});

test('PS305: an ineligible act keeps its reason; acts the records did not name add their own nouns; the count is a dial', () => {
    const acts = [{id: 'b', label: 'Light the wall lamp', eligible: false, reasons: ['Supply the gas meter first.']}, {id: 'c', label: 'Clear the table', eligible: true}];
    const rows = noticedFromPlace(records, acts);
    assert.deepEqual(rows.map(r => r.name), ['Desk', 'Wall lamp', 'Mirror', 'Table']);
    assert.deepEqual([rows[1].verbs[0].disabled, rows[1].verbs[0].reason], [true, 'Supply the gas meter first.']);
    assert.equal(noticedFromPlace(records, acts, {max: 2}).length, 2);
});

test('PS305: with no records a place shows only what its acts name', () => {
    assert.deepEqual(noticedFromPlace([], [{id: 'c', label: 'Clear the table', eligible: true}]).map(r => r.name), ['Table']);
    assert.deepEqual(noticedFromPlace(), []);
});

test('PS305: the loader reads the pack only when the manifest lists it', async () => {
    const files = {'private_packs/manifest.json': {schema: 1, supplements: ['lotm-noticed/noticed.json']}, 'private_packs/lotm-noticed/noticed.json': {schema: 1, places: {p: records}}};
    const fetchFile = async path => files[path] ? {ok: true, json: async () => files[path]} : {ok: false};
    assert.equal((await loadPrivateNoticed(fetchFile)).places.p[0].noun, 'Desk');
    files['private_packs/manifest.json'].supplements = [];
    assert.equal(await loadPrivateNoticed(fetchFile), null);
});
