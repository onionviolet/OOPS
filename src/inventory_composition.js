import {descriptionCopy} from './shell_item_description.js';
// UIL9 / BX8: presentation over native inventory rows. The shell keeps selection,
// filters, commands and detail routing; this module decorates those same nodes.
export const INVENTORY_KIND_LABELS = Object.freeze({equipment:'Equipment', usable:'Usable', component:'Component', book:'Book', other:'Material / other'});
export function inventoryKind(row) {
    if (!row) return null;
    if(row.classList.contains('equipment_slot_div')||row.classList.contains('equipped_item_control'))return 'equipment';
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
    const inspector=detail.ownerDocument.createElement('section');inspector.className='inventory-workbench-inspection';inspector.setAttribute('aria-label','Selected inventory item');inspector.hidden=true;list.after(inspector);
    let inspectionSignature='',wasExpanded=false,expandedKey=null;
    function expanded(selectedRow){
        const open=!!list.closest('#center_mode_content');inspector.hidden=!open;
        list.parentNode.classList.toggle('inventory-workbench',open);
        if(!open){wasExpanded=false;return;}
        const key=selectedRow?.dataset.character_item||'';
        if((!wasExpanded||expandedKey!==key)&&selectedRow?.isConnected&&getComputedStyle(selectedRow).display!=='none')requestAnimationFrame(()=>selectedRow.scrollIntoView({block:'nearest',inline:'nearest'}));
        wasExpanded=true;expandedKey=key;
        const next=JSON.stringify([key,detail.innerHTML,selectedRow?.innerHTML]);
        if(next===inspectionSignature)return;inspectionSignature=next;
        const scroll=inspector.scrollTop;inspector.replaceChildren();
        const heading=detail.ownerDocument.createElement('h3');heading.textContent=selectedRow?.querySelector('.item_name')?.textContent||'Select an item';inspector.append(heading);
        if(!key){const hint=detail.ownerDocument.createElement('p');hint.textContent='Choose a carried stack to compare and act. The compact inventory keeps its place when you return.';inspector.append(hint);return;}
        const commands=detail.ownerDocument.createElement('div');commands.className='inventory-workbench-commands';
        for(const source of detail.querySelectorAll('.shell-item-actions > button')){
            const b=detail.ownerDocument.createElement('button');b.type='button';b.textContent=source.textContent;b.disabled=source.disabled;b.title=source.title;
            b.addEventListener('click',()=>source.click());commands.append(b);
        }
        inspector.append(commands);
        const tooltip=selectedRow.querySelector('.item_tooltip');if(tooltip)inspector.append(descriptionCopy(tooltip));
        const comparison=detail.querySelector('.worn-comparison');if(comparison)inspector.append(comparison.cloneNode(true));
        inspector.scrollTop=scroll;
    }
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
        expanded(selectedRow);
    }
    return {render};
}
