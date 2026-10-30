// Economy and institutions fixtures (LTU6 Ledger → Owed). Invented, observer-safe, in the shapes the game projects: an economy_standing
// projection slice and obligations@1 rows. Named fixtures: `owed-empty` (a fresh life) and `owed-mixed` (every kind and direction).
const DAY = 1440, NOW = 40 * DAY;
const row = (id, kind, debtor, creditor, amount, why, source, extra = {}) => ({id, kind, debtor, creditor, amount, why, source, since: 0, eases: 0, carries: true, ...extra});

export const OWED_EMPTY = {id: 'owed-empty', title: 'Ledger → Owed, fresh life', standing: {now: 0, ledger: [], factions: [], claims: []}, fortunes: [], grudge: null};

export const OWED_MIXED = {
    id: 'owed-mixed', title: 'Ledger → Owed, five open accounts',
    standing: {now: NOW, claims: [{id: 'claim:3', amount: 12, why: 'Insured cargo lost to a pickpocket in the Slums', at: NOW - DAY, due: NOW + 2 * DAY}],
        ledger: [
            row('credit:market_circle', 'coin', 'player', 'market_circle', 10, 'Borrowed from the Market Circle', 'economy_standing', {since: NOW - 3 * DAY}),
            row('credit:gutter_crews', 'coin', 'player', 'gutter_crews', 25, 'Borrowed from the Gutter Crews', 'economy_standing', {since: NOW - 35 * DAY}),
            row('claim:3', 'coin', 'insurer', 'player', 12, 'Insured cargo lost to a pickpocket in the Slums', 'economy_standing', {since: NOW - DAY, carries: false}),
            row('craft:verge-grudge', 'grievance', 'player', 'village_verge', 3, 'Wasted common verge herbs on steeps that came to nothing', 'crafting', {since: NOW - 10 * DAY, eases: 1, carries: false}),
        ],
        factions: [
            {id: 'market_circle', label: 'Market Circle', loan: {owed: 11, daysLeft: 25, overdue: false}},
            {id: 'gutter_crews', label: 'Gutter Crews', loan: {owed: 31, daysLeft: -7, overdue: true}},
            {id: 'counting_house', label: 'Counting-House', loan: null},
        ]},
    fortunes: [row('career:kitReturn', 'duty', 'player', 'village_watch', 1, 'The patrol kit is lent for the shift and is due back at the watch post', 'village_career', {carries: false})],
    grudge: 2,
};

export const ECONOMY_FIXTURES = Object.freeze({[OWED_EMPTY.id]: OWED_EMPTY, [OWED_MIXED.id]: OWED_MIXED});
