#!/usr/bin/env node
// Follow-up label passes on the wiki tier (docs/research/advancement-aspects-2026-11-16): four passes run at
// once over the private Luna rows and packets, each with something to score against.
//   gu_family    Luna maps a stated Gu effect to one of the ledger's effect families; examples come only from
//                rows outside the held-out split (GKM429), and the kind field is never shown, so the kinds
//                whose kind word names a family score it.
//   gu_diet      Luna proposes a mechanism diet default for each Gu (GKM440: what it eats follows its path and
//                what it does), with the stated food hidden; gu_food_stated sorts the 44 stated foods into the
//                same categories to score it.
//   move_check   Haiku, a second model, checks each component of the roles-unchecked move leads against the
//                lead's evidence: core, support, not part of the move, or unclear, and the order if stated.
//   lotm_check   Haiku checks each ingredient Luna tied to a Lord of the Mysteries Sequence (main, supplementary,
//                role unstated, not part of the formula, unclear) and lists ingredients Luna missed, for every row
//                whose packet names an ingredient or formula. Only "main" verdicts may fold (rule set before scoring).
//   hp_sentence  Luna writes one effect-grammar sentence per Hogwarts preparation from its wiki evidence,
//                with the four tuned evidence sentences as examples; the 17 held-out ones score it.
// Replies go to private/<pass>_followup.json (resumable). Prints usage and cost per pass.
// Usage:
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" \
//   node scripts/label_followups.mjs [pass ...]
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {RULES, SPEAKER, COMMON} from './label_pass.mjs';
import {runPass} from './label_runner.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';
import {HP_POTION_SENTENCES} from '../src/world_packs/brew_effects_pack.js';
import {potionFamily, HP_POTION_FAMILY_OVERRIDES} from './b_coverage_ledgers.mjs';
import {splitLabelled} from '../src/brew_heldout.js';

const root = new URL('..', import.meta.url).pathname;
const priv = process.env.LABEL_PRIVATE ? `${process.env.LABEL_PRIVATE.replace(/\/$/, '')}/` : `${root}docs/research/advancement-aspects-2026-11-16/private/`;
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const tier = json(`${root}docs/coverage/wiki_tier_labels.json`);
const replies = name => Object.fromEntries(Object.entries(json(`${priv}${name}_luna.json`)).filter(([, r]) => r.reply).map(([id, r]) => [id, r.reply]));
const packets = name => new Map(json(`${priv}${name}_packets.json`).map(p => [p.id, p]));
const str = {type: 'string'};
const object = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
const enumOf = values => ({type: 'string', enum: values});

export const FAMILIES = ['attack', 'guard', 'move', 'fly', 'sense', 'conceal', 'heal', 'amplify', 'strength', 'illuminate', 'steal'];
export const DIETS = ['plants', 'meat-or-blood', 'minerals-or-metal', 'primeval-stones-or-essence', 'liquor-or-prepared-food',
    'element-or-weather', 'emotion-thought-or-soul', 'other-gu-or-insects', 'other'];

const guRows = replies('gu_kinds');
const guPackets = packets('gu_kinds');
const nameOf = id => guPackets.get(id)?.name ?? id;

function guFamilyJobs() {
    const withEffect = Object.entries(guRows).filter(([, r]) => r.effect.value);
    const examples = [];
    for (const family of ['attack', 'guard', 'sense', 'heal', 'move']) {
        const pick = withEffect.filter(([id]) => tier.gu_kinds[id]?.function === family && !tier.gu_kinds[id].heldOut).sort(([a], [b]) => a.localeCompare(b))[0];
        if (pick) examples.push(pick);
    }
    const shown = new Set(examples.map(([id]) => id));
    const lines = examples.map(([id, r]) => `- ${nameOf(id)}: ${r.effect.value} -> ${tier.gu_kinds[id].function}`).join('\n');
    return {examples: [...shown], jobs: withEffect.filter(([id]) => !shown.has(id)).map(([id, r]) => ({id, schema: object({family: enumOf([...FAMILIES, 'none']), reason: str}),
        user: `Pick the one effect family that best names what this Reverend Insanity Gu does when activated. Families: attack (harms a target), guard (protects the user), move (moves the user over ground), fly, sense (finds or reads information), conceal (hides), heal, amplify (strengthens another Gu or move), strength (raises the user's own physical power), illuminate (makes light), steal (takes something from another). Answer "none" when the Gu stores, feeds, refines, binds, counts or does something none of these name; "none" is a correct answer, a stretch is wrong. reason: one short clause.
Examples:
${lines}

Gu: ${nameOf(id)}${r.path.value ? ` (path: ${r.path.value})` : ''}
Effect: ${r.effect.value}`}))};
}

