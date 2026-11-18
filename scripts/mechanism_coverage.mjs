#!/usr/bin/env node
// Mechanism coverage (MF3, 2026-11-18, proposal). "Can the engine cover anything" as a number: the share of blocked ledger rows
// whose slug maps to a substrate whose owner can already land every verb the slug needs. Reads
// docs/research/power-catalogues-2026-11-16/mechanism_map.json and the blocked states in docs/coverage/*.jsonl.
// Row tiers: owned (all verbs built), partial (some built), designed (mapped, no verb built), reading (label debt, no mechanism
// yet named; excluded from the mechanism denominator), unmapped (slug absent from the map). Every row also has the narrative
// fallback: its text can always be shown, so nothing is unrepresentable, only unrun.
//   node scripts/mechanism_coverage.mjs            print the report
//   node scripts/mechanism_coverage.mjs --json     machine-readable
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readMap as readSlugMap, ledgerFiles} from './slug_normalize.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MECHANISM_MAP = 'docs/research/power-catalogues-2026-11-16/mechanism_map.json';
export const readMechanismMap = (file = path.join(root, MECHANISM_MAP)) => JSON.parse(fs.readFileSync(file, 'utf8'));

/** Tier of one slug entry against the substrate table. */
export function tierOf(entry, substrates) {
    if (!entry) return 'unmapped';
    if (entry.class === 'reading') return 'reading';
    const s = substrates[entry.substrate];
    if (!s) return 'unmapped';
    const built = entry.verbs.filter(v => s.built.includes(v)).length;
    return built === entry.verbs.length ? 'owned' : built ? 'partial' : 'designed';
}

/** Problems with the map itself: unknown substrate or verb, canonical slug missing, built verb outside the vocabulary, missing owner file. */
export function checkMap(map, slugMap = readSlugMap(), fileExists = f => fs.existsSync(path.join(root, f))) {
    const problems = [], subs = map.substrates;
    for (const [n, s] of Object.entries(subs)) {
        for (const v of s.built) if (!s.verbs.includes(v)) problems.push(`${n}: built verb ${v} is not in its verbs`);
        for (const f of s.files) if (!fileExists(f)) problems.push(`${n}: owner file ${f} does not exist`);
        if (s.built.length && !s.files.length) problems.push(`${n}: built verbs need an owner file`);
    }
    for (const group of ['slugs', 'abilities', 'families'])
        for (const [k, e] of Object.entries(map[group])) {
            if (e.class === 'reading' || e.narrative) continue;
            if (!subs[e.substrate]) { problems.push(`${group} ${k}: unknown substrate ${e.substrate}`); continue; }
            for (const v of e.verbs) if (!subs[e.substrate].verbs.includes(v)) problems.push(`${group} ${k}: verb ${v} is not a ${e.substrate} verb`);
        }
    for (const s of slugMap.canonical) if (!map.slugs[s]) problems.push(`slug ${s} is canonical but has no mechanism entry`);
    for (const s of Object.keys(map.slugs)) if (!slugMap.canonical.includes(s)) problems.push(`slug ${s} is mapped but not canonical`);
    return problems;
}

/** Blocked rows per slug, after folding named near-duplicates (the same fold slug_normalize applies). */
export function blockedCounts(slugMap = readSlugMap(), dir = path.join(root, 'docs/coverage')) {
    const counts = {};
    for (const f of ledgerFiles(dir))
        for (const line of fs.readFileSync(path.join(dir, f), 'utf8').split('\n')) {
            if (!line.trim()) continue;
            let slug = /^blocked:(.+)$/.exec(JSON.parse(line).state ?? '')?.[1];
            if (!slug) continue;
            if (slugMap.fold[slug]) slug = slugMap.fold[slug].to;
            for (const [p, r] of Object.entries(slugMap.foldPrefix)) if (slug.startsWith(p)) slug = r.to;
            counts[slug] = (counts[slug] ?? 0) + 1;
        }
    return counts;
}

const pct = (n, d) => d ? Math.round(1000 * n / d) / 10 : 0;

export function report(map = readMechanismMap(), counts = blockedCounts()) {
    const tiers = {owned: 0, partial: 0, designed: 0, reading: 0, unmapped: 0};
    const bySubstrate = {}, missingVerbs = {}, unmappedSlugs = [];
    for (const [slug, n] of Object.entries(counts)) {
        const e = map.slugs[slug], t = tierOf(e, map.substrates);
        tiers[t] += n;
        if (t === 'unmapped') unmappedSlugs.push(slug);
        if (!e?.substrate) continue;
        const b = bySubstrate[e.substrate] ??= {rows: 0, owned: 0, partial: 0, designed: 0};
        b.rows += n; b[t] += n;
        for (const v of e.verbs) if (!map.substrates[e.substrate].built.includes(v)) { const k = `${e.substrate}.${v}`; missingVerbs[k] = (missingVerbs[k] ?? 0) + n; }
    }
    const total = Object.values(tiers).reduce((a, b) => a + b, 0), mech = total - tiers.reading;
    const abilityTiers = {};
    for (const [group, label] of [['abilities', 'XA'], ['families', 'FA']])
        for (const [k, e] of Object.entries(map[group])) {
            const t = e.narrative ? 'narrative-only' : tierOf(e, map.substrates);
            (abilityTiers[label] ??= {})[t] = (abilityTiers[label][t] ?? 0) + 1;
            if (e.narrative || t === 'unmapped') (abilityTiers.gaps ??= []).push(k);
        }
    return {
        blockedRows: total, mechanismRows: mech, readingRows: tiers.reading, tiers,
        shareOwned: pct(tiers.owned, mech), shareOwnedOrPartial: pct(tiers.owned + tiers.partial, mech),
        shareMapped: pct(mech - tiers.unmapped, mech), unmappedSlugs, bySubstrate,
        missingVerbs: Object.entries(missingVerbs).sort((a, b) => b[1] - a[1]), abilityTiers,
    };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const map = readMechanismMap(), problems = checkMap(map);
    if (problems.length) { console.error(`mechanism map problems:\n${problems.join('\n')}`); process.exit(1); }
    const r = report(map);
    if (process.argv.includes('--json')) console.log(JSON.stringify(r, null, 1));
    else {
        console.log(`Blocked rows: ${r.blockedRows}; label debt (reading): ${r.readingRows}; mechanism rows: ${r.mechanismRows}`);
        console.log(`Mapped to a substrate: ${r.shareMapped}%. Owner built for every verb: ${r.shareOwned}%. Built for some verb: ${r.shareOwnedOrPartial}% (owned plus partial).`);
        console.log(`Tiers (rows): ${JSON.stringify(r.tiers)}`);
        console.log('By substrate (rows, owned, partial, designed):');
        for (const [s, b] of Object.entries(r.bySubstrate).sort((a, b) => b[1].rows - a[1].rows)) console.log(`  ${s}: ${b.rows}, ${b.owned}, ${b.partial}, ${b.designed}`);
        console.log('Missing verbs by blocked rows (the build order):');
        for (const [k, n] of r.missingVerbs.slice(0, 15)) console.log(`  ${k}: ${n}`);
        console.log(`Unmapped slugs: ${r.unmappedSlugs.join(', ') || 'none'}`);
        console.log(`XA/FA tiers: ${JSON.stringify(r.abilityTiers)}`);
    }
}
