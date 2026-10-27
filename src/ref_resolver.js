// Reference resolver (CAE-E1, CAE-E4). Pure: no imports, no save field.
// Token syntax: {ref:ID} or {ref:ID|fallback text}. ID is [A-Za-z0-9_.:-]+ (e.g. person:maia).
// Text without a token is returned byte-identical. Unknown ids never throw.
// ctx: {names: {id:name} | (id)=>name|undefined, masked: {id: residueText|true} | (id)=>..., residue: 'someone', fallback: 'unknown'}
export const DEFAULT_RESIDUE = 'someone';
export const DEFAULT_FALLBACK = 'unknown';
const TOKEN = /\{ref:([A-Za-z0-9_.:-]+)(?:\|([^{}]*))?\}/g;
const look = (table, id) => {
    try {
        if(typeof table === 'function') return table(id);
        if(table && Object.prototype.hasOwnProperty.call(table, id)) return table[id];
    } catch {}
    return undefined;
};
// Resolution order: mask (residue) -> name -> inline fallback -> ctx fallback.
export function refOf(id, ctx = {}, inlineFallback) {
    const c = ctx || {};
    const mask = look(c.masked, id);
    if(mask) return {id, label: typeof mask === 'string' ? mask : (c.residue || DEFAULT_RESIDUE), known: false, residue: true};
    const name = look(c.names, id);
    if(typeof name === 'string' && name) return {id, label: name, known: true, residue: false};
    return {id, label: inlineFallback || c.fallback || DEFAULT_FALLBACK, known: false, residue: false};
}
export function renderRefs(text, ctx) {
    if(typeof text !== 'string' || !text.includes('{ref:')) return text;
    return text.replace(TOKEN, (_, id, fb) => refOf(id, ctx, fb).label);
}
