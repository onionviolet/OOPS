#!/usr/bin/env node
// Worm power ledger, private half (PWC1-PWC7, docs/research/power-catalogues-2026-11-16/README.md#worm-power-ledger-2026-11-16).
// Reads the gitignored full-book reader claims, the cape table and the people index, runs the Luna and Haiku passes and writes
// ONLY normalised values, locators and speakers to docs/coverage/worm_power_labels.json. scripts/worm_power_ledger.mjs builds the
// committed ledger from that sidecar alone, so the test and a clean checkout never need the private inputs.
// Phases, in this order (the order matters: ids are frozen and the split fixed before any grammar call, advisor note):
//   candidates  deterministic names from claims, table and people index -> private/worm_candidates.json
//   resolve     Luna classifies each candidate (cape, device, group...) and proposes merges; Haiku checks the merges
//   freeze      fixes ids, writes the sha1 split and the pre-registered score constants into the sidecar
//   packets     redacted evidence per kept row -> private/worm_packets.json
//   label       Luna fills the power sheet -> private/worm_luna.json; Haiku second read -> private/worm_haiku.json
//   score       grammar prediction vs PRT rating on held-out rows; folds only what beats the baseline
// Usage: OPENAI_API_KEY=... ANTHROPIC_API_KEY=... node scripts/worm_power_labels.mjs <phase> ...
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';

const PRIMARY = '/Users/weiwei/code/yet-another-idle-rpg/';
const SRC = process.env.WORM_SOURCES ?? `${PRIMARY}docs/research/novels/`;
export const PRIV = (process.env.WORM_PRIVATE ?? `${PRIMARY}docs/research/power-catalogues-2026-11-16/private`).replace(/\/$/, '') + '/';
const SIDECAR = new URL('../docs/coverage/worm_power_labels.json', import.meta.url).pathname;
mkdirSync(PRIV, {recursive: true});
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const sha1 = s => createHash('sha1').update(s).digest('hex');
export const slug = t => t.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// ---- pre-registered constants (set before any result was looked at) -------------------------------------------------
// Split: held out when sha1(id)[0] < 0x33 (GKM429), the same rule as docs/coverage/wiki_tier_labels.json.
export const heldOut = id => parseInt(sha1(id).slice(0, 2), 16) < 0x33;
export const CLASSES = ['Mover', 'Shaker', 'Brute', 'Breaker', 'Master', 'Tinker', 'Blaster', 'Thinker', 'Striker', 'Changer', 'Trump', 'Stranger'];
// What each PRT class predicts as grammar parts (PWC2). A prediction "matches" when the labelled verb is in `verbs` OR the
// labelled target is in `targets` is NOT used: match means the verb is in `verbs` (verb match). Target match is reported as a
// second line only. Brute, Tinker and Breaker predict nothing clean and are excluded from the score (reported as unscored).
export const CLASS_PREDICTS = {
    Mover: {verbs: ['move'], objects: ['position']},
    Shaker: {verbs: ['alter', 'transform', 'add', 'move'], targets: ['area', 'cone', 'line']},
    Master: {verbs: ['bind'], objects: ['mind', 'thing', 'relation']},
    Thinker: {verbs: ['sense', 'copy'], objects: ['information', 'memory']},
    Stranger: {verbs: ['conceal'], objects: ['information', 'memory', 'mind']},
    Changer: {verbs: ['transform'], objects: ['form']},
    Trump: {verbs: ['alter', 'copy', 'block', 'end'], objects: ['working', 'law']},
    Blaster: {verbs: ['add', 'move'], objects: ['heat', 'light', 'force', 'vitality'], targets: ['line', 'cone', 'area', 'marked']},
    Striker: {verbs: ['add', 'move', 'transform', 'remove'], targets: ['touched']},
};
export const UNSCORED_CLASSES = ['Brute', 'Tinker', 'Breaker'];
// Primary class of a cape = the first class named in its page-stated rating (S or T basis, never reader-inferred (I)).
// Baseline the grammar must beat: always predict the most common verb of the tuning rows (fitted on non-held-out rows).
export const FOLD_RULE = 'a field folds only when its held-out verb agreement beats the majority-verb baseline by at least 10 points';

