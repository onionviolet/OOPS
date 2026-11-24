#!/usr/bin/env node
// Chapter-tier labels (R5 / PWC15, GKM445): normalises the private chapter passes (scripts/chapter_tier_pass.mjs, packets from
// scripts/chapter_tier_packets.py) into docs/coverage/chapter_tier_labels.json, a tier above the wiki tier
// (docs/coverage/wiki_tier_labels.json). Only normalised values, locators and speakers are committed; paraphrases and the
// chapter text stay in the gitignored private folder. A cited locator is kept only when it starts a line of the packet that
// was sent (a model cannot cite a paragraph it was not shown), and a speaker "wiki" or "unknown" is not a chapter speaker.
// Scores (meta.scores) put the held-out rows (GKM429: sha1(id)[0] < 0x33) apart from the rest.
// Usage: node scripts/chapter_tier_labels.mjs
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
const src = process.env.LABEL_SOURCE_ROOT ? `${process.env.LABEL_SOURCE_ROOT.replace(/\/$/, '')}/` : root;
const priv = `${src}docs/research/advancement-aspects-2026-11-16/private/`;
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;
const wiki = json(`${root}docs/coverage/wiki_tier_labels.json`);
const sorted = o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const loc = l => (l ?? '').replace(/^\[|\]$/g, '').trim();
const SPEAKERS = new Set(['narrator', 'character_claim', 'demonstration']);

const corpus = name => {
    const f = `${priv}ch_${name}_luna.json`;
    if (!existsSync(f)) return null;
    return {replies: json(f), packets: new Map(json(`${priv}ch_${name}_packets.json`).map(p => [p.id, p])), search: json(`${priv}ch_${name}_search.json`)};
};
// A field is chapter-backed when it has a value, a locator that starts a sent packet line, and a chapter speaker.
const backed = (packet, f) => {
    if (!f?.value) return null;
    const l = loc(f.locator);
    if (!l || !SPEAKERS.has(f.speaker)) return null;
    return l.split(';').every(part => packet.evidence.some(e => e.startsWith(`[${part.trim()}]`))) ? {locator: l, speaker: f.speaker} : null;
};

import {normaliseRank} from './chapter_tier_labels_lib.mjs';
export {normaliseRank};

