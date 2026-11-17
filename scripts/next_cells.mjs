#!/usr/bin/env node
// Next cells from the worlds ledger (PWC24, PWC28; power-catalogues-2026-11-16): creatures and artifacts for the worlds whose
// blocked slugs other worlds share. One builder, one ledger per cell, one Luna batch per ledger (AU16), evidence as `shared`.
//   hp_creatures            Harry Potter Creature infobox pages (819); the Ministry X rating is the held-out label (PWC2)
//   lotm_powers             Lord of the Mysteries Beyonder abilities, authorities and forms per pathway Sequence; links lotm_potions
//   <book>_artifacts        mol coi fv lm smm: names from a model listing over the reader evidence; ss rt: census item records
//   shadow_slave_creatures  Nightmare Creature rank and class (census creature records); shadow_slave_echoes companions
// Steps (private packets and replies live in the primary checkout's gitignored private folder, prefix nc_):
//   packets <cell>   build the packet file (wiki cells: python3 -I scripts/next_cells_packets.py); book cells run names/merge first
//   names <cell>     nominate pass for model-listed cells (batch);  merge <cell> folds the replies into packets
//   freeze <cell>    write the denominator, split, class map and fold rule into the sidecar BEFORE any label call (GKM429)
//   pass <cell>      the label batch;  build <cell> normalises replies, scores, writes docs/coverage/<ledger>.jsonl and _labels.json
// Usage: node scripts/next_cells.mjs <step> <cell|all> [--dry|--wait|--sync] [--max-usd N]
import {readFileSync, writeFileSync, existsSync, readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {runPass} from './label_runner.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';
import {SPEAKER, BLOCKED as ART_BLOCKED, SHEET_FIELDS, KINDS as ART_KINDS, SYSTEM as ART_SYSTEM} from './artifact_ledgers.mjs';
import {BLOCKERS as POWER_BLOCKERS, PATHWAY_OF_OBJECT, KNOWLEDGE} from './book_power_ledgers.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const PRIMARY = '/Users/weiwei/code/yet-another-idle-rpg/';
const NOVELS = `${PRIMARY}docs/research/novels/`;
const FULL = `${NOVELS}full-book/`;
const PRIVATE = process.env.LABEL_PRIVATE ? `${process.env.LABEL_PRIVATE.replace(/\/$/, '')}/` : `${PRIMARY}docs/research/power-catalogues-2026-11-16/private/`;
const COVERAGE = `${root}docs/coverage/`;
export const DATE = '2026-11-17';
const jread = p => JSON.parse(readFileSync(p, 'utf8'));
const jwrite = (p, v, pretty = true) => writeFileSync(p, JSON.stringify(v, null, pretty ? 1 : 0) + (pretty ? '\n' : ''));
const sha1 = s => createHash('sha1').update(s).digest('hex');
export const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/^(the|a|an)\s+/, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const clip = (s, n) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? `${s.slice(0, n - 1).trim()}…` : s; };

// ---- Frozen split (GKM429) ----------------------------------------------------------------------------------------------
export const SPLIT_RULE = 'Rows are ordered by sha1 of "nextcells-v1:<id>"; those whose first hex byte is below 0x40 are the tuning sample, the only rows the prompt or normaliser may be adjusted on; every other row is held out and reported. Dial: seed and fraction; the fixed seed is the reported one.';
export const split = id => (parseInt(sha1(`nextcells-v1:${id}`).slice(0, 2), 16) < 0x40 ? 'tuned' : 'held-out');

// ---- The cells ----------------------------------------------------------------------------------------------------------
const ITEM_RE = /\b(artifact|artefact|item|relic|treasure|ring|amulet|talisman|sword|blade|armou?r|staff|wand|tome|scroll|gem|crystal|stone|key|mask|cloak|robe|mirror|lamp|pill|elixir|weapon|equipment|gear|device|machine|vessel|orb|pendant|necklace|bracelet|bead|seal|token|badge|medal|flask|cup|pouch|storage|blueprint|suit|helmet|shield|spear|bow|dagger|hammer|coin|card|lantern|compass|clock|crown|throne|banner|lens|chest|book|notebook|grimoire|codex|diary|journal|mantle|shroud|bell|horn|cube|disk|disc|rod|sceptre|scepter|mace|axe|gauntlet|glove|boots?|belt|jewel|ore|metal|alloy|core|shard|fragment|chalice|goblet|candle|censer|totem|idol|statue|doll|puppet|portal|gate|rune|glyph|scale)\b/i;
const SS_TIERS = ['dormant', 'awakened', 'ascended', 'transcendent', 'supreme', 'divine', 'sacred'];
const SS_CREATURE_TIERS = ['dormant', 'awakened', 'fallen', 'corrupted', 'transcendent', 'supreme', 'divine'];
const SS_CLASSES = ['beast', 'monster', 'demon', 'devil', 'tyrant', 'terror', 'titan', 'abomination', 'horror'];

