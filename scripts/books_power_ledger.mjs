#!/usr/bin/env node
// One power-ledger builder for four fully read books (docs/research/power-catalogues-2026-11-16, PWC1-PWC7, lane A):
//   ss  Shadow Slave -> docs/coverage/shadow_slave_powers.jsonl          sl  Solo Leveling -> solo_leveling_powers.jsonl
//   orv Omniscient Reader's Viewpoint -> omniscient_reader_powers.jsonl  rt  A Regressor's Tale of Cultivation -> regressors_tale_powers.jsonl
// Steps, split so a checkout without the private folders still rebuilds the ledgers (the shape test does):
//   refresh <book..>   reads the private sources (books_power_denominators.mjs), pre-registers the split, the class maps and the fold
//                      rule, writes the committed sidecar skeleton (<stem>_power_labels.json) and the private packets. Before any call.
//   run <book..> [luna|haiku] [--sync|--dry|--wait|--max-usd N]   one request per row through scripts/label_runner.mjs (AU16, batch default)
//   fold <book..>      normalises replies to enums, locators and speakers, scores each class map, writes the result into the sidecar.
//   build <book..>     reads ONLY the sidecar and writes the ledger.
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" node scripts/books_power_ledger.mjs run ss sl orv rt luna
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';
import {attachItemBoundRows} from './item_bound_ledgers.mjs';
import {attachFormRows} from './form_transformation_ledgers.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const PRIVATE = '/Users/weiwei/code/yet-another-idle-rpg/docs/research/power-catalogues-2026-11-16/private/';
export const BOOKS = {
    ss: {stem: 'shadow_slave', title: 'Shadow Slave', source: 'shadow-slave'},
    sl: {stem: 'solo_leveling', title: 'Solo Leveling', source: 'solo-leveling'},
    orv: {stem: 'omniscient_reader', title: "Omniscient Reader's Viewpoint", source: 'omniscient-reader'},
    rt: {stem: 'regressors_tale', title: "A Regressor's Tale of Cultivation", source: 'regressors-tale'}};
export const sidecarPath = book => `${root}docs/coverage/${BOOKS[book].stem}_power_labels.json`;
export const ledgerPath = book => `${root}docs/coverage/${BOOKS[book].stem}_powers.jsonl`;

// ---- Pre-registered before any model call (GKM429, PWC2) ------------------------------------------------------------
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33; // about a fifth, the repo's split
export const SPLIT_RULE = 'held out when sha1(id)[0] < 0x33 (GKM429), fixed before the label passes ran';
// PWC2 asks for a class that implies a grammar part. A rank, grade or level is a magnitude, so it is recorded as a stated field and
// never scored. Two kind classes do imply a part and were mapped from their own words before any reply, never fitted:
//  * Solo Leveling's System screens call a skill Active or Passive: a passive acts all the time or when a trigger holds (time
//    sustained or triggered), an active skill is used (time instant, delayed or lasting).
//  * Shadow Slave's reader-assigned kinds: a Memory is a held object (where_from bound-item), a Nightmare Spell is given by the Spell
//    (system-granted), an Aspect or its ability is unsealed from the soul (innate-or-awakening), a Flaw is a cost (go_wrong is a cost).
export const CLASS_MAPS = {
    sl_active_passive: {book: 'sl', field: 'time', classes: {passive: ['sustained', 'triggered'], active: ['instant', 'delayed', 'lasting']}, redact: /\b(passive|active)\b/gi},
    ss_kind_where_from: {book: 'ss', field: 'where_from', classes: {memory: ['bound-item'], 'memory enchantment': ['bound-item'], enchantment: ['bound-item'],
        'nightmare spell': ['system-granted'], spell: ['system-granted'], aspect: ['innate-or-awakening'], 'aspect ability': ['innate-or-awakening'],
        attribute: ['innate-or-awakening'], 'innate ability': ['innate-or-awakening'], 'aspect legacy': ['innate-or-awakening'], 'dormant ability': ['innate-or-awakening'],
        'awakened ability': ['innate-or-awakening'], 'ascended ability': ['innate-or-awakening']}, redact: /\b(memory|memories|enchantment|nightmare spell|spell|aspect|attribute|innate|dormant|awakened|ascended)\b/gi},
    ss_flaw_go_wrong: {book: 'ss', field: 'go_wrong', classes: {flaw: ['backlash-or-injury', 'corruption-or-madness', 'resource-drain', 'oath-or-price', 'dependence-or-decay']}, redact: /\bflaws?\b/gi}};
