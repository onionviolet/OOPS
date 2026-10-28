// English shard preparation (world profile lane, READINESS_AND_SCOPE X2): writes paragraph-numbered private shard files in the English header form
// `=== Chapter N: Title | book B | pages a-b` with `pM: text` lines, so locators are `en bB cN pM`. Read-only on the source.
//   EPUB (one chapter per numbered member, e.g. Mother of Learning):
//     node scripts/lead_run/prepare_shard_en.mjs --epub <book.epub> --dir <private dir> --prefix mol --per 1 [--from 1 --to 106]
//   PDF (several books, "CHAPTER ONE" restarts each book, e.g. the complete Harry Potter): text via the system `pdftotext`, cached in --dir
//     node scripts/lead_run/prepare_shard_en.mjs --pdf <book.pdf> --book 1 --dir <private dir> --prefix hp1 --per 2
// Prints one JSON line per shard written (file, chapters, paragraphs, characters). Source text stays in --dir (gitignored private folders only).
import {execFileSync} from 'node:child_process';
import {writeFileSync, existsSync, readFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const decode = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'];
const TENS = {twenty: 20, thirty: 30, forty: 40};
/** "THIRTY-SEVEN" -> 37; digits pass through; null when not a number word. */
export function wordNumber(w) {
    const s = String(w).toLowerCase().trim();
    if (/^\d+$/.test(s)) return Number(s);
    if (WORDS.includes(s)) return WORDS.indexOf(s);
    const [t, u] = s.split(/[- ]/);
    if (TENS[t] != null) return TENS[t] + (u ? WORDS.indexOf(u) : 0);
    return null;
}

/** EPUB members named `NNNN_<chapter>_<Title>.xhtml` -> chapters in order (front matter, epilogue and afterword are skipped: no chapter number). */
export function epubChapterMembers(listing) {
    const out = [];
    for (const m of listing.matchAll(/(\S*Text\/\d{4}_(\d+)_([^\s/]+)\.xhtml)/g)) out.push({ch: Number(m[2]), title: m[3].replace(/_/g, ' '), member: m[1]});
    return out.sort((a, b) => a.ch - b.ch);
}

export function epubParagraphs(xhtml) {
    const ps = [...xhtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m => decode(m[1])).filter(Boolean);
    // Some editions repeat the chapter heading as the first paragraph ("Chapter 001Good Morning Brother"); it is not prose.
    return /^Chapter \d+/i.test(ps[0] || '') ? ps.slice(1) : ps;
}

/**
 * pdftotext output (pages split by form feeds) -> books of chapters with paragraphs and their PDF page. A chapter starts at `CHAPTER <number word>`
 * with its title on the next non-blank line; `CHAPTER ONE` starts a new book. A paragraph ends at a blank line or at a short line (under 85% of
 * the usual line width) ending in sentence punctuation; bare page numbers are dropped. Deterministic, so locators are stable for one PDF.
 */
export function pdfChapters(text) {
    const pages = text.split('\f');
    const lens = pages.flatMap(p => p.split('\n')).map(l => l.trim().length).filter(n => n > 20).sort((a, b) => a - b);
    const width = lens.length ? lens[Math.floor(lens.length * 0.75)] : 70;
    const books = [];
    let book = 0, cur = null, para = [], paraPage = 0, wantTitle = false;
    const flush = () => { if (cur && para.length) cur.paragraphs.push({text: para.join(' ').replace(/\s+/g, ' ').trim(), page: paraPage}); para = []; };
    pages.forEach((pg, pi) => {
        for (const raw of pg.split('\n')) {
            const line = raw.trim();
            const head = line.match(/^CHAPTER ([A-Z]+(?:[- ][A-Z]+)?|\d+)$/);
            if (head && wordNumber(head[1]) != null) {
                flush();
                const n = wordNumber(head[1]);
                if (n === 1) { book++; books[book] = []; }
                if (!book) continue;
                cur = {book, ch: n, title: '', startPage: pi + 1, paragraphs: []};
                books[book].push(cur); wantTitle = true; continue;
            }
            if (!cur) continue;
            if (wantTitle) { if (line) { cur.title = line; wantTitle = false; } continue; }
            if (!line) { flush(); continue; }
            if (/^\d{1,4}$/.test(line)) continue;
            if (!para.length) paraPage = pi + 1;
            para.push(line);
            if (line.length < width * 0.85 && /[.!?"'”’)\]…-]$/.test(line)) flush();
        }
    });
    flush();
    // A table of contents also prints CHAPTER ONE…N with no body: drop books without paragraphs and renumber from 1.
    const real = books.filter(b => b && b.some(c => c.paragraphs.length));
    real.forEach((b, i) => b.forEach(c => { c.book = i + 1; }));
    return [null, ...real];
}

/** Shard text in the English header form, and an index of paragraph counts, characters and PDF pages per chapter. */
export function shardTextEn(chapters) {
    const lines = [], index = [];
    for (const c of chapters) {
        const ps = c.paragraphs.map(p => typeof p === 'string' ? {text: p} : p);
        const pages = ps.map(p => p.page).filter(Boolean);
        lines.push(`=== Chapter ${c.ch}: ${c.title} | book ${c.book || 1}${pages.length ? ` | pages ${pages[0]}-${pages.at(-1)}` : c.member ? ` | member ${c.member}` : ''}`,
            ...ps.map((p, i) => `p${i + 1}: ${p.text}`));
        index.push({book: c.book || 1, chapter: c.ch, paragraphs: ps.length, chars: ps.reduce((a, p) => a + p.text.length, 0), ...(pages.length ? {pages: ps.map(p => p.page)} : {member: c.member})});
    }
    return {text: lines.join('\n'), index};
}

const pad = n => String(n).padStart(3, '0');
export function writeShards({chapters, dir, prefix, per}) {
    const out = [];
    for (let i = 0; i < chapters.length; i += per) {
        const group = chapters.slice(i, i + per), b = group[0].book || 1;
        const {text, index} = shardTextEn(group);
        const name = `shard_${prefix}_b${b}_ch${pad(group[0].ch)}-${pad(group.at(-1).ch)}.txt`;
        writeFileSync(join(dir, name), text + '\n');
        writeFileSync(join(dir, name.replace(/^shard_/, 'index_').replace(/\.txt$/, '.json')), JSON.stringify(index) + '\n');
        out.push({file: name, book: b, chapters: `${group[0].ch}-${group.at(-1).ch}`, paragraphs: index.reduce((a, c) => a + c.paragraphs, 0), chars: index.reduce((a, c) => a + c.chars, 0)});
    }
    return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), flag = (n, d = null) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : d; };
    const dir = flag('--dir'), prefix = flag('--prefix'), per = Number(flag('--per', 1)), from = Number(flag('--from', 1)), to = Number(flag('--to', 9999));
    if (!dir || !prefix || (!flag('--epub') && !flag('--pdf'))) { console.error('usage: prepare_shard_en.mjs (--epub f | --pdf f --book B) --dir d --prefix p [--per N] [--from n --to m]'); process.exit(2); }
    mkdirSync(dir, {recursive: true});
    let chapters;
    if (flag('--epub')) {
        const epub = flag('--epub');
        const members = epubChapterMembers(execFileSync('unzip', ['-Z1', epub]).toString());
        chapters = members.filter(m => m.ch >= from && m.ch <= to).map(m => ({...m, book: 1, paragraphs: epubParagraphs(execFileSync('unzip', ['-p', epub, m.member], {maxBuffer: 64 << 20}).toString('utf8'))}));
    } else {
        const cache = join(dir, 'source_pdftotext.txt');
        if (!existsSync(cache)) execFileSync('pdftotext', [flag('--pdf'), cache], {maxBuffer: 256 << 20});
        const books = pdfChapters(readFileSync(cache, 'utf8'));
        chapters = (books[Number(flag('--book', 1))] || []).filter(c => c.ch >= from && c.ch <= to);
    }
    for (const s of writeShards({chapters, dir, prefix, per})) console.log(JSON.stringify(s));
}
