#!/usr/bin/env node
// Generated Gu (PWC30-PWC34, proposals, 2026-11-17): Gu that Reverend Insanity never names, invented from real-world concept
// words and the trend of the canon Gu. A fourth tier, apart from canon and derived (PWC30).
//   node scripts/gu_generator.mjs freeze     build the frozen inputs (concept list, split, prefix, prompt, schema, scoring rules)
//   node scripts/gu_generator.mjs run [--pilot] [--sync] [--wait]   paid pass through scripts/label_runner.mjs (AU16)
//   node scripts/gu_generator.mjs score      reconstruction score on the held-out canon Gu (PWC31)
//   node scripts/gu_generator.mjs ledger     filter (PWC32) and write docs/coverage/gu_generated.jsonl
// Keys: OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" (header of label_runner.mjs).
// The private Gu review index is gitignored; the built prefix text and its sha are committed so a rerun is comparable (PWC34).
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {demoteTypedRuns} from './typed_runs.mjs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {confidenceOf} from './derivation_confidence.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES, lowerEffect, assembleEffect, OBJECT_OWNER} from '../src/effect_grammar.js';
import {guEffects, GU_FUNCTION} from '../src/world_packs/gu_effect_pack.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {typeFunction, nameFunction} from './gu_function_words.mjs';
import {generatedRanker} from './derive_gu_ranks.mjs';

const root = new URL('..', import.meta.url).pathname;
export const DIR = 'docs/coverage/', WORK = 'docs/research/power-catalogues-2026-11-16/work/';
export const FROZEN = `${DIR}gu_generated_frozen.json`, PREFIX = `${DIR}gu_generated_prefix.txt`, LEDGER = `${DIR}gu_generated.jsonl`;
const sha = s => createHash('sha1').update(s).digest('hex');
const rd = p => JSON.parse(readFileSync(join(root, p), 'utf8'));
const privatePath = 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json';
const indexPath = [join(root, privatePath), join('/Users/weiwei/code/yet-another-idle-rpg', privatePath)].find(existsSync);

// GKM429: held out when the first byte of sha1(id) is below 0x33 (about 20%).
export const heldOut = id => parseInt(sha(id).slice(0, 2), 16) < 0x33;
export const SPLIT_RULE = 'sha1(id)[0] < 0x33 on the review-index record id (GKM429); held-out canon Gu are absent from the shared prefix and from every prompt';
export const bandOf = rank => rank == null ? null : rank <= 3 ? 'low' : rank <= 5 ? 'mid' : 'high';

// ---- the canon catalogue as compact lines ----
const ranksOf = r => [...new Set([...(r.metadata?.fandom_category_ranks ?? []), ...(r.metadata?.saga_rank ? [r.metadata.saga_rank] : [])])].sort((a, b) => a - b);
const pathOf = r => { const p = (r.fandom?.categories ?? []).find(c => c.endsWith(' Path') && c !== 'Unknown Path'); return p ? p.slice(0, -5).toLowerCase() : r.metadata?.saga_path ?? null; };
const nameOf = r => r.saga?.name ?? r.fandom?.name ?? r.id;

