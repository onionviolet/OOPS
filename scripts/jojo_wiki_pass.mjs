#!/usr/bin/env node
// JoJo wiki-tier pass (jojo-readers lane, 2026-11-18): one Luna request per Stand, Hamon or Spin item that scripts/jojo_power_ledger.py wrote to the
// private wiki_items.json. The ability text is the shared evidence; the question names the mechanism shape, the blocking capability and the
// stated fields. Replies land in private/jojo_wiki_luna.json; the ledger builder folds them. Wiki text and replies stay private (gitignored).
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" node scripts/jojo_wiki_pass.mjs [--dry|--wait|--sync] [--max-usd N]
import {readFileSync} from 'node:fs';
import {runPass} from './label_runner.mjs';

const DIR = '/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/jojo-collection-2026-11-18/readers/private/';
const SHAPES = ['rule-imposing', 'conditional-trigger', 'auto-acting', 'time', 'conceptual', 'direct-force', 'sense-or-utility', 'transformation', 'summon-or-control', 'resource-gated'];
const CANON = JSON.parse(readFileSync(new URL('../docs/coverage/blocked_slugs.json', import.meta.url), 'utf8')).canonical;
const strict = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
export const SCHEMA = strict({summary: {type: 'string'}, shape: {type: 'string', enum: SHAPES}, blocked: {type: 'string', enum: ['none', ...CANON]},
    trigger: {type: 'string'}, limit: {type: 'string'}, beaten_by: {type: 'string'}});
export const COMMON = `You read a fan-wiki description of one ability from JoJo's Bizarre Adventure (a Stand, a Hamon/Ripple technique or a Spin technique) and say how it works as a game rule. Use only the text given.
"summary": one or two sentences in your own words (never a quotation) saying what the ability does and how. "trigger": what must happen or be true for it to work; "limit": its cost, range or weakness; "beaten_by": what counters it. Each may be empty when the text does not say.
"shape" is the one best fit: ${SHAPES.join(', ')}. rule-imposing = it sets a rule others must obey or that binds a target; conditional-trigger = it fires when a condition is met; auto-acting = it acts without the user's control; time = it changes how time runs for someone; conceptual = it acts on a category, fact or law rather than a body (truth, fate, gravity, infinity, a name); direct-force = plain damage, strength or speed; sense-or-utility; transformation = it changes the form of a thing; summon-or-control = it makes or steers creatures, objects or people; resource-gated = it works through a stock or a breath that runs out.
"blocked" names the one capability a life-sim engine would need beyond a plain verb-object-target-time effect sentence, from the list: ${CANON.join(', ')}; "none" when a plain effect sentence runs it.`;

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const items = JSON.parse(readFileSync(`${DIR}wiki_items.json`, 'utf8')).map(i => ({id: i.id, shared: `Fan-wiki text (${i.kind}${i.user ? ` of ${i.user}` : ''}):\n${i.text}`, user: `Question: how does ${i.title} work as a rule?`}));
    await runPass({name: 'jojo_wiki', dir: DIR, system: COMMON, schema: SCHEMA, items, model: 'gpt-6-luna', effort: 'low', maxTokens: 700}, process.argv.slice(2));
}
