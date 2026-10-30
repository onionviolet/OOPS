// Per-world report voice (DESIGN.md DSG13, PLAN M4). A Reports line keeps its own text as the
// receipt; a row here adds the world's flavour and the useful part (what it means, what next).
// Keyed by event kind (display.js message types) and world family; no row means today's
// generic line, unchanged. Rules: RPT1-RPT12. Flavour states only what the player could see or
// was told on arrival; it carries no sealed truth, no canon label and nothing of the future
// (RPT2, RPT7). Wording is fixed per place, so a reload reads the same (RPT12). Pure and
// save-neutral: Reports lines are not saved, and the voice is chosen once when the line is written.

const freeze = Object.freeze;

// LOTM, early Tingen. Districts as the Nighthawks' captain states them on arrival.
const TINGEN_PLACES = freeze({
    'Tingen supervised workroom': freeze({flavour: 'Gaslight, ink and the duty book open on the desk.', useful: 'Orders and paid errands are in the Tingen workroom panel; walks start under Places and walks.'}),
    'Tingen probationer lodging': freeze({flavour: 'A narrow room two minutes from the office, quiet after the fog.', useful: 'Your lodging is the short walk back from the workroom; Places and walks shows the way.'}),
    'Tingen docks': freeze({flavour: 'Salt, tar and the Storm church\'s bells over the water.', useful: 'The docks are the Mandated Punishers\' district; what you can do here is in the Tingen workroom panel.'}),
    'Tingen university area': freeze({flavour: 'Lecture-hall steps and the hiss of the Machinery team\'s engines.', useful: 'The university area is the Machinery team\'s district; what you can do here is in the Tingen workroom panel.'}),
});

const VOICES = freeze({
    lotm: freeze({
        message_travel: text => {
            const place = /^\[ Entering (.+) \]$/.exec(text)?.[1];
            if (!place) return null;
            return TINGEN_PLACES[place] || null; // other lives' places stay generic until checked in play (UR72)
        },
    }),
});

// Families with any voice row, for the kit census and tests.
export const VOICED_FAMILIES = freeze(Object.keys(VOICES));

// {flavour, useful} for a line about to be written, or null for the generic line.
export function reportVoice({family, kind, text}) {
    const row = VOICES[family]?.[kind];
    if (typeof row !== 'function' || typeof text !== 'string') return null;
    const voice = row(text);
    return voice && voice.flavour && voice.useful ? voice : null;
}
