// Truth-only, reader-specific ORIGINAL directional law. Native inventory and
// HP history/transactions own stock, origin, transport and paid process facts.
// This is not a projection: callers must not publish truth-dependent reasons
// for an unobserved material through recommendation or quote UI.
import {validateMaterial, materialTags, deepFreeze} from './craft_materials.js';
import {nativeCatalogue} from './native_material_catalogue.js';

export const NATIVE_HP_ABRASION_LAW = deepFreeze({
    id: 'book.hp.native-abrasion', revision: 1, status: 'ORIGINAL',
    definitionWorld: 'base.frontier', hostWorld: 'book.hp', use: 'cauldron-abrasion',
    catalogue: nativeCatalogue.ref,
    sourceRefs: ['src/items.js:Bonemeal', 'src/native_material_catalogue.js:Bonemeal',
        'docs/gm/dispatch/pc-groups-2026-10-26/connected-making/implementation/I4-evidence/consumer-fit.md'],
});

/** definitionWorld is the governing material-definition family, not birthplace
 * or an observed departure. The host must bind actual current presence/custody,
 * exact native key/count, supported profile and paid carrier/process itself.
 * No inventory, cost, history, RNG, clock or knowledge is mutated here.
 * The selected ORIGINAL law covers one physical use, not canonical HP identity
 * or active power, and does not imply a reverse structural-repair law.
 */
export function assessIngredientWorldFit({definitionWorld, hostWorld, use, material,
    form, carrier, application} = {}) {
    const law = NATIVE_HP_ABRASION_LAW;
    const result = (status, missingMeans = []) => ({
        eligible: status === 'supported', status,
        law: status === 'missing-law' ? null : structuredClone(law),
        missingMeans,
        contribution: status === 'supported' ? 'physical-abrasion' : null,
        canonicalIdentity: 'not-established', activePower: 'not-established',
    });
    if(definitionWorld !== law.definitionWorld || hostWorld !== law.hostWorld || use !== law.use)
        return result('missing-law');
    // Definition errors are content errors, not a discovered impossibility.
    // Validating against the owning catalogue rejects a forged same-name row.
    if(!material) return result('unsupported-material');
    const actual = validateMaterial(nativeCatalogue, material);
    const tags = materialTags(nativeCatalogue, actual);
    // One selected authored alternative. A shared tag alone does not establish
    // that every bone, ash or similarly named substance fits this application.
    if(actual.id !== 'Bonemeal' || !tags.has('bone') || !tags.has('abrasive'))
        return result('unsupported-material');
    const missing = [];
    if(form !== 'powdered') missing.push('powdered-form');
    if(carrier !== 'water-suspension') missing.push('water-suspension');
    if(application !== 'manual-scour') missing.push('manual-scour');
    return result(missing.length ? 'unmet-means' : 'supported', missing);
}
