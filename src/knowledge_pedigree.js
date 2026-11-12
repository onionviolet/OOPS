import {check, natural} from './basics.js';
import {validateKnowledgeBasis} from './causal_situations.js';
import {stableId} from './simulation_ids.js';

// Length-frame the child so dots in either local ID cannot alias another pair.
const childPrefix = child => `pedigree.${child.length}.${child}.`;

// The host writes this through the native knowledge effect. Basis describes
// how the observer learned the claim. It does not certify the relation.
export function pedigreeKnowledgeEffect({observer, child, parent, stage, value, basis}) {
    check([observer, child, parent].every(stableId) && child !== parent, 'Invalid pedigree endpoints.');
    check(['seen', 'interpreted', 'understood'].includes(stage) && typeof value === 'string',
        'Invalid pedigree knowledge.');
    check(basis != null, 'Pedigree knowledge needs a source.');
    validateKnowledgeBasis(basis);
    const {kind, attributedTo, situationId} = basis;
    return {type: 'knowledge', actor: observer, key: `${childPrefix(child)}${kind}.${parent}`,
        stage, value, basis: {kind, attributedTo, situationId}};
}

// authenticate must independently bind the receipt to this observer, child
// and parent. A basis label, stage, or match against hidden parentage is
// insufficient. identityForLocal resolves registered IDs for qualified
// endpoints only. Pass observed to L with a fresh graph for this observer.
export function readPedigree(state, observer, child, {authenticate, identityForLocal} = {}) {
    const accounts = [], observed = new Map();
    const store = (state?.simulation ?? state)?.knowledge;
    if (!stableId(observer) || !stableId(child) || !store || !Object.hasOwn(store, observer)) {
        return {accounts, observed};
    }
    const prefix = childPrefix(child);
    for (const [key, entry] of Object.entries(store[observer])) {
        if (!key.startsWith(prefix) || !entry?.basis) continue;
        const {kind, attributedTo, situationId} = entry.basis;
        if (!['observation', 'instruction', 'recollection', 'inference'].includes(kind)) continue;
        const sourcePrefix = `${prefix}${kind}.`;
        if (!key.startsWith(sourcePrefix)) continue;
        const parent = key.slice(sourcePrefix.length);
        const {stage, value, at, cause} = entry;
        if (!stableId(parent) || parent === child || !stableId(attributedTo) || !stableId(situationId) ||
            !stableId(cause) || !natural(at) || typeof value !== 'string' ||
            !['seen', 'interpreted', 'understood'].includes(stage)) continue;
        const account = {observer, child, parent, stage, value, at, cause, basis: {kind, attributedTo, situationId}};
        accounts.push(account);

        const eligible = (kind === 'observation' && attributedTo === observer) || kind === 'instruction';
        if (!eligible || authenticate?.(structuredClone(account)) !== true) continue;
        const from = observed.get(child) ?? identityForLocal?.(child);
        const to = identityForLocal?.(parent);
        if (!from || !to || from === to) continue;
        observed.set(child, from);
        observed.set(parent, to);
    }
    return {accounts, observed};
}
