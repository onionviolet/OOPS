import test from 'node:test';
import assert from 'node:assert/strict';
import {deferWhileHidden,documentHidden,revealHiddenRefreshes} from '../src/simulation_render.js';

// A minimal document: hidden flag plus visibilitychange listeners. The module binds
// its listener once, as a page has one document, so every test shares this one.
const listeners = [];
const doc = {hidden: true, addEventListener: (type, fn) => {if(type === 'visibilitychange') listeners.push(fn);},
    show() {this.hidden = false; for(const fn of listeners) fn();}};
const fakeDocument = hidden => {doc.hidden = hidden; return doc;};

test('without a document nothing is deferred', () => {
    assert.equal(documentHidden(), false);
    assert.equal(deferWhileHidden('k', () => {}), false);
});

test('hidden refreshes wait, keep the latest per key and run once on reveal', t => {
    const doc = fakeDocument(true); globalThis.document = doc;
    t.after(() => {delete globalThis.document;});
    const calls = [];
    assert.equal(deferWhileHidden('panels', () => calls.push('panels-1')), true);
    assert.equal(deferWhileHidden('panels', () => calls.push('panels-2')), true);
    assert.equal(deferWhileHidden('time', () => calls.push('time')), true);
    revealHiddenRefreshes();
    assert.deepEqual(calls, [], 'still hidden: nothing runs');
    doc.show();
    assert.deepEqual(calls, ['panels-2', 'time']);
    revealHiddenRefreshes();
    assert.deepEqual(calls, ['panels-2', 'time'], 'each deferred refresh runs once');
    assert.equal(deferWhileHidden('panels', () => calls.push('visible')), false, 'visible renders run in place');
});

test('a failing refresh does not stop the others', t => {
    const doc = fakeDocument(true); globalThis.document = doc;
    const error = console.error; console.error = () => {};
    t.after(() => {delete globalThis.document; console.error = error;});
    const calls = [];
    deferWhileHidden('bad', () => {throw new Error('boom');});
    deferWhileHidden('good', () => calls.push('good'));
    doc.show();
    assert.deepEqual(calls, ['good']);
});
