#!/usr/bin/env node
// Wiki-tier labels (GKM445): normalises the private Luna label passes (scripts/label_pass.mjs) into
// docs/coverage/wiki_tier_labels.json, which the Gu and potion ledger builds read. Only normalised values,
// locators and speakers are committed; the paraphrases stay in the gitignored private folder. The held-out
// split (GKM429) is fixed by hash: a row whose sha1(id) starts below 0x33 (about a fifth) is held out, and
// any later rule fitted to these labels (function words, diet defaults, route words) fits on the rest and
// reports held-out agreement apart. The ledgers fold every row because their tables were not fitted here.
// Usage: node scripts/wiki_tier_labels.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {kindWordFunction, keywordFunction} from './gu_function_words.mjs';
import {potionFamily} from './b_coverage_ledgers.mjs';

const root = new URL('..', import.meta.url).pathname;
const priv = `${root}docs/research/advancement-aspects-2026-11-16/private/`;
const index = JSON.parse(readFileSync(`${root}docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json`, 'utf8'));
const read = name => JSON.parse(readFileSync(`${priv}${name}_luna.json`, 'utf8'));
const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;
const at = f => f?.value ? {locator: f.locator.replace(/^\[|\]$/g, ''), speaker: f.speaker} : null;
const sorted = obj => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

// Rank: the lowest stated rank, the ledger's existing meaning. "At least N" is a lower bound; a value with
// "?" or "unknown" in it gives no rank, since its numbers may be upper bounds.
export function normaliseRank(text) {
    const t = (text ?? '').trim();
    if (!t) return null;
    const lower = /\bat least (?:rank )?([1-9])\b/i.exec(t);
    if (lower) return {rank: Number(lower[1]), basis: 'wiki-tier-lower-bound'};
    if (/\?|unknown|uncertain|unclear/i.test(t)) return null;
    const nums = [...t.matchAll(/(?<![\d.])([1-9])(?![\d.])/g)].map(m => Number(m[1]));
    if (!nums.length) return null;
    return {rank: Math.min(...nums), basis: nums.length > 1 ? 'wiki-tier-lowest' : 'wiki-tier-stated'};
}

