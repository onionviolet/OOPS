// Registers Source Library EPUBs for batch/Luna reading: normalizes chapters (normalize_epub_chapters.py auto), converts to a private EPUB, and adds the book to plans/books.json.
//   node scripts/lead_run/register_sl_books.mjs <spec.json> [--keys a,b] [--min 10]
// spec.json: [{key, world, slug, id: "book-12345", book: 1, title}] (id = the Source Library file name prefix). Text stays under the gitignored docs/research/novels/<slug>/private/.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';

const a = process.argv.slice(2), spec = JSON.parse(readFileSync(a[0], 'utf8'));
const only = (a.includes('--keys') ? a[a.indexOf('--keys') + 1] : '').split(',').filter(Boolean), MIN = +(a.includes('--min') ? a[a.indexOf('--min') + 1] : 10);
const REG = 'docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json', SQL = `${process.env.HOME}/.local/share/source-platform/catalogue.sqlite`;
const EBOOK_CONVERT = process.env.EBOOK_CONVERT || '/Applications/calibre.app/Contents/MacOS/ebook-convert';
const reg = JSON.parse(readFileSync(REG, 'utf8')), report = [];
for (const s of spec) {
    if (only.length && !only.includes(s.key)) continue;
    if (reg.books.some(b => b.key === s.key)) { report.push(`${s.key}: already registered`); continue; }
    const src = execFileSync('sqlite3', [SQL, `select path from locations where managed=1 and path like '%${s.id}-%.epub' limit 1`]).toString().trim();
    if (!src) { report.push(`${s.key}: source ${s.id} not found`); continue; }
    const priv = join('docs/research/novels', s.slug, 'private'), dir = join(priv, 'source'); mkdirSync(dir, {recursive: true});
    const html = join(dir, `${s.key}.html`), epub = join(dir, `${s.key}.epub`);
    const out = execFileSync('python3', ['-I', 'scripts/lead_run/normalize_epub_chapters.py', 'auto', src, html]).toString().trim();
    const n = +out.split(' ')[0];
    if (n < MIN) { report.push(`${s.key}: only ${out}, not registered`); continue; }
    execFileSync(EBOOK_CONVERT, [html, epub, '--chapter-mark', 'none', '--page-breaks-before', '/'], {stdio: 'ignore'});
    reg.books.push({key: s.key, world: s.world, lang: 'en', type: 'html', source: join(process.cwd(), epub), book: s.book || 1, dir: join(priv, 'lead-run-2026-10-30'),
        group: {target: 8000, max: 2}, convertWith: `scripts/lead_run/normalize_epub_chapters.py auto (Source Library ${s.id}, running chapter count 1..N, source number kept as [ch N] when it differs)`, sourceLibraryId: s.id, title: s.title});
    report.push(`${s.key}: ${out}`);
}
writeFileSync(REG, JSON.stringify(reg, null, 1) + '\n');
console.log(report.join('\n'));
