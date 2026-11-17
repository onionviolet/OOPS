#!/usr/bin/env node
// Scores the second-reader passes (scripts/second_readers.mjs) and writes docs/coverage/second_reader_checks.json: values, ids and
// counts only (replies stay private). Rules fixed before any reply was read (PWC19):
//   Chapter fields (Gu rank, LOTM main, Hogwarts axis): Haiku re-reads the same packet with the same prompt. A field is `agree` when
//   Haiku gives the same value with a locator that opens a line of the packet and a chapter speaker (same `backed` test as R5), `differ`
//   when it gives another value, `absent` when it gives none. `differ` and `absent` both drop the field to unconfirmed.
//   Weak fields: Haiku at medium effort is scored against the same truth as Luna was (diet: stated food's category over the 44 rows;
//   sentence: the 17 held-out evidence sentences), and against Luna's own answers, so the second score says model or evidence.
//   Hogwarts wiki check: Luna judges each derived axis against the wiki description; scored on labelled rows against the stated axes.
//   A derived axis folds as checked only when the check's `supported` precision on held-out rows beats the derived top axis's own
//   held-out rate (5 of 12); otherwise the check is recorded and nothing folds.
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {HP_POTION_EFFECTS, assemblePotionEffect} from '../src/world_packs/brew_effects_pack.js';
import {normaliseRank} from './chapter_tier_labels_lib.mjs';

