// PS101/PS103: a station's recipe list reads as three groups, Ready, One short and Far off, each row coloured by one shared
// status word (ready, near, far, blocked; display.js writes it on the row as data-craft-state from recipeStateWord). Far off
// folds behind its header with a count, so the rows that are one fetch away lead. Blocked rows (no station, not learned, a
// reserved material) sit with Far off and keep their reason on the row.
// Presentation only: rows stay direct children of the list (display.js finds them there and keys arrow movement off their
// parent), headers are separate nodes between them, and a row is moved only when the order actually changes.
const GROUPS = [
    {id: 'ready', states: ['ready'], title: 'Ready'},
    {id: 'near', states: ['near'], title: 'One short'},
    {id: 'far', states: ['far', 'blocked'], title: 'Far off', folds: true},
];
const ROW = '.recipe_div[data-recipe_id]';
const groupOf = row => GROUPS.find(g => g.states.includes(row.dataset.craftState)) ?? GROUPS[2];
const shown = row => !row.hidden && row.style?.display !== 'none';

function header(list, group) {
    let head = list.querySelector(`:scope > [data-craft-group-head="${group.id}"]`);
    if (head) return head;
    head = document.createElement(group.folds ? 'button' : 'p');
    head.className = 'craft-group-head';
    head.dataset.craftGroupHead = group.id;
    if (group.folds) {
        head.type = 'button';
        head.addEventListener('click', () => { list.toggleAttribute('data-far-open'); paint(list); });
    }
    return head;
}

function paint(list) {
    for (const group of GROUPS) {
        const head = list.querySelector(`:scope > [data-craft-group-head="${group.id}"]`);
        if (!head) continue;
        const rows = [...list.querySelectorAll(`:scope > ${ROW}`)].filter(r => groupOf(r) === group && shown(r));
        head.hidden = !rows.length;
        const open = list.hasAttribute('data-far-open');
        head.textContent = group.folds ? `${open ? '▾' : '▸'} ${group.title} (${rows.length})` : `${group.title} · ${rows.length}`;
        if (group.folds) head.setAttribute('aria-expanded', String(open));
    }
}

/** Orders the list's rows by group under their headers and returns the first row a player would want selected. */
export function groupRecipeRows(list) {
    if (!list?.querySelectorAll) return null;
    const rows = [...list.querySelectorAll(`:scope > ${ROW}`)];
    if (!rows.length) return null;
    const want = [];
    for (const group of GROUPS) {
        want.push(header(list, group));
        // A selected row stays visible while folded, so the detail never points at a hidden row.
        for (const row of rows) if (groupOf(row) === group) { want.push(row); row.toggleAttribute('data-craft-folded', !!group.folds && !row.classList.contains('selected_recipe') && row.getAttribute('aria-selected') !== 'true'); }
    }
    const now = [...list.children].filter(n => want.includes(n));
    if (now.length !== want.length || now.some((n, i) => n !== want[i])) {
        const focused = list.contains(document.activeElement) ? document.activeElement : null;
        for (const node of want) list.append(node);
        focused?.focus?.({preventScroll: true});
    }
    paint(list);
    return rows.filter(shown).sort((a, b) => GROUPS.indexOf(groupOf(a)) - GROUPS.indexOf(groupOf(b)))[0] ?? null;
}
