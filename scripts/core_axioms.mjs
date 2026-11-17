#!/usr/bin/env node
// Core axiom candidates (PWC84, PWC85, PWC97, PWC100; proposals). Writes docs/coverage/core_rules.json.
//   node scripts/core_axioms.mjs [--check]
// Taught from the tabletop rule rows (PWC85): each axiom's rule rows counted by the seam and mechanism codes the rows already carry, with the
// dial text the rows state. Tested on novels the tabletop rows never saw: only where the ledgers hold a field the axiom predicts.
// Gate (PWC84): an axiom is core only when it beats its baseline in two worlds; every verdict here stays a proposal (AD56).
import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {EFFECT_VERBS} from '../src/effect_grammar.js';

const root = new URL('..', import.meta.url).pathname;
export const CORE_FILE = 'docs/coverage/core_rules.json';
const rd = f => JSON.parse(readFileSync(join(root, f), 'utf8'));
const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;

// Axiom -> how a tabletop rule row counts toward it. seams are AB codes from docs/ABILITY_RULES.md; mechanisms are the row's own field.
export const AXIOMS = [
    {id: 'CR1', statement: 'Cost grows with magnitude, reach and duration.', seams: ['AB2'], mechanisms: [], pattern: /\b(costs?|pay|spend|spent)\b.*\b(level|more|per|each|double)/i, field: null},
    {id: 'CR2', statement: 'A higher rank or tier overcomes a lower one unless a stated counter applies.', seams: [], mechanisms: [], pattern: /\b(higher|greater|superior)\s+(rank|tier|level|grade|sequence)\b|\boutrank/i, field: null},
    {id: 'CR3', statement: 'Every effect has a limit, a counter or an upkeep.', seams: ['AB16', 'AB21', 'AB14', 'AB27'], mechanisms: ['block', 'end'], pattern: null, field: ['go_wrong', 'counters']},
    {id: 'CR4', statement: 'What a power consumes is conserved inside its world (essence, sanity, lifespan, material).', seams: ['AB15', 'AB32', 'AB34'], mechanisms: [], pattern: /\bconserv|\bconsum(e|es|ed)\b.*\b(material|vis|essence)/i, field: null},
    {id: 'CR5', statement: 'Effects act through the twelve grammar verbs on the fixed objects.', seams: [], mechanisms: [...EFFECT_VERBS], pattern: null, field: ['grammar.verb']},
    {id: 'CR6', statement: 'A power passes on only by a stated channel (inheritance, ritual, item, teaching).', seams: ['AB1', 'AB12', 'AB33'], mechanisms: [], pattern: null, field: ['route_to_player', 'where_from']},
    {id: 'CR7', statement: 'Stacking follows a world rule (add, highest only, diminishing).', seams: [], mechanisms: [], pattern: /\bstack|\bcumulative|\bhighest\b.*\bapplies|\bdoes not add/i, field: ['combines']},
];

function taught() {
    const files = readdirSync(join(root, 'docs/coverage')).filter(f => /_rules\.json$/.test(f) && !/^(derivation|core)_rules/.test(f));
    const out = Object.fromEntries(AXIOMS.map(a => [a.id, {rows: 0, worlds: {}, dials: {}}]));
    let total = 0;
    for (const f of files) {
        const d = rd(`docs/coverage/${f}`), rows = Array.isArray(d) ? d : d.rules;
        for (const r of rows) {
            if (!r.seam && !r.mechanism) continue;
            total++;
            for (const a of AXIOMS) {
                const hit = a.seams.includes(r.seam) || a.mechanisms.includes(r.mechanism) || (a.pattern && a.pattern.test(r.statement ?? ''));
                if (!hit) continue;
                const o = out[a.id]; o.rows++; o.worlds[r.world] = (o.worlds[r.world] ?? 0) + 1;
                const dial = /dial:\s*([^.;]+)/i.exec(r.default_dial_reason ?? '')?.[1]?.trim();
                if (dial && (o.dials[r.world]?.length ?? 0) < 2 && !(o.dials[r.world] ?? []).includes(dial)) (o.dials[r.world] ??= []).push(dial.slice(0, 120));
            }
        }
    }
    return {out, total, files: files.length};
}