const CELLS = {
    hp_creatures: {ledger: 'hp_creatures', kind: 'creature', owner: 'L', world: 'Harry Potter', title: 'Harry Potter', prefix: 'hp.creature.', wiki: true, classes: ['1', '2', '3', '4', '5'], baseline: null, ordinal: true,
        denominator: 'Harry Potter wiki: every namespace-0 page that carries a Creature infobox (819 pages, harrypotter_pages_current), union by title', what: 'Harry Potter creatures and named individual creatures',
        label: 'the Ministry of Magic classification X to XXXXX (the infobox class field, counted X; 125 of 819 pages state one; hidden). Beings, spirits and unrated pages have no X label and are not scored', scoreUnit: 'Ministry X rating'},
    lotm_powers: {ledger: 'lotm_powers', kind: 'power', owner: 'P', world: 'Lord of the Mysteries', title: 'Lord of the Mysteries', prefix: 'lotm.ability.', wiki: true, sections: true,
        denominator: 'Lord of the Mysteries wiki: the 32 "<Pathway> Pathway/Abilities" pages split at "Sequence N: Name" headings; one row per bolded entry under New Abilities, Authorities, and one Mythical Creature Form row per Sequence that has the heading (lotm-wiki-current-pages-2026-11-03)',
        what: 'Beyonder abilities, authorities and mythical forms per pathway and Sequence',
        label: 'the pathway (the book\'s own class); the grammar object is scored against the pre-registered PATHWAY_OF_OBJECT map with the pathway and Sequence names blanked from the evidence. Upper bound: the abilities\' own wording still carries the pathway\'s domain words'},
    mother_of_learning_artifacts: {ledger: 'mother_of_learning_artifacts', kind: 'artifact', owner: 'A', world: 'Mother of Learning', title: 'Mother of Learning', prefix: 'mol.item.', book: 'mol', dir: 'mother-of-learning',
        what: 'named artifacts and items', source: 'Mother of Learning full read: POWERS.md, WORLD.md, SYNTHESIS.md, engine_inputs and reader notes (local, gitignored)'},
    circle_of_inevitability_artifacts: {ledger: 'circle_of_inevitability_artifacts', kind: 'artifact', owner: 'A', world: 'Circle of Inevitability', title: 'Circle of Inevitability', prefix: 'coi.item.', book: 'coi', dir: 'circle-of-inevitability',
        what: 'named Sealed Artifacts and mystical items', source: 'Circle of Inevitability claims.json (item-word claims, all categories) and POWERS.md (local, gitignored)'},
    fated_villain_artifacts: {ledger: 'fated_villain_artifacts', kind: 'artifact', owner: 'A', world: 'I Am the Fated Villain', title: 'I Am the Fated Villain', prefix: 'fv.item.', book: 'fv', dir: 'fated-villain',
        what: 'named artifacts, treasures and items', source: 'Fated Villain CLAIM_LEDGER.json (MTL edition, pass 2 incomplete; item-word claims), POWERS.md, WORLD.md (local, gitignored)'},
    legendary_mechanic_artifacts: {ledger: 'legendary_mechanic_artifacts', kind: 'artifact', owner: 'A', world: 'The Legendary Mechanic', title: 'The Legendary Mechanic', prefix: 'lm.item.', book: 'lm', dir: 'legendary-mechanic',
        what: 'named equipment, blueprints, mechs and items', source: 'The Legendary Mechanic POWER_AND_PRODUCTION.md, engine_inputs and reader notes (local, gitignored)'},
    speedrunning_multiverse_artifacts: {ledger: 'speedrunning_multiverse_artifacts', kind: 'artifact', owner: 'A', world: 'Speedrunning the Multiverse', title: 'Speedrunning the Multiverse', prefix: 'smm.item.', book: 'smm', dir: 'speedrunning-multiverse',
        what: 'named artifacts, equipment and items', source: 'Speedrunning the Multiverse TECHNIQUES_ITEMS.md, per-book NOTES.md and the findings files (local, gitignored)'},
    shadow_slave_artifacts: {ledger: 'shadow_slave_artifacts', kind: 'artifact', owner: 'A', world: 'Shadow Slave', title: 'Shadow Slave', prefix: 'ss.item.', census: 'ss', censusKind: 'item',
        classes: SS_TIERS, baseline: null, what: 'Memories and other named items', run: 'ss paid claims 2026-11-01-ss (chapters 1-3000; census item records)',
        denominator: 'Shadow Slave paid-claim census: every item record id mentioned in at least 3 census windows (ss.item.*), merged by id; the Memory and Enchantment tier word (Dormant, Awakened, Ascended, Transcendent, Supreme, Divine, Sacred) is the held-out label where a record states it',
        label: 'the Memory or item tier word stated in the record (hidden)'},
    regressors_tale_artifacts: {ledger: 'regressors_tale_artifacts', kind: 'artifact', owner: 'A', world: "A Regressor's Tale of Cultivation", title: "A Regressor's Tale of Cultivation", prefix: 'rt.item.', census: 'rt', censusKind: 'item',
        classes: [], baseline: null, what: 'named items, treasures and tools', run: 'rtoc paid claims 2026-11-01-rtoc (chapters 0-639; census item records)',
        denominator: 'A Regressor\'s Tale paid-claim census: every item record id mentioned in at least 3 census windows (rt.item.*), merged by id', label: 'none: the census states no item rank for this book (unscored)'},
    shadow_slave_creatures: {ledger: 'shadow_slave_creatures', kind: 'creature', owner: 'L', world: 'Shadow Slave', title: 'Shadow Slave', prefix: 'ss.creature.', census: 'ss', censusKind: 'creature',
        classes: SS_CREATURE_TIERS, baseline: null, ordinal: true, what: 'Nightmare Creatures, spawn kinds and other named creatures', run: 'ss paid claims 2026-11-01-ss (chapters 1-3000; census creature records)',
        denominator: 'Shadow Slave paid-claim census: every creature record id mentioned in at least 3 census windows (ss.creature.*), merged by id; echoes and shadows have their own ledger or are kept as creatures where the census files them so',
        label: 'the Nightmare Creature rank word (Dormant, Awakened, Corrupted, Fallen...) stated in the record, hidden; the class word (Beast, Monster, Demon, Devil, Tyrant, Terror, Titan) is kept as a stated field'},
    shadow_slave_echoes: {ledger: 'shadow_slave_echoes', kind: 'creature', owner: 'L', world: 'Shadow Slave', title: 'Shadow Slave', prefix: 'ss.echo.', census: 'ss', censusKind: 'echo',
        classes: [], baseline: null, what: 'Echoes as companions: named Echoes and Echo kinds', run: 'ss paid claims 2026-11-01-ss (chapters 1-3000; census records whose id names an Echo)',
        denominator: 'Shadow Slave paid-claim census: every creature, item and person record whose id contains "echo", merged by id', label: 'none: no per-Echo classification is stated (unscored)'},
};
export const CELL_NAMES = Object.keys(CELLS);
export const cellOf = name => CELLS[name];

