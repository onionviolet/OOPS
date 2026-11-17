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
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES, lowerEffect} from '../src/effect_grammar.js';
import {guEffects, GU_FUNCTION} from '../src/world_packs/gu_effect_pack.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {typeFunction, nameFunction} from './gu_function_words.mjs';

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
    else if (mode !== 'run' && mode !== 'score' && mode !== 'ledger') console.log('usage: freeze | run | score | ledger');
}
export {guEffects, lowerEffect, mkdirSync};
