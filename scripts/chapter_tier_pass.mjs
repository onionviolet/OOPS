#!/usr/bin/env node
// Chapter-tier label passes (R5 / PWC15, 2026-11-16): the same questions, schemas and held-out split as the wiki-tier
// passes (scripts/label_pass.mjs), asked of chapter paragraphs from scripts/chapter_tier_packets.py. Runs through
// scripts/label_runner.mjs, so the default is batch at half price with the common header first (AU16). Replies land in
// the private folder as ch_<corpus>_luna.json and are resumable: finished ids are skipped.
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" \
//   node scripts/chapter_tier_pass.mjs gu_kinds lotm_potions hp_ingredients [--pilot N] [--sync|--dry|--wait] [--max-usd N]
// --pilot N sends only N rows that are not held out (GKM429), a few per corpus, for a quick synchronous look.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {runPass} from './label_runner.mjs';
import {PASSES, RULES} from './label_pass.mjs';

const dir = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;

// One header for every corpus, so the whole run shares its cached opening.
export const CHAPTER_COMMON = `You label source evidence for a game's coverage ledgers. Answer the question at the end about the evidence.
${RULES}
The evidence here is the novel's own text (lines whose locator starts ri:, lotm: or hp:, each a paragraph or a few lines) and, for Reverend Insanity, a reader's note (locator starts claim:), never a wiki. Judge only what the lines say about the named subject: a nearby Gu, Sequence or ingredient is not the subject, and a person's rank is not a Gu's rank. A character who asserts something is a character claim; the narrator or a scene that shows it is not.`;

const rank = ' In Reverend Insanity a Gu has its own rank (1 to 9, "rank four Gu"); a Gu Master\'s or an Immortal\'s rank is a different thing and is not the Gu\'s rank. Set rank to the Gu\'s own rank only when a line states it for this very Gu.';

export function itemsFor(corpus, packets) {
    const pass = PASSES[corpus];
    return packets.map(p => ({id: p.id, shared: `Evidence:\n${p.evidence.join('\n')}`,
        user: `${pass.ask}${corpus === 'gu_kinds' ? rank : ''}\n\nSubject: ${pass.subject(p)}`}));
}

export const MAX_TOKENS = {gu_kinds: 3000, hp_ingredients: 3000, lotm_potions: 6000};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2), pilot = argv.includes('--pilot') ? Number(argv[argv.indexOf('--pilot') + 1]) : 0;
    for (const corpus of argv.filter(a => PASSES[a])) {
        let packets = JSON.parse(readFileSync(`${dir}ch_${corpus}_packets.json`, 'utf8'));
        if (pilot) packets = packets.filter(p => !heldOut(p.id)).sort((a, b) => a.id.localeCompare(b.id)).filter((_, i, all) => i % Math.max(1, Math.floor(all.length / pilot)) === 0).slice(0, pilot);
        await runPass({name: `ch_${corpus}`, dir, system: CHAPTER_COMMON, schema: PASSES[corpus].schema, items: itemsFor(corpus, packets),
            model: 'gpt-6-luna', effort: 'low', maxTokens: MAX_TOKENS[corpus]}, argv.filter(a => a !== '--pilot' && a !== String(pilot)));
    }
}
