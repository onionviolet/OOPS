// The one item row behind inquiry notes (inquiry.js, lane W11-C). A note is a held object: its inventory key carries the
// inquiry id and who wrote it, e.g. {"id":"study.note","inquiry":"study.hp.charms","by":"player"}. Data only, no state.
// Registered through the shared optional-catalogue path in items.js; the template is the generic "Study note".
export const NOTE_ITEM_ID = 'study.note';
export const inquiryNoteItems = Object.freeze([{id: NOTE_ITEM_ID, name: 'Study note',
    description: 'Someone\'s written account of something they worked out. Reading it tells you what they found; it does not give you their practice.', value: 0, tags: {document: true}}]);
