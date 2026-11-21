// Development-only projection of the reading registry: what is held, prepared and read.
// Counts and ids only, never source prose or file paths. Aspect counts are keyword
// pointers (the same patterns reading_review.mjs uses), not findings.
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {bookShards} from '../../scripts/lead_run/make_book_plans.mjs';
import {passDone, EXTRA_PASSES, extraFile} from '../../scripts/lead_run/batch_lib.mjs';
import {ASPECTS, READING_LEVELS} from '../../scripts/lead_run/reading_review.mjs';

const root = new URL('../../', import.meta.url);
const PASSES = ['census', 'scenes', 'rules', 'people', 'texture'];
const ASPECT_KEYS = ['rules', 'other', 'people', 'services'];
export const REGISTRY = 'docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json';

// Same choice as reading_review.mjs: the plain prefix first, then the Luna lane copy.
function chosenFile(files, prefix, pass, key) {
    for (const p of [prefix, `${prefix}L`]) {
        if (files.has(`${p}_${pass}.partial`)) continue;
        const file = ['census', 'scenes'].includes(pass) ? `${p}m_${pass}.jsonl` : `${p}_${extraFile(pass, key)}.jsonl`;
        if (files.has(file)) return file;
    }
    return null;
}

export function readKey(book) {
    const dir = new URL(book.dir + '/', root);
    const names = existsSync(dir) ? readdirSync(dir) : [], files = new Set(names), shards = bookShards(book, names);
    const passes = Object.fromEntries(PASSES.map(pass => [pass, shards.filter(s => passDone(pass, s.prefix, files)).length]));
    const aspects = Object.fromEntries(Object.keys(ASPECTS).map(a => [a, 0]));
    let rows = 0;
    for (const pass of ['rules', 'people', 'texture']) for (const s of shards) for (const key of EXTRA_PASSES[pass] || [pass]) {
        if (!ASPECT_KEYS.includes(key)) continue;
        const file = chosenFile(files, s.prefix, pass, key);
        if (!file) continue;
        for (const line of readFileSync(join(dir.pathname, file), 'utf8').split('\n')) {
            if (!line.trim()) continue;
            rows++;
            for (const [a, re] of Object.entries(ASPECTS)) if (re.test(line)) aspects[a]++;
        }
    }
    return {
        key: book.key, world: book.world, lang: book.lang, held: Boolean(book.source && existsSync(book.source)),
        shards: shards.length, passes, complete: shards.length > 0 && PASSES.every(p => passes[p] === shards.length),
        rows, aspects,
    };
}

export function readLibrary() {
    const registry = JSON.parse(readFileSync(new URL(REGISTRY, root), 'utf8'));
    return {passes: PASSES, aspects: Object.keys(ASPECTS), levels: READING_LEVELS, keys: registry.books.map(readKey)};
}

if (import.meta.main) process.stdout.write(JSON.stringify(readLibrary()));
