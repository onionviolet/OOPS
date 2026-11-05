// Stable inspection for native material/part recipes. The native tooltip is
// the existing authoritative result/quality supplier, not a second formula.
// Selection and commitment stay with the original exact-key picker controls.
export function renderCraftingSelection(root, {selection, row}) {
    const identity = selection ? `${selection.category}/${selection.subcategory}/${selection.recipe_id}` : '';
    const scroll = root.dataset.selectionIdentity === identity ? root.querySelector('.craft_detail_body')?.scrollTop || 0 : 0;
    root.dataset.selectionIdentity = identity;
    root.replaceChildren();
    const doc = root.ownerDocument;
    const el = (tag, text, className) => {
        const n = doc.createElement(tag);
        if(text) n.textContent = text;
        if(className) n.className = className;
        return n;
    };
    const body = el('div', '', 'craft_detail_body');
    body.append(el('h3', selection?.recipe_id || 'Inspect the work', 'craft_detail_title'));
    if(!row) {
        body.append(el('p', 'Open a recipe, then select exact materials or parts to review its result. Selection spends nothing.'));
    } else {
        const assembly = selection.subcategory === 'equipment';
        // Native assembly choices were pointer-only divs. Keep their existing
        // selection/commit listeners and give keyboard users the same route.
        for(const control of row.querySelectorAll('.selectable_component, .recipe_creation_button, .craft_ammount_button')) {
            control.tabIndex = 0;
            control.setAttribute('role', 'button');
            if(!control.dataset.craftKeyBound) {
                control.dataset.craftKeyBound = 'true';
                control.addEventListener('keydown', event => {
                    if((event.key === 'Enter' || event.key === ' ') && event.target === control) {
                        event.preventDefault(); event.stopPropagation(); control.click();
                    }
                });
            }
        }
        body.append(el('p', assembly ? 'Choose one exact part for each role. Review the resulting equipment here; Create commits the selected parts.' : 'Select an exact material to review the possible result and quality. Craft commits that material; inspection uses nothing.'));
        const material = [...row.querySelectorAll('.selectable_material')].find(n => n.dataset.item_key === selection.material_key) || row.querySelector('.selected_material');
        const selected = assembly ? [...row.querySelectorAll('.selected_component')] : material ? [material] : [];
        const facts = el('div', '', 'craft_selection_facts');
        facts.dataset.craftSelectedInputs = '';
        for(const part of selected) facts.append(el('p', part.querySelector('.recipe_comp_name')?.textContent || [...part.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()));
        body.append(facts);
        const source = assembly ? row.querySelector('.recipe_creation_button > .recipe_tooltip') : material?.querySelector('.recipe_tooltip');
        const result = el('div', '', 'craft_detail_result');
        result.dataset.craftSelectionResult = '';
        if(source) result.innerHTML = source.innerHTML;
        else result.textContent = 'Select a material to see its required quantity, output and quality range.';
        body.append(result);
    }
    root.append(body);
    body.scrollTop = scroll;
}
