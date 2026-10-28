// Reader protocol v2 helpers (protagonist-life plan round 13): deterministic candidate extraction, a name
// glossary from the wiki dump and earlier census rows, and the shard audit gate (WA30, WA31). Pure functions;
// the CLIs `assemble_brief.mjs` and `audit_shard.mjs` do the file work. Outputs carry ids, locators and counts,
// plus short names in the source script (the census `zh` field already holds them); never source sentences.
import {lintScenes, lintCensus, lintFills, summarize} from './lint_lead_run.mjs';
import {EN_PATTERNS, EN_RELATIONAL, formatLocator, parseLocator, nameIn} from './world_profiles.mjs';

const CJK_NUM = '零一二两三四五六七八九十百千半几\\d';
const PATTERNS = Object.freeze({
    money: new RegExp(`(?:[${CJK_NUM}]+分之)?[${CJK_NUM}]+(?:个|枚|张)?(?:铜)?(?:便士|苏勒|金镑|镑)`, 'g'),
    time: new RegExp(`[${CJK_NUM}]+(?:点半|点钟|点|时)(?:[${CJK_NUM}]+分)?`, 'g'),
    duration: new RegExp(`[${CJK_NUM}]+(?:分钟|小时|天|周|个月|年)`, 'g'),
    measure: new RegExp(`[${CJK_NUM}]+(?:磅|盎司|公里|英里|码|米|公斤)`, 'g'),
    name: /[一-鿿]{1,6}[·.][一-鿿]{1,6}/g,
});

/** Candidate facts by kind with paragraph locators, so readers label and link rather than search. */
export function extractCandidates(shardMap) {
    const out = [], en = shardMap.lang === 'en';
    for (const [key, text] of shardMap) {
        const [ch, p] = key.split(':');
        if (en) {
            for (const [kind, re] of Object.entries(EN_PATTERNS)) for (const m of text.matchAll(re)) out.push({kind, value: m[0], locator: formatLocator('en', {book: shardMap.book || 1, ch, p})});
            continue;
        }
        for (const [kind, re] of Object.entries(PATTERNS)) {
            for (const m of text.matchAll(re)) {
                // "一点", "半点", "一时" are usually idioms ("a little", "for a moment"); keep them only with a clock word.
                if (kind === 'time' && /^[一半几]?[点时]$|^[一半几]点$|^一时$/.test(m[0]) && !/^[钟整半]/.test(text.slice(m.index + m[0].length))) continue;
                out.push({kind, value: m[0], locator: formatLocator('zh', {book: shardMap.book || 0, ch, p})});
            }
        }
    }
    return out;
}

export const CONTEXTUAL = new Set(['price', 'measure', 'clock', 'calendar']);
// Kinship terms and titles point at different people depending on the speaker (a sister says 哥哥 for Klein).
export const RELATIONAL = new Set(['哥哥', '妹妹', '姐姐', '弟弟', '父亲', '母亲', '爸爸', '妈妈', '队长', '导师', '老师', '先生', '女士', '夫人', '小姐', '大人', '阁下', '房东']);
const NOT_ENTITY = /^(Episode|Chapter|Volume|Season|Book)\b/i;   // adaptation and index pages carry Chinese titles too
// Wiki template remnants (braces, brackets, pipes) are dropped so a name like 洛耀·莱汀}} becomes the bare name.
const normalize = s => String(s || '').replace(/[{}\[\]|<>]/g, '').replace(/[.．・]/g, '·').trim();

