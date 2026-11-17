#!/usr/bin/env node
// Power ledgers for four fully read LitRPG books with no wiki dump (R7 / PWC17, 2026-11-16, proposals):
// A Novel Concept (anc), Labyrinth of the Mad God books 1 and 2 as one ledger (lmg), You Have Died Again (yhda),
// Speedrunning the Multiverse (smm). One builder, one power sheet (PWC1), per-book ledgers and sidecars.
//
// Stages (each resumable; runner flags --sync --wait --dry --max-usd pass through, AU16):
//   nominate  one request per book part over the book's own synthesis files: every named power, with the book's own
//             category word for it (the held-out classification, PWC2) kept apart from the grammar pass.
//   names     union of table-parsed names (deterministic) and nominated names; freezes the sha1 split (GKM429) into
//             docs/coverage/litrpg_powers_split.json BEFORE any label call.
//   label     one request per name, every question about it in that request, the book digest shared (cached).
//   build     normalise replies, write docs/coverage/<ledger>_powers.jsonl and <ledger>_powers_sheet.json (sidecar),
//             score the grammar against the book's own word, write the results table.
// Private packets and replies stay in LABEL_PRIVATE or the primary checkout's gitignored folder; only normalised
// values and locators are committed (no book prose).
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" node scripts/litrpg_power_ledgers.mjs label --wait
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runPass} from './label_runner.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';

const repo = new URL('..', import.meta.url).pathname;
const PRIMARY = (process.env.YAIRPG_PRIMARY ?? '/Users/weiwei/code/yet-another-idle-rpg').replace(/\/$/, '');
const SRC = `${PRIMARY}/docs/research/novels/full-book`;
const PRIV = `${(process.env.LABEL_PRIVATE ?? `${PRIMARY}/docs/research/power-catalogues-2026-11-16/private`).replace(/\/$/, '')}/`;
export const COVERAGE = `${repo}docs/coverage/`;
const SPLIT_FILE = `${COVERAGE}litrpg_powers_split.json`;

// parts: files read for names (one nominate request each); the label digest is every part together.
export const BOOKS = {
    anc: {ledger: 'a_novel_concept', title: 'A Novel Concept', prefix: 'anc',
        parts: [{id: 'anc', files: ['POWER_INDEX.md', 'TAXONOMY.md', 'LIMITS_AND_BYPASSES.md', 'PEOPLE_AND_KNOWLEDGE.md'].map(f => `a-novel-concept/${f}`)}],
        tables: [{file: 'a-novel-concept/POWER_INDEX.md', col: 1}]},
    lmg: {ledger: 'labyrinth_mad_god', title: 'Labyrinth of the Mad God, books 1 and 2', prefix: 'lmg',
        parts: [{id: 'lmg1', files: ['POWERS.md', 'POWER_INDEX.md', 'PEOPLE.md', 'engine_inputs/abilities_costs_limits.csv', 'engine_inputs/progression_ranks_stats.csv'].map(f => `labyrinth-mad-god-1/${f}`)},
            {id: 'lmg2', files: ['POWERS.md', 'PEOPLE.md', 'engine_inputs/abilities_powers.csv', 'engine_inputs/progression_ranks_stats.csv'].map(f => `labyrinth-mad-god-2/${f}`)}],
        tables: [{file: 'labyrinth-mad-god-1/POWERS.md', col: 1, headers: ['Function', 'Item / function']}, {file: 'labyrinth-mad-god-2/POWERS.md', col: 1, headers: ['Function', 'Item / function']}]},
    yhda: {ledger: 'you_have_died_again', title: 'You Have Died Again', prefix: 'yhda',
        parts: [{id: 'yhda', files: ['DETAILED_FINDINGS.md', 'TAXONOMY.md', 'REPORT.md'].map(f => `you-have-died-again/${f}`)}],
        tables: [{file: 'you-have-died-again/TAXONOMY.md', col: 2}]},
    smm: {ledger: 'speedrunning_multiverse', title: 'Speedrunning the Multiverse', prefix: 'smm', perPart: true,
        common: ['speedrunning-multiverse/DETAILED_FINDINGS.md', 'speedrunning-multiverse/REPORT.md'],
        parts: [{id: 'smm0', files: ['DETAILED_FINDINGS.md', 'REPORT.md', 'HANDOFF_LIFE_SIM.md', 'YAIR_SURFACES.md'].map(f => `speedrunning-multiverse/${f}`)},
            ...[1, 2, 3, 4].map(n => ({id: `smm${n}`, files: [`speedrunning-multiverse/book-${n}/NOTES.md`]}))],
        tables: []},
};

