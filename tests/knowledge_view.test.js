import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec} from '../src/ui/figure.js';
import {observerView} from '../src/observer_view.js';
import {knowledgeView, knowsLine, knowsRows, knowsCases, caseLine, knowsGlance} from '../src/knowledge_view.js';
import {knowledgeFixtureState, SEALED_LINE, KNOWLEDGE_FIXTURE} from '../src/ui/preview/fixtures/knowledge.js';

const view = state => knowledgeView(observerView(state), {clock: state.clock});
const textOf = n => n.textContent ?? [...n.children].map(textOf).join(' ');
const drawn = spec => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host');
    renderFigure(host, spec, {text: true});
    return textOf(host);
};

test('a sealed truth held elsewhere never reaches the rows, the board, its text form or the drawing', () => {
    const v = view(knowledgeFixtureState());
    const surfaces = [JSON.stringify(v.rows), v.rows.map(knowsLine).join('\n'), JSON.stringify(v.board), figureText(v.board), drawn(v.board)];
    for (const surface of surfaces) {
        assert.ok(!surface.includes(SEALED_LINE), 'sealed line leaked');
        assert.ok(!surface.includes('Hollis'), 'sealed name leaked');
    }
    // The seat still sees its own lines, so the absence is not an empty render.
    assert.ok(v.rows.some(r => r.text.includes('bell rope was cut')));
    assert.match(drawn(v.board), /bell rope was cut/);
});

test('a truth reaches the board only once the seat itself receives it', () => {
    const state = knowledgeFixtureState();
    state.simulation.knowledge.player['divination.reveal'] = {stage: 'understood', value: SEALED_LINE, at: state.clock, cause: 'scry.reveal'};
    assert.ok(view(state).rows.some(r => r.text === SEALED_LINE && r.certainty === 'known'));
});

test('one known, guessed and open grammar with provenance and dates', () => {
    const rows = knowsRows(observerView(knowledgeFixtureState()), {clock: knowledgeFixtureState().clock});
    const by = key => rows.find(r => r.key === key);
    assert.equal(by('harbor.rope.cut').certainty, 'known');
    assert.equal(by('harbor.rope.cut').provenance, 'You saw it');
    assert.equal(by('harbor.rope.cut').when, 'yesterday');
    assert.equal(by('harbor.warden.word').provenance, 'You were told');
    assert.equal(by('inference.bell.someone').certainty, 'guessed');
    assert.match(knowsLine(by('inference.bell.someone')), /^Guessed: .*doubt: the lock could have been picked\)$/);
    assert.equal(by('divination.ledger.signal').certainty, 'open');
    assert.match(by('divination.ledger.signal').provenance, /smoke reading; nothing answered/);
    assert.equal(by('divination.tide.interpretation').provenance, 'Divined by water bowl');
    assert.equal(by('intent:bell').intent, 'active');
    assert.equal(by('intent:ledger').certainty, 'open');
});

test('the board draws evidence links and stays a valid figure with a legend in words', () => {
    const v = view(knowledgeFixtureState());
    const spec = validateFigureSpec(v.board);
    assert.ok(spec.edges.length >= 3, 'rope, warden word and the tide sign each support a reading');
    const text = figureText(v.board);
    assert.match(text, /Key: ● filled means known/);
    assert.match(text, /Key: · pending means guessed/);
    assert.match(text, /Key: \? unknown means open/);
    assert.deepEqual(KNOWLEDGE_FIXTURE.nodes.length, v.board.nodes.length);
});

test('an empty seat shows a plain empty line and no invented open questions', () => {
    const v = view({clock: 0, actors: {player: {facts: {}}}, simulation: {knowledge: {warden: {'x': {stage: 'seen', value: 'hidden', at: 0, cause: 'c'}}}}});
    assert.equal(v.rows.length, 0);
    assert.equal(v.board.nodes.length, 0);
    assert.match(figureText(v.board), /Nothing learned yet/);
});

test('a long column is capped on the board and points to the list', () => {
    const knowledge = Object.fromEntries(Array.from({length: 9}, (_, i) => [`k${i}`, {stage: 'seen', value: `Fact number ${i}`, at: i, cause: 'c'}]));
    const v = view({clock: 10, actors: {player: {facts: {}}}, simulation: {knowledge: {player: knowledge}}});
    assert.equal(v.rows.length, 9);
    assert.equal(v.board.nodes.length, 6);
    assert.match(figureText(v.board), /3 more known lines are in the list/);
});

test('cases gather a line of thought with its clues, readings, open questions and plan in that order', () => {
    const v = view(knowledgeFixtureState());
    assert.equal(v.glance, '4 known · 3 guessed · 1 open · 1 plan');
    const bell = v.cases.find(c => c.id === 'inference.bell');
    assert.deepEqual(bell.rows.map(r => r.certainty), ['known', 'known', 'guessed', 'guessed']);
    assert.equal(bell.status, 'You mean to act');
    assert.match(bell.label, /^Thinking about: Someone with a key/);
    assert.equal(caseLine(bell.rows.at(-1)), 'You mean to act on it.');
    assert.equal(v.cases.find(c => c.id === 'divination.ledger').status, '1 open');
    assert.equal(v.cases.find(c => c.id === 'divination.tide').label, 'Asked by water bowl');
    const loose = v.cases.at(-1);
    assert.equal(loose.id, 'loose');
    assert.deepEqual(loose.rows.map(r => r.key), ['harbor.bell.silent']);
    // Every row lands in exactly one case, so the case view hides nothing the list shows.
    assert.equal(v.cases.flatMap(c => c.rows).length, v.rows.length);
    assert.ok(!JSON.stringify(v.cases).includes(SEALED_LINE));
});

test('a host can name its cases; an empty seat has one plain glance line', () => {
    const rows = knowsRows(observerView(knowledgeFixtureState()), {});
    assert.equal(knowsCases(rows, {labels: {'inference.bell': 'Who silenced the bell'}}).find(c => c.id === 'inference.bell').label, 'Who silenced the bell');
    assert.equal(knowsGlance([]), 'Nothing learned yet.');
    assert.match(knowsLine(rows.find(r => r.key === 'inference.bell.someone')), /from 2 clues/);
});
