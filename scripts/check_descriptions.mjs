#!/usr/bin/env node
// Mechanical inventory for the later description drafting pass. This module
// loads authoring registries and content factories only; it never loads app UI.
import {createHash} from 'node:crypto';
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {resolve, relative, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {expeditionRegistry} from '../src/expedition_content.js';
import {createFoundationStartContent} from '../src/foundation_start_content.js';
import {createLocalLivelihoodContent} from '../src/local_livelihood_content.js';
import {createWarmHandStartContent} from '../src/warm_hand_start_content.js';
import {createLanternLoanStartContent} from '../src/lantern_loan_start_content.js';
import {createSlakeBenchStartContent} from '../src/slake_bench_start_content.js';
import {compileStructuredPack} from '../src/structured_pack_definitions.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = resolve(root, 'docs/reviews/DESCRIPTION_LINT_2026-10-26.md');
const sourceFiles = readdirSync(resolve(root, 'src')).filter(name => name.endsWith('.js')).sort();
const sourceHash = createHash('sha256');
for (const name of sourceFiles) {
  sourceHash.update(name).update('\0').update(readFileSync(resolve(root, 'src', name))).update('\0');
}

const sourceSha256 = sourceHash.digest('hex');
const definitions = [];
const missingDescriptions = [];
const add = (origin, rows, family) => {
  for (const row of rows || []) {
    if (!row || typeof row !== 'object') continue;
    const description = row.description;
    if (description === undefined) {
      missingDescriptions.push({origin, family, id: row.id || row.worldId || '(no id)'});
      continue;
    }
    definitions.push({
      id: row.id || row.worldId || '(no id)',
      world: row.worldId || row.world?.id || (family === 'worlds' ? row.id : null) || 'unscoped',
      family,
      origin,
      description: typeof description === 'string' ? description : String(description ?? ''),
    });
  }
};

for (const family of ['worlds', 'actions', 'opportunities', 'capabilities', 'sources', 'rollTables', 'techniques']) {
  add('src/expedition_content.js', expeditionRegistry[family].values(), family);
}
for (const family of ['people', 'commands', 'powers', 'advancements', 'sites', 'events', 'controllers', 'transitions', 'origins', 'conditions', 'encounters', 'energies', 'pursuits', 'situations', 'containers']) {
  add('src/expedition_content.js', expeditionRegistry.simulation[family].values(), `simulation.${family}`);
}

const structuredFactories = [
  ['src/foundation_start_content.js', createFoundationStartContent],
  ['src/local_livelihood_content.js', createLocalLivelihoodContent],
  ['src/warm_hand_start_content.js', createWarmHandStartContent],
  ['src/lantern_loan_start_content.js', createLanternLoanStartContent],
  ['src/slake_bench_start_content.js', createSlakeBenchStartContent],
];
for (const [origin, factory] of structuredFactories) {
  const {definition} = compileStructuredPack(factory());
  add(origin, [definition.world], 'worlds');
  for (const family of ['locations', 'items', 'starts', 'renewal', 'extensions']) {
    const value = definition[family];
    add(origin, Array.isArray(value) ? value : value ? [value] : [], family);
  }
  for (const family of ['people', 'commands', 'powers', 'advancements', 'sites', 'events', 'controllers', 'transitions', 'origins', 'conditions', 'encounters', 'energies', 'pursuits', 'situations', 'containers']) {
    add(origin, definition.simulation?.[family], `simulation.${family}`);
  }
}

const idTokens = new Set(definitions.map(row => row.id));
for (const family of ['worlds', 'actions', 'opportunities', 'capabilities', 'sources', 'rollTables', 'techniques']) {
  for (const row of expeditionRegistry[family].values()) idTokens.add(row.id);
}
for (const family of ['people', 'commands', 'powers', 'advancements', 'sites', 'events', 'controllers', 'transitions', 'origins', 'conditions', 'encounters', 'energies', 'pursuits', 'situations', 'containers']) {
  for (const row of expeditionRegistry.simulation[family].values()) idTokens.add(row.id);
}
// UR73 / UI audit UIX3: a tuned number or row reads as a plain value; its review
// status belongs in Authoring. "<Feature> (proposal)" titles for unaccepted
// features stay legal under UR2, so only qualifier forms are flagged.
const statusLabelPattern = /\(a proposal\)|\(proposal[;:,][^)]*\)|\(proposal threshold\)|\bare proposals\b|\bis a proposal\b/i;
const stringLiteralPattern = /(['"`])((?:\\.|(?!\1).)*)\1/g;
export const playerStringFindings = (source, file = '') => {
  const findings = [];
  source.split('\n').forEach((line, index) => {
    if (/^\s*(?:\/\/|\*|\/\*)/.test(line)) return;
    for (const [, , literal] of line.matchAll(stringLiteralPattern)) {
      const hit = literal.match(statusLabelPattern);
      if (hit) findings.push({file, line: index + 1, label: hit[0], text: literal.slice(0, 120)});
    }
  });
  return findings;
};
const listSources = dir => readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
  const path = resolve(dir, entry.name);
  return entry.isDirectory() ? listSources(path) : entry.name.endsWith('.js') ? [path] : [];
});
const statusLabels = listSources(resolve(root, 'src')).sort()
  .flatMap(path => playerStringFindings(readFileSync(path, 'utf8'), relative(root, path)));

