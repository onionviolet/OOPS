// Ledger → Owed tab body (K3 ledger plus K6 inspector, coverage B2). Renders an owedLedgerView() projection; it reads nothing else and
// settles only through the onSettle callback (a credit row, from its quote). Filters and the selected row are the host's in-memory choices, reported through onFilter and onSelect.
// Desktop first (1920×1080); text is the whole form, colour only repeats it (UR37). Every node carries a data-owed hook for checks.
export function renderOwedLedger(parent, view, {onFilter = () => {}, onSelect = () => {}, onSettle = null, disabled = false} = {}) {
    const doc = parent.ownerDocument;
    const el = (tag, text, host = parent, attrs = {}) => {
        const n = doc.createElement(tag);
        if(text != null) n.textContent = String(text);
        for(const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
        host.append(n); return n;
    };
    const root = el('section', null, parent, {class: 'owed-ledger', 'data-owed': 'root', 'aria-label': 'Owed'});
    if(!view.total) { el('p', view.empty, root, {class: 'owed-empty', 'data-owed': 'empty'}); return root; }
    el('p', view.summary, root, {class: 'owed-summary', 'data-owed': 'summary', role: 'status'});
    const bar = el('div', null, root, {class: 'owed-filters', role: 'group', 'aria-label': 'Filter accounts', 'data-owed': 'filters'});
    for(const f of view.filters) {
        const b = el('button', `${f.label} ${f.count}`, bar, {type: 'button', 'data-owed-filter': f.id, 'data-ledger-control': `owed-filter-${f.id}`, 'aria-pressed': String(f.active)});
        // A zero count stays clickable and answers with the filter's empty text, rather than a greyed control.
        b.disabled = disabled;
        b.onclick = () => onFilter(f.id);
    }
    const grid = el('div', null, root, {class: 'owed-grid'});
    if(view.empty) el('p', view.empty, grid, {class: 'owed-empty', 'data-owed': 'filter-empty'});
    else {
        const table = el('table', null, grid, {class: 'owed-table', 'data-owed': 'rows'});
        const head = el('tr', null, el('thead', null, table));
        for(const h of ['Who', 'What', 'Kind', 'When']) el('th', h, head, {scope: 'col'});
        const body = el('tbody', null, table);
        for(const r of view.rows) {
            const tr = el('tr', null, body, {'data-owed-row': r.id, 'data-direction': r.direction, ...(r.overdue ? {'data-overdue': ''} : {}),
                ...(view.selected?.id === r.id ? {'aria-selected': 'true'} : {})});
            const who = el('button', `${r.direction === 'owed' ? 'From' : 'To'} ${r.party}`, el('td', null, tr),
                {type: 'button', class: 'owed-pick', 'data-ledger-control': `owed-row-${r.id}`, 'aria-label': r.effect});
            who.onclick = () => onSelect(view.selected?.id === r.id ? null : r.id);
            el('td', r.amountText, tr, {class: 'owed-amount'}); el('td', r.kindLabel, tr);
            const when = el('td', null, tr, {class: r.overdue ? 'owed-late' : ''});
            el('span', r.dueText, when);
            // Due bar (item 4): the share of the term left, beside the words that already say it (UR37).
            if(r.termLeft != null) {
                const bar = el('span', null, when, {class: 'owed-due-bar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100',
                    'aria-valuenow': String(Math.round(r.termLeft * 100)), 'aria-label': `Term left: ${r.dueText}`});
                bar.style.setProperty('--owed-left', `${Math.round(r.termLeft * 100)}%`);
            }
        }
    }
    const inspector = el('aside', null, grid, {class: 'owed-inspector', 'data-owed': 'inspector', 'aria-label': 'Account detail'});
    const s = view.selected;
    if(!s) el('p', 'Choose an account to see why it is owed, since when, whether it passes to an heir and where to settle it.', inspector, {class: 'owed-hint'});
    else {
        el('h4', s.effect, inspector);
        for(const [k, line] of [['why', `Why: ${s.why}`], ['since', s.since], ['carries', s.carries], ['source', `Kept by: ${s.source}.`], ['settle', `Settle: ${s.settle}`], ['late', s.late]])
            if(line) el('p', line, inspector, {'data-owed-detail': k});
        // Settle in place: the button carries the exact figure it will commit (UR10, UR55).
        if(s.quote && onSettle) {
            const b = el('button', s.quote.label, inspector, {type: 'button', class: 'action_button', 'data-owed-settle': s.id, 'data-ledger-control': `owed-settle-${s.id}`});
            b.disabled = disabled || !!s.quote.blocked;
            if(s.quote.blocked) el('p', s.quote.blocked, inspector, {'data-owed-detail': 'blocked'});
            else if(s.quote.note) el('p', s.quote.note, inspector, {'data-owed-detail': 'partial'});
            b.onclick = () => onSettle(s.quote);
        }
        // The lender's regard as a ladder of named rungs, yours marked in words (RPX18 glance; depth stays in Standing and ledger).
        if(s.house) {
            el('p', s.house.text, inspector, {'data-owed-detail': 'house'});
            el('p', s.house.causes, inspector, {'data-owed-detail': 'causes'});
            const ladder = el('ol', null, inspector, {class: 'owed-ladder', 'aria-label': `Regard of ${s.house.label}`});
            for(const rung of s.house.rungs) el('li', rung.current ? `${rung.label} (you)` : rung.label, ladder, rung.current ? {'aria-current': 'true'} : {});
        }
    }
    el('p', view.note, root, {class: 'owed-note'});
    return root;
}
