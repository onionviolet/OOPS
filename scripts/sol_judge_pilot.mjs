#!/usr/bin/env node
// PWC46 (2026-11-17): is GPT-6.1 Sol a better judge of Luna/Haiku disagreements than either of them? Three steps:
//   freeze  writes docs/coverage/sol_judge_set.json (ids, field, answer key, key source, both readers' values; no chapter text)
//           from the private reply files and the hand keys below, BEFORE any Sol call. Refuses to overwrite a frozen file.
//   run     sends each frozen row to gpt-6.1-sol by batch (scripts/label_runner.mjs): the readers' own packet and question, then
//           "A or B, or your own value", with A/B order fixed by sha1(id+field) so Luna is not always first.
//   score   scores Sol, Luna and Haiku against the key, per pool and in all; writes docs/coverage/sol_judge_scores.json.
//   LABEL_PRIVATE=<private dir> OPENAI_API_KEY=... node scripts/sol_judge_pilot.mjs freeze|run|score [--dry|--sync|--wait|--max-usd N]
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runPass} from './label_runner.mjs';
import {COMMON} from './label_pass.mjs';
import {COMMON as EFFECT_COMMON, itemsFor as effectItems} from './chapter_effect_pass.mjs';
import {guDietJobs, hpSentenceJobs, hpSplit} from './label_followups.mjs';

const root = new URL('..', import.meta.url).pathname;
const priv = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
const FROZEN = `${root}docs/coverage/sol_judge_set.json`, SCORES = `${root}docs/coverage/sol_judge_scores.json`;
const JUDGES = {sol: 'gpt-6.1-sol', sonnet: 'claude-sonnet-5-5'};
const RATE = {sol: [2, 0.1, 2.5, 10], sonnet: [2, 0.2, 4, 10]};
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const replies = f => Object.fromEntries(Object.entries(json(`${priv}${f}`)).filter(([, r]) => r.reply).map(([id, r]) => [id, r.reply]));
const sha = s => createHash('sha1').update(s).digest();

// Hand keys, written after both readers' values were seen (named in the README as a bias). Diet: the stated food's category,
// sorted by hand from the food text; rows whose food text is itself mixed or empty are left out.
const DIET_KEY = {'heavenly-secret': 'element-or-weather', 'candidate:beggar-moth': 'plants', 'candidate:day-gu': 'element-or-weather',
    'candidate:eat-fragrance-immortal-gu': 'element-or-weather', 'candidate:derivation-gu': 'meat-or-blood', 'candidate:remembrance-immortal-gu': 'plants',
    'candidate:mudskin-toad': 'minerals-or-metal', 'candidate:eating-ones-words-gu': 'other-gu-or-insects', 'candidate:perseverance-gu': 'element-or-weather',
    'candidate:sneak-attack-gu': 'other-gu-or-insects', 'candidate:womans-heart': 'meat-or-blood', 'candidate:vajra-thought-immortal-gu': 'plants',
    'fandom:Ten_Thousand_Li_Silk_Corridor': 'other-gu-or-insects', 'fandom:Star_Mark_Gu': 'meat-or-blood', 'fandom:Dog_Shit_Luck_Immortal_Gu': 'other'};
// Effect rows where one reader's whole sentence (verb, object, target, time) is plainly the better fit for the cited lines.
const EFFECT_KEY = [['circle_of_inevitability_powers', 'coi.power.giant_fireball', 'luna'], ['gu_kinds', 'candidate:demonic-blood-skull-gu', 'luna'],
    ['gu_kinds', 'fixed-space', 'luna'], ['gu_kinds', 'candidate:fish-enslavement-gu', 'haiku'], ['gu_kinds', 'candidate:groundmat-grass-gu', 'luna'],
    ['gu_kinds', 'candidate:old-removal-gu', 'luna'], ['gu_kinds', 'candidate:special-will-gu', 'luna'], ['gu_kinds', 'candidate:water-image-gu', 'haiku'],
    ['gu_kinds', 'saga:earth-prison', 'haiku'], ['gu_kinds', 'saga:dew-immortal-gu', 'luna'], ['gu_kinds', 'fandom:Bai_Zhan_Wen', 'luna'],
    ['legendary_mechanic_powers', 'lm.power.indestructible_body', 'luna'], ['legendary_mechanic_powers', 'lm.power.celestial_punishment_edge', 'luna'],
    ['legendary_mechanic_powers', 'lm.power.one_hit', 'luna']];
const tuple = e => ['verb', 'object', 'target', 'time'].map(k => e[k]).join(' ');

function freeze() {
    if (existsSync(FROZEN)) throw Error(`${FROZEN} exists: the set is frozen.`);
    const rows = [];
    const held = hpSplit().heldOut, sl = replies('hp_sentence_followup.json'), sh = replies('weak_sentence_haiku.json');
    for (const r of held) for (const k of ['verb', 'object', 'target', 'time', 'carrier']) {
        if (sl[r.id] && sh[r.id] && sl[r.id][k] !== sh[r.id][k]) rows.push({pool: 'sentence', id: r.id, field: k, key: r.parts[k], keySource: 'authored held-out sentence (HP_POTION_SENTENCES)', luna: sl[r.id][k], haiku: sh[r.id][k]});
    }
    const dl = replies('gu_diet_followup.json'), dh = replies('weak_diet_haiku.json');
    for (const [id, key] of Object.entries(DIET_KEY)) rows.push({pool: 'diet', id, field: 'category', key, keySource: 'hand sort of the book-stated food text', luna: dl[id].category, haiku: dh[id].category});
    for (const [ledger, id, who] of EFFECT_KEY) {
        const l = replies(`ch_effect_${ledger}_luna.json`)[id].effect, h = replies(`ch_effect2_${ledger}_haiku.json`)[id].effect;
        rows.push({pool: 'effect', id, ledger, field: 'effect', key: tuple(who === 'luna' ? l : h), keySource: 'hand check against the cited chapter lines', luna: tuple(l), haiku: tuple(h)});
    }
    for (const r of rows) r.order = sha(r.id + r.field)[0] & 1 ? 'HL' : 'LH';
    const out = {meta: {date: '2026-11-17', pass: 'PWC46', judges: JUDGES, note: 'Frozen before any Sol call. Values only, no chapter text. A/B order = sha1(id+field)[0]&1: LH puts Luna first, HL Haiku first.'},
        rows: rows.sort((a, b) => (a.pool + a.id + a.field).localeCompare(b.pool + b.id + b.field))};
    writeFileSync(FROZEN, JSON.stringify(out, null, 1) + '\n');
    console.log(JSON.stringify({frozen: rows.length, pools: rows.reduce((a, r) => ({...a, [r.pool]: (a[r.pool] ?? 0) + 1}), {})}));
}

