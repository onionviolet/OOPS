// Adapter: a People-you-know row (people_knowledge.js) becomes a character sheet subject. The row is
// already the observer's knowledge, never the person's live state, so every fact here is "known"
// through having met them; stats, powers and hidden layers stay unread until a read is supplied.
export const MET_READ = Object.freeze({means: 'met', label: 'You have met', level: 1, precision: 0});

export function subjectFromKnownPerson(row) {
    const place = String(row.location || '').trim();
    const accounts = (row.accounts || []).map(a => ({id: `account-${a.id}`, label: a.basis, value: a.text}));
    return {
        id: `person:${row.id}`, name: row.name, kind: '',
        appearance: [],
        between: [
            ...(place ? [{id: 'where', label: 'Where', value: place}] : []),
            ...(row.details || []).map((text, i) => ({id: `detail-${i}`, label: 'You know', value: text})),
            ...accounts,
            ...(row.memories || []).map(m => ({id: `memory-${m.id}`, label: 'Remembered', value: m.text})),
        ],
    };
}
