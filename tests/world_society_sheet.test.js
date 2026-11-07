import test from 'node:test';
import assert from 'node:assert/strict';
import {SHEETS, SHEET_FIELDS, STATUSES, sheetCoverage} from '../src/world_society_sheet.js';
import {locatorProblem} from '../scripts/world_society_sheet_report.mjs';

test('every sheet declares every field with a status', () => {
    assert.ok(SHEETS.length >= 2);
    for(const s of SHEETS) {
        assert.deepEqual(Object.keys(s.fields).sort(), [...SHEET_FIELDS].sort(), s.id);
        for(const id of SHEET_FIELDS) assert.ok(STATUSES.includes(s.fields[id].status), `${s.id}.${id}`);
    }
});
test('every field has a valid owner (or, when missing, home) locator, and palette rows name their palette', () => {
    for(const s of SHEETS) for(const id of SHEET_FIELDS) {
        const row = s.fields[id], loc = row.status === 'missing' ? row.home : row.owner;
        assert.equal(locatorProblem(loc), null, `${s.id}.${id}: ${loc}`);
        if(row.status === 'palette') assert.ok(row.palette, `${s.id}.${id} needs a palette name`);
    }
});
test('coverage counts add up and an unresolvable locator is reported', () => {
    for(const s of SHEETS) { const c = sheetCoverage(s); assert.equal(c.authored + c.palette + c.missing, c.total); }
    assert.match(locatorProblem('src/book_world_lotm_pay.js#NoSuchExport'), /no export/);
    assert.match(locatorProblem('src/nope.js'), /not found/);
});
test('sheets name no secret truth: only IDs and plain-world facts', () => {
    assert.ok(!/\bsecret\b/i.test(JSON.stringify(SHEETS)));
});
test('Hogwarts coverage: positions authored, law and institutions palette, address still missing', () => {
    const c = sheetCoverage(SHEETS.find(s => s.id === 'little_whinging_hogwarts'));
    assert.deepEqual([c.authored, c.palette, c.missing], [3, 3, 1]);
});
