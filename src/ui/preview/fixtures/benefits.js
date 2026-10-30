// Gallery fixtures for membership, benefits and debts (ECONOMY_AND_INSTITUTIONS Round 3, forms O6-O9). Invented names only (CLR3).
// Proposals (AD32): three of four forms drawn with existing figure parts. The diegetic letter (O9) is prose, so it stays in the doc.
const lines = (rows) => rows.map(([label, state, note, effect]) => ({label, state, ...(note ? {note} : {}), ...(effect ? {effect} : {})}));
export const FIGURE_FIXTURES_BENEFITS = [
    // O6 statement: one pay period as lines, oldest at the bottom, next payday on top.
    {id: 'benefits-statement-company', size: 720, title: 'Company statement: Third Foot, pay period 4', summary: 'What the company paid, held back and still owes you this period.',
        tracks: [{id: 'period', label: 'Pay period 4 of 12', orient: 'vertical', progress: 'net 9 silver of 12 gross',
            steps: lines([['Base pay, rank of private', 'done', '+12 silver, paid on the 1st'], ['Rations issued, 28 days', 'done', 'in kind, worth about 6 silver'],
                ['Kit upkeep', 'done', '-2 silver, held from pay'], ['Advance against pay', 'strained', '-5 silver, 4 days to settle'],
                ['Campaign bonus', 'pending', 'owed on the next march, not yet earned'], ['Next payday', 'current', 'in 9 days', 'glow']])}],
        notes: [{text: 'Net this period: 9 silver after the kit and the advance. The advance is repaid in full before bonus pay.'},
            {state: 'broken', text: 'If you desert: arrears are forfeit, the kit debt stays on the roll, and the advance passes to your family or guarantor.'}]},
    // O7 membership card: a member in the middle, each entitlement and duty around them, revoked ones marked.
    {id: 'benefits-card-academy', size: 720, title: 'Membership card: Cassel Hall, suspended term', summary: 'Perks the hall gives a student, what is shut while suspended, and what you keep.',
        rings: [{id: 'perks', label: 'Perks', radius: .8, count: 6, visible: false}],
        nodes: [{id: 'you', label: 'You, student', glyph: 'Y', at: 'center', state: 'active', effect: 'glow'},
            {id: 'library', label: 'Library reading room', glyph: 'L', ring: 'perks', index: 0, state: 'broken'}, {id: 'key', label: 'Housing key, east wing', glyph: 'K', ring: 'perks', index: 1, state: 'broken'},
            {id: 'mentor', label: 'Mentor hours, 2 a week', glyph: 'M', ring: 'perks', index: 2, state: 'strained'}, {id: 'meals', label: 'Hall meals', glyph: 'H', ring: 'perks', index: 3, state: 'filled'},
            {id: 'attend', label: 'Duty: attend lectures', glyph: 'A', ring: 'perks', index: 4, state: 'strained'}, {id: 'fees', label: 'Dues: term fee, 20 silver', glyph: 'F', ring: 'perks', index: 5, state: 'filled'}],
        edges: [{from: 'you', to: 'library', kind: 'access', state: 'broken', label: 'suspended'}, {from: 'you', to: 'key', kind: 'access', state: 'broken', label: 'suspended'},
            {from: 'you', to: 'attend', kind: 'duty', state: 'strained', label: 'missed 3'}, {from: 'you', to: 'fees', kind: 'dues', label: 'paid'}],
        notes: [{state: 'broken', text: 'Suspended by the Dean until the end of term: reading room and housing key are closed. The key must be handed back in 3 days.'},
            {state: 'done', text: 'Kept: the Fire Lens technique you learned, your fee payment and your standing with the mentor.'}]},
    // O8 ledger by counterparty: you in the middle, every party that holds a claim on you or that you hold on them.
    {id: 'benefits-counterparties', size: 720, title: 'Accounts by counterparty: the company soldier', summary: 'Who owes you, who you owe, grouped by the party that would come asking.',
        rings: [{id: 'parties', label: 'Counterparties', radius: .8, count: 5, visible: false}],
        nodes: [{id: 'you', label: 'You', glyph: 'Y', at: 'center', state: 'active', effect: 'glow'},
            {id: 'paymaster', label: 'Company paymaster', glyph: 'P', ring: 'parties', index: 0}, {id: 'quarter', label: 'Quartermaster', glyph: 'Q', ring: 'parties', index: 1},
            {id: 'lender', label: 'Moneylender Orsk', glyph: 'O', ring: 'parties', index: 2, state: 'strained'}, {id: 'mercy', label: 'Mercy fund', glyph: 'M', ring: 'parties', index: 3},
            {id: 'sister', label: 'Your sister', glyph: 'S', ring: 'parties', index: 4, state: 'unknown'}],
        edges: [{from: 'paymaster', to: 'you', kind: 'owed', label: '3 silver arrears'}, {from: 'you', to: 'quarter', kind: 'owes', label: 'kit, returns at discharge'},
            {from: 'you', to: 'lender', kind: 'owes', state: 'strained', label: '8 silver, overdue'}, {from: 'you', to: 'mercy', kind: 'dues', label: '1 silver a month'},
            {from: 'sister', to: 'you', kind: 'owed', state: 'guessed', label: 'a letter, unread'}],
        notes: [{state: 'strained', text: 'Orsk is the only account past its date. The company will settle it from your pay on request.'}]},
];
