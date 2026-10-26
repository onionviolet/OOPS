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
    if (r.credential) {
        const c = r.credential;
        if (r.kind !== 'document' || !c || !['device_batch', 'operator', 'method'].includes(c.scope) ||
            !Number.isSafeInteger(c.standard) || c.standard < 1 ||
            !['issuer', 'subject', 'sourceCommand', 'conditions'].every(k => typeof c[k] === 'string' && c[k].length))
            throw Error('Unsupported retained Cyoria credential. Preserve this save for its matching reader.');
    }
    return r;
}
export function validateMolLoreRecords(state) {
    const world = state.worlds?.['book.mol.cyoria']?.facts || {};
    if (world[MOL_LORE_PREFIX + 'jigRestored'] != null && typeof world[MOL_LORE_PREFIX + 'jigRestored'] !== 'boolean' ||
        world[MOL_LORE_PREFIX + 'institutionStandard'] != null && ![1, 2].includes(world[MOL_LORE_PREFIX + 'institutionStandard']))
        throw Error('Unsupported actual Cyoria jig or institution state. Preserve this save for its matching reader.');
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
    const lineage = r.copyOf ? ' This copies an earlier source; it is not independent corroboration.' : '';
    const revision = r.supersedes ? ' This revises an earlier account; the earlier account is retained.' : '';
    return `${r.claim} [${r.author}; ${r.edition}; ${r.era}; ${r.language}; ${r.place}. ${r.confidence}]${lineage}${revision} Coverage: ${r.coverage.map(x => `${x.scope}: ${x.status}`).join('; ')}.`;
}
export function readMolLore(state, observerId = 'player') {
    return molLoreEvidence(state, observerId).accounts.map(r => ({id: r.id, at: r.at, text: formatMolLore(r) + credentialText(r), stage: r.stage, basis: r.basis, known: true, observerId, recipientId: observerId}));
}

function credentialText(r) {
    if (!r.credential) return '';
    const c = r.credential;
    const issuer = c.issuer === 'book.mol.ilsa' ? 'Ilsa Zileti' : c.issuer === 'book.mol.nora' ? 'Nora Boole' : 'the stated issuer';
    const scope = {device_batch: 'this device', operator: 'manual operator', method: 'guide methods'}[c.scope];
    return ` Issued at played minute ${r.at}. Issuer: ${issuer}; scope: ${scope}; standard ${c.standard}. ${c.conditions}.`;
}

// An institution evaluates its own papers; this does not resolve material law.
export function evaluateMolCredential(state, account, {ownedLamp = false} = {}) {
    const c = account?.credential;
    const standard = state.worlds?.['book.mol.cyoria']?.facts?.[MOL_LORE_PREFIX + 'institutionStandard'] ?? 1;
    const reasons = [];
    if (!c) return {eligible: false, reasons: ['Present the academy’s dated device record.']};
    if (c.issuer !== 'book.mol.ilsa' || account.basis?.attributedTo !== c.issuer) reasons.push('The allocation needs the academy issuer; a witness account remains separate evidence.');
    if (c.scope !== 'device_batch') reasons.push('This paper covers an operator or method, rather than this device.');
    if (c.standard !== standard) reasons.push('This earlier standard remains on record; the current allocation requires its announced review.');
    const expected = MOL_LORE_PREFIX + 'certify_device_r' + standard;
    if (c.sourceCommand !== expected || state.actors?.player?.completed?.[expected] !== 1 ||
        account.id !== MOL_LORE_PREFIX + 'credential.academy.r' + standard ||
        c.subject !== '{"id":"Cyorian keyed formula lamp"}' || state.actors?.player?.facts?.['book.mol.lampBuilt'] !== true ||
        state.simulation?.claims?.['book.mol.receipt.assemble_lamp']?.status !== 'settled') reasons.push('This device needs its actual original assembly and issued review.');
    if (!ownedLamp) reasons.push('Present the actual owned device; retaining its paper does not establish current custody.');
    return {eligible: !reasons.length, reasons};
}
export function molLoreInstitutionFacts(state, {ownedLamp = false} = {}) {
    const world = state.worlds?.['book.mol.cyoria']?.facts || {};
    const standard = world[MOL_LORE_PREFIX + 'institutionStandard'] ?? 1;
    const account = molLoreEvidence(state).accounts.find(r => r.id === MOL_LORE_PREFIX + 'credential.academy.r' + standard);
    return {'mol.lore.jigWorn': world[MOL_LORE_PREFIX + 'jigRestored'] !== true,
        'mol.lore.institutionStandard': standard,
        'mol.lore.currentDeviceCertificate': evaluateMolCredential(state, account, {ownedLamp}).eligible};
}
