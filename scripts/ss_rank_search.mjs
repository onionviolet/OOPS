#!/usr/bin/env node
// Shadow Slave rank search (PWC99, PWC90-PWC95, PWC100; proposal). Models scripts/gu_rank_search.mjs. Rank here means the tier word a record states
// (creature: dormant..divine; Memory and item: dormant..sacred). Candidate rules are small functions from mechanism (links to a source creature
// or Memory in the same evidence, story time, name stem, class word); a local scorer runs them on four dev folds; fold 5 is frozen and scored once.
//   node scripts/ss_rank_search.mjs freeze   write docs/coverage/ss_rank_folds.json (commit before any candidate is scored)
//   node scripts/ss_rank_search.mjs dev      score every candidate and ordered set on folds 1-4, per pool
//   node scripts/ss_rank_search.mjs final    score the chosen set per pool on fold 5, once (refuses a second run); writes ss_rank_search.json
//   node scripts/ss_rank_search.mjs derive   apply each pool's chosen set to the rows that state no tier; writes ss_rank_derived.json and the ledger blocks
// Folds (frozen): fold 5 = sha1(id)[0] < 0x33 (GKM429); the rest split by that byte into folds 1-4. A scored fold hides its own labels and fold 5's.
// Labelled rows are the records whose packet states a tier (rankSeen / label). Evidence carries the rank as [rank], so no rule reads the answer from
// its own evidence; the name still often carries it, so the stated rows are mostly kind names ("Fallen Beast"), and the score says how far that carries.
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
export const FOLDS_FILE = 'docs/coverage/ss_rank_folds.json', RESULT_FILE = 'docs/coverage/ss_rank_search.json', DERIVED_FILE = 'docs/coverage/ss_rank_derived.json';
const rd = f => JSON.parse(readFileSync(join(root, f), 'utf8'));
const byte0 = id => createHash('sha1').update(id).digest()[0];
export const foldOf = id => byte0(id) < 0x33 ? 5 : 1 + Math.floor((byte0(id) - 0x33) * 4 / (256 - 0x33));

// Tier ladders as the ledgers' class_map lists them (order is the ledgers' own; the Sacred/Divine order is a default, a dial for within-one).
export const LADDER = {
    creatures: ['dormant', 'awakened', 'fallen', 'corrupted', 'transcendent', 'supreme', 'divine'],
    artifacts: ['dormant', 'awakened', 'ascended', 'transcendent', 'supreme', 'divine', 'sacred'],
};
const POOLS = {creatures: 'ss.creature.', artifacts: 'ss.item.'};
const PRIVATE = ['/Users/weiwei/code/yet-another-idle-rpg/', root].map(b => join(b, 'docs/research/power-catalogues-2026-11-16/private/')).find(d => existsSync(join(d, 'nc_shadow_slave_creatures_packets.json')));
const readAbs = p => JSON.parse(readFileSync(p, 'utf8'));
const STOP = new Set(['the', 'of', 'a', 'an', 'and', 'in', 'to', 'for', 'with', 'from', 's']);
const RANKWORDS = new Set([...LADDER.creatures, ...LADDER.artifacts, 'tier', 'rank']);
const CLASSWORDS = ['beast', 'monster', 'demon', 'devil', 'tyrant', 'terror', 'titan', 'abomination', 'horror'];
const tokens = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]s\b/g, '').split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t) && !RANKWORDS.has(t));
const median = xs => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : Math.floor((s[m - 1] + s[m]) / 2); };
const mode = xs => { const c = new Map(); for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1); return [...c].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0]; };

export function load() {
    const out = {};
    const all = {};
    for (const name of ['creatures', 'artifacts', 'echoes']) {
        const rows = readAbs(join(PRIVATE, `nc_shadow_slave_${name}_packets.json`));
        for (const x of rows) {
            const text = x.evidence.join(' ');
            const ch = [...text.matchAll(/\[en b1 c(\d+) p\d+\]/g)].map(m => Number(m[1]));
            const ladder = LADDER[name === 'echoes' ? 'creatures' : name];
            const rank = x.label && ladder ? ladder.indexOf(x.label) + 1 || null : null;
            all[x.id] = {id: x.id, pool: name, name: x.name, aliases: x.aliases ?? [], first: ch.length ? Math.min(...ch) : null, last: ch.length ? Math.max(...ch) : null, mentions: x.windows,
                toks: new Set([...tokens(x.name)]), klass: x.klass ?? CLASSWORDS.find(c => new RegExp(`\\b${c}`, 'i').test(x.name)) ?? null,
                links: [...new Set([...text.matchAll(/ss\.(?:creature|item|echo|person)\.[a-z0-9._-]+/g)].map(m => m[0]))].filter(i => i !== x.id), rank, stated: rank != null, label: x.label ?? null};
        }
    }
    for (const [name, prefix] of Object.entries(POOLS)) out[name] = Object.values(all).filter(r => r.pool === name);
    out.echoes = Object.values(all).filter(r => r.pool === 'echoes');
    return {all, pools: out};
}
export const DATA = PRIVATE ? load() : null;

