// COV7 / UR42 / UR73: split a long action line into a short verb phrase, a cost chip and a hover note.
// Pure and world-neutral: it only reads the shape of the text (a bracketed note, a " · " tail, a word count).
export const ACTION_LABEL_WORDS = 8;

export function shortActionLabel(raw, maxWords = ACTION_LABEL_WORDS) {
    const notes = [];
    let text = String(raw ?? '').replace(/\s*\(([^)]*)\)/g, (_, note) => { notes.push(note.trim()); return ''; }).replace(/\s+/g, ' ').trim();
    let chip = '';
    const tail = text.indexOf(' · ');
    if (tail > 0) { chip = text.slice(tail + 3).trim(); text = text.slice(0, tail).trim(); }
    const words = text.split(' ');
    const cut = words.length > maxWords;
    if (cut) text = `${words.slice(0, maxWords).join(' ').replace(/[,;:]$/, '')}…`;
    return {text, chip, note: notes.filter(Boolean).join('; '), cut};
}