// Seeded permutation baseline for "a fixed offset between product tier and input tier" (PWC97).
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function offsetTest(pairs) {   // pairs: [[inputTier, productTier]]
    const modal = ps => { const c = {}; for (const [i, p] of ps) c[p - i] = (c[p - i] ?? 0) + 1; const [off, k] = Object.entries(c).sort((a, b) => b[1] - a[1] || Math.abs(a[0]) - Math.abs(b[0]))[0]; return {off: Number(off), k}; };
    const n = pairs.length; if (n < 10) return {n, verdict: 'insufficient-held-out'};
    const m = modal(pairs), r = rng(429), shares = [];
    for (let t = 0; t < 1000; t++) { const ins = pairs.map(p => p[0]); for (let i = ins.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ins[i], ins[j]] = [ins[j], ins[i]]; } shares.push(modal(pairs.map((p, i) => [ins[i], p[1]])).k / n); }
    shares.sort((a, b) => a - b);
    const share = m.k / n, p95 = shares[Math.floor(0.95 * shares.length)];
    return {n, dial: m.off, share: Math.round(share * 1000) / 1000, baselineMean: Math.round(1000 * shares.reduce((a, b) => a + b, 0) / shares.length) / 1000, baselineP95: Math.round(p95 * 1000) / 1000, verdict: share > p95 ? 'passes' : 'fails-baseline'};
}

