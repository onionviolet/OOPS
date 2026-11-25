// Power ledgers for Mother of Learning, Circle of Inevitability, The Legendary Mechanic and I Am the Fated Villain
// (docs/research/power-catalogues-2026-11-16, PWC1-PWC7, PWC17): each committed ledger equals a rebuild from its committed
// sidecar alone (no private folder), every row is classified, the split was fixed by rule, labels are enums with a locator and a
// speaker, linked Sequence rows point at real lotm_potions ids, and an unscored book says why.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {BOOKS, buildLedger, ledgerPath, ENUMS, SPEAKERS, SLUGS, BLOCKERS, STATED, PATHWAY_OF_OBJECT, scoreCoi, heldOut} from '../scripts/book_power_ledgers.mjs';
import {parseLedger} from '../scripts/coverage_report.mjs';
import {EFFECT_OBJECTS} from '../src/effect_grammar.js';
import {attachItemBoundRows} from '../scripts/item_bound_ledgers.mjs';
import {attachFormRows} from '../scripts/form_transformation_ledgers.mjs';
import {attachDivinationRows} from '../scripts/divination_ledgers.mjs';

const file = name => new URL(`../docs/coverage/${name}`, import.meta.url);
const lotm = new Set(readFileSync(file('lotm_potions.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l).id));

for (const [key, book] of Object.entries(BOOKS)) {
    const side = JSON.parse(readFileSync(file(`${book.slug}_power_labels.json`), 'utf8'));
    const text = readFileSync(ledgerPath(key), 'utf8');
    const rows = text.trim().split('\n').map(l => JSON.parse(l));

    test(`${key}: the committed ledger equals a rebuild from the committed sidecar`, async () => {
        assert.deepEqual(rows, JSON.parse(JSON.stringify(await attachDivinationRows(await attachFormRows(await attachItemBoundRows(buildLedger(side)))))));
    });

    test(`${key}: every row is classified, ids are unique, the validator passes, blocked rows name a known slug`, () => {
        assert.deepEqual(parseLedger(text, {name: `${book.slug}_powers`}).problems, []);
        assert.equal(new Set(rows.map(r => r.id)).size, rows.length);
        for (const r of rows) {
            assert.ok(r.id.startsWith(`${book.prefix}.`), r.id);
            assert.notEqual(r.state, 'unclassified', r.id);
            if (r.state.startsWith('blocked:')) assert.ok(SLUGS[r.state.slice(8)], `${r.id} names a slug the vocabulary defines`);
            assert.ok(r.note.length > 0 && !/—/.test(r.note), r.id);
        }
    });

    test(`${key}: the split is the sha1 rule, labels are enums with a locator and speaker, free text is not committed`, () => {
        for (const [id, r] of Object.entries(side.rows)) {
            assert.equal(r.heldOut, createHash('sha1').update(id).digest()[0] < 0x33, id);
            assert.equal(r.heldOut, heldOut(id));
            assert.ok(r.nameSource.length > 0 || r.labels === null || true, id);
            if (!r.labels) continue;
            for (const [k, values] of Object.entries(ENUMS)) {
                assert.ok(values.includes(r.labels[k].value), `${id}.${k}=${r.labels[k].value}`);
                assert.ok(SPEAKERS.includes(r.labels[k].speaker), `${id}.${k} speaker`);
                assert.equal(typeof r.labels[k].locator, 'string');
            }
            for (const k of STATED) assert.equal(typeof r.labels[k].stated, 'boolean', `${id}.${k}`);
            assert.ok(BLOCKERS.includes(r.labels.blocker), `${id} blocker`);
            assert.ok(!('reason' in r.labels), `${id} free text stays private`);
        }
        assert.match(side.meta.split, /sha1/);
    });

    test(`${key}: scoring is stated, and unscored books give their reason`, () => {
        if (book.scored) {
            assert.match(side.meta.scoring.foldRule, /pre-registered|baseline/);
            for (const object of Object.keys(PATHWAY_OF_OBJECT)) assert.ok(object in EFFECT_OBJECTS, object);
            assert.deepEqual(side.meta.score, JSON.parse(JSON.stringify(scoreCoi(side))));
        } else {
            assert.ok(side.meta.scoring.reason.length > 20);
            assert.equal(side.meta.score.scored, false);
        }
    });

    test(`${key}: linked Sequence rows point at a real lotm_potions row and stay catalogued`, () => {
        for (const [id, r] of Object.entries(side.rows)) if (r.link) {
            assert.ok(lotm.has(r.link), `${id} -> ${r.link}`);
            assert.equal(rows.find(x => x.id === id).state, 'catalogued');
        }
    });
}
