#!/usr/bin/env node
// TTRPG rules as rows (2026-11-17, proposals). One batched reader pass over the tabletop corpus in
// docs/research/tabletop-rules-2026-11-17/private/text/ (built by tabletop_corpus*.py; gitignored). Shards of about 8,000 words,
// one request per shard, a common header first, the shard as `shared`, and two questions in one request: the rules stated
// (PWC25 rows) and the named content (spells, items, conditions, creatures, powers). Replies land in private/ and are
// folded by `collect` into docs/coverage/<system>_rules.json and <system>_<kind>.jsonl.
//   node scripts/tabletop_rules_pass.mjs plan                 write private/plan.json (systems, shards) and print the counts
//   node scripts/tabletop_rules_pass.mjs run [--dry|--wait|--sync] [--only slug,slug] [--max-usd N]
//   node scripts/tabletop_rules_pass.mjs collect              fold replies into docs/coverage
import fs from 'node:fs';
import {runPass} from './label_runner.mjs';

export const DIR = 'docs/research/tabletop-rules-2026-11-17/private/';
export const TEXT = `${DIR}text/`;
export const SHARD_WORDS = 8000;

// System registry: slug -> {system, label, licence, source}. `system` groups slugs into one rules file.
export const SYSTEMS = {
    'dnd-srd-5.2.1': {system: 'dnd_srd', label: 'D&D 5.2.1 SRD', licence: 'CC-BY-4.0'},
    'ars-magica-core': {system: 'ars_magica', label: 'Ars Magica 5e Definitive Edition', licence: 'Ars Magica Open License'},
    'ars-magica-realms': {system: 'ars_magica', label: 'Ars Magica 5e Realms of Power', licence: 'Ars Magica Open License'},
    'ars-magica-magic': {system: 'ars_magica', label: 'Ars Magica 5e Magic books and Mysteries', licence: 'Ars Magica Open License'},
    'ars-magica-houses': {system: 'ars_magica', label: 'Ars Magica 5e Houses of Hermes and Covenants', licence: 'Ars Magica Open License'},
    'blades-in-the-dark-srd': {system: 'blades', label: 'Blades in the Dark SRD', licence: 'CC-BY-3.0'},
    'fate-srd': {system: 'fate', label: 'Fate SRD (Core, Condensed, Accelerated, toolkits)', licence: 'CC-BY-3.0/4.0 or OGL as each book states'},
    'mm3e-srd': {system: 'mm3e', label: 'Mutants & Masterminds 3e SRD', licence: 'OGL'},
    'brp-orc': {system: 'brp', label: 'Basic Roleplaying ORC', licence: 'ORC'},
    'ironsworn': {system: 'ironsworn', label: 'Ironsworn', licence: 'CC-BY-NC-SA-4.0'},
    'cypher-rd': {system: 'cypher', label: 'Cypher Reference Document', licence: 'Cypher Open License'},
    'eclipse-phase-2e-qs': {system: 'eclipse_phase', label: 'Eclipse Phase 2e Quickstart', licence: 'CC-BY-NC-SA-4.0'},
    'call-of-cthulhu-7e-qs': {system: 'coc', label: 'Call of Cthulhu 7e Quick-Start', licence: 'free quick-start, design reference only'},
    'pf1-spells': {system: 'pf1', label: 'Pathfinder 1e spells (d20pfsrd)', licence: 'OGL 1.0a'},
    'pf1-wondrous-items': {system: 'pf1', label: 'Pathfinder 1e wondrous items (d20pfsrd)', licence: 'OGL 1.0a'},
    'pf1-rules': {system: 'pf1', label: 'Pathfinder 1e skills, environment, afflictions, crafting (d20pfsrd)', licence: 'OGL 1.0a'},
    'pf1-weapon-armor-abilities': {system: 'pf1', label: 'Pathfinder 1e weapon and armor abilities (d20pfsrd)', licence: 'OGL 1.0a'},
};
for (const [slug, label] of Object.entries({'dnd5e-phb-2014': "D&D 5e Player's Handbook 2014", 'dnd5e-dmg-2014': "D&D 5e Dungeon Master's Guide 2014", 'dnd5e-xanathar': "Xanathar's Guide to Everything",
    'dnd5e-tasha': "Tasha's Cauldron of Everything", 'dnd5e-fizban': "Fizban's Treasury of Dragons", 'dnd5e-motm': 'Monsters of the Multiverse', 'dnd5e-planescape': 'Planescape: Adventures in the Multiverse',
    'dnd5e-spelljammer': 'Spelljammer: Adventures in Space', 'gurps-powers': 'GURPS Powers', 'gurps-thaumatology': 'GURPS Thaumatology', 'mm3e-heros-handbook': "M&M 3e Hero's Handbook", 'blades-core-harper': 'Blades in the Dark core book'}))
    SYSTEMS[slug] = {system: slug.startsWith('dnd5e') ? 'dnd5e_commercial' : slug.startsWith('gurps') ? 'gurps' : slug.startsWith('mm3e') ? 'mm3e_commercial' : 'blades_commercial', label, commercial: true, licence: 'commercial book, design reference only'};

