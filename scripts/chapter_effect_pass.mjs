#!/usr/bin/env node
// Effect-unknown chapter pass (PWC27, 2026-11-17): one batch request per row (AU16) asking only "what does this power do", over the
// paragraphs scripts/chapter_effect_packets.py cited (no model call there). Header first (cached), the paragraphs as `shared`, the
// question last. Replies: private/ch_effect_<ledger>_luna.json, resumable. The answer is one effect-grammar sentence
// (verb, object, target, time; src/effect_grammar.js), with locator and speaker, plus the capability the sentence would need.
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   node scripts/chapter_effect_pass.mjs gu_kinds worm_powers ... [--sync|--dry|--wait] [--pilot N] [--max-usd N]
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {runPass} from './label_runner.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';

const dir = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
export const LEDGERS = {gu_kinds: 'Reverend Insanity', ri_treasures: 'Reverend Insanity', lotm_artifacts: 'Lord of the Mysteries', hp_objects: 'Harry Potter',
    worm_powers: 'Worm', circle_of_inevitability_powers: 'Circle of Inevitability', legendary_mechanic_powers: 'The Legendary Mechanic',
    mother_of_learning_powers: 'Mother of Learning', fated_villain_powers: 'I Am the Fated Villain', a_novel_concept_powers: 'A Novel Concept',
    speedrunning_multiverse_powers: 'Speedrunning the Multiverse', rezero_powers: 'Re:Zero'};
export const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'unknown'];
export const CAPABILITIES = ['none', 'effect-unknown', 'area-field', 'power-interaction', 'mind-binding', 'form-transformation', 'familiar-summon', 'power-transfer',
    'containment-rule', 'soul-binding', 'item-state', 'divination', 'spatial-storage', 'formation-field', 'time-manipulation', 'creature-control', 'portal-space',
    'precognition', 'protection-field', 'mind-state', 'body-form', 'conceal-or-sense', 'tinker-device', 'death-checkpoint-rewind'];

export const COMMON = `You read novel paragraphs to say what one named power, item or ability does. Use only the lines given. Each starts with its locator in square brackets; copy one locator's content exactly into "locator".
Ask only what it does: pick one effect sentence from the lists, verb, object, target and time, the best fit for the main thing the lines show it doing. Write "summary" as one short paraphrase in your own words, never a quotation. If the lines name the subject but never show or state what it does (a name in passing, a person's feat that is not this power), answer verb "none", object "none", target "none", time "none" and an empty summary.
Judge only what the lines say about the named subject: a nearby person, item or power is not the subject. A character who asserts something is a character_claim; the narrator or a scene that shows it happen is narrator or demonstration; "unknown" when you answered none.
"blocked" names the capability a life-sim engine would need beyond the plain sentence, from the list; "none" when the sentence alone runs it; "effect-unknown" when the lines do not say what it does.
Verbs: ${EFFECT_VERBS.join(', ')}. Objects: ${Object.keys(EFFECT_OBJECTS).join(', ')}. Targets: ${EFFECT_TARGETS.join(', ')}. Times: ${EFFECT_TIMES.join(', ')}.`;

const strict = props => ({type: 'object', additionalProperties: false, required: Object.keys(props), properties: props});
export const SCHEMA = strict({effect: strict({verb: {type: 'string', enum: [...EFFECT_VERBS, 'none']}, object: {type: 'string', enum: [...Object.keys(EFFECT_OBJECTS), 'none']},
    target: {type: 'string', enum: [...EFFECT_TARGETS, 'none']}, time: {type: 'string', enum: [...EFFECT_TIMES, 'none']},
    summary: {type: 'string'}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}}),
    blocked: {type: 'string', enum: CAPABILITIES}, blocked_reason: {type: 'string'}});

const labelled = JSON.parse(readFileSync(new URL('../docs/coverage/chapter_tier_labels.json', import.meta.url), 'utf8')).effect_unknown.ledgers;
/** Second-reader rows: a Luna sentence that is held out (GKM429) or whose sha1(id)[1] < 0x40 (25%). */
export const sampled = (ledger, id) => { const r = labelled[ledger]?.[id]; return !!r?.effect && (r.heldOut || createHash('sha1').update(id).digest()[1] < 0x40); };
export function itemsFor(ledger, packets) {
    return packets.map(p => ({id: p.id, shared: `Paragraphs (${LEDGERS[ledger]}):\n${p.evidence.join('\n')}`,
        user: `Question: what does this power do?\nSubject: ${p.name} (${LEDGERS[ledger]}).`}));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2), pilot = argv.includes('--pilot') ? Number(argv[argv.indexOf('--pilot') + 1]) : 0;
    const second = argv.includes('--second');
    for (const ledger of argv.filter(a => LEDGERS[a])) {
        let packets = JSON.parse(readFileSync(`${dir}ch_effect_${ledger}_packets.json`, 'utf8'));
        if (second) packets = packets.filter(p => sampled(ledger, p.id));
        if (pilot) packets = packets.filter((_, i) => i % Math.max(1, Math.floor(packets.length / pilot)) === 0).slice(0, pilot);
        await runPass({name: second ? `ch_effect2_${ledger}` : `ch_effect_${ledger}`, dir, system: COMMON, schema: SCHEMA, items: itemsFor(ledger, packets), model: second ? 'claude-haiku-5-5' : 'gpt-6-luna', effort: 'low', maxTokens: 1500},
            argv.filter(a => !LEDGERS[a] && a !== '--pilot' && a !== String(pilot) && a !== '--second'));
    }
}
