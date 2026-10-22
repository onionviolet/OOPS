import {createControlBox} from './ui/control_box.js';
import {categoryOf} from './inventory_tabs.js';

// R21 control boxes for the parity shell's Inventory and Reports (CB1–CB5). The boxes move the
// panels' existing controls into their popovers and back; every control keeps its owner (native
// sort and filter buttons, the shared list tools, display settings), so no state moves (CB5).
// Shell only (GU5): outside the parity shell every control is back in its R20 home.

// CB2: categories are switched often, so the tabs stay inline when they fit beside the box. A
// column narrower than this (in text lines) folds the category into the box. Decided from width
// and text size only, never from counts, so a tick never refolds the row (UR52).
export const FOLD_BELOW_EM = 22;
export const foldCategory = (widthPx, fontPx) => widthPx > 0 && widthPx / (fontPx || 14) < FOLD_BELOW_EM;

// Inventory box label (CB4): the folded category, any search and the sort always.
export function inventoryLabel({folded, category, categoryCount, search, shown, sort, ascending, choiceSummary}) {
    const parts = [];
    if (folded) parts.push(`${categoryOf(category).short} ${categoryCount}`);
    if(choiceSummary)parts.push(choiceSummary);
    if (search) parts.push(`"${search}" ${shown}`);
    parts.push(`${sort} ${ascending ? '↑' : '↓'}`);
    return parts.join(' · ');
}
// Reports box label: every non-default choice, or "All reports" (CB4).
export function reportsLabel({enabled, total, follow, combatStopped}) {
    const parts = [];
    if (enabled < total) parts.push(`${enabled}/${total} kinds`);
    if (follow === 'always') parts.push('Follow always');
    if (combatStopped) parts.push('Combat off');
    return parts.length ? parts.join(' · ') : 'All reports';
}

