#!/usr/bin/env node
// Re:Zero power denominator, stage 1 (PWC3): Luna reads each chunk of the deep dives and reader digests and lists
// every named power in it. Replies go to private/rezero_names_luna.json (resumable). Merging, aliasing and the
// final ids are the builder's job (scripts/rezero_power_ledger.mjs); this pass only collects names from data.
// Usage:
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" node scripts/rezero_power_names.mjs
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {luna, RATE} from './label_pass.mjs';
import {SOURCES, chunkSource, CLASSES, PRIV, readIf} from './rezero_power_chunks.mjs';

const str = {type: 'string'};
export const NAMES_SCHEMA = {type: 'object', additionalProperties: false, required: ['powers'], properties: {powers: {type: 'array', items: {
    type: 'object', additionalProperties: false, required: ['name', 'class', 'aliases', 'line', 'edition_note'],
    properties: {name: str, class: {type: 'string', enum: CLASSES}, aliases: {type: 'array', items: str}, line: {type: 'integer'}, edition_note: str}}}}};

export const namesPrompt = chunk => `You are cataloguing Re:Zero's powers from a research note. List every NAMED power, power kind or magic the text names, one entry each.
Classes: authority (the power a Witch Factor grants, or a named ability of an Archbishop or Witch such as Invisible Providence), witch_factor (a Factor itself, by its sin), divine_protection (a blessing, by name), spell (a named spell or spell root/tier such as El, Ul, Al plus a root), curse (a named curse or curse kind), spirit_contract (a contract kind or a contracted spirit's working), return_by_death (the looping power itself), other_art (named arts that fit none: Soul Marriage, Spirit Eating, Gospel, Book of the Dead, Od Lagna and the like).
Rules: "name" is the power's name as the text writes it, never a person's name, place or a plain word. "aliases" lists other names for the same power in this chunk (a translation variant, a web-novel or light-novel name). "line" is the number n of the first "[KEY l.n]" line that names it. "edition_note" is "LN", "WN", "both" or "" for the edition the text ties the name to. Skip a power the text only mentions as absent or non-canon unless it names it. An empty list is a correct answer.

Text:
${chunk.text}`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const chunks = SOURCES.flatMap(s => chunkSource(s));
    const file = `${PRIV}rezero_names_luna.json`;
    const done = readIf(file, {});
    const queue = chunks.filter(c => !done[c.locator]?.reply);
    for (let i = 0; i < queue.length; i += 8) {
        await Promise.all(queue.slice(i, i + 8).map(async c => {
            try { done[c.locator] = {...await luna(namesPrompt(c), NAMES_SCHEMA), edition: c.edition}; } catch (e) { done[c.locator] = {error: String(e.message ?? e)}; }
        }));
        writeFileSync(file, JSON.stringify(done));
    }
    const ok = Object.values(done).filter(r => r.reply);
    const tin = ok.reduce((s, r) => s + r.usage.in, 0), tout = ok.reduce((s, r) => s + r.usage.out, 0);
    console.log(JSON.stringify({chunks: chunks.length, ok: ok.length, errors: Object.values(done).filter(r => r.error).length,
        powers: ok.reduce((s, r) => s + r.reply.powers.length, 0), inTokens: tin, outTokens: tout, cost: Number(((tin * RATE.in + tout * RATE.out) / 1e6).toFixed(4))}));
}
