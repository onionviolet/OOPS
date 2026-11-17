#!/usr/bin/env node
// Gu rank rule search (PWC99, PWC90-PWC95, PWC100; proposal). Candidate rules are small functions from mechanism (refinement edges, band, path,
// type, first appearance); a local scorer runs them on four dev folds; the fifth fold is frozen and scored once.
//   node scripts/gu_rank_search.mjs freeze              write docs/coverage/gu_rank_folds.json (commit it before any candidate is scored)
//   node scripts/gu_rank_search.mjs dev                 score every candidate and every ordered rule set on folds 1-4
//   node scripts/gu_rank_search.mjs final               score the chosen rule set on fold 5, once (refuses a second run)
// Folds (frozen): the existing GKM429 held-out cohort rows (sha1(id)[0] < 0x33) are fold 5; the rest split by that byte into folds 1-4.
// A scored fold hides its own ranks AND fold 5's (and fold 5 hides only itself): a rule that reads neighbours' ranks never sees a hidden one.
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
const g = await import('./derive_gu_ranks.mjs');
export const FOLDS_FILE = 'docs/coverage/gu_rank_folds.json', RESULT_FILE = 'docs/coverage/gu_rank_search.json';
const rd = f => JSON.parse(readFileSync(join(root, f), 'utf8'));
const byte0 = id => createHash('sha1').update(id).digest()[0];
export const foldOf = id => byte0(id) < 0x33 ? 5 : 1 + Math.floor((byte0(id) - 0x33) * 4 / (256 - 0x33));

const priv = ['/Users/weiwei/code/yet-another-idle-rpg/', root].map(b => join(b, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json')).find(existsSync);
const index = JSON.parse(readFileSync(priv, 'utf8')), edges = rd(g.EDGES_FILE).edges;
const chapterTier = rd('docs/coverage/chapter_tier_labels.json').gu_kinds, wikiTier = rd('docs/coverage/wiki_tier_labels.json').gu_kinds;
const world = g.buildWorld({index, edges, chapterTier, wikiTier});
for (const r of index.records) world.feat[r.id].first = Number(r.saga?.first) || null;
const cohort = Object.entries(chapterTier).filter(([id, c]) => c.role === 'cohort' && c.rank != null && world.recs.get(id).metadata.fandom_category_ranks[0] === c.rank).map(([id]) => id).sort();
const median = xs => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : Math.floor((s[m - 1] + s[m]) / 2); };
const mode = xs => { const c = new Map(); for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1); return [...c].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0]; };

// products of each Gu, for the inverse rule
const productsOf = {};
for (const [id, e] of Object.entries(world.edges)) for (const x of new Set(world.resolve([...(e.precursors ?? []), ...(e.fusion ?? [])]))) if (x !== id) (productsOf[x] ??= []).push(id);
const inputsOf = id => [...new Set(world.resolve([...(world.edges[id]?.precursors ?? []), ...(world.edges[id]?.fusion ?? [])]))].filter(x => x !== id);

