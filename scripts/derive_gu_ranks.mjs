#!/usr/bin/env node
// Derived Gu ranks (PWC23, proposal; PWC20 derived tier). A Gu whose rank no source states takes one from the
// world's own rules, kept apart from canon: the row says which rule and which inputs. Three rules, in priority:
//   gu.rank.precursor      rank = the highest known rank among the Gu it is refined from, plus one (the wiki's
//                          "previous rank" and fusion fields; the cohort shows +1 on 50 of 54 precursor edges).
//   gu.rank.series         a numbered series climbs by its step (needs two known members to give a step).
//   gu.rank.family-median  otherwise the median known rank of its band (mortal or immortal), path and type
//                          family, falling back to wider families, with n and spread recorded.
// The rules are code here and are scored before any row folds. Split frozen first (GKM429): sha1(id)[0] < 0x33
// is held out; family medians fit on the rest only. Scoring cohort: the Gu whose wiki category rank and chapter-tier
// rank agree (docs/coverage/chapter_tier_labels.json role 'cohort'; 392 rows), each scored with its own rank hidden.
// A rule folds only if, on the cohort rows it applies to, it beats the most-common-rank baseline (FOLD below).
// Usage:
//   node scripts/derive_gu_ranks.mjs --extract [dump.xml.7z]   recipe edges from the private Fandom dump -> gu_recipe_edges.json
//   node scripts/derive_gu_ranks.mjs                           score, derive, write gu_derived_ranks.json and ri_rules.json
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const PRIVATE_INDEX = 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json';
const DUMP = `${process.env.HOME}/.codex/research/wikis/reverend-insanity.fandom.com/dump/reverendinsanity_pages_current.xml.7z`;
export const EDGES_FILE = 'docs/coverage/gu_recipe_edges.json';
export const DERIVED_FILE = 'docs/coverage/gu_derived_ranks.json';
export const RULES_FILE = 'docs/coverage/ri_rules.json';
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;

// Frozen before any score (advisor note): a rule folds when it applies to at least MIN_N cohort rows, its exact
// agreement is above the baseline's on those rows and its within-one agreement is not below it.
export const FOLD = {minN: 10, rule: 'exact above baseline, within-one not below, on the rows the rule applies to'};
export const MIN_FAMILY = 3;
export const RULE_IDS = {precursor: 'gu.rank.precursor', series: 'gu.rank.series', family: 'gu.rank.family-median'};

const norm = s => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]+/g, ' ').trim();
const withoutGu = s => norm(s).replace(/ gu$/, '');
const median = xs => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : Math.floor((s[m - 1] + s[m]) / 2); };
const mode = xs => { const c = new Map(); for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1); return [...c].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0]; };

function loadIndex() {
    for (const base of [root, '/Users/weiwei/code/yet-another-idle-rpg/']) {
        const path = join(base, PRIVATE_INDEX);
        if (existsSync(path)) return JSON.parse(readFileSync(path, 'utf8'));
    }
    throw Error('The private Gu review index is needed (gitignored).');
}