export const FOLD_RULE = 'A class map folds into ledger notes only if, on its stated-class rows, at least 5 agree with the map and the count exceeds the majority baseline; '
    + 'otherwise the labels stay in the sidecar as model tier, unchecked. A rank, grade or level is a stated field, never a score.';

// ---- Blocking slugs (PWC5): the shared four, the census five, Perfect Run's time-loop, and sponsorship-contract (new) ---------
export const SLUGS = {
    'mind-binding': 'a power that binds or rewrites another mind (shared slug, PWC5)',
    'time-loop': 'the holder returns to an earlier time or state with memory; src/anchor_snapshots.js branches a world at anchors but restores no body on death (shared slug, PWC5)',
    'area-field': 'an effect that holds over an area and not a target (shared slug, PWC5)',
    'power-interaction': 'a power that answers, cancels or counters another power (shared slug, PWC5)',
    'form-transformation': 'the holder changes own body or form (census slug)',
    'familiar-summon': 'bound spirits, shadows or summoned servants that act on their own (census slug)',
    'power-transfer': 'the power passes by death, theft, inheritance or gift (census slug)',
    'vow-cost': 'a binding oath, contract or price that pays for the power (census slug)',
    'item-bound-power': 'the power lives in a held object that can be lost, stolen or broken (census slug)',
    'sponsorship-contract': 'a patron grants, sets terms on and can withdraw the power, paid in coins or stories; no patron relation exists in the engine (new slug, ORV)'};
const OVERRIDE = {
    rt: {'rt.power.regression': 'time-loop', 'rt.power.death-triggered-return': 'time-loop', 'rt.power.fate-prophecy-and-history-revision': 'time-loop'},
    orv: {'orv.power.stigma-regression': 'time-loop', 'orv.power.stigma-group-regression': 'time-loop', 'orv.power.stigma-transmission': 'power-transfer',
        'orv.power.skill-bookmark': 'power-transfer', 'orv.power.skill-incite': 'power-transfer', 'orv.power.skill-eight-lives': 'time-loop'},
    sl: {'sl.power.cup-of-reincarnation': 'time-loop', 'sl.power.shadow-extraction': 'familiar-summon', 'sl.power.shadow-storage': 'familiar-summon', 'sl.power.shadow-exchange': 'familiar-summon',
        'sl.power.sense-sharing': 'familiar-summon', 'sl.power.destruction-code': 'power-interaction', 'sl.power.bead-of-avarice': 'item-bound-power'},
    ss: {}};

// ---- Sheet vocabulary (PWC1); free text stays private, enums are what is committed ------------------------------------
export const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown'];
export const SHEET = {
    who_may: ['anyone', 'awakened-or-chosen', 'named-holder-only', 'trained-user', 'sponsored', 'institution-controlled', 'unknown'],
    where_from: ['innate-or-awakening', 'trained-or-learned', 'system-granted', 'sponsor-granted', 'bound-item', 'inherited-or-transferred', 'summoned-or-bound-being', 'acquired-by-ritual-or-price', 'other', 'unknown'],
    go_wrong: ['backlash-or-injury', 'corruption-or-madness', 'resource-drain', 'oath-or-price', 'dependence-or-decay', 'limit-only', 'none-stated', 'unknown'],
    mind: ['none-stated', 'personality-drift', 'compulsion-or-madness', 'memory-effect', 'loss-of-self', 'addiction', 'unknown'],
    left_behind: ['dies-with-holder', 'persists-after-death', 'passes-to-another', 'item-remains', 'reset-restores', 'unknown'],
    combines: ['stacks-with-other-power', 'needs-item-or-source', 'boosted-by-rank-or-level', 'none-stated', 'unknown'],
    counters: ['block-or-immunity', 'distance-or-cover', 'cancel-or-dispel', 'tactics-or-skill', 'resource-exhaustion', 'none-stated', 'unknown'],
    known_by: ['public', 'holder-only', 'holder-and-ally', 'institution', 'no-one', 'unknown']};
