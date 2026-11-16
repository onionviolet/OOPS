#!/usr/bin/env node
// GKM427 join: matches each Gu move in the private review index (moves and wiki move leads) to the paid
// Reverend Insanity reader claims (readers/*-CLAIMS.json, paraphrased and tracked) by name, and lists the
// catalogue Gu kinds each matched claim names as candidate components. Local and deterministic; it labels
// nothing by itself. A Haiku pass reads only the matched claims to settle roles (GKM427, GKM429, GKM430).
// Usage: node scripts/ri_move_claims_join.mjs [path/to/gu-identities.json]
import {readFileSync, readdirSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const privatePath = 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json';
const indexPath = [process.argv[2], join(root, privatePath)].find(p => p && existsSync(p));
if (!indexPath) throw Error('The private Gu review index is needed (gitignored); pass its path.');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const readers = join(root, 'docs/research/novels/full-book/reverend-insanity/readers');
const outDir = join(root, 'docs/research/reverend-insanity-move-claims-2026-11-16');

const norm = s => ` ${String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()} `;
const claims = readdirSync(readers).filter(f => f.endsWith('-CLAIMS.json')).sort().flatMap(file => {
    const data = JSON.parse(readFileSync(join(readers, file), 'utf8'));
    return (data.claims ?? []).map(c => ({file, id: c.id, chapter: c.chapter, blocks: c.blocks,
        text: norm(`${c.claim ?? ''} ${(c.entities ?? []).join(' ')}`)}));
});

// Gu kind names for candidate components: drop a trailing "Gu"/"Immortal Gu" so "Moonlight Gu" also matches "Moonlight".
const kindNames = index.records.filter(r => r.status !== 'reference-page').map(r => {
    const name = r.saga?.name ?? r.fandom?.name ?? r.id;
    const short = name.replace(/\s+(immortal\s+)?gu$/i, '');
    // A kind counts only where the claim writes its name followed by "Gu" ("Moonlight Gu", "Moonlight Immortal Gu"):
    // kinds named After, Three or Fight would otherwise match ordinary words.
    const bare = norm(short).trim();
    return {id: r.id, name, key: ` ${bare} `, keys: [` ${bare} gu `, ` ${bare} immortal gu `]};
}).filter(k => k.key.trim().length >= 3);

const leadName = lead => lead.saga?.name ?? lead.fandom?.name;
const leadId = lead => `lead:${(lead.saga?.url ?? lead.fandom?.url).replace(/[?#].*$/, '').replace(/\/$/, '').split('/').pop().toLowerCase()}`;
const moves = [
    ...index.moves.map(m => ({id: m.id, name: m.family, kind: 'chapter-move', hint: null})),
    ...index.move_candidates.records.map(l => ({id: leadId(l), name: leadName(l), kind: 'wiki-lead', tier: l.saga?.tier ?? null,
        hint: l.saga?.chapter_hint ?? null})),
];

const rows = moves.map(move => {
    const key = norm(move.name);
    const short = norm(move.name.replace(/\s+killer move$/i, ''));
    const keys = [...new Set([key, short])].filter(k => k.trim().split(' ').length >= 2 || k.trim().length >= 8);
    const hits = claims.filter(c => keys.some(k => c.text.includes(k)));
    const parts = new Map();
    for (const c of hits) for (const k of kindNames) if (k.keys.some(x => c.text.includes(x)) && !keys.some(m => m.includes(k.key)))
        parts.set(k.id, (parts.get(k.id) ?? 0) + 1);
    return {id: move.id, name: move.name, kind: move.kind, tier: move.tier ?? null, chapterHint: move.hint,
        claims: hits.map(c => ({id: c.id, chapter: c.chapter, blocks: c.blocks, file: c.file})),
        candidateKinds: [...parts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([id, n]) => ({id, claims: n}))};
});

const leads = rows.filter(r => r.kind === 'wiki-lead');
const matched = leads.filter(r => r.claims.length);
const withParts = matched.filter(r => r.candidateKinds.length);
const mortal = leads.filter(r => r.tier === 'mortal');
const summary = {
    readerClaims: claims.length, claimFiles: new Set(claims.map(c => c.file)).size,
    moves: rows.length, wikiLeads: leads.length, leadsWithClaims: matched.length,
    leadsWithCandidateKinds: withParts.length,
    mortalLeads: mortal.length, mortalLeadsWithClaims: mortal.filter(r => r.claims.length).length,
    leadsByTier: Object.fromEntries([...new Set(leads.map(r => r.tier ?? 'none'))].sort().map(t => [t, {
        leads: leads.filter(r => (r.tier ?? 'none') === t).length,
        withClaims: matched.filter(r => (r.tier ?? 'none') === t).length}])),
    claimsToRead: new Set(matched.flatMap(r => r.claims.map(c => c.id))).size,
};
writeFileSync(join(outDir, 'MOVE_CLAIMS_JOIN.json'),
    `{"summary": ${JSON.stringify(summary)},\n"rows": [\n${rows.map(r => JSON.stringify(r)).join(',\n')}\n]}\n`);
console.log(JSON.stringify(summary, null, 1));
