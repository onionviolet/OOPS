// Split retry (READINESS_AND_SCOPE round 13, C20): shards a pass left cut off (`<prefix>_<pass>.partial`) or unread are split into one-chapter
// shards and re-planned, because a dense two-chapter shard truncates at any effort. The first chapter keeps the old prefix, so its full output
// replaces the partial one; later chapters get their own chapter prefix, which the world's census pattern already matches.
//   node scripts/lead_run/make_split_retry.mjs --keys lotm2,lotm3 --passes census,people --tag s1 [--run 2026-10-28s] [--ceiling usd]
// Plans and run files only: nothing is sent. The run file starts `approval: PENDING`.
import {readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync} from 'node:fs';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bookShards, passDone, planObject} from './make_book_plans.mjs';
import {requestsFromPlan, estimateCost} from './batch_lib.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const PLANS = join(root, 'docs/gm/dispatch/batch-reading-2026-10-27/plans');
const pad = n => String(n).padStart(3, '0');

/** Chapter chunks of a shard text: each starts at a `=== ` chapter header and keeps it. */
export function splitChapters(text) {
    const lines = text.split('\n'), out = [];
    for (const line of lines) {
        if (line.startsWith('=== ')) out.push([]);
        if (out.length) out.at(-1).push(line);
    }
    return out.map(l => l.join('\n').replace(/\n+$/, '') + '\n');
}

/** Chapter number from a header line (`=== 第47章 …` or `=== Chapter 47 …`). */
export function headerChapter(chunk) {
    const h = chunk.split('\n')[0];
    const m = /第(\d+)章/.exec(h) || /Chapter\s+(\d+)/i.exec(h) || /\bc(?:h)?\s*(\d+)\b/i.exec(h);
    return m ? Number(m[1]) : null;
}

/** Retry units for one book and pass: one per chapter of every shard the pass left cut off or unread. */
export function splitUnits(b, priv, files, pass) {
    const have = new Set(files), units = [];
    for (const s of bookShards(b, files)) {
        if (passDone(pass, s.prefix, have)) continue;
        const text = readFileSync(join(priv, s.file), 'utf8');
        const chunks = splitChapters(text);
        if (chunks.length < 2) { units.push({prefix: s.prefix, shard: join(priv, s.file), base: s.base, chapters: s.chapters}); continue; }
        mkdirSync(join(priv, 'split'), {recursive: true});
        chunks.forEach((chunk, i) => {
            const ch = headerChapter(chunk) ?? (Number(s.chapters.split('-')[0]) + i);
            const file = join(priv, 'split', `shard_${b.key}_ch${pad(ch)}-${pad(ch)}.txt`);
            writeFileSync(file, chunk);
            units.push({prefix: i === 0 ? s.prefix : `${b.key}c${pad(ch)}`, shard: file, base: `${b.book > 1 ? b.book : ''}${pad(ch)}01`, chapters: `${ch}-${ch}`});
        });
    }
    return units;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), flag = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
    const registry = JSON.parse(readFileSync(join(PLANS, 'books.json'), 'utf8'));
    const keys = new Set((flag('--keys') || '').split(',').filter(Boolean)), passes = (flag('--passes') || 'census').split(','), tag = flag('--tag') || 's1';
    const steps = Object.fromEntries(passes.map(p => [p, []])), report = [];
    let world = null;
    for (const b of registry.books.filter(x => keys.has(x.key))) {
        const priv = join(root, b.dir), files = existsSync(priv) ? readdirSync(priv) : [];
        world = b.world;
        const worldKeys = registry.books.filter(x => x.world === b.world).map(x => x.key).join('|');
        const glossary = {...(b.wiki ? {wiki: join(root, b.wiki)} : {}), censusDir: priv, censusMatch: b.censusMatch || `^(${worldKeys})c\\d{3,}m_census\\.jsonl$`};
        for (const pass of passes) {
            const shards = splitUnits(b, priv, files, pass);
            if (!shards.length) continue;
            const label = `${b.key}-${pass}-${tag}`, name = `${b.key}_${pass}_${tag}`;
            const plan = planObject({world: b.world, lang: b.lang, pass, priv, glossary, label, shards});
            writeFileSync(join(PLANS, `${name}.json`), JSON.stringify(plan, null, 1) + '\n');
            const cap = Math.ceil(estimateCost(requestsFromPlan(plan), plan.maxTokens, plan.model).usdBatch * 100) / 100;
            steps[pass].push({plan: relative(root, join(PLANS, `${name}.json`)), cap, label});
            report.push({label, requests: shards.length, cap});
        }
    }
    const runName = flag('--run');
    if (runName && world) {
        const s = passes.map(p => ({name: p, gate: 'stop', labels: steps[p]})).filter(x => x.labels.length);
        const capTotal = Number(s.flatMap(x => x.labels).reduce((t, l) => t + l.cap, 0).toFixed(2));
        const run = {name: `${runName}-${world}`, approval: 'PENDING: needs Weibao\'s go phrase.', ceilingUsd: Number(flag('--ceiling')) || capTotal, capTotal, pooledStop: true, steps: s};
        writeFileSync(join(PLANS, `overnight_${runName}-${world}.json`), JSON.stringify(run, null, 1) + '\n');
        report.push({run: run.name, capTotal, ceilingUsd: run.ceilingUsd});
    }
    for (const r of report) console.log(JSON.stringify(r));
}
