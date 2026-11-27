#!/usr/bin/env node
// Normalises the effect-unknown chapter passes (PWC27, 2026-11-17; scripts/chapter_effect_packets.py then scripts/chapter_effect_pass.mjs)
// into docs/coverage/chapter_tier_labels.json, section `effect_unknown`, leaving the other sections as they are. Only grammar
// words, locators and speakers are committed; paraphrases and chapter text stay in the gitignored private folder. A sentence is kept
// only when its locator opens a line of the packet that was sent, its speaker is a chapter speaker, and the verb is a real verb.
// Scores put the scoring cohort (rows that already hold a wiki-, claim- or model-tier effect sentence) against that sentence,
// held-out rows (GKM429, sha1(id)[0] < 0x33) apart. Usage: node scripts/chapter_effect_labels.mjs
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES, VERB_ACCEPTS} from '../src/effect_grammar.js';
import {LEDGERS, SPEAKERS, CAPABILITIES} from './chapter_effect_pass.mjs';
import {createHash} from 'node:crypto';

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
    const replies2 = existsSync(`${priv}ch_effect2_${ledger}_haiku.json`) ? json(`${priv}ch_effect2_${ledger}_haiku.json`) : null;
    const second = {n: 0, confirmed: 0, differs: 0, nothing: 0, ho: {n: 0, confirmed: 0}};
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
        // AU17 second reader (Haiku 5.5): a sentence both readers state (same verb and object) is confirmed; otherwise review-only.
        const r2 = replies2?.[id]?.reply;
        if (effect && r2 && p) {
            const e2 = r2.effect, at2 = loc(e2.locator);
            const ok2 = EFFECT_VERBS.includes(e2.verb) && OBJECTS.has(e2.object) && at2 && SPEAKERS.includes(e2.speaker) && e2.speaker !== 'unknown' && p.evidence.some(l => l.startsWith(`[${at2}]`));
            label.second = !ok2 ? 'states-nothing' : e2.verb === effect.verb && e2.object === effect.object ? 'confirmed' : 'differs';
            second.n++; second[label.second === 'confirmed' ? 'confirmed' : label.second === 'differs' ? 'differs' : 'nothing']++;
            if (s.heldOut) { second.ho.n++; if (label.second === 'confirmed') second.ho.confirmed++; }
        }
        labels[id] = label;
    }
    ledgers[ledger] = sorted(labels);
    scores[ledger] = {cohortRows: coh.n, cohortAnswered: coh.answered, cohortReaderSaidNone: coh.none, verbAgree: coh.verb, objectAgree: coh.object, bothAgree: coh.both,
        heldOut: coh.ho, secondReader: second};
    yieldTable[ledger] = {effectUnknownRows: blockedRows, zeroHitRows: blockedRows - sent, sent, gainedSentence: gained, readerStatedNothing: none, rejected, requestErrors: errors, catalogued: capCount.none ?? 0,
        blockedAfter: sorted(Object.fromEntries(Object.entries(capCount).filter(([k]) => k !== 'none')))};
}
// The located second reads use the same sentence vocabulary. The scores above still describe the batch.
const checkedGu = [
    ['candidate:east-window-gu', 'add', 'information', 'bound', 'lasting', 'ri:ch548:p81', 'demonstration',
        'item-state', 'persist written information on the Gu and read it back into another holder'],
    ['candidate:relic-gu', 'transform', 'form', 'self', 'lasting', 'ri:ch1796:p57', 'demonstration',
        'power-interaction', 'consume the matching-rank Gu and advance the aperture one stage'],
    ['saga:red-steel-relic-gu', 'transform', 'form', 'self', 'lasting', 'ri:ch145:p44', 'character_claim',
        'power-interaction', 'consume the matching-rank Gu and advance the aperture one stage'],
    ['saga:white-silver-relic-gu', 'transform', 'form', 'self', 'lasting', 'ri:ch111:p7', 'character_claim',
        'power-interaction', 'consume the matching-rank Gu and advance the aperture one stage'],
    ['saga:yellow-gold-relic-gu', 'transform', 'form', 'self', 'lasting', 'ri:ch358:p56', 'demonstration',
        'power-interaction', 'consume the matching-rank Gu and advance the aperture one stage'],
    ['saga:purple-crystal-relic-gu', 'transform', 'form', 'self', 'lasting', 'ri:ch475:p43', 'narrator',
        'power-interaction', 'consume the matching-rank Gu and advance the aperture one stage'],
    ['candidate:calamity-beckoning-gu', 'move', 'working', 'self', 'instant', 'ri:ch567:p3', 'narrator',
        'power-interaction', 'retarget an active tribulation from its original holder to the user'],
    ['candidate:demonic-blood-skull-gu', 'transform', 'form', 'self', 'lasting', 'ri:ch194:p80', 'demonstration',
        'power-interaction', 'use collected clan blood to raise the aperture’s aptitude and capacity'],
    ['wisdom', 'transform', 'mind', 'area', 'sustained', 'ri:ch637:p82', 'narrator',
        'mind-state', 'speed thought generation and collision inside the light while draining lifespan'],
    ['fandom:Time_Anchor_Gu', 'bind', 'relation', 'marked', 'lasting', 'ri:ch1810:p44', 'narrator',
        'time-manipulation', 'place a River of Time marker for another compatible working to read'],
    ['candidate:wolf-swallow-gu', 'bind', 'thing', 'bound', 'sustained', 'ri:ch464:p55', 'demonstration',
        'spatial-storage', 'hold items inside a Gu and preserve their custody'],
    ['candidate:primeval-elder-gu', 'bind', 'thing', 'bound', 'sustained', 'ri:ch422:p8', 'narrator',
        'spatial-storage', 'store and retrieve primeval stones against the Gu’s capacity'],
    ['candidate:battle-space-gu', 'move', 'position', 'bound', 'instant', 'ri:ch584:p14', 'character_claim',
        'portal-space', 'move both combatants into a sealed space and release them on victory or timeout'],
];
const gu = ledgers.gu_kinds ??= {};
for (const [id, verb, object, target, time, at, speaker, blocked, blockedReason] of checkedGu) {
    if (!VERB_ACCEPTS[verb]?.includes(EFFECT_OBJECTS[object]) || !EFFECT_TARGETS.includes(target)
        || !EFFECT_TIMES.includes(time) || !SPEAKERS.includes(speaker) || !CAPABILITIES.includes(blocked)) {
        throw Error(`invalid reviewed Gu effect: ${id}`);
    }
    const label = gu[id] ??= {heldOut: createHash('sha1').update(id).digest()[0] < 0x33};
    delete label.second;
    Object.assign(label, {effect: {verb, object, target, time, at, speaker}, blocked, blockedReason, secondRead: 'agree'});
}
ledgers.gu_kinds = sorted(gu);
const file = `${root}docs/coverage/chapter_tier_labels.json`;
const out = json(file);
out.effect_unknown = {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#pwc27-effect-unknown-from-chapters-2026-11-17-proposals', model: 'gpt-6-luna (low effort, batch)', date: '2026-11-17',
    tier: 'chapter (GKM445): one effect sentence per row from cited chapter paragraphs, one reader, unchecked', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'}, scores, yield: yieldTable, ledgers};
writeFileSync(file, JSON.stringify(out).replace(/},"/g, '},\n"') + '\n');
console.log(JSON.stringify({scores, yield: yieldTable}, null, 1));