export function canonRows() {
    if (!indexPath) throw Error('The private Gu review index is needed (gitignored).');
    const index = JSON.parse(readFileSync(indexPath, 'utf8'));
    const tier = rd(`${DIR}wiki_tier_labels.json`).gu_kinds, chap = rd(`${DIR}chapter_tier_labels.json`).gu_kinds ?? {};
    const derived = rd(`${DIR}gu_derived_ranks.json`).rows, claim = rd(`${DIR}ri_move_claim_checks.json`).kinds;
    return index.records.map(r => {
        const name = nameOf(r), id = r.id, mapped = claim[id]?.catalogue, cat = guCatalogue[mapped ?? id] ?? null;
        const ranks = ranksOf(r), t = tier[id] ?? {}, c = chap[id];
        let rank = null, rankBasis = null;
        if (ranks.length) { rank = ranks[0]; rankBasis = 'stated'; }
        else if (cat?.parts?.value?.rank?.length) { rank = Math.min(...cat.parts.value.rank); rankBasis = 'stated'; }
        else if (c?.rank) { rank = c.rank; rankBasis = 'chapter'; }
        else if (t.rank) { rank = t.rank; rankBasis = 'wiki-tier'; }
        else if (/\bimmortal gu\b/i.test(name)) { rank = 6; rankBasis = 'name-bound'; }
        else if (derived[id]?.rank) { rank = derived[id].rank; rankBasis = 'derived'; }
        const types = (r.fandom?.categories ?? []).filter(k => typeFunction[k]);
        let fn = null, fnBasis = null;
        if (cat?.parts?.value?.function) { fn = cat.parts.value.function; fnBasis = 'catalogue'; }
        else if (types.length) { fn = typeFunction[types[0]]; fnBasis = 'wiki-type'; }
        else { const k = nameFunction.find(([re]) => re.test(name)); if (k) { fn = k[1]; fnBasis = 'name-keyword-inference'; }
            else if (t.function ?? t.effectFamily) { fn = t.function ?? t.effectFamily; fnBasis = 'wiki-tier'; } }
        return {id, name, path: pathOf(r), rank, rankBasis, fn, fnBasis, held: heldOut(id)};
    });
}
const SPOKEN = fn => { const g = GU_FUNCTION[fn]; return g ? `${g.verb} ${g.object}` : null; };
const line = r => `${r.name} | ${r.path ?? '-'} | r${r.rank ?? '?'}${r.rankBasis === 'derived' ? 'd' : ''} | ${SPOKEN(r.fn) ?? '-'}`;