// ---- Schemas ------------------------------------------------------------------------------------------------------------
const f = {type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'], properties: {value: {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKER}}};
const strictObject = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
const effectSchema = () => strictObject({verb: {type: 'string', enum: [...EFFECT_VERBS, 'none']}, object: {type: 'string', enum: [...Object.keys(EFFECT_OBJECTS), 'none']},
    target: {type: 'string', enum: [...EFFECT_TARGETS, 'none']}, time: {type: 'string', enum: [...EFFECT_TIMES, 'none']}, summary: {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKER}});
export const CREATURE_KINDS = ['animal', 'magical-beast', 'being', 'spirit-or-ghost', 'individual', 'swarm-or-kind', 'plant-or-fungus', 'not-a-thing'];
export const CREATURE_BLOCKED = ['effect-unknown', 'mind-binding', 'area-field', 'form-transformation', 'power-interaction', 'material-row', 'familiar-summon', 'sentient-agent', 'lifecycle-breeding', 'venom-or-disease', 'none'];
export const CREATURE_FIELDS = ['body', 'diet', 'habitat', 'threat', 'parts_uses', 'route_to_player'];
const classesOf = c => (c.classes?.length ? [...c.classes, 'unstated'] : ['unscored']);

export const creatureSchema = c => strictObject({kind: {type: 'string', enum: CREATURE_KINDS}, kind_note: {type: 'string'}, effect: effectSchema(),
    ...Object.fromEntries(CREATURE_FIELDS.map(k => [k, f])), class_guess: {type: 'string', enum: classesOf(c)},
    blocked: {type: 'string', enum: CREATURE_BLOCKED}, blocked_reason: {type: 'string'}});
export const artifactSchema = c => strictObject({kind: {type: 'string', enum: ART_KINDS}, kind_note: {type: 'string'}, effect: effectSchema(),
    ...Object.fromEntries(SHEET_FIELDS.map(k => [k, f])), class_guess: {type: 'string', enum: classesOf(c)}, blocked: {type: 'string', enum: ART_BLOCKED}, blocked_reason: {type: 'string'}});
export const POWER_FIELDS = ['cost', 'who_may', 'where_from', 'go_wrong', 'mind', 'left_behind', 'combines', 'counters', 'knowledge'];
export const powerSchema = () => strictObject({sheets: {type: 'array', items: strictObject({n: {type: 'integer'}, kind: {type: 'string', enum: ['ability', 'authority', 'creature-form', 'not-a-thing']},
    effect: effectSchema(), ...Object.fromEntries(POWER_FIELDS.map(k => [k, f])), blocked: {type: 'string', enum: POWER_BLOCKERS}, blocked_reason: {type: 'string'}})}});
const NAME_SCHEMA = strictObject({items: {type: 'array', items: strictObject({name: {type: 'string'}, aliases: {type: 'array', items: {type: 'string'}}, kind: {type: 'string', enum: ['artifact', 'consumable', 'material', 'equipment', 'blueprint', 'place-resource', 'other']},
    stated_rank: {type: 'string'}, locators: {type: 'array', items: {type: 'string'}}})}});

const RULES_HEAD = `Use only the evidence lines given. Each line starts with its locator in square brackets; copy that bracket's content exactly into "locator". Write values as short paraphrases in your own words, never quotations. If the evidence does not state something, set value and locator to "" and speaker to "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: narrator, a character's claim (which may be wrong), a demonstration (shown happening), or the wiki.`;
export const CREATURE_SYSTEM = `${RULES_HEAD}
Fill one creature sheet for the named creature of a fictional world. "kind": an animal (a plain animal), a magical-beast, a being (a thinking creature that is not a person), spirit-or-ghost, an individual (one named animal or monster), swarm-or-kind (a type used for a mass), plant-or-fungus, or not-a-thing (a list or concept page). "effect" is its main effect on others as one grammar sentence (verb, object, target, time from the lists; "none" if it has none). body: what it is physically (size, build, senses, how it moves). diet: what it eats and how it feeds. habitat: where it lives and its range. threat: how dangerous it is to people and what it does when it attacks or is cornered. parts_uses: what its body parts, products or by-products are used for. route_to_player: how a newcomer could plausibly meet, tame, hunt or buy one, with the cost. "blocked" names the capability a game engine would need to run it beyond a body, a diet and a simple effect, from the list ("none" if the effect fits the grammar and nothing else is needed, "effect-unknown" when the evidence does not say what it does): mind-binding (it controls or bonds minds), area-field (an effect over an area), form-transformation (it changes forms), power-interaction (a power that answers other powers), material-row (its parts are sold or brewed as materials with stated properties), familiar-summon (a bound or summoned servant), sentient-agent (it speaks, bargains or holds a culture), lifecycle-breeding (a hatching, growth or breeding cycle that matters), venom-or-disease (poison or a lasting infection).`;
export const POWER_SYSTEM = `${RULES_HEAD}
The evidence is one Sequence section of a Beyonder pathway. For each numbered row named in the message, fill one power sheet. "kind": ability, authority, creature-form, or not-a-thing. "effect" is the row's main effect as one grammar sentence (verb, object, target, time from the lists; "none" when no effect is stated), "summary" a short paraphrase. cost: what using it costs (spirituality, a ritual, a condition). who_may: who can use it (which Sequence, what condition). where_from: how it is gained. go_wrong: backlash or the risk. mind: its effect on the user's mind. left_behind: what remains or happens on death or advancement. combines: how it interacts with other abilities. counters: what stops or answers it. knowledge: who in the world knows it. "blocked" names the capability a game engine would need to run it, from the list, "none" if the effect fits the grammar and nothing else is needed, "effect-unknown" when the evidence does not say what it does.`;
const ARTIFACT_ASK = title => `The object is from ${title}. "class_guess" is the object's own tier or rank word as the book states it, guessed from how powerful it is; the tier word has been removed from the evidence; use "unstated" when you cannot tell, "unscored" is the only choice when the list has just that. Negative effects, curses and containment rules go in go_wrong; the handling rule goes in counters or who_may.`;
const CREATURE_ASK = c => `The subject is ${c.title === 'Harry Potter' ? 'a Harry Potter creature (a Ministry of Magic X rating exists for many; it has been removed from the evidence). "class_guess" is your guess of the rating 1 to 5 (1 harmless, 2 tameable, 3 competent wizard can cope, 4 dangerous, 5 known wizard-killer or impossible to train), or "unstated" for a being or spirit that carries none' : `a ${c.title} creature or companion. "class_guess" is its rank word if the book states one, guessed from how powerful it is (the word has been removed from the evidence), "unstated" if you cannot tell, "unscored" when the list has just that`}. Name the use of its parts and the route a player would have to it.`;
const POWER_ASK = `Fill one sheet for each numbered row below. Return the sheets in an array, n copying the row's number.`;
const NAME_ASK = title => `List every NAMED artifact, item or piece of equipment of ${title} that the evidence lines name: a named magical object, tool, weapon, armour, tome, device, vehicle, storage or consumable, a named material or reagent with its own name. One entry per distinct thing, using the name the evidence uses most; other names for it in "aliases". Do not list people, places, organisations, abilities or general categories without a name. kind: the nearest of the list. stated_rank: the book's own grade, rank, tier or class of the object in plain words as written (empty when none is stated). locators: the locators of the lines that name or describe it (at most 8).`;
const NAME_SYSTEM = `You list the named things in source evidence from a novel for a game's artifact ledger. Use only the evidence lines given. Each line starts with its locator in square brackets; copy a bracket's content exactly into "locators". Never quote prose; names only.`;

// ---- Evidence for the model-listed books --------------------------------------------------------------------------------
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
const mdLines = (file, tag, min = 40, filter = null) => (existsSync(file) ? readFileSync(file, 'utf8').split('\n') : []).map((text, i) => ({loc: `${tag}:L${i + 1}`, text: text.trim()}))
    .filter(l => l.text.length >= min && !/^[#|\s-]*$/.test(l.text) && !/^\|[-\s|]+\|$/.test(l.text) && (!filter || filter.test(l.text)));
const walk = dir => existsSync(dir) ? readdirSync(dir, {withFileTypes: true}).flatMap(e => (e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`])) : [];
const span = p => (p.paragraph_start === p.paragraph_end ? `p${p.paragraph_start}` : `p${p.paragraph_start}-${p.paragraph_end}`);

export function loadEvidence(book) {
    const dir = `${FULL}${CELL_BY_BOOK[book].dir}/`, lines = [];
    const notes = (sub, re) => walk(`${dir}${sub}`).filter(p => re.test(p)).flatMap(p => mdLines(p, p.slice(dir.length).replace(/\/NOTES\.md$/, '').replace(/\.md$/, ''), 90, ITEM_RE));
    if (book === 'mol') {
        for (const f of ['POWERS.md', 'WORLD.md', 'SYNTHESIS.md']) lines.push(...mdLines(`${dir}${f}`, f, 50, ITEM_RE));
        for (const r of csv(readFileSync(`${dir}engine_inputs/powers_costs_limits.csv`, 'utf8'))) lines.push({loc: `${r.claim_id} ${r.locator}`, text: `${r.subject}: ${r.value}. ${r.condition}. ${r.caveat}`});
        lines.push(...notes('readers', /NOTES\.md$/));
    } else if (book === 'coi') {
        for (const c of jread(`${dir}claims.json`).claims) {
            const text = `${c.statement} ${c['prerequisites/state_change'] ?? ''}`;
            if (!ITEM_RE.test(text)) continue;
            const l = c.locators?.[0];
            lines.push({loc: `${c.id} s${l?.spine_index ?? '?'}:${l ? span(l) : 'p?'}`, text: `${text} [${c.epistemic_status}]`});
        }
        lines.push(...mdLines(`${dir}POWERS.md`, 'POWERS.md', 50, ITEM_RE));
    } else if (book === 'fv') {
        for (const c of jread(`${dir}CLAIM_LEDGER.json`).claims) {
            if (!ITEM_RE.test(c.value)) continue;
            const l = c.locator?.[0], p = l?.paragraphs?.[0];
            lines.push({loc: `${c.id} s${l?.section ?? '?'}${p ? `:p${p[0]}-${p[1]}` : ''}`, text: c.value.replace(/^\[[^\]]*\]\s*[—.-]*\s*/, '').slice(0, 1400)});
        }
        for (const f of ['POWERS.md', 'WORLD.md']) lines.push(...mdLines(`${dir}${f}`, f, 50, ITEM_RE));
    } else if (book === 'lm') {
        lines.push(...mdLines(`${dir}POWER_AND_PRODUCTION.md`, 'PP', 50));
        for (const f of ['abilities_costs_limits', 'core_mechanic', 'economy_resources', 'progression_ranks_stats']) for (const r of csv(readFileSync(`${dir}engine_inputs/${f}.csv`, 'utf8'))) lines.push({loc: `${r.id} ${r.locator}`, text: `${r.subject}: ${r.value} ${r.unit ?? ''}. ${r.condition}. ${r.caveat}`});
        lines.push(...notes('readers', /NOTES\.md$/));
    } else if (book === 'smm') {
        lines.push(...mdLines(`${NOVELS}speedrunning-multiverse/readers-2026-10-10/TECHNIQUES_ITEMS.md`, 'TECHNIQUES_ITEMS.md', 40));
        for (const f of ['DETAILED_FINDINGS.md', 'PROPOSALS.md', 'SMALL_TOUCHES.md', 'REPORT.md']) lines.push(...mdLines(`${dir}${f}`, f, 50, ITEM_RE));
        lines.push(...notes('', /book-\d\/NOTES\.md$/));
    }
    const seen = new Set(); return lines.filter(l => !/[\]]/.test(l.loc) && !seen.has(l.loc) && seen.add(l.loc));
}
const CELL_BY_BOOK = Object.fromEntries(Object.values(CELLS).filter(c => c.book).map(c => [c.book, c]));
const cellOfBook = book => Object.keys(CELLS).find(k => CELLS[k].book === book);
const fmt = l => `[${l.loc}] ${l.text}`;
const chunk = (lines, limit = 14000) => { const out = []; let cur = [], n = 0; for (const l of lines) { const s = l.text.length + l.loc.length + 6; if (n + s > limit && cur.length) { out.push(cur); cur = []; n = 0; } cur.push(l); n += s; } if (cur.length) out.push(cur); return out; };

// ---- Census cells (Shadow Slave, A Regressor's Tale) ----------------------------------------------------------------------
const CENSUS = {
    ss: {dir: `${NOVELS}shadow-slave/private/lead-run-2026-10-28/`, census: /^ss\d*c\d+[a-z0-9]*_census\.jsonl$/, rules: /^ss\d*c\d+_rules\.jsonl$/, idp: 'ss', claims: '2026-11-01-ss'},
    rt: {dir: `${NOVELS}regressors-tale/private/lead-run-2026-10-29/`, census: /^rtocc\d+L?[a-z]*_census\.jsonl$/, rules: /^rtocc\d+L?_rules\.jsonl$/, idp: 'rtoc', claims: '2026-11-01-rtoc'},
};
const jsonl = path => readFileSync(path, 'utf8').split('\n').filter(Boolean).flatMap(l => { try { return [JSON.parse(l)]; } catch { return []; } });
const NOISE = /found by script, not by the reader|^$/i;
function recText(r) {
    const bits = [];
    for (const k of ['steps', 'results', 'costs', 'products', 'conditions', 'limits', 'consequences']) for (const s of r[k] ?? []) bits.push(typeof s === 'string' ? s : s.what ?? s.item ?? '');
    return clip(`${r.name ?? ''}: ${bits.filter(Boolean).join('; ')}`, 500);
}
export function loadCensus(cell) {
    const c = CELLS[cell], cfg = CENSUS[c.census], by = new Map();
    for (const f of readdirSync(cfg.dir).filter(f => cfg.census.test(f)).sort()) for (const r of jsonl(`${cfg.dir}${f}`)) {
        if (!r.id || !r.kind) continue;
        const echo = c.censusKind === 'echo' && /echo/.test(r.id) && ['creature', 'item', 'person'].includes(r.kind);
        if (!(echo || (r.kind === c.censusKind && r.id.startsWith(`${cfg.idp}.${c.censusKind}.`)))) continue;
        const g = by.get(r.id) ?? {id: r.id, label: r.label, aliases: new Set(), notes: new Map(), windows: 0, kinds: new Set(), first: r.firstMention};
        g.windows++; g.kinds.add(r.kind);
        for (const a of r.aliases ?? []) g.aliases.add(a);
        if (r.note && !NOISE.test(r.note) && g.notes.size < 8) g.notes.set(r.note, r.firstMention ?? `${c.census} census ${r.id}`);
        by.set(r.id, g);
    }
    const groups = [...by.values()].filter(g => g.windows >= (c.censusKind === 'echo' ? 1 : 3));
    // Rules records (named abilities, customs, crafts) that mention the label add evidence lines.
    const rulesRecs = [];
    for (const f of readdirSync(cfg.dir).filter(f => cfg.rules.test(f)).sort()) for (const r of jsonl(`${cfg.dir}${f}`)) if (r.name) rulesRecs.push(r);
    return groups.sort((a, b) => a.id.localeCompare(b.id)).map(g => {
        const names = [g.label, ...g.aliases].filter(n => n && n.length > 3).map(n => n.toLowerCase());
        const hits = names.length ? rulesRecs.filter(r => names.some(n => `${r.name} ${recText(r)}`.toLowerCase().includes(n))).slice(0, 5) : [];
        const evidence = [...[...g.notes].map(([note, loc]) => `[${String(loc).replace(/\]/g, '')}] ${clip(note, 400)}`),
            ...hits.map(r => `[${String(r.locator ?? `${c.census} rules`).replace(/\]/g, '')}] ${recText(r)}`)];
        return {id: `${c.prefix}${g.id.replace(/^[a-z]+\.[a-z]+\./, '')}`, name: g.label ?? g.id, aliases: [...g.aliases], windows: g.windows, locator: `${cfg.dir.split('/').slice(-3)[0]} census, ${g.windows} windows; ${c.run}`, evidence: evidence.length ? evidence : [`[${g.first ?? 'census'}] ${g.label}`]};
    });
}
export function censusLabel(cell, p) {
    const c = CELLS[cell], text = `${p.name} ${p.aliases.join(' ')} ${p.evidence.join(' ')}`.toLowerCase();
    if (!c.classes?.length) return {label: null};
    const named = `${p.name} ${p.aliases.join(' ')} ${p.id.split('.').pop().replace(/-/g, ' ')}`.toLowerCase();
    const rank = c.classes.filter(w => new RegExp(`\\b${w}\\b`).test(named));
    const klass = c.census === 'ss' && c.censusKind === 'creature' ? SS_CLASSES.filter(w => new RegExp(`\\b${w}\\b`).test(text)) : [];
    return {label: rank.length === 1 ? rank[0] : null, rankSeen: rank, klass: klass[0] ?? null};
}
const hide = (words, text) => words.length ? text.replace(new RegExp(`\\b(?:${words.join('|')})\\b`, 'gi'), '[rank]') : text;

// ---- Packets ------------------------------------------------------------------------------------------------------------
const pfile = (cell, kind) => `${PRIVATE}nc_${cell}_${kind}.json`;
export const packetsOf = cell => jread(pfile(cell, 'packets'));
export function packetsFor(cell) {
    const c = CELLS[cell];
    if (c.census) {
        const out = loadCensus(cell).map(p => ({...p, ...censusLabel(cell, p)}));
        for (const p of out) if (c.classes?.length) { p.evidence = p.evidence.map(e => hide(c.classes, e)); p.shown = hide(c.classes, p.name); }
        jwrite(pfile(cell, 'packets'), out, false);
        return {packets: out.length, labels: out.reduce((m, p) => ((m[p.label ?? 'none'] = (m[p.label ?? 'none'] ?? 0) + 1), m), {})};
    }
    if (c.book) {
        const lines = loadEvidence(c.book), packets = chunk(lines).map((l, i) => ({id: `${c.book}:n${String(i).padStart(3, '0')}`, lines: l}));
        jwrite(pfile(cell, 'evidence'), lines, false); jwrite(pfile(cell, 'names_packets'), packets, false);
        return {lines: lines.length, chars: lines.reduce((s, l) => s + l.text.length, 0), packets: packets.length};
    }
    throw Error(`${cell}: build its packets with python3 -I scripts/next_cells_packets.py ${cell}`);
}
const norm = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/^(the|a|an)\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim();
export function mergeNames(cell) {
    const c = CELLS[cell], replies = jread(pfile(cell, 'names_luna')), lines = jread(pfile(cell, 'evidence')), byLoc = new Map(lines.map(l => [l.loc, l])), found = new Map();
    for (const r of Object.values(replies)) for (const it of r.reply?.items ?? []) {
        const key = norm(it.name); if (!key || key.length < 3) continue;
        const g = found.get(key) ?? {name: it.name, aliases: new Set(), kinds: new Map(), ranks: new Map(), locs: new Set(), mentions: 0};
        g.mentions++; for (const a of it.aliases ?? []) if (norm(a) !== key) g.aliases.add(a);
        g.kinds.set(it.kind, (g.kinds.get(it.kind) ?? 0) + 1); if (it.stated_rank?.trim()) g.ranks.set(norm(it.stated_rank), (g.ranks.get(norm(it.stated_rank)) ?? 0) + 1);
        for (const l of it.locators ?? []) if (byLoc.has(l)) g.locs.add(l);
        found.set(key, g);
    }
    const out = [], used = new Set();
    for (const g of [...found.values()].sort((a, b) => a.name.localeCompare(b.name))) {
        const id = `${c.prefix}${slug(g.name)}`; if (used.has(id) || !slug(g.name)) continue; used.add(id);
        const names = [g.name, ...g.aliases].filter(n => n.length > 3).map(n => n.toLowerCase());
        const scan = names.length ? lines.filter(l => names.some(n => l.text.toLowerCase().includes(n))) : [];
        const locs = [...new Set([...g.locs, ...scan.slice(0, 10).map(l => l.loc)])].slice(0, 12);
        const rank = [...g.ranks].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        out.push({id, name: g.name, aliases: [...g.aliases], rank, mentions: g.mentions, locator: c.source, evidence: locs.map(l => `[${l}] ${clip(byLoc.get(l).text, 700)}`)});
    }
    // Class map frozen from the stated ranks: a word stated for at least 3 objects is a class; the rest are unlabelled.
    const counts = new Map(); for (const p of out) if (p.rank) counts.set(p.rank, (counts.get(p.rank) ?? 0) + 1);
    const classes = [...counts].filter(([, n]) => n >= 3).map(([w]) => w).sort();
    for (const p of out) { p.label = p.rank && classes.includes(p.rank) ? p.rank : null; if (p.label) p.evidence = p.evidence.map(e => hide([p.label, ...classes], e)); }
    CELLS[cell].classes = classes; CELLS[cell].baseline = null;
    jwrite(pfile(cell, 'packets'), out, false); jwrite(pfile(cell, 'classes'), classes, false);
    return {rows: out.length, classes, labelled: out.filter(p => p.label).length, namesSeen: found.size};
}
const classesFor = cell => { const c = CELLS[cell]; if (c.book && existsSync(pfile(cell, 'classes'))) c.classes = jread(pfile(cell, 'classes')); return c; };

// ---- Freeze (GKM429): denominator, split and class map in the sidecar before any label call -----------------------------------
export const sidecarPath = cell => `${COVERAGE}${CELLS[cell].ledger}_labels.json`;
export function freeze(cell) {
    const c = classesFor(cell), packets = packetsOf(cell), rows = c.sections ? packets.flatMap(p => p.rows.map(r => ({id: r.id, section: p.id}))) : packets.map(p => ({id: p.id}));
    const labelled = c.sections ? rows.length : packets.filter(p => p.label != null && (c.classes ?? []).includes(String(p.label))).length;
    const meta = {ledger: c.ledger, world: c.world, what: c.what, denominator: c.denominator ?? c.source, count: rows.length, split_rule: SPLIT_RULE,
        split: {tuned: rows.filter(r => split(r.id) === 'tuned').length, held_out: rows.filter(r => split(r.id) === 'held-out').length},
        class_map: c.sections ? {kind: 'pathway', scored_against: 'PATHWAY_OF_OBJECT (scripts/book_power_ledgers.mjs), written before any reply'} : {classes: c.classes ?? [], baseline: 'majority class among labelled held-out rows (computed at build)', labelled},
        label: c.label ?? 'none stated for the whole cell (unscored)', ids: rows.map(r => r.id), frozen: DATE,
        fold_rule: 'A guessed class becomes a sheet field only where held-out hits beat the majority baseline over the labelled held-out rows (PWC2); otherwise the sheet drops it and the note says model tier, unchecked.'};
    jwrite(sidecarPath(cell), {meta});
    return {ledger: c.ledger, count: meta.count, split: meta.split, labelled};
}

// ---- Label passes -------------------------------------------------------------------------------------------------------------
const joinEv = p => `Evidence lines (${p.name ?? p.id}):\n${p.evidence.join('\n')}`;
function itemsFor(cell) {
    const c = classesFor(cell), packets = packetsOf(cell);
    if (c.sections) return packets.map(p => ({id: p.id, shared: `Evidence: a section of a Beyonder pathway's ability page, the pathway and Sequence names blanked.\n${p.evidence.join('\n')}`,
        user: `${POWER_ASK}\n${p.rows.map((r, n) => `Row ${n}: ${r.shown} (${r.kind})`).join('\n')}`}));
    const ask = c.kind === 'creature' ? CREATURE_ASK(c) : ARTIFACT_ASK(c.title);
    return packets.map(p => ({id: p.id, shared: joinEv({...p, name: p.shown ?? p.name}), user: `${c.kind === 'creature' ? 'Creature' : 'Object'}: ${p.shown ?? p.name}\n${ask}`}));
}
export async function pass(cell, argv) {
    const c = classesFor(cell);
    const system = c.sections ? POWER_SYSTEM : c.kind === 'creature' ? CREATURE_SYSTEM : ART_SYSTEM;
    const schema = c.sections ? powerSchema() : c.kind === 'creature' ? creatureSchema(c) : artifactSchema(c);
    return runPass({name: `nc_${cell}`, dir: PRIVATE, system, schema, items: itemsFor(cell), model: 'gpt-6-luna', effort: 'low', maxTokens: c.sections ? 9000 : 3500, maxUsd: 3}, argv);
}
export async function names(cell, argv) {
    const c = CELLS[cell], packets = jread(pfile(cell, 'names_packets'));
    return runPass({name: `nc_${cell}_names`, dir: PRIVATE, system: NAME_SYSTEM, schema: NAME_SCHEMA, maxUsd: 1.5, model: 'gpt-6-luna', effort: 'low', maxTokens: 6000,
        items: packets.map(p => ({id: p.id, shared: `Evidence lines (${c.title}):\n${p.lines.map(fmt).join('\n')}`, user: NAME_ASK(c.title)}))}, argv);
}

