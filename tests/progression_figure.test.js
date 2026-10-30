import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, validateFigureSpec} from '../src/ui/figure.js';
import {PROGRESSION_FIXTURES} from '../src/ui/preview/fixtures/progression.js';
import {FIGURE_FIXTURES} from '../src/ui/preview/figure_fixtures.js';

const draw = spec => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    return renderFigure(dom.document.getElementById('host'), spec, {text: true});
};
const byId = id => PROGRESSION_FIXTURES.find(s => s.id === id);

test('every progression form validates, renders and registers in the gallery list', () => {
    assert.equal(PROGRESSION_FIXTURES.length, 6);
    for (const spec of PROGRESSION_FIXTURES) {
        validateFigureSpec(spec);
        const {text} = draw(spec);
        assert.ok(text.length > 40, spec.id);
        assert.ok(FIGURE_FIXTURES.some(f => f.id === spec.id), `${spec.id} registered`);
    }
});

test('the forms keep their facts in words: grades, cut line, locked rows and the lost vessel place', () => {
    assert.match(draw(byId('progression-report-card')).text, /Gate not met|broken/i);
    assert.match(draw(byId('progression-report-card')).text, /needs B, short/);
    assert.match(draw(byId('progression-service-record')).text, /below here, sent to the line/);
    assert.match(draw(byId('progression-status-window')).text, /locked/);
    assert.match(draw(byId('progression-realm-meter')).text, /Sting worm/);
    assert.match(draw(byId('progression-loop-notebook')).text, /felt, not measured/);
});

test('fixtures name no book, character or sealed fact', () => {
    const blob = JSON.stringify(PROGRESSION_FIXTURES);
    assert.doesNotMatch(blob, /Sunny|Klein|Harry|Zorian|Fang Yuan|Eryk|Lumian|Hogwarts|Sequence/);
});