// ---- Candidate rules. ctx = {rank (visible id -> rank), pool (visible ids), baseline, rows, ladder}. A rule returns a rank or null (abstain). ----
export const RULES = {
    // Mechanism: the source. A record tied to another record of the same ledger in its own evidence (the creature a shard came from, the Memory its
    // enchantment sits on, the foe an Echo was taken from) shares that record's tier. Median of the visible linked ranks.
    source: (c, r) => { const k = r.links.map(i => c.rank[i]).filter(Boolean); return k.length ? median(k) : null; },
    // Mechanism: the same, but the link may be to a record that states a tier through any pool, mapped by tier word (dial: Fallen and Corrupted
    // have no Memory twin, so they map to the nearest Memory tier by rank order).
    crossSource: (c, r) => { const k = r.links.map(i => c.cross(i)).filter(Boolean); return k.length ? median(k) : null; },
    // Mechanism: tier progression. The story climbs, so a record first met later takes a higher tier. Median of the k nearest first chapters.
    story: (c, r, k = 5) => {
        if (!r.first) return null;
        const near = c.pool.filter(i => c.rows[i].first).sort((a, b) => Math.abs(c.rows[a].first - r.first) - Math.abs(c.rows[b].first - r.first)).slice(0, k);
        return near.length >= 3 ? median(near.map(i => c.rank[i])) : null;
    },
    story3: (c, r) => RULES.story(c, r, 3), story9: (c, r) => RULES.story(c, r, 9),
    // Mechanism: the class word. A Beast, Monster, Demon, Devil, Tyrant, Terror or Titan names a power step of its own; median tier of that class.
    klass: (c, r) => { if (!r.klass) return null; const k = c.pool.filter(i => c.rows[i].klass === r.klass); return k.length >= 3 ? median(k.map(i => c.rank[i])) : null; },
    // Resemblance (the baseline rule): shared name stem. Median tier of records sharing a non-rank name token.
    stem: (c, r) => { const k = c.pool.filter(i => [...r.toks].some(t => c.rows[i].toks.has(t))); return k.length >= 2 ? median(k.map(i => c.rank[i])) : null; },
    baseline: c => c.baseline,
};

function context(pool, ladder, hiddenFolds) {
    const rows = Object.fromEntries(DATA.pools[pool].map(r => [r.id, r]));
    const stated = DATA.pools[pool].filter(r => r.stated);
    const rank = {};
    for (const r of stated) if (!hiddenFolds.includes(foldOf(r.id))) rank[r.id] = r.rank;
    const cross = id => { const o = DATA.all[id]; if (!o || !o.stated) return null; if (hiddenFolds.includes(foldOf(id))) return null; return crossRank(o, ladder); };
    return {rank, rows, pool: Object.keys(rank), baseline: Object.keys(rank).length ? mode(Object.values(rank)) : 1, ladder, cross};
}
// Cross-ledger map by tier word: a creature tier maps to the Memory tier of the same name, Fallen to Ascended and Corrupted to Transcendent (default, dial).
const CROSS = {fallen: 'ascended', corrupted: 'transcendent'};
function crossRank(o, ladder) { const w = o.label; const t = ladder.includes(w) ? w : CROSS[w] ?? (ladder.includes(Object.keys(CROSS).find(k => CROSS[k] === w)) ? w : null); const i = ladder.indexOf(t); return i < 0 ? null : i + 1; }