// ---- Normalise ------------------------------------------------------------------------------------------------------------------
const tagsOf = ev => new Set([...ev.join('\n').matchAll(/(?:^|\n)\[([^\]\n]+)\]/g)].map(m => m[1]));
function fixField(fld, tags, page) { const locator = String(fld?.locator ?? '').replace(/^\[|\]$/g, ''); return {...fld, locator: tags.has(locator) ? locator : (fld?.value ?? fld?.summary) ? page : ''}; }
const GRAMMAR_NONE = 'none';
const effectText = e => (e.verb === GRAMMAR_NONE ? 'effect not stated' : `${e.verb}.${e.object}/${e.target}/${e.time}`);
function stateOf(kind, blocked, notAThing) {
    if (kind === 'not-a-thing') return `not-a-thing:${notAThing}`;
    return blocked === 'none' ? 'catalogued' : `blocked:${blocked}`;
}
const shortWhy = why => (/list|index|listing|collection|several/.test(why) ? 'list-page' : /character|person|people/.test(why) ? 'person' : /process|activity|event|method/.test(why) ? 'activity' : 'concept');

export function rowFor(cell, packet, reply0) {
    const c = classesFor(cell), tags = tagsOf(packet.evidence), page = packet.evidence[0]?.match(/^\[([^\]]+)\]/)?.[1] ?? packet.name;
    const reply = {...reply0, effect: fixField(reply0.effect, tags, page), ...Object.fromEntries((c.kind === 'creature' ? CREATURE_FIELDS : SHEET_FIELDS).map(k => [k, fixField(reply0[k], tags, page)]))};
    const sheet = {kind: reply.kind, effect: reply.effect, ...Object.fromEntries((c.kind === 'creature' ? CREATURE_FIELDS : SHEET_FIELDS).map(k => [k, reply[k]])), class_guess: reply.class_guess};
    const state = stateOf(reply.kind, reply.blocked, shortWhy(String(reply.kind_note).toLowerCase()));
    const tier = c.wiki ? 'wiki tier' : 'reader-claim tier';
    const note = `${packet.name}. ${reply.kind}. Effect ${effectText(reply.effect)} (${tier}, Luna, unchecked): ${clip(reply.effect.summary, 110)}.`
        + (state.startsWith('blocked:') ? ` Blocked: ${clip(reply.blocked_reason || reply.blocked, 130)}.` : '') + ` Full sheet in ${c.ledger}_labels.json.`;
    return {row: {id: packet.id, source: `${packet.locator}; ${c.wiki ? 'wiki:' : ''}${packet.name}`, state, mechanisms: [c.owner], test: null, note}, sheet, label: packet.label ?? null, packet};
}
export function powerRows(cell, packet, reply0) {
    const c = CELLS[cell], tags = tagsOf(packet.evidence), page = packet.evidence[0]?.match(/^\[([^\]]+)\]/)?.[1] ?? packet.id;
    const out = [];
    packet.rows.forEach((r, n) => {
        const s = (reply0.sheets ?? []).find(x => x.n === n);
        if (!s) throw Error(`${packet.id}: no sheet for row ${n}`);
        const reply = {...s, effect: fixField(s.effect, tags, page), ...Object.fromEntries(POWER_FIELDS.map(k => [k, fixField(s[k], tags, page)]))};
        const sheet = {kind: reply.kind, effect: reply.effect, ...Object.fromEntries(POWER_FIELDS.map(k => [k, reply[k]]))};
        const state = stateOf(reply.kind, reply.blocked, 'concept');
        const link = packet.potion ? ` Potion: ${packet.potion}.` : '';
        const note = `${r.name} (${packet.pathway_name} Sequence ${packet.seq}, ${r.kind}). Effect ${effectText(reply.effect)} (wiki tier, Luna, unchecked): ${clip(reply.effect.summary, 110)}.${link}`
            + (state.startsWith('blocked:') ? ` Blocked: ${clip(reply.blocked_reason || reply.blocked, 130)}.` : '') + ` Full sheet in ${c.ledger}_labels.json.`;
        out.push({row: {id: r.id, source: `${packet.locator}; ${packet.pathway_name} Pathway/Abilities Sequence ${packet.seq}${packet.potion ? `; ${packet.potion}` : ''}`, state, mechanisms: [c.owner], test: null, note},
            sheet, packet: {id: r.id, name: r.name, pathway: packet.pathway, seq: packet.seq, kind: r.kind, potion: packet.potion, locator: packet.locator}});
    });
    return out;
}

