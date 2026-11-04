// Start comparison (CG5, UR61 compare before commit): the lives a world offers side by side on the
// answers that differ in what a player gives up or takes on, so a start is chosen before it is opened.
// Holds no world's names: the caller passes profiles ({key, label, answers: [[question, answer]]}).
// Read-only; the buttons that open a start stay where they were.
export const COMPARE_QUESTIONS = Object.freeze(['Money and items', 'Name and papers', 'What you owe']);

// Columns are the preferred questions that at least one start answers; rows are the starts.
export function compareRows(profiles, questions = COMPARE_QUESTIONS) {
    const rows = (profiles || []).filter(p => Array.isArray(p?.answers) && p.answers.length);
    const columns = questions.filter(q => rows.some(p => p.answers.some(([question]) => question === q)));
    if (rows.length < 2 || !columns.length) return {columns: [], rows: []};
    return {columns, rows: rows.map(p => ({key: p.key, label: String(p.label).replace(/^Begin /, ''),
        cells: columns.map(q => p.answers.find(([question]) => question === q)?.[1] || '')}))};
}

export function renderStartCompare(host, profiles, questions) {
    const {columns, rows} = compareRows(profiles, questions);
    if (!rows.length) return null;
    const doc = host.ownerDocument || globalThis.document;
    const make = (tag, text) => { const n = doc.createElement(tag); if (text != null) n.textContent = text; return n; };
    const table = make('table'); table.className = 'start-compare'; table.dataset.startCompare = '';
    table.append(make('caption', 'Compare the lives: what each gives up or asks of you'));
    const head = make('tr'); head.append(Object.assign(make('th', 'Life'), {scope: 'col'}));
    for (const c of columns) head.append(Object.assign(make('th', c), {scope: 'col'}));
    const thead = make('thead'), tbody = make('tbody');
    thead.append(head); table.append(thead, tbody);
    for (const r of rows) {
        const tr = make('tr'); tr.dataset.startCompareRow = r.key;
        tr.append(Object.assign(make('th', r.label), {scope: 'row'}), ...r.cells.map(t => make('td', t)));
        tbody.append(tr);
    }
    host.append(table);
    return table;
}
