import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {reportTags, mountReportFilters, setTag, tagShown, TAGS, NATIVE_KINDS} from '../src/ui/report_filters.js';

test('PS193: quest, dialogue and story-panel lines are Story; ordinary lines carry no tag', () => {
    assert.deepEqual(reportTags('notification', 'Started a new quest: Find the river'), ['story']);
    assert.deepEqual(reportTags('notification', 'Finished a task for a quest: "Find the river"'), ['story']);
    assert.deepEqual(reportTags('dialogue_unlocked', 'You can talk to the miller.'), ['story']);
    assert.deepEqual(reportTags('notification', 'Moon Orchid petals shift in the bag.', {panelId: 'known-people'}), ['story']);
    assert.deepEqual(reportTags('notification', 'A story beat', {story: true}), ['story']);
    assert.deepEqual(reportTags('level_up', 'Running reached Lv 4.'), []);
    assert.deepEqual(reportTags('crafting', 'You made a sinew cord.'), []);
});

test('PS193: the row follows upstream order, then Ready and Story, then BGM; a native chip presses the native button', () => {
    const previous = globalThis.document, dom = createDom();
    dom.loadHTML(`<html><body>${[...NATIVE_KINDS, 'message_show_background'].map((id, i) => `<button id="${id}" class="${i === 2 ? '' : 'active_selection_button'}">${id}</button>`).join('')}</body></html>`);
    globalThis.document = dom.document;
    try {
        const pressed = [];
        for (const id of [...NATIVE_KINDS, 'message_show_background']) document.getElementById(id).addEventListener('click', () => pressed.push(id));
        const {row, render, chips} = mountReportFilters();
        assert.equal(render(), 7, 'seven of eight are on: crafting is off');
        assert.deepEqual([...row.children].map(c => c.dataset.reportKind), [...NATIVE_KINDS, ...TAGS.map(t => t.id), 'message_show_background']);
        assert.equal(chips.get('message_show_crafting').getAttribute('aria-pressed'), 'false');
        chips.get('message_show_combat').click();
        assert.deepEqual(pressed, ['message_show_combat']);
        chips.get('story').click();
        assert.equal(tagShown('story'), false);
        assert.equal(chips.get('story').getAttribute('aria-pressed'), 'false');
        assert.equal(document.documentElement.classList.contains('report-hide-story'), true);
        setTag('story', true);
        assert.equal(document.documentElement.classList.contains('report-hide-story'), false);
    } finally { setTag('story', true, null); setTag('ready', true, null); globalThis.document = previous; }
});
