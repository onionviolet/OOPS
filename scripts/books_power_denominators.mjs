#!/usr/bin/env node
// Denominators for the four book power ledgers (docs/research/power-catalogues-2026-11-16, PWC3): names come from data, never
// from a model. Reads gitignored folders at absolute paths, so only `refresh` in books_power_ledger.mjs runs it.
//   ss   Shadow Slave        paid claims `ss*_rules.jsonl` (ability, spell records, chapters 1-3000) + dossier files
//   rt   Regressor's Tale    paid claims `rtoc*_rules.jsonl` (ability, spell, reset, curse, formation, method records)
//   orv  Omniscient Reader   reader tables (Stigmas, Constellation modifiers) + a curated skill list checked against the claims
//   sl   Solo Leveling       curated list of named skills, titles, class, shadows and relics checked against the claims
import {readFileSync, readdirSync, existsSync} from 'node:fs';

export const PRIMARY = '/Users/weiwei/code/yet-another-idle-rpg/';
const NOVELS = `${PRIMARY}docs/research/novels/`;
const FULL = `${NOVELS}full-book/`;
const slug = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const norm = s => s.toLowerCase().replace(/[’']/g, "'").replace(/[“”"]/g, '').replace(/\s+/g, ' ').replace(/[.:;,!?\s]+$/, '').trim();
const jsonl = path => readFileSync(path, 'utf8').split('\n').filter(Boolean).flatMap(l => { try { return [JSON.parse(l)]; } catch { return []; } });
const clip = (t, n = 380) => String(t ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

// ---- Paid-claims books (ss, rt) ---------------------------------------------------------------------------------------
const PAID = {
    ss: {dir: `${NOVELS}shadow-slave/private/lead-run-2026-10-28/`, file: /^ss\d*c\d+_rules\.jsonl$/, kinds: ['ability', 'spell'], prefix: 'ss',
        run: 'ss paid claims 2026-11-01-ss (chapters 1-3000)',
        // Reader-assigned kinds that make a single mention enough (an Aspect or a Flaw is one person's named power).
        single: /aspect|flaw|memory|echo|true name|attribute|stigma|nightmare spell|sorcery|transformation/i},
    rt: {dir: `${NOVELS}regressors-tale/private/lead-run-2026-10-29/`, file: /^rtocc\d+L?_rules\.jsonl$/, kinds: ['ability', 'spell', 'reset', 'curse', 'formation', 'cultivation method'], prefix: 'rt',
        run: 'rtoc paid claims 2026-11-01-rtoc (chapters 0-639)', single: /regression|realm authority|dharma treasure|immortal art|mantra|formation/i}};
// Names that are a kind of thing, not a power.
const STOP = new Set(['', 'ability', 'abilities', 'aspect', 'aspects', 'spell', 'spells', 'flaw', 'flaws', 'attribute', 'attributes', 'memory', 'memories', 'echo', 'echoes',
    'enchantment', 'technique', 'martial arts', 'cultivation', 'cultivation method', 'skill', 'skills', 'power', 'powers', 'unknown', 'curse', 'formation', 'trait', 'fated']);

// A name that is only kind words and a parenthetical ("Aspect Ability (Effie)", "Ascended Ability") names no power.
const KIND_WORDS = /\b(aspects?|abilit(?:y|ies)|ascended|awakened|dormant|transcendent|supreme|sacred|divine|innate|legacy|evolution|direct-damage|nightmare|spells?|memory|memories|echoes|echo|flaws?|true|names?|attributes?|borrowed|unique|the|a|of|for|from|via|and)\b/g;
export const isGeneric = name => !name.replace(/\([^)]*\)/g, ' ').replace(KIND_WORDS, ' ').replace(/[^a-z0-9]+/gi, ' ').trim();
function chapterOf(loc) { const m = /\bc(\d+)\b/.exec(loc ?? ''); return m ? Number(m[1]) : null; }
const tagOf = x => (typeof x === 'object' ? x.label : null) ?? null;
function evidenceOf(rec, fallbackTag) {
    const out = [];
    const push = (loc, text, tag, kind) => { const t = clip(text); if (t) out.push({loc: loc || rec.locator || '', tag: tag ?? fallbackTag ?? 'U', text: kind ? `${kind}: ${t}` : t}); };
    for (const s of rec.steps ?? []) push(s.locator, s.what, s.label, 'step');
    for (const s of rec.results ?? []) push(s.locator, `${s.when ? `${s.when}: ` : ''}${s.what}`, s.label, 'result');
    for (const s of rec.costs ?? []) push(s.locator, typeof s === 'string' ? s : s.what ?? s.item ?? JSON.stringify(s), tagOf(s), 'cost');
    for (const s of rec.products ?? []) push(s.locator, s.item, s.label, 'product');
    for (const s of rec.conditions ?? []) push(rec.locator, s, rec.label, 'condition');
    for (const s of rec.limits ?? []) push(rec.locator, s, rec.label, 'limit');
    for (const s of rec.consequences ?? []) push(rec.locator, typeof s === 'string' ? s : s.what ?? '', rec.label, 'consequence');
    if (rec.acquire) push(rec.locator, typeof rec.acquire === 'string' ? rec.acquire : JSON.stringify(rec.acquire), rec.label, 'acquire');
    if (rec.reset) push(rec.reset.locator ?? rec.locator, `trigger ${rec.reset.trigger}; keeps ${(rec.reset.keeps ?? []).join(', ')}; resets ${(rec.reset.resets ?? []).join(', ')}; ends ${rec.reset.ends}`, rec.reset.label, 'reset');
    return out;
}