const gu = {};
for (const [id, row] of Object.entries(read('gu_kinds'))) {
    const r = row.reply;
    if (!r) continue;
    const rank = normaliseRank(r.rank.value);
    const byKind = kindWordFunction(r.kind.value);
    const byEffect = byKind ? null : keywordFunction(r.effect.value);
    const label = {heldOut: heldOut(id)};
    if (rank) Object.assign(label, {rank: rank.rank, rankBasis: rank.basis, rankAt: at(r.rank)});
    // The name keywords agree with the kind word on 32 of 58 kinds where both fire (2026-11-16), too weak to run a
    // row on, so an effect-keyword family is kept as a guess for a later mapping pass and never runs.
    if (byKind) Object.assign(label, {function: byKind, functionBasis: 'wiki-tier-kind-word', functionAt: at(r.kind)});
    else if (byEffect) Object.assign(label, {functionGuess: byEffect, functionGuessBasis: 'wiki-tier-effect-keyword (32 of 58 agree with kind words)'});
    for (const key of ['effect', 'food', 'feeding_interval', 'starving', 'activation_cost', 'refinement']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    gu[id] = label;
}

const norm = s => (s ?? '').toLowerCase().replace(/[’']/g, "'").replace(/\s+(immortal\s+)?gu\.?$/, '').trim();
const kindIds = new Map(index.records.map(rec => [norm(rec.saga?.name ?? rec.fandom?.name ?? rec.id), rec.id]));
const role = text => /\bcore\b/i.test(text) ? 'core' : /\bsupport/i.test(text) ? 'support'
    : /\b(refin|product|result|form(s|ed)? into|becomes)\b/i.test(text) ? 'product' : 'other';
const moves = {};
for (const [id, row] of Object.entries(read('ri_moves'))) {
    const r = row.reply;
    if (!r) continue;
    const components = r.components.filter(c => /\bgu\.?$/i.test(c.gu.trim())).map(c => ({
        kind: kindIds.get(norm(c.gu)) ?? null, ...(kindIds.has(norm(c.gu)) ? {} : {name: c.gu.trim()}),
        role: role(c.role), locator: c.locator.replace(/^\[|\]$/g, ''), speaker: c.speaker}));
    const label = {heldOut: heldOut(id)};
    const parts = components.filter(c => c.role !== 'product');
    if (parts.length) label.components = parts;
    for (const key of ['cost', 'conditions', 'effect', 'counters', 'path', 'rank']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    moves[id] = label;
}

// Route words: drinking first, so "swallowed" in a drinking scene stays drunk.
const ROUTES = [['drunk', /\b(drunk|drink\w*|oral\w*|by mouth|quaff\w*|sip\w*|imbib\w*|swallow\w*|spoon\w*|mouthwash|consumed)\b/i],
    ['eaten', /\b(eat\w*|eaten|chew\w*|food|cake|sweet)\b/i],
    ['topical', /\b(skin|hair|scalp|wound|burn|bruise|rub\w*|topical\w*|smear\w*|massag\w*|ointment|paste|dab\w*|drops?|eye|bath\w*)\b/i],
    ['inhaled', /\b(inhal\w*|fumes?|vapou?r\w*|smell\w*|sniff\w*)\b/i], ['sprayed', /\b(spray\w*)\b/i],
    ['object', /\b(varnish|polish\w*|wood\w*|surface|object|photograph\w*|plants?|soil)\b/i]];
const TARGETS = [['plant', /\b(plants?|crops?|seeds?|garden|weeds?)\b/i], ['creature', /\b(creatures?|birds?|beasts?|animals?|pets?|doxies|doxy|owls?|toads?|rats?|dragons?|beaks?)\b/i],
    ['object', /\b(objects?|wood\w*|brooms?|surfaces?|furniture|photographs?)\b/i]];
const potions = {};
for (const [id, row] of Object.entries(read('hp_potions'))) {
    const r = row.reply;
    if (!r) continue;
    const routes = ROUTES.filter(([, p]) => p.test(r.route.value)).map(([k]) => k);
    const target = TARGETS.find(([, p]) => p.test(r.target.value))?.[0] ?? (r.target.value ? 'person' : null);
    const byTarget = target === 'plant' || target === 'creature' ? 'plant-or-creature-target' : target === 'object' ? 'object-surface' : null;
    const byEffect = r.effect.value ? potionFamily(r.effect.value) : null;
    const family = byTarget ?? (byEffect && byEffect !== 'effect-sentence' ? byEffect : null);
    const label = {heldOut: heldOut(id)};
    if (routes.length) Object.assign(label, {routes, routeAt: at(r.route)});
    if (target) Object.assign(label, {target, targetAt: at(r.target)});
    if (family) Object.assign(label, {family, familyBasis: byTarget ? 'wiki-tier-target' : 'wiki-tier-effect-words', familyAt: at(byTarget ? r.target : r.effect)});
    for (const key of ['effect', 'ingredients', 'brewing', 'onset_and_duration', 'side_effects', 'antidote', 'appearance', 'users']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    potions[id] = label;
}

const out = {meta: {pass: 'docs/research/advancement-aspects-2026-11-16/README.md#full-luna-passes', model: 'gpt-6-luna (low effort)',
    date: '2026-11-16', tier: 'wiki (GKM445), unchecked against chapters', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'},
    gu_kinds: sorted(gu), gu_moves: sorted(moves), hp_potions: sorted(potions)};
writeFileSync(`${root}docs/coverage/wiki_tier_labels.json`, JSON.stringify(out, null, 0).replace(/},"/g, '},\n"') + '\n');
const count = (obj, f) => Object.values(obj).filter(f).length;
console.log(JSON.stringify({gu: Object.keys(gu).length, guRank: count(gu, l => l.rank), guFunction: count(gu, l => l.function), guFunctionGuess: count(gu, l => l.functionGuess),
    moves: Object.keys(moves).length, movesWithComponents: count(moves, l => l.components), movesAllMatched: count(moves, l => l.components?.every(c => c.kind)),
    potions: Object.keys(potions).length, potionRoute: count(potions, l => l.routes), potionFamily: count(potions, l => l.family),
    heldOut: count(gu, l => l.heldOut) + count(moves, l => l.heldOut) + count(potions, l => l.heldOut)}));
