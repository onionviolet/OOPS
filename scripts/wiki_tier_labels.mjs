#!/usr/bin/env node
// Wiki-tier labels (GKM445): normalises the private Luna label passes (scripts/label_pass.mjs) into
// docs/coverage/wiki_tier_labels.json, which the Gu and potion ledger builds read. Only normalised values,
// locators and speakers are committed; the paraphrases stay in the gitignored private folder. The held-out
// split (GKM429) is fixed by hash: a row whose sha1(id) starts below 0x33 (about a fifth) is held out, and
// any later rule fitted to these labels (function words, diet defaults, route words) fits on the rest and
// reports held-out agreement apart. The ledgers fold every row because their tables were not fitted here.
// Usage: node scripts/wiki_tier_labels.mjs
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {HP_POTION_EFFECTS, assemblePotionEffect} from '../src/world_packs/brew_effects_pack.js';
import {createHash} from 'node:crypto';
import {kindWordFunction, keywordFunction} from './gu_function_words.mjs';
import {potionFamily} from './b_coverage_ledgers.mjs';

const root = new URL('..', import.meta.url).pathname;
// LABEL_SOURCE_ROOT: a checkout holding the gitignored private folders, for a worktree that lacks them.
const src = process.env.LABEL_SOURCE_ROOT ? `${process.env.LABEL_SOURCE_ROOT.replace(/\/$/, '')}/` : root;
const priv = `${src}docs/research/advancement-aspects-2026-11-16/private/`;
const index = JSON.parse(readFileSync(`${src}docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json`, 'utf8'));
const read = name => JSON.parse(readFileSync(`${priv}${name}_luna.json`, 'utf8'));
// Follow-up passes (scripts/label_followups.mjs), scored by scripts/label_followups_check.mjs on 2026-11-16.
const followup = name => existsSync(`${priv}${name}_followup.json`) ? Object.fromEntries(Object.entries(JSON.parse(
    readFileSync(`${priv}${name}_followup.json`, 'utf8'))).filter(([, r]) => r.reply).map(([id, r]) => [id, r.reply])) : {};
