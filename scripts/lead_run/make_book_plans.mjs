// Whole-book batch plans from one registry (plans/books.json, docs/research/BATCH_READING_WORKFLOW.md): prepares size-grouped shards when a book has none, writes one
// plan per pass per book that skips shards already read, and writes one run file per world with true-bound caps (every request at max_tokens).
//   Book types: pdf, epub (numbered members), ncx (`Chapter N:` labels), html (spine blocks split at `Chapter N: Title`), zh-nav (Chinese nav.xhtml), json (browser-captured `NNNN: [title, text]` files, Chinese).
//   node scripts/lead_run/make_book_plans.mjs [--keys hp2,hp3] [--prepare] [--run 2026-10-29] [--ceiling world=usd,...]
// Plans and run files only: nothing is sent. Each run file starts `approval: PENDING` and needs Weibao's go before batch_overnight.mjs runs it.
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync} from 'node:fs';
import {join, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pdfChapters, epubChapterMembers, epubParagraphs, htmlBlocks, epubSpine, blockChapters, BOOK_TAIL, shardTextEn} from './prepare_shard_en.mjs';
import {chapterLinks, volumeRuns, shardText, textChapters} from './prepare_shard.mjs';
import {requestsFromPlan, estimateCost, EXTRA_PASSES, extraFile} from './batch_lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLANS = join(root, 'docs/gm/dispatch/batch-reading-2026-10-27/plans');
const EBOOK_CONVERT = process.env.EBOOK_CONVERT || '/Applications/calibre.app/Contents/MacOS/ebook-convert';
const pad = n => String(n).padStart(3, '0');
const PASSES = ['census', 'scenes', 'rules', 'people', 'texture'];
// Stage A and run c evidence (NOV1_SCHEDULE sections 8-9): English one-chapter shards fit at high effort (about 26,000 output tokens); Chinese 3-chapter
// shards truncate census even at medium, so Chinese census runs at medium on 2-chapter shards. 64,000 everywhere; caps assume all of it.
const SETTINGS = {
    en: {census: {effort: 'high'}, scenes: {effort: 'high', schemaMode: 'prompt'}},
    zh: {census: {effort: 'medium'}, scenes: {effort: 'high', schemaMode: 'prompt'}},
};
// Census gets Haiku 5.5's full 128K output: truncated census replies held 80-86 complete rows in ~20K tokens, the rest went to thinking (2026-10-28).
const settings = (lang, pass) => ({maxTokens: pass === 'census' ? 128000 : 64000, outTokensAssumed: 32000, ...(SETTINGS[lang][pass] || {effort: 'high', schemaMode: 'prompt'})});

/** Consecutive chapters grouped up to `target` size units and `max` chapters; a chapter over the target stands alone. */
export function groupBySize(chapters, size, {target, max}) {
    const out = [];
    let cur = [], sum = 0;
    for (const c of chapters) {
        const s = size(c);
        if (cur.length && (sum + s > target || cur.length >= max)) { out.push(cur); cur = []; sum = 0; }
        cur.push(c); sum += s;
    }
    if (cur.length) out.push(cur);
    return out;
}

