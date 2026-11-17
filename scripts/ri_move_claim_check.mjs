#!/usr/bin/env node
// Chapter check of the roles-unchecked Reverend Insanity move leads (GKM427, GKM446). Two wiki-tier readers
// (Luna, then Haiku) agree on these leads' components; this pass checks each component against the paid
// reader claims, which carry chapter locators, instead of the wiki page.
//   move   For each lead, the claims that name the move (scripts/ri_move_claims_join.mjs) are the evidence.
//          Each listed component gets core, support, not-part or not-stated, with the claim id and who says
//          it (GKM430). The reader also says whether the claims name further Gu or unnamed supports, and the
//          order if stated.
//   kind   For each component kind of a lead with any claim-backed component, and each catalogue kind those
//          leads use that cannot run yet, the claims that write "<name> Gu" are the evidence: rank, effect
//          family (the catalogue's guFunctions) and path, each with its claim id.
// Luna reads first, Haiku second (same packets). Replies go to the gitignored private folder (resumable);
// scripts/ri_move_claim_fold.mjs normalises them into docs/coverage/ri_move_claim_checks.json.
// Usage:
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" \
//   node scripts/ri_move_claim_check.mjs [--packets-only] [--limit N]
import {readFileSync, readdirSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import {luna, RATE, SPEAKER} from './label_pass.mjs';
import {guCatalogue, guFunctions} from '../src/gu_catalogue.js';
import {guMethods} from '../src/gu_working_law.js';

const root = new URL('..', import.meta.url).pathname;
const primary = '/Users/weiwei/code/yet-another-idle-rpg/';
const existing = rel => [join(root, rel), join(primary, rel)].find(p => existsSync(p));
const json = path => JSON.parse(readFileSync(path, 'utf8'));
export const PRIVATE = existing('docs/research/advancement-aspects-2026-11-16/private');
const index = json(existing('docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json'));
const readers = existing('docs/research/novels/full-book/reverend-insanity/readers');
const tier = json(join(root, 'docs/coverage/wiki_tier_labels.json'));
const joined = new Map(json(join(root, 'docs/research/reverend-insanity-move-claims-2026-11-16/MOVE_CLAIMS_JOIN.json')).rows.map(r => [r.id, r]));
const ledger = readFileSync(join(root, 'docs/coverage/gu_moves.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line));

export const norm = s => ` ${String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim()} `;
const claims = new Map();
for (const file of readdirSync(readers).filter(f => f.endsWith('-CLAIMS.json')).sort())
    for (const c of json(join(readers, file)).claims ?? [])
        claims.set(c.id, {...c, text: norm(`${c.claim ?? ''} ${(c.entities ?? []).join(' ')}`)});
const records = new Map(index.records.map(r => [r.id, r]));
export const kindName = id => records.get(id)?.saga?.name ?? records.get(id)?.fandom?.name ?? id;
// A kind counts only where a claim writes its name followed by "Gu" (the join's guard: kinds named After,
// Year or Fight would otherwise match ordinary words).
const kindKeys = id => {
    const bare = norm(kindName(id).replace(/\s+(immortal\s+)?gu$/i, '')).trim();
    return [` ${bare} gu `, ` ${bare} immortal gu `];
};
const names = (claim, id) => kindKeys(id).some(k => claim.text.includes(k));
const line = c => `[${c.id}] ch${c.chapter}: ${c.claim}${c.limits ? ` (limits: ${c.limits})` : ''}`;
const MAX = 12;

const leads = ledger.filter(r => r.state === 'blocked:roles-unchecked').map(r => {
    const comps = tier.gu_moves[r.id].components;
    const moveClaims = (joined.get(r.id)?.claims ?? []).map(c => claims.get(c.id)).filter(Boolean);
    const naming = moveClaims.filter(c => comps.some(k => names(c, k.kind)));
    return {id: r.id, name: joined.get(r.id)?.name ?? r.id, comps, naming,
        evidence: [...naming, ...moveClaims.filter(c => !naming.includes(c))].slice(0, MAX)};
}).filter(l => l.naming.length);

const kinds = [...new Set(leads.flatMap(l => l.comps.map(c => c.kind)))]
    .filter(id => !guCatalogue[id] || !guMethods(id).activate).sort();

const str = {type: 'string'};
const object = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
const enumOf = values => ({type: 'string', enum: values});
const RULES = `Use only the evidence lines. Each starts with a claim id in square brackets; copy that id exactly into "locator". Write any value as a short paraphrase in your own words. If the evidence does not state something, answer "not-stated" or "" with locator "" and speaker "unknown": an empty answer is correct, a guess is wrong. speaker: narrator, character_claim (a character says it and may be wrong), demonstration (shown happening), or unknown.`;

export function moveJobs() {
    const schema = object({components: {type: 'array', items: object({gu: str, verdict: enumOf(['core', 'support', 'not-part', 'not-stated']),
        locator: str, speaker: SPEAKER})}, other_gu: {type: 'array', items: str}, unnamed_parts: enumOf(['yes', 'no']),
    unnamed_locator: str, order: str, order_locator: str});
    return leads.map(l => ({id: l.id, schema, prompt: `Check the components of the Reverend Insanity killer move "${l.name}" against chapter claims from the novel. A wiki lists: ${l.comps.map(c => kindName(c.kind)).join('; ')}.
For each listed Gu (keep its name exactly, one entry each), verdict: core (the move's central Gu), support (used in the move to help the core), not-part (named nearby but refined into the move, made by it, or used separately), or not-stated (these claims do not say it is used in this move). other_gu: further Gu these claims say are used in this move, names only, else []. unnamed_parts: "yes" if a claim says the move uses Gu or supports it does not name, with that claim id in unnamed_locator. order: the activation order if a claim states it, else "".
${RULES}

Evidence:
${l.evidence.map(line).join('\n')}`}));
}

export function kindJobs() {
    const schema = object({rank: str, rank_locator: str, rank_speaker: SPEAKER, function: enumOf([...guFunctions, 'none']),
        function_locator: str, function_speaker: SPEAKER, path: str, path_locator: str});
    return kinds.map(id => {
        const evidence = [...claims.values()].filter(c => names(c, id)).sort((a, b) => a.chapter - b.chapter);
        // Spread across the book: earliest claims first, then every nth so later uses are seen too.
        const step = Math.max(1, Math.floor(evidence.length / MAX));
        const shown = evidence.filter((_, i) => i % step === 0).slice(0, MAX);
        return {id, name: kindName(id), evidence: shown, schema, prompt: `From chapter claims about the Reverend Insanity Gu "${kindName(id)}": rank: its rank as a number 1 to 9 if a claim states it (a range like "rank six or above" gives the number), else "". function: the one family that names what activating it does: ${guFunctions.join(', ')}; "none" when the claims do not show what it does when used. path: its dao path in one or two words if stated, else "".
${RULES}

Evidence:
${shown.map(line).join('\n')}`};
    }).filter(j => j.evidence.length);
}

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
async function haiku(prompt, schema) {
    const msg = await anthropic.messages.create({model: 'claude-haiku-5-5', max_tokens: 8000,
        output_config: {effort: 'low', format: {type: 'json_schema', schema}}, messages: [{role: 'user', content: prompt}]});
    if (msg.stop_reason === 'refusal') throw Error('haiku refusal');
    return {reply: JSON.parse(msg.content.filter(b => b.type === 'text').map(b => b.text).join('')),
        usage: {in: msg.usage.input_tokens, out: msg.usage.output_tokens}};
}
// Haiku 5.5 is priced like Luna (advancement-aspects README, prices read 2026-11-08), so one rate serves both.
const HAIKU_RATE = RATE;

async function run(name, jobs, call, rate) {
    const file = join(PRIVATE, `${name}.json`);
    const done = existsSync(file) ? json(file) : {};
    const queue = jobs.filter(j => !done[j.id]?.reply);
    for (let i = 0; i < queue.length; i += 8) {
        await Promise.all(queue.slice(i, i + 8).map(async j => {
            for (let attempt = 0; ; attempt++) {
                try { done[j.id] = await call(j.prompt, j.schema); break; }
                catch (e) { if (attempt >= 2) { done[j.id] = {error: String(e.message ?? e)}; break; } await new Promise(r => setTimeout(r, 3000 * (attempt + 1))); }
            }
        }));
        writeFileSync(file, JSON.stringify(done));
    }
    const ok = Object.values(done).filter(r => r.reply);
    const tin = ok.reduce((s, r) => s + r.usage.in, 0), tout = ok.reduce((s, r) => s + r.usage.out, 0);
    return {pass: name, jobs: jobs.length, ok: ok.length, errors: Object.values(done).filter(r => r.error).length,
        cost: Number(((tin * rate.in + tout * rate.out) / 1e6).toFixed(4))};
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
    const move = moveJobs().slice(0, limit), kind = kindJobs().slice(0, limit);
    writeFileSync(join(PRIVATE, 'ri_move_claim_check_packets.json'), JSON.stringify({
        move: move.map(j => ({id: j.id, prompt: j.prompt})), kind: kind.map(j => ({id: j.id, prompt: j.prompt}))}));
    console.log(JSON.stringify({leads: move.length, kinds: kind.length, evidenceLines: move.reduce((s, j) => s + j.prompt.split('\n[').length - 1, 0)}));
    if (!process.argv.includes('--packets-only')) {
        const results = await Promise.all([
            run('ri_move_check_luna', move, luna, RATE), run('ri_kind_check_luna', kind, luna, RATE),
            run('ri_move_check_haiku', move, haiku, HAIKU_RATE), run('ri_kind_check_haiku', kind, haiku, HAIKU_RATE)]);
        for (const r of results) console.log(JSON.stringify(r));
    }
}
