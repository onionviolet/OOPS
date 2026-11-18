#!/usr/bin/env node
// Power ledgers for four full-read books with no wiki dump (docs/research/power-catalogues-2026-11-16, PWC17, PWC1-PWC7):
// Mother of Learning (mol), Circle of Inevitability (coi), The Legendary Mechanic (lm), I Am the Fated Villain (fv).
// One builder, one sidecar per book (docs/coverage/<book>_power_labels.json), one ledger per book (<book>_powers.jsonl).
// Steps, each resumable; private packets and replies live under the primary checkout's gitignored folder:
//   refresh <book>   reads the books' reader claims and indexes, writes name packets (private).
//   names <book>     name pass (PWC3): every named power in the claims, with the book's own class words kept apart (batch).
//   merge <book>     alias-merges names into rows, FREEZES the sha1 split (GKM429) into the sidecar, writes sheet packets.
//   sheets <book>    sheet pass (PWC1): one request per row, every question in it, the held-out class redacted (batch).
//   fold <book>      normalises replies to enums, locators and speakers; scores where the book has a classification (PWC2).
//   build [book]     reads ONLY the committed sidecar (and lotm_potions for links) and writes the ledger. Offline.
// Usage: node scripts/book_power_ledgers.mjs <step> <mol|coi|lm|fv|all> [--wait|--sync|--dry] [--max-usd N]
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" node scripts/book_power_ledgers.mjs names all --wait
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync, existsSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {foldChapterEffect} from './chapter_effect_tier.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';
import {attachItemBoundRows} from './item_bound_ledgers.mjs';
import {attachFormRows} from './form_transformation_ledgers.mjs';

const root = new URL('..', import.meta.url).pathname;
const PRIMARY = '/Users/weiwei/code/yet-another-idle-rpg/';
const NOVELS = `${PRIMARY}docs/research/novels/full-book/`;
const PRIVATE = `${PRIMARY}docs/research/power-catalogues-2026-11-16/private/`;
export const DATE = '2026-11-16';

// ---- The shared vocabulary, fixed before any model call --------------------------------------------------------------
export const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown'];
export const KINDS = ['spell-or-technique', 'innate-or-bloodline', 'class-or-rank-step', 'item-or-device', 'system-feature', 'rule-not-power'];
export const ROUTES = ['born', 'taught', 'potion-or-ritual', 'purchase', 'system-granted', 'item-granted', 'trained', 'accident', 'contract', 'unknown'];
export const KNOWLEDGE = ['public', 'holder-only', 'institution', 'none-known', 'unknown'];
export const MIND = ['none-stated', 'drift', 'compulsion', 'cost', 'other'];
// The blocking-rule vocabulary (PWC5). The first nine are the shared slugs the sibling lanes posted; the rest name what these four
// books need that the engine lacks. 'none' = nothing the engine cannot express was found (state `catalogued`, never a run).
export const SLUGS = Object.freeze({
    'mind-binding': 'a power that binds or rewrites another mind (shared slug, PWC5)',
    'time-loop': 'a loop or reset of time that a person carries across (shared slug, PWC5)',
    'area-field': 'an effect that holds over an area and not a target (shared slug, PWC5)',
    'power-interaction': 'a power that answers another power: cancel, immunity, counter (shared slug, PWC5)',
    'form-transformation': 'changing the holder\'s own body or form (shared slug, PWC9)',
    'familiar-summon': 'bound spirits, constructs or summoned servants that act on their own (shared slug, PWC9)',
    'power-transfer': 'power passing by death, theft, bloodline or gift (shared slug, PWC9)',
    'vow-cost': 'binding vows, contracts or limits that pay for power (shared slug, PWC9)',
    'item-bound-power': 'the power lives in a held object or device (shared slug, PWC9)',
    'soul-state': 'soul, spirit or afterlife mechanics the body model lacks',
    'system-interface': 'a game-like system: points, shop, status screen, levels or a granted interface',
    'blueprint-craft': 'learning a design and manufacturing from it with materials and a build process',
    'construct-upkeep': 'a made body (simulacrum, golem, suit) that draws on a reserve every minute',
    'divination-fate': 'seeing, nudging or reading fate, luck or hidden truth',
    'dimension-travel': 'moving a person or thing between worlds, planes or dream spaces',
    'effect-unknown': 'the evidence does not say what it does well enough to run'});
