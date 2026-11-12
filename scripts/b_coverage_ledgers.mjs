#!/usr/bin/env node
// Chat B coverage ledgers (procedural foundation plan CV1-CV4, MS1).
// Regenerates docs/coverage/hp_potions.jsonl, hp_ingredients.jsonl and
// lotm_potions.jsonl from repo data only: the Hogwarts evidence catalogue
// (docs/research/hogwarts-potion-evidence-2026-11-11/catalogue.jsonl) and the
// LOTM pathway potion table (docs/gm/dispatch/potion-pathways-2026-10-24/
// PATHWAY_POTION_TABLE.md), plus the brew pack's formula rows.
// Classification is by title, novel hits and linked observations: an inference
// (GL7, PGC11), marked `basis` on every row. Raw source text is not read here.
// Usage: node scripts/b_coverage_ledgers.mjs [--check]  (--check fails if the
// committed ledgers differ from a fresh build).
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const at = p => join(root, p);
const CATALOGUE = 'docs/research/hogwarts-potion-evidence-2026-11-11/catalogue.jsonl';
const TABLE = 'docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md';
// Reviewed corrections and additions, applied after the title rules. A lane
// edits only this file: {hp_potions: {id: patch}, hp_ingredients: {id: patch},
// lotm_potions: {id: patch}, lotm_extra: [row]}. A patch may set state, note,
// source, mechanisms, test, title, layer, basis; every patch needs `evidence`
// (a locator or observation id) so a reviewer can check it.
export const OVERRIDES = 'docs/coverage/b_overrides.json';
const PATCHABLE = new Set(['state', 'note', 'source', 'mechanisms', 'test', 'title', 'layer', 'basis', 'evidence']);
function readOverrides() {
    try { return JSON.parse(readFileSync(at(OVERRIDES), 'utf8')); } catch (e) { if (e.code === 'ENOENT') return {}; throw e; }
}
function applyOverrides(rows, patches = {}, name) {
    const byId = new Map(rows.map(r => [r.id, r]));
    for (const [id, patch] of Object.entries(patches)) {
        const row = byId.get(id);
        if (!row) throw new Error(`${OVERRIDES}: ${name} has no row ${id}.`);
        for (const k of Object.keys(patch)) if (!PATCHABLE.has(k)) throw new Error(`${OVERRIDES}: ${id} cannot patch ${k}.`);
        if (!patch.evidence) throw new Error(`${OVERRIDES}: ${id} needs evidence.`);
        const {evidence, ...rest} = patch;
        Object.assign(row, rest, {basis: rest.basis ?? `reviewed override (${evidence})`});
    }
    return rows;
}
const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// ---------- Hogwarts potions ----------

// Potions that run today, each on a named owner with a test that runs it.
const HP_POTION_RUNS = {
    'Polyjuice Potion': ['runs-authored', ['hp_brewing_state'], 'tests/hp_brewing.test.js',
        'Formula, stew, moon and donor binding are source-backed; quantities, brew time, doses and grades are authored.'],
    'Draught of Living Death': ['runs-authored', ['hp_potion_reactions'], 'tests/hogwarts_potion_workshop.test.js',
        'Book 6 ch. 9 crush-versus-slice and stirring cues; bean units, thresholds and colours as checkpoints are authored.'],
    'Cure for Boils': ['runs-authored', ['hp_lead_making'], 'tests/hp_lead_making.test.js',
        'Book 1 ingredients and the quills-off-the-fire order; amounts authored.'],
    'Love potion': ['runs-authored', ['potion_workings', 'potion_working_rules'], 'tests/potion_workings.test.js',
        'Workroom fixation from Ashwinder egg and rose oil; the composed method is original.'],
    'Alihotsy Draught': ['runs-authored', ['potion_workings', 'potion_working_rules'], 'tests/potion_workings.test.js',
        'Runs as an Alihotsy leaf dose causing hysteria with treacle relief; the brewed draught itself has no row.'],
};

