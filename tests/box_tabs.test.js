// PS122: a world's power joins the Skills box as a tab (Gu, Spells, Beyonder); it shows only while its owner says so.
import test from 'node:test';
import assert from 'node:assert/strict';
import {registerBoxTab, shownTabs, BOX_TAB_HOMES} from '../src/ui/box_tabs.js';

test('a box tab names a known box and shows while its when() holds; a throwing owner shows nothing', () => {
    assert.deepEqual(Object.keys(BOX_TAB_HOMES), ['skills', 'journal']);
    const list = [{box: 'skills', id: 'gu', when: () => true}, {box: 'skills', id: 'spells', when: () => false}, {box: 'journal', id: 'worlds', when: () => true}, {box: 'skills', id: 'bad', when: () => { throw Error('x'); }}];
    assert.deepEqual(shownTabs('skills', list).map(t => t.id), ['gu']);
    assert.deepEqual(shownTabs('journal', list).map(t => t.id), ['worlds']);
    assert.throws(() => registerBoxTab({box: 'nowhere', id: 'x', label: 'X', node: {}}), /known box/);
});

test('a box with a tab showing counts as found, so its page is reachable before the box\'s own first find', async () => {
    const {moduleHasShownTab} = await import('../src/ui/box_tabs.js');
    let open = true;
    const release = registerBoxTab({box: 'journal', id: 'pay', label: 'Pay', node: {style: {display: 'none'}, remove() {}}, when: () => open});
    try {
        assert.equal(moduleHasShownTab('records'), true);
        assert.equal(moduleHasShownTab('skills'), false);
        open = false; assert.equal(moduleHasShownTab('records'), false);
    } finally { release(); }
});
