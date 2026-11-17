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
import {resolvePotion, normForm, FORM_WORDS} from './hp_ingredient_labels_check.mjs';

const root = new URL('..', import.meta.url).pathname;
const priv = `${root}docs/research/advancement-aspects-2026-11-16/private/`;
const index = JSON.parse(readFileSync(`${root}docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json`, 'utf8'));
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

const out = {meta: {pass: 'docs/research/advancement-aspects-2026-11-16/README.md#full-luna-passes', model: 'gpt-6-luna (low effort)',
    date: '2026-11-16', tier: 'wiki (GKM445), unchecked against chapters', split: 'held out when sha1(id)[0] < 0x33 (GKM429)'},
    gu_kinds: sorted(gu), gu_moves: sorted(moves), hp_potions: sorted(potions)};
// Hogwarts ingredients (2026-11-16, scored by scripts/hp_ingredient_labels_check.mjs): kind, stated property axes,
// roles, potions resolved to potion-ledger ids through the wiki's redirects, preparation forms in a closed word set,
// and where hazards and direct effects are stated. Stated axes: Haiku confirms 25 of Luna's 26 on the held-out rows and
// a hand check of 16 rows found 18 of 19 right. axisCandidates come from the families of the potions that use it
// (the book-one sheet's recipe rule, an inference) and are recorded, never folded as properties.
const FAMILY_AXIS = {'body-door': 'mend', 'mind-state': 'mind', 'body-form': 'form', 'luck-field': 'luck', 'conceal-or-sense': 'conceal-or-sense', 'protection-field': 'ward'};
const potionTitle = new Map(readFileSync(`${root}docs/research/hogwarts-potion-evidence-2026-11-11/catalogue.jsonl`, 'utf8').trim().split('\n')
    .map(l => JSON.parse(l)).filter(c => c.kinds.includes('potion_related')).map(c => [`hp.potion.${c.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`, c.title]));
const second = existsSync(`${priv}hp_ingredients_haiku.json`) ? JSON.parse(readFileSync(`${priv}hp_ingredients_haiku.json`, 'utf8')) : {};
// Hand check (2026-11-16, 16 rows): 18 of 19 stated axes right; the miss is dropped here and recorded.
const AXIS_DROPS = {'hp.ingredient.chinese_chomping_cabbage': ['bite', 'read from the plant biting, not an irritant property']};
const ingredients = {};
for (const [id, row] of Object.entries(existsSync(`${priv}hp_ingredients_luna.json`) ? read('hp_ingredients') : {})) {
    const r = row.reply;
    if (!r) continue;
    const loc = l => l.replace(/^\[|\]$/g, '');
    const label = {heldOut: heldOut(id), kind: r.kind.value, ...(at(r.kind) ? {kindAt: at(r.kind)} : {})};
    const drop = AXIS_DROPS[id];
    const axes = r.axes.filter(a => a.axis !== drop?.[0]);
    if (drop) label.axisDropped = {axis: drop[0], reason: `hand check: ${drop[1]}`};
    if (axes.length) label.axes = axes.map(a => ({axis: a.axis, level: a.level, locator: loc(a.locator), speaker: a.speaker}));
    const h = second[id]?.reply;
    if (h && axes.length) label.axesSecond = axes.every(a => h.axes.some(b => b.axis === a.axis)) ? 'agree' : 'partial';
    if (r.roles.length) label.roles = r.roles.map(a => ({role: a.role, locator: loc(a.locator), speaker: a.speaker}));
    const potions = [...new Map(r.potions.map(p => [resolvePotion(p.potion), loc(p.locator)])).entries()].filter(([pid]) => pid);
    if (potions.length) label.potions = potions.map(([potion, locator]) => ({potion, locator}));
    const unresolved = r.potions.filter(p => !resolvePotion(p.potion)).length;
    if (unresolved) label.potionsUnresolved = unresolved;
    const forms = [...new Set(r.preparation.map(p => normForm(p.form)).filter(f => FORM_WORDS.includes(f) && f !== 'weighed'))];
    if (forms.length) Object.assign(label, {forms, formsAt: loc(r.preparation[0].locator)});
    const candidates = [...new Set(potions.map(([pid]) => FAMILY_AXIS[potionFamily(potionTitle.get(pid) ?? '')]).filter(Boolean))].sort();
    if (candidates.length) Object.assign(label, {axisCandidates: candidates, axisCandidatesBasis: 'inference from the families of the potions that use it'});
    for (const key of ['source', 'hazards', 'direct_effect']) if (at(r[key])) label[`${key}At`] = at(r[key]);
    ingredients[id] = label;
}
out.hp_ingredients = sorted(ingredients);
writeFileSync(`${root}docs/coverage/wiki_tier_labels.json`, JSON.stringify(out, null, 0).replace(/},"/g, '},\n"') + '\n');
const count = (obj, f) => Object.values(obj).filter(f).length;
console.log(JSON.stringify({gu: Object.keys(gu).length, guRank: count(gu, l => l.rank), guFunction: count(gu, l => l.function), guFunctionGuess: count(gu, l => l.functionGuess), guEffectFamily: count(gu, l => l.effectFamily), guDiet: count(gu, l => l.dietDefault), movesAgree: count(moves, l => l.secondRead === 'agree'),
    moves: Object.keys(moves).length, movesWithComponents: count(moves, l => l.components), movesAllMatched: count(moves, l => l.components?.every(c => c.kind)),
    potions: Object.keys(potions).length, potionRoute: count(potions, l => l.routes), potionFamily: count(potions, l => l.family),
    heldOut: count(gu, l => l.heldOut) + count(moves, l => l.heldOut) + count(potions, l => l.heldOut)}));
console.log(JSON.stringify({ingredients: Object.keys(ingredients).length, ingredientAxes: count(ingredients, l => l.axes), ingredientPotions: count(ingredients, l => l.potions),
    ingredientForms: count(ingredients, l => l.forms), ingredientHazard: count(ingredients, l => l.hazardsAt), ingredientHeldOut: count(ingredients, l => l.heldOut)}));
