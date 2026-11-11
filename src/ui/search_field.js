// One search grammar for every find or filter field (UR107; element audit UIC107). The field gets a
// visible label, not a placeholder alone, and Esc first clears a typed query before anything closes.
// Leaf module: no imports, so figure and list helpers can share it without new coupling.

/** Wrap a search input in a visible label. Returns the label element to place where the input went. */
export function searchLabel(input, text) {
    const label = input.ownerDocument.createElement('label');
    label.className = 'ui-search-label';
    const words = input.ownerDocument.createElement('span');
    words.className = 'ui-search-label-text';
    words.textContent = text;
    label.append(words, input);
    return label;
}

let mounted = false;
/** Esc in a search field with text clears it and stops there; a second Esc closes as before. */
export function mountSearchEscape(win = window) {
    if (mounted) return; mounted = true;
    win.addEventListener('keydown', event => {
        const field = event.target;
        if (event.key !== 'Escape' || !field?.matches?.('input[type="search"]') || !field.value) return;
        field.value = '';
        field.dispatchEvent(new Event('input', {bubbles: true}));
        event.preventDefault(); event.stopImmediatePropagation();
    }, true);
}
