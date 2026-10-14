// Independently authored. Actions/custody are owned by the native host, not DOM.
export const ITEM_HOTKEY_KEY = 'yairpg.known-item-hotkeys.v1';
const record = v => v && typeof v === 'object' && !Array.isArray(v);
const keyOf = key => typeof key === 'string' && /^[a-z0-9]$/i.test(key) ? key.toLowerCase() : null;
export function validateItemBindings(raw) {
    if (!record(raw) || raw.schema !== 1 || !record(raw.bindings) ||
        Object.keys(raw).some(k => !['schema', 'bindings'].includes(k))) throw new Error('Unsupported item hotkey schema.');
    const bindings = {}, ids = new Set();
    for (const [key, id] of Object.entries(raw.bindings)) {
        if (keyOf(key) !== key || typeof id !== 'string' || !id || id.length > 2048 || ids.has(id)) throw new Error('Invalid item hotkey binding.');
        bindings[key] = id; ids.add(id);
    }
    return {schema: 1, bindings};
}
export function isTypingTarget(target) {
    return !!target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"]');
}
export function createKnownItemHotkeys({read, preflight, command, storage = globalThis.localStorage, target = globalThis.document, notice = () => {}, reserved = []}) {
    if (![read, preflight, command].every(fn => typeof fn === 'function')) throw new TypeError('Native read, preflight and command callbacks are required.');
    const denied = new Set(reserved.map(keyOf).filter(Boolean));
    let state = {schema: 1, bindings: {}};
    try { const stored = storage?.getItem(ITEM_HOTKEY_KEY); if (stored) state = validateItemBindings(JSON.parse(stored)); } catch { /* corrupt browser preference is inert */ }
    const rowFor = (id, snapshot = read()) => {
        const rows = (snapshot?.items || []).filter(row => row.id === id);
        return rows.length === 1 && rows[0].known === true ? rows[0] : null;
    };
    const save = next => {
        const valid = validateItemBindings(next);
        // On quota failure retain the previous usable bindings.
        storage?.setItem(ITEM_HOTKEY_KEY, JSON.stringify(valid)); state = valid;
    };
    const unbind = id => save({schema: 1, bindings: Object.fromEntries(Object.entries(state.bindings).filter(([,v]) => v !== id))});
    const bind = (id, key) => {
        const k = keyOf(key), row = rowFor(id);
        if (!k || denied.has(k)) throw new Error('Choose an available letter or digit.');
        if (!row || row.owned !== true || !['use', 'equip'].includes(row.action)) throw new Error('Choose a known item in your custody.');
        const next = Object.fromEntries(Object.entries(state.bindings).filter(([,v]) => v !== id));
        if (next[k] && next[k] !== id) throw new Error('That key is already bound. Unbind it first.');
        next[k] = id; save({schema: 1, bindings: next});
    };
    const activate = id => {
        const snapshot = read(), row = rowFor(id, snapshot);
        if (!snapshot?.canWrite || snapshot.error || !row || row.owned !== true || row.eligible !== true || !['use', 'equip'].includes(row.action)) throw new Error('This binding is unavailable. Review the item or unbind it.');
        // Native preflight must freeze exact copy/action/resource inputs and the
        // native dispatcher must revalidate atomically. Never search for a spare.
        const prepared = preflight({id: row.id, action: row.action, inputFingerprint: row.inputFingerprint});
        if (!prepared || prepared.eligible !== true || !record(prepared.command)) throw new Error('The item changed. Review it again.');
        command(prepared.command);
    };
    const onKey = event => {
        if (event.defaultPrevented || event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || isTypingTarget(event.target) || isTypingTarget(target?.activeElement)) return;
        const key = keyOf(event.key), id = state.bindings[key];
        if (!id || denied.has(key)) return;
        event.preventDefault();
        try { activate(id); notice('Item action sent.'); } catch (error) { notice(error.message); }
    };
    target?.addEventListener('keydown', onKey);
    return {bind, unbind, activate, getBindings: () => ({...state.bindings}), getItem: rowFor,
        destroy: () => target?.removeEventListener('keydown', onKey)};
}

// Always visible controls, usable with Tab/Enter and without a hover tooltip.
export function mountKnownItemBinding(host, id, controller) {
    const form = document.createElement('form'), label = document.createElement('label');
    const input = document.createElement('input'); input.type = 'text'; input.maxLength = 1;
    label.append('Hotkey letter or digit ', input);
    const bind = document.createElement('button'); bind.type = 'submit'; bind.textContent = 'Bind';
    const unbind = document.createElement('button'); unbind.type = 'button'; unbind.textContent = 'Unbind';
    const status = document.createElement('p'); status.setAttribute('role', 'status');
    const run = fn => { try { fn(); status.textContent = 'Binding updated.'; } catch (e) { status.textContent = e.message; } render(); };
    form.addEventListener('submit', e => { e.preventDefault(); run(() => controller.bind(id, input.value)); });
    unbind.addEventListener('click', () => run(() => controller.unbind(id)));
    form.append(label, bind, unbind, status); host.append(form);
    function render() {
        const row = controller.getItem(id); form.hidden = !row;
        input.setAttribute('aria-label', row ? `Hotkey for ${row.label}` : 'Item hotkey');
        bind.disabled = !row || row.owned !== true;
        input.value = Object.entries(controller.getBindings()).find(([,v]) => v === id)?.[0] || '';
    }
    render(); return {element: form, render, destroy: () => form.remove()};
}

// A settings-side list keeps stale bindings removable after an item leaves
// custody or its known row disappears. Never expose the stored identity/name.
export function mountKnownItemHotkeyList(host, controller) {
    const section = document.createElement('section'), heading = document.createElement('h4'), list = document.createElement('ul');
    heading.textContent = 'Item hotkeys'; section.append(heading, list); host.append(section);
    const rows = new Map();
    function render() {
        const bindings = controller.getBindings(), keys = new Set(Object.keys(bindings));
        for (const [key, entry] of rows) if (!keys.has(key)) {
            if (entry.row.contains(document.activeElement)) {heading.tabIndex = -1; heading.focus();}
            entry.row.remove(); rows.delete(key);
        }
        for (const [key, id] of Object.entries(bindings)) {
            let entry = rows.get(key);
            if (!entry) {
                const row = document.createElement('li'), text = document.createElement('span'), button = document.createElement('button');
                button.type = 'button'; button.textContent = `Unbind ${key.toUpperCase()}`;
                button.addEventListener('click', () => {
                    try {controller.unbind(controller.getBindings()[key]); render();}
                    catch (error) {text.textContent = error.message;}
                });
                row.append(text, button); list.append(row); entry = {row, text}; rows.set(key, entry);
            }
            const item = controller.getItem(id);
            entry.text.textContent = `${key.toUpperCase()}: ${item?.label || 'Unavailable item'}${item?.owned === true ? '' : ' · unavailable'}. `;
        }
        section.hidden = !keys.size;
    }
    render(); return {element: section, render, destroy: () => section.remove()};
}
