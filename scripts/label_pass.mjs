#!/usr/bin/env node
// Luna label passes (docs/research/advancement-aspects-2026-11-16): reads private/<pass>_packets.json from
// scripts/label_pass_packets.py, asks GPT-6 Luna at low effort for one strict-schema row per packet, and
// writes private/<pass>_luna.json (resumable: finished ids are skipped). Values are paraphrases with the
// packet's own locators; empty strings mean the evidence does not say. Synchronous calls, eight at a time.
// Usage:
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   node scripts/label_pass.mjs ri_moves gu_kinds hp_potions
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// LABEL_PRIVATE points a worktree without the gitignored folder at the primary checkout's private folder.
const dir = process.env.LABEL_PRIVATE ? `${process.env.LABEL_PRIVATE.replace(/\/$/, '')}/` : new URL('../docs/research/advancement-aspects-2026-11-16/private/', import.meta.url).pathname;
export const RATE = {in: 0.10, out: 0.50}; // per million, standard; batch is half (BATCH_READING_WORKFLOW.md)

export const SPEAKER = {type: 'string', enum: ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown']};
const field = {type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'],
    properties: {value: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER}};
const obj = (props, extra = {}) => ({type: 'object', additionalProperties: false, required: Object.keys({...props, ...extra}),
    properties: {...Object.fromEntries(Object.keys(props).map(k => [k, field])), ...extra}});

export const RULES = `Use only the evidence lines given. Each line starts with its locator in square brackets; copy that bracket's content exactly into "locator". Write values as short paraphrases in your own words, never quotations. If the evidence does not state something, set value and locator to "" and speaker to "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: narrator, a character's claim (which may be wrong), a demonstration (shown happening), or the wiki.`;

const ingredient = {type: 'array', items: {type: 'object', additionalProperties: false, required: ['name', 'locator', 'speaker', 'cite'],
    properties: {name: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER, cite: {type: 'string'}}}};
export const LOTM_ASPECTS = ['do', 'settle', 'go_wrong', 'change', 'who_may', 'where_from', 'how_long', 'others_notice', 'left_behind',
    'who_controls', 'mind', 'can_be_false', 'combines'];

const PASSES = {
    lotm_potions: {
        schema: obj(Object.fromEntries(LOTM_ASPECTS.map(a => [a, 1])), {mains: ingredient, aux: ingredient}),
        prompt: p => `Fill the advancement sheet for the Lord of the Mysteries potion ${p.pathway} Pathway Sequence ${p.seq}: ${p.wikiName}.
mains: the main ingredients of THIS Sequence's potion formula; aux: its supplementary ingredients. List an ingredient only when the evidence ties it to this Sequence's potion (not another Sequence's, not a ritual material, not an artifact). For each, "name" is the ingredient's name as the evidence gives it (when a line shows [ingr:Name], use that Name), and "cite" is the book citation in that line such as "B1 ch845", or "" if none. Empty lists are correct when no ingredient is tied to this Sequence.
do: the advancement ritual. settle: the acting method or how the potion is digested. go_wrong: backlash or loss of control. change: abilities gained. who_may: prerequisites. where_from: where the formula or ingredients came from. how_long: digestion, brewing or waiting time. others_notice: what others can sense. left_behind: what remains after death. who_controls: who holds the formula. mind: effects on personality. can_be_false: false or incomplete formulas. combines: interactions with other pathways or items.
${RULES}`,
    },
    ri_moves: {
        schema: obj({cost: 1, conditions: 1, effect: 1, counters: 1, path: 1, rank: 1}, {components: {type: 'array', items: {
            type: 'object', additionalProperties: false, required: ['gu', 'role', 'locator', 'speaker'],
            properties: {gu: {type: 'string'}, role: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER}}}}),
        prompt: p => `Describe the Reverend Insanity killer move "${p.move}". components: each Gu the evidence names as part of this move (the Gu's name only, ending in "Gu"; never a person, place or count) and its role (core, support, or what it does). cost: essence or other price to use it. conditions: what activating it needs. effect: what it does. counters: what stops it. path and rank: the move's dao path and rank if stated.
${RULES} An empty components list is correct when no component Gu is named.`,
    },
    gu_kinds: {
        schema: obj({rank: 1, path: 1, kind: 1, food: 1, feeding_interval: 1, starving: 1, effect: 1, activation_cost: 1, refinement: 1}),
        prompt: p => `Describe the Reverend Insanity Gu "${p.name}". rank: its rank (1 to 9) as a number if stated. path: its dao path. kind: mortal or Immortal, and any type (offensive, defensive, movement, investigative, healing, support...). food: what it eats. feeding_interval: how often it must be fed. starving: what happens if it is not fed. effect: what it does when activated. activation_cost: essence or other cost. refinement: how it is refined or what it is refined from.
${RULES}`,
    },
    hp_potions: {
        schema: obj({effect: 1, route: 1, target: 1, ingredients: 1, brewing: 1, onset_and_duration: 1, side_effects: 1, antidote: 1, appearance: 1, users: 1}),
        prompt: p => `Describe the Harry Potter preparation "${p.name}". effect: what it does. route: how it is taken or used (drunk, eaten, applied to skin or hair or a wound, inhaled, sprayed, poured on an object...). target: who or what receives it (the user, another person, a creature, a plant, an object). ingredients. brewing: steps, equipment or brewing time. onset_and_duration: how fast it acts and how long it lasts. side_effects. antidote. appearance: colour, smell, texture. users: who is shown making or using it.
${RULES}`,
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

if (process.argv[1] === fileURLToPath(import.meta.url)) for (const name of process.argv.slice(2)) {
    const pass = PASSES[name];
    const packets = JSON.parse(readFileSync(`${dir}${name}_packets.json`, 'utf8'));
    const file = `${dir}${name}_luna.json`;
    const done = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
    const queue = packets.filter(p => !done[p.id]?.reply);
    for (let i = 0; i < queue.length; i += 8) {
        await Promise.all(queue.slice(i, i + 8).map(async p => {
            const prompt = `${pass.prompt(p)}\n\nEvidence:\n${p.evidence.join('\n')}`;
            try { done[p.id] = await luna(prompt, pass.schema); } catch (e) { done[p.id] = {error: String(e.message ?? e)}; }
        }));
        writeFileSync(file, JSON.stringify(done));
    }
    const ok = Object.values(done).filter(r => r.reply);
    const tin = ok.reduce((s, r) => s + r.usage.in, 0), tout = ok.reduce((s, r) => s + r.usage.out, 0);
    console.log(JSON.stringify({pass: name, packets: packets.length, ok: ok.length,
        errors: Object.values(done).filter(r => r.error).length, inTokens: tin, outTokens: tout,
        cost: Number(((tin * RATE.in + tout * RATE.out) / 1e6).toFixed(4))}));
}
