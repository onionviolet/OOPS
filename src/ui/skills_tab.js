// "Skills and techniques" tab of the abilities ladder (G17): the rows skillsTabRows() builds from L10 learnView.
// Presentation only, no state. A row reads "Label · stage · n of m" and opens to its gates, the reason it cannot be
// learned yet, practice time and the current sign. Progress is a native meter plus the same words (UR37); the text form
// carries every fact the drawing does. A rung or card the seat has not heard of has no row (ABR19): the caller builds `known`.
const word = row => [row.label, row.stageWord, row.progress ? `${row.progress.value} of ${row.progress.of}` : null].filter(Boolean).join(' · ');
const gateWords = row => row.gates.map(g => `${g.met ? 'Met' : 'Not yet'}: ${g.label}`);
const extraWords = row => [
    row.canLearn ? 'You can learn this now.' : row.refusedBy.length ? `Cannot learn yet: ${row.refusedBy.join(' ')}` : null,
    row.practiceMinutes ? `One practice takes ${row.practiceMinutes} min.` : null,
    row.sign ? `So far: ${row.sign}` : null,
    row.nextSignAt != null ? `The next sign comes at ${row.nextSignAt}.` : null,
].filter(Boolean);

export const EMPTY_SKILLS = 'No techniques known yet.';

/** The tab as plain lines: the text form and the accessible description. */
export function skillsTabText(rows) {
    if (!rows.length) return EMPTY_SKILLS;
    return rows.map(row => [`${word(row)}.`, ...gateWords(row).map(g => `  ${g}.`), ...extraWords(row).map(t => `  ${t}`)].join('\n')).join('\n');
}

export function renderSkillsTab(host, rows) {
    const doc = host.ownerDocument, el = (tag, text, attrs = {}) => { const n = doc.createElement(tag); if (text != null) n.textContent = text; for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
    host.replaceChildren();
    const root = el('div', null, {class: 'skills-tab', 'data-skills-tab': ''});
    if (!rows.length) root.append(el('p', EMPTY_SKILLS));
    for (const row of rows) {
        const d = el('details', null, {class: 'skills-row', 'data-skill': row.id}), s = el('summary', word(row));
        d.append(s);
        if (row.progress) d.append(el('meter', null, {class: 'skills-meter', min: '0', max: String(row.progress.of), value: String(row.progress.value), 'aria-label': `${row.label} practice`}));
        const list = el('ul');
        for (const g of gateWords(row)) list.append(el('li', g));
        d.append(list);
        for (const t of extraWords(row)) d.append(el('p', t));
        root.append(d);
    }
    const words = el('details', null, {class: 'skills-text', 'data-skills-text': ''});
    words.append(el('summary', 'Read the skills as text'), Object.assign(el('pre', skillsTabText(rows)), {className: 'fig-text'}));
    host.append(root, words);
    return {text: skillsTabText(rows)};
}
