#!/usr/bin/env node
// The Perfect Run power ledger (docs/research/power-catalogues-2026-11-16, PWC1-PWC7).
// Two steps, split so a checkout without the private folders still rebuilds the ledger (the shape test does):
//   refresh   reads the private digests and paid claims (absolute paths), pre-registers the split, the colour map and the
//             fold rule, writes the committed sidecar skeleton and the private packets. Run before any model call.
//   run       Luna (label pass) then haiku (second reader) fill the PWC1 sheet from the packets; replies stay private.
//   fold      normalises replies to enums, locators and speakers, scores the effect grammar against the world's own colour
//             classification, and writes the result into the sidecar.
//   build     reads ONLY docs/coverage/perfect_run_power_labels.json and writes docs/coverage/perfect_run_powers.jsonl.
// Usage:  node scripts/perfect_run_power_ledger.mjs refresh | run luna|haiku | fold | build
//   OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)" ANTHROPIC_API_KEY=... node ... run luna haiku
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {canonicalRow} from './slug_normalize.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES} from '../src/effect_grammar.js';
import {attachItemBoundRows} from './item_bound_ledgers.mjs';

const root = new URL('..', import.meta.url).pathname;
export const SIDECAR = `${root}docs/coverage/perfect_run_power_labels.json`;
export const LEDGER = `${root}docs/coverage/perfect_run_powers.jsonl`;
const PRIVATE = '/Users/weiwei/code/yet-another-idle-rpg/docs/research/power-catalogues-2026-11-16/private/';

// ---- Pre-registered before any model call (GKM429, PWC2) ------------------------------------------------------------
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33; // about a fifth, the repo's split
export const SPLIT_RULE = 'held out when sha1(id)[0] < 0x33 (GKM429), fixed before the label passes ran';
// Elixir colour families as the Alchemist's letter gives them (digest A 1.1, ch8): each draws on its own dimension.
// This map from the grammar's object to a colour was written from those domain words, before any reply and never fitted.
export const COLOUR_OF_OBJECT = Object.freeze({vitality: 'green', lifespan: 'green', information: 'blue', memory: 'blue', mind: 'blue',
    time: 'violet', position: 'violet', heat: 'red', light: 'red', force: 'red', sound: 'red', essence: 'red', form: 'orange', thing: 'orange',
    moisture: 'orange', soul: 'yellow', luck: 'yellow', relation: 'yellow', law: 'yellow', working: 'white'});
export const FOLD_RULE = 'The grammar tier folds into ledger notes only if, on the stated-colour rows, at least 5 agree with the colour map and the count exceeds the '
    + 'majority-colour baseline; otherwise its sentences stay in the sidecar as model-tier, unchecked. A reader-inferred colour is never a score.';
