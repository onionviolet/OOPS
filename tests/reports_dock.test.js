import test from 'node:test';
import assert from 'node:assert/strict';
import {dockRows, LOG_TAKES_OVER} from '../src/reports_dock.js';

const next = {line: 'Talk to the elder.', how: 'In Local actions.'};
const today = {clock: 'Mon, Summer, Morning · 08:00', place: 'Village', open: ['Fishing'], running: {count: 0, nextIn: null}};

test('a short log shares its column with the next step and the day', () => {
    const rows = dockRows({logLines: 3, next, today});
    assert.deepEqual(rows.map(r => r.kind), ['next', 'clock', 'open']);
    assert.match(rows[1].text, /Village/);
});
test('the log takes the column once it has enough lines', () => {
    assert.deepEqual(dockRows({logLines: LOG_TAKES_OVER, next, today}), []);
});
test('running commitments appear only when there are some', () => {
    const rows = dockRows({logLines: 0, next: null, today: {...today, open: [], running: {count: 2, nextIn: 30}}});
    assert.deepEqual(rows.map(r => r.kind), ['clock', 'running']);
});
