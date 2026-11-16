#!/usr/bin/env node
// Advancement-aspect pilot (docs/research/advancement-aspects-2026-11-16): sends the same packets to
// GPT-6 Luna and Claude Haiku 5.5 at low effort with one strict schema, records each reply and its usage,
// and prints per-model cost at standard (not batch) rates. Packets and replies stay in the gitignored
// private folder. Synchronous calls: the pilot is small, and the batch rate is half these numbers.
// Usage:
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" \
//   node scripts/aspect_pilot.mjs [--only luna|haiku]
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';

const dir = new URL('../docs/research/advancement-aspects-2026-11-16/private/', import.meta.url).pathname;
const packets = JSON.parse(readFileSync(dir + 'packets.json', 'utf8'));
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

// Standard per-million rates (Haiku 5.5 from the bundled API reference, 2026-11-03; Luna from the batch
// workflow doc's batch rate doubled). Batch halves both.
const RATES = {luna: {in: 0.10, out: 0.50}, haiku: {in: 0.10, out: 0.50}};

// Plain strings, "" for not stated: Haiku's structured outputs allow at most 16 nullable parameters per schema.
const nullable = type => ({type});
const field = {type: 'object', additionalProperties: false, required: ['value', 'source', 'locator', 'speaker'], properties: {
    value: nullable('string'),
    source: {type: 'string', enum: ['book', 'wiki', 'none']},
    locator: nullable('string'),
    speaker: {type: 'string', enum: ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown']},
}};
const ASPECTS = ['take', 'do', 'settle', 'go_wrong', 'change', 'who_may', 'where_from', 'how_long',
    'others_notice', 'left_behind', 'who_controls', 'mind', 'can_be_false', 'combines'];
const lotmSchema = {type: 'object', additionalProperties: false, required: ['sequence', 'aspects'], properties: {
    sequence: {type: 'string'},
    aspects: {type: 'object', additionalProperties: false, required: ASPECTS, properties: Object.fromEntries(ASPECTS.map(a => [a, field]))},
}};
const component = {type: 'object', additionalProperties: false, required: ['gu', 'role', 'locator', 'speaker'], properties: {
    gu: {type: 'string'}, role: {type: 'string'}, locator: {type: 'string'},
    speaker: {type: 'string', enum: ['narrator', 'character_claim', 'demonstration', 'unknown']},
}};
const riSchema = {type: 'object', additionalProperties: false, required: ['move', 'components', 'cost', 'conditions', 'effect', 'counters'],
    properties: {move: {type: 'string'}, components: {type: 'array', items: component}, cost: field, conditions: field, effect: field, counters: field}};

const RULES = `Use only the evidence lines given. Each line starts with its locator in square brackets; copy that locator exactly into "locator". Write values as short paraphrases in your own words, never quotations. If the evidence does not state something, set value to "", source to "none", locator to "" and speaker to "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: the narrator, a character's claim (which may be wrong), a demonstration (it is shown happening), or the wiki.`;
const lotmPrompt = p => `Fill an advancement sheet for the Lord of the Mysteries potion ${p.pathway} Pathway Sequence ${p.number}: ${p.sequence}.
Aspects: take (formula: main and supplementary ingredients), do (advancement ritual), settle (acting method or how the potion is digested), go_wrong (backlash, loss of control), change (abilities gained), who_may (prerequisites), where_from (where ingredients or the formula come from), how_long (brewing, digestion or waiting time), others_notice (what others can sense), left_behind (what remains after death), who_controls (who holds the formula), mind (effects on personality), can_be_false (false or incomplete formulas), combines (interactions with other pathways or items).
${RULES}

Evidence:
${p.evidence.join('\n') || '(none)'}`;
const riPrompt = p => `Describe the Reverend Insanity killer move "${p.move}": its component Gu and each one's role (core or support, or what it does), what using it costs, conditions for activating it, its effect, and what counters it.
${RULES} For components, list only Gu the evidence ties to this move; an empty list is correct when none is stated.

Evidence:
${p.evidence.join('\n') || '(none)'}`;

const jobs = [...packets.lotm.map(p => ({id: p.id, schema: lotmSchema, prompt: lotmPrompt(p)})),
    ...packets.ri.map(p => ({id: p.id, schema: riSchema, prompt: riPrompt(p)}))];

async function luna(job) {
    const res = await fetch('https://api.openai.com/v1/responses', {method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}`},
        body: JSON.stringify({model: 'gpt-6-luna', reasoning: {effort: 'low'}, max_output_tokens: 32000,
            input: [{role: 'user', content: [{type: 'input_text', text: job.prompt}]}],
            text: {format: {type: 'json_schema', name: 'sheet', schema: job.schema, strict: true}}})});
    const body = await res.json();
    if (!res.ok) throw Error(`luna ${res.status}: ${JSON.stringify(body.error ?? body).slice(0, 300)}`);
    const text = (body.output ?? []).flatMap(o => o.content ?? []).filter(c => c.type === 'output_text').map(c => c.text).join('');
    return {reply: JSON.parse(text), usage: {in: body.usage?.input_tokens ?? 0, out: body.usage?.output_tokens ?? 0,
        reasoning: body.usage?.output_tokens_details?.reasoning_tokens ?? 0}};
}
const anthropic = new Anthropic();
async function haiku(job) {
    const msg = await anthropic.messages.create({model: 'claude-haiku-5-5', max_tokens: 16000,
        output_config: {effort: 'low', format: {type: 'json_schema', schema: job.schema}},
        messages: [{role: 'user', content: job.prompt}]});
    if (msg.stop_reason === 'refusal') throw Error(`haiku refusal: ${msg.stop_details?.category}`);
    const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
    return {reply: JSON.parse(text), usage: {in: msg.usage.input_tokens, out: msg.usage.output_tokens, reasoning: null}, stop: msg.stop_reason};
}

const routes = {luna, haiku};
for (const [name, call] of Object.entries(routes)) {
    if (only && only !== name) continue;
    const file = `${dir}pilot_${name}.json`;
    const done = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
    const queue = jobs.filter(j => !done[j.id]?.reply);
    for (let i = 0; i < queue.length; i += 4) {
        await Promise.all(queue.slice(i, i + 4).map(async job => {
            try { done[job.id] = await call(job); } catch (e) { done[job.id] = {error: String(e.message ?? e)}; }
        }));
        writeFileSync(file, JSON.stringify(done, null, 1));
    }
    const ok = Object.values(done).filter(r => r.reply);
    const tin = ok.reduce((s, r) => s + r.usage.in, 0), tout = ok.reduce((s, r) => s + r.usage.out, 0);
    const cost = (tin * RATES[name].in + tout * RATES[name].out) / 1e6;
    console.log(JSON.stringify({model: name, ok: ok.length, errors: Object.values(done).filter(r => r.error).map(r => r.error).slice(0, 3),
        inTokens: tin, outTokens: tout, standardCost: Number(cost.toFixed(4)), batchCost: Number((cost / 2).toFixed(4)),
        perRequestBatch: ok.length ? Number((cost / 2 / ok.length).toFixed(5)) : null}));
}
