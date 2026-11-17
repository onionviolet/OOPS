import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {drawnTwice, strayVerdict} from '../scripts/flow_checks.mjs';

const row = (box, text, module = 'beginning') => ({box, module, text});

test('PS301: the same row in two boxes is flagged; the same row in one box, or two different rows, is not', () => {
    const beginning = [
        row(1, 'simmer the nettles, fangs and slugs'), row(1, 'hand in your flask'),
        row(2, 'simmer the nettles, fangs and slugs'), row(2, 'hand in your flask'), row(2, 'read the letter on the table'),
    ];
    assert.deepEqual(drawnTwice(beginning).map(d => d.text).sort(), ['hand in your flask', 'simmer the nettles, fangs and slugs']);
    assert.deepEqual(drawnTwice([row(1, 'wolf rat 12/12 hp'), row(1, 'wolf rat 12/12 hp')]), [], 'twice in one box belongs to the repeat check');
    assert.deepEqual(drawnTwice([row(1, 'wolf rat 12/12 hp'), row(2, 'wolf rat 9/12 hp')]), [], 'different facts are two readings, not one drawn twice');
    assert.deepEqual(drawnTwice([row(1, 'wolf rat 12/12 hp', 'focus'), row(2, 'wolf rat 12/12 hp', 'local-actions')]).map(d => d.modules), [['focus', 'local-actions']]);
});

test('PS195: the stray count may fall and may not rise', () => {
    const baseline = {count: 2, strays: ['panel #a', 'action b']};
    assert.equal(strayVerdict({found: ['panel #a', 'action b'], baseline}).ok, true);
    assert.deepEqual(strayVerdict({found: ['panel #a'], baseline}), {rose: false, fell: true, added: [], ok: true});
    const worse = strayVerdict({found: ['panel #a', 'action b', 'module new'], baseline});
    assert.equal(worse.ok, false); assert.deepEqual(worse.added, ['module new']);
});

test('PS195: the accepted baseline lists exactly its count', () => {
    const b = JSON.parse(readFileSync(new URL('./fixtures/flow_strays.json', import.meta.url), 'utf8'));
    assert.equal(b.strays.length, b.count);
});
