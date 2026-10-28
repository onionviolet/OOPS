// Prepares one reader shard (protocol v2): extracts chapters from a local EPUB into a paragraph-numbered private
// text file, writes a paragraph index, and assembles the brief (template, schema card, known names, candidates).
// The reader then needs one turn of two parallel reads, one write, one lint. Read-only on the source; uses the
// system `unzip`. Usage:
//   node scripts/lead_run/prepare_shard.mjs --epub <book.epub> --nav OEBPS/Text/nav.xhtml --from 25 --to 27
//       --dir <private folder> --prefix s10v --base 1001 [--wiki <wiki.json>]
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const decode = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').trim();

/** Nav links split into volumes: a new volume starts where chapter 1 comes again. Volume V is runs[V - 1]. */
export function volumeRuns(links) {
    const runs = [];
    for (const l of links) { if (!runs.length || (l.n === 1 && runs.at(-1).length)) runs.push([]); runs.at(-1).push(l); }
    return runs;
}

/** Chapter links in reading order with their chapter number from 第N章 titles. */
export function chapterLinks(navXhtml, navDir) {
    const out = [];
    for (const m of navXhtml.matchAll(/href="([^"]+)"[^>]*>([^<]+)</g)) {
        const n = m[2].match(/第(\d+)章/);
        if (n) out.push({n: Number(n[1]), title: m[2].trim(), member: join(navDir, m[1]).replace(/\\/g, '/')});
    }
    return out;
}

const HEADING_ZH = /^第[0-9零〇一二三四五六七八九十百千两]+章\s*/;
/** The mirror's cache notice appended to paragraphs: not prose. */
export const MIRROR_NOTICE = /\s*（由於緩存原因[^）]*）/g;
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Plain-text chapters (`{n, title, text}`, text one paragraph per line) -> the chapter shape `shardText` reads. The title is renumbered `第N章 ...` from `n`
 * (some books print `第一章`), the mirror notice is dropped and a first line that only repeats the title is not prose.
 */
export function textChapters(entries) {
    return entries.map(({n, title, text}) => {
        const rest = String(title || '').replace(HEADING_ZH, '').trim();
        let lines = String(text || '').replace(MIRROR_NOTICE, '').split('\n').map(l => l.trim()).filter(Boolean);
        if (lines[0] && HEADING_ZH.test(lines[0]) && lines[0].replace(HEADING_ZH, '').trim() === rest) lines = lines.slice(1);
        return {n, title: `第${n}章${rest ? ' ' + rest : ''}`, member: `text:${String(n).padStart(4, '0')}`, xhtml: lines.map(l => `<p>${esc(l)}</p>`).join('')};
    }).sort((a, b) => a.n - b.n);
}

/** Paragraph-numbered shard text and an index of paragraph counts and characters per chapter. */
export function shardText(chapters, {volume = 1} = {}) {
    const lines = [], index = [];
    for (const c of chapters) {
        const ps = [...c.xhtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m => decode(m[1])).filter(Boolean);
        // Volumes after the first carry `| book V` so locators become `zh bV 第N章 pM` (chapter numbers restart per volume).
        lines.push(`=== ${c.title}${volume > 1 ? ` | book ${volume}` : ''} | member ${c.member}`, ...ps.map((p, i) => `p${i + 1}: ${p}`));
        index.push({chapter: c.n, member: c.member, paragraphs: ps.length, chars: ps.reduce((a, p) => a + p.length, 0)});
    }
    return {text: lines.join('\n'), index};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    const flag = (name, dflt = null) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
    const epub = flag('--epub'), navPath = flag('--nav', 'OEBPS/Text/nav.xhtml'), from = Number(flag('--from')), to = Number(flag('--to'));
    const dir = flag('--dir'), prefix = flag('--prefix'), base = flag('--base'), wiki = flag('--wiki');
    if (!epub || !dir || !prefix || !base || !Number.isInteger(from) || !Number.isInteger(to)) {
        console.error('usage: prepare_shard.mjs --epub f --from n --to m --dir d --prefix p --base b [--nav path] [--wiki f]');
        process.exit(2);
    }
    const unzip = member => execFileSync('unzip', ['-p', epub, member], {maxBuffer: 64 << 20}).toString('utf8');
    const navDir = dirname(navPath);
    // Volume part markers are not chapters; the first volume's chapter numbers restart in later parts, so take
    // the first run of links only.
    const links = chapterLinks(unzip(navPath), navDir);
    const cut = links.findIndex((l, i) => i > 0 && l.n === 1);
    const firstRun = cut > 0 ? links.slice(0, cut) : links;
    const chosen = firstRun.filter(l => l.n >= from && l.n <= to).map(l => ({...l, xhtml: unzip(l.member)}));
    const {text, index} = shardText(chosen);
    const name = `shard_${prefix}_ch${String(from).padStart(3, '0')}-${String(to).padStart(3, '0')}.txt`;
    const shardPath = join(dir, name);
    writeFileSync(shardPath, text);
    writeFileSync(join(dir, `${prefix}_index.json`), JSON.stringify(index, null, 1) + '\n');
    const here = dirname(fileURLToPath(import.meta.url)), docs = resolve(here, '../../docs/gm/dispatch/protagonist-life-2026-10-27');
    const brief = join(dir, `brief_${prefix}.md`);
    const extra = [...(wiki ? ['--wiki', wiki] : []), '--census', dir, '--prefix', prefix, '--base', base];
    const out = execFileSync('node', [join(here, 'assemble_brief.mjs'), join(docs, 'READER_BRIEF_TEMPLATE.md'),
        join(docs, 'SCHEMA_CARD_1_3.md'), shardPath, brief, ...extra]).toString();
    console.log(JSON.stringify({shard: resolve(shardPath), brief: resolve(brief), chapters: index.length,
        shardChars: index.reduce((a, c) => a + c.chars, 0), ...JSON.parse(out)}));
}
