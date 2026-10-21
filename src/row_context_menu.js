import {registerShortcut} from './shortcut_registry.js';
import {controlLabel} from './dom_text.js';

// GU9: a right-click (or the Menu key, or Shift+F10) on a row lists that row's own buttons in one
// place. The menu holds no command of its own. Each entry clicks the real visible button, so its
// costs, eligibility and single-activation guard apply exactly as if it had been clicked in the row
// (UR35). Disabled buttons show with their reason instead of vanishing. Labels use textContent only.

const ROW_SELECTORS = ['.inventory_item_control', '.skill_div', '[data-panel-row]', '.bestiary_entry_div', '.anthology_entry_div', '#location_actions_div .location_choice', '#location_actions_div .activity_div'];
const rowOf = target => target?.closest?.(ROW_SELECTORS.join(','));
const labelOf = controlLabel;
const shows = node => !node.hidden && !node.closest('[hidden]') && node.checkVisibility?.() !== false;

// The inventory draws its row actions as styled divs that appear on hover, and one delegated
// handler on the list reads the clicked element's class. So these are listed even when hover has
// not revealed them, and each is clicked itself (the favourite star by its icon, as the handler expects).
const NATIVE_CONTROLS = [
    {selector: '.item_use_button', label: row => (row.classList.contains('character_item_book') ? 'Read' : 'Use')},
    {selector: '.item_auto_use_button', label: () => 'Toggle auto-use'},
    {selector: '.equip_item_button', label: () => 'Equip'},
    {selector: '.unequip_item_button', label: () => 'Take off'},
    {selector: '.item_fav_div', label: () => 'Toggle favorite', target: node => node.querySelector('.item_fav_icon') || node},
];

// The commands a row offers, in reading order and without duplicates. `click()` runs the real control.
export function rowCommands(row) {
    const seen = new Set(), commands = [];
    const add = (label, node, disabled, reason) => {
        if (!label || seen.has(label)) return; seen.add(label);
        commands.push({label, button: node, disabled, reason: disabled ? reason : ''});
    };
    for (const control of row.querySelectorAll('button, [role="button"], .item_use_button, .item_auto_use_button, .equip_item_button, .unequip_item_button, .item_fav_div')) {
        const native = NATIVE_CONTROLS.find(entry => control.matches(entry.selector));
        if (native) {
            if (control.hidden || control.closest('[hidden]')) continue;
            const disabled = control.getAttribute('aria-disabled') === 'true';
            add(native.label(row), native.target ? native.target(control) : control, disabled, control.dataset.disabledReason || control.title || '');
        } else if (shows(control)) {
            const disabled = control.disabled || control.getAttribute('aria-disabled') === 'true';
            add(labelOf(control), control, !!disabled, control.dataset.disabledReason || control.title || '');
        }
    }
    // A row that is itself a clickable control (a travel or activity choice) offers its own action.
    if (!commands.length && row.matches('.location_choice, .activity_div') && shows(row)) add(labelOf(row), row, row.getAttribute('aria-disabled') === 'true', row.title || '');
    return commands;
}

export function mountRowContextMenu() {
    const menu = document.createElement('div');
    menu.id = 'row_context_menu'; menu.setAttribute('role', 'menu'); menu.hidden = true;
    document.body.append(menu);
    let items = [], index = 0, returnTo = null;

    function close({restore = true} = {}) {
        if (menu.hidden) return; menu.hidden = true; menu.replaceChildren(); items = [];
        if (restore && returnTo?.isConnected) returnTo.focus?.({preventScroll: true}); returnTo = null;
    }
    function highlight(next) {
        index = (next + items.length) % items.length;
        items.forEach((node, i) => node.tabIndex = i === index ? 0 : -1); items[index].focus();
    }
    function open(row, x, y) {
        const commands = rowCommands(row); if (!commands.length) return false;
        close({restore: false}); returnTo = document.activeElement;
        const title = row.querySelector('.item_name, .inventory_item_name, .skill_bar_name, strong, h3');
        menu.setAttribute('aria-label', title ? labelOf(title) : 'Row actions');
        for (const command of commands) {
            const item = document.createElement('button'); item.type = 'button'; item.setAttribute('role', 'menuitem');
            item.textContent = command.label; item.disabled = command.disabled;
            if (command.reason) { item.title = command.reason; const why = document.createElement('small'); why.textContent = command.reason; item.append(why); }
            item.onclick = () => { close({restore: false}); command.button.click(); };
            menu.append(item); items.push(item);
        }
        menu.hidden = false;
        const box = menu.getBoundingClientRect();
        menu.style.left = `${Math.max(0, Math.min(x, innerWidth - box.width))}px`;
        menu.style.top = `${Math.max(0, Math.min(y, innerHeight - box.height))}px`;
        const first = items.findIndex(node => !node.disabled);
        highlight(first < 0 ? 0 : first);
        return true;
    }
    const onContext = event => {
        if (event.defaultPrevented || event.target.closest('input, textarea, select, a, [contenteditable="true"]') || menu.contains(event.target)) return;
        const row = rowOf(event.target); if (!row) return;
        // The Menu key and Shift+F10 report no pointer position; anchor to the row.
        const box = row.getBoundingClientRect(), keyboard = event.clientX === 0 && event.clientY === 0;
        if (open(row, keyboard ? box.left + 12 : event.clientX, keyboard ? box.bottom - 4 : event.clientY)) event.preventDefault();
    };
    const onKey = event => {
        if (menu.hidden || !menu.contains(document.activeElement)) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
        else if (event.key === 'ArrowDown') { event.preventDefault(); highlight(index + 1); }
        else if (event.key === 'ArrowUp') { event.preventDefault(); highlight(index - 1); }
        else if (event.key === 'Tab') { close(); }
    };
    const onOutside = event => { if (!menu.hidden && !menu.contains(event.target)) close({restore: false}); };
    document.addEventListener('contextmenu', onContext);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onOutside, true);
    window.addEventListener('blur', () => close({restore: false}));
    registerShortcut({id: 'row-menu', keys: 'Right-click, Menu key or Shift+F10', label: 'Row menu: every action a row offers, in one list', scope: 'On a row'});
    return {open, close, destroy() {
        document.removeEventListener('contextmenu', onContext); document.removeEventListener('keydown', onKey, true);
        document.removeEventListener('pointerdown', onOutside, true); menu.remove();
    }};
}
