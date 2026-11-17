#!/usr/bin/env node
// Folds the private replies of scripts/ri_move_claim_check.mjs into docs/coverage/ri_move_claim_checks.json:
// normalised values with their claim locators and both readers' answers, no paraphrases (SKR3, SKR18).
// scripts/gu_coverage_ledgers.mjs reads it in leadState. Deterministic for the same replies.
// Rules (GKM427, GKM429, GKM430, proposal 2026-11-16):
//   A lead passes when both readers place every listed component in the move (core or support) with a claim
//   locator. When both say a claim names further unnamed parts, it is blocked on an unnamed role. Roles where
//   the readers split (core against support) keep both answers; the composition does not read roles.
//   A kind's rank or function counts when both readers give the same value with a claim locator; REVIEWED
//   rows below settle a split or a reader error from the held chapter text, each with its reason.
// The held-out split is the wiki-tier one (sha1 below 0x33, wiki_tier_labels.json `heldOut`); no rule here is
// fitted to these answers, so held-out leads are folded and counted apart.
// Usage: node scripts/ri_move_claim_fold.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {PRIVATE} from './ri_move_claim_check.mjs';

const root = new URL('..', import.meta.url).pathname;
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const replies = name => Object.fromEntries(Object.entries(json(join(PRIVATE, `${name}.json`))).map(([id, r]) => [id, r.reply]));
const tier = json(join(root, 'docs/coverage/wiki_tier_labels.json'));
const moveL = replies('ri_move_check_luna'), moveH = replies('ri_move_check_haiku');
const kindL = replies('ri_kind_check_luna'), kindH = replies('ri_kind_check_haiku');

// Wiki-tier kind ids that now have a catalogue entry (gu_catalogue.js, gu-identity-evidence.json).
export const CATALOGUE_OF = Object.freeze({'fandom:Small_Immortal_Gu': 'small', 'fandom:Great_Thief_Immortal_Gu': 'great-thief',
    'candidate:heavenly-web-gu': 'heavenly-web'});
// Reviewed against the held chapter text (private English copy), 2026-11-16.
const REVIEWED = {
    'fandom:Great_Thief_Immortal_Gu': {function: 'steal', at: 'ch2290', why: 'Readers split steal and conceal; chapter 2290 names it the second core of Stealing Heavenly Secret, which takes answers from heaven.'},
    'candidate:heavenly-web-gu': {rank: 8, function: 'suppress', at: 'ch2306', why: 'Chapter 2306 tells rank-eight and rank-nine specimens apart (lowest stated rank 8) and says that alone it traps a target, an offensive Gu, though its move guards.'},
    'heavenly-secret': {rank: 9, function: 'sense', at: 'ch2290', why: 'Readers split rank 9 and 7 and function steal and sense; chapter 2290 calls it rank nine now and says it was made to sense heaven and earth and question heaven\'s will.'},
    'fandom:Limit_Gu': {rank: null, at: 'ch1346', why: 'Both readers took rank six from claim RI-c1346-03, but the chapter says rank six of Dark Limit Immortal Gu, another kind; no rank stands.'},
};

const loc = s => String(s ?? '').replace(/^\[|\]$/g, '').trim();
const inMove = v => v === 'core' || v === 'support';
const number = s => {
    const words = {one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9};
    const m = String(s ?? '').toLowerCase().match(/\b([1-9]|one|two|three|four|five|six|seven|eight|nine)\b/);
    return m ? Number(words[m[1]] ?? m[1]) : null;
};

const leads = {};
for (const id of Object.keys(moveL).sort()) {
    const l = moveL[id], h = moveH[id];
    const wiki = tier.gu_moves[id].components;
    const components = wiki.map((c, i) => {
        const a = l.components[i], b = h.components.find(x => x.gu === a?.gu) ?? h.components[i];
        return {kind: c.kind, catalogue: CATALOGUE_OF[c.kind] ?? null, wikiRole: c.role, luna: a?.verdict ?? 'not-stated',
            haiku: b?.verdict ?? 'not-stated', at: loc(a?.locator) || loc(b?.locator) || null, speaker: a?.speaker ?? 'unknown'};
    });
    const placed = components.every(c => inMove(c.luna) && inMove(c.haiku) && c.at);
    const unnamed = l.unnamed_parts === 'yes' && h.unnamed_parts === 'yes';
    const further = l.other_gu.filter(g => h.other_gu.some(x => x.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(x.toLowerCase())));
    leads[id] = {heldOut: tier.gu_moves[id].heldOut, result: !placed ? 'unplaced' : unnamed ? 'unnamed-parts' : further.length ? 'further-gu' : 'pass',
        components, ...(unnamed && {unnamedAt: loc(l.unnamed_locator) || loc(h.unnamed_locator) || null}),
        ...(!unnamed && (l.unnamed_parts === 'yes' || h.unnamed_parts === 'yes') && {unnamedOneReader: l.unnamed_parts === 'yes' ? 'luna' : 'haiku'}),
        ...(further.length && {furtherGu: further}), orderStated: Boolean(l.order && h.order)};
}

const kinds = {};
for (const id of Object.keys(kindL).sort()) {
    const l = kindL[id], h = kindH[id], review = REVIEWED[id] ?? {};
    const rl = number(l.rank), rh = number(h.rank);
    const rank = 'rank' in review ? review.rank : rl !== null && rl === rh && loc(l.rank_locator) ? rl : null;
    const fn = 'function' in review ? review.function : l.function !== 'none' && l.function === h.function && loc(l.function_locator) ? l.function : null;
    kinds[id] = {rank, function: fn, readers: {rank: [rl, rh], function: [l.function, h.function]},
        rankAt: rank === null ? null : 'rank' in review ? review.at : loc(l.rank_locator),
        functionAt: fn === null ? null : 'function' in review ? review.at : loc(l.function_locator),
        ...(review.why && {reviewed: review.why}), catalogue: CATALOGUE_OF[id] ?? null};
}

const count = (rows, f) => Object.values(rows).filter(f).length;
const meta = {pass: 'ri_move_claim_check 2026-11-16 (Luna low effort, then Haiku 5.5 low effort, same packets); $0.09 for 264 calls',
    evidence: 'paid Reverend Insanity reader claims (readers/*-CLAIMS.json) joined by scripts/ri_move_claims_join.mjs',
    leadsChecked: Object.keys(leads).length,
    results: Object.fromEntries(['pass', 'unnamed-parts', 'further-gu', 'unplaced'].map(r => [r, count(leads, x => x.result === r)])),
    heldOutPass: `${count(leads, x => x.heldOut && x.result === 'pass')} of ${count(leads, x => x.heldOut)}`,
    kindsChecked: Object.keys(kinds).length, kindsWithRankAndFunction: count(kinds, k => k.rank !== null && k.function)};
writeFileSync(join(root, 'docs/coverage/ri_move_claim_checks.json'),
    `{"meta": ${JSON.stringify(meta)},\n"leads": {\n${Object.entries(leads).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')}\n},\n"kinds": {\n${Object.entries(kinds).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')}\n}}\n`);
console.log(JSON.stringify(meta));
