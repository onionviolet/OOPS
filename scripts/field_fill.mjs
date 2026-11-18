#!/usr/bin/env node
// Field fill for the blocked laws (PWC60, PWC67-PWC74): name the fields a law reads, have two readers fill them from each
// row's own text, keep what both state, count how many rows the law would take. No engine law is built here.
//
//   node scripts/field_fill.mjs freeze                      pilot sets (60 rows per slug by hash) and the row snapshot
//   node scripts/field_fill.mjs run <slug> <pilot|full> <luna|haiku> [--sync|--wait|--dry|--max-usd N]
//   node scripts/field_fill.mjs merge <slug>                both readers -> docs/coverage/fields/<slug>.jsonl
//   node scripts/field_fill.mjs report <slug>               per-field filled share, agreement, dry-run take (markdown)
//
// Evidence is the row's own ledger note (a paraphrase already in git) or, for the rule rows that feed per-world dials, the
// rule statement. A field the text does not state is `unknown`, never a guess (AU17: Luna declines, Haiku has recall, each
// is the other's second reader; a field both state is confirmed, a one-reader field stays review-only, a disagreement goes
// to source review and counts as unknown here). Replies live in work/field_fill/ and are deleted when the lane ends.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {runPass, cost} from './label_runner.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COVERAGE = path.join(root, 'docs/coverage');
const OUT = path.join(COVERAGE, 'fields');
const WORK = path.join(root, 'work/field_fill/');
const MODELS = {luna: 'gpt-6-luna', haiku: 'claude-haiku-5-5'};
const U = 'unknown';
const E = (...v) => [...v, U];

// Each field: {def, values}. `required` is what the law reads; the rest ride along as dials.
export const LAWS = {
    'area-field': {
        what: 'an area field: a region, zone, cloud, aura or emplacement that keeps acting on whatever is inside it',
        required: ['shape', 'size', 'duration', 'affects', 'inside', 'ends'],
        fields: {
            fits: {def: 'does the text describe an effect that fills or covers a region or zone (not a single target, not a creature or object with no area)', values: E('area', 'not-area')},
            shape: {def: 'the footprint: sphere or circle around a point, cone, line or beam, cube or box, emanation around the holder (moves with them), a fixed site or region, scattered patches', values: E('sphere', 'cone', 'line', 'box', 'aura-on-holder', 'site-or-region', 'patches')},
            size: {def: 'how far it reaches: touch or a few steps, short (up to about 30 m or a room), wide (a field, building, village or battlefield), vast (a city, realm or world)', values: E('touch', 'short', 'wide', 'vast')},
            duration: {def: 'how long it lasts once made: instant, rounds-to-minutes, hours-to-days, until-ended (stays until something ends it or the source stops), permanent', values: E('instant', 'minutes', 'hours-days', 'until-ended', 'permanent')},
            affects: {def: 'who or what it acts on: the holder only, allies, enemies, everyone inside, chosen targets, objects or terrain', values: E('holder', 'allies', 'enemies', 'everyone', 'chosen', 'terrain-or-objects')},
            inside: {def: 'what it does to things inside: damage, hinder-or-restrain, protect-or-heal, sense-or-conceal, change-terrain, change-mind-or-condition, create-or-summon, other', values: E('damage', 'hinder', 'protect-or-heal', 'sense-or-conceal', 'change-terrain', 'change-mind-or-condition', 'create-or-summon', 'other')},
            stacking: {def: 'what happens when two overlap or repeat: stacks, replaces (only the stronger or latest counts), or separate (each acts alone)', values: E('stacks', 'replaces', 'separate')},
            cost: {def: 'what the holder pays: nothing stated, a per-use resource or charge, upkeep (concentration or paying each turn), a material or component, a drawback or price', values: E('none', 'resource', 'upkeep', 'material', 'drawback')},
            ends: {def: 'how it stops: runs out of time, the holder dismisses or stops concentrating, a save or counter-effect removes it, the source is destroyed or leaves, never ends', values: E('timeout', 'dismissed', 'removed-by-counter', 'source-lost', 'never')},
        },
    },
    'form-transformation': {
        what: 'a form transformation: a being or object takes another shape, species, material or body plan',
        required: ['change', 'abilities', 'duration', 'reversal'],
        fields: {
            fits: {def: 'does the text describe a change of form (not damage, not a mere disguise of nothing, not a permanent creature that was always that form)', values: E('transforms', 'not-transform')},
            change: {def: 'what changes: the body or species, size only, material or substance (flesh to stone), looks only, an object into another object, the mind or identity, the set of abilities', values: E('body-or-species', 'size', 'material', 'looks-only', 'object', 'mind-or-identity', 'abilities-only')},
            target: {def: 'who changes: the holder, a willing other, an unwilling other, an object, an area of things', values: E('holder', 'willing-other', 'unwilling-other', 'object', 'area')},
            abilities: {def: 'what happens to abilities: gains the new form\'s, loses its own, both, or neither (only looks change)', values: E('gains', 'loses', 'both', 'neither')},
            duration: {def: 'how long the new form lasts: instant, rounds-to-minutes, hours-to-days, until-ended, permanent', values: E('instant', 'minutes', 'hours-days', 'until-ended', 'permanent')},
            trigger: {def: 'how it starts: the holder chooses at will, an action or activation, an event or condition, always on (innate), a ritual, item or dose', values: E('at-will', 'activation', 'event', 'innate', 'ritual-or-item')},
            reversal: {def: 'how it undoes: the holder reverts at will, it times out, a counter-effect or dispel undoes it, it cannot be undone', values: E('at-will', 'timeout', 'counter', 'none')},
            cost: {def: 'what the holder pays: nothing stated, a per-use resource, upkeep, a material or component, a drawback or risk', values: E('none', 'resource', 'upkeep', 'material', 'drawback')},
            limits: {def: 'the stated restriction: limited to a size or type of form, once per period, needs a source or material, or none stated', values: E('type-or-size', 'once-per-period', 'needs-source', 'none')},
        },
    },
};