const pick = {type: 'object', additionalProperties: false, required: ['pick', 'value', 'reason'],
    properties: {pick: {type: 'string', enum: ['A', 'B', 'other']}, value: {type: 'string'}, reason: {type: 'string'}}};
const ab = r => r.order === 'LH' ? [r.luna, r.haiku] : [r.haiku, r.luna];
const dispute = r => {
    const [a, b] = ab(r);
    return `\n\nTwo readers answered this question and disagree on the field "${r.field}".\nOption A: ${a}\nOption B: ${b}\nWhich is right for this evidence? Set pick to A, B or other. Set value to the answer in the same words as the option (for other, your own value, written the way the options are). reason: one short sentence.`;
};

function jobs(rows) {
    const sentence = new Map(hpSentenceJobs().map(j => [j.id, j])), diet = new Map(guDietJobs().jobs.map(j => [j.id, j]));
    const packets = {};
    return rows.map(r => {
        const id = `${r.id}|${r.field}`;
        if (r.pool === 'sentence') { const j = sentence.get(r.id); return {id, shared: j.shared, user: j.user + dispute(r)}; }
        if (r.pool === 'diet') return {id, user: diet.get(r.id).user + dispute(r)};
        packets[r.ledger] ??= new Map(json(`${priv}ch_effect_${r.ledger}_packets.json`).map(p => [p.id, p]));
        const j = effectItems(r.ledger, [packets[r.ledger].get(r.id)])[0];
        return {id, shared: j.shared, user: j.user + dispute(r) + ' Write value as "verb object target time".'};
    });
}

async function run(who, argv) {
    const rows = json(FROZEN).rows;
    for (const [pool, system] of [['sentence', COMMON], ['diet', COMMON], ['effect', EFFECT_COMMON]]) {
        const items = jobs(rows.filter(r => r.pool === pool));
        await runPass({name: `sol_judge_${pool}`, dir: priv, suffix: who, system, schema: pick, items, model: JUDGES[who], effort: 'low', maxTokens: 2500, maxUsd: 1}, argv);
    }
}

function score() {
    const frozen = json(FROZEN), rows = frozen.rows, out = {meta: {...frozen.meta, scored: '2026-11-17'}, pools: {}, usage: {}};
    const rep = {};
    for (const who of Object.keys(JUDGES)) {
        rep[who] = Object.assign({}, ...['sentence', 'diet', 'effect'].map(p => existsSync(`${priv}sol_judge_${p}_${who}.json`) ? json(`${priv}sol_judge_${p}_${who}.json`) : {}));
        const u = Object.values(rep[who]).filter(x => x.usage).reduce((s, x) => ({in: s.in + x.usage.in, cached: s.cached + (x.usage.cached ?? 0), written: s.written + (x.usage.written ?? 0), out: s.out + x.usage.out}), {in: 0, cached: 0, written: 0, out: 0});
        const r = RATE[who];
        out.usage[who] = {...u, usdBatch: Number(((u.in * r[0] + u.cached * r[1] + u.written * r[2] + u.out * r[3]) / 2e6).toFixed(4))};
    }
    const cell = () => ({n: 0, luna: 0, haiku: 0, either: 0, sol: 0, sonnet: 0, solAnswered: 0, sonnetAnswered: 0, solPicksLuna: 0, solPicksHaiku: 0, sonnetPicksLuna: 0, sonnetPicksHaiku: 0, solOther: 0, sonnetOther: 0});
    const tot = cell();
    for (const r of rows) {
        const [a, b] = ab(r), c = out.pools[r.pool] ??= cell();
        for (const t of [c, tot]) {
            const l = r.luna === r.key, h = r.haiku === r.key;
            t.n++; t.luna += l; t.haiku += h; t.either += l || h;
            for (const who of Object.keys(JUDGES)) {
                const x = rep[who][`${r.id}|${r.field}`]?.reply; if (!x) continue;
                const final = x.pick === 'A' ? a : x.pick === 'B' ? b : x.value.trim();
                t[`${who}Answered`]++; t[who] += final === r.key;
                if (x.pick === 'other') t[`${who}Other`]++; else if (final === r.luna) t[`${who}PicksLuna`]++; else t[`${who}PicksHaiku`]++;
            }
        }
    }
    out.all = tot;
    writeFileSync(SCORES, JSON.stringify(out, null, 1) + '\n');
    console.log(JSON.stringify(out));
}

const argv = process.argv.slice(2), cmd = argv[0];
if (cmd === 'freeze') freeze(); else if (cmd === 'run') await run(argv[1] ?? 'sol', argv.slice(2)); else if (cmd === 'score') score(); else console.log('usage: freeze | run | score');