// ---- Extraction: structural edges only (link targets and ranks), no wiki prose. ----
const linkTargets = text => [...text.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)].map(m => m[1].trim());
const infoboxField = (text, names) => {
    for (const name of names) {
        const m = new RegExp(`\\|\\s*${name}\\s*=([\\s\\S]*?)(?=\\n\\||\\|\\s*[A-Za-z_0-9]+\\s*=|\\}\\})`, 'i').exec(text);
        if (m && m[1].trim() && m[1].trim() !== '-') return m[1];
    }
    return null;
};
// "A + B = C" lists A and B when C is this page; a line for another product is skipped; a bare list is all inputs.
export function ingredientsOf(field, title) {
    const out = [];
    for (const line of field.split(/<br\s*\/?>|\n/)) {
        if (line.includes('=')) {
            const [lhs, rhs] = line.split('=');
            if (linkTargets(rhs).some(t => norm(t) === norm(title))) out.push(...linkTargets(lhs));
        } else out.push(...linkTargets(line));
    }
    return [...new Set(out.filter(t => norm(t) !== norm(title)))];
}
export function extractEdges(index, xml) {
    const pages = new Map();
    for (const m of xml.matchAll(/<page>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<text[^>]*>([\s\S]*?)<\/text>/g)) {
        const unescape = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        pages.set(unescape(m[1]), unescape(m[2]));
    }
    const edges = {};
    for (const rec of index.records) {
        const title = rec.fandom?.name;
        const text = title && pages.get(title);
        if (!text) continue;
        const prev = infoboxField(text, ['gu_previous_rank', 'previous_rank']);
        const fusion = infoboxField(text, ['gu_fusion', 'fusion']);
        const next = infoboxField(text, ['next_rank']);
        const entry = {};
        if (prev) entry.precursors = ingredientsOf(prev, title);
        if (fusion) entry.fusion = ingredientsOf(fusion, title);
        if (next) entry.statesRank = [...next.matchAll(/Rank\s*(\d)[^\n\[]*\[\[([^\]|#]+)/gi)].map(m => ({rank: Number(m[1]), name: m[2].trim()}));
        for (const k of Object.keys(entry)) if (!entry[k].length) delete entry[k];
        if (Object.keys(entry).length) edges[rec.id] = entry;
    }
    return edges;
}

// ---- Features and rules ----
export function buildWorld({index, edges, chapterTier, wikiTier}) {
    const recs = new Map(index.records.map(r => [r.id, r]));
    const nameOf = r => r.fandom?.name ?? r.saga?.name ?? r.id;
    const byName = new Map();
    for (const r of index.records) for (const n of [r.fandom?.name, r.saga?.name]) if (n) { byName.set(withoutGu(n), byName.get(withoutGu(n)) ?? r.id); }
    // The ledger's own rank order, minus the Immortal-name bound: category rank, then chapter tier, then wiki tier.
    const rank = {};
    for (const r of index.records) {
        const cat = r.metadata?.fandom_category_ranks ?? [];
        const chapter = chapterTier?.[r.id]?.rank, tier = wikiTier?.[r.id]?.rank;
        const known = cat.length ? Math.min(...cat) : chapter ?? tier ?? null;
        if (known) rank[r.id] = known;
    }
    const cats = r => r.fandom?.categories ?? [];
    const band = r => {
        const c = cats(r), n = nameOf(r);
        if (c.includes('Immortal Gu') || c.includes('Unranked Immortal Gu') || /\bimmortal\b/i.test(n)) return 'immortal';
        if (c.includes('Unranked Mortal Gu')) return 'mortal';
        return 'unmarked';
    };
    const path = r => { const p = cats(r).find(c => c.endsWith(' Path') && c !== 'Unknown Path'); return p ? p.slice(0, -5).toLowerCase() : r.metadata?.saga_path ?? null; };
    const type = r => cats(r).find(c => c.endsWith(' Type Gu'))?.replace(/ Type Gu$/, '').toLowerCase() ?? null;
    const feat = {};
    for (const r of index.records) feat[r.id] = {id: r.id, name: nameOf(r), band: band(r), path: path(r), type: type(r)};
    const resolve = names => names.map(n => byName.get(withoutGu(n))).filter(Boolean);
    return {recs, rank, feat, edges, byName, resolve, nameOf};
}

// Rule 1: refined from known Gu. ingredients' own ids, never the Gu itself.
export function precursorRule(world, id) {
    const e = world.edges[id];
    if (!e) return null;
    const ids = [...new Set(world.resolve([...(e.precursors ?? []), ...(e.fusion ?? [])]))].filter(x => x !== id);
    const known = ids.filter(x => world.rank[x]);
    if (!known.length) return null;
    return {rule: RULE_IDS.precursor, rank: Math.max(...known.map(x => world.rank[x])) + 1,
        inputs: known.map(x => `${x}@${world.rank[x]}`), spread: null};
}
// Rule 2: a numbered series. The name with its number token blanked groups members; the step is fitted from
// two known members and never from the Gu being derived.
const NUMBERS = {one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, first: 1, second: 2, third: 3,
    fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, hundred: 100, thousand: 1000, i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6};
const numberOf = word => /^\d+$/.test(word) ? Number(word) : NUMBERS[word] ?? null;
export function seriesKey(name) {
    const words = norm(name).split(' ');
    const at = words.findIndex(w => numberOf(w) !== null);
    if (at < 0) return null;
    const value = numberOf(words[at]);
    return {key: words.map((w, i) => i === at ? '#' : w).join(' '), value};
}
export function seriesRule(world, id) {
    const mine = seriesKey(world.feat[id].name);
    if (!mine) return null;
    const mates = Object.keys(world.feat).filter(x => x !== id && world.rank[x] && seriesKey(world.feat[x].name)?.key === mine.key)
        .map(x => ({id: x, value: seriesKey(world.feat[x].name).value, rank: world.rank[x]})).sort((a, b) => a.value - b.value);
    if (mates.length < 2) return null;
    const [a, b] = [mates[0], mates[mates.length - 1]];
    if (a.value === b.value) return null;
    const step = (b.rank - a.rank) / (b.value - a.value);
    const rank = Math.round(a.rank + step * (mine.value - a.value));
    if (rank < 1 || rank > 9) return null;
    return {rule: RULE_IDS.series, rank, inputs: mates.map(m => `${m.id}@${m.rank}`), spread: null, step};
}
// Rule 3: family median from the training pool (held-out rows excluded), widest-fit order.
export function familyRule(world, id, pool) {
    const f = world.feat[id];
    const keys = [['band+path+type', x => x.band === f.band && f.path && x.path === f.path && f.type && x.type === f.type],
        ['band+path', x => x.band === f.band && f.path && x.path === f.path],
        ['band+type', x => x.band === f.band && f.type && x.type === f.type],
        ['band', x => x.band === f.band && f.band !== 'unmarked']];
    for (const [family, test] of keys) {
        const ranks = pool.filter(x => x !== id && test(world.feat[x])).map(x => world.rank[x]);
        if (ranks.length >= MIN_FAMILY) {
            const s = [...ranks].sort((p, q) => p - q);
            return {rule: RULE_IDS.family, rank: median(ranks), inputs: [`${family}: ${[f.band, family.includes('path') && f.path, family.includes('type') && f.type].filter(Boolean).join('/')}`],
                spread: {n: ranks.length, min: s[0], max: s[s.length - 1], q1: s[Math.floor(s.length / 4)], q3: s[Math.floor(3 * s.length / 4)]}};
        }
    }
    return null;
}

// ---- Scoring on the cohort ----
export function scoreRules(world, cohort) {
    const train = Object.keys(world.rank).filter(id => !heldOut(id));
    const baselineRank = mode(train.map(id => world.rank[id]));
    const out = {baselineRank, rules: {}};
    const tally = () => ({n: 0, exact: 0, within1: 0, baselineExact: 0, baselineWithin1: 0, heldOut: {n: 0, exact: 0, within1: 0, baselineExact: 0, baselineWithin1: 0}});
    for (const [name, fn] of [['precursor', id => precursorRule(world, id)], ['series', id => seriesRule(world, id)], ['family', id => familyRule(world, id, train)]]) {
        const t = tally();
        for (const id of cohort) {
            const d = fn(id);
            if (!d) continue;
            const truth = world.rank[id];
            if (name === 'family') {
                const level = d.inputs[0].split(':')[0];
                const l = (t.byLevel ??= {})[level] ??= {n: 0, exact: 0, within1: 0, baselineExact: 0, baselineWithin1: 0};
                l.n++; l.exact += d.rank === truth; l.within1 += Math.abs(d.rank - truth) <= 1;
                l.baselineExact += baselineRank === truth; l.baselineWithin1 += Math.abs(baselineRank - truth) <= 1;
            }
            for (const bucket of [t, ...(heldOut(id) ? [t.heldOut] : [])]) {
                bucket.n++;
                bucket.exact += d.rank === truth; bucket.within1 += Math.abs(d.rank - truth) <= 1;
                bucket.baselineExact += baselineRank === truth; bucket.baselineWithin1 += Math.abs(baselineRank - truth) <= 1;
            }
        }
        t.folds = t.n >= FOLD.minN && t.exact > t.baselineExact && t.within1 >= t.baselineWithin1;
        out.rules[name] = t;
    }
    // Cohort-wide reference: the baseline on all 392 and the family rule's coverage.
    out.cohortBaseline = {n: cohort.length, exact: cohort.filter(id => world.rank[id] === baselineRank).length,
        within1: cohort.filter(id => Math.abs(world.rank[id] - baselineRank) <= 1).length};
    return out;
}

// ---- Derive the blocked rows ----
// `blocked`: ids of the rank-blocked wiki-layer rows. Priority order; a rule that did not fold never applies.
export function deriveRows(world, blocked, scores) {
    const folds = name => scores.rules[name].folds;
    const pool = Object.keys(world.rank);   // every known rank, held-out rows included, for the live rows
    const rows = {};
    for (const id of blocked) {
        const tries = [folds('precursor') && precursorRule(world, id), folds('series') && seriesRule(world, id), folds('family') && familyRule(world, id, pool)];
        const hit = tries.find(Boolean);
        if (hit) rows[id] = hit;
    }
    return rows;
}

const RULE_ROWS = (scores) => [
    {id: RULE_IDS.precursor, world: 'reverend-insanity',
        statement: 'A Gu refined from other Gu is one rank above the highest-ranked Gu it is refined from.',
        locators: ['wiki:Infobox Gu previous_rank and fusion fields', 'ri:ch123 and ch127 (Stealth Scales from Fish Scale and Stealth Rock, rank two)'],
        speaker: 'wiki', mechanism: 'gu_refinement.js recipe: precursor kind and rank step',
        derives: 'rank of rank-blocked Gu with a named precursor or recipe', score: scores.rules.precursor},
    {id: RULE_IDS.series, world: 'reverend-insanity',
        statement: 'A numbered series of Gu climbs by the step its known members show (each member has a number word in its name).',
        locators: ['wiki:Gu names with a number word'], speaker: 'wiki', mechanism: 'gu_catalogue.js kind ranks',
        derives: 'rank of rank-blocked Gu in a series with two known members', score: scores.rules.series},
    {id: RULE_IDS.family, world: 'reverend-insanity',
        statement: 'With no recipe or series, a Gu takes the median rank of its band (mortal or immortal), path and type family, with the spread recorded as the dial.',
        locators: ['wiki:Gu categories (path, type, Immortal Gu, Unranked Mortal Gu)'], speaker: 'wiki', mechanism: 'gu_working_law.js derivedAbilityFrom({rank, function})',
        derives: 'rank of rank-blocked Gu with a family of at least three ranked members', score: scores.rules.family},
];

function main() {
    const index = loadIndex();
    if (process.argv.includes('--extract')) {
        const dump = process.argv.find((a, i) => i > 2 && !a.startsWith('--')) ?? DUMP;
        const xml = execFileSync('bsdtar', ['-xOf', dump], {maxBuffer: 1 << 30}).toString('utf8');
        const edges = extractEdges(index, xml);
        writeFileSync(join(root, EDGES_FILE), `${JSON.stringify({meta: {source: 'Reverend Insanity Fandom pages_current dump, Infobox Gu previous_rank, fusion and next_rank link targets only (no prose)', date: '2026-11-17', rows: Object.keys(edges).length}, edges}, null, 1)}\n`);
        console.log(`edges for ${Object.keys(edges).length} records`);
        return;
    }
    const edges = JSON.parse(readFileSync(join(root, EDGES_FILE), 'utf8')).edges;
    const read = f => JSON.parse(readFileSync(join(root, f), 'utf8'));
    const chapterTier = read('docs/coverage/chapter_tier_labels.json').gu_kinds, wikiTier = read('docs/coverage/wiki_tier_labels.json').gu_kinds;
    const world = buildWorld({index, edges, chapterTier, wikiTier});
    const cohort = Object.entries(chapterTier).filter(([id, c]) => c.role === 'cohort' && c.rank != null
        && (world.recs.get(id).metadata.fandom_category_ranks[0] === c.rank)).map(([id]) => id);
    const scores = scoreRules(world, cohort);
    scores.cohort = {n: cohort.length, heldOut: cohort.filter(heldOut).length};
    const kinds = read('docs/coverage/gu_labels.json').kinds;
    const ledger = new Map(readFileSync(join(root, 'docs/coverage/gu_kinds.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l)).map(r => [r.id, r]));
    // Rank-blocked wiki rows: those the ledger blocks on rank today, or already carries as derived (rerun-stable).
    const blocked = [...ledger.values()].filter(r => /^blocked:rank-unknown$/.test(r.state) || kinds[r.id]?.rankBasis === 'derived')
        .map(r => r.id).filter(id => kinds[id]?.layer === 'wiki' || kinds[id]?.rankBasis === 'derived');
    const derived = deriveRows(world, blocked, scores);
    const by = {};
    for (const d of Object.values(derived)) by[d.rule] = (by[d.rule] ?? 0) + 1;
    const sidecar = {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#pwc23-gu-derived-ranks-2026-11-17-proposals', date: '2026-11-17',
        tier: 'derived (PWC20), below chapter and wiki; a later stated rank replaces it',
        split: 'sha1(id)[0] < 0x33 held out (GKM429); family medians fit on the rest', fold: FOLD, minFamily: MIN_FAMILY,
        scores, blockedRows: blocked.length, derivedRows: Object.keys(derived).length, byRule: by},
        rows: Object.fromEntries(Object.entries(derived).sort(([a], [b]) => a.localeCompare(b)))};
    writeFileSync(join(root, DERIVED_FILE), `${JSON.stringify(sidecar, null, 1)}\n`);
    // Rule rows (shared shape {id, world, statement, locators, speaker, mechanism, derives}); keep other lanes' rows.
    const path = join(root, RULES_FILE);
    const existing = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : [];
    const mine = new Set(Object.values(RULE_IDS));
    const rules = [...existing.filter(r => !mine.has(r.id)), ...RULE_ROWS(scores).map(({score, ...r}) => ({...r, derives: Object.entries(derived).filter(([, d]) => d.rule === r.id).map(([id]) => id)}))];
    writeFileSync(path, `${JSON.stringify(rules, null, 1)}\n`);
    console.log(JSON.stringify({cohort: scores.cohort, baselineRank: scores.baselineRank, cohortBaseline: scores.cohortBaseline, rules: scores.rules, blocked: blocked.length, derived: Object.keys(derived).length, byRule: by}, null, 1));
}
if (import.meta.url === `file://${process.argv[1]}`) main();