// ---- Candidate rules. ctx = {rank (visible ranks), pool (visible ids), baseline}. A rule returns a rank or null (abstain). ----
export const RULES = {
    // Mechanism: refinement. A made Gu is one rank above its best-known input (50 of 54 edges).
    precursor: (c, id) => { const k = inputsOf(id).filter(x => c.rank[x]); return k.length ? Math.max(...k.map(x => c.rank[x])) + 1 : null; },
    // Mechanism: the inverse. An input is below every product whose rank is known.
    inverse: (c, id) => { const k = (productsOf[id] ?? []).filter(x => c.rank[x]); return k.length ? Math.max(1, Math.min(...k.map(x => c.rank[x])) - 1) : null; },
    // Mechanism: the wiki's own next-rank link names the rank above.
    nextRank: (c, id) => { const s = world.edges[id]?.statesRank; return s?.length ? Math.max(1, Math.min(...s.map(x => x.rank)) - 1) : null; },
    // Mechanism: refinement chain. An input with no known rank takes its own best-known precursor's rank + 1, up to three links.
    chain: (c, id, depth = 3) => {
        const walk = (x, d) => { if (c.rank[x]) return c.rank[x]; if (d === 0) return null; const k = inputsOf(x).map(y => walk(y, d - 1)).filter(Boolean); return k.length ? Math.max(...k) + 1 : null; };
        const k = inputsOf(id).map(y => walk(y, depth - 1)).filter(Boolean); return k.length ? Math.max(...k) + 1 : null;
    },
    // Resemblance (the baseline rule).
    family: (c, id) => g.familyRule(world, id, c.pool)?.rank ?? null,
    // The story advances: Gu first met later in the book are higher rank. Median of the k nearest first-appearance chapters in the same band.
    firstChapter: (c, id, k = 7) => {
        const f = world.feat[id]; if (!f.first) return null;
        const near = c.pool.filter(x => x !== id && world.feat[x].first && world.feat[x].band === f.band).sort((a, b) => Math.abs(world.feat[a].first - f.first) - Math.abs(world.feat[b].first - f.first)).slice(0, k);
        return near.length >= 3 ? median(near.map(x => c.rank[x])) : null;
    },
    // Both: family members only, nearest first-appearance chapters (path or type family narrows the story-time neighbours).
    familyFirst: (c, id, k = 5) => {
        const f = world.feat[id]; if (!f.first) return null;
        const fam = c.pool.filter(x => x !== id && world.feat[x].first && world.feat[x].band === f.band && ((f.path && world.feat[x].path === f.path) || (f.type && world.feat[x].type === f.type)));
        const near = fam.sort((a, b) => Math.abs(world.feat[a].first - f.first) - Math.abs(world.feat[b].first - f.first)).slice(0, k);
        return near.length >= 3 ? median(near.map(x => c.rank[x])) : null;
    },
    firstChapter5: (c, id) => RULES.firstChapter(c, id, 5),
    firstChapter11: (c, id) => RULES.firstChapter(c, id, 11),
    firstChapter15: (c, id) => RULES.firstChapter(c, id, 15),
    // Story time within the path: nearest first-appearance chapters in the same path (any band), k=9.
    pathFirst: (c, id, k = 9) => {
        const f = world.feat[id]; if (!f.first || !f.path) return null;
        const near = c.pool.filter(x => x !== id && world.feat[x].first && world.feat[x].path === f.path).sort((a, b) => Math.abs(world.feat[a].first - f.first) - Math.abs(world.feat[b].first - f.first)).slice(0, k);
        return near.length >= 5 ? median(near.map(x => c.rank[x])) : null;
    },
    baseline: c => c.baseline,
};
const clampBand = (id, r) => { if (r == null) return r; const b = world.feat[id].band; return b === 'immortal' ? Math.max(6, r) : b === 'mortal' ? Math.min(5, r) : r; };