async function offsets() {
    const worlds = {};
    const g = await import('./derive_gu_ranks.mjs');
    const priv = ['/Users/weiwei/code/yet-another-idle-rpg/', root].map(b => join(b, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json')).find(existsSync);
    if (priv) {
        const world = g.buildWorld({index: JSON.parse(readFileSync(priv, 'utf8')), edges: rd(g.EDGES_FILE).edges, chapterTier: rd('docs/coverage/chapter_tier_labels.json').gu_kinds, wikiTier: rd('docs/coverage/wiki_tier_labels.json').gu_kinds});
        const pairs = [], held = [];
        for (const [id, e] of Object.entries(world.edges)) {
            if (!world.rank[id]) continue;
            const ins = [...new Set(world.resolve([...(e.precursors ?? []), ...(e.fusion ?? [])]))].filter(x => x !== id && world.rank[x]);
            if (!ins.length) continue;
            const pr = [Math.max(...ins.map(x => world.rank[x])), world.rank[id]]; pairs.push(pr); if (heldOut(id)) held.push(pr);
        }
        worlds['reverend-insanity'] = {what: 'Gu rank against its highest known precursor rank (the dial is +1)', all: offsetTest(pairs), heldOut: offsetTest(held), heldOutN: held.length, fittedOn: 'this world (the axiom is read from it)'};
    }
    const LABELS = '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private/derive_lotm_mains_luna.json';
    if (existsSync(LABELS)) {
        const {statedMains} = await import('./derive_lotm_formulas.mjs'), {classOf} = await import('./derive_lotm_natural_mains.mjs');
        const raw = JSON.parse(readFileSync(LABELS, 'utf8')), pairs = [], held = [];
        for (const it of await statedMains()) {
            const m = /_(\d)$/.exec(it.rowId), l = raw[it.main]?.reply;
            if (classOf(it.main) === 'characteristic') continue;   // a characteristic main is the same Sequence by the rule's own definition: circular
            if (!m || !l || l.pathway === 'unknown' || l.pathway === 'none' || l.sequence < 0) continue;
            const pr = [l.sequence, Number(m[1])]; pairs.push(pr); if (heldOut(it.rowId)) held.push(pr);
        }
        worlds['lotm'] = {what: 'potion Sequence against the Sequence of its stated main material (Luna recall label, not a chapter read; characteristic mains left out as circular); the dial is a Sequence offset', all: offsetTest(pairs), heldOut: offsetTest(held), heldOutN: held.length, fittedOn: 'not fitted (test world)'};
    }
    return worlds;
}

function sheets() {
    const out = {};
    for (const w of ['a_novel_concept', 'labyrinth_mad_god', 'speedrunning_multiverse', 'you_have_died_again']) {
        const rows = rd(`docs/coverage/${w}_powers_sheet.json`).filter(r => ['power', 'item-grants-power', 'rule-or-mechanism'].includes(r.kind));
        const share = fs => Math.round(1000 * rows.filter(r => fs.some(f => (f.includes('.') ? r[f.split('.')[0]]?.[f.split('.')[1]] : r[f]?.v))).length / rows.length) / 1000;
        out[w] = {powerRows: rows.length, statedLimitOrCounter: share(['go_wrong', 'counters']), statedChannel: share(['route_to_player', 'where_from']), statedStacking: share(['combines']), verbInTwelve: share(['grammar.verb'])};
    }
    return out;
}

export async function build() {
    const t = taught(), off = await offsets(), sh = sheets();
    const offPass = Object.values(off).filter(w => w.heldOut?.verdict === 'passes' || (w.fittedOn.startsWith('not') && w.all?.verdict === 'passes')).length;
    const axioms = AXIOMS.map(a => {
        const tw = t.out[a.id];
        const base = {id: a.id, statement: a.statement, taughtBy: {ruleRows: tw.rows, tabletopWorlds: Object.keys(tw.worlds).length, byWorld: tw.worlds, dialsStated: tw.dials, counting: {seams: a.seams, mechanisms: a.mechanisms.length ? (a.mechanisms.length === 12 ? 'the twelve verbs' : a.mechanisms) : [], statementPattern: a.pattern ? String(a.pattern) : null}}};
        if (!a.field) return {...base, novelField: null, score: null, verdict: 'no-checkable-field',
            note: 'No ledger field states this in two worlds on held-out rows. Field needed: a stated per-power ' + (a.id === 'CR1' ? 'cost amount beside its rank' : a.id === 'CR2' ? 'outcome of a contest between ranks' : 'conserved quantity before and after use') + '.'};
        return {...base, novelField: a.field, descriptiveShares: Object.fromEntries(Object.entries(sh).map(([w, s]) => [w, a.id === 'CR3' ? s.statedLimitOrCounter : a.id === 'CR6' ? s.statedChannel : a.id === 'CR7' ? s.statedStacking : s.verbInTwelve])),
            score: null, verdict: 'descriptive-only', note: 'The novel sheets record whether a source states the field, not whether the world has it, so absence is not a miss and there is no baseline to beat. Shares are the dial evidence.'};
    });
    axioms.push({id: 'CR8', statement: 'A made thing sits a fixed tier offset from the highest-tier input it is made from; the offset is the world dial.',
        proposedBy: 'PWC100, drafted from the Gu precursor rule (gu.rank.precursor) and tested on LOTM', taughtBy: null, novelField: ['product tier', 'input tier'], worlds: off,
        verdict: offPass >= 2 ? 'passes-two-worlds' : 'one-world-or-fails', note: 'Passes a world when its modal offset share beats the 95th percentile of 1,000 seeded shuffles of input tiers against product tiers. Gu is where the axiom was read, so LOTM is the only unfitted test.'});
    return {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#pwc100-pwc119-derivation-rule-scores-and-core-axioms-2026-11-17-proposals', date: '2026-11-17', status: 'proposal (AD32, AD56): none is adopted',
        gate: 'core only when it beats its baseline in at least two worlds (PWC84); descriptive-only and no-checkable-field are not scores', taught: `${t.total} tabletop and book rule rows in ${t.files} files`, regenerate: 'node scripts/core_axioms.mjs', sheets: sh}, axioms};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const text = `${JSON.stringify(await build(), null, 1)}\n`;
    if (process.argv.includes('--check')) process.exit(text === readFileSync(join(root, CORE_FILE), 'utf8') ? 0 : 1);
    writeFileSync(join(root, CORE_FILE), text);
    for (const a of JSON.parse(text).axioms) console.log(a.id, a.verdict, a.taughtBy?.ruleRows ?? '', a.taughtBy ? Object.keys(a.taughtBy.byWorld).length : '');
    console.log(JSON.stringify(JSON.parse(text).axioms.at(-1).worlds));
}
