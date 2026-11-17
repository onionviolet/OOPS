// PS292: the inventory row's name line and controls are drawn through the kit and keep the class names the rest of the game finds them by.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {useKitDocument} from '../src/ui/kit.js';
import {inventoryNameParts, inventoryControls} from '../src/ui/inventory_row.js';

const draw = fn => { const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>'); useKitDocument(dom.document);
    try { const host = dom.document.getElementById('h'); host.append(...fn()); return host; } finally { useKitDocument(null); } };

test('a gear row reads tag, name, quality and count in the classes the sort and menus use', () => {
    const host = draw(() => inventoryNameParts({tag: {className: 'item_slot', text: '[legs]'}, name: 'Cheap leather pants', count: 1,
        quality: {value: 40, rarity: 'trash', outline: 'outline-x', color: 'rgb(1, 2, 3)'}}));
    assert.equal(host.textContent, '[legs] Cheap leather pants [40%]');
    assert.equal(host.querySelector('.item_slot').textContent, '[legs]');
    assert.equal(host.querySelector('.item_quality b').dataset.rarity, 'trash');
    assert.equal(host.querySelector('.item_count').textContent, '', 'a single item shows no count');
});

test('a stack shows its count, and a book keeps its own name class', () => {
    const host = draw(() => inventoryNameParts({tag: {className: 'item_category', text: '[Book]'}, name: '"Primer"', nameClass: 'book_name', count: 3}));
    assert.equal(host.querySelector('.item_name.book_name').textContent, '"Primer"');
    assert.equal(host.querySelector('.item_count').textContent, ' ×3');
    assert.equal(host.querySelector('.item_quality'), null);
});

test('controls come in the order a player meets them: use, auto, then equip or take off', () => {
    const classes = args => draw(() => inventoryControls(args)).children.map(n => n.className);
    assert.deepEqual(classes({usable: '[eat]', offerAuto: true, autoActive: true}), ['item_use_button', 'item_auto_use_button item_auto_use_button_active']);
    assert.deepEqual(classes({usable: '[use]', offerAuto: false}), ['item_use_button']);
    assert.deepEqual(classes({readable: true}), ['item_use_button']);
    assert.deepEqual(classes({equip: 'on'}), ['equip_item_button item_controls']);
    assert.deepEqual(classes({equip: 'off'}), ['unequip_item_button item_controls']);
});
