// Proof grammar for the procedural grammar contract v0 (chat P). A Gu kind from
// rank, path, role and name parts, with the labeller that reads the held review
// index rows. This is a fixture, not the Gu world pack: chat G owns gu_* files
// and adopts or replaces this grammar there (PFP3, PFP4).
import {defineGrammar} from '../../../src/procedural_grammar.js';

const PATH = / Path$/, ROLE = / Type Gu$/;
const words = name => name.replace(/\s+/g, ' ').trim().split(' ');

// Labeller (MC14 starts here). Name parts come from the catalogue name; rank,
// path and role from the wiki categories, falling back to the Saga rank.
export function labelGuRow(row) {
    const missing = [];
    const name = row.name ?? '';
    const ranks = row.fandomRanks?.length ? row.fandomRanks : Number.isInteger(row.sagaRank) ? [row.sagaRank] : [];
    const paths = (row.categories ?? []).filter(c => PATH.test(c) && c !== 'Unknown Path').map(c => c.replace(PATH, '').toLowerCase());
    const roles = (row.categories ?? []).filter(c => ROLE.test(c)).map(c => c.replace(ROLE, '').toLowerCase());
    if (!name) missing.push('name');
    if (!ranks.length) missing.push('rank');
    if (!paths.length) missing.push('path');
    if (!roles.length) missing.push('role');
    if (missing.length) return {missing};
    let tokens = words(name);
    if (tokens.at(-1) === 'Gu') tokens = tokens.slice(0, -1);
    if (tokens.at(-1) === 'Immortal') tokens = tokens.slice(0, -1);
    if (!tokens.length) return {missing: ['name-head']};
    // v2 parts read the surface habits v1 derived: a trailing "Gu" and an "Immortal" title.
    const all = words(name), suffix = all.at(-1) === 'Gu' ? 'gu' : 'none';
    const title = (suffix === 'gu' ? all.at(-2) : all.at(-1)) === 'Immortal' && tokens.length < all.length - (suffix === 'gu' ? 1 : 0) ? 'immortal' : 'none';
    return {parts: {rank: ranks, path: paths, role: roles, head: tokens.at(-1), marks: tokens.slice(0, -1), title, suffix}, truth: {name}};
}

// Revision 1: the naive first grammar, kept as the canon test baseline.
export const guKindGrammar = defineGrammar({
    id: 'proof.gu-kind', revision: 1,
    slots: [
        {id: 'rank', type: 'set', values: [1, 2, 3, 4, 5, 6, 7, 8, 9], min: 1},
        {id: 'path', type: 'set', values: 'corpus', min: 1},
        {id: 'role', type: 'set', values: 'corpus', min: 1},
        {id: 'head', type: 'one', open: true, given: 'role'},
        {id: 'marks', type: 'tokens', open: true, given: 'path', min: 0},
    ],
    rules: [
        {id: 'rank-band', kind: 'derive', reads: ['rank'],
            default: 'Ranks one to five are mortal, six to nine Immortal.',
            reason: 'Essence and naming change at the Immortal threshold.',
            run: ({parts}) => ({band: parts.rank.every(r => r <= 5) ? 'mortal' : parts.rank.every(r => r >= 6) ? 'immortal' : 'mixed'})},
        {id: 'band-coherent', kind: 'check', reads: ['rank'], severity: 'reject',
            default: 'One kind sits on one side of the Immortal threshold.', dial: 'allowMixedBand',
            reason: 'A mortal line and its Immortal counterpart are refined separately and named apart.',
            run: ({derived, dials}) => derived.band === 'mixed' && !dials.allowMixedBand ? {reason: 'ranks span mortal and Immortal'} : null},
        {id: 'immortal-title', kind: 'derive', reads: ['marks', 'head', 'rank'],
            default: 'An Immortal kind carries "Immortal" before "Gu"; a mortal kind does not.',
            reason: 'The source names the tier in the kind name.',
            run: ({parts, derived}) => ({name: [...parts.marks, parts.head, ...(derived.band === 'immortal' ? ['Immortal'] : []), 'Gu'].join(' ')})},
    ],
    fallback: {id: 'proof.gu-kind.fallback', parts: {rank: [1], path: ['strength'], role: ['support'], head: 'Strength', marks: []}},
});