function paid(book) {
    const cfg = PAID[book];
    const groups = new Map();
    for (const f of readdirSync(cfg.dir).filter(f => cfg.file.test(f)).sort()) for (const r of jsonl(`${cfg.dir}${f}`)) {
        if (!cfg.kinds.includes(r.kind) || !r.name) continue;
        const key = norm(r.name.replace(/\([^)]*\)/g, ' ')) || norm(r.name); // "Cassie's Flaw (blindness)" and "Cassie's Flaw" are one row
        if (STOP.has(key) || isGeneric(key)) continue;
        const g = groups.get(key) ?? {key, names: new Map(), recs: [], chapters: new Set(), worldKinds: new Map()};
        g.names.set(r.name, (g.names.get(r.name) ?? 0) + 1);
        g.recs.push(r);
        const c = chapterOf(r.locator); if (c !== null) g.chapters.add(c);
        const wk = norm((r.worldKind ?? '').replace(/\(.*$/, ''));
        if (wk) g.worldKinds.set(wk, (g.worldKinds.get(wk) ?? 0) + 1);
        groups.set(key, g);
    }
    const entities = [];
    for (const g of groups.values()) {
        const wk = [...g.worldKinds.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);
        const named = wk.some(w => cfg.single.test(w));
        if (g.chapters.size < 2 && g.recs.length < 3 && !named) continue; // one mention in a mundane kind is not a named power
        const name = [...g.names.entries()].sort((a, b) => b[1] - a[1])[0][0];
        const lines = []; const seen = new Set();
        for (const r of g.recs) for (const l of evidenceOf(r, r.label)) { const k = `${l.loc}|${l.text}`; if (!seen.has(k)) { seen.add(k); lines.push(l); } }
        entities.push({key: `${cfg.prefix}.power.${slug(g.key)}`, name, category: g.recs[0].kind, nameSource: [cfg.run], mentions: g.recs.length, chapters: g.chapters.size, worldKinds: wk,
            holders: [...new Set(g.recs.flatMap(r => r.who ?? []))].slice(0, 6), evidence: lines.slice(0, 40)});
    }
    return entities.sort((a, b) => a.key.localeCompare(b.key));
}