// ---- stems and concepts ----
const NOISE = new Set(['gu', 'immortal', 'mortal', 'worm', 'rank', 'the', 'of', 'as', 'and', 'a', 'an', 'in', 'to', 'with', 'for', 'on', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'first', 'second', 'third', 'before', 'after', 'true', 'big', 'small', 'little', 'great', 'new']);
const ROMAN = /^(i{1,3}|iv|v|vi{0,3}|ix|x)$/i;
export const tokens = name => name.toLowerCase().replace(/['’]s\b/g, '').split(/[^a-z]+/).filter(w => w.length >= 3 && !NOISE.has(w) && !ROMAN.test(w));
export const stemOf = name => tokens(name).join(' ');

const CATEGORIES = {
    animals: 'wolf fox hare tiger lion bear boar deer elk bison buffalo camel horse donkey ox goat sheep ram panther leopard jaguar lynx otter beaver badger weasel mole bat owl hawk falcon eagle vulture crow raven magpie swallow sparrow heron crane stork pelican parrot peacock pheasant quail pigeon dove swan goose duck rooster cuckoo kingfisher woodpecker sparrowhawk salmon carp eel catfish pike trout shark ray whale dolphin seal walrus crab lobster shrimp octopus squid jellyfish starfish sea-urchin oyster clam snail slug leech earthworm ant termite wasp hornet bee cricket grasshopper locust mantis dragonfly firefly beetle weevil cicada moth butterfly spider scorpion centipede millipede tick flea louse mosquito gnat frog toad newt salamander lizard gecko chameleon crocodile turtle tortoise cobra viper python adder rat mouse squirrel hedgehog porcupine armadillo pangolin sloth monkey ape lemur kangaroo koala platypus llama yak ibex gazelle antelope hyena jackal wolverine mongoose civet lamprey seahorse pufferfish barnacle coral'.split(' '),
    plants: 'oak pine cedar cypress willow birch maple elm ash beech poplar bamboo reed rush cattail lotus lily orchid peony chrysanthemum jasmine rose lavender mint basil thyme sage rosemary ginger garlic onion leek pepper chili mustard sesame hemp flax cotton tea coffee cocoa tobacco poppy lotus-root ginseng mushroom truffle moss lichen fern ivy vine grape melon pumpkin gourd bean pea lentil millet barley wheat rice maize sorghum sugarcane cabbage turnip radish carrot potato yam taro peach plum cherry apricot pear apple quince persimmon pomegranate fig date olive walnut chestnut acorn almond coconut lemon orange citron banana mango thistle nettle bramble thorn dandelion clover daisy violet iris tulip sunflower wisteria magnolia camellia bean-sprout seaweed kelp algae resin sap bark root seed pollen nectar'.split(' '),
    minerals: 'iron copper tin lead zinc silver gold platinum mercury steel bronze brass jade amber pearl coral ivory obsidian flint quartz crystal diamond ruby sapphire emerald topaz opal agate jasper onyx amethyst garnet turquoise lapis malachite salt sulfur saltpeter alum cinnabar realgar orpiment graphite coal charcoal ash lime chalk marble granite basalt limestone sandstone clay mud sand gravel pebble boulder magnet lodestone meteorite pyrite mica talc gypsum borax nickel cobalt tungsten titanium glass porcelain ceramic brick cement'.split(' '),
    weather: 'rain drizzle storm thunder lightning hail sleet snow blizzard frost dew mist fog haze cloud rainbow wind breeze gale typhoon tornado whirlwind drought flood tide monsoon heat-wave cold-snap aurora eclipse twilight dawn dusk midnight noon sunrise sunset moonrise starlight sunbeam shade shadow glare glow ember spark flame smoke steam vapor ice icicle avalanche landslide earthquake tremor eruption lava'.split(' '),
    body: 'heart liver lung kidney spleen stomach gut bowel bladder brain skull spine rib hip knee elbow wrist ankle heel toe finger thumb palm fist nail hair beard eyebrow eyelash eye pupil tongue tooth jaw lip nose ear throat neck shoulder chest belly navel skin muscle sinew tendon bone marrow blood vein artery pulse breath sweat tear saliva bile fat scar womb tail horn fang claw feather scale wing hoof shell'.split(' '),
    emotions: 'joy sorrow grief anger rage fury fear dread terror panic shame guilt pride envy jealousy greed lust desire longing nostalgia hope despair doubt trust suspicion loyalty betrayal gratitude resentment spite contempt pity compassion mercy love hatred loneliness boredom curiosity wonder awe calm serenity anxiety worry relief regret remorse confusion courage cowardice patience impatience'.split(' '),
    crafts: 'weaving spinning dyeing embroidery knitting sewing pottery glazing forging smelting casting carving whittling carpentry masonry thatching tanning brewing distilling baking cooking pickling fishing hunting trapping farming grafting beekeeping shepherding painting calligraphy printing bookbinding papermaking inlay lacquer gilding engraving minting clockwork locksmithing rope-making basketry weaponsmithing archery fletching saddlery shipbuilding navigation cartography surveying mining quarrying glassblowing candle-making soap-making perfumery tea-making'.split(' '),
    time: 'second minute hour day night week fortnight month season spring summer autumn winter year decade century generation era epoch dawn-hour midday evening harvest solstice equinox leap-day new-moon full-moon yesterday tomorrow instant moment eternity delay hurry'.split(' '),
};
export const treasureNames = () => readFileSync(join(root, `${DIR}ri_treasures.jsonl`), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l).note.split('. ')[0]).filter(n => n && n.length < 60);

// ---- the prompt and schema, frozen ----
export const SYSTEM = [
    'You invent Gu for a Reverend Insanity-style world: living worms with one narrow ability, each bound to a Dao path and a rank (1 to 9), refined for a purpose.',
    'The user message names concept words. For each concept invent exactly one Gu that a Gu master of that world could plausibly refine and use, following the trend of the catalogue you were given:',
    'names read "<Concept words> Gu"; a Gu keeps to one path; rank follows how strong and rare the thing is (common creatures and plain materials sit low, abstract or large-scale concepts high);',
    'the effect is one narrow change, written as an effect sentence. Do not copy a catalogue Gu or reuse its name; a concept the catalogue already covers still gets a different angle.',
    'Effect sentence parts: verb, object, target, time, optional carrier cost (essence-primeval, essence-immortal or mental). If the effect needs something outside the objects given, set `needs` to a short slug naming it and give the nearest verb and object.',
    'Reply with JSON only.'].join(' ');
export const schemaOf = paths => ({type: 'object', properties: {gu: {type: 'array', items: {type: 'object', properties: {
    concept: {type: 'string'}, name: {type: 'string'}, path: {type: 'string', enum: paths}, rank: {type: 'integer', minimum: 1, maximum: 9},
    verb: {type: 'string', enum: [...EFFECT_VERBS]}, object: {type: 'string', enum: Object.keys(EFFECT_OBJECTS)},
    target: {type: 'string', enum: [...EFFECT_TARGETS]}, time: {type: 'string', enum: [...EFFECT_TIMES]},
    cost: {type: 'string', enum: ['essence-primeval', 'essence-immortal', 'mental']}, needs: {type: ['string', 'null']},
    effect: {type: 'string'}}, required: ['concept', 'name', 'path', 'rank', 'verb', 'object', 'target', 'time', 'cost', 'needs', 'effect'], additionalProperties: false}}},
    required: ['gu'], additionalProperties: false});
export const questionOf = concepts => `Concepts (${concepts.length}):\n${concepts.map(c => `- ${c}`).join('\n')}\n\nReturn {"gu": [...]} with one Gu per concept, in order. \`effect\` is one plain sentence of at most 20 words.`;
export const PER_REQUEST = 20;

// ---- paid passes ----
// `run --pilot-sync` warms with one request, then 10 by --sync; `run --pilot-batch` submits requests 1-10 by batch (PWC33);
// `run --full [--sync]` sends every request not already answered by the pilots. All through label_runner.mjs (AU16).
async function run(argv) {
    const {runPass} = await import('./label_runner.mjs');
    mkdirSync(join(root, WORK), {recursive: true});
    const frozen = rd(FROZEN), all = items(frozen), dir = join(root, WORK) + '/';
    const model = argv.includes('--model') ? argv[argv.indexOf('--model') + 1] : frozen.model;
    argv = argv.filter((a, i) => a !== '--model' && argv[i - 1] !== '--model');
    const pass = (name, list) => ({name, dir, system: frozen.system, schema: /^claude/.test(model) ? JSON.parse(JSON.stringify(frozen.schema, (k, v) => k === 'minimum' || k === 'maximum' ? undefined : v)) : frozen.schema, items: list, model, effort: 'low', maxTokens: 8000, maxUsd: 1.5, reuse: true});
    const mk = list => list.map(({concepts, ...rest}) => rest);
    if (argv.includes('--pilot-sync')) { await runPass(pass('gu_pilot_warm', mk(all.slice(0, 1))), ['--sync']); await runPass(pass('gu_pilot_sync', mk(all.slice(1, 11))), ['--sync']); }
    else if (argv.includes('--pilot-batch')) await runPass(pass('gu_pilot_batch', mk(all.slice(1, 11))), argv.filter(a => a !== '--pilot-batch'));
    else if (argv.includes('--full')) await runPass(pass(`gu_full_${argv.includes('--sync') ? 'sync' : 'batch'}`, mk(all.slice(11))), argv.filter(a => a !== '--full'));
    else console.log('usage: run --pilot-sync | --pilot-batch [--wait] | --full [--sync] [--wait]');
}

// ---- replies ----
export function replies(model = 'luna') {
    model = /^claude|haiku/.test(model) ? 'haiku' : 'luna';
    const out = {};
    for (const f of ['gu_pilot_warm', 'gu_pilot_sync', 'gu_pilot_batch', 'gu_full_batch', 'gu_full_sync'].map(n => `${n}_${model}`)) {
        const p = join(root, WORK, `${f}.json`);
        if (existsSync(p)) Object.assign(out, JSON.parse(readFileSync(p, 'utf8')));
    }
    const frozen = rd(FROZEN), byId = Object.fromEntries(items(frozen).map(i => [i.id, i]));
    const gu = [];
    for (const [id, r] of Object.entries(out)) for (const g of r.reply?.gu ?? []) gu.push({...g, request: id, held: frozen.scoreSet.some(x => x.concept === g.concept)});
    return {gu, answered: Object.values(out).filter(r => r.reply).length, requests: Object.keys(byId).length};
}
const modal = list => { const c = new Map(); for (const x of list) if (x != null) c.set(x, (c.get(x) ?? 0) + 1); return [...c].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null; };
const pct = (a, b) => b ? Math.round(a / b * 1000) / 10 : null;
const share = (list, key) => { const c = {}; for (const x of list) { const k = key(x); if (k != null) c[k] = (c[k] ?? 0) + 1; } const n = Object.values(c).reduce((a, b) => a + b, 0); return Object.fromEntries(Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, pct(v, n)])); };

