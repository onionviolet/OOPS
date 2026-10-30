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
    {
        id: 'lotm.div.dream-divination',
        targetId: 'lotm.div.target.dream-divination',
        question: "How will Bogda Jones's liver operation turn out?",
        method: 'Dream divination',
        label: 'Dream about the operation',
        description: 'Use the patient\'s ring and written birth details to seek dream imagery about the operation.',
        locator: 'zh 第82章 p71',
        means: held('means.dream-divination', 'Have writing materials and the ability to enter a divinatory dream.'),
        contact: held('contact.bogda', 'Have Bogda\'s ring and the paper recording his birth details.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Write the operation focus', description: 'Write the focus on the paper bearing the birth details, then hold the paper and ring and lean back.', minutes: 1, report: 'You prepared the written focus and held the ring.'},
            {id: 'ask', kind: 'attempt', label: 'Enter the dream', description: 'Enter a divinatory dream focused on the result of the operation.', minutes: 1, status: 'signal', signal: 'The patient collapses with a dim complexion and is wheeled from the operating room under a white cloth.', report: 'You woke after observing the dream imagery.'},
            {id: 'interpret', kind: 'interpret', label: 'Assess the dream', description: 'Consider the dream imagery in relation to the proposed operation.', minutes: 1, belief: 'I judge that the operation is very likely to cause his death.', report: 'You recorded your reading of the operation dream.'},
        ],
    },
    {
        id: 'lotm.div.pendulum-divination',
        targetId: 'lotm.div.target.pendulum-divination',
        question: 'Should I tell Dunn Smith about Mr. Azik?',
        method: 'Pendulum divination',
        label: 'Consult the pendulum about disclosure',
        description: 'Write the disclosure assertion and use the yellow crystal pendant to check it.',
        locator: 'zh 第136章 p49',
        means: held('means.yellow-crystal', 'Have the yellow crystal pendant and writing materials available.'),
        contact: held('contact.azik-disclosure', 'Have the proposed disclosure about Mr. Azik in mind.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Write the disclosure assertion', description: 'Write an assertion that Dunn Smith should be told about Mr. Azik, then unfasten the pendant from the left cuff.', minutes: 1, report: 'You wrote the assertion and readied the pendant.'},
            {id: 'ask', kind: 'attempt', label: 'Check the assertion', description: 'Perform the pendulum check on the written disclosure assertion.', minutes: 1, status: 'signal', signal: 'The yellow crystal pendant turns counterclockwise.', report: 'You observed the pendant during the disclosure check.'},
            {id: 'interpret', kind: 'interpret', label: 'Read the disclosure advice', description: 'Interpret the movement in relation to the written assertion.', minutes: 1, belief: 'I read this as advice against telling Dunn about Mr. Azik.', report: 'You recorded your reading of the disclosure check.'},
        ],
    },
    {
        id: 'lotm.div.coin-divination-club',
        targetId: 'lotm.div.target.coin-divination-club',
        question: 'Is today suitable for visiting the club?',
        method: 'Coin divination',
        label: 'Check the club visit',
        description: 'Take a brass-colored coin from a trouser pocket and check whether to visit the club today.',
        locator: 'zh 第115章 p21',
        means: held('means.brass-coin', 'Have the brass-colored coin available.'),
        contact: held('contact.club-visit', 'Have today\'s proposed club visit in mind.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Ready the coin', description: 'Take the brass-colored coin from the trouser pocket.', minutes: 1, report: 'You readied the coin for the club check.'},
            {id: 'ask', kind: 'attempt', label: 'Check the proposed visit', description: 'Use the coin for a quick check of whether today suits a club visit; the precise handling is not recorded.', minutes: 1, status: 'signal', signal: 'The check gives an affirmative answer; the observed coin face is not recorded.', report: 'You completed the coin check about visiting the club.'},
            {id: 'interpret', kind: 'interpret', label: 'Read the visit advice', description: 'Relate the answer to the proposed club visit.', minutes: 1, belief: 'I take the answer to mean that today is suitable for visiting the club.', report: 'You recorded your reading of the club check.'},
        ],
    },
    {
        id: 'lotm.div.astrological-chart',
        targetId: 'lotm.div.target.astrological-chart',
        question: 'Will the proposed iron-mine investment succeed?',
        method: 'Astrological chart divination',
        label: 'Chart the investment',
        description: 'Use the client\'s account and key timing information to draw an event chart for the investment.',
        locator: 'zh 第62章 p70',
        means: held('means.chart', 'Have paper, a pen and the ability to construct and read an event chart.'),
        contact: held('contact.iron-mine-investment', 'Have Glacis\'s description of the investment and its key timing information.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Gather the investment details', description: 'Ask the client to describe the matter and supply information about the parties and key times.', minutes: 1, report: 'You gathered the information for the investment chart.'},
            {id: 'ask', kind: 'attempt', label: 'Draw the event chart', description: 'Draw the corresponding chart from the key timing information supplied by the client.', minutes: 1, status: 'signal', signal: 'An event chart is drawn from the supplied key times; its individual placements are not recorded.', report: 'You completed the event chart for the investment.'},
            {id: 'interpret', kind: 'interpret', label: 'Read the investment chart', description: 'Assess the proposed investment through the completed event chart.', minutes: 1, belief: 'I read the venture as heading for serious trouble and advise avoiding it.', report: 'You recorded your advice from the investment chart.'},
        ],
    },
    {
        id: 'lotm.div.tarot-divination',
        targetId: 'lotm.div.target.tarot-divination',
        question: "How will Bogda Jones's liver operation turn out?",
        method: 'Tarot divination',
        label: 'Read the operation spread',
        description: 'Have the patient shuffle and cut the deck, then lay out an Intis spread for the operation.',
        locator: 'zh 第82章 p61',
        means: held('means.tarot', 'Have a tarot deck and the ability to read the Intis spread.'),
        contact: held('contact.bogda-operation', 'Have the patient present to ask about the operation and handle the deck.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Arrange the Intis spread', description: 'Have the patient shuffle and cut the deck, then lay out the spread.', minutes: 1, report: 'You arranged the spread after the patient shuffled and cut.'},
            {id: 'ask', kind: 'attempt', label: 'Reveal the outcome card', description: 'Turn over the card representing the final outcome without turning over the other cards.', minutes: 1, status: 'signal', signal: 'The outcome card is the reversed Wheel of Fortune.', report: 'You observed the outcome card in the spread.'},
            {id: 'interpret', kind: 'interpret', label: 'Read the outcome card', description: 'Interpret the outcome card in relation to the operation.', minutes: 1, belief: 'I read the card as indicating that the matter will develop badly.', report: 'You recorded your reading of the operation spread.'},
        ],
    },
    {
        id: 'lotm.div.numerology',
        targetId: 'lotm.div.target.numerology',
        question: 'What broad life pattern and current-year tendency apply to Joyce Mayer?',
        method: 'Numerology',
        label: 'Calculate the date numbers',
        description: 'Use the supplied birth date and the current year to calculate the relevant life and yearly numbers.',
        locator: 'zh 第55章 p12',
        means: held('means.numerology', 'Have the ability to calculate and interpret the date numbers.'),
        contact: held('contact.joyce-birth-date', 'Have Anna\'s birth information for Joyce and the current year, 1349.'),
        steps: [
            {id: 'prepare', kind: 'prepare', label: 'Select the relevant date values', description: 'Use the birthday number for Joyce, who is under twenty-seven, and use the current year for the yearly calculation.', minutes: 1, report: 'You selected the date values for the reading.'},
            {id: 'ask', kind: 'attempt', label: 'Calculate the numbers', description: 'Reduce the birthday digits; combine the reduced current year, birth month and birthday for the yearly number.', minutes: 1, status: 'signal', signal: 'The birthday number is six and the current-year number is five.', report: 'You completed the date-number calculations.'},
            {id: 'interpret', kind: 'interpret', label: 'Read the date numbers', description: 'Interpret the calculated numbers and compare them with the known circumstances.', minutes: 1, belief: 'I associate six with balance and a caring marriage or engagement, and five with changes, surprises and some risk-taking; the supplied information seems fairly accurate.', report: 'You recorded your reading of the date numbers.'},
        ],
    },
]};