const NOISE = /^(a subject|someone|unknown|none|n\/a)$/i;
const clean = s => s.replace(/[’']s\b/g, '').replace(/\s+/g, ' ').replace(/^[\s"“]+|[\s".”]+$/g, '').trim();
const sub = s => s.split(/\s*\/\s*|\s+and\s+(?=[A-Z])/).map(clean).filter(x => x && !NOISE.test(x));

function candidates() {
    const claims = json(`${SRC}full-book/worm/INDEX.json`).claims;
    const map = new Map(); // key -> {name, claims: Set, facets: Set, sources: Set}
    const add = (name, source, facet) => {
        const key = name.toLowerCase();
        const c = map.get(key) ?? {name, claims: new Set(), facets: new Set(), sources: new Set()};
        c.sources.add(source); if (facet) c.facets.add(facet);
        map.set(key, c); return c;
    };
    for (const x of claims) for (const s of x.subjects) for (const n of sub(s)) add(n, 'claims', x.facet).claims.add(x.id);
    // cape table: "| 1 | Skitter/Weaver (Taylor) | power | rating | limits | locator | basis |"
    const table = readFileSync(`${SRC}worm/readers-2026-10-10/POWERS_SHARDS.md`, 'utf8').split('\n')
        .filter(l => /^\| \d+ \|/.test(l)).map(l => l.split('|').map(c => c.trim()).slice(1, -1));
    const tableRows = table.map(([n, name, power, rating, limits, loc, basis]) => ({n: +n, name, power, rating, limits, loc, basis}));
    for (const r of tableRows) for (const part of r.name.split(/\s*\/\s*/)) {
        const m = part.match(/^(.*?)\s*\((.*?)\)\s*$/);
        for (const n of m ? [m[1], m[2]] : [part]) if (clean(n)) add(clean(n), `table:${r.n}`, null);
    }
    // people index: capes and their civilian names are aliases of one profile heading
    const people = readFileSync(`${SRC}full-book/worm/PEOPLE.md`, 'utf8').split('\n## ').slice(1).map(sec => {
        const heading = sec.split('\n')[0].trim();
        const names = (sec.match(/^Names: (.*)$/m)?.[1] ?? '').split(';').map(p => p.split('|').map(t => t.trim())).filter(p => p[0]);
        return {heading, names};
    });
    for (const p of people) for (const [name, kind] of p.names) add(clean(name), `people:${p.heading}`, null);
    return {claims: claims.length, tableRows, people, list: [...map.values()].map(c => ({name: c.name, claims: [...c.claims], facets: [...c.facets], sources: [...c.sources]}))};
}

const phase = process.argv[2];
if (phase === 'candidates') {
    const c = candidates();
    writeFileSync(`${PRIV}worm_candidates.json`, JSON.stringify(c));
    console.log(JSON.stringify({claims: c.claims, tableRows: c.tableRows.length, people: c.people.length, candidates: c.list.length,
        withClaims: c.list.filter(x => x.claims.length).length}));
}

// ---- shared model callers --------------------------------------------------------------------------------------------
import {luna, RATE, SPEAKER} from './label_pass.mjs';
import Anthropic from '@anthropic-ai/sdk';
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
export async function haiku(prompt, schema) {
    const msg = await anthropic.messages.create({model: 'claude-haiku-5-5', max_tokens: 8000,
        output_config: {effort: 'low', format: {type: 'json_schema', schema}}, messages: [{role: 'user', content: prompt}]});
    if (msg.stop_reason === 'refusal') throw Error('haiku refusal');
    return {reply: JSON.parse(msg.content.filter(b => b.type === 'text').map(b => b.text).join('')), usage: {in: msg.usage.input_tokens, out: msg.usage.output_tokens}};
}
const str = {type: 'string'};
const obj = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
const arr = items => ({type: 'array', items});
const en = values => ({type: 'string', enum: values});
// Resumable batch runner: jobs [{id, prompt, schema}] -> file {id: {reply, usage} | {error}}.
async function run(file, jobs, call, width = 8) {
    const done = existsSync(file) ? json(file) : {};
    const queue = jobs.filter(j => !done[j.id]?.reply);
    for (let i = 0; i < queue.length; i += width) {
        await Promise.all(queue.slice(i, i + width).map(async j => {
            for (let a = 0; ; a++) {
                try { done[j.id] = await call(j.prompt, j.schema); break; }
                catch (e) { if (a >= 2) { done[j.id] = {error: String(e.message ?? e)}; break; } await new Promise(r => setTimeout(r, 3000 * (a + 1))); }
            }
        }));
        writeFileSync(file, JSON.stringify(done));
    }
    const ok = Object.values(done).filter(r => r.reply);
    const tin = ok.reduce((s, r) => s + r.usage.in, 0), tout = ok.reduce((s, r) => s + r.usage.out, 0);
    return {file: file.split('/').pop(), jobs: jobs.length, ok: ok.length, errors: Object.values(done).filter(r => r.error).length,
        cost: Number(((tin * RATE.in + tout * RATE.out) / 1e6).toFixed(4))};
}

// ---- resolve ----------------------------------------------------------------------------------------------------------
export const KINDS = ['cape', 'entity_or_endbringer', 'named_device', 'creature_or_projection', 'group', 'place', 'civilian', 'concept_or_object', 'other'];
export const KEPT_KINDS = ['cape', 'entity_or_endbringer', 'named_device'];
if (phase === 'resolve') {
    const cand = json(`${PRIV}worm_candidates.json`);
    const byId = new Map(json(`${SRC}full-book/worm/INDEX.json`).claims.map(c => [c.id, c]));
    const list = cand.list.filter(c => c.claims.length || c.sources.some(s => s.startsWith('table') || s.startsWith('people')));
    const jobs = [];
    for (let i = 0; i < list.length; i += 40) {
        const batch = list.slice(i, i + 40);
        const lines = batch.map((c, k) => {
            const cl = c.claims.map(id => byId.get(id)).sort((a, b) => (b.facet === 'power') - (a.facet === 'power'))[0];
            return `${k + 1}. "${c.name}" (${c.claims.length} claims; ${c.sources.filter(s => !s.startsWith('claims')).join(', ') || 'claims only'}) e.g. ${cl ? cl.assertion.slice(0, 150) : '-'}`;
        }).join('\n');
        jobs.push({id: `b${String(i / 40).padStart(3, '0')}`, schema: obj({items: arr(obj({n: {type: 'integer'}, kind: en(KINDS), canonical: str}))}),
            prompt: `These are subject names from reader notes on the web serial Worm. For each, give kind: cape (a named person with a power, by cape name or civilian name), entity_or_endbringer (Scion, Endbringers, Entities, Butcher-type), named_device (a proper or possessive-named Tinker device, suit, weapon or product with a maker, such as Dragon's Teeth, Defiant's spear, containment foam; NOT generic bombs, armor or costumes), creature_or_projection (animals, Case 53 and projection beings that are not themselves a cape), group, place, civilian (no power), concept_or_object, other. canonical: for cape, entity_or_endbringer and named_device the one name this row should be listed under (a cape name when a person has one, the same name as the entry when it is already canonical); an alias entry gives the canonical name of the same person; "" for other kinds. Use only the clues given plus well-known facts of the serial.\n\n${lines}`});
    }
    console.log(JSON.stringify(await run(`${PRIV}worm_resolve_luna.json`, jobs, luna)));
    const res = json(`${PRIV}worm_resolve_luna.json`);
    const out = [];
    jobs.forEach((j, bi) => (res[j.id]?.reply?.items ?? []).forEach(it => { const c = list[bi * 40 + it.n - 1]; if (c) out.push({...c, kind: it.kind, canonical: it.canonical}); }));
    writeFileSync(`${PRIV}worm_resolved.json`, JSON.stringify(out));
    const kept = out.filter(o => KEPT_KINDS.includes(o.kind));
    console.log(JSON.stringify({resolved: out.length, kept: kept.length, canonicals: new Set(kept.map(o => (o.canonical || o.name).toLowerCase())).size,
        byKind: Object.fromEntries(KINDS.map(k => [k, out.filter(o => o.kind === k).length]))}));
}

// ---- merge (aliases) ---------------------------------------------------------------------------------------------------
if (phase === 'merge') {
    const resolved = json(`${PRIV}worm_resolved.json`).filter(o => KEPT_KINDS.includes(o.kind));
    const names = [...new Set(resolved.flatMap(o => [o.name, o.canonical]).filter(Boolean))].sort();
    const cand = json(`${PRIV}worm_candidates.json`);
    const hints = cand.people.map(p => `- ${p.heading}: ${p.names.map(n => n.join(' | ')).join('; ')}`).join('\n');
    const table = cand.tableRows.map(r => `${r.n}. ${r.name}`).join('\n');
    const schema = obj({groups: arr(obj({canonical: str, aliases: arr(str), kind: en(['cape', 'entity_or_endbringer', 'named_device', 'drop']), drop_reason: str}))});
    const prompt = `Reader notes on the web serial Worm produced these names of people with powers and of named Tinker devices. Group them into one entry per person or device: canonical is the name most used for them in the serial (the cape name for a cape, such as Skitter for Taylor Hebert); aliases are every other name in the list that is the same person or the same device (civilian names, later cape names, possessive and plural forms, "X suit" and "X suits"). Put every listed name in exactly one group, as canonical or alias. Distinct people stay apart even when related (a clone, a counterpart or a descendant is its own entry). kind: cape, entity_or_endbringer, named_device, or drop for names that are not one specific named power-holder or named device (unnamed or generic "unknown cape" style entries, plain civilians without powers, roles and titles, groups, generic equipment); say why in drop_reason, else "".\n\nAlias hints from the people index:\n${hints}\n\nCape table names:\n${table}\n\nNames:\n${names.join('\n')}`;
    const r = await run(`${PRIV}worm_merge_luna.json`, [{id: 'all', prompt, schema}], luna, 1);
    console.log(JSON.stringify(r));
    const g = json(`${PRIV}worm_merge_luna.json`).all.reply.groups;
    const covered = new Set(g.flatMap(x => [x.canonical, ...x.aliases]).map(s => s.toLowerCase()));
    console.log(JSON.stringify({groups: g.length, drop: g.filter(x => x.kind === 'drop').length, missing: names.filter(n => !covered.has(n.toLowerCase())).slice(0, 40)}));
}

// ---- freeze ------------------------------------------------------------------------------------------------------------
// Corrections to Luna's alias groups, made by hand after reading the group list (every one listed in the sidecar meta).
const FIX = {
    split: {Foil: ['Flechette'], Wanton: ['Wanton / Annex'], 'Siberian creator': ['William Manton'], Alexandria: ['Alexandria-Pretender'], 'Damsel of Distress': ['Damsel of Distress clone']},
    merge: {'William Manton': ['Siberian creator'], 'Melusine V': ['Melusine AI'], 'Containment foam': ['PRT containment foam'], Skitter: ['Weaver'], Armsmaster: ['Defiant'], 'Glaistig Uaine': ['Valkyrie']},
    keepDevice: ['Defiant spear', 'Defiant knife', 'Dragon Teeth', 'Bakuda bombs', 'Containment foam', 'Glaurung Zero', 'Kid Win drones'],
    dropAlias: {Imp: ['Laborn']},
    rename: {},
};
const titleSlug = n => slug(n);
if (phase === 'freeze') {
    const resolved = json(`${PRIV}worm_resolved.json`);
    const cand = json(`${PRIV}worm_candidates.json`);
    const g = json(`${PRIV}worm_merge_luna.json`).all.reply.groups.map(x => ({...x, aliases: [...x.aliases]}));
    const claimsAll = new Map(json(`${SRC}full-book/worm/INDEX.json`).claims.map(c => [c.id, c]));
    // apply fixes
    for (const [canon, drop] of Object.entries(FIX.dropAlias)) { const x = g.find(y => y.canonical === canon); if (x) x.aliases = x.aliases.filter(a => !drop.includes(a)); }
    for (const [canon, split] of Object.entries(FIX.split)) { const x = g.find(y => y.canonical === canon); if (x) { x.aliases = x.aliases.filter(a => !split.includes(a)); } }
    const has = name => g.find(x => x.canonical.toLowerCase() === name.toLowerCase() || x.aliases.some(a => a.toLowerCase() === name.toLowerCase()));
    for (const [canon, names] of Object.entries(FIX.split)) for (const n of names) if (!has(n)) g.push({canonical: n, aliases: [], kind: 'cape', drop_reason: ''});
    for (const n of FIX.keepDevice) { const x = g.find(y => y.canonical.toLowerCase() === n.toLowerCase()); if (x) { x.kind = 'named_device'; x.drop_reason = ''; } else g.push({canonical: n, aliases: [], kind: 'named_device', drop_reason: ''}); }
    for (const [into, names] of Object.entries(FIX.merge)) {
        const target = g.find(x => x.canonical === into); if (!target) throw Error(`no ${into}`);
        for (const n of names) {
            for (const x of g) { if (x === target) continue; if (x.canonical === n) { target.aliases.push(x.canonical, ...x.aliases); x.kind = 'drop'; x.drop_reason = `merged into ${into}`; } x.aliases = x.aliases.filter(a => a !== n); }
            if (!target.aliases.includes(n)) target.aliases.push(n);
        }
    }
    for (const [from, to] of Object.entries(FIX.rename)) { const x = g.find(y => y.canonical === from); if (x) { x.aliases.push(from); x.canonical = to; x.aliases = x.aliases.filter(a => a !== to); } }
    // names Luna's merge call left out: kept as their own group when the resolve pass kept them
    const seen = new Set(g.flatMap(x => [x.canonical, ...x.aliases]).map(s => s.toLowerCase()));
    for (const o of resolved) if (KEPT_KINDS.includes(o.kind) && !seen.has(o.name.toLowerCase())) { g.push({canonical: o.name, aliases: [], kind: o.kind, drop_reason: 'added: absent from merge reply'}); seen.add(o.name.toLowerCase()); }
    const keptGroups = g.filter(x => x.kind !== 'drop');
    const byName = new Map(); // lowercased name -> group index
    keptGroups.forEach((x, i) => [x.canonical, ...x.aliases].forEach(n => byName.set(n.toLowerCase(), i)));
    const rows = keptGroups.map(x => ({id: `worm.${x.kind === 'named_device' ? 'device' : 'cape'}.${titleSlug(x.canonical)}`, name: x.canonical, aliases: [...new Set(x.aliases)].sort(), kind: x.kind,
        claims: new Set(), sources: new Set()}));
    for (const c of cand.list) {
        const i = byName.get(c.name.toLowerCase()); if (i === undefined) continue;
        for (const id of c.claims) rows[i].claims.add(id);
        for (const s of c.sources) if (!s.startsWith('claims')) rows[i].sources.add(s);
    }
    // cape table rows by name or alias
    const tableOf = new Map();
    for (const r of cand.tableRows) for (const part of r.name.split(/\s*\/\s*/)) for (const n of (part.match(/^(.*?)\s*\((.*?)\)\s*$/) ?? [null, part, null]).slice(1).filter(Boolean)) {
        const i = byName.get(clean(n).toLowerCase()); if (i !== undefined) { rows[i].sources.add(`table:${r.n}`); tableOf.set(r.n, i); }
    }
    const unmatched = cand.tableRows.filter(r => !tableOf.has(r.n)).map(r => `${r.n} ${r.name}`);
    const ids = new Set(); for (const r of rows) { if (ids.has(r.id)) r.id += '_2'; ids.add(r.id); }
    const final = rows.map(r => ({id: r.id, name: r.name, aliases: r.aliases, kind: r.kind, heldOut: heldOut(r.id),
        claimCount: r.claims.size, claims: [...r.claims].sort(), sources: [...r.sources].sort()}));
    writeFileSync(`${PRIV}worm_rows.json`, JSON.stringify(final));
    console.log(JSON.stringify({rows: final.length, capes: final.filter(r => r.kind !== 'named_device').length, devices: final.filter(r => r.kind === 'named_device').length,
        heldOut: final.filter(r => r.heldOut).length, noClaims: final.filter(r => !r.claimCount).length, unmatchedTable: unmatched}));
}

// ---- mergecheck (Haiku checks the alias groups) -------------------------------------------------------------------------
if (phase === 'mergecheck') {
    const rows = json(`${PRIV}worm_rows.json`).filter(r => r.aliases.length);
    const schema = obj({verdicts: arr(obj({canonical: str, verdict: en(['same', 'split', 'unsure']), note: str}))});
    const lines = rows.map(r => `- ${r.name}: ${r.aliases.join('; ')}`).join('\n');
    const r = await run(`${PRIV}worm_mergecheck_haiku.json`, [{id: 'all', schema, prompt: `Reader notes on the web serial Worm group these names as one person or one device each (canonical name first, then aliases). For each line say: same (every alias is that person or device, as a civilian name, later cape name, title, plural or possessive form), split (at least one alias is a different person, clone, counterpart or thing; say which in note) or unsure.\n\n${lines}`}], haiku, 1);
    console.log(JSON.stringify(r));
    const v = json(`${PRIV}worm_mergecheck_haiku.json`).all.reply.verdicts;
    console.log(JSON.stringify(v.filter(x => x.verdict !== 'same')));
}

// ---- ratings (the held-out label) and packets --------------------------------------------------------------------------
const CLASS_RE = new RegExp(`\\b(${CLASSES.join('|')})\\b`, 'g');
const REDACT = new RegExp(`\\b(${[...CLASSES, 'Shifter', 'Shaper', 'Rogue'].join('|')})(-class|-type|-style|-aspect|-ish)?(\\s+(?:class\\s+)?\\d+(?:[-/]\\d+)?\\*?)?(\\s+(?:rating|ratings|protocols?|classification|classifications))?\\b`, 'gi');
export const redact = t => t.replace(REDACT, '[class]').replace(/\bPRT (?:class|rating|classification)\w*/gi, '[class]').replace(/\b[Cc]lass\s+\d+\b/g, '[class]');
const SPEAKER_OF = {witnessed: 'demonstration', narrated: 'narrator', testimony: 'character_claim', theory: 'character_claim', inference: 'unknown'};
const claimLoc = c => `${c.id} ${c.locators[0] ?? ''}`.trim();

function ratings(rows, cand, claims) {
    const out = {};
    const nameIdx = new Map(); rows.forEach(r => [r.name, ...r.aliases].forEach(n => nameIdx.set(n.toLowerCase(), r.id)));
    for (const t of cand.tableRows) {
        if (!/^(S|T|S\/T|T\/S)$/.test(t.basis) && !/^(S|T)\b/.test(t.basis)) continue;
        if (/\(I\)|n\/a|ish|none/i.test(t.rating)) continue;
        const found = [...t.rating.matchAll(CLASS_RE)].map(m => m[1]);
        if (!found.length) continue;
        const rid = [...new Set(t.name.split(/\s*\/\s*/).flatMap(p => (p.match(/^(.*?)\s*\((.*?)\)\s*$/) ?? [null, p, null]).slice(1).filter(Boolean)).map(n => nameIdx.get(clean(n).toLowerCase())).filter(Boolean))][0];
        if (rid && !out[rid]) out[rid] = {primary: found[0], all: [...new Set(found)], source: `table:${t.n}`, basis: t.basis};
    }
    for (const c of claims) {
        const hits = [...c.assertion.matchAll(new RegExp(`\\b(${CLASSES.join('|')})\\s+(?:class\\s+)?\\d+`, 'g'))].map(m => m[1]);
        if (!hits.length || /\b(tentative|assum|claim|misrat)/i.test(c.assertion)) continue;
        const ids = [...new Set(c.subjects.flatMap(sub).map(n => nameIdx.get(n.toLowerCase())).filter(Boolean))];
        if (ids.length !== 1 || out[ids[0]]) continue;
        out[ids[0]] = {primary: hits[0], all: [...new Set(hits)], source: claimLoc(c), basis: c.evidence_type};
    }
    return out;
}

if (phase === 'packets') {
    const rows = json(`${PRIV}worm_rows.json`);
    const cand = json(`${PRIV}worm_candidates.json`);
    const claims = json(`${SRC}full-book/worm/INDEX.json`).claims;
    const byId = new Map(claims.map(c => [c.id, c]));
    const rate = ratings(rows, cand, claims);
    writeFileSync(`${PRIV}worm_ratings.json`, JSON.stringify(rate));
    const tableOf = new Map(); // row id -> table rows
    for (const r of rows) for (const s of r.sources) if (s.startsWith('table:')) { const t = cand.tableRows.find(x => x.n === +s.slice(6)); (tableOf.get(r.id) ?? tableOf.set(r.id, []).get(r.id)).push(t); }
    const packets = rows.map(r => {
        const cl = r.claims.map(id => byId.get(id)).sort((a, b) => (b.facet === 'power') - (a.facet === 'power') || a.id.localeCompare(b.id)).slice(0, 14);
        const hide = r.kind !== 'named_device';
        const ev = cl.map(c => `[${c.id}] (${c.evidence_type}) ${hide ? redact(c.assertion) : c.assertion}`.slice(0, 520));
        for (const t of tableOf.get(r.id) ?? []) ev.push(`[table:${t.n}] ${hide ? redact(t.power) : t.power}${t.limits ? `; limits: ${hide ? redact(t.limits) : t.limits}` : ''}`);
        return {id: r.id, name: r.name, aliases: r.aliases, kind: r.kind, evidence: ev, rated: !!rate[r.id]};
    });
    writeFileSync(`${PRIV}worm_packets.json`, JSON.stringify(packets));
    const leaks = packets.filter(p => p.kind !== 'named_device' && p.evidence.some(e => new RegExp(`\\b(${CLASSES.join('|')})\\b`).test(e)));
    console.log(JSON.stringify({packets: packets.length, rated: Object.keys(rate).length, ratedHeldOut: rows.filter(r => r.heldOut && rate[r.id]).length,
        byClass: Object.entries(rate).reduce((m, [, v]) => (m[v.primary] = (m[v.primary] ?? 0) + 1, m), {}), classWordLeaks: leaks.length,
        noEvidence: packets.filter(p => !p.evidence.length).length}));
}

// ---- label (Luna) and second read (Haiku) ------------------------------------------------------------------------------
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES, VERB_ACCEPTS} from '../src/effect_grammar.js';
export const ENUMS = {
    who_may: ['anyone-under-trigger', 'family-line', 'cauldron-recipient', 'one-person-only', 'grafted-or-copied', 'unknown'],
    where_from: ['natural-trigger', 'second-trigger', 'cauldron-vial', 'generational', 'entity-or-endbringer', 'granted-by-power', 'built-or-made', 'unknown'],
    go_wrong: ['none-stated', 'headache-or-strain', 'loss-of-control', 'physical-harm-to-holder', 'personality-change', 'maintenance-needed', 'range-or-material-limit', 'reserve-drain', 'other'],
    mind: ['none-stated', 'conflict-drive', 'personality-drift', 'cognitive-deficit', 'trigger-mirror', 'other'],
    left_behind: ['not-stated', 'power-ends-with-holder', 'passes-to-another', 'persists-as-trace', 'creation-persists', 'other'],
    route_to_player: ['trigger-event', 'cauldron-vial', 'inherited-or-family', 'built-by-player', 'bought-or-bargained', 'not-obtainable', 'unknown'],
    knowledge: ['public', 'holder-only', 'institution-only', 'nobody-knows', 'unknown'],
};
// Missing engine capability per power (PWC5). Slugs shared with other ledgers where they mean the same thing.
export const CAPABILITIES = ['runs-now', 'effect-unknown', 'mind-state', 'body-form', 'conceal-or-sense', 'protection-field', 'mind-binding', 'creature-control', 'area-field',
    'power-interaction', 'precognition', 'time-manipulation', 'portal-space', 'power-granting', 'tinker-device', 'projection-body', 'timeline-split'];
const cited = (valueSchema) => obj({value: valueSchema, cite: str});
export const SHEET = obj({
    effect: str,
    verb: en([...EFFECT_VERBS, 'none']), object: en([...Object.keys(EFFECT_OBJECTS), 'none']), target: en(EFFECT_TARGETS), time: en(EFFECT_TIMES), grammar_cite: str,
    who_may: cited(en(ENUMS.who_may)), where_from: cited(en(ENUMS.where_from)), go_wrong: cited(en(ENUMS.go_wrong)), mind: cited(en(ENUMS.mind)),
    left_behind: cited(en(ENUMS.left_behind)), route_to_player: cited(en(ENUMS.route_to_player)), knowledge: cited(en(ENUMS.knowledge)),
    combines: cited(str), counters: cited(str), blocked: en(CAPABILITIES),
});
const SHEET_PROMPT = p => `Fill the power sheet for the Worm ${p.kind === 'named_device' ? 'Tinker device' : 'power-holder'} "${p.name}"${p.aliases.length ? ` (also: ${p.aliases.slice(0, 6).join('; ')})` : ''}. Use only the evidence lines. Each line starts with [claim id] and the evidence type (witnessed = shown happening, narrated, testimony = a character's claim, inference, theory). Class words from the PRT rating system have been removed from the evidence on purpose.
effect: one short paraphrase (up to 15 words) of what the power or device does. verb/object/target/time: the primary effect as one effect-grammar sentence; verbs ${EFFECT_VERBS.join(', ')}; objects ${Object.keys(EFFECT_OBJECTS).join(', ')}; targets ${EFFECT_TARGETS.join(', ')} (self = the holder, touched, bound = things the holder controls, line, cone, area, marked = a chosen target at range); time ${EFFECT_TIMES.join(', ')}. A verb must fit its object kind (copy needs knowledge, state, working or thing; end and alter act on workings and laws). Use verb "none" and object "none" when the evidence gives no effect. grammar_cite: the claim id that best shows the effect.
who_may: who can hold it. where_from: how the holder got it. go_wrong: the cost, limit or backlash stated. mind: effect on the holder's mind. left_behind: what happens to it when the holder dies or it is transferred. route_to_player: how a player could plausibly get such a thing in the world. knowledge: who in-world knows how it works. combines: interactions with other powers or devices, up to 10 words. counters: what stops it, up to 8 words. Each field has a cite: the claim id that supports it, or "" when the evidence is silent; a silent field takes the "unknown", "none-stated" or "not-stated" value. blocked: the one engine capability this power needs that a typical life-sim engine may lack: runs-now (an ordinary effect grammar sentence runs it), effect-unknown, mind-state, body-form, conceal-or-sense, protection-field, mind-binding (controlling other people's minds or bodies), creature-control, area-field, power-interaction, precognition, time-manipulation, portal-space, power-granting, tinker-device (invented tech a character must build), projection-body, timeline-split.

Evidence:
${p.evidence.join('\n')}`;
if (phase === 'label' || phase === 'second') {
    const packets = json(`${PRIV}worm_packets.json`);
    const rows = new Map(json(`${PRIV}worm_rows.json`).map(r => [r.id, r]));
    const rate = json(`${PRIV}worm_ratings.json`);
    const jobs = packets.filter(p => p.evidence.length).map(p => ({id: p.id, schema: SHEET, prompt: SHEET_PROMPT(p)}));
    if (phase === 'label') console.log(JSON.stringify(await run(`${PRIV}worm_luna.json`, jobs, luna)));
    else {
        // second reader: every held-out row, every rated row, and a fixed hash sample (sha1 first byte < 0x40) of the rest
        const pick = jobs.filter(j => rows.get(j.id).heldOut || rate[j.id] || parseInt(sha1(`2nd:${j.id}`).slice(0, 2), 16) < 0x40);
        console.log(JSON.stringify(await run(`${PRIV}worm_haiku.json`, pick, haiku)));
    }
}

// ---- score and sidecar ---------------------------------------------------------------------------------------------------
const FIELDS = ['who_may', 'where_from', 'go_wrong', 'mind', 'left_behind', 'route_to_player', 'knowledge'];
const validGrammar = s => s.verb !== 'none' && s.object !== 'none' && (VERB_ACCEPTS[s.verb] ?? []).includes(EFFECT_OBJECTS[s.object]);
const modeOf = vals => { const n = new Map(); for (const v of vals) n.set(v, (n.get(v) ?? 0) + 1); return [...n].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0]; };
if (phase === 'score') {
    const rows = json(`${PRIV}worm_rows.json`), rate = json(`${PRIV}worm_ratings.json`);
    const luna_ = Object.fromEntries(Object.entries(json(`${PRIV}worm_luna.json`)).filter(([, r]) => r.reply).map(([k, r]) => [k, r.reply]));
    const haiku_ = existsSync(`${PRIV}worm_haiku.json`) ? Object.fromEntries(Object.entries(json(`${PRIV}worm_haiku.json`)).filter(([, r]) => r.reply).map(([k, r]) => [k, r.reply])) : {};
    const scoreable = rows.filter(r => rate[r.id] && CLASS_PREDICTS[rate[r.id].primary] && luna_[r.id]);
    const verbMajority = modeOf(scoreable.filter(r => !r.heldOut).map(r => luna_[r.id].verb)) ?? modeOf(rows.map(r => luna_[r.id]?.verb).filter(Boolean));
    const hit = (s, cls) => { const p = CLASS_PREDICTS[cls]; return {verb: p.verbs.includes(s.verb), object: (p.objects ?? []).includes(s.object), target: (p.targets ?? []).includes(s.target)}; };
    const tally = set => {
        const t = {n: set.length, verb: 0, object: 0, target: 0, baselineVerb: 0, byClass: {}};
        for (const r of set) {
            const s = luna_[r.id], cls = rate[r.id].primary, h = hit(s, cls), b = CLASS_PREDICTS[cls].verbs.includes(verbMajority);
            t.verb += h.verb; t.object += h.object; t.target += h.target; t.baselineVerb += b;
            (t.byClass[cls] ??= {n: 0, verb: 0}).n++; t.byClass[cls].verb += h.verb;
        }
        return t;
    };
    const held = tally(scoreable.filter(r => r.heldOut)), all = tally(scoreable);
    // agreement of Haiku with Luna on enum fields, over rows both read
    const agree = {}; for (const f of [...FIELDS, 'blocked', 'verb', 'target']) agree[f] = {both: 0, same: 0};
    for (const [id, h] of Object.entries(haiku_)) { const l = luna_[id]; if (!l) continue;
        for (const f of FIELDS) { agree[f].both++; agree[f].same += (h[f].value === l[f].value); }
        for (const f of ['blocked', 'verb', 'target']) { agree[f].both++; agree[f].same += (h[f] === l[f]); } }
    const unscored = rows.filter(r => rate[r.id] && !CLASS_PREDICTS[rate[r.id].primary]).map(r => rate[r.id].primary);
    const invalid = rows.filter(r => luna_[r.id] && luna_[r.id].verb !== 'none' && !validGrammar(luna_[r.id])).length;
    const result = {verbMajority, heldOut: held, allRated: all, unscoredClasses: unscored.reduce((m, c) => (m[c] = (m[c] ?? 0) + 1, m), {}), agree, invalidGrammar: invalid,
        lunaRows: Object.keys(luna_).length, haikuRows: Object.keys(haiku_).length};
    writeFileSync(`${PRIV}worm_score.json`, JSON.stringify(result, null, 1));
    console.log(JSON.stringify(result));
}

