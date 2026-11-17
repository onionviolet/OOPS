// Hogwarts wiki check (PWC22c, 2026-11-17): Luna judges each derived ingredient axis against the ingredient's wiki description
// (private hp_ingredients_packets.json), through scripts/label_runner.mjs (batch, AU16). Targets: every unlabelled ingredient
// with a derived set (what the check would fold into) and every labelled one with a derived set computed as the PWC22 score
// does (held-out rows: siblings lend training axes only; others leave one out), so the verdicts can be scored against the
// stated axes. Scoring and the fold decision: scripts/second_readers_score.mjs.
import {readFileSync} from 'node:fs';
import {runPass} from './label_runner.mjs';
import {COMMON, HP_INGREDIENT_AXES} from './label_pass.mjs';
import {deriveIngredient, statedAxes, isHeldOut} from './derive_hp_properties.mjs';

const root = new URL('..', import.meta.url).pathname;
const priv = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
const wiki = JSON.parse(readFileSync(`${root}docs/coverage/wiki_tier_labels.json`, 'utf8')).hp_ingredients;

/** [{id, labelled, axes: [axis...]}] for every ingredient with a derived set. */
export function targets() {
    const labelled = Object.keys(wiki).filter(id => Object.keys(statedAxes(id)).length);
    const train = new Set(labelled.filter(id => !isHeldOut(id)));
    const out = [];
    for (const id of Object.keys(wiki)) {
        const isLab = labelled.includes(id);
        const visible = !isLab ? statedAxes : isHeldOut(id) ? (o => (train.has(o) ? statedAxes(o) : {})) : (o => (o === id ? {} : statedAxes(o)));
        const d = deriveIngredient(id, visible);
        if (!d.block) out.push({id, labelled: isLab, axes: d.axes.map(a => a.axis)});
    }
    return out;
}

const schema = {type: 'object', additionalProperties: false, required: ['axes'], properties: {axes: {type: 'array', items: {type: 'object',
    additionalProperties: false, required: ['axis', 'verdict', 'locator'], properties: {axis: {type: 'string'},
        verdict: {type: 'string', enum: ['supported', 'contradicted', 'not-stated']}, locator: {type: 'string'}}}}}};

export async function run(argv) {
    const packets = new Map(JSON.parse(readFileSync(`${priv}hp_ingredients_packets.json`, 'utf8')).map(p => [p.id, p]));
    const vocab = Object.entries(HP_INGREDIENT_AXES).map(([k, v]) => `${k} (${v})`).join('; ');
    const items = targets().filter(t => packets.has(t.id)).map(t => ({id: t.id, shared: `Evidence:\n${packets.get(t.id).evidence.join('\n')}`,
        user: `A rule guessed that the Harry Potter ingredient "${packets.get(t.id).name}" has these properties, from the potions it goes into: ${t.axes.join(', ')}.
Property vocabulary: ${vocab}.
Check each guessed property against the evidence about the ingredient itself. verdict: supported (the evidence says the ingredient itself has or gives this property), contradicted (the evidence says it has a different or opposite property in its place), not-stated (the evidence does not say). A potion that uses the ingredient is not evidence for the property by itself. Keep the property names exactly, one entry each; locator is the line that decides it, or "" for not-stated.`}));
    await runPass({name: 'hp_wiki_check', dir: priv, system: COMMON, schema, items, model: 'gpt-6-luna', effort: 'low', maxTokens: 3000}, argv);
}