export function scoreSet(pool, order, fold) {
    const ladder = LADDER[pool], c = context(pool, ladder, fold === 5 ? [5] : [fold, 5]);
    const ids = DATA.pools[pool].filter(r => r.stated && foldOf(r.id) === fold);
    const t = {n: ids.length, exact: 0, within1: 0, baseExact: 0, baseWithin1: 0, by: {}, misses: []};
    for (const r of ids) {
        let hit = null, by = 'baseline';
        for (const name of order) { const v = RULES[name](c, r); if (v != null) { hit = v; by = name; break; } }
        if (hit == null) hit = c.baseline;
        const ok = hit === r.rank, w = Math.abs(hit - r.rank) <= 1;
        t.exact += ok; t.within1 += w; t.baseExact += c.baseline === r.rank; t.baseWithin1 += Math.abs(c.baseline - r.rank) <= 1;
        const b = t.by[by] ??= {n: 0, exact: 0, within1: 0, baseExact: 0, baseWithin1: 0}; b.n++; b.exact += ok; b.within1 += w; b.baseExact += c.baseline === r.rank; b.baseWithin1 += Math.abs(c.baseline - r.rank) <= 1;
        if (!ok) t.misses.push({id: r.id, name: r.name, by, derived: ladder[hit - 1], canon: r.label, off: Math.abs(hit - r.rank)});
    }
    return t;
}
const sum = rs => ({n: rs.reduce((a, r) => a + r.n, 0), exact: rs.reduce((a, r) => a + r.exact, 0), within1: rs.reduce((a, r) => a + r.within1, 0), baseExact: rs.reduce((a, r) => a + r.baseExact, 0), baseWithin1: rs.reduce((a, r) => a + r.baseWithin1, 0)});
export const SETS = {
    creatures: ['source', 'story3', 'klass'], artifacts: ['crossSource', 'source', 'story3'],
};
const names = Object.keys(RULES).filter(x => x !== 'baseline');
const cmd = process.argv[2];
const pct = (a, n) => `${(100 * a / n).toFixed(0)}%`;

if (cmd === 'freeze') {
    const folds = {};
    for (const pool of Object.keys(POOLS)) { folds[pool] = {1: [], 2: [], 3: [], 4: [], 5: []}; for (const r of DATA.pools[pool].filter(x => x.stated)) folds[pool][foldOf(r.id)].push(r.id); }
    writeFileSync(join(root, FOLDS_FILE), `${JSON.stringify({meta: {pass: 'PWC99, PWC100', date: '2026-11-17', rule: 'stated rows = records whose packet states a tier word (creatures 61, artifacts 27). Fold 5 = sha1(id)[0] < 0x33 (GKM429); folds 1-4 = floor((sha1(id)[0] - 0x33) * 4 / 205) + 1. Frozen before any candidate is scored.', counts: Object.fromEntries(Object.entries(folds).map(([p, f]) => [p, Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.length]))]))}, folds}, null, 1)}\n`);
    console.log(JSON.stringify(Object.fromEntries(Object.entries(folds).map(([p, f]) => [p, Object.values(f).map(v => v.length)]))));
} else if (cmd === 'dev') {
    for (const pool of Object.keys(POOLS)) {
        const orders = [[], ...names.map(n => [n]), ['source', 'story'], ['source', 'story', 'klass'], ['source', 'story3', 'klass'], ['source', 'story9', 'klass'], ['crossSource', 'source', 'story'], ['crossSource', 'source', 'story', 'stem'], ['source', 'stem'], ['story', 'stem'], ['stem', 'story'], ['source', 'klass', 'story'], ['stem']];
        console.log(`== ${pool}`);
        for (const o of orders) { const per = [1, 2, 3, 4].map(f => scoreSet(pool, o, f)), s = sum(per); console.log((o.join(' > ') || 'baseline only').padEnd(40), `${s.exact}/${s.n} (${pct(s.exact, s.n)})`.padEnd(14), `w1 ${pct(s.within1, s.n)}`.padEnd(9), `base ${pct(s.baseExact, s.n)}/${pct(s.baseWithin1, s.n)}`, per.map(p => `${p.exact}/${p.n}`).join(' ')); }
    }
} else if (cmd === 'final') {
    const chosen = process.argv[3] ? JSON.parse(process.argv[3]) : SETS;
    if (existsSync(join(root, RESULT_FILE)) && !process.argv.includes('--again')) { console.error('fold 5 was already scored once; the result is in', RESULT_FILE); process.exit(1); }
    const out = {meta: {pass: 'PWC99, PWC100', date: '2026-11-17', note: 'Fold 5 scored once per pool, after each rule set was chosen on folds 1-4. Resemblance = the stem rule on the same fold; baseline = most common visible tier. Abstain falls back to the baseline. Within-one is order-dependent (ladder order is a default).'}, pools: {}};
    for (const pool of Object.keys(POOLS)) {
        const set = scoreSet(pool, chosen[pool], 5), stem = scoreSet(pool, ['stem'], 5), single = Object.fromEntries(chosen[pool].map(n => [n, scoreSet(pool, [n], 5)]));
        out.pools[pool] = {ruleSet: chosen[pool], ladder: LADDER[pool], final: {n: set.n, exact: set.exact, within1: set.within1, by: set.by, misses: set.misses}, resemblance: {rule: 'stem', n: stem.n, exact: stem.exact, within1: stem.within1, by: stem.by},
            baseline: {exact: set.baseExact, within1: set.baseWithin1}, singleRules: Object.fromEntries(Object.entries(single).map(([k, v]) => [k, {n: v.n, exact: v.exact, within1: v.within1, applied: v.by[k] ?? {n: 0, exact: 0, within1: 0}}]))};
        console.log(pool, JSON.stringify({set: [set.exact, set.within1, set.n], stem: [stem.exact, stem.within1], base: [set.baseExact, set.baseWithin1], by: set.by}));
    }
    writeFileSync(join(root, RESULT_FILE), `${JSON.stringify(out, null, 1)}\n`);
} else if (cmd === 'derive') {
    const res = rd(RESULT_FILE), out = {meta: {pass: 'PWC92, PWC99, PWC100', date: '2026-11-17', note: 'Derived tiers for rows that state none. Visible = every stated row (all folds). A rule fires only when its inputs exist; rows no rule reaches stay unranked, never baseline.'}, pools: {}};
    for (const pool of [...Object.keys(POOLS), 'echoes']) {
        const base = pool === 'echoes' ? 'creatures' : pool, ladder = LADDER[base], c = context(base, ladder, []);
        const order = res.pools[base].ruleSet, rows = DATA.pools[pool].filter(r => !r.stated), byRule = {}, derived = {};
        for (const r of rows) for (const name of order) { const v = RULES[name](c, r); if (v != null) { derived[r.id] = {rank: ladder[v - 1], rule: name, inputs: name === 'source' || name === 'crossSource' ? r.links.filter(i => c.cross(i)) : name.startsWith('story') ? [`first chapter ${r.first}`] : [`class ${r.klass}`]}; (byRule[name] ??= {n: 0, tiers: {}}).n++; byRule[name].tiers[ladder[v - 1]] = (byRule[name].tiers[ladder[v - 1]] ?? 0) + 1; break; } }
        out.pools[pool] = {rows: rows.length, derived: Object.keys(derived).length, byRule, ladder, items: derived};
        console.log(pool, rows.length, Object.keys(derived).length, JSON.stringify(Object.fromEntries(Object.entries(byRule).map(([k, v]) => [k, v.n]))));
    }
    writeFileSync(join(root, DERIVED_FILE), `${JSON.stringify(out, null, 1)}\n`);
}