// The world's declared lists (the source names its paths and Gu types). v1
// learned them from the training folds; v2 takes them as world data.
export const GU_PATHS = ['blade', 'blood', 'bone', 'cloud', 'dark', 'dream', 'earth', 'emotion', 'enchantment', 'enslavement', 'fire', 'food',
    'formation', 'heaven', 'human', 'ice', 'information', 'killing', 'light', 'lightning', 'luck', 'metal', 'moon', 'phantom', 'pill', 'poison',
    'qi', 'refinement', 'restriction', 'rule', 'snow', 'soul', 'sound', 'space', 'star', 'strength', 'sword', 'theft', 'time', 'transformation',
    'water', 'wind', 'wisdom', 'wood'];
export const GU_ROLES = ['amplification', 'concealment', 'consumable & expendable', 'defensive', 'flying', 'grass', 'healing', 'house',
    'investigative', 'movement', 'offensive', 'steed', 'storage', 'support'];

// Revision 2: the rules v1's canon test asked for (contract doc, "Proof run").
// GKG1 a kind is a line that may cross the Immortal threshold; GKG2 the
// "Immortal" title is a naming part weighted by band, not derived from rank;
// GKG3 the "Gu" suffix is a naming part (Liquor Worm, the Lotus line).
export const guKindGrammarV2 = defineGrammar({
    id: 'proof.gu-kind', revision: 2,
    slots: [
        {id: 'rank', type: 'set', values: [1, 2, 3, 4, 5, 6, 7, 8, 9], min: 1},
        {id: 'path', type: 'set', values: GU_PATHS, min: 1},
        {id: 'role', type: 'set', values: GU_ROLES, min: 1},
        {id: 'head', type: 'one', open: true, given: 'role'},
        {id: 'marks', type: 'tokens', open: true, given: 'path', min: 0},
        {id: 'title', type: 'one', values: ['immortal', 'none'], given: 'rank'},
        {id: 'suffix', type: 'one', values: ['gu', 'none']},
    ],
    dials: {allowMixedBand: true},
    rules: [
        {id: 'rank-band', kind: 'derive', reads: ['rank'], default: 'Ranks one to five are mortal, six to nine Immortal; a line may span both.',
            reason: 'Essence changes at the threshold; eleven held kinds span it (GKG1).',
            run: ({parts}) => ({band: parts.rank.every(r => r <= 5) ? 'mortal' : parts.rank.every(r => r >= 6) ? 'immortal' : 'mixed'})},
        {id: 'mortal-untitled', kind: 'check', reads: ['title', 'rank'], severity: 'flag',
            default: 'A kind with no Immortal rank carries no Immortal title; allowed and flagged.',
            reason: 'Catalogue names drop the title often; adding one below rank six would mislead (GKG2).',
            run: ({parts, derived}) => parts.title === 'immortal' && derived.band === 'mortal' ? {reason: 'Immortal title on a mortal kind'} : null},
        {id: 'kind-name', kind: 'derive', reads: ['marks', 'head', 'title', 'suffix'], default: 'Name parts read in order: marks, head, title, suffix.',
            reason: 'The source builds kind names from what the Gu is or does, then the tier, then "Gu" (NMR5).',
            run: ({parts}) => ({name: [...parts.marks, parts.head, ...(parts.title === 'immortal' ? ['Immortal'] : []), ...(parts.suffix === 'gu' ? ['Gu'] : [])].join(' ')})},
    ],
    fallback: {id: 'proof.gu-kind.fallback', parts: {rank: [1], path: ['strength'], role: ['support'], head: 'Strength', marks: [], title: 'none', suffix: 'gu'}},
});

// A mismatch names its cause, so the report reads as missing rules.
export function compareGuKind(value, truth) {
    const got = value.derived.name;
    if (got === truth.name) return [];
    const cause = !truth.name.endsWith(' Gu') ? 'canon name has no Gu suffix'
        : / Immortal Gu$/.test(truth.name) ? 'canon title present, band not immortal' : 'immortal band, canon name untitled';
    return [{field: 'name', rule: value.grammar.endsWith('@1') ? 'immortal-title' : 'kind-name', cause, expected: truth.name, got}];
}
export const guKindIdentity = value => value.derived.name;

// Revision 3 (GL1 with GL5): the substance slots are chained so generated kinds
// keep the source's combinations. Path given rank, role jointly given path and
// rank, head given role, marks given path. Revision 2's rules and naming parts
// are unchanged; only the weights' conditioning differs.
export const guKindGrammarV3 = defineGrammar({
    ...guKindGrammarV2.spec, revision: 3,
    slots: guKindGrammarV2.spec.slots.map(s => s.id === 'path' ? {...s, given: 'rank'} : s.id === 'role' ? {...s, given: ['path', 'rank']} : s),
});
