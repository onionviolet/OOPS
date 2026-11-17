// Shadow Slave, Solo Leveling, Omniscient Reader's Viewpoint and A Regressor's Tale power ledgers (docs/research/power-catalogues-2026-11-16,
// PWC1-PWC7): each committed ledger equals a rebuild from its committed sidecar alone (no private folder needed), every row is
// classified, the split and class maps were fixed by rule, labels are enums with locators and speakers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {BOOKS, buildLedger, SHEET, GRAMMAR, SPEAKERS, SLUGS, CLASS_MAPS, sidecarPath, ledgerPath} from '../scripts/books_power_ledger.mjs';
import {parseLedger} from '../scripts/coverage_report.mjs';
import {attachItemBoundRows} from '../scripts/item_bound_ledgers.mjs';

for (const book of Object.keys(BOOKS)) {
    const side = JSON.parse(readFileSync(sidecarPath(book), 'utf8'));
    const text = readFileSync(ledgerPath(book), 'utf8');
    const rows = text.trim().split('\n').map(l => JSON.parse(l));
    const prefix = {ss: 'ss.', sl: 'sl.', orv: 'orv.', rt: 'rt.'}[book];

    test(`${book}: the committed ledger equals a rebuild from the committed sidecar`, async () => {
        assert.deepEqual(rows, JSON.parse(JSON.stringify(await attachItemBoundRows(buildLedger(book, side)))));
    });

    test(`${book}: every row is classified, ids are unique and prefixed, the shared validator passes, blocked rows name a known slug`, () => {
        assert.deepEqual(parseLedger(text, {name: `${BOOKS[book].stem}_powers`}).problems, []);
        assert.equal(new Set(rows.map(r => r.id)).size, rows.length);
        assert.ok(rows.length >= 30, 'a row per named power');
        for (const r of rows) {
            assert.ok(r.id.startsWith(prefix), r.id);
            assert.notEqual(r.state, 'unclassified', r.id);
            if (r.state.startsWith('blocked:')) assert.ok(SLUGS[r.state.slice(8)], `${r.id} names a slug the sidecar defines`);
            assert.ok(r.note.length > 0 && !/—/.test(r.note), r.id);
        }
    });

    test(`${book}: the split is the sha1 rule and the class maps name only grammar parts and sheet values (pre-registered, never fitted)`, () => {
        for (const [id, r] of Object.entries(side.rows)) assert.equal(r.heldOut, createHash('sha1').update(id).digest()[0] < 0x33, id);
        assert.match(side.meta.foldRule, /stated-class rows/);
        for (const [name, m] of Object.entries(CLASS_MAPS).filter(([, m]) => m.book === book)) {
            const allowed = m.field in GRAMMAR ? GRAMMAR[m.field] : SHEET[m.field];
            for (const values of Object.values(m.classes)) for (const v of values) assert.ok(allowed.includes(v), `${name}: ${v}`);
            assert.deepEqual(side.meta.classMaps[name].classes, m.classes, 'the sidecar records the map that scored it');
        }
    });

    test(`${book}: labels are enums with a locator and speaker; free text is not committed`, () => {
        let labelled = 0;
        for (const [id, r] of Object.entries(side.rows)) {
            assert.ok(r.nameSource.length > 0, `${id} records its name source`);
            if (!r.labels) continue;
            labelled++;
            for (const [k, values] of [...Object.entries(GRAMMAR), ...Object.entries(SHEET)]) {
                const f = r.labels[k];
                assert.ok(values.includes(f.value), `${id}.${k}=${f.value}`);
                assert.ok(SPEAKERS.includes(f.speaker), `${id}.${k} speaker`);
                assert.ok(typeof f.locator === 'string' && (f.locator || ['none', 'unknown', 'none-stated'].includes(f.value)), `${id}.${k} has a locator`);
            }
        }
        assert.equal(labelled, Object.keys(side.rows).length);
    });
}

test('ranks, grades and levels are stated fields and never scored (PWC2)', () => {
    const orv = JSON.parse(readFileSync(sidecarPath('orv'), 'utf8'));
    const kinds = new Set(Object.values(orv.rows).map(r => r.stated?.kind).filter(Boolean));
    assert.ok(kinds.has('stigma-level') && kinds.has('constellation-grade'));
    assert.equal(Object.values(CLASS_MAPS).filter(m => m.book === 'orv' || m.book === 'rt').length, 0);
});

test('the lane never commits private text: evidence lines and replies stay out of the sidecars', () => {
    for (const book of Object.keys(BOOKS)) {
        const raw = readFileSync(sidecarPath(book), 'utf8');
        assert.ok(!/"evidence"|"packets"|"reply"/.test(raw), book);
        assert.ok(raw.length < 3_000_000, `${book} sidecar stays small`);
    }
    assert.ok(existsSync(ledgerPath('ss')));
});
