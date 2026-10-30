// Recurring-tier character sheets by script (L8, WA43/WA50): identity, power, derived bands and routine only. No model reads the source.
//   node scripts/lead_run/recurring_sheets.mjs [--min-rows N]
// Reads the whole-book merge; writes private/lead-run-2026-10-27/character-sheets/recurring/recurring-sheets.json (gitignored) and prints counts.
// Bands here are derived from a stated Sequence level (ev "I") and have no outcome entries; a cited outcome is added by a later Luna pass where a band needs one.
import {readFileSync, writeFileSync, mkdirSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const root = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27', merged = join(root, 'm4-whole-book-2026-10-29/merged');
const jsonl = f => readFileSync(join(merged, f), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const refOf = loc => { const m = /(?:\bb(\d) )?第(\d+)章/.exec(loc || ''); return m ? `b${m[1] ?? 1}:${m[2]}` : null; };
const rank = ref => { const m = /^b(\d+):(\d+)$/.exec(ref); return m ? m[1] * 1e5 + +m[2] : 0; };
// Sequence level -> might/mind band, a coarse ladder (9 = ordinary Beyonder). Derived, ev "I".
export const bandForSequence = seq => Math.min(9, Math.max(1, 11 - seq));

const minIdx = process.argv.indexOf('--min-rows'), minRows = minIdx > 0 ? +process.argv[minIdx + 1] : 12;
const sheetsDir = join(root, 'character-sheets');
const principals = new Set(readdirSync(sheetsDir).filter(f => f.endsWith('.json')).map(f => `lotm.person.${f.slice(0, -5)}`));
const registry = jsonl('registry.jsonl').filter(r => r.kind === 'person' && r.rows >= minRows && !principals.has(r.id));
const want = new Map(registry.map(r => [r.id, {reg: r, power: [], routine: []}]));
for (const r of jsonl('extras.jsonl')) {
    if (r.id && want.has(r.id) && Array.isArray(r.routine)) want.get(r.id).routine.push(...r.routine.map(x => ({...x, loc: x.locator || r.locator})));
    else if (Array.isArray(r.about) && r.what) {
        const people = r.about.filter(a => a.startsWith('lotm.person.'));
        const m = /Sequence (\d)\b/.exec(r.what);
        if (people.length === 1 && m && want.has(people[0])) want.get(people[0]).power.push({seq: +m[1], what: r.what, label: r.label, loc: r.locator});
    }
}
const sheets = {};
for (const [id, {reg, power, routine}] of want) {
    const first = refOf(reg.firstMention) ?? 'b1:1', ent = (v, from, loc, ev = 'S', extra = {}) => ({v, from, view: 'actual', ev, loc, ...extra});
    const names = [reg.label, ...(reg.aliases ?? []).filter(a => /^[\x20-\x7e]+$/.test(a) && a !== reg.label)].slice(0, 12);
    // power: one entry per distinct level in source order; each closes the previous one
    const ordered = power.map(p => ({...p, from: refOf(p.loc)})).filter(p => p.from).sort((a, b) => rank(a.from) - rank(b.from));
    const levels = ordered.filter((p, i) => i === 0 || p.seq !== ordered[i - 1].seq).filter((p, i, a) => i === 0 || p.from !== a[i - 1].from);   // one level per chapter
    const powerEntries = levels.map((p, i) => ent({level: `Sequence ${p.seq}`}, p.from, p.loc, p.label === 'S' ? 'T' : 'I', levels[i + 1] ? {to: levels[i + 1].from} : {}));
    const stats = levels.flatMap((p, i) => ['might', 'mind'].map(axis => ent({axis, band: bandForSequence(p.seq), derived: 'sequence'}, p.from, p.loc, 'I', levels[i + 1] ? {to: levels[i + 1].from} : {})));
    sheets[id] = {
        id, slug: id.split('.').pop(), tier: 'recurring', personaIds: [],
        identities: names.map((name, i) => ent({name, kind: i === 0 ? 'legal' : 'alias'}, first, reg.firstMention ?? '', 'S')),
        power: powerEntries, stats,
        routine: routine.slice(0, 24).map(x => ent({place: x.place, days: x.days, from: x.from, what: x.what}, refOf(x.loc) ?? first, x.loc, x.label ?? 'T')),
    };
}
mkdirSync(join(sheetsDir, 'recurring'), {recursive: true});
writeFileSync(join(sheetsDir, 'recurring/recurring-sheets.json'), JSON.stringify(sheets));
const all = Object.values(sheets);
console.log(`recurring sheets: ${all.length}; with power: ${all.filter(s => s.power.length).length}; with routine: ${all.filter(s => s.routine.length).length}; min rows ${minRows}`);