// Host-provided support facts, not initial inventory or grants of ability.
export const LOTM_DIVINATION_FACTS = [...new Set(LOTM_DIVINATION_ROWS.queries.flatMap(row => [row.means.fact, row.contact.fact]))];

// Other occasions are evidence references, not additional runnable queries.
// Volume qualifiers restore two references omitted by the typed extraction.
export const LOTM_DIVINATION_OCCASIONS = [
    {queryId: 'lotm.div.dream-divination', locator: 'zh 第87章 p45', question: 'Is Selena out of danger?', status: 'signal'},
    {queryId: 'lotm.div.dream-divination', locator: 'zh 第120章 p19', question: "What caused Mrs. Lawvis's death?", status: 'unknown'},
    {queryId: 'lotm.div.pendulum-divination', locator: 'zh 第124章 p15', question: 'Was the song just heard an illusion?', status: 'signal'},
    {queryId: 'lotm.div.pendulum-divination', locator: 'zh 第135章 p10', question: "Will exploring the castle's hidden area go smoothly?", status: 'signal'},
    {queryId: 'lotm.div.pendulum-divination', locator: 'zh 第152章 p18', question: 'Is the planned ritual dangerous when performed outside?', status: 'signal'},
    {queryId: 'lotm.div.pendulum-divination', locator: 'zh 第143章 p37', question: 'Should I obtain the Clown potion through the official organization?', status: 'signal'},
    {queryId: 'lotm.div.pendulum-divination', locator: 'zh 第82章 p77', question: "Is the herbalist a promising lead for the patient's illness?", status: 'unknown'},
    {queryId: 'lotm.div.coin-divination-club', locator: 'zh 第119章 p87', question: "Did supernatural factors influence Mrs. Lawvis's death?", status: 'signal'},
    {queryId: 'lotm.div.astrological-chart', locator: 'zh 第115章 p54', question: 'Can the clients recover from the investment crisis?', status: 'signal'},
    {queryId: 'lotm.div.astrological-chart', locator: 'zh 第115章 p77', question: 'What does a birth chart say about a one-year-old child?', status: 'unknown'},
    {queryId: 'lotm.div.tarot-divination', locator: 'zh 第62章 p56', question: 'Will the proposed investment succeed?', status: 'unknown'},
    {queryId: 'lotm.div.tarot-divination', locator: 'zh 第115章 p78', question: "Where is the client's missing object?", status: 'signal'},
];

export const LOTM_DIVINATION_GAPS = [
    {id: 'lotm.craft.child-locating', reason: 'The proposed sympathetic search needs reliable identifying details or a personal link; no completed locating attempt or answer is shown, and the child-based link requires waiting until birth.'},
    {id: 'lotm.rite.blood-kin-search', reason: 'Blood applied to a bone triggers a supernatural manifestation, but the cited passage provides no destination or locating interpretation.'},
    {id: 'lotm.rite.copper-whistle-summon', reason: 'A summoned being takes a letter; this belongs to a messenger mechanism rather than a question and answer signal.', coveredBy: 'lotm.summon.copper-whistle-messenger'},
    {id: 'lotm.rite.copper-whistle-messenger', reason: 'The same letter handoff is a messenger procedure, with no divination question or answer.', coveredBy: 'lotm.summon.copper-whistle-messenger'},
    {id: 'lotm.craft.pendulum-divination', reason: 'The tea demonstration has no question or interpretation; the performed disclosure check is represented separately.'},
    {id: 'lotm.rite.mirror-divination', reason: 'The lesson and positioning critique provide no performed mirror reading with a stated answer.'},
];
