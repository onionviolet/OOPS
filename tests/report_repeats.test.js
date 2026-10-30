import test from 'node:test';
import assert from 'node:assert/strict';
import {reportRepeatKey} from '../src/report_repeats.js';

test('same type and text give the same key; a different type or text differs', () => {
    const key = reportRepeatKey('message_events', 'You rest.');
    assert.ok(key);
    assert.equal(reportRepeatKey('message_events', 'You rest.'), key);
    assert.notEqual(reportRepeatKey('skill_raised', 'You rest.'), key);
    assert.notEqual(reportRepeatKey('message_events', 'You rest again.'), key);
});

test('combat kinds, combat details and calendar lines never fold here', () => {
    assert.equal(reportRepeatKey('hero_attacked', 'x'), null);
    assert.equal(reportRepeatKey('enemy_defeated', 'x'), null);
    assert.equal(reportRepeatKey('other', 'x', {combat: {}}), null);
    assert.equal(reportRepeatKey('other', 'Day 2', {calendarDate: '2'}), null);
});

test('empty or missing text has no key', () => {
    assert.equal(reportRepeatKey('other', ''), null);
    assert.equal(reportRepeatKey('other', undefined), null);
});