const COLOURS = ['green', 'blue', 'violet', 'red', 'orange', 'yellow', 'white', 'black'];
// The colour a holder's Genome has, where the paid claims (chapter text, locators `en b<book> c<chapter> p<paragraph>`) or the
// digests give one. basis: stated (narration, a scan or a plain claim), inferred (a character's or reader's deduction), conflict
// (two sources disagree). Only stated rows score; the rest are reported apart, since a reader who picked a colour from the
// effect would make the score circular.
export const COLOUR_LABELS = {
    'time-stop': {colour: 'violet', basis: 'stated', locator: 'en b1 c67 p19', speaker: 'narrator', note: 'Ryan called Violet Genome; scanned monocolor Violet (en b1 c86 p5)'},
    quicksave: {colour: 'violet', basis: 'stated', locator: 'en b1 c86 p5', speaker: 'demonstration'},
    'pr.person.leo-hargraves': {colour: 'red', basis: 'stated', locator: 'en b1 c40 p36', speaker: 'demonstration'},
    'pr.person.night-terror': {colour: 'blue', basis: 'stated', locator: 'en b1 c67 p40', speaker: 'character_claim'},
    'pr.person.livia': {colour: 'blue', basis: 'stated', locator: 'en b1 c98 p129', speaker: 'demonstration', note: 'with about 2.5% Violet (en b1 c83 p90)'},
    'pr.person.alphonse-manada': {colour: 'red', basis: 'stated', locator: 'en b1 c88 p70', speaker: 'demonstration'},
    'pr.person.narcinia': {colour: 'green', basis: 'stated', locator: 'en b1 c114 p62', speaker: 'character_claim', note: 'with Yellow influence from her father (same line)'},
    'pr.person.eva-fabre': {colour: 'blue', basis: 'stated', locator: 'en b1 c115 p6', speaker: 'character_claim'},
    'pr.person.shroud': {colour: 'orange', basis: 'conflict', locator: 'en b1 c17 p48', speaker: 'character_claim', note: "Ryan's deduction; digest A C9 records a Green reading"},
    'pr.person.augustus': {colour: 'red', basis: 'conflict', locator: 'digest-B ch75', speaker: 'unknown', note: 'digest A lists two Elixirs, digest B Red'},
    'pr.person.the-panda': {colour: 'green', basis: 'conflict', locator: 'en b1 c96 p81', speaker: 'unknown', note: 'Green plus an absorbed Blue Elixir (digest B)'},
    'pr.person.the-land': {colour: 'yellow', basis: 'conflict', locator: 'digest-B ch95', speaker: 'unknown', note: 'Yellow in digest A, Yellow or Orange in B'},
    'pr.person.geist': {colour: 'yellow', basis: 'inferred', locator: 'en b1 c104 p22', speaker: 'character_claim'},
    'pr.person.mr-wave': {colour: 'red', basis: 'inferred', locator: 'en b1 c105 p42', speaker: 'character_claim'},
    'pr.person.pluto': {colour: 'yellow', basis: 'inferred', locator: 'digest-B ch67-68', speaker: 'unknown'},
    'pr.person.fortuna': {colour: 'yellow', basis: 'inferred', locator: 'digest-A ch25-26', speaker: 'character_claim', note: 'per Ryan'},
    'pr.person.wardrobe': {colour: 'yellow', basis: 'inferred', locator: 'digest-A 1.1', speaker: 'unknown'},
    'pr.person.cancel': {colour: 'white', basis: 'inferred', locator: 'digest-A ch22', speaker: 'unknown'},
    'pr.person.len': {colour: 'blue', basis: 'inferred', locator: 'digest-A ch20', speaker: 'unknown'},
    'pr.person.atom-cat': {colour: 'red', basis: 'inferred', locator: 'digest-A ch11', speaker: 'unknown', note: 'Red by effect, never stated outright (digest A gap list)'},
    'pr.person.ki-jung': {colour: 'green', basis: 'inferred', locator: 'digest-A ch11', speaker: 'unknown'},
    'pr.person.julie-costa': {colour: 'green', basis: 'inferred', locator: 'digest-A ch27', speaker: 'unknown'}};
const colourWord = /\b(green|blue|violet|red|orange|yellow|white|black|purple|magenta|monocolou?r|genius(es)?)\b/gi;
export const redact = text => text.replace(colourWord, '[x]');

// ---- Blocking slugs (PWC5), shared across worlds; the new ones name their PR rule ------------------------------------
export const SLUGS = {
    'time-stop': 'PR1 freeze the world with a cooldown equal to its length; ability_records.js has fixed-minute cooldowns, no world freeze',
    'time-loop': 'PR2-PR3 one save, set by a held stop, reload on real death; anchor_snapshots.js branches a world at anchors, it does not restore a body on death',
    'memory-transfer': 'PR4 a consented, unbroken chain carries memory across a reset',
    'source-link': 'PR7-PR8 a power drawn from a colour dimension through Flux that a canceller can cut',
    'bond-slots': 'PR5 one Elixir per body, a second makes a Psycho',
    'body-code-decay': 'Psycho condition, code decay and sterility',
    'anti-power-site': 'PR9 a site that blocks named effects (Monaco)',
    'mind-binding': 'a power that binds or rewrites another mind (shared slug, PWC5)',
    'area-field': 'an effect that holds over an area and not a target (shared slug, PWC5)',
    'power-interaction': 'a power that answers another power (cancel, immunity, counter; shared slug, PWC5)'};