function guDietJobs() {
    const dietSchema = object({category: enumOf(DIETS), food: str, reason: str, cost: str});
    const jobs = Object.entries(guRows).map(([id, r]) => ({id, schema: dietSchema,
        user: `Propose a default diet for the Reverend Insanity Gu "${nameOf(id)}" from how Gu work: a Gu eats a raw form of what it stores, makes or works with, its path's material (wood-path Gu eat plants, blood-path Gu blood), or a food that fits what it does. Primeval essence is what activating it costs, not its food. category: the kind of food. food: the default food in a few words. reason: one clause tying it to the path or effect. cost: how scarce or costly the food is to keep it fed, in a few words.
Path: ${r.path.value || 'not stated'}
Effect: ${r.effect.value || 'not stated'}
Refinement: ${r.refinement.value || 'not stated'}`}));
    const stated = Object.entries(guRows).filter(([, r]) => r.food.value).map(([id, r]) => ({id, schema: object({category: enumOf(DIETS)}),
        user: `Sort this stated food of a Reverend Insanity Gu into one category: ${DIETS.join(', ')}.\nFood: ${r.food.value}`}));
    return {jobs, stated};
}

function moveCheckJobs() {
    const moveRows = replies('ri_moves');
    const movePackets = packets('ri_moves');
    const check = object({components: {type: 'array', items: object({gu: str, verdict: enumOf(['core', 'support', 'not-part', 'unclear']),
        locator: str, speaker: SPEAKER})}, order: str, order_locator: str});
    return Object.entries(tier.gu_moves).filter(([, l]) => l.components?.length && l.components.every(c => c.kind)).map(([id]) => {
        const p = movePackets.get(id);
        const named = moveRows[id].components.map(c => c.gu.trim()).filter(g => /\bgu\.?$/i.test(g));
        return {id, schema: check, shared: evidenceOf(p), user: `A first reader listed these Gu as components of the Reverend Insanity killer move "${p.move}": ${named.join('; ')}.
Check each against the evidence. verdict: core (the move's central Gu), support (used in the move to help the core), not-part (named nearby but refined into it, a product of it, or used separately), or unclear (the evidence does not say). Keep the listed names exactly, one entry each. order: the activation order if the evidence states one, else "".`};
    });
}

const evidenceOf = p => `Evidence:\n${p.evidence.join('\n')}`;
const slug = t => t.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
export const hpSplit = () => splitLabelled(HP_POTION_SENTENCES.map(s => ({id: `hp.potion.${slug(s.title)}`, title: s.title,
    family: potionFamily(s.title), parts: s.parts})), {ruleSawTitles: Object.keys(HP_POTION_FAMILY_OVERRIDES)});