export const GRAMMAR = {verb: [...EFFECT_VERBS, 'none'], object: [...Object.keys(EFFECT_OBJECTS), 'none'], target: [...EFFECT_TARGETS, 'none'], time: [...EFFECT_TIMES, 'none']};
const part = values => ({type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'],
    properties: {value: {type: 'string', enum: values}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}}});
export const SCHEMA = {type: 'object', additionalProperties: false, required: ['named_power', ...Object.keys(GRAMMAR), ...Object.keys(SHEET)],
    properties: {named_power: {type: 'string', enum: ['yes', 'no']}, ...Object.fromEntries([...Object.entries(GRAMMAR), ...Object.entries(SHEET)].map(([k, v]) => [k, part(v)]))}};

const read = path => JSON.parse(readFileSync(path, 'utf8'));
// Meta pretty, one row per line: a diff of the sidecar reads row by row.
const writeSide = (path, side) => writeFileSync(path, `{\n "meta": ${JSON.stringify(side.meta, null, 1).replace(/\n/g, '\n ')},\n "rows": {\n${Object.entries(side.rows).map(([id, r]) => `  ${JSON.stringify(id)}: ${JSON.stringify(r)}`).join(',\n')}\n }\n}\n`);
const tally = values => values.reduce((a, v) => ({...a, [v]: (a[v] ?? 0) + 1}), {});

// ---- refresh --------------------------------------------------------------------------------------------------------
const statedClassOf = (book, e) => {
    const out = [];
    if (book === 'sl') {
        const lines = e.evidence.filter(l => /\b(passive|active skill|active)\b/i.test(l.text));
        const kinds = new Set(lines.map(l => (/\bpassive\b/i.test(l.text) ? 'passive' : 'active')));
        if (kinds.size === 1) out.push({map: 'sl_active_passive', class: [...kinds][0], locator: lines.find(l => /passive|active/i.test(l.text)).loc, speaker: 'narrator'});
    }
    if (book === 'ss') {
        const own = e.worldKinds ?? [];
        // A name that carries the class word would leak it to the prompt (an Aspect called "X's Aspect"), so it is not scored.
        const leaky = word => new RegExp(`\\b${word}\\b`, 'i').test(e.name);
        for (const wk of own) {
            if (CLASS_MAPS.ss_kind_where_from.classes[wk] && !leaky(wk.split(' ')[0])) { out.push({map: 'ss_kind_where_from', class: wk, locator: 'reader kind', speaker: 'unknown'}); break; }
        }
        if (own.includes('flaw') && !leaky('flaw')) out.push({map: 'ss_flaw_go_wrong', class: 'flaw', locator: 'reader kind', speaker: 'unknown'});
    }
    return out;
};
export const redactFor = (text, classes) => classes.reduce((t, c) => t.replace(CLASS_MAPS[c.map].redact, '[x]'), text);

