import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec} from '../src/ui/figure.js';
import {ladderFigureSpec, rungFill} from '../src/ability_ladder_figure.js';
import {pathView} from '../src/ascension_paths.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {LOTM_DIGEST_ACTS} from '../src/book_world_lotm_ids.js';
import {ABILITY_FIXTURES, LANTERN_PATH} from '../src/ui/preview/fixtures/abilities.js';
import {FIGURE_FIXTURES} from '../src/ui/preview/figure_fixtures.js';

const draw = spec => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host');
    return {host, ...renderFigure(host, spec, {text: true})};
};
const all = (node, keep) => [node, ...[...node.children].flatMap(child => all(child, keep))].filter(keep);
const cls = (node, name) => (node.getAttribute('class') || '').split(/\s+/).includes(name);
const fixture = id => ABILITY_FIXTURES.find(spec => spec.id === id);

test('vertical tracks climb from the bottom, fill draws a partial ring and the text form keeps its words', () => {
    const spec = {id: 'v', title: 'V', tracks: [{id: 't', label: 'Ladder', orient: 'vertical', progress: 'standing on two', steps: [
        {label: 'one', state: 'done'}, {label: 'two', state: 'current', fill: .5}, {label: 'three', state: 'guessed', note: 'rumoured'}]}]};
    const {svg, text} = draw(spec);
    const pips = all(svg, n => cls(n, 'fig-step')).map(g => Number(all(g, n => cls(n, 'fig-body'))[0].getAttribute('cy')));
    assert.ok(pips[0] > pips[1] && pips[1] > pips[2], 'first step sits lowest');
    assert.equal(all(svg, n => cls(n, 'fig-fill')).length, 1);
    assert.match(text, /Track Ladder, standing on two: 1\. one \(done\); 2\. two \(current; 50% filled\); 3\. three \(guessed; rumoured\)\./);
    assert.ok(all(svg, n => cls(n, 'fig-track--vertical')).length);
    for (const [bad, pattern] of [[{orient: 'up'}, /orient/], [{steps: [{label: 'a', fill: 2}]}, /fill/], [{progress: ''}, /progress/]])
        assert.throws(() => validateFigureSpec({id: 'x', title: 'X', tracks: [{id: 't', steps: [{label: 'a'}], ...bad}]}), pattern);
});

test('a self ladder marks crossed, current, known, rumoured and unknown rungs, with one unknown rung and never a count', () => {
    const spec = fixture('ladder-lantern-self'), steps = spec.tracks[0].steps;
    assert.deepEqual(steps.map(s => s.state), ['done', 'current', 'pending', 'guessed', 'unknown']);
    assert.equal(steps[1].fill, 4 / 6);
    assert.match(steps[1].note, /feels settling, 4 of 6/);
    assert.equal(spec.tracks[1].steps[0].state, 'current');
    assert.ok(spec.notes.some(n => n.state === 'strained'));
    const deeper = ladderFigureSpec(pathView(LANTERN_PATH, 1, {}, {known: 2, ceiling: 2}));
    assert.equal(deeper.tracks[0].steps.filter(s => s.state === 'unknown').length, 1, 'runs of unknown rungs collapse to one');
    assert.doesNotMatch(figureText(deeper), /of 5|5 rungs/);
});

test('a witness sees only rungs it saw used: no fill, crossings, grants or rungs above', () => {
    const spec = fixture('ladder-lantern-witness'), text = figureText(spec);
    assert.equal(spec.tracks.length, 1);
    assert.ok(spec.tracks[0].steps.every(s => s.fill === undefined));
    assert.deepEqual(spec.tracks[0].steps.map(s => s.state), ['done', 'current', 'unknown']);
    assert.doesNotMatch(text, /Wick-Turner|Glass-Warden|4 of 6|settling|lamp-smoke/);
});

test('the home can drop the crossing track it already lists', () => {
    const view = pathView(LANTERN_PATH, 1, {acting: 2}, {known: 3, ceiling: 2});
    const spec = ladderFigureSpec(view, {crossings: false});
    assert.equal(spec.tracks.length, 1);
    assert.ok(!spec.notes.some(n => /Risk/.test(n.text)));
    assert.equal(rungFill(view).fill, 2 / 6);
});

test('a fresh and a digesting book life give a valid ladder figure from real facts', () => {
    const fresh = ladderFigureSpec(lotmPathView({}, {}));
    validateFigureSpec(fresh);
    assert.equal(fresh.tracks[0].steps[0].state, 'current');
    assert.ok(fresh.tracks[0].steps.every(s => s.fill === undefined));
    const digesting = ladderFigureSpec(lotmPathView({}, {'lotm.flag.allocated': true, 'lotm.flag.ingested': true, 'lotm.acting': 2, 'lotm.digested': false}), {felt: 'settling'});
    const current = digesting.tracks[0].steps.find(s => s.state === 'current');
    assert.equal(current.fill, 2 / LOTM_DIGEST_ACTS);
    assert.match(figureText(digesting), new RegExp(`feels settling, 2 of ${LOTM_DIGEST_ACTS}`));
    const {svg} = draw(digesting);
    assert.equal(all(svg, n => cls(n, 'fig-fill')).length, 2, 'current rung and the counted crossing both fill');
});

test('ability fixtures register in the gallery list once', () => {
    for (const spec of ABILITY_FIXTURES) assert.equal(FIGURE_FIXTURES.filter(f => f.id === spec.id).length, 1);
    for (const spec of ABILITY_FIXTURES) draw(spec);
});