// ---- sidecar (the only thing the committed builder reads) ---------------------------------------------------------------------
if (phase === 'sidecar') {
    const rows = json(`${PRIV}worm_rows.json`), rate = json(`${PRIV}worm_ratings.json`), score = json(`${PRIV}worm_score.json`);
    const packets = new Map(json(`${PRIV}worm_packets.json`).map(p => [p.id, p]));
    const cand = json(`${PRIV}worm_candidates.json`);
    const claimsAll = new Map(json(`${SRC}full-book/worm/INDEX.json`).claims.map(c => [c.id, c]));
    const luna_ = Object.fromEntries(Object.entries(json(`${PRIV}worm_luna.json`)).filter(([, r]) => r.reply).map(([k, r]) => [k, r.reply]));
    const haiku_ = Object.fromEntries(Object.entries(json(`${PRIV}worm_haiku.json`)).filter(([, r]) => r.reply).map(([k, r]) => [k, r.reply]));
    const tableBasis = new Map(cand.tableRows.map(t => [`table:${t.n}`, t.basis]));
    const people = new Map(); for (const p of cand.people) for (const n of p.names) people.set(n[0].toLowerCase(), p.heading);
    const where = cite => {
        const c = claimsAll.get(cite);
        if (c) return {locator: claimLoc(c), speaker: SPEAKER_OF[c.evidence_type] ?? 'unknown'};
        if (tableBasis.has(cite)) { const b = tableBasis.get(cite); return {locator: cite, speaker: /^S/.test(b) ? 'demonstration' : /^T/.test(b) ? 'character_claim' : 'unknown'}; }
        return null;
    };
    const UNKNOWN = {who_may: 'unknown', where_from: 'unknown', go_wrong: 'none-stated', mind: 'none-stated', left_behind: 'not-stated', route_to_player: 'unknown', knowledge: 'unknown'};
    const gFold = score.allRated.n > 0 && (score.allRated.verb - score.allRated.baselineVerb) >= 0.1 * score.allRated.n && score.heldOut.verb >= score.heldOut.baselineVerb;
    const out = {};
    for (const r of rows) {
        const l = luna_[r.id], h = haiku_[r.id];
        const peopleHeads = [...new Set([r.name, ...r.aliases].map(n => people.get(n.toLowerCase())).filter(Boolean))];
        const e = {name: r.name, aliases: r.aliases, kind: r.kind, heldOut: r.heldOut, claimCount: r.claimCount,
            sources: [...r.claims.slice(0, 6).map(c => `claim:${c}`), ...r.sources.filter(s => s.startsWith('table:')), ...peopleHeads.map(p => `people:${p}`)]};
        if (rate[r.id]) e.rating = {primary: rate[r.id].primary, all: rate[r.id].all, source: rate[r.id].source, basis: rate[r.id].basis};
        if (l) {
            const at = where(l.grammar_cite);
            e.effect = l.effect;
            e.grammar = {verb: l.verb, object: l.object, target: l.target, time: l.time, valid: validGrammar(l), at: at ?? {locator: '', speaker: 'unknown'}, checked: gFold};
            e.fields = {};
            for (const f of FIELDS) {
                const w = where(l[f].cite);
                const value = w || l[f].value === UNKNOWN[f] ? l[f].value : UNKNOWN[f];
                e.fields[f] = {value, ...(w && value === l[f].value ? {at: w} : {at: {locator: '', speaker: 'unknown'}}), second: h ? (h[f].value === l[f].value ? 'agree' : 'differ') : 'unread'};
            }
            for (const f of ['combines', 'counters']) { const w = where(l[f].cite); e[f] = w && l[f].value ? {value: l[f].value.slice(0, 80), at: w} : {value: '', at: {locator: '', speaker: 'unknown'}}; }
            e.blocked = l.blocked; e.blockedSecond = h ? (h.blocked === l.blocked ? 'agree' : 'differ') : 'unread';
        } else { e.blocked = 'effect-unknown'; e.blockedSecond = 'unread'; e.effect = ''; }
        out[r.id] = e;
    }
    const merge = json(`${PRIV}worm_merge_luna.json`).all.reply.groups;
    const sidecar = {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#worm-power-ledger-2026-11-16', date: '2026-11-16', models: 'gpt-6-luna (low effort) labels; claude-haiku-5-5 second read',
        split: 'held out when sha1(id)[0] < 0x33 (GKM429), frozen before any grammar call', foldRule: FOLD_RULE, classPredicts: CLASS_PREDICTS, unscoredClasses: UNSCORED_CLASSES,
        denominator: 'reader claims (full-book INDEX.json, 2112 claims), the 85-row cape table, the people index; Luna resolve + merge, Haiku merge check',
        score, grammarFolded: gFold, mergeFixes: FIX},
        excluded: merge.filter(x => x.kind === 'drop').map(x => [x.canonical, x.drop_reason.slice(0, 40)]), rows: out};
    writeFileSync(SIDECAR, JSON.stringify(sidecar, null, 1) + '\n');
    console.log(JSON.stringify({rows: Object.keys(out).length, grammarFolded: gFold, excluded: sidecar.excluded.length}));
}
