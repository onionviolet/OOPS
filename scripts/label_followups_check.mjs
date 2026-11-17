#!/usr/bin/env node
// Scores the follow-up passes (scripts/label_followups.mjs) and prints counts only; the replies stay private.
// gu_family against the kind-word family (held-out split apart), gu_diet against the stated foods' categories,
// move_check verdict counts, hp_sentence against the held-out evidence sentences and the grammar's own check.
import {readFileSync, existsSync} from 'node:fs';
import {HP_POTION_EFFECTS, assemblePotionEffect} from '../src/world_packs/brew_effects_pack.js';
import {hpSplit} from './label_followups.mjs';

const root = new URL('..', import.meta.url).pathname;
const priv = `${root}docs/research/advancement-aspects-2026-11-16/private/`;
const tier = JSON.parse(readFileSync(`${root}docs/coverage/wiki_tier_labels.json`, 'utf8'));
const load = name => existsSync(`${priv}${name}_followup.json`)
    ? Object.fromEntries(Object.entries(JSON.parse(readFileSync(`${priv}${name}_followup.json`, 'utf8'))).filter(([, r]) => r.reply).map(([id, r]) => [id, r.reply])) : {};
const tally = values => values.reduce((acc, v) => ({...acc, [v]: (acc[v] ?? 0) + 1}), {});
const report = {};

const family = load('gu_family');
const scored = Object.entries(family).filter(([id]) => tier.gu_kinds[id]?.function);
const score = rows => ({n: rows.length, agree: rows.filter(([id, r]) => r.family === tier.gu_kinds[id].function).length,
    none: rows.filter(([, r]) => r.family === 'none').length});
report.gu_family = {rows: Object.keys(family).length, families: tally(Object.values(family).map(r => r.family)),
    heldOut: score(scored.filter(([id]) => tier.gu_kinds[id].heldOut)), tuned: score(scored.filter(([id]) => !tier.gu_kinds[id].heldOut))};

const diet = load('gu_diet'), stated = load('gu_food_stated');
const both = Object.keys(stated).filter(id => diet[id]);
report.gu_diet = {rows: Object.keys(diet).length, categories: tally(Object.values(diet).map(r => r.category)),
    stated: both.length, agree: both.filter(id => diet[id].category === stated[id].category).length,
    statedHeldOut: both.filter(id => tier.gu_kinds[id]?.heldOut).length,
    agreeHeldOut: both.filter(id => tier.gu_kinds[id]?.heldOut && diet[id].category === stated[id].category).length};

const moves = load('move_check');
const verdicts = Object.values(moves).flatMap(r => r.components.map(c => c.verdict));
report.move_check = {leads: Object.keys(moves).length, verdicts: tally(verdicts),
    allCoreOrSupport: Object.values(moves).filter(r => r.components.length && r.components.every(c => c.verdict === 'core' || c.verdict === 'support')).length,
    anyNotPart: Object.values(moves).filter(r => r.components.some(c => c.verdict === 'not-part')).length,
    orderStated: Object.values(moves).filter(r => r.order).length};

const sentences = load('hp_sentence');
const {heldOut} = hpSplit();
const keys = ['verb', 'object', 'target', 'time', 'carrier'];
const field = Object.fromEntries(keys.map(k => [k, heldOut.filter(r => sentences[r.id]?.[k] === r.parts[k]).length]));
const valid = Object.values(sentences).filter(r => r.verb !== 'none' && r.object !== 'none'
    && assemblePotionEffect(HP_POTION_EFFECTS, {...r, cost: 'ingredients'}).ok).length;
report.hp_sentence = {rows: Object.keys(sentences).length, none: Object.values(sentences).filter(r => r.verb === 'none' || r.object === 'none').length,
    grammarValid: valid, heldOut: heldOut.length, heldOutAnswered: heldOut.filter(r => sentences[r.id]).length, heldOutField: field,
    heldOutVerbAndObject: heldOut.filter(r => sentences[r.id]?.verb === r.parts.verb && sentences[r.id]?.object === r.parts.object).length,
    heldOutAllFive: heldOut.filter(r => keys.every(k => sentences[r.id]?.[k] === r.parts[k])).length};
console.log(JSON.stringify(report, null, 1));
