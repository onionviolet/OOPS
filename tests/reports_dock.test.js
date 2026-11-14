import test from 'node:test';
import assert from 'node:assert/strict';
import {dockRows, LOG_TAKES_OVER, tailOf, tailFor, TAIL_LINES} from '../src/reports_dock.js';

const next = {line: 'Talk to the elder.', how: 'In Local actions.'};
const today = {clock: 'Mon, Summer, Morning · 08:00', place: 'Village', open: ['Fishing'], running: {count: 0, nextIn: null}};

test('a short log shares its column with the next step and the day', () => {
    const rows = dockRows({logLines: 3, next, today});
    assert.deepEqual(rows.map(r => r.kind), ['next', 'clock', 'open']);
    assert.match(rows[1].text, /Village/);
});
test('once the log has enough lines it takes the column, and only the next step stays above it', () => {
    assert.deepEqual(dockRows({logLines: LOG_TAKES_OVER, next, today}).map(r => r.kind), ['next']);
    assert.deepEqual(dockRows({logLines: LOG_TAKES_OVER, next: null, today}), []);
});
test('running commitments appear only when there are some', () => {
    const rows = dockRows({logLines: 0, next: null, today: {...today, open: [], running: {count: 2, nextIn: 30}}});
    assert.deepEqual(rows.map(r => r.kind), ['clock', 'running']);
});

test('where the place header already shows the clock, the card keeps only the day note (UIC146)', () => {
    assert.deepEqual(dockRows({logLines: 0, next: null, today, headerHasClock: true}).map(r => r.kind), ['open']);
    const noted = dockRows({logLines: 0, next: null, today: {...today, note: 'Market day'}, headerHasClock: true});
    assert.deepEqual(noted[0], {kind: 'clock', label: 'Today', text: 'Market day'});
});

test('the tail of the log travels with the save as plain text, capped, and only shows in the world it came from (M2)', () => {
    const many = Array.from({length: TAIL_LINES + 6}, (_, i) => `  line\n${i} `);
    const slice = tailOf(many, 'native');
    assert.equal(slice.lines.length, TAIL_LINES);
    assert.equal(slice.lines.at(-1), `line ${TAIL_LINES + 5}`);
    assert.equal(tailOf(['', '  '], 'native'), undefined, 'an empty log writes no save key');
    assert.deepEqual(tailFor(slice, 'book.other'), [], "another life's lines stay out");
    assert.deepEqual(tailFor(null, 'native'), [], 'a save without the slice loads as before');
    assert.equal(tailFor(slice, 'native').length, TAIL_LINES);
});
