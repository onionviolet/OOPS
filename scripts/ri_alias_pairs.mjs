#!/usr/bin/env node
// Translation-pair judging for the Reverend Insanity alias table (PWC48, proposals, 2026-11-17), plus the shared three-judge helper
// the generated-Gu sameness pass reuses (PWC47, scripts/gu_sameness.mjs).
//   node scripts/ri_alias_pairs.mjs propose [--sync]   Haiku proposes candidate pairs from the whole name list (recall)
//   node scripts/ri_alias_pairs.mjs confirm [--sync]   Luna confirms each candidate with both entries side by side, Haiku second-reads, Sol takes disagreements
//   node scripts/ri_alias_pairs.mjs write              fold the verdicts into docs/coverage/ri_alias_pairs.json
// Input: docs/research/power-catalogues-2026-11-16/work/ri_alias_candidates.json from `python3 -I scripts/ri_aliases.py candidates <wiki.xml> <out>`.
// Roles (AU17): Luna judges (precision), Haiku second-reads (recall), Sol (gpt-6.1-sol, about 20x their price) only on their disagreements, capped.
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {runPass} from './label_runner.mjs';

const root = new URL('..', import.meta.url).pathname;
export const WORK = join(root, 'docs/research/power-catalogues-2026-11-16/work') + '/';
const PRIV = 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json';
const indexPath = [join(root, PRIV), join('/Users/weiwei/code/yet-another-idle-rpg', PRIV)].find(existsSync);
const read = p => JSON.parse(readFileSync(p, 'utf8'));
export const MODELS = {luna: 'gpt-6-luna', haiku: 'claude-haiku-5-5', sol: 'gpt-6.1-sol'};

/** Run one question set through Luna, Haiku and (on disagreement) Sol. `verdictOf(reply)` returns the comparable verdict string. */
export async function triJudge({name, items, system, schema, verdictOf, argv = ['--sync'], solMaxUsd = 1, effort = 'low'}) {
    mkdirSync(WORK, {recursive: true});
    const base = {dir: WORK, system, schema, effort, maxTokens: 2000};
    const out = {};
    for (const who of ['luna', 'haiku']) {
        const {replies} = await runPass({...base, name, items, model: MODELS[who]}, argv);
        out[who] = replies;
    }
    const disputed = items.filter(it => verdictOf(out.luna[it.id]?.reply) !== verdictOf(out.haiku[it.id]?.reply));
    out.sol = {};
    if (disputed.length) {
        const {replies} = await runPass({...base, name: `${name}_sol`, items: disputed, model: MODELS.sol, suffix: 'sol', maxUsd: solMaxUsd, maxTokens: 1000}, [...argv, '--max-usd', String(solMaxUsd)]);
        out.sol = replies;
    }
    return {...out, disputed: disputed.map(it => it.id)};
}

const SYSTEM = [
    'You compare two entries from a Reverend Insanity Gu catalogue. The catalogue merges two sources (a fan wiki and a translation site), so one Gu can appear twice under',
    'different English names: fan translations differ (Wine Worm and Liquor Worm, Thunder and Lightning, Meat and Flesh), pinyin and English can mix (Jun for Jun Strength), words can be reordered, compounds can be split (Moonscar, Moon Scar).',
    'Answer with one verdict. same: the two entries are one Gu in the novel under two names. variant: related members of one series that are different Gu',
    '(a mortal and an immortal form, a rank step, a different beast in the Strength series, a different flavour count). different: unrelated Gu that share a word or a Chinese character.',
    'The Chinese names are strong evidence when they match and both are real; the wiki sometimes pastes a wrong Chinese title, so a matching title with different English names, paths and ranks is only a lead. Reply with JSON only.'].join(' ');
const SCHEMA = {type: 'object', properties: {verdict: {type: 'string', enum: ['same', 'variant', 'different']}, why: {type: 'string'}}, required: ['verdict', 'why'], additionalProperties: false};

const entry = (id, rec, labels) => {
    const l = labels[id] ?? {};
    return `${rec.names.join(' / ')} | Chinese: ${rec.zh.join(', ') || '-'} | path ${l.path ?? '-'} | rank ${l.rank ?? '?'} | source ${rec.status}`;
};

function pairItems() {
    const c = read(join(WORK, 'ri_alias_candidates.json')), labels = read(join(root, 'docs/coverage/gu_labels.json')).kinds;
    const extra = existsSync(join(WORK, 'ri_alias_proposed.json')) ? read(join(WORK, 'ri_alias_proposed.json')).pairs : [];
    const seen = new Set(), pairs = [];
    for (const p of [...c.pairs, ...extra]) {
        const k = [p.a, p.b].sort().join('|');
        if (seen.has(k) || !c.records[p.a] || !c.records[p.b]) continue;
        seen.add(k); pairs.push(p);
    }
    return pairs.map(p => ({id: `p${createHash('sha1').update([p.a, p.b].sort().join('|')).digest('hex').slice(0, 8)}`, a: p.a, b: p.b, why: p.why,
        user: `Entry A: ${entry(p.a, c.records[p.a], labels)}\nEntry B: ${entry(p.b, c.records[p.b], labels)}\nHow they were paired: ${p.why}.`}));
}

