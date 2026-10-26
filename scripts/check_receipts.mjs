#!/usr/bin/env node
// Lint dated dispatch receipts for their evidence front matter.
import {readdirSync, readFileSync} from 'node:fs';
import {dirname, join, resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dispatchRoot = join(root, 'docs/gm/dispatch');
const states = new Set(['drafted', 'source-spot-checked', 'rules-reconciled', 'built', 'browser-verified', 'director-accepted']);

export function lintReceipt(file, text) {
  const failures = [];
  const lines = text.split(/\r?\n/);
  // The block is an explicit fenced block headed "Receipt" or "Receipt front matter".
  const start = lines.findIndex(line => /^```(?:receipt|receipt-front-matter)\s*$/i.test(line.trim()));
  if (start < 0) return [{file, line: 1, reason: 'missing fenced receipt block (```receipt)'}];
  let end = lines.findIndex((line, i) => i > start && /^```\s*$/.test(line.trim()));
  if (end < 0) return [{file, line: start + 1, reason: 'unclosed receipt block'}];
  const values = new Map();
  for (let i = start + 1; i < end; i++) {
    const m = /^\s*(build|route|state|viewport|persistence|tests|review|surface):\s*(.*?)\s*$/.exec(lines[i]);
    if (!m) continue;
    const [, key, value] = m;
    if (!values.has(key)) values.set(key, {value, line: i + 1});
    else failures.push({file, line: i + 1, reason: `duplicate ${key}: field`});
  }
  const required = ['build', 'route', 'state', 'viewport', 'persistence', 'tests', 'review'];
  for (const key of required) if (!values.has(key)) failures.push({file, line: start + 1, reason: `missing ${key}: field in receipt block`});
  const check = (key, predicate, reason) => {
    const entry = values.get(key);
    if (entry && !predicate(entry.value)) failures.push({file, line: entry.line, reason});
  };
  check('build', value => value === 'n/a' || /^[a-f\d]{64}$/i.test(value), 'build must be a 64-character SHA-256 or n/a');
  check('route', value => ['natural', 'n/a'].includes(value) || /^fixture\([^)]+\)$/.test(value), 'route must be natural, fixture(name), or n/a for non-gameplay work');
  check('state', value => states.has(value), `state must be one of ${[...states].join(', ')}`);
  check('viewport', value => value.length > 0, 'viewport must not be empty');
  check('persistence', value => ['checked', 'unchanged', 'n/a'].includes(value), 'persistence must be checked, unchanged or n/a');
  check('tests', value => value.length > 0, 'tests must not be empty');
  check('review', value => ['none', 'diff-scoped', 'landing'].includes(value), 'review must be none, diff-scoped or landing');
  const state = values.get('state')?.value;
  const build = values.get('build');
  if (['browser-verified', 'director-accepted'].includes(state) && build && !/^[a-f\d]{64}$/i.test(build.value)) {
    failures.push({file, line: build.line, reason: `${state} requires a real build SHA-256`});
  }
  if (['browser-verified', 'director-accepted'].includes(state) && values.get('route')?.value === 'n/a') {
    failures.push({file, line: values.get('route').line, reason: `${state} requires a natural or fixture route`});
  }
  return failures;
}

function findReceipts(dir) {
  const found = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...findReceipts(path));
    else if (entry.isFile() && ['CHECKPOINT.md', 'RECEIPT.md'].includes(entry.name)) found.push(path);
  }
  return found;
}

export function selectReceipts(paths, legacyPaths, readText, explicit = false) {
  // Fixed pre-adoption path inventory, rather than a date guess that silently
  // skips today's or nested new receipts. Explicit files bypass grandfathering.
  return paths.filter(file => explicit || !legacyPaths.has(file) || /^```(?:receipt|receipt-front-matter)\s*$/im.test(readText(file)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && (args[0] !== '--files' || args.length < 2)) throw new Error('Usage: check_receipts.mjs [--files <path> ...]');
  const legacyPaths = new Set(JSON.parse(readFileSync(join(root, 'scripts/receipt_legacy_paths.json'), 'utf8')).paths);
  const paths = args.length ? args.slice(1).map(file => relative(root, resolve(file))) : findReceipts(dispatchRoot).map(file => relative(root, file));
  const candidates = selectReceipts(paths, legacyPaths, file => readFileSync(join(root, file), 'utf8'), args.length > 0);
  const failures = candidates.flatMap(file => lintReceipt(relative(root, file), readFileSync(file, 'utf8')));
  for (const failure of failures) console.error(`${failure.file}:${failure.line}: ${failure.reason}`);
  console.log(`${failures.length ? 'FAIL' : 'PASS'} (${candidates.length} receipts checked, ${paths.length - candidates.length} explicit legacy paths skipped, ${failures.length} problems)`);
  process.exit(failures.length ? 1 : 0);
}
