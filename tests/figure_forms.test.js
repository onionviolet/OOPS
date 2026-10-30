// Non-node figure forms (COV4): table, card, band, chips and bars validate, keep a text form, draw rects, and the
// adapters take every label from the view they are given (AD46), so no world's ids sit in shared UI code.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec} from '../src/ui/figure.js';
import {FORMS_FIXTURES, OWED_TABLE_FIXTURE, DAY_BAND_FIXTURE} from '../src/ui/preview/fixtures/forms.js';
import {homeFigureSpec, homeOverviewModel} from '../src/home_overview_model.js';

const draw = spec => { const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>'); const host = dom.document.getElementById('h'); renderFigure(host, spec, {text: true}); return host; };
const count = (node, name) => node.querySelectorAll(name).length;

test('every forms fixture validates, draws rects and no circles, and its text form holds its facts', () => {
    for (const spec of FORMS_FIXTURES) {
        const host = draw(spec), text = figureText(spec);
        assert.ok(count(host, 'rect') > 0, `${spec.id} draws rects`);
        assert.equal(count(host, 'circle'), 0, `${spec.id} draws no circles`);
        assert.ok(host.querySelector('.fig-text'), `${spec.id} has its text form`);
        assert.ok(text.length > 40);
    }
});

test('the owed table keeps a bar word for every bar, and a late row is marked in words', () => {
    const text = figureText(OWED_TABLE_FIXTURE);
    assert.match(text, /\(strained\)/);
    assert.match(text, /% of term left \(\d+% left\)/);
});

test('the day band keeps lanes, the now mark and every level word', () => {
    const text = figureText(DAY_BAND_FIXTURE);
    assert.match(text, /now at 15/);
    for (const word of ['heavy', 'steady rain', 'on Around you']) assert.ok(text.includes(word), word);
});

test('malformed forms fail with a readable message', () => {
    const base = {id: 'x', title: 'X'};
    assert.throws(() => validateFigureSpec({...base, bars: [{id: 'b', label: 'B', rows: [{label: 'a', words: 'w', value: 5, max: 2}]}]}), /within 0 and max/);
    assert.throws(() => validateFigureSpec({...base, bands: [{id: 'b', label: 'B', axis: {from: 0, to: 10}, spans: [{from: 5, to: 12, label: 'late'}]}]}), /within the axis/);
    assert.throws(() => validateFigureSpec({...base, tables: [{id: 't', label: 'T', columns: [{label: 'a'}], rows: [{cells: ['1', '2']}]}]}), /one word per column/);
    assert.throws(() => validateFigureSpec({...base, chips: [{id: 'c', label: 'C', items: [{label: 'x', state: 'nope'}]}]}), /unknown state/);
    assert.throws(() => validateFigureSpec({...base, bands: [{id: 'b', label: 'B', axis: {from: 0, to: 10}, spans: [{from: 1, to: 2, label: 'l', level: .5}]}]}), /note in words/);
});

test('the home room strip is chips, not nodes', () => {
    const spec = homeFigureSpec({empty: null, id: 'h1', header: {name: 'Hut', comfort: {label: 'Cramped'}, where: 'You are here.'},
        fittings: [{id: 'sleep', label: 'Sleep', state: 'done', note: 'bed'}, {id: 'store', label: 'Storage', state: 'empty', note: 'nothing fitted'}], rooms: []});
    const host = draw(spec);
    assert.equal(count(host, 'circle'), 0);
    assert.ok(count(host, 'rect') >= 2);
    assert.match(figureText(spec), /Fittings: 1 of 2 fitted/);
});

test('shared form code names no world (AD46)', () => {
    for (const file of ['../src/ui/figure.js', '../src/ui/form_adapters.js']) {
        const src = readFileSync(new URL(file, import.meta.url), 'utf8');
        assert.doesNotMatch(src, /lotm|tingen|village|lanternside/i, file);
    }
});
