// PS232: ?variant=<code> loads a display-only sheet; nothing loads without it, and only plain codes pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {variantFrom} from '../src/ui/variant.js';

test('a variant is a plain code from the query, off by default, and each named sheet exists', () => {
    assert.equal(variantFrom(''), '');
    assert.equal(variantFrom('?test_hooks=1'), '');
    assert.equal(variantFrom('?test_hooks=1&variant=ps217'), 'ps217');
    assert.equal(variantFrom('?variant=../secrets'), '');
    assert.ok(existsSync(new URL('../styles/variants/ps217.css', import.meta.url)));
});
