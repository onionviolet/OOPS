// Shared process envelope (DWF101, DWF126): slots, minutes, bench, price, product, ritual, route, evidence and gaps.
// Product-agnostic: a potion, a pill, a smithed blade or a meal all fit. Dose behaviour (tolerance, ingestion, what a
// dose does) belongs to the product logic of each world, never here (MR: one envelope over separate product logics).
// Leaf module: no world imports, no DOM, no clock. Slot selectors use the craft_recipes.js shapes
// ({material}|{tags}|{property}|{all}); only an exact `key` (a runtime item key) resolves against holdings today.
export const PROCESS_STATUS = Object.freeze(['brewable', 'inspect-only']);
export const RITUAL_SCALES = Object.freeze(['solitary', 'creature', 'crowd', 'territory', 'war']);
const SELECT_KINDS = ['material', 'tags', 'property', 'all'];
const fail = message => { throw new Error(message); };
const text = (v, label) => typeof v === 'string' && v.length ? v : fail(`${label} must be non-empty text.`);
const natural = n => Number.isSafeInteger(n) && n >= 0;
const positive = n => Number.isSafeInteger(n) && n > 0;
const freeze = v => { if(v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; };
const plain = v => v && typeof v === 'object' && !Array.isArray(v);

// Shape check only (the catalogue-aware check lives in craft_recipes.js).
function checkSelect(sel) {
    if(!plain(sel)) fail('A slot selector must be an object.');
    const kinds = Object.keys(sel);
    if(kinds.length !== 1 || !SELECT_KINDS.includes(kinds[0])) fail('A selector names exactly one of material, tags, property or all.');
    if(sel.material != null) text(sel.material, 'Selector material');
    if(sel.all != null) { if(!Array.isArray(sel.all) || !sel.all.length) fail('all needs selectors.'); sel.all.forEach(checkSelect); }
}

export function defineProcess(row) {
    if(!plain(row)) fail('A process is an object.');
    const status = row.status ?? 'brewable';
    if(!PROCESS_STATUS.includes(status)) fail(`Unknown process status: ${status}.`);
    if(!Array.isArray(row.slots)) fail('A process lists its slots.');
    if(status === 'brewable' && !row.slots.length) fail('A brewable process needs slots.');
    const slots = row.slots.map(slot => {
        const id = text(slot.id, 'Slot ID');
        checkSelect(slot.select);
        if(!positive(slot.qty ?? 1)) fail(`Invalid quantity for slot ${id}.`);
        if(slot.key != null) text(slot.key, 'Slot key');
        if(slot.require != null && !plain(slot.require)) fail(`Slot ${id} requirements must be an object.`);
        return {id, role: text(slot.role, 'Slot role'), select: structuredClone(slot.select), qty: slot.qty ?? 1,
            ...(slot.unit != null ? {unit: text(slot.unit, 'Slot unit')} : {}), ...(slot.amount != null ? {amount: text(slot.amount, 'Slot amount')} : {}),
            ...(slot.key != null ? {key: slot.key} : {}), ...(slot.hold != null ? {hold: text(slot.hold, 'Slot hold')} : {}),
            ...(slot.require ? {require: structuredClone(slot.require)} : {}), evidence: slot.evidence ?? null};
    });
    if(new Set(slots.map(s => s.id)).size !== slots.length) fail('Duplicate slot ID.');
    if(status === 'brewable' && !positive(row.minutes)) fail('A brewable process needs positive minutes.');
    if(row.minutes != null && !positive(row.minutes)) fail('Minutes must be a positive integer.');
    if(row.price != null && (!natural(row.price.pence) || row.price.pence < 1)) fail('A process price is positive integer pence.');
    if(row.product != null) { text(row.product.key, 'Product key'); text(row.product.kind, 'Product kind'); }
    if(row.ritual != null) {
        if(typeof row.ritual.needed !== 'boolean') fail('A ritual says whether it is needed.');
        if(row.ritual.scale != null && !RITUAL_SCALES.includes(row.ritual.scale)) fail(`Unknown ritual scale: ${row.ritual.scale}.`);
        if(row.ritual.needed) text(row.ritual.text, 'Ritual text');
    }
    if(row.route != null) { text(row.route.id, 'Route id'); text(row.route.text, 'Route text'); }
    if(row.evidence != null && !Array.isArray(row.evidence)) fail('Process evidence is a list.');
    if(row.gaps != null && !Array.isArray(row.gaps)) fail('Process gaps are a list.');
    return freeze({id: text(row.id, 'Process ID'), world: text(row.world, 'Process world'), name: text(row.name, 'Process name'),
        ...(row.seq != null ? {seq: natural(row.seq) ? row.seq : fail('Seq is a natural number.')} : {}),
        ...(row.pathway != null ? {pathway: text(row.pathway, 'Pathway')} : {}), status, slots,
        ...(row.minutes != null ? {minutes: row.minutes} : {}), ...(row.bench != null ? {bench: text(row.bench, 'Bench')} : {}),
        ...(row.price ? {price: structuredClone(row.price)} : {}), ...(row.product ? {product: structuredClone(row.product)} : {}),
        ...(row.ritual ? {ritual: structuredClone(row.ritual)} : {}), ...(row.route ? {route: structuredClone(row.route)} : {}),
        evidence: [...(row.evidence ?? [])], gaps: [...(row.gaps ?? [])]});
}

// holdings: {runtimeItemKey: count}. Every miss is explained once, for the UI and for tests alike.
export function processGaps(row, holdings = {}, {ritualDone = false} = {}) {
    const missing = [];
    for(const slot of row.slots) {
        if(slot.key == null) { missing.push({slot: slot.id, need: slot.qty, have: 0, reason: 'no runtime item stands for this slot yet'}); continue; }
        const have = holdings[slot.key] ?? 0;
        if(have < slot.qty) missing.push({slot: slot.id, need: slot.qty, have, reason: `need ${slot.qty}, hold ${have}`});
    }
    const unmet = [];
    if(row.ritual?.needed && !ritualDone) unmet.push({id: 'ritual', risk: true, reason: row.ritual.text});
    return {ok: !missing.length, missing, unmet, known: [...row.gaps], route: row.route ?? null};
}

// The one timing check: ready once `minutes` have elapsed since `startedAt` (played clock minutes).
export function processReady({startedAt, now, minutes}) {
    if(!natural(startedAt) || !natural(now) || !positive(minutes)) return false;
    return now - startedAt >= minutes;
}

// Ledger view: rows grouped by world then pathway, highest Sequence first, with status and gap counts.
export function processLedger(rows, holdings = {}) {
    const worlds = new Map();
    for(const row of rows) {
        const pathways = worlds.get(row.world) ?? worlds.set(row.world, new Map()).get(row.world);
        const list = pathways.get(row.pathway ?? '') ?? pathways.set(row.pathway ?? '', []).get(row.pathway ?? '');
        const g = processGaps(row, holdings);
        list.push({id: row.id, name: row.name, seq: row.seq ?? null, status: row.status, missing: g.missing.length, known: g.known.length, route: row.route?.id ?? null});
    }
    return [...worlds].map(([world, pathways]) => ({world, pathways: [...pathways].map(([pathway, entries]) => ({pathway, entries: entries.sort((a, b) => (b.seq ?? -1) - (a.seq ?? -1))}))}));
}
