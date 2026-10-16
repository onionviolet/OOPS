import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLayout, changeModule, reorderModule } from '../src/workspace_state.js';

// R16c: the layout spec version survives normalization, so a one-time companion upgrade is not
// repeated over a later manual hide. Layouts without it stay as they were.
test('layout spec version is kept and older layouts gain no field', () => {
    const raw = {version: 1, mode: 'dock', spec: 1, modules: [{id: 'records', hidden: true}]};
    const kept = normalizeLayout(raw, ['records']);
    assert.equal(kept.spec, 1);
    assert.equal(kept.modules[0].hidden, true);
    assert.equal('spec' in normalizeLayout({version: 1, modules: []}, ['records']), false);
    assert.equal('spec' in normalizeLayout({version: 1, spec: 'x', modules: []}, ['records']), false);
});

test('hiding or reordering a panel keeps the layout spec version', () => {
    const layout = normalizeLayout({version: 1, mode: 'dock', spec: 1, modules: [{id: 'records'}, {id: 'skills'}]}, ['records', 'skills']);
    assert.equal(changeModule(layout, 'records', {hidden: true}).spec, 1);
    assert.equal(reorderModule(layout, 'skills', -1).spec, 1);
});
