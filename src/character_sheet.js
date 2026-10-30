// Character sheet projection (docs/representations/CHARACTER_SHEET.md). One pure function turns a
// subject's truth and the observer's reads into the rows a player may see. Display code never reads
// the truth; it draws this view. Truth, knowledge and display stay apart (AD6-AD8, AR3).
//
// subject = {id, name, kind, rank, level, appearance[], stats[], abilities[], conditions[], gear[],
//            traits[], standing[], ties[], history[], intent[], between[]}
//   every row is {id, label, value?, unit?, desc?, detail?, reveal?, knowKey?, schema?, channel?}
//   reveal is the appraisal level (AP0-AP9, MEANS_AND_APPRAISAL) a read needs; sections give defaults.
// read    = {means, label, level 0..9, precision 0..3, rank?, channels?, schemas?, scope?, guess?}
//   precision narrows numeric bands (0 widest, 3 exact); rank caps reads past the observer (the
//   ceiling: a stronger subject degrades to a relative read); scope limits sections (a physician's
//   eye reads conditions only); guess marks a whole read as inference (divination, rumour).
// observer comes from observerView(state); it decides self versus other and supplies learned facts.
export const SHEET_STATES = Object.freeze({known: '', guessed: '≈', unknown: '?'});
export const SHEET_STATE_WORDS = Object.freeze({known: 'known', guessed: 'guessed', unknown: 'unknown'});
const RANK = {unknown: 0, guessed: 1, known: 2};
const BAND = [10, 5, 2, 1];
// Section order is the sheet's reading order; `reveal` is each section's default AP level.
export const SHEET_SECTIONS = Object.freeze([
    {id: 'appearance', label: 'How they look', reveal: 0},
    {id: 'stats', label: 'Stats', reveal: 3},
    {id: 'abilities', label: 'Abilities and powers', reveal: 4, slot: 'ability-ladder'},
    {id: 'conditions', label: 'Body and conditions', reveal: 0, slot: 'body-figure'},
    {id: 'gear', label: 'Gear', reveal: 0},
    {id: 'traits', label: 'Traits', reveal: 5},
    {id: 'standing', label: 'Standing', reveal: 1},
    {id: 'ties', label: 'Their ties', reveal: 7},
    {id: 'between', label: 'Between you', reveal: 0},
    {id: 'history', label: 'History', reveal: 7},
    {id: 'intent', label: 'Intent', reveal: 8},
]);
// A section with nothing read shows one line whose text never depends on the truth, so an empty
// reading of someone with ten powers looks like one of someone with none (ABR19, AA13).
const CORE = new Set(['appearance', 'stats', 'abilities', 'conditions', 'gear', 'traits']);
const UNREAD = 'Not read. A closer look or another means could tell more.';

const list = v => Array.isArray(v) ? v : [];
const snap = (value, width) => Math.floor(value / width) * width;
function bandText(value, precision, unit = '') {
    const width = BAND[Math.max(0, Math.min(3, precision | 0))];
    const tail = unit ? ` ${unit}` : '';
    if (width === 1) return {state: 'known', text: `${Number.isInteger(value) ? value : value.toFixed(1)}${tail}`, width};
    const lo = snap(value, width);
    return {state: 'guessed', text: `${lo} to ${lo + width - 1}${tail}`, width};
}
function relativeWord(value, mine) {
    if (!Number.isFinite(mine) || mine <= 0) return 'hard to compare with you';
    const r = value / mine;
    return r < .5 ? 'far weaker than you' : r < .85 ? 'weaker than you' : r <= 1.15 ? 'about your match'
        : r <= 2 ? 'stronger than you' : 'far beyond you';
}
// The level a read actually reaches on this subject: the ceiling drops reads on a higher-ranked
// subject to a relative sense (AP2) unless the read itself goes past rank.
function reach(read, subject) {
    const level = read.level ?? 0;
    if (Number.isFinite(read.rank) && Number.isFinite(subject.rank) && subject.rank > read.rank) return Math.min(level, 2);
    return level;
}
const inScope = (read, section) => !read.scope || read.scope.includes(section);
const channelOk = (read, row) => !row.channel || !read.channels || read.channels.includes(row.channel);
const schemaOk = (read, row) => (read.schemas || ['native']).includes(row.schema || 'native');