const sha = s => createHash('sha1').update(s).digest('hex');
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const lines = f => fs.readFileSync(f, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));

/** Every blocked row of the slug (ledger rows) plus the rule rows that derive it (the per-world dial source, PWC64). */
export function rowsOf(slug) {
    const out = [];
    for (const f of fs.readdirSync(COVERAGE).filter(f => f.endsWith('.jsonl') && !['worlds.jsonl', 'interaction_oracle.jsonl'].includes(f)).sort())
        for (const r of lines(path.join(COVERAGE, f)))
            if (r.state === `blocked:${slug}`) out.push({id: r.id, kind: 'row', ledger: f.replace('.jsonl', ''), text: r.note});
    for (const f of fs.readdirSync(COVERAGE).filter(f => f.endsWith('_rules.json')).sort()) {
        const j = readJson(path.join(COVERAGE, f));
        for (const r of j.rules ?? []) if ((r.derives ?? []).includes(slug)) out.push({id: r.id, kind: 'rule', ledger: j.meta.world, text: r.statement});
    }
    return out;
}

const trim = s => (s.length > 900 ? `${s.slice(0, 900)} [cut]` : s);

export function system(slug) {
    const law = LAWS[slug];
    const defs = Object.entries(law.fields).map(([k, f]) => `- ${k} (${f.values.join(' | ')}): ${f.def}.`).join('\n');
    return [`You read one short entry from a power catalogue and fill fixed fields describing ${law.what}. The entry is a paraphrase in a ledger note or a rule statement; it is your only evidence.`,
        'Rules:',
        `1. Fill a field only when the entry itself states it or plainly means it. If the entry does not say, answer "${U}". Never fill a field from what you know of the game, book or spell elsewhere, and never from the name alone.`,
        `2. "${U}" is a good answer. A wrong filled field is worse than an unknown one.`,
        '3. Pick exactly one value per field from its list. When two values fit, pick the one the entry stresses; if it stresses neither, answer unknown.',
        '4. The first field says whether the entry is about this kind of effect at all; if not, still fill the rest only where the entry states them.',
        '', 'Fields:', defs, '', 'Answer with the JSON object only.'].join('\n');
}

export function schema(slug) {
    const props = Object.fromEntries(Object.entries(LAWS[slug].fields).map(([k, f]) => [k, {type: 'string', enum: f.values}]));
    return {type: 'object', properties: props, required: Object.keys(props), additionalProperties: false};
}

const hash = (slug, id) => sha(`${slug}:${id}`);
const pilotFile = slug => path.join(OUT, `${slug}.pilot.json`);

function freeze() {
    fs.mkdirSync(OUT, {recursive: true});
    for (const slug of Object.keys(LAWS)) {
        const rows = rowsOf(slug);
        const pick = kind => rows.filter(r => r.kind === kind).sort((a, b) => hash(slug, a.id).localeCompare(hash(slug, b.id))).slice(0, kind === 'row' ? 60 : 30).map(r => r.id);
        fs.writeFileSync(pilotFile(slug), JSON.stringify({slug, rule: 'sha1(slug:id) ascending; 60 ledger rows and 30 rule rows', rows: pick('row'), rules: pick('rule')}, null, 1) + '\n');
        console.log(slug, rows.filter(r => r.kind === 'row').length, 'rows', rows.filter(r => r.kind === 'rule').length, 'rule rows');
    }
}

