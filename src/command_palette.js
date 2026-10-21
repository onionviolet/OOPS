import {registerShortcut} from './shortcut_registry.js';
import {controlLabel} from './dom_text.js';

// GU1: one palette (Ctrl/Cmd+K) to jump to anything the player has already met. It reads only what
// the shell shows now: visible navigation routes, known panels, held items and the enabled local
// actions. Nothing here indexes game content the player has not discovered, so it cannot leak a
// sealed secret. Names reach the page with textContent only (ER11 F8).
//
// Navigation and inspection never change game state. A local action runs by clicking the real
// visible button, so its own guards (single activation, costs, eligibility) still apply (UR35).

const sources = new Map();

// A source returns entries {label, group, detail?, run}. `run` must act through a real control.
export function registerPaletteSource(id, read) { sources.set(id, read); }
export function unregisterPaletteSource(id) { sources.delete(id); }

const visible = node => !!node && !node.hidden && !node.closest('[hidden]') && node.checkVisibility?.() !== false;
const labelOf = controlLabel;

export function collectPaletteEntries() {
    const entries = [];
    for (const [id, read] of sources) {
        try { for (const entry of read() || []) entries.push({source: id, ...entry}); } catch { /* one source failing leaves the rest */ }
    }
    return entries;
}

// Every word of the query must appear; names that start with it, or a word that does, rank first.
export function rankEntries(entries, query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return entries.slice(0, 40);
    const scored = [];
    for (const entry of entries) {
        const text = `${entry.label} ${entry.detail || ''}`.toLowerCase(), name = entry.label.toLowerCase();
        if (!words.every(word => text.includes(word))) continue;
        const score = (name.startsWith(words[0]) ? 0 : name.split(/\s+/).some(part => part.startsWith(words[0])) ? 1 : name.includes(words[0]) ? 2 : 3);
        scored.push({entry, score});
    }
    return scored.sort((a, b) => a.score - b.score).map(row => row.entry).slice(0, 40);
}

function builtInSources({navigation, openPanel}) {
    registerPaletteSource('routes', () => [...navigation.querySelectorAll('button[data-route-id]')]
        .filter(button => !button.hidden && !button.disabled)
        .map(button => ({label: labelOf(button), group: 'Go to', detail: button.title.replace(/^.*?·\s*/, ''), run: () => button.click()})));
    registerPaletteSource('panels', () => [...navigation.querySelectorAll('select[aria-label="Other known panels"] option')]
        .filter(option => option.value && !option.disabled)
        .map(option => ({label: option.textContent.replace(/\s*•$/, ''), group: 'Panels', run: () => openPanel(option.value)})));
    registerPaletteSource('items', () => [...document.querySelectorAll('#inventory_content_div > .inventory_item_control')]
        .filter(visible).map(row => {
            const name = row.querySelector('.item_name, .inventory_item_name');
            return name && {label: labelOf(name), group: 'Items', detail: 'show in Inventory', run: () => { row.scrollIntoView({block: 'nearest'}); (row.querySelector('button') || row).focus?.(); }};
        }).filter(Boolean));
    // Here lists the actions the Here panel offers. Most are styled divs with an onclick, so they
    // are found by their classes as well as by button; a disabled one is left out.
    registerPaletteSource('here', () => {
        const controls = [...document.querySelectorAll('#location_actions_div :is(button, [role="button"], .start_dialogue, .start_trade, .start_activity, .activity_div, .action_travel, .location_choice)')]
            .filter(control => visible(control) && !control.disabled && control.getAttribute('aria-disabled') !== 'true');
        // A group that holds other actions is not itself an action.
        return controls.filter(control => !controls.some(other => other !== control && control.contains(other)))
            .map(control => ({label: labelOf(control), group: 'Here', detail: control.hasAttribute('aria-expanded') ? 'opens this list' : 'runs this action', run: () => control.click()})).filter(entry => entry.label);
    });
}

export function mountCommandPalette({navigation, openPanel}) {
    builtInSources({navigation, openPanel});
    const dialog = document.createElement('dialog');
    dialog.id = 'command_palette'; dialog.setAttribute('aria-label', 'Command palette');
    const input = document.createElement('input');
    input.type = 'search'; input.placeholder = 'Go to a panel, item or action'; input.setAttribute('aria-label', 'Command palette search');
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-expanded', 'true'); input.setAttribute('aria-controls', 'command_palette_list');
    input.autocomplete = 'off';
    const list = document.createElement('ul'); list.id = 'command_palette_list'; list.setAttribute('role', 'listbox'); list.setAttribute('aria-label', 'Matches');
    const note = document.createElement('p'); note.className = 'command-palette-note';
    note.textContent = 'Enter runs the selection. Esc closes. Going to a panel or item changes nothing in the game; entries under Here click the real action button.';
    dialog.append(input, list, note); document.body.append(dialog);

    let shown = [], active = 0, opener = null;
    const optionId = index => `command_palette_option_${index}`;
    function paint() {
        list.replaceChildren(); let group = '';
        shown.forEach((entry, index) => {
            if (entry.group !== group) {
                group = entry.group; const heading = document.createElement('li');
                heading.setAttribute('role', 'presentation'); heading.className = 'command-palette-group'; heading.textContent = group; list.append(heading);
            }
            const item = document.createElement('li'); item.id = optionId(index); item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', String(index === active)); item.dataset.paletteSource = entry.source;
            const name = document.createElement('span'); name.textContent = entry.label; item.append(name);
            if (entry.detail) { const detail = document.createElement('small'); detail.textContent = entry.detail; item.append(detail); }
            item.onclick = () => choose(index);
            list.append(item);
        });
        if (!shown.length) { const empty = document.createElement('li'); empty.setAttribute('role', 'presentation'); empty.className = 'command-palette-empty'; empty.textContent = 'Nothing you have met matches that.'; list.append(empty); }
        if (shown.length) input.setAttribute('aria-activedescendant', optionId(active)); else input.removeAttribute('aria-activedescendant');
        list.querySelector('[aria-selected="true"]')?.scrollIntoView?.({block: 'nearest'});
    }
    function refresh() { shown = rankEntries(collectPaletteEntries(), input.value); active = Math.min(active, Math.max(0, shown.length - 1)); paint(); }
    function close() { if (dialog.open) dialog.close(); }
    function choose(index) {
        const entry = shown[index]; if (!entry) return;
        close();
        // Run after the dialog releases focus so a focusing action keeps it.
        queueMicrotask(() => { try { entry.run(); } catch { /* the control reports its own refusal */ } });
        opener = null;
    }
    function open() {
        if (dialog.open) { input.select(); return; }
        opener = document.activeElement; input.value = ''; active = 0; refresh(); dialog.showModal(); input.focus();
    }
    input.addEventListener('input', () => { active = 0; refresh(); });
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.stopPropagation(); return; }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); if (!shown.length) return;
            active = (active + (event.key === 'ArrowDown' ? 1 : shown.length - 1)) % shown.length; paint();
        } else if (event.key === 'Enter') { event.preventDefault(); choose(active); }
    });
    dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus?.({preventScroll: true}); opener = null; });
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    const onKey = event => {
        if (event.defaultPrevented || event.altKey || event.shiftKey || event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
        event.preventDefault(); open();
    };
    document.addEventListener('keydown', onKey);
    registerShortcut({id: 'command-palette', keys: 'Ctrl+K or Cmd+K', label: 'Command palette: go to any panel, item or action'});
    return {open, close, destroy: () => { document.removeEventListener('keydown', onKey); dialog.remove(); }};
}
