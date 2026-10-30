// Join character-sheet ability entries to other lanes' stable ids (L8). Adds `ability` (L10 record id, book.lotm.adv.ability.<key>) and `ruleRow` (L4 row id)
// where a merged rule id matches; prints counts only. Idempotent. Sheets stay private.
//   node scripts/lead_run/sheet_joins.mjs
import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const dir = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/character-sheets';
const pack = JSON.parse(readFileSync('private_packs/lotm-advancement/advancement.json', 'utf8'));
// L10 record key -> the merged rule ids it covers (the merge names one ability several ways).
const ALIAS = {flame_jump: ['flame-jump'], paper_substitute: ['paper-doll-substitute', 'paper-substitute'], air_bullet: ['air-bullet'], face_copy: ['face-change', 'faceless-disguise']};
const l10 = new Map();
for (const r of Object.values(pack.rungs)) for (const a of r.abilities) for (const alias of ALIAS[a.key] ?? [a.key.replace(/_/g, '-')]) l10.set(`lotm.ability.${alias}`, `book.lotm.adv.ability.${a.key}`);
const merged = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged/extras.jsonl';
const refOf = loc => { const m = /(?:\bb(\d) )?第(\d+)章/.exec(loc || ''); return m ? `b${m[1] ?? 1}:${m[2]}` : null; };
const rank = ref => { const m = /^b(\d+):(\d+)$/.exec(ref); return m ? m[1] * 1e5 + +m[2] : 0; };
// earliest merged row per (person, rule) for the joined rules: adds the ability to a sheet that lacks it
const earliest = new Map();
for (const line of readFileSync(merged, 'utf8').split('\n')) {
    if (!line.includes('"lotm.ability.') && !line.includes('"lotm.')) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    if (!r.id || !l10.has(r.id) || !Array.isArray(r.who)) continue;
    for (const w of r.who) {
        const k = `${w}|${r.id}`, ref = refOf(r.locator);
        if (ref && (!earliest.has(k) || rank(ref) < rank(earliest.get(k).from))) earliest.set(k, {rule: r.id, from: ref, ev: r.label ?? 'T', loc: r.locator});
    }
}
const src = ['lotm_divination_rows', 'lotm_summons_rows', 'lotm_potion_rule_rows', 'lotm_formula_rows'].map(f => readFileSync(`src/${f}.js`, 'utf8')).join('\n');
const l4 = new Set(src.match(/lotm\.(?:aid|potionrule|div|summon)\.[a-z0-9-]+/g));
// L4 rows cite the merged rule they came from only in prose; the join here is by id only, so a sheet rule matches when its id equals an L4 id.
const counts = {sheets: 0, abilities: 0, l10: 0, l4: 0};
const files = readdirSync(dir).filter(f => f.endsWith('.json')).map(f => join(dir, f));
const rec = join(dir, 'recurring/recurring-sheets.json');
for (const f of files) {
    const s = JSON.parse(readFileSync(f, 'utf8'));
    counts.sheets++;
    for (const [k, e] of earliest) if (k.startsWith(`${s.id}|`) && !(s.abilities ?? []).some(a => a.rule === e.rule)) { (s.abilities ??= []).push({rule: e.rule, conditions: [], costs: [], limits: [], from: e.from, view: 'actual', ev: e.ev, loc: e.loc, added: 'join'}); counts.added = (counts.added ?? 0) + 1; }
    for (const a of s.abilities ?? []) {
        counts.abilities++;
        const rule = typeof a.v === 'string' ? a.v : a.rule ?? a.v?.rule;
        if (rule && l10.has(rule)) { a.ability = l10.get(rule); counts.l10++; }
        if (rule && l4.has(rule)) { a.ruleRow = rule; counts.l4++; }
    }
    writeFileSync(f, JSON.stringify(s, null, 1));
}
console.log(JSON.stringify(counts), existsSync(rec) ? '(recurring sheets carry no abilities)' : '');
