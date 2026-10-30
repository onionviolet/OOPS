import test from 'node:test';
import assert from 'node:assert/strict';
import {LAYOUT_SPEC} from '../src/layout_spec.js';
import {foldOf, resolvePanel, retiredAliases, listable, movedNotices} from '../src/panel_folds.js';
import {normalizeLayout} from '../src/workspace_state.js';

// COV5 / COV12, UR13: folded panels keep working under their old ids.
test('every fold names a live owner and no fold chains', () => {
    for (const [id, fold] of Object.entries(LAYOUT_SPEC.folds)) {
        assert.ok(!LAYOUT_SPEC.folds[fold.into], `${id} folds into ${fold.into}, which is itself folded`);
        if (fold.retired) assert.ok(!LAYOUT_SPEC.surfaces[id], `${id} is retired but still has a surface`);
        else assert.ok(LAYOUT_SPEC.surfaces[id], `${id} stays registered and needs its surface`);
        assert.ok(LAYOUT_SPEC.surfaces[fold.into], `${fold.into} (owner of ${id}) has no surface`);
    }
});

test('resolvePanel sends a folded id to its owner and section, and leaves others alone', () => {
    assert.deepEqual(resolvePanel('today'), {id: 'region-view', section: 'today'});
    assert.deepEqual(resolvePanel('shell-inventory-tools'), {id: 'belongings', section: null});
    assert.deepEqual(resolvePanel('condition'), {id: 'condition', section: null});
    assert.equal(listable('today'), false);
    assert.equal(listable('belongings'), true);
    assert.deepEqual(Object.keys(retiredAliases()).sort(), ['around-place', 'today']);
    assert.ok(foldOf('combat-controls'));
});

test('an old saved layout keeps its placement under the owner id', () => {
    const raw = {version: 1, mode: 'classic', modules: [
        {id: 'today', dock: 'right', order: 0, hidden: false, pinned: true},
        {id: 'around-place', dock: 'left', order: 1, hidden: true},
        {id: 'vitals', dock: 'left', order: 2}]};
    const layout = normalizeLayout(raw, ['region-view', 'vitals']);
    const owner = layout.modules.find(m => m.id === 'region-view');
    assert.equal(owner.dock, 'right');
    assert.equal(owner.pinned, true);
    assert.deepEqual(layout.modules.map(m => m.id).sort(), ['region-view', 'vitals']);
    // an owner that already has a placement keeps it
    const both = normalizeLayout({...raw, modules: [...raw.modules, {id: 'region-view', dock: 'center', order: 3}]}, ['region-view', 'vitals']);
    assert.equal(both.modules.find(m => m.id === 'region-view').dock, 'center');
});

test('movedNotices speaks once, only for ids a saved layout had', () => {
    const store = new Map([['yairpg.workspace.v1.desktop', JSON.stringify({modules: [{id: 'today'}, {id: 'around-place'}]})]]);
    const storage = {get length() { return store.size; }, key: i => [...store.keys()][i], getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v)};
    const first = movedNotices({titleOf: id => id === 'region-view' ? 'Where I am' : id, storage});
    assert.equal(first.length, 1);
    assert.equal(first[0].into, 'region-view');
    assert.match(first[0].text, /Today and Around this place are now in Where I am\. Nothing was removed\./);
    assert.deepEqual(movedNotices({storage}), []);
    const fresh = {length: 0, key: () => null, getItem: () => null, setItem() {}};
    assert.deepEqual(movedNotices({storage: fresh}), []);
});
