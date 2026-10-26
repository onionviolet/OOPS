// Attributed accounts use distinct existing knowledge keys. This reader owns no
// truth, stock, clock or save slice; the simulation remains their authority.
export const MOL_LORE_PREFIX = 'book.mol.lore.';
const kinds = new Set(['document', 'observation', 'interpretation']);
const coverage = new Set(['missing', 'redacted', 'mistranslated', 'unread', 'superseded', 'observed']);
export function parseMolLore(id, value) {
    const r = JSON.parse(value);
    if (!r || r.id !== id || !id.startsWith(MOL_LORE_PREFIX) || r.schema !== 1 || !kinds.has(r.kind) ||
        !['origin', 'author', 'speaker', 'era', 'edition', 'language', 'place', 'claim', 'confidence'].every(k => typeof r[k] === 'string') ||
        !Array.isArray(r.referents) || !r.referents.every(x => typeof x === 'string') ||
        !Array.isArray(r.coverage) || !r.coverage.every(x => coverage.has(x.status) && typeof x.scope === 'string') ||
        !(r.copyOf === null || typeof r.copyOf === 'string') || !(r.supersedes === null || typeof r.supersedes === 'string')) {
        throw Error('Unsupported retained Cyoria account. Preserve this save for its matching reader.');
    }
    return r;
}
export function validateMolLoreRecords(state) {
    for (const records of Object.values(state.simulation?.knowledge || {})) {
        for (const [id, record] of Object.entries(records)) if (id.startsWith(MOL_LORE_PREFIX)) parseMolLore(id, record.value);
    }
    return true;
}
export function molLoreEvidence(state, observerId = 'player') {
    const accounts = Object.entries(state.simulation?.knowledge?.[observerId] || {})
        .filter(([id]) => id.startsWith(MOL_LORE_PREFIX))
        .map(([id, entry]) => ({...parseMolLore(id, entry.value), at: entry.at, stage: entry.stage, basis: structuredClone(entry.basis || null)}));
    // Roots identify shared provenance, not votes for a claim's truth. Two
    // editions from one author can revise each other without corroboration.
    return {accounts, documentRoots: [...new Set(accounts.filter(r => r.kind === 'document').map(r => r.origin))]};
}
export function formatMolLore(r) {
    const lineage = r.copyOf ? ` Copy of ${r.copyOf}.` : '';
    const revision = r.supersedes ? ` Revises ${r.supersedes}; the earlier account is retained.` : '';
    return `${r.claim} [${r.author}; ${r.edition}; ${r.era}; ${r.language}; ${r.place}. ${r.confidence}]${lineage}${revision} Coverage: ${r.coverage.map(x => `${x.scope}: ${x.status}`).join('; ')}.`;
}
export function readMolLore(state, observerId = 'player') {
    return molLoreEvidence(state, observerId).accounts.map(r => ({id: r.id, at: r.at, text: formatMolLore(r), stage: r.stage, basis: r.basis, known: true, observerId, recipientId: observerId}));
}