const sha = s => createHash('sha1').update(s).digest('hex');
const jsonOf = path => JSON.parse(readFileSync(path, 'utf8'));
export const keyOf = name => name.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
export const slugOf = name => keyOf(name).replace(/ /g, '_').slice(0, 60);

// ---- the digest: every nonempty line behind its own locator -------------------------------------------------------------
export function digestOf(files) {
    const out = [];
    for (const f of files) {
        readFileSync(`${SRC}/${f}`, 'utf8').split('\n').forEach((line, i) => { if (line.trim() && !/^\|[\s:|-]+\|$/.test(line.trim())) out.push(`[${f.replace('a-novel-concept/', 'anc/').replace('labyrinth-mad-god-', 'lmg').replace('you-have-died-again/', 'yhda/').replace('speedrunning-multiverse/', 'smm/')}:${i + 1}] ${line.trim()}`); });
    }
    return out.join('\n');
}
const digestFor = (book, row = null) => { const cfg = BOOKS[book]; if (!cfg.perPart) return digestOf(cfg.parts.flatMap(p => p.files)); const part = cfg.parts.find(p => p.id === row?.part) ?? cfg.parts[0]; return digestOf([...new Set([...cfg.common, ...part.files])]); };

// ---- deterministic names: first-column cells of the book's own index tables --------------------------------------------
export function tableNames(text, {col = 1, headers = null} = {}) {
    const names = [];
    let on = !headers;
    text.split('\n').forEach((line, i) => {
        const t = line.trim();
        if (!t.startsWith('|')) return;
        const cells = t.split('|').slice(1, -1).map(c => c.trim());
        if (/^[\s:-]+$/.test(cells.join(''))) return;
        if (isAnyHeader(cells)) { on = !headers || headers.includes(cells[0]); return; }
        if (!on || !cells[col - 1]) return;
        for (const piece of cells[col - 1].split(/;| \/ | → /).map(p => p.replace(/[*_`]/g, '').trim()).filter(p => p.length > 2 && p.length < 70)) names.push({name: piece, line: i + 1});
    });
    return names;
}
const isAnyHeader = cells => /^(Function|Item \/ function|Mechanism|Scene \/ character stage|Axis \/ mechanism|Family|Names \/ family)$/i.test(cells[0]);

// ---- the frozen split (GKM429) ------------------------------------------------------------------------------------------
export const SPLIT_RULE = 'A row is held out when the last hex digit of sha1(id) is 0, 1, 2 or 3 (a quarter, fixed before any label call); every other row is the tuning sample. The book category word is never shown to the grammar pass.';
export const heldOut = id => parseInt(sha(id).slice(-1), 16) < 4;

// ---- vocabularies -------------------------------------------------------------------------------------------------------
export const IS_POWER = ['power', 'item-grants-power', 'enemy-or-rival-power', 'rule-or-mechanism', 'resource-or-stat', 'person-place-or-event', 'other-not-power'];
export const POWER_KINDS = new Set(['power', 'item-grants-power', 'enemy-or-rival-power']);
// Blocking slugs (PWC5): the shared ones from the sibling lanes first, then what these books add.
export const SLUGS = ['none', 'mind-binding', 'time-loop', 'area-field', 'power-interaction', 'time-stop', 'source-link', 'memory-transfer', 'form-transformation',
    'familiar-summon', 'power-transfer', 'vow-cost', 'item-bound-power', 'revival-on-death', 'world-travel', 'concept-law', 'body-conditioning-rank', 'luck-mechanism'];
export const KNOWN_BY = ['public', 'holder', 'institution', 'nobody', 'unstated'];
const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown'];

const field = {type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'],
    properties: {value: {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}}};
const FIELDS = ['verb', 'object', 'target', 'time', 'who_may', 'where_from', 'go_wrong', 'mind', 'left_behind', 'combines', 'counters', 'route_to_player', 'known_by'];
const labelSchema = {type: 'object', additionalProperties: false, required: ['kind', ...FIELDS, 'blocking'],
    properties: {kind: {type: 'object', additionalProperties: false, required: ['value', 'reason', 'locator', 'speaker'],
        properties: {value: {type: 'string', enum: IS_POWER}, reason: {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}}},
        ...Object.fromEntries(FIELDS.map(f => [f, field])),
        blocking: {type: 'object', additionalProperties: false, required: ['slug', 'why', 'locator'], properties: {slug: {type: 'string'}, why: {type: 'string'}, locator: {type: 'string'}}}}};
const nominateSchema = {type: 'object', additionalProperties: false, required: ['powers'], properties: {powers: {type: 'array', items: {type: 'object', additionalProperties: false,
    required: ['name', 'book_word', 'locator'], properties: {name: {type: 'string'}, book_word: {type: 'string'}, locator: {type: 'string'}}}}}};

const SYSTEM = `You label source evidence for a game's coverage ledgers. Answer the question at the end about the evidence.
Use only the evidence lines given. Each line starts with its locator in square brackets; copy that bracket's content exactly into "locator" (a range like a:3 to a:9 is fine). Write values as short paraphrases in your own words, never quotations. If the evidence does not state something, set value and locator to "" and speaker to "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: narrator, a character's claim (which may be wrong), a demonstration (shown happening), or the wiki.`;
const NOMINATE = `List every distinct named power in this evidence, using the book's own name: skills, classes, talents, titles, merits, traits, bloodlines, loop, rewind, revival or memory abilities, named items that grant a power, and named enemy or rival powers. One entry per name; skip people, places, events and general rules. "book_word" is the single word or phrase the book itself uses for what kind of thing it is (for example Skill, Talent, Title, Class, Merit, Item, Concept, Bloodline), or "" if the evidence does not say. "locator" is the first evidence line that names it.`;
const LABEL_Q = name => `Subject: "${name}".
Answer for this subject only. kind: is it a power a character can hold or use (power), an item that grants one (item-grants-power), a power held by an enemy or rival (enemy-or-rival-power), or something else (rule-or-mechanism, resource-or-stat, person-place-or-event, other-not-power; then give a short kebab-case reason). Effect grammar, from these exact words: verb one of ${EFFECT_VERBS.join(', ')}; object one of ${Object.keys(EFFECT_OBJECTS).join(', ')}; target one of ${EFFECT_TARGETS.join(', ')}; time one of ${EFFECT_TIMES.join(', ')}. Leave a grammar field empty when the subject is not a power or no word fits. who_may: who can hold it. where_from: how it is acquired. go_wrong: its cost, limit, backlash or drift. mind: its effect on the holder's mind or choices. left_behind: what happens to it on death, loss or transfer. combines: how it interacts with other powers. counters: what stops or answers it. route_to_player: how a player character could plausibly come to hold it in this world. known_by: one of ${KNOWN_BY.join(', ')} (who in the story knows how it works). blocking: the engine capability a game would still need to run it, as one slug from ${SLUGS.join(', ')} (or a new kebab-case slug if none fits), "none" if an ordinary typed skill with stated numbers would run it; "why" is one short phrase; "locator" the evidence line that makes it needed.`;

// ---- stages -------------------------------------------------------------------------------------------------------------
const read = (name, fallback) => existsSync(`${PRIV}${name}`) ? jsonOf(`${PRIV}${name}`) : fallback;
const books = argv => { const b = argv.filter(a => BOOKS[a]); return b.length ? b : Object.keys(BOOKS); };

export async function nominate(argv) {
    mkdirSync(PRIV, {recursive: true});
    for (const book of books(argv)) for (const part of BOOKS[book].parts) {
        await runPass({name: `${part.id}_nominate`, dir: PRIV, system: SYSTEM, schema: nominateSchema, model: 'gpt-6-luna', effort: 'medium', maxTokens: 16000,
            items: [{id: part.id, shared: digestOf(part.files), user: NOMINATE}]}, argv);
    }
}

export function namesFor(book) {
    const cfg = BOOKS[book], rows = new Map();
    const add = (name, source, loc, word = '', part = '') => {
        const k = keyOf(name);
        if (!k) return;
        const r = rows.get(k) ?? {key: k, name: name.replace(/\s+/g, ' ').trim(), sources: new Set(), loc, word: '', part: ''};
        if (part && !r.part) r.part = part;
        r.sources.add(source);
        if (word && !r.word) r.word = word;
        rows.set(k, r);
    };
    for (const t of cfg.tables) {
        const tag = t.file.replace('a-novel-concept/', 'anc/').replace('labyrinth-mad-god-', 'lmg').replace('you-have-died-again/', 'yhda/');
        for (const n of tableNames(readFileSync(`${SRC}/${t.file}`, 'utf8'), t)) add(n.name, 'table', `${tag}:${n.line}`);
    }
    for (const part of cfg.parts) {
        const rep = read(`${part.id}_nominate_luna.json`, {})[part.id]?.reply;
        for (const p of rep?.powers ?? []) add(p.name, 'model-list', p.locator, p.book_word, part.id);
    }
    return [...rows.values()].map(r => ({...r, sources: [...r.sources].sort()})).sort((a, b) => a.key.localeCompare(b.key));
}

export function freezeNames(argv) {
    const split = existsSync(SPLIT_FILE) ? jsonOf(SPLIT_FILE) : {rule: SPLIT_RULE, books: {}};
    for (const book of books(argv)) {
        const names = namesFor(book);
        if (!names.length) { console.log(`${book}: no names yet (run nominate)`); continue; }
        const prefix = BOOKS[book].prefix;
        const rows = names.map(n => ({id: `${prefix}.power.${slugOf(n.name)}`, ...n}));
        const seen = new Set();
        for (const r of rows) { let i = 2, id = r.id; while (seen.has(id)) id = `${r.id}_${i++}`; r.id = id; seen.add(id); }
        writeFileSync(`${PRIV}${prefix}_rows.json`, JSON.stringify(rows));
        // The split is frozen once per book; a later run never moves an id between tuning and held-out because the rule is a pure hash.
        split.books[book] = {names: rows.length, heldOut: rows.filter(r => heldOut(r.id)).map(r => r.id).sort()};
        console.log(`${book}: ${rows.length} names (${rows.filter(r => r.sources.includes('table')).length} table, ${rows.filter(r => r.sources.includes('model-list')).length} model-list), held out ${split.books[book].heldOut.length}`);
    }
    writeFileSync(SPLIT_FILE, JSON.stringify(split, null, 1) + '\n');
}

export async function label(argv) {
    for (const book of books(argv)) {
        const rows = read(`${BOOKS[book].prefix}_rows.json`, null);
        if (!rows) throw Error(`${book}: run names first`);
        await runPass({name: `${BOOKS[book].prefix}_label`, dir: PRIV, system: SYSTEM, schema: labelSchema, model: 'gpt-6-luna', effort: 'low', maxTokens: 6000,
            items: rows.map(r => ({id: r.id, shared: digestFor(book, r), user: LABEL_Q(r.name)}))}, argv);
    }
}

// ---- normalise and score ------------------------------------------------------------------------------------------------
const clean = (s, allowed) => { const v = (s ?? '').trim().toLowerCase(); return !allowed || allowed.includes(v) ? v : ''; };
const SLUG_ALIAS = {'unknown-effect': 'effect-unknown'}; // the Gu ledger's name for the same gap
const slugClean = s => { const v = (s ?? 'none').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'none'; return SLUG_ALIAS[v] ?? v; };
const locClean = s => (s ?? '').replace(/[\[\]]/g, '').trim();
export function sheetRow(row, reply) {
    const f = k => ({v: (reply[k]?.value ?? '').trim(), loc: locClean(reply[k]?.locator), spk: reply[k]?.speaker ?? 'unknown'});
    const g = {verb: clean(reply.verb?.value, EFFECT_VERBS), object: clean(reply.object?.value, Object.keys(EFFECT_OBJECTS)),
        target: clean(reply.target?.value, EFFECT_TARGETS), time: clean(reply.time?.value, EFFECT_TIMES)};
    const kind = IS_POWER.includes(reply.kind?.value) ? reply.kind.value : 'other-not-power';
    return {id: row.id, name: row.name, denominator: row.sources.join('+'), kind, kind_reason: slugClean(reply.kind?.reason), kind_loc: locClean(reply.kind?.locator),
        book_word: (row.word ?? '').trim().toLowerCase(), split: heldOut(row.id) ? 'held-out' : 'tuning', grammar: g,
        who_may: f('who_may'), where_from: f('where_from'), go_wrong: f('go_wrong'), mind: f('mind'), left_behind: f('left_behind'), combines: f('combines'),
        counters: f('counters'), route_to_player: f('route_to_player'), known_by: {...f('known_by'), v: clean(reply.known_by?.value, KNOWN_BY) || 'unstated'},
        blocking: {slug: slugClean(reply.blocking?.slug), why: reply.blocking?.why ?? '', loc: locClean(reply.blocking?.locator)}};
}
export function ledgerRow(s, book) {
    const power = POWER_KINDS.has(s.kind);
    const state = !power ? `not-a-thing:${s.kind_reason || s.kind}` : s.blocking.slug !== 'none' ? `blocked:${s.blocking.slug}` : 'catalogued';
    const mech = power ? ['effect_grammar', ...(s.blocking.slug === 'time-loop' ? ['loop_table', 'harm_loops'] : [])] : [];
    const g = s.grammar, sentence = power && g.verb && g.object ? `${g.verb} ${g.object}${g.target ? ` on ${g.target}` : ''}${g.time ? `, ${g.time}` : ''}` : 'no grammar sentence';
    return {id: s.id, source: `${s.kind_loc || s.blocking.loc || 'digest'} (${BOOKS[book].title}; denominator ${s.denominator})`, state, mechanisms: mech,
        note: `${s.name}. ${power ? `${sentence}. Kind: ${s.kind}.` : `Not a power: ${s.kind_reason || s.kind}.`}${s.blocking.slug !== 'none' && power ? ` Blocked by ${s.blocking.slug}: ${s.blocking.why}.` : ''} Proposal, agent-verified only.`};
}

const mode = a => { const c = {}; for (const x of a) c[x] = (c[x] ?? 0) + 1; return Object.entries(c).sort((p, q) => q[1] - p[1] || p[0].localeCompare(q[0]))[0]?.[0] ?? ''; };
/** Fit on tuning rows (object, then verb, then majority) and score held-out rows against the book's own category word. */
export function scoreGrammar(sheets) {
    const rows = sheets.filter(s => POWER_KINDS.has(s.kind) && s.book_word);
    const tune = rows.filter(s => s.split === 'tuning'), held = rows.filter(s => s.split === 'held-out');
    const base = mode(tune.map(s => s.book_word));
    const by = key => { const m = {}; for (const s of tune) { const k = s.grammar[key]; if (k) (m[k] ??= []).push(s.book_word); } return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, mode(v)])); };
    const byObject = by('object'), byVerb = by('verb');
    const predict = s => byObject[s.grammar.object] ?? byVerb[s.grammar.verb] ?? base;
    const hit = held.filter(s => predict(s) === s.book_word).length, baseHit = held.filter(s => s.book_word === base).length;
    return {tuning: tune.length, heldOut: held.length, majority: base, grammarHits: hit, majorityHits: baseHit, words: [...new Set(rows.map(s => s.book_word))].sort()};
}

export function build(argv) {
    const summary = {};
    for (const book of books(argv)) {
        const cfg = BOOKS[book], rows = read(`${cfg.prefix}_rows.json`, null), replies = read(`${cfg.prefix}_label_luna.json`, {});
        if (!rows) continue;
        const sheets = [], missing = [];
        for (const r of rows) { const rep = replies[r.id]?.reply; if (rep) sheets.push(sheetRow(r, rep)); else missing.push(r.id); }
        sheets.sort((a, b) => a.id.localeCompare(b.id));
        writeFileSync(`${COVERAGE}${cfg.ledger}_powers.jsonl`, sheets.map(s => JSON.stringify(ledgerRow(s, book))).join('\n') + '\n');
        writeFileSync(`${COVERAGE}${cfg.ledger}_powers_sheet.json`, JSON.stringify(sheets) + '\n');
        const states = {};
        for (const s of sheets) { const st = ledgerRow(s, book).state.split(':')[0]; states[st] = (states[st] ?? 0) + 1; }
        const slugs = {};
        for (const s of sheets) if (POWER_KINDS.has(s.kind) && s.blocking.slug !== 'none') slugs[s.blocking.slug] = (slugs[s.blocking.slug] ?? 0) + 1;
        summary[book] = {rows: sheets.length, missing: missing.length, states, slugs, score: scoreGrammar(sheets)};
    }
    writeFileSync(`${COVERAGE}litrpg_powers_results.json`, JSON.stringify({...(existsSync(`${COVERAGE}litrpg_powers_results.json`) ? jsonOf(`${COVERAGE}litrpg_powers_results.json`) : {}), ...summary}, null, 1) + '\n');
    console.log(JSON.stringify(summary, null, 1));
}

const stage = process.argv[2], argv = process.argv.slice(3);
if (import.meta.url === `file://${process.argv[1]}`) {
    const run = {nominate, names: freezeNames, label, build}[stage];
    if (!run) { console.error('usage: litrpg_power_ledgers.mjs nominate|names|label|build [anc|lmg|yhda|smm] [--sync --wait --dry --max-usd N]'); process.exit(2); }
    await run(argv);
}
