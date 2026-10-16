// Reference navigation follows native, already-projected records. This owns no
// rewards, unlock flags or saves: native lists are rebuilt from saved progress.
// Remember discovery within a session even while a list is being refreshed.
export function createReferenceDiscovery() {
    const known = new Set();
    return facts => {
        for (const [id, present] of Object.entries(facts)) if (present) known.add(id);
        return new Set(known);
    };
}

export function createReferenceDisclosure({root = document, read}) {
    const discover = createReferenceDiscovery();
    const bindings = [
        ['bestiary', 'journal_show_bestiary', 'journal_show_quests'],
        ['books', 'journal_show_books', 'journal_show_quests'],
        ['magic', 'show_magic', 'show_skills'],
    ].map(([id, control, fallback]) => {
        const node = root.getElementById(control);
        node?.addEventListener('click', event => {if(node.dataset.referenceKnown==='false'){event.preventDefault();event.stopImmediatePropagation();}},true);
        return {id, node, fallback, label: node?.textContent, title: node?.getAttribute('title'), visible: null};
    });
    function render() {
        const known = discover(read());
        for (const binding of bindings) {
            const {id, node, fallback} = binding;
            if (!node) continue;
            const visible = known.has(id);
            if (binding.visible === visible) continue;
            binding.visible = visible;
            // Remove undiscovered names from text/labels as well as the screen.
            // Changing only hidden would leave names in label/search scans.
            if (!visible && node.classList.contains('active_selection_button')) root.getElementById(fallback)?.click();
            node.hidden = false;
            node.classList.toggle('ui-locked-tab', !visible);
            node.setAttribute('aria-disabled', String(!visible));
            node.textContent = visible ? binding.label : '???????';
            if (visible && binding.title) node.setAttribute('title', binding.title);
            else node.removeAttribute('title');
            node.dataset.referenceKnown = String(visible);
        }
    }
    render();
    return {render, destroy() {
        for (const {node, label, title} of bindings) if (node) {
            node.hidden = false; node.textContent = label;
            if (title) node.setAttribute('title', title);
            delete node.dataset.referenceKnown;
        }
    }};
}