// ---- PWC31 score ----
function score() {
    const model = process.argv.includes('--model') ? process.argv[process.argv.indexOf('--model') + 1] : 'luna';
    const frozen = rd(FROZEN), {gu} = replies(model), train = canonRows().filter(r => !r.held);
    const globalPath = modal(train.map(r => r.path)), globalBand = modal(train.map(r => bandOf(r.rank))), globalFn = modal(train.map(r => r.fn));
    const verbOf = fn => GU_FUNCTION[fn]?.verb ?? null;
    const gen = new Map(gu.map(g => [g.concept, g]));
    // --both: only concepts both models answered, so the two scores compare like with like (AU17).
    const both = process.argv.includes('--both') ? new Set(replies('luna').gu.map(g => g.concept).filter(c => new Set(replies('haiku').gu.map(g => g.concept)).has(c))) : null;
    const tally = () => ({n: 0, gen: 0, base: 0});
    const T = {path: tally(), band: tally(), verb: tally(), verbEvidence: tally(), verbByBasis: {}};
    let scored = 0;
    for (const s of frozen.scoreSet) {
        const g = gen.get(s.concept); if (!g || (both && !both.has(s.concept))) continue; scored++;
        const hits = tokens(s.concept), near = train.filter(r => hits.some(t => tokens(r.name).includes(t)));
        const pick = (key, fallback) => modal(near.map(key)) ?? fallback;
        if (s.path) { T.path.n++; T.path.gen += g.path === s.path; T.path.base += pick(r => r.path, globalPath) === s.path; }
        if (s.band) { T.band.n++; T.band.gen += bandOf(g.rank) === s.band; T.band.base += pick(r => bandOf(r.rank), globalBand) === s.band; }
        if (s.fn && verbOf(s.fn)) {
            const hit = g.verb === verbOf(s.fn), base = verbOf(pick(r => r.fn, globalFn)) === verbOf(s.fn);
            T.verb.n++; T.verb.gen += hit; T.verb.base += base;
            const b = (T.verbByBasis[s.fnBasis] ??= tally()); b.n++; b.gen += hit; b.base += base;
            if (s.fnBasis !== 'name-keyword-inference') { T.verbEvidence.n++; T.verbEvidence.gen += hit; T.verbEvidence.base += base; }
        }
    }
    const view = t => ({n: t.n, generator: pct(t.gen, t.n), baseline: pct(t.base, t.n)});
    const pool = gu.filter(g => !g.held);
    const result = {scoredOf: `${scored} of ${frozen.scoreSet.length}`, path: view(T.path), band: view(T.band), verb: view(T.verb), verbExcludingNameKeyword: view(T.verbEvidence),
        verbByBasis: Object.fromEntries(Object.entries(T.verbByBasis).map(([k, v]) => [k, view(v)])), ships: T.path.gen > T.path.base,
        shares: {poolSize: pool.length, canonPath: share(train, r => r.path), poolPath: share(pool, g => g.path), canonBand: share(train, r => bandOf(r.rank)), poolBand: share(pool, g => bandOf(g.rank)),
            poolVerb: share(pool, g => g.verb)}};
    mkdirSync(join(root, WORK), {recursive: true});
    writeFileSync(join(root, `${DIR}gu_generated_score${/^claude|haiku/.test(model) ? '_haiku' : ''}${process.argv.includes('--both') ? '_paired' : ''}.json`), JSON.stringify(result, null, 1) + '\n');
    console.log(JSON.stringify(result, null, 1));
}

