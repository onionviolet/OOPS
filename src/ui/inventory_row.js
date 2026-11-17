// Inventory row parts, drawn through the kit (round 25, PS292; proposals). The native inventory row keeps its class names
// (item_slot, item_name, item_quality, item_count, item_use_button, ...) because sorting, counts, menus and the stylesheets
// find it by them; the kit draws the elements, so the row has no markup of its own and looks as it did.
import {kitElement} from './kit.js';

const span = (cls, text) => kitElement('span', cls, text);

/**
 * The text of a row's name line: a tag ("[legs]", "[Comp]", "[Book]" or none), the name, the quality and the count.
 * {tag: {text, className}, name, nameClass?, quality?: {value, rarity, outline, color}, count}
 */
export function inventoryNameParts({tag, name, nameClass = '', quality = null, count = 0}) {
    const parts = [span(tag.className, tag.text), ' ', span(`${nameClass ? `${nameClass} ` : ''}item_name`, name)];
    if (quality) {
        const mark = kitElement('b', quality.outline, `${quality.value}%`);
        mark.dataset.rarity = quality.rarity; mark.style.color = quality.color; // the rarity colour follows the colour scheme (recolor_rarity_spans)
        const holder = span('item_quality'); holder.append('[', mark, ']');
        parts.push(' ', holder);
    }
    parts.push(span('item_count', count > 1 ? ` ×${count}` : ''));
    return parts;
}

/** The use, auto-use, read, equip and take-off controls of a row, in the order a player meets them. */
export function inventoryControls({usable = null, readable = false, autoActive = false, offerAuto = false, equip = null}) {
    const out = [];
    if (usable) out.push(kitElement('div', 'item_use_button', usable)); // "[eat]" or "[use]"
    if (readable) out.push(kitElement('div', 'item_use_button', '[read]'));
    if (usable && offerAuto) out.push(kitElement('div', `item_auto_use_button${autoActive ? ' item_auto_use_button_active' : ''}`, 'auto'));
    if (equip) out.push(kitElement(equip === 'on' ? 'span' : 'div', `${equip === 'on' ? 'equip' : 'unequip'}_item_button item_controls`, equip === 'on' ? '[equip]' : '[take off]'));
    return out;
}