function context(hiddenFolds) {
    const rank = {};
    for (const [id, r] of Object.entries(world.rank)) if (!hiddenFolds.includes(foldOf(id)) || !cohort.includes(id)) rank[id] = r;
    const pool = Object.keys(rank);
    return {rank, pool, baseline: mode(pool.map(x => rank[x]))};
}
export function scoreSet(order, fold, {clamp = false} = {}) {
    const c = context([fold, 5]), ids = cohort.filter(id => foldOf(id) === fold);
    if (fold === 5) { const only5 = context([5]); Object.assign(c, only5); }
    const t = {n: ids.length, exact: 0, within1: 0, baseExact: 0, baseWithin1: 0, by: {}, misses: [], derived: {}};
    for (const id of ids) {
        let hit = null, by = 'baseline';
        for (const name of order) { const r = RULES[name](c, id); if (r != null) { hit = r; by = name; break; } }
        if (hit == null) hit = c.baseline;
        if (clamp) hit = clampBand(id, hit);
        t.derived[id] = hit;
        const truth = world.rank[id], ok = hit === truth, w = Math.abs(hit - truth) <= 1;
        t.exact += ok; t.within1 += w; t.baseExact += c.baseline === truth; t.baseWithin1 += Math.abs(c.baseline - truth) <= 1;
        const b = t.by[by] ??= {n: 0, exact: 0, within1: 0}; b.n++; b.exact += ok; b.within1 += w;
        if (!ok) t.misses.push({id, by, derived: hit, truth});
    }
    return t;
}
export {world, cohort};
const sum = rs => ({n: rs.reduce((a, r) => a + r.n, 0), exact: rs.reduce((a, r) => a + r.exact, 0), within1: rs.reduce((a, r) => a + r.within1, 0), baseExact: rs.reduce((a, r) => a + r.baseExact, 0), baseWithin1: rs.reduce((a, r) => a + r.baseWithin1, 0)});

const cmd = process.argv[2];
if (cmd === 'freeze') {
    const folds = {1: [], 2: [], 3: [], 4: [], 5: []};
    for (const id of cohort) folds[foldOf(id)].push(id);
    writeFileSync(join(root, FOLDS_FILE), `${JSON.stringify({meta: {pass: 'PWC99, PWC100', date: '2026-11-17', rule: 'cohort = rows whose wiki category rank and chapter-tier rank agree (392). Fold 5 = sha1(id)[0] < 0x33 (the GKM429 held-out set); folds 1-4 = floor((sha1(id)[0] - 0x33) * 4 / 205) + 1. Frozen before any candidate is scored.', counts: Object.fromEntries(Object.entries(folds).map(([k, v]) => [k, v.length]))}, folds}, null, 1)}\n`);
    console.log(Object.entries(folds).map(([k, v]) => `${k}:${v.length}`).join(' '));
} else if (cmd === 'dev') {
    const names = Object.keys(RULES).filter(x => x !== 'baseline');
    const rows = [];
    const report = (label, order, opt) => { const per = [1, 2, 3, 4].map(f => scoreSet(order, f, opt)), s = sum(per); rows.push({label, order, ...s, perFold: per.map(p => `${p.exact}/${p.n}`).join(' ')}); };
    report('baseline only', []);
    for (const n of names) report(`${n} alone (rest baseline)`, [n]);
    report('family-median set (current)', ['family']);
    for (const clamp of [false, true]) {
        for (const o of [['precursor', 'inverse', 'nextRank', 'firstChapter5', 'family'], ['precursor', 'inverse', 'nextRank', 'firstChapter11', 'family'], ['precursor', 'inverse', 'nextRank', 'firstChapter15', 'family'], ['precursor', 'inverse', 'nextRank', 'firstChapter', 'family'], ['precursor', 'inverse', 'nextRank', 'firstChapter', 'pathFirst', 'family'], ['precursor', 'inverse', 'nextRank', 'pathFirst', 'firstChapter', 'family'],['precursor', 'family'], ['precursor', 'inverse', 'family'], ['precursor', 'nextRank', 'inverse', 'family'], ['precursor', 'chain', 'nextRank', 'inverse', 'family'], ['precursor', 'chain', 'nextRank', 'inverse', 'familyFirst', 'family'],
            ['precursor', 'chain', 'nextRank', 'inverse', 'firstChapter', 'family'], ['precursor', 'chain', 'nextRank', 'inverse', 'familyFirst', 'firstChapter'], ['precursor', 'chain', 'nextRank', 'inverse', 'firstChapter'], ['firstChapter', 'family'], ['familyFirst', 'family']]) report(`${o.join(' > ')}${clamp ? ' +band clamp' : ''}`, o, {clamp});
    }
    for (const r of rows) console.log(r.label.padEnd(86), `${r.exact}/${r.n} (${(100 * r.exact / r.n).toFixed(0)}%)`.padEnd(14), `w1 ${(100 * r.within1 / r.n).toFixed(0)}%`.padEnd(9), `base ${(100 * r.baseExact / r.n).toFixed(0)}/${(100 * r.baseWithin1 / r.n).toFixed(0)}`, r.perFold);
} else if (cmd === 'final') {
    const chosen = JSON.parse(process.argv[3] ?? '[]'), opt = {clamp: process.argv.includes('--clamp')};
    if (existsSync(join(root, RESULT_FILE)) && !process.argv.includes('--again')) { console.error('fold 5 was already scored once; the result is in', RESULT_FILE); process.exit(1); }
    const fam = scoreSet(['family'], 5), set = scoreSet(chosen, 5, opt);
    const out = {meta: {pass: 'PWC99, PWC100', date: '2026-11-17', note: 'Fold 5 scored once, after the rule set was chosen on folds 1-4. All figures are over every fold-5 cohort row (abstain falls back to the baseline).'}, ruleSet: chosen, ...opt, final: {n: set.n, exact: set.exact, within1: set.within1, by: set.by, misses: set.misses},
        familyMedian: {n: fam.n, exact: fam.exact, within1: fam.within1, by: fam.by}, baseline: {exact: set.baseExact, within1: set.baseWithin1}};
    writeFileSync(join(root, RESULT_FILE), `${JSON.stringify(out, null, 1)}\n`);
    console.log(JSON.stringify({set: [set.exact, set.within1, set.n], family: [fam.exact, fam.within1, fam.n], base: [set.baseExact, set.baseWithin1], by: set.by}));
}