export const BLOCKERS = [...Object.keys(SLUGS), 'none'];
export const GRAMMAR = {verb: EFFECT_VERBS, object: Object.keys(EFFECT_OBJECTS), target: EFFECT_TARGETS, time: EFFECT_TIMES};
export const SHEET = {kind: KINDS, route: ROUTES, knowledge: KNOWLEDGE, mind: MIND};
// Enums as committed and as asked: the grammar may say none-stated, the sheet may say unknown (a labelled gap, never a guess).
export const ENUMS = {...Object.fromEntries(Object.entries(GRAMMAR).map(([k, v]) => [k, [...v, 'none-stated']])), kind: [...KINDS, 'unknown'], route: ROUTES, knowledge: KNOWLEDGE, mind: MIND};
export const STATED = ['go_wrong', 'who_may', 'left_behind', 'combines', 'counters']; // committed as stated: true/false, text stays private

// Circle of Inevitability only. The pathway is the book's own classification, hidden from the sheet pass and scored against the
// grammar object. The map was written from the pathways' domain words (not fitted to any reply) before the first call: an object
// predicts a SET of pathways it plausibly belongs to; a hit is the real pathway being in the set.
export const PATHWAY_OF_OBJECT = Object.freeze({
    information: ['fool', 'error', 'white_tower', 'hermit', 'visionary'], memory: ['visionary', 'error', 'hermit'], mind: ['visionary', 'darkness', 'abyss', 'justiciar', 'demoness', 'moon'],
    light: ['sun'], heat: ['sun', 'red_priest'], force: ['tyrant', 'twilight_giant', 'red_priest'], vitality: ['mother', 'twilight_giant', 'demoness', 'moon', 'death', 'chained', 'sun'],
    lifespan: ['mother', 'death'], position: ['door', 'fool'], form: ['moon', 'abyss', 'chained', 'twilight_giant'], thing: ['paragon', 'door', 'error'],
    working: ['paragon', 'hermit', 'fool', 'white_tower'], law: ['black_emperor', 'justiciar', 'tyrant'], relation: ['hanged_man', 'black_emperor', 'justiciar'],
    luck: ['wheel_of_fortune', 'error', 'hanged_man'], time: ['wheel_of_fortune', 'door'], essence: ['death', 'chained', 'hanged_man'], soul: ['death', 'chained', 'hanged_man', 'moon'],
    sound: ['tyrant', 'darkness'], moisture: ['tyrant']});
export const FOLD_RULE = 'The grammar tier folds into ledger notes only if, on the held-out Circle of Inevitability Sequence rows whose pathway is known, at least 5 hits '
    + 'agree with the pre-registered object-to-pathway map and the count exceeds the best constant-object baseline; otherwise its sentences stay in the sidecar as model-tier, unchecked. '
    + 'The other three books have no per-power classification in the book and are not scored.';
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33; // about a fifth, the repo's split (GKM429)
export const SPLIT_RULE = 'held out when sha1(id)[0] < 0x33 (GKM429), fixed in the sidecar before the sheet pass ran';

