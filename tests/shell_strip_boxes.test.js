import test from 'node:test';
import assert from 'node:assert/strict';
import { skillsLabel, questsLabel, craftingLabel } from '../src/shell_strip_boxes.js';

// UM5 (CB4): a control box label names every non-default choice and only those.
test('UM5 strip box labels name only non-default choices', () => {
    assert.equal(skillsLabel({sort: 'Name', hideMax: false}), 'Name');
    assert.equal(skillsLabel({sort: 'Level', hideMax: true}), 'Level · Max level hidden');
    assert.equal(questsLabel({hideCompleted: false}), 'All quests');
    assert.equal(questsLabel({hideCompleted: true}), 'Completed hidden');
    // A single recipe kind is not a choice, so the label leaves it out.
    assert.equal(craftingLabel({page: 'Items/trinkets', pages: 1, makeable: false}), 'All recipes');
    assert.equal(craftingLabel({page: 'Components', pages: 3, makeable: true}), 'Components · Makeable now');
});