async function propose(argv) {
    const c = read(join(WORK, 'ri_alias_candidates.json')), labels = read(join(root, 'docs/coverage/gu_labels.json')).kinds;
    const ids = Object.keys(c.records).sort((a, b) => (c.records[a].names[0] ?? a).localeCompare(c.records[b].names[0] ?? b));
    const shared = ids.map(id => `${id} | ${c.records[id].names.join(' / ')} | ${c.records[id].zh.join(',') || '-'} | ${labels[id]?.path ?? '-'} r${labels[id]?.rank ?? '?'}`).join('\n');
    const sys = 'You help dedupe a Reverend Insanity Gu catalogue built from two sources, so one Gu can sit under two English names (fan translation variants, pinyin, word order, split compounds, Chinese names that match). You are given every entry: id | names | Chinese | path and rank. Propose only pairs that are probably one Gu under two names; do not propose series members (mortal and immortal forms, different beasts, rank steps). Reply with JSON only.';
    const schema = {type: 'object', properties: {pairs: {type: 'array', items: {type: 'object', properties: {a: {type: 'string'}, b: {type: 'string'}, why: {type: 'string'}}, required: ['a', 'b', 'why'], additionalProperties: false}}}, required: ['pairs'], additionalProperties: false};
    const chunks = 20, per = Math.ceil(ids.length / chunks);
    const items = Array.from({length: chunks}, (_, i) => ({id: `c${i}`, shared, user: `Consider only entries ${i * per + 1} to ${Math.min(ids.length, (i + 1) * per)} of the list (in the order given), as the first member of a pair; the partner may be any entry. Return {"pairs": [...]}, using the ids exactly as listed.`}));
    const {replies} = await runPass({name: 'ri_alias_propose', dir: WORK, system: sys, schema, items, model: MODELS.haiku, effort: 'low', maxTokens: 12000, reuse: true}, argv);
    const pairs = Object.values(replies).flatMap(r => r.reply?.pairs ?? []).map(p => ({...p, why: `Haiku proposal: ${p.why}`}));
    writeFileSync(join(WORK, 'ri_alias_proposed.json'), JSON.stringify({pairs}));
    console.log(JSON.stringify({proposed: pairs.length}));
}

async function confirm(argv) {
    const items = pairItems();
    const r = await triJudge({name: 'ri_alias_confirm', items, system: SYSTEM, schema: SCHEMA, verdictOf: x => x?.verdict ?? null, argv});
    writeFileSync(join(WORK, 'ri_alias_confirm_result.json'), JSON.stringify({items: items.map(({id, a, b, why}) => ({id, a, b, why})), luna: r.luna, haiku: r.haiku, sol: r.sol, disputed: r.disputed}));
    console.log(JSON.stringify({pairs: items.length, disputed: r.disputed.length}));
}

function write() {
    const r = read(join(WORK, 'ri_alias_confirm_result.json')), pairs = [];
    const tally = {};
    for (const it of r.items) {
        const l = r.luna[it.id]?.reply, h = r.haiku[it.id]?.reply, s = r.sol[it.id]?.reply;
        if (!l && !h) continue;
        const agree = l && h && l.verdict === h.verdict;
        const verdict = agree ? l.verdict : s?.verdict ?? l?.verdict ?? h.verdict;
        const basis = agree ? 'Luna and Haiku agree' : s ? 'Luna and Haiku disagree; Sol judged' : 'Luna and Haiku disagree; Luna kept (no Sol answer)';
        tally[verdict] = (tally[verdict] ?? 0) + 1;
        pairs.push({a: it.a, b: it.b, verdict, basis, why: (agree ? l : s ?? l ?? h).why, readers: {luna: l?.verdict ?? null, haiku: h?.verdict ?? null, sol: s?.verdict ?? null}, pairedBy: it.why});
    }
    pairs.sort((x, y) => (x.a + x.b).localeCompare(y.a + y.b));
    writeFileSync(join(root, 'docs/coverage/ri_alias_pairs.json'), JSON.stringify({meta: {proposal: 'PWC48', date: '2026-11-17', roles: 'Luna judges, Haiku second-reads, Sol only on their disagreements (AU17)', tally}, pairs}, null, 0) + '\n');
    console.log(JSON.stringify({pairs: pairs.length, tally}));
}

const mode = process.argv[2], argv = process.argv.slice(3);
if (import.meta.url === `file://${process.argv[1]}`) {
    if (mode === 'propose') await propose(argv.length ? argv : ['--sync']);
    else if (mode === 'confirm') await confirm(argv.length ? argv : ['--sync']);
    else if (mode === 'write') write();
    else console.log('usage: propose | confirm | write');
}