// ---- Sheet vocabulary (PWC1); free text stays private, enums are what is committed ------------------------------------
export const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown'];
export const SHEET = {
    who_may: ['anyone', 'genome-holder-only', 'named-holder-only', 'elixir-drinker', 'trained-user', 'institution-controlled', 'unknown'],
    where_from: ['natural-genome', 'true-elixir', 'knockoff-elixir', 'augusti-product', 'dynamis-product', 'built-tech', 'alien-or-purple-world', 'practice', 'other', 'unknown'],
    go_wrong: ['psycho', 'addiction-or-sterility', 'self-harm-or-overheat', 'dependence-or-decay', 'backlash-on-use', 'limit-only', 'none-stated', 'unknown'],
    mind: ['none-stated', 'personality-drift', 'rage-or-psychosis', 'addiction', 'memory-effect', 'loss-of-reality', 'unknown'],
    left_behind: ['dies-with-holder', 'persists-in-body', 'item-remains', 'reset-restores', 'unknown'],
    combines: ['stacks-with-other-elixir', 'boosted-by-tech', 'needs-flux-battery', 'none-stated', 'unknown'],
    counters: ['cancel', 'monaco', 'black-flux', 'immune-holder', 'range-or-distance', 'skill-or-tactics', 'drug-or-vaccine', 'none-stated', 'unknown'],
    known_by: ['public', 'holder-only', 'holder-and-ally', 'institution', 'no-one', 'unknown']};
export const GRAMMAR = {verb: [...EFFECT_VERBS, 'none'], object: [...Object.keys(EFFECT_OBJECTS), 'none'], target: [...EFFECT_TARGETS, 'none'], time: [...EFFECT_TIMES, 'none']};
const part = values => ({type: 'object', additionalProperties: false, required: ['value', 'locator', 'speaker'],
    properties: {value: {type: 'string', enum: values}, locator: {type: 'string'}, speaker: {type: 'string', enum: SPEAKERS}}});