if (cmd === 'exceptions') {
    // Misses of two ranks or more on fold 5 become named exceptions (PWC92, PC84): a pinned canon rank with a mechanical class, not an in-world reason.
    const res = rd(RESULT_FILE), set = scoreSet(res.ruleSet, 5), rows = [];
    for (const m of res.final.misses) {
        if (Math.abs(m.derived - m.truth) < 2) continue;
        const f = world.feat[m.id], early = f.first && f.first < 400;
        rows.push({id: m.id, name: f.name, rule: m.by, derived: m.derived, canon: m.truth, firstChapter: f.first, state: 'authored:' + (m.by === 'baseline' ? 'no-family-no-first-chapter' : m.truth > m.derived ? (early ? 'early-appearance-high-rank' : 'later-appearance-higher-rank') : 'low-rank-for-its-story-time'),
            reason: 'mechanical class only; the in-world reason needs a chapter read (not done)'});
    }
    // Coverage on the rows a player would derive: rank-blocked wiki rows.
    const kinds = rd('docs/coverage/gu_labels.json').kinds;
    const ledger = readFileSync(join(root, 'docs/coverage/gu_kinds.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
    const blocked = ledger.filter(r => /^blocked:rank-unknown$/.test(r.state) || kinds[r.id]?.rankBasis === 'derived').map(r => r.id);
    const withFirst = blocked.filter(id => world.feat[id]?.first).length;
    const out = {meta: {pass: 'PWC92, PWC99, PWC100', date: '2026-11-17', rule: 'fold-5 misses of two ranks or more'}, exceptions: rows, count: rows.length, foldFiveN: set.n,
        factsPerRule: Object.fromEntries(Object.entries(res.final.by).map(([k, v]) => [k, {applied: v.n, exact: v.exact, within1: v.within1}])),
        coverage: {rankBlockedRows: blocked.length, withFirstAppearance: withFirst}};
    writeFileSync(join(root, 'docs/coverage/gu_rank_exceptions.json'), `${JSON.stringify(out, null, 1)}\n`);
    console.log(JSON.stringify({count: rows.length, coverage: out.coverage, classes: rows.reduce((a, r) => (a[r.state] = (a[r.state] ?? 0) + 1, a), {})}));
}
