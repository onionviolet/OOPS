// The Fold primitive (docs/DESIGN_GRAMMAR.md): nested folds, observer-limited states, a sealed reason, stable open state.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {createFold} from '../src/ui/fold.js';

const setup = () => { const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>'); return {Event: dom.classes.Event, doc: dom.document, host: dom.document.getElementById('host')}; };
const cat = {key: 'cat', label: 'calm brown kitten', summary: '+ body, - thoughts', open: true, folds: [
    {key: 'body', label: 'body', summary: '2 facts', lines: ['House cat.', {label: 'Bond', value: 62, how: {known: false}}]},
    {key: 'thoughts', label: 'thoughts', state: 'unknown', unknownText: 'You cannot tell what it is thinking yet.'},
    {key: 'past', label: 'history', state: 'empty', emptyText: 'Spend time with it to learn more.'},
    {key: 'secret', label: 'will', state: 'sealed', reason: 'Needs a closer look first.'}]};

test('a fold nests, folds say what is inside, and numbers draw known, estimated or unknown', () => {
    const {Event, doc, host} = setup(); const fold = createFold(doc, cat); host.append(fold.node);
    assert.equal(host.querySelectorAll('details.fold').length, 4);
    assert.equal(host.querySelector('[data-fold-path="cat/body"] .fold__summary').textContent, '2 facts');
    assert.equal(host.querySelector('[data-fold-path="cat/body"] .known-number').textContent, '~62');
    assert.equal(host.querySelector('[data-fold-path="cat"]').open, true);
});

test('unknown, empty and sealed folds speak in words and never reveal state', () => {
    const {doc, host} = setup(); host.append(createFold(doc, cat).node);
    const unknown = host.querySelector('[data-fold-path="cat/thoughts"]');
    assert.equal(unknown.querySelector('.fold__summary').textContent, '?');
    assert.match(unknown.querySelector('.fold__body').textContent, /cannot tell/);
    assert.match(host.querySelector('[data-fold-path="cat/past"] .fold__body').textContent, /Spend time/);
    const sealed = host.querySelector('[data-fold-path="cat/secret"]');
    assert.equal(sealed.querySelector('button').getAttribute('aria-disabled'), 'true');
    assert.match(sealed.querySelector('.fold__reason').textContent, /closer look/);
    assert.equal(sealed.querySelector('.fold__body'), null);
});

test('a live update keeps what the player opened', () => {
    const {Event, doc, host} = setup(); const fold = createFold(doc, cat); host.append(fold.node);
    const body = host.querySelector('[data-fold-path="cat/body"]'); body.open = true; body.dispatchEvent(new Event('toggle'));
    fold.update({...cat, folds: [{...cat.folds[0], lines: [{label: 'Bond', value: 70, how: {}}]}, ...cat.folds.slice(1)]});
    const again = host.querySelector('[data-fold-path="cat/body"]');
    assert.equal(again.open, true);
    assert.equal(again.querySelector('.known-number').textContent, '70');
    assert.equal(host.querySelectorAll('details.fold').length, 4, 'the redraw replaced the tree, not added to it');
});
