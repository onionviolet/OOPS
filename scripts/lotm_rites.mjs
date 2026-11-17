#!/usr/bin/env node
// LOTM rites as rule rows (PWC21e, 2026-11-17, proposal). Haiku 5.5 extracts each pathway's stated advancement rite for Sequences 5
// to 0 from that pathway's section of PATHWAY_POTION_TABLE.md (the Ritual column and the section's prose; the table is a reader digest,
// not the novel), one request per pathway through scripts/label_runner.mjs (batch, AU16). `--fold` writes 22 x 6 = 132 rows into
// docs/coverage/lotm_rules.json in the same shape as the other rule rows: {id, world, statement, locators, speaker, mechanism, derives}.
// A Sequence with no stated rite says "none stated". A locator is kept only if it appears in the section text that was sent.
//   ANTHROPIC_API_KEY=... LABEL_PRIVATE=... node scripts/lotm_rites.mjs [--wait|--dry|--sync]   then   node scripts/lotm_rites.mjs --fold
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {runPass} from './label_runner.mjs';
import {TABLE_DOC, RULES_FILE} from './derive_lotm_formulas.mjs';
import {LOTM_PATHWAYS} from '../src/lotm_derived_formulas.js';

const priv = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'reader_inference', 'unknown'];

/** {pathway: section text} for the 22 pathway sections of the table. */
export function sections() {
    const text = readFileSync(TABLE_DOC, 'utf8'), out = {};
    const parts = text.split(/^## (?=\d+\. .+? line)/m).slice(1);
    for (const part of parts) {
        const name = /^\d+\. (.+?) line/.exec(part)?.[1];
        const pathway = LOTM_PATHWAYS.find(p => p === name || (name === 'Hermit' && p === 'Hermit'));
        if (pathway) out[pathway] = part.split(/^## /m)[0];
    }
    return out;
}

const SYSTEM = `You extract facts from a reader's digest table about the web novel Lord of the Mysteries, for a game's coverage ledgers. Use only the section text given. Evidence tags in the text: S shown on the page, T stated by a character, I inferred by a reader, W wiki, M missing. A number such as 0254 or 1204 is an EPUB member locator. Write values as short paraphrases in your own words, never quotations. If the text states no rite for a Sequence, the answer for it is exactly "none stated": a guess is wrong.`;
const SCHEMA = {type: 'object', additionalProperties: false, required: ['rites'], properties: {rites: {type: 'array', items: {type: 'object', additionalProperties: false,
    required: ['seq', 'rite', 'locator', 'speaker'], properties: {seq: {type: 'integer'}, rite: {type: 'string'},
        locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}}}}}};
const ask = pathway => `The section above is the ${pathway} pathway. For each Sequence from 5 down to 0, give the rite the text states for taking the potion into that Sequence (the ritual the drinker performs or the condition it needs; special materials count, the potion's ordinary main and supplementary ingredients do not). Where one row covers several Sequences, repeat its rite for each Sequence it names. rite: a short paraphrase, or exactly "none stated". locator: the EPUB member numbers the text gives for it, joined by "; ", or "" when none. speaker: who states it (character_claim for a T tag, demonstration for S, reader_inference for I, narrator, or unknown). Return exactly six entries, Sequence 5, 4, 3, 2, 1, 0.`;

export const items = () => Object.entries(sections()).map(([pathway, text]) => ({id: pathway, shared: `Section:\n${text}`, user: ask(pathway)}));
export const RITE_FILE = `${priv}lotm_rites_haiku.json`;

export function riteRows() {
    const replies = JSON.parse(readFileSync(RITE_FILE, 'utf8')), secs = sections(), rows = [];
    for (const pathway of LOTM_PATHWAYS) for (let seq = 5; seq >= 0; seq--) {
        const r = replies[pathway]?.reply?.rites?.find(x => x.seq === seq);
        const stated = r && r.rite.trim() && r.rite.trim().toLowerCase() !== 'none stated';
        const members = stated ? (r.locator.match(/\b\d{4}\b/g) ?? []).filter(m => secs[pathway].includes(m)) : [];
        const T = `${TABLE_DOC}#${slug(pathway)}`;
        rows.push({id: `lotm.rite.${slug(pathway)}_${seq}`, world: 'lotm',
            statement: stated ? r.rite.trim() : 'none stated',
            locators: stated ? [T, ...members.map(m => `lotm_c_${m}.xhtml`)] : [T],
            speaker: stated ? r.speaker : 'unknown',
            mechanism: 'rite step before the potion is drunk (read by no brew law today; a derived row attaches it by pathway and Sequence)',
            derives: [`${slug(pathway)}_${seq}`]});
    }
    return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2);
    if (argv.includes('--fold')) {
        const file = JSON.parse(readFileSync(RULES_FILE, 'utf8')), rows = riteRows();
        file.rules = [...file.rules.filter(r => !r.id.startsWith('lotm.rite.')), ...rows];
        file.meta.pwc = 'PWC21, PWC21e, PWC25 (first rules-as-rows file)';
        writeFileSync(RULES_FILE, JSON.stringify(file, null, 2) + '\n');
        const stated = rows.filter(r => r.statement !== 'none stated');
        console.log(JSON.stringify({rows: rows.length, stated: stated.length, noneStated: rows.length - stated.length, withLocator: stated.filter(r => r.locators.length > 1).length}));
    } else await runPass({name: 'lotm_rites', dir: priv, suffix: 'haiku', system: SYSTEM, schema: SCHEMA, items: items(), model: 'claude-haiku-5-5', effort: 'low', maxTokens: 4000}, argv);
}
