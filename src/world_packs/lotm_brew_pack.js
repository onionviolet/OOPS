// Lord of the Mysteries brewing pack (chat B). Every formula row in
// lotm_formula_rows.js (43 rows), plus the named mains below, as methods on the
// shared brew law (brew_law.js), with its text quantities parsed into amounts.
//
// World law, default, dial and reason (proposal under AD56, calibrated to the
// Seer scene, B1 ch. 31, AD49):
// - Default: the first main material carries the Beyonder charge; each other
//   main material binds it in the proportion its formula amount gives. Bound
//   charge becomes the potion's power; charge left unbound is the hazard (the
//   whispers, mental damage). Auxiliaries are carried as matrix and read by
//   nothing, so their amounts barely matter (Neil: the first five barely matter).
// - A single-main formula binds at most its formula amount; any excess is
//   unbound (Neil: slightly less is tolerated, slightly more can harm).
// - Dial: `hazardUnit` (milli-units of charge per hazard point) and the binding
//   proportions are data per row; a harsher pathway changes numbers, not code.
// - Reason: the book states an absolute tolerance on the main ingredients, not
//   a proportion of the whole cup (lotm_seer_brew.js keeps the same reading).
// Amount sources: 'stated' (the table gives a measure), 'portion' (the table
// gives a count or nothing, so one portion per qty), 'whole' ("all" of a source).
import {LOTM_FORMULA_ROWS} from '../lotm_formula_rows.js';
import {brewMethod, MILLI} from '../brew_law.js';

const UNITS = {ml: 'ml', g: 'g', drop: 'drop', drops: 'drop'};
const WORDS = {one: 1, two: 2, three: 3, pair: 2, 'one each': 1};

/** Parse a table quantity into {amount (milli), unit, source}. */
export function parseLotmAmount(text, qty = 1) {
    if (text == null) return {amount: qty * MILLI, unit: 'portion', source: 'portion'};
    const t = String(text).trim().toLowerCase();
    const m = /^(\d+(?:\.\d+)?)\s*(ml|g|drops?)$/.exec(t);
    if (m) return {amount: Math.round(Number(m[1]) * MILLI), unit: UNITS[m[2]], source: 'stated'};
    if (/^\d+$/.test(t)) return {amount: Number(t) * MILLI, unit: 'portion', source: 'stated'};
    if (Object.hasOwn(WORDS, t)) return {amount: WORDS[t] * MILLI, unit: 'portion', source: 'stated'};
    if (t === 'all') return {amount: MILLI, unit: 'whole', source: 'whole'};
    return {amount: qty * MILLI, unit: 'portion', source: 'unparsed', text};
}

const gcd = (a, b) => b ? gcd(b, a % b) : a;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
export const LOTM_HAZARD_UNIT = MILLI;

function lawFor(row) {
    const mains = row.slots.filter(s => s.role === 'main');
    const parsed = Object.fromEntries(row.slots.map(s => [s.id, parseLotmAmount(s.amount, s.qty)]));
    const [carrier, ...binders] = mains;
    const properties = Object.fromEntries(row.slots.map(s => [s.id,
        s === carrier ? {charge: 1000} : binders.includes(s) ? {[`bind_${s.id}`]: 1000} : {}]));
    const amounts = mains.map(s => parsed[s.id].amount);
    const g = amounts.reduce((a, b) => gcd(a, b));
    const coeff = Object.fromEntries(mains.map((s, i) => [s.id, amounts[i] / g]));
    const reactants = {charge: coeff[carrier.id], ...Object.fromEntries(binders.map(s => [`bind_${s.id}`, coeff[s.id]]))};
    const potency = Object.values(reactants).reduce((n, k) => n + k, 0);
    const reaction = {id: `${row.id}.bind`, reactants, products: {potency}, productOrigins: {potency: row.id},
        ...(binders.length ? {} : {limit: parsed[carrier.id].amount})};
    return {parsed, properties, reaction, formulaPotency: Math.floor(parsed[carrier.id].amount / coeff[carrier.id]) * potency};
}

