#!/usr/bin/env node
// Warns when a lasting-direction change lands without its companions (AGENTS.md "Standing direction"):
// a dated heading added to docs/USER_VISION.md needs docs/VISION_DIGEST.md in the same change, and
// lines removed from PROJECT.md need a dated entry in a docs/gm/PROJECT_LOG*.md file.
// Run: node scripts/check_direction_sync.mjs [--range A..B] [--root DIR] [--strict]
// Default compares the working tree and index with HEAD. Warnings only unless --strict.
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

const args = process.argv.slice(2), opt = n => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const root = resolve(opt('--root') || execFileSync('git', ['rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim());
const range = opt('--range'), strict = args.includes('--strict');
const git = (...a) => execFileSync('git', ['-C', root, ...a], {encoding: 'utf8'});
const spec = ['--', 'docs/USER_VISION.md', 'docs/VISION_DIGEST.md', 'PROJECT.md', 'docs/gm'];
const diff = git('diff', '--no-ext-diff', '--unified=0', ...(range ? [range] : ['HEAD']), ...spec);

const files = new Map();
let file = '';
for (const line of diff.split('\n')) {
  if (line.startsWith('+++ b/')) { file = line.slice(6); files.set(file, {added: [], removed: []}); continue; }
  if (line.startsWith('--- ') || !file) continue;
  if (line.startsWith('+') && files.get(file)) files.get(file).added.push(line.slice(1));
  else if (line.startsWith('-') && files.get(file)) files.get(file).removed.push(line.slice(1));
}
const touched = p => files.has(p);
const warnings = [];
const datedHeads = (files.get('docs/USER_VISION.md')?.added || []).filter(l => /^## .*\(?20\d\d-\d\d-\d\d\)?/.test(l));
if (datedHeads.length && !touched('docs/VISION_DIGEST.md')) warnings.push(`USER_VISION gained ${datedHeads.length} dated heading(s) (${datedHeads[0].slice(0, 70)}...) but VISION_DIGEST.md is not in this change`);
const removed = (files.get('PROJECT.md')?.removed || []).filter(l => l.trim());
const loggedLog = [...files.keys()].some(f => /^docs\/gm\/PROJECT_LOG[^/]*\.md$/.test(f));
if (removed.length && !loggedLog) warnings.push(`PROJECT.md lost ${removed.length} line(s) but no docs/gm/PROJECT_LOG*.md entry is in this change`);

for (const w of warnings) console.log(`WARN  direction sync: ${w}`);
console.log(warnings.length ? `${warnings.length} warning(s)${strict ? ', failing (--strict)' : ''}` : 'PASS direction sync');
process.exit(strict && warnings.length ? 1 : 0);
