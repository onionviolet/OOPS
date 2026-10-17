// R18: inventory category tabs for the shell (Part 1, UX13, CTL14, L4). The categories and their
// membership are the native ones (index.html showOnly…; style.css category display rules): a starred
// item is in its own category and in Favorites. Counts are read from the rows the native list drew,
// so they always agree with what the native filter shows. Selecting a tab clicks the native control;
// this module owns no inventory state.

export const INVENTORY_CATEGORIES = Object.freeze([
    {id: 'all', label: 'All items', short: 'All', native: 'inventory_show_all', noun: 'items'},
    {id: 'equipment', label: 'Equipment', short: 'Gear', native: 'inventory_show_equipment', noun: 'equipment'},
    {id: 'usable', label: 'Usable', short: 'Use', native: 'inventory_show_consumable', noun: 'usable items or books'},
    {id: 'other', label: 'Other', short: 'Other', native: 'inventory_show_other', noun: 'materials, components or loot'},
    {id: 'favorites', label: 'Favorites', short: '★', native: 'inventory_show_favs', noun: 'starred items'},
]);
const byId = new Map(INVENTORY_CATEGORIES.map(c => [c.id, c]));
export const categoryOf = id => byId.get(id) || byId.get('all');

// Membership from a row's classes, mirroring style.css's native category display rules.
export function rowCategories(classes) {
    const has = name => classes.includes(`character_item_${name}`);
    return {
        all: true,
        equipment: has('equippable'),
        usable: has('usable') || has('book'),
        other: has('other') || has('loot') || has('material') || has('component'),
        favorites: has('faved'),
    };
}

// rows: [{classes: string[], units: number}] → {category: {stacks, units}}
export function categoryCounts(rows) {
    const counts = Object.fromEntries(INVENTORY_CATEGORIES.map(c => [c.id, {stacks: 0, units: 0}]));
    for (const row of rows) {
        const member = rowCategories(row.classes);
        for (const {id} of INVENTORY_CATEGORIES) if (member[id]) { counts[id].stacks++; counts[id].units += row.units || 1; }
    }
    return counts;
}

// UX13: tell apart nothing held, an empty category and a search with no matches.
export function emptyHint({category, held, inCategory, search}) {
    if (!held) return 'Nothing held yet. Gather, loot or buy items to fill your inventory.';
    const c = categoryOf(category);
    if (!inCategory) return c.id === 'favorites' ? 'No starred items yet. Star an item to keep it here.' : `No ${c.noun} yet.`;
    if (search) return `No ${c.id === 'all' ? 'items' : c.noun} match "${search}". Clear the filter to see all.`;
    return '';
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// The tab strip. `list` is the native inventory list; `search()` finds its search field (the list
// tools may mount after this strip);
// `stored()`/`store(id)` read and write the panel preference; selecting clicks the native control.
export function createInventoryTabs({list, search, stored, store}) {
    const strip = document.createElement('div');
    strip.className = 'inventory-tabs';
    strip.setAttribute('role', 'group');
    strip.setAttribute('aria-label', 'Inventory category');
    const buttons = new Map();
    for (const c of INVENTORY_CATEGORIES) {
        const b = document.createElement('button');
        b.type = 'button'; b.dataset.category = c.id;
        const full = document.createElement('span'), short = document.createElement('span'), count = document.createElement('span');
        full.className = 'inventory-tab-label'; full.textContent = c.label;
        short.className = 'inventory-tab-short'; short.textContent = c.short; short.setAttribute('aria-hidden', 'true');
        count.className = 'inventory-tab-count';
        b.append(full, short, count);
        b.addEventListener('click', () => select(c.id, {persist: true}));
        buttons.set(c.id, b); strip.append(b);
    }
    // Clear keeps its place even when there is nothing to clear, so the strip never reflows (UR52).
    const clear = document.createElement('button');
    clear.type = 'button'; clear.className = 'inventory-tabs-clear'; clear.textContent = '×';
    clear.addEventListener('click', () => { const field = search(); if (field) { field.value = ''; field.dispatchEvent(new Event('input', {bubbles: true})); } select('all', {persist: true}); });
    strip.append(clear);

    let current = categoryOf(stored()).id, signature = '';
    function select(id, {persist = false} = {}) {
        current = categoryOf(id).id;
        document.getElementById(categoryOf(current).native)?.click();
        if (persist) store(current);
        refresh(true);
        // The shared list tools recount and update the empty line now, and the new category starts at its top.
        search()?.dispatchEvent(new Event('input', {bubbles: true}));
    }
    function rows() {
        return [...list.querySelectorAll(':scope > .inventory_item_control')].map(n => ({classes: [...n.classList], units: Number(n.dataset.item_count) || 1}));
    }
    function refresh(force = false) {
        const field = search();
        if (field && !field.dataset.inventoryTabs) { field.dataset.inventoryTabs = 'true'; field.addEventListener('input', () => refresh()); }
        const counts = categoryCounts(rows()), query = field?.value.trim() || '';
        const next = JSON.stringify([counts, current, query]);
        if (!force && next === signature) return;
        signature = next;
        for (const c of INVENTORY_CATEGORIES) {
            const b = buttons.get(c.id), {stacks, units} = counts[c.id];
            const text = String(stacks);
            if (b.lastChild.textContent !== text) b.lastChild.textContent = text;
            b.setAttribute('aria-pressed', String(c.id === current));
            const title = `${c.label}: ${plural(stacks, 'stack', 'stacks')}, ${plural(units, 'item', 'items')}. Counts ignore the search.`;
            if (b.title !== title) { b.title = title; b.setAttribute('aria-label', title); }
        }
        const active = current !== 'all' || !!query;
        clear.disabled = !active; clear.dataset.active = String(active);
        clear.title = active ? 'Clear filter: show all items and clear the search' : 'Nothing to clear';
        clear.setAttribute('aria-label', clear.title);
        list.dataset.inventoryCategory = current;
        // The shared list tools ask for the empty-state line (ui_components.js).
        // The search is read when the hint is asked for: the list tools may redraw before this strip hears the same keystroke.
        list.emptyHint = () => emptyHint({category: current, held: counts.all.stacks > 0, inCategory: counts[current].stacks > 0, search: search()?.value.trim() || ''});
    }
    // Apply the remembered category once the native list exists.
    select(current);
    return {node: strip, refresh, select, current: () => current};
}
