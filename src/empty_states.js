// GU7: a short next step where a list can show nothing. The Inventory, Skills, Bestiary and Books
// lists already say what is missing (ui_components.decorateInventoryList), and every reference
// section built in Round 12 carries its own. This covers the two native lists that were left
// blank: the trader's stock and the storage chest. The hint is a sibling of the list, never a
// child, so the game's own code that rebuilds a list cannot erase it or count it as a row.
const HINTS = [
    {id: 'trader_inventory_div', text: 'This trader has nothing for sale right now. Check back another day.'},
    {id: 'storage_inventory_div', text: 'Nothing is stored here yet. Move items in from your inventory.'},
];

function decorate({id, text}) {
    const list = document.getElementById(id); if (!list) return null;
    const hint = document.createElement('p'); hint.className = 'panel-empty-hint'; hint.textContent = text; hint.dataset.emptyFor = id; hint.hidden = true;
    list.after(hint);
    const sync = () => { const empty = ![...list.children].some(node => node.nodeType === 1); if (hint.hidden !== !empty) hint.hidden = !empty; };
    const observer = new MutationObserver(sync); observer.observe(list, {childList: true}); sync();
    return {hint, destroy() { observer.disconnect(); hint.remove(); }};
}

export function mountEmptyStates() {
    const mounted = HINTS.map(decorate).filter(Boolean);
    return {mounted, destroy() { for (const entry of mounted) entry.destroy(); }};
}
