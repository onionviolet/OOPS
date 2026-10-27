// Reader protocol v2 helpers (protagonist-life plan round 13): deterministic candidate extraction, a name
// glossary from the wiki dump and earlier census rows, and the shard audit gate (WA30, WA31). Pure functions;
// the CLIs `assemble_brief.mjs` and `audit_shard.mjs` do the file work. Outputs carry ids, locators and counts,
// plus short names in the source script (the census `zh` field already holds them); never source sentences.
import {lintScenes, lintCensus, lintFills, summarize} from './lint_lead_run.mjs';

const CJK_NUM = '零一二两三四五六七八九十百千半几\\d';
const PATTERNS = Object.freeze({
    money: new RegExp(`[${CJK_NUM}]+(?:个|枚|张)?(?:铜)?(?:便士|苏勒|金镑|镑)`, 'g'),
    time: new RegExp(`[${CJK_NUM}]+(?:点半|点钟|点|时)(?:[${CJK_NUM}]+分)?`, 'g'),
    duration: new RegExp(`[${CJK_NUM}]+(?:分钟|小时|天|周|个月|年)`, 'g'),
    measure: new RegExp(`[${CJK_NUM}]+(?:磅|盎司|公里|英里|码|米|公斤)`, 'g'),
    name: /[一-鿿]{1,6}[·.][一-鿿]{1,6}/g,
});

/** Candidate facts by kind with paragraph locators, so readers label and link rather than search. */
export function extractCandidates(shardMap) {
    const out = [];
    for (const [key, text] of shardMap) {
        const [ch, p] = key.split(':');
        for (const [kind, re] of Object.entries(PATTERNS)) {
            for (const m of text.matchAll(re)) out.push({kind, value: m[0], locator: `zh 第${ch}章 p${p}`});
        }
    }
    return out;
}

const NOT_ENTITY = /^(Episode|Chapter|Volume|Season|Book)\b/i;   // adaptation and index pages carry Chinese titles too
const normalize = s => String(s || '').replace(/[.．・]/g, '·').trim();

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
        if (!zh || g.get(zh)?.id) continue;
        const wiki = g.get(zh)?.source === 'wiki' ? g.get(zh).label : null;
        g.set(zh, {id: String(r.id || '').replace(/\.org\./, '.organization.'), label: wiki || r.label, kind: r.kind,
            source: wiki ? 'census+wiki' : 'census'});
    }
    return g;
}

/** Glossary entries whose name appears in this shard (also the dotted given-name part of a full name). */
export function glossaryHits(glossary, shardText) {
    const text = normalize(shardText), hits = [];
    for (const [zh, e] of glossary) {
        const short = zh.split('·')[0];
        if (text.includes(zh) || (short.length >= 2 && zh.includes('·') && text.includes(short))) hits.push({zh, ...e});
    }
    return hits;
}

/** Audit gate: lint, locators inside the shard, literal names at their locators, then a grade. */
export function auditShard({scenes = [], census = [], fills = [], shardMap, spotChecked = 0}) {
    const sceneIssues = lintScenes(scenes), censusIssues = lintCensus(census, shardMap), fillIssues = lintFills(fills);
    const locs = [];
    for (const r of scenes) for (const e of r.evidence || []) if (e.label === 'S') locs.push(e.locator);
    const inShard = loc => {
        const m = (loc || '').match(/^zh 第(\d+)章 p(\d+)$/);
        return !!m && shardMap.has(`${m[1]}:${m[2]}`);
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