const pct = (n, d) => (d ? `${n} of ${d}` : 'none');
const split = (rows, f) => ({all: rows.filter(f), heldOut: rows.filter(r => r.heldOut && f(r))});
const out = {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#r5-chapter-tier-checks', model: 'gpt-6-luna (low effort, batch)', date: '2026-11-16',
    tier: 'chapter (GKM445): Luna over cited chapter paragraphs, one reader, above the wiki tier', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'}};
const scores = {};

// ---------- Gu kinds ----------
const gu = {}, g = corpus('gu_kinds');
if (g) {
    const rows = [];
    for (const [id, s] of Object.entries(g.search)) {
        const label = {heldOut: heldOut(id), role: s.role, chapterHits: s.paragraphHits, claimHits: s.claimHits};
        const r = g.replies[id]?.reply, p = g.packets.get(id);
        const rank = r && p ? normaliseRank(r.rank.value) : null;
        const at = r && p ? backed(p, r.rank) : null;
        if (rank && at) Object.assign(label, {rank: rank.rank, rankBasis: rank.basis, rankAt: at});
        // Kinds named in the wiki tier (Luna on wiki text): the score is against the wiki rank where there is one.
        const luna = wiki.gu_kinds[id]?.rank ?? null;
        rows.push({id, heldOut: label.heldOut, role: s.role, sent: s.sent, chapterRank: label.rank ?? null, wikiCategory: s.wikiRank, wikiTier: luna});
        gu[id] = label;
    }
    const cohort = rows.filter(r => r.role === 'cohort' && r.chapterRank !== null), blocked = rows.filter(r => r.role === 'blocked');
    const agree = rs => ({n: rs.length, exact: rs.filter(r => r.chapterRank === r.wikiCategory).length, within1: rs.filter(r => Math.abs(r.chapterRank - r.wikiCategory) <= 1).length});
    const bw = blocked.filter(r => r.wikiTier !== null && r.chapterRank !== null);
    scores.gu_kinds = {
        blockedRows: blocked.length, blockedWithChapterText: blocked.filter(r => r.sent).length, blockedNowRanked: blocked.filter(r => r.chapterRank !== null).length,
        blockedNowRankedHeldOut: blocked.filter(r => r.chapterRank !== null && r.heldOut).length,
        cohortRows: rows.filter(r => r.role === 'cohort').length, cohortRanked: cohort.length,
        cohortAgainstWikiCategory: agree(cohort), cohortAgainstWikiCategoryHeldOut: agree(cohort.filter(r => r.heldOut)),
        blockedAgainstWikiTier: {n: bw.length, exact: bw.filter(r => r.chapterRank === r.wikiTier).length}};
}
out.gu_kinds = sorted(gu);

// ---------- Lord of the Mysteries potions ----------
const key = n => n.toLowerCase().replace(/[’']/g, "'").replace(/\b(the|a|an|of)\b/g, '').replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
const same = (a, b) => key(a) && key(b) && (key(a) === key(b) || key(a).includes(key(b)) || key(b).includes(key(a)));
const lotm = {}, l = corpus('lotm_potions');
if (l) {
    const rows = [];
    for (const [id, s] of Object.entries(l.search)) {
        const label = {heldOut: heldOut(id), chapterHits: s.paragraphHits};
        const r = l.replies[id]?.reply, p = l.packets.get(id);
        if (r && p) {
            const item = m => { const at = backed(p, {value: m.name, locator: m.locator, speaker: m.speaker}); return at && m.name.trim().split(/\s+/).length <= 8 ? {name: m.name.trim(), ...at, ...(m.cite ? {cite: m.cite} : {})} : null; };
            const mains = r.mains.map(item).filter(Boolean), aux = r.aux.map(item).filter(Boolean);
            if (mains.length) label.mains = mains;
            if (aux.length) label.supplementary = aux;
        }
        rows.push({id, heldOut: label.heldOut, sent: s.sent, mains: (label.mains ?? []).map(m => m.name), wikiMains: (wiki.lotm_potions[id]?.mains ?? []).map(m => m.name)});
        lotm[id] = label;
    }
    const both = rows.filter(r => r.mains.length && r.wikiMains.length);
    const cmp = rs => ({n: rs.length, anyMainShared: rs.filter(r => r.mains.some(m => r.wikiMains.some(w => same(m, w)))).length,
        wikiMainsFound: rs.reduce((s, r) => s + r.wikiMains.filter(w => r.mains.some(m => same(m, w))).length, 0), wikiMains: rs.reduce((s, r) => s + r.wikiMains.length, 0),
        chapterMainsInWiki: rs.reduce((s, r) => s + r.mains.filter(m => r.wikiMains.some(w => same(m, w))).length, 0), chapterMains: rs.reduce((s, r) => s + r.mains.length, 0)});
    scores.lotm_potions = {rows: rows.length, withChapterText: rows.filter(r => r.sent).length, withChapterMains: rows.filter(r => r.mains.length).length,
        rowsWithWikiMains: rows.filter(r => r.wikiMains.length).length, bothTiers: cmp(both), bothTiersHeldOut: cmp(both.filter(r => r.heldOut))};
}
out.lotm_potions = sorted(lotm);

// ---------- Hogwarts ingredients ----------
const hp = {}, h = corpus('hp_ingredients');
if (h) {
    const rows = [];
    for (const [id, s] of Object.entries(h.search)) {
        const label = {heldOut: heldOut(id), chapterHits: s.windowHits};
        const r = h.replies[id]?.reply, p = h.packets.get(id);
        if (r && p) {
            const kindAt = backed(p, r.kind);
            if (kindAt) Object.assign(label, {kind: r.kind.value, kindAt});
            const axes = r.axes.map(a => ({axis: a.axis, level: a.level, ...backed(p, {value: a.axis, locator: a.locator, speaker: a.speaker})})).filter(a => a.locator);
            if (axes.length) label.axes = axes;
            for (const k of ['hazards', 'direct_effect']) { const at = backed(p, r[k]); if (at) label[`${k}At`] = at; }
        }
        const w = wiki.hp_ingredients[id];
        rows.push({id, heldOut: label.heldOut, sent: s.sent, axes: (label.axes ?? []).map(a => a.axis), wikiAxes: (w?.axes ?? []).map(a => a.axis), kind: label.kind ?? null, wikiKind: w?.kind ?? null});
        hp[id] = label;
    }
    const both = rows.filter(r => r.axes.length && r.wikiAxes.length);
    const cmp = rs => ({n: rs.length, anyAxisShared: rs.filter(r => r.axes.some(a => r.wikiAxes.includes(a))).length,
        wikiAxesFound: rs.reduce((s, r) => s + r.wikiAxes.filter(a => r.axes.includes(a)).length, 0), wikiAxes: rs.reduce((s, r) => s + r.wikiAxes.length, 0)});
    const kinds = rows.filter(r => r.kind && r.wikiKind);
    scores.hp_ingredients = {rows: rows.length, withChapterText: rows.filter(r => r.sent).length, withChapterAxes: rows.filter(r => r.axes.length).length,
        bothTiers: cmp(both), bothTiersHeldOut: cmp(both.filter(r => r.heldOut)),
        kindAgree: {n: kinds.length, same: kinds.filter(r => r.kind === r.wikiKind).length, heldOut: {n: kinds.filter(r => r.heldOut).length, same: kinds.filter(r => r.heldOut && r.kind === r.wikiKind).length}}};
}
out.hp_ingredients = sorted(hp);
// Second reader (PWC19, scripts/second_readers_score.mjs): a field Haiku did not reproduce drops to unconfirmed, kept beside the label
// under <field>Unconfirmed and read by no ledger. Scores above stay the one-reader scores.
const checksFile = `${root}docs/coverage/second_reader_checks.json`;
if (existsSync(checksFile)) {
    const checks = json(checksFile), counts = {gu_kinds: 0, lotm_potions: 0, hp_ingredients: 0};
    for (const [id, c] of Object.entries(checks.gu_kinds ?? {})) {
        const l = out.gu_kinds[id]; if (!l) continue;
        l.secondRead = c.status;
        if (c.status !== 'agree') { l.rankUnconfirmed = {rank: l.rank, basis: l.rankBasis, at: l.rankAt}; delete l.rank; delete l.rankBasis; delete l.rankAt; counts.gu_kinds++; }
    }
    for (const [id, c] of Object.entries(checks.lotm_potions ?? {})) {
        const l = out.lotm_potions[id]; if (!l) continue;
        l.secondRead = c.status;
        const drop = l.mains.filter(m => c.mains[m.name] !== 'agree');
        if (drop.length) { l.mainsUnconfirmed = drop; l.mains = l.mains.filter(m => !drop.includes(m)); if (!l.mains.length) delete l.mains; counts.lotm_potions++; }
    }
    for (const [id, c] of Object.entries(checks.hp_ingredients ?? {})) {
        const l = out.hp_ingredients[id]; if (!l) continue;
        l.secondRead = c.status;
        const drop = l.axes.filter(a => c.axes[a.axis] !== 'agree');
        if (drop.length) { l.axesUnconfirmed = drop; l.axes = l.axes.filter(a => !drop.includes(a)); if (!l.axes.length) delete l.axes; counts.hp_ingredients++; }
    }
    scores.secondReader = {fieldsDropped: counts, source: 'docs/coverage/second_reader_checks.json'};
}
out.meta.scores = scores;
// Located second reads for the 2026-11-24 Gu leads. Keep the batch's scores on its original labels.
const guRankReads = [
    ['photo-audio', 3, 'ri:ch156:p22'],
    ['group-strength', 5, 'ri:ch678:p58'],
    ['saga:paper-crane-gu', 2, 'ri:ch323:p98'],
    ['saga:vagrant-warrior-gu', 3, 'ri:ch2065:p12'],
    ['blood-asset', 6, 'ri:ch1063:p55'],
    ['candidate:pill-fire-gu', 3, 'ri:ch312:p96'],
    ['candidate:east-window-gu', 4, 'ri:ch516:p63'],
    ['candidate:relic-gu', 1, 'ri:ch1796:p38'], // Kept catalogue identity is the Green Copper variant.
    ['saga:red-steel-relic-gu', 2, 'ri:ch1796:p38'],
    ['saga:white-silver-relic-gu', 3, 'ri:ch1796:p38'],
    ['saga:yellow-gold-relic-gu', 4, 'ri:ch1796:p38'],
    ['saga:purple-crystal-relic-gu', 5, 'ri:ch1796:p38'],
    ['candidate:sovereign-immortal-fetus-gu', 9, 'ri:ch1018:p69', 'character_claim'],
    ['candidate:second-aperture-gu', 6, 'ri:ch377:p61'],
    ['candidate:calamity-beckoning-gu', 7, 'ri:ch567:p2'],
    ['candidate:demonic-blood-skull-gu', 4, 'ri:ch194:p74'],
    ['candidate:derivation-gu', 9, 'ri:ch2291:p24'],
    ['wisdom', 9, 'ri:ch637:p80'],
    ['fandom:Fortune_Rivalling_Heaven_Gu', 8, 'ri:ch622:p8'],
    ['self-strength', 6, 'ri:ch1291:p83'],
    ['candidate:dark-limit-immortal-gu', 6, 'ri:ch1063:p55'],
    ['fandom:Time_Anchor_Gu', 6, 'ri:ch1810:p41'],
];
const guTypeReads = [
    ['candidate:wolf-swallow-gu', 'storage', 'ri:ch459:p36'],
    ['candidate:primeval-elder-gu', 'storage', 'ri:ch422:p8'],
    ['candidate:battle-space-gu', 'space path', 'ri:ch584:p14', 'character_claim'],
    ['fandom:Keep_Silent_Gu', 'sound path', 'ri:ch841:p28'],
    ['fandom:Smelly_Fart_Fat_Worm_Gu', 'poison path', 'ri:ch2098:p7'],
];
const guLabel = id => out.gu_kinds[id] ??= {heldOut: heldOut(id)};
for (const [id, rank, locator, speaker = 'narrator'] of guRankReads) {
    const label = guLabel(id);
    delete label.rankUnconfirmed;
    Object.assign(label, {rank, rankBasis: 'chapter-stated', rankAt: {locator, speaker}, secondRead: 'agree'});
}
for (const [id, type, locator, speaker = 'narrator'] of guTypeReads) {
    Object.assign(guLabel(id), {type, typeAt: {locator, speaker}, typeSecondRead: 'agree'});
}
out.gu_kinds = sorted(out.gu_kinds);
// PWC27 writes its own section (scripts/chapter_effect_labels.mjs); keep it when this script rewrites the file.
const prior = existsSync(`${root}docs/coverage/chapter_tier_labels.json`) ? json(`${root}docs/coverage/chapter_tier_labels.json`) : {};
if (prior.effect_unknown) out.effect_unknown = prior.effect_unknown;
writeFileSync(`${root}docs/coverage/chapter_tier_labels.json`, JSON.stringify(out).replace(/},"/g, '},\n"') + '\n');
console.log(JSON.stringify(scores, null, 1));