export const descriptionFindings = (row, knownIds = idTokens) => {
  const text = typeof row.description === 'string' ? row.description.trim() : '';
  if (row.description === undefined) return ['missing-description-needs-review'];
  const findings = [];
  if (!text) findings.push('empty');
  if (text.length < 20) findings.push('under-20-chars');
  if (/\b(?:placeholder|TODO|lorem)\b/i.test(text)) findings.push('placeholder-marker');
  if (statusLabelPattern.test(text)) findings.push('status-label');
  if (/^[\d\s()+*/.%×÷−-]+$/.test(text) && /\d/.test(text) && /[+*/×÷−-]/.test(text)) findings.push('formula-only');
  const snake = text.match(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g) || [];
  const exactIds = [...knownIds].filter(id => id.length >= 4 && text.includes(id));
  const leaked = [...new Set([...snake, ...exactIds])];
  if (leaked.length) findings.push(`raw-token:${leaked.join(',')}`);
  return findings;
};

const rows = definitions.map(row => ({...row, findings: descriptionFindings(row)}));
const flagged = rows.filter(row => row.findings.length);
const groups = new Map();
for (const row of rows) {
  const key = `${row.world} | ${row.origin}`;
  const group = groups.get(key) || {total: 0, flagged: 0};
  group.total++;
  if (row.findings.length) group.flagged++;
  groups.set(key, group);
}

const report = [
  '# Description lint inventory (generated)',
  '',
  `Generated from the current authored source tree. Source SHA-256: \`${sourceSha256}\`.`,
  '',
  `Descriptions checked: ${rows.length}. With mechanical flags: ${flagged.length}. Missing description fields inventoried for applicability review: ${missingDescriptions.length}.`,
  '',
  'Flags are drafting leads only. The check does not score narrative quality or rewrite copy.',
  'Scanned definitions come from the frozen `expeditionRegistry` content and simulation Maps plus built-in schema-2 factories compiled through `compileStructuredPack`; optional user packs are excluded because they are private runtime inputs.',
  'The combined registry does not retain source-module provenance for each row, so those counts use `src/expedition_content.js` as the registry source. Structured factory rows retain their factory module path.',
  '',
  'Missing fields are not silently skipped or automatically defects: some structural records do not need player prose. This inventory does not determine that applicability, nor does it certify effect-first writing.',
  '',
  '## Counts by world and source file',
  '',
  '| World | Source file | Descriptions | Flagged |',
  '| --- | --- | ---: | ---: |',
  ...[...groups].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => {
    const [world, file] = key.split(' | ');
    return `| ${world} | \`${file}\` | ${value.total} | ${value.flagged} |`;
  }),
  '',
  '## Missing fields: applicability unassessed',
  '',
  '| Definition | Family | Source |',
  '| --- | --- | --- |',
  ...missingDescriptions.map(row => `| \`${row.id}\` | ${row.family} | \`${row.origin}\` |`),
  '',
  '## Status labels in player strings (UR73)',
  '',
  'String literals in `src/` that qualify a value or row as a proposal. Feature titles of the form "Name (proposal)" are not listed (UR2).',
  '',
  statusLabels.length ? '| Source | Line | Label | Text |' : 'None found.',
  ...(statusLabels.length ? ['| --- | ---: | --- | --- |'] : []),
  ...statusLabels.map(row => `| \`${row.file}\` | ${row.line} | ${row.label} | ${row.text.replaceAll('|', '\\|')} |`),
  '',
  '## Drafting pass list',
  '',
  '| World | Definition | Family | Source | Flags | Current description |',
  '| --- | --- | --- | --- | --- | --- |',
  ...flagged.sort((a, b) => `${a.world}/${a.id}`.localeCompare(`${b.world}/${b.id}`)).map(row =>
    `| ${row.world} | \`${row.id}\` | ${row.family} | \`${row.origin}\` | ${row.findings.join('; ')} | ${row.description.replaceAll('|', '\\|').replaceAll('\n', ' ')} |`),
  '',
].join('\n');

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(reportPath, report);
  console.log(`Description lint: ${rows.length} descriptions, ${flagged.length} flagged, ${missingDescriptions.length} missing fields inventoried, ${statusLabels.length} status labels in player strings; source sha256 ${sourceSha256}`);
  console.log(`Wrote ${relative(root, reportPath)}`);
}