// Blocked engine slugs from the cross-world histogram (docs/coverage state blocked:<slug>), the ones that are engine work.
export const SLUGS = ['item-bound-power', 'area-field', 'power-interaction', 'form-transformation', 'mind-binding', 'soul-state', 'sponsorship-contract', 'body-door',
    'divination-fate', 'mind-state', 'body-form', 'dimension-travel', 'tinker-device', 'familiar-summon', 'plant-or-creature-target', 'power-transfer', 'spatial-storage',
    'system-interface', 'time-loop', 'concept-law', 'negative-effect-drift', 'vow-cost', 'conceal-or-sense', 'formation-field', 'containment-rule', 'protection-field',
    'spirit-contract-judgement', 'memory-transfer', 'object-surface', 'projection-body', 'portal-space', 'blueprint-craft', 'construct-upkeep', 'place-release', 'memory-erasure',
    'soul-binding', 'creature-control', 'time-manipulation', 'body-code-decay', 'revival-on-death', 'luck-mechanism', 'precognition', 'power-granting', 'timeline-split',
    'time-stop', 'bond-slots', 'death-checkpoint-rewind', 'speech-penalty', 'world-travel', 'future-vision', 'mind-ennoblement', 'ingredient-properties'];
export const VERBS = ['move', 'add', 'remove', 'transform', 'bind', 'release', 'sense', 'conceal', 'copy', 'block', 'end', 'alter'];
export const KINDS = ['spell', 'item', 'condition', 'creature', 'power', 'feat-or-talent', 'class-or-role', 'ritual-or-art', 'other'];

const SEAMS = `AB1 Source and assignment (innate, learned, borrowed, acquired); AB2 Reserve, output, control; AB3 Vows that raise power; AB4 Bonded companions; AB11 Adaptation seam; AB12 Bloodline gifts through provenance; AB13 Digestion and acting; AB14 Loss of control; AB15 Power is conserved; AB16 Living tools with upkeep; AB17 Soul anchors; AB18 Vows with an enforcer; AB19 Emotion as fuel; AB20 Bounded rule spaces; AB21 Capacity limits; AB22 Felt rank; AB27 Shared loss-of-control accumulation; AB28 Aligned sources do not warp; AB29 Aftermath reflects its source; AB31 A crisis turned to profit; AB32 Stored power as a consumable item; AB33 Bloodline gift, sense and social effect; AB34 Anchors have a body cost`;

export const HEADER = `You read one passage of a tabletop role-playing rulebook for a life-simulation game engine. Work only from the passage. Paraphrase in your own words; never quote the book, and never copy more than a short term of art. Be specific and mechanical: say what the rule does and what it costs or limits, not what it is called.

Engine vocabulary. Effect verbs: ${VERBS.join(', ')}. Seams (AB codes): ${SEAMS}. Blocked engine capabilities a rule may unblock (use only these slugs): ${SLUGS.join(', ')}.

Answer both questions in one JSON object.
1. rules: up to 8 rules the passage states that a game engine could run: how a power, spell, state, contract, transformation, interaction or cost works. Skip flavour, character-creation arithmetic, and generic dice mechanics unless they set how powers combine, last, end or cost. For each: statement (one or two sentences, paraphrased, with the numbers it gives), locator (the nearest heading or page marker in the passage), mechanism (one effect verb, or "law: <few words>" when it is a standing law of the system), seam (best AB code or "none"), derives (blocked slugs this rule gives a playable model for, possibly none), default_dial_reason (one line: the default the engine could take, the dial a world could turn, and the in-world reason or cost).
2. content: up to 120 named things the passage defines (spells, items, conditions, creatures, powers, feats or talents, classes or roles, rituals or arts). For each: kind, name, locator, summary (one short sentence, paraphrased, what it does), mechanism (one effect verb, or "none" when it is only a statistic), derives (blocked slugs, possibly none). Prefer things with a distinct effect; skip plain weapons, armor and gear without an effect. If the passage defines more than 120, take the ones with the most unusual effects. Return an empty list when there are none.`;

