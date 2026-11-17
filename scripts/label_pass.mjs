#!/usr/bin/env node
// Luna label passes (docs/research/advancement-aspects-2026-11-16): reads private/<pass>_packets.json from
// scripts/label_pass_packets.py, asks GPT-6 Luna at low effort for one strict-schema row per packet, and
// writes private/<pass>_luna.json (resumable: finished ids are skipped). Values are paraphrases with the
// packet's own locators; empty strings mean the evidence does not say. Runs through scripts/label_runner.mjs (AU16):
// batch by default with the fixed text as the cached prefix; --sync for a quick pilot, --dry for the estimate.
// Usage:
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   node scripts/label_pass.mjs ri_moves gu_kinds hp_potions [--sync|--dry|--wait] [--max-usd N]
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {runPass} from './label_runner.mjs';

// LABEL_PRIVATE points a worktree without the gitignored folder at the primary checkout's private folder.
const dir = process.env.LABEL_PRIVATE ? `${process.env.LABEL_PRIVATE.replace(/\/$/, '')}/` : new URL('../docs/research/advancement-aspects-2026-11-16/private/', import.meta.url).pathname;
export const RATE = {in: 0.10, out: 0.50}; // per million, standard; batch is half (BATCH_READING_WORKFLOW.md)

export const SPEAKER = {type: 'string', enum: ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown']};
const field = {type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'],
    properties: {value: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER}};
const obj = (props, extra = {}) => ({type: 'object', additionalProperties: false, required: Object.keys({...props, ...extra}),
    properties: {...Object.fromEntries(Object.keys(props).map(k => [k, field])), ...extra}});
// Hogwarts ingredient vocabulary (proposal, AD32): one world property set (MR37). The first five effect axes are the
// book-one sheet (docs/audits/WORLD_POTION_AXES_2026-11-09.md 1.2); the rest follow the potion ledger's families.
// Roles are the functions the owner code already authors (water, mucus, hairs, bone meal, quills, egg and rose).
export const HP_INGREDIENT_AXES = {mend: 'heals or repairs the body', calm: 'soothes, slows or brings sleep', bite: 'a sharp irritant, stinging or corrosive',
    venom: 'poisons or harms the body', ward: 'counters poison or protects', form: 'changes body shape, size, hair or appearance',
    mind: 'changes feeling, mood, love, belief, wits or will', memory: 'changes or removes memory', luck: 'changes luck or chance',
    heat: 'warms, burns or resists fire and cold', 'conceal-or-sense': 'hides, reveals, detects or sharpens sight', vigour: 'energises, strengthens or restores stamina'};
export const HP_INGREDIENT_ROLES = {carrier: 'the base or solvent others go into', thickener: 'thickens or binds the mixture', fixative: 'fixes or prolongs another effect',
    identity: 'a sample that ties the potion to one person or creature', abrasive: 'a grit that scours or grinds', 'heat-reactive': 'reacts dangerously with heat or the wrong timing'};
export const HP_INGREDIENT_KINDS = ['plant', 'fungus', 'creature-part', 'whole-creature', 'mineral-or-metal', 'liquid', 'prepared-substance',
    'human-or-being-part', 'potion', 'person', 'place', 'concept', 'other'];
const list = props => ({type: 'array', items: {type: 'object', additionalProperties: false, required: [...Object.keys(props), 'locator', 'speaker'],
    properties: {...props, locator: {type: 'string'}, speaker: SPEAKER}}});

export const RULES = `Use only the evidence lines given. Each line starts with its locator in square brackets; copy that bracket's content exactly into "locator". Write values as short paraphrases in your own words, never quotations. If the evidence does not state something, set value and locator to "" and speaker to "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: narrator, a character's claim (which may be wrong), a demonstration (shown happening), or the wiki.`;

const ingredient = {type: 'array', items: {type: 'object', additionalProperties: false, required: ['name', 'locator', 'speaker', 'cite'],
    properties: {name: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER, cite: {type: 'string'}}}};
export const LOTM_ASPECTS = ['do', 'settle', 'go_wrong', 'change', 'who_may', 'where_from', 'how_long', 'others_notice', 'left_behind',
    'who_controls', 'mind', 'can_be_false', 'combines'];

export const PASSES = {
    lotm_potions: {
        subject: p => `${p.pathway} Pathway Sequence ${p.seq}: ${p.wikiName}`,
        schema: obj(Object.fromEntries(LOTM_ASPECTS.map(a => [a, 1])), {mains: ingredient, aux: ingredient}),
        ask: `Fill the advancement sheet for the Lord of the Mysteries potion named in the message (its pathway, Sequence number and name).
mains: the main ingredients of THIS Sequence's potion formula; aux: its supplementary ingredients. List an ingredient only when the evidence ties it to this Sequence's potion (not another Sequence's, not a ritual material, not an artifact). For each, "name" is the ingredient's name as the evidence gives it (when a line shows [ingr:Name], use that Name), and "cite" is the book citation in that line such as "B1 ch845", or "" if none. Empty lists are correct when no ingredient is tied to this Sequence.
do: the advancement ritual. settle: the acting method or how the potion is digested. go_wrong: backlash or loss of control. change: abilities gained. who_may: prerequisites. where_from: where the formula or ingredients came from. how_long: digestion, brewing or waiting time. others_notice: what others can sense. left_behind: what remains after death. who_controls: who holds the formula. mind: effects on personality. can_be_false: false or incomplete formulas. combines: interactions with other pathways or items.`,
    },
    ri_moves: {
        subject: p => p.move,
        schema: obj({cost: 1, conditions: 1, effect: 1, counters: 1, path: 1, rank: 1}, {components: {type: 'array', items: {
            type: 'object', additionalProperties: false, required: ['gu', 'role', 'locator', 'speaker'],
            properties: {gu: {type: 'string'}, role: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER}}}}),
        ask: `Describe the Reverend Insanity killer move named in the message. components: each Gu the evidence names as part of this move (the Gu's name only, ending in "Gu"; never a person, place or count) and its role (core, support, or what it does). cost: essence or other price to use it. conditions: what activating it needs. effect: what it does. counters: what stops it. path and rank: the move's dao path and rank if stated.
An empty components list is correct when no component Gu is named.`,
    },
    gu_kinds: {
        subject: p => p.name,
        schema: obj({rank: 1, path: 1, kind: 1, food: 1, feeding_interval: 1, starving: 1, effect: 1, activation_cost: 1, refinement: 1}),
        ask: `Describe the Reverend Insanity Gu named in the message. rank: its rank (1 to 9) as a number if stated. path: its dao path. kind: mortal or Immortal, and any type (offensive, defensive, movement, investigative, healing, support...). food: what it eats. feeding_interval: how often it must be fed. starving: what happens if it is not fed. effect: what it does when activated. activation_cost: essence or other cost. refinement: how it is refined or what it is refined from.`,
    },
    hp_potions: {
        subject: p => p.name,
        schema: obj({effect: 1, route: 1, target: 1, ingredients: 1, brewing: 1, onset_and_duration: 1, side_effects: 1, antidote: 1, appearance: 1, users: 1}),
        ask: `Describe the Harry Potter preparation named in the message. effect: what it does. route: how it is taken or used (drunk, eaten, applied to skin or hair or a wound, inhaled, sprayed, poured on an object...). target: who or what receives it (the user, another person, a creature, a plant, an object). ingredients. brewing: steps, equipment or brewing time. onset_and_duration: how fast it acts and how long it lasts. side_effects. antidote. appearance: colour, smell, texture. users: who is shown making or using it.`,
    },
    hp_ingredients: {
        subject: p => p.name,
        schema: {type: 'object', additionalProperties: false, required: ['kind', 'source', 'axes', 'roles', 'potions', 'preparation', 'hazards', 'direct_effect'],
            properties: {kind: {...field, properties: {...field.properties, value: {type: 'string', enum: HP_INGREDIENT_KINDS}}},
                source: field, hazards: field, direct_effect: field,
                axes: list({axis: {type: 'string', enum: Object.keys(HP_INGREDIENT_AXES)}, level: {type: 'string', enum: ['trace', 'some', 'strong']}}),
                roles: list({role: {type: 'string', enum: Object.keys(HP_INGREDIENT_ROLES)}}),
                potions: list({potion: {type: 'string'}}), preparation: list({form: {type: 'string'}})}},
        ask: `Describe the Harry Potter potion ingredient named in the message as a material.
kind: one of ${HP_INGREDIENT_KINDS.join(', ')} (potion, person, place or concept when the page is not about a material).
source: the creature, plant or place it comes from, in a few words.
axes: properties the evidence says this ingredient itself has or gives a brew. Choose only from: ${Object.entries(HP_INGREDIENT_AXES).map(([k, v]) => `${k} (${v})`).join('; ')}. level: strong when it is what the ingredient is known for, some for one of its uses, trace for a minor one. Do not add an axis only because a potion that uses it has that effect; list the potion instead.
roles: functions it serves in a brew, only if stated: ${Object.entries(HP_INGREDIENT_ROLES).map(([k, v]) => `${k} (${v})`).join('; ')}.
potions: each potion or preparation the evidence says uses it, by name.
preparation: each form it is prepared in before or as it goes in, one or two words each (sliced, crushed, powdered, dried, stewed, shredded, juiced, chopped, pickled, whole...).
hazards: harm it can do to the brewer or user, or care it needs in handling.
direct_effect: what it does on its own (eaten, drunk, touched or worn) without brewing.
Empty arrays are correct when nothing is stated.`,
    },
};

export async function luna(prompt, schema) {
    for (let attempt = 0; ; attempt++) {
        const res = await fetch('https://api.openai.com/v1/responses', {method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}`},
            body: JSON.stringify({model: 'gpt-6-luna', reasoning: {effort: 'low'}, max_output_tokens: 16000,
                input: [{role: 'user', content: [{type: 'input_text', text: prompt}]}],
                text: {format: {type: 'json_schema', name: 'row', schema, strict: true}}})});
        const body = await res.json();
        if ((res.status === 429 || res.status >= 500) && attempt < 4) { await new Promise(r => setTimeout(r, 2000 * 2 ** attempt)); continue; }
        if (!res.ok) throw Error(`${res.status}: ${JSON.stringify(body.error ?? body).slice(0, 200)}`);
        const text = (body.output ?? []).flatMap(o => o.content ?? []).filter(c => c.type === 'output_text').map(c => c.text).join('');
        return {reply: JSON.parse(text), usage: {in: body.usage?.input_tokens ?? 0, out: body.usage?.output_tokens ?? 0}};
    }
}

// AU16 layout, most shared first: one header common to every pass (the rules), then the packet's evidence (identical for
// every pass that reads this packet, so passes sent together share it from cache), then this pass's question and subject.
export const COMMON = `You label source evidence for a game's coverage ledgers. Answer the question at the end about the evidence.\n${RULES}`;
export const passItems = (pass, packets) => packets.map(p => ({id: p.id, shared: `Evidence:\n${p.evidence.join('\n')}`,
    user: `${pass.ask}\n\nSubject: ${pass.subject(p)}`}));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2), names = argv.filter(a => PASSES[a]);
    for (const name of names) {
        const pass = PASSES[name];
        const packets = JSON.parse(readFileSync(`${dir}${name}_packets.json`, 'utf8'));
        await runPass({name, dir, system: COMMON, schema: pass.schema, items: passItems(pass, packets), model: 'gpt-6-luna', effort: 'low', maxTokens: 16000}, argv);
    }
}