// ---- Scores -------------------------------------------------------------------------------------------------------------------
export function scoreClass(c, entries) {
    const rows = entries.filter(e => e.label != null && (c.classes ?? []).includes(String(e.label)));
    const rank = w => (c.ordinal ? (c.classes ?? []).indexOf(w) : null);
    const by = part => {
        const r = rows.filter(e => split(e.row.id) === part), counts = {};
        for (const e of r) counts[e.label] = (counts[e.label] ?? 0) + 1;
        const major = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        const exact = r.filter(e => e.sheet.class_guess === String(e.label)).length;
        const base = major ? r.filter(e => String(e.label) === major).length : 0;
        const within1 = c.ordinal ? r.filter(e => e.sheet.class_guess !== 'unstated' && e.sheet.class_guess !== 'unscored' && Math.abs(rank(e.sheet.class_guess) - rank(String(e.label))) <= 1).length : null;
        return {n: r.length, exact, baseline_class: major, baseline: base, within1};
    };
    return {label: c.label, labelled: rows.length, tuned: by('tuned'), held_out: by('held-out')};
}
export function scorePowers(entries) {
    const std = new Set(Object.keys(PATHWAY_OF_OBJECT).length ? ['abyss', 'black_emperor', 'chained', 'darkness', 'death', 'demoness', 'door', 'error', 'fool', 'hanged_man', 'hermit', 'justiciar', 'moon', 'mother', 'paragon', 'red_priest', 'sun', 'twilight_giant', 'tyrant', 'visionary', 'wheel_of_fortune', 'white_tower'] : []);
    const rows = entries.filter(e => std.has(e.packet.pathway) && e.sheet.effect.object !== 'none' && e.sheet.kind !== 'not-a-thing');
    const part = p => {
        const r = rows.filter(e => split(e.row.id) === p), hit = r.filter(e => (PATHWAY_OF_OBJECT[e.sheet.effect.object] ?? []).includes(e.packet.pathway)).length;
        let best = {object: null, hit: 0};
        for (const o of Object.keys(PATHWAY_OF_OBJECT)) { const h = r.filter(e => (PATHWAY_OF_OBJECT[o] ?? []).includes(e.packet.pathway)).length; if (h > best.hit) best = {object: o, hit: h}; }
        return {n: r.length, hit, baseline: best.hit, baseline_object: best.object};
    };
    return {label: CELLS.lotm_powers.label, tuned: part('tuned'), held_out: part('held-out')};
}

