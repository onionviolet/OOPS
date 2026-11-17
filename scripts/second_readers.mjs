#!/usr/bin/env node
// Second readers (PWC19, 2026-11-17): Haiku 5.5 re-reads the one-reader chapter-tier fields from R5 (the Gu ranks, the LOTM
// mains, the Hogwarts ingredient axes), re-asks the two weak Luna fields (Gu diet defaults, potion sentence verbs) at medium
// effort, and Luna checks each derived Hogwarts ingredient set against its wiki description (PWC22c). Everything goes through
// scripts/label_runner.mjs (batch, common header first, evidence as `shared`, AU16). Replies stay in the private folder.
//   ANTHROPIC_API_KEY=... OPENAI_API_KEY=... LABEL_PRIVATE=<private dir> node scripts/second_readers.mjs <pass ...> [--sync|--dry|--wait]
// passes: chapter_second, weak_diet, weak_sentence, hp_wiki_check
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {runPass} from './label_runner.mjs';
import {PASSES, COMMON} from './label_pass.mjs';
import {CHAPTER_COMMON, itemsFor, MAX_TOKENS} from './chapter_tier_pass.mjs';

const root = new URL('..', import.meta.url).pathname;
export const priv = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const HAIKU = 'claude-haiku-5-5', LUNA = 'gpt-6-luna';

/** Ids whose chapter-tier fields have one reader only: the Gu ranks of blocked rows, LOTM mains, Hogwarts axes. */
export function chapterFields() {
    const c = json(`${root}docs/coverage/chapter_tier_labels.json`);
    return {
        gu_kinds: Object.entries(c.gu_kinds).filter(([, v]) => v.role === 'blocked' && v.rank).map(([id]) => id),
        lotm_potions: Object.entries(c.lotm_potions).filter(([, v]) => v.mains?.length).map(([id]) => id),
        hp_ingredients: Object.entries(c.hp_ingredients).filter(([, v]) => v.axes?.length).map(([id]) => id)};
}

async function chapterSecond(argv) {
    const ids = chapterFields();
    for (const corpus of Object.keys(ids)) {
        const keep = new Set(ids[corpus]);
        const packets = json(`${priv}ch_${corpus}_packets.json`).filter(p => keep.has(p.id));
        await runPass({name: `ch2_${corpus}`, dir: priv, system: CHAPTER_COMMON, schema: PASSES[corpus].schema, items: itemsFor(corpus, packets),
            model: HAIKU, effort: 'low', maxTokens: MAX_TOKENS[corpus]}, argv);
    }
}

async function weak(argv, which) {
    const {guDietJobs, hpSentenceJobs, hpSplit} = await import('./label_followups.mjs');
    const jobs = which === 'diet' ? (() => { const {jobs, stated} = guDietJobs(); const ids = new Set(stated.map(s => s.id)); return jobs.filter(j => ids.has(j.id)); })()
        : (() => { const held = new Set(hpSplit().heldOut.map(r => r.id)); return hpSentenceJobs().filter(j => held.has(j.id)); })();
    await runPass({name: `weak_${which}`, dir: priv, suffix: 'haiku', system: COMMON, model: HAIKU, effort: 'medium', maxTokens: 8000,
        schema: jobs[0].schema, items: jobs}, argv);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2), want = new Set(argv.filter(a => !a.startsWith('--')));
    if (want.has('chapter_second')) await chapterSecond(argv);
    if (want.has('weak_diet')) await weak(argv, 'diet');
    if (want.has('weak_sentence')) await weak(argv, 'sentence');
    if (want.has('hp_wiki_check')) await (await import('./second_readers_hp.mjs')).run(argv);
}