export const BOOKS = {
    mol: {slug: 'mother_of_learning', title: 'Mother of Learning', prefix: 'mol', dir: 'mother-of-learning', scored: false,
        unscoredReason: 'no per-power classification in the book: the circle badges and rank names classify mages and the mana reserve, not spells or techniques (POWERS.md, readers 021-035 notes)',
        sourceText: 'Mother of Learning full read (EPUB, 107 story items): POWERS.md, engine_inputs powers_costs_limits.csv and the readers\' notes'},
    coi: {slug: 'circle_of_inevitability', title: 'Circle of Inevitability', prefix: 'coi', dir: 'circle-of-inevitability', scored: true,
        sourceText: 'Circle of Inevitability full read (1,178 chapters, MTL-qualified web scrape): claims.json category power and POWERS.md'},
    lm: {slug: 'legendary_mechanic', title: 'The Legendary Mechanic', prefix: 'lm', dir: 'legendary-mechanic', scored: false,
        unscoredReason: 'grade A to E ranks combat strength of people, and levels belong to people and the Mechanic class, not to single skills or blueprints (LM-004)',
        sourceText: 'The Legendary Mechanic full read: POWER_AND_PRODUCTION.md and engine_inputs ability, core, progression and economy tables'},
    fv: {slug: 'fated_villain', title: 'I Am the Fated Villain', prefix: 'fv', dir: 'fated-villain', scored: false,
        unscoredReason: 'ranks and levels in the book classify people and artifacts (rank conversion is an open, MTL-qualified question), not each technique',
        sourceText: 'I Am the Fated Villain gemini-2.5-flash MTL edition, pass 2 incomplete: CLAIM_LEDGER.json system claims and ability-word claims, POWERS.md'},
};
const sidecarPath = b => `${root}docs/coverage/${BOOKS[b].slug}_power_labels.json`;
export const ledgerPath = b => `${root}docs/coverage/${BOOKS[b].slug}_powers.jsonl`;
const priv = (b, name) => `${PRIVATE}${b}_${name}`;
const jread = p => JSON.parse(readFileSync(p, 'utf8'));
const jwrite = (p, v) => writeFileSync(p, JSON.stringify(v, null, 1) + '\n');
export const slugify = s => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/^(the|a|an)\s+/, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// ---- Evidence: reader claims and indexes -> lines {loc, text}; loc is the exact string the model must copy ------------------
function csv(text) {
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
        else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (c !== '\r') cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    const [head, ...body] = rows; return body.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
const mdLines = (file, tag, min = 50) => readFileSync(file, 'utf8').split('\n').map((text, i) => ({loc: `${tag}:L${i + 1}`, text: text.trim()})).filter(l => l.text.length >= min && !/^[#|\s-]*$/.test(l.text) && !/^\|[-\s|]+\|$/.test(l.text));
const span = p => p.paragraph_start === p.paragraph_end ? `p${p.paragraph_start}` : `p${p.paragraph_start}-${p.paragraph_end}`;

export function loadEvidence(b) {
    const dir = `${NOVELS}${BOOKS[b].dir}/`, lines = [];
    if (b === 'mol') {
        lines.push(...mdLines(`${dir}POWERS.md`, 'POWERS.md'));
        for (const r of csv(readFileSync(`${dir}engine_inputs/powers_costs_limits.csv`, 'utf8'))) lines.push({loc: `${r.claim_id} ${r.locator}`, text: `${r.subject}: ${r.value}. ${r.condition}. ${r.caveat}`});
        const word = /\b(mana|spell|magic|shaping|invocation|soul|ritual|divination|simulacrum|formula|mind|dispel|blank|force|golem|conjur|enchant|alchem)\w*/i;
        for (const f of readdirSync(`${dir}readers`).filter(f => /NOTES\.md$/.test(f))) lines.push(...mdLines(`${dir}readers/${f}`, f.replace('_NOTES.md', '').replace('.md', ''), 90).filter(l => word.test(l.text)));
    } else if (b === 'lm') {
        lines.push(...mdLines(`${dir}POWER_AND_PRODUCTION.md`, 'PP'));
        for (const f of ['abilities_costs_limits', 'core_mechanic', 'progression_ranks_stats']) for (const r of csv(readFileSync(`${dir}engine_inputs/${f}.csv`, 'utf8'))) lines.push({loc: `${r.id} ${r.locator}`, text: `${r.subject}: ${r.value} ${r.unit ?? ''}. ${r.condition}. ${r.caveat}`});
    } else if (b === 'coi') {
        for (const c of jread(`${dir}claims.json`).claims.filter(c => c.category === 'power')) {
            const l = c.locators?.[0], loc = `${c.id} s${l?.spine_index ?? '?'}:${l ? span(l) : 'p?'}`;
            lines.push({loc, text: `${c.statement} ${c['prerequisites/state_change'] ?? ''} [${c.epistemic_status}]`});
        }
        lines.push(...mdLines(`${dir}POWERS.md`, 'POWERS.md'));
    } else if (b === 'fv') {
        const kw = /\b(technique|skill|physique|bloodline|talent|spell|secret method|divine ability|dao bone|ability|abilit)/i;
        for (const c of jread(`${dir}CLAIM_LEDGER.json`).claims) {
            if (!(c.kind.includes('system') || kw.test(c.value))) continue;
            const l = c.locator?.[0], p = l?.paragraphs?.[0];
            lines.push({loc: `${c.id} s${l?.section ?? '?'}${p ? `:p${p[0]}-${p[1]}` : ''}`, text: c.value.replace(/^\[[^\]]*\]\s*[—.-]*\s*/, '').slice(0, 1400)});
        }
        lines.push(...mdLines(`${dir}POWERS.md`, 'POWERS.md'));
    }
    const seen = new Set(); return lines.filter(l => !seen.has(l.loc) && seen.add(l.loc));
}

// ---- Prompts and schemas ----------------------------------------------------------------------------------------------
const field = (enumValues) => ({type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'],
    properties: {value: enumValues ? {type: 'string', enum: enumValues} : {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}}});
export const RULES = `You label source evidence from a novel for a game's power ledger. Use only the evidence lines given. Each line starts with its locator in square brackets; copy a bracket's content exactly into "locator". Write values as short paraphrases in your own words, never quotations. If the evidence does not say, use the empty value or the enum's unknown, and an empty locator. speaker is who says it: narrator, character_claim (a character states it; characters can be wrong), demonstration (shown happening), wiki, unknown.`;
export const NAME_SCHEMA = {type: 'object', additionalProperties: false, required: ['powers'], properties: {powers: {type: 'array', items: {type: 'object', additionalProperties: false,
    required: ['name', 'aliases', 'kind', 'class_group', 'class_rank', 'locators'],
    properties: {name: {type: 'string'}, aliases: {type: 'array', items: {type: 'string'}}, kind: {type: 'string', enum: KINDS.filter(k => k !== 'rule-not-power')},
        class_group: {type: 'string'}, class_rank: {type: 'string'}, locators: {type: 'array', items: {type: 'string'}}}}}}};
export const NAME_ASK = `List every NAMED power in the evidence lines: a named spell, technique, skill, ability, class step or Sequence, bloodline or physique talent, blueprint or device ability, system function, or other named way a character can do something beyond ordinary. One entry per distinct power, using the name the evidence uses most; put other names for the same power in "aliases". Do not list people, places, organisations, ordinary objects, or general rules without a name. kind: spell-or-technique, innate-or-bloodline, class-or-rank-step (a Sequence, class or realm step), item-or-device (a power that lives in an object), or system-feature. class_group and class_rank: the book's own classification of this power if the evidence states one, in plain words as written (a pathway or school or family name, and a Sequence number, rank, grade or circle); empty when none is stated. locators: the locators of the lines that name or describe it (at most 8).`;
export const SHEET_SCHEMA = {type: 'object', additionalProperties: false,
    required: ['kind', 'verb', 'object', 'target', 'time', 'route', 'knowledge', 'mind', 'blocker', 'go_wrong', 'who_may', 'left_behind', 'combines', 'counters'],
    properties: {kind: field(ENUMS.kind), verb: field(ENUMS.verb), object: field(ENUMS.object), target: field(ENUMS.target), time: field(ENUMS.time), route: field(ENUMS.route), knowledge: field(ENUMS.knowledge), mind: field(ENUMS.mind),
        blocker: {type: 'object', additionalProperties: false, required: ['value', 'reason'], properties: {value: {type: 'string', enum: BLOCKERS}, reason: {type: 'string'}}},
        go_wrong: field(), who_may: field(), left_behind: field(), combines: field(), counters: field()}};
const vocab = o => Object.entries(o).map(([k, v]) => `${k} (${v})`).join('; ');
export const SHEET_ASK = `Fill the power sheet for the named power in the message, from the evidence lines only.
kind: what sort of thing it is (spell-or-technique, innate-or-bloodline, class-or-rank-step, item-or-device, system-feature, or rule-not-power when it is a general rule or a person, place or ordinary object and not a power).
verb, object, target, time: the effect as one sentence of a fixed grammar. verb: ${GRAMMAR.verb.join(', ')}. object: ${GRAMMAR.object.join(', ')}. target: ${GRAMMAR.target.join(', ')} (self; touched = a thing or person in contact; bound = a held bond; line; cone; area; marked = something tagged). time: ${GRAMMAR.time.join(', ')}. Pick the single best fit for what the power mainly does.
route: how a character gets it (${ROUTES.join(', ')}). knowledge: who in the story knows how it works (${KNOWLEDGE.join(', ')}). mind: its effect on the holder's mind (${MIND.join(', ')}; drift = personality or drive changes over time; compulsion = urges or loss of control; cost = a mental price paid per use).
go_wrong, who_may, left_behind, combines, counters: a short paraphrase (empty when not stated) of: the cost, backlash or risk; who can hold or learn it; what happens at the holder's death or on transfer; what it combines or interacts with; what counters or limits it.
blocker: a game engine that models bodies, simple one-target or area effects, items and resources cannot yet run the power when it needs one of these; choose the single most important, or none: ${vocab(SLUGS)}. "reason" is one short sentence.`;

// ---- Steps ------------------------------------------------------------------------------------------------------------
const chunk = (lines, limit = 14000) => { const out = []; let cur = [], n = 0;
    for (const l of lines) { const s = l.text.length + l.loc.length + 6; if (n + s > limit && cur.length) { out.push(cur); cur = []; n = 0; } cur.push(l); n += s; }
    if (cur.length) out.push(cur); return out; };
const fmt = l => `[${l.loc}] ${l.text}`;
const lotmPathways = () => {
    const rows = readFileSync(`${root}docs/coverage/lotm_potions.jsonl`, 'utf8').trim().split('\n').map(l => JSON.parse(l)).filter(r => /^lotm\.potion\.[a-z_]+_\d$/.test(r.id) && !r.id.startsWith('lotm.potion.aid_'));
    const names = {}; for (const r of rows) { const [, , key] = r.id.split('.'); const p = key.replace(/_\d$/, ''), m = r.note.match(/^(.*?) Sequence \d/); if (m) names[p] = m[1]; }
    // A Sequence's own name (Seer, Pyromaniac...) names its pathway and number in the potion ledger's notes; the book's own labels for a step.
    const bySeqName = new Map();
    for (const r of rows) { const m = r.note.match(/^(.*?) Sequence (\d) ([^.]+)\./); if (m) bySeqName.set(slugify(m[3]), [r.id.split('.')[2].replace(/_\d$/, ''), m[2]]); }
    return {rows: new Set(rows.map(r => r.id)), names, bySeqName};
};
export const pathwayKey = (text, names) => { const t = slugify(text || ''); for (const [k, n] of Object.entries(names)) if (t.includes(slugify(n)) || t === k) return k; return null; };

export function redact(b, text) {
    if (b !== 'coi') return text;
    const {names} = lotmPathways();
    let out = text.replace(/\bSeq(?:uence)?\.?\s*(?:No\.?\s*)?\d\b/gi, '[rank]').replace(/\bSequence[- ](?:nine|eight|seven|six|five|four|three|two|one|zero)\b/gi, '[rank]');
    for (const n of Object.values(names)) out = out.replace(new RegExp(`\\b${n}(?:'s)?\\s+(?:Pathway|pathway)\\b|\\b(?:Pathway|pathway) of the ${n}\\b|\\bthe ${n} pathway\\b`, 'gi'), '[pathway]');
    return out;
}

async function refresh(b) {
    const lines = loadEvidence(b), packets = chunk(lines).map((c, i) => ({id: `${b}:n${String(i).padStart(3, '0')}`, lines: c}));
    jwrite(priv(b, 'evidence.json'), lines); jwrite(priv(b, 'names_packets.json'), packets);
    console.log(JSON.stringify({book: b, lines: lines.length, chars: lines.reduce((s, l) => s + l.text.length, 0), packets: packets.length}));
}

export const COMMON = RULES;
async function runPassFor(b, name, items, schema, argv, extra = {}) {
    const {runPass} = await import('./label_runner.mjs');
    return runPass({name: `${b}_${name}`, dir: PRIVATE, system: COMMON, schema, items, model: 'gpt-6-luna', effort: 'low', maxTokens: 16000, ...extra}, argv);
}
async function names(b, argv) {
    const packets = jread(priv(b, 'names_packets.json'));
    const items = packets.map(p => ({id: p.id, shared: `Evidence lines (${BOOKS[b].title}):\n${p.lines.map(fmt).join('\n')}`, user: NAME_ASK}));
    return runPassFor(b, 'names', items, NAME_SCHEMA, argv);
}

function merge(b) {
    const replies = jread(priv(b, 'names_luna.json')), lines = jread(priv(b, 'evidence.json')), byLoc = new Map(lines.map(l => [l.loc, l]));
    const lotm = b === 'coi' ? lotmPathways() : null, found = new Map();
    for (const [pid, r] of Object.entries(replies)) for (const p of r.reply?.powers ?? []) {
        const name = p.name.trim(); if (!name) continue;
        const keys = [name, ...p.aliases].map(slugify).filter(k => k.length > 1);
        let hit = keys.map(k => found.get(k)).find(Boolean);
        if (!hit) hit = {name, aliases: new Set(), kinds: [], groups: [], ranks: [], locs: new Set(), packets: new Set()};
        for (const k of keys) found.set(k, hit);
        for (const a of [name, ...p.aliases]) if (a.trim()) hit.aliases.add(a.trim());
        hit.kinds.push(p.kind); if (p.class_group) hit.groups.push(p.class_group); if (p.class_rank) hit.ranks.push(p.class_rank);
        for (const l of p.locators) if (byLoc.has(l)) hit.locs.add(l); hit.packets.add(pid);
    }
    const rows = {}, ids = new Set();
    for (const hit of new Set(found.values())) {
        let id = `${BOOKS[b].prefix}.power.${slugify(hit.name)}`, link = null, group = hit.groups[0] ?? '', rank = hit.ranks[0] ?? '';
        if (lotm) {
            const key = hit.groups.map(g => pathwayKey(g, lotm.names)).find(Boolean) ?? pathwayKey(hit.name, lotm.names);
            const byName = [hit.name, ...hit.aliases].map(a => slugify(a.replace(/\b(sequence|seq)\.?\s*\d\b/gi, '').replace(/\bpathway\b/gi, ''))).map(k => lotm.bySeqName.get(k)).find(Boolean);
            const seq0 = [...hit.ranks, ...hit.groups].map(x => x.match(/(?:sequence|seq\.?)\s*(\d)/i)?.[1] ?? x.match(/^\s*(\d)\s*$/)?.[1]).find(x => x != null);
            const seq = seq0 ?? (byName && (!key || key === byName[0]) ? byName[1] : null), pk = key ?? (seq0 == null ? byName?.[0] : null);
            if (pk && seq != null) { id = `coi.seq.${pk}_${seq}`; if (lotm.rows.has(`lotm.potion.${pk}_${seq}`)) link = `lotm.potion.${pk}_${seq}`; }
            else if (key) group = key;
        }
        if (ids.has(id)) { const prior = rows[id]; for (const a of hit.aliases) if (!prior.aliases.includes(a)) prior.aliases.push(a); for (const l of hit.locs) if (!prior.nameSource.includes(l)) prior.nameSource.push(l); continue; }
        ids.add(id);
        const mode = a => { const c = {}; for (const x of a) c[x] = (c[x] ?? 0) + 1; return Object.entries(c).sort((x, y) => y[1] - x[1])[0]?.[0] ?? ''; };
        rows[id] = {name: hit.name, aliases: [...hit.aliases].filter(a => a !== hit.name), nameKind: mode(hit.kinds), classGroup: group, classRank: rank, ...(link ? {link} : {}),
            nameSource: [...hit.locs].slice(0, 8), heldOut: heldOut(id)};
    }
    const meta = {schema: 'book-power-labels/1', date: DATE, status: 'proposals (AD32), agent-verified, not human-reviewed', book: BOOKS[b].title, split: SPLIT_RULE,
        denominator: {sources: BOOKS[b].sourceText, method: 'name pass over the reader claims and indexes (PWC3), alias-merged by normalised name', namePackets: Object.keys(replies).length},
        scoring: BOOKS[b].scored ? {class: 'pathway (the book\'s own classification, hidden from the sheet pass: Sequence numbers and pathway words redacted from the evidence)', map: PATHWAY_OF_OBJECT, foldRule: FOLD_RULE}
            : {class: null, reason: BOOKS[b].unscoredReason},
        slugs: SLUGS};
    jwrite(sidecarPath(b), {meta, rows});
    // Sheet packets: the evidence lines that name the row, redacted of the held-out class.
    const packets = Object.entries(rows).map(([id, r]) => {
        const terms = [r.name, ...r.aliases].map(t => t.toLowerCase()).filter(t => t.length >= 4);
        const direct = r.nameSource.map(l => byLoc.get(l)).filter(Boolean);
        const mentions = lines.filter(l => !r.nameSource.includes(l.loc) && terms.some(t => l.text.toLowerCase().includes(t)));
        const picked = [...direct, ...mentions].slice(0, 24); let total = 0, kept = [];
        for (const l of picked) { total += l.text.length; if (total > 9000 && kept.length) break; kept.push({loc: l.loc, text: redact(b, l.text)}); }
        const subjectName = b === 'coi' && r.classRank ? r.name : r.name;
        return {id, subject: subjectName, lines: kept};
    });
    jwrite(priv(b, 'sheet_packets.json'), packets);
    console.log(JSON.stringify({book: b, rows: Object.keys(rows).length, heldOut: Object.values(rows).filter(r => r.heldOut).length, linked: Object.values(rows).filter(r => r.link).length,
        noEvidence: packets.filter(p => !p.lines.length).length}));
}

async function sheets(b, argv) {
    const packets = jread(priv(b, 'sheet_packets.json'));
    const items = packets.filter(p => p.lines.length).map(p => ({id: p.id, shared: `Evidence lines (${BOOKS[b].title}):\n${p.lines.map(fmt).join('\n')}`, user: `${SHEET_ASK}\n\nSubject: ${p.subject}`}));
    return runPassFor(b, 'sheets', items, SHEET_SCHEMA, argv);
}

// Normalise one reply field: enum values must be in the list, the locator must be one of the packet's brackets, speaker an enum.
const norm = (f, list, locs) => ({value: list ? (list.includes(f?.value) ? f.value : '') : (f?.value ?? ''), locator: locs.has(f?.locator) ? f.locator : '', speaker: SPEAKERS.includes(f?.speaker) ? f.speaker : 'unknown'});
function fold(b) {
    const side = jread(sidecarPath(b)), replies = jread(priv(b, 'sheets_luna.json')), packets = Object.fromEntries(jread(priv(b, 'sheet_packets.json')).map(p => [p.id, p]));
    for (const [id, row] of Object.entries(side.rows)) {
        const rep = replies[id]?.reply, locs = new Set((packets[id]?.lines ?? []).map(l => l.loc));
        if (!rep) { row.labels = null; continue; }
        const labels = {};
        for (const [k, list] of Object.entries(ENUMS)) {
            const f = norm(rep[k], list, locs), fallback = k in GRAMMAR ? 'none-stated' : 'unknown';
            if (!list.includes(f.value)) f.value = fallback;
            labels[k] = f;
        }
        for (const k of STATED) { const f = norm(rep[k], null, locs); labels[k] = {stated: f.value.trim().length > 0, locator: f.locator, speaker: f.speaker}; }
        labels.blocker = BLOCKERS.includes(rep.blocker?.value) ? rep.blocker.value : 'effect-unknown';
        row.labels = labels;
    }
    side.meta.score = BOOKS[b].scored ? scoreCoi(side) : {scored: false, reason: BOOKS[b].unscoredReason};
    jwrite(sidecarPath(b), side);
    console.log(JSON.stringify({book: b, labelled: Object.values(side.rows).filter(r => r.labels).length, rows: Object.keys(side.rows).length, score: side.meta.score}));
}

export function scoreCoi(side) {
    const pool = Object.entries(side.rows).filter(([id, r]) => r.labels && r.labels.kind.value !== 'rule-not-power' && /^coi\.seq\./.test(id)
        && PATHWAY_OF_OBJECT[r.labels.object.value]);
    const pathwayOf = id => id.split('.')[2].replace(/_\d$/, '');
    const hit = ([id, r]) => PATHWAY_OF_OBJECT[r.labels.object.value].includes(pathwayOf(id));
    const stat = rows => {
        const hits = rows.filter(hit).length;
        // The best constant guess: one object, the same for every row; the baseline the grammar has to beat.
        const base = Math.max(0, ...Object.keys(PATHWAY_OF_OBJECT).map(o => rows.filter(([id]) => PATHWAY_OF_OBJECT[o].includes(pathwayOf(id))).length));
        return {n: rows.length, hits, baseline: base};
    };
    const held = stat(pool.filter(([, r]) => r.heldOut)), all = stat(pool);
    return {scored: true, class: 'pathway', heldOut: held, allSequenceRows: all, folded: held.hits >= 5 && held.hits > held.baseline};
}

export function stateOf(row) {
    const l = row.labels;
    if (row.link) return 'catalogued';
    if (!l) return 'blocked:effect-unknown';
    if (l.kind.value === 'rule-not-power') return 'not-a-thing:rule';
    if (l.blocker === 'none') return 'catalogued';
    return `blocked:${l.blocker}`;
}
export function buildLedger(side) {
    const folded = side.meta.score?.folded === true, src = side.meta.denominator.sources;
    return Object.entries(side.rows).map(([id, r]) => {
        const l = r.labels, g = l ? `${l.verb.value}.${l.object.value}/${l.target.value}/${l.time.value}` : null;
        const bits = [`${r.name}.`, `Name source ${r.nameSource.length ? r.nameSource.slice(0, 3).join(', ') : 'index only'}.`];
        if (r.link) bits.push(`Sequence row linked to ${r.link}; the potion sheet lives there, not here.`);
        if (r.classGroup || r.classRank) bits.push(`Book's own class (hidden from the grammar pass): ${[r.classGroup, r.classRank].filter(Boolean).join(' ')}.`);
        if (l) { bits.push(`Kind ${l.kind.value}; route ${l.route.value}; known to ${l.knowledge.value}; mind ${l.mind.value}.`);
            if (folded) bits.push(`Effect ${g} (checked against the pathway map).`); else bits.push(`Effect ${g} (model tier, unchecked).`);
            const stated = STATED.filter(k => l[k].stated); if (stated.length) bits.push(`Stated: ${stated.join(', ')}.`); }
        if (!l) bits.push('No evidence lines found for a sheet.');
        bits.push(`Full sheet in ${BOOKS[Object.keys(BOOKS).find(k => BOOKS[k].title === side.meta.book)].slug}_power_labels.json.`);
        return foldChapterEffect(`${side.meta.book ? BOOKS[Object.keys(BOOKS).find(k => BOOKS[k].title === side.meta.book)].slug : ''}_powers`, {id, source: `${src.split(':')[0]}; ${r.nameSource.slice(0, 3).join(', ') || 'index'}`, state: stateOf(r), mechanisms: ['W'], test: null, note: bits.join(' ')});
    });
}
async function build(b) {
    const rows = await attachFormRows(await attachItemBoundRows(buildLedger(jread(sidecarPath(b)))));
    writeFileSync(ledgerPath(b), rows.map(r => JSON.stringify(r)).join('\n') + '\n');
    const c = {}; for (const r of rows) c[r.state.split(':')[0] + (r.state.startsWith('blocked') ? '' : '')] = (c[r.state.split(':')[0]] ?? 0) + 1;
    console.log(JSON.stringify({book: b, rows: rows.length, states: c}));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [step, which, ...rest] = process.argv.slice(2), argv = rest;
    const targets = which === 'all' ? Object.keys(BOOKS) : [which];
    if (!['refresh', 'names', 'merge', 'sheets', 'fold', 'build'].includes(step) || targets.some(t => !BOOKS[t])) { console.error('usage: <refresh|names|merge|sheets|fold|build> <mol|coi|lm|fv|all> [--wait|--sync|--dry] [--max-usd N]'); process.exit(2); }
    for (const b of targets) await ({refresh, names, merge, sheets, fold, build}[step])(b, argv);
}