if (cmd === 'exceptions') {
    // Fold-5 misses of two tiers or more become named exceptions (PWC92, PC84); one-tier misses stay in ss_rank_search.json as misses.
    const res = rd(RESULT_FILE), rows = [];
    for (const [pool, p] of Object.entries(res.pools)) for (const m of p.final.misses) if (m.off >= 2) rows.push({id: m.id, name: m.name, pool, rule: m.by, derived: m.derived, canon: m.canon, tiersOff: m.off, state: 'authored:story-time-lags-stated-tier', reason: 'mechanical class only; the in-world reason needs a chapter read (not done)'});
    const out = {meta: {pass: 'PWC92, PWC99, PWC100', date: '2026-11-17', rule: 'fold-5 misses of two tiers or more'}, exceptions: rows, count: rows.length, factsPerRule: Object.fromEntries(Object.entries(rd(DERIVED_FILE).pools).map(([p, v]) => [p, Object.fromEntries(Object.entries(v.byRule).map(([k, b]) => [k, b.n]))]))};
    writeFileSync(join(root, 'docs/coverage/ss_rank_exceptions.json'), `${JSON.stringify(out, null, 1)}\n`);
    console.log(JSON.stringify({count: rows.length}));
}

if (cmd === 'ledger') {
    // Write rank, rankBasis and a derived block on artifact rows whose derived tier came from a scored rule (idempotent). Creature rows get none while
    // the creature rule fails its baseline (PWC100: scored, never relabelled by script); echoes are unscored. Needs derivation_rules.json regenerated first.
    const scored = rd('docs/coverage/derivation_rules.json').rules, d = rd(DERIVED_FILE).pools.artifacts.items;
    const file = join(root, 'docs/coverage/shadow_slave_artifacts.jsonl');
    const rule = scored.find(r => r.id === 'ss.rank.artifacts-story-time');
    let n = 0;
    const lines = readFileSync(file, 'utf8').split('\n').map(l => {
        if (!l.trim()) return l;
        const row = JSON.parse(l), x = d[row.id];
        if (!x) return l;
        n++;
        const {rank: _r, rankBasis: _b, derived: _d, ...rest} = row;
        return JSON.stringify({...rest, rank: x.rank, rankBasis: 'derived', derived: {rule: rule.id, inputs: x.inputs, confidence: {...rule.confidence, version: rule.version}}});
    });
    writeFileSync(file, lines.join('\n'));
    console.log('patched', n);
}
