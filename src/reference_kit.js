// Small display helpers shared by the reference sections (Known things, Statistics, Today, Region,
// Companions, Loadouts). Presentation only: nothing here reads or writes game state. Text always
// goes in with textContent (ER11 F8), and every list keeps keyed rows so a refresh with nothing
// changed leaves the DOM, the focus and the scroll position alone (ER11 F3).
export function node(tag, text, attrs = {}) {
    const n = document.createElement(tag);
    if (text != null) n.textContent = text;
    for (const [key, value] of Object.entries(attrs)) n.setAttribute(key, value);
    return n;
}

export const plural = (count, one, many = `${one}s`) => `${count.toLocaleString()} ${count === 1 ? one : many}`;
export const minutesText = minutes => {
    const m = Math.max(0, Math.round(minutes)), h = Math.floor(m / 60), r = m % 60;
    return h ? (r ? `${h} h ${r} min` : `${h} h`) : `${r} min`;
};

// A tab bar whose buttons are real tabs (role, selection and arrow keys). `onSelect(id)` runs after
// the selection changes. Returns {bar, select, active}.
export function createTabs({label, tabs, initial = tabs[0]?.id, onSelect}) {
    const bar = node('div', null, {role: 'tablist', 'aria-label': label});
    let active = initial; const buttons = new Map();
    function paint() { for (const [id, b] of buttons) { b.setAttribute('aria-selected', String(id === active)); b.tabIndex = id === active ? 0 : -1; } }
    function select(id, {focus = false} = {}) {
        if (!buttons.has(id)) return; active = id; paint(); if (focus) buttons.get(id).focus(); onSelect?.(id);
    }
    for (const tab of tabs) {
        const b = node('button', tab.label, {type: 'button', role: 'tab'}); b.dataset.tab = tab.id;
        b.onclick = () => select(tab.id);
        b.onkeydown = event => {
            const i = tabs.findIndex(t => t.id === tab.id);
            const next = event.key === 'ArrowRight' ? i + 1 : event.key === 'ArrowLeft' ? i - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
            if (next == null) return; event.preventDefault(); select(tabs[(next + tabs.length) % tabs.length].id, {focus: true});
        };
        buttons.set(tab.id, b); bar.append(b);
    }
    paint();
    return {bar, select, active: () => active};
}

// Rows are {key, name, detail?}. A row whose key and text are unchanged keeps its node.
export function syncList(list, rows, emptyText) {
    const old = new Map([...list.children].filter(n => n.dataset.key != null).map(n => [n.dataset.key, n]));
    const next = [];
    for (const row of rows) {
        let li = old.get(row.key);
        const sig = `${row.name}\u0000${row.detail || ''}`;
        if (!li) { li = node('li'); li.dataset.key = row.key; }
        if (li.dataset.sig !== sig) {
            li.dataset.sig = sig; li.replaceChildren(node('span', row.name));
            if (row.detail) li.append(node('small', row.detail));
        }
        next.push(li);
    }
    if (!rows.length) { const empty = old.get('\u0000empty') || node('li', emptyText, {class: 'reference-empty'}); empty.dataset.key = '\u0000empty'; empty.textContent = emptyText; next.push(empty); }
    // Reorder only when the sequence differs, so a steady list never moves a node.
    const same = next.length === list.children.length && next.every((n, i) => list.children[i] === n);
    if (!same) list.replaceChildren(...next);
}

// A two-or-three column table of [label, value] rows. Returns the table node and an update(rows).
export function createFactTable(caption) {
    const table = node('table'), cap = node('caption', caption); cap.className = 'reference-caption';
    const body = node('tbody'); table.append(cap, body);
    const cells = new Map();
    function update(rows) {
        const next = [];
        for (const [label, value] of rows) {
            let tr = cells.get(label);
            if (!tr) { tr = node('tr'); tr.append(node('th', label, {scope: 'row'}), node('td', '')); tr.lastChild.className = 'num'; cells.set(label, tr); }
            if (tr.lastChild.textContent !== String(value)) tr.lastChild.textContent = String(value);
            next.push(tr);
        }
        const same = next.length === body.children.length && next.every((n, i) => body.children[i] === n);
        if (!same) body.replaceChildren(...next);
    }
    return {table, update};
}

// Run `render` only while the panel can be seen and its inputs changed, so a section that is not
// open costs nothing on each publication. It draws once when the panel first comes into view.
export function visibleRenderer(panel, compute, paint) {
    let signature = '';
    const run = force => {
        if (!force && !panel.checkVisibility?.()) return;
        const view = compute(); const next = JSON.stringify(view);
        if (!force && next === signature) return; signature = next; paint(view);
    };
    if (typeof IntersectionObserver === 'function') new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) run(false); }).observe(panel);
    return run;
}
