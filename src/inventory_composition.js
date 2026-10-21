// UIL9 / BX8: presentation over native inventory rows. The shell keeps selection,
// filters, commands and detail routing; this module decorates those same nodes.
export const INVENTORY_KIND_LABELS = Object.freeze({equipment:'Equipment', usable:'Usable', component:'Component', book:'Book', other:'Material / other'});
export function inventoryKind(row) {
    if (!row) return null;
    if (row.dataset?.item_slot || row.classList.contains('equipment_slot_div')) return 'equipment';
    for (const [kind, native] of [['equipment','equippable'],['book','book'],['usable','usable'],['component','component']]) {
        if (row.classList.contains(`character_item_${native}`) || row.querySelector(`.item_${native}`)) return kind;
    }
    return 'other';
}
export function inventoryCategoryKind(category) {
    return ({equipment:'equipment', usable:'usable', other:'other'})[category] || null;
}
function role(node, kind) {
    if (kind) { if (node.dataset.inventoryKind !== kind) node.dataset.inventoryKind = kind; }
    else if ('inventoryKind' in node.dataset) delete node.dataset.inventoryKind;
}
export function mountInventoryComposition({list, tabs, detail}) {
    const root = list.closest('#main_content');
    if (root) root.dataset.inventoryComposition = 'true';
    const caption = detail.ownerDocument.createElement('span');
    caption.className = 'inventory-kind-caption';caption.hidden = true;
    detail.prepend(caption);
    function render(selectedRow = null) {
        if (caption.parentNode !== detail) detail.prepend(caption);
        // No list rebuild, observer, timer or gameplay mutation. Native refresh calls us.
        for (const row of list.querySelectorAll(':scope > [data-character_item]')) role(row, inventoryKind(row));
        for (const tab of tabs.querySelectorAll('[data-category]')) role(tab, inventoryCategoryKind(tab.dataset.category));
        const kind = selectedRow?.isConnected ? inventoryKind(selectedRow) : null;
        role(detail, kind);
        caption.hidden = !kind;
        const label = kind ? INVENTORY_KIND_LABELS[kind] : '';
        if (caption.textContent !== label) caption.textContent = label;
    }
    return {render};
}
