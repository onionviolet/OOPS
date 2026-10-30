import test from 'node:test';
import assert from 'node:assert/strict';
import {panelListing, PANEL_GROUPS} from '../src/panel_directory.js';

test('shared panels get player words and one of five groups', () => {
    const fields = panelListing('fields', {title: 'Old name', role: 'actions'});
    assert.equal(fields.title, 'Spills and smoke');
    assert.ok(PANEL_GROUPS.includes(fields.group));
    assert.equal(PANEL_GROUPS.length, 5);
});
test('a world panel keeps its title and takes its own group or its role group', () => {
    assert.deepEqual(panelListing('some-world-panel', {title: 'Bench', group: 'Things'}), {title: 'Bench', group: 'Things', reason: ''});
    assert.deepEqual(panelListing('some-world-panel', {title: 'Bench', role: 'records'}), {title: 'Bench', group: 'Records', reason: ''});
    assert.equal(panelListing('some-world-panel', {title: 'Bench'}).group, 'World');
});
test('a greyed shared panel names its blocker', () => {
    assert.equal(panelListing('homes', {title: 'Homes'}).reason, 'Village only');
});
