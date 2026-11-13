// Builds docs/coverage/hp_spells.jsonl (chat S, plan CV1-CV4): one row per record
// of docs/research/HOGWARTS_SPELLBOOK_2026-11-11.md, in spellbook order. A record
// that is a row of the Hogwarts spell pack runs through the spell law (tested in
// tests/spell_grammar.test.js); the rest carry the state named in
// HP_SPELL_LEDGER_EXCEPTIONS. A row with a case scene in the Hogwarts effect pack
// carries `case` and is typed `expressed-authored` (PC5, PC10): the coverage runner
// executes the case and `check:coverage` fails if it computes anything else. The
// scene's amounts, places and marks are pack defaults, hence authored.
// Fails when any record is unclassified.
// Usage: node scripts/spell_coverage.mjs [--check]
import fs from 'node:fs';
import {HP_SPELL_ROWS, HP_SPELL_LEDGER_EXCEPTIONS} from '../src/spell_pack_hogwarts.js';
import {HP_CASE_SCENES, HP_CASE_MODULE, HP_CASE_LEFT_OUT} from '../src/world_packs/hp_effect_pack.js';

const book = 'docs/research/HOGWARTS_SPELLBOOK_2026-11-11.md', out = 'docs/coverage/hp_spells.jsonl';
const TEST = 'tests/spell_grammar.test.js#every Hogwarts spellbook row runs through the spell law';
const lines = fs.readFileSync(book, 'utf8').split('\n');
const end = lines.findIndex(l => l.startsWith('## Official index cross-reference'));
const records = lines.slice(0, end).map(l => l.match(/^\| `([a-z0-9-]+)` \| ([^|]+) \| [^|]+ \| ([^|]+) \|/)).filter(Boolean)
    .map(([, id, forms, evidence]) => ({id, forms: forms.trim(), evidence: evidence.trim()}));
const rows = new Map(HP_SPELL_ROWS.map(r => [r.id, r]));
const ledger = records.map(({id, forms, evidence}) => {
    const source = `HOGWARTS_SPELLBOOK_2026-11-11 ${id}; ${evidence}`;
    const row = rows.get(id), exception = HP_SPELL_LEDGER_EXCEPTIONS[id];
    if (row && exception) throw Error(`${id} is both a row and an exception.`);
    const scene = HP_CASE_SCENES[id];
    const gap = HP_CASE_LEFT_OUT[id];
    if (row) return {id, source, state: scene ? 'expressed-authored' : 'runs-authored', mechanisms: ['S', 'K'], test: TEST,
        ...(scene ? {case: {module: HP_CASE_MODULE, id}} : {}),
        note: `${forms}: effect from ${row.effectSource ?? 'the book'} (${row.truth.verb} ${row.truth.object}); wand carrier and stamina cost authored.${row.note ? ' ' + row.note : ''}${scene?.modelNote ? ' ' + scene.modelNote : ''}${gap ? ' ' + gap : ''}`};
    if (exception) return {id, source, state: exception.state, mechanisms: exception.mechanisms,
        test: exception.test ?? (exception.state.startsWith('blocked') ? TEST : ''),
        ...(exception.case ? {case: exception.case} : {}), note: `${forms}: ${exception.note}`};
    return {id, source, state: 'unclassified', mechanisms: ['S'], test: '', note: forms};
});
const extra = [...rows.keys(), ...Object.keys(HP_SPELL_LEDGER_EXCEPTIONS)].filter(id => !records.some(r => r.id === id));
if (extra.length) throw Error(`Not spellbook records: ${extra.join(', ')}`);
const text = ledger.map(r => JSON.stringify(r)).join('\n') + '\n';
if (process.argv.includes('--check')) {
    if (fs.readFileSync(out, 'utf8') !== text) { console.error(`${out} is stale; run node scripts/spell_coverage.mjs`); process.exit(1); }
} else fs.writeFileSync(out, text);
const count = s => ledger.filter(r => r.state.startsWith(s)).length;
console.log(`${ledger.length} records: expressed by case ${count('expressed')}, runs ${count('runs')}, blocked ${count('blocked')}, not-a-thing ${count('not-a-thing')}, unclassified ${count('unclassified')}`);
if (count('unclassified')) process.exit(1);
