#!/usr/bin/env node
// Haiku 5.5 second read for the Hogwarts ingredient pass (docs/research/advancement-aspects-2026-11-16): the same
// prompt and schema as Luna's hp_ingredients pass, on the held-out rows (sha1(id)[0] < 0x33) and the 20 runs-authored
// comparison rows. Writes private/hp_ingredients_haiku.json (resumable); scripts/hp_ingredient_labels_check.mjs scores it.
// Usage: ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" node scripts/hp_ingredient_haiku.mjs
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import {PASSES, RATE} from './label_pass.mjs';
import {AUTHORED, heldOut} from './hp_ingredient_labels_check.mjs';

const priv = new URL('../docs/research/advancement-aspects-2026-11-16/private/', import.meta.url).pathname;
const pass = PASSES.hp_ingredients;
const packets = JSON.parse(readFileSync(`${priv}hp_ingredients_packets.json`, 'utf8')).filter(p => heldOut(p.id) || AUTHORED[p.id]);
const file = `${priv}hp_ingredients_haiku.json`;
const done = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
const client = new Anthropic();
async function haiku(prompt) {
    const msg = await client.messages.create({model: 'claude-haiku-5-5', max_tokens: 8000,
        output_config: {effort: 'low', format: {type: 'json_schema', schema: pass.schema}}, messages: [{role: 'user', content: prompt}]});
    if (msg.stop_reason === 'refusal') throw Error('haiku refusal');
    return {reply: JSON.parse(msg.content.filter(b => b.type === 'text').map(b => b.text).join('')), usage: {in: msg.usage.input_tokens, out: msg.usage.output_tokens}};
}
const queue = packets.filter(p => !done[p.id]?.reply);
for (let i = 0; i < queue.length; i += 8) {
    await Promise.all(queue.slice(i, i + 8).map(async p => {
        const prompt = `${pass.prompt(p)}\n\nEvidence:\n${p.evidence.join('\n')}`;
        for (let attempt = 0; ; attempt++) {
            try { done[p.id] = await haiku(prompt); break; }
            catch (e) { if (attempt >= 2) { done[p.id] = {error: String(e.message ?? e)}; break; } await new Promise(r => setTimeout(r, 3000 * (attempt + 1))); }
        }
    }));
    writeFileSync(file, JSON.stringify(done));
}
const ok = Object.values(done).filter(r => r.reply);
const tin = ok.reduce((s, r) => s + r.usage.in, 0), tout = ok.reduce((s, r) => s + r.usage.out, 0);
console.log(JSON.stringify({packets: packets.length, ok: ok.length, errors: Object.values(done).filter(r => r.error).length,
    cost: Number(((tin * RATE.in + tout * RATE.out) / 1e6).toFixed(4))}));
