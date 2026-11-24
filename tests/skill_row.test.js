// PS281, PS282: the Skills list reads wide or narrow from its own width, and a cut name shows in full on hover.
import test from 'node:test';
import assert from 'node:assert/strict';
import {watchSkillColumn, fullNameOnHover, WIDE_EM} from '../src/ui/skill_row.js';

test('the list is wide from WIDE_EM body-size characters and narrow below', () => {
    const list = {clientWidth: 0, dataset: {}}, watchers = [];
    const win = {ResizeObserver: class { constructor(run) { this.run = run; watchers.push(this); } observe() {} }, getComputedStyle: () => ({fontSize: '10px'})};
    list.clientWidth = WIDE_EM * 10 - 1; watchSkillColumn(list, win); assert.equal(list.dataset.skillWide, 'false');
    list.clientWidth = WIDE_EM * 10; watchers[0].run(); assert.equal(list.dataset.skillWide, 'true');
});

test('without a ResizeObserver the list keeps its narrow, beside-the-name layout', () => {
    const list = {dataset: {}}; assert.equal(watchSkillColumn(list, {}), null); assert.equal(list.dataset.skillWide, undefined);
});

test('a name gets a title only while the row cuts it', () => {
    let handler; const list = {addEventListener: (type, fn) => { assert.equal(type, 'pointerover'); handler = fn; }};
    fullNameOnHover(list);
    const name = {scrollWidth: 300, clientWidth: 100, textContent: ' Running a very long name ', attrs: {}, setAttribute() {}, removeAttribute(k) { delete this.attrs[k]; }, title: ''};
    const event = {target: {closest: sel => sel === '.skill_bar_name' ? name : null}};
    handler(event); assert.equal(name.title, 'Running a very long name');
    name.scrollWidth = 90; name.title = 'stale'; name.attrs.title = 'stale'; handler(event); assert.equal(name.attrs.title, undefined);
    handler({target: {closest: () => null}}); // not a name: nothing happens
});

test('SKC1: progress counts read in short form, like the reference "4k/7k"', async () => {
    const {shortCount} = await import('../src/ui/skill_row.js');
    assert.deepEqual([0, 6.73, 42, 999, 1000, 4123, 12800, 2.5e6, 3e9].map(shortCount), ['0', '6.7', '42', '999', '1k', '4.1k', '12k', '2.5M', '3B']);
});