export function mountShellControlBoxes({compact, tabs, sortHome, sort, reverse, inventoryList, listTools, log, keepInventory}) {
    const parity = () => document.getElementById('main_content')?.dataset.parity === 'r3';
    // Inventory: one row [tabs][box]; the box opens search, count, sort and direction.
    const row = document.createElement('span'); row.className = 'shell-header-tools shell-control-row';
    const inventory = createControlBox({id: 'inventory', title: 'Inventory view', placement: 'below', keepOpen: keepInventory && {...keepInventory, anchor: () => document.querySelector('.workspace-module[data-module="belongings"] > .workspace-module-body')}});
    const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'shell-control-clear'; clear.textContent = '×';
    clear.addEventListener('click', () => tabs.node.querySelector('.inventory-tabs-clear')?.click());
    row.append(inventory.node, clear);
    // Reports: [box][Latest] in the Reports header; filters, follow, stop and clear in the box.
    const reports = createControlBox({id: 'reports', title: 'Reports view', placement: 'beside'});
    const reportsRow = document.createElement('span'); reportsRow.className = 'shell-header-tools';
    reportsRow.append(reports.node);
    const toggles = document.createElement('div'); toggles.className = 'control-box-toggles'; toggles.setAttribute('role', 'group'); toggles.setAttribute('aria-label', 'Report kinds shown');
    const proxies = new Map();
    for (const id of ['message_show_unlocks', 'message_show_events', 'message_show_crafting', 'message_show_combat', 'message_show_loot', 'message_show_background']) {
        const b = document.createElement('button'); b.type = 'button'; b.dataset.nativeFilter = id;
        b.addEventListener('click', () => { document.getElementById(id)?.click(); render(); });
        proxies.set(id, b); toggles.append(b);
    }
    const options = document.createElement('div'); options.className = 'control-box-options';
    let wasParity = null, folded = null, lastSize = '';
    // Weibao 2026-10-17: the You header is the place to type your name (Proto23's "You" title).
    // The native name field and level move into the header; the native change handler stays.
    const nameDiv = document.getElementById('character_name_div'), nameMark = document.createComment('shell:name');
    nameDiv?.before(nameMark);
    const level = document.getElementById('character_vitals_level'), levelMark = document.createComment('shell:level'); level?.before(levelMark);
    const nameField = document.getElementById('character_name_field');
    if (nameField) { nameField.title = 'Your name. Click to rename.'; nameField.setAttribute('aria-label', 'Your name'); nameField.placeholder = 'Name'; nameField.maxLength = 40; }
    const placeName = on => {
        if (!nameDiv) return;
        const header = document.querySelector('.workspace-module[data-module="vitals"] > .workspace-module-header');
        if (on && header) { if (nameDiv.parentNode !== header) header.querySelector('strong')?.before(nameDiv); if (level && level.previousElementSibling?.tagName !== 'STRONG') header.querySelector('strong')?.after(level); header.dataset.nameInHeader = 'true'; }
        else if (nameMark.nextSibling !== nameDiv) { nameMark.after(nameDiv); if (level && levelMark.nextSibling !== level) levelMark.after(level); document.querySelector('[data-name-in-header]')?.removeAttribute('data-name-in-header'); }
    };
    const restore = () => {
        placeName(false);
        // Back to the R20 homes, in their R20 order.
        if (listTools() && listTools().parentNode !== inventoryList.parentNode) inventoryList.before(listTools());
        if (tabs.node.parentNode !== compact) compact.prepend(tabs.node);
        row.remove();
        log.tools.append(log.filters, log.follow, log.latest, log.combatLog, log.clearLog);
        reportsRow.remove();
        inventory.close({restore: false}); reports.close({restore: false});
    };
    const place = () => {
        const tools = listTools();
        const size = `${Math.round(compact.clientWidth)}:${getComputedStyle(compact).fontSize}`;
        if (size !== lastSize && compact.clientWidth) { lastSize = size; folded = foldCategory(compact.clientWidth, parseFloat(getComputedStyle(compact).fontSize)); }
        // The box and its clear sit in the Inventory header; the tabs keep the R18 row above it
        // unless they fold into the box, and then the tools row disappears.
        const invHeader = document.querySelector('.workspace-module[data-module="belongings"] > .workspace-module-header');
        if (invHeader && row.parentNode !== invHeader) invHeader.append(row);
        if (folded) { if (tabs.node.parentNode !== inventory.body) inventory.body.prepend(tabs.node); }
        else if (tabs.node.parentNode !== compact) compact.prepend(tabs.node);
        if (tools && tools.parentNode !== inventory.body) inventory.body.append(tools);
        compact.dataset.categoryFolded = String(!!folded);
        // Reports: the box joins the Reports header; Latest stays inline beside it.
        const header = document.querySelector('.workspace-module[data-module="messages"] > .workspace-module-header');
        if (header && reportsRow.parentNode !== header) header.querySelector('strong')?.after(reportsRow);
        if (log.latest.parentNode !== reportsRow) reportsRow.append(log.latest);
        if (toggles.parentNode !== reports.body) reports.body.append(toggles, options);
        for (const n of [log.follow, log.combatLog, log.clearLog]) if (n.parentNode !== options) options.append(n);
    };
    function render() {
        const on = parity();
        if (!on) { if (wasParity !== false) restore(); wasParity = false; return; }
        wasParity = true; place(); placeName(true);
        const field = listTools()?.querySelector('input[type=search]'), query = field?.value.trim() || '';
        const category = tabs.current(), count = tabs.node.querySelector(`[data-category="${category}"] .inventory-tab-count`)?.textContent || '';
        const shown = (listTools()?.querySelector('output')?.textContent || '').split('/')[0].trim();
        const sortName = sort.options[sort.selectedIndex]?.textContent || 'Name', ascending = reverse.textContent !== '↓';
        const label = inventoryLabel({folded, category, categoryCount: count, search: query, shown, sort: sortName, ascending, choiceSummary:inventoryList.inventoryFilter?.summary()});
        inventory.setLabel(label, `${label}. Opens search, sort and direction${folded ? ' and the categories' : ''}.`);
        const filtered = category !== 'all' || !!query || !!inventoryList.inventoryFilter?.active();
        clear.hidden = !folded; clear.disabled = !filtered; clear.dataset.active = String(filtered);
        const clearTitle = filtered ? 'Clear filter: show all items and clear the search' : 'Nothing to clear';
        if (clear.title !== clearTitle) { clear.title = clearTitle; clear.setAttribute('aria-label', clearTitle); }
        let enabled = 0;
        for (const [id, b] of proxies) {
            const native = document.getElementById(id), pressed = !!native?.classList.contains('active_selection_button');
            if (pressed) enabled++;
            const text = native?.textContent.trim() || id;
            if (b.textContent !== text) b.textContent = text;
            if (b.getAttribute('aria-pressed') !== String(pressed)) b.setAttribute('aria-pressed', String(pressed));
            b.hidden = !native || native.hidden;
        }
        const reportText = reportsLabel({enabled, total: proxies.size, follow: log.follow.value, combatStopped: log.combatLog.getAttribute('aria-pressed') === 'true'});
        reports.setLabel(reportText, `${reportText}. Opens report kinds, follow, stop combat log and clear.`);
    }
    return {render, inventory, reports, folded: () => folded};
}
