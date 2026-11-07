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

export const SHEETS = Object.freeze([
    Object.freeze({id: 'tingen', label: 'Tingen (Klein, early Tingen lives)', worldId: 'book.lotm.tingen', fields: Object.freeze({
        money: f('authored', 'src/book_world_lotm_pay.js#PAY_LINES', 'Pence denominations (LOTM_PENCE) and pay lines are code; the rent figure is an assumed dial, not a source price.'),
        calendar: f('authored', 'src/book_world_lotm_duties.js#LOTM_DUTIES', 'A weekly cycle (expense claim, rent) on world_rhythm; no festival or church-day rows yet.'),
        institutions: f('authored', 'src/book_world_lotm_merit.js#NIGHTHAWKS', 'Nighthawks with a merit store, and three churches\' districts in book_world_lotm_districts.js.'),
        positions: f('authored', 'src/book_world_lotm_positions.js#lotmPositions', 'Probationer and civil-staff positions derived from life profiles; terms and exits are not yet a record (FD15).'),
        law: f('palette', LOTM_PASS + '#law-enforcement-aftermath', 'Pass table of statutes and enforcers, not loaded; src/law_case.js#defineLawBook has no importer.', 'industrial_city'),
        information: f('authored', 'src/book_world_lotm_events.js#LOTM_LEAD_CHANNELS', 'Newspaper, notice board and word of mouth through world_events (learnedDay); no Tingen daily draw.'),
        address: f('missing', KIT + '#k20', 'No forms of address or naming pool as data; K20 is content only.'),
    })}),
    Object.freeze({id: 'little_whinging_hogwarts', label: 'Harry, Little Whinging and the Hogwarts summer', worldId: 'book.hp.lead.world', fields: Object.freeze({
        money: f('palette', HP_PASS + '#money-and-information-wpr12', 'Pass table only (coins and prices); no HP price anchors or pay bands in code.', 'boarding_school'),
        calendar: f('authored', 'src/book_world_hp_school_calendar.js#SCHOOL_YEAR', 'School year and term phases from day 0 (31 July), plus a weekly class slot (an authored proposal).'),
        institutions: f('palette', HP_PASS + '#places-and-institutions-wpr9', 'School, houses and Ministry from the pass; only the generic grant seam (institution_access) is code.', 'boarding_school'),
        positions: f('palette', 'src/book_world_hp_duties.js#HP_DUTIES', 'One class slot as a duty; enrolment, year and prefect are not a position record.', 'boarding_school'),
        law: f('missing', 'src/law_case.js#defineLawBook', 'Points, detention and out-of-bounds have no owner; no house-points code found.'),
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
