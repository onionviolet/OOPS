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
    assert.deepEqual(rows.choices.map(([v]) => v), ['bordered', 'spacing', 'classic']);
    assert.equal(lookSheet(rows, 'bordered'), '');
    assert.equal(lookSheet(rows, 'spacing'), 'styles/variants/ps217.css');
    assert.equal(lookSheet(rows, 'nonsense'), '');
    for (const o of LOOK_OPTIONS) for (const [v] of o.choices) if (lookSheet(o, v)) assert.ok(existsSync(new URL(`../${lookSheet(o, v)}`, import.meta.url)));
});

test('PS216: a column opens when its content grows past a life\'s opening; the Journal also on the first skill', async () => {
    const {columnsToOpen} = await import('../src/ui/grow_columns.js');
    const opening = {quests: 1, reports: 2, skills: 0};
    assert.deepEqual(columnsToOpen(opening), {});
    assert.deepEqual(columnsToOpen({...opening, reports: 3}), {log: 'First report'});
    assert.deepEqual(columnsToOpen({...opening, skills: 1}), {journal: 'First skill'});
    assert.deepEqual(columnsToOpen({...opening, quests: 2}), {journal: 'A new quest'});
});

test('Layout is a look choice: Full by default, Grows with the life loads the ps216 sheet (PS216)', async () => {
    const {LOOK_OPTIONS, lookSheet} = await import('../src/ui/variant.js');
    const layout = LOOK_OPTIONS.find(o => o.id === 'layout');
    assert.equal(layout.default, 'full');
    assert.equal(lookSheet(layout, 'full'), '');
    assert.equal(lookSheet(layout, 'grows'), 'styles/variants/ps216.css');
});
