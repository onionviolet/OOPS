#!/usr/bin/env node
// Normalises the effect-unknown chapter passes (PWC27, 2026-11-17; scripts/chapter_effect_packets.py then scripts/chapter_effect_pass.mjs)
// into docs/coverage/chapter_tier_labels.json, section `effect_unknown`, leaving the other sections as they are. Only grammar
// words, locators and speakers are committed; paraphrases and chapter text stay in the gitignored private folder. A sentence is kept
// only when its locator opens a line of the packet that was sent, its speaker is a chapter speaker, and the verb is a real verb.
// Scores put the scoring cohort (rows that already hold a wiki-, claim- or model-tier effect sentence) against that sentence,
// held-out rows (GKM429, sha1(id)[0] < 0x33) apart. Usage: node scripts/chapter_effect_labels.mjs
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';
import {LEDGERS, SPEAKERS, CAPABILITIES} from './chapter_effect_pass.mjs';

const root = new URL('..', import.meta.url).pathname;
const src = process.env.LABEL_SOURCE_ROOT ? `${process.env.LABEL_SOURCE_ROOT.replace(/\/$/, '')}/` : '/Users/weiwei/code/yet-another-idle-rpg/';
const priv = `${src}docs/research/advancement-aspects-2026-11-16/private/`;
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const loc = l => (l ?? '').replace(/^\[|\]$/g, '').trim();
const sorted = o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const OBJECTS = new Set(Object.keys(EFFECT_OBJECTS));

const ledgers = {}, scores = {}, yieldTable = {};
for (const ledger of Object.keys(LEDGERS)) {
    const base = `${priv}ch_effect_${ledger}`;
    if (!existsSync(`${base}_luna.json`)) continue;
    const replies = json(`${base}_luna.json`), search = json(`${base}_search.json`), packets = new Map(json(`${base}_packets.json`).map(p => [p.id, p]));
    const labels = {}, coh = {n: 0, answered: 0, none: 0, verb: 0, object: 0, both: 0, ho: {n: 0, answered: 0, verb: 0, object: 0, both: 0}};
    let sent = 0, gained = 0, none = 0, rejected = 0, blockedRows = 0, errors = 0;
    const capCount = {};
    for (const [id, s] of Object.entries(search)) {
        const r = replies[id]?.reply, p = packets.get(id);
        if (replies[id]?.error) errors++;
        let effect = null, blocked = null;
        if (r && p) {
            const e = r.effect, at = loc(e.locator);
            const valid = EFFECT_VERBS.includes(e.verb) && OBJECTS.has(e.object) && EFFECT_TARGETS.includes(e.target) && EFFECT_TIMES.includes(e.time);
            const backed = at && SPEAKERS.includes(e.speaker) && e.speaker !== 'unknown' && p.evidence.some(l => l.startsWith(`[${at}]`));
            if (valid && backed && r.blocked !== 'effect-unknown' && CAPABILITIES.includes(r.blocked)) { effect = {verb: e.verb, object: e.object, target: e.target, time: e.time, at, speaker: e.speaker}; blocked = r.blocked; }
            else if (s.role === 'cohort') { /* counted in the cohort scores */ } else if (e.verb === 'none' || r.blocked === 'effect-unknown') none++; else rejected++;
        }
        if (s.role === 'cohort') {
            coh.n++; if (s.heldOut) coh.ho.n++;
            if (!p) continue;
            if (!effect) { coh.none++; continue; }
            coh.answered++; if (s.heldOut) coh.ho.answered++;
            const [kv, ko] = s.known, v = effect.verb === kv, o = effect.object === ko;
            coh.verb += v; coh.object += o; coh.both += v && o;
            if (s.heldOut) { coh.ho.verb += v; coh.ho.object += o; coh.ho.both += v && o; }
            continue;
        }
        blockedRows++;
        if (p) sent++;
        const label = {heldOut: s.heldOut, chapterHits: s.paragraphHits ?? s.windowHits ?? 0};
        if (effect) { Object.assign(label, {effect, blocked}); gained++; capCount[blocked] = (capCount[blocked] ?? 0) + 1; }
        labels[id] = label;
    }
    ledgers[ledger] = sorted(labels);
    scores[ledger] = {cohortRows: coh.n, cohortAnswered: coh.answered, cohortReaderSaidNone: coh.none, verbAgree: coh.verb, objectAgree: coh.object, bothAgree: coh.both,
        heldOut: coh.ho};
    yieldTable[ledger] = {effectUnknownRows: blockedRows, zeroHitRows: blockedRows - sent, sent, gainedSentence: gained, readerStatedNothing: none, rejected, requestErrors: errors, catalogued: capCount.none ?? 0,
        blockedAfter: sorted(Object.fromEntries(Object.entries(capCount).filter(([k]) => k !== 'none')))};
}
const file = `${root}docs/coverage/chapter_tier_labels.json`;
const out = json(file);
out.effect_unknown = {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#pwc27-effect-unknown-from-chapters-2026-11-17-proposals', model: 'gpt-6-luna (low effort, batch)', date: '2026-11-17',
    tier: 'chapter (GKM445): one effect sentence per row from cited chapter paragraphs, one reader, unchecked', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'}, scores, yield: yieldTable, ledgers};
writeFileSync(file, JSON.stringify(out).replace(/},"/g, '},\n"') + '\n');
console.log(JSON.stringify({scores, yield: yieldTable}, null, 1));