export const HEADER_COMMERCIAL = HEADER.split('Answer both questions')[0] + `Answer one question as a JSON object.
rules: up to 10 rules the passage states that a game engine could run: how a power, spell, state, contract, transformation, interaction or cost works, aimed at the seams above. Skip flavour, character-creation arithmetic and generic dice mechanics unless they set how powers combine, last, end or cost. For each: statement (one or two sentences, paraphrased, with the numbers it gives), locator (nearest heading or page marker), mechanism (one effect verb, or "law: <few words>"), seam (best AB code or "none"), derives (blocked slugs this rule gives a playable model for, possibly none), default_dial_reason (one line: default, dial, and the in-world reason or cost). This is a commercial book kept as design reference only: do not name more than the rule's own term of art, and do not list content.`;

const enumStr = vals => ({type: 'string', enum: vals});
export const SCHEMA = {type: 'object', additionalProperties: false, required: ['rules', 'content'], properties: {
    rules: {type: 'array', items: {type: 'object', additionalProperties: false, required: ['statement', 'locator', 'mechanism', 'seam', 'derives', 'default_dial_reason'], properties: {
        statement: {type: 'string'}, locator: {type: 'string'}, mechanism: {type: 'string'}, seam: {type: 'string'},
        derives: {type: 'array', items: enumStr(SLUGS)}, default_dial_reason: {type: 'string'}}}},
    content: {type: 'array', items: {type: 'object', additionalProperties: false, required: ['kind', 'name', 'locator', 'summary', 'mechanism', 'derives'], properties: {
        kind: enumStr(KINDS), name: {type: 'string'}, locator: {type: 'string'}, summary: {type: 'string'}, mechanism: {type: 'string'},
        derives: {type: 'array', items: enumStr(SLUGS)}}}}}};

// Split a text into shards of about `words` words on line boundaries.
export const SCHEMA_COMMERCIAL = {...SCHEMA, required: ['rules'], properties: {rules: SCHEMA.properties.rules}};

export function shard(text, words = SHARD_WORDS) {
    const out = []; let cur = [], n = 0;
    for (const line of text.split('\n')) {
        const w = line.split(/\s+/).filter(Boolean).length;
        if (n + w > words && n > words * 0.5) { out.push(cur.join('\n')); cur = []; n = 0; }
        cur.push(line); n += w;
    }
    if (cur.length) out.push(cur.join('\n'));
    return out;
}

export function buildItems(only, wave = 'open') {
    const items = [];
    for (const slug of Object.keys(SYSTEMS)) {
        if (only && !only.includes(slug)) continue;
        if (!!SYSTEMS[slug].commercial !== (wave === 'commercial')) continue;
        const file = `${TEXT}${slug}.txt`;
        if (!fs.existsSync(file)) continue;
        shard(fs.readFileSync(file, 'utf8')).forEach((s, i) => items.push({id: `${slug}#${String(i).padStart(3, '0')}`, shared: `SOURCE: ${SYSTEMS[slug].label}, passage ${i + 1}\n\n${s}`,
            user: 'Return the rules and content for this passage.'}));
    }
    return items;
}