function packRow(row) {
    const {parsed, properties, reaction, formulaPotency} = lawFor(row);
    const half = Math.floor(row.minutes / 2);
    const method = brewMethod({id: `lotm.brew.${row.id}`, slots: row.slots.map(s => ({id: s.id})),
        process: [{op: 'react', minutes: half, options: {reactions: [reaction]}},
            {op: 'divide', minutes: row.minutes - half, options: {doses: 1}}]});
    const unparsed = row.slots.filter(s => parsed[s.id].source === 'unparsed').map(s => s.amount);
    return Object.freeze({id: row.id, name: row.name, pathway: row.pathway, seq: row.seq, status: row.status,
        method, reaction, formulaPotency, hazardUnit: LOTM_HAZARD_UNIT,
        slots: row.slots.map(s => ({id: s.id, role: s.role, material: s.select.material, ...parsed[s.id], properties: properties[s.id]})),
        gaps: [...row.gaps, ...unparsed.map(t => `Quantity "${t}" is read as one portion.`)],
        offered: row.status === 'brewable'});
}

// Additional mains in the table's detailed rows, absent from its 43-row summary.
// PC85, PFP3: keep these world facts here; unknown quantities use the existing
// portion default. Timing inherits the existing authored dial for that Sequence.
// No bench offer: auxiliaries and/or the complete formula remain unknown.
const ADDITIONAL_FORMULAS = [
    {id: 'twilight_giant_3', pathway: 'Twilight Giant', seq: 3, name: 'Silver Knight',
        main: 'Silver Knight characteristic', aux: [],
        evidence: 'T 1155; PATHWAY_POTION_TABLE.md:221'},
    {id: 'hermit_3', pathway: 'Hermit', seq: 3, name: 'Prophecy Master',
        main: 'Sequence 3 Prophecy Master characteristic', aux: [],
        evidence: 'S 1207; PATHWAY_POTION_TABLE.md:281'},
    {id: 'chained_4', pathway: 'Chained', seq: 4, name: 'Puppet',
        main: 'Wraith consciousness crystal',
        aux: ['Wraith blood', 'dust', 'contaminated water', 'mirror', 'souls'],
        evidence: 'W, medium; PATHWAY_POTION_TABLE.md:382'},
].map(({main, aux, evidence, ...row}) => ({...row, status: 'inspect-only',
    minutes: LOTM_FORMULA_ROWS.find(r => r.seq === row.seq).minutes,
    slots: [{id: 'm1', role: 'main', select: {material: main}, qty: 1, evidence},
        ...aux.map((material, i) => ({id: `a${i + 1}`, role: 'aux',
            select: {material}, qty: 1, ...(material === 'souls' ? {amount: '9'} : {}), evidence}))],
    gaps: [evidence, 'Main amount is unstated; the existing one-portion default applies.',
        ...(aux.length ? ['Wiki-only formula; no novel-note confirmation in the table.']
            : ['Auxiliary materials are not named in the table.']),
        'Complete formula unverified; no bench brew is offered.'],
}));

export const LOTM_BREW_ROWS = Object.freeze([...LOTM_FORMULA_ROWS, ...ADDITIONAL_FORMULAS].map(packRow));
export const lotmBrewRow = id => LOTM_BREW_ROWS.find(r => r.id === id) ?? null;

/** Lots for one attempt: each slot's measured amount (milli) of its material.
 * `measures` overrides by slot id; the default is the formula amount. */
export function lotmLots(row, measures = {}) {
    return Object.fromEntries(row.slots.map(s => [s.id, {kind: 'lot', id: `lot.${row.id}.${s.id}`,
        material: slug(s.material), amount: measures[s.id] ?? s.amount, properties: s.properties}]));
}

/** Read a finished dose: power in the carrier's units, share of a full dose
 * (permille) and hazard points from unbound charge. */
export function lotmDoseReading(row, dose) {
    const potency = dose?.contents?.potency ?? 0, unbound = dose?.contents?.charge ?? 0;
    return {power: Math.floor(potency / MILLI), fullDosePermille: row.formulaPotency ? Math.floor(potency * 1000 / row.formulaPotency) : 0,
        hazard: Math.floor(unbound / row.hazardUnit)};
}

/** Read a delivered, formula-identified dose before offering it to a
 * progression owner. Legacy or mixed stock can still be measured above. */
export function identifiedLotmDoseReading(row, dose) {
    return dose?.origins?.potency === row.id && dose.contents?.potency > 0 ? lotmDoseReading(row, dose) : null;
}
