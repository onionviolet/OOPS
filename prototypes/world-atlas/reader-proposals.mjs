// Authored fills and loose notes are evidence metadata, never source text or private file links.
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
const arr = value => Array.isArray(value) ? value : value ? [value] : [];
export function proposalSafety(shards) {
    const hidden = new Set();
    const walk = value => {
        if (!value || typeof value !== 'object') return;
        if (arr(value.sealed).length) for (const id of [value.id, value.beat]) if (typeof id === 'string') hidden.add(id);
        for (const child of Object.values(value)) if (child && typeof child === 'object') {
            if (Array.isArray(child)) child.forEach(walk); else walk(child);
        }
    };
    walk(shards);
    const safe = value => typeof value === 'string' && ![...hidden].some(id => value.includes(id))
        && !/(?:file:\/\/|[a-z]:[\\/]|(?:^|\s)\/(?:Users|home|tmp|private|var|mnt)\/|https?:\/\/|(?:^|[\\/])private[\\/])/i.test(value);
    const text = value => safe(value) ? value.replace(/\s+/g, ' ').trim() || null : null;
    const strings = value => arr(value).map(text).filter(Boolean);
    return {safe, text, strings, hidden};
}
export function projectReaderFill(row, prefix, safety) {
    if (!row?.id || arr(row.sealed).length || !safety.text(row.id) || !safety.text(row.what)) return null;
    // A proposal about a sealed subject is itself withheld, including indirect provenance links.
    const refs = [row.for, ...arr(row.basis), ...arr(row.respects), row.replaceableBy];
    if (refs.some(value => typeof value === 'string' && [...safety.hidden].some(id => value.includes(id)))) return null;
    return {id: safety.text(row.id), kind: safety.text(row.kind), what: safety.text(row.what),
        for: safety.text(row.for), status: safety.text(row.status), layer: safety.text(row.layer),
        confidence: safety.text(row.confidence), basis: safety.strings(row.basis), respects: safety.strings(row.respects),
        replaceableBy: safety.text(row.replaceableBy), shards: [prefix]};
}
const fillIdentity = row => JSON.stringify(['kind', 'what', 'for', 'status', 'layer', 'confidence', 'basis', 'respects', 'replaceableBy'].map(key => row[key]));
/** One stable fill id, with every materially distinct collected proposal retained. */
export function mergeReaderFill(previous, incoming) {
    const variants = previous.variants || [Object.fromEntries(Object.entries(previous).map(([key, value]) => [key, key === 'shards' ? [...value] : value]))];
    const matching = variants.find(variant => fillIdentity(variant) === fillIdentity(incoming));
    if (matching) matching.shards = [...new Set([...matching.shards, ...incoming.shards])];
    else variants.push(incoming);
    previous.shards = [...new Set([...previous.shards, ...incoming.shards])];
    if (variants.length > 1) previous.variants = variants;
    return previous;
}
export function projectReaderNote(row, pass, prefix, safety) {
    if (!row?.what || arr(row.sealed).length || !safety.text(row.what)
        || arr(row.about).some(id => typeof id === 'string' && safety.hidden.has(id))) return null;
    const locator = typeof row.locator === 'string' && parseLocator(row.locator) ? row.locator.trim() : null;
    return {pass, what: safety.text(row.what), about: safety.strings(row.about), label: safety.text(row.label), locator,
        sources: [{pass, label: safety.text(row.label), locator, shard: prefix}]};
}
