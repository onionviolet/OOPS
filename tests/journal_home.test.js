// PS306 and slice 4 (PS122): the Journal leads with the current life, and its People and Worlds pages are tabs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {splitLives, planLives, HOME_WORLD} from '../src/ui/journal_lives.js';
import {PAGES} from '../src/journal_home.js';
import {registerBoxTab, moduleHasShownTab} from '../src/ui/box_tabs.js';

test('a list with no world is the home life\'s; the current life keeps its lists and every other life folds', () => {
    const lists = [{id: 'native'}, {id: 'sibling'}, {id: 'tingen', world: 'book.lotm.tingen'}];
    assert.deepEqual(splitLives(lists, HOME_WORLD).current.map(l => l.id), ['native', 'sibling']);
    const klein = splitLives(lists, 'book.lotm.tingen');
    assert.deepEqual(klein.current.map(l => l.id), ['tingen']);
    assert.deepEqual(klein.earlier.map(l => l.id), ['native', 'sibling']);
});

test('Klein after a crossing: the village quest folds, the page says this life has none yet, and the home life is untouched', () => {
    const lists = [{cards: 1}, {cards: 0}];
    assert.deepEqual(planLives(lists, 'book.lotm.tingen'), {fold: true, earlierCount: 1, note: true});
    assert.deepEqual(planLives([...lists, {cards: 2, world: 'book.lotm.tingen'}], 'book.lotm.tingen'), {fold: true, earlierCount: 1, note: false});
    assert.deepEqual(planLives(lists, HOME_WORLD), {fold: false, earlierCount: 0, note: false}, 'the village life sees its own quests as before');
    assert.deepEqual(planLives(lists, undefined), {fold: false, earlierCount: 0, note: false}, 'no known world: nothing is moved');
    assert.deepEqual(planLives([{cards: 0}], 'book.lotm.tingen'), {fold: false, earlierCount: 0, note: false}, 'an empty earlier list makes no fold');
});

test('People and Worlds join the Journal in the bar\'s order, each as the module\'s own page; Beginning stays in the centre', () => {
    assert.deepEqual(PAGES.map(p => [p.id, p.module]), [['people', 'known-people'], ['worlds', 'optional-worlds']]);
});

test('a hosted page with its own bar route does not make the Journal count as found', () => {
    const node = {style: {display: 'none'}, remove() {}};
    const release = registerBoxTab({box: 'journal', id: 'page', label: 'Page', node, counts: false});
    try { assert.equal(moduleHasShownTab('records'), false); } finally { release(); }
});
