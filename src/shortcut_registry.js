// One list of the keyboard shortcuts modules add beyond the navigation routes (GU2). Presentation
// only: a module registers its own keys and label next to the code that handles them, and the
// shortcut sheet in workspace_navigation.js prints the list, so the sheet cannot drift from the keys.
const entries = new Map();

export function registerShortcut({id, keys, label, scope = 'Anywhere'}) {
    if (!id || !keys || !label) throw new Error('A shortcut needs an id, keys and a label');
    entries.set(id, Object.freeze({id, keys, label, scope}));
}

export function unregisterShortcut(id) { entries.delete(id); }

// Grouped by scope, in registration order.
export function shortcutGroups() {
    const groups = new Map();
    for (const entry of entries.values()) {
        if (!groups.has(entry.scope)) groups.set(entry.scope, []);
        groups.get(entry.scope).push(entry);
    }
    return [...groups].map(([scope, items]) => ({scope, items}));
}

export const shortcutLines = () => shortcutGroups().flatMap(({items}) => items.map(item => `${item.label} · ${item.keys}`));
