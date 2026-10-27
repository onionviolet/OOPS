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

/** Chapter links in reading order with their chapter number from 第N章 titles. */
export function chapterLinks(navXhtml, navDir) {
    const out = [];
    for (const m of navXhtml.matchAll(/href="([^"]+)"[^>]*>([^<]+)</g)) {
        const n = m[2].match(/第(\d+)章/);
        if (n) out.push({n: Number(n[1]), title: m[2].trim(), member: join(navDir, m[1]).replace(/\\/g, '/')});
    }
    return out;
}

/** Paragraph-numbered shard text and an index of paragraph counts and characters per chapter. */
export function shardText(chapters) {
    const lines = [], index = [];
    for (const c of chapters) {
        const ps = [...c.xhtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m => decode(m[1])).filter(Boolean);
        lines.push(`=== ${c.title} | member ${c.member}`, ...ps.map((p, i) => `p${i + 1}: ${p}`));
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
