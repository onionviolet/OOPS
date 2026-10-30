// Evidence bundle for one character-sheet lane (L8, WA50): the registry row plus the merged rows that name the person, grouped by volume.
//   node scripts/lead_run/character_bundle.mjs <person-id> [--cap N]
// Writes private/lead-run-2026-10-27/character-sheets/bundles/<slug>.json (gitignored). Rows are text from the private merge; never commit the output.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';

const root = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27';
const merged = join(root, 'm4-whole-book-2026-10-29/merged');
const jsonl = f => readFileSync(join(merged, f), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const volOf = loc => +(/\bb(\d)\b/.exec(loc || '')?.[1] ?? 1);
const FACT = /sequence|pathway|beyonder|rank|pounds|owns?\b|title|identity|persona|alias|disguise|mask|ability|stronger|weaker|defeat|killed|wounded|injur|level|promot|potion|artifact|member|captain|bishop|secretary|leader|wage|debt|bounty|shares|learn|master|skill|cannot|can\b/i;

export function bundle(id, cap = 70) {
    const registry = jsonl('registry.jsonl').find(r => r.id === id);
    if (!registry) throw new Error(`no registry row ${id}`);
    const byVol = {};
    const add = (v, kind, r) => (byVol[v] ??= {about: [], rules: [], person: []})[kind].push(r);
    for (const r of jsonl('extras.jsonl')) {
        const loc = r.locator, v = volOf(loc);
        if (Array.isArray(r.about) && r.about.includes(id) && FACT.test(r.what || '')) add(v, 'about', {what: r.what, label: r.label, loc, about: r.about.filter(a => a !== id)});
        else if (Array.isArray(r.who) && r.who.includes(id)) add(v, 'rules', {id: r.id, kind: r.kind, name: r.name, costs: (r.costs || []).slice(0, 2), label: r.label, loc});
        else if (r.id === id) add(v, 'person', {label: r.label, loc, reveals: r.reveals, wants: r.wants});
    }
    for (const g of Object.values(byVol)) {
        g.counts = {about: g.about.length, rules: g.rules.length, person: g.person.length};
        // spread the cap across the volume in source order so early and late scenes both appear
        const KEEP = /sequence|pathway|promot|advance|digest|acting/i, keep = r => r.kind === 'potion' || KEEP.test(`${r.what || ''} ${r.name || ''}`);
        const thin = (a, n) => { const k = a.filter(keep), rest = a.filter(r => !keep(r)), m = Math.max(n - k.length, 10); return a.length <= n ? a : [...k, ...rest.filter((_, i) => i % Math.ceil(rest.length / m) === 0).slice(0, m)]; };
        g.about = thin(g.about, cap); g.rules = thin(g.rules, Math.ceil(cap / 3)); g.person = thin(g.person, Math.ceil(cap / 5));
    }
    return {id, label: registry.label, zh: registry.zh, aliases: registry.aliases, byVol};
}

if (process.argv[1].endsWith('character_bundle.mjs')) {
    const id = process.argv[2], capIdx = process.argv.indexOf('--cap'), cap = capIdx > 0 ? +process.argv[capIdx + 1] : 70;
    const out = bundle(id, cap), slug = id.split('.').pop(), dir = join(root, 'character-sheets/bundles');
    mkdirSync(dir, {recursive: true});
    writeFileSync(join(dir, `${slug}.json`), JSON.stringify(out));
    console.log(slug, Object.entries(out.byVol).map(([v, g]) => `b${v}:${JSON.stringify(g.counts)}`).join(' '));
}
