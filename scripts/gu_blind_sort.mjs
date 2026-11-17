#!/usr/bin/env node
// Blind sort (PWC95, PWC99, PWC100; proposal). One Haiku request per set: the fold-5 Gu with a shown rank, half the rank derived by a rule set and half the
// canon rank, shuffled with a fixed seed; the reader says which ranks look computed. Near 50% accuracy = the derived ranks pass as canon.
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" node scripts/gu_blind_sort.mjs
// Shown per Gu: name, band, path, type (wiki categories) and the rank. No prose, no effect text (none is held at wiki-tier for most rows).
import {writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
const {scoreSet, world, cohort, foldOf} = await import('./gu_rank_search.mjs');
const root = new URL('..', import.meta.url).pathname, MODEL = 'claude-haiku-5-5';
const ids = cohort.filter(id => foldOf(id) === 5).sort();
const sets = {chosen: scoreSet(['precursor', 'inverse', 'nextRank', 'firstChapter', 'family'], 5).derived, familyMedian: scoreSet(['family'], 5).derived};
const seeded = seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const usage = {input_tokens: 0, output_tokens: 0, calls: 0};
async function ask(items) {
    const list = items.map((x, i) => `${i + 1}. ${x.name} | band: ${x.band} | path: ${x.path ?? 'none'} | type: ${x.type ?? 'none'} | rank shown: ${x.shown}`).join('\n');
    const prompt = `Below are ${items.length} gu from the novel Reverend Insanity. For each, the rank shown is either the rank the novel states or a rank computed by a formula from the gu's family and history. About half are computed. For each number, judge whether its rank looks computed (true) or stated by the novel (false), and give your confidence 0 to 1 that it is computed. Reply with JSON only: [{"n":1,"computed":true,"p":0.7}, ...] covering every number.\n\n${list}`;
    const res = await fetch('https://api.anthropic.com/v1/messages', {method: 'POST', headers: {'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json'},
        body: JSON.stringify({model: MODEL, max_tokens: 8000, messages: [{role: 'user', content: prompt}]})});
    const j = await res.json(); if (!j.content) throw Error(JSON.stringify(j).slice(0, 300));
    usage.calls++; usage.input_tokens += j.usage.input_tokens; usage.output_tokens += j.usage.output_tokens;
    return {reply: j.content.filter(b => b.type === 'text').map(b => b.text).join(''), usage: j.usage};
}
const out = {meta: {pass: 'PWC95, PWC99, PWC100', date: '2026-11-17', model: MODEL, items: ids.length, note: 'Half the fold-5 Gu show the rule set\'s derived rank, half the canon rank (fixed seed). A Gu whose derived rank equals canon looks the same either way.'}, sets: {}};
mkdirSync(join(root, 'docs/research/power-catalogues-2026-11-16/work'), {recursive: true});
for (const [name, derived] of Object.entries(sets)) {
    const r = seeded(429), order = [...ids].sort(() => r() - 0.5), half = new Set(order.slice(0, Math.floor(order.length / 2)));
    const items = order.map(id => ({id, name: world.feat[id].name, band: world.feat[id].band, path: world.feat[id].path, type: world.feat[id].type, isDerived: half.has(id), shown: half.has(id) ? derived[id] : world.rank[id]}));
    const {reply, usage: u} = await ask(items);
    writeFileSync(join(root, `docs/research/power-catalogues-2026-11-16/work/gu_blind_${name}.json`), JSON.stringify({items, reply, usage: u}));
    const guess = JSON.parse(/\[[\s\S]*\]/.exec(reply)[0]), byN = new Map(guess.map(x => [x.n, x]));
    let right = 0, scored = 0, differ = 0, rightDiffer = 0;
    const ps = items.map((x, i) => ({p: byN.get(i + 1)?.p ?? 0.5, d: x.isDerived, same: x.isDerived && x.shown === world.rank[x.id]}));
    items.forEach((x, i) => { const g = byN.get(i + 1); if (!g) return; scored++; const ok = g.computed === x.isDerived; right += ok; if (x.isDerived && x.shown !== world.rank[x.id]) { differ++; rightDiffer += ok; } });
    // AUC of p against isDerived
    let win = 0, tie = 0, pairs = 0; for (const a of ps) for (const b of ps) if (a.d && !b.d) { pairs++; win += a.p > b.p; tie += a.p === b.p; }
    out.sets[name] = {scored, accuracy: Math.round(1000 * right / scored) / 1000, auc: Math.round(1000 * (win + tie / 2) / pairs) / 1000, derivedRanksThatDifferFromCanon: differ, accuracyOnThoseDerived: differ ? Math.round(1000 * rightDiffer / differ) / 1000 : null, usage: u};
}
out.usage = usage; out.costUsd = Math.round(1e6 * (usage.input_tokens * 0.1 + usage.output_tokens * 0.5) / 1e6) / 1e6;
writeFileSync(join(root, 'docs/coverage/gu_rank_blind_sort.json'), `${JSON.stringify(out, null, 1)}\n`);
console.log(JSON.stringify(out));
