// Development-only projection of the reading registry: what is held, prepared and read.
// Counts and ids only, never source prose or file paths. Aspect counts are keyword
// pointers (the same patterns reading_review.mjs uses), not findings.
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {bookShards} from '../../scripts/lead_run/make_book_plans.mjs';
import {passDone, EXTRA_PASSES, extraFile} from '../../scripts/lead_run/batch_lib.mjs';
import {ASPECTS, READING_LEVELS} from '../../scripts/lead_run/reading_review.mjs';
import {resolveBookSource} from '../../scripts/lead_run/book_source.mjs';
import {readerDirectory} from './reader-directory.mjs';
import {legacyReaderSlices,orphanReaderSlices} from './reader-slices.mjs';
export {readerDirectory} from './reader-directory.mjs';

const root = new URL('../../', import.meta.url);
const PASSES = ['census', 'scenes', 'rules', 'people', 'texture'];
const ASPECT_KEYS = ['rules', 'other', 'people', 'services'];
export const REGISTRY = 'docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json';

// The standard registry names folders relative to the checkout. A mounted copy of those folders can be read in place.

// Same choice as reading_review.mjs: the plain prefix first, then the Luna lane copy.
export function chosenFile(files, prefix, pass, key) {
    for (const p of [prefix, `${prefix}L`]) {
        if (files.has(`${p}_${pass}.partial`)) continue;
        const file = ['census', 'scenes'].includes(pass) ? `${p}m_${pass}.jsonl` : `${p}_${extraFile(pass, key)}.jsonl`;
        if (files.has(file)) return file;
    }
    return null;
}

export function readKey(book, {registry = [book]} = {}) {
    const dir = readerDirectory(book);
    const names = existsSync(dir) ? readdirSync(dir) : [], files = new Set(names), shards = bookShards(book, names);
    const ranges = shards.map(shard => ({
        prefix: shard.prefix,
        chapters: shard.chapters,
        complete: PASSES.filter(pass => passDone(pass, shard.prefix, files)),
    }));
    const passes = Object.fromEntries(PASSES.map(pass => [pass, ranges.filter(r => r.complete.includes(pass)).length]));
    const aspects = Object.fromEntries(Object.keys(ASPECTS).map(a => [a, 0]));
    // File presence is independent of held source and prepared chapter ranges.
    // Historic ownership remains with the directory's existing first registry key.
    const firstOwner = registry.find(candidate=>readerDirectory(candidate)===dir);
    const historic = firstOwner?.key===book.key ? legacyReaderSlices(book,registry,names).slices : [];
    const observed = new Set();
    for(const slice of [...shards,...orphanReaderSlices(book,registry,names,shards),...historic])
        for(const pass of PASSES)for(const kind of pass==='scenes'?['scenes','fills']:EXTRA_PASSES[pass]||[pass])
            for(const prefix of [slice.prefix,slice.prefix+'L']) {
                const stems=['census','scenes'].includes(pass)?[`${prefix}m_${kind}`,`${prefix}_${kind}`]:[`${prefix}_${extraFile(pass,kind)}`];
                for(const stem of stems)if(files.has(stem+'.jsonl'))observed.add(stem+'.jsonl');
            }
    let rows = 0;
    for (const pass of ['rules', 'people', 'texture']) for (const s of shards) for (const key of EXTRA_PASSES[pass] || [pass]) {
        if (!ASPECT_KEYS.includes(key)) continue;
        const file = chosenFile(files, s.prefix, pass, key);
        if (!file) continue;
        for (const line of readFileSync(join(dir, file), 'utf8').split('\n')) {
            if (!line.trim()) continue;
            rows++;
            for (const [a, re] of Object.entries(ASPECTS)) if (re.test(line)) aspects[a]++;
        }
    }
    return {
        key: book.key, world: book.world, lang: book.lang, held: Boolean(resolveBookSource(book)),
        shards: shards.length, passes, complete: shards.length > 0 && PASSES.every(p => passes[p] === shards.length),
        rows, aspects, ranges,
        observedOutputFiles:observed.size, outputOnly:shards.length===0&&observed.size>0,
    };
}

export function registeredBooks() {
    return JSON.parse(readFileSync(new URL(REGISTRY, root), 'utf8')).books;
}

export function readLibrary(books = registeredBooks()) {
    return {passes: PASSES, aspects: Object.keys(ASPECTS), levels: READING_LEVELS, keys: books.map(book=>readKey(book,{registry:books}))};
}

if (import.meta.main) process.stdout.write(JSON.stringify(readLibrary()));