const HP_POTION_NOT = {
    'topic-or-publication': ['Abandoned potions of the Middle Ages as compared to the Black Plague', 'Essay on shrinking potions',
        'Essay on the properties of Hemlock', 'The Properties of Moonstone and its Uses in Potion-Making', 'Cheese-Based Potions',
        'Forbidden XPotions', 'Everlasting Elixirs'],
    'person-group-or-business': ['Ancient Potion Maker', 'E. M. L. Potions Co.', 'Excellence in Potions Cup', 'Potions Association',
        'Potions Club', 'Potions Lady', 'Potions market', 'Rubens Winikus and Company Inc.'],
    'generic-or-category': ['List of potions', 'Potion', 'Elixir', 'Antidote', 'Hair care potions', 'Cleaning Solutions',
        'Restorative Draughts', 'Fake protective potions', 'Chemical recipe', 'Potion symbols table', 'Potions (class)', 'Stamina Game'],
    'technique-law-or-phrase': ['Golpalott\'s Third Law', 'Potion skimming', 'Aeration', 'Potion riddle', 'Brewed glory'],
};

// Ordered families: the first matching pattern names the missing rule and its owner.
const HP_POTION_FAMILIES = [
    ['luck-field', 'W law field over chance (with S)', /felix|calamity|luck|lucky/],
    ['place-release', 'W place effect for a released gas or blast (spill exists in the brew law)', /exploding|garrotting|smother smoke|thunderbrew|turbo farts|erumpent potion/],
    ['conceal-or-sense', 'effect grammar conceal or sense verbs on W properties (GL2)', /invisib|ink-shroud|perpetual cloud|trace detection|undetectable|oculus|wideye|moonlight-oil/],
    ['protection-field', 'W protective law field on a body or thing', /fire protection|anti-jinx|protective|girding/],
    ['plant-or-creature-target', 'L non-human bodies: plants, pests, pets', /fertili|herbicide|blight|germinat|weed|doxycide|narglecide|\brat\b|crup|jarvey|norris|beak|hoof|horn polish|slug repellent|bundimun|scale sap|scale rot|occamy|dragon tonic|cultivation|flourish|spike rot|pompion|mandrake restorative|piscatorial|rat tonic/],
    ['object-surface', 'F or W effect on a thing\'s surface (the brew law\'s film and rinse cover only vessels)', /polish|mess remover|everklena|shell shiner|varnish|developing solution|quodpot|cleaning|glossy|curio|shoe-eating/],
    ['body-form', 'L form change on a body plus the effect grammar transform verb', /ageing|aging|shrink|swell|hair|grow|bulgeye|fungiface|animagus|beautif|manegro|sculpting|thinning|deflating|weightless|contortion|rudimentary body|fire-breathing|polyjuice|dogbreath|snuffling|pimple|blemish|complexion|tooth|dentifricium|toothpaste|stomach switching|pearling|maxima|edurus|kissing|lowdour|ego-shine/],
    ['mind-state', 'A minds as quantities, read from L bodies (dose on a mind)', /love|amortentia|cupid|heartbreak|beguiling|twilight moonbeams|hate|calm|peace|confus|befuddl|forget|memory|dizz|drowsi|sleep|living death|euphoria|insanity|laugh|wit-|wisdom|brain|focus|perception|mind|truth|veritaserum|legilimen|stupid|confidence|babbling|dawdle|fatigu|jawbind|muffling|screaming|singing|hiccough|volubilis|oblivious|dreamless|counter-prank|riddle/],
    ['body-door', 'L dose response on a body: healing, poison, antidote (BRC12)', /antidote|anti-venom|cure|heal|poison|venom|balm|paste|salve|poultice|ointment|unction|pomade|remedy|replenish|restor|rejuic|skele|pepperup|wiggenweld|medicine|panacea|wound|burn|bruise|blood|cough|pox|toxic|death|malady|regenerat|revive|elixir|mandrake|ague|laxative|retching|tonic|stamina|strength|invigorat|exstimulo|vitamix|power potion|potential|dragon poison|noxious|baneberry|dogbane|moonseed|bloodroot|angel's trumpet|mopsus|essence of|murtlap|wrap|relieviate|pick-me-up|mad dog|bitterroot|armadillo bile|frog parts|horned slugs|rat spleen|weakness|anti-paralysis|silver and dittany/],
];

// Title rules that the patterns above would get wrong.
const HP_POTION_FAMILY_OVERRIDES = {
    'Wolfsbane Potion': 'body-form', "Xeep's Luscious Locks Solution": 'body-form',
    "Counter-serum for Xeep's Luscious Locks Solution": 'body-form',
    'Wound-Cleaning Potion': 'body-door', "Severus Snape's fake Felix Felicis": 'mind-state', 'Fluxweed Syrup': 'effect-sentence',
};

/** The title-only family rule (no evidence read): the blocking rule a potion
 * name implies, or 'effect-sentence' when the name says nothing. Exported for
 * the effect layer's canon test, which compares it with evidence labels. */
export function potionFamily(title) {
    const forced = HP_POTION_FAMILY_OVERRIDES[title];
    if (forced) return forced;
    const lower = title.toLowerCase();
    return HP_POTION_FAMILIES.find(([, , pattern]) => pattern.test(lower))?.[0] ?? 'effect-sentence';
}

function hpPotionRow(entry) {
    const t = entry.title, novel = entry.exact_title_novel_hits.length > 0 || entry.observation_ids.length > 0;
    const base = {id: `hp.potion.${slug(t)}`, title: t, source: entry.source, layer: novel ? 'novel' : 'wiki-only',
        observations: entry.observation_ids, basis: 'title-classified (inference)'};
    if (HP_POTION_RUNS[t]) {
        const [state, mechanisms, test, note] = HP_POTION_RUNS[t];
        return {...base, state, mechanisms, test, note, basis: 'owner code read'};
    }
    for (const [reason, titles] of Object.entries(HP_POTION_NOT))
        if (titles.includes(t)) return {...base, state: `not-a-thing:${reason}`, mechanisms: [], test: null, note: ''};
    const lower = t.toLowerCase();
    const forced = HP_POTION_FAMILY_OVERRIDES[t];
    if (forced === 'effect-sentence') return {...base, state: 'blocked:effect-sentence', mechanisms: ['brew_law'], test: null,
        note: 'The title does not say what it does; it needs its effect written as an effect-grammar sentence (GL2) from its evidence.'};
    for (const [rule, owner, pattern] of HP_POTION_FAMILIES) if (forced ? rule === forced : pattern.test(lower))
        return {...base, state: `blocked:${rule}`, mechanisms: ['brew_law'], test: null, note: `Missing: ${owner}.`};
    return {...base, state: 'blocked:effect-sentence', mechanisms: ['brew_law'], test: null,
        note: 'The title does not say what it does; it needs its effect written as an effect-grammar sentence (GL2) from its evidence.'};
}

// ---------- Hogwarts ingredients ----------

const HP_INGREDIENT_RUNS = {
    'Lacewing fly': ['hp_brewing_state', 'tests/hp_brewing.test.js'], 'Leech': ['hp_brewing_state', 'tests/hp_brewing.test.js'],
    'Fluxweed': ['hp_brewing_state', 'tests/hp_brewing.test.js'], 'Knotgrass': ['hp_brewing_state', 'tests/hp_brewing.test.js'],
    'Horn of Bicorn': ['hp_brewing_state', 'tests/hp_brewing.test.js'], 'Boomslang skin': ['hp_brewing_state', 'tests/hp_brewing.test.js'],
    'Human hair': ['hp_brewing_state', 'tests/hp_brewing.test.js'], 'Cat hair': ['hp_brewing_state', 'tests/hp_brewing.test.js'],
    'Bone meal': ['hp_ingredient_substitution', 'tests/hp_ingredient_substitution.test.js'],
    'Nettle': ['hp_lead_making', 'tests/hp_lead_making.test.js'], 'Snake fang': ['hp_lead_making', 'tests/hp_lead_making.test.js'],
    'Horned slug': ['hp_lead_making', 'tests/hp_lead_making.test.js'], 'Porcupine quill': ['hp_lead_making', 'tests/hp_lead_making.test.js'],
    'Sopophorous Bean': ['hp_potion_reactions', 'tests/hogwarts_potion_workshop.test.js'],
    'Ashwinder egg': ['potion_working_rules', 'tests/potion_workings.test.js'], 'Rose Petal': ['potion_working_rules', 'tests/potion_workings.test.js'],
    'Flobberworm Mucus': ['potion_working_rules', 'tests/potion_workings.test.js'], 'Glumbumble treacle': ['potion_working_rules', 'tests/potion_workings.test.js'],
    'Alihotsy': ['potion_working_rules', 'tests/potion_workings.test.js'], 'Water': ['potion_working_rules', 'tests/potion_workings.test.js'],
};
const HP_INGREDIENT_NOT = {
    'person': ['Agrippa'],
    'concept': ['Counter-ingredient', 'Standard Ingredient', 'Mercury and Mars', 'Square Root'],
    'process-not-material': ['Fire'],
    'unclear-title': ['Gulf', 'Herbaria', 'Thaumatagoria'],
};

function hpIngredientRow(entry) {
    const t = entry.title, novel = entry.exact_title_novel_hits.length > 0 || entry.observation_ids.length > 0;
    const base = {id: `hp.ingredient.${slug(t)}`, title: t, source: entry.source, layer: novel ? 'novel' : 'wiki-only',
        observations: entry.observation_ids, basis: 'title-classified (inference)'};
    if (HP_INGREDIENT_RUNS[t]) {
        const [owner, test] = HP_INGREDIENT_RUNS[t];
        return {...base, state: 'runs-authored', mechanisms: [owner], test, basis: 'owner code read',
            note: 'A material row the owner runs; its property numbers are authored.'};
    }
    for (const [reason, titles] of Object.entries(HP_INGREDIENT_NOT))
        if (titles.includes(t)) return {...base, state: `not-a-thing:${reason}`, mechanisms: [], test: null, note: ''};
    return {...base, state: 'blocked:ingredient-properties', mechanisms: ['brew_law'], test: null,
        note: entry.observation_ids.length
            ? `Needs property axes from its evidence (${entry.observation_ids.join(', ')}) as a material row (BRG1, MR37).`
            : 'Needs property axes; the catalogue has no linked observation, so values would be authored (BRG1, MR37).'};
}

// ---------- Lord of the Mysteries potions ----------

function lotmInventory(text, brewRows) {
    const rows = [];
    const sections = text.split(/\n## /).filter(s => /^\d+\. .+ line/.test(s));
    const brew = new Map(brewRows.map(r => [r.id, r]));
    for (const section of sections) {
        const pathway = /^\d+\. (.+?) line/.exec(section)[1];
        const line = section.split('\n').find(l => l.includes('**Sequences:**'));
        const list = line.split('**Sequences:**')[1];
        for (let seq = 9; seq >= 0; seq--) {
            const m = new RegExp(`(?:^|, )\\s*${seq} (.+?)(?=, \\d+ |\\. |$)`).exec(list.trim());
            const raw = m ? m[1].trim() : '';
            const missing = /\*\*missing\*\*/.test(raw);
            const name = missing ? null : raw.replace(/\s*\(.*?\)\s*$/, '').trim() || null;
            const id = `${slug(pathway)}_${seq}`;
            const row = brew.get(id);
            const base = {id: `lotm.potion.${id}`, pathway, seq, name, source: `${TABLE}#${slug(pathway)}`,
                nameNote: missing || /\((?:I|W|C\d+|inferred|author|deep dive|memory)/.test(raw) ? raw.replace(/\*\*/g, '') : undefined};
            if (row) {
                const mains = row.slots.filter(s => s.role === 'main');
                const stated = mains.every(s => s.source === 'stated');
                rows.push({...base, state: stated ? 'runs-canon' : 'runs-authored', mechanisms: ['brew_law', 'lotm_brew_pack'],
                    test: 'tests/brew_law.test.js', offered: row.offered,
                    note: stated ? 'Every main amount is stated by the table; the binding law is calibrated to the Seer scene.'
                        : 'Some main amounts are not stated, so they run as one portion per qty.'});
            } else {
                rows.push({...base, state: 'blocked:formula-in-notes', mechanisms: ['brew_law'], test: null,
                    note: 'No main material is named in the notes for this Sequence; the law can run it once a reading lane supplies the formula.'});
            }
        }
    }
    return rows.map(r => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
}

async function nonPathwayRows() {
    const {LOTM_AID_PREPARATIONS} = await import(at('src/lotm_potion_rule_rows.js'));
    return LOTM_AID_PREPARATIONS.rows.map(r => ({id: `lotm.potion.${slug(r.id.replace(/^lotm\.aid\./, 'aid_'))}`, pathway: null, seq: null,
        name: r.label, source: 'src/lotm_potion_rule_rows.js', state: 'blocked:body-door', mechanisms: ['brew_law'], test: null,
        note: 'A non-pathway preparation with source ingredients; its effect needs L\'s dose door and its amounts are unstated.'}));
}

// ---------- build ----------

export async function buildLedgers() {
    const catalogue = readFileSync(at(CATALOGUE), 'utf8').trim().split('\n').map(l => JSON.parse(l));
    const potions = catalogue.filter(r => r.kinds.includes('potion_related')).map(hpPotionRow);
    const ingredients = catalogue.filter(r => r.kinds.includes('ingredient_related')).map(hpIngredientRow);
    const {LOTM_BREW_ROWS} = await import(at('src/world_packs/lotm_brew_pack.js'));
    const o = readOverrides();
    const extra = (o.lotm_extra ?? []).map(r => {
        if (!r.id?.startsWith('lotm.potion.') || !r.evidence) throw new Error(`${OVERRIDES}: lotm_extra rows need a lotm.potion. id and evidence.`);
        const {evidence, ...rest} = r;
        return {mechanisms: ['brew_law'], test: null, ...rest, basis: `reviewed addition (${evidence})`};
    });
    const lotm = [...lotmInventory(readFileSync(at(TABLE), 'utf8'), LOTM_BREW_ROWS), ...await nonPathwayRows(), ...extra];
    return {hp_potions: applyOverrides(potions, o.hp_potions, 'hp_potions'),
        hp_ingredients: applyOverrides(ingredients, o.hp_ingredients, 'hp_ingredients'),
        lotm_potions: applyOverrides(lotm, o.lotm_potions, 'lotm_potions')};
}

export function summarize(rows) {
    const count = prefix => rows.filter(r => r.state.startsWith(prefix)).length;
    const real = rows.length - count('not-a-thing');
    const runs = count('runs-');
    return {rows: rows.length, runsCanon: count('runs-canon'), runsAuthored: count('runs-authored'), blocked: count('blocked:'),
        notAThing: count('not-a-thing:'), unclassified: count('unclassified'), real, runsShareOfReal: real ? Math.round(runs * 1000 / real) / 10 : 0};
}

// P's row format (docs/coverage/README.md): id, source, state, mechanisms,
// test, note. Title, layer, basis and observations fold into source and note.
export function toLedgerRow(r) {
    const label = r.title ?? [r.pathway, r.seq != null ? `Sequence ${r.seq}` : null, r.name ?? '(name missing in notes)'].filter(Boolean).join(' ');
    const extra = [r.layer && `layer ${r.layer}`, r.basis, r.nameNote && `name note: ${r.nameNote}`,
        r.offered === false && 'not offered at a bench (formula incomplete in notes)'].filter(Boolean).join('; ');
    const source = [r.source, ...(r.observations ?? [])].join('; ');
    return {id: r.id, source, state: r.state, mechanisms: r.mechanisms, test: r.test ?? null,
        note: [label + '.', r.note, extra && `(${extra})`].filter(Boolean).join(' ')};
}
const serialize = rows => rows.map(r => JSON.stringify(toLedgerRow(r))).join('\n') + '\n';

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const ledgers = await buildLedgers();
    const check = process.argv.includes('--check');
    let stale = 0;
    mkdirSync(at('docs/coverage'), {recursive: true});
    for (const [name, rows] of Object.entries(ledgers)) {
        const path = at(`docs/coverage/${name}.jsonl`), text = serialize(rows);
        if (check) { let old = ''; try { old = readFileSync(path, 'utf8'); } catch {} if (old !== text) { stale++; console.error(`stale: ${name}`); } }
        else writeFileSync(path, text);
        console.log(name, JSON.stringify(summarize(rows)));
    }
    process.exit(stale ? 1 : 0);
}
