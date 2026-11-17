#!/usr/bin/env node
// Re:Zero power ledger (docs/research/power-catalogues-2026-11-16 PWC1-PWC7). One row per named power: Authorities,
// Witch Factors, Divine Protections, named spells by tier, curses, spirit contract kinds, Return by Death and the
// other named arts. Stages, each resumable and each writing only to the private folder until `build`:
//   denominator  merge the name pass and the free WN/IF scan into rows; write the frozen hash split
//   packets      evidence per row from the digests, deep dives and WN chapters (own names masked for held-out classes)
//   label        Luna: effect-grammar parts and the PWC1 aspect fields, each with locator and speaker
//   second       Haiku: grammar parts again as the second reader
//   heldlabels   Luna on the unmasked evidence: the stated attribute (spells) and sin (Authorities)
//   build        normalise into docs/coverage/rezero_power_labels.json and docs/coverage/rezero_powers.jsonl
// Usage: node scripts/rezero_power_ledger.mjs <stage>   (OPENAI_API_KEY and ANTHROPIC_API_KEY come from the Keychain)
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {luna, RATE, SPEAKER} from './label_pass.mjs';
import {canonicalise, norm} from './rezero_power_canon.mjs';
import {SOURCES, NOVEL, PRIV, SRC, readJson, readIf, heldOut, CLASSES, ATTRIBUTES, SINS, SIN_WORDS, ATTR_WORDS} from './rezero_power_chunks.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES, predictAttribute, predictSin, CAPABILITIES, CAPABILITY_ORDER, ROUTE_TO_PLAYER, ROUTES, KNOWERS} from './rezero_power_frozen.mjs';

const root = new URL('..', import.meta.url).pathname;
export const SIDECAR = `${root}docs/coverage/rezero_power_labels.json`;
export const LEDGER = `${root}docs/coverage/rezero_powers.jsonl`;
const has = name => existsSync(`${PRIV}${name}`);
const write = (name, v) => writeFileSync(`${PRIV}${name}`, JSON.stringify(v));

// ---- stage: denominator ------------------------------------------------------------------------------------------
export function denominator() {
    const rows = canonicalise(readJson(`${PRIV}rezero_names_luna.json`), readJson(`${PRIV}rezero_wn_scan.json`));
    return rows.map(r => ({...r, heldOut: heldOut(r.id)}));
}

// ---- stage: packets ----------------------------------------------------------------------------------------------
const TAGS = [[/\bSHOWN\b/, 'demonstration'], [/\bSTATED\b/, 'character_claim'], [/\bWIKI\b/, 'wiki'], [/\bINFERRED\b/, 'inference'], [/\bnarrator\b/i, 'narrator']];
export function lineSpeaker(text) {
    const hits = TAGS.filter(([re]) => re.test(text)).map(([, s]) => s);
    return hits.length === 1 ? hits[0] : null;
}
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const plain = s => s.replace(/\s*\([^)]*\)/g, '').trim();
const GENERIC = new Set(['sun', 'water', 'earth', 'fog', 'clouds', 'lakes', 'initiative', 'isolation', 'repetition', 'judgement', 'morale', 'durability', 'evaluation', 'telepathy']);
export function patternFor(row) {
    const names = new Set([plain(row.name), ...row.aliases.map(plain)].filter(a => a.length >= 3));
    if (row.cls === 'witch_factor') return new RegExp(`(?:Authority of|Witch Factor of|Factor of|Archbishop of) ${esc(plain(row.name))}|${esc(plain(row.name))}(?: Authority| Factor| Archbishop)`, 'i');
    if (row.cls === 'divine_protection') return new RegExp(`(?:${[...names].map(esc).join('|')})(?:\\W+(?:Divine Protection|blessing|protection))?`, 'i');
    return new RegExp(`\\b(?:${[...names].map(esc).join('|')})\\b`, 'i');
}
let digestLines = null;
function allLines() {
    if (digestLines) return digestLines;
    digestLines = SOURCES.filter((s, i, a) => a.findIndex(x => x.file === s.file) === i).flatMap(src => {
        const tag = src.key === 'DD2R' ? 'DD2' : src.key;
        return readFileSync(`${NOVEL}${src.file}`, 'utf8').split('\n').map((text, i) => ({loc: `${tag} l.${i + 1}`, text})).filter(l => l.text.trim());
    });
    return digestLines;
}
let wn = null;
const wnChapters = () => wn ??= Object.values(readJson(`${NOVEL}witchcult/rezero_wct.json`)).map(([title, text]) => {
    const m = /^Arc (\d+), Chapter (\d+)/.exec(title);
    return m ? {loc: `WN A${m[1]} c${m[2]}`, text} : null;
}).filter(Boolean);