// ---- Text-source books (orv, sl): evidence is every line of the dossier files that names the thing ------------------------
function sourceLines(files) {
    const all = [];
    for (const f of files) {
        if (!existsSync(f.path)) continue;
        if (f.claims) for (const r of jsonl(f.path)) {
            const loc = typeof r.locator === 'string' ? r.locator : (r.locator?.chapters ? `ch${r.locator.chapters.join(',')}` : '');
            const text = `${r.subject ?? ''}: ${typeof r.value === 'object' ? JSON.stringify(r.value) : r.value ?? ''}${r.condition ? ` (${typeof r.condition === 'object' ? JSON.stringify(r.condition) : r.condition})` : ''}${r.caveat ? `; ${r.caveat}` : ''}`;
            all.push({loc: `${f.key}:${r.id}${loc ? ` ${loc}` : ''}`, tag: r.label ?? 'U', text: clip(text), hay: text.toLowerCase()});
        } else readFileSync(f.path, 'utf8').split('\n').forEach((line, i) => {
            if (line.length < 12 || /^\s*\|?\s*-{3,}/.test(line)) return;
            const tag = /\bSHOWN\b/.test(line) ? 'S' : /\bSTATED\b/.test(line) ? 'T' : /\bINFERRED\b/.test(line) ? 'I' : 'U';
            all.push({loc: `${f.key}:${i + 1}`, tag, text: clip(line.replace(/^[\s|#*>-]+/, '').replace(/\s*\|\s*/g, '; ')), hay: line.toLowerCase()});
        });
    }
    return all;
}
const find = (lines, aliases, cap = 40) => {
    const needles = aliases.map(a => a.toLowerCase().replace(/[’]/g, "'"));
    const hits = lines.filter(l => needles.some(n => l.hay.replace(/[’]/g, "'").includes(n)));
    return hits.slice(0, cap).map(({loc, tag, text}) => ({loc, tag, text}));
};

const ORV_FILES = [
    {key: 'ORV-CNS', path: `${NOVELS}omniscient-reader/readers-2026-10-10/CONSTELLATIONS_NEBULAS_STIGMAS.md`},
    {key: 'ORV-ECON', path: `${NOVELS}omniscient-reader/readers-2026-10-10/ECONOMY_STORIES_PROBABILITY.md`},
    {key: 'ORV-RULES', path: `${FULL}omniscient-reader/POWER_RULES.md`},
    {key: 'ORV-DETAIL', path: `${FULL}omniscient-reader/POWER_DETAIL_LEDGER.md`},
    {key: 'ORV-PEOPLE', path: `${FULL}omniscient-reader/PEOPLE_AND_ALIASES.md`},
    {key: 'ORV-SCEN', path: `${NOVELS}omniscient-reader/readers-2026-10-10/SCENARIOS.md`},
    {key: 'ORV-CLAIMS', path: `${FULL}omniscient-reader/engine_inputs/claims.jsonl`, claims: true}];
const ORV_SKILLS = {
    'Omniscient Reader’s Viewpoint': ['omniscient reader’s viewpoint skill', 'omniscient reader\'s viewpoint skill', 'viewpoint'],
    Bookmark: ['bookmark'], Electrification: ['electrification'], 'Ancient Magic Power Barrier': ['ancient magic power barrier'], Taming: ['taming'],
    Incite: ['incite'], 'Non-Violent Zone': ['non-violent zone'], 'Giant Body Transformation': ['giant body transformation'], Miniaturization: ['miniaturization'],
    'Mirror Eyes': ['mirror eyes'], 'Mental Barrier': ['mental barrier'], 'Diverse Communication': ['diverse communication'], '108 Worries': ['108 worries'],
    'Way of Wind': ['way of wind'], 'Instant Kill': ['instant kill'], 'Ellain Forest Vital Force': ['ellain forest vital force'], 'Blackening': ['blackening'],
    'Replica Mjolnir': ['replica mjolnir'], 'Character List': ['character list'], 'Bounty and story shop': ['story box', 'story shop'], 'Eight Lives': ['eight lives']};

function orv() {
    const lines = sourceLines(ORV_FILES);
    const text = readFileSync(ORV_FILES[0].path, 'utf8').split('\n');
    const rows = h => { const i = text.findIndex(l => l.startsWith(h)); const out = []; for (let j = i + 1; j < text.length && !text[j].startsWith('## '); j++) if (/^\|/.test(text[j]) && !/^\|\s*-/.test(text[j])) out.push(text[j].split('|').slice(1, -1).map(c => c.trim())); return out.slice(1); };
    const entities = [];
    const add = e => { if (!entities.some(x => x.key === e.key)) entities.push(e); };
    for (const [stigma, owner, level] of rows('## 4. Stigma table')) {
        const names = stigma.includes(';') ? stigma.split(';') : stigma.split(',').length > 1 && !/\bor\b|and/.test(stigma) ? stigma.split(',') : [stigma];
        for (let n of names) {
            n = n.trim(); if (!n || /^others?$/i.test(n)) continue;
            const aliases = n.split(' / ').map(s => s.trim()).filter(s => s.length > 3);
            add({key: `orv.power.stigma-${slug(aliases[0])}`, name: aliases.join(' / '), category: 'stigma', nameSource: ['readers CONSTELLATIONS_NEBULAS_STIGMAS table 4'], holders: owner.split(',').map(s => s.trim()),
                stated: names.length === 1 && level && level !== 'n/a' ? {kind: 'stigma-level', value: level, locator: 'ORV-CNS table 4'} : null, evidence: find(lines, aliases)});
        }
    }
    for (const [modifier, , grade] of rows('## 2. Constellation table').length ? rows('## 2. Constellation table').map(r => [r[0], '', r[2]]) : []) {
        for (const n of modifier.split(/;|\//).map(s => s.trim()).filter(s => s.length > 3 && !/^other\b|^low animals/i.test(s)))
            add({key: `orv.power.sponsor-${slug(n)}`, name: `Sponsorship by ${n}`, category: 'constellation-sponsorship', nameSource: ['readers CONSTELLATIONS_NEBULAS_STIGMAS table 2'], holders: [],
                stated: grade ? {kind: 'constellation-grade', value: clip(grade, 80), locator: 'ORV-CNS table 2'} : null, evidence: find(lines, [n])});
    }
    for (const [name, aliases] of Object.entries(ORV_SKILLS)) add({key: `orv.power.skill-${slug(name)}`, name, category: 'skill', nameSource: ['curated from engine_inputs claims subjects'], holders: [], stated: null, evidence: find(lines, aliases)});
    return entities.filter(e => e.evidence.length > 0);
}

const SL_FILES = [
    {key: 'SL-CLAIMS', path: `${FULL}solo-leveling/engine_inputs/claims.jsonl`, claims: true},
    {key: 'SL-FINDINGS', path: `${FULL}solo-leveling/DETAILED_FINDINGS.md`},
    {key: 'SL-TAXONOMY', path: `${FULL}solo-leveling/TAXONOMY.md`},
    {key: 'SL-WIKI', path: `${NOVELS}solo-leveling/readers-2026-10-10/M4_WIKI_CROSSCHECK.md`}];
// Curated: the claims subjects are events ("unlock", "result"), so each named power lists the words that name it in the text.
// Merges (translator names for one skill) are recorded in the sidecar.
export const SL_POWERS = [
    ['Sprint', 'skill', ['sprint', 'celerity']], ['Unyielding Spirit', 'skill', ['unyielding spirit']], ['Bloodlust', 'skill', ['bloodlust']],
    ['Dagger Proficiency', 'skill', ['dagger proficiency', 'dagger mastery']], ['Vital Stab', 'skill', ['vital stab', 'vital points targetting', 'violent slash', 'mutilate']],
    ['Dagger Throw', 'skill', ['dagger throw', 'impale']], ["Kang's Stealth", 'skill', ["kang's stealth"]], ["Ruler's Hands", 'skill', ["ruler's hands", 'power of ruler']],
    ['Shadow Extraction', 'skill', ['shadow extraction', 'extraction probability']], ['Shadow Storage', 'skill', ['storage operation', 'shadow storage']],
    ['Shadow Exchange', 'skill', ['shadow exchange']], ["Monarch's Domain", 'skill', ["monarch's domain"]], ['Sense Sharing', 'skill', ['sense sharing']],
    ['Necromancer class', 'class', ['necromancer', 'monarch of shadows']], ['Wolf Slayer', 'title', ['wolf slayer']], ['Hidden Devil Hunter', 'title', ['devil hunter title', 'black heart']],
    ["Casaka's Venom", 'item-power', ['venom gland', 'poisoned fang']], ['Bead of Avarice', 'relic', ['bead of avarice']], ["Gatekeeper's Necklace", 'item-power', ["gatekeeper's necklace"]],
    ["Kamish's daggers", 'item-power', ['kamish daggers', "kamish's wrath", 'kamish dagger']], ['Cup of Reincarnation', 'relic', ['cup rollback', 'cup of reincarnation', 'cup reverses']],
    ['Destruction code', 'relic', ['destruction code', 'deletion authorization']], ['Reawakening', 'system', ['reawakening']], ['Random Box', 'item-power', ['random box']],
    ['Player System', 'system', ['quest points', 'system equipment', 'shop after deletion']], ['Shadow grade advancement', 'system', ['grade advancement', 'advancement command']],
    ['Igris', 'shadow-soldier', ['igris']], ['Beru', 'shadow-soldier', ['beru']], ['Iron', 'shadow-soldier', ['iron identity', 'iron role']], ['Tank', 'shadow-soldier', ['tank mount']],
    ['Kaisel', 'shadow-soldier', ['kaisel']], ['Ant queen', 'shadow-soldier', ['ant queen']], ['Greed', 'shadow-soldier', ['greed']], ['Healer shadow', 'shadow-soldier', ['healer shadow']],
    ['Naga', 'shadow-soldier', ['naga']], ['World Tree fragment', 'relic', ['world tree fragment']], ['Temple key', 'item-power', ['temple key']], ['Age adjustment', 'skill', ['age adjustment']]];
function sl() {
    const lines = sourceLines(SL_FILES);
    return SL_POWERS.map(([name, category, aliases]) => ({key: `sl.power.${slug(name)}`, name, category, nameSource: ['curated from engine_inputs claims subjects and dossier files'], holders: [], aliases,
        stated: null, evidence: find(lines, aliases)})).filter(e => e.evidence.length > 0);
}

export function entities(book) { return book === 'ss' || book === 'rt' ? paid(book) : book === 'orv' ? orv() : sl(); }
if (process.argv[1] === new URL(import.meta.url).pathname) for (const b of process.argv.slice(2)) console.log(b, entities(b).length);
