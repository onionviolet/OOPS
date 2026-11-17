// Perfect Run power ledger (docs/research/power-catalogues-2026-11-16, PWC1-PWC7): the committed ledger equals a rebuild from
// the committed sidecar alone (no private folder needed), every row is classified, the split and colour map were fixed by
// rule, labels are enums with locators and speakers, and Bad Runs rows stay in their own layer.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildLedger, SHEET, GRAMMAR, SPEAKERS, SLUGS, COLOUR_OF_OBJECT} from '../scripts/perfect_run_power_ledger.mjs';
import {parseLedger} from '../scripts/coverage_report.mjs';
import {EFFECT_OBJECTS} from '../src/effect_grammar.js';

const file = name => new URL(`../docs/coverage/${name}`, import.meta.url);
const side = JSON.parse(readFileSync(file('perfect_run_power_labels.json'), 'utf8'));
const text = readFileSync(file('perfect_run_powers.jsonl'), 'utf8');
const rows = text.trim().split('\n').map(l => JSON.parse(l));

test('the committed ledger equals a rebuild from the committed sidecar', () => {
    assert.deepEqual(rows, JSON.parse(JSON.stringify(buildLedger(side))));
});

test('every row is classified, ids are unique, the shared validator passes, blocked rows name a known slug', () => {
    assert.deepEqual(parseLedger(text, {name: 'perfect_run_powers'}).problems, []);
    assert.equal(new Set(rows.map(r => r.id)).size, rows.length);
    assert.ok(rows.length >= 100, 'a row per named power');
    for (const r of rows) {
        assert.notEqual(r.state, 'unclassified', r.id);
        if (r.state.startsWith('blocked:')) assert.ok(SLUGS[r.state.slice(8)], `${r.id} names a slug the sidecar defines`);
        assert.ok(r.note.length > 0 && !/—/.test(r.note), r.id);
    }
});

test('the split is the sha1 rule and the colour map only names grammar objects (pre-registered, never fitted)', () => {
    for (const [id, r] of Object.entries(side.rows)) assert.equal(r.heldOut, createHash('sha1').update(id).digest()[0] < 0x33, id);
    for (const object of Object.keys(COLOUR_OF_OBJECT)) assert.ok(object in EFFECT_OBJECTS, object);
    assert.match(side.meta.foldRule, /stated-colour rows/);
});

test('labels are enums with a locator and speaker; free text is not committed', () => {
    let labelled = 0;
    for (const [id, r] of Object.entries(side.rows)) {
        assert.ok(r.nameSource.length > 0, `${id} records its name source`);
        if (!r.labels) continue;
        labelled++;
        for (const [k, values] of [...Object.entries(GRAMMAR), ...Object.entries(SHEET)]) {
            const f = r.labels[k];
            assert.ok(values.includes(f.value), `${id}.${k}=${f.value}`);
            assert.ok(SPEAKERS.includes(f.speaker), `${id}.${k} speaker`);
            assert.ok(typeof f.locator === 'string' && (f.locator || f.value === 'none' || f.value === 'unknown' || f.value === 'none-stated'), `${id}.${k} has a locator`);
        }
    }
    assert.equal(labelled, Object.keys(side.rows).length);
});

test('Bad Runs what-ifs keep their own namespace and never carry a main digest row', () => {
    for (const [id, r] of Object.entries(side.rows)) {
        if (r.layer === 'bad-run') assert.match(id, /^pr\.badrun\./);
        else assert.doesNotMatch(id, /^pr\.badrun\./);
    }
    assert.ok(Object.values(side.rows).filter(r => r.layer === 'bad-run').length >= 3);
});

test('stated colours are scored apart from inferred and conflicting ones; Quicksave names its loop blocker', () => {
    const basis = new Set(Object.values(side.rows).map(r => r.colour?.basis).filter(Boolean));
    for (const b of ['stated', 'inferred', 'conflict']) assert.ok(basis.has(b), b);
    assert.equal(rows.find(r => r.id === 'pr.power.quicksave').state, 'blocked:time-loop');
    assert.equal(rows.find(r => r.id === 'pr.power.time-stop').state, 'blocked:time-stop');
});