export function evidenceFor(row, {lines = 10, snippets = 6} = {}) {
    const re = patternFor(row);
    let found = allLines().filter(l => re.test(l.text));
    // A thin match falls back to every significant word of the name appearing in one line, or for a Factor its bare sin
    // word on a line about Factors, Authorities or Archbishops (the digests' tables lead with the sin).
    if (found.length < 2) {
        const words = plain(row.name).split(/[^A-Za-z']+/).filter(w => w.length >= 4);
        const loose = row.cls === 'witch_factor' ? new RegExp(`\\b${esc(plain(row.name))}\\b`, 'i') : null;
        const more = allLines().filter(l => !found.includes(l) && (loose ? loose.test(l.text) && /factor|authority|archbishop|witch/i.test(l.text)
            : words.length >= 2 && words.every(w => new RegExp(`\\b${esc(w)}`, 'i').test(l.text))));
        found = [...found, ...more];
    }
    // Prefer lines that carry a source tag, then longer ones, and cap the count.
    const rank = l => (lineSpeaker(l.text) ? 0 : 1);
    const picked = found.sort((a, b) => rank(a) - rank(b)).slice(0, lines).sort((a, b) => 0);
    const out = picked.map(l => ({loc: l.loc, text: l.text.slice(0, 650), speaker: lineSpeaker(l.text)}));
    const useRaw = !(GENERIC.has(norm(row.name)) || norm(row.name).length < 5) && row.cls !== 'spell' || row.cls === 'spell' && /^(el|ul|al) /i.test(row.name);
    if (useRaw) {
        const rx = new RegExp(re.source, 'gi');
        const perChapter = [];
        for (const c of wnChapters()) {
            const m = rx.exec(c.text); rx.lastIndex = 0;
            if (m) perChapter.push({loc: c.loc, text: c.text.slice(Math.max(0, m.index - 260), m.index + m[0].length + 340).replace(/\s+/g, ' ')});
        }
        const step = Math.max(1, Math.ceil(perChapter.length / snippets));
        for (let i = 0; i < perChapter.length && out.filter(o => o.loc.startsWith('WN')).length < snippets; i += step) out.push({...perChapter[i], speaker: null});
    }
    return out;
}

// The grammar prompt must not see the held-out label (PWC2): the row's own names become a neutral token, and the
// attribute (spells) or sin (Factors and Authorities) words are masked in every line. The unmasked text feeds only the
// held-label pass. Holder names stay, so a model's memory of who held what can still leak; the report says so.
export function maskFor(row, text) {
    let out = text;
    if (['spell', 'witch_factor', 'authority'].includes(row.cls)) {
        const names = [...new Set([plain(row.name), ...row.aliases.map(plain)])].filter(a => a.length >= 3);
        if (row.cls === 'spell') names.push(...names.map(n => n.split(' ').pop()).filter(w => w.length >= 3));
        for (const n of names.sort((a, b) => b.length - a.length)) out = out.replace(new RegExp(`\\b${esc(n)}\\b`, 'gi'), 'THIS POWER');
    }
    if (row.cls === 'spell') out = out.replace(ATTR_WORDS, '[element]');
    if (row.cls === 'witch_factor' || row.cls === 'authority') out = out.replace(SIN_WORDS, '[sin]');
    return out;
}

export function packets(rows) {
    return rows.filter(r => !r.notAThing).map(r => {
        const ev = evidenceFor(r);
        return {id: r.id, cls: r.cls, name: r.name, editions: r.editions, heldOut: r.heldOut, evidence: ev.map(e => ({...e, masked: maskFor(r, e.text)}))};
    });
}

// ---- stage: label (Luna) -----------------------------------------------------------------------------------------
const f = {type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'], properties: {value: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER}};
const withEnum = (key, values) => ({type: 'object', additionalProperties: false, required: ['value', key, 'locator', 'speaker'],
    properties: {value: {type: 'string'}, [key]: {type: 'string', enum: values}, locator: {type: 'string'}, speaker: SPEAKER}});
const en = values => ({type: 'string', enum: [...values, 'none']});
export const LABEL_SCHEMA = {type: 'object', additionalProperties: false,
    required: ['grammar', 'effect', 'who_may', 'where_from', 'go_wrong', 'mind', 'left_behind', 'combines', 'counters', 'knowledge'],
    properties: {
        grammar: {type: 'object', additionalProperties: false, required: ['verb', 'object', 'target', 'time', 'locator', 'speaker'],
            properties: {verb: en(EFFECT_VERBS), object: en(Object.keys(EFFECT_OBJECTS)), target: en(EFFECT_TARGETS), time: en(EFFECT_TIMES), locator: {type: 'string'}, speaker: SPEAKER}},
        effect: f, who_may: f, where_from: withEnum('route', ROUTES), go_wrong: f, mind: f, left_behind: f, combines: f, counters: f,
        knowledge: withEnum('who', KNOWERS)}};
export const SECOND_SCHEMA = {type: 'object', additionalProperties: false, required: ['verb', 'object', 'target', 'time'],
    properties: {verb: en(EFFECT_VERBS), object: en(Object.keys(EFFECT_OBJECTS)), target: en(EFFECT_TARGETS), time: en(EFFECT_TIMES)}};
export const HELD_SCHEMA = {type: 'object', additionalProperties: false, required: ['label', 'locator', 'speaker'],
    properties: {label: {type: 'string'}, locator: {type: 'string'}, speaker: SPEAKER}};

const RULES = `Use only the evidence lines given. Each line starts with its locator in square brackets; copy that bracket's content exactly into "locator". Write values as short paraphrases in your own words, never quotations. If the evidence does not state something, set value and locator to "" and speaker to "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: narrator, a character's claim (which may be wrong; Archbishops and others lie about their powers), a demonstration (shown happening), the wiki, an inference (a reader's or note's reading), or unknown.`;
const GRAMMAR_HELP = `Effect grammar: verb is the kind of change (${EFFECT_VERBS.join(', ')}); object is what it acts on (${Object.keys(EFFECT_OBJECTS).join(', ')}); target is who or where it reaches (${EFFECT_TARGETS.join(', ')}); time is how long it lasts (${EFFECT_TIMES.join(', ')}). Use "none" for a part the evidence does not give.`;
const CLASS_NAME = {authority: 'Authority or named working of a Witch Factor', witch_factor: 'Witch Factor', divine_protection: 'Divine Protection (blessing)', spell: 'spell',
    curse: 'curse', spirit_contract: 'spirit contract kind', return_by_death: 'Return by Death rule', other_art: 'named art, book or rule'};
export function labelPrompt(p, masked) {
    const subject = masked && ['spell', 'witch_factor', 'authority'].includes(p.cls) ? 'THIS POWER' : p.name;
    return `Fill the power sheet for the Re:Zero ${CLASS_NAME[p.cls]} "${subject}".
${GRAMMAR_HELP}
effect: what it does, one clause. who_may: who can hold or use it. where_from: how someone gets it; "route" is birth, inheritance, factor-transfer (a Witch Factor moving when its holder dies), contract, learned, trial, artifact, grant, other or unknown. go_wrong: cost, backlash or limits. mind: how it changes its holder's mind or personality. left_behind: what happens to it when the holder dies or it is transferred. combines: how it interacts with other powers. counters: what stops it. knowledge: what in-world people know about how it works ("who" is public, holder, institution, none or unknown).
${RULES}

Evidence:
${p.evidence.map(e => `[${e.loc}] ${masked ? e.masked : e.text}`).join('\n')}`;
}

async function runPool(jobs, size, fn) {
    for (let i = 0; i < jobs.length; i += size) await Promise.all(jobs.slice(i, i + size).map(fn));
}
const cost = (rows, rate) => {
    const ok = rows.filter(r => r.reply);
    const tin = ok.reduce((s, r) => s + (r.usage?.in ?? 0), 0), tout = ok.reduce((s, r) => s + (r.usage?.out ?? 0), 0);
    return {ok: ok.length, errors: rows.length - ok.length, inTokens: tin, outTokens: tout, cost: Number(((tin * rate.in + tout * rate.out) / 1e6).toFixed(4))};
};

async function stageLabel() {
    const pk = readJson(`${PRIV}rezero_packets.json`);
    const file = 'rezero_label_luna.json';
    const done = readIf(`${PRIV}${file}`, {});
    await runPool(pk.filter(p => !done[p.id]?.reply), 8, async p => {
        try { done[p.id] = await luna(labelPrompt(p, true), LABEL_SCHEMA); } catch (e) { done[p.id] = {error: String(e.message ?? e)}; }
        write(file, done);
    });
    console.log(JSON.stringify({pass: 'label', ...cost(Object.values(done), RATE)}));
}

let anthropic = null;
async function haiku(prompt, schema) {
    const {default: Anthropic} = await import('@anthropic-ai/sdk');
    anthropic ??= new Anthropic();
    const msg = await anthropic.messages.create({model: 'claude-haiku-5-5', max_tokens: 8000,
        output_config: {effort: 'low', format: {type: 'json_schema', schema}}, messages: [{role: 'user', content: prompt}]});
    if (msg.stop_reason === 'refusal') throw Error('haiku refusal');
    return {reply: JSON.parse(msg.content.filter(c => c.type === 'text').map(c => c.text).join('')), usage: {in: msg.usage.input_tokens, out: msg.usage.output_tokens}};
}
async function stageSecond() {
    const pk = readJson(`${PRIV}rezero_packets.json`);
    const file = 'rezero_second_haiku.json';
    const done = readIf(`${PRIV}${file}`, {});
    await runPool(pk.filter(p => !done[p.id]?.reply), 6, async p => {
        const prompt = `Read the evidence and fill only the effect-grammar parts of the Re:Zero ${CLASS_NAME[p.cls]} "${['spell', 'witch_factor', 'authority'].includes(p.cls) ? 'THIS POWER' : p.name}".\n${GRAMMAR_HELP}\nUse "none" when the evidence does not give a part.\n\nEvidence:\n${p.evidence.map(e => `[${e.loc}] ${e.masked}`).join('\n')}`;
        try { done[p.id] = await haiku(prompt, SECOND_SCHEMA); } catch (e) { done[p.id] = {error: String(e.message ?? e)}; }
        write(file, done);
    });
    console.log(JSON.stringify({pass: 'second', ...cost(Object.values(done), {in: 1.0 / 2, out: 5.0 / 2})}));
}

async function stageHeld() {
    const pk = readJson(`${PRIV}rezero_packets.json`).filter(p => p.cls === 'spell' || p.cls === 'authority');
    const file = 'rezero_held_luna.json';
    const done = readIf(`${PRIV}${file}`, {});
    await runPool(pk.filter(p => !done[p.id]?.reply), 8, async p => {
        const attr = p.cls === 'spell';
        const prompt = `Which ${attr ? `attribute (${ATTRIBUTES.join(', ')})` : `Witch Factor sin (${SINS.join(', ')})`} does the evidence say the Re:Zero ${attr ? 'spell' : 'power'} "${p.name}" has${attr ? '' : ' or belongs to'}? "label" is one of ${(attr ? ATTRIBUTES : SINS).join(', ')} or "none" when the evidence does not state it; a spell name alone is not evidence, and a guess is wrong. Copy the bracket of the supporting line into "locator" and say who states it in "speaker". Empty locator when label is none.\n\nEvidence:\n${p.evidence.map(e => `[${e.loc}] ${e.text}`).join('\n')}`;
        try { done[p.id] = await luna(prompt, HELD_SCHEMA); } catch (e) { done[p.id] = {error: String(e.message ?? e)}; }
        write(file, done);
    });
    console.log(JSON.stringify({pass: 'heldlabels', ...cost(Object.values(done), RATE)}));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const stage = process.argv[2];
    if (stage === 'denominator') {
        const rows = denominator();
        write('rezero_rows.json', rows);
        const live = rows.filter(r => !r.notAThing);
        console.log(JSON.stringify({rows: rows.length, live: live.length, notAThing: rows.length - live.length, heldOut: live.filter(r => r.heldOut).length}));
    } else if (stage === 'packets') {
        const pk = packets(readJson(`${PRIV}rezero_rows.json`));
        write('rezero_packets.json', pk);
        console.log(JSON.stringify({packets: pk.length, noEvidence: pk.filter(p => !p.evidence.length).length, chars: pk.reduce((s, p) => s + p.evidence.reduce((t, e) => t + e.text.length, 0), 0)}));
    } else if (stage === 'label') await stageLabel();
    else if (stage === 'second') await stageSecond();
    else if (stage === 'heldlabels') await stageHeld();
    else if (stage === 'build') (await import('./rezero_power_build.mjs')).build();
    else console.log('stages: denominator packets label second heldlabels build');
}
