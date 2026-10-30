// Read-only quantity crosswalk for the lead-run coverage proxy, not transaction
// equivalence. Registry text stays at the caller; results contain ids and numbers.
// AR3: denomination authority remains LOTM_PENCE. No runtime state or host wiring.
import {LOTM_PENCE} from './book_world_lotm_ids.js';

const units = {镑: LOTM_PENCE.pound, 苏勒: LOTM_PENCE.soli, 便士: 1};
const digits = '零一二三四五六七八九';
function number(value) {
    if (/^\d+(?:\.\d+)?$/.test(value)) return Number(value);
    if (value === '半' || value === '二分之一') return 0.5;
    const scaled = /^(\d+(?:\.\d+)?)(万|千)$/.exec(value);
    if (scaled) return Number(scaled[1]) * (scaled[2] === '万' ? 10000 : 1000);
    value = value.replaceAll('两', '二').replaceAll('〇', '零');
    if (!/^[零一二三四五六七八九十百千万]+$/.test(value) || /[一二三四五六七八九]{2}/.test(value)
        || /[百千万][一二三四五六七八九]$/.test(value)) return null;
    let total = 0, section = 0, digit = 0;
    for (const char of value) {
        if (digits.includes(char)) digit = digits.indexOf(char);
        else if (char === '万') { total += (section + digit || 1) * 10000; section = digit = 0; }
        else { section += (digit || 1) * ({十: 10, 百: 100, 千: 1000}[char]); digit = 0; }
    }
    return total + section + digit;
}
function amount(text) {
    if (typeof text !== 'string') return null;
    text = text.trim().replaceAll('鲁恩金镑', '镑').replaceAll('金镑', '镑').replaceAll('铜便士', '便士')
        .replace(/(?:个|枚|张)(?=镑|苏勒|便士)/g, '').replace(/\s+/g, '');
    const token = /([\d.零〇一二两三四五六七八九十百千万半]+|二分之一)(镑|苏勒|便士)/gy;
    let match, end = 0, total = 0;
    const seen = new Set();
    while ((match = token.exec(text))) {
        const n = number(match[1]);
        if (n == null || seen.has(match[2])) return null;
        seen.add(match[2]); total += n * units[match[2]]; end = token.lastIndex;
    }
    return end === text.length && seen.size && Number.isSafeInteger(total * 2) ? total : null;
}

// Explicit source fragments identify actual carriers in the existing corpus.
// Same quantity does not establish the same service, item, salary or canon price.
const carriers = [
    {id: 'LOTM_PENCE.soli', pence: LOTM_PENCE.soli, file: 'src/book_world_lotm_ids.js', source: 'export const LOTM_PENCE=Object.freeze({soli:12,pound:240});'},
    {id: 'LOTM_PENCE.pound', pence: LOTM_PENCE.pound, file: 'src/book_world_lotm_ids.js', source: 'export const LOTM_PENCE=Object.freeze({soli:12,pound:240});'},
    {id: 'BROKER_VERIFY_FEE', pence: LOTM_PENCE.soli, file: 'src/book_world_lotm_broker.js', source: 'export const BROKER_VERIFY_FEE=P.soli;'},
    {id: 'LOTM_LOTS.frog.payment.pence', pence: 3 * LOTM_PENCE.soli, file: 'src/book_world_lotm_broker.js', source: "{id:'frog',label:'a dried black-spotted frog',item:K.frog,genuine:true,payment:{pence:3*P.soli}"},
    {id: 'LOTM_LOTS.hairs.payment.pence', pence: 4 * LOTM_PENCE.soli, file: 'src/book_world_lotm_broker.js', source: "{id:'hairs',label:'a bundle of rare hairs',item:K.hairs,genuine:false,payment:{pence:4*P.soli}"},
    {id: 'marketLots.dose9.payment.pence', pence: 6 * LOTM_PENCE.pound, file: 'src/book_world_lotm_broker.js', source: 'payment:{pence:6*P.pound}'},
    {id: 'marketLots.dose8.payment.pence', pence: 12 * LOTM_PENCE.pound, file: 'src/book_world_lotm_broker.js', source: 'payment:{pence:12*P.pound}'},
    {id: 'LOTM_LIVES.civil.contract.weeklyPence', pence: 3 * LOTM_PENCE.pound, file: 'src/book_world_lotm_lives.js', source: 'contract:{weeklyPence:3*P.pound,termYears:5,secrecy:'},
    {id: 'LOTM_LIVES.civil.contract.allowancePence', pence: 10 * LOTM_PENCE.soli, file: 'src/book_world_lotm_lives.js', source: 'allowancePence:10*P.soli}'},
];
const compact = text => text.replace(/\s+/g, '');

/** Each input id gets an exact amount, a labelled band, or an explicit gap.
 * Strict whole-field metadata avoids treating chapter numbers, weights, partial
 * totals, foreign coins, or unsupported contextual descriptions as Loen money.
 */
export function mapLotmPrice(row) {
    const id = row?.id ?? null;
    const base = {id, status: 'unmapped', pence: null, bandPence: null, inferred: false, basis: null, gameRefs: []};
    if (row?.kind !== 'price' || !/^lotm\.price\.[a-z0-9._-]+$/.test(id ?? '')) return {...base, reason: 'not a registry price id'};
    // The merge conflates a denomination and a four-penny fare under this id.
    if (id === 'lotm.price.copper-penny') return {...base, reason: 'merged id conflates one-penny denomination and four-penny amount'};
    const pence = amount(row.zh);
    if (pence != null) return {...base, status: 'mapped', pence, basis: 'registry.zh exact currency quantity',
        gameRefs: carriers.filter(ref => ref.pence === pence).map(ref => ({...ref})), reason: null};
    const range = typeof row.zh === 'string' ? row.zh.split(/到|至|[~～]/) : [];
    if (range.length === 2) {
        // In a same-unit range, the unit on the right also qualifies the left.
        const unit = /(镑|苏勒|便士)$/.exec(range[1])?.[1];
        const low = amount(range[0]) ?? (unit ? amount(range[0] + unit) : null), high = amount(range[1]);
        if (low != null && high != null && low <= high) return {...base, status: 'mapped', bandPence: [low, high], basis: 'registry.zh stated range', reason: null};
    }
    const vague = {'几百镑': [200, 900], '数百镑': [200, 900], '几千镑': [2000, 9000], '数千镑': [2000, 9000], '几十镑': [20, 90]};
    const band = vague[row.zh];
    if (band) return {...base, status: 'band-inferred', bandPence: band.map(n => n * LOTM_PENCE.pound), inferred: true,
        basis: 'working lexical band: several means 2–9 units; not a stated bound or spendable quote', reason: null};
    return {...base, reason: 'no unambiguous whole-field Loen currency amount; context or currency review needed'};
}

export const buildLotmPriceMap = registry => registry.filter(row => row.kind === 'price').map(mapLotmPrice);

/** A conversion or inferred band alone does not count as consumption. */
export function traceLotmPrices(registry, corpus = '') {
    const text = compact(Array.isArray(corpus) ? corpus.join('\n') : corpus);
    const present = new Set(carriers.filter(ref => text.includes(compact(ref.source))).map(ref => ref.id));
    return buildLotmPriceMap(registry).map(mapped => ({...mapped, gameRefs: mapped.gameRefs.filter(ref => present.has(ref.id))}));
}