const famPass = followup('gu_family'), dietPass = followup('gu_diet'), movePass = followup('move_check'), sentencePass = followup('hp_sentence');
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
    // Luna's family for the stated effect (examples from non-held-out rows, kind field hidden): 27 of 32
    // held-out kinds with a kind-word family agree, 3 answer none.
    const fam = famPass[id]?.family;
    if (!byKind && fam && fam !== 'none') Object.assign(label, {effectFamily: fam,
        effectFamilyBasis: 'wiki-tier-effect-luna (held-out 27 of 32 agree with kind words)'});
    // GKM440 diet default, labelled authored: the category matches a stated food for 12 of 44 kinds.
    if (dietPass[id]) label.dietDefault = {category: dietPass[id].category, food: dietPass[id].food,
        basis: 'authored default (GKM440, Luna; 12 of 44 stated foods share its category)'};
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
    // Haiku's second read: a component it calls not part of the move is dropped; unclear marks the lead partial.
    const second = movePass[id]?.components ?? [];
    const verdictOf = c => second.find(v => norm(v.gu) === norm(c.name ?? [...kindIds].find(([, k]) => k === c.kind)?.[0]))?.verdict;
    if (second.length) for (const c of components) c.second = verdictOf(c) ?? 'unclear';
    const parts = components.filter(c => c.role !== 'product' && c.second !== 'not-part');
    if (second.length) label.secondRead = parts.length && parts.every(c => c.second === 'core' || c.second === 'support') ? 'agree' : 'partial';
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
const SENTENCE_FAMILY = {conceal: 'conceal-or-sense', sense: 'conceal-or-sense', release: 'place-release', block: 'protection-field'};
const OBJECT_FAMILY = {vitality: 'body-door', mind: 'mind-state', memory: 'mind-state', form: 'body-form', thing: 'object-surface', luck: 'luck-field'};
const sentenceFamily = p => SENTENCE_FAMILY[p.verb] ?? (p.target !== 'self' && p.object === 'vitality' ? null : OBJECT_FAMILY[p.object]) ?? null;
const potions = {};
for (const [id, row] of Object.entries(read('hp_potions'))) {
    const r = row.reply;
    if (!r) continue;
    const routes = ROUTES.filter(([, p]) => p.test(r.route.value)).map(([k]) => k);
    const target = TARGETS.find(([, p]) => p.test(r.target.value))?.[0] ?? (r.target.value ? 'person' : null);
    const byTarget = target === 'plant' || target === 'creature' ? 'plant-or-creature-target' : target === 'object' ? 'object-surface' : null;
    const byEffect = r.effect.value ? potionFamily(r.effect.value) : null;
    const words = byTarget ?? (byEffect && byEffect !== 'effect-sentence' ? byEffect : null);
    // Luna's effect sentence (tuned examples only): the object is right for 16 of 17 held-out evidence
    // sentences, the verb for 10, so the family comes from the object, or from a verb-led family's verb.
    const sentence = sentencePass[id];
    const validSentence = sentence && sentence.verb !== 'none' && sentence.object !== 'none'
        && assemblePotionEffect(HP_POTION_EFFECTS, {...sentence, cost: 'ingredients'}).ok;
    const bySentence = validSentence ? sentenceFamily(sentence) : null;
    // A hand check of the five rows only the sentence would family found three wrong, so the sentence family
    // is recorded for a later scored pass and does not move a ledger row.
    const family = words;
    const label = {heldOut: heldOut(id)};
    if (routes.length) Object.assign(label, {routes, routeAt: at(r.route)});
    if (target) Object.assign(label, {target, targetAt: at(r.target)});
    if (family) Object.assign(label, {family, familyBasis: byTarget ? 'wiki-tier-target' : 'wiki-tier-effect-words', familyAt: at(byTarget ? r.target : r.effect)});
    if (bySentence) Object.assign(label, {sentenceFamily: bySentence, sentenceBasis: 'wiki-tier-sentence-luna (held-out object 16 of 17, verb 10 of 17)'});
    if (validSentence) label.sentence = Object.fromEntries(['verb', 'object', 'target', 'time', 'carrier', 'limits'].map(k => [k, sentence[k]]));
    for (const key of ['effect', 'ingredients', 'brewing', 'onset_and_duration', 'side_effects', 'antidote', 'appearance', 'users']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    potions[id] = label;
}

// Lord of the Mysteries potions (2026-11-16). Luna lists each Sequence's ingredients from wiki paragraphs that tag
// the Sequence; Haiku checks each one (scripts/label_followups.mjs lotm_check). Rule set before scoring: an
// ingredient folds as a main only when Luna lists it and Haiku calls it main. On the 46 brew-pack rows that
// gives 11 of 13 right by hand, held-out 3 of 3; Luna alone was 15 of 22. Names are short ingredient names, not
// prose. Rows with no wiki main carry the GKM433 authored default.
const lotmCheck = followup('lotm_check');
const short = name => name.trim().split(/\s+/).length <= 8 && !/^\(|^$/.test(name.trim());
const lotmPackets = new Map(JSON.parse(readFileSync(`${priv}lotm_potions_packets.json`, 'utf8')).map(p => [p.id, p]));
const LOTM_FIELDS = ['do', 'settle', 'go_wrong', 'change', 'who_may', 'where_from', 'how_long', 'others_notice', 'left_behind',
    'who_controls', 'mind', 'can_be_false', 'combines'];
const lotm = {};
for (const [id, row] of Object.entries(read('lotm_potions'))) {
    const r = row.reply;
    if (!r) continue;
    const packet = lotmPackets.get(id);
    const verdicts = new Map((lotmCheck[id]?.ingredients ?? []).map(v => [v.name.trim(), v.verdict]));
    const item = m => ({name: m.name.trim(), locator: m.locator.replace(/^\[|\]$/g, ''), speaker: m.speaker, ...(m.cite ? {cite: m.cite} : {}),
        ...(packet.evidence.some(e => e.includes(`[ingr:${m.name.trim()}]`)) ? {canonical: true} : {})});
    const label = {heldOut: heldOut(id)};
    const mains = r.mains.filter(m => short(m.name) && verdicts.get(m.name.trim()) === 'main').map(item);
    const unstated = [...r.mains, ...r.aux].filter(m => short(m.name) && verdicts.get(m.name.trim()) === 'role-unstated').map(item);
    const supplementary = r.aux.filter(m => short(m.name) && verdicts.get(m.name.trim()) === 'supplementary').map(item);
    if (mains.length) Object.assign(label, {mains, mainsBasis: 'wiki-tier-luna-haiku-main (brew-pack rows 11 of 13, held-out 3 of 3)'});
    if (supplementary.length) label.supplementary = supplementary;
    if (unstated.length) label.roleUnstated = unstated;
    // Haiku's misses are for review only: two of the three on blocked rows a hand look found are artifacts, not ingredients.
    const missed = (lotmCheck[id]?.missed ?? []).filter(m => m.role === 'main' && short(m.name)).map(m => ({name: m.name.trim(),
        locator: m.locator.replace(/^\[|\]$/g, ''), speaker: m.speaker}));
    if (missed.length) label.reviewMains = missed;
    if (!mains.length && packet.state === 'blocked:formula-in-notes') label.authoredDefault = {mains: `a Sequence ${packet.seq} ${packet.wikiName.replace(/\s*\(.*$/, '')} Beyonder characteristic`,
        supplementary: 'open', basis: 'authored default (GKM433): the table rule that a same-Sequence characteristic replaces the mains (T 0214), not canon',
        cost: 'a dead Beyonder of this Sequence; a polluted characteristic carries its residue (T 0209, 0403)'};
    for (const key of LOTM_FIELDS) if (at(r[key])) label[`${key}At`] = at(r[key]);
    lotm[id] = label;
}

const out = {meta: {pass: 'docs/research/advancement-aspects-2026-11-16/README.md#full-luna-passes', model: 'gpt-6-luna (low effort)',
    date: '2026-11-16', tier: 'wiki (GKM445), unchecked against chapters', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'},
    gu_kinds: sorted(gu), gu_moves: sorted(moves), hp_potions: sorted(potions), lotm_potions: sorted(lotm)};
writeFileSync(`${root}docs/coverage/wiki_tier_labels.json`, JSON.stringify(out, null, 0).replace(/},"/g, '},\n"') + '\n');
const count = (obj, f) => Object.values(obj).filter(f).length;
console.log(JSON.stringify({gu: Object.keys(gu).length, guRank: count(gu, l => l.rank), guFunction: count(gu, l => l.function), guFunctionGuess: count(gu, l => l.functionGuess), guEffectFamily: count(gu, l => l.effectFamily), guDiet: count(gu, l => l.dietDefault), movesAgree: count(moves, l => l.secondRead === 'agree'),
    moves: Object.keys(moves).length, movesWithComponents: count(moves, l => l.components), movesAllMatched: count(moves, l => l.components?.every(c => c.kind)),
    potions: Object.keys(potions).length, potionRoute: count(potions, l => l.routes), potionFamily: count(potions, l => l.family),
    lotm: Object.keys(lotm).length, lotmMains: count(lotm, l => l.mains), lotmRoleUnstated: count(lotm, l => l.roleUnstated && !l.mains),
    heldOut: count(gu, l => l.heldOut) + count(moves, l => l.heldOut) + count(potions, l => l.heldOut)}));