// ---- collect: replies -> docs/coverage ----
const COVERAGE = 'docs/coverage/';
const KIND_FILE = {spell: 'spells', item: 'items', creature: 'creatures'}; // everything else is a power-like row
const clean = t => String(t ?? '').replace(/\s+/g, ' ').trim();
const slugify = t => clean(t).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'unnamed';
const mech = m => { const t = clean(m).toLowerCase(); return VERBS.includes(t) || t === 'none' || t.startsWith('law:') ? t : `law: ${t.replace(/^law:?\s*/, '')}`; };
const normStmt = t => clean(t).toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 90);
export function collect() {
    const replies = {};
    for (const f of fs.readdirSync(DIR).filter(f => /^ttrpg_rules_(open|commercial)(_late)?_luna\.json$/.test(f))) Object.assign(replies, JSON.parse(fs.readFileSync(DIR + f, 'utf8')));
    const bySystem = {};
    for (const id of Object.keys(replies).sort()) {
        const r = replies[id].reply; if (!r) continue;
        const slug = id.split('#')[0], reg = SYSTEMS[slug];
        (bySystem[reg.system] ??= {licence: new Set(), labels: new Set(), shards: [], commercial: !!reg.commercial}).shards.push({id, slug, reg, r});
        bySystem[reg.system].licence.add(reg.licence); bySystem[reg.system].labels.add(reg.label);
    }
    const summary = {};
    for (const [system, g] of Object.entries(bySystem)) {
        const rules = [], seen = new Set(), content = new Map();
        for (const {id, reg, r} of g.shards) {
            for (const x of r.rules) {
                const key = normStmt(x.statement); if (seen.has(key)) continue; seen.add(key);
                rules.push({id: `${system}.rule.${String(rules.length + 1).padStart(4, '0')}`, world: system, statement: clean(x.statement), locators: [`${reg.label}: ${clean(x.locator)} (${id})`],
                    speaker: 'rulebook', mechanism: mech(x.mechanism), seam: clean(x.seam) || 'none', derives: [...new Set(x.derives)], default_dial_reason: clean(x.default_dial_reason), licence: reg.licence});
            }
            for (const x of r.content ?? []) {
                const key = `${x.kind}|${slugify(x.name)}`;
                if (content.has(key)) continue;
                content.set(key, {...x, name: clean(x.name), reg, shard: id});
            }
        }
        const meta = {world: system, books: [...g.labels], licence: [...g.licence],
            note: 'Rule rows (PWC25 shape): id, world, statement (paraphrased), locators, speaker, mechanism, seam (AB code), derives (blocked slugs a playable model exists for), default_dial_reason, licence. Proposals: a batched reader (gpt-6-luna) read the books in shards of about 8,000 words; nothing here was human-checked, and no source text is kept.' + (g.commercial ? ' Commercial book: design reference only.' : ''),
            date: '2026-11-17', shards: g.shards.length};
        fs.writeFileSync(`${COVERAGE}${system}_rules.json`, JSON.stringify({meta, rules}, null, 1) + '\n');
        summary[system] = {rules: rules.length, content: content.size};
        if (g.commercial) continue; // commercial books: rule rows only, no named-content ledger
        const files = {};
        for (const c of content.values()) {
            const f = `${system}_${KIND_FILE[c.kind] ?? 'powers'}`, rows = (files[f] ??= []);
            const base = `${system}.${c.kind}.${slugify(c.name)}`; let id = base, n = 2;
            while (rows.some(r => r.id === id)) id = `${base}-${n++}`;
            const derives = [...new Set(c.derives)];
            rows.push({id, source: `${c.reg.label}: ${clean(c.locator)} (${c.shard}); licence ${c.reg.licence}`, state: derives.length ? `blocked:${derives[0]}` : 'catalogued', mechanisms: ['tabletop'], test: null,
                note: `${c.name}. ${c.kind}. ${clean(c.summary)} [verb ${mech(c.mechanism)}${derives.length > 1 ? `; also needs ${derives.slice(1).join(', ')}` : ''}] (batched reader, unchecked)`});
        }
        for (const [f, rows] of Object.entries(files)) { fs.writeFileSync(`${COVERAGE}${f}.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); summary[system][f] = rows.length; }
    }
    console.log(JSON.stringify(summary, null, 1));
}

const argv = process.argv.slice(2), cmd = argv[0];
const val = n => argv.includes(n) ? argv[argv.indexOf(n) + 1] : null;
const only = val('--only')?.split(',') ?? null, wave = val('--wave') ?? 'open', shards = val('--shards')?.split(',') ?? null;
const skip = new Set(['--only', '--wave', '--tag', val('--tag'), '--shards', only?.join(','), wave, shards?.join(',')].filter(Boolean));
const pick = () => buildItems(only, wave).filter(it => !shards || shards.includes(it.id));
if (cmd === 'plan') {
    const out = {};
    for (const w of ['open', 'commercial']) {
        const items = buildItems(null, w), per = {};
        for (const it of items) { const s = it.id.split('#')[0]; per[s] = (per[s] ?? 0) + 1; }
        out[w] = {requests: items.length, perSource: per};
    }
    fs.writeFileSync(`${DIR}plan.json`, JSON.stringify({shardWords: SHARD_WORDS, ...out}, null, 1));
    console.log(JSON.stringify(out));
} else if (cmd === 'collect') {
    collect();
} else if (cmd === 'run') {
    const commercial = wave === 'commercial';
    await runPass({name: `ttrpg_rules_${wave}${val('--tag') ? `_${val('--tag')}` : ''}${shards ? '_pilot' : ''}`, dir: DIR, system: commercial ? HEADER_COMMERCIAL : HEADER, schema: commercial ? SCHEMA_COMMERCIAL : SCHEMA,
        items: pick(), model: 'gpt-6-luna', effort: 'low', maxTokens: commercial ? 6000 : 16000}, argv.slice(1).filter(a => !skip.has(a)));
}