// ---- Build ----------------------------------------------------------------------------------------------------------------------
const BOOK_SHEET_KEYS = {effectEnums: ['verb', 'object', 'target', 'time']};
export function build(cell) {
    const c = classesFor(cell), replies = jread(pfile(cell, 'luna')), packets = packetsOf(cell), meta = jread(sidecarPath(cell)).meta;
    let entries = [];
    for (const p of packets) {
        const r = replies[p.id]?.reply;
        if (!r) throw Error(`${p.id}: no reply (${replies[p.id]?.error ?? 'not run'}); run the pass first`);
        entries.push(...(c.sections ? powerRows(cell, p, r) : [rowFor(cell, p, r)]));
    }
    if (c.sections) {
        const ids = new Set(meta.ids); if (entries.length !== ids.size || entries.some(e => !ids.has(e.row.id))) throw Error(`${cell}: rows differ from the frozen denominator`);
    } else if (entries.length !== meta.count) throw Error(`${cell}: rows differ from the frozen denominator`);
    const score = c.sections ? scorePowers(entries) : (c.classes?.length ? scoreClass(c, entries) : {label: c.label ?? 'none', note: 'no per-row classification stated: unscored'});
    const folded = !c.sections && c.classes?.length ? score.held_out.exact > score.held_out.baseline : false;
    const keep = c.wiki; // wiki-tier sheets commit short paraphrases (R6); book-tier sheets commit enums, locators and stated flags only
    const sheetOut = e => {
        const s = {...e.sheet}; if (!c.sections && !folded) delete s.class_guess;
        if (keep) return s;
        const slim = {kind: s.kind, effect: {verb: s.effect.verb, object: s.effect.object, target: s.effect.target, time: s.effect.time, locator: s.effect.locator, speaker: s.effect.speaker}};
        for (const k of Object.keys(s)) if (!['kind', 'effect', 'class_guess'].includes(k)) slim[k] = {stated: String(s[k].value ?? '').trim().length > 0, locator: s[k].locator, speaker: s[k].speaker};
        if (s.class_guess !== undefined) slim.class_guess = s.class_guess;
        return slim;
    };
    writeFileSync(`${COVERAGE}${c.ledger}.jsonl`, entries.map(e => JSON.stringify(e.row)).join('\n') + '\n');
    jwrite(sidecarPath(cell), {meta, score, fold: c.sections ? {grammar: 'model tier, unchecked unless the held-out score beats its baseline'} : {class_guess: folded ? 'folded' : 'not folded (does not beat the majority class on held-out rows)'},
        sheets: Object.fromEntries(entries.map(e => [e.row.id, {name: e.packet.name, split: split(e.row.id), ...(c.sections ? {pathway: e.packet.pathway, sequence: e.packet.seq, form: e.packet.kind, potion: e.packet.potion ?? undefined} : {label: e.label ?? null, locator: e.packet.locator}), sheet: sheetOut(e)}]))});
    const states = {}; for (const e of entries) { const k = e.row.state.split(':')[0]; states[k] = (states[k] ?? 0) + 1; }
    const slugs = {}; for (const e of entries) if (e.row.state.startsWith('blocked:')) slugs[e.row.state.slice(8)] = (slugs[e.row.state.slice(8)] ?? 0) + 1;
    return {ledger: c.ledger, rows: entries.length, states, slugs, score, folded};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [step, ...rest] = process.argv.slice(2);
    const want = rest.filter(a => CELLS[a] || a === 'all'), cells = want.includes('all') || !want.length ? CELL_NAMES : want;
    for (const cell of cells) {
        if (step === 'packets') console.log(cell, JSON.stringify(packetsFor(cell)));
        else if (step === 'names') { if (CELLS[cell].book) await names(cell, rest); }
        else if (step === 'merge') { if (CELLS[cell].book) console.log(cell, JSON.stringify(mergeNames(cell))); }
        else if (step === 'freeze') console.log(cell, JSON.stringify(freeze(cell)));
        else if (step === 'pass') await pass(cell, rest);
        else if (step === 'build') console.log(JSON.stringify(build(cell)));
        else console.log('usage: next_cells.mjs packets|names|merge|freeze|pass|build <cell|all>');
    }
}