export const SCHEMA = {type: 'object', additionalProperties: false, required: ['named_power', ...Object.keys(GRAMMAR), ...Object.keys(SHEET)],
    properties: {named_power: {type: 'string', enum: ['yes', 'no']}, ...Object.fromEntries([...Object.entries(GRAMMAR), ...Object.entries(SHEET)].map(([k, v]) => [k, part(v)]))}};
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 1)}\n`);

// ---- refresh --------------------------------------------------------------------------------------------------------
async function refresh() {
    const {entities} = (await import('./perfect_run_power_denominator.mjs')).entities();
    const rows = {};
    const packets = [];
    for (const e of entities) {
        const bad = e.layer === 'bad-run';
        const id = `pr.${bad ? 'badrun' : 'power'}.${e.key.replace(/^pr\.(person|creature)\./, '').replace(/^badrun-/, '').replace(/[:.]/g, '-')}`;
        const colourLabel = COLOUR_LABELS[e.key] ?? (e.category === 'elixir-colour' ? {colour: e.key.split(':')[1], basis: 'family', locator: 'digest-A 1.1', speaker: 'character_claim'} : null);
        rows[id] = {name: e.name, key: e.key, category: e.category, layer: e.layer, nameSource: [...e.nameSource].sort(), holders: e.holders,
            digestRows: e.digest.map(r => `${r.digest}:${r.item}`), claimCount: e.claims.length,
            ...(colourLabel ? {colour: colourLabel} : {}), heldOut: heldOut(id)};
        const lines = [];
        const seen = new Set();
        const push = (loc, text, tag) => { const t = text.replace(/\s+/g, ' ').trim().slice(0, 380); if (!t || seen.has(`${loc}|${t}`)) return; seen.add(`${loc}|${t}`); lines.push({loc, text: t, tag}); };
        for (const r of e.digest) {
            const loc = `${r.digest} ${r.locator.split(' (')[0]}`;
            push(loc, `${r.item}: ${r.effect}`, r.label); if (r.cost && r.cost !== 'Unknown' && r.cost !== 'Not shown') push(loc, `Cost: ${r.cost}`, r.label); push(loc, `Limits: ${r.limits}`, r.label);
        }
        for (const c of e.claims) {
            const tag = c.label ?? 'S';
            for (const x of [...(c.steps ?? []), ...(c.results ?? []), ...(c.costs ?? []), ...(c.products ?? [])]) {
                const w = typeof x === 'string' ? x : x.what ?? x.item ?? ''; push(x.locator ?? c.locator, `${c.name}: ${w}`, x.label ?? tag);
            }
            for (const x of [...(c.conditions ?? []), ...(c.limits ?? []), ...(c.consequences ?? [])]) push(c.locator, `${c.name}, limit or condition: ${typeof x === 'string' ? x : x.what}`, tag);
        }
        if (e.category === 'elixir-colour') {
            // The Alchemist's letter as digest A 1.1 gives it: each colour's domain, and the holders the reader fitted to it.
            const text = readFileSync('/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/perfect-run/digests/PR_A_DIGEST.md', 'utf8');
            const para = /### 1\.1 Elixir color model[^\n]*\n\n([^\n]+)/.exec(text)?.[1] ?? '';
            const c = e.key.split(':')[1]; const C = `${c[0].toUpperCase()}${c.slice(1)}`;
            for (const sentence of para.split(/(?<=\.)\s+/)) if (new RegExp(`\\b${C}\\b`).test(sentence)) push('A 1.1', sentence.replace(/\(s\d\d[^)]*\)/g, ''), 'T');
        }
        const scored = !['elixir-colour', 'elixir', 'knockoff', 'elixir-adjacent'].includes(e.category);
        packets.push({id, name: e.name, category: e.category, layer: e.layer, evidence: lines.slice(0, 45).map(l => `[${l.loc}] {${l.tag}} ${scored ? redact(l.text) : l.text}`)});
    }
    const meta = {schema: 'perfect-run-power-labels/1', date: '2026-11-16', status: 'proposals (AD32), agent-verified, not human-reviewed',
        split: SPLIT_RULE, colourMap: COLOUR_OF_OBJECT, foldRule: FOLD_RULE, slugs: SLUGS, mergedHolders: (await import('./perfect_run_power_denominator.mjs')).MERGES,
        denominator: {sources: ['docs/research/novels/perfect-run/DEEP_DIVE_2026-10-25.md', 'digests/PR_A_DIGEST.md and PR_B_DIGEST.md tables 1.2 and 1.1',
            'paid claims run 2026-11-01-pr (rules files, ability, potion and reset rules)', 'world-design-2026-10-11 and readers-2026-10-25 checked for names, none new'],
            rows: Object.keys(rows).length, excluded: 'conventional firearms, collectives (Genomes, Psychos, organizations), sports and skills with no named power'}};
    const old = existsSync(SIDECAR) ? read(SIDECAR) : {};
    write(SIDECAR, {meta: {...meta, ...(old.meta?.scores ? {scores: old.meta.scores} : {})}, rows: Object.fromEntries(Object.entries(rows).map(([id, r]) => [id, {...r, ...(old.rows?.[id]?.labels ? {labels: old.rows[id].labels} : {})}]))});
    mkdirSync(PRIVATE, {recursive: true});
    write(`${PRIVATE}perfect_run_packets.json`, packets);
    const leaks = packets.filter(p => !['elixir-colour', 'elixir', 'knockoff', 'elixir-adjacent'].includes(p.category)).flatMap(p => p.evidence.filter(l => /\b(green|blue|violet|red|orange|yellow|white|black|purple|magenta|genius)\b/i.test(l.replace(/^\[[^\]]*\]/, ''))));
    console.log(JSON.stringify({rows: Object.keys(rows).length, packets: packets.length, mainRows: Object.values(rows).filter(r => r.layer === 'main').length, badRunRows: Object.values(rows).filter(r => r.layer === 'bad-run').length, colourLeaks: leaks.length}));
}

// ---- run ------------------------------------------------------------------------------------------------------------
const RULES = `Use only the evidence lines given. Each starts with its locator in square brackets and a speaker tag in braces (S shown, T told by a character, I inferred, U unknown; copy the bracket's content exactly into "locator"). A field the evidence does not state takes the value "unknown" (or "none" for effect parts, "none-stated" only when the evidence says there is nothing), locator "" and speaker "unknown": an empty field is correct, a guess is wrong. "speaker" says who states it: narrator, character_claim (which may be wrong), demonstration (shown happening) or unknown.`;
const prompt = p => `Fill the power sheet for the Perfect Run power "${p.name}" (${p.category}). Chapter claims are summaries, not quotations.
named_power: "yes" when the evidence describes something this holder or thing does or is, "no" when it names no power or effect.
Effect (one grammar sentence for the primary effect): verb (${GRAMMAR.verb.join(', ')}); object, what it acts on (${GRAMMAR.object.join(', ')}); target (${GRAMMAR.target.join(', ')}); time (${GRAMMAR.time.join(', ')}).
Then, from the evidence only: who_may (who can hold or use it), where_from (how it is acquired), go_wrong (the cost, backlash or drift), mind (effect on the holder's mind), left_behind (what happens on death or reset), combines (what it stacks or works with), counters (what stops it), known_by (who in the world knows how it works).
Choices: ${Object.entries(SHEET).map(([k, v]) => `${k}: ${v.join(' | ')}`).join('. ')}.
${RULES}`;

async function runModel(which) {
    const packets = read(`${PRIVATE}perfect_run_packets.json`);
    const file = `${PRIVATE}perfect_run_${which}.json`;
    const done = existsSync(file) ? read(file) : {};
    let call;
    if (which === 'luna') call = (await import('./label_pass.mjs')).luna;
    else {
        const Anthropic = (await import('@anthropic-ai/sdk')).default; const client = new Anthropic();
        call = async (text, schema) => {
            const msg = await client.messages.create({model: 'claude-haiku-5-5', max_tokens: 8000, output_config: {effort: 'low', format: {type: 'json_schema', schema}}, messages: [{role: 'user', content: text}]});
            if (msg.stop_reason === 'refusal') throw Error('haiku refusal');
            return {reply: JSON.parse(msg.content.filter(b => b.type === 'text').map(b => b.text).join('')), usage: {in: msg.usage.input_tokens, out: msg.usage.output_tokens}};
        };
    }
    const queue = packets.filter(p => !done[p.id]?.reply);
    for (let i = 0; i < queue.length; i += 8) {
        await Promise.all(queue.slice(i, i + 8).map(async p => {
            try { done[p.id] = await call(`${prompt(p)}\n\nEvidence:\n${p.evidence.join('\n') || '(no evidence lines)'}`, SCHEMA); } catch (e) { done[p.id] = {error: String(e.message ?? e)}; }
        }));
        write(file, done);
    }
    const ok = Object.values(done).filter(r => r.reply);
    const tin = ok.reduce((s, r) => s + r.usage.in, 0), tout = ok.reduce((s, r) => s + r.usage.out, 0);
    const rate = which === 'luna' ? {in: 0.10, out: 0.50} : {in: 2, out: 10};
    console.log(JSON.stringify({model: which, packets: packets.length, ok: ok.length, errors: Object.values(done).filter(r => r.error).length, inTokens: tin, outTokens: tout,
        standardCost: Number(((tin * rate.in + tout * rate.out) / 1e6).toFixed(4))}));
}

// ---- fold -----------------------------------------------------------------------------------------------------------
// Keep a field only when its locator is a locator the packet offered; anything else is voided, so a model cannot invent one.
function normalise(reply, locators) {
    const out = {named_power: reply.named_power};
    for (const k of [...Object.keys(GRAMMAR), ...Object.keys(SHEET)]) {
        const f = reply[k]; const empty = k in GRAMMAR ? 'none' : 'unknown';
        const ok = f.value !== empty && f.value !== 'none-stated' ? locators.has(f.locator) : true;
        out[k] = ok ? {value: f.value, locator: locators.has(f.locator) ? f.locator : '', speaker: f.speaker} : {value: empty, locator: '', speaker: 'unknown', voided: f.value};
    }
    return out;
}
const locatorsOf = p => new Set(p.evidence.map(l => /^\[([^\]]*)\]/.exec(l)?.[1]).filter(Boolean));
const tallyBy = values => values.reduce((a, v) => ({...a, [v]: (a[v] ?? 0) + 1}), {});