// ---- PWC32 filter and ledger ----
const slug = t => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
// The generated Gu each concept resolves to (AU17 model pick) with its nearest canon Gu by name overlap. Shared by the ledger and by
// scripts/gu_sameness.mjs, which judges the near-name pairs by meaning (PWC47).
export function screened() {
    const frozen = rd(FROZEN), canon = canonRows();
    // AU17: Luna and Haiku tied on the held-out score, so each concept goes to the model its hash picks (even to Haiku, odd to Luna),
    // falling back to the other when the preferred one gave no usable answer; every row records its model.
    const byModel = {luna: new Map(replies('luna').gu.map(g => [g.concept, g])), haiku: new Map(replies('haiku').gu.map(g => [g.concept, g]))};
    const gu = frozen.concepts.flatMap(({concept}) => {
        const first = parseInt(sha(concept).slice(0, 2), 16) % 2 === 0 ? 'haiku' : 'luna', second = first === 'haiku' ? 'luna' : 'haiku';
        const g = byModel[first].get(concept) ?? byModel[second].get(concept), m = byModel[first].has(concept) ? first : second;
        return g ? [{...g, held: false, model: m === 'haiku' ? 'claude-haiku-5-5' : 'gpt-6-luna'}] : [];
    }), promptHash = sha(frozen.system + frozen.hashes.schema + frozen.hashes.prefix).slice(0, 12);
    const canonStems = new Map(canon.map(r => [stemOf(r.name), r]));
    const canonToks = canon.map(r => ({r, t: new Set(tokens(r.name))}));
    const jac = (a, b) => { const i = [...a].filter(x => b.has(x)).length; return i / (a.size + b.size - i || 1); };
    const list = gu.filter(x => !x.held).map(g => {
        const stem = stemOf(g.name), toks = new Set([...tokens(g.name)]);
        let best = null, bestJ = -1;
        for (const c of canonToks) { const j = jac(toks, c.t); if (j > bestJ) { bestJ = j; best = c.r; } }
        const same = stem ? canonStems.get(stem) : null;
        const sameFn = !!(best && best.fn && GU_FUNCTION[best.fn]?.verb === g.verb && best.path === g.path);
        return {g, stem, best, bestJ, same, sameFn};
    });
    return {frozen, canon, gu, promptHash, list};
}
// PWC47: the sameness verdicts by meaning (scripts/gu_sameness.mjs), keyed by generated name. A verdict replaces the name-overlap
// guess for the pairs it covers; a pair with no verdict keeps the old rule, so a rerun without new judging gives the same ledger.
export const SAMENESS = `${DIR}gu_sameness.json`;
function ledger() {
    const {frozen, canon, gu, promptHash, list} = screened();
    const verdicts = existsSync(join(root, SAMENESS)) ? rd(SAMENESS).verdicts : {};
    // PWC49: a generated Gu takes its rank from the family-median rule (derive_gu_ranks.mjs); the model's own rank stays as a note.
    const ranker = generatedRanker();
    const rows = [], dropped = [], seen = new Set();
    for (const {g, stem, best, bestJ, same, sameFn} of list) {
        const v = verdicts[g.name]?.nearest === best?.id ? verdicts[g.name] : null;
        let variantOf = null;
        if (same) { dropped.push({name: g.name, why: 'alias', of: same.name}); continue; }
        if (v) {
            if (v.verdict === 'copy') { dropped.push({name: g.name, why: 'copy-by-meaning', of: best.name}); continue; }
            if (v.verdict === 'variant_of') variantOf = best.id;
        } else if (bestJ >= 0.5 && sameFn) { dropped.push({name: g.name, why: 'near-duplicate', of: best.name}); continue; }
        if (stem && seen.has(stem)) { dropped.push({name: g.name, why: 'duplicate-generated'}); continue; }
        if (stem) seen.add(stem);
        const parts = {verb: g.verb, object: g.object, target: g.target, time: g.time, carrier: 'gu', cost: g.cost, limits: []};
        const built = assembleEffect(guEffects, parts);
        let state = 'runs-derived', blockedBy = null, needsInput = null;
        if (!built.ok) blockedBy = `grammar-${slug(built.receipt.violations[0]?.rule ?? built.receipt.violations[0]?.kind ?? 'invalid')}`;
        else if (g.needs) { blockedBy = 'needs-material'; needsInput = g.needs; }
        else if (built.value.derived.needs?.length) blockedBy = `key-${slug(built.value.derived.needs[0])}`;
        if (blockedBy) state = `blocked:${blockedBy}`;
        const owner = OBJECT_OWNER[g.object] ?? 'W';
        const rk = ranker({path: g.path, modelRank: g.rank});
        rows.push({id: `gen.${slug(g.name)}`, source: `generated: concept "${g.concept}"; ${g.model}; prompt ${promptHash}`, state, mechanisms: ['G', owner],
            test: state === 'runs-derived' ? 'tests/gu_generated.test.js' : null,
            note: `${g.name}. Path ${g.path}, rank ${rk.rank}, ${g.verb} ${g.object} on ${g.target}, ${g.time}, pays ${g.cost}. ${g.effect} Nearest canon Gu: ${best?.name ?? 'none'} (name overlap ${Math.round(bestJ * 100) / 100}). Generated, not canon.`,
            ...(state === 'runs-derived' ? {derived: {rule: 'gu.generated.concept', inputs: [g.concept, promptHash], confidence: confidenceOf('gu.generated.concept')}} : {}),
            tier: 'generated', model: g.model, concept: g.concept, promptHash, nearest: best?.id ?? null,
            ...(needsInput ? {needs: String(needsInput).toLowerCase()} : {}),
            ...(variantOf ? {variant_of: variantOf} : {}), rank: rk.rank, rankBasis: rk.basis, modelRank: g.rank});
    }
    rows.sort((a, b) => a.id.localeCompare(b.id));
    const ids = new Set(); for (const r of rows) { let id = r.id, n = 2; while (ids.has(id)) id = `${r.id}-${n++}`; r.id = id; ids.add(id); }
    writeFileSync(join(root, LEDGER), rows.map(r => JSON.stringify(demoteTypedRuns(r))).join('\n') + '\n');
    writeFileSync(join(root, WORK, 'gu_generated_dropped.json'), JSON.stringify(dropped));
    const states = {}; for (const r of rows) { const k = r.state; states[k] = (states[k] ?? 0) + 1; }
    console.log(JSON.stringify({generated: gu.filter(x => !x.held).length, kept: rows.length, dropped: dropped.length, dropReasons: share(dropped, d => d.why), states}));
}

