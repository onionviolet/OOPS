import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {bodyViewModel} from '../src/body_figure.js';
import {bodyCommands} from '../src/body_progression.js';
import {BODY_STATE} from '../src/ui/preview/fixtures/body.js';
import {renderBodyView} from '../src/ui/body_view.js';

const model = () => bodyViewModel(BODY_STATE, {commands: bodyCommands});
const host = () => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    return dom.document.getElementById('host');
};
const all = (n, f) => [n, ...[...n.children].flatMap(c => all(c, f))].filter(f);
const tag = (n, t) => all(n, e => e.tagName.toLowerCase() === t);

test('glance chips carry words, time and level', () => {
    const m = model(), node = host();
    renderBodyView(node, m);
    assert.ok(node.classList.contains('body-view'));
    const chips = all(node, e => e.getAttribute('data-condition'));
    assert.deepEqual(chips.map(c => c.textContent), m.glance.map(g => `! ${g.label} · ${g.time}${g.level ? ` · level ${g.level}` : ''}`));
    assert.ok(chips.some(c => c.textContent === '! Sore hands · 9 min left'));
});

test('hands row has meter, recovery words, wait line, felt and others-see text', () => {
    const m = model(), node = host();
    renderBodyView(node, m);
    const part = m.parts.find(p => p.slot === 'hands'), c = part.now[0];
    const row = all(node, e => e.getAttribute('data-part') === 'hands')[0];
    const meter = tag(row, 'meter')[0];
    assert.equal(meter.getAttribute('max'), String(c.recovered.of));
    assert.equal(meter.getAttribute('value'), String(c.recovered.done));
    assert.match(row.textContent, new RegExp(`${c.recovered.done} of ${c.recovered.of} min recovered`));
    assert.match(row.textContent, /Or wait: it fades with time\./);
    assert.match(row.textContent, new RegExp(c.felt.slice(0, 20)));
    assert.match(row.textContent, new RegExp(c.seen.slice(0, 20)));
    const build = all(node, e => e.getAttribute('data-part') === 'build')[0];
    assert.match(build.textContent, /● Frail frame \(acquired\)/);
    assert.equal(tag(node, 'caption')[0].textContent, 'By body part');
});

test('cure buttons call onCure; disabled state shows its reason', () => {
    const m = model(), node = host(), calls = [];
    renderBodyView(node, m, {onCure: id => calls.push(id)});
    const btn = all(node, e => e.getAttribute('data-body-cure') === 'body.recover')[0];
    assert.ok(btn); btn.click();
    assert.deepEqual(calls, ['body.recover']);
    renderBodyView(node, m, {onCure: id => calls.push(id), cureState: id => id === 'body.recover' ? {disabled: true, reason: 'Too busy right now'} : {disabled: false, reason: ''}});
    const off = all(node, e => e.getAttribute('data-body-cure') === 'body.recover')[0];
    assert.ok(off.disabled);
    assert.equal(off.title, 'Too busy right now');
    assert.equal(all(node, e => (e.getAttribute('class') || '') === 'body-view-reason')[0].textContent, 'Too busy right now');
    assert.ok(!all(node, e => e.getAttribute('data-body-cure') === 'body.eat_meal')[0].disabled);
});

test('milestones draw a figure; null empties; empty model shows its text', () => {
    const m = model(), node = host();
    renderBodyView(node, m);
    assert.match(node.textContent, /Next for this body/);
    assert.equal(tag(node, 'svg').length, 1);
    renderBodyView(node, null);
    assert.equal(node.children.length, 0);
    const empty = {title: 'Your body', glance: [], parts: [], milestones: [], empty: 'Nothing is troubling this body.'};
    renderBodyView(node, empty);
    assert.equal(node.children.length, 1);
    assert.equal(node.textContent, 'Nothing is troubling this body.');
    assert.equal(tag(node, 'table').length, 0);
});

test('draws with node.ownerDocument, not the global document', () => {
    assert.equal(globalThis.document, undefined);
    const node = host();
    assert.doesNotThrow(() => renderBodyView(node, model()));
    assert.ok(tag(node, 'table').length === 1 && tag(node, 'svg').length === 1);
});