async function refresh(book) {
    const {entities} = await import('./books_power_denominators.mjs');
    const ents = entities(book);
    const rows = {}, packets = [];
    for (const e of ents) {
        const id = e.key;
        const stated = statedClassOf(book, e);
        rows[id] = {name: e.name, category: e.category, nameSource: e.nameSource, mentions: e.mentions ?? null, chapters: e.chapters ?? null, evidenceLines: e.evidence.length,
            ...(e.holders?.length ? {holders: e.holders} : {}), ...(e.worldKinds?.length ? {readerKinds: e.worldKinds.slice(0, 4)} : {}), ...(e.stated ? {stated: e.stated} : {}),
            ...(stated.length ? {classes: stated} : {}), heldOut: heldOut(id)};
        const text = t => redactFor(t, stated);
        packets.push({id, name: text(e.name), category: e.category, evidence: e.evidence.map(l => `[${l.loc}] {${l.tag}} ${text(l.text)}`)});
    }
    const meta = {schema: 'book-power-labels/1', book: BOOKS[book].title, date: '2026-11-16', status: 'proposals (AD32), agent-verified, not human-reviewed',
        split: SPLIT_RULE, classMaps: Object.fromEntries(Object.entries(CLASS_MAPS).filter(([, m]) => m.book === book).map(([k, m]) => [k, {field: m.field, classes: m.classes}])), foldRule: FOLD_RULE,
        slugs: SLUGS, overrides: OVERRIDE[book]};
    const path = sidecarPath(book);
    const old = existsSync(path) ? read(path) : {};
    writeSide(path, {meta: {...meta, ...(old.meta?.scores ? {scores: old.meta.scores} : {}), ...(old.meta?.denominator ? {denominator: old.meta.denominator} : {})},
        rows: Object.fromEntries(Object.entries(rows).map(([id, r]) => [id, {...r, ...(old.rows?.[id]?.labels ? {labels: old.rows[id].labels} : {})}]))});
    mkdirSync(PRIVATE, {recursive: true});
    writeFileSync(`${PRIVATE}${book}_powers_packets.json`, JSON.stringify(packets));
    const leaks = packets.filter(p => rows[p.id].classes).flatMap(p => [p.name, ...p.evidence.map(l => l.replace(/^\[[^\]]*\]\s*\{[A-Z]\}/, ''))]
        .filter(t => rows[p.id].classes.some(c => new RegExp(CLASS_MAPS[c.map].redact.source, 'i').test(t))));
    console.log(JSON.stringify({book, rows: ents.length, packets: packets.length, stated: Object.values(rows).filter(r => r.classes).length, classLeaks: leaks.length}));
}

// ---- run (label_runner.mjs: one request per row, evidence as the shared block, batch by default, AU16) ------------------------
const RULES = `You label powers from a book's own claims. Use only the evidence lines given. Each starts with its locator in square brackets and a tag in braces (W witnessed, S shown, N narrator, T told by a character, I inferred, L stated in the dossier, U unknown). Copy the bracket's content exactly into "locator", without the brackets. A field the evidence does not state takes the value "unknown" (or "none" for effect parts, "none-stated" where the evidence says nothing is lost or affected). speaker: narrator, demonstration (shown in action), character_claim (a character says so), unknown. Every line here comes from the book or the project's own reading of it, so never answer wiki. Never write quotations. Evidence lines are summaries, not the book's text.`;
const ask = p => `Fill the power sheet for "${p.name}" (${p.category}).
named_power: "yes" when the evidence describes something a holder does or is, "no" when it names no power or effect.
Effect (one grammar sentence for the primary effect): verb (${GRAMMAR.verb.join(', ')}); object, what it acts on (${GRAMMAR.object.join(', ')}); target (${GRAMMAR.target.join(', ')}); time (${GRAMMAR.time.join(', ')}).
Then from the evidence only: who_may (who can hold or use it), where_from (how it is acquired), go_wrong (cost, backlash or drift), mind (effect on the holder's mind), left_behind (what happens on death or reset), combines (what it stacks or works with), counters (what stops it), known_by (who in the world knows how it works).
Choices: ${Object.entries(SHEET).map(([k, v]) => `${k}: ${v.join(' | ')}`).join('. ')}.`;
export const MODELS = {luna: 'gpt-6-luna', haiku: 'claude-haiku-5-5'};

async function run(book, which, argv) {
    const {runPass} = await import('./label_runner.mjs');
    const packets = read(`${PRIVATE}${book}_powers_packets.json`);
    const items = packets.map(p => ({id: p.id, shared: `Power: ${p.name} (${p.category})\nEvidence:\n${p.evidence.join('\n') || '(no evidence lines)'}`, user: ask(p)}));
    const out = await runPass({name: `${book}_powers`, dir: PRIVATE, system: RULES, schema: SCHEMA, items, model: MODELS[which], effort: 'low', maxTokens: 3000}, argv);
    console.log(JSON.stringify({book, model: which, done: out.done, replies: Object.keys(out.replies).length}));
}