function rowsFor(section, subject, read, level, observer, mine) {
    const rows = [], basis = read.label || read.means || 'Read';
    // A whole read can be inference (read.guess), and a single row can too (row.guess: a believed entry from the L13 sheet bridge, G10).
    const state = (s, row) => (read.guess || row?.guess) && s === 'known' ? 'guessed' : s;
    const need = row => row.reveal ?? defaultReveal(section, row);
    const learned = row => row.knowKey && observer?.knows?.(row.knowKey);
    for (const row of list(subject[section])) {
        if (learned(row)) { rows.push({id: row.id, label: row.label, state: 'known', text: row.value ?? row.desc ?? '', basis: 'You learned this'}); continue; }
        if (!inScope(read, section) || level < need(row) || !channelOk(read, row)) continue;
        if (section === 'stats') {
            if (!Number.isFinite(row.value)) continue;
            if (level >= 3) { const b = bandText(row.value, read.precision, row.unit); rows.push({id: row.id, label: row.label, state: state(b.state, row), text: b.text, basis, desc: row.desc, width: b.width}); }
            continue;
        }
        if (section === 'abilities' && !schemaOk(read, row)) {
            rows.push({id: 'unread-power', key: row.id, label: '???', state: 'unknown', text: 'Something your read cannot name.', basis});
            continue;
        }
        const out = {id: row.id, label: row.label, state: state('known', row), text: row.value ?? '', basis};
        // Detail (an ability's level and rules, a blade's quality) is one level deeper than the name.
        if (section === 'abilities') {
            out.text = level >= 5 ? [row.level != null ? `Level ${row.level}` : '', row.tier].filter(Boolean).join(' · ') : '';
            if (level >= 5) out.desc = row.desc;
        } else if (section === 'gear') {
            if (level >= 5 && row.detail) out.desc = row.detail;
            else if (row.desc) out.desc = row.desc;
        } else if (row.desc) out.desc = row.desc;
        rows.push(out);
    }
    // Stats below a measuring read: a relative sense only, compared with the observer's own (AP2).
    if (section === 'stats' && inScope(read, section) && level === 2 && Number.isFinite(subject.level?.value ?? subject.level)) {
        const value = subject.level?.value ?? subject.level;
        rows.push({id: 'overall', label: 'Overall', state: 'guessed', text: relativeWord(value, mine?.level?.value ?? mine?.level), basis});
    }
    return rows;
}
function defaultReveal(section, row) {
    if (section === 'abilities') return row.hidden ? 6 : 4;
    if (section === 'conditions') return row.hidden ? 6 : row.visible === false ? 5 : 0;
    if (section === 'gear') return row.concealed ? 4 : 0;
    if (section === 'traits') return row.hidden ? 6 : row.visible ? 0 : 5;
    if (section === 'standing') return row.public ? 0 : 4;
    if (section === 'ties') return row.public ? 1 : 7;
    return SHEET_SECTIONS.find(s => s.id === section)?.reveal ?? 9;
}
// Several reads merge row by row: known beats guessed beats unknown, a narrower band beats a wider.
function better(a, b) {
    if (RANK[b.state] !== RANK[a.state]) return RANK[b.state] > RANK[a.state] ? b : a;
    // A tie keeps the first read that showed it, except an equal numeric band, where the later chosen means wins.
    if (a.width == null || b.width == null) return a;
    return b.width <= a.width ? b : a;
}

export function selfRead() { return {means: 'self', label: 'Your own sense of yourself', level: 5, precision: 3}; }
export function isSelf(subject, observer) { return !!observer && subject?.id === observer.actorId; }

export function characterSheetView(subject, observer, reads = [], options = {}) {
    const self = isSelf(subject, observer);
    const all = [...(self ? [selfRead()] : [{means: 'glance', label: 'A plain look', level: 0, precision: 0}]), ...list(reads)];
    const mine = options.compareTo;
    const sections = [];
    for (const def of SHEET_SECTIONS) {
        if (def.id === 'between') {
            if (self) continue;
            const rows = list(subject.between).map(r => ({id: r.id, label: r.label, state: 'known', text: r.value ?? '', basis: 'Your memory'}));
            if (rows.length) sections.push({...def, rows});
            continue;
        }
        const merged = new Map();
        for (const read of all) for (const row of rowsFor(def.id, subject, read, reach(read, subject), observer, mine)) {
            const key = row.key ?? row.id;
            merged.set(key, merged.has(key) ? better(merged.get(key), row) : row);
        }
        // Unnamed powers are numbered only after merging, so no truth id reaches the view.
        let unnamed = 0;
        let rows = [...merged.values()].map(({key, ...row}) => row.id === 'unread-power' ? {...row, id: `unread-${++unnamed}`} : row);
        if (def.id === 'stats' && rows.some(r => r.id !== 'overall')) rows = rows.filter(r => r.id !== 'overall');
        if (rows.length) sections.push({...def, rows});
        else if (CORE.has(def.id)) sections.push({...def, rows: [{id: 'unread', label: def.label, state: 'unknown', text: UNREAD}]});
    }
    // Identifying needs a read that looks at the person (appearance in scope); a scoped specialist
    // read (a physician's eye, a divination of intent) names nobody, header included (CS6e).
    const nameKnown = self || all.some(r => inScope(r, 'appearance') && reach(r, subject) >= 1) || (subject.nameKey && observer?.knows?.(subject.nameKey));
    const statReads = all.filter(r => inScope(r, 'stats'));
    const top = Math.max(0, ...statReads.map(r => reach(r, subject)));
    let levelText = null;
    if (Number.isFinite(subject.level?.value ?? subject.level)) {
        const value = subject.level?.value ?? subject.level;
        const best = statReads.filter(r => reach(r, subject) >= 3).sort((a, b) => (b.precision ?? 0) - (a.precision ?? 0))[0];
        levelText = best ? bandText(value, best.precision).text : top >= 2 ? relativeWord(value, mine?.level?.value ?? mine?.level) : null;
    }
    return {
        id: self ? 'self' : 'other', self,
        title: self ? 'You' : nameKnown ? subject.name : 'Someone you have not identified',
        kind: nameKnown ? subject.kind ?? '' : '',
        level: levelText,
        reads: all.map(r => ({means: r.means, label: r.label, level: reach(r, subject), guess: !!r.guess})),
        sections,
    };
}

// Text form (UR37): the same facts as lines, state words beside every guessed or unknown value.
export function characterSheetText(view) {
    const lines = [`${view.title}${view.kind ? ` (${view.kind})` : ''}${view.level ? ` · Level: ${view.level}` : ''}`];
    lines.push(`Read by: ${view.reads.map(r => `${r.label}${r.guess ? ' (guess)' : ''}`).join('; ')}`);
    for (const section of view.sections) {
        lines.push(`${section.label}:`);
        for (const row of section.rows) {
            const mark = row.state === 'known' ? '' : ` [${SHEET_STATE_WORDS[row.state]}]`;
            lines.push(`  ${row.label}${row.text ? `: ${row.text}` : ''}${mark}${row.desc ? ` · ${row.desc}` : ''}`);
        }
    }
    return lines.join('\n');
}
