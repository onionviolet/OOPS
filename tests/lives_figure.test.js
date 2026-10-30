import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec} from '../src/ui/figure.js';
import {livesFigure, livesFromView, MAX_LIVES_DRAWN, MAX_TRACKS} from '../src/ui/lives_figure.js';
import {LIVES_VIEW, LIVES_FIXTURE, LOOP_FIXTURE, DIVERGENCE_FIXTURE, PALACE_FIXTURE} from '../src/ui/preview/fixtures/spacetime.js';

test('every spacetime fixture validates and has a text form with its notes', () => {
    for (const spec of [LIVES_FIXTURE, LOOP_FIXTURE, DIVERGENCE_FIXTURE, PALACE_FIXTURE]) {
        validateFigureSpec(spec);
        const text = figureText(spec);
        assert.ok(text.includes(spec.title));
        for (const note of spec.notes || []) assert.ok(text.includes(note.text));
    }
});

test('lives tree: states, routes, tracks and what carries are all in words', () => {
    const text = figureText(LIVES_FIXTURE);
    assert.match(text, /Ferryman of Lowmere \(current\)/);
    assert.match(text, /Shelved after the fire \(broken\)/);
    assert.match(text, /First life to Ferryman of Lowmere: route/);
    assert.ok(!/Shelved after the fire to/.test(text), 'a life with no route back has no route drawn');
    assert.match(text, /You remember: 14 life events; learned skills Literacy, Smelting/);
    assert.match(text, /Track Ferryman of Lowmere, 2 of 3 done/);
});

test('no connection: one node and an honest note, nothing invented', () => {
    const spec = livesFigure(livesFromView({available: false}));
    assert.equal(spec.nodes.length, 1);
    assert.match(figureText(spec), /Nothing earlier is invented/);
});

test('size caps keep every node inside the figure and name the lives not drawn', () => {
    const lives = Array.from({length: 13}, (_, i) => ({id: `l${i}`, label: `Life ${i}`, active: i === 0, paused: i ? {year: 1, month: 1, day: 1} : undefined, reachable: true, tether: i ? 'l0' : null}));
    const spec = livesFigure({available: true, lives});
    assert.equal(spec.nodes.length, MAX_LIVES_DRAWN);
    assert.ok(spec.tracks.length <= MAX_TRACKS);
    assert.ok(spec.nodes.every(n => n.at.every(v => Math.abs(v) <= 1)));
    assert.match(figureText(spec), /5 more lives are not drawn/);
});

test('challenge and loop show as notes; adapter reads only the view', () => {
    const view = {available: true, life: 'Now life', activeId: 'a', challenge: {kind: 'x'}, loop: {enabled: true, target: 'checkpoint', cycles: 3}, memories: [], mastery: [], paused: [{id: 'p', label: 'Parent', reachable: true, date: {year: 1, month: 1, day: 2}}], initialDate: {year: 1, month: 1, day: 1}, checkpointDate: null};
    const text = figureText(livesFigure(livesFromView(view)));
    assert.match(text, /isolated challenge is running/);
    assert.match(text, /Repeat loop is on.*later point.*3 cycles/);
    assert.match(text, /Now life \(strained\)/);
});

test('renders to svg with the text form beside it', () => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host');
    renderFigure(host, PALACE_FIXTURE, {text: true});
    assert.ok(host.innerHTML.includes('Sealed room (S-11)'));
});