async function run(slug, stage, who, argv) {
    const all = rowsOf(slug);
    const frozen = readJson(pilotFile(slug));
    const ids = new Set([...frozen.rows, ...frozen.rules]);
    const rows = stage === 'pilot' ? all.filter(r => ids.has(r.id)) : all;
    fs.mkdirSync(WORK, {recursive: true});
    const items = rows.map(r => ({id: r.id, user: `${r.kind === 'rule' ? `Rule statement (${r.ledger})` : `Ledger note (${r.ledger})`}: ${trim(r.text)}`}));
    // One pass name per slug, so pilot replies are reused by the full run and never paid twice.
    return runPass({name: `ff_${slug}`, dir: WORK, system: system(slug), schema: schema(slug), items, model: MODELS[who], effort: 'low', maxTokens: 1200}, argv);
}

const replyFile = (slug, who) => path.join(WORK, `ff_${slug}_${who}.json`);
const readReplies = (slug, who) => fs.existsSync(replyFile(slug, who)) ? readJson(replyFile(slug, who)) : {};

/** Merge the two readers' replies. A field is confirmed when both state the same value; one reader's lone value is review-only. */
export function mergeRow(slug, l, h) {
    const f = {}, r = {};
    for (const k of Object.keys(LAWS[slug].fields)) {
        const a = l?.[k] ?? U, b = h?.[k] ?? U;
        if (a !== U && a === b) f[k] = a;
        else if (a !== U && b === U) r[k] = {luna: a};
        else if (a === U && b !== U) r[k] = {haiku: b};
        else if (a !== U && b !== U) r[k] = {luna: a, haiku: b};
    }
    return {f, r};
}

function merge(slug) {
    const L = readReplies(slug, 'luna'), H = readReplies(slug, 'haiku'), meta = Object.fromEntries(rowsOf(slug).map(r => [r.id, r]));
    const out = [];
    for (const id of Object.keys(meta).sort()) {
        if (!L[id]?.reply && !H[id]?.reply) continue;
        const {f, r} = mergeRow(slug, L[id]?.reply, H[id]?.reply);
        out.push({id, kind: meta[id].kind, ledger: meta[id].ledger, f, ...(Object.keys(r).length ? {r} : {}), ...(L[id]?.reply && H[id]?.reply ? {} : {one: L[id]?.reply ? 'luna' : 'haiku'})});
    }
    fs.mkdirSync(OUT, {recursive: true});
    fs.writeFileSync(path.join(OUT, `${slug}.jsonl`), out.map(r => JSON.stringify(r)).join('\n') + '\n');
    console.log(`${slug}: ${out.length} rows merged`);
}

/** Share table, agreement and dry-run take over merged rows of one kind. */
export function summarize(slug, rows) {
    const law = LAWS[slug], keys = Object.keys(law.fields), n = rows.length;
    const per = {};
    for (const k of keys) {
        const conf = rows.filter(r => r.f[k] !== undefined).length;
        const stated = rows.filter(r => r.f[k] !== undefined || r.r?.[k]).length;
        const dis = rows.filter(r => r.r?.[k]?.luna && r.r[k].haiku).length;
        per[k] = {filled: conf / n, review: (stated - conf) / n, agree: stated ? (conf / stated) : null, dis};
    }
    const ok = (r, keysNeeded, loose) => keysNeeded.every(k => r.f[k] !== undefined || (loose && r.r?.[k] && !(r.r[k].luna && r.r[k].haiku)));
    const fits = r => r.f.fits !== 'not-area' && r.f.fits !== 'not-transform';
    return {n, per, take: rows.filter(r => fits(r) && ok(r, law.required, false)).length, takeLoose: rows.filter(r => fits(r) && ok(r, law.required, true)).length,
        notFit: rows.filter(r => !fits(r)).length, takeAll: rows.filter(r => fits(r) && ok(r, keys, false)).length};
}

/**
 * Dry run with law defaults (coordinator, 2026-11-17; no new spend). For each required field a row does not state, the law
 * supplies a default: the commonest confirmed value in the row's own ledger (the world or system) when it has at least 5
 * confirmed rows and that value holds at least half of them, else the commonest confirmed value across the slug. Rows override
 * only what they state, so a default is a dial per world, never a fact about the row. Returns how many rows are complete under
 * the rule and how many required fields each row took from a default.
 */
