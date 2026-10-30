// Making-forms fixtures (docs/representations/MAKING_FORMS.md): valid specs, a computed rune strip, one craft in two modes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec} from '../src/ui/figure.js';
import {readTalisman} from '../src/rune_grammar.js';
import {MAKING_FORM_FIXTURES, MOCK_GRAMMAR, MOCK_STRIP, TONIC_HANDS_ON, TONIC_FOLDED, runeStripSpec} from '../src/ui/preview/fixtures/making_forms.js';

const draw = spec => { const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>'); const host = dom.document.getElementById('h'); return {host, ...renderFigure(host, spec, {text: true})}; };

test('every making form validates and renders a text form that holds its facts', () => {
    assert.equal(MAKING_FORM_FIXTURES.length, 5);
    for (const spec of MAKING_FORM_FIXTURES) {
        validateFigureSpec(spec);
        const {host, text} = draw(spec);
        assert.equal(host.dataset.figure, spec.id);
        assert.equal(host.querySelector('.fig-text').textContent, text);
        assert.match(text, new RegExp(spec.title.slice(0, 12)));
    }
});

test('the rune strip is computed by the grammar: pair order, discord and the ghost total agree', () => {
    const {read, spec} = runeStripSpec();
    assert.deepEqual(read, readTalisman(MOCK_GRAMMAR, MOCK_STRIP));
    assert.equal(read.discords, 1, 'tide>spur is unnamed; veil>spur reads as the unordered spur+veil pair');
    const text = figureText(spec);
    assert.match(text, /ash > tide: warmth 2/);
    assert.match(text, /tide > spur: static \(a muddle\) 1 \(jar: costs, does not block\)/);
    assert.match(text, /a ward 4/);
    assert.match(text, /Ink cost 5\. Nothing spent by looking/);
    assert.equal(spec.tracks[0].steps.length, MOCK_STRIP.length);
    assert.equal(spec.tracks[0].steps.filter(s => s.state === 'strained').length, read.discords);
});

test('swapping two marks changes the reading (order matters for an ordered pair)', () => {
    const a = readTalisman(MOCK_GRAMMAR, ['ash', 'tide']).effects, b = readTalisman(MOCK_GRAMMAR, ['tide', 'ash']).effects;
    assert.notDeepEqual(a, b);
});

test('one craft exists in hands-on and folded modes, both reachable from each other in words', () => {
    assert.match(figureText(TONIC_HANDS_ON), /Fold into numbers/);
    assert.match(figureText(TONIC_FOLDED), /Unfold/);
    const bands = TONIC_FOLDED.tracks[0].steps.map(s => parseInt(s.note, 10));
    assert.equal(bands.reduce((a, b) => a + b, 0), 100, 'quality odds sum to 100%');
    assert.equal(TONIC_HANDS_ON.tracks[0].steps.length, 4);
});