const root = new URL('..', import.meta.url).pathname;
const priv = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const maybe = f => existsSync(f) ? json(f) : {};
const replies = f => Object.fromEntries(Object.entries(maybe(f)).filter(([, r]) => r.reply).map(([id, r]) => [id, r.reply]));
const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;
const chapter = json(`${root}docs/coverage/chapter_tier_labels.json`), wiki = json(`${root}docs/coverage/wiki_tier_labels.json`);
const loc = l => (l ?? '').replace(/^\[|\]$/g, '').trim();
const SPEAKERS = new Set(['narrator', 'character_claim', 'demonstration']);
const backed = (packet, f) => {
    if (!f?.value || !SPEAKERS.has(f.speaker)) return false;
    const l = loc(f.locator);
    return !!l && l.split(';').every(part => packet.evidence.some(e => e.startsWith(`[${part.trim()}]`)));
};
// Haiku writes ranks as words ("rank eight"); Luna wrote digits, so the second reader's words are turned into digits here only.
const WORDS = {one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9};
const digits = t => (t ?? '').replace(/\b(one|two|three|four|five|six|seven|eight|nine)\b/gi, w => WORDS[w.toLowerCase()]);
const key = n => n.toLowerCase().replace(/[’']/g, "'").replace(/\b(the|a|an|of)\b/g, '').replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
const same = (a, b) => key(a) && key(b) && (key(a) === key(b) || key(a).includes(key(b)) || key(b).includes(key(a)));
const tally = vs => vs.reduce((a, v) => ({...a, [v]: (a[v] ?? 0) + 1}), {});
const out = {meta: {pass: 'docs/research/power-catalogues-2026-11-16/README.md#second-readers-and-lotm-mains-2026-11-17-proposals', date: '2026-11-17',
    chapterReader: 'claude-haiku-5-5, low effort, batch, one read each, same packets and prompts as R5', weakReader: 'claude-haiku-5-5, medium effort, batch',
    wikiCheck: 'gpt-6-luna, low effort, batch', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'}, scores: {}};

// ---- chapter fields ----
const second = {};
for (const corpus of ['gu_kinds', 'lotm_potions', 'hp_ingredients']) {
    const rep = replies(`${priv}ch2_${corpus}_haiku.json`);
    if (!Object.keys(rep).length) continue;
    const packets = new Map(json(`${priv}ch_${corpus}_packets.json`).map(p => [p.id, p]));
    const rows = {};
    for (const [id, label] of Object.entries(chapter[corpus])) {
        const r = rep[id], p = packets.get(id);
        if (!r || !p) continue;
        if (corpus === 'gu_kinds' && label.role === 'blocked' && label.rank) {
            const h = backed(p, r.rank) ? normaliseRank(digits(r.rank.value)) : null;
            rows[id] = {field: 'rank', value: label.rank, haiku: h?.rank ?? null, status: !h ? 'absent' : h.rank === label.rank ? 'agree' : 'differ'};
        } else if (corpus === 'lotm_potions' && label.mains?.length) {
            const hm = r.mains.filter(m => backed(p, {value: m.name, locator: m.locator, speaker: m.speaker})).map(m => m.name);
            rows[id] = {field: 'mains', mains: Object.fromEntries(label.mains.map(m => [m.name, hm.some(x => same(x, m.name)) ? 'agree' : 'unconfirmed'])),
                haikuExtra: hm.filter(x => !label.mains.some(m => same(x, m.name))).length};
            rows[id].status = Object.values(rows[id].mains).every(v => v === 'agree') ? 'agree' : Object.values(rows[id].mains).some(v => v === 'agree') ? 'partial' : 'differ';
        } else if (corpus === 'hp_ingredients' && label.axes?.length) {
            const ha = r.axes.filter(a => backed(p, {value: a.axis, locator: a.locator, speaker: a.speaker})).map(a => a.axis);
            rows[id] = {field: 'axes', axes: Object.fromEntries(label.axes.map(a => [a.axis, ha.includes(a.axis) ? 'agree' : 'unconfirmed'])), haikuExtra: ha.filter(a => !label.axes.some(x => x.axis === a)).length};
            rows[id].status = Object.values(rows[id].axes).every(v => v === 'agree') ? 'agree' : Object.values(rows[id].axes).some(v => v === 'agree') ? 'partial' : 'differ';
        }
    }
    second[corpus] = Object.fromEntries(Object.entries(rows).sort(([a], [b]) => a.localeCompare(b)));
    const vs = Object.values(rows);
    out.scores[corpus] = {fields: vs.length, status: tally(vs.map(v => v.status)), heldOut: tally(vs.filter((_, i) => heldOut(Object.keys(rows)[i])).map(v => v.status)),
        ...(corpus === 'lotm_potions' ? {mainsAgree: vs.reduce((n, v) => n + Object.values(v.mains).filter(x => x === 'agree').length, 0), mains: vs.reduce((n, v) => n + Object.keys(v.mains).length, 0)} : {}),
        ...(corpus === 'hp_ingredients' ? {axesAgree: vs.reduce((n, v) => n + Object.values(v.axes).filter(x => x === 'agree').length, 0), axes: vs.reduce((n, v) => n + Object.keys(v.axes).length, 0)} : {})};
}
Object.assign(out, second);

// ---- weak fields ----
const follow = n => replies(`${priv}${n}_followup.json`);
const dietH = replies(`${priv}weak_diet_haiku.json`), dietL = follow('gu_diet'), stated = follow('gu_food_stated');
if (Object.keys(dietH).length) {
    const ids = Object.keys(stated).filter(id => dietH[id] && dietL[id]);
    const at = (src, ho) => ids.filter(id => (!ho || heldOut(id)) && src[id].category === stated[id].category).length;
    out.scores.weak_diet = {rows: ids.length, heldOut: ids.filter(heldOut).length, luna: {agree: at(dietL), heldOut: at(dietL, true)}, haiku: {agree: at(dietH), heldOut: at(dietH, true)},
        haikuAgreesWithLuna: ids.filter(id => dietH[id].category === dietL[id].category).length,
        bothRight: ids.filter(id => dietH[id].category === stated[id].category && dietL[id].category === stated[id].category).length,
        eitherRight: ids.filter(id => dietH[id].category === stated[id].category || dietL[id].category === stated[id].category).length,
        majorityBaseline: Math.max(...Object.values(tally(ids.map(id => stated[id].category))))};
}
const sentH = replies(`${priv}weak_sentence_haiku.json`);
if (Object.keys(sentH).length) {
    const {hpSplit} = await import('./label_followups.mjs');
    const held = hpSplit().heldOut, sentL = follow('hp_sentence'), keys = ['verb', 'object', 'target', 'time', 'carrier'];
    const score = src => ({answered: held.filter(r => src[r.id]).length, ...Object.fromEntries(keys.map(k => [k, held.filter(r => src[r.id]?.[k] === r.parts[k]).length])),
        verbAndObject: held.filter(r => src[r.id]?.verb === r.parts.verb && src[r.id]?.object === r.parts.object).length,
        allFive: held.filter(r => keys.every(k => src[r.id]?.[k] === r.parts[k])).length,
        grammarValid: held.filter(r => src[r.id] && src[r.id].verb !== 'none' && src[r.id].object !== 'none' && assemblePotionEffect(HP_POTION_EFFECTS, {...src[r.id], cost: 'ingredients'}).ok).length});
    out.scores.weak_sentence = {heldOut: held.length, luna: score(sentL), haiku: score(sentH), verbAgreement: held.filter(r => sentH[r.id] && sentL[r.id] && sentH[r.id].verb === sentL[r.id].verb).length,
        eitherVerbRight: held.filter(r => sentH[r.id]?.verb === r.parts.verb || sentL[r.id]?.verb === r.parts.verb).length};
}

// ---- Hogwarts wiki check ----
const chk = replies(`${priv}hp_wiki_check_luna.json`);
if (Object.keys(chk).length) {
    const {targets} = await import('./second_readers_hp.mjs');
    const t = targets(), rows = {};
    const statedOf = id => [...(wiki.hp_ingredients[id]?.axes ?? []), ...(chapter.hp_ingredients[id]?.axes ?? [])].map(a => a.axis);
    const stat = rs => {
        const checks = rs.flatMap(x => x.axes.map(a => ({a, v: chk[x.id].axes.find(y => y.axis === a)?.verdict ?? 'missing', truth: statedOf(x.id).includes(a), top: a === x.axes[0]})));
        const sup = checks.filter(c => c.v === 'supported'), con = checks.filter(c => c.v === 'contradicted');
        return {sets: rs.length, axes: checks.length, verdicts: tally(checks.map(c => c.v)),
            topSupported: checks.filter(c => c.top && c.v === 'supported').length, topContradicted: checks.filter(c => c.top && c.v === 'contradicted').length,
            supportedInStated: sup.filter(c => c.truth).length, supported: sup.length, contradictedInStated: con.filter(c => c.truth).length, contradicted: con.length,
            axesInStated: checks.filter(c => c.truth).length};
    };
    const done = t.filter(x => chk[x.id]);
    const lab = done.filter(x => x.labelled);
    out.scores.hp_wiki_check = {derivedSets: done.length, unlabelled: stat(done.filter(x => !x.labelled)), labelled: stat(lab), heldOut: stat(lab.filter(x => heldOut(x.id))),
        derivedOwnHeldOutTop: '5 of 12 (docs/coverage/hp_derived_score.json)'};
    const h = out.scores.hp_wiki_check.heldOut;
    out.scores.hp_wiki_check.fold = {rule: 'supported precision on held-out rows must beat 5/12', precision: h.supported ? Number((h.supportedInStated / h.supported).toFixed(3)) : null,
        folds: h.supported >= 10 && h.supportedInStated / h.supported > 5 / 12};
}

writeFileSync(`${root}docs/coverage/second_reader_checks.json`, JSON.stringify(out, null, 1).replace(/\n\s+/g, m => m) + '\n');
console.log(JSON.stringify(out.scores, null, 1));
