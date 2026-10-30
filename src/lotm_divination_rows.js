// Source-pinned volume 1 scenes for pack.divinations (MR10, AR8, AD38).
// English paraphrases; locators use the source index form.
// All step minutes and the host fact bindings are authored proposals (WPR5),
// not source-stated durations or a new accuracy model. No spent costs are stated.
const held = (name, reason) => ({fact: `actor.lotm.div.${name}`, op: 'eq', value: true, reason});

export const LOTM_DIVINATION_ROWS = {queries: [
    {
        id: 'lotm.div.coin-divination',
        targetId: 'lotm.div.target.coin-divination',
        question: 'Would returning to 160 Boklund Street be safe?',
        method: 'Coin divination',
        label: 'Divine the safety of returning',
        description: 'Use a gold coin to ask about the danger of returning to the address.',
        locator: 'zh 第113章 p11',
        means: held('means.coin', 'Have the gold coin available for the toss.'),
        contact: held('contact.return-address', 'Hold the intended return to 160 Boklund Street in mind.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Take out the coin', description: 'Take the gold coin from storage or a pocket.', minutes: 1, report: 'You took out the gold coin.'},
            {id: 'ask', kind: 'attempt', label: 'Ask about returning', description: 'Repeat the safety statement seven times, toss the coin and watch it settle.', minutes: 1, status: 'signal', signal: 'The coin hangs in the spirit world, then comes down with its numbered face uppermost.', report: 'You observed the coin after asking about the return.'},
            {id: 'interpret', kind: 'interpret', label: 'Read the coin', description: 'Interpret the observed face in relation to the safety question.', minutes: 1, belief: 'I read the answer as no: returning to the address is dangerous.', report: 'You recorded your reading of the return question.'},
        ],
    },
    {
        id: 'lotm.div.cane-dowsing',
        targetId: 'lotm.div.target.cane-dowsing',
        question: 'Where is Riel Bieber?',
        method: 'Cane-based search divination',
        label: 'Search with the cane',
        description: 'Use the portrait and clothing as the focus for a search with the cane.',
        locator: 'zh 第46章 p69',
        means: held('means.cane', 'Have the black cane with silver inlay available.'),
        contact: held('contact.bieber', 'Have the portrait and the men\'s clothing available as the search focus.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Lay out the search focus', description: 'Spread the clothing on the floor and set the portrait with it.', minutes: 1, report: 'You arranged the portrait and clothing on the floor.'},
            {id: 'recite', kind: 'rite', label: 'Recite over the focus', description: 'Hold the cane above the portrait and clothing and complete the silent recitation; its words are not recorded.', minutes: 1, report: 'You completed the recitation with the cane over the search focus.'},
            {id: 'ask', kind: 'attempt', label: 'Seek the location', description: 'Silently name the location you seek, release the cane and observe its movement.', minutes: 1, status: 'obscured', signal: 'The cane inclines, swivels about its point and rises upright again; further tries repeat the motion.', report: 'You watched the cane during the search.'},
            {id: 'interpret', kind: 'interpret', label: 'Assess the search', description: 'Consider whether the cane has provided a usable direction.', minutes: 1, belief: 'I cannot locate Riel Bieber from this movement; an unexplained force seems to be disrupting the search.', report: 'You recorded your assessment of the interrupted search.'},
        ],
    },
    {
        // The altar-search and altar-dream source rows describe this same procedure.
        id: 'lotm.div.altar-search-divination',
        targetId: 'lotm.div.target.altar-search-divination',
        question: 'Where is the altar being sought?',
        method: 'Altar-assisted dream search',
        label: 'Prepare the altar search',
        description: 'Prepare a private bedroom and a written focus for a dream search using the deceased person\'s effects.',
        locator: 'zh 第121章 p59',
        means: held('means.altar-search', 'Have paper, writing materials and an altar prepared for prayer in the locked, spiritually sealed bedroom.'),
        contact: held('contact.deceased', 'Have the deceased person\'s effects and the account of the scene Leonard described.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Prepare the room and altar', description: 'Lock and spiritually seal the bedroom, arrange the altar and pray to the goddess to reduce interference.', minutes: 1, report: 'You prepared the bedroom and altar and offered the prayer.'},
            {id: 'write', kind: 'rite', label: 'Write the search sentence', description: 'Write a broad statement identifying the altar\'s location as the focus of the search.', minutes: 1, report: 'You wrote the sentence for the search.'},
            {id: 'recite', kind: 'rite', label: 'Recline with the effects', description: 'Recline on the bed holding the paper and the deceased person\'s belongings, recall Leonard\'s account and silently recite the sentence seven times.', minutes: 1, report: 'You reclined with the effects and completed the seven repetitions.'},
            {id: 'unknown', kind: 'unknown', label: 'Note the source gap', description: 'The recorded passage ends without showing a dream, answer or interpretation.', minutes: 1, report: 'The outcome of this search is not recorded in the available passage.'},
        ],
    },
]};

// Host-provided support facts, not initial inventory or grants of ability.
export const LOTM_DIVINATION_FACTS = [...new Set(LOTM_DIVINATION_ROWS.queries.flatMap(row => [row.means.fact, row.contact.fact]))];

export const LOTM_DIVINATION_GAPS = [
    {id: 'lotm.rite.copper-whistle-summon', reason: 'A summoned being takes a letter; this belongs to a messenger mechanism rather than a question and answer signal.'},
    {id: 'lotm.rite.copper-whistle-messenger', reason: 'The same letter handoff is a messenger procedure, with no divination question or answer.'},
    {id: 'lotm.craft.pendulum-divination', reason: 'The tea scene demonstrates movement without stating a question or interpreting an answer.'},
    {id: 'lotm.rite.mirror-divination', reason: 'The passage teaches preparation and a positioning check, without performing a mirror answer.'},
    {id: 'lotm.craft.coin-divination.club', reason: 'The club episode lacks the precise procedure and observed coin face, so it is separate from the supported danger question.'},
];