function fold() {
    const side = read(SIDECAR);
    const packets = new Map(read(`${PRIVATE}perfect_run_packets.json`).map(p => [p.id, p]));
    const luna = read(`${PRIVATE}perfect_run_luna.json`);
    const haiku = existsSync(`${PRIVATE}perfect_run_haiku.json`) ? read(`${PRIVATE}perfect_run_haiku.json`) : {};
    let voided = 0;
    for (const [id, row] of Object.entries(side.rows)) {
        const p = packets.get(id); const l = luna[id]?.reply; if (!l) continue;
        const L = normalise(l, locatorsOf(p)); const H = haiku[id]?.reply ? normalise(haiku[id].reply, locatorsOf(p)) : null;
        const labels = {named_power: L.named_power, ...(H ? {second_named_power: H.named_power} : {})};
        for (const k of [...Object.keys(GRAMMAR), ...Object.keys(SHEET)]) {
            const lv = L[k]; const hv = H?.[k];
            if (lv.voided) voided++;
            const unset = k in GRAMMAR ? 'none' : 'unknown';
            const agree = !H ? 'luna-only' : lv.value === hv.value ? 'agreed' : lv.value === unset ? 'haiku-adds' : hv.value === unset ? 'luna-only' : 'disputed';
            labels[k] = {value: lv.value, locator: lv.locator, speaker: lv.speaker, second: hv?.value ?? null, reading: agree};
        }
        row.labels = labels;
    }
    // Score: effect grammar to colour on the stated rows (PWC2). The colour map is the frozen COLOUR_OF_OBJECT.
    const predict = r => COLOUR_OF_OBJECT[r.labels?.object?.value] ?? null;
    const lines = {};
    for (const [name, pick] of [['heldOut', r => r.colour?.basis === 'stated' && r.heldOut], ['statedTuned', r => r.colour?.basis === 'stated' && !r.heldOut], ['stated', r => r.colour?.basis === 'stated'],
        ['inferredCircular', r => r.colour?.basis === 'inferred'], ['conflict', r => r.colour?.basis === 'conflict']]) {
        const rows = Object.entries(side.rows).filter(([, r]) => r.layer === 'main' && r.labels && pick(r));
        const answered = rows.filter(([, r]) => predict(r));
        const majority = Object.values(tallyBy(rows.map(([, r]) => r.colour.colour))).sort((a, b) => b - a)[0] ?? 0;
        lines[name] = {n: rows.length, answered: answered.length, agree: answered.filter(([, r]) => predict(r) === r.colour.colour).length, majorityBaseline: majority,
            misses: answered.filter(([, r]) => predict(r) !== r.colour.colour).map(([id, r]) => `${id}:${r.labels.object.value}->${predict(r)} not ${r.colour.colour}`)};
    }
    const folded = lines.stated.agree >= 5 && lines.stated.agree > lines.stated.majorityBaseline;
    const counts = {rows: Object.keys(side.rows).length, namedPowerNo: Object.values(side.rows).filter(r => r.labels?.named_power === 'no').length,
        readings: tallyBy(Object.values(side.rows).flatMap(r => Object.entries(r.labels ?? {}).filter(([k]) => k in GRAMMAR).map(([, v]) => v.reading))),
        voidedLocators: voided, haikuRows: Object.keys(haiku).length};
    side.meta.scores = {lines, grammarFolded: folded, counts};
    write(SIDECAR, side);
    console.log(JSON.stringify(side.meta.scores, null, 1));
}

