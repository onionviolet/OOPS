// Reader texture paraphrases only. No census notes, source text or private news.
const text = value => typeof value === 'string' && value.trim() && !/^(?:unstated|not stated|not mentioned|none stated)$/i.test(value.trim())
    ? value.trim().replace(/\s+/g, ' ') : null;
const labels = new Set(['S', 'T', 'I', 'U']);
export const LIFE_KINDS = ['services', 'customs', 'news'];
export function publicLifeRow(row) {
    return !!row && row.private !== true && !(Array.isArray(row.sealed) ? row.sealed.length : row.sealed) && row.scope !== 'private' && !(row.kind === 'news' && row.at === 'private');
}
export function projectLifeRow(kind, row, shard) {
    if (!row || !LIFE_KINDS.includes(kind) || !publicLifeRow({...row, kind}) || !text(row.what)) return null;
    const value = {kind, what: text(row.what), at: text(row.place || row.applies), label: labels.has(row.label) ? row.label : null,
        locator: text(row.locator), sources: [{label: labels.has(row.label) ? row.label : null, locator: text(row.locator), shard: text(shard)}]};
    if (kind === 'services') Object.assign(value, {
        serviceKind: text(row.kind), hours: text(row.hours), price: text(row.price), priceId: text(row.priceId), priceStated: text(row.priceStated),
        amount: Number.isFinite(row.amount) ? {value: row.amount, unit: text(row.unit), per: text(row.per)} : null,
    });
    if (kind === 'news') Object.assign(value, {date: text(row.date), scope: text(row.scope), carriedBy: text(row.carriedBy)});
    return value;
}
export function lifeIdentity(row) {
    return JSON.stringify([row.kind, row.what.toLowerCase(), row.at, row.serviceKind, row.hours, row.price, row.priceId, row.priceStated,
        row.amount, row.date, row.scope, row.carriedBy]);
}
export function mergeLifeSources(target, row) {
    target.sources ||= [];
    for (const source of row.sources || []) if (!target.sources.some(s => s.label === source.label && s.locator === source.locator && s.shard === source.shard)) target.sources.push(source);
}
export function lifePrice(row) {
    if (Number.isFinite(row.amount?.value)) return [row.amount.value, row.amount.unit, row.amount.per].filter(v => v != null && v !== '').join(' ');
    if (row.priceStated === 'stated-free') return 'No charge stated by source';
    return text(row.price) || 'Price not recorded';
}
export function lifePage(rows, {query = '', kind = '', offset = 0, size = 30, names = new Map()} = {}) {
    const q = query.trim().toLowerCase();
    const admitted = rows.filter(publicLifeRow).filter(row => !kind || row.kind === kind).filter(row =>
        [row.what, row.at, names.get(row.at), row.serviceKind, row.hours, row.price, lifePrice(row), row.date, row.carriedBy, names.get(row.carriedBy),
            row.locator, ...(row.sources || []).flatMap(s => [s.locator, s.shard])].some(value => String(value || '').toLowerCase().includes(q)));
    const start = Math.min(Math.max(0, offset), Math.max(0, Math.ceil(admitted.length / size) - 1) * size);
    return {rows: admitted.slice(start, start + size), offset: start, total: admitted.length};
}
