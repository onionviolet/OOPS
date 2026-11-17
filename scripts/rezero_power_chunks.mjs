// Shared pieces of the Re:Zero power ledger (docs/research/power-catalogues-2026-11-16 PWC1-PWC7): where the
// private source text lives, how it is chunked into locator-bearing evidence, the sha1 held-out split fixed
// before any labeller runs (GKM429), and the vocabularies the label passes and the builder agree on.
// Private inputs sit in the primary checkout (gitignored); only normalised values, locators and speakers are
// committed, never the paraphrases or any book prose.
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';

// REZERO_SRC: a checkout holding the gitignored research folders (a worktree lacks them).
export const SRC = `${(process.env.REZERO_SRC ?? '/Users/weiwei/code/yet-another-idle-rpg').replace(/\/$/, '')}/`;
export const NOVEL = `${SRC}docs/research/novels/rezero/`;
export const PRIV = process.env.REZERO_PRIVATE ? `${process.env.REZERO_PRIVATE.replace(/\/$/, '')}/` : `${SRC}docs/research/power-catalogues-2026-11-16/private/`;
export const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
export const readIf = (path, fallback) => existsSync(path) ? readJson(path) : fallback;

// Frozen before any label pass: a row whose sha1(id) first byte is below 0x33 is held out (about a fifth), the
// split the Gu, Hogwarts and LOTM passes used (GKM429). Held-out rows never reach a prompt that writes a rule.
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;

// Source files, each with its edition tag (SKR1) and the line spans a name pass reads. Edition says which text the
// readers read: LN (Yen On volumes), WN (Witch Cult fan translation) or both. Round 1 read WN arcs 1 and 5-10 plus IFs.
export const SOURCES = [
    {key: 'DD1', file: 'synthesis/DEEP_DIVE_2026-10-10.md', edition: 'WN', span: [31, 155], what: 'round 1 deep dive: rules R1-R23 and the catalogue'},
    {key: 'DD2', file: 'DEEP_DIVE_2026-10-24.md', edition: 'LN+WN', span: [41, 115], what: 'round 2 deep dive: axes, limits and growth routes'},
    {key: 'DD2R', file: 'DEEP_DIVE_2026-10-24.md', edition: 'LN+WN', span: [264, 278], what: 'round 2 rules R24-R34'},
    {key: 'A2', file: 'readers-2026-10-24/digests/ARC2_DIGEST.md', edition: 'LN', span: null, what: 'Arc 2 digest (Yen On Vols 2-3)'},
    {key: 'A3', file: 'readers-2026-10-24/digests/ARC3_DIGEST.md', edition: 'LN', span: null, what: 'Arc 3 digest (Yen On Vols 4-9, WN interludes)'},
    {key: 'A4A', file: 'readers-2026-10-24/digests/ARC4A_DIGEST.md', edition: 'WN', span: null, what: 'Arc 4 digest A (WN phases 1-3)'},
    {key: 'A4B', file: 'readers-2026-10-24/digests/ARC4B_DIGEST.md', edition: 'WN+LN', span: null, what: 'Arc 4 digest B (WN phases 4-6, LN Vol 10)'},
];

export function sourceLines(src) {
    const lines = readFileSync(`${NOVEL}${src.file}`, 'utf8').split('\n');
    const [a, b] = src.span ?? [1, lines.length];
    return lines.slice(a - 1, b).map((text, i) => ({n: a + i, text}));
}

// ~7k-character chunks on line boundaries; each carries a locator `KEY:first-last` into the private file.
export function chunkSource(src, limit = 7000) {
    const out = [];
    let cur = [], size = 0;
    const flush = () => { if (cur.length) out.push({key: src.key, edition: src.edition, locator: `${src.key}:${cur[0].n}-${cur[cur.length - 1].n}`, text: cur.map(l => `[${src.key} l.${l.n}] ${l.text}`).join('\n')}); cur = []; size = 0; };
    for (const l of sourceLines(src)) {
        if (size + l.text.length > limit && cur.length) flush();
        cur.push(l); size += l.text.length + 12;
    }
    flush();
    return out;
}

export const CLASSES = ['authority', 'witch_factor', 'divine_protection', 'spell', 'curse', 'spirit_contract', 'return_by_death', 'other_art'];
export const ATTRIBUTES = ['fire', 'water', 'wind', 'earth', 'yin', 'yang'];
export const SINS = ['sloth', 'greed', 'gluttony', 'wrath', 'lust', 'pride', 'envy', 'vainglory', 'melancholy'];
// Words that would hand a held-out label to the grammar prompt (PWC2). Sin names, their other renderings and the
// attribute words are masked in the evidence a grammar pass sees; the held-out pass sees the unmasked text.
export const SIN_WORDS = /\b(sloth|slothful|idleness|greed|avarice|gluttony|wrath|anger|lust|pride|envy|vainglory|vanity|melancholy|tristitia|sin of [a-z]+)\b/gi;
export const ATTR_WORDS = /\b(fire|flame|flames|ice|water|wind|earth|yin|yang|firestorm)\b/gi;
export const mask = (text, re, token) => text.replace(re, token);
