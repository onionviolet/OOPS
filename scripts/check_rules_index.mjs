#!/usr/bin/env node
// Keeps docs/RULES_INDEX.md honest: register coverage, code ranges, AD
// contiguity, cited codes and relative links/anchors. Run: npm run check:rules
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, resolve, relative} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = resolve(root, 'docs');
const indexPath = resolve(docs, 'RULES_INDEX.md');
const failures = [], warnings = [];
const fail = m => failures.push(m), warn = m => warnings.push(m);
const read = p => readFileSync(p, 'utf8');
const index = read(indexPath);
const rel = p => relative(root, p);

const sectionOf = (text, title) => {
  const m = new RegExp(`^## ${title}[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(text);
  return m ? m[1] : '';
};
const rows = section => section.split('\n').filter(l => /^\|/.test(l) && !/^\|[-| ]+\|$/.test(l)).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
const links = text => [...text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(m => m[1]);

// Codes defined as a table row ("| UR12 |"), a bullet ("- **UR18.**") or a bold lead ("**UR47.").
const definedCodes = (text, prefix) => {
  const out = new Set();
  for (const m of text.matchAll(new RegExp(`^(?:\\|\\s*|[-*]\\s+\\*\\*|\\*\\*)(${prefix})(\\d+)(?:\\s*\\||\\.)`, 'gm'))) out.add(+m[2]);
  return out;
};

// 1. Register coverage.
const register = rows(sectionOf(index, 'Register of rule sets')).slice(1);
const registered = new Set();
for (const r of register) for (const l of links(r[4] || '')) registered.add(resolve(docs, l.split('#')[0]));
const ruleFiles = readdirSync(docs).filter(f => /_RULES(_|\.)|^(UI|MAKING|ARCHITECTURE)_RULES|RULES_\d{4}/.test(f) && f.endsWith('.md') && !/^RULES_(INDEX|FROM_SCRATCH)\.md$/.test(f));
for (const f of ruleFiles) {
  if (!registered.has(resolve(docs, f))) fail(`rulebook docs/${f} has no row in the Register of rule sets`);
}

// 2. Registered ranges vs highest defined code.
const adDefined = definedCodes(sectionOf(index, 'Accepted direction rules \\(AD\\)').replace(/^### .*$/gm, ''), 'AD');
const defined = {AD: adDefined};
for (const r of register) {
  const m = /^([A-Z]{2})(\d+)[–-]\1(\d+)$/.exec(r[1]);
  if (!m) continue;
  const [, prefix, lo, hi] = m;
  if (prefix === 'AD') {
    const nums = [...adDefined].sort((a, b) => a - b);
    if (+hi !== nums.at(-1)) fail(`register says AD${lo}–AD${hi}, highest AD defined is AD${nums.at(-1)}`);
    continue;
  }
  const ownerLink = links(r[4] || '').find(l => !/^(https?:|#)/.test(l));
  const file = ownerLink && resolve(docs, ownerLink.split('#')[0]);
  if (!file || !existsSync(file)) { warn(`${prefix}: owner file not found, range not checked`); continue; }
  const codes = definedCodes(read(file), prefix);
  defined[prefix] = codes;
  if (!codes.size) { warn(`${prefix}${lo}–${prefix}${hi}: no ${prefix}n definitions in ${rel(file)}, range not checked`); continue; }
  const max = Math.max(...codes);
  if (max !== +hi) fail(`register says ${prefix}${lo}–${prefix}${hi}, highest in ${rel(file)} is ${prefix}${max}`);
  const missing = [...Array(max)].map((_, i) => i + 1).filter(n => !codes.has(n));
  if (missing.length) warn(`${prefix}: no definition for ${missing.map(n => prefix + n).join(', ')} in ${rel(file)}`);
}

// 3. AD contiguity/uniqueness, and cited codes exist.
const adAll = [...sectionOf(index, 'Accepted direction rules \\(AD\\)').matchAll(/^\|\s*AD(\d+)\s*\|/gm)].map(m => +m[1]);
if (new Set(adAll).size !== adAll.length) fail(`duplicate AD codes: ${adAll.filter((n, i) => adAll.indexOf(n) !== i).map(n => 'AD' + n).join(', ')}`);
adAll.forEach((n, i) => { if (n !== i + 1) fail(`AD codes not contiguous at position ${i + 1}: found AD${n}`); });

const citationSections = ['Router: what applies to my task', 'Shared principles across rulebooks'];
for (const title of citationSections) {
  const text = sectionOf(index, title.replace(/[()]/g, '\\$&'));
  for (const m of text.matchAll(/\b(AD|UR|MR|SR|AR|GR)(\d+)(?:[–-](?:\1)?(\d+))?/g)) {
    const [, prefix, a, b] = m;
    const set = defined[prefix] || (prefix === 'GR' ? (defined.GR = definedCodes(read(resolve(docs, 'GENERATION_FOUNDATION_RULES_2026-10-14.md')), 'GR')) : null);
    if (!set) { warn(`cannot verify ${prefix} citations`); continue; }
    for (let n = +a; n <= +(b || a); n++) if (!set.has(n)) fail(`${title}: cites ${prefix}${n}, which is not defined`);
  }
}

// 4. Links and anchors.
const slug = h => h.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, '').toLowerCase().trim()
  .replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
const anchorCache = new Map();
const anchorsOf = file => {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const seen = new Map(), set = new Set();
  let fence = false;
  for (const line of read(file).split('\n')) {
    if (/^\s*```/.test(line)) fence = !fence;
    const m = !fence && /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const s = slug(m[1]), n = seen.get(s) || 0;
    seen.set(s, n + 1);
    set.add(n ? `${s}-${n}` : s);
  }
  anchorCache.set(file, set);
  return set;
};
const tracked = new Map();
const isTracked = file => {
  if (!tracked.has(file)) {
    try { execFileSync('git', ['ls-files', '--error-unmatch', '--', file], {cwd: root, stdio: 'ignore'}); tracked.set(file, true); } catch { tracked.set(file, false); }
  }
  return tracked.get(file);
};
let linkCount = 0;
for (const l of new Set(links(index))) {
  if (/^[a-z]+:/i.test(l)) continue;
  linkCount++;
  const [path, anchor] = l.split('#');
  const file = path ? resolve(docs, path) : indexPath;
  if (!existsSync(file)) { fail(`broken link: ${l}`); continue; }
  if (path && !isTracked(file)) warn(`linked file exists but is not tracked by git: ${rel(file)}`);
  if (anchor && statSync(file).isFile() && file.endsWith('.md') && !anchorsOf(file).has(decodeURIComponent(anchor).toLowerCase())) fail(`broken anchor: ${l}`);
}

console.log(`Rules index check: ${register.length} register rows, ${adAll.length} AD codes, ${linkCount} relative links`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const f of failures) console.log(`  FAIL  ${f}`);
console.log(failures.length ? `FAIL (${failures.length} problems, ${warnings.length} warnings)` : `PASS (${warnings.length} warnings)`);
process.exit(failures.length ? 1 : 0);