/** NCX table of contents -> chapters in order (`Chapter 12: Title` labels; one member per chapter, anchors dropped). */
export function ncxChapterMembers(ncx) {
    const out = [];
    for (const m of ncx.replace(/\s+/g, ' ').matchAll(/<navLabel>\s*<text>\s*Chapter (\d+)\s*:?\s*([^<]*)<\/text>\s*<\/navLabel>\s*<content src="([^"#]+)/g))
        out.push({ch: Number(m[1]), title: m[2].trim(), member: m[3]});
    // A chapter listed twice (an index page) keeps its first member.
    return out.filter((c, i) => out.findIndex(d => d.ch === c.ch) === i);
}

const words = ps => ps.reduce((a, p) => a + (typeof p === 'string' ? p : p.text).split(/\s+/).length, 0);
const unzip = (f, m) => execFileSync('unzip', ['-p', f, m], {maxBuffer: 256 << 20}).toString('utf8');

/**
 * Chapters of a browser-captured book: `b.json` files map `NNNN` to `[title, text]` (ttks.tw captures); `b.txtDir` holds `NNNN.txt` for chapters the captures lack,
 * titled from `b.toc` (a Fanqie catalogue with `realChapterOrder` and `title`). A chapter in a capture wins over the same number in `b.txtDir`.
 */
export function jsonChapters(b) {
    const by = new Map();
    for (const f of b.json || []) for (const [k, v] of Object.entries(JSON.parse(readFileSync(f, 'utf8')))) if (k !== '_meta') by.set(Number(k), {n: Number(k), title: v[0], text: v[1]});
    if (b.txtDir && existsSync(b.txtDir)) {
        const titles = new Map((b.toc ? JSON.parse(readFileSync(b.toc, 'utf8')) : []).map(t => [Number(t.realChapterOrder), t.title]));
        for (const f of readdirSync(b.txtDir).filter(x => /^\d{4}\.txt$/.test(x))) {
            const n = Number(f.slice(0, 4));
            if (!by.has(n)) by.set(n, {n, title: titles.get(n) || '', text: readFileSync(join(b.txtDir, f), 'utf8')});
        }
    }
    return textChapters([...by.values()]);
}

/** Writes the book's shard files (and index files) from its source; returns their names. Read-only on the source. */
function prepare(b, priv) {
    mkdirSync(priv, {recursive: true});
    const written = [];
    if (b.lang === 'zh') {
        let chs;
        if (b.type === 'json') chs = jsonChapters(b);
        else {
            const runs = volumeRuns(chapterLinks(unzip(b.source, b.nav || 'OEBPS/Text/nav.xhtml'), dirname(b.nav || 'OEBPS/Text/nav.xhtml')));
            chs = (runs[b.book - 1] || []).map(l => ({...l, xhtml: unzip(b.source, l.member)}));
        }
        for (const g of groupBySize(chs, c => c.xhtml.replace(/<[^>]+>/g, '').length, b.group)) {
            const {text, index} = shardText(g, {volume: b.book});
            const name = `shard_${b.key}_ch${pad(g[0].n)}-${pad(g.at(-1).n)}.txt`;
            writeFileSync(join(priv, name), text + '\n');
            writeFileSync(join(priv, name.replace(/^shard_/, 'index_').replace(/\.txt$/, '.json')), JSON.stringify(index) + '\n');
            written.push(name);
        }
        return written;
    }
    let chapters;
    if (b.type === 'pdf') {
        const cache = join(priv, 'source_pdftotext.txt');
        if (!existsSync(cache)) execFileSync('pdftotext', [b.source, cache], {maxBuffer: 256 << 20});
        chapters = (pdfChapters(readFileSync(cache, 'utf8'))[b.book] || []).map(c => ({...c, book: b.book}));
    } else if (b.type === 'html') {
        // No usable table of contents (Kindle-style or mixed editions): read the spine in order and split at `Chapter N: Title` blocks.
        const inZip = new Set(execFileSync('unzip', ['-Z1', b.source]).toString().split('\n'));
        const blocks = epubSpine(m => unzip(b.source, m)).filter(m => inZip.has(m)).flatMap(m => htmlBlocks(unzip(b.source, m)));
        chapters = blockChapters(blocks, b.stop ? new RegExp(b.stop, 'i') : BOOK_TAIL).map(c => ({...c, book: b.book}));
    } else {
        const members = b.type === 'ncx' ? ncxChapterMembers(unzip(b.source, b.ncx || 'toc.ncx')) : epubChapterMembers(execFileSync('unzip', ['-Z1', b.source]).toString());
        chapters = members.map(m => ({...m, book: b.book, paragraphs: epubParagraphs(unzip(b.source, m.member))}));
    }
    // `to` ends the book before its back matter (an author's afterword numbered as the last chapter).
    if (b.to) chapters = chapters.filter(c => c.ch <= b.to);
    for (const g of groupBySize(chapters, c => words(c.paragraphs), b.group)) {
        const {text, index} = shardTextEn(g);
        const name = `shard_${b.key}_b${b.book}_ch${pad(g[0].ch)}-${pad(g.at(-1).ch)}.txt`;
        writeFileSync(join(priv, name), text + '\n');
        writeFileSync(join(priv, name.replace(/^shard_/, 'index_').replace(/\.txt$/, '.json')), JSON.stringify(index) + '\n');
        written.push(name);
    }
    return written;
}

/** Shards of one book on disk, in order, with request prefix and beat base (unique across books of a world: book digit, chapter, 01). */
export function bookShards(b, files) {
    const re = new RegExp(`^shard_${b.key}_(?:b\\d+_)?ch(\\d{3,})-(\\d{3,})\\.txt$`);
    return files.map(f => [f, re.exec(f)]).filter(([, m]) => m).map(([f, m]) => ({file: f, first: Number(m[1]), last: Number(m[2])}))
        .sort((x, y) => x.first - y.first)
        .map(s => ({prefix: `${b.key}c${pad(s.first)}`, file: s.file, base: `${b.book > 1 ? b.book : ''}${pad(s.first)}01`, chapters: `${s.first}-${s.last}`}));
}

/** Has this pass already been read for the shard (its output file exists)? Census and scenes write migrated `<prefix>m_*`, passes 3-5 `<prefix>_<key>`. */
export function passDone(pass, prefix, files) {
    if (pass === 'census' || pass === 'scenes') return files.has(`${prefix}m_${pass}.jsonl`);
    return EXTRA_PASSES[pass].some(k => files.has(`${prefix}_${extraFile(pass, k)}.jsonl`));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), flag = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
    const registry = JSON.parse(readFileSync(join(PLANS, 'books.json'), 'utf8'));
    const keys = flag('--keys') ? new Set(flag('--keys').split(',')) : null, tag = flag('--tag');
    const ceilings = Object.fromEntries((flag('--ceiling') || '').split(',').filter(Boolean).map(x => x.split('=')).map(([w, u]) => [w, Number(u)]));
    const byWorld = {}, report = [];
    for (const b of registry.books.filter(x => !keys || keys.has(x.key))) {
        const priv = join(root, b.dir);
        // A source kept in another format (a .mobi) is converted once, into the private folder, with Calibre's ebook-convert; the original is untouched.
        if (!existsSync(b.source) && b.convertFrom && existsSync(b.convertFrom)) { mkdirSync(dirname(b.source), {recursive: true}); execFileSync(EBOOK_CONVERT, [b.convertFrom, b.source], {stdio: 'ignore'}); }
        if (!existsSync(b.source)) { report.push({key: b.key, skipped: 'source missing'}); continue; }
        let files = existsSync(priv) ? readdirSync(priv) : [];
        if (!bookShards(b, files).length) {
            if (!a.includes('--prepare')) { report.push({key: b.key, skipped: 'no shards (run with --prepare)'}); continue; }
            prepare(b, priv); files = readdirSync(priv);
        }
        const shards = bookShards(b, files), have = new Set(files);
        // Names from every book of the world feed the known-names table, so later books reuse earlier ids.
        const worldKeys = registry.books.filter(x => x.world === b.world).map(x => x.key).join('|');
        const glossary = {...(b.wiki ? {wiki: join(root, b.wiki)} : {}), censusDir: priv, censusMatch: b.censusMatch || `^(${worldKeys})c\\d{3,}m_census\\.jsonl$`};
        const row = {key: b.key, shards: shards.length, labels: []};
        // A book with no census read yet gets a one-shard pilot (census and scenes) as its own step, so a format fault costs cents, not a whole pass.
        const fresh = !shards.some(s => passDone('census', s.prefix, have));
        const pilotPrefix = fresh ? shards[0].prefix : null;
        const units = [...(fresh ? ['census', 'scenes'].map(pass => ({pass, step: 'pilot', only: pilotPrefix, suffix: `pilot_${pass}`})) : []),
            ...PASSES.map(pass => ({pass, step: pass, skip: ['census', 'scenes'].includes(pass) ? pilotPrefix : null, suffix: pass}))];
        for (const {pass, step, only, skip, suffix} of units) {
            const todo = shards.filter(s => !passDone(pass, s.prefix, have) && (!only || s.prefix === only) && s.prefix !== skip)
                .map(s => ({prefix: s.prefix, shard: join(priv, s.file), base: s.base, chapters: s.chapters}));
            if (!todo.length) continue;
            // `--tag r2` gives a rerun its own labels and plan files, so the driver does not collect an earlier batch by its receipt.
            const label = `${b.key}-${suffix.replace('_', '-')}${tag ? `-${tag}` : ''}`, plan = {world: b.world, model: 'claude-haiku-5-5', ...settings(b.lang, pass), privateDir: priv, outDir: join(priv, 'batch'), glossary, label, pass, shards: todo};
            const name = `${b.key}_${suffix}${tag ? `_${tag}` : ''}`;
            writeFileSync(join(PLANS, `${name}.json`), JSON.stringify(plan, null, 1) + '\n');
            // True bound: every request at max_tokens. Rounded up to the cent.
            const bound = estimateCost(requestsFromPlan(plan), plan.maxTokens, plan.model);
            const cap = Math.ceil(bound.usdBatch * 100) / 100;
            row.labels.push({label, requests: todo.length, cap, overPromptCap: bound.requestsOverPromptCap || 0});
            (byWorld[b.world] ??= []).push({book: b.key, pass, step, plan: relative(root, join(PLANS, `${name}.json`)), cap, label});
        }
        report.push(row);
    }
    const runName = flag('--run');
    if (runName) for (const [world, labels] of Object.entries(byWorld)) {
        // Pilots first, then pass by pass across the world's books, so measured spend counts before each larger step and a stop rule halts the rest.
        const steps = ['pilot', ...PASSES].map(step => ({name: step, gate: 'stop', labels: labels.filter(l => l.step === step).map(({plan, cap, label}) => ({plan, cap, label}))})).filter(s => s.labels.length);
        const capTotal = Number(steps.flatMap(s => s.labels).reduce((x, l) => x + l.cap, 0).toFixed(2));
        const run = {name: `${runName}-${world}`, approval: 'PENDING: needs Weibao\'s go phrase.', ceilingUsd: ceilings[world] ?? capTotal, capTotal, steps};
        writeFileSync(join(PLANS, `overnight_${runName}-${world}.json`), JSON.stringify(run, null, 1) + '\n');
        report.push({run: run.name, capTotal, ceilingUsd: run.ceilingUsd, labels: steps.flatMap(s => s.labels).length});
    }
    for (const r of report) console.log(JSON.stringify(r));
}
