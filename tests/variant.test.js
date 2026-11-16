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

test('look options: Row style is Bordered by default, Spacing loads the ps217 sheet, and each choice names its sheet', async () => {
    const {LOOK_OPTIONS, lookSheet} = await import('../src/ui/variant.js');
    const rows = LOOK_OPTIONS.find(o => o.id === 'rows');
    assert.equal(rows.default, 'bordered');
    assert.deepEqual(rows.choices.map(([v]) => v), ['bordered', 'spacing']);
    assert.equal(lookSheet(rows, 'bordered'), '');
    assert.equal(lookSheet(rows, 'spacing'), 'styles/variants/ps217.css');
    assert.equal(lookSheet(rows, 'nonsense'), '');
    for (const o of LOOK_OPTIONS) for (const [v] of o.choices) if (lookSheet(o, v)) assert.ok(existsSync(new URL(`../${lookSheet(o, v)}`, import.meta.url)));
});