// ---- freeze ----
function freeze() {
    const rows = canonRows();
    const train = rows.filter(r => !r.held), held = rows.filter(r => r.held);
    const paths = [...new Set(rows.map(r => r.path).filter(Boolean)), 'none'].sort();
    const header = 'Canon Gu catalogue (name | path | rank | effect; rank suffix d = derived, ? = unknown; effect is verb + object in the effect grammar, - = unknown). Held-out Gu are not listed.';
    const prefix = [header, ...train.sort((a, b) => a.name.localeCompare(b.name)).map(line)].join('\n');
    const trainStems = new Set(train.map(r => stemOf(r.name)).filter(Boolean)), heldStems = new Set(held.map(r => stemOf(r.name)));
    const allStems = new Set(rows.map(r => stemOf(r.name)));
    // Score set: held-out canon Gu whose stem is one or two words, concept = the stem, answer = its own labels.
    const score = held.filter(r => { const s = stemOf(r.name); return s && s.split(' ').length <= 2 && !trainStems.has(s) && (r.path || r.fn); })
        .map(r => ({concept: stemOf(r.name), id: r.id, name: r.name, path: r.path, rank: r.rank, band: bandOf(r.rank), rankBasis: r.rankBasis, fn: r.fn, fnBasis: r.fnBasis}));
    const scoreWords = new Set(score.map(s => s.concept));
    const seen = new Set(), concepts = [];
    const add = (word, source) => { const w = word.toLowerCase().replace(/-/g, ' ').trim(); if (!w || seen.has(w) || allStems.has(w) || heldStems.has(w) || scoreWords.has(w)) return; seen.add(w); concepts.push({concept: w, source}); };
    for (const r of train) for (const t of tokens(r.name)) add(t, 'name-word');
    for (const n of treasureNames()) add(n, 'ri_treasures');
    for (const [cat, words] of Object.entries(CATEGORIES)) for (const w of words) add(w, `category:${cat}`);
    // Deterministic order: by hash, so the first requests are a mix of sources.
    concepts.sort((a, b) => sha(a.concept).localeCompare(sha(b.concept)));
    score.sort((a, b) => sha(a.id).localeCompare(sha(b.id)));
    const schema = schemaOf(paths);
    const frozen = {frozen: '2026-11-17', proposal: 'PWC30-PWC34', splitRule: SPLIT_RULE, perRequest: PER_REQUEST, model: 'gpt-6-luna',
        counts: {canon: rows.length, train: train.length, heldOut: held.length, scoreSet: score.length, concepts: concepts.length},
        hashes: {prefix: sha(prefix), system: sha(SYSTEM), schema: sha(JSON.stringify(schema)), concepts: sha(JSON.stringify(concepts)), score: sha(JSON.stringify(score))},
        scoring: {bands: 'low 1-3, mid 4-5, high 6-9', baseline: 'most common path (and band, and function) among training canon Gu whose name contains the concept word; the global modal one when none does',
            verb: 'a canon row has no grammar verb, so its function family reads through GU_FUNCTION to a verb; match = same verb; reported split by function basis, and name-keyword-inference rows do not count as evidence (the keyword table can leak the answer)',
            ship: 'generator path agreement must beat the word baseline on the held-out set, or the full run does not ship (PWC31)'},
        system: SYSTEM, paths, schema, scoreSet: score, concepts};
    writeFileSync(join(root, PREFIX), prefix + '\n');
    writeFileSync(join(root, FROZEN), JSON.stringify(frozen, null, 1) + '\n');
    console.log(JSON.stringify({...frozen.counts, prefixChars: prefix.length, prefixTokensEst: Math.round(prefix.length / 3.6), hashes: frozen.hashes}));
}

// ---- items for the runner ----
export function items(frozen = rd(FROZEN), prefix = readFileSync(join(root, PREFIX), 'utf8').trimEnd()) {
    const all = [...frozen.scoreSet.map(s => ({concept: s.concept, held: true})), ...frozen.concepts.map(c => ({concept: c.concept, held: false}))];
    const out = [];
    for (let i = 0; i < all.length; i += PER_REQUEST) {
        const group = all.slice(i, i + PER_REQUEST);
        out.push({id: `req${String(i / PER_REQUEST).padStart(3, '0')}`, shared: prefix, user: questionOf(group.map(g => g.concept)), concepts: group.map(g => g.concept)});
    }
    return out;
}

const mode = process.argv[2];
if (import.meta.url === `file://${process.argv[1]}`) {
    if (mode === 'freeze') freeze();
    else if (mode === 'run') await run(process.argv.slice(3));
    else if (mode === 'score') score();
    else if (mode === 'ledger') ledger();
    else console.log('usage: freeze | run | score | ledger');
}