function hpSentenceJobs() {
    const {tuned} = hpSplit();
    const shown = new Set(tuned.map(r => r.id));
    const lines = tuned.map(r => `- ${r.title}: ${JSON.stringify(r.parts)}`).join('\n');
    const schema = object({verb: enumOf([...EFFECT_VERBS, 'none']), object: enumOf([...Object.keys(EFFECT_OBJECTS), 'none']),
        target: enumOf(EFFECT_TARGETS), time: enumOf(EFFECT_TIMES), carrier: enumOf(['potion', 'topical', 'spray', 'eaten']),
        limits: {type: 'array', items: enumOf(['dose', 'duration', 'donor-sample', 'blood-loss-remains', 'excess-harms', 'painful', 'counter-effect', 'mass'])},
        locator: str, speaker: SPEAKER});
    return [...packets('hp_potions').values()].filter(p => !shown.has(p.id)).map(p => ({id: p.id, schema, shared: evidenceOf(p),
        user: `Write the primary effect of the Harry Potter preparation "${p.name}" as one effect sentence. verb: ${EFFECT_VERBS.join(', ')}. object: what it acts on (${Object.keys(EFFECT_OBJECTS).join(', ')}). target: self (the one who takes it), touched (what it is applied to), bound, line, cone, area or marked. time: instant, sustained (while it is taken), lasting (for a while after), delayed or triggered. carrier: potion (drunk), topical, spray or eaten. limits: only those the evidence states. Side effects are not the primary effect. Use verb and object "none" when the evidence states no effect. locator and speaker: the line that states the effect.
Examples (verb, object, target, time, carrier, cost, limits):
${lines}`}));
}

export const LOTM_VERDICTS = ['main', 'supplementary', 'role-unstated', 'not-formula', 'unclear'];
function lotmCheckJobs() {
    const rows = replies('lotm_potions');
    const roleOf = enumOf(['main', 'supplementary', 'role-unstated']);
    const schema = object({ingredients: {type: 'array', items: object({name: str, verdict: enumOf(LOTM_VERDICTS), locator: str, speaker: SPEAKER})},
        missed: {type: 'array', items: object({name: str, role: roleOf, locator: str, speaker: SPEAKER})}});
    return [...packets('lotm_potions').values()].filter(p => p.evidence.slice(1).some(e => /ingredient|formula/i.test(e))
        || rows[p.id]?.mains.length || rows[p.id]?.aux.length).map(p => {
        const listed = [...rows[p.id].mains.map(m => m.name), ...rows[p.id].aux.map(m => m.name)];
        return {id: p.id, schema, shared: evidenceOf(p), user: `A first reader listed these as ingredients of the Lord of the Mysteries potion ${p.pathway} Pathway Sequence ${p.seq}: ${p.wikiName}: ${listed.length ? listed.join('; ') : '(none)'}.
Check each against the evidence. verdict: main (the evidence calls it a main ingredient of THIS Sequence's potion), supplementary (the evidence calls it supplementary or auxiliary), role-unstated (the evidence ties it to this potion's formula without saying main or supplementary), not-formula (a ritual material, a Beyonder characteristic used in place of the formula, another Sequence's ingredient, an artifact or not an ingredient at all), or unclear. Keep the listed names exactly, one entry each.
missed: ingredients the evidence ties to THIS Sequence's potion formula that the first reader did not list, with the role the evidence gives; an empty list is correct.`};
    });
}

// AU16: every pass goes through the shared runner, batch by default; replies keep the <pass>_followup.json name.
const LUNA = 'gpt-6-luna', HAIKU = 'claude-haiku-5-5';
const run = (name, jobs, model, argv) => runPass({name, dir: priv, suffix: 'followup', system: COMMON, model, effort: 'low',
    maxTokens: model === HAIKU ? 8000 : 16000, schema: jobs[0]?.schema ?? {type: 'object'}, items: jobs}, argv);

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const argv = process.argv.slice(2), want = new Set(argv.filter(a => !a.startsWith('--') && !/^\d/.test(a)));
    const on = name => !want.size || want.has(name);
    const family = guFamilyJobs(), diet = guDietJobs();
    const passes = [
        on('gu_family') && run('gu_family', family.jobs, LUNA, argv),
        on('gu_diet') && run('gu_diet', diet.jobs, LUNA, argv),
        on('gu_diet') && run('gu_food_stated', diet.stated, LUNA, argv),
        on('move_check') && run('move_check', moveCheckJobs(), HAIKU, argv),
        on('hp_sentence') && run('hp_sentence', hpSentenceJobs(), LUNA, argv),
        on('lotm_check') && run('lotm_check', lotmCheckJobs(), HAIKU, argv),
    ].filter(Boolean);
    await Promise.all(passes);
    console.log(JSON.stringify({familyExamples: family.examples}));
}
