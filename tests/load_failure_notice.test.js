import test from 'node:test';
import assert from 'node:assert/strict';
import {loadFailureText, showLoadFailureNotice} from '../src/load_failure_notice.js';

// PS303: a failed load names what happened, that the save is kept, and the game's reason under Details.
test('a failed load says the life did not load and the save is kept, with the reason as a detail', () => {
    const t = loadFailureText(new Error('Presentation profile: invalid effects'));
    assert.match(t.title, /did not load/);
    assert.match(t.body, /kept exactly as it was/);
    assert.match(t.body, /saving is paused/);
    assert.equal(t.details, 'Presentation profile: invalid effects');
    assert.equal(loadFailureText(undefined).details, 'No reason was given.');
});

test('the notice draws nothing without a page', () => {
    assert.equal(showLoadFailureNotice(new Error('x'), {doc: null}), null);
});