/** zh name -> {id?, label, kind?, source}; earlier census rows win over the wiki (they carry our ids). */
export function buildGlossary({wikiPages = [], censusRows = []}) {
    const g = new Map();
    for (const pg of wikiPages) {
        if (NOT_ENTITY.test(pg.title || '')) continue;
        const m = (pg.text || '').match(/\|\s*(?:chinese|chinese_name|cn|zh)\s*=\s*([^\n|]+)/i);
        if (!m) continue;
        const zh = normalize(m[1]);
        if (zh && /[一-鿿]/.test(zh) && !g.has(zh)) g.set(zh, {label: pg.title, source: 'wiki'});
    }
    // Ids come from earlier census rows (organization ids normalized); labels prefer the wiki title.
    for (const r of censusRows) {
        const zh = normalize(r.zh);
        // Amounts, measures and times are contextual: "4 pence" in one scene is not the same row as in another.
        if (!zh || g.get(zh)?.id || CONTEXTUAL.has(r.kind) || RELATIONAL.has(zh) || EN_RELATIONAL.has(zh)) continue;
        // Short common nouns (bedroom, hat) name different things in different scenes; only proper names carry ids across.
        if (['place', 'item', 'event', 'note', 'creature'].includes(r.kind) && zh.length < 3 && !zh.includes('·')) continue;
        const wiki = g.get(zh)?.source === 'wiki' ? g.get(zh).label : null;
        const entry = {id: String(r.id || '').replace(/\.org\./, '.organization.'), label: wiki || r.label, kind: r.kind, source: wiki ? 'census+wiki' : 'census'};
        g.set(zh, entry);
        // English proper names also match by their printed aliases ("Bill" and "Bill Weasley" are one id), 2026-10-28.
        if (['person', 'place', 'organization', 'deity'].includes(r.kind)) for (const a of r.aliases || []) {
            const k = normalize(a);
            if (/^[\x20-\x7e]{3,}$/.test(k) && !EN_RELATIONAL.has(k) && !g.has(k)) g.set(k, entry);
        }
    }
    return g;
}

/** Glossary entries whose name appears in this shard (also the dotted given-name part of a full name). */
export function glossaryHits(glossary, shardText) {
    const text = normalize(shardText), hits = [];
    // English names match as whole words, in the printed form (no dotted given-name shortcut: "Mr. Dursley" must not hit every "Mr").
    if (/^=== Chapter \d+/m.test(shardText)) {
        for (const [zh, e] of glossary) { const printed = zh.replace(/·/g, '.'); if (nameIn(shardText, printed, 'en')) hits.push({...e, zh: printed}); }
        return hits;
    }
    for (const [zh, e] of glossary) {
        const short = zh.split('·')[0];
        if (!(text.includes(zh) || (short.length >= 2 && zh.includes('·') && text.includes(short)))) continue;
        // Show the name as this edition prints it (some print an ASCII dot, some a middle dot), so `zh` stays literal.
        const printed = [zh, zh.replace(/·/g, '.'), zh.replace(/·/g, '．')].find(v => shardText.includes(v)) || zh;
        hits.push({...e, zh: printed});
    }
    return hits;
}

/** Audit gate: lint, locators inside the shard, literal names at their locators, then a grade. */
export function auditShard({scenes = [], census = [], fills = [], shardMap, spotChecked = 0}) {
    const sceneIssues = lintScenes(scenes), censusIssues = lintCensus(census, shardMap), fillIssues = lintFills(fills);
    const locs = [];
    for (const r of scenes) for (const e of r.evidence || []) if (e.label === 'S') locs.push(e.locator);
    const inShard = loc => {
        const m = parseLocator(loc);
        return !!m && shardMap.has(m.key);
    };
    const locatorValid = locs.length ? locs.filter(inShard).length / locs.length : 1;
    const named = census.filter(r => r.zh && r.firstMention);
    const nameMiss = censusIssues.filter(i => i.code === 'zh-not-at-locator' || i.code === 'locator-outside-shard').length;
    const nameAccuracy = named.length ? (named.length - nameMiss) / named.length : 1;
    const lintCodes = [...sceneIssues, ...censusIssues, ...fillIssues].filter(i => !['zh-not-at-locator', 'locator-outside-shard'].includes(i.code));
    const lintOk = lintCodes.length === 0;
    const grade = lintOk && locatorValid === 1 && nameAccuracy >= 0.98 && spotChecked >= 5 ? 'A'
        : lintOk && nameAccuracy >= 0.9 ? 'B' : 'C';
    return {grade, lintOk, locatorValid, nameAccuracy, spotChecked,
        counts: {scenes: scenes.length, census: census.length, fills: fills.length},
        issues: {scenes: summarize(sceneIssues), census: summarize(censusIssues), fills: summarize(fillIssues)}};
}
