#!/usr/bin/env node
// Lint added Markdown lines for absolute design rules and unsupported acceptance claims.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(execFileSync('git', ['rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim());
const args = process.argv.slice(2);
let base;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--base' && args[i + 1]) base = args[++i];
  else { console.error(`unknown argument: ${args[i]}`); process.exit(2); }
}

const filespec = ['--', 'docs', 'PROJECT.md', 'AGENTS.md'];
const runDiff = (cached) => {
  const command = ['diff', ...(cached ? ['--cached'] : []), '--no-ext-diff', '--unified=0'];
  if (base) command.push(base);
  return execFileSync('git', [...command, ...filespec], {cwd: root, encoding: 'utf8'});
};
const diffs = [runDiff(false), runDiff(true)];
const additions = new Map();
for (const diff of diffs) {
  let file = '';
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ b/')) { file = line.slice(6); continue; }
    if (!line.startsWith('@@')) continue;
    const m = /\+(\d+)(?:,(\d+))?/.exec(line);
    if (!m) continue;
    const [, start, rawCount] = m;
    const count = +(rawCount ?? 1);
    for (let offset = 0; offset < count; offset++) {
      const lineNo = +start + offset;
      const key = `${file}:${lineNo}`;
      additions.set(key, {file, lineNo});
    }
  }
}
// New files have no Git diff until staged. Include them so a new rule document
// cannot bypass the diagnostic simply by remaining untracked.
const newFiles = execFileSync('git', ['ls-files', '--others', '--exclude-standard', ...filespec], {cwd: root, encoding: 'utf8'}).trim().split('\n').filter(Boolean);
for (const file of newFiles) {
  if (!file.endsWith('.md')) continue;
  const lines = readFileSync(resolve(root, file), 'utf8').split('\n');
  lines.forEach((_, index) => additions.set(`${file}:${index + 1}`, {file, lineNo: index + 1}));
}

const abs = /\b(?:never|always|only)\b/i;
const defaultDialReason = /\b(?:default|dial|unless|reason)\b/i;
const accepted = /\baccepted\b/i;
const acceptanceEvidence = /(?:USER_VISION|PROJECT)\.md|\bAD\d+\b|"[^"]+"|“[^”]+”/i;
const silenced = /<!--\s*slip-ok:\s*[^>]+-->/i;
const hits = [];
const lineCache = new Map();

function contentOf(file) {
  if (!lineCache.has(file)) {
    try { lineCache.set(file, readFileSync(resolve(root, file), 'utf8').split('\n')); }
    catch { lineCache.set(file, []); }
  }
  return lineCache.get(file);
}
function fenceAt(lines, lineNo) {
  let fence = '';
  for (let i = 0; i < lineNo; i++) {
    const m = /^\s*(`{3,}|~{3,})/.exec(lines[i] ?? '');
    if (!m) continue;
    if (!fence) fence = m[1][0];
    else if (m[1][0] === fence) fence = '';
  }
  return Boolean(fence);
}
function paragraphAt(lines, lineNo) {
  let from = lineNo - 1, to = lineNo;
  const boundary = line => !line?.trim() || /^\s*>/.test(line) || /^\s*(?:[-*+]\s+|\d+[.)]\s+|\|)/.test(line) || /^\s*(`{3,}|~{3,})/.test(line);
  while (from > 0 && !boundary(lines[from - 1])) from--;
  while (to < lines.length && !boundary(lines[to])) to++;
  return lines.slice(from, to).join(' ');
}
function report(file, lineNo, reason) { hits.push(`${file}:${lineNo}: ${reason}`); }

for (const {file, lineNo} of additions.values()) {
  if (!/^(?:docs\/.*\.md|PROJECT\.md|AGENTS\.md)$/.test(file)) continue;
  const lines = contentOf(file), text = lines[lineNo - 1] ?? '';
  if (fenceAt(lines, lineNo - 1) || /^\s*>/.test(text) || silenced.test(text)) continue;
  const tableRow = /^\s*\|.*\|/.test(text);
  const bulletOrNumber = /^\s*(?:[-*+]\s+|\d+[.)]\s+)/.test(text);
  if ((tableRow || bulletOrNumber) && abs.test(text) && !defaultDialReason.test(tableRow ? text : paragraphAt(lines, lineNo))) {
    report(file, lineNo, 'absolute rule word has no default, dial, exception, or reason in this row or paragraph');
  }
  const negatedAccepted = /\bnot\s+accepted\b|\bunaccepted\b/i.test(text);
  const headingReference = /accepted decisions/i.test(text);
  if (accepted.test(text) && !negatedAccepted && !headingReference && !acceptanceEvidence.test(text)) {
    report(file, lineNo, 'acceptance claim needs a USER_VISION.md or PROJECT.md link, AD code, or quoted text on this line');
  }
}

for (const hit of hits) console.error(hit);
if (hits.length) process.exit(1);
console.log('Doc slip check: no new hits');
