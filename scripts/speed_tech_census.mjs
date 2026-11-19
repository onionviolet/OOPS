#!/usr/bin/env node
// Speed and tech census (2026-11-18). Selects ledger rows about speed, haste, reflexes, perception, time scale, cyberware,
// implants, gadgets or tech by a deterministic keyword and slug filter, then asks Luna (a stated-field label, AU17) for the
// row's mechanism. Ledger rows only, no book text. Labels go to a sidecar (docs/coverage/speed_tech_mechanism.json), not into
// the ledgers, because FIELDS in coverage_report.mjs rejects unknown row fields.
//   node scripts/speed_tech_census.mjs select            write private/census/rows.json, print counts
//   node scripts/speed_tech_census.mjs pass [runner flags]   Luna label pass (batch default)
//   node scripts/speed_tech_census.mjs normalise         write the sidecar and print counts
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {runPass} from './label_runner.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(root, 'private/census') + '/';
const COV = path.join(root, 'docs/coverage');
export const SIDECAR = path.join(COV, 'speed_tech_mechanism.json');
const SKIP = new Set(['interaction_oracle.jsonl', 'worlds.jsonl']);

// Deterministic filter: word match on the id and the first 400 characters of the note, or a stem match on the id and state slug.
const WORDS = /\b(speed|speedster|haste|hasted|quicken\w*|accelerat\w*|swift\w*|reflex\w*|perception|perceive\w*|time[- ]?scale|time[- ]?dilat\w*|slow[- ]?(time|motion)|cyber\w*|implant\w*|gadget\w*|tech|technolog\w*|technological|sandevistan|kerenzikov|augment\w*|bionic|nanite\w*)\b/i;
const STEMS = /(speed|haste|reflex|perception|time-scale|cyber|implant|gadget|tech|accelerat|quicken|sandevistan|kerenzikov|augment|nanit|bionic)/i;

export function selectRows() {
    const out = [];
    for (const f of fs.readdirSync(COV).filter(f => f.endsWith('.jsonl') && !SKIP.has(f)).sort()) {
        for (const line of fs.readFileSync(path.join(COV, f), 'utf8').split('\n')) {
            if (!line.trim()) continue;
            const r = JSON.parse(line), note = (r.note ?? '').slice(0, 400);
            if (WORDS.test(r.id.replace(/[._-]/g, ' ')) || STEMS.test(r.state) || WORDS.test(note))
                out.push({id: r.id, ledger: f.replace(/\.jsonl$/, ''), state: r.state, note});
        }
    }
    return out;
}

const MECH = ['clock_up', 'others_held', 'reaction_only', 'perception_only', 'tech_delivery', 'none'];
const SUBSTRATES = ['time', 'space', 'body', 'mind', 'chance', 'powers', 'rules', 'relations', 'beings', 'none'];
const TERMS = ['body_cost', 'energy_or_charge', 'time_cost', 'item_or_hardware', 'risk_or_failure', 'social_or_legal', 'cooldown', 'lifespan_or_soul', 'none'];

export const SYSTEM = `You label one row of a game-power ledger by MECHANISM, from the row's id, ledger name and short note only. You have no other text; if the note is thin, say so with confidence "low".
mechanism (the one best fit):
- clock_up: the user's OWN clock rate is above 1 (they act and move faster; the world still moves at its normal rate around them): speed, haste, accelerated movement or time sense.
- others_held: others are held, slowed to a stop or frozen (time stop, stasis, paralysis by time) while the user acts.
- reaction_only: faster reactions or initiative only (Kerenzikov, reflex boost, extra reactions), with no extra movement or action rate.
- perception_only: faster or sharper perception only (slow-motion sight, enhanced senses of time), no extra action rate.
- tech_delivery: technology, cyberware, an implant or a gadget that delivers some other effect (substrate) through hardware; name that effect in tech_delivers.
- none: the row is not really about speed, reflexes, perception, time scale or tech delivery (a keyword false hit, a place, an organisation, a plain item).
tech_delivers: when mechanism is tech_delivery, the substrate it delivers: time, space, body, mind, chance, powers, rules, relations, beings; else none.
terms: the costs the row says it carries (any that apply): body_cost, energy_or_charge, time_cost, item_or_hardware, risk_or_failure, social_or_legal, cooldown, lifespan_or_soul; [none] if the note states none. Do not guess costs the note does not state.
Reply with JSON only.`;

export const SCHEMA = {type: 'object', additionalProperties: false, required: ['mechanism', 'tech_delivers', 'terms', 'confidence'], properties: {
    mechanism: {type: 'string', enum: MECH}, tech_delivers: {type: 'string', enum: SUBSTRATES},
    terms: {type: 'array', items: {type: 'string', enum: TERMS}}, confidence: {type: 'string', enum: ['low', 'medium', 'high']}}};

const argv = process.argv.slice(2);
async function main() {
    fs.mkdirSync(DIR, {recursive: true});
    if (argv[0] === 'select') {
        const rows = selectRows();
        fs.writeFileSync(DIR + 'rows.json', JSON.stringify(rows));
        const by = {}; for (const r of rows) by[r.ledger] = (by[r.ledger] ?? 0) + 1;
        console.log(JSON.stringify({rows: rows.length, ledgers: Object.keys(by).length}));
    } else if (argv[0] === 'pass') {
        const rows = selectRows();
        const items = rows.map(r => ({id: r.id, user: `LEDGER ${r.ledger}\nID ${r.id}\nSTATE ${r.state}\nNOTE ${r.note || '(none)'}`}));
        await runPass({name: 'census', dir: DIR, system: SYSTEM, schema: SCHEMA, items, model: 'gpt-6-luna', effort: 'low', maxTokens: 800}, argv.slice(1));
    } else if (argv[0] === 'normalise') {
        const rows = selectRows(), rep = JSON.parse(fs.readFileSync(DIR + 'census_luna.json', 'utf8'));
        const labels = {}, counts = {}, terms = {}, byWorld = {};
        for (const r of rows) {
            const x = rep[r.id]?.reply; if (!x) continue;
            labels[r.id] = {mechanism: x.mechanism, ...(x.mechanism === 'tech_delivery' ? {tech_delivers: x.tech_delivers} : {}), terms: x.terms.filter(t => t !== 'none'), confidence: x.confidence};
            counts[x.mechanism] = (counts[x.mechanism] ?? 0) + 1;
            for (const t of labels[r.id].terms) terms[t] = (terms[t] ?? 0) + 1;
            if (x.mechanism !== 'none') { const w = r.ledger; byWorld[w] = (byWorld[w] ?? 0) + 1; }
        }
        const sorted = o => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]));
        fs.writeFileSync(SIDECAR, JSON.stringify({
            note: 'Generated by node scripts/speed_tech_census.mjs normalise. Luna labels (gpt-6-luna, unchecked), ledger rows only. The mechanism field of a ledger row, kept in a sidecar because coverage_report FIELDS has no mechanism field.',
            selected: rows.length, labelled: Object.keys(labels).length, counts: sorted(counts), terms: sorted(terms), labels}, null, 0).replace(/},"/g, '},\n"'));
        console.log(JSON.stringify({selected: rows.length, labelled: Object.keys(labels).length, counts: sorted(counts), terms: sorted(terms), topLedgers: Object.entries(sorted(byWorld)).slice(0, 12)}));
    } else console.log('usage: select | pass | normalise');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