// ---- build (reads only committed files) ------------------------------------------------------------------------------
const BLOCK_BY_KEY = {'time-stop': 'time-stop', quicksave: 'time-loop', 'save-point-phantom': 'time-loop', 'memory-map-snapshot': 'memory-transfer', chronoradio: 'memory-transfer',
    'dual-elixir-bond': 'bond-slots', 'true-elixirs': 'bond-slots', 'psycho-condition': 'body-code-decay', 'mongrel-cocktail': 'body-code-decay', 'knockoff-elixir': 'body-code-decay',
    'black-elixir': 'source-link', 'black-flux': 'source-link', 'monaco-effect': 'anti-power-site', 'pr.person.cancel': 'power-interaction', 'pr.person.psyshock': 'mind-binding',
    'pr.person.bacchus': 'mind-binding', 'pr.person.the-land': 'area-field', 'saturn-armor': 'source-link', 'gravity-gun-opis-armor': 'source-link', 'pr.person.freddie-sabino': 'body-code-decay',
    'badrun-clockstopper': 'time-stop', 'badrun-len-violet': 'time-loop'};
export function buildLedger(side) {
    return Object.entries(side.rows).map(([id, r]) => {
        const l = r.labels;
        const grammar = l && l.object.value !== 'none' && l.verb.value !== 'none' ? `${l.verb.value}.${l.object.value}/${l.target.value}/${l.time.value}` : null;
        const slug = BLOCK_BY_KEY[r.key] ?? (r.category === 'elixir-colour' ? 'source-link' : l?.go_wrong?.value === 'psycho' ? 'body-code-decay' : l?.object?.value === 'mind' && l?.verb?.value === 'bind' ? 'mind-binding'
            : l?.target?.value === 'area' ? 'area-field' : ['block', 'end'].includes(l?.verb?.value) ? 'power-interaction' : null);
        const none = l && l.named_power === 'no' && (l.second_named_power ?? 'no') === 'no';
        const state = none ? 'not-a-thing:no-named-power' : slug ? `blocked:${slug}` : 'catalogued';
        const colour = r.colour ? ` Colour ${r.colour.colour} (${r.colour.basis}, ${r.colour.locator}).` : '';
        const note = `${r.layer === 'bad-run' ? 'Bad Runs what-if layer, not main continuity. ' : ''}${r.category}. Name source ${r.nameSource.join(', ')}.${colour}`
            + (grammar && side.meta.scores?.grammarFolded ? ` Effect ${grammar}.` : grammar ? ` Effect ${grammar} (model tier, unchecked).` : '')
            + (slug ? ` Blocked: ${SLUGS[slug]}.` : '') + ' Full sheet in perfect_run_power_labels.json.';
        return canonicalRow({id, source: [...r.nameSource].map(s => s.startsWith('digest') ? `perfect-run ${s}` : 'perfect-run paid claims 2026-11-01-pr').join('; '), state, mechanisms: [r.layer === 'bad-run' ? 'W' : 'W', ...(slug === 'mind-binding' ? ['A'] : [])], test: null, note});
    });
}
async function build() {
    const rows = await attachItemBoundRows(buildLedger(read(SIDECAR)));
    writeFileSync(LEDGER, `${rows.map(r => JSON.stringify(r)).join('\n')}\n`);
    console.log(JSON.stringify({rows: rows.length, states: tallyBy(rows.map(r => r.state.split(':')[0] + (r.state.startsWith('blocked') ? `:${r.state.split(':')[1]}` : '')))}));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [cmd, ...rest] = process.argv.slice(2);
    if (cmd === 'refresh') await refresh();
    else if (cmd === 'run') for (const w of rest) await runModel(w);
    else if (cmd === 'fold') fold();
    else if (cmd === 'build') await build();
    else { console.error('usage: refresh | run luna|haiku | fold | build'); process.exit(2); }
}