// ---- fold -----------------------------------------------------------------------------------------------------------
// Keep a field only when its locator is one the packet offered; anything else is voided, so a model cannot invent one.
function normalise(reply, locators) {
    const out = {named_power: reply.named_power};
    for (const k of [...Object.keys(GRAMMAR), ...Object.keys(SHEET)]) {
        const f = {...reply[k], locator: String(reply[k].locator ?? '').replace(/^\[|\]$/g, '').trim()}; const empty = k in GRAMMAR ? 'none' : 'unknown';
        const stated = f.value !== empty && f.value !== 'none-stated';
        const ok = stated ? locators.has(f.locator) : true;
        out[k] = ok ? {value: f.value, locator: locators.has(f.locator) ? f.locator : '', speaker: f.speaker} : {value: empty, locator: '', speaker: 'unknown', voided: f.value};
    }
    return out;
}
const locatorsOf = p => new Set(p.evidence.map(l => /^\[([^\]]*)\]/.exec(l)?.[1]).filter(Boolean));

function fold(book) {
    const side = read(sidecarPath(book));
    const packets = new Map(read(`${PRIVATE}${book}_powers_packets.json`).map(p => [p.id, p]));
    const get = suffix => existsSync(`${PRIVATE}${book}_powers_${suffix}.json`) ? read(`${PRIVATE}${book}_powers_${suffix}.json`) : {};
    const luna = get('luna'), haiku = get('haiku');
    let voided = 0;
    for (const [id, row] of Object.entries(side.rows)) {
        const p = packets.get(id); const l = luna[id]?.reply; if (!l) continue;
        const L = normalise(l, locatorsOf(p)); const H = haiku[id]?.reply ? normalise(haiku[id].reply, locatorsOf(p)) : null;
        const labels = {named_power: L.named_power, ...(H ? {second_named_power: H.named_power} : {})};
        for (const k of [...Object.keys(GRAMMAR), ...Object.keys(SHEET)]) {
            const lv = L[k], hv = H?.[k]; if (lv.voided) voided++;
            const unset = k in GRAMMAR ? 'none' : 'unknown';
            const agree = !H ? 'luna-only' : lv.value === hv.value ? 'agreed' : lv.value === unset ? 'haiku-adds' : hv.value === unset ? 'luna-only' : 'disputed';
            labels[k] = {value: lv.value, locator: lv.locator, speaker: lv.speaker, second: hv?.value ?? null, reading: agree};
        }
        row.labels = labels;
    }
    const lines = {};
    for (const [name, map] of Object.entries(CLASS_MAPS).filter(([, m]) => m.book === book)) {
        const mapped = Object.entries(side.rows).filter(([, r]) => r.labels && r.classes?.some(c => c.map === name));
        const verdict = ([, r]) => {
            const cls = r.classes.find(c => c.map === name).class;
            return {cls, ok: map.classes[cls].includes(r.labels[map.field].value), answered: r.labels[map.field].value !== (map.field === 'time' ? 'none' : 'unknown')};
        };
        for (const [part, pick] of [['heldOut', ([, r]) => r.heldOut], ['all', () => true]]) {
            const rows = mapped.filter(pick); const answered = rows.filter(r => verdict(r).answered);
            const majority = Math.max(0, ...Object.values(tally(rows.map(r => verdict(r).cls))));
            lines[`${name}.${part}`] = {n: rows.length, answered: answered.length, agree: answered.filter(r => verdict(r).ok).length, majorityBaseline: majority,
                misses: answered.filter(r => !verdict(r).ok).map(([id, r]) => `${id}:${r.labels[map.field].value} for ${verdict([id, r]).cls}`).slice(0, 40)};
        }
    }
    const folded = Object.fromEntries(Object.keys(CLASS_MAPS).filter(n => CLASS_MAPS[n].book === book).map(n => [n, lines[`${n}.all`].agree >= 5 && lines[`${n}.all`].agree > lines[`${n}.all`].majorityBaseline]));
    const counts = {rows: Object.keys(side.rows).length, labelled: Object.values(side.rows).filter(r => r.labels).length, namedPowerNo: Object.values(side.rows).filter(r => r.labels?.named_power === 'no').length,
        readings: tally(Object.values(side.rows).flatMap(r => Object.entries(r.labels ?? {}).filter(([k]) => k in GRAMMAR).map(([, v]) => v.reading))), voidedLocators: voided, haikuRows: Object.keys(haiku).length};
    side.meta.scores = {lines, folded, counts};
    writeSide(sidecarPath(book), side);
    console.log(book, JSON.stringify(side.meta.scores.counts), JSON.stringify(Object.fromEntries(Object.entries(lines).map(([k, v]) => [k, `${v.agree}/${v.answered} of ${v.n}, baseline ${v.majorityBaseline}`]))));
}

