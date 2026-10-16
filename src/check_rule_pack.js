// Envelope only: existing module admission, matching and locks stay authoritative.
import {compileRuleModules, createRuleLock} from './rule_modules.js';
import {address, hash64, compareCodePoints} from './gen_kit.js';
import {validateCheckProfile, shape, text, integer} from './check_contract.js';

export function createCheckRulePack(data, moduleOptions) {
    address(data);
    shape(data, ['schema', 'id', 'revision', 'worldId', 'edition', 'profile', 'rulings', 'modules'],
        ['schema', 'id', 'revision', 'worldId', 'edition', 'profile', 'rulings', 'modules']);
    if (data.schema !== 1 || ![data.id, data.worldId, data.edition].every(text) || !integer(data.revision, 1, Number.MAX_SAFE_INTEGER))
        throw TypeError('Invalid check rule pack.');
    const profile = validateCheckProfile(data.profile);
    if (!Array.isArray(data.rulings) || data.rulings.length > 256) throw TypeError('Ruling budget exceeded.');
    const rulings = data.rulings.map(r => {
        shape(r, ['kind', 'id', 'question', 'ruling', 'sourceLocator', 'revision'], ['kind', 'id', 'question', 'ruling', 'sourceLocator', 'revision']);
        if (r.kind !== 'ruling' || ![r.id, r.question, r.ruling, r.sourceLocator].every(text) || !integer(r.revision, 1, Number.MAX_SAFE_INTEGER))
            throw TypeError('Invalid ruling record.');
        return structuredClone(r);
    }).sort((a, b) => compareCodePoints(a.id, b.id));
    if (new Set(rulings.map(r => r.id)).size !== rulings.length) throw TypeError('Duplicate ruling id.');
    if (!Array.isArray(data.modules) || data.modules.some(m => m.scope?.worldId !== data.worldId)) throw TypeError('Rule module world mismatch.');
    const modules = compileRuleModules(data.modules, moduleOptions);
    const moduleLock = createRuleLock(data.modules, moduleOptions);
    const declaration = {schema: 1, id: data.id, revision: data.revision, worldId: data.worldId, edition: data.edition,
        profile, rulings, moduleLock};
    const lock = {...declaration, fingerprint: hash64('check-rule-pack@1', address(declaration))};
    return Object.freeze({lock: () => structuredClone(lock), profile: () => structuredClone(profile),
        rulings: () => structuredClone(rulings), modules});
}

// Original example declaration, not a complete or accepted D&D rules pack.
// Ruling text is paraphrase; a consumer must verify against the named edition.
export const DND_CHECK_PACK_EXAMPLE = {
    schema: 1, id: 'example.dnd.checks', revision: 1, worldId: 'example.dnd', edition: 'SRD 5.2.1',
    profile: {id: 'example.dnd.d20', revision: 1, family: 'sum_target', dice: {count: 1, sides: 20}},
    rulings: [{kind: 'ruling', id: 'example.dnd.advantage', revision: 1,
        question: 'How do advantage and disadvantage sources interact?',
        ruling: 'The presence of both removes either selection benefit, irrespective of source count.',
        sourceLocator: 'D&D SRD 5.2.1, Rules Glossary, Advantage and Disadvantage'}],
    modules: [],
};