export function withDefaults(slug, rows) {
    const law = LAWS[slug], mode = vals => {
        const c = {};
        for (const v of vals) c[v] = (c[v] ?? 0) + 1;
        const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
        return top ? {value: top[0], n: vals.length, share: top[1] / vals.length} : null;
    };
    const fits = r => r.f.fits !== 'not-area' && r.f.fits !== 'not-transform';
    const live = rows.filter(fits);
    const global = {}, byLedger = {};
    for (const k of law.required) {
        global[k] = mode(live.filter(r => r.f[k] !== undefined).map(r => r.f[k]));
        for (const l of new Set(live.map(r => r.ledger))) {
            const m = mode(live.filter(r => r.ledger === l && r.f[k] !== undefined).map(r => r.f[k]));
            if (m && m.n >= 5 && m.share >= 0.5) (byLedger[l] ??= {})[k] = m.value;
        }
    }
    const taken = {0: 0, 1: 0, 2: 0, '3+': 0}, source = {row: 0, ledger: 0, law: 0, none: 0};
    let complete = 0;
    for (const r of live) {
        let d = 0, ok = true;
        for (const k of law.required) {
            if (r.f[k] !== undefined) source.row++;
            else if (byLedger[r.ledger]?.[k]) { source.ledger++; d++; }
            else if (global[k]) { source.law++; d++; }
            else { source.none++; ok = false; }
        }
        if (ok) { complete++; taken[d >= 3 ? '3+' : d]++; }
    }
    return {n: rows.length, live: live.length, complete, taken, source, global: Object.fromEntries(law.required.map(k => [k, global[k] && `${global[k].value} (${Math.round(global[k].share * 100)}% of ${global[k].n})`]))};
}

function report(slug, scope) {
    const rows = lines(path.join(OUT, `${slug}.jsonl`));
    const pilot = readJson(pilotFile(slug)), pilotIds = new Set([...pilot.rows, ...pilot.rules]);
    const use = scope === 'pilot' ? rows.filter(r => pilotIds.has(r.id)) : rows;
    const pct = x => `${Math.round(x * 100)}%`;
    for (const kind of ['row', 'rule']) {
        const sub = use.filter(r => r.kind === kind);
        if (!sub.length) continue;
        const s = summarize(slug, sub);
        console.log(`\n### ${slug}, ${kind === 'row' ? 'ledger rows' : 'rule rows'} (${scope}, ${s.n} rows)\n`);
        console.log('| Field | Confirmed | One reader | Agreement | Disputed |\n| --- | ---: | ---: | ---: | ---: |');
        for (const [k, v] of Object.entries(s.per)) console.log(`| ${k}${LAWS[slug].required.includes(k) ? ' (required)' : ''} | ${pct(v.filled)} | ${pct(v.review)} | ${v.agree === null ? 'n/a' : pct(v.agree)} | ${v.dis} |`);
        console.log(`\nDry run: ${s.take} of ${s.n} rows (${pct(s.take / s.n)}) have every required field confirmed; ${s.takeLoose} (${pct(s.takeLoose / s.n)}) counting a lone reader; ${s.takeAll} with all fields; ${s.notFit} read as not this effect.`);
        const d = withDefaults(slug, sub);
        console.log(`With law defaults: ${d.complete} of ${d.n} rows (${pct(d.complete / d.n)}) complete (${d.live} read as this effect). Required fields per row from the row ${d.source.row}, ledger default ${d.source.ledger}, law default ${d.source.law}, none ${d.source.none}; rows needing 0/1/2/3+ defaults: ${d.taken[0]}/${d.taken[1]}/${d.taken[2]}/${d.taken['3+']}.`);
        console.log('Law defaults: ' + Object.entries(d.global).map(([k, v]) => `${k} ${v}`).join('; '));
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [cmd, slug, a, b] = process.argv.slice(2);
    const argv = process.argv.slice(2);
    if (cmd === 'freeze') freeze();
    else if (cmd === 'run') await run(slug, a, b, argv);
    else if (cmd === 'merge') merge(slug);
    else if (cmd === 'report') report(slug, a ?? 'full');
    else if (cmd === 'spend') {
        let usd = 0;
        for (const s of Object.keys(LAWS)) for (const who of Object.keys(MODELS)) for (const r of Object.values(readReplies(s, who))) if (r.reply) usd += cost(MODELS[who], r.usage, {batch: !!r.batch});
        console.log(`spend $${usd.toFixed(4)}`);
    } else console.log('usage: freeze | run <slug> <pilot|full> <luna|haiku> | merge <slug> | report <slug> [pilot|full] | spend');
}
