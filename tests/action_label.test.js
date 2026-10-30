import test from 'node:test';
import assert from 'node:assert/strict';
import {shortActionLabel} from '../src/ui/action_label.js';

test('a bracketed risk note moves out of the label', () => {
    const r = shortActionLabel("Accept the supervisor's allocated dose (no faculty yet; switching pathways is risky)");
    assert.equal(r.text, "Accept the supervisor's allocated dose");
    assert.match(r.note, /switching pathways/);
});
test('cost and time ride in a chip', () => {
    const r = shortActionLabel('Observe the sample · 1 spirituality, 30 min');
    assert.deepEqual([r.text, r.chip], ['Observe the sample', '1 spirituality, 30 min']);
});
test('no label stays over eight words and short ones are untouched', () => {
    const long = shortActionLabel('Stand a night watch over the cold room for the warden tonight');
    assert.ok(long.text.replace('…', '').split(' ').length <= 8 && long.cut);
    assert.deepEqual(shortActionLabel('Buy bread'), {text: 'Buy bread', chip: '', note: '', cut: false});
});