// ---- build (reads only the committed sidecar) -----------------------------------------------------------------------------
export function slugFor(book, id, r) {
    const l = r.labels; if (!l) return null;
    if (OVERRIDE[book]?.[id]) return OVERRIDE[book][id];
    if (l.object.value === 'mind' && l.verb.value === 'bind') return 'mind-binding';
    if (l.where_from.value === 'summoned-or-bound-being') return 'familiar-summon';
    if (l.where_from.value === 'bound-item') return 'item-bound-power';
    if (l.where_from.value === 'sponsor-granted') return 'sponsorship-contract';
    if (l.where_from.value === 'inherited-or-transferred' || l.left_behind.value === 'passes-to-another') return 'power-transfer';
    if (l.verb.value === 'transform' && l.object.value === 'form') return 'form-transformation';
    if (l.go_wrong.value === 'oath-or-price') return 'vow-cost';
    if (l.target.value === 'area') return 'area-field';
    if (['block', 'end'].includes(l.verb.value)) return 'power-interaction';
    return null;
}
export function buildLedger(book, side) {
    return Object.entries(side.rows).map(([id, r]) => {
        const l = r.labels;
        const grammar = l && l.object.value !== 'none' && l.verb.value !== 'none' ? `${l.verb.value}.${l.object.value}/${l.target.value}/${l.time.value}` : null;
        const slug = slugFor(book, id, r);
        const no = l && l.named_power === 'no' && (l.second_named_power ?? 'no') === 'no';
        const state = no ? 'not-a-thing:no-named-power' : slug ? `blocked:${slug}` : 'catalogued';
        const folded = Object.values(side.meta.scores?.folded ?? {}).some(Boolean);
        const stated = r.stated ? ` Stated ${r.stated.kind} ${r.stated.value} (${r.stated.locator}).` : '';
        const note = `${r.category}. Name source ${r.nameSource.join(', ')}.${stated}`
            + (grammar ? ` Effect ${grammar}${folded ? '' : ' (model tier, unchecked)'}.` : '') + (slug ? ` Blocked: ${SLUGS[slug]}.` : '') + ` Full sheet in ${BOOKS[book].stem}_power_labels.json.`;
        return {id, source: `${BOOKS[book].source} ${r.nameSource[0]}`, state, mechanisms: ['W'], test: null, note};
    });
}
async function build(book) {
    const rows = await attachFormRows(await attachItemBoundRows(buildLedger(book, read(sidecarPath(book)))));
    writeFileSync(ledgerPath(book), `${rows.map(r => JSON.stringify(r)).join('\n')}\n`);
    console.log(book, JSON.stringify({rows: rows.length, states: tally(rows.map(r => r.state))}));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    const cmd = args.shift();
    const books = args.filter(a => a in BOOKS), models = args.filter(a => a in MODELS), flags = args.filter(a => a.startsWith('--') || /^\d/.test(a));
    for (const b of books) {
        if (cmd === 'refresh') await refresh(b);
        else if (cmd === 'run') for (const m of models.length ? models : ['luna']) await run(b, m, flags);
        else if (cmd === 'fold') fold(b);
        else if (cmd === 'build') await build(b);
        else { console.error('usage: refresh|run|fold|build <ss|sl|orv|rt..> [luna|haiku] [--sync|--dry|--wait|--max-usd N]'); process.exit(2); }
    }
}
