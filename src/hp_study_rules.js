// The existing library inquiry's understood write-up improves the method, wherever it is used.
// No saved copy: inquiry writes knowledge and every consumer reads that same record.
export const HP_STUDY = Object.freeze({charms: Object.freeze({inquiry: 'study.hp.charms', key: 'study.hp.charms.writeup'}),
    potions: Object.freeze({inquiry: 'study.hp.potions', key: 'study.hp.potions.writeup'}), bonus: 0.1});
export const hpStudyBonus = (state, topic) => state?.simulation?.knowledge?.player?.[HP_STUDY[topic].key]?.stage === 'understood' ? HP_STUDY.bonus : 0;

export const HP_LIBRARY_OPEN = 'hp.lead.libraryOpen';
export const HP_LIBRARY_BOOK_DOWN = 'book.hp.lead.library_work.book_down';
