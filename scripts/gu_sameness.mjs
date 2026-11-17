#!/usr/bin/env node
// Sameness by meaning for generated Gu (PWC47, proposals, 2026-11-17). The first copy check matched names; this judges each
// generated Gu whose nearest canon name overlaps by 0.3 or more against that canon Gu with both effect sentences, paths and ranks
// side by side. Luna judges, Haiku second-reads, Sol takes the disagreements (AU17, PWC44; scripts/ri_alias_pairs.mjs triJudge).
//   node scripts/gu_sameness.mjs run [--sync]   judge every candidate (replies cache under work/, so a rerun pays only for new ones)
//   node scripts/gu_sameness.mjs write          write docs/coverage/gu_sameness.json, read by `gu_generator.mjs ledger`
// Outcomes: copy (drop: same job as the canon Gu), variant_of (keep and link: a series member, a mortal or immortal form, a flavour step),
// distinct (keep: only a shared word). Default and dial: a near-name with a different effect is a variant_of, and a copy needs the effect to match too.
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {screened, DIR} from './gu_generator.mjs';
import {GU_FUNCTION} from '../src/world_packs/gu_effect_pack.js';
import {triJudge, WORK} from './ri_alias_pairs.mjs';

const root = new URL('..', import.meta.url).pathname;
const read = p => JSON.parse(readFileSync(join(root, p), 'utf8'));
export const THRESHOLD = 0.3;

export function candidates() {
    const {list} = screened();
    const aliases = existsSync(join(root, DIR + 'ri_aliases.json')) ? read(DIR + 'ri_aliases.json').names : {};
    const out = [], seen = new Set();
    for (const {g, stem, best, bestJ, same} of list) {
        if (same || !best || bestJ < THRESHOLD || seen.has(stem)) continue;
        seen.add(stem);
        const spoken = fn => { const x = GU_FUNCTION[fn]; return x ? `${x.verb} ${x.object}` : 'unknown'; };
        const known = aliases[best.id] ?? {names: [], zh: []};
        out.push({id: `s${out.length}`.padStart(4, '0'), name: g.name, nearest: best.id, overlap: Math.round(bestJ * 100) / 100,
            user: [`Generated Gu: ${g.name} | path ${g.path} | rank ${g.rank} (the model's guess) | effect: ${g.effect} | grammar: ${g.verb} ${g.object} on ${g.target}, ${g.time}`,
                `Canon Gu: ${best.name}${known.names.length > 1 ? ` (also: ${known.names.filter(n => n !== best.name).slice(0, 3).join(', ')})` : ''} | Chinese ${known.zh.slice(0, 2).join(', ') || '-'} | path ${best.path ?? '-'} | rank ${best.rank ?? '?'} (${best.rankBasis ?? 'unknown'}) | effect family: ${spoken(best.fn)} (${best.fnBasis ?? 'unknown'})`].join('\n')});
    }
    return out.map((c, i) => ({...c, id: `s${String(i).padStart(3, '0')}`}));
}

const SYSTEM = [
    'You judge whether a generated Gu duplicates a canon Gu of Reverend Insanity. A Gu is a living worm with one narrow ability, bound to a Dao path and a rank.',
    'The canon catalogue is built on series: Strength Gu by beast, Light Gu by kind, mortal and immortal forms of one Gu, liquor worms by flavour count, gems by colour. A name that shares a word with a canon Gu usually names a series member, not a copy.',
    'Answer copy only when the generated Gu does the same job as the canon Gu (same effect family, same path, a rank within about one step): it would be the canon Gu again under a new name.',
    'Answer variant_of when it is a related member (a different beast, flavour step, gem, form or rank step) or has a different effect: keep it and link it. Answer distinct when only a word is shared and the two are not a series.',
    'The canon effect family is coarse and sometimes unknown; when it is unknown, judge by name, path and rank and lean to variant_of. Reply with JSON only.'].join(' ');
const SCHEMA = {type: 'object', properties: {verdict: {type: 'string', enum: ['copy', 'variant_of', 'distinct']}, why: {type: 'string'}}, required: ['verdict', 'why'], additionalProperties: false};

async function run(argv) {
    const items = candidates();
    const r = await triJudge({name: 'gu_sameness', items: items.map(({id, user}) => ({id, user})), system: SYSTEM, schema: SCHEMA, verdictOf: x => x?.verdict ?? null, argv, solMaxUsd: 2});
    writeFileSync(join(WORK, 'gu_sameness_result.json'), JSON.stringify({items: items.map(({id, name, nearest, overlap}) => ({id, name, nearest, overlap})), luna: r.luna, haiku: r.haiku, sol: r.sol, disputed: r.disputed}));
    console.log(JSON.stringify({candidates: items.length, disputed: r.disputed.length}));
}

function write() {
    const r = JSON.parse(readFileSync(join(WORK, 'gu_sameness_result.json'), 'utf8'));
    const verdicts = {}, tally = {}, dropped = existsSync(join(WORK, 'gu_generated_dropped_round8.json')) ? JSON.parse(readFileSync(join(WORK, 'gu_generated_dropped_round8.json'), 'utf8')) : [];
    for (const it of r.items) {
        const l = r.luna[it.id]?.reply, h = r.haiku[it.id]?.reply, s = r.sol[it.id]?.reply;
        if (!l && !h) continue;
        const agree = l && h && l.verdict === h.verdict;
        const verdict = agree ? l.verdict : s?.verdict ?? l?.verdict ?? h.verdict;
        tally[verdict] = (tally[verdict] ?? 0) + 1;
        verdicts[it.name] = {verdict, nearest: it.nearest, overlap: it.overlap, why: (agree ? l : s ?? l ?? h).why,
            basis: agree ? 'Luna and Haiku agree' : s ? 'Luna and Haiku disagree; Sol judged' : 'Luna and Haiku disagree; Luna kept (no Sol answer)',
            readers: {luna: l?.verdict ?? null, haiku: h?.verdict ?? null, sol: s?.verdict ?? null}, wasDropped: dropped.some(d => d.name === it.name && d.why === 'near-duplicate')};
    }
    const sorted = Object.fromEntries(Object.entries(verdicts).sort(([a], [b]) => a.localeCompare(b)));
    const dropsRechecked = Object.values(sorted).filter(v => v.wasDropped), keptRechecked = Object.values(sorted).filter(v => !v.wasDropped);
    const by = list => list.reduce((c, v) => ({...c, [v.verdict]: (c[v.verdict] ?? 0) + 1}), {});
    writeFileSync(join(root, DIR + 'gu_sameness.json'), JSON.stringify({meta: {proposal: 'PWC47', date: '2026-11-17', threshold: THRESHOLD,
        roles: 'Luna judges, Haiku second-reads, Sol only on their disagreements (AU17)', counts: {candidates: Object.keys(sorted).length, all: tally, namedDrops: by(dropsRechecked), keptNearNames: by(keptRechecked)}}, verdicts: sorted}, null, 0) + '\n');
    console.log(JSON.stringify({candidates: Object.keys(sorted).length, all: tally, namedDrops: by(dropsRechecked), keptNearNames: by(keptRechecked)}));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const mode = process.argv[2], argv = process.argv.slice(3);
    if (mode === 'run') await run(argv.length ? argv : ['--sync']);
    else if (mode === 'write') write();
    else console.log('usage: run | write');
}
