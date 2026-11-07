// FD14 society sheet: a declaration and a coverage printout, never a simulation. Each world lists its ordinary society as fields; each field
// says whether it is authored (an existing owner holds real rows), palette (a proposal, placeholder or doc table nobody loads yet) or
// missing (nothing yet), and points at its owner. "Society sheet" here is FD14 only; `feature_expansion_society` is Village agreed work.
// Palettes are suggestions an author overwrites (AD46: no world is the template). No sealed truths: secrets are referred to by ID only.
// Locator forms: `src/file.js#exportName` (the export must exist), `docs/file.md` or `docs/file.md#heading-slug` (the heading must exist).
export const SHEET_FIELDS = Object.freeze(['money', 'calendar', 'institutions', 'positions', 'law', 'information', 'address']);
export const STATUSES = Object.freeze(['authored', 'palette', 'missing']);
const LOTM_PASS = 'docs/worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md';
const HP_PASS = 'docs/worlds/HARRY_POTTER_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md';
const KIT = 'docs/worlds/WORLD_CORE_KIT_2026-10-14.md';
// authored/palette rows carry `owner`; a missing row carries `home`, where its data would live once written. `note` is one plain line.
const f = (status, locator, note, palette = null) => Object.freeze({status, ...(status === 'missing' ? {home: locator} : {owner: locator}), ...(palette ? {palette} : {}), note});

// Optional `authority` on a sheet (FD14's first runtime reader, read by authority_sources*.js): per authority id, how fast it forgets (`halfLifeDays`) and how
// public each kind of post is (`postPublicity`, by rank). Each dial is {value, reason}; the code keeps the default, and a missing or malformed dial uses it.
const a = (value, reason) => Object.freeze({value, reason});
const txt = v => typeof v === 'string' && v.trim() !== '';
const dialOk = (d, valid) => !!d && typeof d === 'object' && txt(d.reason) && valid(d.value);
export const authorityDialProblem = dial => dial?.halfLifeDays !== undefined && !dialOk(dial.halfLifeDays, v => Number.isFinite(v) && v > 0) ? 'halfLifeDays needs a positive number and a reason'
    : dial?.postPublicity !== undefined && !(dial.postPublicity && typeof dial.postPublicity === 'object' && Object.values(dial.postPublicity).every(d => dialOk(d, v => Number.isFinite(v) && v >= 0))) ? 'postPublicity needs a number >= 0 and a reason per rank' : null;
// Validated dials for one authority id, taken from the first sheet that declares it. Each dial is checked on its own, so one bad entry drops only itself.
export function authorityDials(authorityId, sheets = SHEETS) {
    const dial = sheets.find(s => s?.authority && Object.hasOwn(s.authority, authorityId))?.authority[authorityId] ?? {}, out = {halfLife: null, postPublicity: {}};
    if(dialOk(dial.halfLifeDays, v => Number.isFinite(v) && v > 0)) out.halfLife = {days: dial.halfLifeDays.value, reason: dial.halfLifeDays.reason};
    if(dial.postPublicity && typeof dial.postPublicity === 'object') for(const [rank, d] of Object.entries(dial.postPublicity)) if(dialOk(d, v => Number.isFinite(v) && v >= 0)) out.postPublicity[rank] = d.value;
    return out;
}

export const SHEETS = Object.freeze([
    Object.freeze({id: 'tingen', label: 'Tingen (Klein, early Tingen lives)', worldId: 'book.lotm.tingen', authority: Object.freeze({tingen: Object.freeze({
        halfLifeDays: a(60, 'A city office keeps ledgers, but one clerk or one fortune-teller among a crowd is remembered for weeks, not years.'),
        postPublicity: Object.freeze({
            clerk: a(2, 'A clerk is on the city\'s books and seen at the office.'),
            'night watchman': a(1, 'A hired guard is known to one employer and the watch on that stretch of river.'),
            probationer: a(0, 'A probationer\'s Beyonder post is kept off the books on purpose.'),
        }),
    })}), fields: Object.freeze({
        money: f('authored', 'src/book_world_lotm_pay.js#PAY_LINES', 'Pence denominations (LOTM_PENCE) and pay lines are code; the rent figure is an assumed dial, not a source price.'),
        calendar: f('authored', 'src/book_world_lotm_duties.js#LOTM_DUTIES', 'A weekly cycle (expense claim, rent) on world_rhythm; market day and service day from book_world_lotm_deck.js (week phase authored); no festivals yet.'),
        institutions: f('authored', 'src/book_world_lotm_merit.js#NIGHTHAWKS', 'Nighthawks with a merit store, and three churches\' districts in book_world_lotm_districts.js.'),
        positions: f('authored', 'src/book_world_lotm_positions.js#lotmPositions', 'Probationer and civil-staff positions derived from life profiles; terms and exits are not yet a record (FD15).'),
        law: f('palette', LOTM_PASS + '#law-enforcement-aftermath', 'Pass table of statutes and enforcers, not loaded; src/law_case.js#defineLawBook has no importer.', 'industrial_city'),
        information: f('authored', 'src/book_world_lotm_events.js#LOTM_LEAD_CHANNELS', 'Newspaper, notice board and word of mouth through world_events (learnedDay); a seeded Tingen daily deck (book_world_lotm_deck.js, flavour only).'),
        address: f('missing', KIT + '#k20', 'No forms of address or naming pool as data; K20 is content only.'),
    })}),
    Object.freeze({id: 'little_whinging_hogwarts', label: 'Harry, Little Whinging and the Hogwarts summer', worldId: 'book.hp.lead.world', fields: Object.freeze({
        money: f('palette', HP_PASS + '#money-and-information-wpr12', 'Pass table only (coins and prices); no HP price anchors or pay bands in code.', 'boarding_school'),
        calendar: f('authored', 'src/book_world_hp_school_calendar.js#SCHOOL_YEAR', 'School year and term phases from day 0 (31 July), plus a weekly class slot (an authored proposal).'),
        institutions: f('palette', HP_PASS + '#places-and-institutions-wpr9', 'School, four houses with a Head each, hospital wing, Ministry: pass table only; the house list is code (HP_HOUSES) but no house row, Head or points total is loaded.', 'boarding_school'),
        positions: f('authored', 'src/book_world_hp_positions.js#hpPositions', 'Pupil (first year) and house member rows derived from two actor facts; no route sets them yet (no arrival or Sorting command). Prefect and Head of House are not rows.'),
        law: f('palette', HP_PASS + '#law-enforcement-aftermath-wpr11-wpr16', 'School-yard rules from the pass: no magic in corridors between classes, out-of-bounds floor and forest, caretaker patrols and reports, lost points, expulsion as top penalty. A curfew is not stated in the pass. Not loaded as rows.', 'boarding_school'),
        information: f('authored', 'src/book_world_hp_people_source.js#hpPeopleRows', 'People known only through the player\'s own knowledge entries; owl post and papers are not modelled.'),
        address: f('missing', KIT + '#k20', 'No forms of address as data.'),
    })}),
]);

// Pure coverage: counts of authored, palette and missing over the declared field list; fields not declared count as missing.
export function sheetCoverage(sheet) {
    const out = {authored: 0, palette: 0, missing: 0, total: SHEET_FIELDS.length, lines: []};
    for(const id of SHEET_FIELDS) {
        const row = sheet.fields[id], status = STATUSES.includes(row?.status) ? row.status : 'missing';
        out[status]++;
        out.lines.push({field: id, status, locator: row?.owner ?? row?.home ?? null, palette: row?.palette ?? null, note: row?.note ?? 'Not declared.'});
    }
    return out;
}
